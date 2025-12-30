import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useAnimation } from "framer-motion";
import { Gift, Coins, Sparkles, Star, Clock, Flame, Zap, Crown, Trophy, ChevronRight } from "lucide-react";
import { BackButton } from "@/components/page-nav";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import { apiRequest } from "@/lib/queryClient";

interface DailyStatus {
  canClaim: boolean;
  streakDay: number;
  bonusGc: number;
  bonusSc: number;
  claimed: boolean;
}

interface SweepsBalance {
  goldCoins: string;
  sweepsCoins: string;
}

const WHEEL_SEGMENTS = [
  { id: 1, color: "from-yellow-400 to-amber-500", prize: "500 GC", type: "gc", value: 500 },
  { id: 2, color: "from-green-400 to-emerald-500", prize: "1 SC", type: "sc", value: 1 },
  { id: 3, color: "from-purple-400 to-violet-500", prize: "750 GC", type: "gc", value: 750 },
  { id: 4, color: "from-pink-400 to-rose-500", prize: "2 SC", type: "sc", value: 2 },
  { id: 5, color: "from-blue-400 to-cyan-500", prize: "1000 GC", type: "gc", value: 1000 },
  { id: 6, color: "from-orange-400 to-red-500", prize: "3 SC", type: "sc", value: 3 },
  { id: 7, color: "from-indigo-400 to-purple-500", prize: "2000 GC", type: "gc", value: 2000 },
  { id: 8, color: "from-teal-400 to-green-500", prize: "5 SC", type: "sc", value: 5 },
];

const STREAK_REWARDS = [
  { day: 1, gc: 100, sc: 0.5, icon: Star },
  { day: 2, gc: 200, sc: 1, icon: Flame },
  { day: 3, gc: 300, sc: 1.5, icon: Zap },
  { day: 4, gc: 500, sc: 2, icon: Gift },
  { day: 5, gc: 750, sc: 3, icon: Crown },
  { day: 6, gc: 1000, sc: 4, icon: Trophy },
  { day: 7, gc: 2000, sc: 5, icon: Sparkles },
];

