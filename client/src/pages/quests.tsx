import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { Star, Zap, Trophy, Gift, Target, Flame, TrendingUp, CheckCircle2, Clock, Crown, Sparkles, ChevronRight } from "lucide-react";
import { BackButton } from "@/components/page-nav";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GlassCard } from "@/components/glass-card";
import { InfoButton } from "@/components/info-button";
import { useAuth } from "@/hooks/use-auth";
import orbitLogo from "@assets/generated_images/futuristic_abstract_geometric_logo_symbol_for_orbit.png";

const TIERS = [
  { name: "Bronze", minXp: 0, color: "from-amber-700 to-amber-900", icon: Star },
  { name: "Silver", minXp: 1000, color: "from-gray-300 to-gray-500", icon: Star },
  { name: "Gold", minXp: 5000, color: "from-yellow-400 to-amber-500", icon: Crown },
  { name: "Platinum", minXp: 15000, color: "from-cyan-300 to-blue-500", icon: Crown },
  { name: "Diamond", minXp: 50000, color: "from-purple-400 to-pink-500", icon: Sparkles },
];

const SAMPLE_QUESTS = [
  { id: "1", name: "First Stake", description: "Stake any amount of DWC", xpReward: 50, tokenReward: "10", difficulty: "easy", category: "staking", progress: 0, target: 1, icon: "zap", completed: false },
  { id: "2", name: "Bridge Pioneer", description: "Complete your first cross-chain bridge", xpReward: 100, tokenReward: "25", difficulty: "medium", category: "bridge", progress: 0, target: 1, icon: "link", completed: false },
  { id: "3", name: "Swap Master", description: "Complete 10 token swaps", xpReward: 150, tokenReward: "50", difficulty: "medium", category: "defi", progress: 3, target: 10, icon: "repeat", completed: false },
  { id: "4", name: "NFT Collector", description: "Own 5 DarkWave NFTs", xpReward: 200, tokenReward: "100", difficulty: "hard", category: "nft", progress: 1, target: 5, icon: "image", completed: false },
  { id: "5", name: "Daily Login", description: "Login 7 days in a row", xpReward: 75, tokenReward: "20", difficulty: "easy", category: "engagement", progress: 4, target: 7, icon: "calendar", completed: false },
  { id: "6", name: "Liquidity Provider", description: "Provide liquidity to any pool", xpReward: 250, tokenReward: "75", difficulty: "hard", category: "defi", progress: 1, target: 1, icon: "droplet", completed: true },
];

const SAMPLE_MISSIONS = [
  { id: "1", name: "Community Swap Week", description: "Complete 10,000 swaps as a community", goal: "10,000 swaps", currentProgress: 7234, targetProgress: 10000, rewardPool: "50000", participantCount: 1247, endsAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000) },
  { id: "2", name: "Bridge Rush", description: "Bridge $1M in value across chains", goal: "$1M bridged", currentProgress: 456000, targetProgress: 1000000, rewardPool: "100000", participantCount: 892, endsAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) },
];

