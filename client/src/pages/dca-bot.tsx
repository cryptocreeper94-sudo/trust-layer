import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "wouter";
import {
  ArrowLeft, Bot, Play, Pause, Settings, TrendingUp, Clock,
  Calendar, DollarSign, Target, Repeat, ChevronDown, Plus, Trash2
} from "lucide-react";
import { AreaChart, Area, ResponsiveContainer } from "recharts";
import { Footer } from "@/components/footer";
import { GlassCard } from "@/components/glass-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import darkwaveLogo from "@assets/generated_images/darkwave_token_transparent.png";

interface DCAStrategy {
  id: string;
  token: string;
  amount: number;
  frequency: string;
  totalInvested: number;
  currentValue: number;
  avgPrice: number;
  nextBuy: string;
  isActive: boolean;
  progress: number;
  chartData: { value: number }[];
}

const STRATEGIES: DCAStrategy[] = [
  {
    id: "1",
    token: "DWC",
    amount: 100,
    frequency: "Weekly",
    totalInvested: 1200,
    currentValue: 1456,
    avgPrice: 0.142,
    nextBuy: "2 days",
    isActive: true,
    progress: 60,
    chartData: Array.from({ length: 20 }, (_, i) => ({ value: 100 + Math.random() * 30 + i * 3 })),
  },
  {
    id: "2",
    token: "stDWC",
    amount: 50,
    frequency: "Daily",
    totalInvested: 850,
    currentValue: 920,
    avgPrice: 0.148,
    nextBuy: "6 hours",
    isActive: true,
    progress: 40,
    chartData: Array.from({ length: 20 }, (_, i) => ({ value: 100 + Math.random() * 20 + i * 2 })),
  },
];

const TOKENS = [
  { symbol: "DWC", name: "DarkWave Coin", icon: darkwaveLogo },
  { symbol: "stDWC", name: "Staked DarkWave", icon: darkwaveLogo },
  { symbol: "USDC", name: "USD Coin", icon: "💵" },
];

const FREQUENCIES = [
  { value: "hourly", label: "Every Hour" },
  { value: "daily", label: "Daily" },
  { value: "weekly", label: "Weekly" },
  { value: "biweekly", label: "Bi-Weekly" },
  { value: "monthly", label: "Monthly" },
];

