import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "wouter";
import {
  ArrowUpRight, ArrowDownRight, TrendingUp, Wallet, Activity, Fish,
  BarChart3, PieChart, Zap, Bell, Star, Users, Trophy, Target,
  Coins, Lock, Gift, Flame, Sparkles, LineChart, ArrowRight,
  Copy, ExternalLink, RefreshCw, Shield, Layers, Globe
} from "lucide-react";
import { AreaChart, Area, ResponsiveContainer, PieChart as RePieChart, Pie, Cell } from "recharts";
import { GlassCard } from "@/components/glass-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Footer } from "@/components/footer";
import darkwaveLogo from "@assets/generated_images/darkwave_token_transparent.png";

const miniChartData = Array.from({ length: 20 }, (_, i) => ({
  value: 100 + Math.random() * 50 + i * 2,
}));

const portfolioData = [
  { name: "DWC", value: 45, color: "#8b5cf6" },
  { name: "stDWC", value: 30, color: "#06b6d4" },
  { name: "LP Tokens", value: 15, color: "#22c55e" },
  { name: "NFTs", value: 10, color: "#f59e0b" },
];

const recentActivity = [
  { type: "swap", desc: "Swapped 1,000 DWC → 150 USDC", time: "2m ago", icon: ArrowUpRight },
  { type: "stake", desc: "Staked 5,000 DWC", time: "1h ago", icon: Lock },
  { type: "reward", desc: "Claimed 125 DWC rewards", time: "3h ago", icon: Gift },
  { type: "nft", desc: "Minted Genesis NFT #247", time: "1d ago", icon: Sparkles },
];

const topTraders = [
  { name: "whale.dwc", pnl: "+$42,500", winRate: "78%", rank: 1 },
  { name: "satoshi.eth", pnl: "+$31,200", winRate: "72%", rank: 2 },
  { name: "defi_king", pnl: "+$28,900", winRate: "69%", rank: 3 },
];

const whaleAlerts = [
  { amount: "2.5M DWC", type: "buy", time: "Just now" },
  { amount: "1.2M DWC", type: "sell", time: "5m ago" },
  { amount: "800K DWC", type: "transfer", time: "12m ago" },
];

function BentoCard({ 
  children, 
  className = "", 
  colSpan = 1, 
  rowSpan = 1,
  glow = false,
  glowColor = "primary",
  delay = 0,
  href,
}: { 
  children: React.ReactNode; 
  className?: string; 
  colSpan?: number; 
  rowSpan?: number;
  glow?: boolean;
  glowColor?: string;
  delay?: number;
  href?: string;
}) {
  const content = (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay, duration: 0.4, ease: "easeOut" }}
      whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
      className={`
        relative overflow-hidden rounded-2xl
        bg-gradient-to-br from-white/[0.08] to-white/[0.02]
        border border-white/[0.08]
        backdrop-blur-xl
        ${glow ? `shadow-lg shadow-${glowColor}/10` : ''}
        ${className}
      `}
      style={{
        gridColumn: `span ${colSpan}`,
        gridRow: `span ${rowSpan}`,
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent opacity-50" />
      <div className="relative h-full">{children}</div>
    </motion.div>
  );

  if (href) {
    return <Link href={href}>{content}</Link>;
  }
  return content;
}

