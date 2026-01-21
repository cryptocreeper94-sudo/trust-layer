import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "wouter";
import { GlassCard } from "@/components/glass-card";
import { Button } from "@/components/ui/button";
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
  Info,
  Filter,
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
  Wallet,
  HelpCircle,
  Flame,
  Skull,
  CheckCircle,
  XCircle,
  Lock,
  Unlock,
  Bot,
  Activity,
  Globe,
  BookOpen
} from "lucide-react";

const CHAINS = [
  { id: "solana", name: "Solana", icon: "◎", color: "from-purple-500 to-green-400" },
  { id: "ethereum", name: "Ethereum", icon: "Ξ", color: "from-blue-500 to-purple-500" },
  { id: "base", name: "Base", icon: "🔵", color: "from-blue-400 to-blue-600" },
  { id: "bsc", name: "BSC", icon: "🟡", color: "from-yellow-400 to-yellow-600" },
  { id: "arbitrum", name: "Arbitrum", icon: "🔷", color: "from-blue-400 to-cyan-500" },
  { id: "polygon", name: "Polygon", icon: "🟣", color: "from-purple-500 to-purple-700" },
  { id: "avalanche", name: "Avalanche", icon: "🔺", color: "from-red-500 to-red-700" },
  { id: "fantom", name: "Fantom", icon: "👻", color: "from-blue-600 to-indigo-600" },
  { id: "optimism", name: "Optimism", icon: "🔴", color: "from-red-400 to-red-600" },
  { id: "zksync", name: "zkSync", icon: "⚡", color: "from-violet-500 to-purple-600" },
  { id: "cronos", name: "Cronos", icon: "🌀", color: "from-blue-800 to-indigo-900" },
  { id: "tron", name: "Tron", icon: "💎", color: "from-red-600 to-red-800" },
  { id: "darkwave", name: "DarkWave", icon: "◆", color: "from-cyan-400 to-purple-500" },
];

const FILTER_TABS = [
  { id: "verified", name: "Verified", icon: Shield },
  { id: "all", name: "All Tokens", icon: Globe },
  { id: "trending", name: "Trending", icon: Flame },
  { id: "new", name: "New", icon: Zap },
  { id: "watchlist", name: "Watchlist", icon: Star },
];

const SORT_OPTIONS = [
  { id: "trending", name: "Trending" },
  { id: "volume", name: "Top Volume" },
  { id: "marketCap", name: "Market Cap" },
  { id: "gainers", name: "Top Gainers" },
  { id: "losers", name: "Top Losers" },
  { id: "score", name: "Guardian Score" },
  { id: "newest", name: "Newest" },
];

const GLOSSARY: Record<string, string> = {
  "Market Cap": "Total value of all tokens in circulation. Calculated as price × total supply.",
  "Liquidity": "Amount of funds available for trading. Higher liquidity = easier to buy/sell without big price impact.",
  "Volume (24h)": "Total trading volume in the last 24 hours. Shows how actively the token is being traded.",
  "Holders": "Number of unique wallets that hold this token.",
  "Age": "Time since the token was created. Newer tokens are generally higher risk.",
  "Guardian Score": "Our AI-powered risk assessment from 0-100. Higher = safer. Based on liquidity, holders, creator history, and contract analysis.",
  "Whale Concentration": "Percentage held by top 10 wallets. High concentration = higher dump risk.",
  "Liquidity Locked": "Funds locked in a smart contract that can't be withdrawn. Prevents rug pulls.",
  "Honeypot": "A scam where you can buy but can't sell. Our scanner detects these.",
  "Mint Authority": "Ability to create more tokens. If active, supply can be inflated at any time.",
  "Freeze Authority": "Ability to freeze token transfers. If active, your tokens could be locked.",
  "Bot Activity": "Percentage of trades from bots vs humans. High bot activity can indicate manipulation.",
  "Bundle Buy": "Multiple coordinated buys in same block. Often indicates insider trading or manipulation.",
  "Dev Wallet": "The wallet that created the token. Tracking if they're selling is important.",
};

