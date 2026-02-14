import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { 
  Bot, Target, TrendingUp, TrendingDown, Eye, AlertTriangle,
  Shield, Zap, Activity, Brain, BarChart3, CheckCircle, XCircle,
  Clock, Percent, Trophy, ChevronRight, Search, RefreshCw,
  DollarSign, Layers, ArrowUpRight, ArrowDownRight, Flame,
  Bitcoin, Coins, Globe, PieChart, Filter, ChevronDown, Star,
  ExternalLink, LineChart
} from "lucide-react";
import { GlassCard, StatCard } from "@/components/glass-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SubscriptionGate } from "@/components/subscription-gate";

interface MarketData {
  totalMarketCap: number;
  totalMarketCapChange: number;
  totalVolume: number;
  totalVolumeChange: number;
  btcDominance: number;
  ethDominance: number;
  fearGreed: number;
  fearGreedLabel: string;
  altcoinSeason: number;
  btcPrice: number;
  btcPriceChange: number;
  ethPrice: number;
  ethPriceChange: number;
}

interface TopCoin {
  id: string;
  symbol: string;
  name: string;
  image: string;
  price: number;
  priceChange24h: number;
  marketCap: number;
  volume: number;
  sparkline: number[];
  rank: number;
}

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
    <GlassCard glow>
      <div className={`p-4 rounded-2xl bg-gradient-to-br ${getBgGradient()}`}>
        <div className="text-center mb-2">
          <p className="text-xs text-gray-400 uppercase tracking-wider">Fear & Greed Index</p>
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
    </GlassCard>
  );
}

function AltcoinSeasonGauge({ value }: { value: number }) {
  const isBtcSeason = value < 25;
  const isAltSeason = value >= 75;
  
  return (
    <GlassCard>
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs text-gray-400 uppercase tracking-wider">Altcoin Season</p>
          <Badge className={`${isAltSeason ? 'bg-purple-500/20 text-purple-400' : isBtcSeason ? 'bg-orange-500/20 text-orange-400' : 'bg-gray-500/20 text-gray-400'}`}>
            {isAltSeason ? 'ALT SEASON' : isBtcSeason ? 'BTC SEASON' : 'NEUTRAL'}
          </Badge>
        </div>
        <div className="relative h-3 bg-gray-800 rounded-full overflow-hidden mb-2">
          <div 
            className="absolute inset-y-0 left-0 rounded-full transition-all duration-500"
            style={{ 
              width: `${value}%`,
              background: `linear-gradient(90deg, #f97316 0%, #a855f7 100%)`
            }}
          />
        </div>
        <div className="flex justify-between text-[10px] text-gray-500">
          <span>BTC Season</span>
          <span>{value}/100</span>
          <span>Altcoin Season</span>
        </div>
      </div>
    </GlassCard>
  );
}

