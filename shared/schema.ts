import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, boolean, serial, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export * from "./models/auth";

// AI Chat conversations
export const conversations = pgTable("conversations", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
});

export const messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  conversationId: integer("conversation_id").notNull().references(() => conversations.id, { onDelete: "cascade" }),
  role: text("role").notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
});

export const insertConversationSchema = createInsertSchema(conversations).omit({
  id: true,
  createdAt: true,
});

export const insertMessageSchema = createInsertSchema(messages).omit({
  id: true,
  createdAt: true,
});

export type Conversation = typeof conversations.$inferSelect;
export type InsertConversation = z.infer<typeof insertConversationSchema>;
export type Message = typeof messages.$inferSelect;
export type InsertMessage = z.infer<typeof insertMessageSchema>;

export const documents = pgTable("documents", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  content: text("content").notNull(),
  category: text("category").notNull().default("general"),
  appId: text("app_id"),
  isPublic: boolean("is_public").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertDocumentSchema = createInsertSchema(documents).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertDocument = z.infer<typeof insertDocumentSchema>;
export type Document = typeof documents.$inferSelect;

export const ecosystemAppSchema = z.object({
  id: z.string(),
  name: z.string(),
  category: z.string(),
  description: z.string(),
  hook: z.string().optional(),
  tags: z.array(z.string()),
  gradient: z.string(),
  verified: z.boolean().optional(),
  featured: z.boolean().optional(),
  users: z.string().optional(),
  imagePrompt: z.string().optional(),
  url: z.string().optional(),
});

export type EcosystemApp = z.infer<typeof ecosystemAppSchema>;

export const blockchainStatsSchema = z.object({
  tps: z.string(),
  finalityTime: z.string(),
  avgCost: z.string(),
  activeNodes: z.string(),
  currentBlock: z.string(),
  networkHash: z.string(),
});

export type BlockchainStats = z.infer<typeof blockchainStatsSchema>;

export const pageViews = pgTable("page_views", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  pageSlug: text("page_slug").notNull(),
  visitorId: text("visitor_id").notNull(),
  referrer: text("referrer"),
  userAgent: text("user_agent"),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
});

export const insertPageViewSchema = createInsertSchema(pageViews).omit({
  id: true,
  timestamp: true,
});

export type InsertPageView = z.infer<typeof insertPageViewSchema>;
export type PageView = typeof pageViews.$inferSelect;

export const dailyMetrics = pgTable("daily_metrics", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  date: text("date").notNull(),
  pageSlug: text("page_slug").notNull(),
  totalViews: text("total_views").notNull().default("0"),
  uniqueVisitors: text("unique_visitors").notNull().default("0"),
});

export const insertDailyMetricsSchema = createInsertSchema(dailyMetrics).omit({
  id: true,
});

export type InsertDailyMetrics = z.infer<typeof insertDailyMetricsSchema>;
export type DailyMetrics = typeof dailyMetrics.$inferSelect;

export const analyticsOverviewSchema = z.object({
  totalViews: z.number(),
  uniqueVisitors: z.number(),
  todayViews: z.number(),
  topPages: z.array(z.object({
    page: z.string(),
    views: z.number(),
  })),
  topReferrers: z.array(z.object({
    referrer: z.string(),
    count: z.number(),
  })),
  dailyTrend: z.array(z.object({
    date: z.string(),
    views: z.number(),
    unique: z.number(),
  })),
});

export type AnalyticsOverview = z.infer<typeof analyticsOverviewSchema>;

export const apiKeys = pgTable("api_keys", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  keyHash: text("key_hash").notNull().unique(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  appName: text("app_name").notNull(),
  permissions: text("permissions").notNull().default("read,write"),
  rateLimit: text("rate_limit").notNull().default("1000"),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  lastUsedAt: timestamp("last_used_at"),
});

export const insertApiKeySchema = createInsertSchema(apiKeys).omit({
  id: true,
  createdAt: true,
  lastUsedAt: true,
});

export type InsertApiKey = z.infer<typeof insertApiKeySchema>;
export type ApiKey = typeof apiKeys.$inferSelect;

export const transactionHashes = pgTable("transaction_hashes", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  txHash: text("tx_hash").notNull().unique(),
  dataHash: text("data_hash").notNull(),
  category: text("category").notNull().default("general"),
  appId: text("app_id"),
  apiKeyId: text("api_key_id"),
  status: text("status").notNull().default("pending"),
  blockHeight: text("block_height"),
  gasUsed: text("gas_used"),
  fee: text("fee"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  confirmedAt: timestamp("confirmed_at"),
});

export const insertTransactionHashSchema = createInsertSchema(transactionHashes).omit({
  id: true,
  createdAt: true,
  confirmedAt: true,
});

