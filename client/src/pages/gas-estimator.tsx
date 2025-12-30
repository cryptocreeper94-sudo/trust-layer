import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "wouter";
import {
  Fuel, Zap, Clock, TrendingUp, TrendingDown,
  AlertTriangle, Info, ArrowUpRight, BarChart3
} from "lucide-react";
import { BackButton } from "@/components/page-nav";
import { AreaChart, Area, ResponsiveContainer, BarChart, Bar, XAxis, Tooltip } from "recharts";
import { Footer } from "@/components/footer";
import { GlassCard } from "@/components/glass-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import darkwaveLogo from "@assets/generated_images/darkwave_token_transparent.png";

const gasHistory = Array.from({ length: 24 }, (_, i) => ({
  hour: `${i}:00`,
  low: 0.0001 + Math.random() * 0.0002,
  avg: 0.0002 + Math.random() * 0.0003,
  high: 0.0004 + Math.random() * 0.0004,
}));

const transactionTypes = [
  { type: "Token Transfer", gasUnits: 21000, estimatedCost: "$0.003", time: "< 1s" },
  { type: "Token Swap", gasUnits: 150000, estimatedCost: "$0.02", time: "< 1s" },
  { type: "Add Liquidity", gasUnits: 250000, estimatedCost: "$0.04", time: "< 1s" },
  { type: "NFT Mint", gasUnits: 180000, estimatedCost: "$0.03", time: "< 1s" },
  { type: "Stake DWC", gasUnits: 120000, estimatedCost: "$0.02", time: "< 1s" },
  { type: "Contract Deploy", gasUnits: 3000000, estimatedCost: "$0.45", time: "< 2s" },
];

const networkComparison = [
  { network: "DarkWave", avgFee: 0.02, time: "400ms", color: "#8b5cf6" },
  { network: "Solana", avgFee: 0.00025, time: "400ms", color: "#14f195" },
  { network: "Ethereum", avgFee: 2.50, time: "12s", color: "#627eea" },
  { network: "BSC", avgFee: 0.10, time: "3s", color: "#f0b90b" },
  { network: "Polygon", avgFee: 0.01, time: "2s", color: "#8247e5" },
];

