import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocation, Link } from "wouter";
import { 
  Home, Users, ChevronRight, Sparkles, Crown, Shield, Compass,
  Trophy, Star, Zap, Gift, ArrowRight, Plus, Vote, Hammer, Package,
  FileText, CheckCircle, Clock, XCircle, TrendingUp, Award, Target
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GlassCard } from "@/components/glass-card";
import { toast } from "sonner";
import { getChroniclesSession } from "./chronicles-login";

interface BuilderProfile {
  id: string;
  userId: string;
  displayName: string;
  tier: number;
  xpLevel: number;
  xpCurrent: number;
  xpToNextLevel: number;
  reputationScore: number;
  totalContributions: number;
  approvedContributions: number;
  shellsEarned: number;
  dwcEarned: string;
  badges: string[];
  upvotesReceived: number;
  downvotesReceived: number;
  canReviewContent: boolean;
}

interface TierInfo {
  tier: number;
  name: string;
  requiredXP: number;
  requiredApprovals: number;
  requiredReputation: number;
  rewardMultiplier: string;
  canReviewContent: boolean;
  permittedTypes: string[];
}

interface ContributionType {
  code: string;
  name: string;
  description: string;
  baseShellReward: number;
  xpReward: number;
  minTierRequired: number;
  icon: string;
}

interface Contribution {
  id: string;
  title: string;
  description: string;
  contributionTypeCode: string;
  status: string;
  upvotes: number;
  downvotes: number;
  qualityRating: string | null;
  shellsRewarded: number;
  dwcRewarded: string;
  xpRewarded: number;
  createdAt: string;
}

const TIER_ICONS: Record<number, typeof Compass> = {
  1: Compass,
  2: Hammer,
  3: Shield,
  4: Crown,
};

const TIER_COLORS: Record<number, string> = {
  1: "from-blue-400 to-cyan-400",
  2: "from-green-400 to-emerald-400",
  3: "from-purple-400 to-violet-400",
  4: "from-yellow-400 to-amber-400",
};

const STATUS_BADGES: Record<string, { color: string; icon: typeof Clock }> = {
  draft: { color: "bg-gray-500/20 text-gray-400", icon: FileText },
  submitted: { color: "bg-blue-500/20 text-blue-400", icon: Clock },
  under_review: { color: "bg-purple-500/20 text-purple-400", icon: Vote },
  approved: { color: "bg-green-500/20 text-green-400", icon: CheckCircle },
  rejected: { color: "bg-red-500/20 text-red-400", icon: XCircle },
  live: { color: "bg-cyan-500/20 text-cyan-400", icon: Sparkles },
};

