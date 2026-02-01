import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "wouter";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Search,
  Shield,
  TrendingUp,
  TrendingDown,
  Star,
  RefreshCw,
  Zap,
  ChevronDown,
  ChevronRight,
  Flame,
  Skull,
  CheckCircle,
  Lock,
  Copy,
  Check,
  Menu,
  X,
  Bell,
  LayoutGrid,
  Sparkles,
  ArrowUpRight,
  ArrowDownRight,
  Eye,
  BarChart3,
  Megaphone,
  Target,
  AlertTriangle,
  Ban,
  Activity,
  Users,
  Bot,
  Droplets,
  Brain,
  Crosshair,
  Clock,
  ExternalLink,
  Info,
  DollarSign
} from "lucide-react";
import { useGuardianWS } from "@/hooks/use-guardian-ws";
import { QuickTradePanel } from "@/components/quick-trade-panel";

const CHAINS = [
  { id: "all", name: "All Chains", short: "All", icon: "🌐", color: "from-white/20 to-white/10" },
  { id: "solana", name: "Solana", short: "SOL", icon: "◎", color: "from-purple-500 to-green-400" },
  { id: "ethereum", name: "Ethereum", short: "ETH", icon: "Ξ", color: "from-blue-500 to-purple-500" },
  { id: "base", name: "Base", short: "BASE", icon: "🔵", color: "from-blue-400 to-blue-600" },
  { id: "bsc", name: "BNB Chain", short: "BSC", icon: "🟡", color: "from-yellow-400 to-yellow-600" },
  { id: "arbitrum", name: "Arbitrum", short: "ARB", icon: "🔷", color: "from-blue-400 to-cyan-500" },
  { id: "polygon", name: "Polygon", short: "MATIC", icon: "🟣", color: "from-purple-500 to-purple-700" },
  { id: "darkwave", name: "DarkWave", short: "DW", icon: "◆", color: "from-cyan-400 to-purple-500" },
];

const TIME_FILTERS = [
  { id: "5m", label: "5M" },
  { id: "1h", label: "1H" },
  { id: "6h", label: "6H" },
  { id: "24h", label: "24H" },
];

const SORT_OPTIONS = [
  { id: "trending", label: "Trending 6H", icon: Flame },
  { id: "volume", label: "Volume", icon: BarChart3 },
  { id: "gainers", label: "Top Gainers", icon: TrendingUp },
  { id: "losers", label: "Top Losers", icon: TrendingDown },
  { id: "newest", label: "Newest", icon: Sparkles },
  { id: "score", label: "Guardian Score", icon: Shield },
  { id: "ai", label: "AI Confidence", icon: Brain },
  { id: "txns", label: "Transactions", icon: Activity },
  { id: "liquidity", label: "Liquidity", icon: Droplets },
  { id: "mcap", label: "Market Cap", icon: DollarSign },
  { id: "5m", label: "5M Change", icon: Clock },
  { id: "1h", label: "1H Change", icon: Clock },
  { id: "6h", label: "6H Change", icon: Clock },
];

// Category filters for different token types
const CATEGORY_FILTERS = [
  { id: "all", label: "All", icon: "🌐", color: "bg-white/10" },
  { id: "meme", label: "Meme", icon: "🐸", color: "bg-green-500/20" },
  { id: "defi", label: "DeFi", icon: "🏦", color: "bg-blue-500/20" },
  { id: "bluechip", label: "Blue Chip", icon: "💎", color: "bg-purple-500/20" },
  { id: "gaming", label: "Gaming", icon: "🎮", color: "bg-pink-500/20" },
  { id: "ai", label: "AI", icon: "🤖", color: "bg-cyan-500/20" },
  { id: "nft", label: "NFT", icon: "🖼️", color: "bg-orange-500/20" },
  { id: "stable", label: "Stable", icon: "💵", color: "bg-emerald-500/20" },
  { id: "rwa", label: "RWA", icon: "🏠", color: "bg-amber-500/20" },
];

interface SafetyData {
  honeypotRisk: boolean;
  mintAuthority: boolean;
  freezeAuthority: boolean;
  liquidityLocked: boolean;
  holderCount: number;
  whaleConcentration: number;
  botActivity: number;
  safetyScore: number;
  safetyGrade: string;
  risks: string[];
  warnings: string[];
}

interface MLPrediction {
  direction: 'up' | 'down' | 'neutral';
  confidence: number;
  accuracy: number;
  shortTerm: { direction: 'up' | 'down'; percent: number };
  longTerm: { direction: 'up' | 'down'; percent: number };
}

interface Token {
  id: string;
  rank: number;
  name: string;
  symbol: string;
  logo: string;
  contractAddress: string;
  pairAddress: string;
  chain: string;
  chainIcon: string;
  dex: string;
  dexShort: string;
  price: number;
  priceUsd: string;
  age: string;
  ageMinutes: number;
  txns: number;
  buys: number;
  sells: number;
  volume24h: number;
  makers: number;
  priceChange5m: number;
  priceChange1h: number;
  priceChange6h: number;
  priceChange24h: number;
  liquidity: number;
  marketCap: number;
  guardianScore: number;
  boosts: number;
  isWatchlisted: boolean;
  aiRecommendation: 'snipe' | 'watch' | 'avoid';
  aiScore: number;
  mlPrediction: MLPrediction;
  safety: SafetyData;
  twitter?: string;
  telegram?: string;
  websites?: string[];
  category: string;
}

