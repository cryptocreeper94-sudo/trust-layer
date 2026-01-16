import { motion } from "framer-motion";
import { Link } from "wouter";
import {
  BarChart3, PieChart, TrendingUp, Users,
  Wallet, Shield, Activity, Info, Zap, Clock
} from "lucide-react";
import { BackButton } from "@/components/page-nav";
import { Footer } from "@/components/footer";
import { Badge } from "@/components/ui/badge";
import darkwaveLogo from "@assets/generated_images/darkwave_token_transparent.png";

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
      className={`rounded-2xl bg-gradient-to-br from-white/[0.08] to-white/[0.02] border border-white/[0.08] backdrop-blur-xl overflow-hidden ${className}`}
      style={{
        gridColumn: `span ${colSpan}`,
        gridRow: `span ${rowSpan}`,
      }}
    >
      {children}
    </motion.div>
  );
}

function ComingSoonCard({ icon: Icon, title, iconColor = "text-primary" }: { 
  icon: React.ElementType; 
  title: string; 
  iconColor?: string;
}) {
  return (
    <div className="p-4 h-full flex flex-col items-center justify-center text-center">
      <Icon className={`w-8 h-8 ${iconColor} mb-2 opacity-50`} />
      <span className="font-bold text-sm mb-1">{title}</span>
      <span className="text-[10px] text-muted-foreground">Available at launch</span>
    </div>
  );
}

export default function TokenAnalytics() {
  return (
    <div className="min-h-screen flex flex-col bg-background overflow-x-hidden">
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-background/90 backdrop-blur-xl">
        <div className="container mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <img src={darkwaveLogo} alt="DarkWave" className="w-7 h-7" />
            <span className="font-display font-bold text-lg tracking-tight hidden sm:inline">DarkWave</span>
          </Link>
          <BackButton />
        </div>
      </nav>

      <main className="flex-1 pt-16 pb-8 px-4">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 rounded-xl bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-cyan-500/10 border border-white/10"
          >
            <div className="flex items-center justify-center gap-2 text-purple-400">
              <Clock className="w-5 h-5" />
              <span className="font-semibold">Analytics Launch April 11, 2026</span>
            </div>
            <p className="text-center text-xs text-muted-foreground mt-2">
              Live token analytics will be available after mainnet launch
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-4 mb-6"
          >
            <motion.div 
              className="p-3 rounded-2xl bg-primary/20 border border-primary/30"
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
            >
              <img src={darkwaveLogo} alt="SIG" className="w-10 h-10" />
            </motion.div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-display font-bold">SIG Analytics</h1>
                <Badge className="bg-green-500/20 text-green-400">Verified</Badge>
              </div>
              <p className="text-sm text-muted-foreground">Signal • Deep token analysis</p>
            </div>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 auto-rows-[120px] md:auto-rows-[140px]">
            
            <BentoCard colSpan={2} rowSpan={1} delay={0.1}>
              <ComingSoonCard icon={Shield} title="Risk Score" iconColor="text-green-400" />
            </BentoCard>

            <BentoCard colSpan={2} rowSpan={2} delay={0.15}>
              <ComingSoonCard icon={PieChart} title="Holder Distribution" iconColor="text-primary" />
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
      </main>

      <Footer />
    </div>
  );
}
