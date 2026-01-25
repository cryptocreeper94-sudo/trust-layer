import { motion } from "framer-motion";
import { 
  CheckCircle, 
  Clock, 
  Rocket, 
  Shield, 
  Cpu, 
  Globe, 
  Users, 
  Code, 
  Wallet,
  GitBranch,
  Lock,
  Zap,
  ArrowRight,
  ExternalLink
} from "lucide-react";
import { BackButton } from "@/components/page-nav";
import { Link } from "wouter";

interface RoadmapItem {
  title: string;
  description: string;
  status: "completed" | "in-progress" | "planned";
  eta?: string;
  details?: string[];
}

interface RoadmapPhase {
  phase: string;
  title: string;
  icon: React.ReactNode;
  items: RoadmapItem[];
}

const roadmapData: RoadmapPhase[] = [
  {
    phase: "Season Zero",
    title: "Chronicles BETA v0.1 (NOW)",
    icon: <Rocket className="w-6 h-6" />,
    items: [
      {
        title: "Medieval Era (Age of Crowns)",
        description: "First playable era with 5 factions and AI NPCs",
        status: "completed",
        details: ["Guardian-verified AI", "Chronicle Proofs on-chain", "Voice cloning technology"]
      },
      {
        title: "AI NPC Conversation System",
        description: "GPT-4o powered NPCs with persistent memory",
        status: "completed",
        details: ["Context-aware responses", "Faction personality", "Choice Echoes (no moral labels)"]
      },
      {
        title: "5-Axis Emotion System",
        description: "Arousal, Valence, Social Cohesion, Fear, and Ambition",
        status: "completed"
      },
      {
        title: "Business Storefront Program",
        description: "Real businesses claim in-game real estate across all eras",
        status: "in-progress",
        eta: "Coming Soon"
      }
    ]
  },
  {
    phase: "Phase 1",
    title: "Core Blockchain Infrastructure",
    icon: <Cpu className="w-6 h-6" />,
    items: [
      {
        title: "BFT-PoA Consensus Engine",
        description: "Byzantine Fault Tolerant Proof-of-Authority with 2/3+ stake quorum",
        status: "completed",
        details: ["400ms block time", "200K+ TPS capacity", "Stake-weighted validator selection"]
      },
      {
        title: "Validator Economics",
        description: "Staking, slashing, and commission systems",
        status: "completed",
        details: ["1,000 SIG minimum stake", "5% slashing for misbehavior", "Ed25519 attestation signatures"]
      },
      {
        title: "Node Sync APIs",
        description: "External nodes can sync chain state and join the network",
        status: "completed",
        details: ["/api/sync/state endpoint", "/api/validators/register", "/api/consensus/attest"]
      },
      {
        title: "909K+ Blocks Produced",
        description: "Mainnet chain running since February 2025",
        status: "completed"
      }
    ]
  },
  {
    phase: "Phase 2",
    title: "Wallet & User Experience",
    icon: <Wallet className="w-6 h-6" />,
    items: [
      {
        title: "MetaMask Integration",
        description: "Connect wallet and add Trust Layer chain to MetaMask",
        status: "completed",
        details: ["Chain ID: 8453", "One-click chain addition", "Transaction signing"]
      },
      {
        title: "Multi-Wallet Support",
        description: "Phantom (Solana), WalletConnect, and native wallets",
        status: "completed"
      },
      {
        title: "Cloud Wallet Backup",
        description: "Encrypted seed phrase backup with Firebase",
        status: "completed"
      },
      {
        title: "Hardware Wallet Support",
        description: "Ledger and Trezor integration",
        status: "planned",
        eta: "Coming Soon"
      }
    ]
  },
  {
    phase: "Phase 3",
    title: "DeFi Ecosystem",
    icon: <Zap className="w-6 h-6" />,
    items: [
      {
        title: "DEX / Token Swap",
        description: "AMM-style decentralized exchange with liquidity pools",
        status: "completed"
      },
      {
        title: "Staking & Liquid Staking",
        description: "SIG staking with stSIG liquid staking tokens",
        status: "completed"
      },
      {
        title: "NFT Marketplace",
        description: "Create, buy, sell, and auction NFTs",
        status: "completed"
      },
      {
        title: "Token Launchpad",
        description: "Fair launch platform for new tokens",
        status: "completed"
      },
      {
        title: "Cross-Chain Bridge",
        description: "Lock & mint bridge to Ethereum and Solana",
        status: "completed",
        details: ["Ethereum Sepolia testnet", "Solana Devnet", "UUPS proxy contracts"]
      }
    ]
  },
  {
    phase: "Phase 4",
    title: "Smart Contracts & Developer Tools",
    icon: <Code className="w-6 h-6" />,
    items: [
      {
        title: "Token Deployment Templates",
        description: "Pre-built templates for ERC-20 style tokens",
        status: "completed"
      },
      {
        title: "Guardian Studio Copilot",
        description: "AI-powered smart contract generator with security audits",
        status: "completed"
      },
      {
        title: "EVM-Compatible Execution Layer",
        description: "Full Solidity smart contract support",
        status: "planned",
        eta: "Coming Soon",
        details: ["Deploy existing Solidity contracts", "Remix IDE support", "Hardhat/Foundry integration"]
      },
      {
        title: "Developer SDK",
        description: "JavaScript/TypeScript SDK for dApp development",
        status: "planned",
        eta: "Coming Soon"
      }
    ]
  },
  {
    phase: "Phase 5",
    title: "Decentralization & Security",
    icon: <Shield className="w-6 h-6" />,
    items: [
      {
        title: "4 Active Validators",
        description: "Regional validators for global coverage",
        status: "completed",
        details: ["Founders Validator (50%)", "Asia-Pacific (25%)", "Europe (15%)", "Americas (10%)"]
      },
      {
        title: "External Validator Program",
        description: "Open validator registration with stake delegation",
        status: "in-progress",
        eta: "Coming Soon"
      },
      {
        title: "Security Audit",
        description: "Third-party consensus and smart contract audits",
        status: "planned",
        eta: "Coming Soon"
      },
      {
        title: "Bug Bounty Program",
        description: "Rewards for responsible vulnerability disclosure",
        status: "planned",
        eta: "Coming Soon"
      }
    ]
  },
  {
    phase: "Phase 6",
    title: "Token Generation Event",
    icon: <Rocket className="w-6 h-6" />,
    items: [
      {
        title: "Presale Complete",
        description: "Early adopter token distribution ready",
        status: "completed"
      },
      {
        title: "Airdrop Distribution",
        description: "SIG airdrop to early supporters",
        status: "planned",
        eta: "At Launch"
      },
      {
        title: "DEX Listing",
        description: "Initial liquidity on Uniswap/Raydium",
        status: "planned",
        eta: "Coming Soon"
      },
      {
        title: "CEX Listings",
        description: "Tier 2 and Tier 1 exchange listings",
        status: "planned",
        eta: "After Launch"
      }
    ]
  }
];

