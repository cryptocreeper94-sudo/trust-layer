import { motion } from "framer-motion";
import { Link } from "wouter";
import {
  Shield,
  Zap,
  Users,
  Brain,
  Layers,
  Globe,
  CheckCircle,
  X,
  Minus,
  TrendingUp,
  Clock,
  DollarSign,
  Lock,
  Gamepad2,
  Code,
  Target,
  Award,
  ChevronRight,
  Sparkles,
  BarChart3,
  Star,
  Trophy,
  Cpu,
  Network
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BackButton } from "@/components/page-nav";
import { Footer } from "@/components/footer";
import { GlassCard, StatCard } from "@/components/glass-card";

const competitors = [
  {
    name: "DarkWave",
    logo: "🌊",
    color: "from-cyan-500 to-purple-600",
    highlight: true,
    tps: "200,000+",
    finality: "400ms",
    consensus: "PoA + Shards",
    securityScore: true,
    verifiableAI: true,
    unifiedIdentity: true,
    experienceShards: true,
    questMining: true,
    realityOracles: true,
    aiCopilot: true,
    crossChainBridge: true,
    nftMarketplace: true,
    liquidStaking: true,
    dex: true,
    gasless: "Optional",
    launchDate: "Feb 2026"
  },
  {
    name: "Solana",
    logo: "◎",
    color: "from-purple-500 to-green-500",
    highlight: false,
    tps: "65,000",
    finality: "400ms",
    consensus: "PoH + PoS",
    securityScore: false,
    verifiableAI: false,
    unifiedIdentity: false,
    experienceShards: false,
    questMining: false,
    realityOracles: false,
    aiCopilot: false,
    crossChainBridge: true,
    nftMarketplace: true,
    liquidStaking: true,
    dex: true,
    gasless: "No",
    launchDate: "Mar 2020"
  },
  {
    name: "Avalanche",
    logo: "🔺",
    color: "from-red-500 to-red-600",
    highlight: false,
    tps: "4,500",
    finality: "2s",
    consensus: "Snowball",
    securityScore: false,
    verifiableAI: false,
    unifiedIdentity: false,
    experienceShards: "Subnets",
    questMining: false,
    realityOracles: false,
    aiCopilot: false,
    crossChainBridge: true,
    nftMarketplace: true,
    liquidStaking: true,
    dex: true,
    gasless: "No",
    launchDate: "Sep 2020"
  },
  {
    name: "Polygon",
    logo: "⬡",
    color: "from-purple-500 to-purple-600",
    highlight: false,
    tps: "7,000",
    finality: "2s",
    consensus: "PoS",
    securityScore: false,
    verifiableAI: false,
    unifiedIdentity: false,
    experienceShards: false,
    questMining: false,
    realityOracles: false,
    aiCopilot: false,
    crossChainBridge: true,
    nftMarketplace: true,
    liquidStaking: true,
    dex: true,
    gasless: "Partial",
    launchDate: "May 2020"
  },
  {
    name: "Arbitrum",
    logo: "🔵",
    color: "from-blue-500 to-blue-600",
    highlight: false,
    tps: "40,000",
    finality: "~1s",
    consensus: "Optimistic",
    securityScore: false,
    verifiableAI: false,
    unifiedIdentity: false,
    experienceShards: false,
    questMining: false,
    realityOracles: false,
    aiCopilot: false,
    crossChainBridge: true,
    nftMarketplace: true,
    liquidStaking: true,
    dex: true,
    gasless: "No",
    launchDate: "Aug 2021"
  }
];