export type InsertTransactionHash = z.infer<typeof insertTransactionHashSchema>;
export type TransactionHash = typeof transactionHashes.$inferSelect;

export const feeScheduleSchema = z.object({
  baseFee: z.number(),
  priorityFee: z.number(),
  maxFee: z.number(),
  feePerByte: z.number(),
  hashSubmissionFee: z.number(),
});

export type FeeSchedule = z.infer<typeof feeScheduleSchema>;

export const gasEstimateSchema = z.object({
  gasLimit: z.number(),
  gasPrice: z.number(),
  estimatedCost: z.string(),
  estimatedCostDWT: z.string(),
  estimatedCostUSD: z.string(),
});

export type GasEstimate = z.infer<typeof gasEstimateSchema>;

export const dualChainStamps = pgTable("dual_chain_stamps", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  dataHash: text("data_hash").notNull(),
  appId: text("app_id").notNull(),
  appName: text("app_name"),
  category: text("category").notNull().default("release"),
  metadata: text("metadata"),
  darkwaveTxHash: text("darkwave_tx_hash"),
  darkwaveStatus: text("darkwave_status").notNull().default("pending"),
  darkwaveBlockHeight: text("darkwave_block_height"),
  solanaTxSignature: text("solana_tx_signature"),
  solanaStatus: text("solana_status").notNull().default("pending"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  confirmedAt: timestamp("confirmed_at"),
});

export const insertDualChainStampSchema = createInsertSchema(dualChainStamps).omit({
  id: true,
  createdAt: true,
  confirmedAt: true,
});

export type InsertDualChainStamp = z.infer<typeof insertDualChainStampSchema>;
export type DualChainStamp = typeof dualChainStamps.$inferSelect;

export const dualChainResultSchema = z.object({
  dataHash: z.string(),
  darkwave: z.object({
    success: z.boolean(),
    txHash: z.string().optional(),
    blockHeight: z.number().optional(),
    error: z.string().optional(),
  }).optional(),
  solana: z.object({
    success: z.boolean(),
    txSignature: z.string().optional(),
    error: z.string().optional(),
  }).optional(),
  allSuccessful: z.boolean(),
});

export type DualChainResult = z.infer<typeof dualChainResultSchema>;

export const hallmarks = pgTable("hallmarks", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  hallmarkId: text("hallmark_id").notNull().unique(),
  masterSequence: text("master_sequence").notNull(),
  subSequence: text("sub_sequence").notNull().default("01"),
  appId: text("app_id").notNull(),
  appName: text("app_name").notNull(),
  productName: text("product_name"),
  version: text("version"),
  releaseType: text("release_type").notNull().default("release"),
  dataHash: text("data_hash").notNull(),
  metadata: text("metadata"),
  qrCodeSvg: text("qr_code_svg"),
  verificationToken: text("verification_token"),
  darkwaveTxHash: text("darkwave_tx_hash"),
  darkwaveBlockHeight: text("darkwave_block_height"),
  status: text("status").notNull().default("pending"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  confirmedAt: timestamp("confirmed_at"),
});

export const hallmarkCounter = pgTable("hallmark_counter", {
  id: varchar("id").primaryKey().default("master"),
  currentSequence: text("current_sequence").notNull().default("0"),
});

export const insertHallmarkSchema = createInsertSchema(hallmarks).omit({
  id: true,
  createdAt: true,
  confirmedAt: true,
});

export type InsertHallmark = z.infer<typeof insertHallmarkSchema>;
export type Hallmark = typeof hallmarks.$inferSelect;

export const hallmarkResponseSchema = z.object({
  hallmarkId: z.string(),
  appId: z.string(),
  appName: z.string(),
  productName: z.string().optional(),
  version: z.string().optional(),
  releaseType: z.string(),
  dataHash: z.string(),
  darkwave: z.object({
    txHash: z.string().optional(),
    blockHeight: z.string().optional(),
    status: z.string(),
    explorerUrl: z.string().optional(),
  }),
  createdAt: z.string(),
  verified: z.boolean(),
});

export type HallmarkResponse = z.infer<typeof hallmarkResponseSchema>;

