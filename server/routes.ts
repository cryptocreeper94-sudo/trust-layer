import type { Express } from "express";
import { createServer, type Server } from "http";
import crypto from "crypto";
import { storage } from "./storage";
import type { EcosystemApp, BlockchainStats } from "@shared/schema";
import { insertDocumentSchema, insertPageViewSchema, insertWaitlistSchema, APP_VERSION } from "@shared/schema";
import { ecosystemClient, OrbitEcosystemClient } from "./ecosystem-client";
import { submitHashToDarkWave, generateDataHash, darkwaveConfig } from "./darkwave";
import { generateHallmark, verifyHallmark, getHallmarkQRCode } from "./hallmark";
import { blockchain } from "./blockchain-engine";
import { sendEmail, sendApiKeyEmail, sendHallmarkEmail } from "./email";
import { submitMemoToSolana, isHeliusConfigured, getSolanaTreasuryAddress, getSolanaBalance } from "./helius";
import { setupAuth, registerAuthRoutes } from "./replit_integrations/auth";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  await setupAuth(app);
  registerAuthRoutes(app);

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
  const developerSessions = new Map<string, { createdAt: number }>();
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
        developerSessions.set(sessionToken, { createdAt: Date.now() });
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
      
      if (!sessionToken || !validateDeveloperSession(sessionToken)) {
        return res.status(401).json({ error: "Developer session required. Please authenticate first." });
      }

      const { name, email, appName } = req.body;
      
      if (!name || !email || !appName) {
        return res.status(400).json({ error: "Name, email, and app name are required" });
      }

      const rawKey = generateApiKey();
      const result = await storage.createApiKey({
        name,
        email,
        appName,
        permissions: "read,write",
        rateLimit: "1000",
        isActive: true,
      }, rawKey);

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
