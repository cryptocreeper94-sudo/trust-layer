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
  host: text("host").default("dwsc.io"),
  country: text("country"),
  city: text("city"),
  deviceType: text("device_type"),
  browser: text("browser"),
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
  estimatedCostDWC: z.string(),
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

// Hallmark Serial Ranges (12-digit system)
export const HALLMARK_SERIAL_RANGES = {
  GENESIS_FOUNDERS: { start: 1, end: 10000 },           // Ultra-rare first 10K
  LEGACY_FOUNDERS: { start: 10001, end: 50000 },        // Early adopters
  SPECIAL_RESERVE: { start: 50001, end: 300000 },       // Partnerships, events
  GENERAL_PUBLIC: { start: 300001, end: 999999999999 }, // Everyone else
} as const;

// User Hallmark Profiles (tracks their serial counter)
export const hallmarkProfiles = pgTable("hallmark_profiles", {
  userId: varchar("user_id").primaryKey(),
  avatarType: text("avatar_type").notNull().default("agent"),
  avatarId: text("avatar_id"),
  customAvatarUrl: text("custom_avatar_url"),
  currentSerial: integer("current_serial").notNull().default(0),
  preferredTemplate: text("preferred_template").default("classic"),
  displayName: text("display_name"),
  bio: text("bio"),
  tier: text("tier").notNull().default("GENERAL_PUBLIC"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Individual Hallmark Mints
export const hallmarkMints = pgTable("hallmark_mints", {
  id: varchar("id").primaryKey(),
  userId: varchar("user_id").notNull(),
  serialNumber: varchar("serial_number").notNull().unique(),
  globalSerial: text("global_serial").notNull().unique(),
  avatarSnapshot: text("avatar_snapshot"),
  templateUsed: text("template_used").notNull().default("classic"),
  payloadHash: varchar("payload_hash", { length: 128 }).notNull(),
  auditEventIds: text("audit_event_ids"),
  memoSignature: varchar("memo_signature", { length: 128 }),
  blockNumber: integer("block_number"),
  artworkUrl: text("artwork_url"),
  metadataUri: text("metadata_uri"),
  priceUsd: varchar("price_usd", { length: 20 }).notNull().default("0"),
  paymentProvider: text("payment_provider"),
  paymentId: varchar("payment_id"),
  status: text("status").notNull().default("draft"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  paidAt: timestamp("paid_at"),
  mintedAt: timestamp("minted_at"),
});

// Global Hallmark Counter (12-digit)
export const hallmarkGlobalCounter = pgTable("hallmark_global_counter", {
  id: varchar("id").primaryKey().default("global"),
  currentGlobalSerial: text("current_global_serial").notNull().default("0"),
  lastUpdated: timestamp("last_updated").defaultNow(),
});

export const insertHallmarkProfileSchema = createInsertSchema(hallmarkProfiles).omit({
  createdAt: true,
  updatedAt: true,
});

export const insertHallmarkMintSchema = createInsertSchema(hallmarkMints).omit({
  createdAt: true,
  paidAt: true,
  mintedAt: true,
});

export type InsertHallmarkProfile = z.infer<typeof insertHallmarkProfileSchema>;
export type HallmarkProfile = typeof hallmarkProfiles.$inferSelect;
export type InsertHallmarkMint = z.infer<typeof insertHallmarkMintSchema>;
export type HallmarkMint = typeof hallmarkMints.$inferSelect;

// Genesis Hallmark (the flagship first hallmark)
export const genesisHallmarkSchema = z.object({
  id: z.string(),
  globalSerial: z.string(),
  serialNumber: z.string(),
  payloadHash: z.string(),
  blockNumber: z.number().optional(),
  txHash: z.string().optional(),
  createdAt: z.string(),
  verificationUrl: z.string(),
  qrCodeData: z.string(),
});

export type GenesisHallmark = z.infer<typeof genesisHallmarkSchema>;

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

// Validators for Proof-of-Authority consensus
export const chainValidators = pgTable("chain_validators", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  address: text("address").notNull().unique(),
  name: text("name").notNull(),
  description: text("description"),
  status: text("status").notNull().default("active"), // active, inactive, suspended
  stake: text("stake").notNull().default("0"),
  blocksProduced: text("blocks_produced").notNull().default("0"),
  lastBlockAt: timestamp("last_block_at"),
  commission: text("commission").notNull().default("5"), // percentage
  uptime: text("uptime").notNull().default("100"),
  isFounder: boolean("is_founder").notNull().default(false),
  addedBy: text("added_by"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertChainValidatorSchema = createInsertSchema(chainValidators).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  blocksProduced: true,
  lastBlockAt: true,
  uptime: true,
});

export type InsertChainValidator = z.infer<typeof insertChainValidatorSchema>;
export type ChainValidator = typeof chainValidators.$inferSelect;

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
  minStake: text("min_stake").notNull().default("100"), // Minimum DWC to stake
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
  amount: text("amount").notNull().default("1000000000000000000000"), // 1000 DWC default
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
  tokenA: text("token_a").notNull(), // e.g., "DWC"
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
  currency: text("currency").notNull().default("DWC"),
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
// LIQUID STAKING (stDWC)
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

// ============================================
// BETA TESTERS & AIRDROP SYSTEM
// ============================================

export const betaTesterTiers = pgTable("beta_tester_tiers", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull().unique(),
  description: text("description"),
  allocation: text("allocation").notNull().default("0"),
  multiplier: text("multiplier").notNull().default("1"),
  maxMembers: integer("max_members"),
  benefits: text("benefits"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertBetaTesterTierSchema = createInsertSchema(betaTesterTiers).omit({
  id: true,
  createdAt: true,
});

export type InsertBetaTesterTier = z.infer<typeof insertBetaTesterTierSchema>;
export type BetaTesterTier = typeof betaTesterTiers.$inferSelect;

export const betaTesters = pgTable("beta_testers", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: text("user_id"),
  email: text("email"),
  walletAddress: text("wallet_address"),
  tierId: varchar("tier_id").references(() => betaTesterTiers.id),
  status: text("status").notNull().default("pending"),
  contributionScore: integer("contribution_score").notNull().default(0),
  contributionNotes: text("contribution_notes"),
  referralCode: text("referral_code"),
  referredBy: text("referred_by"),
  addedBy: text("added_by"),
  approvedAt: timestamp("approved_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertBetaTesterSchema = createInsertSchema(betaTesters).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  approvedAt: true,
});

export type InsertBetaTester = z.infer<typeof insertBetaTesterSchema>;
export type BetaTester = typeof betaTesters.$inferSelect;

export const airdropAllocations = pgTable("airdrop_allocations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  category: text("category").notNull().default("genesis"),
  totalAmount: text("total_amount").notNull().default("0"),
  claimedAmount: text("claimed_amount").notNull().default("0"),
  startDate: timestamp("start_date"),
  endDate: timestamp("end_date"),
  isActive: boolean("is_active").notNull().default(false),
  requiresWhitelist: boolean("requires_whitelist").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertAirdropAllocationSchema = createInsertSchema(airdropAllocations).omit({
  id: true,
  createdAt: true,
});

export type InsertAirdropAllocation = z.infer<typeof insertAirdropAllocationSchema>;
export type AirdropAllocation = typeof airdropAllocations.$inferSelect;

export const airdropClaims = pgTable("airdrop_claims", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  allocationId: varchar("allocation_id").references(() => airdropAllocations.id),
  userId: text("user_id"),
  walletAddress: text("wallet_address"),
  amount: text("amount").notNull().default("0"),
  status: text("status").notNull().default("pending"),
  claimTxHash: text("claim_tx_hash"),
  claimedAt: timestamp("claimed_at"),
  expiresAt: timestamp("expires_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertAirdropClaimSchema = createInsertSchema(airdropClaims).omit({
  id: true,
  createdAt: true,
  claimedAt: true,
});

export type InsertAirdropClaim = z.infer<typeof insertAirdropClaimSchema>;
export type AirdropClaim = typeof airdropClaims.$inferSelect;

export const tokenGifts = pgTable("token_gifts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  recipientUserId: text("recipient_user_id"),
  recipientEmail: text("recipient_email"),
  recipientWallet: text("recipient_wallet"),
  recipientName: text("recipient_name"),
  amount: text("amount").notNull().default("0"),
  reason: text("reason"),
  category: text("category").notNull().default("gift"),
  status: text("status").notNull().default("pending"),
  grantedBy: text("granted_by"),
  claimTxHash: text("claim_tx_hash"),
  claimedAt: timestamp("claimed_at"),
  expiresAt: timestamp("expires_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertTokenGiftSchema = createInsertSchema(tokenGifts).omit({
  id: true,
  createdAt: true,
  claimedAt: true,
});

export type InsertTokenGift = z.infer<typeof insertTokenGiftSchema>;
export type TokenGift = typeof tokenGifts.$inferSelect;

export const userXp = pgTable("user_xp", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: text("user_id").notNull(),
  walletAddress: text("wallet_address"),
  totalXp: integer("total_xp").notNull().default(0),
  level: integer("level").notNull().default(1),
  currentLevelXp: integer("current_level_xp").notNull().default(0),
  nextLevelXp: integer("next_level_xp").notNull().default(100),
  tier: text("tier").notNull().default("bronze"),
  streakDays: integer("streak_days").notNull().default(0),
  lastActivityAt: timestamp("last_activity_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertUserXpSchema = createInsertSchema(userXp).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertUserXp = z.infer<typeof insertUserXpSchema>;
export type UserXp = typeof userXp.$inferSelect;

export const quests = pgTable("quests", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull().default("general"),
  xpReward: integer("xp_reward").notNull().default(10),
  tokenReward: text("token_reward").default("0"),
  icon: text("icon").default("star"),
  difficulty: text("difficulty").notNull().default("easy"),
  actionType: text("action_type").notNull(),
  actionTarget: text("action_target"),
  requiredCount: integer("required_count").notNull().default(1),
  isRepeatable: boolean("is_repeatable").notNull().default(false),
  cooldownHours: integer("cooldown_hours"),
  isActive: boolean("is_active").notNull().default(true),
  startsAt: timestamp("starts_at"),
  endsAt: timestamp("ends_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertQuestSchema = createInsertSchema(quests).omit({
  id: true,
  createdAt: true,
});

export type InsertQuest = z.infer<typeof insertQuestSchema>;
export type Quest = typeof quests.$inferSelect;

export const protocolMissions = pgTable("protocol_missions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  description: text("description").notNull(),
  goal: text("goal").notNull(),
  currentProgress: text("current_progress").notNull().default("0"),
  targetProgress: text("target_progress").notNull(),
  rewardPool: text("reward_pool").notNull().default("0"),
  participantCount: integer("participant_count").notNull().default(0),
  status: text("status").notNull().default("active"),
  startsAt: timestamp("starts_at").notNull(),
  endsAt: timestamp("ends_at").notNull(),
  completedAt: timestamp("completed_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertProtocolMissionSchema = createInsertSchema(protocolMissions).omit({
  id: true,
  createdAt: true,
  completedAt: true,
});

export type InsertProtocolMission = z.infer<typeof insertProtocolMissionSchema>;
export type ProtocolMission = typeof protocolMissions.$inferSelect;

export const socialLeaderboard = pgTable("social_leaderboard", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: text("user_id").notNull(),
  displayName: text("display_name"),
  avatarUrl: text("avatar_url"),
  totalVolume: text("total_volume").notNull().default("0"),
  totalTrades: integer("total_trades").notNull().default(0),
  profitLoss: text("profit_loss").notNull().default("0"),
  winRate: text("win_rate").notNull().default("0"),
  totalXp: integer("total_xp").notNull().default(0),
  rank: integer("rank"),
  tier: text("tier").notNull().default("bronze"),
  isPublic: boolean("is_public").notNull().default(true),
  referralCode: text("referral_code"),
  referralCount: integer("referral_count").notNull().default(0),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertSocialLeaderboardSchema = createInsertSchema(socialLeaderboard).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertSocialLeaderboard = z.infer<typeof insertSocialLeaderboardSchema>;
export type SocialLeaderboard = typeof socialLeaderboard.$inferSelect;

// Legacy Founder Program - DarkWave Smart Chain Early Adopters
export const legacyFounders = pgTable("legacy_founders", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: text("email").notNull(),
  walletAddress: text("wallet_address"),
  paymentMethod: text("payment_method").notNull(), // 'stripe' or 'coinbase'
  paymentId: text("payment_id"), // Stripe session ID or Coinbase charge ID
  amountPaidCents: integer("amount_paid_cents").notNull().default(2400), // $24.00
  status: text("status").notNull().default("pending"), // pending, paid, airdrop_pending, completed
  airdropAmount: text("airdrop_amount").notNull().default("35000000000000000000000"), // 35,000 DWC (18 decimals)
  airdropTxHash: text("airdrop_tx_hash"),
  founderNumber: serial("founder_number"),
  referralCode: text("referral_code"),
  referredBy: text("referred_by"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  paidAt: timestamp("paid_at"),
  airdropDeliveredAt: timestamp("airdrop_delivered_at"),
});

export const insertLegacyFounderSchema = createInsertSchema(legacyFounders).omit({
  id: true,
  founderNumber: true,
  createdAt: true,
  paidAt: true,
  airdropDeliveredAt: true,
});

export type InsertLegacyFounder = z.infer<typeof insertLegacyFounderSchema>;
export type LegacyFounder = typeof legacyFounders.$inferSelect;

// Token allocation for transparency page
export const TOKEN_ALLOCATION = {
  publicSale: { amount: 40_000_000, percentage: 40, vesting: "None" },
  team: { amount: 15_000_000, percentage: 15, vesting: "6-month cliff, 12-month vest" },
  development: { amount: 20_000_000, percentage: 20, vesting: "Unlocked as needed" },
  marketing: { amount: 10_000_000, percentage: 10, vesting: "Unlocked" },
  liquidity: { amount: 10_000_000, percentage: 10, vesting: "Locked in DEX" },
  reserve: { amount: 5_000_000, percentage: 5, vesting: "12-month lock" },
} as const;

export const LEGACY_FOUNDER_CONFIG = {
  priceUsd: 24,
  priceCents: 2400,
  airdropTokens: 35000,
  maxSpots: 10000,
  deadline: new Date("2026-02-14T00:00:00Z"),
  regularPriceMonthly: 20,
  perks: [
    "Unlimited AI analysis (crypto & stocks)",
    "StrikeAgent sniper bot access",
    "Founding member badge",
    "Priority access to DWC staking pools",
    "Early access to all new features",
    "35,000 DWC coin airdrop on launch",
    "No recurring billing after initial payment",
  ],
} as const;

export const APP_VERSION = "1.2.2";

export const referralTracking = pgTable("referral_tracking", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  referrerId: text("referrer_id").notNull(),
  referrerEmail: text("referrer_email"),
  referralCode: text("referral_code").notNull(),
  referredUserId: text("referred_user_id"),
  referredEmail: text("referred_email").notNull(),
  referralType: text("referral_type").notNull().default("founder"),
  status: text("status").notNull().default("pending"),
  bonusAmount: text("bonus_amount").notNull().default("0"),
  bonusPaid: boolean("bonus_paid").notNull().default(false),
  bonusTxHash: text("bonus_tx_hash"),
  convertedAt: timestamp("converted_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertReferralTrackingSchema = createInsertSchema(referralTracking).omit({
  id: true,
  createdAt: true,
  convertedAt: true,
});

export type InsertReferralTracking = z.infer<typeof insertReferralTrackingSchema>;
export type ReferralTracking = typeof referralTracking.$inferSelect;

export const emailPreferences = pgTable("email_preferences", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: text("user_id").notNull().unique(),
  email: text("email").notNull(),
  stakingRewards: boolean("staking_rewards").notNull().default(true),
  largeTransfers: boolean("large_transfers").notNull().default(true),
  bridgeNotifications: boolean("bridge_notifications").notNull().default(true),
  referralBonuses: boolean("referral_bonuses").notNull().default(true),
  securityAlerts: boolean("security_alerts").notNull().default(true),
  marketingUpdates: boolean("marketing_updates").notNull().default(false),
  weeklyDigest: boolean("weekly_digest").notNull().default(true),
  largeTransferThreshold: text("large_transfer_threshold").notNull().default("10000"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertEmailPreferencesSchema = createInsertSchema(emailPreferences).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertEmailPreferences = z.infer<typeof insertEmailPreferencesSchema>;
export type EmailPreferences = typeof emailPreferences.$inferSelect;

export const gameSubmissions = pgTable("game_submissions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: text("user_id").notNull(),
  gameName: text("game_name").notNull(),
  description: text("description").notNull(),
  repoUrl: text("repo_url").notNull(),
  status: text("status").notNull().default("pending"),
  securityScore: integer("security_score"),
  fairnessScore: integer("fairness_score"),
  performanceScore: integer("performance_score"),
  uxScore: integer("ux_score"),
  codeQualityScore: integer("code_quality_score"),
  overallScore: integer("overall_score"),
  aiReview: text("ai_review"),
  reviewedAt: timestamp("reviewed_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertGameSubmissionSchema = createInsertSchema(gameSubmissions).omit({
  id: true,
  createdAt: true,
  reviewedAt: true,
  securityScore: true,
  fairnessScore: true,
  performanceScore: true,
  uxScore: true,
  codeQualityScore: true,
  overallScore: true,
  aiReview: true,
  status: true,
});

export type InsertGameSubmission = z.infer<typeof insertGameSubmissionSchema>;
export type GameSubmission = typeof gameSubmissions.$inferSelect;

export const crashRounds = pgTable("crash_rounds", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  roundNumber: serial("round_number"),
  serverSeed: text("server_seed").notNull(),
  serverSeedHash: text("server_seed_hash").notNull(),
  crashPoint: text("crash_point"),
  totalBets: text("total_bets").default("0"),
  totalPayout: text("total_payout").default("0"),
  status: text("status").notNull().default("pending"),
  startedAt: timestamp("started_at"),
  crashedAt: timestamp("crashed_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const crashBets = pgTable("crash_bets", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  roundId: text("round_id").notNull(),
  oderId: text("user_id").notNull(),
  username: text("username").notNull(),
  betAmount: text("bet_amount").notNull(),
  autoCashout: text("auto_cashout"),
  cashoutMultiplier: text("cashout_multiplier"),
  payout: text("payout"),
  status: text("status").notNull().default("active"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const gameChatMessages = pgTable("game_chat_messages", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  gameType: text("game_type").notNull(),
  userId: text("user_id").notNull(),
  username: text("username").notNull(),
  message: text("message").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const playerRewards = pgTable("player_rewards", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  oderId: text("user_id").notNull(),
  pendingRewards: text("pending_rewards").notNull().default("0"),
  totalEarned: text("total_earned").notNull().default("0"),
  totalClaimed: text("total_claimed").notNull().default("0"),
  tier: text("tier").notNull().default("bronze"),
  totalWagered: text("total_wagered").notNull().default("0"),
  gamesPlayed: integer("games_played").notNull().default(0),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const gameAirdrops = pgTable("game_airdrops", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  poolAmount: text("pool_amount").notNull(),
  participantCount: integer("participant_count").notNull(),
  status: text("status").notNull().default("pending"),
  distributedAt: timestamp("distributed_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type CrashRound = typeof crashRounds.$inferSelect;
export type CrashBet = typeof crashBets.$inferSelect;
export type GameChatMessage = typeof gameChatMessages.$inferSelect;
export type PlayerRewards = typeof playerRewards.$inferSelect;
export type GameAirdrop = typeof gameAirdrops.$inferSelect;

// Player Gaming Stats - Complete History
export const playerGameHistory = pgTable("player_game_history", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: text("user_id").notNull(),
  username: text("username").notNull(),
  gameType: text("game_type").notNull(), // crash, coinflip, slots
  betAmount: text("bet_amount").notNull(),
  multiplier: text("multiplier"), // for crash
  payout: text("payout").notNull(),
  profit: text("profit").notNull(), // can be negative
  outcome: text("outcome").notNull(), // win, loss, push
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertPlayerGameHistorySchema = createInsertSchema(playerGameHistory).omit({
  id: true,
  createdAt: true,
});

export type InsertPlayerGameHistory = z.infer<typeof insertPlayerGameHistorySchema>;
export type PlayerGameHistory = typeof playerGameHistory.$inferSelect;

// Player Stats Summary - Aggregated data
export const playerStats = pgTable("player_stats", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: text("user_id").notNull().unique(),
  username: text("username").notNull(),
  totalGamesPlayed: integer("total_games_played").notNull().default(0),
  totalWagered: text("total_wagered").notNull().default("0"),
  totalWon: text("total_won").notNull().default("0"),
  totalLost: text("total_lost").notNull().default("0"),
  netProfit: text("net_profit").notNull().default("0"),
  winCount: integer("win_count").notNull().default(0),
  lossCount: integer("loss_count").notNull().default(0),
  winRate: text("win_rate").notNull().default("0"),
  bestMultiplier: text("best_multiplier").notNull().default("0"),
  currentStreak: integer("current_streak").notNull().default(0),
  bestStreak: integer("best_streak").notNull().default(0),
  level: integer("level").notNull().default(1),
  xp: integer("xp").notNull().default(0),
  xpToNextLevel: integer("xp_to_next_level").notNull().default(100),
  joinedAt: timestamp("joined_at").defaultNow().notNull(),
  lastPlayedAt: timestamp("last_played_at"),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertPlayerStatsSchema = createInsertSchema(playerStats).omit({
  id: true,
  joinedAt: true,
  updatedAt: true,
});

export type InsertPlayerStats = z.infer<typeof insertPlayerStatsSchema>;
export type PlayerStats = typeof playerStats.$inferSelect;

// Daily Profit Tracking for Charts
export const playerDailyProfit = pgTable("player_daily_profit", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: text("user_id").notNull(),
  date: text("date").notNull(), // YYYY-MM-DD
  gamesPlayed: integer("games_played").notNull().default(0),
  wagered: text("wagered").notNull().default("0"),
  profit: text("profit").notNull().default("0"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type PlayerDailyProfit = typeof playerDailyProfit.$inferSelect;

// ============================================
// SWEEPSTAKES SYSTEM (GC/SC)
// ============================================

// User sweepstakes balances
export const sweepsBalances = pgTable("sweeps_balances", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: text("user_id").notNull().unique(),
  goldCoins: text("gold_coins").notNull().default("0"), // Purchased, no cash value
  sweepsCoins: text("sweeps_coins").notNull().default("0"), // Free bonus, redeemable
  totalGcPurchased: text("total_gc_purchased").notNull().default("0"),
  totalScEarned: text("total_sc_earned").notNull().default("0"),
  totalScRedeemed: text("total_sc_redeemed").notNull().default("0"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertSweepsBalanceSchema = createInsertSchema(sweepsBalances).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type SweepsBalance = typeof sweepsBalances.$inferSelect;
export type InsertSweepsBalance = z.infer<typeof insertSweepsBalanceSchema>;

// Coin pack purchases
export const sweepsPurchases = pgTable("sweeps_purchases", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: text("user_id").notNull(),
  packId: text("pack_id").notNull(), // starter, value, mega, whale
  packName: text("pack_name").notNull(),
  priceUsd: text("price_usd").notNull(),
  goldCoinsAmount: text("gold_coins_amount").notNull(),
  sweepsCoinsBonus: text("sweeps_coins_bonus").notNull(), // Free SC included
  stripePaymentId: text("stripe_payment_id"),
  status: text("status").notNull().default("pending"), // pending, completed, failed, refunded
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertSweepsPurchaseSchema = createInsertSchema(sweepsPurchases).omit({
  id: true,
  createdAt: true,
});

export type SweepsPurchase = typeof sweepsPurchases.$inferSelect;
export type InsertSweepsPurchase = z.infer<typeof insertSweepsPurchaseSchema>;

// Free SC bonuses (daily login, social, AMOE)
export const sweepsBonuses = pgTable("sweeps_bonuses", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: text("user_id").notNull(),
  bonusType: text("bonus_type").notNull(), // daily_login, social_share, amoe_mail, signup, streak
  sweepsCoinsAmount: text("sweeps_coins_amount").notNull(),
  goldCoinsAmount: text("gold_coins_amount").notNull().default("0"),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertSweepsBonusSchema = createInsertSchema(sweepsBonuses).omit({
  id: true,
  createdAt: true,
});

export type SweepsBonus = typeof sweepsBonuses.$inferSelect;
export type InsertSweepsBonus = z.infer<typeof insertSweepsBonusSchema>;

// Daily login tracking
export const sweepsDailyLogin = pgTable("sweeps_daily_login", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: text("user_id").notNull(),
  loginDate: text("login_date").notNull(), // YYYY-MM-DD
  streakDay: integer("streak_day").notNull().default(1), // 1-7 for weekly streak
  bonusClaimed: boolean("bonus_claimed").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type SweepsDailyLogin = typeof sweepsDailyLogin.$inferSelect;

// SC Redemptions to DWC
export const sweepsRedemptions = pgTable("sweeps_redemptions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: text("user_id").notNull(),
  sweepsCoinsAmount: text("sweeps_coins_amount").notNull(),
  dwcAmount: text("dwc_amount").notNull(), // 1:1 conversion
  walletAddress: text("wallet_address").notNull(),
  status: text("status").notNull().default("pending"), // pending, processing, completed, rejected
  kycVerified: boolean("kyc_verified").notNull().default(false),
  processedAt: timestamp("processed_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertSweepsRedemptionSchema = createInsertSchema(sweepsRedemptions).omit({
  id: true,
  createdAt: true,
  processedAt: true,
});

export type SweepsRedemption = typeof sweepsRedemptions.$inferSelect;
export type InsertSweepsRedemption = z.infer<typeof insertSweepsRedemptionSchema>;

// Game history for sweeps (tracks which currency used)
export const sweepsGameHistory = pgTable("sweeps_game_history", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: text("user_id").notNull(),
  gameType: text("game_type").notNull(), // crash, coinflip, slots
  currencyType: text("currency_type").notNull(), // gc or sc
  betAmount: text("bet_amount").notNull(),
  multiplier: text("multiplier"),
  payout: text("payout").notNull(),
  profit: text("profit").notNull(),
  outcome: text("outcome").notNull(), // win, loss
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertSweepsGameHistorySchema = createInsertSchema(sweepsGameHistory).omit({
  id: true,
  createdAt: true,
});

export type SweepsGameHistory = typeof sweepsGameHistory.$inferSelect;
export type InsertSweepsGameHistory = z.infer<typeof insertSweepsGameHistorySchema>;

// Coin pack definitions (not stored in DB, just types)
export const coinPackSchema = z.object({
  id: z.string(),
  name: z.string(),
  priceUsd: z.number(),
  goldCoins: z.number(),
  sweepsCoinsBonus: z.number(),
  popular: z.boolean().optional(),
  bestValue: z.boolean().optional(),
});

export type CoinPack = z.infer<typeof coinPackSchema>;

// ==================== SPADES CARD GAME ====================

// Spades games table
export const spadesGames = pgTable("spades_games", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  status: text("status").notNull().default("waiting"), // waiting, bidding, playing, finished
  gameMode: text("game_mode").notNull().default("vs_ai"), // vs_ai, multiplayer
  difficulty: text("difficulty").default("medium"), // easy, medium, hard (for AI games)
  targetScore: integer("target_score").notNull().default(500),
  currentRound: integer("current_round").notNull().default(1),
  currentTrick: integer("current_trick").notNull().default(1),
  currentPlayerIndex: integer("current_player_index").notNull().default(0),
  leadSuit: text("lead_suit"), // current trick's lead suit
  spadesbroken: boolean("spades_broken").notNull().default(false),
  team1Score: integer("team1_score").notNull().default(0),
  team2Score: integer("team2_score").notNull().default(0),
  team1Bags: integer("team1_bags").notNull().default(0),
  team2Bags: integer("team2_bags").notNull().default(0),
  team1RoundTricks: integer("team1_round_tricks").notNull().default(0),
  team2RoundTricks: integer("team2_round_tricks").notNull().default(0),
  team1Bid: integer("team1_bid"),
  team2Bid: integer("team2_bid"),
  cardsPlayed: text("cards_played").default("[]"), // JSON array of played cards in current trick
  winnerId: text("winner_id"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertSpadesGameSchema = createInsertSchema(spadesGames).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type SpadesGame = typeof spadesGames.$inferSelect;
export type InsertSpadesGame = z.infer<typeof insertSpadesGameSchema>;

// Spades players in a game
export const spadesPlayers = pgTable("spades_players", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  gameId: varchar("game_id").notNull(),
  oderId: text("user_id"), // null for AI players
  playerName: text("player_name").notNull(),
  isAI: boolean("is_ai").notNull().default(false),
  seatPosition: integer("seat_position").notNull(), // 0-3 (0=South/you, 1=West, 2=North/partner, 3=East)
  teamNumber: integer("team_number").notNull(), // 1 or 2 (positions 0,2 = team1, positions 1,3 = team2)
  hand: text("hand").default("[]"), // JSON array of cards
  bid: integer("bid"),
  tricksWon: integer("tricks_won").notNull().default(0),
  isConnected: boolean("is_connected").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertSpadesPlayerSchema = createInsertSchema(spadesPlayers).omit({
  id: true,
  createdAt: true,
});

export type SpadesPlayer = typeof spadesPlayers.$inferSelect;
export type InsertSpadesPlayer = z.infer<typeof insertSpadesPlayerSchema>;

// Spades player stats (lifetime)
export const spadesStats = pgTable("spades_stats", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  oderId: text("user_id").notNull().unique(),
  gamesPlayed: integer("games_played").notNull().default(0),
  gamesWon: integer("games_won").notNull().default(0),
  totalBids: integer("total_bids").notNull().default(0),
  bidsMade: integer("bids_made").notNull().default(0),
  nilBidsAttempted: integer("nil_bids_attempted").notNull().default(0),
  nilBidsSuccessful: integer("nil_bids_successful").notNull().default(0),
  blindNilsAttempted: integer("blind_nils_attempted").notNull().default(0),
  blindNilsSuccessful: integer("blind_nils_successful").notNull().default(0),
  totalBags: integer("total_bags").notNull().default(0),
  highestScore: integer("highest_score").notNull().default(0),
  currentStreak: integer("current_streak").notNull().default(0),
  longestStreak: integer("longest_streak").notNull().default(0),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertSpadesStatsSchema = createInsertSchema(spadesStats).omit({
  id: true,
  updatedAt: true,
});

export type SpadesStats = typeof spadesStats.$inferSelect;
export type InsertSpadesStats = z.infer<typeof insertSpadesStatsSchema>;

// Card type for Spades
export const cardSchema = z.object({
  suit: z.enum(["spades", "hearts", "diamonds", "clubs"]),
  rank: z.enum(["2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"]),
});

export type Card = z.infer<typeof cardSchema>;

// Community Roadmap Features
export const roadmapFeatures = pgTable("roadmap_features", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull().default("general"),
  status: text("status").notNull().default("proposed"),
  priority: integer("priority").notNull().default(0),
  targetRelease: text("target_release"),
  createdBy: text("created_by"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertRoadmapFeatureSchema = createInsertSchema(roadmapFeatures).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type RoadmapFeature = typeof roadmapFeatures.$inferSelect;
export type InsertRoadmapFeature = z.infer<typeof insertRoadmapFeatureSchema>;

export const roadmapVotes = pgTable("roadmap_votes", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  featureId: varchar("feature_id").notNull().references(() => roadmapFeatures.id, { onDelete: "cascade" }),
  oderId: text("user_id").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertRoadmapVoteSchema = createInsertSchema(roadmapVotes).omit({
  id: true,
  createdAt: true,
});

export type RoadmapVote = typeof roadmapVotes.$inferSelect;
export type InsertRoadmapVote = z.infer<typeof insertRoadmapVoteSchema>;

// Crowdfunding System
export const crowdfundCampaigns = pgTable("crowdfund_campaigns", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  description: text("description").notNull(),
  goalAmountCents: integer("goal_amount_cents").notNull().default(0),
  raisedAmountCents: integer("raised_amount_cents").notNull().default(0),
  currency: text("currency").notNull().default("USD"),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertCrowdfundCampaignSchema = createInsertSchema(crowdfundCampaigns).omit({
  id: true,
  raisedAmountCents: true,
  createdAt: true,
  updatedAt: true,
});

export type CrowdfundCampaign = typeof crowdfundCampaigns.$inferSelect;
export type InsertCrowdfundCampaign = z.infer<typeof insertCrowdfundCampaignSchema>;

export const crowdfundFeatures = pgTable("crowdfund_features", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  campaignId: varchar("campaign_id").references(() => crowdfundCampaigns.id),
  title: text("title").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull().default("general"),
  goalAmountCents: integer("goal_amount_cents").notNull().default(0),
  raisedAmountCents: integer("raised_amount_cents").notNull().default(0),
  status: text("status").notNull().default("proposed"),
  priority: integer("priority").notNull().default(0),
  targetRelease: text("target_release"),
  imageUrl: text("image_url"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertCrowdfundFeatureSchema = createInsertSchema(crowdfundFeatures).omit({
  id: true,
  raisedAmountCents: true,
  createdAt: true,
  updatedAt: true,
});

export type CrowdfundFeature = typeof crowdfundFeatures.$inferSelect;
export type InsertCrowdfundFeature = z.infer<typeof insertCrowdfundFeatureSchema>;

export const crowdfundContributions = pgTable("crowdfund_contributions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  campaignId: varchar("campaign_id").references(() => crowdfundCampaigns.id),
  featureId: varchar("feature_id").references(() => crowdfundFeatures.id),
  userId: text("user_id"),
  displayName: text("display_name"),
  amountCents: integer("amount_cents").notNull(),
  currency: text("currency").notNull().default("USD"),
  paymentMethod: text("payment_method").notNull().default("stripe"),
  stripePaymentIntentId: text("stripe_payment_intent_id"),
  cryptoTxHash: text("crypto_tx_hash"),
  transparencyHash: text("transparency_hash"),
  status: text("status").notNull().default("pending"),
  isAnonymous: boolean("is_anonymous").notNull().default(false),
  message: text("message"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertCrowdfundContributionSchema = createInsertSchema(crowdfundContributions).omit({
  id: true,
  transparencyHash: true,
  createdAt: true,
});

export type CrowdfundContribution = typeof crowdfundContributions.$inferSelect;
export type InsertCrowdfundContribution = z.infer<typeof insertCrowdfundContributionSchema>;

// Roadmap tables
export const roadmapPhases = pgTable("roadmap_phases", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  roadmapType: text("roadmap_type").notNull(), // "chronicles" or "ecosystem"
  name: text("name").notNull(),
  description: text("description").notNull(),
  order: integer("order").notNull().default(0),
  status: text("status").notNull().default("upcoming"), // upcoming, in_progress, completed
  targetDate: text("target_date"),
  completedAt: timestamp("completed_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertRoadmapPhaseSchema = createInsertSchema(roadmapPhases).omit({
  id: true,
  completedAt: true,
  createdAt: true,
});

export type RoadmapPhase = typeof roadmapPhases.$inferSelect;
export type InsertRoadmapPhase = z.infer<typeof insertRoadmapPhaseSchema>;

export const roadmapMilestones = pgTable("roadmap_milestones", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  phaseId: varchar("phase_id").references(() => roadmapPhases.id),
  title: text("title").notNull(),
  description: text("description").notNull(),
  order: integer("order").notNull().default(0),
  status: text("status").notNull().default("pending"), // pending, in_progress, completed
  isRequired: boolean("is_required").notNull().default(true),
  targetDate: text("target_date"),
  completedAt: timestamp("completed_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertRoadmapMilestoneSchema = createInsertSchema(roadmapMilestones).omit({
  id: true,
  completedAt: true,
  createdAt: true,
});

export type RoadmapMilestone = typeof roadmapMilestones.$inferSelect;
export type InsertRoadmapMilestone = z.infer<typeof insertRoadmapMilestoneSchema>;

// Token Presale tables
export const presalePurchases = pgTable("presale_purchases", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: text("user_id"),
  walletAddress: text("wallet_address"),
  email: text("email"),
  tokenAmount: integer("token_amount").notNull().default(0),
  usdAmountCents: integer("usd_amount_cents").notNull().default(0),
  paymentMethod: text("payment_method").notNull().default("stripe"),
  stripePaymentIntentId: text("stripe_payment_intent_id"),
  cryptoTxHash: text("crypto_tx_hash"),
  status: text("status").notNull().default("pending"),
  tier: text("tier").notNull().default("standard"),
  bonusPercentage: integer("bonus_percentage").notNull().default(0),
  referralCode: text("referral_code"),
  referredBy: text("referred_by"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertPresalePurchaseSchema = createInsertSchema(presalePurchases).omit({
  id: true,
  createdAt: true,
});

export type PresalePurchase = typeof presalePurchases.$inferSelect;
export type InsertPresalePurchase = z.infer<typeof insertPresalePurchaseSchema>;

export const presaleHolders = pgTable("presale_holders", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  walletAddress: text("wallet_address").notNull().unique(),
  email: text("email"),
  totalTokens: integer("total_tokens").notNull().default(0),
  totalInvestedCents: integer("total_invested_cents").notNull().default(0),
  tier: text("tier").notNull().default("standard"),
  earlyAdopterRank: integer("early_adopter_rank"),
  bonusTokens: integer("bonus_tokens").notNull().default(0),
  referralCode: text("referral_code").unique(),
  referralCount: integer("referral_count").notNull().default(0),
  referralEarnings: integer("referral_earnings").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertPresaleHolderSchema = createInsertSchema(presaleHolders).omit({
  id: true,
  earlyAdopterRank: true,
  createdAt: true,
  updatedAt: true,
});

export type PresaleHolder = typeof presaleHolders.$inferSelect;
export type InsertPresaleHolder = z.infer<typeof insertPresaleHolderSchema>;

// Blockchain Domain Service tables
export const blockchainDomains = pgTable("blockchain_domains", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull().unique(), // e.g., "alice" (without .dwsc)
  tld: text("tld").notNull().default("dwsc"), // top-level domain
  ownerAddress: text("owner_address").notNull(), // wallet address
  ownerUserId: text("owner_user_id"), // optional user ID
  registrationTxHash: text("registration_tx_hash"),
  registeredAt: timestamp("registered_at").defaultNow().notNull(),
  expiresAt: timestamp("expires_at"), // null for lifetime ownership
  ownershipType: text("ownership_type").notNull().default("term"), // "term" or "lifetime"
  isPremium: boolean("is_premium").notNull().default(false),
  isProtected: boolean("is_protected").notNull().default(false), // reserved names
  primaryWallet: text("primary_wallet"), // default wallet resolution
  avatarUrl: text("avatar_url"),
  description: text("description"),
  website: text("website"),
  email: text("email"),
  twitter: text("twitter"),
  discord: text("discord"),
  telegram: text("telegram"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertBlockchainDomainSchema = createInsertSchema(blockchainDomains).omit({
  id: true,
  registeredAt: true,
  createdAt: true,
  updatedAt: true,
});

export type BlockchainDomain = typeof blockchainDomains.$inferSelect;
export type InsertBlockchainDomain = z.infer<typeof insertBlockchainDomainSchema>;

export const domainRecords = pgTable("domain_records", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  domainId: varchar("domain_id").notNull().references(() => blockchainDomains.id, { onDelete: "cascade" }),
  recordType: text("record_type").notNull(), // WALLET, TEXT, URL, CONTENT_HASH
  key: text("key").notNull(), // e.g., "eth", "sol", "btc", "avatar", "url"
  value: text("value").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertDomainRecordSchema = createInsertSchema(domainRecords).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type DomainRecord = typeof domainRecords.$inferSelect;
export type InsertDomainRecord = z.infer<typeof insertDomainRecordSchema>;

export const domainTransfers = pgTable("domain_transfers", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  domainId: varchar("domain_id").notNull().references(() => blockchainDomains.id, { onDelete: "cascade" }),
  fromAddress: text("from_address").notNull(),
  toAddress: text("to_address").notNull(),
  txHash: text("tx_hash"),
  transferredAt: timestamp("transferred_at").defaultNow().notNull(),
});

export const insertDomainTransferSchema = createInsertSchema(domainTransfers).omit({
  id: true,
  transferredAt: true,
});

export type DomainTransfer = typeof domainTransfers.$inferSelect;
export type InsertDomainTransfer = z.infer<typeof insertDomainTransferSchema>;

// Domain pricing tiers
export const domainPricingSchema = z.object({
  length: z.number(), // character length
  priceUsd: z.number(), // annual price in USD
  priceDwc: z.number(), // annual price in DWC
});

export type DomainPricing = z.infer<typeof domainPricingSchema>;

// Chronicles Sponsorship System - Early Adopter Benefits
export const chronicleSponsorshipSlots = pgTable("chronicle_sponsorship_slots", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  eraId: text("era_id").notNull(), // Which historical era (e.g., "medieval", "renaissance")
  districtTier: text("district_tier").notNull(), // "prime", "signature", "emerging"
  locationName: text("location_name").notNull(), // Human-readable location name
  description: text("description"),
  capacity: integer("capacity").notNull().default(1), // How many businesses can share this slot
  currentOccupancy: integer("current_occupancy").notNull().default(0),
  status: text("status").notNull().default("available"), // "available", "claimed", "reserved"
  minimumDomainTier: text("minimum_domain_tier"), // Which domain tier qualifies ("ultra_premium", "premium", etc.)
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertChronicleSponsorshipSlotSchema = createInsertSchema(chronicleSponsorshipSlots).omit({
  id: true,
  currentOccupancy: true,
  createdAt: true,
  updatedAt: true,
});

export type ChronicleSponsorshipSlot = typeof chronicleSponsorshipSlots.$inferSelect;
export type InsertChronicleSponsorshipSlot = z.infer<typeof insertChronicleSponsorshipSlotSchema>;

// Domain sponsorship claims - links domains to sponsorship slots
export const domainSponsorshipClaims = pgTable("domain_sponsorship_claims", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  domainId: varchar("domain_id").notNull().references(() => blockchainDomains.id, { onDelete: "cascade" }),
  slotId: varchar("slot_id").notNull().references(() => chronicleSponsorshipSlots.id, { onDelete: "cascade" }),
  businessName: text("business_name"),
  businessUrl: text("business_url"),
  businessDescription: text("business_description"),
  verificationStatus: text("verification_status").notNull().default("pending"), // "pending", "verified", "rejected"
  activationDate: timestamp("activation_date"),
  expiryDate: timestamp("expiry_date"), // null for lifetime domain holders (36 months + renewal)
  engagementMetrics: text("engagement_metrics"), // JSON blob for impressions, clicks, conversions
  isEarlyAdopter: boolean("is_early_adopter").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertDomainSponsorshipClaimSchema = createInsertSchema(domainSponsorshipClaims).omit({
  id: true,
  verificationStatus: true,
  activationDate: true,
  engagementMetrics: true,
  createdAt: true,
  updatedAt: true,
});

export type DomainSponsorshipClaim = typeof domainSponsorshipClaims.$inferSelect;
export type InsertDomainSponsorshipClaim = z.infer<typeof insertDomainSponsorshipClaimSchema>;

// Early Adopter Program tracking
export const earlyAdopterProgram = pgTable("early_adopter_program", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  programName: text("program_name").notNull().default("Domain Launch"),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date").notNull(),
  maxRegistrations: integer("max_registrations").notNull().default(5000),
  currentRegistrations: integer("current_registrations").notNull().default(0),
  discountPercent: integer("discount_percent").notNull().default(30),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type EarlyAdopterProgram = typeof earlyAdopterProgram.$inferSelect;

// Partner Access Requests - for studio partnership inquiries
export const partnerAccessRequests = pgTable("partner_access_requests", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  studioName: text("studio_name").notNull(),
  contactName: text("contact_name").notNull(),
  email: text("email").notNull(),
  website: text("website"),
  teamSize: text("team_size"),
  expertise: text("expertise"), // "graphics", "ai", "narrative", "full-stack", etc.
  previousProjects: text("previous_projects"),
  interestReason: text("interest_reason"),
  partnershipType: text("partnership_type"), // "co-dev", "graphics", "ai-tech"
  ndaAccepted: boolean("nda_accepted").notNull().default(false),
  status: text("status").notNull().default("pending"), // "pending", "approved", "rejected"
  accessCode: text("access_code"), // Generated on approval
  reviewedBy: text("reviewed_by"),
  reviewedAt: timestamp("reviewed_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertPartnerAccessRequestSchema = createInsertSchema(partnerAccessRequests).omit({
  id: true,
  status: true,
  accessCode: true,
  reviewedBy: true,
  reviewedAt: true,
  createdAt: true,
});

export type PartnerAccessRequest = typeof partnerAccessRequests.$inferSelect;
export type InsertPartnerAccessRequest = z.infer<typeof insertPartnerAccessRequestSchema>;

// Marketing Posts - Social media auto-deployment system
export const marketingPosts = pgTable("marketing_posts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  platform: text("platform").notNull(), // "twitter", "facebook", "telegram", "discord"
  content: text("content").notNull(),
  imageUrl: text("image_url"),
  category: text("category").notNull().default("general"), // "vision", "tech", "community", "hype", "news"
  status: text("status").notNull().default("active"), // "active", "used", "archived"
  usedCount: integer("used_count").notNull().default(0),
  lastUsedAt: timestamp("last_used_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertMarketingPostSchema = createInsertSchema(marketingPosts).omit({
  id: true,
  usedCount: true,
  lastUsedAt: true,
  createdAt: true,
});

export type MarketingPost = typeof marketingPosts.$inferSelect;
export type InsertMarketingPost = z.infer<typeof insertMarketingPostSchema>;

// Marketing Deploy Logs - Track what was posted and when
export const marketingDeployLogs = pgTable("marketing_deploy_logs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  postId: varchar("post_id").notNull(),
  platform: text("platform").notNull(),
  status: text("status").notNull().default("pending"), // "pending", "success", "failed"
  externalId: text("external_id"), // Tweet ID, Telegram message ID, etc.
  errorMessage: text("error_message"),
  deployedAt: timestamp("deployed_at").defaultNow().notNull(),
});

export const insertMarketingDeployLogSchema = createInsertSchema(marketingDeployLogs).omit({
  id: true,
  deployedAt: true,
});

export type MarketingDeployLog = typeof marketingDeployLogs.$inferSelect;
export type InsertMarketingDeployLog = z.infer<typeof insertMarketingDeployLogSchema>;

// Marketing Schedule Config - Platform settings and timing
export const marketingScheduleConfig = pgTable("marketing_schedule_config", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  platform: text("platform").notNull().unique(), // "twitter", "facebook", "telegram", "discord"
  isActive: boolean("is_active").notNull().default(false),
  intervalMinutes: integer("interval_minutes").notNull().default(180), // Default 3 hours
  lastDeployedAt: timestamp("last_deployed_at"),
  webhookUrl: text("webhook_url"), // For Discord
  channelId: text("channel_id"), // For Telegram
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type MarketingScheduleConfig = typeof marketingScheduleConfig.$inferSelect;

// =====================================================
// CHRONICLES PERSONALITY AI SYSTEM
// =====================================================
// The Personality AI adapts to become the player's "parallel self"
// in the DarkWave Chronicles fantasy world. It learns from:
// - Player choices and actions
// - Stated beliefs and values
// - Emotional responses to scenarios
// - Play style and decision patterns
//
// The AI uses a 5-Axis Emotion System:
// 1. Courage ↔ Fear
// 2. Hope ↔ Despair  
// 3. Trust ↔ Suspicion
// 4. Passion ↔ Apathy
// 5. Wisdom ↔ Recklessness
//
// The Belief System Layer tracks:
// - Worldview (optimist/realist/pessimist)
// - Moral compass (lawful/neutral/chaotic × good/neutral/evil)
// - Core values (justice, freedom, power, knowledge, love, etc.)
// - Political alignment (within game world factions)
// =====================================================

export const playerPersonalities = pgTable("player_personalities", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: text("user_id").notNull().unique(),
  
  // Identity
  playerName: text("player_name").notNull().default("Hero"),
  parallelSelfName: text("parallel_self_name"), // Name in Chronicles world
  
  // 5-Axis Emotion System (-100 to +100)
  courageFear: integer("courage_fear").notNull().default(0), // Positive = courage, Negative = fear
  hopeDespair: integer("hope_despair").notNull().default(0), // Positive = hope, Negative = despair
  trustSuspicion: integer("trust_suspicion").notNull().default(0), // Positive = trust, Negative = suspicion
  passionApathy: integer("passion_apathy").notNull().default(0), // Positive = passion, Negative = apathy
  wisdomRecklessness: integer("wisdom_recklessness").notNull().default(0), // Positive = wisdom, Negative = recklessness
  
  // Belief System Layer
  worldview: text("worldview").notNull().default("realist"), // "optimist", "realist", "pessimist"
  moralAlignment: text("moral_alignment").notNull().default("neutral_good"), // D&D style alignment
  coreValues: text("core_values").array().notNull().default(sql`'{}'::text[]`), // ["justice", "freedom", etc.]
  factionAffinity: text("faction_affinity"), // Which Chronicles faction they lean toward
  
  // Play Style Traits
  decisionStyle: text("decision_style").notNull().default("balanced"), // "impulsive", "analytical", "balanced", "intuitive"
  conflictApproach: text("conflict_approach").notNull().default("diplomatic"), // "aggressive", "diplomatic", "avoidant", "strategic"
  explorationStyle: text("exploration_style").notNull().default("thorough"), // "speedrun", "thorough", "completionist", "story_focused"
  
  // Personality Insights (AI-generated summaries)
  personalitySummary: text("personality_summary"),
  strengthsWeaknesses: text("strengths_weaknesses"),
  predictedArchetype: text("predicted_archetype"), // "Guardian", "Seeker", "Rebel", etc.
  
  // Learning Data
  totalChoicesMade: integer("total_choices_made").notNull().default(0),
  lastInteractionAt: timestamp("last_interaction_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertPlayerPersonalitySchema = createInsertSchema(playerPersonalities).omit({
  id: true,
  totalChoicesMade: true,
  lastInteractionAt: true,
  createdAt: true,
  updatedAt: true,
});

export type PlayerPersonality = typeof playerPersonalities.$inferSelect;
export type InsertPlayerPersonality = z.infer<typeof insertPlayerPersonalitySchema>;

// Player Choice History - Tracks decisions for personality learning
export const playerChoices = pgTable("player_choices", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  personalityId: varchar("personality_id").notNull(),
  
  // Context
  scenarioType: text("scenario_type").notNull(), // "moral_dilemma", "combat", "social", "exploration"
  scenarioDescription: text("scenario_description").notNull(),
  era: text("era"), // Which of the 70+ historical eras
  
  // Choice Made
  optionsPresented: text("options_presented").array().notNull(),
  chosenOption: text("chosen_option").notNull(),
  choiceReasoning: text("choice_reasoning"), // Optional player explanation
  
  // Impact Analysis (AI-generated)
  emotionalImpact: text("emotional_impact"), // JSON: { courageFear: +5, hopeDespair: -3, ... }
  alignmentImpact: text("alignment_impact"), // How this affects moral alignment
  
  chosenAt: timestamp("chosen_at").defaultNow().notNull(),
});

export const insertPlayerChoiceSchema = createInsertSchema(playerChoices).omit({
  id: true,
  emotionalImpact: true,
  alignmentImpact: true,
  chosenAt: true,
});

export type PlayerChoice = typeof playerChoices.$inferSelect;
export type InsertPlayerChoice = z.infer<typeof insertPlayerChoiceSchema>;

// AI Conversation Memory - For context continuity
export const chroniclesConversations = pgTable("chronicles_conversations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  personalityId: varchar("personality_id").notNull(),
  
  // Conversation context
  era: text("era"),
  location: text("location"),
  npcName: text("npc_name"),
  
  // Messages
  messages: text("messages").notNull(), // JSON array of {role, content}
  
  // Summary for long-term memory
  conversationSummary: text("conversation_summary"),
  keyInsights: text("key_insights").array(),
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type ChroniclesConversation = typeof chroniclesConversations.$inferSelect;

// =====================================================
// DARKWAVE CREDITS SYSTEM
// =====================================================
// Credits are the universal currency for AI-powered features
// Users purchase credits to interact with AI, train personalities,
// create voice clones, and prepare their "parallel self" for launch
// =====================================================

export const userCredits = pgTable("user_credits", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: text("user_id").notNull().unique(),
  
  // Credit Balance
  creditBalance: integer("credit_balance").notNull().default(0),
  lifetimeCreditsEarned: integer("lifetime_credits_earned").notNull().default(0),
  lifetimeCreditsSpent: integer("lifetime_credits_spent").notNull().default(0),
  
  // Bonus tracking
  bonusCredits: integer("bonus_credits").notNull().default(0), // From promotions, etc.
  
  // Rate limiting
  dailyUsageCount: integer("daily_usage_count").notNull().default(0),
  dailyUsageDate: text("daily_usage_date"), // YYYY-MM-DD format for daily reset
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertUserCreditsSchema = createInsertSchema(userCredits).omit({
  id: true,
  lifetimeCreditsEarned: true,
  lifetimeCreditsSpent: true,
  dailyUsageCount: true,
  dailyUsageDate: true,
  createdAt: true,
  updatedAt: true,
});

export type UserCredits = typeof userCredits.$inferSelect;
export type InsertUserCredits = z.infer<typeof insertUserCreditsSchema>;

// Credit Transactions - Purchase and usage history
export const creditTransactions = pgTable("credit_transactions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: text("user_id").notNull(),
  
  // Transaction details
  type: text("type").notNull(), // "purchase", "usage", "bonus", "refund"
  amount: integer("amount").notNull(), // Positive = credit, Negative = debit
  balanceAfter: integer("balance_after").notNull(),
  
  // Context
  description: text("description").notNull(),
  category: text("category"), // "voice_clone", "ai_chat", "scenario", "purchase"
  stripePaymentId: text("stripe_payment_id"), // For purchases
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertCreditTransactionSchema = createInsertSchema(creditTransactions).omit({
  id: true,
  createdAt: true,
});

export type CreditTransaction = typeof creditTransactions.$inferSelect;
export type InsertCreditTransaction = z.infer<typeof insertCreditTransactionSchema>;

// Credit Packages - Available for purchase
export const creditPackages = pgTable("credit_packages", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(), // "Starter", "Builder", "Architect", "Founder"
  credits: integer("credits").notNull(),
  bonusCredits: integer("bonus_credits").notNull().default(0),
  priceUsd: integer("price_usd").notNull(), // In cents
  stripePriceId: text("stripe_price_id"), // Optional: for recurring subscriptions
  isActive: boolean("is_active").notNull().default(true),
  sortOrder: integer("sort_order").notNull().default(0),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type CreditPackage = typeof creditPackages.$inferSelect;

// =====================================================
// VOICE CLONING SYSTEM
// =====================================================
// Stores user voice samples for creating their parallel self's voice
// =====================================================

export const voiceSamples = pgTable("voice_samples", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: text("user_id").notNull(),
  personalityId: varchar("personality_id"),
  
  // Sample info
  sampleUrl: text("sample_url"), // URL to stored audio file
  sampleDurationSec: integer("sample_duration_sec"),
  transcriptText: text("transcript_text"), // What they said
  
  // Voice clone status
  voiceCloneId: text("voice_clone_id"), // ID from ElevenLabs/Resemble
  voiceCloneProvider: text("voice_clone_provider"), // "elevenlabs", "resemble"
  cloneStatus: text("clone_status").notNull().default("pending"), // "pending", "processing", "ready", "failed"
  
  // Quality tracking
  qualityScore: integer("quality_score"), // 0-100 based on sample quality
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertVoiceSampleSchema = createInsertSchema(voiceSamples).omit({
  id: true,
  voiceCloneId: true,
  cloneStatus: true,
  qualityScore: true,
  createdAt: true,
  updatedAt: true,
});

export type VoiceSample = typeof voiceSamples.$inferSelect;
export type InsertVoiceSample = z.infer<typeof insertVoiceSampleSchema>;

// Voice Usage Tracking - For rate limiting voice API calls
export const voiceUsage = pgTable("voice_usage", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: text("user_id").notNull(),
  
  // Usage tracking
  usageType: text("usage_type").notNull(), // "tts", "stt", "clone"
  creditsUsed: integer("credits_used").notNull(),
  charactersProcessed: integer("characters_processed"),
  durationMs: integer("duration_ms"),
  
  // Context
  sessionId: text("session_id"),
  provider: text("provider"), // "browser", "elevenlabs", "resemble"
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type VoiceUsage = typeof voiceUsage.$inferSelect;

// =====================================================
// TREASURY ALLOCATION SYSTEM
// =====================================================
// Transparent allocation tracking for DWC treasury funds
// =====================================================

export const treasuryAllocationCategories = [
  "development",
  "marketing", 
  "staking_rewards",
  "team_founder",
  "operations",
  "reserve"
] as const;

export type TreasuryAllocationCategory = typeof treasuryAllocationCategories[number];

export const treasuryAllocations = pgTable("treasury_allocations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  category: text("category").notNull(), // development, marketing, staking_rewards, team_founder, operations, reserve
  percentage: integer("percentage").notNull(), // 30, 20, 20, 15, 10, 5
  label: text("label").notNull(), // "Development", "Marketing", etc.
  description: text("description"),
  color: text("color").notNull(), // Tailwind color for UI
  icon: text("icon"), // Icon name for UI
  isActive: boolean("is_active").notNull().default(true),
  sortOrder: integer("sort_order").notNull().default(0),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertTreasuryAllocationSchema = createInsertSchema(treasuryAllocations).omit({
  id: true,
  updatedAt: true,
});

export type TreasuryAllocation = typeof treasuryAllocations.$inferSelect;
export type InsertTreasuryAllocation = z.infer<typeof insertTreasuryAllocationSchema>;

export const treasuryLedger = pgTable("treasury_ledger", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  category: text("category").notNull(), // Which allocation bucket
  amountDwc: text("amount_dwc").notNull(), // Amount in DWC
  amountUsd: text("amount_usd"), // Optional USD equivalent
  transactionType: text("transaction_type").notNull(), // "deposit", "withdrawal", "allocation"
  txHash: text("tx_hash"), // On-chain tx hash if applicable
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertTreasuryLedgerSchema = createInsertSchema(treasuryLedger).omit({
  id: true,
  createdAt: true,
});

export type TreasuryLedgerEntry = typeof treasuryLedger.$inferSelect;
export type InsertTreasuryLedgerEntry = z.infer<typeof insertTreasuryLedgerSchema>;

// Protocol Fee Configuration (for display purposes)
export const protocolFeeConfigSchema = z.object({
  dexSwapFee: z.string(),
  nftMarketplaceFee: z.string(),
  bridgeFee: z.string(),
  launchpadFee: z.string(),
  stakingRewardsSource: z.string(),
});

export type ProtocolFeeConfig = z.infer<typeof protocolFeeConfigSchema>;

// =====================================================
// OWNER ADMIN PORTAL
// =====================================================

// Owner/Admin designation - who has access to owner portal
export const ownerAdmins = pgTable("owner_admins", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: text("user_id").notNull(),
  email: text("email"),
  displayName: text("display_name"),
  role: text("role").notNull().default("admin"), // "owner" | "admin" | "moderator"
  hosts: text("hosts").array().default(sql`ARRAY['dwsc.io', 'yourlegacy.io']::text[]`), // Which hosts they can access
  permissions: text("permissions").array().default(sql`ARRAY['analytics', 'seo', 'marketing', 'rewards']::text[]`),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertOwnerAdminSchema = createInsertSchema(ownerAdmins).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type OwnerAdmin = typeof ownerAdmins.$inferSelect;
export type InsertOwnerAdmin = z.infer<typeof insertOwnerAdminSchema>;

// SEO Configuration per route/host
export const seoConfigs = pgTable("seo_configs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  host: text("host").notNull().default("dwsc.io"), // dwsc.io, yourlegacy.io, etc.
  route: text("route").notNull().default("/"), // /presale, /chronicles, etc.
  title: text("title"),
  description: text("description"),
  keywords: text("keywords"),
  ogTitle: text("og_title"),
  ogDescription: text("og_description"),
  ogImage: text("og_image"),
  ogType: text("og_type").default("website"),
  twitterCard: text("twitter_card").default("summary_large_image"),
  twitterTitle: text("twitter_title"),
  twitterDescription: text("twitter_description"),
  twitterImage: text("twitter_image"),
  canonicalUrl: text("canonical_url"),
  robots: text("robots").default("index, follow"),
  structuredData: text("structured_data"), // JSON-LD as string
  customTags: text("custom_tags"), // Additional meta tags as JSON
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertSeoConfigSchema = createInsertSchema(seoConfigs).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type SeoConfig = typeof seoConfigs.$inferSelect;
export type InsertSeoConfig = z.infer<typeof insertSeoConfigSchema>;

// =====================================================
// REFERRAL & AFFILIATE SYSTEM
// =====================================================
// Multi-host referral program for dwsc.io and yourlegacy.io
// =====================================================

export const REFERRAL_HOSTS = ["dwsc.io", "yourlegacy.io"] as const;
export type ReferralHost = typeof REFERRAL_HOSTS[number];

export const AFFILIATE_TIERS = ["explorer", "builder", "architect", "oracle"] as const;
export type AffiliateTier = typeof AFFILIATE_TIERS[number];

export const REFERRAL_STATUS = ["pending", "qualified", "converted", "expired", "fraud"] as const;
export type ReferralStatus = typeof REFERRAL_STATUS[number];

// Referral Codes - Unique codes per user per host
export const referralCodes = pgTable("referral_codes", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: text("user_id").notNull(),
  code: text("code").notNull().unique(),
  host: text("host").notNull().default("dwsc.io"),
  isActive: boolean("is_active").notNull().default(true),
  clickCount: integer("click_count").notNull().default(0),
  signupCount: integer("signup_count").notNull().default(0),
  conversionCount: integer("conversion_count").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertReferralCodeSchema = createInsertSchema(referralCodes).omit({
  id: true,
  clickCount: true,
  signupCount: true,
  conversionCount: true,
  createdAt: true,
  updatedAt: true,
});

export type ReferralCode = typeof referralCodes.$inferSelect;
export type InsertReferralCode = z.infer<typeof insertReferralCodeSchema>;

// Referrals - Tracks who referred whom
export const referrals = pgTable("referrals", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  referrerId: text("referrer_id").notNull(),
  refereeId: text("referee_id").notNull(),
  referralCodeId: varchar("referral_code_id").references(() => referralCodes.id),
  host: text("host").notNull().default("dwsc.io"),
  status: text("status").notNull().default("pending"),
  referrerReward: integer("referrer_reward").notNull().default(0),
  refereeReward: integer("referee_reward").notNull().default(0),
  conversionValue: integer("conversion_value").default(0),
  commissionAmount: integer("commission_amount").default(0),
  qualifiedAt: timestamp("qualified_at"),
  convertedAt: timestamp("converted_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertReferralSchema = createInsertSchema(referrals).omit({
  id: true,
  qualifiedAt: true,
  convertedAt: true,
  createdAt: true,
});

export type Referral = typeof referrals.$inferSelect;
export type InsertReferral = z.infer<typeof insertReferralSchema>;

// Referral Events - Granular milestone tracking
export const referralEvents = pgTable("referral_events", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  referralId: varchar("referral_id").notNull().references(() => referrals.id, { onDelete: "cascade" }),
  eventType: text("event_type").notNull(),
  eventData: text("event_data"),
  creditsAwarded: integer("credits_awarded").default(0),
  commissionAwarded: integer("commission_awarded").default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertReferralEventSchema = createInsertSchema(referralEvents).omit({
  id: true,
  createdAt: true,
});

export type ReferralEvent = typeof referralEvents.$inferSelect;
export type InsertReferralEvent = z.infer<typeof insertReferralEventSchema>;

// Affiliate Tiers - Configurable tier thresholds and perks
export const affiliateTiers = pgTable("affiliate_tiers", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  host: text("host").notNull().default("dwsc.io"),
  minConversions: integer("min_conversions").notNull().default(0),
  minRevenue: integer("min_revenue").notNull().default(0),
  referrerRewardCredits: integer("referrer_reward_credits").notNull().default(250),
  refereeRewardCredits: integer("referee_reward_credits").notNull().default(100),
  commissionPercent: integer("commission_percent").notNull().default(10),
  badgeColor: text("badge_color").default("#06b6d4"),
  description: text("description"),
  isActive: boolean("is_active").notNull().default(true),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertAffiliateTierSchema = createInsertSchema(affiliateTiers).omit({
  id: true,
  createdAt: true,
});

export type AffiliateTierRecord = typeof affiliateTiers.$inferSelect;
export type InsertAffiliateTier = z.infer<typeof insertAffiliateTierSchema>;

// Commission Payouts - Disbursement ledger with full lifecycle tracking
export const commissionPayouts = pgTable("commission_payouts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: text("user_id").notNull(),
  affiliateUserId: text("affiliate_user_id"),
  host: text("host").notNull().default("dwsc.io"),
  amount: integer("amount").notNull(),
  currency: text("currency").notNull().default("USD"),
  status: text("status").notNull().default("pending"),
  payoutStatus: text("payout_status").notNull().default("accruing"),
  distributionMode: text("distribution_mode").notNull().default("cash"),
  amountDwc: text("amount_dwc"),
  exchangeRate: text("exchange_rate"),
  exchangeRateSource: text("exchange_rate_source"),
  treasuryTxHash: text("treasury_tx_hash"),
  payoutTransactionHash: text("payout_transaction_hash"),
  payoutMethod: text("payout_method"),
  paidAt: timestamp("paid_at"),
  orbitSyncStatus: text("orbit_sync_status").default("pending"),
  orbitSyncedAt: timestamp("orbit_synced_at"),
  stripePaymentIntent: text("stripe_payment_intent"),
  stripeSettlementStatus: text("stripe_settlement_status"),
  settledAt: timestamp("settled_at"),
  eligibleForPayoutAt: timestamp("eligible_for_payout_at"),
  payoutBatchId: text("payout_batch_id"),
  paymentMethod: text("payment_method"),
  paymentDetails: text("payment_details"),
  processedAt: timestamp("processed_at"),
  failureReason: text("failure_reason"),
  retryCount: integer("retry_count").default(0),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertCommissionPayoutSchema = createInsertSchema(commissionPayouts).omit({
  id: true,
  treasuryTxHash: true,
  orbitSyncedAt: true,
  settledAt: true,
  eligibleForPayoutAt: true,
  processedAt: true,
  createdAt: true,
  updatedAt: true,
});

export type CommissionPayout = typeof commissionPayouts.$inferSelect;
export type InsertCommissionPayout = z.infer<typeof insertCommissionPayoutSchema>;

// User Affiliate Profile - Stores per-user affiliate status with wallet for DWC payouts
export const affiliateProfiles = pgTable("affiliate_profiles", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: text("user_id").notNull().unique(),
  currentTier: text("current_tier").notNull().default("explorer"),
  totalReferrals: integer("total_referrals").notNull().default(0),
  qualifiedReferrals: integer("qualified_referrals").notNull().default(0),
  lifetimeConversions: integer("lifetime_conversions").notNull().default(0),
  lifetimeCreditsEarned: integer("lifetime_credits_earned").notNull().default(0),
  lifetimeCommissionEarned: integer("lifetime_commission_earned").notNull().default(0),
  pendingCommission: integer("pending_commission").notNull().default(0),
  paidCommission: integer("paid_commission").notNull().default(0),
  airdropBalance: integer("airdrop_balance").notNull().default(0),
  airdropBalanceDwc: text("airdrop_balance_dwc"),
  airdropStatus: text("airdrop_status").default("accumulating"),
  preferredHost: text("preferred_host").default("dwsc.io"),
  dwcWalletAddress: text("dwc_wallet_address"),
  walletVerified: boolean("wallet_verified").default(false),
  walletVerifiedAt: timestamp("wallet_verified_at"),
  minPayoutThreshold: integer("min_payout_threshold").default(5000),
  payoutMethod: text("payout_method").default("dwc"),
  payoutDetails: text("payout_details"),
  isAffiliate: boolean("is_affiliate").notNull().default(false),
  affiliateApprovedAt: timestamp("affiliate_approved_at"),
  lastPayoutAt: timestamp("last_payout_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertAffiliateProfileSchema = createInsertSchema(affiliateProfiles).omit({
  id: true,
  totalReferrals: true,
  qualifiedReferrals: true,
  lifetimeConversions: true,
  lifetimeCreditsEarned: true,
  lifetimeCommissionEarned: true,
  pendingCommission: true,
  paidCommission: true,
  airdropBalance: true,
  airdropBalanceDwc: true,
  airdropStatus: true,
  affiliateApprovedAt: true,
  createdAt: true,
  updatedAt: true,
});

export type AffiliateProfile = typeof affiliateProfiles.$inferSelect;
export type InsertAffiliateProfile = z.infer<typeof insertAffiliateProfileSchema>;

// Fraud Flags - Soft indicators for suspicious activity
export const fraudFlags = pgTable("fraud_flags", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  referralId: varchar("referral_id").references(() => referrals.id),
  userId: text("user_id"),
  flagType: text("flag_type").notNull(),
  reason: text("reason").notNull(),
  severity: text("severity").notNull().default("low"),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  isResolved: boolean("is_resolved").notNull().default(false),
  resolvedBy: text("resolved_by"),
  resolvedAt: timestamp("resolved_at"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertFraudFlagSchema = createInsertSchema(fraudFlags).omit({
  id: true,
  isResolved: true,
  resolvedBy: true,
  resolvedAt: true,
  createdAt: true,
});

export type FraudFlag = typeof fraudFlags.$inferSelect;
export type InsertFraudFlag = z.infer<typeof insertFraudFlagSchema>;

// Referral reward constants
export const REFERRAL_REWARDS = {
  REFERRER_SIGNUP_BONUS: 250,
  REFEREE_SIGNUP_BONUS: 100,
  REFERRER_CONVERSION_BONUS: 500,
  COMMISSION_PERCENT_DEFAULT: 10,
} as const;

// ============================================
// COMMUNITY HUB
// ============================================

export const communities = pgTable("communities", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  description: text("description"),
  icon: text("icon").default("⚡"),
  imageUrl: text("image_url"),
  ownerId: text("owner_id").notNull(),
  isVerified: boolean("is_verified").notNull().default(false),
  isPublic: boolean("is_public").notNull().default(true),
  memberCount: integer("member_count").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const communityChannels = pgTable("community_channels", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  communityId: varchar("community_id").notNull().references(() => communities.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  description: text("description"),
  type: text("type").notNull().default("chat"),
  position: integer("position").notNull().default(0),
  isLocked: boolean("is_locked").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const communityMembers = pgTable("community_members", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  communityId: varchar("community_id").notNull().references(() => communities.id, { onDelete: "cascade" }),
  userId: text("user_id").notNull(),
  username: text("username").notNull(),
  role: text("role").notNull().default("member"),
  isOnline: boolean("is_online").notNull().default(false),
  lastSeenAt: timestamp("last_seen_at").defaultNow(),
  joinedAt: timestamp("joined_at").defaultNow().notNull(),
});

export const communityMessages = pgTable("community_messages", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  channelId: varchar("channel_id").notNull().references(() => communityChannels.id, { onDelete: "cascade" }),
  userId: text("user_id").notNull(),
  username: text("username").notNull(),
  content: text("content").notNull(),
  isBot: boolean("is_bot").notNull().default(false),
  replyToId: varchar("reply_to_id"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  editedAt: timestamp("edited_at"),
});

export const communityBots = pgTable("community_bots", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  communityId: varchar("community_id").notNull().references(() => communities.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  description: text("description"),
  icon: text("icon").default("🤖"),
  webhookUrl: text("webhook_url"),
  apiKey: text("api_key"),
  isActive: boolean("is_active").notNull().default(true),
  permissions: text("permissions").default("read,write"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const messageReactions = pgTable("message_reactions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  messageId: varchar("message_id").notNull().references(() => communityMessages.id, { onDelete: "cascade" }),
  userId: text("user_id").notNull(),
  username: text("username").notNull(),
  emoji: text("emoji").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const messageAttachments = pgTable("message_attachments", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  messageId: varchar("message_id").notNull().references(() => communityMessages.id, { onDelete: "cascade" }),
  type: text("type").notNull(),
  url: text("url").notNull(),
  filename: text("filename"),
  size: integer("size"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const memberTips = pgTable("member_tips", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  fromUserId: text("from_user_id").notNull(),
  fromUsername: text("from_username").notNull(),
  toUserId: text("to_user_id").notNull(),
  toUsername: text("to_username").notNull(),
  communityId: varchar("community_id").notNull().references(() => communities.id, { onDelete: "cascade" }),
  amount: text("amount").notNull(),
  messageId: varchar("message_id"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertCommunitySchema = createInsertSchema(communities).omit({
  id: true,
  memberCount: true,
  createdAt: true,
  updatedAt: true,
});

export const insertChannelSchema = createInsertSchema(communityChannels).omit({
  id: true,
  createdAt: true,
});

export const insertMemberSchema = createInsertSchema(communityMembers).omit({
  id: true,
  isOnline: true,
  lastSeenAt: true,
  joinedAt: true,
});

export const insertCommunityMessageSchema = createInsertSchema(communityMessages).omit({
  id: true,
  createdAt: true,
  editedAt: true,
});

export const insertBotSchema = createInsertSchema(communityBots).omit({
  id: true,
  createdAt: true,
});

export const insertReactionSchema = createInsertSchema(messageReactions).omit({
  id: true,
  createdAt: true,
});

export const insertAttachmentSchema = createInsertSchema(messageAttachments).omit({
  id: true,
  createdAt: true,
});

export const insertTipSchema = createInsertSchema(memberTips).omit({
  id: true,
  createdAt: true,
});

// =====================================================
// ORBS ECONOMY SYSTEM
// =====================================================

export const orbWallets = pgTable("orb_wallets", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: text("user_id").notNull().unique(),
  username: text("username").notNull(),
  balance: integer("balance").notNull().default(0),
  lockedBalance: integer("locked_balance").notNull().default(0),
  totalEarned: integer("total_earned").notNull().default(0),
  totalSpent: integer("total_spent").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const orbTransactions = pgTable("orb_transactions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  walletId: varchar("wallet_id").notNull().references(() => orbWallets.id, { onDelete: "cascade" }),
  userId: text("user_id").notNull(),
  type: text("type").notNull(), // 'earn', 'spend', 'tip_sent', 'tip_received', 'purchase', 'refund', 'conversion'
  amount: integer("amount").notNull(),
  balance: integer("balance").notNull(), // Balance after transaction
  description: text("description"),
  referenceId: text("reference_id"), // For linking to tips, purchases, etc.
  referenceType: text("reference_type"), // 'tip', 'stripe_payment', 'feature_unlock', etc.
  metadata: text("metadata"), // JSON string for extra data
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const orbConversionSnapshots = pgTable("orb_conversion_snapshots", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: text("user_id").notNull(),
  walletId: varchar("wallet_id").notNull().references(() => orbWallets.id),
  orbBalance: integer("orb_balance").notNull(),
  dwcAmount: text("dwc_amount").notNull(), // Conversion amount in DWC
  conversionRate: text("conversion_rate").notNull(),
  status: text("status").notNull().default("pending"), // 'pending', 'converted', 'claimed'
  snapshotAt: timestamp("snapshot_at").defaultNow().notNull(),
  convertedAt: timestamp("converted_at"),
});

export const insertOrbWalletSchema = createInsertSchema(orbWallets).omit({
  id: true,
  balance: true,
  lockedBalance: true,
  totalEarned: true,
  totalSpent: true,
  createdAt: true,
  updatedAt: true,
});

export const insertOrbTransactionSchema = createInsertSchema(orbTransactions).omit({
  id: true,
  createdAt: true,
});

export type OrbWallet = typeof orbWallets.$inferSelect;
export type InsertOrbWallet = z.infer<typeof insertOrbWalletSchema>;
export type OrbTransaction = typeof orbTransactions.$inferSelect;
export type InsertOrbTransaction = z.infer<typeof insertOrbTransactionSchema>;
export type OrbConversionSnapshot = typeof orbConversionSnapshots.$inferSelect;

export type Community = typeof communities.$inferSelect;
export type InsertCommunity = z.infer<typeof insertCommunitySchema>;
export type CommunityChannel = typeof communityChannels.$inferSelect;
export type InsertChannel = z.infer<typeof insertChannelSchema>;
export type CommunityMember = typeof communityMembers.$inferSelect;
export type InsertMember = z.infer<typeof insertMemberSchema>;
export type CommunityMessage = typeof communityMessages.$inferSelect;
export type InsertCommunityMessage = z.infer<typeof insertCommunityMessageSchema>;
export type CommunityBot = typeof communityBots.$inferSelect;
export type InsertBot = z.infer<typeof insertBotSchema>;
export type MessageReaction = typeof messageReactions.$inferSelect;
export type InsertReaction = z.infer<typeof insertReactionSchema>;
export type MessageAttachment = typeof messageAttachments.$inferSelect;
export type InsertAttachment = z.infer<typeof insertAttachmentSchema>;
export type MemberTip = typeof memberTips.$inferSelect;
export type InsertTip = z.infer<typeof insertTipSchema>;
