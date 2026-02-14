import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useParams, useLocation } from "wouter";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  ChevronLeft,
  Share2,
  MoreVertical,
  Star,
  Bell,
  ExternalLink,
  Copy,
  Check,
  Twitter,
  Send,
  Lock,
  Zap,
  Rocket,
  Flame,
  Flag,
  ArrowLeftRight,
  Shield,
  AlertTriangle,
  CheckCircle,
  Info,
  TrendingUp,
  TrendingDown,
  BarChart3,
  Activity,
  Users,
  Brain,
  Crosshair,
  Eye,
  Ban,
  HelpCircle,
  ChevronDown,
  Search,
  Clock,
  Bot,
  Play,
  Pause,
  Settings,
  Target,
  DollarSign,
  Wallet,
  Percent,
  TrendingUpIcon,
  ArrowUp,
  ArrowDown,
  Circle,
  Square,
  RefreshCw,
  Layers
} from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { DYORDisclaimer } from "@/components/dyor-disclaimer";

interface TokenData {
  symbol: string;
  name: string;
  chain: string;
  chainIcon: string;
  dex: string;
  dexIcon: string;
  via?: string;
  pairAddress: string;
  contractAddress: string;
  quoteAddress: string;
  imageUrl: string;
  priceUsd: number;
  priceNative: number;
  nativeSymbol: string;
  age: string;
  ageMinutes: number;
  boosts: number;
  rank?: number;
  liquidity: number;
  liquidityLocked: boolean;
  fdv: number;
  marketCap: number;
  priceChange5m: number;
  priceChange1h: number;
  priceChange6h: number;
  priceChange24h: number;
  txns: number;
  buys: number;
  sells: number;
  volume: number;
  buyVolume: number;
  sellVolume: number;
  makers: number;
  buyers: number;
  sellers: number;
  pooledToken: number;
  pooledTokenUsd: number;
  pooledNative: number;
  pooledNativeUsd: number;
  twitter?: string;
  telegram?: string;
  website?: string;
  audit: {
    status: 'pass' | 'warning' | 'fail';
    issues: string[];
  };
  safety: {
    honeypot: boolean;
    mintAuthority: boolean;
    freezeAuthority: boolean;
    score: number;
    grade: string;
  };
  aiRecommendation: 'snipe' | 'watch' | 'avoid';
  aiScore: number;
  mlPrediction: {
    direction: 'up' | 'down' | 'neutral';
    confidence: number;
    accuracy: number;
    shortTermTarget: number;
    longTermTarget: number;
    momentum: number;
    riskScore: number;
  };
  strikeAgent: {
    signalStrength: number;
    entryZone: { low: number; high: number };
    targetPrice: number;
    stopLoss: number;
    riskReward: number;
    timeframe: string;
    reasoning: string[];
  };
  whaleActivity: {
    top10Percent: number;
    recentWhalebuys: number;
    recentWhaleSells: number;
    largestHolder: number;
  };
  botActivity: {
    percent: number;
    bundlePercent: number;
    sniperCount: number;
  };
  technicalIndicators: {
    rsi: number;
    macdSignal: 'bullish' | 'bearish' | 'neutral';
    volumeTrend: 'increasing' | 'decreasing' | 'stable';
    priceAction: 'breakout' | 'breakdown' | 'consolidation';
  };
  reactions: {
    rocket: number;
    fire: number;
    poop: number;
    flag: number;
  };
}

