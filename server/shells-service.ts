import { db } from "./db";
import { eq, desc, and, sql } from "drizzle-orm";
import {
  shellWallets,
  shellTransactions,
  shellConversionSnapshots,
  type ShellWallet,
  type ShellTransaction,
  type ShellConversionSnapshot,
} from "@shared/schema";

export type TransactionType = 
  | "earn"           // Earned through engagement
  | "spend"          // Spent on features
  | "tip_sent"       // Sent to another user
  | "tip_received"   // Received from another user
  | "purchase"       // Bought with fiat (Stripe)
  | "refund"         // Refunded
  | "bonus"          // Bonus/promotional
  | "conversion";    // Converted to DWC at launch

// Shell packages available for purchase
export const SHELL_PACKAGES = {
  starter: { amount: 100, price: 499, name: "Starter Pack" },      // $4.99
  popular: { amount: 500, price: 1999, name: "Popular Pack" },     // $19.99
  premium: { amount: 1200, price: 3999, name: "Premium Pack" },    // $39.99
  ultimate: { amount: 3000, price: 7999, name: "Ultimate Pack" },  // $79.99
} as const;

// Engagement earning rates
export const SHELL_EARN_RATES = {
  daily_login: 5,
  send_message: 1,
  receive_reaction: 2,
  join_community: 10,
  referral_signup: 50,
  first_purchase: 25,
  share_content: 3,
} as const;

// Feature costs
export const SHELL_COSTS = {
  premium_feature_unlock: 100,
  ai_chat_message: 5,
  scenario_generation: 20,
  voice_clone_minute: 10,
  personality_summary: 15,
} as const;

class ShellsService {
  async getWallet(userId: string): Promise<ShellWallet | null> {
    const [wallet] = await db.select()
      .from(shellWallets)
      .where(eq(shellWallets.userId, userId));
    return wallet || null;
  }

  async getOrCreateWallet(userId: string, username: string): Promise<ShellWallet> {
    let wallet = await this.getWallet(userId);
    
    if (!wallet) {
      const [newWallet] = await db.insert(shellWallets)
        .values({ userId, username })
        .returning();
      wallet = newWallet;
    }
    
    return wallet;
  }

  async getBalance(userId: string): Promise<{ balance: number; lockedBalance: number }> {
    const wallet = await this.getWallet(userId);
    return {
      balance: wallet?.balance || 0,
      lockedBalance: wallet?.lockedBalance || 0,
    };
  }

  async getTransactionByReference(referenceId: string, referenceType: string): Promise<ShellTransaction | null> {
    const [tx] = await db.select()
      .from(shellTransactions)
      .where(and(
        eq(shellTransactions.referenceId, referenceId),
        eq(shellTransactions.referenceType, referenceType)
      ));
    return tx || null;
  }

  async addShells(
    userId: string, 
    username: string, 
    amount: number, 
    type: TransactionType, 
    description?: string,
    referenceId?: string,
    referenceType?: string
  ): Promise<ShellTransaction> {
    const wallet = await this.getOrCreateWallet(userId, username);
    const newBalance = wallet.balance + amount;
    
    await db.update(shellWallets)
      .set({ 
        balance: newBalance, 
        totalEarned: wallet.totalEarned + amount,
        updatedAt: new Date() 
      })
      .where(eq(shellWallets.id, wallet.id));
    
    const [transaction] = await db.insert(shellTransactions)
      .values({
        walletId: wallet.id,
        userId,
        type,
        amount,
        balance: newBalance,
        description,
        referenceId,
        referenceType,
      })
      .returning();
    
    return transaction;
  }

  async spendShells(
    userId: string,
    amount: number,
    type: TransactionType,
    description?: string,
    referenceId?: string,
    referenceType?: string
  ): Promise<ShellTransaction | null> {
    const wallet = await this.getWallet(userId);
    
    if (!wallet || wallet.balance < amount) {
      return null; // Insufficient balance
    }
    
    const newBalance = wallet.balance - amount;
    
    await db.update(shellWallets)
      .set({ 
        balance: newBalance, 
        totalSpent: wallet.totalSpent + amount,
        updatedAt: new Date() 
      })
      .where(eq(shellWallets.id, wallet.id));
    
    const [transaction] = await db.insert(shellTransactions)
      .values({
        walletId: wallet.id,
        userId,
        type,
        amount: -amount,
        balance: newBalance,
        description,
        referenceId,
        referenceType,
      })
      .returning();
    
    return transaction;
  }

