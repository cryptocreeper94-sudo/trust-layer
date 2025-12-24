import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "wouter";
import {
  ArrowLeft, Fish, AlertTriangle, TrendingUp, TrendingDown, ExternalLink,
  Bell, BellOff, Filter, RefreshCw, Activity, Wallet, ArrowUpRight, ArrowDownRight
} from "lucide-react";
import { Footer } from "@/components/footer";
import { GlassCard } from "@/components/glass-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import darkwaveLogo from "@assets/generated_images/darkwave_token_transparent.png";

interface WhaleMovement {
  id: string;
  type: "buy" | "sell" | "transfer";
  amount: number;
  value: number;
  from: string;
  to: string;
  token: string;
  timestamp: Date;
  txHash: string;
  isNew?: boolean;
}

const WHALE_MOVEMENTS: WhaleMovement[] = [
  { id: "1", type: "buy", amount: 2500000, value: 375000, from: "DEX", to: "0x7a23...f8d1", token: "DWC", timestamp: new Date(Date.now() - 120000), txHash: "0xabc123" },
  { id: "2", type: "transfer", amount: 1000000, value: 150000, from: "0x8b34...c2e5", to: "0x9d45...a3f7", token: "DWC", timestamp: new Date(Date.now() - 300000), txHash: "0xdef456" },
  { id: "3", type: "sell", amount: 500000, value: 75000, from: "0x1e56...d4g8", to: "DEX", token: "DWC", timestamp: new Date(Date.now() - 600000), txHash: "0xghi789" },
  { id: "4", type: "buy", amount: 3200000, value: 480000, from: "DEX", to: "0x2f67...e5h9", token: "DWC", timestamp: new Date(Date.now() - 900000), txHash: "0xjkl012" },
  { id: "5", type: "transfer", amount: 750000, value: 112500, from: "0x3g78...f6i0", to: "Cold Wallet", token: "DWC", timestamp: new Date(Date.now() - 1200000), txHash: "0xmno345" },
  { id: "6", type: "sell", amount: 1500000, value: 225000, from: "0x4h89...g7j1", to: "DEX", token: "DWC", timestamp: new Date(Date.now() - 1800000), txHash: "0xpqr678" },
];

const TOP_WHALES = [
  { address: "0x7a23...f8d1", balance: 12500000, value: 1875000, change: 15.2, label: "Whale #1" },
  { address: "0x8b34...c2e5", balance: 8750000, value: 1312500, change: -5.8, label: "Smart Money" },
  { address: "0x9d45...a3f7", balance: 6200000, value: 930000, change: 8.3, label: "VC Fund" },
  { address: "0x1e56...d4g8", balance: 5800000, value: 870000, change: -12.1, label: "Whale #4" },
  { address: "0x2f67...e5h9", balance: 4500000, value: 675000, change: 22.5, label: "Accumulator" },
];

function formatTime(date: Date) {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  if (diff < 60000) return "Just now";
  if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
  return date.toLocaleDateString();
}

