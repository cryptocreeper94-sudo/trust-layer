import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import {
  Shield,
  Activity,
  Users,
  Layers,
  Target,
  Cpu,
  Brain,
  Globe,
  Sparkles,
  TrendingUp,
  Zap,
  Award,
  Lock,
  ChevronRight,
  Server,
  Code,
  Gamepad2,
  BarChart3,
  Timer,
  CheckCircle,
  AlertTriangle,
  Star,
  Hexagon
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { GlassCard, StatCard, FeatureCard } from "@/components/glass-card";


const GlowOrb = ({ color, size, top, left, delay = 0 }: { color: string; size: number; top: string; left: string; delay?: number }) => (
  <motion.div
    className="absolute rounded-full blur-3xl opacity-20 pointer-events-none"
    style={{ background: color, width: size, height: size, top, left }}
    animate={{ scale: [1, 1.2, 1], opacity: [0.15, 0.25, 0.15] }}
    transition={{ duration: 8, repeat: Infinity, delay }}
  />
);

export default function InnovationHub() {
  const { data: shards } = useQuery({
    queryKey: ["/api/shards"],
    queryFn: async () => {
      const res = await fetch("/api/shards");
      return res.json();
    }
  });

  const { data: quests } = useQuery({
    queryKey: ["/api/quests"],
    queryFn: async () => {
      const res = await fetch("/api/quests");
      return res.json();
    }
  });

  const { data: oracles } = useQuery({
    queryKey: ["/api/oracles"],
    queryFn: async () => {
      const res = await fetch("/api/oracles");
      return res.json();
    }
  });

  const { data: aiModels } = useQuery({
    queryKey: ["/api/ai/models"],
    queryFn: async () => {
      const res = await fetch("/api/ai/models");
      return res.json();
    }
  });

  const { data: seasons } = useQuery({
    queryKey: ["/api/quests/seasons"],
    queryFn: async () => {
      const res = await fetch("/api/quests/seasons");
      return res.json();
    }
  });

  const { data: networkStats } = useQuery({
    queryKey: ["/api/shards/stats/network"],
    queryFn: async () => {
      const res = await fetch("/api/shards/stats/network");
      return res.json();
    }
  });

  const innovationFeatures = [
    {
      id: "guardian-scores",
      title: "Guardian Security Scores",
      description: "Real-time security ratings for every project with insurance eligibility",
      icon: Shield,
      gradient: "from-emerald-500 to-teal-600",
      href: "/guardian-portal",
      stats: "Trust verified",
      size: "large"
    },
    {
      id: "chronopass",
      title: "ChronoPass Identity",
      description: "Unified cross-app identity with reputation scoring and passkey login",
      icon: Users,
      gradient: "from-purple-500 to-pink-600",
      href: "/profile",
      stats: "One identity, all apps",
      size: "medium"
    },
    {
      id: "experience-shards",
      title: "Experience Shards",
      description: "Dedicated execution lanes for gaming, DeFi, and NFTs with guaranteed SLAs",
      icon: Layers,
      gradient: "from-cyan-500 to-blue-600",
      href: "#shards",
      stats: `${shards?.shards?.length || 6} active shards`,
      size: "medium"
    },
    {
      id: "quest-mining",
      title: "Quest Mining",
      description: "Earn Shells and Signal through verifiable contributions",
      icon: Target,
      gradient: "from-amber-500 to-orange-600",
      href: "/quests",
      stats: `${quests?.quests?.length || 8} active quests`,
      size: "small"
    },
    {
      id: "reality-oracles",
      title: "Reality Oracles",
      description: "On-chain notarization for game outcomes",
      icon: Globe,
      gradient: "from-indigo-500 to-violet-600",
      href: "#oracles",
      stats: `${oracles?.oracles?.length || 5} oracles`,
      size: "small"
    },
    {
      id: "ai-verification",
      title: "AI Verified Execution",
      description: "Cryptographic proofs that AI decisions are fair and verifiable",
      icon: Brain,
      gradient: "from-pink-500 to-rose-600",
      href: "#ai-proofs",
      stats: "Zero-knowledge AI",
      size: "medium"
    },
    {
      id: "studio-copilot",
      title: "Guardian Studio Copilot",
      description: "AI-powered smart contract generator with automatic security audits",
      icon: Code,
      gradient: "from-lime-500 to-green-600",
      href: "/studio",
      stats: "Generate & audit",
      size: "large"
    }
  ];

  return (
    <div className="min-h-screen relative overflow-hidden pt-20 pb-12" style={{ background: "linear-gradient(180deg, #070b16, #0c1222, #070b16)" }}>
      <GlowOrb color="linear-gradient(135deg, #06b6d4, #3b82f6)" size={500} top="-5%" left="60%" />
      <GlowOrb color="linear-gradient(135deg, #8b5cf6, #ec4899)" size={400} top="40%" left="-10%" delay={3} />
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-cyan-900/20 via-black to-black pointer-events-none" />
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-purple-900/15 via-transparent to-transparent pointer-events-none" />
      
      <div className="fixed top-32 left-16 w-96 h-96 rounded-full bg-cyan-500/8 blur-[120px] animate-pulse pointer-events-none" />
      <div className="fixed top-64 right-24 w-80 h-80 rounded-full bg-purple-500/10 blur-[100px] animate-pulse pointer-events-none" style={{ animationDelay: '1s' }} />
      <div className="fixed bottom-32 left-1/3 w-72 h-72 rounded-full bg-pink-500/8 blur-[90px] animate-pulse pointer-events-none" style={{ animationDelay: '2s' }} />
      <div className="fixed bottom-48 right-1/4 w-64 h-64 rounded-full bg-emerald-500/6 blur-[80px] animate-pulse pointer-events-none" style={{ animationDelay: '3s' }} />
<main className="pt-20 pb-12 relative">
        <section className="py-16 px-4 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/5 via-purple-500/3 to-transparent" />
          
          <div className="container mx-auto max-w-7xl relative">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="text-center mb-16"
            >
              <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-gradient-to-r from-cyan-500/20 via-purple-500/20 to-pink-500/20 border border-white/10 text-cyan-400 text-sm font-medium mb-6 shadow-[0_0_30px_rgba(6,182,212,0.2)]"
              >
                <Zap className="w-4 h-4 animate-pulse" />
                Next-Generation Blockchain Innovation
                <Sparkles className="w-4 h-4" />
              </motion.div>
              
              <h1 className="text-4xl md:text-5xl lg:text-7xl font-display font-bold mb-6 leading-tight">
                <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(6,182,212,0.5)]">
                  The Guardian-Assured
                </span>
                <br />
                <span className="text-white">Entertainment Superchain</span>
              </h1>
              
              <p className="text-lg md:text-xl text-white/60 max-w-3xl mx-auto leading-relaxed">
                Where security is <span className="text-emerald-400 font-medium">built-in</span>, 
                AI is <span className="text-pink-400 font-medium">verifiable</span>, 
                and your digital identity is <span className="text-purple-400 font-medium">portable</span> across all experiences
              </p>
            </motion.div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                <StatCard 
                  value={networkStats?.totalTps?.toLocaleString() || "194,000"} 
                  label="Total TPS" 
                  icon={Activity}
                  live
                />
              </motion.div>
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
                <StatCard 
                  value={`${shards?.shards?.length || 6}`}
                  label="Active Shards" 
                  icon={Layers}
                  live
                />
              </motion.div>
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
                <StatCard 
                  value={`${aiModels?.models?.length || 4}`}
                  label="AI Models" 
                  icon={Brain}
                />
              </motion.div>
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
                <StatCard 
                  value={seasons?.seasons?.[0]?.totalPrizePoolDwc ? `${parseInt(seasons.seasons[0].totalPrizePoolDwc).toLocaleString()}` : "100,000"}
                  label="SIG Prize Pool" 
                  icon={Award}
                />
              </motion.div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 auto-rows-[minmax(180px,auto)]">
              {innovationFeatures.map((feature, i) => (
                <motion.div
                  key={feature.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * i, duration: 0.5 }}
                  className={`
                    ${feature.size === 'large' ? 'md:col-span-2 md:row-span-2' : ''}
                    ${feature.size === 'medium' ? 'md:col-span-1 md:row-span-2' : ''}
                    ${feature.size === 'small' ? 'md:col-span-1 md:row-span-1' : ''}
                  `}
                  data-testid={`feature-card-${feature.id}`}
                >
                  <Link href={feature.href}>
                    <GlassCard glow className="h-full cursor-pointer">
                      <div className="p-6 h-full flex flex-col relative overflow-hidden">
                        <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-5 group-hover:opacity-10 transition-opacity`} />
                        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/5 to-transparent rounded-bl-full opacity-50" />
                        
                        <div className="flex items-start justify-between mb-4 relative z-10">
                          <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:shadow-[0_0_30px_rgba(255,255,255,0.2)] transition-all duration-300`}>
                            <feature.icon className="w-7 h-7 text-white" />
                          </div>
                          <ChevronRight className="w-5 h-5 text-white/30 group-hover:text-white/80 group-hover:translate-x-1 transition-all" />
                        </div>
                        
                        <div className="flex-1 relative z-10">
                          <h3 className="text-xl font-bold text-white mb-2 group-hover:text-cyan-300 transition-colors">
                            {feature.title}
                          </h3>
                          <p className="text-sm text-white/50 leading-relaxed mb-4">{feature.description}</p>
                        </div>
                        
                        <div className="flex items-center gap-2 mt-auto relative z-10">
                          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                          <span className="text-xs text-white/40 font-medium">{feature.stats}</span>
                        </div>
                        
                        <div className={`absolute -bottom-8 -right-8 w-32 h-32 bg-gradient-to-br ${feature.gradient} rounded-full opacity-10 blur-2xl group-hover:opacity-20 transition-opacity`} />
                      </div>
</Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section id="shards" className="py-16 px-4 relative">
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
                  <Layers className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl md:text-3xl font-display font-bold text-white">
                    Experience Shards Network
                  </h2>
                  <p className="text-white/50">Dedicated execution lanes with guaranteed performance SLAs</p>
                </div>
              </div>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {shards?.shards?.map((shard: any, i: number) => (
                <motion.div
                  key={shard.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  data-testid={`shard-${shard.id}`}
                >
                  <GlassCard hover>
                    <div className="p-5">
                      <div className="flex items-center justify-between mb-5">
                        <div className="flex items-center gap-3">
                          <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-lg ${
                            shard.shardType === 'gaming' ? 'bg-gradient-to-br from-purple-500 to-pink-600' :
                            shard.shardType === 'defi' ? 'bg-gradient-to-br from-emerald-500 to-teal-600' :
                            shard.shardType === 'nft' ? 'bg-gradient-to-br from-pink-500 to-rose-600' :
                            shard.shardType === 'ai' ? 'bg-gradient-to-br from-cyan-500 to-blue-600' :
                            shard.shardType === 'social' ? 'bg-gradient-to-br from-amber-500 to-orange-600' :
                            'bg-gradient-to-br from-slate-500 to-slate-600'
                          }`}>
                            {shard.shardType === 'gaming' ? <Gamepad2 className="w-6 h-6 text-white" /> :
                             shard.shardType === 'defi' ? <TrendingUp className="w-6 h-6 text-white" /> :
                             shard.shardType === 'ai' ? <Brain className="w-6 h-6 text-white" /> :
                             shard.shardType === 'social' ? <Users className="w-6 h-6 text-white" /> :
                             <Server className="w-6 h-6 text-white" />}
                          </div>
                          <div>
                            <h4 className="font-bold text-white">{shard.name}</h4>
                            <span className="text-xs text-white/40 capitalize">{shard.shardType} Shard</span>
                          </div>
                        </div>
                        <Badge className={`${shard.status === 'active' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' : 'bg-amber-500/20 text-amber-400 border-amber-500/30'} border`}>
                          {shard.status}
                        </Badge>
                      </div>
                      
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-white/50">Throughput</span>
                          <span className="text-lg font-bold text-white font-mono">{shard.currentTps.toLocaleString()} TPS</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-white/50">Latency</span>
                          <span className="text-white font-mono flex items-center gap-2">
                            <Timer className="w-4 h-4 text-cyan-400" />
                            {shard.currentLatencyMs}ms
                          </span>
                        </div>
                        <div>
                          <div className="flex justify-between text-sm mb-2">
                            <span className="text-white/50">Load</span>
                            <span className="text-white font-mono">{shard.currentLoad}%</span>
                          </div>
                          <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                            <motion.div 
                              initial={{ width: 0 }}
                              whileInView={{ width: `${shard.currentLoad}%` }}
                              viewport={{ once: true }}
                              transition={{ duration: 1, ease: "easeOut" }}
                              className={`h-full rounded-full ${
                                shard.currentLoad > 80 ? 'bg-gradient-to-r from-red-500 to-orange-500' :
                                shard.currentLoad > 50 ? 'bg-gradient-to-r from-amber-500 to-yellow-500' :
                                'bg-gradient-to-r from-emerald-500 to-cyan-500'
                              }`}
                            />
                          </div>
                        </div>
                        <div className="flex justify-between text-xs text-white/30 pt-3 border-t border-white/5">
                          <span className="flex items-center gap-1">
                            <CheckCircle className="w-3 h-3 text-emerald-400" />
                            {shard.guaranteedUptime}% Uptime
                          </span>
                          <span className="capitalize">{shard.priorityLevel} Priority</span>
                        </div>
                      </div>
                    </div>
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
                  <Target className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl md:text-3xl font-display font-bold text-white">
                    Quest Mining
                  </h2>
                  <p className="text-white/50">Complete quests to earn Shells and Signal rewards</p>
                </div>
              </div>
            </motion.div>

            {seasons?.seasons?.[0] && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="mb-8"
              >
                <GlassCard glow>
                  <div className="p-6 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-pink-500/10" />
                    <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-amber-500/20 to-transparent rounded-full blur-3xl" />
                    
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
                      <div>
                        <Badge className="bg-amber-500/20 text-amber-400 border border-amber-500/30 mb-3 shadow-[0_0_15px_rgba(245,158,11,0.3)]">
                          <Star className="w-3 h-3 mr-1" />
                          Active Season
                        </Badge>
                        <h3 className="text-2xl font-bold text-white">{seasons.seasons[0].name}</h3>
                        <p className="text-white/50 mt-1">{seasons.seasons[0].description}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-3xl font-bold bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">
                          {parseInt(seasons.seasons[0].totalPrizePoolDwc || '0').toLocaleString()} SIG
                        </div>
                        <div className="text-sm text-white/40">Total Prize Pool</div>
                      </div>
                    </div>
                  </div>
</motion.div>
            )}

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {quests?.quests?.slice(0, 8).map((quest: any, i: number) => (
                <motion.div
                  key={quest.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  data-testid={`quest-${quest.id}`}
                >
                  <GlassCard hover>
                    <div className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <Badge className={`text-xs border ${
                          quest.difficultyLevel === 'easy' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' :
                          quest.difficultyLevel === 'medium' ? 'bg-amber-500/20 text-amber-400 border-amber-500/30' :
                          quest.difficultyLevel === 'hard' ? 'bg-orange-500/20 text-orange-400 border-orange-500/30' :
                          'bg-purple-500/20 text-purple-400 border-purple-500/30'
                        }`}>
                          {quest.difficultyLevel}
                        </Badge>
                        <Badge variant="outline" className="text-xs text-white/40 border-white/10">{quest.questType}</Badge>
                      </div>
                      <h4 className="font-bold text-white text-sm mb-2">{quest.title}</h4>
                      <p className="text-xs text-white/40 mb-4 line-clamp-2">{quest.description}</p>
                      <div className="flex flex-wrap items-center gap-2">
                        {quest.shellsReward > 0 && (
                          <span className="text-xs bg-pink-500/20 text-pink-400 px-2 py-1 rounded-full border border-pink-500/20">
                            +{quest.shellsReward} Shells
                          </span>
                        )}
                        {quest.reputationReward > 0 && (
                          <span className="text-xs bg-cyan-500/20 text-cyan-400 px-2 py-1 rounded-full border border-cyan-500/20">
                            +{quest.reputationReward} Rep
                          </span>
                        )}
                      </div>
                    </div>
</motion.div>
              ))}
            </div>
          </div>
        </section>

        <section id="oracles" className="py-16 px-4 relative">
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
                  <Globe className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl md:text-3xl font-display font-bold text-white">
                    Reality Layer Oracles
                  </h2>
                  <p className="text-white/50">On-chain notarization for verifiable truth</p>
                </div>
              </div>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {oracles?.oracles?.map((oracle: any, i: number) => (
                <motion.div
                  key={oracle.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  data-testid={`oracle-${oracle.id}`}
                >
                  <GlassCard hover>
                    <div className="p-5">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500/30 to-violet-600/30 border border-indigo-500/20 flex items-center justify-center">
                          <Globe className="w-6 h-6 text-indigo-400" />
                        </div>
                        <div>
                          <h4 className="font-bold text-white">{oracle.name}</h4>
                          <span className="text-xs text-white/40 capitalize">{oracle.oracleType.replace('_', ' ')}</span>
                        </div>
                      </div>
                      <p className="text-sm text-white/50 mb-4">{oracle.description}</p>
                      <div className="flex items-center justify-between text-xs pt-3 border-t border-white/5">
                        <span className="text-white/30">Source: {oracle.sourceType}</span>
                        <span className="text-emerald-400 flex items-center gap-1">
                          <CheckCircle className="w-3 h-3" />
                          {oracle.reliability}% uptime
                        </span>
                      </div>
                    </div>
</motion.div>
              ))}
            </div>
          </div>
        </section>

        <section id="ai-proofs" className="py-16 px-4 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-pink-500/3 to-transparent" />
          
          <div className="container mx-auto max-w-7xl relative">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-10"
            >
              <div className="flex items-center gap-4 mb-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center shadow-[0_0_30px_rgba(236,72,153,0.4)]">
                  <Brain className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl md:text-3xl font-display font-bold text-white">
                    AI Verified Execution
                  </h2>
                  <p className="text-white/50">Cryptographic proofs for transparent AI decisions</p>
                </div>
              </div>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-6">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <GlassCard glow>
                  <div className="p-6 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-pink-500/10 to-purple-500/10" />
                    
                    <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3 relative z-10">
                      <Lock className="w-5 h-5 text-pink-400" />
                      How It Works
                    </h3>
                    <div className="space-y-5 relative z-10">
                      {[
                        { step: 1, title: "Input Hashing", desc: "AI inputs are cryptographically hashed before processing", icon: Hexagon },
                        { step: 2, title: "Execution Proof", desc: "Model generates verifiable commitment of its decision", icon: Code },
                        { step: 3, title: "On-Chain Anchor", desc: "Proof is permanently recorded on Trust Layer", icon: Layers },
                        { step: 4, title: "Public Verification", desc: "Anyone can verify the AI decision was fair and correct", icon: CheckCircle }
                      ].map((item, i) => (
                        <motion.div 
                          key={item.step} 
                          initial={{ opacity: 0, x: -10 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: i * 0.1 }}
                          className="flex gap-4 group"
                        >
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm shrink-0 shadow-lg group-hover:scale-110 transition-transform">
                            {item.step}
                          </div>
                          <div>
                            <h4 className="font-bold text-white text-sm flex items-center gap-2">
                              {item.title}
                              <item.icon className="w-4 h-4 text-pink-400/50" />
                            </h4>
                            <p className="text-xs text-white/40 mt-1">{item.desc}</p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
</motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <Cpu className="w-5 h-5 text-pink-400" />
                  Registered AI Models
                </h3>
                <div className="space-y-3">
                  {aiModels?.models?.map((model: any, i: number) => (
                    <motion.div
                      key={model.id}
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 }}
                    >
                      <GlassCard hover>
                        <div className="p-4 flex items-center justify-between" data-testid={`ai-model-${model.modelId}`}>
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-500/20 to-purple-500/20 border border-pink-500/20 flex items-center justify-center">
                              <Brain className="w-6 h-6 text-pink-400" />
                            </div>
                            <div>
                              <h4 className="font-bold text-white">{model.modelName}</h4>
                              <span className="text-xs text-white/40">{model.provider}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {model.verified && (
                              <Badge className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs shadow-[0_0_10px_rgba(16,185,129,0.2)]">
                                <CheckCircle className="w-3 h-3 mr-1" />
                                Verified
                              </Badge>
                            )}
                          </div>
                        </div>
</motion.div>
                  ))}
                </div>
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
                    <Sparkles className="w-14 h-14 text-cyan-400 mx-auto mb-6 animate-pulse" />
                    <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-4">
                      Ready to Experience the Future?
                    </h2>
                    <p className="text-white/60 mb-8 max-w-2xl mx-auto text-lg">
                      Join thousands of innovators building on the most advanced blockchain infrastructure
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                      <Link href="/studio">
                        <Button size="lg" className="bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white font-bold px-8 shadow-[0_0_30px_rgba(6,182,212,0.4)] hover:shadow-[0_0_40px_rgba(6,182,212,0.6)] transition-all" data-testid="button-start-building">
                          <Code className="w-5 h-5 mr-2" />
                          Start Building
                        </Button>
                      </Link>
                      <Link href="/developers">
                        <Button size="lg" variant="outline" className="border-white/20 hover:bg-white/5 text-white font-bold px-8" data-testid="button-read-docs">
                          Read Documentation
                          <ChevronRight className="w-5 h-5 ml-2" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
</motion.div>
          </div>
        </section>
      </main>

      
    </div>
  );
}
