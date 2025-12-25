import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Circle, Clock, Sparkles, Layers, Shield, Globe, Rocket, Server, ChevronDown, ChevronUp, ArrowLeft, Coins, ArrowLeftRight } from "lucide-react";
import { Link } from "wouter";

import blockchainBg from "@assets/generated_images/futuristic_blockchain_network_activity_monitor.png";
import dashboardImg from "@assets/generated_images/futuristic_dashboard_interface_for_managing_decentralized_applications.png";
import deepSpace from "@assets/generated_images/deep_space_station.png";
import cyberpunkCity from "@assets/generated_images/cyberpunk_neon_city.png";
import medievalKingdom from "@assets/generated_images/medieval_fantasy_kingdom.png";
import quantumRealm from "@assets/generated_images/quantum_dimension_realm.png";
import fantasyWorld from "@assets/generated_images/fantasy_sci-fi_world_landscape.png";

interface Milestone {
  id: string;
  title: string;
  description: string;
  status: "completed" | "in_progress" | "pending";
  isRequired: boolean;
}

interface Phase {
  id: string;
  name: string;
  description: string;
  status: "completed" | "in_progress" | "upcoming";
  targetDate: string;
  icon: React.ReactNode;
  image: string;
  milestones: Milestone[];
}

// ACCURATE STATUS - Only mark what's actually fully implemented in codebase
// "completed" = fully working, production-ready
// "in_progress" = UI exists with some backend, needs more work
// "pending" = not yet started
const ECOSYSTEM_PHASES: Phase[] = [
  {
    id: "phase-foundations",
    name: "Foundations",
    description: "Core blockchain infrastructure and portal development",
    status: "in_progress",
    targetDate: "Q1-Q2 2025",
    icon: <Layers className="w-6 h-6" />,
    image: blockchainBg,
    milestones: [
      { id: "e1", title: "Proof-of-Authority Consensus", description: "400ms block time with Founders Validator", status: "completed", isRequired: true },
      { id: "e2", title: "Web Portal Launch", description: "React-based blockchain interface with wallet integration", status: "completed", isRequired: true },
      { id: "e3", title: "DWC Token Implementation", description: "100M supply, 18 decimals, native token", status: "completed", isRequired: true },
      { id: "e4", title: "Block Explorer", description: "Transaction search, block details, account views", status: "completed", isRequired: true },
      { id: "e5", title: "Testnet Faucet", description: "Free DWC for developers and testers", status: "completed", isRequired: true },
      { id: "e6", title: "Transparent Crowdfunding", description: "DWSC stamps for donation verification", status: "completed", isRequired: true },
    ],
  },
  {
    id: "phase-ecosystem",
    name: "Ecosystem Build",
    description: "DeFi features, NFT marketplace, and developer tools",
    status: "in_progress",
    targetDate: "Q3-Q4 2025",
    icon: <Coins className="w-6 h-6" />,
    image: dashboardImg,
    milestones: [
      { id: "e7", title: "DEX / Token Swap", description: "AMM-style trading for DWC/USDC/wETH/wSOL/USDT pairs", status: "pending", isRequired: true },
      { id: "e8", title: "NFT Marketplace", description: "Mint, buy, sell, and trade digital collectibles", status: "pending", isRequired: true },
      { id: "e9", title: "Liquid Staking (stDWC)", description: "12% APY with liquid staking tokens", status: "pending", isRequired: true },
      { id: "e10", title: "Token Launchpad", description: "Launch new tokens on DarkWave Smart Chain", status: "pending", isRequired: true },
      { id: "e11", title: "Portfolio Dashboard", description: "Track holdings, staking, and transaction history", status: "pending", isRequired: true },
      { id: "e12", title: "DarkWave Studio IDE", description: "Monaco-based development environment with 70+ languages", status: "in_progress", isRequired: true },
      { id: "e13", title: "Cross-Chain Bridge", description: "Lock & mint for DWC ↔ wDWC on Ethereum and Solana", status: "pending", isRequired: true },
      { id: "e14", title: "Mobile Wallet App", description: "iOS and Android native applications", status: "pending", isRequired: true },
    ],
  },
  {
    id: "phase-hardening",
    name: "Network Hardening",
    description: "Security audits, scaling, and global infrastructure",
    status: "upcoming",
    targetDate: "Q1 2026",
    icon: <Shield className="w-6 h-6" />,
    image: deepSpace,
    milestones: [
      { id: "e15", title: "Security Audits", description: "Third-party smart contract and protocol audits", status: "pending", isRequired: true },
      { id: "e16", title: "Global Validator Network", description: "Transition from single to distributed validator set", status: "pending", isRequired: true },
      { id: "e17", title: "Dedicated Server Clusters", description: "North America, Europe, Asia-Pacific regions", status: "pending", isRequired: true },
      { id: "e18", title: "Governance DAO", description: "On-chain voting for protocol decisions", status: "pending", isRequired: true },
      { id: "e19", title: "Compliance Framework", description: "Legal and regulatory readiness", status: "pending", isRequired: false },
      { id: "e20", title: "24/7 Operations Team", description: "Round-the-clock monitoring and support", status: "pending", isRequired: true },
    ],
  },
  {
    id: "phase-launch",
    name: "Mainnet Launch",
    description: "Public launch and live operations",
    status: "upcoming",
    targetDate: "Feb 14, 2026",
    icon: <Rocket className="w-6 h-6" />,
    image: quantumRealm,
    milestones: [
      { id: "e21", title: "Mainnet Genesis Block", description: "Official network launch on Valentine's Day 2026", status: "pending", isRequired: true },
      { id: "e22", title: "Token Migration", description: "Testnet to mainnet token conversion", status: "pending", isRequired: true },
      { id: "e23", title: "DarkWave Chronicles Alpha", description: "First playable version of the AI life simulator", status: "pending", isRequired: true },
      { id: "e24", title: "Exchange Listings", description: "CEX and DEX trading availability", status: "pending", isRequired: false },
      { id: "e25", title: "Layer 2 Scaling", description: "High-throughput rollup solution", status: "pending", isRequired: false },
      { id: "e26", title: "DarkWave Games Portal", description: "darkwavegames.io gaming ecosystem launch", status: "pending", isRequired: true },
    ],
  },
];

