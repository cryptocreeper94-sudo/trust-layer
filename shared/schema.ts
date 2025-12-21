import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export * from "./models/auth";

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

export const APP_VERSION = "1.0.0-alpha";
