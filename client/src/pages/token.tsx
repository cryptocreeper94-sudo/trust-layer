import { motion } from "framer-motion";
import { ArrowLeft, Coins, BarChart3, Lock, Globe, ShieldCheck, Zap, Sparkles, Crown, Star, Gift, Users, TrendingUp, Percent } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import tokenBg from "@assets/generated_images/platinum_darkwave_token_holographic_fill.png";
import orbitLogo from "@assets/generated_images/futuristic_abstract_geometric_logo_symbol_for_orbit.png";
import { Footer } from "@/components/footer";
import { usePageAnalytics } from "@/hooks/use-analytics";
import { GlassCard } from "@/components/glass-card";

export default function Token() {
  usePageAnalytics();
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden selection:bg-primary/20 selection:text-primary">
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-background/90 backdrop-blur-xl">
        <div className="container mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <img src={orbitLogo} alt="DarkWave" className="w-7 h-7" />
            <span className="font-display font-bold text-lg tracking-tight hidden sm:inline">DarkWave</span>
          </Link>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="border-amber-500/50 text-amber-400 bg-amber-500/10 text-[10px] sm:text-xs whitespace-nowrap">
              <Lock className="w-3 h-3 mr-1 hidden sm:inline" /> Feb 14, 2026
            </Badge>
            <Link href="/">
              <Button variant="ghost" size="sm" className="h-8 text-xs gap-1 hover:bg-white/5 px-2">
                <ArrowLeft className="w-3 h-3" />
                <span className="hidden sm:inline">Back</span>
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
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-secondary via-purple-400 to-primary">($DWC)</span>
              </h1>
              <p className="text-sm text-muted-foreground leading-relaxed max-w-md">
                The fuel of the DarkWave Ecosystem. Not just a currency; it's the governance, security, and utility layer for the next generation of decentralized apps.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-3">
                <Link href="/doc-hub">
                  <Button size="lg" className="h-11 px-6 bg-white text-black hover:bg-white/90 font-bold rounded-full text-sm" data-testid="button-whitepaper">
                    Read Whitepaper
                  </Button>
                </Link>
                <Link href="/billing">
                  <Button size="lg" variant="outline" className="h-11 px-6 border-white/20 hover:bg-white/5 rounded-full text-sm">
                    View Memberships
                  </Button>
                </Link>
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
              <div className="relative z-10 w-full max-w-[350px]">
                <div className="relative w-full rounded-full overflow-hidden">
                  <motion.img 
                    src={tokenBg} 
                    alt="DarkWave Coin" 
                    className="w-full drop-shadow-2xl scale-110"
                    animate={{ y: [0, -10, 0], rotate: [0, 2, 0] }}
                    transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                  />
                  <div 
                    className="absolute inset-[10%] rounded-full overflow-hidden pointer-events-none"
                    style={{ mixBlendMode: 'color-dodge' }}
                  >
                    <motion.div
                      className="absolute -inset-[50%] rounded-full"
                      style={{
                        background: 'radial-gradient(ellipse 40% 60% at 30% 40%, rgba(200,0,100,0.6) 0%, transparent 70%)',
                      }}
                      animate={{ 
                        rotate: [0, 360],
                        scale: [1, 1.2, 1],
                      }}
                      transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                    />
                    <motion.div
                      className="absolute -inset-[50%] rounded-full"
                      style={{
                        background: 'radial-gradient(ellipse 50% 30% at 70% 60%, rgba(150,0,200,0.5) 0%, transparent 70%)',
                      }}
                      animate={{ 
                        rotate: [360, 0],
                        scale: [1.2, 1, 1.2],
                      }}
                      transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                    />
                    <motion.div
                      className="absolute -inset-[30%] rounded-full"
                      style={{
                        background: 'radial-gradient(ellipse 35% 50% at 50% 30%, rgba(255,80,0,0.4) 0%, transparent 60%)',
                      }}
                      animate={{ 
                        rotate: [0, -360],
                      }}
                      transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
                    />
                    <motion.div
                      className="absolute inset-[20%] rounded-full"
                      style={{
                        background: 'radial-gradient(circle, rgba(0,0,0,0.9) 30%, transparent 70%)',
                      }}
                      animate={{ 
                        scale: [1, 1.1, 1],
                      }}
                      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-display font-bold mb-3">Real Utility. No Fluff.</h2>
            <p className="text-sm text-muted-foreground max-w-lg mx-auto">
              Unlike meme coins, $DWC is required to use every app in the DarkWave ecosystem.
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
                  Pay for transactions on DarkWave Smart Chain with $DWC. Micro-fees ensure speed without breaking the bank.
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
                  Secure the network by staking $DWC. Earn rewards for validating transactions and honest behavior.
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
                  <DistributionItem label="Public Sale" percent="40%" color="bg-primary" desc="Fair launch, no vesting" />
                  <DistributionItem label="Development" percent="20%" color="bg-secondary" desc="Unlocked as needed for ecosystem growth" />
                  <DistributionItem label="Team & Advisors" percent="15%" color="bg-purple-500" desc="6-month cliff, 12-month vesting" />
                  <DistributionItem label="Marketing" percent="10%" color="bg-amber-500" desc="Partnerships, community airdrops" />
                  <DistributionItem label="Liquidity Pool" percent="10%" color="bg-blue-500" desc="Locked in DEX for price stability" />
                  <DistributionItem label="Reserve" percent="5%" color="bg-emerald-500" desc="12-month lock for emergencies" />
                </div>
              </div>
            </GlassCard>
             
            <div className="order-1 lg:order-2 space-y-5">
              <h2 className="text-2xl md:text-3xl font-display font-bold">Fair Launch Tokenomics</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                We designed $DWC to be fair and sustainable. The token powers governance, staking, and all transactions across the DarkWave ecosystem.
              </p>
              <div className="grid grid-cols-2 gap-3">
                <GlassCard hover={false}>
                  <div className="p-4">
                    <div className="text-[10px] text-white/40 uppercase tracking-wider mb-1">Total Supply</div>
                    <div className="text-lg font-bold font-mono text-white">100M DWC</div>
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

      <section className="py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-10">
            <Badge variant="outline" className="mb-4 px-3 py-1 border-amber-500/50 text-amber-400 bg-amber-500/10 rounded-full text-xs">
              <Crown className="w-3 h-3 mr-1" /> Early Adopter Program
            </Badge>
            <h2 className="text-2xl md:text-3xl font-display font-bold mb-3">Join the Genesis Community</h2>
            <p className="text-sm text-muted-foreground max-w-lg mx-auto">
              Early supporters receive exclusive rewards, bonus allocations, and lifetime benefits.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <GlassCard className="relative overflow-hidden" data-testid="card-tier-founder">
              <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 to-transparent" />
              <div className="p-6 relative">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
                    <Crown className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">Founder Tier</h3>
                    <Badge className="bg-amber-500/20 text-amber-400 text-[10px]">Limited to 100</Badge>
                  </div>
                </div>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2"><Sparkles className="w-3 h-3 text-amber-400" /> 10,000 DWC allocation</li>
                  <li className="flex items-center gap-2"><TrendingUp className="w-3 h-3 text-amber-400" /> 2x staking multiplier</li>
                  <li className="flex items-center gap-2"><Star className="w-3 h-3 text-amber-400" /> Exclusive NFT badge</li>
                  <li className="flex items-center gap-2"><Users className="w-3 h-3 text-amber-400" /> Private Discord access</li>
                </ul>
              </div>
            </GlassCard>

            <GlassCard className="relative overflow-hidden" data-testid="card-tier-genesis">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-transparent" />
              <div className="p-6 relative">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
                    <Star className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">Genesis Tier</h3>
                    <Badge className="bg-purple-500/20 text-purple-400 text-[10px]">Limited to 500</Badge>
                  </div>
                </div>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2"><Sparkles className="w-3 h-3 text-purple-400" /> 5,000 DWC allocation</li>
                  <li className="flex items-center gap-2"><TrendingUp className="w-3 h-3 text-purple-400" /> 1.5x staking multiplier</li>
                  <li className="flex items-center gap-2"><Star className="w-3 h-3 text-purple-400" /> Early access to features</li>
                  <li className="flex items-center gap-2"><Gift className="w-3 h-3 text-purple-400" /> Priority airdrop eligibility</li>
                </ul>
              </div>
            </GlassCard>

            <GlassCard className="relative overflow-hidden" data-testid="card-tier-beta">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent" />
              <div className="p-6 relative">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">Beta Tester</h3>
                    <Badge className="bg-blue-500/20 text-blue-400 text-[10px]">Open Enrollment</Badge>
                  </div>
                </div>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2"><Sparkles className="w-3 h-3 text-blue-400" /> 1,000 DWC allocation</li>
                  <li className="flex items-center gap-2"><TrendingUp className="w-3 h-3 text-blue-400" /> 1.25x staking multiplier</li>
                  <li className="flex items-center gap-2"><Star className="w-3 h-3 text-blue-400" /> Bug bounty rewards</li>
                  <li className="flex items-center gap-2"><Gift className="w-3 h-3 text-blue-400" /> Contribution-based bonuses</li>
                </ul>
              </div>
            </GlassCard>
          </div>

          <div className="text-center mt-8">
            <Link href="/staking">
              <Button size="lg" className="rounded-full gap-2" data-testid="button-early-access">
                <Gift className="w-4 h-4" /> Apply for Early Access
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-12 px-4 bg-white/[0.02]">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-display font-bold mb-3">Sustainable Revenue Model</h2>
            <p className="text-sm text-muted-foreground max-w-lg mx-auto">
              DarkWave generates real revenue through ecosystem fees, ensuring long-term sustainability.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <GlassCard hover={false}>
              <div className="p-4 text-center">
                <div className="text-2xl font-bold text-green-400 mb-1">0%</div>
                <div className="text-xs text-muted-foreground">Buy Tax</div>
              </div>
            </GlassCard>
            <GlassCard hover={false}>
              <div className="p-4 text-center">
                <div className="text-2xl font-bold text-primary mb-1">5%</div>
                <div className="text-xs text-muted-foreground">Sell/Transfer Tax</div>
              </div>
            </GlassCard>
            <GlassCard hover={false}>
              <div className="p-4 text-center">
                <div className="text-2xl font-bold text-secondary mb-1">3%</div>
                <div className="text-xs text-muted-foreground">→ Treasury</div>
              </div>
            </GlassCard>
            <GlassCard hover={false}>
              <div className="p-4 text-center">
                <div className="text-2xl font-bold text-blue-400 mb-1">2%</div>
                <div className="text-xs text-muted-foreground">→ Liquidity Pool</div>
              </div>
            </GlassCard>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            <GlassCard className="p-5">
              <h4 className="font-bold mb-3 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-green-400" /> No Token Burns
              </h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Unlike deflationary tokens, DWC maintains a fixed 100M supply. Protocol fees are redistributed to stakers and the ecosystem treasury, ensuring sustainable growth without artificial scarcity.
              </p>
            </GlassCard>
            <GlassCard className="p-5">
              <h4 className="font-bold mb-3 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-blue-400" /> Vesting & Lockups
              </h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Team tokens are locked with a 6-month cliff and 12-month linear vesting. This ensures long-term alignment and prevents early dumping by insiders.
              </p>
            </GlassCard>
          </div>
        </div>
      </section>

      <section className="py-12 px-4">
        <div className="container mx-auto max-w-4xl">
          <GlassCard glow className="relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-amber-500/10 via-yellow-500/5 to-orange-500/10" />
            <div className="p-8 relative text-center">
              <Badge className="mb-4 bg-amber-500/20 text-amber-400 border-amber-500/30">
                <Crown className="w-3 h-3 mr-1" /> Limited Time Offer
              </Badge>
              <h2 className="text-2xl md:text-3xl font-display font-bold mb-3">
                Become a Legacy Founder
              </h2>
              <p className="text-muted-foreground mb-6 max-w-lg mx-auto">
                Pay $24 once. Get lifetime access. Receive 35,000 DWC tokens on launch day.
                Only 10,000 spots available - program closes February 14, 2026.
              </p>
              <Link href="/founder-program">
                <Button size="lg" className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-bold rounded-full gap-2" data-testid="button-founder-program">
                  <Crown className="w-5 h-5" /> Join Legacy Founder Program
                </Button>
              </Link>
            </div>
          </GlassCard>
        </div>
      </section>

      <Footer />
    </div>
  );
}

function DistributionItem({ label, percent, color, desc }: { label: string, percent: string, color: string, desc?: string }) {
  return (
    <div>
      <div className="flex justify-between mb-1 text-xs font-medium">
        <div>
          <span className="text-white/80">{label}</span>
          {desc && <span className="text-white/40 text-[10px] ml-2">({desc})</span>}
        </div>
        <span className="text-white">{percent}</span>
      </div>
      <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
        <div className={`h-full ${color}`} style={{ width: percent }} />
      </div>
    </div>
  );
}
