import { motion } from "framer-motion";
import { ArrowLeft, Coins, BarChart3, Lock, Globe, ShieldCheck, Zap, Sparkles } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import tokenBg from "@assets/generated_images/holographic_deep_wave_crypto_token_symbol.png";
import orbitLogo from "@assets/generated_images/futuristic_abstract_geometric_logo_symbol_for_orbit.png";
import { Footer } from "@/components/footer";
import { usePageAnalytics } from "@/hooks/use-analytics";
import { GlassCard } from "@/components/glass-card";

export default function Token() {
  usePageAnalytics();
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden selection:bg-primary/20 selection:text-primary">
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-background/90 backdrop-blur-xl">
        <div className="container mx-auto px-4 h-14 flex items-center">
          <Link href="/" className="flex items-center gap-2 mr-auto">
            <img src={orbitLogo} alt="DarkWave" className="w-7 h-7" />
            <span className="font-display font-bold text-lg tracking-tight">DarkWave</span>
          </Link>
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="border-amber-500/50 text-amber-400 bg-amber-500/10 text-xs">
              <Lock className="w-3 h-3 mr-1" /> Launching Feb 14, 2026
            </Badge>
            <Link href="/">
              <Button variant="ghost" size="sm" className="h-8 text-xs gap-1.5 hover:bg-white/5">
                <ArrowLeft className="w-3 h-3" />
                Back
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      <section className="pt-20 pb-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div className="space-y-6">
              <Badge variant="outline" className="px-3 py-1 border-secondary/50 text-secondary bg-secondary/10 rounded-full text-xs tracking-wider uppercase">
                Native Utility Token
              </Badge>
              <h1 className="text-4xl md:text-5xl font-display font-bold leading-tight">
                DarkWave <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-secondary via-purple-400 to-primary">($DWT)</span>
              </h1>
              <p className="text-sm text-muted-foreground leading-relaxed max-w-md">
                The fuel of the DarkWave Ecosystem. Not just a currency; it's the governance, security, and utility layer for the next generation of decentralized apps.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-3">
                <Button size="lg" className="h-11 px-6 bg-white text-black hover:bg-white/90 font-bold rounded-full text-sm">
                  Read Whitepaper
                </Button>
                <Button size="lg" variant="outline" className="h-11 px-6 border-white/20 hover:bg-white/5 rounded-full text-sm">
                  Join Waitlist
                </Button>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <GlassCard hover={false}>
                  <div className="p-3 text-center">
                    <div className="text-lg font-bold text-amber-400">TBA</div>
                    <div className="text-[10px] text-white/50">Initial Price</div>
                  </div>
                </GlassCard>
                <GlassCard hover={false}>
                  <div className="p-3 text-center">
                    <div className="text-lg font-bold text-white">100M</div>
                    <div className="text-[10px] text-white/50">Total Supply</div>
                  </div>
                </GlassCard>
                <GlassCard hover={false}>
                  <div className="p-3 text-center">
                    <div className="text-lg font-bold text-primary">Feb 2026</div>
                    <div className="text-[10px] text-white/50">Launch Date</div>
                  </div>
                </GlassCard>
              </div>
            </div>

            <div className="flex justify-center relative">
              <div className="absolute inset-0 bg-gradient-to-r from-secondary/20 to-primary/20 blur-[80px] rounded-full" />
              <motion.img 
                src={tokenBg} 
                alt="DarkWave Token" 
                className="relative z-10 w-full max-w-[350px] drop-shadow-2xl"
                animate={{ y: [0, -15, 0], rotate: [0, 3, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              />
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-display font-bold mb-3">Real Utility. No Fluff.</h2>
            <p className="text-sm text-muted-foreground max-w-lg mx-auto">
              Unlike meme coins, $DWT is required to use every app in the DarkWave ecosystem.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <GlassCard>
              <div className="p-5 h-full">
                <div className="w-10 h-10 rounded-lg bg-yellow-500/20 flex items-center justify-center text-yellow-400 mb-4">
                  <Zap className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-bold text-white mb-2">Gas Fees</h3>
                <p className="text-[11px] text-white/50 leading-relaxed">
                  Pay for transactions on DarkWave Chain with $DWT. Micro-fees ensure speed without breaking the bank.
                </p>
              </div>
            </GlassCard>
            <GlassCard>
              <div className="p-5 h-full">
                <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center text-green-400 mb-4">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-bold text-white mb-2">Validator Staking</h3>
                <p className="text-[11px] text-white/50 leading-relaxed">
                  Secure the network by staking $DWT. Earn rewards for validating transactions and honest behavior.
                </p>
              </div>
            </GlassCard>
            <GlassCard>
              <div className="p-5 h-full">
                <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center text-blue-400 mb-4">
                  <Globe className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-bold text-white mb-2">Governance</h3>
                <p className="text-[11px] text-white/50 leading-relaxed">
                  Vote on protocol upgrades, grant funding, and ecosystem direction. Your voice matters.
                </p>
              </div>
            </GlassCard>
          </div>
        </div>
      </section>

      <section className="py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
            <GlassCard glow className="order-2 lg:order-1">
              <div className="p-6">
                <h3 className="text-lg font-bold font-display mb-5 flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-primary" />
                  Distribution
                </h3>
                <div className="space-y-4">
                  <DistributionItem label="Ecosystem Growth" percent="40%" color="bg-primary" />
                  <DistributionItem label="Public Sale" percent="20%" color="bg-secondary" />
                  <DistributionItem label="Team & Founders" percent="15%" color="bg-purple-500" />
                  <DistributionItem label="Foundation Reserve" percent="15%" color="bg-blue-500" />
                  <DistributionItem label="Airdrops" percent="10%" color="bg-green-500" />
                </div>
              </div>
            </GlassCard>
             
            <div className="order-1 lg:order-2 space-y-5">
              <h2 className="text-2xl md:text-3xl font-display font-bold">Fair Launch Tokenomics</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                We designed $DWT to be fair and sustainable. The token powers governance, staking, and all transactions across the DarkWave ecosystem.
              </p>
              <div className="grid grid-cols-2 gap-3">
                <GlassCard hover={false}>
                  <div className="p-4">
                    <div className="text-[10px] text-white/40 uppercase tracking-wider mb-1">Total Supply</div>
                    <div className="text-lg font-bold font-mono text-white">100M DWT</div>
                  </div>
                </GlassCard>
                <GlassCard hover={false}>
                  <div className="p-4">
                    <div className="text-[10px] text-white/40 uppercase tracking-wider mb-1">Network</div>
                    <div className="text-lg font-bold font-mono text-white">DarkWave L1</div>
                  </div>
                </GlassCard>
              </div>
              <div className="flex items-center gap-2 pt-2">
                <Badge className="bg-primary/20 text-primary border-primary/30 text-xs">
                  <Sparkles className="w-3 h-3 mr-1" />
                  Launch: Feb 14, 2026
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

function DistributionItem({ label, percent, color }: { label: string, percent: string, color: string }) {
  return (
    <div>
      <div className="flex justify-between mb-1.5 text-xs font-medium">
        <span className="text-white/80">{label}</span>
        <span className="text-white">{percent}</span>
      </div>
      <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
        <div className={`h-full ${color}`} style={{ width: percent }} />
      </div>
    </div>
  );
}
