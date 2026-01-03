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
  AlertTriangle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { BackButton } from "@/components/page-nav";
import { Footer } from "@/components/footer";

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

  const innovationFeatures = [
    {
      id: "guardian-scores",
      title: "Guardian Security Scores",
      description: "Real-time security ratings for every project with insurance eligibility",
      icon: Shield,
      color: "emerald",
      gradient: "from-emerald-500 to-teal-600",
      href: "/guardian-portal",
      stats: "Trust verified"
    },
    {
      id: "chronopass",
      title: "ChronoPass Identity",
      description: "Unified cross-app identity with reputation scoring and passkey login",
      icon: Users,
      color: "purple",
      gradient: "from-purple-500 to-pink-600",
      href: "/profile",
      stats: "One identity, all apps"
    },
    {
      id: "experience-shards",
      title: "Experience Shards",
      description: "Dedicated execution lanes for gaming, DeFi, and NFTs with guaranteed SLAs",
      icon: Layers,
      color: "cyan",
      gradient: "from-cyan-500 to-blue-600",
      href: "#shards",
      stats: `${shards?.shards?.length || 6} active shards`
    },
    {
      id: "quest-mining",
      title: "Quest Mining",
      description: "Earn Shells and DWC through verifiable contributions and achievements",
      icon: Target,
      color: "amber",
      gradient: "from-amber-500 to-orange-600",
      href: "/quests",
      stats: `${quests?.quests?.length || 8} active quests`
    },
    {
      id: "reality-oracles",
      title: "Reality Layer Oracles",
      description: "On-chain notarization for game outcomes and real-world events",
      icon: Globe,
      color: "indigo",
      gradient: "from-indigo-500 to-violet-600",
      href: "#oracles",
      stats: `${oracles?.oracles?.length || 5} oracles live`
    },
    {
      id: "ai-verification",
      title: "AI Verified Execution",
      description: "Cryptographic proofs that AI decisions are fair and verifiable",
      icon: Brain,
      color: "pink",
      gradient: "from-pink-500 to-rose-600",
      href: "#ai-proofs",
      stats: "Zero-knowledge AI"
    },
    {
      id: "studio-copilot",
      title: "Guardian Studio Copilot",
      description: "AI-powered smart contract generator with automatic security audits",
      icon: Code,
      color: "lime",
      gradient: "from-lime-500 to-green-600",
      href: "/studio",
      stats: "Generate & audit"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white">
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-slate-950/90 backdrop-blur-xl">
        <div className="container mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <Sparkles className="w-6 h-6 text-cyan-400" />
            <span className="font-display font-bold text-lg tracking-tight">Innovation Hub</span>
          </Link>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="border-cyan-500/50 text-cyan-400 bg-cyan-500/10 text-xs">
              Beta
            </Badge>
            <BackButton />
          </div>
        </div>
      </nav>

      <main className="pt-20 pb-12">
        <section className="py-16 px-4 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 via-purple-500/5 to-pink-500/5" />
          <div className="absolute top-20 left-20 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 right-20 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
          
          <div className="container mx-auto max-w-6xl relative">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-12"
            >
              <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-gradient-to-r from-cyan-500/20 to-purple-500/20 text-cyan-400 text-sm font-medium mb-4">
                <Zap className="w-4 h-4" />
                Next-Generation Blockchain Innovation
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-4">
                <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  The Guardian-Assured
                </span>
                <br />
                <span className="text-white">Entertainment Superchain</span>
              </h1>
              <p className="text-xl text-white/70 max-w-3xl mx-auto">
                Where security is built-in, AI is verifiable, and your digital identity is portable across all experiences
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {innovationFeatures.map((feature, i) => (
                <motion.div
                  key={feature.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ scale: 1.02, y: -4 }}
                  className="group cursor-pointer"
                  data-testid={`feature-card-${feature.id}`}
                >
                  <Link href={feature.href}>
                    <div className="h-full bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-2xl p-6 relative overflow-hidden hover:border-white/30 transition-all duration-300">
                      <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 transition-opacity`} />
                      
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                        <feature.icon className="w-6 h-6 text-white" />
                      </div>
                      
                      <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-cyan-300 transition-colors">
                        {feature.title}
                      </h3>
                      <p className="text-sm text-white/60 mb-4">{feature.description}</p>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-white/40">{feature.stats}</span>
                        <ChevronRight className="w-4 h-4 text-white/40 group-hover:text-cyan-400 group-hover:translate-x-1 transition-all" />
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section id="shards" className="py-12 px-4 bg-slate-900/50">
          <div className="container mx-auto max-w-6xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-8"
            >
              <h2 className="text-2xl md:text-3xl font-display font-bold text-white mb-2 flex items-center gap-3">
                <Layers className="w-7 h-7 text-cyan-400" />
                Experience Shards Network
              </h2>
              <p className="text-white/60">Dedicated execution lanes with guaranteed performance SLAs</p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {shards?.shards?.map((shard: any, i: number) => (
                <motion.div
                  key={shard.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-slate-800/50 border border-white/10 rounded-xl p-5"
                  data-testid={`shard-${shard.id}`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        shard.shardType === 'gaming' ? 'bg-purple-500/20 text-purple-400' :
                        shard.shardType === 'defi' ? 'bg-emerald-500/20 text-emerald-400' :
                        shard.shardType === 'nft' ? 'bg-pink-500/20 text-pink-400' :
                        shard.shardType === 'ai' ? 'bg-cyan-500/20 text-cyan-400' :
                        'bg-slate-500/20 text-slate-400'
                      }`}>
                        {shard.shardType === 'gaming' ? <Gamepad2 className="w-5 h-5" /> :
                         shard.shardType === 'defi' ? <TrendingUp className="w-5 h-5" /> :
                         shard.shardType === 'ai' ? <Brain className="w-5 h-5" /> :
                         <Server className="w-5 h-5" />}
                      </div>
                      <div>
                        <h4 className="font-semibold text-white">{shard.name}</h4>
                        <span className="text-xs text-white/50 capitalize">{shard.shardType}</span>
                      </div>
                    </div>
                    <Badge className={`${shard.status === 'active' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'}`}>
                      {shard.status}
                    </Badge>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-white/50">TPS</span>
                      <span className="text-white font-mono">{shard.currentTps.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-white/50">Latency</span>
                      <span className="text-white font-mono">{shard.currentLatencyMs}ms</span>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-white/50">Load</span>
                        <span className="text-white font-mono">{shard.currentLoad}%</span>
                      </div>
                      <Progress value={shard.currentLoad} className="h-1.5" />
                    </div>
                    <div className="flex justify-between text-xs text-white/40 pt-2 border-t border-white/5">
                      <span>Uptime: {shard.guaranteedUptime}%</span>
                      <span>Priority: {shard.priorityLevel}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-12 px-4">
          <div className="container mx-auto max-w-6xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-8"
            >
              <h2 className="text-2xl md:text-3xl font-display font-bold text-white mb-2 flex items-center gap-3">
                <Target className="w-7 h-7 text-amber-400" />
                Quest Mining
              </h2>
              <p className="text-white/60">Complete quests to earn Shells and DWC rewards</p>
            </motion.div>

            {seasons?.seasons?.[0] && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20 rounded-2xl p-6 mb-8"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <Badge className="bg-amber-500/20 text-amber-400 mb-2">Active Season</Badge>
                    <h3 className="text-xl font-bold text-white">{seasons.seasons[0].name}</h3>
                    <p className="text-white/60 text-sm">{seasons.seasons[0].description}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-amber-400">{parseInt(seasons.seasons[0].totalPrizePoolDwc || '0').toLocaleString()} DWC</div>
                    <div className="text-sm text-white/50">Prize Pool</div>
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
                  className="bg-slate-800/50 border border-white/10 rounded-xl p-4 hover:border-white/20 transition-colors"
                  data-testid={`quest-${quest.id}`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <Badge className={`text-xs ${
                      quest.difficultyLevel === 'easy' ? 'bg-emerald-500/20 text-emerald-400' :
                      quest.difficultyLevel === 'medium' ? 'bg-amber-500/20 text-amber-400' :
                      quest.difficultyLevel === 'hard' ? 'bg-orange-500/20 text-orange-400' :
                      'bg-purple-500/20 text-purple-400'
                    }`}>
                      {quest.difficultyLevel}
                    </Badge>
                    <Badge variant="outline" className="text-xs text-white/50">{quest.questType}</Badge>
                  </div>
                  <h4 className="font-semibold text-white text-sm mb-2">{quest.title}</h4>
                  <p className="text-xs text-white/50 mb-3 line-clamp-2">{quest.description}</p>
                  <div className="flex items-center gap-2">
                    {quest.shellsReward > 0 && (
                      <span className="text-xs bg-pink-500/20 text-pink-400 px-2 py-0.5 rounded-full">
                        +{quest.shellsReward} Shells
                      </span>
                    )}
                    {quest.reputationReward > 0 && (
                      <span className="text-xs bg-cyan-500/20 text-cyan-400 px-2 py-0.5 rounded-full">
                        +{quest.reputationReward} Rep
                      </span>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section id="oracles" className="py-12 px-4 bg-slate-900/50">
          <div className="container mx-auto max-w-6xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-8"
            >
              <h2 className="text-2xl md:text-3xl font-display font-bold text-white mb-2 flex items-center gap-3">
                <Globe className="w-7 h-7 text-indigo-400" />
                Reality Layer Oracles
              </h2>
              <p className="text-white/60">On-chain notarization for verifiable truth</p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {oracles?.oracles?.map((oracle: any, i: number) => (
                <motion.div
                  key={oracle.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-slate-800/50 border border-white/10 rounded-xl p-5"
                  data-testid={`oracle-${oracle.id}`}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-lg bg-indigo-500/20 flex items-center justify-center">
                      <Globe className="w-5 h-5 text-indigo-400" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-white">{oracle.name}</h4>
                      <span className="text-xs text-white/50 capitalize">{oracle.oracleType.replace('_', ' ')}</span>
                    </div>
                  </div>
                  <p className="text-sm text-white/60 mb-3">{oracle.description}</p>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-white/40">Source: {oracle.sourceType}</span>
                    <span className="text-emerald-400">{oracle.reliability}% uptime</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section id="ai-proofs" className="py-12 px-4">
          <div className="container mx-auto max-w-6xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-8"
            >
              <h2 className="text-2xl md:text-3xl font-display font-bold text-white mb-2 flex items-center gap-3">
                <Brain className="w-7 h-7 text-pink-400" />
                AI Verified Execution
              </h2>
              <p className="text-white/60">Cryptographic proofs for transparent AI decisions</p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-6">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="bg-gradient-to-br from-pink-500/10 to-purple-500/10 border border-pink-500/20 rounded-2xl p-6"
              >
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <Lock className="w-5 h-5 text-pink-400" />
                  How It Works
                </h3>
                <div className="space-y-4">
                  {[
                    { step: 1, title: "Input Hashing", desc: "AI inputs are cryptographically hashed before processing" },
                    { step: 2, title: "Execution Proof", desc: "Model generates verifiable commitment of its decision" },
                    { step: 3, title: "On-Chain Anchor", desc: "Proof is permanently recorded on DarkWave Smart Chain" },
                    { step: 4, title: "Public Verification", desc: "Anyone can verify the AI decision was fair and correct" }
                  ].map((item) => (
                    <div key={item.step} className="flex gap-3">
                      <div className="w-8 h-8 rounded-full bg-pink-500/20 flex items-center justify-center text-pink-400 font-bold text-sm shrink-0">
                        {item.step}
                      </div>
                      <div>
                        <h4 className="font-semibold text-white text-sm">{item.title}</h4>
                        <p className="text-xs text-white/50">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <h3 className="text-lg font-bold text-white mb-4">Registered AI Models</h3>
                <div className="space-y-3">
                  {aiModels?.models?.map((model: any) => (
                    <div
                      key={model.id}
                      className="bg-slate-800/50 border border-white/10 rounded-xl p-4 flex items-center justify-between"
                      data-testid={`ai-model-${model.modelId}`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-slate-700/50 flex items-center justify-center">
                          <Brain className="w-5 h-5 text-pink-400" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-white text-sm">{model.modelName}</h4>
                          <span className="text-xs text-white/50">{model.provider}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {model.verified && (
                          <Badge className="bg-emerald-500/20 text-emerald-400 text-xs">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Verified
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        <section className="py-12 px-4">
          <div className="container mx-auto max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-gradient-to-r from-cyan-500/10 via-purple-500/10 to-pink-500/10 border border-white/10 rounded-2xl p-8 text-center"
            >
              <Sparkles className="w-12 h-12 text-cyan-400 mx-auto mb-4" />
              <h2 className="text-2xl md:text-3xl font-display font-bold text-white mb-4">
                Ready to Experience the Future?
              </h2>
              <p className="text-white/70 mb-6 max-w-2xl mx-auto">
                Join the DarkWave ecosystem and be part of the most innovative blockchain platform ever built
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link href="/wallet">
                  <Button className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:opacity-90" data-testid="btn-get-started">
                    Get Started
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
                <Link href="/developers">
                  <Button variant="outline" className="border-white/20 hover:bg-white/5" data-testid="btn-developer-docs">
                    Developer Docs
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}