const uniqueFeatures = [
  {
    title: "Guardian Security Scores",
    description: "Real-time security ratings for every project. Insurance eligibility built-in. No other chain has this.",
    icon: Shield,
    gradient: "from-emerald-500 to-teal-600",
    competitors: "0/4 competitors"
  },
  {
    title: "Verifiable AI Execution",
    description: "Cryptographic proofs that AI decisions are fair and auditable. Zero-knowledge AI on-chain.",
    icon: Brain,
    gradient: "from-pink-500 to-rose-600",
    competitors: "0/4 competitors"
  },
  {
    title: "ChronoPass Identity",
    description: "One reputation that follows you across all apps. Passkey login. Trust levels from newcomer to legend.",
    icon: Users,
    gradient: "from-purple-500 to-pink-600",
    competitors: "0/4 competitors"
  },
  {
    title: "Experience Shards",
    description: "Dedicated execution lanes for gaming, DeFi, NFTs. Each shard has guaranteed SLAs and priority.",
    icon: Layers,
    gradient: "from-cyan-500 to-blue-600",
    competitors: "1/4 (Avalanche subnets)"
  },
  {
    title: "Quest Mining",
    description: "Earn tokens by contributing to the ecosystem. Verifiable quests with on-chain rewards.",
    icon: Target,
    gradient: "from-amber-500 to-orange-600",
    competitors: "0/4 competitors"
  },
  {
    title: "Reality Layer Oracles",
    description: "On-chain notarization for game outcomes and real-world events. Multi-chain verification.",
    icon: Globe,
    gradient: "from-indigo-500 to-violet-600",
    competitors: "0/4 competitors"
  },
  {
    title: "Guardian Studio Copilot",
    description: "AI generates smart contracts AND automatically audits them. Ship secure code faster.",
    icon: Code,
    gradient: "from-lime-500 to-green-600",
    competitors: "0/4 competitors"
  }
];

function FeatureCheck({ value }: { value: boolean | string }) {
  if (value === true) {
    return <CheckCircle className="w-5 h-5 text-emerald-400" />;
  }
  if (value === false) {
    return <X className="w-5 h-5 text-red-400/50" />;
  }
  return <span className="text-xs text-amber-400">{value}</span>;
}

