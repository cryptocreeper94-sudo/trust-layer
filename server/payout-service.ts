import { db } from "./db";
import { 
  commissionPayouts, 
  affiliateProfiles, 
  fraudFlags,
  chainAccounts
} from "@shared/schema";
import { eq, and, sql, lt, desc, gte } from "drizzle-orm";
import crypto from "crypto";
import { blockchain } from "./blockchain-engine";

const ORBIT_HUB_URL = "https://orbitstaffing.io";
const MIN_PAYOUT_THRESHOLD_CENTS = 5000;
const DWC_EXCHANGE_RATE = 0.008;
const PAYOUT_BATCH_SIZE = 50;
const SETTLEMENT_WAIT_DAYS = 7;

interface PayoutBatch {
  id: string;
  createdAt: Date;
  status: "pending" | "processing" | "completed" | "failed";
  totalAffiliates: number;
  totalAmountUsd: number;
  totalAmountDwc: string;
  processedCount: number;
  failedCount: number;
}

interface PayoutResult {
  success: boolean;
  payoutId: string;
  txHash?: string;
  error?: string;
}

function generateHmacSignature(payload: string, secret: string): string {
  return crypto.createHmac("sha256", secret).update(payload).digest("hex");
}

async function getOrbitHubHeaders(payload: object) {
  const apiKey = process.env.ORBIT_HUB_API_KEY;
  const apiSecret = process.env.ORBIT_HUB_API_SECRET;
  
  if (!apiKey || !apiSecret) {
    console.warn("[Payout] Orbit Hub API credentials not configured");
    return null;
  }

  const timestamp = Date.now().toString();
  const body = JSON.stringify(payload);
  const signature = generateHmacSignature(`${timestamp}${body}`, apiSecret);

  return {
    "Content-Type": "application/json",
    "X-API-Key": apiKey,
    "X-Timestamp": timestamp,
    "X-Signature": signature,
  };
}

export class PayoutService {
  async getEligibleAffiliates() {
    const eligibilityDate = new Date();
    eligibilityDate.setDate(eligibilityDate.getDate() - SETTLEMENT_WAIT_DAYS);

    const affiliates = await db
      .select({
        profile: affiliateProfiles,
        pendingAmount: sql<number>`COALESCE(SUM(${commissionPayouts.amount}), 0)`.as("pending_amount"),
      })
      .from(affiliateProfiles)
      .leftJoin(
        commissionPayouts,
        and(
          eq(commissionPayouts.userId, affiliateProfiles.userId),
          eq(commissionPayouts.payoutStatus, "eligible"),
          lt(commissionPayouts.eligibleForPayoutAt, eligibilityDate)
        )
      )
      .where(
        and(
          eq(affiliateProfiles.walletVerified, true),
          sql`${affiliateProfiles.dwcWalletAddress} IS NOT NULL`,
          gte(affiliateProfiles.pendingCommission, MIN_PAYOUT_THRESHOLD_CENTS)
        )
      )
      .groupBy(affiliateProfiles.id)
      .having(sql`SUM(${commissionPayouts.amount}) >= ${MIN_PAYOUT_THRESHOLD_CENTS}`);

    const unresolvedFraudFlags = await db
      .select({ userId: fraudFlags.userId })
      .from(fraudFlags)
      .where(eq(fraudFlags.isResolved, false));

    const flaggedUserIds = new Set(unresolvedFraudFlags.map(f => f.userId));
    
    return affiliates.filter(a => !flaggedUserIds.has(a.profile.userId));
  }

  async createPayoutBatch(): Promise<PayoutBatch> {
    const batchId = `batch_${Date.now()}_${crypto.randomBytes(4).toString("hex")}`;
    const eligibleAffiliates = await this.getEligibleAffiliates();

    const batch: PayoutBatch = {
      id: batchId,
      createdAt: new Date(),
      status: "pending",
      totalAffiliates: eligibleAffiliates.length,
      totalAmountUsd: eligibleAffiliates.reduce((sum, a) => sum + a.pendingAmount, 0),
      totalAmountDwc: (eligibleAffiliates.reduce((sum, a) => sum + a.pendingAmount, 0) / 100 / DWC_EXCHANGE_RATE).toFixed(2),
      processedCount: 0,
      failedCount: 0,
    };

    console.log(`[Payout] Created batch ${batchId} with ${batch.totalAffiliates} affiliates, $${(batch.totalAmountUsd / 100).toFixed(2)} total`);
    return batch;
  }

