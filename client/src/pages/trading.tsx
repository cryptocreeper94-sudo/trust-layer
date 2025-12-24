import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "wouter";
import {
  ArrowLeft, TrendingUp, TrendingDown, Activity, BarChart3, Layers,
  Settings, Bell, Star, Maximize2, ChevronDown, Clock, Zap, Target,
  ArrowUpRight, ArrowDownRight, Minus, Plus, RefreshCw
} from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, ComposedChart, Line } from "recharts";
import { Footer } from "@/components/footer";
import { GlassCard } from "@/components/glass-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import darkwaveLogo from "@assets/generated_images/darkwave_token_transparent.png";

const generateCandleData = (days: number) => {
  const data = [];
  let price = 0.15;
  const now = Date.now();
  
  for (let i = days; i >= 0; i--) {
    const volatility = 0.02 + Math.random() * 0.03;
    const open = price;
    const change = (Math.random() - 0.48) * volatility;
    const close = open * (1 + change);
    const high = Math.max(open, close) * (1 + Math.random() * 0.01);
    const low = Math.min(open, close) * (1 - Math.random() * 0.01);
    const volume = 500000 + Math.random() * 2000000;
    
    data.push({
      time: now - i * 86400000,
      date: new Date(now - i * 86400000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      open: +open.toFixed(4),
      high: +high.toFixed(4),
      low: +low.toFixed(4),
      close: +close.toFixed(4),
      volume: Math.floor(volume),
      bullish: close >= open,
    });
    price = close;
  }
  return data;
};

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

interface OrderBookEntry {
  price: number;
  amount: number;
  total: number;
  percent: number;
}

const generateOrderBook = () => {
  const midPrice = 0.1523;
  const bids: OrderBookEntry[] = [];
  const asks: OrderBookEntry[] = [];
  
  let bidTotal = 0;
  let askTotal = 0;
  
  for (let i = 0; i < 12; i++) {
    const bidPrice = midPrice - (i + 1) * 0.0001;
    const bidAmount = 10000 + Math.random() * 50000;
    bidTotal += bidAmount;
    bids.push({ price: bidPrice, amount: bidAmount, total: bidTotal, percent: 0 });
    
    const askPrice = midPrice + (i + 1) * 0.0001;
    const askAmount = 10000 + Math.random() * 50000;
    askTotal += askAmount;
    asks.push({ price: askPrice, amount: askAmount, total: askTotal, percent: 0 });
  }
  
  const maxTotal = Math.max(bidTotal, askTotal);
  bids.forEach(b => b.percent = (b.total / maxTotal) * 100);
  asks.forEach(a => a.percent = (a.total / maxTotal) * 100);
  
  return { bids, asks, midPrice };
};

const RECENT_TRADES = [
  { price: 0.1523, amount: 15420, side: "buy", time: "12:45:32" },
  { price: 0.1522, amount: 8750, side: "sell", time: "12:45:28" },
  { price: 0.1524, amount: 32100, side: "buy", time: "12:45:21" },
  { price: 0.1521, amount: 5600, side: "sell", time: "12:45:15" },
  { price: 0.1523, amount: 21000, side: "buy", time: "12:45:08" },
  { price: 0.1520, amount: 45000, side: "sell", time: "12:44:59" },
  { price: 0.1525, amount: 12800, side: "buy", time: "12:44:52" },
  { price: 0.1522, amount: 9200, side: "sell", time: "12:44:45" },
];

function CandlestickChart({ data }: { data: any[] }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <ComposedChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="volumeGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.3} />
            <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0.05} />
          </linearGradient>
          <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#22c55e" stopOpacity={0.2} />
            <stop offset="100%" stopColor="#22c55e" stopOpacity={0} />
          </linearGradient>
        </defs>
        <XAxis 
          dataKey="date" 
          axisLine={false} 
          tickLine={false} 
          tick={{ fill: '#6b7280', fontSize: 10 }}
          interval="preserveStartEnd"
        />
        <YAxis 
          yAxisId="price"
          orientation="right"
          domain={['auto', 'auto']}
          axisLine={false}
          tickLine={false}
          tick={{ fill: '#6b7280', fontSize: 10 }}
          tickFormatter={(v) => `$${v.toFixed(3)}`}
        />
        <YAxis 
          yAxisId="volume"
          orientation="left"
          domain={[0, 'auto']}
          axisLine={false}
          tickLine={false}
          tick={{ fill: '#6b7280', fontSize: 10 }}
          tickFormatter={(v) => `${(v/1000000).toFixed(1)}M`}
          hide
        />
        <Tooltip
          contentStyle={{
            backgroundColor: 'rgba(0, 0, 0, 0.9)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '12px',
            backdropFilter: 'blur(20px)',
          }}
          labelStyle={{ color: '#9ca3af' }}
          formatter={(value: any, name: string) => {
            if (name === 'close') return [`$${value.toFixed(4)}`, 'Price'];
            if (name === 'volume') return [`${(value/1000000).toFixed(2)}M`, 'Volume'];
            return [value, name];
          }}
        />
        <Bar 
          yAxisId="volume"
          dataKey="volume" 
          fill="url(#volumeGradient)"
          radius={[2, 2, 0, 0]}
        />
        <Area
          yAxisId="price"
          type="monotone"
          dataKey="close"
          stroke="#22c55e"
          strokeWidth={2}
          fill="url(#priceGradient)"
        />
        <Line
          yAxisId="price"
          type="monotone"
          dataKey="high"
          stroke="transparent"
          dot={false}
        />
      </ComposedChart>
    </ResponsiveContainer>
  );
}

