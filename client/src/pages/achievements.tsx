import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "wouter";
import {
  ArrowLeft, Trophy, Star, Zap, Target, TrendingUp, Users,
  Coins, Flame, Gift, Lock, CheckCircle2, Sparkles
} from "lucide-react";
import { Footer } from "@/components/footer";
import { GlassCard } from "@/components/glass-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import darkwaveLogo from "@assets/generated_images/darkwave_token_transparent.png";

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  category: string;
  rarity: "common" | "rare" | "epic" | "legendary";
  progress: number;
  maxProgress: number;
  unlocked: boolean;
  reward: string;
  unlockedAt?: string;
}

const ACHIEVEMENTS: Achievement[] = [
  {
    id: "first_stake",
    name: "Staking Pioneer",
    description: "Stake DWC for the first time",
    icon: <Coins className="w-6 h-6" />,
    category: "Staking",
    rarity: "common",
    progress: 1,
    maxProgress: 1,
    unlocked: true,
    reward: "100 DWC",
    unlockedAt: "Dec 20, 2024",
  },
  {
    id: "diamond_hands",
    name: "Diamond Hands",
    description: "Hold DWC for 30 days without selling",
    icon: <Star className="w-6 h-6" />,
    category: "Holding",
    rarity: "epic",
    progress: 24,
    maxProgress: 30,
    unlocked: false,
    reward: "1,000 DWC + NFT Badge",
  },
  {
    id: "whale_status",
    name: "Whale Status",
    description: "Hold over 100,000 DWC",
    icon: <Target className="w-6 h-6" />,
    category: "Holding",
    rarity: "legendary",
    progress: 45000,
    maxProgress: 100000,
    unlocked: false,
    reward: "5,000 DWC + Exclusive NFT",
  },
  {
    id: "first_trade",
    name: "First Trade",
    description: "Complete your first swap on the DEX",
    icon: <TrendingUp className="w-6 h-6" />,
    category: "Trading",
    rarity: "common",
    progress: 1,
    maxProgress: 1,
    unlocked: true,
    reward: "50 DWC",
    unlockedAt: "Dec 18, 2024",
  },
  {
    id: "trading_pro",
    name: "Trading Pro",
    description: "Complete 100 trades on the DEX",
    icon: <Zap className="w-6 h-6" />,
    category: "Trading",
    rarity: "rare",
    progress: 67,
    maxProgress: 100,
    unlocked: false,
    reward: "500 DWC",
  },
  {
    id: "social_butterfly",
    name: "Social Butterfly",
    description: "Get 100 likes on your posts",
    icon: <Users className="w-6 h-6" />,
    category: "Social",
    rarity: "rare",
    progress: 42,
    maxProgress: 100,
    unlocked: false,
    reward: "250 DWC",
  },
  {
    id: "arcade_master",
    name: "Arcade Master",
    description: "Win 10,000 DWC in the arcade",
    icon: <Flame className="w-6 h-6" />,
    category: "Gaming",
    rarity: "epic",
    progress: 7500,
    maxProgress: 10000,
    unlocked: false,
    reward: "1,000 DWC + VIP Access",
  },
  {
    id: "referral_king",
    name: "Referral King",
    description: "Refer 50 users to DarkWave",
    icon: <Gift className="w-6 h-6" />,
    category: "Referrals",
    rarity: "legendary",
    progress: 12,
    maxProgress: 50,
    unlocked: false,
    reward: "10,000 DWC + Genesis NFT",
  },
];

const RARITY_COLORS = {
  common: { bg: "from-gray-500/20 to-gray-600/20", border: "border-gray-500/30", text: "text-gray-400" },
  rare: { bg: "from-blue-500/20 to-cyan-500/20", border: "border-blue-500/30", text: "text-blue-400" },
  epic: { bg: "from-purple-500/20 to-pink-500/20", border: "border-purple-500/30", text: "text-purple-400" },
  legendary: { bg: "from-amber-500/20 to-orange-500/20", border: "border-amber-500/30", text: "text-amber-400" },
};

function AchievementCard({ achievement }: { achievement: Achievement }) {
  const rarity = RARITY_COLORS[achievement.rarity];
  const progressPercent = (achievement.progress / achievement.maxProgress) * 100;

  return (
    <GlassCard 
      className={`p-4 ${achievement.unlocked ? "" : "opacity-80"} border ${rarity.border}`}
      glow={achievement.unlocked}
    >
      <div className="flex gap-4">
        <motion.div 
          className={`w-14 h-14 rounded-xl bg-gradient-to-br ${rarity.bg} flex items-center justify-center ${rarity.text} shrink-0`}
          animate={achievement.unlocked ? { scale: [1, 1.05, 1] } : {}}
          transition={{ duration: 2, repeat: Infinity }}
        >
          {achievement.unlocked ? achievement.icon : <Lock className="w-6 h-6" />}
        </motion.div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-bold text-sm">{achievement.name}</h3>
            <Badge className={`${rarity.bg} ${rarity.text} text-[9px]`}>
              {achievement.rarity.toUpperCase()}
            </Badge>
            {achievement.unlocked && (
              <CheckCircle2 className="w-4 h-4 text-green-400" />
            )}
          </div>
          <p className="text-xs text-muted-foreground mb-2">{achievement.description}</p>
          
          {!achievement.unlocked && (
            <div className="mb-2">
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-muted-foreground">Progress</span>
                <span className="font-mono">{achievement.progress.toLocaleString()} / {achievement.maxProgress.toLocaleString()}</span>
              </div>
              <Progress value={progressPercent} className="h-2" />
            </div>
          )}
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1 text-xs">
              <Gift className="w-3 h-3 text-amber-400" />
              <span className="text-amber-400">{achievement.reward}</span>
            </div>
            {achievement.unlockedAt && (
              <span className="text-[10px] text-muted-foreground">Unlocked {achievement.unlockedAt}</span>
            )}
          </div>
        </div>
      </div>
    </GlassCard>
  );
}

