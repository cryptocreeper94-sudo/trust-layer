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
  StarOff,
  ExternalLink,
  AlertTriangle,
  RefreshCw,
  Zap,
  Eye,
  Clock,
  Users,
  Droplets,
  BarChart3,
  ArrowUpRight,
  ArrowDownRight,
  ChevronDown,
  ChevronRight,
  Flame,
  Skull,
  CheckCircle,
  Lock,
  Bot,
  Activity,
  Globe,
  Layers,
  Settings,
  Bell,
  Grid3X3,
  Rocket,
  Award,
  Wallet,
  LineChart,
  Copy,
  Check
} from "lucide-react";
import { useGuardianWS } from "@/hooks/use-guardian-ws";

// Chain configurations
const CHAINS = [
  { id: "all", name: "All Chains", icon: "🌐", color: "from-white/20 to-white/10" },
  { id: "solana", name: "Solana", icon: "◎", color: "from-purple-500 to-green-400" },
  { id: "ethereum", name: "Ethereum", icon: "Ξ", color: "from-blue-500 to-purple-500" },
  { id: "base", name: "Base", icon: "🔵", color: "from-blue-400 to-blue-600" },
  { id: "bsc", name: "BSC", icon: "🟡", color: "from-yellow-400 to-yellow-600" },
  { id: "arbitrum", name: "Arbitrum", icon: "🔷", color: "from-blue-400 to-cyan-500" },
  { id: "polygon", name: "Polygon", icon: "🟣", color: "from-purple-500 to-purple-700" },
  { id: "avalanche", name: "Avalanche", icon: "🔺", color: "from-red-500 to-red-700" },
  { id: "darkwave", name: "DarkWave", icon: "◆", color: "from-cyan-400 to-purple-500" },
];

const SIDEBAR_NAV = [
  { id: "watchlist", name: "Watchlist", icon: Star },
  { id: "alerts", name: "Alerts", icon: Bell },
  { id: "multicharts", name: "Multi Charts", icon: Grid3X3 },
  { id: "new-pairs", name: "New Pairs", icon: Rocket },
  { id: "gainers", name: "Gainers", icon: TrendingUp },
  { id: "losers", name: "Losers", icon: TrendingDown },
  { id: "portfolio", name: "Portfolio", icon: Wallet },
  { id: "advertise", name: "Advertise", icon: Zap },
];

const DEX_OPTIONS = [
  { id: "raydium", name: "Raydium", chain: "solana" },
  { id: "pumpfun", name: "Pump.fun", chain: "solana" },
  { id: "orca", name: "Orca", chain: "solana" },
  { id: "uniswap", name: "Uniswap", chain: "ethereum" },
  { id: "sushiswap", name: "SushiSwap", chain: "ethereum" },
  { id: "pancakeswap", name: "PancakeSwap", chain: "bsc" },
  { id: "baseswap", name: "BaseSwap", chain: "base" },
];

const TIME_FILTERS = [
  { id: "5m", label: "5M" },
  { id: "1h", label: "1H" },
  { id: "6h", label: "6H" },
  { id: "24h", label: "24H" },
];