function generateMockTokens(chain: string): Token[] {
  // Extended token data with categories for 100 tokens
  const tokenData: Array<{ symbol: string; name: string; boosts: number; category: string }> = [
    // Meme coins (30)
    { symbol: "DOG", name: "Nietzschean Dog", boosts: 2000, category: "meme" },
    { symbol: "CAT", name: "Nietzschean Cat", boosts: 1800, category: "meme" },
    { symbol: "PENGUIN", name: "Nietzschean Penguin", boosts: 1200, category: "meme" },
    { symbol: "WOJAK", name: "Wojak", boosts: 400, category: "meme" },
    { symbol: "PEPE2", name: "Pepe 2.0", boosts: 900, category: "meme" },
    { symbol: "MEME", name: "Memecoin", boosts: 600, category: "meme" },
    { symbol: "SHIB2", name: "Shiba 2.0", boosts: 350, category: "meme" },
    { symbol: "DOGE2", name: "Doge 2.0", boosts: 750, category: "meme" },
    { symbol: "BONK2", name: "Bonk 2.0", boosts: 200, category: "meme" },
    { symbol: "FLOKI2", name: "Floki 2.0", boosts: 150, category: "meme" },
    { symbol: "WIF", name: "Dogwifhat", boosts: 2500, category: "meme" },
    { symbol: "BRETT", name: "Brett", boosts: 1600, category: "meme" },
    { symbol: "POPCAT", name: "Popcat", boosts: 1400, category: "meme" },
    { symbol: "MOG", name: "Mog Coin", boosts: 800, category: "meme" },
    { symbol: "GIGACHAD", name: "Gigachad", boosts: 500, category: "meme" },
    { symbol: "PNUT", name: "Peanut", boosts: 1100, category: "meme" },
    { symbol: "NEIRO", name: "Neiro", boosts: 950, category: "meme" },
    { symbol: "MOTHER", name: "Mother", boosts: 700, category: "meme" },
    { symbol: "GIGA", name: "Giga Token", boosts: 450, category: "meme" },
    { symbol: "FWOG", name: "Frog", boosts: 300, category: "meme" },
    { symbol: "HOPPY", name: "Hoppy", boosts: 250, category: "meme" },
    { symbol: "DUKO", name: "Duko", boosts: 180, category: "meme" },
    { symbol: "SLERF", name: "Slerf", boosts: 120, category: "meme" },
    { symbol: "MYRO", name: "Myro", boosts: 90, category: "meme" },
    { symbol: "BOME", name: "Book of Meme", boosts: 1900, category: "meme" },
    { symbol: "PONKE", name: "Ponke", boosts: 650, category: "meme" },
    { symbol: "MEW", name: "Cat in a Dog World", boosts: 550, category: "meme" },
    { symbol: "TOSHI", name: "Toshi", boosts: 480, category: "meme" },
    { symbol: "DEGEN", name: "Degen", boosts: 1050, category: "meme" },
    { symbol: "MOCHI", name: "Mochi", boosts: 280, category: "meme" },
    // DeFi tokens (20)
    { symbol: "JUP", name: "Jupiter", boosts: 3000, category: "defi" },
    { symbol: "RAY", name: "Raydium", boosts: 2200, category: "defi" },
    { symbol: "ORCA", name: "Orca", boosts: 1800, category: "defi" },
    { symbol: "AAVE", name: "Aave", boosts: 2800, category: "defi" },
    { symbol: "UNI", name: "Uniswap", boosts: 2600, category: "defi" },
    { symbol: "SUSHI", name: "SushiSwap", boosts: 1200, category: "defi" },
    { symbol: "CRV", name: "Curve DAO", boosts: 1600, category: "defi" },
    { symbol: "1INCH", name: "1inch", boosts: 1400, category: "defi" },
    { symbol: "COMP", name: "Compound", boosts: 1100, category: "defi" },
    { symbol: "MKR", name: "Maker", boosts: 2400, category: "defi" },
    { symbol: "LDO", name: "Lido DAO", boosts: 2000, category: "defi" },
    { symbol: "RPL", name: "Rocket Pool", boosts: 900, category: "defi" },
    { symbol: "SNX", name: "Synthetix", boosts: 750, category: "defi" },
    { symbol: "BAL", name: "Balancer", boosts: 600, category: "defi" },
    { symbol: "YFI", name: "Yearn", boosts: 1500, category: "defi" },
    { symbol: "SPELL", name: "Spell Token", boosts: 400, category: "defi" },
    { symbol: "DRIFT", name: "Drift", boosts: 850, category: "defi" },
    { symbol: "KMNO", name: "Kamino", boosts: 700, category: "defi" },
    { symbol: "MNGO", name: "Mango", boosts: 350, category: "defi" },
    { symbol: "TULIP", name: "Tulip", boosts: 200, category: "defi" },
    // Blue Chips (10)
    { symbol: "SOL", name: "Solana", boosts: 5000, category: "bluechip" },
    { symbol: "ETH", name: "Ethereum", boosts: 5000, category: "bluechip" },
    { symbol: "BNB", name: "BNB", boosts: 4500, category: "bluechip" },
    { symbol: "ARB", name: "Arbitrum", boosts: 3500, category: "bluechip" },
    { symbol: "OP", name: "Optimism", boosts: 3200, category: "bluechip" },
    { symbol: "AVAX", name: "Avalanche", boosts: 3000, category: "bluechip" },
    { symbol: "MATIC", name: "Polygon", boosts: 2800, category: "bluechip" },
    { symbol: "LINK", name: "Chainlink", boosts: 3800, category: "bluechip" },
    { symbol: "DOT", name: "Polkadot", boosts: 2500, category: "bluechip" },
    { symbol: "ATOM", name: "Cosmos", boosts: 2200, category: "bluechip" },
    // Gaming (15)
    { symbol: "IMX", name: "Immutable X", boosts: 2000, category: "gaming" },
    { symbol: "GALA", name: "Gala Games", boosts: 1500, category: "gaming" },
    { symbol: "AXS", name: "Axie Infinity", boosts: 1800, category: "gaming" },
    { symbol: "SAND", name: "Sandbox", boosts: 1600, category: "gaming" },
    { symbol: "MANA", name: "Decentraland", boosts: 1400, category: "gaming" },
    { symbol: "ENJ", name: "Enjin Coin", boosts: 900, category: "gaming" },
    { symbol: "ILV", name: "Illuvium", boosts: 1200, category: "gaming" },
    { symbol: "MAGIC", name: "Magic", boosts: 800, category: "gaming" },
    { symbol: "APE", name: "ApeCoin", boosts: 2200, category: "gaming" },
    { symbol: "PRIME", name: "Echelon Prime", boosts: 1100, category: "gaming" },
    { symbol: "BEAM", name: "Beam", boosts: 700, category: "gaming" },
    { symbol: "PIXEL", name: "Pixels", boosts: 600, category: "gaming" },
    { symbol: "PORTAL", name: "Portal", boosts: 500, category: "gaming" },
    { symbol: "SUPER", name: "SuperVerse", boosts: 400, category: "gaming" },
    { symbol: "GODS", name: "Gods Unchained", boosts: 300, category: "gaming" },
    // AI tokens (15)
    { symbol: "RENDER", name: "Render", boosts: 3500, category: "ai" },
    { symbol: "FET", name: "Fetch.ai", boosts: 3000, category: "ai" },
    { symbol: "AGIX", name: "SingularityNET", boosts: 2500, category: "ai" },
    { symbol: "OCEAN", name: "Ocean Protocol", boosts: 1800, category: "ai" },
    { symbol: "TAO", name: "Bittensor", boosts: 4000, category: "ai" },
    { symbol: "RNDR", name: "Render Token", boosts: 2800, category: "ai" },
    { symbol: "HODLAI", name: "HODL AI", boosts: 800, category: "ai" },
    { symbol: "AKT", name: "Akash Network", boosts: 1200, category: "ai" },
    { symbol: "AIOZ", name: "AIOZ Network", boosts: 900, category: "ai" },
    { symbol: "NMR", name: "Numeraire", boosts: 700, category: "ai" },
    { symbol: "ARKM", name: "Arkham", boosts: 1500, category: "ai" },
    { symbol: "OLAS", name: "Olas", boosts: 600, category: "ai" },
    { symbol: "VANA", name: "Vana", boosts: 500, category: "ai" },
    { symbol: "IO", name: "IO.net", boosts: 1100, category: "ai" },
    { symbol: "GRASS", name: "Grass", boosts: 850, category: "ai" },
    // NFT tokens (5)
    { symbol: "BLUR", name: "Blur", boosts: 2000, category: "nft" },
    { symbol: "LOOKS", name: "LooksRare", boosts: 800, category: "nft" },
    { symbol: "X2Y2", name: "X2Y2", boosts: 400, category: "nft" },
    { symbol: "RARE", name: "SuperRare", boosts: 600, category: "nft" },
    { symbol: "BIRB", name: "Moonbirds", boosts: 500, category: "nft" },
    // Stables (3)
    { symbol: "USDC", name: "USD Coin", boosts: 0, category: "stable" },
    { symbol: "USDT", name: "Tether", boosts: 0, category: "stable" },
    { symbol: "DAI", name: "Dai", boosts: 0, category: "stable" },
    // RWA (2)
    { symbol: "ONDO", name: "Ondo Finance", boosts: 2500, category: "rwa" },
    { symbol: "MKR", name: "Maker", boosts: 2000, category: "rwa" },
  ];

  const chains = chain === "all" ? ["solana", "ethereum", "base", "bsc"] : [chain];
  const chainIcons: Record<string, string> = {
    solana: "◎", ethereum: "Ξ", base: "🔵", bsc: "🟡",
    arbitrum: "🔷", polygon: "🟣", avalanche: "🔺", darkwave: "◆"
  };
  
  const dexByChain: Record<string, { name: string; short: string }[]> = {
    solana: [{ name: "Raydium", short: "Ray" }, { name: "Pump.fun", short: "Pump" }, { name: "Orca", short: "Orca" }],
    ethereum: [{ name: "Uniswap", short: "Uni" }, { name: "SushiSwap", short: "Sushi" }],
    base: [{ name: "BaseSwap", short: "Base" }, { name: "Aerodrome", short: "Aero" }],
    bsc: [{ name: "PancakeSwap", short: "Cake" }],
    darkwave: [{ name: "DarkSwap", short: "DSwap" }]
  };
  
  const colors = ["22d3ee", "a855f7", "ec4899", "f59e0b", "10b981", "3b82f6", "ef4444", "8b5cf6"];

  return tokenData.map((td, i) => {
    const tokenChain = chains[Math.floor(Math.random() * chains.length)];
    const safetyScore = Math.floor(Math.random() * 100);
    const aiScore = Math.floor(Math.random() * 100);
    
    const price = Math.random() * (Math.random() > 0.5 ? 0.1 : 0.00001);
    const isNew = Math.random() > 0.4;
    const color = colors[i % colors.length];
    const chainDexes = dexByChain[tokenChain] || [{ name: "DEX", short: "DEX" }];
    const dex = chainDexes[Math.floor(Math.random() * chainDexes.length)];
    const txns = Math.floor(Math.random() * 200000) + 5000;
    const buyRatio = 0.4 + Math.random() * 0.2;
    
    const aiRecommendation: 'snipe' | 'watch' | 'avoid' = 
      aiScore >= 75 ? 'snipe' : aiScore >= 40 ? 'watch' : 'avoid';
    
    const mlDirection = Math.random() > 0.5 ? 'up' : Math.random() > 0.3 ? 'down' : 'neutral';
    
    return {
      id: `${tokenChain}-${td.symbol.toLowerCase()}-${i}`,
      rank: i + 1,
      name: td.name,
      symbol: td.symbol,
      logo: `https://api.dicebear.com/7.x/shapes/svg?seed=${td.symbol}&backgroundColor=${color}`,
      contractAddress: `0x${Array.from({length: 40}, () => '0123456789abcdef'[Math.floor(Math.random() * 16)]).join('')}`,
      pairAddress: `0x${Array.from({length: 40}, () => '0123456789abcdef'[Math.floor(Math.random() * 16)]).join('')}`,
      chain: tokenChain,
      chainIcon: chainIcons[tokenChain] || "◎",
      dex: dex.name,
      dexShort: dex.short,
      price,
      priceUsd: formatPrice(price),
      age: isNew ? `${Math.floor(Math.random() * 23) + 1}h` : `${Math.floor(Math.random() * 14) + 1}d`,
      ageMinutes: isNew ? Math.floor(Math.random() * 1440) : Math.floor(Math.random() * 20160),
      txns,
      buys: Math.floor(txns * buyRatio),
      sells: Math.floor(txns * (1 - buyRatio)),
      volume24h: Math.random() * 30000000 + 500000,
      makers: Math.floor(Math.random() * 70000) + 1000,
      priceChange5m: (Math.random() - 0.5) * 15,
      priceChange1h: (Math.random() - 0.5) * 50,
      priceChange6h: (Math.random() - 0.5) * 150,
      priceChange24h: (Math.random() - 0.5) * 300,
      liquidity: Math.random() * 3000000 + 30000,
      marketCap: Math.random() * 50000000 + 100000,
      guardianScore: safetyScore,
      boosts: td.boosts,
      isWatchlisted: Math.random() > 0.85,
      aiRecommendation,
      aiScore,
      mlPrediction: {
        direction: mlDirection as 'up' | 'down' | 'neutral',
        confidence: Math.floor(Math.random() * 40) + 60,
        accuracy: Math.floor(Math.random() * 30) + 65,
        shortTerm: { direction: Math.random() > 0.5 ? 'up' : 'down', percent: Math.random() * 50 + 5 },
        longTerm: { direction: Math.random() > 0.4 ? 'up' : 'down', percent: Math.random() * 100 + 10 },
      },
      safety: {
        honeypotRisk: Math.random() > 0.9,
        mintAuthority: Math.random() > 0.6,
        freezeAuthority: Math.random() > 0.7,
        liquidityLocked: Math.random() > 0.4,
        holderCount: Math.floor(Math.random() * 50000) + 100,
        whaleConcentration: Math.random() * 60 + 5,
        botActivity: Math.random() * 40,
        safetyScore,
        safetyGrade: safetyScore >= 80 ? 'A' : safetyScore >= 60 ? 'B' : safetyScore >= 40 ? 'C' : safetyScore >= 20 ? 'D' : 'F',
        risks: safetyScore < 50 ? ['High whale concentration', 'Low liquidity'] : [],
        warnings: safetyScore < 70 ? ['Mint authority enabled'] : [],
      },
      category: td.category,
      twitter: Math.random() > 0.5 ? 'https://twitter.com/token' : undefined,
      telegram: Math.random() > 0.5 ? 'https://t.me/token' : undefined,
    };
  });
}

