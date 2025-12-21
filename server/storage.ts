import { type User, type InsertUser, type Document, type InsertDocument, type InsertPageView, type PageView, type AnalyticsOverview, type ApiKey, type InsertApiKey, type TransactionHash, type InsertTransactionHash, type DualChainStamp, type InsertDualChainStamp, type Hallmark, type InsertHallmark, type Waitlist, type InsertWaitlist, users, documents, pageViews, apiKeys, transactionHashes, dualChainStamps, hallmarks, hallmarkCounter, waitlist } from "@shared/schema";
import { db } from "./db";
import { eq, sql, desc, count } from "drizzle-orm";
import crypto from "crypto";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  getDocuments(): Promise<Document[]>;
  getDocument(id: string): Promise<Document | undefined>;
  getDocumentsByCategory(category: string): Promise<Document[]>;
  getDocumentsByAppId(appId: string): Promise<Document[]>;
  createDocument(doc: InsertDocument): Promise<Document>;
  updateDocument(id: string, doc: Partial<InsertDocument>): Promise<Document | undefined>;
  deleteDocument(id: string): Promise<boolean>;

  recordPageView(view: InsertPageView): Promise<PageView>;
  getAnalyticsOverview(): Promise<AnalyticsOverview>;

  createApiKey(data: Omit<InsertApiKey, "keyHash">, rawKey: string): Promise<{ apiKey: ApiKey; rawKey: string }>;
  getApiKeyByHash(keyHash: string): Promise<ApiKey | undefined>;
  validateApiKey(rawKey: string): Promise<ApiKey | undefined>;
  updateApiKeyLastUsed(id: string): Promise<void>;
  getApiKeysByEmail(email: string): Promise<ApiKey[]>;
  revokeApiKey(id: string): Promise<boolean>;

  recordTransactionHash(data: InsertTransactionHash): Promise<TransactionHash>;
  getTransactionHashByTxHash(txHash: string): Promise<TransactionHash | undefined>;
  getTransactionHashesByApiKey(apiKeyId: string): Promise<TransactionHash[]>;
  getRecentTransactions(limit: number): Promise<TransactionHash[]>;
  updateTransactionStatus(txHash: string, status: string, blockHeight?: string): Promise<TransactionHash | undefined>;

  recordDualChainStamp(data: InsertDualChainStamp): Promise<DualChainStamp>;
  getDualChainStamp(id: string): Promise<DualChainStamp | undefined>;
  getDualChainStampsByApp(appId: string): Promise<DualChainStamp[]>;
  updateDualChainStamp(id: string, data: Partial<InsertDualChainStamp>): Promise<DualChainStamp | undefined>;

  createHallmark(data: InsertHallmark): Promise<Hallmark>;
  getHallmark(hallmarkId: string): Promise<Hallmark | undefined>;
  getHallmarksByApp(appId: string): Promise<Hallmark[]>;
  getAllHallmarks(limit?: number): Promise<Hallmark[]>;
  updateHallmark(hallmarkId: string, data: Partial<InsertHallmark>): Promise<Hallmark | undefined>;
  verifyHallmark(hallmarkId: string): Promise<{ valid: boolean; hallmark?: Hallmark }>;
  getNextMasterSequence(): Promise<string>;

  addToWaitlist(data: InsertWaitlist): Promise<Waitlist>;
  getWaitlistByEmail(email: string): Promise<Waitlist | undefined>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async getDocuments(): Promise<Document[]> {
    return db.select().from(documents).orderBy(documents.updatedAt);
  }

  async getDocument(id: string): Promise<Document | undefined> {
    const [doc] = await db.select().from(documents).where(eq(documents.id, id));
    return doc;
  }

  async getDocumentsByCategory(category: string): Promise<Document[]> {
    return db.select().from(documents).where(eq(documents.category, category));
  }

  async getDocumentsByAppId(appId: string): Promise<Document[]> {
    return db.select().from(documents).where(eq(documents.appId, appId));
  }

  async createDocument(doc: InsertDocument): Promise<Document> {
    const [document] = await db.insert(documents).values(doc).returning();
    return document;
  }

  async updateDocument(id: string, doc: Partial<InsertDocument>): Promise<Document | undefined> {
    const [document] = await db
      .update(documents)
      .set({ ...doc, updatedAt: new Date() })
      .where(eq(documents.id, id))
      .returning();
    return document;
  }

  async deleteDocument(id: string): Promise<boolean> {
    const result = await db.delete(documents).where(eq(documents.id, id));
    return true;
  }

  async recordPageView(view: InsertPageView): Promise<PageView> {
    const [pageView] = await db.insert(pageViews).values(view).returning();
    return pageView;
  }

  async getAnalyticsOverview(): Promise<AnalyticsOverview> {
    const allViews = await db.select().from(pageViews);
    const today = new Date().toISOString().split('T')[0];
    
    const totalViews = allViews.length;
    const uniqueVisitors = new Set(allViews.map(v => v.visitorId)).size;
    const todayViews = allViews.filter(v => 
      v.timestamp.toISOString().split('T')[0] === today
    ).length;

    const pageCountMap = new Map<string, number>();
    allViews.forEach(v => {
      pageCountMap.set(v.pageSlug, (pageCountMap.get(v.pageSlug) || 0) + 1);
    });
    const topPages = Array.from(pageCountMap.entries())
      .map(([page, views]) => ({ page, views }))
      .sort((a, b) => b.views - a.views)
      .slice(0, 5);

    const referrerCountMap = new Map<string, number>();
    allViews.forEach(v => {
      if (v.referrer) {
        referrerCountMap.set(v.referrer, (referrerCountMap.get(v.referrer) || 0) + 1);
      }
    });
    const topReferrers = Array.from(referrerCountMap.entries())
      .map(([referrer, count]) => ({ referrer, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    const last7Days: string[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      last7Days.push(d.toISOString().split('T')[0]);
    }

    const dailyTrend = last7Days.map(date => {
      const dayViews = allViews.filter(v => 
        v.timestamp.toISOString().split('T')[0] === date
      );
      return {
        date,
        views: dayViews.length,
        unique: new Set(dayViews.map(v => v.visitorId)).size,
      };
    });

    return {
      totalViews,
      uniqueVisitors,
      todayViews,
      topPages,
      topReferrers,
      dailyTrend,
    };
  }

  private hashApiKey(rawKey: string): string {
    return crypto.createHash("sha256").update(rawKey).digest("hex");
  }

  async createApiKey(data: Omit<InsertApiKey, "keyHash">, rawKey: string): Promise<{ apiKey: ApiKey; rawKey: string }> {
    const keyHash = this.hashApiKey(rawKey);
    const [apiKey] = await db.insert(apiKeys).values({ ...data, keyHash }).returning();
    return { apiKey, rawKey };
  }

  async getApiKeyByHash(keyHash: string): Promise<ApiKey | undefined> {
    const [key] = await db.select().from(apiKeys).where(eq(apiKeys.keyHash, keyHash));
    return key;
  }

  async validateApiKey(rawKey: string): Promise<ApiKey | undefined> {
    const keyHash = this.hashApiKey(rawKey);
    const [key] = await db.select().from(apiKeys).where(eq(apiKeys.keyHash, keyHash));
    if (key && key.isActive) {
      await this.updateApiKeyLastUsed(key.id);
      return key;
    }
    return undefined;
  }

  async updateApiKeyLastUsed(id: string): Promise<void> {
    await db.update(apiKeys).set({ lastUsedAt: new Date() }).where(eq(apiKeys.id, id));
  }

  async getApiKeysByEmail(email: string): Promise<ApiKey[]> {
    return db.select().from(apiKeys).where(eq(apiKeys.email, email));
  }

  async revokeApiKey(id: string): Promise<boolean> {
    await db.update(apiKeys).set({ isActive: false }).where(eq(apiKeys.id, id));
    return true;
  }

  async recordTransactionHash(data: InsertTransactionHash): Promise<TransactionHash> {
    const [txHash] = await db.insert(transactionHashes).values(data).returning();
    return txHash;
  }

  async getTransactionHashByTxHash(txHash: string): Promise<TransactionHash | undefined> {
    const [tx] = await db.select().from(transactionHashes).where(eq(transactionHashes.txHash, txHash));
    return tx;
  }

  async getTransactionHashesByApiKey(apiKeyId: string): Promise<TransactionHash[]> {
    return db.select().from(transactionHashes).where(eq(transactionHashes.apiKeyId, apiKeyId)).orderBy(desc(transactionHashes.createdAt));
  }

  async getRecentTransactions(limit: number): Promise<TransactionHash[]> {
    return db.select().from(transactionHashes).orderBy(desc(transactionHashes.createdAt)).limit(limit);
  }

  async updateTransactionStatus(txHash: string, status: string, blockHeight?: string): Promise<TransactionHash | undefined> {
    const updates: Partial<TransactionHash> = { status };
    if (blockHeight) updates.blockHeight = blockHeight;
    if (status === "confirmed") updates.confirmedAt = new Date();
    
    const [tx] = await db.update(transactionHashes).set(updates).where(eq(transactionHashes.txHash, txHash)).returning();
    return tx;
  }

  async recordDualChainStamp(data: InsertDualChainStamp): Promise<DualChainStamp> {
    const [stamp] = await db.insert(dualChainStamps).values(data).returning();
    return stamp;
  }

  async getDualChainStamp(id: string): Promise<DualChainStamp | undefined> {
    const [stamp] = await db.select().from(dualChainStamps).where(eq(dualChainStamps.id, id));
    return stamp;
  }

  async getDualChainStampsByApp(appId: string): Promise<DualChainStamp[]> {
    return db.select().from(dualChainStamps).where(eq(dualChainStamps.appId, appId)).orderBy(desc(dualChainStamps.createdAt));
  }

  async updateDualChainStamp(id: string, data: Partial<InsertDualChainStamp>): Promise<DualChainStamp | undefined> {
    const [stamp] = await db.update(dualChainStamps).set(data).where(eq(dualChainStamps.id, id)).returning();
    return stamp;
  }

  async createHallmark(data: InsertHallmark): Promise<Hallmark> {
    const [hallmark] = await db.insert(hallmarks).values(data).returning();
    return hallmark;
  }

  async getHallmark(hallmarkId: string): Promise<Hallmark | undefined> {
    const [hallmark] = await db.select().from(hallmarks).where(eq(hallmarks.hallmarkId, hallmarkId));
    return hallmark;
  }

  async getHallmarksByApp(appId: string): Promise<Hallmark[]> {
    return db.select().from(hallmarks).where(eq(hallmarks.appId, appId)).orderBy(desc(hallmarks.createdAt));
  }

  async getAllHallmarks(limit: number = 100): Promise<Hallmark[]> {
    return db.select().from(hallmarks).orderBy(desc(hallmarks.createdAt)).limit(limit);
  }

  async updateHallmark(hallmarkId: string, data: Partial<InsertHallmark>): Promise<Hallmark | undefined> {
    const [hallmark] = await db.update(hallmarks).set(data).where(eq(hallmarks.hallmarkId, hallmarkId)).returning();
    return hallmark;
  }

  async verifyHallmark(hallmarkId: string): Promise<{ valid: boolean; hallmark?: Hallmark }> {
    const hallmark = await this.getHallmark(hallmarkId);
    if (!hallmark) {
      return { valid: false };
    }
    return {
      valid: hallmark.status === "confirmed" && !!hallmark.darkwaveTxHash,
      hallmark,
    };
  }

  async getNextMasterSequence(): Promise<string> {
    const [existing] = await db.select().from(hallmarkCounter).where(eq(hallmarkCounter.id, "master"));
    
    if (!existing) {
      await db.insert(hallmarkCounter).values({ id: "master", currentSequence: "0" });
      return "000000000";
    }

    const nextSeq = parseInt(existing.currentSequence) + 1;
    await db.update(hallmarkCounter).set({ currentSequence: nextSeq.toString() }).where(eq(hallmarkCounter.id, "master"));
    return nextSeq.toString().padStart(9, "0");
  }

  async addToWaitlist(data: InsertWaitlist): Promise<Waitlist> {
    const [entry] = await db.insert(waitlist).values(data).returning();
    return entry;
  }

  async getWaitlistByEmail(email: string): Promise<Waitlist | undefined> {
    const [entry] = await db.select().from(waitlist).where(eq(waitlist.email, email));
    return entry;
  }
}

export const storage = new DatabaseStorage();
