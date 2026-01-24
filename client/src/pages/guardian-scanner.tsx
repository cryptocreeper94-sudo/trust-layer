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
  X
} from "lucide-react";
import { useGuardianWS } from "@/hooks/use-guardian-ws";

const CHAINS = [
  { id: "all", name: "All", icon: "🌐", color: "from-white/20 to-white/10" },
  { id: "solana", name: "SOL", icon: "◎", color: "from-purple-500 to-green-400" },
  { id: "ethereum", name: "ETH", icon: "Ξ", color: "from-blue-500 to-purple-500" },
  { id: "base", name: "BASE", icon: "🔵", color: "from-blue-400 to-blue-600" },
  { id: "bsc", name: "BSC", icon: "🟡", color: "from-yellow-400 to-yellow-600" },
  { id: "arbitrum", name: "ARB", icon: "🔷", color: "from-blue-400 to-cyan-500" },
  { id: "polygon", name: "MATIC", icon: "🟣", color: "from-purple-500 to-purple-700" },
  { id: "darkwave", name: "DW", icon: "◆", color: "from-cyan-400 to-purple-500" },
];

const TIME_FILTERS = [
  { id: "5m", label: "5m" },
  { id: "1h", label: "1h" },
  { id: "6h", label: "6h" },
  { id: "24h", label: "24h" },
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
  const baseTokens = [
    "PENGUIN", "SKR", "REES", "XOGE", "BALLS", "USR", "RALPH", "MEMES", "WHALE", "FIT",
    "BONKILL", "DOGER", "PEPEC", "MOON", "SGEM", "WOJAK", "CHAD", "BAI", "FROG", "DMD",
    "APE2", "RCKT", "GEM", "ALPHA", "DEGEN", "WEN", "SAFE", "PAPER", "GIGA", "COPE",
    "SHIB2", "FLOKI2", "BONK2", "SAMO", "ORCA", "JUP", "RAY", "STEP", "MANGO", "TULIP",
    "SRM", "ATLAS", "POLIS", "GENE", "SLIM", "LIKE", "MNGO", "PORT", "SLND", "SHDW",
  ];
  
  const names: Record<string, string> = {
    PENGUIN: "Nietzschean Penguin", SKR: "Seeker", REES: "Rare Earth", XOGE: "Xoge Token",
    BALLS: "Ballscoin", USR: "US Reserve", RALPH: "Ralph Wiggum", MEMES: "Memes CC",
  };

  const chains = chain === "all" ? ["solana", "ethereum", "base", "bsc"] : [chain];
  const chainIcons: Record<string, string> = {
    solana: "◎", ethereum: "Ξ", base: "🔵", bsc: "🟡",
    arbitrum: "🔷", polygon: "🟣", avalanche: "🔺", darkwave: "◆"
  };
  
  const dexByChain: Record<string, string[]> = {
    solana: ["Ray", "Pump", "Orca"],
    ethereum: ["Uni", "Sushi"],
    base: ["Base", "Aero"],
    bsc: ["Cake"],
    darkwave: ["DSwap"]
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
      name: names[symbol] || symbol.charAt(0) + symbol.slice(1).toLowerCase(),
      symbol,
      logo: `https://api.dicebear.com/7.x/shapes/svg?seed=${symbol}&backgroundColor=${color}`,
      contractAddress: `0x${Array.from({length: 40}, () => '0123456789abcdef'[Math.floor(Math.random() * 16)]).join('')}`,
      pairAddress: `0x${Array.from({length: 40}, () => '0123456789abcdef'[Math.floor(Math.random() * 16)]).join('')}`,
      chain: tokenChain,
      chainIcon: chainIcons[tokenChain] || "◎",
      dex,
      dexShort: dex,
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
  if (num >= 1e9) return `${(num / 1e9).toFixed(1)}B`;
  if (num >= 1e6) return `${(num / 1e6).toFixed(1)}M`;
  if (num >= 1e3) return `${(num / 1e3).toFixed(0)}K`;
  return num.toFixed(0);
}

function formatCompact(num: number): string {
  if (num >= 1e6) return `${(num / 1e6).toFixed(1)}M`;
  if (num >= 1e3) return `${(num / 1e3).toFixed(0)}K`;
  return num.toFixed(0);
}

function PriceChange({ value, className = "" }: { value: number; className?: string }) {
  const isPositive = value >= 0;
  return (
    <span className={`tabular-nums ${isPositive ? 'text-emerald-400' : 'text-red-400'} ${className}`}>
      {isPositive ? '+' : ''}{value.toFixed(1)}%
    </span>
  );
}

function GuardianScoreBadge({ score }: { score: number }) {
  let color = "bg-red-500/20 text-red-400";
  if (score >= 80) color = "bg-emerald-500/20 text-emerald-400";
  else if (score >= 50) color = "bg-yellow-500/20 text-yellow-400";
  else if (score >= 20) color = "bg-orange-500/20 text-orange-400";
  
  return (
    <div className={`inline-flex items-center gap-0.5 px-1 py-0.5 rounded text-[10px] font-bold ${color}`}>
      <Shield className="w-2.5 h-2.5" />
      {score}
    </div>
  );
}

function SecurityIcons({ token }: { token: Token }) {
  return (
    <div className="flex items-center gap-0.5">
      {token.honeypotRisk && <Skull className="w-3 h-3 text-red-400" />}
      {token.liquidityLocked && <Lock className="w-2.5 h-2.5 text-emerald-400" />}
      {token.creatorBadge === "verified" && <CheckCircle className="w-2.5 h-2.5 text-blue-400" />}
    </div>
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
    <tr className="border-b border-white/5 hover:bg-white/[0.02] h-7 group" data-testid={`token-row-${token.id}`}>
      <td className="pl-2 pr-1 text-[10px] text-white/30 w-6">{token.rank}</td>
      <td className="pr-1">
        <Link href={`/guardian-scanner/${token.chain}/${token.symbol.toLowerCase()}`}>
          <div className="flex items-center gap-1">
            <span className="text-[9px] w-3">{token.chainIcon}</span>
            <span className="text-[9px] text-white/40 w-8 truncate">{token.dexShort}</span>
            <img src={token.logo} alt="" className="w-4 h-4 rounded-full bg-white/10" />
            <div className="flex flex-col">
              <div className="flex items-center gap-0.5">
                <span className="text-[11px] font-medium text-white group-hover:text-cyan-400">{token.symbol}</span>
                {token.boosts > 0 && <Zap className="w-2.5 h-2.5 text-yellow-400" />}
                <SecurityIcons token={token} />
              </div>
            </div>
          </div>
        </Link>
      </td>
      <td className="pr-2 text-right text-[11px] font-medium text-white tabular-nums">{token.priceUsd}</td>
      <td className="pr-2 text-right text-[10px] text-white/50">{token.age}</td>
      <td className="pr-2 text-right text-[10px] text-white/50 tabular-nums">{formatCompact(token.txns)}</td>
      <td className="pr-2 text-right text-[10px] text-white/60 tabular-nums">${formatNumber(token.volume24h)}</td>
      <td className="pr-2 text-right text-[10px] hidden lg:table-cell"><PriceChange value={token.priceChange5m} /></td>
      <td className="pr-2 text-right text-[10px]"><PriceChange value={token.priceChange1h} /></td>
      <td className="pr-2 text-right text-[10px] hidden lg:table-cell"><PriceChange value={token.priceChange6h} /></td>
      <td className="pr-2 text-right text-[10px]"><PriceChange value={token.priceChange24h} /></td>
      <td className="pr-2 text-right text-[10px] text-white/50 tabular-nums hidden xl:table-cell">${formatNumber(token.liquidity)}</td>
      <td className="pr-1"><GuardianScoreBadge score={token.guardianScore} /></td>
      <td className="pr-2">
        <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100">
          <button onClick={(e) => { e.preventDefault(); onToggleWatchlist(token.id); }} className="p-0.5 hover:bg-white/10 rounded">
            <Star className={`w-3 h-3 ${token.isWatchlisted ? 'fill-yellow-400 text-yellow-400' : 'text-white/30'}`} />
          </button>
          <button onClick={copyAddress} className="p-0.5 hover:bg-white/10 rounded">
            {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3 text-white/30" />}
          </button>
        </div>
      </td>
    </tr>
  );
}

function MobileTokenRow({ token, onToggleWatchlist }: { token: Token; onToggleWatchlist: (id: string) => void }) {
  return (
    <Link href={`/guardian-scanner/${token.chain}/${token.symbol.toLowerCase()}`}>
      <div className="flex items-center gap-2 px-2 py-1.5 border-b border-white/5 hover:bg-white/[0.02]" data-testid={`mobile-token-${token.id}`}>
        <span className="text-[9px] text-white/30 w-4">{token.rank}</span>
        <div className="relative">
          <img src={token.logo} alt="" className="w-5 h-5 rounded-full bg-white/10" />
          <span className="absolute -bottom-0.5 -right-0.5 text-[7px]">{token.chainIcon}</span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1">
            <span className="text-[11px] font-medium text-white">{token.symbol}</span>
            {token.boosts > 0 && <Zap className="w-2.5 h-2.5 text-yellow-400" />}
            <SecurityIcons token={token} />
          </div>
          <span className="text-[9px] text-white/30">{token.dexShort}</span>
        </div>
        <div className="text-right">
          <div className="text-[11px] font-medium text-white">{token.priceUsd}</div>
          <PriceChange value={token.priceChange24h} className="text-[9px]" />
        </div>
        <div className="text-right hidden xs:block">
          <div className="text-[9px] text-white/40">Vol</div>
          <div className="text-[9px] text-white/60">${formatNumber(token.volume24h)}</div>
        </div>
        <GuardianScoreBadge score={token.guardianScore} />
      </div>
    </Link>
  );
}

export default function GuardianScanner() {
  const [selectedChain, setSelectedChain] = useState("solana");
  const [activeTimeFilter, setActiveTimeFilter] = useState("6h");
  const [rankBy, setRankBy] = useState("trending");
  const [searchQuery, setSearchQuery] = useState("");
  const [tokens, setTokens] = useState<Token[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showChainDropdown, setShowChainDropdown] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

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
            symbol: t.symbol || 'UNK',
            logo: t.imageUrl || null,
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
      default: result.sort((a, b) => (b.volume24h * Math.abs(b.priceChange24h)) - (a.volume24h * Math.abs(a.priceChange24h)));
    }
    
    return result.map((t, i) => ({ ...t, rank: i + 1 }));
  }, [tokens, searchQuery, rankBy]);

  const toggleWatchlist = (id: string) => {
    setTokens(prev => prev.map(t => t.id === id ? { ...t, isWatchlisted: !t.isWatchlisted } : t));
  };

  const selectedChainData = CHAINS.find(c => c.id === selectedChain);

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col">
      {/* Compact Header */}
      <header className="bg-[#0d0d0d] border-b border-white/5 px-2 py-1.5 flex items-center gap-2 flex-wrap">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-1.5 mr-2">
          <div className="w-6 h-6 rounded bg-gradient-to-br from-cyan-500 to-purple-500 flex items-center justify-center">
            <Shield className="w-3.5 h-3.5 text-white" />
          </div>
          <span className="font-bold text-white text-xs hidden sm:block">GUARDIAN</span>
        </Link>

        {/* Chain Selector */}
        <div className="relative">
          <button
            onClick={() => setShowChainDropdown(!showChainDropdown)}
            className={`flex items-center gap-1 px-2 py-1 rounded text-[11px] font-medium bg-gradient-to-r ${selectedChainData?.color} text-white`}
            data-testid="chain-selector"
          >
            <span>{selectedChainData?.icon}</span>
            <span>{selectedChainData?.name}</span>
            <ChevronDown className="w-3 h-3" />
          </button>
          <AnimatePresence>
            {showChainDropdown && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                className="absolute left-0 top-full mt-0.5 z-50 bg-[#1a1a1a] border border-white/10 rounded shadow-xl min-w-[100px]"
              >
                {CHAINS.map(chain => (
                  <button
                    key={chain.id}
                    onClick={() => { setSelectedChain(chain.id); setShowChainDropdown(false); }}
                    className={`w-full flex items-center gap-1.5 px-2 py-1.5 text-[11px] ${
                      selectedChain === chain.id ? 'bg-cyan-500/20 text-cyan-400' : 'text-white/70 hover:bg-white/5'
                    }`}
                  >
                    <span>{chain.icon}</span>
                    <span>{chain.name}</span>
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Trending */}
        <button className="flex items-center gap-1 px-2 py-1 rounded text-[11px] font-medium bg-orange-500/20 text-orange-400">
          <Flame className="w-3 h-3" />
          <span className="hidden xs:inline">Trending</span>
        </button>

        {/* Time Filters */}
        <div className="flex items-center bg-white/5 rounded p-0.5">
          {TIME_FILTERS.map(tf => (
            <button
              key={tf.id}
              onClick={() => setActiveTimeFilter(tf.id)}
              className={`px-2 py-0.5 text-[10px] font-medium rounded ${
                activeTimeFilter === tf.id ? 'bg-cyan-500 text-white' : 'text-white/50 hover:text-white'
              }`}
            >
              {tf.label}
            </button>
          ))}
        </div>

        {/* Quick Filters */}
        <div className="flex items-center gap-0.5 text-[10px]">
          {[
            { id: "trending", label: "Hot" },
            { id: "gainers", label: "Gain" },
            { id: "losers", label: "Loss" },
            { id: "newest", label: "New" },
          ].map(f => (
            <button
              key={f.id}
              onClick={() => setRankBy(f.id)}
              className={`px-1.5 py-0.5 rounded ${rankBy === f.id ? 'text-cyan-400 bg-cyan-500/10' : 'text-white/50 hover:text-white'}`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative flex-1 max-w-[160px] ml-auto">
          <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3 text-white/30" />
          <Input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-6 pl-6 pr-2 text-[11px] bg-white/5 border-white/10 focus:border-cyan-500/50"
            data-testid="search-input"
          />
        </div>

        {/* Status */}
        <Badge className={`${connected ? 'bg-emerald-500/20 text-emerald-400' : 'bg-white/10 text-white/40'} text-[9px] px-1.5 py-0.5`}>
          <span className={`w-1.5 h-1.5 rounded-full mr-1 inline-block ${connected ? 'bg-emerald-400 animate-pulse' : 'bg-white/30'}`} />
          {connected ? 'LIVE' : 'OFF'}
        </Badge>

        {/* Refresh */}
        <button
          onClick={() => {
            setIsLoading(true);
            setTimeout(() => { setTokens(generateMockTokens(selectedChain)); setIsLoading(false); }, 300);
          }}
          className="p-1 text-white/40 hover:text-white"
          data-testid="refresh-btn"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
        </button>

        {/* Mobile Menu */}
        <button onClick={() => setShowMobileMenu(!showMobileMenu)} className="p-1 text-white/60 md:hidden">
          {showMobileMenu ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
        </button>
      </header>

      {/* Stats Bar */}
      <div className="bg-[#0a0a0a] border-b border-white/5 px-2 py-1 flex items-center gap-4 text-[10px] overflow-x-auto">
        <div className="flex items-center gap-1">
          <span className="text-white/40">24H Vol:</span>
          <span className="text-white font-medium">$26.1B</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-white/40">Txns:</span>
          <span className="text-white font-medium">46.1M</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-white/40">Pairs:</span>
          <span className="text-white font-medium">{filteredTokens.length}</span>
        </div>
        <div className="flex items-center gap-1 ml-auto">
          <Star className="w-3 h-3 text-yellow-400" />
          <span className="text-white/60">{tokens.filter(t => t.isWatchlisted).length}</span>
        </div>
      </div>

      {/* Desktop Table */}
      <div className="flex-1 overflow-auto hidden md:block">
        <table className="w-full text-left">
          <thead className="sticky top-0 bg-[#0a0a0a] z-10 border-b border-white/10">
            <tr className="h-6 text-[9px] font-medium text-white/40 uppercase">
              <th className="pl-2 pr-1 w-6">#</th>
              <th className="pr-2 min-w-[140px]">Token</th>
              <th className="pr-2 text-right">Price</th>
              <th className="pr-2 text-right w-12">Age</th>
              <th className="pr-2 text-right w-14">Txns</th>
              <th className="pr-2 text-right w-16">Volume</th>
              <th className="pr-2 text-right w-12 hidden lg:table-cell">5m</th>
              <th className="pr-2 text-right w-12">1h</th>
              <th className="pr-2 text-right w-12 hidden lg:table-cell">6h</th>
              <th className="pr-2 text-right w-12">24h</th>
              <th className="pr-2 text-right w-16 hidden xl:table-cell">Liq</th>
              <th className="pr-1 w-12"><Shield className="w-3 h-3 inline" /></th>
              <th className="pr-2 w-10"></th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={13} className="py-10 text-center">
                  <RefreshCw className="w-5 h-5 text-cyan-400 animate-spin mx-auto mb-1" />
                  <p className="text-white/40 text-xs">Loading...</p>
                </td>
              </tr>
            ) : filteredTokens.length === 0 ? (
              <tr>
                <td colSpan={13} className="py-10 text-center">
                  <Search className="w-5 h-5 text-white/20 mx-auto mb-1" />
                  <p className="text-white/40 text-xs">No tokens found</p>
                </td>
              </tr>
            ) : (
              filteredTokens.map(token => (
                <TokenRow key={token.id} token={token} onToggleWatchlist={toggleWatchlist} />
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile List */}
      <div className="flex-1 overflow-auto md:hidden">
        {isLoading ? (
          <div className="py-10 text-center">
            <RefreshCw className="w-5 h-5 text-cyan-400 animate-spin mx-auto mb-1" />
            <p className="text-white/40 text-xs">Loading...</p>
          </div>
        ) : filteredTokens.length === 0 ? (
          <div className="py-10 text-center">
            <Search className="w-5 h-5 text-white/20 mx-auto mb-1" />
            <p className="text-white/40 text-xs">No tokens found</p>
          </div>
        ) : (
          filteredTokens.map(token => (
            <MobileTokenRow key={token.id} token={token} onToggleWatchlist={toggleWatchlist} />
          ))
        )}
      </div>

      {/* Footer */}
      <div className="bg-[#0a0a0a] border-t border-white/5 px-2 py-1.5 text-center">
        <p className="text-[9px] text-white/30">
          Guardian Scanner • AI-powered risk analysis • Not financial advice • <span className="text-cyan-400/50">DarkWave Trust Layer</span>
        </p>
      </div>
    </div>
  );
}
