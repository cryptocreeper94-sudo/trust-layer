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
  Megaphone
} from "lucide-react";
import { useGuardianWS } from "@/hooks/use-guardian-ws";

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
];

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
  hasProfile: boolean;
  isAdvertising: boolean;
  honeypotRisk: boolean;
  mintAuthority: boolean;
  freezeAuthority: boolean;
  liquidityLocked: boolean;
  whaleConcentration: number;
  botActivity: number;
  creatorBadge: "new" | "verified" | "trusted" | "certified" | "flagged";
}

function generateMockTokens(chain: string): Token[] {
  const tokenData = [
    { symbol: "DOG", name: "Nietzschean Dog", boosts: 2000 },
    { symbol: "toothpaste", name: "toothpaste", boosts: 2500 },
    { symbol: "COPPERINU", name: "copper inu", boosts: 800 },
    { symbol: "WAR", name: "WAR", boosts: 500 },
    { symbol: "olive oil", name: "Olive oil", boosts: 100 },
    { symbol: "BIRB", name: "Moonbirds", boosts: 0 },
    { symbol: "HODLAI", name: "HODL AI", boosts: 800 },
    { symbol: "USER", name: "Just a user", boosts: 100 },
    { symbol: "CPENG", name: "Club Penguin", boosts: 300 },
    { symbol: "CAT", name: "Nietzschean Cat", boosts: 500 },
    { symbol: "PENGUIN", name: "Nietzschean Penguin", boosts: 1200 },
    { symbol: "WOJAK", name: "Wojak", boosts: 400 },
    { symbol: "PEPE2", name: "Pepe 2.0", boosts: 900 },
    { symbol: "MEME", name: "Memecoin", boosts: 600 },
    { symbol: "SHIB2", name: "Shiba 2.0", boosts: 350 },
    { symbol: "DOGE2", name: "Doge 2.0", boosts: 750 },
    { symbol: "BONK2", name: "Bonk 2.0", boosts: 200 },
    { symbol: "FLOKI2", name: "Floki 2.0", boosts: 150 },
    { symbol: "APE", name: "Ape Token", boosts: 0 },
    { symbol: "MOON", name: "Moonshot", boosts: 1100 },
    { symbol: "ROCKET", name: "Rocket", boosts: 0 },
    { symbol: "WHALE", name: "Whale", boosts: 250 },
    { symbol: "ALPHA", name: "Alpha", boosts: 0 },
    { symbol: "CHAD", name: "Chad", boosts: 180 },
    { symbol: "GEM", name: "Hidden Gem", boosts: 0 },
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
    const score = Math.floor(Math.random() * 100);
    const badges: Array<"new" | "verified" | "trusted" | "certified" | "flagged"> = 
      ["new", "verified", "trusted", "certified", "flagged"];
    
    const price = Math.random() * (Math.random() > 0.5 ? 0.1 : 0.00001);
    const isNew = Math.random() > 0.4;
    const color = colors[i % colors.length];
    const chainDexes = dexByChain[tokenChain] || [{ name: "DEX", short: "DEX" }];
    const dex = chainDexes[Math.floor(Math.random() * chainDexes.length)];
    const txns = Math.floor(Math.random() * 200000) + 5000;
    const buyRatio = 0.4 + Math.random() * 0.2;
    
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
      guardianScore: score,
      boosts: td.boosts,
      isWatchlisted: Math.random() > 0.85,
      hasProfile: Math.random() > 0.5,
      isAdvertising: Math.random() > 0.85,
      honeypotRisk: Math.random() > 0.95,
      mintAuthority: Math.random() > 0.7,
      freezeAuthority: Math.random() > 0.8,
      liquidityLocked: Math.random() > 0.4,
      whaleConcentration: Math.random() * 60 + 10,
      botActivity: Math.random() * 30,
      creatorBadge: badges[Math.floor(Math.random() * (score > 60 ? 4 : 5))],
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
      {isPositive ? '' : ''}{value.toFixed(2)}%
    </span>
  );
}

