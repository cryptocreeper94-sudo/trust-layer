import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "wouter";
import {
  BarChart3, PieChart, TrendingUp, TrendingDown, Users,
  Wallet, AlertTriangle, Shield, Activity, ExternalLink, Copy,
  ChevronDown, Info, Zap, Target
} from "lucide-react";
import { BackButton } from "@/components/page-nav";
import { 
  AreaChart, Area, PieChart as RePieChart, Pie, Cell, BarChart, Bar,
  ResponsiveContainer, XAxis, YAxis, Tooltip
} from "recharts";
import { Footer } from "@/components/footer";
import { GlassCard } from "@/components/glass-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import darkwaveLogo from "@assets/generated_images/darkwave_token_transparent.png";

const holderDistribution = [
  { name: "Top 10", value: 25, color: "#ef4444" },
  { name: "Top 11-50", value: 15, color: "#f59e0b" },
  { name: "Top 51-100", value: 10, color: "#22c55e" },
  { name: "Others", value: 50, color: "#8b5cf6" },
];

const holderGrowth = Array.from({ length: 30 }, (_, i) => ({
  date: `Day ${i + 1}`,
  holders: 5000 + Math.floor(Math.random() * 500) + i * 150,
}));

const volumeData = Array.from({ length: 24 }, (_, i) => ({
  hour: `${i}:00`,
  buy: 50000 + Math.random() * 100000,
  sell: 40000 + Math.random() * 80000,
}));

const topHolders = [
  { address: "0x7a23...f8d1", balance: 12500000, percent: 12.5, label: "Team Wallet", change: 0 },
  { address: "0x8b34...c2e5", balance: 8500000, percent: 8.5, label: "Staking Contract", change: 5.2 },
  { address: "0x9d45...a3f7", balance: 5200000, percent: 5.2, label: "Whale #1", change: -2.1 },
  { address: "0x1e56...d4g8", balance: 3800000, percent: 3.8, label: "DEX Liquidity", change: 0 },
  { address: "0x2f67...e5h9", balance: 2900000, percent: 2.9, label: "Whale #2", change: 8.5 },
];

const smartMoneyFlow = [
  { time: "Today", inflow: 450000, outflow: 320000 },
  { time: "Yesterday", inflow: 380000, outflow: 420000 },
  { time: "2 days ago", inflow: 520000, outflow: 280000 },
  { time: "3 days ago", inflow: 290000, outflow: 350000 },
  { time: "4 days ago", inflow: 610000, outflow: 400000 },
];

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

