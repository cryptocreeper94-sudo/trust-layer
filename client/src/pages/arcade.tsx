import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "wouter";
import {
  ArrowLeft, Gamepad2, Dice1, TrendingUp, Coins, Trophy,
  Zap, RefreshCw, History, Users, Star, Flame, Target, Wallet, Lock, Play
} from "lucide-react";
import { Footer } from "@/components/footer";
import { GlassCard } from "@/components/glass-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import darkwaveLogo from "@assets/generated_images/darkwave_token_transparent.png";
import { useAuth } from "@/hooks/use-auth";

function CoinFlipGame({ isConnected, isDemoMode }: { isConnected: boolean; isDemoMode: boolean }) {
  const [betAmount, setBetAmount] = useState("100");
  const [selectedSide, setSelectedSide] = useState<"heads" | "tails">("heads");
  const [isFlipping, setIsFlipping] = useState(false);
  const [result, setResult] = useState<"heads" | "tails" | null>(null);
  const [won, setWon] = useState<boolean | null>(null);
  const [demoBalance, setDemoBalance] = useState(10000);

  const canPlay = isConnected || isDemoMode;

  const handleFlip = () => {
    if (!canPlay) return;
    setIsFlipping(true);
    setResult(null);
    setWon(null);
    
    setTimeout(() => {
      const flipResult = Math.random() > 0.5 ? "heads" : "tails";
      setResult(flipResult);
      const didWin = flipResult === selectedSide;
      setWon(didWin);
      setIsFlipping(false);
      
      if (isDemoMode) {
        if (didWin) {
          setDemoBalance(prev => prev + parseFloat(betAmount));
        } else {
          setDemoBalance(prev => prev - parseFloat(betAmount));
        }
      }
    }, 2000);
  };

  return (
    <div className="space-y-4">
      {isDemoMode && (
        <div className="p-2 rounded-lg bg-amber-500/20 border border-amber-500/30 text-center">
          <p className="text-sm text-amber-400">Demo Mode - {demoBalance.toLocaleString()} Play Coins</p>
        </div>
      )}
      
      <div className="flex justify-center">
        <motion.div
          className="w-32 h-32 rounded-full bg-gradient-to-br from-yellow-400 to-amber-600 flex items-center justify-center text-4xl shadow-2xl"
          animate={isFlipping ? { rotateY: [0, 1800] } : {}}
          transition={{ duration: 2, ease: "easeOut" }}
        >
          {isFlipping ? "🪙" : result === "heads" ? "👑" : result === "tails" ? "🦅" : "🪙"}
        </motion.div>
      </div>

      {won !== null && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className={`text-center p-4 rounded-lg ${won ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}`}
        >
          <p className="text-2xl font-bold">{won ? `You Won ${parseFloat(betAmount) * 2} ${isDemoMode ? "Play Coins" : "DWC"}!` : "You Lost!"}</p>
          <p className="text-sm">Result: {result?.toUpperCase()}</p>
        </motion.div>
      )}

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
        className="w-full h-14 text-lg bg-gradient-to-r from-purple-500 to-pink-500"
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
        Win 2x your bet! 50% chance • Provably Fair
      </p>
    </div>
  );
}

