import { useState, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence, useAnimation } from "framer-motion";
import { Coins, Sparkles, Crown, Star, Flame, Zap, Volume2, VolumeX, History, TrendingUp, Users, Clock, Shield, ChevronRight, RefreshCw } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import { apiRequest } from "@/lib/queryClient";
import { SimpleLoginModal } from "@/components/simple-login";
import coinflipBg from "@assets/generated_images/game_coinflip_premium.png";

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

function WinParticles({ active }: { active: boolean }) {
  if (!active) return null;
  const particles = useMemo(() => 
    [...Array(40)].map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      delay: Math.random() * 0.5,
      duration: 1.5 + Math.random() * 2,
      size: 4 + Math.random() * 8,
      color: ['#fbbf24', '#f59e0b', '#10b981', '#34d399', '#fcd34d', '#fff'][Math.floor(Math.random() * 6)],
      angle: Math.random() * 360,
    })), []);

  return (
    <div className="fixed inset-0 pointer-events-none z-[60]">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: `${p.x}%`,
            top: '50%',
            width: p.size,
            height: p.size,
            backgroundColor: p.color,
            boxShadow: `0 0 ${p.size * 2}px ${p.color}`,
          }}
          initial={{ opacity: 1, y: 0, x: 0, scale: 1 }}
          animate={{
            opacity: [1, 1, 0],
            y: [0, -200 - Math.random() * 400],
            x: [0, (Math.random() - 0.5) * 300],
            scale: [1, 0.5],
            rotate: [0, p.angle],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            ease: "easeOut",
          }}
        />
      ))}
    </div>
  );
}

function StreakIndicator({ results }: { results: ("heads" | "tails")[] }) {
  if (results.length === 0) return null;

  let streak = 1;
  let streakType: "win" | "loss" | null = null;
  const lastResult = results[0];
  for (let i = 1; i < results.length; i++) {
    if (results[i] === lastResult) streak++;
    else break;
  }

  const isHotStreak = streak >= 3;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`
        flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold
        ${isHotStreak 
          ? 'bg-gradient-to-r from-orange-500/30 to-red-500/30 border border-orange-400/50 text-orange-300' 
          : 'bg-white/5 border border-white/10 text-gray-400'}
      `}
    >
      {isHotStreak && (
        <motion.div
          animate={{ scale: [1, 1.3, 1] }}
          transition={{ duration: 0.5, repeat: Infinity }}
        >
          <Flame className="w-4 h-4 text-orange-400" />
        </motion.div>
      )}
      <span>
        {streak}x {lastResult === "heads" ? "Heads" : "Tails"} Streak
      </span>
      {isHotStreak && (
        <>
          {[...Array(Math.min(streak - 2, 5))].map((_, i) => (
            <Flame key={i} className="w-3 h-3 text-orange-400" />
          ))}
        </>
      )}
    </motion.div>
  );
}