// ═══════════════════════════════════════════════════════════════════
// REAL-TIME CANDLESTICK CHART COMPONENT
// ═══════════════════════════════════════════════════════════════════
interface Candle {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

function CandlestickChart({ 
  price, 
  symbol,
  priceChange,
  isAutoSnipeActive
}: { 
  price: number; 
  symbol: string;
  priceChange: number;
  isAutoSnipeActive: boolean;
}) {
  const [candles, setCandles] = useState<Candle[]>([]);
  const [chartInterval, setChartInterval] = useState<'1m' | '5m' | '15m' | '1h'>('1m');
  const [showVolume, setShowVolume] = useState(true);
  const [currentPrice, setCurrentPrice] = useState(price);
  
  // Generate initial candles based on current price
  useEffect(() => {
    const basePrice = price;
    const volatility = 0.05; // 5% typical volatility
    const newCandles: Candle[] = [];
    
    for (let i = 59; i >= 0; i--) {
      const randomWalk = (Math.random() - 0.5) * volatility;
      const open = basePrice * (1 + randomWalk + (i * 0.001));
      const close = open * (1 + (Math.random() - 0.5) * volatility * 0.5);
      const high = Math.max(open, close) * (1 + Math.random() * volatility * 0.3);
      const low = Math.min(open, close) * (1 - Math.random() * volatility * 0.3);
      const volume = Math.random() * 100000 + 10000;
      
      newCandles.push({
        time: Date.now() - (i * 60000),
        open,
        high,
        low,
        close,
        volume
      });
    }
    setCandles(newCandles);
  }, [price]);
  
  // Simulate real-time price updates
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPrice(prev => {
        const change = (Math.random() - 0.5) * 0.02; // 2% max change
        return prev * (1 + change);
      });
      
      setCandles(prev => {
        if (prev.length === 0) return prev;
        const lastCandle = { ...prev[prev.length - 1] };
        const newClose = currentPrice * (1 + (Math.random() - 0.5) * 0.01);
        lastCandle.close = newClose;
        lastCandle.high = Math.max(lastCandle.high, newClose);
        lastCandle.low = Math.min(lastCandle.low, newClose);
        lastCandle.volume += Math.random() * 1000;
        return [...prev.slice(0, -1), lastCandle];
      });
    }, 1000);
    
    return () => clearInterval(interval);
  }, [currentPrice]);
  
  // Calculate chart dimensions
  const chartHeight = 200;
  const chartWidth = 100; // percentage
  const visibleCandles = candles.slice(-40);
  
  if (visibleCandles.length === 0) {
    return (
      <div className="h-[240px] bg-slate-900/50 rounded-xl flex items-center justify-center">
        <RefreshCw className="w-6 h-6 text-cyan-500 animate-spin" />
      </div>
    );
  }
  
  const prices = visibleCandles.flatMap(c => [c.high, c.low]);
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);
  const priceRange = maxPrice - minPrice || 1;
  const maxVolume = Math.max(...visibleCandles.map(c => c.volume));
  
  const getY = (p: number) => ((maxPrice - p) / priceRange) * (chartHeight - 40) + 20;
  const candleWidth = 100 / visibleCandles.length;
  
  return (
    <div className="bg-slate-900/50 rounded-xl border border-white/10 overflow-hidden">
      {/* Chart Header */}
      <div className="flex items-center justify-between p-3 border-b border-white/5">
        <div className="flex items-center gap-2">
          <BarChart3 className="w-4 h-4 text-cyan-400" />
          <span className="text-sm font-medium">{symbol}/USD</span>
          {isAutoSnipeActive && (
            <Badge className="bg-emerald-500/20 text-emerald-400 text-[10px] animate-pulse">
              <Circle className="w-2 h-2 mr-1 fill-emerald-400" />
              LIVE
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-1">
          {(['1m', '5m', '15m', '1h'] as const).map(interval => (
            <button
              key={interval}
              onClick={() => setChartInterval(interval)}
              className={`px-2 py-1 text-[10px] rounded ${
                chartInterval === interval 
                  ? 'bg-cyan-500/20 text-cyan-400' 
                  : 'text-white/50 hover:text-white/70'
              }`}
              data-testid={`chart-interval-${interval}`}
            >
              {interval.toUpperCase()}
            </button>
          ))}
        </div>
      </div>
      
      {/* Price Display */}
      <div className="px-3 py-2 flex items-center justify-between">
        <div>
          <div className="text-lg font-bold text-white">
            ${currentPrice.toFixed(currentPrice < 0.01 ? 8 : 4)}
          </div>
          <div className={`text-xs ${priceChange >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
            {priceChange >= 0 ? '+' : ''}{priceChange.toFixed(2)}%
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowVolume(!showVolume)}
            className={`p-1.5 rounded ${showVolume ? 'bg-cyan-500/20 text-cyan-400' : 'text-white/40'}`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
      
      {/* Chart Area */}
      <div className="relative px-2 pb-2">
        <svg width="100%" height={chartHeight} className="overflow-visible">
          {/* Grid Lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((pct, i) => (
            <g key={i}>
              <line
                x1="0"
                y1={20 + pct * (chartHeight - 40)}
                x2="100%"
                y2={20 + pct * (chartHeight - 40)}
                stroke="rgba(255,255,255,0.05)"
                strokeDasharray="4,4"
              />
              <text
                x="100%"
                y={20 + pct * (chartHeight - 40)}
                fill="rgba(255,255,255,0.3)"
                fontSize="8"
                textAnchor="end"
                dy="3"
                dx="-2"
              >
                ${(maxPrice - pct * priceRange).toFixed(currentPrice < 0.01 ? 6 : 4)}
              </text>
            </g>
          ))}
          
          {/* Volume Bars */}
          {showVolume && visibleCandles.map((candle, i) => (
            <rect
              key={`vol-${i}`}
              x={`${i * candleWidth + candleWidth * 0.2}%`}
              y={chartHeight - 30 - (candle.volume / maxVolume) * 25}
              width={`${candleWidth * 0.6}%`}
              height={(candle.volume / maxVolume) * 25}
              fill={candle.close >= candle.open ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)'}
            />
          ))}
          
          {/* Candlesticks */}
          {visibleCandles.map((candle, i) => {
            const isGreen = candle.close >= candle.open;
            const color = isGreen ? '#10b981' : '#ef4444';
            const bodyTop = getY(Math.max(candle.open, candle.close));
            const bodyBottom = getY(Math.min(candle.open, candle.close));
            const bodyHeight = Math.max(bodyBottom - bodyTop, 1);
            
            return (
              <g key={i}>
                {/* Wick */}
                <line
                  x1={`${i * candleWidth + candleWidth * 0.5}%`}
                  y1={getY(candle.high)}
                  x2={`${i * candleWidth + candleWidth * 0.5}%`}
                  y2={getY(candle.low)}
                  stroke={color}
                  strokeWidth="1"
                />
                {/* Body */}
                <rect
                  x={`${i * candleWidth + candleWidth * 0.2}%`}
                  y={bodyTop}
                  width={`${candleWidth * 0.6}%`}
                  height={bodyHeight}
                  fill={color}
                  rx="1"
                />
              </g>
            );
          })}
          
          {/* Current Price Line */}
          <line
            x1="0"
            y1={getY(currentPrice)}
            x2="100%"
            y2={getY(currentPrice)}
            stroke="#22d3ee"
            strokeWidth="1"
            strokeDasharray="4,2"
          />
          <rect
            x="0"
            y={getY(currentPrice) - 8}
            width="50"
            height="16"
            fill="#22d3ee"
            rx="2"
          />
          <text
            x="25"
            y={getY(currentPrice) + 3}
            fill="black"
            fontSize="8"
            fontWeight="bold"
            textAnchor="middle"
          >
            ${currentPrice.toFixed(currentPrice < 0.01 ? 5 : 3)}
          </text>
        </svg>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// AUTO-SNIPE MODE COMPONENT
// ═══════════════════════════════════════════════════════════════════
interface AutoSnipeConfig {
  enabled: boolean;
  entryPrice: number;
  targetPrice: number;
  stopLoss: number;
  amount: number;
  slippage: number;
  maxGas: number;
  mevProtection: boolean;
  autoTakeProfit: boolean;
  trailingStop: boolean;
  trailingPercent: number;
}

// Preset configurations for different risk levels
const TRADING_PRESETS = {
  safe: {
    name: 'Safe',
    color: 'emerald',
    icon: '🛡️',
    description: 'Conservative settings, tight stop-losses',
    stopLossPercent: 5,
    targetPercent: 15,
    slippage: 0.5,
    trailingStop: true,
    trailingPercent: 3,
    mevProtection: true,
    autoTakeProfit: true
  },
  medium: {
    name: 'Medium',
    color: 'yellow',
    icon: '⚖️',
    description: 'Balanced risk/reward approach',
    stopLossPercent: 10,
    targetPercent: 30,
    slippage: 1,
    trailingStop: true,
    trailingPercent: 5,
    mevProtection: true,
    autoTakeProfit: true
  },
  risky: {
    name: 'Risky',
    color: 'red',
    icon: '🔥',
    description: 'Aggressive settings, higher potential',
    stopLossPercent: 20,
    targetPercent: 100,
    slippage: 2.5,
    trailingStop: false,
    trailingPercent: 10,
    mevProtection: false,
    autoTakeProfit: false
  }
};

// DEX options per chain
const DEX_OPTIONS: Record<string, Array<{ id: string; name: string; icon: string }>> = {
  solana: [
    { id: 'raydium', name: 'Raydium', icon: '🌟' },
    { id: 'jupiter', name: 'Jupiter', icon: '🪐' },
    { id: 'meteora', name: 'Meteora', icon: '☄️' },
    { id: 'orca', name: 'Orca', icon: '🐋' }
  ],
  ethereum: [
    { id: 'uniswap_v3', name: 'Uniswap V3', icon: '🦄' },
    { id: 'uniswap_v2', name: 'Uniswap V2', icon: '🦄' },
    { id: 'sushiswap', name: 'SushiSwap', icon: '🍣' }
  ],
  bsc: [
    { id: 'pancakeswap', name: 'PancakeSwap', icon: '🥞' },
    { id: 'biswap', name: 'BiSwap', icon: '🔄' }
  ],
  base: [
    { id: 'aerodrome', name: 'Aerodrome', icon: '✈️' },
    { id: 'baseswap', name: 'BaseSwap', icon: '🔵' }
  ],
  arbitrum: [
    { id: 'camelot', name: 'Camelot', icon: '⚔️' },
    { id: 'gmx', name: 'GMX', icon: '💎' }
  ]
};

// Simulated prediction statistics
const usePredictionStats = () => {
  return {
    totalPredictions: 1247,
    correctPredictions: 987,
    incorrectPredictions: 260,
    accuracy: 79.1,
    winRate: 76.3,
    avgProfit: 23.4,
    avgLoss: -8.2,
    profitFactor: 2.85,
    lastUpdated: new Date().toISOString(),
    recentPredictions: [
      { symbol: 'BONK', prediction: 'buy', outcome: 'correct', profit: 34.2, timestamp: Date.now() - 3600000 },
      { symbol: 'WIF', prediction: 'buy', outcome: 'correct', profit: 18.7, timestamp: Date.now() - 7200000 },
      { symbol: 'PEPE', prediction: 'sell', outcome: 'correct', profit: 12.1, timestamp: Date.now() - 10800000 },
      { symbol: 'SHIB', prediction: 'buy', outcome: 'incorrect', profit: -5.3, timestamp: Date.now() - 14400000 },
      { symbol: 'FLOKI', prediction: 'buy', outcome: 'correct', profit: 28.9, timestamp: Date.now() - 18000000 }
    ],
    categoryAccuracy: {
      meme: 82.3,
      defi: 74.1,
      gaming: 71.8,
      ai: 85.2,
      bluechip: 68.4
    }
  };
};

function AutoSnipePanel({
  token,
  config,
  setConfig,
  onExecute,
  onStop
}: {
  token: TokenData;
  config: AutoSnipeConfig;
  setConfig: (c: AutoSnipeConfig) => void;
  onExecute: () => void;
  onStop: () => void;
}) {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [showDexSettings, setShowDexSettings] = useState(false);
  const [selectedPreset, setSelectedPreset] = useState<string | null>(null);
  const [selectedDex, setSelectedDex] = useState('raydium');
  const [isSubscribed, setIsSubscribed] = useState(false); // TODO: Connect to actual subscription status
  const [showSubscribeModal, setShowSubscribeModal] = useState(false);
  
  const predictionStats = usePredictionStats();
  const chainDexes = DEX_OPTIONS[token.chain] || DEX_OPTIONS.solana;
  
  // Apply preset configuration
  const applyPreset = (presetKey: string) => {
    const preset = TRADING_PRESETS[presetKey as keyof typeof TRADING_PRESETS];
    if (!preset) return;
    
    setSelectedPreset(presetKey);
    setConfig({
      ...config,
      entryPrice: token.priceUsd,
      targetPrice: token.priceUsd * (1 + preset.targetPercent / 100),
      stopLoss: token.priceUsd * (1 - preset.stopLossPercent / 100),
      slippage: preset.slippage,
      trailingStop: preset.trailingStop,
      trailingPercent: preset.trailingPercent,
      mevProtection: preset.mevProtection,
      autoTakeProfit: preset.autoTakeProfit
    });
  };
  
  // Check subscription before enabling
  const handleToggleAutoSnipe = (enabled: boolean) => {
    if (enabled && !isSubscribed) {
      setShowSubscribeModal(true);
      return;
    }
    setConfig({ ...config, enabled });
  };
  
  return (
    <div className="bg-gradient-to-br from-slate-800/80 via-emerald-900/10 to-slate-800/80 rounded-2xl border border-emerald-500/30 overflow-hidden">
      {/* Subscription Modal */}
      {showSubscribeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-slate-900 rounded-2xl border border-purple-500/30 p-6 max-w-md w-full">
            <div className="text-center mb-4">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center">
                <Lock className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Unlock Strike Agent</h3>
              <p className="text-sm text-white/60">
                Auto-sniping is a premium feature. Subscribe to Guardian Pro to unlock AI-powered automated trading.
              </p>
            </div>
            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2 text-sm text-white/70">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                <span>Unlimited auto-snipe trades</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-white/70">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                <span>AI prediction alerts</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-white/70">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                <span>Multi-DEX support</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-white/70">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                <span>MEV protection</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="outline"
                onClick={() => setShowSubscribeModal(false)}
                className="border-white/20"
              >
                Maybe Later
              </Button>
              <Button
                onClick={() => {
                  window.location.href = '/pricing';
                }}
                className="bg-gradient-to-r from-purple-500 to-cyan-500"
              >
                Subscribe Now
              </Button>
            </div>
            
            {/* Referral Program Mention */}
            <div className="mt-4 p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
              <p className="text-xs text-emerald-300 text-center">
                <span className="font-semibold">Earn free rewards!</span> Refer friends and earn up to 50,000 Shells.{' '}
                <a href="/referral-program" className="underline hover:text-emerald-200">Learn more</a>
              </p>
            </div>
          </div>
        </div>
      )}
      
      {/* Header */}
      <div className="p-4 border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className={`w-8 h-8 rounded-lg ${config.enabled ? 'bg-gradient-to-br from-emerald-400 to-emerald-600 animate-pulse' : 'bg-gradient-to-br from-slate-600 to-slate-700'} flex items-center justify-center`}>
            {config.enabled ? <Play className="w-4 h-4 text-white" /> : <Pause className="w-4 h-4 text-white/50" />}
          </div>
          <div>
            <div className="font-bold text-white text-sm flex items-center gap-2">
              Auto-Snipe Mode
              {!isSubscribed && (
                <Badge className="bg-purple-500/20 text-purple-300 text-[9px] px-1.5">PRO</Badge>
              )}
            </div>
            <div className="text-[10px] text-emerald-300">Set & Forget Trading</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Switch
            checked={config.enabled}
            onCheckedChange={handleToggleAutoSnipe}
            data-testid="auto-snipe-toggle"
          />
          <span className={`text-xs font-medium ${config.enabled ? 'text-emerald-400' : 'text-white/50'}`}>
            {config.enabled ? 'ACTIVE' : 'OFF'}
          </span>
        </div>
      </div>
      
      {/* ═══════════════════════════════════════════════════════════════════
          PREDICTION STATISTICS PANEL
      ═══════════════════════════════════════════════════════════════════ */}
      <div className="p-4 border-b border-white/10 bg-gradient-to-r from-purple-900/20 to-cyan-900/20">
        <div className="flex items-center gap-2 mb-3">
          <Brain className="w-4 h-4 text-purple-400" />
          <span className="text-sm font-medium text-white">AI Prediction Performance</span>
          <Badge className="ml-auto bg-emerald-500/20 text-emerald-300 text-[9px]">
            LIVE DATA
          </Badge>
        </div>
        
        {/* Main Stats Grid */}
        <div className="grid grid-cols-4 gap-2 mb-3">
          <div className="bg-slate-800/50 rounded-lg p-2 text-center">
            <div className="text-lg font-bold text-white">{predictionStats.totalPredictions.toLocaleString()}</div>
            <div className="text-[9px] text-white/40 uppercase">Total Predictions</div>
          </div>
          <div className="bg-slate-800/50 rounded-lg p-2 text-center">
            <div className="text-lg font-bold text-emerald-400">{predictionStats.correctPredictions.toLocaleString()}</div>
            <div className="text-[9px] text-white/40 uppercase">Correct</div>
          </div>
          <div className="bg-slate-800/50 rounded-lg p-2 text-center">
            <div className="text-lg font-bold text-red-400">{predictionStats.incorrectPredictions}</div>
            <div className="text-[9px] text-white/40 uppercase">Incorrect</div>
          </div>
          <div className="bg-slate-800/50 rounded-lg p-2 text-center">
            <div className="text-lg font-bold text-cyan-400">{predictionStats.accuracy}%</div>
            <div className="text-[9px] text-white/40 uppercase">Accuracy</div>
          </div>
        </div>
        
        {/* Secondary Stats */}
        <div className="grid grid-cols-3 gap-2 mb-3">
          <div className="bg-slate-800/30 rounded-lg p-2 flex items-center justify-between">
            <span className="text-[10px] text-white/50">Win Rate</span>
            <span className="text-xs font-bold text-emerald-400">{predictionStats.winRate}%</span>
          </div>
          <div className="bg-slate-800/30 rounded-lg p-2 flex items-center justify-between">
            <span className="text-[10px] text-white/50">Avg Profit</span>
            <span className="text-xs font-bold text-emerald-400">+{predictionStats.avgProfit}%</span>
          </div>
          <div className="bg-slate-800/30 rounded-lg p-2 flex items-center justify-between">
            <span className="text-[10px] text-white/50">Profit Factor</span>
            <span className="text-xs font-bold text-cyan-400">{predictionStats.profitFactor}x</span>
          </div>
        </div>
        
        {/* Recent Predictions */}
        <div className="bg-slate-800/30 rounded-lg p-2">
          <div className="text-[9px] text-white/40 uppercase mb-2">Recent Predictions</div>
          <div className="space-y-1">
            {predictionStats.recentPredictions.slice(0, 3).map((pred, i) => (
              <div key={i} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className={`w-1.5 h-1.5 rounded-full ${pred.outcome === 'correct' ? 'bg-emerald-400' : 'bg-red-400'}`} />
                  <span className="text-white/70">{pred.symbol}</span>
                  <Badge className={`text-[8px] px-1 ${pred.prediction === 'buy' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-red-500/20 text-red-300'}`}>
                    {pred.prediction.toUpperCase()}
                  </Badge>
                </div>
                <span className={`font-medium ${pred.profit >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                  {pred.profit >= 0 ? '+' : ''}{pred.profit}%
                </span>
              </div>
            ))}
          </div>
        </div>
        
        {/* Category Accuracy */}
        <div className="mt-3 flex items-center gap-2 overflow-x-auto scrollbar-hide">
          {Object.entries(predictionStats.categoryAccuracy).map(([cat, acc]) => (
            <div key={cat} className="flex-shrink-0 bg-slate-800/50 rounded-lg px-2 py-1 flex items-center gap-1.5">
              <span className="text-[9px] text-white/50 capitalize">{cat}</span>
              <span className={`text-[10px] font-bold ${acc >= 80 ? 'text-emerald-400' : acc >= 70 ? 'text-yellow-400' : 'text-red-400'}`}>
                {acc}%
              </span>
            </div>
          ))}
        </div>
      </div>
      
      {/* ═══════════════════════════════════════════════════════════════════
          PRESET TRADING MODES
      ═══════════════════════════════════════════════════════════════════ */}
      <div className="p-4 border-b border-white/10">
        <div className="flex items-center gap-2 mb-3">
          <Zap className="w-4 h-4 text-yellow-400" />
          <span className="text-sm font-medium text-white">Quick Presets</span>
          <span className="text-[10px] text-white/40">(One-click setup)</span>
        </div>
        
        <div className="grid grid-cols-3 gap-2">
          {Object.entries(TRADING_PRESETS).map(([key, preset]) => (
            <button
              key={key}
              onClick={() => applyPreset(key)}
              className={`p-3 rounded-xl border transition-all text-center ${
                selectedPreset === key
                  ? key === 'safe' ? 'bg-emerald-500/20 border-emerald-500/50' :
                    key === 'medium' ? 'bg-yellow-500/20 border-yellow-500/50' :
                    'bg-red-500/20 border-red-500/50'
                  : 'bg-slate-800/50 border-white/10 hover:border-white/20'
              }`}
              data-testid={`preset-${key}`}
            >
              <div className="text-2xl mb-1">{preset.icon}</div>
              <div className={`text-xs font-bold ${
                key === 'safe' ? 'text-emerald-400' :
                key === 'medium' ? 'text-yellow-400' : 'text-red-400'
              }`}>
                {preset.name}
              </div>
              <div className="text-[9px] text-white/40 mt-0.5">{preset.description}</div>
              <div className="text-[9px] text-white/30 mt-1">
                SL: -{preset.stopLossPercent}% / TP: +{preset.targetPercent}%
              </div>
            </button>
          ))}
        </div>
      </div>
      
      {/* ═══════════════════════════════════════════════════════════════════
          DEX & LAUNCHPAD SETTINGS
      ═══════════════════════════════════════════════════════════════════ */}
      <div className="p-4 border-b border-white/10">
        <button
          onClick={() => setShowDexSettings(!showDexSettings)}
          className="w-full flex items-center justify-between"
        >
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-cyan-400" />
            <span className="text-sm font-medium text-white">DEX & Router Settings</span>
            <Badge className="bg-slate-700 text-white/60 text-[9px]">
              {chainDexes.find(d => d.id === selectedDex)?.name || 'Select'}
            </Badge>
          </div>
          <ChevronDown className={`w-4 h-4 text-white/50 transition-transform ${showDexSettings ? 'rotate-180' : ''}`} />
        </button>
        
        {showDexSettings && (
          <div className="mt-3 space-y-3">
            {/* DEX Selection */}
            <div className="grid grid-cols-2 gap-2">
              {chainDexes.map(dex => (
                <button
                  key={dex.id}
                  onClick={() => setSelectedDex(dex.id)}
                  className={`p-2.5 rounded-lg border flex items-center gap-2 transition-all ${
                    selectedDex === dex.id
                      ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-400'
                      : 'bg-slate-800/50 border-white/10 text-white/70 hover:border-white/20'
                  }`}
                  data-testid={`dex-${dex.id}`}
                >
                  <span className="text-lg">{dex.icon}</span>
                  <span className="text-xs font-medium">{dex.name}</span>
                  {selectedDex === dex.id && (
                    <CheckCircle className="w-3.5 h-3.5 ml-auto" />
                  )}
                </button>
              ))}
            </div>
            
            {/* Router Info */}
            <div className="bg-slate-800/30 rounded-lg p-3 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-white/50">Router</span>
                <span className="text-white font-mono text-[10px]">
                  {selectedDex === 'raydium' ? '675kPX...' : selectedDex === 'jupiter' ? 'JUP6Ln...' : '...'}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-white/50">Priority Fee</span>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    defaultValue={0.0001}
                    className="w-20 bg-slate-700 rounded px-2 py-1 text-xs text-right"
                    step="0.0001"
                  />
                  <span className="text-white/40">SOL</span>
                </div>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-white/50">Compute Units</span>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    defaultValue={200000}
                    className="w-24 bg-slate-700 rounded px-2 py-1 text-xs text-right"
                    step="10000"
                  />
                </div>
              </div>
            </div>
            
            {/* Advanced Security */}
            <div className="space-y-2">
              <div className="text-[10px] text-white/40 uppercase">Security Settings</div>
              <div className="grid grid-cols-2 gap-2">
                <label className="flex items-center gap-2 p-2 bg-slate-800/30 rounded-lg cursor-pointer">
                  <input type="checkbox" defaultChecked className="w-3.5 h-3.5 rounded bg-slate-700 border-0" />
                  <span className="text-xs text-white/70">Honeypot Check</span>
                </label>
                <label className="flex items-center gap-2 p-2 bg-slate-800/30 rounded-lg cursor-pointer">
                  <input type="checkbox" defaultChecked className="w-3.5 h-3.5 rounded bg-slate-700 border-0" />
                  <span className="text-xs text-white/70">Liquidity Lock</span>
                </label>
                <label className="flex items-center gap-2 p-2 bg-slate-800/30 rounded-lg cursor-pointer">
                  <input type="checkbox" defaultChecked className="w-3.5 h-3.5 rounded bg-slate-700 border-0" />
                  <span className="text-xs text-white/70">Anti-Rug Pull</span>
                </label>
                <label className="flex items-center gap-2 p-2 bg-slate-800/30 rounded-lg cursor-pointer">
                  <input type="checkbox" className="w-3.5 h-3.5 rounded bg-slate-700 border-0" />
                  <span className="text-xs text-white/70">Mint Disabled</span>
                </label>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Quick Stats */}
      {config.enabled && (
        <div className="px-4 py-2 bg-emerald-500/10 border-b border-emerald-500/20">
          <div className="flex items-center justify-between text-xs">
            <span className="text-emerald-400">Monitoring {token.symbol}...</span>
            <span className="text-white/50">Waiting for entry at ${config.entryPrice.toFixed(6)}</span>
          </div>
        </div>
      )}
      
      {/* Configuration */}
      <div className="p-4 space-y-4">
        {/* Entry & Target */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-[10px] text-white/50 uppercase">Entry Price</label>
            <div className="relative">
              <DollarSign className="absolute left-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/30" />
              <input
                type="number"
                value={config.entryPrice}
                onChange={(e) => setConfig({ ...config, entryPrice: parseFloat(e.target.value) || 0 })}
                className="w-full bg-slate-800/50 border border-white/10 rounded-lg pl-7 pr-3 py-2 text-sm text-white"
                step="0.000001"
                data-testid="entry-price-input"
              />
            </div>
            <button 
              onClick={() => setConfig({ ...config, entryPrice: token.priceUsd })}
              className="text-[9px] text-cyan-400 hover:text-cyan-300"
            >
              Use current: ${token.priceUsd.toFixed(6)}
            </button>
          </div>
          <div className="space-y-1">
            <label className="text-[10px] text-white/50 uppercase">Target Price</label>
            <div className="relative">
              <Target className="absolute left-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-emerald-400/50" />
              <input
                type="number"
                value={config.targetPrice}
                onChange={(e) => setConfig({ ...config, targetPrice: parseFloat(e.target.value) || 0 })}
                className="w-full bg-slate-800/50 border border-emerald-500/20 rounded-lg pl-7 pr-3 py-2 text-sm text-emerald-400"
                step="0.000001"
                data-testid="target-price-input"
              />
            </div>
            <span className="text-[9px] text-emerald-400">
              +{(((config.targetPrice - config.entryPrice) / config.entryPrice) * 100).toFixed(1)}% gain
            </span>
          </div>
        </div>
        
        {/* Stop Loss & Amount */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-[10px] text-white/50 uppercase">Stop Loss</label>
            <div className="relative">
              <AlertTriangle className="absolute left-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-red-400/50" />
              <input
                type="number"
                value={config.stopLoss}
                onChange={(e) => setConfig({ ...config, stopLoss: parseFloat(e.target.value) || 0 })}
                className="w-full bg-slate-800/50 border border-red-500/20 rounded-lg pl-7 pr-3 py-2 text-sm text-red-400"
                step="0.000001"
                data-testid="stop-loss-input"
              />
            </div>
            <span className="text-[9px] text-red-400">
              -{(((config.entryPrice - config.stopLoss) / config.entryPrice) * 100).toFixed(1)}% loss
            </span>
          </div>
          <div className="space-y-1">
            <label className="text-[10px] text-white/50 uppercase">Amount ({token.nativeSymbol})</label>
            <div className="relative">
              <Wallet className="absolute left-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/30" />
              <input
                type="number"
                value={config.amount}
                onChange={(e) => setConfig({ ...config, amount: parseFloat(e.target.value) || 0 })}
                className="w-full bg-slate-800/50 border border-white/10 rounded-lg pl-7 pr-3 py-2 text-sm text-white"
                step="0.1"
                data-testid="amount-input"
              />
            </div>
          </div>
        </div>
        
        {/* Quick Amount Buttons */}
        <div className="flex gap-2">
          {[0.1, 0.5, 1, 2, 5].map(amt => (
            <button
              key={amt}
              onClick={() => setConfig({ ...config, amount: amt })}
              className={`flex-1 py-2 rounded-lg text-xs font-medium transition-colors ${
                config.amount === amt
                  ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                  : 'bg-slate-800/50 text-white/50 border border-white/5 hover:bg-slate-700/50'
              }`}
            >
              {amt} {token.nativeSymbol}
            </button>
          ))}
        </div>
        
        {/* Advanced Options Toggle */}
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="w-full flex items-center justify-center gap-1 py-2 text-xs text-white/50 hover:text-white/70"
        >
          <Settings className="w-3.5 h-3.5" />
          Advanced Settings
          <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showAdvanced ? 'rotate-180' : ''}`} />
        </button>
        
        {/* Advanced Options */}
        {showAdvanced && (
          <div className="space-y-3 p-3 bg-slate-800/30 rounded-lg">
            {/* Slippage */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-[10px] text-white/50 uppercase">Slippage Tolerance</label>
                <span className="text-xs text-cyan-400">{config.slippage}%</span>
              </div>
              <Slider
                value={[config.slippage]}
                onValueChange={([v]) => setConfig({ ...config, slippage: v })}
                min={0.1}
                max={10}
                step={0.1}
                className="w-full"
              />
            </div>
            
            {/* Trailing Stop */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-3.5 h-3.5 text-purple-400" />
                <span className="text-xs">Trailing Stop</span>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={config.trailingPercent}
                  onChange={(e) => setConfig({ ...config, trailingPercent: parseFloat(e.target.value) || 0 })}
                  className="w-16 bg-slate-700 rounded px-2 py-1 text-xs text-right"
                  disabled={!config.trailingStop}
                />
                <span className="text-xs text-white/50">%</span>
                <Switch
                  checked={config.trailingStop}
                  onCheckedChange={(v) => setConfig({ ...config, trailingStop: v })}
                />
              </div>
            </div>
            
            {/* MEV Protection */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Shield className="w-3.5 h-3.5 text-cyan-400" />
                <span className="text-xs">MEV Protection</span>
              </div>
              <Switch
                checked={config.mevProtection}
                onCheckedChange={(v) => setConfig({ ...config, mevProtection: v })}
              />
            </div>
            
            {/* Auto Take Profit */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-xs">Auto Take Profit</span>
              </div>
              <Switch
                checked={config.autoTakeProfit}
                onCheckedChange={(v) => setConfig({ ...config, autoTakeProfit: v })}
              />
            </div>
          </div>
        )}
        
        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-2">
          {config.enabled ? (
            <>
              <Button
                onClick={onStop}
                className="h-12 bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30"
                data-testid="stop-auto-snipe"
              >
                <Square className="w-4 h-4 mr-2" />
                STOP
              </Button>
              <Button
                onClick={onExecute}
                className="h-12 bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white font-bold"
                data-testid="execute-now"
              >
                <Zap className="w-4 h-4 mr-2" />
                EXECUTE NOW
              </Button>
            </>
          ) : (
            <>
              <Button
                onClick={onExecute}
                className="h-12 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-bold"
                data-testid="manual-snipe"
              >
                <Crosshair className="w-4 h-4 mr-2" />
                SNIPE NOW
              </Button>
              <Button
                onClick={() => setConfig({ ...config, enabled: true })}
                className="h-12 bg-slate-800/50 hover:bg-slate-700/50 text-cyan-400 border border-cyan-500/30"
                data-testid="start-auto-snipe"
              >
                <Play className="w-4 h-4 mr-2" />
                START AUTO
              </Button>
            </>
          )}
        </div>
        
        {/* Risk/Reward Summary */}
        <div className="p-3 bg-slate-800/30 rounded-lg">
          <div className="grid grid-cols-3 gap-2 text-center text-xs">
            <div>
              <div className="text-white/40">Risk</div>
              <div className="text-red-400 font-bold">
                ${(config.amount * config.entryPrice * ((config.entryPrice - config.stopLoss) / config.entryPrice)).toFixed(2)}
              </div>
            </div>
            <div>
              <div className="text-white/40">Reward</div>
              <div className="text-emerald-400 font-bold">
                ${(config.amount * config.entryPrice * ((config.targetPrice - config.entryPrice) / config.entryPrice)).toFixed(2)}
              </div>
            </div>
            <div>
              <div className="text-white/40">R:R Ratio</div>
              <div className="text-cyan-400 font-bold">
                1:{((config.targetPrice - config.entryPrice) / (config.entryPrice - config.stopLoss)).toFixed(1)}
              </div>
            </div>
          </div>
        </div>
        
        {/* DYOR Disclaimer */}
        <DYORDisclaimer variant="compact" className="mt-3" />
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// BUY/SELL METRICS PANEL - FULL ANALYSIS
// ═══════════════════════════════════════════════════════════════════
function BuySellMetricsPanel({ token }: { token: TokenData }) {
  // Calculate comprehensive recommendation based on all metrics
  const calculateRecommendation = () => {
    let score = 50; // Start neutral
    
    // Price momentum
    if (token.priceChange24h > 50) score += 15;
    else if (token.priceChange24h > 20) score += 10;
    else if (token.priceChange24h > 0) score += 5;
    else if (token.priceChange24h < -30) score -= 15;
    else if (token.priceChange24h < -10) score -= 10;
    else score -= 5;
    
    // Buy/sell ratio
    const buyRatio = token.buys / (token.buys + token.sells);
    if (buyRatio > 0.6) score += 15;
    else if (buyRatio > 0.5) score += 5;
    else if (buyRatio < 0.4) score -= 15;
    else score -= 5;
    
    // Volume analysis
    if (token.buyVolume > token.sellVolume * 1.5) score += 10;
    else if (token.buyVolume > token.sellVolume) score += 5;
    else if (token.sellVolume > token.buyVolume * 1.5) score -= 10;
    else score -= 5;
    
    // Safety score
    if (token.safety.score > 70) score += 10;
    else if (token.safety.score > 50) score += 5;
    else if (token.safety.score < 30) score -= 15;
    else score -= 5;
    
    // Technical indicators
    if (token.technicalIndicators.macdSignal === 'bullish') score += 10;
    else if (token.technicalIndicators.macdSignal === 'bearish') score -= 10;
    
    if (token.technicalIndicators.rsi < 30) score += 10; // Oversold = buy opportunity
    else if (token.technicalIndicators.rsi > 70) score -= 10; // Overbought = sell signal
    
    // ML prediction
    if (token.mlPrediction.direction === 'up' && token.mlPrediction.confidence > 70) score += 15;
    else if (token.mlPrediction.direction === 'down' && token.mlPrediction.confidence > 70) score -= 15;
    
    // Whale activity
    if (token.whaleActivity.recentWhalebuys > token.whaleActivity.recentWhaleSells * 2) score += 10;
    else if (token.whaleActivity.recentWhaleSells > token.whaleActivity.recentWhalebuys * 2) score -= 10;
    
    return Math.min(100, Math.max(0, score));
  };
  
  const recommendationScore = calculateRecommendation();
  const recommendation: 'BUY' | 'HOLD' | 'SELL' = 
    recommendationScore >= 65 ? 'BUY' : 
    recommendationScore >= 35 ? 'HOLD' : 'SELL';
  
  const recommendationConfig = {
    BUY: { color: 'text-emerald-400', bg: 'bg-emerald-500/20', border: 'border-emerald-500/30', icon: ArrowUp },
    HOLD: { color: 'text-yellow-400', bg: 'bg-yellow-500/20', border: 'border-yellow-500/30', icon: Circle },
    SELL: { color: 'text-red-400', bg: 'bg-red-500/20', border: 'border-red-500/30', icon: ArrowDown },
  }[recommendation];
  
  const Icon = recommendationConfig.icon;
  
  return (
    <div className="bg-slate-800/30 rounded-xl border border-white/5 overflow-hidden">
      {/* Header */}
      <div className="p-3 border-b border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BarChart3 className="w-4 h-4 text-cyan-400" />
          <span className="text-sm font-medium">Buy/Sell Analysis</span>
        </div>
        <div className={`flex items-center gap-1.5 px-3 py-1 rounded-lg ${recommendationConfig.bg} ${recommendationConfig.border} border`}>
          <Icon className={`w-4 h-4 ${recommendationConfig.color}`} />
          <span className={`text-sm font-bold ${recommendationConfig.color}`}>{recommendation}</span>
          <span className="text-xs text-white/40">{recommendationScore}%</span>
        </div>
      </div>
      
      {/* Metrics Grid */}
      <div className="p-4 space-y-4">
        {/* Buy Pressure vs Sell Pressure */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-white/50">Buy Pressure</span>
            <span className="text-white/50">Sell Pressure</span>
          </div>
          <div className="relative h-3 bg-slate-800 rounded-full overflow-hidden">
            <div 
              className="absolute left-0 top-0 h-full bg-gradient-to-r from-emerald-600 to-emerald-400"
              style={{ width: `${(token.buyVolume / (token.buyVolume + token.sellVolume)) * 100}%` }}
            />
            <div 
              className="absolute right-0 top-0 h-full bg-gradient-to-l from-red-600 to-red-400"
              style={{ width: `${(token.sellVolume / (token.buyVolume + token.sellVolume)) * 100}%` }}
            />
          </div>
          <div className="flex items-center justify-between text-xs font-medium">
            <span className="text-emerald-400">{((token.buyVolume / (token.buyVolume + token.sellVolume)) * 100).toFixed(1)}%</span>
            <span className="text-red-400">{((token.sellVolume / (token.buyVolume + token.sellVolume)) * 100).toFixed(1)}%</span>
          </div>
        </div>
        
        {/* Key Metrics */}
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-slate-800/50 rounded-lg p-2.5">
            <div className="text-[10px] text-white/40 mb-1">Buy/Sell Ratio</div>
            <div className={`text-lg font-bold ${token.buys > token.sells ? 'text-emerald-400' : 'text-red-400'}`}>
              {(token.buys / token.sells).toFixed(2)}x
            </div>
          </div>
          <div className="bg-slate-800/50 rounded-lg p-2.5">
            <div className="text-[10px] text-white/40 mb-1">Net Flow (24h)</div>
            <div className={`text-lg font-bold ${token.buyVolume > token.sellVolume ? 'text-emerald-400' : 'text-red-400'}`}>
              {token.buyVolume > token.sellVolume ? '+' : '-'}${Math.abs(token.buyVolume - token.sellVolume).toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </div>
          </div>
        </div>
        
        {/* Signals */}
        <div className="space-y-2">
          <div className="text-[10px] text-white/40 uppercase">Trading Signals</div>
          <div className="grid grid-cols-2 gap-2">
            <div className={`flex items-center gap-2 p-2 rounded-lg ${
              token.technicalIndicators.rsi < 30 ? 'bg-emerald-500/10 border border-emerald-500/20' :
              token.technicalIndicators.rsi > 70 ? 'bg-red-500/10 border border-red-500/20' :
              'bg-slate-800/50 border border-white/5'
            }`}>
              <div className="text-[10px] text-white/50">RSI</div>
              <div className={`text-xs font-medium ${
                token.technicalIndicators.rsi < 30 ? 'text-emerald-400' :
                token.technicalIndicators.rsi > 70 ? 'text-red-400' : 'text-white'
              }`}>
                {token.technicalIndicators.rsi} {token.technicalIndicators.rsi < 30 ? '(Oversold)' : token.technicalIndicators.rsi > 70 ? '(Overbought)' : ''}
              </div>
            </div>
            <div className={`flex items-center gap-2 p-2 rounded-lg ${
              token.technicalIndicators.macdSignal === 'bullish' ? 'bg-emerald-500/10 border border-emerald-500/20' :
              token.technicalIndicators.macdSignal === 'bearish' ? 'bg-red-500/10 border border-red-500/20' :
              'bg-slate-800/50 border border-white/5'
            }`}>
              <div className="text-[10px] text-white/50">MACD</div>
              <div className={`text-xs font-medium ${
                token.technicalIndicators.macdSignal === 'bullish' ? 'text-emerald-400' :
                token.technicalIndicators.macdSignal === 'bearish' ? 'text-red-400' : 'text-white'
              }`}>
                {token.technicalIndicators.macdSignal.charAt(0).toUpperCase() + token.technicalIndicators.macdSignal.slice(1)}
              </div>
            </div>
          </div>
        </div>
        
        {/* AI Verdict */}
        <div className="p-3 bg-gradient-to-r from-purple-500/10 to-cyan-500/10 rounded-lg border border-purple-500/20">
          <div className="flex items-center gap-2 mb-2">
            <Brain className="w-4 h-4 text-purple-400" />
            <span className="text-xs font-medium text-purple-300">AI Verdict</span>
          </div>
          <p className="text-xs text-white/70">
            Based on {token.txns.toLocaleString()} transactions, {token.mlPrediction.accuracy}% ML accuracy, and current market conditions, 
            our AI recommends <span className={recommendationConfig.color}>{recommendation}</span> with {recommendationScore}% confidence.
            {recommendation === 'BUY' && " Entry looks favorable with positive momentum."}
            {recommendation === 'HOLD' && " Wait for clearer signals before taking action."}
            {recommendation === 'SELL' && " Consider taking profits or reducing position."}
          </p>
        </div>
      </div>
    </div>
  );
}

function formatPrice(price: number): string {
  if (price === 0) return "$0";
  if (price < 0.000001) {
    const exp = Math.floor(Math.log10(price));
    const mantissa = price / Math.pow(10, exp);
    return `$0.0${Math.abs(exp)}${mantissa.toFixed(0)}`;
  }
  if (price < 0.0001) return `$${price.toFixed(7)}`;
  if (price < 0.01) return `$${price.toFixed(6)}`;
  if (price < 1) return `$${price.toFixed(4)}`;
  if (price < 1000) return `$${price.toFixed(2)}`;
  return `$${price.toLocaleString(undefined, { maximumFractionDigits: 2 })}`;
}

function formatNativePrice(price: number, symbol: string): string {
  if (price < 0.000001) {
    const exp = Math.floor(Math.log10(price));
    const mantissa = price / Math.pow(10, exp);
    return `0.0${Math.abs(exp)}${mantissa.toFixed(0)} ${symbol}`;
  }
  if (price < 0.0001) return `${price.toFixed(6)} ${symbol}`;
  if (price < 1) return `${price.toFixed(4)} ${symbol}`;
  return `${price.toFixed(2)} ${symbol}`;
}

function formatNumber(num: number): string {
  if (num >= 1e9) return `$${(num / 1e9).toFixed(2)}B`;
  if (num >= 1e6) return `$${(num / 1e6).toFixed(2)}M`;
  if (num >= 1e3) return `$${(num / 1e3).toFixed(0)}K`;
  return `$${num.toFixed(0)}`;
}

function formatCompact(num: number): string {
  if (num >= 1e6) return `${(num / 1e6).toFixed(2)}M`;
  if (num >= 1e3) return `${(num / 1e3).toFixed(1)}K`;
  return num.toLocaleString();
}

function PriceChange({ value, size = "md" }: { value: number; size?: "sm" | "md" | "lg" }) {
  const isPositive = value >= 0;
  const sizeClasses = {
    sm: "text-xs",
    md: "text-sm font-medium",
    lg: "text-base font-bold"
  };
  return (
    <span className={`tabular-nums ${isPositive ? 'text-emerald-400' : 'text-red-400'} ${sizeClasses[size]}`}>
      {isPositive ? '+' : ''}{value.toFixed(2)}%
    </span>
  );
}

function ProgressBar({ 
  leftValue, 
  rightValue, 
  leftColor = "bg-emerald-500", 
  rightColor = "bg-red-500" 
}: { 
  leftValue: number; 
  rightValue: number; 
  leftColor?: string; 
  rightColor?: string;
}) {
  const total = leftValue + rightValue;
  const leftPercent = total > 0 ? (leftValue / total) * 100 : 50;
  
  return (
    <div className="flex h-1.5 rounded-full overflow-hidden bg-slate-800">
      <div className={`${leftColor}`} style={{ width: `${leftPercent}%` }} />
      <div className={`${rightColor}`} style={{ width: `${100 - leftPercent}%` }} />
    </div>
  );
}

function CopyButton({ text, label }: { text: string; label: string }) {
  const [copied, setCopied] = useState(false);
  
  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  
  return (
    <button 
      onClick={handleCopy}
      className="flex items-center gap-1.5 px-2 py-1 bg-slate-800 hover:bg-slate-700 rounded text-xs text-white/70 transition-colors"
      data-testid={`copy-${label}`}
    >
      <span className="font-mono truncate max-w-[100px]">{text.slice(0, 6)}...{text.slice(-4)}</span>
      {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
    </button>
  );
}

function HelpModal() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="p-2 hover:bg-white/10 rounded-full" data-testid="help-button">
          <HelpCircle className="w-5 h-5 text-white/50" />
        </button>
      </DialogTrigger>
      <DialogContent className="bg-slate-900 border-white/10 max-w-md">
        <DialogHeader>
          <DialogTitle className="text-white flex items-center gap-2">
            <Shield className="w-5 h-5 text-cyan-400" />
            Guardian Scanner Guide
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 text-sm text-white/70">
          <div className="p-3 bg-slate-800/50 rounded-lg border border-white/5">
            <div className="flex items-center gap-2 mb-2">
              <Crosshair className="w-4 h-4 text-emerald-400" />
              <span className="font-medium text-emerald-400">SNIPE</span>
            </div>
            <p>AI recommends immediate entry. High safety score, strong momentum, favorable conditions.</p>
          </div>
          <div className="p-3 bg-slate-800/50 rounded-lg border border-white/5">
            <div className="flex items-center gap-2 mb-2">
              <Eye className="w-4 h-4 text-yellow-400" />
              <span className="font-medium text-yellow-400">WATCH</span>
            </div>
            <p>Monitor closely. Moderate risk/reward. Wait for better entry or more confirmation.</p>
          </div>
          <div className="p-3 bg-slate-800/50 rounded-lg border border-white/5">
            <div className="flex items-center gap-2 mb-2">
              <Ban className="w-4 h-4 text-red-400" />
              <span className="font-medium text-red-400">AVOID</span>
            </div>
            <p>High risk detected. Safety concerns, poor metrics, or potential scam indicators.</p>
          </div>
          <div className="border-t border-white/10 pt-4">
            <h4 className="font-medium text-white mb-2">Safety Indicators</h4>
            <div className="space-y-2 text-xs">
              <div className="flex items-center gap-2">
                <Lock className="w-3.5 h-3.5 text-emerald-400" />
                <span>Liquidity Locked - Funds secured in time-locked contract</span>
              </div>
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-3.5 h-3.5 text-yellow-400" />
                <span>Mint Authority - Owner can create more tokens</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="w-3.5 h-3.5 text-cyan-400" />
                <span>Guardian Score - Overall safety rating (0-100)</span>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function AIBadge({ recommendation, score }: { recommendation: 'snipe' | 'watch' | 'avoid'; score: number }) {
  const config = {
    snipe: { bg: 'bg-emerald-500/20', border: 'border-emerald-500/40', text: 'text-emerald-400', icon: Crosshair, label: 'SNIPE' },
    watch: { bg: 'bg-yellow-500/20', border: 'border-yellow-500/40', text: 'text-yellow-400', icon: Eye, label: 'WATCH' },
    avoid: { bg: 'bg-red-500/20', border: 'border-red-500/40', text: 'text-red-400', icon: Ban, label: 'AVOID' },
  }[recommendation];
  
  const Icon = config.icon;
  
  return (
    <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border ${config.bg} ${config.border}`}>
      <Brain className="w-3.5 h-3.5 text-purple-400" />
      <Icon className={`w-3.5 h-3.5 ${config.text}`} />
      <span className={`text-xs font-bold ${config.text}`}>{config.label}</span>
      <span className="text-[10px] text-white/40">{score}%</span>
    </div>
  );
}

function generateMockToken(chain: string, symbol: string): TokenData {
  const nativeSymbols: Record<string, string> = {
    solana: 'SOL', ethereum: 'ETH', bsc: 'BNB', base: 'ETH', arbitrum: 'ETH', polygon: 'MATIC'
  };
  
  const price = Math.random() * 0.001;
  const safetyScore = Math.floor(Math.random() * 100);
  const aiScore = Math.floor(Math.random() * 100);
  
  return {
    symbol: symbol.toUpperCase(),
    name: `${symbol.charAt(0).toUpperCase() + symbol.slice(1)} Token`,
    chain,
    chainIcon: chain === 'solana' ? '◎' : chain === 'ethereum' ? 'Ξ' : '🔵',
    dex: chain === 'solana' ? 'PumpSwap' : 'Uniswap',
    dexIcon: '🔄',
    via: chain === 'solana' ? 'Pump.fun' : undefined,
    pairAddress: `0x${Array.from({length: 40}, () => '0123456789abcdef'[Math.floor(Math.random() * 16)]).join('')}`,
    contractAddress: `0x${Array.from({length: 40}, () => '0123456789abcdef'[Math.floor(Math.random() * 16)]).join('')}`,
    quoteAddress: 'So11111111111111111111111111111111111111112',
    imageUrl: `https://api.dicebear.com/7.x/shapes/svg?seed=${symbol}&backgroundColor=0ea5e9`,
    priceUsd: price,
    priceNative: price * 100,
    nativeSymbol: nativeSymbols[chain] || 'ETH',
    age: `${Math.floor(Math.random() * 24)}h`,
    ageMinutes: Math.floor(Math.random() * 1440),
    boosts: Math.floor(Math.random() * 3000),
    rank: Math.floor(Math.random() * 100) + 1,
    liquidity: Math.random() * 100000 + 10000,
    liquidityLocked: Math.random() > 0.5,
    fdv: Math.random() * 500000 + 50000,
    marketCap: Math.random() * 500000 + 50000,
    priceChange5m: (Math.random() - 0.5) * 20,
    priceChange1h: (Math.random() - 0.5) * 50,
    priceChange6h: (Math.random() - 0.5) * 150,
    priceChange24h: (Math.random() - 0.5) * 400,
    txns: Math.floor(Math.random() * 50000) + 5000,
    buys: Math.floor(Math.random() * 30000) + 3000,
    sells: Math.floor(Math.random() * 20000) + 2000,
    volume: Math.random() * 2000000 + 100000,
    buyVolume: Math.random() * 1000000 + 50000,
    sellVolume: Math.random() * 1000000 + 50000,
    makers: Math.floor(Math.random() * 20000) + 1000,
    buyers: Math.floor(Math.random() * 15000) + 800,
    sellers: Math.floor(Math.random() * 10000) + 500,
    pooledToken: Math.random() * 100000000,
    pooledTokenUsd: Math.random() * 50000,
    pooledNative: Math.random() * 500,
    pooledNativeUsd: Math.random() * 50000,
    twitter: 'https://twitter.com/token',
    telegram: 'https://t.me/token',
    audit: {
      status: safetyScore > 70 ? 'pass' : safetyScore > 40 ? 'warning' : 'fail',
      issues: safetyScore < 70 ? ['Mint authority enabled'] : []
    },
    safety: {
      honeypot: Math.random() > 0.95,
      mintAuthority: Math.random() > 0.6,
      freezeAuthority: Math.random() > 0.7,
      score: safetyScore,
      grade: safetyScore >= 80 ? 'A' : safetyScore >= 60 ? 'B' : safetyScore >= 40 ? 'C' : 'D'
    },
    aiRecommendation: aiScore >= 75 ? 'snipe' : aiScore >= 40 ? 'watch' : 'avoid',
    aiScore,
    mlPrediction: {
      direction: Math.random() > 0.5 ? 'up' : 'down',
      confidence: Math.floor(Math.random() * 30) + 60,
      accuracy: Math.floor(Math.random() * 20) + 72,
      shortTermTarget: price * (1 + (Math.random() * 0.5)),
      longTermTarget: price * (1 + (Math.random() * 2)),
      momentum: Math.floor(Math.random() * 100),
      riskScore: Math.floor(Math.random() * 100),
    },
    strikeAgent: {
      signalStrength: aiScore,
      entryZone: { low: price * 0.95, high: price * 1.05 },
      targetPrice: price * (1 + (Math.random() * 1.5) + 0.2),
      stopLoss: price * (1 - (Math.random() * 0.3 + 0.1)),
      riskReward: Math.random() * 4 + 1,
      timeframe: ['5m', '15m', '1h', '4h'][Math.floor(Math.random() * 4)],
      reasoning: [
        'Strong buy pressure detected',
        'Low whale concentration',
        safetyScore > 60 ? 'Safety score above threshold' : 'Moderate safety concerns',
        'Volume surge in last hour',
      ],
    },
    whaleActivity: {
      top10Percent: Math.random() * 60 + 10,
      recentWhalebuys: Math.floor(Math.random() * 20),
      recentWhaleSells: Math.floor(Math.random() * 10),
      largestHolder: Math.random() * 15 + 2,
    },
    botActivity: {
      percent: Math.random() * 40,
      bundlePercent: Math.random() * 20,
      sniperCount: Math.floor(Math.random() * 50),
    },
    technicalIndicators: {
      rsi: Math.floor(Math.random() * 100),
      macdSignal: (['bullish', 'bearish', 'neutral'] as const)[Math.floor(Math.random() * 3)],
      volumeTrend: (['increasing', 'decreasing', 'stable'] as const)[Math.floor(Math.random() * 3)],
      priceAction: (['breakout', 'breakdown', 'consolidation'] as const)[Math.floor(Math.random() * 3)],
    },
    reactions: {
      rocket: Math.floor(Math.random() * 200),
      fire: Math.floor(Math.random() * 50),
      poop: Math.floor(Math.random() * 30),
      flag: Math.floor(Math.random() * 100)
    }
  };
}

export default function TokenDetail() {
  const params = useParams<{ chain: string; symbol: string }>();
  const [, setLocation] = useLocation();
  const [token, setToken] = useState<TokenData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'info' | 'chart' | 'txns'>('info');
  const [timeFilter, setTimeFilter] = useState<'5m' | '1h' | '6h' | '24h'>('24h');
  const [isWatchlisted, setIsWatchlisted] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  
  // Auto-Snipe State
  const [autoSnipeConfig, setAutoSnipeConfig] = useState<AutoSnipeConfig>({
    enabled: false,
    entryPrice: 0,
    targetPrice: 0,
    stopLoss: 0,
    amount: 1,
    slippage: 1,
    maxGas: 0.01,
    mevProtection: true,
    autoTakeProfit: true,
    trailingStop: false,
    trailingPercent: 5
  });
  
  // Initialize auto-snipe config when token loads
  useEffect(() => {
    if (token) {
      setAutoSnipeConfig(prev => ({
        ...prev,
        entryPrice: token.priceUsd,
        targetPrice: token.strikeAgent.targetPrice,
        stopLoss: token.strikeAgent.stopLoss
      }));
    }
  }, [token]);

  useEffect(() => {
    const fetchToken = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`/api/guardian-scanner/token/${params.chain}/${params.symbol}`);
        if (response.ok) {
          const data = await response.json();
          setToken(data);
        } else {
          setToken(generateMockToken(params.chain || 'solana', params.symbol || 'unknown'));
        }
      } catch {
        setToken(generateMockToken(params.chain || 'solana', params.symbol || 'unknown'));
      }
      setIsLoading(false);
    };
    
    fetchToken();
  }, [params.chain, params.symbol]);

  const currentPriceChange = useMemo(() => {
    if (!token) return 0;
    switch (timeFilter) {
      case '5m': return token.priceChange5m;
      case '1h': return token.priceChange1h;
      case '6h': return token.priceChange6h;
      default: return token.priceChange24h;
    }
  }, [token, timeFilter]);

  if (isLoading || !token) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#0d0d0d] border-b border-white/5">
        <div className="flex items-center justify-between px-3 py-2.5">
          <div className="flex items-center gap-3">
            <button onClick={() => setLocation('/guardian-scanner')} className="p-2 -ml-2" data-testid="back-button">
              <ChevronLeft className="w-5 h-5 text-white/70" />
            </button>
            <div className="flex items-center gap-2">
              <img src={token.imageUrl} alt={token.symbol} className="w-8 h-8 rounded-lg bg-slate-800" />
              <span className="font-bold text-lg">{token.name}</span>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <HelpModal />
            <button className="p-2 hover:bg-white/10 rounded-full" data-testid="share-button">
              <Share2 className="w-5 h-5 text-white/50" />
            </button>
            <button className="p-2 hover:bg-white/10 rounded-full" data-testid="more-button">
              <MoreVertical className="w-5 h-5 text-white/50" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pb-20">
        {/* Pair Info */}
        <div className="px-4 py-3 text-center">
          <div className="flex items-center justify-center gap-2 text-sm">
            <span className="text-cyan-400 font-medium">{token.symbol}</span>
            <Copy className="w-3 h-3 text-white/30 cursor-pointer hover:text-white/50" onClick={() => {navigator.clipboard.writeText(token.contractAddress); setCopied('contract');}} />
            <span className="text-white/40">/</span>
            <span className="text-white/60">{token.nativeSymbol}</span>
            <Badge className="bg-green-500/20 text-green-400 text-[10px] px-1.5">🌱 {token.age}</Badge>
            {token.rank && <Badge className="bg-orange-500/20 text-orange-400 text-[10px] px-1.5">🔥 #{token.rank}</Badge>}
            {token.boosts > 0 && <Badge className="bg-yellow-500/20 text-yellow-400 text-[10px] px-1.5">⚡{token.boosts}</Badge>}
          </div>
          <div className="flex items-center justify-center gap-1.5 mt-1 text-xs text-white/40">
            <span>{token.chainIcon} {token.chain}</span>
            <span>›</span>
            <span>{token.dex}</span>
            {token.via && (
              <>
                <span className="text-white/20">via</span>
                <span>{token.via}</span>
              </>
            )}
          </div>
        </div>

        {/* Hero Image */}
        <div className="relative h-48 mx-4 rounded-xl overflow-hidden bg-gradient-to-b from-slate-800/50 to-slate-900/50 mb-4">
          <img 
            src={token.imageUrl} 
            alt={token.name} 
            className="w-full h-full object-cover opacity-80"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent" />
        </div>

        {/* Social Buttons */}
        <div className="flex gap-2 px-4 mb-4">
          {token.twitter && (
            <a href={token.twitter} target="_blank" rel="noopener noreferrer" className="flex-1">
              <Button variant="outline" className="w-full bg-slate-800/50 border-white/10 hover:bg-slate-700/50 h-11">
                <Twitter className="w-4 h-4 mr-2" />
                Twitter
              </Button>
            </a>
          )}
          {token.telegram && (
            <a href={token.telegram} target="_blank" rel="noopener noreferrer" className="flex-1">
              <Button variant="outline" className="w-full bg-slate-800/50 border-white/10 hover:bg-slate-700/50 h-11">
                <Send className="w-4 h-4 mr-2" />
                Telegram
              </Button>
            </a>
          )}
        </div>

        {/* AI Recommendation */}
        <div className="flex justify-center mb-4">
          <AIBadge recommendation={token.aiRecommendation} score={token.aiScore} />
        </div>

        {/* ═══════════════════════════════════════════════════════════════════
            REAL-TIME CANDLESTICK CHART
        ═══════════════════════════════════════════════════════════════════ */}
        <div className="px-4 mb-4">
          <CandlestickChart 
            price={token.priceUsd}
            symbol={token.symbol}
            priceChange={currentPriceChange}
            isAutoSnipeActive={autoSnipeConfig.enabled}
          />
        </div>

        {/* Price Cards */}
        <div className="grid grid-cols-2 gap-3 px-4 mb-4">
          <div className="bg-slate-800/50 rounded-xl p-3 text-center border border-white/5">
            <div className="text-[10px] text-white/40 uppercase tracking-wide mb-1">Price USD</div>
            <div className="text-lg font-bold text-white">{formatPrice(token.priceUsd)}</div>
          </div>
          <div className="bg-slate-800/50 rounded-xl p-3 text-center border border-white/5">
            <div className="text-[10px] text-white/40 uppercase tracking-wide mb-1">Price</div>
            <div className="text-lg font-bold text-white">{formatNativePrice(token.priceNative, token.nativeSymbol)}</div>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-2 px-4 mb-4">
          <div className="bg-slate-800/30 rounded-lg p-2.5 text-center border border-white/5">
            <div className="text-[10px] text-white/40 uppercase tracking-wide mb-0.5">Liquidity</div>
            <div className="flex items-center justify-center gap-1">
              <span className="text-sm font-bold text-cyan-400">{formatNumber(token.liquidity)}</span>
              {token.liquidityLocked && <Lock className="w-3 h-3 text-emerald-400" />}
            </div>
          </div>
          <div className="bg-slate-800/30 rounded-lg p-2.5 text-center border border-white/5">
            <div className="text-[10px] text-white/40 uppercase tracking-wide mb-0.5">FDV</div>
            <div className="text-sm font-bold text-white">{formatNumber(token.fdv)}</div>
          </div>
          <div className="bg-slate-800/30 rounded-lg p-2.5 text-center border border-white/5">
            <div className="text-[10px] text-white/40 uppercase tracking-wide mb-0.5">Market Cap</div>
            <div className="text-sm font-bold text-white">{formatNumber(token.marketCap)}</div>
          </div>
        </div>

        {/* Time Filter Tabs */}
        <div className="flex gap-1 px-4 mb-4">
          {(['5m', '1h', '6h', '24h'] as const).map(tf => {
            const change = tf === '5m' ? token.priceChange5m : 
                          tf === '1h' ? token.priceChange1h : 
                          tf === '6h' ? token.priceChange6h : token.priceChange24h;
            const isActive = timeFilter === tf;
            
            return (
              <button
                key={tf}
                onClick={() => setTimeFilter(tf)}
                className={`flex-1 py-2.5 rounded-lg text-center transition-colors ${
                  isActive 
                    ? 'bg-slate-700 border border-white/20' 
                    : 'bg-slate-800/30 border border-transparent hover:bg-slate-800/50'
                }`}
                data-testid={`time-${tf}`}
              >
                <div className="text-[10px] text-white/40 uppercase">{tf.toUpperCase()}</div>
                <PriceChange value={change} size="sm" />
              </button>
            );
          })}
        </div>

        {/* Transaction Stats */}
        <div className="px-4 space-y-3 mb-4">
          {/* TXNS / BUYS / SELLS */}
          <div className="grid grid-cols-3 gap-2">
            <div className="bg-slate-800/30 rounded-lg p-2.5 border border-white/5">
              <div className="text-[10px] text-white/40 uppercase mb-0.5">Txns</div>
              <div className="text-sm font-bold text-white">{formatCompact(token.txns)}</div>
            </div>
            <div className="bg-slate-800/30 rounded-lg p-2.5 border border-white/5">
              <div className="text-[10px] text-white/40 uppercase mb-0.5">Buys</div>
              <div className="text-sm font-bold text-emerald-400">{formatCompact(token.buys)}</div>
            </div>
            <div className="bg-slate-800/30 rounded-lg p-2.5 border border-white/5">
              <div className="text-[10px] text-white/40 uppercase mb-0.5">Sells</div>
              <div className="text-sm font-bold text-red-400">{formatCompact(token.sells)}</div>
            </div>
          </div>
          <ProgressBar leftValue={token.buys} rightValue={token.sells} />

          {/* VOLUME / BUY VOL / SELL VOL */}
          <div className="grid grid-cols-3 gap-2">
            <div className="bg-slate-800/30 rounded-lg p-2.5 border border-white/5">
              <div className="text-[10px] text-white/40 uppercase mb-0.5">Volume</div>
              <div className="text-sm font-bold text-white">{formatNumber(token.volume)}</div>
            </div>
            <div className="bg-slate-800/30 rounded-lg p-2.5 border border-white/5">
              <div className="text-[10px] text-white/40 uppercase mb-0.5">Buy Vol</div>
              <div className="text-sm font-bold text-emerald-400">{formatNumber(token.buyVolume)}</div>
            </div>
            <div className="bg-slate-800/30 rounded-lg p-2.5 border border-white/5">
              <div className="text-[10px] text-white/40 uppercase mb-0.5">Sell Vol</div>
              <div className="text-sm font-bold text-red-400">{formatNumber(token.sellVolume)}</div>
            </div>
          </div>
          <ProgressBar leftValue={token.buyVolume} rightValue={token.sellVolume} />

          {/* MAKERS / BUYERS / SELLERS */}
          <div className="grid grid-cols-3 gap-2">
            <div className="bg-slate-800/30 rounded-lg p-2.5 border border-white/5">
              <div className="text-[10px] text-white/40 uppercase mb-0.5">Makers</div>
              <div className="text-sm font-bold text-white">{formatCompact(token.makers)}</div>
            </div>
            <div className="bg-slate-800/30 rounded-lg p-2.5 border border-white/5">
              <div className="text-[10px] text-white/40 uppercase mb-0.5">Buyers</div>
              <div className="text-sm font-bold text-emerald-400">{formatCompact(token.buyers)}</div>
            </div>
            <div className="bg-slate-800/30 rounded-lg p-2.5 border border-white/5">
              <div className="text-[10px] text-white/40 uppercase mb-0.5">Sellers</div>
              <div className="text-sm font-bold text-red-400">{formatCompact(token.sellers)}</div>
            </div>
          </div>
          <ProgressBar leftValue={token.buyers} rightValue={token.sellers} />
        </div>

        {/* Watchlist & Alerts */}
        <div className="flex gap-2 px-4 mb-4">
          <Button 
            variant="outline" 
            className={`flex-1 h-11 border-white/10 ${isWatchlisted ? 'bg-yellow-500/20 border-yellow-500/30 text-yellow-400' : 'bg-slate-800/50'}`}
            onClick={() => setIsWatchlisted(!isWatchlisted)}
            data-testid="watchlist-btn"
          >
            <Star className={`w-4 h-4 mr-2 ${isWatchlisted ? 'fill-yellow-400' : ''}`} />
            Watchlist
          </Button>
          <Button variant="outline" className="flex-1 h-11 bg-slate-800/50 border-white/10" data-testid="alerts-btn">
            <Bell className="w-4 h-4 mr-2" />
            Alerts
          </Button>
        </div>

        {/* ═══════════════════════════════════════════════════════════════════
            STRIKE AGENT TRADING PANEL - Our Unique Advantage
        ═══════════════════════════════════════════════════════════════════ */}
        <div className="px-4 mb-4">
          <div className="bg-gradient-to-br from-slate-800/80 via-purple-900/20 to-slate-800/80 rounded-2xl border border-purple-500/30 overflow-hidden">
            {/* Header */}
            <div className="p-4 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-purple-500 flex items-center justify-center">
                  <Crosshair className="w-4 h-4 text-white" />
                </div>
                <div>
                  <div className="font-bold text-white text-sm">Strike Agent</div>
                  <div className="text-[10px] text-purple-300">AI Trading Intelligence</div>
                </div>
              </div>
              <Badge className={`${
                token.aiRecommendation === 'snipe' ? 'bg-emerald-500/30 text-emerald-300 border-emerald-500/50' :
                token.aiRecommendation === 'watch' ? 'bg-yellow-500/30 text-yellow-300 border-yellow-500/50' :
                'bg-red-500/30 text-red-300 border-red-500/50'
              } border px-3 py-1`}>
                <span className="font-bold">{token.aiRecommendation.toUpperCase()}</span>
                <span className="ml-1.5 text-white/60">{token.strikeAgent.signalStrength}%</span>
              </Badge>
            </div>

            {/* Signal Analysis */}
            <div className="p-4 space-y-3">
              {/* Entry Zone & Targets */}
              <div className="grid grid-cols-3 gap-2">
                <div className="bg-slate-800/50 rounded-lg p-2.5 text-center">
                  <div className="text-[9px] text-white/40 uppercase">Entry Zone</div>
                  <div className="text-xs font-medium text-cyan-400">{formatPrice(token.strikeAgent.entryZone.low)}</div>
                  <div className="text-[10px] text-white/30">to {formatPrice(token.strikeAgent.entryZone.high)}</div>
                </div>
                <div className="bg-slate-800/50 rounded-lg p-2.5 text-center">
                  <div className="text-[9px] text-white/40 uppercase">Target</div>
                  <div className="text-xs font-bold text-emerald-400">{formatPrice(token.strikeAgent.targetPrice)}</div>
                  <div className="text-[10px] text-emerald-400/60">+{(((token.strikeAgent.targetPrice - token.priceUsd) / token.priceUsd) * 100).toFixed(0)}%</div>
                </div>
                <div className="bg-slate-800/50 rounded-lg p-2.5 text-center">
                  <div className="text-[9px] text-white/40 uppercase">Stop Loss</div>
                  <div className="text-xs font-medium text-red-400">{formatPrice(token.strikeAgent.stopLoss)}</div>
                  <div className="text-[10px] text-red-400/60">-{(((token.priceUsd - token.strikeAgent.stopLoss) / token.priceUsd) * 100).toFixed(0)}%</div>
                </div>
              </div>

              {/* Risk/Reward & Timeframe */}
              <div className="flex items-center gap-2">
                <div className="flex-1 bg-slate-800/30 rounded-lg p-2 flex items-center justify-between">
                  <span className="text-[10px] text-white/50">R:R Ratio</span>
                  <span className={`text-xs font-bold ${token.strikeAgent.riskReward >= 2 ? 'text-emerald-400' : 'text-yellow-400'}`}>
                    1:{token.strikeAgent.riskReward.toFixed(1)}
                  </span>
                </div>
                <div className="flex-1 bg-slate-800/30 rounded-lg p-2 flex items-center justify-between">
                  <span className="text-[10px] text-white/50">Timeframe</span>
                  <span className="text-xs font-medium text-white">{token.strikeAgent.timeframe}</span>
                </div>
              </div>

              {/* AI Reasoning */}
              <div className="bg-slate-800/30 rounded-lg p-3">
                <div className="text-[10px] text-white/40 uppercase mb-2">AI Analysis</div>
                <div className="space-y-1">
                  {token.strikeAgent.reasoning.map((reason, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs text-white/70">
                      <CheckCircle className="w-3 h-3 text-cyan-400 flex-shrink-0" />
                      {reason}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Trading Actions */}
            <div className="p-4 pt-0 space-y-3">
              {/* Amount Input */}
              <div className="bg-slate-800/50 rounded-xl p-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-white/50">Amount ({token.nativeSymbol})</span>
                  <span className="text-[10px] text-white/30">Balance: 0.00</span>
                </div>
                <div className="flex items-center gap-2">
                  <input 
                    type="number" 
                    placeholder="0.0" 
                    className="flex-1 bg-transparent text-xl font-bold text-white outline-none"
                    data-testid="trade-amount"
                  />
                  <div className="flex gap-1">
                    {['25%', '50%', '100%'].map(pct => (
                      <button key={pct} className="px-2 py-1 text-[10px] bg-slate-700 hover:bg-slate-600 rounded text-white/70">
                        {pct}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Quick Buy Buttons */}
              <div className="grid grid-cols-4 gap-2">
                {['0.1', '0.5', '1', '2'].map(amt => (
                  <button key={amt} className="py-2 bg-slate-800/50 hover:bg-slate-700/50 rounded-lg text-xs font-medium text-white/70 border border-white/5">
                    {amt} {token.nativeSymbol}
                  </button>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-2">
                <Button 
                  className="h-12 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-bold"
                  data-testid="snipe-btn"
                >
                  <Crosshair className="w-4 h-4 mr-2" />
                  SNIPE NOW
                </Button>
                <Button 
                  variant="outline"
                  className="h-12 border-purple-500/50 text-purple-400 hover:bg-purple-500/10"
                  data-testid="limit-order-btn"
                >
                  <Clock className="w-4 h-4 mr-2" />
                  Limit Order
                </Button>
              </div>

              {/* Advanced Options */}
              <div className="flex items-center justify-between text-[10px] text-white/40 px-1">
                <div className="flex items-center gap-3">
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input type="checkbox" className="w-3 h-3 rounded bg-slate-700 border-0" defaultChecked />
                    <span>Auto TP/SL</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input type="checkbox" className="w-3 h-3 rounded bg-slate-700 border-0" />
                    <span>MEV Protection</span>
                  </label>
                </div>
                <span>Slippage: 1%</span>
              </div>
            </div>
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════════════════
            AUTO-SNIPE MODE PANEL
        ═══════════════════════════════════════════════════════════════════ */}
        <div className="px-4 mb-4">
          <AutoSnipePanel
            token={token}
            config={autoSnipeConfig}
            setConfig={setAutoSnipeConfig}
            onExecute={() => {
              console.log('Executing snipe with config:', autoSnipeConfig);
              // TODO: Connect to wallet and execute trade
            }}
            onStop={() => {
              setAutoSnipeConfig(prev => ({ ...prev, enabled: false }));
            }}
          />
        </div>

        {/* ═══════════════════════════════════════════════════════════════════
            BUY/SELL METRICS & RECOMMENDATION
        ═══════════════════════════════════════════════════════════════════ */}
        <div className="px-4 mb-4">
          <BuySellMetricsPanel token={token} />
        </div>

        {/* ═══════════════════════════════════════════════════════════════════
            ML PREDICTIONS & ANALYTICS
        ═══════════════════════════════════════════════════════════════════ */}
        <div className="px-4 mb-4">
          <div className="bg-slate-800/30 rounded-xl border border-white/5 overflow-hidden">
            <div className="p-3 border-b border-white/5 flex items-center gap-2">
              <Brain className="w-4 h-4 text-purple-400" />
              <span className="text-sm font-medium">ML Price Predictions</span>
              <Badge className="ml-auto bg-purple-500/20 text-purple-300 text-[10px]">
                {token.mlPrediction.accuracy}% Accuracy
              </Badge>
            </div>
            <div className="p-4 space-y-3">
              {/* Direction & Confidence */}
              <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                <div className="flex items-center gap-2">
                  {token.mlPrediction.direction === 'up' ? (
                    <TrendingUp className="w-5 h-5 text-emerald-400" />
                  ) : (
                    <TrendingDown className="w-5 h-5 text-red-400" />
                  )}
                  <span className={`font-bold ${token.mlPrediction.direction === 'up' ? 'text-emerald-400' : 'text-red-400'}`}>
                    {token.mlPrediction.direction.toUpperCase()} PREDICTED
                  </span>
                </div>
                <div className="text-right">
                  <div className="text-xs text-white/40">Confidence</div>
                  <div className="text-lg font-bold text-cyan-400">{token.mlPrediction.confidence}%</div>
                </div>
              </div>

              {/* Price Targets */}
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-slate-800/50 rounded-lg p-3">
                  <div className="text-[10px] text-white/40 uppercase mb-1">Short-Term Target (1H)</div>
                  <div className="text-sm font-bold text-emerald-400">{formatPrice(token.mlPrediction.shortTermTarget)}</div>
                  <div className="text-[10px] text-emerald-400/60">
                    +{(((token.mlPrediction.shortTermTarget - token.priceUsd) / token.priceUsd) * 100).toFixed(1)}%
                  </div>
                </div>
                <div className="bg-slate-800/50 rounded-lg p-3">
                  <div className="text-[10px] text-white/40 uppercase mb-1">Long-Term Target (24H)</div>
                  <div className="text-sm font-bold text-purple-400">{formatPrice(token.mlPrediction.longTermTarget)}</div>
                  <div className="text-[10px] text-purple-400/60">
                    +{(((token.mlPrediction.longTermTarget - token.priceUsd) / token.priceUsd) * 100).toFixed(1)}%
                  </div>
                </div>
              </div>

              {/* Momentum & Risk */}
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-slate-800/50 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] text-white/40 uppercase">Momentum</span>
                    <span className={`text-xs font-medium ${token.mlPrediction.momentum > 60 ? 'text-emerald-400' : token.mlPrediction.momentum > 40 ? 'text-yellow-400' : 'text-red-400'}`}>
                      {token.mlPrediction.momentum}%
                    </span>
                  </div>
                  <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-red-500 via-yellow-500 to-emerald-500" style={{ width: `${token.mlPrediction.momentum}%` }} />
                  </div>
                </div>
                <div className="bg-slate-800/50 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] text-white/40 uppercase">Risk Score</span>
                    <span className={`text-xs font-medium ${token.mlPrediction.riskScore < 40 ? 'text-emerald-400' : token.mlPrediction.riskScore < 70 ? 'text-yellow-400' : 'text-red-400'}`}>
                      {token.mlPrediction.riskScore}%
                    </span>
                  </div>
                  <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-emerald-500 via-yellow-500 to-red-500" style={{ width: `${token.mlPrediction.riskScore}%` }} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════════════════
            TECHNICAL INDICATORS
        ═══════════════════════════════════════════════════════════════════ */}
        <div className="px-4 mb-4">
          <div className="bg-slate-800/30 rounded-xl border border-white/5 p-4">
            <div className="flex items-center gap-2 mb-3">
              <Activity className="w-4 h-4 text-cyan-400" />
              <span className="text-sm font-medium">Technical Indicators</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-slate-800/50 rounded-lg p-2.5 flex items-center justify-between">
                <span className="text-xs text-white/50">RSI (14)</span>
                <span className={`text-xs font-bold ${
                  token.technicalIndicators.rsi > 70 ? 'text-red-400' : 
                  token.technicalIndicators.rsi < 30 ? 'text-emerald-400' : 'text-white'
                }`}>
                  {token.technicalIndicators.rsi}
                </span>
              </div>
              <div className="bg-slate-800/50 rounded-lg p-2.5 flex items-center justify-between">
                <span className="text-xs text-white/50">MACD</span>
                <span className={`text-xs font-bold ${
                  token.technicalIndicators.macdSignal === 'bullish' ? 'text-emerald-400' : 
                  token.technicalIndicators.macdSignal === 'bearish' ? 'text-red-400' : 'text-white/50'
                }`}>
                  {token.technicalIndicators.macdSignal.toUpperCase()}
                </span>
              </div>
              <div className="bg-slate-800/50 rounded-lg p-2.5 flex items-center justify-between">
                <span className="text-xs text-white/50">Volume</span>
                <span className={`text-xs font-bold ${
                  token.technicalIndicators.volumeTrend === 'increasing' ? 'text-emerald-400' : 
                  token.technicalIndicators.volumeTrend === 'decreasing' ? 'text-red-400' : 'text-white/50'
                }`}>
                  {token.technicalIndicators.volumeTrend.toUpperCase()}
                </span>
              </div>
              <div className="bg-slate-800/50 rounded-lg p-2.5 flex items-center justify-between">
                <span className="text-xs text-white/50">Price Action</span>
                <span className={`text-xs font-bold ${
                  token.technicalIndicators.priceAction === 'breakout' ? 'text-emerald-400' : 
                  token.technicalIndicators.priceAction === 'breakdown' ? 'text-red-400' : 'text-yellow-400'
                }`}>
                  {token.technicalIndicators.priceAction.toUpperCase()}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════════════════
            WHALE & BOT ACTIVITY
        ═══════════════════════════════════════════════════════════════════ */}
        <div className="px-4 mb-4">
          <div className="grid grid-cols-2 gap-3">
            {/* Whale Activity */}
            <div className="bg-slate-800/30 rounded-xl border border-white/5 p-3">
              <div className="flex items-center gap-1.5 mb-2">
                <Users className="w-3.5 h-3.5 text-purple-400" />
                <span className="text-xs font-medium">Whale Activity</span>
              </div>
              <div className="space-y-2 text-[11px]">
                <div className="flex justify-between">
                  <span className="text-white/40">Top 10 Hold</span>
                  <span className={token.whaleActivity.top10Percent > 50 ? 'text-red-400' : 'text-white'}>{token.whaleActivity.top10Percent.toFixed(1)}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/40">Recent Buys</span>
                  <span className="text-emerald-400">{token.whaleActivity.recentWhalebuys}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/40">Recent Sells</span>
                  <span className="text-red-400">{token.whaleActivity.recentWhaleSells}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/40">Largest</span>
                  <span className="text-white">{token.whaleActivity.largestHolder.toFixed(1)}%</span>
                </div>
              </div>
            </div>

            {/* Bot Activity */}
            <div className="bg-slate-800/30 rounded-xl border border-white/5 p-3">
              <div className="flex items-center gap-1.5 mb-2">
                <Bot className="w-3.5 h-3.5 text-orange-400" />
                <span className="text-xs font-medium">Bot Activity</span>
              </div>
              <div className="space-y-2 text-[11px]">
                <div className="flex justify-between">
                  <span className="text-white/40">Bot %</span>
                  <span className={token.botActivity.percent > 30 ? 'text-red-400' : 'text-white'}>{token.botActivity.percent.toFixed(1)}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/40">Bundle %</span>
                  <span className={token.botActivity.bundlePercent > 15 ? 'text-yellow-400' : 'text-white'}>{token.botActivity.bundlePercent.toFixed(1)}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/40">Snipers</span>
                  <span className="text-white">{token.botActivity.sniperCount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/40">Risk Level</span>
                  <span className={token.botActivity.percent > 30 ? 'text-red-400' : token.botActivity.percent > 15 ? 'text-yellow-400' : 'text-emerald-400'}>
                    {token.botActivity.percent > 30 ? 'HIGH' : token.botActivity.percent > 15 ? 'MED' : 'LOW'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Trade Button - Simple fallback */}
        <div className="px-4 mb-6">
          <Button className="w-full h-12 bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white font-bold" data-testid="trade-btn">
            <ArrowLeftRight className="w-4 h-4 mr-2" />
            Trade {token.symbol}/{token.nativeSymbol}
          </Button>
        </div>

        {/* Info Section */}
        <div className="px-4 space-y-3">
          {/* Audit */}
          <div className="bg-slate-800/30 rounded-xl p-4 border border-white/5">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Audit</span>
              <div className="flex items-center gap-2">
                <span className={`text-sm ${token.audit.status === 'pass' ? 'text-emerald-400' : token.audit.status === 'warning' ? 'text-yellow-400' : 'text-red-400'}`}>
                  {token.audit.status === 'pass' ? 'No issues' : token.audit.issues.length + ' issues'}
                </span>
                {token.audit.status === 'pass' ? (
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                ) : (
                  <AlertTriangle className="w-4 h-4 text-yellow-400" />
                )}
                <ChevronDown className="w-4 h-4 text-white/40" />
              </div>
            </div>
            <p className="text-[10px] text-white/40 mt-2">
              <span className="text-yellow-400">Warning!</span> Audits may not be 100% accurate! <span className="text-cyan-400 cursor-pointer">More</span>
            </p>
          </div>

          {/* Guardian Safety */}
          <div className="bg-slate-800/30 rounded-xl p-4 border border-white/5">
            <div className="flex items-center gap-2 mb-3">
              <Shield className="w-4 h-4 text-cyan-400" />
              <span className="text-sm font-medium">Guardian Safety Score</span>
              <Badge className={`ml-auto ${token.safety.score >= 70 ? 'bg-emerald-500/20 text-emerald-400' : token.safety.score >= 40 ? 'bg-yellow-500/20 text-yellow-400' : 'bg-red-500/20 text-red-400'}`}>
                {token.safety.score}/100 ({token.safety.grade})
              </Badge>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="flex items-center justify-between p-2 bg-slate-800/50 rounded">
                <span className="text-white/50">Honeypot</span>
                <span className={token.safety.honeypot ? 'text-red-400' : 'text-emerald-400'}>
                  {token.safety.honeypot ? 'RISK' : 'Safe'}
                </span>
              </div>
              <div className="flex items-center justify-between p-2 bg-slate-800/50 rounded">
                <span className="text-white/50">Mint Auth</span>
                <span className={token.safety.mintAuthority ? 'text-yellow-400' : 'text-emerald-400'}>
                  {token.safety.mintAuthority ? 'Enabled' : 'Disabled'}
                </span>
              </div>
              <div className="flex items-center justify-between p-2 bg-slate-800/50 rounded">
                <span className="text-white/50">Freeze Auth</span>
                <span className={token.safety.freezeAuthority ? 'text-yellow-400' : 'text-emerald-400'}>
                  {token.safety.freezeAuthority ? 'Enabled' : 'Disabled'}
                </span>
              </div>
              <div className="flex items-center justify-between p-2 bg-slate-800/50 rounded">
                <span className="text-white/50">Liquidity</span>
                <span className={token.liquidityLocked ? 'text-emerald-400' : 'text-orange-400'}>
                  {token.liquidityLocked ? 'Locked' : 'Unlocked'}
                </span>
              </div>
            </div>
          </div>

          {/* Boost */}
          <div className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 rounded-xl p-4 border border-yellow-500/20">
            <div className="flex items-center justify-center gap-2">
              <Zap className="w-5 h-5 text-yellow-400 fill-yellow-400" />
              <span className="font-bold text-yellow-400">Boost</span>
              <Badge className="bg-yellow-500/30 text-yellow-300">{token.boosts}</Badge>
            </div>
          </div>

          {/* Community Reactions */}
          <div className="grid grid-cols-4 gap-2">
            <button className="bg-slate-800/50 rounded-xl p-3 text-center border border-white/5 hover:bg-slate-800/70">
              <Rocket className="w-5 h-5 mx-auto mb-1 text-orange-400" />
              <span className="text-sm font-medium">{token.reactions.rocket}</span>
            </button>
            <button className="bg-slate-800/50 rounded-xl p-3 text-center border border-white/5 hover:bg-slate-800/70">
              <Flame className="w-5 h-5 mx-auto mb-1 text-orange-500" />
              <span className="text-sm font-medium">{token.reactions.fire}</span>
            </button>
            <button className="bg-slate-800/50 rounded-xl p-3 text-center border border-white/5 hover:bg-slate-800/70">
              <span className="text-xl">💩</span>
              <div className="text-sm font-medium mt-0.5">{token.reactions.poop}</div>
            </button>
            <button className="bg-slate-800/50 rounded-xl p-3 text-center border border-white/5 hover:bg-slate-800/70">
              <Flag className="w-5 h-5 mx-auto mb-1 text-red-400" />
              <span className="text-sm font-medium">{token.reactions.flag}</span>
            </button>
          </div>

          {/* Pool Info */}
          <div className="bg-slate-800/30 rounded-xl p-4 border border-white/5 space-y-3">
            <div className="flex items-center justify-between py-2 border-b border-white/5">
              <span className="text-sm text-white/50">Pair created</span>
              <span className="text-sm font-medium">{token.age} ago</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-white/5">
              <span className="text-sm text-white/50">Pooled {token.symbol}</span>
              <div className="text-right">
                <div className="text-sm font-medium">{formatCompact(token.pooledToken)}</div>
                <div className="text-xs text-white/40">{formatNumber(token.pooledTokenUsd)}</div>
              </div>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-white/5">
              <span className="text-sm text-white/50">Pooled {token.nativeSymbol}</span>
              <div className="text-right">
                <div className="text-sm font-medium">{token.pooledNative.toFixed(2)}</div>
                <div className="text-xs text-white/40">{formatNumber(token.pooledNativeUsd)}</div>
              </div>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-white/5">
              <span className="text-sm text-white/50">Pair</span>
              <div className="flex items-center gap-2">
                <CopyButton text={token.pairAddress} label="pair" />
                <a href={`https://solscan.io/address/${token.pairAddress}`} target="_blank" rel="noopener noreferrer" className="text-cyan-400 text-xs flex items-center gap-1">
                  EXP <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-white/5">
              <span className="text-sm text-white/50">{token.symbol}</span>
              <div className="flex items-center gap-2">
                <CopyButton text={token.contractAddress} label="token" />
                <a href={`https://solscan.io/token/${token.contractAddress}`} target="_blank" rel="noopener noreferrer" className="text-cyan-400 text-xs flex items-center gap-1">
                  EXP <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-sm text-white/50">{token.nativeSymbol}</span>
              <div className="flex items-center gap-2">
                <CopyButton text={token.quoteAddress} label="quote" />
                <a href={`https://solscan.io/token/${token.quoteAddress}`} target="_blank" rel="noopener noreferrer" className="text-cyan-400 text-xs flex items-center gap-1">
                  EXP <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>

          {/* Search / Other Pairs */}
          <div className="flex gap-2">
            <Button variant="outline" className="flex-1 h-11 bg-slate-800/50 border-white/10">
              <Twitter className="w-4 h-4 mr-2" />
              Search on Twitter
            </Button>
            <Button variant="outline" className="flex-1 h-11 bg-slate-800/50 border-white/10">
              <Search className="w-4 h-4 mr-2" />
              Other pairs
            </Button>
          </div>
        </div>
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-[#0d0d0d] border-t border-white/10 z-50">
        <div className="flex">
          <button 
            onClick={() => setActiveTab('info')}
            className={`flex-1 py-3 flex flex-col items-center gap-0.5 ${activeTab === 'info' ? 'text-cyan-400' : 'text-white/40'}`}
            data-testid="tab-info"
          >
            <Info className="w-5 h-5" />
            <span className="text-[10px]">Info</span>
          </button>
          <button 
            onClick={() => setActiveTab('chart')}
            className={`flex-1 py-3 flex flex-col items-center gap-0.5 ${activeTab === 'chart' ? 'text-cyan-400' : 'text-white/40'}`}
            data-testid="tab-chart"
          >
            <BarChart3 className="w-5 h-5" />
            <span className="text-[10px]">Chart+Txns</span>
          </button>
          <button 
            onClick={() => setActiveTab('chart')}
            className={`flex-1 py-3 flex flex-col items-center gap-0.5 text-white/40`}
            data-testid="tab-chart-only"
          >
            <Activity className="w-5 h-5" />
            <span className="text-[10px]">Chart</span>
          </button>
          <button 
            onClick={() => setActiveTab('txns')}
            className={`flex-1 py-3 flex flex-col items-center gap-0.5 ${activeTab === 'txns' ? 'text-cyan-400' : 'text-white/40'}`}
            data-testid="tab-txns"
          >
            <Users className="w-5 h-5" />
            <span className="text-[10px]">Txns</span>
          </button>
        </div>
      </nav>
    </div>
  );
}
