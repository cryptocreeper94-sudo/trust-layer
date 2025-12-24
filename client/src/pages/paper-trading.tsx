import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "wouter";
import {
  ArrowLeft, PlayCircle, TrendingUp, TrendingDown, BarChart3,
  Wallet, RefreshCw, Award, History, Target, Sparkles
} from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";
import { Footer } from "@/components/footer";
import { GlassCard } from "@/components/glass-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import darkwaveLogo from "@assets/generated_images/darkwave_token_transparent.png";
import { useAuth } from "@/hooks/use-auth";

const STARTING_BALANCE = 100000;

interface Position {
  id: string;
  token: string;
  type: "long" | "short";
  amount: number;
  entryPrice: number;
  currentPrice: number;
  pnl: number;
  pnlPercent: number;
}

interface Trade {
  id: string;
  token: string;
  type: "buy" | "sell";
  amount: number;
  price: number;
  time: string;
}

export default function PaperTrading() {
  const { user } = useAuth();
  const isConnected = !!user;
  const [balance, setBalance] = useState(STARTING_BALANCE);
  const [orderType, setOrderType] = useState<"buy" | "sell">("buy");
  const [amount, setAmount] = useState("");
  const [token, setToken] = useState("DWC");
  const [positions, setPositions] = useState<Position[]>([]);
  const [trades, setTrades] = useState<Trade[]>([]);

  const tokenPrices: Record<string, number> = {
    DWC: 0.152,
    BTC: 98500,
    ETH: 3450,
    SOL: 185,
  };

  const executeTrade = () => {
    if (!amount) return;
    const amountNum = parseFloat(amount);
    const price = tokenPrices[token];
    const tokenAmount = amountNum / price;

    if (orderType === "buy") {
      if (amountNum > balance) return;
      setBalance(prev => prev - amountNum);
      
      const existingPosition = positions.find(p => p.token === token);
      if (existingPosition) {
        setPositions(positions.map(p => 
          p.token === token 
            ? { ...p, amount: p.amount + tokenAmount, entryPrice: (p.entryPrice * p.amount + price * tokenAmount) / (p.amount + tokenAmount) }
            : p
        ));
      } else {
        setPositions([...positions, {
          id: Date.now().toString(),
          token,
          type: "long",
          amount: tokenAmount,
          entryPrice: price,
          currentPrice: price,
          pnl: 0,
          pnlPercent: 0,
        }]);
      }
    } else {
      const position = positions.find(p => p.token === token);
      if (!position || position.amount < tokenAmount) return;
      
      setBalance(prev => prev + amountNum);
      if (position.amount === tokenAmount) {
        setPositions(positions.filter(p => p.token !== token));
      } else {
        setPositions(positions.map(p => 
          p.token === token 
            ? { ...p, amount: p.amount - tokenAmount }
            : p
        ));
      }
    }

    setTrades([{
      id: Date.now().toString(),
      token,
      type: orderType,
      amount: tokenAmount,
      price: tokenPrices[token],
      time: new Date().toLocaleTimeString(),
    }, ...trades]);

    setAmount("");
  };

  const portfolioValue = balance + positions.reduce((sum, p) => sum + (p.amount * p.currentPrice), 0);
  const totalPnL = portfolioValue - STARTING_BALANCE;
  const pnlPercent = ((totalPnL / STARTING_BALANCE) * 100).toFixed(2);

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
            <Badge className="mb-2 bg-violet-500/20 text-violet-400">Paper Trading - No Real Money</Badge>
            <h1 className="text-2xl md:text-3xl font-display font-bold mb-2">
              Paper <span className="text-violet-400">Trading</span>
            </h1>
            <p className="text-sm text-muted-foreground">
              Practice trading with ${STARTING_BALANCE.toLocaleString()} virtual money
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
            <GlassCard hover={false} className="p-3 text-center">
              <Wallet className="w-5 h-5 mx-auto mb-1 text-purple-400" />
              <p className="text-xl font-bold">${portfolioValue.toLocaleString()}</p>
              <p className="text-[10px] text-muted-foreground">Portfolio Value</p>
            </GlassCard>
            <GlassCard hover={false} className="p-3 text-center">
              <TrendingUp className={`w-5 h-5 mx-auto mb-1 ${totalPnL >= 0 ? "text-green-400" : "text-red-400"}`} />
              <p className={`text-xl font-bold ${totalPnL >= 0 ? "text-green-400" : "text-red-400"}`}>
                {totalPnL >= 0 ? "+" : ""}${totalPnL.toLocaleString()}
              </p>
              <p className="text-[10px] text-muted-foreground">Total P/L</p>
            </GlassCard>
            <GlassCard hover={false} className="p-3 text-center">
              <BarChart3 className={`w-5 h-5 mx-auto mb-1 ${totalPnL >= 0 ? "text-green-400" : "text-red-400"}`} />
              <p className={`text-xl font-bold ${totalPnL >= 0 ? "text-green-400" : "text-red-400"}`}>
                {totalPnL >= 0 ? "+" : ""}{pnlPercent}%
              </p>
              <p className="text-[10px] text-muted-foreground">ROI</p>
            </GlassCard>
            <GlassCard hover={false} className="p-3 text-center">
              <Award className="w-5 h-5 mx-auto mb-1 text-amber-400" />
              <p className="text-xl font-bold">{trades.length}</p>
              <p className="text-[10px] text-muted-foreground">Trades Made</p>
            </GlassCard>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
            <GlassCard className="lg:col-span-2 p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-primary" />
                  Cash Balance
                </h3>
                <Badge variant="outline" className="font-mono">${balance.toLocaleString()}</Badge>
              </div>
              
              {positions.length > 0 ? (
                <div className="space-y-3">
                  <h4 className="text-sm font-medium text-muted-foreground">Open Positions</h4>
                  {positions.map((pos) => (
                    <div key={pos.id} className="flex items-center justify-between p-3 rounded-lg bg-white/5">
                      <div>
                        <p className="font-bold">{pos.token}</p>
                        <p className="text-xs text-muted-foreground">
                          {pos.amount.toFixed(4)} @ ${pos.entryPrice.toLocaleString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-mono">${(pos.amount * pos.currentPrice).toLocaleString()}</p>
                        <p className={`text-xs ${pos.pnl >= 0 ? "text-green-400" : "text-red-400"}`}>
                          {pos.pnl >= 0 ? "+" : ""}{pos.pnlPercent.toFixed(2)}%
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="h-32 flex flex-col items-center justify-center text-muted-foreground">
                  <Target className="w-10 h-10 mb-2 opacity-30" />
                  <p className="text-sm">No open positions</p>
                  <p className="text-xs">Make your first trade to get started!</p>
                </div>
              )}
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
                    <option value="DWC">DWC - ${tokenPrices.DWC}</option>
                    <option value="BTC">BTC - ${tokenPrices.BTC.toLocaleString()}</option>
                    <option value="ETH">ETH - ${tokenPrices.ETH.toLocaleString()}</option>
                    <option value="SOL">SOL - ${tokenPrices.SOL}</option>
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
                {amount && (
                  <div className="p-2 rounded-lg bg-white/5 text-xs">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">You'll {orderType}:</span>
                      <span>{(parseFloat(amount) / tokenPrices[token]).toFixed(4)} {token}</span>
                    </div>
                  </div>
                )}
                <Button 
                  className={`w-full ${orderType === "buy" ? "bg-green-500 hover:bg-green-600" : "bg-red-500 hover:bg-red-600"}`}
                  disabled={!amount || parseFloat(amount) <= 0}
                  onClick={executeTrade}
                  data-testid="button-execute-paper-trade"
                >
                  {orderType === "buy" ? "Buy" : "Sell"} {token}
                </Button>
              </div>
            </GlassCard>
          </div>

          <GlassCard className="p-4">
            <h3 className="font-bold mb-4 flex items-center gap-2">
              <History className="w-4 h-4 text-primary" />
              Trade History
            </h3>
            {trades.length > 0 ? (
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {trades.map((trade) => (
                  <div key={trade.id} className="flex items-center justify-between p-2 rounded-lg bg-white/5">
                    <div className="flex items-center gap-2">
                      <Badge className={trade.type === "buy" ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}>
                        {trade.type.toUpperCase()}
                      </Badge>
                      <span className="font-medium">{trade.token}</span>
                    </div>
                    <div className="text-right">
                      <p className="font-mono text-sm">{trade.amount.toFixed(4)} @ ${trade.price.toLocaleString()}</p>
                      <p className="text-xs text-muted-foreground">{trade.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <History className="w-10 h-10 mx-auto mb-2 opacity-30" />
                <p className="text-sm">No trades yet</p>
                <p className="text-xs">Your trade history will appear here</p>
              </div>
            )}
          </GlassCard>

          <GlassCard className="mt-6 p-4 text-center">
            <RefreshCw className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
            <h3 className="font-bold mb-2">Reset Portfolio</h3>
            <p className="text-sm text-muted-foreground mb-3">
              Start fresh with a new ${STARTING_BALANCE.toLocaleString()} virtual balance
            </p>
            <Button 
              variant="outline" 
              onClick={() => {
                setBalance(STARTING_BALANCE);
                setPositions([]);
                setTrades([]);
              }}
              data-testid="button-reset-portfolio"
            >
              Reset to ${STARTING_BALANCE.toLocaleString()}
            </Button>
          </GlassCard>

          {isConnected && (
            <GlassCard className="mt-4 p-4 text-center bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-purple-500/20">
              <Sparkles className="w-8 h-8 mx-auto mb-2 text-purple-400" />
              <h3 className="font-bold mb-2">Ready for Real Trading?</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Your paper trading stats are saved. When you're confident, switch to real trading on the DEX!
              </p>
              <Link href="/swap">
                <Button className="bg-gradient-to-r from-purple-500 to-pink-500">
                  Go to DEX
                </Button>
              </Link>
            </GlassCard>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