  async processAffiliatePayout(userId: string, walletAddress: string, amountCents: number): Promise<PayoutResult> {
    const payoutId = `payout_${Date.now()}_${crypto.randomBytes(4).toString("hex")}`;
    const amountDwc = (amountCents / 100 / DWC_EXCHANGE_RATE).toFixed(2);
    const amountWei = BigInt(Math.floor(parseFloat(amountDwc) * 1e18));

    try {
      const treasuryPrivateKey = process.env.TREASURY_PRIVATE_KEY;
      if (!treasuryPrivateKey) {
        throw new Error("Treasury private key not configured");
      }

      const recipientAccount = await db.query.chainAccounts.findFirst({
        where: eq(chainAccounts.address, walletAddress),
      });

      if (!recipientAccount) {
        throw new Error("Recipient wallet not found on DarkWave chain");
      }

      const signedTx = blockchain.createSignedTransaction(
        treasuryPrivateKey,
        walletAddress,
        amountWei,
        `affiliate_payout:${payoutId}:${userId}`
      );

      const result = blockchain.submitSignedTransaction(signedTx);
      
      if (!result.success) {
        throw new Error(result.error || "Transaction failed");
      }

      await db
        .update(commissionPayouts)
        .set({
          payoutStatus: "paid",
          amountDwc,
          exchangeRate: DWC_EXCHANGE_RATE.toString(),
          exchangeRateSource: "fixed",
          treasuryTxHash: signedTx.hash,
          processedAt: new Date(),
          payoutBatchId: payoutId,
          updatedAt: new Date(),
        })
        .where(
          and(
            eq(commissionPayouts.userId, userId),
            eq(commissionPayouts.payoutStatus, "eligible")
          )
        );

      await db
        .update(affiliateProfiles)
        .set({
          pendingCommission: sql`${affiliateProfiles.pendingCommission} - ${amountCents}`,
          paidCommission: sql`${affiliateProfiles.paidCommission} + ${amountCents}`,
          lastPayoutAt: new Date(),
          updatedAt: new Date(),
        })
        .where(eq(affiliateProfiles.userId, userId));

      console.log(`[Payout] Sent ${amountDwc} DWC to ${walletAddress} for user ${userId}, tx: ${signedTx.hash}`);

      return { success: true, payoutId, txHash: signedTx.hash };
    } catch (error) {
      console.error(`[Payout] Failed for user ${userId}:`, error);
      
      await db
        .update(commissionPayouts)
        .set({
          payoutStatus: "failed",
          failureReason: error instanceof Error ? error.message : "Unknown error",
          retryCount: sql`${commissionPayouts.retryCount} + 1`,
          updatedAt: new Date(),
        })
        .where(
          and(
            eq(commissionPayouts.userId, userId),
            eq(commissionPayouts.payoutStatus, "processing")
          )
        );

      return { success: false, payoutId, error: error instanceof Error ? error.message : "Unknown error" };
    }
  }

