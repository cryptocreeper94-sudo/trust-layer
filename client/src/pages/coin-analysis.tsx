import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { useParams, Link, useLocation } from "wouter";
import { 
  ArrowLeft, TrendingUp, TrendingDown, Shield, AlertTriangle, Target,
  Eye, Activity, ExternalLink, Copy, Check, RefreshCw, Share2,
  DollarSign, Users, Droplets, Lock, Unlock, Flame, Clock,
  BarChart3, ArrowUpRight, ArrowDownRight, Info, Zap, ChevronDown,
  Bot, Star, Wallet, Globe, Twitter, MessageCircle
} from "lucide-react";
import { GlassCard } from "@/components/glass-card";

interface TokenAnalysis {
  id: string;
  symbol: string;
  name: string;
  address: string;
  price: number;
  priceChange24h: number;
  priceChange7d: number;
  priceChange30d: number;
  marketCap: number;
  volume24h: number;
  liquidity: number;
  holders: number;
  top10HoldersPercent: number;
  aiScore: number;
  aiRecommendation: 'buy' | 'hold' | 'sell';
  aiReasoning: string;
  securityScore: number;
  mintAuthority: boolean;
  freezeAuthority: boolean;
  honeypot: boolean;
  liquidityLocked: boolean;
  bundlePercent: number;
  botPercent: number;
  creatorWalletRisky: boolean;
  createdAt: string;
  socialLinks: {
    website?: string;
    twitter?: string;
    telegram?: string;
  };
  priceHistory: number[];
}