const statusColors = {
  "completed": "text-green-400 bg-green-400/10 border-green-400/30",
  "in-progress": "text-yellow-400 bg-yellow-400/10 border-yellow-400/30",
  "planned": "text-slate-400 bg-slate-400/10 border-slate-400/30"
};

const statusIcons = {
  "completed": <CheckCircle className="w-4 h-4" />,
  "in-progress": <Clock className="w-4 h-4 animate-pulse" />,
  "planned": <Clock className="w-4 h-4" />
};

export default function TechnicalRoadmap() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <BackButton />
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
              Technical Roadmap
            </span>
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Trust Layer development progress and upcoming milestones
          </p>
          <div className="flex justify-center gap-6 mt-6">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-400"></div>
              <span className="text-sm text-slate-400">Completed</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-yellow-400 animate-pulse"></div>
              <span className="text-sm text-slate-400">In Progress</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-slate-400"></div>
              <span className="text-sm text-slate-400">Planned</span>
            </div>
          </div>
        </motion.div>

        <div className="space-y-8">
          {roadmapData.map((phase, phaseIndex) => (
            <motion.div
              key={phase.phase}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: phaseIndex * 0.1 }}
              className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 backdrop-blur-sm"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 rounded-xl bg-gradient-to-br from-cyan-500/20 to-purple-500/20 border border-cyan-500/30">
                  {phase.icon}
                </div>
                <div>
                  <span className="text-cyan-400 text-sm font-medium">{phase.phase}</span>
                  <h2 className="text-xl font-bold text-white">{phase.title}</h2>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                {phase.items.map((item, itemIndex) => (
                  <motion.div
                    key={item.title}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: phaseIndex * 0.1 + itemIndex * 0.05 }}
                    className="bg-slate-800/50 border border-slate-700 rounded-xl p-4"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-white">{item.title}</h3>
                      <span className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${statusColors[item.status]}`}>
                        {statusIcons[item.status]}
                        {item.status === "in-progress" ? "In Progress" : item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                      </span>
                    </div>
                    <p className="text-slate-400 text-sm mb-2">{item.description}</p>
                    {item.eta && (
                      <p className="text-cyan-400 text-xs font-medium">ETA: {item.eta}</p>
                    )}
                    {item.details && (
                      <ul className="mt-2 space-y-1">
                        {item.details.map((detail, i) => (
                          <li key={i} className="text-xs text-slate-500 flex items-center gap-1">
                            <ArrowRight className="w-3 h-3" />
                            {detail}
                          </li>
                        ))}
                      </ul>
                    )}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-12 text-center"
        >
          <div className="bg-gradient-to-r from-cyan-500/10 via-purple-500/10 to-pink-500/10 border border-cyan-500/30 rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-white mb-4">Token Generation Event</h2>
            <p className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent mb-2">
              Coming Soon
            </p>
            <p className="text-slate-400 mb-6">Mainnet launch with full token distribution</p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/presale">
                <button className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-xl font-semibold text-white hover:opacity-90 transition" data-testid="button-presale">
                  Join Presale
                </button>
              </Link>
              <Link href="/validators">
                <button className="px-6 py-3 bg-slate-800 border border-slate-700 rounded-xl font-semibold text-white hover:bg-slate-700 transition" data-testid="button-validators">
                  Become a Validator
                </button>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