export default function CompetitiveAnalysis() {
  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-cyan-900/20 via-black to-black pointer-events-none" />
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-purple-900/15 via-transparent to-transparent pointer-events-none" />
      
      <div className="fixed top-32 left-16 w-96 h-96 rounded-full bg-cyan-500/8 blur-[120px] animate-pulse pointer-events-none" />
      <div className="fixed top-64 right-24 w-80 h-80 rounded-full bg-purple-500/10 blur-[100px] animate-pulse pointer-events-none" style={{ animationDelay: '1s' }} />
      <div className="fixed bottom-32 left-1/3 w-72 h-72 rounded-full bg-pink-500/8 blur-[90px] animate-pulse pointer-events-none" style={{ animationDelay: '2s' }} />
      <div className="fixed bottom-48 right-1/4 w-64 h-64 rounded-full bg-emerald-500/6 blur-[80px] animate-pulse pointer-events-none" style={{ animationDelay: '3s' }} />
      
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-black/80 backdrop-blur-2xl">
        <div className="container mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 shrink-0 group" data-testid="link-home">
            <div className="relative">
              <Trophy className="w-6 h-6 text-cyan-400 group-hover:scale-110 transition-transform" />
              <div className="absolute inset-0 bg-cyan-400/30 blur-lg opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <span className="font-display font-bold text-lg tracking-tight bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
              Why DarkWave Wins
            </span>
          </Link>
          <div className="flex items-center gap-3">
            <Badge className="border border-emerald-500/50 text-emerald-400 bg-emerald-500/10 text-xs shadow-[0_0_15px_rgba(16,185,129,0.3)]">
              #1 Choice
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
                className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-gradient-to-r from-emerald-500/20 via-cyan-500/20 to-purple-500/20 border border-white/10 text-emerald-400 text-sm font-medium mb-6 shadow-[0_0_30px_rgba(16,185,129,0.2)]"
              >
                <Star className="w-4 h-4" />
                The Only Chain With Built-In Security & AI
                <Sparkles className="w-4 h-4" />
              </motion.div>
              
              <h1 className="text-4xl md:text-5xl lg:text-7xl font-display font-bold mb-6 leading-tight">
                <span className="text-white">Why Builders Choose</span>
                <br />
                <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(6,182,212,0.5)]">
                  DarkWave Trust Layer
                </span>
              </h1>
              
              <p className="text-lg md:text-xl text-white/60 max-w-3xl mx-auto leading-relaxed">
                Other chains give you speed. We give you speed, <span className="text-emerald-400 font-medium">security</span>, 
                <span className="text-pink-400 font-medium"> verifiable AI</span>, and 
                <span className="text-purple-400 font-medium"> portable identity</span> — all built-in.
              </p>
            </motion.div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} data-testid="stat-tps">
                <StatCard value="200K+" label="TPS Capacity" icon={Zap} live />
              </motion.div>
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} data-testid="stat-finality">
                <StatCard value="400ms" label="Finality" icon={Clock} live />
              </motion.div>
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} data-testid="stat-features">
                <StatCard value="7" label="Unique Features" icon={Trophy} />
              </motion.div>
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} data-testid="stat-audits">
                <StatCard value="$0" label="AI Security Audits" icon={Shield} />
              </motion.div>
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
                  <BarChart3 className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl md:text-3xl font-display font-bold text-white">
                    Feature Comparison Matrix
                  </h2>
                  <p className="text-white/50">See how DarkWave stacks up against the competition</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <GlassCard>
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[800px]" data-testid="comparison-table">
                    <thead>
                      <tr className="border-b border-white/10">
                        <th className="text-left p-4 text-white/50 font-medium text-sm">Feature</th>
                        {competitors.map((c) => (
                          <th key={c.name} className={`p-4 text-center ${c.highlight ? 'bg-gradient-to-b from-cyan-500/10 to-transparent' : ''}`}>
                            <div className="flex flex-col items-center gap-1">
                              <span className="text-2xl">{c.logo}</span>
                              <span className={`font-bold ${c.highlight ? 'text-cyan-400' : 'text-white/70'}`}>{c.name}</span>
                              {c.highlight && (
                                <Badge className="bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 text-[10px]">
                                  Our Chain
                                </Badge>
                              )}
                            </div>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-white/5">
                        <td className="p-4 text-white/70 text-sm">TPS (Transactions/sec)</td>
                        {competitors.map((c) => (
                          <td key={c.name} className={`p-4 text-center font-mono text-sm ${c.highlight ? 'text-cyan-400 font-bold bg-cyan-500/5' : 'text-white/60'}`}>
                            {c.tps}
                          </td>
                        ))}
                      </tr>
                      <tr className="border-b border-white/5">
                        <td className="p-4 text-white/70 text-sm">Finality Time</td>
                        {competitors.map((c) => (
                          <td key={c.name} className={`p-4 text-center font-mono text-sm ${c.highlight ? 'text-cyan-400 font-bold bg-cyan-500/5' : 'text-white/60'}`}>
                            {c.finality}
                          </td>
                        ))}
                      </tr>
                      <tr className="border-b border-white/5">
                        <td className="p-4 text-white/70 text-sm">Consensus</td>
                        {competitors.map((c) => (
                          <td key={c.name} className={`p-4 text-center text-sm ${c.highlight ? 'text-cyan-400 bg-cyan-500/5' : 'text-white/60'}`}>
                            {c.consensus}
                          </td>
                        ))}
                      </tr>
                      <tr className="border-b border-white/5 bg-emerald-500/5">
                        <td className="p-4 text-emerald-400 text-sm font-medium flex items-center gap-2">
                          <Shield className="w-4 h-4" />
                          Guardian Security Scores
                        </td>
                        {competitors.map((c) => (
                          <td key={c.name} className={`p-4 text-center ${c.highlight ? 'bg-cyan-500/5' : ''}`}>
                            <div className="flex justify-center"><FeatureCheck value={c.securityScore} /></div>
                          </td>
                        ))}
                      </tr>
                      <tr className="border-b border-white/5 bg-pink-500/5">
                        <td className="p-4 text-pink-400 text-sm font-medium flex items-center gap-2">
                          <Brain className="w-4 h-4" />
                          Verifiable AI Execution
                        </td>
                        {competitors.map((c) => (
                          <td key={c.name} className={`p-4 text-center ${c.highlight ? 'bg-cyan-500/5' : ''}`}>
                            <div className="flex justify-center"><FeatureCheck value={c.verifiableAI} /></div>
                          </td>
                        ))}
                      </tr>
                      <tr className="border-b border-white/5 bg-purple-500/5">
                        <td className="p-4 text-purple-400 text-sm font-medium flex items-center gap-2">
                          <Users className="w-4 h-4" />
                          Unified Identity (ChronoPass)
                        </td>
                        {competitors.map((c) => (
                          <td key={c.name} className={`p-4 text-center ${c.highlight ? 'bg-cyan-500/5' : ''}`}>
                            <div className="flex justify-center"><FeatureCheck value={c.unifiedIdentity} /></div>
                          </td>
                        ))}
                      </tr>
                      <tr className="border-b border-white/5 bg-cyan-500/5">
                        <td className="p-4 text-cyan-400 text-sm font-medium flex items-center gap-2">
                          <Layers className="w-4 h-4" />
                          Experience Shards
                        </td>
                        {competitors.map((c) => (
                          <td key={c.name} className={`p-4 text-center ${c.highlight ? 'bg-cyan-500/5' : ''}`}>
                            <div className="flex justify-center"><FeatureCheck value={c.experienceShards} /></div>
                          </td>
                        ))}
                      </tr>
                      <tr className="border-b border-white/5 bg-amber-500/5">
                        <td className="p-4 text-amber-400 text-sm font-medium flex items-center gap-2">
                          <Target className="w-4 h-4" />
                          Quest Mining
                        </td>
                        {competitors.map((c) => (
                          <td key={c.name} className={`p-4 text-center ${c.highlight ? 'bg-cyan-500/5' : ''}`}>
                            <div className="flex justify-center"><FeatureCheck value={c.questMining} /></div>
                          </td>
                        ))}
                      </tr>
                      <tr className="border-b border-white/5 bg-indigo-500/5">
                        <td className="p-4 text-indigo-400 text-sm font-medium flex items-center gap-2">
                          <Globe className="w-4 h-4" />
                          Reality Layer Oracles
                        </td>
                        {competitors.map((c) => (
                          <td key={c.name} className={`p-4 text-center ${c.highlight ? 'bg-cyan-500/5' : ''}`}>
                            <div className="flex justify-center"><FeatureCheck value={c.realityOracles} /></div>
                          </td>
                        ))}
                      </tr>
                      <tr className="border-b border-white/5 bg-lime-500/5">
                        <td className="p-4 text-lime-400 text-sm font-medium flex items-center gap-2">
                          <Code className="w-4 h-4" />
                          AI Copilot (Auto-Audit)
                        </td>
                        {competitors.map((c) => (
                          <td key={c.name} className={`p-4 text-center ${c.highlight ? 'bg-cyan-500/5' : ''}`}>
                            <div className="flex justify-center"><FeatureCheck value={c.aiCopilot} /></div>
                          </td>
                        ))}
                      </tr>
                      <tr className="border-b border-white/5">
                        <td className="p-4 text-white/70 text-sm">Cross-Chain Bridge</td>
                        {competitors.map((c) => (
                          <td key={c.name} className={`p-4 text-center ${c.highlight ? 'bg-cyan-500/5' : ''}`}>
                            <div className="flex justify-center"><FeatureCheck value={c.crossChainBridge} /></div>
                          </td>
                        ))}
                      </tr>
                      <tr className="border-b border-white/5">
                        <td className="p-4 text-white/70 text-sm">NFT Marketplace</td>
                        {competitors.map((c) => (
                          <td key={c.name} className={`p-4 text-center ${c.highlight ? 'bg-cyan-500/5' : ''}`}>
                            <div className="flex justify-center"><FeatureCheck value={c.nftMarketplace} /></div>
                          </td>
                        ))}
                      </tr>
                      <tr className="border-b border-white/5">
                        <td className="p-4 text-white/70 text-sm">Liquid Staking</td>
                        {competitors.map((c) => (
                          <td key={c.name} className={`p-4 text-center ${c.highlight ? 'bg-cyan-500/5' : ''}`}>
                            <div className="flex justify-center"><FeatureCheck value={c.liquidStaking} /></div>
                          </td>
                        ))}
                      </tr>
                      <tr className="border-b border-white/5">
                        <td className="p-4 text-white/70 text-sm">DEX / Token Swap</td>
                        {competitors.map((c) => (
                          <td key={c.name} className={`p-4 text-center ${c.highlight ? 'bg-cyan-500/5' : ''}`}>
                            <div className="flex justify-center"><FeatureCheck value={c.dex} /></div>
                          </td>
                        ))}
                      </tr>
                      <tr>
                        <td className="p-4 text-white/70 text-sm">Gasless Transactions</td>
                        {competitors.map((c) => (
                          <td key={c.name} className={`p-4 text-center ${c.highlight ? 'bg-cyan-500/5' : ''}`}>
                            <div className="flex justify-center"><FeatureCheck value={c.gasless === "Optional" ? true : c.gasless === "Partial" ? "Partial" : false} /></div>
                          </td>
                        ))}
                      </tr>
                    </tbody>
                  </table>
                </div>
              </GlassCard>
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
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl md:text-3xl font-display font-bold text-white">
                    Features Nobody Else Has
                  </h2>
                  <p className="text-white/50">7 innovations that make DarkWave the obvious choice</p>
                </div>
              </div>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {uniqueFeatures.map((feature, i) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  data-testid={`unique-feature-${i}`}
                >
                  <GlassCard glow hover>
                    <div className="p-6 h-full flex flex-col relative overflow-hidden">
                      <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-5`} />
                      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-white/5 to-transparent rounded-bl-full" />
                      
                      <div className="flex items-start justify-between mb-4 relative z-10">
                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center shadow-lg`}>
                          <feature.icon className="w-6 h-6 text-white" />
                        </div>
                        <Badge className="bg-red-500/20 text-red-400 border border-red-500/30 text-[10px]">
                          {feature.competitors}
                        </Badge>
                      </div>
                      
                      <h3 className="text-lg font-bold text-white mb-2 relative z-10">{feature.title}</h3>
                      <p className="text-sm text-white/50 leading-relaxed relative z-10 flex-1">{feature.description}</p>
                      
                      <div className={`absolute -bottom-6 -right-6 w-24 h-24 bg-gradient-to-br ${feature.gradient} rounded-full opacity-10 blur-2xl`} />
                    </div>
                  </GlassCard>
                </motion.div>
              ))}
            </div>
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
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl md:text-3xl font-display font-bold text-white">
                    The Bottom Line
                  </h2>
                  <p className="text-white/50">Why smart builders are choosing DarkWave</p>
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
                    <h3 className="text-xl font-bold text-white mb-2">Security First</h3>
                    <p className="text-white/50 text-sm">
                      Every project gets a security score. Insurance eligibility built-in. 
                      <span className="text-emerald-400 font-medium"> $0 to audit with our AI Copilot.</span>
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
                    <div className="absolute inset-0 bg-gradient-to-br from-pink-500/10 to-transparent" />
                    <Brain className="w-12 h-12 text-pink-400 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-white mb-2">AI Native</h3>
                    <p className="text-white/50 text-sm">
                      First chain with verifiable AI proofs. 
                      <span className="text-pink-400 font-medium"> Every AI decision is auditable on-chain.</span>
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
                    <Users className="w-12 h-12 text-purple-400 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-white mb-2">One Identity</h3>
                    <p className="text-white/50 text-sm">
                      ChronoPass follows you everywhere. 
                      <span className="text-purple-400 font-medium"> Build reputation once, use it across all apps.</span>
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
                    <Trophy className="w-14 h-14 text-amber-400 mx-auto mb-6" />
                    <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-4">
                      Ready to Build on the Best?
                    </h2>
                    <p className="text-white/60 mb-8 max-w-2xl mx-auto text-lg">
                      Join the chain that doesn't just promise features — we deliver them. 
                      Token launch June 1, 2026.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                      <Link href="/presale">
                        <Button size="lg" className="bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white font-bold px-8 shadow-[0_0_30px_rgba(6,182,212,0.4)] hover:shadow-[0_0_40px_rgba(6,182,212,0.6)] transition-all" data-testid="button-join-presale">
                          <Award className="w-5 h-5 mr-2" />
                          Join Presale
                        </Button>
                      </Link>
                      <Link href="/innovation">
                        <Button size="lg" variant="outline" className="border-white/20 hover:bg-white/5 text-white font-bold px-8" data-testid="button-explore-features">
                          Explore Features
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
