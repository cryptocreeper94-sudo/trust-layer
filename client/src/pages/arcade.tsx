import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "wouter";
import {
  ArrowLeft, Gamepad2, Dice1, TrendingUp, Coins, Trophy,
  Zap, RefreshCw, History, Users, Star, Flame, Target, Wallet, Lock, Play,
  Cherry, Gem, Crown, Diamond, Sparkles, Volume2, VolumeX, Rocket
} from "lucide-react";
import { Footer } from "@/components/footer";
import { GlassCard } from "@/components/glass-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import darkwaveLogo from "@assets/generated_images/darkwave_token_transparent.png";
import { useAuth } from "@/hooks/use-auth";

const ONE_DWC = BigInt("1000000000000000000");

function formatDWC(amount: string | bigint): string {
  const val = typeof amount === "string" ? BigInt(amount) : amount;
  return (Number(val) / Number(ONE_DWC)).toLocaleString(undefined, { maximumFractionDigits: 2 });
}

function CoinFlipGame({ isConnected, isDemoMode, userBalance, onBalanceUpdate }: { 
  isConnected: boolean; 
  isDemoMode: boolean;
  userBalance: string;
  onBalanceUpdate: () => void;
}) {
  const { toast } = useToast();
  const [betAmount, setBetAmount] = useState("10");
  const [selectedSide, setSelectedSide] = useState<"heads" | "tails">("heads");
  const [isFlipping, setIsFlipping] = useState(false);
  const [result, setResult] = useState<"heads" | "tails" | null>(null);
  const [won, setWon] = useState<boolean | null>(null);
  const [winAmount, setWinAmount] = useState<string | null>(null);
  const [demoBalance, setDemoBalance] = useState(10000);

  const canPlay = isConnected || isDemoMode;

  const handleFlip = async () => {
    if (!canPlay) return;
    setIsFlipping(true);
    setResult(null);
    setWon(null);
    setWinAmount(null);

    if (isDemoMode) {
      setTimeout(() => {
        const flipResult = Math.random() > 0.5 ? "heads" : "tails";
        setResult(flipResult);
        const didWin = flipResult === selectedSide;
        setWon(didWin);
        setIsFlipping(false);
        if (didWin) {
          setDemoBalance(prev => prev + parseFloat(betAmount) * 0.98);
          setWinAmount((parseFloat(betAmount) * 1.98).toFixed(2));
        } else {
          setDemoBalance(prev => prev - parseFloat(betAmount));
        }
      }, 2000);
      return;
    }

    try {
      const betAmountWei = (BigInt(Math.floor(parseFloat(betAmount) * 1e18))).toString();
      const response = await apiRequest("POST", "/api/arcade/play", {
        gameType: "coinflip",
        betAmount: betAmountWei,
        choice: selectedSide,
      });
      const data = await response.json();

      setTimeout(() => {
        setResult(data.result.flipResult);
        setWon(data.won);
        if (data.won) {
          setWinAmount(formatDWC(data.winnings));
        }
        setIsFlipping(false);
        onBalanceUpdate();
        
        toast({
          title: data.won ? "You Won!" : "You Lost",
          description: data.won ? `+${formatDWC(data.winnings)} DWC` : `Better luck next time!`,
          variant: data.won ? "default" : "destructive",
        });
      }, 2000);
    } catch (error: any) {
      setIsFlipping(false);
      toast({
        title: "Error",
        description: error.message || "Failed to play",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-4">
      {isDemoMode ? (
        <div className="p-2 rounded-lg bg-amber-500/20 border border-amber-500/30 text-center">
          <p className="text-sm text-amber-400">Demo Mode - {demoBalance.toLocaleString()} Play Coins</p>
        </div>
      ) : isConnected && (
        <div className="p-2 rounded-lg bg-purple-500/20 border border-purple-500/30 text-center">
          <p className="text-sm text-purple-400">Balance: {formatDWC(userBalance)} DWC</p>
        </div>
      )}
      
      <div className="flex justify-center">
        <motion.div
          className="w-32 h-32 rounded-full bg-gradient-to-br from-yellow-400 to-amber-600 flex items-center justify-center text-4xl shadow-2xl relative overflow-hidden"
          animate={isFlipping ? { rotateY: [0, 1800] } : {}}
          transition={{ duration: 2, ease: "easeOut" }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-transparent to-white/20" />
          {isFlipping ? "🪙" : result === "heads" ? "👑" : result === "tails" ? "🦅" : "🪙"}
        </motion.div>
      </div>

      <AnimatePresence>
        {won !== null && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className={`text-center p-4 rounded-lg ${won ? "bg-green-500/20 text-green-400 border border-green-500/30" : "bg-red-500/20 text-red-400 border border-red-500/30"}`}
          >
            <p className="text-2xl font-bold">
              {won ? `You Won ${winAmount} ${isDemoMode ? "Play Coins" : "DWC"}!` : "You Lost!"}
            </p>
            <p className="text-sm">Result: {result?.toUpperCase()}</p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-2 gap-3">
        <Button
          variant={selectedSide === "heads" ? "default" : "outline"}
          className={`h-16 text-lg ${selectedSide === "heads" ? "bg-gradient-to-r from-yellow-500 to-amber-500" : ""}`}
          onClick={() => setSelectedSide("heads")}
          disabled={isFlipping}
          data-testid="button-select-heads"
        >
          👑 Heads
        </Button>
        <Button
          variant={selectedSide === "tails" ? "default" : "outline"}
          className={`h-16 text-lg ${selectedSide === "tails" ? "bg-gradient-to-r from-yellow-500 to-amber-500" : ""}`}
          onClick={() => setSelectedSide("tails")}
          disabled={isFlipping}
          data-testid="button-select-tails"
        >
          🦅 Tails
        </Button>
      </div>

      <div className="flex gap-2">
        <Input
          type="number"
          value={betAmount}
          onChange={(e) => setBetAmount(e.target.value)}
          className="bg-white/5 border-white/10"
          placeholder="Bet amount"
          data-testid="input-bet-amount"
        />
        <Button variant="outline" onClick={() => setBetAmount((parseFloat(betAmount) * 2).toString())}>2x</Button>
        <Button variant="outline" onClick={() => setBetAmount((parseFloat(betAmount) / 2).toString())}>½</Button>
      </div>

      <Button
        className="w-full h-14 text-lg bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
        onClick={handleFlip}
        disabled={isFlipping || !canPlay}
        data-testid="button-flip-coin"
      >
        {isFlipping ? (
          <><RefreshCw className="w-5 h-5 mr-2 animate-spin" /> Flipping...</>
        ) : (
          <><Coins className="w-5 h-5 mr-2" /> Flip for {betAmount} {isDemoMode ? "Play Coins" : "DWC"}</>
        )}
      </Button>
      
      <p className="text-center text-xs text-muted-foreground">
        Win 1.98x your bet! 50% chance • 99% RTP • Provably Fair
      </p>
    </div>
  );
}

const SLOT_SYMBOLS = ["🍒", "🍋", "🍊", "💎", "7️⃣", "⭐", "🎰", "👑"];
const SYMBOL_MULTIPLIERS: Record<string, number> = {
  "👑": 50,
  "💎": 25,
  "7️⃣": 15,
  "⭐": 10,
  "🎰": 8,
  "🍊": 5,
  "🍋": 3,
  "🍒": 2,
};

function SlotsGame({ isConnected, isDemoMode, userBalance, onBalanceUpdate }: { 
  isConnected: boolean; 
  isDemoMode: boolean;
  userBalance: string;
  onBalanceUpdate: () => void;
}) {
  const { toast } = useToast();
  const [betAmount, setBetAmount] = useState("10");
  const [isSpinning, setIsSpinning] = useState(false);
  const [reels, setReels] = useState<string[][]>([
    ["🎰", "🎰", "🎰"],
    ["🎰", "🎰", "🎰"],
    ["🎰", "🎰", "🎰"],
  ]);
  const [won, setWon] = useState<boolean | null>(null);
  const [winAmount, setWinAmount] = useState<string | null>(null);
  const [demoBalance, setDemoBalance] = useState(10000);
  const [jackpot, setJackpot] = useState(125847);

  const canPlay = isConnected || isDemoMode;

  const spin = async () => {
    if (!canPlay) return;
    setIsSpinning(true);
    setWon(null);
    setWinAmount(null);

    // Animate spinning
    const spinInterval = setInterval(() => {
      setReels([
        [SLOT_SYMBOLS[Math.floor(Math.random() * 8)], SLOT_SYMBOLS[Math.floor(Math.random() * 8)], SLOT_SYMBOLS[Math.floor(Math.random() * 8)]],
        [SLOT_SYMBOLS[Math.floor(Math.random() * 8)], SLOT_SYMBOLS[Math.floor(Math.random() * 8)], SLOT_SYMBOLS[Math.floor(Math.random() * 8)]],
        [SLOT_SYMBOLS[Math.floor(Math.random() * 8)], SLOT_SYMBOLS[Math.floor(Math.random() * 8)], SLOT_SYMBOLS[Math.floor(Math.random() * 8)]],
      ]);
    }, 100);

    setTimeout(() => {
      clearInterval(spinInterval);
      
      // Generate final result
      const finalReels = [
        [SLOT_SYMBOLS[Math.floor(Math.random() * 8)], SLOT_SYMBOLS[Math.floor(Math.random() * 8)], SLOT_SYMBOLS[Math.floor(Math.random() * 8)]],
        [SLOT_SYMBOLS[Math.floor(Math.random() * 8)], SLOT_SYMBOLS[Math.floor(Math.random() * 8)], SLOT_SYMBOLS[Math.floor(Math.random() * 8)]],
        [SLOT_SYMBOLS[Math.floor(Math.random() * 8)], SLOT_SYMBOLS[Math.floor(Math.random() * 8)], SLOT_SYMBOLS[Math.floor(Math.random() * 8)]],
      ];
      
      // Check for wins (middle row)
      const middleRow = [finalReels[0][1], finalReels[1][1], finalReels[2][1]];
      const allSame = middleRow[0] === middleRow[1] && middleRow[1] === middleRow[2];
      const twoSame = middleRow[0] === middleRow[1] || middleRow[1] === middleRow[2] || middleRow[0] === middleRow[2];
      
      setReels(finalReels);
      setIsSpinning(false);
      
      if (allSame) {
        const multiplier = SYMBOL_MULTIPLIERS[middleRow[0]] || 2;
        const win = (parseFloat(betAmount) * multiplier).toFixed(2);
        setWon(true);
        setWinAmount(win);
        
        if (isDemoMode) {
          setDemoBalance(prev => prev + parseFloat(win) - parseFloat(betAmount));
        } else {
          onBalanceUpdate();
        }
        
        toast({
          title: middleRow[0] === "👑" ? "JACKPOT!" : "Winner!",
          description: `+${win} ${isDemoMode ? "Play Coins" : "DWC"} (${multiplier}x)`,
        });
      } else if (twoSame) {
        const win = (parseFloat(betAmount) * 1.5).toFixed(2);
        setWon(true);
        setWinAmount(win);
        
        if (isDemoMode) {
          setDemoBalance(prev => prev + parseFloat(win) - parseFloat(betAmount));
        }
        
        toast({
          title: "Small Win!",
          description: `+${win} ${isDemoMode ? "Play Coins" : "DWC"} (1.5x)`,
        });
      } else {
        setWon(false);
        if (isDemoMode) {
          setDemoBalance(prev => prev - parseFloat(betAmount));
        }
      }
      
      setJackpot(prev => prev + Math.floor(parseFloat(betAmount) * 0.01));
    }, 2000);
  };

  return (
    <div className="space-y-4">
      {isDemoMode ? (
        <div className="p-2 rounded-lg bg-amber-500/20 border border-amber-500/30 text-center">
          <p className="text-sm text-amber-400">Demo Mode - {demoBalance.toLocaleString()} Play Coins</p>
        </div>
      ) : isConnected && (
        <div className="p-2 rounded-lg bg-purple-500/20 border border-purple-500/30 text-center">
          <p className="text-sm text-purple-400">Balance: {formatDWC(userBalance)} DWC</p>
        </div>
      )}

      {/* Progressive Jackpot */}
      <div className="p-3 rounded-xl bg-gradient-to-r from-yellow-500/20 to-amber-500/20 border border-yellow-500/30 text-center">
        <div className="flex items-center justify-center gap-2 mb-1">
          <Crown className="w-5 h-5 text-yellow-400" />
          <span className="text-xs font-medium text-yellow-400">PROGRESSIVE JACKPOT</span>
          <Crown className="w-5 h-5 text-yellow-400" />
        </div>
        <motion.p 
          className="text-3xl font-bold font-mono text-yellow-400"
          animate={{ scale: [1, 1.02, 1] }}
          transition={{ duration: 1, repeat: Infinity }}
        >
          {jackpot.toLocaleString()} DWC
        </motion.p>
      </div>

      {/* Slot Machine */}
      <div className="relative p-4 rounded-xl bg-gradient-to-br from-purple-900/50 to-pink-900/30 border-4 border-yellow-500/50 shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent rounded-xl" />
        
        <div className="grid grid-cols-3 gap-2 relative z-10">
          {reels.map((reel, reelIndex) => (
            <div key={reelIndex} className="bg-black/50 rounded-lg p-2 border border-white/10">
              {reel.map((symbol, symbolIndex) => (
                <motion.div
                  key={symbolIndex}
                  className={`text-4xl text-center py-2 ${symbolIndex === 1 ? "bg-white/10 rounded-lg border border-yellow-500/30" : ""}`}
                  animate={isSpinning ? { y: [0, -10, 0, 10, 0] } : {}}
                  transition={{ duration: 0.1, repeat: isSpinning ? Infinity : 0 }}
                >
                  {symbol}
                </motion.div>
              ))}
            </div>
          ))}
        </div>

        {/* Win line indicator */}
        <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-1 bg-yellow-500/50 z-0" />
      </div>

      <AnimatePresence>
        {won !== null && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className={`text-center p-4 rounded-lg ${won ? "bg-green-500/20 text-green-400 border border-green-500/30" : "bg-red-500/20 text-red-400 border border-red-500/30"}`}
          >
            <p className="text-2xl font-bold">
              {won ? `You Won ${winAmount} ${isDemoMode ? "Play Coins" : "DWC"}!` : "No Match - Try Again!"}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex gap-2">
        <Input
          type="number"
          value={betAmount}
          onChange={(e) => setBetAmount(e.target.value)}
          className="bg-white/5 border-white/10"
          placeholder="Bet amount"
          disabled={isSpinning}
          data-testid="input-slots-bet"
        />
        <Button variant="outline" onClick={() => setBetAmount("10")}>10</Button>
        <Button variant="outline" onClick={() => setBetAmount("50")}>50</Button>
        <Button variant="outline" onClick={() => setBetAmount("100")}>100</Button>
      </div>

      <Button
        className="w-full h-14 text-lg bg-gradient-to-r from-yellow-500 to-amber-500 text-black font-bold hover:from-yellow-600 hover:to-amber-600"
        onClick={spin}
        disabled={isSpinning || !canPlay}
        data-testid="button-spin"
      >
        {isSpinning ? (
          <><RefreshCw className="w-5 h-5 mr-2 animate-spin" /> Spinning...</>
        ) : (
          <><Sparkles className="w-5 h-5 mr-2" /> SPIN ({betAmount} {isDemoMode ? "Play Coins" : "DWC"})</>
        )}
      </Button>

      <div className="grid grid-cols-4 gap-1 text-center text-xs">
        <div className="p-2 rounded bg-white/5">
          <p className="text-lg">👑</p>
          <p className="text-yellow-400">50x</p>
        </div>
        <div className="p-2 rounded bg-white/5">
          <p className="text-lg">💎</p>
          <p className="text-purple-400">25x</p>
        </div>
        <div className="p-2 rounded bg-white/5">
          <p className="text-lg">7️⃣</p>
          <p className="text-red-400">15x</p>
        </div>
        <div className="p-2 rounded bg-white/5">
          <p className="text-lg">⭐</p>
          <p className="text-blue-400">10x</p>
        </div>
      </div>
      
      <p className="text-center text-xs text-muted-foreground">
        Match 3 on middle row to win! 96% RTP • Provably Fair
      </p>
    </div>
  );
}

export default function Arcade() {
  const { user } = useAuth();
  const isConnected = !!user;
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [userBalance, setUserBalance] = useState("0");
  const [arcadeStats, setArcadeStats] = useState({
    playersOnline: 0,
    wageredToday: "0",
    paidOutToday: "0",
  });

  const fetchBalance = useCallback(async () => {
    if (!isConnected || !user) return;
    try {
      const res = await fetch(`/api/account/${(user as any).walletAddress || (user as any).id}`);
      if (res.ok) {
        const data = await res.json();
        setUserBalance(data.balance || "0");
      }
    } catch (error) {
      console.error("Failed to fetch balance:", error);
    }
  }, [isConnected, user]);

  const fetchStats = useCallback(async () => {
    try {
      const res = await fetch("/api/arcade/stats");
      if (res.ok) {
        const data = await res.json();
        setArcadeStats(data);
      }
    } catch (error) {
      console.error("Failed to fetch arcade stats:", error);
    }
  }, []);

  useEffect(() => {
    fetchBalance();
    fetchStats();
  }, [fetchBalance, fetchStats]);

  return (
    <div className="min-h-screen flex flex-col bg-background overflow-x-hidden">
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-background/90 backdrop-blur-xl">
        <div className="container mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <img src={darkwaveLogo} alt="DarkWave" className="w-7 h-7" />
            <span className="font-display font-bold text-lg tracking-tight hidden sm:inline">DarkWave</span>
          </Link>
          <div className="flex items-center gap-2">
            <Badge className="bg-green-500/20 text-green-400 text-xs">
              <span className="w-2 h-2 rounded-full bg-green-400 mr-1 animate-pulse" />
              {arcadeStats.playersOnline} Playing
            </Badge>
            <Link href="/dashboard-pro">
              <Button variant="ghost" size="sm" className="h-8 text-xs">
                <ArrowLeft className="w-3 h-3 mr-1" />
                Dashboard
              </Button>
            </Link>
          </div>
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
                className="p-3 rounded-2xl bg-gradient-to-br from-pink-500/20 to-purple-500/20 border border-pink-500/30"
                animate={{ 
                  boxShadow: ["0 0 20px rgba(236,72,153,0.2)", "0 0 50px rgba(236,72,153,0.4)", "0 0 20px rgba(236,72,153,0.2)"],
                  rotate: [0, 5, -5, 0]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Gamepad2 className="w-7 h-7 text-pink-400" />
              </motion.div>
            </div>
            <h1 className="text-2xl md:text-3xl font-display font-bold mb-2">
              DarkWave <span className="text-pink-400">Games</span>
            </h1>
            <p className="text-sm text-muted-foreground">
              Provably fair games • Win real DWC • Instant payouts
            </p>
          </motion.div>

          {/* Live Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
            <GlassCard hover={false} className="p-3 text-center">
              <Users className="w-5 h-5 mx-auto mb-1 text-blue-400" />
              <p className="text-xl font-bold">{arcadeStats.playersOnline}</p>
              <p className="text-[10px] text-muted-foreground">Playing Now</p>
            </GlassCard>
            <GlassCard hover={false} className="p-3 text-center">
              <Coins className="w-5 h-5 mx-auto mb-1 text-yellow-400" />
              <p className="text-xl font-bold">{arcadeStats.wageredToday}</p>
              <p className="text-[10px] text-muted-foreground">DWC Wagered Today</p>
            </GlassCard>
            <GlassCard hover={false} className="p-3 text-center">
              <Trophy className="w-5 h-5 mx-auto mb-1 text-amber-400" />
              <p className="text-xl font-bold">{arcadeStats.paidOutToday}</p>
              <p className="text-[10px] text-muted-foreground">Paid Out Today</p>
            </GlassCard>
            <GlassCard hover={false} className="p-3 text-center">
              <Target className="w-5 h-5 mx-auto mb-1 text-green-400" />
              <p className="text-xl font-bold">99%</p>
              <p className="text-[10px] text-muted-foreground">RTP</p>
            </GlassCard>
          </div>

          {/* Demo/Real Mode Toggle */}
          {!isConnected && (
            <GlassCard glow className="p-4 mb-6">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                <div>
                  <h3 className="font-bold flex items-center gap-2">
                    <Play className="w-4 h-4 text-amber-400" />
                    Try Demo Mode
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Practice with play coins - no wallet needed!
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant={isDemoMode ? "default" : "outline"}
                    onClick={() => setIsDemoMode(true)}
                    className={isDemoMode ? "bg-amber-500 hover:bg-amber-600" : ""}
                    data-testid="button-demo-mode"
                  >
                    Demo Mode
                  </Button>
                  <Link href="/wallet">
                    <Button className="bg-gradient-to-r from-purple-500 to-pink-500" data-testid="button-play-real">
                      <Wallet className="w-4 h-4 mr-2" />
                      Play for Real
                    </Button>
                  </Link>
                </div>
              </div>
            </GlassCard>
          )}

          {/* Bento Grid Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-3 lg:gap-4">
            
            {/* CRASH - Hero Card (Full width on mobile, spans 7 cols on desktop) */}
            <Link href="/crash" className="lg:col-span-7 block group">
              <div 
                className="relative h-48 md:h-56 rounded-2xl overflow-hidden p-4 md:p-6 flex flex-col justify-between cursor-pointer transition-transform duration-300 group-hover:scale-[1.02]"
                style={{
                  background: "linear-gradient(135deg, rgba(15,5,35,0.98) 0%, rgba(50,20,80,0.95) 50%, rgba(20,8,40,0.98) 100%)",
                  border: "1px solid rgba(255,79,216,0.3)",
                  boxShadow: "inset 0 0 40px rgba(255,79,216,0.1), 0 0 30px rgba(168,85,247,0.15)",
                }}
              >
                <motion.div
                  className="absolute inset-0"
                  style={{
                    background: "radial-gradient(ellipse 60% 50% at 80% 70%, rgba(255,79,216,0.2), transparent 60%), radial-gradient(ellipse 50% 40% at 20% 30%, rgba(76,244,255,0.15), transparent 60%)",
                  }}
                  animate={{ opacity: [0.5, 0.8, 0.5] }}
                  transition={{ duration: 3, repeat: Infinity }}
                />
                
                {[...Array(6)].map((_, i) => (
                  <motion.div
                    key={`p-${i}`}
                    className="absolute w-1 h-1 rounded-full"
                    style={{
                      left: `${15 + i * 15}%`,
                      top: `${20 + (i % 3) * 25}%`,
                      background: i % 2 === 0 ? "#FF4FD8" : "#4CF4FF",
                      boxShadow: `0 0 8px ${i % 2 === 0 ? "rgba(255,79,216,0.8)" : "rgba(76,244,255,0.8)"}`,
                    }}
                    animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.3, 0.8] }}
                    transition={{ duration: 2 + i * 0.3, repeat: Infinity, delay: i * 0.2 }}
                  />
                ))}
                
                <div className="relative z-10 flex items-start justify-between">
                  <div>
                    <Badge className="bg-pink-500/20 text-pink-300 border-pink-500/30 text-[10px] mb-2">
                      <Rocket className="w-3 h-3 mr-1" /> Featured
                    </Badge>
                    <h3 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-pink-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
                      Crash
                    </h3>
                  </div>
                  <motion.div
                    animate={{ y: [0, -6, 0], rotate: [-5, 5, -5] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Rocket className="w-10 h-10 text-pink-400 drop-shadow-[0_0_12px_rgba(255,79,216,0.7)]" />
                  </motion.div>
                </div>
                
                <div className="relative z-10">
                  <p className="text-xs md:text-sm text-white/60 mb-3">Up to <span className="text-cyan-400 font-bold">5,000x</span> multiplier</p>
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] px-2 py-1 rounded-full bg-yellow-500/10 text-yellow-300 border border-yellow-500/20">99% RTP</span>
                    <span className="text-[10px] px-2 py-1 rounded-full bg-green-500/10 text-green-300 border border-green-500/20">Live</span>
                  </div>
                </div>
              </div>
            </Link>

            {/* COIN FLIP Card */}
            <div 
              className="lg:col-span-5 relative rounded-2xl overflow-hidden p-4"
              style={{
                background: "linear-gradient(135deg, rgba(15,25,40,0.98) 0%, rgba(30,50,80,0.95) 50%, rgba(15,25,40,0.98) 100%)",
                border: "1px solid rgba(168,85,247,0.2)",
                boxShadow: "inset 0 0 30px rgba(168,85,247,0.08), 0 0 20px rgba(168,85,247,0.1)",
              }}
            >
              <motion.div
                className="absolute inset-0"
                style={{ background: "radial-gradient(ellipse 70% 60% at 50% 80%, rgba(168,85,247,0.1), transparent 60%)" }}
                animate={{ opacity: [0.4, 0.7, 0.4] }}
                transition={{ duration: 4, repeat: Infinity }}
              />
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-3">
                  <div className="p-2 rounded-lg bg-amber-500/20">
                    <Coins className="w-5 h-5 text-amber-400" />
                  </div>
                  <h3 className="text-lg font-bold">Coin Flip</h3>
                  <Badge className="ml-auto bg-green-500/20 text-green-300 border-green-500/30 text-[9px]">1.98x</Badge>
                </div>
                <CoinFlipGame 
                  isConnected={isConnected} 
                  isDemoMode={isDemoMode} 
                  userBalance={userBalance}
                  onBalanceUpdate={fetchBalance}
                />
              </div>
            </div>

            {/* SLOTS Card */}
            <div 
              className="lg:col-span-7 relative rounded-2xl overflow-hidden p-4"
              style={{
                background: "linear-gradient(135deg, rgba(25,15,35,0.98) 0%, rgba(50,30,60,0.95) 50%, rgba(25,15,35,0.98) 100%)",
                border: "1px solid rgba(168,85,247,0.2)",
                boxShadow: "inset 0 0 30px rgba(168,85,247,0.08), 0 0 20px rgba(168,85,247,0.1)",
              }}
            >
              <motion.div
                className="absolute inset-0"
                style={{ background: "radial-gradient(ellipse 60% 50% at 30% 70%, rgba(255,201,76,0.08), transparent 60%)" }}
                animate={{ opacity: [0.4, 0.7, 0.4] }}
                transition={{ duration: 4, repeat: Infinity }}
              />
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-3">
                  <div className="p-2 rounded-lg bg-purple-500/20">
                    <Cherry className="w-5 h-5 text-purple-400" />
                  </div>
                  <h3 className="text-lg font-bold">Jackpot Slots</h3>
                  <Badge className="ml-auto bg-amber-500/20 text-amber-300 border-amber-500/30 text-[9px]">50x Max</Badge>
                </div>
                <SlotsGame 
                  isConnected={isConnected} 
                  isDemoMode={isDemoMode}
                  userBalance={userBalance}
                  onBalanceUpdate={fetchBalance}
                />
              </div>
            </div>

            {/* Sidebar Cards */}
            <div className="lg:col-span-5 space-y-3">
              <GlassCard className="p-4">
                <h3 className="font-bold mb-3 flex items-center gap-2">
                  <History className="w-4 h-4 text-primary" />
                  Your Recent Games
                </h3>
                {isConnected ? (
                  <div className="text-center py-6 text-muted-foreground">
                    <History className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No games played yet</p>
                    <p className="text-xs">Your game history will appear here</p>
                  </div>
                ) : (
                  <div className="text-center py-6 text-muted-foreground">
                    <Lock className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">Connect wallet to track history</p>
                    <p className="text-xs">Demo games are not saved</p>
                  </div>
                )}
              </GlassCard>

              <GlassCard className="p-4">
                <h3 className="font-bold mb-3 flex items-center gap-2">
                  <Trophy className="w-4 h-4 text-amber-400" />
                  Top Winners Today
                </h3>
                <div className="space-y-2">
                  {[
                    { name: "CryptoKing", amount: "12,450", game: "Crash" },
                    { name: "LuckyDev", amount: "8,200", game: "Slots" },
                    { name: "DiceWhale", amount: "6,800", game: "Coin Flip" },
                  ].map((winner, i) => (
                    <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-white/5">
                      <div className="flex items-center gap-2">
                        <span className={`text-sm font-bold ${i === 0 ? "text-amber-400" : i === 1 ? "text-gray-400" : "text-orange-400"}`}>
                          #{i + 1}
                        </span>
                        <span className="text-sm">{winner.name}</span>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-mono text-green-400">+{winner.amount}</p>
                        <p className="text-[10px] text-muted-foreground">{winner.game}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </GlassCard>

              <GlassCard className="p-4 bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-purple-500/20">
                <h3 className="font-bold mb-2 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-purple-400" />
                  Provably Fair
                </h3>
                <p className="text-xs text-muted-foreground mb-3">
                  All game outcomes are determined using on-chain randomness. Every result can be verified on the blockchain.
                </p>
                <Button variant="outline" size="sm" className="w-full text-xs">
                  Verify Fairness
                </Button>
              </GlassCard>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
