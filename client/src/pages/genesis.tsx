import { motion } from "framer-motion";
import { Link } from "wouter";
import { 
  Shield, Hash, Zap, Clock, Award, ExternalLink, 
  Cpu, Database, Users, Globe, QrCode
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { GenesisHallmarkCard } from "@/components/genesis-hallmark";

const GlowOrb = ({ color, size, top, left, delay = 0 }: { color: string; size: number; top: string; left: string; delay?: number }) => (
  <motion.div
    className="absolute rounded-full blur-3xl opacity-20 pointer-events-none"
    style={{ background: color, width: size, height: size, top, left }}
    animate={{ scale: [1, 1.2, 1], opacity: [0.15, 0.25, 0.15] }}
    transition={{ duration: 8, repeat: Infinity, delay }}
  />
);

const BLOCKCHAIN_SPECS = [
  { icon: Zap, label: "Block Time", value: "400ms", desc: "Ultra-fast finality" },
  { icon: Cpu, label: "TPS", value: "200,000+", desc: "High throughput" },
  { icon: Shield, label: "Consensus", value: "PoA", desc: "Proof of Authority" },
  { icon: Database, label: "Total Supply", value: "1B SIG", desc: "Fixed supply" },
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
    <div className="min-h-screen text-white relative overflow-hidden" style={{ background: "linear-gradient(180deg, #070b16, #0c1222, #070b16)" }}>
      <GlowOrb color="#8b5cf6" size={450} top="5%" left="10%" delay={0} />
      <GlowOrb color="#ec4899" size={350} top="35%" left="80%" delay={2} />
      <GlowOrb color="#06b6d4" size={400} top="65%" left="15%" delay={4} />

      <main className="relative z-10 pt-20 pb-12 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30 mb-4">
              <Hash className="w-3 h-3 mr-1" />
              Block #0
            </Badge>
            <h1 className="text-3xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
              Trust Layer Genesis Block
            </h1>
            <p className="text-sm text-white/60 max-w-xl mx-auto">
              The founding block of Trust Layer. This immutable record marks the birth of our high-performance blockchain ecosystem.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-16"
          >
            <GenesisHallmarkCard />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-16"
          >
            <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
              <Cpu className="w-5 h-5 text-cyan-400" />
              <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">Chain Specifications</span>
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {BLOCKCHAIN_SPECS.map((spec, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25 + i * 0.05 }}
                  className="bg-white/[0.04] backdrop-blur-xl border border-white/10 rounded-2xl p-4 text-center hover:scale-[1.02] transition-all duration-300"
                  style={{ boxShadow: "0 8px 40px rgba(0,0,0,0.3)" }}
                >
                  <spec.icon className="w-6 h-6 mx-auto mb-2 text-purple-400" />
                  <div className="text-lg font-bold">{spec.value}</div>
                  <div className="text-[10px] text-muted-foreground uppercase tracking-wider">{spec.label}</div>
                  <div className="text-[10px] text-white/40 mt-1">{spec.desc}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-16"
          >
            <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-400" />
              <span className="bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">Founding Principles</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {FOUNDING_PRINCIPLES.map((principle, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.35 + i * 0.05 }}
                  className="bg-white/[0.04] backdrop-blur-xl border border-white/10 rounded-2xl p-4 hover:scale-[1.02] transition-all duration-300"
                  style={{ boxShadow: "0 8px 40px rgba(0,0,0,0.3)" }}
                >
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center shrink-0">
                      <principle.icon className="w-5 h-5 text-purple-400" />
                    </div>
                    <div>
                      <div className="font-bold text-sm mb-1">{principle.title}</div>
                      <div className="text-xs text-muted-foreground">{principle.desc}</div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mb-16"
          >
            <div
              className="bg-white/[0.04] backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:scale-[1.01] transition-all duration-300"
              style={{ boxShadow: "0 8px 40px rgba(0,0,0,0.3)" }}
            >
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
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="grid grid-cols-2 gap-4"
          >
            <Link href="/explorer">
              <Button className="w-full h-12 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600">
                <Database className="w-4 h-4 mr-2" />
                Block Explorer
              </Button>
            </Link>
            <Link href="/tokenomics">
              <Button className="w-full h-12 border-white/10 hover:bg-white/5" variant="outline">
                <Award className="w-4 h-4 mr-2" />
                Tokenomics
              </Button>
            </Link>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
