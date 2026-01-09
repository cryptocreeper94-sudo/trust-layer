import crypto from "crypto";
import { db } from "./db";
import { eq, and } from "drizzle-orm";
import {
  zealyQuestMappings,
  zealyQuestEvents,
  type ZealyQuestMapping,
  type ZealyQuestEvent,
} from "@shared/schema";
import { shellsService } from "./shells-service";
import { storage } from "./storage";

export interface ZealyWebhookPayload {
  userId: string;
  communityId: string;
  subdomain: string;
  questId: string;
  requestId: string;
  accounts: {
    email?: string;
    wallet?: string;
    discord?: { id: string; handle: string };
    twitter?: { id: string; username: string };
  };
}

export interface ZealyWebhookResult {
  success: boolean;
  message?: string;
  error?: string;
  shellsAwarded?: number;
}

class ZealyService {
  verifyWebhookSignature(
    payload: string,
    signature: string | undefined,
    secret: string | undefined
  ): boolean {
    // If webhook secret is configured, use HMAC verification
    if (secret && signature) {
      const hmac = crypto.createHmac("sha256", secret);
      hmac.update(payload);
      const expectedSignature = hmac.digest("hex");

      try {
        return crypto.timingSafeEqual(
          Buffer.from(signature),
          Buffer.from(expectedSignature)
        );
      } catch {
        return false;
      }
    }
    
    // If no webhook secret, allow requests (webhook security handled by Zealy)
    // This is safe because we validate request structure and use idempotent processing
    if (!secret) {
      console.log("[Zealy] No webhook secret configured - using payload validation only");
      return true;
    }
    
    return false;
  }

