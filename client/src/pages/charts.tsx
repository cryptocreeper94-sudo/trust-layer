import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Link } from "wouter";
import {
  LineChart, TrendingUp, TrendingDown, DollarSign,
  BarChart3, Clock, ChevronDown, RefreshCw
} from "lucide-react";
import { Footer } from "@/components/footer";
import { BackButton } from "@/components/page-nav";
import { GlassCard } from "@/components/glass-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";
import orbitLogo from "@assets/generated_images/futuristic_abstract_geometric_logo_symbol_for_orbit.png";

interface PriceData {
  time: string;
  price: number;
  volume: number;
}

export default function Charts() {
  const [timeframe, setTimeframe] = useState("7d");
  const [selectedToken, setSelectedToken] = useState("DWC");

  const { data: statsData, isLoading: statsLoading } = useQuery<{ price: string; change24h: string; volume24h: string; marketCap: string; high24h: string; low24h: string }>({
    queryKey: ["/api/charts/stats", selectedToken],
    refetchInterval: 30000,
  });

  const { data: historyData, isLoading: historyLoading } = useQuery<{ data: PriceData[] }>({
    queryKey: ["/api/charts/history", selectedToken, timeframe],
    queryFn: async () => {
      const res = await fetch(`/api/charts/history?token=${selectedToken}&timeframe=${timeframe}`);
      if (!res.ok) throw new Error("Failed to fetch");
      return res.json();
    },
    refetchInterval: 60000,
  });

  const stats = statsData || {
    price: "0.000124",
    change24h: "+12.4",
    volume24h: "2,450,000",
    marketCap: "12,400,000",
    high24h: "0.000135",
    low24h: "0.000108",
  };

  const isPositive = parseFloat(stats.change24h) >= 0;
  const priceData = historyData?.data || [];
  const currentPrice = priceData[priceData.length - 1]?.price || 0;
  const startPrice = priceData[0]?.price || 0;
  const periodChange = startPrice > 0 ? ((currentPrice - startPrice) / startPrice * 100).toFixed(2) : "0";
  const isLoading = statsLoading || historyLoading;

  return (
    <div className="min-h-screen flex flex-col bg-background overflow-x-hidden">
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-background/90 backdrop-blur-xl">
        <div className="container mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <img src={orbitLogo} alt="DarkWave" className="w-7 h-7" />
            <span className="font-display font-bold text-lg tracking-tight hidden sm:inline">DarkWave</span>
          </Link>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="border-blue-500/50 text-blue-400 text-[10px]">Charts</Badge>
            <BackButton />
          </div>
        </div>
      </nav>

      <main className="flex-1 pt-16 pb-8 px-4">
        <div className="container mx-auto max-w-6xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-cyan-400 flex items-center justify-center font-bold text-sm">
                    DWC
                  </div>
                  <div>
                    <h1 className="text-2xl font-display font-bold">DarkWave Coin</h1>
                    <p className="text-xs text-muted-foreground">DWC/USD</p>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Select value={selectedToken} onValueChange={setSelectedToken}>
                  <SelectTrigger className="w-[120px] bg-white/5 border-white/10">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="DWC">DWC</SelectItem>
                    <SelectItem value="wETH">wETH</SelectItem>
                    <SelectItem value="wSOL">wSOL</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" size="icon" className="border-white/10">
                  <RefreshCw className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </motion.div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
            <GlassCard hover={false}>
              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-muted-foreground">Price</span>
                  <div className={`flex items-center gap-1 text-xs ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
                    {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                    {stats.change24h}%
                  </div>
                </div>
                <div className="text-xl font-bold">${stats.price}</div>
              </div>
            </GlassCard>
            
            <GlassCard hover={false}>
              <div className="p-4">
                <div className="flex items-center gap-1 mb-2">
                  <BarChart3 className="w-3 h-3 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">24h Volume</span>
                </div>
                <div className="text-xl font-bold">${stats.volume24h}</div>
              </div>
            </GlassCard>
            
            <GlassCard hover={false}>
              <div className="p-4">
                <div className="flex items-center gap-1 mb-2">
                  <DollarSign className="w-3 h-3 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">Market Cap</span>
                </div>
                <div className="text-xl font-bold">${stats.marketCap}</div>
              </div>
            </GlassCard>
            
            <GlassCard hover={false}>
              <div className="p-4">
                <div className="text-xs text-muted-foreground mb-2">24h Range</div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-red-400">${stats.low24h}</span>
                  <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-red-400 via-yellow-400 to-green-400 w-[65%]" />
                  </div>
                  <span className="text-xs text-green-400">${stats.high24h}</span>
                </div>
              </div>
            </GlassCard>
          </div>

          <GlassCard className="mb-6">
            <div className="p-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
                <div>
                  <h2 className="font-bold text-lg">Price Chart</h2>
                  <p className="text-xs text-muted-foreground">
                    {timeframe} change: <span className={parseFloat(periodChange) >= 0 ? 'text-green-400' : 'text-red-400'}>{periodChange}%</span>
                  </p>
                </div>
                
                <div className="flex bg-white/5 rounded-lg p-1 border border-white/10">
                  {["24h", "7d", "30d", "90d"].map(tf => (
                    <Button
                      key={tf}
                      variant={timeframe === tf ? "secondary" : "ghost"}
                      size="sm"
                      className="h-7 px-3 text-xs"
                      onClick={() => setTimeframe(tf)}
                    >
                      {tf}
                    </Button>
                  ))}
                </div>
              </div>
              
              <div className="h-[300px] sm:h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={priceData}>
                    <defs>
                      <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#00ffff" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#00ffff" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                    <XAxis dataKey="time" stroke="rgba(255,255,255,0.3)" fontSize={10} tickLine={false} />
                    <YAxis stroke="rgba(255,255,255,0.3)" fontSize={10} tickLine={false} tickFormatter={(v) => `$${v}`} domain={['auto', 'auto']} />
                    <Tooltip
                      contentStyle={{ background: 'rgba(12,18,36,0.95)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                      labelStyle={{ color: 'rgba(255,255,255,0.7)' }}
                      formatter={(value: number) => [`$${value.toFixed(6)}`, 'Price']}
                    />
                    <Area type="monotone" dataKey="price" stroke="#00ffff" strokeWidth={2} fill="url(#priceGradient)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </GlassCard>

          <GlassCard>
            <div className="p-4">
              <h2 className="font-bold text-lg mb-4">Volume Chart</h2>
              <div className="h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={priceData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                    <XAxis dataKey="time" stroke="rgba(255,255,255,0.3)" fontSize={10} tickLine={false} />
                    <YAxis stroke="rgba(255,255,255,0.3)" fontSize={10} tickLine={false} tickFormatter={(v) => `$${(v/1000000).toFixed(1)}M`} />
                    <Tooltip
                      contentStyle={{ background: 'rgba(12,18,36,0.95)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                      labelStyle={{ color: 'rgba(255,255,255,0.7)' }}
                      formatter={(value: number) => [`$${value.toLocaleString()}`, 'Volume']}
                    />
                    <Bar dataKey="volume" fill="rgba(139,92,246,0.6)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </GlassCard>

          <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
            <GlassCard>
              <div className="p-4 text-center">
                <Clock className="w-5 h-5 text-primary mx-auto mb-2" />
                <div className="text-sm font-bold">All-Time High</div>
                <div className="text-lg font-bold text-green-400">$0.000185</div>
                <div className="text-[10px] text-muted-foreground">Dec 15, 2024</div>
              </div>
            </GlassCard>
            <GlassCard>
              <div className="p-4 text-center">
                <Clock className="w-5 h-5 text-red-400 mx-auto mb-2" />
                <div className="text-sm font-bold">All-Time Low</div>
                <div className="text-lg font-bold text-red-400">$0.000045</div>
                <div className="text-[10px] text-muted-foreground">Feb 14, 2026</div>
              </div>
            </GlassCard>
            <GlassCard>
              <div className="p-4 text-center">
                <TrendingUp className="w-5 h-5 text-purple-400 mx-auto mb-2" />
                <div className="text-sm font-bold">Total Supply</div>
                <div className="text-lg font-bold">100M DWC</div>
                <div className="text-[10px] text-muted-foreground">Fixed supply</div>
              </div>
            </GlassCard>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
