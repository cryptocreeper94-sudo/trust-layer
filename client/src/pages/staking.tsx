import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Coins, Lock, Unlock, TrendingUp, Trophy, Zap, Gift, Clock, ChevronRight, Sparkles, Shield, Star, LogIn, Crown, Medal, Award, Flame, Wallet, ArrowUpRight } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Footer } from "@/components/footer";
import { usePageAnalytics } from "@/hooks/use-analytics";
import { GlassCard } from "@/components/glass-card";
import { apiRequest } from "@/lib/queryClient";
import { useAuth } from "@/hooks/use-auth";
import orbitLogo from "@assets/generated_images/futuristic_abstract_geometric_logo_symbol_for_orbit.png";
import { WalletButton } from "@/components/wallet-button";

interface StakingPool {
  id: string;
  name: string;
  slug: string;
  description: string;
  poolType: string;
  apyBase: string;
  apyBoost: string;
  lockDays: number;
  minStake: string;
  maxStake: string | null;
  totalStaked: string;
  totalStakers: number;
  isActive: boolean;
  effectiveApy: string;
  userStake?: {
    id: string;
    amount: string;
    pendingRewards: string;
    streakDays: number;
    lockedUntil: string | null;
  };
}

interface StakingStats {
  totalValueLocked: string;
  totalStakers: number;
  totalRewardsDistributed: string;
  averageApy: string;
}

interface StakingQuest {
  id: string;
  title: string;
  description: string;
  questType: string;
  rewardDwt: string;
  rewardBadge: string | null;
  apyBoost: string;
}

interface LeaderboardEntry {
  rank: number;
  userId: string;
  totalStaked: string;
  totalRewards: string;
  streakDays: number;
}

interface UserStake {
  id: string;
  poolId: string;
  poolName: string;
  amount: string;
  pendingRewards: string;
  stakedAt: string;
  lockedUntil: string | null;
  streakDays: number;
}

