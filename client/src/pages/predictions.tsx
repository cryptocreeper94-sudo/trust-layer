import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "wouter";
import {
  TrendingUp, TrendingDown, Clock, Users, Trophy,
  Zap, DollarSign, Target, BarChart3, Wallet
} from "lucide-react";
import { BackButton } from "@/components/page-nav";
import { Footer } from "@/components/footer";
import { GlassCard } from "@/components/glass-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import darkwaveLogo from "@assets/generated_images/darkwave_token_transparent.png";
import { useAuth } from "@/hooks/use-auth";

interface Market {
  id: string;
  question: string;
  category: string;
  endsIn: string;
  yesOdds: number;
  totalPool: number;
  participants: number;
  status: "active" | "resolved";
  result?: "yes" | "no";
}

// Global markets visible to everyone
const MARKETS: Market[] = [
  {
    id: "btc-100k",
    question: "Will BTC hit $100K by end of 2025?",
    category: "Crypto",
    endsIn: "12 days",
    yesOdds: 73.5,
    totalPool: 245000,
    participants: 1847,
    status: "active",
  },
  {
    id: "eth-flip",
    question: "Will ETH flip BTC market cap in 2025?",
    category: "Crypto",
    endsIn: "6 months",
    yesOdds: 26.9,
    totalPool: 89000,
    participants: 632,
    status: "active",
  },
  {
    id: "dwc-price",
    question: "Will DWC reach $1 by February launch?",
    category: "DarkWave",
    endsIn: "52 days",
    yesOdds: 75.8,
    totalPool: 512000,
    participants: 2341,
    status: "active",
  },
  {
    id: "sol-ath",
    question: "Will SOL hit new ATH in Q1 2026?",
    category: "Crypto",
    endsIn: "3 months",
    yesOdds: 62.4,
    totalPool: 156000,
    participants: 987,
    status: "active",
  },
];

// Global stats
const GLOBAL_STATS = {
  activeMarkets: MARKETS.filter(m => m.status === "active").length,
  totalVolume: "1.2M",
  totalTraders: 5847,
};

