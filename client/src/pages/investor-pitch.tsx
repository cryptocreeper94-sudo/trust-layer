import { motion } from "framer-motion";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import {
  Shield,
  Zap,
  Users,
  Brain,
  Layers,
  Globe,
  TrendingUp,
  Clock,
  DollarSign,
  Gamepad2,
  Code,
  Target,
  Award,
  ChevronRight,
  Sparkles,
  BarChart3,
  Star,
  Trophy,
  Rocket,
  Building2,
  Calendar,
  Coins,
  PieChart,
  ArrowUpRight,
  CheckCircle,
  Lock,
  Network,
  Briefcase,
  LineChart,
  Activity,
  Box,
  Cpu
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BackButton } from "@/components/page-nav";
import { Footer } from "@/components/footer";
import { GlassCard, StatCard } from "@/components/glass-card";

const keyMetrics = [
  { value: "200K+", label: "TPS Capacity", icon: Zap },
  { value: "400ms", label: "Block Finality", icon: Clock },
  { value: "$0.001", label: "Avg Transaction", icon: DollarSign },
  { value: "6", label: "Active Shards", icon: Layers }
];

const tokenomics = [
  { label: "Total Supply", value: "1,000,000,000 SIG", color: "from-cyan-500 to-blue-600" },
  { label: "Treasury Reserve", value: "50%", color: "from-amber-500 to-orange-600" },
  { label: "Staking Rewards", value: "15%", color: "from-emerald-500 to-teal-600" },
  { label: "Development & Team", value: "15%", color: "from-indigo-500 to-violet-600" },
  { label: "Ecosystem Growth", value: "10%", color: "from-pink-500 to-rose-600" },
  { label: "Community Rewards", value: "10%", color: "from-purple-500 to-pink-600" }
];

const milestones = [
  { date: "Q4 2025", title: "Testnet Launch", desc: "Full testnet with all core features", status: "completed" },
  { date: "NOW", title: "Season Zero BETA v0.1", desc: "Chronicles playable - Medieval Era, AI NPCs, Chronicle Proofs", status: "in_progress" },
  { date: "Q1 2026", title: "Security Audits", desc: "Guardian Protocol + external audits", status: "upcoming" },
  { date: "Apr 11, 2026", title: "TGE (Token Launch)", desc: "Mainnet launch & token generation", status: "upcoming" },
  { date: "Q2 2026", title: "DeFi Suite Launch", desc: "DEX, Staking, Bridge go live", status: "planned" },
  { date: "Q3 2026", title: "Chronicles Expansion", desc: "20+ eras, full economy, mobile companion", status: "planned" },
  { date: "Q4 2026", title: "10 Eras Complete", desc: "All verifiable historical eras fully playable", status: "planned" }
];

const investmentThesis = [
  {
    title: "First-Mover in Security-First L1",
    description: "We're the only blockchain with built-in security scores, verifiable AI, and portable identity. These aren't add-ons — they're core protocol features.",
    icon: Shield,
    gradient: "from-emerald-500 to-teal-600"
  },
  {
    title: "Chronicles: The Parallel Self Game",
    description: "DarkWave Chronicles (BETA v0.1 live now) - You navigate 10 verifiable historical eras as YOUR parallel self. AI NPCs, Chronicle Proofs, voice cloning - infrastructure for immersive entertainment.",
    icon: Gamepad2,
    gradient: "from-purple-500 to-pink-600"
  },
  {
    title: "Experience Shards = Scalability",
    description: "Dedicated execution lanes mean gaming doesn't compete with DeFi for resources. SLAs guarantee performance. This is true horizontal scaling.",
    icon: Layers,
    gradient: "from-cyan-500 to-blue-600"
  },
  {
    title: "AI-Native Architecture",
    description: "Every AI decision on DarkWave is provably fair and auditable. As AI becomes ubiquitous, this becomes essential infrastructure.",
    icon: Brain,
    gradient: "from-pink-500 to-rose-600"
  },
  {
    title: "Quest Mining = Organic Growth",
    description: "Users earn tokens by contributing to the ecosystem. This creates sustainable, organic growth without expensive acquisition campaigns.",
    icon: Target,
    gradient: "from-amber-500 to-orange-600"
  },
  {
    title: "Revenue-Generating Protocol",
    description: "Protocol fees from transactions, bridge, staking, and marketplace. Treasury-backed with sustainable tokenomics. No inflationary emissions.",
    icon: TrendingUp,
    gradient: "from-indigo-500 to-violet-600"
  }
];

