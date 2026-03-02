import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "wouter";
import {
  Rocket, Check, Circle, Clock, Sparkles, Shield, Globe, Coins, ArrowLeftRight,
  Gamepad2, Server, ChevronDown, ChevronUp, Zap, Star, BookOpen, MessageCircle,
  Users, Lock, ExternalLink, Flame, Target, Trophy, Calendar, Timer,
  CheckCircle2, AlertCircle, ArrowRight, Layers, TrendingUp, Eye
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import heroImg from "@/assets/generated_images/hub_presale_launch.png";
import blockchainImg from "@/assets/generated_images/cc_blockchain_network.png";
import defiImg from "@/assets/generated_images/hub_trading_defi.png";
import securityImg from "@/assets/generated_images/cc_security_shield.png";
import gamesImg from "@/assets/generated_images/hub_chronicles_game.png";
import communityImg from "@/assets/generated_images/hub_community_social.png";
import bridgeImg from "@/assets/generated_images/hub_bridge_chains.png";

const LAUNCH_DATE = new Date("2026-07-04T00:00:00-05:00");

interface ChecklistItem {
  id: string;
  title: string;
  description: string;
  status: "done" | "in-progress" | "pending";
  priority: "critical" | "high" | "medium";
  link?: string;
}

interface LaunchPhase {
  id: string;
  name: string;
  subtitle: string;
  dateRange: string;
  icon: React.ReactNode;
  image: string;
  gradient: string;
  glowColor: string;
  items: ChecklistItem[];
}

const LAUNCH_PHASES: LaunchPhase[] = [
  {
    id: "core",
    name: "Core Infrastructure",
    subtitle: "Blockchain Foundation",
    dateRange: "Completed",
    icon: <Layers className="w-5 h-5" />,
    image: blockchainImg,
    gradient: "from-emerald-500 to-green-600",
    glowColor: "rgba(16,185,129,0.3)",
    items: [
      { id: "c1", title: "BFT Proof-of-Authority Consensus", description: "400ms block time, stake-weighted validators, epoch finality", status: "done", priority: "critical" },
      { id: "c2", title: "Signal (SIG) Token", description: "1B supply, 18 decimals, native Layer 1 asset", status: "done", priority: "critical" },
      { id: "c3", title: "Block Explorer", description: "Transaction search, block details, account views, live stats", status: "done", priority: "critical" },
      { id: "c4", title: "Validator Network", description: "4 regional validators: Americas, Europe, Asia-Pacific, Founders", status: "done", priority: "critical" },
      { id: "c5", title: "Wallet System", description: "Multi-chain wallet with MetaMask and Phantom integration", status: "done", priority: "critical" },
      { id: "c6", title: "Testnet Faucet", description: "Free SIG for developers and testers with rate limiting", status: "done", priority: "high" },
      { id: "c7", title: "Trust Layer SSO", description: "Cross-ecosystem single sign-on with JWT authentication", status: "done", priority: "critical" },
      { id: "c8", title: "Firebase Auth Integration", description: "Email, Google, and GitHub authentication providers", status: "done", priority: "critical" },
    ],
  },
  {
    id: "defi",
    name: "DeFi Ecosystem",
    subtitle: "Trading & Finance",
    dateRange: "March — April 2026",
    icon: <Coins className="w-5 h-5" />,
    image: defiImg,
    gradient: "from-cyan-500 to-blue-600",
    glowColor: "rgba(6,182,212,0.3)",
    items: [
      { id: "d1", title: "DEX / Token Swap", description: "AMM-style trading with real price engine for SIG pairs", status: "in-progress", priority: "critical", link: "/swap" },
      { id: "d2", title: "Staking Engine", description: "Liquid, Locked, and Founders pools with APY rewards", status: "done", priority: "critical", link: "/staking" },
      { id: "d3", title: "Liquid Staking (stSIG)", description: "12% APY with liquid staking derivative tokens", status: "done", priority: "high", link: "/liquid-staking" },
      { id: "d4", title: "NFT Marketplace", description: "Mint, buy, sell, and trade on-chain digital collectibles", status: "in-progress", priority: "critical", link: "/nft" },
      { id: "d5", title: "Token Launchpad", description: "Launch new tokens on Trust Layer with KYC verification", status: "done", priority: "high", link: "/launchpad" },
      { id: "d6", title: "Portfolio Dashboard", description: "Track holdings, staking rewards, and transaction history", status: "done", priority: "high", link: "/portfolio" },
      { id: "d7", title: "Presale System", description: "Tiered token sale with bonus structure and live tracking", status: "done", priority: "critical", link: "/presale" },
      { id: "d8", title: "Stripe & Crypto Payments", description: "Card + crypto checkout with webhook processing", status: "done", priority: "critical" },
    ],
  },
  {
    id: "bridge",
    name: "Cross-Chain Bridge",
    subtitle: "Multi-Chain Connectivity",
    dateRange: "April — May 2026",
    icon: <ArrowLeftRight className="w-5 h-5" />,
    image: bridgeImg,
    gradient: "from-violet-500 to-purple-600",
    glowColor: "rgba(139,92,246,0.3)",
    items: [
      { id: "b1", title: "Ethereum (Sepolia) Bridge", description: "Lock & mint SIG ↔ wSIG on Ethereum", status: "in-progress", priority: "critical", link: "/bridge" },
      { id: "b2", title: "Solana (Devnet) Bridge", description: "Lock & mint SIG ↔ wSIG on Solana", status: "in-progress", priority: "critical", link: "/bridge" },
      { id: "b3", title: "Polygon (Amoy) Bridge", description: "Lock & mint SIG ↔ wSIG on Polygon", status: "pending", priority: "high", link: "/bridge" },
      { id: "b4", title: "Arbitrum Bridge", description: "Lock & mint SIG ↔ wSIG on Arbitrum", status: "pending", priority: "high", link: "/bridge" },
      { id: "b5", title: "Base Bridge", description: "Lock & mint SIG ↔ wSIG on Base", status: "pending", priority: "medium", link: "/bridge" },
      { id: "b6", title: "Bridge Security Audit", description: "Multi-sig validation and smart contract verification", status: "pending", priority: "critical" },
    ],
  },
  {
    id: "security",
    name: "Security & Guardian Suite",
    subtitle: "Trust & Verification",
    dateRange: "April — June 2026",
    icon: <Shield className="w-5 h-5" />,
    image: securityImg,
    gradient: "from-red-500 to-rose-600",
    glowColor: "rgba(239,68,68,0.3)",
    items: [
      { id: "s1", title: "Guardian AI Scanner", description: "AI agent verification across 13+ chains with trust scores", status: "done", priority: "critical", link: "/guardian-scanner" },
      { id: "s2", title: "Guardian Screener", description: "DEX screener with ML predictions and snipe detection", status: "done", priority: "critical", link: "/guardian-screener" },
      { id: "s3", title: "Guardian Certification Program", description: "3-tier AI agent certification ($999 — $14,999)", status: "done", priority: "high", link: "/guardian-certification" },
      { id: "s4", title: "Guardian Shield Monitoring", description: "Continuous blockchain security monitoring", status: "done", priority: "high", link: "/guardian-shield" },
      { id: "s5", title: "Smart Contract Audit", description: "Third-party security audit of all contracts", status: "pending", priority: "critical" },
      { id: "s6", title: "Whitepaper Update", description: "Accurate tokenomics, TPS claims, and feature documentation", status: "in-progress", priority: "critical" },
    ],
  },
  {
    id: "ecosystem",
    name: "Ecosystem & Apps",
    subtitle: "32+ Connected Products",
    dateRange: "March — June 2026",
    icon: <Globe className="w-5 h-5" />,
    image: communityImg,
    gradient: "from-amber-500 to-orange-600",
    glowColor: "rgba(245,158,11,0.3)",
    items: [
      { id: "e1", title: "Chronicles", description: "Parallel life simulation with AI NPCs across 3+ eras", status: "done", priority: "critical", link: "/chronicles" },
      { id: "e2", title: "Trust Book Platform", description: "Ebook publishing with Stripe purchases and AI writing agent", status: "done", priority: "high", link: "/trust-book" },
      { id: "e3", title: "Academy", description: "Crypto education with blockchain-verified certifications", status: "done", priority: "high", link: "/academy" },
      { id: "e4", title: "Signal Chat", description: "Cross-app messaging with blockchain-verified identities", status: "done", priority: "high", link: "/signal-chat" },
      { id: "e5", title: "The Arcade", description: "Provably fair blockchain games with 9+ titles", status: "done", priority: "high", link: "/arcade" },
      { id: "e6", title: "Pulse AI Intelligence", description: "ML-powered market predictions with verified accuracy", status: "done", priority: "high", link: "/pulse" },
      { id: "e7", title: "Strike Agent", description: "Solana memecoin detection with AI risk scoring", status: "done", priority: "high", link: "/strike-agent" },
      { id: "e8", title: "Ecosystem Widget", description: "Embeddable widget for any partner app (one script tag)", status: "done", priority: "medium" },
      { id: "e9", title: "External Domains Verified", description: "All 7 primary domains active and routing correctly", status: "done", priority: "critical" },
      { id: "e10", title: "Mobile App (React Native)", description: "iOS App Store and Google Play standalone apps", status: "pending", priority: "medium" },
      { id: "e11", title: "DWSC Studio IDE", description: "Cloud IDE with Monaco editor, AI Agent Mode, GitHub, Vercel, TrustHub, CI/CD", status: "done", priority: "critical", link: "/studio" },
      { id: "e12", title: "Studio: Inline AI Autocomplete", description: "Copilot-style code suggestions as you type", status: "pending", priority: "high" },
      { id: "e13", title: "Studio: Git Diff Viewer", description: "Visual file diff for tracking changes before commit", status: "pending", priority: "medium" },
      { id: "e14", title: "Studio: Markdown & Image Preview", description: "Rendered preview for .md files and inline image viewer", status: "pending", priority: "medium" },
      { id: "e15", title: "Studio: Code Formatting", description: "One-click Prettier/Black formatting for JS, TS, Python", status: "pending", priority: "medium" },
      { id: "e16", title: "Studio: Project Templates Gallery", description: "Expanded template library with community submissions", status: "pending", priority: "medium" },
      { id: "e17", title: "Studio: Collaborative Editing", description: "Real-time multi-cursor editing with presence indicators", status: "pending", priority: "high" },
    ],
  },
  {
    id: "launch",
    name: "Launch Preparation",
    subtitle: "Go-Live Checklist",
    dateRange: "June — July 4, 2026",
    icon: <Rocket className="w-5 h-5" />,
    image: gamesImg,
    gradient: "from-pink-500 to-fuchsia-600",
    glowColor: "rgba(236,72,153,0.3)",
    items: [
      { id: "l1", title: "Token Generation Event", description: "Official SIG token launch on mainnet", status: "pending", priority: "critical" },
      { id: "l2", title: "Presale Token Distribution", description: "Deliver SIG to all presale participants", status: "pending", priority: "critical" },
      { id: "l3", title: "Exchange Listing Preparation", description: "CEX and DEX listing applications and documentation", status: "pending", priority: "high" },
      { id: "l4", title: "Governance DAO Activation", description: "On-chain voting for protocol decisions goes live", status: "pending", priority: "high" },
      { id: "l5", title: "Public Announcement", description: "Press releases, social media, and community notification", status: "pending", priority: "critical" },
      { id: "l6", title: "Load Testing & Hardening", description: "Stress test all infrastructure for production traffic", status: "pending", priority: "critical" },
    ],
  },
];

function useCountdown(targetDate: Date) {
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);
  const diff = Math.max(0, targetDate.getTime() - now.getTime());
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);
  return { days, hours, minutes, seconds, total: diff };
}

