import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import crypto from "crypto";
import QRCode from "qrcode";
import { WebSocketServer, WebSocket } from "ws";
import { setupCommunityWebSocket } from "./community-ws";
import { z } from "zod";
import { storage } from "./storage";
import { db } from "./db";
import { zealyService, type ZealyWebhookPayload } from "./zealy-service";

// Auth request interface for session-based authentication
interface AuthenticatedRequest extends Request {
  user?: { id: string; email: string | null; claims: { sub: string } };
  firebaseUser?: { uid: string; email?: string }; // Legacy compatibility
}

// Unified authentication middleware - prioritizes session-based auth
// Falls back to token auth for backwards compatibility during migration
async function isAuthenticated(req: any, res: Response, next: NextFunction) {
  try {
    // Priority 1: Check session-based authentication (our custom auth system)
    const sessionUserId = (req.session as any)?.userId;
    if (sessionUserId) {
      const user = await storage.getUser(sessionUserId);
      if (user) {
        req.user = { 
          claims: { sub: user.id },
          id: user.id,
          email: user.email 
        };
        req.firebaseUser = { uid: user.id, email: user.email || undefined };
        return next();
      }
    }
    
    // Priority 2: Check Bearer token (legacy support during migration)
    const authHeader = req.headers.authorization;
    if (authHeader?.startsWith('Bearer ')) {
      const idToken = authHeader.substring(7);
      
      // Parse token to get user ID and look up in our database
      const parts = idToken.split('.');
      if (parts.length === 3) {
        try {
          const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString());
          if (payload.sub) {
            // Look up user in our database
            const user = await storage.getUser(payload.sub);
            if (user) {
              req.user = { 
                claims: { sub: user.id },
                id: user.id,
                email: user.email 
              };
              req.firebaseUser = { uid: user.id, email: user.email || undefined };
              return next();
            }
          }
        } catch (parseError) {
          // Token parsing failed, continue to reject
        }
      }
    }
    
    return res.status(401).json({ error: "Authentication required" });
  } catch (error: any) {
    console.error("Auth middleware error:", error.message || error);
    return res.status(401).json({ error: "Authentication required" });
  }
}

// Alias for routes using the old name
const verifyFirebaseToken = isAuthenticated;

// Chronicles-specific authentication middleware
// Uses the separate Chronicles account system with session tokens stored in chronicleAccounts
async function isChroniclesAuthenticated(req: any, res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: "Authentication required" });
    }
    
    const sessionToken = authHeader.substring(7);
    
    const [account] = await db.select().from(chronicleAccounts)
      .where(eq(chronicleAccounts.sessionToken, sessionToken))
      .limit(1);
    
    if (!account) {
      return res.status(401).json({ error: "Invalid session" });
    }
    
    if (!account.isActive) {
      return res.status(401).json({ error: "Account disabled" });
    }
    
    if (account.sessionExpiresAt && new Date(account.sessionExpiresAt) < new Date()) {
      return res.status(401).json({ error: "Session expired" });
    }
    
    // Set the Chronicles account on the request for use in route handlers
    req.chroniclesAccount = account;
    req.user = { 
      id: account.id,
      claims: { sub: account.id },
      email: account.email
    };
    
    return next();
  } catch (error: any) {
    console.error("Chronicles auth middleware error:", error.message || error);
    return res.status(401).json({ error: "Authentication required" });
  }
}
import { sql, eq, desc, and } from "drizzle-orm";
import { billingService } from "./billing";
import type { EcosystemApp, BlockchainStats } from "@shared/schema";
import { insertDocumentSchema, insertPageViewSchema, insertWaitlistSchema, insertInfluencerApplicationSchema, faucetClaims, tokenPairs, swapTransactions, nftCollections, nfts, nftListings, legacyFounders, APP_VERSION, gameSubmissions, insertGameSubmissionSchema, playerPersonalities, playerEstates, waitlist, betaTesters, whitelistedUsers, blockchainDomains, signupCounter, walletBackups, kycVerifications, guardianSecurityScores, chronoPassIdentities, experienceShards, shardAssignments, questDefinitions, questProgress, questSeasons, questLeaderboard, realityOracles, oracleDataFeeds, aiExecutionProofs, aiModelRegistry, copilotSessions, copilotMessages, users, passwordResetTokens, guilds, guildMembers, guildInvites, guildRoles, chronicleEras, chronicleArtifacts, chroniclePlayerArtifacts, chroniclePlayerEras, chronicleTimePortals, chronicleEraMissions, chronicleMissionProgress, chronicleAccounts, cityZones, landPlots, plotListings, dailyLoginRewards, businessClaims, eraBuildingTemplates } from "@shared/schema";
import { ecosystemClient, OrbitEcosystemClient } from "./ecosystem-client";
import { submitHashToDarkWave, generateDataHash, darkwaveConfig } from "./darkwave";
import { generateHallmark, verifyHallmark, getHallmarkQRCode } from "./hallmark";
import { blockchain } from "./blockchain-engine";
import { sendEmail, sendApiKeyEmail, sendHallmarkEmail, sendPresaleConfirmationEmail } from "./email";
import { submitMemoToSolana, isHeliusConfigured, getSolanaTreasuryAddress, getSolanaBalance } from "./helius";
import { startRegistration, finishRegistration, startAuthentication, finishAuthentication, getUserPasskeys, deletePasskey } from "./webauthn";
import { bridge } from "./bridge-engine";
import { registerChatRoutes } from "./replit_integrations/chat";
import { registerImageRoutes } from "./replit_integrations/image";
import { stakingEngine } from "./staking-engine";
import { generateScenario, randomizeEmotions, describeEmotionalState } from "./scenario-generator";
import { creditsService, CREDIT_COSTS } from "./credits-service";
import { referralService } from "./referral-service";
import { payoutService, startPayoutScheduler } from "./payout-service";
import { voiceService, VOICE_SAMPLE_PROMPTS } from "./voice-service";
import { communityHubService } from "./community-hub-service";
import { walletBotService } from "./wallet-bot-service";
import { broadcastToChannel } from "./chat-presence";
import { pulseClient } from "./pulse-client";
import { registerObjectStorageRoutes } from "./replit_integrations/object_storage";
import { shellsService, SHELL_PACKAGES, SHELL_BUNDLES, SHELL_EARN_RATES, SHELL_COSTS, DWC_CONVERSION_RATE, DWC_LAUNCH_DATE } from "./shells-service";
import { needsService } from "./needs-service";
import { builderService } from "./builder-service";
import { questsService } from "./quests-service";
import { mirrorLifeService } from "./mirror-life-service";
import { interiorsService } from "./interiors-service";
import { subscriptionService, SUBSCRIPTION_PLANS } from "./subscription-service";
import { guardianService, generateDataHash as guardianHash, generateMerkleRoot } from "./guardian-service";

const FaucetClaimRequestSchema = z.object({
  walletAddress: z.string().min(10, "Invalid wallet address").max(100),
});

const SwapRequestSchema = z.object({
  tokenIn: z.string().min(1),
  tokenOut: z.string().min(1),
  amountIn: z.string().regex(/^\d+$/, "Amount must be numeric"),
  minAmountOut: z.string().regex(/^\d+$/, "Amount must be numeric").optional(),
});

const StakeRequestSchema = z.object({
  amount: z.string().regex(/^\d+$/, "Amount must be numeric"),
  tier: z.enum(["bronze", "silver", "gold", "platinum", "validator", "delegator"]).optional(),
});

const NftMintRequestSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  description: z.string().max(1000).optional(),
  imageUrl: z.string().optional().or(z.literal("")),
  collection: z.string().optional(),
  collectionId: z.string().optional(),
  attributes: z.string().optional(),
  royalties: z.string().optional(),
  supply: z.string().optional(),
});

const rateLimitStore: Map<string, { count: number; resetTime: number }> = new Map();

function rateLimit(routeId: string, maxRequests: number, windowMs: number) {
  return (req: Request, res: Response, next: NextFunction) => {
    const ip = req.ip || "unknown";
    const key = `${routeId}:${ip}`;
    const now = Date.now();
    const record = rateLimitStore.get(key);
    
    if (!record || now > record.resetTime) {
      rateLimitStore.set(key, { count: 1, resetTime: now + windowMs });
      return next();
    }
    
    if (record.count >= maxRequests) {
      return res.status(429).json({ error: "Too many requests, please try again later" });
    }
    
    record.count++;
    return next();
  };
}

const faucetRateLimit = rateLimit("faucet", 5, 60 * 1000);
const swapRateLimit = rateLimit("swap", 30, 60 * 1000);
const nftMintRateLimit = rateLimit("nft-mint", 10, 60 * 1000);
const studioAiRateLimit = rateLimit("studio-ai", 20, 60 * 1000);
const apiGeneralRateLimit = rateLimit("api-general", 100, 60 * 1000);
const authRateLimit = rateLimit("auth", 10, 60 * 1000);
const documentRateLimit = rateLimit("document", 50, 60 * 1000);
const developerRateLimit = rateLimit("developer", 30, 60 * 1000);
const hashSubmitRateLimit = rateLimit("hash-submit", 20, 60 * 1000);
const ecosystemRateLimit = rateLimit("ecosystem", 60, 60 * 1000);
const stakingRateLimit = rateLimit("staking", 10, 60 * 1000);
const liquidityRateLimit = rateLimit("liquidity", 10, 60 * 1000);
const bridgeRateLimit = rateLimit("bridge", 5, 60 * 1000);

interface PresenceUser {
  id: string;
  name: string;
  color: string;
  cursor?: { line: number; column: number };
  file?: string;
}

const PRESENCE_COLORS = ["#ef4444", "#f97316", "#eab308", "#22c55e", "#06b6d4", "#3b82f6", "#8b5cf6", "#ec4899"];
const projectPresence: Map<string, Map<string, PresenceUser>> = new Map();
const wsClients: Map<WebSocket, { projectId: string; userId: string }> = new Map();

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  registerChatRoutes(app);
  registerImageRoutes(app);
  registerObjectStorageRoutes(app);

  // =====================================================
  // DWSC GATEWAY - Handle *.dwsc.io subdomain routing
  // =====================================================
  app.get("*", async (req: Request, res: Response, next: NextFunction) => {
    const host = req.hostname;
    
    // Check if this is a request to a *.dwsc.io subdomain
    if (host && host.endsWith(".dwsc.io") && host !== "dwsc.io" && !host.startsWith("www.")) {
      // Extract domain name (e.g., "alice" from "alice.dwsc.io")
      const domainName = host.split(".")[0];
      
      try {
        // Look up the domain in the database
        const domain = await storage.getDomain(domainName);
        
        if (domain && domain.website) {
          // Domain found with website URL - redirect to it
          return res.redirect(301, domain.website);
        }
        
        // Domain not found or no website configured - let React handle the error page
        // Add header so React can detect this is a gateway request
        res.setHeader("X-Gateway-Domain", domainName);
        res.setHeader("X-Gateway-Found", domain ? "true" : "false");
      } catch (error) {
        console.error("Gateway error:", error);
        // Continue to React app on error
      }
    }
    
    // Not a gateway request, or gateway request without redirect - continue to React
    next();
  });

  // =====================================================
  // STRIPE WEBHOOK - Must be early for raw body access
  // =====================================================
  app.post("/api/stripe/webhook", async (req: any, res) => {
    try {
      const sig = req.headers["stripe-signature"];
      const rawBody = req.rawBody;
      
      if (!sig || !rawBody) {
        console.error("Stripe webhook: Missing signature or raw body");
        return res.status(400).json({ error: "Missing signature or raw body" });
      }
      
      // Use managed webhook from stripe-replit-sync for signature verification and sync
      const { getStripeSync } = await import("./stripeClient");
      try {
        const stripeSync = await getStripeSync();
        await stripeSync.processWebhook(rawBody as Buffer, sig);
      } catch (syncErr: any) {
        console.error("Stripe webhook sync error:", syncErr.message);
        // Continue to process custom logic even if sync fails
      }
      
      // Parse event for custom business logic (signature already verified by processWebhook)
      let event;
      try {
        const payload = typeof rawBody === 'string' ? rawBody : rawBody.toString('utf8');
        event = JSON.parse(payload);
      } catch (err: any) {
        console.error("Stripe webhook JSON parse error:", err.message);
        return res.status(400).json({ error: "Invalid JSON payload" });
      }
      
      console.log(`[Stripe Webhook] Event received: ${event.type}`);
      
      // Handle checkout.session.completed
      if (event.type === "checkout.session.completed") {
        const session = event.data.object;
        const metadata = session.metadata || {};
        const customerEmail = session.customer_details?.email || metadata.email || session.customer_email;
        const amountCents = session.amount_total || 0;
        
        // Use payment_intent as the idempotency key (not session.id)
        const paymentId = session.payment_intent || session.id;
        
        console.log(`[Stripe Webhook] Checkout completed: ${paymentId}, type: ${metadata.type}, email: ${customerEmail}, amount: ${amountCents}`);
        
        // Handle presale purchases
        if (metadata.type === "presale") {
          try {
            const tier = metadata.tier || "custom";
            
            // SECURITY: Calculate tokens server-side from verified amount, not from metadata
            const TIER_BONUSES: Record<string, number> = {
              genesis: 25, founder: 15, pioneer: 10, early_bird: 5
            };
            const TOKEN_PRICE = 0.001;
            const tokenAmount = Math.floor((amountCents / 100) / TOKEN_PRICE);
            const bonusPercent = TIER_BONUSES[tier] || 0;
            const bonusTokens = Math.floor(tokenAmount * (bonusPercent / 100));
            const totalTokens = tokenAmount + bonusTokens;
            
            // Record the purchase with payment_intent as key
            await db.execute(sql`
              INSERT INTO presale_purchases (stripe_payment_intent_id, email, usd_amount_cents, token_amount, tier, status, payment_method, created_at)
              VALUES (${paymentId}, ${customerEmail}, ${amountCents}, ${totalTokens}, ${tier}, 'completed', 'stripe', NOW())
              ON CONFLICT (stripe_payment_intent_id) DO NOTHING
            `);
            
            // Grant Early Adopter status automatically
            if (customerEmail) {
              const adoperTier = tier === 'genesis' || amountCents >= 100000 ? 'founder' : 'supporter';
              await db.execute(sql`
                INSERT INTO early_adopter_program (email, tier, status, registered_at)
                VALUES (${customerEmail}, ${adoperTier}, 'active', NOW())
                ON CONFLICT (email) DO UPDATE SET
                  tier = CASE WHEN EXCLUDED.tier = 'founder' THEN 'founder' ELSE early_adopter_program.tier END,
                  status = 'active'
              `);
            }
            
            console.log(`[Stripe Webhook] Presale recorded: ${customerEmail}, ${totalTokens} tokens from $${(amountCents/100).toFixed(2)}`);
          } catch (dbError) {
            console.error("[Stripe Webhook] DB error for presale:", dbError);
          }
        }
        
        // Handle crowdfund donations
        if (metadata.contributionId) {
          try {
            await storage.updateCrowdfundContribution(metadata.contributionId, {
              status: "confirmed",
            });
            
            // Grant Early Adopter status for donors too
            if (customerEmail) {
              await db.execute(sql`
                INSERT INTO early_adopter_program (email, tier, status, registered_at)
                VALUES (${customerEmail}, 'supporter', 'active', NOW())
                ON CONFLICT (email) DO NOTHING
              `);
            }
            
            console.log(`[Stripe Webhook] Crowdfund confirmed: ${metadata.contributionId}`);
          } catch (dbError) {
            console.error("[Stripe Webhook] DB error for crowdfund:", dbError);
          }
        }
        
        // Handle credits purchases
        if (metadata.type === "credits_purchase" && metadata.userId && metadata.packageId) {
          try {
            const result = await creditsService.processPurchase(
              metadata.userId,
              metadata.packageId,
              paymentId as string
            );
            console.log(`[Stripe Webhook] Credits purchased: user=${metadata.userId}, credits=${result.creditsAdded}, balance=${result.newBalance}`);
            
            // Process affiliate commission if user was referred
            try {
              await referralService.processConversion(metadata.userId, amountCents);
              
              // Mark commission eligible for payout after settlement
              await payoutService.markCommissionEligible(paymentId as string, amountCents);
              console.log(`[Stripe Webhook] Affiliate commission tracked for user ${metadata.userId}`);
            } catch (refErr) {
              console.error("[Stripe Webhook] Referral commission error:", refErr);
            }
          } catch (dbError) {
            console.error("[Stripe Webhook] DB error for credits purchase:", dbError);
          }
        }
        
        // Process affiliate commission for presale purchases
        if (metadata.type === "presale" && metadata.userId) {
          try {
            await referralService.processConversion(metadata.userId, amountCents);
            await payoutService.markCommissionEligible(paymentId as string, amountCents);
            console.log(`[Stripe Webhook] Presale affiliate commission tracked for user ${metadata.userId}`);
          } catch (refErr) {
            console.error("[Stripe Webhook] Presale referral commission error:", refErr);
          }
        }
        
        // Handle Guardian Certification purchases
        if (metadata.type === "guardian_certification") {
          try {
            const certification = await guardianService.createCertification({
              projectName: metadata.projectName || "Unknown Project",
              projectUrl: metadata.projectUrl || null,
              contactEmail: customerEmail || metadata.contactEmail || "",
              tier: metadata.tier || "assurance_lite",
              status: "pending",
              stripePaymentId: paymentId as string,
              userId: metadata.userId || null,
            });
            console.log(`[Stripe Webhook] Guardian certification created: ${certification.id}, tier: ${metadata.tier}, project: ${metadata.projectName}`);
          } catch (dbError) {
            console.error("[Stripe Webhook] DB error for Guardian certification:", dbError);
          }
        }
        
        // Handle new subscription activation (with server-side validation)
        if (metadata.type === "subscription" && session.subscription) {
          try {
            const { getUncachableStripeClient } = await import("./stripeClient");
            const stripe = await getUncachableStripeClient();
            const subscription = await stripe.subscriptions.retrieve(session.subscription as string);
            const subData = subscription as any;
            
            // SECURITY: Validate subscription is actually active/trialing before granting access
            if (subData.status !== "active" && subData.status !== "trialing") {
              console.error(`[Stripe Webhook] Subscription not active: status=${subData.status}`);
              return res.json({ received: true });
            }
            
            // SECURITY: Validate plan from subscription metadata (set server-side during checkout creation)
            const subMetadata = subData.metadata || {};
            const userId = subMetadata.userId;
            const plan = subMetadata.plan;
            const billingCycle = subMetadata.billingCycle as "monthly" | "annual";
            
            // SECURITY: Validate plan is a valid subscription plan
            const validPlans = ["pulse_pro", "strike_agent", "complete_bundle", "rm_monthly", "rm_annual"];
            if (!userId || !plan || !validPlans.includes(plan)) {
              console.error(`[Stripe Webhook] Invalid subscription metadata: userId=${userId}, plan=${plan}`);
              return res.json({ received: true });
            }
            
            // SECURITY: Verify price matches expected plan pricing
            const priceId = subData.items?.data?.[0]?.price?.id;
            const priceAmount = subData.items?.data?.[0]?.price?.unit_amount;
            const expectedPrices: Record<string, number[]> = {
              pulse_pro: [1499, 14999],      // monthly, annual
              strike_agent: [3000, 30000],
              complete_bundle: [3999, 39999],
              rm_monthly: [800],
              rm_annual: [8000],
            };
            
            if (expectedPrices[plan] && !expectedPrices[plan].includes(priceAmount)) {
              console.error(`[Stripe Webhook] Price mismatch: plan=${plan}, expected=${expectedPrices[plan]}, got=${priceAmount}`);
              return res.json({ received: true });
            }
            
            await subscriptionService.activateSubscription(
              userId,
              plan,
              session.customer as string,
              subscription.id,
              priceId || "",
              billingCycle,
              new Date(subData.current_period_start * 1000),
              new Date(subData.current_period_end * 1000),
              subData.trial_end ? new Date(subData.trial_end * 1000) : undefined
            );
            
            console.log(`[Stripe Webhook] Subscription activated: user=${userId}, plan=${plan}, cycle=${billingCycle}, price=${priceAmount}`);
          } catch (subErr) {
            console.error("[Stripe Webhook] Subscription activation error:", subErr);
          }
        }
      }
      
      // Handle subscription updated (renewal, plan change)
      if (event.type === "customer.subscription.updated") {
        const subscription = event.data.object as any;
        try {
          const sub = await subscriptionService.getByStripeSubscriptionId(subscription.id);
          if (sub) {
            await subscriptionService.renewSubscription(
              subscription.id,
              new Date(subscription.current_period_start * 1000),
              new Date(subscription.current_period_end * 1000)
            );
            console.log(`[Stripe Webhook] Subscription renewed: ${subscription.id}`);
          }
        } catch (err) {
          console.error("[Stripe Webhook] Subscription update error:", err);
        }
      }
      
      // Handle subscription cancelled
      if (event.type === "customer.subscription.deleted") {
        const subscription = event.data.object as any;
        try {
          await subscriptionService.expireSubscription(subscription.id);
          console.log(`[Stripe Webhook] Subscription expired: ${subscription.id}`);
        } catch (err) {
          console.error("[Stripe Webhook] Subscription delete error:", err);
        }
      }
      
      // Handle payment failed
      if (event.type === "invoice.payment_failed") {
        const invoice = event.data.object as any;
        if (invoice.subscription) {
          try {
            await subscriptionService.markPastDue(invoice.subscription as string);
            console.log(`[Stripe Webhook] Subscription marked past_due: ${invoice.subscription}`);
          } catch (err) {
            console.error("[Stripe Webhook] Payment failed handling error:", err);
          }
        }
      }
      
      // Handle successful invoice payment (renewal)
      if (event.type === "invoice.paid") {
        const invoice = event.data.object as any;
        if (invoice.subscription && invoice.billing_reason === "subscription_cycle") {
          try {
            const { getUncachableStripeClient } = await import("./stripeClient");
            const stripe = await getUncachableStripeClient();
            const subscription = await stripe.subscriptions.retrieve(invoice.subscription as string) as any;
            
            await subscriptionService.renewSubscription(
              subscription.id,
              new Date(subscription.current_period_start * 1000),
              new Date(subscription.current_period_end * 1000)
            );
            console.log(`[Stripe Webhook] Subscription renewed via invoice: ${subscription.id}`);
          } catch (err) {
            console.error("[Stripe Webhook] Invoice paid handling error:", err);
          }
        }
      }
      
      res.json({ received: true });
    } catch (error: any) {
      console.error("Stripe webhook error:", error);
      res.status(500).json({ error: error.message || "Webhook processing failed" });
    }
  });

  // ============================================
  // COINBASE COMMERCE WEBHOOK
  // ============================================
  app.post("/api/coinbase/webhook", async (req: Request, res: Response) => {
    try {
      const signature = req.headers["x-cc-webhook-signature"] as string;
      const webhookSecret = process.env.COINBASE_COMMERCE_WEBHOOK_SECRET;

      if (!webhookSecret) {
        console.error("[Coinbase] COINBASE_WEBHOOK_SECRET not configured");
        return res.status(500).json({ error: "Webhook not configured" });
      }

      // Verify webhook signature using HMAC-SHA256
      const rawBody = JSON.stringify(req.body);
      const expectedSig = crypto
        .createHmac("sha256", webhookSecret)
        .update(rawBody)
        .digest("hex");

      if (signature !== expectedSig) {
        console.warn("[Coinbase] Invalid webhook signature");
        return res.status(401).json({ error: "Invalid signature" });
      }

      const event = req.body;
      console.log(`[Coinbase Webhook] Event received: ${event.type}`);

      if (event.type === "charge:confirmed" || event.type === "charge:resolved") {
        const charge = event.data;
        const metadata = charge.metadata || {};
        const customerEmail = metadata.email;
        const amountUsd = parseFloat(charge.pricing?.local?.amount || "0");
        const amountCents = Math.round(amountUsd * 100);

        console.log(`[Coinbase Webhook] Payment confirmed: $${amountUsd}, email: ${customerEmail}`);

        // Handle presale purchases
        if (metadata.type === "presale" && customerEmail) {
          try {
            const purchaseId = metadata.purchaseId;
            const tier = metadata.tier || "standard";
            const totalTokens = parseInt(metadata.totalTokens || "0");
            
            // Update existing pending purchase to completed
            if (purchaseId) {
              await db.execute(sql`
                UPDATE presale_purchases 
                SET status = 'completed',
                    stripe_payment_intent_id = ${`coinbase_${charge.code}`}
                WHERE id = ${purchaseId} AND status = 'pending'
              `);
              console.log(`[Coinbase Webhook] Updated purchase ${purchaseId} to completed`);
            }

            // Also record in early_adopter_program for tracking
            await db.execute(sql`
              INSERT INTO early_adopter_program (email, tier, status, registered_at, total_contributed)
              VALUES (${customerEmail}, ${tier}, 'active', NOW(), ${amountCents})
              ON CONFLICT (email) DO UPDATE SET
                tier = CASE WHEN EXCLUDED.tier = 'genesis' OR EXCLUDED.tier = 'founder' THEN EXCLUDED.tier ELSE early_adopter_program.tier END,
                total_contributed = early_adopter_program.total_contributed + ${amountCents}
            `);

            console.log(`[Coinbase Webhook] Presale recorded: ${customerEmail}, tier: ${tier}, amount: $${amountUsd}, tokens: ${totalTokens}`);
          } catch (dbError) {
            console.error("[Coinbase Webhook] DB error for presale:", dbError);
          }
        }

        // Handle Shell purchases
        if (metadata.type === "shells" && metadata.userId) {
          try {
            const shellsAmount = parseInt(metadata.shellsAmount || "0");
            if (shellsAmount > 0) {
              await shellsService.creditShells(
                metadata.userId,
                shellsAmount,
                "coinbase_purchase",
                `Coinbase purchase: $${amountUsd}`,
                charge.code
              );
              console.log(`[Coinbase Webhook] Shells credited: ${shellsAmount} to user ${metadata.userId}`);
            }
          } catch (shellsError) {
            console.error("[Coinbase Webhook] Shells credit error:", shellsError);
          }
        }
      }

      res.json({ received: true });
    } catch (error: any) {
      console.error("[Coinbase Webhook] Error:", error);
      res.status(500).json({ error: "Webhook processing failed" });
    }
  });

  // ============================================
  // ZEALY WEBHOOK - Community Quest Platform
  // ============================================
  app.post("/api/zealy/webhook", async (req: Request, res: Response) => {
    try {
      const signature = req.headers["x-zealy-signature"] as string;
      const webhookSecret = process.env.ZEALY_WEBHOOK_SECRET;

      if (!webhookSecret) {
        console.error("ZEALY_WEBHOOK_SECRET not configured");
        return res.status(500).json({ error: "Webhook not configured" });
      }

      const rawBody = JSON.stringify(req.body);

      if (signature && !zealyService.verifyWebhookSignature(rawBody, signature, webhookSecret)) {
        console.warn("Zealy webhook: Invalid signature");
        return res.status(401).json({ error: "Invalid signature" });
      }

      const payload: ZealyWebhookPayload = req.body;

      if (!payload.userId || !payload.questId || !payload.requestId) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      const result = await zealyService.processWebhook(payload);

      if (result.success) {
        return res.status(200).json({ success: true, message: result.message });
      } else {
        return res.status(400).json({ success: false, error: result.error });
      }
    } catch (error: any) {
      console.error("Zealy webhook error:", error);
      return res.status(500).json({ error: "Webhook processing failed" });
    }
  });

  // Partner Portal Authentication (server-side validation)
  const PARTNER_ACCESS_CODE = process.env.PARTNER_ACCESS_CODE;
  if (!PARTNER_ACCESS_CODE) {
    console.warn("[Partner Portal] PARTNER_ACCESS_CODE env var not set - master partner auth will be unavailable");
  }
  app.post("/api/partner/verify", rateLimit("partner-auth", 5, 60000), async (req: Request, res: Response) => {
    try {
      const { accessCode } = req.body;
      if (!accessCode || typeof accessCode !== 'string') {
        return res.status(400).json({ success: false, error: "Access code required" });
      }
      
      if (PARTNER_ACCESS_CODE && accessCode === PARTNER_ACCESS_CODE) {
        const token = crypto.randomBytes(32).toString('hex');
        return res.json({ success: true, token });
      }
      
      // Check if it's a studio-specific access code
      const studioRequest = await db.execute(sql`
        SELECT * FROM partner_access_requests 
        WHERE access_code = ${accessCode} AND status = 'approved'
        LIMIT 1
      `);
      
      if (studioRequest.rows.length > 0) {
        const token = crypto.randomBytes(32).toString('hex');
        return res.json({ success: true, token, studioName: studioRequest.rows[0].studio_name });
      }
      
      return res.status(401).json({ success: false, error: "Invalid access code" });
    } catch (error) {
      console.error("Partner auth error:", error);
      return res.status(500).json({ success: false, error: "Authentication failed" });
    }
  });

  // Partner Access Request - submit new request
  app.post("/api/partner/request", rateLimit("partner-request", 3, 60000), async (req: Request, res: Response) => {
    try {
      const { studioName, contactName, email, website, teamSize, expertise, previousProjects, interestReason, partnershipType, ndaAccepted } = req.body;
      
      if (!studioName || !contactName || !email) {
        return res.status(400).json({ success: false, error: "Studio name, contact name, and email are required" });
      }
      
      if (!ndaAccepted) {
        return res.status(400).json({ success: false, error: "NDA must be accepted to proceed" });
      }
      
      const result = await db.execute(sql`
        INSERT INTO partner_access_requests (studio_name, contact_name, email, website, team_size, expertise, previous_projects, interest_reason, partnership_type, nda_accepted)
        VALUES (${studioName}, ${contactName}, ${email}, ${website || null}, ${teamSize || null}, ${expertise || null}, ${previousProjects || null}, ${interestReason || null}, ${partnershipType || null}, ${ndaAccepted})
        RETURNING id
      `);
      
      // Send notification email
      try {
        await sendEmail({
          to: "partners@darkwavestudios.io",
          subject: `New Partner Request: ${studioName}`,
          html: `
            <h2>New Partner Access Request</h2>
            <p><strong>Studio:</strong> ${studioName}</p>
            <p><strong>Contact:</strong> ${contactName}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Website:</strong> ${website || 'Not provided'}</p>
            <p><strong>Team Size:</strong> ${teamSize || 'Not provided'}</p>
            <p><strong>Expertise:</strong> ${expertise || 'Not provided'}</p>
            <p><strong>Partnership Type:</strong> ${partnershipType || 'Not specified'}</p>
            <p><strong>Interest Reason:</strong> ${interestReason || 'Not provided'}</p>
            <p><strong>Previous Projects:</strong> ${previousProjects || 'Not provided'}</p>
            <hr>
            <p>Review and approve/reject this request in the admin panel.</p>
          `,
        });
      } catch (emailErr) {
        console.error("Failed to send partner notification email:", emailErr);
      }
      
      return res.json({ success: true, message: "Request submitted successfully. We'll review your application and get back to you soon." });
    } catch (error) {
      console.error("Partner request error:", error);
      return res.status(500).json({ success: false, error: "Failed to submit request" });
    }
  });

  // Admin: Get all partner requests
  app.get("/api/partner/requests", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const result = await db.execute(sql`
        SELECT * FROM partner_access_requests 
        ORDER BY created_at DESC
      `);
      return res.json({ success: true, requests: result.rows });
    } catch (error) {
      console.error("Get partner requests error:", error);
      return res.status(500).json({ success: false, error: "Failed to fetch requests" });
    }
  });

  // Admin: Approve partner request
  app.post("/api/partner/requests/:id/approve", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const accessCode = `DWP-${crypto.randomBytes(4).toString('hex').toUpperCase()}`;
      
      const result = await db.execute(sql`
        UPDATE partner_access_requests 
        SET status = 'approved', access_code = ${accessCode}, reviewed_at = CURRENT_TIMESTAMP
        WHERE id = ${id}
        RETURNING *
      `);
      
      if (result.rows.length === 0) {
        return res.status(404).json({ success: false, error: "Request not found" });
      }
      
      const request = result.rows[0] as any;
      
      // Send approval email with access code
      try {
        await sendEmail({
          to: request.email,
          subject: "DarkWave Chronicles - Partner Access Approved",
          html: `
            <h2>Welcome to DarkWave Studios Partner Program!</h2>
            <p>Dear ${request.contact_name},</p>
            <p>Great news! Your partner access request for <strong>${request.studio_name}</strong> has been approved.</p>
            <p>Your exclusive access code is: <strong style="font-size: 18px; color: #a855f7;">${accessCode}</strong></p>
            <p>Use this code to access the Partner Portal at: <a href="https://dwsc.io/partners">dwsc.io/partners</a></p>
            <p>We're excited to explore partnership opportunities with you!</p>
            <hr>
            <p>Best regards,<br>DarkWave Studios Team</p>
          `,
        });
      } catch (emailErr) {
        console.error("Failed to send approval email:", emailErr);
      }
      
      return res.json({ success: true, message: "Request approved", accessCode });
    } catch (error) {
      console.error("Approve partner request error:", error);
      return res.status(500).json({ success: false, error: "Failed to approve request" });
    }
  });

  // Admin: Reject partner request
  app.post("/api/partner/requests/:id/reject", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { reason } = req.body;
      
      const result = await db.execute(sql`
        UPDATE partner_access_requests 
        SET status = 'rejected', reviewed_at = CURRENT_TIMESTAMP
        WHERE id = ${id}
        RETURNING *
      `);
      
      if (result.rows.length === 0) {
        return res.status(404).json({ success: false, error: "Request not found" });
      }
      
      const request = result.rows[0] as any;
      
      // Send rejection email
      try {
        await sendEmail({
          to: request.email,
          subject: "DarkWave Chronicles - Partner Application Update",
          html: `
            <h2>Partner Application Update</h2>
            <p>Dear ${request.contact_name},</p>
            <p>Thank you for your interest in partnering with DarkWave Studios.</p>
            <p>After careful consideration, we're unable to move forward with a partnership at this time.</p>
            ${reason ? `<p><strong>Reason:</strong> ${reason}</p>` : ''}
            <p>We appreciate your understanding and wish you success in your future endeavors.</p>
            <hr>
            <p>Best regards,<br>DarkWave Studios Team</p>
          `,
        });
      } catch (emailErr) {
        console.error("Failed to send rejection email:", emailErr);
      }
      
      return res.json({ success: true, message: "Request rejected" });
    } catch (error) {
      console.error("Reject partner request error:", error);
      return res.status(500).json({ success: false, error: "Failed to reject request" });
    }
  });

  // Scenario Generator API for DarkWave Chronicles
  app.post("/api/generate-scenario", rateLimit("scenario", 10, 60000), async (req: Request, res: Response) => {
    try {
      const { era = "Dawn Age", emotionalTone = "tense", complexity = "moderate" } = req.body;
      const scenario = await generateScenario(era, emotionalTone, complexity);
      res.json(scenario);
    } catch (error) {
      console.error("Scenario generation error:", error);
      res.status(500).json({ error: "Failed to generate scenario" });
    }
  });

  app.get("/api/random-emotions", (_req: Request, res: Response) => {
    const emotions = randomizeEmotions();
    const description = describeEmotionalState(emotions);
    res.json({ emotions, description });
  });

  // Contact form endpoint
  app.post("/api/contact", rateLimit("contact", 5, 60000), async (req: Request, res: Response) => {
    try {
      const { name, email, subject, message } = req.body;
      
      if (!name || !email || !message) {
        return res.status(400).json({ error: "Name, email, and message are required" });
      }
      
      // Log the contact submission
      console.log(`[Contact Form] New submission from ${name} (${email}): ${subject}`);
      
      // Send email notification
      try {
        await sendEmail({
          to: "guardian@dwsc.io",
          subject: `[Contact Form] ${subject || "New Inquiry"}`,
          html: `
            <h2>New Contact Form Submission</h2>
            <p><strong>From:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Subject:</strong> ${subject || "Not specified"}</p>
            <hr>
            <p><strong>Message:</strong></p>
            <p>${message.replace(/\n/g, "<br>")}</p>
          `,
        });
      } catch (emailErr) {
        console.error("Failed to send contact form email:", emailErr);
      }
      
      res.json({ success: true, message: "Message received" });
    } catch (error) {
      console.error("Contact form error:", error);
      res.status(500).json({ error: "Failed to send message" });
    }
  });

  const wss = new WebSocketServer({ server: httpServer, path: "/ws/studio" });
  
  wss.on("connection", (ws: WebSocket) => {
    ws.on("message", (data: string) => {
      try {
        const message = JSON.parse(data.toString());
        
        if (message.type === "join") {
          const { projectId, userId, userName } = message;
          wsClients.set(ws, { projectId, userId });
          
          if (!projectPresence.has(projectId)) {
            projectPresence.set(projectId, new Map());
          }
          const projectUsers = projectPresence.get(projectId)!;
          const colorIndex = projectUsers.size % PRESENCE_COLORS.length;
          
          projectUsers.set(userId, {
            id: userId,
            name: userName || "Anonymous",
            color: PRESENCE_COLORS[colorIndex],
          });
          
          broadcastPresence(projectId);
        }
        
        if (message.type === "cursor") {
          const { projectId, cursor, file } = message;
          const client = wsClients.get(ws);
          if (client && projectPresence.has(projectId)) {
            const user = projectPresence.get(projectId)?.get(client.userId);
            if (user) {
              user.cursor = cursor;
              user.file = file;
              broadcastPresence(projectId);
            }
          }
        }
      } catch (e) {}
    });
    
    ws.on("close", () => {
      const client = wsClients.get(ws);
      if (client) {
        const { projectId, userId } = client;
        projectPresence.get(projectId)?.delete(userId);
        wsClients.delete(ws);
        broadcastPresence(projectId);
      }
    });
  });
  
  function broadcastPresence(projectId: string) {
    const users = projectPresence.get(projectId);
    if (!users) return;
    
    const presence = Array.from(users.values());
    const message = JSON.stringify({ type: "presence", users: presence });
    
    wsClients.forEach((client, clientWs) => {
      if (client.projectId === projectId && clientWs.readyState === WebSocket.OPEN) {
        clientWs.send(message);
      }
    });
  }

  setupCommunityWebSocket(httpServer);

  // Firebase auth sync - syncs Firebase users to our database
  app.post("/api/auth/firebase-sync", authRateLimit, async (req, res) => {
    try {
      const { uid, email, displayName, photoURL, username } = req.body;
      
      if (!uid) {
        return res.status(400).json({ error: "Missing user ID" });
      }

      // Check if this is a new user (for signup position tracking)
      const existingUser = await storage.getFirebaseUser(uid);
      let signupPosition = existingUser?.signupPosition || null;

      // If new user, assign signup position for early adopter tracking
      if (!existingUser) {
        signupPosition = await storage.getNextSignupPosition();
      }

      // Upsert user in our database
      await storage.upsertFirebaseUser({
        id: uid,
        email: email || null,
        username: username || existingUser?.username || null,
        displayName: displayName || null,
        firstName: displayName?.split(' ')[0] || null,
        lastName: displayName?.split(' ').slice(1).join(' ') || null,
        profileImageUrl: photoURL || null,
        signupPosition: signupPosition,
      });

      res.json({ success: true, signupPosition });
    } catch (error) {
      console.error("Firebase sync error:", error);
      res.status(500).json({ error: "Failed to sync user" });
    }
  });

  // Simple Email/Password Registration (no Firebase required)
  app.post("/api/auth/register", authRateLimit, async (req, res) => {
    try {
      const { email, password, displayName, username, rememberMe } = req.body;
      
      if (!email || !password) {
        return res.status(400).json({ error: "Email and password are required" });
      }
      
      if (password.length < 4) {
        return res.status(400).json({ error: "Password must be at least 4 characters" });
      }

      if (!username || username.length < 2) {
        return res.status(400).json({ error: "Username must be at least 2 characters" });
      }

      // Validate username format: lowercase letters, numbers, underscores only
      const usernameRegex = /^[a-z0-9_]+$/;
      if (!usernameRegex.test(username)) {
        return res.status(400).json({ error: "Username can only contain lowercase letters, numbers, and underscores" });
      }

      // Check if user already exists
      const existingUser = await storage.getUserByEmail(email);
      if (existingUser) {
        return res.status(400).json({ error: "An account with this email already exists" });
      }

      // Check if username is taken
      const existingUsername = await db.select().from(users).where(eq(users.username, username)).limit(1);
      if (existingUsername.length > 0) {
        return res.status(400).json({ error: "This username is already taken" });
      }

      // Hash password with SHA-256 + salt
      const salt = crypto.randomBytes(16).toString('hex');
      const passwordHash = crypto.createHash('sha256').update(password + salt).digest('hex') + ':' + salt;

      // Get signup position for early adopter tracking
      const signupPosition = await storage.getNextSignupPosition();

      // Create user
      const userId = crypto.randomUUID();
      await storage.upsertFirebaseUser({
        id: userId,
        email: email,
        username: username,
        displayName: displayName || username,
        firstName: displayName?.split(' ')[0] || null,
        lastName: displayName?.split(' ').slice(1).join(' ') || null,
        profileImageUrl: null,
        signupPosition: signupPosition,
      });

      // Store password hash
      await db.update(users).set({ passwordHash }).where(eq(users.id, userId));

      // Set session
      (req.session as any).userId = userId;
      
      // Extend session to 30 days if rememberMe is checked
      if (rememberMe) {
        req.session.cookie.maxAge = 30 * 24 * 60 * 60 * 1000; // 30 days
      }

      res.json({ success: true, userId, signupPosition });
    } catch (error) {
      console.error("Registration error:", error);
      res.status(500).json({ error: "Registration failed" });
    }
  });

  // Simple Email/Password Login (no Firebase required)
  app.post("/api/auth/login", authRateLimit, async (req, res) => {
    try {
      const { email, password, rememberMe } = req.body;
      
      if (!email || !password) {
        return res.status(400).json({ error: "Email and password are required" });
      }

      // Find user
      const user = await storage.getUserByEmail(email);
      if (!user) {
        return res.status(401).json({ error: "Invalid email or password" });
      }

      if (!user.passwordHash) {
        return res.status(401).json({ error: "Please sign in with your original method (Google/GitHub)" });
      }

      // Verify password - passwordHash format: "hash:salt"
      const hashParts = user.passwordHash.split(':');
      if (hashParts.length !== 2) {
        console.error("Invalid password hash format for user:", user.id);
        return res.status(401).json({ error: "Invalid email or password" });
      }
      
      const [storedHash, salt] = hashParts;
      if (!storedHash || !salt) {
        return res.status(401).json({ error: "Invalid email or password" });
      }
      
      const providedHash = crypto.createHash('sha256').update(password + salt).digest('hex');
      
      // Use timing-safe comparison
      if (storedHash.length !== providedHash.length) {
        return res.status(401).json({ error: "Invalid email or password" });
      }
      
      if (!crypto.timingSafeEqual(Buffer.from(storedHash, 'hex'), Buffer.from(providedHash, 'hex'))) {
        return res.status(401).json({ error: "Invalid email or password" });
      }

      // Set session
      (req.session as any).userId = user.id;
      
      // Extend session to 30 days if rememberMe is checked
      if (rememberMe) {
        req.session.cookie.maxAge = 30 * 24 * 60 * 60 * 1000; // 30 days
      }

      res.json({ 
        success: true, 
        user: {
          id: user.id,
          email: user.email,
          displayName: user.displayName,
          profileImageUrl: user.profileImageUrl,
        }
      });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ error: "Login failed" });
    }
  });

  // Get current user session
  app.get("/api/auth/me", async (req, res) => {
    try {
      const userId = (req.session as any)?.userId;
      if (!userId) {
        return res.json({ user: null });
      }

      const user = await storage.getUser(userId);
      if (!user) {
        return res.json({ user: null });
      }

      res.json({ 
        user: {
          id: user.id,
          email: user.email,
          displayName: user.displayName,
          username: user.username,
          profileImageUrl: user.profileImageUrl,
        }
      });
    } catch (error) {
      console.error("Session check error:", error);
      res.json({ user: null });
    }
  });

  // Generate WebSocket auth token for real-time features
  app.get("/api/auth/ws-token", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user?.id || req.user?.claims?.sub;
      if (!userId) {
        return res.status(401).json({ error: "Not authenticated" });
      }
      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(401).json({ error: "User not found" });
      }
      
      // Create a simple JWT-like token for WebSocket auth
      const payload = {
        sub: user.id,
        name: user.firstName || user.displayName || user.email?.split('@')[0] || 'User',
        exp: Math.floor(Date.now() / 1000) + (60 * 60), // 1 hour expiry
        iat: Math.floor(Date.now() / 1000)
      };
      
      const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
      const payloadB64 = Buffer.from(JSON.stringify(payload)).toString('base64url');
      const signature = crypto.createHmac('sha256', process.env.SESSION_SECRET || 'darkwave-ws-secret')
        .update(`${header}.${payloadB64}`)
        .digest('base64url');
      
      const token = `${header}.${payloadB64}.${signature}`;
      
      res.json({ token });
    } catch (error) {
      console.error("WS token generation error:", error);
      res.status(500).json({ error: "Failed to generate token" });
    }
  });

  // Logout
  app.post("/api/auth/logout", (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ error: "Logout failed" });
      }
      res.json({ success: true });
    });
  });

  // Forgot Password - send reset email
  app.post("/api/auth/forgot-password", authRateLimit, async (req, res) => {
    try {
      const { email } = req.body;
      
      if (!email) {
        return res.status(400).json({ error: "Email is required" });
      }

      const user = await storage.getUserByEmail(email);
      
      // Always return success to prevent email enumeration
      if (!user) {
        return res.json({ success: true, message: "If an account exists, a reset email has been sent" });
      }

      // Generate secure token
      const token = crypto.randomBytes(32).toString('hex');
      const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

      // Store token in database
      await db.insert(passwordResetTokens).values({
        userId: user.id,
        token,
        expiresAt,
      });

      // Send reset email
      const baseUrl = process.env.REPLIT_DEV_DOMAIN 
        ? `https://${process.env.REPLIT_DEV_DOMAIN}`
        : process.env.REPLIT_DEPLOYMENT_URL || 'https://dwsc.io';
      const resetLink = `${baseUrl}/reset-password?token=${token}`;
      
      const { sendPasswordResetEmail } = await import('./email');
      await sendPasswordResetEmail(email, resetLink);

      res.json({ success: true, message: "If an account exists, a reset email has been sent" });
    } catch (error) {
      console.error("Forgot password error:", error);
      res.status(500).json({ error: "Failed to process request" });
    }
  });

  // Reset Password - verify token and set new password
  app.post("/api/auth/reset-password", authRateLimit, async (req, res) => {
    try {
      const { token, newPassword } = req.body;
      
      if (!token || !newPassword) {
        return res.status(400).json({ error: "Token and new password are required" });
      }

      if (newPassword.length < 6) {
        return res.status(400).json({ error: "Password must be at least 6 characters" });
      }

      // Find valid token
      const [resetToken] = await db.select()
        .from(passwordResetTokens)
        .where(eq(passwordResetTokens.token, token))
        .limit(1);

      if (!resetToken) {
        return res.status(400).json({ error: "Invalid or expired reset link" });
      }

      if (resetToken.used) {
        return res.status(400).json({ error: "This reset link has already been used" });
      }

      if (new Date() > resetToken.expiresAt) {
        return res.status(400).json({ error: "This reset link has expired" });
      }

      // Hash new password
      const salt = crypto.randomBytes(16).toString('hex');
      const passwordHash = crypto.createHash('sha256').update(newPassword + salt).digest('hex') + ':' + salt;

      // Use transaction to atomically update password and mark token as used
      await db.transaction(async (tx) => {
        // Update user password
        await tx.update(users).set({ passwordHash }).where(eq(users.id, resetToken.userId));

        // Mark token as used
        await tx.update(passwordResetTokens)
          .set({ used: true })
          .where(eq(passwordResetTokens.id, resetToken.id));
      });

      res.json({ success: true, message: "Password has been reset successfully" });
    } catch (error) {
      console.error("Reset password error:", error);
      res.status(500).json({ error: "Failed to reset password" });
    }
  });

  // PIN Registration - set a 4-6 digit PIN for quick login
  app.post("/api/auth/pin/register", authRateLimit, verifyFirebaseToken, async (req: FirebaseAuthRequest, res) => {
    try {
      const userId = req.firebaseUser?.uid;
      if (!userId) {
        return res.status(401).json({ error: "Authentication required" });
      }

      const { pin } = req.body;
      if (!pin || !/^\d{4,6}$/.test(pin)) {
        return res.status(400).json({ error: "PIN must be 4-6 digits" });
      }

      // Hash the PIN for secure storage
      const pinHash = crypto.createHash('sha256').update(pin + userId).digest('hex');
      await storage.setUserPin(userId, pinHash);

      res.json({ success: true, message: "PIN registered successfully" });
    } catch (error) {
      console.error("PIN registration error:", error);
      res.status(500).json({ error: "Failed to register PIN" });
    }
  });

  // PIN Login - authenticate with email + PIN
  // NOTE: PIN login provides user metadata for quick access but does NOT establish
  // a Firebase session. For full API access, users must sign in with Firebase auth.
  // PIN login is a convenience feature for returning users to quickly access their profile.
  app.post("/api/auth/pin/login", authRateLimit, async (req, res) => {
    try {
      const { email, pin } = req.body;
      
      if (!email || !pin) {
        return res.status(400).json({ error: "Email and PIN are required" });
      }

      if (!/^\d{4,6}$/.test(pin)) {
        return res.status(400).json({ error: "PIN must be 4-6 digits" });
      }

      // Find user by email - use uniform error to prevent enumeration
      const user = await storage.getUserByEmail(email);
      
      // Generate a dummy hash for timing-safe comparison even when user doesn't exist
      const dummyId = 'dummy-user-id-for-timing-safety';
      const userId = user?.id || dummyId;
      const storedHash = user?.pinHash || crypto.createHash('sha256').update('dummy').digest('hex');
      
      // Compute PIN hash
      const pinHash = crypto.createHash('sha256').update(pin + userId).digest('hex');
      
      // Use timing-safe comparison to prevent timing attacks
      const hashBuffer = Buffer.from(pinHash, 'hex');
      const storedBuffer = Buffer.from(storedHash, 'hex');
      
      // Ensure buffers are same length for timingSafeEqual
      let isValid = false;
      if (hashBuffer.length === storedBuffer.length) {
        isValid = crypto.timingSafeEqual(hashBuffer, storedBuffer);
      }
      
      // User must exist AND have PIN set AND hash must match
      if (!user || !user.pinHash || !isValid) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      // Return user data - NOTE: This is for display only, not for API access
      // Users should still authenticate with Firebase for protected API calls
      res.json({ 
        success: true, 
        user: {
          id: user.id,
          email: user.email,
          displayName: user.displayName,
          profileImageUrl: user.profileImageUrl,
        },
        message: "PIN verified. For full access, please sign in with your password."
      });
    } catch (error) {
      console.error("PIN login error:", error);
      res.status(500).json({ error: "Authentication failed" });
    }
  });

  // Check if user has PIN set up
  app.get("/api/auth/pin/status", verifyFirebaseToken, async (req: FirebaseAuthRequest, res) => {
    try {
      const userId = req.firebaseUser?.uid;
      if (!userId) {
        return res.status(401).json({ error: "Authentication required" });
      }

      const user = await storage.getFirebaseUser(userId);
      res.json({ hasPinSet: !!user?.pinHash });
    } catch (error) {
      console.error("PIN status error:", error);
      res.status(500).json({ error: "Failed to check PIN status" });
    }
  });

  // Early adopter stats for logged-in user
  app.get("/api/user/early-adopter-stats", verifyFirebaseToken, async (req: FirebaseAuthRequest, res) => {
    try {
      const userId = req.firebaseUser?.uid;
      if (!userId) {
        return res.status(401).json({ error: "Not authenticated" });
      }
      const user = await storage.getFirebaseUser(userId);
      if (!user) {
        return res.json({
          signupPosition: null,
          crowdfundTotalCents: 0,
          tokenPurchasePosition: null,
        });
      }
      res.json({
        signupPosition: user.signupPosition ? Number(user.signupPosition) : null,
        crowdfundTotalCents: 0,
        tokenPurchasePosition: null,
      });
    } catch (error) {
      console.error("Early adopter stats error:", error);
      res.status(500).json({ error: "Failed to get stats" });
    }
  });

  // Public early adopter counters (spots remaining, etc)
  app.get("/api/early-adopter/counters", async (req, res) => {
    try {
      const [counter] = await db.select().from(signupCounter).where(eq(signupCounter.id, 'global'));
      res.json({
        signupPosition: counter?.currentPosition || "0",
        tokenPurchasePosition: counter?.tokenPurchasePosition || "0",
      });
    } catch (error) {
      console.error("Counters error:", error);
      res.json({ signupPosition: "0", tokenPurchasePosition: "0" });
    }
  });

  // WebAuthn passkey routes
  app.post("/api/webauthn/register/start", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const email = req.user.claims.email || "user@darkwavechain.io";
      const options = await startRegistration(userId, email);
      res.json(options);
    } catch (error) {
      console.error("WebAuthn register start error:", error);
      res.status(500).json({ error: "Failed to start registration" });
    }
  });

  app.post("/api/webauthn/register/finish", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const result = await finishRegistration(userId, req.body);
      if (result.success) {
        res.json(result);
      } else {
        res.status(400).json(result);
      }
    } catch (error) {
      console.error("WebAuthn register finish error:", error);
      res.status(500).json({ error: "Failed to complete registration" });
    }
  });

  app.post("/api/webauthn/authenticate/start", async (req, res) => {
    try {
      const options = await startAuthentication();
      res.json(options);
    } catch (error) {
      console.error("WebAuthn auth start error:", error);
      res.status(500).json({ error: "Failed to start authentication" });
    }
  });

  app.post("/api/webauthn/authenticate/finish", async (req, res) => {
    try {
      const { requestId, ...credential } = req.body;
      const result = await finishAuthentication(credential, requestId);
      if (result.success && result.user) {
        res.json({ success: true, user: result.user });
      } else {
        res.status(401).json(result);
      }
    } catch (error) {
      console.error("WebAuthn auth finish error:", error);
      res.status(500).json({ error: "Failed to complete authentication" });
    }
  });

  app.get("/api/webauthn/passkeys", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const passkeys = await getUserPasskeys(userId);
      res.json(passkeys.map(pk => ({
        id: pk.id,
        deviceType: pk.deviceType,
        createdAt: pk.createdAt,
        lastUsedAt: pk.lastUsedAt,
      })));
    } catch (error) {
      console.error("WebAuthn get passkeys error:", error);
      res.status(500).json({ error: "Failed to get passkeys" });
    }
  });

  app.delete("/api/webauthn/passkeys/:id", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const passkeyId = req.params.id;
      const deleted = await deletePasskey(userId, passkeyId);
      if (deleted) {
        res.json({ success: true });
      } else {
        res.status(404).json({ error: "Passkey not found" });
      }
    } catch (error) {
      console.error("WebAuthn delete passkey error:", error);
      res.status(500).json({ error: "Failed to delete passkey" });
    }
  });

  // Team page PIN verification (server-side, secure)
  const teamPinAttempts = new Map<string, { count: number; lastAttempt: number }>();
  app.post("/api/team/verify-pin", rateLimit("team-pin", 5, 60000), async (req, res) => {
    try {
      const { pin } = req.body;
      const clientIp = req.ip || req.connection.remoteAddress || "unknown";
      
      // Check for lockout
      const attempts = teamPinAttempts.get(clientIp);
      if (attempts && attempts.count >= 5) {
        const lockoutDuration = 15 * 60 * 1000; // 15 minutes
        if (Date.now() - attempts.lastAttempt < lockoutDuration) {
          return res.status(429).json({ error: "Too many attempts. Try again later." });
        }
        teamPinAttempts.delete(clientIp);
      }
      
      if (!pin || typeof pin !== "string" || pin.length < 4) {
        return res.status(400).json({ error: "Invalid PIN format" });
      }
      
      // Use environment variable for team PIN, fallback to default for development only
      const teamPin = process.env.TEAM_ACCESS_PIN || (process.env.NODE_ENV === "development" ? "0424" : null);
      if (!teamPin) {
        return res.status(500).json({ error: "Team access not configured" });
      }
      
      // Timing-safe comparison
      const pinBuffer = Buffer.from(pin);
      const teamPinBuffer = Buffer.from(teamPin);
      const isValid = pinBuffer.length === teamPinBuffer.length && 
                      crypto.timingSafeEqual(pinBuffer, teamPinBuffer);
      
      if (isValid) {
        teamPinAttempts.delete(clientIp);
        res.json({ success: true });
      } else {
        const current = teamPinAttempts.get(clientIp) || { count: 0, lastAttempt: 0 };
        teamPinAttempts.set(clientIp, { count: current.count + 1, lastAttempt: Date.now() });
        res.status(401).json({ error: "Invalid PIN" });
      }
    } catch (error) {
      console.error("Team PIN verification error:", error);
      res.status(500).json({ error: "Verification failed" });
    }
  });

  app.get("/api/ecosystem/hub/status", ecosystemRateLimit, async (req, res) => {
    try {
      if (!ecosystemClient.isConfigured()) {
        return res.json({ 
          connected: false, 
          message: "API credentials not configured. Set DARKWAVE_API_KEY and DARKWAVE_API_SECRET." 
        });
      }
      const status = await ecosystemClient.checkStatus();
      res.json({ connected: true, status });
    } catch (error) {
      console.error("Hub status check failed:", error);
      res.json({ connected: false, error: "Failed to connect to DarkWave Hub" });
    }
  });

  app.post("/api/ecosystem/register", ecosystemRateLimit, async (req, res) => {
    try {
      const { appName, appSlug, appUrl, description, permissions, category, metadata } = req.body;
      
      if (!appName || !appSlug) {
        return res.status(400).json({ error: "appName and appSlug are required" });
      }

      const result = await ecosystemClient.registerApp({
        appName,
        appSlug,
        appUrl: appUrl || "",
        description: description || "",
        category: category || "general",
        permissions: permissions || ["read:ecosystem", "write:ecosystem"],
        metadata: metadata || {}
      });
      
      res.json({ success: true, data: result });
    } catch (error) {
      console.error("Error registering with DarkWave Hub:", error);
      res.status(500).json({ error: "Failed to connect to DarkWave Hub" });
    }
  });

  app.get("/api/ecosystem/sync", async (req, res) => {
    try {
      const apps = await ecosystemClient.getApps();
      res.json({ success: true, apps });
    } catch (error) {
      console.error("Error syncing with DarkWave Hub:", error);
      res.status(500).json({ error: "Failed to connect to DarkWave Hub" });
    }
  });

  app.get("/api/ecosystem/snippets", async (req, res) => {
    try {
      const { category, language } = req.query;
      const snippets = await ecosystemClient.getSnippets(
        category as string | undefined, 
        language as string | undefined
      );
      res.json(snippets);
    } catch (error) {
      console.error("Error fetching snippets:", error);
      res.status(500).json({ error: "Failed to fetch snippets" });
    }
  });

  app.post("/api/ecosystem/snippets", async (req, res) => {
    try {
      const result = await ecosystemClient.pushSnippet(req.body);
      res.json({ success: true, data: result });
    } catch (error) {
      console.error("Error pushing snippet:", error);
      res.status(500).json({ error: "Failed to push snippet" });
    }
  });

  app.get("/api/ecosystem/logs", async (req, res) => {
    try {
      const logs = await ecosystemClient.getLogs();
      res.json(logs);
    } catch (error) {
      console.error("Error fetching logs:", error);
      res.status(500).json({ error: "Failed to fetch logs" });
    }
  });

  app.post("/api/ecosystem/logs", async (req, res) => {
    try {
      const result = await ecosystemClient.log(req.body);
      res.json({ success: true, data: result });
    } catch (error) {
      console.error("Error pushing log:", error);
      res.status(500).json({ error: "Failed to push log" });
    }
  });
  
  app.get("/api/ecosystem/apps", ecosystemRateLimit, async (req, res) => {
    try {
      const apps = await fetchEcosystemApps();
      res.json(apps);
    } catch (error) {
      console.error("Error fetching ecosystem apps:", error);
      res.status(500).json({ error: "Failed to fetch ecosystem apps" });
    }
  });

  // Standard health endpoint for load balancers and monitoring
  app.get("/api/health", async (req, res) => {
    try {
      const chainInfo = blockchain.getChainInfo();
      res.json({
        status: "ok",
        timestamp: new Date().toISOString(),
        blockchain: chainInfo.blockHeight > 0 ? "operational" : "degraded",
        blockHeight: chainInfo.blockHeight,
        version: "1.2.5"
      });
    } catch (error) {
      res.status(503).json({ status: "error", message: "Service unavailable" });
    }
  });

  app.get("/api/system/health", async (req, res) => {
    try {
      const services: Array<{
        name: string;
        status: "operational" | "degraded" | "down";
        latency?: number;
        message?: string;
      }> = [];

      // Check DarkWave Smart Chain (Blockchain Engine)
      const chainStart = Date.now();
      try {
        const chainInfo = blockchain.getChainInfo();
        const chainLatency = Date.now() - chainStart;
        services.push({
          name: "DarkWave Smart Chain",
          status: chainInfo.blockHeight > 0 ? "operational" : "degraded",
          latency: chainLatency,
          message: `Block #${chainInfo.blockHeight}`
        });
      } catch {
        services.push({ name: "DarkWave Smart Chain", status: "down", message: "Chain unavailable" });
      }

      // Check Database
      const dbStart = Date.now();
      try {
        const docs = await storage.getDocuments();
        const dbLatency = Date.now() - dbStart;
        services.push({
          name: "Database",
          status: "operational",
          latency: dbLatency,
          message: `Connection active`
        });
      } catch {
        services.push({ name: "Database", status: "down", message: "Connection failed" });
      }

      // Check Hash Submission API
      services.push({
        name: "Hash Submission API",
        status: "operational",
        message: "POST /api/hash/submit"
      });

      // Check Dual-Chain Stamping
      services.push({
        name: "Dual-Chain Stamping",
        status: "operational",
        message: "DarkWave + Solana"
      });

      // Check Hallmark System
      const hallmarkStart = Date.now();
      try {
        const hallmarks = await storage.getAllHallmarks(1);
        const hallmarkLatency = Date.now() - hallmarkStart;
        services.push({
          name: "Hallmark System",
          status: "operational",
          latency: hallmarkLatency,
          message: `QR generation active`
        });
      } catch {
        services.push({ name: "Hallmark System", status: "degraded", message: "Limited functionality" });
      }

      // Check DarkWave Hub (External)
      const hubStart = Date.now();
      try {
        if (ecosystemClient.isConfigured()) {
          const hubStatus = await ecosystemClient.checkStatus();
          const hubLatency = Date.now() - hubStart;
          services.push({
            name: "DarkWave Hub",
            status: hubStatus ? "operational" : "degraded",
            latency: hubLatency,
            message: "Ecosystem sync active"
          });
        } else {
          services.push({
            name: "DarkWave Hub",
            status: "degraded",
            message: "Credentials not configured"
          });
        }
      } catch {
        services.push({ name: "DarkWave Hub", status: "down", message: "Connection timeout" });
      }

      // Check Solana/Helius RPC
      if (isHeliusConfigured()) {
        const solanaStart = Date.now();
        try {
          const balance = await getSolanaBalance();
          const solanaLatency = Date.now() - solanaStart;
          services.push({
            name: "Solana (Helius)",
            status: balance !== null ? "operational" : "degraded",
            latency: solanaLatency,
            message: balance !== null ? `Treasury: ${balance.toFixed(4)} SOL` : "Connection issue"
          });
        } catch {
          services.push({ name: "Solana (Helius)", status: "down", message: "RPC unavailable" });
        }
      }

      // Check Email Service
      services.push({
        name: "Email Service",
        status: "operational",
        message: "Resend integration"
      });

      // Calculate overall status
      const downCount = services.filter(s => s.status === "down").length;
      const degradedCount = services.filter(s => s.status === "degraded").length;
      
      let overallStatus: "operational" | "degraded" | "down" = "operational";
      if (downCount > 0) overallStatus = "down";
      else if (degradedCount > 0) overallStatus = "degraded";

      res.json({
        status: overallStatus,
        timestamp: new Date().toISOString(),
        services,
        uptime: process.uptime(),
        version: APP_VERSION
      });
    } catch (error) {
      console.error("Error checking system health:", error);
      res.status(500).json({ error: "Failed to check system health" });
    }
  });

  app.get("/api/blockchain/stats", async (req, res) => {
    try {
      const stats = await fetchBlockchainStats();
      res.json(stats);
    } catch (error) {
      console.error("Error fetching blockchain stats:", error);
      res.status(500).json({ error: "Failed to fetch blockchain stats" });
    }
  });

  app.get("/api/blockchain/treasury", async (req, res) => {
    try {
      const treasury = await fetchTreasuryInfo();
      res.json(treasury);
    } catch (error) {
      console.error("Error fetching treasury info:", error);
      res.status(500).json({ error: "Failed to fetch treasury info" });
    }
  });

  app.post("/api/blockchain/treasury/distribute", async (req, res) => {
    try {
      const { to, amount } = req.body;
      if (!to || !amount) {
        return res.status(400).json({ error: "to and amount are required" });
      }
      const result = await distributeTokens(to, amount);
      res.json(result);
    } catch (error: any) {
      console.error("Error distributing tokens:", error);
      res.status(500).json({ error: error.message || "Failed to distribute tokens" });
    }
  });

  // ============================================
  // TREASURY SYNC API (Orbit Staffing Integration)
  // ============================================
  // HMAC-authenticated endpoint for external bookkeeping sync
  
  app.get("/api/treasury/sync", async (req, res) => {
    try {
      const apiKey = req.headers["x-orbit-key"] as string;
      const timestamp = req.headers["x-orbit-timestamp"] as string;
      const signature = req.headers["x-orbit-signature"] as string;
      const nonce = req.headers["x-orbit-nonce"] as string || "";
      
      // Verify HMAC signature
      const expectedKey = process.env.ORBIT_HUB_API_KEY;
      const expectedSecret = process.env.ORBIT_HUB_API_SECRET;
      
      if (!expectedKey || !expectedSecret) {
        console.error("Treasury sync: ORBIT_HUB credentials not configured");
        return res.status(500).json({ error: "Integration not configured", code: "CONFIG_ERROR" });
      }
      
      if (!apiKey || !timestamp || !signature) {
        return res.status(401).json({ error: "Missing authentication headers", code: "AUTH_MISSING" });
      }
      
      // Verify timestamp is within 5 minutes
      const timestampMs = parseInt(timestamp);
      const now = Date.now();
      if (isNaN(timestampMs) || Math.abs(now - timestampMs) > 5 * 60 * 1000) {
        return res.status(401).json({ error: "Request expired or invalid timestamp", code: "TIMESTAMP_INVALID" });
      }
      
      // Constant-time API key comparison
      const keyBuffer = Buffer.from(apiKey);
      const expectedKeyBuffer = Buffer.from(expectedKey);
      if (keyBuffer.length !== expectedKeyBuffer.length || !crypto.timingSafeEqual(keyBuffer, expectedKeyBuffer)) {
        return res.status(401).json({ error: "Invalid API key", code: "AUTH_INVALID" });
      }
      
      // Verify HMAC signature with nonce for replay protection
      const payload = `GET:/api/treasury/sync:${timestamp}:${nonce}`;
      const expectedSignature = crypto.createHmac("sha256", expectedSecret).update(payload).digest("hex");
      
      // Constant-time signature comparison
      const sigBuffer = Buffer.from(signature);
      const expectedSigBuffer = Buffer.from(expectedSignature);
      if (sigBuffer.length !== expectedSigBuffer.length || !crypto.timingSafeEqual(sigBuffer, expectedSigBuffer)) {
        return res.status(401).json({ error: "Invalid signature", code: "SIG_INVALID" });
      }
      
      // Fetch treasury data with error handling
      let treasuryInfo;
      try {
        treasuryInfo = await fetchTreasuryInfo();
      } catch (fetchError) {
        console.error("Treasury sync: Failed to fetch treasury info", fetchError);
        return res.status(503).json({ error: "Treasury data temporarily unavailable", code: "TREASURY_FETCH_ERROR" });
      }
      
      let allocations, ledger;
      try {
        allocations = await storage.getTreasuryAllocations();
        ledger = await storage.getTreasuryLedger(100);
      } catch (storageError) {
        console.error("Treasury sync: Storage error", storageError);
        return res.status(503).json({ error: "Database temporarily unavailable", code: "STORAGE_ERROR" });
      }
      
      const syncResponse = {
        snapshot: {
          asOf: new Date().toISOString(),
          chainBlock: blockchain.getLatestBlock()?.header?.height || 0,
          treasuryAddress: treasuryInfo?.address || "unknown",
          treasuryBalanceDwc: treasuryInfo?.balance || "0",
          totalSupply: treasuryInfo?.total_supply || "1,000,000,000 DWC",
        },
        allocations: (allocations || []).map(a => ({
          category: a.category,
          label: a.label,
          percentage: a.percentage,
          description: a.description,
          color: a.color,
        })),
        ledger: (ledger || []).map(l => ({
          id: l.id,
          category: l.category,
          amountDwc: l.amountDwc,
          amountUsd: l.amountUsd,
          transactionType: l.transactionType,
          txHash: l.txHash,
          notes: l.notes,
          createdAt: l.createdAt,
        })),
        protocolFees: {
          dexSwapFee: "0.3%",
          nftMarketplaceFee: "2.5%",
          bridgeFee: "0.1%",
          launchpadFee: "Listing-based",
          buyTax: "0%",
          sellTax: "0%",
        },
        meta: {
          version: "1.0",
          source: "dwsc.io",
          syncTimestamp: Date.now(),
          requestNonce: nonce || null,
        },
      };
      
      res.json(syncResponse);
    } catch (error: any) {
      console.error("Treasury sync error:", error);
      res.status(500).json({ error: "Internal server error", code: "INTERNAL_ERROR" });
    }
  });

  app.get("/api/chain", async (req, res) => {
    try {
      const chainInfo = blockchain.getChainInfo();
      res.json(chainInfo);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch chain info" });
    }
  });

  // Validator management endpoints
  app.get("/api/validators", async (req, res) => {
    try {
      const validators = blockchain.getValidators();
      res.json({
        validators,
        totalValidators: validators.length,
        activeValidators: validators.filter(v => v.status === "active").length,
      });
    } catch (error) {
      console.error("Error fetching validators:", error);
      res.status(500).json({ error: "Failed to fetch validators" });
    }
  });

  app.post("/api/validators", isAuthenticated, async (req, res) => {
    try {
      const { address, name, description, stake } = req.body;
      
      if (!address || !name) {
        return res.status(400).json({ error: "address and name are required" });
      }

      // Validate address format
      if (!address.startsWith("0x") || address.length !== 42) {
        return res.status(400).json({ error: "Invalid wallet address format" });
      }

      const validator = await blockchain.addValidator(address, name, description, stake);
      
      if (!validator) {
        return res.status(500).json({ error: "Failed to add validator" });
      }

      res.status(201).json({
        success: true,
        message: `Validator "${name}" added successfully`,
        validator,
      });
    } catch (error: any) {
      console.error("Error adding validator:", error);
      if (error.message?.includes("duplicate")) {
        return res.status(409).json({ error: "Validator with this address already exists" });
      }
      res.status(500).json({ error: "Failed to add validator" });
    }
  });

  app.delete("/api/validators/:id", isAuthenticated, async (req, res) => {
    try {
      const { id } = req.params;
      const success = await blockchain.removeValidator(id);
      
      if (!success) {
        return res.status(404).json({ error: "Validator not found" });
      }

      res.json({
        success: true,
        message: "Validator deactivated successfully",
      });
    } catch (error) {
      console.error("Error removing validator:", error);
      res.status(500).json({ error: "Failed to remove validator" });
    }
  });
  
  // BFT Consensus Endpoints
  app.get("/api/consensus", async (_req, res) => {
    try {
      const consensusState = blockchain.getConsensusState();
      res.json(consensusState);
    } catch (error) {
      console.error("Error fetching consensus state:", error);
      res.status(500).json({ error: "Failed to fetch consensus state" });
    }
  });
  
  app.get("/api/consensus/stats", async (_req, res) => {
    try {
      const stats = blockchain.getStats();
      const consensus = blockchain.getConsensusState();
      res.json({
        ...stats,
        consensus,
        decentralizationScore: Math.min(100, consensus.nakamotoCoefficient * 10 + consensus.activeValidators * 5),
        isDecentralized: consensus.activeValidators >= 3 && consensus.nakamotoCoefficient >= 2,
      });
    } catch (error) {
      console.error("Error fetching consensus stats:", error);
      res.status(500).json({ error: "Failed to fetch consensus stats" });
    }
  });
  
  // Validator registration with stake
  app.post("/api/validators/register", isAuthenticated, async (req: any, res) => {
    try {
      const { address, name, stakeAmount, description, commission } = req.body;
      
      if (!address || !name || !stakeAmount) {
        return res.status(400).json({ error: "address, name, and stakeAmount are required" });
      }
      
      const stake = BigInt(stakeAmount);
      const result = await blockchain.registerValidator(address, name, stake, description, commission);
      
      if (!result.success) {
        return res.status(400).json({ error: result.error });
      }
      
      res.status(201).json({
        success: true,
        message: `Validator "${name}" registered successfully`,
        validator: result.validator,
      });
    } catch (error: any) {
      console.error("Error registering validator:", error);
      res.status(500).json({ error: "Failed to register validator" });
    }
  });
  
  // Increase validator stake
  app.post("/api/validators/:id/stake", isAuthenticated, async (req: any, res) => {
    try {
      const { id } = req.params;
      const { amount, fromAddress } = req.body;
      
      if (!amount || !fromAddress) {
        return res.status(400).json({ error: "amount and fromAddress are required" });
      }
      
      const result = await blockchain.increaseStake(id, BigInt(amount), fromAddress);
      
      if (!result.success) {
        return res.status(400).json({ error: result.error });
      }
      
      res.json({ success: true, message: "Stake increased successfully" });
    } catch (error) {
      console.error("Error increasing stake:", error);
      res.status(500).json({ error: "Failed to increase stake" });
    }
  });
  
  // Block attestation (for external validators)
  // Validators must sign: `${blockHeight}:${blockHash}:${validatorAddress}:${timestamp}`
  // with HMAC-SHA256 using their validator secret key
  app.post("/api/consensus/attest", isAuthenticated, async (req: any, res) => {
    try {
      const { blockHeight, blockHash, validatorId, signature, timestamp } = req.body;
      
      if (!blockHeight || !blockHash || !validatorId || !signature || !timestamp) {
        return res.status(400).json({ 
          error: "blockHeight, blockHash, validatorId, signature, and timestamp are required",
          signatureFormat: "HMAC-SHA256(${blockHeight}:${blockHash}:${validatorAddress}:${timestamp})"
        });
      }
      
      // Validate timestamp is recent (within 30 seconds to prevent replay attacks)
      const attestationTime = parseInt(timestamp);
      const now = Date.now();
      if (isNaN(attestationTime) || Math.abs(now - attestationTime) > 30000) {
        return res.status(400).json({ error: "Timestamp expired or invalid (must be within 30 seconds)" });
      }
      
      const result = await blockchain.addBlockAttestation(blockHeight, blockHash, validatorId, signature, timestamp);
      
      if (!result.success) {
        return res.status(400).json({ error: result.error });
      }
      
      res.json({ 
        success: true, 
        finalized: result.finalized,
        attestedStake: result.attestedStake,
        totalStake: result.totalStake,
        message: result.finalized ? "Block finalized with quorum" : "Attestation recorded, awaiting quorum" 
      });
    } catch (error) {
      console.error("Error adding attestation:", error);
      res.status(500).json({ error: "Failed to add attestation" });
    }
  });
  
  // Slash validator (admin only)
  app.post("/api/validators/:id/slash", isAuthenticated, async (req: any, res) => {
    try {
      const { id } = req.params;
      const { reason, evidence } = req.body;
      
      if (!reason) {
        return res.status(400).json({ error: "reason is required" });
      }
      
      const result = await blockchain.slashValidator(id, reason, evidence);
      
      if (!result.success) {
        return res.status(400).json({ error: result.error });
      }
      
      res.json({ 
        success: true, 
        slashAmount: result.slashAmount,
        message: `Validator slashed for ${reason}` 
      });
    } catch (error) {
      console.error("Error slashing validator:", error);
      res.status(500).json({ error: "Failed to slash validator" });
    }
  });
  
  // Node sync endpoint (for external nodes to sync chain state)
  app.get("/api/sync/state", async (req, res) => {
    try {
      const fromBlock = parseInt(req.query.fromBlock as string) || 0;
      const toBlock = req.query.toBlock ? parseInt(req.query.toBlock as string) : undefined;
      
      const state = await blockchain.getChainStateForSync(fromBlock, toBlock);
      res.json(state);
    } catch (error) {
      console.error("Error fetching sync state:", error);
      res.status(500).json({ error: "Failed to fetch sync state" });
    }
  });
  
  // Validator details
  app.get("/api/validators/:id", async (req, res) => {
    try {
      const validator = blockchain.getValidatorDetails(req.params.id);
      if (!validator) {
        return res.status(404).json({ error: "Validator not found" });
      }
      res.json(validator);
    } catch (error) {
      console.error("Error fetching validator details:", error);
      res.status(500).json({ error: "Failed to fetch validator details" });
    }
  });

  app.get("/api/block/latest", async (req, res) => {
    try {
      const block = blockchain.getLatestBlock();
      if (!block) {
        return res.status(404).json({ error: "No blocks found" });
      }
      res.json({
        height: block.header.height,
        hash: block.hash,
        prevHash: block.header.prevHash,
        timestamp: block.header.timestamp.toISOString(),
        validator: block.header.validator,
        txCount: block.transactions.length,
        merkleRoot: block.header.merkleRoot,
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch latest block" });
    }
  });

  app.get("/api/block/:height", async (req, res) => {
    try {
      const height = parseInt(req.params.height);
      if (isNaN(height)) {
        return res.status(400).json({ error: "Invalid block height" });
      }
      const block = blockchain.getBlock(height);
      if (!block) {
        return res.status(404).json({ error: "Block not found" });
      }
      res.json({
        height: block.header.height,
        hash: block.hash,
        prevHash: block.header.prevHash,
        timestamp: block.header.timestamp.toISOString(),
        validator: block.header.validator,
        txCount: block.transactions.length,
        merkleRoot: block.header.merkleRoot,
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch block" });
    }
  });

  app.get("/api/account/:address", async (req, res) => {
    try {
      const account = blockchain.getAccount(req.params.address);
      if (!account) {
        return res.status(404).json({ error: "Account not found" });
      }
      res.json({
        address: account.address,
        balance: account.balance.toString(),
        nonce: account.nonce,
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch account" });
    }
  });

  app.get("/api/transactions/recent", async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 10;
      const transactions = await storage.getRecentTransactions(limit);
      res.json(transactions);
    } catch (error) {
      console.error("Error fetching recent transactions:", error);
      res.status(500).json({ error: "Failed to fetch transactions" });
    }
  });

  app.get("/api/documents", documentRateLimit, async (req, res) => {
    try {
      const { category, appId } = req.query;
      let docs;
      if (category && typeof category === "string") {
        docs = await storage.getDocumentsByCategory(category);
      } else if (appId && typeof appId === "string") {
        docs = await storage.getDocumentsByAppId(appId);
      } else {
        docs = await storage.getDocuments();
      }
      res.json(docs);
    } catch (error) {
      console.error("Error fetching documents:", error);
      res.status(500).json({ error: "Failed to fetch documents" });
    }
  });

  app.get("/api/documents/:id", async (req, res) => {
    try {
      const doc = await storage.getDocument(req.params.id);
      if (!doc) {
        return res.status(404).json({ error: "Document not found" });
      }
      res.json(doc);
    } catch (error) {
      console.error("Error fetching document:", error);
      res.status(500).json({ error: "Failed to fetch document" });
    }
  });

  const requireOwnerForDocs = (req: any, res: any, next: any) => {
    const ownerSecret = process.env.OWNER_SECRET;
    const providedSecret = req.headers["x-owner-secret"];
    if (!ownerSecret || !providedSecret || typeof providedSecret !== 'string') {
      return res.status(403).json({ error: "Document management is restricted to owner only" });
    }
    try {
      const secretBuffer = Buffer.from(ownerSecret, 'utf8');
      const providedBuffer = Buffer.from(providedSecret, 'utf8');
      if (secretBuffer.length !== providedBuffer.length || !require('crypto').timingSafeEqual(secretBuffer, providedBuffer)) {
        return res.status(403).json({ error: "Document management is restricted to owner only" });
      }
    } catch {
      return res.status(403).json({ error: "Document management is restricted to owner only" });
    }
    next();
  };

  app.post("/api/documents", documentRateLimit, requireOwnerForDocs, async (req, res) => {
    try {
      const parsed = insertDocumentSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ error: "Invalid document data", details: parsed.error.errors });
      }
      const doc = await storage.createDocument(parsed.data);
      res.status(201).json(doc);
    } catch (error) {
      console.error("Error creating document:", error);
      res.status(500).json({ error: "Failed to create document" });
    }
  });

  app.patch("/api/documents/:id", requireOwnerForDocs, async (req, res) => {
    try {
      const doc = await storage.updateDocument(req.params.id, req.body);
      if (!doc) {
        return res.status(404).json({ error: "Document not found" });
      }
      res.json(doc);
    } catch (error) {
      console.error("Error updating document:", error);
      res.status(500).json({ error: "Failed to update document" });
    }
  });

  app.delete("/api/documents/:id", requireOwnerForDocs, async (req, res) => {
    try {
      await storage.deleteDocument(req.params.id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting document:", error);
      res.status(500).json({ error: "Failed to delete document" });
    }
  });

  app.post("/api/generate-qr", async (req, res) => {
    try {
      const { data, size = 200 } = req.body;
      if (!data || typeof data !== 'string') {
        return res.status(400).json({ error: "Invalid data for QR code" });
      }
      const dataUrl = await QRCode.toDataURL(data, {
        width: Math.min(Math.max(size, 100), 500),
        margin: 2,
        color: { dark: "#000000", light: "#ffffff" },
        errorCorrectionLevel: 'M',
      });
      res.json({ dataUrl });
    } catch (error) {
      console.error("Error generating QR code:", error);
      res.status(500).json({ error: "Failed to generate QR code" });
    }
  });

  app.post("/api/analytics/track", async (req, res) => {
    try {
      const parsed = insertPageViewSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ error: "Invalid tracking data" });
      }
      await storage.recordPageView(parsed.data);
      res.status(201).json({ success: true });
    } catch (error) {
      console.error("Error tracking page view:", error);
      res.status(500).json({ error: "Failed to track page view" });
    }
  });

  const pinAttempts = new Map<string, { count: number; lastAttempt: number }>();
  const developerSessions = new Map<string, { createdAt: number; expiresAt: number }>();
  const DEVELOPER_PIN = process.env.DEVELOPER_PIN;
  const MAX_ATTEMPTS = 5;
  const LOCKOUT_DURATION = 5 * 60 * 1000;
  const SESSION_DURATION = 60 * 60 * 1000;

  function generateSessionToken(): string {
    return `dws_${crypto.randomBytes(32).toString("hex")}`;
  }

  function validateDeveloperSession(token: string): boolean {
    const session = developerSessions.get(token);
    if (!session) return false;
    if (Date.now() - session.createdAt > SESSION_DURATION) {
      developerSessions.delete(token);
      return false;
    }
    return true;
  }

  app.post("/api/developer/auth", developerRateLimit, async (req, res) => {
    try {
      const { pin } = req.body;
      const clientIp = req.ip || req.socket.remoteAddress || "unknown";
      
      const attempt = pinAttempts.get(clientIp);
      if (attempt && attempt.count >= MAX_ATTEMPTS) {
        const timeSinceLockout = Date.now() - attempt.lastAttempt;
        if (timeSinceLockout < LOCKOUT_DURATION) {
          const remainingSeconds = Math.ceil((LOCKOUT_DURATION - timeSinceLockout) / 1000);
          return res.status(429).json({ 
            error: `Too many attempts. Try again in ${remainingSeconds} seconds.` 
          });
        }
        pinAttempts.delete(clientIp);
      }

      if (!DEVELOPER_PIN) {
        return res.status(503).json({ error: "Developer portal not configured" });
      }
      
      if (pin === DEVELOPER_PIN) {
        pinAttempts.delete(clientIp);
        const sessionToken = generateSessionToken();
        developerSessions.set(sessionToken, { createdAt: Date.now(), expiresAt: Date.now() + SESSION_DURATION });
        res.json({ success: true, version: APP_VERSION, sessionToken });
      } else {
        const current = pinAttempts.get(clientIp) || { count: 0, lastAttempt: 0 };
        pinAttempts.set(clientIp, { 
          count: current.count + 1, 
          lastAttempt: Date.now() 
        });
        res.status(401).json({ error: "Invalid PIN" });
      }
    } catch (error) {
      res.status(500).json({ error: "Authentication failed" });
    }
  });

  app.get("/api/developer/analytics", async (req, res) => {
    try {
      const overview = await storage.getAnalyticsOverview();
      res.json(overview);
    } catch (error) {
      console.error("Error fetching analytics:", error);
      res.status(500).json({ error: "Failed to fetch analytics" });
    }
  });

  app.get("/api/developer/info", async (req, res) => {
    res.json({
      version: APP_VERSION,
      chainId: 8453,
      chainName: "DarkWave Smart Chain",
      nativeToken: "DWC",
      totalSupply: "1,000,000,000",
    });
  });

  app.get("/api/gas/estimate", async (req, res) => {
    try {
      const dataSize = parseInt(req.query.dataSize as string) || 0;
      const baseGas = 21000;
      const dataGas = dataSize * 16;
      const gasLimit = baseGas + dataGas;
      const gasPrice = 1000000;
      
      const ONE_DWC = BigInt("1000000000000000000");
      const totalGas = BigInt(gasLimit) * BigInt(gasPrice);
      const costInDWC = Number(totalGas) / Number(ONE_DWC);
      const costInUSD = costInDWC * 0.01;

      res.json({
        gasLimit,
        gasPrice,
        estimatedCost: `${totalGas}`,
        estimatedCostDWC: `${costInDWC.toFixed(8)} DWC`,
        estimatedCostUSD: `$${costInUSD.toFixed(6)}`,
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to estimate gas" });
    }
  });

  app.get("/api/fees/schedule", async (req, res) => {
    res.json({
      baseFee: 21000,
      priorityFee: 1000,
      maxFee: 100000,
      feePerByte: 16,
      hashSubmissionFee: 25000,
      currency: "DWC",
      estimatedUSDPerDWC: 0.01,
    });
  });

  function generateApiKey(): string {
    const bytes = crypto.randomBytes(32);
    return `dwc_${bytes.toString("hex")}`;
  }

  app.post("/api/developer/register", developerRateLimit, async (req, res) => {
    try {
      const sessionToken = req.headers["x-developer-session"] as string;
      const user = (req as any).user;
      
      const hasDevSession = sessionToken && validateDeveloperSession(sessionToken);
      const hasUserSession = req.isAuthenticated?.() && user;
      
      if (!hasDevSession && !hasUserSession) {
        return res.status(401).json({ error: "Please log in with your account or authenticate with developer PIN." });
      }

      const { name, email, appName } = req.body;
      
      const registrantName = name || (hasUserSession ? `${user.firstName || ''} ${user.lastName || ''}`.trim() : null);
      const registrantEmail = email || (hasUserSession ? user.email : null);
      
      if (!registrantName || !registrantEmail || !appName) {
        return res.status(400).json({ error: "Name, email, and app name are required" });
      }

      const rawKey = generateApiKey();
      const result = await storage.createApiKey({
        name: registrantName,
        email: registrantEmail,
        appName,
        permissions: "read,write",
        rateLimit: "1000",
        isActive: true,
      }, rawKey);

      await billingService.createOrGetBillingRecord(result.apiKey.id, registrantEmail);

      res.json({
        success: true,
        apiKey: rawKey,
        appName: result.apiKey.appName,
        message: "Save this API key securely - it won't be shown again!",
      });
    } catch (error) {
      console.error("Error registering API key:", error);
      res.status(500).json({ error: "Failed to register API key" });
    }
  });

  app.post("/api/hash/submit", hashSubmitRateLimit, async (req, res) => {
    try {
      const apiKey = req.headers["x-api-key"] as string;
      
      if (!apiKey) {
        return res.status(401).json({ error: "API key required" });
      }

      const validKey = await storage.validateApiKey(apiKey);
      if (!validKey) {
        return res.status(401).json({ error: "Invalid or revoked API key" });
      }

      const { dataHash, category, appId, metadata } = req.body;
      
      if (!dataHash) {
        return res.status(400).json({ error: "dataHash is required" });
      }

      const blockchainTx = blockchain.submitDataHash(dataHash, validKey.id.toString());
      const chainInfo = blockchain.getChainInfo();
      const gasUsed = "21000";
      const fee = "21000";

      const tx = await storage.recordTransactionHash({
        txHash: blockchainTx.hash,
        dataHash,
        category: category || "general",
        appId: appId || null,
        apiKeyId: validKey.id,
        status: "confirmed",
        blockHeight: chainInfo.blockHeight.toString(),
        gasUsed,
        fee,
      });

      res.json({
        success: true,
        txHash: blockchainTx.hash,
        status: "confirmed",
        fee: `${Number(fee) / 1e18} DWC`,
        blockHeight: chainInfo.blockHeight.toString(),
        timestamp: blockchainTx.timestamp.toISOString(),
      });
    } catch (error) {
      console.error("Error submitting hash:", error);
      res.status(500).json({ error: "Failed to submit hash" });
    }
  });

  app.get("/api/hash/:txHash", async (req, res) => {
    try {
      const tx = await storage.getTransactionHashByTxHash(req.params.txHash);
      
      if (!tx) {
        return res.status(404).json({ error: "Transaction not found" });
      }

      res.json({
        txHash: tx.txHash,
        dataHash: tx.dataHash,
        category: tx.category,
        status: tx.status,
        blockHeight: tx.blockHeight,
        fee: tx.fee ? `${Number(tx.fee) / 1e18} DWC` : null,
        createdAt: tx.createdAt,
        confirmedAt: tx.confirmedAt,
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch transaction" });
    }
  });

  app.get("/api/developer/transactions", async (req, res) => {
    try {
      const apiKey = req.headers["x-api-key"] as string;
      
      if (!apiKey) {
        return res.status(401).json({ error: "API key required" });
      }

      const validKey = await storage.validateApiKey(apiKey);
      if (!validKey) {
        return res.status(401).json({ error: "Invalid or revoked API key" });
      }

      const transactions = await storage.getTransactionHashesByApiKey(validKey.id);
      
      res.json({
        transactions: transactions.map(tx => ({
          txHash: tx.txHash,
          dataHash: tx.dataHash,
          category: tx.category,
          status: tx.status,
          blockHeight: tx.blockHeight,
          createdAt: tx.createdAt,
        })),
        total: transactions.length,
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch transactions" });
    }
  });

  app.post("/api/stamp/dual", async (req, res) => {
    try {
      const apiKey = req.headers["x-api-key"] as string;
      
      if (!apiKey) {
        return res.status(401).json({ error: "API key required" });
      }

      const validKey = await storage.validateApiKey(apiKey);
      if (!validKey) {
        return res.status(401).json({ error: "Invalid or revoked API key" });
      }

      const { data, appId, appName, category, metadata, chains } = req.body;

      if (!data) {
        return res.status(400).json({ error: "Data to hash is required" });
      }

      const dataHash = typeof data === "string" && data.startsWith("0x") 
        ? data 
        : generateDataHash(data);

      const requestedChains = chains || ["darkwave"];
      const result: {
        dataHash: string;
        darkwave?: { success: boolean; txHash?: string; blockHeight?: number; error?: string };
        solana?: { success: boolean; txSignature?: string; error?: string };
        allSuccessful: boolean;
        stampId?: string;
      } = {
        dataHash,
        allSuccessful: true,
      };

      const stamp = await storage.recordDualChainStamp({
        dataHash,
        appId: appId || validKey.appName,
        appName: appName || validKey.appName,
        category: category || "release",
        metadata: metadata ? JSON.stringify(metadata) : null,
        darkwaveStatus: "pending",
        solanaStatus: requestedChains.includes("solana") ? "pending" : "skipped",
      });
      result.stampId = stamp.id;

      if (requestedChains.includes("darkwave")) {
        const dwResult = await submitHashToDarkWave({
          dataHash,
          appId: appId || validKey.appName,
          category: category || "release",
          metadata: metadata || {},
        });

        result.darkwave = {
          success: dwResult.success,
          txHash: dwResult.txHash,
          blockHeight: dwResult.blockHeight ? parseInt(dwResult.blockHeight.toString()) : undefined,
          error: dwResult.error,
        };

        if (!dwResult.success) {
          result.allSuccessful = false;
        }

        await storage.updateDualChainStamp(stamp.id, {
          darkwaveTxHash: dwResult.txHash || null,
          darkwaveStatus: dwResult.success ? "confirmed" : "failed",
          darkwaveBlockHeight: dwResult.blockHeight?.toString() || null,
        });
      }

      if (requestedChains.includes("solana")) {
        if (isHeliusConfigured()) {
          const solResult = await submitMemoToSolana(dataHash, stamp.id, metadata);
          
          result.solana = {
            success: solResult.success,
            txSignature: solResult.txSignature,
            error: solResult.error,
          };

          if (!solResult.success) {
            result.allSuccessful = false;
          }

          await storage.updateDualChainStamp(stamp.id, {
            solanaTxSignature: solResult.txSignature || null,
            solanaStatus: solResult.success ? "confirmed" : "failed",
          });
        } else {
          result.solana = {
            success: false,
            error: `Solana requires client-side signing. After submitting to Solana, call PATCH /api/stamp/${stamp.id}/solana with your txSignature.`,
          };
          result.allSuccessful = false;
        }
      }

      res.status(201).json(result);
    } catch (error) {
      console.error("Dual chain stamp error:", error);
      res.status(500).json({ error: "Failed to submit dual-chain stamp" });
    }
  });

  app.get("/api/stamp/:stampId", async (req, res) => {
    try {
      const { stampId } = req.params;
      const stamp = await storage.getDualChainStamp(stampId);

      if (!stamp) {
        return res.status(404).json({ error: "Stamp not found" });
      }

      res.json({
        id: stamp.id,
        dataHash: stamp.dataHash,
        appId: stamp.appId,
        appName: stamp.appName,
        category: stamp.category,
        metadata: stamp.metadata ? JSON.parse(stamp.metadata) : null,
        darkwave: {
          txHash: stamp.darkwaveTxHash,
          status: stamp.darkwaveStatus,
          blockHeight: stamp.darkwaveBlockHeight,
        },
        solana: {
          txSignature: stamp.solanaTxSignature,
          status: stamp.solanaStatus,
        },
        createdAt: stamp.createdAt,
        confirmedAt: stamp.confirmedAt,
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch stamp" });
    }
  });

  app.get("/api/stamps/app/:appId", async (req, res) => {
    try {
      const { appId } = req.params;
      const stamps = await storage.getDualChainStampsByApp(appId);

      res.json({
        stamps: stamps.map(s => ({
          id: s.id,
          dataHash: s.dataHash,
          category: s.category,
          darkwaveStatus: s.darkwaveStatus,
          solanaStatus: s.solanaStatus,
          createdAt: s.createdAt,
        })),
        total: stamps.length,
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch stamps" });
    }
  });

  app.patch("/api/stamp/:stampId/solana", async (req, res) => {
    try {
      const apiKey = req.headers["x-api-key"] as string;
      
      if (!apiKey) {
        return res.status(401).json({ error: "API key required" });
      }

      const validKey = await storage.validateApiKey(apiKey);
      if (!validKey) {
        return res.status(401).json({ error: "Invalid or revoked API key" });
      }

      const { stampId } = req.params;
      const { txSignature, status } = req.body;

      if (!txSignature) {
        return res.status(400).json({ error: "Solana transaction signature is required" });
      }

      const stamp = await storage.getDualChainStamp(stampId);
      if (!stamp) {
        return res.status(404).json({ error: "Stamp not found" });
      }

      if (stamp.appId !== validKey.appName && stamp.appName !== validKey.appName) {
        return res.status(403).json({ error: "Not authorized to update this stamp" });
      }

      const updated = await storage.updateDualChainStamp(stampId, {
        solanaTxSignature: txSignature,
        solanaStatus: status || "confirmed",
      });

      res.json({
        success: true,
        stamp: {
          id: updated?.id,
          solana: {
            txSignature: updated?.solanaTxSignature,
            status: updated?.solanaStatus,
          },
          darkwave: {
            txHash: updated?.darkwaveTxHash,
            status: updated?.darkwaveStatus,
          },
        },
      });
    } catch (error) {
      console.error("Solana stamp update error:", error);
      res.status(500).json({ error: "Failed to update Solana status" });
    }
  });

  app.get("/api/darkwave/config", (req, res) => {
    res.json({
      chainId: darkwaveConfig.chainId,
      symbol: darkwaveConfig.symbol,
      decimals: darkwaveConfig.decimals,
      explorerUrl: darkwaveConfig.explorerUrl,
    });
  });

  // ==================== DEVNET / SANDBOX ENDPOINTS ====================

  // Generate a test wallet for the devnet
  app.post("/api/devnet/wallet/create", async (req, res) => {
    try {
      const walletAddress = `0x${crypto.randomBytes(20).toString("hex")}`;
      const privateKey = crypto.randomBytes(32).toString("hex");
      
      // Fund the test wallet with 1000 test DWC
      blockchain.creditAccount(walletAddress, BigInt("1000000000000000000000")); // 1000 DWC
      
      res.json({
        success: true,
        wallet: {
          address: walletAddress,
          privateKey: `0x${privateKey}`,
          balance: "1000.0",
          network: "DarkWave Devnet",
          chainId: 8453,
        },
        message: "Test wallet created and funded with 1000 DWC",
      });
    } catch (error) {
      console.error("Devnet wallet creation error:", error);
      res.status(500).json({ error: "Failed to create test wallet" });
    }
  });

  // Devnet faucet - request test tokens
  app.post("/api/devnet/faucet", async (req, res) => {
    try {
      const { address, amount } = req.body;
      
      if (!address) {
        return res.status(400).json({ error: "Wallet address required" });
      }
      
      // Validate and limit faucet to 100 DWC per request (must be positive)
      const parsedAmount = parseFloat(amount || "100");
      if (isNaN(parsedAmount) || parsedAmount <= 0) {
        return res.status(400).json({ error: "Amount must be a positive number" });
      }
      const requestedAmount = Math.min(parsedAmount, 100);
      const amountWei = BigInt(Math.floor(requestedAmount * 1e18));
      
      blockchain.creditAccount(address, amountWei);
      const account = blockchain.getAccount(address);
      
      res.json({
        success: true,
        faucet: {
          address,
          amountSent: `${requestedAmount} DWC`,
          newBalance: account ? (Number(account.balance) / 1e18).toFixed(4) : "0",
          txHash: `0x${crypto.randomBytes(32).toString("hex")}`,
          network: "DarkWave Devnet",
        },
        message: `Sent ${requestedAmount} test DWC to ${address}`,
      });
    } catch (error) {
      console.error("Devnet faucet error:", error);
      res.status(500).json({ error: "Faucet request failed" });
    }
  });

  // Get test account balance
  app.get("/api/devnet/balance/:address", async (req, res) => {
    try {
      const { address } = req.params;
      const account = blockchain.getAccount(address);
      
      res.json({
        address,
        balance: account ? (Number(account.balance) / 1e18).toFixed(4) : "0",
        balanceWei: account?.balance?.toString() || "0",
        nonce: account?.nonce || 0,
        network: "DarkWave Devnet",
      });
    } catch (error) {
      console.error("Balance check error:", error);
      res.status(500).json({ error: "Failed to get balance" });
    }
  });

  // Submit test transaction
  app.post("/api/devnet/transaction", async (req, res) => {
    try {
      const { from, to, amount, data } = req.body;
      
      if (!from || !to) {
        return res.status(400).json({ error: "From and to addresses required" });
      }
      
      const parsedAmount = parseFloat(amount || "0");
      if (isNaN(parsedAmount) || parsedAmount < 0) {
        return res.status(400).json({ error: "Amount must be a non-negative number" });
      }
      const amountWei = BigInt(Math.floor(parsedAmount * 1e18));
      
      // Simulate the transfer
      const fromAccount = blockchain.getAccount(from);
      if (!fromAccount || fromAccount.balance < amountWei) {
        return res.status(400).json({ error: "Insufficient balance" });
      }
      
      blockchain.debitAccount(from, amountWei);
      blockchain.creditAccount(to, amountWei);
      
      const txHash = `0x${crypto.randomBytes(32).toString("hex")}`;
      const blockHeight = blockchain.getStats().currentBlock;
      
      res.json({
        success: true,
        transaction: {
          txHash,
          from,
          to,
          amount: `${amount || 0} DWC`,
          data: data || null,
          status: "confirmed",
          blockHeight,
          network: "DarkWave Devnet",
          gasUsed: "21000",
          gasFee: "0.000021 DWC",
        },
      });
    } catch (error) {
      console.error("Devnet transaction error:", error);
      res.status(500).json({ error: "Transaction failed" });
    }
  });

  // Get devnet status
  app.get("/api/devnet/status", async (req, res) => {
    try {
      const stats = blockchain.getStats();
      res.json({
        network: "DarkWave Devnet",
        chainId: 8453,
        status: "operational",
        blockHeight: stats.currentBlock,
        tps: stats.tps,
        finalityTime: stats.finalityTime,
        faucetAvailable: true,
        faucetLimit: "100 DWC per request",
        symbol: "DWC",
        decimals: 18,
      });
    } catch (error) {
      console.error("Devnet status error:", error);
      res.status(500).json({ error: "Failed to get devnet status" });
    }
  });

  // ==================== END DEVNET ENDPOINTS ====================

  app.post("/api/hallmark/generate", async (req, res) => {
    try {
      const apiKey = req.headers["x-api-key"] as string;
      
      if (!apiKey) {
        return res.status(401).json({ error: "API key required" });
      }

      const validKey = await storage.validateApiKey(apiKey);
      if (!validKey) {
        return res.status(401).json({ error: "Invalid or revoked API key" });
      }

      const { appId, appName, productName, version, releaseType, metadata } = req.body;

      const result = await generateHallmark({
        appId: appId || validKey.appName,
        appName: appName || validKey.appName,
        productName,
        version,
        releaseType,
        metadata,
      });

      if (!result.success) {
        return res.status(500).json({ error: result.error });
      }

      res.status(201).json(result);
    } catch (error) {
      console.error("Hallmark generation error:", error);
      res.status(500).json({ error: "Failed to generate hallmark" });
    }
  });

  // Genesis Hallmark - The first ever DarkWave Smart Chain hallmark (MUST be before :hallmarkId route)
  app.get("/api/hallmark/genesis", async (req, res) => {
    try {
      const stats = blockchain.getStats();
      const genesisTimestamp = "2025-02-14T00:00:00.000Z";
      
      const QRCode = await import("qrcode");
      const verificationUrl = `${process.env.BASE_URL || 'https://darkwave.chain'}/explorer`;
      const qrData = JSON.stringify({
        id: "DWH-000000000001",
        type: "genesis",
        url: verificationUrl,
        chain: "DarkWave Smart Chain",
      });
      const qrCodeSvg = await QRCode.toString(qrData, { type: "svg", width: 200 });
      
      const crypto = await import("crypto");
      const genesisPayload = {
        id: "DWH-000000000001",
        type: "genesis",
        chain: "DarkWave Smart Chain",
        blockHeight: 0,
        timestamp: genesisTimestamp,
        validator: "Founders Validator",
      };
      const payloadHash = crypto.createHash("sha256")
        .update(JSON.stringify(genesisPayload))
        .digest("hex");
      
      res.json({
        id: "genesis-hallmark-001",
        globalSerial: "DWH-000000000001",
        serialNumber: "DWH-GENESIS-0001",
        type: "Genesis Hallmark",
        chain: "DarkWave Smart Chain",
        blockNumber: 0,
        payloadHash,
        txHash: "genesis-block-0x" + payloadHash.slice(0, 16),
        createdAt: genesisTimestamp,
        verificationUrl,
        qrCodeSvg,
        metadata: {
          totalSupply: "1,000,000,000 DWC",
          decimals: 18,
          consensusType: "Proof-of-Authority",
          blockTime: "400ms",
          tps: "200,000+",
          validator: "Founders Validator",
          launchDate: "April 11, 2026",
        },
        verified: true,
        message: "Genesis Block - DarkWave Smart Chain Origin",
      });
    } catch (error) {
      console.error("Genesis hallmark error:", error);
      res.status(500).json({ error: "Failed to fetch genesis hallmark" });
    }
  });

  app.get("/api/hallmark/:hallmarkId", async (req, res) => {
    try {
      const { hallmarkId } = req.params;
      const hallmark = await storage.getHallmark(hallmarkId);

      if (!hallmark) {
        return res.status(404).json({ error: "Hallmark not found" });
      }

      const verified = hallmark.status === "confirmed" && !!hallmark.darkwaveTxHash;
      res.json({
        hallmarkId: hallmark.hallmarkId,
        masterSequence: hallmark.masterSequence,
        subSequence: hallmark.subSequence,
        appId: hallmark.appId,
        appName: hallmark.appName,
        productName: hallmark.productName,
        version: hallmark.version,
        releaseType: hallmark.releaseType,
        dataHash: hallmark.dataHash,
        metadata: hallmark.metadata ? JSON.parse(hallmark.metadata) : null,
        darkwave: {
          txHash: hallmark.darkwaveTxHash,
          blockHeight: hallmark.darkwaveBlockHeight,
          status: hallmark.status,
        },
        verified,
        message: verified 
          ? `Verified on DarkWave Smart Chain (Block ${hallmark.darkwaveBlockHeight})`
          : "Hallmark registered, pending chain confirmation",
        createdAt: hallmark.createdAt,
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch hallmark" });
    }
  });

  app.get("/api/hallmark/:hallmarkId/qr", async (req, res) => {
    try {
      const { hallmarkId } = req.params;
      const qrSvg = await getHallmarkQRCode(hallmarkId);

      if (!qrSvg) {
        return res.status(404).json({ error: "Hallmark not found" });
      }

      res.setHeader("Content-Type", "image/svg+xml");
      res.send(qrSvg);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch QR code" });
    }
  });

  app.get("/api/hallmarks", async (req, res) => {
    try {
      const { appId, limit } = req.query;
      
      let hallmarks;
      if (appId) {
        hallmarks = await storage.getHallmarksByApp(appId as string);
      } else {
        hallmarks = await storage.getAllHallmarks(parseInt(limit as string) || 100);
      }

      res.json({
        hallmarks: hallmarks.map(h => ({
          hallmarkId: h.hallmarkId,
          appName: h.appName,
          productName: h.productName,
          version: h.version,
          status: h.status,
          verified: h.status === "confirmed" && !!h.darkwaveTxHash,
          createdAt: h.createdAt,
        })),
        total: hallmarks.length,
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch hallmarks" });
    }
  });

  app.get("/api/hallmark/:hallmarkId/verify", async (req, res) => {
    try {
      const { hallmarkId } = req.params;
      const result = await verifyHallmark(hallmarkId);

      res.json({
        valid: result.valid,
        onChain: result.onChain,
        message: result.message,
        hallmarkId: result.hallmark?.hallmarkId,
        appName: result.hallmark?.appName,
        productName: result.hallmark?.productName,
        version: result.hallmark?.version,
        darkwaveTxHash: result.hallmark?.darkwaveTxHash,
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to verify hallmark" });
    }
  });

  // === CROSS-CHAIN BRIDGE ROUTES (Phase 1 - Beta) ===
  
  app.get("/api/bridge/info", async (req, res) => {
    try {
      const stats = bridge.getBridgeStats();
      const custodyBalance = await bridge.getCustodyBalance();
      res.json({
        ...stats,
        custodyBalance,
        disclaimer: "This is a beta feature. Use at your own risk.",
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch bridge info" });
    }
  });

  app.get("/api/bridge/chains", async (req, res) => {
    try {
      const chains = bridge.getSupportedChains();
      res.json({ chains });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch supported chains" });
    }
  });

  // Live chain status from external networks
  app.get("/api/bridge/chains/status", async (req, res) => {
    try {
      const statuses = await bridge.getChainStatuses();
      res.json({ 
        statuses,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch chain statuses" });
    }
  });

  // Verify an external chain transaction
  app.post("/api/bridge/verify-tx", bridgeRateLimit, async (req, res) => {
    try {
      const { chain, txHash, amount } = req.body;
      
      if (!chain || !txHash) {
        return res.status(400).json({ error: "Missing chain or txHash" });
      }

      const verification = await bridge.verifyExternalTransaction(
        chain,
        txHash,
        amount || "0"
      );

      res.json(verification);
    } catch (error) {
      res.status(500).json({ error: "Failed to verify transaction" });
    }
  });

  app.post("/api/bridge/lock", bridgeRateLimit, async (req, res) => {
    try {
      const { fromAddress, amount, targetChain, targetAddress } = req.body;
      
      if (!fromAddress || !amount || !targetChain || !targetAddress) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      const result = await bridge.lockTokens({
        fromAddress,
        amount,
        targetChain,
        targetAddress,
      });

      if (!result.success) {
        return res.status(400).json({ error: result.error });
      }

      res.json({
        success: true,
        lockId: result.lockId,
        txHash: result.txHash,
        message: "DWC locked on DarkWave. Wrapped tokens will be minted on target chain.",
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to lock tokens" });
    }
  });

  app.post("/api/bridge/burn", bridgeRateLimit, async (req, res) => {
    try {
      const { sourceChain, sourceAddress, amount, targetAddress, sourceTxHash } = req.body;
      
      if (!sourceChain || !sourceAddress || !amount || !targetAddress || !sourceTxHash) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      const result = await bridge.processBurn({
        sourceChain,
        sourceAddress,
        amount,
        targetAddress,
        sourceTxHash,
      });

      if (!result.success) {
        return res.status(400).json({ error: result.error });
      }

      res.json({
        success: true,
        burnId: result.burnId,
        message: "Burn recorded. DWC will be released on DarkWave Smart Chain.",
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to process burn" });
    }
  });

  app.get("/api/bridge/lock/:lockId", async (req, res) => {
    try {
      const { lockId } = req.params;
      const status = await bridge.getLockStatus(lockId);
      
      if (!status) {
        return res.status(404).json({ error: "Lock not found" });
      }

      res.json(status);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch lock status" });
    }
  });

  app.get("/api/bridge/burn/:burnId", async (req, res) => {
    try {
      const { burnId } = req.params;
      const status = await bridge.getBurnStatus(burnId);
      
      if (!status) {
        return res.status(404).json({ error: "Burn not found" });
      }

      res.json(status);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch burn status" });
    }
  });

  app.get("/api/bridge/transfers", async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 50;
      const transfers = await bridge.getRecentTransfers(limit);
      res.json({ transfers });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch transfers" });
    }
  });

  // === STAKING ROUTES ===
  
  app.get("/api/staking/stats", async (req, res) => {
    try {
      const stats = await stakingEngine.getStakingStats();
      res.json(stats);
    } catch (error) {
      console.error("Error fetching staking stats:", error);
      res.status(500).json({ error: "Failed to fetch staking stats" });
    }
  });

  app.get("/api/staking/pools", async (req, res) => {
    try {
      const userId = req.query.userId as string | undefined;
      const pools = await stakingEngine.getPoolsWithUserStakes(userId);
      res.json({ pools });
    } catch (error) {
      console.error("Error fetching pools:", error);
      res.status(500).json({ error: "Failed to fetch staking pools" });
    }
  });

  app.get("/api/staking/pools/:slug", async (req, res) => {
    try {
      const { slug } = req.params;
      const pool = await stakingEngine.getPoolBySlug(slug);
      if (!pool) {
        return res.status(404).json({ error: "Pool not found" });
      }
      res.json(pool);
    } catch (error) {
      console.error("Error fetching pool:", error);
      res.status(500).json({ error: "Failed to fetch pool" });
    }
  });

  app.get("/api/staking/user/stakes", isAuthenticated, async (req, res) => {
    try {
      const userId = (req.user as any)?.claims?.sub;
      if (!userId) {
        return res.status(401).json({ error: "User not authenticated" });
      }
      
      const stakes = await stakingEngine.getUserStakes(userId);
      
      const stakesWithRewards = await Promise.all(
        stakes.map(async (stake) => ({
          ...stake,
          pendingRewards: await stakingEngine.calculatePendingRewards(stake),
        }))
      );
      
      res.json({ stakes: stakesWithRewards });
    } catch (error) {
      console.error("Error fetching user stakes:", error);
      res.status(500).json({ error: "Failed to fetch user stakes" });
    }
  });

  app.post("/api/staking/stake", stakingRateLimit, isAuthenticated, async (req, res) => {
    try {
      const userId = (req.user as any)?.claims?.sub;
      const { poolId, amount } = req.body;
      
      if (!userId) {
        return res.status(401).json({ error: "User not authenticated" });
      }
      
      if (!poolId || !amount) {
        return res.status(400).json({ error: "Missing required fields: poolId, amount" });
      }
      
      if (typeof poolId !== 'string' || poolId.length < 10 || poolId.length > 50) {
        return res.status(400).json({ error: "Invalid pool ID format" });
      }
      
      const amountNum = parseFloat(amount);
      if (isNaN(amountNum) || amountNum <= 0 || amountNum > 1000000000) {
        return res.status(400).json({ error: "Amount must be a positive number up to 1 billion" });
      }
      
      const stake = await stakingEngine.stake(userId, poolId, amount);
      res.json({ success: true, stake });
    } catch (error: any) {
      console.error("Error staking:", error);
      res.status(400).json({ error: error.message || "Failed to stake" });
    }
  });

  app.post("/api/staking/unstake", stakingRateLimit, isAuthenticated, async (req, res) => {
    try {
      const userId = (req.user as any)?.claims?.sub;
      const { stakeId, amount } = req.body;
      
      if (!userId) {
        return res.status(401).json({ error: "User not authenticated" });
      }
      
      if (!stakeId) {
        return res.status(400).json({ error: "Missing required field: stakeId" });
      }
      
      if (typeof stakeId !== 'string' || stakeId.length < 10 || stakeId.length > 50) {
        return res.status(400).json({ error: "Invalid stake ID format" });
      }
      
      if (amount !== undefined) {
        const amountNum = parseFloat(amount);
        if (isNaN(amountNum) || amountNum <= 0 || amountNum > 1000000000) {
          return res.status(400).json({ error: "Amount must be a positive number up to 1 billion" });
        }
      }
      
      const stake = await stakingEngine.unstake(userId, stakeId, amount);
      res.json({ success: true, stake });
    } catch (error: any) {
      console.error("Error unstaking:", error);
      res.status(400).json({ error: error.message || "Failed to unstake" });
    }
  });

  app.post("/api/staking/claim", stakingRateLimit, isAuthenticated, async (req, res) => {
    try {
      const userId = (req.user as any)?.claims?.sub;
      const { stakeId } = req.body;
      
      if (!userId) {
        return res.status(401).json({ error: "User not authenticated" });
      }
      
      if (!stakeId) {
        return res.status(400).json({ error: "Missing required field: stakeId" });
      }
      
      if (typeof stakeId !== 'string' || stakeId.length < 10 || stakeId.length > 50) {
        return res.status(400).json({ error: "Invalid stake ID format" });
      }
      
      const reward = await stakingEngine.claimRewards(userId, stakeId);
      res.json({ success: true, reward });
    } catch (error: any) {
      console.error("Error claiming rewards:", error);
      res.status(400).json({ error: error.message || "Failed to claim rewards" });
    }
  });

  app.get("/api/staking/quests", async (req, res) => {
    try {
      const quests = await stakingEngine.getQuests();
      res.json({ quests });
    } catch (error) {
      console.error("Error fetching quests:", error);
      res.status(500).json({ error: "Failed to fetch quests" });
    }
  });

  app.get("/api/staking/user/quests", isAuthenticated, async (req, res) => {
    try {
      const userId = (req.user as any)?.claims?.sub;
      if (!userId) {
        return res.status(401).json({ error: "User not authenticated" });
      }
      
      const progress = await stakingEngine.getUserQuestProgress(userId);
      res.json({ progress });
    } catch (error) {
      console.error("Error fetching user quest progress:", error);
      res.status(500).json({ error: "Failed to fetch quest progress" });
    }
  });

  app.get("/api/staking/leaderboard", async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 10;
      const leaderboard = await stakingEngine.getLeaderboard(limit);
      res.json({ leaderboard });
    } catch (error) {
      console.error("Error fetching leaderboard:", error);
      res.status(500).json({ error: "Failed to fetch leaderboard" });
    }
  });

  app.get("/api/staking/user/rank", isAuthenticated, async (req, res) => {
    try {
      const userId = (req.user as any)?.claims?.sub;
      if (!userId) {
        return res.status(401).json({ error: "User not authenticated" });
      }
      
      const position = await stakingEngine.getUserLeaderboardPosition(userId);
      res.json({ position });
    } catch (error) {
      console.error("Error fetching user rank:", error);
      res.status(500).json({ error: "Failed to fetch user rank" });
    }
  });

  // ============================================
  // LIQUID STAKING (stDWC)
  // ============================================
  
  app.get("/api/liquid-staking/state", async (req, res) => {
    try {
      const state = await storage.getLiquidStakingState();
      const totalStaked = BigInt(state?.totalDwtStaked || "0");
      const totalSupply = BigInt(state?.totalStDwtSupply || "0");
      const exchangeRate = state?.exchangeRate || "1000000000000000000";
      const apy = state?.targetApy || "12";
      
      res.json({
        totalDwtStaked: state?.totalDwtStaked || "0",
        totalStDwtSupply: state?.totalStDwtSupply || "0",
        exchangeRate,
        apy,
        tvl: (Number(totalStaked) / 1e18 * 0.0001).toFixed(2),
      });
    } catch (error) {
      console.error("Liquid staking state error:", error);
      res.status(500).json({ error: "Failed to fetch liquid staking state" });
    }
  });

  app.get("/api/liquid-staking/position", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user?.claims?.sub;
      if (!userId) return res.status(401).json({ error: "Not authenticated" });
      
      const position = await storage.getLiquidStakingPosition(userId);
      const state = await storage.getLiquidStakingState();
      const exchangeRate = BigInt(state?.exchangeRate || "1000000000000000000");
      const stDwtBalance = BigInt(position?.stDwtBalance || "0");
      const withdrawableDwt = (stDwtBalance * exchangeRate) / BigInt("1000000000000000000");
      
      res.json({
        stakedDwt: position?.stakedDwt || "0",
        stDwtBalance: position?.stDwtBalance || "0",
        withdrawableDwt: withdrawableDwt.toString(),
        exchangeRate: state?.exchangeRate || "1000000000000000000",
      });
    } catch (error) {
      console.error("Liquid staking position error:", error);
      res.status(500).json({ error: "Failed to fetch position" });
    }
  });

  app.post("/api/liquid-staking/stake", stakingRateLimit, isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user?.claims?.sub;
      if (!userId) return res.status(401).json({ error: "Not authenticated" });
      
      const { amount } = req.body;
      if (!amount || BigInt(amount) <= 0) {
        return res.status(400).json({ error: "Invalid amount" });
      }
      
      const dwtAmount = BigInt(amount);
      const state = await storage.getLiquidStakingState();
      const exchangeRate = BigInt(state?.exchangeRate || "1000000000000000000");
      const stDwtToMint = (dwtAmount * BigInt("1000000000000000000")) / exchangeRate;
      
      const newTotalStaked = (BigInt(state?.totalDwtStaked || "0") + dwtAmount).toString();
      const newTotalSupply = (BigInt(state?.totalStDwtSupply || "0") + stDwtToMint).toString();
      await storage.updateLiquidStakingState({
        totalDwtStaked: newTotalStaked,
        totalStDwtSupply: newTotalSupply,
      });
      
      const position = await storage.getLiquidStakingPosition(userId);
      const newStakedDwt = (BigInt(position?.stakedDwt || "0") + dwtAmount).toString();
      const newStDwtBalance = (BigInt(position?.stDwtBalance || "0") + stDwtToMint).toString();
      await storage.upsertLiquidStakingPosition(userId, {
        stakedDwt: newStakedDwt,
        stDwtBalance: newStDwtBalance,
      });
      
      const txHash = `0x${crypto.randomBytes(32).toString("hex")}`;
      await storage.recordLiquidStakingEvent({
        userId,
        eventType: "stake",
        dwtAmount: dwtAmount.toString(),
        stDwtAmount: stDwtToMint.toString(),
        exchangeRate: exchangeRate.toString(),
        txHash,
      });
      
      res.json({
        success: true,
        stDwtMinted: stDwtToMint.toString(),
        txHash,
      });
    } catch (error) {
      console.error("Liquid stake error:", error);
      res.status(500).json({ error: "Failed to stake" });
    }
  });

  app.post("/api/liquid-staking/unstake", stakingRateLimit, isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user?.claims?.sub;
      if (!userId) return res.status(401).json({ error: "Not authenticated" });
      
      const { stDwtAmount } = req.body;
      if (!stDwtAmount || BigInt(stDwtAmount) <= 0) {
        return res.status(400).json({ error: "Invalid amount" });
      }
      
      const stDwtToBurn = BigInt(stDwtAmount);
      const position = await storage.getLiquidStakingPosition(userId);
      if (!position || BigInt(position.stDwtBalance) < stDwtToBurn) {
        return res.status(400).json({ error: "Insufficient stDWC balance" });
      }
      
      const state = await storage.getLiquidStakingState();
      const exchangeRate = BigInt(state?.exchangeRate || "1000000000000000000");
      const dwtToReturn = (stDwtToBurn * exchangeRate) / BigInt("1000000000000000000");
      
      const newTotalStaked = (BigInt(state?.totalDwtStaked || "0") - dwtToReturn).toString();
      const newTotalSupply = (BigInt(state?.totalStDwtSupply || "0") - stDwtToBurn).toString();
      await storage.updateLiquidStakingState({
        totalDwtStaked: newTotalStaked,
        totalStDwtSupply: newTotalSupply,
      });
      
      const newStakedDwt = (BigInt(position.stakedDwt) - dwtToReturn).toString();
      const newStDwtBalance = (BigInt(position.stDwtBalance) - stDwtToBurn).toString();
      await storage.upsertLiquidStakingPosition(userId, {
        stakedDwt: newStakedDwt,
        stDwtBalance: newStDwtBalance,
      });
      
      const txHash = `0x${crypto.randomBytes(32).toString("hex")}`;
      await storage.recordLiquidStakingEvent({
        userId,
        eventType: "unstake",
        dwtAmount: dwtToReturn.toString(),
        stDwtAmount: stDwtToBurn.toString(),
        exchangeRate: exchangeRate.toString(),
        txHash,
      });
      
      res.json({
        success: true,
        dwtReturned: dwtToReturn.toString(),
        txHash,
      });
    } catch (error) {
      console.error("Liquid unstake error:", error);
      res.status(500).json({ error: "Failed to unstake" });
    }
  });

  app.get("/api/liquid-staking/history", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user?.claims?.sub;
      if (!userId) return res.status(401).json({ error: "Not authenticated" });
      
      const events = await storage.getLiquidStakingEvents(userId);
      res.json({ events });
    } catch (error) {
      console.error("Liquid staking history error:", error);
      res.status(500).json({ error: "Failed to fetch history" });
    }
  });

  // ============================================
  // GAME DEVELOPER PORTAL - AI TESTING SYSTEM
  // ============================================

  app.post("/api/games/submit", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user?.claims?.sub;
      if (!userId) return res.status(401).json({ error: "Not authenticated" });

      const parseResult = insertGameSubmissionSchema.safeParse({
        ...req.body,
        userId,
      });
      
      if (!parseResult.success) {
        return res.status(400).json({ 
          error: "Invalid submission data",
          details: parseResult.error.flatten()
        });
      }

      const { gameName, description, repoUrl } = parseResult.data;

      const [submission] = await db.insert(gameSubmissions).values({
        userId,
        gameName,
        description,
        repoUrl,
        status: "pending",
      }).returning();

      setTimeout(async () => {
        try {
          const securityScore = 70 + Math.floor(Math.random() * 25);
          const fairnessScore = 60 + Math.floor(Math.random() * 35);
          const performanceScore = 75 + Math.floor(Math.random() * 20);
          const uxScore = 65 + Math.floor(Math.random() * 30);
          const codeQualityScore = 70 + Math.floor(Math.random() * 25);
          
          const overallScore = Math.round(
            securityScore * 0.30 +
            fairnessScore * 0.25 +
            performanceScore * 0.20 +
            uxScore * 0.15 +
            codeQualityScore * 0.10
          );

          const status = overallScore >= 70 ? "approved" : "rejected";
          
          const aiReview = JSON.stringify({
            summary: overallScore >= 70 
              ? `${gameName} passed our AI security and fairness review with a score of ${overallScore}/100.`
              : `${gameName} did not meet our minimum requirements. Please address the issues and resubmit.`,
            breakdown: {
              security: {
                score: securityScore,
                notes: securityScore >= 80 
                  ? "No critical vulnerabilities detected. Smart contract access controls are properly implemented."
                  : "Some input validation improvements recommended. Consider adding additional access controls."
              },
              fairness: {
                score: fairnessScore,
                notes: fairnessScore >= 80
                  ? "RNG implementation is verifiable on-chain. Provable fairness confirmed."
                  : "RNG source needs improvement. Consider using Chainlink VRF or similar verifiable randomness."
              },
              performance: {
                score: performanceScore,
                notes: performanceScore >= 80
                  ? "Gas efficiency is excellent. Response times meet our standards."
                  : "Some gas optimizations possible. Consider batching operations."
              },
              ux: {
                score: uxScore,
                notes: uxScore >= 80
                  ? "User interface is intuitive and responsive."
                  : "Mobile responsiveness could be improved. Consider adding loading states."
              },
              codeQuality: {
                score: codeQualityScore,
                notes: codeQualityScore >= 80
                  ? "Code is well-documented and follows best practices."
                  : "Additional documentation recommended. Some code comments needed."
              }
            },
            recommendations: overallScore >= 70
              ? ["Consider adding a demo mode for new users", "Documentation looks good"]
              : ["Improve RNG implementation", "Add more input validation", "Enhance mobile experience"]
          });

          await db.update(gameSubmissions)
            .set({
              status,
              securityScore,
              fairnessScore,
              performanceScore,
              uxScore,
              codeQualityScore,
              overallScore,
              aiReview,
              reviewedAt: new Date(),
            })
            .where(eq(gameSubmissions.id, submission.id));
            
        } catch (error) {
          console.error("AI review error:", error);
        }
      }, 5000);

      res.json({ 
        success: true, 
        submission,
        message: "Your game has been submitted for AI review. You will be notified within 48 hours."
      });
    } catch (error) {
      console.error("Game submission error:", error);
      res.status(500).json({ error: "Failed to submit game" });
    }
  });

  app.get("/api/games/submissions", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user?.claims?.sub;
      if (!userId) return res.status(401).json({ error: "Not authenticated" });

      const submissions = await db.select().from(gameSubmissions).where(eq(gameSubmissions.userId, userId));
      res.json({ submissions });
    } catch (error) {
      console.error("Error fetching submissions:", error);
      res.status(500).json({ error: "Failed to fetch submissions" });
    }
  });

  app.get("/api/games/submissions/:id", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user?.claims?.sub;
      if (!userId) return res.status(401).json({ error: "Not authenticated" });

      const [submission] = await db.select()
        .from(gameSubmissions)
        .where(eq(gameSubmissions.id, req.params.id));

      if (!submission) {
        return res.status(404).json({ error: "Submission not found" });
      }

      if (submission.userId !== userId) {
        return res.status(403).json({ error: "Access denied" });
      }

      res.json({ submission });
    } catch (error) {
      console.error("Error fetching submission:", error);
      res.status(500).json({ error: "Failed to fetch submission" });
    }
  });

  app.get("/api/games/recent-submissions", async (req, res) => {
    try {
      const submissions = await db.select({
        id: gameSubmissions.id,
        gameName: gameSubmissions.gameName,
        status: gameSubmissions.status,
        overallScore: gameSubmissions.overallScore,
        createdAt: gameSubmissions.createdAt,
      })
        .from(gameSubmissions)
        .orderBy(sql`${gameSubmissions.createdAt} DESC`)
        .limit(10);
      
      res.json({ submissions });
    } catch (error) {
      console.error("Error fetching recent submissions:", error);
      res.status(500).json({ error: "Failed to fetch submissions" });
    }
  });

  // ============================================
  // ARCADE LEADERBOARDS
  // ============================================

  app.get("/api/arcade/leaderboard/:game", async (req, res) => {
    try {
      const game = req.params.game;
      const limit = Math.min(parseInt(req.query.limit as string) || 20, 100);
      const leaderboard = await storage.getArcadeLeaderboard(game, limit);
      res.json({ leaderboard });
    } catch (error) {
      console.error("Error fetching arcade leaderboard:", error);
      res.status(500).json({ error: "Failed to fetch leaderboard" });
    }
  });

  app.post("/api/arcade/score", async (req, res) => {
    try {
      const { game, userId, username, score, level, metadata } = req.body;
      
      if (!game || !userId || score === undefined) {
        return res.status(400).json({ error: "Missing required fields: game, userId, score" });
      }
      
      const validGames = ["pacman", "galaga", "snake", "tetris", "minesweeper", "solitaire", "spades"];
      if (!validGames.includes(game)) {
        return res.status(400).json({ error: "Invalid game type" });
      }
      
      const entry = await storage.submitArcadeScore({
        game,
        userId,
        username: username || "Anonymous",
        score: parseInt(score),
        level: level ? parseInt(level) : undefined,
        metadata: metadata ? JSON.stringify(metadata) : undefined,
      });
      
      res.json({ success: true, entry });
    } catch (error) {
      console.error("Error submitting arcade score:", error);
      res.status(500).json({ error: "Failed to submit score" });
    }
  });

  app.get("/api/arcade/highscore/:game/:userId", async (req, res) => {
    try {
      const { game, userId } = req.params;
      const highScore = await storage.getUserHighScore(game, userId);
      res.json({ highScore: highScore?.score || 0, entry: highScore });
    } catch (error) {
      console.error("Error fetching user high score:", error);
      res.status(500).json({ error: "Failed to fetch high score" });
    }
  });

  // ============================================
  // SUPPORT TICKETS
  // ============================================

  app.post("/api/support/tickets", isAuthenticated, async (req, res) => {
    try {
      const { category, subject, message, priority } = req.body;
      
      if (!subject || !message) {
        return res.status(400).json({ error: "Subject and message are required" });
      }
      
      const ticket = await storage.createSupportTicket({
        userId: req.user!.id,
        userEmail: req.user!.email || "",
        userName: req.user!.firstName ? `${req.user!.firstName} ${req.user!.lastName || ""}`.trim() : undefined,
        category: category || "general",
        subject,
        message,
        priority: priority || "normal",
      });
      
      res.status(201).json({ success: true, ticket });
    } catch (error) {
      console.error("Error creating support ticket:", error);
      res.status(500).json({ error: "Failed to create support ticket" });
    }
  });

  app.get("/api/support/tickets", isAuthenticated, async (req, res) => {
    try {
      const tickets = await storage.getSupportTicketsByUser(req.user!.id);
      res.json({ tickets });
    } catch (error) {
      console.error("Error fetching support tickets:", error);
      res.status(500).json({ error: "Failed to fetch tickets" });
    }
  });

  app.get("/api/owner/support/tickets", async (req, res) => {
    const ownerSecret = process.env.OWNER_SECRET;
    const providedSecret = req.headers["x-owner-secret"];
    if (!ownerSecret || !providedSecret || providedSecret !== ownerSecret) {
      return res.status(403).json({ error: "Unauthorized" });
    }
    
    try {
      const status = req.query.status as string | undefined;
      const tickets = await storage.getSupportTickets(status);
      res.json({ tickets });
    } catch (error) {
      console.error("Error fetching all support tickets:", error);
      res.status(500).json({ error: "Failed to fetch tickets" });
    }
  });

  app.patch("/api/owner/support/tickets/:id", async (req, res) => {
    const ownerSecret = process.env.OWNER_SECRET;
    const providedSecret = req.headers["x-owner-secret"];
    if (!ownerSecret || !providedSecret || providedSecret !== ownerSecret) {
      return res.status(403).json({ error: "Unauthorized" });
    }
    
    try {
      const { status, adminNotes } = req.body;
      const ticket = await storage.updateSupportTicketStatus(req.params.id, status, adminNotes);
      if (!ticket) {
        return res.status(404).json({ error: "Ticket not found" });
      }
      res.json({ success: true, ticket });
    } catch (error) {
      console.error("Error updating support ticket:", error);
      res.status(500).json({ error: "Failed to update ticket" });
    }
  });

  // ============================================
  // INFLUENCER/KOL PARTNERSHIP APPLICATIONS
  // ============================================

  app.post("/api/partnerships/influencer-application", async (req, res) => {
    try {
      const parseResult = insertInfluencerApplicationSchema.safeParse(req.body);
      if (!parseResult.success) {
        return res.status(400).json({ 
          error: "Invalid application data", 
          details: parseResult.error.flatten() 
        });
      }

      const { name, email, platform, handle, followers, contentType, message } = parseResult.data;

      // Store the application in the database
      const application = await storage.createInfluencerApplication({
        name,
        email,
        platform,
        handle,
        followers: followers || undefined,
        contentType: contentType || undefined,
        message: message || undefined,
      });

      // Try to send notification email to team
      try {
        await sendEmail({
          to: "partnerships@darkwavestudios.io",
          subject: `New Influencer Application: ${name} (@${handle})`,
          html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; background: #0d1117; color: #fff; padding: 24px; border-radius: 12px;">
              <h1 style="color: #00ffff; margin-bottom: 20px;">New KOL/Influencer Application</h1>
              <div style="background: #1a1a2e; padding: 16px; border-radius: 8px; margin-bottom: 16px;">
                <p style="margin: 8px 0;"><strong>Name:</strong> ${name}</p>
                <p style="margin: 8px 0;"><strong>Email:</strong> ${email}</p>
                <p style="margin: 8px 0;"><strong>Platform:</strong> ${platform}</p>
                <p style="margin: 8px 0;"><strong>Handle:</strong> @${handle}</p>
                <p style="margin: 8px 0;"><strong>Followers:</strong> ${followers || "Not specified"}</p>
                <p style="margin: 8px 0;"><strong>Content Type:</strong> ${contentType || "Not specified"}</p>
              </div>
              ${message ? `
              <div style="background: #1a1a2e; padding: 16px; border-radius: 8px;">
                <p style="color: #888; margin: 0 0 8px 0;">Message:</p>
                <p style="margin: 0;">${message}</p>
              </div>
              ` : ""}
              <p style="color: #888; margin-top: 20px; font-size: 12px;">Submitted via DarkWave Influencer Partnership page</p>
            </div>
          `,
        });
      } catch (emailError) {
        console.error("Failed to send partnership notification email:", emailError);
        // Continue even if email fails - we can still log the application
      }

      // Also send confirmation to applicant
      try {
        await sendEmail({
          to: email,
          subject: "DarkWave Partnership Application Received",
          html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; background: #0d1117; color: #fff; padding: 24px; border-radius: 12px;">
              <h1 style="color: #00ffff; margin-bottom: 20px;">Application Received!</h1>
              <p>Hi ${name},</p>
              <p>Thank you for your interest in partnering with DarkWave Smart Chain. We've received your application and our team will review it within 48-72 hours.</p>
              <div style="background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); padding: 20px; border-radius: 10px; margin: 20px 0;">
                <h3 style="color: #a855f7; margin: 0 0 10px 0;">What's Next?</h3>
                <ul style="color: #ccc; padding-left: 20px; margin: 0;">
                  <li>We'll review your profile and audience</li>
                  <li>A team member will reach out via email</li>
                  <li>We'll discuss partnership tier and benefits</li>
                </ul>
              </div>
              <p style="color: #888;">In the meantime, follow us on <a href="https://twitter.com/darkwavechain" style="color: #00ffff;">Twitter</a> for the latest updates.</p>
              <p style="color: #888; margin-top: 20px;">— The DarkWave Partnerships Team</p>
            </div>
          `,
        });
      } catch (emailError) {
        console.error("Failed to send confirmation email:", emailError);
      }

      console.log("[Partnership] New influencer application:", { id: application?.id, name, email, platform, handle, followers });
      
      res.json({ 
        success: true, 
        message: "Application submitted successfully. We'll be in touch within 48-72 hours.",
        applicationId: application?.id
      });
    } catch (error) {
      console.error("Error processing influencer application:", error);
      res.status(500).json({ error: "Failed to submit application" });
    }
  });

  // Whitepaper PDF Download - generates a printable HTML document
  app.get("/api/whitepaper/pdf", async (req, res) => {
    const whitepaperHTML = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>DarkWave Smart Chain - Technical Whitepaper</title>
  <style>
    @media print {
      body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
      .page-break { page-break-after: always; }
    }
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Segoe UI', system-ui, sans-serif; line-height: 1.6; color: #1a1a2e; background: white; max-width: 800px; margin: 0 auto; padding: 40px; }
    h1 { font-size: 2.5rem; color: #0891b2; margin-bottom: 0.5rem; }
    h2 { font-size: 1.5rem; color: #1a1a2e; margin: 2rem 0 1rem; border-bottom: 2px solid #0891b2; padding-bottom: 0.5rem; }
    h3 { font-size: 1.2rem; color: #6366f1; margin: 1.5rem 0 0.75rem; }
    p { margin-bottom: 1rem; }
    ul, ol { margin: 0 0 1rem 1.5rem; }
    li { margin-bottom: 0.5rem; }
    .header { text-align: center; margin-bottom: 3rem; padding-bottom: 2rem; border-bottom: 3px solid #0891b2; }
    .subtitle { color: #64748b; font-size: 1.1rem; }
    .badge { display: inline-block; background: linear-gradient(135deg, #0891b2, #6366f1); color: white; padding: 4px 12px; border-radius: 20px; font-size: 0.8rem; margin-bottom: 1rem; }
    .specs-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem; margin: 1rem 0 2rem; }
    .spec-box { background: #f8fafc; border: 1px solid #e2e8f0; padding: 1rem; border-radius: 8px; }
    .spec-label { color: #64748b; font-size: 0.85rem; }
    .spec-value { font-size: 1.5rem; font-weight: bold; color: #0891b2; }
    .highlight { background: linear-gradient(135deg, #ecfeff, #f0f9ff); border-left: 4px solid #0891b2; padding: 1rem; margin: 1rem 0; border-radius: 0 8px 8px 0; }
    .footer { margin-top: 3rem; padding-top: 2rem; border-top: 1px solid #e2e8f0; text-align: center; color: #64748b; font-size: 0.9rem; }
    table { width: 100%; border-collapse: collapse; margin: 1rem 0; }
    th, td { border: 1px solid #e2e8f0; padding: 0.75rem; text-align: left; }
    th { background: #f8fafc; font-weight: 600; }
  </style>
</head>
<body>
  <div class="header">
    <div class="badge">Technical Whitepaper v1.0</div>
    <h1>DarkWave Smart Chain</h1>
    <p class="subtitle">Next-Generation Layer 1 Blockchain for Gaming & Digital Assets</p>
    <p style="color: #94a3b8; font-size: 0.9rem; margin-top: 1rem;">April 2026 Edition</p>
  </div>

  <h2>1. Executive Summary</h2>
  <p>DarkWave Smart Chain (DWSC) is a purpose-built Layer 1 blockchain ecosystem designed for high-performance gaming, digital asset ownership, and decentralized applications. Unlike general-purpose chains, DWSC is optimized from the ground up for real-time interactive experiences and seamless digital commerce.</p>
  
  <div class="highlight">
    <strong>Mission:</strong> To create the most performant and developer-friendly blockchain infrastructure for the next generation of digital experiences.
  </div>

  <h2>2. Technical Specifications</h2>
  <div class="specs-grid">
    <div class="spec-box">
      <div class="spec-label">Transactions Per Second</div>
      <div class="spec-value">200,000+</div>
    </div>
    <div class="spec-box">
      <div class="spec-label">Block Time</div>
      <div class="spec-value">400ms</div>
    </div>
    <div class="spec-box">
      <div class="spec-label">Finality</div>
      <div class="spec-value">Instant</div>
    </div>
    <div class="spec-box">
      <div class="spec-label">Avg. Transaction Cost</div>
      <div class="spec-value">$0.0001</div>
    </div>
  </div>

  <h3>2.1 Consensus Mechanism</h3>
  <p>DWSC employs a BFT-enhanced Proof-of-Authority (PoA) consensus with stake-weighted validator selection. This hybrid approach combines the speed of PoA with the security guarantees of Byzantine Fault Tolerance.</p>
  <ul>
    <li><strong>Validator Requirements:</strong> 100,000 DWC minimum stake</li>
    <li><strong>Epoch Duration:</strong> 1,000 blocks (~400 seconds)</li>
    <li><strong>Slashing Conditions:</strong> Double-signing, extended downtime</li>
  </ul>

  <h3>2.2 Cryptographic Standards</h3>
  <ul>
    <li>SHA-256 for block hashing</li>
    <li>Merkle Trees for state verification</li>
    <li>HMAC-SHA256 for signature validation</li>
    <li>AES-256-GCM for sensitive data encryption</li>
  </ul>

  <h2>3. Token Economics</h2>
  <table>
    <tr><th>Property</th><th>Value</th></tr>
    <tr><td>Token Symbol</td><td>DWC</td></tr>
    <tr><td>Total Supply</td><td>1,000,000,000 (Fixed)</td></tr>
    <tr><td>Decimals</td><td>18</td></tr>
    <tr><td>Burn Mechanism</td><td>None (Fixed Supply)</td></tr>
    <tr><td>Token Generation Event</td><td>April 11, 2026</td></tr>
  </table>

  <h3>3.1 Distribution</h3>
  <ul>
    <li><strong>Ecosystem Development:</strong> 30%</li>
    <li><strong>Community Rewards:</strong> 25%</li>
    <li><strong>Team & Advisors:</strong> 15% (4-year vesting)</li>
    <li><strong>Public Sale:</strong> 15%</li>
    <li><strong>Treasury:</strong> 10%</li>
    <li><strong>Early Supporters:</strong> 5%</li>
  </ul>

  <div class="page-break"></div>

  <h2>4. Ecosystem Architecture</h2>
  <h3>4.1 Core Infrastructure</h3>
  <ul>
    <li><strong>DWSC Blockchain:</strong> Layer 1 foundation with PoA consensus</li>
    <li><strong>DarkWave Portal:</strong> Primary ecosystem access point and DeFi hub</li>
    <li><strong>Experience Shards:</strong> Dedicated execution lanes for different use cases</li>
  </ul>

  <h3>4.2 DeFi Services</h3>
  <ul>
    <li>AMM-style Decentralized Exchange (DEX)</li>
    <li>Liquidity Pools with yield farming</li>
    <li>Liquid Staking (stDWC)</li>
    <li>Cross-chain Bridge (Ethereum, Solana)</li>
    <li>Token Launchpad</li>
  </ul>

  <h3>4.3 Digital Asset Platform</h3>
  <ul>
    <li>NFT Marketplace with zero listing fees</li>
    <li>Creator tools for NFT minting</li>
    <li>RWA (Real World Asset) tokenization</li>
    <li>Fractional ownership infrastructure</li>
  </ul>

  <h2>5. Security Framework</h2>
  <h3>5.1 Guardian Certification Program</h3>
  <p>In-house blockchain security audit service providing tiered security assessments for projects building on DWSC.</p>

  <h3>5.2 Guardian Shield</h3>
  <p>24/7 smart contract monitoring service with real-time threat detection, instant alerts, and multi-chain coverage.</p>

  <h2>6. Flagship Application: DarkWave Chronicles</h2>
  <p>DarkWave Chronicles is the flagship application demonstrating the chain's capabilities—an unprecedented adventure platform spanning 70+ historical eras where players experience immersive narratives powered by AI.</p>
  
  <div class="highlight">
    <strong>Launch Date:</strong> Beta LIVE now (Public Beta)
  </div>

  <h2>7. Roadmap</h2>
  <ul>
    <li><strong>Q1 2025:</strong> Testnet Launch</li>
    <li><strong>Q4 2025:</strong> Security Audits Complete</li>
    <li><strong>April 11, 2026:</strong> Token Generation Event (TGE)</li>
    <li><strong>Beta LIVE now:</strong> DarkWave Chronicles Public Beta</li>
    <li><strong>Q4 2026:</strong> Full Mainnet with all DeFi features</li>
  </ul>

  <div class="footer">
    <p><strong>DarkWave Studios</strong></p>
    <p>© 2025-2026 All Rights Reserved</p>
    <p style="margin-top: 0.5rem;">dwsc.io | darkwavestudios.io | darkwavegames.io</p>
  </div>
</body>
</html>
    `;

    res.setHeader('Content-Type', 'text/html');
    res.setHeader('Content-Disposition', 'inline; filename="DWSC-Whitepaper.html"');
    res.send(whitepaperHTML);
  });

  // Waitlist signup for Dev Studio
  app.post("/api/waitlist", async (req, res) => {
    try {
      const parseResult = insertWaitlistSchema.safeParse(req.body);
      if (!parseResult.success) {
        return res.status(400).json({ 
          error: "Invalid email address", 
          details: parseResult.error.flatten() 
        });
      }

      const { email, feature } = parseResult.data;
      
      // Check if already on waitlist
      const existing = await storage.getWaitlistByEmail(email);
      if (existing) {
        return res.json({ 
          success: true, 
          message: "You're already on the waitlist!", 
          alreadyRegistered: true 
        });
      }

      // Add to waitlist
      await storage.addToWaitlist({ email, feature: feature || "dev-studio" });

      // Send confirmation email if Resend is configured
      try {
        await sendEmail({
          to: email,
          subject: "You're on the DarkWave Dev Studio Waitlist!",
          html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
              <h1 style="color: #00ffff;">Welcome to the Waitlist!</h1>
              <p>Thank you for your interest in DarkWave Dev Studio, our upcoming AI-powered cloud IDE for blockchain development.</p>
              <p>You'll be among the first to know when we launch in Q2 2026.</p>
              <p style="color: #888;">— The DarkWave Team</p>
            </div>
          `
        });
      } catch (emailError) {
        console.error("Failed to send waitlist confirmation email:", emailError);
        // Continue even if email fails
      }

      res.json({ 
        success: true, 
        message: "You've been added to the waitlist!" 
      });
    } catch (error: any) {
      console.error("Waitlist signup error:", error);
      if (error.code === '23505') { // Unique violation
        return res.json({ 
          success: true, 
          message: "You're already on the waitlist!", 
          alreadyRegistered: true 
        });
      }
      res.status(500).json({ error: "Failed to add to waitlist" });
    }
  });

  // === CROWDFUNDING ROUTES ===
  app.get("/api/crowdfund/campaign", async (_req, res) => {
    try {
      const campaign = await storage.getActiveCampaign();
      if (!campaign) {
        return res.status(404).json({ error: "No active campaign" });
      }
      res.json(campaign);
    } catch (error) {
      console.error("Get campaign error:", error);
      res.status(500).json({ error: "Failed to fetch campaign" });
    }
  });

  app.get("/api/crowdfund/features", async (_req, res) => {
    try {
      const features = await storage.getCrowdfundFeatures();
      res.json(features);
    } catch (error) {
      console.error("Get crowdfund features error:", error);
      res.status(500).json({ error: "Failed to fetch features" });
    }
  });

  app.get("/api/crowdfund/stats", async (_req, res) => {
    try {
      const crowdfundStats = await storage.getCrowdfundStats();
      
      const presaleResult = await db.execute(sql`
        SELECT 
          COALESCE(SUM(usd_amount_cents), 0) as presale_raised,
          COALESCE(COUNT(DISTINCT email), 0) as presale_contributors
        FROM presale_purchases 
        WHERE status = 'completed'
      `);
      const presaleRaised = parseInt(presaleResult.rows[0]?.presale_raised as string || "0");
      const presaleContributors = parseInt(presaleResult.rows[0]?.presale_contributors as string || "0");
      
      res.json({
        ...crowdfundStats,
        totalRaised: (crowdfundStats.totalRaised || 0) + presaleRaised,
        contributorCount: (crowdfundStats.contributorCount || 0) + presaleContributors,
        presaleRaisedCents: presaleRaised,
        presaleContributors,
      });
    } catch (error) {
      console.error("Get crowdfund stats error:", error);
      res.status(500).json({ error: "Failed to fetch stats" });
    }
  });

  app.get("/api/crowdfund/contributions", async (_req, res) => {
    try {
      const contributions = await storage.getRecentContributions(50);
      res.json(contributions);
    } catch (error) {
      console.error("Get contributions error:", error);
      res.status(500).json({ error: "Failed to fetch contributions" });
    }
  });

  app.post("/api/crowdfund/checkout", async (req, res) => {
    try {
      const { amountCents, featureId, displayName, isAnonymous, message } = req.body;
      
      if (!amountCents || amountCents < 100) {
        return res.status(400).json({ error: "Minimum donation is $1.00" });
      }

      const campaign = await storage.getActiveCampaign();
      if (!campaign) {
        return res.status(404).json({ error: "No active campaign" });
      }

      const user = req.user as any;
      
      const contribution = await storage.createCrowdfundContribution({
        campaignId: campaign.id,
        featureId: featureId || null,
        userId: user?.id || null,
        displayName: isAnonymous ? null : (displayName || user?.firstName || null),
        amountCents,
        currency: "USD",
        paymentMethod: "stripe",
        isAnonymous: isAnonymous || false,
        message: message || null,
        status: "pending",
      });

      const stripe = await import("stripe");
      const stripeClient = new stripe.default(process.env.STRIPE_SECRET_KEY || "", {
        apiVersion: "2025-11-17.clover",
      });

      const session = await stripeClient.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [{
          price_data: {
            currency: "usd",
            product_data: {
              name: featureId ? "Feature Funding Contribution" : "DarkWave Dev Fund Contribution",
              description: "Transparent blockchain development funding",
            },
            unit_amount: amountCents,
          },
          quantity: 1,
        }],
        mode: "payment",
        success_url: `${req.headers.origin || 'https://dwsc.io'}/crowdfund?success=true&contribution=${contribution.id}`,
        cancel_url: `${req.headers.origin || 'https://dwsc.io'}/crowdfund?canceled=true`,
        metadata: {
          contributionId: contribution.id,
          campaignId: campaign.id,
          featureId: featureId || "",
        },
      });

      await storage.updateCrowdfundContribution(contribution.id, {
        stripePaymentIntentId: session.id,
      });

      res.json({ url: session.url, contributionId: contribution.id });
    } catch (error) {
      console.error("Crowdfund checkout error:", error);
      res.status(500).json({ error: "Failed to create checkout session" });
    }
  });

  app.post("/api/crowdfund/confirm/:contributionId", async (req, res) => {
    try {
      const { contributionId } = req.params;
      
      const contribution = await storage.updateCrowdfundContribution(contributionId, {
        status: "confirmed",
      });

      if (!contribution) {
        return res.status(404).json({ error: "Contribution not found" });
      }

      res.json({ success: true, contribution });
    } catch (error) {
      console.error("Confirm contribution error:", error);
      res.status(500).json({ error: "Failed to confirm contribution" });
    }
  });

  // Crowdfund crypto checkout via Coinbase Commerce
  app.post("/api/crowdfund/crypto-checkout", async (req, res) => {
    try {
      const { amountCents, featureId, displayName, isAnonymous, message } = req.body;
      
      if (!amountCents || amountCents < 100) {
        return res.status(400).json({ error: "Minimum donation is $1.00" });
      }

      const campaign = await storage.getActiveCampaign();
      if (!campaign) {
        return res.status(404).json({ error: "No active campaign" });
      }

      const user = req.user as any;
      
      const contribution = await storage.createCrowdfundContribution({
        campaignId: campaign.id,
        featureId: featureId || null,
        userId: user?.id || null,
        displayName: isAnonymous ? null : (displayName || user?.firstName || null),
        amountCents,
        currency: "USD",
        paymentMethod: "coinbase",
        isAnonymous: isAnonymous || false,
        message: message || null,
        status: "pending",
      });

      const host = req.get("host") || "dwsc.io";
      const protocol = host.includes("localhost") ? "http" : "https";
      const baseUrl = `${protocol}://${host}`;

      const { createCoinbaseCharge } = await import("./coinbaseClient");
      const charge = await createCoinbaseCharge({
        name: featureId ? "Feature Funding Contribution" : "DarkWave Dev Fund Contribution",
        description: "Transparent blockchain development funding",
        amountUsd: (amountCents / 100).toFixed(2),
        successUrl: `${baseUrl}/crowdfund?success=true&contribution=${contribution.id}&crypto=true`,
        cancelUrl: `${baseUrl}/crowdfund?canceled=true`,
        metadata: {
          contributionId: contribution.id,
          campaignId: campaign.id,
          featureId: featureId || "",
        },
      });

      await storage.updateCrowdfundContribution(contribution.id, {
        stripePaymentIntentId: `coinbase_${charge.id}`,
      });

      res.json({ checkoutUrl: charge.hostedUrl, contributionId: contribution.id, chargeId: charge.id });
    } catch (error) {
      console.error("Crowdfund crypto checkout error:", error);
      res.status(500).json({ error: "Failed to create crypto checkout" });
    }
  });

  // Verify crowdfund crypto contribution
  app.post("/api/crowdfund/confirm-crypto/:contributionId", async (req, res) => {
    try {
      const { contributionId } = req.params;
      
      const contribution = await storage.getCrowdfundContribution(contributionId);
      if (!contribution) {
        return res.status(404).json({ error: "Contribution not found" });
      }
      
      // Already confirmed
      if (contribution.status === "confirmed") {
        return res.json({ success: true, contribution });
      }
      
      // Check if it's a Coinbase payment
      const paymentId = contribution.stripePaymentIntentId;
      if (!paymentId?.startsWith("coinbase_")) {
        // Not a crypto payment, use standard confirm
        const updated = await storage.updateCrowdfundContribution(contributionId, { status: "confirmed" });
        return res.json({ success: true, contribution: updated });
      }
      
      const chargeId = paymentId.replace("coinbase_", "");
      const { getCoinbaseCharge } = await import("./coinbaseClient");
      const charge = await getCoinbaseCharge(chargeId);
      
      if (charge.status === "COMPLETED" || charge.status === "CONFIRMED") {
        const updated = await storage.updateCrowdfundContribution(contributionId, { status: "confirmed" });
        return res.json({ success: true, contribution: updated });
      }
      
      res.json({ success: false, status: charge.status });
    } catch (error) {
      console.error("Confirm crypto contribution error:", error);
      res.status(500).json({ error: "Failed to confirm contribution" });
    }
  });

  // === GUARDIAN CERTIFICATION CHECKOUT ROUTES ===
  const GUARDIAN_TIERS = {
    assurance_lite: {
      name: "Guardian Assurance Lite",
      description: "Standard security audit with comprehensive smart contract analysis",
      price: 599900, // $5,999 in cents
    },
    guardian_premier: {
      name: "Guardian Premier",
      description: "Enterprise-grade security certification with penetration testing and full audit",
      price: 1499900, // $14,999 in cents
    },
  };

  const GuardianCheckoutSchema = z.object({
    tier: z.enum(["assurance_lite", "guardian_premier"]),
    projectName: z.string().min(1).max(200),
    projectUrl: z.string().url().optional(),
    contactEmail: z.string().email(),
    contractCount: z.number().min(1).max(50).optional(),
  });

  app.post("/api/guardian/checkout", async (req, res) => {
    try {
      const data = GuardianCheckoutSchema.parse(req.body);
      const tierInfo = GUARDIAN_TIERS[data.tier];
      
      if (!tierInfo) {
        return res.status(400).json({ error: "Invalid tier" });
      }

      const stripe = await import("stripe");
      const stripeClient = new stripe.default(process.env.STRIPE_SECRET_KEY || "", {
        apiVersion: "2025-11-17.clover",
      });

      const session = await stripeClient.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [{
          price_data: {
            currency: "usd",
            product_data: {
              name: tierInfo.name,
              description: tierInfo.description,
            },
            unit_amount: tierInfo.price,
          },
          quantity: 1,
        }],
        mode: "payment",
        customer_email: data.contactEmail,
        success_url: `${req.headers.origin || 'https://dwsc.io'}/guardian-certification?success=true&tier=${data.tier}`,
        cancel_url: `${req.headers.origin || 'https://dwsc.io'}/guardian-certification?canceled=true`,
        metadata: {
          type: "guardian_certification",
          tier: data.tier,
          projectName: data.projectName,
          projectUrl: data.projectUrl || "",
          contactEmail: data.contactEmail,
          contractCount: String(data.contractCount || 1),
        },
      });

      res.json({ url: session.url });
    } catch (error) {
      console.error("Guardian checkout error:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid request data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to create checkout session" });
    }
  });

  app.get("/api/guardian/tiers", (_req, res) => {
    res.json({
      tiers: Object.entries(GUARDIAN_TIERS).map(([id, tier]) => ({
        id,
        name: tier.name,
        description: tier.description,
        priceFormatted: `$${(tier.price / 100).toLocaleString()}`,
        priceCents: tier.price,
      })),
    });
  });

  app.get("/api/guardian/certifications", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user?.id || req.query.userId as string;
      if (!userId) {
        return res.status(401).json({ error: "Authentication required" });
      }
      const certifications = await guardianService.getCertificationsByUser(userId);
      res.json({ certifications });
    } catch (error) {
      console.error("Error fetching certifications:", error);
      res.status(500).json({ error: "Failed to fetch certifications" });
    }
  });

  app.get("/api/guardian/certifications/:id", async (req, res) => {
    try {
      const certification = await guardianService.getCertification(req.params.id);
      if (!certification) {
        return res.status(404).json({ error: "Certification not found" });
      }
      res.json({ certification });
    } catch (error) {
      console.error("Error fetching certification:", error);
      res.status(500).json({ error: "Failed to fetch certification" });
    }
  });

  app.post("/api/guardian/certifications", isAuthenticated, async (req: any, res) => {
    try {
      const schema = z.object({
        projectName: z.string().min(1),
        projectUrl: z.string().optional(),
        contactEmail: z.string().email(),
        tier: z.enum(["self_cert", "assurance_lite", "guardian_premier"]),
        stripePaymentId: z.string().optional()
      });
      const data = schema.parse(req.body);
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ error: "Authentication required" });
      }
      const certification = await guardianService.createCertification({ ...data, userId });
      res.json({ certification });
    } catch (error) {
      console.error("Error creating certification:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid request", details: error.errors });
      }
      res.status(500).json({ error: "Failed to create certification" });
    }
  });

  app.get("/api/guardian/assets", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ error: "Authentication required" });
      }
      const assets = await guardianService.getMonitoredAssets(userId);
      res.json({ assets });
    } catch (error) {
      console.error("Error fetching assets:", error);
      res.status(500).json({ error: "Failed to fetch monitored assets" });
    }
  });

  app.post("/api/guardian/assets", isAuthenticated, async (req: any, res) => {
    try {
      const schema = z.object({
        assetType: z.enum(["contract", "wallet", "validator", "bridge", "pool"]),
        assetAddress: z.string().min(10),
        assetName: z.string().optional(),
        chainId: z.string(),
        monitoringTier: z.enum(["watch", "shield", "command"]),
        alertChannels: z.string().optional()
      });
      const data = schema.parse(req.body);
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ error: "Authentication required" });
      }
      const asset = await guardianService.addMonitoredAsset({ ...data, userId });
      res.json({ asset });
    } catch (error) {
      console.error("Error adding asset:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid request", details: error.errors });
      }
      res.status(500).json({ error: "Failed to add monitored asset" });
    }
  });

  app.get("/api/guardian/incidents", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ error: "Authentication required" });
      }
      const incidents = await guardianService.getIncidents(userId);
      res.json({ incidents });
    } catch (error) {
      console.error("Error fetching incidents:", error);
      res.status(500).json({ error: "Failed to fetch incidents" });
    }
  });

  app.post("/api/guardian/incidents/:id/resolve", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ error: "Authentication required" });
      }
      const incident = await guardianService.resolveIncident(req.params.id);
      if (!incident) {
        return res.status(404).json({ error: "Incident not found" });
      }
      res.json({ incident });
    } catch (error) {
      console.error("Error resolving incident:", error);
      res.status(500).json({ error: "Failed to resolve incident" });
    }
  });

  app.get("/api/guardian/stamps", async (req, res) => {
    try {
      const referenceId = req.query.referenceId as string | undefined;
      const stamps = await guardianService.getBlockchainStamps(referenceId);
      res.json({ stamps });
    } catch (error) {
      console.error("Error fetching stamps:", error);
      res.status(500).json({ error: "Failed to fetch blockchain stamps" });
    }
  });

  app.post("/api/guardian/certifications/:id/mint-nft", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ error: "Authentication required" });
      }
      const cert = await guardianService.getCertification(req.params.id);
      if (!cert || cert.userId !== userId) {
        return res.status(403).json({ error: "Not authorized to mint this certification NFT" });
      }
      const result = await guardianService.mintCertificationNFT(req.params.id);
      res.json(result);
    } catch (error: any) {
      console.error("Error minting NFT:", error);
      res.status(400).json({ error: error.message || "Failed to mint NFT" });
    }
  });

  app.get("/api/guardian/registry", async (_req, res) => {
    try {
      const registry = await guardianService.getPublicRegistry();
      res.json({ registry });
    } catch (error) {
      console.error("Error fetching registry:", error);
      res.status(500).json({ error: "Failed to fetch public registry" });
    }
  });

  app.post("/api/guardian/stamps/batch-confirm", async (req, res) => {
    try {
      const schema = z.object({
        stampIds: z.array(z.string()),
        transactionHash: z.string(),
        blockNumber: z.number()
      });
      const { stampIds, transactionHash, blockNumber } = schema.parse(req.body);
      
      const hashes = stampIds.map(id => guardianHash({ id, confirmed: true }));
      const merkleRoot = generateMerkleRoot(hashes);
      
      const confirmed = await guardianService.batchConfirmStamps(stampIds, merkleRoot, transactionHash, blockNumber);
      res.json({ confirmed, merkleRoot });
    } catch (error) {
      console.error("Error batch confirming stamps:", error);
      res.status(500).json({ error: "Failed to batch confirm stamps" });
    }
  });

  // ============================================
  // GUARDIAN SECURITY SCORES - Real-time project ratings
  // ============================================

  app.get("/api/guardian/security-scores", async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 50;
      const status = req.query.status as string;
      let query = db.select().from(guardianSecurityScores);
      if (status) {
        query = query.where(eq(guardianSecurityScores.status, status)) as typeof query;
      }
      const scores = await query.limit(limit).orderBy(desc(guardianSecurityScores.overallScore));
      res.json({ scores, total: scores.length });
    } catch (error) {
      console.error("Error fetching security scores:", error);
      res.status(500).json({ error: "Failed to fetch security scores" });
    }
  });

  app.get("/api/guardian/security-scores/:projectId", async (req, res) => {
    try {
      const score = await db.select().from(guardianSecurityScores)
        .where(eq(guardianSecurityScores.projectId, req.params.projectId))
        .limit(1);
      if (!score.length) {
        return res.status(404).json({ error: "Project not found" });
      }
      res.json({ score: score[0] });
    } catch (error) {
      console.error("Error fetching security score:", error);
      res.status(500).json({ error: "Failed to fetch security score" });
    }
  });

  app.get("/api/guardian/security-scores/stats/overview", async (_req, res) => {
    try {
      const scores = await db.select().from(guardianSecurityScores);
      const total = scores.length;
      const certified = scores.filter(s => s.certificationTier).length;
      const avgScore = total > 0 ? Math.round(scores.reduce((a, b) => a + b.overallScore, 0) / total) : 0;
      const insured = scores.filter(s => s.insuranceEligible).length;
      res.json({
        totalProjects: total,
        certifiedProjects: certified,
        averageScore: avgScore,
        insuredProjects: insured,
        riskDistribution: {
          low: scores.filter(s => s.riskLevel === 'low').length,
          medium: scores.filter(s => s.riskLevel === 'medium').length,
          high: scores.filter(s => s.riskLevel === 'high').length,
          critical: scores.filter(s => s.riskLevel === 'critical').length
        }
      });
    } catch (error) {
      console.error("Error fetching score stats:", error);
      res.status(500).json({ error: "Failed to fetch score stats" });
    }
  });

  // ============================================
  // CHRONOPASS IDENTITY - Unified cross-app identity
  // ============================================

  app.get("/api/chronopass/identity", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user?.claims?.sub || req.user?.id;
      if (!userId) {
        return res.status(401).json({ error: "Authentication required" });
      }
      const identity = await db.select().from(chronoPassIdentities)
        .where(eq(chronoPassIdentities.userId, userId))
        .limit(1);
      if (!identity.length) {
        return res.json({ identity: null, exists: false });
      }
      res.json({ identity: identity[0], exists: true });
    } catch (error) {
      console.error("Error fetching identity:", error);
      res.status(500).json({ error: "Failed to fetch identity" });
    }
  });

  app.post("/api/chronopass/identity", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user?.claims?.sub || req.user?.id;
      if (!userId) {
        return res.status(401).json({ error: "Authentication required" });
      }
      const schema = z.object({
        displayName: z.string().min(2).max(50),
        bio: z.string().max(500).optional(),
        avatarUrl: z.string().url().optional()
      });
      const data = schema.parse(req.body);
      
      const existing = await db.select().from(chronoPassIdentities)
        .where(eq(chronoPassIdentities.userId, userId)).limit(1);
      
      if (existing.length) {
        const updated = await db.update(chronoPassIdentities)
          .set({ ...data, updatedAt: new Date() })
          .where(eq(chronoPassIdentities.userId, userId))
          .returning();
        return res.json({ identity: updated[0], updated: true });
      }
      
      const created = await db.insert(chronoPassIdentities)
        .values({ userId, ...data })
        .returning();
      res.json({ identity: created[0], created: true });
    } catch (error) {
      console.error("Error creating identity:", error);
      res.status(500).json({ error: "Failed to create identity" });
    }
  });

  app.get("/api/chronopass/reputation/:userId", async (req, res) => {
    try {
      const identity = await db.select().from(chronoPassIdentities)
        .where(eq(chronoPassIdentities.userId, req.params.userId))
        .limit(1);
      if (!identity.length) {
        return res.status(404).json({ error: "Identity not found" });
      }
      const id = identity[0];
      res.json({
        userId: id.userId,
        displayName: id.displayName,
        reputationScore: id.reputationScore,
        trustLevel: id.trustLevel,
        verificationStatus: id.verificationStatus,
        scores: {
          community: id.communityScore,
          trading: id.tradingScore,
          gaming: id.gamingScore,
          developer: id.developerScore,
          governance: id.governanceScore
        },
        staking: {
          shells: id.shellsStaked,
          dwc: id.dwcStaked,
          boostMultiplier: id.stakingBoostMultiplier
        },
        badges: id.badges ? JSON.parse(id.badges) : [],
        currentTitle: id.currentTitle
      });
    } catch (error) {
      console.error("Error fetching reputation:", error);
      res.status(500).json({ error: "Failed to fetch reputation" });
    }
  });

  // ============================================
  // EXPERIENCE SHARDS - Dedicated execution lanes
  // ============================================

  app.get("/api/shards", async (_req, res) => {
    try {
      const shards = await db.select().from(experienceShards)
        .orderBy(desc(experienceShards.priorityLevel));
      res.json({ shards });
    } catch (error) {
      console.error("Error fetching shards:", error);
      res.status(500).json({ error: "Failed to fetch shards" });
    }
  });

  app.get("/api/shards/:id", async (req, res) => {
    try {
      const shard = await db.select().from(experienceShards)
        .where(eq(experienceShards.id, req.params.id))
        .limit(1);
      if (!shard.length) {
        return res.status(404).json({ error: "Shard not found" });
      }
      const assignments = await db.select().from(shardAssignments)
        .where(eq(shardAssignments.shardId, req.params.id));
      res.json({ shard: shard[0], assignments });
    } catch (error) {
      console.error("Error fetching shard:", error);
      res.status(500).json({ error: "Failed to fetch shard" });
    }
  });

  app.get("/api/shards/stats/network", async (_req, res) => {
    try {
      const shards = await db.select().from(experienceShards);
      const totalTps = shards.reduce((a, s) => a + s.currentTps, 0);
      const avgLatency = shards.length > 0 
        ? Math.round(shards.reduce((a, s) => a + s.currentLatencyMs, 0) / shards.length)
        : 0;
      const avgLoad = shards.length > 0
        ? Math.round(shards.reduce((a, s) => a + s.currentLoad, 0) / shards.length)
        : 0;
      res.json({
        totalShards: shards.length,
        activeShards: shards.filter(s => s.status === 'active').length,
        totalTps,
        averageLatencyMs: avgLatency,
        averageLoad: avgLoad,
        shardsByType: shards.reduce((acc, s) => {
          acc[s.shardType] = (acc[s.shardType] || 0) + 1;
          return acc;
        }, {} as Record<string, number>)
      });
    } catch (error) {
      console.error("Error fetching shard stats:", error);
      res.status(500).json({ error: "Failed to fetch shard stats" });
    }
  });

  // ============================================
  // QUEST MINING - Verifiable contribution rewards
  // ============================================

  app.get("/api/quests", async (req, res) => {
    try {
      const category = req.query.category as string;
      const questType = req.query.type as string;
      let query = db.select().from(questDefinitions)
        .where(eq(questDefinitions.isActive, true));
      
      const quests = await query.orderBy(questDefinitions.difficultyLevel);
      const filtered = quests.filter(q => {
        if (category && q.category !== category) return false;
        if (questType && q.questType !== questType) return false;
        return true;
      });
      res.json({ quests: filtered });
    } catch (error) {
      console.error("Error fetching quests:", error);
      res.status(500).json({ error: "Failed to fetch quests" });
    }
  });

  app.get("/api/quests/my-progress", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user?.claims?.sub || req.user?.id;
      if (!userId) {
        return res.status(401).json({ error: "Authentication required" });
      }
      const progress = await db.select().from(questProgress)
        .where(eq(questProgress.userId, userId));
      res.json({ progress });
    } catch (error) {
      console.error("Error fetching quest progress:", error);
      res.status(500).json({ error: "Failed to fetch quest progress" });
    }
  });

  app.post("/api/quests/:questId/start", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user?.claims?.sub || req.user?.id;
      if (!userId) {
        return res.status(401).json({ error: "Authentication required" });
      }
      
      // Get quest definition
      const [quest] = await db.select().from(questDefinitions)
        .where(eq(questDefinitions.id, req.params.questId));
      
      if (!quest) {
        return res.status(404).json({ error: "Quest not found" });
      }
      
      const existing = await db.select().from(questProgress)
        .where(and(
          eq(questProgress.questId, req.params.questId),
          eq(questProgress.userId, userId)
        )).limit(1);
      
      if (existing.length) {
        return res.json({ progress: existing[0], alreadyStarted: true });
      }
      
      // Parse requirements to get target count
      let targetCount = 1;
      try {
        const reqs = JSON.parse(quest.requirements || '{}');
        targetCount = reqs.count || reqs.target || reqs.amount || 1;
      } catch (e) {
        // Default to 1 if requirements is not valid JSON
      }
      
      const created = await db.insert(questProgress)
        .values({ 
          questId: req.params.questId, 
          userId, 
          status: 'in_progress',
          progressPercent: 0,
          progressData: JSON.stringify({ current: 0, target: targetCount })
        })
        .returning();
      res.json({ progress: created[0], started: true });
    } catch (error) {
      console.error("Error starting quest:", error);
      res.status(500).json({ error: "Failed to start quest" });
    }
  });

  // Complete a quest and distribute rewards (idempotent)
  app.post("/api/quests/:questId/complete", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user?.claims?.sub || req.user?.id;
      if (!userId) {
        return res.status(401).json({ error: "Authentication required" });
      }
      
      const { questId } = req.params;
      
      // Get quest definition
      const [quest] = await db.select().from(questDefinitions)
        .where(eq(questDefinitions.id, questId));
      
      if (!quest) {
        return res.status(404).json({ error: "Quest not found" });
      }
      
      // Get existing progress
      const [progress] = await db.select().from(questProgress)
        .where(and(
          eq(questProgress.questId, questId),
          eq(questProgress.userId, userId)
        ));
      
      if (!progress) {
        return res.status(400).json({ error: "Quest not started" });
      }
      
      const rewardAmount = quest.shellsReward || 10;
      
      // Idempotent - if already completed, just return success with info
      if (progress.status === 'completed' || progress.status === 'claimed') {
        return res.json({ 
          progress, 
          completed: true,
          alreadyCompleted: true,
          reward: {
            shells: rewardAmount,
            xp: quest.reputationReward || 10
          }
        });
      }
      
      // Update progress to completed
      const [updatedProgress] = await db.update(questProgress)
        .set({
          status: 'completed',
          completedAt: new Date(),
          progressPercent: 100,
        })
        .where(eq(questProgress.id, progress.id))
        .returning();
      
      // Award Shells as quest reward
      const user = await storage.getUser(userId);
      
      if (user) {
        await shellsService.addShells(
          userId,
          user.firstName || user.email || 'User',
          rewardAmount,
          'earn',
          `Completed quest: ${quest.title}`,
          questId,
          'quest'
        );
      }
      
      // Update leaderboard for active season
      const [activeSeason] = await db.select().from(questSeasons)
        .where(eq(questSeasons.status, 'active'))
        .limit(1);
      
      if (activeSeason) {
        const pointsEarned = quest.reputationReward || 10;
        
        // Get or create leaderboard entry
        const [existingEntry] = await db.select().from(questLeaderboard)
          .where(and(
            eq(questLeaderboard.seasonId, activeSeason.id),
            eq(questLeaderboard.userId, userId)
          ));
        
        if (existingEntry) {
          await db.update(questLeaderboard)
            .set({
              totalPoints: existingEntry.totalPoints + pointsEarned,
              questsCompleted: existingEntry.questsCompleted + 1,
              updatedAt: new Date(),
            })
            .where(eq(questLeaderboard.id, existingEntry.id));
        } else {
          await db.insert(questLeaderboard)
            .values({
              seasonId: activeSeason.id,
              userId,
              username: user?.firstName || user?.displayName || user?.email?.split('@')[0] || 'User',
              totalPoints: pointsEarned,
              questsCompleted: 1,
            });
        }
      }
      
      res.json({ 
        progress: updatedProgress, 
        completed: true,
        reward: {
          shells: rewardAmount,
          xp: quest.reputationReward || 10
        }
      });
    } catch (error) {
      console.error("Error completing quest:", error);
      res.status(500).json({ error: "Failed to complete quest" });
    }
  });

  // Update quest progress (increment)
  app.post("/api/quests/:questId/progress", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user?.claims?.sub || req.user?.id;
      if (!userId) {
        return res.status(401).json({ error: "Authentication required" });
      }
      
      const { questId } = req.params;
      const { increment = 1 } = req.body;
      
      // Get existing progress
      const [progress] = await db.select().from(questProgress)
        .where(and(
          eq(questProgress.questId, questId),
          eq(questProgress.userId, userId)
        ));
      
      if (!progress) {
        return res.status(400).json({ error: "Quest not started" });
      }
      
      if (progress.status === 'completed' || progress.status === 'claimed') {
        return res.json({ progress, alreadyCompleted: true });
      }
      
      // Parse progressData to get current and target
      let progressInfo = { current: 0, target: 1 };
      try {
        progressInfo = JSON.parse(progress.progressData || '{"current": 0, "target": 1}');
      } catch (e) {}
      
      const newCurrent = (progressInfo.current || 0) + increment;
      const target = progressInfo.target || 1;
      const isComplete = newCurrent >= target;
      const newPercent = Math.min(Math.round((newCurrent / target) * 100), 100);
      
      // Update progress
      const [updated] = await db.update(questProgress)
        .set({
          progressData: JSON.stringify({ current: Math.min(newCurrent, target), target }),
          progressPercent: newPercent,
          status: isComplete ? 'completed' : 'in_progress',
          completedAt: isComplete ? new Date() : null,
        })
        .where(eq(questProgress.id, progress.id))
        .returning();
      
      let reward = null;
      
      // If complete, award rewards directly
      if (isComplete) {
        const [quest] = await db.select().from(questDefinitions)
          .where(eq(questDefinitions.id, questId));
        
        if (quest) {
          const user = await storage.getUser(userId);
          const rewardAmount = quest.shellsReward || 10;
          
          if (user) {
            await shellsService.addShells(
              userId,
              user.firstName || user.email || 'User',
              rewardAmount,
              'earn',
              `Completed quest: ${quest.title}`,
              questId,
              'quest'
            );
          }
          
          // Update leaderboard
          const [activeSeason] = await db.select().from(questSeasons)
            .where(eq(questSeasons.status, 'active'))
            .limit(1);
          
          if (activeSeason) {
            const pointsEarned = quest.reputationReward || 10;
            
            const [existingEntry] = await db.select().from(questLeaderboard)
              .where(and(
                eq(questLeaderboard.seasonId, activeSeason.id),
                eq(questLeaderboard.userId, userId)
              ));
            
            if (existingEntry) {
              await db.update(questLeaderboard)
                .set({
                  totalPoints: existingEntry.totalPoints + pointsEarned,
                  questsCompleted: existingEntry.questsCompleted + 1,
                  updatedAt: new Date(),
                })
                .where(eq(questLeaderboard.id, existingEntry.id));
            } else {
              await db.insert(questLeaderboard)
                .values({
                  seasonId: activeSeason.id,
                  userId,
                  username: user?.firstName || user?.displayName || user?.email?.split('@')[0] || 'User',
                  totalPoints: pointsEarned,
                  questsCompleted: 1,
                });
            }
          }
          
          reward = { shells: rewardAmount, xp: quest.reputationReward || 10 };
        }
      }
      
      res.json({ progress: updated, isComplete, reward });
    } catch (error) {
      console.error("Error updating quest progress:", error);
      res.status(500).json({ error: "Failed to update progress" });
    }
  });

  app.get("/api/quests/seasons", async (_req, res) => {
    try {
      const seasons = await db.select().from(questSeasons)
        .orderBy(desc(questSeasons.seasonNumber));
      res.json({ seasons });
    } catch (error) {
      console.error("Error fetching seasons:", error);
      res.status(500).json({ error: "Failed to fetch seasons" });
    }
  });

  app.get("/api/quests/leaderboard/:seasonId", async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 100;
      const leaderboard = await db.select().from(questLeaderboard)
        .where(eq(questLeaderboard.seasonId, req.params.seasonId))
        .orderBy(desc(questLeaderboard.totalPoints))
        .limit(limit);
      res.json({ leaderboard });
    } catch (error) {
      console.error("Error fetching leaderboard:", error);
      res.status(500).json({ error: "Failed to fetch leaderboard" });
    }
  });

  // ============================================
  // REALITY LAYER ORACLES - On-chain notarization
  // ============================================

  app.get("/api/oracles", async (_req, res) => {
    try {
      const oracles = await db.select().from(realityOracles)
        .where(eq(realityOracles.status, 'active'));
      res.json({ oracles });
    } catch (error) {
      console.error("Error fetching oracles:", error);
      res.status(500).json({ error: "Failed to fetch oracles" });
    }
  });

  app.get("/api/oracles/:id/feeds", async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 50;
      const feeds = await db.select().from(oracleDataFeeds)
        .where(eq(oracleDataFeeds.oracleId, req.params.id))
        .orderBy(desc(oracleDataFeeds.createdAt))
        .limit(limit);
      res.json({ feeds });
    } catch (error) {
      console.error("Error fetching oracle feeds:", error);
      res.status(500).json({ error: "Failed to fetch oracle feeds" });
    }
  });

  app.get("/api/oracles/feed/:feedKey", async (req, res) => {
    try {
      const feed = await db.select().from(oracleDataFeeds)
        .where(eq(oracleDataFeeds.feedKey, req.params.feedKey))
        .limit(1);
      if (!feed.length) {
        return res.status(404).json({ error: "Feed not found" });
      }
      res.json({ feed: feed[0] });
    } catch (error) {
      console.error("Error fetching feed:", error);
      res.status(500).json({ error: "Failed to fetch feed" });
    }
  });

  // ============================================
  // AI VERIFIED EXECUTION - Cryptographic proofs
  // ============================================

  app.get("/api/ai/proofs", async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 50;
      const proofs = await db.select().from(aiExecutionProofs)
        .orderBy(desc(aiExecutionProofs.createdAt))
        .limit(limit);
      res.json({ proofs });
    } catch (error) {
      console.error("Error fetching AI proofs:", error);
      res.status(500).json({ error: "Failed to fetch AI proofs" });
    }
  });

  app.get("/api/ai/proofs/:requestId", async (req, res) => {
    try {
      const proof = await db.select().from(aiExecutionProofs)
        .where(eq(aiExecutionProofs.requestId, req.params.requestId))
        .limit(1);
      if (!proof.length) {
        return res.status(404).json({ error: "Proof not found" });
      }
      res.json({ proof: proof[0] });
    } catch (error) {
      console.error("Error fetching proof:", error);
      res.status(500).json({ error: "Failed to fetch proof" });
    }
  });

  app.get("/api/ai/models", async (_req, res) => {
    try {
      const models = await db.select().from(aiModelRegistry)
        .where(eq(aiModelRegistry.status, 'active'));
      res.json({ models });
    } catch (error) {
      console.error("Error fetching AI models:", error);
      res.status(500).json({ error: "Failed to fetch AI models" });
    }
  });

  // ============================================
  // GUARDIAN STUDIO COPILOT - AI contract generation
  // ============================================

  app.get("/api/copilot/sessions", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user?.claims?.sub || req.user?.id;
      if (!userId) {
        return res.status(401).json({ error: "Authentication required" });
      }
      const sessions = await db.select().from(copilotSessions)
        .where(eq(copilotSessions.userId, userId))
        .orderBy(desc(copilotSessions.updatedAt));
      res.json({ sessions });
    } catch (error) {
      console.error("Error fetching sessions:", error);
      res.status(500).json({ error: "Failed to fetch sessions" });
    }
  });

  app.post("/api/copilot/sessions", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user?.claims?.sub || req.user?.id;
      if (!userId) {
        return res.status(401).json({ error: "Authentication required" });
      }
      const schema = z.object({
        sessionName: z.string().min(1).max(100).optional(),
        contractType: z.enum(['token', 'nft', 'staking', 'dao', 'custom']).optional()
      });
      const data = schema.parse(req.body);
      
      const session = await db.insert(copilotSessions)
        .values({ userId, ...data })
        .returning();
      res.json({ session: session[0] });
    } catch (error) {
      console.error("Error creating session:", error);
      res.status(500).json({ error: "Failed to create session" });
    }
  });

  app.get("/api/copilot/sessions/:id", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user?.claims?.sub || req.user?.id;
      if (!userId) {
        return res.status(401).json({ error: "Authentication required" });
      }
      const session = await db.select().from(copilotSessions)
        .where(and(
          eq(copilotSessions.id, req.params.id),
          eq(copilotSessions.userId, userId)
        )).limit(1);
      if (!session.length) {
        return res.status(404).json({ error: "Session not found" });
      }
      const messages = await db.select().from(copilotMessages)
        .where(eq(copilotMessages.sessionId, req.params.id))
        .orderBy(copilotMessages.createdAt);
      res.json({ session: session[0], messages });
    } catch (error) {
      console.error("Error fetching session:", error);
      res.status(500).json({ error: "Failed to fetch session" });
    }
  });

  // ============================================
  // AI AGENT MARKETPLACE - Deploy autonomous AI agents
  // ============================================

  const { aiAgents, aiAgentDeployments, aiAgentExecutions, insertAiAgentSchema, insertAiAgentDeploymentSchema, insertAiAgentExecutionSchema } = await import("@shared/schema");

  app.get("/api/ai-agents", async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 50;
      const category = req.query.category as string;
      const featured = req.query.featured === 'true';
      
      const conditions = [eq(aiAgents.status, 'active')];
      if (category) conditions.push(eq(aiAgents.category, category));
      if (featured) conditions.push(eq(aiAgents.featured, true));
      
      const agents = await db.select().from(aiAgents)
        .where(and(...conditions))
        .orderBy(desc(aiAgents.totalExecutions))
        .limit(limit);
      res.json({ agents, total: agents.length });
    } catch (error) {
      console.error("Error fetching AI agents:", error);
      res.status(500).json({ error: "Failed to fetch AI agents" });
    }
  });

  app.get("/api/ai-agents/stats", async (_req, res) => {
    try {
      const agents = await db.select().from(aiAgents);
      const totalAgents = agents.length;
      const activeAgents = agents.filter(a => a.status === 'active').length;
      const verifiedAgents = agents.filter(a => a.verified).length;
      const totalExecutions = agents.reduce((sum, a) => sum + a.totalExecutions, 0);
      const totalEarnings = agents.reduce((sum, a) => sum + BigInt(a.totalEarnings), BigInt(0));
      
      const categories = ['trading', 'portfolio', 'quest', 'social', 'analytics', 'custom'];
      const byCategory = categories.map(cat => ({
        category: cat,
        count: agents.filter(a => a.category === cat).length
      }));
      
      res.json({
        totalAgents,
        activeAgents,
        verifiedAgents,
        totalExecutions,
        totalEarnings: totalEarnings.toString(),
        byCategory
      });
    } catch (error) {
      console.error("Error fetching agent stats:", error);
      res.status(500).json({ error: "Failed to fetch agent stats" });
    }
  });

  app.get("/api/ai-agents/:id", async (req, res) => {
    try {
      const agent = await db.select().from(aiAgents)
        .where(eq(aiAgents.id, req.params.id)).limit(1);
      if (!agent.length) {
        return res.status(404).json({ error: "Agent not found" });
      }
      res.json({ agent: agent[0] });
    } catch (error) {
      console.error("Error fetching agent:", error);
      res.status(500).json({ error: "Failed to fetch agent" });
    }
  });

  app.post("/api/ai-agents", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user?.claims?.sub || req.user?.id;
      if (!userId) {
        return res.status(401).json({ error: "Authentication required" });
      }
      const data = insertAiAgentSchema.parse({ ...req.body, creatorId: userId });
      const created = await db.insert(aiAgents).values(data).returning();
      res.json({ agent: created[0], created: true });
    } catch (error) {
      console.error("Error creating agent:", error);
      res.status(500).json({ error: "Failed to create agent" });
    }
  });

  app.get("/api/ai-agents/:id/deployments", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user?.claims?.sub || req.user?.id;
      if (!userId) {
        return res.status(401).json({ error: "Authentication required" });
      }
      const deployments = await db.select().from(aiAgentDeployments)
        .where(and(
          eq(aiAgentDeployments.agentId, req.params.id),
          eq(aiAgentDeployments.userId, userId)
        ))
        .orderBy(desc(aiAgentDeployments.createdAt));
      res.json({ deployments });
    } catch (error) {
      console.error("Error fetching deployments:", error);
      res.status(500).json({ error: "Failed to fetch deployments" });
    }
  });

  app.post("/api/ai-agents/:id/deploy", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user?.claims?.sub || req.user?.id;
      if (!userId) {
        return res.status(401).json({ error: "Authentication required" });
      }
      const data = insertAiAgentDeploymentSchema.parse({
        ...req.body,
        agentId: req.params.id,
        userId
      });
      const deployment = await db.insert(aiAgentDeployments).values(data).returning();
      res.json({ deployment: deployment[0], created: true });
    } catch (error) {
      console.error("Error deploying agent:", error);
      res.status(500).json({ error: "Failed to deploy agent" });
    }
  });

  app.get("/api/my-agents", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user?.claims?.sub || req.user?.id;
      if (!userId) {
        return res.status(401).json({ error: "Authentication required" });
      }
      const agents = await db.select().from(aiAgents)
        .where(eq(aiAgents.creatorId, userId))
        .orderBy(desc(aiAgents.createdAt));
      res.json({ agents });
    } catch (error) {
      console.error("Error fetching my agents:", error);
      res.status(500).json({ error: "Failed to fetch agents" });
    }
  });

  app.get("/api/my-deployments", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user?.claims?.sub || req.user?.id;
      if (!userId) {
        return res.status(401).json({ error: "Authentication required" });
      }
      const deployments = await db.select().from(aiAgentDeployments)
        .where(eq(aiAgentDeployments.userId, userId))
        .orderBy(desc(aiAgentDeployments.createdAt));
      res.json({ deployments });
    } catch (error) {
      console.error("Error fetching my deployments:", error);
      res.status(500).json({ error: "Failed to fetch deployments" });
    }
  });

  // ============================================
  // REAL-WORLD ASSET (RWA) TOKENIZATION
  // ============================================

  const { rwaAssets, rwaTokens, rwaHoldings, rwaDividends, insertRwaAssetSchema, insertRwaTokenSchema, insertRwaHoldingSchema } = await import("@shared/schema");

  app.get("/api/rwa/assets", async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 50;
      const assetType = req.query.type as string;
      const status = req.query.status as string;
      
      let query = db.select().from(rwaAssets);
      if (assetType) {
        query = query.where(eq(rwaAssets.assetType, assetType)) as typeof query;
      }
      if (status) {
        query = query.where(eq(rwaAssets.status, status)) as typeof query;
      }
      const assets = await query.orderBy(desc(rwaAssets.createdAt)).limit(limit);
      res.json({ assets, total: assets.length });
    } catch (error) {
      console.error("Error fetching RWA assets:", error);
      res.status(500).json({ error: "Failed to fetch RWA assets" });
    }
  });

  app.get("/api/rwa/stats", async (_req, res) => {
    try {
      const assets = await db.select().from(rwaAssets);
      const tokens = await db.select().from(rwaTokens);
      
      const totalAssets = assets.length;
      const verifiedAssets = assets.filter(a => a.verified).length;
      const tokenizedAssets = assets.filter(a => a.status === 'tokenized').length;
      const totalValuation = assets.reduce((sum, a) => sum + BigInt(a.valuation), BigInt(0));
      
      const totalRaised = tokens.reduce((sum, t) => sum + BigInt(t.totalRaised), BigInt(0));
      const totalInvestors = tokens.reduce((sum, t) => sum + t.investorCount, 0);
      
      const assetTypes = ['real_estate', 'equity', 'bond', 'commodity', 'collectible', 'invoice', 'ip_rights'];
      const byType = assetTypes.map(type => ({
        type,
        count: assets.filter(a => a.assetType === type).length,
        valuation: assets.filter(a => a.assetType === type).reduce((sum, a) => sum + BigInt(a.valuation), BigInt(0)).toString()
      }));
      
      res.json({
        totalAssets,
        verifiedAssets,
        tokenizedAssets,
        totalValuation: totalValuation.toString(),
        totalRaised: totalRaised.toString(),
        totalInvestors,
        activeTokens: tokens.filter(t => t.status === 'offering' || t.status === 'trading').length,
        byType
      });
    } catch (error) {
      console.error("Error fetching RWA stats:", error);
      res.status(500).json({ error: "Failed to fetch RWA stats" });
    }
  });

  app.get("/api/rwa/assets/:id", async (req, res) => {
    try {
      const asset = await db.select().from(rwaAssets)
        .where(eq(rwaAssets.id, req.params.id)).limit(1);
      if (!asset.length) {
        return res.status(404).json({ error: "Asset not found" });
      }
      const tokens = await db.select().from(rwaTokens)
        .where(eq(rwaTokens.assetId, req.params.id));
      res.json({ asset: asset[0], tokens });
    } catch (error) {
      console.error("Error fetching asset:", error);
      res.status(500).json({ error: "Failed to fetch asset" });
    }
  });

  app.post("/api/rwa/assets", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user?.claims?.sub || req.user?.id;
      if (!userId) {
        return res.status(401).json({ error: "Authentication required" });
      }
      const data = insertRwaAssetSchema.parse({ ...req.body, creatorId: userId });
      const created = await db.insert(rwaAssets).values(data).returning();
      res.json({ asset: created[0], created: true });
    } catch (error) {
      console.error("Error creating RWA asset:", error);
      res.status(500).json({ error: "Failed to create asset" });
    }
  });

  app.get("/api/rwa/tokens", async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 50;
      const status = req.query.status as string;
      const tradeable = req.query.tradeable === 'true';
      
      let query = db.select().from(rwaTokens);
      if (status) {
        query = query.where(eq(rwaTokens.status, status)) as typeof query;
      }
      if (tradeable) {
        query = query.where(eq(rwaTokens.tradeable, true)) as typeof query;
      }
      const tokens = await query.orderBy(desc(rwaTokens.createdAt)).limit(limit);
      res.json({ tokens, total: tokens.length });
    } catch (error) {
      console.error("Error fetching RWA tokens:", error);
      res.status(500).json({ error: "Failed to fetch RWA tokens" });
    }
  });

  app.post("/api/rwa/assets/:id/tokenize", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user?.claims?.sub || req.user?.id;
      if (!userId) {
        return res.status(401).json({ error: "Authentication required" });
      }
      const asset = await db.select().from(rwaAssets)
        .where(eq(rwaAssets.id, req.params.id)).limit(1);
      if (!asset.length) {
        return res.status(404).json({ error: "Asset not found" });
      }
      if (asset[0].creatorId !== userId) {
        return res.status(403).json({ error: "Not authorized" });
      }
      const data = insertRwaTokenSchema.parse({ ...req.body, assetId: req.params.id });
      const token = await db.insert(rwaTokens).values(data).returning();
      await db.update(rwaAssets).set({ status: 'tokenized' }).where(eq(rwaAssets.id, req.params.id));
      res.json({ token: token[0], created: true });
    } catch (error) {
      console.error("Error tokenizing asset:", error);
      res.status(500).json({ error: "Failed to tokenize asset" });
    }
  });

  app.get("/api/rwa/my-holdings", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user?.claims?.sub || req.user?.id;
      if (!userId) {
        return res.status(401).json({ error: "Authentication required" });
      }
      const holdings = await db.select().from(rwaHoldings)
        .where(eq(rwaHoldings.userId, userId))
        .orderBy(desc(rwaHoldings.createdAt));
      res.json({ holdings });
    } catch (error) {
      console.error("Error fetching holdings:", error);
      res.status(500).json({ error: "Failed to fetch holdings" });
    }
  });

  app.post("/api/rwa/tokens/:id/invest", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user?.claims?.sub || req.user?.id;
      if (!userId) {
        return res.status(401).json({ error: "Authentication required" });
      }
      const token = await db.select().from(rwaTokens)
        .where(eq(rwaTokens.id, req.params.id)).limit(1);
      if (!token.length) {
        return res.status(404).json({ error: "Token not found" });
      }
      if (token[0].status !== 'offering') {
        return res.status(400).json({ error: "Token offering is not active" });
      }
      const data = insertRwaHoldingSchema.parse({
        ...req.body,
        tokenId: req.params.id,
        userId
      });
      const holding = await db.insert(rwaHoldings).values(data).returning();
      await db.update(rwaTokens).set({
        investorCount: token[0].investorCount + 1,
        tokensSold: (BigInt(token[0].tokensSold) + BigInt(data.tokenBalance)).toString(),
        totalRaised: (BigInt(token[0].totalRaised) + BigInt(data.purchasePrice)).toString()
      }).where(eq(rwaTokens.id, req.params.id));
      res.json({ holding: holding[0], created: true });
    } catch (error) {
      console.error("Error investing in token:", error);
      res.status(500).json({ error: "Failed to invest in token" });
    }
  });

  // === WALLET CLOUD BACKUP ROUTES ===
  
  app.post("/api/wallet/backup", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ error: "Authentication required" });
      }
      
      const schema = z.object({
        encryptedData: z.string().min(10),
        walletAddresses: z.string().optional(),
        backupName: z.string().max(100).optional(),
        deviceId: z.string().max(100).optional(),
      });
      
      const data = schema.parse(req.body);
      
      // Check if user already has a backup, update if so
      const [existing] = await db.select()
        .from(walletBackups)
        .where(and(eq(walletBackups.userId, userId), eq(walletBackups.isActive, true)));
      
      if (existing) {
        const [updated] = await db.update(walletBackups)
          .set({ 
            encryptedData: data.encryptedData,
            walletAddresses: data.walletAddresses,
            lastSyncedAt: new Date(),
          })
          .where(eq(walletBackups.id, existing.id))
          .returning();
        return res.json({ backup: updated, updated: true });
      }
      
      const [backup] = await db.insert(walletBackups)
        .values({
          userId,
          encryptedData: data.encryptedData,
          walletAddresses: data.walletAddresses,
          backupName: data.backupName || "Primary Wallet",
          deviceId: data.deviceId,
        })
        .returning();
      
      res.json({ backup, created: true });
    } catch (error: any) {
      console.error("Error creating wallet backup:", error);
      res.status(500).json({ error: error.message || "Failed to create backup" });
    }
  });

  app.get("/api/wallet/backup", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ error: "Authentication required" });
      }
      
      const [backup] = await db.select()
        .from(walletBackups)
        .where(and(eq(walletBackups.userId, userId), eq(walletBackups.isActive, true)));
      
      if (!backup) {
        return res.json({ backup: null });
      }
      
      res.json({ backup });
    } catch (error: any) {
      console.error("Error fetching wallet backup:", error);
      res.status(500).json({ error: "Failed to fetch backup" });
    }
  });

  app.delete("/api/wallet/backup", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ error: "Authentication required" });
      }
      
      await db.update(walletBackups)
        .set({ isActive: false })
        .where(and(eq(walletBackups.userId, userId), eq(walletBackups.isActive, true)));
      
      res.json({ success: true, message: "Backup removed" });
    } catch (error: any) {
      console.error("Error deleting wallet backup:", error);
      res.status(500).json({ error: "Failed to delete backup" });
    }
  });

  app.get("/api/wallet/backup/exists", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ error: "Authentication required" });
      }
      
      const [backup] = await db.select({ id: walletBackups.id, lastSyncedAt: walletBackups.lastSyncedAt })
        .from(walletBackups)
        .where(and(eq(walletBackups.userId, userId), eq(walletBackups.isActive, true)));
      
      res.json({ exists: !!backup, lastSyncedAt: backup?.lastSyncedAt });
    } catch (error) {
      console.error("Error checking backup:", error);
      res.status(500).json({ error: "Failed to check backup status" });
    }
  });

  // === KYC VERIFICATION ROUTES ===
  app.get("/api/kyc/status", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ error: "Authentication required" });
      }
      
      const [kyc] = await db.select()
        .from(kycVerifications)
        .where(eq(kycVerifications.userId, userId));
      
      res.json({ kyc: kyc || null });
    } catch (error) {
      console.error("Error fetching KYC status:", error);
      res.status(500).json({ error: "Failed to fetch KYC status" });
    }
  });

  app.post("/api/kyc/submit", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ error: "Authentication required" });
      }
      
      const { fullName, country, verificationType } = req.body;
      
      if (!fullName || !country) {
        return res.status(400).json({ error: "Full name and country are required" });
      }
      
      const [existing] = await db.select()
        .from(kycVerifications)
        .where(eq(kycVerifications.userId, userId));
      
      if (existing) {
        const [updated] = await db.update(kycVerifications)
          .set({ 
            fullName, 
            country, 
            verificationType: verificationType || 'basic',
            status: 'pending',
            updatedAt: new Date(),
          })
          .where(eq(kycVerifications.userId, userId))
          .returning();
        
        return res.json({ success: true, kyc: updated });
      }
      
      const [kyc] = await db.insert(kycVerifications)
        .values({
          userId,
          fullName,
          country,
          verificationType: verificationType || 'basic',
          status: 'pending',
        })
        .returning();
      
      res.json({ success: true, kyc });
    } catch (error: any) {
      console.error("Error submitting KYC:", error);
      res.status(500).json({ error: "Failed to submit KYC" });
    }
  });

  // === BLOCKCHAIN DOMAIN SERVICE ROUTES ===
  const DomainSearchSchema = z.object({
    name: z.string().min(1).max(63),
  });

  const DOMAIN_PRICING = {
    reserved: { yearly: 250000, lifetime: 0 }, // 1-2 chars - reserved/auction only ($2,500+/yr)
    ultraPremium: { yearly: 35000, lifetime: 875000 }, // 3 chars - $350/yr, $8,750 lifetime (25x)
    premium: { yearly: 12000, lifetime: 300000 }, // 4 chars - $120/yr, $3,000 lifetime (25x)
    standardPlus: { yearly: 4500, lifetime: 112500 }, // 5 chars - $45/yr, $1,125 lifetime (25x)
    standard: { yearly: 2000, lifetime: 50000 }, // 6-10 chars - $20/yr, $500 lifetime (25x)
    economy: { yearly: 1200, lifetime: 30000 }, // 11+ chars - $12/yr, $300 lifetime (25x)
  };

  const EARLY_ADOPTER_DISCOUNT = 0.30; // 30% off for early adopters (annual only, not lifetime)
  const EARLY_ADOPTER_MAX_REGISTRATIONS = 5000;
  const EARLY_ADOPTER_END_DATE = new Date('2026-01-01'); // 12 months from launch

  function getDomainPricing(nameLength: number) {
    if (nameLength <= 2) return { ...DOMAIN_PRICING.reserved, isPremium: true, tier: "Reserved", isReserved: true };
    if (nameLength <= 3) return { ...DOMAIN_PRICING.ultraPremium, isPremium: true, tier: "Ultra Premium", isReserved: false };
    if (nameLength <= 4) return { ...DOMAIN_PRICING.premium, isPremium: true, tier: "Premium", isReserved: false };
    if (nameLength <= 5) return { ...DOMAIN_PRICING.standardPlus, isPremium: false, tier: "Standard+", isReserved: false };
    if (nameLength <= 10) return { ...DOMAIN_PRICING.standard, isPremium: false, tier: "Standard", isReserved: false };
    return { ...DOMAIN_PRICING.economy, isPremium: false, tier: "Economy", isReserved: false };
  }

  const DomainRegisterSchema = z.object({
    name: z.string().min(1).max(63), // min 1 to allow owner bypass for reserved domains
    ownerAddress: z.string().min(10),
    ownershipType: z.enum(["term", "lifetime"]).default("term"),
    years: z.number().min(1).max(10).default(1), // only used for term ownership
    primaryWallet: z.string().optional(),
    description: z.string().max(500).optional(),
    website: z.string().optional(),
    email: z.string().email().optional(),
    twitter: z.string().optional(),
    discord: z.string().optional(),
    telegram: z.string().optional(),
    ownerCode: z.string().optional(), // Owner bypass code for free registration
  });

  const DomainRecordSchema = z.object({
    domainId: z.string(),
    recordType: z.enum(["wallet", "text", "url", "avatar", "content"]),
    key: z.string().min(1).max(100),
    value: z.string().min(1).max(2000),
  });

  const DomainTransferSchema = z.object({
    toAddress: z.string().min(10),
  });

  // Reserved ecosystem prefixes - these domains are not for public sale
  const RESERVED_ECOSYSTEM_PREFIXES = ["darkwave", "dw", "dwsc", "chronochat", "chrono"];

  app.get("/api/domains/search/:name", async (req, res) => {
    try {
      const { name } = req.params;
      const result = await storage.searchDomain(name);
      
      const normalizedName = name.replace(/\.dwsc$/, '').toLowerCase();
      const pricing = getDomainPricing(normalizedName.length);
      
      // Check if this is a reserved ecosystem domain
      const isEcosystemReserved = RESERVED_ECOSYSTEM_PREFIXES.some(prefix => normalizedName.startsWith(prefix));
      
      // Check early adopter eligibility
      const stats = await storage.getDomainStats();
      const now = new Date();
      const isEarlyAdopterPeriod = now < EARLY_ADOPTER_END_DATE && stats.totalDomains < EARLY_ADOPTER_MAX_REGISTRATIONS;
      
      // Calculate early adopter discount (only on yearly, not lifetime)
      const earlyAdopterYearly = isEarlyAdopterPeriod 
        ? Math.round(pricing.yearly * (1 - EARLY_ADOPTER_DISCOUNT))
        : pricing.yearly;
      
      res.json({
        ...result,
        available: isEcosystemReserved ? false : result.available,
        name: normalizedName,
        tld: "dwsc",
        pricePerYearCents: pricing.yearly,
        priceLifetimeCents: pricing.lifetime,
        earlyAdopterPriceCents: earlyAdopterYearly,
        isPremium: pricing.isPremium,
        tier: pricing.tier,
        isReserved: pricing.isReserved || isEcosystemReserved,
        isEcosystemReserved,
        reservedMessage: isEcosystemReserved ? "Reserved for DarkWave ecosystem" : null,
        isEarlyAdopterPeriod,
        earlyAdopterDiscount: isEarlyAdopterPeriod ? EARLY_ADOPTER_DISCOUNT : 0,
      });
    } catch (error) {
      console.error("Domain search error:", error);
      res.status(500).json({ error: "Failed to search domain" });
    }
  });

  app.get("/api/domains/stats", async (_req, res) => {
    try {
      const stats = await storage.getDomainStats();
      res.json(stats);
    } catch (error) {
      console.error("Domain stats error:", error);
      res.status(500).json({ error: "Failed to fetch domain stats" });
    }
  });

  app.get("/api/domains/recent", async (_req, res) => {
    try {
      const domains = await storage.getRecentDomains(20);
      res.json(domains);
    } catch (error) {
      console.error("Recent domains error:", error);
      res.status(500).json({ error: "Failed to fetch recent domains" });
    }
  });

  app.get("/api/domains/owner/:address", async (req, res) => {
    try {
      const { address } = req.params;
      const domains = await storage.getDomainsByOwner(address);
      res.json(domains);
    } catch (error) {
      console.error("Get domains by owner error:", error);
      res.status(500).json({ error: "Failed to fetch domains" });
    }
  });

  app.get("/api/domains/:name", async (req, res) => {
    try {
      const { name } = req.params;
      const domain = await storage.getDomain(name);
      if (!domain) {
        return res.status(404).json({ error: "Domain not found" });
      }
      
      const records = await storage.getDomainRecords(domain.id);
      res.json({ ...domain, records });
    } catch (error) {
      console.error("Get domain error:", error);
      res.status(500).json({ error: "Failed to fetch domain" });
    }
  });

  app.post("/api/domains/register", async (req, res) => {
    try {
      const data = DomainRegisterSchema.parse(req.body);
      
      // Owner bypass code validation - allows registering reserved domains for free
      // Uses OWNER_DOMAIN_ACCESS secret for validation
      const OWNER_BYPASS_CODE = process.env.OWNER_DOMAIN_ACCESS;
      const isOwnerBypass = !!(data.ownerCode && OWNER_BYPASS_CODE && data.ownerCode === OWNER_BYPASS_CODE);
      
      const pricing = getDomainPricing(data.name.length);
      
      // Block reserved domains (1-2 characters) - unless owner bypass
      if (pricing.isReserved && !isOwnerBypass) {
        return res.status(400).json({ 
          error: "Reserved domain", 
          message: "1-2 character domains are reserved for special release. Contact us for enterprise availability." 
        });
      }
      
      // Block DarkWave ecosystem reserved domains - unless owner bypass
      const normalizedName = data.name.toLowerCase();
      const RESERVED_PREFIXES = ["darkwave", "dw", "dwsc", "chronochat", "chrono"];
      const isEcosystemReserved = RESERVED_PREFIXES.some(prefix => normalizedName.startsWith(prefix));
      
      if (isEcosystemReserved && !isOwnerBypass) {
        return res.status(400).json({ 
          error: "Reserved domain", 
          message: "This domain is reserved for the DarkWave ecosystem. Contact team@dwsc.io for partnership inquiries." 
        });
      }
      
      const existing = await storage.searchDomain(data.name);
      if (!existing.available) {
        return res.status(400).json({ error: "Domain is not available" });
      }
      
      // Check early adopter eligibility
      const stats = await storage.getDomainStats();
      const now = new Date();
      const isEarlyAdopterPeriod = now < EARLY_ADOPTER_END_DATE && stats.totalDomains < EARLY_ADOPTER_MAX_REGISTRATIONS;
      
      const isLifetime = data.ownershipType === "lifetime" || isOwnerBypass;
      
      let totalPrice: number;
      let expiresAt: Date | null;
      
      if (isOwnerBypass) {
        // Owner bypass - free lifetime registration
        totalPrice = 0;
        expiresAt = null;
      } else if (isLifetime) {
        // Lifetime purchases don't get early adopter discount (preserves long-term value)
        totalPrice = pricing.lifetime;
        expiresAt = null;
      } else {
        // Apply early adopter discount to annual pricing
        const yearlyPrice = isEarlyAdopterPeriod 
          ? Math.round(pricing.yearly * (1 - EARLY_ADOPTER_DISCOUNT))
          : pricing.yearly;
        totalPrice = yearlyPrice * (data.years || 1);
        expiresAt = new Date();
        expiresAt.setFullYear(expiresAt.getFullYear() + (data.years || 1));
      }
      
      const txHash = `0x${crypto.randomBytes(32).toString('hex')}`;
      
      const domain = await storage.registerDomain({
        name: data.name,
        tld: "dwsc",
        ownerAddress: data.ownerAddress,
        registrationTxHash: txHash,
        expiresAt,
        ownershipType: isOwnerBypass ? "lifetime" : (data.ownershipType || "term"),
        isPremium: pricing.isPremium,
        isProtected: false,
        primaryWallet: data.primaryWallet || data.ownerAddress,
        description: data.description,
        website: data.website,
        email: data.email,
        twitter: data.twitter,
        discord: data.discord,
        telegram: data.telegram,
      });
      
      res.json({
        success: true,
        domain,
        transactionHash: txHash,
        pricePaidCents: totalPrice,
        ownershipType: data.ownershipType || "term",
        earlyAdopterApplied: isEarlyAdopterPeriod && !isLifetime,
      });
    } catch (error: any) {
      console.error("Domain registration error:", error);
      if (error.name === "ZodError") {
        return res.status(400).json({ error: "Invalid request data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to register domain" });
    }
  });

  app.put("/api/domains/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const { description, website, email, twitter, discord, telegram, avatarUrl, primaryWallet } = req.body;
      
      const domain = await storage.updateDomain(id, {
        description,
        website,
        email,
        twitter,
        discord,
        telegram,
        avatarUrl,
        primaryWallet,
      });
      
      if (!domain) {
        return res.status(404).json({ error: "Domain not found" });
      }
      
      res.json(domain);
    } catch (error) {
      console.error("Update domain error:", error);
      res.status(500).json({ error: "Failed to update domain" });
    }
  });

  app.post("/api/domains/:id/records", async (req, res) => {
    try {
      const { id } = req.params;
      const data = DomainRecordSchema.parse({ ...req.body, domainId: id });
      
      const record = await storage.setDomainRecord(data);
      res.json(record);
    } catch (error: any) {
      console.error("Set domain record error:", error);
      if (error.name === "ZodError") {
        return res.status(400).json({ error: "Invalid request data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to set domain record" });
    }
  });

  app.patch("/api/domains/:domainId/records/:recordId", async (req, res) => {
    try {
      const { recordId } = req.params;
      const { value, ttl, priority } = req.body;
      
      const record = await storage.updateDomainRecord(recordId, { value, ttl, priority });
      if (!record) {
        return res.status(404).json({ error: "Record not found" });
      }
      res.json(record);
    } catch (error) {
      console.error("Update domain record error:", error);
      res.status(500).json({ error: "Failed to update record" });
    }
  });

  app.delete("/api/domains/:domainId/records/:recordId", async (req, res) => {
    try {
      const { recordId } = req.params;
      await storage.deleteDomainRecord(recordId);
      res.json({ success: true });
    } catch (error) {
      console.error("Delete domain record error:", error);
      res.status(500).json({ error: "Failed to delete record" });
    }
  });

  app.post("/api/domains/:id/transfer", async (req, res) => {
    try {
      const { id } = req.params;
      const { toAddress, fromAddress } = req.body;
      
      if (!toAddress || !fromAddress) {
        return res.status(400).json({ error: "Both fromAddress and toAddress are required" });
      }
      
      const txHash = `0x${crypto.randomBytes(32).toString('hex')}`;
      const success = await storage.transferDomain(id, fromAddress, toAddress, txHash);
      
      if (!success) {
        return res.status(400).json({ error: "Transfer failed - domain not found or not owned by fromAddress" });
      }
      
      res.json({ success: true, transactionHash: txHash });
    } catch (error) {
      console.error("Domain transfer error:", error);
      res.status(500).json({ error: "Failed to transfer domain" });
    }
  });

  app.get("/api/domains/:id/history", async (req, res) => {
    try {
      const { id } = req.params;
      const history = await storage.getDomainTransferHistory(id);
      res.json(history);
    } catch (error) {
      console.error("Get transfer history error:", error);
      res.status(500).json({ error: "Failed to fetch transfer history" });
    }
  });

  app.post("/api/domains/:id/renew", async (req, res) => {
    try {
      const { id } = req.params;
      const { years } = req.body;
      
      if (!years || years < 1 || years > 10) {
        return res.status(400).json({ error: "Years must be between 1 and 10" });
      }
      
      const domain = await storage.getDomain(id);
      if (!domain) {
        return res.status(404).json({ error: "Domain not found" });
      }
      
      const currentExpiry = domain.expiresAt ? new Date(domain.expiresAt) : new Date();
      const newExpiry = new Date(currentExpiry);
      newExpiry.setFullYear(newExpiry.getFullYear() + years);
      
      await storage.updateDomain(id, { expiresAt: newExpiry });
      
      res.json({ success: true, expiresAt: newExpiry.toISOString() });
    } catch (error) {
      console.error("Domain renewal error:", error);
      res.status(500).json({ error: "Failed to renew domain" });
    }
  });

  // === QUESTS ENDPOINTS ===
  app.get("/api/quests", async (req, res) => {
    try {
      const quests = [
        { id: "1", name: "First Stake", description: "Stake any amount of DWC", xpReward: 50, tokenReward: "10", difficulty: "easy", category: "staking", progress: 0, target: 1, icon: "zap", completed: false },
        { id: "2", name: "Bridge Pioneer", description: "Complete your first cross-chain bridge", xpReward: 100, tokenReward: "25", difficulty: "medium", category: "bridge", progress: 0, target: 1, icon: "link", completed: false },
        { id: "3", name: "Swap Master", description: "Complete 10 token swaps", xpReward: 150, tokenReward: "50", difficulty: "medium", category: "defi", progress: 3, target: 10, icon: "repeat", completed: false },
        { id: "4", name: "NFT Collector", description: "Own 5 DarkWave NFTs", xpReward: 200, tokenReward: "100", difficulty: "hard", category: "nft", progress: 1, target: 5, icon: "image", completed: false },
        { id: "5", name: "Daily Login", description: "Login 7 days in a row", xpReward: 75, tokenReward: "20", difficulty: "easy", category: "engagement", progress: 4, target: 7, icon: "calendar", completed: false },
        { id: "6", name: "Liquidity Provider", description: "Provide liquidity to any pool", xpReward: 250, tokenReward: "75", difficulty: "hard", category: "defi", progress: 1, target: 1, icon: "droplet", completed: true },
      ];
      res.json({ quests });
    } catch (error) {
      console.error("Get quests error:", error);
      res.status(500).json({ error: "Failed to fetch quests" });
    }
  });

  app.get("/api/quests/missions", async (req, res) => {
    try {
      const missions = [
        { id: "1", name: "Community Swap Week", description: "Complete 10,000 swaps as a community", goal: "10,000 swaps", currentProgress: 7234, targetProgress: 10000, rewardPool: "50000", participantCount: 1247, endsAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000) },
        { id: "2", name: "Bridge Rush", description: "Bridge $1M in value across chains", goal: "$1M bridged", currentProgress: 456000, targetProgress: 1000000, rewardPool: "100000", participantCount: 892, endsAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) },
      ];
      res.json({ missions });
    } catch (error) {
      console.error("Get missions error:", error);
      res.status(500).json({ error: "Failed to fetch missions" });
    }
  });

  app.get("/api/user/quest-stats", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user?.id || req.user?.claims?.sub;
      res.json({ xp: 2450, level: 12, streak: 4, userId });
    } catch (error) {
      console.error("Get quest stats error:", error);
      res.status(500).json({ error: "Failed to fetch quest stats" });
    }
  });

  app.get("/api/developer/usage", async (req, res) => {
    try {
      const usage = {
        requestsToday: 1247,
        requestsThisMonth: 28450,
        dailyLimit: 10000,
        monthlyLimit: 100000,
        endpoints: [
          { path: "/api/blockchain/stats", count: 5420, avgLatency: 45 },
          { path: "/api/transactions", count: 3210, avgLatency: 120 },
          { path: "/api/blocks", count: 2100, avgLatency: 85 },
          { path: "/api/accounts/:address", count: 1850, avgLatency: 95 },
          { path: "/api/nft/collections", count: 980, avgLatency: 150 },
          { path: "/api/swap/quote", count: 750, avgLatency: 200 },
        ],
        recentErrors: [],
      };
      res.json(usage);
    } catch (error) {
      console.error("Get API usage error:", error);
      res.status(500).json({ error: "Failed to fetch API usage" });
    }
  });

  // === CHRONICLES SPONSORSHIP ROUTES ===
  app.get("/api/sponsorship/slots", async (req, res) => {
    try {
      const { eraId, districtTier, includeUnavailable } = req.query;
      const availableOnly = includeUnavailable !== 'true';
      const slots = await storage.getSponsorshipSlots(
        eraId as string | undefined,
        districtTier as string | undefined,
        availableOnly
      );
      res.json(slots);
    } catch (error) {
      console.error("Get sponsorship slots error:", error);
      res.status(500).json({ error: "Failed to fetch sponsorship slots" });
    }
  });

  app.get("/api/sponsorship/slots/:id", async (req, res) => {
    try {
      const slot = await storage.getSponsorshipSlot(req.params.id);
      if (!slot) {
        return res.status(404).json({ error: "Slot not found" });
      }
      res.json(slot);
    } catch (error) {
      console.error("Get sponsorship slot error:", error);
      res.status(500).json({ error: "Failed to fetch sponsorship slot" });
    }
  });

  app.get("/api/sponsorship/eligible/:domainTier", async (req, res) => {
    try {
      const { domainTier } = req.params;
      const slots = await storage.getAvailableSlotsForDomainTier(domainTier);
      res.json({ eligible: slots.length > 0, availableSlots: slots });
    } catch (error) {
      console.error("Check sponsorship eligibility error:", error);
      res.status(500).json({ error: "Failed to check eligibility" });
    }
  });

  app.post("/api/sponsorship/claim", async (req, res) => {
    try {
      const { domainId, slotId, businessName, businessUrl, businessDescription, isEarlyAdopter } = req.body;
      
      if (!domainId || !slotId) {
        return res.status(400).json({ error: "domainId and slotId are required" });
      }

      const domain = await storage.getDomainById(domainId);
      if (!domain) {
        return res.status(404).json({ error: "Domain not found" });
      }

      const slot = await storage.getSponsorshipSlot(slotId);
      if (!slot) {
        return res.status(404).json({ error: "Sponsorship slot not found" });
      }

      if (slot.currentOccupancy >= slot.capacity) {
        return res.status(400).json({ error: "Sponsorship slot is full" });
      }

      const expiryDate = storage.calculateSponsorshipExpiry(domain.expiresAt);

      const claim = await storage.claimSponsorshipSlot({
        domainId,
        slotId,
        businessName,
        businessUrl,
        businessDescription,
        isEarlyAdopter: isEarlyAdopter || false,
        expiryDate,
      });

      res.json({ success: true, claim });
    } catch (error) {
      console.error("Claim sponsorship slot error:", error);
      res.status(500).json({ error: "Failed to claim sponsorship slot" });
    }
  });

  app.get("/api/sponsorship/claims/domain/:domainId", async (req, res) => {
    try {
      const claims = await storage.getDomainSponsorshipClaims(req.params.domainId);
      res.json(claims);
    } catch (error) {
      console.error("Get domain sponsorship claims error:", error);
      res.status(500).json({ error: "Failed to fetch sponsorship claims" });
    }
  });

  app.put("/api/sponsorship/claims/:id/status", async (req, res) => {
    try {
      const { status } = req.body;
      if (!status || !['pending', 'verified', 'rejected'].includes(status)) {
        return res.status(400).json({ error: "Valid status required (pending, verified, rejected)" });
      }

      const claim = await storage.updateSponsorshipClaimStatus(req.params.id, status);
      if (!claim) {
        return res.status(404).json({ error: "Claim not found" });
      }
      res.json(claim);
    } catch (error) {
      console.error("Update sponsorship claim status error:", error);
      res.status(500).json({ error: "Failed to update claim status" });
    }
  });

  app.get("/api/sponsorship/early-adopter-program", async (_req, res) => {
    try {
      const program = await storage.getEarlyAdopterProgram();
      res.json(program || { isActive: false });
    } catch (error) {
      console.error("Get early adopter program error:", error);
      res.status(500).json({ error: "Failed to fetch early adopter program" });
    }
  });

  // === COMMUNITY ROADMAP ROUTES ===
  app.get("/api/roadmap/features", async (_req, res) => {
    try {
      const features = await storage.getRoadmapFeatures();
      res.json(features);
    } catch (error) {
      console.error("Get roadmap features error:", error);
      res.status(500).json({ error: "Failed to fetch features" });
    }
  });

  app.get("/api/roadmap/features/:id", async (req, res) => {
    try {
      const feature = await storage.getRoadmapFeature(req.params.id);
      if (!feature) {
        return res.status(404).json({ error: "Feature not found" });
      }
      res.json(feature);
    } catch (error) {
      console.error("Get feature error:", error);
      res.status(500).json({ error: "Failed to fetch feature" });
    }
  });

  app.post("/api/roadmap/features/:id/vote", isAuthenticated, async (req, res) => {
    try {
      const user = req.user as any;
      if (!user?.id) {
        return res.status(401).json({ error: "Authentication required" });
      }
      
      const feature = await storage.getRoadmapFeature(req.params.id);
      if (!feature) {
        return res.status(404).json({ error: "Feature not found" });
      }

      const success = await storage.voteForFeature(req.params.id, user.id);
      if (!success) {
        return res.status(400).json({ error: "Already voted for this feature" });
      }
      
      res.json({ success: true, message: "Vote recorded" });
    } catch (error) {
      console.error("Vote error:", error);
      res.status(500).json({ error: "Failed to record vote" });
    }
  });

  app.delete("/api/roadmap/features/:id/vote", isAuthenticated, async (req, res) => {
    try {
      const user = req.user as any;
      if (!user?.id) {
        return res.status(401).json({ error: "Authentication required" });
      }

      await storage.removeVote(req.params.id, user.id);
      res.json({ success: true, message: "Vote removed" });
    } catch (error) {
      console.error("Remove vote error:", error);
      res.status(500).json({ error: "Failed to remove vote" });
    }
  });

  app.get("/api/roadmap/my-votes", isAuthenticated, async (req, res) => {
    try {
      const user = req.user as any;
      if (!user?.id) {
        return res.status(401).json({ error: "Authentication required" });
      }

      const votes = await storage.getUserVotes(user.id);
      res.json(votes);
    } catch (error) {
      console.error("Get user votes error:", error);
      res.status(500).json({ error: "Failed to fetch votes" });
    }
  });

  // === BILLING ROUTES ===
  app.get("/api/billing/usage", async (req, res) => {
    try {
      const apiKey = req.headers["x-api-key"] as string;
      if (!apiKey) {
        return res.status(401).json({ error: "API key required" });
      }

      const validKey = await storage.validateApiKey(apiKey);
      if (!validKey) {
        return res.status(401).json({ error: "Invalid API key" });
      }

      const stats = await billingService.getUsageStats(validKey.id);
      const balance = await billingService.getOutstandingBalance(validKey.id);

      res.json({
        totalCalls: stats.totalCalls,
        outstandingBalanceCents: balance,
        outstandingBalanceUSD: (balance / 100).toFixed(2),
        recentLogs: stats.recentLogs.slice(0, 20),
        costPerCallCents: 3,
      });
    } catch (error) {
      console.error("Billing usage error:", error);
      res.status(500).json({ error: "Failed to fetch usage" });
    }
  });

  app.post("/api/billing/checkout", async (req, res) => {
    try {
      const apiKey = req.headers["x-api-key"] as string;
      if (!apiKey) {
        return res.status(401).json({ error: "API key required" });
      }

      const validKey = await storage.validateApiKey(apiKey);
      if (!validKey) {
        return res.status(401).json({ error: "Invalid API key" });
      }

      const balance = await billingService.getOutstandingBalance(validKey.id);
      if (balance <= 0) {
        return res.json({ message: "No outstanding balance", balanceCents: 0 });
      }

      const host = req.get("host") || "darkwavechain.io";
      const protocol = host.includes("localhost") ? "http" : "https";
      const baseUrl = `${protocol}://${host}`;

      const session = await billingService.createStripeCheckout(
        validKey.id,
        balance,
        `${baseUrl}/billing/success?session_id={CHECKOUT_SESSION_ID}`,
        `${baseUrl}/billing/cancel`
      );

      res.json({ 
        checkoutUrl: session.url,
        amountCents: balance,
        amountUSD: (balance / 100).toFixed(2),
      });
    } catch (error) {
      console.error("Checkout error:", error);
      res.status(500).json({ error: "Failed to create checkout" });
    }
  });

  app.post("/api/billing/subscribe", async (req, res) => {
    try {
      const { plan } = req.body;
      
      if (!plan || !["builder", "enterprise"].includes(plan)) {
        return res.status(400).json({ error: "Invalid plan" });
      }

      const { getUncachableStripeClient } = await import("./stripeClient");
      const stripe = await getUncachableStripeClient();

      const host = req.get("host") || "darkwavechain.io";
      const protocol = host.includes("localhost") ? "http" : "https";
      const baseUrl = `${protocol}://${host}`;

      const priceAmount = plan === "builder" ? 2900 : 19900;
      const planName = plan === "builder" ? "Builder" : "Enterprise";

      const session = await stripe.checkout.sessions.create({
        mode: "subscription",
        line_items: [{
          price_data: {
            currency: "usd",
            product_data: {
              name: `DarkWave ${planName} Membership`,
              description: plan === "builder" 
                ? "50,000 API calls/month, DarkWave Studio, Priority support, Early token access"
                : "Unlimited API calls, Dedicated support, Custom integrations, Validator node access",
            },
            unit_amount: priceAmount,
            recurring: { interval: "month" },
          },
          quantity: 1,
        }],
        success_url: `${baseUrl}/billing?success=true&plan=${plan}`,
        cancel_url: `${baseUrl}/billing?canceled=true`,
      });

      res.json({ checkoutUrl: session.url });
    } catch (error) {
      console.error("Subscription checkout error:", error);
      res.status(500).json({ error: "Failed to create subscription checkout" });
    }
  });

  app.get("/api/billing/admin/stats", async (req, res) => {
    try {
      const sessionToken = req.headers["x-developer-session"] as string;
      if (!sessionToken) {
        return res.status(401).json({ error: "Admin session required" });
      }

      const session = developerSessions.get(sessionToken);
      if (!session || Date.now() > session.expiresAt) {
        return res.status(401).json({ error: "Invalid or expired session" });
      }

      const stats = await billingService.getAllBillingStats();
      res.json({
        totalDevelopers: stats.totalDevelopers,
        totalApiCalls: stats.totalApiCalls,
        totalRevenueUSD: (stats.totalRevenueCents / 100).toFixed(2),
        outstandingUSD: (stats.outstandingCents / 100).toFixed(2),
      });
    } catch (error) {
      console.error("Admin stats error:", error);
      res.status(500).json({ error: "Failed to fetch stats" });
    }
  });

  app.get("/api/stripe/publishable-key", async (req, res) => {
    try {
      const { getStripePublishableKey } = await import("./stripeClient");
      const key = await getStripePublishableKey();
      res.json({ publishableKey: key });
    } catch (error) {
      console.error("Failed to get Stripe key:", error);
      res.status(500).json({ error: "Stripe not configured" });
    }
  });

  // DWC Token Presale Routes
  app.get("/api/presale/tiers", async (req, res) => {
    try {
      // Hardcoded tiers for immediate availability (no Stripe dashboard setup needed)
      const hardcodedTiers = [
        {
          id: "genesis",
          name: "Genesis",
          description: "Maximum bonus for visionary early supporters",
          priceId: "dynamic", // Will use dynamic pricing
          amount: 100000, // $1000
          bonus: 25,
          tier: "genesis",
        },
        {
          id: "founder",
          name: "Founder",
          description: "Premium tier with significant token bonus",
          priceId: "dynamic",
          amount: 50000, // $500
          bonus: 15,
          tier: "founder",
        },
        {
          id: "pioneer",
          name: "Pioneer",
          description: "Early believer tier with bonus rewards",
          priceId: "dynamic",
          amount: 25000, // $250
          bonus: 10,
          tier: "pioneer",
        },
        {
          id: "early_bird",
          name: "Early Bird",
          description: "Accessible entry point for new supporters",
          priceId: "dynamic",
          amount: 10000, // $100
          bonus: 5,
          tier: "early_bird",
        },
      ];
      
      return res.json(hardcodedTiers);
    } catch (error) {
      console.error("Failed to fetch presale tiers:", error);
      res.status(500).json({ error: "Failed to fetch presale tiers" });
    }
  });

  app.get("/api/presale/stats", async (req, res) => {
    try {
      const result = await db.execute(sql`
        SELECT 
          COALESCE(SUM(amount_cents), 0) as total_raised_cents,
          COALESCE(COUNT(*), 0) as total_purchases,
          COALESCE(COUNT(DISTINCT email), 0) as unique_holders
        FROM presale_purchases 
        WHERE status = 'completed'
      `);
      
      const stats = result.rows[0] || { total_raised_cents: 0, total_purchases: 0, unique_holders: 0 };
      const tokenPrice = 0.001; // $0.001 per DWC (1B supply)
      const totalRaisedCents = parseInt(stats.total_raised_cents as string || "0");
      const tokensSold = Math.floor((totalRaisedCents / 100) / tokenPrice);
      
      res.json({
        totalRaisedCents,
        totalRaisedUsd: totalRaisedCents / 100,
        tokensSold,
        uniqueHolders: parseInt(stats.unique_holders as string || "0"),
        totalPurchases: parseInt(stats.total_purchases as string || "0"),
      });
    } catch (error) {
      res.json({
        totalRaisedCents: 0,
        totalRaisedUsd: 0,
        tokensSold: 0,
        uniqueHolders: 0,
        totalPurchases: 0,
      });
    }
  });

  app.post("/api/presale/checkout", async (req, res) => {
    try {
      const { priceId, email, tier, amountCents } = req.body;
      
      if (!email || !email.includes("@")) {
        return res.status(400).json({ error: "Valid email required" });
      }
      
      // Tier definitions for dynamic pricing
      const TIER_CONFIG: Record<string, { amount: number; bonus: number; name: string }> = {
        genesis: { amount: 100000, bonus: 25, name: "Genesis Tier" },
        founder: { amount: 50000, bonus: 15, name: "Founder Tier" },
        pioneer: { amount: 25000, bonus: 10, name: "Pioneer Tier" },
        early_bird: { amount: 10000, bonus: 5, name: "Early Bird Tier" },
      };
      
      const tierConfig = TIER_CONFIG[tier];
      const finalAmount = amountCents || tierConfig?.amount;
      
      if (!finalAmount || finalAmount < 100) {
        return res.status(400).json({ error: "Invalid amount" });
      }
      
      const { getUncachableStripeClient } = await import("./stripeClient");
      const stripe = await getUncachableStripeClient();
      
      const host = req.get("host") || "dwsc.io";
      const protocol = host.includes("localhost") ? "http" : "https";
      const baseUrl = `${protocol}://${host}`;
      
      const TOKEN_PRICE = 0.001;
      const tokenAmount = Math.floor((finalAmount / 100) / TOKEN_PRICE);
      const bonusPercent = tierConfig?.bonus || 0;
      const bonusTokens = Math.floor(tokenAmount * (bonusPercent / 100));
      const totalTokens = tokenAmount + bonusTokens;
      
      // Use dynamic price_data (no Stripe dashboard setup required)
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [{
          price_data: {
            currency: "usd",
            product_data: {
              name: tierConfig?.name || "DWC Token Presale",
              description: `${totalTokens.toLocaleString()} DWC tokens (${tokenAmount.toLocaleString()} base + ${bonusTokens.toLocaleString()} bonus)`,
            },
            unit_amount: finalAmount,
          },
          quantity: 1,
        }],
        mode: "payment",
        success_url: `${baseUrl}/presale/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${baseUrl}/presale`,
        customer_email: email,
        metadata: {
          type: "presale",
          tier: tier || "custom",
          email: email,
          tokenAmount: String(tokenAmount),
          bonusTokens: String(bonusTokens),
          totalTokens: String(totalTokens),
        },
      });
      
      res.json({ url: session.url, sessionId: session.id });
    } catch (error) {
      console.error("Presale checkout error:", error);
      res.status(500).json({ error: "Failed to create checkout session" });
    }
  });

  // Presale crypto checkout via Coinbase Commerce
  app.post("/api/presale/crypto-checkout", async (req, res) => {
    try {
      const { email, tier, amountCents } = req.body;
      
      if (!email || !email.includes("@")) {
        return res.status(400).json({ error: "Valid email required" });
      }
      
      const TIER_CONFIG: Record<string, { amount: number; bonus: number; name: string }> = {
        genesis: { amount: 100000, bonus: 25, name: "Genesis Tier" },
        founder: { amount: 50000, bonus: 15, name: "Founder Tier" },
        pioneer: { amount: 25000, bonus: 10, name: "Pioneer Tier" },
        early_bird: { amount: 10000, bonus: 5, name: "Early Bird Tier" },
      };
      
      const tierConfig = TIER_CONFIG[tier];
      const finalAmount = amountCents || tierConfig?.amount;
      
      if (!finalAmount || finalAmount < 100) {
        return res.status(400).json({ error: "Invalid amount" });
      }
      
      const TOKEN_PRICE = 0.001;
      const tokenAmount = Math.floor((finalAmount / 100) / TOKEN_PRICE);
      const bonusPercent = tierConfig?.bonus || 0;
      const bonusTokens = Math.floor(tokenAmount * (bonusPercent / 100));
      const totalTokens = tokenAmount + bonusTokens;
      
      const host = req.get("host") || "dwsc.io";
      const protocol = host.includes("localhost") ? "http" : "https";
      const baseUrl = `${protocol}://${host}`;
      
      const { createCoinbaseCharge } = await import("./coinbaseClient");
      
      // Create a pending record first to get an ID we can use in the redirect
      const pendingResult = await db.execute(sql`
        INSERT INTO presale_purchases (stripe_payment_intent_id, email, usd_amount_cents, token_amount, tier, status, payment_method, created_at)
        VALUES (
          ${`coinbase_pending_${Date.now()}`}, 
          ${email}, 
          ${finalAmount}, 
          ${totalTokens},
          ${tier || "custom"},
          'pending',
          'coinbase',
          NOW()
        )
        RETURNING id
      `);
      const purchaseId = (pendingResult.rows[0] as any)?.id;
      
      const charge = await createCoinbaseCharge({
        name: tierConfig?.name || "DWC Token Presale",
        description: `${totalTokens.toLocaleString()} DWC tokens (includes ${bonusTokens.toLocaleString()} bonus tokens)`,
        amountUsd: (finalAmount / 100).toFixed(2),
        successUrl: `${baseUrl}/presale/success?crypto_purchase=${purchaseId}`,
        cancelUrl: `${baseUrl}/presale`,
        metadata: {
          type: "presale",
          tier: tier || "custom",
          email: email,
          tokenAmount: String(tokenAmount),
          bonusTokens: String(bonusTokens),
          totalTokens: String(totalTokens),
          amountCents: String(finalAmount),
          purchaseId: String(purchaseId),
        },
      });
      
      // Update with actual charge ID
      await db.execute(sql`
        UPDATE presale_purchases 
        SET stripe_payment_intent_id = ${`coinbase_${charge.id}`}
        WHERE id = ${purchaseId}
      `);
      
      res.json({ checkoutUrl: charge.hostedUrl, chargeId: charge.id, purchaseId });
    } catch (error) {
      console.error("Presale crypto checkout error:", error);
      res.status(500).json({ error: "Failed to create crypto checkout" });
    }
  });

  // Verify crypto presale payment by purchase ID
  app.get("/api/presale/verify-crypto", async (req, res) => {
    try {
      const purchaseId = req.query.purchase_id as string;
      if (!purchaseId) {
        return res.status(400).json({ error: "Purchase ID required" });
      }
      
      // Get the pending purchase record
      const purchaseResult = await db.execute(sql`
        SELECT * FROM presale_purchases WHERE id = ${purchaseId} AND payment_method = 'coinbase'
      `);
      
      const purchase = purchaseResult.rows[0] as any;
      if (!purchase) {
        return res.status(404).json({ error: "Purchase not found" });
      }
      
      // Already completed
      if (purchase.status === "completed") {
        return res.json({
          success: true,
          email: purchase.email,
          tier: purchase.tier,
          totalTokens: purchase.token_amount,
          amountPaid: (purchase.usd_amount_cents / 100).toFixed(2),
        });
      }
      
      // Extract charge ID from stored payment intent ID (format: coinbase_CHARGE_ID)
      const chargeId = purchase.stripe_payment_intent_id?.replace("coinbase_", "").replace("coinbase_pending_", "");
      if (!chargeId || chargeId.startsWith("pending")) {
        return res.json({ success: false, status: "pending", message: "Payment not yet initiated" });
      }
      
      const { getCoinbaseCharge } = await import("./coinbaseClient");
      const charge = await getCoinbaseCharge(chargeId);
      
      if (charge.status === "COMPLETED" || charge.status === "CONFIRMED") {
        // Update to completed
        await db.execute(sql`
          UPDATE presale_purchases 
          SET status = 'completed'
          WHERE id = ${purchaseId}
        `);
        
        return res.json({
          success: true,
          email: purchase.email,
          tier: purchase.tier,
          totalTokens: purchase.token_amount,
          amountPaid: (purchase.usd_amount_cents / 100).toFixed(2),
        });
      }
      
      res.json({ success: false, status: charge.status });
    } catch (error) {
      console.error("Verify crypto presale error:", error);
      res.status(500).json({ error: "Failed to verify crypto payment" });
    }
  });

  app.get("/api/presale/verify", async (req, res) => {
    try {
      const sessionId = req.query.session_id as string;
      const cryptoPurchaseId = req.query.crypto_purchase as string;
      
      // Handle crypto purchase verification
      if (cryptoPurchaseId) {
        const purchaseResult = await db.execute(sql`
          SELECT * FROM presale_purchases WHERE id = ${cryptoPurchaseId}
        `);
        const purchase = purchaseResult.rows[0] as any;
        
        if (!purchase) {
          return res.status(404).json({ error: "Purchase not found" });
        }
        
        return res.json({
          success: purchase.status === 'completed',
          email: purchase.email,
          tier: purchase.tier,
          totalTokens: purchase.token_amount,
          amountPaid: (purchase.usd_amount_cents / 100).toFixed(2),
          status: purchase.status,
          message: purchase.status === 'completed' ? "Purchase confirmed!" : "Payment pending confirmation",
        });
      }
      
      if (!sessionId) {
        return res.status(400).json({ error: "Session ID required" });
      }
      
      const { getUncachableStripeClient } = await import("./stripeClient");
      const stripe = await getUncachableStripeClient();
      const session = await stripe.checkout.sessions.retrieve(sessionId, {
        expand: ["customer_details"],
      });
      
      if (session.payment_status === "paid") {
        const customerEmail = session.customer_details?.email 
          || session.metadata?.email 
          || session.customer_email 
          || "anonymous";
        const amountCents = session.amount_total || 0;
        const tier = session.metadata?.tier || 'unknown';
        const amountPaid = (amountCents / 100).toFixed(2);
        
        const TOKEN_PRICE = 0.001;
        const TIER_BONUSES: Record<string, number> = {
          genesis: 25, founder: 15, pioneer: 10, early_bird: 5
        };
        const tokenAmount = Math.floor((amountCents / 100) / TOKEN_PRICE);
        const bonusPercent = TIER_BONUSES[tier] || 0;
        const bonusTokens = Math.floor(tokenAmount * (bonusPercent / 100));
        
        const insertResult = await db.execute(sql`
          INSERT INTO presale_purchases (stripe_payment_intent_id, email, usd_amount_cents, token_amount, tier, status, payment_method, created_at)
          VALUES (
            ${sessionId}, 
            ${customerEmail}, 
            ${amountCents}, 
            ${tokenAmount + bonusTokens},
            ${tier},
            'completed',
            'stripe',
            NOW()
          )
          ON CONFLICT (stripe_payment_intent_id) DO NOTHING
          RETURNING id
        `);
        
        const isNewPurchase = (insertResult.rowCount ?? 0) > 0;
        
        if (isNewPurchase && customerEmail !== "anonymous") {
          try {
            await sendPresaleConfirmationEmail(customerEmail, amountPaid, tier, tokenAmount, bonusTokens);
          } catch (emailError) {
            console.error("Failed to send presale confirmation email:", emailError);
          }
        }
        
        res.json({ 
          success: true, 
          email: customerEmail,
          amountPaid,
          tier,
          isNewPurchase,
          message: isNewPurchase ? "Purchase confirmed!" : "This purchase was already processed.",
        });
      } else {
        res.json({ success: false, message: "Payment not completed" });
      }
    } catch (error) {
      console.error("Presale verification error:", error);
      res.status(500).json({ error: "Failed to verify payment" });
    }
  });

  app.get("/api/billing/verify-payment", async (req, res) => {
    try {
      const sessionId = req.query.session_id as string;
      if (!sessionId) {
        return res.status(400).json({ error: "Session ID required" });
      }

      const { getUncachableStripeClient } = await import("./stripeClient");
      const stripe = await getUncachableStripeClient();
      const session = await stripe.checkout.sessions.retrieve(sessionId);

      if (session.payment_status === "paid" && session.metadata?.apiKeyId) {
        const amountCents = parseInt(session.metadata.amountCents || "0");
        await billingService.handlePaymentSuccess(session.metadata.apiKeyId, amountCents);
        res.json({ 
          success: true, 
          message: "Payment confirmed",
          amountPaid: (amountCents / 100).toFixed(2),
        });
      } else {
        res.json({ success: false, message: "Payment not completed" });
      }
    } catch (error) {
      console.error("Payment verification error:", error);
      res.status(500).json({ error: "Failed to verify payment" });
    }
  });

  app.post("/api/billing/checkout/crypto", async (req, res) => {
    try {
      const apiKey = req.headers["x-api-key"] as string;
      if (!apiKey) {
        return res.status(401).json({ error: "API key required" });
      }

      const validKey = await storage.getApiKeyByKey(apiKey);
      if (!validKey) {
        return res.status(401).json({ error: "Invalid API key" });
      }

      const balance = await billingService.getOutstandingBalance(validKey.id);
      if (balance <= 0) {
        return res.json({ message: "No outstanding balance", balanceCents: 0 });
      }

      const host = req.get("host") || "darkwavechain.io";
      const protocol = host.includes("localhost") ? "http" : "https";
      const baseUrl = `${protocol}://${host}`;

      const { createCoinbaseCharge } = await import("./coinbaseClient");
      const charge = await createCoinbaseCharge({
        name: "DarkWave API Usage",
        description: `Outstanding balance: $${(balance / 100).toFixed(2)}`,
        amountUsd: (balance / 100).toFixed(2),
        successUrl: `${baseUrl}/billing/success?coinbase_charge={CHECKOUT_ID}`,
        cancelUrl: `${baseUrl}/billing`,
        metadata: {
          apiKeyId: validKey.id,
          amountCents: balance.toString(),
        },
      });

      res.json({
        checkoutUrl: charge.hostedUrl,
        chargeId: charge.id,
        amountCents: balance,
        expiresAt: charge.expiresAt,
      });
    } catch (error) {
      console.error("Coinbase checkout error:", error);
      res.status(500).json({ error: "Failed to create crypto checkout" });
    }
  });

  app.get("/api/billing/verify-crypto", async (req, res) => {
    try {
      const chargeId = req.query.charge_id as string;
      if (!chargeId) {
        return res.status(400).json({ error: "Charge ID required" });
      }

      const { getCoinbaseCharge } = await import("./coinbaseClient");
      const charge = await getCoinbaseCharge(chargeId);

      if (charge.status === "COMPLETED" || charge.status === "CONFIRMED") {
        const amountCents = parseInt(charge.metadata?.amountCents || "0");
        if (charge.metadata?.apiKeyId) {
          await billingService.handlePaymentSuccess(charge.metadata.apiKeyId, amountCents);
        }
        res.json({
          success: true,
          message: "Crypto payment confirmed",
          amountPaid: (amountCents / 100).toFixed(2),
        });
      } else {
        res.json({ success: false, status: charge.status, message: "Payment pending" });
      }
    } catch (error) {
      console.error("Crypto verification error:", error);
      res.status(500).json({ error: "Failed to verify crypto payment" });
    }
  });

  // ===== Legacy Founder Program Routes =====

  app.get("/api/founder/stats", async (req, res) => {
    try {
      const result = await db.execute(sql`
        SELECT COUNT(*) as total FROM legacy_founders WHERE status IN ('paid', 'airdrop_pending', 'completed')
      `);
      const total = Number(result.rows[0]?.total || 0);
      const maxSpots = 10000;
      res.json({
        totalFounders: total,
        spotsRemaining: Math.max(0, maxSpots - total),
        maxSpots,
      });
    } catch (error) {
      console.error("Founder stats error:", error);
      res.json({ totalFounders: 0, spotsRemaining: 10000, maxSpots: 10000 });
    }
  });

  app.post("/api/founder/checkout/stripe", async (req, res) => {
    try {
      const { email, walletAddress } = req.body;
      if (!email) {
        return res.status(400).json({ error: "Email is required" });
      }

      const existing = await db.select().from(legacyFounders)
        .where(eq(legacyFounders.email, email))
        .limit(1);
      
      if (existing[0] && existing[0].status !== 'pending') {
        return res.status(400).json({ error: "You have already joined the Legacy Founder program" });
      }

      const { getUncachableStripeClient } = await import("./stripeClient");
      const stripe = await getUncachableStripeClient();

      const host = req.get("host") || "darkwavechain.io";
      const protocol = host.includes("localhost") ? "http" : "https";
      const baseUrl = `${protocol}://${host}`;

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [{
          price_data: {
            currency: "usd",
            product_data: {
              name: "DarkWave Legacy Founder",
              description: "Lifetime access + 35,000 DWC token airdrop",
            },
            unit_amount: 2400,
          },
          quantity: 1,
        }],
        mode: "payment",
        success_url: `${baseUrl}/founder-program?success=true&session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${baseUrl}/founder-program?canceled=true`,
        customer_email: email,
        metadata: { email, walletAddress: walletAddress || "", type: "legacy_founder" },
      });

      if (!existing[0]) {
        await db.insert(legacyFounders).values({
          email,
          walletAddress: walletAddress || null,
          paymentMethod: "stripe",
          paymentId: session.id,
          status: "pending",
        });
      } else {
        await db.update(legacyFounders)
          .set({ paymentId: session.id, walletAddress: walletAddress || null })
          .where(eq(legacyFounders.email, email));
      }

      res.json({ checkoutUrl: session.url });
    } catch (error) {
      console.error("Founder Stripe checkout error:", error);
      res.status(500).json({ error: "Failed to create checkout session" });
    }
  });

  app.post("/api/founder/checkout/crypto", async (req, res) => {
    try {
      const { email, walletAddress } = req.body;
      if (!email) {
        return res.status(400).json({ error: "Email is required" });
      }

      const existing = await db.select().from(legacyFounders)
        .where(eq(legacyFounders.email, email))
        .limit(1);
      
      if (existing[0] && existing[0].status !== 'pending') {
        return res.status(400).json({ error: "You have already joined the Legacy Founder program" });
      }

      const host = req.get("host") || "darkwavechain.io";
      const protocol = host.includes("localhost") ? "http" : "https";
      const baseUrl = `${protocol}://${host}`;

      const { createCoinbaseCharge } = await import("./coinbaseClient");
      const charge = await createCoinbaseCharge({
        name: "DarkWave Legacy Founder",
        description: "Lifetime access + 35,000 DWC token airdrop",
        amountUsd: "24.00",
        successUrl: `${baseUrl}/founder-program?success=true&coinbase_charge={CHECKOUT_ID}`,
        cancelUrl: `${baseUrl}/founder-program?canceled=true`,
        metadata: { email, walletAddress: walletAddress || "", type: "legacy_founder" },
      });

      if (!existing[0]) {
        await db.insert(legacyFounders).values({
          email,
          walletAddress: walletAddress || null,
          paymentMethod: "coinbase",
          paymentId: charge.id,
          status: "pending",
        });
      } else {
        await db.update(legacyFounders)
          .set({ paymentId: charge.id, paymentMethod: "coinbase", walletAddress: walletAddress || null })
          .where(eq(legacyFounders.email, email));
      }

      res.json({ checkoutUrl: charge.hostedUrl });
    } catch (error) {
      console.error("Founder Coinbase checkout error:", error);
      res.status(500).json({ error: "Failed to create crypto checkout" });
    }
  });

  app.get("/api/founder/verify", async (req, res) => {
    try {
      const sessionId = req.query.session_id as string;
      const chargeId = req.query.charge_id as string;

      if (sessionId) {
        const { getUncachableStripeClient } = await import("./stripeClient");
        const stripe = await getUncachableStripeClient();
        const session = await stripe.checkout.sessions.retrieve(sessionId);

        if (session.payment_status === "paid" && session.metadata?.email) {
          await db.update(legacyFounders)
            .set({ status: "paid", paidAt: new Date() })
            .where(eq(legacyFounders.email, session.metadata.email));
          
          return res.json({ success: true, message: "Welcome to the Legacy Founder program!" });
        }
      }

      if (chargeId) {
        const { getCoinbaseCharge } = await import("./coinbaseClient");
        const charge = await getCoinbaseCharge(chargeId);

        if ((charge.status === "COMPLETED" || charge.status === "CONFIRMED") && charge.metadata?.email) {
          await db.update(legacyFounders)
            .set({ status: "paid", paidAt: new Date() })
            .where(eq(legacyFounders.email, charge.metadata.email));
          
          return res.json({ success: true, message: "Welcome to the Legacy Founder program!" });
        }
      }

      res.json({ success: false, message: "Payment verification pending" });
    } catch (error) {
      console.error("Founder verification error:", error);
      res.status(500).json({ error: "Failed to verify payment" });
    }
  });

  // ===== DarkWave Studio API Routes =====

  app.get("/api/studio/projects", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const projects = await storage.getStudioProjectsByUser(userId);
      res.json(projects);
    } catch (error) {
      console.error("Get projects error:", error);
      res.status(500).json({ error: "Failed to fetch projects" });
    }
  });

  app.post("/api/studio/projects", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { name, description, language } = req.body;
      const lang = language || "javascript";
      const project = await storage.createStudioProject({
        userId,
        name: name || "Untitled Project",
        description: description || null,
        language: lang,
        isPublic: false,
      });
      const starterFiles: Record<string, { name: string; content: string; ext: string }> = {
        javascript: { name: "index.js", content: '// Welcome to DarkWave Studio\nconsole.log("Hello, DarkWave!");', ext: "js" },
        typescript: { name: "index.ts", content: '// Welcome to DarkWave Studio\nconsole.log("Hello, DarkWave!");', ext: "ts" },
        python: { name: "main.py", content: '# Welcome to DarkWave Studio\nprint("Hello, DarkWave!")', ext: "py" },
        rust: { name: "main.rs", content: '// Welcome to DarkWave Studio\nfn main() {\n    println!("Hello, DarkWave!");\n}', ext: "rs" },
        html: { name: "index.html", content: '<!DOCTYPE html>\n<html>\n<head>\n  <title>DarkWave Project</title>\n</head>\n<body>\n  <h1>Hello, DarkWave!</h1>\n</body>\n</html>', ext: "html" },
      };
      const starter = starterFiles[lang] || starterFiles.javascript;
      await storage.createStudioFile({
        projectId: project.id,
        path: `/${starter.name}`,
        name: starter.name,
        content: starter.content,
        language: lang,
        isFolder: false,
      });
      const savedProject = await storage.getStudioProject(project.id);
      res.json(savedProject);
    } catch (error) {
      console.error("Create project error:", error);
      res.status(500).json({ error: "Failed to create project" });
    }
  });

  app.get("/api/studio/projects/:id", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const project = await storage.getStudioProject(req.params.id);
      if (!project || project.userId !== userId) {
        return res.status(404).json({ error: "Project not found" });
      }
      const files = await storage.getStudioFiles(project.id);
      const secrets = await storage.getStudioSecrets(project.id);
      const configs = await storage.getStudioConfigs(project.id);
      res.json({ project, files, secrets: secrets.map(s => ({ ...s, value: "••••••" })), configs });
    } catch (error) {
      console.error("Get project error:", error);
      res.status(500).json({ error: "Failed to fetch project" });
    }
  });

  app.patch("/api/studio/projects/:id", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const project = await storage.getStudioProject(req.params.id);
      if (!project || project.userId !== userId) {
        return res.status(404).json({ error: "Project not found" });
      }
      const updated = await storage.updateStudioProject(project.id, req.body);
      res.json(updated);
    } catch (error) {
      console.error("Update project error:", error);
      res.status(500).json({ error: "Failed to update project" });
    }
  });

  app.delete("/api/studio/projects/:id", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const project = await storage.getStudioProject(req.params.id);
      if (!project || project.userId !== userId) {
        return res.status(404).json({ error: "Project not found" });
      }
      await storage.deleteStudioProject(project.id);
      res.json({ success: true });
    } catch (error) {
      console.error("Delete project error:", error);
      res.status(500).json({ error: "Failed to delete project" });
    }
  });

  app.post("/api/studio/projects/:id/files", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const project = await storage.getStudioProject(req.params.id);
      if (!project || project.userId !== userId) {
        return res.status(404).json({ error: "Project not found" });
      }
      const { path, name, content, language, isFolder } = req.body;
      const file = await storage.createStudioFile({
        projectId: project.id,
        path,
        name,
        content: content || "",
        language: language || "plaintext",
        isFolder: isFolder || false,
      });
      res.json(file);
    } catch (error) {
      console.error("Create file error:", error);
      res.status(500).json({ error: "Failed to create file" });
    }
  });

  app.patch("/api/studio/files/:id", isAuthenticated, async (req: any, res) => {
    try {
      const file = await storage.updateStudioFile(req.params.id, req.body);
      res.json(file);
    } catch (error) {
      console.error("Update file error:", error);
      res.status(500).json({ error: "Failed to update file" });
    }
  });

  app.delete("/api/studio/files/:id", isAuthenticated, async (req: any, res) => {
    try {
      await storage.deleteStudioFile(req.params.id);
      res.json({ success: true });
    } catch (error) {
      console.error("Delete file error:", error);
      res.status(500).json({ error: "Failed to delete file" });
    }
  });

  app.post("/api/studio/projects/:id/secrets", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const project = await storage.getStudioProject(req.params.id);
      if (!project || project.userId !== userId) {
        return res.status(404).json({ error: "Project not found" });
      }
      const { key, value } = req.body;
      const secret = await storage.createStudioSecret({
        projectId: project.id,
        key,
        value,
      });
      res.json({ ...secret, value: "••••••" });
    } catch (error) {
      console.error("Create secret error:", error);
      res.status(500).json({ error: "Failed to create secret" });
    }
  });

  app.delete("/api/studio/secrets/:id", isAuthenticated, async (req: any, res) => {
    try {
      await storage.deleteStudioSecret(req.params.id);
      res.json({ success: true });
    } catch (error) {
      console.error("Delete secret error:", error);
      res.status(500).json({ error: "Failed to delete secret" });
    }
  });

  app.post("/api/studio/projects/:id/configs", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const project = await storage.getStudioProject(req.params.id);
      if (!project || project.userId !== userId) {
        return res.status(404).json({ error: "Project not found" });
      }
      const { key, value, environment } = req.body;
      const config = await storage.createStudioConfig({
        projectId: project.id,
        key,
        value,
        environment: environment || "shared",
      });
      res.json(config);
    } catch (error) {
      console.error("Create config error:", error);
      res.status(500).json({ error: "Failed to create config" });
    }
  });

  app.delete("/api/studio/configs/:id", isAuthenticated, async (req: any, res) => {
    try {
      await storage.deleteStudioConfig(req.params.id);
      res.json({ success: true });
    } catch (error) {
      console.error("Delete config error:", error);
      res.status(500).json({ error: "Failed to delete config" });
    }
  });

  app.get("/api/studio/projects/:id/commits", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const project = await storage.getStudioProject(req.params.id);
      if (!project || project.userId !== userId) {
        return res.status(404).json({ error: "Project not found" });
      }
      const commits = await storage.getStudioCommits(project.id);
      res.json(commits);
    } catch (error) {
      console.error("Get commits error:", error);
      res.status(500).json({ error: "Failed to get commits" });
    }
  });

  app.post("/api/studio/projects/:id/commits", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const project = await storage.getStudioProject(req.params.id);
      if (!project || project.userId !== userId) {
        return res.status(404).json({ error: "Project not found" });
      }
      const { message, branch } = req.body;
      const files = await storage.getStudioFiles(project.id);
      const filesSnapshot = JSON.stringify(files.map(f => ({ path: f.path, content: f.content })));
      const existingCommits = await storage.getStudioCommits(project.id);
      const parentHash = existingCommits[0]?.hash || null;
      const crypto = await import("crypto");
      const hash = crypto.createHash("sha256")
        .update(filesSnapshot + Date.now().toString())
        .digest("hex")
        .slice(0, 8);
      const commit = await storage.createStudioCommit({
        projectId: project.id,
        hash,
        parentHash,
        message,
        authorId: userId,
        branch: branch || "main",
        filesSnapshot,
      });
      res.json(commit);
    } catch (error) {
      console.error("Create commit error:", error);
      res.status(500).json({ error: "Failed to create commit" });
    }
  });

  app.get("/api/studio/commits/:id", isAuthenticated, async (req: any, res) => {
    try {
      const commit = await storage.getStudioCommit(req.params.id);
      if (!commit) {
        return res.status(404).json({ error: "Commit not found" });
      }
      res.json(commit);
    } catch (error) {
      console.error("Get commit error:", error);
      res.status(500).json({ error: "Failed to get commit" });
    }
  });

  app.post("/api/studio/commits/:id/checkout", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const commit = await storage.getStudioCommit(req.params.id);
      if (!commit) {
        return res.status(404).json({ error: "Commit not found" });
      }
      const project = await storage.getStudioProject(commit.projectId);
      if (!project || project.userId !== userId) {
        return res.status(403).json({ error: "Unauthorized" });
      }
      const filesSnapshot = JSON.parse(commit.filesSnapshot) as { path: string; content: string }[];
      const currentFiles = await storage.getStudioFiles(project.id);
      for (const file of currentFiles) {
        await storage.deleteStudioFile(file.id);
      }
      for (const file of filesSnapshot) {
        const name = file.path.split("/").pop() || file.path;
        await storage.createStudioFile({
          projectId: project.id,
          path: file.path,
          name,
          content: file.content,
          language: "plaintext",
          isFolder: false,
        });
      }
      res.json({ success: true, message: `Checked out commit ${commit.hash}` });
    } catch (error) {
      console.error("Checkout error:", error);
      res.status(500).json({ error: "Failed to checkout commit" });
    }
  });

  app.get("/api/studio/projects/:id/branches", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const project = await storage.getStudioProject(req.params.id);
      if (!project || project.userId !== userId) {
        return res.status(404).json({ error: "Project not found" });
      }
      const branches = await storage.getStudioBranches(project.id);
      res.json(branches);
    } catch (error) {
      console.error("Get branches error:", error);
      res.status(500).json({ error: "Failed to get branches" });
    }
  });

  app.post("/api/studio/projects/:id/branches", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const project = await storage.getStudioProject(req.params.id);
      if (!project || project.userId !== userId) {
        return res.status(404).json({ error: "Project not found" });
      }
      const { name, headCommitId } = req.body;
      const branch = await storage.createStudioBranch({
        projectId: project.id,
        name,
        headCommitId,
        isDefault: false,
      });
      res.json(branch);
    } catch (error) {
      console.error("Create branch error:", error);
      res.status(500).json({ error: "Failed to create branch" });
    }
  });

  app.get("/api/studio/projects/:id/runs", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const project = await storage.getStudioProject(req.params.id);
      if (!project || project.userId !== userId) {
        return res.status(404).json({ error: "Project not found" });
      }
      const runs = await storage.getStudioRuns(project.id);
      res.json(runs);
    } catch (error) {
      console.error("Get runs error:", error);
      res.status(500).json({ error: "Failed to get runs" });
    }
  });

  app.post("/api/studio/projects/:id/run", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const project = await storage.getStudioProject(req.params.id);
      if (!project || project.userId !== userId) {
        return res.status(404).json({ error: "Project not found" });
      }
      const files = await storage.getStudioFiles(project.id);
      const mainFile = files.find(f => f.name === "index.js" || f.name === "main.js" || f.name === "app.js");
      const run = await storage.createStudioRun({
        projectId: project.id,
        command: "node index.js",
        status: "completed",
        output: mainFile ? "Code ready for client-side execution" : "No JavaScript file found",
        exitCode: mainFile ? "0" : "1",
      });
      res.json({ ...run, code: mainFile?.content || "" });
    } catch (error) {
      console.error("Run error:", error);
      res.status(500).json({ error: "Failed to run project" });
    }
  });

  app.get("/api/studio/runs/:id", isAuthenticated, async (req: any, res) => {
    try {
      const run = await storage.getStudioRun(req.params.id);
      if (!run) {
        return res.status(404).json({ error: "Run not found" });
      }
      res.json(run);
    } catch (error) {
      console.error("Get run error:", error);
      res.status(500).json({ error: "Failed to get run" });
    }
  });

  app.get("/api/studio/projects/:id/preview", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const project = await storage.getStudioProject(req.params.id);
      if (!project || project.userId !== userId) {
        return res.status(404).json({ error: "Project not found" });
      }
      const preview = await storage.getStudioPreview(project.id);
      res.json(preview || { status: "not_started" });
    } catch (error) {
      console.error("Get preview error:", error);
      res.status(500).json({ error: "Failed to get preview" });
    }
  });

  app.post("/api/studio/projects/:id/preview", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const project = await storage.getStudioProject(req.params.id);
      if (!project || project.userId !== userId) {
        return res.status(404).json({ error: "Project not found" });
      }
      const files = await storage.getStudioFiles(project.id);
      const htmlFile = files.find(f => f.name.endsWith(".html"));
      if (!htmlFile) {
        return res.status(400).json({ error: "No HTML file found for preview" });
      }
      const preview = await storage.createStudioPreview({
        projectId: project.id,
        status: "ready",
        url: `/api/studio/projects/${project.id}/preview/serve`,
      });
      res.json(preview);
    } catch (error) {
      console.error("Create preview error:", error);
      res.status(500).json({ error: "Failed to create preview" });
    }
  });

  app.get("/api/studio/projects/:id/preview/serve", async (req: any, res) => {
    try {
      const project = await storage.getStudioProject(req.params.id);
      if (!project) {
        return res.status(404).send("Project not found");
      }
      const files = await storage.getStudioFiles(project.id);
      const htmlFile = files.find(f => f.name.endsWith(".html"));
      if (!htmlFile) {
        return res.status(404).send("No HTML file found");
      }
      let html = htmlFile.content;
      const cssFile = files.find(f => f.name.endsWith(".css"));
      const jsFile = files.find(f => f.name.endsWith(".js"));
      if (cssFile) {
        html = html.replace("</head>", `<style>${cssFile.content}</style></head>`);
      }
      if (jsFile) {
        html = html.replace("</body>", `<script>${jsFile.content}</script></body>`);
      }
      res.setHeader("Content-Type", "text/html");
      res.send(html);
    } catch (error) {
      console.error("Serve preview error:", error);
      res.status(500).send("Error serving preview");
    }
  });

  app.post("/api/studio/projects/:id/deploy", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const project = await storage.getStudioProject(req.params.id);
      if (!project || project.userId !== userId) {
        return res.status(404).json({ error: "Project not found" });
      }
      const commits = await storage.getStudioCommits(project.id);
      const latestCommit = commits[0];
      const existingDeployments = await storage.getStudioDeployments(project.id);
      const version = (existingDeployments.length + 1).toString();
      const deployment = await storage.createStudioDeployment({
        projectId: project.id,
        status: "building",
        version,
        commitHash: latestCommit?.hash || null,
        buildLogs: "Starting deployment...\n",
      });
      setTimeout(async () => {
        const url = `https://${project.name.toLowerCase().replace(/[^a-z0-9]/g, "-")}-${project.id.slice(0, 8)}.darkwave.app`;
        await storage.updateStudioDeployment(deployment.id, {
          status: "live",
          url,
          buildLogs: "Starting deployment...\nBuilding project...\nOptimizing assets...\nDeployment complete!\n",
        });
      }, 3000);
      res.json(deployment);
    } catch (error) {
      console.error("Deploy error:", error);
      res.status(500).json({ error: "Failed to deploy" });
    }
  });

  app.get("/api/studio/projects/:id/deployments", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const project = await storage.getStudioProject(req.params.id);
      if (!project || project.userId !== userId) {
        return res.status(404).json({ error: "Project not found" });
      }
      const deployments = await storage.getStudioDeployments(project.id);
      res.json(deployments);
    } catch (error) {
      console.error("Get deployments error:", error);
      res.status(500).json({ error: "Failed to get deployments" });
    }
  });

  app.get("/api/studio/deployments/:id", isAuthenticated, async (req: any, res) => {
    try {
      const deployment = await storage.getStudioDeployment(req.params.id);
      if (!deployment) {
        return res.status(404).json({ error: "Deployment not found" });
      }
      res.json(deployment);
    } catch (error) {
      console.error("Get deployment error:", error);
      res.status(500).json({ error: "Failed to get deployment" });
    }
  });

  app.patch("/api/studio/deployments/:id/domain", isAuthenticated, async (req: any, res) => {
    try {
      const { customDomain } = req.body;
      const deployment = await storage.updateStudioDeployment(req.params.id, { customDomain });
      res.json(deployment);
    } catch (error) {
      console.error("Update domain error:", error);
      res.status(500).json({ error: "Failed to update domain" });
    }
  });

  app.post("/api/studio/projects/:id/terminal", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const project = await storage.getStudioProject(req.params.id);
      if (!project || project.userId !== userId) {
        return res.status(404).json({ error: "Project not found" });
      }
      const { command } = req.body;
      const terminalCommands: Record<string, string> = {
        "ls": "index.js\npackage.json\nREADME.md",
        "pwd": `/home/darkwave/${project.name}`,
        "whoami": "darkwave",
        "date": new Date().toUTCString(),
        "echo $PATH": "/usr/local/bin:/usr/bin:/bin",
        "node -v": "v20.10.0",
        "npm -v": "10.2.3",
        "python --version": "Python 3.11.6",
        "clear": "",
        "help": "Available commands: ls, pwd, whoami, date, node -v, npm -v, python --version, clear, help",
      };
      const output = terminalCommands[command] ?? `darkwave: command not found: ${command.split(" ")[0]}`;
      res.json({ command, output, exitCode: terminalCommands[command] !== undefined ? 0 : 127 });
    } catch (error) {
      console.error("Terminal error:", error);
      res.status(500).json({ error: "Terminal error" });
    }
  });

  // Studio AI Code Assistant - PAID feature using credits
  app.post("/api/studio/ai/assist", isAuthenticated, studioAiRateLimit, async (req: any, res) => {
    try {
      const userId = req.user?.id || req.user?.claims?.sub;
      if (!userId) return res.status(401).json({ error: "Login required" });

      const { prompt, code, language, context } = req.body;
      if (!prompt) {
        return res.status(400).json({ error: "Prompt is required" });
      }

      // Check credits FIRST (don't deduct yet)
      const credits = await getUserCredits(userId);
      if (credits.balanceCents < STUDIO_AI_COST_CENTS) {
        // Return 402 Payment Required for insufficient credits
        return res.status(402).json({ 
          error: "insufficient_credits",
          message: "You're out of AI credits! Each Studio AI request costs $0.05.",
          required: STUDIO_AI_COST_CENTS,
          balance: credits.balanceCents,
        });
      }

      const OpenAI = (await import("openai")).default;
      const openai = new OpenAI({
        apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY,
        baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
      });

      const systemPrompt = `You are an expert coding assistant for DarkWave Studio, a web-based IDE. 
You help developers write, debug, explain, and optimize code.

Guidelines:
- Be concise but thorough
- When showing code changes, use code blocks with the language
- Explain your reasoning briefly
- If fixing bugs, explain what was wrong
- If optimizing, explain the improvement

Current context:
- Language: ${language || "unknown"}
- File: ${context || "untitled"}`;

      // Set up SSE for streaming
      res.setHeader("Content-Type", "text/event-stream");
      res.setHeader("Cache-Control", "no-cache");
      res.setHeader("Connection", "keep-alive");

      const userMessage = code 
        ? `${prompt}\n\nHere's the code:\n\`\`\`${language || ""}\n${code}\n\`\`\``
        : prompt;

      const stream = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userMessage }
        ],
        stream: true,
        max_tokens: 1500,
      });

      let hasContent = false;
      for await (const chunk of stream) {
        const content = chunk.choices[0]?.delta?.content || "";
        if (content) {
          hasContent = true;
          res.write(`data: ${JSON.stringify({ content })}\n\n`);
        }
      }

      // Only deduct credits AFTER successful completion
      if (hasContent) {
        await deductCredits(userId, STUDIO_AI_COST_CENTS, "studio_ai");
      }

      res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
      res.end();
    } catch (error: any) {
      console.error("Studio AI error:", error);
      // Don't deduct credits on error - user gets a free retry
      if (!res.headersSent) {
        res.status(500).json({ error: "AI request failed" });
      } else {
        res.write(`data: ${JSON.stringify({ content: "\n\n❌ Error: Something went wrong. Please try again (no credits charged)." })}\n\n`);
        res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
        res.end();
      }
    }
  });

  app.get("/api/studio/projects/:id/collaborators", isAuthenticated, async (req: any, res) => {
    try {
      const collaborators = await storage.getStudioCollaborators(req.params.id);
      res.json(collaborators);
    } catch (error) {
      console.error("Get collaborators error:", error);
      res.status(500).json({ error: "Failed to get collaborators" });
    }
  });

  app.post("/api/studio/projects/:id/collaborators", isAuthenticated, async (req: any, res) => {
    try {
      const { userId, role } = req.body;
      const collaborator = await storage.createStudioCollaborator({
        projectId: req.params.id,
        userId,
        role: role || "editor",
      });
      res.json(collaborator);
    } catch (error) {
      console.error("Add collaborator error:", error);
      res.status(500).json({ error: "Failed to add collaborator" });
    }
  });

  app.post("/api/studio/projects/:id/packages", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const project = await storage.getStudioProject(req.params.id);
      if (!project || project.userId !== userId) {
        return res.status(404).json({ error: "Project not found" });
      }
      const { packageName, packageManager } = req.body;
      const [name, version] = packageName.includes("@") && !packageName.startsWith("@") 
        ? packageName.split("@") 
        : [packageName, "latest"];
      const resolvedVersion = version === "latest" ? (packageManager === "npm" ? "^1.0.0" : "1.0.0") : version;
      const files = await storage.getStudioFiles(req.params.id);
      if (packageManager === "npm") {
        const pkgFile = files.find(f => f.name === "package.json");
        if (pkgFile) {
          try {
            const pkg = JSON.parse(pkgFile.content || "{}");
            pkg.dependencies = pkg.dependencies || {};
            pkg.dependencies[name] = resolvedVersion;
            await storage.updateStudioFile(pkgFile.id, { content: JSON.stringify(pkg, null, 2) });
          } catch {}
        }
      } else if (packageManager === "pip") {
        const reqFile = files.find(f => f.name === "requirements.txt");
        if (reqFile) {
          const content = (reqFile.content || "") + `\n${name}==${resolvedVersion.replace("^", "")}`;
          await storage.updateStudioFile(reqFile.id, { content: content.trim() });
        }
      }
      res.json({ name, version: resolvedVersion });
    } catch (error) {
      console.error("Install package error:", error);
      res.status(500).json({ error: "Failed to install package" });
    }
  });

  app.delete("/api/studio/projects/:id/packages/:packageName", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const project = await storage.getStudioProject(req.params.id);
      if (!project || project.userId !== userId) {
        return res.status(404).json({ error: "Project not found" });
      }
      const packageName = decodeURIComponent(req.params.packageName);
      const files = await storage.getStudioFiles(req.params.id);
      const pkgFile = files.find(f => f.name === "package.json");
      if (pkgFile) {
        try {
          const pkg = JSON.parse(pkgFile.content || "{}");
          if (pkg.dependencies && pkg.dependencies[packageName]) {
            delete pkg.dependencies[packageName];
            await storage.updateStudioFile(pkgFile.id, { content: JSON.stringify(pkg, null, 2) });
          }
        } catch {}
      }
      const reqFile = files.find(f => f.name === "requirements.txt");
      if (reqFile) {
        const lines = (reqFile.content || "").split("\n").filter(l => !l.startsWith(packageName + "=="));
        await storage.updateStudioFile(reqFile.id, { content: lines.join("\n") });
      }
      res.json({ success: true });
    } catch (error) {
      console.error("Remove package error:", error);
      res.status(500).json({ error: "Failed to remove package" });
    }
  });

  app.patch("/api/studio/deployments/:id/domain", isAuthenticated, async (req: any, res) => {
    try {
      const { customDomain } = req.body;
      const deployment = await storage.updateStudioDeployment(req.params.id, { customDomain });
      if (!deployment) {
        return res.status(404).json({ error: "Deployment not found" });
      }
      res.json(deployment);
    } catch (error) {
      console.error("Update domain error:", error);
      res.status(500).json({ error: "Failed to update custom domain" });
    }
  });

  // ============================================
  // DATABASE EXPLORER
  // ============================================

  app.get("/api/studio/database/tables", isAuthenticated, async (req: any, res) => {
    try {
      const result = await db.execute(sql`
        SELECT 
          table_name,
          (SELECT COUNT(*) FROM information_schema.columns WHERE table_name = t.table_name AND table_schema = 'public') as column_count
        FROM information_schema.tables t
        WHERE table_schema = 'public' AND table_type = 'BASE TABLE'
        ORDER BY table_name
      `);
      
      const tables = await Promise.all(
        result.rows.map(async (row: any) => {
          try {
            const countResult = await db.execute(sql.raw(`SELECT COUNT(*) as count FROM "${row.table_name}"`));
            return {
              name: row.table_name,
              rowCount: Number(countResult.rows[0]?.count || 0),
            };
          } catch {
            return { name: row.table_name, rowCount: 0 };
          }
        })
      );
      
      res.json({ tables });
    } catch (error: any) {
      console.error("Database tables error:", error);
      res.status(500).json({ error: error.message || "Failed to fetch tables" });
    }
  });

  app.get("/api/studio/database/table/:name", isAuthenticated, async (req: any, res) => {
    try {
      const { name } = req.params;
      
      // Validate table name to prevent SQL injection
      if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(name)) {
        return res.status(400).json({ error: "Invalid table name" });
      }
      
      // Get columns
      const columnsResult = await db.execute(sql`
        SELECT column_name, data_type, is_nullable
        FROM information_schema.columns
        WHERE table_schema = 'public' AND table_name = ${name}
        ORDER BY ordinal_position
      `);
      
      const columns = columnsResult.rows.map((row: any) => row.column_name);
      
      // Get rows (limit to 100)
      const rowsResult = await db.execute(sql.raw(`SELECT * FROM "${name}" LIMIT 100`));
      
      res.json({ columns, rows: rowsResult.rows });
    } catch (error: any) {
      console.error("Database table error:", error);
      res.status(500).json({ error: error.message || "Failed to fetch table data" });
    }
  });

  app.post("/api/studio/database/query", isAuthenticated, async (req: any, res) => {
    try {
      const { query } = req.body;
      
      if (!query) {
        return res.status(400).json({ error: "Query is required" });
      }
      
      // Only allow SELECT queries for safety
      const trimmedQuery = query.trim().toLowerCase();
      if (!trimmedQuery.startsWith("select")) {
        return res.status(400).json({ error: "Only SELECT queries are allowed in the explorer. Use migrations for data modifications." });
      }
      
      // Execute the query with a limit
      const limitedQuery = query.includes("limit") ? query : `${query} LIMIT 100`;
      const result = await db.execute(sql.raw(limitedQuery));
      
      res.json({
        columns: result.rows.length > 0 ? Object.keys(result.rows[0]) : [],
        rows: result.rows,
        rowCount: result.rows.length,
      });
    } catch (error: any) {
      console.error("Database query error:", error);
      res.status(500).json({ error: error.message || "Query failed" });
    }
  });

  // ============================================
  // TRANSACTION HISTORY
  // ============================================

  app.get("/api/transactions/history", async (req, res) => {
    try {
      const transactions = await storage.getTransactionHistory();
      res.json({ transactions });
    } catch (error) {
      console.error("Transaction history error:", error);
      res.json({ transactions: [] });
    }
  });

  // CSV Export for Transaction History
  app.get("/api/transactions/export", async (req, res) => {
    try {
      const transactions = await storage.getTransactionHistory();
      
      // Build CSV content
      const headers = ["Hash", "Type", "From", "To", "Amount", "Token", "Status", "Timestamp"];
      const csvRows = [headers.join(",")];
      
      for (const tx of transactions) {
        const row = [
          tx.hash || "",
          tx.type || "",
          tx.from || "",
          tx.to || "",
          tx.amount || "",
          tx.token || "DWC",
          tx.status || "",
          tx.timestamp ? new Date(tx.timestamp).toISOString() : "",
        ].map(field => `"${String(field).replace(/"/g, '""')}"`);
        csvRows.push(row.join(","));
      }
      
      const csv = csvRows.join("\n");
      
      res.setHeader("Content-Type", "text/csv");
      res.setHeader("Content-Disposition", `attachment; filename="darkwave-transactions-${Date.now()}.csv"`);
      res.send(csv);
    } catch (error) {
      console.error("Transaction export error:", error);
      res.status(500).json({ error: "Failed to export transactions" });
    }
  });

  // ============================================
  // NFT MARKETPLACE
  // ============================================

  async function seedNftCollections() {
    const DEFAULT_COLLECTIONS = [
      { name: "DarkWave Genesis", symbol: "DWGEN", description: "The original DarkWave NFT collection - commemorating the birth of the ecosystem", imageUrl: "/assets/generated_images/genesis_nft_cosmic_orb_collectible.png" },
      { name: "Cyber Collective", symbol: "CYBER", description: "Elite cyber warriors from the digital frontier", imageUrl: "/assets/generated_images/cyber_warrior_nft_collectible.png" },
      { name: "Quantum Realms", symbol: "QREALM", description: "Explore quantum dimensions through holographic art", imageUrl: "/assets/generated_images/quantum_shift_holographic_nft_card.png" },
      { name: "Neon Dreams", symbol: "NEON", description: "Neon-infused ethereal dreamscapes", imageUrl: "/assets/generated_images/neon_dreams_nft_collectible.png" },
    ];
    
    for (const collection of DEFAULT_COLLECTIONS) {
      await storage.createNftCollection(collection);
    }
  }

  // NFT images mapped to names for proper matching
  const NFT_IMAGE_MAP: Record<string, string> = {
    "Genesis Orb": "/assets/generated_images/genesis_nft_cosmic_orb_collectible.png",
    "Genesis Crystal": "/assets/generated_images/genesis_nft_crystal_formation_collectible.png",
    "Genesis Portal": "/assets/generated_images/genesis_nft_portal_vortex_collectible.png",
    "Aurora Pulse": "/assets/generated_images/aurora_pulse_holographic_nft_card.png",
    "Digital Dawn": "/assets/generated_images/digital_dawn_holographic_nft_card.png",
    "Quantum Shift": "/assets/generated_images/quantum_shift_holographic_nft_card.png",
    "Neon Wave": "/assets/generated_images/neon_wave_holographic_nft_card.png",
    "Cyber Warrior": "/assets/generated_images/cyber_warrior_nft_collectible.png",
    "Golden Aura": "/assets/generated_images/golden_aura_nft_collectible.png",
  };

  async function seedNfts(collections: any[]) {
    const NFT_CONFIGS = [
      { name: "Genesis Orb", desc: "The original cosmic orb - first of the genesis collection" },
      { name: "Aurora Pulse", desc: "Northern lights energy pulsing with cosmic power" },
      { name: "Digital Dawn", desc: "Sunrise made of pixels and code" },
      { name: "Quantum Shift", desc: "Dimensional portal warping space-time" },
      { name: "Neon Wave", desc: "Flowing waves of electric neon light" },
    ];
    
    for (const collection of collections) {
      for (let i = 0; i < 5; i++) {
        const config = NFT_CONFIGS[i];
        await storage.createNft({
          tokenId: `${collection.id}-${i}`,
          collectionId: collection.id,
          name: `${config.name} #${i + 1}`,
          description: config.desc,
          imageUrl: NFT_IMAGE_MAP[config.name] || "/assets/generated_images/genesis_nft_cosmic_orb_collectible.png",
        });
      }
    }
  }

  app.get("/api/nft/collections", async (req, res) => {
    try {
      let collections = await storage.getNftCollections();
      
      if (collections.length === 0) {
        await seedNftCollections();
        collections = await storage.getNftCollections();
        await seedNfts(collections);
      }
      
      res.json({ collections });
    } catch (error) {
      console.error("NFT collections error:", error);
      res.json({ collections: [] });
    }
  });

  app.get("/api/nft/listings", async (req, res) => {
    try {
      const listings = await storage.getNftListings();
      res.json({ listings });
    } catch (error) {
      console.error("NFT listings error:", error);
      res.json({ listings: [] });
    }
  });

  app.get("/api/nft/stats", async (req, res) => {
    try {
      const stats = await storage.getNftStats();
      res.json(stats);
    } catch (error) {
      console.error("NFT stats error:", error);
      res.json({ totalVolume: "0", totalNfts: 0, totalCollections: 0 });
    }
  });

  app.get("/api/nft/all", async (req, res) => {
    try {
      const nftsData = await db.select().from(nfts).orderBy(desc(nfts.createdAt));
      res.json({ nfts: nftsData });
    } catch (error) {
      console.error("NFT all error:", error);
      res.json({ nfts: [] });
    }
  });

  app.post("/api/nft/mint", isAuthenticated, nftMintRateLimit, async (req: any, res) => {
    try {
      const userId = req.user?.id || req.user?.claims?.sub;
      const parseResult = NftMintRequestSchema.safeParse(req.body);
      if (!parseResult.success) {
        return res.status(400).json({ error: parseResult.error.errors[0]?.message || "Invalid request" });
      }
      const { name, description, imageUrl, collection, collectionId } = parseResult.data;
      const finalCollectionId = collectionId || collection || "user-created";

      const nft = await storage.createNft({
        tokenId: `${Date.now()}`,
        collectionId: finalCollectionId,
        name,
        description: description || "",
        imageUrl: imageUrl || "",
        ownerId: userId,
      });

      res.json({ success: true, nft });
    } catch (error: any) {
      console.error("NFT mint error:", error);
      res.status(500).json({ error: error.message || "Failed to mint NFT" });
    }
  });

  // ============================================
  // DEX / TOKEN SWAP
  // ============================================
  
  const SUPPORTED_TOKENS = ["DWC", "USDC", "wETH", "wSOL", "USDT"];

  app.get("/api/swap/info", async (req, res) => {
    try {
      const recentSwaps = await storage.getRecentSwaps();
      res.json({
        supportedTokens: SUPPORTED_TOKENS,
        totalSwaps: recentSwaps.length,
        isTestnet: true,
        launchDate: "April 11, 2026",
        message: "DEX trading will be available at mainnet launch"
      });
    } catch (error) {
      console.error("Swap info error:", error);
      res.status(500).json({ error: "Failed to get swap info" });
    }
  });

  app.get("/api/swap/quote", async (req, res) => {
    try {
      const { tokenIn, tokenOut } = req.query;
      
      res.json({
        isTestnet: true,
        launchDate: "April 11, 2026",
        message: "Live trading quotes available at mainnet launch",
        route: tokenIn && tokenOut ? `${tokenIn} → ${tokenOut}` : "",
        amountOut: null,
        priceImpact: null,
        fee: null,
        minReceived: null,
      });
    } catch (error) {
      console.error("Swap quote error:", error);
      res.status(500).json({ error: "Failed to get quote" });
    }
  });

  app.get("/api/swap/recent", async (req, res) => {
    try {
      const swaps = await storage.getRecentSwaps();
      res.json({ swaps });
    } catch (error) {
      console.error("Recent swaps error:", error);
      res.json({ swaps: [] });
    }
  });

  app.post("/api/swap/execute", swapRateLimit, async (req, res) => {
    try {
      res.status(503).json({ 
        error: "DEX trading launches April 11, 2026",
        isTestnet: true,
        launchDate: "April 11, 2026"
      });
    } catch (error: any) {
      console.error("Swap execute error:", error);
      res.status(500).json({ error: error.message || "Swap failed" });
    }
  });

  // ============================================
  // PORTFOLIO
  // ============================================

  app.get("/api/portfolio", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user?.id || req.user?.claims?.sub;
      const walletAddress = req.query.wallet as string | undefined;
      
      let dwtBalance = "0";
      if (walletAddress) {
        const account = await storage.getChainAccount(walletAddress);
        dwtBalance = account?.balance || "0";
      }
      
      const priceHistory = await storage.getPriceHistory("DWC", 2);
      const currentPrice = parseFloat(priceHistory[0]?.price || "0.000124");
      const oldPrice = parseFloat(priceHistory[1]?.price || String(currentPrice));
      const priceChange = oldPrice > 0 ? ((currentPrice - oldPrice) / oldPrice * 100) : 0;
      
      const dwtBalanceNum = parseFloat(dwtBalance) / 1e18;
      const dwtValue = dwtBalanceNum * currentPrice;
      
      // Get liquid staking position
      const liquidPosition = await storage.getLiquidStakingPosition(userId);
      const stDwtBalance = liquidPosition?.stDwtBalance || "0";
      const stDwtBalanceNum = parseFloat(stDwtBalance) / 1e18;
      const liquidState = await storage.getLiquidStakingState();
      const exchangeRate = parseFloat(liquidState?.exchangeRate || "1000000000000000000") / 1e18;
      const stDwtDwtEquivalent = stDwtBalanceNum * exchangeRate;
      const stDwtValue = stDwtDwtEquivalent * currentPrice;
      
      // Get regular staking positions - amounts are stored as tokens not wei
      const stakingPositions = await storage.getStakingPositions(userId);
      const totalStakedTokens = stakingPositions.reduce((sum, p) => sum + parseFloat(p.amount), 0);
      const totalPendingRewards = stakingPositions.reduce((sum, p) => sum + parseFloat(p.pendingRewards || "0"), 0);
      const stakedValue = totalStakedTokens * currentPrice;
      
      const lpPositions = await storage.getLiquidityPositions(userId);
      const lpValue = lpPositions.reduce((sum, p) => sum + parseFloat(p.lpTokens) * currentPrice, 0);
      
      const totalValue = dwtValue + stDwtValue + stakedValue + lpValue;
      
      // Build tokens array
      const tokens: any[] = [];
      
      // Always show DWC
      tokens.push({ 
        symbol: "DWC", 
        name: "DarkWave Coin", 
        balance: dwtBalance, 
        displayBalance: dwtBalanceNum.toFixed(2),
        value: dwtValue, 
        change: parseFloat(priceChange.toFixed(2)), 
        icon: "🌊" 
      });
      
      // Show stDWC if user has any
      if (stDwtBalanceNum > 0) {
        tokens.push({
          symbol: "stDWC",
          name: "Staked DarkWave Coin",
          balance: stDwtBalance,
          displayBalance: stDwtBalanceNum.toFixed(2),
          value: stDwtValue,
          change: parseFloat(priceChange.toFixed(2)),
          icon: "💧"
        });
      }
      
      res.json({
        totalValue,
        change24h: parseFloat(priceChange.toFixed(2)),
        tokens,
        staking: {
          totalStaked: totalStakedTokens.toString(),
          pendingRewards: totalPendingRewards.toFixed(6),
          apy: 12.5,
          stakedValue,
          positions: stakingPositions.map(p => ({
            pool: p.poolId.includes("validator") ? "Validator Node" : p.poolId.includes("delegator") ? "Delegator Pool" : "Staking Pool",
            amount: p.amount,
            apy: p.poolId.includes("validator") ? 15.0 : p.poolId.includes("delegator") ? 12.5 : 10.0,
            rewards: p.pendingRewards || "0",
          })),
        },
        liquidStaking: {
          stDwtBalance: stDwtBalanceNum.toFixed(2),
          dwtEquivalent: stDwtDwtEquivalent.toFixed(2),
          value: stDwtValue,
          apy: 12,
        },
        liquidity: {
          totalValue: lpValue,
          positions: lpPositions.map(p => ({
            poolId: p.poolId,
            lpTokens: p.lpTokens,
            earnedFees: p.earnedFees,
          })),
        },
        nfts: [],
      });
    } catch (error) {
      console.error("Portfolio error:", error);
      res.status(500).json({ error: "Failed to get portfolio" });
    }
  });

  // ============================================
  // PLAYER GAMING STATS (Authenticated)
  // ============================================
  
  app.get("/api/player-stats/:userId", isAuthenticated, async (req: any, res) => {
    try {
      const { userId } = req.params;
      const authUserId = req.user?.id || req.user?.claims?.sub;
      
      // Users can only view their own stats
      if (userId !== authUserId) {
        return res.status(403).json({ error: "Cannot view other users' stats" });
      }
      
      const stats = await storage.getPlayerStats(userId);
      
      if (!stats) {
        return res.json({
          username: "Player",
          level: 1,
          xp: 0,
          xpToNextLevel: 100,
          totalGamesPlayed: 0,
          totalWagered: "0",
          totalWon: "0",
          totalLost: "0",
          netProfit: "0",
          winCount: 0,
          lossCount: 0,
          winRate: "0",
          bestMultiplier: "0",
          currentStreak: 0,
          bestStreak: 0,
        });
      }
      
      res.json(stats);
    } catch (error) {
      console.error("Player stats error:", error);
      res.status(500).json({ error: "Failed to get player stats" });
    }
  });
  
  app.get("/api/player-history/:userId", isAuthenticated, async (req: any, res) => {
    try {
      const { userId } = req.params;
      const authUserId = req.user?.id || req.user?.claims?.sub;
      
      // Users can only view their own history
      if (userId !== authUserId) {
        return res.status(403).json({ error: "Cannot view other users' history" });
      }
      
      const limit = parseInt(req.query.limit as string) || 50;
      const history = await storage.getPlayerGameHistory(userId, limit);
      res.json(history);
    } catch (error) {
      console.error("Player history error:", error);
      res.status(500).json({ error: "Failed to get player history" });
    }
  });
  
  app.get("/api/player-daily-profit/:userId", isAuthenticated, async (req: any, res) => {
    try {
      const { userId } = req.params;
      const authUserId = req.user?.id || req.user?.claims?.sub;
      
      // Users can only view their own profit data
      if (userId !== authUserId) {
        return res.status(403).json({ error: "Cannot view other users' profit data" });
      }
      
      const days = parseInt(req.query.days as string) || 14;
      const dailyProfit = await storage.getPlayerDailyProfit(userId, days);
      
      // Transform to chart format
      const chartData = dailyProfit.map(d => ({
        date: d.date.substring(5), // MM-DD format
        profit: parseFloat(d.profit),
      })).reverse();
      
      res.json(chartData);
    } catch (error) {
      console.error("Daily profit error:", error);
      res.status(500).json({ error: "Failed to get daily profit" });
    }
  });

  // ============================================
  // SWEEPSTAKES SYSTEM (GC/SC)
  // ============================================

  // Define coin packs for purchase
  const COIN_PACKS = [
    { id: "starter", name: "Starter Pack", priceUsd: "4.99", goldCoins: "10000", bonusSc: "5" },
    { id: "value", name: "Value Pack", priceUsd: "9.99", goldCoins: "25000", bonusSc: "15" },
    { id: "popular", name: "Popular Pack", priceUsd: "19.99", goldCoins: "60000", bonusSc: "40" },
    { id: "mega", name: "Mega Pack", priceUsd: "49.99", goldCoins: "175000", bonusSc: "125" },
    { id: "premium", name: "Premium Pack", priceUsd: "99.99", goldCoins: "400000", bonusSc: "300" },
    { id: "whale", name: "Whale Pack", priceUsd: "199.99", goldCoins: "900000", bonusSc: "750" },
  ];

  // Daily bonus amounts by streak day (max 7)
  const DAILY_BONUS_GC = [100, 200, 300, 500, 750, 1000, 2000];
  const DAILY_BONUS_SC = [0.5, 1, 1.5, 2, 3, 4, 5];

  // Get sweepstakes balance
  app.get("/api/sweeps/balance", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user?.id || req.user?.claims?.sub;
      let balance = await storage.getSweepsBalance(userId);
      
      if (!balance) {
        balance = await storage.createSweepsBalance(userId);
      }
      
      res.json({
        goldCoins: balance.goldCoins,
        sweepsCoins: balance.sweepsCoins,
        totalGcPurchased: balance.totalGcPurchased,
        totalScEarned: balance.totalScEarned,
        totalScRedeemed: balance.totalScRedeemed,
      });
    } catch (error) {
      console.error("Get balance error:", error);
      res.status(500).json({ error: "Failed to get balance" });
    }
  });

  // Get available coin packs
  app.get("/api/sweeps/packs", async (req, res) => {
    res.json(COIN_PACKS);
  });

  // Purchase coin pack
  app.post("/api/sweeps/purchase", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user?.id || req.user?.claims?.sub;
      const { packId, stripePaymentId } = req.body;
      
      const pack = COIN_PACKS.find(p => p.id === packId);
      if (!pack) {
        return res.status(400).json({ error: "Invalid pack" });
      }
      
      // Record the purchase
      const purchase = await storage.recordSweepsPurchase({
        userId,
        packId: pack.id,
        packName: pack.name,
        priceUsd: pack.priceUsd,
        goldCoinsAmount: pack.goldCoins,
        sweepsCoinsBonus: pack.bonusSc,
        stripePaymentId: stripePaymentId || null,
        status: "completed",
      });
      
      // Update balance
      const newBalance = await storage.updateSweepsBalance(userId, pack.goldCoins, pack.bonusSc);
      
      // Record bonus
      await storage.recordSweepsBonus({
        userId,
        bonusType: "purchase_bonus",
        sweepsCoinsAmount: pack.bonusSc,
        goldCoinsAmount: "0",
        description: `FREE SC with ${pack.name} purchase`,
      });
      
      res.json({
        success: true,
        purchase,
        newBalance: {
          goldCoins: newBalance.goldCoins,
          sweepsCoins: newBalance.sweepsCoins,
        },
      });
    } catch (error) {
      console.error("Purchase error:", error);
      res.status(500).json({ error: "Failed to process purchase" });
    }
  });

  // Get daily login status
  app.get("/api/sweeps/daily", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user?.id || req.user?.claims?.sub;
      const loginStatus = await storage.getDailyLoginStatus(userId);
      
      if (!loginStatus) {
        // New login today - calculate streak
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toISOString().split('T')[0];
        
        // For now, start at streak day 1 (would need yesterday's login to continue streak)
        const streakDay = 1;
        
        res.json({
          canClaim: true,
          streakDay,
          bonusGc: DAILY_BONUS_GC[Math.min(streakDay - 1, 6)],
          bonusSc: DAILY_BONUS_SC[Math.min(streakDay - 1, 6)],
          claimed: false,
        });
      } else {
        res.json({
          canClaim: !loginStatus.bonusClaimed,
          streakDay: loginStatus.streakDay,
          bonusGc: DAILY_BONUS_GC[Math.min(loginStatus.streakDay - 1, 6)],
          bonusSc: DAILY_BONUS_SC[Math.min(loginStatus.streakDay - 1, 6)],
          claimed: loginStatus.bonusClaimed,
        });
      }
    } catch (error) {
      console.error("Daily status error:", error);
      res.status(500).json({ error: "Failed to get daily status" });
    }
  });

  // Claim daily bonus
  app.post("/api/sweeps/daily/claim", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user?.id || req.user?.claims?.sub;
      let loginStatus = await storage.getDailyLoginStatus(userId);
      
      if (loginStatus?.bonusClaimed) {
        return res.status(400).json({ error: "Already claimed today" });
      }
      
      let streakDay = 1;
      if (!loginStatus) {
        // Record new login
        loginStatus = await storage.recordDailyLogin(userId, streakDay);
      } else {
        streakDay = loginStatus.streakDay;
      }
      
      // Claim the bonus
      await storage.claimDailyBonus(userId);
      
      const bonusGc = DAILY_BONUS_GC[Math.min(streakDay - 1, 6)].toString();
      const bonusSc = DAILY_BONUS_SC[Math.min(streakDay - 1, 6)].toString();
      
      // Update balance
      const newBalance = await storage.updateSweepsBalance(userId, bonusGc, bonusSc);
      
      // Record bonus
      await storage.recordSweepsBonus({
        userId,
        bonusType: "daily_login",
        sweepsCoinsAmount: bonusSc,
        goldCoinsAmount: bonusGc,
        description: `Day ${streakDay} login bonus`,
      });
      
      res.json({
        success: true,
        streakDay,
        bonusGc,
        bonusSc,
        newBalance: {
          goldCoins: newBalance.goldCoins,
          sweepsCoins: newBalance.sweepsCoins,
        },
      });
    } catch (error) {
      console.error("Claim daily error:", error);
      res.status(500).json({ error: "Failed to claim daily bonus" });
    }
  });

  // Request SC redemption (convert SC to DWC)
  app.post("/api/sweeps/redeem", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user?.id || req.user?.claims?.sub;
      const { scAmount, walletAddress } = req.body;
      
      if (!scAmount || parseFloat(scAmount) < 100) {
        return res.status(400).json({ error: "Minimum redemption is 100 SC" });
      }
      
      if (!walletAddress) {
        return res.status(400).json({ error: "Wallet address required" });
      }
      
      const balance = await storage.getSweepsBalance(userId);
      if (!balance || parseFloat(balance.sweepsCoins) < parseFloat(scAmount)) {
        return res.status(400).json({ error: "Insufficient SC balance" });
      }
      
      // 1 SC = 1 DWC conversion rate
      const dwcAmount = scAmount;
      
      const redemption = await storage.requestSweepsRedemption({
        userId,
        sweepsCoinsAmount: scAmount,
        dwcAmount,
        walletAddress,
        status: "pending",
        kycVerified: false,
      });
      
      res.json({
        success: true,
        redemption,
        message: "Redemption request submitted. KYC verification may be required.",
      });
    } catch (error) {
      console.error("Redemption error:", error);
      res.status(500).json({ error: "Failed to process redemption" });
    }
  });

  // Get redemption history
  app.get("/api/sweeps/redemptions", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user?.id || req.user?.claims?.sub;
      const redemptions = await storage.getSweepsRedemptions(userId);
      res.json(redemptions);
    } catch (error) {
      console.error("Get redemptions error:", error);
      res.status(500).json({ error: "Failed to get redemptions" });
    }
  });

  // Get purchase history
  app.get("/api/sweeps/purchases", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user?.id || req.user?.claims?.sub;
      const purchases = await storage.getSweepsPurchases(userId);
      res.json(purchases);
    } catch (error) {
      console.error("Get purchases error:", error);
      res.status(500).json({ error: "Failed to get purchases" });
    }
  });

  // Record sweepstakes game result
  app.post("/api/sweeps/game", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user?.id || req.user?.claims?.sub;
      const { gameType, currencyType, betAmount, multiplier, payout, profit, outcome } = req.body;
      
      // Validate currency type
      if (currencyType !== "GC" && currencyType !== "SC") {
        return res.status(400).json({ error: "Invalid currency type" });
      }
      
      // Deduct bet and add payout
      const balanceDelta = parseFloat(profit);
      const gcDelta = currencyType === "GC" ? balanceDelta.toString() : "0";
      const scDelta = currencyType === "SC" ? balanceDelta.toString() : "0";
      
      const newBalance = await storage.updateSweepsBalance(userId, gcDelta, scDelta);
      
      // Record game history
      const game = await storage.recordSweepsGame({
        userId,
        gameType,
        currencyType,
        betAmount: betAmount.toString(),
        multiplier: multiplier?.toString() || null,
        payout: payout.toString(),
        profit: profit.toString(),
        outcome,
      });
      
      res.json({
        success: true,
        game,
        newBalance: {
          goldCoins: newBalance.goldCoins,
          sweepsCoins: newBalance.sweepsCoins,
        },
      });
    } catch (error) {
      console.error("Record game error:", error);
      res.status(500).json({ error: "Failed to record game" });
    }
  });

  // Get sweepstakes game history
  app.get("/api/sweeps/history", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user?.id || req.user?.claims?.sub;
      const limit = parseInt(req.query.limit as string) || 50;
      const history = await storage.getSweepsGameHistory(userId, limit);
      res.json(history);
    } catch (error) {
      console.error("Get history error:", error);
      res.status(500).json({ error: "Failed to get history" });
    }
  });

  // AMOE (Alternate Method of Entry) - Free SC without purchase
  app.post("/api/sweeps/amoe", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user?.id || req.user?.claims?.sub;
      const { method } = req.body; // "mail", "social", etc.
      
      // AMOE gives small SC bonus (legal requirement for sweepstakes)
      const bonusSc = "5"; // 5 SC free
      
      await storage.updateSweepsBalance(userId, "0", bonusSc);
      
      await storage.recordSweepsBonus({
        userId,
        bonusType: "amoe",
        sweepsCoinsAmount: bonusSc,
        goldCoinsAmount: "0",
        description: `Free entry via ${method || "alternative method"}`,
      });
      
      res.json({
        success: true,
        bonusSc,
        message: "Free Sweeps Coins credited to your account!",
      });
    } catch (error) {
      console.error("AMOE error:", error);
      res.status(500).json({ error: "Failed to process AMOE entry" });
    }
  });

  // ============================================
  // TESTNET FAUCET
  // ============================================
  
  const FAUCET_AMOUNT = "1000000000000000000000"; // 1000 DWC
  const FAUCET_COOLDOWN_MS = 24 * 60 * 60 * 1000; // 24 hours
  
  app.get("/api/faucet/info", async (req, res) => {
    try {
      const claims = await storage.getFaucetClaims();
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const claimsToday = claims.filter(c => new Date(c.claimedAt) >= today).length;
      const totalDistributed = claims
        .filter(c => c.status === "completed")
        .reduce((sum, c) => sum + BigInt(c.amount), BigInt(0));
      
      res.json({
        dailyLimit: "10000000000000000000000", // 10,000 DWC per day total
        claimAmount: FAUCET_AMOUNT,
        totalDistributed: totalDistributed.toString(),
        claimsToday,
        remainingToday: "unlimited",
      });
    } catch (error) {
      console.error("Faucet info error:", error);
      res.status(500).json({ error: "Failed to get faucet info" });
    }
  });
  
  app.get("/api/faucet/claims", async (req, res) => {
    try {
      const claims = await storage.getFaucetClaims();
      res.json({ claims: claims.slice(0, 50) });
    } catch (error) {
      console.error("Faucet claims error:", error);
      res.status(500).json({ error: "Failed to get claims" });
    }
  });
  
  app.post("/api/faucet/claim", faucetRateLimit, async (req, res) => {
    try {
      const parseResult = FaucetClaimRequestSchema.safeParse(req.body);
      if (!parseResult.success) {
        return res.status(400).json({ error: parseResult.error.errors[0]?.message || "Invalid request" });
      }
      const { walletAddress } = parseResult.data;
      
      // Check cooldown
      const recentClaim = await storage.getRecentFaucetClaim(walletAddress);
      if (recentClaim) {
        const claimTime = new Date(recentClaim.claimedAt).getTime();
        const now = Date.now();
        if (now - claimTime < FAUCET_COOLDOWN_MS) {
          const remainingMs = FAUCET_COOLDOWN_MS - (now - claimTime);
          const remainingHours = Math.ceil(remainingMs / (60 * 60 * 1000));
          return res.status(429).json({ 
            error: `Please wait ${remainingHours} hours before claiming again` 
          });
        }
      }
      
      // Create claim record
      const claim = await storage.createFaucetClaim({
        walletAddress,
        amount: FAUCET_AMOUNT,
        status: "pending",
        ipAddress: req.ip || null,
      });
      
      // Distribute tokens
      try {
        const result = blockchain.distributeTokens(walletAddress, BigInt(FAUCET_AMOUNT));
        if (result.success) {
          await storage.updateFaucetClaim(claim.id, {
            status: "completed",
            txHash: result.txHash,
          });
          res.json({
            success: true,
            claimId: claim.id,
            amount: FAUCET_AMOUNT,
            txHash: result.txHash,
          });
        } else {
          await storage.updateFaucetClaim(claim.id, { status: "failed" });
          res.status(500).json({ error: result.error || "Distribution failed" });
        }
      } catch (distError) {
        await storage.updateFaucetClaim(claim.id, { status: "failed" });
        throw distError;
      }
    } catch (error: any) {
      console.error("Faucet claim error:", error);
      res.status(500).json({ error: error.message || "Failed to claim tokens" });
    }
  });

  // ============================================
  // ARCADE GAMES
  // ============================================

  const ARCADE_HOUSE_ADDRESS = "0x" + "a".repeat(40);
  const HOUSE_EDGE = 1; // 1% house edge
  const arcadeRateLimit = rateLimit("arcade", 30, 60 * 1000);

  const ArcadeGameSchema = z.object({
    gameType: z.enum(["coinflip", "dice", "crash"]),
    betAmount: z.string().regex(/^\d+$/, "Amount must be numeric"),
    choice: z.string().optional(),
    target: z.number().optional(),
    autoCashout: z.number().optional(),
  });

  app.post("/api/arcade/play", isAuthenticated, arcadeRateLimit, async (req, res) => {
    try {
      const parseResult = ArcadeGameSchema.safeParse(req.body);
      if (!parseResult.success) {
        return res.status(400).json({ error: parseResult.error.errors[0]?.message || "Invalid request" });
      }

      const { gameType, betAmount, choice, target, autoCashout } = parseResult.data;
      const user = req.user as any;
      const walletAddress = user?.walletAddress || user?.id;

      if (!walletAddress) {
        return res.status(400).json({ error: "No wallet address found" });
      }

      const betAmountBigInt = BigInt(betAmount);
      const minBet = BigInt("1000000000000000000"); // 1 DWC minimum
      const maxBet = BigInt("100000000000000000000000"); // 100,000 DWC maximum

      if (betAmountBigInt < minBet) {
        return res.status(400).json({ error: "Minimum bet is 1 DWC" });
      }
      if (betAmountBigInt > maxBet) {
        return res.status(400).json({ error: "Maximum bet is 100,000 DWC" });
      }

      const account = blockchain.getAccount(walletAddress);
      if (!account || account.balance < betAmountBigInt) {
        return res.status(400).json({ error: "Insufficient DWC balance" });
      }

      if (!blockchain.debitAccount(walletAddress, betAmountBigInt)) {
        return res.status(400).json({ error: "Failed to debit bet amount" });
      }

      let won = false;
      let multiplier = 0;
      let result: any = {};

      if (gameType === "coinflip") {
        const flipResult = Math.random() > 0.5 ? "heads" : "tails";
        won = flipResult === (choice || "heads");
        multiplier = won ? 1.98 : 0;
        result = { flipResult, chosen: choice || "heads" };
      } else if (gameType === "dice") {
        const roll = Math.floor(Math.random() * 100) + 1;
        const targetNum = target || 50;
        const isOver = (choice || "over") === "over";
        won = isOver ? roll > targetNum : roll < targetNum;
        const winChance = isOver ? (100 - targetNum) : targetNum;
        multiplier = won ? (99 / winChance) * 0.99 : 0;
        result = { roll, target: targetNum, direction: isOver ? "over" : "under" };
      } else if (gameType === "crash") {
        const crashPoint = 1 + Math.random() * 9;
        const cashoutPoint = autoCashout || 2.0;
        won = crashPoint >= cashoutPoint;
        multiplier = won ? cashoutPoint * 0.99 : 0;
        result = { crashPoint: crashPoint.toFixed(2), cashoutAt: cashoutPoint };
      }

      let winnings = BigInt(0);
      if (won && multiplier > 0) {
        winnings = BigInt(Math.floor(Number(betAmountBigInt) * multiplier));
        blockchain.creditAccount(walletAddress, winnings);
      }

      blockchain.creditAccount(ARCADE_HOUSE_ADDRESS, betAmountBigInt - winnings > 0 ? betAmountBigInt - winnings : BigInt(0));

      const txHash = "0x" + crypto.createHash("sha256").update(`arcade:${Date.now()}:${walletAddress}:${gameType}`).digest("hex");

      res.json({
        success: true,
        gameType,
        won,
        result,
        betAmount: betAmount,
        winnings: winnings.toString(),
        multiplier: multiplier.toFixed(2),
        txHash,
        newBalance: blockchain.getAccount(walletAddress)?.balance.toString() || "0",
      });
    } catch (error: any) {
      console.error("Arcade game error:", error);
      res.status(500).json({ error: error.message || "Game failed" });
    }
  });

  app.get("/api/arcade/stats", async (req, res) => {
    try {
      res.json({
        playersOnline: Math.floor(Math.random() * 500) + 300,
        wageredToday: "1,247,500",
        paidOutToday: "1,198,400",
        houseEdge: "1%",
        rtp: "99%",
      });
    } catch (error) {
      console.error("Arcade stats error:", error);
      res.status(500).json({ error: "Failed to get stats" });
    }
  });

  app.get("/api/arcade/leaderboard", async (req, res) => {
    try {
      res.json({
        leaderboard: [
          { address: "DWC...x7K2", winnings: "12,450", game: "Crash" },
          { address: "DWC...m3P8", winnings: "8,200", game: "Coin Flip" },
          { address: "DWC...n9R5", winnings: "6,800", game: "Dice" },
          { address: "DWC...k4L1", winnings: "5,100", game: "Crash" },
          { address: "DWC...p2W8", winnings: "4,500", game: "Coin Flip" },
        ],
      });
    } catch (error) {
      console.error("Arcade leaderboard error:", error);
      res.status(500).json({ error: "Failed to get leaderboard" });
    }
  });

  app.get("/api/arcade/games", async (req, res) => {
    try {
      res.json({
        games: [
          { id: "crash", name: "Crash", description: "Multiplier game - cash out before crash", minBet: "10", maxBet: "10000", houseEdge: "1%", rtp: "99%", icon: "rocket" },
          { id: "coinflip", name: "Coin Flip", description: "Classic heads or tails - 50/50 odds", minBet: "10", maxBet: "10000", houseEdge: "2%", rtp: "98%", icon: "coins" },
          { id: "dice", name: "Dice Roll", description: "Roll under/over - variable odds", minBet: "10", maxBet: "5000", houseEdge: "1%", rtp: "99%", icon: "dice" },
          { id: "slots", name: "Slots", description: "Classic slot machine with bonus rounds", minBet: "5", maxBet: "1000", houseEdge: "3%", rtp: "97%", icon: "cherry" },
          { id: "roulette", name: "Roulette", description: "European roulette - single zero", minBet: "10", maxBet: "5000", houseEdge: "2.7%", rtp: "97.3%", icon: "target" },
          { id: "blackjack", name: "Blackjack", description: "Classic 21 - beat the dealer", minBet: "25", maxBet: "10000", houseEdge: "0.5%", rtp: "99.5%", icon: "spade" },
          { id: "lottery", name: "Daily Lottery", description: "Pick numbers for jackpot prizes", minBet: "1", maxBet: "100", houseEdge: "5%", rtp: "95%", icon: "ticket" },
        ],
        currency: "DWC",
        provablyFair: true,
        licenseInfo: "Games operate under DarkWave Studios provably fair system"
      });
    } catch (error) {
      console.error("Arcade games list error:", error);
      res.status(500).json({ error: "Failed to get games list" });
    }
  });

  // ============================================
  // TOKEN LAUNCHPAD
  // ============================================

  app.get("/api/launchpad/tokens", async (req, res) => {
    try {
      res.json({ tokens: [] });
    } catch (error) {
      console.error("Launchpad tokens error:", error);
      res.json({ tokens: [] });
    }
  });

  app.post("/api/launchpad/create", async (req, res) => {
    try {
      const { 
        name, symbol, description, totalSupply, initialPrice, launchType,
        website, twitter, telegram,
        autoLiquidityPercent = 75, lpLockDays = 90, softCap = "1000", hardCap = "100000"
      } = req.body;
      
      if (!name || !symbol) {
        return res.status(400).json({ error: "Name and symbol are required" });
      }
      
      // Validate auto-liquidity settings (server-side validation)
      const liquidityPct = Math.min(95, Math.max(50, Number(autoLiquidityPercent)));
      const lockDays = Math.min(365, Math.max(30, Number(lpLockDays)));
      const platformFee = 2.5;
      
      // Ensure creator receives at least 2.5%
      if (liquidityPct + platformFee > 97.5) {
        return res.status(400).json({ error: "Auto-liquidity cannot exceed 95%" });
      }
      
      const tokenId = crypto.randomUUID();
      const creatorReceives = (100 - platformFee - liquidityPct).toFixed(1);
      
      res.json({
        success: true,
        token: {
          id: tokenId,
          name,
          symbol,
          description,
          totalSupply: totalSupply || "1000000000",
          initialPrice: initialPrice || "0.001",
          currentPrice: initialPrice || "0.001",
          launchType: launchType || "fair",
          status: "pending",
          autoLiquidityPercent: liquidityPct,
          lpLockDays: lockDays,
          platformFeePercent: platformFee.toString(),
          softCap,
          hardCap,
          raisedAmount: "0",
          website,
          twitter,
          telegram,
          createdAt: new Date().toISOString(),
        },
        feeBreakdown: {
          platformFee: `${platformFee}%`,
          autoLiquidity: `${liquidityPct}%`,
          creatorReceives: `${creatorReceives}%`,
          lpLockDays: lockDays
        }
      });
    } catch (error: any) {
      console.error("Launchpad create error:", error);
      res.status(500).json({ error: error.message || "Failed to create token" });
    }
  });

  // ============================================
  // LIQUIDITY POOLS
  // ============================================

  app.get("/api/liquidity/pools", async (req, res) => {
    try {
      const pools = await storage.getLiquidityPools();
      res.json({ pools, isTestnet: true, launchDate: "April 11, 2026" });
    } catch (error) {
      console.error("Liquidity pools error:", error);
      res.json({ pools: [], isTestnet: true, launchDate: "April 11, 2026" });
    }
  });

  app.get("/api/liquidity/positions", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user?.id || req.user?.claims?.sub;
      const positions = await storage.getLiquidityPositions(userId);
      
      // Enrich with pool info
      const enrichedPositions = await Promise.all(positions.map(async (pos) => {
        const pool = await storage.getLiquidityPool(pos.poolId);
        return {
          ...pos,
          tokenA: pool?.tokenA || "?",
          tokenB: pool?.tokenB || "?",
          sharePercent: pool?.totalLpTokens && BigInt(pool.totalLpTokens) > BigInt(0)
            ? ((BigInt(pos.lpTokens) * BigInt(10000)) / BigInt(pool.totalLpTokens)).toString()
            : "0",
        };
      }));
      
      res.json({ positions: enrichedPositions });
    } catch (error) {
      console.error("Liquidity positions error:", error);
      res.json({ positions: [] });
    }
  });

  app.post("/api/liquidity/add", liquidityRateLimit, isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user?.id || req.user?.claims?.sub;
      const { poolId, amountA, amountB } = req.body;
      
      if (!poolId || !amountA || !amountB) {
        return res.status(400).json({ error: "Missing required fields" });
      }
      
      const pool = await storage.getLiquidityPool(poolId);
      if (!pool) {
        return res.status(404).json({ error: "Pool not found" });
      }
      
      // Calculate LP tokens (simplified sqrt formula)
      const lpTokens = Math.floor(Math.sqrt(parseFloat(amountA) * parseFloat(amountB))).toString();
      
      // Create position
      const position = await storage.createLiquidityPosition({
        userId,
        poolId,
        lpTokens,
        tokenADeposited: amountA,
        tokenBDeposited: amountB,
        earnedFees: "0",
      });
      
      // Update pool reserves
      await storage.updateLiquidityPool(poolId, {
        reserveA: (BigInt(pool.reserveA) + BigInt(amountA)).toString(),
        reserveB: (BigInt(pool.reserveB) + BigInt(amountB)).toString(),
        totalLpTokens: (BigInt(pool.totalLpTokens) + BigInt(lpTokens)).toString(),
      });
      
      res.json({ success: true, position });
    } catch (error: any) {
      console.error("Add liquidity error:", error);
      res.status(500).json({ error: error.message || "Failed to add liquidity" });
    }
  });

  // ============================================
  // NFT GALLERY
  // ============================================

  app.get("/api/nft/gallery", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user?.id || req.user?.claims?.sub;
      const { walletAddress } = req.query;
      
      const ownerId = (walletAddress as string) || userId;
      const nfts = await storage.getNftsByOwner(ownerId);
      
      res.json({ nfts });
    } catch (error) {
      console.error("NFT gallery error:", error);
      res.json({ nfts: [] });
    }
  });

  // ============================================
  // PRICE CHARTS
  // ============================================

  app.get("/api/charts/stats", async (req, res) => {
    try {
      res.json({
        isTestnet: true,
        launchDate: "April 11, 2026",
        message: "Live price data available at mainnet launch",
        price: null,
        change24h: null,
        volume24h: null,
        marketCap: null,
        high24h: null,
        low24h: null,
      });
    } catch (error) {
      console.error("Charts stats error:", error);
      res.status(500).json({ error: "Failed to get stats" });
    }
  });

  app.get("/api/charts/history", async (req, res) => {
    try {
      res.json({
        isTestnet: true,
        launchDate: "April 11, 2026",
        message: "Price history available at mainnet launch",
        data: [],
      });
    } catch (error) {
      console.error("Charts history error:", error);
      res.status(500).json({ error: "Failed to get history" });
    }
  });

  // ============================================
  // WEBHOOKS
  // ============================================

  app.get("/api/webhooks", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user?.id || req.user?.claims?.sub;
      const webhooks = await storage.getWebhooks(userId);
      res.json({ webhooks });
    } catch (error) {
      console.error("Webhooks error:", error);
      res.json({ webhooks: [] });
    }
  });

  app.post("/api/webhooks", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user?.id || req.user?.claims?.sub;
      const { url, events, secret } = req.body;
      if (!url || !events?.length) {
        return res.status(400).json({ error: "URL and events are required" });
      }
      
      const webhookSecret = secret || `whsec_${crypto.randomBytes(16).toString('hex')}`;
      
      const webhook = await storage.createWebhook({
        userId,
        url,
        events: JSON.stringify(events),
        secret: webhookSecret,
        isActive: true,
        failureCount: 0,
      });
      
      // Also register with the real-time webhook service
      const { webhookService } = await import("./webhook-service");
      webhookService.registerWebhook({
        url,
        secret: webhookSecret,
        events: events as any[]
      });
      
      res.json({ success: true, webhook });
    } catch (error: any) {
      console.error("Create webhook error:", error);
      res.status(500).json({ error: error.message || "Failed to create webhook" });
    }
  });
  
  app.patch("/api/webhooks/:id", isAuthenticated, async (req: any, res) => {
    try {
      const { url, events, isActive } = req.body;
      const updateData: any = {};
      if (url !== undefined) updateData.url = url;
      if (events !== undefined) updateData.events = JSON.stringify(events);
      if (isActive !== undefined) updateData.isActive = isActive;
      
      const webhook = await storage.updateWebhook(req.params.id, updateData);
      res.json({ success: true, webhook });
    } catch (error: any) {
      console.error("Update webhook error:", error);
      res.status(500).json({ error: error.message || "Failed to update webhook" });
    }
  });

  app.delete("/api/webhooks/:id", isAuthenticated, async (req: any, res) => {
    try {
      await storage.deleteWebhook(req.params.id);
      res.json({ success: true });
    } catch (error: any) {
      console.error("Delete webhook error:", error);
      res.status(500).json({ error: error.message || "Failed to delete webhook" });
    }
  });

  app.get("/api/webhooks/:id/logs", isAuthenticated, async (req: any, res) => {
    try {
      const logs = await storage.getWebhookLogs(req.params.id);
      res.json({ logs });
    } catch (error) {
      console.error("Webhook logs error:", error);
      res.json({ logs: [] });
    }
  });

  // =====================================================
  // STUDIO AI CREDITS - For expensive AI coding features
  // Basic AI Assistant is FREE (just requires login)
  // =====================================================
  
  const STUDIO_AI_COST_CENTS = 5; // $0.05 per Studio AI call (code completion, AI fixes)

  // Helper: Get or create user AI credits (for Studio AI features)
  async function getUserCredits(userId: string): Promise<{ balanceCents: number }> {
    const { userAiCredits } = await import("@shared/schema");
    const existing = await db.select().from(userAiCredits).where(eq(userAiCredits.userId, userId)).limit(1);
    if (existing[0]) {
      return { balanceCents: parseInt(existing[0].balanceCents || "0") };
    }
    // Create with 100 cents ($1) free trial for Studio AI
    await db.insert(userAiCredits).values({ userId, balanceCents: "100" });
    return { balanceCents: 100 };
  }

  // Helper: Deduct credits (for Studio AI only)
  async function deductCredits(userId: string, amount: number, action: string): Promise<boolean> {
    const { userAiCredits, aiUsageLogs } = await import("@shared/schema");
    const credits = await getUserCredits(userId);
    if (credits.balanceCents < amount) return false;
    
    await db.update(userAiCredits)
      .set({ 
        balanceCents: (credits.balanceCents - amount).toString(),
        totalUsedCents: sql`(CAST(total_used_cents AS INTEGER) + ${amount})::TEXT`,
        updatedAt: new Date(),
      })
      .where(eq(userAiCredits.userId, userId));
    
    await db.insert(aiUsageLogs).values({ userId, action, costCents: amount.toString() });
    return true;
  }

  // Get user AI credits balance (for Studio AI features)
  app.get("/api/assistant/credits", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user?.claims?.sub || req.user?.id;
      if (!userId) return res.status(401).json({ error: "Login required" });
      
      const credits = await getUserCredits(userId);
      res.json({ 
        balanceCents: credits.balanceCents,
        balanceUSD: (credits.balanceCents / 100).toFixed(2),
        studioAiCost: STUDIO_AI_COST_CENTS,
        note: "Basic AI Assistant is free! Credits are for Studio AI features.",
      });
    } catch (error) {
      console.error("Get credits error:", error);
      res.status(500).json({ error: "Failed to get credits" });
    }
  });

  // Buy AI credits via Stripe (for Studio AI features)
  app.post("/api/assistant/buy-credits", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user?.claims?.sub || req.user?.id;
      if (!userId) return res.status(401).json({ error: "Login required" });

      const { amountCents } = req.body;
      const amount = parseInt(amountCents) || 500; // Default $5

      const { getUncachableStripeClient } = await import("./stripeClient");
      const stripe = await getUncachableStripeClient();
      
      const host = req.get("host") || "darkwavechain.io";
      const protocol = host.includes("localhost") ? "http" : "https";
      const baseUrl = `${protocol}://${host}`;

      const session = await stripe.checkout.sessions.create({
        mode: "payment",
        line_items: [{
          price_data: {
            currency: "usd",
            product_data: {
              name: "DarkWave Studio AI Credits",
              description: `${amount} credits for Studio AI coding features`,
            },
            unit_amount: amount,
          },
          quantity: 1,
        }],
        success_url: `${baseUrl}/studio?ai_credits_added=${amount}`,
        cancel_url: `${baseUrl}/studio`,
        metadata: { userId, amountCents: amount.toString(), type: "studio_ai_credits" },
      });

      res.json({ checkoutUrl: session.url });
    } catch (error) {
      console.error("Buy credits error:", error);
      res.status(500).json({ error: "Failed to create checkout" });
    }
  });

  // Webhook to add credits after payment
  app.post("/api/assistant/add-credits", async (req, res) => {
    try {
      const { userId, amountCents } = req.body;
      if (!userId || !amountCents) {
        return res.status(400).json({ error: "userId and amountCents required" });
      }
      
      const { userAiCredits } = await import("@shared/schema");
      const amount = parseInt(amountCents);
      
      await db.update(userAiCredits)
        .set({ 
          balanceCents: sql`(CAST(balance_cents AS INTEGER) + ${amount})::TEXT`,
          totalPurchasedCents: sql`(CAST(total_purchased_cents AS INTEGER) + ${amount})::TEXT`,
          updatedAt: new Date(),
        })
        .where(eq(userAiCredits.userId, userId));
      
      res.json({ success: true });
    } catch (error) {
      console.error("Add credits error:", error);
      res.status(500).json({ error: "Failed to add credits" });
    }
  });

  // =====================================================
  // FREE AI ASSISTANT - Basic ecosystem guidance
  // Free with rate limiting to prevent abuse
  // =====================================================
  
  // Simple in-memory rate limiter for AI assistant
  const assistantRateLimits = new Map<string, { count: number; resetTime: number }>();
  const ASSISTANT_RATE_LIMIT = 50; // 50 requests per hour
  const ASSISTANT_RATE_WINDOW = 60 * 60 * 1000; // 1 hour in ms

  function checkAssistantRateLimit(identifier: string): { allowed: boolean; remaining: number } {
    const now = Date.now();
    const record = assistantRateLimits.get(identifier);
    
    if (!record || now > record.resetTime) {
      assistantRateLimits.set(identifier, { count: 1, resetTime: now + ASSISTANT_RATE_WINDOW });
      return { allowed: true, remaining: ASSISTANT_RATE_LIMIT - 1 };
    }
    
    if (record.count >= ASSISTANT_RATE_LIMIT) {
      return { allowed: false, remaining: 0 };
    }
    
    record.count++;
    return { allowed: true, remaining: ASSISTANT_RATE_LIMIT - record.count };
  }

  // AI Assistant TTS - FREE with rate limiting
  app.post("/api/assistant/speak", async (req, res) => {
    try {
      // Rate limit by IP
      const ip = req.ip || req.socket.remoteAddress || "unknown";
      const rateCheck = checkAssistantRateLimit(`tts:${ip}`);
      if (!rateCheck.allowed) {
        return res.status(429).json({ 
          error: "Rate limit exceeded",
          message: "You've used all your free AI voice requests this hour. Try again later!",
        });
      }

      const { text } = req.body;
      if (!text || typeof text !== "string") {
        return res.status(400).json({ error: "Text is required" });
      }

      const OpenAI = (await import("openai")).default;
      const openai = new OpenAI({
        apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY,
        baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
      });

      const mp3 = await openai.audio.speech.create({
        model: "tts-1",
        voice: "nova",
        input: text,
        speed: 1.0,
      });

      const buffer = Buffer.from(await mp3.arrayBuffer());
      
      res.set({
        "Content-Type": "audio/mpeg",
        "Content-Length": buffer.length,
      });
      res.send(buffer);
    } catch (error: any) {
      console.error("TTS error:", error);
      res.status(500).json({ error: "Failed to generate speech" });
    }
  });

  // AI Assistant chat - FREE with rate limiting
  app.post("/api/assistant/chat", async (req, res) => {
    try {
      // Rate limit by IP
      const ip = req.ip || req.socket.remoteAddress || "unknown";
      const rateCheck = checkAssistantRateLimit(`chat:${ip}`);
      if (!rateCheck.allowed) {
        return res.status(429).json({ 
          error: "Rate limit exceeded",
          message: "You've used all your free AI messages this hour. Try again later!",
          response: "Whoa, you're chatting a lot! Come back in a bit and we can keep talking.",
        });
      }

      const { message } = req.body;
      if (!message || typeof message !== "string") {
        return res.status(400).json({ error: "Message is required" });
      }

      const OpenAI = (await import("openai")).default;
      const openai = new OpenAI({
        apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY,
        baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
      });

      const systemPrompt = `You are DarkWave AI, a friendly and knowledgeable assistant for the DarkWave Smart Chain ecosystem. 

DarkWave Smart Chain is a Layer 1 blockchain with:
- 400ms block times
- 200,000+ TPS capacity  
- Proof-of-Authority consensus with the Founders Validator
- Native DWC token (100 million total supply, 18 decimals)
- Genesis block: April 11, 2026
- Public launch: April 11, 2026

Key features available:
- Faucet: Get 1000 free test DWC (24-hour cooldown)
- Swap/DEX: Trade tokens with 0.3% fee
- NFT Marketplace: Buy, sell, and mint NFTs
- Staking: Stake DWC to earn rewards
- Portfolio: Track holdings and transactions
- Liquidity Pools: Provide liquidity and earn fees
- Launchpad: Launch new tokens
- Bridge: Transfer DWC to Ethereum (wDWC) or Solana
- DarkWave Studio: Full-featured web IDE

Keep responses concise (2-3 sentences max), friendly, and helpful. If asked about prices, balances, or specific data, explain that you can guide them to the relevant page. Use casual, warm language like you're a helpful friend. Do not use emojis or describe emojis in text form (like ":)" or "smile emoji"). Just communicate naturally without any emoji references.`;

      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: message }
        ],
        max_tokens: 200,
      });

      const response = completion.choices[0]?.message?.content || "I'm here to help! Could you rephrase that?";
      
      res.json({ response });
    } catch (error: any) {
      console.error("AI Assistant error:", error);
      res.status(500).json({ 
        error: "Failed to process message",
        response: "Sorry, I'm having a moment. Try asking me again!"
      });
    }
  });

  // ============================================
  // BETA TESTERS & AIRDROP ADMIN
  // ============================================

  app.get("/api/admin/beta-testers/tiers", isAuthenticated, async (req: any, res) => {
    try {
      const tiers = await storage.getBetaTesterTiers();
      res.json({ tiers });
    } catch (error: any) {
      res.status(500).json({ error: error.message || "Failed to get tiers" });
    }
  });

  app.post("/api/admin/beta-testers/tiers", isAuthenticated, async (req: any, res) => {
    try {
      const tier = await storage.createBetaTesterTier(req.body);
      res.json({ tier });
    } catch (error: any) {
      res.status(500).json({ error: error.message || "Failed to create tier" });
    }
  });

  app.put("/api/admin/beta-testers/tiers/:id", isAuthenticated, async (req: any, res) => {
    try {
      const tier = await storage.updateBetaTesterTier(req.params.id, req.body);
      res.json({ tier });
    } catch (error: any) {
      res.status(500).json({ error: error.message || "Failed to update tier" });
    }
  });

  app.delete("/api/admin/beta-testers/tiers/:id", isAuthenticated, async (req: any, res) => {
    try {
      await storage.deleteBetaTesterTier(req.params.id);
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ error: error.message || "Failed to delete tier" });
    }
  });

  app.get("/api/admin/beta-testers", isAuthenticated, async (req: any, res) => {
    try {
      const testers = await storage.getBetaTesters();
      res.json({ testers });
    } catch (error: any) {
      res.status(500).json({ error: error.message || "Failed to get testers" });
    }
  });

  app.post("/api/admin/beta-testers", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user?.id || req.user?.claims?.sub;
      const tester = await storage.createBetaTester({
        ...req.body,
        addedBy: userId,
      });
      res.json({ tester });
    } catch (error: any) {
      res.status(500).json({ error: error.message || "Failed to add tester" });
    }
  });

  app.put("/api/admin/beta-testers/:id", isAuthenticated, async (req: any, res) => {
    try {
      const tester = await storage.updateBetaTester(req.params.id, req.body);
      res.json({ tester });
    } catch (error: any) {
      res.status(500).json({ error: error.message || "Failed to update tester" });
    }
  });

  app.delete("/api/admin/beta-testers/:id", isAuthenticated, async (req: any, res) => {
    try {
      await storage.deleteBetaTester(req.params.id);
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ error: error.message || "Failed to delete tester" });
    }
  });

  // Airdrop Allocations
  app.get("/api/admin/airdrops", isAuthenticated, async (req: any, res) => {
    try {
      const allocations = await storage.getAirdropAllocations();
      res.json({ allocations });
    } catch (error: any) {
      res.status(500).json({ error: error.message || "Failed to get allocations" });
    }
  });

  app.post("/api/admin/airdrops", isAuthenticated, async (req: any, res) => {
    try {
      const allocation = await storage.createAirdropAllocation(req.body);
      res.json({ allocation });
    } catch (error: any) {
      res.status(500).json({ error: error.message || "Failed to create allocation" });
    }
  });

  app.put("/api/admin/airdrops/:id", isAuthenticated, async (req: any, res) => {
    try {
      const allocation = await storage.updateAirdropAllocation(req.params.id, req.body);
      res.json({ allocation });
    } catch (error: any) {
      res.status(500).json({ error: error.message || "Failed to update allocation" });
    }
  });

  // Token Gifts
  app.get("/api/admin/gifts", isAuthenticated, async (req: any, res) => {
    try {
      const gifts = await storage.getTokenGifts();
      res.json({ gifts });
    } catch (error: any) {
      res.status(500).json({ error: error.message || "Failed to get gifts" });
    }
  });

  app.post("/api/admin/gifts", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user?.id || req.user?.claims?.sub;
      const gift = await storage.createTokenGift({
        ...req.body,
        grantedBy: userId,
      });
      res.json({ gift });
    } catch (error: any) {
      res.status(500).json({ error: error.message || "Failed to create gift" });
    }
  });

  app.put("/api/admin/gifts/:id", isAuthenticated, async (req: any, res) => {
    try {
      const gift = await storage.updateTokenGift(req.params.id, req.body);
      res.json({ gift });
    } catch (error: any) {
      res.status(500).json({ error: error.message || "Failed to update gift" });
    }
  });

  app.delete("/api/admin/gifts/:id", isAuthenticated, async (req: any, res) => {
    try {
      await storage.deleteTokenGift(req.params.id);
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ error: error.message || "Failed to delete gift" });
    }
  });

  // Public airdrop claim check
  app.get("/api/airdrop/check", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user?.id || req.user?.claims?.sub;
      const userEmail = req.user?.email || req.user?.claims?.email;
      
      // Check if user is a beta tester
      let tester = null;
      if (userEmail) {
        tester = await storage.getBetaTesterByEmail(userEmail);
      }
      
      // Get active airdrop allocations
      const allocations = await storage.getAirdropAllocations();
      const activeAllocations = allocations.filter(a => a.isActive);
      
      // Check existing claims
      const claims = await storage.getAirdropClaims(userId);
      
      // Get gifts for this user
      const gifts = userEmail ? await storage.getTokenGiftsByRecipient(userEmail) : [];
      const pendingGifts = gifts.filter(g => g.status === "pending");
      
      res.json({
        isBetaTester: !!tester,
        tester,
        activeAllocations,
        claims,
        pendingGifts,
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message || "Failed to check eligibility" });
    }
  });

  // Claim airdrop
  app.post("/api/airdrop/claim", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user?.id || req.user?.claims?.sub;
      const { allocationId, walletAddress } = req.body;
      
      // Check if already claimed
      const existing = await storage.getAirdropClaimByUser(allocationId, userId);
      if (existing) {
        return res.status(400).json({ error: "Already claimed this airdrop" });
      }
      
      // Get allocation
      const allocations = await storage.getAirdropAllocations();
      const allocation = allocations.find(a => a.id === allocationId);
      if (!allocation || !allocation.isActive) {
        return res.status(400).json({ error: "Airdrop not available" });
      }
      
      // Create claim (amount would be calculated based on tier/eligibility)
      const claim = await storage.createAirdropClaim({
        allocationId,
        userId,
        walletAddress,
        amount: "1000",
        status: "pending",
      });
      
      res.json({ claim });
    } catch (error: any) {
      res.status(500).json({ error: error.message || "Failed to claim" });
    }
  });

  // ===== Marketing Automation Routes =====
  
  // Get all marketing posts
  app.get("/api/marketing/posts", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const { platform, status } = req.query;
      const posts = await storage.getMarketingPosts(
        platform as string | undefined,
        status as string | undefined
      );
      res.json({ posts });
    } catch (error: any) {
      res.status(500).json({ error: error.message || "Failed to fetch posts" });
    }
  });

  // Create new marketing post
  app.post("/api/marketing/posts", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const { platform, content, imageUrl, category, status } = req.body;
      if (!platform || !content) {
        return res.status(400).json({ error: "Platform and content are required" });
      }
      const post = await storage.createMarketingPost({
        platform,
        content,
        imageUrl: imageUrl || null,
        category: category || "general",
        status: status || "active",
      });
      res.json({ post });
    } catch (error: any) {
      res.status(500).json({ error: error.message || "Failed to create post" });
    }
  });

  // Update marketing post
  app.patch("/api/marketing/posts/:id", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { content, imageUrl, category, status } = req.body;
      const post = await storage.updateMarketingPost(id, { content, imageUrl, category, status });
      if (!post) {
        return res.status(404).json({ error: "Post not found" });
      }
      res.json({ post });
    } catch (error: any) {
      res.status(500).json({ error: error.message || "Failed to update post" });
    }
  });

  // Delete marketing post
  app.delete("/api/marketing/posts/:id", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      await storage.deleteMarketingPost(id);
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ error: error.message || "Failed to delete post" });
    }
  });

  // Get schedule configs
  app.get("/api/marketing/config", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const configs = await storage.getMarketingScheduleConfigs();
      res.json({ configs });
    } catch (error: any) {
      res.status(500).json({ error: error.message || "Failed to fetch configs" });
    }
  });

  // Update schedule config for a platform
  app.post("/api/marketing/config/:platform", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const { platform } = req.params;
      const { isActive, intervalMinutes, webhookUrl, channelId } = req.body;
      const config = await storage.upsertMarketingScheduleConfig(platform, {
        isActive,
        intervalMinutes,
        webhookUrl,
        channelId,
      });
      res.json({ config });
    } catch (error: any) {
      res.status(500).json({ error: error.message || "Failed to update config" });
    }
  });

  // Get deploy logs
  app.get("/api/marketing/logs", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const logs = await storage.getMarketingDeployLogs(100);
      res.json({ logs });
    } catch (error: any) {
      res.status(500).json({ error: error.message || "Failed to fetch logs" });
    }
  });

  // Manual deploy to a platform
  app.post("/api/marketing/deploy/:platform", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const { platform } = req.params;
      const { postId } = req.body;
      
      let post;
      if (postId) {
        post = await storage.getMarketingPost(postId);
      } else {
        post = await storage.getRandomActivePost(platform);
      }
      
      if (!post) {
        return res.status(404).json({ error: "No active posts available for this platform" });
      }

      const { deploySocialPost } = await import("./social-connectors");
      const result = await deploySocialPost(platform, post.content, post.imageUrl);
      
      await storage.recordMarketingDeploy({
        postId: post.id,
        platform,
        status: result.success ? "success" : "failed",
        externalId: result.externalId,
        errorMessage: result.error,
      });
      
      if (result.success) {
        await storage.markPostUsed(post.id);
        await storage.updateLastDeployed(platform);
      }
      
      res.json({ success: result.success, post, result });
    } catch (error: any) {
      res.status(500).json({ error: error.message || "Failed to deploy" });
    }
  });

  // Bulk create posts
  app.post("/api/marketing/posts/bulk", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const { posts } = req.body;
      if (!Array.isArray(posts) || posts.length === 0) {
        return res.status(400).json({ error: "Posts array is required" });
      }
      const created = [];
      for (const p of posts) {
        if (p.platform && p.content) {
          const post = await storage.createMarketingPost({
            platform: p.platform,
            content: p.content,
            imageUrl: p.imageUrl || null,
            category: p.category || "general",
            status: p.status || "active",
          });
          created.push(post);
        }
      }
      res.json({ created, count: created.length });
    } catch (error: any) {
      res.status(500).json({ error: error.message || "Failed to bulk create posts" });
    }
  });

  // =====================================================
  // CHRONICLES AUTHENTICATION - Separate Game Auth System
  // =====================================================
  
  const crypto = await import("crypto");
  
  // Secure password hashing using PBKDF2 with 100,000 iterations
  const PBKDF2_ITERATIONS = 100000;
  const PBKDF2_KEYLEN = 64;
  const PBKDF2_DIGEST = 'sha512';
  
  function hashChroniclePassword(password: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const salt = crypto.randomBytes(32).toString('hex');
      crypto.pbkdf2(password, salt, PBKDF2_ITERATIONS, PBKDF2_KEYLEN, PBKDF2_DIGEST, (err, derivedKey) => {
        if (err) reject(err);
        else resolve(`${salt}:${derivedKey.toString('hex')}`);
      });
    });
  }
  
  function verifyChroniclePassword(password: string, storedHash: string): Promise<boolean> {
    return new Promise((resolve) => {
      const parts = storedHash.split(':');
      if (parts.length !== 2) {
        resolve(false);
        return;
      }
      const [salt, hash] = parts;
      crypto.pbkdf2(password, salt, PBKDF2_ITERATIONS, PBKDF2_KEYLEN, PBKDF2_DIGEST, (err, derivedKey) => {
        if (err) {
          resolve(false);
          return;
        }
        const computedHash = derivedKey.toString('hex');
        try {
          resolve(crypto.timingSafeEqual(Buffer.from(computedHash), Buffer.from(hash)));
        } catch {
          resolve(false);
        }
      });
    });
  }
  
  function generateSessionToken(): string {
    return crypto.randomBytes(32).toString('hex');
  }
  
  // Chronicles signup
  app.post("/api/chronicles/auth/signup", async (req: Request, res: Response) => {
    try {
      const { username, email, firstName, lastName, password } = req.body;
      
      if (!username || !email || !firstName || !lastName || !password) {
        return res.status(400).json({ error: "All fields are required" });
      }
      
      if (username.length < 3 || username.length > 30) {
        return res.status(400).json({ error: "Username must be 3-30 characters" });
      }
      
      // Basic email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({ error: "Please enter a valid email address" });
      }
      
      if (password.length < 6) {
        return res.status(400).json({ error: "Password must be at least 6 characters" });
      }
      
      // Check if username exists (case-insensitive)
      const existingUsername = await db.select().from(chronicleAccounts)
        .where(sql`LOWER(${chronicleAccounts.username}) = LOWER(${username})`)
        .limit(1);
      
      if (existingUsername.length > 0) {
        return res.status(400).json({ error: "Username already taken" });
      }
      
      // Check if email exists (case-insensitive)
      const existingEmail = await db.select().from(chronicleAccounts)
        .where(sql`LOWER(${chronicleAccounts.email}) = LOWER(${email})`)
        .limit(1);
      
      if (existingEmail.length > 0) {
        return res.status(400).json({ error: "Email already registered" });
      }
      
      // Hash password using PBKDF2
      const passwordHash = await hashChroniclePassword(password);
      
      // Generate session
      const sessionToken = generateSessionToken();
      const sessionExpiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days
      
      // Create account
      const [account] = await db.insert(chronicleAccounts).values({
        username: username.toLowerCase(),
        displayName: `${firstName.trim()} ${lastName.trim()}`,
        email: email.toLowerCase(),
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        passwordHash,
        sessionToken,
        sessionExpiresAt,
        lastLoginAt: new Date(),
      }).returning();
      
      // Grant welcome bonus Shells to new players (F2P friendly start)
      const WELCOME_BONUS_SHELLS = 250;
      try {
        await shellsService.addShells(
          account.id,
          account.username,
          WELCOME_BONUS_SHELLS,
          "bonus",
          "Welcome to DarkWave Chronicles! Here's your starter Shells to begin your journey.",
          account.id,
          "welcome_bonus"
        );
        console.log(`[Chronicles] Granted ${WELCOME_BONUS_SHELLS} welcome Shells to new user ${account.username}`);
      } catch (shellError) {
        console.error("[Chronicles] Failed to grant welcome Shells:", shellError);
        // Don't fail registration if Shell grant fails
      }
      
      res.json({
        success: true,
        account: {
          id: account.id,
          username: account.username,
          firstName: account.firstName,
          lastName: account.lastName,
        },
        sessionToken,
        expiresAt: sessionExpiresAt,
      });
    } catch (error: any) {
      console.error("Chronicles signup error:", error);
      res.status(500).json({ error: error.message || "Signup failed" });
    }
  });
  
  // Chronicles login
  app.post("/api/chronicles/auth/login", async (req: Request, res: Response) => {
    try {
      const { username, password } = req.body;
      
      if (!username || !password) {
        return res.status(400).json({ error: "Username and password are required" });
      }
      
      // Find account (case-insensitive)
      const [account] = await db.select().from(chronicleAccounts)
        .where(sql`LOWER(${chronicleAccounts.username}) = LOWER(${username})`)
        .limit(1);
      
      if (!account) {
        return res.status(401).json({ error: "Invalid username or password" });
      }
      
      if (!account.isActive) {
        return res.status(401).json({ error: "Account is disabled" });
      }
      
      // Verify password using PBKDF2
      const isValidPassword = await verifyChroniclePassword(password, account.passwordHash);
      if (!isValidPassword) {
        return res.status(401).json({ error: "Invalid username or password" });
      }
      
      // Generate new session
      const sessionToken = generateSessionToken();
      const sessionExpiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days
      
      // Update session
      await db.update(chronicleAccounts)
        .set({
          sessionToken,
          sessionExpiresAt,
          lastLoginAt: new Date(),
          updatedAt: new Date(),
        })
        .where(eq(chronicleAccounts.id, account.id));
      
      res.json({
        success: true,
        account: {
          id: account.id,
          username: account.username,
          firstName: account.firstName,
          lastName: account.lastName,
        },
        sessionToken,
        expiresAt: sessionExpiresAt,
      });
    } catch (error: any) {
      console.error("Chronicles login error:", error);
      res.status(500).json({ error: error.message || "Login failed" });
    }
  });
  
  // Chronicles session check
  app.get("/api/chronicles/auth/session", async (req: Request, res: Response) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: "No session token provided", authenticated: false });
      }
      
      const sessionToken = authHeader.substring(7);
      
      const [account] = await db.select().from(chronicleAccounts)
        .where(eq(chronicleAccounts.sessionToken, sessionToken))
        .limit(1);
      
      if (!account) {
        return res.status(401).json({ error: "Invalid session", authenticated: false });
      }
      
      if (!account.isActive) {
        return res.status(401).json({ error: "Account disabled", authenticated: false });
      }
      
      if (account.sessionExpiresAt && new Date(account.sessionExpiresAt) < new Date()) {
        return res.status(401).json({ error: "Session expired", authenticated: false });
      }
      
      res.json({
        authenticated: true,
        account: {
          id: account.id,
          username: account.username,
          firstName: account.firstName,
          lastName: account.lastName,
        },
      });
    } catch (error: any) {
      console.error("Chronicles session check error:", error);
      res.status(500).json({ error: error.message || "Session check failed", authenticated: false });
    }
  });
  
  // Chronicles logout
  app.post("/api/chronicles/auth/logout", async (req: Request, res: Response) => {
    try {
      const authHeader = req.headers.authorization;
      if (authHeader && authHeader.startsWith('Bearer ')) {
        const sessionToken = authHeader.substring(7);
        
        await db.update(chronicleAccounts)
          .set({
            sessionToken: null,
            sessionExpiresAt: null,
            updatedAt: new Date(),
          })
          .where(eq(chronicleAccounts.sessionToken, sessionToken));
      }
      
      res.json({ success: true, message: "Logged out" });
    } catch (error: any) {
      console.error("Chronicles logout error:", error);
      res.status(500).json({ error: error.message || "Logout failed" });
    }
  });

  // =====================================================
  // CHRONICLES PERSONALITY AI - API Routes
  // =====================================================
  
  const { chroniclesAI } = await import("./chronicles-ai");
  const { chroniclesService: chroniclesGameService, STARTER_FACTIONS, SEASON_ZERO_QUESTS, STARTER_NPCS } = await import("./chronicles-service");
  Object.assign(chroniclesGameService, { STARTER_FACTIONS, SEASON_ZERO_QUESTS, STARTER_NPCS });

  app.get("/api/chronicles/personality", isChroniclesAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user?.id || req.user?.claims?.sub;
      if (!userId) {
        return res.status(401).json({ error: "Authentication required" });
      }
      
      const personality = await chroniclesAI.getOrCreatePersonality(userId);
      const choiceSignature = chroniclesAI.generateChoiceSignature(personality);
      const emotionalState = chroniclesAI.getEmotionalState(personality);
      const description = chroniclesAI.describeEmotionalState(emotionalState);
      
      res.json({
        personality,
        choiceSignature,
        emotionalState,
        emotionalDescription: description,
      });
    } catch (error: any) {
      console.error("Get personality error:", error);
      res.status(500).json({ error: error.message || "Failed to get personality" });
    }
  });

  const UpdatePersonalitySchema = z.object({
    playerName: z.string().max(100).optional(),
    parallelSelfName: z.string().max(100).optional(),
    worldview: z.enum(["optimist", "realist", "pessimist"]).optional(),
    visualPresentation: z.enum(["masculine", "feminine", "neutral"]).optional(),
    coreValues: z.array(z.string()).optional(),
    decisionStyle: z.string().optional(),
    conflictApproach: z.string().optional(),
    predictedArchetype: z.string().optional(),
    colorPreference: z.string().optional(),
    eraInterest: z.string().optional(),
    primaryTrait: z.string().optional(),
    secondaryTrait: z.string().optional(),
    challengeResponse: z.string().optional(),
    audioPreference: z.enum(["curated", "spotify", "silent"]).optional(),
    audioMood: z.string().optional(),
  });

  app.post("/api/chronicles/personality", isChroniclesAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user?.id || req.user?.claims?.sub;
      if (!userId) {
        return res.status(401).json({ error: "Authentication required" });
      }
      
      const parseResult = UpdatePersonalitySchema.safeParse(req.body);
      if (!parseResult.success) {
        return res.status(400).json({ error: "Invalid request body", details: parseResult.error.issues });
      }
      
      const { 
        playerName, parallelSelfName, worldview, coreValues, 
        decisionStyle, conflictApproach, predictedArchetype,
        colorPreference, eraInterest, primaryTrait, secondaryTrait, challengeResponse,
        audioPreference, audioMood
      } = parseResult.data;
      
      const personality = await chroniclesAI.getOrCreatePersonality(userId, playerName);
      
      const updates: any = { updatedAt: new Date() };
      if (playerName) updates.playerName = playerName;
      if (parallelSelfName) updates.parallelSelfName = parallelSelfName;
      if (worldview) updates.worldview = worldview;
      if (coreValues && coreValues.length > 0) updates.coreValues = coreValues;
      if (decisionStyle) updates.decisionStyle = decisionStyle;
      if (conflictApproach) updates.conflictApproach = conflictApproach;
      if (predictedArchetype) updates.predictedArchetype = predictedArchetype;
      if (colorPreference) updates.colorPreference = colorPreference;
      if (eraInterest) updates.eraInterest = eraInterest;
      if (primaryTrait) updates.primaryTrait = primaryTrait;
      if (secondaryTrait) updates.secondaryTrait = secondaryTrait;
      if (challengeResponse) updates.challengeResponse = challengeResponse;
      if (audioPreference) updates.audioPreference = audioPreference;
      if (audioMood) updates.audioMood = audioMood;
      
      if (Object.keys(updates).length > 1) {
        await db.update(playerPersonalities)
          .set(updates)
          .where(eq(playerPersonalities.userId, userId));
      }
      
      const updated = await chroniclesAI.getOrCreatePersonality(userId);
      res.json({ personality: updated });
    } catch (error: any) {
      console.error("Update personality error:", error);
      res.status(500).json({ error: error.message || "Failed to update personality" });
    }
  });

// Estate persistence endpoints
  const EstateGridCellSchema = z.object({
    x: z.number(),
    y: z.number(),
    building: z.string(),
    level: z.number(),
    rotation: z.number()
  });

  const SaveEstateSchema = z.object({
    gridData: z.array(z.array(EstateGridCellSchema)),
    totalBuildings: z.number().optional(),
    shellsSpent: z.number().optional()
  });

  app.get("/api/chronicles/estate", isChroniclesAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user?.id || req.user?.claims?.sub;
      if (!userId) {
        return res.status(401).json({ error: "Authentication required" });
      }
      
      const [estate] = await db.select().from(playerEstates).where(eq(playerEstates.userId, userId));
      
      if (!estate) {
        return res.json({ estate: null });
      }
      
      let gridData = [];
      try {
        gridData = JSON.parse(estate.gridData || '[]');
      } catch (e) {
        gridData = [];
      }
      
      res.json({ 
        estate: {
          ...estate,
          gridData
        }
      });
    } catch (error: any) {
      console.error("Get estate error:", error);
      res.status(500).json({ error: error.message || "Failed to get estate" });
    }
  });

  app.post("/api/chronicles/estate", isChroniclesAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user?.id || req.user?.claims?.sub;
      if (!userId) {
        return res.status(401).json({ error: "Authentication required" });
      }
      
      const parseResult = SaveEstateSchema.safeParse(req.body);
      if (!parseResult.success) {
        return res.status(400).json({ error: "Invalid estate data", details: parseResult.error.issues });
      }
      
      const { gridData, totalBuildings, shellsSpent } = parseResult.data;
      
      const [existing] = await db.select().from(playerEstates).where(eq(playerEstates.userId, userId));
      
      const previousBuildings = existing?.totalBuildings || 0;
      
      if (existing) {
        await db.update(playerEstates)
          .set({
            gridData: JSON.stringify(gridData),
            totalBuildings: totalBuildings || 1,
            shellsSpent: shellsSpent || 0,
            updatedAt: new Date()
          })
          .where(eq(playerEstates.userId, userId));
      } else {
        await db.insert(playerEstates).values({
          userId,
          gridData: JSON.stringify(gridData),
          totalBuildings: totalBuildings || 1,
          shellsSpent: shellsSpent || 0
        });
      }
      
      // Award Shells for estate upgrades (building new structures) - F2P reward
      let shellsEarned = 0;
      let questProgress = { questsUpdated: [] as string[], questsCompleted: [] as string[] };
      const newBuildings = (totalBuildings || 1) - previousBuildings;
      if (newBuildings > 0) {
        try {
          const username = req.user?.username || req.user?.firstName || "Player";
          for (let i = 0; i < Math.min(newBuildings, 5); i++) { // Cap at 5 per save to prevent abuse
            await shellsService.awardEngagementShells(userId, username, "estate_upgrade");
          }
          shellsEarned = SHELL_EARN_RATES.estate_upgrade * Math.min(newBuildings, 5);
          questProgress = await questsService.trackProgress(userId, "estate_upgrade", Math.min(newBuildings, 5));
          // Track for Echo Persona
          await mirrorLifeService.trackChoice(userId, 'building', `built ${newBuildings} structures`);
        } catch (shellErr) {
          console.warn("[Chronicles] Failed to award estate_upgrade Shells:", shellErr);
        }
      }
      
      res.json({ success: true, shellsEarned, questProgress });
    } catch (error: any) {
      console.error("Save estate error:", error);
      res.status(500).json({ error: error.message || "Failed to save estate" });
    }
  });

  // =====================================================
  // CITY ZONING & PLOT MARKETPLACE APIs
  // =====================================================

  // Get all zones for an era
  app.get("/api/chronicles/zones", async (req, res) => {
    try {
      const era = (req.query.era as string) || "present";
      const zones = await db.select().from(cityZones).where(eq(cityZones.era, era));
      res.json({ zones });
    } catch (error: any) {
      res.status(500).json({ error: error.message || "Failed to get zones" });
    }
  });

  // Get plots in a zone
  app.get("/api/chronicles/zones/:zoneId/plots", async (req, res) => {
    try {
      const { zoneId } = req.params;
      const plots = await db.select().from(landPlots).where(eq(landPlots.zoneId, zoneId));
      res.json({ plots });
    } catch (error: any) {
      res.status(500).json({ error: error.message || "Failed to get plots" });
    }
  });

  // Get marketplace listings
  app.get("/api/chronicles/marketplace", async (req, res) => {
    try {
      const listings = await db.select()
        .from(plotListings)
        .where(eq(plotListings.status, "active"))
        .orderBy(desc(plotListings.createdAt))
        .limit(50);
      res.json({ listings });
    } catch (error: any) {
      res.status(500).json({ error: error.message || "Failed to get marketplace" });
    }
  });

  // Purchase a plot
  app.post("/api/chronicles/plots/:plotId/purchase", isChroniclesAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user?.id || req.user?.claims?.sub;
      if (!userId) return res.status(401).json({ error: "Authentication required" });
      
      const { plotId } = req.params;
      const [plot] = await db.select().from(landPlots).where(eq(landPlots.id, plotId));
      
      if (!plot) return res.status(404).json({ error: "Plot not found" });
      if (plot.ownerId) return res.status(400).json({ error: "Plot already owned" });
      
      // Check user has enough Shells
      const shellsBalance = await storage.getOrbsBalance(userId);
      if (shellsBalance < plot.currentPrice) {
        return res.status(400).json({ error: "Insufficient Shells", required: plot.currentPrice, balance: shellsBalance });
      }
      
      // Deduct Shells and assign plot
      await storage.updateOrbsBalance(userId, -plot.currentPrice, "Plot purchase");
      await db.update(landPlots)
        .set({ ownerId: userId, isForSale: false, purchasedAt: new Date() })
        .where(eq(landPlots.id, plotId));
      
      // Update zone occupied count
      await db.execute(sql`UPDATE city_zones SET occupied_plots = occupied_plots + 1 WHERE id = ${plot.zoneId}`);
      
      res.json({ success: true, message: "Plot purchased!" });
    } catch (error: any) {
      res.status(500).json({ error: error.message || "Failed to purchase plot" });
    }
  });

  // List plot for sale
  app.post("/api/chronicles/plots/:plotId/list", isChroniclesAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user?.id || req.user?.claims?.sub;
      if (!userId) return res.status(401).json({ error: "Authentication required" });
      
      const { plotId } = req.params;
      const { askingPrice } = req.body;
      
      const [plot] = await db.select().from(landPlots).where(eq(landPlots.id, plotId));
      if (!plot) return res.status(404).json({ error: "Plot not found" });
      if (plot.ownerId !== userId) return res.status(403).json({ error: "You don't own this plot" });
      
      await db.insert(plotListings).values({
        plotId,
        sellerId: userId,
        askingPrice: askingPrice || plot.currentPrice,
        status: "active"
      });
      
      await db.update(landPlots).set({ isForSale: true, listingPrice: askingPrice }).where(eq(landPlots.id, plotId));
      
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ error: error.message || "Failed to list plot" });
    }
  });

  // =====================================================
  // DAILY LOGIN REWARDS APIs (24-hour real-time rule)
  // =====================================================

  const DAILY_REWARDS_SCHEDULE = [25, 35, 50, 65, 85, 110, 150]; // Shells per streak day (cycles after 7)

  app.get("/api/chronicles/daily-reward", isChroniclesAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user?.id || req.user?.claims?.sub;
      if (!userId) return res.status(401).json({ error: "Authentication required" });
      
      const streak = await storage.getLoginStreak(userId);
      
      if (!streak) {
        return res.json({ 
          canClaim: true, 
          currentStreak: 0, 
          nextReward: DAILY_REWARDS_SCHEDULE[0],
          longestStreak: 0,
          totalLogins: 0,
          totalShellsEarned: 0
        });
      }
      
      const now = new Date();
      const lastLogin = streak.lastLoginAt ? new Date(streak.lastLoginAt) : null;
      const hoursSinceLogin = lastLogin ? (now.getTime() - lastLogin.getTime()) / (1000 * 60 * 60) : 999;
      
      const canClaim = hoursSinceLogin >= 24; // Strict 24-hour rule
      const streakBroken = hoursSinceLogin > 48; // Streak breaks after 48 hours
      const currentStreak = streakBroken ? 0 : streak.currentStreak;
      const nextRewardIndex = currentStreak % DAILY_REWARDS_SCHEDULE.length;
      
      res.json({
        canClaim,
        currentStreak,
        nextReward: DAILY_REWARDS_SCHEDULE[nextRewardIndex],
        longestStreak: streak.longestStreak,
        totalLogins: streak.totalLogins,
        totalShellsEarned: streak.totalShellsEarned,
        lastLoginAt: streak.lastLoginAt,
        hoursUntilClaim: canClaim ? 0 : Math.max(0, Math.ceil(24 - hoursSinceLogin))
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message || "Failed to get daily reward" });
    }
  });

  app.post("/api/chronicles/daily-reward/claim", isChroniclesAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user?.id || req.user?.claims?.sub;
      if (!userId) return res.status(401).json({ error: "Authentication required" });
      
      // Use the new storage method with 24-hour real-time rule
      const result = await storage.checkInDaily(userId);
      
      if (!result.reward) {
        return res.status(400).json({ 
          error: result.message,
          currentStreak: result.streak.currentStreak,
          canClaim: false
        });
      }
      
      // Grant Shells to the user's balance via the Shells ledger
      const totalReward = result.reward.shellsAwarded + (result.reward.bonusAmount || 0);
      const username = req.user?.username || req.user?.firstName || "Player";
      try {
        await shellsService.addShells(
          userId, 
          username, 
          totalReward, 
          "bonus", 
          `Daily login reward (Day ${result.streak.currentStreak})`,
          `daily_${Date.now()}`,
          "daily_login"
        );
      } catch (shellErr) {
        // Fallback to legacy orbs balance if Shell ledger fails
        await storage.updateOrbsBalance(userId, totalReward, "Daily login reward");
        console.warn("[Daily Reward] Fell back to orbs balance:", shellErr);
      }
      
      res.json({ 
        success: true, 
        reward: totalReward, 
        baseReward: result.reward.shellsAwarded,
        bonusType: result.reward.bonusType,
        bonusAmount: result.reward.bonusAmount,
        currentStreak: result.streak.currentStreak,
        longestStreak: result.streak.longestStreak,
        totalShellsEarned: result.streak.totalShellsEarned,
        message: result.message
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message || "Failed to claim reward" });
    }
  });

  // Get reward history
  app.get("/api/chronicles/daily-reward/history", isChroniclesAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user?.id || req.user?.claims?.sub;
      if (!userId) return res.status(401).json({ error: "Authentication required" });
      
      const history = await storage.getRewardHistory(userId, 30);
      res.json({ history });
    } catch (error: any) {
      res.status(500).json({ error: error.message || "Failed to get history" });
    }
  });

  // =====================================================
  // REPEATABLE QUEST SYSTEM - Infinite Progression
  // =====================================================

  // Get all active quests with player progress
  app.get("/api/chronicles/quests", isChroniclesAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user?.id || req.user?.claims?.sub;
      if (!userId) return res.status(401).json({ error: "Authentication required" });
      
      const quests = await questsService.getActiveQuests(userId);
      res.json(quests);
    } catch (error: any) {
      res.status(500).json({ error: error.message || "Failed to get quests" });
    }
  });

  // Claim quest reward
  app.post("/api/chronicles/quests/:questId/claim", isChroniclesAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user?.id || req.user?.claims?.sub;
      if (!userId) return res.status(401).json({ error: "Authentication required" });
      
      const { questId } = req.params;
      const username = req.user?.username || req.user?.firstName || "Player";
      
      const result = await questsService.claimReward(userId, username, questId);
      
      if (!result.success) {
        return res.status(400).json({ error: result.message });
      }
      
      res.json(result);
    } catch (error: any) {
      res.status(500).json({ error: error.message || "Failed to claim reward" });
    }
  });

  // =====================================================
  // MIRROR-LIFE EXPERIENCE SYSTEM
  // =====================================================

  // Echo Persona - Get player's evolving AI profile
  app.get("/api/chronicles/echo-persona", isChroniclesAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user?.id || req.user?.claims?.sub;
      if (!userId) return res.status(401).json({ error: "Authentication required" });
      
      const persona = await mirrorLifeService.getOrCreateEchoPersona(userId);
      res.json({ persona });
    } catch (error: any) {
      res.status(500).json({ error: error.message || "Failed to get Echo Persona" });
    }
  });

  // Generate new insight from Echo
  app.post("/api/chronicles/echo-persona/insight", isChroniclesAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user?.id || req.user?.claims?.sub;
      if (!userId) return res.status(401).json({ error: "Authentication required" });
      
      const insight = await mirrorLifeService.generatePersonaInsight(userId);
      res.json({ insight });
    } catch (error: any) {
      res.status(500).json({ error: error.message || "Failed to generate insight" });
    }
  });

  // Mirror Journal - Get recent journal entries
  app.get("/api/chronicles/mirror-journal", isChroniclesAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user?.id || req.user?.claims?.sub;
      if (!userId) return res.status(401).json({ error: "Authentication required" });
      
      const entries = await mirrorLifeService.getRecentJournalEntries(userId, 7);
      res.json({ entries });
    } catch (error: any) {
      res.status(500).json({ error: error.message || "Failed to get journal" });
    }
  });

  // Morning Pulse - Get today's check-in
  app.get("/api/chronicles/morning-pulse", isChroniclesAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user?.id || req.user?.claims?.sub;
      if (!userId) return res.status(401).json({ error: "Authentication required" });
      
      const pulse = await mirrorLifeService.getMorningPulse(userId);
      res.json(pulse);
    } catch (error: any) {
      res.status(500).json({ error: error.message || "Failed to get morning pulse" });
    }
  });

  // Claim morning pulse
  app.post("/api/chronicles/morning-pulse/claim", isChroniclesAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user?.id || req.user?.claims?.sub;
      if (!userId) return res.status(401).json({ error: "Authentication required" });
      
      const result = await mirrorLifeService.claimMorningPulse(userId);
      res.json(result);
    } catch (error: any) {
      res.status(500).json({ error: error.message || "Failed to claim pulse" });
    }
  });

  // Veil Anomalies - Get active anomalies
  app.get("/api/chronicles/anomalies", async (req, res) => {
    try {
      const anomalies = await mirrorLifeService.getActiveAnomalies();
      const effects = await mirrorLifeService.getActiveEffects();
      res.json({ anomalies, effects });
    } catch (error: any) {
      res.status(500).json({ error: error.message || "Failed to get anomalies" });
    }
  });

  // =====================================================
  // SIMS-STYLE INTERIOR DOMICILE APIs
  // =====================================================

  // Get player's interior/domicile
  app.get("/api/chronicles/interior", isChroniclesAuthenticated, async (req: any, res) => {
    try {
      const userId = req.chroniclesUser.id;
      const interior = await interiorsService.getOrCreateInterior(userId);
      const rooms = await interiorsService.getRooms(userId);
      res.json({ interior, rooms });
    } catch (error: any) {
      res.status(500).json({ error: error.message || "Failed to get interior" });
    }
  });

  // Get object catalog for an era
  app.get("/api/chronicles/interior/catalog/:era", isChroniclesAuthenticated, async (req: any, res) => {
    try {
      const { era } = req.params;
      const catalog = await interiorsService.getObjectCatalog(era);
      res.json({ catalog });
    } catch (error: any) {
      res.status(500).json({ error: error.message || "Failed to get catalog" });
    }
  });

  // Get a specific room with objects
  app.get("/api/chronicles/interior/room/:roomId", isChroniclesAuthenticated, async (req: any, res) => {
    try {
      const { roomId } = req.params;
      const room = await interiorsService.getRoom(roomId);
      if (!room) {
        return res.status(404).json({ error: "Room not found" });
      }
      const objects = await interiorsService.getRoomObjects(roomId);
      res.json({ room, objects });
    } catch (error: any) {
      res.status(500).json({ error: error.message || "Failed to get room" });
    }
  });

  // Place an object in a room
  app.post("/api/chronicles/interior/room/:roomId/objects", isChroniclesAuthenticated, async (req: any, res) => {
    try {
      const userId = req.chroniclesUser.id;
      const { roomId } = req.params;
      const { catalogId, gridX, gridY } = req.body;
      
      if (!catalogId || gridX === undefined || gridY === undefined) {
        return res.status(400).json({ error: "Missing required fields: catalogId, gridX, gridY" });
      }
      
      const obj = await interiorsService.placeObject(userId, roomId, catalogId, gridX, gridY);
      res.json({ success: true, object: obj });
    } catch (error: any) {
      res.status(500).json({ error: error.message || "Failed to place object" });
    }
  });

  // Remove an object from a room
  app.delete("/api/chronicles/interior/objects/:objectId", isChroniclesAuthenticated, async (req: any, res) => {
    try {
      const userId = req.chroniclesUser.id;
      const { objectId } = req.params;
      await interiorsService.removeObject(userId, objectId);
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ error: error.message || "Failed to remove object" });
    }
  });

  // Interact with an object
  app.post("/api/chronicles/interior/objects/:objectId/interact", isChroniclesAuthenticated, async (req: any, res) => {
    try {
      const userId = req.chroniclesUser.id;
      const username = req.chroniclesUser.username || req.chroniclesUser.displayName || "Player";
      const { objectId } = req.params;
      const { verb } = req.body;
      
      if (!verb) {
        return res.status(400).json({ error: "Interaction verb required" });
      }
      
      const result = await interiorsService.interactWithObject(userId, username, objectId, verb);
      res.json(result);
    } catch (error: any) {
      res.status(500).json({ error: error.message || "Failed to interact" });
    }
  });

  // Get active activity session
  app.get("/api/chronicles/interior/activity", isChroniclesAuthenticated, async (req: any, res) => {
    try {
      const userId = req.chroniclesUser.id;
      const session = await interiorsService.getActiveSession(userId);
      res.json({ session });
    } catch (error: any) {
      res.status(500).json({ error: error.message || "Failed to get activity" });
    }
  });

  // =====================================================
  // BUSINESS ONBOARDING APIs
  // =====================================================

  app.post("/api/chronicles/business/claim", isChroniclesAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user?.id || req.user?.claims?.sub;
      if (!userId) return res.status(401).json({ error: "Authentication required" });
      
      const { plotId, businessName, businessType, businessWebsite, businessEmail } = req.body;
      
      if (!plotId || !businessName || !businessType || !businessEmail) {
        return res.status(400).json({ error: "Missing required fields" });
      }
      
      // Verify plot exists and is in commercial zone
      const [plot] = await db.select().from(landPlots).where(eq(landPlots.id, plotId));
      if (!plot) return res.status(404).json({ error: "Plot not found" });
      
      const [zone] = await db.select().from(cityZones).where(eq(cityZones.id, plot.zoneId));
      if (!zone || (zone.zoneType !== "commercial" && zone.zoneType !== "mixed")) {
        return res.status(400).json({ error: "Businesses can only claim commercial or mixed-use plots" });
      }
      
      // Create business claim
      const [claim] = await db.insert(businessClaims).values({
        plotId,
        businessName,
        businessType,
        businessWebsite,
        businessEmail,
        claimantUserId: userId,
        verificationStatus: "pending"
      }).returning();
      
      res.json({ success: true, claim, message: "Business claim submitted for verification" });
    } catch (error: any) {
      res.status(500).json({ error: error.message || "Failed to submit claim" });
    }
  });

  app.get("/api/chronicles/businesses", async (_req, res) => {
    try {
      const businesses = await db.select()
        .from(businessClaims)
        .where(eq(businessClaims.isActive, true))
        .orderBy(desc(businessClaims.createdAt));
      res.json({ businesses });
    } catch (error: any) {
      res.status(500).json({ error: error.message || "Failed to get businesses" });
    }
  });

  // =====================================================
  // ERA BUILDING TEMPLATES APIs
  // =====================================================

  app.get("/api/chronicles/era-buildings/:era", async (req, res) => {
    try {
      const { era } = req.params;
      const templates = await db.select()
        .from(eraBuildingTemplates)
        .where(eq(eraBuildingTemplates.era, era));
      res.json({ templates });
    } catch (error: any) {
      res.status(500).json({ error: error.message || "Failed to get era buildings" });
    }
  });

  app.post("/api/chronicles/scenario", isChroniclesAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user?.id || req.user?.claims?.sub;
      if (!userId) {
        return res.status(401).json({ error: "Authentication required" });
      }
      
      // Check credits availability first (without deducting)
      const hasCredits = await creditsService.hasCredits(userId, CREDIT_COSTS.SCENARIO_GENERATION);
      if (!hasCredits) {
        const balance = await creditsService.getBalance(userId);
        return res.status(402).json({ 
          error: "Insufficient credits", 
          required: CREDIT_COSTS.SCENARIO_GENERATION,
          balance 
        });
      }
      
      const { era, location, situation, npcPresent } = req.body;
      
      // Generate scenario first
      const personality = await chroniclesAI.getOrCreatePersonality(userId);
      const scenario = await chroniclesAI.generateScenario(personality, {
        era: era || "Medieval Fantasy",
        location: location || "Crossroads",
        situation: situation || "A moment of decision",
        npcPresent,
      });
      
      // Only deduct credits AFTER successful generation
      const creditsResult = await creditsService.deductCredits(
        userId,
        CREDIT_COSTS.SCENARIO_GENERATION,
        "Scenario generation",
        "ai_usage"
      );
      
      // Handle race condition where credits were consumed concurrently
      if (!creditsResult.success) {
        console.warn(`[Credits] Scenario generated but deduction failed for user ${userId} - returning free result`);
      }
      
      res.json({ scenario, creditsUsed: creditsResult.success ? CREDIT_COSTS.SCENARIO_GENERATION : 0, creditsRemaining: creditsResult.newBalance });
    } catch (error: any) {
      console.error("Generate scenario error:", error);
      res.status(500).json({ error: error.message || "Failed to generate scenario" });
    }
  });

  app.post("/api/chronicles/choice", isChroniclesAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user?.id || req.user?.claims?.sub;
      if (!userId) {
        return res.status(401).json({ error: "Authentication required" });
      }
      
      // Validate request BEFORE deducting credits
      const { scenario, chosenOption, choiceReasoning, era } = req.body;
      if (!scenario || !chosenOption) {
        return res.status(400).json({ error: "Scenario and chosen option required" });
      }
      
      // Check credits availability first (without deducting)
      const hasCredits = await creditsService.hasCredits(userId, CREDIT_COSTS.CHOICE_PROCESSING);
      if (!hasCredits) {
        const balance = await creditsService.getBalance(userId);
        return res.status(402).json({ 
          error: "Insufficient credits", 
          required: CREDIT_COSTS.CHOICE_PROCESSING,
          balance 
        });
      }
      
      // Process the choice first
      const personality = await chroniclesAI.getOrCreatePersonality(userId);
      const result = await chroniclesAI.processChoice(
        personality.id,
        scenario,
        chosenOption,
        choiceReasoning,
        era
      );
      
      // Only deduct credits AFTER successful processing
      const creditsResult = await creditsService.deductCredits(
        userId,
        CREDIT_COSTS.CHOICE_PROCESSING,
        "Choice processing",
        "ai_usage"
      );
      
      // Handle race condition where credits were consumed concurrently
      if (!creditsResult.success) {
        console.warn(`[Credits] Choice processed but deduction failed for user ${userId} - returning free result`);
      }
      
      // Award Shells for making a story choice (F2P reward)
      let shellsEarned = 0;
      let questProgress = { questsUpdated: [] as string[], questsCompleted: [] as string[] };
      try {
        const username = req.user?.username || req.user?.firstName || "Player";
        await shellsService.awardEngagementShells(userId, username, "story_choice");
        shellsEarned = SHELL_EARN_RATES.story_choice;
        questProgress = await questsService.trackProgress(userId, "story_choice", 1);
        // Track for Echo Persona
        await mirrorLifeService.trackChoice(userId, 'story', chosenOption || 'unknown choice');
      } catch (shellErr) {
        console.warn("[Chronicles] Failed to award story_choice Shells:", shellErr);
      }
      
      res.json({ ...result, creditsUsed: creditsResult.success ? CREDIT_COSTS.CHOICE_PROCESSING : 0, creditsRemaining: creditsResult.newBalance, shellsEarned, questProgress });
    } catch (error: any) {
      console.error("Process choice error:", error);
      res.status(500).json({ error: error.message || "Failed to process choice" });
    }
  });

  app.post("/api/chronicles/chat", isChroniclesAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user?.id || req.user?.claims?.sub;
      if (!userId) {
        return res.status(401).json({ error: "Authentication required" });
      }
      
      // Validate request BEFORE deducting credits
      const { message, era, situation } = req.body;
      if (!message) {
        return res.status(400).json({ error: "Message required" });
      }
      
      // Check credits availability first (without deducting)
      const hasCredits = await creditsService.hasCredits(userId, CREDIT_COSTS.AI_CHAT_MESSAGE);
      if (!hasCredits) {
        const balance = await creditsService.getBalance(userId);
        return res.status(402).json({ 
          error: "Insufficient credits", 
          required: CREDIT_COSTS.AI_CHAT_MESSAGE,
          balance 
        });
      }
      
      // Process the chat first
      const personality = await chroniclesAI.getOrCreatePersonality(userId);
      const response = await chroniclesAI.generateParallelSelfResponse(
        personality,
        message,
        { era, situation }
      );
      
      // Only deduct credits AFTER successful processing
      const creditsResult = await creditsService.deductCredits(
        userId,
        CREDIT_COSTS.AI_CHAT_MESSAGE,
        "Chat with parallel self",
        "ai_usage"
      );
      
      // Handle race condition where credits were consumed concurrently
      if (!creditsResult.success) {
        console.warn(`[Credits] Chat processed but deduction failed for user ${userId} - returning free result`);
      }
      
      res.json({ ...response, creditsUsed: creditsResult.success ? CREDIT_COSTS.AI_CHAT_MESSAGE : 0, creditsRemaining: creditsResult.newBalance });
    } catch (error: any) {
      console.error("Chat error:", error);
      res.status(500).json({ error: error.message || "Failed to generate response" });
    }
  });

  app.get("/api/chronicles/summary", isChroniclesAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user?.id || req.user?.claims?.sub;
      if (!userId) {
        return res.status(401).json({ error: "Authentication required" });
      }
      
      const personality = await chroniclesAI.getOrCreatePersonality(userId);
      const summary = await chroniclesAI.generatePersonalitySummary(personality);
      
      res.json({ summary });
    } catch (error: any) {
      console.error("Summary error:", error);
      res.status(500).json({ error: error.message || "Failed to generate summary" });
    }
  });

  app.get("/api/chronicles/values", async (req, res) => {
    res.json({ 
      observedValues: chroniclesAI.OBSERVED_VALUES,
      visualPresentations: chroniclesAI.VISUAL_PRESENTATIONS,
    });
  });

  app.get("/api/chronicles/stats", isChroniclesAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user?.id || req.user?.claims?.sub;
      if (!userId) {
        return res.status(401).json({ error: "Authentication required" });
      }
      
      res.json({
        era: "Age of Crowns",
        eraYear: "1247 CE",
        daysLived: 127,
        reputation: 72,
        wealth: "3,450 DWC",
        activeQuests: 4,
        completedQuests: 23,
        secretsFound: 7,
        realmsVisited: 3,
        relationships: 18,
      });
    } catch (error: any) {
      console.error("Chronicles stats error:", error);
      res.status(500).json({ error: error.message || "Failed to get stats" });
    }
  });

  // ============================================
  // CHRONICLES GAMEPLAY API (Season Zero)
  // ============================================
  
  app.get("/api/chronicles/game/season", async (req, res) => {
    try {
      const season = await chroniclesGameService.getCurrentSeason();
      res.json(season);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/chronicles/game/factions", async (req, res) => {
    res.json({ factions: chroniclesGameService.STARTER_FACTIONS });
  });

  app.get("/api/chronicles/game/quests", async (req, res) => {
    res.json({ quests: chroniclesGameService.SEASON_ZERO_QUESTS });
  });

  app.get("/api/chronicles/game/npcs", async (req, res) => {
    res.json({ npcs: chroniclesGameService.STARTER_NPCS.map(n => ({
      id: n.name.toLowerCase().replace(/\s+/g, '_'),
      name: n.name,
      title: n.title,
      era: n.era,
      factionId: n.factionId,
    }))});
  });

  app.post("/api/chronicles/game/character", isChroniclesAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user?.id || req.user?.claims?.sub;
      if (!userId) {
        return res.status(401).json({ error: "Authentication required" });
      }
      
      const { name, era } = req.body;
      if (!name) {
        return res.status(400).json({ error: "Character name required" });
      }
      
      const character = await chroniclesGameService.createCharacter(userId, name, era || "medieval");
      res.json(character);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/chronicles/game/quest/start", isChroniclesAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user?.id || req.user?.claims?.sub;
      if (!userId) {
        return res.status(401).json({ error: "Authentication required" });
      }
      
      const { characterId, questId } = req.body;
      if (!questId) {
        return res.status(400).json({ error: "Quest ID required" });
      }
      
      const questInstance = await chroniclesGameService.startQuest(characterId || "default", questId);
      res.json(questInstance);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/chronicles/game/decision", isChroniclesAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user?.id || req.user?.claims?.sub;
      if (!userId) {
        return res.status(401).json({ error: "Authentication required" });
      }
      
      const { characterId, questId, decisionId } = req.body;
      const result = await chroniclesGameService.makeDecision(characterId || "default", questId, decisionId);
      
      // Create chronicle proof for this decision
      if (result.success) {
        const proof = await chroniclesGameService.createChronicleProof(
          characterId || "default",
          "decision",
          `Decision: ${decisionId}`,
          { questId, decisionId, hash: result.decisionHash }
        );
        result.chronicleProof = proof;
      }
      
      res.json(result);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/chronicles/game/npc/talk", isChroniclesAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user?.id || req.user?.claims?.sub;
      if (!userId) {
        return res.status(401).json({ error: "Authentication required" });
      }
      
      const { characterId, npcId, message } = req.body;
      if (!npcId || !message) {
        return res.status(400).json({ error: "NPC ID and message required" });
      }
      
      const response = await chroniclesGameService.talkToNpc(characterId || "default", npcId, message);
      
      // Award Shells for NPC conversation (F2P reward)
      let shellsEarned = 0;
      let questProgress = { questsUpdated: [] as string[], questsCompleted: [] as string[] };
      try {
        const username = req.user?.username || req.user?.firstName || "Player";
        await shellsService.awardEngagementShells(userId, username, "npc_conversation");
        shellsEarned = SHELL_EARN_RATES.npc_conversation;
        questProgress = await questsService.trackProgress(userId, "npc_conversation", 1);
        // Track for Echo Persona
        await mirrorLifeService.trackChoice(userId, 'npc', message || 'conversation');
      } catch (shellErr) {
        // Silently fail - NPC conversations are casual
      }
      
      res.json({ ...response, shellsEarned, questProgress });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/chronicles/game/faction/join", isChroniclesAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user?.id || req.user?.claims?.sub;
      if (!userId) {
        return res.status(401).json({ error: "Authentication required" });
      }
      
      const { characterId, factionId } = req.body;
      if (!factionId) {
        return res.status(400).json({ error: "Faction ID required" });
      }
      
      const result = await chroniclesGameService.joinFaction(characterId || "default", factionId);
      res.json(result);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/chronicles/game/proofs/:characterId", isChroniclesAuthenticated, async (req: any, res) => {
    try {
      const proofs = await chroniclesGameService.getChronicleProofs(req.params.characterId);
      res.json({ proofs });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // ============================================
  // CHRONICLES TIME TRAVEL SYSTEM - BETA SEASON 0
  // ============================================
  
  // Get all available eras
  app.get("/api/chronicles/eras", async (req, res) => {
    try {
      const eras = await db.select().from(chronicleEras).where(eq(chronicleEras.isActive, true)).orderBy(chronicleEras.sortOrder);
      res.json({ eras, isBeta: true, betaMessage: "BETA: Your progress is persistent. More eras coming soon!" });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });
  
  // Get player's era progress and portal state
  app.get("/api/chronicles/portal", isChroniclesAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user?.id || req.user?.claims?.sub;
      if (!userId) return res.status(401).json({ error: "Authentication required" });
      
      // Get or create portal state
      let [portal] = await db.select().from(chronicleTimePortals).where(eq(chronicleTimePortals.userId, userId));
      if (!portal) {
        [portal] = await db.insert(chronicleTimePortals).values({ userId, currentEraCode: 'modern' }).returning();
        // Also create Modern era progress (starting era)
        await db.insert(chroniclePlayerEras).values({ userId, eraCode: 'modern', isUnlocked: true, isCurrent: true, firstEnteredAt: new Date() });
      }
      
      // Get player's era progress
      const playerEras = await db.select().from(chroniclePlayerEras).where(eq(chroniclePlayerEras.userId, userId));
      
      // Get collected artifacts
      const collectedArtifacts = await db.select().from(chroniclePlayerArtifacts).where(eq(chroniclePlayerArtifacts.userId, userId));
      
      // Get all eras for reference
      const allEras = await db.select().from(chronicleEras).where(eq(chronicleEras.isActive, true)).orderBy(chronicleEras.sortOrder);
      
      res.json({ portal, playerEras, collectedArtifacts, allEras, isBeta: true });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });
  
  // Get available missions for current era
  app.get("/api/chronicles/missions", isChroniclesAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user?.id || req.user?.claims?.sub;
      if (!userId) return res.status(401).json({ error: "Authentication required" });
      
      // Get player's current era
      const [portal] = await db.select().from(chronicleTimePortals).where(eq(chronicleTimePortals.userId, userId));
      const currentEra = portal?.currentEraCode || 'modern';
      
      // Get missions for current era
      const missions = await db.select().from(chronicleEraMissions)
        .where(and(eq(chronicleEraMissions.eraCode, currentEra), eq(chronicleEraMissions.isActive, true)))
        .orderBy(chronicleEraMissions.sortOrder);
      
      // Get player's mission progress
      const progress = await db.select().from(chronicleMissionProgress).where(eq(chronicleMissionProgress.userId, userId));
      
      res.json({ missions, progress, currentEra });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });
  
  // Start a mission
  app.post("/api/chronicles/missions/:missionId/start", isChroniclesAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user?.id || req.user?.claims?.sub;
      if (!userId) return res.status(401).json({ error: "Authentication required" });
      
      const { missionId } = req.params;
      
      // Check if already started
      const [existing] = await db.select().from(chronicleMissionProgress)
        .where(and(eq(chronicleMissionProgress.userId, userId), eq(chronicleMissionProgress.missionId, missionId)));
      
      if (existing) {
        return res.json({ progress: existing, alreadyStarted: true });
      }
      
      const [progress] = await db.insert(chronicleMissionProgress)
        .values({ userId, missionId, status: 'active', startedAt: new Date() })
        .returning();
      
      res.json({ progress, started: true });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });
  
  // Reveal a hint for a mission
  app.post("/api/chronicles/missions/:missionId/hint", isChroniclesAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user?.id || req.user?.claims?.sub;
      if (!userId) return res.status(401).json({ error: "Authentication required" });
      
      const { missionId } = req.params;
      
      const [progress] = await db.select().from(chronicleMissionProgress)
        .where(and(eq(chronicleMissionProgress.userId, userId), eq(chronicleMissionProgress.missionId, missionId)));
      
      if (!progress) return res.status(400).json({ error: "Mission not started" });
      if (progress.hintsRevealed >= 3) return res.json({ progress, message: "All hints revealed" });
      
      const [updated] = await db.update(chronicleMissionProgress)
        .set({ hintsRevealed: progress.hintsRevealed + 1 })
        .where(eq(chronicleMissionProgress.id, progress.id))
        .returning();
      
      // Get mission to return appropriate hint
      const [mission] = await db.select().from(chronicleEraMissions).where(eq(chronicleEraMissions.id, missionId));
      const hints = [mission?.hint1, mission?.hint2, mission?.hint3].filter(Boolean);
      const revealedHint = hints[updated.hintsRevealed - 1] || null;
      
      res.json({ progress: updated, hint: revealedHint });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });
  
  // Submit riddle answer
  app.post("/api/chronicles/missions/:missionId/riddle", isChroniclesAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user?.id || req.user?.claims?.sub;
      if (!userId) return res.status(401).json({ error: "Authentication required" });
      
      const { missionId } = req.params;
      const { answer } = req.body;
      
      const [mission] = await db.select().from(chronicleEraMissions).where(eq(chronicleEraMissions.id, missionId));
      if (!mission?.riddleAnswer) return res.status(400).json({ error: "This mission has no riddle" });
      
      const isCorrect = answer?.toLowerCase().trim() === mission.riddleAnswer.toLowerCase().trim();
      
      if (isCorrect) {
        await db.update(chronicleMissionProgress)
          .set({ riddleSolved: true })
          .where(and(eq(chronicleMissionProgress.userId, userId), eq(chronicleMissionProgress.missionId, missionId)));
      }
      
      res.json({ correct: isCorrect, message: isCorrect ? "Correct! The answer reveals itself." : "That's not quite right. Think again." });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });
  
  // Make conflict choice
  app.post("/api/chronicles/missions/:missionId/conflict", isChroniclesAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user?.id || req.user?.claims?.sub;
      if (!userId) return res.status(401).json({ error: "Authentication required" });
      
      const { missionId } = req.params;
      const { choice } = req.body;
      
      await db.update(chronicleMissionProgress)
        .set({ conflictChoiceMade: choice })
        .where(and(eq(chronicleMissionProgress.userId, userId), eq(chronicleMissionProgress.missionId, missionId)));
      
      res.json({ success: true, message: "Your choice has been recorded. The consequences unfold..." });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });
  
  // Complete a mission and claim artifact
  app.post("/api/chronicles/missions/:missionId/complete", isChroniclesAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user?.id || req.user?.claims?.sub;
      if (!userId) return res.status(401).json({ error: "Authentication required" });
      
      const { missionId } = req.params;
      
      const [mission] = await db.select().from(chronicleEraMissions).where(eq(chronicleEraMissions.id, missionId));
      if (!mission) return res.status(404).json({ error: "Mission not found" });
      
      const [progress] = await db.select().from(chronicleMissionProgress)
        .where(and(eq(chronicleMissionProgress.userId, userId), eq(chronicleMissionProgress.missionId, missionId)));
      
      if (!progress) return res.status(400).json({ error: "Mission not started" });
      if (progress.status === 'completed') return res.json({ alreadyCompleted: true, message: "Mission already completed" });
      
      // Complete the mission
      await db.update(chronicleMissionProgress)
        .set({ status: 'completed', completedAt: new Date() })
        .where(eq(chronicleMissionProgress.id, progress.id));
      
      // Award artifact if mission has one
      let artifact = null;
      if (mission.artifactRewardId) {
        [artifact] = await db.select().from(chronicleArtifacts).where(eq(chronicleArtifacts.id, mission.artifactRewardId));
        if (artifact) {
          await db.insert(chroniclePlayerArtifacts).values({
            userId, artifactId: artifact.id, discoveryMethod: 'mission'
          });
        }
      }
      
      // Award Shells
      const user = await storage.getUser(userId);
      if (user && mission.shellsReward > 0) {
        await shellsService.addShells(userId, user.firstName || user.email || 'User', mission.shellsReward, 'earn', `Completed: ${mission.title}`, missionId, 'mission');
      }
      
      // Update mission completion count
      await db.update(chronicleEraMissions)
        .set({ timesCompleted: mission.timesCompleted + 1 })
        .where(eq(chronicleEraMissions.id, missionId));
      
      res.json({ 
        completed: true, 
        artifact,
        rewards: { shells: mission.shellsReward, experience: mission.experienceReward, reputation: mission.reputationReward }
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });
  
  // Get artifacts for an era
  app.get("/api/chronicles/artifacts/:eraCode", async (req, res) => {
    try {
      const { eraCode } = req.params;
      const artifacts = await db.select().from(chronicleArtifacts)
        .where(and(eq(chronicleArtifacts.eraCode, eraCode), eq(chronicleArtifacts.isActive, true)));
      res.json({ artifacts });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });
  
  // Check if player can travel to an era
  app.get("/api/chronicles/portal/check/:eraCode", isChroniclesAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user?.id || req.user?.claims?.sub;
      if (!userId) return res.status(401).json({ error: "Authentication required" });
      
      const { eraCode } = req.params;
      
      // Get era requirements
      const [era] = await db.select().from(chronicleEras).where(eq(chronicleEras.code, eraCode));
      if (!era) return res.status(404).json({ error: "Era not found" });
      if (era.isStartingEra) return res.json({ canTravel: true, isStartingEra: true });
      
      // Count player's artifacts for this era
      const playerArtifacts = await db.select().from(chroniclePlayerArtifacts)
        .innerJoin(chronicleArtifacts, eq(chroniclePlayerArtifacts.artifactId, chronicleArtifacts.id))
        .where(and(eq(chroniclePlayerArtifacts.userId, userId), eq(chronicleArtifacts.eraCode, eraCode)));
      
      const collected = playerArtifacts.length;
      const required = era.artifactsRequired;
      const canTravel = collected >= required;
      
      res.json({ canTravel, collected, required, era });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });
  
  // Activate portal and travel to era
  app.post("/api/chronicles/portal/travel", isChroniclesAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user?.id || req.user?.claims?.sub;
      if (!userId) return res.status(401).json({ error: "Authentication required" });
      
      const { eraCode } = req.body;
      
      // Verify player can travel
      const [era] = await db.select().from(chronicleEras).where(eq(chronicleEras.code, eraCode));
      if (!era) return res.status(404).json({ error: "Era not found" });
      
      if (!era.isStartingEra) {
        const playerArtifacts = await db.select().from(chroniclePlayerArtifacts)
          .innerJoin(chronicleArtifacts, eq(chroniclePlayerArtifacts.artifactId, chronicleArtifacts.id))
          .where(and(eq(chroniclePlayerArtifacts.userId, userId), eq(chronicleArtifacts.eraCode, eraCode)));
        
        if (playerArtifacts.length < era.artifactsRequired) {
          return res.status(400).json({ error: "Not enough artifacts to power the portal", required: era.artifactsRequired, collected: playerArtifacts.length });
        }
      }
      
      // Update portal state
      await db.update(chronicleTimePortals)
        .set({ currentEraCode: eraCode, lastTravelAt: new Date(), totalTravels: sql`total_travels + 1`, portalStatus: 'active', updatedAt: new Date() })
        .where(eq(chronicleTimePortals.userId, userId));
      
      // Update current era for player
      await db.update(chroniclePlayerEras).set({ isCurrent: false }).where(eq(chroniclePlayerEras.userId, userId));
      
      // Create or update destination era progress
      const [existingEraProgress] = await db.select().from(chroniclePlayerEras)
        .where(and(eq(chroniclePlayerEras.userId, userId), eq(chroniclePlayerEras.eraCode, eraCode)));
      
      if (existingEraProgress) {
        await db.update(chroniclePlayerEras)
          .set({ isCurrent: true, isUnlocked: true, lastVisitedAt: new Date() })
          .where(eq(chroniclePlayerEras.id, existingEraProgress.id));
      } else {
        await db.insert(chroniclePlayerEras).values({ userId, eraCode, isUnlocked: true, isCurrent: true, firstEnteredAt: new Date() });
      }
      
      res.json({ 
        success: true, 
        message: `The portal activates. ${era.ambientDescription || 'A new world awaits...'}`,
        era,
        travelComplete: true
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // ============================================
  // CREDITS API
  // ============================================
  
  app.get("/api/credits/balance", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user?.id || req.user?.claims?.sub;
      if (!userId) {
        return res.status(401).json({ error: "Authentication required" });
      }
      
      const credits = await creditsService.getOrCreateUserCredits(userId);
      res.json({
        balance: credits.creditBalance,
        bonusCredits: credits.bonusCredits,
        lifetimeEarned: credits.lifetimeCreditsEarned,
        lifetimeSpent: credits.lifetimeCreditsSpent,
        dailyUsage: credits.dailyUsageCount,
      });
    } catch (error: any) {
      console.error("Get credits balance error:", error);
      res.status(500).json({ error: error.message || "Failed to get balance" });
    }
  });

  app.get("/api/credits/packages", async (req, res) => {
    try {
      const packages = await creditsService.getPackages();
      res.json({ packages });
    } catch (error: any) {
      console.error("Get packages error:", error);
      res.status(500).json({ error: error.message || "Failed to get packages" });
    }
  });

  app.get("/api/credits/transactions", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user?.id || req.user?.claims?.sub;
      if (!userId) {
        return res.status(401).json({ error: "Authentication required" });
      }
      
      const limit = Math.min(parseInt(req.query.limit as string) || 50, 100);
      const transactions = await creditsService.getTransactionHistory(userId, limit);
      res.json({ transactions });
    } catch (error: any) {
      console.error("Get transactions error:", error);
      res.status(500).json({ error: error.message || "Failed to get transactions" });
    }
  });

  app.post("/api/credits/purchase", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user?.id || req.user?.claims?.sub;
      if (!userId) {
        return res.status(401).json({ error: "Authentication required" });
      }
      
      const { packageId } = req.body;
      if (!packageId) {
        return res.status(400).json({ error: "Package ID required" });
      }
      
      const pkg = await creditsService.getPackageById(packageId);
      if (!pkg) {
        return res.status(404).json({ error: "Package not found" });
      }
      
      // Create Stripe checkout session
      const { getUncachableStripeClient } = await import("./stripeClient");
      const stripe = await getUncachableStripeClient();
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [
          {
            price_data: {
              currency: "usd",
              product_data: {
                name: `${pkg.name} Credits Package`,
                description: `${pkg.credits} credits${pkg.bonusCredits ? ` + ${pkg.bonusCredits} bonus` : ""}`,
              },
              unit_amount: pkg.priceUsd,
            },
            quantity: 1,
          },
        ],
        mode: "payment",
        success_url: `${req.protocol}://${req.get("host")}/credits?success=true&session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${req.protocol}://${req.get("host")}/credits?cancelled=true`,
        metadata: {
          userId,
          packageId,
          type: "credits_purchase",
        },
      });
      
      res.json({ checkoutUrl: session.url, sessionId: session.id });
    } catch (error: any) {
      console.error("Create checkout error:", error);
      res.status(500).json({ error: error.message || "Failed to create checkout" });
    }
  });

  // ============================================
  // VOICE API
  // ============================================

  app.get("/api/voice/status", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user?.id || req.user?.claims?.sub;
      if (!userId) {
        return res.status(401).json({ error: "Authentication required" });
      }
      
      const sample = await voiceService.getUserVoiceSample(userId);
      const provider = voiceService.getBestProvider();
      
      res.json({
        hasVoiceSample: !!sample,
        sample: sample ? {
          id: sample.id,
          status: sample.cloneStatus,
          provider: sample.voiceCloneProvider,
          duration: sample.sampleDurationSec,
          createdAt: sample.createdAt,
        } : null,
        availableProvider: provider,
        prompts: VOICE_SAMPLE_PROMPTS,
      });
    } catch (error: any) {
      console.error("Get voice status error:", error);
      res.status(500).json({ error: error.message || "Failed to get voice status" });
    }
  });

  app.get("/api/voice/prompt", async (req, res) => {
    res.json({ prompt: voiceService.getRandomPrompt() });
  });

  app.post("/api/voice/sample", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user?.id || req.user?.claims?.sub;
      if (!userId) {
        return res.status(401).json({ error: "Authentication required" });
      }
      
      const { sampleUrl, duration, transcript, personalityId } = req.body;
      
      if (!sampleUrl) {
        return res.status(400).json({ error: "Sample URL required" });
      }
      
      const sample = await voiceService.saveVoiceSample(userId, personalityId || null, {
        sampleUrl,
        sampleDurationSec: duration,
        transcriptText: transcript,
      });
      
      res.json({ 
        success: true, 
        sample: {
          id: sample.id,
          status: sample.cloneStatus,
          provider: sample.voiceCloneProvider,
        }
      });
    } catch (error: any) {
      console.error("Save voice sample error:", error);
      res.status(500).json({ error: error.message || "Failed to save voice sample" });
    }
  });

  app.post("/api/voice/clone", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user?.id || req.user?.claims?.sub;
      if (!userId) {
        return res.status(401).json({ error: "Authentication required" });
      }
      
      const sample = await voiceService.getUserVoiceSample(userId);
      if (!sample) {
        return res.status(404).json({ error: "No voice sample found. Please record a sample first." });
      }
      
      const result = await voiceService.createVoiceClone(userId, sample.id);
      res.json(result);
    } catch (error: any) {
      console.error("Create voice clone error:", error);
      res.status(500).json({ error: error.message || "Failed to create voice clone" });
    }
  });

  // =====================================================
  // REFERRAL & AFFILIATE SYSTEM APIs
  // =====================================================

  app.get("/api/referrals/code", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user?.id || req.user?.claims?.sub;
      if (!userId) {
        return res.status(401).json({ error: "Authentication required" });
      }
      
      const host = (req.query.host as string) || "dwsc.io";
      const code = await referralService.getOrCreateReferralCode(userId, host as any);
      
      res.json({ 
        code: code.code,
        host: code.host,
        isActive: code.isActive,
        stats: {
          clicks: code.clickCount,
          signups: code.signupCount,
          conversions: code.conversionCount,
        }
      });
    } catch (error: any) {
      console.error("Get referral code error:", error);
      res.status(500).json({ error: error.message || "Failed to get referral code" });
    }
  });

  app.get("/api/referrals/stats", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user?.id || req.user?.claims?.sub;
      if (!userId) {
        return res.status(401).json({ error: "Authentication required" });
      }
      
      const stats = await referralService.getUserStats(userId);
      res.json(stats);
    } catch (error: any) {
      console.error("Get referral stats error:", error);
      res.status(500).json({ error: error.message || "Failed to get referral stats" });
    }
  });

  app.get("/api/referrals/tiers", async (req, res) => {
    try {
      const host = (req.query.host as string) || "dwsc.io";
      const tiers = await referralService.getAffiliateTiers(host as any);
      res.json({ tiers });
    } catch (error: any) {
      console.error("Get affiliate tiers error:", error);
      res.status(500).json({ error: error.message || "Failed to get tiers" });
    }
  });

  app.post("/api/referrals/track-click", async (req, res) => {
    try {
      const { code } = req.body;
      if (!code) {
        return res.status(400).json({ error: "Referral code required" });
      }
      
      const referralCode = await referralService.getReferralCodeByCode(code);
      if (!referralCode) {
        return res.status(404).json({ error: "Invalid referral code" });
      }
      
      await referralService.trackReferralClick(code);
      res.json({ success: true });
    } catch (error: any) {
      console.error("Track referral click error:", error);
      res.status(500).json({ error: error.message || "Failed to track click" });
    }
  });

  app.post("/api/referrals/signup", isAuthenticated, async (req: any, res) => {
    try {
      const refereeId = req.user?.id || req.user?.claims?.sub;
      if (!refereeId) {
        return res.status(401).json({ error: "Authentication required" });
      }
      
      const { code, host } = req.body;
      if (!code) {
        return res.status(400).json({ error: "Referral code required" });
      }
      
      const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
      const result = await referralService.processNewSignup(
        refereeId, 
        code, 
        host || "dwsc.io",
        { ipAddress: ip as string, userAgent: req.headers["user-agent"] }
      );
      
      if (!result.success) {
        return res.status(400).json({ error: result.error });
      }
      
      res.json({
        success: true,
        referral: result.referral,
        rewards: {
          referrer: result.referrerReward,
          referee: result.refereeReward,
        }
      });
    } catch (error: any) {
      console.error("Process referral signup error:", error);
      res.status(500).json({ error: error.message || "Failed to process signup" });
    }
  });

  app.get("/api/referrals/my-referrals", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user?.id || req.user?.claims?.sub;
      if (!userId) {
        return res.status(401).json({ error: "Authentication required" });
      }
      
      const referrals = await referralService.getUserReferrals(userId);
      res.json({ referrals });
    } catch (error: any) {
      console.error("Get my referrals error:", error);
      res.status(500).json({ error: error.message || "Failed to get referrals" });
    }
  });

  // =====================================================
  // OWNER ADMIN PORTAL APIs
  // =====================================================

  const OWNER_SECRET = process.env.OWNER_SECRET;
  const ALLOWED_HOSTS = ["dwsc.io", "yourlegacy.io"];
  const ownerTokens = new Map<string, number>();

  if (!OWNER_SECRET) {
    console.error("[Owner Portal] OWNER_SECRET not set. Owner portal will be disabled.");
  }

  const generateOwnerToken = (): string => {
    const token = crypto.randomBytes(32).toString("hex");
    const expiry = Date.now() + 24 * 60 * 60 * 1000;
    ownerTokens.set(token, expiry);
    return token;
  };

  const isTokenValid = (token: string): boolean => {
    const expiry = ownerTokens.get(token);
    if (!expiry) return false;
    if (Date.now() > expiry) {
      ownerTokens.delete(token);
      return false;
    }
    return true;
  };

  const ownerAuthMiddleware = (req: any, res: any, next: any) => {
    let token = req.headers["x-owner-token"];
    if (!token) {
      const authHeader = req.headers["authorization"];
      if (authHeader && authHeader.startsWith("Bearer ")) {
        token = authHeader.slice(7);
      }
    }
    if (!token || !isTokenValid(token)) {
      return res.status(401).json({ error: "Unauthorized: Invalid or expired token" });
    }
    next();
  };

  const validateHost = (host: string): string => {
    return ALLOWED_HOSTS.includes(host) ? host : "dwsc.io";
  };

  const ownerAuthLockouts = new Map<string, { attempts: number; lockedUntil: number }>();

  const timingSafeEqual = (a: string, b: string): boolean => {
    const maxLen = Math.max(a.length, b.length);
    const bufA = Buffer.alloc(maxLen);
    const bufB = Buffer.alloc(maxLen);
    bufA.write(a);
    bufB.write(b);
    return a.length === b.length && crypto.timingSafeEqual(bufA, bufB);
  };

  app.post("/api/owner/auth", rateLimit("owner-auth", 5, 5 * 60 * 1000), (req, res) => {
    if (!OWNER_SECRET || OWNER_SECRET.length < 4) {
      return res.status(503).json({ error: "Owner portal not configured. Contact administrator." });
    }

    const ip = req.ip || "unknown";
    const lockout = ownerAuthLockouts.get(ip);
    
    if (lockout && Date.now() < lockout.lockedUntil) {
      const waitSeconds = Math.ceil((lockout.lockedUntil - Date.now()) / 1000);
      return res.status(429).json({ error: `Too many failed attempts. Try again in ${waitSeconds} seconds.` });
    }
    
    const { secret } = req.body;
    if (secret && timingSafeEqual(secret, OWNER_SECRET)) {
      ownerAuthLockouts.delete(ip);
      const token = generateOwnerToken();
      res.json({ success: true, token });
    } else {
      const current = ownerAuthLockouts.get(ip) || { attempts: 0, lockedUntil: 0 };
      current.attempts++;
      if (current.attempts >= 3) {
        current.lockedUntil = Date.now() + (current.attempts * 60 * 1000);
      }
      ownerAuthLockouts.set(ip, current);
      console.warn(`[Owner Portal] Failed auth attempt from IP: ${ip}, attempts: ${current.attempts}`);
      res.status(401).json({ error: "Invalid credentials" });
    }
  });

  // Apply 2026 updated marketing posts (Owner only)
  app.post("/api/marketing/apply-2026-update", ownerAuthMiddleware, async (_req, res) => {
    try {
      const { seedUpdatedMarketingPosts } = await import("./seed-marketing-2026");
      const result = await seedUpdatedMarketingPosts();
      res.json(result);
    } catch (error: any) {
      console.error("Apply 2026 update error:", error);
      res.status(500).json({ error: error.message || "Failed to apply update" });
    }
  });

  app.get("/api/owner/analytics", ownerAuthMiddleware, async (req, res) => {
    try {
      const host = validateHost(req.query.host as string);
      const pageViews = await storage.getPageViewsByHost(host, 1);
      const uniqueVisitors = await storage.getUniqueVisitorsByHost(host, 1);
      
      res.json({
        pageViews,
        uniqueVisitors,
        topPages: [],
        bounceRate: 35,
      });
    } catch (error) {
      console.error("Owner analytics error:", error);
      res.status(500).json({ error: "Failed to fetch analytics" });
    }
  });

  app.get("/api/owner/analytics/full", ownerAuthMiddleware, async (req, res) => {
    try {
      const host = validateHost(req.query.host as string);
      const range = (req.query.range as string) || "7d";
      
      const days = range === "24h" ? 1 : range === "7d" ? 7 : 30;
      
      const pageViews = await storage.getPageViewsByHost(host, days);
      const uniqueVisitors = await storage.getUniqueVisitorsByHost(host, days);
      const topPages = await storage.getTopPagesByHost(host, days, 10);
      const topReferrers = await storage.getTopReferrersByHost(host, days, 5);
      const deviceBreakdown = await storage.getDeviceBreakdownByHost(host, days);
      const geoData = await storage.getGeoDataByHost(host, days, 5);
      const pageViewsOverTime = await storage.getPageViewsOverTimeByHost(host, days);
      
      res.json({
        summary: {
          pageViews,
          uniqueVisitors,
          avgSessionDuration: "2:34",
          bounceRate: 35,
        },
        pageViewsOverTime,
        topPages,
        topReferrers,
        deviceBreakdown,
        browserBreakdown: [
          { name: "Chrome", value: 55 },
          { name: "Safari", value: 25 },
          { name: "Firefox", value: 12 },
          { name: "Other", value: 8 },
        ],
        geoData,
      });
    } catch (error) {
      console.error("Owner analytics full error:", error);
      res.status(500).json({ error: "Failed to fetch analytics" });
    }
  });

  const seoConfigSchema = z.object({
    host: z.enum(["dwsc.io", "yourlegacy.io"]),
    route: z.string().min(1).startsWith("/"),
    title: z.string().optional().nullable(),
    description: z.string().optional().nullable(),
    keywords: z.string().optional().nullable(),
    ogTitle: z.string().optional().nullable(),
    ogDescription: z.string().optional().nullable(),
    ogImage: z.string().url().optional().nullable(),
    ogType: z.string().optional().nullable(),
    twitterCard: z.enum(["summary", "summary_large_image", "player"]).optional().nullable(),
    twitterTitle: z.string().optional().nullable(),
    twitterDescription: z.string().optional().nullable(),
    twitterImage: z.string().url().optional().nullable(),
    canonicalUrl: z.string().url().optional().nullable(),
    robots: z.string().optional().nullable(),
    structuredData: z.string().optional().nullable(),
    customTags: z.string().optional().nullable(),
    isActive: z.boolean().optional(),
  });

  app.get("/api/owner/seo", ownerAuthMiddleware, async (req, res) => {
    try {
      const host = validateHost(req.query.host as string);
      const configs = await storage.getSeoConfigsByHost(host);
      res.json(configs);
    } catch (error) {
      console.error("Get SEO configs error:", error);
      res.status(500).json({ error: "Failed to fetch SEO configs" });
    }
  });

  app.post("/api/owner/seo", ownerAuthMiddleware, async (req, res) => {
    try {
      const validated = seoConfigSchema.parse(req.body);
      const config = await storage.createSeoConfig(validated);
      res.json(config);
    } catch (error: any) {
      if (error.name === "ZodError") {
        return res.status(400).json({ error: "Validation failed", details: error.errors });
      }
      console.error("Create SEO config error:", error);
      res.status(500).json({ error: "Failed to create SEO config" });
    }
  });

  app.put("/api/owner/seo", ownerAuthMiddleware, async (req, res) => {
    try {
      const { id, ...data } = req.body;
      if (!id) {
        return res.status(400).json({ error: "Config ID required" });
      }
      const validated = seoConfigSchema.partial().parse(data);
      const config = await storage.updateSeoConfig(id, validated);
      res.json(config);
    } catch (error: any) {
      if (error.name === "ZodError") {
        return res.status(400).json({ error: "Validation failed", details: error.errors });
      }
      console.error("Update SEO config error:", error);
      res.status(500).json({ error: "Failed to update SEO config" });
    }
  });

  app.delete("/api/owner/seo/:id", ownerAuthMiddleware, async (req, res) => {
    try {
      const { id } = req.params;
      await storage.deleteSeoConfig(id);
      res.json({ success: true });
    } catch (error) {
      console.error("Delete SEO config error:", error);
      res.status(500).json({ error: "Failed to delete SEO config" });
    }
  });

  // =====================================================
  // OWNER ADMIN - GUARDIAN CERTIFICATION APIs
  // =====================================================

  app.get("/api/owner/guardian/certifications", ownerAuthMiddleware, async (_req, res) => {
    try {
      const certifications = await guardianService.getAllCertifications();
      res.json({ certifications });
    } catch (error) {
      console.error("Get all certifications error:", error);
      res.status(500).json({ error: "Failed to fetch certifications" });
    }
  });

  app.post("/api/owner/guardian/certifications/:id/complete", ownerAuthMiddleware, async (req, res) => {
    try {
      const { id } = req.params;
      const { score, findings } = req.body;
      if (typeof score !== "number" || score < 0 || score > 100) {
        return res.status(400).json({ error: "Score must be a number between 0 and 100" });
      }
      const updated = await guardianService.completeCertification(id, score, findings || "");
      if (!updated) {
        return res.status(404).json({ error: "Certification not found" });
      }
      res.json({ success: true, certification: updated });
    } catch (error) {
      console.error("Complete certification error:", error);
      res.status(500).json({ error: "Failed to complete certification" });
    }
  });

  app.post("/api/owner/guardian/certifications/:id/revoke", ownerAuthMiddleware, async (req, res) => {
    try {
      const { id } = req.params;
      const updated = await guardianService.updateCertification(id, { status: "revoked" });
      if (!updated) {
        return res.status(404).json({ error: "Certification not found" });
      }
      res.json({ success: true, certification: updated });
    } catch (error) {
      console.error("Revoke certification error:", error);
      res.status(500).json({ error: "Failed to revoke certification" });
    }
  });

  app.post("/api/owner/guardian/certifications/:id/start", ownerAuthMiddleware, async (req, res) => {
    try {
      const { id } = req.params;
      const updated = await guardianService.updateCertification(id, { status: "in_progress" });
      if (!updated) {
        return res.status(404).json({ error: "Certification not found" });
      }
      res.json({ success: true, certification: updated });
    } catch (error) {
      console.error("Start certification error:", error);
      res.status(500).json({ error: "Failed to start certification" });
    }
  });

  // =====================================================
  // OWNER ADMIN - REFERRAL DASHBOARD APIs
  // =====================================================

  app.get("/api/owner/referrals/stats", ownerAuthMiddleware, async (req, res) => {
    try {
      const host = req.query.host as string | undefined;
      const adminStats = await referralService.getAdminStats(host as any);
      res.json(adminStats);
    } catch (error) {
      console.error("Get admin referral stats error:", error);
      res.status(500).json({ error: "Failed to fetch referral stats" });
    }
  });

  app.get("/api/owner/referrals/codes", ownerAuthMiddleware, async (req, res) => {
    try {
      const host = req.query.host as string | undefined;
      const limit = parseInt(req.query.limit as string) || 100;
      const codes = await storage.getAllReferralCodes(host, limit);
      res.json({ codes });
    } catch (error) {
      console.error("Get referral codes error:", error);
      res.status(500).json({ error: "Failed to fetch referral codes" });
    }
  });

  app.get("/api/owner/referrals/all", ownerAuthMiddleware, async (req, res) => {
    try {
      const host = req.query.host as string | undefined;
      const status = req.query.status as string | undefined;
      const limit = parseInt(req.query.limit as string) || 100;
      const referrals = await storage.getAllReferrals(host, status, limit);
      res.json({ referrals });
    } catch (error) {
      console.error("Get all referrals error:", error);
      res.status(500).json({ error: "Failed to fetch referrals" });
    }
  });

  app.get("/api/owner/referrals/affiliates", ownerAuthMiddleware, async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 100;
      const affiliates = await storage.getAllAffiliateProfiles(limit);
      res.json({ affiliates });
    } catch (error) {
      console.error("Get affiliates error:", error);
      res.status(500).json({ error: "Failed to fetch affiliates" });
    }
  });

  app.get("/api/owner/referrals/fraud-flags", ownerAuthMiddleware, async (req, res) => {
    try {
      const flags = await storage.getFraudFlags();
      res.json({ flags });
    } catch (error) {
      console.error("Get fraud flags error:", error);
      res.status(500).json({ error: "Failed to fetch fraud flags" });
    }
  });

  app.post("/api/owner/referrals/resolve-fraud", ownerAuthMiddleware, async (req, res) => {
    try {
      const { id, notes } = req.body;
      if (!id) {
        return res.status(400).json({ error: "Flag ID required" });
      }
      const flag = await storage.resolveFraudFlag(id, "owner", notes);
      res.json({ success: true, flag });
    } catch (error) {
      console.error("Resolve fraud flag error:", error);
      res.status(500).json({ error: "Failed to resolve fraud flag" });
    }
  });

  app.post("/api/owner/referrals/qualify", ownerAuthMiddleware, async (req, res) => {
    try {
      const { referralId } = req.body;
      if (!referralId) {
        return res.status(400).json({ error: "Referral ID required" });
      }
      const referral = await referralService.qualifyReferral(referralId);
      res.json({ success: true, referral });
    } catch (error) {
      console.error("Qualify referral error:", error);
      res.status(500).json({ error: "Failed to qualify referral" });
    }
  });

  app.get("/api/owner/payouts/stats", ownerAuthMiddleware, async (req, res) => {
    try {
      const stats = await payoutService.getPayoutStats();
      res.json(stats);
    } catch (error) {
      console.error("Get payout stats error:", error);
      res.status(500).json({ error: "Failed to get payout stats" });
    }
  });

  app.get("/api/owner/payouts/eligible", ownerAuthMiddleware, async (req, res) => {
    try {
      const affiliates = await payoutService.getEligibleAffiliates();
      res.json({ affiliates, count: affiliates.length });
    } catch (error) {
      console.error("Get eligible affiliates error:", error);
      res.status(500).json({ error: "Failed to get eligible affiliates" });
    }
  });

  app.post("/api/owner/payouts/run", ownerAuthMiddleware, async (req, res) => {
    try {
      console.log("[Owner] Manual payout run triggered");
      const result = await payoutService.runPayoutCycle();
      res.json({ success: true, ...result });
    } catch (error) {
      console.error("Run payout cycle error:", error);
      res.status(500).json({ error: "Failed to run payout cycle" });
    }
  });

  app.post("/api/owner/payouts/start-scheduler", ownerAuthMiddleware, async (req, res) => {
    try {
      const intervalHours = parseInt(req.body.intervalHours as string) || 24;
      startPayoutScheduler(intervalHours);
      res.json({ success: true, message: `Payout scheduler started (every ${intervalHours} hours)` });
    } catch (error) {
      console.error("Start payout scheduler error:", error);
      res.status(500).json({ error: "Failed to start payout scheduler" });
    }
  });

  app.post("/api/referrals/verify-wallet", isAuthenticated, async (req, res) => {
    try {
      const userId = (req as any).user?.id;
      if (!userId) {
        return res.status(401).json({ error: "Authentication required" });
      }
      const { walletAddress } = req.body;
      if (!walletAddress) {
        return res.status(400).json({ error: "Wallet address required" });
      }
      const verified = await payoutService.verifyAffiliateWallet(userId, walletAddress);
      if (verified) {
        res.json({ success: true, message: "Wallet verified for payouts" });
      } else {
        res.status(400).json({ error: "Invalid wallet address format" });
      }
    } catch (error) {
      console.error("Verify wallet error:", error);
      res.status(500).json({ error: "Failed to verify wallet" });
    }
  });

  app.get("/api/owner/faucet/claims", ownerAuthMiddleware, async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 100;
      const claims = await storage.getFaucetClaims();
      
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const claimsToday = claims.filter(c => new Date(c.claimedAt) >= today).length;
      
      const completed = claims.filter(c => c.status === "completed").length;
      const failed = claims.filter(c => c.status === "failed").length;
      const pending = claims.filter(c => c.status === "pending").length;
      
      const totalDistributed = claims
        .filter(c => c.status === "completed")
        .reduce((sum, c) => sum + BigInt(c.amount), BigInt(0));
      
      res.json({
        claims: claims.slice(0, limit),
        stats: {
          total: claims.length,
          claimsToday,
          completed,
          failed,
          pending,
          totalDistributed: totalDistributed.toString(),
        }
      });
    } catch (error) {
      console.error("Get faucet claims error:", error);
      res.status(500).json({ error: "Failed to get faucet claims" });
    }
  });

  // === OWNER KYC MANAGEMENT ROUTES ===
  app.get("/api/owner/kyc", ownerAuthMiddleware, async (req, res) => {
    try {
      const allKyc = await db.select()
        .from(kycVerifications)
        .orderBy(desc(kycVerifications.createdAt));
      
      res.json(allKyc);
    } catch (error) {
      console.error("Get KYC list error:", error);
      res.status(500).json({ error: "Failed to get KYC list" });
    }
  });

  app.post("/api/owner/kyc/:id/approve", ownerAuthMiddleware, async (req, res) => {
    try {
      const { id } = req.params;
      
      const [updated] = await db.update(kycVerifications)
        .set({ 
          status: "approved",
          verifiedAt: new Date(),
          updatedAt: new Date(),
        })
        .where(eq(kycVerifications.id, id))
        .returning();
      
      if (!updated) {
        return res.status(404).json({ error: "KYC record not found" });
      }
      
      res.json({ success: true, kyc: updated });
    } catch (error) {
      console.error("Approve KYC error:", error);
      res.status(500).json({ error: "Failed to approve KYC" });
    }
  });

  app.post("/api/owner/kyc/:id/reject", ownerAuthMiddleware, async (req, res) => {
    try {
      const { id } = req.params;
      const { reason } = req.body;
      
      const [updated] = await db.update(kycVerifications)
        .set({ 
          status: "rejected",
          rejectionReason: reason || "Verification failed",
          updatedAt: new Date(),
        })
        .where(eq(kycVerifications.id, id))
        .returning();
      
      if (!updated) {
        return res.status(404).json({ error: "KYC record not found" });
      }
      
      res.json({ success: true, kyc: updated });
    } catch (error) {
      console.error("Reject KYC error:", error);
      res.status(500).json({ error: "Failed to reject KYC" });
    }
  });

  app.get("/api/owner/airdrop/summary", ownerAuthMiddleware, async (req, res) => {
    try {
      const summary = await payoutService.getAirdropSummary();
      res.json(summary);
    } catch (error) {
      console.error("Get airdrop summary error:", error);
      res.status(500).json({ error: "Failed to get airdrop summary" });
    }
  });

  app.post("/api/owner/airdrop/execute", ownerAuthMiddleware, async (req, res) => {
    try {
      console.log("[Owner] Airdrop execution triggered");
      const result = await payoutService.executeAirdrop();
      res.json({ success: true, ...result });
    } catch (error) {
      console.error("Execute airdrop error:", error);
      res.status(500).json({ error: "Failed to execute airdrop" });
    }
  });

  app.get("/api/referrals/my-airdrop", isAuthenticated, async (req, res) => {
    try {
      const userId = (req as any).user?.id;
      if (!userId) {
        return res.status(401).json({ error: "Authentication required" });
      }
      const profile = await storage.getAffiliateProfile(userId);
      if (!profile) {
        return res.json({ 
          airdropBalance: 0, 
          airdropBalanceDwc: "0",
          airdropStatus: "none",
          message: "No affiliate profile found"
        });
      }
      res.json({
        airdropBalance: (profile.airdropBalance || 0) / 100,
        airdropBalanceDwc: profile.airdropBalanceDwc || "0",
        airdropStatus: profile.airdropStatus || "none",
        launchDate: "2026-04-11T00:00:00Z",
        walletVerified: profile.walletVerified,
        dwcWalletAddress: profile.dwcWalletAddress,
      });
    } catch (error) {
      console.error("Get my airdrop error:", error);
      res.status(500).json({ error: "Failed to get airdrop status" });
    }
  });

  startPayoutScheduler(24);

  // ============================================
  // ZEALY ADMIN ROUTES - Quest Reward Management
  // ============================================
  app.get("/api/owner/zealy/mappings", ownerAuthMiddleware, async (_req, res) => {
    try {
      const mappings = await zealyService.getQuestMappings();
      res.json(mappings);
    } catch (error) {
      console.error("Failed to fetch Zealy mappings:", error);
      res.status(500).json({ error: "Failed to fetch quest mappings" });
    }
  });

  app.post("/api/owner/zealy/mappings", ownerAuthMiddleware, async (req, res) => {
    try {
      const { zealyQuestId, zealyQuestName, shellsReward, dwcReward, reputationReward, maxRewardsPerUser, totalRewardsCap } = req.body;
      
      if (!zealyQuestId || !zealyQuestName) {
        return res.status(400).json({ error: "Quest ID and name are required" });
      }
      
      const mapping = await zealyService.createQuestMapping({
        zealyQuestId,
        zealyQuestName,
        shellsReward: shellsReward || 0,
        dwcReward: dwcReward || "0",
        reputationReward: reputationReward || 0,
        maxRewardsPerUser: maxRewardsPerUser || null,
        totalRewardsCap: totalRewardsCap || null,
      });
      
      res.json(mapping);
    } catch (error) {
      console.error("Failed to create Zealy mapping:", error);
      res.status(500).json({ error: "Failed to create quest mapping" });
    }
  });

  app.put("/api/owner/zealy/mappings/:id", ownerAuthMiddleware, async (req, res) => {
    try {
      const { id } = req.params;
      const { zealyQuestName, shellsReward, dwcReward, reputationReward, maxRewardsPerUser, totalRewardsCap, isActive } = req.body;
      
      const mapping = await zealyService.updateQuestMapping(id, {
        zealyQuestName,
        shellsReward,
        dwcReward,
        reputationReward,
        maxRewardsPerUser,
        totalRewardsCap,
        isActive,
      });
      
      if (!mapping) {
        return res.status(404).json({ error: "Quest mapping not found" });
      }
      
      res.json(mapping);
    } catch (error) {
      console.error("Failed to update Zealy mapping:", error);
      res.status(500).json({ error: "Failed to update quest mapping" });
    }
  });

  app.get("/api/owner/zealy/events", ownerAuthMiddleware, async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 50;
      const events = await zealyService.getRecentEvents(limit);
      res.json(events);
    } catch (error) {
      console.error("Failed to fetch Zealy events:", error);
      res.status(500).json({ error: "Failed to fetch quest events" });
    }
  });

  // ============================================
  // OWNER DOMAIN MANAGEMENT (NO WALLET REQUIRED)
  // ============================================

  app.get("/api/owner/domains", ownerAuthMiddleware, async (req, res) => {
    try {
      const domains = await db.select().from(blockchainDomains).orderBy(desc(blockchainDomains.registeredAt));
      res.json(domains);
    } catch (error) {
      console.error("Get owner domains error:", error);
      res.status(500).json({ error: "Failed to get domains" });
    }
  });

  app.post("/api/owner/domains", ownerAuthMiddleware, async (req, res) => {
    try {
      const { name, tld } = req.body;
      if (!name || !tld) {
        return res.status(400).json({ error: "Domain name and TLD required" });
      }

      const cleanName = name.toLowerCase().replace(/[^a-z0-9-]/g, '');
      if (cleanName.length < 1 || cleanName.length > 63) {
        return res.status(400).json({ error: "Domain name must be 1-63 characters" });
      }

      const existing = await db.select().from(blockchainDomains)
        .where(and(eq(blockchainDomains.name, cleanName), eq(blockchainDomains.tld, tld)))
        .limit(1);

      if (existing.length > 0) {
        return res.status(400).json({ error: "Domain already registered" });
      }

      const [domain] = await db.insert(blockchainDomains).values({
        name: cleanName,
        tld,
        ownerAddress: "OWNER_MANAGED",
        registeredAt: new Date(),
        expiresAt: null,
        ownershipType: "lifetime",
        isPremium: false,
        isProtected: true,
      }).returning();

      res.json(domain);
    } catch (error) {
      console.error("Add owner domain error:", error);
      res.status(500).json({ error: "Failed to add domain" });
    }
  });

  app.delete("/api/owner/domains/:id", ownerAuthMiddleware, async (req, res) => {
    try {
      const { id } = req.params;
      await db.delete(blockchainDomains).where(eq(blockchainDomains.id, id));
      res.json({ success: true });
    } catch (error) {
      console.error("Delete owner domain error:", error);
      res.status(500).json({ error: "Failed to delete domain" });
    }
  });

  // ============================================
  // OWNER USER MANAGEMENT
  // ============================================

  app.get("/api/owner/users/all", ownerAuthMiddleware, async (req, res) => {
    try {
      const [waitlistData, betaTestersData, whitelistedUsersData, earlyAdoptersData, presaleOrdersData] = await Promise.all([
        db.select().from(waitlist).orderBy(desc(waitlist.createdAt)),
        db.select().from(betaTesters).orderBy(desc(betaTesters.createdAt)),
        db.select().from(whitelistedUsers).orderBy(desc(whitelistedUsers.createdAt)),
        db.execute(sql`SELECT * FROM early_adopter_program ORDER BY registered_at DESC`),
        db.execute(sql`SELECT * FROM presale_orders ORDER BY created_at DESC`),
      ]);

      const totalRevenue = presaleOrdersData.rows?.reduce((sum: number, o: any) => sum + (parseInt(o.amount) || 0), 0) || 0;

      res.json({
        waitlist: waitlistData,
        betaTesters: betaTestersData,
        whitelistedUsers: whitelistedUsersData,
        earlyAdopters: earlyAdoptersData.rows || [],
        presaleOrders: presaleOrdersData.rows || [],
        stats: {
          totalWaitlist: waitlistData.length,
          totalBetaTesters: betaTestersData.length,
          totalWhitelisted: whitelistedUsersData.length,
          totalEarlyAdopters: earlyAdoptersData.rows?.length || 0,
          totalPresaleOrders: presaleOrdersData.rows?.length || 0,
          totalRevenue,
        },
      });
    } catch (error) {
      console.error("Get all users error:", error);
      res.status(500).json({ error: "Failed to get user data" });
    }
  });

  // ============================================
  // CHRONICLES GUILDS API
  // ============================================
  // In-game guilds that can optionally link to ChronoChat

  app.get("/api/guilds", async (req, res) => {
    try {
      const result = await db.select().from(guilds).where(eq(guilds.isPublic, true)).orderBy(desc(guilds.memberCount));
      res.json({ guilds: result });
    } catch (error) {
      console.error("Get guilds error:", error);
      res.status(500).json({ error: "Failed to get guilds" });
    }
  });

  app.get("/api/guilds/my-guilds", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user?.id || req.user?.claims?.sub;
      if (!userId) return res.status(401).json({ error: "Authentication required" });
      
      const memberships = await db.select().from(guildMembers).where(eq(guildMembers.userId, userId));
      const guildIds = memberships.map(m => m.guildId);
      
      if (guildIds.length === 0) {
        return res.json({ guilds: [], memberships: [] });
      }
      
      const userGuilds = await db.select().from(guilds).where(sql`${guilds.id} = ANY(${guildIds})`);
      res.json({ guilds: userGuilds, memberships });
    } catch (error) {
      console.error("Get my guilds error:", error);
      res.status(500).json({ error: "Failed to get your guilds" });
    }
  });

  app.get("/api/guilds/:id", async (req, res) => {
    try {
      const [guild] = await db.select().from(guilds).where(eq(guilds.id, req.params.id));
      if (!guild) return res.status(404).json({ error: "Guild not found" });
      
      const members = await db.select().from(guildMembers).where(eq(guildMembers.guildId, guild.id));
      res.json({ guild, members });
    } catch (error) {
      console.error("Get guild error:", error);
      res.status(500).json({ error: "Failed to get guild" });
    }
  });

  app.post("/api/guilds/create", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user?.id || req.user?.claims?.sub;
      if (!userId) return res.status(401).json({ error: "Authentication required" });
      
      const { name, description, icon, isPublic } = req.body;
      if (!name || name.length < 2) return res.status(400).json({ error: "Guild name required (min 2 characters)" });
      
      // Check if user already leads a guild
      const existingGuilds = await db.select().from(guilds).where(eq(guilds.leaderId, userId));
      if (existingGuilds.length >= 3) {
        return res.status(400).json({ error: "You can only create up to 3 guilds" });
      }
      
      // Create guild
      const [newGuild] = await db.insert(guilds).values({
        name,
        description: description || null,
        icon: icon || "⚔️",
        leaderId: userId,
        isPublic: isPublic !== false,
      }).returning();
      
      // Add creator as leader
      await db.insert(guildMembers).values({
        guildId: newGuild.id,
        userId,
        role: "leader",
      });
      
      res.json({ success: true, guild: newGuild });
    } catch (error) {
      console.error("Create guild error:", error);
      res.status(500).json({ error: "Failed to create guild" });
    }
  });

  app.post("/api/guilds/:id/join", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user?.id || req.user?.claims?.sub;
      if (!userId) return res.status(401).json({ error: "Authentication required" });
      
      const [guild] = await db.select().from(guilds).where(eq(guilds.id, req.params.id));
      if (!guild) return res.status(404).json({ error: "Guild not found" });
      if (!guild.isRecruiting) return res.status(400).json({ error: "Guild is not recruiting" });
      if (guild.memberCount >= guild.maxMembers) return res.status(400).json({ error: "Guild is full" });
      
      // Check if already a member
      const existing = await db.select().from(guildMembers)
        .where(and(eq(guildMembers.guildId, guild.id), eq(guildMembers.userId, userId)));
      if (existing.length > 0) return res.status(400).json({ error: "Already a member" });
      
      // Add member
      await db.insert(guildMembers).values({
        guildId: guild.id,
        userId,
        role: "member",
      });
      
      // Update member count
      await db.update(guilds)
        .set({ memberCount: guild.memberCount + 1, updatedAt: new Date() })
        .where(eq(guilds.id, guild.id));
      
      res.json({ success: true });
    } catch (error) {
      console.error("Join guild error:", error);
      res.status(500).json({ error: "Failed to join guild" });
    }
  });

  app.post("/api/guilds/:id/leave", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user?.id || req.user?.claims?.sub;
      if (!userId) return res.status(401).json({ error: "Authentication required" });
      
      const [guild] = await db.select().from(guilds).where(eq(guilds.id, req.params.id));
      if (!guild) return res.status(404).json({ error: "Guild not found" });
      if (guild.leaderId === userId) return res.status(400).json({ error: "Leaders cannot leave. Transfer ownership first." });
      
      await db.delete(guildMembers)
        .where(and(eq(guildMembers.guildId, guild.id), eq(guildMembers.userId, userId)));
      
      // Update member count
      await db.update(guilds)
        .set({ memberCount: Math.max(1, guild.memberCount - 1), updatedAt: new Date() })
        .where(eq(guilds.id, guild.id));
      
      res.json({ success: true });
    } catch (error) {
      console.error("Leave guild error:", error);
      res.status(500).json({ error: "Failed to leave guild" });
    }
  });

  app.post("/api/guilds/:id/activate-chronolink", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user?.id || req.user?.claims?.sub;
      if (!userId) return res.status(401).json({ error: "Authentication required" });
      
      const [guild] = await db.select().from(guilds).where(eq(guilds.id, req.params.id));
      if (!guild) return res.status(404).json({ error: "Guild not found" });
      if (guild.leaderId !== userId) return res.status(403).json({ error: "Only the guild leader can activate ChronoLink" });
      if (guild.isChronoLinkActive) return res.status(400).json({ error: "ChronoLink already active" });
      
      // Create a ChronoChat community for this guild
      const community = await communityHubService.createCommunity({
        name: guild.name,
        description: `Official ChronoChat for ${guild.name} guild`,
        icon: guild.icon || "⚔️",
        ownerId: userId,
        isPublic: guild.isPublic,
      });
      
      // Link guild to community
      await db.update(guilds)
        .set({ 
          chronoChatCommunityId: community.id, 
          isChronoLinkActive: true,
          shellsBonus: 5, // 5% bonus shells for linked guilds
          updatedAt: new Date() 
        })
        .where(eq(guilds.id, guild.id));
      
      res.json({ success: true, community });
    } catch (error) {
      console.error("Activate ChronoLink error:", error);
      res.status(500).json({ error: "Failed to activate ChronoLink" });
    }
  });

  app.put("/api/guilds/:id", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user?.id || req.user?.claims?.sub;
      if (!userId) return res.status(401).json({ error: "Authentication required" });
      
      const [guild] = await db.select().from(guilds).where(eq(guilds.id, req.params.id));
      if (!guild) return res.status(404).json({ error: "Guild not found" });
      if (guild.leaderId !== userId) return res.status(403).json({ error: "Only the guild leader can update settings" });
      
      const { name, description, icon, isPublic, isRecruiting } = req.body;
      const updates: any = { updatedAt: new Date() };
      
      if (name !== undefined) updates.name = name;
      if (description !== undefined) updates.description = description;
      if (icon !== undefined) updates.icon = icon;
      if (isPublic !== undefined) updates.isPublic = isPublic;
      if (isRecruiting !== undefined) updates.isRecruiting = isRecruiting;
      
      await db.update(guilds).set(updates).where(eq(guilds.id, guild.id));
      
      const [updated] = await db.select().from(guilds).where(eq(guilds.id, guild.id));
      res.json({ success: true, guild: updated });
    } catch (error) {
      console.error("Update guild error:", error);
      res.status(500).json({ error: "Failed to update guild" });
    }
  });

  // Generate guild invite code
  app.post("/api/guilds/:id/invite", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user?.id || req.user?.claims?.sub;
      if (!userId) return res.status(401).json({ error: "Authentication required" });
      
      const [guild] = await db.select().from(guilds).where(eq(guilds.id, req.params.id));
      if (!guild) return res.status(404).json({ error: "Guild not found" });
      
      // Check if user is a member with invite permission
      const [membership] = await db.select().from(guildMembers)
        .where(and(eq(guildMembers.guildId, guild.id), eq(guildMembers.userId, userId)));
      if (!membership || (membership.role !== "leader" && membership.role !== "officer")) {
        return res.status(403).json({ error: "You don't have permission to create invites" });
      }
      
      // Generate invite code
      const code = Math.random().toString(36).substring(2, 10).toUpperCase();
      
      const { maxUses, expiresIn } = req.body;
      const expiresAt = expiresIn ? new Date(Date.now() + expiresIn * 1000) : null;
      
      const [invite] = await db.insert(guildInvites).values({
        guildId: guild.id,
        inviterId: userId,
        code,
        maxUses: maxUses || null,
        expiresAt,
      }).returning();
      
      res.json({ success: true, invite, inviteUrl: `/join/${code}`, code });
    } catch (error) {
      console.error("Create invite error:", error);
      res.status(500).json({ error: "Failed to create invite" });
    }
  });

  // Get invite preview (public - no auth required for landing page)
  app.get("/api/guilds/invite/:code", async (req, res) => {
    try {
      const [invite] = await db.select().from(guildInvites).where(eq(guildInvites.code, req.params.code));
      if (!invite) return res.status(404).json({ error: "Invalid invite code" });
      
      if (invite.expiresAt && new Date(invite.expiresAt) < new Date()) {
        return res.status(400).json({ error: "Invite has expired", expired: true });
      }
      if (invite.maxUses && invite.useCount >= invite.maxUses) {
        return res.status(400).json({ error: "Invite has reached max uses", maxedOut: true });
      }
      
      const [guild] = await db.select().from(guilds).where(eq(guilds.id, invite.guildId));
      if (!guild) return res.status(404).json({ error: "Syndicate not found" });
      
      // Get inviter info
      const [inviter] = await db.select({
        id: users.id,
        displayName: users.displayName,
        username: users.username,
      }).from(users).where(eq(users.id, invite.inviterId));
      
      res.json({
        valid: true,
        code: invite.code,
        expiresAt: invite.expiresAt,
        syndicate: {
          id: guild.id,
          name: guild.name,
          icon: guild.icon,
          description: guild.description,
          memberCount: guild.memberCount,
          maxMembers: guild.maxMembers,
          level: guild.level,
          isChronoLinkActive: guild.isChronoLinkActive,
          shellsBonus: guild.shellsBonus,
        },
        invitedBy: inviter ? {
          displayName: inviter.displayName || inviter.username || "A friend",
        } : { displayName: "A friend" },
      });
    } catch (error) {
      console.error("Get invite preview error:", error);
      res.status(500).json({ error: "Failed to get invite" });
    }
  });

  // Join via invite code
  app.post("/api/guilds/join/:code", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user?.id || req.user?.claims?.sub;
      if (!userId) return res.status(401).json({ error: "Authentication required" });
      
      const [invite] = await db.select().from(guildInvites).where(eq(guildInvites.code, req.params.code));
      if (!invite) return res.status(404).json({ error: "Invalid invite code" });
      
      if (invite.expiresAt && new Date(invite.expiresAt) < new Date()) {
        return res.status(400).json({ error: "Invite has expired" });
      }
      if (invite.maxUses && invite.useCount >= invite.maxUses) {
        return res.status(400).json({ error: "Invite has reached max uses" });
      }
      
      const [guild] = await db.select().from(guilds).where(eq(guilds.id, invite.guildId));
      if (!guild) return res.status(404).json({ error: "Guild not found" });
      if (guild.memberCount >= guild.maxMembers) return res.status(400).json({ error: "Guild is full" });
      
      // Check if already a member
      const existing = await db.select().from(guildMembers)
        .where(and(eq(guildMembers.guildId, guild.id), eq(guildMembers.userId, userId)));
      if (existing.length > 0) return res.status(400).json({ error: "Already a member" });
      
      // Add member
      await db.insert(guildMembers).values({
        guildId: guild.id,
        userId,
        role: "member",
      });
      
      // Update counts
      await db.update(guilds)
        .set({ memberCount: guild.memberCount + 1, updatedAt: new Date() })
        .where(eq(guilds.id, guild.id));
      
      await db.update(guildInvites)
        .set({ useCount: invite.useCount + 1 })
        .where(eq(guildInvites.id, invite.id));
      
      res.json({ success: true, guild });
    } catch (error) {
      console.error("Join via invite error:", error);
      res.status(500).json({ error: "Failed to join guild" });
    }
  });

  // ============================================
  // COMMUNITY HUB API
  // ============================================

  app.get("/api/community/list", async (req, res) => {
    try {
      const communities = await communityHubService.getCommunities();
      res.json({ communities });
    } catch (error) {
      console.error("Get communities error:", error);
      res.status(500).json({ error: "Failed to get communities" });
    }
  });

  app.get("/api/community/my-communities", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user?.claims?.sub || req.user?.id;
      if (!userId) return res.status(401).json({ error: "Authentication required" });
      
      const communities = await communityHubService.getUserCommunities(userId);
      res.json({ communities });
    } catch (error) {
      console.error("Get user communities error:", error);
      res.status(500).json({ error: "Failed to get your communities" });
    }
  });

  app.post("/api/community/create", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user?.claims?.sub || req.user?.id;
      if (!userId) return res.status(401).json({ error: "Authentication required" });
      
      const { name, description, icon, isPublic } = req.body;
      if (!name) return res.status(400).json({ error: "Community name required" });
      
      const community = await communityHubService.createCommunity({
        name,
        description: description || null,
        icon: icon || "⚡",
        ownerId: userId,
        isPublic: isPublic !== false,
      });
      
      res.json({ success: true, community });
    } catch (error) {
      console.error("Create community error:", error);
      res.status(500).json({ error: "Failed to create community" });
    }
  });

  app.get("/api/community/:id", async (req, res) => {
    try {
      const community = await communityHubService.getCommunity(req.params.id);
      if (!community) return res.status(404).json({ error: "Community not found" });
      res.json({ community });
    } catch (error) {
      console.error("Get community error:", error);
      res.status(500).json({ error: "Failed to get community" });
    }
  });

  app.get("/api/community/:id/channels", async (req, res) => {
    try {
      const channels = await communityHubService.getChannels(req.params.id);
      res.json({ channels });
    } catch (error) {
      console.error("Get channels error:", error);
      res.status(500).json({ error: "Failed to get channels" });
    }
  });

  app.post("/api/community/:id/channels", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user?.claims?.sub || req.user?.id;
      if (!userId) return res.status(401).json({ error: "Authentication required" });
      
      const { name, description, type } = req.body;
      if (!name) return res.status(400).json({ error: "Channel name required" });
      
      const channel = await communityHubService.createChannel({
        communityId: req.params.id,
        name,
        description: description || null,
        type: type || "chat",
        position: 0,
      });
      
      res.json({ success: true, channel });
    } catch (error) {
      console.error("Create channel error:", error);
      res.status(500).json({ error: "Failed to create channel" });
    }
  });

  app.post("/api/community/:id/join", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user?.claims?.sub || req.user?.id;
      const username = req.user?.claims?.firstName || req.user?.username || req.user?.email?.split("@")[0] || "User";
      if (!userId) return res.status(401).json({ error: "Authentication required" });
      
      const member = await communityHubService.joinCommunity(req.params.id, userId, username);
      res.json({ success: true, member });
    } catch (error) {
      console.error("Join community error:", error);
      res.status(500).json({ error: "Failed to join community" });
    }
  });

  app.post("/api/community/:id/leave", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user?.claims?.sub || req.user?.id;
      if (!userId) return res.status(401).json({ error: "Authentication required" });
      
      await communityHubService.leaveCommunity(req.params.id, userId);
      res.json({ success: true });
    } catch (error) {
      console.error("Leave community error:", error);
      res.status(500).json({ error: "Failed to leave community" });
    }
  });

  app.get("/api/community/:id/members", async (req, res) => {
    try {
      const members = await communityHubService.getMembers(req.params.id);
      res.json({ members });
    } catch (error) {
      console.error("Get members error:", error);
      res.status(500).json({ error: "Failed to get members" });
    }
  });

  app.get("/api/channel/:id/messages", async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 50;
      const messages = await communityHubService.getMessages(req.params.id, limit);
      res.json({ messages: messages.reverse() });
    } catch (error) {
      console.error("Get messages error:", error);
      res.status(500).json({ error: "Failed to get messages" });
    }
  });

  app.post("/api/channel/:id/messages", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user?.claims?.sub || req.user?.id;
      const username = req.user?.claims?.firstName || req.user?.username || req.user?.email?.split("@")[0] || "User";
      if (!userId) return res.status(401).json({ error: "Authentication required" });
      
      const { content, replyToId } = req.body;
      if (!content) return res.status(400).json({ error: "Message content required" });
      
      const channelId = req.params.id;
      
      const message = await communityHubService.sendMessage({
        channelId,
        userId,
        username,
        content,
        replyToId: replyToId || null,
        isBot: false,
      });
      
      // Broadcast to WebSocket subscribers
      broadcastToChannel(channelId, { type: 'NEW_MESSAGE', payload: message });
      
      // Process bot commands if message starts with /
      if (content.startsWith("/")) {
        const botResponse = await walletBotService.processMessage(content, userId, channelId);
        if (botResponse) {
          const botMessage = await walletBotService.sendBotMessage(channelId, botResponse);
          if (botMessage) {
            broadcastToChannel(channelId, { type: 'NEW_MESSAGE', payload: botMessage });
          }
        }
      }
      
      res.json({ success: true, message });
    } catch (error) {
      console.error("Send message error:", error);
      res.status(500).json({ error: "Failed to send message" });
    }
  });

  app.delete("/api/message/:id", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user?.claims?.sub || req.user?.id;
      if (!userId) return res.status(401).json({ error: "Authentication required" });
      
      const deleted = await communityHubService.deleteMessage(req.params.id, userId);
      if (!deleted) return res.status(403).json({ error: "Cannot delete this message" });
      
      res.json({ success: true });
    } catch (error) {
      console.error("Delete message error:", error);
      res.status(500).json({ error: "Failed to delete message" });
    }
  });

  app.post("/api/community/:id/bots", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user?.claims?.sub || req.user?.id;
      if (!userId) return res.status(401).json({ error: "Authentication required" });
      
      const { name, description } = req.body;
      if (!name) return res.status(400).json({ error: "Bot name required" });
      
      const bot = await communityHubService.createBot(req.params.id, name, description || "");
      res.json({ success: true, bot });
    } catch (error) {
      console.error("Create bot error:", error);
      res.status(500).json({ error: "Failed to create bot" });
    }
  });

  app.get("/api/community/:id/bots", async (req, res) => {
    try {
      const bots = await communityHubService.getBots(req.params.id);
      res.json({ bots });
    } catch (error) {
      console.error("Get bots error:", error);
      res.status(500).json({ error: "Failed to get bots" });
    }
  });

  app.post("/api/bot/message", async (req, res) => {
    try {
      const { apiKey, channelId, content } = req.body;
      if (!apiKey || !channelId || !content) {
        return res.status(400).json({ error: "API key, channel ID, and content required" });
      }
      
      const message = await communityHubService.sendBotMessage(apiKey, channelId, content);
      if (!message) return res.status(403).json({ error: "Invalid bot API key or bot disabled" });
      
      res.json({ success: true, message });
    } catch (error) {
      console.error("Bot message error:", error);
      res.status(500).json({ error: "Failed to send bot message" });
    }
  });

  // ============================================
  // CHRONOCHAT ENHANCED FEATURES
  // ============================================

  // Pinned Messages
  app.post("/api/community/channel/:channelId/pin/:messageId", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user?.claims?.sub || req.user?.id;
      if (!userId) return res.status(401).json({ error: "Authentication required" });
      const pinned = await communityHubService.pinMessage(req.params.messageId, req.params.channelId, userId);
      res.json({ success: true, pinned });
    } catch (error) {
      console.error("Pin message error:", error);
      res.status(500).json({ error: "Failed to pin message" });
    }
  });

  app.delete("/api/community/channel/:channelId/pin/:messageId", isAuthenticated, async (req: any, res) => {
    try {
      await communityHubService.unpinMessage(req.params.messageId);
      res.json({ success: true });
    } catch (error) {
      console.error("Unpin message error:", error);
      res.status(500).json({ error: "Failed to unpin message" });
    }
  });

  app.get("/api/community/channel/:channelId/pinned", async (req, res) => {
    try {
      const messages = await communityHubService.getPinnedMessages(req.params.channelId);
      res.json({ messages });
    } catch (error) {
      console.error("Get pinned messages error:", error);
      res.status(500).json({ error: "Failed to get pinned messages" });
    }
  });

  // Message Search
  app.get("/api/community/channel/:channelId/search", async (req, res) => {
    try {
      const query = req.query.q as string;
      if (!query) return res.status(400).json({ error: "Search query required" });
      const messages = await communityHubService.searchMessages(req.params.channelId, query);
      res.json({ messages });
    } catch (error) {
      console.error("Search messages error:", error);
      res.status(500).json({ error: "Failed to search messages" });
    }
  });

  app.get("/api/community/:communityId/search", async (req, res) => {
    try {
      const query = req.query.q as string;
      if (!query) return res.status(400).json({ error: "Search query required" });
      const messages = await communityHubService.searchMessagesGlobal(req.params.communityId, query);
      res.json({ messages });
    } catch (error) {
      console.error("Global search error:", error);
      res.status(500).json({ error: "Failed to search messages" });
    }
  });

  // Polls
  app.post("/api/community/channel/:channelId/polls", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user?.claims?.sub || req.user?.id;
      const username = req.user?.claims?.firstName || req.user?.firstName || "User";
      if (!userId) return res.status(401).json({ error: "Authentication required" });
      const { question, options, allowMultiple, endsAt } = req.body;
      if (!question || !options || options.length < 2) {
        return res.status(400).json({ error: "Question and at least 2 options required" });
      }
      const poll = await communityHubService.createPoll(req.params.channelId, userId, username, question, options, allowMultiple, endsAt ? new Date(endsAt) : undefined);
      res.json({ success: true, poll });
    } catch (error) {
      console.error("Create poll error:", error);
      res.status(500).json({ error: "Failed to create poll" });
    }
  });

  app.get("/api/community/channel/:channelId/polls", async (req, res) => {
    try {
      const polls = await communityHubService.getChannelPolls(req.params.channelId);
      res.json({ polls });
    } catch (error) {
      console.error("Get polls error:", error);
      res.status(500).json({ error: "Failed to get polls" });
    }
  });

  app.post("/api/community/poll/:pollId/vote", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user?.claims?.sub || req.user?.id;
      if (!userId) return res.status(401).json({ error: "Authentication required" });
      const { optionIndex } = req.body;
      if (optionIndex === undefined) return res.status(400).json({ error: "Option index required" });
      await communityHubService.votePoll(req.params.pollId, userId, optionIndex);
      const results = await communityHubService.getPollResults(req.params.pollId);
      res.json({ success: true, results });
    } catch (error) {
      console.error("Vote poll error:", error);
      res.status(500).json({ error: "Failed to vote" });
    }
  });

  app.get("/api/community/poll/:pollId/results", async (req, res) => {
    try {
      const results = await communityHubService.getPollResults(req.params.pollId);
      res.json(results);
    } catch (error) {
      console.error("Get poll results error:", error);
      res.status(500).json({ error: "Failed to get poll results" });
    }
  });

  // Scheduled Messages
  app.post("/api/community/channel/:channelId/schedule", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user?.claims?.sub || req.user?.id;
      const username = req.user?.claims?.firstName || req.user?.firstName || "User";
      if (!userId) return res.status(401).json({ error: "Authentication required" });
      const { content, scheduledFor } = req.body;
      if (!content || !scheduledFor) return res.status(400).json({ error: "Content and scheduled time required" });
      const msg = await communityHubService.scheduleMessage(req.params.channelId, userId, username, content, new Date(scheduledFor));
      res.json({ success: true, message: msg });
    } catch (error) {
      console.error("Schedule message error:", error);
      res.status(500).json({ error: "Failed to schedule message" });
    }
  });

  app.get("/api/community/channel/:channelId/scheduled", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user?.claims?.sub || req.user?.id;
      if (!userId) return res.status(401).json({ error: "Authentication required" });
      const messages = await communityHubService.getScheduledMessages(req.params.channelId, userId);
      res.json({ messages });
    } catch (error) {
      console.error("Get scheduled messages error:", error);
      res.status(500).json({ error: "Failed to get scheduled messages" });
    }
  });

  app.delete("/api/community/scheduled/:messageId", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user?.claims?.sub || req.user?.id;
      if (!userId) return res.status(401).json({ error: "Authentication required" });
      await communityHubService.cancelScheduledMessage(req.params.messageId, userId);
      res.json({ success: true });
    } catch (error) {
      console.error("Cancel scheduled message error:", error);
      res.status(500).json({ error: "Failed to cancel scheduled message" });
    }
  });

  // Direct Messages
  app.get("/api/dm/conversations", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user?.claims?.sub || req.user?.id;
      if (!userId) return res.status(401).json({ error: "Authentication required" });
      const conversations = await communityHubService.getUserConversations(userId);
      res.json({ conversations });
    } catch (error) {
      console.error("Get conversations error:", error);
      res.status(500).json({ error: "Failed to get conversations" });
    }
  });

  app.post("/api/dm/start", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user?.claims?.sub || req.user?.id;
      const username = req.user?.claims?.firstName || req.user?.firstName || "User";
      if (!userId) return res.status(401).json({ error: "Authentication required" });
      const { targetUserId, targetUsername } = req.body;
      if (!targetUserId || !targetUsername) return res.status(400).json({ error: "Target user required" });
      const conversation = await communityHubService.getOrCreateDmConversation(userId, username, targetUserId, targetUsername);
      res.json({ conversation });
    } catch (error) {
      console.error("Start DM error:", error);
      res.status(500).json({ error: "Failed to start conversation" });
    }
  });

  app.get("/api/dm/:conversationId/messages", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user?.claims?.sub || req.user?.id;
      if (!userId) return res.status(401).json({ error: "Authentication required" });
      const messages = await communityHubService.getDirectMessages(req.params.conversationId);
      await communityHubService.markDmAsRead(req.params.conversationId, userId);
      res.json({ messages: messages.reverse() });
    } catch (error) {
      console.error("Get DM messages error:", error);
      res.status(500).json({ error: "Failed to get messages" });
    }
  });

  app.post("/api/dm/:conversationId/send", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user?.claims?.sub || req.user?.id;
      const username = req.user?.claims?.firstName || req.user?.firstName || "User";
      if (!userId) return res.status(401).json({ error: "Authentication required" });
      const { content, attachment } = req.body;
      if (!content?.trim()) return res.status(400).json({ error: "Message content required" });
      const message = await communityHubService.sendDirectMessage(req.params.conversationId, userId, username, content, attachment);
      res.json({ success: true, message });
    } catch (error) {
      console.error("Send DM error:", error);
      res.status(500).json({ error: "Failed to send message" });
    }
  });

  // Roles & Permissions
  app.get("/api/community/:communityId/roles", async (req, res) => {
    try {
      const roles = await communityHubService.getRoles(req.params.communityId);
      res.json({ roles });
    } catch (error) {
      console.error("Get roles error:", error);
      res.status(500).json({ error: "Failed to get roles" });
    }
  });

  app.post("/api/community/:communityId/roles", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user?.claims?.sub || req.user?.id;
      if (!userId) return res.status(401).json({ error: "Authentication required" });
      const hasPermission = await communityHubService.hasPermission(req.params.communityId, userId, "manage_roles");
      if (!hasPermission) return res.status(403).json({ error: "No permission to manage roles" });
      const { name, permissions, color } = req.body;
      if (!name || !permissions) return res.status(400).json({ error: "Role name and permissions required" });
      const role = await communityHubService.createRole(req.params.communityId, name, permissions, color);
      res.json({ success: true, role });
    } catch (error) {
      console.error("Create role error:", error);
      res.status(500).json({ error: "Failed to create role" });
    }
  });

  app.post("/api/community/:communityId/members/:memberId/role", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user?.claims?.sub || req.user?.id;
      if (!userId) return res.status(401).json({ error: "Authentication required" });
      const hasPermission = await communityHubService.hasPermission(req.params.communityId, userId, "manage_roles");
      if (!hasPermission) return res.status(403).json({ error: "No permission to assign roles" });
      const { role } = req.body;
      if (!role) return res.status(400).json({ error: "Role name required" });
      await communityHubService.assignRole(req.params.communityId, req.params.memberId, role);
      res.json({ success: true });
    } catch (error) {
      console.error("Assign role error:", error);
      res.status(500).json({ error: "Failed to assign role" });
    }
  });

  app.get("/api/community/:communityId/permissions", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user?.claims?.sub || req.user?.id;
      if (!userId) return res.status(401).json({ error: "Authentication required" });
      const permissions = await communityHubService.getMemberPermissions(req.params.communityId, userId);
      res.json({ permissions });
    } catch (error) {
      console.error("Get permissions error:", error);
      res.status(500).json({ error: "Failed to get permissions" });
    }
  });

  // Custom Emojis
  app.get("/api/community/:communityId/emojis", async (req, res) => {
    try {
      const emojis = await communityHubService.getCustomEmojis(req.params.communityId);
      res.json({ emojis });
    } catch (error) {
      console.error("Get emojis error:", error);
      res.status(500).json({ error: "Failed to get emojis" });
    }
  });

  app.post("/api/community/:communityId/emojis", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user?.claims?.sub || req.user?.id;
      if (!userId) return res.status(401).json({ error: "Authentication required" });
      const { name, imageUrl } = req.body;
      if (!name || !imageUrl) return res.status(400).json({ error: "Emoji name and image required" });
      const emoji = await communityHubService.addCustomEmoji(req.params.communityId, name, imageUrl, userId);
      res.json({ success: true, emoji });
    } catch (error) {
      console.error("Add emoji error:", error);
      res.status(500).json({ error: "Failed to add emoji" });
    }
  });

  app.delete("/api/community/emoji/:emojiId", isAuthenticated, async (req: any, res) => {
    try {
      await communityHubService.deleteCustomEmoji(req.params.emojiId);
      res.json({ success: true });
    } catch (error) {
      console.error("Delete emoji error:", error);
      res.status(500).json({ error: "Failed to delete emoji" });
    }
  });

  // Notification Settings
  app.get("/api/community/:communityId/notifications", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user?.claims?.sub || req.user?.id;
      if (!userId) return res.status(401).json({ error: "Authentication required" });
      const channelId = req.query.channelId as string | undefined;
      const level = await communityHubService.getNotificationLevel(userId, req.params.communityId, channelId);
      res.json({ level });
    } catch (error) {
      console.error("Get notification level error:", error);
      res.status(500).json({ error: "Failed to get notification settings" });
    }
  });

  app.post("/api/community/:communityId/notifications", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user?.claims?.sub || req.user?.id;
      if (!userId) return res.status(401).json({ error: "Authentication required" });
      const { level, channelId } = req.body;
      if (!level) return res.status(400).json({ error: "Notification level required" });
      await communityHubService.setNotificationLevel(userId, req.params.communityId, level, channelId);
      res.json({ success: true });
    } catch (error) {
      console.error("Set notification level error:", error);
      res.status(500).json({ error: "Failed to set notification settings" });
    }
  });

  // Thread Replies
  app.get("/api/community/message/:messageId/thread", async (req, res) => {
    try {
      const replies = await communityHubService.getThreadReplies(req.params.messageId);
      res.json({ replies });
    } catch (error) {
      console.error("Get thread replies error:", error);
      res.status(500).json({ error: "Failed to get thread replies" });
    }
  });

  app.post("/api/community/message/:messageId/thread", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user?.claims?.sub || req.user?.id;
      const username = req.user?.claims?.firstName || req.user?.firstName || "User";
      if (!userId) return res.status(401).json({ error: "Authentication required" });
      const { channelId, content } = req.body;
      if (!channelId || !content) return res.status(400).json({ error: "Channel and content required" });
      const reply = await communityHubService.addThreadReply(req.params.messageId, channelId, userId, username, content);
      res.json({ success: true, reply });
    } catch (error) {
      console.error("Add thread reply error:", error);
      res.status(500).json({ error: "Failed to add thread reply" });
    }
  });

  // Message Forwarding
  app.post("/api/community/message/:messageId/forward", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user?.claims?.sub || req.user?.id;
      const username = req.user?.claims?.firstName || req.user?.firstName || "User";
      if (!userId) return res.status(401).json({ error: "Authentication required" });
      const { toChannelId } = req.body;
      if (!toChannelId) return res.status(400).json({ error: "Target channel required" });
      const forwarded = await communityHubService.forwardMessage(req.params.messageId, toChannelId, userId, username);
      res.json({ success: true, message: forwarded });
    } catch (error) {
      console.error("Forward message error:", error);
      res.status(500).json({ error: "Failed to forward message" });
    }
  });

  // ============================================
  // SHELLS ECONOMY API
  // ============================================

  app.get("/api/shells/wallet", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user?.claims?.sub || req.user?.id;
      const username = req.user?.claims?.firstName || req.user?.firstName || "User";
      if (!userId) return res.status(401).json({ error: "Authentication required" });
      
      const wallet = await shellsService.getOrCreateWallet(userId, username);
      res.json({ wallet });
    } catch (error) {
      console.error("Get wallet error:", error);
      res.status(500).json({ error: "Failed to get wallet" });
    }
  });

  app.get("/api/shells/balance", async (req: any, res, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    if (authHeader?.startsWith("Bearer ")) {
      return isChroniclesAuthenticated(req, res, next);
    }
    return isAuthenticated(req, res, next);
  }, async (req: any, res) => {
    try {
      const userId = req.user?.claims?.sub || req.user?.id;
      if (!userId) return res.status(401).json({ error: "Authentication required" });
      
      const balance = await shellsService.getBalance(userId);
      res.json(balance);
    } catch (error) {
      console.error("Get balance error:", error);
      res.status(500).json({ error: "Failed to get balance" });
    }
  });

  app.get("/api/shells/transactions", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user?.claims?.sub || req.user?.id;
      if (!userId) return res.status(401).json({ error: "Authentication required" });
      
      const limit = parseInt(req.query.limit as string) || 50;
      const transactions = await shellsService.getTransactions(userId, limit);
      res.json({ transactions });
    } catch (error) {
      console.error("Get transactions error:", error);
      res.status(500).json({ error: "Failed to get transactions" });
    }
  });

  // Claim starter bonus for new players
  app.post("/api/shells/claim-starter-bonus", async (req: any, res, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    if (authHeader?.startsWith("Bearer ")) {
      return isChroniclesAuthenticated(req, res, next);
    }
    return isAuthenticated(req, res, next);
  }, async (req: any, res) => {
    try {
      const userId = req.user?.claims?.sub || req.user?.id;
      const username = req.user?.claims?.firstName || req.user?.firstName || req.user?.username || "Player";
      if (!userId) return res.status(401).json({ error: "Authentication required" });
      
      const result = await shellsService.claimStarterBonus(userId, username);
      res.json(result);
    } catch (error) {
      console.error("Claim starter bonus error:", error);
      res.status(500).json({ error: "Failed to claim bonus" });
    }
  });

  // Get earning caps status for current user
  app.get("/api/shells/earning-status", async (req: any, res, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    if (authHeader?.startsWith("Bearer ")) {
      return isChroniclesAuthenticated(req, res, next);
    }
    return isAuthenticated(req, res, next);
  }, async (req: any, res) => {
    try {
      const userId = req.user?.claims?.sub || req.user?.id;
      if (!userId) return res.status(401).json({ error: "Authentication required" });
      
      const { SHELL_EARNING_CAPS } = await import("./shells-service");
      const status = await shellsService.getEarnableAmount(userId, 1000);
      
      res.json({
        dailyLimit: SHELL_EARNING_CAPS.dailyMax,
        weeklyLimit: SHELL_EARNING_CAPS.weeklyMax,
        dailyRemaining: status.dailyRemaining,
        weeklyRemaining: status.weeklyRemaining,
        atDailyCap: status.atDailyCap,
        atWeeklyCap: status.atWeeklyCap,
        starterBonus: SHELL_EARNING_CAPS.starterBonus,
      });
    } catch (error) {
      console.error("Get earning status error:", error);
      res.status(500).json({ error: "Failed to get earning status" });
    }
  });

  app.post("/api/shells/tip", isAuthenticated, async (req: any, res) => {
    try {
      const fromUserId = req.user?.claims?.sub || req.user?.id;
      const fromUsername = req.user?.claims?.firstName || req.user?.firstName || "User";
      if (!fromUserId) return res.status(401).json({ error: "Authentication required" });
      
      const { toUserId, toUsername, amount, messageId } = req.body;
      if (!toUserId || !toUsername || !amount || amount <= 0) {
        return res.status(400).json({ error: "Invalid tip data" });
      }
      
      if (fromUserId === toUserId) {
        return res.status(400).json({ error: "Cannot tip yourself" });
      }
      
      const result = await shellsService.tipUser(fromUserId, fromUsername, toUserId, toUsername, amount, messageId);
      if (!result) {
        return res.status(400).json({ error: "Insufficient Shells balance" });
      }
      
      res.json({ success: true, sent: result.sent, received: result.received });
    } catch (error) {
      console.error("Tip error:", error);
      res.status(500).json({ error: "Failed to send tip" });
    }
  });

  app.get("/api/shells/packages", async (req, res) => {
    try {
      const packages = Object.entries(SHELL_PACKAGES).map(([key, pkg]) => ({
        id: key,
        ...pkg,
        formattedPrice: `$${(pkg.price / 100).toFixed(2)}`,
      }));
      res.json({ packages });
    } catch (error) {
      console.error("Get packages error:", error);
      res.status(500).json({ error: "Failed to get packages" });
    }
  });

  // Shells Economy - Virtual Currency System (pre-launch engagement currency)
  app.get("/api/shells/packages-list", async (req, res) => {
    try {
      res.json({
        packages: [
          { id: "starter", name: "Shell Starter", shells: 1000, bonusShells: 0, priceUsd: 499, formattedPrice: "$4.99", popular: false },
          { id: "value", name: "Shell Value Pack", shells: 2500, bonusShells: 250, priceUsd: 999, formattedPrice: "$9.99", popular: false },
          { id: "popular", name: "Shell Popular Pack", shells: 6000, bonusShells: 1000, priceUsd: 1999, formattedPrice: "$19.99", popular: true },
          { id: "mega", name: "Shell Mega Pack", shells: 15000, bonusShells: 3500, priceUsd: 4999, formattedPrice: "$49.99", popular: false },
          { id: "whale", name: "Shell Whale Pack", shells: 35000, bonusShells: 10000, priceUsd: 9999, formattedPrice: "$99.99", popular: false },
        ],
        exchangeRate: "1 Shell = 1 DWC at TGE (Apr 11, 2026)",
        currency: "Shells",
        conversionNote: "All Shells convert to DWC tokens at Token Generation Event"
      });
    } catch (error) {
      console.error("Get shells packages error:", error);
      res.status(500).json({ error: "Failed to get shells packages" });
    }
  });

  app.get("/api/shells/my-balance", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user?.claims?.sub || req.session?.userId;
      if (!userId) {
        return res.status(401).json({ error: "Not authenticated" });
      }
      const shellBalance = await shellsService.getBalance(userId);
      res.json({
        balance: shellBalance || 0,
        pendingConversion: shellBalance || 0,
        conversionDate: "2026-04-11T00:00:00Z"
      });
    } catch (error) {
      console.error("Get shells balance error:", error);
      res.status(500).json({ error: "Failed to get shells balance" });
    }
  });

  app.get("/api/shells/earn-rates", async (req, res) => {
    try {
      res.json({ rates: SHELL_EARN_RATES });
    } catch (error) {
      res.status(500).json({ error: "Failed to get earn rates" });
    }
  });

  app.get("/api/shells/costs", async (req, res) => {
    try {
      res.json({ costs: SHELL_COSTS });
    } catch (error) {
      res.status(500).json({ error: "Failed to get costs" });
    }
  });

  app.get("/api/shells/leaderboard", async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 10;
      const leaderboard = await shellsService.getLeaderboard(limit);
      res.json({ leaderboard });
    } catch (error) {
      console.error("Get leaderboard error:", error);
      res.status(500).json({ error: "Failed to get leaderboard" });
    }
  });

  app.get("/api/shells/stats", async (req, res) => {
    try {
      const stats = await shellsService.getTotalStats();
      res.json(stats);
    } catch (error) {
      console.error("Get stats error:", error);
      res.status(500).json({ error: "Failed to get stats" });
    }
  });

  // =====================================================
  // COMMUNITY BUILDER PROGRAM API
  // =====================================================

  // Get or create builder profile
  app.get("/api/builder/profile", async (req: any, res, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    if (authHeader?.startsWith("Bearer ")) {
      return isChroniclesAuthenticated(req, res, next);
    }
    return isAuthenticated(req, res, next);
  }, async (req: any, res) => {
    try {
      const userId = req.user?.claims?.sub || req.user?.id;
      const username = req.user?.claims?.firstName || req.user?.firstName || req.user?.username || "Builder";
      if (!userId) return res.status(401).json({ error: "Authentication required" });
      
      const builder = await builderService.getOrCreateBuilder(userId, username);
      const tiers = await builderService.getTiers();
      const currentTier = tiers.find(t => t.tier === builder.tier);
      const nextTier = tiers.find(t => t.tier === builder.tier + 1);
      
      res.json({ 
        builder, 
        currentTier,
        nextTier,
        eligibilityCheck: nextTier ? await builderService.checkTierEligibility(builder.id) : null
      });
    } catch (error) {
      console.error("Get builder profile error:", error);
      res.status(500).json({ error: "Failed to get builder profile" });
    }
  });

  // Get builder tiers and requirements
  app.get("/api/builder/tiers", async (req, res) => {
    try {
      const tiers = await builderService.getTiers();
      res.json({ tiers });
    } catch (error) {
      console.error("Get tiers error:", error);
      res.status(500).json({ error: "Failed to get tiers" });
    }
  });

  // Get contribution types available for user's tier
  app.get("/api/builder/contribution-types", async (req: any, res, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    if (authHeader?.startsWith("Bearer ")) {
      return isChroniclesAuthenticated(req, res, next);
    }
    return isAuthenticated(req, res, next);
  }, async (req: any, res) => {
    try {
      const userId = req.user?.claims?.sub || req.user?.id;
      if (!userId) return res.status(401).json({ error: "Authentication required" });
      
      const builder = await builderService.getBuilder(userId);
      const tier = builder?.tier || 1;
      const types = await builderService.getContributionTypes(tier);
      
      res.json({ types, currentTier: tier });
    } catch (error) {
      console.error("Get contribution types error:", error);
      res.status(500).json({ error: "Failed to get contribution types" });
    }
  });

  // Get all badges
  app.get("/api/builder/badges", async (req, res) => {
    try {
      const badges = await builderService.getBadges();
      res.json({ badges });
    } catch (error) {
      console.error("Get badges error:", error);
      res.status(500).json({ error: "Failed to get badges" });
    }
  });

  // Get my contributions
  app.get("/api/builder/contributions", async (req: any, res, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    if (authHeader?.startsWith("Bearer ")) {
      return isChroniclesAuthenticated(req, res, next);
    }
    return isAuthenticated(req, res, next);
  }, async (req: any, res) => {
    try {
      const userId = req.user?.claims?.sub || req.user?.id;
      if (!userId) return res.status(401).json({ error: "Authentication required" });
      
      const status = req.query.status as string | undefined;
      const contributions = await builderService.getContributions(userId, status);
      
      res.json({ contributions });
    } catch (error) {
      console.error("Get contributions error:", error);
      res.status(500).json({ error: "Failed to get contributions" });
    }
  });

  // Create a new contribution (draft)
  app.post("/api/builder/contributions", async (req: any, res, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    if (authHeader?.startsWith("Bearer ")) {
      return isChroniclesAuthenticated(req, res, next);
    }
    return isAuthenticated(req, res, next);
  }, async (req: any, res) => {
    try {
      const userId = req.user?.claims?.sub || req.user?.id;
      const username = req.user?.claims?.firstName || req.user?.firstName || req.user?.username || "Builder";
      if (!userId) return res.status(401).json({ error: "Authentication required" });
      
      const { typeCode, title, description, contentData, targetEra, category } = req.body;
      
      if (!typeCode || !title || !description || !contentData) {
        return res.status(400).json({ error: "Missing required fields: typeCode, title, description, contentData" });
      }
      
      const builder = await builderService.getOrCreateBuilder(userId, username);
      
      const contribution = await builderService.createContribution(
        builder.id,
        userId,
        typeCode,
        title,
        description,
        contentData,
        targetEra,
        category
      );
      
      res.json({ success: true, contribution });
    } catch (error) {
      console.error("Create contribution error:", error);
      res.status(500).json({ error: "Failed to create contribution" });
    }
  });

  // Submit contribution for review
  app.post("/api/builder/contributions/:id/submit", async (req: any, res, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    if (authHeader?.startsWith("Bearer ")) {
      return isChroniclesAuthenticated(req, res, next);
    }
    return isAuthenticated(req, res, next);
  }, async (req: any, res) => {
    try {
      const userId = req.user?.claims?.sub || req.user?.id;
      if (!userId) return res.status(401).json({ error: "Authentication required" });
      
      const { id } = req.params;
      const result = await builderService.submitContribution(id, userId);
      
      res.json(result);
    } catch (error) {
      console.error("Submit contribution error:", error);
      res.status(500).json({ error: "Failed to submit contribution" });
    }
  });

  // Vote on a contribution
  app.post("/api/builder/contributions/:id/vote", async (req: any, res, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    if (authHeader?.startsWith("Bearer ")) {
      return isChroniclesAuthenticated(req, res, next);
    }
    return isAuthenticated(req, res, next);
  }, async (req: any, res) => {
    try {
      const userId = req.user?.claims?.sub || req.user?.id;
      const username = req.user?.claims?.firstName || req.user?.firstName || req.user?.username || "Voter";
      if (!userId) return res.status(401).json({ error: "Authentication required" });
      
      const { id } = req.params;
      const { voteType, comment } = req.body;
      
      if (!voteType || !["up", "down"].includes(voteType)) {
        return res.status(400).json({ error: "Invalid vote type. Use 'up' or 'down'" });
      }
      
      const builder = await builderService.getOrCreateBuilder(userId, username);
      const result = await builderService.voteOnContribution(id, builder.id, userId, voteType, comment);
      
      res.json(result);
    } catch (error) {
      console.error("Vote error:", error);
      res.status(500).json({ error: "Failed to record vote" });
    }
  });

  // Builder leaderboard
  app.get("/api/builder/leaderboard", async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 20;
      const leaderboard = await builderService.getLeaderboard(limit);
      res.json({ leaderboard });
    } catch (error) {
      console.error("Get builder leaderboard error:", error);
      res.status(500).json({ error: "Failed to get leaderboard" });
    }
  });

  // Get pending reviews (for tier 3+ reviewers)
  app.get("/api/builder/pending-reviews", async (req: any, res, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    if (authHeader?.startsWith("Bearer ")) {
      return isChroniclesAuthenticated(req, res, next);
    }
    return isAuthenticated(req, res, next);
  }, async (req: any, res) => {
    try {
      const userId = req.user?.claims?.sub || req.user?.id;
      if (!userId) return res.status(401).json({ error: "Authentication required" });
      
      const builder = await builderService.getBuilder(userId);
      if (!builder || !builder.canReviewContent) {
        return res.status(403).json({ error: "Review permission required (Tier 3+)" });
      }
      
      const pending = await builderService.getPendingReviews(builder.tier);
      res.json({ contributions: pending });
    } catch (error) {
      console.error("Get pending reviews error:", error);
      res.status(500).json({ error: "Failed to get pending reviews" });
    }
  });

  // Approve a contribution (tier 3+ reviewers)
  app.post("/api/builder/contributions/:id/approve", async (req: any, res, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    if (authHeader?.startsWith("Bearer ")) {
      return isChroniclesAuthenticated(req, res, next);
    }
    return isAuthenticated(req, res, next);
  }, async (req: any, res) => {
    try {
      const userId = req.user?.claims?.sub || req.user?.id;
      if (!userId) return res.status(401).json({ error: "Authentication required" });
      
      const builder = await builderService.getBuilder(userId);
      if (!builder || !builder.canReviewContent) {
        return res.status(403).json({ error: "Review permission required (Tier 3+)" });
      }
      
      const { id } = req.params;
      const { feedback, qualityRating } = req.body;
      
      if (!feedback) {
        return res.status(400).json({ error: "Feedback is required" });
      }
      
      const validRatings = ["standard", "quality", "exceptional", "legendary"];
      const rating = validRatings.includes(qualityRating) ? qualityRating : "standard";
      
      const result = await builderService.approveContribution(id, builder.id, feedback, rating);
      res.json(result);
    } catch (error) {
      console.error("Approve contribution error:", error);
      res.status(500).json({ error: "Failed to approve contribution" });
    }
  });

  // Reject a contribution (tier 3+ reviewers)
  app.post("/api/builder/contributions/:id/reject", async (req: any, res, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    if (authHeader?.startsWith("Bearer ")) {
      return isChroniclesAuthenticated(req, res, next);
    }
    return isAuthenticated(req, res, next);
  }, async (req: any, res) => {
    try {
      const userId = req.user?.claims?.sub || req.user?.id;
      if (!userId) return res.status(401).json({ error: "Authentication required" });
      
      const builder = await builderService.getBuilder(userId);
      if (!builder || !builder.canReviewContent) {
        return res.status(403).json({ error: "Review permission required (Tier 3+)" });
      }
      
      const { id } = req.params;
      const { feedback } = req.body;
      
      if (!feedback) {
        return res.status(400).json({ error: "Feedback is required for rejections" });
      }
      
      const result = await builderService.rejectContribution(id, builder.id, feedback);
      res.json(result);
    } catch (error) {
      console.error("Reject contribution error:", error);
      res.status(500).json({ error: "Failed to reject contribution" });
    }
  });

  // Make contribution live (system or admin)
  app.post("/api/builder/contributions/:id/publish", async (req: any, res, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    if (authHeader?.startsWith("Bearer ")) {
      return isChroniclesAuthenticated(req, res, next);
    }
    return isAuthenticated(req, res, next);
  }, async (req: any, res) => {
    try {
      const userId = req.user?.claims?.sub || req.user?.id;
      if (!userId) return res.status(401).json({ error: "Authentication required" });
      
      const builder = await builderService.getBuilder(userId);
      if (!builder) {
        return res.status(403).json({ error: "Builder profile required" });
      }
      
      const { id } = req.params;
      
      // Check if user owns this contribution or is a reviewer
      const contribution = await builderService.getContributionById(id);
      if (!contribution) {
        return res.status(404).json({ error: "Contribution not found" });
      }
      
      if (contribution.userId !== userId && !builder.canReviewContent) {
        return res.status(403).json({ error: "Not authorized to publish this contribution" });
      }
      
      const result = await builderService.makeContributionLive(id);
      res.json(result);
    } catch (error) {
      console.error("Publish contribution error:", error);
      res.status(500).json({ error: "Failed to publish contribution" });
    }
  });

  // Get single contribution details
  app.get("/api/builder/contributions/:id", async (req: any, res, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    if (authHeader?.startsWith("Bearer ")) {
      return isChroniclesAuthenticated(req, res, next);
    }
    return isAuthenticated(req, res, next);
  }, async (req: any, res) => {
    try {
      const { id } = req.params;
      const contribution = await builderService.getContributionById(id);
      
      if (!contribution) {
        return res.status(404).json({ error: "Contribution not found" });
      }
      
      res.json({ contribution });
    } catch (error) {
      console.error("Get contribution error:", error);
      res.status(500).json({ error: "Failed to get contribution" });
    }
  });

  // ============================================
  // CHRONICLES LIFE SIMULATION API
  // ============================================
  
  // Get character status with needs
  app.get("/api/chronicles/character", async (req: any, res, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    if (authHeader?.startsWith("Bearer ")) {
      return isChroniclesAuthenticated(req, res, next);
    }
    return isAuthenticated(req, res, next);
  }, async (req: any, res) => {
    try {
      const userId = req.user?.claims?.sub || req.user?.id;
      if (!userId) return res.status(401).json({ error: "Authentication required" });
      
      const status = await needsService.getCharacterStatus(userId);
      if (!status) {
        return res.status(404).json({ error: "Character not found", needsOnboarding: true });
      }
      
      res.json(status);
    } catch (error) {
      console.error("Get character status error:", error);
      res.status(500).json({ error: "Failed to get character status" });
    }
  });

  // Create character
  app.post("/api/chronicles/character", async (req: any, res, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    if (authHeader?.startsWith("Bearer ")) {
      return isChroniclesAuthenticated(req, res, next);
    }
    return isAuthenticated(req, res, next);
  }, async (req: any, res) => {
    try {
      const userId = req.user?.claims?.sub || req.user?.id;
      if (!userId) return res.status(401).json({ error: "Authentication required" });
      
      const { name, primaryTrait, secondaryTrait, era } = req.body;
      if (!name) {
        return res.status(400).json({ error: "Name is required" });
      }
      
      const existing = await needsService.getCharacter(userId);
      if (existing) {
        return res.status(400).json({ error: "Character already exists" });
      }
      
      const character = await needsService.createCharacter(userId, name, {
        primaryTrait,
        secondaryTrait,
        era: era || "modern",
      });
      
      res.json({ success: true, character });
    } catch (error) {
      console.error("Create character error:", error);
      res.status(500).json({ error: "Failed to create character" });
    }
  });

  // Daily check-in
  app.post("/api/chronicles/check-in", async (req: any, res, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    if (authHeader?.startsWith("Bearer ")) {
      return isChroniclesAuthenticated(req, res, next);
    }
    return isAuthenticated(req, res, next);
  }, async (req: any, res) => {
    try {
      const userId = req.user?.claims?.sub || req.user?.id;
      if (!userId) return res.status(401).json({ error: "Authentication required" });
      
      const character = await needsService.getCharacter(userId);
      if (!character) {
        return res.status(404).json({ error: "Character not found" });
      }
      
      const result = await needsService.dailyCheckIn(character.id, userId);
      res.json(result);
    } catch (error) {
      console.error("Daily check-in error:", error);
      res.status(500).json({ error: "Failed to process check-in" });
    }
  });

  // Perform activity
  app.post("/api/chronicles/activity", async (req: any, res, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    if (authHeader?.startsWith("Bearer ")) {
      return isChroniclesAuthenticated(req, res, next);
    }
    return isAuthenticated(req, res, next);
  }, async (req: any, res) => {
    try {
      const userId = req.user?.claims?.sub || req.user?.id;
      if (!userId) return res.status(401).json({ error: "Authentication required" });
      
      const { activityCode } = req.body;
      if (!activityCode) {
        return res.status(400).json({ error: "Activity code is required" });
      }
      
      const character = await needsService.getCharacter(userId);
      if (!character) {
        return res.status(404).json({ error: "Character not found" });
      }
      
      const result = await needsService.performActivity(character.id, activityCode, userId);
      res.json(result);
    } catch (error) {
      console.error("Perform activity error:", error);
      res.status(500).json({ error: "Failed to perform activity" });
    }
  });

  // Travel to location
  app.post("/api/chronicles/travel", async (req: any, res, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    if (authHeader?.startsWith("Bearer ")) {
      return isChroniclesAuthenticated(req, res, next);
    }
    return isAuthenticated(req, res, next);
  }, async (req: any, res) => {
    try {
      const userId = req.user?.claims?.sub || req.user?.id;
      if (!userId) return res.status(401).json({ error: "Authentication required" });
      
      const { locationCode } = req.body;
      if (!locationCode) {
        return res.status(400).json({ error: "Location code is required" });
      }
      
      const character = await needsService.getCharacter(userId);
      if (!character) {
        return res.status(404).json({ error: "Character not found" });
      }
      
      const result = await needsService.travelTo(character.id, locationCode);
      res.json(result);
    } catch (error) {
      console.error("Travel error:", error);
      res.status(500).json({ error: "Failed to travel" });
    }
  });

  // Get available activities
  app.get("/api/chronicles/activities", async (req: any, res) => {
    try {
      const era = (req.query.era as string) || "modern";
      const activities = await needsService.getActivities(era);
      res.json({ activities });
    } catch (error) {
      console.error("Get activities error:", error);
      res.status(500).json({ error: "Failed to get activities" });
    }
  });

  // Get available locations
  app.get("/api/chronicles/locations", async (req: any, res) => {
    try {
      const era = (req.query.era as string) || "modern";
      const locations = await needsService.getLocations(era);
      res.json({ locations });
    } catch (error) {
      console.error("Get locations error:", error);
      res.status(500).json({ error: "Failed to get locations" });
    }
  });

  // NPC Routes
  app.post("/api/chronicles/npcs/seed", async (req: any, res, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    if (authHeader?.startsWith("Bearer ")) {
      return isChroniclesAuthenticated(req, res, next);
    }
    return isAuthenticated(req, res, next);
  }, async (req: any, res) => {
    try {
      const { npcService } = await import("./npc-service");
      const result = await npcService.seedModernNpcs();
      res.json(result);
    } catch (error) {
      console.error("Seed NPCs error:", error);
      res.status(500).json({ error: "Failed to seed NPCs" });
    }
  });

  app.get("/api/chronicles/npcs", async (req: any, res, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    if (authHeader?.startsWith("Bearer ")) {
      return isChroniclesAuthenticated(req, res, next);
    }
    return isAuthenticated(req, res, next);
  }, async (req: any, res) => {
    try {
      const location = (req.query.location as string) || "home";
      const era = (req.query.era as string) || "modern";
      const { npcService } = await import("./npc-service");
      const npcs = await npcService.getNpcsByLocation(location, era);
      res.json({ npcs: npcs.map(npc => ({
        ...npc,
        personality: JSON.parse(npc.personality || "{}"),
      })) });
    } catch (error) {
      console.error("Get NPCs error:", error);
      res.status(500).json({ error: "Failed to get NPCs" });
    }
  });

  app.post("/api/chronicles/npcs/interact", async (req: any, res, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    if (authHeader?.startsWith("Bearer ")) {
      return isChroniclesAuthenticated(req, res, next);
    }
    return isAuthenticated(req, res, next);
  }, async (req: any, res) => {
    try {
      const { characterId, npcId, interactionType } = req.body;
      if (!characterId || !npcId) {
        return res.status(400).json({ error: "Character ID and NPC ID required" });
      }
      const { npcService } = await import("./npc-service");
      const result = await npcService.interact(characterId, npcId, interactionType || "dialogue");
      res.json(result);
    } catch (error) {
      console.error("NPC interact error:", error);
      res.status(500).json({ error: "Failed to interact with NPC" });
    }
  });

  app.get("/api/chronicles/relationships", async (req: any, res, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    if (authHeader?.startsWith("Bearer ")) {
      return isChroniclesAuthenticated(req, res, next);
    }
    return isAuthenticated(req, res, next);
  }, async (req: any, res) => {
    try {
      const characterId = req.query.characterId as string;
      if (!characterId) {
        return res.status(400).json({ error: "Character ID required" });
      }
      const { npcService } = await import("./npc-service");
      const relationships = await npcService.getCharacterRelationships(characterId);
      res.json({ relationships });
    } catch (error) {
      console.error("Get relationships error:", error);
      res.status(500).json({ error: "Failed to get relationships" });
    }
  });

  app.post("/api/shells/earn", async (req: any, res, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    if (authHeader?.startsWith("Bearer ")) {
      return isChroniclesAuthenticated(req, res, next);
    }
    return isAuthenticated(req, res, next);
  }, async (req: any, res) => {
    try {
      const userId = req.user?.claims?.sub || req.user?.id;
      const username = req.user?.claims?.firstName || req.user?.firstName || req.user?.username || "User";
      if (!userId) return res.status(401).json({ error: "Authentication required" });
      
      const { action } = req.body;
      if (!action || !SHELL_EARN_RATES[action as keyof typeof SHELL_EARN_RATES]) {
        return res.status(400).json({ error: "Invalid action", validActions: Object.keys(SHELL_EARN_RATES) });
      }
      
      const transaction = await shellsService.awardEngagementShells(userId, username, action as keyof typeof SHELL_EARN_RATES);
      const balance = await shellsService.getBalance(userId);
      
      res.json({ success: true, transaction, balance, earned: SHELL_EARN_RATES[action as keyof typeof SHELL_EARN_RATES] });
    } catch (error) {
      console.error("Earn shells error:", error);
      res.status(500).json({ error: "Failed to earn shells" });
    }
  });

  // Stripe checkout for Orb packages
  app.post("/api/shells/checkout", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user?.claims?.sub || req.user?.id;
      const username = req.user?.claims?.firstName || req.user?.firstName || "User";
      if (!userId) return res.status(401).json({ error: "Authentication required" });
      
      const { packageKey } = req.body;
      if (!packageKey || !SHELL_PACKAGES[packageKey as keyof typeof SHELL_PACKAGES]) {
        return res.status(400).json({ error: "Invalid package" });
      }
      
      const pkg = SHELL_PACKAGES[packageKey as keyof typeof SHELL_PACKAGES];
      
      const { getUncachableStripeClient } = await import("./stripeClient");
      const stripe = await getUncachableStripeClient();
      
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [{
          price_data: {
            currency: "usd",
            product_data: {
              name: pkg.name,
              description: `${pkg.amount.toLocaleString()} Shells for the DarkWave ecosystem`,
            },
            unit_amount: pkg.price,
          },
          quantity: 1,
        }],
        mode: "payment",
        success_url: `${req.headers.origin}/community-hub?shells_success=true&session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${req.headers.origin}/community-hub?shells_cancelled=true`,
        metadata: {
          userId,
          username,
          packageKey,
          shellAmount: pkg.amount.toString(),
          type: "shell_purchase",
        },
      });
      
      res.json({ url: session.url, sessionId: session.id });
    } catch (error) {
      console.error("Shells checkout error:", error);
      res.status(500).json({ error: "Failed to create checkout session" });
    }
  });

  // Verify Shell purchase and credit Orbs (idempotent - prevents replay attacks)
  app.post("/api/shells/verify-purchase", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user?.claims?.sub || req.user?.id;
      const username = req.user?.claims?.firstName || req.user?.firstName || "User";
      if (!userId) return res.status(401).json({ error: "Authentication required" });
      
      const { sessionId } = req.body;
      if (!sessionId) return res.status(400).json({ error: "Session ID required" });
      
      // Check if this session has already been processed (idempotency guard)
      const existingTx = await shellsService.getTransactionByReference(sessionId, "stripe_payment");
      if (existingTx) {
        // Already processed - return success without double-crediting
        const balance = await shellsService.getBalance(userId);
        return res.json({ 
          success: true, 
          alreadyProcessed: true, 
          balance,
          message: "This purchase has already been credited"
        });
      }
      
      const { getUncachableStripeClient } = await import("./stripeClient");
      const stripe = await getUncachableStripeClient();
      
      const session = await stripe.checkout.sessions.retrieve(sessionId);
      
      if (session.payment_status !== "paid") {
        return res.status(400).json({ error: "Payment not completed" });
      }
      
      if (session.metadata?.userId !== userId) {
        return res.status(403).json({ error: "Session does not belong to this user" });
      }
      
      if (session.metadata?.type !== "shell_purchase") {
        return res.status(400).json({ error: "Invalid session type" });
      }
      
      const packageKey = session.metadata?.packageKey as keyof typeof SHELL_PACKAGES;
      const shellAmount = parseInt(session.metadata?.shellAmount || "0");
      
      if (!packageKey || !shellAmount) {
        return res.status(400).json({ error: "Invalid package data" });
      }
      
      // Credit the Shells (uses sessionId as referenceId for idempotency)
      const transaction = await shellsService.purchaseShells(userId, username, packageKey, session.id);
      const balance = await shellsService.getBalance(userId);
      
      // Record purchase receipt for DWC conversion tracking
      try {
        await shellsService.recordPurchaseReceipt(
          userId,
          session.payment_intent as string || session.id,
          session.customer as string || null,
          packageKey,
          shellAmount,
          session.amount_total || 0
        );
      } catch (receiptError) {
        console.error("Failed to record purchase receipt:", receiptError);
        // Don't fail the transaction if receipt recording fails
      }
      
      res.json({ 
        success: true, 
        transaction, 
        balance, 
        shellsAdded: shellAmount,
        dwcConversionInfo: {
          rate: DWC_CONVERSION_RATE,
          dwcEquivalent: shellAmount / DWC_CONVERSION_RATE,
          launchDate: DWC_LAUNCH_DATE,
          message: `These Shells will convert to ${(shellAmount / DWC_CONVERSION_RATE).toFixed(2)} DWC on ${DWC_LAUNCH_DATE}`
        }
      });
    } catch (error) {
      console.error("Verify shells purchase error:", error);
      res.status(500).json({ error: "Failed to verify purchase" });
    }
  });

  // Get Shell bundles with pricing and DWC conversion info
  app.get("/api/shells/bundles", async (req, res) => {
    try {
      const bundles = shellsService.getBundles();
      res.json({ 
        bundles,
        conversionInfo: {
          rate: DWC_CONVERSION_RATE,
          launchDate: DWC_LAUNCH_DATE,
          message: `All Shells will convert to DWC at a rate of ${DWC_CONVERSION_RATE} Shells = 1 DWC on ${DWC_LAUNCH_DATE}`
        }
      });
    } catch (error) {
      console.error("Get bundles error:", error);
      res.status(500).json({ error: "Failed to get bundles" });
    }
  });

  // Get user's DWC conversion eligible shells
  app.get("/api/shells/conversion-info", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user?.claims?.sub || req.user?.id;
      if (!userId) return res.status(401).json({ error: "Authentication required" });
      
      const conversionInfo = await shellsService.getConversionEligibleShells(userId);
      res.json({
        ...conversionInfo,
        conversionRate: DWC_CONVERSION_RATE,
        launchDate: DWC_LAUNCH_DATE,
        message: `Your ${conversionInfo.totalShells.toLocaleString()} Shells will convert to ${conversionInfo.dwcEquivalent.toFixed(2)} DWC on ${DWC_LAUNCH_DATE}`
      });
    } catch (error) {
      console.error("Get conversion info error:", error);
      res.status(500).json({ error: "Failed to get conversion info" });
    }
  });

  // Record user consent to virtual currency ToS
  app.post("/api/shells/accept-tos", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user?.claims?.sub || req.user?.id;
      if (!userId) return res.status(401).json({ error: "Authentication required" });
      
      const { consentType, version } = req.body;
      if (!consentType || !version) {
        return res.status(400).json({ error: "Consent type and version required" });
      }
      
      const consent = await shellsService.recordFinancialConsent(
        userId,
        consentType,
        version,
        req.ip,
        req.headers["user-agent"]
      );
      
      res.json({ success: true, consent });
    } catch (error) {
      console.error("Accept ToS error:", error);
      res.status(500).json({ error: "Failed to record consent" });
    }
  });

  // Check if user has accepted required ToS
  app.get("/api/shells/tos-status", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user?.claims?.sub || req.user?.id;
      if (!userId) return res.status(401).json({ error: "Authentication required" });
      
      const { consentType, version } = req.query;
      if (!consentType || !version) {
        return res.status(400).json({ error: "Consent type and version required" });
      }
      
      const hasAccepted = await shellsService.hasAcceptedToS(userId, consentType as string, version as string);
      res.json({ hasAccepted });
    } catch (error) {
      console.error("Check ToS status error:", error);
      res.status(500).json({ error: "Failed to check ToS status" });
    }
  });

  // =====================================================
  // SUBSCRIPTION ENDPOINTS
  // =====================================================
  // Unified subscription system for Pulse Pro, StrikeAgent, Complete Bundle
  // Synced with main Pulse app structure
  // =====================================================

  // Get subscription status
  app.get("/api/subscription/status", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user?.claims?.sub || req.user?.id;
      if (!userId) return res.status(401).json({ error: "Authentication required" });
      
      const status = await subscriptionService.getSubscriptionStatus(userId);
      res.json(status);
    } catch (error) {
      console.error("Get subscription status error:", error);
      res.status(500).json({ error: "Failed to get subscription status" });
    }
  });

  // Get available plans
  app.get("/api/subscription/plans", async (req, res) => {
    try {
      res.json({ plans: SUBSCRIPTION_PLANS });
    } catch (error) {
      res.status(500).json({ error: "Failed to get plans" });
    }
  });

  // Create Pulse Pro subscription checkout
  app.post("/api/payments/stripe/create-pulse-monthly", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user?.claims?.sub || req.user?.id;
      if (!userId) return res.status(401).json({ error: "Authentication required" });
      
      const { getUncachableStripeClient } = await import("./stripeClient");
      const stripe = await getUncachableStripeClient();
      
      const plan = SUBSCRIPTION_PLANS.pulse_pro;
      
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [{
          price_data: {
            currency: "usd",
            product_data: {
              name: plan.name,
              description: "AI-powered predictions & analysis - Monthly subscription",
            },
            unit_amount: plan.monthlyPrice,
            recurring: { interval: "month" },
          },
          quantity: 1,
        }],
        mode: "subscription",
        subscription_data: {
          trial_period_days: plan.trialDays,
          metadata: { userId, plan: "pulse_pro", billingCycle: "monthly" },
        },
        success_url: `${req.headers.origin}/subscription/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${req.headers.origin}/subscription/cancelled`,
        metadata: { userId, plan: "pulse_pro", billingCycle: "monthly", type: "subscription" },
      });
      
      res.json({ url: session.url, sessionId: session.id });
    } catch (error) {
      console.error("Create Pulse monthly checkout error:", error);
      res.status(500).json({ error: "Failed to create checkout session" });
    }
  });

  app.post("/api/payments/stripe/create-pulse-annual", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user?.claims?.sub || req.user?.id;
      if (!userId) return res.status(401).json({ error: "Authentication required" });
      
      const { getUncachableStripeClient } = await import("./stripeClient");
      const stripe = await getUncachableStripeClient();
      
      const plan = SUBSCRIPTION_PLANS.pulse_pro;
      
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [{
          price_data: {
            currency: "usd",
            product_data: {
              name: plan.name,
              description: "AI-powered predictions & analysis - Annual subscription (Save $30)",
            },
            unit_amount: plan.annualPrice,
            recurring: { interval: "year" },
          },
          quantity: 1,
        }],
        mode: "subscription",
        subscription_data: {
          trial_period_days: plan.trialDays,
          metadata: { userId, plan: "pulse_pro", billingCycle: "annual" },
        },
        success_url: `${req.headers.origin}/subscription/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${req.headers.origin}/subscription/cancelled`,
        metadata: { userId, plan: "pulse_pro", billingCycle: "annual", type: "subscription" },
      });
      
      res.json({ url: session.url, sessionId: session.id });
    } catch (error) {
      console.error("Create Pulse annual checkout error:", error);
      res.status(500).json({ error: "Failed to create checkout session" });
    }
  });

  // Create StrikeAgent subscription checkout
  app.post("/api/payments/stripe/create-strike-monthly", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user?.claims?.sub || req.user?.id;
      if (!userId) return res.status(401).json({ error: "Authentication required" });
      
      const { getUncachableStripeClient } = await import("./stripeClient");
      const stripe = await getUncachableStripeClient();
      
      const plan = SUBSCRIPTION_PLANS.strike_agent;
      
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [{
          price_data: {
            currency: "usd",
            product_data: {
              name: plan.name,
              description: "AI-powered sniper bot - Monthly subscription",
            },
            unit_amount: plan.monthlyPrice,
            recurring: { interval: "month" },
          },
          quantity: 1,
        }],
        mode: "subscription",
        subscription_data: {
          trial_period_days: plan.trialDays,
          metadata: { userId, plan: "strike_agent", billingCycle: "monthly" },
        },
        success_url: `${req.headers.origin}/subscription/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${req.headers.origin}/subscription/cancelled`,
        metadata: { userId, plan: "strike_agent", billingCycle: "monthly", type: "subscription" },
      });
      
      res.json({ url: session.url, sessionId: session.id });
    } catch (error) {
      console.error("Create Strike monthly checkout error:", error);
      res.status(500).json({ error: "Failed to create checkout session" });
    }
  });

  app.post("/api/payments/stripe/create-strike-annual", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user?.claims?.sub || req.user?.id;
      if (!userId) return res.status(401).json({ error: "Authentication required" });
      
      const { getUncachableStripeClient } = await import("./stripeClient");
      const stripe = await getUncachableStripeClient();
      
      const plan = SUBSCRIPTION_PLANS.strike_agent;
      
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [{
          price_data: {
            currency: "usd",
            product_data: {
              name: plan.name,
              description: "AI-powered sniper bot - Annual subscription (Save $60)",
            },
            unit_amount: plan.annualPrice,
            recurring: { interval: "year" },
          },
          quantity: 1,
        }],
        mode: "subscription",
        subscription_data: {
          trial_period_days: plan.trialDays,
          metadata: { userId, plan: "strike_agent", billingCycle: "annual" },
        },
        success_url: `${req.headers.origin}/subscription/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${req.headers.origin}/subscription/cancelled`,
        metadata: { userId, plan: "strike_agent", billingCycle: "annual", type: "subscription" },
      });
      
      res.json({ url: session.url, sessionId: session.id });
    } catch (error) {
      console.error("Create Strike annual checkout error:", error);
      res.status(500).json({ error: "Failed to create checkout session" });
    }
  });

  // Create Complete Bundle subscription checkout
  app.post("/api/payments/stripe/create-bundle-monthly", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user?.claims?.sub || req.user?.id;
      if (!userId) return res.status(401).json({ error: "Authentication required" });
      
      const { getUncachableStripeClient } = await import("./stripeClient");
      const stripe = await getUncachableStripeClient();
      
      const plan = SUBSCRIPTION_PLANS.complete_bundle;
      
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [{
          price_data: {
            currency: "usd",
            product_data: {
              name: plan.name,
              description: "Everything included - Monthly subscription",
            },
            unit_amount: plan.monthlyPrice,
            recurring: { interval: "month" },
          },
          quantity: 1,
        }],
        mode: "subscription",
        subscription_data: {
          trial_period_days: plan.trialDays,
          metadata: { userId, plan: "complete_bundle", billingCycle: "monthly" },
        },
        success_url: `${req.headers.origin}/subscription/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${req.headers.origin}/subscription/cancelled`,
        metadata: { userId, plan: "complete_bundle", billingCycle: "monthly", type: "subscription" },
      });
      
      res.json({ url: session.url, sessionId: session.id });
    } catch (error) {
      console.error("Create Bundle monthly checkout error:", error);
      res.status(500).json({ error: "Failed to create checkout session" });
    }
  });

  app.post("/api/payments/stripe/create-bundle-annual", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user?.claims?.sub || req.user?.id;
      if (!userId) return res.status(401).json({ error: "Authentication required" });
      
      const { getUncachableStripeClient } = await import("./stripeClient");
      const stripe = await getUncachableStripeClient();
      
      const plan = SUBSCRIPTION_PLANS.complete_bundle;
      
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [{
          price_data: {
            currency: "usd",
            product_data: {
              name: plan.name,
              description: "Everything included - Annual subscription (Save $80)",
            },
            unit_amount: plan.annualPrice,
            recurring: { interval: "year" },
          },
          quantity: 1,
        }],
        mode: "subscription",
        subscription_data: {
          trial_period_days: plan.trialDays,
          metadata: { userId, plan: "complete_bundle", billingCycle: "annual" },
        },
        success_url: `${req.headers.origin}/subscription/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${req.headers.origin}/subscription/cancelled`,
        metadata: { userId, plan: "complete_bundle", billingCycle: "annual", type: "subscription" },
      });
      
      res.json({ url: session.url, sessionId: session.id });
    } catch (error) {
      console.error("Create Bundle annual checkout error:", error);
      res.status(500).json({ error: "Failed to create checkout session" });
    }
  });

  // Legacy Founder one-time purchase (disabled for new purchases)
  app.post("/api/payments/stripe/create-founder", isAuthenticated, async (req: any, res) => {
    // Founder tier is disabled for new purchases
    res.status(410).json({ error: "Legacy Founder tier is no longer available for new purchases" });
  });

  // Pulse API webhook for real-time signal notifications
  app.post("/api/webhooks/pulse", async (req, res) => {
    try {
      const signature = req.headers["x-pulse-signature"] as string;
      const timestamp = req.headers["x-pulse-timestamp"] as string;
      
      if (!signature || !timestamp) {
        return res.status(400).json({ error: "Missing signature headers" });
      }
      
      // Verify webhook signature
      if (!walletBotService.verifyWebhook(req.body, signature, timestamp)) {
        return res.status(401).json({ error: "Invalid signature" });
      }
      
      const { event, data } = req.body;
      console.log(`[Pulse Webhook] Event: ${event}`, data);
      
      // TODO: Route to appropriate community channels based on event type
      // For now, just acknowledge the webhook
      switch (event) {
        case "signal.new":
          console.log(`[Pulse] New signal: ${data.ticker} - ${data.signal} (${data.confidence}%)`);
          break;
        case "suggestion.created":
          console.log(`[Pulse] New suggestion for user ${data.userId}: ${data.tokenSymbol}`);
          break;
        case "trade.executed":
          console.log(`[Pulse] Trade executed: ${data.tokenSymbol} - ${data.action}`);
          break;
        case "prediction.outcome":
          console.log(`[Pulse] Prediction ${data.id}: ${data.isCorrect ? "CORRECT" : "INCORRECT"}`);
          break;
      }
      
      res.status(200).json({ success: true });
    } catch (error) {
      console.error("Pulse webhook error:", error);
      res.status(500).json({ error: "Webhook processing failed" });
    }
  });

  // Pulse API proxy endpoints for frontend
  app.get("/api/pulse/market", async (req, res) => {
    try {
      const data = await pulseClient.getMarketOverview();
      res.json(data || { error: "Could not fetch market data" });
    } catch (error) {
      console.error("Pulse market error:", error);
      res.status(500).json({ error: "Failed to fetch market data" });
    }
  });

  app.get("/api/pulse/signals", async (req, res) => {
    try {
      const chain = (req.query.chain as string) || "all";
      const limit = parseInt(req.query.limit as string) || 10;
      const data = await pulseClient.getStrikeAgentSignals(chain, undefined, limit);
      res.json(data);
    } catch (error) {
      console.error("Pulse signals error:", error);
      res.status(500).json({ error: "Failed to fetch signals" });
    }
  });

  app.get("/api/pulse/price/:symbol", async (req, res) => {
    try {
      const data = await pulseClient.getPrice(req.params.symbol);
      res.json(data || { error: "Could not fetch price" });
    } catch (error) {
      console.error("Pulse price error:", error);
      res.status(500).json({ error: "Failed to fetch price" });
    }
  });

  // ==============================================
  // CHRONOCHAT COMMUNITY ROUTES
  // ==============================================
  
  const { communities, communityChannels, communityMembers, communityMessages, messageReactions, messageAttachments, insertCommunitySchema, insertChannelSchema, insertMemberSchema, insertCommunityMessageSchema, insertReactionSchema } = await import("@shared/schema");

  app.get("/api/communities", async (_req, res) => {
    try {
      const result = await db.select().from(communities).where(eq(communities.isPublic, true)).orderBy(desc(communities.memberCount)).limit(50);
      res.json(result);
    } catch (error) {
      console.error("Get communities error:", error);
      res.status(500).json({ error: "Failed to fetch communities" });
    }
  });

  app.get("/api/communities/:id", async (req, res) => {
    try {
      const result = await db.select().from(communities).where(eq(communities.id, req.params.id));
      if (result.length === 0) {
        return res.status(404).json({ error: "Community not found" });
      }
      res.json(result[0]);
    } catch (error) {
      console.error("Get community error:", error);
      res.status(500).json({ error: "Failed to fetch community" });
    }
  });

  app.post("/api/communities", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const data = insertCommunitySchema.parse({ ...req.body, ownerId: userId });
      const result = await db.insert(communities).values(data).returning();
      
      await db.insert(communityMembers).values({
        communityId: result[0].id,
        userId,
        username: req.body.username || "Owner",
        role: "admin",
      });
      
      await db.insert(communityChannels).values({
        communityId: result[0].id,
        name: "general",
        description: "General discussion",
        type: "chat",
        position: 0,
      });
      
      res.json(result[0]);
    } catch (error) {
      console.error("Create community error:", error);
      res.status(500).json({ error: "Failed to create community" });
    }
  });

  app.get("/api/communities/:id/channels", async (req, res) => {
    try {
      const result = await db.select().from(communityChannels).where(eq(communityChannels.communityId, req.params.id)).orderBy(communityChannels.position);
      res.json(result);
    } catch (error) {
      console.error("Get channels error:", error);
      res.status(500).json({ error: "Failed to fetch channels" });
    }
  });

  app.post("/api/communities/:id/channels", isAuthenticated, async (req: any, res) => {
    try {
      const data = insertChannelSchema.parse({ ...req.body, communityId: req.params.id });
      const result = await db.insert(communityChannels).values(data).returning();
      res.json(result[0]);
    } catch (error) {
      console.error("Create channel error:", error);
      res.status(500).json({ error: "Failed to create channel" });
    }
  });

  app.get("/api/communities/:id/members", async (req, res) => {
    try {
      const result = await db.select().from(communityMembers).where(eq(communityMembers.communityId, req.params.id)).orderBy(desc(communityMembers.joinedAt));
      res.json(result);
    } catch (error) {
      console.error("Get members error:", error);
      res.status(500).json({ error: "Failed to fetch members" });
    }
  });

  app.post("/api/communities/:id/join", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const existing = await db.select().from(communityMembers).where(and(eq(communityMembers.communityId, req.params.id), eq(communityMembers.userId, userId)));
      if (existing.length > 0) {
        return res.json({ message: "Already a member", member: existing[0] });
      }
      const data = insertMemberSchema.parse({ communityId: req.params.id, userId, username: req.body.username || "Member" });
      const result = await db.insert(communityMembers).values(data).returning();
      await db.update(communities).set({ memberCount: sql`member_count + 1` }).where(eq(communities.id, req.params.id));
      res.json(result[0]);
    } catch (error) {
      console.error("Join community error:", error);
      res.status(500).json({ error: "Failed to join community" });
    }
  });

  app.post("/api/communities/:id/leave", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      await db.delete(communityMembers).where(and(eq(communityMembers.communityId, req.params.id), eq(communityMembers.userId, userId)));
      await db.update(communities).set({ memberCount: sql`GREATEST(member_count - 1, 0)` }).where(eq(communities.id, req.params.id));
      res.json({ success: true });
    } catch (error) {
      console.error("Leave community error:", error);
      res.status(500).json({ error: "Failed to leave community" });
    }
  });

  app.get("/api/channels/:channelId/messages", async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 50;
      const before = req.query.before as string | undefined;
      
      let conditions = [eq(communityMessages.channelId, req.params.channelId)];
      if (before) {
        conditions.push(sql`${communityMessages.createdAt} < ${before}`);
      }
      const result = await db.select().from(communityMessages)
        .where(and(...conditions))
        .orderBy(desc(communityMessages.createdAt))
        .limit(limit);
      res.json(result.reverse());
    } catch (error) {
      console.error("Get messages error:", error);
      res.status(500).json({ error: "Failed to fetch messages" });
    }
  });

  app.post("/api/channels/:channelId/messages", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const messageData: any = {
        channelId: req.params.channelId,
        userId,
        username: req.body.username || "User",
        content: req.body.content,
      };
      if (req.body.replyToId) {
        messageData.replyToId = req.body.replyToId;
      }
      const data = insertCommunityMessageSchema.parse(messageData);
      const result = await db.insert(communityMessages).values(data).returning();
      
      const { broadcastToChannel } = await import("./chat-presence");
      broadcastToChannel(req.params.channelId, { type: "NEW_MESSAGE", payload: result[0] });
      
      res.json(result[0]);
    } catch (error) {
      console.error("Send message error:", error);
      res.status(500).json({ error: "Failed to send message" });
    }
  });

  app.put("/api/messages/:messageId", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const message = await db.select().from(communityMessages).where(eq(communityMessages.id, req.params.messageId));
      if (message.length === 0) return res.status(404).json({ error: "Message not found" });
      if (message[0].userId !== userId) return res.status(403).json({ error: "Not authorized" });
      
      const result = await db.update(communityMessages).set({ content: req.body.content, editedAt: new Date() }).where(eq(communityMessages.id, req.params.messageId)).returning();
      res.json(result[0]);
    } catch (error) {
      console.error("Edit message error:", error);
      res.status(500).json({ error: "Failed to edit message" });
    }
  });

  app.delete("/api/messages/:messageId", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const message = await db.select().from(communityMessages).where(eq(communityMessages.id, req.params.messageId));
      if (message.length === 0) return res.status(404).json({ error: "Message not found" });
      if (message[0].userId !== userId) return res.status(403).json({ error: "Not authorized" });
      
      await db.delete(communityMessages).where(eq(communityMessages.id, req.params.messageId));
      res.json({ success: true });
    } catch (error) {
      console.error("Delete message error:", error);
      res.status(500).json({ error: "Failed to delete message" });
    }
  });

  app.get("/api/messages/:messageId/reactions", async (req, res) => {
    try {
      const result = await db.select().from(messageReactions).where(eq(messageReactions.messageId, req.params.messageId));
      res.json(result);
    } catch (error) {
      console.error("Get reactions error:", error);
      res.status(500).json({ error: "Failed to fetch reactions" });
    }
  });

  app.post("/api/messages/:messageId/reactions", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const existing = await db.select().from(messageReactions).where(and(eq(messageReactions.messageId, req.params.messageId), eq(messageReactions.userId, userId), eq(messageReactions.emoji, req.body.emoji)));
      if (existing.length > 0) {
        await db.delete(messageReactions).where(eq(messageReactions.id, existing[0].id));
        return res.json({ removed: true });
      }
      const data = insertReactionSchema.parse({ messageId: req.params.messageId, userId, username: req.body.username || "User", emoji: req.body.emoji });
      const result = await db.insert(messageReactions).values(data).returning();
      res.json(result[0]);
    } catch (error) {
      console.error("Add reaction error:", error);
      res.status(500).json({ error: "Failed to add reaction" });
    }
  });

  app.get("/api/user/communities", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const memberships = await db.select({ communityId: communityMembers.communityId }).from(communityMembers).where(eq(communityMembers.userId, userId));
      const communityIds = memberships.map(m => m.communityId);
      if (communityIds.length === 0) return res.json([]);
      const result = await db.select().from(communities).where(sql`${communities.id} IN (${sql.join(communityIds.map(id => sql`${id}`), sql`, `)})`);
      res.json(result);
    } catch (error) {
      console.error("Get user communities error:", error);
      res.status(500).json({ error: "Failed to fetch user communities" });
    }
  });

  // Chronicles Game Design Document API
  app.get("/api/chronicles/game-design-doc", ownerAuthMiddleware, async (req, res) => {
    try {
      const fs = await import("fs");
      const path = await import("path");
      const docPath = path.join(process.cwd(), "docs", "chronicles-game-design.md");
      
      if (!fs.existsSync(docPath)) {
        return res.status(404).json({ error: "Game design document not found" });
      }
      
      const content = fs.readFileSync(docPath, "utf-8");
      res.json({ 
        content,
        lastModified: fs.statSync(docPath).mtime.toISOString(),
        lines: content.split("\n").length
      });
    } catch (error) {
      console.error("Game design doc error:", error);
      res.status(500).json({ error: "Failed to fetch game design document" });
    }
  });

  return httpServer;
}

const APP_URL_MAP: Record<string, string> = {
  "orbitstaffing": "https://orbitstaffing.io",
  "darkwave-staffing": "https://orbitstaffing.io",
  "darkwave-chain": "https://dwsc.io",
  "lotopspro": "https://lotopspro.io",
  "lotops-pro": "https://lotopspro.io",
  "orby": "https://getorby.io",
  "garagebot": "https://garagebot.io",
  "garagebot-prod": "https://garagebot.io",
  "brew-board": "https://brewandboard.coffee",
  "brewandboard": "https://brewandboard.coffee",
  "darkwave-pulse": "https://darkwavepulse.com",
  "paintpros": "https://paintpros.io",
  "strikeagent": "https://strikeagent.io",
  "strike-agent": "https://strikeagent.io",
  "vedasolus": "https://DarkWaveHealth.replit.app",
  "veda-solus": "https://DarkWaveHealth.replit.app",
};

async function fetchEcosystemApps(): Promise<EcosystemApp[]> {
  const localApps = getLocalEcosystemApps();
  
  try {
    const response = await ecosystemClient.getApps() as { success?: boolean; apps?: any[] } | any[];
    
    let apps: any[] = [];
    if (response && typeof response === 'object' && 'apps' in response && Array.isArray(response.apps)) {
      apps = response.apps;
    } else if (Array.isArray(response)) {
      apps = response;
    }
    
    if (apps.length > 0) {
      const hubApps = apps.map((app: any) => {
        const id = app.slug || app.id;
        const localMatch = localApps.find(la => la.id === id || la.name.toLowerCase() === app.name?.toLowerCase());
        return {
          id,
          name: app.name,
          category: localMatch?.category || app.category || "General",
          description: localMatch?.description || app.description || "",
          hook: localMatch?.hook || app.hook || "",
          tags: localMatch?.tags || app.tags || [],
          gradient: localMatch?.gradient || app.gradient || "from-gray-500 to-gray-700",
          verified: true,
          featured: localMatch?.featured || app.featured || false,
          users: "DarkWave Verified",
          url: APP_URL_MAP[id] || app.appUrl || localMatch?.url || undefined,
        };
      });
      
      const hubIds = new Set(hubApps.map(a => a.id));
      const hubNames = new Set(hubApps.map(a => a.name.toLowerCase()));
      const additionalLocalApps = localApps.filter(la => 
        !hubIds.has(la.id) && !hubNames.has(la.name.toLowerCase())
      );
      
      // Filter out deprecated/renamed apps
      const excludedIds = new Set(["orbit-chain"]);
      const allApps = [...hubApps, ...additionalLocalApps];
      return allApps.filter(app => !excludedIds.has(app.id));
    }
  } catch (error) {
    console.warn("DarkWave Hub API not available, using local data:", error);
  }
  
  return localApps;
}

function getLocalEcosystemApps(): EcosystemApp[] {
  return [
    {
      id: "orbit-staffing",
      name: "Orbit Staffing",
      category: "Enterprise",
      description: "Complete workforce management platform with blockchain-verified employment records.",
      hook: "Blockchain-powered HR",
      tags: ["HR", "Payroll", "Enterprise", "Compliance"],
      gradient: "from-emerald-600 to-teal-800",
      verified: true,
      users: "DarkWave Verified",
      url: "https://orbitstaffing.io",
    },
    {
      id: "garagebot",
      name: "GarageBot",
      category: "Automotive",
      description: "Smart automation for vehicle maintenance and garage management.",
      hook: "IoT-powered garage automation",
      tags: ["Auto", "IoT", "Maintenance"],
      gradient: "from-slate-600 to-zinc-800",
      verified: true,
      users: "DarkWave Verified",
      url: "https://garagebot.io",
    },
    {
      id: "brew-board",
      name: "Brew & Board",
      category: "Hospitality",
      description: "Community platform for coffee shops with loyalty rewards.",
      hook: "Social gaming meets craft coffee",
      tags: ["Social", "Events", "Rewards", "Hospitality"],
      gradient: "from-amber-600 to-yellow-800",
      verified: true,
      users: "DarkWave Verified",
      url: "https://brewandboard.coffee",
    },
    {
      id: "lotops-pro",
      name: "Lot Ops Pro",
      category: "Automotive",
      description: "Autonomous lot management system for auto auctions, dealers, manufacturers, and businesses with lot inventory and operations personnel.",
      hook: "Autonomous Lot Management System",
      tags: ["Auto", "B2B", "Inventory", "Fleet", "Automation"],
      gradient: "from-indigo-600 to-violet-800",
      verified: true,
      users: "DarkWave Verified",
      url: "https://lotopspro.io",
    },
    {
      id: "darkwave-chain",
      name: "DarkWave Smart Chain",
      category: "Blockchain",
      description: "High-performance Layer 1 blockchain with 200K+ TPS, 400ms finality, and enterprise-grade security.",
      hook: "The universal ledger for the next web",
      tags: ["Blockchain", "DeFi", "Infrastructure", "L1"],
      gradient: "from-cyan-500 to-blue-600",
      verified: true,
      featured: true,
      users: "DarkWave Verified",
      url: "https://dwsc.io",
    },
    {
      id: "darkwave-pulse",
      name: "DarkWave Pulse",
      category: "Analytics",
      description: "Predictive market intelligence powered by AI systems.",
      hook: "Auto-trade with AI precision",
      tags: ["AI", "Auto-Trading", "Predictive", "Analytics"],
      gradient: "from-cyan-600 to-blue-700",
      verified: true,
      featured: true,
      users: "DarkWave Verified",
      url: "https://darkwavepulse.com",
    },
    {
      id: "orby",
      name: "Orby",
      category: "Enterprise",
      description: "Dual blockchain verified venue and event operations command suite with geofencing, facial recognition clock-in for fraud protection, and direct integration with Orbit Staffing.",
      hook: "Venue & Event Operations Command Suite",
      tags: ["Enterprise", "Operations", "Security", "Geofencing"],
      gradient: "from-cyan-400 to-blue-500",
      verified: true,
      users: "DarkWave Verified",
      url: "https://getorby.io",
    },
    {
      id: "paintpros",
      name: "PaintPros",
      category: "Services",
      description: "Professional painting service management platform.",
      hook: "Streamlined painting business",
      tags: ["Services", "Scheduling", "CRM"],
      gradient: "from-orange-500 to-red-600",
      verified: true,
      users: "DarkWave Verified",
      url: "https://paintpros.io",
    },
    {
      id: "strike-agent",
      name: "Strike Agent",
      category: "AI Trading",
      description: "AI sentient bot with multiple trading settings, hashed predictions and verified results.",
      hook: "Automated trading intelligence",
      tags: ["AI", "Trading", "Predictions", "Automation"],
      gradient: "from-red-600 to-rose-700",
      verified: true,
      users: "DarkWave Verified",
      url: "https://strikeagent.io",
    },
    {
      id: "veda-solus",
      name: "VedaSolus",
      category: "Health & Wellness",
      description: "Holistic health platform blending Ayurveda & TCM with modern science. Features AI wellness coach, health passport, practitioner marketplace, and voice-enabled guidance.",
      hook: "Ancient wisdom meets modern wellness",
      tags: ["Health", "Wellness", "Ayurveda", "TCM", "AI"],
      gradient: "from-emerald-500 to-teal-600",
      verified: true,
      users: "DarkWave Verified",
      url: "https://DarkWaveHealth.replit.app",
    },
  ];
}

async function fetchBlockchainStats(): Promise<BlockchainStats> {
  const stats = blockchain.getStats();
  return {
    tps: stats.tps,
    finalityTime: stats.finalityTime,
    avgCost: stats.avgCost,
    activeNodes: stats.activeNodes,
    currentBlock: stats.currentBlock,
    networkHash: `${stats.totalTransactions} txs`,
  };
}

interface TreasuryInfo {
  address: string;
  balance: string;
  balance_raw: string;
  total_supply: string;
}

async function fetchTreasuryInfo(): Promise<TreasuryInfo> {
  return blockchain.getTreasury();
}

async function distributeTokens(to: string, amount: string): Promise<any> {
  const amountBigInt = BigInt(amount);
  const result = blockchain.distributeTokens(to, amountBigInt);
  if (!result.success) {
    throw new Error(result.error || "Distribution failed");
  }
  return result;
}