export default function ChroniclesBuilder() {
  const [, setLocation] = useLocation();
  const [authLoading, setAuthLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const queryClient = useQueryClient();

  useEffect(() => {
    const session = getChroniclesSession();
    if (!session) {
      setLocation("/chronicles/login");
      return;
    }
    fetch("/api/chronicles/auth/session", {
      headers: { Authorization: `Bearer ${session.token}` }
    })
      .then(res => res.json())
      .then(data => {
        if (!data.authenticated) {
          setLocation("/chronicles/login");
        }
        setAuthLoading(false);
      })
      .catch(() => {
        setLocation("/chronicles/login");
        setAuthLoading(false);
      });
  }, [setLocation]);

  const { data: builderData, isLoading: builderLoading } = useQuery({
    queryKey: ["/api/builder/profile"],
    queryFn: async () => {
      const session = getChroniclesSession();
      const res = await fetch("/api/builder/profile", {
        headers: { Authorization: `Bearer ${session?.token}` }
      });
      return res.json();
    },
    enabled: !authLoading,
  });

  const { data: tiersData } = useQuery({
    queryKey: ["/api/builder/tiers"],
    queryFn: async () => {
      const res = await fetch("/api/builder/tiers");
      return res.json();
    },
  });

  const { data: typesData } = useQuery({
    queryKey: ["/api/builder/contribution-types"],
    queryFn: async () => {
      const session = getChroniclesSession();
      const res = await fetch("/api/builder/contribution-types", {
        headers: { Authorization: `Bearer ${session?.token}` }
      });
      return res.json();
    },
    enabled: !authLoading,
  });

  const { data: contributionsData } = useQuery({
    queryKey: ["/api/builder/contributions"],
    queryFn: async () => {
      const session = getChroniclesSession();
      const res = await fetch("/api/builder/contributions", {
        headers: { Authorization: `Bearer ${session?.token}` }
      });
      return res.json();
    },
    enabled: !authLoading,
  });

  const { data: leaderboardData } = useQuery({
    queryKey: ["/api/builder/leaderboard"],
    queryFn: async () => {
      const res = await fetch("/api/builder/leaderboard?limit=10");
      return res.json();
    },
  });

  const { data: badgesData } = useQuery({
    queryKey: ["/api/builder/badges"],
    queryFn: async () => {
      const res = await fetch("/api/builder/badges");
      return res.json();
    },
  });

  const builder = builderData?.builder as BuilderProfile | undefined;
  const currentTier = builderData?.currentTier as TierInfo | undefined;
  const nextTier = builderData?.nextTier as TierInfo | undefined;
  const tiers = tiersData?.tiers as TierInfo[] || [];
  const types = typesData?.types as ContributionType[] || [];
  const contributions = contributionsData?.contributions as Contribution[] || [];
  const leaderboard = leaderboardData?.leaderboard || [];
  const badges = badgesData?.badges || [];

  const TierIcon = builder ? TIER_ICONS[builder.tier] || Compass : Compass;
  const tierColor = builder ? TIER_COLORS[builder.tier] || TIER_COLORS[1] : TIER_COLORS[1];

  if (authLoading || builderLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
        >
          <Sparkles className="w-12 h-12 text-cyan-400" />
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white overflow-hidden relative">
      <div className="absolute top-20 left-10 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-40 right-20 w-[400px] h-[400px] bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
      <div className="absolute top-1/2 left-1/2 w-[300px] h-[300px] bg-pink-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "2s" }} />

      <div className="container mx-auto px-4 py-8 relative z-10">
        <div className="flex items-center gap-2 text-sm text-gray-400 mb-6">
          <Link href="/chronicles" className="hover:text-cyan-400 transition-colors" data-testid="link-chronicles-home">
            Chronicles
          </Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-cyan-400">Community Builder</span>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
            Community Builder Program
          </h1>
          <p className="text-gray-400 text-lg">
            Create content, earn rewards, and shape the Chronicles universe
          </p>
        </motion.div>

        {builder && (
          <GlassCard glow className="mb-8 p-6">
            <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
              <div className="flex items-center gap-4">
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 10 }}
                  className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${tierColor} flex items-center justify-center shadow-[0_0_30px_rgba(0,255,255,0.3)]`}
                >
                  <TierIcon className="w-10 h-10 text-white" />
                </motion.div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h2 className="text-2xl font-bold">{builder.displayName}</h2>
                    <Badge className={`bg-gradient-to-r ${tierColor} text-white border-0`}>
                      {currentTier?.name || "Explorer"}
                    </Badge>
                  </div>
                  <p className="text-gray-400">
                    Level {builder.xpLevel} Builder
                  </p>
                </div>
              </div>

              <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-3 rounded-lg bg-white/5">
                  <div className="text-2xl font-bold text-cyan-400" data-testid="text-total-contributions">
                    {builder.totalContributions}
                  </div>
                  <div className="text-xs text-gray-400">Contributions</div>
                </div>
                <div className="text-center p-3 rounded-lg bg-white/5">
                  <div className="text-2xl font-bold text-green-400" data-testid="text-approved-contributions">
                    {builder.approvedContributions}
                  </div>
                  <div className="text-xs text-gray-400">Approved</div>
                </div>
                <div className="text-center p-3 rounded-lg bg-white/5">
                  <div className="text-2xl font-bold text-purple-400" data-testid="text-reputation">
                    {builder.reputationScore}
                  </div>
                  <div className="text-xs text-gray-400">Reputation</div>
                </div>
                <div className="text-center p-3 rounded-lg bg-white/5">
                  <div className="text-2xl font-bold text-yellow-400" data-testid="text-shells-earned">
                    {builder.shellsEarned.toLocaleString()}
                  </div>
                  <div className="text-xs text-gray-400">Shells Earned</div>
                </div>
              </div>
            </div>

            {nextTier && (
              <div className="mt-6 pt-6 border-t border-white/10">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-400">
                    Progress to {nextTier.name}
                  </span>
                  <span className="text-sm text-cyan-400">
                    {builder.xpCurrent} / {builder.xpToNextLevel} XP
                  </span>
                </div>
                <Progress 
                  value={(builder.xpCurrent / builder.xpToNextLevel) * 100} 
                  className="h-2 bg-white/10"
                />
              </div>
            )}
          </GlassCard>
        )}

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="bg-white/5 border border-white/10 p-1 rounded-xl">
            <TabsTrigger 
              value="overview" 
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500/20 data-[state=active]:to-purple-500/20 rounded-lg"
              data-testid="tab-overview"
            >
              Overview
            </TabsTrigger>
            <TabsTrigger 
              value="contributions" 
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500/20 data-[state=active]:to-purple-500/20 rounded-lg"
              data-testid="tab-contributions"
            >
              My Contributions
            </TabsTrigger>
            <TabsTrigger 
              value="types" 
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500/20 data-[state=active]:to-purple-500/20 rounded-lg"
              data-testid="tab-types"
            >
              Content Types
            </TabsTrigger>
            <TabsTrigger 
              value="leaderboard" 
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500/20 data-[state=active]:to-purple-500/20 rounded-lg"
              data-testid="tab-leaderboard"
            >
              Leaderboard
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <GlassCard glow className="p-6">
                  <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <Trophy className="w-5 h-5 text-yellow-400" />
                    Builder Tiers
                  </h3>
                  <div className="space-y-4">
                    {tiers.map((tier, index) => {
                      const Icon = TIER_ICONS[tier.tier] || Compass;
                      const color = TIER_COLORS[tier.tier] || TIER_COLORS[1];
                      const isCurrentTier = builder?.tier === tier.tier;
                      const isUnlocked = builder ? builder.tier >= tier.tier : false;

                      return (
                        <motion.div
                          key={tier.tier}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className={`p-4 rounded-xl border transition-all ${
                            isCurrentTier
                              ? `bg-gradient-to-r ${color} bg-opacity-20 border-white/20 shadow-[0_0_20px_rgba(0,255,255,0.2)]`
                              : isUnlocked
                                ? "bg-white/5 border-white/10"
                                : "bg-white/[0.02] border-white/5 opacity-60"
                          }`}
                        >
                          <div className="flex items-center gap-4">
                            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center`}>
                              <Icon className="w-6 h-6 text-white" />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <h4 className="font-bold">{tier.name}</h4>
                                {isCurrentTier && (
                                  <Badge className="bg-cyan-500/20 text-cyan-400 border-cyan-500/30">
                                    Current
                                  </Badge>
                                )}
                              </div>
                              <div className="text-sm text-gray-400">
                                {tier.requiredXP} XP required • {tier.rewardMultiplier}x rewards
                              </div>
                            </div>
                            {tier.canReviewContent && (
                              <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">
                                Can Review
                              </Badge>
                            )}
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </GlassCard>

                <GlassCard glow className="p-6">
                  <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <Package className="w-5 h-5 text-cyan-400" />
                    Available Content Types
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {types.slice(0, 4).map((type, index) => (
                      <motion.div
                        key={type.code}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="p-4 rounded-xl bg-white/5 border border-white/10 hover:border-cyan-500/30 transition-all cursor-pointer"
                      >
                        <div className="flex items-center gap-3 mb-2">
                          <div className="text-2xl">{type.icon}</div>
                          <h4 className="font-bold">{type.name}</h4>
                        </div>
                        <p className="text-sm text-gray-400 mb-3 line-clamp-2">{type.description}</p>
                        <div className="flex items-center gap-3 text-xs">
                          <span className="text-yellow-400">{type.baseShellReward} Shells</span>
                          <span className="text-purple-400">{type.xpReward} XP</span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </GlassCard>
              </div>

              <div className="space-y-6">
                <GlassCard glow className="p-6">
                  <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <Star className="w-5 h-5 text-yellow-400" />
                    Top Builders
                  </h3>
                  <div className="space-y-3">
                    {leaderboard.slice(0, 5).map((entry: any, index: number) => (
                      <div
                        key={entry.id}
                        className="flex items-center gap-3 p-2 rounded-lg bg-white/5"
                      >
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                          index === 0 ? "bg-yellow-500/20 text-yellow-400" :
                          index === 1 ? "bg-gray-400/20 text-gray-300" :
                          index === 2 ? "bg-orange-500/20 text-orange-400" :
                          "bg-white/10 text-gray-400"
                        }`}>
                          {index + 1}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium truncate">{entry.displayName}</div>
                          <div className="text-xs text-gray-400">{entry.approvedContributions} approved</div>
                        </div>
                        <div className="text-sm text-cyan-400">
                          {entry.reputationScore} rep
                        </div>
                      </div>
                    ))}
                  </div>
                </GlassCard>

                <GlassCard glow className="p-6">
                  <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <Award className="w-5 h-5 text-purple-400" />
                    Badges
                  </h3>
                  <div className="grid grid-cols-3 gap-2">
                    {badges.slice(0, 6).map((badge: any) => {
                      const hasBadge = builder?.badges?.includes(badge.code);
                      return (
                        <motion.div
                          key={badge.code}
                          whileHover={{ scale: 1.1 }}
                          className={`aspect-square rounded-xl flex flex-col items-center justify-center text-center p-2 ${
                            hasBadge
                              ? "bg-gradient-to-br from-cyan-500/20 to-purple-500/20 border border-cyan-500/30"
                              : "bg-white/5 border border-white/10 opacity-40"
                          }`}
                          title={badge.name}
                        >
                          <span className="text-2xl mb-1">{badge.icon}</span>
                          <span className="text-[10px] text-gray-400 line-clamp-1">{badge.name}</span>
                        </motion.div>
                      );
                    })}
                  </div>
                </GlassCard>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="contributions" className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold">My Contributions</h3>
              <Button 
                className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-400 hover:to-purple-400"
                data-testid="button-new-contribution"
              >
                <Plus className="w-4 h-4 mr-2" />
                New Contribution
              </Button>
            </div>

            {contributions.length === 0 ? (
              <GlassCard glow className="p-12 text-center">
                <Package className="w-16 h-16 mx-auto mb-4 text-gray-500" />
                <h4 className="text-xl font-bold mb-2">No contributions yet</h4>
                <p className="text-gray-400 mb-6">
                  Start creating content to earn Shells and XP!
                </p>
                <Button className="bg-gradient-to-r from-cyan-500 to-purple-500">
                  Create Your First Contribution
                </Button>
              </GlassCard>
            ) : (
              <div className="space-y-4">
                {contributions.map((contrib, index) => {
                  const statusInfo = STATUS_BADGES[contrib.status] || STATUS_BADGES.draft;
                  const StatusIcon = statusInfo.icon;

                  return (
                    <motion.div
                      key={contrib.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <GlassCard className="p-4 hover:border-cyan-500/30 transition-all cursor-pointer">
                        <div className="flex items-start gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-bold">{contrib.title}</h4>
                              <Badge className={statusInfo.color}>
                                <StatusIcon className="w-3 h-3 mr-1" />
                                {contrib.status.replace("_", " ")}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-400 line-clamp-2 mb-2">
                              {contrib.description}
                            </p>
                            <div className="flex items-center gap-4 text-xs text-gray-500">
                              <span className="capitalize">{contrib.contributionTypeCode}</span>
                              <span>
                                <TrendingUp className="w-3 h-3 inline mr-1" />
                                {contrib.upvotes} / {contrib.downvotes}
                              </span>
                              {contrib.shellsRewarded > 0 && (
                                <span className="text-yellow-400">
                                  +{contrib.shellsRewarded} Shells
                                </span>
                              )}
                            </div>
                          </div>
                          <ChevronRight className="w-5 h-5 text-gray-500" />
                        </div>
                      </GlassCard>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </TabsContent>

          <TabsContent value="types" className="space-y-6">
            <h3 className="text-xl font-bold">Content Types You Can Create</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {types.map((type, index) => (
                <motion.div
                  key={type.code}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <GlassCard glow className="p-6 h-full hover:border-cyan-500/30 transition-all cursor-pointer">
                    <div className="text-4xl mb-4">{type.icon}</div>
                    <h4 className="text-xl font-bold mb-2">{type.name}</h4>
                    <p className="text-sm text-gray-400 mb-4">{type.description}</p>
                    <div className="flex items-center justify-between pt-4 border-t border-white/10">
                      <div>
                        <div className="text-yellow-400 font-bold">{type.baseShellReward} Shells</div>
                        <div className="text-xs text-gray-500">Base reward</div>
                      </div>
                      <div className="text-right">
                        <div className="text-purple-400 font-bold">{type.xpReward} XP</div>
                        <div className="text-xs text-gray-500">Experience</div>
                      </div>
                    </div>
                  </GlassCard>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="leaderboard" className="space-y-6">
            <h3 className="text-xl font-bold">Builder Leaderboard</h3>
            <GlassCard glow className="p-6">
              <div className="space-y-3">
                {leaderboard.map((entry: any, index: number) => {
                  const Icon = TIER_ICONS[entry.tier] || Compass;
                  const color = TIER_COLORS[entry.tier] || TIER_COLORS[1];

                  return (
                    <motion.div
                      key={entry.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className={`flex items-center gap-4 p-4 rounded-xl ${
                        index < 3 ? "bg-white/5" : "bg-white/[0.02]"
                      } border border-white/10`}
                    >
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold ${
                        index === 0 ? "bg-gradient-to-br from-yellow-400 to-amber-500 text-black" :
                        index === 1 ? "bg-gradient-to-br from-gray-300 to-gray-400 text-black" :
                        index === 2 ? "bg-gradient-to-br from-orange-400 to-orange-500 text-black" :
                        "bg-white/10 text-gray-400"
                      }`}>
                        {index + 1}
                      </div>
                      <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${color} flex items-center justify-center`}>
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="font-bold">{entry.displayName}</div>
                        <div className="text-sm text-gray-400">
                          Level {entry.xpLevel} • {entry.approvedContributions} approved
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-cyan-400 font-bold">{entry.reputationScore}</div>
                        <div className="text-xs text-gray-500">reputation</div>
                      </div>
                      <div className="text-right">
                        <div className="text-yellow-400 font-bold">{entry.shellsEarned.toLocaleString()}</div>
                        <div className="text-xs text-gray-500">shells earned</div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </GlassCard>
          </TabsContent>
        </Tabs>

        <div className="mt-8 pt-8 border-t border-white/10">
          <Link href="/chronicles" className="inline-flex items-center text-gray-400 hover:text-cyan-400 transition-colors">
            <ArrowRight className="w-4 h-4 mr-2 rotate-180" />
            Back to Chronicles Hub
          </Link>
        </div>
      </div>
    </div>
  );
}