export default function TokenAnalytics() {
  const [timeframe, setTimeframe] = useState("7d");
  
  const riskScore = 32;
  const riskLevel = riskScore < 40 ? "Low" : riskScore < 70 ? "Medium" : "High";
  const riskColor = riskScore < 40 ? "text-green-400" : riskScore < 70 ? "text-yellow-400" : "text-red-400";

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
            className="flex items-center gap-4 mb-6"
          >
            <motion.div 
              className="p-3 rounded-2xl bg-primary/20 border border-primary/30"
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
            >
              <img src={darkwaveLogo} alt="DWC" className="w-10 h-10" />
            </motion.div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-display font-bold">DWC Analytics</h1>
                <Badge className="bg-green-500/20 text-green-400">Verified</Badge>
              </div>
              <p className="text-sm text-muted-foreground">DarkWave Coin • Deep token analysis</p>
            </div>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 auto-rows-[120px] md:auto-rows-[140px]">
            
            <BentoCard colSpan={2} rowSpan={1} delay={0.1}>
              <div className="p-4 h-full flex flex-col justify-between">
                <div className="flex items-center gap-2">
                  <Shield className={`w-5 h-5 ${riskColor}`} />
                  <span className="font-bold">Risk Score</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="relative w-16 h-16">
                    <svg className="w-16 h-16 transform -rotate-90">
                      <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="6" fill="none" className="text-white/10" />
                      <circle 
                        cx="32" cy="32" r="28" 
                        stroke="currentColor" 
                        strokeWidth="6" 
                        fill="none" 
                        strokeDasharray={`${(100 - riskScore) * 1.76} 176`}
                        className={riskColor}
                      />
                    </svg>
                    <span className={`absolute inset-0 flex items-center justify-center text-lg font-bold ${riskColor}`}>
                      {riskScore}
                    </span>
                  </div>
                  <div>
                    <p className={`font-bold ${riskColor}`}>{riskLevel} Risk</p>
                    <p className="text-xs text-muted-foreground">Based on concentration & volatility</p>
                  </div>
                </div>
              </div>
            </BentoCard>

            <BentoCard colSpan={2} rowSpan={2} delay={0.15}>
              <div className="p-4 h-full flex flex-col">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <PieChart className="w-4 h-4 text-primary" />
                    <span className="font-bold">Holder Distribution</span>
                  </div>
                </div>
                <div className="flex-1 flex items-center gap-4">
                  <div className="w-32 h-32">
                    <ResponsiveContainer width="100%" height="100%">
                      <RePieChart>
                        <Pie
                          data={holderDistribution}
                          cx="50%"
                          cy="50%"
                          innerRadius={35}
                          outerRadius={50}
                          dataKey="value"
                          strokeWidth={0}
                        >
                          {holderDistribution.map((entry, i) => (
                            <Cell key={i} fill={entry.color} />
                          ))}
                        </Pie>
                      </RePieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="flex-1 space-y-2">
                    {holderDistribution.map((item, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                        <span className="text-xs flex-1">{item.name}</span>
                        <span className="text-xs font-mono">{item.value}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </BentoCard>

            <BentoCard colSpan={2} rowSpan={1} delay={0.2}>
              <div className="p-4 h-full flex flex-col justify-between">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-blue-400" />
                  <span className="font-bold">Unique Holders</span>
                </div>
                <div>
                  <div className="text-2xl font-bold">12,458</div>
                  <div className="flex items-center gap-1 text-green-400 text-xs">
                    <TrendingUp className="w-3 h-3" />
                    +342 (24h)
                  </div>
                </div>
              </div>
            </BentoCard>

            <BentoCard colSpan={2} rowSpan={2} delay={0.25}>
              <div className="p-4 h-full flex flex-col">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Activity className="w-4 h-4 text-cyan-400" />
                    <span className="font-bold">Holder Growth</span>
                  </div>
                  <div className="flex gap-1">
                    {["24h", "7d", "30d"].map(t => (
                      <Button
                        key={t}
                        variant={timeframe === t ? "default" : "ghost"}
                        size="sm"
                        className="h-6 px-2 text-[10px]"
                        onClick={() => setTimeframe(t)}
                      >
                        {t}
                      </Button>
                    ))}
                  </div>
                </div>
                <div className="flex-1">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={holderGrowth}>
                      <defs>
                        <linearGradient id="holderGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#06b6d4" stopOpacity={0.3} />
                          <stop offset="100%" stopColor="#06b6d4" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="date" hide />
                      <YAxis hide domain={['auto', 'auto']} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'rgba(0,0,0,0.9)',
                          border: '1px solid rgba(255,255,255,0.1)',
                          borderRadius: '8px',
                        }}
                      />
                      <Area type="monotone" dataKey="holders" stroke="#06b6d4" strokeWidth={2} fill="url(#holderGrad)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </BentoCard>

            <BentoCard colSpan={2} rowSpan={1} delay={0.3}>
              <div className="p-4 h-full flex flex-col justify-between">
                <div className="flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-purple-400" />
                  <span className="font-bold">24h Volume</span>
                </div>
                <div className="flex items-center gap-4">
                  <div>
                    <div className="text-xl font-bold">$2.4M</div>
                    <div className="flex items-center gap-2 text-xs">
                      <span className="text-green-400">Buy: $1.5M</span>
                      <span className="text-red-400">Sell: $0.9M</span>
                    </div>
                  </div>
                </div>
              </div>
            </BentoCard>

            <BentoCard colSpan={4} rowSpan={2} delay={0.35}>
              <div className="p-4 h-full flex flex-col">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Wallet className="w-4 h-4 text-amber-400" />
                    <span className="font-bold">Top Holders</span>
                  </div>
                  <Button variant="ghost" size="sm" className="text-xs">View All</Button>
                </div>
                <div className="flex-1 space-y-2 overflow-y-auto">
                  {topHolders.map((holder, i) => (
                    <motion.div
                      key={holder.address}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 + i * 0.1 }}
                      className="flex items-center gap-3 p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                    >
                      <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold">
                        {i + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-sm">{holder.address}</span>
                          {holder.label && (
                            <Badge variant="outline" className="text-[9px]">{holder.label}</Badge>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-mono text-sm">{(holder.balance/1000000).toFixed(2)}M</div>
                        <div className="text-[10px] text-muted-foreground">{holder.percent}%</div>
                      </div>
                      <div className={`text-xs ${holder.change > 0 ? 'text-green-400' : holder.change < 0 ? 'text-red-400' : 'text-muted-foreground'}`}>
                        {holder.change !== 0 && (holder.change > 0 ? '+' : '')}{holder.change}%
                      </div>
                      <Button variant="ghost" size="icon" className="h-6 w-6">
                        <ExternalLink className="w-3 h-3" />
                      </Button>
                    </motion.div>
                  ))}
                </div>
              </div>
            </BentoCard>

            <BentoCard colSpan={2} rowSpan={2} delay={0.4}>
              <div className="p-4 h-full flex flex-col">
                <div className="flex items-center gap-2 mb-3">
                  <Zap className="w-4 h-4 text-yellow-400" />
                  <span className="font-bold">Smart Money Flow</span>
                </div>
                <div className="flex-1 space-y-2">
                  {smartMoneyFlow.map((day, i) => {
                    const netFlow = day.inflow - day.outflow;
                    const isPositive = netFlow > 0;
                    return (
                      <div key={i} className="p-2 rounded-lg bg-white/5">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs text-muted-foreground">{day.time}</span>
                          <span className={`text-xs font-mono ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
                            {isPositive ? '+' : ''}${(netFlow/1000).toFixed(0)}K
                          </span>
                        </div>
                        <div className="flex gap-1 h-2">
                          <div 
                            className="bg-green-500/50 rounded-l"
                            style={{ width: `${(day.inflow / (day.inflow + day.outflow)) * 100}%` }}
                          />
                          <div 
                            className="bg-red-500/50 rounded-r"
                            style={{ width: `${(day.outflow / (day.inflow + day.outflow)) * 100}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
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
