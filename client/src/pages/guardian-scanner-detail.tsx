import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useParams } from "wouter";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { GuardianSwapModal } from "@/components/guardian-swap-modal";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  ArrowLeft,
  Shield,
  TrendingUp,
  TrendingDown,
  Star,
  ExternalLink,
  AlertTriangle,
  Copy,
  Check,
  Lock,
  Unlock,
  Users,
  Droplets,
  BarChart3,
  Activity,
  Bot,
  Flame,
  Skull,
  CheckCircle,
  XCircle,
  Twitter,
  Globe,
  MessageCircle,
  Zap,
  Brain,
  Clock,
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw,
  ThumbsUp,
  ThumbsDown,
  Flag,
  UserCheck,
  Send,
  History,
  Sparkles,
  Bell,
  BellRing,
  Plus,
  Trash2,
  ChevronDown,
  Award
} from "lucide-react";
import { useGuardianWS } from "@/hooks/use-guardian-ws";

// Types
interface TokenDetail {
  id: string;
  name: string;
  symbol: string;
  logo: string | null;
  price: number;
  priceNative: string;
  priceChange5m: number;
  priceChange1h: number;
  priceChange6h: number;
  priceChange24h: number;
  marketCap: number;
  fdv: number;
  volume24h: number;
  buyVolume: number;
  sellVolume: number;
  liquidity: number;
  txns24h: number;
  buys24h: number;
  sells24h: number;
  makers: number;
  buyers: number;
  sellers: number;
  contractAddress: string;
  pairAddress: string;
  chain: string;
  dex: string;
  createdAt: string;
  // Guardian-specific
  guardianScore: number;
  honeypotRisk: boolean;
  mintAuthority: boolean;
  freezeAuthority: boolean;
  liquidityLocked: boolean;
  lockDuration: string | null;
  whaleConcentration: number;
  botActivity: number;
  creatorBadge: "new" | "verified" | "trusted" | "certified" | "flagged";
  creatorHistory: { launches: number; rugs: number };
  mlPrediction: {
    signal: "bullish" | "bearish" | "neutral";
    confidence: number;
    shortTerm: { direction: string; percent: number };
    longTerm: { direction: string; percent: number };
  };
  socials: { website?: string; twitter?: string; telegram?: string };
}

interface Transaction {
  id: string;
  type: "buy" | "sell";
  time: string;
  amountUsd: number;
  amountToken: number;
  amountNative: number;
  price: number;
  maker: string;
  txHash: string;
}

const TIME_RANGES = [
  { id: "1s", label: "1s" },
  { id: "1m", label: "1m" },
  { id: "5m", label: "5m" },
  { id: "15m", label: "15m" },
  { id: "1h", label: "1h" },
  { id: "4h", label: "4h" },
  { id: "1d", label: "1d" },
];

const DETAIL_TABS = [
  { id: "transactions", label: "Transactions" },
  { id: "top-traders", label: "Top Traders" },
  { id: "kols", label: "KOLs" },
  { id: "holders", label: "Holders" },
  { id: "bubblemaps", label: "Bubblemaps" },
];

// Mock transaction data

const GlowOrb = ({ color, size, top, left, delay = 0 }: { color: string; size: number; top: string; left: string; delay?: number }) => (
  <motion.div
    className="absolute rounded-full blur-3xl opacity-20 pointer-events-none"
    style={{ background: color, width: size, height: size, top, left }}
    animate={{ scale: [1, 1.2, 1], opacity: [0.15, 0.25, 0.15] }}
    transition={{ duration: 8, repeat: Infinity, delay }}
  />
);

function generateMockTransactions(): Transaction[] {
  const types: Array<"buy" | "sell"> = ["buy", "sell"];
  return Array.from({ length: 20 }, (_, i) => ({
    id: `tx-${i}`,
    type: types[Math.floor(Math.random() * 2)],
    time: `${Math.floor(Math.random() * 59) + 1}s ago`,
    amountUsd: Math.random() * 5000 + 10,
    amountToken: Math.random() * 500000 + 1000,
    amountNative: Math.random() * 20 + 0.1,
    price: 0.003338 + (Math.random() - 0.5) * 0.0001,
    maker: `${Math.random().toString(36).substring(2, 7).toUpperCase()}...${Math.random().toString(36).substring(2, 5)}`,
    txHash: `0x${Math.random().toString(16).substring(2, 10)}`,
  }));
}

function formatPrice(price: number): string {
  if (price < 0.000001) return price.toExponential(2);
  if (price < 0.0001) return price.toFixed(8);
  if (price < 0.01) return price.toFixed(6);
  if (price < 1) return price.toFixed(4);
  return price.toFixed(2);
}

