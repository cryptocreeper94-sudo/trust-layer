import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "wouter";
import {
  ArrowLeft, Trophy, Star, Zap, Target, TrendingUp, Users,
  Coins, Flame, Gift, Lock, CheckCircle2, Sparkles, Wallet
} from "lucide-react";
import { Footer } from "@/components/footer";
import { GlassCard } from "@/components/glass-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import darkwaveLogo from "@assets/generated_images/darkwave_token_transparent.png";
import { useAuth } from "@/hooks/use-auth";

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  category: string;
  rarity: "common" | "rare" | "epic" | "legendary";
  requirement: string;
  reward: string;
}

const ALL_ACHIEVEMENTS: Achievement[] = [
  {
    id: "first_stake",
    name: "Staking Pioneer",
    description: "Stake DWC for the first time",
    icon: <Coins className="w-6 h-6" />,
    category: "Staking",
    rarity: "common",
    requirement: "Stake any amount of DWC",
    reward: "100 DWC",
  },
  {
    id: "diamond_hands",
    name: "Diamond Hands",
    description: "Hold DWC for 30 days without selling",
    icon: <Star className="w-6 h-6" />,
    category: "Holding",
    rarity: "epic",
    requirement: "Hold DWC for 30 consecutive days",
    reward: "1,000 DWC + NFT Badge",
  },
  {
    id: "whale_status",
    name: "Whale Status",
    description: "Hold over 100,000 DWC",
    icon: <Target className="w-6 h-6" />,
    category: "Holding",
    rarity: "legendary",
    requirement: "Accumulate 100,000 DWC",
    reward: "5,000 DWC + Exclusive NFT",
  },
  {
    id: "first_trade",
    name: "First Trade",
    description: "Complete your first swap on the DEX",
    icon: <TrendingUp className="w-6 h-6" />,
    category: "Trading",
    rarity: "common",
    requirement: "Execute 1 swap",
    reward: "50 DWC",
  },
  {
    id: "trading_pro",
    name: "Trading Pro",
    description: "Complete 100 trades on the DEX",
    icon: <Zap className="w-6 h-6" />,
    category: "Trading",
    rarity: "rare",
    requirement: "Execute 100 swaps",
    reward: "500 DWC",
  },
  {
    id: "social_butterfly",
    name: "Social Butterfly",
    description: "Get 100 likes on your posts",
    icon: <Users className="w-6 h-6" />,
    category: "Social",
    rarity: "rare",
    requirement: "Receive 100 total likes",
    reward: "250 DWC",
  },
  {
    id: "arcade_master",
    name: "Arcade Master",
    description: "Win 10,000 DWC in the arcade",
    icon: <Flame className="w-6 h-6" />,
    category: "Gaming",
    rarity: "epic",
    requirement: "Accumulate 10,000 DWC in winnings",
    reward: "1,000 DWC + VIP Access",
  },
  {
    id: "referral_king",
    name: "Referral King",
    description: "Refer 50 users to DarkWave",
    icon: <Gift className="w-6 h-6" />,
    category: "Referrals",
    rarity: "legendary",
    requirement: "Successfully refer 50 users",
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

  return (
    <GlassCard className={`p-4 opacity-70 border ${rarity.border}`}>
      <div className="flex gap-4">
        <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${rarity.bg} flex items-center justify-center text-muted-foreground shrink-0`}>
          <Lock className="w-6 h-6" />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-bold text-sm">{achievement.name}</h3>
            <Badge className={`${rarity.bg} ${rarity.text} text-[9px]`}>
              {achievement.rarity.toUpperCase()}
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground mb-2">{achievement.description}</p>
          
          <div className="mb-2 p-2 rounded-lg bg-white/5">
            <p className="text-[10px] text-muted-foreground">
              <span className="font-medium text-white">Requirement:</span> {achievement.requirement}
            </p>
          </div>
          
          <div className="flex items-center gap-1 text-xs">
            <Gift className="w-3 h-3 text-amber-400" />
            <span className="text-amber-400">{achievement.reward}</span>
          </div>
        </div>
      </div>
    </GlassCard>
  );
}

export default function Achievements() {
  const { user } = useAuth();
  const isConnected = !!user;

  if (!isConnected) {
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

        <main className="flex-1 pt-16 pb-8 px-4 flex items-center justify-center">
          <GlassCard glow className="p-8 text-center max-w-md">
            <Trophy className="w-16 h-16 mx-auto mb-4 text-amber-400" />
            <h2 className="text-2xl font-bold mb-2">Achievements</h2>
            <p className="text-muted-foreground mb-6">
              Complete challenges, earn rewards, and collect exclusive NFT badges as you use DarkWave.
            </p>
            <Link href="/wallet">
              <Button className="bg-gradient-to-r from-amber-500 to-orange-500" data-testid="button-connect-achievements">
                <Wallet className="w-4 h-4 mr-2" />
                Connect Wallet to Track Progress
              </Button>
            </Link>
          </GlassCard>
        </main>

        <Footer />
      </div>
    );
  }

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
              <p className="text-xl font-bold">0/{ALL_ACHIEVEMENTS.length}</p>
              <p className="text-[10px] text-muted-foreground">Unlocked</p>
            </GlassCard>
            <GlassCard hover={false} className="p-3 text-center">
              <Coins className="w-5 h-5 mx-auto mb-1 text-muted-foreground" />
              <p className="text-xl font-bold">0</p>
              <p className="text-[10px] text-muted-foreground">DWC Earned</p>
            </GlassCard>
            <GlassCard hover={false} className="p-3 text-center">
              <Sparkles className="w-5 h-5 mx-auto mb-1 text-muted-foreground" />
              <p className="text-xl font-bold">0</p>
              <p className="text-[10px] text-muted-foreground">NFTs Earned</p>
            </GlassCard>
            <GlassCard hover={false} className="p-3 text-center">
              <Star className="w-5 h-5 mx-auto mb-1 text-muted-foreground" />
              <p className="text-xl font-bold">Level 1</p>
              <p className="text-[10px] text-muted-foreground">Rank</p>
            </GlassCard>
          </div>

          <GlassCard className="p-4 mb-6 text-center bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-purple-500/20">
            <Sparkles className="w-8 h-8 mx-auto mb-2 text-purple-400" />
            <h3 className="font-bold mb-1">Start Your Journey</h3>
            <p className="text-sm text-muted-foreground">
              Use DarkWave features to unlock achievements and earn rewards. 
              Each achievement you unlock gives you DWC and exclusive NFT badges!
            </p>
          </GlassCard>

          <Tabs defaultValue="all">
            <TabsList className="w-full grid grid-cols-5 mb-4">
              <TabsTrigger value="all" data-testid="tab-all">All</TabsTrigger>
              <TabsTrigger value="trading" data-testid="tab-trading">Trading</TabsTrigger>
              <TabsTrigger value="staking" data-testid="tab-staking">Staking</TabsTrigger>
              <TabsTrigger value="social" data-testid="tab-social">Social</TabsTrigger>
              <TabsTrigger value="gaming" data-testid="tab-gaming">Gaming</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-3">
              {ALL_ACHIEVEMENTS.map((achievement, i) => (
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
              {ALL_ACHIEVEMENTS.filter(a => a.category === "Trading").map((achievement, i) => (
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
              {ALL_ACHIEVEMENTS.filter(a => a.category === "Staking" || a.category === "Holding").map((achievement, i) => (
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
              {ALL_ACHIEVEMENTS.filter(a => a.category === "Social" || a.category === "Referrals").map((achievement, i) => (
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
              {ALL_ACHIEVEMENTS.filter(a => a.category === "Gaming").map((achievement, i) => (
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
