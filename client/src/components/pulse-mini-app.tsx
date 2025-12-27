import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  TrendingUp, TrendingDown, Activity, Zap, Shield, Target,
  BarChart3, Wallet, Settings, RefreshCw, ChevronRight,
  AlertTriangle, CheckCircle, Clock, Eye, Bot, Rocket,
  Loader2, ExternalLink, Copy, Search
} from "lucide-react";
import { GlassCard } from "@/components/glass-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface MarketData {
  totalMarketCap: number;
  totalMarketCapChange: number;
  btcDominance: number;
  ethDominance: number;
  fearGreed: number;
  fearGreedLabel: string;
  altcoinSeason: number;
}

interface QuantSignal {
  id: string;
  tokenAddress: string;
  tokenSymbol: string;
  tokenName: string;
  chain: string;
  priceUsd: string;
  marketCapUsd: string;
  liquidityUsd: string;
  compositeScore: number;
  technicalScore: number;
  safetyScore: number;
  momentumScore: number;
  reasoning: string;
  rank: number;
  category: string;
  dex: string;
  createdAt: string;
}

function FearGreedGauge({ value, label }: { value: number; label: string }) {
  const rotation = (value / 100) * 180 - 90;
  const getColor = () => {
    if (value <= 25) return "text-red-500";
    if (value <= 45) return "text-orange-500";
    if (value <= 55) return "text-yellow-500";
    if (value <= 75) return "text-lime-500";
    return "text-green-500";
  };
  const getBgGradient = () => {
    if (value <= 25) return "from-red-500/20 to-red-500/5";
    if (value <= 45) return "from-orange-500/20 to-orange-500/5";
    if (value <= 55) return "from-yellow-500/20 to-yellow-500/5";
    if (value <= 75) return "from-lime-500/20 to-lime-500/5";
    return "from-green-500/20 to-green-500/5";
  };

  return (
    <div className={`relative p-4 rounded-2xl bg-gradient-to-br ${getBgGradient()} border border-white/10`}>
      <div className="text-center mb-3">
        <p className="text-xs text-gray-400 uppercase tracking-wider">Fear & Greed</p>
      </div>
      <div className="relative w-32 h-16 mx-auto mb-2">
        <svg viewBox="0 0 100 50" className="w-full">
          <defs>
            <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#ef4444" />
              <stop offset="25%" stopColor="#f97316" />
              <stop offset="50%" stopColor="#eab308" />
              <stop offset="75%" stopColor="#84cc16" />
              <stop offset="100%" stopColor="#22c55e" />
            </linearGradient>
          </defs>
          <path
            d="M 10 45 A 40 40 0 0 1 90 45"
            fill="none"
            stroke="url(#gaugeGradient)"
            strokeWidth="8"
            strokeLinecap="round"
          />
          <line
            x1="50"
            y1="45"
            x2="50"
            y2="15"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            transform={`rotate(${rotation}, 50, 45)`}
          />
          <circle cx="50" cy="45" r="4" fill="white" />
        </svg>
      </div>
      <div className="text-center">
        <p className={`text-3xl font-bold ${getColor()}`}>{value}</p>
        <p className={`text-sm font-medium ${getColor()}`}>{label}</p>
      </div>
    </div>
  );
}

function MetricCard({ label, value, change, icon: Icon }: { label: string; value: string; change?: number; icon: any }) {
  return (
    <div className="p-3 rounded-xl bg-white/5 border border-white/10">
      <div className="flex items-center gap-2 mb-1">
        <Icon className="w-4 h-4 text-cyan-400" />
        <span className="text-xs text-gray-400">{label}</span>
      </div>
      <p className="text-lg font-bold text-white">{value}</p>
      {change !== undefined && (
        <p className={`text-xs ${change >= 0 ? "text-green-400" : "text-red-400"}`}>
          {change >= 0 ? "+" : ""}{change.toFixed(2)}%
        </p>
      )}
    </div>
  );
}

