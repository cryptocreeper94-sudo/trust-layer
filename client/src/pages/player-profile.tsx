import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useRoute } from "wouter";
import { useQuery } from "@tanstack/react-query";
import {
  Trophy,
  Coins,
  TrendingUp,
  TrendingDown,
  Flame,
  Star,
  Target,
  Gamepad2,
  Wallet,
  History,
  Settings,
  ChevronRight,
  Clock,
  Zap,
  Crown,
  Gift,
  BarChart3,
} from "lucide-react";
import { BackButton } from "@/components/page-nav";
import { useAuth } from "@/hooks/use-auth";
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";

// Holographic gradient CSS
const holographicGradient = "bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-cyan-500/20";
const glowPulse = "animate-pulse shadow-[0_0_30px_rgba(139,92,246,0.3)]";

// Level titles
const levelTitles = [
  "Rookie", "Bronze", "Silver", "Gold", "Platinum",
  "Diamond", "Master", "Grandmaster", "Legend", "Mythic"
];

function getLevelTitle(level: number): string {
  if (level <= 0) return levelTitles[0];
  if (level >= 100) return "Immortal";
  const tier = Math.floor((level - 1) / 10);
  return levelTitles[Math.min(tier, levelTitles.length - 1)];
}

// Stat Card Component
function StatCard({
  icon: Icon,
  label,
  value,
  subValue,
  gradient,
  delay = 0,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  subValue?: string;
  gradient: string;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay, duration: 0.4, ease: "easeOut" }}
      className={`relative overflow-hidden rounded-2xl border border-white/10 ${gradient} backdrop-blur-xl p-4`}
    >
      {/* Holographic shimmer overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shimmer" />
      
      <div className="relative z-10 flex items-start justify-between">
        <div>
          <p className="text-xs text-gray-400 mb-1">{label}</p>
          <p className="text-xl font-bold text-white">{value}</p>
          {subValue && (
            <p className="text-xs text-gray-500 mt-1">{subValue}</p>
          )}
        </div>
        <div className={`p-2 rounded-xl bg-white/10`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
      </div>
    </motion.div>
  );
}

// XP Progress Bar Component
function XPProgressBar({ level, xp, xpToNextLevel }: { level: number; xp: number; xpToNextLevel: number }) {
  const progress = (xp / xpToNextLevel) * 100;
  
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.3 }}
      className="relative p-4 rounded-2xl border border-white/10 bg-gradient-to-br from-purple-900/30 to-pink-900/20 backdrop-blur-xl"
    >
      {/* Animated border glow */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-cyan-500/20 blur-xl opacity-50" />
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                <Crown className="w-6 h-6 text-white" />
              </div>
              <motion.div
                className="absolute -bottom-1 -right-1 bg-yellow-400 text-black text-[10px] font-bold px-1.5 py-0.5 rounded-full"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                {level}
              </motion.div>
            </div>
            <div>
              <p className="text-white font-bold text-lg">{getLevelTitle(level)}</p>
              <p className="text-gray-400 text-sm">Level {level}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-white font-bold">{xp.toLocaleString()} XP</p>
            <p className="text-gray-500 text-xs">{xpToNextLevel.toLocaleString()} to next level</p>
          </div>
        </div>
        
        {/* Progress bar */}
        <div className="h-3 bg-black/40 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 1, ease: "easeOut", delay: 0.5 }}
            className="h-full rounded-full bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-400 relative"
          >
            {/* Animated glow */}
            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/30 to-white/0 animate-shimmer" />
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}

// Profit Chart Component
function ProfitChart({ data }: { data: { date: string; profit: number }[] }) {
  const hasProfit = data.some(d => d.profit > 0);
  const hasLoss = data.some(d => d.profit < 0);
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="p-4 rounded-2xl border border-white/10 bg-gradient-to-br from-gray-900/50 to-gray-800/30 backdrop-blur-xl"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white font-bold flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-purple-400" />
          Profit/Loss Chart
        </h3>
        <div className="flex gap-3 text-xs">
          <span className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-green-500" />
            Profit
          </span>
          <span className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-red-500" />
            Loss
          </span>
        </div>
      </div>
      
      <div className="h-48">
        {data.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="profitGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="lossGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="date"
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#6b7280', fontSize: 10 }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#6b7280', fontSize: 10 }}
                tickFormatter={(v) => v >= 0 ? `+${v}` : `${v}`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(17, 17, 17, 0.9)',
                  border: '1px solid rgba(139, 92, 246, 0.3)',
                  borderRadius: '12px',
                  padding: '8px 12px',
                }}
                labelStyle={{ color: '#9ca3af' }}
                formatter={(value: number) => [
                  <span style={{ color: value >= 0 ? '#22c55e' : '#ef4444' }}>
                    {value >= 0 ? '+' : ''}{value.toLocaleString()} DWC
                  </span>,
                  'Profit'
                ]}
              />
              <Area
                type="monotone"
                dataKey="profit"
                stroke="#8b5cf6"
                strokeWidth={2}
                fill="url(#profitGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-full flex items-center justify-center text-gray-500">
            <p>Play some games to see your profit chart!</p>
          </div>
        )}
      </div>
    </motion.div>
  );
}

