import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import type { EcosystemApp, BlockchainStats } from "@shared/schema";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
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

  return httpServer;
}

async function fetchEcosystemApps(): Promise<EcosystemApp[]> {
  const DARKWAVE_HUB_URL = process.env.DARKWAVE_HUB_API_URL;
  
  if (DARKWAVE_HUB_URL) {
    try {
      const response = await fetch(`${DARKWAVE_HUB_URL}/apps`);
      if (response.ok) {
        return await response.json();
      }
    } catch (error) {
      console.warn("Dark Wave Hub API not available, using mock data");
    }
  }
  
  return [
    {
      id: "darkwave-pulse",
      name: "DarkWave Pulse",
      category: "DeFi & AI",
      description: "Predictive market intelligence powered by sentient AI learning systems.",
      hook: "Auto-trade with AI precision",
      tags: ["AI", "Auto-Trading", "Predictive", "Sniping"],
      gradient: "from-cyan-600 to-blue-700",
      verified: true,
      featured: true,
      users: "Orbit Verified",
    },
    {
      id: "orbit-staffing",
      name: "Orbit Staffing",
      category: "Enterprise",
      description: "Blockchain-based staffing and workforce management. Immutable records.",
      hook: "Blockchain-powered HR",
      tags: ["HR", "Payroll", "Enterprise"],
      gradient: "from-emerald-600 to-teal-800",
      verified: true,
      users: "Orbit Verified",
    },
    {
      id: "paint-pros",
      name: "Paint Pros",
      category: "Enterprise",
      description: "Complete management suite for painting franchisees and supply chains.",
      hook: "Franchise management reimagined",
      tags: ["Franchise", "Supply Chain", "Ops"],
      gradient: "from-orange-500 to-amber-700",
      verified: true,
      users: "Orbit Verified",
    },
    {
      id: "orby",
      name: "Orby",
      category: "AI Assistant",
      description: "Your personal AI companion. Execute trades with natural language.",
      hook: "Your AI blockchain companion",
      tags: ["AI", "Chatbot", "Assistant"],
      gradient: "from-cyan-400 to-blue-500",
      verified: true,
      users: "Orbit Verified",
    },
    {
      id: "garagebot",
      name: "GarageBot",
      category: "Automation",
      description: "Smart automation for vehicle maintenance and garage management.",
      hook: "IoT-powered garage automation",
      tags: ["Auto", "IoT", "Maintenance"],
      gradient: "from-slate-600 to-zinc-800",
      verified: true,
      users: "Orbit Verified",
    },
    {
      id: "brew-board",
      name: "Brew & Board",
      category: "Social & Gaming",
      description: "Decentralized community for board game enthusiasts and craft brew lovers.",
      hook: "Social gaming meets craft beer",
      tags: ["Social", "Events", "Rewards"],
      gradient: "from-amber-600 to-yellow-800",
      verified: true,
      users: "Orbit Verified",
    },
    {
      id: "lotops-pro",
      name: "LotOps Pro",
      category: "Enterprise",
      description: "Professional lot operations management for automotive dealerships.",
      hook: "Dealership operations streamlined",
      tags: ["Auto", "B2B", "Inventory"],
      gradient: "from-indigo-600 to-violet-800",
      verified: true,
      users: "Orbit Verified",
    },
  ];
}

async function fetchBlockchainStats(): Promise<BlockchainStats> {
  const BLOCKCHAIN_API_URL = process.env.BLOCKCHAIN_API_URL;
  
  if (BLOCKCHAIN_API_URL) {
    try {
      const response = await fetch(`${BLOCKCHAIN_API_URL}/stats`);
      if (response.ok) {
        return await response.json();
      }
    } catch (error) {
      console.warn("Blockchain API not available, using mock data");
    }
  }
  
  return {
    tps: "200K+",
    finalityTime: "0.4s",
    avgCost: "$0.0001",
    activeNodes: "150+",
    currentBlock: "#8,921,042",
    networkHash: "42.8 EH/s",
  };
}