function formatPrice(price: number): string {
  if (price < 0.000001) return `$0.0₆${(price * 1000000).toFixed(0)}`;
  if (price < 0.0001) return `$0.0₄${(price * 10000).toFixed(2)}`;
  if (price < 0.001) return `$${price.toFixed(6)}`;
  if (price < 0.01) return `$${price.toFixed(5)}`;
  if (price < 1) return `$${price.toFixed(4)}`;
  return `$${price.toFixed(2)}`;
}

function formatNumber(num: number): string {
  if (num >= 1e9) return `${(num / 1e9).toFixed(2)}B`;
  if (num >= 1e6) return `${(num / 1e6).toFixed(2)}M`;
  if (num >= 1e3) return `${(num / 1e3).toFixed(1)}K`;
  return num.toFixed(0);
}

function formatCompact(num: number): string {
  if (num >= 1e6) return `${(num / 1e6).toFixed(1)}M`;
  if (num >= 1e3) return `${(num / 1e3).toFixed(0)}K`;
  return num.toLocaleString();
}

function PriceChange({ value, className = "" }: { value: number; className?: string }) {
  const isPositive = value >= 0;
  return (
    <span className={`tabular-nums font-medium ${isPositive ? 'text-emerald-400' : 'text-red-400'} ${className}`}>
      {value.toFixed(2)}%
    </span>
  );
}

function AIRecommendationBadge({ recommendation, score }: { recommendation: 'snipe' | 'watch' | 'avoid'; score: number }) {
  const config = {
    snipe: { bg: 'bg-emerald-500/20', border: 'border-emerald-500/40', text: 'text-emerald-400', icon: Crosshair, label: 'SNIPE' },
    watch: { bg: 'bg-yellow-500/20', border: 'border-yellow-500/40', text: 'text-yellow-400', icon: Eye, label: 'WATCH' },
    avoid: { bg: 'bg-red-500/20', border: 'border-red-500/40', text: 'text-red-400', icon: Ban, label: 'AVOID' },
  }[recommendation];
  
  const Icon = config.icon;
  
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <div className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded border ${config.bg} ${config.border} ${config.text}`}>
            <Icon className="w-3 h-3" />
            <span className="text-[10px] font-bold">{config.label}</span>
          </div>
        </TooltipTrigger>
        <TooltipContent className="bg-slate-900 border-white/10">
          <div className="text-xs">
            <div className="font-medium mb-1">Strike Agent AI</div>
            <div className="text-white/60">Confidence: {score}%</div>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

function MLPredictionBadge({ prediction }: { prediction: MLPrediction }) {
  const directionConfig = {
    up: { icon: TrendingUp, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
    down: { icon: TrendingDown, color: 'text-red-400', bg: 'bg-red-500/10' },
    neutral: { icon: Activity, color: 'text-white/50', bg: 'bg-white/5' },
  }[prediction.direction];
  
  const Icon = directionConfig.icon;
  
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <div className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded ${directionConfig.bg}`}>
            <Brain className="w-3 h-3 text-purple-400" />
            <Icon className={`w-3 h-3 ${directionConfig.color}`} />
            <span className={`text-[10px] font-medium ${directionConfig.color}`}>{prediction.confidence}%</span>
          </div>
        </TooltipTrigger>
        <TooltipContent className="bg-slate-900 border-white/10">
          <div className="text-xs space-y-1">
            <div className="font-medium text-purple-400 flex items-center gap-1">
              <Brain className="w-3 h-3" /> ML Prediction
            </div>
            <div className="text-white/60">Direction: <span className={directionConfig.color}>{prediction.direction.toUpperCase()}</span></div>
            <div className="text-white/60">Confidence: {prediction.confidence}%</div>
            <div className="text-white/60">Model Accuracy: {prediction.accuracy}%</div>
            <div className="border-t border-white/10 pt-1 mt-1">
              <div className="text-white/60">Short-term: <span className={prediction.shortTerm.direction === 'up' ? 'text-emerald-400' : 'text-red-400'}>{prediction.shortTerm.direction === 'up' ? '+' : '-'}{prediction.shortTerm.percent.toFixed(1)}%</span></div>
              <div className="text-white/60">Long-term: <span className={prediction.longTerm.direction === 'up' ? 'text-emerald-400' : 'text-red-400'}>{prediction.longTerm.direction === 'up' ? '+' : '-'}{prediction.longTerm.percent.toFixed(1)}%</span></div>
            </div>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

