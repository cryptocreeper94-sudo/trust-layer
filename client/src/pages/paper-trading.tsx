import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "wouter";
import {
  ArrowLeft, PlayCircle, TrendingUp, TrendingDown, BarChart3,
  Wallet, RefreshCw, Award, History, Target
} from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";
import { Footer } from "@/components/footer";
import { GlassCard } from "@/components/glass-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import darkwaveLogo from "@assets/generated_images/darkwave_token_transparent.png";

const PORTFOLIO_DATA = [
  { time: "Day 1", value: 100000 },
  { time: "Day 2", value: 102500 },
  { time: "Day 3", value: 99800 },
  { time: "Day 4", value: 105200 },
  { time: "Day 5", value: 108400 },
  { time: "Day 6", value: 107200 },
  { time: "Day 7", value: 112500 },
];

const POSITIONS = [
  { token: "DWC", amount: 50000, avgPrice: 0.14, currentPrice: 0.152, pnl: 4285.71, pnlPercent: 8.57 },
  { token: "ETH", amount: 2.5, avgPrice: 3200, currentPrice: 3450, pnl: 625, pnlPercent: 7.81 },
  { token: "BTC", amount: 0.15, avgPrice: 95000, currentPrice: 98500, pnl: 525, pnlPercent: 3.68 },
];

const TRADE_HISTORY = [
  { type: "buy", token: "DWC", amount: 25000, price: 0.14, time: "2h ago", pnl: null },
  { type: "sell", token: "SOL", amount: 50, price: 185, time: "5h ago", pnl: 420 },
  { type: "buy", token: "ETH", amount: 1.5, price: 3200, time: "1d ago", pnl: null },
  { type: "buy", token: "BTC", amount: 0.15, price: 95000, time: "2d ago", pnl: null },
];