export default function Achievements() {
  const unlockedCount = ACHIEVEMENTS.filter(a => a.unlocked).length;
  const totalRewards = ACHIEVEMENTS.filter(a => a.unlocked).length * 100;

  return (
    <div className="min-h-screen flex flex-col bg-background overflow-x-hidden">
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-background/90 backdrop-blur-xl">
        <div className="container mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <img src={darkwaveLogo} alt="DarkWave" className="w-7 h-7" />
            <span className="font-display font-bold text-lg tracking-tight hidden sm:inline">DarkWave</span>
          </Link>
          <Link href="/dashboard-pro">
            <Button variant="ghost" size="sm" className="h-8 text-xs">
              <ArrowLeft className="w-3 h-3 mr-1" />
              Dashboard
            </Button>
          </Link>
        </div>
      </nav>

      <main className="flex-1 pt-16 pb-8 px-4">
        <div className="container mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-6"
          >
            <div className="flex items-center justify-center gap-2 mb-3">
              <motion.div 
                className="p-3 rounded-2xl bg-gradient-to-br from-amber-500/20 to-yellow-500/20 border border-amber-500/30"
                animate={{ 
                  boxShadow: ["0 0 20px rgba(245,158,11,0.2)", "0 0 50px rgba(245,158,11,0.4)", "0 0 20px rgba(245,158,11,0.2)"],
                  rotate: [0, 5, -5, 0]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Trophy className="w-7 h-7 text-amber-400" />
              </motion.div>
            </div>
            <h1 className="text-2xl md:text-3xl font-display font-bold mb-2">
              <span className="text-amber-400">Achievements</span>
            </h1>
            <p className="text-sm text-muted-foreground">
              Complete challenges • Earn rewards • Collect NFT badges
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
            <GlassCard hover={false} className="p-3 text-center">
              <Trophy className="w-5 h-5 mx-auto mb-1 text-amber-400" />
              <p className="text-xl font-bold">{unlockedCount}/{ACHIEVEMENTS.length}</p>
              <p className="text-[10px] text-muted-foreground">Unlocked</p>
            </GlassCard>
            <GlassCard hover={false} className="p-3 text-center">
              <Coins className="w-5 h-5 mx-auto mb-1 text-green-400" />
              <p className="text-xl font-bold">{totalRewards}</p>
              <p className="text-[10px] text-muted-foreground">DWC Earned</p>
            </GlassCard>
            <GlassCard hover={false} className="p-3 text-center">
              <Sparkles className="w-5 h-5 mx-auto mb-1 text-purple-400" />
              <p className="text-xl font-bold">2</p>
              <p className="text-[10px] text-muted-foreground">NFTs Earned</p>
            </GlassCard>
            <GlassCard hover={false} className="p-3 text-center">
              <Star className="w-5 h-5 mx-auto mb-1 text-blue-400" />
              <p className="text-xl font-bold">Level 5</p>
              <p className="text-[10px] text-muted-foreground">Rank</p>
            </GlassCard>
          </div>

          <Tabs defaultValue="all">
            <TabsList className="w-full grid grid-cols-5 mb-4">
              <TabsTrigger value="all" data-testid="tab-all">All</TabsTrigger>
              <TabsTrigger value="trading" data-testid="tab-trading">Trading</TabsTrigger>
              <TabsTrigger value="staking" data-testid="tab-staking">Staking</TabsTrigger>
              <TabsTrigger value="social" data-testid="tab-social">Social</TabsTrigger>
              <TabsTrigger value="gaming" data-testid="tab-gaming">Gaming</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-3">
              {ACHIEVEMENTS.map((achievement, i) => (
                <motion.div
                  key={achievement.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <AchievementCard achievement={achievement} />
                </motion.div>
              ))}
            </TabsContent>

            <TabsContent value="trading" className="space-y-3">
              {ACHIEVEMENTS.filter(a => a.category === "Trading").map((achievement, i) => (
                <motion.div
                  key={achievement.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <AchievementCard achievement={achievement} />
                </motion.div>
              ))}
            </TabsContent>

            <TabsContent value="staking" className="space-y-3">
              {ACHIEVEMENTS.filter(a => a.category === "Staking" || a.category === "Holding").map((achievement, i) => (
                <motion.div
                  key={achievement.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <AchievementCard achievement={achievement} />
                </motion.div>
              ))}
            </TabsContent>

            <TabsContent value="social" className="space-y-3">
              {ACHIEVEMENTS.filter(a => a.category === "Social" || a.category === "Referrals").map((achievement, i) => (
                <motion.div
                  key={achievement.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <AchievementCard achievement={achievement} />
                </motion.div>
              ))}
            </TabsContent>

            <TabsContent value="gaming" className="space-y-3">
              {ACHIEVEMENTS.filter(a => a.category === "Gaming").map((achievement, i) => (
                <motion.div
                  key={achievement.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <AchievementCard achievement={achievement} />
                </motion.div>
              ))}
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />
    </div>
  );
}