interface Token {
  id: string;
  name: string;
  symbol: string;
  logo: string | null;
  contractAddress: string;
  pairAddress: string;
  price: number;
  priceChange5m: number;
  priceChange1h: number;
  priceChange6h: number;
  priceChange24h: number;
  marketCap: number;
  volume24h: number;
  liquidity: number;
  holders: number;
  age: string;
  ageMinutes: number;
  txns24h: number;
  buys24h: number;
  sells24h: number;
  guardianScore: number;
  whaleConcentration: number;
  liquidityLocked: boolean;
  lockDuration: string | null;
  honeypotRisk: boolean;
  mintAuthority: boolean;
  freezeAuthority: boolean;
  botActivity: number;
  bundleBuy: number;
  creatorVerified: boolean;
  creatorBadge: "new" | "verified" | "trusted" | "certified" | "flagged";
  creatorName: string | null;
  chain: string;
  isWatchlisted: boolean;
}

function generateMockTokens(chain: string): Token[] {
  const names = [
    { name: "Bonk", symbol: "BONK" },
    { name: "dogwifhat", symbol: "WIF" },
    { name: "Pepe", symbol: "PEPE" },
    { name: "Shiba Inu", symbol: "SHIB" },
    { name: "Floki", symbol: "FLOKI" },
    { name: "Brett", symbol: "BRETT" },
    { name: "Popcat", symbol: "POPCAT" },
    { name: "Mog Coin", symbol: "MOG" },
    { name: "Book of Meme", symbol: "BOME" },
    { name: "Cat in a dogs world", symbol: "MEW" },
    { name: "Gigachad", symbol: "GIGA" },
    { name: "Ponke", symbol: "PONKE" },
    { name: "Wen", symbol: "WEN" },
    { name: "Slerf", symbol: "SLERF" },
    { name: "Jeo Boden", symbol: "BODEN" },
  ];

  return names.map((token, i) => {
    const score = Math.floor(Math.random() * 100);
    const isNew = Math.random() > 0.7;
    const badges: Array<"new" | "verified" | "trusted" | "certified" | "flagged"> = ["new", "verified", "trusted", "certified", "flagged"];
    
    const chars = '0123456789abcdef';
    const genAddr = () => Array.from({ length: 40 }, () => chars[Math.floor(Math.random() * 16)]).join('');
    
    return {
      id: `${chain}-${token.symbol.toLowerCase()}-${i}`,
      name: token.name,
      symbol: token.symbol,
      logo: null,
      contractAddress: `0x${genAddr()}`,
      pairAddress: `0x${genAddr()}`,
      price: Math.random() * (Math.random() > 0.5 ? 1 : 0.0001),
      priceChange5m: (Math.random() - 0.5) * 20,
      priceChange1h: (Math.random() - 0.5) * 30,
      priceChange6h: (Math.random() - 0.5) * 50,
      priceChange24h: (Math.random() - 0.5) * 100,
      marketCap: Math.random() * 1000000000,
      volume24h: Math.random() * 50000000,
      liquidity: Math.random() * 5000000,
      holders: Math.floor(Math.random() * 50000),
      age: isNew ? `${Math.floor(Math.random() * 60)}m` : `${Math.floor(Math.random() * 30)}d`,
      ageMinutes: isNew ? Math.floor(Math.random() * 60) : Math.floor(Math.random() * 43200),
      txns24h: Math.floor(Math.random() * 10000),
      buys24h: Math.floor(Math.random() * 5000),
      sells24h: Math.floor(Math.random() * 5000),
      guardianScore: score,
      whaleConcentration: Math.random() * 80,
      liquidityLocked: Math.random() > 0.4,
      lockDuration: Math.random() > 0.5 ? `${Math.floor(Math.random() * 365)}d` : null,
      honeypotRisk: Math.random() > 0.9,
      mintAuthority: Math.random() > 0.7,
      freezeAuthority: Math.random() > 0.8,
      botActivity: Math.random() * 30,
      bundleBuy: Math.random() * 20,
      creatorVerified: score > 50,
      creatorBadge: badges[Math.floor(Math.random() * (score > 70 ? 4 : 5))],
      creatorName: Math.random() > 0.5 ? `@creator${i}` : null,
      chain,
      isWatchlisted: Math.random() > 0.8,
    };
  });
}

function formatPrice(price: number): string {
  if (price < 0.00001) return price.toExponential(2);
  if (price < 0.01) return price.toFixed(6);
  if (price < 1) return price.toFixed(4);
  if (price < 1000) return price.toFixed(2);
  return price.toLocaleString(undefined, { maximumFractionDigits: 2 });
}