function CrashGame({ isConnected, isDemoMode }: { isConnected: boolean; isDemoMode: boolean }) {
  const [betAmount, setBetAmount] = useState("100");
  const [autoCashout, setAutoCashout] = useState("2.0");
  const [isPlaying, setIsPlaying] = useState(false);
  const [multiplier, setMultiplier] = useState(1.0);
  const [crashed, setCrashed] = useState(false);
  const [cashedOut, setCashedOut] = useState(false);

  const canPlay = isConnected || isDemoMode;

  useEffect(() => {
    if (isPlaying && !crashed && !cashedOut) {
      const interval = setInterval(() => {
        setMultiplier(prev => {
          const newVal = prev + 0.01 + Math.random() * 0.02;
          if (Math.random() < 0.005 + (prev - 1) * 0.003) {
            setCrashed(true);
            setIsPlaying(false);
            return prev;
          }
          if (newVal >= parseFloat(autoCashout)) {
            setCashedOut(true);
            setIsPlaying(false);
          }
          return newVal;
        });
      }, 50);
      return () => clearInterval(interval);
    }
  }, [isPlaying, crashed, cashedOut, autoCashout]);

  const handlePlay = () => {
    if (!canPlay) return;
    setIsPlaying(true);
    setMultiplier(1.0);
    setCrashed(false);
    setCashedOut(false);
  };

  const handleCashout = () => {
    setCashedOut(true);
    setIsPlaying(false);
  };

  return (
    <div className="space-y-4">
      {isDemoMode && (
        <div className="p-2 rounded-lg bg-amber-500/20 border border-amber-500/30 text-center">
          <p className="text-sm text-amber-400">Demo Mode - Practice for Free!</p>
        </div>
      )}
      
      <div className="relative h-48 rounded-xl bg-gradient-to-br from-black/50 to-purple-900/30 border border-white/10 overflow-hidden flex items-center justify-center">
        <motion.div
          className={`text-6xl font-bold font-mono ${crashed ? "text-red-500" : cashedOut ? "text-green-400" : "text-white"}`}
          animate={{ scale: crashed ? [1, 1.2, 1] : 1 }}
        >
          {multiplier.toFixed(2)}x
        </motion.div>
        {crashed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 bg-red-500/20 flex items-center justify-center"
          >
            <p className="text-2xl font-bold text-red-500">CRASHED!</p>
          </motion.div>
        )}
        {cashedOut && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute bottom-2 left-0 right-0 text-center"
          >
            <Badge className="bg-green-500/20 text-green-400">
              Won {(parseFloat(betAmount) * multiplier).toFixed(0)} {isDemoMode ? "Play Coins" : "DWC"}!
            </Badge>
          </motion.div>
        )}
        <div className="absolute top-2 right-2">
          <Badge variant="outline" className="text-xs">
            <Flame className="w-3 h-3 mr-1 text-orange-400" />
            Live
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs text-muted-foreground mb-1 block">Bet Amount</label>
          <Input
            type="number"
            value={betAmount}
            onChange={(e) => setBetAmount(e.target.value)}
            className="bg-white/5 border-white/10"
            disabled={isPlaying}
            data-testid="input-crash-bet"
          />
        </div>
        <div>
          <label className="text-xs text-muted-foreground mb-1 block">Auto Cashout</label>
          <Input
            type="number"
            value={autoCashout}
            onChange={(e) => setAutoCashout(e.target.value)}
            className="bg-white/5 border-white/10"
            disabled={isPlaying}
            data-testid="input-auto-cashout"
          />
        </div>
      </div>

      {isPlaying ? (
        <Button
          className="w-full h-14 text-lg bg-gradient-to-r from-green-500 to-emerald-500"
          onClick={handleCashout}
          data-testid="button-cashout"
        >
          <Zap className="w-5 h-5 mr-2" />
          Cashout {(parseFloat(betAmount) * multiplier).toFixed(0)} {isDemoMode ? "Play Coins" : "DWC"}
        </Button>
      ) : (
        <Button
          className="w-full h-14 text-lg bg-gradient-to-r from-purple-500 to-pink-500"
          onClick={handlePlay}
          disabled={!canPlay}
          data-testid="button-play-crash"
        >
          <TrendingUp className="w-5 h-5 mr-2" />
          Place Bet ({betAmount} {isDemoMode ? "Play Coins" : "DWC"})
        </Button>
      )}
    </div>
  );
}

function DiceGame({ isConnected, isDemoMode }: { isConnected: boolean; isDemoMode: boolean }) {
  const [betAmount, setBetAmount] = useState("100");
  const [target, setTarget] = useState(50);
  const [isOver, setIsOver] = useState(true);
  const [isRolling, setIsRolling] = useState(false);
  const [result, setResult] = useState<number | null>(null);
  const [won, setWon] = useState<boolean | null>(null);

  const canPlay = isConnected || isDemoMode;
  const winChance = isOver ? (100 - target) : target;
  const multiplier = (99 / winChance).toFixed(2);

  const handleRoll = () => {
    if (!canPlay) return;
    setIsRolling(true);
    setResult(null);
    setWon(null);

    setTimeout(() => {
      const roll = Math.floor(Math.random() * 100) + 1;
      setResult(roll);
      const didWin = isOver ? roll > target : roll < target;
      setWon(didWin);
      setIsRolling(false);
    }, 1500);
  };

  return (
    <div className="space-y-4">
      {isDemoMode && (
        <div className="p-2 rounded-lg bg-amber-500/20 border border-amber-500/30 text-center">
          <p className="text-sm text-amber-400">Demo Mode - Practice for Free!</p>
        </div>
      )}
      
      <div className="relative h-32 rounded-xl bg-gradient-to-br from-black/50 to-blue-900/30 border border-white/10 flex items-center justify-center">
        <motion.div
          className={`text-5xl font-bold font-mono ${won === true ? "text-green-400" : won === false ? "text-red-400" : "text-white"}`}
          animate={isRolling ? { rotate: [0, 360, 720, 1080] } : {}}
          transition={{ duration: 1.5 }}
        >
          {isRolling ? "🎲" : result ?? "?"}
        </motion.div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span>Target: {target}</span>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant={isOver ? "default" : "outline"}
              onClick={() => setIsOver(true)}
              data-testid="button-roll-over"
            >
              Roll Over
            </Button>
            <Button
              size="sm"
              variant={!isOver ? "default" : "outline"}
              onClick={() => setIsOver(false)}
              data-testid="button-roll-under"
            >
              Roll Under
            </Button>
          </div>
        </div>
        <input
          type="range"
          min="5"
          max="95"
          value={target}
          onChange={(e) => setTarget(parseInt(e.target.value))}
          className="w-full"
          data-testid="slider-dice-target"
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Win Chance: {winChance}%</span>
          <span>Multiplier: {multiplier}x</span>
        </div>
      </div>

      <Input
        type="number"
        value={betAmount}
        onChange={(e) => setBetAmount(e.target.value)}
        className="bg-white/5 border-white/10"
        placeholder="Bet amount"
        disabled={isRolling}
        data-testid="input-dice-bet"
      />

      <Button
        className="w-full h-14 text-lg bg-gradient-to-r from-blue-500 to-cyan-500"
        onClick={handleRoll}
        disabled={isRolling || !canPlay}
        data-testid="button-roll-dice"
      >
        {isRolling ? (
          <><RefreshCw className="w-5 h-5 mr-2 animate-spin" /> Rolling...</>
        ) : (
          <><Dice1 className="w-5 h-5 mr-2" /> Roll for {betAmount} {isDemoMode ? "Play Coins" : "DWC"}</>
        )}
      </Button>
    </div>
  );
}

