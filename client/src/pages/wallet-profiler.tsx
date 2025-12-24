import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "wouter";
import {
  ArrowLeft, Wallet, Search, TrendingUp, TrendingDown, Activity,
  Clock, ExternalLink, Copy, Shield, AlertTriangle, Star, PieChart,
  BarChart3, ArrowUpRight, ArrowDownRight, Filter
} from "lucide-react";
import { 
  AreaChart, Area, PieChart as RePieChart, Pie, Cell,
  ResponsiveContainer, XAxis, YAxis, Tooltip, BarChart, Bar
} from "recharts";
import { Footer } from "@/components/footer";
import { GlassCard } from "@/components/glass-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import darkwaveLogo from "@assets/generated_images/darkwave_token_transparent.png";

const portfolioBreakdown = [
  { name: "DWC", value: 45, color: "#8b5cf6", amount: "125,000", usd: "$18,750" },
  { name: "stDWC", value: 30, color: "#06b6d4", amount: "75,000", usd: "$11,250" },
  { name: "LP Tokens", value: 15, color: "#22c55e", amount: "50,000", usd: "$7,500" },
  { name: "NFTs", value: 10, color: "#f59e0b", amount: "12", usd: "$5,000" },
];

const pnlHistory = Array.from({ length: 30 }, (_, i) => ({
  day: i + 1,
  value: 35000 + (Math.random() - 0.3) * 5000 + i * 300,
}));

const recentTransactions = [
  { type: "swap", from: "10,000 DWC", to: "1,520 USDC", time: "2h ago", hash: "0xabc...", pnl: 152 },
  { type: "stake", from: "5,000 DWC", to: "Staking Pool", time: "1d ago", hash: "0xdef...", pnl: 0 },
  { type: "buy", from: "2,000 USDC", to: "13,200 DWC", time: "2d ago", hash: "0xghi...", pnl: 0 },
  { type: "claim", from: "Rewards", to: "450 DWC", time: "3d ago", hash: "0xjkl...", pnl: 67.5 },
  { type: "sell", from: "8,000 DWC", to: "1,180 USDC", time: "5d ago", hash: "0xmno...", pnl: -42 },
];

const tradingStats = {
  totalTrades: 142,
  winRate: 68,
  avgProfit: 245,
  avgLoss: -180,
  bestTrade: 2450,
  worstTrade: -890,
  profitFactor: 1.85,
};

const monthlyPnL = [
  { month: "Jul", pnl: 1200 },
  { month: "Aug", pnl: -450 },
  { month: "Sep", pnl: 2800 },
  { month: "Oct", pnl: 1650 },
  { month: "Nov", pnl: 3200 },
  { month: "Dec", pnl: 4100 },
];