function OrderBook({ bids, asks, midPrice }: { bids: OrderBookEntry[]; asks: OrderBookEntry[]; midPrice: number }) {
  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-2 px-2">
        <span className="text-[10px] text-muted-foreground">Price (USD)</span>
        <span className="text-[10px] text-muted-foreground">Amount (DWC)</span>
        <span className="text-[10px] text-muted-foreground">Total</span>
      </div>
      
      <div className="flex-1 overflow-hidden flex flex-col">
        <div className="flex-1 overflow-y-auto space-y-0.5">
          {[...asks].reverse().map((ask, i) => (
            <motion.div
              key={`ask-${i}`}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.02 }}
              className="relative flex items-center justify-between px-2 py-0.5 text-xs"
            >
              <div 
                className="absolute right-0 top-0 bottom-0 bg-red-500/10"
                style={{ width: `${ask.percent}%` }}
              />
              <span className="text-red-400 font-mono z-10">${ask.price.toFixed(4)}</span>
              <span className="text-white/70 font-mono z-10">{(ask.amount/1000).toFixed(1)}K</span>
              <span className="text-white/50 font-mono z-10">{(ask.total/1000).toFixed(0)}K</span>
            </motion.div>
          ))}
        </div>
        
        <div className="py-2 px-2 border-y border-white/10 my-1">
          <div className="flex items-center justify-center gap-2">
            <span className="text-lg font-bold text-white">${midPrice.toFixed(4)}</span>
            <Badge className="bg-green-500/20 text-green-400 text-[9px]">
              <ArrowUpRight className="w-3 h-3 mr-0.5" />
              +2.34%
            </Badge>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto space-y-0.5">
          {bids.map((bid, i) => (
            <motion.div
              key={`bid-${i}`}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.02 }}
              className="relative flex items-center justify-between px-2 py-0.5 text-xs"
            >
              <div 
                className="absolute left-0 top-0 bottom-0 bg-green-500/10"
                style={{ width: `${bid.percent}%` }}
              />
              <span className="text-green-400 font-mono z-10">${bid.price.toFixed(4)}</span>
              <span className="text-white/70 font-mono z-10">{(bid.amount/1000).toFixed(1)}K</span>
              <span className="text-white/50 font-mono z-10">{(bid.total/1000).toFixed(0)}K</span>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

function RecentTrades() {
  return (
    <div className="space-y-1">
      {RECENT_TRADES.map((trade, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.03 }}
          className="flex items-center justify-between px-2 py-1 text-xs"
        >
          <span className={`font-mono ${trade.side === 'buy' ? 'text-green-400' : 'text-red-400'}`}>
            ${trade.price.toFixed(4)}
          </span>
          <span className="text-white/70 font-mono">{(trade.amount/1000).toFixed(1)}K</span>
          <span className="text-white/50">{trade.time}</span>
        </motion.div>
      ))}
    </div>
  );
}

