import { motion } from "framer-motion";
import { ArrowLeft, Coins, Lock, Users, Building, Rocket, Gift, BarChart3, Calendar, CheckCircle, Clock, Sparkles, Shield, TrendingUp } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { Footer } from "@/components/footer";
import { usePageAnalytics } from "@/hooks/use-analytics";
import { GlassCard } from "@/components/glass-card";
import orbitLogo from "@assets/generated_images/futuristic_abstract_geometric_logo_symbol_for_orbit.png";

const TOKEN_ALLOCATION = [
  { name: "Community & Ecosystem", value: 40, color: "#06b6d4", icon: Users, description: "Rewards, airdrops, liquidity mining, ecosystem grants" },
  { name: "Team & Advisors", value: 15, color: "#a855f7", icon: Building, description: "Core team and strategic advisors (4-year vesting)" },
  { name: "Development Fund", value: 20, color: "#ec4899", icon: Rocket, description: "Protocol development, infrastructure, security audits" },
  { name: "Treasury Reserve", value: 15, color: "#f59e0b", icon: Shield, description: "Strategic reserves, partnerships, emergency fund" },
  { name: "Public Sale", value: 10, color: "#22c55e", icon: Gift, description: "Initial token offering and exchange listings" },
];

const VESTING_SCHEDULE = [
  { category: "Community", cliff: "None", vesting: "Released on milestones", unlock: "10% at TGE, 90% over 24 months" },
  { category: "Team", cliff: "12 months", vesting: "48 months linear", unlock: "0% at TGE, unlocks monthly after cliff" },
  { category: "Advisors", cliff: "6 months", vesting: "24 months linear", unlock: "0% at TGE, unlocks monthly after cliff" },
  { category: "Development", cliff: "None", vesting: "As needed for development", unlock: "Controlled by multisig DAO" },
  { category: "Treasury", cliff: "6 months", vesting: "36 months linear", unlock: "5% at TGE for liquidity" },
  { category: "Public Sale", cliff: "None", vesting: "Immediate", unlock: "100% at TGE" },
];

const UTILITY_CASES = [
  { title: "Transaction Fees", description: "Pay gas fees across the DarkWave network", icon: Coins },
  { title: "Staking Rewards", description: "Stake DWC to earn passive yield and secure the network", icon: TrendingUp },
  { title: "Governance", description: "Vote on protocol upgrades and treasury allocation", icon: Users },
  { title: "Chronicles Access", description: "Purchase in-game items, eras, and premium features", icon: Sparkles },
  { title: "DEX Trading", description: "Trade tokens and provide liquidity on DarkWave DEX", icon: BarChart3 },
  { title: "NFT Marketplace", description: "Buy, sell, and mint NFTs using DWC", icon: Gift },
];