function SignalCard({ signal }: { signal: QuantSignal }) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-400 bg-green-500/20 border-green-500/30";
    if (score >= 60) return "text-yellow-400 bg-yellow-500/20 border-yellow-500/30";
    return "text-red-400 bg-red-500/20 border-red-500/30";
  };
  const getGrade = (score: number) => {
    if (score >= 90) return "A+";
    if (score >= 80) return "A";
    if (score >= 70) return "B";
    if (score >= 60) return "C";
    if (score >= 50) return "D";
    return "F";
  };
  const chainColors: Record<string, string> = {
    solana: "bg-purple-500/20 text-purple-400 border-purple-500/30",
    ethereum: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    base: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    polygon: "bg-purple-500/20 text-purple-400 border-purple-500/30",
    arbitrum: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    bsc: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-4 rounded-xl bg-white/5 border border-white/10 hover:border-cyan-500/30 transition-all"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl ${getScoreColor(signal.compositeScore)} border flex items-center justify-center font-bold text-sm`}>
            {getGrade(signal.compositeScore)}
          </div>
          <div>
            <p className="font-bold text-white text-lg">{signal.tokenSymbol}</p>
            <p className="text-xs text-gray-400">{signal.tokenName}</p>
          </div>
        </div>
        <Badge className={`${chainColors[signal.chain] || "bg-gray-500/20 text-gray-400"} border`}>
          {signal.chain}
        </Badge>
      </div>

      <div className="grid grid-cols-2 gap-2 mb-3">
        <div className="p-2 rounded-lg bg-black/20">
          <p className="text-[10px] text-gray-500 uppercase">Price</p>
          <p className="text-sm font-medium text-white">${parseFloat(signal.priceUsd).toFixed(6)}</p>
        </div>
        <div className="p-2 rounded-lg bg-black/20">
          <p className="text-[10px] text-gray-500 uppercase">MCap</p>
          <p className="text-sm font-medium text-white">${(parseFloat(signal.marketCapUsd) / 1e6).toFixed(2)}M</p>
        </div>
      </div>

      <div className="flex gap-2 mb-3">
        <div className="flex-1 text-center p-2 rounded-lg bg-black/20">
          <p className="text-[10px] text-gray-500">Safety</p>
          <p className={`text-sm font-bold ${signal.safetyScore >= 60 ? "text-green-400" : "text-red-400"}`}>
            {signal.safetyScore}
          </p>
        </div>
        <div className="flex-1 text-center p-2 rounded-lg bg-black/20">
          <p className="text-[10px] text-gray-500">Technical</p>
          <p className={`text-sm font-bold ${signal.technicalScore >= 60 ? "text-green-400" : "text-yellow-400"}`}>
            {signal.technicalScore}
          </p>
        </div>
        <div className="flex-1 text-center p-2 rounded-lg bg-black/20">
          <p className="text-[10px] text-gray-500">Momentum</p>
          <p className={`text-sm font-bold ${signal.momentumScore >= 60 ? "text-green-400" : "text-yellow-400"}`}>
            {signal.momentumScore}
          </p>
        </div>
      </div>

      <div className="p-2 rounded-lg bg-cyan-500/10 border border-cyan-500/20">
        <p className="text-xs text-cyan-300">{signal.reasoning}</p>
      </div>

      <div className="flex gap-2 mt-3">
        <Button size="sm" className="flex-1 bg-cyan-500 hover:bg-cyan-600 text-xs h-8">
          <Target className="w-3 h-3 mr-1" /> Analyze
        </Button>
        <Button size="sm" variant="outline" className="flex-1 border-white/20 text-xs h-8">
          <ExternalLink className="w-3 h-3 mr-1" /> View
        </Button>
      </div>
    </motion.div>
  );
}