function formatNumber(num: string | number): string {
  const n = typeof num === "string" ? parseFloat(num) : num;
  if (n >= 1000000) return `${(n / 1000000).toFixed(2)}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
  return n.toLocaleString();
}

function getPoolIcon(poolType: string) {
  switch (poolType) {
    case "liquid": return <Unlock className="w-5 h-5" />;
    case "locked": return <Lock className="w-5 h-5" />;
    case "founders": return <Star className="w-5 h-5" />;
    default: return <Coins className="w-5 h-5" />;
  }
}

function getPoolGradient(poolType: string, lockDays: number) {
  if (poolType === "founders") return "from-amber-500 via-yellow-400 to-amber-600";
  if (poolType === "liquid") return "from-emerald-500 to-teal-600";
  if (lockDays >= 180) return "from-purple-500 to-violet-600";
  if (lockDays >= 90) return "from-blue-500 to-indigo-600";
  return "from-cyan-500 to-blue-600";
}

function getRankIcon(rank: number) {
  if (rank === 1) return <Crown className="w-5 h-5 text-amber-400" />;
  if (rank === 2) return <Medal className="w-5 h-5 text-gray-300" />;
  if (rank === 3) return <Award className="w-5 h-5 text-amber-600" />;
  return <span className="w-5 h-5 text-center text-white/50 text-sm font-bold">{rank}</span>;
}

function FloatingParticle({ delay, duration, x }: { delay: number; duration: number; x: number }) {
  return (
    <motion.div
      className="absolute w-1 h-1 rounded-full bg-primary/40"
      style={{ left: `${x}%`, bottom: 0 }}
      animate={{
        y: [0, -400],
        opacity: [0, 1, 0],
        scale: [0.5, 1, 0.5],
      }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        ease: "linear",
      }}
    />
  );
}

export default function Staking() {
  usePageAnalytics();
  const queryClient = useQueryClient();
  const { user, isAuthenticated } = useAuth();
  const [selectedPool, setSelectedPool] = useState<StakingPool | null>(null);
  const [stakeAmount, setStakeAmount] = useState("");
  const [isStakeModalOpen, setIsStakeModalOpen] = useState(false);
  const [claimingStakeId, setClaimingStakeId] = useState<string | null>(null);

  const { data: stats } = useQuery<StakingStats>({
    queryKey: ["/api/staking/stats"],
    queryFn: async () => {
      const res = await apiRequest("GET", "/api/staking/stats");
      return res.json();
    },
  });

  const { data: poolsData, isLoading: poolsLoading } = useQuery<{ pools: StakingPool[] }>({
    queryKey: ["/api/staking/pools", user?.id],
    queryFn: async () => {
      const url = user?.id ? `/api/staking/pools?userId=${user.id}` : "/api/staking/pools";
      const res = await apiRequest("GET", url);
      return res.json();
    },
  });

  const { data: questsData } = useQuery<{ quests: StakingQuest[] }>({
    queryKey: ["/api/staking/quests"],
    queryFn: async () => {
      const res = await apiRequest("GET", "/api/staking/quests");
      return res.json();
    },
  });

  const { data: leaderboardData } = useQuery<{ leaderboard: LeaderboardEntry[] }>({
    queryKey: ["/api/staking/leaderboard"],
    queryFn: async () => {
      const res = await apiRequest("GET", "/api/staking/leaderboard?limit=10");
      return res.json();
    },
  });

  const { data: userStakesData } = useQuery<{ stakes: UserStake[] }>({
    queryKey: ["/api/staking/user/stakes"],
    queryFn: async () => {
      const res = await apiRequest("GET", "/api/staking/user/stakes");
      return res.json();
    },
    enabled: isAuthenticated,
  });

  const stakeMutation = useMutation({
    mutationFn: async ({ poolId, amount }: { poolId: string; amount: string }) => {
      const res = await apiRequest("POST", "/api/staking/stake", { poolId, amount });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/staking/pools"] });
      queryClient.invalidateQueries({ queryKey: ["/api/staking/stats"] });
      queryClient.invalidateQueries({ queryKey: ["/api/staking/user/stakes"] });
      setIsStakeModalOpen(false);
      setStakeAmount("");
      setSelectedPool(null);
    },
  });

  const claimMutation = useMutation({
    mutationFn: async (stakeId: string) => {
      const res = await apiRequest("POST", "/api/staking/claim", { stakeId });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/staking/pools"] });
      queryClient.invalidateQueries({ queryKey: ["/api/staking/stats"] });
      queryClient.invalidateQueries({ queryKey: ["/api/staking/user/stakes"] });
    },
    onSettled: () => {
      setClaimingStakeId(null);
    },
  });

  const pools = poolsData?.pools || [];
  const quests = questsData?.quests || [];
  const leaderboard = leaderboardData?.leaderboard || [];
  const userStakes = userStakesData?.stakes || [];

  const handleStake = () => {
    if (!selectedPool || !stakeAmount) return;
    stakeMutation.mutate({ poolId: selectedPool.id, amount: stakeAmount });
  };

  const handleClaim = (stakeId: string) => {
    setClaimingStakeId(stakeId);
    claimMutation.mutate(stakeId);
  };

  const openStakeModal = (pool: StakingPool) => {
    if (!isAuthenticated) {
      window.location.href = "/api/login";
      return;
    }
    setSelectedPool(pool);
    setIsStakeModalOpen(true);
  };

  const totalPendingRewards = userStakes.reduce((acc, stake) => acc + parseFloat(stake.pendingRewards || "0"), 0);

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden selection:bg-primary/20 selection:text-primary">
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-background/90 backdrop-blur-xl">
        <div className="container mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <img src={orbitLogo} alt="DarkWave" className="w-7 h-7" />
            <span className="font-display font-bold text-lg tracking-tight hidden sm:inline">DarkWave</span>
          </Link>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="border-emerald-500/50 text-emerald-400 bg-emerald-500/10 text-[10px] sm:text-xs whitespace-nowrap animate-pulse">
              <Sparkles className="w-3 h-3 mr-1" /> Staking Live
            </Badge>
            <Link href="/">
              <Button variant="ghost" size="sm" className="h-8 text-xs gap-1 hover:bg-white/5 px-2">
                <ArrowLeft className="w-3 h-3" />
                <span className="hidden sm:inline">Back</span>
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section with Premium Effects */}
      <section className="pt-20 pb-12 px-4 relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[120px] animate-pulse" />
          <div className="absolute top-40 right-1/4 w-80 h-80 bg-secondary/20 rounded-full blur-[100px]" style={{ animationDelay: "1s" }} />
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-64 bg-gradient-to-t from-primary/5 to-transparent" />
          {/* Floating Particles */}
          {[...Array(12)].map((_, i) => (
            <FloatingParticle key={i} delay={i * 0.5} duration={4 + Math.random() * 2} x={10 + i * 7} />
          ))}
        </div>

        <div className="container mx-auto max-w-6xl relative z-10">
          <motion.div 
            className="text-center mb-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Badge variant="outline" className="px-4 py-1.5 border-primary/50 text-primary bg-primary/10 rounded-full text-xs tracking-wider uppercase mb-4 backdrop-blur-sm">
              <Flame className="w-3 h-3 mr-1.5 inline animate-pulse" />
              Earn Up to 38% APY
            </Badge>
            <h1 className="text-4xl md:text-6xl font-display font-bold mb-4">
              Staking{" "}
              <span className="relative">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-purple-400 to-secondary">Nexus</span>
                <motion.span 
                  className="absolute -inset-1 bg-gradient-to-r from-primary/20 via-purple-400/20 to-secondary/20 blur-lg rounded-lg"
                  animate={{ opacity: [0.5, 0.8, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </span>
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto text-sm md:text-base mb-4">
              Lock your DWC tokens to earn premium rewards, unlock exclusive perks, complete quests, and climb the global leaderboard.
            </p>
            <Link href="/liquid-staking">
              <Button variant="outline" size="sm" className="border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/10" data-testid="button-liquid-staking">
                💧 Try Liquid Staking (stDWC)
                <ArrowUpRight className="w-3 h-3 ml-1" />
              </Button>
            </Link>
          </motion.div>

          {/* Premium Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            {[
              { value: formatNumber(stats?.totalValueLocked || "0"), label: "Total Value Locked", color: "text-primary", icon: Lock },
              { value: stats?.totalStakers || 0, label: "Active Stakers", color: "text-white", icon: Wallet },
              { value: formatNumber(stats?.totalRewardsDistributed || "0"), label: "Rewards Distributed", color: "text-emerald-400", icon: Gift },
              { value: `${stats?.averageApy || "0"}%`, label: "Average APY", color: "text-amber-400", icon: TrendingUp },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 * i }}
              >
                <GlassCard glow hover={false} className="relative overflow-hidden group">
                  <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="p-4 md:p-5 text-center relative">
                    <stat.icon className={`w-5 h-5 ${stat.color} mx-auto mb-2 opacity-60`} />
                    <motion.div 
                      className={`text-2xl md:text-3xl font-bold ${stat.color}`}
                      animate={{ scale: [1, 1.02, 1] }}
                      transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
                    >
                      {stat.value}
                    </motion.div>
                    <div className="text-[10px] md:text-xs text-white/50 uppercase tracking-wider mt-1">{stat.label}</div>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* My Stakes Section (for authenticated users) */}
      {isAuthenticated && userStakes.length > 0 && (
        <section className="pb-12 px-4">
          <div className="container mx-auto max-w-6xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl md:text-2xl font-display font-bold flex items-center gap-2">
                  <Wallet className="w-5 h-5 text-primary" />
                  My Active Stakes
                </h2>
                {totalPendingRewards > 0 && (
                  <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/50 animate-pulse">
                    +{totalPendingRewards.toFixed(4)} DWC Pending
                  </Badge>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {userStakes.map((stake, i) => (
                  <motion.div
                    key={stake.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: i * 0.1 }}
                  >
                    <GlassCard glow className="relative overflow-hidden" data-testid={`my-stake-${stake.id}`}>
                      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/10 to-transparent rounded-bl-full" />
                      <div className="p-5 relative">
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <h3 className="font-bold text-white">{stake.poolName || "Staking Pool"}</h3>
                            <p className="text-xs text-white/50">
                              Staked {new Date(stake.stakedAt).toLocaleDateString()}
                            </p>
                          </div>
                          {stake.streakDays > 0 && (
                            <Badge variant="outline" className="border-amber-500/50 text-amber-400 bg-amber-500/10">
                              <Flame className="w-3 h-3 mr-1" />
                              {stake.streakDays}d streak
                            </Badge>
                          )}
                        </div>

                        <div className="grid grid-cols-2 gap-3 mb-4">
                          <div className="p-3 rounded-lg bg-white/5">
                            <div className="text-[10px] text-white/50 uppercase mb-1">Staked</div>
                            <div className="font-bold text-white text-lg">{formatNumber(stake.amount)}</div>
                            <div className="text-[10px] text-white/40">DWC</div>
                          </div>
                          <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                            <div className="text-[10px] text-emerald-400/70 uppercase mb-1">Rewards</div>
                            <div className="font-bold text-emerald-400 text-lg">+{parseFloat(stake.pendingRewards).toFixed(4)}</div>
                            <div className="text-[10px] text-emerald-400/40">DWC</div>
                          </div>
                        </div>

                        {stake.lockedUntil && new Date(stake.lockedUntil) > new Date() && (
                          <div className="flex items-center gap-2 p-2 rounded-lg bg-amber-500/10 border border-amber-500/20 mb-4">
                            <Lock className="w-3 h-3 text-amber-400" />
                            <span className="text-[10px] text-amber-200">
                              Locked until {new Date(stake.lockedUntil).toLocaleDateString()}
                            </span>
                          </div>
                        )}

                        <Button
                          className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 text-black font-bold hover:opacity-90 disabled:opacity-50"
                          onClick={() => handleClaim(stake.id)}
                          disabled={parseFloat(stake.pendingRewards) <= 0 || claimingStakeId === stake.id}
                          data-testid={`button-claim-${stake.id}`}
                        >
                          {claimingStakeId === stake.id ? (
                            <span className="flex items-center gap-2">
                              <motion.span
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                              >
                                <Sparkles className="w-4 h-4" />
                              </motion.span>
                              Claiming...
                            </span>
                          ) : (
                            <>
                              <Gift className="w-4 h-4 mr-1" />
                              Claim {parseFloat(stake.pendingRewards).toFixed(4)} DWC
                            </>
                          )}
                        </Button>
                      </div>
                    </GlassCard>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* Staking Pools Section */}
      <section className="pb-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-xl md:text-2xl font-display font-bold mb-6 flex items-center gap-2">
            <Coins className="w-5 h-5 text-primary" />
            Staking Pools
          </h2>

          {poolsLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-72 rounded-xl bg-white/5 animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {pools.map((pool, i) => (
                <motion.div
                  key={pool.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: i * 0.1 }}
                >
                  <GlassCard glow className="h-full relative overflow-hidden group" data-testid={`pool-card-${pool.slug}`}>
                    {/* Premium glow effect on hover */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${getPoolGradient(pool.poolType, pool.lockDays)} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />
                    
                    {/* Founders badge */}
                    {pool.poolType === "founders" && (
                      <div className="absolute top-0 right-0 px-3 py-1 bg-gradient-to-r from-amber-500 to-yellow-400 text-black text-[10px] font-bold rounded-bl-lg">
                        <Crown className="w-3 h-3 inline mr-1" /> EXCLUSIVE
                      </div>
                    )}

                    <div className="p-5 flex flex-col h-full relative">
                      <div className="flex items-start justify-between mb-4">
                        <motion.div 
                          className={`p-3 rounded-xl bg-gradient-to-br ${getPoolGradient(pool.poolType, pool.lockDays)} shadow-lg`}
                          whileHover={{ scale: 1.1, rotate: 5 }}
                          transition={{ type: "spring", stiffness: 300 }}
                        >
                          {getPoolIcon(pool.poolType)}
                        </motion.div>
                        <div className="text-right">
                          <motion.div 
                            className="text-3xl font-bold text-white"
                            animate={{ scale: [1, 1.02, 1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                          >
                            {pool.effectiveApy}%
                          </motion.div>
                          <div className="text-[10px] text-primary uppercase font-semibold tracking-wider">APY</div>
                        </div>
                      </div>

                      <h3 className="text-lg font-display font-bold text-white mb-2">{pool.name}</h3>
                      <p className="text-xs text-muted-foreground mb-4 flex-grow line-clamp-2">{pool.description}</p>

                      <div className="grid grid-cols-2 gap-2 mb-4">
                        <div className="p-2.5 rounded-lg bg-white/5 border border-white/5">
                          <div className="text-[10px] text-white/40 uppercase">Lock Period</div>
                          <div className="font-semibold text-white text-sm">
                            {pool.lockDays === 0 ? "Flexible" : `${pool.lockDays} Days`}
                          </div>
                        </div>
                        <div className="p-2.5 rounded-lg bg-white/5 border border-white/5">
                          <div className="text-[10px] text-white/40 uppercase">Min Stake</div>
                          <div className="font-semibold text-white text-sm">{formatNumber(pool.minStake)} DWC</div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-xs text-white/50 mb-4 px-1">
                        <span className="flex items-center gap-1">
                          <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                          {formatNumber(pool.totalStaked)} staked
                        </span>
                        <span>{pool.totalStakers} stakers</span>
                      </div>

                      {pool.userStake && (
                        <motion.div 
                          className="p-3 rounded-lg bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20 mb-4"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                        >
                          <div className="flex items-center justify-between text-xs mb-1">
                            <span className="text-white/70">Your stake</span>
                            <span className="font-bold text-primary">{formatNumber(pool.userStake.amount)} DWC</span>
                          </div>
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-white/70">Pending rewards</span>
                            <span className="font-bold text-emerald-400">+{parseFloat(pool.userStake.pendingRewards).toFixed(4)} DWC</span>
                          </div>
                        </motion.div>
                      )}

                      <Button
                        className={`w-full font-bold hover:opacity-90 transition-all ${
                          pool.poolType === "founders"
                            ? "bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 text-black"
                            : "bg-gradient-to-r from-primary to-secondary text-black"
                        }`}
                        onClick={() => openStakeModal(pool)}
                        data-testid={`button-stake-${pool.slug}`}
                      >
                        {!isAuthenticated ? (
                          <>
                            <LogIn className="w-4 h-4 mr-1" />
                            Login to Stake
                          </>
                        ) : pool.userStake ? (
                          <>Stake More <ArrowUpRight className="w-4 h-4 ml-1" /></>
                        ) : (
                          <>Stake Now <ChevronRight className="w-4 h-4 ml-1" /></>
                        )}
                      </Button>
                    </div>
                  </GlassCard>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Leaderboard Section */}
      <section className="pb-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Leaderboard */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-xl md:text-2xl font-display font-bold mb-6 flex items-center gap-2">
                <Trophy className="w-5 h-5 text-amber-400" />
                Top Stakers
              </h2>

              <GlassCard className="overflow-hidden">
                <div className="divide-y divide-white/5">
                  {leaderboard.length === 0 ? (
                    <div className="p-8 text-center text-white/50">
                      <Trophy className="w-10 h-10 mx-auto mb-3 opacity-30" />
                      <p className="text-sm">No stakers yet. Be the first!</p>
                    </div>
                  ) : (
                    leaderboard.slice(0, 10).map((entry, i) => (
                      <motion.div
                        key={entry.userId}
                        className={`p-4 flex items-center gap-4 ${i < 3 ? "bg-gradient-to-r from-amber-500/5 to-transparent" : ""}`}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 }}
                        data-testid={`leaderboard-entry-${entry.rank}`}
                      >
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          i === 0 ? "bg-amber-500/20 ring-2 ring-amber-400/50" :
                          i === 1 ? "bg-gray-400/20 ring-2 ring-gray-300/50" :
                          i === 2 ? "bg-amber-700/20 ring-2 ring-amber-600/50" :
                          "bg-white/5"
                        }`}>
                          {getRankIcon(entry.rank)}
                        </div>
                        <div className="flex-grow">
                          <div className="font-semibold text-white text-sm">
                            {entry.userId.slice(0, 8)}...{entry.userId.slice(-4)}
                          </div>
                          <div className="text-[10px] text-white/50 flex items-center gap-2">
                            <span>{formatNumber(entry.totalStaked)} DWC</span>
                            {entry.streakDays > 0 && (
                              <span className="flex items-center gap-0.5 text-amber-400">
                                <Flame className="w-3 h-3" />
                                {entry.streakDays}d
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-emerald-400 font-bold text-sm">+{formatNumber(entry.totalRewards)}</div>
                          <div className="text-[10px] text-white/40">earned</div>
                        </div>
                      </motion.div>
                    ))
                  )}
                </div>
              </GlassCard>
            </motion.div>

            {/* Quests */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-xl md:text-2xl font-display font-bold mb-6 flex items-center gap-2">
                <Gift className="w-5 h-5 text-purple-400" />
                Active Quests
              </h2>

              <div className="space-y-3">
                {quests.slice(0, 4).map((quest, i) => (
                  <motion.div
                    key={quest.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <GlassCard className="group hover:border-purple-500/30 transition-colors" data-testid={`quest-card-${quest.id}`}>
                      <div className="p-4 flex items-start gap-4">
                        <div className="p-2.5 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 group-hover:from-purple-500/30 group-hover:to-pink-500/30 transition-colors">
                          <Gift className="w-5 h-5 text-purple-400" />
                        </div>
                        <div className="flex-grow">
                          <h3 className="font-bold text-white text-sm mb-1">{quest.title}</h3>
                          <p className="text-xs text-muted-foreground line-clamp-1">{quest.description}</p>
                          <div className="flex flex-wrap items-center gap-2 mt-2">
                            <Badge variant="outline" className="text-[10px] border-emerald-500/50 text-emerald-400 bg-emerald-500/5">
                              +{quest.rewardDwt} DWC
                            </Badge>
                            {quest.rewardBadge && (
                              <Badge variant="outline" className="text-[10px] border-purple-500/50 text-purple-400 bg-purple-500/5">
                                <Star className="w-3 h-3 mr-0.5" /> NFT Badge
                              </Badge>
                            )}
                            {parseFloat(quest.apyBoost) > 0 && (
                              <Badge variant="outline" className="text-[10px] border-primary/50 text-primary bg-primary/5">
                                +{quest.apyBoost}% APY
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </GlassCard>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="pb-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { icon: Shield, color: "text-primary", bg: "bg-primary/10", title: "Secure Staking", desc: "Your tokens are protected by the Founders Validator with enterprise-grade security." },
              { icon: Zap, color: "text-amber-400", bg: "bg-amber-500/10", title: "Instant Rewards", desc: "Rewards accrue every block. Claim anytime with instant settlement." },
              { icon: TrendingUp, color: "text-emerald-400", bg: "bg-emerald-500/10", title: "Compound Growth", desc: "Auto-compound your rewards or reinvest for maximum returns." },
            ].map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
              >
                <GlassCard className="h-full group hover:border-white/20 transition-colors">
                  <div className="p-6 text-center">
                    <div className={`w-14 h-14 rounded-2xl ${feature.bg} flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}>
                      <feature.icon className={`w-7 h-7 ${feature.color}`} />
                    </div>
                    <h3 className="font-display font-bold text-white mb-2">{feature.title}</h3>
                    <p className="text-xs text-muted-foreground">{feature.desc}</p>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stake Modal */}
      <Dialog open={isStakeModalOpen} onOpenChange={setIsStakeModalOpen}>
        <DialogContent className="sm:max-w-md bg-background/95 backdrop-blur-xl border-white/10">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-lg">
              {selectedPool && (
                <span className={`p-2 rounded-lg bg-gradient-to-br ${getPoolGradient(selectedPool.poolType, selectedPool.lockDays)}`}>
                  {getPoolIcon(selectedPool.poolType)}
                </span>
              )}
              Stake in {selectedPool?.name}
            </DialogTitle>
            <DialogDescription>
              {selectedPool?.lockDays ? `Lock period: ${selectedPool.lockDays} days` : "No lock period - withdraw anytime"}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="p-4 rounded-xl bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20">
              <div className="flex items-center justify-between mb-2">
                <span className="text-white/70 text-sm">APY Rate</span>
                <span className="font-bold text-primary text-2xl">{selectedPool?.effectiveApy}%</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-white/70">Minimum stake</span>
                <span className="text-white font-medium">{selectedPool?.minStake} DWC</span>
              </div>
            </div>

            <div>
              <label className="text-sm text-white/70 mb-2 block">Amount to Stake</label>
              <div className="relative">
                <Input
                  type="number"
                  placeholder="Enter amount"
                  value={stakeAmount}
                  onChange={(e) => setStakeAmount(e.target.value)}
                  className="pr-16 bg-white/5 border-white/10 h-12 text-lg"
                  data-testid="input-stake-amount"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-white/50 font-medium">DWC</span>
              </div>
            </div>

            {selectedPool?.lockDays ? (
              <div className="flex items-center gap-3 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20">
                <Lock className="w-5 h-5 text-amber-400 shrink-0" />
                <p className="text-xs text-amber-200">
                  Your tokens will be locked for <strong>{selectedPool.lockDays} days</strong>. Early withdrawal is not available.
                </p>
              </div>
            ) : (
              <div className="flex items-center gap-3 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                <Unlock className="w-5 h-5 text-emerald-400 shrink-0" />
                <p className="text-xs text-emerald-200">
                  <strong>Flexible staking</strong> - withdraw your tokens anytime without penalties.
                </p>
              </div>
            )}

            <Button
              className="w-full h-12 bg-gradient-to-r from-primary to-secondary text-black font-bold text-base"
              onClick={handleStake}
              disabled={!stakeAmount || parseFloat(stakeAmount) < parseFloat(selectedPool?.minStake || "0") || stakeMutation.isPending}
              data-testid="button-confirm-stake"
            >
              {stakeMutation.isPending ? (
                <span className="flex items-center gap-2">
                  <motion.span
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  >
                    <Sparkles className="w-5 h-5" />
                  </motion.span>
                  Processing...
                </span>
              ) : (
                <>
                  <Coins className="w-5 h-5 mr-2" />
                  Confirm Stake
                </>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
}