export default function Tokenomics() {
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
            <Badge variant="outline" className="border-purple-500/50 text-purple-400 bg-purple-500/10 text-[10px] sm:text-xs whitespace-nowrap">
              <Coins className="w-3 h-3 mr-1" /> Tokenomics
            </Badge>
            <Link href="/token">
              <Button variant="ghost" size="sm" className="h-8 text-xs gap-1 hover:bg-white/5 px-2">
                <ArrowLeft className="w-3 h-3" />
                <span className="hidden sm:inline">Back</span>
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      <section className="pt-20 pb-8 px-4">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <Badge variant="outline" className="px-3 py-1 border-purple-500/50 text-purple-400 bg-purple-500/10 rounded-full text-xs tracking-wider uppercase mb-4">
              Token Economics
            </Badge>
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400">$DWC Tokenomics</span>
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Designed for sustainability, utility, and long-term value. No burn mechanics, no inflation traps.
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-12">
            <GlassCard glow hover={false}>
              <div className="p-4 text-center">
                <div className="text-2xl md:text-3xl font-bold text-white">100M</div>
                <div className="text-[10px] text-white/50 uppercase tracking-wider">Total Supply</div>
              </div>
            </GlassCard>
            <GlassCard glow hover={false}>
              <div className="p-4 text-center">
                <div className="text-2xl md:text-3xl font-bold text-cyan-400">18</div>
                <div className="text-[10px] text-white/50 uppercase tracking-wider">Decimals</div>
              </div>
            </GlassCard>
            <GlassCard glow hover={false}>
              <div className="p-4 text-center">
                <div className="text-2xl md:text-3xl font-bold text-purple-400">0%</div>
                <div className="text-[10px] text-white/50 uppercase tracking-wider">Burn Rate</div>
              </div>
            </GlassCard>
            <GlassCard glow hover={false}>
              <div className="p-4 text-center">
                <div className="text-2xl md:text-3xl font-bold text-pink-400">Feb 2026</div>
                <div className="text-[10px] text-white/50 uppercase tracking-wider">TGE Date</div>
              </div>
            </GlassCard>
          </div>
        </div>
      </section>

      <section className="py-8 px-4 bg-white/[0.02]">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-8"
          >
            <h2 className="text-2xl font-display font-bold mb-2 flex items-center gap-3">
              <BarChart3 className="w-6 h-6 text-cyan-400" />
              Token Allocation
            </h2>
            <p className="text-muted-foreground text-sm">Distribution designed for ecosystem growth and long-term sustainability</p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div className="h-[350px] relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={TOKEN_ALLOCATION}
                    cx="50%"
                    cy="50%"
                    innerRadius={80}
                    outerRadius={140}
                    paddingAngle={2}
                    dataKey="value"
                    stroke="transparent"
                  >
                    {TOKEN_ALLOCATION.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className="bg-slate-900/95 border border-white/10 rounded-lg p-3 text-sm">
                            <div className="font-bold text-white">{data.name}</div>
                            <div className="text-white/70">{data.value}% of supply</div>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="text-center">
                  <div className="text-3xl font-bold text-white">100M</div>
                  <div className="text-xs text-white/50">DWC</div>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              {TOKEN_ALLOCATION.map((item, index) => (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <GlassCard hover>
                    <div className="p-4 flex items-center gap-4">
                      <div 
                        className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                        style={{ backgroundColor: `${item.color}20` }}
                      >
                        <item.icon className="w-5 h-5" style={{ color: item.color }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium text-white text-sm">{item.name}</span>
                          <span className="font-bold text-lg" style={{ color: item.color }}>{item.value}%</span>
                        </div>
                        <p className="text-xs text-white/50 truncate">{item.description}</p>
                      </div>
                    </div>
                  </GlassCard>
                </motion.div>
              ))}
            </div>
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
            <h2 className="text-2xl font-display font-bold mb-2 flex items-center gap-3">
              <Lock className="w-6 h-6 text-purple-400" />
              Vesting Schedule
            </h2>
            <p className="text-muted-foreground text-sm">Structured unlocks to ensure long-term alignment and prevent dumps</p>
          </motion.div>

          <GlassCard glow hover={false}>
            <div className="overflow-x-auto">
              <table className="w-full text-sm" data-testid="table-vesting">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left p-4 text-white/50 font-medium text-xs uppercase tracking-wider">Category</th>
                    <th className="text-left p-4 text-white/50 font-medium text-xs uppercase tracking-wider">Cliff</th>
                    <th className="text-left p-4 text-white/50 font-medium text-xs uppercase tracking-wider">Vesting Period</th>
                    <th className="text-left p-4 text-white/50 font-medium text-xs uppercase tracking-wider">TGE Unlock</th>
                  </tr>
                </thead>
                <tbody>
                  {VESTING_SCHEDULE.map((row, index) => (
                    <motion.tr
                      key={row.category}
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.05 }}
                      className="border-b border-white/5 hover:bg-white/[0.02] transition-colors"
                    >
                      <td className="p-4 font-medium text-white">{row.category}</td>
                      <td className="p-4 text-white/70">
                        <div className="flex items-center gap-2">
                          {row.cliff === "None" ? (
                            <CheckCircle className="w-4 h-4 text-green-400" />
                          ) : (
                            <Clock className="w-4 h-4 text-amber-400" />
                          )}
                          {row.cliff}
                        </div>
                      </td>
                      <td className="p-4 text-white/70">{row.vesting}</td>
                      <td className="p-4 text-white/70">{row.unlock}</td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </GlassCard>
        </div>
      </section>

      <section className="py-12 px-4 bg-white/[0.02]">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-8"
          >
            <h2 className="text-2xl font-display font-bold mb-2 flex items-center gap-3">
              <Sparkles className="w-6 h-6 text-pink-400" />
              Token Utility
            </h2>
            <p className="text-muted-foreground text-sm">DWC powers every aspect of the DarkWave ecosystem</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {UTILITY_CASES.map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <GlassCard hover glow>
                  <div className="p-5">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500/20 to-purple-500/20 flex items-center justify-center mb-3">
                      <item.icon className="w-5 h-5 text-cyan-400" />
                    </div>
                    <h3 className="font-bold text-white mb-1">{item.title}</h3>
                    <p className="text-xs text-white/50">{item.description}</p>
                  </div>
                </GlassCard>
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
          >
            <GlassCard glow hover={false}>
              <div className="p-6 md:p-8">
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 flex items-center justify-center shrink-0">
                    <Shield className="w-6 h-6 text-amber-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2">No Burn, No Inflation</h3>
                    <p className="text-white/70 text-sm leading-relaxed">
                      DWC maintains a fixed supply of 100 million tokens. We don't believe in artificial scarcity through burn 
                      mechanics or hidden inflation through excessive minting. The value of DWC comes from genuine utility and 
                      ecosystem growth, not tokenomic tricks.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 rounded-lg bg-white/[0.03] border border-white/5">
                    <div className="text-2xl font-bold text-green-400 mb-1">Fixed</div>
                    <div className="text-xs text-white/50">Supply - No new tokens ever minted</div>
                  </div>
                  <div className="p-4 rounded-lg bg-white/[0.03] border border-white/5">
                    <div className="text-2xl font-bold text-cyan-400 mb-1">Transparent</div>
                    <div className="text-xs text-white/50">All allocations on-chain and verifiable</div>
                  </div>
                  <div className="p-4 rounded-lg bg-white/[0.03] border border-white/5">
                    <div className="text-2xl font-bold text-purple-400 mb-1">Sustainable</div>
                    <div className="text-xs text-white/50">Revenue-backed, not speculation-driven</div>
                  </div>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        </div>
      </section>

      <section className="py-12 px-4">
        <div className="container mx-auto max-w-6xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl font-display font-bold mb-4">Ready to Explore?</h2>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto text-sm">
              Dive deeper into the DarkWave ecosystem and discover how DWC powers everything.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link href="/executive-summary">
                <Button size="lg" className="bg-white text-black hover:bg-white/90 font-bold rounded-full" data-testid="button-exec-summary">
                  Executive Summary
                </Button>
              </Link>
              <Link href="/doc-hub">
                <Button size="lg" variant="outline" className="border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10 rounded-full" data-testid="button-whitepaper">
                  Full Whitepaper
                </Button>
              </Link>
              <Link href="/presale">
                <Button size="lg" variant="outline" className="border-purple-500/30 text-purple-400 hover:bg-purple-500/10 rounded-full" data-testid="button-presale">
                  Join Presale
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
