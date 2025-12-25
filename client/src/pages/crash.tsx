import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "wouter";
import {
  ArrowLeft, TrendingUp, Users, MessageCircle, Shield, Gift, Coins,
  Send, Zap, Clock, AlertTriangle, ChevronDown, ChevronUp, Trophy,
  Info, ExternalLink, Wallet, Volume2, VolumeX, Settings, History
} from "lucide-react";
import { Footer } from "@/components/footer";
import { GlassCard } from "@/components/glass-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import darkwaveLogo from "@assets/generated_images/darkwave_token_transparent.png";

const ONE_DWC = BigInt("1000000000000000000");

function formatDWC(amount: string | bigint | number): string {
  if (typeof amount === "number") return amount.toLocaleString(undefined, { maximumFractionDigits: 2 });
  const val = typeof amount === "string" ? BigInt(amount) : amount;
  return (Number(val) / Number(ONE_DWC)).toLocaleString(undefined, { maximumFractionDigits: 2 });
}

interface Bet {
  id: string;
  username: string;
  amount: number;
  autoCashout?: number;
  status: "active" | "cashed" | "crashed";
  cashoutMultiplier?: number;
  payout?: number;
}

interface ChatMessage {
  id: string;
  username: string;
  message: string;
  timestamp: Date;
}

const REWARD_TIERS = [
  { name: "Bronze", minWager: 0, rewardRate: 0.001, color: "text-orange-400" },
  { name: "Silver", minWager: 10000, rewardRate: 0.002, color: "text-gray-300" },
  { name: "Gold", minWager: 100000, rewardRate: 0.003, color: "text-yellow-400" },
  { name: "Platinum", minWager: 1000000, rewardRate: 0.005, color: "text-purple-400" },
  { name: "Diamond", minWager: 10000000, rewardRate: 0.01, color: "text-cyan-400" },
];

function generateServerSeedHash(): string {
  const chars = "0123456789abcdef";
  let hash = "";
  for (let i = 0; i < 64; i++) {
    hash += chars[Math.floor(Math.random() * chars.length)];
  }
  return hash;
}

function generateCrashPoint(): number {
  const e = 2 ** 52;
  const h = Math.floor(Math.random() * e);
  return Math.max(1, Math.floor((100 * e - h) / (e - h)) / 100);
}