export default function DailyBonus() {
  const { user, isLoading: authLoading } = useAuth();
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [wonPrize, setWonPrize] = useState<typeof WHEEL_SEGMENTS[0] | null>(null);
  const controls = useAnimation();

  const { data: dailyStatus, refetch: refetchDaily } = useQuery<DailyStatus>({
    queryKey: ["/api/sweeps/daily"],
    enabled: !!user,
  });

  const { data: balance } = useQuery<SweepsBalance>({
    queryKey: ["/api/sweeps/balance"],
    enabled: !!user,
  });

  const claimMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/sweeps/daily/claim", {});
      return res.json();
    },
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({ queryKey: ["/api/sweeps/balance"] });
      queryClient.invalidateQueries({ queryKey: ["/api/sweeps/daily"] });
    },
    onError: (error: any) => {
      toast({
        title: "Claim Failed",
        description: error.message || "Could not claim daily bonus",
        variant: "destructive",
      });
      setIsSpinning(false);
    },
  });

  const spinWheel = async () => {
    if (!dailyStatus?.canClaim || isSpinning || !user) return;
    
    setIsSpinning(true);
    setShowResult(false);
    
    // Pick random segment
    const randomIndex = Math.floor(Math.random() * WHEEL_SEGMENTS.length);
    const prize = WHEEL_SEGMENTS[randomIndex];
    setWonPrize(prize);
    
    // Calculate rotation - spin at least 5 full rotations + landing position
    const segmentAngle = 360 / WHEEL_SEGMENTS.length;
    const prizeAngle = segmentAngle * randomIndex;
    const extraSpins = 5 * 360; // 5 full spins
    const targetRotation = rotation + extraSpins + (360 - prizeAngle) + (segmentAngle / 2);
    
    setRotation(targetRotation);
    
    // Wait for spin to complete
    await controls.start({
      rotate: targetRotation,
      transition: {
        duration: 4,
        ease: [0.2, 0.8, 0.2, 1], // Custom easing for realistic wheel spin
      }
    });
    
    // Claim the bonus
    await claimMutation.mutateAsync();
    
    // Show result
    setShowResult(true);
    setIsSpinning(false);
    
    toast({
      title: "Congratulations!",
      description: `You won ${prize.prize}! Plus streak bonus: ${dailyStatus.bonusGc} GC + ${dailyStatus.bonusSc} SC`,
    });
  };

  const formatNumber = (num: string) => {
    return parseFloat(num).toLocaleString();
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0a0a0f] via-[#12121a] to-[#0a0a0f]">
        <div className="animate-pulse text-purple-400">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#0a0a0f] via-[#12121a] to-[#0a0a0f] text-white p-4">
        <Gift className="w-20 h-20 text-purple-400 mb-6" />
        <h1 className="text-3xl font-bold mb-4">Login Required</h1>
        <p className="text-gray-400 mb-6 text-center">Sign in to claim your daily bonus!</p>
        <Button 
          onClick={() => navigate("/arcade")}
          className="bg-gradient-to-r from-purple-500 to-pink-500"
        >
          Go to Arcade
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a0f] via-[#12121a] to-[#0a0a0f] text-white overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-900/30 via-transparent to-transparent pointer-events-none" />
      
      {/* Animated stars background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0.2, 1, 0.2],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 2 + Math.random() * 3,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>
      
      <div className="relative z-10 container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <BackButton />
          <div>
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-yellow-200 via-yellow-400 to-yellow-200 bg-clip-text text-transparent flex items-center gap-3" data-testid="page-title">
              <Gift className="w-10 h-10 text-yellow-400" />
              Daily Bonus
            </h1>
            <p className="text-gray-400 mt-1">Spin the wheel and claim your free rewards!</p>
          </div>
        </div>

        {/* Balance */}
        {balance && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-purple-900/50 to-pink-900/50 backdrop-blur-xl rounded-2xl p-4 border border-purple-500/30 mb-8"
          >
            <div className="flex items-center justify-center gap-8">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center">
                  <Coins className="w-6 h-6 text-black" />
                </div>
                <div>
                  <div className="text-xs text-yellow-400/80">Gold Coins</div>
                  <div className="text-xl font-bold text-yellow-400" data-testid="balance-gc">{formatNumber(balance.goldCoins)}</div>
                </div>
              </div>
              <div className="w-px h-12 bg-white/20" />
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="text-xs text-green-400/80">Sweeps Coins</div>
                  <div className="text-xl font-bold text-green-400" data-testid="balance-sc">{parseFloat(balance.sweepsCoins).toFixed(2)}</div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Wheel Section */}
        <div className="relative flex flex-col items-center mb-8">
          {/* Wheel Pointer */}
          <div className="absolute top-0 z-20 transform -translate-y-2">
            <div className="w-0 h-0 border-l-[20px] border-r-[20px] border-t-[30px] border-l-transparent border-r-transparent border-t-yellow-400 drop-shadow-lg" />
          </div>
          
          {/* Wheel Container */}
          <div className="relative">
            {/* Outer glow */}
            <div className="absolute inset-[-20px] rounded-full bg-gradient-to-r from-purple-500/30 via-pink-500/30 to-purple-500/30 blur-xl animate-pulse" />
            
            {/* Wheel */}
            <motion.div
              className="relative w-[300px] h-[300px] md:w-[350px] md:h-[350px] rounded-full border-8 border-yellow-400/50 shadow-2xl overflow-hidden"
              animate={controls}
              style={{ rotate: rotation }}
            >
              {/* Segments */}
              {WHEEL_SEGMENTS.map((segment, index) => {
                const angle = (360 / WHEEL_SEGMENTS.length) * index;
                const skewAngle = 90 - (360 / WHEEL_SEGMENTS.length);
                
                return (
                  <div
                    key={segment.id}
                    className={`absolute w-1/2 h-1/2 origin-bottom-right bg-gradient-to-br ${segment.color}`}
                    style={{
                      transform: `rotate(${angle}deg) skewY(${skewAngle}deg)`,
                      left: '50%',
                      top: 0,
                    }}
                  >
                    <div 
                      className="absolute text-white font-bold text-xs md:text-sm whitespace-nowrap"
                      style={{
                        transform: `skewY(-${skewAngle}deg) rotate(${360/WHEEL_SEGMENTS.length/2}deg)`,
                        left: '20%',
                        top: '40%',
                      }}
                    >
                      {segment.prize}
                    </div>
                  </div>
                );
              })}
              
              {/* Center button */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-gradient-to-br from-yellow-400 to-amber-600 border-4 border-yellow-300 shadow-lg flex items-center justify-center">
                  <Sparkles className="w-8 h-8 text-white" />
                </div>
              </div>
            </motion.div>
          </div>
          
          {/* Spin Button */}
          <motion.div className="mt-8">
            <Button
              onClick={spinWheel}
              disabled={!dailyStatus?.canClaim || isSpinning}
              className={`
                px-10 py-6 text-xl font-bold rounded-full shadow-lg transition-all
                ${dailyStatus?.canClaim && !isSpinning
                  ? 'bg-gradient-to-r from-yellow-400 via-amber-500 to-orange-500 hover:from-yellow-300 hover:via-amber-400 hover:to-orange-400 text-black hover:scale-105'
                  : 'bg-gray-700 text-gray-400 cursor-not-allowed'
                }
              `}
              data-testid="spin-button"
            >
              {isSpinning ? (
                <>
                  <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin mr-3" />
                  Spinning...
                </>
              ) : dailyStatus?.claimed ? (
                <>
                  <Clock className="w-6 h-6 mr-3" />
                  Come Back Tomorrow
                </>
              ) : (
                <>
                  <Sparkles className="w-6 h-6 mr-3" />
                  SPIN TO WIN!
                </>
              )}
            </Button>
          </motion.div>
        </div>

        {/* Result Popup */}
        <AnimatePresence>
          {showResult && wonPrize && (
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
              onClick={() => setShowResult(false)}
            >
              <motion.div
                initial={{ y: 50 }}
                animate={{ y: 0 }}
                className="bg-gradient-to-br from-purple-900/90 to-pink-900/90 rounded-3xl p-8 border border-purple-500/50 text-center max-w-md w-full"
                onClick={e => e.stopPropagation()}
              >
                <motion.div
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-yellow-400 to-amber-600 flex items-center justify-center"
                >
                  <Trophy className="w-12 h-12 text-white" />
                </motion.div>
                
                <h2 className="text-3xl font-bold text-yellow-400 mb-4">YOU WON!</h2>
                
                <div className="bg-black/30 rounded-xl p-4 mb-6">
                  <div className="text-lg text-gray-300 mb-2">Wheel Prize</div>
                  <div className={`text-3xl font-bold ${wonPrize.type === 'sc' ? 'text-green-400' : 'text-yellow-400'}`}>
                    {wonPrize.prize}
                  </div>
                </div>
                
                {dailyStatus && (
                  <div className="bg-black/30 rounded-xl p-4 mb-6">
                    <div className="text-lg text-gray-300 mb-2">Day {dailyStatus.streakDay} Streak Bonus</div>
                    <div className="flex items-center justify-center gap-4">
                      <div className="text-yellow-400 font-bold">+{dailyStatus.bonusGc} GC</div>
                      <div className="text-green-400 font-bold">+{dailyStatus.bonusSc} SC</div>
                    </div>
                  </div>
                )}
                
                <Button
                  onClick={() => setShowResult(false)}
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 py-6 text-lg"
                >
                  Awesome! <ChevronRight className="w-5 h-5 ml-2" />
                </Button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Streak Calendar */}
        <Card className="bg-gradient-to-br from-gray-900/80 to-gray-950/80 border-purple-500/30 backdrop-blur-xl">
          <CardContent className="p-6">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Flame className="w-5 h-5 text-orange-400" />
              7-Day Streak Rewards
            </h3>
            
            <div className="grid grid-cols-7 gap-2">
              {STREAK_REWARDS.map((reward, index) => {
                const Icon = reward.icon;
                const isCompleted = dailyStatus && index < dailyStatus.streakDay;
                const isCurrent = dailyStatus && index === dailyStatus.streakDay - 1;
                
                return (
                  <div
                    key={reward.day}
                    className={`
                      relative rounded-xl p-3 text-center transition-all
                      ${isCompleted 
                        ? 'bg-gradient-to-br from-green-500/30 to-emerald-600/30 border border-green-500/50' 
                        : isCurrent
                          ? 'bg-gradient-to-br from-purple-500/30 to-pink-600/30 border border-purple-500/50 ring-2 ring-purple-500/50'
                          : 'bg-black/30 border border-white/10'
                      }
                    `}
                  >
                    {isCompleted && (
                      <div className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-green-500 flex items-center justify-center">
                        <Sparkles className="w-3 h-3 text-white" />
                      </div>
                    )}
                    <Icon className={`w-6 h-6 mx-auto mb-1 ${isCompleted ? 'text-green-400' : isCurrent ? 'text-purple-400' : 'text-gray-500'}`} />
                    <div className={`text-xs font-bold ${isCompleted ? 'text-green-400' : isCurrent ? 'text-white' : 'text-gray-500'}`}>
                      Day {reward.day}
                    </div>
                    <div className="text-xs text-yellow-400 mt-1">{reward.gc}</div>
                    <div className="text-xs text-green-400">{reward.sc}</div>
                  </div>
                );
              })}
            </div>
            
            <div className="mt-4 pt-4 border-t border-white/10 text-center text-sm text-gray-400">
              <p>Login daily to build your streak! Rewards reset if you miss a day.</p>
            </div>
          </CardContent>
        </Card>

        {/* Info */}
        <div className="mt-6 text-center text-xs text-gray-500">
          <p>Daily bonus resets at midnight UTC. Streak bonuses are added on top of wheel prizes.</p>
        </div>
      </div>
    </div>
  );
}