export const waitlist = pgTable("waitlist", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: text("email").notNull().unique(),
  feature: text("feature").notNull().default("dev-studio"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertWaitlistSchema = createInsertSchema(waitlist).omit({
  id: true,
  createdAt: true,
}).extend({
  email: z.string().email("Please enter a valid email address"),
});

export type InsertWaitlist = z.infer<typeof insertWaitlistSchema>;
export type Waitlist = typeof waitlist.$inferSelect;

export const usageLogs = pgTable("usage_logs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  apiKeyId: text("api_key_id").notNull(),
  endpoint: text("endpoint").notNull(),
  tokensUsed: text("tokens_used").notNull().default("0"),
  costCents: text("cost_cents").notNull().default("0"),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
});

export const insertUsageLogSchema = createInsertSchema(usageLogs).omit({
  id: true,
  timestamp: true,
});

export type InsertUsageLog = z.infer<typeof insertUsageLogSchema>;
export type UsageLog = typeof usageLogs.$inferSelect;

export const developerBilling = pgTable("developer_billing", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  apiKeyId: text("api_key_id").notNull().unique(),
  stripeCustomerId: text("stripe_customer_id"),
  email: text("email").notNull(),
  totalUsageCents: text("total_usage_cents").notNull().default("0"),
  paidThroughCents: text("paid_through_cents").notNull().default("0"),
  lastBilledAt: timestamp("last_billed_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertDeveloperBillingSchema = createInsertSchema(developerBilling).omit({
  id: true,
  createdAt: true,
  lastBilledAt: true,
});

export type InsertDeveloperBilling = z.infer<typeof insertDeveloperBillingSchema>;
export type DeveloperBilling = typeof developerBilling.$inferSelect;

export const studioProjects = pgTable("studio_projects", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: text("user_id").notNull(),
  name: text("name").notNull(),
  description: text("description"),
  language: text("language").notNull().default("javascript"),
  isPublic: boolean("is_public").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertStudioProjectSchema = createInsertSchema(studioProjects).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertStudioProject = z.infer<typeof insertStudioProjectSchema>;
export type StudioProject = typeof studioProjects.$inferSelect;

export const studioFiles = pgTable("studio_files", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  projectId: text("project_id").notNull(),
  path: text("path").notNull(),
  name: text("name").notNull(),
  content: text("content").notNull().default(""),
  language: text("language").notNull().default("plaintext"),
  isFolder: boolean("is_folder").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertStudioFileSchema = createInsertSchema(studioFiles).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertStudioFile = z.infer<typeof insertStudioFileSchema>;
export type StudioFile = typeof studioFiles.$inferSelect;

export const studioSecrets = pgTable("studio_secrets", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  projectId: text("project_id").notNull(),
  key: text("key").notNull(),
  value: text("value").notNull(),
  environment: text("environment").notNull().default("shared"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertStudioSecretSchema = createInsertSchema(studioSecrets).omit({
  id: true,
  createdAt: true,
});

export type InsertStudioSecret = z.infer<typeof insertStudioSecretSchema>;
export type StudioSecret = typeof studioSecrets.$inferSelect;

export const studioConfigs = pgTable("studio_configs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  projectId: text("project_id").notNull(),
  key: text("key").notNull(),
  value: text("value").notNull(),
  environment: text("environment").notNull().default("shared"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertStudioConfigSchema = createInsertSchema(studioConfigs).omit({
  id: true,
  createdAt: true,
});

export type InsertStudioConfig = z.infer<typeof insertStudioConfigSchema>;
export type StudioConfig = typeof studioConfigs.$inferSelect;

export const studioCommits = pgTable("studio_commits", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  projectId: text("project_id").notNull(),
  hash: text("hash").notNull(),
  parentHash: text("parent_hash"),
  message: text("message").notNull(),
  authorId: text("author_id").notNull(),
  branch: text("branch").notNull().default("main"),
  filesSnapshot: text("files_snapshot").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertStudioCommitSchema = createInsertSchema(studioCommits).omit({
  id: true,
  createdAt: true,
});

export type InsertStudioCommit = z.infer<typeof insertStudioCommitSchema>;
export type StudioCommit = typeof studioCommits.$inferSelect;

export const studioBranches = pgTable("studio_branches", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  projectId: text("project_id").notNull(),
  name: text("name").notNull(),
  headCommitId: text("head_commit_id"),
  isDefault: boolean("is_default").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertStudioBranchSchema = createInsertSchema(studioBranches).omit({
  id: true,
  createdAt: true,
});

export type InsertStudioBranch = z.infer<typeof insertStudioBranchSchema>;
export type StudioBranch = typeof studioBranches.$inferSelect;

export const studioRuns = pgTable("studio_runs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  projectId: text("project_id").notNull(),
  command: text("command").notNull(),
  status: text("status").notNull().default("pending"),
  output: text("output").notNull().default(""),
  exitCode: text("exit_code"),
  startedAt: timestamp("started_at").defaultNow().notNull(),
  completedAt: timestamp("completed_at"),
});

export const insertStudioRunSchema = createInsertSchema(studioRuns).omit({
  id: true,
  startedAt: true,
  completedAt: true,
});

export type InsertStudioRun = z.infer<typeof insertStudioRunSchema>;
export type StudioRun = typeof studioRuns.$inferSelect;

export const studioPreviews = pgTable("studio_previews", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  projectId: text("project_id").notNull(),
  runId: text("run_id"),
  url: text("url"),
  status: text("status").notNull().default("pending"),
  port: text("port"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertStudioPreviewSchema = createInsertSchema(studioPreviews).omit({
  id: true,
  createdAt: true,
});

export type InsertStudioPreview = z.infer<typeof insertStudioPreviewSchema>;
export type StudioPreview = typeof studioPreviews.$inferSelect;

export const studioDeployments = pgTable("studio_deployments", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  projectId: text("project_id").notNull(),
  status: text("status").notNull().default("pending"),
  url: text("url"),
  customDomain: text("custom_domain"),
  version: text("version").notNull().default("1"),
  commitHash: text("commit_hash"),
  buildLogs: text("build_logs").default(""),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertStudioDeploymentSchema = createInsertSchema(studioDeployments).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertStudioDeployment = z.infer<typeof insertStudioDeploymentSchema>;
export type StudioDeployment = typeof studioDeployments.$inferSelect;

export const studioCollaborators = pgTable("studio_collaborators", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  projectId: text("project_id").notNull(),
  userId: text("user_id").notNull(),
  role: text("role").notNull().default("editor"),
  cursorPosition: text("cursor_position"),
  lastActiveAt: timestamp("last_active_at").defaultNow().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertStudioCollaboratorSchema = createInsertSchema(studioCollaborators).omit({
  id: true,
  createdAt: true,
  lastActiveAt: true,
});

export type InsertStudioCollaborator = z.infer<typeof insertStudioCollaboratorSchema>;
export type StudioCollaborator = typeof studioCollaborators.$inferSelect;

export const chainBlocks = pgTable("chain_blocks", {
  height: text("height").primaryKey(),
  hash: text("hash").notNull().unique(),
  prevHash: text("prev_hash").notNull(),
  timestamp: timestamp("timestamp").notNull(),
  validator: text("validator").notNull(),
  merkleRoot: text("merkle_root").notNull(),
  txCount: text("tx_count").notNull().default("0"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertChainBlockSchema = createInsertSchema(chainBlocks).omit({
  createdAt: true,
});

export type InsertChainBlock = z.infer<typeof insertChainBlockSchema>;
export type ChainBlock = typeof chainBlocks.$inferSelect;

export const chainTransactions = pgTable("chain_transactions", {
  hash: text("hash").primaryKey(),
  blockHeight: text("block_height").notNull(),
  fromAddress: text("from_address").notNull(),
  toAddress: text("to_address").notNull(),
  amount: text("amount").notNull(),
  nonce: text("nonce").notNull(),
  gasLimit: text("gas_limit").notNull(),
  gasPrice: text("gas_price").notNull(),
  data: text("data").default(""),
  signature: text("signature"),
  timestamp: timestamp("timestamp").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertChainTransactionSchema = createInsertSchema(chainTransactions).omit({
  createdAt: true,
});

export type InsertChainTransaction = z.infer<typeof insertChainTransactionSchema>;
export type ChainTransaction = typeof chainTransactions.$inferSelect;

export const chainAccounts = pgTable("chain_accounts", {
  address: text("address").primaryKey(),
  balance: text("balance").notNull().default("0"),
  nonce: text("nonce").notNull().default("0"),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertChainAccountSchema = createInsertSchema(chainAccounts).omit({
  updatedAt: true,
});

export type InsertChainAccount = z.infer<typeof insertChainAccountSchema>;
export type ChainAccount = typeof chainAccounts.$inferSelect;

export const chainConfig = pgTable("chain_config", {
  key: text("key").primaryKey(),
  value: text("value").notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Cross-Chain Bridge Tables (Phase 1 - MVP Custodial Bridge)

export const bridgeLocks = pgTable("bridge_locks", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  fromAddress: text("from_address").notNull(),
  amount: text("amount").notNull(),
  targetChain: text("target_chain").notNull(),
  targetAddress: text("target_address").notNull(),
  txHash: text("tx_hash").notNull().unique(),
  status: text("status").notNull().default("pending"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  confirmedAt: timestamp("confirmed_at"),
});

export const insertBridgeLockSchema = createInsertSchema(bridgeLocks).omit({
  id: true,
  createdAt: true,
  confirmedAt: true,
});

export type InsertBridgeLock = z.infer<typeof insertBridgeLockSchema>;
export type BridgeLock = typeof bridgeLocks.$inferSelect;

export const bridgeMints = pgTable("bridge_mints", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  lockId: text("lock_id").notNull(),
  targetChain: text("target_chain").notNull(),
  targetAddress: text("target_address").notNull(),
  amount: text("amount").notNull(),
  targetTxHash: text("target_tx_hash"),
  status: text("status").notNull().default("pending"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  completedAt: timestamp("completed_at"),
});

export const insertBridgeMintSchema = createInsertSchema(bridgeMints).omit({
  id: true,
  createdAt: true,
  completedAt: true,
});

export type InsertBridgeMint = z.infer<typeof insertBridgeMintSchema>;
export type BridgeMint = typeof bridgeMints.$inferSelect;

export const bridgeBurns = pgTable("bridge_burns", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  sourceChain: text("source_chain").notNull(),
  sourceAddress: text("source_address").notNull(),
  amount: text("amount").notNull(),
  targetAddress: text("target_address").notNull(),
  sourceTxHash: text("source_tx_hash").notNull(),
  status: text("status").notNull().default("pending"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  confirmedAt: timestamp("confirmed_at"),
});

export const insertBridgeBurnSchema = createInsertSchema(bridgeBurns).omit({
  id: true,
  createdAt: true,
  confirmedAt: true,
});

export type InsertBridgeBurn = z.infer<typeof insertBridgeBurnSchema>;
export type BridgeBurn = typeof bridgeBurns.$inferSelect;

export const bridgeReleases = pgTable("bridge_releases", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  burnId: text("burn_id").notNull(),
  toAddress: text("to_address").notNull(),
  amount: text("amount").notNull(),
  txHash: text("tx_hash"),
  status: text("status").notNull().default("pending"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  completedAt: timestamp("completed_at"),
});

export const insertBridgeReleaseSchema = createInsertSchema(bridgeReleases).omit({
  id: true,
  createdAt: true,
  completedAt: true,
});

export type InsertBridgeRelease = z.infer<typeof insertBridgeReleaseSchema>;
export type BridgeRelease = typeof bridgeReleases.$inferSelect;

// ============================================
// STAKING SYSTEM
// ============================================

export const stakingPools = pgTable("staking_pools", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description").notNull(),
  poolType: text("pool_type").notNull(), // 'liquid' | 'locked' | 'founders'
  apyBase: text("apy_base").notNull(), // Base APY percentage as string (e.g., "12.5")
  apyBoost: text("apy_boost").notNull().default("0"), // Bonus APY for streaks/badges
  lockDays: integer("lock_days").notNull().default(0), // 0 = no lock (liquid)
  minStake: text("min_stake").notNull().default("100"), // Minimum DWT to stake
  maxStake: text("max_stake"), // Optional maximum per user
  totalStaked: text("total_staked").notNull().default("0"),
  totalStakers: integer("total_stakers").notNull().default(0),
  isActive: boolean("is_active").notNull().default(true),
  startsAt: timestamp("starts_at"),
  endsAt: timestamp("ends_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertStakingPoolSchema = createInsertSchema(stakingPools).omit({
  id: true,
  createdAt: true,
});

export type InsertStakingPool = z.infer<typeof insertStakingPoolSchema>;
export type StakingPool = typeof stakingPools.$inferSelect;

export const userStakes = pgTable("user_stakes", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: text("user_id").notNull(),
  poolId: text("pool_id").notNull(),
  amount: text("amount").notNull(),
  pendingRewards: text("pending_rewards").notNull().default("0"),
  claimedRewards: text("claimed_rewards").notNull().default("0"),
  streakDays: integer("streak_days").notNull().default(0),
  status: text("status").notNull().default("active"), // 'active' | 'unstaking' | 'completed'
  lockedUntil: timestamp("locked_until"),
  stakedAt: timestamp("staked_at").defaultNow().notNull(),
  lastRewardAt: timestamp("last_reward_at").defaultNow().notNull(),
  unstakedAt: timestamp("unstaked_at"),
});

export const insertUserStakeSchema = createInsertSchema(userStakes).omit({
  id: true,
  stakedAt: true,
  lastRewardAt: true,
  unstakedAt: true,
});

export type InsertUserStake = z.infer<typeof insertUserStakeSchema>;
export type UserStake = typeof userStakes.$inferSelect;

export const stakingRewards = pgTable("staking_rewards", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: text("user_id").notNull(),
  stakeId: text("stake_id").notNull(),
  amount: text("amount").notNull(),
  rewardType: text("reward_type").notNull().default("staking"), // 'staking' | 'quest' | 'airdrop' | 'referral'
  status: text("status").notNull().default("pending"), // 'pending' | 'claimed'
  createdAt: timestamp("created_at").defaultNow().notNull(),
  claimedAt: timestamp("claimed_at"),
});

export const insertStakingRewardSchema = createInsertSchema(stakingRewards).omit({
  id: true,
  createdAt: true,
  claimedAt: true,
});

export type InsertStakingReward = z.infer<typeof insertStakingRewardSchema>;
export type StakingReward = typeof stakingRewards.$inferSelect;

export const stakingQuests = pgTable("staking_quests", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  description: text("description").notNull(),
  questType: text("quest_type").notNull(), // 'stake_amount' | 'stake_duration' | 'referral' | 'bridge' | 'social'
  requirement: text("requirement").notNull(), // JSON with quest requirements
  rewardDwt: text("reward_dwt").notNull(),
  rewardBadge: text("reward_badge"), // Optional NFT badge ID
  apyBoost: text("apy_boost").notNull().default("0"), // Bonus APY on completion
  isActive: boolean("is_active").notNull().default(true),
  expiresAt: timestamp("expires_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertStakingQuestSchema = createInsertSchema(stakingQuests).omit({
  id: true,
  createdAt: true,
});

export type InsertStakingQuest = z.infer<typeof insertStakingQuestSchema>;
export type StakingQuest = typeof stakingQuests.$inferSelect;

export const userQuestProgress = pgTable("user_quest_progress", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: text("user_id").notNull(),
  questId: text("quest_id").notNull(),
  progress: text("progress").notNull().default("0"), // Current progress value
  status: text("status").notNull().default("active"), // 'active' | 'completed' | 'claimed'
  completedAt: timestamp("completed_at"),
  claimedAt: timestamp("claimed_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertUserQuestProgressSchema = createInsertSchema(userQuestProgress).omit({
  id: true,
  createdAt: true,
  completedAt: true,
  claimedAt: true,
});

export type InsertUserQuestProgress = z.infer<typeof insertUserQuestProgressSchema>;
export type UserQuestProgress = typeof userQuestProgress.$inferSelect;

export const stakingLeaderboard = pgTable("staking_leaderboard", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: text("user_id").notNull().unique(),
  totalStaked: text("total_staked").notNull().default("0"),
  totalRewards: text("total_rewards").notNull().default("0"),
  longestStreak: integer("longest_streak").notNull().default(0),
  questsCompleted: integer("quests_completed").notNull().default(0),
  referralCount: integer("referral_count").notNull().default(0),
  rank: integer("rank"),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertStakingLeaderboardSchema = createInsertSchema(stakingLeaderboard).omit({
  id: true,
  updatedAt: true,
});

export type InsertStakingLeaderboard = z.infer<typeof insertStakingLeaderboardSchema>;
export type StakingLeaderboard = typeof stakingLeaderboard.$inferSelect;

// ============================================
// TESTNET FAUCET
// ============================================

export const faucetClaims = pgTable("faucet_claims", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  walletAddress: text("wallet_address").notNull(),
  ipAddress: text("ip_address"),
  amount: text("amount").notNull().default("1000000000000000000000"), // 1000 DWT default
  txHash: text("tx_hash"),
  status: text("status").notNull().default("pending"), // 'pending' | 'completed' | 'failed'
  claimedAt: timestamp("claimed_at").defaultNow().notNull(),
});

export const insertFaucetClaimSchema = createInsertSchema(faucetClaims).omit({
  id: true,
  claimedAt: true,
});

export type InsertFaucetClaim = z.infer<typeof insertFaucetClaimSchema>;
export type FaucetClaim = typeof faucetClaims.$inferSelect;

// ============================================
// DEX / TOKEN SWAP
// ============================================

export const tokenPairs = pgTable("token_pairs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  tokenA: text("token_a").notNull(), // e.g., "DWT"
  tokenB: text("token_b").notNull(), // e.g., "USDC"
  reserveA: text("reserve_a").notNull().default("0"),
  reserveB: text("reserve_b").notNull().default("0"),
  totalLiquidity: text("total_liquidity").notNull().default("0"),
  fee: text("fee").notNull().default("0.003"), // 0.3% default
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertTokenPairSchema = createInsertSchema(tokenPairs).omit({
  id: true,
  createdAt: true,
});

export type InsertTokenPair = z.infer<typeof insertTokenPairSchema>;
export type TokenPair = typeof tokenPairs.$inferSelect;

export const swapTransactions = pgTable("swap_transactions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: text("user_id"),
  pairId: text("pair_id").notNull(),
  tokenIn: text("token_in").notNull(),
  tokenOut: text("token_out").notNull(),
  amountIn: text("amount_in").notNull(),
  amountOut: text("amount_out").notNull(),
  priceImpact: text("price_impact").notNull().default("0"),
  txHash: text("tx_hash"),
  status: text("status").notNull().default("completed"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertSwapTransactionSchema = createInsertSchema(swapTransactions).omit({
  id: true,
  createdAt: true,
});

export type InsertSwapTransaction = z.infer<typeof insertSwapTransactionSchema>;
export type SwapTransaction = typeof swapTransactions.$inferSelect;

// ============================================
// NFT MARKETPLACE
// ============================================

export const nftCollections = pgTable("nft_collections", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  symbol: text("symbol").notNull(),
  description: text("description"),
  imageUrl: text("image_url"),
  bannerUrl: text("banner_url"),
  creatorId: text("creator_id"),
  floorPrice: text("floor_price").notNull().default("0"),
  totalVolume: text("total_volume").notNull().default("0"),
  itemCount: integer("item_count").notNull().default(0),
  ownerCount: integer("owner_count").notNull().default(0),
  isVerified: boolean("is_verified").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertNftCollectionSchema = createInsertSchema(nftCollections).omit({
  id: true,
  createdAt: true,
});

export type InsertNftCollection = z.infer<typeof insertNftCollectionSchema>;
export type NftCollection = typeof nftCollections.$inferSelect;

export const nfts = pgTable("nfts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  tokenId: text("token_id").notNull(),
  collectionId: text("collection_id").notNull(),
  name: text("name").notNull(),
  description: text("description"),
  imageUrl: text("image_url"),
  attributes: text("attributes"), // JSON string of traits
  ownerId: text("owner_id"),
  creatorId: text("creator_id"),
  mintTxHash: text("mint_tx_hash"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertNftSchema = createInsertSchema(nfts).omit({
  id: true,
  createdAt: true,
});

export type InsertNft = z.infer<typeof insertNftSchema>;
export type Nft = typeof nfts.$inferSelect;

export const nftListings = pgTable("nft_listings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  nftId: text("nft_id").notNull(),
  sellerId: text("seller_id").notNull(),
  price: text("price").notNull(),
  currency: text("currency").notNull().default("DWT"),
  status: text("status").notNull().default("active"), // active, sold, cancelled
  expiresAt: timestamp("expires_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertNftListingSchema = createInsertSchema(nftListings).omit({
  id: true,
  createdAt: true,
});

export type InsertNftListing = z.infer<typeof insertNftListingSchema>;
export type NftListing = typeof nftListings.$inferSelect;

// ============================================
// TOKEN LAUNCHPAD
// ============================================

export const launchedTokens = pgTable("launched_tokens", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  symbol: text("symbol").notNull(),
  description: text("description"),
  imageUrl: text("image_url"),
  totalSupply: text("total_supply").notNull(),
  decimals: integer("decimals").notNull().default(18),
  creatorId: text("creator_id").notNull(),
  creatorAddress: text("creator_address").notNull(),
  contractAddress: text("contract_address"),
  initialPrice: text("initial_price").notNull().default("0.001"),
  currentPrice: text("current_price").notNull().default("0.001"),
  marketCap: text("market_cap").notNull().default("0"),
  holders: integer("holders").notNull().default(1),
  website: text("website"),
  twitter: text("twitter"),
  telegram: text("telegram"),
  status: text("status").notNull().default("pending"), // pending, live, paused, ended
  launchType: text("launch_type").notNull().default("fair"), // fair, presale, auction
  txHash: text("tx_hash"),
  // Auto-liquidity settings
  autoLiquidityPercent: integer("auto_liquidity_percent").notNull().default(75), // 50-100%
  lpLockDays: integer("lp_lock_days").notNull().default(90), // LP token lock duration
  platformFeePercent: text("platform_fee_percent").notNull().default("2.5"), // DarkWave fee
  // Raised funds tracking
  raisedAmount: text("raised_amount").notNull().default("0"),
  softCap: text("soft_cap").notNull().default("1000"),
  hardCap: text("hard_cap").notNull().default("100000"),
  // Auto-created liquidity pool
  liquidityPoolId: text("liquidity_pool_id"),
  lpTokensLocked: text("lp_tokens_locked").notNull().default("0"),
  lpUnlockDate: timestamp("lp_unlock_date"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  launchedAt: timestamp("launched_at"),
});

export const insertLaunchedTokenSchema = createInsertSchema(launchedTokens).omit({
  id: true,
  createdAt: true,
  launchedAt: true,
  liquidityPoolId: true,
  lpTokensLocked: true,
  lpUnlockDate: true,
}).extend({
  autoLiquidityPercent: z.number().min(50).max(95).default(75),
  lpLockDays: z.number().min(30).max(365).default(90),
  softCap: z.string().default("1000"),
  hardCap: z.string().default("100000"),
});

export type InsertLaunchedToken = z.infer<typeof insertLaunchedTokenSchema>;
export type LaunchedToken = typeof launchedTokens.$inferSelect;

// ============================================
// LIQUIDITY POOLS
// ============================================

export const liquidityPools = pgTable("liquidity_pools", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  tokenA: text("token_a").notNull(),
  tokenB: text("token_b").notNull(),
  reserveA: text("reserve_a").notNull().default("0"),
  reserveB: text("reserve_b").notNull().default("0"),
  totalLpTokens: text("total_lp_tokens").notNull().default("0"),
  fee: text("fee").notNull().default("0.003"),
  apr: text("apr").notNull().default("0"),
  volume24h: text("volume_24h").notNull().default("0"),
  tvl: text("tvl").notNull().default("0"),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertLiquidityPoolSchema = createInsertSchema(liquidityPools).omit({
  id: true,
  createdAt: true,
});

export type InsertLiquidityPool = z.infer<typeof insertLiquidityPoolSchema>;
export type LiquidityPool = typeof liquidityPools.$inferSelect;

export const liquidityPositions = pgTable("liquidity_positions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: text("user_id").notNull(),
  poolId: text("pool_id").notNull(),
  lpTokens: text("lp_tokens").notNull().default("0"),
  tokenADeposited: text("token_a_deposited").notNull().default("0"),
  tokenBDeposited: text("token_b_deposited").notNull().default("0"),
  earnedFees: text("earned_fees").notNull().default("0"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertLiquidityPositionSchema = createInsertSchema(liquidityPositions).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertLiquidityPosition = z.infer<typeof insertLiquidityPositionSchema>;
export type LiquidityPosition = typeof liquidityPositions.$inferSelect;

// ============================================
// PRICE HISTORY
// ============================================

export const priceHistory = pgTable("price_history", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  token: text("token").notNull(),
  price: text("price").notNull(),
  volume: text("volume").notNull().default("0"),
  marketCap: text("market_cap").notNull().default("0"),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
});

export const insertPriceHistorySchema = createInsertSchema(priceHistory).omit({
  id: true,
});

export type InsertPriceHistory = z.infer<typeof insertPriceHistorySchema>;
export type PriceHistory = typeof priceHistory.$inferSelect;

// ============================================
// WEBHOOKS / EVENTS API
// ============================================

export const webhooks = pgTable("webhooks", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: text("user_id").notNull(),
  url: text("url").notNull(),
  secret: text("secret").notNull(),
  events: text("events").notNull(), // JSON array of event types
  isActive: boolean("is_active").notNull().default(true),
  failureCount: integer("failure_count").notNull().default(0),
  lastTriggeredAt: timestamp("last_triggered_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertWebhookSchema = createInsertSchema(webhooks).omit({
  id: true,
  createdAt: true,
  lastTriggeredAt: true,
});

export type InsertWebhook = z.infer<typeof insertWebhookSchema>;
export type Webhook = typeof webhooks.$inferSelect;

export const webhookLogs = pgTable("webhook_logs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  webhookId: text("webhook_id").notNull(),
  event: text("event").notNull(),
  payload: text("payload").notNull(),
  responseStatus: integer("response_status"),
  responseBody: text("response_body"),
  success: boolean("success").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertWebhookLogSchema = createInsertSchema(webhookLogs).omit({
  id: true,
  createdAt: true,
});

export type InsertWebhookLog = z.infer<typeof insertWebhookLogSchema>;
export type WebhookLog = typeof webhookLogs.$inferSelect;

// ============================================
// LIQUID STAKING (stDWT)
// ============================================

export const liquidStakingState = pgTable("liquid_staking_state", {
  id: varchar("id").primaryKey().default("main"),
  totalDwtStaked: text("total_dwt_staked").notNull().default("0"),
  totalStDwtSupply: text("total_st_dwt_supply").notNull().default("0"),
  exchangeRate: text("exchange_rate").notNull().default("1000000000000000000"),
  targetApy: text("target_apy").notNull().default("12"),
  lastAccruedAt: timestamp("last_accrued_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertLiquidStakingStateSchema = createInsertSchema(liquidStakingState).omit({
  updatedAt: true,
});

export type InsertLiquidStakingState = z.infer<typeof insertLiquidStakingStateSchema>;
export type LiquidStakingState = typeof liquidStakingState.$inferSelect;

export const liquidStakingPositions = pgTable("liquid_staking_positions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: text("user_id").notNull(),
  stakedDwt: text("staked_dwt").notNull().default("0"),
  stDwtBalance: text("st_dwt_balance").notNull().default("0"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertLiquidStakingPositionSchema = createInsertSchema(liquidStakingPositions).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertLiquidStakingPosition = z.infer<typeof insertLiquidStakingPositionSchema>;
export type LiquidStakingPosition = typeof liquidStakingPositions.$inferSelect;

export const liquidStakingEvents = pgTable("liquid_staking_events", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: text("user_id").notNull(),
  eventType: text("event_type").notNull(),
  dwtAmount: text("dwt_amount").notNull(),
  stDwtAmount: text("st_dwt_amount").notNull(),
  exchangeRate: text("exchange_rate").notNull(),
  txHash: text("tx_hash"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertLiquidStakingEventSchema = createInsertSchema(liquidStakingEvents).omit({
  id: true,
  createdAt: true,
});

export type InsertLiquidStakingEvent = z.infer<typeof insertLiquidStakingEventSchema>;
export type LiquidStakingEvent = typeof liquidStakingEvents.$inferSelect;

export const APP_VERSION = "1.0.8";
