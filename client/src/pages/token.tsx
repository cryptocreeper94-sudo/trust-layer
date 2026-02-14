import { motion } from "framer-motion";
import { ArrowRightLeft, Coins, BarChart3, Lock, Globe, ShieldCheck, Zap, Sparkles, Crown, Star, Gift, Users, TrendingUp, Percent, PieChart, Code, Megaphone, Settings, Shield, ExternalLink } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import tokenBg from "@assets/generated_images/darkwave_trust_layer_emblem_enhanced.png";
const shieldImage = "/shield-reference.jpg";
import blockchainImg from "@assets/generated_images/futuristic_blockchain_network_activity_monitor.png";
import dashboardImg from "@assets/generated_images/futuristic_dashboard_interface_for_managing_decentralized_applications.png";
import governanceImg from "@assets/generated_images/medieval_fantasy_kingdom.png";
import spaceImg from "@assets/generated_images/deep_space_station.png";
import cyberpunkImg from "@assets/generated_images/cyberpunk_neon_city.png";
import quantumImg from "@assets/generated_images/quantum_dimension_realm.png";
import { DYORDisclaimer } from "@/components/dyor-disclaimer";
import { usePageAnalytics } from "@/hooks/use-analytics";
import { GlassCard } from "@/components/glass-card";

const GlowOrb = ({ color, size, top, left, delay = 0 }: { color: string; size: number; top: string; left: string; delay?: number }) => (
  <motion.div
    className="absolute rounded-full blur-3xl opacity-20 pointer-events-none"
    style={{ background: color, width: size, height: size, top, left }}
    animate={{ scale: [1, 1.2, 1], opacity: [0.15, 0.25, 0.15] }}
    transition={{ duration: 8, repeat: Infinity, delay }}
  />
);