export default function PaperTrading() {
  const [balance] = useState(112500);
  const [orderType, setOrderType] = useState<"buy" | "sell">("buy");
  const [amount, setAmount] = useState("");
  const [token, setToken] = useState("DWC");

  const totalPnl = POSITIONS.reduce((sum, p) => sum + p.pnl, 0);
  const totalPnlPercent = ((balance - 100000) / 100000 * 100).toFixed(2);

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
                className="p-3 rounded-2xl bg-gradient-to-br from-violet-500/20 to-purple-500/20 border border-violet-500/30"
                animate={{ 
                  boxShadow: ["0 0 20px rgba(139,92,246,0.2)", "0 0 50px rgba(139,92,246,0.4)", "0 0 20px rgba(139,92,246,0.2)"]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <PlayCircle className="w-7 h-7 text-violet-400" />
              </motion.div>
            </div>
            <h1 className="text-2xl md:text-3xl font-display font-bold mb-2">
              Paper <span className="text-violet-400">Trading</span>
            </h1>
            <p className="text-sm text-muted-foreground">
              Practice with $100K virtual money • No risk, real learning
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
            <GlassCard hover={false} className="p-3 text-center">
              <Wallet className="w-5 h-5 mx-auto mb-1 text-purple-400" />
              <p className="text-xl font-bold">${balance.toLocaleString()}</p>
              <p className="text-[10px] text-muted-foreground">Portfolio Value</p>
            </GlassCard>
            <GlassCard hover={false} className="p-3 text-center">
              <TrendingUp className="w-5 h-5 mx-auto mb-1 text-green-400" />
              <p className="text-xl font-bold text-green-400">+${totalPnl.toFixed(0)}</p>
              <p className="text-[10px] text-muted-foreground">Total P/L</p>
            </GlassCard>
            <GlassCard hover={false} className="p-3 text-center">
              <BarChart3 className="w-5 h-5 mx-auto mb-1 text-blue-400" />
              <p className="text-xl font-bold text-green-400">+{totalPnlPercent}%</p>
              <p className="text-[10px] text-muted-foreground">ROI</p>
            </GlassCard>
            <GlassCard hover={false} className="p-3 text-center">
              <Award className="w-5 h-5 mx-auto mb-1 text-amber-400" />
              <p className="text-xl font-bold">#127</p>
              <p className="text-[10px] text-muted-foreground">Leaderboard</p>
            </GlassCard>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
            <GlassCard className="lg:col-span-2 p-4">
              <h3 className="font-bold mb-4 flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-primary" />
                Portfolio Performance
              </h3>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={PORTFOLIO_DATA}>
                    <defs>
                      <linearGradient id="paperGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.3} />
                        <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fill: '#666', fontSize: 10 }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#666', fontSize: 10 }} domain={['auto', 'auto']} />
                    <Tooltip
                      contentStyle={{ background: 'rgba(0,0,0,0.8)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                      labelStyle={{ color: '#999' }}
                    />
                    <Area type="monotone" dataKey="value" stroke="#8b5cf6" strokeWidth={2} fill="url(#paperGradient)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </GlassCard>

            <GlassCard glow className="p-4">
              <h3 className="font-bold mb-4 flex items-center gap-2">
                <Target className="w-4 h-4 text-primary" />
                Quick Trade
              </h3>
              
              <div className="grid grid-cols-2 gap-2 mb-4">
                <Button
                  variant={orderType === "buy" ? "default" : "outline"}
                  onClick={() => setOrderType("buy")}
                  className={orderType === "buy" ? "bg-green-500 hover:bg-green-600" : ""}
                  data-testid="button-buy"
                >
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Buy
                </Button>
                <Button
                  variant={orderType === "sell" ? "default" : "outline"}
                  onClick={() => setOrderType("sell")}
                  className={orderType === "sell" ? "bg-red-500 hover:bg-red-600" : ""}
                  data-testid="button-sell"
                >
                  <TrendingDown className="w-4 h-4 mr-2" />
                  Sell
                </Button>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Token</label>
                  <select
                    value={token}
                    onChange={(e) => setToken(e.target.value)}
                    className="w-full h-10 px-3 rounded-md bg-white/5 border border-white/10 text-sm"
                    data-testid="select-paper-token"
                  >
                    <option value="DWC">DWC - $0.152</option>
                    <option value="BTC">BTC - $98,500</option>
                    <option value="ETH">ETH - $3,450</option>
                    <option value="SOL">SOL - $185</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Amount (USD)</label>
                  <Input
                    type="number"
                    placeholder="Enter amount..."
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="bg-white/5 border-white/10"
                    data-testid="input-paper-amount"
                  />
                </div>
                <Button 
                  className={`w-full ${orderType === "buy" ? "bg-green-500 hover:bg-green-600" : "bg-red-500 hover:bg-red-600"}`}
                  data-testid="button-execute-paper-trade"
                >
                  {orderType === "buy" ? "Buy" : "Sell"} {token}
                </Button>
              </div>
            </GlassCard>
          </div>

          <Tabs defaultValue="positions">
            <TabsList className="w-full grid grid-cols-2 mb-4">
              <TabsTrigger value="positions" data-testid="tab-positions">Open Positions</TabsTrigger>
              <TabsTrigger value="history" data-testid="tab-history">Trade History</TabsTrigger>
            </TabsList>

            <TabsContent value="positions">
              <GlassCard className="p-4">
                <div className="space-y-3">
                  {POSITIONS.map((pos, i) => (
                    <motion.div
                      key={pos.token}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="flex items-center justify-between p-3 rounded-lg bg-white/5"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold">{pos.token}</span>
                          <Badge variant="outline" className="text-[9px]">
                            {pos.amount.toLocaleString()} units
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Avg: ${pos.avgPrice} → ${pos.currentPrice}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className={`font-mono ${pos.pnl > 0 ? "text-green-400" : "text-red-400"}`}>
                          {pos.pnl > 0 ? "+" : ""}${pos.pnl.toFixed(0)}
                        </p>
                        <p className={`text-xs ${pos.pnlPercent > 0 ? "text-green-400" : "text-red-400"}`}>
                          {pos.pnlPercent > 0 ? "+" : ""}{pos.pnlPercent.toFixed(2)}%
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </GlassCard>
            </TabsContent>

            <TabsContent value="history">
              <GlassCard className="p-4">
                <div className="space-y-3">
                  {TRADE_HISTORY.map((trade, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="flex items-center justify-between p-3 rounded-lg bg-white/5"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${trade.type === "buy" ? "bg-green-500/20" : "bg-red-500/20"}`}>
                          {trade.type === "buy" ? (
                            <TrendingUp className="w-4 h-4 text-green-400" />
                          ) : (
                            <TrendingDown className="w-4 h-4 text-red-400" />
                          )}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className={`text-xs font-medium ${trade.type === "buy" ? "text-green-400" : "text-red-400"}`}>
                              {trade.type.toUpperCase()}
                            </span>
                            <span className="font-bold">{trade.token}</span>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {trade.amount} @ ${trade.price}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-muted-foreground">{trade.time}</p>
                        {trade.pnl && (
                          <p className="text-xs text-green-400">+${trade.pnl}</p>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </GlassCard>
            </TabsContent>
          </Tabs>

          <GlassCard className="mt-6 p-4 text-center">
            <RefreshCw className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
            <h3 className="font-bold mb-2">Reset Portfolio</h3>
            <p className="text-sm text-muted-foreground mb-3">
              Start fresh with a new $100,000 virtual balance
            </p>
            <Button variant="outline" data-testid="button-reset-portfolio">
              Reset to $100K
            </Button>
          </GlassCard>
        </div>
      </main>

      <Footer />
    </div>
  );
}