// Game History Row Component
function GameHistoryRow({
  game,
  index,
}: {
  game: {
    id: string;
    gameType: string;
    betAmount: string;
    payout: string;
    profit: string;
    outcome: string;
    multiplier?: string;
    createdAt: string;
  };
  index: number;
}) {
  const isWin = game.outcome === "win";
  const profit = parseFloat(game.profit);
  
  const gameIcons: Record<string, string> = {
    crash: "🚀",
    coinflip: "🪙",
    slots: "🎰",
    lottery: "🎟️",
    plinko: "⚪",
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
      className={`flex items-center justify-between p-3 rounded-xl border ${
        isWin 
          ? 'border-green-500/20 bg-green-500/5' 
          : 'border-red-500/20 bg-red-500/5'
      }`}
      data-testid={`game-history-row-${game.id}`}
    >
      <div className="flex items-center gap-3">
        <span className="text-2xl">{gameIcons[game.gameType] || "🎮"}</span>
        <div>
          <p className="text-white font-medium capitalize">{game.gameType}</p>
          <p className="text-gray-500 text-xs">
            {new Date(game.createdAt).toLocaleString()}
          </p>
        </div>
      </div>
      
      <div className="text-right">
        <p className={`font-bold ${isWin ? 'text-green-400' : 'text-red-400'}`}>
          {profit >= 0 ? '+' : ''}{parseFloat(game.profit).toLocaleString()} DWC
        </p>
        <p className="text-gray-500 text-xs">
          Bet: {parseFloat(game.betAmount).toLocaleString()} DWC
          {game.multiplier && ` @ ${game.multiplier}x`}
        </p>
      </div>
    </motion.div>
  );
}