export default function WalletProfiler() {
  const [searchAddress, setSearchAddress] = useState("0x7a23...f8d1");
  const [isSearching, setIsSearching] = useState(false);

  const walletData = {
    address: "0x7a23...f8d1",
    totalValue: 42500,
    totalPnl: 8750,
    pnlPercent: 25.9,
    age: "245 days",
    label: "Active Trader",
    riskScore: 35,
  };

  return (
    <div className="min-h-screen flex flex-col bg-background overflow-x-hidden">
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-background/90 backdrop-blur-xl">
        <div className="container mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <img src={darkwaveLogo} alt="DarkWave" className="w-7 h-7" />
            <span className="font-display font-bold text-lg tracking-tight hidden sm:inline">DarkWave</span>
          </Link>
          <Link href="/dashboard-pro">
            <Button variant="ghost" size="sm" className="h-8 text-xs">
              <ArrowLeft className="w-3 h-3 mr-1" />
              Dashboard
            </Button>
          </Link>
        </div>
      </nav>

      <main className="flex-1 pt-16 pb-8 px-4">
        <div className="container mx-auto max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-6"
          >
            <div className="flex items-center justify-center gap-2 mb-3">
              <motion.div 
                className="p-3 rounded-2xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-blue-500/30"
                animate={{ 
                  boxShadow: ["0 0 20px rgba(59,130,246,0.2)", "0 0 50px rgba(59,130,246,0.4)", "0 0 20px rgba(59,130,246,0.2)"]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Wallet className="w-7 h-7 text-blue-400" />
              </motion.div>
            </div>
            <h1 className="text-2xl md:text-3xl font-display font-bold mb-2">
              Wallet <span className="text-blue-400">Profiler</span>
            </h1>
            <p className="text-sm text-muted-foreground mb-4">
              Deep analysis of any wallet's activity and performance
            </p>
            
            <div className="max-w-md mx-auto relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Enter wallet address..."
                value={searchAddress}
                onChange={(e) => setSearchAddress(e.target.value)}
                className="pl-10 bg-white/5 border-white/10"
                data-testid="input-wallet-search"
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <GlassCard glow className="p-4 mb-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-blue-500/20 border border-blue-500/30">
                    <Wallet className="w-6 h-6 text-blue-400" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold">{walletData.address}</span>
                      <Button variant="ghost" size="icon" className="h-6 w-6">
                        <Copy className="w-3 h-3" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-6 w-6">
                        <ExternalLink className="w-3 h-3" />
                      </Button>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Badge variant="outline" className="text-[9px]">{walletData.label}</Badge>
                      <span>•</span>
                      <span>Active for {walletData.age}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-2xl font-bold">${walletData.totalValue.toLocaleString()}</p>
                    <p className={`text-xs ${walletData.totalPnl >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {walletData.totalPnl >= 0 ? '+' : ''}${walletData.totalPnl.toLocaleString()} ({walletData.pnlPercent}%)
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className={`px-3 py-1 rounded-lg ${walletData.riskScore < 40 ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                      <Shield className="w-4 h-4 inline mr-1" />
                      <span className="text-xs">Risk: {walletData.riskScore}</span>
                    </div>
                  </div>
                </div>
              </div>
            </GlassCard>

            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 auto-rows-[120px] mb-6">
              
              <GlassCard className="col-span-2 row-span-2 p-4 flex flex-col">
                <div className="flex items-center gap-2 mb-3">
                  <PieChart className="w-4 h-4 text-primary" />
                  <span className="font-bold text-sm">Portfolio</span>
                </div>
                <div className="flex-1 flex items-center gap-4">
                  <div className="w-28 h-28">
                    <ResponsiveContainer width="100%" height="100%">
                      <RePieChart>
                        <Pie data={portfolioBreakdown} cx="50%" cy="50%" innerRadius={30} outerRadius={45} dataKey="value" strokeWidth={0}>
                          {portfolioBreakdown.map((entry, i) => (
                            <Cell key={i} fill={entry.color} />
                          ))}
                        </Pie>
                      </RePieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="flex-1 space-y-1">
                    {portfolioBreakdown.map((item, i) => (
                      <div key={i} className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-1">
                          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                          <span>{item.name}</span>
                        </div>
                        <span className="font-mono text-muted-foreground">{item.usd}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </GlassCard>

              <GlassCard className="col-span-2 row-span-2 p-4 flex flex-col">
                <div className="flex items-center gap-2 mb-3">
                  <TrendingUp className="w-4 h-4 text-green-400" />
                  <span className="font-bold text-sm">P/L History</span>
                </div>
                <div className="flex-1">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={pnlHistory}>
                      <defs>
                        <linearGradient id="pnlGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#22c55e" stopOpacity={0.3} />
                          <stop offset="100%" stopColor="#22c55e" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="day" hide />
                      <YAxis hide domain={['auto', 'auto']} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'rgba(0,0,0,0.9)',
                          border: '1px solid rgba(255,255,255,0.1)',
                          borderRadius: '8px',
                        }}
                        formatter={(value: any) => [`$${value.toLocaleString()}`, 'Value']}
                      />
                      <Area type="monotone" dataKey="value" stroke="#22c55e" strokeWidth={2} fill="url(#pnlGrad)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </GlassCard>

              <GlassCard className="col-span-2 row-span-1 p-3 flex flex-col justify-between">
                <span className="text-[10px] text-muted-foreground">Win Rate</span>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-green-400">{tradingStats.winRate}%</span>
                  <div className="text-right text-xs">
                    <span className="text-green-400">{Math.round(tradingStats.totalTrades * tradingStats.winRate / 100)} W</span>
                    <span className="text-muted-foreground"> / </span>
                    <span className="text-red-400">{Math.round(tradingStats.totalTrades * (100 - tradingStats.winRate) / 100)} L</span>
                  </div>
                </div>
              </GlassCard>

              <GlassCard className="col-span-1 row-span-1 p-3 flex flex-col justify-between">
                <span className="text-[10px] text-muted-foreground">Best Trade</span>
                <span className="text-lg font-bold text-green-400">+${tradingStats.bestTrade}</span>
              </GlassCard>

              <GlassCard className="col-span-1 row-span-1 p-3 flex flex-col justify-between">
                <span className="text-[10px] text-muted-foreground">Worst Trade</span>
                <span className="text-lg font-bold text-red-400">${tradingStats.worstTrade}</span>
              </GlassCard>

              <GlassCard className="col-span-2 row-span-1 p-3 flex flex-col justify-between">
                <span className="text-[10px] text-muted-foreground">Monthly P/L</span>
                <div className="h-10">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={monthlyPnL}>
                      <Bar dataKey="pnl" fill="#8b5cf6" radius={[2, 2, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </GlassCard>

            </div>

            <GlassCard className="p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-primary" />
                  <span className="font-bold">Recent Transactions</span>
                </div>
                <Button variant="ghost" size="sm" className="text-xs gap-1">
                  <Filter className="w-3 h-3" />
                  Filter
                </Button>
              </div>
              <div className="space-y-2">
                {recentTransactions.map((tx, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-center gap-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                  >
                    <div className={`p-2 rounded-lg ${
                      tx.type === 'buy' ? 'bg-green-500/20' :
                      tx.type === 'sell' ? 'bg-red-500/20' :
                      tx.type === 'swap' ? 'bg-blue-500/20' :
                      tx.type === 'stake' ? 'bg-purple-500/20' :
                      'bg-amber-500/20'
                    }`}>
                      {tx.type === 'buy' ? <ArrowDownRight className="w-4 h-4 text-green-400" /> :
                       tx.type === 'sell' ? <ArrowUpRight className="w-4 h-4 text-red-400" /> :
                       <Activity className="w-4 h-4 text-primary" />}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium capitalize">{tx.type}</span>
                        <span className="text-xs text-muted-foreground">{tx.from} → {tx.to}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Clock className="w-3 h-3" />
                        {tx.time}
                        <span className="font-mono">{tx.hash}</span>
                      </div>
                    </div>
                    {tx.pnl !== 0 && (
                      <span className={`font-mono ${tx.pnl > 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {tx.pnl > 0 ? '+' : ''}${tx.pnl}
                      </span>
                    )}
                    <Button variant="ghost" size="icon" className="h-6 w-6">
                      <ExternalLink className="w-3 h-3" />
                    </Button>
                  </motion.div>
                ))}
              </div>
            </GlassCard>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