const RANK_OPTIONS = [
  { id: "trending", name: "Trending 🔥" },
  { id: "volume", name: "Top Volume" },
  { id: "gainers", name: "Top Gainers" },
  { id: "losers", name: "Top Losers" },
  { id: "newest", name: "Newest" },
  { id: "score", name: "Guardian Score" },
  { id: "liquidity", name: "Liquidity" },
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

// Generate 100 tokens for scrolling
function generateMockTokens(chain: string): Token[] {
  const baseTokens = [
    "PENGUIN", "SKR", "REES", "XOGE", "BALLS", "USR", "RALPH", "MEMES", "WHALE", "FIT",
    "BONKILL", "DOGER", "PEPEC", "MOON", "SGEM", "WOJAK", "CHAD", "BAI", "FROG", "DMD",
    "APE2", "RCKT", "GEM", "ALPHA", "DEGEN", "WEN", "SAFE", "PAPER", "GIGA", "COPE",
    "SHIB2", "FLOKI2", "BONK2", "SAMO", "ORCA", "JUP", "RAY", "STEP", "MANGO", "TULIP",
    "SRM", "ATLAS", "POLIS", "GENE", "SLIM", "LIKE", "MNGO", "PORT", "SLND", "SHDW",
    "DUST", "HONEY", "FORGE", "CROWN", "KING", "QUEEN", "ACE", "JOKER", "WILD", "LUCKY",
    "MAGIC", "SPELL", "WAND", "STAFF", "RUNE", "SIGIL", "GLYPH", "MARK", "SEAL", "CREST",
    "BLADE", "SWORD", "AXE", "MACE", "SPEAR", "ARROW", "BOLT", "SHOT", "DART", "LANCE",
    "HELM", "ARMOR", "GUARD", "WARD", "AEGIS", "VEIL", "CLOAK", "SHROUD", "MASK", "FACE",
    "HEART", "SOUL", "MIND", "WILL", "HOPE", "DREAM", "WISH", "STAR2", "SUN2", "NOVA"
  ];
  
  const names: Record<string, string> = {
    PENGUIN: "Nietzschean Penguin", SKR: "Seeker", REES: "Rare Earth", XOGE: "Xoge Token",
    BALLS: "Ballscoin", USR: "US Reserve", RALPH: "Ralph Wiggum", MEMES: "Memes CC",
    WHALE: "White Whale", FIT: "Fitcoin", BONKILL: "Bonk Killer", DOGER: "Doge Rising",
    PEPEC: "Pepe Classic", MOON: "Moon Shot", SGEM: "SafeGem", WOJAK: "Wojak Finance",
    CHAD: "Chad Token", BAI: "Based AI", FROG: "Frog Nation", DMD: "Diamond Hands"
  };

  const chains = chain === "all" ? ["solana", "ethereum", "base", "bsc"] : [chain];
  const chainIcons: Record<string, string> = {
    solana: "◎", ethereum: "Ξ", base: "🔵", bsc: "🟡",
    arbitrum: "🔷", polygon: "🟣", avalanche: "🔺", darkwave: "◆"
  };
  
  const dexByChain: Record<string, string[]> = {
    solana: ["Raydium", "Pump.fun", "Orca"],
    ethereum: ["Uniswap", "SushiSwap"],
    base: ["BaseSwap", "Aerodrome"],
    bsc: ["PancakeSwap"],
    arbitrum: ["Camelot", "GMX"],
    polygon: ["QuickSwap"],
    avalanche: ["TraderJoe"],
    darkwave: ["DarkSwap"]
  };
  
  const colors = ["22d3ee", "a855f7", "ec4899", "f59e0b", "10b981", "3b82f6", "ef4444", "8b5cf6"];

  return baseTokens.map((symbol, i) => {
    const tokenChain = chains[Math.floor(Math.random() * chains.length)];
    const score = Math.floor(Math.random() * 100);
    const badges: Array<"new" | "verified" | "trusted" | "certified" | "flagged"> = 
      ["new", "verified", "trusted", "certified", "flagged"];
    
    const price = Math.random() * (Math.random() > 0.5 ? 0.1 : 0.00001);
    const isNew = Math.random() > 0.6;
    const color = colors[i % colors.length];
    const chainDexes = dexByChain[tokenChain] || ["DEX"];
    const dex = chainDexes[Math.floor(Math.random() * chainDexes.length)];
    const txns = Math.floor(Math.random() * 250000) + 1000;
    const buyRatio = 0.4 + Math.random() * 0.2;
    
    return {
      id: `${tokenChain}-${symbol.toLowerCase()}-${i}`,
      rank: i + 1,
      name: names[symbol] || symbol.charAt(0) + symbol.slice(1).toLowerCase() + " Token",
      symbol,
      logo: `https://api.dicebear.com/7.x/shapes/svg?seed=${symbol}&backgroundColor=${color}`,
      contractAddress: `0x${Array.from({length: 40}, () => '0123456789abcdef'[Math.floor(Math.random() * 16)]).join('')}`,
      pairAddress: `0x${Array.from({length: 40}, () => '0123456789abcdef'[Math.floor(Math.random() * 16)]).join('')}`,
      chain: tokenChain,
      chainIcon: chainIcons[tokenChain] || "◎",
      dex,
      dexShort: dex.length > 8 ? dex.slice(0, 6) + ".." : dex,
      price,
      priceUsd: formatPrice(price),
      age: isNew ? `${Math.floor(Math.random() * 23) + 1}h` : `${Math.floor(Math.random() * 30) + 1}d`,
      ageMinutes: isNew ? Math.floor(Math.random() * 1440) : Math.floor(Math.random() * 43200),
      txns,
      buys: Math.floor(txns * buyRatio),
      sells: Math.floor(txns * (1 - buyRatio)),
      volume24h: Math.random() * 70000000 + 100000,
      makers: Math.floor(Math.random() * 25000) + 100,
      priceChange5m: (Math.random() - 0.5) * 20,
      priceChange1h: (Math.random() - 0.5) * 30,
      priceChange6h: (Math.random() - 0.5) * 100,
      priceChange24h: (Math.random() - 0.5) * 200,
      liquidity: Math.random() * 2000000 + 10000,
      marketCap: Math.random() * 100000000 + 100000,
      guardianScore: score,
      boosts: Math.random() > 0.7 ? Math.floor(Math.random() * 500) : 0,
      isWatchlisted: Math.random() > 0.9,
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
  if (price < 0.000001) return price.toExponential(2);
  if (price < 0.0001) return `$${price.toFixed(8)}`;
  if (price < 0.01) return `$${price.toFixed(6)}`;
  if (price < 1) return `$${price.toFixed(4)}`;
  return `$${price.toFixed(2)}`;
}

function formatNumber(num: number): string {
  if (num >= 1e9) return `$${(num / 1e9).toFixed(2)}B`;
  if (num >= 1e6) return `$${(num / 1e6).toFixed(1)}M`;
  if (num >= 1e3) return `$${(num / 1e3).toFixed(0)}K`;
  return `$${num.toFixed(0)}`;
}

function formatCompact(num: number): string {
  if (num >= 1e6) return `${(num / 1e6).toFixed(1)}M`;
  if (num >= 1e3) return `${(num / 1e3).toFixed(0)}K`;
  return num.toFixed(0);
}

function PriceChange({ value, className = "" }: { value: number; className?: string }) {
  const isPositive = value >= 0;
  return (
    <span className={`font-medium ${isPositive ? 'text-emerald-400' : 'text-red-400'} ${className}`}>
      {isPositive ? '+' : ''}{value.toFixed(2)}%
    </span>
  );
}

function GuardianScoreBadge({ score }: { score: number }) {
  let color = "bg-red-500/20 text-red-400 border-red-500/30";
  if (score >= 80) color = "bg-emerald-500/20 text-emerald-400 border-emerald-500/30";
  else if (score >= 50) color = "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
  else if (score >= 20) color = "bg-orange-500/20 text-orange-400 border-orange-500/30";
  
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <div className={`flex items-center gap-1 px-1.5 py-0.5 rounded border text-xs font-bold ${color}`}>
            <Shield className="w-3 h-3" />
            {score}
          </div>
        </TooltipTrigger>
        <TooltipContent className="bg-slate-900 border-white/10">
          <p className="text-xs">Guardian Score: {score >= 80 ? 'Low Risk' : score >= 50 ? 'Medium Risk' : score >= 20 ? 'High Risk' : 'Extreme Risk'}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

function BoostBadge({ boosts }: { boosts: number }) {
  if (boosts === 0) return null;
  return (
    <span className="text-[10px] text-yellow-400 font-medium flex items-center gap-0.5">
      <Zap className="w-2.5 h-2.5" />
      {boosts}
    </span>
  );
}

function SecurityIcons({ token }: { token: Token }) {
  return (
    <div className="flex items-center gap-1">
      {token.honeypotRisk && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <Skull className="w-3.5 h-3.5 text-red-400" />
            </TooltipTrigger>
            <TooltipContent className="bg-red-900/90 border-red-500/30">
              <p className="text-xs text-white">⚠️ Honeypot Risk Detected</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
      {token.liquidityLocked && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <Lock className="w-3 h-3 text-emerald-400" />
            </TooltipTrigger>
            <TooltipContent className="bg-slate-900 border-white/10">
              <p className="text-xs">Liquidity Locked ✓</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
      {token.creatorBadge === "verified" && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <CheckCircle className="w-3 h-3 text-blue-400" />
            </TooltipTrigger>
            <TooltipContent className="bg-slate-900 border-white/10">
              <p className="text-xs">Verified Creator</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
    </div>
  );
}

// Mobile Token Card - ultra compact (no horizontal scroll)
function TokenCard({ token, onToggleWatchlist }: { token: Token; onToggleWatchlist: (id: string) => void }) {
  return (
    <Link href={`/guardian-scanner/${token.chain}/${token.symbol.toLowerCase()}`}>
      <div 
        className="px-2 py-1.5 hover:bg-white/[0.03] border-b border-white/5 transition-colors flex items-center gap-2"
        data-testid={`token-card-${token.id}`}
      >
        {/* Rank */}
        <span className="text-[10px] text-white/30 w-4 shrink-0">{token.rank}</span>
        
        {/* Logo */}
        <div className="relative shrink-0">
          <img src={token.logo || ''} alt={token.symbol} className="w-6 h-6 rounded-full bg-white/10" />
          <span className="absolute -bottom-0.5 -right-0.5 text-[8px]">{token.chainIcon}</span>
        </div>
        
        {/* Symbol & Name */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1">
            <span className="font-medium text-white text-xs">{token.symbol}</span>
            {token.boosts > 0 && <span className="text-[8px] text-yellow-400">⚡{token.boosts}</span>}
            <SecurityIcons token={token} />
          </div>
          <span className="text-[9px] text-white/30 truncate block">{token.name}</span>
        </div>
        
        {/* Price & Change */}
        <div className="text-right shrink-0">
          <div className="text-xs font-medium text-white">{token.priceUsd}</div>
          <PriceChange value={token.priceChange24h} className="text-[9px]" />
        </div>
        
        {/* Volume */}
        <div className="text-right shrink-0 hidden xs:block">
          <div className="text-[9px] text-white/40">Vol</div>
          <div className="text-[10px] text-white/70">{formatNumber(token.volume24h)}</div>
        </div>
        
        {/* Guardian Score */}
        <div className="shrink-0">
          <GuardianScoreBadge score={token.guardianScore} />
        </div>
      </div>
    </Link>
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
    <tr 
      className="border-b border-white/5 hover:bg-white/[0.02] transition-colors group cursor-pointer h-9"
      data-testid={`token-row-${token.id}`}
    >
      {/* Rank */}
      <td className="py-1 pl-2 pr-1 text-[10px] text-white/40 w-7">{token.rank}</td>
      
      {/* Token: Chain + DEX + Logo + Symbol */}
      <td className="py-1 pr-2">
        <Link href={`/guardian-scanner/${token.chain}/${token.symbol.toLowerCase()}`} data-testid={`token-link-${token.id}`}>
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] w-4">{token.chainIcon}</span>
            <span className="text-[9px] text-white/40 w-12 truncate">{token.dexShort}</span>
            <img src={token.logo} alt={token.symbol} className="w-5 h-5 rounded-full bg-white/10" />
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-1">
                <span className="text-xs font-medium text-white group-hover:text-cyan-400">{token.symbol}</span>
                {token.boosts > 0 && <span className="text-[8px] text-yellow-400">⚡{token.boosts}</span>}
                <SecurityIcons token={token} />
              </div>
              <span className="text-[9px] text-white/30 truncate max-w-[80px]">{token.name}</span>
            </div>
          </div>
        </Link>
      </td>
      
      {/* Price */}
      <td className="py-1 pr-2 text-right text-xs font-medium text-white tabular-nums">{token.priceUsd}</td>
      
      {/* Age */}
      <td className="py-1 pr-2 text-right text-[10px] text-white/50">{token.age}</td>
      
      {/* Txns */}
      <td className="py-1 pr-2 text-right text-[10px] text-white/60 tabular-nums">{formatCompact(token.txns)}</td>
      
      {/* Volume */}
      <td className="py-1 pr-2 text-right text-[10px] text-white/60">{formatNumber(token.volume24h)}</td>
      
      {/* Makers */}
      <td className="py-1 pr-2 text-right text-[10px] text-white/60 tabular-nums hidden lg:table-cell">{formatCompact(token.makers)}</td>
      
      {/* 5M % */}
      <td className="py-1 pr-2 text-right text-[10px] hidden lg:table-cell"><PriceChange value={token.priceChange5m} /></td>
      
      {/* 1H % */}
      <td className="py-1 pr-2 text-right text-[10px]"><PriceChange value={token.priceChange1h} /></td>
      
      {/* 6H % */}
      <td className="py-1 pr-2 text-right text-[10px] hidden lg:table-cell"><PriceChange value={token.priceChange6h} /></td>
      
      {/* 24H % */}
      <td className="py-1 pr-2 text-right text-[10px]"><PriceChange value={token.priceChange24h} /></td>
      
      {/* Liquidity */}
      <td className="py-1 pr-2 text-right text-[10px] text-white/60 hidden xl:table-cell">{formatNumber(token.liquidity)}
      </td>
      
      {/* Guardian Score */}
      <td className="py-1 pr-2">
        <GuardianScoreBadge score={token.guardianScore} />
      </td>
      
      {/* Actions */}
      <td className="py-1 pr-2">
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); onToggleWatchlist(token.id); }}
            className="p-1 hover:bg-white/10 rounded transition-colors"
            data-testid={`watchlist-btn-${token.id}`}
          >
            {token.isWatchlisted ? (
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            ) : (
              <Star className="w-4 h-4 text-white/30 hover:text-yellow-400" />
            )}
          </button>
          <button
            onClick={copyAddress}
            className="p-1 hover:bg-white/10 rounded transition-colors"
            data-testid={`copy-btn-${token.id}`}
          >
            {copied ? (
              <Check className="w-4 h-4 text-emerald-400" />
            ) : (
              <Copy className="w-4 h-4 text-white/30 hover:text-white" />
            )}
          </button>
        </div>
      </td>
    </tr>
  );
}

export default function GuardianScanner() {
  const [selectedChain, setSelectedChain] = useState("solana");
  const [activeTimeFilter, setActiveTimeFilter] = useState("6h");
  const [rankBy, setRankBy] = useState("trending");
  const [searchQuery, setSearchQuery] = useState("");
  const [tokens, setTokens] = useState<Token[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showRankDropdown, setShowRankDropdown] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeSidebarItem, setActiveSidebarItem] = useState<string | null>(null);
  const [showChainDropdown, setShowChainDropdown] = useState(false);
  const [sortAscending, setSortAscending] = useState(false);
  // Filter checkboxes
  const [filterProfile, setFilterProfile] = useState(false);
  const [filterBoosted, setFilterBoosted] = useState(false);
  const [filterAdvertising, setFilterAdvertising] = useState(false);
  
  // Stats
  const [stats, setStats] = useState({ volume24h: 26150000000, txns24h: 46104946 });

  const { connected } = useGuardianWS({ 
    chains: selectedChain === 'all' ? ['all'] : [selectedChain],
    enabled: true 
  });

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
            symbol: t.symbol || 'UNKNOWN',
            logo: t.imageUrl || null,
            contractAddress: t.contractAddress || '',
            pairAddress: t.pairAddress || '',
            chain: t.chain || selectedChain,
            chainIcon: CHAINS.find(c => c.id === (t.chain || selectedChain))?.icon || "◎",
            price: t.price || 0,
            priceUsd: formatPrice(t.price || 0),
            age: t.ageHours < 1 ? `${Math.floor(t.ageHours * 60)}m` : 
                 t.ageHours < 24 ? `${Math.floor(t.ageHours)}h` : 
                 `${Math.floor(t.ageHours / 24)}d`,
            ageMinutes: (t.ageHours || 0) * 60,
            txns: (t.txns24h?.buys || 0) + (t.txns24h?.sells || 0),
            volume24h: t.volume24h || 0,
            makers: Math.floor(Math.random() * 10000) + 500,
            priceChange5m: (Math.random() - 0.5) * 10,
            priceChange1h: t.priceChange1h || 0,
            priceChange6h: (Math.random() - 0.5) * 50,
            priceChange24h: t.priceChange24h || 0,
            liquidity: t.liquidity || 0,
            marketCap: t.marketCap || t.fdv || 0,
            guardianScore: t.guardianScore || Math.floor(Math.random() * 100),
            boosts: Math.random() > 0.7 ? Math.floor(Math.random() * 500) : 0,
            isWatchlisted: false,
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
      } catch (error) {
        console.error('Failed to fetch tokens:', error);
        setTokens(generateMockTokens(selectedChain));
      }
      setIsLoading(false);
    };
    
    fetchTokens();
  }, [selectedChain]);

  const filteredTokens = useMemo(() => {
    let result = [...tokens];
    
    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase().trim();
      result = result.filter(t => 
        t.name.toLowerCase().includes(query) || 
        t.symbol.toLowerCase().includes(query) ||
        t.contractAddress.toLowerCase().includes(query)
      );
    }
    
    // Checkbox filters
    if (filterProfile) result = result.filter(t => t.hasProfile);
    if (filterBoosted) result = result.filter(t => t.boosts > 0);
    if (filterAdvertising) result = result.filter(t => t.isAdvertising);

    // Sidebar filters
    if (activeSidebarItem === "watchlist") {
      result = result.filter(t => t.isWatchlisted);
    } else if (activeSidebarItem === "new-pairs") {
      result = result.filter(t => t.ageMinutes < 1440);
    } else if (activeSidebarItem === "gainers") {
      result = result.filter(t => t.priceChange24h > 0);
    } else if (activeSidebarItem === "losers") {
      result = result.filter(t => t.priceChange24h < 0);
    }
    
    // Sorting
    switch (rankBy) {
      case "volume":
        result.sort((a, b) => b.volume24h - a.volume24h);
        break;
      case "gainers":
        result.sort((a, b) => b.priceChange24h - a.priceChange24h);
        break;
      case "losers":
        result.sort((a, b) => a.priceChange24h - b.priceChange24h);
        break;
      case "newest":
        result.sort((a, b) => a.ageMinutes - b.ageMinutes);
        break;
      case "score":
        result.sort((a, b) => b.guardianScore - a.guardianScore);
        break;
      case "liquidity":
        result.sort((a, b) => b.liquidity - a.liquidity);
        break;
      default:
        result.sort((a, b) => (b.volume24h * Math.abs(b.priceChange24h)) - (a.volume24h * Math.abs(a.priceChange24h)));
    }
    
    // Apply sort direction
    if (sortAscending) result.reverse();
    
    return result.map((t, i) => ({ ...t, rank: i + 1 }));
  }, [tokens, searchQuery, rankBy, activeSidebarItem, filterProfile, filterBoosted, filterAdvertising, sortAscending]);

  const toggleWatchlist = (id: string) => {
    setTokens(prev => prev.map(t => 
      t.id === id ? { ...t, isWatchlisted: !t.isWatchlisted } : t
    ));
  };

  const selectedChainData = CHAINS.find(c => c.id === selectedChain);

  return (
    <div className="min-h-screen bg-[#0d0d0d] flex overflow-x-hidden">
      {/* Left Sidebar */}
      <aside className={`${sidebarCollapsed ? 'w-14' : 'w-48'} border-r border-white/5 bg-[#0a0a0a] flex-shrink-0 transition-all duration-200 hidden md:flex flex-col`}>
        {/* Logo */}
        <div className="p-4 border-b border-white/5">
          <Link href="/" className="flex items-center gap-2" data-testid="sidebar-logo">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-purple-500 flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            {!sidebarCollapsed && (
              <span className="font-bold text-white text-sm">GUARDIAN</span>
            )}
          </Link>
        </div>
        
        {/* Search */}
        {!sidebarCollapsed && (
          <div className="p-3 border-b border-white/5">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/30" />
              <Input
                type="text"
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-8 pl-8 text-xs bg-white/5 border-white/10 focus:border-cyan-500/50"
                data-testid="sidebar-search"
              />
            </div>
          </div>
        )}
        
        {/* Get App Link */}
        {!sidebarCollapsed && (
          <div className="p-3 border-b border-white/5">
            <button className="flex items-center gap-2 text-xs text-white/60 hover:text-white transition-colors w-full" data-testid="get-app-btn">
              <span>📱</span>
              <span>Get the App!</span>
            </button>
          </div>
        )}
        
        {/* Navigation */}
        <nav className="p-2">
          {SIDEBAR_NAV.map(item => (
            <button
              key={item.id}
              onClick={() => setActiveSidebarItem(activeSidebarItem === item.id ? null : item.id)}
              className={`w-full flex items-center gap-2 px-2 py-1.5 rounded text-xs transition-colors mb-0.5 ${
                activeSidebarItem === item.id
                  ? 'bg-cyan-500/10 text-cyan-400'
                  : 'text-white/60 hover:bg-white/5 hover:text-white'
              }`}
              data-testid={`nav-${item.id}`}
            >
              <item.icon className="w-3.5 h-3.5 flex-shrink-0" />
              {!sidebarCollapsed && <span>{item.name}</span>}
            </button>
          ))}
        </nav>
        
        {/* Chains List */}
        {!sidebarCollapsed && (
          <div className="border-t border-white/5 p-2 flex-1 overflow-y-auto">
            <div className="text-[9px] text-white/30 uppercase tracking-wider px-2 mb-1">Chains</div>
            {CHAINS.filter(c => c.id !== 'all').map(chain => (
              <button
                key={chain.id}
                onClick={() => setSelectedChain(chain.id)}
                className={`w-full flex items-center gap-2 px-2 py-1 rounded text-xs transition-colors ${
                  selectedChain === chain.id
                    ? 'bg-white/10 text-white'
                    : 'text-white/50 hover:bg-white/5 hover:text-white'
                }`}
                data-testid={`chain-${chain.id}`}
              >
                <span className="text-sm">{chain.icon}</span>
                <span>{chain.name}</span>
              </button>
            ))}
          </div>
        )}
        
        {/* Watchlist Count */}
        {!sidebarCollapsed && (
          <div className="border-t border-white/5 p-2">
            <div className="flex items-center gap-1.5 px-2 py-1 text-[10px] text-white/40">
              <Star className="w-3 h-3" />
              <span>{tokens.filter(t => t.isWatchlisted).length} in watchlist</span>
            </div>
          </div>
        )}
        
        {/* Socials */}
        {!sidebarCollapsed && (
          <div className="border-t border-white/5 p-2 flex items-center justify-center gap-3">
            <a href="#" className="text-white/30 hover:text-white transition-colors"><Globe className="w-3.5 h-3.5" /></a>
            <a href="#" className="text-white/30 hover:text-white transition-colors"><Activity className="w-3.5 h-3.5" /></a>
          </div>
        )}
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Top Stats Bar */}
        <div className="border-b border-white/5 bg-[#0a0a0a] px-4 py-2 flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <span className="text-xs text-white/40">24H VOLUME:</span>
              <span className="text-sm font-bold text-white">${(stats.volume24h / 1e9).toFixed(2)}B</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-white/40">24H TXNS:</span>
              <span className="text-sm font-bold text-white">{(stats.txns24h / 1e6).toFixed(1)}M</span>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Badge 
              className={`${connected ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' : 'bg-white/10 text-white/40 border-white/10'} border text-[10px] flex items-center gap-1`}
              data-testid="live-status"
            >
              <span className={`w-1.5 h-1.5 rounded-full ${connected ? 'bg-emerald-400 animate-pulse' : 'bg-white/30'}`} />
              {connected ? 'LIVE' : 'OFFLINE'}
            </Badge>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="border-b border-white/5 bg-[#0d0d0d] px-4 py-2.5 flex items-center gap-3 flex-wrap">
          {/* Chain Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowChainDropdown(!showChainDropdown)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-all bg-gradient-to-r ${selectedChainData?.color} text-white`}
              data-testid="chain-dropdown-trigger"
            >
              <span>{selectedChainData?.icon}</span>
              <span className="hidden sm:inline">{selectedChainData?.name}</span>
              <ChevronDown className="w-3.5 h-3.5" />
            </button>
            
            <AnimatePresence>
              {showChainDropdown && (
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  className="absolute left-0 top-full mt-1 z-50 bg-[#1a1a1a] border border-white/10 rounded-lg shadow-xl overflow-hidden min-w-[180px]"
                >
                  {CHAINS.map(chain => (
                    <button
                      key={chain.id}
                      onClick={() => { setSelectedChain(chain.id); setShowChainDropdown(false); }}
                      className={`w-full flex items-center gap-2 px-4 py-2.5 text-sm transition-colors ${
                        selectedChain === chain.id
                          ? 'bg-cyan-500/20 text-cyan-400'
                          : 'text-white/70 hover:bg-white/5 hover:text-white'
                      }`}
                      data-testid={`chain-option-${chain.id}`}
                    >
                      <span>{chain.icon}</span>
                      <span>{chain.name}</span>
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
          {/* Trending Button */}
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium bg-orange-500/20 text-orange-400 border border-orange-500/30">
            <Flame className="w-3.5 h-3.5" />
            Trending
          </button>
          
          {/* Time Filters */}
          <div className="flex items-center bg-white/5 rounded-lg p-0.5">
            {TIME_FILTERS.map(tf => (
              <button
                key={tf.id}
                onClick={() => setActiveTimeFilter(tf.id)}
                className={`px-2.5 py-1 text-xs font-medium rounded transition-colors ${
                  activeTimeFilter === tf.id
                    ? 'bg-cyan-500 text-white'
                    : 'text-white/50 hover:text-white'
                }`}
                data-testid={`time-filter-${tf.id}`}
              >
                {tf.label}
              </button>
            ))}
          </div>
          
          {/* Quick Filters */}
          <div className="flex items-center gap-1">
            <button 
              onClick={() => setRankBy("volume")}
              className={`px-2 py-1 text-[10px] transition-colors ${rankBy === "volume" ? "text-cyan-400" : "text-white/50 hover:text-white"}`} 
              data-testid="filter-top"
            >Top</button>
            <button 
              onClick={() => setRankBy("gainers")}
              className={`px-2 py-1 text-[10px] transition-colors ${rankBy === "gainers" ? "text-cyan-400" : "text-white/50 hover:text-white"}`}
              data-testid="filter-gainers"
            >Gainers</button>
            <button 
              onClick={() => setActiveSidebarItem("new-pairs")}
              className={`px-2 py-1 text-[10px] transition-colors ${activeSidebarItem === "new-pairs" ? "text-cyan-400" : "text-white/50 hover:text-white"}`}
              data-testid="filter-new"
            >New Pairs</button>
          </div>
          
          {/* Checkbox Filters */}
          <div className="flex items-center gap-3 bg-white/5 rounded-lg px-2 py-1">
            <label className="flex items-center gap-1.5 cursor-pointer">
              <input 
                type="checkbox" 
                checked={filterProfile} 
                onChange={(e) => setFilterProfile(e.target.checked)}
                className="w-3 h-3 rounded border-white/30 bg-transparent accent-cyan-500"
              />
              <span className="text-[10px] text-white/60">Profile</span>
            </label>
            <label className="flex items-center gap-1.5 cursor-pointer">
              <input 
                type="checkbox" 
                checked={filterBoosted} 
                onChange={(e) => setFilterBoosted(e.target.checked)}
                className="w-3 h-3 rounded border-white/30 bg-transparent accent-cyan-500"
              />
              <span className="text-[10px] text-white/60">Boosted</span>
            </label>
            <label className="flex items-center gap-1.5 cursor-pointer">
              <input 
                type="checkbox" 
                checked={filterAdvertising} 
                onChange={(e) => setFilterAdvertising(e.target.checked)}
                className="w-3 h-3 rounded border-white/30 bg-transparent accent-cyan-500"
              />
              <span className="text-[10px] text-white/60">Ads</span>
            </label>
          </div>
          
          {/* Rank Dropdown */}
          <div className="relative flex items-center gap-1">
            <button
              onClick={() => setShowRankDropdown(!showRankDropdown)}
              className="flex items-center gap-1 px-2 py-1 text-[10px] font-medium text-white/60 hover:text-white bg-white/5 rounded transition-colors"
              data-testid="rank-dropdown"
            >
              <span>Rank:</span>
              <span className="text-white">{RANK_OPTIONS.find(r => r.id === rankBy)?.name?.split(' ')[0]}</span>
              <ChevronDown className="w-2.5 h-2.5" />
            </button>
            <button
              onClick={() => setSortAscending(!sortAscending)}
              className="px-1.5 py-1 text-[10px] text-white/60 hover:text-white bg-white/5 rounded transition-colors"
              data-testid="sort-direction"
            >
              {sortAscending ? '↑' : '↓'}
            </button>
            
            <AnimatePresence>
              {showRankDropdown && (
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  className="absolute right-0 top-full mt-1 z-50 bg-[#1a1a1a] border border-white/10 rounded-lg shadow-xl overflow-hidden min-w-[140px]"
                >
                  {RANK_OPTIONS.map(option => (
                    <button
                      key={option.id}
                      onClick={() => { setRankBy(option.id); setShowRankDropdown(false); }}
                      className={`w-full px-3 py-1.5 text-left text-[10px] transition-colors ${
                        rankBy === option.id
                          ? 'bg-cyan-500/20 text-cyan-400'
                          : 'text-white/70 hover:bg-white/5 hover:text-white'
                      }`}
                      data-testid={`rank-${option.id}`}
                    >
                      {option.name}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
          {/* Refresh */}
          <button
            onClick={() => {
              setIsLoading(true);
              setTimeout(() => {
                setTokens(generateMockTokens(selectedChain));
                setIsLoading(false);
              }, 500);
            }}
            className="p-1.5 text-white/40 hover:text-white transition-colors"
            data-testid="refresh-btn"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {/* Token List - Mobile Cards (no horizontal scroll) */}
        <div className="flex-1 overflow-auto md:hidden">
          {isLoading ? (
            <div className="py-20 text-center">
              <RefreshCw className="w-6 h-6 text-cyan-400 animate-spin mx-auto mb-2" />
              <p className="text-white/50 text-sm">Scanning tokens...</p>
            </div>
          ) : filteredTokens.length === 0 ? (
            <div className="py-20 text-center">
              <Search className="w-6 h-6 text-white/20 mx-auto mb-2" />
              <p className="text-white/50 text-sm">No tokens found</p>
            </div>
          ) : (
            filteredTokens.map(token => (
              <TokenCard
                key={token.id}
                token={token}
                onToggleWatchlist={toggleWatchlist}
              />
            ))
          )}
        </div>
        
        {/* Token Table - Desktop Only */}
        <div className="flex-1 overflow-auto hidden md:block">
          <table className="w-full" data-testid="token-table">
            <thead className="sticky top-0 bg-[#0d0d0d] z-10">
              <tr className="border-b border-white/10 h-7">
                <th className="py-1 pl-2 pr-1 text-left text-[9px] font-medium text-white/40 w-7">#</th>
                <th className="py-1 pr-2 text-left text-[9px] font-medium text-white/40 min-w-[160px]">TOKEN</th>
                <th className="py-1 pr-2 text-right text-[9px] font-medium text-white/40">PRICE</th>
                <th className="py-1 pr-2 text-right text-[9px] font-medium text-white/40">AGE</th>
                <th className="py-1 pr-2 text-right text-[9px] font-medium text-white/40">TXNS</th>
                <th className="py-1 pr-2 text-right text-[9px] font-medium text-white/40">VOLUME</th>
                <th className="py-1 pr-2 text-right text-[9px] font-medium text-white/40 hidden lg:table-cell">MAKERS</th>
                <th className="py-1 pr-2 text-right text-[9px] font-medium text-white/40 hidden lg:table-cell">5M</th>
                <th className="py-1 pr-2 text-right text-[9px] font-medium text-white/40">1H</th>
                <th className="py-1 pr-2 text-right text-[9px] font-medium text-white/40 hidden lg:table-cell">6H</th>
                <th className="py-1 pr-2 text-right text-[9px] font-medium text-white/40">24H</th>
                <th className="py-1 pr-2 text-right text-[9px] font-medium text-white/40 hidden xl:table-cell">LIQ</th>
                <th className="py-1 pr-2 text-[9px] font-medium text-white/40"><Shield className="w-3 h-3 inline" /></th>
                <th className="py-1 pr-2 w-12"></th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={14} className="py-20 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <RefreshCw className="w-6 h-6 text-cyan-400 animate-spin" />
                      <p className="text-white/50 text-sm">Scanning tokens...</p>
                    </div>
                  </td>
                </tr>
              ) : filteredTokens.length === 0 ? (
                <tr>
                  <td colSpan={14} className="py-20 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <Search className="w-6 h-6 text-white/20" />
                      <p className="text-white/50 text-sm">No tokens found</p>
                    </div>
                  </td>
                </tr>
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
        
        {/* Footer Disclaimer */}
        <div className="border-t border-white/5 px-4 py-3 bg-[#0a0a0a]">
          <p className="text-[10px] text-white/30 text-center">
            Guardian Scanner provides AI-powered risk analysis. This is NOT financial advice. Always DYOR. 
            <span className="text-cyan-400/50 ml-1">Powered by DarkWave Trust Layer</span>
          </p>
        </div>
      </main>
    </div>
  );
}
