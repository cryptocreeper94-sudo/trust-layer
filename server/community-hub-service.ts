import { db } from "./db";
import { eq, desc, and, sql } from "drizzle-orm";
import {
  communities,
  communityChannels,
  communityMembers,
  communityMessages,
  communityBots,
  type Community,
  type CommunityChannel,
  type CommunityMember,
  type CommunityMessage,
  type InsertCommunity,
  type InsertChannel,
  type InsertCommunityMessage,
} from "@shared/schema";
import crypto from "crypto";

export class CommunityHubService {
  async createCommunity(data: InsertCommunity): Promise<Community> {
    const [community] = await db.insert(communities).values(data).returning();
    
    await db.insert(communityChannels).values({
      communityId: community.id,
      name: "general",
      description: "General discussion",
      type: "chat",
      position: 0,
    });
    
    await db.insert(communityChannels).values({
      communityId: community.id,
      name: "announcements",
      description: "Official announcements",
      type: "announcement",
      position: 1,
      isLocked: true,
    });
    
    await db.insert(communityMembers).values({
      communityId: community.id,
      userId: data.ownerId,
      username: "Owner",
      role: "owner",
    });
    
    await db.update(communities)
      .set({ memberCount: 1 })
      .where(eq(communities.id, community.id));
    
    return community;
  }
  
  async getCommunities(): Promise<Community[]> {
    return db.select()
      .from(communities)
      .where(eq(communities.isPublic, true))
      .orderBy(desc(communities.memberCount));
  }
  
  async getCommunity(id: string): Promise<Community | undefined> {
    const [community] = await db.select()
      .from(communities)
      .where(eq(communities.id, id));
    return community;
  }
  
  async getUserCommunities(userId: string): Promise<Community[]> {
    const memberships = await db.select({ communityId: communityMembers.communityId })
      .from(communityMembers)
      .where(eq(communityMembers.userId, userId));
    
    if (memberships.length === 0) return [];
    
    return db.select()
      .from(communities)
      .where(sql`${communities.id} IN (${sql.join(memberships.map(m => sql`${m.communityId}`), sql`, `)})`);
  }
  
  async getChannels(communityId: string): Promise<CommunityChannel[]> {
    return db.select()
      .from(communityChannels)
      .where(eq(communityChannels.communityId, communityId))
      .orderBy(communityChannels.position);
  }
  
  async createChannel(data: InsertChannel): Promise<CommunityChannel> {
    const [channel] = await db.insert(communityChannels).values(data).returning();
    return channel;
  }
  
  async joinCommunity(communityId: string, userId: string, username: string): Promise<CommunityMember> {
    const existing = await db.select()
      .from(communityMembers)
      .where(and(
        eq(communityMembers.communityId, communityId),
        eq(communityMembers.userId, userId)
      ));
    
    if (existing.length > 0) return existing[0];
    
    const [member] = await db.insert(communityMembers).values({
      communityId,
      userId,
      username,
      role: "member",
    }).returning();
    
    await db.update(communities)
      .set({ memberCount: sql`${communities.memberCount} + 1` })
      .where(eq(communities.id, communityId));
    
    return member;
  }
  
  async leaveCommunity(communityId: string, userId: string): Promise<void> {
    await db.delete(communityMembers)
      .where(and(
        eq(communityMembers.communityId, communityId),
        eq(communityMembers.userId, userId)
      ));
    
    await db.update(communities)
      .set({ memberCount: sql`${communities.memberCount} - 1` })
      .where(eq(communities.id, communityId));
  }
  
  async getMembers(communityId: string): Promise<CommunityMember[]> {
    return db.select()
      .from(communityMembers)
      .where(eq(communityMembers.communityId, communityId))
      .orderBy(desc(communityMembers.isOnline));
  }
  
  async getMember(communityId: string, userId: string): Promise<CommunityMember | undefined> {
    const [member] = await db.select()
      .from(communityMembers)
      .where(and(
        eq(communityMembers.communityId, communityId),
        eq(communityMembers.userId, userId)
      ));
    return member;
  }
  
  async updateMemberOnline(communityId: string, userId: string, isOnline: boolean): Promise<void> {
    await db.update(communityMembers)
      .set({ isOnline, lastSeenAt: new Date() })
      .where(and(
        eq(communityMembers.communityId, communityId),
        eq(communityMembers.userId, userId)
      ));
  }
  
  async sendMessage(data: InsertCommunityMessage): Promise<CommunityMessage> {
    const [message] = await db.insert(communityMessages).values(data).returning();
    return message;
  }
  
  async getMessages(channelId: string, limit = 50): Promise<CommunityMessage[]> {
    return db.select()
      .from(communityMessages)
      .where(eq(communityMessages.channelId, channelId))
      .orderBy(desc(communityMessages.createdAt))
      .limit(limit);
  }
  
  async deleteMessage(messageId: string, userId: string): Promise<boolean> {
    const [message] = await db.select()
      .from(communityMessages)
      .where(eq(communityMessages.id, messageId));
    
    if (!message || message.userId !== userId) return false;
    
    await db.delete(communityMessages).where(eq(communityMessages.id, messageId));
    return true;
  }
  
  async createBot(communityId: string, name: string, description: string): Promise<{ id: string; apiKey: string }> {
    const apiKey = `dwc_bot_${crypto.randomBytes(32).toString("hex")}`;
    
    const [bot] = await db.insert(communityBots).values({
      communityId,
      name,
      description,
      apiKey,
    }).returning();
    
    return { id: bot.id, apiKey };
  }
  
  async getBots(communityId: string) {
    return db.select({
      id: communityBots.id,
      name: communityBots.name,
      description: communityBots.description,
      icon: communityBots.icon,
      isActive: communityBots.isActive,
      createdAt: communityBots.createdAt,
    })
      .from(communityBots)
      .where(eq(communityBots.communityId, communityId));
  }
  
  async sendBotMessage(apiKey: string, channelId: string, content: string): Promise<CommunityMessage | null> {
    const [bot] = await db.select()
      .from(communityBots)
      .where(eq(communityBots.apiKey, apiKey));
    
    if (!bot || !bot.isActive) return null;
    
    const [message] = await db.insert(communityMessages).values({
      channelId,
      userId: `bot_${bot.id}`,
      username: bot.name,
      content,
      isBot: true,
    }).returning();
    
    return message;
  }
}

export const communityHubService = new CommunityHubService();