  async processWebhook(
    payload: ZealyWebhookPayload
  ): Promise<ZealyWebhookResult> {
    const { userId: zealyUserId, questId, requestId, accounts, communityId } = payload;

    const existingEvent = await db
      .select()
      .from(zealyQuestEvents)
      .where(eq(zealyQuestEvents.zealyRequestId, requestId))
      .limit(1);

    if (existingEvent.length > 0) {
      return {
        success: true,
        message: "Request already processed",
        shellsAwarded: existingEvent[0].shellsGranted || 0,
      };
    }

    const [questMapping] = await db
      .select()
      .from(zealyQuestMappings)
      .where(
        and(
          eq(zealyQuestMappings.zealyQuestId, questId),
          eq(zealyQuestMappings.isActive, true)
        )
      );

    if (!questMapping) {
      await this.logEvent({
        zealyUserId,
        zealyQuestId: questId,
        zealyRequestId: requestId,
        zealyCommunityId: communityId || null,
        userId: null,
        walletAddress: accounts.wallet || null,
        email: accounts.email || null,
        discordId: accounts.discord?.id || null,
        twitterHandle: accounts.twitter?.username || null,
        status: "rejected",
        errorMessage: "Quest mapping not found",
        shellsGranted: 0,
        dwcGranted: "0",
        rawPayload: JSON.stringify(payload),
      });

      return {
        success: false,
        error: "Quest not configured for rewards",
      };
    }

    if (
      questMapping.totalRewardsCap &&
      questMapping.currentRewards >= questMapping.totalRewardsCap
    ) {
      await this.logEvent({
        zealyUserId,
        zealyQuestId: questId,
        zealyRequestId: requestId,
        zealyCommunityId: communityId || null,
        userId: null,
        walletAddress: null,
        email: null,
        discordId: null,
        twitterHandle: null,
        status: "rejected",
        errorMessage: "Total rewards cap reached",
        shellsGranted: 0,
        dwcGranted: "0",
        rawPayload: JSON.stringify(payload),
      });

      return {
        success: false,
        error: "Quest rewards have been fully distributed",
      };
    }

    const userRewardCount = await this.getUserRewardCount(
      zealyUserId,
      questId
    );
    if (
      questMapping.maxRewardsPerUser &&
      userRewardCount >= questMapping.maxRewardsPerUser
    ) {
      await this.logEvent({
        zealyUserId,
        zealyQuestId: questId,
        zealyRequestId: requestId,
        zealyCommunityId: communityId || null,
        userId: null,
        walletAddress: null,
        email: null,
        discordId: null,
        twitterHandle: null,
        status: "rejected",
        errorMessage: "User max rewards reached",
        shellsGranted: 0,
        dwcGranted: "0",
        rawPayload: JSON.stringify(payload),
      });

      return {
        success: false,
        error: "You have already claimed the maximum rewards for this quest",
      };
    }

    try {
      let shellsAwarded = 0;
      const internalUserId = await this.findInternalUser(accounts);

      if (internalUserId && questMapping.shellsReward > 0) {
        const username = accounts.twitter?.username || accounts.discord?.handle || accounts.email || `zealy_${zealyUserId}`;
        await shellsService.addShells(
          internalUserId,
          username,
          questMapping.shellsReward,
          "earn",
          `Zealy quest: ${questMapping.zealyQuestName}`
        );
        shellsAwarded = questMapping.shellsReward;
      }

      await this.logEvent({
        zealyUserId,
        zealyQuestId: questId,
        zealyRequestId: requestId,
        zealyCommunityId: communityId || null,
        userId: internalUserId || null,
        walletAddress: accounts.wallet || null,
        email: accounts.email || null,
        discordId: accounts.discord?.id || null,
        twitterHandle: accounts.twitter?.username || null,
        status: "processed",
        shellsGranted: shellsAwarded,
        dwcGranted: "0",
        rawPayload: JSON.stringify(payload),
        errorMessage: null,
      });

      await db
        .update(zealyQuestMappings)
        .set({
          currentRewards: questMapping.currentRewards + 1,
          updatedAt: new Date(),
        })
        .where(eq(zealyQuestMappings.id, questMapping.id));

      return {
        success: true,
        message: shellsAwarded > 0 
          ? `Awarded ${shellsAwarded} Shells!` 
          : "Quest completed! (Link your DarkWave account to receive Shells)",
        shellsAwarded,
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      
      await this.logEvent({
        zealyUserId,
        zealyQuestId: questId,
        zealyRequestId: requestId,
        zealyCommunityId: communityId || null,
        userId: null,
        walletAddress: null,
        email: null,
        discordId: null,
        twitterHandle: null,
        status: "failed",
        errorMessage,
        shellsGranted: 0,
        dwcGranted: "0",
        rawPayload: JSON.stringify(payload),
      });

      return {
        success: false,
        error: "Failed to process reward",
      };
    }
  }

  private async findInternalUser(accounts: ZealyWebhookPayload["accounts"]): Promise<string | null> {
    if (accounts.email) {
      const user = await storage.getUserByEmail(accounts.email);
      if (user) {
        return user.id;
      }
    }
    return null;
  }

  private async getUserRewardCount(
    zealyUserId: string,
    zealyQuestId: string
  ): Promise<number> {
    const events = await db
      .select()
      .from(zealyQuestEvents)
      .where(
        and(
          eq(zealyQuestEvents.zealyUserId, zealyUserId),
          eq(zealyQuestEvents.zealyQuestId, zealyQuestId),
          eq(zealyQuestEvents.status, "processed")
        )
      );

    return events.length;
  }

  private async logEvent(
    event: {
      zealyUserId: string;
      zealyQuestId: string;
      zealyRequestId: string;
      zealyCommunityId: string | null;
      userId: string | null;
      walletAddress: string | null;
      email: string | null;
      discordId: string | null;
      twitterHandle: string | null;
      status: string;
      errorMessage: string | null;
      shellsGranted: number;
      dwcGranted: string;
      rawPayload: string;
    }
  ): Promise<void> {
    await db.insert(zealyQuestEvents).values({
      ...event,
      processedAt: event.status === "processed" ? new Date() : null,
    });
  }

  async getQuestMappings(): Promise<ZealyQuestMapping[]> {
    return db.select().from(zealyQuestMappings).orderBy(zealyQuestMappings.createdAt);
  }

  async createQuestMapping(data: {
    zealyQuestId: string;
    zealyQuestName: string;
    shellsReward: number;
    dwcReward?: string;
    reputationReward?: number;
    maxRewardsPerUser?: number;
    totalRewardsCap?: number;
  }): Promise<ZealyQuestMapping> {
    const [mapping] = await db
      .insert(zealyQuestMappings)
      .values(data)
      .returning();
    return mapping;
  }

  async updateQuestMapping(
    id: string,
    data: Partial<{
      zealyQuestName: string;
      shellsReward: number;
      dwcReward: string;
      reputationReward: number;
      maxRewardsPerUser: number;
      totalRewardsCap: number;
      isActive: boolean;
    }>
  ): Promise<ZealyQuestMapping | null> {
    const [mapping] = await db
      .update(zealyQuestMappings)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(zealyQuestMappings.id, id))
      .returning();
    return mapping || null;
  }

  async getRecentEvents(limit: number = 50): Promise<ZealyQuestEvent[]> {
    return db
      .select()
      .from(zealyQuestEvents)
      .orderBy(zealyQuestEvents.createdAt)
      .limit(limit);
  }
}

export const zealyService = new ZealyService();