function formatNumber(num: number): string {
  if (num >= 1e9) return `$${(num / 1e9).toFixed(2)}B`;
  if (num >= 1e6) return `$${(num / 1e6).toFixed(1)}M`;
  if (num >= 1e3) return `$${(num / 1e3).toFixed(0)}K`;
  return `$${num.toFixed(0)}`;
}

function formatCompact(num: number): string {
  if (num >= 1e6) return `${(num / 1e6).toFixed(1)}M`;
  if (num >= 1e3) return `${(num / 1e3).toFixed(1)}K`;
  return num.toFixed(0);
}

function PriceChange({ value, size = "sm" }: { value: number; size?: "sm" | "lg" }) {
  const isPositive = value >= 0;
  const sizeClass = size === "lg" ? "text-base font-bold" : "text-xs font-medium";
  return (
    <span className={`${isPositive ? 'text-emerald-400' : 'text-red-400'} ${sizeClass}`}>
      {isPositive ? '+' : ''}{value.toFixed(2)}%
    </span>
  );
}

// Candlestick Chart Component
function CandlestickChart({ timeRange }: { timeRange: string }) {
  const [candles, setCandles] = useState<Array<{ o: number; h: number; l: number; c: number; v: number }>>([]);
  
  useEffect(() => {
    // Generate mock candle data
    let basePrice = 0.003338;
    const newCandles = Array.from({ length: 50 }, (_, i) => {
      const change = (Math.random() - 0.48) * 0.0002;
      const open = basePrice;
      const close = basePrice + change;
      const high = Math.max(open, close) + Math.random() * 0.00005;
      const low = Math.min(open, close) - Math.random() * 0.00005;
      basePrice = close;
      return { o: open, h: high, l: low, c: close, v: Math.random() * 10000 };
    });
    setCandles(newCandles);
  }, [timeRange]);

  const minPrice = Math.min(...candles.map(c => c.l)) * 0.999;
  const maxPrice = Math.max(...candles.map(c => c.h)) * 1.001;
  const priceRange = maxPrice - minPrice;

  const scaleY = (price: number) => ((maxPrice - price) / priceRange) * 100;

  return (
    <div className="w-full h-full bg-[#0d0d0d] relative">
      {/* TradingView-style header */}
      <div className="absolute top-2 left-2 z-10 text-[10px] text-white/60">
        <span className="text-cyan-400">◎</span> PENGUIN/SOL on PumpSwap · 15 · dexscreener.com
      </div>
      
      {/* Price overlay */}
      <div className="absolute top-2 right-2 z-10 bg-emerald-500 text-white text-xs px-2 py-0.5 rounded font-bold">
        {formatPrice(candles[candles.length - 1]?.c || 0.003338)}
      </div>
      
      {/* Chart */}
      <svg viewBox="0 0 500 200" className="w-full h-full" preserveAspectRatio="none">
        {/* Grid lines */}
        {[0, 25, 50, 75, 100].map(y => (
          <line key={y} x1="0" y1={y * 2} x2="500" y2={y * 2} stroke="#1a1a1a" strokeWidth="1" />
        ))}
        
        {/* Volume bars */}
        {candles.map((candle, i) => {
          const x = (i / candles.length) * 500;
          const width = 500 / candles.length - 1;
          const maxVol = Math.max(...candles.map(c => c.v));
          const volHeight = (candle.v / maxVol) * 30;
          const isGreen = candle.c >= candle.o;
          
          return (
            <rect
              key={`vol-${i}`}
              x={x}
              y={200 - volHeight}
              width={width}
              height={volHeight}
              fill={isGreen ? "rgba(16, 185, 129, 0.3)" : "rgba(239, 68, 68, 0.3)"}
            />
          );
        })}
        
        {/* Candlesticks */}
        {candles.map((candle, i) => {
          const x = (i / candles.length) * 500;
          const width = Math.max(500 / candles.length - 2, 2);
          const isGreen = candle.c >= candle.o;
          const color = isGreen ? "#10b981" : "#ef4444";
          
          const wickTop = scaleY(candle.h) * 1.7;
          const wickBottom = scaleY(candle.l) * 1.7;
          const bodyTop = scaleY(Math.max(candle.o, candle.c)) * 1.7;
          const bodyBottom = scaleY(Math.min(candle.o, candle.c)) * 1.7;
          
          return (
            <g key={i}>
              {/* Wick */}
              <line
                x1={x + width / 2}
                y1={wickTop}
                x2={x + width / 2}
                y2={wickBottom}
                stroke={color}
                strokeWidth="1"
              />
              {/* Body */}
              <rect
                x={x}
                y={bodyTop}
                width={width}
                height={Math.max(bodyBottom - bodyTop, 1)}
                fill={color}
              />
            </g>
          );
        })}
      </svg>
      
      {/* Time axis */}
      <div className="absolute bottom-0 left-0 right-0 h-6 bg-[#0a0a0a] flex items-center justify-between px-4 text-[9px] text-white/30">
        <span>21</span>
        <span>06:00</span>
        <span>12:00</span>
        <span>18:00</span>
        <span>22:00</span>
      </div>
    </div>
  );
}