function formatNumber(num: number): string {
  if (num >= 1e9) return `${(num / 1e9).toFixed(2)}B`;
  if (num >= 1e6) return `${(num / 1e6).toFixed(2)}M`;
  if (num >= 1e3) return `${(num / 1e3).toFixed(1)}K`;
  return num.toFixed(0);
}

function getScoreColor(score: number): string {
  if (score >= 80) return "text-emerald-400";
  if (score >= 50) return "text-yellow-400";
  if (score >= 20) return "text-orange-400";
  return "text-red-400";
}

function getScoreBg(score: number): string {
  if (score >= 80) return "bg-emerald-500/20 border-emerald-500/30";
  if (score >= 50) return "bg-yellow-500/20 border-yellow-500/30";
  if (score >= 20) return "bg-orange-500/20 border-orange-500/30";
  return "bg-red-500/20 border-red-500/30";
}

function getScoreLabel(score: number): string {
  if (score >= 80) return "Low Risk";
  if (score >= 50) return "Medium";
  if (score >= 20) return "High Risk";
  return "Extreme";
}

function CreatorBadge({ badge }: { badge: Token["creatorBadge"] }) {
  const config = {
    new: { icon: Zap, label: "New Creator", className: "bg-slate-500/20 text-slate-400 border-slate-500/30" },
    verified: { icon: CheckCircle, label: "Verified", className: "bg-blue-500/20 text-blue-400 border-blue-500/30" },
    trusted: { icon: Star, label: "Trusted", className: "bg-purple-500/20 text-purple-400 border-purple-500/30" },
    certified: { icon: Shield, label: "Certified", className: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30" },
    flagged: { icon: AlertTriangle, label: "Flagged", className: "bg-red-500/20 text-red-400 border-red-500/30" },
  };
  
  const { icon: Icon, label, className } = config[badge];
  
  return (
    <Badge className={`${className} border text-[10px] px-1.5 py-0`}>
      <Icon className="w-3 h-3 mr-0.5" />
      {label}
    </Badge>
  );
}

function GlossaryTooltip({ term, children }: { term: string; children: React.ReactNode }) {
  const definition = GLOSSARY[term];
  if (!definition) return <>{children}</>;
  
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <span className="cursor-help border-b border-dotted border-white/30 inline-flex items-center gap-1">
            {children}
            <HelpCircle className="w-3 h-3 text-white/30" />
          </span>
        </TooltipTrigger>
        <TooltipContent side="top" className="max-w-[280px] bg-slate-900 border-white/10">
          <p className="text-xs text-white/90">{definition}</p>
          <Link href="/learn" className="text-[10px] text-cyan-400 hover:underline mt-1 block" data-testid="link-glossary-learn">
            Learn more →
          </Link>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

function TokenRow({ token, onToggleWatchlist }: { token: Token; onToggleWatchlist: (id: string) => void }) {
  const priceUp = token.priceChange24h >= 0;
  
  return (
    <motion.tr
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="border-b border-white/5 hover:bg-white/5 transition-colors group"
      data-testid={`token-row-${token.id}`}
    >
      <td className="py-3 pl-3 pr-2">
        <button
          onClick={(e) => { e.stopPropagation(); onToggleWatchlist(token.id); }}
          className="text-white/30 hover:text-yellow-400 transition-colors"
          data-testid={`watchlist-btn-${token.id}`}
        >
          {token.isWatchlisted ? (
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
          ) : (
            <StarOff className="w-4 h-4" />
          )}
        </button>
      </td>
      
      <td className="py-3 pr-4">
        <Link href={`/guardian-scanner/${token.chain}/${token.symbol.toLowerCase()}`} data-testid={`token-link-${token.id}`}>
          <div className="flex items-center gap-3 cursor-pointer">
            {token.logo ? (
              <img src={token.logo} alt={token.symbol} className="w-8 h-8 rounded-full" />
            ) : (
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-purple-500 flex items-center justify-center text-xs font-bold text-white">
                {token.symbol.slice(0, 2)}
              </div>
            )}
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-white group-hover:text-cyan-400 transition-colors">
                  {token.symbol}
                </span>
                {token.honeypotRisk && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <Skull className="w-3.5 h-3.5 text-red-400" />
                      </TooltipTrigger>
                      <TooltipContent className="bg-red-900/90 border-red-500/50">
                        <p className="text-xs text-white">Honeypot Risk Detected!</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
              </div>
              <span className="text-xs text-white/40">{token.name}</span>
            </div>
          </div>
        </Link>
      </td>
      
      <td className="py-3 pr-4 text-right">
        <span className="text-sm font-medium text-white">${formatPrice(token.price)}</span>
      </td>
      
      <td className="py-3 pr-4 text-right hidden sm:table-cell">
        <span className={`text-xs font-medium ${token.priceChange5m >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
          {token.priceChange5m >= 0 ? '+' : ''}{token.priceChange5m.toFixed(1)}%
        </span>
      </td>
      
      <td className="py-3 pr-4 text-right hidden md:table-cell">
        <span className={`text-xs font-medium ${token.priceChange1h >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
          {token.priceChange1h >= 0 ? '+' : ''}{token.priceChange1h.toFixed(1)}%
        </span>
      </td>
      
      <td className="py-3 pr-4 text-right hidden lg:table-cell">
        <span className={`text-xs font-medium ${token.priceChange6h >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
          {token.priceChange6h >= 0 ? '+' : ''}{token.priceChange6h.toFixed(1)}%
        </span>
      </td>
      
      <td className="py-3 pr-4 text-right">
        <span className={`text-sm font-medium ${priceUp ? 'text-emerald-400' : 'text-red-400'}`}>
          {priceUp ? '+' : ''}{token.priceChange24h.toFixed(1)}%
        </span>
      </td>
      
      <td className="py-3 pr-4 text-right hidden md:table-cell">
        <span className="text-xs text-white/70">${formatNumber(token.volume24h)}</span>
      </td>
      
      <td className="py-3 pr-4 hidden lg:table-cell">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-1 text-[10px]">
            <span className="text-emerald-400">{token.buys24h}</span>
            <span className="text-white/30">/</span>
            <span className="text-red-400">{token.sells24h}</span>
          </div>
          <div className="w-16 h-1.5 rounded-full bg-white/10 overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full"
              style={{ width: `${(token.buys24h / (token.buys24h + token.sells24h)) * 100}%` }}
            />
          </div>
        </div>
      </td>
      
      <td className="py-3 pr-4 text-right hidden lg:table-cell">
        <div className="flex items-center justify-end gap-1">
          <span className="text-xs text-white/70">${formatNumber(token.liquidity)}</span>
          {token.liquidityLocked && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Lock className="w-3 h-3 text-emerald-400" />
                </TooltipTrigger>
                <TooltipContent className="bg-slate-900 border-white/10">
                  <p className="text-xs">Locked for {token.lockDuration || 'unknown'}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
      </td>
      
      <td className="py-3 pr-4 text-right hidden xl:table-cell">
        <span className="text-xs text-white/70">${formatNumber(token.marketCap)}</span>
      </td>
      
      <td className="py-3 pr-4 text-right hidden xl:table-cell">
        <span className="text-xs text-white/50">{token.age}</span>
      </td>
      
      <td className="py-3 pr-4">
        <div className="flex items-center justify-end gap-2">
          <Badge className={`${getScoreBg(token.guardianScore)} border ${getScoreColor(token.guardianScore)} text-xs px-2 py-0.5 font-bold`}>
            {token.guardianScore}
          </Badge>
        </div>
      </td>
      
      <td className="py-3 pr-3 hidden sm:table-cell">
        <CreatorBadge badge={token.creatorBadge} />
      </td>
    </motion.tr>
  );
}

export default function GuardianScanner() {
  const [selectedChain, setSelectedChain] = useState("solana");
  const [activeTab, setActiveTab] = useState("verified");
  const [sortBy, setSortBy] = useState("trending");
  const [searchQuery, setSearchQuery] = useState("");
  const [tokens, setTokens] = useState<Token[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showSortDropdown, setShowSortDropdown] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setTokens(generateMockTokens(selectedChain));
      setIsLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, [selectedChain]);

  const filteredTokens = useMemo(() => {
    let result = [...tokens];
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase().trim();
      result = result.filter(t => 
        t.name.toLowerCase().includes(query) || 
        t.symbol.toLowerCase().includes(query) ||
        t.contractAddress.toLowerCase().includes(query) ||
        t.pairAddress.toLowerCase().includes(query)
      );
    }
    
    switch (activeTab) {
      case "verified":
        result = result.filter(t => t.guardianScore >= 50);
        break;
      case "trending":
        result = result.sort((a, b) => Math.abs(b.priceChange24h) - Math.abs(a.priceChange24h));
        break;
      case "new":
        result = result.filter(t => t.ageMinutes < 1440);
        break;
      case "watchlist":
        result = result.filter(t => t.isWatchlisted);
        break;
    }
    
    switch (sortBy) {
      case "volume":
        result.sort((a, b) => b.volume24h - a.volume24h);
        break;
      case "marketCap":
        result.sort((a, b) => b.marketCap - a.marketCap);
        break;
      case "gainers":
        result.sort((a, b) => b.priceChange24h - a.priceChange24h);
        break;
      case "losers":
        result.sort((a, b) => a.priceChange24h - b.priceChange24h);
        break;
      case "score":
        result.sort((a, b) => b.guardianScore - a.guardianScore);
        break;
      case "newest":
        result.sort((a, b) => a.ageMinutes - b.ageMinutes);
        break;
    }
    
    return result;
  }, [tokens, searchQuery, activeTab, sortBy]);

  const toggleWatchlist = (id: string) => {
    setTokens(prev => prev.map(t => 
      t.id === id ? { ...t, isWatchlisted: !t.isWatchlisted } : t
    ));
  };

  return (
    <div className="min-h-screen bg-slate-950 pt-20 pb-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Guardian Scanner
              </h1>
              <p className="text-white/50 text-sm mt-1">
                AI-powered token analysis with trust scores
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <Link href="/learn">
                <Button variant="outline" size="sm" className="border-white/10 hover:border-cyan-500/50" data-testid="learn-link">
                  <BookOpen className="w-4 h-4 mr-2" />
                  Learn
                </Button>
              </Link>
              <Button 
                variant="outline" 
                size="sm" 
                className="border-white/10 hover:border-cyan-500/50"
                onClick={() => {
                  setIsLoading(true);
                  setTimeout(() => {
                    setTokens(generateMockTokens(selectedChain));
                    setIsLoading(false);
                  }, 500);
                }}
                data-testid="refresh-btn"
              >
                <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              </Button>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mb-6">
            {CHAINS.map(chain => (
              <button
                key={chain.id}
                onClick={() => setSelectedChain(chain.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  selectedChain === chain.id
                    ? `bg-gradient-to-r ${chain.color} text-white shadow-lg`
                    : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white'
                }`}
                data-testid={`chain-${chain.id}`}
              >
                <span className="mr-2">{chain.icon}</span>
                {chain.name}
              </button>
            ))}
          </div>

          <GlassCard>
            <div className="p-4">
              <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                  <Input
                    type="text"
                    placeholder="Search tokens..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 bg-white/5 border-white/10 focus:border-cyan-500/50"
                    data-testid="search-input"
                  />
                </div>
                
                <div className="flex flex-wrap items-center gap-2">
                  {FILTER_TABS.map(tab => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                        activeTab === tab.id
                          ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                          : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white border border-transparent'
                      }`}
                      data-testid={`tab-${tab.id}`}
                    >
                      <tab.icon className="w-3.5 h-3.5" />
                      {tab.name}
                    </button>
                  ))}
                  
                  <div className="relative ml-2">
                    <button
                      onClick={() => setShowSortDropdown(!showSortDropdown)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-white/5 text-white/60 hover:bg-white/10 hover:text-white border border-transparent transition-all"
                      data-testid="sort-dropdown"
                    >
                      <Filter className="w-3.5 h-3.5" />
                      {SORT_OPTIONS.find(s => s.id === sortBy)?.name}
                      <ChevronDown className="w-3 h-3" />
                    </button>
                    
                    <AnimatePresence>
                      {showSortDropdown && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="absolute right-0 top-full mt-2 z-50 bg-slate-900 border border-white/10 rounded-lg shadow-xl overflow-hidden min-w-[150px]"
                        >
                          {SORT_OPTIONS.map(option => (
                            <button
                              key={option.id}
                              onClick={() => { setSortBy(option.id); setShowSortDropdown(false); }}
                              className={`w-full px-4 py-2 text-left text-xs transition-colors ${
                                sortBy === option.id
                                  ? 'bg-cyan-500/20 text-cyan-400'
                                  : 'text-white/70 hover:bg-white/5 hover:text-white'
                              }`}
                              data-testid={`sort-${option.id}`}
                            >
                              {option.name}
                            </button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </div>
            </div>
          </GlassCard>
        </motion.div>

        {activeTab === "all" && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <GlassCard>
              <div className="p-4 flex items-center gap-3 bg-gradient-to-r from-orange-500/10 to-red-500/10 border-l-4 border-orange-500">
                <AlertTriangle className="w-5 h-5 text-orange-400 shrink-0" />
                <div>
                  <p className="text-sm font-medium text-orange-400">Community Arena - Unverified Tokens</p>
                  <p className="text-xs text-white/50">
                    This section includes unverified tokens with higher risk. Always do your own research. 
                    <GlossaryTooltip term="Guardian Score">
                      <span className="text-cyan-400 ml-1">Guardian Scores</span>
                    </GlossaryTooltip> help assess risk but don't guarantee safety.
                  </p>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <GlassCard glow>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[800px]" data-testid="token-table">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="py-3 pl-3 pr-2 text-left"></th>
                    <th className="py-3 pr-4 text-left text-xs font-medium text-white/50 uppercase tracking-wider">Token</th>
                    <th className="py-3 pr-4 text-right text-xs font-medium text-white/50 uppercase tracking-wider">Price</th>
                    <th className="py-3 pr-4 text-right text-xs font-medium text-white/50 uppercase tracking-wider hidden sm:table-cell">5m</th>
                    <th className="py-3 pr-4 text-right text-xs font-medium text-white/50 uppercase tracking-wider hidden md:table-cell">1h</th>
                    <th className="py-3 pr-4 text-right text-xs font-medium text-white/50 uppercase tracking-wider hidden lg:table-cell">6h</th>
                    <th className="py-3 pr-4 text-right text-xs font-medium text-white/50 uppercase tracking-wider">24h</th>
                    <th className="py-3 pr-4 text-right text-xs font-medium text-white/50 uppercase tracking-wider hidden md:table-cell">
                      <GlossaryTooltip term="Volume (24h)">Vol</GlossaryTooltip>
                    </th>
                    <th className="py-3 pr-4 text-xs font-medium text-white/50 uppercase tracking-wider hidden lg:table-cell">
                      Buys/Sells
                    </th>
                    <th className="py-3 pr-4 text-right text-xs font-medium text-white/50 uppercase tracking-wider hidden lg:table-cell">
                      <GlossaryTooltip term="Liquidity">Liq</GlossaryTooltip>
                    </th>
                    <th className="py-3 pr-4 text-right text-xs font-medium text-white/50 uppercase tracking-wider hidden xl:table-cell">
                      <GlossaryTooltip term="Market Cap">MCap</GlossaryTooltip>
                    </th>
                    <th className="py-3 pr-4 text-right text-xs font-medium text-white/50 uppercase tracking-wider hidden xl:table-cell">
                      <GlossaryTooltip term="Age">Age</GlossaryTooltip>
                    </th>
                    <th className="py-3 pr-4 text-right text-xs font-medium text-white/50 uppercase tracking-wider">
                      <GlossaryTooltip term="Guardian Score">Score</GlossaryTooltip>
                    </th>
                    <th className="py-3 pr-3 text-xs font-medium text-white/50 uppercase tracking-wider hidden sm:table-cell">Creator</th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? (
                    <tr>
                      <td colSpan={14} className="py-20 text-center">
                        <div className="flex flex-col items-center gap-3">
                          <RefreshCw className="w-8 h-8 text-cyan-400 animate-spin" />
                          <p className="text-white/50 text-sm">Loading tokens...</p>
                        </div>
                      </td>
                    </tr>
                  ) : filteredTokens.length === 0 ? (
                    <tr>
                      <td colSpan={14} className="py-20 text-center">
                        <div className="flex flex-col items-center gap-3">
                          <Search className="w-8 h-8 text-white/20" />
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
          </GlassCard>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-8 text-center"
        >
          <p className="text-xs text-white/30 max-w-2xl mx-auto">
            Guardian Scanner provides AI-assisted analysis for educational purposes. This is NOT financial advice. 
            Always do your own research. Crypto trading carries significant risk. No score guarantees safety.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
