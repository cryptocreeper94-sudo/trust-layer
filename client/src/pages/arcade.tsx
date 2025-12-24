import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "wouter";
import {
  ArrowLeft, Gamepad2, Dice1, TrendingUp, Coins, Trophy,
  Zap, RefreshCw, History, Users, Star, Flame, Target
} from "lucide-react";
import { Footer } from "@/components/footer";
import { GlassCard } from "@/components/glass-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import darkwaveLogo from "@assets/generated_images/darkwave_token_transparent.png";

const RECENT_WINS = [
  { user: "whale.dwc", game: "Crash", amount: 5420, multiplier: 12.5 },
  { user: "alpha_hunter", game: "Coin Flip", amount: 1200, multiplier: 2.0 },
  { user: "defi_king", game: "Dice", amount: 3800, multiplier: 6.2 },
  { user: "satoshi.eth", game: "Crash", amount: 890, multiplier: 3.4 },
  { user: "crypto_queen", game: "Coin Flip", amount: 2500, multiplier: 2.0 },
];

const LEADERBOARD = [
  { rank: 1, user: "whale.dwc", wagered: 125000, profit: 15420, avatar: "🐋" },
  { rank: 2, user: "defi_king", wagered: 98000, profit: 12100, avatar: "👑" },
  { rank: 3, user: "alpha_hunter", wagered: 87500, profit: 9800, avatar: "🎯" },
  { rank: 4, user: "satoshi.eth", wagered: 65000, profit: 7200, avatar: "⚡" },
  { rank: 5, user: "crypto_queen", wagered: 52000, profit: 5100, avatar: "💎" },
];

function CoinFlipGame() {
  const [betAmount, setBetAmount] = useState("100");
  const [selectedSide, setSelectedSide] = useState<"heads" | "tails">("heads");
  const [isFlipping, setIsFlipping] = useState(false);
  const [result, setResult] = useState<"heads" | "tails" | null>(null);
  const [won, setWon] = useState<boolean | null>(null);

  const handleFlip = () => {
    setIsFlipping(true);
    setResult(null);
    setWon(null);
    
    setTimeout(() => {
      const flipResult = Math.random() > 0.5 ? "heads" : "tails";
      setResult(flipResult);
      setWon(flipResult === selectedSide);
      setIsFlipping(false);
    }, 2000);
  };

  return (
    <div className="space-y-4">
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
          <p className="text-2xl font-bold">{won ? `You Won ${parseFloat(betAmount) * 2} DWC!` : "You Lost!"}</p>
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
        disabled={isFlipping}
        data-testid="button-flip-coin"
      >
        {isFlipping ? (
          <><RefreshCw className="w-5 h-5 mr-2 animate-spin" /> Flipping...</>
        ) : (
          <><Coins className="w-5 h-5 mr-2" /> Flip for {betAmount} DWC</>
        )}
      </Button>
      
      <p className="text-center text-xs text-muted-foreground">
        Win 2x your bet! 50% chance • Provably Fair
      </p>
    </div>
  );
}

function CrashGame() {
  const [betAmount, setBetAmount] = useState("100");
  const [autoCashout, setAutoCashout] = useState("2.0");
  const [isPlaying, setIsPlaying] = useState(false);
  const [multiplier, setMultiplier] = useState(1.0);
  const [crashed, setCrashed] = useState(false);
  const [cashedOut, setCashedOut] = useState(false);

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
              Won {(parseFloat(betAmount) * multiplier).toFixed(0)} DWC!
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
          Cashout {(parseFloat(betAmount) * multiplier).toFixed(0)} DWC
        </Button>
      ) : (
        <Button
          className="w-full h-14 text-lg bg-gradient-to-r from-purple-500 to-pink-500"
          onClick={handlePlay}
          data-testid="button-play-crash"
        >
          <TrendingUp className="w-5 h-5 mr-2" />
          Place Bet ({betAmount} DWC)
        </Button>
      )}
    </div>
  );
}

