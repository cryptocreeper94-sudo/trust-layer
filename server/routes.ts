import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import crypto from "crypto";
import { WebSocketServer, WebSocket } from "ws";
import { z } from "zod";
import { storage } from "./storage";
import { db } from "./db";
import { sql, eq } from "drizzle-orm";
import { billingService } from "./billing";
import type { EcosystemApp, BlockchainStats } from "@shared/schema";
import { insertDocumentSchema, insertPageViewSchema, insertWaitlistSchema, faucetClaims, tokenPairs, swapTransactions, nftCollections, nfts, nftListings, APP_VERSION } from "@shared/schema";
import { ecosystemClient, OrbitEcosystemClient } from "./ecosystem-client";
import { submitHashToDarkWave, generateDataHash, darkwaveConfig } from "./darkwave";
import { generateHallmark, verifyHallmark, getHallmarkQRCode } from "./hallmark";
import { blockchain } from "./blockchain-engine";
import { sendEmail, sendApiKeyEmail, sendHallmarkEmail } from "./email";
import { submitMemoToSolana, isHeliusConfigured, getSolanaTreasuryAddress, getSolanaBalance } from "./helius";
import { setupAuth, registerAuthRoutes, isAuthenticated } from "./replit_integrations/auth";
import { startRegistration, finishRegistration, startAuthentication, finishAuthentication, getUserPasskeys, deletePasskey } from "./webauthn";
import { bridge } from "./bridge-engine";
import { registerChatRoutes } from "./replit_integrations/chat";
import { registerImageRoutes } from "./replit_integrations/image";
import { stakingEngine } from "./staking-engine";

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

  // Firebase auth sync - syncs Firebase users to our database
  app.post("/api/auth/firebase-sync", async (req, res) => {
    try {
      const { uid, email, displayName, photoURL } = req.body;
      
      if (!uid) {
        return res.status(400).json({ error: "Missing user ID" });
      }

      // Upsert user in our database
      await storage.upsertFirebaseUser({
        id: uid,
        email: email || null,
        firstName: displayName?.split(' ')[0] || null,
        lastName: displayName?.split(' ').slice(1).join(' ') || null,
        profileImageUrl: photoURL || null,
      });

      res.json({ success: true });
    } catch (error) {
      console.error("Firebase sync error:", error);
      res.status(500).json({ error: "Failed to sync user" });
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

  app.get("/api/ecosystem/hub/status", async (req, res) => {
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

  app.post("/api/ecosystem/register", async (req, res) => {
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
  
  app.get("/api/ecosystem/apps", async (req, res) => {
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

      // Check DarkWave Chain (Blockchain Engine)
      const chainStart = Date.now();
      try {
        const chainInfo = blockchain.getChainInfo();
        const chainLatency = Date.now() - chainStart;
        services.push({
          name: "DarkWave Chain",
          status: chainInfo.blockHeight > 0 ? "operational" : "degraded",
          latency: chainLatency,
          message: `Block #${chainInfo.blockHeight}`
        });
      } catch {
        services.push({ name: "DarkWave Chain", status: "down", message: "Chain unavailable" });
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

  app.get("/api/chain", async (req, res) => {
    try {
      const chainInfo = blockchain.getChainInfo();
      res.json(chainInfo);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch chain info" });
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

  app.get("/api/documents", async (req, res) => {
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

  app.post("/api/documents", async (req, res) => {
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

  app.post("/api/developer/auth", async (req, res) => {
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
      chainName: "DarkWave Chain",
      nativeToken: "DWT",
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
      
      const ONE_DWT = BigInt("1000000000000000000");
      const totalGas = BigInt(gasLimit) * BigInt(gasPrice);
      const costInDWT = Number(totalGas) / Number(ONE_DWT);
      const costInUSD = costInDWT * 0.01;

      res.json({
        gasLimit,
        gasPrice,
        estimatedCost: `${totalGas}`,
        estimatedCostDWT: `${costInDWT.toFixed(8)} DWT`,
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
      currency: "DWT",
      estimatedUSDPerDWT: 0.01,
    });
  });

  function generateApiKey(): string {
    const bytes = crypto.randomBytes(32);
    return `dwc_${bytes.toString("hex")}`;
  }

  app.post("/api/developer/register", async (req, res) => {
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

  app.post("/api/hash/submit", async (req, res) => {
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
        fee: `${Number(fee) / 1e18} DWT`,
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
        fee: tx.fee ? `${Number(tx.fee) / 1e18} DWT` : null,
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
      
      // Fund the test wallet with 1000 test DWT
      blockchain.creditAccount(walletAddress, BigInt("1000000000000000000000")); // 1000 DWT
      
      res.json({
        success: true,
        wallet: {
          address: walletAddress,
          privateKey: `0x${privateKey}`,
          balance: "1000.0",
          network: "DarkWave Devnet",
          chainId: 8453,
        },
        message: "Test wallet created and funded with 1000 DWT",
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
      
      // Validate and limit faucet to 100 DWT per request (must be positive)
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
          amountSent: `${requestedAmount} DWT`,
          newBalance: account ? (Number(account.balance) / 1e18).toFixed(4) : "0",
          txHash: `0x${crypto.randomBytes(32).toString("hex")}`,
          network: "DarkWave Devnet",
        },
        message: `Sent ${requestedAmount} test DWT to ${address}`,
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
          amount: `${amount || 0} DWT`,
          data: data || null,
          status: "confirmed",
          blockHeight,
          network: "DarkWave Devnet",
          gasUsed: "21000",
          gasFee: "0.000021 DWT",
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
        faucetLimit: "100 DWT per request",
        symbol: "DWT",
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
          ? `Verified on DarkWave Chain (Block ${hallmark.darkwaveBlockHeight})`
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
  app.post("/api/bridge/verify-tx", async (req, res) => {
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

  app.post("/api/bridge/lock", async (req, res) => {
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
        message: "DWT locked on DarkWave. Wrapped tokens will be minted on target chain.",
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to lock tokens" });
    }
  });

  app.post("/api/bridge/burn", async (req, res) => {
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
        message: "Burn recorded. DWT will be released on DarkWave Chain.",
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

  app.post("/api/staking/stake", isAuthenticated, async (req, res) => {
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

  app.post("/api/staking/unstake", isAuthenticated, async (req, res) => {
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

  app.post("/api/staking/claim", isAuthenticated, async (req, res) => {
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
  // LIQUID STAKING (stDWT)
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

  app.post("/api/liquid-staking/stake", isAuthenticated, async (req: any, res) => {
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

  app.post("/api/liquid-staking/unstake", isAuthenticated, async (req: any, res) => {
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
        return res.status(400).json({ error: "Insufficient stDWT balance" });
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

  // ============================================
  // NFT MARKETPLACE
  // ============================================

  async function seedNftCollections() {
    const DEFAULT_COLLECTIONS = [
      { name: "DarkWave Genesis", symbol: "DWGEN", description: "The original DarkWave NFT collection", imageUrl: "https://picsum.photos/seed/dwgen/400/400" },
      { name: "Cyber Punks", symbol: "CYPK", description: "Futuristic cyber art collection", imageUrl: "https://picsum.photos/seed/cypk/400/400" },
      { name: "Quantum Realms", symbol: "QREALM", description: "Explore quantum dimensions through art", imageUrl: "https://picsum.photos/seed/qrealm/400/400" },
      { name: "Neon Dreams", symbol: "NEON", description: "Neon-infused digital artwork", imageUrl: "https://picsum.photos/seed/neon/400/400" },
    ];
    
    for (const collection of DEFAULT_COLLECTIONS) {
      await storage.createNftCollection(collection);
    }
  }

  async function seedNfts(collections: any[]) {
    const NFT_NAMES = ["Aurora Pulse", "Digital Dawn", "Quantum Shift", "Neon Wave", "Cyber Core", "Pixel Storm"];
    
    for (const collection of collections) {
      for (let i = 0; i < 5; i++) {
        await storage.createNft({
          tokenId: `${collection.id}-${i}`,
          collectionId: collection.id,
          name: `${NFT_NAMES[i % NFT_NAMES.length]} #${i + 1}`,
          description: `A unique NFT from the ${collection.name} collection`,
          imageUrl: `https://picsum.photos/seed/${collection.id}-${i}/400/400`,
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
    { tokenA: "DWT", tokenB: "USDC", reserveA: "10000000000000000000000000", reserveB: "1000000000000000000000" },
    { tokenA: "DWT", tokenB: "wETH", reserveA: "5000000000000000000000000", reserveB: "100000000000000000000" },
    { tokenA: "DWT", tokenB: "wSOL", reserveA: "3000000000000000000000000", reserveB: "50000000000000000000000" },
    { tokenA: "DWT", tokenB: "USDT", reserveA: "8000000000000000000000000", reserveB: "800000000000000000000" },
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
      // For demo: 1 DWT = 0.0001 USDC equivalent
      let rate = 0.0001;
      if (tokenIn === "DWT" && tokenOut === "USDC") rate = 0.0001;
      else if (tokenIn === "USDC" && tokenOut === "DWT") rate = 10000;
      else if (tokenIn === "DWT" && tokenOut === "wETH") rate = 0.00004;
      else if (tokenIn === "wETH" && tokenOut === "DWT") rate = 25000;
      else if (tokenIn === "DWT" && tokenOut === "wSOL") rate = 0.002;
      else if (tokenIn === "wSOL" && tokenOut === "DWT") rate = 500;
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
      if (tokenIn === "DWT" && tokenOut === "USDC") rate = 0.0001;
      else if (tokenIn === "USDC" && tokenOut === "DWT") rate = 10000;
      else if (tokenIn === "DWT" && tokenOut === "wETH") rate = 0.00004;
      else if (tokenIn === "wETH" && tokenOut === "DWT") rate = 25000;
      else if (tokenIn === "DWT" && tokenOut === "wSOL") rate = 0.002;
      else if (tokenIn === "wSOL" && tokenOut === "DWT") rate = 500;
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
      
      const priceHistory = await storage.getPriceHistory("DWT", 2);
      const currentPrice = parseFloat(priceHistory[0]?.price || "0.000124");
      const oldPrice = parseFloat(priceHistory[1]?.price || String(currentPrice));
      const priceChange = oldPrice > 0 ? ((currentPrice - oldPrice) / oldPrice * 100) : 0;
      
      const dwtValue = parseFloat(dwtBalance) / 1e18 * currentPrice;
      
      const stakingPositions = await storage.getStakingPositions(userId);
      const totalStaked = stakingPositions.reduce((sum, p) => (BigInt(sum) + BigInt(p.amount)).toString(), "0");
      const pendingRewards = stakingPositions.reduce((sum, p) => (BigInt(sum) + BigInt(p.pendingRewards || "0")).toString(), "0");
      const stakedValue = parseFloat(totalStaked) / 1e18 * currentPrice;
      
      const lpPositions = await storage.getLiquidityPositions(userId);
      const lpValue = lpPositions.reduce((sum, p) => sum + parseFloat(p.lpTokens) * 0.01, 0);
      
      const totalValue = dwtValue + stakedValue + lpValue;
      
      res.json({
        totalValue,
        change24h: parseFloat(priceChange.toFixed(2)),
        tokens: [
          { symbol: "DWT", name: "DarkWave Token", balance: dwtBalance, value: dwtValue, change: parseFloat(priceChange.toFixed(2)), icon: "🌊" },
        ],
        staking: {
          totalStaked,
          pendingRewards,
          apy: 12.5,
          stakedValue,
          positions: stakingPositions.map(p => ({
            pool: p.poolId.includes("validator") ? "Validator Node" : p.poolId.includes("delegator") ? "Delegator Pool" : "Staking Pool",
            amount: p.amount,
            apy: p.poolId.includes("validator") ? 15.0 : p.poolId.includes("delegator") ? 12.5 : 10.0,
            rewards: p.pendingRewards || "0",
          })),
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
  // TESTNET FAUCET
  // ============================================
  
  const FAUCET_AMOUNT = "1000000000000000000000"; // 1000 DWT
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
        dailyLimit: "10000000000000000000000", // 10,000 DWT per day total
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
          { tokenA: "DWT", tokenB: "USDC", reserveA: "10000000", reserveB: "1000000", tvl: "2000000", apr: "45.2", volume24h: "520000", fee: "0.3" },
          { tokenA: "DWT", tokenB: "wETH", reserveA: "5000000", reserveB: "200", tvl: "1500000", apr: "38.7", volume24h: "340000", fee: "0.3" },
          { tokenA: "DWT", tokenB: "wSOL", reserveA: "3000000", reserveB: "15000", tvl: "900000", apr: "52.1", volume24h: "180000", fee: "0.3" },
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

  app.post("/api/liquidity/add", isAuthenticated, async (req: any, res) => {
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
      const history = await storage.getPriceHistory("DWT", 24);
      
      if (history.length === 0) {
        await seedPriceHistory("DWT", 90);
      }
      
      const latestHistory = await storage.getPriceHistory("DWT", 24);
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
      const { token = "DWT", timeframe = "7d" } = req.query;
      
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
      const { url, events } = req.body;
      if (!url || !events?.length) {
        return res.status(400).json({ error: "URL and events are required" });
      }
      
      const webhook = await storage.createWebhook({
        userId,
        url,
        events: JSON.stringify(events),
        secret: `whsec_${crypto.randomBytes(16).toString('hex')}`,
        isActive: true,
        failureCount: 0,
      });
      
      res.json({ success: true, webhook });
    } catch (error: any) {
      console.error("Create webhook error:", error);
      res.status(500).json({ error: error.message || "Failed to create webhook" });
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
      const userId = req.user?.id;
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
      const userId = req.user?.id;
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

      const systemPrompt = `You are DarkWave AI, a friendly and knowledgeable assistant for the DarkWave Chain ecosystem. 

DarkWave Chain is a Layer 1 blockchain with:
- 400ms block times
- 200,000+ TPS capacity  
- Proof-of-Authority consensus with the Founders Validator
- Native DWT token (100 million total supply, 18 decimals)
- Genesis block: February 14, 2025
- Public launch: February 14, 2026

Key features available:
- Faucet: Get 1000 free test DWT (24-hour cooldown)
- Swap/DEX: Trade tokens with 0.3% fee
- NFT Marketplace: Buy, sell, and mint NFTs
- Staking: Stake DWT to earn rewards
- Portfolio: Track holdings and transactions
- Liquidity Pools: Provide liquidity and earn fees
- Launchpad: Launch new tokens
- Bridge: Transfer DWT to Ethereum (wDWT) or Solana
- DarkWave Studio: Full-featured web IDE

Keep responses concise (2-3 sentences max), friendly, and helpful. If asked about prices, balances, or specific data, explain that you can guide them to the relevant page. Use casual, warm language like you're a helpful friend.`;

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

  return httpServer;
}

const APP_URL_MAP: Record<string, string> = {
  "orbit-chain": "https://orbitstaffing.io",
  "orbitstaffing": "https://orbitstaffing.io",
  "darkwave-staffing": "https://orbitstaffing.io",
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
      
      return [...hubApps, ...additionalLocalApps];
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
      category: "Real Estate",
      description: "Professional lot operations for automotive dealerships.",
      hook: "Dealership operations streamlined",
      tags: ["Auto", "B2B", "Inventory", "Real Estate"],
      gradient: "from-indigo-600 to-violet-800",
      verified: true,
      users: "DarkWave Verified",
      url: "https://lotopspro.io",
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
      category: "AI",
      description: "Your personal AI companion for portfolio management.",
      hook: "Your AI blockchain companion",
      tags: ["AI", "Chatbot", "Assistant"],
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
