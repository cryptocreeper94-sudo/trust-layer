import { sql } from "drizzle-orm";
import { index, jsonb, pgTable, timestamp, varchar } from "drizzle-orm/pg-core";

// Session storage table.
// (IMPORTANT) This table is mandatory for Replit Auth, don't drop it.
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)]
);

// User storage table.
// (IMPORTANT) This table is mandatory for Replit Auth, don't drop it.
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique(),
  username: varchar("username").unique(),
  displayName: varchar("display_name"),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  signupPosition: varchar("signup_position"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Early Adopter Tracking - cumulative purchases and donations
export const earlyAdopterStats = pgTable("early_adopter_stats", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id).unique(),
  tokenPurchasePosition: varchar("token_purchase_position"),
  totalTokenPurchaseCents: varchar("total_token_purchase_cents").notNull().default("0"),
  crowdfundTotalCents: varchar("crowdfund_total_cents").notNull().default("0"),
  crowdfundTier: varchar("crowdfund_tier").default("none"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Signup counter for tracking early adopter positions
export const signupCounter = pgTable("signup_counter", {
  id: varchar("id").primaryKey().default("global"),
  currentPosition: varchar("current_position").notNull().default("0"),
  tokenPurchasePosition: varchar("token_purchase_position").notNull().default("0"),
});

export type EarlyAdopterStats = typeof earlyAdopterStats.$inferSelect;

export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;

// WebAuthn passkeys storage table
export const passkeys = pgTable("passkeys", {
  id: varchar("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id),
  credentialId: varchar("credential_id").notNull().unique(),
  publicKey: varchar("public_key").notNull(),
  counter: varchar("counter").notNull().default("0"),
  deviceType: varchar("device_type"),
  transports: varchar("transports"),
  createdAt: timestamp("created_at").defaultNow(),
  lastUsedAt: timestamp("last_used_at"),
});

export type Passkey = typeof passkeys.$inferSelect;
export type InsertPasskey = typeof passkeys.$inferInsert;

// AI Credits for users - tracks balance for AI assistant usage
export const userAiCredits = pgTable("user_ai_credits", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id).unique(),
  balanceCents: varchar("balance_cents").notNull().default("0"), // Credits in cents (100 = $1)
  totalPurchasedCents: varchar("total_purchased_cents").notNull().default("0"),
  totalUsedCents: varchar("total_used_cents").notNull().default("0"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export type UserAiCredits = typeof userAiCredits.$inferSelect;

// AI Usage logs for transparency
export const aiUsageLogs = pgTable("ai_usage_logs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  action: varchar("action").notNull(), // 'chat' or 'tts'
  costCents: varchar("cost_cents").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export type AiUsageLog = typeof aiUsageLogs.$inferSelect;