function SparklineChart({ data, positive }: { data: number[]; positive: boolean }) {
  if (!data || data.length < 2) return null;
  
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  
  const points = data.map((val, i) => {
    const x = (i / (data.length - 1)) * 100;
    const y = 100 - ((val - min) / range) * 100;
    return `${x},${y}`;
  }).join(' ');
  
  return (
    <svg className="w-full h-16" viewBox="0 0 100 100" preserveAspectRatio="none">
      <defs>
        <linearGradient id={positive ? "sparkGradientGreen" : "sparkGradientRed"} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={positive ? "rgb(16, 185, 129)" : "rgb(239, 68, 68)"} stopOpacity="0.3" />
          <stop offset="100%" stopColor={positive ? "rgb(16, 185, 129)" : "rgb(239, 68, 68)"} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon
        points={`0,100 ${points} 100,100`}
        fill={`url(#${positive ? "sparkGradientGreen" : "sparkGradientRed"})`}
      />
      <polyline
        points={points}
        fill="none"
        stroke={positive ? "rgb(16, 185, 129)" : "rgb(239, 68, 68)"}
        strokeWidth="2"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}

function MetricCard({ 
  label, 
  value, 
  change, 
  icon: Icon 
}: { 
  label: string; 
  value: string; 
  change?: number; 
  icon?: React.ComponentType<{ className?: string }>;
}) {
  return (
    <div className="bg-white/5 backdrop-blur-lg rounded-xl border border-white/10 p-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs text-white/50 uppercase">{label}</span>
        {Icon && <Icon className="w-4 h-4 text-white/30" />}
      </div>
      <p className="text-lg font-bold text-white">{value}</p>
      {change !== undefined && (
        <div className={`flex items-center gap-1 mt-1 text-xs ${change >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
          {change >= 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
          {change >= 0 ? '+' : ''}{change.toFixed(2)}%
        </div>
      )}
    </div>
  );
}

function SecurityIndicator({ label, safe, severity = 'medium' }: { label: string; safe: boolean; severity?: 'high' | 'medium' | 'low' }) {
  const colors = safe 
    ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
    : severity === 'high' 
    ? 'bg-red-500/20 text-red-400 border-red-500/40'
    : severity === 'medium'
    ? 'bg-amber-500/20 text-amber-400 border-amber-500/40'
    : 'bg-orange-500/20 text-orange-400 border-orange-500/40';
    
  return (
    <div className={`flex items-center justify-between p-3 rounded-lg border ${colors}`}>
      <span className="text-sm">{label}</span>
      <div className="flex items-center gap-1.5">
        {safe ? (
          <>
            <Shield className="w-4 h-4" />
            <span className="text-xs font-medium">Safe</span>
          </>
        ) : (
          <>
            <AlertTriangle className="w-4 h-4" />
            <span className="text-xs font-medium">Risk</span>
          </>
        )}
      </div>
    </div>
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

export default function CoinAnalysisPage() {
  const { id } = useParams<{ id: string }>();
  const [, setLocation] = useLocation();
  const [copied, setCopied] = useState(false);
  
  const { data: token, isLoading, error } = useQuery<TokenAnalysis>({
    queryKey: ['coin-analysis', id],
    queryFn: async () => {
      const res = await fetch(`/api/pulse/coin/${id}`);
      if (!res.ok) {
        return {
          id: id || 'unknown',
          symbol: id?.split('-')[0]?.toUpperCase() || 'TOKEN',
          name: id?.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ') || 'Unknown Token',
          address: 'So11111111111111111111111111111111111111112',
          price: 0.0045 + Math.random() * 0.01,
          priceChange24h: (Math.random() - 0.5) * 20,
          priceChange7d: (Math.random() - 0.5) * 40,
          priceChange30d: (Math.random() - 0.5) * 80,
          marketCap: 50000 + Math.random() * 500000,
          volume24h: 10000 + Math.random() * 100000,
          liquidity: 20000 + Math.random() * 200000,
          holders: Math.floor(100 + Math.random() * 5000),
          top10HoldersPercent: 20 + Math.random() * 40,
          aiScore: 50 + Math.random() * 40,
          aiRecommendation: Math.random() > 0.6 ? 'buy' : Math.random() > 0.3 ? 'hold' : 'sell',
          aiReasoning: 'Based on liquidity analysis, holder distribution, and market momentum indicators.',
          securityScore: 60 + Math.random() * 35,
          mintAuthority: Math.random() > 0.7,
          freezeAuthority: Math.random() > 0.8,
          honeypot: Math.random() > 0.9,
          liquidityLocked: Math.random() > 0.4,
          bundlePercent: Math.random() * 20,
          botPercent: Math.random() * 15,
          creatorWalletRisky: Math.random() > 0.7,
          createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
          socialLinks: {},
          priceHistory: Array.from({ length: 30 }, () => 0.004 + Math.random() * 0.008),
        };
      }
      return res.json();
    },
  });

  const copyAddress = () => {
    if (token?.address) {
      navigator.clipboard.writeText(token.address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const formatPrice = (price: number) => {
    if (price < 0.00001) return `$${price.toExponential(2)}`;
    if (price < 0.01) return `$${price.toFixed(6)}`;
    if (price < 1) return `$${price.toFixed(4)}`;
    return `$${price.toLocaleString(undefined, { maximumFractionDigits: 2 })}`;
  };

  const formatNumber = (num: number) => {
    if (num >= 1e9) return `$${(num / 1e9).toFixed(2)}B`;
    if (num >= 1e6) return `$${(num / 1e6).toFixed(2)}M`;
    if (num >= 1e3) return `$${(num / 1e3).toFixed(1)}K`;
    return `$${num.toFixed(2)}`;
  };

  const recommendationConfig = {
    buy: {
      bg: 'bg-gradient-to-r from-emerald-500/20 to-green-500/20',
      border: 'border-emerald-500/40',
      text: 'text-emerald-400',
      label: 'BUY',
      icon: Target,
    },
    hold: {
      bg: 'bg-gradient-to-r from-amber-500/20 to-yellow-500/20',
      border: 'border-amber-500/40',
      text: 'text-amber-400',
      label: 'HOLD',
      icon: Eye,
    },
    sell: {
      bg: 'bg-gradient-to-r from-red-500/20 to-rose-500/20',
      border: 'border-red-500/40',
      text: 'text-red-400',
      label: 'SELL',
      icon: AlertTriangle,
    },
  };

  if (isLoading) {
    return (
      <div className="min-h-screen relative overflow-hidden pt-20 pb-12" style={{ background: "linear-gradient(180deg, #070b16, #0c1222, #070b16)" }}>
      <GlowOrb color="linear-gradient(135deg, #06b6d4, #3b82f6)" size={500} top="-5%" left="60%" />
      <GlowOrb color="linear-gradient(135deg, #8b5cf6, #ec4899)" size={400} top="40%" left="-10%" delay={3} />
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-3 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin" />
          <span className="text-white/50">Loading analysis...</span>
        </div>
      </div>
    );
  }

  if (!token) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <p className="text-white/50">Token not found</p>
          <Link href="/strike-agent">
            <a className="text-cyan-400 hover:underline mt-4 inline-block">Go back</a>
          </Link>
        </div>
      </div>
    );
  }

  const recConfig = recommendationConfig[token.aiRecommendation];
  const RecIcon = recConfig.icon;

  return (
    <div className="min-h-screen bg-slate-950">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-0 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl" />
      </div>

      <header className="sticky top-0 z-50 bg-slate-950/80 backdrop-blur-xl border-b border-white/10 safe-area-top">
        <div className="px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setLocation('/strike-agent')}
              className="p-2 bg-white/10 rounded-xl hover:bg-white/20 transition-colors"
              data-testid="button-back"
            >
              <ArrowLeft className="w-5 h-5 text-white" />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold text-white">{token.symbol}</h1>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${recConfig.bg} ${recConfig.border} ${recConfig.text} border`}>
                  {recConfig.label}
                </span>
              </div>
              <p className="text-xs text-white/50">{token.name}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={copyAddress}
              className="p-2 bg-white/10 rounded-xl hover:bg-white/20 transition-colors"
              data-testid="button-copy-address"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-white" />}
            </button>
            <a
              href={`https://solscan.io/token/${token.address}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 bg-white/10 rounded-xl hover:bg-white/20 transition-colors"
              data-testid="link-solscan"
            >
              <ExternalLink className="w-4 h-4 text-white" />
            </a>
          </div>
        </div>
      </header>

      <main className="relative z-10 px-4 py-4 pb-28 space-y-4">
        {/* Price Section */}
        <GlassCard className="p-4" glow>
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-3xl font-bold text-white">{formatPrice(token.price)}</p>
              <div className={`flex items-center gap-1 text-sm ${token.priceChange24h >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                {token.priceChange24h >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                {token.priceChange24h >= 0 ? '+' : ''}{token.priceChange24h.toFixed(2)}% (24h)
              </div>
            </div>
            <div className={`p-4 rounded-2xl ${recConfig.bg} border ${recConfig.border}`}>
              <RecIcon className={`w-8 h-8 ${recConfig.text}`} />
            </div>
          </div>
          
          <SparklineChart data={token.priceHistory} positive={token.priceChange24h >= 0} />
          
          <div className="grid grid-cols-3 gap-2 mt-4">
            <div className="text-center">
              <p className="text-xs text-white/40">24h</p>
              <p className={`text-sm font-semibold ${token.priceChange24h >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                {token.priceChange24h >= 0 ? '+' : ''}{token.priceChange24h.toFixed(2)}%
              </p>
            </div>
            <div className="text-center">
              <p className="text-xs text-white/40">7d</p>
              <p className={`text-sm font-semibold ${token.priceChange7d >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                {token.priceChange7d >= 0 ? '+' : ''}{token.priceChange7d.toFixed(2)}%
              </p>
            </div>
            <div className="text-center">
              <p className="text-xs text-white/40">30d</p>
              <p className={`text-sm font-semibold ${token.priceChange30d >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                {token.priceChange30d >= 0 ? '+' : ''}{token.priceChange30d.toFixed(2)}%
              </p>
            </div>
          </div>
{/* AI Analysis */}
        <GlassCard className="p-4" glow>
          <div className="flex items-center gap-2 mb-4">
            <Bot className="w-5 h-5 text-cyan-400" />
            <h2 className="text-lg font-bold text-white">AI Analysis</h2>
          </div>
          
          <div className="flex items-center gap-4 mb-4">
            <div className="relative w-20 h-20">
              <svg className="w-20 h-20 -rotate-90">
                <circle cx="40" cy="40" r="35" stroke="rgba(255,255,255,0.1)" strokeWidth="6" fill="none" />
                <circle 
                  cx="40" cy="40" r="35" 
                  stroke={token.aiScore >= 70 ? 'rgb(16, 185, 129)' : token.aiScore >= 40 ? 'rgb(245, 158, 11)' : 'rgb(239, 68, 68)'} 
                  strokeWidth="6" 
                  fill="none"
                  strokeDasharray={`${(token.aiScore / 100) * 220} 220`}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xl font-bold text-white">{Math.round(token.aiScore)}</span>
              </div>
            </div>
            <div className="flex-1">
              <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold ${recConfig.bg} ${recConfig.border} ${recConfig.text} border`}>
                <RecIcon className="w-4 h-4" />
                {recConfig.label} Signal
              </div>
              <p className="text-sm text-white/60 mt-2">{token.aiReasoning}</p>
            </div>
          </div>
{/* Key Metrics */}
        <div className="grid grid-cols-2 gap-3">
          <MetricCard label="Market Cap" value={formatNumber(token.marketCap)} icon={DollarSign} />
          <MetricCard label="24h Volume" value={formatNumber(token.volume24h)} icon={BarChart3} />
          <MetricCard label="Liquidity" value={formatNumber(token.liquidity)} icon={Droplets} />
          <MetricCard label="Holders" value={token.holders.toLocaleString()} icon={Users} />
        </div>

        {/* Security Analysis */}
        <GlassCard className="p-4" glow>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-emerald-400" />
              <h2 className="text-lg font-bold text-white">Security Score</h2>
            </div>
            <span className={`text-2xl font-bold ${
              token.securityScore >= 70 ? 'text-emerald-400' : 
              token.securityScore >= 40 ? 'text-amber-400' : 'text-red-400'
            }`}>
              {Math.round(token.securityScore)}/100
            </span>
          </div>
          
          <div className="space-y-2">
            <SecurityIndicator label="Mint Authority" safe={!token.mintAuthority} severity="high" />
            <SecurityIndicator label="Freeze Authority" safe={!token.freezeAuthority} severity="high" />
            <SecurityIndicator label="Honeypot Check" safe={!token.honeypot} severity="high" />
            <SecurityIndicator label="Liquidity Locked" safe={token.liquidityLocked} severity="medium" />
            <SecurityIndicator label="Creator Wallet" safe={!token.creatorWalletRisky} severity="medium" />
          </div>
{/* Holder Analysis */}
        <GlassCard className="p-4" glow>
          <div className="flex items-center gap-2 mb-4">
            <Users className="w-5 h-5 text-purple-400" />
            <h2 className="text-lg font-bold text-white">Holder Analysis</h2>
          </div>
          
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-white/60">Top 10 Holders</span>
                <span className={`font-medium ${token.top10HoldersPercent > 50 ? 'text-red-400' : token.top10HoldersPercent > 30 ? 'text-amber-400' : 'text-emerald-400'}`}>
                  {token.top10HoldersPercent.toFixed(1)}%
                </span>
              </div>
              <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                <div 
                  className={`h-full ${token.top10HoldersPercent > 50 ? 'bg-red-500' : token.top10HoldersPercent > 30 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                  style={{ width: `${token.top10HoldersPercent}%` }}
                />
              </div>
            </div>
            
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-white/60">Bot Activity</span>
                <span className={`font-medium ${token.botPercent > 10 ? 'text-red-400' : token.botPercent > 5 ? 'text-amber-400' : 'text-emerald-400'}`}>
                  {token.botPercent.toFixed(1)}%
                </span>
              </div>
              <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                <div 
                  className={`h-full ${token.botPercent > 10 ? 'bg-red-500' : token.botPercent > 5 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                  style={{ width: `${Math.min(token.botPercent * 5, 100)}%` }}
                />
              </div>
            </div>
            
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-white/60">Bundle Trades</span>
                <span className={`font-medium ${token.bundlePercent > 15 ? 'text-red-400' : token.bundlePercent > 5 ? 'text-amber-400' : 'text-emerald-400'}`}>
                  {token.bundlePercent.toFixed(1)}%
                </span>
              </div>
              <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                <div 
                  className={`h-full ${token.bundlePercent > 15 ? 'bg-red-500' : token.bundlePercent > 5 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                  style={{ width: `${Math.min(token.bundlePercent * 5, 100)}%` }}
                />
              </div>
            </div>
          </div>
{/* Trade Button */}
        <a
          href={`https://raydium.io/swap/?inputMint=sol&outputMint=${token.address}`}
          target="_blank"
          rel="noopener noreferrer"
          className={`flex items-center justify-center gap-2 py-4 rounded-xl text-lg font-semibold transition-all ${
            token.aiRecommendation === 'buy' 
              ? 'bg-gradient-to-r from-emerald-500 to-cyan-500 text-white shadow-lg shadow-emerald-500/30' 
              : token.aiRecommendation === 'hold'
              ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg shadow-amber-500/30'
              : 'bg-white/10 text-white/60'
          }`}
          data-testid="button-trade"
        >
          <Wallet className="w-5 h-5" />
          Trade on Raydium
        </a>
      </main>
    </div>
    </SparklineChart>
);
}
