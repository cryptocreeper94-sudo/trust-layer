import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "wouter";
import {
  ArrowLeft, PlayCircle, TrendingUp, TrendingDown, BarChart3,
  Wallet, RefreshCw, Award, History, Target, Lock, Sparkles
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

export default function PaperTrading() {
  const { user } = useAuth();
  const isConnected = !!user;
  const [balance] = useState(STARTING_BALANCE);
  const [orderType, setOrderType] = useState<"buy" | "sell">("buy");
  const [amount, setAmount] = useState("");
  const [token, setToken] = useState("DWC");
  const [hasStarted, setHasStarted] = useState(false);

  if (!isConnected) {
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

        <main className="flex-1 pt-16 pb-8 px-4 flex items-center justify-center">
          <GlassCard glow className="p-8 text-center max-w-md">
            <Lock className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <h2 className="text-2xl font-bold mb-2">Paper Trading Simulator</h2>
            <p className="text-muted-foreground mb-6">
              Practice trading with $100,000 in virtual money. Perfect for learning without any risk.
            </p>
            <Link href="/wallet">
              <Button className="bg-gradient-to-r from-violet-500 to-purple-500" data-testid="button-connect-paper">
                <Wallet className="w-4 h-4 mr-2" />
                Connect Wallet to Start
              </Button>
            </Link>
          </GlassCard>
        </main>

        <Footer />
      </div>
    );
  }

  if (!hasStarted) {
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

        <main className="flex-1 pt-16 pb-8 px-4 flex items-center justify-center">
          <GlassCard glow className="p-8 text-center max-w-md">
            <motion.div
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <PlayCircle className="w-20 h-20 mx-auto mb-4 text-violet-400" />
            </motion.div>
            <h2 className="text-2xl font-bold mb-2">Ready to Practice?</h2>
            <p className="text-muted-foreground mb-4">
              You'll start with <span className="text-green-400 font-bold">$100,000</span> in virtual money.
              Trade freely without any real risk!
            </p>
            <div className="grid grid-cols-2 gap-3 mb-6 text-left">
              <div className="p-3 rounded-lg bg-white/5">
                <Sparkles className="w-5 h-5 text-amber-400 mb-1" />
                <p className="text-xs font-medium">No Real Money</p>
                <p className="text-[10px] text-muted-foreground">Practice risk-free</p>
              </div>
              <div className="p-3 rounded-lg bg-white/5">
                <TrendingUp className="w-5 h-5 text-green-400 mb-1" />
                <p className="text-xs font-medium">Real Prices</p>
                <p className="text-[10px] text-muted-foreground">Live market data</p>
              </div>
              <div className="p-3 rounded-lg bg-white/5">
                <Award className="w-5 h-5 text-purple-400 mb-1" />
                <p className="text-xs font-medium">Leaderboard</p>
                <p className="text-[10px] text-muted-foreground">Compete with others</p>
              </div>
              <div className="p-3 rounded-lg bg-white/5">
                <History className="w-5 h-5 text-blue-400 mb-1" />
                <p className="text-xs font-medium">Track Progress</p>
                <p className="text-[10px] text-muted-foreground">Full trade history</p>
              </div>
            </div>
            <Button 
              className="w-full bg-gradient-to-r from-violet-500 to-purple-500"
              onClick={() => setHasStarted(true)}
              data-testid="button-start-paper-trading"
            >
              <PlayCircle className="w-4 h-4 mr-2" />
              Start Paper Trading
            </Button>
          </GlassCard>
        </main>

        <Footer />
      </div>
    );
  }

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
            <Badge className="mb-2 bg-violet-500/20 text-violet-400">Paper Trading Mode</Badge>
            <h1 className="text-2xl md:text-3xl font-display font-bold mb-2">
              Paper <span className="text-violet-400">Trading</span>
            </h1>
            <p className="text-sm text-muted-foreground">
              Practice with virtual money • No risk
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
            <GlassCard hover={false} className="p-3 text-center">
              <Wallet className="w-5 h-5 mx-auto mb-1 text-purple-400" />
              <p className="text-xl font-bold">${balance.toLocaleString()}</p>
              <p className="text-[10px] text-muted-foreground">Portfolio Value</p>
            </GlassCard>
            <GlassCard hover={false} className="p-3 text-center">
              <TrendingUp className="w-5 h-5 mx-auto mb-1 text-muted-foreground" />
              <p className="text-xl font-bold text-muted-foreground">$0</p>
              <p className="text-[10px] text-muted-foreground">Total P/L</p>
            </GlassCard>
            <GlassCard hover={false} className="p-3 text-center">
              <BarChart3 className="w-5 h-5 mx-auto mb-1 text-muted-foreground" />
              <p className="text-xl font-bold text-muted-foreground">0%</p>
              <p className="text-[10px] text-muted-foreground">ROI</p>
            </GlassCard>
            <GlassCard hover={false} className="p-3 text-center">
              <Award className="w-5 h-5 mx-auto mb-1 text-muted-foreground" />
              <p className="text-xl font-bold text-muted-foreground">--</p>
              <p className="text-[10px] text-muted-foreground">Leaderboard</p>
            </GlassCard>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
            <GlassCard className="lg:col-span-2 p-4">
              <h3 className="font-bold mb-4 flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-primary" />
                Portfolio Performance
              </h3>
              <div className="h-48 flex items-center justify-center text-muted-foreground">
                <div className="text-center">
                  <BarChart3 className="w-12 h-12 mx-auto mb-2 opacity-30" />
                  <p className="text-sm">Make your first trade to see performance</p>
                </div>
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
                  disabled={!amount}
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
              <GlassCard className="p-8 text-center">
                <Target className="w-12 h-12 mx-auto mb-4 text-white/10" />
                <h3 className="font-bold mb-2">No Open Positions</h3>
                <p className="text-sm text-muted-foreground">
                  Make your first trade to see your positions here.
                </p>
              </GlassCard>
            </TabsContent>

            <TabsContent value="history">
              <GlassCard className="p-8 text-center">
                <History className="w-12 h-12 mx-auto mb-4 text-white/10" />
                <h3 className="font-bold mb-2">No Trade History</h3>
                <p className="text-sm text-muted-foreground">
                  Your trades will appear here once you start trading.
                </p>
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