const GlowOrb = ({ color, size, top, left, delay = 0 }: { color: string; size: number; top: string; left: string; delay?: number }) => (
  <motion.div
    className="absolute rounded-full blur-3xl opacity-20 pointer-events-none"
    style={{ background: color, width: size, height: size, top, left }}
    animate={{ scale: [1, 1.2, 1], opacity: [0.15, 0.25, 0.15] }}
    transition={{ duration: 8, repeat: Infinity, delay }}
  />
);

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
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showWinParticles, setShowWinParticles] = useState(false);
  const [coinHovered, setCoinHovered] = useState(false);
  const isDemo = !user;
  
  const coinControls = useAnimation();

  const { data: balance, refetch: refetchBalance } = useQuery<SweepsBalance>({
    queryKey: ["/api/sweeps/balance"],
    enabled: !!user,
  });

  const currentBalance = isDemo ? demoBalance : balance;

  const gameMutation = useMutation({
    mutationFn: async (data: { gameType: string; currencyType: string; betAmount: number; choice: string }) => {
      const res = await apiRequest("POST", "/api/sweeps/play", data);
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
    setShowWinParticles(false);

    let result: "heads" | "tails";
    let won: boolean;
    let payout: number;

    if (isDemo) {
      result = Math.random() < 0.5 ? "heads" : "tails";
      won = result === choice;
      const multiplier = won ? 1.96 : 0;
      payout = won ? betAmount * multiplier : 0;
      const profit = payout - betAmount;

      const flips = 5 + Math.floor(Math.random() * 3);
      const finalRotation = flips * 360 + (result === "tails" ? 180 : 0);

      await coinControls.start({
        rotateY: finalRotation,
        transition: {
          duration: 2.5,
          ease: [0.2, 0.8, 0.2, 1],
        },
      });

      setCurrentSide(result);

      setDemoBalance(prev => {
        const key = currencyType === "GC" ? "goldCoins" : "sweepsCoins";
        const newVal = parseFloat(prev[key]) + profit;
        return { ...prev, [key]: String(Math.max(0, newVal)) };
      });
    } else {
      const response = await gameMutation.mutateAsync({
        gameType: "coinflip",
        currencyType,
        betAmount,
        choice,
      });

      result = response.gameResult.result;
      won = response.gameResult.won;
      payout = won ? betAmount * 1.96 : 0;

      const flips = 5 + Math.floor(Math.random() * 3);
      const finalRotation = flips * 360 + (result === "tails" ? 180 : 0);

      await coinControls.start({
        rotateY: finalRotation,
        transition: {
          duration: 2.5,
          ease: [0.2, 0.8, 0.2, 1],
        },
      });

      setCurrentSide(result);
    }

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
      setShowWinParticles(true);
      setTimeout(() => setShowWinParticles(false), 3000);
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
      <div className="min-h-screen relative overflow-hidden pt-20 pb-12" style={{ background: "linear-gradient(180deg, #070b16, #0c1222, #070b16)" }}>
      <GlowOrb color="linear-gradient(135deg, #06b6d4, #3b82f6)" size={500} top="-5%" left="60%" />
      <GlowOrb color="linear-gradient(135deg, #8b5cf6, #ec4899)" size={400} top="40%" left="-10%" delay={3} />
        <div className="animate-pulse text-purple-400">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a0f] via-[#12121a] to-[#0a0a0f] text-white overflow-hidden relative">
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-[0.06] pointer-events-none"
        style={{ backgroundImage: `url(${coinflipBg})` }}
      />

      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-yellow-900/10 via-transparent to-transparent pointer-events-none" />
      
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: 2 + Math.random() * 3,
              height: 2 + Math.random() * 3,
              background: i % 3 === 0 ? '#fbbf24' : i % 3 === 1 ? '#a855f7' : '#f59e0b',
              boxShadow: `0 0 ${4 + Math.random() * 6}px currentColor`,
            }}
            animate={{
              y: [0, -60, 0],
              opacity: [0.1, 0.7, 0.1],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 4 + Math.random() * 4,
              repeat: Infinity,
              delay: Math.random() * 5,
            }}
          />
        ))}
      </div>

      <WinParticles active={showWinParticles} />
      
      <div className="relative z-10 container mx-auto px-4 py-6 max-w-4xl">
        <div className="flex items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-4">
            <div>
              <h1 className="text-2xl md:text-4xl font-black flex items-center gap-3" data-testid="page-title">
                <motion.div
                  animate={{ rotate: [0, -10, 10, 0] }}
                  transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}
                >
                  <Crown className="w-9 h-9 md:w-11 md:h-11" style={{ 
                    filter: 'drop-shadow(0 0 8px rgba(251,191,36,0.6))',
                    color: '#fbbf24',
                  }} />
                </motion.div>
                <span className="bg-gradient-to-r from-yellow-200 via-yellow-400 to-amber-500 bg-clip-text text-transparent drop-shadow-lg">
                  Royal Coin Flip
                </span>
              </h1>
              <p className="text-gray-400 text-sm mt-1">Double or nothing! Pick heads or tails.</p>
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

        <StreakIndicator results={recentResults} />

        <div className="relative flex flex-col items-center mb-8 mt-4">
          <div 
            className="relative w-full max-w-2xl mx-auto rounded-3xl p-8 md:p-12 mb-6"
            style={{
              background: 'radial-gradient(ellipse at center, #1a0f2e 0%, #0d1117 60%, #0a0a0f 100%)',
              border: '2px solid',
              borderImage: 'linear-gradient(135deg, #b8860b, #daa520, #b8860b, #8b6914) 1',
              boxShadow: 'inset 0 0 60px rgba(138,43,226,0.08), 0 0 30px rgba(184,134,11,0.15), inset 0 2px 0 rgba(218,165,32,0.1)',
            }}
          >
            <div className="absolute inset-[3px] rounded-3xl pointer-events-none" style={{
              border: '1px solid rgba(218,165,32,0.15)',
            }} />
            
            <div className="flex flex-col items-center">
              <div 
                className="relative w-56 h-56 md:w-80 md:h-80 mb-6" 
                style={{ perspective: 1200 }}
                onMouseEnter={() => setCoinHovered(true)}
                onMouseLeave={() => setCoinHovered(false)}
              >
                <motion.div 
                  className="absolute inset-[-30%] rounded-full blur-3xl"
                  style={{
                    background: 'radial-gradient(circle, rgba(251,191,36,0.25) 0%, rgba(245,158,11,0.1) 40%, transparent 70%)',
                  }}
                  animate={{
                    scale: [1, 1.3, 1],
                    opacity: [0.4, 0.8, 0.4],
                  }}
                  transition={{ duration: 3, repeat: Infinity }}
                />
                
                <motion.div
                  animate={coinControls}
                  className="absolute inset-0"
                  style={{
                    transformStyle: "preserve-3d",
                    ...(coinHovered && !isFlipping ? { transform: 'rotateX(8deg) rotateZ(-3deg)' } : {}),
                    transition: 'transform 0.3s ease',
                  }}
                >
                  <div 
                    className="absolute inset-0 rounded-full flex items-center justify-center shadow-2xl"
                    style={{
                      background: "linear-gradient(145deg, #fef3c7, #fcd34d 20%, #f59e0b 40%, #d97706 60%, #b45309 80%, #92400e)",
                      backfaceVisibility: "hidden",
                      boxShadow: '0 8px 32px rgba(180,83,9,0.5), inset 0 2px 4px rgba(255,255,255,0.4), inset 0 -4px 8px rgba(146,64,14,0.6)',
                    }}
                  >
                    <div className="absolute inset-0 rounded-full" style={{
                      border: '6px solid',
                      borderColor: '#b45309',
                      boxShadow: 'inset 0 0 0 3px rgba(253,224,71,0.5), inset 0 0 0 8px rgba(180,83,9,0.3)',
                    }} />

                    <div className="absolute inset-[12px] rounded-full border-2 border-yellow-600/40 pointer-events-none" />
                    <div className="absolute inset-[18px] rounded-full border border-yellow-500/20 pointer-events-none" />

                    {!isFlipping && (
                      <motion.div
                        className="absolute inset-0 rounded-full pointer-events-none overflow-hidden"
                        style={{ backfaceVisibility: "hidden" }}
                      >
                        <motion.div
                          className="absolute inset-0"
                          style={{
                            background: 'linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.3) 45%, rgba(255,255,255,0.05) 55%, transparent 70%)',
                          }}
                          animate={{
                            x: ['-100%', '200%'],
                          }}
                          transition={{
                            duration: 3,
                            repeat: Infinity,
                            repeatDelay: 4,
                            ease: 'easeInOut',
                          }}
                        />
                      </motion.div>
                    )}

                    <div className="text-center relative z-10">
                      <Crown className="w-20 h-20 md:w-28 md:h-28 text-yellow-900 mx-auto mb-1" style={{
                        filter: 'drop-shadow(0 2px 4px rgba(146,64,14,0.5))',
                      }} />
                      <span className="text-lg md:text-2xl font-black text-yellow-900 tracking-wider" style={{
                        textShadow: '0 1px 0 rgba(253,224,71,0.5)',
                      }}>HEADS</span>
                    </div>
                  </div>
                  
                  <div 
                    className="absolute inset-0 rounded-full flex items-center justify-center shadow-2xl"
                    style={{
                      background: "linear-gradient(145deg, #fef3c7, #fcd34d 20%, #f59e0b 40%, #d97706 60%, #b45309 80%, #92400e)",
                      backfaceVisibility: "hidden",
                      transform: "rotateY(180deg)",
                      boxShadow: '0 8px 32px rgba(180,83,9,0.5), inset 0 2px 4px rgba(255,255,255,0.4), inset 0 -4px 8px rgba(146,64,14,0.6)',
                    }}
                  >
                    <div className="absolute inset-0 rounded-full" style={{
                      border: '6px solid',
                      borderColor: '#b45309',
                      boxShadow: 'inset 0 0 0 3px rgba(253,224,71,0.5), inset 0 0 0 8px rgba(180,83,9,0.3)',
                    }} />

                    <div className="absolute inset-[12px] rounded-full border-2 border-yellow-600/40 pointer-events-none" />
                    <div className="absolute inset-[18px] rounded-full border border-yellow-500/20 pointer-events-none" />

                    <div className="text-center relative z-10">
                      <Star className="w-20 h-20 md:w-28 md:h-28 text-yellow-900 mx-auto mb-1" style={{
                        filter: 'drop-shadow(0 2px 4px rgba(146,64,14,0.5))',
                      }} />
                      <span className="text-lg md:text-2xl font-black text-yellow-900 tracking-wider" style={{
                        textShadow: '0 1px 0 rgba(253,224,71,0.5)',
                      }}>TAILS</span>
                    </div>
                  </div>
                </motion.div>
              </div>

              <div className="flex gap-4 mb-6">
                <Button
                  onClick={() => setChoice("heads")}
                  disabled={isFlipping}
                  className={`
                    px-8 py-6 text-lg font-bold rounded-xl transition-all
                    ${choice === "heads" 
                      ? 'bg-gradient-to-r from-yellow-400 to-amber-500 text-black scale-105 ring-2 ring-yellow-300 shadow-lg shadow-yellow-500/30' 
                      : 'bg-white/10 hover:bg-white/20 text-white border border-white/10'}
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
                      ? 'bg-gradient-to-r from-yellow-400 to-amber-500 text-black scale-105 ring-2 ring-yellow-300 shadow-lg shadow-yellow-500/30' 
                      : 'bg-white/10 hover:bg-white/20 text-white border border-white/10'}
                  `}
                  data-testid="choice-tails"
                >
                  <Star className="w-6 h-6 mr-2" />
                  TAILS
                </Button>
              </div>
            </div>
          </div>

          <div 
            className="w-full max-w-md mb-6 rounded-2xl overflow-hidden"
            style={{
              background: 'linear-gradient(180deg, rgba(30,20,50,0.95) 0%, rgba(15,10,30,0.98) 100%)',
              border: '1px solid',
              borderImage: 'linear-gradient(135deg, #b8860b, rgba(218,165,32,0.3), #b8860b) 1',
              boxShadow: '0 4px 20px rgba(0,0,0,0.5), inset 0 1px 0 rgba(218,165,32,0.15)',
            }}
          >
            <div className="px-4 py-3 flex items-center justify-between" style={{
              borderBottom: '1px solid rgba(218,165,32,0.15)',
              background: 'linear-gradient(90deg, rgba(184,134,11,0.08), transparent, rgba(184,134,11,0.08))',
            }}>
              <span className="text-yellow-400/80 font-semibold text-sm tracking-wide uppercase flex items-center gap-2">
                <Coins className="w-4 h-4" />
                Bet Amount
              </span>
              <Badge className="bg-gradient-to-r from-yellow-500/20 to-amber-500/20 border-yellow-500/40 text-yellow-300 font-bold">
                1.96x Payout
              </Badge>
            </div>
            
            <div className="p-4">
              <div className="flex items-center gap-2 mb-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={halfBet}
                  disabled={isFlipping}
                  className="border-yellow-600/30 bg-yellow-500/5 hover:bg-yellow-500/15 text-yellow-400 font-bold"
                >
                  ½
                </Button>
                <div className="flex-1 text-center">
                  <div className="text-3xl font-black bg-gradient-to-r from-yellow-300 via-yellow-400 to-amber-400 bg-clip-text text-transparent">
                    {formatNumber(betAmount)} {currencyType}
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={doubleBet}
                  disabled={isFlipping}
                  className="border-yellow-600/30 bg-yellow-500/5 hover:bg-yellow-500/15 text-yellow-400 font-bold"
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
                      border-yellow-600/20 font-semibold transition-all
                      ${betAmount === amount 
                        ? 'bg-gradient-to-r from-yellow-500/20 to-amber-500/20 text-yellow-300 ring-1 ring-yellow-400/50 shadow-md shadow-yellow-500/10' 
                        : 'hover:bg-yellow-500/10 text-gray-400 hover:text-yellow-400'}
                    `}
                  >
                    {amount}
                  </Button>
                ))}
              </div>
            </div>
          </div>

          <motion.div
            whileHover={!isFlipping && getBalance() >= betAmount ? { scale: 1.05 } : {}}
            whileTap={!isFlipping && getBalance() >= betAmount ? { scale: 0.98 } : {}}
          >
            <Button
              onClick={flipCoin}
              disabled={isFlipping || getBalance() < betAmount}
              className={`
                px-16 py-8 text-2xl font-black rounded-full transition-all relative overflow-hidden
                ${!isFlipping && getBalance() >= betAmount
                  ? 'bg-gradient-to-r from-yellow-400 via-amber-500 to-orange-500 hover:from-yellow-300 hover:via-amber-400 hover:to-orange-400 text-black shadow-xl shadow-amber-500/30'
                  : 'bg-gray-700 text-gray-400 cursor-not-allowed'
                }
              `}
              data-testid="flip-button"
            >
              {!isFlipping && getBalance() >= betAmount && (
                <motion.div
                  className="absolute inset-0"
                  style={{
                    background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
                  }}
                  animate={{ x: ['-100%', '200%'] }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                />
              )}
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
          </motion.div>
        </div>

        <AnimatePresence>
          {showResult && lastResult && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4"
              onClick={() => setShowResult(false)}
            >
              <motion.div
                initial={{ y: 80, scale: 0.7, opacity: 0 }}
                animate={{ y: 0, scale: 1, opacity: 1 }}
                exit={{ y: 40, scale: 0.8, opacity: 0 }}
                transition={{ type: "spring", damping: 20, stiffness: 300 }}
                className={`
                  rounded-3xl p-10 text-center max-w-md w-full relative overflow-hidden
                  ${lastResult.won 
                    ? 'border-2 border-green-400/50' 
                    : 'border-2 border-red-400/30'}
                `}
                style={{
                  background: lastResult.won
                    ? 'linear-gradient(145deg, rgba(5,46,22,0.97), rgba(6,78,59,0.95), rgba(5,46,22,0.97))'
                    : 'linear-gradient(145deg, rgba(69,10,10,0.97), rgba(127,29,29,0.95), rgba(69,10,10,0.97))',
                  boxShadow: lastResult.won
                    ? '0 0 60px rgba(34,197,94,0.2), inset 0 1px 0 rgba(34,197,94,0.2)'
                    : '0 0 60px rgba(239,68,68,0.2), inset 0 1px 0 rgba(239,68,68,0.2)',
                }}
                onClick={e => e.stopPropagation()}
              >
                {lastResult.won && (
                  <div className="absolute inset-0 pointer-events-none overflow-hidden">
                    {[...Array(20)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="absolute w-1 h-1 rounded-full"
                        style={{
                          left: `${Math.random() * 100}%`,
                          top: `${Math.random() * 100}%`,
                          backgroundColor: ['#fbbf24', '#34d399', '#fff', '#a78bfa'][i % 4],
                          boxShadow: `0 0 4px ${['#fbbf24', '#34d399', '#fff', '#a78bfa'][i % 4]}`,
                        }}
                        animate={{
                          opacity: [0, 1, 0],
                          scale: [0, 2, 0],
                        }}
                        transition={{
                          duration: 1.5 + Math.random(),
                          repeat: Infinity,
                          delay: Math.random() * 2,
                        }}
                      />
                    ))}
                  </div>
                )}

                <motion.div
                  animate={{ scale: [1, 1.15, 1], rotate: [0, 5, -5, 0] }}
                  transition={{ repeat: 2, duration: 0.4 }}
                  className={`
                    w-28 h-28 mx-auto mb-6 rounded-full flex items-center justify-center
                    ${lastResult.won 
                      ? 'bg-gradient-to-br from-green-400 to-emerald-600 shadow-xl shadow-green-500/30' 
                      : 'bg-gradient-to-br from-red-400 to-rose-600 shadow-xl shadow-red-500/30'}
                  `}
                >
                  {lastResult.result === "heads" ? (
                    <Crown className="w-14 h-14 text-white" />
                  ) : (
                    <Star className="w-14 h-14 text-white" />
                  )}
                </motion.div>
                
                <motion.h2 
                  initial={{ scale: 0.5 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", damping: 10 }}
                  className={`text-4xl md:text-5xl font-black mb-3 tracking-tight ${lastResult.won ? 'text-green-300' : 'text-red-300'}`}
                  style={{
                    textShadow: lastResult.won 
                      ? '0 0 20px rgba(34,197,94,0.5)' 
                      : '0 0 20px rgba(239,68,68,0.5)',
                  }}
                >
                  {lastResult.won ? "YOU WIN!" : "YOU LOSE"}
                </motion.h2>
                
                <p className="text-gray-300 mb-4 text-lg">
                  It landed on <span className="font-bold capitalize text-white">{lastResult.result}</span>!
                </p>
                
                {lastResult.won ? (
                  <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring" }}
                    className="text-5xl md:text-6xl font-black mb-8"
                    style={{
                      background: 'linear-gradient(135deg, #86efac, #22c55e, #15803d)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      filter: 'drop-shadow(0 0 10px rgba(34,197,94,0.3))',
                    }}
                  >
                    +{formatNumber(lastResult.payout)} {currencyType}
                  </motion.div>
                ) : (
                  <div className="text-3xl font-bold text-red-400 mb-8">
                    -{formatNumber(lastResult.amount)} {currencyType}
                  </div>
                )}
                
                <Button
                  onClick={() => setShowResult(false)}
                  className={`
                    w-full py-6 text-lg font-black rounded-xl shadow-lg transition-all
                    ${lastResult.won 
                      ? 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 shadow-green-500/20' 
                      : 'bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-400 hover:to-rose-500 shadow-red-500/20'}
                  `}
                >
                  {lastResult.won ? "Collect Winnings" : "Try Again"}
                </Button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <Card className="bg-black/40 border-white/10 backdrop-blur-xl" style={{
          borderImage: 'linear-gradient(135deg, rgba(184,134,11,0.2), rgba(255,255,255,0.05), rgba(184,134,11,0.2)) 1',
        }}>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <History className="w-5 h-5 text-yellow-400/60" />
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

        <div className="mt-6 text-center text-xs text-gray-500">
          <p>House edge: 2% • Win probability: 50% • Payout: 1.96x</p>
        </div>
      </div>
    </div>
  );
}