function CountdownDigit({ value, label }: { value: number; label: string }) {
  const str = String(value).padStart(2, "0");
  return (
    <div className="flex flex-col items-center" data-testid={`countdown-${label}`}>
      <div className="relative">
        <div
          className="w-16 h-20 sm:w-20 sm:h-24 md:w-24 md:h-28 rounded-2xl flex items-center justify-center relative overflow-hidden"
          style={{
            background: "linear-gradient(135deg, rgba(6,182,212,0.15), rgba(139,92,246,0.15))",
            border: "1px solid rgba(6,182,212,0.3)",
            boxShadow: "0 0 40px rgba(6,182,212,0.15), inset 0 1px 0 rgba(255,255,255,0.1), 0 20px 60px rgba(0,0,0,0.3)",
          }}
        >
          <div className="absolute inset-0 opacity-10" style={{
            background: "repeating-linear-gradient(0deg, transparent, transparent 4px, rgba(255,255,255,0.03) 4px, rgba(255,255,255,0.03) 5px)",
          }} />
          <span className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-b from-white via-cyan-100 to-cyan-300 bg-clip-text text-transparent font-mono tracking-wider relative z-10">
            {str}
          </span>
        </div>
        <div className="absolute -inset-1 rounded-2xl opacity-30 blur-lg" style={{
          background: "linear-gradient(135deg, rgba(6,182,212,0.4), rgba(139,92,246,0.4))",
        }} />
      </div>
      <span className="text-[10px] sm:text-xs uppercase tracking-[0.2em] text-cyan-400/70 mt-2 font-medium">{label}</span>
    </div>
  );
}