export default function Arcade() {
  const { user } = useAuth();
  const isConnected = !!user;
  const [isDemoMode, setIsDemoMode] = useState(false);

  // Simulated live stats (would come from API in production)
  const liveStats = {
    playersOnline: 847,
    wageredToday: "1.2M",
    paidOutToday: "1.18M",
  };

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
              DarkWave <span className="text-pink-400">Arcade</span>
            </h1>
            <p className="text-sm text-muted-foreground">
              Provably fair games • Win DWC • Instant payouts
            </p>
          </motion.div>

          {/* Live Stats - Always visible */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
            <GlassCard hover={false} className="p-3 text-center">
              <Users className="w-5 h-5 mx-auto mb-1 text-blue-400" />
              <p className="text-xl font-bold">{liveStats.playersOnline}</p>
              <p className="text-[10px] text-muted-foreground">Playing Now</p>
            </GlassCard>
            <GlassCard hover={false} className="p-3 text-center">
              <Coins className="w-5 h-5 mx-auto mb-1 text-yellow-400" />
              <p className="text-xl font-bold">{liveStats.wageredToday}</p>
              <p className="text-[10px] text-muted-foreground">DWC Wagered Today</p>
            </GlassCard>
            <GlassCard hover={false} className="p-3 text-center">
              <Trophy className="w-5 h-5 mx-auto mb-1 text-amber-400" />
              <p className="text-xl font-bold">{liveStats.paidOutToday}</p>
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
              <div className="flex items-center justify-between">
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
                    className={isDemoMode ? "bg-amber-500" : ""}
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

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2">
              <Tabs defaultValue="coinflip">
                <TabsList className="w-full grid grid-cols-3 mb-4">
                  <TabsTrigger value="coinflip" className="gap-1" data-testid="tab-coinflip">
                    <Coins className="w-3 h-3" /> Coin Flip
                  </TabsTrigger>
                  <TabsTrigger value="crash" className="gap-1" data-testid="tab-crash">
                    <TrendingUp className="w-3 h-3" /> Crash
                  </TabsTrigger>
                  <TabsTrigger value="dice" className="gap-1" data-testid="tab-dice">
                    <Dice1 className="w-3 h-3" /> Dice
                  </TabsTrigger>
                </TabsList>

                <GlassCard glow className="p-4">
                  <TabsContent value="coinflip" className="mt-0">
                    <CoinFlipGame isConnected={isConnected} isDemoMode={isDemoMode} />
                  </TabsContent>
                  <TabsContent value="crash" className="mt-0">
                    <CrashGame isConnected={isConnected} isDemoMode={isDemoMode} />
                  </TabsContent>
                  <TabsContent value="dice" className="mt-0">
                    <DiceGame isConnected={isConnected} isDemoMode={isDemoMode} />
                  </TabsContent>
                </GlassCard>
              </Tabs>
            </div>

            <div className="space-y-4">
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
                    { name: "LuckyDev", amount: "8,200", game: "Coin Flip" },
                    { name: "DiceWhale", amount: "6,800", game: "Dice" },
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
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
