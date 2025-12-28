import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "wouter";
import {
  ArrowLeft, User, Trophy, Star, TrendingUp, Activity, Wallet,
  Copy, ExternalLink, Shield, Award, Flame, Target, Medal,
  Share2, Settings, Edit, Calendar
} from "lucide-react";
import { AreaChart, Area, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { Footer } from "@/components/footer";
import { GlassCard } from "@/components/glass-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import darkwaveLogo from "@assets/generated_images/darkwave_token_transparent.png";

const USER_PROFILE = {
  username: "whale.dwc",
  address: "0x7a23...f8d1",
  avatar: "🐋",
  bio: "Early adopter. DeFi enthusiast. Building on DarkWave.",
  joinDate: "Jan 2026",
  level: 42,
  xp: 8500,
  xpToNext: 10000,
  reputation: 95,
  badges: [
    { id: "early", name: "Early Adopter", icon: "🌟", desc: "Joined in first month" },
    { id: "whale", name: "Whale", icon: "🐋", desc: "Holdings > $100k" },
    { id: "staker", name: "Diamond Staker", icon: "💎", desc: "Staked for 6+ months" },
    { id: "trader", name: "Pro Trader", icon: "📈", desc: "100+ trades executed" },
    { id: "nft", name: "NFT Collector", icon: "🎨", desc: "Owns 10+ NFTs" },
  ],
  stats: {
    totalValue: 125000,
    pnl: 42500,
    pnlPercent: 51.2,
    trades: 342,
    winRate: 68,
    followers: 1250,
    following: 45,
  },
};

const portfolioData = [
  { name: "DWC", value: 55, color: "#8b5cf6" },
  { name: "stDWC", value: 25, color: "#06b6d4" },
  { name: "LP Tokens", value: 12, color: "#22c55e" },
  { name: "NFTs", value: 8, color: "#f59e0b" },
];

const activityData = Array.from({ length: 30 }, (_, i) => ({
  day: i,
  value: 80000 + Math.random() * 50000 + i * 1500,
}));

const ACHIEVEMENTS = [
  { id: 1, name: "First Trade", desc: "Complete your first swap", progress: 100, reward: "50 DWC" },
  { id: 2, name: "Staking Pro", desc: "Stake 10,000 DWC", progress: 100, reward: "200 DWC" },
  { id: 3, name: "NFT Master", desc: "Own 25 NFTs", progress: 48, reward: "500 DWC" },
  { id: 4, name: "Whale Status", desc: "Hold $100k+ in portfolio", progress: 100, reward: "1000 DWC" },
  { id: 5, name: "Community Leader", desc: "Refer 50 users", progress: 24, reward: "2500 DWC" },
];

const RECENT_ACTIVITY = [
  { type: "trade", desc: "Swapped 10,000 DWC → 1,520 USDC", time: "2h ago", pnl: "+$152" },
  { type: "stake", desc: "Staked 5,000 DWC", time: "1d ago", pnl: null },
  { type: "nft", desc: "Minted Genesis NFT #247", time: "2d ago", pnl: null },
  { type: "claim", desc: "Claimed 450 DWC rewards", time: "3d ago", pnl: "+$67.50" },
];

export default function UserProfiles() {
  const [isOwner] = useState(true);
  const profile = USER_PROFILE;

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
        <div className="container mx-auto max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <GlassCard glow className="p-6 mb-6">
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div className="flex items-start gap-4">
                  <motion.div
                    className="w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 border-2 border-primary flex items-center justify-center text-4xl"
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    {profile.avatar}
                  </motion.div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h1 className="text-2xl font-bold">{profile.username}</h1>
                      <Badge className="bg-green-500/20 text-green-400 text-[10px]">
                        <Shield className="w-3 h-3 mr-0.5" />
                        Verified
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                      <span className="font-mono">{profile.address}</span>
                      <Button variant="ghost" size="icon" className="h-5 w-5">
                        <Copy className="w-3 h-3" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-5 w-5">
                        <ExternalLink className="w-3 h-3" />
                      </Button>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{profile.bio}</p>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        Joined {profile.joinDate}
                      </span>
                      <span>{profile.stats.followers.toLocaleString()} followers</span>
                      <span>{profile.stats.following} following</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  {isOwner ? (
                    <Button variant="outline" className="gap-2">
                      <Edit className="w-4 h-4" />
                      Edit Profile
                    </Button>
                  ) : (
                    <Button className="bg-gradient-to-r from-purple-500 to-pink-500 text-white gap-2">
                      <User className="w-4 h-4" />
                      Follow
                    </Button>
                  )}
                  <Button variant="ghost" size="icon">
                    <Share2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mt-4">
                {profile.badges.map((badge) => (
                  <motion.div
                    key={badge.id}
                    whileHover={{ scale: 1.05 }}
                    className="px-3 py-1.5 rounded-full bg-white/5 border border-white/10 flex items-center gap-2 cursor-pointer"
                    title={badge.desc}
                  >
                    <span>{badge.icon}</span>
                    <span className="text-xs">{badge.name}</span>
                  </motion.div>
                ))}
              </div>

              <div className="mt-4 p-3 rounded-lg bg-white/5">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Trophy className="w-4 h-4 text-amber-400" />
                    <span className="text-sm">Level {profile.level}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {profile.xp.toLocaleString()} / {profile.xpToNext.toLocaleString()} XP
                  </span>
                </div>
                <Progress value={(profile.xp / profile.xpToNext) * 100} className="h-2" />
              </div>
            </GlassCard>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
            <GlassCard hover={false} className="p-3">
              <div className="text-[10px] text-muted-foreground mb-1">Portfolio Value</div>
              <div className="text-xl font-bold">${profile.stats.totalValue.toLocaleString()}</div>
            </GlassCard>
            <GlassCard hover={false} className="p-3">
              <div className="text-[10px] text-muted-foreground mb-1">Total P/L</div>
              <div className="text-xl font-bold text-green-400">
                +${profile.stats.pnl.toLocaleString()} ({profile.stats.pnlPercent}%)
              </div>
            </GlassCard>
            <GlassCard hover={false} className="p-3">
              <div className="text-[10px] text-muted-foreground mb-1">Total Trades</div>
              <div className="text-xl font-bold">{profile.stats.trades}</div>
            </GlassCard>
            <GlassCard hover={false} className="p-3">
              <div className="text-[10px] text-muted-foreground mb-1">Win Rate</div>
              <div className="text-xl font-bold">{profile.stats.winRate}%</div>
            </GlassCard>
          </div>

          <Tabs defaultValue="portfolio">
            <TabsList className="w-full grid grid-cols-4">
              <TabsTrigger value="portfolio" className="text-xs">Portfolio</TabsTrigger>
              <TabsTrigger value="activity" className="text-xs">Activity</TabsTrigger>
              <TabsTrigger value="achievements" className="text-xs">Achievements</TabsTrigger>
              <TabsTrigger value="nfts" className="text-xs">NFTs</TabsTrigger>
            </TabsList>

            <TabsContent value="portfolio" className="mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <GlassCard className="p-4">
                  <h3 className="font-bold mb-4">Asset Allocation</h3>
                  <div className="flex items-center gap-4">
                    <div className="w-32 h-32">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie data={portfolioData} cx="50%" cy="50%" innerRadius={35} outerRadius={50} dataKey="value" strokeWidth={0}>
                            {portfolioData.map((entry, i) => (
                              <Cell key={i} fill={entry.color} />
                            ))}
                          </Pie>
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="flex-1 space-y-2">
                      {portfolioData.map((item, i) => (
                        <div key={i} className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                            <span className="text-sm">{item.name}</span>
                          </div>
                          <span className="text-sm font-mono">{item.value}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </GlassCard>

                <GlassCard className="p-4">
                  <h3 className="font-bold mb-4">Portfolio History</h3>
                  <div className="h-40">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={activityData}>
                        <defs>
                          <linearGradient id="portfolioGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.3} />
                            <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <Area type="monotone" dataKey="value" stroke="#8b5cf6" strokeWidth={2} fill="url(#portfolioGrad)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </GlassCard>
              </div>
            </TabsContent>

            <TabsContent value="activity" className="mt-4">
              <GlassCard className="p-4">
                <h3 className="font-bold mb-4">Recent Activity</h3>
                <div className="space-y-3">
                  {RECENT_ACTIVITY.map((item, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="flex items-center justify-between p-3 rounded-lg bg-white/5"
                    >
                      <div>
                        <p className="text-sm">{item.desc}</p>
                        <p className="text-xs text-muted-foreground">{item.time}</p>
                      </div>
                      {item.pnl && (
                        <span className="text-green-400 font-mono">{item.pnl}</span>
                      )}
                    </motion.div>
                  ))}
                </div>
              </GlassCard>
            </TabsContent>

            <TabsContent value="achievements" className="mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {ACHIEVEMENTS.map((achievement, i) => (
                  <motion.div
                    key={achievement.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <GlassCard className={`p-4 ${achievement.progress === 100 ? 'ring-1 ring-green-500/50' : ''}`}>
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h4 className="font-bold flex items-center gap-2">
                            {achievement.name}
                            {achievement.progress === 100 && (
                              <Badge className="bg-green-500/20 text-green-400 text-[9px]">Complete</Badge>
                            )}
                          </h4>
                          <p className="text-xs text-muted-foreground">{achievement.desc}</p>
                        </div>
                        <Badge variant="outline" className="text-[10px]">{achievement.reward}</Badge>
                      </div>
                      <Progress value={achievement.progress} className="h-1.5" />
                      <p className="text-[10px] text-muted-foreground mt-1">{achievement.progress}% complete</p>
                    </GlassCard>
                  </motion.div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="nfts" className="mt-4">
              <GlassCard className="p-8 text-center">
                <Award className="w-12 h-12 text-white/10 mx-auto mb-3" />
                <p className="text-muted-foreground">12 NFTs in collection</p>
                <Link href="/nft-gallery">
                  <Button variant="outline" className="mt-4">View Gallery</Button>
                </Link>
              </GlassCard>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />
    </div>
  );
}