export default function Trading() {
  const [timeframe, setTimeframe] = useState("1d");
  const [activeIndicators, setActiveIndicators] = useState<string[]>(["vol"]);
  const [chartData, setChartData] = useState(() => generateCandleData(30));
  const [orderBook, setOrderBook] = useState(() => generateOrderBook());
  
  useEffect(() => {
    const interval = setInterval(() => {
      setOrderBook(generateOrderBook());
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const currentPrice = chartData[chartData.length - 1]?.close || 0;
  const previousPrice = chartData[chartData.length - 2]?.close || currentPrice;
  const priceChange = ((currentPrice - previousPrice) / previousPrice) * 100;
  const isUp = priceChange >= 0;

  return (
    <div className="min-h-screen flex flex-col bg-background overflow-x-hidden">
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-background/90 backdrop-blur-xl">
        <div className="container mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <img src={darkwaveLogo} alt="DarkWave" className="w-7 h-7" />
            <span className="font-display font-bold text-lg tracking-tight hidden sm:inline">DarkWave</span>
          </Link>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="border-green-500/50 text-green-400 text-[10px]">Live</Badge>
            <Link href="/">
              <Button variant="ghost" size="sm" className="h-8 text-xs px-2">
                <ArrowLeft className="w-3 h-3" />
                <span className="hidden sm:inline ml-1">Back</span>
              </Button>
            </Link>
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
                  <img src={darkwaveLogo} alt="DWC" className="w-10 h-10" />
                </motion.div>
                <div>
                  <div className="flex items-center gap-2">
                    <h1 className="text-xl font-bold">DWC/USD</h1>
                    <Button variant="ghost" size="icon" className="h-6 w-6">
                      <Star className="w-4 h-4" />
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">DarkWave Coin</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold">${currentPrice.toFixed(4)}</span>
                    <Badge className={`${isUp ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                      {isUp ? <ArrowUpRight className="w-3 h-3 mr-0.5" /> : <ArrowDownRight className="w-3 h-3 mr-0.5" />}
                      {Math.abs(priceChange).toFixed(2)}%
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">24h Change</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
              <GlassCard hover={false} className="p-3">
                <div className="text-[10px] text-muted-foreground mb-1">24h High</div>
                <div className="text-sm font-bold text-green-400">$0.1589</div>
              </GlassCard>
              <GlassCard hover={false} className="p-3">
                <div className="text-[10px] text-muted-foreground mb-1">24h Low</div>
                <div className="text-sm font-bold text-red-400">$0.1467</div>
              </GlassCard>
              <GlassCard hover={false} className="p-3">
                <div className="text-[10px] text-muted-foreground mb-1">24h Volume</div>
                <div className="text-sm font-bold">$2.4M</div>
              </GlassCard>
              <GlassCard hover={false} className="p-3">
                <div className="text-[10px] text-muted-foreground mb-1">Market Cap</div>
                <div className="text-sm font-bold">$15.2M</div>
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
                  <div className="flex items-center gap-1">
                    {TIMEFRAMES.map((tf) => (
                      <Button
                        key={tf.value}
                        variant={timeframe === tf.value ? "default" : "ghost"}
                        size="sm"
                        className={`h-7 px-3 text-xs ${timeframe === tf.value ? 'bg-primary' : ''}`}
                        onClick={() => setTimeframe(tf.value)}
                        data-testid={`timeframe-${tf.value}`}
                      >
                        {tf.label}
                      </Button>
                    ))}
                  </div>
                  <div className="flex items-center gap-2">
                    <Select>
                      <SelectTrigger className="h-7 w-32 text-xs bg-white/5 border-white/10">
                        <SelectValue placeholder="Indicators" />
                      </SelectTrigger>
                      <SelectContent>
                        {INDICATORS.map((ind) => (
                          <SelectItem key={ind.id} value={ind.id}>{ind.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button variant="ghost" size="icon" className="h-7 w-7">
                      <Settings className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7">
                      <Maximize2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                
                <div className="h-[300px] md:h-[400px]">
                  <CandlestickChart data={chartData} />
                </div>
                
                <div className="flex items-center gap-2 mt-3 flex-wrap">
                  {INDICATORS.map((ind) => (
                    <Button
                      key={ind.id}
                      variant="ghost"
                      size="sm"
                      className={`h-6 px-2 text-[10px] ${activeIndicators.includes(ind.id) ? 'bg-white/10' : ''}`}
                      onClick={() => {
                        setActiveIndicators(prev => 
                          prev.includes(ind.id) ? prev.filter(i => i !== ind.id) : [...prev, ind.id]
                        );
                      }}
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
                    <OrderBook bids={orderBook.bids} asks={orderBook.asks} midPrice={orderBook.midPrice} />
                  </TabsContent>
                  <TabsContent value="trades" className="h-[300px] overflow-y-auto">
                    <RecentTrades />
                  </TabsContent>
                </Tabs>
              </GlassCard>

              <GlassCard className="p-3">
                <h3 className="text-sm font-bold mb-3 flex items-center gap-2">
                  <Zap className="w-4 h-4 text-yellow-400" />
                  Quick Trade
                </h3>
                <Tabs defaultValue="buy">
                  <TabsList className="w-full grid grid-cols-2 mb-3">
                    <TabsTrigger value="buy" className="text-xs data-[state=active]:bg-green-500/20 data-[state=active]:text-green-400">Buy</TabsTrigger>
                    <TabsTrigger value="sell" className="text-xs data-[state=active]:bg-red-500/20 data-[state=active]:text-red-400">Sell</TabsTrigger>
                  </TabsList>
                  <TabsContent value="buy" className="space-y-3">
                    <div className="p-2 rounded-lg bg-white/5 border border-white/10">
                      <div className="text-[10px] text-muted-foreground mb-1">Amount (DWC)</div>
                      <input 
                        type="text" 
                        className="w-full bg-transparent text-lg font-mono outline-none" 
                        placeholder="0.00"
                        data-testid="input-buy-amount"
                      />
                    </div>
                    <div className="flex gap-1">
                      {[25, 50, 75, 100].map(pct => (
                        <Button key={pct} variant="ghost" size="sm" className="flex-1 h-6 text-[10px]">
                          {pct}%
                        </Button>
                      ))}
                    </div>
                    <Button className="w-full bg-green-500 hover:bg-green-600 text-black" data-testid="button-buy">
                      Buy DWC
                    </Button>
                  </TabsContent>
                  <TabsContent value="sell" className="space-y-3">
                    <div className="p-2 rounded-lg bg-white/5 border border-white/10">
                      <div className="text-[10px] text-muted-foreground mb-1">Amount (DWC)</div>
                      <input 
                        type="text" 
                        className="w-full bg-transparent text-lg font-mono outline-none" 
                        placeholder="0.00"
                        data-testid="input-sell-amount"
                      />
                    </div>
                    <div className="flex gap-1">
                      {[25, 50, 75, 100].map(pct => (
                        <Button key={pct} variant="ghost" size="sm" className="flex-1 h-6 text-[10px]">
                          {pct}%
                        </Button>
                      ))}
                    </div>
                    <Button className="w-full bg-red-500 hover:bg-red-600 text-white" data-testid="button-sell">
                      Sell DWC
                    </Button>
                  </TabsContent>
                </Tabs>
              </GlassCard>
            </motion.div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
