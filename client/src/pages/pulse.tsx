import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { 
  Bot, 
  Target, 
  TrendingUp, 
  TrendingDown, 
  Eye, 
  AlertTriangle,
  Shield,
  Zap,
  Activity,
  Brain,
  BarChart3,
  CheckCircle,
  XCircle,
  Clock,
  Percent,
  Trophy,
  ChevronRight,
  Search
} from "lucide-react";
import { GlassCard, StatCard } from "@/components/glass-card";
import { StrikeAgentWidget } from "@/components/strike-agent-widget";
import { useState } from "react";

interface AccuracyStat {
  id: string;
  ticker: string | null;
  signal: string | null;
  horizon: string | null;
  totalPredictions: number;
  correctPredictions: number;
  winRate: string;
  avgReturn: string | null;
  currentStreak: number | null;
  longestWinStreak: number | null;
}

interface PredictionEvent {
  id: string;
  ticker: string;
  signal: string;
  confidence: string | null;
  priceAtPrediction: string;
  bullishSignals: number;
  bearishSignals: number;
  status: string;
  createdAt: string;
}

export default function PulseDashboard() {
  const [searchTicker, setSearchTicker] = useState('');

  const { data: accuracyData } = useQuery({
    queryKey: ['pulse-accuracy'],
    queryFn: async () => {
      const res = await fetch('/api/pulse/accuracy');
      if (!res.ok) throw new Error('Failed to fetch accuracy');
      return res.json();
    }
  });

  const { data: predictionsData } = useQuery({
    queryKey: ['pulse-predictions', searchTicker],
    queryFn: async () => {
      const url = searchTicker 
        ? `/api/pulse/predictions?ticker=${searchTicker}&limit=20`
        : '/api/pulse/predictions?limit=20';
      const res = await fetch(url);
      if (!res.ok) throw new Error('Failed to fetch predictions');
      return res.json();
    }
  });

  const stats = (accuracyData?.stats || []) as AccuracyStat[];
  const predictions = (predictionsData?.predictions || []) as PredictionEvent[];
  const avgWinRate = accuracyData?.summary?.avgWinRate || 0;

  const getSignalStyle = (signal: string) => {
    switch (signal.toUpperCase()) {
      case 'STRONG_BUY':
        return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      case 'BUY':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'HOLD':
        return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
      case 'SELL':
        return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      case 'STRONG_SELL':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-40 right-20 w-80 h-80 bg-purple-500/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 w-[500px] h-[500px] bg-pink-500/5 rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-4 mb-2">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-[0_0_30px_rgba(0,255,255,0.3)]">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Pulse AI Dashboard
              </h1>
              <p className="text-sm text-white/50">
                AI-Powered Trading Intelligence & Predictions
              </p>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <StatCard 
              value={`${avgWinRate}%`}
              label="Avg Win Rate"
              icon={Trophy}
              live
            />
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
            <StatCard 
              value={stats.reduce((a, b) => a + b.totalPredictions, 0).toString()}
              label="Total Predictions"
              icon={BarChart3}
            />
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <StatCard 
              value={predictions.length.toString()}
              label="Recent Signals"
              icon={Activity}
            />
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
            <StatCard 
              value={stats.length.toString()}
              label="Tracked Assets"
              icon={Target}
            />
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-2"
          >
            <StrikeAgentWidget />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
          >
            <GlassCard glow>
              <div className="p-5">
                <div className="flex items-center gap-2 mb-4">
                  <Shield className="w-5 h-5 text-cyan-400" />
                  <h3 className="text-sm font-bold text-white">Guardian Integration</h3>
                </div>
                <p className="text-xs text-white/50 mb-4">
                  Pulse AI powers Guardian Security Deep Scans with real blockchain data
                </p>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs text-white/70">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Mint Authority Detection</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-white/70">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Freeze Authority Check</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-white/70">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Honeypot Scanning</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-white/70">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Liquidity Lock Verification</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-white/70">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Holder Distribution Analysis</span>
                  </div>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <GlassCard glow>
            <div className="p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Activity className="w-5 h-5 text-cyan-400" />
                  <h3 className="text-sm font-bold text-white">Recent Predictions</h3>
                </div>
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
                  <input
                    type="text"
                    placeholder="Search ticker..."
                    value={searchTicker}
                    onChange={(e) => setSearchTicker(e.target.value.toUpperCase())}
                    className="pl-9 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-xs text-white placeholder-white/30 focus:outline-none focus:border-cyan-500/50 w-40"
                    data-testid="input-search-ticker"
                  />
                </div>
              </div>

              {predictions.length === 0 ? (
                <div className="text-center py-12">
                  <Brain className="w-12 h-12 text-cyan-500/30 mx-auto mb-3" />
                  <p className="text-sm text-white/50 mb-1">No predictions yet</p>
                  <p className="text-xs text-white/30">AI signals will appear here as they're generated</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="text-left text-[10px] text-white/40 uppercase tracking-wider border-b border-white/5">
                        <th className="pb-3 pr-4">Ticker</th>
                        <th className="pb-3 pr-4">Signal</th>
                        <th className="pb-3 pr-4">Confidence</th>
                        <th className="pb-3 pr-4">Price</th>
                        <th className="pb-3 pr-4">Bullish</th>
                        <th className="pb-3 pr-4">Bearish</th>
                        <th className="pb-3">Time</th>
                      </tr>
                    </thead>
                    <tbody>
                      {predictions.map((pred) => (
                        <tr 
                          key={pred.id}
                          className="border-b border-white/5 hover:bg-white/5 transition-colors"
                        >
                          <td className="py-3 pr-4">
                            <span className="text-sm font-semibold text-white">{pred.ticker}</span>
                          </td>
                          <td className="py-3 pr-4">
                            <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${getSignalStyle(pred.signal)} border`}>
                              {pred.signal.replace('_', ' ')}
                            </span>
                          </td>
                          <td className="py-3 pr-4">
                            <span className={`text-xs ${
                              pred.confidence === 'HIGH' ? 'text-emerald-400' :
                              pred.confidence === 'MEDIUM' ? 'text-amber-400' : 'text-white/50'
                            }`}>
                              {pred.confidence || 'N/A'}
                            </span>
                          </td>
                          <td className="py-3 pr-4">
                            <span className="text-xs text-white/70">${pred.priceAtPrediction ? parseFloat(pred.priceAtPrediction).toLocaleString() : '0.00'}</span>
                          </td>
                          <td className="py-3 pr-4">
                            <span className="text-xs text-emerald-400">{pred.bullishSignals}</span>
                          </td>
                          <td className="py-3 pr-4">
                            <span className="text-xs text-red-400">{pred.bearishSignals}</span>
                          </td>
                          <td className="py-3">
                            <span className="text-xs text-white/40">
                              {new Date(pred.createdAt).toLocaleTimeString()}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </GlassCard>
        </motion.div>

        {stats.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-8"
          >
            <GlassCard glow>
              <div className="p-5">
                <div className="flex items-center gap-2 mb-4">
                  <Percent className="w-5 h-5 text-cyan-400" />
                  <h3 className="text-sm font-bold text-white">Accuracy Statistics</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {stats.slice(0, 6).map((stat) => (
                    <div
                      key={stat.id}
                      className="bg-white/5 rounded-lg p-4 border border-white/10"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-semibold text-white">
                          {stat.ticker || 'All Assets'}
                        </span>
                        <span className={`text-lg font-bold ${
                          parseFloat(stat.winRate || '0') >= 60 ? 'text-emerald-400' :
                          parseFloat(stat.winRate || '0') >= 50 ? 'text-amber-400' : 'text-red-400'
                        }`}>
                          {parseFloat(stat.winRate || '0').toFixed(1)}%
                        </span>
                      </div>
                      <div className="flex justify-between text-xs text-white/50">
                        <span>{stat.correctPredictions}/{stat.totalPredictions} correct</span>
                        {stat.currentStreak !== null && (
                          <span className={stat.currentStreak > 0 ? 'text-emerald-400' : 'text-red-400'}>
                            {stat.currentStreak > 0 ? '+' : ''}{stat.currentStreak} streak
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </GlassCard>
          </motion.div>
        )}
      </div>
    </div>
  );
}
