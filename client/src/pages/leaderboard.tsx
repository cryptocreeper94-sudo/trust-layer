import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "wouter";
import {
  ArrowLeft, Trophy, Medal, Crown, TrendingUp, TrendingDown,
  Star, Users, Activity, Flame, Target, Award, ChevronDown
} from "lucide-react";
import { AreaChart, Area, ResponsiveContainer } from "recharts";
import { Footer } from "@/components/footer";
import { GlassCard } from "@/components/glass-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import darkwaveLogo from "@assets/generated_images/darkwave_token_transparent.png";

interface Trader {
  rank: number;
  name: string;
  avatar: string;
  pnl: number;
  pnlPercent: number;
  trades: number;
  winRate: number;
  streak: number;
  chartData: { value: number }[];
}

const generateChart = (trend: number) => 
  Array.from({ length: 20 }, (_, i) => ({ value: 50 + Math.random() * 30 + i * trend }));

const WEEKLY_LEADERS: Trader[] = [
  { rank: 1, name: "whale.dwc", avatar: "🐋", pnl: 42500, pnlPercent: 156, trades: 47, winRate: 82, streak: 12, chartData: generateChart(3) },
  { rank: 2, name: "satoshi.eth", avatar: "⚡", pnl: 31200, pnlPercent: 124, trades: 89, winRate: 74, streak: 8, chartData: generateChart(2.5) },
  { rank: 3, name: "defi_king", avatar: "👑", pnl: 28900, pnlPercent: 118, trades: 156, winRate: 68, streak: 5, chartData: generateChart(2) },
  { rank: 4, name: "alpha_hunter", avatar: "🎯", pnl: 22100, pnlPercent: 95, trades: 34, winRate: 76, streak: 7, chartData: generateChart(1.8) },
  { rank: 5, name: "crypto_sage", avatar: "🧙", pnl: 19800, pnlPercent: 87, trades: 67, winRate: 71, streak: 4, chartData: generateChart(1.5) },
  { rank: 6, name: "moon_rider", avatar: "🌙", pnl: 17500, pnlPercent: 78, trades: 45, winRate: 69, streak: 3, chartData: generateChart(1.3) },
  { rank: 7, name: "block_master", avatar: "🧱", pnl: 15200, pnlPercent: 65, trades: 82, winRate: 65, streak: 6, chartData: generateChart(1.1) },
  { rank: 8, name: "yield_farmer", avatar: "🌾", pnl: 13800, pnlPercent: 58, trades: 123, winRate: 62, streak: 2, chartData: generateChart(0.9) },
  { rank: 9, name: "nft_whale", avatar: "🐳", pnl: 11500, pnlPercent: 52, trades: 28, winRate: 78, streak: 5, chartData: generateChart(0.7) },
  { rank: 10, name: "degen_pro", avatar: "🎰", pnl: 9800, pnlPercent: 45, trades: 234, winRate: 55, streak: 1, chartData: generateChart(0.5) },
];

const PRIZES = [
  { rank: "1st", prize: "10,000 DWC + Golden NFT", color: "from-amber-400 to-yellow-500" },
  { rank: "2nd", prize: "5,000 DWC + Silver NFT", color: "from-gray-300 to-gray-400" },
  { rank: "3rd", prize: "2,500 DWC + Bronze NFT", color: "from-amber-600 to-amber-700" },
  { rank: "4-10", prize: "500 DWC each", color: "from-purple-400 to-pink-500" },
];