export default function CrashGame() {
  const { user } = useAuth();
  const { toast } = useToast();
  const isConnected = !!user;
  const username = user?.firstName || user?.email?.split("@")[0] || "Player";
  
  const [betAmount, setBetAmount] = useState("10");
  const [autoCashout, setAutoCashout] = useState("");
  const [multiplier, setMultiplier] = useState(1.0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasBet, setHasBet] = useState(false);
  const [crashed, setCrashed] = useState(false);
  const [cashedOut, setCashedOut] = useState(false);
  const [crashPoint, setCrashPoint] = useState<number | null>(null);
  const [roundStatus, setRoundStatus] = useState<"waiting" | "running" | "crashed">("waiting");
  const [countdown, setCountdown] = useState(5);
  const [serverSeedHash, setServerSeedHash] = useState(generateServerSeedHash());
  const [pendingRewards, setPendingRewards] = useState(0);
  const [totalWagered, setTotalWagered] = useState(0);
  const [currentTier, setCurrentTier] = useState(REWARD_TIERS[0]);
  const [demoBalance, setDemoBalance] = useState(10000);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [showFairness, setShowFairness] = useState(false);
  
  const [bets, setBets] = useState<Bet[]>([]);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    { id: "1", username: "CryptoWhale", message: "Let's go! 🚀", timestamp: new Date() },
    { id: "2", username: "MoonBoy", message: "2x secured 💰", timestamp: new Date() },
    { id: "3", username: "DegenKing", message: "Who's riding to 10x?", timestamp: new Date() },
  ]);
  const [chatInput, setChatInput] = useState("");
  
  const [nextAirdrop, setNextAirdrop] = useState(7200);
  const [airdropPool, setAirdropPool] = useState(12500);
  
  const [history, setHistory] = useState<number[]>([1.23, 2.45, 1.02, 5.67, 1.89, 3.21, 1.05, 8.92, 2.34, 1.67]);

  useEffect(() => {
    const tier = REWARD_TIERS.slice().reverse().find(t => totalWagered >= t.minWager) || REWARD_TIERS[0];
    setCurrentTier(tier);
  }, [totalWagered]);

  useEffect(() => {
    const interval = setInterval(() => {
      setNextAirdrop(prev => prev > 0 ? prev - 1 : 7200);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (roundStatus === "waiting") {
      const countdownInterval = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            startRound();
            return 5;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(countdownInterval);
    }
  }, [roundStatus]);

  const startRound = useCallback(() => {
    setRoundStatus("running");
    setMultiplier(1.0);
    setCrashed(false);
    setCashedOut(false);
    setCrashPoint(null);
    
    const targetCrash = generateCrashPoint();
    
    const multiplierInterval = setInterval(() => {
      setMultiplier(prev => {
        const newVal = prev * 1.0015;
        
        bets.forEach(bet => {
          if (bet.status === "active" && bet.autoCashout && newVal >= bet.autoCashout) {
            cashoutBet(bet.id, newVal);
          }
        });
        
        if (newVal >= targetCrash) {
          clearInterval(multiplierInterval);
          setCrashed(true);
          setCrashPoint(targetCrash);
          setRoundStatus("crashed");
          
          setBets(prev => prev.map(b => b.status === "active" ? { ...b, status: "crashed" as const } : b));
          setHistory(prev => [targetCrash, ...prev.slice(0, 19)]);
          
          setTimeout(() => {
            setRoundStatus("waiting");
            setCountdown(5);
            setBets([]);
            setServerSeedHash(generateServerSeedHash());
          }, 3000);
          
          return newVal;
        }
        return newVal;
      });
    }, 50);
  }, [bets]);

  const cashoutBet = (betId: string, mult: number) => {
    setBets(prev => prev.map(b => {
      if (b.id === betId && b.status === "active") {
        const payout = b.amount * mult * 0.99;
        if (b.username === username) {
          setCashedOut(true);
          setDemoBalance(prev => prev + payout);
          const reward = b.amount * currentTier.rewardRate;
          setPendingRewards(prev => prev + reward);
          toast({
            title: "Cashed Out!",
            description: `+${payout.toFixed(2)} DWC at ${mult.toFixed(2)}x (+${reward.toFixed(2)} DWC rewards)`,
          });
        }
        return { ...b, status: "cashed" as const, cashoutMultiplier: mult, payout };
      }
      return b;
    }));
  };

  const placeBet = () => {
    if (roundStatus !== "waiting" || hasBet) return;
    
    const amount = parseFloat(betAmount);
    if (isNaN(amount) || amount <= 0) {
      toast({ title: "Invalid bet amount", variant: "destructive" });
      return;
    }

    if (amount > demoBalance) {
      toast({ title: "Insufficient balance", variant: "destructive" });
      return;
    }

    setDemoBalance(prev => prev - amount);
    setTotalWagered(prev => prev + amount);
    setAirdropPool(prev => prev + amount * 0.01);
    
    const newBet: Bet = {
      id: crypto.randomUUID(),
      username,
      amount,
      autoCashout: autoCashout ? parseFloat(autoCashout) : undefined,
      status: "active",
    };
    
    setBets(prev => [newBet, ...prev]);
    setHasBet(true);
    
    for (let i = 0; i < 3 + Math.floor(Math.random() * 5); i++) {
      setTimeout(() => {
        const fakeBet: Bet = {
          id: crypto.randomUUID(),
          username: `Player${Math.floor(Math.random() * 9999)}`,
          amount: Math.floor(Math.random() * 500) + 10,
          autoCashout: Math.random() > 0.5 ? 1.5 + Math.random() * 3 : undefined,
          status: "active",
        };
        setBets(prev => [...prev, fakeBet]);
      }, i * 200);
    }
    
    toast({ title: "Bet Placed!", description: `${amount} DWC on this round` });
  };

  const handleCashout = () => {
    const myBet = bets.find(b => b.username === username && b.status === "active");
    if (myBet) {
      cashoutBet(myBet.id, multiplier);
    }
  };

  const sendChatMessage = () => {
    if (!chatInput.trim()) return;
    
    const newMessage: ChatMessage = {
      id: crypto.randomUUID(),
      username: isConnected ? username : "Anonymous",
      message: chatInput.trim(),
      timestamp: new Date(),
    };
    
    setChatMessages(prev => [...prev, newMessage]);
    setChatInput("");
  };

  const claimRewards = () => {
    if (pendingRewards <= 0) return;
    setDemoBalance(prev => prev + pendingRewards);
    toast({ title: "Rewards Claimed!", description: `+${pendingRewards.toFixed(2)} DWC added to balance` });
    setPendingRewards(0);
  };

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <div className="min-h-screen flex flex-col bg-background overflow-x-hidden">
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-background/90 backdrop-blur-xl">
        <div className="container mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/arcade">
              <Button variant="ghost" size="sm" className="h-8 text-xs">
                <ArrowLeft className="w-3 h-3 mr-1" />
                Arcade
              </Button>
            </Link>
            <div className="flex items-center gap-2">
              <img src={darkwaveLogo} alt="DarkWave" className="w-6 h-6" />
              <span className="font-display font-bold">Crash</span>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Badge className="bg-green-500/20 text-green-400 text-xs">
              <span className="w-2 h-2 rounded-full bg-green-400 mr-1 animate-pulse" />
              {bets.length} Players
            </Badge>
            <div className="px-3 py-1 rounded-lg bg-purple-500/20 text-purple-400 text-sm font-mono">
              {demoBalance.toLocaleString()} DWC
            </div>
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setSoundEnabled(!soundEnabled)}>
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </Button>
          </div>
        </div>
      </nav>

      <main className="flex-1 pt-16 pb-4 px-2 md:px-4">
        <div className="container mx-auto max-w-7xl">
          <div className="mb-3 flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
            <Badge variant="outline" className="text-[10px] shrink-0">History:</Badge>
            {history.map((h, i) => (
              <Badge
                key={i}
                className={`text-[10px] shrink-0 ${h < 2 ? "bg-red-500/20 text-red-400" : h < 5 ? "bg-yellow-500/20 text-yellow-400" : "bg-green-500/20 text-green-400"}`}
              >
                {h.toFixed(2)}x
              </Badge>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-3">
            <div className="lg:col-span-3 space-y-3">
              <GlassCard glow className="p-4 relative overflow-hidden">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-[10px]">
                      Round #{Math.floor(Math.random() * 99999)}
                    </Badge>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 text-[10px]"
                      onClick={() => setShowFairness(!showFairness)}
                    >
                      <Shield className="w-3 h-3 mr-1" />
                      Fairness
                    </Button>
                  </div>
                  
                  {roundStatus === "waiting" && (
                    <Badge className="bg-yellow-500/20 text-yellow-400 animate-pulse">
                      <Clock className="w-3 h-3 mr-1" />
                      Starting in {countdown}s
                    </Badge>
                  )}
                </div>

                <AnimatePresence>
                  {showFairness && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="mb-3 p-3 rounded-lg bg-green-500/10 border border-green-500/30"
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <Shield className="w-4 h-4 text-green-400" />
                        <span className="text-sm font-medium text-green-400">Provably Fair</span>
                      </div>
                      <p className="text-xs text-muted-foreground mb-2">
                        The crash point is determined before the round starts using a cryptographic hash. After the round, you can verify the outcome.
                      </p>
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] text-muted-foreground">Server Seed Hash:</span>
                          <code className="text-[10px] font-mono text-green-400 bg-black/30 px-2 py-0.5 rounded truncate max-w-[200px]">
                            {serverSeedHash}
                          </code>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="relative h-40 md:h-56 rounded-xl bg-gradient-to-br from-black/50 to-purple-900/30 border border-white/10 overflow-hidden flex items-center justify-center">
                  {roundStatus === "running" && (
                    <motion.div 
                      className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-green-500/30 to-transparent"
                      initial={{ height: 0 }}
                      animate={{ height: `${Math.min((multiplier - 1) * 20, 100)}%` }}
                    />
                  )}
                  
                  {roundStatus === "crashed" && (
                    <div className="absolute inset-0 bg-red-500/20" />
                  )}
                  
                  <motion.div
                    className={`text-5xl md:text-7xl font-bold font-mono z-10 ${
                      roundStatus === "crashed" ? "text-red-500" : 
                      cashedOut ? "text-green-400" : "text-white"
                    }`}
                    animate={{ scale: roundStatus === "crashed" ? [1, 1.2, 1] : 1 }}
                  >
                    {roundStatus === "waiting" ? "NEXT ROUND" : `${multiplier.toFixed(2)}x`}
                  </motion.div>
                  
                  {roundStatus === "crashed" && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="absolute bottom-4 text-center"
                    >
                      <p className="text-lg font-bold text-red-500">CRASHED @ {crashPoint?.toFixed(2)}x</p>
                    </motion.div>
                  )}
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-3">
                  <div>
                    <label className="text-[10px] text-muted-foreground mb-1 block">Bet Amount</label>
                    <Input
                      type="number"
                      value={betAmount}
                      onChange={(e) => setBetAmount(e.target.value)}
                      className="h-9 bg-white/5 border-white/10 text-sm"
                      disabled={roundStatus !== "waiting" || hasBet}
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-muted-foreground mb-1 block">Auto Cashout</label>
                    <Input
                      type="number"
                      value={autoCashout}
                      onChange={(e) => setAutoCashout(e.target.value)}
                      placeholder="Optional"
                      className="h-9 bg-white/5 border-white/10 text-sm"
                      disabled={roundStatus !== "waiting" || hasBet}
                    />
                  </div>
                  <div className="flex gap-1">
                    {["1/2", "2x", "Max"].map((btn) => (
                      <Button
                        key={btn}
                        variant="outline"
                        size="sm"
                        className="flex-1 h-9 text-[10px]"
                        disabled={roundStatus !== "waiting" || hasBet}
                        onClick={() => {
                          const current = parseFloat(betAmount) || 0;
                          if (btn === "1/2") setBetAmount((current / 2).toString());
                          if (btn === "2x") setBetAmount((current * 2).toString());
                          if (btn === "Max") setBetAmount(demoBalance.toString());
                        }}
                      >
                        {btn}
                      </Button>
                    ))}
                  </div>
                  <div>
                    {roundStatus === "running" && hasBet && !cashedOut ? (
                      <Button
                        className="w-full h-9 bg-gradient-to-r from-green-500 to-emerald-500 text-sm"
                        onClick={handleCashout}
                      >
                        <Zap className="w-4 h-4 mr-1" />
                        Cashout {(parseFloat(betAmount) * multiplier).toFixed(0)}
                      </Button>
                    ) : (
                      <Button
                        className="w-full h-9 bg-gradient-to-r from-pink-500 to-purple-500 text-sm"
                        onClick={placeBet}
                        disabled={roundStatus !== "waiting" || hasBet}
                      >
                        {hasBet ? "Bet Placed" : "Place Bet"}
                      </Button>
                    )}
                  </div>
                </div>
              </GlassCard>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <GlassCard className="p-3">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-bold flex items-center gap-2">
                      <Users className="w-4 h-4 text-purple-400" />
                      Live Bets ({bets.length})
                    </h3>
                    <Badge variant="outline" className="text-[10px]">
                      {bets.reduce((sum, b) => sum + b.amount, 0).toFixed(0)} DWC
                    </Badge>
                  </div>
                  
                  <ScrollArea className="h-[200px]">
                    <div className="space-y-1">
                      {bets.map((bet) => (
                        <motion.div
                          key={bet.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          className={`flex items-center justify-between p-2 rounded-lg text-xs ${
                            bet.status === "cashed" ? "bg-green-500/10" :
                            bet.status === "crashed" ? "bg-red-500/10" : "bg-white/5"
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-[10px] font-bold">
                              {bet.username[0]}
                            </div>
                            <span className="font-medium">{bet.username}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-muted-foreground">{bet.amount} DWC</span>
                            {bet.status === "cashed" && (
                              <Badge className="bg-green-500/20 text-green-400 text-[10px]">
                                {bet.cashoutMultiplier?.toFixed(2)}x
                              </Badge>
                            )}
                            {bet.status === "crashed" && (
                              <Badge className="bg-red-500/20 text-red-400 text-[10px]">
                                Crashed
                              </Badge>
                            )}
                            {bet.status === "active" && bet.autoCashout && (
                              <Badge variant="outline" className="text-[10px]">
                                @{bet.autoCashout.toFixed(2)}x
                              </Badge>
                            )}
                          </div>
                        </motion.div>
                      ))}
                      {bets.length === 0 && (
                        <p className="text-xs text-muted-foreground text-center py-8">
                          No bets yet. Be the first!
                        </p>
                      )}
                    </div>
                  </ScrollArea>
                </GlassCard>

                <GlassCard className="p-3">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-bold flex items-center gap-2">
                      <MessageCircle className="w-4 h-4 text-cyan-400" />
                      Live Chat
                    </h3>
                  </div>
                  
                  <ScrollArea className="h-[160px] mb-2">
                    <div className="space-y-1">
                      {chatMessages.map((msg) => (
                        <div key={msg.id} className="text-xs">
                          <span className="text-purple-400 font-medium">{msg.username}: </span>
                          <span className="text-muted-foreground">{msg.message}</span>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                  
                  <div className="flex gap-2">
                    <Input
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      placeholder="Type a message..."
                      className="h-8 text-xs bg-white/5 border-white/10"
                      onKeyPress={(e) => e.key === "Enter" && sendChatMessage()}
                    />
                    <Button size="sm" className="h-8 px-3" onClick={sendChatMessage}>
                      <Send className="w-3 h-3" />
                    </Button>
                  </div>
                </GlassCard>
              </div>
            </div>

            <div className="space-y-3">
              <GlassCard className="p-4 bg-gradient-to-br from-yellow-500/10 to-amber-500/5 border-yellow-500/30">
                <div className="flex items-center gap-2 mb-3">
                  <Gift className="w-5 h-5 text-yellow-400" />
                  <span className="font-bold text-sm">Next Airdrop</span>
                </div>
                
                <div className="text-center mb-3">
                  <p className="text-2xl font-bold font-mono text-yellow-400">{formatTime(nextAirdrop)}</p>
                  <p className="text-xs text-muted-foreground">Pool: {airdropPool.toFixed(0)} DWC</p>
                </div>
                
                <p className="text-[10px] text-muted-foreground text-center">
                  Active players share 1% of total bets every 2 hours
                </p>
              </GlassCard>

              <GlassCard className="p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Trophy className="w-5 h-5 text-purple-400" />
                  <span className="font-bold text-sm">Play-to-Earn</span>
                </div>
                
                <div className="space-y-2 mb-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Your Tier:</span>
                    <span className={`font-bold ${currentTier.color}`}>{currentTier.name}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Reward Rate:</span>
                    <span className="text-green-400">{(currentTier.rewardRate * 100).toFixed(1)}% of bets</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Total Wagered:</span>
                    <span>{totalWagered.toLocaleString()} DWC</span>
                  </div>
                </div>
                
                <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/30 mb-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">Pending Rewards:</span>
                    <span className="text-lg font-bold text-green-400">{pendingRewards.toFixed(2)} DWC</span>
                  </div>
                </div>
                
                <Button
                  className="w-full bg-gradient-to-r from-green-500 to-emerald-500"
                  onClick={claimRewards}
                  disabled={pendingRewards <= 0}
                >
                  <Coins className="w-4 h-4 mr-2" />
                  Claim Rewards
                </Button>
              </GlassCard>

              <GlassCard className="p-4">
                <div className="flex items-center gap-2 mb-3">
                  <AlertTriangle className="w-5 h-5 text-amber-400" />
                  <span className="font-bold text-sm">Responsible Gaming</span>
                </div>
                
                <div className="space-y-2 text-[10px] text-muted-foreground">
                  <p>• Only wager what you can afford to lose</p>
                  <p>• Set limits on your betting activity</p>
                  <p>• Take breaks and play responsibly</p>
                  <p>• Must be 18+ to participate</p>
                </div>
                
                <div className="mt-3 p-2 rounded-lg bg-amber-500/10 border border-amber-500/30">
                  <p className="text-[10px] text-amber-400">
                    This is a skill-based game. Past results do not guarantee future outcomes. DarkWave Games is not responsible for any losses incurred.
                  </p>
                </div>
              </GlassCard>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
