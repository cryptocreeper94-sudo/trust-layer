import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { 
  Activity, 
  TrendingUp, 
  Target, 
  Brain,
  BarChart3,
  Clock,
  Zap,
  Trophy,
  ChevronDown,
  RefreshCw
} from "lucide-react";
import { Link } from "wouter";
import { GlassCard } from "@/components/glass-card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface MLStats {
  overview: {
    totalPredictions: number;
    totalResolved: number;
    pendingResolution: number;
    overallAccuracy: string;
    avgReturn: string;
  };
  byHorizon: Array<{
    horizon: string;
    predictions: number;
    wins: number;
    accuracy: string;
    avgReturn: string;
  }>;
  recentPerformance: {
    last24h: { predictions: number; accuracy: string };
    last7d: { predictions: number; accuracy: string };
    last30d: { predictions: number; accuracy: string };
  };
  topTokens: Array<{
    symbol: string;
    predictions: number;
    wins: number;
    accuracy: string;
    avgReturn: string;
  }>;
  generatedAt: string;
}


const GlowOrb = ({ color, size, top, left, delay = 0 }: { color: string; size: number; top: string; left: string; delay?: number }) => (
  <motion.div
    className="absolute rounded-full blur-3xl opacity-20 pointer-events-none"
    style={{ background: color, width: size, height: size, top, left }}
    animate={{ scale: [1, 1.2, 1], opacity: [0.15, 0.25, 0.15] }}
    transition={{ duration: 8, repeat: Infinity, delay }}
  />
);

export default function MLDashboard() {
  const [selectedPeriod, setSelectedPeriod] = useState<"24h" | "7d" | "30d">("7d");

  const { data: stats, isLoading, refetch, isRefetching } = useQuery<MLStats>({
    queryKey: ["/api/ml/stats"],
    refetchInterval: 60000,
  });

  const getAccuracyColor = (accuracy: string) => {
    const val = parseFloat(accuracy);
    if (val >= 70) return "text-green-400";
    if (val >= 55) return "text-yellow-400";
    return "text-red-400";
  };

  const getReturnColor = (returnVal: string) => {
    const val = parseFloat(returnVal);
    if (val > 0) return "text-green-400";
    if (val < 0) return "text-red-400";
    return "text-gray-400";
  };

  return (
    <div className="min-h-screen relative overflow-hidden pt-20 pb-12" style={{ background: "linear-gradient(180deg, #070b16, #0c1222, #070b16)" }}>
      <GlowOrb color="linear-gradient(135deg, #06b6d4, #3b82f6)" size={500} top="-5%" left="60%" />
      <GlowOrb color="linear-gradient(135deg, #8b5cf6, #ec4899)" size={400} top="40%" left="-10%" delay={3} />
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-radial from-cyan-500/3 to-transparent rounded-full" />
      </div>

      <div className="container mx-auto px-4 py-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-lg bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border border-cyan-500/30">
                  <Brain className="w-6 h-6 text-cyan-400" />
                </div>
                <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  ML Analytics Dashboard
                </h1>
              </div>
              <p className="text-gray-400">
                Real-time machine learning performance metrics and prediction analytics
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => refetch()}
                disabled={isRefetching}
                className="border-cyan-500/30 hover:bg-cyan-500/10"
                data-testid="refresh-stats-button"
              >
                <RefreshCw className={cn("w-4 h-4 mr-2", isRefetching && "animate-spin")} />
                Refresh
              </Button>
              <Link href="/pulse">
                <Button variant="outline" size="sm" className="border-purple-500/30 hover:bg-purple-500/10">
                  <Activity className="w-4 h-4 mr-2" />
                  Back to Pulse
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>

        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin mx-auto mb-4" />
              <p className="text-gray-400">Loading ML statistics...</p>
            </div>
          </div>
        ) : stats ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <GlassCard glow className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-2 rounded-lg bg-cyan-500/20">
                      <BarChart3 className="w-5 h-5 text-cyan-400" />
                    </div>
                    <span className="text-xs text-cyan-400 font-medium">TOTAL</span>
                  </div>
                  <div className="text-3xl font-bold text-white mb-1" data-testid="total-predictions">
                    {stats.overview.totalPredictions.toLocaleString()}
                  </div>
                  <p className="text-sm text-gray-400">Total Predictions</p>
                  <div className="mt-2 text-xs text-gray-500">
                    {stats.overview.pendingResolution} pending resolution
                  </div>
</motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <GlassCard glow className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-2 rounded-lg bg-green-500/20">
                      <Target className="w-5 h-5 text-green-400" />
                    </div>
                    <span className="text-xs text-green-400 font-medium">ACCURACY</span>
                  </div>
                  <div className={cn("text-3xl font-bold mb-1", getAccuracyColor(stats.overview.overallAccuracy))} data-testid="overall-accuracy">
                    {stats.overview.overallAccuracy}%
                  </div>
                  <p className="text-sm text-gray-400">Overall Accuracy</p>
                  <div className="mt-2 text-xs text-gray-500">
                    {stats.overview.totalResolved} resolved predictions
                  </div>
</motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <GlassCard glow className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-2 rounded-lg bg-purple-500/20">
                      <TrendingUp className="w-5 h-5 text-purple-400" />
                    </div>
                    <span className="text-xs text-purple-400 font-medium">RETURN</span>
                  </div>
                  <div className={cn("text-3xl font-bold mb-1", getReturnColor(stats.overview.avgReturn))} data-testid="avg-return">
                    {parseFloat(stats.overview.avgReturn) > 0 ? "+" : ""}{stats.overview.avgReturn}%
                  </div>
                  <p className="text-sm text-gray-400">Average Return</p>
                  <div className="mt-2 text-xs text-gray-500">
                    Per resolved prediction
                  </div>
</motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <GlassCard glow className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-2 rounded-lg bg-pink-500/20">
                      <Zap className="w-5 h-5 text-pink-400" />
                    </div>
                    <span className="text-xs text-pink-400 font-medium">LIVE</span>
                  </div>
                  <div className="text-3xl font-bold text-white mb-1" data-testid="pending-predictions">
                    {stats.overview.pendingResolution}
                  </div>
                  <p className="text-sm text-gray-400">Active Predictions</p>
                  <div className="mt-2 text-xs text-gray-500">
                    Awaiting resolution
                  </div>
