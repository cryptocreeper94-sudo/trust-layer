import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useAnimation } from "framer-motion";
import { Coins, Sparkles, Crown, Star, Flame, Zap, Diamond, Cherry, CircleDollarSign, Gem, Trophy, Volume2, VolumeX, Info, Minus, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import { apiRequest } from "@/lib/queryClient";
import { Switch } from "@/components/ui/switch";
import { SimpleLoginModal } from "@/components/simple-login";
import dragonBg from "@assets/generated_images/game_dragon_slots.png";
import leprechaunBg from "@assets/generated_images/game_leprechaun_slots.png";

interface SweepsBalance {
  goldCoins: string;
  sweepsCoins: string;
}

const SLOT_THEMES = {
  egyptian: {
    id: "egyptian",
    name: "Egyptian Gold",
    description: "Discover the treasures of the Pharaohs",
    bgGradient: "from-amber-900/80 via-yellow-900/60 to-amber-950/80",
    accentColor: "text-yellow-400",
    borderColor: "border-yellow-500/30",
    symbols: ["👁️", "🏺", "🐍", "⚱️", "🔱", "💎", "👑", "⭐"],
    payTable: {
      "👑👑👑": 100,
      "💎💎💎": 50,
      "🔱🔱🔱": 25,
      "👁️👁️👁️": 15,
      "🏺🏺🏺": 10,
      "⚱️⚱️⚱️": 8,
      "🐍🐍🐍": 5,
      "⭐⭐⭐": 3,
    },
    jackpot: 10000,
    bgImage: null as string | null,
  },
  cosmic: {
    id: "cosmic",
    name: "Cosmic Fortune",
    description: "Spin among the stars for cosmic wins",
    bgGradient: "from-purple-900/80 via-indigo-900/60 to-purple-950/80",
    accentColor: "text-purple-400",
    borderColor: "border-purple-500/30",
    symbols: ["🌟", "🌙", "🪐", "☄️", "🚀", "👽", "💫", "🌌"],
    payTable: {
      "🚀🚀🚀": 100,
      "👽👽👽": 50,
      "🪐🪐🪐": 25,
      "☄️☄️☄️": 15,
      "🌟🌟🌟": 10,
      "💫💫💫": 8,
      "🌙🌙🌙": 5,
      "🌌🌌🌌": 3,
    },
    jackpot: 15000,
    bgImage: null as string | null,
  },
  dragon: {
    id: "dragon",
    name: "Dragon's Treasure",
    description: "Awaken the dragon for legendary riches",
    bgGradient: "from-red-900/80 via-orange-900/60 to-red-950/80",
    accentColor: "text-red-400",
    borderColor: "border-red-500/30",
    symbols: ["🐉", "🔥", "💰", "🗡️", "🛡️", "⚔️", "💎", "👑"],
    payTable: {
      "🐉🐉🐉": 100,
      "👑👑👑": 50,
      "💎💎💎": 25,
      "🔥🔥🔥": 15,
      "💰💰💰": 10,
      "⚔️⚔️⚔️": 8,
      "🗡️🗡️🗡️": 5,
      "🛡️🛡️🛡️": 3,
    },
    jackpot: 20000,
    bgImage: dragonBg,
  },
  neon: {
    id: "neon",
    name: "Neon Nights",
    description: "The city lights lead to big wins",
    bgGradient: "from-pink-900/80 via-cyan-900/60 to-pink-950/80",
    accentColor: "text-pink-400",
    borderColor: "border-pink-500/30",
    symbols: ["🎰", "💵", "🎲", "🃏", "💋", "🍸", "💎", "7️⃣"],
    payTable: {
      "7️⃣7️⃣7️⃣": 100,
      "💎💎💎": 50,
      "💵💵💵": 25,
      "🎰🎰🎰": 15,
      "🃏🃏🃏": 10,
      "🍸🍸🍸": 8,
      "💋💋💋": 5,
      "🎲🎲🎲": 3,
    },
    jackpot: 25000,
    bgImage: leprechaunBg,
  },
};

type ThemeKey = keyof typeof SLOT_THEMES;

const BET_OPTIONS = [10, 25, 50, 100, 250, 500, 1000];

const DEMO_BALANCE = { goldCoins: "10000", sweepsCoins: "100" };

const LED_DOT_COUNT = 32;

function CoinRain() {
  const coins = Array.from({ length: 30 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    delay: Math.random() * 1.5,
    duration: 1.5 + Math.random() * 1.5,
    size: 16 + Math.random() * 20,
  }));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-20">
      {coins.map((coin) => (
        <motion.div
          key={coin.id}
          className="absolute"
          style={{ left: `${coin.left}%`, top: -40, fontSize: coin.size }}
          initial={{ y: -40, opacity: 1, rotate: 0 }}
          animate={{ y: 600, opacity: [1, 1, 0.5], rotate: 360 }}
          transition={{ duration: coin.duration, delay: coin.delay, ease: "easeIn" }}
        >
          🪙
        </motion.div>
      ))}
    </div>
  );
}

