import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useAnimation } from "framer-motion";
import { Coins, Sparkles, Crown, Star, Flame, Zap, Diamond, Cherry, CircleDollarSign, Gem, Trophy, Volume2, VolumeX, Info, Minus, Plus } from "lucide-react";
import { BackButton } from "@/components/page-nav";
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
  },
};

type ThemeKey = keyof typeof SLOT_THEMES;

const BET_OPTIONS = [10, 25, 50, 100, 250, 500, 1000];

const DEMO_BALANCE = { goldCoins: "10000", sweepsCoins: "100" };

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

    // Generate reels
    const newReels = [generateReelSymbols(), generateReelSymbols(), generateReelSymbols()];
    setReels(newReels);

    // Determine outcome
    const finalSymbols = [
      newReels[0][newReels[0].length - 1],
      newReels[1][newReels[1].length - 1],
      newReels[2][newReels[2].length - 1],
    ];

    // Animate reels with staggered timing
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

    // Calculate win
    const matchKey = finalSymbols.join("") as keyof typeof theme.payTable;
    const multiplier = theme.payTable[matchKey] || 0;
    const payout = betAmount * multiplier;
    const profit = payout - betAmount;

    // Update balance (demo mode uses local state, logged in uses API)
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
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white/5 via-transparent to-transparent pointer-events-none" />
      
      {/* Floating particles */}
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
        {/* Header */}
        <div className="flex items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-4">
            <BackButton />
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
              <a href="/api/login" className="underline ml-2 text-purple-200 hover:text-white">Sign up</a> to save your winnings.
            </p>
          </div>
        )}

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
          {/* Machine Frame */}
          <div className={`relative bg-gradient-to-b from-gray-800 to-gray-900 rounded-3xl p-6 border-4 ${theme.borderColor} shadow-2xl`}>
            {/* Top decoration */}
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
              <div className={`px-6 py-2 rounded-full bg-gradient-to-r ${theme.bgGradient} border-2 ${theme.borderColor} flex items-center gap-2`}>
                <Trophy className={`w-5 h-5 ${theme.accentColor}`} />
                <span className={`font-bold ${theme.accentColor}`}>JACKPOT: {formatNumber(theme.jackpot)}</span>
              </div>
            </div>
            
            {/* Reels Container */}
            <div className="bg-black/80 rounded-2xl p-4 mb-6 border border-white/10">
              <div className="flex justify-center gap-2 md:gap-4">
                {[0, 1, 2].map((reelIndex) => (
                  <div 
                    key={reelIndex}
                    className="relative w-20 h-24 md:w-28 md:h-32 bg-gradient-to-b from-gray-900 to-black rounded-xl border border-white/20 overflow-hidden"
                  >
                    {/* Reel */}
                    <motion.div 
                      animate={reelControls[reelIndex]}
                      className="absolute w-full"
                      style={{ bottom: 0 }}
                    >
                      {isSpinning ? (
                        reels[reelIndex].map((symbol, idx) => (
                          <div 
                            key={idx}
                            className="h-24 md:h-32 flex items-center justify-center text-4xl md:text-6xl"
                          >
                            {symbol}
                          </div>
                        ))
                      ) : (
                        <div className="h-24 md:h-32 flex items-center justify-center text-4xl md:text-6xl">
                          {visibleSymbols[reelIndex]}
                        </div>
                      )}
                    </motion.div>
                    
                    {/* Shine effect */}
                    <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-transparent to-black/50 pointer-events-none" />
                  </div>
                ))}
              </div>
              
              {/* Win Line */}
              <div className="absolute left-0 right-0 top-1/2 transform -translate-y-1/2 h-0.5 bg-gradient-to-r from-transparent via-yellow-400 to-transparent opacity-50" />
            </div>

            {/* Win Display */}
            <AnimatePresence>
              {lastWin !== null && lastWin > 0 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.5 }}
                  className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-3xl z-10"
                >
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ repeat: 3, duration: 0.3 }}
                    className="text-center"
                  >
                    <div className="text-2xl md:text-4xl font-bold text-yellow-400 mb-2">YOU WIN!</div>
                    <div className={`text-4xl md:text-6xl font-bold ${theme.accentColor}`}>
                      {formatNumber(lastWin)} {currencyType}
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Controls */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              {/* Bet Controls */}
              <div className="flex items-center gap-4">
                <span className="text-gray-400 text-sm">BET:</span>
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
                    ? 'bg-gradient-to-r from-yellow-400 via-amber-500 to-orange-500 hover:from-yellow-300 hover:via-amber-400 hover:to-orange-400 text-black hover:scale-105'
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
          <a href="/coin-store" className="hover:text-white transition-colors">Buy Coins</a>
          <span>•</span>
          <a href="/daily-bonus" className="hover:text-white transition-colors">Daily Bonus</a>
          <span>•</span>
          <a href="/sweepstakes-rules" className="hover:text-white transition-colors">Rules</a>
        </div>
      </div>
    </div>
  );
}
