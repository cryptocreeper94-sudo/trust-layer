import { motion } from "framer-motion";
import { Link } from "wouter";
import { 
  Shield, Hash, Zap, Clock, Award, ExternalLink, 
  Cpu, Database, Users, Globe, ArrowLeft, QrCode
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { GlassCard } from "@/components/glass-card";
import { GenesisHallmarkCard } from "@/components/genesis-hallmark";
import { Footer } from "@/components/footer";
import darkwaveLogo from "@assets/generated_images/darkwave_token_transparent.png";

const BLOCKCHAIN_SPECS = [
  { icon: Zap, label: "Block Time", value: "400ms", desc: "Ultra-fast finality" },
  { icon: Cpu, label: "TPS", value: "200,000+", desc: "High throughput" },
  { icon: Shield, label: "Consensus", value: "PoA", desc: "Proof of Authority" },
  { icon: Database, label: "Total Supply", value: "100M DWC", desc: "Fixed supply" },
];

const FOUNDING_PRINCIPLES = [
  {
    icon: Shield,
    title: "Security First",
    desc: "Enterprise-grade security with multi-layer protection and continuous monitoring"
  },
  {
    icon: Zap,
    title: "Speed & Efficiency",
    desc: "Sub-second finality with 200K+ TPS for real-time applications"
  },
  {
    icon: Users,
    title: "Community Driven",
    desc: "Built by gamers for gamers, with governance rights for all holders"
  },
  {
    icon: Globe,
    title: "Global Scale",
    desc: "Multi-region infrastructure designed for worldwide accessibility"
  },
];

export default function GenesisBlock() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-purple-950/20 to-slate-950 text-white">
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/50 backdrop-blur-xl border-b border-white/5">
        <div className="container mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/">
              <Button variant="ghost" size="sm" className="h-8 px-2">
                <ArrowLeft className="w-4 h-4 mr-1" />
                Back
              </Button>
            </Link>
          </div>
          <div className="flex items-center gap-2">
            <img src={darkwaveLogo} alt="DarkWave" className="w-6 h-6" />
            <span className="font-bold text-sm">Genesis Block</span>
          </div>
          <div className="w-16" />
        </div>
      </nav>

      <main className="pt-20 pb-12 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30 mb-4">
              <Hash className="w-3 h-3 mr-1" />
              Block #0
            </Badge>
            <h1 className="text-3xl md:text-4xl font-bold mb-3 bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
              DarkWave Genesis Block
            </h1>
            <p className="text-sm text-white/60 max-w-xl mx-auto">
              The founding block of DarkWave Smart Chain. This immutable record marks the birth of our high-performance blockchain ecosystem.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-8"
          >
            <GenesisHallmarkCard />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-8"
          >
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Cpu className="w-5 h-5 text-cyan-400" />
              Chain Specifications
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {BLOCKCHAIN_SPECS.map((spec, i) => (
                <GlassCard key={i} className="p-4 text-center" glow>
                  <spec.icon className="w-6 h-6 mx-auto mb-2 text-purple-400" />
                  <div className="text-lg font-bold">{spec.value}</div>
                  <div className="text-[10px] text-muted-foreground uppercase tracking-wider">{spec.label}</div>
                  <div className="text-[10px] text-white/40 mt-1">{spec.desc}</div>
                </GlassCard>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-8"
          >
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-400" />
              Founding Principles
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {FOUNDING_PRINCIPLES.map((principle, i) => (
                <GlassCard key={i} className="p-4" glow>
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center shrink-0">
                      <principle.icon className="w-5 h-5 text-purple-400" />
                    </div>
                    <div>
                      <div className="font-bold text-sm mb-1">{principle.title}</div>
                      <div className="text-xs text-muted-foreground">{principle.desc}</div>
                    </div>
                  </div>
                </GlassCard>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mb-8"
          >
            <GlassCard className="p-6" glow>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500/20 to-emerald-500/20 flex items-center justify-center">
                  <QrCode className="w-6 h-6 text-green-400" />
                </div>
                <div>
                  <div className="font-bold">Founding Validator</div>
                  <div className="text-xs text-muted-foreground">DarkWave Studios Authority Node</div>
                </div>
              </div>
              <div className="p-3 rounded-lg bg-black/30 border border-white/10 mb-4">
                <div className="text-[10px] text-muted-foreground mb-1">Validator Address</div>
                <code className="text-xs text-purple-300 font-mono break-all">
                  dwsc1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqpz7qw8k
                </code>
              </div>
              <div className="flex flex-wrap gap-2">
                <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Active</Badge>
                <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">99.99% Uptime</Badge>
                <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">Founding Member</Badge>
              </div>
            </GlassCard>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="grid grid-cols-2 gap-3"
          >
            <Link href="/explorer">
              <Button className="w-full h-12 bg-gradient-to-r from-cyan-500 to-blue-500">
                <Database className="w-4 h-4 mr-2" />
                Block Explorer
              </Button>
            </Link>
            <Link href="/tokenomics">
              <Button className="w-full h-12" variant="outline">
                <Award className="w-4 h-4 mr-2" />
                Tokenomics
              </Button>
            </Link>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
