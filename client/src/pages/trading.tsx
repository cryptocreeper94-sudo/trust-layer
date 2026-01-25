import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "wouter";
import {
  Activity, BarChart3, Layers,
  Settings, Star, Maximize2, Clock, Zap
, Shield , Shield } from "lucide-react";
import { BackButton } from "@/components/page-nav";
import { Footer } from "@/components/footer";
import { GlassCard } from "@/components/glass-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";


const TIMEFRAMES = [
  { label: "1H", value: "1h" },
  { label: "4H", value: "4h" },
  { label: "1D", value: "1d" },
  { label: "1W", value: "1w" },
  { label: "1M", value: "1m" },
];

const INDICATORS = [
  { id: "ma", name: "Moving Average", color: "#8b5cf6" },
  { id: "ema", name: "EMA", color: "#06b6d4" },
  { id: "bb", name: "Bollinger Bands", color: "#f59e0b" },
  { id: "rsi", name: "RSI", color: "#10b981" },
  { id: "macd", name: "MACD", color: "#ec4899" },
  { id: "vol", name: "Volume", color: "#6366f1" },
];


function EmptyChartPlaceholder() {
  return (
    <div className="h-full flex items-center justify-center">
      <div className="text-center">
        <BarChart3 className="w-16 h-16 text-white/20 mx-auto mb-4" />
        <p className="text-muted-foreground text-sm">Live chart data available at mainnet launch</p>
        <p className="text-muted-foreground/60 text-xs mt-1">Coming Soon</p>
      </div>
    </div>
  );
}

function EmptyOrderBook() {
  return (
    <div className="h-full flex flex-col items-center justify-center text-center p-4">
      <Layers className="w-10 h-10 text-white/20 mb-3" />
      <p className="text-sm text-muted-foreground">Order book available at launch</p>
    </div>
  );
}

function EmptyRecentTrades() {
  return (
    <div className="h-full flex flex-col items-center justify-center text-center p-4">
      <Activity className="w-10 h-10 text-white/20 mb-3" />
      <p className="text-sm text-muted-foreground">Trade history available at launch</p>
    </div>
  );
}

