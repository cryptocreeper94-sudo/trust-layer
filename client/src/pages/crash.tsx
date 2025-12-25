import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "wouter";
import {
  ArrowLeft, TrendingUp, Users, MessageCircle, Shield, Gift, Coins,
  Send, Zap, Clock, AlertTriangle, ChevronDown, ChevronUp, Trophy,
  Info, ExternalLink, Wallet, Volume2, VolumeX, Settings, History, Rocket
} from "lucide-react";
import { Footer } from "@/components/footer";
import { GlassCard } from "@/components/glass-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import darkwaveLogo from "@assets/generated_images/darkwave_token_transparent.png";

const MAX_MULTIPLIER = 5000;
const HOUSE_EDGE = 0.015;

function formatDWC(amount: number): string {
  return amount.toLocaleString(undefined, { maximumFractionDigits: 2 });
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
  { name: "Bronze", minWager: 0, rewardRate: 0.001, color: "text-orange-400", bg: "from-orange-500/20" },
  { name: "Silver", minWager: 10000, rewardRate: 0.002, color: "text-gray-300", bg: "from-gray-400/20" },
  { name: "Gold", minWager: 100000, rewardRate: 0.003, color: "text-yellow-400", bg: "from-yellow-500/20" },
  { name: "Platinum", minWager: 1000000, rewardRate: 0.005, color: "text-purple-400", bg: "from-purple-500/20" },
  { name: "Diamond", minWager: 10000000, rewardRate: 0.01, color: "text-cyan-400", bg: "from-cyan-500/20" },
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
  const crashPoint = Math.floor((100 * e - h) / (e - h)) / 100;
  return Math.min(Math.max(1, crashPoint / (1 + HOUSE_EDGE)), MAX_MULTIPLIER);
}

function NeonWaveform({ multiplier, crashed, progress }: { multiplier: number; crashed: boolean; progress: number }) {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          className={`absolute left-0 right-0 h-0.5 ${crashed ? "bg-red-500/30" : "bg-gradient-to-r from-transparent via-purple-500/50 to-transparent"}`}
          style={{ bottom: `${i * 12 + 5}%` }}
          animate={{
            opacity: [0.3, 0.8, 0.3],
            scaleX: [0.8, 1, 0.8],
          }}
          transition={{
            duration: 2 - (multiplier / 100),
            repeat: Infinity,
            delay: i * 0.1,
          }}
        />
      ))}
      
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(168,85,247,0.2),transparent_60%)]" />
      
      {!crashed && [...Array(20)].map((_, i) => (
        <motion.div
          key={`star-${i}`}
          className="absolute w-1 h-1 bg-white rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            opacity: [0, 1, 0],
            y: [0, 50],
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            delay: i * 0.15,
          }}
        />
      ))}
    </div>
  );
}

function DarkWaveHovercraft({ multiplier, crashed, cashedOut }: { multiplier: number; crashed: boolean; cashedOut: boolean }) {
  const progress = Math.min((multiplier - 1) / 10, 1);
  
  return (
    <motion.div
      className="relative z-20"
      animate={{
        y: crashed ? [0, 20, 0] : 0,
        rotate: crashed ? [0, 15, -15, 0] : [0, 2, -2, 0],
        scale: crashed ? [1, 0.9, 1] : cashedOut ? 1.1 : 1,
      }}
      transition={{
        duration: crashed ? 0.5 : 2,
        repeat: crashed ? 0 : Infinity,
      }}
    >
      <div className={`relative w-20 h-20 ${crashed ? "opacity-50" : ""}`}>
        <motion.div
          className={`absolute inset-0 rounded-full blur-xl ${
            crashed ? "bg-red-500/50" : 
            cashedOut ? "bg-green-500/50" : 
            "bg-gradient-to-r from-purple-500/50 via-pink-500/50 to-cyan-500/50"
          }`}
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.5, 0.8, 0.5],
          }}
          transition={{ duration: 1, repeat: Infinity }}
        />
        
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            className={`w-16 h-8 rounded-full ${
              crashed ? "bg-gradient-to-r from-red-600 to-orange-600" :
              cashedOut ? "bg-gradient-to-r from-green-500 to-emerald-500" :
              "bg-gradient-to-r from-purple-600 via-pink-500 to-cyan-500"
            } shadow-2xl relative overflow-hidden`}
            animate={{
              boxShadow: crashed 
                ? ["0 0 20px rgba(239,68,68,0.5)", "0 0 40px rgba(239,68,68,0.8)"]
                : cashedOut
                ? ["0 0 20px rgba(34,197,94,0.5)", "0 0 40px rgba(34,197,94,0.8)"]
                : ["0 0 20px rgba(168,85,247,0.5)", "0 0 40px rgba(236,72,153,0.8)", "0 0 20px rgba(168,85,247,0.5)"],
            }}
            transition={{ duration: 0.5, repeat: Infinity }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-transparent to-white/20" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
              <img src={darkwaveLogo} alt="DWC" className="w-6 h-6" />
            </div>
          </motion.div>
        </div>
        
        {!crashed && (
          <motion.div
            className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-8 h-12"
            animate={{ opacity: [0.5, 1, 0.5], scaleY: [0.8, 1.2, 0.8] }}
            transition={{ duration: 0.2, repeat: Infinity }}
          >
            <div className="w-full h-full bg-gradient-to-b from-cyan-400 via-purple-500 to-transparent rounded-full blur-sm" />
          </motion.div>
        )}
        
        {crashed && (
          <>
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 bg-orange-500 rounded-full"
                initial={{ x: 0, y: 0, opacity: 1 }}
                animate={{
                  x: (Math.random() - 0.5) * 100,
                  y: (Math.random() - 0.5) * 100,
                  opacity: 0,
                  scale: 0,
                }}
                transition={{ duration: 0.8 }}
                style={{ left: "50%", top: "50%" }}
              />
            ))}
          </>
        )}
      </div>
    </motion.div>
  );
}