  async syncPayoutToOrbit(payoutResult: PayoutResult, affiliate: {
    userId: string;
    host: string;
    amountUsd: number;
    amountDwc: string;
  }): Promise<boolean> {
    const payload = {
      event: "affiliate_payout",
      timestamp: new Date().toISOString(),
      data: {
        payoutId: payoutResult.payoutId,
        txHash: payoutResult.txHash,
        affiliateUserId: affiliate.userId,
        host: affiliate.host,
        amountUsd: affiliate.amountUsd / 100,
        amountDwc: affiliate.amountDwc,
        currency: "DWC",
        status: payoutResult.success ? "completed" : "failed",
        error: payoutResult.error,
      },
    };

    const headers = await getOrbitHubHeaders(payload);
    if (!headers) {
      console.log("[Payout] Orbit Hub sync skipped - credentials not configured");
      return false;
    }

    try {
      const response = await fetch(`${ORBIT_HUB_URL}/api/v1/webhooks/payout`, {
        method: "POST",
        headers,
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        console.error(`[Payout] Orbit Hub sync failed: ${response.status}`);
        return false;
      }

      await db
        .update(commissionPayouts)
        .set({
          orbitSyncStatus: "synced",
          orbitSyncedAt: new Date(),
          updatedAt: new Date(),
        })
        .where(eq(commissionPayouts.treasuryTxHash, payoutResult.txHash || ""));

      console.log(`[Payout] Synced to Orbit Hub: ${payoutResult.payoutId}`);
      return true;
    } catch (error) {
      console.error("[Payout] Orbit Hub sync error:", error);
      
      await db
        .update(commissionPayouts)
        .set({
          orbitSyncStatus: "failed",
          updatedAt: new Date(),
        })
        .where(eq(commissionPayouts.treasuryTxHash, payoutResult.txHash || ""));

      return false;
    }
  }

  async runPayoutCycle(): Promise<{
    batchId: string;
    processed: number;
    failed: number;
    totalDwc: string;
    errors: string[];
  }> {
    console.log("[Payout] Starting automated payout cycle...");
    
    const eligibleAffiliates = await this.getEligibleAffiliates();
    
    if (eligibleAffiliates.length === 0) {
      console.log("[Payout] No eligible affiliates for payout");
      return { batchId: "", processed: 0, failed: 0, totalDwc: "0", errors: [] };
    }

    const batch = await this.createPayoutBatch();
    const errors: string[] = [];
    let processedCount = 0;
    let failedCount = 0;
    let totalDwc = 0;

    for (const affiliate of eligibleAffiliates.slice(0, PAYOUT_BATCH_SIZE)) {
      const result = await this.processAffiliatePayout(
        affiliate.profile.userId,
        affiliate.profile.dwcWalletAddress!,
        affiliate.pendingAmount
      );

      if (result.success) {
        processedCount++;
        totalDwc += parseFloat(result.txHash ? (affiliate.pendingAmount / 100 / DWC_EXCHANGE_RATE).toFixed(2) : "0");

        await this.syncPayoutToOrbit(result, {
          userId: affiliate.profile.userId,
          host: affiliate.profile.preferredHost || "dwsc.io",
          amountUsd: affiliate.pendingAmount,
          amountDwc: (affiliate.pendingAmount / 100 / DWC_EXCHANGE_RATE).toFixed(2),
        });
      } else {
        failedCount++;
        errors.push(`${affiliate.profile.userId}: ${result.error}`);
      }
    }

    console.log(`[Payout] Cycle complete: ${processedCount} processed, ${failedCount} failed, ${totalDwc.toFixed(2)} DWC distributed`);

    return {
      batchId: batch.id,
      processed: processedCount,
      failed: failedCount,
      totalDwc: totalDwc.toFixed(2),
      errors,
    };
  }

  async markCommissionEligible(stripePaymentIntent: string, amountCents: number) {
    const eligibleDate = new Date();
    eligibleDate.setDate(eligibleDate.getDate() + SETTLEMENT_WAIT_DAYS);

    await db
      .update(commissionPayouts)
      .set({
        payoutStatus: "eligible",
        stripeSettlementStatus: "settled",
        settledAt: new Date(),
        eligibleForPayoutAt: eligibleDate,
        updatedAt: new Date(),
      })
      .where(eq(commissionPayouts.stripePaymentIntent, stripePaymentIntent));

    console.log(`[Payout] Marked ${stripePaymentIntent} eligible for payout after ${eligibleDate.toISOString()}`);
  }

  async getPayoutStats() {
    const [stats] = await db
      .select({
        totalPending: sql<number>`COALESCE(SUM(CASE WHEN ${commissionPayouts.payoutStatus} = 'accruing' THEN ${commissionPayouts.amount} ELSE 0 END), 0)`,
        totalEligible: sql<number>`COALESCE(SUM(CASE WHEN ${commissionPayouts.payoutStatus} = 'eligible' THEN ${commissionPayouts.amount} ELSE 0 END), 0)`,
        totalPaid: sql<number>`COALESCE(SUM(CASE WHEN ${commissionPayouts.payoutStatus} = 'paid' THEN ${commissionPayouts.amount} ELSE 0 END), 0)`,
        totalFailed: sql<number>`COALESCE(SUM(CASE WHEN ${commissionPayouts.payoutStatus} = 'failed' THEN ${commissionPayouts.amount} ELSE 0 END), 0)`,
        pendingCount: sql<number>`COUNT(CASE WHEN ${commissionPayouts.payoutStatus} = 'accruing' THEN 1 END)`,
        eligibleCount: sql<number>`COUNT(CASE WHEN ${commissionPayouts.payoutStatus} = 'eligible' THEN 1 END)`,
        paidCount: sql<number>`COUNT(CASE WHEN ${commissionPayouts.payoutStatus} = 'paid' THEN 1 END)`,
      })
      .from(commissionPayouts);

    const recentPayouts = await db
      .select()
      .from(commissionPayouts)
      .where(eq(commissionPayouts.payoutStatus, "paid"))
      .orderBy(desc(commissionPayouts.processedAt))
      .limit(10);

    return { ...stats, recentPayouts };
  }

  async verifyAffiliateWallet(userId: string, walletAddress: string): Promise<boolean> {
    if (!walletAddress.startsWith("0x") || walletAddress.length !== 42) {
      console.warn(`[Payout] Invalid wallet address format: ${walletAddress}`);
      return false;
    }

    const chainAccount = await db.query.chainAccounts.findFirst({
      where: eq(chainAccounts.address, walletAddress),
    });

    if (!chainAccount) {
      console.log(`[Payout] Creating new chain account for ${walletAddress}`);
      await db.insert(chainAccounts).values({
        address: walletAddress,
        balance: "0",
        nonce: "0",
      }).onConflictDoNothing();
    }

    await db
      .update(affiliateProfiles)
      .set({
        dwcWalletAddress: walletAddress,
        walletVerified: true,
        walletVerifiedAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(affiliateProfiles.userId, userId));

    console.log(`[Payout] Verified wallet ${walletAddress} for user ${userId}`);
    return true;
  }
}

export const payoutService = new PayoutService();

let payoutInterval: NodeJS.Timeout | null = null;

export function startPayoutScheduler(intervalHours: number = 24) {
  if (payoutInterval) {
    clearInterval(payoutInterval);
  }

  console.log(`[Payout] Scheduler started - running every ${intervalHours} hours`);

  payoutInterval = setInterval(async () => {
    try {
      const result = await payoutService.runPayoutCycle();
      console.log(`[Payout] Scheduled run complete:`, result);
    } catch (error) {
      console.error("[Payout] Scheduled run failed:", error);
    }
  }, intervalHours * 60 * 60 * 1000);

  return payoutInterval;
}

export function stopPayoutScheduler() {
  if (payoutInterval) {
    clearInterval(payoutInterval);
    payoutInterval = null;
    console.log("[Payout] Scheduler stopped");
  }
}