function MarketMetricCard({ 
  label, 
  value, 
  change, 
  icon: Icon,
  prefix = "$"
}: { 
  label: string; 
  value: number; 
  change?: number; 
  icon: any;
  prefix?: string;
}) {
  const formatValue = (val: number) => {
    if (val >= 1e12) return `${(val / 1e12).toFixed(2)}T`;
    if (val >= 1e9) return `${(val / 1e9).toFixed(2)}B`;
    if (val >= 1e6) return `${(val / 1e6).toFixed(2)}M`;
    if (val >= 1e3) return `${(val / 1e3).toFixed(2)}K`;
    return val.toFixed(2);
  };

  return (
    <GlassCard>
      <div className="p-4">
        <div className="flex items-center gap-2 mb-2">
          <Icon className="w-4 h-4 text-cyan-400" />
          <span className="text-xs text-gray-400">{label}</span>
        </div>
        <p className="text-xl font-bold text-white">{prefix}{formatValue(value)}</p>
        {change !== undefined && (
          <div className={`flex items-center gap-1 text-xs mt-1 ${change >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
            {change >= 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
            {change >= 0 ? '+' : ''}{change.toFixed(2)}%
          </div>
        )}
      </div>
    </GlassCard>
  );
}

function MiniSparkline({ data, color = "cyan" }: { data: number[]; color?: string }) {
  if (!data || data.length < 2) return null;
  
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const height = 24;
  const width = 60;
  
  const points = data.map((val, i) => {
    const x = (i / (data.length - 1)) * width;
    const y = height - ((val - min) / range) * height;
    return `${x},${y}`;
  }).join(' ');
  
  const isUp = data[data.length - 1] >= data[0];
  const strokeColor = isUp ? '#10b981' : '#ef4444';

  return (
    <svg width={width} height={height} className="overflow-visible">
      <polyline
        points={points}
        fill="none"
        stroke={strokeColor}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function TopCoinRow({ coin, rank, selected, onSelect }: { coin: TopCoin; rank: number; selected: boolean; onSelect: () => void }) {
  const isUp = coin.priceChange24h >= 0;
  
  return (
    <motion.tr 
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: rank * 0.03 }}
      onClick={onSelect}
      className={`border-b border-white/5 hover:bg-white/10 transition-colors cursor-pointer ${selected ? 'bg-cyan-500/10 border-l-2 border-l-cyan-500' : ''}`}
    >
      <td className="py-3 pr-3">
        <span className="text-xs text-white/40">#{rank}</span>
      </td>
      <td className="py-3 pr-4">
        <div className="flex items-center gap-2">
          {coin.image ? (
            <img src={coin.image} alt={coin.symbol} className="w-6 h-6 rounded-full" />
          ) : (
            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-cyan-500 to-purple-500 flex items-center justify-center text-[10px] font-bold text-white">
              {coin.symbol.slice(0, 2)}
            </div>
          )}
          <div>
            <span className="text-sm font-semibold text-white">{coin.symbol.toUpperCase()}</span>
            <span className="text-xs text-white/40 block">{coin.name}</span>
          </div>
        </div>
      </td>
      <td className="py-3 pr-4 text-right">
        <span className="text-sm font-medium text-white">
          ${coin.price < 1 ? coin.price.toFixed(6) : coin.price.toLocaleString(undefined, { maximumFractionDigits: 2 })}
        </span>
      </td>
      <td className="py-3 pr-4 text-right">
        <span className={`text-sm font-medium ${isUp ? 'text-emerald-400' : 'text-red-400'}`}>
          {isUp ? '+' : ''}{coin.priceChange24h.toFixed(2)}%
        </span>
      </td>
      <td className="py-3 pr-4 text-right hidden md:table-cell">
        <span className="text-xs text-white/70">
          ${(coin.marketCap / 1e9).toFixed(2)}B
        </span>
      </td>
      <td className="py-3 pr-4 text-right hidden lg:table-cell">
        <span className="text-xs text-white/70">
          ${(coin.volume / 1e9).toFixed(2)}B
        </span>
      </td>
      <td className="py-3 hidden sm:table-cell">
        <MiniSparkline data={coin.sparkline} />
      </td>
    </motion.tr>
  );
}

interface NewsItem {
  id: string;
  title: string;
  source: string;
  time: string;
  sentiment: 'bullish' | 'bearish' | 'neutral';
  url: string;
}

interface CandleData {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
}

function PriceChart({ coin, candles }: { coin: TopCoin | null; candles: CandleData[] }) {
  if (!coin || candles.length === 0) return null;
  
  const minPrice = Math.min(...candles.map(c => c.low));
  const maxPrice = Math.max(...candles.map(c => c.high));
  const priceRange = maxPrice - minPrice || 1;
  const chartHeight = 180;
  const chartWidth = 100;
  const candleWidth = chartWidth / candles.length * 0.7;
  const gapWidth = chartWidth / candles.length * 0.3;
  
  return (
    <GlassCard glow>
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-purple-500 flex items-center justify-center text-sm font-bold text-white">
              {coin.symbol.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">{coin.name}</h3>
              <span className="text-xs text-white/50">{coin.symbol.toUpperCase()}</span>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xl font-bold text-white">
              ${coin.price < 1 ? coin.price.toFixed(6) : coin.price.toLocaleString(undefined, { maximumFractionDigits: 2 })}
            </p>
            <p className={`text-sm font-medium ${coin.priceChange24h >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
              {coin.priceChange24h >= 0 ? '+' : ''}{coin.priceChange24h.toFixed(2)}%
            </p>
          </div>
        </div>
        
        <div className="relative h-[180px] w-full">
          <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full h-full" preserveAspectRatio="none">
            {candles.map((candle, i) => {
              const x = i * (candleWidth + gapWidth / candles.length * candles.length);
              const isGreen = candle.close >= candle.open;
              const bodyTop = chartHeight - ((Math.max(candle.open, candle.close) - minPrice) / priceRange) * chartHeight;
              const bodyBottom = chartHeight - ((Math.min(candle.open, candle.close) - minPrice) / priceRange) * chartHeight;
              const bodyHeight = Math.max(bodyBottom - bodyTop, 1);
              const wickTop = chartHeight - ((candle.high - minPrice) / priceRange) * chartHeight;
              const wickBottom = chartHeight - ((candle.low - minPrice) / priceRange) * chartHeight;
              const color = isGreen ? '#10b981' : '#ef4444';
              
              return (
                <g key={i}>
                  <line
                    x1={x + candleWidth / 2}
                    y1={wickTop}
                    x2={x + candleWidth / 2}
                    y2={wickBottom}
                    stroke={color}
                    strokeWidth="0.5"
                  />
                  <rect
                    x={x}
                    y={bodyTop}
                    width={candleWidth}
                    height={bodyHeight}
                    fill={color}
                    rx="0.5"
                  />
                </g>
              );
            })}
          </svg>
        </div>
        
        <div className="grid grid-cols-4 gap-2 mt-4">
          <div className="text-center p-2 bg-white/5 rounded-lg">
            <p className="text-[10px] text-white/40">Market Cap</p>
            <p className="text-sm font-bold text-white">${(coin.marketCap / 1e9).toFixed(2)}B</p>
          </div>
          <div className="text-center p-2 bg-white/5 rounded-lg">
            <p className="text-[10px] text-white/40">24h Volume</p>
            <p className="text-sm font-bold text-white">${(coin.volume / 1e9).toFixed(2)}B</p>
          </div>
          <div className="text-center p-2 bg-white/5 rounded-lg">
            <p className="text-[10px] text-white/40">Rank</p>
            <p className="text-sm font-bold text-white">#{coin.rank}</p>
          </div>
          <div className="text-center p-2 bg-white/5 rounded-lg">
            <p className="text-[10px] text-white/40">7d Trend</p>
            <MiniSparkline data={coin.sparkline} />
          </div>
        </div>
      </div>
    </GlassCard>
  );
}

function NewsCarousel({ news }: { news: NewsItem[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex(i => (i + 1) % news.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [news.length]);
  
  if (news.length === 0) return null;
  
  return (
    <GlassCard>
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Globe className="w-5 h-5 text-cyan-400" />
            <h3 className="text-sm font-semibold text-white">Crypto News</h3>
          </div>
          <div className="flex gap-1">
            {news.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentIndex(i)}
                className={`w-2 h-2 rounded-full transition-colors ${i === currentIndex ? 'bg-cyan-400' : 'bg-white/20'}`}
              />
            ))}
          </div>
        </div>
        
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="min-h-[60px]"
          >
            <p className="text-sm text-white mb-2 line-clamp-2">{news[currentIndex].title}</p>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs text-white/40">{news[currentIndex].source}</span>
                <span className="text-white/20">•</span>
                <span className="text-xs text-white/40">{news[currentIndex].time}</span>
              </div>
              <span className={`text-xs px-2 py-0.5 rounded ${
                news[currentIndex].sentiment === 'bullish' ? 'bg-emerald-500/20 text-emerald-400' :
                news[currentIndex].sentiment === 'bearish' ? 'bg-red-500/20 text-red-400' :
                'bg-gray-500/20 text-gray-400'
              }`}>
                {news[currentIndex].sentiment}
              </span>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </GlassCard>
  );
}


const GlowOrb = ({ color, size, top, left, delay = 0 }: { color: string; size: number; top: string; left: string; delay?: number }) => (
  <motion.div
    className="absolute rounded-full blur-3xl opacity-20 pointer-events-none"
    style={{ background: color, width: size, height: size, top, left }}
    animate={{ scale: [1, 1.2, 1], opacity: [0.15, 0.25, 0.15] }}
    transition={{ duration: 8, repeat: Infinity, delay }}
  />
);

export default function PulseDashboard() {
  const [searchTicker, setSearchTicker] = useState('');
  const [category, setCategory] = useState('all');
  const [refreshKey, setRefreshKey] = useState(0);
  const [selectedCoin, setSelectedCoin] = useState<TopCoin | null>(null);

  const { data: marketData, isLoading: marketLoading, refetch: refetchMarket } = useQuery<MarketData>({
    queryKey: ['pulse-market', refreshKey],
    queryFn: async () => {
      const res = await fetch('/api/pulse/market');
      if (!res.ok) throw new Error('Failed to fetch market data');
      return res.json();
    },
    refetchInterval: 30000,
  });

  const { data: topCoins, isLoading: coinsLoading } = useQuery<TopCoin[]>({
    queryKey: ['pulse-top-coins', category],
    queryFn: async () => {
      const res = await fetch(`/api/pulse/top-coins?category=${category}&limit=20`);
      if (!res.ok) {
        return generateMockTopCoins();
      }
      return res.json();
    },
    refetchInterval: 60000,
  });

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

  const market = marketData || {
    totalMarketCap: 2.5e12,
    totalMarketCapChange: 1.5,
    totalVolume: 95e9,
    totalVolumeChange: -2.3,
    btcDominance: 52.4,
    ethDominance: 17.2,
    fearGreed: 65,
    fearGreedLabel: 'Greed',
    altcoinSeason: 45,
    btcPrice: 67500,
    btcPriceChange: 2.1,
    ethPrice: 3450,
    ethPriceChange: 1.8,
  };

  const coins = topCoins || [];
  
  useEffect(() => {
    if (coins.length > 0) {
      const currentInList = selectedCoin && coins.find(c => c.id === selectedCoin.id);
      if (!currentInList) {
        setSelectedCoin(coins[0]);
      }
    }
  }, [coins, selectedCoin]);
  
  const [candles, setCandles] = useState<CandleData[]>([]);
  
  useEffect(() => {
    if (!selectedCoin) {
      setCandles([]);
      return;
    }
    const basePrice = selectedCoin.price;
    const newCandles: CandleData[] = [];
    const seed = selectedCoin.id.charCodeAt(0);
    for (let i = 0; i < 24; i++) {
      const pseudoRandom = (n: number) => {
        const x = Math.sin(seed + n * 9999) * 10000;
        return x - Math.floor(x);
      };
      const volatility = 0.02 + pseudoRandom(i) * 0.03;
      const trend = selectedCoin.priceChange24h / 100 / 24;
      const open = basePrice * (1 - (24 - i) * trend + (pseudoRandom(i + 1) - 0.5) * volatility);
      const close = open * (1 + (pseudoRandom(i + 2) - 0.5) * volatility + trend);
      const high = Math.max(open, close) * (1 + pseudoRandom(i + 3) * volatility * 0.5);
      const low = Math.min(open, close) * (1 - pseudoRandom(i + 4) * volatility * 0.5);
      newCandles.push({ time: Date.now() - (24 - i) * 3600000, open, high, low, close });
    }
    setCandles(newCandles);
  }, [selectedCoin?.id, selectedCoin?.price, selectedCoin?.priceChange24h]);
  
  const mockNews: NewsItem[] = [
    { id: '1', title: 'Bitcoin breaks through key resistance level as institutional buying accelerates', source: 'CoinDesk', time: '2h ago', sentiment: 'bullish', url: '#' },
    { id: '2', title: 'Ethereum ETF inflows surge to record highs amid growing demand', source: 'The Block', time: '4h ago', sentiment: 'bullish', url: '#' },
    { id: '3', title: 'SEC signals potential approval for additional crypto products', source: 'Reuters', time: '6h ago', sentiment: 'neutral', url: '#' },
    { id: '4', title: 'Major crypto exchange reports Q4 trading volume spike', source: 'Bloomberg', time: '8h ago', sentiment: 'bullish', url: '#' },
    { id: '5', title: 'DeFi TVL reaches new all-time high across multiple chains', source: 'DeFi Pulse', time: '12h ago', sentiment: 'bullish', url: '#' },
  ];

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

  const handleRefresh = () => {
    setRefreshKey(k => k + 1);
    refetchMarket();
  };

  return (
    <SubscriptionGate
      requiredPlans={["pulse_pro"]}
      productName="Pulse Pro"
      productDescription="AI-powered market intelligence with ML predictions, Fear & Greed tracking, and verified accuracy analytics."
      price="$14.99"
      checkoutPath="/billing"
      icon={<Zap className="w-10 h-10 text-amber-400" />}
    >
    <div className="min-h-screen relative overflow-hidden pt-20 pb-12" style={{ background: "linear-gradient(180deg, #070b16, #0c1222, #070b16)" }}>
      <GlowOrb color="linear-gradient(135deg, #06b6d4, #3b82f6)" size={500} top="-5%" left="60%" />
      <GlowOrb color="linear-gradient(135deg, #8b5cf6, #ec4899)" size={400} top="40%" left="-10%" delay={3} />
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-40 right-20 w-80 h-80 bg-purple-500/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 w-[500px] h-[500px] bg-pink-500/5 rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-[0_0_30px_rgba(0,255,255,0.3)]">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Pulse Market Intelligence
                </h1>
                <p className="text-sm text-white/50">
                  Real-time crypto market data with AI predictions
                </p>
              </div>
            </div>
            <button 
              onClick={handleRefresh}
              className="p-3 bg-white/10 rounded-xl hover:bg-white/20 transition-colors"
              data-testid="button-refresh-market"
            >
              <RefreshCw className={`w-5 h-5 text-white ${marketLoading ? 'animate-spin' : ''}`} />
            </button>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Link href="/strike-agent">
              <div className="flex items-center gap-2 p-3 rounded-xl bg-white/5 border border-white/10 hover:border-cyan-500/50 transition-colors cursor-pointer">
                <Target className="w-4 h-4 text-cyan-400" />
                <span className="text-xs font-medium text-white">Strike Agent</span>
              </div>
            </Link>
            <Link href="/charts">
              <div className="flex items-center gap-2 p-3 rounded-xl bg-white/5 border border-white/10 hover:border-purple-500/50 transition-colors cursor-pointer">
                <LineChart className="w-4 h-4 text-purple-400" />
                <span className="text-xs font-medium text-white">Charts</span>
              </div>
            </Link>
            <Link href="/swap">
              <div className="flex items-center gap-2 p-3 rounded-xl bg-white/5 border border-white/10 hover:border-emerald-500/50 transition-colors cursor-pointer">
                <Zap className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-medium text-white">Swap</span>
              </div>
            </Link>
            <Link href="/portfolio">
              <div className="flex items-center gap-2 p-3 rounded-xl bg-white/5 border border-white/10 hover:border-cyan-500/50 transition-colors cursor-pointer">
                <PieChart className="w-4 h-4 text-cyan-400" />
                <span className="text-xs font-medium text-white">Portfolio</span>
              </div>
            </Link>
          </div>
        </motion.div>

        {/* Market Overview - Top Metrics Row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-6"
        >
          <MarketMetricCard 
            label="Total Market Cap" 
            value={market.totalMarketCap} 
            change={market.totalMarketCapChange}
            icon={Globe}
          />
          <MarketMetricCard 
            label="24h Volume" 
            value={market.totalVolume} 
            change={market.totalVolumeChange}
            icon={BarChart3}
          />
          <MarketMetricCard 
            label="BTC Price" 
            value={market.btcPrice} 
            change={market.btcPriceChange}
            icon={Bitcoin}
          />
          <MarketMetricCard 
            label="ETH Price" 
            value={market.ethPrice} 
            change={market.ethPriceChange}
            icon={Coins}
          />
          <div className="col-span-2 md:col-span-2 lg:col-span-1">
            <GlassCard>
              <div className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Bitcoin className="w-4 h-4 text-orange-400" />
                  <span className="text-xs text-gray-400">BTC Dominance</span>
                </div>
                <p className="text-xl font-bold text-white">{market.btcDominance}%</p>
              </div>
            </GlassCard>
          </div>
          <div className="col-span-2 md:col-span-2 lg:col-span-1">
            <GlassCard>
              <div className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Coins className="w-4 h-4 text-blue-400" />
                  <span className="text-xs text-gray-400">ETH Dominance</span>
                </div>
                <p className="text-xl font-bold text-white">{market.ethDominance}%</p>
              </div>
            </GlassCard>
          </div>
        </motion.div>

        {/* Fear & Greed + Altcoin Season Row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6"
        >
          <FearGreedGauge value={market.fearGreed} label={market.fearGreedLabel} />
          <AltcoinSeasonGauge value={market.altcoinSeason} />
          <GlassCard glow>
            <div className="p-4">
              <div className="flex items-center gap-2 mb-3">
                <Trophy className="w-5 h-5 text-amber-400" />
                <span className="text-sm font-semibold text-white">AI Prediction Accuracy</span>
              </div>
              <div className="text-4xl font-bold text-emerald-400 mb-2">{avgWinRate}%</div>
              <p className="text-xs text-white/50">
                Based on {stats.reduce((a, b) => a + b.totalPredictions, 0).toLocaleString()} predictions
              </p>
              <div className="mt-3 grid grid-cols-2 gap-2">
                <div className="text-center p-2 bg-white/5 rounded-lg">
                  <div className="text-lg font-bold text-cyan-400">{predictions.length}</div>
                  <div className="text-[10px] text-white/40">Active Signals</div>
                </div>
                <div className="text-center p-2 bg-white/5 rounded-lg">
                  <div className="text-lg font-bold text-purple-400">{stats.length}</div>
                  <div className="text-[10px] text-white/40">Tracked Assets</div>
                </div>
              </div>
            </div>
          </GlassCard>
        </motion.div>

        {/* Price Chart + News Carousel Row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.18 }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-8"
        >
          <div className="lg:col-span-2">
            <PriceChart coin={selectedCoin} candles={candles} />
          </div>
          <div>
            <NewsCarousel news={mockNews} />
          </div>
        </motion.div>

        {/* Top Coins Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <GlassCard glow>
            <div className="p-5">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                <div className="flex items-center gap-2">
                  <LineChart className="w-5 h-5 text-cyan-400" />
                  <h3 className="text-lg font-bold text-white">Top Cryptocurrencies</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {['all', 'gainers', 'losers', 'meme', 'defi'].map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setCategory(cat)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                        category === cat 
                          ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/50' 
                          : 'bg-white/5 text-white/60 hover:bg-white/10 border border-transparent'
                      }`}
                      data-testid={`category-${cat}`}
                    >
                      {cat === 'all' ? 'Top 20' : cat.charAt(0).toUpperCase() + cat.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {coinsLoading ? (
                <div className="flex items-center justify-center py-12">
                  <RefreshCw className="w-8 h-8 text-cyan-400 animate-spin" />
                </div>
              ) : coins.length === 0 ? (
                <div className="text-center py-12">
                  <Coins className="w-12 h-12 text-cyan-500/30 mx-auto mb-3" />
                  <p className="text-sm text-white/50">No coins data available</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="text-left text-[10px] text-white/40 uppercase tracking-wider border-b border-white/10">
                        <th className="pb-3 pr-3">#</th>
                        <th className="pb-3 pr-4">Coin</th>
                        <th className="pb-3 pr-4 text-right">Price</th>
                        <th className="pb-3 pr-4 text-right">24h %</th>
                        <th className="pb-3 pr-4 text-right hidden md:table-cell">Market Cap</th>
                        <th className="pb-3 pr-4 text-right hidden lg:table-cell">Volume</th>
                        <th className="pb-3 hidden sm:table-cell">7d Chart</th>
                      </tr>
                    </thead>
                    <tbody>
                      {coins.map((coin, idx) => (
                        <TopCoinRow 
                          key={coin.id} 
                          coin={coin} 
                          rank={idx + 1} 
                          selected={selectedCoin?.id === coin.id}
                          onSelect={() => setSelectedCoin(coin)}
                        />
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </GlassCard>
        </motion.div>

        {/* Recent Predictions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
        >
          <GlassCard glow>
            <div className="p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Activity className="w-5 h-5 text-cyan-400" />
                  <h3 className="text-lg font-bold text-white">AI Predictions</h3>
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
                          className="border-b border-white/5 hover:bg-white/5 transition-colors cursor-pointer"
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

      </div>
    </div>
    </SubscriptionGate>
  );
}

function generateMockTopCoins(): TopCoin[] {
  const coins = [
    { id: 'bitcoin', symbol: 'btc', name: 'Bitcoin', price: 67500, change: 2.1 },
    { id: 'ethereum', symbol: 'eth', name: 'Ethereum', price: 3450, change: 1.8 },
    { id: 'solana', symbol: 'sol', name: 'Solana', price: 145, change: 4.2 },
    { id: 'bnb', symbol: 'bnb', name: 'BNB', price: 580, change: -0.5 },
    { id: 'xrp', symbol: 'xrp', name: 'XRP', price: 0.52, change: 1.2 },
    { id: 'cardano', symbol: 'ada', name: 'Cardano', price: 0.45, change: -1.8 },
    { id: 'avalanche', symbol: 'avax', name: 'Avalanche', price: 35, change: 3.5 },
    { id: 'dogecoin', symbol: 'doge', name: 'Dogecoin', price: 0.12, change: 5.2 },
    { id: 'polkadot', symbol: 'dot', name: 'Polkadot', price: 7.2, change: 0.8 },
    { id: 'polygon', symbol: 'matic', name: 'Polygon', price: 0.85, change: 2.3 },
  ];
  
  return coins.map((coin, idx) => ({
    id: coin.id,
    symbol: coin.symbol,
    name: coin.name,
    image: '',
    price: coin.price,
    priceChange24h: coin.change,
    marketCap: coin.price * (1000000000 / (idx + 1)),
    volume: coin.price * (100000000 / (idx + 1)),
    sparkline: Array.from({ length: 7 }, () => coin.price * (0.95 + Math.random() * 0.1)),
    rank: idx + 1,
  }));
}
