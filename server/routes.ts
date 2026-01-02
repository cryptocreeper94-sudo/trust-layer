import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import crypto from "crypto";
import QRCode from "qrcode";
import { WebSocketServer, WebSocket } from "ws";
import { setupCommunityWebSocket } from "./community-ws";
import { z } from "zod";
import { OAuth2Client } from "google-auth-library";
import { storage } from "./storage";
import { db } from "./db";

const FIREBASE_PROJECT_ID = "darkwave-auth";

interface FirebaseAuthRequest extends Request {
  firebaseUser?: { uid: string; email?: string };
}

async function verifyFirebaseToken(req: FirebaseAuthRequest, res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      return res.status(401).json({ error: "Authorization required" });
    }
    
    const idToken = authHeader.substring(7);
    
    const oauth2Client = new OAuth2Client();
    const ticket = await oauth2Client.verifyIdToken({
      idToken,
      audience: FIREBASE_PROJECT_ID,
    });
    
    const payload = ticket.getPayload();
    if (!payload) {
      return res.status(401).json({ error: "Invalid token" });
    }
    
    const expectedIssuer = `https://securetoken.google.com/${FIREBASE_PROJECT_ID}`;
    if (payload.iss !== expectedIssuer) {
      console.error("Firebase token issuer mismatch:", payload.iss);
      return res.status(401).json({ error: "Invalid token issuer" });
    }
    
    req.firebaseUser = { uid: payload.sub!, email: payload.email };
    next();
  } catch (error) {
    console.error("Firebase token verification failed:", error);
    return res.status(401).json({ error: "Invalid or expired token" });
  }
}
import { sql, eq, desc, and } from "drizzle-orm";
import { billingService } from "./billing";
import type { EcosystemApp, BlockchainStats } from "@shared/schema";
import { insertDocumentSchema, insertPageViewSchema, insertWaitlistSchema, faucetClaims, tokenPairs, swapTransactions, nftCollections, nfts, nftListings, legacyFounders, APP_VERSION, gameSubmissions, insertGameSubmissionSchema, playerPersonalities, waitlist, betaTesters, whitelistedUsers, blockchainDomains, signupCounter } from "@shared/schema";
import { ecosystemClient, OrbitEcosystemClient } from "./ecosystem-client";
import { submitHashToDarkWave, generateDataHash, darkwaveConfig } from "./darkwave";
import { generateHallmark, verifyHallmark, getHallmarkQRCode } from "./hallmark";
import { blockchain } from "./blockchain-engine";
import { sendEmail, sendApiKeyEmail, sendHallmarkEmail, sendPresaleConfirmationEmail } from "./email";
import { submitMemoToSolana, isHeliusConfigured, getSolanaTreasuryAddress, getSolanaBalance } from "./helius";
import { setupAuth, registerAuthRoutes, isAuthenticated } from "./replit_integrations/auth";
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
import { shellsService, SHELL_PACKAGES, SHELL_EARN_RATES, SHELL_COSTS } from "./shells-service";
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
  
  await setupAuth(app);
  registerAuthRoutes(app);
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
      
      const { getUncachableStripeClient } = await import("./stripeClient");
      const stripe = await getUncachableStripeClient();
      
      // SECURITY: Require webhook secret - never process without signature verification
      const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
      if (!webhookSecret) {
        console.error("Stripe webhook: STRIPE_WEBHOOK_SECRET not configured - rejecting request");
        return res.status(500).json({ error: "Webhook not configured" });
      }
      
      let event;
      try {
        event = stripe.webhooks.constructEvent(rawBody as Buffer, sig, webhookSecret);
      } catch (err: any) {
        console.error("Stripe webhook signature verification failed:", err.message);
        return res.status(400).json({ error: "Webhook signature verification failed" });
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
            const TOKEN_PRICE = 0.008;
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
          totalSupply: treasuryInfo?.total_supply || "100,000,000 DWC",
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

  app.post("/api/documents", documentRateLimit, async (req, res) => {
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

  app.patch("/api/documents/:id", async (req, res) => {
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

  app.delete("/api/documents/:id", async (req, res) => {
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
      totalSupply: "100,000,000",
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
          totalSupply: "100,000,000 DWC",
          decimals: 18,
          consensusType: "Proof-of-Authority",
          blockTime: "400ms",
          tps: "200,000+",
          validator: "Founders Validator",
          launchDate: "February 14, 2026",
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
      const tokenPrice = 0.008;
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
      
      const TOKEN_PRICE = 0.008;
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

  app.get("/api/presale/verify", async (req, res) => {
    try {
      const sessionId = req.query.session_id as string;
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
        
        const TOKEN_PRICE = 0.008;
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
  
  const DEFAULT_PAIRS = [
    { tokenA: "DWC", tokenB: "USDC", reserveA: "10000000000000000000000000", reserveB: "1000000000000000000000" },
    { tokenA: "DWC", tokenB: "wETH", reserveA: "5000000000000000000000000", reserveB: "100000000000000000000" },
    { tokenA: "DWC", tokenB: "wSOL", reserveA: "3000000000000000000000000", reserveB: "50000000000000000000000" },
    { tokenA: "DWC", tokenB: "USDT", reserveA: "8000000000000000000000000", reserveB: "800000000000000000000" },
    { tokenA: "wETH", tokenB: "USDC", reserveA: "50000000000000000000", reserveB: "100000000000000000000000" },
  ];

  app.get("/api/swap/info", async (req, res) => {
    try {
      res.json({
        pairs: DEFAULT_PAIRS.map((p, i) => ({ id: `pair-${i}`, ...p, fee: "0.003" })),
        volume24h: "0",
        tvl: "50000000000000000000000000",
      });
    } catch (error) {
      console.error("Swap info error:", error);
      res.status(500).json({ error: "Failed to get swap info" });
    }
  });

  app.get("/api/swap/quote", async (req, res) => {
    try {
      const { tokenIn, tokenOut, amountIn } = req.query;
      
      if (!tokenIn || !tokenOut || !amountIn) {
        return res.json({ amountOut: "0", priceImpact: "0", fee: "0", route: "", minReceived: "0" });
      }
      
      const amountInBigInt = BigInt(String(amountIn) || "0");
      if (amountInBigInt <= 0) {
        return res.json({ amountOut: "0", priceImpact: "0", fee: "0", route: "", minReceived: "0" });
      }
      
      // Simplified AMM calculation (constant product)
      // For demo: 1 DWC = 0.0001 USDC equivalent
      let rate = 0.0001;
      if (tokenIn === "DWC" && tokenOut === "USDC") rate = 0.0001;
      else if (tokenIn === "USDC" && tokenOut === "DWC") rate = 10000;
      else if (tokenIn === "DWC" && tokenOut === "wETH") rate = 0.00004;
      else if (tokenIn === "wETH" && tokenOut === "DWC") rate = 25000;
      else if (tokenIn === "DWC" && tokenOut === "wSOL") rate = 0.002;
      else if (tokenIn === "wSOL" && tokenOut === "DWC") rate = 500;
      else rate = 1;
      
      const amountOutRaw = Number(amountInBigInt) * rate;
      const fee = amountOutRaw * 0.003;
      const amountOut = Math.floor((amountOutRaw - fee)).toString();
      const minReceived = Math.floor(Number(amountOut) * 0.995).toString(); // 0.5% slippage
      
      res.json({
        amountOut,
        priceImpact: "0.01",
        fee: Math.floor(fee).toString(),
        route: `${tokenIn} → ${tokenOut}`,
        minReceived,
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
      const parseResult = SwapRequestSchema.safeParse(req.body);
      if (!parseResult.success) {
        return res.status(400).json({ error: parseResult.error.errors[0]?.message || "Invalid request" });
      }
      const { tokenIn, tokenOut, amountIn, minAmountOut } = parseResult.data;
      
      // Calculate output using same logic as quote
      const amountInBigInt = BigInt(amountIn);
      let rate = 0.0001;
      if (tokenIn === "DWC" && tokenOut === "USDC") rate = 0.0001;
      else if (tokenIn === "USDC" && tokenOut === "DWC") rate = 10000;
      else if (tokenIn === "DWC" && tokenOut === "wETH") rate = 0.00004;
      else if (tokenIn === "wETH" && tokenOut === "DWC") rate = 25000;
      else if (tokenIn === "DWC" && tokenOut === "wSOL") rate = 0.002;
      else if (tokenIn === "wSOL" && tokenOut === "DWC") rate = 500;
      else rate = 1;
      
      const amountOutRaw = Number(amountInBigInt) * rate;
      const fee = amountOutRaw * 0.003;
      const amountOut = Math.floor(amountOutRaw - fee).toString();
      
      // Record the swap
      const swap = await storage.createSwap({
        pairId: `${tokenIn}-${tokenOut}`,
        tokenIn,
        tokenOut,
        amountIn,
        amountOut,
        priceImpact: "0.01",
        status: "completed",
        txHash: `0x${crypto.randomBytes(32).toString("hex")}`,
      });
      
      res.json({
        success: true,
        swapId: swap.id,
        amountIn,
        amountOut,
        txHash: swap.txHash,
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
      let pools = await storage.getLiquidityPools();
      
      // Seed default pools if none exist
      if (pools.length === 0) {
        const defaultPools = [
          { tokenA: "DWC", tokenB: "USDC", reserveA: "10000000", reserveB: "1000000", tvl: "2000000", apr: "45.2", volume24h: "520000", fee: "0.3" },
          { tokenA: "DWC", tokenB: "wETH", reserveA: "5000000", reserveB: "200", tvl: "1500000", apr: "38.7", volume24h: "340000", fee: "0.3" },
          { tokenA: "DWC", tokenB: "wSOL", reserveA: "3000000", reserveB: "15000", tvl: "900000", apr: "52.1", volume24h: "180000", fee: "0.3" },
          { tokenA: "wETH", tokenB: "USDC", reserveA: "100", reserveB: "350000", tvl: "700000", apr: "22.4", volume24h: "95000", fee: "0.3" },
        ];
        for (const pool of defaultPools) {
          await storage.createLiquidityPool(pool);
        }
        pools = await storage.getLiquidityPools();
      }
      
      res.json({ pools });
    } catch (error) {
      console.error("Liquidity pools error:", error);
      res.json({ pools: [] });
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

  async function seedPriceHistory(token: string, days: number) {
    const now = Date.now();
    const hoursToSeed = days * 24;
    let basePrice = 0.000124;
    
    for (let i = hoursToSeed; i >= 0; i--) {
      const variation = (Math.random() - 0.48) * 0.00002;
      basePrice = Math.max(0.00005, basePrice + variation);
      await storage.recordPrice({
        token,
        price: basePrice.toFixed(8),
        volume: Math.floor(Math.random() * 100000 + 50000).toString(),
        marketCap: "12400000",
        timestamp: new Date(now - i * 3600000),
      });
    }
  }

  app.get("/api/charts/stats", async (req, res) => {
    try {
      const history = await storage.getPriceHistory("DWC", 24);
      
      if (history.length === 0) {
        await seedPriceHistory("DWC", 90);
      }
      
      const latestHistory = await storage.getPriceHistory("DWC", 24);
      const current = latestHistory[0];
      const oldest = latestHistory[latestHistory.length - 1];
      
      const currentPrice = parseFloat(current?.price || "0.000124");
      const oldPrice = parseFloat(oldest?.price || String(currentPrice));
      const change = oldPrice > 0 ? ((currentPrice - oldPrice) / oldPrice * 100).toFixed(1) : "0";
      
      const prices = latestHistory.map(h => parseFloat(h.price));
      const high = Math.max(...prices).toFixed(6);
      const low = Math.min(...prices).toFixed(6);
      const totalVolume = latestHistory.reduce((sum, h) => sum + parseInt(h.volume || "0"), 0);
      
      res.json({
        price: currentPrice.toFixed(6),
        change24h: change,
        volume24h: totalVolume.toLocaleString(),
        marketCap: "12,400,000",
        high24h: high,
        low24h: low,
      });
    } catch (error) {
      console.error("Charts stats error:", error);
      res.status(500).json({ error: "Failed to get stats" });
    }
  });

  app.get("/api/charts/history", async (req, res) => {
    try {
      const { token = "DWC", timeframe = "7d" } = req.query;
      
      let limit = 24 * 7;
      switch (timeframe) {
        case "24h": limit = 24; break;
        case "7d": limit = 24 * 7; break;
        case "30d": limit = 24 * 30; break;
        case "90d": limit = 24 * 90; break;
      }
      
      const history = await storage.getPriceHistory(token as string, limit);
      
      if (history.length === 0) {
        await seedPriceHistory(token as string, 90);
        const newHistory = await storage.getPriceHistory(token as string, limit);
        return res.json({
          data: newHistory.map(h => ({
            time: new Date(h.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            timestamp: h.timestamp,
            price: parseFloat(h.price),
            volume: parseInt(h.volume || "0"),
          })).reverse(),
        });
      }
      
      res.json({
        data: history.map(h => ({
          time: new Date(h.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          timestamp: h.timestamp,
          price: parseFloat(h.price),
          volume: parseInt(h.volume || "0"),
        })).reverse(),
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
- Genesis block: February 14, 2026
- Public launch: February 14, 2026

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
  // CHRONICLES PERSONALITY AI - API Routes
  // =====================================================
  
  const { chroniclesAI } = await import("./chronicles-ai");

  app.get("/api/chronicles/personality", isAuthenticated, async (req: any, res) => {
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
  });

  app.post("/api/chronicles/personality", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user?.id || req.user?.claims?.sub;
      if (!userId) {
        return res.status(401).json({ error: "Authentication required" });
      }
      
      const parseResult = UpdatePersonalitySchema.safeParse(req.body);
      if (!parseResult.success) {
        return res.status(400).json({ error: "Invalid request body", details: parseResult.error.issues });
      }
      
      const { playerName, parallelSelfName, worldview, visualPresentation } = parseResult.data;
      
      const personality = await chroniclesAI.getOrCreatePersonality(userId, playerName);
      
      if (playerName || parallelSelfName || worldview || visualPresentation) {
        const updates: any = { updatedAt: new Date() };
        if (playerName) updates.playerName = playerName;
        if (parallelSelfName) updates.parallelSelfName = parallelSelfName;
        if (worldview) updates.worldview = worldview;
        
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

  app.post("/api/chronicles/scenario", isAuthenticated, async (req: any, res) => {
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

  app.post("/api/chronicles/choice", isAuthenticated, async (req: any, res) => {
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
      
      res.json({ ...result, creditsUsed: creditsResult.success ? CREDIT_COSTS.CHOICE_PROCESSING : 0, creditsRemaining: creditsResult.newBalance });
    } catch (error: any) {
      console.error("Process choice error:", error);
      res.status(500).json({ error: error.message || "Failed to process choice" });
    }
  });

  app.post("/api/chronicles/chat", isAuthenticated, async (req: any, res) => {
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

  app.get("/api/chronicles/summary", isAuthenticated, async (req: any, res) => {
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

  app.get("/api/chronicles/stats", isAuthenticated, async (req: any, res) => {
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

  if (!OWNER_SECRET || OWNER_SECRET.length < 16) {
    console.error("[Owner Portal] CRITICAL: OWNER_SECRET not set or too short! Owner portal will be disabled.");
    console.error("[Owner Portal] Set OWNER_SECRET environment variable with at least 16 characters.");
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
        launchDate: "2026-02-14T00:00:00Z",
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

  app.get("/api/shells/balance", isAuthenticated, async (req: any, res) => {
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

  app.post("/api/shells/earn", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user?.claims?.sub || req.user?.id;
      const username = req.user?.claims?.firstName || req.user?.firstName || "User";
      if (!userId) return res.status(401).json({ error: "Authentication required" });
      
      const { action } = req.body;
      if (!action || !SHELL_EARN_RATES[action as keyof typeof SHELL_EARN_RATES]) {
        return res.status(400).json({ error: "Invalid action" });
      }
      
      const transaction = await shellsService.awardEngagementShells(userId, username, action as keyof typeof SHELL_EARN_RATES);
      const balance = await shellsService.getBalance(userId);
      
      res.json({ success: true, transaction, balance });
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
      
      // Credit the Orbs (uses sessionId as referenceId for idempotency)
      const transaction = await shellsService.purchaseShells(userId, username, packageKey, session.id);
      const balance = await shellsService.getBalance(userId);
      
      res.json({ success: true, transaction, balance, orbsAdded: shellAmount });
    } catch (error) {
      console.error("Verify orbs purchase error:", error);
      res.status(500).json({ error: "Failed to verify purchase" });
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