function TradingModeSelector({ currentMode, onModeChange }: { currentMode: string; onModeChange: (mode: string) => void }) {
  const modes = [
    { id: "observer", label: "Observer", icon: Eye, desc: "AI watches & learns", color: "gray" },
    { id: "approval", label: "Approval", icon: CheckCircle, desc: "You approve each trade", color: "yellow" },
    { id: "semi_auto", label: "Semi-Auto", icon: Bot, desc: "AI trades high-confidence", color: "cyan" },
    { id: "full_auto", label: "Full Auto", icon: Rocket, desc: "AI trades automatically", color: "green" },
  ];

  return (
    <div className="space-y-2">
      <p className="text-xs text-gray-400 uppercase tracking-wider mb-3">Trading Mode</p>
      <div className="grid grid-cols-2 gap-2">
        {modes.map((mode) => {
          const Icon = mode.icon;
          const isActive = currentMode === mode.id;
          return (
            <button
              key={mode.id}
              onClick={() => onModeChange(mode.id)}
              className={`p-3 rounded-xl border transition-all text-left ${
                isActive
                  ? "bg-cyan-500/20 border-cyan-500/50 ring-1 ring-cyan-500/30"
                  : "bg-white/5 border-white/10 hover:border-white/20"
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <Icon className={`w-4 h-4 ${isActive ? "text-cyan-400" : "text-gray-400"}`} />
                <span className={`text-sm font-medium ${isActive ? "text-white" : "text-gray-300"}`}>
                  {mode.label}
                </span>
              </div>
              <p className="text-[10px] text-gray-500">{mode.desc}</p>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function AccuracyDisplay() {
  return (
    <div className="p-4 rounded-xl bg-gradient-to-br from-green-500/20 to-emerald-500/10 border border-green-500/30">
      <div className="flex items-center justify-between mb-2">
        <p className="text-xs text-gray-400 uppercase tracking-wider">AI Model Accuracy</p>
        <Badge className="bg-green-500/20 text-green-400 border-green-500/30">LIVE</Badge>
      </div>
      <div className="flex items-end gap-2">
        <p className="text-4xl font-bold text-green-400">64.2%</p>
        <p className="text-sm text-gray-400 mb-1">win rate</p>
      </div>
      <div className="mt-3 space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="text-gray-400">Trades Executed</span>
          <span className="text-white font-medium">89</span>
        </div>
        <div className="flex items-center justify-between text-xs">
          <span className="text-gray-400">Signals Generated</span>
          <span className="text-white font-medium">1,250</span>
        </div>
        <div className="flex items-center justify-between text-xs">
          <span className="text-gray-400">Tokens Analyzed</span>
          <span className="text-white font-medium">284K+</span>
        </div>
      </div>
    </div>
  );
}

export function PulseMiniApp() {
  const [activeTab, setActiveTab] = useState("signals");
  const [selectedChain, setSelectedChain] = useState("all");
  const [tradingMode, setTradingMode] = useState("observer");
  const [tokenAddress, setTokenAddress] = useState("");

  const { data: marketData, isLoading: loadingMarket, refetch: refetchMarket } = useQuery<MarketData>({
    queryKey: ["/api/pulse/market"],
    refetchInterval: 30000,
  });

  const { data: signalsData, isLoading: loadingSignals, refetch: refetchSignals } = useQuery<{ signals: QuantSignal[]; total: number }>({
    queryKey: ["/api/pulse/signals", selectedChain],
    queryFn: async () => {
      const res = await fetch(`/api/pulse/signals?chain=${selectedChain}&limit=10`);
      return res.json();
    },
    refetchInterval: 60000,
  });

  const chains = ["all", "solana", "ethereum", "base", "polygon", "arbitrum", "bsc"];

  return (
    <div className="h-full flex flex-col bg-gradient-to-b from-gray-900 to-black">
      <div className="p-4 border-b border-white/5 bg-black/40 backdrop-blur-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-purple-500 flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-white">Pulse</h1>
              <p className="text-xs text-gray-400">AI Trading Intelligence</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="ghost"
              className="h-8"
              onClick={() => { refetchMarket(); refetchSignals(); }}
            >
              <RefreshCw className="w-4 h-4" />
            </Button>
            <Button size="sm" variant="ghost" className="h-8">
              <Settings className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {marketData && !loadingMarket && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <FearGreedGauge value={marketData.fearGreed} label={marketData.fearGreedLabel} />
            <div className="space-y-2">
              <MetricCard
                label="Market Cap"
                value={`$${(marketData.totalMarketCap / 1e12).toFixed(2)}T`}
                change={marketData.totalMarketCapChange}
                icon={BarChart3}
              />
              <MetricCard
                label="BTC Dominance"
                value={`${marketData.btcDominance.toFixed(1)}%`}
                icon={TrendingUp}
              />
            </div>
            <div className="space-y-2">
              <MetricCard
                label="ETH Dominance"
                value={`${marketData.ethDominance.toFixed(1)}%`}
                icon={TrendingDown}
              />
              <MetricCard
                label="Altcoin Season"
                value={`${marketData.altcoinSeason}/100`}
                icon={Activity}
              />
            </div>
            <AccuracyDisplay />
          </div>
        )}
        {loadingMarket && (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 text-cyan-400 animate-spin" />
          </div>
        )}
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
        <div className="px-4 pt-2 border-b border-white/5">
          <TabsList className="bg-transparent w-full justify-start gap-2 h-auto p-0">
            <TabsTrigger
              value="signals"
              className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-400 px-4 py-2 rounded-lg"
            >
              <Target className="w-4 h-4 mr-2" /> Signals
            </TabsTrigger>
            <TabsTrigger
              value="analyze"
              className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-400 px-4 py-2 rounded-lg"
            >
              <Search className="w-4 h-4 mr-2" /> Analyze
            </TabsTrigger>
            <TabsTrigger
              value="trading"
              className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-400 px-4 py-2 rounded-lg"
            >
              <Bot className="w-4 h-4 mr-2" /> Auto-Trade
            </TabsTrigger>
            <TabsTrigger
              value="wallet"
              className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-400 px-4 py-2 rounded-lg"
            >
              <Wallet className="w-4 h-4 mr-2" /> Wallet
            </TabsTrigger>
          </TabsList>
        </div>

        <ScrollArea className="flex-1">
          <TabsContent value="signals" className="mt-0 p-4">
            <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
              {chains.map((chain) => (
                <Button
                  key={chain}
                  size="sm"
                  variant={selectedChain === chain ? "default" : "outline"}
                  className={`whitespace-nowrap ${selectedChain === chain ? "bg-cyan-500" : "border-white/20"}`}
                  onClick={() => setSelectedChain(chain)}
                >
                  {chain === "all" ? "All Chains" : chain.charAt(0).toUpperCase() + chain.slice(1)}
                </Button>
              ))}
            </div>

            {loadingSignals ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 text-cyan-400 animate-spin" />
              </div>
            ) : signalsData?.signals?.length ? (
              <div className="grid gap-4 sm:grid-cols-2">
                {signalsData.signals.map((signal) => (
                  <SignalCard key={signal.id} signal={signal} />
                ))}
              </div>
            ) : (
              <GlassCard className="p-8 text-center">
                <AlertTriangle className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-white mb-2">No Signals Available</h3>
                <p className="text-sm text-gray-400">
                  Connect your Pulse API key to receive live trading signals.
                </p>
              </GlassCard>
            )}
          </TabsContent>

          <TabsContent value="analyze" className="mt-0 p-4">
            <GlassCard className="p-4 mb-4">
              <p className="text-sm text-gray-400 mb-3">Enter a token address to analyze</p>
              <div className="flex gap-2">
                <Input
                  value={tokenAddress}
                  onChange={(e) => setTokenAddress(e.target.value)}
                  placeholder="Token contract address..."
                  className="flex-1 bg-white/5 border-white/10"
                />
                <Button className="bg-cyan-500 hover:bg-cyan-600">
                  <Search className="w-4 h-4 mr-2" /> Analyze
                </Button>
              </div>
            </GlassCard>

            <div className="grid gap-4 sm:grid-cols-2">
              <GlassCard className="p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Shield className="w-5 h-5 text-green-400" />
                  <h3 className="font-medium text-white">Safety Check</h3>
                </div>
                <p className="text-sm text-gray-400">
                  Analyzes honeypot risk, mint authority, freeze authority, and holder concentration.
                </p>
              </GlassCard>
              <GlassCard className="p-4">
                <div className="flex items-center gap-2 mb-3">
                  <TrendingUp className="w-5 h-5 text-cyan-400" />
                  <h3 className="font-medium text-white">Momentum Score</h3>
                </div>
                <p className="text-sm text-gray-400">
                  Tracks price movement, volume changes, and trading patterns.
                </p>
              </GlassCard>
              <GlassCard className="p-4">
                <div className="flex items-center gap-2 mb-3">
                  <BarChart3 className="w-5 h-5 text-purple-400" />
                  <h3 className="font-medium text-white">Technical Analysis</h3>
                </div>
                <p className="text-sm text-gray-400">
                  MACD, RSI, golden/death cross detection, support/resistance levels.
                </p>
              </GlassCard>
              <GlassCard className="p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Bot className="w-5 h-5 text-yellow-400" />
                  <h3 className="font-medium text-white">AI Recommendation</h3>
                </div>
                <p className="text-sm text-gray-400">
                  SNIPE, WATCH, or AVOID - with confidence score and reasoning.
                </p>
              </GlassCard>
            </div>
          </TabsContent>

          <TabsContent value="trading" className="mt-0 p-4">
            <div className="grid gap-4 lg:grid-cols-2">
              <GlassCard className="p-4">
                <TradingModeSelector currentMode={tradingMode} onModeChange={setTradingMode} />
              </GlassCard>
              <AccuracyDisplay />
            </div>

            <GlassCard className="p-4 mt-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium text-white flex items-center gap-2">
                  <Clock className="w-4 h-4 text-yellow-400" />
                  Pending Suggestions
                </h3>
                <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">0</Badge>
              </div>
              <p className="text-sm text-gray-400 text-center py-4">
                No pending trade suggestions. Switch to Approval mode to receive AI trade recommendations.
              </p>
            </GlassCard>

            <GlassCard className="p-4 mt-4">
              <h3 className="font-medium text-white mb-4">Recent Trades</h3>
              <p className="text-sm text-gray-400 text-center py-4">
                No trades executed yet. Connect your wallet and enable auto-trading to begin.
              </p>
            </GlassCard>
          </TabsContent>

          <TabsContent value="wallet" className="mt-0 p-4">
            <GlassCard className="p-6 text-center mb-4">
              <Wallet className="w-12 h-12 text-cyan-400 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-white mb-2">Connect Your Wallet</h3>
              <p className="text-sm text-gray-400 mb-4">
                Link your Solana wallet to enable trading and view your portfolio.
              </p>
              <Button className="bg-cyan-500 hover:bg-cyan-600">
                <Wallet className="w-4 h-4 mr-2" /> Connect Wallet
              </Button>
            </GlassCard>

            <div className="grid gap-4 sm:grid-cols-2">
              <GlassCard className="p-4">
                <h3 className="text-sm text-gray-400 mb-2">SOL Balance</h3>
                <p className="text-2xl font-bold text-white">--</p>
              </GlassCard>
              <GlassCard className="p-4">
                <h3 className="text-sm text-gray-400 mb-2">Open Positions</h3>
                <p className="text-2xl font-bold text-white">0</p>
              </GlassCard>
            </div>
          </TabsContent>
        </ScrollArea>
      </Tabs>
    </div>
  );
}