function StrategyCard({ strategy }: { strategy: DCAStrategy }) {
  const [isActive, setIsActive] = useState(strategy.isActive);
  const pnl = strategy.currentValue - strategy.totalInvested;
  const pnlPercent = (pnl / strategy.totalInvested) * 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <GlassCard glow className="p-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-40 h-full opacity-20">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={strategy.chartData}>
              <defs>
                <linearGradient id={`dca-grad-${strategy.id}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.5} />
                  <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <Area type="monotone" dataKey="value" stroke="#8b5cf6" fill={`url(#dca-grad-${strategy.id})`} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        
        <div className="relative">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <motion.div 
                className="p-2 rounded-xl bg-primary/20 border border-primary/30"
                animate={isActive ? { scale: [1, 1.1, 1] } : {}}
                transition={{ duration: 2, repeat: Infinity }}
              >
                {typeof TOKENS.find(t => t.symbol === strategy.token)?.icon === 'string' ? (
                  <span className="text-xl">{TOKENS.find(t => t.symbol === strategy.token)?.icon}</span>
                ) : (
                  <img src={darkwaveLogo} alt={strategy.token} className="w-6 h-6" />
                )}
              </motion.div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold">{strategy.token}</h3>
                  <Badge className={isActive ? "bg-green-500/20 text-green-400" : "bg-gray-500/20 text-gray-400"} variant="outline">
                    {isActive ? "Active" : "Paused"}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">${strategy.amount} {strategy.frequency}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => setIsActive(!isActive)}
              >
                {isActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Settings className="w-4 h-4" />
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-4 gap-2 mb-4">
            <div className="p-2 rounded-lg bg-white/5 text-center">
              <div className="text-[10px] text-muted-foreground mb-1">Invested</div>
              <div className="font-bold">${strategy.totalInvested.toLocaleString()}</div>
            </div>
            <div className="p-2 rounded-lg bg-white/5 text-center">
              <div className="text-[10px] text-muted-foreground mb-1">Value</div>
              <div className="font-bold">${strategy.currentValue.toLocaleString()}</div>
            </div>
            <div className="p-2 rounded-lg bg-white/5 text-center">
              <div className="text-[10px] text-muted-foreground mb-1">P/L</div>
              <div className={`font-bold ${pnl >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {pnl >= 0 ? '+' : ''}{pnlPercent.toFixed(1)}%
              </div>
            </div>
            <div className="p-2 rounded-lg bg-white/5 text-center">
              <div className="text-[10px] text-muted-foreground mb-1">Avg Price</div>
              <div className="font-bold font-mono">${strategy.avgPrice.toFixed(3)}</div>
            </div>
          </div>
          
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Clock className="w-3 h-3" />
              Next buy in {strategy.nextBuy}
            </div>
            <div className="flex items-center gap-2">
              <Progress value={strategy.progress} className="w-20 h-1.5" />
              <span className="text-muted-foreground">{strategy.progress}%</span>
            </div>
          </div>
        </div>
      </GlassCard>
    </motion.div>
  );
}

export default function DCABot() {
  const [showCreate, setShowCreate] = useState(false);
  const [selectedToken, setSelectedToken] = useState("DWC");
  const [amount, setAmount] = useState([100]);
  const [frequency, setFrequency] = useState("weekly");

  const totalInvested = STRATEGIES.reduce((sum, s) => sum + s.totalInvested, 0);
  const totalValue = STRATEGIES.reduce((sum, s) => sum + s.currentValue, 0);
  const totalPnl = totalValue - totalInvested;

  return (
    <div className="min-h-screen flex flex-col bg-background overflow-x-hidden">
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-background/90 backdrop-blur-xl">
        <div className="container mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <img src={darkwaveLogo} alt="DarkWave" className="w-7 h-7" />
            <span className="font-display font-bold text-lg tracking-tight hidden sm:inline">DarkWave</span>
          </Link>
          <div className="flex items-center gap-2">
            <Link href="/dashboard-pro">
              <Button variant="ghost" size="sm" className="h-8 text-xs px-2">
                <ArrowLeft className="w-3 h-3" />
                <span className="hidden sm:inline ml-1">Dashboard</span>
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      <main className="flex-1 pt-16 pb-8 px-4">
        <div className="container mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-6"
          >
            <div className="flex items-center justify-center gap-2 mb-3">
              <motion.div 
                className="p-3 rounded-2xl bg-gradient-to-br from-primary/20 to-purple-500/20 border border-primary/30"
                animate={{ 
                  boxShadow: ["0 0 20px rgba(139,92,246,0.2)", "0 0 50px rgba(139,92,246,0.4)", "0 0 20px rgba(139,92,246,0.2)"]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Bot className="w-7 h-7 text-primary" />
              </motion.div>
            </div>
            <h1 className="text-2xl md:text-3xl font-display font-bold mb-2">
              DCA <span className="text-primary">Bot</span>
            </h1>
            <p className="text-sm text-muted-foreground">
              Automate your dollar-cost averaging strategy
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
            <GlassCard hover={false} className="p-3">
              <div className="flex items-center gap-2 mb-1">
                <Repeat className="w-4 h-4 text-primary" />
                <span className="text-[10px] text-muted-foreground">Active Strategies</span>
              </div>
              <div className="text-xl font-bold">{STRATEGIES.filter(s => s.isActive).length}</div>
            </GlassCard>
            <GlassCard hover={false} className="p-3">
              <div className="flex items-center gap-2 mb-1">
                <DollarSign className="w-4 h-4 text-blue-400" />
                <span className="text-[10px] text-muted-foreground">Total Invested</span>
              </div>
              <div className="text-xl font-bold">${totalInvested.toLocaleString()}</div>
            </GlassCard>
            <GlassCard hover={false} className="p-3">
              <div className="flex items-center gap-2 mb-1">
                <Target className="w-4 h-4 text-green-400" />
                <span className="text-[10px] text-muted-foreground">Current Value</span>
              </div>
              <div className="text-xl font-bold">${totalValue.toLocaleString()}</div>
            </GlassCard>
            <GlassCard hover={false} className="p-3">
              <div className="flex items-center gap-2 mb-1">
                <TrendingUp className="w-4 h-4 text-green-400" />
                <span className="text-[10px] text-muted-foreground">Total P/L</span>
              </div>
              <div className={`text-xl font-bold ${totalPnl >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {totalPnl >= 0 ? '+' : ''}${Math.abs(totalPnl).toLocaleString()}
              </div>
            </GlassCard>
          </div>

          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold">Your Strategies</h2>
            <Dialog open={showCreate} onOpenChange={setShowCreate}>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <Plus className="w-4 h-4" />
                  New Strategy
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md bg-background border-white/10">
                <DialogHeader>
                  <DialogTitle>Create DCA Strategy</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 mt-4">
                  <div>
                    <label className="text-sm mb-2 block">Token to Buy</label>
                    <Select value={selectedToken} onValueChange={setSelectedToken}>
                      <SelectTrigger className="bg-white/5 border-white/10">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {TOKENS.map(token => (
                          <SelectItem key={token.symbol} value={token.symbol}>
                            <div className="flex items-center gap-2">
                              {typeof token.icon === 'string' ? (
                                <span>{token.icon}</span>
                              ) : (
                                <img src={token.icon} alt={token.symbol} className="w-4 h-4" />
                              )}
                              {token.symbol}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-sm">Amount per Purchase</label>
                      <span className="font-mono text-sm">${amount[0]}</span>
                    </div>
                    <Slider
                      value={amount}
                      onValueChange={setAmount}
                      min={10}
                      max={1000}
                      step={10}
                    />
                  </div>
                  
                  <div>
                    <label className="text-sm mb-2 block">Frequency</label>
                    <Select value={frequency} onValueChange={setFrequency}>
                      <SelectTrigger className="bg-white/5 border-white/10">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {FREQUENCIES.map(f => (
                          <SelectItem key={f.value} value={f.value}>{f.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Estimated Monthly</span>
                      <span className="font-bold">
                        ${frequency === 'daily' ? amount[0] * 30 : 
                          frequency === 'weekly' ? amount[0] * 4 :
                          frequency === 'biweekly' ? amount[0] * 2 :
                          frequency === 'monthly' ? amount[0] : amount[0] * 720}
                      </span>
                    </div>
                  </div>
                  
                  <Button 
                    className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white"
                    onClick={() => setShowCreate(false)}
                  >
                    <Bot className="w-4 h-4 mr-2" />
                    Create Strategy
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="space-y-4">
            {STRATEGIES.map(strategy => (
              <StrategyCard key={strategy.id} strategy={strategy} />
            ))}
          </div>

          {STRATEGIES.length === 0 && (
            <GlassCard className="p-8 text-center">
              <Bot className="w-12 h-12 text-white/10 mx-auto mb-3" />
              <p className="text-muted-foreground mb-4">No DCA strategies yet</p>
              <Button onClick={() => setShowCreate(true)}>Create Your First Strategy</Button>
            </GlassCard>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