// Tab Button Component
function TabButton({
  active,
  onClick,
  icon: Icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ElementType;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
        active
          ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
          : 'text-gray-400 hover:text-white hover:bg-white/5'
      }`}
    >
      <Icon className="w-4 h-4" />
      <span className="text-sm font-medium">{label}</span>
    </button>
  );
}

export default function PlayerProfilePage() {
  const { user } = useAuth();
  const [, params] = useRoute("/arcade/profile/:userId");
  const [activeTab, setActiveTab] = useState<"statistics" | "history" | "achievements" | "settings">("statistics");
  
  // Get user ID from params or current user
  const userId = params?.userId || user?.id;
  const isOwnProfile = !params?.userId || params?.userId === user?.id;
  
  // Fetch player stats
  const { data: stats, isLoading: loadingStats } = useQuery({
    queryKey: ["/api/player-stats", userId],
    queryFn: async () => {
      if (!userId) return null;
      const res = await fetch(`/api/player-stats/${userId}`);
      if (!res.ok) throw new Error("Failed to fetch stats");
      return res.json();
    },
    enabled: !!userId,
  });
  
  // Fetch game history
  const { data: history, isLoading: loadingHistory } = useQuery({
    queryKey: ["/api/player-history", userId],
    queryFn: async () => {
      if (!userId) return [];
      const res = await fetch(`/api/player-history/${userId}?limit=20`);
      if (!res.ok) throw new Error("Failed to fetch history");
      return res.json();
    },
    enabled: !!userId,
  });
  
  // Fetch daily profit data
  const { data: dailyProfit, isLoading: loadingDaily } = useQuery({
    queryKey: ["/api/player-daily-profit", userId],
    queryFn: async () => {
      if (!userId) return [];
      const res = await fetch(`/api/player-daily-profit/${userId}?days=14`);
      if (!res.ok) throw new Error("Failed to fetch daily profit");
      return res.json();
    },
    enabled: !!userId,
  });
  
  // Get display name from user
  const displayName = user ? (user.firstName || user.email?.split('@')[0] || 'Player') : 'Anonymous';
  
  // Default/empty stats for new players
  const playerStats = stats || {
    username: displayName,
    level: 1,
    xp: 0,
    xpToNextLevel: 100,
    totalGamesPlayed: 0,
    totalWagered: "0",
    totalWon: "0",
    totalLost: "0",
    netProfit: "0",
    winCount: 0,
    lossCount: 0,
    winRate: "0",
    bestMultiplier: "0",
    currentStreak: 0,
    bestStreak: 0,
  };
  
  const netProfit = parseFloat(playerStats.netProfit);
  const isProfit = netProfit >= 0;
  
  return (
    <div className="min-h-screen bg-[#0a0a0f] pb-24">
      {/* Animated background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-purple-900/10 via-transparent to-transparent" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
      </div>
      
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="sticky top-0 z-50 bg-[#0a0a0f]/80 backdrop-blur-xl border-b border-white/5"
      >
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
          <BackButton />
          {isOwnProfile && (
            <button className="p-2 rounded-xl bg-white/5 hover:bg-white/10 transition-colors">
              <Settings className="w-5 h-5 text-gray-400" />
            </button>
          )}
        </div>
      </motion.div>
      
      <div className="max-w-2xl mx-auto px-4 py-6 space-y-6 relative z-10">
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="relative inline-block mb-4">
            <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-4xl">
              {playerStats.username?.charAt(0).toUpperCase() || "?"}
            </div>
            {/* Level badge */}
            <motion.div
              className="absolute -bottom-2 -right-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-black text-sm font-bold px-3 py-1 rounded-full shadow-lg"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              Lv. {playerStats.level}
            </motion.div>
          </div>
          <h1 className="text-2xl font-bold text-white mb-1" data-testid="text-username">
            {playerStats.username}
          </h1>
          <p className="text-purple-400 font-medium">{getLevelTitle(playerStats.level)}</p>
        </motion.div>
        
        {/* XP Progress */}
        <XPProgressBar
          level={playerStats.level}
          xp={playerStats.xp}
          xpToNextLevel={playerStats.xpToNextLevel}
        />
        
        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3">
          <StatCard
            icon={Gamepad2}
            label="Games Played"
            value={playerStats.totalGamesPlayed.toLocaleString()}
            gradient="bg-gradient-to-br from-blue-900/30 to-blue-800/20"
            delay={0.1}
          />
          <StatCard
            icon={Coins}
            label="Total Wagered"
            value={`${parseFloat(playerStats.totalWagered).toLocaleString()} DWC`}
            gradient="bg-gradient-to-br from-yellow-900/30 to-yellow-800/20"
            delay={0.15}
          />
          <StatCard
            icon={isProfit ? TrendingUp : TrendingDown}
            label="Net Profit"
            value={`${isProfit ? '+' : ''}${netProfit.toLocaleString()} DWC`}
            subValue={isProfit ? "You're winning!" : "Keep playing!"}
            gradient={isProfit 
              ? "bg-gradient-to-br from-green-900/30 to-green-800/20" 
              : "bg-gradient-to-br from-red-900/30 to-red-800/20"
            }
            delay={0.2}
          />
          <StatCard
            icon={Target}
            label="Win Rate"
            value={`${parseFloat(playerStats.winRate).toFixed(1)}%`}
            subValue={`${playerStats.winCount}W / ${playerStats.lossCount}L`}
            gradient="bg-gradient-to-br from-purple-900/30 to-purple-800/20"
            delay={0.25}
          />
          <StatCard
            icon={Zap}
            label="Best Multiplier"
            value={`${parseFloat(playerStats.bestMultiplier).toFixed(2)}x`}
            gradient="bg-gradient-to-br from-cyan-900/30 to-cyan-800/20"
            delay={0.3}
          />
          <StatCard
            icon={Flame}
            label="Best Streak"
            value={`${playerStats.bestStreak} wins`}
            subValue={playerStats.currentStreak > 0 ? `Current: ${playerStats.currentStreak}` : undefined}
            gradient="bg-gradient-to-br from-orange-900/30 to-orange-800/20"
            delay={0.35}
          />
        </div>
        
        {/* Profit Chart */}
        <ProfitChart data={dailyProfit || []} />
        
        {/* Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4">
          <TabButton
            active={activeTab === "statistics"}
            onClick={() => setActiveTab("statistics")}
            icon={BarChart3}
            label="Statistics"
          />
          <TabButton
            active={activeTab === "history"}
            onClick={() => setActiveTab("history")}
            icon={History}
            label="History"
          />
          <TabButton
            active={activeTab === "achievements"}
            onClick={() => setActiveTab("achievements")}
            icon={Trophy}
            label="Achievements"
          />
          {isOwnProfile && (
            <TabButton
              active={activeTab === "settings"}
              onClick={() => setActiveTab("settings")}
              icon={Settings}
              label="Settings"
            />
          )}
        </div>
        
        {/* Tab Content */}
        <AnimatePresence mode="wait">
          {activeTab === "statistics" && (
            <motion.div
              key="statistics"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              <div className="p-4 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl">
                <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-yellow-400" />
                  Performance Summary
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2 border-b border-white/5">
                    <span className="text-gray-400">Total Won</span>
                    <span className="text-green-400 font-medium">
                      +{parseFloat(playerStats.totalWon).toLocaleString()} DWC
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-white/5">
                    <span className="text-gray-400">Total Lost</span>
                    <span className="text-red-400 font-medium">
                      -{parseFloat(playerStats.totalLost).toLocaleString()} DWC
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-white/5">
                    <span className="text-gray-400">Average Bet Size</span>
                    <span className="text-white font-medium">
                      {playerStats.totalGamesPlayed > 0
                        ? (parseFloat(playerStats.totalWagered) / playerStats.totalGamesPlayed).toFixed(2)
                        : "0"} DWC
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-gray-400">Favorite Game</span>
                    <span className="text-purple-400 font-medium">Crash 🚀</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
          
          {activeTab === "history" && (
            <motion.div
              key="history"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-3"
            >
              {loadingHistory ? (
                <div className="text-center py-8 text-gray-500">Loading history...</div>
              ) : (history && history.length > 0) ? (
                history.map((game: any, index: number) => (
                  <GameHistoryRow key={game.id} game={game} index={index} />
                ))
              ) : (
                <div className="text-center py-12">
                  <Gamepad2 className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-500 mb-2">No games played yet</p>
                  <Link
                    href="/arcade"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-500/20 text-purple-400 hover:bg-purple-500/30 transition-colors"
                  >
                    <Gamepad2 className="w-4 h-4" />
                    Start Playing
                  </Link>
                </div>
              )}
            </motion.div>
          )}
          
          {activeTab === "achievements" && (
            <motion.div
              key="achievements"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              <div className="grid grid-cols-3 gap-3">
                {[
                  { icon: "🎮", name: "First Game", unlocked: playerStats.totalGamesPlayed > 0 },
                  { icon: "🏆", name: "First Win", unlocked: playerStats.winCount > 0 },
                  { icon: "🔥", name: "Hot Streak", unlocked: playerStats.bestStreak >= 5 },
                  { icon: "💎", name: "High Roller", unlocked: parseFloat(playerStats.totalWagered) >= 10000 },
                  { icon: "🚀", name: "Moon Shot", unlocked: parseFloat(playerStats.bestMultiplier) >= 10 },
                  { icon: "👑", name: "Legendary", unlocked: playerStats.level >= 50 },
                ].map((achievement, i) => (
                  <motion.div
                    key={achievement.name}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.1 }}
                    className={`p-4 rounded-2xl border text-center ${
                      achievement.unlocked
                        ? 'border-yellow-500/30 bg-yellow-500/10'
                        : 'border-white/5 bg-white/5 opacity-40'
                    }`}
                  >
                    <span className="text-3xl">{achievement.icon}</span>
                    <p className={`text-xs mt-2 ${achievement.unlocked ? 'text-white' : 'text-gray-600'}`}>
                      {achievement.name}
                    </p>
                  </motion.div>
                ))}
              </div>
              <p className="text-center text-gray-500 text-sm">
                More achievements coming soon!
              </p>
            </motion.div>
          )}
          
          {activeTab === "settings" && isOwnProfile && (
            <motion.div
              key="settings"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              <div className="p-4 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl">
                <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                  <Settings className="w-5 h-5 text-gray-400" />
                  Game Settings
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Sound Effects</span>
                    <button className="w-12 h-6 rounded-full bg-purple-500 relative">
                      <div className="absolute right-1 top-1 w-4 h-4 rounded-full bg-white" />
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Animations</span>
                    <button className="w-12 h-6 rounded-full bg-purple-500 relative">
                      <div className="absolute right-1 top-1 w-4 h-4 rounded-full bg-white" />
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Auto Cash-out</span>
                    <button className="w-12 h-6 rounded-full bg-gray-600 relative">
                      <div className="absolute left-1 top-1 w-4 h-4 rounded-full bg-white" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      {/* CSS for shimmer animation */}
      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
      `}</style>
    </div>
  );
}