function WhaleMovementCard({ movement, index }: { movement: WhaleMovement; index: number }) {
  const typeColors = {
    buy: { bg: "bg-green-500/10", border: "border-green-500/30", text: "text-green-400", icon: ArrowUpRight },
    sell: { bg: "bg-red-500/10", border: "border-red-500/30", text: "text-red-400", icon: ArrowDownRight },
    transfer: { bg: "bg-blue-500/10", border: "border-blue-500/30", text: "text-blue-400", icon: Activity },
  };
  
  const colors = typeColors[movement.type];
  const Icon = colors.icon;
  
  return (
    <motion.div
      initial={{ opacity: 0, x: -20, scale: 0.95 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      transition={{ delay: index * 0.05 }}
    >
      <GlassCard className={`p-4 ${colors.bg} border ${colors.border} relative overflow-hidden`}>
        {movement.isNew && (
          <motion.div
            initial={{ opacity: 1 }}
            animate={{ opacity: 0 }}
            transition={{ duration: 2 }}
            className="absolute inset-0 bg-white/10"
          />
        )}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <motion.div 
              className={`p-2 rounded-xl ${colors.bg} border ${colors.border}`}
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Icon className={`w-5 h-5 ${colors.text}`} />
            </motion.div>
            <div>
              <div className="flex items-center gap-2">
                <span className={`font-bold capitalize ${colors.text}`}>{movement.type}</span>
                <Badge variant="outline" className="text-[9px]">{movement.token}</Badge>
              </div>
              <p className="text-xs text-muted-foreground">{formatTime(movement.timestamp)}</p>
            </div>
          </div>
          <div className="text-right">
            <div className="font-bold">{(movement.amount / 1000000).toFixed(2)}M</div>
            <div className="text-xs text-muted-foreground">${(movement.value / 1000).toFixed(0)}K</div>
          </div>
        </div>
        
        <div className="flex items-center gap-2 text-xs">
          <div className="flex-1 p-2 rounded-lg bg-black/20">
            <span className="text-muted-foreground">From: </span>
            <span className="font-mono">{movement.from}</span>
          </div>
          <ArrowUpRight className="w-4 h-4 text-muted-foreground rotate-90" />
          <div className="flex-1 p-2 rounded-lg bg-black/20">
            <span className="text-muted-foreground">To: </span>
            <span className="font-mono">{movement.to}</span>
          </div>
        </div>
        
        <div className="mt-3 flex items-center justify-between">
          <Button variant="ghost" size="sm" className="h-6 text-[10px] gap-1">
            <ExternalLink className="w-3 h-3" />
            View TX
          </Button>
          <Button variant="ghost" size="sm" className="h-6 text-[10px] gap-1">
            <Bell className="w-3 h-3" />
            Track Wallet
          </Button>
        </div>
      </GlassCard>
    </motion.div>
  );
}

export default function WhaleTracker() {
  const [movements, setMovements] = useState(WHALE_MOVEMENTS);
  const [alertsEnabled, setAlertsEnabled] = useState(true);
  const [minAmount, setMinAmount] = useState(100000);
  
  useEffect(() => {
    const interval = setInterval(() => {
      const newMovement: WhaleMovement = {
        id: Date.now().toString(),
        type: ["buy", "sell", "transfer"][Math.floor(Math.random() * 3)] as any,
        amount: 500000 + Math.random() * 3000000,
        value: 75000 + Math.random() * 450000,
        from: Math.random() > 0.5 ? "DEX" : `0x${Math.random().toString(16).slice(2, 6)}...${Math.random().toString(16).slice(2, 6)}`,
        to: Math.random() > 0.5 ? "DEX" : `0x${Math.random().toString(16).slice(2, 6)}...${Math.random().toString(16).slice(2, 6)}`,
        token: "DWC",
        timestamp: new Date(),
        txHash: `0x${Math.random().toString(16).slice(2, 10)}`,
        isNew: true,
      };
      setMovements(prev => [newMovement, ...prev.slice(0, 9)]);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  const buyVolume = movements.filter(m => m.type === "buy").reduce((sum, m) => sum + m.value, 0);
  const sellVolume = movements.filter(m => m.type === "sell").reduce((sum, m) => sum + m.value, 0);
  const netFlow = buyVolume - sellVolume;

  return (
    <div className="min-h-screen flex flex-col bg-background overflow-x-hidden">
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-background/90 backdrop-blur-xl">
        <div className="container mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <img src={darkwaveLogo} alt="DarkWave" className="w-7 h-7" />
            <span className="font-display font-bold text-lg tracking-tight hidden sm:inline">DarkWave</span>
          </Link>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="border-cyan-500/50 text-cyan-400 text-[10px] animate-pulse">Live</Badge>
            <Link href="/">
              <Button variant="ghost" size="sm" className="h-8 text-xs px-2">
                <ArrowLeft className="w-3 h-3" />
                <span className="hidden sm:inline ml-1">Back</span>
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      <main className="flex-1 pt-16 pb-8 px-4">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-6"
          >
            <div className="flex items-center justify-center gap-2 mb-3">
              <motion.div 
                className="p-3 rounded-2xl bg-cyan-500/20 border border-cyan-500/30"
                animate={{ 
                  boxShadow: ["0 0 20px rgba(6,182,212,0.2)", "0 0 50px rgba(6,182,212,0.5)", "0 0 20px rgba(6,182,212,0.2)"]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Fish className="w-7 h-7 text-cyan-400" />
              </motion.div>
            </div>
            <h1 className="text-2xl md:text-3xl font-display font-bold mb-2">
              Whale <span className="text-cyan-400">Tracker</span>
            </h1>
            <p className="text-sm text-muted-foreground">
              Real-time monitoring of large wallet movements
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
            <GlassCard hover={false} className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-4 h-4 text-green-400" />
                <span className="text-[10px] text-muted-foreground">Buy Volume</span>
              </div>
              <div className="text-xl font-bold text-green-400">${(buyVolume/1000).toFixed(0)}K</div>
            </GlassCard>
            <GlassCard hover={false} className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <TrendingDown className="w-4 h-4 text-red-400" />
                <span className="text-[10px] text-muted-foreground">Sell Volume</span>
              </div>
              <div className="text-xl font-bold text-red-400">${(sellVolume/1000).toFixed(0)}K</div>
            </GlassCard>
            <GlassCard hover={false} className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Activity className="w-4 h-4 text-primary" />
                <span className="text-[10px] text-muted-foreground">Net Flow</span>
              </div>
              <div className={`text-xl font-bold ${netFlow >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {netFlow >= 0 ? '+' : '-'}${Math.abs(netFlow/1000).toFixed(0)}K
              </div>
            </GlassCard>
            <GlassCard hover={false} className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Wallet className="w-4 h-4 text-amber-400" />
                <span className="text-[10px] text-muted-foreground">Tracked Whales</span>
              </div>
              <div className="text-xl font-bold">{TOP_WHALES.length}</div>
            </GlassCard>
          </div>

          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Switch checked={alertsEnabled} onCheckedChange={setAlertsEnabled} />
              <span className="text-sm">
                {alertsEnabled ? <Bell className="w-4 h-4 inline mr-1" /> : <BellOff className="w-4 h-4 inline mr-1" />}
                Alerts {alertsEnabled ? 'On' : 'Off'}
              </span>
            </div>
            <Button variant="outline" size="sm" className="gap-2">
              <Filter className="w-3 h-3" />
              Min: ${(minAmount/1000).toFixed(0)}K
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2 space-y-3">
              <h2 className="font-bold flex items-center gap-2">
                <RefreshCw className="w-4 h-4 animate-spin" />
                Live Movements
              </h2>
              <AnimatePresence mode="popLayout">
                {movements.map((movement, index) => (
                  <WhaleMovementCard key={movement.id} movement={movement} index={index} />
                ))}
              </AnimatePresence>
            </div>

            <div className="space-y-4">
              <h2 className="font-bold">Top Whales</h2>
              {TOP_WHALES.map((whale, index) => (
                <motion.div
                  key={whale.address}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <GlassCard className="p-3">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-sm">{whale.address}</span>
                          <Badge variant="outline" className="text-[9px]">{whale.label}</Badge>
                        </div>
                      </div>
                      <Badge className={`${whale.change >= 0 ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'} text-[9px]`}>
                        {whale.change >= 0 ? '+' : ''}{whale.change}%
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">{(whale.balance/1000000).toFixed(2)}M DWC</span>
                      <span className="font-bold">${(whale.value/1000).toFixed(0)}K</span>
                    </div>
                  </GlassCard>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