export default function Quests() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("quests");

  const { data: questsData } = useQuery<{ quests: typeof SAMPLE_QUESTS }>({
    queryKey: ['/api/quests'],
  });

  const { data: missionsData } = useQuery<{ missions: typeof SAMPLE_MISSIONS }>({
    queryKey: ['/api/quests/missions'],
  });

  const { data: userStats } = useQuery<{ xp: number; level: number; streak: number }>({
    queryKey: ['/api/user/quest-stats'],
    enabled: !!user,
  });

  const quests = questsData?.quests || SAMPLE_QUESTS;
  const missions = missionsData?.missions || SAMPLE_MISSIONS;

  const userXp = userStats?.xp || 2450;
  const currentLevel = userStats?.level || 12;
  const currentLevelXp = userXp % 500;
  const nextLevelXp = 500;
  const streakDays = userStats?.streak || 4;
  const currentTier = TIERS.find((t, i) => userXp >= t.minXp && (TIERS[i + 1] ? userXp < TIERS[i + 1].minXp : true)) || TIERS[0];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy": return "text-green-400 bg-green-500/20 border-green-500/30";
      case "medium": return "text-amber-400 bg-amber-500/20 border-amber-500/30";
      case "hard": return "text-red-400 bg-red-500/20 border-red-500/30";
      default: return "text-blue-400 bg-blue-500/20 border-blue-500/30";
    }
  };

  const formatTimeLeft = (date: Date) => {
    const diff = date.getTime() - Date.now();
    const days = Math.floor(diff / (24 * 60 * 60 * 1000));
    const hours = Math.floor((diff % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
    return `${days}d ${hours}h`;
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-background/90 backdrop-blur-xl">
        <div className="container mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <img src={orbitLogo} alt="DarkWave" className="w-7 h-7" />
            <span className="font-display font-bold text-lg tracking-tight hidden sm:inline">DarkWave</span>
          </Link>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="border-purple-500/50 text-purple-400 bg-purple-500/10 text-[10px] sm:text-xs">
              <Zap className="w-3 h-3 mr-1" /> {userXp.toLocaleString()} XP
            </Badge>
            <BackButton />
          </div>
        </div>
      </nav>

      <main className="pt-20 pb-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <GlassCard glow className="lg:col-span-2">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h1 className="text-2xl font-display font-bold">Quest & Rewards</h1>
                      <InfoButton 
                        title="How XP Works" 
                        content="Earn XP by completing quests and participating in the ecosystem. XP unlocks higher tiers with better rewards, fee discounts, and exclusive access." 
                        variant="help"
                        testId="button-info-xp"
                      />
                    </div>
                    <p className="text-sm text-muted-foreground">Complete quests to earn XP and climb the ranks</p>
                  </div>
                  {(() => {
                    const TierIcon = currentTier.icon;
                    return (
                      <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${currentTier.color} flex items-center justify-center`}>
                        <TierIcon className="w-7 h-7 text-white" />
                      </div>
                    );
                  })()}
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3 mb-4">
                  <div className="bg-[rgba(12,18,36,0.65)] backdrop-blur-xl border border-white/[0.08] rounded-xl p-3 text-center shadow-[0_0_20px_rgba(0,255,255,0.1)]">
                    <div className="text-xl sm:text-2xl font-bold text-primary tracking-tight">{currentLevel}</div>
                    <div className="text-[10px] text-muted-foreground uppercase">Level</div>
                  </div>
                  <div className="bg-[rgba(12,18,36,0.65)] backdrop-blur-xl border border-white/[0.08] rounded-xl p-3 text-center shadow-[0_0_20px_rgba(251,191,36,0.1)]">
                    <div className="text-xl sm:text-2xl font-bold text-amber-400 tracking-tight">{userXp.toLocaleString()}</div>
                    <div className="text-[10px] text-muted-foreground uppercase">Total XP</div>
                  </div>
                  <div className="bg-[rgba(12,18,36,0.65)] backdrop-blur-xl border border-white/[0.08] rounded-xl p-3 text-center shadow-[0_0_20px_rgba(168,85,247,0.1)]">
                    <div className="text-xl sm:text-2xl font-bold text-purple-400 tracking-tight truncate">{currentTier.name}</div>
                    <div className="text-[10px] text-muted-foreground uppercase">Tier</div>
                  </div>
                  <div className="bg-[rgba(12,18,36,0.65)] backdrop-blur-xl border border-white/[0.08] rounded-xl p-3 text-center shadow-[0_0_20px_rgba(251,146,60,0.1)]">
                    <div className="flex items-center justify-center gap-1">
                      <Flame className="w-4 sm:w-5 h-4 sm:h-5 text-orange-400" />
                      <span className="text-xl sm:text-2xl font-bold text-orange-400 tracking-tight">{streakDays}</span>
                    </div>
                    <div className="text-[10px] text-muted-foreground uppercase">Day Streak</div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Level {currentLevel} Progress</span>
                    <span className="text-white">{currentLevelXp} / {nextLevelXp} XP</span>
                  </div>
                  <Progress value={(currentLevelXp / nextLevelXp) * 100} className="h-2" />
                </div>
              </div>
            </GlassCard>

            <GlassCard glow>
              <div className="p-4 sm:p-6">
                <h3 className="text-base sm:text-lg font-bold mb-4 flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-amber-400 shrink-0" /> Tier Benefits
                </h3>
                <div className="space-y-3">
                  {TIERS.map((tier, i) => {
                    const TierItemIcon = tier.icon;
                    return (
                      <div 
                        key={tier.name}
                        className={`flex items-center gap-3 p-2 rounded-lg ${currentTier.name === tier.name ? 'bg-white/10 ring-1 ring-white/20' : 'opacity-60'}`}
                      >
                        <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${tier.color} flex items-center justify-center shrink-0`}>
                          <TierItemIcon className="w-4 h-4 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium">{tier.name}</div>
                          <div className="text-[10px] text-muted-foreground">{tier.minXp.toLocaleString()}+ XP</div>
                        </div>
                        {currentTier.name === tier.name && (
                          <Badge className="bg-primary/20 text-primary text-[10px]">Current</Badge>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </GlassCard>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4 sm:space-y-6">
            <TabsList className="bg-white/5 border border-white/10 w-full sm:w-auto flex-wrap" data-testid="tabs-quests">
              <TabsTrigger value="quests" className="data-[state=active]:bg-white/10 text-xs sm:text-sm flex-1 sm:flex-initial" data-testid="tab-quests">
                <Target className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1 sm:mr-2" /> Quests
              </TabsTrigger>
              <TabsTrigger value="missions" className="data-[state=active]:bg-white/10 text-xs sm:text-sm flex-1 sm:flex-initial" data-testid="tab-missions">
                <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1 sm:mr-2" /> Missions
              </TabsTrigger>
              <TabsTrigger value="leaderboard" className="data-[state=active]:bg-white/10 text-xs sm:text-sm flex-1 sm:flex-initial" data-testid="tab-leaderboard">
                <Trophy className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1 sm:mr-2" /> Ranks
              </TabsTrigger>
            </TabsList>

            <TabsContent value="quests">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {SAMPLE_QUESTS.map((quest) => (
                  <GlassCard key={quest.id} className={quest.completed ? "opacity-60" : ""} data-testid={`card-quest-${quest.id}`}>
                    <div className="p-5">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                            <Star className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <h4 className="font-bold text-sm flex items-center gap-2">
                              {quest.name}
                              {quest.completed && <CheckCircle2 className="w-4 h-4 text-green-400" />}
                            </h4>
                            <p className="text-xs text-muted-foreground">{quest.description}</p>
                          </div>
                        </div>
                        <Badge variant="outline" className={`${getDifficultyColor(quest.difficulty)} text-[10px]`}>
                          {quest.difficulty}
                        </Badge>
                      </div>

                      <div className="flex items-center gap-4 mb-3">
                        <div className="flex items-center gap-1">
                          <Zap className="w-3.5 h-3.5 text-purple-400" />
                          <span className="text-xs font-medium">{quest.xpReward} XP</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Gift className="w-3.5 h-3.5 text-amber-400" />
                          <span className="text-xs font-medium">{quest.tokenReward} DWC</span>
                        </div>
                      </div>

                      {!quest.completed && (
                        <div className="space-y-1.5">
                          <div className="flex justify-between text-xs">
                            <span className="text-muted-foreground">Progress</span>
                            <span>{quest.progress} / {quest.target}</span>
                          </div>
                          <Progress value={(quest.progress / quest.target) * 100} className="h-1.5" />
                        </div>
                      )}

                      {quest.completed && (
                        <Button size="sm" className="w-full mt-2" data-testid={`button-claim-${quest.id}`}>
                          Claim Rewards
                        </Button>
                      )}
                    </div>
                  </GlassCard>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="missions">
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-lg font-bold">Active Protocol Missions</h3>
                  <InfoButton 
                    title="Protocol Missions" 
                    content="Community-wide goals where everyone contributes and shares the reward pool. Complete the mission together to earn your share!" 
                    variant="tip"
                    testId="button-info-missions"
                  />
                </div>
                
                {SAMPLE_MISSIONS.map((mission) => (
                  <GlassCard key={mission.id} glow data-testid={`card-mission-${mission.id}`}>
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h4 className="font-bold text-lg mb-1">{mission.name}</h4>
                          <p className="text-sm text-muted-foreground">{mission.description}</p>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center gap-1 text-amber-400 mb-1">
                            <Gift className="w-4 h-4" />
                            <span className="font-bold">{parseInt(mission.rewardPool).toLocaleString()} DWC</span>
                          </div>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Clock className="w-3 h-3" />
                            <span>{formatTimeLeft(mission.endsAt)} left</span>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2 mb-4">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">{mission.goal}</span>
                          <span className="font-medium">{mission.currentProgress.toLocaleString()} / {mission.targetProgress.toLocaleString()}</span>
                        </div>
                        <Progress value={(mission.currentProgress / mission.targetProgress) * 100} className="h-3" />
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Trophy className="w-4 h-4" />
                          <span>{mission.participantCount.toLocaleString()} participants</span>
                        </div>
                        <Button size="sm" className="gap-1" data-testid={`button-join-mission-${mission.id}`}>
                          Contribute <ChevronRight className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </GlassCard>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="leaderboard">
              <GlassCard>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-bold flex items-center gap-2">
                      <Trophy className="w-5 h-5 text-amber-400" /> XP Leaderboard
                    </h3>
                    <Badge variant="outline" className="text-xs">Updated live</Badge>
                  </div>

                  <div className="space-y-3">
                    {[
                      { rank: 1, name: "CryptoKing.dwc", xp: 125400, tier: "Diamond" },
                      { rank: 2, name: "DeFiQueen", xp: 98200, tier: "Diamond" },
                      { rank: 3, name: "StakeBot", xp: 87650, tier: "Platinum" },
                      { rank: 4, name: "BridgeMaster", xp: 65300, tier: "Platinum" },
                      { rank: 5, name: "NFTCollector", xp: 54200, tier: "Gold" },
                    ].map((entry) => (
                      <div 
                        key={entry.rank}
                        className="flex items-center gap-4 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
                        data-testid={`row-leaderboard-${entry.rank}`}
                      >
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                          entry.rank === 1 ? 'bg-amber-500 text-black' :
                          entry.rank === 2 ? 'bg-gray-300 text-black' :
                          entry.rank === 3 ? 'bg-amber-700 text-white' :
                          'bg-white/10 text-white'
                        }`}>
                          {entry.rank}
                        </div>
                        <div className="flex-1">
                          <div className="font-medium text-sm">{entry.name}</div>
                          <div className="text-xs text-muted-foreground">{entry.tier}</div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-amber-400">{entry.xp.toLocaleString()}</div>
                          <div className="text-[10px] text-muted-foreground">XP</div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {user && (
                    <div className="mt-6 pt-4 border-t border-white/10">
                      <div className="flex items-center gap-4 p-3 rounded-xl bg-primary/10 ring-1 ring-primary/30">
                        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center font-bold text-sm text-primary">
                          --
                        </div>
                        <div className="flex-1">
                          <div className="font-medium text-sm">You</div>
                          <div className="text-xs text-muted-foreground">{currentTier.name}</div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-primary">{userXp.toLocaleString()}</div>
                          <div className="text-[10px] text-muted-foreground">XP</div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </GlassCard>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}