function CountdownSeparator() {
  return (
    <div className="flex flex-col gap-2 items-center justify-center h-20 sm:h-24 md:h-28 px-1">
      <div className="w-1.5 h-1.5 rounded-full bg-cyan-400/60 animate-pulse" />
      <div className="w-1.5 h-1.5 rounded-full bg-purple-400/60 animate-pulse" style={{ animationDelay: "0.5s" }} />
    </div>
  );
}

function PhaseCard({ phase, index }: { phase: LaunchPhase; index: number }) {
  const [expanded, setExpanded] = useState(phase.items.some(i => i.status === "in-progress"));

  const doneCount = phase.items.filter(i => i.status === "done").length;
  const totalCount = phase.items.length;
  const inProgressCount = phase.items.filter(i => i.status === "in-progress").length;
  const progress = ((doneCount + inProgressCount * 0.5) / totalCount) * 100;
  const isComplete = doneCount === totalCount;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      data-testid={`phase-${phase.id}`}
    >
      <div
        className="relative overflow-hidden rounded-2xl border transition-all duration-500 group"
        style={{
          borderColor: isComplete ? "rgba(16,185,129,0.3)" : "rgba(255,255,255,0.08)",
          boxShadow: expanded
            ? `0 0 60px ${phase.glowColor}, 0 20px 60px rgba(0,0,0,0.4)`
            : "0 0 20px rgba(0,0,0,0.3)",
        }}
      >
        <div className="absolute inset-0">
          <img src={phase.image} alt="" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-slate-950/85 to-slate-950/70" />
        </div>

        <div className="absolute inset-0 pointer-events-none opacity-[0.03]" style={{
          backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
          backgroundSize: "24px 24px",
        }} />

        <button
          onClick={() => setExpanded(!expanded)}
          className="relative z-10 w-full text-left p-5 sm:p-6"
          data-testid={`toggle-phase-${phase.id}`}
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-4 flex-1 min-w-0">
              <div className={`flex-shrink-0 w-11 h-11 rounded-xl flex items-center justify-center bg-gradient-to-br ${phase.gradient}`}
                style={{ boxShadow: `0 0 20px ${phase.glowColor}` }}>
                {isComplete ? <Check className="w-5 h-5 text-white" /> : phase.icon}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <h3 className="text-lg sm:text-xl font-bold text-white">{phase.name}</h3>
                  {isComplete && (
                    <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 text-[10px] px-2">
                      <Check className="w-3 h-3 mr-1" /> COMPLETE
                    </Badge>
                  )}
                  {!isComplete && inProgressCount > 0 && (
                    <Badge className="bg-cyan-500/20 text-cyan-400 border-cyan-500/30 text-[10px] px-2 animate-pulse">
                      <Clock className="w-3 h-3 mr-1" /> ACTIVE
                    </Badge>
                  )}
                </div>
                <p className="text-white/40 text-xs mb-3">{phase.subtitle} · {phase.dateRange}</p>
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden max-w-xs">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 1.5, ease: "easeOut" }}
                      className={`h-full rounded-full bg-gradient-to-r ${phase.gradient}`}
                      style={{ boxShadow: `0 0 10px ${phase.glowColor}` }}
                    />
                  </div>
                  <span className="text-xs text-white/50 font-mono">{doneCount}/{totalCount}</span>
                </div>
              </div>
            </div>
            <div className="flex-shrink-0 mt-1">
              {expanded ? <ChevronUp className="w-5 h-5 text-white/30" /> : <ChevronDown className="w-5 h-5 text-white/30" />}
            </div>
          </div>
        </button>

        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="relative z-10 px-5 sm:px-6 pb-5 sm:pb-6 space-y-2">
                {phase.items.map((item, i) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="flex items-start gap-3 p-3 rounded-xl transition-all"
                    style={{
                      backgroundColor: item.status === "done" ? "rgba(16,185,129,0.05)" :
                        item.status === "in-progress" ? "rgba(6,182,212,0.05)" : "rgba(255,255,255,0.02)",
                      border: `1px solid ${item.status === "done" ? "rgba(16,185,129,0.15)" :
                        item.status === "in-progress" ? "rgba(6,182,212,0.15)" : "rgba(255,255,255,0.05)"}`,
                    }}
                    data-testid={`checklist-${item.id}`}
                  >
                    <div className="flex-shrink-0 mt-0.5">
                      {item.status === "done" ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-400" style={{ filter: "drop-shadow(0 0 4px rgba(16,185,129,0.5))" }} />
                      ) : item.status === "in-progress" ? (
                        <div className="relative">
                          <Clock className="w-5 h-5 text-cyan-400 animate-pulse" />
                          <div className="absolute inset-0 w-5 h-5 rounded-full bg-cyan-400/20 animate-ping" />
                        </div>
                      ) : (
                        <Circle className="w-5 h-5 text-white/20" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`text-sm font-medium ${item.status === "done" ? "text-white/70 line-through decoration-emerald-500/50" :
                          item.status === "in-progress" ? "text-white" : "text-white/50"}`}>
                          {item.title}
                        </span>
                        {item.priority === "critical" && item.status !== "done" && (
                          <span className="text-[9px] px-1.5 py-0.5 rounded bg-red-500/20 text-red-400 border border-red-500/20 font-medium">MUST</span>
                        )}
                      </div>
                      <p className="text-xs text-white/30 mt-0.5">{item.description}</p>
                    </div>
                    {item.link && (
                      <Link href={item.link} data-testid={`link-${item.id}`}>
                        <ExternalLink className="w-4 h-4 text-white/20 hover:text-cyan-400 transition-colors flex-shrink-0 cursor-pointer" />
                      </Link>
                    )}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

export default function LaunchCountdown() {
  const countdown = useCountdown(LAUNCH_DATE);

  const stats = useMemo(() => {
    const all = LAUNCH_PHASES.flatMap(p => p.items);
    const done = all.filter(i => i.status === "done").length;
    const inProgress = all.filter(i => i.status === "in-progress").length;
    const pending = all.filter(i => i.status === "pending").length;
    const critical = all.filter(i => i.priority === "critical");
    const criticalDone = critical.filter(i => i.status === "done").length;
    return { total: all.length, done, inProgress, pending, criticalTotal: critical.length, criticalDone };
  }, []);

  const overallProgress = Math.round((stats.done / stats.total) * 100);

  return (
    <div className="min-h-screen bg-slate-950 relative" data-testid="page-launch">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] rounded-full opacity-[0.04]"
          style={{ background: "radial-gradient(circle, rgba(6,182,212,1) 0%, transparent 70%)" }} />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] rounded-full opacity-[0.03]"
          style={{ background: "radial-gradient(circle, rgba(139,92,246,1) 0%, transparent 70%)" }} />
        <div className="absolute top-1/3 right-0 w-[400px] h-[400px] rounded-full opacity-[0.02]"
          style={{ background: "radial-gradient(circle, rgba(236,72,153,1) 0%, transparent 70%)" }} />
      </div>

      <div className="absolute inset-0 pointer-events-none opacity-[0.015]" style={{
        backgroundImage: "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.5) 1px, transparent 0)",
        backgroundSize: "40px 40px",
      }} />

      <div className="relative z-10">
        <div className="relative overflow-hidden">
          <div className="absolute inset-0">
            <img src={heroImg} alt="" className="w-full h-full object-cover opacity-20" />
            <div className="absolute inset-0 bg-gradient-to-b from-slate-950/60 via-slate-950/80 to-slate-950" />
          </div>

          <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 pt-24 sm:pt-28 pb-16 sm:pb-20">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center"
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full mb-8"
                style={{
                  background: "linear-gradient(135deg, rgba(6,182,212,0.15), rgba(139,92,246,0.15))",
                  border: "1px solid rgba(6,182,212,0.3)",
                  boxShadow: "0 0 30px rgba(6,182,212,0.1)",
                }}
              >
                <Flame className="w-4 h-4 text-orange-400 animate-pulse" />
                <span className="text-sm font-medium bg-gradient-to-r from-cyan-300 to-purple-300 bg-clip-text text-transparent">
                  Independence Day for Trust
                </span>
                <Flame className="w-4 h-4 text-orange-400 animate-pulse" style={{ animationDelay: "0.3s" }} />
              </motion.div>

              <h1 className="text-4xl sm:text-5xl md:text-7xl font-black mb-4 tracking-tight">
                <span className="bg-gradient-to-r from-white via-cyan-100 to-white bg-clip-text text-transparent">
                  Signal Launches
                </span>
              </h1>
              <h2 className="text-2xl sm:text-3xl md:text-5xl font-black mb-8">
                <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  July 4th, 2026
                </span>
              </h2>

              <p className="text-base sm:text-lg text-white/50 max-w-2xl mx-auto mb-12 leading-relaxed">
                The Trust Layer goes live. Own your Signal. Trade across chains.
                Hold the asset that powers accountability in business.
              </p>

              <div className="flex items-center justify-center gap-2 sm:gap-3 md:gap-4 mb-12">
                <CountdownDigit value={countdown.days} label="Days" />
                <CountdownSeparator />
                <CountdownDigit value={countdown.hours} label="Hours" />
                <CountdownSeparator />
                <CountdownDigit value={countdown.minutes} label="Minutes" />
                <CountdownSeparator />
                <CountdownDigit value={countdown.seconds} label="Seconds" />
              </div>

              <div className="flex items-center justify-center gap-3 flex-wrap">
                <Link href="/presale" data-testid="link-presale-cta">
                  <Button
                    className="bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white px-8 py-6 text-base font-bold rounded-xl"
                    style={{ boxShadow: "0 0 30px rgba(6,182,212,0.3), 0 0 60px rgba(139,92,246,0.15)" }}
                  >
                    <Coins className="w-5 h-5 mr-2" />
                    Get Signal Early
                  </Button>
                </Link>
                <Link href="/token" data-testid="link-token-info">
                  <Button variant="outline" className="border-white/10 text-white/70 hover:bg-white/5 hover:border-cyan-500/30 px-6 py-6 text-base rounded-xl">
                    <Eye className="w-5 h-5 mr-2" />
                    Learn About SIG
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 -mt-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-16"
          >
            {[
              { label: "Overall Progress", value: `${overallProgress}%`, icon: <TrendingUp className="w-4 h-4" />, color: "cyan" },
              { label: "Tasks Complete", value: `${stats.done}/${stats.total}`, icon: <CheckCircle2 className="w-4 h-4" />, color: "emerald" },
              { label: "In Progress", value: `${stats.inProgress}`, icon: <Clock className="w-4 h-4" />, color: "amber" },
              { label: "Critical Path", value: `${stats.criticalDone}/${stats.criticalTotal}`, icon: <AlertCircle className="w-4 h-4" />, color: "red" },
            ].map((stat, i) => (
              <div
                key={stat.label}
                className="relative overflow-hidden rounded-xl p-4 sm:p-5 text-center"
                style={{
                  background: "linear-gradient(135deg, rgba(255,255,255,0.03), rgba(255,255,255,0.01))",
                  border: "1px solid rgba(255,255,255,0.06)",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
                }}
                data-testid={`stat-${stat.label.toLowerCase().replace(/\s/g, '-')}`}
              >
                <div className={`inline-flex items-center justify-center w-8 h-8 rounded-lg mb-2 bg-${stat.color}-500/10`}>
                  <span className={`text-${stat.color}-400`}>{stat.icon}</span>
                </div>
                <div className="text-xl sm:text-2xl font-bold text-white font-mono">{stat.value}</div>
                <div className="text-[10px] sm:text-xs text-white/40 mt-1 uppercase tracking-wider">{stat.label}</div>
              </div>
            ))}
          </motion.div>

          <div className="mb-8 text-center">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              <h2 className="text-2xl sm:text-3xl font-bold mb-2">
                <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">Launch Checklist</span>
              </h2>
              <p className="text-white/40 text-sm max-w-lg mx-auto">
                Every milestone tracked in real-time. When all critical items are checked, Signal goes live.
              </p>
            </motion.div>
          </div>

          <div className="relative mb-10">
            <div className="h-3 bg-white/5 rounded-full overflow-hidden" style={{ border: "1px solid rgba(255,255,255,0.05)" }}>
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: `${overallProgress}%` }}
                viewport={{ once: true }}
                transition={{ duration: 2, ease: "easeOut" }}
                className="h-full rounded-full relative"
                style={{
                  background: "linear-gradient(90deg, #06b6d4, #8b5cf6, #ec4899)",
                  boxShadow: "0 0 20px rgba(6,182,212,0.4), 0 0 40px rgba(139,92,246,0.2)",
                }}
              >
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-white shadow-lg shadow-cyan-500/50" />
              </motion.div>
            </div>
            <div className="flex justify-between mt-2 text-[10px] text-white/30 font-mono px-1">
              <span>Foundation</span>
              <span>DeFi</span>
              <span>Bridge</span>
              <span>Security</span>
              <span>Ecosystem</span>
              <span>Launch</span>
            </div>
          </div>

          <div className="space-y-4 mb-20">
            {LAUNCH_PHASES.map((phase, i) => (
              <PhaseCard key={phase.id} phase={phase} index={i} />
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center pb-20"
          >
            <div
              className="max-w-2xl mx-auto p-8 sm:p-10 rounded-2xl relative overflow-hidden"
              style={{
                background: "linear-gradient(135deg, rgba(6,182,212,0.08), rgba(139,92,246,0.08))",
                border: "1px solid rgba(6,182,212,0.2)",
                boxShadow: "0 0 60px rgba(6,182,212,0.1), 0 20px 60px rgba(0,0,0,0.3)",
              }}
            >
              <div className="absolute inset-0 pointer-events-none opacity-[0.03]" style={{
                backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
                backgroundSize: "32px 32px",
              }} />
              <Rocket className="w-10 h-10 text-cyan-400 mx-auto mb-4" style={{ filter: "drop-shadow(0 0 10px rgba(6,182,212,0.5))" }} />
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-3">Don't Miss Launch Day</h3>
              <p className="text-white/40 text-sm mb-6 max-w-md mx-auto">
                Secure your Signal tokens at pre-launch prices before the Token Generation Event.
                Early holders get the best allocation.
              </p>
              <div className="flex items-center justify-center gap-3 flex-wrap">
                <Link href="/presale" data-testid="link-presale-bottom">
                  <Button
                    className="bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white px-6 py-5 font-bold rounded-xl"
                    style={{ boxShadow: "0 0 25px rgba(6,182,212,0.25)" }}
                  >
                    <Coins className="w-4 h-4 mr-2" />
                    Buy Signal Now
                  </Button>
                </Link>
                <Link href="/roadmap" data-testid="link-detailed-roadmap">
                  <Button variant="outline" className="border-white/10 text-white/60 hover:bg-white/5 hover:border-white/20 px-6 py-5 rounded-xl">
                    Detailed Roadmaps
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        </div>

        <footer className="border-t border-white/5 py-6 text-center">
          <p className="text-xs text-white/20">
            DarkWave Trust Layer · Signal (SIG) · Launching July 4, 2026
          </p>
        </footer>
      </div>
    </div>
  );
}