export default function GasEstimator() {
  const [currentGas, setCurrentGas] = useState({
    low: 0.0001,
    avg: 0.00025,
    high: 0.0004,
    trend: "stable" as "up" | "down" | "stable",
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentGas({
        low: 0.0001 + Math.random() * 0.0001,
        avg: 0.0002 + Math.random() * 0.00015,
        high: 0.0003 + Math.random() * 0.0002,
        trend: Math.random() > 0.6 ? "up" : Math.random() > 0.3 ? "down" : "stable",
      });
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const networkLoad = 32;

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
        <div className="container mx-auto max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-6"
          >
            <div className="flex items-center justify-center gap-2 mb-3">
              <motion.div 
                className="p-3 rounded-2xl bg-gradient-to-br from-orange-500/20 to-red-500/20 border border-orange-500/30"
                animate={{ 
                  boxShadow: ["0 0 20px rgba(249,115,22,0.2)", "0 0 50px rgba(249,115,22,0.4)", "0 0 20px rgba(249,115,22,0.2)"]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Fuel className="w-7 h-7 text-orange-400" />
              </motion.div>
            </div>
            <h1 className="text-2xl md:text-3xl font-display font-bold mb-2">
              Gas <span className="text-orange-400">Estimator</span>
            </h1>
            <p className="text-sm text-muted-foreground">
              Real-time transaction cost predictions
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 auto-rows-[120px] mb-6">
            
            <GlassCard className="col-span-2 row-span-1 p-4 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Zap className="w-4 h-4 text-green-400" />
                  <span className="text-xs text-muted-foreground">Low (Economy)</span>
                </div>
                <div className="text-2xl font-bold text-green-400">${currentGas.low.toFixed(5)}</div>
              </div>
              <Badge className="bg-green-500/20 text-green-400">Recommended</Badge>
            </GlassCard>

            <GlassCard className="col-span-2 row-span-1 p-4 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Fuel className="w-4 h-4 text-blue-400" />
                  <span className="text-xs text-muted-foreground">Average (Standard)</span>
                </div>
                <div className="text-2xl font-bold">${currentGas.avg.toFixed(5)}</div>
              </div>
              <div className="flex items-center gap-1">
                {currentGas.trend === "up" ? (
                  <TrendingUp className="w-4 h-4 text-red-400" />
                ) : currentGas.trend === "down" ? (
                  <TrendingDown className="w-4 h-4 text-green-400" />
                ) : (
                  <ArrowUpRight className="w-4 h-4 text-muted-foreground rotate-90" />
                )}
              </div>
            </GlassCard>

            <GlassCard className="col-span-2 row-span-1 p-4 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <AlertTriangle className="w-4 h-4 text-orange-400" />
                  <span className="text-xs text-muted-foreground">High (Fast)</span>
                </div>
                <div className="text-2xl font-bold text-orange-400">${currentGas.high.toFixed(5)}</div>
              </div>
              <Badge className="bg-orange-500/20 text-orange-400">Priority</Badge>
            </GlassCard>

            <GlassCard className="col-span-3 row-span-2 p-4 flex flex-col">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-primary" />
                  <span className="font-bold text-sm">24h Gas History</span>
                </div>
                <Badge variant="outline" className="text-[9px] animate-pulse">Live</Badge>
              </div>
              <div className="flex-1">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={gasHistory}>
                    <defs>
                      <linearGradient id="gasGradLow" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#22c55e" stopOpacity={0.3} />
                        <stop offset="100%" stopColor="#22c55e" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="gasGradAvg" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.3} />
                        <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="hour" tick={{ fontSize: 10, fill: '#6b7280' }} interval={3} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'rgba(0,0,0,0.9)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '8px',
                      }}
                      formatter={(value: any) => [`$${value.toFixed(5)}`, '']}
                    />
                    <Area type="monotone" dataKey="high" stroke="#f97316" strokeWidth={1} fill="transparent" />
                    <Area type="monotone" dataKey="avg" stroke="#8b5cf6" strokeWidth={2} fill="url(#gasGradAvg)" />
                    <Area type="monotone" dataKey="low" stroke="#22c55e" strokeWidth={1} fill="url(#gasGradLow)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </GlassCard>

            <GlassCard className="col-span-3 row-span-2 p-4 flex flex-col">
              <div className="flex items-center gap-2 mb-3">
                <Clock className="w-4 h-4 text-cyan-400" />
                <span className="font-bold text-sm">Network Status</span>
              </div>
              <div className="space-y-3 flex-1">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-muted-foreground">Network Load</span>
                    <span className="text-xs font-mono">{networkLoad}%</span>
                  </div>
                  <Progress value={networkLoad} className="h-2" />
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-lg bg-white/5">
                    <span className="text-[10px] text-muted-foreground block mb-1">Block Time</span>
                    <span className="font-bold text-green-400">400ms</span>
                  </div>
                  <div className="p-3 rounded-lg bg-white/5">
                    <span className="text-[10px] text-muted-foreground block mb-1">TPS</span>
                    <span className="font-bold">12,450</span>
                  </div>
                  <div className="p-3 rounded-lg bg-white/5">
                    <span className="text-[10px] text-muted-foreground block mb-1">Pending TXs</span>
                    <span className="font-bold">234</span>
                  </div>
                  <div className="p-3 rounded-lg bg-white/5">
                    <span className="text-[10px] text-muted-foreground block mb-1">Last Block</span>
                    <span className="font-bold font-mono">#1,234,567</span>
                  </div>
                </div>
              </div>
            </GlassCard>

          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <GlassCard className="p-4">
              <div className="flex items-center gap-2 mb-4">
                <Fuel className="w-4 h-4 text-primary" />
                <span className="font-bold">Transaction Estimates</span>
              </div>
              <div className="space-y-2">
                {transactionTypes.map((tx, i) => (
                  <motion.div
                    key={tx.type}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-center justify-between p-3 rounded-lg bg-white/5"
                  >
                    <div>
                      <span className="font-medium">{tx.type}</span>
                      <span className="text-xs text-muted-foreground block">{tx.gasUnits.toLocaleString()} gas units</span>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-green-400">{tx.estimatedCost}</span>
                      <span className="text-xs text-muted-foreground block">{tx.time}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </GlassCard>

            <GlassCard className="p-4">
              <div className="flex items-center gap-2 mb-4">
                <BarChart3 className="w-4 h-4 text-primary" />
                <span className="font-bold">Network Comparison</span>
              </div>
              <div className="space-y-3">
                {networkComparison.map((network, i) => (
                  <motion.div
                    key={network.network}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-center gap-3"
                  >
                    <div 
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: network.color }}
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{network.network}</span>
                        <span className={`font-bold ${network.network === 'DarkWave' ? 'text-primary' : ''}`}>
                          ${network.avgFee.toFixed(network.avgFee < 0.01 ? 5 : 2)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>Finality: {network.time}</span>
                        <div 
                          className="h-1.5 rounded-full"
                          style={{ 
                            backgroundColor: network.color,
                            width: `${Math.min(100, Math.log10(network.avgFee + 1) * 50 + 20)}px`,
                            opacity: 0.5,
                          }}
                        />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
              <div className="mt-4 p-3 rounded-lg bg-green-500/10 border border-green-500/20">
                <div className="flex items-center gap-2">
                  <Info className="w-4 h-4 text-green-400" />
                  <span className="text-xs text-green-400">
                    DarkWave offers competitive fees with near-instant finality
                  </span>
                </div>
              </div>
            </GlassCard>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