function GuardianScoreBadge({ score, grade }: { score: number; grade?: string }) {
  let color = "bg-red-500/20 text-red-400 border-red-500/30";
  if (score >= 80) color = "bg-emerald-500/20 text-emerald-400 border-emerald-500/30";
  else if (score >= 60) color = "bg-cyan-500/20 text-cyan-400 border-cyan-500/30";
  else if (score >= 40) color = "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
  else if (score >= 20) color = "bg-orange-500/20 text-orange-400 border-orange-500/30";
  
  return (
    <div className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded border text-[10px] font-bold ${color}`}>
      <Shield className="w-2.5 h-2.5" />
      {score}
      {grade && <span className="ml-0.5 opacity-70">({grade})</span>}
    </div>
  );
}

function SafetyIndicators({ safety }: { safety: SafetyData }) {
  return (
    <div className="flex items-center gap-1">
      {safety.honeypotRisk && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <Skull className="w-3.5 h-3.5 text-red-400" />
            </TooltipTrigger>
            <TooltipContent className="bg-slate-900 border-white/10">
              <span className="text-xs text-red-400">Honeypot Risk Detected</span>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
      {safety.liquidityLocked && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <Lock className="w-3 h-3 text-emerald-400" />
            </TooltipTrigger>
            <TooltipContent className="bg-slate-900 border-white/10">
              <span className="text-xs text-emerald-400">Liquidity Locked</span>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
      {safety.mintAuthority && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <AlertTriangle className="w-3 h-3 text-yellow-400" />
            </TooltipTrigger>
            <TooltipContent className="bg-slate-900 border-white/10">
              <span className="text-xs text-yellow-400">Mint Authority Enabled</span>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
      {safety.whaleConcentration > 40 && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <Users className="w-3 h-3 text-orange-400" />
            </TooltipTrigger>
            <TooltipContent className="bg-slate-900 border-white/10">
              <span className="text-xs text-orange-400">High Whale Concentration: {safety.whaleConcentration.toFixed(1)}%</span>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
    </div>
  );
}

function BoostBadge({ count }: { count: number }) {
  if (count === 0) return null;
  return (
    <span className="inline-flex items-center gap-0.5 text-[10px] text-yellow-400 font-medium">
      <Zap className="w-3 h-3 fill-yellow-400" />
      {formatCompact(count)}
    </span>
  );
}

function ExpandedTokenDetails({ token }: { token: Token }) {
  return (
    <motion.tr
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
    >
      <td colSpan={14} className="bg-slate-900/50 border-b border-white/5">
        <div className="p-4 grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Safety Analysis */}
          <div className="bg-slate-800/50 rounded-lg p-3 border border-white/5">
            <div className="flex items-center gap-2 mb-3">
              <Shield className="w-4 h-4 text-cyan-400" />
              <span className="text-xs font-semibold text-white">Safety Analysis</span>
              <GuardianScoreBadge score={token.safety.safetyScore} grade={token.safety.safetyGrade} />
            </div>
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-white/50">Honeypot Risk</span>
                <span className={token.safety.honeypotRisk ? 'text-red-400' : 'text-emerald-400'}>
                  {token.safety.honeypotRisk ? 'DETECTED' : 'Safe'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-white/50">Mint Authority</span>
                <span className={token.safety.mintAuthority ? 'text-yellow-400' : 'text-emerald-400'}>
                  {token.safety.mintAuthority ? 'Enabled' : 'Disabled'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-white/50">Freeze Authority</span>
                <span className={token.safety.freezeAuthority ? 'text-yellow-400' : 'text-emerald-400'}>
                  {token.safety.freezeAuthority ? 'Enabled' : 'Disabled'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-white/50">Liquidity</span>
                <span className={token.safety.liquidityLocked ? 'text-emerald-400' : 'text-orange-400'}>
                  {token.safety.liquidityLocked ? 'Locked' : 'Unlocked'}
                </span>
              </div>
            </div>
          </div>
          
          {/* Holder Analysis */}
          <div className="bg-slate-800/50 rounded-lg p-3 border border-white/5">
            <div className="flex items-center gap-2 mb-3">
              <Users className="w-4 h-4 text-purple-400" />
              <span className="text-xs font-semibold text-white">Holder Analysis</span>
            </div>
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-white/50">Total Holders</span>
                <span className="text-white">{formatCompact(token.safety.holderCount)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-white/50">Whale Concentration</span>
                <span className={token.safety.whaleConcentration > 50 ? 'text-red-400' : token.safety.whaleConcentration > 30 ? 'text-yellow-400' : 'text-emerald-400'}>
                  {token.safety.whaleConcentration.toFixed(1)}%
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-white/50">Bot Activity</span>
                <span className={token.safety.botActivity > 30 ? 'text-red-400' : token.safety.botActivity > 15 ? 'text-yellow-400' : 'text-emerald-400'}>
                  {token.safety.botActivity.toFixed(1)}%
                </span>
              </div>
              <div className="mt-2">
                <div className="text-white/40 text-[10px] mb-1">Whale Distribution</div>
                <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-purple-500 to-pink-500" 
                    style={{ width: `${Math.min(token.safety.whaleConcentration, 100)}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
          
          {/* AI Predictions */}
          <div className="bg-slate-800/50 rounded-lg p-3 border border-white/5">
            <div className="flex items-center gap-2 mb-3">
              <Brain className="w-4 h-4 text-cyan-400" />
              <span className="text-xs font-semibold text-white">AI Predictions</span>
              <AIRecommendationBadge recommendation={token.aiRecommendation} score={token.aiScore} />
            </div>
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-white/50">ML Direction</span>
                <span className={token.mlPrediction.direction === 'up' ? 'text-emerald-400' : token.mlPrediction.direction === 'down' ? 'text-red-400' : 'text-white/50'}>
                  {token.mlPrediction.direction.toUpperCase()}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-white/50">Confidence</span>
                <span className="text-cyan-400">{token.mlPrediction.confidence}%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-white/50">Model Accuracy</span>
                <span className="text-purple-400">{token.mlPrediction.accuracy}%</span>
              </div>
              <div className="border-t border-white/10 pt-2 mt-2 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-white/40">Short-term</span>
                  <span className={token.mlPrediction.shortTerm.direction === 'up' ? 'text-emerald-400' : 'text-red-400'}>
                    {token.mlPrediction.shortTerm.direction === 'up' ? '+' : '-'}{token.mlPrediction.shortTerm.percent.toFixed(1)}%
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white/40">Long-term</span>
                  <span className={token.mlPrediction.longTerm.direction === 'up' ? 'text-emerald-400' : 'text-red-400'}>
                    {token.mlPrediction.longTerm.direction === 'up' ? '+' : '-'}{token.mlPrediction.longTerm.percent.toFixed(1)}%
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Token Info */}
          <div className="bg-slate-800/50 rounded-lg p-3 border border-white/5">
            <div className="flex items-center gap-2 mb-3">
              <Info className="w-4 h-4 text-white/50" />
              <span className="text-xs font-semibold text-white">Token Info</span>
            </div>
            <div className="space-y-2 text-xs">
              <div>
                <span className="text-white/40">Contract</span>
                <div className="text-white/70 font-mono text-[10px] truncate">{token.contractAddress}</div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-white/50">Market Cap</span>
                <span className="text-white">${formatNumber(token.marketCap)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-white/50">Liquidity</span>
                <span className="text-white">${formatNumber(token.liquidity)}</span>
              </div>
              <div className="flex items-center gap-2 mt-2">
                <Link href={`/guardian-scanner/${token.chain}/${token.symbol.toLowerCase()}`}>
                  <button className="flex items-center gap-1 px-2 py-1 bg-cyan-500/20 text-cyan-400 rounded text-[10px] hover:bg-cyan-500/30">
                    <ExternalLink className="w-3 h-3" />
                    Full Analysis
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
        
        {/* Risks & Warnings */}
        {(token.safety.risks.length > 0 || token.safety.warnings.length > 0) && (
          <div className="px-4 pb-4">
            <div className="flex flex-wrap gap-2">
              {token.safety.risks.map((risk, i) => (
                <div key={i} className="flex items-center gap-1 px-2 py-1 bg-red-500/10 border border-red-500/20 rounded text-[10px] text-red-400">
                  <AlertTriangle className="w-3 h-3" />
                  {risk}
                </div>
              ))}
              {token.safety.warnings.map((warning, i) => (
                <div key={i} className="flex items-center gap-1 px-2 py-1 bg-yellow-500/10 border border-yellow-500/20 rounded text-[10px] text-yellow-400">
                  <AlertTriangle className="w-3 h-3" />
                  {warning}
                </div>
              ))}
            </div>
          </div>
        )}
      </td>
    </motion.tr>
  );
}