function LedBorder({ isSpinning, accentColor }: { isSpinning: boolean; accentColor: string }) {
  const colorClass = accentColor.replace('text-', 'bg-');
  return (
    <div className="absolute inset-0 pointer-events-none rounded-3xl z-0">
      {Array.from({ length: LED_DOT_COUNT }).map((_, i) => {
        const angle = (i / LED_DOT_COUNT) * 360;
        const radians = (angle * Math.PI) / 180;
        const radiusX = 50;
        const radiusY = 50;
        const x = 50 + radiusX * Math.cos(radians);
        const y = 50 + radiusY * Math.sin(radians);
        return (
          <motion.div
            key={i}
            className={`absolute w-1.5 h-1.5 md:w-2 md:h-2 rounded-full ${colorClass}`}
            style={{
              left: `${x}%`,
              top: `${y}%`,
              transform: 'translate(-50%, -50%)',
            }}
            animate={isSpinning ? {
              opacity: [0.2, 1, 0.2],
              scale: [0.8, 1.3, 0.8],
            } : {
              opacity: [0.15, 0.4, 0.15],
              scale: 1,
            }}
            transition={{
              duration: isSpinning ? 0.6 : 2,
              repeat: Infinity,
              delay: (i / LED_DOT_COUNT) * (isSpinning ? 0.3 : 1.5),
              ease: "easeInOut",
            }}
          />
        );
      })}
    </div>
  );
}

