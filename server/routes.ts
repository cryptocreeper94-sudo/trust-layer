import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import type { EcosystemApp, BlockchainStats } from "@shared/schema";
import { insertDocumentSchema } from "@shared/schema";
import { ecosystemClient, OrbitEcosystemClient } from "./ecosystem-client";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

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

  app.get("/api/blockchain/stats", async (req, res) => {
    try {
      const stats = await fetchBlockchainStats();
      res.json(stats);
    } catch (error) {
      console.error("Error fetching blockchain stats:", error);
      res.status(500).json({ error: "Failed to fetch blockchain stats" });
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

  return httpServer;
}

async function fetchEcosystemApps(): Promise<EcosystemApp[]> {
  if (ecosystemClient.isConfigured()) {
    try {
      const apps = await ecosystemClient.getApps() as EcosystemApp[];
      if (Array.isArray(apps) && apps.length > 0) {
        return apps;
      }
    } catch (error) {
      console.warn("DarkWave Hub API not available, using local data");
    }
  }
  
  return [
    {
      id: "orbit-staffing",
      name: "ORBIT Staffing OS",
      category: "Enterprise",
      description: "Complete workforce management platform with blockchain-verified employment records.",
      hook: "Blockchain-powered HR",
      tags: ["HR", "Payroll", "Enterprise", "Compliance"],
      gradient: "from-emerald-600 to-teal-800",
      verified: true,
      users: "Orbit Verified",
    },
    {
      id: "garagebot",
      name: "GarageBot",
      category: "Automotive",
      description: "Smart automation for vehicle maintenance and garage management with IoT integration.",
      hook: "IoT-powered garage automation",
      tags: ["Auto", "IoT", "Maintenance"],
      gradient: "from-slate-600 to-zinc-800",
      verified: true,
      users: "Orbit Verified",
    },
    {
      id: "brew-board",
      name: "Brew & Board Coffee",
      category: "Hospitality",
      description: "Decentralized community platform for coffee shops with loyalty rewards and event management.",
      hook: "Social gaming meets craft coffee",
      tags: ["Social", "Events", "Rewards", "Hospitality"],
      gradient: "from-amber-600 to-yellow-800",
      verified: true,
      users: "Orbit Verified",
    },
    {
      id: "lotops-pro",
      name: "Lot Ops Pro",
      category: "Real Estate",
      description: "Professional lot operations management for automotive dealerships and real estate.",
      hook: "Dealership operations streamlined",
      tags: ["Auto", "B2B", "Inventory", "Real Estate"],
      gradient: "from-indigo-600 to-violet-800",
      verified: true,
      users: "Orbit Verified",
    },
    {
      id: "darkwave-pulse",
      name: "DarkWave Pulse",
      category: "Analytics",
      description: "Predictive market intelligence powered by sentient AI learning systems.",
      hook: "Auto-trade with AI precision",
      tags: ["AI", "Auto-Trading", "Predictive", "Analytics"],
      gradient: "from-cyan-600 to-blue-700",
      verified: true,
      featured: true,
      users: "Orbit Verified",
    },
    {
      id: "orby",
      name: "Orby",
      category: "AI",
      description: "Your personal AI companion. Execute trades and manage your portfolio with natural language.",
      hook: "Your AI blockchain companion",
      tags: ["AI", "Chatbot", "Assistant"],
      gradient: "from-cyan-400 to-blue-500",
      verified: true,
      users: "Orbit Verified",
    },
  ];
}

async function fetchBlockchainStats(): Promise<BlockchainStats> {
  return {
    tps: "200K+",
    finalityTime: "0.4s",
    avgCost: "$0.0001",
    activeNodes: "150+",
    currentBlock: "#8,921,042",
    networkHash: "42.8 EH/s",
  };
}