function TokenRow({ token, isExpanded, onToggleExpand, onToggleWatchlist, onTrade }: { 
  token: Token; 
  isExpanded: boolean;
  onToggleExpand: () => void;
  onToggleWatchlist: (id: string) => void;
  onTrade: (token: Token) => void;
}) {
  const [copied, setCopied] = useState(false);
  const copyAddress = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigator.clipboard.writeText(token.contractAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  
  return (
    <>
      <tr 
        className={`border-b border-white/5 hover:bg-white/[0.03] transition-colors group cursor-pointer ${isExpanded ? 'bg-white/[0.02]' : ''}`} 
        onClick={onToggleExpand}
        data-testid={`token-row-${token.id}`}
      >
        {/* Expand Arrow */}
        <td className="pl-2 pr-1 py-3 md:py-2 w-6">
          <ChevronRight className={`w-3.5 h-3.5 text-white/30 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
        </td>
        
        {/* Rank */}
        <td className="pr-2 py-2 text-xs text-white/40 w-8 text-center">{token.rank}</td>
        
        {/* Token Info */}
        <td className="py-2 pr-3 min-w-[180px]">
          <Link href={`/guardian-scanner/${token.chain}/${token.symbol.toLowerCase()}`} onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center gap-2">
              <div className="relative flex-shrink-0">
                <img src={token.logo} alt="" className="w-7 h-7 rounded-full bg-white/10" />
                <span className="absolute -bottom-0.5 -right-0.5 text-[8px] bg-slate-900 rounded px-0.5">{token.chainIcon}</span>
              </div>
              <div className="flex flex-col min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-semibold text-white group-hover:text-cyan-400 transition-colors">{token.symbol}</span>
                  <span className="text-[10px] text-white/30">/{token.dexShort}</span>
                  <BoostBadge count={token.boosts} />
                </div>
                <div className="flex items-center gap-1">
                  <SafetyIndicators safety={token.safety} />
                </div>
              </div>
            </div>
          </Link>
        </td>
        
        {/* AI Recommendation */}
        <td className="py-2 pr-3" onClick={(e) => e.stopPropagation()}>
          <AIRecommendationBadge recommendation={token.aiRecommendation} score={token.aiScore} />
        </td>
        
        {/* ML Prediction */}
        <td className="py-2 pr-3 hidden xl:table-cell" onClick={(e) => e.stopPropagation()}>
          <MLPredictionBadge prediction={token.mlPrediction} />
        </td>
        
        {/* Price */}
        <td className="py-2 pr-4 text-right">
          <span className="text-xs font-medium text-white tabular-nums">{token.priceUsd}</span>
        </td>
        
        {/* Age */}
        <td className="py-2 pr-4 text-right hidden lg:table-cell">
          <span className="text-xs text-white/50">{token.age}</span>
        </td>
        
        {/* Txns */}
        <td className="py-2 pr-4 text-right hidden lg:table-cell">
          <span className="text-xs text-white/60 tabular-nums">{formatCompact(token.txns)}</span>
        </td>
        
        {/* Volume */}
        <td className="py-2 pr-4 text-right">
          <span className="text-xs text-white/70 tabular-nums">${formatNumber(token.volume24h)}</span>
        </td>
        
        {/* 5M Change */}
        <td className="py-2 pr-4 text-right hidden xl:table-cell">
          <PriceChange value={token.priceChange5m} className="text-xs" />
        </td>
        
        {/* 1H Change */}
        <td className="py-2 pr-4 text-right">
          <PriceChange value={token.priceChange1h} className="text-xs" />
        </td>
        
        {/* 6H Change */}
        <td className="py-2 pr-4 text-right hidden lg:table-cell">
          <PriceChange value={token.priceChange6h} className="text-xs" />
        </td>
        
        {/* Liquidity */}
        <td className="py-2 pr-4 text-right hidden xl:table-cell">
          <span className="text-xs text-white/60 tabular-nums">${formatNumber(token.liquidity)}</span>
        </td>
        
        {/* Guardian Score */}
        <td className="py-2 pr-3" onClick={(e) => e.stopPropagation()}>
          <GuardianScoreBadge score={token.guardianScore} grade={token.safety.safetyGrade} />
        </td>
        
        {/* Actions */}
        <td className="py-2 pr-3" onClick={(e) => e.stopPropagation()}>
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button 
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); onTrade(token); }} 
              className="px-2 py-1 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 rounded text-[10px] font-medium"
              data-testid={`trade-${token.id}`}
            >
              Trade
            </button>
            <button 
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); onToggleWatchlist(token.id); }} 
              className="p-1 hover:bg-white/10 rounded"
              data-testid={`watchlist-${token.id}`}
            >
              <Star className={`w-3.5 h-3.5 ${token.isWatchlisted ? 'fill-yellow-400 text-yellow-400' : 'text-white/30'}`} />
            </button>
            <button onClick={copyAddress} className="p-1 hover:bg-white/10 rounded" data-testid={`copy-${token.id}`}>
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-white/30" />}
            </button>
          </div>
        </td>
      </tr>
      
      <AnimatePresence>
        {isExpanded && <ExpandedTokenDetails token={token} />}
      </AnimatePresence>
    </>
  );
}

function LeftSidebar({ 
  watchlistedTokens, 
  onSelectToken,
  stats
}: { 
  watchlistedTokens: Token[]; 
  onSelectToken: (token: Token) => void;
  stats: { snipeCount: number; watchCount: number; avoidCount: number };
}) {
  return (
    <div className="w-52 bg-[#0d0d0d] border-r border-white/5 flex-shrink-0 hidden lg:flex flex-col">
      {/* Logo */}
      <div className="p-3 border-b border-white/5">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-purple-500 flex items-center justify-center">
            <Shield className="w-4 h-4 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-white text-sm">GUARDIAN</span>
            <span className="text-[9px] text-white/40">SCANNER PRO</span>
          </div>
        </Link>
      </div>
      
      {/* AI Stats */}
      <div className="p-3 border-b border-white/5">
        <div className="text-[10px] text-white/40 uppercase tracking-wide mb-2">Strike Agent Summary</div>
        <div className="grid grid-cols-3 gap-1 text-center">
          <div className="bg-emerald-500/10 rounded p-1.5">
            <div className="text-emerald-400 font-bold text-sm">{stats.snipeCount}</div>
            <div className="text-[9px] text-emerald-400/70">SNIPE</div>
          </div>
          <div className="bg-yellow-500/10 rounded p-1.5">
            <div className="text-yellow-400 font-bold text-sm">{stats.watchCount}</div>
            <div className="text-[9px] text-yellow-400/70">WATCH</div>
          </div>
          <div className="bg-red-500/10 rounded p-1.5">
            <div className="text-red-400 font-bold text-sm">{stats.avoidCount}</div>
            <div className="text-[9px] text-red-400/70">AVOID</div>
          </div>
        </div>
      </div>
      
      {/* Search */}
      <div className="p-2 border-b border-white/5">
        <div className="relative">
          <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/30" />
          <Input
            type="text"
            placeholder="Search"
            className="h-8 pl-8 pr-2 text-xs bg-white/5 border-white/10 focus:border-cyan-500/50"
          />
        </div>
      </div>
      
      {/* Nav Items */}
      <nav className="flex-1 py-2 overflow-y-auto">
        <Link href="/guardian-scanner">
          <div className="flex items-center gap-2 px-3 py-2 text-white/80 hover:bg-white/5 hover:text-white cursor-pointer">
            <Star className="w-4 h-4" />
            <span className="text-xs font-medium">Watchlist</span>
            {watchlistedTokens.length > 0 && (
              <span className="ml-auto text-[10px] bg-white/10 px-1.5 rounded">{watchlistedTokens.length}</span>
            )}
          </div>
        </Link>
        <Link href="/strike-agent">
          <div className="flex items-center gap-2 px-3 py-2 text-cyan-400 hover:bg-cyan-500/10 cursor-pointer">
            <Crosshair className="w-4 h-4" />
            <span className="text-xs font-medium">Strike Agent</span>
            <span className="ml-auto text-[9px] bg-cyan-500/20 px-1.5 rounded text-cyan-400">AI</span>
          </div>
        </Link>
        <Link href="/guardian-scanner">
          <div className="flex items-center gap-2 px-3 py-2 text-white/80 hover:bg-white/5 hover:text-white cursor-pointer">
            <Bell className="w-4 h-4" />
            <span className="text-xs font-medium">Alerts</span>
          </div>
        </Link>
        <Link href="/guardian-scanner">
          <div className="flex items-center gap-2 px-3 py-2 text-white/80 hover:bg-white/5 hover:text-white cursor-pointer">
            <LayoutGrid className="w-4 h-4" />
            <span className="text-xs font-medium">Multicharts</span>
          </div>
        </Link>
        <div className="h-px bg-white/5 my-2" />
        <Link href="/guardian-scanner?filter=new">
          <div className="flex items-center gap-2 px-3 py-2 text-white/80 hover:bg-white/5 hover:text-white cursor-pointer">
            <Sparkles className="w-4 h-4" />
            <span className="text-xs font-medium">New Pairs</span>
          </div>
        </Link>
        <Link href="/guardian-scanner?filter=gainers">
          <div className="flex items-center gap-2 px-3 py-2 text-white/80 hover:bg-white/5 hover:text-white cursor-pointer">
            <TrendingUp className="w-4 h-4" />
            <span className="text-xs font-medium">Gainers & Losers</span>
          </div>
        </Link>
        <div className="h-px bg-white/5 my-2" />
        <Link href="/pulse">
          <div className="flex items-center gap-2 px-3 py-2 text-purple-400 hover:bg-purple-500/10 cursor-pointer">
            <Brain className="w-4 h-4" />
            <span className="text-xs font-medium">Pulse AI</span>
            <span className="ml-auto text-[9px] bg-purple-500/20 px-1.5 rounded text-purple-400">ML</span>
          </div>
        </Link>
        <Link href="/guardian-shield">
          <div className="flex items-center gap-2 px-3 py-2 text-white/80 hover:bg-white/5 hover:text-white cursor-pointer">
            <Shield className="w-4 h-4" />
            <span className="text-xs font-medium">Guardian Shield</span>
          </div>
        </Link>
        <Link href="/portfolio">
          <div className="flex items-center gap-2 px-3 py-2 text-white/80 hover:bg-white/5 hover:text-white cursor-pointer">
            <BarChart3 className="w-4 h-4" />
            <span className="text-xs font-medium">Portfolio</span>
          </div>
        </Link>
      </nav>
      
      {/* Watchlist Preview */}
      <div className="border-t border-white/5 p-2">
        <div className="flex items-center justify-between px-2 py-1">
          <span className="text-[10px] font-medium text-white/50 uppercase tracking-wide">Quick Watch</span>
        </div>
        <div className="max-h-32 overflow-y-auto">
          {watchlistedTokens.length === 0 ? (
            <div className="text-[10px] text-white/30 px-2 py-3 text-center">
              Star tokens to add here
            </div>
          ) : (
            watchlistedTokens.slice(0, 5).map(t => (
              <div 
                key={t.id} 
                className="flex items-center gap-1.5 py-1.5 px-2 hover:bg-white/5 rounded cursor-pointer"
                onClick={() => onSelectToken(t)}
              >
                <img src={t.logo} alt="" className="w-4 h-4 rounded-full" />
                <span className="text-[11px] text-white/70 flex-1">{t.symbol}</span>
                <PriceChange value={t.priceChange1h} className="text-[10px]" />
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default function GuardianScanner() {
  const [selectedChain, setSelectedChain] = useState("solana");
  const [activeTimeFilter, setActiveTimeFilter] = useState("24h");
  const [rankBy, setRankBy] = useState("trending");
  const [searchQuery, setSearchQuery] = useState("");
  const [tokens, setTokens] = useState<Token[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showChainDropdown, setShowChainDropdown] = useState(false);
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [activeFilter, setActiveFilter] = useState("trending");
  const [expandedTokenId, setExpandedTokenId] = useState<string | null>(null);
  
  // Category filter state
  const [selectedCategory, setSelectedCategory] = useState("all");
  
  // Contract address search state
  const [contractSearch, setContractSearch] = useState("");
  const [isSearchingContract, setIsSearchingContract] = useState(false);
  const [contractSearchError, setContractSearchError] = useState<string | null>(null);
  
  // Trading state
  const [tradingToken, setTradingToken] = useState<Token | null>(null);
  const [showTradeModal, setShowTradeModal] = useState(false);
  
  // Handle contract address search
  const handleContractSearch = async () => {
    if (!contractSearch.trim()) return;
    
    setIsSearchingContract(true);
    setContractSearchError(null);
    
    try {
      // Detect chain from address format
      let detectedChain = 'ethereum';
      if (contractSearch.length >= 32 && !contractSearch.startsWith('0x')) {
        detectedChain = 'solana';
      } else if (contractSearch.startsWith('0x') && contractSearch.length === 42) {
        detectedChain = selectedChain !== 'all' ? selectedChain : 'ethereum';
      }
      
      // Try to fetch token by contract address
      const response = await fetch(`/api/guardian-scanner/contract/${detectedChain}/${contractSearch}`);
      if (response.ok) {
        const data = await response.json();
        if (data.token) {
          // Navigate to token detail
          window.location.href = `/guardian-scanner/${detectedChain}/${data.token.symbol}`;
          return;
        }
      }
      
      // Fallback: search in current tokens
      const found = tokens.find(t => 
        t.contractAddress.toLowerCase() === contractSearch.toLowerCase() ||
        t.pairAddress.toLowerCase() === contractSearch.toLowerCase()
      );
      
      if (found) {
        window.location.href = `/guardian-scanner/${found.chain}/${found.symbol}`;
      } else {
        setContractSearchError('Token not found. Try a different address or chain.');
      }
    } catch {
      setContractSearchError('Failed to search. Please try again.');
    } finally {
      setIsSearchingContract(false);
    }
  };

  const { connected } = useGuardianWS({ 
    chains: selectedChain === 'all' ? ['all'] : [selectedChain],
    enabled: true 
  });

  const totalVolume = useMemo(() => tokens.reduce((acc, t) => acc + t.volume24h, 0), [tokens]);
  const totalTxns = useMemo(() => tokens.reduce((acc, t) => acc + t.txns, 0), [tokens]);
  
  const aiStats = useMemo(() => ({
    snipeCount: tokens.filter(t => t.aiRecommendation === 'snipe').length,
    watchCount: tokens.filter(t => t.aiRecommendation === 'watch').length,
    avoidCount: tokens.filter(t => t.aiRecommendation === 'avoid').length,
  }), [tokens]);

  useEffect(() => {
    const fetchTokens = async () => {
      setIsLoading(true);
      try {
        const chainParam = selectedChain === 'darkwave' ? '' : selectedChain;
        const url = `/api/guardian-scanner/tokens?chain=${chainParam}&filter=trending`;
        const response = await fetch(url);
        const data = await response.json();
        
        if (data.tokens && data.tokens.length > 0) {
          const transformed: Token[] = data.tokens.map((t: any, i: number) => {
            const safetyScore = t.guardianScore || Math.floor(Math.random() * 100);
            const aiScore = Math.floor(Math.random() * 100);
            const aiRecommendation: 'snipe' | 'watch' | 'avoid' = 
              aiScore >= 75 ? 'snipe' : aiScore >= 40 ? 'watch' : 'avoid';
            
            return {
              id: t.id,
              rank: i + 1,
              name: t.name || 'Unknown',
              symbol: t.symbol || 'UNK',
              logo: t.imageUrl || `https://api.dicebear.com/7.x/shapes/svg?seed=${t.symbol}`,
              contractAddress: t.contractAddress || '',
              pairAddress: t.pairAddress || '',
              chain: t.chain || selectedChain,
              chainIcon: CHAINS.find(c => c.id === (t.chain || selectedChain))?.icon || "◎",
              dex: "DEX",
              dexShort: "DEX",
              price: t.price || 0,
              priceUsd: formatPrice(t.price || 0),
              age: t.ageHours < 1 ? `${Math.floor(t.ageHours * 60)}m` : 
                   t.ageHours < 24 ? `${Math.floor(t.ageHours)}h` : 
                   `${Math.floor(t.ageHours / 24)}d`,
              ageMinutes: (t.ageHours || 0) * 60,
              txns: (t.txns24h?.buys || 0) + (t.txns24h?.sells || 0),
              buys: t.txns24h?.buys || 0,
              sells: t.txns24h?.sells || 0,
              volume24h: t.volume24h || 0,
              makers: Math.floor(Math.random() * 50000) + 1000,
              priceChange5m: (Math.random() - 0.5) * 10,
              priceChange1h: t.priceChange1h || 0,
              priceChange6h: (Math.random() - 0.5) * 80,
              priceChange24h: t.priceChange24h || 0,
              liquidity: t.liquidity || 0,
              marketCap: t.marketCap || t.fdv || 0,
              guardianScore: safetyScore,
              boosts: Math.random() > 0.5 ? Math.floor(Math.random() * 2500) : 0,
              isWatchlisted: false,
              aiRecommendation,
              aiScore,
              mlPrediction: t.mlPrediction || {
                direction: Math.random() > 0.5 ? 'up' : 'down',
                confidence: Math.floor(Math.random() * 30) + 60,
                accuracy: Math.floor(Math.random() * 20) + 70,
                shortTerm: { direction: Math.random() > 0.5 ? 'up' : 'down', percent: Math.random() * 30 + 5 },
                longTerm: { direction: Math.random() > 0.4 ? 'up' : 'down', percent: Math.random() * 60 + 10 },
              },
              safety: t.safety || {
                honeypotRisk: false,
                mintAuthority: Math.random() > 0.6,
                freezeAuthority: Math.random() > 0.7,
                liquidityLocked: Math.random() > 0.4,
                holderCount: Math.floor(Math.random() * 30000) + 500,
                whaleConcentration: Math.random() * 50 + 10,
                botActivity: Math.random() * 30,
                safetyScore,
                safetyGrade: safetyScore >= 80 ? 'A' : safetyScore >= 60 ? 'B' : safetyScore >= 40 ? 'C' : 'D',
                risks: [],
                warnings: [],
              },
            };
          });
          setTokens(transformed);
        } else {
          setTokens(generateMockTokens(selectedChain));
        }
      } catch {
        setTokens(generateMockTokens(selectedChain));
      }
      setIsLoading(false);
    };
    
    fetchTokens();
  }, [selectedChain]);

  const filteredTokens = useMemo(() => {
    let result = [...tokens];
    
    // Filter by category
    if (selectedCategory !== 'all') {
      result = result.filter(t => t.category === selectedCategory);
    }
    
    // Filter by new pairs (last 24 hours)
    if (activeFilter === 'new') {
      result = result.filter(t => t.ageMinutes <= 1440); // 24 hours
    }
    
    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase().trim();
      result = result.filter(t => 
        t.symbol.toLowerCase().includes(query) ||
        t.name.toLowerCase().includes(query) ||
        t.contractAddress.toLowerCase().includes(query)
      );
    }
    
    // Sorting
    switch (rankBy) {
      case "volume": result.sort((a, b) => b.volume24h - a.volume24h); break;
      case "gainers": result.sort((a, b) => b.priceChange24h - a.priceChange24h); break;
      case "losers": result.sort((a, b) => a.priceChange24h - b.priceChange24h); break;
      case "newest": result.sort((a, b) => a.ageMinutes - b.ageMinutes); break;
      case "score": result.sort((a, b) => b.guardianScore - a.guardianScore); break;
      case "ai": result.sort((a, b) => b.aiScore - a.aiScore); break;
      case "txns": result.sort((a, b) => b.txns - a.txns); break;
      case "liquidity": result.sort((a, b) => b.liquidity - a.liquidity); break;
      case "mcap": result.sort((a, b) => b.marketCap - a.marketCap); break;
      case "5m": result.sort((a, b) => b.priceChange5m - a.priceChange5m); break;
      case "1h": result.sort((a, b) => b.priceChange1h - a.priceChange1h); break;
      case "6h": result.sort((a, b) => b.priceChange6h - a.priceChange6h); break;
      default: result.sort((a, b) => (b.volume24h * Math.abs(b.priceChange6h)) - (a.volume24h * Math.abs(a.priceChange6h)));
    }
    
    return result.map((t, i) => ({ ...t, rank: i + 1 }));
  }, [tokens, searchQuery, rankBy, selectedCategory, activeFilter]);

  const watchlistedTokens = useMemo(() => tokens.filter(t => t.isWatchlisted), [tokens]);

  const toggleWatchlist = (id: string) => {
    setTokens(prev => prev.map(t => t.id === id ? { ...t, isWatchlisted: !t.isWatchlisted } : t));
  };

  const selectedChainData = CHAINS.find(c => c.id === selectedChain);
  const selectedSortData = SORT_OPTIONS.find(s => s.id === rankBy);

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex">
      {/* Left Sidebar */}
      <LeftSidebar 
        watchlistedTokens={watchlistedTokens} 
        onSelectToken={(t) => setExpandedTokenId(expandedTokenId === t.id ? null : t.id)}
        stats={aiStats}
      />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Stats Bar */}
        <div className="bg-[#0d0d0d] border-b border-white/5 px-4 py-2 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <span className="text-xs text-white/40">24H VOLUME:</span>
              <span className="text-sm font-bold text-white">${formatNumber(totalVolume * 50)}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-white/40">24H TXNS:</span>
              <span className="text-sm font-bold text-white">{formatCompact(totalTxns * 100)}</span>
            </div>
            <div className="hidden md:flex items-center gap-4 border-l border-white/10 pl-4">
              <div className="flex items-center gap-1.5">
                <Crosshair className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-xs text-emerald-400 font-medium">{aiStats.snipeCount} Snipe</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5 text-yellow-400" />
                <span className="text-xs text-yellow-400 font-medium">{aiStats.watchCount} Watch</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Ban className="w-3.5 h-3.5 text-red-400" />
                <span className="text-xs text-red-400 font-medium">{aiStats.avoidCount} Avoid</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge className={`${connected ? 'bg-emerald-500/20 text-emerald-400' : 'bg-white/10 text-white/40'} text-[10px] px-2 py-0.5`}>
              <span className={`w-1.5 h-1.5 rounded-full mr-1.5 inline-block ${connected ? 'bg-emerald-400 animate-pulse' : 'bg-white/30'}`} />
              {connected ? 'LIVE' : 'OFFLINE'}
            </Badge>
          </div>
        </div>
        
        {/* Mobile Header */}
        <div className="lg:hidden bg-[#0d0d0d] border-b border-white/5 px-3 py-2.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-purple-500 flex items-center justify-center">
              <Shield className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-white text-sm">GUARDIAN</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 px-2 py-1 bg-emerald-500/10 rounded">
              <Crosshair className="w-3 h-3 text-emerald-400" />
              <span className="text-[10px] text-emerald-400 font-medium">{aiStats.snipeCount}</span>
            </div>
            <div className="flex items-center gap-1 px-2 py-1 bg-yellow-500/10 rounded">
              <Eye className="w-3 h-3 text-yellow-400" />
              <span className="text-[10px] text-yellow-400 font-medium">{aiStats.watchCount}</span>
            </div>
            <Badge className={`${connected ? 'bg-emerald-500/20 text-emerald-400' : 'bg-white/10 text-white/40'} text-[10px] px-2 py-0.5`}>
              <span className={`w-1.5 h-1.5 rounded-full mr-1 inline-block ${connected ? 'bg-emerald-400' : 'bg-white/30'}`} />
              {connected ? 'LIVE' : ''}
            </Badge>
          </div>
        </div>
        
        {/* Filters Bar - Horizontally scrollable on mobile */}
        <div className="bg-[#0d0d0d] border-b border-white/5 px-3 md:px-4 py-2 overflow-x-auto scrollbar-hide">
          <div className="flex items-center gap-2 md:gap-3 min-w-max">
          {/* Chain Selector */}
          <div className="relative">
            <button
              onClick={() => setShowChainDropdown(!showChainDropdown)}
              className="flex items-center gap-1.5 px-3 py-2.5 md:py-1.5 rounded-lg text-xs font-medium bg-white/5 hover:bg-white/10 text-white border border-white/10 min-h-[44px] md:min-h-0"
              data-testid="chain-selector"
            >
              <span>{selectedChainData?.icon}</span>
              <span>{selectedChainData?.short}</span>
              <ChevronDown className="w-3.5 h-3.5 text-white/50" />
            </button>
            <AnimatePresence>
              {showChainDropdown && (
                <motion.div
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  className="absolute left-0 top-full mt-1 z-50 bg-[#1a1a1a] border border-white/10 rounded-lg shadow-xl min-w-[140px] py-1"
                >
                  {CHAINS.map(chain => (
                    <button
                      key={chain.id}
                      onClick={() => { setSelectedChain(chain.id); setShowChainDropdown(false); }}
                      className={`w-full flex items-center gap-2 px-3 py-2 text-xs ${
                        selectedChain === chain.id ? 'bg-cyan-500/20 text-cyan-400' : 'text-white/70 hover:bg-white/5'
                      }`}
                    >
                      <span>{chain.icon}</span>
                      <span>{chain.short}</span>
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Trending Button */}
          <button 
            onClick={() => { setActiveFilter("trending"); setRankBy("trending"); }}
            className={`flex items-center gap-1.5 px-3 py-2.5 md:py-1.5 rounded-lg text-xs font-medium min-h-[44px] md:min-h-0 ${
              activeFilter === "trending" 
                ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30' 
                : 'bg-white/5 text-white/60 border border-white/10 hover:bg-white/10'
            }`}
          >
            <Flame className="w-3.5 h-3.5" />
            Trending
          </button>

          {/* Time Filters */}
          <div className="flex items-center bg-white/5 rounded-lg border border-white/10 p-0.5">
            {TIME_FILTERS.map(tf => (
              <button
                key={tf.id}
                onClick={() => setActiveTimeFilter(tf.id)}
                className={`px-2.5 py-1 text-[11px] font-medium rounded-md transition-colors ${
                  activeTimeFilter === tf.id 
                    ? 'bg-cyan-500 text-white' 
                    : 'text-white/50 hover:text-white hover:bg-white/5'
                }`}
              >
                {tf.label}
              </button>
            ))}
          </div>

          {/* Quick Filters */}
          <button 
            onClick={() => { setActiveFilter("ai"); setRankBy("ai"); }}
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium ${
              activeFilter === "ai" ? 'bg-cyan-500/20 text-cyan-400' : 'text-white/50 hover:text-white hover:bg-white/5'
            }`}
          >
            <Brain className="w-3.5 h-3.5" />
            AI Score
          </button>
          <button 
            onClick={() => { setActiveFilter("gainers"); setRankBy("gainers"); }}
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium ${
              activeFilter === "gainers" ? 'bg-emerald-500/20 text-emerald-400' : 'text-white/50 hover:text-white hover:bg-white/5'
            }`}
          >
            <ArrowUpRight className="w-3.5 h-3.5" />
            Gainers
          </button>
          <button 
            onClick={() => { setActiveFilter("new"); setRankBy("newest"); }}
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium ${
              activeFilter === "new" ? 'bg-purple-500/20 text-purple-400' : 'text-white/50 hover:text-white hover:bg-white/5'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            New
          </button>

          <div className="hidden md:block flex-1" />

          {/* Rank By Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowSortDropdown(!showSortDropdown)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-white/5 hover:bg-white/10 text-white/70 border border-white/10"
              data-testid="sort-selector"
            >
              <span>Rank by:</span>
              <span className="text-white">{selectedSortData?.label}</span>
              <ChevronDown className="w-3.5 h-3.5 text-white/50" />
            </button>
            <AnimatePresence>
              {showSortDropdown && (
                <motion.div
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  className="absolute right-0 top-full mt-1 z-50 bg-[#1a1a1a] border border-white/10 rounded-lg shadow-xl min-w-[160px] py-1"
                >
                  {SORT_OPTIONS.map(opt => (
                    <button
                      key={opt.id}
                      onClick={() => { setRankBy(opt.id); setShowSortDropdown(false); }}
                      className={`w-full flex items-center gap-2 px-3 py-2 text-xs ${
                        rankBy === opt.id ? 'bg-cyan-500/20 text-cyan-400' : 'text-white/70 hover:bg-white/5'
                      }`}
                    >
                      <opt.icon className="w-3.5 h-3.5" />
                      <span>{opt.label}</span>
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Search */}
          <div className="relative w-32 md:w-48">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/30" />
            <Input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-9 md:h-8 pl-8 pr-3 text-xs bg-white/5 border-white/10 focus:border-cyan-500/50"
              data-testid="search-input"
            />
          </div>

          {/* Refresh */}
          <button
            onClick={() => {
              setIsLoading(true);
              setTimeout(() => { setTokens(generateMockTokens(selectedChain)); setIsLoading(false); }, 300);
            }}
            className="p-2.5 md:p-2 text-white/40 hover:text-white hover:bg-white/5 rounded-lg min-w-[44px] min-h-[44px] md:min-w-0 md:min-h-0 flex items-center justify-center"
            data-testid="refresh-btn"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
          </div>
        </div>

        {/* Contract Address Search */}
        <div className="px-3 py-2 border-b border-white/5 bg-slate-900/30">
          <div className="flex items-center gap-2">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
              <Input
                type="text"
                placeholder="Search by contract address (0x... or Solana address)"
                value={contractSearch}
                onChange={(e) => setContractSearch(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleContractSearch()}
                className="h-10 pl-10 pr-3 text-sm bg-slate-800/50 border-white/10 focus:border-cyan-500/50 font-mono"
                data-testid="contract-search-input"
              />
            </div>
            <button
              onClick={handleContractSearch}
              disabled={isSearchingContract || !contractSearch.trim()}
              className="px-4 py-2.5 bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white text-sm font-medium rounded-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 min-h-[44px]"
              data-testid="contract-search-btn"
            >
              {isSearchingContract ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <Target className="w-4 h-4" />
              )}
              Lookup
            </button>
          </div>
          {contractSearchError && (
            <p className="text-xs text-red-400 mt-1 flex items-center gap-1">
              <AlertTriangle className="w-3 h-3" />
              {contractSearchError}
            </p>
          )}
        </div>

        {/* Category Filters */}
        <div className="px-3 py-2 border-b border-white/5 overflow-x-auto scrollbar-hide">
          <div className="flex items-center gap-2 min-w-max">
            <span className="text-[10px] text-white/40 uppercase tracking-wider mr-1">Category:</span>
            {CATEGORY_FILTERS.map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all min-h-[36px] ${
                  selectedCategory === cat.id 
                    ? `${cat.color} border border-white/20 text-white` 
                    : 'bg-white/5 text-white/50 hover:text-white hover:bg-white/10'
                }`}
                data-testid={`category-${cat.id}`}
              >
                <span>{cat.icon}</span>
                <span>{cat.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="flex-1 overflow-auto">
          <table className="w-full text-left">
            <thead className="sticky top-0 bg-[#0d0d0d] border-b border-white/10 z-10">
              <tr className="text-[10px] uppercase tracking-wider text-white/40">
                <th className="pl-2 pr-1 py-2 font-medium w-6"></th>
                <th className="pr-2 py-2 font-medium w-8">#</th>
                <th className="py-2 pr-3 font-medium min-w-[180px]">TOKEN</th>
                <th className="py-2 pr-3 font-medium">AI</th>
                <th className="py-2 pr-3 font-medium hidden xl:table-cell">ML</th>
                <th className="py-2 pr-4 font-medium text-right">PRICE</th>
                <th className="py-2 pr-4 font-medium text-right hidden lg:table-cell">AGE</th>
                <th className="py-2 pr-4 font-medium text-right hidden lg:table-cell">TXNS</th>
                <th className="py-2 pr-4 font-medium text-right">VOLUME</th>
                <th className="py-2 pr-4 font-medium text-right hidden xl:table-cell">5M</th>
                <th className="py-2 pr-4 font-medium text-right">1H</th>
                <th className="py-2 pr-4 font-medium text-right hidden lg:table-cell">6H</th>
                <th className="py-2 pr-4 font-medium text-right hidden xl:table-cell">LIQUIDITY</th>
                <th className="py-2 pr-3 font-medium">SCORE</th>
                <th className="py-2 pr-3 font-medium w-16"></th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                Array.from({ length: 15 }).map((_, i) => (
                  <tr key={i} className="border-b border-white/5 animate-pulse">
                    <td colSpan={15} className="py-3">
                      <div className="h-6 bg-white/5 rounded mx-3" />
                    </td>
                  </tr>
                ))
              ) : (
                filteredTokens.map(token => (
                  <TokenRow 
                    key={token.id} 
                    token={token}
                    isExpanded={expandedTokenId === token.id}
                    onToggleExpand={() => setExpandedTokenId(expandedTokenId === token.id ? null : token.id)}
                    onToggleWatchlist={toggleWatchlist}
                    onTrade={(t) => { setTradingToken(t); setShowTradeModal(true); }}
                  />
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Trade Modal */}
      <AnimatePresence>
        {showTradeModal && tradingToken && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
            onClick={() => setShowTradeModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-md"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative">
                <button
                  onClick={() => setShowTradeModal(false)}
                  className="absolute -top-2 -right-2 z-10 w-8 h-8 bg-slate-800 border border-white/10 rounded-full flex items-center justify-center text-white/50 hover:text-white hover:bg-slate-700"
                  data-testid="close-trade-modal"
                >
                  <X className="w-4 h-4" />
                </button>
                <QuickTradePanel
                  tokenAddress={tradingToken.contractAddress}
                  tokenSymbol={tradingToken.symbol}
                  tokenName={tradingToken.name}
                  tokenLogo={tradingToken.logo}
                  onClose={() => setShowTradeModal(false)}
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