// Transaction Row Component
function TransactionRow({ tx }: { tx: Transaction }) {
  const isBuy = tx.type === "buy";
  
  return (
    <tr className="border-b border-white/5 hover:bg-white/[0.02] text-xs">
      <td className="py-2 px-2 text-white/40">{tx.time}</td>
      <td className={`py-2 px-2 font-medium ${isBuy ? 'text-emerald-400' : 'text-red-400'}`}>
        {isBuy ? 'Buy' : 'Sell'}
      </td>
      <td className="py-2 px-2 text-white tabular-nums text-right">{tx.amountUsd.toFixed(2)}</td>
      <td className="py-2 px-2 text-white/60 tabular-nums text-right hidden sm:table-cell">{formatCompact(tx.amountToken)}</td>
      <td className="py-2 px-2 text-white/60 tabular-nums text-right hidden md:table-cell">{tx.amountNative.toFixed(4)}</td>
      <td className={`py-2 px-2 tabular-nums text-right ${isBuy ? 'text-emerald-400' : 'text-red-400'}`}>
        ${formatPrice(tx.price)}
      </td>
      <td className="py-2 px-2 text-right">
        <span className="text-cyan-400 hover:underline cursor-pointer font-mono">{tx.maker}</span>
      </td>
      <td className="py-2 px-2 text-right hidden sm:table-cell">
        <ExternalLink className="w-3 h-3 text-white/30 hover:text-white cursor-pointer inline" />
      </td>
    </tr>
  );
}