export default function Token() {
  usePageAnalytics();
  return (
    <div className="min-h-screen relative overflow-hidden pt-20 pb-12" style={{ background: "linear-gradient(180deg, #070b16, #0c1222, #070b16)" }}>
      <GlowOrb color="linear-gradient(135deg, #06b6d4, #3b82f6)" size={500} top="-5%" left="60%" />
      <GlowOrb color="linear-gradient(135deg, #8b5cf6, #ec4899)" size={400} top="40%" left="-10%" delay={3} />

      <section className="pb-12">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div className="space-y-6">
              <Badge variant="outline" className="px-3 py-1 border-cyan-500/50 text-cyan-400 bg-cyan-500/10 rounded-full text-xs tracking-wider uppercase">
                Trust Network Access
              </Badge>
              <h1 className="text-4xl md:text-5xl font-display font-bold leading-tight">
                <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">Signal</span> <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400">(SIG)</span>
              </h1>
              <p className="text-sm text-muted-foreground leading-relaxed max-w-md">
                Signal is not a cryptocurrency — it's a transmission of verified intent. Your acknowledgment, access, and proof of participation in the Trust Network. The value is the infrastructure it unlocks, not speculation.
              </p>
              
              <div className="flex flex-wrap gap-3">
                <Link href="/tokenomics">
                  <Button size="lg" className="h-11 px-6 bg-white text-black hover:bg-white/90 font-bold rounded-full text-sm" data-testid="button-tokenomics">
                    Full Tokenomics
                  </Button>
                </Link>
                <Link href="/executive-summary">
                  <Button size="lg" variant="outline" className="h-11 px-6 border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10 rounded-full text-sm" data-testid="button-exec-summary">
                    Executive Summary
                  </Button>
                </Link>
                <Link href="/faq">
                  <Button size="lg" variant="outline" className="h-11 px-6 border-purple-500/30 text-purple-400 hover:bg-purple-500/10 rounded-full text-sm" data-testid="button-faq">
                    FAQ
                  </Button>
                </Link>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <GlassCard hover={false}>
                  <div className="p-3 text-center">
                    <div className="text-lg font-bold text-amber-400">TBA</div>
                    <div className="text-[10px] text-white/50">Initial Price</div>
                  </div>
<GlassCard hover={false}>
                  <div className="p-3 text-center">
                    <div className="text-lg font-bold text-white">1B</div>
                    <div className="text-[10px] text-white/50">Total Supply</div>
                  </div>
<GlassCard hover={false}>
                  <div className="p-3 text-center">
                    <div className="text-lg font-bold text-primary">TBA</div>
                    <div className="text-[10px] text-white/50">Launch Date</div>
                  </div>
</div>
            </div>

            <div className="flex justify-center relative">
              <div className="absolute inset-0 bg-gradient-to-r from-secondary/20 to-primary/20 blur-[80px] rounded-full" />
              <div className="relative z-10 w-full max-w-[350px]">
                {/* Signal broadcasting rings */}
                <motion.div
                  className="absolute inset-[-20px] rounded-full border-2 border-cyan-400/40"
                  animate={{ scale: [1, 1.4, 1], opacity: [0.6, 0, 0.6] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                />
                <motion.div
                  className="absolute inset-[-40px] rounded-full border border-purple-400/30"
                  animate={{ scale: [1, 1.5, 1], opacity: [0.4, 0, 0.4] }}
                  transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
                />
                <motion.div
                  className="absolute inset-[-60px] rounded-full border border-pink-400/20"
                  animate={{ scale: [1, 1.6, 1], opacity: [0.3, 0, 0.3] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0.8 }}
                />
                <div className="relative w-full rounded-full overflow-hidden">
                  <motion.img 
                    src={shieldImage} 
                    alt="Signal" 
                    className="w-full drop-shadow-2xl scale-110"
                    style={{ mixBlendMode: 'lighten' }}
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
              Signal is required to access every app in the Trust Layer ecosystem — it's your key to the Trust Network.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <motion.div 
              whileHover={{ scale: 1.02, y: -4 }}
              className="relative overflow-hidden rounded-2xl border border-white/10 group"
              style={{ boxShadow: '0 0 40px rgba(0,0,0,0.5)' }}
            >
              <img src={blockchainImg} alt="Gas Fees" className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-black/30" />
              <div className="relative z-10 p-5 h-full min-h-[180px] flex flex-col justify-end">
                <div className="w-10 h-10 rounded-lg bg-yellow-500/30 backdrop-blur-sm flex items-center justify-center text-yellow-400 mb-3">
                  <Zap className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-bold text-white mb-2">Gas Fees</h3>
                <p className="text-[11px] text-white/70 leading-relaxed">
                  Pay for transactions on Trust Layer with Signal. Micro-fees ensure speed without breaking the bank.
                </p>
              </div>
            </motion.div>
            <motion.div 
              whileHover={{ scale: 1.02, y: -4 }}
              className="relative overflow-hidden rounded-2xl border border-white/10 group"
              style={{ boxShadow: '0 0 40px rgba(0,0,0,0.5)' }}
            >
              <img src={dashboardImg} alt="Validator Staking" className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-black/30" />
              <div className="relative z-10 p-5 h-full min-h-[180px] flex flex-col justify-end">
                <div className="w-10 h-10 rounded-lg bg-green-500/30 backdrop-blur-sm flex items-center justify-center text-green-400 mb-3">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-bold text-white mb-2">Validator Staking</h3>
                <p className="text-[11px] text-white/70 leading-relaxed">
                  Secure the network by staking Signal. Earn rewards for validating transactions and honest behavior.
                </p>
              </div>
            </motion.div>
            <motion.div 
              whileHover={{ scale: 1.02, y: -4 }}
              className="relative overflow-hidden rounded-2xl border border-white/10 group"
              style={{ boxShadow: '0 0 40px rgba(0,0,0,0.5)' }}
            >
              <img src={governanceImg} alt="Governance" className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-black/30" />
              <div className="relative z-10 p-5 h-full min-h-[180px] flex flex-col justify-end">
                <div className="w-10 h-10 rounded-lg bg-blue-500/30 backdrop-blur-sm flex items-center justify-center text-blue-400 mb-3">
                  <Globe className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-bold text-white mb-2">Governance</h3>
                <p className="text-[11px] text-white/70 leading-relaxed">
                  Vote on protocol upgrades, grant funding, and ecosystem direction. Your voice matters.
                </p>
              </div>
            </motion.div>
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
                  <DistributionItem label="Treasury Reserve" percent="50%" color="bg-amber-500" desc="Long-term sustainability fund" />
                  <DistributionItem label="Staking Rewards" percent="15%" color="bg-emerald-500" desc="Validator and liquid staking APY (12%)" />
                  <DistributionItem label="Development & Team" percent="15%" color="bg-purple-500" desc="4-year vesting for alignment" />
                  <DistributionItem label="Ecosystem Growth" percent="10%" color="bg-secondary" desc="Partnerships, listings, grants" />
                  <DistributionItem label="Community Rewards" percent="10%" color="bg-primary" desc="Presale (1%) + airdrops (9%)" />
                </div>
              </div>
<div className="order-1 lg:order-2 space-y-5">
              <h2 className="text-2xl md:text-3xl font-display font-bold">Fair Launch Economics</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                We designed Signal to be fair and sustainable. As your Trust Network Access, it powers governance, staking, and all transactions across the Trust Layer ecosystem.
              </p>
              <div className="grid grid-cols-2 gap-3">
                <GlassCard hover={false}>
                  <div className="p-4">
                    <div className="text-[10px] text-white/40 uppercase tracking-wider mb-1">Total Supply</div>
                    <div className="text-lg font-bold font-mono text-white">1B SIG</div>
                  </div>
<GlassCard hover={false}>
                  <div className="p-4">
                    <div className="text-[10px] text-white/40 uppercase tracking-wider mb-1">Network</div>
                    <div className="text-lg font-bold font-mono text-white">Trust Layer L1</div>
                  </div>
</div>
              <div className="flex items-center gap-2 pt-2">
                <Badge className="bg-primary/20 text-primary border-primary/30 text-xs">
                  <Sparkles className="w-3 h-3 mr-1" />
                  Launch: Coming Soon
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
            <motion.div 
              whileHover={{ scale: 1.02, y: -4 }}
              className="relative overflow-hidden rounded-2xl border border-amber-500/30 group" 
              style={{ boxShadow: '0 0 40px rgba(245,158,11,0.15)' }}
              data-testid="card-tier-founder"
            >
              <img src={quantumImg} alt="Founder Tier" className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-amber-900/30" />
              <div className="p-6 relative z-10">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center backdrop-blur-sm">
                    <Crown className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-white">Founder Tier</h3>
                    <Badge className="bg-amber-500/20 text-amber-400 text-[10px]">Limited to 100</Badge>
                  </div>
                </div>
                <ul className="space-y-2 text-sm text-white/80">
                  <li className="flex items-center gap-2"><Sparkles className="w-3 h-3 text-amber-400" /> 10,000 SIG allocation</li>
                  <li className="flex items-center gap-2"><TrendingUp className="w-3 h-3 text-amber-400" /> 2x staking multiplier</li>
                  <li className="flex items-center gap-2"><Star className="w-3 h-3 text-amber-400" /> Exclusive NFT badge</li>
                  <li className="flex items-center gap-2"><Users className="w-3 h-3 text-amber-400" /> Private Discord access</li>
                </ul>
              </div>
            </motion.div>

            <motion.div 
              whileHover={{ scale: 1.02, y: -4 }}
              className="relative overflow-hidden rounded-2xl border border-purple-500/30 group" 
              style={{ boxShadow: '0 0 40px rgba(168,85,247,0.15)' }}
              data-testid="card-tier-genesis"
            >
              <img src={cyberpunkImg} alt="Genesis Tier" className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-purple-900/30" />
              <div className="p-6 relative z-10">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center backdrop-blur-sm">
                    <Star className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-white">Genesis Tier</h3>
                    <Badge className="bg-purple-500/20 text-purple-400 text-[10px]">Limited to 500</Badge>
                  </div>
                </div>
                <ul className="space-y-2 text-sm text-white/80">
                  <li className="flex items-center gap-2"><Sparkles className="w-3 h-3 text-purple-400" /> 5,000 SIG allocation</li>
                  <li className="flex items-center gap-2"><TrendingUp className="w-3 h-3 text-purple-400" /> 1.5x staking multiplier</li>
                  <li className="flex items-center gap-2"><Star className="w-3 h-3 text-purple-400" /> Early access to features</li>
                  <li className="flex items-center gap-2"><Gift className="w-3 h-3 text-purple-400" /> Priority airdrop eligibility</li>
                </ul>
              </div>
            </motion.div>

            <motion.div 
              whileHover={{ scale: 1.02, y: -4 }}
              className="relative overflow-hidden rounded-2xl border border-blue-500/30 group" 
              style={{ boxShadow: '0 0 40px rgba(59,130,246,0.15)' }}
              data-testid="card-tier-beta"
            >
              <img src={spaceImg} alt="Beta Tester" className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-blue-900/30" />
              <div className="p-6 relative z-10">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center backdrop-blur-sm">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-white">Beta Tester</h3>
                    <Badge className="bg-blue-500/20 text-blue-400 text-[10px]">Open Enrollment</Badge>
                  </div>
                </div>
                <ul className="space-y-2 text-sm text-white/80">
                  <li className="flex items-center gap-2"><Sparkles className="w-3 h-3 text-blue-400" /> 1,000 SIG allocation</li>
                  <li className="flex items-center gap-2"><TrendingUp className="w-3 h-3 text-blue-400" /> 1.25x staking multiplier</li>
                  <li className="flex items-center gap-2"><Star className="w-3 h-3 text-blue-400" /> Bug bounty rewards</li>
                  <li className="flex items-center gap-2"><Gift className="w-3 h-3 text-blue-400" /> Contribution-based bonuses</li>
                </ul>
              </div>
            </motion.div>
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
            <h2 className="text-2xl md:text-3xl font-display font-bold mb-3">Protocol Revenue Model</h2>
            <p className="text-sm text-muted-foreground max-w-lg mx-auto">
              No buy or sell taxes. Trust Layer generates sustainable revenue through protocol fees across the ecosystem.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <GlassCard hover={false}>
              <div className="p-4 text-center">
                <div className="text-2xl font-bold text-green-400 mb-1">0%</div>
                <div className="text-xs text-muted-foreground">Buy Tax</div>
              </div>
<GlassCard hover={false}>
              <div className="p-4 text-center">
                <div className="text-2xl font-bold text-green-400 mb-1">0%</div>
                <div className="text-xs text-muted-foreground">Sell Tax</div>
              </div>
<GlassCard hover={false}>
              <div className="p-4 text-center">
                <div className="text-2xl font-bold text-primary mb-1">0.3%</div>
                <div className="text-xs text-muted-foreground">DEX Swap Fee</div>
              </div>
<GlassCard hover={false}>
              <div className="p-4 text-center">
                <div className="text-2xl font-bold text-secondary mb-1">2.5%</div>
                <div className="text-xs text-muted-foreground">NFT Market Fee</div>
              </div>
</div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <GlassCard className="p-5">
              <h4 className="font-bold mb-3 flex items-center gap-2">
                <ArrowRightLeft className="w-4 h-4 text-cyan-400" /> Transaction Fees
              </h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Minimal gas fees (0.0001 SIG) on all on-chain transactions fund network operations and validator rewards.
              </p>
<GlassCard className="p-5">
              <h4 className="font-bold mb-3 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-green-400" /> No Burns
              </h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Fixed 1B supply. Protocol fees fund staking rewards and treasury, ensuring sustainable growth without artificial scarcity.
              </p>
<GlassCard className="p-5">
              <h4 className="font-bold mb-3 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-blue-400" /> Vesting & Lockups
              </h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Team allocation locked with 6-month cliff and 12-month vesting. Long-term alignment prevents early dumping.
              </p>
</div>

          <GlassCard className="p-5 mt-6">
            <h4 className="font-bold mb-4 text-center">Revenue Streams</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-lg font-bold text-cyan-400">DEX Swaps</div>
                <div className="text-xs text-muted-foreground">0.3% per trade</div>
              </div>
              <div>
                <div className="text-lg font-bold text-purple-400">NFT Sales</div>
                <div className="text-xs text-muted-foreground">2.5% seller fee</div>
              </div>
              <div>
                <div className="text-lg font-bold text-pink-400">Launchpad</div>
                <div className="text-xs text-muted-foreground">Listing fees</div>
              </div>
              <div>
                <div className="text-lg font-bold text-amber-400">Bridge</div>
                <div className="text-xs text-muted-foreground">0.1% crossing fee</div>
              </div>
            </div>
</div>
      </section>

      <section className="py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-10">
            <Badge className="mb-4 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 text-white border-0">
              <PieChart className="w-3 h-3 mr-1" /> Full Transparency
            </Badge>
            <h2 className="text-2xl md:text-3xl font-display font-bold mb-3">Treasury Allocation</h2>
            <p className="text-sm text-muted-foreground max-w-lg mx-auto">
              Know exactly where every Signal goes. Transparent allocation across development, marketing, and community rewards.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            <GlassCard hover className="border border-cyan-500/30 hover:shadow-lg hover:shadow-cyan-500/20 transition-all">
              <div className="p-4 text-center">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/20 flex items-center justify-center mx-auto mb-2">
                  <Code className="w-5 h-5 text-cyan-400" />
                </div>
                <div className="text-xl font-bold text-cyan-400">30%</div>
                <div className="text-[10px] text-muted-foreground">Development</div>
              </div>
<GlassCard hover className="border border-purple-500/30 hover:shadow-lg hover:shadow-purple-500/20 transition-all">
              <div className="p-4 text-center">
                <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center mx-auto mb-2">
                  <Megaphone className="w-5 h-5 text-purple-400" />
                </div>
                <div className="text-xl font-bold text-purple-400">20%</div>
                <div className="text-[10px] text-muted-foreground">Marketing</div>
              </div>
<GlassCard hover className="border border-green-500/30 hover:shadow-lg hover:shadow-green-500/20 transition-all">
              <div className="p-4 text-center">
                <div className="w-10 h-10 rounded-xl bg-green-500/20 flex items-center justify-center mx-auto mb-2">
                  <TrendingUp className="w-5 h-5 text-green-400" />
                </div>
                <div className="text-xl font-bold text-green-400">20%</div>
                <div className="text-[10px] text-muted-foreground">Staking</div>
              </div>
<GlassCard hover className="border border-amber-500/30 hover:shadow-lg hover:shadow-amber-500/20 transition-all">
              <div className="p-4 text-center">
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center mx-auto mb-2">
                  <Users className="w-5 h-5 text-amber-400" />
                </div>
                <div className="text-xl font-bold text-amber-400">15%</div>
                <div className="text-[10px] text-muted-foreground">Team</div>
              </div>
<GlassCard hover className="border border-blue-500/30 hover:shadow-lg hover:shadow-blue-500/20 transition-all">
              <div className="p-4 text-center">
                <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center mx-auto mb-2">
                  <Settings className="w-5 h-5 text-blue-400" />
                </div>
                <div className="text-xl font-bold text-blue-400">10%</div>
                <div className="text-[10px] text-muted-foreground">Operations</div>
              </div>
<GlassCard hover className="border border-pink-500/30 hover:shadow-lg hover:shadow-pink-500/20 transition-all">
              <div className="p-4 text-center">
                <div className="w-10 h-10 rounded-xl bg-pink-500/20 flex items-center justify-center mx-auto mb-2">
                  <Shield className="w-5 h-5 text-pink-400" />
                </div>
                <div className="text-xl font-bold text-pink-400">5%</div>
                <div className="text-[10px] text-muted-foreground">Reserve</div>
              </div>
</div>

          <div className="text-center mt-6">
            <Link href="/treasury">
              <Button variant="outline" className="gap-2 rounded-full border-white/20 hover:bg-white/5" data-testid="button-view-treasury">
                <ExternalLink className="w-4 h-4" /> View Full Treasury Report
              </Button>
            </Link>
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
                Pay $24 once. Get lifetime access. Receive 35,000 Signal on launch day.
                Only 10,000 spots available — limited time offer.
              </p>
              <Link href="/founder-program">
                <Button size="lg" className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-bold rounded-full gap-2" data-testid="button-founder-program">
                  <Crown className="w-5 h-5" /> Join Legacy Founder Program
                </Button>
              </Link>
            </div>
</div>
      </section>

      <section className="py-8 bg-slate-950/50">
        <div className="container mx-auto px-4">
          <DYORDisclaimer variant="compact" />
        </div>
      </section>

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
