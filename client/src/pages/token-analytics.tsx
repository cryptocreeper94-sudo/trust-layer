import { motion } from "framer-motion";
import {
  BarChart3, PieChart, TrendingUp, Users,
  Wallet, Shield, Activity, Zap, Clock
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

const GlowOrb = ({ color, size, top, left, delay = 0 }: { color: string; size: number; top: string; left: string; delay?: number }) => (
  <motion.div
    className="absolute rounded-full blur-3xl opacity-20 pointer-events-none"
    style={{ background: color, width: size, height: size, top, left }}
    animate={{ scale: [1, 1.2, 1], opacity: [0.15, 0.25, 0.15] }}
    transition={{ duration: 8, repeat: Infinity, delay }}
  />
);

function BentoCard({ children, className = "", colSpan = 1, rowSpan = 1, delay = 0 }: {
  children: React.ReactNode;
  className?: string;
  colSpan?: number;
  rowSpan?: number;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className={`rounded-2xl bg-white/[0.04] backdrop-blur-xl border border-white/10 overflow-hidden hover:scale-[1.02] hover:border-purple-500/20 transition-all duration-300 ${className}`}
      style={{
        gridColumn: `span ${colSpan}`,
        gridRow: `span ${rowSpan}`,
        boxShadow: "0 8px 40px rgba(0,0,0,0.3)",
      }}
    >
      {children}
    </motion.div>
  );
}

function ComingSoonCard({ icon: Icon, title, iconColor = "text-cyan-400" }: {
  icon: any;
  title: string;
  iconColor?: string;
}) {
  return (
    <div className="p-4 h-full flex flex-col items-center justify-center text-center">
      <Icon className={`w-8 h-8 ${iconColor} mb-2 opacity-50`} />
      <span className="font-bold text-sm mb-1 text-white">{title}</span>
      <span className="text-[10px] text-slate-400">Available at launch</span>
    </div>
  );
}

export default function TokenAnalytics() {
  return (
    <div className="min-h-screen relative overflow-hidden pt-20 pb-12" style={{ background: "linear-gradient(180deg, #070b16, #0c1222, #070b16)" }}>
      <GlowOrb color="linear-gradient(135deg, #06b6d4, #3b82f6)" size={500} top="-5%" left="60%" />
      <GlowOrb color="linear-gradient(135deg, #8b5cf6, #ec4899)" size={400} top="40%" left="-10%" delay={3} />
      <GlowOrb color="linear-gradient(135deg, #f59e0b, #ef4444)" size={350} top="75%" left="80%" delay={5} />

      <div className="relative z-10 container mx-auto max-w-6xl px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 p-5 rounded-2xl bg-white/[0.04] backdrop-blur-xl border border-white/10"
          style={{ boxShadow: "0 8px 40px rgba(0,0,0,0.3)" }}
        >
          <div className="flex items-center justify-center gap-2 text-purple-400">
            <Clock className="w-5 h-5" />
            <span className="font-semibold">Analytics — Coming at Mainnet Launch</span>
          </div>
          <p className="text-center text-xs text-slate-400 mt-2">
            Live token analytics will be available after mainnet launch
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="flex items-center gap-4 mb-8"
        >
          <motion.div
            className="p-3 rounded-2xl bg-cyan-500/20 border border-cyan-500/30"
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 4, repeat: Infinity }}
          >
            <Shield className="w-7 h-7 text-cyan-400" />
          </motion.div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">SIG Analytics</h1>
              <Badge className="bg-green-500/20 text-green-400">Verified</Badge>
            </div>
            <p className="text-sm text-slate-400">Signal • Deep token analysis</p>
          </div>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 auto-rows-[120px] md:auto-rows-[140px]">
          <BentoCard colSpan={2} rowSpan={1} delay={0.1}>
            <ComingSoonCard icon={Shield} title="Risk Score" iconColor="text-green-400" />
          </BentoCard>

          <BentoCard colSpan={2} rowSpan={2} delay={0.15}>
            <ComingSoonCard icon={PieChart} title="Holder Distribution" iconColor="text-cyan-400" />
          </BentoCard>

          <BentoCard colSpan={2} rowSpan={1} delay={0.2}>
            <ComingSoonCard icon={Users} title="Unique Holders" iconColor="text-blue-400" />
          </BentoCard>

          <BentoCard colSpan={2} rowSpan={2} delay={0.25}>
            <ComingSoonCard icon={Activity} title="Holder Growth" iconColor="text-cyan-400" />
          </BentoCard>

          <BentoCard colSpan={2} rowSpan={1} delay={0.3}>
            <ComingSoonCard icon={BarChart3} title="24h Volume" iconColor="text-purple-400" />
          </BentoCard>

          <BentoCard colSpan={4} rowSpan={2} delay={0.35}>
            <ComingSoonCard icon={Wallet} title="Top Holders" iconColor="text-amber-400" />
          </BentoCard>

          <BentoCard colSpan={2} rowSpan={2} delay={0.4}>
            <ComingSoonCard icon={Zap} title="Smart Money Flow" iconColor="text-yellow-400" />
          </BentoCard>
        </div>
      </div>
    </div>
  );
}