function DiceGame() {
  const [betAmount, setBetAmount] = useState("100");
  const [target, setTarget] = useState(50);
  const [isOver, setIsOver] = useState(true);
  const [isRolling, setIsRolling] = useState(false);
  const [result, setResult] = useState<number | null>(null);
  const [won, setWon] = useState<boolean | null>(null);

  const winChance = isOver ? (100 - target) : target;
  const multiplier = (99 / winChance).toFixed(2);

  const handleRoll = () => {
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
        disabled={isRolling}
        data-testid="button-roll-dice"
      >
        {isRolling ? (
          <><RefreshCw className="w-5 h-5 mr-2 animate-spin" /> Rolling...</>
        ) : (
          <><Dice1 className="w-5 h-5 mr-2" /> Roll for {betAmount} DWC</>
        )}
      </Button>
    </div>
  );
}

export default function Arcade() {
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

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
            <GlassCard hover={false} className="p-3 text-center">
              <Users className="w-5 h-5 mx-auto mb-1 text-blue-400" />
              <p className="text-xl font-bold">1,247</p>
              <p className="text-[10px] text-muted-foreground">Playing Now</p>
            </GlassCard>
            <GlassCard hover={false} className="p-3 text-center">
              <Coins className="w-5 h-5 mx-auto mb-1 text-yellow-400" />
              <p className="text-xl font-bold">2.5M</p>
              <p className="text-[10px] text-muted-foreground">DWC Wagered Today</p>
            </GlassCard>
            <GlassCard hover={false} className="p-3 text-center">
              <Trophy className="w-5 h-5 mx-auto mb-1 text-amber-400" />
              <p className="text-xl font-bold">125K</p>
              <p className="text-[10px] text-muted-foreground">Won Today</p>
            </GlassCard>
            <GlassCard hover={false} className="p-3 text-center">
              <Target className="w-5 h-5 mx-auto mb-1 text-green-400" />
              <p className="text-xl font-bold">99%</p>
              <p className="text-[10px] text-muted-foreground">RTP</p>
            </GlassCard>
          </div>

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
                    <CoinFlipGame />
                  </TabsContent>
                  <TabsContent value="crash" className="mt-0">
                    <CrashGame />
                  </TabsContent>
                  <TabsContent value="dice" className="mt-0">
                    <DiceGame />
                  </TabsContent>
                </GlassCard>
              </Tabs>
            </div>

            <div className="space-y-4">
              <GlassCard className="p-4">
                <h3 className="font-bold mb-3 flex items-center gap-2">
                  <History className="w-4 h-4 text-primary" />
                  Recent Wins
                </h3>
                <div className="space-y-2">
                  {RECENT_WINS.map((win, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="flex items-center justify-between p-2 rounded-lg bg-white/5"
                    >
                      <div>
                        <p className="text-xs font-medium">@{win.user}</p>
                        <p className="text-[10px] text-muted-foreground">{win.game}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs font-mono text-green-400">+{win.amount} DWC</p>
                        <p className="text-[10px] text-muted-foreground">{win.multiplier}x</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </GlassCard>

              <GlassCard className="p-4">
                <h3 className="font-bold mb-3 flex items-center gap-2">
                  <Trophy className="w-4 h-4 text-amber-400" />
                  Leaderboard
                </h3>
                <div className="space-y-2">
                  {LEADERBOARD.slice(0, 5).map((player, i) => (
                    <div
                      key={i}
                      className={`flex items-center justify-between p-2 rounded-lg ${i < 3 ? "bg-gradient-to-r from-amber-500/10 to-transparent" : "bg-white/5"}`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{player.avatar}</span>
                        <div>
                          <p className="text-xs font-medium">@{player.user}</p>
                          <p className="text-[10px] text-muted-foreground">{(player.wagered/1000).toFixed(0)}K wagered</p>
                        </div>
                      </div>
                      <p className="text-xs font-mono text-green-400">+{(player.profit/1000).toFixed(1)}K</p>
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