function SparkleText({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative inline-flex items-center gap-3">
      <motion.span
        animate={{ rotate: [0, 15, -15, 0], scale: [1, 1.2, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <Sparkles className="w-5 h-5 md:w-6 md:h-6 text-yellow-300" />
      </motion.span>
      <span className="text-lg md:text-2xl font-extrabold tracking-widest bg-gradient-to-r from-yellow-200 via-yellow-400 to-amber-500 bg-clip-text text-transparent drop-shadow-lg">
        {children}
      </span>
      <motion.span
        animate={{ rotate: [0, -15, 15, 0], scale: [1, 1.2, 1] }}
        transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
      >
        <Sparkles className="w-5 h-5 md:w-6 md:h-6 text-yellow-300" />
      </motion.span>
    </div>
  );
}

function CornerDot({ position }: { position: string }) {
  const posClasses: Record<string, string> = {
    'top-left': '-top-1.5 -left-1.5',
    'top-right': '-top-1.5 -right-1.5',
    'bottom-left': '-bottom-1.5 -left-1.5',
    'bottom-right': '-bottom-1.5 -right-1.5',
  };
  return (
    <div className={`absolute ${posClasses[position]} z-10`}>
      <div className="w-4 h-4 md:w-5 md:h-5 rounded-full bg-gradient-to-br from-yellow-300 via-amber-400 to-yellow-600 border-2 border-yellow-200 shadow-lg shadow-yellow-500/50" />
    </div>
  );
}

export default function Slots() {
  const { user, isLoading: authLoading } = useAuth();
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [selectedTheme, setSelectedTheme] = useState<ThemeKey>("egyptian");
  const [currencyType, setCurrencyType] = useState<"GC" | "SC">("GC");
  const [betAmount, setBetAmount] = useState(100);
  const [isSpinning, setIsSpinning] = useState(false);
  const [reels, setReels] = useState<string[][]>([[], [], []]);
  const [visibleSymbols, setVisibleSymbols] = useState<string[]>(["⭐", "⭐", "⭐"]);
  const [lastWin, setLastWin] = useState<number | null>(null);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [showPayTable, setShowPayTable] = useState(false);
  const [demoBalance, setDemoBalance] = useState(DEMO_BALANCE);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const isDemo = !user;
  
  const reelControls = [useAnimation(), useAnimation(), useAnimation()];
  
  const theme = SLOT_THEMES[selectedTheme];

  const { data: balance, refetch: refetchBalance } = useQuery<SweepsBalance>({
    queryKey: ["/api/sweeps/balance"],
    enabled: !!user,
  });

  const gameMutation = useMutation({
    mutationFn: async (data: {
      gameType: string;
      currencyType: string;
      betAmount: number;
      multiplier: number;
      payout: number;
      profit: number;
      outcome: string;
    }) => {
      const res = await apiRequest("POST", "/api/sweeps/game", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/sweeps/balance"] });
    },
  });

  const formatNumber = (num: string | number) => {
    return parseFloat(num.toString()).toLocaleString();
  };

  const currentBalance = isDemo ? demoBalance : balance;

  const getBalance = () => {
    if (!currentBalance) return 0;
    return parseFloat(currencyType === "GC" ? currentBalance.goldCoins : currentBalance.sweepsCoins);
  };

  const generateReelSymbols = () => {
    const symbols = theme.symbols;
    return Array(20).fill(null).map(() => symbols[Math.floor(Math.random() * symbols.length)]);
  };

  const spin = async () => {
    if (isSpinning) return;
    
    const bal = getBalance();
    if (bal < betAmount) {
      toast({
        title: "Insufficient Balance",
        description: `You need at least ${betAmount} ${currencyType} to spin`,
        variant: "destructive",
      });
      return;
    }

    setIsSpinning(true);
    setLastWin(null);

    const newReels = [generateReelSymbols(), generateReelSymbols(), generateReelSymbols()];
    setReels(newReels);

    const finalSymbols = [
      newReels[0][newReels[0].length - 1],
      newReels[1][newReels[1].length - 1],
      newReels[2][newReels[2].length - 1],
    ];

    const spinPromises = reelControls.map((control, index) => {
      return control.start({
        y: [0, -50 * newReels[index].length],
        transition: {
          duration: 1.5 + index * 0.5,
          ease: [0.2, 0.8, 0.2, 1],
        },
      });
    });

    await Promise.all(spinPromises);

    setVisibleSymbols(finalSymbols);

    const matchKey = finalSymbols.join("") as keyof typeof theme.payTable;
    const multiplier = theme.payTable[matchKey] || 0;
    const payout = betAmount * multiplier;
    const profit = payout - betAmount;

    if (isDemo) {
      setDemoBalance(prev => {
        const key = currencyType === "GC" ? "goldCoins" : "sweepsCoins";
        const newVal = parseFloat(prev[key]) + profit;
        return { ...prev, [key]: String(Math.max(0, newVal)) };
      });
    } else {
      await gameMutation.mutateAsync({
        gameType: `slots_${selectedTheme}`,
        currencyType,
        betAmount,
        multiplier,
        payout,
        profit,
        outcome: multiplier > 0 ? "win" : "loss",
      });
    }

    if (multiplier > 0) {
      setLastWin(payout);
      toast({
        title: `You Won ${formatNumber(payout)} ${currencyType}!`,
        description: `${finalSymbols.join(" ")} - ${multiplier}x multiplier!`,
      });
    }

    setIsSpinning(false);
  };

  const adjustBet = (delta: number) => {
    const currentIndex = BET_OPTIONS.indexOf(betAmount);
    const newIndex = Math.max(0, Math.min(BET_OPTIONS.length - 1, currentIndex + delta));
    setBetAmount(BET_OPTIONS[newIndex]);
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0a0a0f] via-[#12121a] to-[#0a0a0f]">
        <div className="animate-pulse text-purple-400">Loading...</div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br ${theme.bgGradient} text-white overflow-hidden`}>
      {theme.bgImage && (
        <div className="absolute inset-0 z-0">
          <img src={theme.bgImage} alt="" className="w-full h-full object-cover opacity-15" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/80" />
        </div>
      )}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white/5 via-transparent to-transparent pointer-events-none" />
      
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className={`absolute w-2 h-2 rounded-full ${theme.accentColor.replace('text-', 'bg-')}/30`}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.3, 0.8, 0.3],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>
      
      <div className="relative z-10 container mx-auto px-4 py-6 max-w-5xl">
        {/* Theme Banner / Artwork Header */}
        {theme.bgImage && (
          <div className="relative mb-6 rounded-2xl overflow-hidden h-36 md:h-48">
            <img src={theme.bgImage} alt={theme.name} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-black/60" />
            <div className="absolute bottom-4 left-6 right-6 flex items-end justify-between">
              <div>
                <h2 className={`text-2xl md:text-4xl font-extrabold ${theme.accentColor} drop-shadow-lg`}>{theme.name}</h2>
                <p className="text-gray-300 text-sm md:text-base drop-shadow">{theme.description}</p>
              </div>
              <div className={`px-4 py-1.5 rounded-full bg-black/50 border ${theme.borderColor} backdrop-blur-sm`}>
                <span className={`font-bold ${theme.accentColor} text-sm`}>🏆 JACKPOT: {formatNumber(theme.jackpot)}</span>
              </div>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="flex items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-4">
            <div>
              <h1 className={`text-2xl md:text-3xl font-bold ${theme.accentColor}`} data-testid="page-title">
                {theme.name}
              </h1>
              <p className="text-gray-400 text-sm">{theme.description}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="hover:bg-white/10"
            >
              {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowPayTable(!showPayTable)}
              className="hover:bg-white/10"
            >
              <Info className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Theme Selector */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide">
          {(Object.keys(SLOT_THEMES) as ThemeKey[]).map((key) => {
            const t = SLOT_THEMES[key];
            return (
              <Button
                key={key}
                variant="outline"
                size="sm"
                onClick={() => setSelectedTheme(key)}
                className={`
                  whitespace-nowrap transition-all
                  ${selectedTheme === key 
                    ? `${t.borderColor} ${t.accentColor} bg-white/10` 
                    : 'border-white/20 text-gray-400 hover:bg-white/5'
                  }
                `}
                data-testid={`theme-${key}`}
              >
                {t.symbols[0]} {t.name}
              </Button>
            );
          })}
        </div>

        {/* Demo Mode Banner */}
        {isDemo && (
          <div className="mb-4 bg-gradient-to-r from-purple-900/50 to-pink-900/50 border border-purple-500/30 rounded-xl p-3 text-center">
            <p className="text-purple-300 text-sm">
              <Sparkles className="w-4 h-4 inline mr-1" />
              <strong>Demo Mode</strong> - Playing with free demo coins! 
              <button onClick={() => setShowLoginModal(true)} className="underline ml-2 text-purple-200 hover:text-white">Sign up</button> to save your winnings.
            </p>
          </div>
        )}
        <SimpleLoginModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} />

        {/* Balance */}
        {currentBalance && (
          <div className="flex items-center justify-center gap-6 mb-6">
            <div 
              className={`flex items-center gap-3 px-4 py-2 rounded-xl cursor-pointer transition-all ${currencyType === 'GC' ? 'bg-yellow-500/20 ring-2 ring-yellow-400/50' : 'bg-black/30 hover:bg-black/40'}`}
              onClick={() => setCurrencyType("GC")}
            >
              <Coins className="w-6 h-6 text-yellow-400" />
              <div>
                <div className="text-xs text-yellow-400/80">Gold Coins {isDemo && "(Demo)"}</div>
                <div className="text-lg font-bold text-yellow-400">{formatNumber(currentBalance.goldCoins)}</div>
              </div>
            </div>
            <div 
              className={`flex items-center gap-3 px-4 py-2 rounded-xl cursor-pointer transition-all ${currencyType === 'SC' ? 'bg-green-500/20 ring-2 ring-green-400/50' : 'bg-black/30 hover:bg-black/40'}`}
              onClick={() => setCurrencyType("SC")}
            >
              <Sparkles className="w-6 h-6 text-green-400" />
              <div>
                <div className="text-xs text-green-400/80">Sweeps Coins {isDemo && "(Demo)"}</div>
                <div className="text-lg font-bold text-green-400">{parseFloat(currentBalance.sweepsCoins).toFixed(2)}</div>
              </div>
            </div>
          </div>
        )}

        {/* Slot Machine */}
        <div className="relative mb-6">
          {/* Machine Frame with premium metallic styling */}
          <motion.div
            className={`relative rounded-3xl p-1 ${isSpinning ? 'shadow-[0_0_40px_rgba(255,200,0,0.3)]' : 'shadow-2xl'}`}
            animate={isSpinning ? {
              boxShadow: [
                '0 0 20px rgba(255,200,0,0.2)',
                '0 0 50px rgba(255,200,0,0.4)',
                '0 0 20px rgba(255,200,0,0.2)',
              ],
            } : {}}
            transition={{ duration: 1, repeat: isSpinning ? Infinity : 0 }}
          >
            {/* Metallic gradient border */}
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-b from-yellow-400/40 via-amber-700/30 to-yellow-900/40 p-[3px]">
              <div className="w-full h-full rounded-3xl bg-gradient-to-b from-gray-800 to-gray-950" />
            </div>

            <div className="relative bg-gradient-to-b from-gray-800/95 to-gray-950/95 rounded-3xl p-5 md:p-8 border-2 border-yellow-600/30">
              {/* Corner Decorations */}
              <CornerDot position="top-left" />
              <CornerDot position="top-right" />
              <CornerDot position="bottom-left" />
              <CornerDot position="bottom-right" />

              {/* LED Border */}
              <LedBorder isSpinning={isSpinning} accentColor={theme.accentColor} />

              {/* Top decoration - Jackpot */}
              <div className="absolute -top-5 left-1/2 transform -translate-x-1/2 z-20">
                <div className={`px-6 py-2 rounded-full bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 border-2 border-yellow-500/50 flex items-center gap-2 shadow-lg shadow-yellow-500/20`}>
                  <Trophy className="w-5 h-5 text-yellow-400" />
                  <span className="font-bold text-yellow-400">JACKPOT: {formatNumber(theme.jackpot)}</span>
                </div>
              </div>

              {/* LUCKY SPIN Header */}
              <div className="flex justify-center mb-4 mt-2">
                <SparkleText>LUCKY SPIN</SparkleText>
              </div>
              
              {/* Reels Container */}
              <div className="bg-black/80 rounded-2xl p-4 md:p-6 mb-6 border border-yellow-600/20 shadow-inner relative">
                <div className="flex justify-center gap-3 md:gap-5">
                  {[0, 1, 2].map((reelIndex) => (
                    <div 
                      key={reelIndex}
                      className="relative w-24 h-28 md:w-32 md:h-40 bg-gradient-to-b from-gray-900 via-gray-950 to-black rounded-xl border-2 border-yellow-700/30 overflow-hidden shadow-[inset_0_2px_10px_rgba(0,0,0,0.8)]"
                    >
                      <motion.div 
                        animate={reelControls[reelIndex]}
                        className="absolute w-full"
                        style={{ bottom: 0 }}
                      >
                        {isSpinning ? (
                          reels[reelIndex].map((symbol, idx) => (
                            <div 
                              key={idx}
                              className="h-28 md:h-40 flex items-center justify-center text-5xl md:text-7xl"
                            >
                              {symbol}
                            </div>
                          ))
                        ) : (
                          <div className="h-28 md:h-40 flex items-center justify-center text-5xl md:text-7xl">
                            {visibleSymbols[reelIndex]}
                          </div>
                        )}
                      </motion.div>
                      
                      <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-transparent to-black/50 pointer-events-none" />
                      <div className="absolute inset-x-0 top-0 h-4 bg-gradient-to-b from-black/60 to-transparent pointer-events-none" />
                      <div className="absolute inset-x-0 bottom-0 h-4 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
                    </div>
                  ))}
                </div>
                
                {/* Win Line */}
                <div className="absolute left-4 right-4 top-1/2 transform -translate-y-1/2 h-0.5 bg-gradient-to-r from-transparent via-yellow-400 to-transparent opacity-50" />
                <div className="absolute left-4 right-4 top-1/2 transform -translate-y-1/2 h-px bg-gradient-to-r from-transparent via-yellow-300/80 to-transparent blur-sm" />
              </div>

              {/* Win Display */}
              <AnimatePresence>
                {lastWin !== null && lastWin > 0 && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.5 }}
                    className="absolute inset-0 flex items-center justify-center bg-black/70 rounded-3xl z-30 backdrop-blur-sm"
                  >
                    <CoinRain />
                    <motion.div
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ repeat: 3, duration: 0.3 }}
                      className="text-center z-30 relative"
                    >
                      <motion.div
                        initial={{ y: -20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        className="text-3xl md:text-5xl font-extrabold mb-3 bg-gradient-to-r from-yellow-200 via-yellow-400 to-amber-500 bg-clip-text text-transparent drop-shadow-[0_0_20px_rgba(255,200,0,0.5)]"
                      >
                        🎉 YOU WIN! 🎉
                      </motion.div>
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2, type: "spring" }}
                        className="text-5xl md:text-7xl font-black bg-gradient-to-r from-yellow-300 via-amber-400 to-orange-500 bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(255,150,0,0.6)]"
                      >
                        {formatNumber(lastWin)} {currencyType}
                      </motion.div>
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className="mt-2 text-yellow-300/80 text-lg"
                      >
                        ✨ Congratulations! ✨
                      </motion.div>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Controls */}
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                {/* Bet Controls */}
                <div className="flex items-center gap-4">
                  <span className="text-gray-400 text-sm font-semibold tracking-wider">BET:</span>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => adjustBet(-1)}
                      disabled={isSpinning || betAmount === BET_OPTIONS[0]}
                      className="w-8 h-8 border-white/20"
                    >
                      <Minus className="w-4 h-4" />
                    </Button>
                    <div className={`w-24 text-center text-xl font-bold ${theme.accentColor}`}>
                      {formatNumber(betAmount)}
                    </div>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => adjustBet(1)}
                      disabled={isSpinning || betAmount === BET_OPTIONS[BET_OPTIONS.length - 1]}
                      className="w-8 h-8 border-white/20"
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {/* Spin Button */}
                <Button
                  onClick={spin}
                  disabled={isSpinning || getBalance() < betAmount}
                  className={`
                    px-12 py-6 text-xl font-bold rounded-full shadow-lg transition-all
                    ${!isSpinning && getBalance() >= betAmount
                      ? 'bg-gradient-to-r from-yellow-400 via-amber-500 to-orange-500 hover:from-yellow-300 hover:via-amber-400 hover:to-orange-400 text-black hover:scale-105 shadow-yellow-500/30 hover:shadow-yellow-500/50'
                      : 'bg-gray-700 text-gray-400 cursor-not-allowed'
                    }
                  `}
                  data-testid="spin-button"
                >
                  {isSpinning ? (
                    <>
                      <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin mr-3" />
                      SPINNING...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-6 h-6 mr-3" />
                      SPIN
                    </>
                  )}
                </Button>

                {/* Max Bet */}
                <Button
                  variant="outline"
                  onClick={() => setBetAmount(BET_OPTIONS[BET_OPTIONS.length - 1])}
                  disabled={isSpinning}
                  className="border-white/20 hover:bg-white/10"
                >
                  MAX BET
                </Button>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Pay Table Modal */}
        <AnimatePresence>
          {showPayTable && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
              onClick={() => setShowPayTable(false)}
            >
              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                className={`bg-gradient-to-br ${theme.bgGradient} rounded-2xl p-6 border ${theme.borderColor} max-w-md w-full max-h-[80vh] overflow-y-auto`}
                onClick={e => e.stopPropagation()}
              >
                <h3 className={`text-2xl font-bold ${theme.accentColor} mb-4 flex items-center gap-2`}>
                  <Info className="w-6 h-6" />
                  Pay Table
                </h3>
                
                <div className="space-y-2">
                  {Object.entries(theme.payTable).map(([combo, multiplier]) => (
                    <div key={combo} className="flex items-center justify-between bg-black/30 rounded-lg px-4 py-2">
                      <span className="text-2xl">{combo}</span>
                      <span className={`font-bold ${theme.accentColor}`}>{multiplier}x</span>
                    </div>
                  ))}
                </div>
                
                <div className="mt-4 pt-4 border-t border-white/10 text-center text-sm text-gray-400">
                  Match 3 symbols to win! Higher value symbols = bigger wins.
                </div>
                
                <Button
                  onClick={() => setShowPayTable(false)}
                  className="w-full mt-4 bg-white/10 hover:bg-white/20"
                >
                  Close
                </Button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Quick Links */}
        <div className="flex justify-center gap-4 text-sm text-gray-400">
          <a href="/coin-store" className="hover:text-white transition-colors">Get Chips</a>
          <span>•</span>
          <a href="/daily-bonus" className="hover:text-white transition-colors">Daily Bonus</a>
          <span>•</span>
          <a href="/sweepstakes-rules" className="hover:text-white transition-colors">Rules</a>
        </div>
      </div>
    </div>
  );
}