function PhaseCard({ phase, isExpanded, onToggle }: { phase: Phase; isExpanded: boolean; onToggle: () => void }) {
  const statusColors = {
    completed: "from-green-500 to-emerald-600",
    in_progress: "from-cyan-500 to-blue-500",
    upcoming: "from-gray-600 to-gray-700",
  };
  
  const statusLabels = {
    completed: "Completed",
    in_progress: "In Progress",
    upcoming: "Upcoming",
  };
  
  const completedCount = phase.milestones.filter(m => m.status === "completed").length;
  const inProgressCount = phase.milestones.filter(m => m.status === "in_progress").length;
  const totalCount = phase.milestones.length;
  const progress = ((completedCount + inProgressCount * 0.5) / totalCount) * 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative"
    >
      <div 
        onClick={onToggle}
        data-testid={`card-phase-${phase.id}`}
        className="cursor-pointer relative overflow-hidden rounded-2xl border border-white/10 hover:border-cyan-500/30 transition-all group"
        style={{
          boxShadow: phase.status === "in_progress" 
            ? "0 0 60px rgba(6, 182, 212, 0.2), inset 0 1px 0 rgba(255,255,255,0.1)"
            : "0 0 30px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.1)",
        }}
      >
        {/* Photorealistic Background */}
        <div className="absolute inset-0">
          <img 
            src={phase.image} 
            alt={phase.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-black/50" />
        </div>
        
        {/* Holographic overlay */}
        <div className="absolute inset-0 opacity-20 pointer-events-none" style={{
          background: "repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.02) 10px, rgba(255,255,255,0.02) 20px)",
        }} />
        
        {/* Progress bar at top */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-black/50">
          <motion.div 
            className={`h-full bg-gradient-to-r ${statusColors[phase.status]}`}
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
        </div>
        
        <div className="relative z-10 p-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${statusColors[phase.status]} flex items-center justify-center shadow-lg`}>
                {phase.icon}
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">{phase.name}</h3>
                <p className="text-gray-300 text-sm mt-1">{phase.description}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <span className={`inline-block px-3 py-1.5 rounded-full text-xs font-semibold bg-gradient-to-r ${statusColors[phase.status]} text-white shadow-lg`}>
                  {statusLabels[phase.status]}
                </span>
                <p className="text-gray-400 text-xs mt-2">{phase.targetDate}</p>
              </div>
              <motion.div
                animate={{ rotate: isExpanded ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronDown className="w-5 h-5 text-gray-400" />
              </motion.div>
            </div>
          </div>
          
          <div className="mt-4 flex items-center gap-3 text-sm">
            <span className="text-gray-300">
              <span className="text-green-400 font-semibold">{completedCount}</span> completed
              {inProgressCount > 0 && (
                <span className="ml-2">
                  <span className="text-cyan-400 font-semibold">{inProgressCount}</span> in progress
                </span>
              )}
              <span className="text-gray-500"> / {totalCount} milestones</span>
            </span>
            <div className="flex-1 h-2 bg-black/50 backdrop-blur-sm rounded-full overflow-hidden">
              <motion.div 
                className={`h-full bg-gradient-to-r ${statusColors[phase.status]}`}
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
              />
            </div>
          </div>
        </div>
      </div>
      
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-2 space-y-2 pl-4"
          >
            {phase.milestones.map((milestone, index) => (
              <MilestoneItem key={milestone.id} milestone={milestone} index={index} />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function MilestoneItem({ milestone, index }: { milestone: Milestone; index: number }) {
  const statusIcons = {
    completed: <Check className="w-4 h-4 text-green-400" />,
    in_progress: <Clock className="w-4 h-4 text-cyan-400 animate-pulse" />,
    pending: <Circle className="w-4 h-4 text-gray-600" />,
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
      data-testid={`milestone-${milestone.id}`}
      className={`flex items-start gap-3 p-4 rounded-xl border backdrop-blur-sm transition-all ${
        milestone.status === "completed" 
          ? "bg-green-500/10 border-green-500/30" 
          : milestone.status === "in_progress"
          ? "bg-cyan-500/10 border-cyan-500/30"
          : "bg-gray-900/50 border-white/5"
      }`}
    >
      <div className={`mt-0.5 w-7 h-7 rounded-full flex items-center justify-center ${
        milestone.status === "completed" ? "bg-green-500/20" :
        milestone.status === "in_progress" ? "bg-cyan-500/20" : "bg-gray-800"
      }`}>
        {statusIcons[milestone.status]}
      </div>
      <div className="flex-1">
        <h4 className={`font-medium ${
          milestone.status === "completed" ? "text-green-400" : 
          milestone.status === "in_progress" ? "text-cyan-400" : "text-white"
        }`}>
          {milestone.title}
          {milestone.isRequired && <span className="ml-2 text-xs text-amber-400/80">Required</span>}
        </h4>
        <p className="text-gray-400 text-sm mt-1">{milestone.description}</p>
      </div>
    </motion.div>
  );
}

export default function RoadmapEcosystem() {
  const [expandedPhase, setExpandedPhase] = useState<string | null>("phase-foundations");
  
  const totalMilestones = ECOSYSTEM_PHASES.reduce((acc, p) => acc + p.milestones.length, 0);
  const completedMilestones = ECOSYSTEM_PHASES.reduce((acc, p) => acc + p.milestones.filter(m => m.status === "completed").length, 0);
  const inProgressMilestones = ECOSYSTEM_PHASES.reduce((acc, p) => acc + p.milestones.filter(m => m.status === "in_progress").length, 0);
  const overallProgress = ((completedMilestones + inProgressMilestones * 0.3) / totalMilestones) * 100;

  return (
    <div className="min-h-screen bg-[#080c18] text-white">
      {/* Hero with background */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img src={blockchainBg} alt="Blockchain" className="w-full h-full object-cover opacity-30" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#080c18]/50 via-[#080c18]/80 to-[#080c18]" />
        </div>
        
        <div className="relative z-10 max-w-5xl mx-auto px-4 py-12">
          <Link href="/" className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition-colors" data-testid="link-back-home">
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </Link>

          <div className="text-center mb-12">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/30 mb-6"
            >
              <Server className="w-4 h-4 text-cyan-400" />
              <span className="text-cyan-300 text-sm font-medium">DarkWave Smart Chain</span>
            </motion.div>
            
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                Ecosystem Roadmap
              </span>
            </h1>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Our path to mainnet launch on February 14, 2026. 
              A Layer 1 blockchain built to surpass Solana and Ethereum.
            </p>
          </div>

          {/* Overall Progress Card with photorealistic background */}
          <div 
            className="relative overflow-hidden mb-12 rounded-2xl border border-cyan-500/20"
            style={{ boxShadow: "0 0 60px rgba(6, 182, 212, 0.15)" }}
          >
            <div className="absolute inset-0">
              <img src={dashboardImg} alt="Dashboard" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/80 to-black/70" />
            </div>
            <div className="absolute inset-0 opacity-20 pointer-events-none" style={{
              background: "repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.02) 10px, rgba(255,255,255,0.02) 20px)",
            }} />
            
            <div className="relative z-10 p-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold text-white">Overall Progress</h2>
                  <p className="text-gray-300 text-sm mt-1">
                    <span className="text-green-400 font-semibold">{completedMilestones}</span> completed, 
                    <span className="text-cyan-400 font-semibold ml-1">{inProgressMilestones}</span> in progress of {totalMilestones} milestones
                  </p>
                </div>
                <div className="text-4xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                  {Math.round(overallProgress)}%
                </div>
              </div>
              <div className="h-4 bg-black/50 backdrop-blur-sm rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${overallProgress}%` }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                  className="h-full bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 pb-12">
        <div className="space-y-4">
          {ECOSYSTEM_PHASES.map((phase) => (
            <PhaseCard
              key={phase.id}
              phase={phase}
              isExpanded={expandedPhase === phase.id}
              onToggle={() => setExpandedPhase(expandedPhase === phase.id ? null : phase.id)}
            />
          ))}
        </div>

        {/* Bottom links with photorealistic backgrounds */}
        <div className="mt-12 grid md:grid-cols-2 gap-4">
          <Link 
            href="/roadmap-chronicles" 
            className="block relative overflow-hidden rounded-2xl border border-purple-500/20 hover:border-purple-500/40 transition-all group"
            data-testid="link-chronicles-roadmap"
            style={{ boxShadow: "0 0 40px rgba(168, 85, 247, 0.1)" }}
          >
            <div className="absolute inset-0">
              <img src={fantasyWorld} alt="Chronicles" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-black/50" />
            </div>
            <div className="relative z-10 p-6">
              <h3 className="text-lg font-semibold text-white mb-2">DarkWave Chronicles</h3>
              <p className="text-gray-300 text-sm">View the game development roadmap</p>
            </div>
          </Link>
          <Link 
            href="/crowdfund" 
            className="block relative overflow-hidden rounded-2xl border border-cyan-500/20 hover:border-cyan-500/40 transition-all group"
            data-testid="link-support-crowdfund"
            style={{ boxShadow: "0 0 40px rgba(6, 182, 212, 0.1)" }}
          >
            <div className="absolute inset-0">
              <img src={cyberpunkCity} alt="Support" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-black/50" />
            </div>
            <div className="relative z-10 p-6">
              <h3 className="text-lg font-semibold text-white mb-2">Support Development</h3>
              <p className="text-gray-300 text-sm">Help fund features and accelerate progress</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