function TopThreePodium() {
  const top3 = WEEKLY_LEADERS.slice(0, 3);
  
  return (
    <div className="flex items-end justify-center gap-4 mb-8 h-64">
      {[top3[1], top3[0], top3[2]].map((trader, i) => {
        const heights = ["h-32", "h-44", "h-24"];
        const order = [1, 0, 2];
        const colors = [
          "from-gray-400/30 to-gray-500/10 border-gray-400/50",
          "from-amber-400/30 to-yellow-500/10 border-amber-400/50",
          "from-amber-600/30 to-amber-700/10 border-amber-600/50",
        ];
        const icons = [Medal, Crown, Award];
        const Icon = icons[order[i]];
        
        return (
          <motion.div
            key={trader.rank}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + i * 0.15 }}
            className="flex flex-col items-center"
          >
            <motion.div
              className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${colors[order[i]]} border-2 flex items-center justify-center text-3xl mb-2`}
              animate={{ scale: order[i] === 0 ? [1, 1.1, 1] : 1 }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              {trader.avatar}
            </motion.div>
            <p className="font-bold text-sm mb-1">{trader.name}</p>
            <p className="text-green-400 text-xs font-mono mb-2">+${(trader.pnl/1000).toFixed(1)}K</p>
            <div className={`${heights[i]} w-20 rounded-t-xl bg-gradient-to-t ${colors[order[i]]} border-t border-x flex flex-col items-center justify-start pt-3`}>
              <Icon className="w-6 h-6 text-white/80" />
              <span className="text-2xl font-bold mt-1">{trader.rank}</span>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

function LeaderRow({ trader, index }: { trader: Trader; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      <GlassCard className="p-3 flex items-center gap-3">
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm ${
          trader.rank <= 3 
            ? trader.rank === 1 ? 'bg-amber-500 text-black' : trader.rank === 2 ? 'bg-gray-400 text-black' : 'bg-amber-700 text-white'
            : 'bg-white/10'
        }`}>
          {trader.rank}
        </div>
        
        <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-xl">
          {trader.avatar}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className="font-bold truncate">{trader.name}</p>
            {trader.streak >= 5 && (
              <Badge className="bg-orange-500/20 text-orange-400 text-[9px]">
                <Flame className="w-3 h-3 mr-0.5" />
                {trader.streak}
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span>{trader.trades} trades</span>
            <span>•</span>
            <span>{trader.winRate}% win</span>
          </div>
        </div>
        
        <div className="w-20 h-10 hidden sm:block">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={trader.chartData}>
              <Area type="monotone" dataKey="value" stroke="#22c55e" fill="#22c55e" fillOpacity={0.2} strokeWidth={1.5} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        
        <div className="text-right">
          <p className="font-bold text-green-400">+${(trader.pnl/1000).toFixed(1)}K</p>
          <p className="text-xs text-muted-foreground">+{trader.pnlPercent}%</p>
        </div>
      </GlassCard>
    </motion.div>
  );
}

export default function Leaderboard() {
  const [period, setPeriod] = useState("weekly");
  
  const timeLeft = { days: 3, hours: 14, minutes: 27 };

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
                className="p-3 rounded-2xl bg-gradient-to-br from-amber-400/20 to-yellow-500/20 border border-amber-400/30"
                animate={{ 
                  boxShadow: ["0 0 20px rgba(251,191,36,0.2)", "0 0 50px rgba(251,191,36,0.4)", "0 0 20px rgba(251,191,36,0.2)"]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Trophy className="w-7 h-7 text-amber-400" />
              </motion.div>
            </div>
            <h1 className="text-2xl md:text-3xl font-display font-bold mb-2">
              Trading <span className="bg-gradient-to-r from-amber-400 to-yellow-500 bg-clip-text text-transparent">Leaderboard</span>
            </h1>
            <p className="text-sm text-muted-foreground mb-4">
              Compete with top traders and win prizes
            </p>
            
            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-xl bg-white/5 border border-white/10">
              <span className="text-xs text-muted-foreground">Competition ends in:</span>
              <div className="flex items-center gap-2">
                <div className="text-center">
                  <span className="text-lg font-bold">{timeLeft.days}</span>
                  <span className="text-[10px] text-muted-foreground block">days</span>
                </div>
                <span className="text-muted-foreground">:</span>
                <div className="text-center">
                  <span className="text-lg font-bold">{timeLeft.hours}</span>
                  <span className="text-[10px] text-muted-foreground block">hrs</span>
                </div>
                <span className="text-muted-foreground">:</span>
                <div className="text-center">
                  <span className="text-lg font-bold">{timeLeft.minutes}</span>
                  <span className="text-[10px] text-muted-foreground block">min</span>
                </div>
              </div>
            </div>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-6">
            {PRIZES.map((prize, i) => (
              <motion.div
                key={prize.rank}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <GlassCard className={`p-3 bg-gradient-to-br ${prize.color} bg-opacity-10`}>
                  <div className="text-xs text-white/70 mb-1">{prize.rank} Place</div>
                  <div className="text-xs font-bold">{prize.prize}</div>
                </GlassCard>
              </motion.div>
            ))}
          </div>

          <Tabs defaultValue="weekly" className="mb-6">
            <TabsList className="w-full grid grid-cols-3">
              <TabsTrigger value="daily" className="text-xs">Daily</TabsTrigger>
              <TabsTrigger value="weekly" className="text-xs">Weekly</TabsTrigger>
              <TabsTrigger value="alltime" className="text-xs">All Time</TabsTrigger>
            </TabsList>

            <TabsContent value="weekly" className="mt-6">
              <TopThreePodium />
              
              <div className="space-y-2">
                {WEEKLY_LEADERS.slice(3).map((trader, i) => (
                  <LeaderRow key={trader.rank} trader={trader} index={i} />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="daily" className="mt-6">
              <TopThreePodium />
              <div className="space-y-2">
                {WEEKLY_LEADERS.slice(3).map((trader, i) => (
                  <LeaderRow key={trader.rank} trader={trader} index={i} />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="alltime" className="mt-6">
              <TopThreePodium />
              <div className="space-y-2">
                {WEEKLY_LEADERS.slice(3).map((trader, i) => (
                  <LeaderRow key={trader.rank} trader={trader} index={i} />
                ))}
              </div>
            </TabsContent>
          </Tabs>

          <GlassCard className="p-4 text-center">
            <p className="text-muted-foreground mb-3">Your current rank: <span className="text-white font-bold">#247</span></p>
            <Link href="/trading">
              <Button className="bg-gradient-to-r from-amber-400 to-yellow-500 text-black">
                <Target className="w-4 h-4 mr-2" />
                Start Trading to Compete
              </Button>
            </Link>
          </GlassCard>
        </div>
      </main>

      <Footer />
    </div>
  );
}