function CrashHistoryStrip({ history }: { history: number[] }) {
  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
      <span className="text-[10px] text-muted-foreground shrink-0 uppercase tracking-wider">Last Crashes:</span>
      {history.map((h, i) => (
        <motion.div
          key={i}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: i * 0.05 }}
        >
          <Badge
            className={`text-xs font-mono shrink-0 ${
              h < 1.5 ? "bg-red-500/30 text-red-400 border-red-500/50" : 
              h < 2 ? "bg-orange-500/30 text-orange-400 border-orange-500/50" : 
              h < 3 ? "bg-yellow-500/30 text-yellow-400 border-yellow-500/50" : 
              h < 5 ? "bg-green-500/30 text-green-400 border-green-500/50" : 
              h < 10 ? "bg-cyan-500/30 text-cyan-400 border-cyan-500/50" :
              "bg-purple-500/30 text-purple-400 border-purple-500/50 animate-pulse"
            }`}
          >
            {h.toFixed(2)}x
          </Badge>
        </motion.div>
      ))}
    </div>
  );
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
  const [countdown, setCountdown] = useState(20);
  const [serverSeedHash, setServerSeedHash] = useState(generateServerSeedHash());
  const [pendingRewards, setPendingRewards] = useState(0);
  const [totalWagered, setTotalWagered] = useState(0);
  const [currentTier, setCurrentTier] = useState(REWARD_TIERS[0]);
  const [demoBalance, setDemoBalance] = useState(10000);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [showFairness, setShowFairness] = useState(false);
  const [roundNumber, setRoundNumber] = useState(Math.floor(Math.random() * 99999));
  
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

  const multiplierIntervalRef = useRef<NodeJS.Timeout | null>(null);

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
            return 20;
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
    setHasBet(false);
    setRoundNumber(prev => prev + 1);
    
    const targetCrash = generateCrashPoint();
    
    multiplierIntervalRef.current = setInterval(() => {
      setMultiplier(prev => {
        const growth = 1 + (0.0005 * Math.sqrt(prev));
        const newVal = prev * growth;
        
        setBets(currentBets => {
          return currentBets.map(bet => {
            if (bet.status === "active" && bet.autoCashout && newVal >= bet.autoCashout) {
              const payout = bet.amount * bet.autoCashout * (1 - HOUSE_EDGE);
              if (bet.username === username) {
                setCashedOut(true);
                setDemoBalance(db => db + payout);
                const reward = bet.amount * currentTier.rewardRate;
                setPendingRewards(pr => pr + reward);
                toast({
                  title: "Auto Cashed Out!",
                  description: `+${payout.toFixed(2)} DWC at ${bet.autoCashout?.toFixed(2)}x`,
                });
              }
              return { ...bet, status: "cashed" as const, cashoutMultiplier: bet.autoCashout, payout };
            }
            return bet;
          });
        });
        
        if (newVal >= targetCrash) {
          if (multiplierIntervalRef.current) {
            clearInterval(multiplierIntervalRef.current);
          }
          setCrashed(true);
          setCrashPoint(targetCrash);
          setRoundStatus("crashed");
          
          setBets(prev => prev.map(b => b.status === "active" ? { ...b, status: "crashed" as const } : b));
          setHistory(prev => [targetCrash, ...prev.slice(0, 9)]);
          
          setTimeout(() => {
            setRoundStatus("waiting");
            setCountdown(20);
            setBets([]);
            setServerSeedHash(generateServerSeedHash());
          }, 3000);
          
          return targetCrash;
        }
        return newVal;
      });
    }, 50);
  }, [username, currentTier, toast]);

  useEffect(() => {
    return () => {
      if (multiplierIntervalRef.current) {
        clearInterval(multiplierIntervalRef.current);
      }
    };
  }, []);

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
    
    toast({ title: "Bet Placed!", description: `${amount} DWC on Round #${roundNumber}` });
  };

  const handleCashout = () => {
    const myBet = bets.find(b => b.username === username && b.status === "active");
    if (myBet && !cashedOut) {
      const payout = myBet.amount * multiplier * (1 - HOUSE_EDGE);
      setCashedOut(true);
      setDemoBalance(prev => prev + payout);
      const reward = myBet.amount * currentTier.rewardRate;
      setPendingRewards(prev => prev + reward);
      
      setBets(prev => prev.map(b => 
        b.id === myBet.id ? { ...b, status: "cashed" as const, cashoutMultiplier: multiplier, payout } : b
      ));
      
      toast({
        title: "Cashed Out!",
        description: `+${payout.toFixed(2)} DWC at ${multiplier.toFixed(2)}x`,
      });
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
    
    setChatMessages(prev => [...prev, newMessage].slice(-50));
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
              <Badge variant="outline" className="text-[10px] hidden sm:flex">
                Max {MAX_MULTIPLIER}x
              </Badge>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Badge className="bg-green-500/20 text-green-400 text-xs hidden sm:flex">
              <span className="w-2 h-2 rounded-full bg-green-400 mr-1 animate-pulse" />
              {bets.length} Players
            </Badge>
            <div className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30">
              <span className="text-sm font-mono font-bold text-purple-400">{formatDWC(demoBalance)} DWC</span>
            </div>
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setSoundEnabled(!soundEnabled)}>
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </Button>
          </div>
        </div>
      </nav>

      <main className="flex-1 pt-16 pb-4 px-2 md:px-4">
        <div className="container mx-auto max-w-7xl">
          <div className="mb-3">
            <CrashHistoryStrip history={history} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-3">
            <div className="lg:col-span-3 space-y-3">
              <GlassCard glow className="p-4 relative overflow-hidden">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-[10px] font-mono">
                      Round #{roundNumber}
                    </Badge>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 text-[10px]"
                      onClick={() => setShowFairness(!showFairness)}
                    >
                      <Shield className="w-3 h-3 mr-1 text-green-400" />
                      Provably Fair
                    </Button>
                  </div>
                  
                  {roundStatus === "waiting" && (
                    <motion.div
                      animate={{ scale: [1, 1.05, 1] }}
                      transition={{ duration: 0.5, repeat: Infinity }}
                    >
                      <Badge className="bg-gradient-to-r from-yellow-500/30 to-orange-500/30 text-yellow-400 border-yellow-500/50 text-sm px-3">
                        <Clock className="w-3 h-3 mr-1" />
                        Starting in {countdown}s
                      </Badge>
                    </motion.div>
                  )}
                  
                  {roundStatus === "running" && (
                    <Badge className="bg-green-500/20 text-green-400 border-green-500/50">
                      <Zap className="w-3 h-3 mr-1" />
                      LIVE
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
                        <span className="text-sm font-medium text-green-400">Provably Fair Gaming</span>
                      </div>
                      <p className="text-xs text-muted-foreground mb-2">
                        Each round's crash point is cryptographically pre-determined before betting opens. After the round ends, verify the outcome using the revealed server seed.
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        <div className="p-2 rounded bg-black/30">
                          <span className="text-[10px] text-muted-foreground block mb-1">Server Seed Hash (SHA-256):</span>
                          <code className="text-[10px] font-mono text-green-400 break-all">
                            {serverSeedHash}
                          </code>
                        </div>
                        <div className="p-2 rounded bg-black/30">
                          <span className="text-[10px] text-muted-foreground block mb-1">Game Parameters:</span>
                          <div className="text-[10px] space-y-0.5">
                            <p>House Edge: <span className="text-purple-400">{(HOUSE_EDGE * 100).toFixed(1)}%</span></p>
                            <p>Max Payout: <span className="text-cyan-400">{MAX_MULTIPLIER}x</span></p>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="relative h-56 md:h-72 rounded-xl bg-gradient-to-b from-black/80 via-purple-950/50 to-black/80 border border-purple-500/20 overflow-hidden">
                  <NeonWaveform multiplier={multiplier} crashed={crashed} progress={(multiplier - 1) / 10} />
                  
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <DarkWaveHovercraft multiplier={multiplier} crashed={crashed} cashedOut={cashedOut} />
                    
                    <motion.div
                      className={`mt-4 text-5xl md:text-7xl font-bold font-mono z-10 ${
                        crashed ? "text-red-500" : 
                        cashedOut ? "text-green-400" : 
                        multiplier >= 10 ? "text-cyan-400" :
                        multiplier >= 5 ? "text-purple-400" :
                        "text-white"
                      }`}
                      animate={{ 
                        scale: crashed ? [1, 1.2, 1] : cashedOut ? [1, 1.1, 1] : 1,
                        textShadow: crashed 
                          ? "0 0 30px rgba(239,68,68,0.8)"
                          : cashedOut 
                          ? "0 0 30px rgba(34,197,94,0.8)"
                          : multiplier >= 5 
                          ? "0 0 30px rgba(168,85,247,0.8)"
                          : "0 0 10px rgba(255,255,255,0.3)"
                      }}
                    >
                      {roundStatus === "waiting" ? (
                        <span className="text-3xl md:text-5xl text-purple-400">NEXT ROUND</span>
                      ) : (
                        `${multiplier.toFixed(2)}x`
                      )}
                    </motion.div>
                    
                    {crashed && crashPoint && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-2"
                      >
                        <Badge className="bg-red-500/30 text-red-400 border-red-500/50 text-lg px-4 py-1">
                          CRASHED @ {crashPoint.toFixed(2)}x
                        </Badge>
                      </motion.div>
                    )}
                    
                    {cashedOut && !crashed && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="mt-2"
                      >
                        <Badge className="bg-green-500/30 text-green-400 border-green-500/50 text-sm">
                          You cashed out! 💰
                        </Badge>
                      </motion.div>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-5 gap-2 mt-4">
                  <div className="col-span-1">
                    <label className="text-[10px] text-muted-foreground mb-1 block">Bet Amount (DWC)</label>
                    <Input
                      type="number"
                      value={betAmount}
                      onChange={(e) => setBetAmount(e.target.value)}
                      className="h-10 bg-white/5 border-white/10 text-sm font-mono"
                      disabled={roundStatus !== "waiting" || hasBet}
                      data-testid="input-bet-amount"
                    />
                  </div>
                  <div className="col-span-1">
                    <label className="text-[10px] text-muted-foreground mb-1 block">Auto Cashout (x)</label>
                    <Input
                      type="number"
                      value={autoCashout}
                      onChange={(e) => setAutoCashout(e.target.value)}
                      placeholder="e.g. 2.0"
                      className="h-10 bg-white/5 border-white/10 text-sm font-mono"
                      disabled={roundStatus !== "waiting" || hasBet}
                      data-testid="input-auto-cashout"
                    />
                  </div>
                  <div className="col-span-2 md:col-span-1 flex gap-1">
                    {["½", "2×", "Max"].map((btn) => (
                      <Button
                        key={btn}
                        variant="outline"
                        size="sm"
                        className="flex-1 h-10 text-xs"
                        disabled={roundStatus !== "waiting" || hasBet}
                        onClick={() => {
                          const current = parseFloat(betAmount) || 0;
                          if (btn === "½") setBetAmount(Math.max(1, current / 2).toFixed(0));
                          if (btn === "2×") setBetAmount(Math.min(demoBalance, current * 2).toFixed(0));
                          if (btn === "Max") setBetAmount(demoBalance.toFixed(0));
                        }}
                      >
                        {btn}
                      </Button>
                    ))}
                  </div>
                  <div className="col-span-2">
                    {roundStatus === "running" && hasBet && !cashedOut ? (
                      <Button
                        className="w-full h-10 text-lg bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 shadow-lg shadow-green-500/25"
                        onClick={handleCashout}
                        data-testid="button-cashout"
                      >
                        <Zap className="w-5 h-5 mr-2" />
                        CASHOUT {(parseFloat(betAmount) * multiplier * (1 - HOUSE_EDGE)).toFixed(0)} DWC
                      </Button>
                    ) : roundStatus === "waiting" ? (
                      <Button
                        className={`w-full h-10 text-lg ${
                          hasBet 
                            ? "bg-gradient-to-r from-green-500/50 to-emerald-500/50"
                            : "bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 shadow-lg shadow-purple-500/25"
                        }`}
                        onClick={placeBet}
                        disabled={hasBet}
                        data-testid="button-place-bet"
                      >
                        {hasBet ? (
                          <>✓ Bet Placed - Waiting...</>
                        ) : (
                          <>
                            <Rocket className="w-5 h-5 mr-2" />
                            BET {betAmount} DWC
                          </>
                        )}
                      </Button>
                    ) : (
                      <Button className="w-full h-10 text-lg" disabled>
                        {crashed ? "Round Ended" : cashedOut ? "You Cashed Out!" : "In Progress..."}
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
                    <Badge variant="outline" className="text-[10px] font-mono">
                      Pool: {bets.reduce((sum, b) => sum + b.amount, 0).toLocaleString()} DWC
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
                            bet.status === "cashed" ? "bg-green-500/10 border border-green-500/20" :
                            bet.status === "crashed" ? "bg-red-500/10 border border-red-500/20" : 
                            "bg-white/5"
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${
                              bet.username === username 
                                ? "bg-gradient-to-br from-purple-500 to-pink-500" 
                                : "bg-gradient-to-br from-gray-600 to-gray-700"
                            }`}>
                              {bet.username[0].toUpperCase()}
                            </div>
                            <span className={`font-medium ${bet.username === username ? "text-purple-400" : ""}`}>
                              {bet.username === username ? "You" : bet.username}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-muted-foreground font-mono">{bet.amount} DWC</span>
                            {bet.status === "cashed" && bet.cashoutMultiplier && (
                              <Badge className="bg-green-500/20 text-green-400 text-[10px] font-mono">
                                {bet.cashoutMultiplier.toFixed(2)}x → {bet.payout?.toFixed(0)}
                              </Badge>
                            )}
                            {bet.status === "crashed" && (
                              <Badge className="bg-red-500/20 text-red-400 text-[10px]">
                                Crashed
                              </Badge>
                            )}
                            {bet.status === "active" && bet.autoCashout && (
                              <Badge variant="outline" className="text-[10px] font-mono">
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
                    <Badge variant="outline" className="text-[10px]">
                      {chatMessages.length} messages
                    </Badge>
                  </div>
                  
                  <ScrollArea className="h-[160px] mb-2">
                    <div className="space-y-1 pr-2">
                      {chatMessages.map((msg) => (
                        <div key={msg.id} className="text-xs py-0.5">
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
                      data-testid="input-chat"
                    />
                    <Button size="sm" className="h-8 px-3 bg-cyan-500 hover:bg-cyan-600" onClick={sendChatMessage}>
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
                  <motion.p 
                    className="text-3xl font-bold font-mono text-yellow-400"
                    animate={{ scale: nextAirdrop < 60 ? [1, 1.05, 1] : 1 }}
                    transition={{ duration: 0.5, repeat: Infinity }}
                  >
                    {formatTime(nextAirdrop)}
                  </motion.p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Pool: <span className="text-yellow-400 font-mono">{airdropPool.toFixed(0)} DWC</span>
                  </p>
                </div>
                
                <div className="p-2 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
                  <p className="text-[10px] text-muted-foreground text-center">
                    🎁 Active players share 1% of total bets every 2 hours
                  </p>
                </div>
              </GlassCard>

              <GlassCard className={`p-4 bg-gradient-to-br ${currentTier.bg} to-transparent`}>
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
                    <span className="text-green-400 font-mono">{(currentTier.rewardRate * 100).toFixed(1)}%</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Total Wagered:</span>
                    <span className="font-mono">{totalWagered.toLocaleString()} DWC</span>
                  </div>
                </div>
                
                <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/30 mb-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">Pending Rewards:</span>
                    <span className="text-xl font-bold text-green-400 font-mono">{pendingRewards.toFixed(2)} DWC</span>
                  </div>
                </div>
                
                <Button
                  className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
                  onClick={claimRewards}
                  disabled={pendingRewards <= 0}
                  data-testid="button-claim-rewards"
                >
                  <Coins className="w-4 h-4 mr-2" />
                  Claim Rewards
                </Button>
              </GlassCard>

              <GlassCard className="p-4 border-amber-500/20">
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
                    <strong>DISCLAIMER:</strong> This is a skill-based game of chance. Past results do not guarantee future outcomes. DarkWave Games is not responsible for any losses incurred. Play responsibly.
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