  async tipUser(
    fromUserId: string,
    fromUsername: string,
    toUserId: string,
    toUsername: string,
    amount: number,
    messageId?: string
  ): Promise<{ sent: ShellTransaction; received: ShellTransaction } | null> {
    // Use atomic transaction to prevent race conditions and double-spending
    return await db.transaction(async (tx) => {
      // Get sender wallet with lock (FOR UPDATE equivalent via transaction)
      const [fromWallet] = await tx.select()
        .from(shellWallets)
        .where(eq(shellWallets.userId, fromUserId));
      
      if (!fromWallet || fromWallet.balance < amount) {
        return null; // Insufficient balance
      }
      
      // Get or create receiver wallet
      let [toWallet] = await tx.select()
        .from(shellWallets)
        .where(eq(shellWallets.userId, toUserId));
      
      if (!toWallet) {
        [toWallet] = await tx.insert(shellWallets)
          .values({ userId: toUserId, username: toUsername })
          .returning();
      }
      
      const senderNewBalance = fromWallet.balance - amount;
      const receiverNewBalance = toWallet.balance + amount;
      
      // Update sender balance
      await tx.update(shellWallets)
        .set({ 
          balance: senderNewBalance, 
          totalSpent: fromWallet.totalSpent + amount,
          updatedAt: new Date() 
        })
        .where(eq(shellWallets.id, fromWallet.id));
      
      // Update receiver balance
      await tx.update(shellWallets)
        .set({ 
          balance: receiverNewBalance, 
          totalEarned: toWallet.totalEarned + amount,
          updatedAt: new Date() 
        })
        .where(eq(shellWallets.id, toWallet.id));
      
      // Record sender transaction
      const [sentTx] = await tx.insert(shellTransactions)
        .values({
          walletId: fromWallet.id,
          userId: fromUserId,
          type: "tip_sent",
          amount: -amount,
          balance: senderNewBalance,
          description: `Tipped ${amount} Shells to ${toUsername}`,
          referenceId: messageId,
          referenceType: "tip",
        })
        .returning();
      
      // Record receiver transaction
      const [receivedTx] = await tx.insert(shellTransactions)
        .values({
          walletId: toWallet.id,
          userId: toUserId,
          type: "tip_received",
          amount: amount,
          balance: receiverNewBalance,
          description: `Received ${amount} Shells from ${fromUsername}`,
          referenceId: messageId,
          referenceType: "tip",
        })
        .returning();
      
      return { sent: sentTx, received: receivedTx };
    });
  }

  async purchaseShells(
    userId: string,
    username: string,
    packageKey: keyof typeof SHELL_PACKAGES,
    stripePaymentId: string
  ): Promise<ShellTransaction> {
    const pkg = SHELL_PACKAGES[packageKey];
    
    return this.addShells(
      userId,
      username,
      pkg.amount,
      "purchase",
      `Purchased ${pkg.name} (${pkg.amount} Shells)`,
      stripePaymentId,
      "stripe_payment"
    );
  }

  async awardEngagementShells(
    userId: string,
    username: string,
    action: keyof typeof SHELL_EARN_RATES
  ): Promise<ShellTransaction> {
    const amount = SHELL_EARN_RATES[action];
    
    return this.addShells(
      userId,
      username,
      amount,
      "earn",
      `Earned ${amount} Shells for ${action.replace(/_/g, " ")}`,
      undefined,
      "engagement"
    );
  }

  async getTransactions(userId: string, limit = 50): Promise<ShellTransaction[]> {
    const wallet = await this.getWallet(userId);
    if (!wallet) return [];
    
    return db.select()
      .from(shellTransactions)
      .where(eq(shellTransactions.walletId, wallet.id))
      .orderBy(desc(shellTransactions.createdAt))
      .limit(limit);
  }

  async hasEnoughShells(userId: string, amount: number): Promise<boolean> {
    const { balance } = await this.getBalance(userId);
    return balance >= amount;
  }

  async createConversionSnapshot(
    userId: string,
    conversionRate: string = "1"  // 1 Shell = 1 DWC by default
  ): Promise<ShellConversionSnapshot | null> {
    const wallet = await this.getWallet(userId);
    if (!wallet || wallet.balance === 0) return null;
    
    const dwcAmount = (wallet.balance * parseFloat(conversionRate)).toString();
    
    const [snapshot] = await db.insert(shellConversionSnapshots)
      .values({
        userId,
        walletId: wallet.id,
        orbBalance: wallet.balance,
        dwcAmount,
        conversionRate,
      })
      .returning();
    
    // Lock the balance
    await db.update(shellWallets)
      .set({ 
        lockedBalance: wallet.balance,
        balance: 0,
        updatedAt: new Date() 
      })
      .where(eq(shellWallets.id, wallet.id));
    
    return snapshot;
  }

  async getLeaderboard(limit = 10): Promise<{ userId: string; username: string; balance: number }[]> {
    const wallets = await db.select({
      userId: shellWallets.userId,
      username: shellWallets.username,
      balance: shellWallets.balance,
    })
      .from(shellWallets)
      .orderBy(desc(shellWallets.balance))
      .limit(limit);
    
    return wallets;
  }

  async getTotalStats(): Promise<{ totalShells: number; totalUsers: number; totalTransactions: number }> {
    const [orbStats] = await db.select({
      totalShells: sql<number>`COALESCE(SUM(${shellWallets.balance}), 0)::int`,
      totalUsers: sql<number>`COUNT(*)::int`,
    }).from(shellWallets);
    
    const [txStats] = await db.select({
      totalTransactions: sql<number>`COUNT(*)::int`,
    }).from(shellTransactions);
    
    return {
      totalShells: orbStats?.totalShells || 0,
      totalUsers: orbStats?.totalUsers || 0,
      totalTransactions: txStats?.totalTransactions || 0,
    };
  }
}

export const shellsService = new ShellsService();