export default function Trading() {
  const [timeframe, setTimeframe] = useState("1d");
  const [activeIndicators, setActiveIndicators] = useState<string[]>(["vol"]);

  return (
    <div className="min-h-screen flex flex-col bg-background overflow-x-hidden">
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-background/90 backdrop-blur-xl">
        <div className="container mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <Shield className="w-7 h-7 text-cyan-400" />
            <span className="font-display font-bold text-lg tracking-tight hidden sm:inline">DarkWave</span>
          </Link>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="border-amber-500/50 text-amber-400 text-[10px]">Testnet Preview</Badge>
            <BackButton />
          </div>
        </div>
      </nav>

      <main className="flex-1 pt-16 pb-4 px-2 md:px-4">
        <div className="container mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4"
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-4">
              <div className="flex items-center gap-3">
                <motion.div 
                  className="relative"
                  animate={{ 
                    boxShadow: ["0 0 20px rgba(34,197,94,0.2)", "0 0 40px rgba(34,197,94,0.4)", "0 0 20px rgba(34,197,94,0.2)"]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Shield className="w-7 h-7 text-cyan-400" />
                </motion.div>
                <div>
                  <div className="flex items-center gap-2">
                    <h1 className="text-xl font-bold">SIG/USD</h1>
                    <Button variant="ghost" size="icon" className="h-6 w-6">
                      <Star className="w-4 h-4" />
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">Signal</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold text-white/50">—</span>
                    <Badge className="bg-white/10 text-white/50">
                      <Clock className="w-3 h-3 mr-0.5" />
                      TGE
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">Price at launch</p>
                </div>
              </div>
            </div>

            <div className="mb-4 p-3 rounded-xl bg-gradient-to-r from-cyan-500/10 via-purple-500/10 to-pink-500/10 border border-white/10">
              <div className="flex items-center justify-center gap-2 text-primary">
                <Clock className="w-4 h-4" />
                <span className="text-sm font-semibold">Live Trading Available at Launch</span>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
              <GlassCard hover={false} className="p-3">
                <div className="text-[10px] text-muted-foreground mb-1">24h High</div>
                <div className="text-sm font-bold text-white/50">—</div>
              </GlassCard>
              <GlassCard hover={false} className="p-3">
                <div className="text-[10px] text-muted-foreground mb-1">24h Low</div>
                <div className="text-sm font-bold text-white/50">—</div>
              </GlassCard>
              <GlassCard hover={false} className="p-3">
                <div className="text-[10px] text-muted-foreground mb-1">24h Volume</div>
                <div className="text-sm font-bold text-white/50">—</div>
              </GlassCard>
              <GlassCard hover={false} className="p-3">
                <div className="text-[10px] text-muted-foreground mb-1">Market Cap</div>
                <div className="text-sm font-bold text-white/50">—</div>
              </GlassCard>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="lg:col-span-3"
            >
              <GlassCard glow className="p-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                  <div className="flex items-center gap-1 opacity-50 pointer-events-none">
                    {TIMEFRAMES.map((tf) => (
                      <Button
                        key={tf.value}
                        variant={timeframe === tf.value ? "default" : "ghost"}
                        size="sm"
                        className={`h-7 px-3 text-xs ${timeframe === tf.value ? 'bg-primary' : ''}`}
                        disabled
                        data-testid={`timeframe-${tf.value}`}
                      >
                        {tf.label}
                      </Button>
                    ))}
                  </div>
                  <div className="flex items-center gap-2 opacity-50 pointer-events-none">
                    <Select disabled>
                      <SelectTrigger className="h-7 w-32 text-xs bg-white/5 border-white/10">
                        <SelectValue placeholder="Indicators" />
                      </SelectTrigger>
                      <SelectContent>
                        {INDICATORS.map((ind) => (
                          <SelectItem key={ind.id} value={ind.id}>{ind.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button variant="ghost" size="icon" className="h-7 w-7" disabled>
                      <Settings className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7" disabled>
                      <Maximize2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                
                <div className="h-[300px] md:h-[400px]">
                  <EmptyChartPlaceholder />
                </div>
                
                <div className="flex items-center gap-2 mt-3 flex-wrap opacity-50 pointer-events-none">
                  {INDICATORS.map((ind) => (
                    <Button
                      key={ind.id}
                      variant="ghost"
                      size="sm"
                      className={`h-6 px-2 text-[10px] ${activeIndicators.includes(ind.id) ? 'bg-white/10' : ''}`}
                      disabled
                    >
                      <div className="w-2 h-2 rounded-full mr-1" style={{ backgroundColor: ind.color }} />
                      {ind.name}
                    </Button>
                  ))}
                </div>
              </GlassCard>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-4"
            >
              <GlassCard className="p-3">
                <Tabs defaultValue="book">
                  <TabsList className="w-full grid grid-cols-2 mb-3">
                    <TabsTrigger value="book" className="text-xs">Order Book</TabsTrigger>
                    <TabsTrigger value="trades" className="text-xs">Trades</TabsTrigger>
                  </TabsList>
                  <TabsContent value="book" className="h-[300px]">
                    <EmptyOrderBook />
                  </TabsContent>
                  <TabsContent value="trades" className="h-[300px] overflow-y-auto">
                    <EmptyRecentTrades />
                  </TabsContent>
                </Tabs>
              </GlassCard>

              <GlassCard className="p-3">
                <h3 className="text-sm font-bold mb-3 flex items-center gap-2">
                  <Zap className="w-4 h-4 text-yellow-400/50" />
                  Quick Trade
                  <Badge className="text-[8px] bg-white/10 text-white/50">Coming Soon</Badge>
                </h3>
                <div className="text-center py-8">
                  <Clock className="w-10 h-10 text-white/20 mx-auto mb-3" />
                  <p className="text-sm text-muted-foreground">Trading available at mainnet</p>
                  <p className="text-xs text-muted-foreground/60 mt-1">June 1, 2026</p>
                </div>
              </GlassCard>
            </motion.div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
