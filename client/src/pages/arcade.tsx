import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "wouter";
import {
  Gamepad2, Dice1, TrendingUp, Coins, Trophy,
  Zap, RefreshCw, History, Users, Star, Flame, Target, Wallet, Lock, Play,
  Cherry, Gem, Crown, Diamond, Sparkles, Volume2, VolumeX, Rocket, BarChart3,
  ChevronLeft, ChevronRight
} from "lucide-react";
import { BackButton } from "@/components/page-nav";
import { Footer } from "@/components/footer";
import { GlassCard } from "@/components/glass-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import darkwaveLogo from "@assets/generated_images/darkwave_token_transparent.png";
import slotMachineImg from "@assets/stock_images/slot_machine_casino__6a7c017a.jpg";
import goldenCoinsImg from "@assets/stock_images/golden_coins_casino__27bb74b8.jpg";
import cosmicRocketImg from "@assets/stock_images/rocket_space_stars_c_1373e3eb.jpg";
import solitaireImg from "@assets/generated_images/solitaire_cards_on_felt.png";
import minesweeperImg from "@assets/generated_images/minesweeper_bomb_grid.png";
import spaceBlasterImg from "@assets/generated_images/space_shooter_arcade_scene.png";
import tetrisImg from "@assets/generated_images/colorful_tetris_blocks.png";
import snakeImg from "@assets/generated_images/neon_snake_game.png";
import pacmanImg from "@assets/generated_images/pac-man_arcade_maze.png";
import spadesImg from "@assets/generated_images/spades_card_game_table.png";
import fantasyImg from "@assets/generated_images/fantasy_sci-fi_world_landscape.png";
import cyberpunkImg from "@assets/generated_images/cyberpunk_neon_city.png";
import spaceImg from "@assets/generated_images/deep_space_station.png";
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

const CLASSIC_GAMES = [
  { href: "/spades", img: spadesImg, name: "Spades", desc: "4-Player Card Game", glow: "rgba(34,197,94,0.4)" },
  { href: "/solitaire", img: solitaireImg, name: "Solitaire", desc: "Klondike Classic", glow: "rgba(34,197,94,0.3)" },
  { href: "/minesweeper", img: minesweeperImg, name: "Minesweeper", desc: "Puzzle Strategy", glow: "rgba(239,68,68,0.3)" },
  { href: "/galaga", img: spaceBlasterImg, name: "Space Blaster", desc: "Arcade Shooter", glow: "rgba(139,92,246,0.3)" },
  { href: "/tetris", img: tetrisImg, name: "Tetris", desc: "Block Puzzle", glow: "rgba(168,85,247,0.3)" },
  { href: "/snake", img: snakeImg, name: "Snake", desc: "Classic Retro", glow: "rgba(34,197,94,0.3)" },
  { href: "/pacman", img: pacmanImg, name: "Pac-Man", desc: "Maze Chase", glow: "rgba(234,179,8,0.3)" },
];

function ClassicGamesCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  
  const minSwipeDistance = 50;
  
  const goToPrev = () => {
    setCurrentIndex(prev => (prev === 0 ? CLASSIC_GAMES.length - 1 : prev - 1));
  };
  
  const goToNext = () => {
    setCurrentIndex(prev => (prev === CLASSIC_GAMES.length - 1 ? 0 : prev + 1));
  };

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    if (Math.abs(distance) > minSwipeDistance) {
      if (distance > 0) goToNext();
      else goToPrev();
    }
  };

  return (
    <div className="relative">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Gamepad2 className="w-4 h-4 text-pink-400" />
          Free Arcade Games
        </h3>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={goToPrev}
            className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/10 active:scale-95 transition-transform"
            data-testid="button-carousel-prev"
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={goToNext}
            className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/10 active:scale-95 transition-transform"
            data-testid="button-carousel-next"
          >
            <ChevronRight className="w-5 h-5" />
          </Button>
        </div>
      </div>
      
      <div 
        className="relative overflow-hidden rounded-2xl"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        <motion.div
          className="flex"
          animate={{ x: `-${currentIndex * 100}%` }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          {CLASSIC_GAMES.map((game) => (
            <Link 
              key={game.href} 
              href={game.href} 
              className="block flex-shrink-0 w-full group"
            >
              <div 
                className="relative h-56 sm:h-64 rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 group-hover:shadow-[0_0_50px_var(--glow)]"
                style={{ "--glow": game.glow } as React.CSSProperties}
              >
                <img 
                  src={game.img} 
                  alt={game.name} 
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
                <div className="absolute inset-0 p-5 flex flex-col justify-end">
                  <Badge className="bg-blue-500/60 text-blue-100 border-blue-400/40 text-[10px] w-fit mb-2 backdrop-blur-sm">FREE TO PLAY</Badge>
                  <h3 className="text-2xl sm:text-3xl font-bold text-white drop-shadow-lg">{game.name}</h3>
                  <p className="text-sm text-white/70 mt-1">{game.desc}</p>
                  <div className="mt-3 flex items-center gap-2">
                    <span className="text-xs px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-sm text-white/80 border border-white/10">
                      Tap to Play
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </motion.div>
      </div>
      
      {/* Dots indicator */}
      <div className="flex justify-center gap-2 mt-4">
        {CLASSIC_GAMES.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`h-2 rounded-full transition-all duration-300 ${
              index === currentIndex 
                ? "bg-pink-400 w-6" 
                : "bg-white/20 w-2 hover:bg-white/40"
            }`}
            data-testid={`button-carousel-dot-${index}`}
          />
        ))}
      </div>
      
      {/* Game counter */}
      <p className="text-center text-xs text-white/40 mt-2">
        {currentIndex + 1} / {CLASSIC_GAMES.length}
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
        <div className="container mx-auto px-3 sm:px-4 h-14 flex items-center justify-between gap-2 overflow-x-auto">
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <img src={darkwaveLogo} alt="DarkWave" className="w-7 h-7" />
            <span className="font-display font-bold text-lg tracking-tight hidden sm:inline">DarkWave</span>
          </Link>
          <div className="flex items-center gap-1 sm:gap-2 shrink-0">
            <Badge className="bg-green-500/20 text-green-400 text-[10px] sm:text-xs whitespace-nowrap">
              <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-green-400 mr-1 animate-pulse" />
              {arcadeStats.playersOnline} Playing
            </Badge>
            {isConnected && (
              <Link href="/arcade/profile" data-testid="link-player-profile">
                <Button variant="ghost" size="sm" className="h-7 sm:h-8 text-[10px] sm:text-xs px-2">
                  <BarChart3 className="w-3 h-3" />
                  <span className="hidden sm:inline ml-1">Stats</span>
                </Button>
              </Link>
            )}
            <BackButton />
          </div>
        </div>
      </nav>

      <main className="flex-1 pt-16 pb-8 px-3 md:px-6">
        <div className="mx-auto max-w-[1200px]">
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
            <div className="relative overflow-hidden rounded-xl">
              <img src={cyberpunkImg} className="absolute inset-0 w-full h-full object-cover opacity-30" alt="" />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
              <div className="relative z-10 p-3 text-center">
                <Users className="w-5 h-5 mx-auto mb-1 text-blue-400" />
                <p className="text-xl font-bold">{arcadeStats.playersOnline}</p>
                <p className="text-[10px] text-muted-foreground">Playing Now</p>
              </div>
            </div>
            <div className="relative overflow-hidden rounded-xl">
              <img src={goldenCoinsImg} className="absolute inset-0 w-full h-full object-cover opacity-30" alt="" />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
              <div className="relative z-10 p-3 text-center">
                <Coins className="w-5 h-5 mx-auto mb-1 text-yellow-400" />
                <p className="text-xl font-bold">{arcadeStats.wageredToday}</p>
                <p className="text-[10px] text-muted-foreground">DWC Wagered Today</p>
              </div>
            </div>
            <div className="relative overflow-hidden rounded-xl">
              <img src={fantasyImg} className="absolute inset-0 w-full h-full object-cover opacity-30" alt="" />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
              <div className="relative z-10 p-3 text-center">
                <Trophy className="w-5 h-5 mx-auto mb-1 text-amber-400" />
                <p className="text-xl font-bold">{arcadeStats.paidOutToday}</p>
                <p className="text-[10px] text-muted-foreground">Paid Out Today</p>
              </div>
            </div>
            <div className="relative overflow-hidden rounded-xl">
              <img src={spaceImg} className="absolute inset-0 w-full h-full object-cover opacity-30" alt="" />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
              <div className="relative z-10 p-3 text-center">
                <Target className="w-5 h-5 mx-auto mb-1 text-green-400" />
                <p className="text-xl font-bold">99%</p>
                <p className="text-[10px] text-muted-foreground">RTP</p>
              </div>
            </div>
          </div>

          {/* Demo/Real Mode Toggle */}
          {!isConnected && (
            <div className="relative overflow-hidden rounded-xl mb-6">
              <img src={cosmicRocketImg} className="absolute inset-0 w-full h-full object-cover opacity-40" alt="" />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent" />
              <div className="relative z-10 p-4">
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
              </div>
            </div>
          )}

          {/* Games Grid */}
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Left Column - Games */}
            <div className="flex-1 space-y-4">
              {/* CRASH - Hero Card */}
              <Link href="/crash" className="block group">
              <div className="relative h-48 rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 group-hover:scale-[1.01] group-hover:shadow-[0_0_40px_rgba(255,79,216,0.3)]">
                <img 
                  src={cosmicRocketImg} 
                  alt="Crash Game" 
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-r from-pink-500/20 to-purple-500/10" />
                
                <div className="absolute inset-0 p-4 flex flex-col justify-between">
                  <div className="flex items-start justify-between">
                    <div>
                      <Badge className="bg-pink-500/30 backdrop-blur-sm text-pink-200 border-pink-400/40 text-[10px] mb-2 shadow-lg">
                        <Rocket className="w-3 h-3 mr-1" /> Featured
                      </Badge>
                      <h3 className="text-2xl font-bold text-white drop-shadow-lg">Crash</h3>
                    </div>
                    <motion.div
                      animate={{ y: [0, -8, 0], rotate: [-10, 10, -10] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="p-2 rounded-full bg-pink-500/20 backdrop-blur-sm"
                    >
                      <Rocket className="w-7 h-7 text-pink-300 drop-shadow-[0_0_15px_rgba(255,79,216,0.9)]" />
                    </motion.div>
                  </div>
                  
                  <div>
                    <p className="text-sm text-white/80 mb-2">Ride the rocket to <span className="text-cyan-300 font-bold">5,000x</span></p>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] px-2.5 py-1 rounded-full bg-black/40 backdrop-blur-sm text-yellow-300 border border-yellow-400/30">99% RTP</span>
                      <span className="text-[10px] px-2.5 py-1 rounded-full bg-green-500/30 backdrop-blur-sm text-green-300 border border-green-400/30 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" /> Live
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              </Link>

              {/* COIN FLIP Card */}
              <div className="relative rounded-2xl overflow-hidden">
                <img 
                  src={goldenCoinsImg} 
                  alt="Coin Flip" 
                  className="absolute inset-0 w-full h-full object-cover opacity-30"
                />
                <div className="absolute inset-0 bg-gradient-to-br from-amber-900/80 via-black/70 to-black/90" />
                <div className="relative z-10 p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="p-2 rounded-xl bg-amber-500/30 backdrop-blur-sm border border-amber-400/20">
                      <Coins className="w-5 h-5 text-amber-300" />
                    </div>
                    <h3 className="text-lg font-bold text-white">Coin Flip</h3>
                    <Badge className="ml-auto bg-green-500/30 backdrop-blur-sm text-green-300 border-green-400/30 text-[9px]">1.98x</Badge>
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
              <div className="relative rounded-2xl overflow-hidden">
                <img 
                  src={slotMachineImg} 
                  alt="Slots" 
                  className="absolute inset-0 w-full h-full object-cover opacity-40"
                />
                <div className="absolute inset-0 bg-gradient-to-br from-purple-900/80 via-black/70 to-black/90" />
                <div className="relative z-10 p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="p-2 rounded-xl bg-purple-500/30 backdrop-blur-sm border border-purple-400/20">
                      <Cherry className="w-5 h-5 text-purple-300" />
                    </div>
                    <h3 className="text-lg font-bold text-white">Jackpot Slots</h3>
                    <Badge className="ml-auto bg-amber-500/30 backdrop-blur-sm text-amber-300 border-amber-400/30 text-[9px]">50x Max</Badge>
                  </div>
                  <SlotsGame 
                    isConnected={isConnected} 
                    isDemoMode={isDemoMode}
                    userBalance={userBalance}
                    onBalanceUpdate={fetchBalance}
                  />
                </div>
              </div>

              {/* Free Arcade Games Carousel */}
              <ClassicGamesCarousel />
            </div>

            {/* Right Column - Sidebar */}
            <div className="lg:w-80 space-y-3">
              {/* Recent Games */}
              <div className="relative overflow-hidden rounded-xl">
                <img src={cyberpunkImg} className="absolute inset-0 w-full h-full object-cover opacity-25" alt="" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent" />
                <div className="relative z-10 p-4">
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
                </div>
              </div>

              <div className="relative overflow-hidden rounded-xl">
                <img src={fantasyImg} className="absolute inset-0 w-full h-full object-cover opacity-25" alt="" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent" />
                <div className="relative z-10 p-4">
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
                </div>
              </div>

              <div className="relative overflow-hidden rounded-xl">
                <img src={spaceImg} className="absolute inset-0 w-full h-full object-cover opacity-25" alt="" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent" />
                <div className="relative z-10 p-4">
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
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