</motion.div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
              >
                <GlassCard glow className="p-6 h-full">
                  <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                    <Clock className="w-5 h-5 text-cyan-400" />
                    Performance by Horizon
                  </h2>
                  
                  <div className="space-y-4">
                    {stats.byHorizon.map((horizon, i) => (
                      <div 
                        key={horizon.horizon} 
                        className="p-4 rounded-lg bg-gray-800/50 border border-gray-700/50 hover:border-cyan-500/30 transition-colors"
                        data-testid={`horizon-${horizon.horizon}`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-white capitalize">{horizon.horizon}</span>
                          <span className={cn("font-bold", getAccuracyColor(horizon.accuracy))}>
                            {horizon.accuracy}%
                          </span>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-400">
                          <span>{horizon.predictions} predictions</span>
                          <span className="text-green-400">{horizon.wins} wins</span>
                          <span className={getReturnColor(horizon.avgReturn)}>
                            {parseFloat(horizon.avgReturn) > 0 ? "+" : ""}{horizon.avgReturn}% avg
                          </span>
                        </div>
                        <div className="mt-2 h-2 bg-gray-700 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full transition-all"
                            style={{ width: `${Math.min(parseFloat(horizon.accuracy), 100)}%` }}
                          />
                        </div>
                      </div>
                    ))}
                    
                    {stats.byHorizon.length === 0 && (
                      <div className="text-center py-8 text-gray-400">
                        No horizon data available yet
                      </div>
                    )}
                  </div>
</motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 }}
              >
                <GlassCard glow className="p-6 h-full">
                  <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                    <Activity className="w-5 h-5 text-purple-400" />
                    Recent Performance
                  </h2>
                  
                  <div className="flex gap-2 mb-6">
                    {(["24h", "7d", "30d"] as const).map((period) => (
                      <button
                        key={period}
                        onClick={() => setSelectedPeriod(period)}
                        className={cn(
                          "px-4 py-2 rounded-lg text-sm font-medium transition-all",
                          selectedPeriod === period
                            ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30"
                            : "bg-gray-800/50 text-gray-400 border border-gray-700/50 hover:border-gray-600"
                        )}
                        data-testid={`period-${period}`}
                      >
                        {period === "24h" ? "24 Hours" : period === "7d" ? "7 Days" : "30 Days"}
                      </button>
                    ))}
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-lg bg-gray-800/50 border border-gray-700/50">
                      <div className="text-sm text-gray-400 mb-1">Predictions</div>
                      <div className="text-2xl font-bold text-white" data-testid="period-predictions">
                        {selectedPeriod === "24h" 
                          ? stats.recentPerformance.last24h.predictions
                          : selectedPeriod === "7d"
                          ? stats.recentPerformance.last7d.predictions
                          : stats.recentPerformance.last30d.predictions}
                      </div>
                    </div>
                    <div className="p-4 rounded-lg bg-gray-800/50 border border-gray-700/50">
                      <div className="text-sm text-gray-400 mb-1">Accuracy</div>
                      <div 
                        className={cn(
                          "text-2xl font-bold",
                          getAccuracyColor(
                            selectedPeriod === "24h"
                              ? stats.recentPerformance.last24h.accuracy
                              : selectedPeriod === "7d"
                              ? stats.recentPerformance.last7d.accuracy
                              : stats.recentPerformance.last30d.accuracy
                          )
                        )}
                        data-testid="period-accuracy"
                      >
                        {selectedPeriod === "24h"
                          ? stats.recentPerformance.last24h.accuracy
                          : selectedPeriod === "7d"
                          ? stats.recentPerformance.last7d.accuracy
                          : stats.recentPerformance.last30d.accuracy}%
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6 p-4 rounded-lg bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border border-cyan-500/20">
                    <div className="flex items-center gap-2 text-sm">
                      <Brain className="w-4 h-4 text-cyan-400" />
                      <span className="text-gray-300">
                        ML model continuously learning from {stats.overview.totalResolved} resolved predictions
                      </span>
                    </div>
                  </div>
</motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              <GlassCard glow className="p-6">
                <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-yellow-400" />
                  Top Performing Tokens
                </h2>
                
                {stats.topTokens.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="text-left text-sm text-gray-400 border-b border-gray-700/50">
                          <th className="pb-3 pl-3">Token</th>
                          <th className="pb-3">Predictions</th>
                          <th className="pb-3">Wins</th>
                          <th className="pb-3">Accuracy</th>
                          <th className="pb-3 pr-3">Avg Return</th>
                        </tr>
                      </thead>
                      <tbody>
                        {stats.topTokens.map((token, i) => (
                          <tr 
                            key={token.symbol}
                            className="border-b border-gray-700/30 hover:bg-gray-800/30 transition-colors"
                            data-testid={`token-row-${i}`}
                          >
                            <td className="py-3 pl-3">
                              <div className="flex items-center gap-2">
                                <span className="text-xs text-gray-500">#{i + 1}</span>
                                <span className="font-medium text-white">{token.symbol}</span>
                              </div>
                            </td>
                            <td className="py-3 text-gray-300">{token.predictions}</td>
                            <td className="py-3 text-green-400">{token.wins}</td>
                            <td className={cn("py-3 font-medium", getAccuracyColor(token.accuracy))}>
                              {token.accuracy}%
                            </td>
                            <td className={cn("py-3 pr-3", getReturnColor(token.avgReturn))}>
                              {parseFloat(token.avgReturn) > 0 ? "+" : ""}{token.avgReturn}%
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-400">
                    No token performance data available yet. Make predictions to see analytics.
                  </div>
                )}
</motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="mt-6 text-center text-sm text-gray-500"
            >
              Last updated: {new Date(stats.generatedAt).toLocaleString()}
            </motion.div>
          </>
        ) : (
          <div className="text-center py-16">
            <Brain className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-400 mb-2">No Statistics Available</h3>
            <p className="text-gray-500 mb-6">Start making predictions to see ML analytics</p>
            <Link href="/pulse">
              <Button className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600">
                Go to Pulse Agent
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
