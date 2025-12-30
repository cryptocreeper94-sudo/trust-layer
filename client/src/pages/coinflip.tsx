import { useState, useEffect } from "react";
import { motion, AnimatePresence, useAnimation } from "framer-motion";
import { Coins, Sparkles, Crown, Star, Flame, Zap, Volume2, VolumeX, History, TrendingUp, Users, Clock, Shield, ChevronRight, RefreshCw } from "lucide-react";
import { BackButton } from "@/components/page-nav";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import { apiRequest } from "@/lib/queryClient";

interface SweepsBalance {
  goldCoins: string;
  sweepsCoins: string;
}

interface GameResult {
  id: string;
  choice: "heads" | "tails";
  result: "heads" | "tails";
  won: boolean;
  amount: number;
  payout: number;
}

const BET_OPTIONS = [10, 25, 50, 100, 250, 500, 1000, 2500, 5000];

const RECENT_RESULTS_COUNT = 20;

const DEMO_BALANCE = { goldCoins: "10000", sweepsCoins: "100" };

export default function Coinflip() {
  const { user, isLoading: authLoading } = useAuth();
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [currencyType, setCurrencyType] = useState<"GC" | "SC">("GC");
  const [betAmount, setBetAmount] = useState(100);
  const [choice, setChoice] = useState<"heads" | "tails">("heads");
  const [isFlipping, setIsFlipping] = useState(false);
  const [lastResult, setLastResult] = useState<GameResult | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [recentResults, setRecentResults] = useState<("heads" | "tails")[]>([]);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [coinRotation, setCoinRotation] = useState(0);
  const [currentSide, setCurrentSide] = useState<"heads" | "tails">("heads");
  const [demoBalance, setDemoBalance] = useState(DEMO_BALANCE);
  const isDemo = !user;
  
  const coinControls = useAnimation();

  const { data: balance, refetch: refetchBalance } = useQuery<SweepsBalance>({
    queryKey: ["/api/sweeps/balance"],
    enabled: !!user,
  });

  const currentBalance = isDemo ? demoBalance : balance;

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

  const getBalance = () => {
    if (!currentBalance) return 0;
    return parseFloat(currencyType === "GC" ? currentBalance.goldCoins : currentBalance.sweepsCoins);
  };

  const flipCoin = async () => {
    if (isFlipping) return;
    
    const bal = getBalance();
    if (bal < betAmount) {
      toast({
        title: "Insufficient Balance",
        description: `You need at least ${formatNumber(betAmount)} ${currencyType} to play`,
        variant: "destructive",
      });
      return;
    }

    setIsFlipping(true);
    setShowResult(false);
    setLastResult(null);

    // Determine result (fair 50/50)
    const result: "heads" | "tails" = Math.random() < 0.5 ? "heads" : "tails";
    const won = result === choice;
    const multiplier = won ? 1.96 : 0; // ~2x minus house edge
    const payout = won ? betAmount * multiplier : 0;
    const profit = payout - betAmount;

    // Animate coin flip
    const flips = 5 + Math.floor(Math.random() * 3); // 5-7 flips
    const finalRotation = flips * 360 + (result === "tails" ? 180 : 0);
    
    await coinControls.start({
      rotateY: finalRotation,
      transition: {
        duration: 2.5,
        ease: [0.2, 0.8, 0.2, 1],
      },
    });

    setCurrentSide(result);

    // Update balance (demo mode uses local state, logged in uses API)
    if (isDemo) {
      setDemoBalance(prev => {
        const key = currencyType === "GC" ? "goldCoins" : "sweepsCoins";
        const newVal = parseFloat(prev[key]) + profit;
        return { ...prev, [key]: String(Math.max(0, newVal)) };
      });
    } else {
      await gameMutation.mutateAsync({
        gameType: "coinflip",
        currencyType,
        betAmount,
        multiplier,
        payout,
        profit,
        outcome: won ? "win" : "loss",
      });
    }

    // Update recent results
    setRecentResults(prev => [result, ...prev.slice(0, RECENT_RESULTS_COUNT - 1)]);

    const gameResult: GameResult = {
      id: Date.now().toString(),
      choice,
      result,
      won,
      amount: betAmount,
      payout,
    };
    setLastResult(gameResult);
    setShowResult(true);
    setIsFlipping(false);

    if (won) {
      toast({
        title: "You Won!",
        description: `+${formatNumber(payout)} ${currencyType}`,
      });
    }
  };

  const quickBet = (amount: number) => {
    setBetAmount(amount);
  };

  const doubleBet = () => {
    const maxBet = BET_OPTIONS[BET_OPTIONS.length - 1];
    setBetAmount(Math.min(betAmount * 2, maxBet, getBalance()));
  };

  const halfBet = () => {
    const minBet = BET_OPTIONS[0];
    setBetAmount(Math.max(Math.floor(betAmount / 2), minBet));
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0a0a0f] via-[#12121a] to-[#0a0a0f]">
        <div className="animate-pulse text-purple-400">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a0f] via-[#12121a] to-[#0a0a0f] text-white overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-yellow-900/10 via-transparent to-transparent pointer-events-none" />
      
      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-yellow-400/40 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -50, 0],
              opacity: [0.2, 0.8, 0.2],
            }}
            transition={{
              duration: 4 + Math.random() * 3,
              repeat: Infinity,
              delay: Math.random() * 3,
            }}
          />
        ))}
      </div>
      
      <div className="relative z-10 container mx-auto px-4 py-6 max-w-4xl">
        {/* Header */}
        <div className="flex items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-4">
            <BackButton />
            <div>
              <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-yellow-200 via-yellow-400 to-yellow-200 bg-clip-text text-transparent flex items-center gap-2" data-testid="page-title">
                <Coins className="w-8 h-8 text-yellow-400" />
                Coin Flip
              </h1>
              <p className="text-gray-400 text-sm">Double or nothing! Pick heads or tails.</p>
            </div>
          </div>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="hover:bg-white/10"
          >
            {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
          </Button>
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
          <div className="flex items-center justify-center gap-4 mb-6">
            <div 
              className={`flex items-center gap-3 px-4 py-2 rounded-xl cursor-pointer transition-all ${currencyType === 'GC' ? 'bg-yellow-500/20 ring-2 ring-yellow-400/50' : 'bg-black/30 hover:bg-black/40'}`}
              onClick={() => setCurrencyType("GC")}
            >
              <Coins className="w-5 h-5 text-yellow-400" />
              <div>
                <div className="text-xs text-yellow-400/80">Gold Coins {isDemo && "(Demo)"}</div>
                <div className="text-lg font-bold text-yellow-400">{formatNumber(currentBalance.goldCoins)}</div>
              </div>
            </div>
            <div 
              className={`flex items-center gap-3 px-4 py-2 rounded-xl cursor-pointer transition-all ${currencyType === 'SC' ? 'bg-green-500/20 ring-2 ring-green-400/50' : 'bg-black/30 hover:bg-black/40'}`}
              onClick={() => setCurrencyType("SC")}
            >
              <Sparkles className="w-5 h-5 text-green-400" />
              <div>
                <div className="text-xs text-green-400/80">Sweeps Coins {isDemo && "(Demo)"}</div>
                <div className="text-lg font-bold text-green-400">{parseFloat(currentBalance.sweepsCoins).toFixed(2)}</div>
              </div>
            </div>
          </div>
        )}

        {/* Coin Animation Area */}
        <div className="relative flex flex-col items-center mb-8">
          {/* Coin Container */}
          <div className="relative w-48 h-48 md:w-64 md:h-64 mb-6" style={{ perspective: 1000 }}>
            {/* Glow effect */}
            <motion.div 
              className="absolute inset-[-20%] rounded-full bg-gradient-to-r from-yellow-400/20 via-amber-500/20 to-yellow-400/20 blur-2xl"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.5, 0.8, 0.5],
              }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            
            {/* The Coin */}
            <motion.div
              animate={coinControls}
              className="absolute inset-0"
              style={{
                transformStyle: "preserve-3d",
              }}
            >
              {/* Heads side */}
              <div 
                className="absolute inset-0 rounded-full flex items-center justify-center border-8 border-yellow-500/50 shadow-2xl"
                style={{
                  background: "linear-gradient(145deg, #fcd34d, #b45309)",
                  backfaceVisibility: "hidden",
                }}
              >
                <div className="text-center">
                  <Crown className="w-16 h-16 md:w-24 md:h-24 text-yellow-900 mx-auto mb-2" />
                  <span className="text-lg md:text-xl font-bold text-yellow-900">HEADS</span>
                </div>
                {/* Embossed effect */}
                <div className="absolute inset-4 rounded-full border-4 border-yellow-600/50 pointer-events-none" />
              </div>
              
              {/* Tails side */}
              <div 
                className="absolute inset-0 rounded-full flex items-center justify-center border-8 border-yellow-500/50 shadow-2xl"
                style={{
                  background: "linear-gradient(145deg, #fcd34d, #b45309)",
                  backfaceVisibility: "hidden",
                  transform: "rotateY(180deg)",
                }}
              >
                <div className="text-center">
                  <Star className="w-16 h-16 md:w-24 md:h-24 text-yellow-900 mx-auto mb-2" />
                  <span className="text-lg md:text-xl font-bold text-yellow-900">TAILS</span>
                </div>
                {/* Embossed effect */}
                <div className="absolute inset-4 rounded-full border-4 border-yellow-600/50 pointer-events-none" />
              </div>
            </motion.div>
          </div>

          {/* Choice Buttons */}
          <div className="flex gap-4 mb-6">
            <Button
              onClick={() => setChoice("heads")}
              disabled={isFlipping}
              className={`
                px-8 py-6 text-lg font-bold rounded-xl transition-all
                ${choice === "heads" 
                  ? 'bg-gradient-to-r from-yellow-400 to-amber-500 text-black scale-105 ring-2 ring-yellow-300' 
                  : 'bg-white/10 hover:bg-white/20 text-white'}
              `}
              data-testid="choice-heads"
            >
              <Crown className="w-6 h-6 mr-2" />
              HEADS
            </Button>
            <Button
              onClick={() => setChoice("tails")}
              disabled={isFlipping}
              className={`
                px-8 py-6 text-lg font-bold rounded-xl transition-all
                ${choice === "tails" 
                  ? 'bg-gradient-to-r from-yellow-400 to-amber-500 text-black scale-105 ring-2 ring-yellow-300' 
                  : 'bg-white/10 hover:bg-white/20 text-white'}
              `}
              data-testid="choice-tails"
            >
              <Star className="w-6 h-6 mr-2" />
              TAILS
            </Button>
          </div>

          {/* Bet Controls */}
          <Card className="bg-black/40 border-white/10 backdrop-blur-xl w-full max-w-md mb-6">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-gray-400">Bet Amount</span>
                <Badge variant="outline" className="bg-purple-500/20 border-purple-500/50 text-purple-300">
                  1.96x Payout
                </Badge>
              </div>
              
              <div className="flex items-center gap-2 mb-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={halfBet}
                  disabled={isFlipping}
                  className="border-white/20"
                >
                  ½
                </Button>
                <div className="flex-1 text-center">
                  <div className="text-2xl font-bold text-yellow-400">
                    {formatNumber(betAmount)} {currencyType}
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={doubleBet}
                  disabled={isFlipping}
                  className="border-white/20"
                >
                  2x
                </Button>
              </div>
              
              <div className="flex flex-wrap gap-2 justify-center">
                {BET_OPTIONS.slice(0, 5).map((amount) => (
                  <Button
                    key={amount}
                    variant="outline"
                    size="sm"
                    onClick={() => quickBet(amount)}
                    disabled={isFlipping}
                    className={`
                      border-white/20 
                      ${betAmount === amount ? 'bg-white/20 text-yellow-400' : 'hover:bg-white/10'}
                    `}
                  >
                    {amount}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Flip Button */}
          <Button
            onClick={flipCoin}
            disabled={isFlipping || getBalance() < betAmount}
            className={`
              px-16 py-8 text-2xl font-bold rounded-full shadow-lg transition-all
              ${!isFlipping && getBalance() >= betAmount
                ? 'bg-gradient-to-r from-yellow-400 via-amber-500 to-orange-500 hover:from-yellow-300 hover:via-amber-400 hover:to-orange-400 text-black hover:scale-105'
                : 'bg-gray-700 text-gray-400 cursor-not-allowed'
              }
            `}
            data-testid="flip-button"
          >
            {isFlipping ? (
              <>
                <RefreshCw className="w-8 h-8 mr-3 animate-spin" />
                FLIPPING...
              </>
            ) : (
              <>
                <Coins className="w-8 h-8 mr-3" />
                FLIP COIN
              </>
            )}
          </Button>
        </div>

        {/* Result Popup */}
        <AnimatePresence>
          {showResult && lastResult && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
              onClick={() => setShowResult(false)}
            >
              <motion.div
                initial={{ y: 50 }}
                animate={{ y: 0 }}
                className={`
                  rounded-3xl p-8 text-center max-w-sm w-full border
                  ${lastResult.won 
                    ? 'bg-gradient-to-br from-green-900/90 to-emerald-900/90 border-green-500/50' 
                    : 'bg-gradient-to-br from-red-900/90 to-rose-900/90 border-red-500/50'}
                `}
                onClick={e => e.stopPropagation()}
              >
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ repeat: 2, duration: 0.3 }}
                  className={`
                    w-24 h-24 mx-auto mb-6 rounded-full flex items-center justify-center
                    ${lastResult.won ? 'bg-green-500' : 'bg-red-500'}
                  `}
                >
                  {lastResult.result === "heads" ? (
                    <Crown className="w-12 h-12 text-white" />
                  ) : (
                    <Star className="w-12 h-12 text-white" />
                  )}
                </motion.div>
                
                <h2 className={`text-3xl font-bold mb-2 ${lastResult.won ? 'text-green-400' : 'text-red-400'}`}>
                  {lastResult.won ? "YOU WIN!" : "YOU LOSE"}
                </h2>
                
                <p className="text-gray-300 mb-4">
                  It landed on <span className="font-bold capitalize">{lastResult.result}</span>!
                </p>
                
                {lastResult.won ? (
                  <div className="text-4xl font-bold text-green-400 mb-6">
                    +{formatNumber(lastResult.payout)} {currencyType}
                  </div>
                ) : (
                  <div className="text-2xl font-bold text-red-400 mb-6">
                    -{formatNumber(lastResult.amount)} {currencyType}
                  </div>
                )}
                
                <Button
                  onClick={() => setShowResult(false)}
                  className={`
                    w-full py-6 text-lg font-bold
                    ${lastResult.won 
                      ? 'bg-green-500 hover:bg-green-400' 
                      : 'bg-red-500 hover:bg-red-400'}
                  `}
                >
                  {lastResult.won ? "Collect Winnings" : "Try Again"}
                </Button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Recent Results */}
        <Card className="bg-black/40 border-white/10 backdrop-blur-xl">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <History className="w-5 h-5 text-gray-400" />
              <span className="text-gray-400 font-medium">Recent Results</span>
            </div>
            
            <div className="flex gap-2 flex-wrap">
              {recentResults.length > 0 ? (
                recentResults.map((result, index) => (
                  <motion.div
                    key={index}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className={`
                      w-8 h-8 rounded-full flex items-center justify-center
                      ${result === "heads" 
                        ? 'bg-yellow-500/20 border border-yellow-500/50' 
                        : 'bg-purple-500/20 border border-purple-500/50'}
                    `}
                  >
                    {result === "heads" ? (
                      <Crown className="w-4 h-4 text-yellow-400" />
                    ) : (
                      <Star className="w-4 h-4 text-purple-400" />
                    )}
                  </motion.div>
                ))
              ) : (
                <span className="text-gray-500 text-sm">No flips yet. Be the first!</span>
              )}
            </div>
            
            {recentResults.length > 0 && (
              <div className="flex gap-4 mt-4 pt-4 border-t border-white/10 text-sm text-gray-400">
                <div className="flex items-center gap-1">
                  <Crown className="w-4 h-4 text-yellow-400" />
                  <span>Heads: {recentResults.filter(r => r === "heads").length}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-purple-400" />
                  <span>Tails: {recentResults.filter(r => r === "tails").length}</span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Game Info */}
        <div className="mt-6 text-center text-xs text-gray-500">
          <p>House edge: 2% • Win probability: 50% • Payout: 1.96x</p>
        </div>
      </div>
    </div>
  );
}