function MarketCard({ market, isConnected }: { market: Market; isConnected: boolean }) {
  const [betAmount, setBetAmount] = useState("");
  const [selectedSide, setSelectedSide] = useState<"yes" | "no" | null>(null);

  const potentialWin = selectedSide === "yes" 
    ? (parseFloat(betAmount || "0") / market.yesOdds * 100).toFixed(0)
    : (parseFloat(betAmount || "0") / (100 - market.yesOdds) * 100).toFixed(0);

  return (
    <GlassCard className="p-4">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="outline" className="text-[9px]">{market.category}</Badge>
            <Badge className="bg-green-500/20 text-green-400 text-[9px]">
              <Users className="w-2 h-2 mr-1" />
              {market.participants.toLocaleString()}
            </Badge>
          </div>
          <h3 className="font-bold text-sm mb-2">{market.question}</h3>
        </div>
      </div>

      <div className="mb-3">
        <div className="flex items-center justify-between text-xs mb-1">
          <span className="text-green-400">YES {market.yesOdds.toFixed(1)}%</span>
          <span className="text-red-400">NO {(100 - market.yesOdds).toFixed(1)}%</span>
        </div>
        <div className="h-3 bg-white/10 rounded-full overflow-hidden flex">
          <motion.div 
            className="h-full bg-gradient-to-r from-green-500 to-emerald-500"
            initial={{ width: 0 }}
            animate={{ width: `${market.yesOdds}%` }}
            transition={{ duration: 1 }}
          />
        </div>
      </div>

      <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
        <span className="flex items-center gap-1">
          <Clock className="w-3 h-3" />
          {market.endsIn}
        </span>
        <span className="flex items-center gap-1">
          <DollarSign className="w-3 h-3" />
          {market.totalPool.toLocaleString()} DWC Pool
        </span>
      </div>

      {market.status === "active" && (
        <>
          <div className="grid grid-cols-2 gap-2 mb-3">
            <Button
              variant={selectedSide === "yes" ? "default" : "outline"}
              size="sm"
              className={selectedSide === "yes" ? "bg-green-500 hover:bg-green-600" : ""}
              onClick={() => isConnected && setSelectedSide("yes")}
              disabled={!isConnected}
              data-testid={`button-yes-${market.id}`}
            >
              <TrendingUp className="w-3 h-3 mr-1" />
              YES ({market.yesOdds.toFixed(0)}%)
            </Button>
            <Button
              variant={selectedSide === "no" ? "default" : "outline"}
              size="sm"
              className={selectedSide === "no" ? "bg-red-500 hover:bg-red-600" : ""}
              onClick={() => isConnected && setSelectedSide("no")}
              disabled={!isConnected}
              data-testid={`button-no-${market.id}`}
            >
              <TrendingDown className="w-3 h-3 mr-1" />
              NO ({(100 - market.yesOdds).toFixed(0)}%)
            </Button>
          </div>

          {!isConnected && (
            <p className="text-xs text-center text-muted-foreground mb-2">
              Connect wallet to place bets
            </p>
          )}

          {selectedSide && isConnected && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="space-y-2"
            >
              <Input
                type="number"
                placeholder="Enter amount in DWC"
                value={betAmount}
                onChange={(e) => setBetAmount(e.target.value)}
                className="bg-white/5 border-white/10"
                data-testid={`input-bet-${market.id}`}
              />
              {betAmount && (
                <div className="p-2 rounded-lg bg-white/5 text-xs">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Potential Win:</span>
                    <span className="text-green-400 font-mono">{potentialWin} DWC</span>
                  </div>
                </div>
              )}
              <Button 
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500"
                disabled={!betAmount}
                data-testid={`button-place-bet-${market.id}`}
              >
                <Zap className="w-4 h-4 mr-2" />
                Place Bet
              </Button>
            </motion.div>
          )}
        </>
      )}
    </GlassCard>
  );
}