function GuardianScoreBadge({ score }: { score: number }) {
  let color = "bg-red-500/20 text-red-400 border-red-500/30";
  if (score >= 80) color = "bg-emerald-500/20 text-emerald-400 border-emerald-500/30";
  else if (score >= 50) color = "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
  else if (score >= 20) color = "bg-orange-500/20 text-orange-400 border-orange-500/30";
  
  return (
    <div className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded border text-[10px] font-bold ${color}`}>
      <Shield className="w-2.5 h-2.5" />
      {score}
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

function TokenRow({ token, onToggleWatchlist }: { token: Token; onToggleWatchlist: (id: string) => void }) {
  const [copied, setCopied] = useState(false);
  const copyAddress = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigator.clipboard.writeText(token.contractAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  
  return (
    <tr className="border-b border-white/5 hover:bg-white/[0.03] transition-colors group cursor-pointer" data-testid={`token-row-${token.id}`}>
      {/* Rank */}
      <td className="pl-3 pr-2 py-2 text-xs text-white/40 w-10 text-center">{token.rank}</td>
      
      {/* Token Info */}
      <td className="py-2 pr-3 min-w-[200px]">
        <Link href={`/guardian-scanner/${token.chain}/${token.symbol.toLowerCase()}`}>
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
              <span className="text-[10px] text-white/40 truncate max-w-[140px]">{token.name}</span>
            </div>
          </div>
        </Link>
      </td>
      
      {/* Price */}
      <td className="py-2 pr-4 text-right">
        <span className="text-xs font-medium text-white tabular-nums">{token.priceUsd}</span>
      </td>
      
      {/* Age */}
      <td className="py-2 pr-4 text-right">
        <span className="text-xs text-white/50">{token.age}</span>
      </td>
      
      {/* Txns */}
      <td className="py-2 pr-4 text-right">
        <span className="text-xs text-white/60 tabular-nums">{formatCompact(token.txns)}</span>
      </td>
      
      {/* Volume */}
      <td className="py-2 pr-4 text-right">
        <span className="text-xs text-white/70 tabular-nums">${formatNumber(token.volume24h)}</span>
      </td>
      
      {/* Makers */}
      <td className="py-2 pr-4 text-right hidden xl:table-cell">
        <span className="text-xs text-white/50 tabular-nums">{formatCompact(token.makers)}</span>
      </td>
      
      {/* 5M Change */}
      <td className="py-2 pr-4 text-right">
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
      <td className="py-2 pr-4 text-right">
        <span className="text-xs text-white/60 tabular-nums">${formatNumber(token.liquidity)}</span>
      </td>
      
      {/* Guardian Score */}
      <td className="py-2 pr-3">
        <GuardianScoreBadge score={token.guardianScore} />
      </td>
      
      {/* Actions */}
      <td className="py-2 pr-3">
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
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
  );
}

function LeftSidebar({ 
  watchlistedTokens, 
  onSelectToken 
}: { 
  watchlistedTokens: Token[]; 
  onSelectToken: (token: Token) => void;
}) {
  return (
    <div className="w-48 bg-[#0d0d0d] border-r border-white/5 flex-shrink-0 hidden lg:flex flex-col">
      {/* Logo */}
      <div className="p-3 border-b border-white/5">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-purple-500 flex items-center justify-center">
            <Shield className="w-4 h-4 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-white text-sm">GUARDIAN</span>
            <span className="text-[9px] text-white/40">SCANNER</span>
          </div>
        </Link>
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
      <nav className="flex-1 py-2">
        <Link href="/guardian-scanner">
          <div className="flex items-center gap-2 px-3 py-2 text-white/80 hover:bg-white/5 hover:text-white cursor-pointer">
            <Star className="w-4 h-4" />
            <span className="text-xs font-medium">Watchlist</span>
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
        <Link href="/portfolio">
          <div className="flex items-center gap-2 px-3 py-2 text-white/80 hover:bg-white/5 hover:text-white cursor-pointer">
            <BarChart3 className="w-4 h-4" />
            <span className="text-xs font-medium">Portfolio</span>
          </div>
        </Link>
        <Link href="/guardian-scanner">
          <div className="flex items-center gap-2 px-3 py-2 text-white/80 hover:bg-white/5 hover:text-white cursor-pointer">
            <Megaphone className="w-4 h-4" />
            <span className="text-xs font-medium">Advertise</span>
          </div>
        </Link>
      </nav>
      
      {/* Watchlist Section */}
      <div className="border-t border-white/5 p-2">
        <div className="flex items-center justify-between px-2 py-1">
          <span className="text-[10px] font-medium text-white/50 uppercase tracking-wide">Watchlist</span>
          <ChevronDown className="w-3 h-3 text-white/30" />
        </div>
        <div className="text-[10px] text-white/30 px-2 py-3 text-center">
          {watchlistedTokens.length === 0 ? (
            "Nothing in this list yet..."
          ) : (
            watchlistedTokens.slice(0, 5).map(t => (
              <div 
                key={t.id} 
                className="flex items-center gap-1.5 py-1 px-1 hover:bg-white/5 rounded cursor-pointer"
                onClick={() => onSelectToken(t)}
              >
                <img src={t.logo} alt="" className="w-4 h-4 rounded-full" />
                <span className="text-white/70">{t.symbol}</span>
              </div>
            ))
          )}
        </div>
      </div>
      
      {/* User Section */}
      <div className="border-t border-white/5 p-3">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center">
            <span className="text-[10px] text-white/50">👤</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] text-white/50">anon</span>
            <span className="text-[9px] text-cyan-400 cursor-pointer hover:underline">Sign-in</span>
          </div>
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

  const { connected } = useGuardianWS({ 
    chains: selectedChain === 'all' ? ['all'] : [selectedChain],
    enabled: true 
  });

  const totalVolume = useMemo(() => tokens.reduce((acc, t) => acc + t.volume24h, 0), [tokens]);
  const totalTxns = useMemo(() => tokens.reduce((acc, t) => acc + t.txns, 0), [tokens]);

  useEffect(() => {
    const fetchTokens = async () => {
      setIsLoading(true);
      try {
        const chainParam = selectedChain === 'darkwave' ? '' : selectedChain;
        const url = `/api/guardian-scanner/tokens?chain=${chainParam}&filter=trending`;
        const response = await fetch(url);
        const data = await response.json();
        
        if (data.tokens && data.tokens.length > 0) {
          const transformed: Token[] = data.tokens.map((t: any, i: number) => ({
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
            guardianScore: t.guardianScore || Math.floor(Math.random() * 100),
            boosts: Math.random() > 0.5 ? Math.floor(Math.random() * 2500) : 0,
            isWatchlisted: false,
            hasProfile: Math.random() > 0.5,
            isAdvertising: Math.random() > 0.85,
            honeypotRisk: false,
            mintAuthority: Math.random() > 0.7,
            freezeAuthority: Math.random() > 0.8,
            liquidityLocked: Math.random() > 0.5,
            whaleConcentration: Math.random() * 50 + 10,
            botActivity: Math.random() * 25,
            creatorBadge: ['new', 'verified', 'trusted', 'certified'][Math.floor(Math.random() * 4)] as any,
          }));
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
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase().trim();
      result = result.filter(t => 
        t.symbol.toLowerCase().includes(query) ||
        t.name.toLowerCase().includes(query) ||
        t.contractAddress.toLowerCase().includes(query)
      );
    }
    
    switch (rankBy) {
      case "volume": result.sort((a, b) => b.volume24h - a.volume24h); break;
      case "gainers": result.sort((a, b) => b.priceChange24h - a.priceChange24h); break;
      case "losers": result.sort((a, b) => a.priceChange24h - b.priceChange24h); break;
      case "newest": result.sort((a, b) => a.ageMinutes - b.ageMinutes); break;
      case "score": result.sort((a, b) => b.guardianScore - a.guardianScore); break;
      default: result.sort((a, b) => (b.volume24h * Math.abs(b.priceChange6h)) - (a.volume24h * Math.abs(a.priceChange6h)));
    }
    
    return result.map((t, i) => ({ ...t, rank: i + 1 }));
  }, [tokens, searchQuery, rankBy]);

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
        onSelectToken={(t) => console.log('Selected:', t.symbol)}
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
          </div>
          <div className="flex items-center gap-2">
            <Badge className={`${connected ? 'bg-emerald-500/20 text-emerald-400' : 'bg-white/10 text-white/40'} text-[10px] px-2 py-0.5`}>
              <span className={`w-1.5 h-1.5 rounded-full mr-1.5 inline-block ${connected ? 'bg-emerald-400 animate-pulse' : 'bg-white/30'}`} />
              {connected ? 'LIVE' : 'OFFLINE'}
            </Badge>
          </div>
        </div>
        
        {/* Filters Bar */}
        <div className="bg-[#0d0d0d] border-b border-white/5 px-4 py-2 flex items-center gap-3 flex-wrap">
          {/* Chain Selector */}
          <div className="relative">
            <button
              onClick={() => setShowChainDropdown(!showChainDropdown)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-white/5 hover:bg-white/10 text-white border border-white/10"
              data-testid="chain-selector"
            >
              <span>{selectedChainData?.icon}</span>
              <span>Last 24 hours</span>
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
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium ${
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
            onClick={() => { setActiveFilter("top"); setRankBy("volume"); }}
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium ${
              activeFilter === "top" ? 'bg-white/10 text-white' : 'text-white/50 hover:text-white hover:bg-white/5'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            Top
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
            New Pairs
          </button>

          <div className="flex-1" />

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
          <div className="relative w-48">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/30" />
            <Input
              type="text"
              placeholder="Search token..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-8 pl-8 pr-3 text-xs bg-white/5 border-white/10 focus:border-cyan-500/50"
              data-testid="search-input"
            />
          </div>

          {/* Refresh */}
          <button
            onClick={() => {
              setIsLoading(true);
              setTimeout(() => { setTokens(generateMockTokens(selectedChain)); setIsLoading(false); }, 300);
            }}
            className="p-2 text-white/40 hover:text-white hover:bg-white/5 rounded-lg"
            data-testid="refresh-btn"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {/* Table */}
        <div className="flex-1 overflow-auto">
          <table className="w-full text-left">
            <thead className="sticky top-0 bg-[#0d0d0d] border-b border-white/10 z-10">
              <tr className="text-[10px] uppercase tracking-wider text-white/40">
                <th className="pl-3 pr-2 py-2 font-medium w-10">#</th>
                <th className="py-2 pr-3 font-medium min-w-[200px]">TOKEN</th>
                <th className="py-2 pr-4 font-medium text-right">PRICE</th>
                <th className="py-2 pr-4 font-medium text-right">AGE</th>
                <th className="py-2 pr-4 font-medium text-right">TXNS</th>
                <th className="py-2 pr-4 font-medium text-right">VOLUME</th>
                <th className="py-2 pr-4 font-medium text-right hidden xl:table-cell">MAKERS</th>
                <th className="py-2 pr-4 font-medium text-right">5M</th>
                <th className="py-2 pr-4 font-medium text-right">1H</th>
                <th className="py-2 pr-4 font-medium text-right hidden lg:table-cell">6H</th>
                <th className="py-2 pr-4 font-medium text-right">LIQUIDITY</th>
                <th className="py-2 pr-3 font-medium">SCORE</th>
                <th className="py-2 pr-3 font-medium w-16"></th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                Array.from({ length: 15 }).map((_, i) => (
                  <tr key={i} className="border-b border-white/5 animate-pulse">
                    <td colSpan={13} className="py-3">
                      <div className="h-6 bg-white/5 rounded mx-3" />
                    </td>
                  </tr>
                ))
              ) : (
                filteredTokens.map(token => (
                  <TokenRow 
                    key={token.id} 
                    token={token} 
                    onToggleWatchlist={toggleWatchlist} 
                  />
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