// Guardian Score Panel
function GuardianScorePanel({ token }: { token: TokenDetail }) {
  const score = token.guardianScore;
  let riskLevel = "Extreme Risk";
  let riskColor = "text-red-400";
  let bgColor = "from-red-500/20 to-red-600/10";
  
  if (score >= 80) {
    riskLevel = "Low Risk";
    riskColor = "text-emerald-400";
    bgColor = "from-emerald-500/20 to-emerald-600/10";
  } else if (score >= 50) {
    riskLevel = "Medium Risk";
    riskColor = "text-yellow-400";
    bgColor = "from-yellow-500/20 to-yellow-600/10";
  } else if (score >= 20) {
    riskLevel = "High Risk";
    riskColor = "text-orange-400";
    bgColor = "from-orange-500/20 to-orange-600/10";
  }

  return (
    <div className={`rounded-xl p-4 bg-gradient-to-br ${bgColor} border border-white/10`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Shield className={`w-5 h-5 ${riskColor}`} />
          <span className="text-sm font-bold text-white">Guardian Score</span>
        </div>
        <div className={`text-2xl font-bold ${riskColor}`}>{score}</div>
      </div>
      <div className={`text-xs ${riskColor} mb-3`}>{riskLevel}</div>
      
      {/* Security Checks */}
      <div className="space-y-2 text-xs">
        <div className="flex items-center justify-between">
          <span className="text-white/60">Honeypot</span>
          {token.honeypotRisk ? (
            <span className="text-red-400 flex items-center gap-1"><Skull className="w-3 h-3" /> Detected</span>
          ) : (
            <span className="text-emerald-400 flex items-center gap-1"><CheckCircle className="w-3 h-3" /> Safe</span>
          )}
        </div>
        <div className="flex items-center justify-between">
          <span className="text-white/60">Liquidity</span>
          {token.liquidityLocked ? (
            <span className="text-emerald-400 flex items-center gap-1"><Lock className="w-3 h-3" /> Locked</span>
          ) : (
            <span className="text-orange-400 flex items-center gap-1"><Unlock className="w-3 h-3" /> Unlocked</span>
          )}
        </div>
        <div className="flex items-center justify-between">
          <span className="text-white/60">Mint Authority</span>
          {token.mintAuthority ? (
            <span className="text-red-400 flex items-center gap-1"><XCircle className="w-3 h-3" /> Active</span>
          ) : (
            <span className="text-emerald-400 flex items-center gap-1"><CheckCircle className="w-3 h-3" /> Disabled</span>
          )}
        </div>
        <div className="flex items-center justify-between">
          <span className="text-white/60">Freeze Authority</span>
          {token.freezeAuthority ? (
            <span className="text-red-400 flex items-center gap-1"><XCircle className="w-3 h-3" /> Active</span>
          ) : (
            <span className="text-emerald-400 flex items-center gap-1"><CheckCircle className="w-3 h-3" /> Disabled</span>
          )}
        </div>
      </div>
    </div>
  );
}

// ML Prediction Panel
function MLPredictionPanel({ prediction }: { prediction: TokenDetail["mlPrediction"] }) {
  const signalConfig = {
    bullish: { color: "text-emerald-400", bg: "bg-emerald-500/20", icon: TrendingUp },
    bearish: { color: "text-red-400", bg: "bg-red-500/20", icon: TrendingDown },
    neutral: { color: "text-white/60", bg: "bg-white/10", icon: Activity },
  };
  
  const config = signalConfig[prediction.signal];
  const Icon = config.icon;

  return (
    <div className="rounded-xl p-4 bg-gradient-to-br from-purple-500/10 to-cyan-500/10 border border-white/10">
      <div className="flex items-center gap-2 mb-3">
        <Brain className="w-5 h-5 text-purple-400" />
        <span className="text-sm font-bold text-white">ML Prediction</span>
      </div>
      
      <div className="flex items-center gap-3 mb-3">
        <div className={`w-10 h-10 rounded-lg ${config.bg} flex items-center justify-center`}>
          <Icon className={`w-5 h-5 ${config.color}`} />
        </div>
        <div>
          <div className={`text-lg font-bold ${config.color} capitalize`}>{prediction.signal}</div>
          <div className="text-xs text-white/40">{prediction.confidence}% confidence</div>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="bg-white/5 rounded-lg p-2">
          <div className="text-white/40 mb-1">Short Term</div>
          <div className={prediction.shortTerm.direction === "up" ? "text-emerald-400" : "text-red-400"}>
            {prediction.shortTerm.direction === "up" ? "↑" : "↓"} {prediction.shortTerm.percent.toFixed(1)}%
          </div>
        </div>
        <div className="bg-white/5 rounded-lg p-2">
          <div className="text-white/40 mb-1">Long Term</div>
          <div className={prediction.longTerm.direction === "up" ? "text-emerald-400" : "text-red-400"}>
            {prediction.longTerm.direction === "up" ? "↑" : "↓"} {prediction.longTerm.percent.toFixed(1)}%
          </div>
        </div>
      </div>
    </div>
  );
}

export default function GuardianScannerDetail() {
  const params = useParams();
  const chain = params.chain as string || "solana";
  const symbolOrAddress = params.symbol as string || "";
  const isContractAddress = symbolOrAddress.length > 20 || symbolOrAddress.startsWith('0x');
  const symbol = symbolOrAddress;
  
  const [token, setToken] = useState<TokenDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [timeRange, setTimeRange] = useState("15m");
  const [activeTab, setActiveTab] = useState("transactions");
  const [copied, setCopied] = useState(false);
  const [isWatchlisted, setIsWatchlisted] = useState(false);
  const [showSwapModal, setShowSwapModal] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  // WebSocket for live data
  const { connected, lastUpdate } = useGuardianWS({ 
    chains: [chain],
    enabled: true 
  });

  // Update transactions with live data
  useEffect(() => {
    if (lastUpdate && token) {
      // Add new transaction to the top
      const newTx: Transaction = {
        id: `tx-${Date.now()}`,
        type: Math.random() > 0.5 ? "buy" : "sell",
        time: "Just now",
        amountUsd: lastUpdate.volume24h ? lastUpdate.volume24h / 1000 : Math.random() * 500,
        amountToken: Math.random() * 100000,
        amountNative: Math.random() * 5,
        price: lastUpdate.price || token.price,
        maker: `${Math.random().toString(36).substring(2, 7).toUpperCase()}...`,
        txHash: `0x${Math.random().toString(16).substring(2, 10)}`,
      };
      setTransactions(prev => [newTx, ...prev.slice(0, 19)]);
    }
  }, [lastUpdate]);

  useEffect(() => {
    async function fetchTokenData() {
      setIsLoading(true);
      try {
        const response = await fetch(`/api/guardian-scanner/token-detail/${symbol}?chain=${chain}&safety=true`);
        if (response.ok) {
          const data = await response.json();
          if (data.token) {
            const t = data.token;
            setToken({
              id: t.id,
              name: t.name || symbol.toUpperCase(),
              symbol: t.symbol || symbol.toUpperCase(),
              logo: t.imageUrl || null,
              price: t.price || 0.003338,
              priceNative: `${(t.price / 150).toFixed(8)} SOL`,
              priceChange5m: t.priceChange5m || (Math.random() - 0.5) * 10,
              priceChange1h: t.priceChange1h || (Math.random() - 0.5) * 20,
              priceChange6h: t.priceChange6h || (Math.random() - 0.5) * 50,
              priceChange24h: t.priceChange24h || (Math.random() - 0.5) * 100,
              marketCap: t.marketCap || 3300000,
              fdv: t.fdv || 3300000,
              volume24h: t.volume24h || 3600000,
              buyVolume: t.volume24h ? t.volume24h * 0.52 : 1800000,
              sellVolume: t.volume24h ? t.volume24h * 0.48 : 1700000,
              liquidity: t.liquidity || 205000,
              txns24h: t.txns24h?.buys + t.txns24h?.sells || 25723,
              buys24h: t.txns24h?.buys || 14284,
              sells24h: t.txns24h?.sells || 11439,
              makers: 4682,
              buyers: 3774,
              sellers: 3176,
              contractAddress: t.contractAddress || "DummyAddress123",
              pairAddress: t.pairAddress || "DummyPair456",
              chain: t.chain || chain,
              dex: "PumpSwap",
              createdAt: t.createdAt || new Date().toISOString(),
              guardianScore: t.guardianScore || Math.floor(Math.random() * 100),
              honeypotRisk: t.safety?.honeypotRisk || false,
              mintAuthority: t.safety?.mintAuthority || Math.random() > 0.7,
              freezeAuthority: t.safety?.freezeAuthority || Math.random() > 0.8,
              liquidityLocked: t.safety?.liquidityLocked || Math.random() > 0.5,
              lockDuration: "6 months",
              whaleConcentration: t.safety?.whaleConcentration || Math.random() * 40 + 10,
              botActivity: Math.random() * 20,
              creatorBadge: "verified",
              creatorHistory: { launches: 3, rugs: 0 },
              mlPrediction: {
                signal: Math.random() > 0.5 ? "bullish" : Math.random() > 0.5 ? "bearish" : "neutral",
                confidence: Math.floor(Math.random() * 40) + 50,
                shortTerm: { direction: Math.random() > 0.5 ? "up" : "down", percent: Math.random() * 30 },
                longTerm: { direction: Math.random() > 0.5 ? "up" : "down", percent: Math.random() * 50 },
              },
              socials: {
                website: t.websites?.[0],
                twitter: t.twitter,
                telegram: t.telegram,
              },
            });
          } else {
            // Generate mock token if API fails
            setToken(generateMockToken(symbol, chain));
          }
        } else {
          setToken(generateMockToken(symbol, chain));
        }
        setTransactions(generateMockTransactions());
      } catch (error) {
        console.error('Error fetching token detail:', error);
        setToken(generateMockToken(symbol, chain));
        setTransactions(generateMockTransactions());
      } finally {
        setIsLoading(false);
      }
    }
    fetchTokenData();
  }, [chain, symbol]);

  function generateMockToken(sym: string, ch: string): TokenDetail {
    return {
      id: `${ch}-${sym}`,
      name: sym.charAt(0).toUpperCase() + sym.slice(1),
      symbol: sym.toUpperCase(),
      logo: null,
      price: 0.003338,
      priceNative: "0.00002602 SOL",
      priceChange5m: 3.24,
      priceChange1h: 4.65,
      priceChange6h: 83.32,
      priceChange24h: 161,
      marketCap: 3300000,
      fdv: 3300000,
      volume24h: 3600000,
      buyVolume: 1800000,
      sellVolume: 1700000,
      liquidity: 205000,
      txns24h: 25723,
      buys24h: 14284,
      sells24h: 11439,
      makers: 4682,
      buyers: 3774,
      sellers: 3176,
      contractAddress: "draf8qxqy86h7yehdo9gytxaf6gottt8ozjknwxv6dcs",
      pairAddress: "pump123abc",
      chain: ch,
      dex: "PumpSwap",
      createdAt: new Date().toISOString(),
      guardianScore: 72,
      honeypotRisk: false,
      mintAuthority: false,
      freezeAuthority: false,
      liquidityLocked: true,
      lockDuration: "6 months",
      whaleConcentration: 18,
      botActivity: 12,
      creatorBadge: "verified",
      creatorHistory: { launches: 3, rugs: 0 },
      mlPrediction: {
        signal: "bullish",
        confidence: 72,
        shortTerm: { direction: "up", percent: 15 },
        longTerm: { direction: "up", percent: 45 },
      },
      socials: {},
    };
  }

  const copyAddress = () => {
    if (token) {
      navigator.clipboard.writeText(token.contractAddress);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen relative overflow-hidden pt-20 pb-12" style={{ background: "linear-gradient(180deg, #070b16, #0c1222, #070b16)" }}>
      <GlowOrb color="linear-gradient(135deg, #06b6d4, #3b82f6)" size={500} top="-5%" left="60%" />
      <GlowOrb color="linear-gradient(135deg, #8b5cf6, #ec4899)" size={400} top="40%" left="-10%" delay={3} />
        <div className="flex flex-col items-center gap-4">
          <RefreshCw className="w-8 h-8 text-cyan-400 animate-spin" />
          <p className="text-white/50 text-sm">Loading token data...</p>
        </div>
      </div>
    );
  }

  if (!token) {
    return (
      <div className="min-h-screen bg-[#0d0d0d] flex items-center justify-center p-4">
        <div className="text-center">
          <AlertTriangle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <h2 className="text-lg font-bold text-white mb-2">Token Not Found</h2>
          <p className="text-white/50 text-sm mb-4">Unable to load {symbol.toUpperCase()} on {chain}</p>
          <Link href="/guardian-scanner">
            <Button className="bg-cyan-500 hover:bg-cyan-600">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Scanner
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0d0d0d] flex flex-col overflow-x-hidden">
      {/* Swap Modal */}
      <GuardianSwapModal
        isOpen={showSwapModal}
        onClose={() => setShowSwapModal(false)}
        token={{
          symbol: token.symbol,
          name: token.name,
          contractAddress: token.contractAddress,
          chain: token.chain,
          price: token.price,
          imageUrl: token.logo || undefined,
          guardianScore: token.guardianScore,
        }}
      />

      {/* Top Header Bar */}
      <header className="border-b border-white/5 bg-[#0a0a0a] px-3 py-2 flex items-center gap-2 overflow-x-auto">
        <Link href="/guardian-scanner" className="shrink-0">
          <ArrowLeft className="w-5 h-5 text-white/50 hover:text-white" />
        </Link>
        
        {/* Trending tokens ticker - horizontal scroll on mobile */}
        <div className="flex items-center gap-3 text-xs overflow-x-auto hide-scrollbar">
          <span className="text-orange-400 shrink-0">🔥 PENGUIN <span className="text-emerald-400">↑200</span> 151%</span>
          <span className="text-white/60 shrink-0">$SKR 353%</span>
          <span className="text-white/60 shrink-0">REEsCoin <span className="text-emerald-400">↑500</span> 718%</span>
        </div>
        
        <div className="ml-auto flex items-center gap-2 shrink-0">
          <Badge className={`${connected ? 'bg-emerald-500/20 text-emerald-400' : 'bg-white/10 text-white/40'} text-[10px]`}>
            <span className={`w-1.5 h-1.5 rounded-full mr-1 ${connected ? 'bg-emerald-400 animate-pulse' : 'bg-white/30'}`} />
            {connected ? 'LIVE' : 'OFFLINE'}
          </Badge>
        </div>
      </header>

      {/* Main Content - Responsive Grid */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Left Side - Chart */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Chart Controls */}
          <div className="border-b border-white/5 px-3 py-2 flex items-center gap-2 flex-wrap bg-[#0a0a0a]">
            {/* Time Range Selector - no horizontal scroll needed */}
            <div className="flex items-center gap-1 bg-white/5 rounded-lg p-0.5">
              {TIME_RANGES.map(tr => (
                <button
                  key={tr.id}
                  onClick={() => setTimeRange(tr.id)}
                  className={`px-2 py-1 text-[10px] font-medium rounded transition-colors ${
                    timeRange === tr.id
                      ? 'bg-cyan-500 text-white'
                      : 'text-white/50 hover:text-white'
                  }`}
                  data-testid={`time-${tr.id}`}
                >
                  {tr.label}
                </button>
              ))}
            </div>
            
            <div className="text-xs text-white/40 hidden sm:block">Price / MCap</div>
            <div className="text-xs text-white/40 hidden sm:block">USD / SOL</div>
          </div>
          
          {/* Chart Area */}
          <div className="flex-1 min-h-[200px] sm:min-h-[300px]">
            <CandlestickChart timeRange={timeRange} />
          </div>
          
          {/* Bottom Tabs */}
          <div className="border-t border-white/5 bg-[#0a0a0a]">
            <div className="flex items-center gap-1 px-3 py-2 overflow-x-auto hide-scrollbar">
              {DETAIL_TABS.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors ${
                    activeTab === tab.id
                      ? 'bg-cyan-500/20 text-cyan-400'
                      : 'text-white/50 hover:text-white hover:bg-white/5'
                  }`}
                  data-testid={`tab-${tab.id}`}
                >
                  {tab.label}
                  {tab.id === "holders" && <span className="ml-1 text-white/30">(4,349)</span>}
                </button>
              ))}
            </div>
            
            {/* Transaction Feed */}
            {activeTab === "transactions" && (
              <div className="max-h-[200px] sm:max-h-[250px] overflow-y-auto">
                <table className="w-full">
                  <thead className="sticky top-0 bg-[#0a0a0a] z-10">
                    <tr className="text-[10px] text-white/40 uppercase">
                      <th className="py-2 px-2 text-left font-medium">Date</th>
                      <th className="py-2 px-2 text-left font-medium">Type</th>
                      <th className="py-2 px-2 text-right font-medium">USD</th>
                      <th className="py-2 px-2 text-right font-medium hidden sm:table-cell">{token.symbol}</th>
                      <th className="py-2 px-2 text-right font-medium hidden md:table-cell">SOL</th>
                      <th className="py-2 px-2 text-right font-medium">Price</th>
                      <th className="py-2 px-2 text-right font-medium">Maker</th>
                      <th className="py-2 px-2 text-right font-medium hidden sm:table-cell">TXN</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.map(tx => (
                      <TransactionRow key={tx.id} tx={tx} />
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Right Side - Token Info Panel */}
        <aside className="w-full lg:w-80 border-t lg:border-t-0 lg:border-l border-white/5 bg-[#0a0a0a] overflow-y-auto">
          <div className="p-4 space-y-4">
            {/* Token Header */}
            <div className="flex items-center gap-3">
              {token.logo ? (
                <img src={token.logo} alt={token.symbol} className="w-12 h-12 rounded-full" />
              ) : (
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-500 to-purple-500 flex items-center justify-center text-lg font-bold text-white">
                  {token.symbol.slice(0, 2)}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-lg font-bold text-white truncate">{token.symbol}</span>
                  <span className="text-xs text-white/40">/ SOL</span>
                  <Badge className="bg-purple-500/20 text-purple-400 text-[10px]">
                    <Zap className="w-2.5 h-2.5 mr-0.5" />
                    200
                  </Badge>
                  {/* Creator Badge */}
                  {token.creatorBadge === "verified" && (
                    <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 text-[10px]">
                      <CheckCircle className="w-2.5 h-2.5 mr-0.5" />
                      Verified
                    </Badge>
                  )}
                  {token.creatorBadge === "trusted" && (
                    <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 text-[10px]">
                      <Award className="w-2.5 h-2.5 mr-0.5" />
                      Trusted
                    </Badge>
                  )}
                  {token.creatorBadge === "flagged" && (
                    <Badge className="bg-red-500/20 text-red-400 border-red-500/30 text-[10px]">
                      <AlertTriangle className="w-2.5 h-2.5 mr-0.5" />
                      Flagged
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-2 text-xs text-white/50">
                  <span>◎ Solana</span>
                  <span>via {token.dex}</span>
                  <span>🔗 Pump.fun</span>
                </div>
              </div>
            </div>
            
            {/* Social Links */}
            <div className="flex items-center gap-2">
              {token.socials.website && (
                <a href={token.socials.website} target="_blank" rel="noopener" className="p-2 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
                  <Globe className="w-4 h-4 text-white/60" />
                </a>
              )}
              {token.socials.twitter && (
                <a href={token.socials.twitter} target="_blank" rel="noopener" className="p-2 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
                  <Twitter className="w-4 h-4 text-white/60" />
                </a>
              )}
              <button className="p-2 bg-white/5 rounded-lg hover:bg-white/10 transition-colors text-xs text-white/60">
                TikTok
              </button>
            </div>
            
            {/* Price Display */}
            <div className="bg-white/5 rounded-xl p-4">
              <div className="text-xs text-white/40 mb-1">PRICE</div>
              <div className="text-2xl font-bold text-white mb-1">${formatPrice(token.price)}</div>
              <div className="text-xs text-white/50">{token.priceNative}</div>
            </div>
            
            {/* Key Metrics */}
            <div className="grid grid-cols-3 gap-2">
              <div className="bg-white/5 rounded-lg p-3 text-center">
                <div className="text-[10px] text-white/40 mb-1">LIQUIDITY</div>
                <div className="text-sm font-bold text-white">{formatNumber(token.liquidity)}</div>
              </div>
              <div className="bg-white/5 rounded-lg p-3 text-center">
                <div className="text-[10px] text-white/40 mb-1">FDV</div>
                <div className="text-sm font-bold text-white">{formatNumber(token.fdv)}</div>
              </div>
              <div className="bg-white/5 rounded-lg p-3 text-center">
                <div className="text-[10px] text-white/40 mb-1">MKT CAP</div>
                <div className="text-sm font-bold text-white">{formatNumber(token.marketCap)}</div>
              </div>
            </div>
            
            {/* Price Changes */}
            <div className="grid grid-cols-4 gap-2">
              {[
                { label: "5M", value: token.priceChange5m },
                { label: "1H", value: token.priceChange1h },
                { label: "6H", value: token.priceChange6h },
                { label: "24H", value: token.priceChange24h },
              ].map(item => (
                <div key={item.label} className="text-center">
                  <div className="text-[10px] text-white/40 mb-1">{item.label}</div>
                  <PriceChange value={item.value} />
                </div>
              ))}
            </div>
            
            {/* Transaction Stats */}
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-white/5 rounded-lg p-3">
                <div className="text-[10px] text-white/40 mb-2">TXNS</div>
                <div className="text-lg font-bold text-white">{formatCompact(token.txns24h)}</div>
                <div className="flex items-center gap-2 mt-1 text-xs">
                  <span className="text-emerald-400">{formatCompact(token.buys24h)}</span>
                  <span className="text-white/30">/</span>
                  <span className="text-red-400">{formatCompact(token.sells24h)}</span>
                </div>
              </div>
              <div className="bg-white/5 rounded-lg p-3">
                <div className="text-[10px] text-white/40 mb-2">VOLUME</div>
                <div className="text-lg font-bold text-white">{formatNumber(token.volume24h)}</div>
                <div className="flex items-center gap-2 mt-1 text-xs">
                  <span className="text-emerald-400">{formatNumber(token.buyVolume)}</span>
                  <span className="text-white/30">/</span>
                  <span className="text-red-400">{formatNumber(token.sellVolume)}</span>
                </div>
              </div>
            </div>
            
            {/* Makers Stats */}
            <div className="bg-white/5 rounded-lg p-3">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-[10px] text-white/40">MAKERS</div>
                  <div className="text-sm font-bold text-white">{formatCompact(token.makers)}</div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] text-white/40">BUYERS / SELLERS</div>
                  <div className="text-sm">
                    <span className="text-emerald-400 font-bold">{formatCompact(token.buyers)}</span>
                    <span className="text-white/30 mx-1">/</span>
                    <span className="text-red-400 font-bold">{formatCompact(token.sellers)}</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Guardian Score Panel */}
            <GuardianScorePanel token={token} />
            
            {/* ML Prediction Panel */}
            <MLPredictionPanel prediction={token.mlPrediction} />
            
            {/* Action Buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsWatchlisted(!isWatchlisted)}
                className={`flex-1 py-3 rounded-xl font-medium text-sm flex items-center justify-center gap-2 transition-colors ${
                  isWatchlisted
                    ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                    : 'bg-white/5 text-white/70 hover:bg-white/10'
                }`}
                data-testid="watchlist-btn"
              >
                <Star className={`w-4 h-4 ${isWatchlisted ? 'fill-yellow-400' : ''}`} />
                Watchlist
              </button>
              <button
                className="flex-1 py-3 rounded-xl font-medium text-sm flex items-center justify-center gap-2 bg-white/5 text-white/70 hover:bg-white/10 transition-colors"
                data-testid="alerts-btn"
              >
                <Bell className="w-4 h-4" />
                Alerts
              </button>
            </div>
            
            {/* Trade Button */}
            <button
              onClick={() => setShowSwapModal(true)}
              className="w-full py-3 rounded-xl font-bold text-sm bg-gradient-to-r from-cyan-500 to-purple-500 text-white hover:opacity-90 transition-opacity"
              data-testid="trade-btn"
            >
              Trade {token.symbol}
            </button>
            
            {/* Contract Address */}
            <div className="bg-white/5 rounded-lg p-3">
              <div className="text-[10px] text-white/40 mb-1">CONTRACT</div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-white/70 font-mono truncate flex-1">
                  {token.contractAddress.slice(0, 8)}...{token.contractAddress.slice(-6)}
                </span>
                <button onClick={copyAddress} className="p-1.5 hover:bg-white/10 rounded transition-colors">
                  {copied ? (
                    <Check className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <Copy className="w-4 h-4 text-white/40" />
                  )}
                </button>
                <a href={`https://solscan.io/token/${token.contractAddress}`} target="_blank" rel="noopener" className="p-1.5 hover:bg-white/10 rounded transition-colors">
                  <ExternalLink className="w-4 h-4 text-white/40" />
                </a>
              </div>
            </div>
          </div>
        </aside>
      </div>
      
      {/* Add hide-scrollbar styles */}
      <style>{`
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
    </GuardianSwapModal>
  );
}
