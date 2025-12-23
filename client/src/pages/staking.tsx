import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Coins, Lock, Unlock, TrendingUp, Trophy, Zap, Gift, Clock, ChevronRight, Sparkles, Shield, Star, LogIn } from "lucide-react";
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

export default function Staking() {
  usePageAnalytics();
  const queryClient = useQueryClient();
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const [selectedPool, setSelectedPool] = useState<StakingPool | null>(null);
  const [stakeAmount, setStakeAmount] = useState("");
  const [isStakeModalOpen, setIsStakeModalOpen] = useState(false);

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

  const stakeMutation = useMutation({
    mutationFn: async ({ poolId, amount }: { poolId: string; amount: string }) => {
      const res = await apiRequest("POST", "/api/staking/stake", { poolId, amount });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/staking/pools"] });
      queryClient.invalidateQueries({ queryKey: ["/api/staking/stats"] });
      setIsStakeModalOpen(false);
      setStakeAmount("");
      setSelectedPool(null);
    },
  });

  const pools = poolsData?.pools || [];
  const quests = questsData?.quests || [];

  const handleStake = () => {
    if (!selectedPool || !stakeAmount) return;
    stakeMutation.mutate({ poolId: selectedPool.id, amount: stakeAmount });
  };

  const openStakeModal = (pool: StakingPool) => {
    if (!isAuthenticated) {
      window.location.href = "/api/login";
      return;
    }
    setSelectedPool(pool);
    setIsStakeModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden selection:bg-primary/20 selection:text-primary">
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-background/90 backdrop-blur-xl">
        <div className="container mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <img src={orbitLogo} alt="DarkWave" className="w-7 h-7" />
            <span className="font-display font-bold text-lg tracking-tight hidden sm:inline">DarkWave</span>
          </Link>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="border-emerald-500/50 text-emerald-400 bg-emerald-500/10 text-[10px] sm:text-xs whitespace-nowrap">
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

      <section className="pt-20 pb-8 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-8">
            <Badge variant="outline" className="px-3 py-1 border-primary/50 text-primary bg-primary/10 rounded-full text-xs tracking-wider uppercase mb-4">
              Earn Rewards
            </Badge>
            <h1 className="text-3xl md:text-5xl font-display font-bold mb-3">
              Staking <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-purple-400 to-secondary">Nexus</span>
            </h1>
            <p className="text-muted-foreground max-w-xl mx-auto text-sm">
              Lock your DWT tokens to earn rewards, unlock exclusive perks, and climb the leaderboard.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
            <GlassCard hover={false}>
              <div className="p-4 text-center">
                <div className="text-2xl font-bold text-primary">{formatNumber(stats?.totalValueLocked || "0")}</div>
                <div className="text-[10px] text-white/50 uppercase tracking-wider">Total Staked</div>
              </div>
            </GlassCard>
            <GlassCard hover={false}>
              <div className="p-4 text-center">
                <div className="text-2xl font-bold text-white">{stats?.totalStakers || 0}</div>
                <div className="text-[10px] text-white/50 uppercase tracking-wider">Stakers</div>
              </div>
            </GlassCard>
            <GlassCard hover={false}>
              <div className="p-4 text-center">
                <div className="text-2xl font-bold text-emerald-400">{formatNumber(stats?.totalRewardsDistributed || "0")}</div>
                <div className="text-[10px] text-white/50 uppercase tracking-wider">Rewards Paid</div>
              </div>
            </GlassCard>
            <GlassCard hover={false}>
              <div className="p-4 text-center">
                <div className="text-2xl font-bold text-amber-400">{stats?.averageApy || "0"}%</div>
                <div className="text-[10px] text-white/50 uppercase tracking-wider">Avg APY</div>
              </div>
            </GlassCard>
          </div>
        </div>
      </section>

      <section className="pb-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-xl font-display font-bold mb-4 flex items-center gap-2">
            <Coins className="w-5 h-5 text-primary" />
            Staking Pools
          </h2>

          {poolsLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-64 rounded-xl bg-white/5 animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {pools.map((pool) => (
                <motion.div
                  key={pool.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <GlassCard className="h-full" data-testid={`pool-card-${pool.slug}`}>
                    <div className="p-5 flex flex-col h-full">
                      <div className="flex items-start justify-between mb-3">
                        <div className={`p-2 rounded-lg bg-gradient-to-br ${getPoolGradient(pool.poolType, pool.lockDays)}`}>
                          {getPoolIcon(pool.poolType)}
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-white">{pool.effectiveApy}%</div>
                          <div className="text-[10px] text-white/50 uppercase">APY</div>
                        </div>
                      </div>

                      <h3 className="text-lg font-display font-bold text-white mb-1">{pool.name}</h3>
                      <p className="text-xs text-muted-foreground mb-4 flex-grow">{pool.description}</p>

                      <div className="grid grid-cols-2 gap-2 mb-4 text-xs">
                        <div className="p-2 rounded-lg bg-white/5">
                          <div className="text-white/50">Lock Period</div>
                          <div className="font-semibold text-white">
                            {pool.lockDays === 0 ? "None" : `${pool.lockDays} days`}
                          </div>
                        </div>
                        <div className="p-2 rounded-lg bg-white/5">
                          <div className="text-white/50">Min Stake</div>
                          <div className="font-semibold text-white">{formatNumber(pool.minStake)} DWT</div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-xs text-white/50 mb-4">
                        <span>{formatNumber(pool.totalStaked)} DWT staked</span>
                        <span>{pool.totalStakers} stakers</span>
                      </div>

                      {pool.userStake ? (
                        <div className="p-3 rounded-lg bg-primary/10 border border-primary/20 mb-3">
                          <div className="flex items-center justify-between text-xs mb-1">
                            <span className="text-white/70">Your stake</span>
                            <span className="font-bold text-primary">{formatNumber(pool.userStake.amount)} DWT</span>
                          </div>
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-white/70">Pending rewards</span>
                            <span className="font-bold text-emerald-400">+{parseFloat(pool.userStake.pendingRewards).toFixed(4)} DWT</span>
                          </div>
                        </div>
                      ) : null}

                      <Button
                        className="w-full bg-gradient-to-r from-primary to-secondary text-black font-bold hover:opacity-90"
                        onClick={() => openStakeModal(pool)}
                        data-testid={`button-stake-${pool.slug}`}
                      >
                        {!isAuthenticated ? (
                          <>
                            <LogIn className="w-4 h-4 mr-1" />
                            Login to Stake
                          </>
                        ) : pool.userStake ? "Stake More" : "Stake Now"}
                        {isAuthenticated && <ChevronRight className="w-4 h-4 ml-1" />}
                      </Button>
                    </div>
                  </GlassCard>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="pb-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-xl font-display font-bold mb-4 flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-400" />
            Active Quests
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {quests.slice(0, 6).map((quest) => (
              <GlassCard key={quest.id} data-testid={`quest-card-${quest.id}`}>
                <div className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-amber-500/20">
                      <Gift className="w-4 h-4 text-amber-400" />
                    </div>
                    <div className="flex-grow">
                      <h3 className="font-semibold text-white text-sm">{quest.title}</h3>
                      <p className="text-xs text-muted-foreground mt-1">{quest.description}</p>
                      <div className="flex items-center gap-3 mt-3">
                        <Badge variant="outline" className="text-[10px] border-emerald-500/50 text-emerald-400">
                          +{quest.rewardDwt} DWT
                        </Badge>
                        {quest.rewardBadge && (
                          <Badge variant="outline" className="text-[10px] border-purple-500/50 text-purple-400">
                            NFT Badge
                          </Badge>
                        )}
                        {parseFloat(quest.apyBoost) > 0 && (
                          <Badge variant="outline" className="text-[10px] border-primary/50 text-primary">
                            +{quest.apyBoost}% APY
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </GlassCard>
            ))}
          </div>
        </div>
      </section>

      <section className="pb-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <GlassCard>
              <div className="p-6 text-center">
                <Shield className="w-10 h-10 text-primary mx-auto mb-3" />
                <h3 className="font-display font-bold text-white mb-2">Secure Staking</h3>
                <p className="text-xs text-muted-foreground">
                  Your tokens are protected by the Founders Validator with enterprise-grade security.
                </p>
              </div>
            </GlassCard>
            <GlassCard>
              <div className="p-6 text-center">
                <Zap className="w-10 h-10 text-amber-400 mx-auto mb-3" />
                <h3 className="font-display font-bold text-white mb-2">Instant Rewards</h3>
                <p className="text-xs text-muted-foreground">
                  Rewards accrue every block. Claim anytime with instant settlement.
                </p>
              </div>
            </GlassCard>
            <GlassCard>
              <div className="p-6 text-center">
                <TrendingUp className="w-10 h-10 text-emerald-400 mx-auto mb-3" />
                <h3 className="font-display font-bold text-white mb-2">Compound Growth</h3>
                <p className="text-xs text-muted-foreground">
                  Auto-compound your rewards or reinvest for maximum returns.
                </p>
              </div>
            </GlassCard>
          </div>
        </div>
      </section>

      <Dialog open={isStakeModalOpen} onOpenChange={setIsStakeModalOpen}>
        <DialogContent className="sm:max-w-md bg-background border-white/10">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {selectedPool && getPoolIcon(selectedPool.poolType)}
              Stake in {selectedPool?.name}
            </DialogTitle>
            <DialogDescription>
              {selectedPool?.lockDays ? `Lock period: ${selectedPool.lockDays} days` : "No lock period - withdraw anytime"}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="p-4 rounded-lg bg-white/5">
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-white/70">APY</span>
                <span className="font-bold text-primary text-lg">{selectedPool?.effectiveApy}%</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-white/70">Minimum</span>
                <span className="text-white">{selectedPool?.minStake} DWT</span>
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
                  className="pr-16 bg-white/5 border-white/10"
                  data-testid="input-stake-amount"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-white/50">DWT</span>
              </div>
            </div>

            {selectedPool?.lockDays ? (
              <div className="flex items-center gap-2 p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
                <Clock className="w-4 h-4 text-amber-400 shrink-0" />
                <p className="text-xs text-amber-200">
                  Your tokens will be locked for {selectedPool.lockDays} days. Early withdrawal is not available.
                </p>
              </div>
            ) : null}

            <Button
              className="w-full bg-gradient-to-r from-primary to-secondary text-black font-bold"
              onClick={handleStake}
              disabled={!stakeAmount || parseFloat(stakeAmount) < parseFloat(selectedPool?.minStake || "0") || stakeMutation.isPending}
              data-testid="button-confirm-stake"
            >
              {stakeMutation.isPending ? "Staking..." : "Confirm Stake"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
}