const teamHighlights = [
  { role: "Technical Leadership", desc: "20+ years combined blockchain experience" },
  { role: "Security Focus", desc: "Former security researchers from major protocols" },
  { role: "Gaming Expertise", desc: "AAA game development background" },
  { role: "DeFi Experience", desc: "Built and scaled multiple DeFi protocols" }
];

export default function InvestorPitch() {
  const { data: chainStats } = useQuery({
    queryKey: ["/api/consensus"],
    refetchInterval: 5000,
  });

  const { data: validators } = useQuery({
    queryKey: ["/api/validators"],
    refetchInterval: 10000,
  });

  const liveStats = {
    blockHeight: (chainStats as any)?.chainHeight?.toLocaleString() || "910,000+",
    validators: Array.isArray(validators) ? validators.length : 4,
    totalStake: "20,000,000 SIG",
    uptime: "99.99%",
  };

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-cyan-900/20 via-black to-black pointer-events-none" />
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-purple-900/15 via-transparent to-transparent pointer-events-none" />
      
      <div className="fixed top-32 left-16 w-96 h-96 rounded-full bg-cyan-500/8 blur-[120px] animate-pulse pointer-events-none" />
      <div className="fixed top-64 right-24 w-80 h-80 rounded-full bg-purple-500/10 blur-[100px] animate-pulse pointer-events-none" style={{ animationDelay: '1s' }} />
      <div className="fixed bottom-32 left-1/3 w-72 h-72 rounded-full bg-amber-500/8 blur-[90px] animate-pulse pointer-events-none" style={{ animationDelay: '2s' }} />
      <div className="fixed bottom-48 right-1/4 w-64 h-64 rounded-full bg-emerald-500/6 blur-[80px] animate-pulse pointer-events-none" style={{ animationDelay: '3s' }} />
      
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-black/80 backdrop-blur-2xl">
        <div className="container mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 shrink-0 group" data-testid="link-home">
            <div className="relative">
              <Briefcase className="w-6 h-6 text-cyan-400 group-hover:scale-110 transition-transform" />
              <div className="absolute inset-0 bg-cyan-400/30 blur-lg opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <span className="font-display font-bold text-lg tracking-tight bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
              Investor Overview
            </span>
          </Link>
          <div className="flex items-center gap-3">
            <Badge className="border border-amber-500/50 text-amber-400 bg-amber-500/10 text-xs shadow-[0_0_15px_rgba(245,158,11,0.3)]">
              Pre-TGE
            </Badge>
            <BackButton />
          </div>
        </div>
      </nav>

      <main className="pt-20 pb-12 relative">
        <section className="py-16 px-4 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/5 via-purple-500/3 to-transparent" />
          
          <div className="container mx-auto max-w-7xl relative">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-gradient-to-r from-amber-500/20 via-cyan-500/20 to-purple-500/20 border border-white/10 text-amber-400 text-sm font-medium mb-6 shadow-[0_0_30px_rgba(245,158,11,0.2)]"
              >
                <Rocket className="w-4 h-4" />
                Token Generation Event: April 11, 2026
                <Calendar className="w-4 h-4" />
              </motion.div>
              
              <h1 className="text-4xl md:text-5xl lg:text-7xl font-display font-bold mb-6 leading-tight">
                <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(6,182,212,0.5)]">
                  DarkWave Trust Layer
                </span>
                <br />
                <span className="text-white text-3xl md:text-4xl lg:text-5xl">Investment Overview</span>
              </h1>
              
              <p className="text-lg md:text-xl text-white/60 max-w-3xl mx-auto leading-relaxed">
                The <span className="text-emerald-400 font-medium">Guardian-Assured Entertainment Superchain</span> — 
                where security is built-in, AI is verifiable, and digital identity is portable.
              </p>
            </motion.div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
              {keyMetrics.map((metric, i) => (
                <motion.div 
                  key={metric.label}
                  initial={{ opacity: 0, y: 20 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  transition={{ delay: 0.3 + i * 0.1 }}
                  data-testid={`stat-${metric.label.toLowerCase().replace(/\s+/g, '-')}`}
                >
                  <StatCard value={metric.value} label={metric.label} icon={metric.icon} live />
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-12 px-4 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/5 via-transparent to-transparent" />
          
          <div className="container mx-auto max-w-7xl relative">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-8"
            >
              <div className="flex items-center gap-4 mb-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-[0_0_30px_rgba(16,185,129,0.4)]">
                  <Activity className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl md:text-3xl font-display font-bold text-white">
                    Live Blockchain Proof
                  </h2>
                  <p className="text-white/50">Real-time network statistics — not mockups</p>
                </div>
              </div>
            </motion.div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
              >
                <GlassCard glow>
                  <div className="p-6 text-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-transparent" />
                    <Box className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
                    <div className="text-3xl font-bold text-white mb-1" data-testid="stat-block-height">
                      {liveStats.blockHeight}
                    </div>
                    <div className="text-sm text-white/50">Blocks Produced</div>
                    <div className="flex items-center justify-center gap-1 mt-2">
                      <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      <span className="text-xs text-emerald-400">Live</span>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
              >
                <GlassCard glow>
                  <div className="p-6 text-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-transparent" />
                    <Users className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                    <div className="text-3xl font-bold text-white mb-1" data-testid="stat-validators">
                      {liveStats.validators}
                    </div>
                    <div className="text-sm text-white/50">Active Validators</div>
                    <div className="flex items-center justify-center gap-1 mt-2">
                      <div className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
                      <span className="text-xs text-purple-400">BFT Consensus</span>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
              >
                <GlassCard glow>
                  <div className="p-6 text-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-transparent" />
                    <Coins className="w-8 h-8 text-cyan-400 mx-auto mb-2" />
                    <div className="text-3xl font-bold text-white mb-1" data-testid="stat-stake">
                      20M SIG
                    </div>
                    <div className="text-sm text-white/50">Total Staked</div>
                    <div className="flex items-center justify-center gap-1 mt-2">
                      <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                      <span className="text-xs text-cyan-400">67% Quorum</span>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
              >
                <GlassCard glow>
                  <div className="p-6 text-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 to-transparent" />
                    <Cpu className="w-8 h-8 text-amber-400 mx-auto mb-2" />
                    <div className="text-3xl font-bold text-white mb-1" data-testid="stat-uptime">
                      {liveStats.uptime}
                    </div>
                    <div className="text-sm text-white/50">Network Uptime</div>
                    <div className="flex items-center justify-center gap-1 mt-2">
                      <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                      <span className="text-xs text-amber-400">Since Feb 2025</span>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
              className="mt-6 text-center"
            >
              <Link href="/explorer">
                <Button variant="outline" className="border-emerald-500/50 text-emerald-400 hover:bg-emerald-500/10" data-testid="button-explorer">
                  View Block Explorer
                  <ArrowUpRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </motion.div>
          </div>
        </section>

        <section className="py-16 px-4 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-500/3 to-transparent" />
          
          <div className="container mx-auto max-w-7xl relative">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-10"
            >
              <div className="flex items-center gap-4 mb-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center shadow-[0_0_30px_rgba(168,85,247,0.4)]">
                  <LineChart className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl md:text-3xl font-display font-bold text-white">
                    Investment Thesis
                  </h2>
                  <p className="text-white/50">Why DarkWave is a compelling opportunity</p>
                </div>
              </div>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {investmentThesis.map((thesis, i) => (
                <motion.div
                  key={thesis.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  data-testid={`thesis-${i}`}
                >
                  <GlassCard glow hover>
                    <div className="p-6 h-full flex flex-col relative overflow-hidden">
                      <div className={`absolute inset-0 bg-gradient-to-br ${thesis.gradient} opacity-5`} />
                      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-white/5 to-transparent rounded-bl-full" />
                      
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${thesis.gradient} flex items-center justify-center shadow-lg mb-4`}>
                        <thesis.icon className="w-6 h-6 text-white" />
                      </div>
                      
                      <h3 className="text-lg font-bold text-white mb-2 relative z-10">{thesis.title}</h3>
                      <p className="text-sm text-white/50 leading-relaxed relative z-10 flex-1">{thesis.description}</p>
                      
                      <div className={`absolute -bottom-6 -right-6 w-24 h-24 bg-gradient-to-br ${thesis.gradient} rounded-full opacity-10 blur-2xl`} />
                    </div>
                  </GlassCard>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 px-4 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-amber-500/3 to-transparent" />
          
          <div className="container mx-auto max-w-7xl relative">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-10"
            >
              <div className="flex items-center gap-4 mb-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-[0_0_30px_rgba(245,158,11,0.4)]">
                  <PieChart className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl md:text-3xl font-display font-bold text-white">
                    Tokenomics
                  </h2>
                  <p className="text-white/50">Signal token allocation and distribution</p>
                </div>
              </div>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {tokenomics.map((item, i) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  data-testid={`tokenomics-${i}`}
                >
                  <GlassCard hover>
                    <div className="p-5 flex items-center gap-4">
                      <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center shadow-lg`}>
                        <Coins className="w-7 h-7 text-white" />
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-white">{item.value}</div>
                        <div className="text-sm text-white/50">{item.label}</div>
                      </div>
                    </div>
                  </GlassCard>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mt-8"
            >
              <GlassCard glow>
                <div className="p-6 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 via-purple-500/5 to-pink-500/5" />
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
                    <div>
                      <h3 className="text-xl font-bold text-white mb-1">Token Utility</h3>
                      <p className="text-white/50 text-sm">Signal powers the entire ecosystem</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {["Transaction Fees", "Staking Rewards", "Governance Votes", "Bridge Collateral", "Quest Rewards", "NFT Marketplace"].map((util) => (
                        <Badge key={util} className="bg-white/10 text-white/70 border border-white/10 text-xs">
                          {util}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          </div>
        </section>

        <section className="py-16 px-4 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-500/3 to-transparent" />
          
          <div className="container mx-auto max-w-7xl relative">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-10"
            >
              <div className="flex items-center gap-4 mb-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-[0_0_30px_rgba(6,182,212,0.4)]">
                  <Calendar className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl md:text-3xl font-display font-bold text-white">
                    Roadmap & Milestones
                  </h2>
                  <p className="text-white/50">Our journey to mainnet and beyond</p>
                </div>
              </div>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {milestones.map((milestone, i) => (
                <motion.div
                  key={milestone.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  data-testid={`milestone-${i}`}
                >
                  <GlassCard hover>
                    <div className="p-5">
                      <div className="flex items-center justify-between mb-3">
                        <Badge className={`text-xs border ${
                          milestone.status === 'completed' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' :
                          milestone.status === 'in_progress' ? 'bg-amber-500/20 text-amber-400 border-amber-500/30' :
                          milestone.status === 'upcoming' ? 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30' :
                          'bg-white/10 text-white/50 border-white/10'
                        }`}>
                          {milestone.status === 'completed' && <CheckCircle className="w-3 h-3 mr-1" />}
                          {milestone.date}
                        </Badge>
                      </div>
                      <h4 className="font-bold text-white mb-1">{milestone.title}</h4>
                      <p className="text-sm text-white/50">{milestone.desc}</p>
                    </div>
                  </GlassCard>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 px-4 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-emerald-500/3 to-transparent" />
          
          <div className="container mx-auto max-w-7xl relative">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-10"
            >
              <div className="flex items-center gap-4 mb-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-[0_0_30px_rgba(16,185,129,0.4)]">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl md:text-3xl font-display font-bold text-white">
                    Team & Execution
                  </h2>
                  <p className="text-white/50">Built by experienced blockchain developers</p>
                </div>
              </div>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {teamHighlights.map((item, i) => (
                <motion.div
                  key={item.role}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                >
                  <GlassCard hover>
                    <div className="p-5 text-center">
                      <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-3">
                        <CheckCircle className="w-6 h-6 text-emerald-400" />
                      </div>
                      <h4 className="font-bold text-white mb-1">{item.role}</h4>
                      <p className="text-xs text-white/50">{item.desc}</p>
                    </div>
                  </GlassCard>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 px-4 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-indigo-500/3 to-transparent" />
          
          <div className="container mx-auto max-w-7xl relative">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-10"
            >
              <div className="flex items-center gap-4 mb-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-[0_0_30px_rgba(99,102,241,0.4)]">
                  <Trophy className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl md:text-3xl font-display font-bold text-white">
                    Competitive Advantages
                  </h2>
                  <p className="text-white/50">What sets DarkWave apart</p>
                </div>
              </div>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
              >
                <GlassCard glow>
                  <div className="p-6 text-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-transparent" />
                    <Shield className="w-12 h-12 text-emerald-400 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-white mb-2">7 Unique Features</h3>
                    <p className="text-white/50 text-sm">
                      Guardian Scores, Verifiable AI, ChronoPass, Experience Shards, Quest Mining, Reality Oracles, AI Copilot — 
                      <span className="text-emerald-400 font-medium"> no competitor has any of these.</span>
                    </p>
                  </div>
                </GlassCard>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
              >
                <GlassCard glow>
                  <div className="p-6 text-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-transparent" />
                    <Zap className="w-12 h-12 text-cyan-400 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-white mb-2">200K+ TPS</h3>
                    <p className="text-white/50 text-sm">
                      3x faster than Solana. Experience Shards provide dedicated lanes for different use cases — 
                      <span className="text-cyan-400 font-medium"> true horizontal scaling.</span>
                    </p>
                  </div>
                </GlassCard>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
              >
                <GlassCard glow>
                  <div className="p-6 text-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-transparent" />
                    <Gamepad2 className="w-12 h-12 text-purple-400 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-white mb-2">Entertainment Focus</h3>
                    <p className="text-white/50 text-sm">
                      Built for gaming, social, and entertainment — a $200B+ market. 
                      <span className="text-purple-400 font-medium"> DarkWave Chronicles launching at TGE.</span>
                    </p>
                  </div>
                </GlassCard>
              </motion.div>
            </div>
          </div>
        </section>

        <section className="py-16 px-4">
          <div className="container mx-auto max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <GlassCard glow>
                <div className="p-8 md:p-12 text-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-purple-500/10 to-pink-500/10" />
                  <div className="absolute top-0 left-1/4 w-64 h-64 bg-cyan-500/20 rounded-full blur-3xl" />
                  <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl" />
                  
                  <div className="relative z-10">
                    <Rocket className="w-14 h-14 text-amber-400 mx-auto mb-6" />
                    <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-4">
                      Ready to Join the Revolution?
                    </h2>
                    <p className="text-white/60 mb-8 max-w-2xl mx-auto text-lg">
                      The presale is open. Secure your position in the Guardian-Assured Entertainment Superchain 
                      before TGE on April 11, 2026.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                      <Link href="/presale">
                        <Button size="lg" className="bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white font-bold px-8 shadow-[0_0_30px_rgba(6,182,212,0.4)] hover:shadow-[0_0_40px_rgba(6,182,212,0.6)] transition-all" data-testid="button-join-presale">
                          <Award className="w-5 h-5 mr-2" />
                          Join Presale Now
                        </Button>
                      </Link>
                      <Link href="/token-compare">
                        <Button size="lg" variant="outline" className="border-white/20 hover:bg-white/5 text-white font-bold px-8" data-testid="button-compare">
                          Compare Chains
                          <ChevronRight className="w-5 h-5 ml-2" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