export default function DashboardPro() {
  const [currentPrice, setCurrentPrice] = useState(0.1523);
  const [priceChange, setPriceChange] = useState(5.24);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPrice(prev => prev + (Math.random() - 0.5) * 0.001);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-background/80 backdrop-blur-xl">
        <div className="container mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <img src={darkwaveLogo} alt="DarkWave" className="w-7 h-7" />
            <span className="font-display font-bold text-lg">DarkWave</span>
            <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0 text-[9px]">PRO</Badge>
          </Link>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="w-4 h-4" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
            </Button>
            <Button variant="ghost" size="sm" className="gap-2">
              <Wallet className="w-4 h-4" />
              <span className="hidden sm:inline font-mono">0x7a23...f8d1</span>
            </Button>
          </div>
        </div>
      </nav>

      <main className="pt-20 pb-8 px-4">
        <div className="container mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <h1 className="text-2xl md:text-3xl font-display font-bold mb-1">
              Welcome back, <span className="text-primary">Trader</span>
            </h1>
            <p className="text-sm text-muted-foreground">Here's your DarkWave ecosystem at a glance</p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 md:gap-4 auto-rows-[120px] md:auto-rows-[140px]">
            
            <BentoCard colSpan={2} rowSpan={2} glow glowColor="green" delay={0.1} href="/trading">
              <div className="p-4 h-full flex flex-col">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <motion.img 
                      src={darkwaveLogo} 
                      alt="DWC" 
                      className="w-8 h-8"
                      animate={{ rotate: [0, 5, -5, 0] }}
                      transition={{ duration: 4, repeat: Infinity }}
                    />
                    <div>
                      <span className="font-bold">DWC/USD</span>
                      <Badge className="ml-2 bg-green-500/20 text-green-400 text-[9px]">+{priceChange.toFixed(2)}%</Badge>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Star className="w-4 h-4" />
                  </Button>
                </div>
                <div className="flex-1 flex items-center">
                  <motion.span 
                    className="text-4xl md:text-5xl font-bold"
                    key={currentPrice}
                    initial={{ opacity: 0.5 }}
                    animate={{ opacity: 1 }}
                  >
                    ${currentPrice.toFixed(4)}
                  </motion.span>
                </div>
                <div className="h-16 -mx-4 -mb-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={miniChartData}>
                      <defs>
                        <linearGradient id="priceGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#22c55e" stopOpacity={0.3} />
                          <stop offset="100%" stopColor="#22c55e" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <Area type="monotone" dataKey="value" stroke="#22c55e" strokeWidth={2} fill="url(#priceGrad)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </BentoCard>

            <BentoCard colSpan={2} rowSpan={1} delay={0.15} href="/portfolio">
              <div className="p-4 h-full flex items-center gap-4">
                <div className="w-20 h-20">
                  <ResponsiveContainer width="100%" height="100%">
                    <RePieChart>
                      <Pie data={portfolioData} cx="50%" cy="50%" innerRadius={25} outerRadius={35} dataKey="value" strokeWidth={0}>
                        {portfolioData.map((entry, i) => (
                          <Cell key={i} fill={entry.color} />
                        ))}
                      </Pie>
                    </RePieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex-1">
                  <p className="text-[10px] text-muted-foreground mb-1">Portfolio Value</p>
                  <p className="text-2xl font-bold">$12,458</p>
                  <div className="flex items-center gap-1 text-green-400 text-xs">
                    <ArrowUpRight className="w-3 h-3" />
                    +$842 (7.2%)
                  </div>
                </div>
              </div>
            </BentoCard>

            <BentoCard colSpan={2} rowSpan={1} delay={0.2} href="/whale-tracker">
              <div className="p-4 h-full">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Fish className="w-4 h-4 text-cyan-400" />
                    <span className="text-sm font-bold">Whale Alerts</span>
                  </div>
                  <Badge className="bg-cyan-500/20 text-cyan-400 text-[9px] animate-pulse">Live</Badge>
                </div>
                <div className="space-y-1">
                  {whaleAlerts.slice(0, 2).map((alert, i) => (
                    <div key={i} className="flex items-center justify-between text-xs">
                      <span className={alert.type === 'buy' ? 'text-green-400' : alert.type === 'sell' ? 'text-red-400' : 'text-blue-400'}>
                        {alert.type.toUpperCase()} {alert.amount}
                      </span>
                      <span className="text-muted-foreground">{alert.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            </BentoCard>

            <BentoCard colSpan={1} rowSpan={1} delay={0.25} href="/staking">
              <div className="p-4 h-full flex flex-col justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-amber-500/20">
                    <Lock className="w-4 h-4 text-amber-400" />
                  </div>
                </div>
                <div>
                  <p className="text-[10px] text-muted-foreground">Staked</p>
                  <p className="text-lg font-bold">5,000 DWC</p>
                  <p className="text-[10px] text-green-400">12.5% APY</p>
                </div>
              </div>
            </BentoCard>

            <BentoCard colSpan={1} rowSpan={1} delay={0.3} href="/liquid-staking">
              <div className="p-4 h-full flex flex-col justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-blue-500/20">
                    <Layers className="w-4 h-4 text-blue-400" />
                  </div>
                </div>
                <div>
                  <p className="text-[10px] text-muted-foreground">stDWC</p>
                  <p className="text-lg font-bold">5,000</p>
                  <p className="text-[10px] text-blue-400">Liquid Staking</p>
                </div>
              </div>
            </BentoCard>

            <BentoCard colSpan={2} rowSpan={2} delay={0.35}>
              <div className="p-4 h-full flex flex-col">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Trophy className="w-4 h-4 text-amber-400" />
                    <span className="font-bold">Top Traders</span>
                  </div>
                  <Link href="/leaderboard">
                    <Button variant="ghost" size="sm" className="h-6 text-[10px]">View All</Button>
                  </Link>
                </div>
                <div className="flex-1 space-y-2">
                  {topTraders.map((trader, i) => (
                    <motion.div 
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 + i * 0.1 }}
                      className="flex items-center gap-3 p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors cursor-pointer"
                    >
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                        i === 0 ? 'bg-amber-500 text-black' : i === 1 ? 'bg-gray-400 text-black' : 'bg-amber-700 text-white'
                      }`}>
                        {trader.rank}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">{trader.name}</p>
                        <p className="text-[10px] text-muted-foreground">Win rate: {trader.winRate}</p>
                      </div>
                      <span className="text-green-400 font-mono text-sm">{trader.pnl}</span>
                    </motion.div>
                  ))}
                </div>
                <Button variant="outline" className="mt-3 w-full text-xs h-8">
                  <Users className="w-3 h-3 mr-2" />
                  Start Copy Trading
                </Button>
              </div>
            </BentoCard>

            <BentoCard colSpan={2} rowSpan={1} delay={0.4} href="/swap">
              <div className="p-4 h-full flex items-center justify-between">
                <div>
                  <p className="text-[10px] text-muted-foreground mb-1">Quick Swap</p>
                  <p className="font-bold">DWC → USDC</p>
                  <p className="text-xs text-muted-foreground">Best rate: 1 DWC = $0.152</p>
                </div>
                <Button className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0">
                  <Zap className="w-4 h-4 mr-1" />
                  Swap
                </Button>
              </div>
            </BentoCard>

            <BentoCard colSpan={2} rowSpan={2} delay={0.45}>
              <div className="p-4 h-full flex flex-col">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Activity className="w-4 h-4 text-primary" />
                    <span className="font-bold">Recent Activity</span>
                  </div>
                  <Link href="/transactions">
                    <Button variant="ghost" size="sm" className="h-6 text-[10px]">View All</Button>
                  </Link>
                </div>
                <div className="flex-1 space-y-2">
                  {recentActivity.map((activity, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 + i * 0.1 }}
                      className="flex items-center gap-3 p-2 rounded-lg bg-white/5"
                    >
                      <div className="p-2 rounded-lg bg-primary/20">
                        <activity.icon className="w-3 h-3 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs truncate">{activity.desc}</p>
                        <p className="text-[10px] text-muted-foreground">{activity.time}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </BentoCard>

            <BentoCard colSpan={1} rowSpan={1} delay={0.5} href="/nft">
              <div className="p-4 h-full flex flex-col justify-between">
                <div className="p-2 rounded-lg bg-pink-500/20 w-fit">
                  <Sparkles className="w-4 h-4 text-pink-400" />
                </div>
                <div>
                  <p className="text-[10px] text-muted-foreground">NFTs Owned</p>
                  <p className="text-lg font-bold">12</p>
                  <p className="text-[10px] text-pink-400">$2,450 value</p>
                </div>
              </div>
            </BentoCard>

            <BentoCard colSpan={1} rowSpan={1} delay={0.55} href="/referrals">
              <div className="p-4 h-full flex flex-col justify-between">
                <div className="p-2 rounded-lg bg-green-500/20 w-fit">
                  <Gift className="w-4 h-4 text-green-400" />
                </div>
                <div>
                  <p className="text-[10px] text-muted-foreground">Referrals</p>
                  <p className="text-lg font-bold">8</p>
                  <p className="text-[10px] text-green-400">+1,250 DWC earned</p>
                </div>
              </div>
            </BentoCard>

            <BentoCard colSpan={2} rowSpan={1} delay={0.6} href="/quests">
              <div className="p-4 h-full">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Target className="w-4 h-4 text-purple-400" />
                    <span className="font-bold text-sm">Daily Quest</span>
                  </div>
                  <Badge className="bg-purple-500/20 text-purple-400 text-[9px]">3/5</Badge>
                </div>
                <p className="text-xs text-muted-foreground mb-2">Complete 5 swaps to earn 100 DWC</p>
                <Progress value={60} className="h-2" />
              </div>
            </BentoCard>

            <BentoCard colSpan={2} rowSpan={1} delay={0.65} href="/bridge">
              <div className="p-4 h-full flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500/20 to-cyan-500/20">
                    <Globe className="w-5 h-5 text-cyan-400" />
                  </div>
                  <div>
                    <p className="font-bold text-sm">Cross-Chain Bridge</p>
                    <p className="text-[10px] text-muted-foreground">ETH • SOL • Coming Soon</p>
                  </div>
                </div>
                <ArrowRight className="w-5 h-5 text-muted-foreground" />
              </div>
            </BentoCard>

            <BentoCard colSpan={2} rowSpan={1} delay={0.7} href="/network">
              <div className="p-4 h-full flex items-center gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Shield className="w-4 h-4 text-green-400" />
                    <span className="font-bold text-sm">Network Health</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div>
                      <p className="text-lg font-bold">200K+</p>
                      <p className="text-[9px] text-muted-foreground">TPS</p>
                    </div>
                    <div>
                      <p className="text-lg font-bold">400ms</p>
                      <p className="text-[9px] text-muted-foreground">Block Time</p>
                    </div>
                    <div>
                      <p className="text-lg font-bold">99.9%</p>
                      <p className="text-[9px] text-muted-foreground">Uptime</p>
                    </div>
                  </div>
                </div>
              </div>
            </BentoCard>

          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
