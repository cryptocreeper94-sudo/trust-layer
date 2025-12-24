import { type User, type UpsertUser, type Document, type InsertDocument, type InsertPageView, type PageView, type AnalyticsOverview, type ApiKey, type InsertApiKey, type TransactionHash, type InsertTransactionHash, type DualChainStamp, type InsertDualChainStamp, type Hallmark, type InsertHallmark, type Waitlist, type InsertWaitlist, type StudioProject, type InsertStudioProject, type StudioFile, type InsertStudioFile, type StudioSecret, type InsertStudioSecret, type StudioConfig, type InsertStudioConfig, type StudioCommit, type InsertStudioCommit, type StudioBranch, type InsertStudioBranch, type StudioRun, type InsertStudioRun, type StudioPreview, type InsertStudioPreview, type StudioDeployment, type InsertStudioDeployment, type StudioCollaborator, type InsertStudioCollaborator, type FaucetClaim, type SwapTransaction, type NftCollection, type Nft, type NftListing, type LiquidityPool, type InsertLiquidityPool, type LiquidityPosition, type InsertLiquidityPosition, type Webhook, type InsertWebhook, type PriceHistory, type InsertPriceHistory, type ChainAccount, type UserStake, users, documents, pageViews, apiKeys, transactionHashes, dualChainStamps, hallmarks, hallmarkCounter, waitlist, studioProjects, studioFiles, studioSecrets, studioConfigs, studioCommits, studioBranches, studioRuns, studioPreviews, studioDeployments, studioCollaborators, faucetClaims, swapTransactions, nftCollections, nfts, nftListings, liquidityPools, liquidityPositions, webhooks, priceHistory, chainAccounts, userStakes } from "@shared/schema";
import { db } from "./db";
import { eq, sql, desc, count } from "drizzle-orm";
import crypto from "crypto";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: UpsertUser): Promise<User>;
  getApiKeyByKey(rawKey: string): Promise<ApiKey | undefined>;
  
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
  
  upsertFirebaseUser(data: { id: string; email: string | null; firstName: string | null; lastName: string | null; profileImageUrl: string | null }): Promise<User>;
  
  // Faucet
  getFaucetClaims(): Promise<FaucetClaim[]>;
  getRecentFaucetClaim(walletAddress: string): Promise<FaucetClaim | undefined>;
  createFaucetClaim(data: { walletAddress: string; amount: string; status: string; ipAddress: string | null }): Promise<FaucetClaim>;
  updateFaucetClaim(id: string, data: Partial<{ status: string; txHash: string }>): Promise<FaucetClaim | undefined>;
  
  // DEX Swaps
  getRecentSwaps(): Promise<SwapTransaction[]>;
  createSwap(data: { pairId: string; tokenIn: string; tokenOut: string; amountIn: string; amountOut: string; priceImpact: string; status: string; txHash: string }): Promise<SwapTransaction>;
  
  // NFT Marketplace
  getNftCollections(): Promise<NftCollection[]>;
  getNftListings(): Promise<any[]>;
  getNftStats(): Promise<{ totalVolume: string; totalNfts: number; totalCollections: number }>;
  createNft(data: { tokenId: string; collectionId: string; name: string; description: string; imageUrl: string }): Promise<Nft>;
  
  // Transaction History
  getTransactionHistory(): Promise<any[]>;
  
  // Liquidity Pools
  getLiquidityPools(): Promise<LiquidityPool[]>;
  getLiquidityPool(id: string): Promise<LiquidityPool | undefined>;
  createLiquidityPool(data: InsertLiquidityPool): Promise<LiquidityPool>;
  updateLiquidityPool(id: string, data: Partial<InsertLiquidityPool>): Promise<LiquidityPool | undefined>;
  getLiquidityPositions(userId: string): Promise<LiquidityPosition[]>;
  createLiquidityPosition(data: InsertLiquidityPosition): Promise<LiquidityPosition>;
  
  // Webhooks
  getWebhooks(userId: string): Promise<Webhook[]>;
  createWebhook(data: InsertWebhook): Promise<Webhook>;
  updateWebhook(id: string, data: Partial<InsertWebhook>): Promise<Webhook | undefined>;
  deleteWebhook(id: string): Promise<boolean>;
  
  // Price History
  getPriceHistory(token: string, limit?: number): Promise<PriceHistory[]>;
  recordPrice(data: InsertPriceHistory): Promise<PriceHistory>;
  
  // Chain Accounts & Staking
  getChainAccount(address: string): Promise<ChainAccount | undefined>;
  getStakingPositions(userId: string): Promise<UserStake[]>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async createUser(insertUser: UpsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async getApiKeyByKey(rawKey: string): Promise<ApiKey | undefined> {
    return this.validateApiKey(rawKey);
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

  async createStudioProject(data: InsertStudioProject): Promise<StudioProject> {
    const [project] = await db.insert(studioProjects).values(data).returning();
    return project;
  }

  async getStudioProject(id: string): Promise<StudioProject | undefined> {
    const [project] = await db.select().from(studioProjects).where(eq(studioProjects.id, id));
    return project;
  }

  async getStudioProjectsByUser(userId: string): Promise<StudioProject[]> {
    return db.select().from(studioProjects).where(eq(studioProjects.userId, userId)).orderBy(desc(studioProjects.updatedAt));
  }

  async updateStudioProject(id: string, data: Partial<InsertStudioProject>): Promise<StudioProject | undefined> {
    const [project] = await db.update(studioProjects).set({ ...data, updatedAt: new Date() }).where(eq(studioProjects.id, id)).returning();
    return project;
  }

  async deleteStudioProject(id: string): Promise<boolean> {
    await db.delete(studioFiles).where(eq(studioFiles.projectId, id));
    await db.delete(studioSecrets).where(eq(studioSecrets.projectId, id));
    await db.delete(studioConfigs).where(eq(studioConfigs.projectId, id));
    await db.delete(studioProjects).where(eq(studioProjects.id, id));
    return true;
  }

  async createStudioFile(data: InsertStudioFile): Promise<StudioFile> {
    const [file] = await db.insert(studioFiles).values(data).returning();
    return file;
  }

  async getStudioFiles(projectId: string): Promise<StudioFile[]> {
    return db.select().from(studioFiles).where(eq(studioFiles.projectId, projectId)).orderBy(studioFiles.path);
  }

  async updateStudioFile(id: string, data: Partial<InsertStudioFile>): Promise<StudioFile | undefined> {
    const [file] = await db.update(studioFiles).set({ ...data, updatedAt: new Date() }).where(eq(studioFiles.id, id)).returning();
    return file;
  }

  async deleteStudioFile(id: string): Promise<boolean> {
    await db.delete(studioFiles).where(eq(studioFiles.id, id));
    return true;
  }

  async createStudioSecret(data: InsertStudioSecret): Promise<StudioSecret> {
    const [secret] = await db.insert(studioSecrets).values(data).returning();
    return secret;
  }

  async getStudioSecrets(projectId: string): Promise<StudioSecret[]> {
    return db.select().from(studioSecrets).where(eq(studioSecrets.projectId, projectId));
  }

  async deleteStudioSecret(id: string): Promise<boolean> {
    await db.delete(studioSecrets).where(eq(studioSecrets.id, id));
    return true;
  }

  async createStudioConfig(data: InsertStudioConfig): Promise<StudioConfig> {
    const [config] = await db.insert(studioConfigs).values(data).returning();
    return config;
  }

  async getStudioConfigs(projectId: string): Promise<StudioConfig[]> {
    return db.select().from(studioConfigs).where(eq(studioConfigs.projectId, projectId));
  }

  async deleteStudioConfig(id: string): Promise<boolean> {
    await db.delete(studioConfigs).where(eq(studioConfigs.id, id));
    return true;
  }

  async createStudioCommit(data: InsertStudioCommit): Promise<StudioCommit> {
    const [commit] = await db.insert(studioCommits).values(data).returning();
    return commit;
  }

  async getStudioCommits(projectId: string, branch?: string): Promise<StudioCommit[]> {
    if (branch) {
      return db.select().from(studioCommits)
        .where(eq(studioCommits.projectId, projectId))
        .orderBy(desc(studioCommits.createdAt));
    }
    return db.select().from(studioCommits)
      .where(eq(studioCommits.projectId, projectId))
      .orderBy(desc(studioCommits.createdAt));
  }

  async getStudioCommit(id: string): Promise<StudioCommit | undefined> {
    const [commit] = await db.select().from(studioCommits).where(eq(studioCommits.id, id));
    return commit;
  }

  async createStudioBranch(data: InsertStudioBranch): Promise<StudioBranch> {
    const [branch] = await db.insert(studioBranches).values(data).returning();
    return branch;
  }

  async getStudioBranches(projectId: string): Promise<StudioBranch[]> {
    return db.select().from(studioBranches).where(eq(studioBranches.projectId, projectId));
  }

  async updateStudioBranch(id: string, data: Partial<InsertStudioBranch>): Promise<StudioBranch | undefined> {
    const [branch] = await db.update(studioBranches).set(data).where(eq(studioBranches.id, id)).returning();
    return branch;
  }

  async deleteStudioBranch(id: string): Promise<boolean> {
    await db.delete(studioBranches).where(eq(studioBranches.id, id));
    return true;
  }

  async createStudioRun(data: InsertStudioRun): Promise<StudioRun> {
    const [run] = await db.insert(studioRuns).values(data).returning();
    return run;
  }

  async getStudioRuns(projectId: string): Promise<StudioRun[]> {
    return db.select().from(studioRuns)
      .where(eq(studioRuns.projectId, projectId))
      .orderBy(desc(studioRuns.startedAt));
  }

  async getStudioRun(id: string): Promise<StudioRun | undefined> {
    const [run] = await db.select().from(studioRuns).where(eq(studioRuns.id, id));
    return run;
  }

  async updateStudioRun(id: string, data: Partial<InsertStudioRun>): Promise<StudioRun | undefined> {
    const [run] = await db.update(studioRuns).set(data).where(eq(studioRuns.id, id)).returning();
    return run;
  }

  async createStudioPreview(data: InsertStudioPreview): Promise<StudioPreview> {
    const [preview] = await db.insert(studioPreviews).values(data).returning();
    return preview;
  }

  async getStudioPreview(projectId: string): Promise<StudioPreview | undefined> {
    const [preview] = await db.select().from(studioPreviews)
      .where(eq(studioPreviews.projectId, projectId))
      .orderBy(desc(studioPreviews.createdAt));
    return preview;
  }

  async updateStudioPreview(id: string, data: Partial<InsertStudioPreview>): Promise<StudioPreview | undefined> {
    const [preview] = await db.update(studioPreviews).set(data).where(eq(studioPreviews.id, id)).returning();
    return preview;
  }

  async createStudioDeployment(data: InsertStudioDeployment): Promise<StudioDeployment> {
    const [deployment] = await db.insert(studioDeployments).values(data).returning();
    return deployment;
  }

  async getStudioDeployments(projectId: string): Promise<StudioDeployment[]> {
    return db.select().from(studioDeployments)
      .where(eq(studioDeployments.projectId, projectId))
      .orderBy(desc(studioDeployments.createdAt));
  }

  async getStudioDeployment(id: string): Promise<StudioDeployment | undefined> {
    const [deployment] = await db.select().from(studioDeployments).where(eq(studioDeployments.id, id));
    return deployment;
  }

  async updateStudioDeployment(id: string, data: Partial<InsertStudioDeployment>): Promise<StudioDeployment | undefined> {
    const [deployment] = await db.update(studioDeployments).set({ ...data, updatedAt: new Date() }).where(eq(studioDeployments.id, id)).returning();
    return deployment;
  }

  async createStudioCollaborator(data: InsertStudioCollaborator): Promise<StudioCollaborator> {
    const [collab] = await db.insert(studioCollaborators).values(data).returning();
    return collab;
  }

  async getStudioCollaborators(projectId: string): Promise<StudioCollaborator[]> {
    return db.select().from(studioCollaborators).where(eq(studioCollaborators.projectId, projectId));
  }

  async updateStudioCollaborator(id: string, data: Partial<InsertStudioCollaborator>): Promise<StudioCollaborator | undefined> {
    const [collab] = await db.update(studioCollaborators).set({ ...data, lastActiveAt: new Date() }).where(eq(studioCollaborators.id, id)).returning();
    return collab;
  }

  async deleteStudioCollaborator(id: string): Promise<boolean> {
    await db.delete(studioCollaborators).where(eq(studioCollaborators.id, id));
    return true;
  }

  async upsertFirebaseUser(data: { id: string; email: string | null; firstName: string | null; lastName: string | null; profileImageUrl: string | null }): Promise<User> {
    const existing = await this.getUser(data.id);
    if (existing) {
      const [updated] = await db.update(users)
        .set({
          email: data.email,
          firstName: data.firstName,
          lastName: data.lastName,
          profileImageUrl: data.profileImageUrl,
        })
        .where(eq(users.id, data.id))
        .returning();
      return updated;
    } else {
      const [user] = await db.insert(users).values(data).returning();
      return user;
    }
  }

  // Faucet methods
  async getFaucetClaims(): Promise<FaucetClaim[]> {
    return db.select().from(faucetClaims).orderBy(desc(faucetClaims.claimedAt));
  }

  async getRecentFaucetClaim(walletAddress: string): Promise<FaucetClaim | undefined> {
    const [claim] = await db.select()
      .from(faucetClaims)
      .where(eq(faucetClaims.walletAddress, walletAddress))
      .orderBy(desc(faucetClaims.claimedAt))
      .limit(1);
    return claim;
  }

  async createFaucetClaim(data: { walletAddress: string; amount: string; status: string; ipAddress: string | null }): Promise<FaucetClaim> {
    const [claim] = await db.insert(faucetClaims).values(data).returning();
    return claim;
  }

  async updateFaucetClaim(id: string, data: Partial<{ status: string; txHash: string }>): Promise<FaucetClaim | undefined> {
    const [claim] = await db.update(faucetClaims).set(data).where(eq(faucetClaims.id, id)).returning();
    return claim;
  }

  // DEX Swap methods
  async getRecentSwaps(): Promise<SwapTransaction[]> {
    return db.select().from(swapTransactions).orderBy(desc(swapTransactions.createdAt)).limit(50);
  }

  async createSwap(data: { pairId: string; tokenIn: string; tokenOut: string; amountIn: string; amountOut: string; priceImpact: string; status: string; txHash: string }): Promise<SwapTransaction> {
    const [swap] = await db.insert(swapTransactions).values(data).returning();
    return swap;
  }

  // NFT Marketplace methods
  async getNftCollections(): Promise<NftCollection[]> {
    return db.select().from(nftCollections).orderBy(desc(nftCollections.createdAt)).limit(50);
  }

  async getNftListings(): Promise<any[]> {
    const allNfts = await db.select().from(nfts).orderBy(desc(nfts.createdAt)).limit(100);
    return allNfts.map(nft => ({
      ...nft,
      price: "50000000000000000000",
      likes: Math.floor(Math.random() * 100),
    }));
  }

  async getNftStats(): Promise<{ totalVolume: string; totalNfts: number; totalCollections: number }> {
    const [nftResult] = await db.select({ count: count() }).from(nfts);
    const [collectionResult] = await db.select({ count: count() }).from(nftCollections);
    return {
      totalVolume: "0",
      totalNfts: nftResult?.count || 0,
      totalCollections: collectionResult?.count || 0,
    };
  }

  async createNft(data: { tokenId: string; collectionId: string; name: string; description: string; imageUrl: string }): Promise<Nft> {
    const [nft] = await db.insert(nfts).values(data).returning();
    return nft;
  }

  // Transaction History - aggregate from various sources
  async getTransactionHistory(): Promise<any[]> {
    const transactions: any[] = [];

    // Get recent swaps
    const recentSwaps = await db.select().from(swapTransactions).orderBy(desc(swapTransactions.createdAt)).limit(20);
    for (const swap of recentSwaps) {
      transactions.push({
        id: swap.id,
        type: "swap",
        token: `${swap.tokenIn} → ${swap.tokenOut}`,
        amount: swap.amountIn,
        hash: swap.txHash,
        status: swap.status,
        timestamp: swap.createdAt,
      });
    }

    // Get recent faucet claims
    const recentClaims = await db.select().from(faucetClaims).orderBy(desc(faucetClaims.claimedAt)).limit(20);
    for (const claim of recentClaims) {
      transactions.push({
        id: claim.id,
        type: "claim",
        token: "DWT",
        amount: claim.amount,
        hash: claim.txHash || "",
        status: claim.status,
        timestamp: claim.claimedAt,
        to: claim.walletAddress,
      });
    }

    // Sort by timestamp desc
    transactions.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    return transactions.slice(0, 50);
  }

  // Liquidity Pools
  async getLiquidityPools(): Promise<LiquidityPool[]> {
    return db.select().from(liquidityPools).where(eq(liquidityPools.isActive, true)).orderBy(desc(liquidityPools.tvl));
  }

  async getLiquidityPool(id: string): Promise<LiquidityPool | undefined> {
    const [pool] = await db.select().from(liquidityPools).where(eq(liquidityPools.id, id));
    return pool;
  }

  async createLiquidityPool(data: InsertLiquidityPool): Promise<LiquidityPool> {
    const [pool] = await db.insert(liquidityPools).values(data).returning();
    return pool;
  }

  async updateLiquidityPool(id: string, data: Partial<InsertLiquidityPool>): Promise<LiquidityPool | undefined> {
    const [pool] = await db.update(liquidityPools).set(data).where(eq(liquidityPools.id, id)).returning();
    return pool;
  }

  async getLiquidityPositions(userId: string): Promise<LiquidityPosition[]> {
    return db.select().from(liquidityPositions).where(eq(liquidityPositions.userId, userId));
  }

  async createLiquidityPosition(data: InsertLiquidityPosition): Promise<LiquidityPosition> {
    const [position] = await db.insert(liquidityPositions).values(data).returning();
    return position;
  }

  // Webhooks
  async getWebhooks(userId: string): Promise<Webhook[]> {
    return db.select().from(webhooks).where(eq(webhooks.userId, userId)).orderBy(desc(webhooks.createdAt));
  }

  async createWebhook(data: InsertWebhook): Promise<Webhook> {
    const [webhook] = await db.insert(webhooks).values(data).returning();
    return webhook;
  }

  async updateWebhook(id: string, data: Partial<InsertWebhook>): Promise<Webhook | undefined> {
    const [webhook] = await db.update(webhooks).set(data).where(eq(webhooks.id, id)).returning();
    return webhook;
  }

  async deleteWebhook(id: string): Promise<boolean> {
    const result = await db.delete(webhooks).where(eq(webhooks.id, id));
    return true;
  }

  // Price History
  async getPriceHistory(token: string, limit: number = 100): Promise<PriceHistory[]> {
    return db.select().from(priceHistory).where(eq(priceHistory.token, token)).orderBy(desc(priceHistory.timestamp)).limit(limit);
  }

  async recordPrice(data: InsertPriceHistory): Promise<PriceHistory> {
    const [record] = await db.insert(priceHistory).values(data).returning();
    return record;
  }

  async getChainAccount(address: string): Promise<ChainAccount | undefined> {
    const [account] = await db.select().from(chainAccounts).where(eq(chainAccounts.address, address));
    return account;
  }

  async getStakingPositions(userId: string): Promise<UserStake[]> {
    return db.select().from(userStakes).where(eq(userStakes.userId, userId));
  }
}

export const storage = new DatabaseStorage();
