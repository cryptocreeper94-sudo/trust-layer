import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

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

export const APP_VERSION = "1.0.0-alpha";