export default function Predictions() {
  const { user } = useAuth();
  const isConnected = !!user;

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
        <div className="container mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-6"
          >
            <div className="flex items-center justify-center gap-2 mb-3">
              <motion.div 
                className="p-3 rounded-2xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 border border-amber-500/30"
                animate={{ 
                  boxShadow: ["0 0 20px rgba(245,158,11,0.2)", "0 0 50px rgba(245,158,11,0.4)", "0 0 20px rgba(245,158,11,0.2)"]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Target className="w-7 h-7 text-amber-400" />
              </motion.div>
            </div>
            <h1 className="text-2xl md:text-3xl font-display font-bold mb-2">
              Prediction <span className="text-amber-400">Markets</span>
            </h1>
            <p className="text-sm text-muted-foreground">
              Bet on future events • Earn DWC • Decentralized oracle resolution
            </p>
          </motion.div>

          {/* Global Stats - Always visible */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
            <GlassCard hover={false} className="p-3 text-center">
              <BarChart3 className="w-5 h-5 mx-auto mb-1 text-purple-400" />
              <p className="text-xl font-bold">{GLOBAL_STATS.activeMarkets}</p>
              <p className="text-[10px] text-muted-foreground">Active Markets</p>
            </GlassCard>
            <GlassCard hover={false} className="p-3 text-center">
              <DollarSign className="w-5 h-5 mx-auto mb-1 text-green-400" />
              <p className="text-xl font-bold">{GLOBAL_STATS.totalVolume}</p>
              <p className="text-[10px] text-muted-foreground">Total Volume</p>
            </GlassCard>
            <GlassCard hover={false} className="p-3 text-center">
              <Users className="w-5 h-5 mx-auto mb-1 text-blue-400" />
              <p className="text-xl font-bold">{GLOBAL_STATS.totalTraders.toLocaleString()}</p>
              <p className="text-[10px] text-muted-foreground">Traders</p>
            </GlassCard>
            <GlassCard hover={false} className="p-3 text-center">
              <Trophy className="w-5 h-5 mx-auto mb-1 text-amber-400" />
              <p className="text-xl font-bold">{isConnected ? "0" : "--"}</p>
              <p className="text-[10px] text-muted-foreground">Your Bets</p>
            </GlassCard>
          </div>

          {/* Connect prompt for non-connected users */}
          {!isConnected && (
            <GlassCard glow className="p-4 mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold">Ready to Predict?</h3>
                  <p className="text-sm text-muted-foreground">
                    Connect your wallet to place bets and win DWC
                  </p>
                </div>
                <Link href="/wallet">
                  <Button className="bg-gradient-to-r from-amber-500 to-orange-500" data-testid="button-connect-predictions">
                    <Wallet className="w-4 h-4 mr-2" />
                    Connect Wallet
                  </Button>
                </Link>
              </div>
            </GlassCard>
          )}

          <Tabs defaultValue="all">
            <TabsList className="w-full grid grid-cols-4 mb-4">
              <TabsTrigger value="all" data-testid="tab-all-markets">All</TabsTrigger>
              <TabsTrigger value="crypto" data-testid="tab-crypto-markets">Crypto</TabsTrigger>
              <TabsTrigger value="darkwave" data-testid="tab-darkwave-markets">DarkWave</TabsTrigger>
              <TabsTrigger value="mybets" data-testid="tab-my-bets">My Bets</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-4">
              {MARKETS.filter(m => m.status === "active").map((market, i) => (
                <motion.div
                  key={market.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <MarketCard market={market} isConnected={isConnected} />
                </motion.div>
              ))}
            </TabsContent>

            <TabsContent value="crypto" className="space-y-4">
              {MARKETS.filter(m => m.category === "Crypto" && m.status === "active").map((market, i) => (
                <motion.div
                  key={market.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <MarketCard market={market} isConnected={isConnected} />
                </motion.div>
              ))}
            </TabsContent>

            <TabsContent value="darkwave" className="space-y-4">
              {MARKETS.filter(m => m.category === "DarkWave" && m.status === "active").map((market, i) => (
                <motion.div
                  key={market.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <MarketCard market={market} isConnected={isConnected} />
                </motion.div>
              ))}
            </TabsContent>

            <TabsContent value="mybets">
              <GlassCard className="p-8 text-center">
                {isConnected ? (
                  <>
                    <Target className="w-12 h-12 mx-auto mb-4 text-white/10" />
                    <h3 className="font-bold mb-2">No Active Bets</h3>
                    <p className="text-sm text-muted-foreground">
                      Place a bet on any market to track it here.
                    </p>
                  </>
                ) : (
                  <>
                    <Wallet className="w-12 h-12 mx-auto mb-4 text-white/10" />
                    <h3 className="font-bold mb-2">Connect Wallet</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Connect your wallet to view and track your bets.
                    </p>
                    <Link href="/wallet">
                      <Button className="bg-gradient-to-r from-amber-500 to-orange-500">
                        Connect Wallet
                      </Button>
                    </Link>
                  </>
                )}
              </GlassCard>
            </TabsContent>
          </Tabs>

          <GlassCard className="mt-6 p-4 text-center">
            <h3 className="font-bold mb-2">Create Your Own Market</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Have a prediction? Create a market and earn fees when others bet.
            </p>
            {isConnected ? (
              <Button className="bg-gradient-to-r from-amber-500 to-orange-500" data-testid="button-create-market">
                <Target className="w-4 h-4 mr-2" />
                Create Market
              </Button>
            ) : (
              <Link href="/wallet">
                <Button className="bg-gradient-to-r from-purple-500 to-pink-500">
                  <Wallet className="w-4 h-4 mr-2" />
                  Connect to Create
                </Button>
              </Link>
            )}
          </GlassCard>
        </div>
      </main>

      <Footer />
    </div>
  );
}
