import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { 
  Bot, Target, TrendingUp, TrendingDown, Eye, AlertTriangle,
  Shield, Zap, Activity, RefreshCw, Bell, Settings, Filter,
  ChevronDown, ExternalLink, Copy, Check, Home
} from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface StrikeRecommendation {
  id: string;
  tokenSymbol: string;
  tokenName: string | null;
  tokenAddress: string;
  priceUsd: string;
  marketCapUsd: string | null;
  aiRecommendation: 'snipe' | 'watch' | 'avoid';
  aiScore: number;
  aiReasoning: string | null;
  mintAuthorityActive: boolean | null;
  freezeAuthorityActive: boolean | null;
  isHoneypot: boolean | null;
  liquidityLocked: boolean | null;
  createdAt: string;
}

const recommendationStyles = {
  snipe: {
    bg: 'bg-gradient-to-r from-emerald-500/20 to-green-500/20',
    border: 'border-emerald-500/40',
    text: 'text-emerald-400',
    icon: Target,
    label: 'SNIPE',
    glow: 'shadow-[0_0_30px_rgba(16,185,129,0.3)]'
  },
  watch: {
    bg: 'bg-gradient-to-r from-amber-500/20 to-yellow-500/20',
    border: 'border-amber-500/40',
    text: 'text-amber-400',
    icon: Eye,
    label: 'WATCH',
    glow: 'shadow-[0_0_30px_rgba(245,158,11,0.3)]'
  },
  avoid: {
    bg: 'bg-gradient-to-r from-red-500/20 to-rose-500/20',
    border: 'border-red-500/40',
    text: 'text-red-400',
    icon: AlertTriangle,
    label: 'AVOID',
    glow: 'shadow-[0_0_30px_rgba(239,68,68,0.3)]'
  }
};

function TokenCard({ rec, expanded, onToggle }: { rec: StrikeRecommendation; expanded: boolean; onToggle: () => void }) {
  const style = recommendationStyles[rec.aiRecommendation];
  const Icon = style.icon;
  const [copied, setCopied] = useState(false);

  const copyAddress = () => {
    navigator.clipboard.writeText(rec.tokenAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`${style.bg} ${style.glow} rounded-2xl border ${style.border} overflow-hidden`}
    >
      <div 
        className="p-4 cursor-pointer active:bg-white/5 transition-colors"
        onClick={onToggle}
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-xl ${style.bg} ${style.border} border`}>
              <Icon className={`w-5 h-5 ${style.text}`} />
            </div>
            <div>
              <div className="text-lg font-bold text-white">${rec.tokenSymbol}</div>
              <div className="text-xs text-white/50 truncate max-w-[140px]">
                {rec.tokenName || rec.tokenAddress.slice(0, 12) + '...'}
              </div>
            </div>
          </div>
          <div className="flex flex-col items-end gap-1">
            <div className={`px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider ${style.bg} ${style.text} ${style.border} border`}>
              {style.label}
            </div>
            <div className={`text-lg font-bold ${(rec.aiScore || 0) >= 70 ? 'text-emerald-400' : (rec.aiScore || 0) >= 40 ? 'text-amber-400' : 'text-red-400'}`}>
              {rec.aiScore || 0}/100
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white/5 rounded-xl p-3 text-center">
            <div className="text-[10px] text-white/40 uppercase mb-1">Price</div>
            <div className="text-sm font-semibold text-white">
              ${rec.priceUsd ? parseFloat(rec.priceUsd).toFixed(8) : '0.00'}
            </div>
          </div>
          <div className="bg-white/5 rounded-xl p-3 text-center">
            <div className="text-[10px] text-white/40 uppercase mb-1">Market Cap</div>
            <div className="text-sm font-semibold text-white">
              {rec.marketCapUsd ? `$${(parseFloat(rec.marketCapUsd) / 1000).toFixed(0)}K` : 'N/A'}
            </div>
          </div>
        </div>
        
        <div className="flex gap-1.5 flex-wrap mt-3">
          {rec.mintAuthorityActive === false && (
            <span className="text-[10px] px-2 py-1 bg-emerald-500/15 text-emerald-400 rounded-lg border border-emerald-500/30">
              Mint Disabled
            </span>
          )}
          {rec.freezeAuthorityActive === false && (
            <span className="text-[10px] px-2 py-1 bg-emerald-500/15 text-emerald-400 rounded-lg border border-emerald-500/30">
              Freeze Disabled
            </span>
          )}
          {rec.liquidityLocked && (
            <span className="text-[10px] px-2 py-1 bg-emerald-500/15 text-emerald-400 rounded-lg border border-emerald-500/30">
              LP Locked
            </span>
          )}
          {rec.isHoneypot && (
            <span className="text-[10px] px-2 py-1 bg-red-500/15 text-red-400 rounded-lg border border-red-500/30">
              Honeypot Risk
            </span>
          )}
        </div>
        
        <div className="flex items-center justify-center mt-3">
          <ChevronDown className={`w-4 h-4 text-white/30 transition-transform ${expanded ? 'rotate-180' : ''}`} />
        </div>
      </div>
      
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 pt-2 border-t border-white/10">
              {rec.aiReasoning && (
                <div className="mb-4">
                  <div className="text-[10px] text-white/40 uppercase mb-2">AI Analysis</div>
                  <p className="text-sm text-white/70 leading-relaxed">{rec.aiReasoning}</p>
                </div>
              )}
              
              <div className="flex items-center gap-2 mb-4">
                <div className="flex-1 bg-white/5 rounded-lg px-3 py-2 text-xs text-white/50 truncate font-mono">
                  {rec.tokenAddress}
                </div>
                <button
                  onClick={(e) => { e.stopPropagation(); copyAddress(); }}
                  className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
                  data-testid="button-copy-address"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-white/50" />}
                </button>
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                <a
                  href={`https://dexscreener.com/solana/${rec.tokenAddress}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 py-2.5 bg-white/10 rounded-xl text-sm text-white hover:bg-white/20 transition-colors"
                  onClick={(e) => e.stopPropagation()}
                  data-testid="link-dexscreener"
                >
                  <ExternalLink className="w-4 h-4" />
                  DexScreener
                </a>
                <a
                  href={`https://solscan.io/token/${rec.tokenAddress}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 py-2.5 bg-white/10 rounded-xl text-sm text-white hover:bg-white/20 transition-colors"
                  onClick={(e) => e.stopPropagation()}
                  data-testid="link-solscan"
                >
                  <ExternalLink className="w-4 h-4" />
                  Solscan
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function StrikeAgentPage() {
  const [filter, setFilter] = useState<'all' | 'snipe' | 'watch' | 'avoid'>('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  
  const { data, isLoading, error, refetch, isFetching } = useQuery({
    queryKey: ['strike-agent-recommendations-full'],
    queryFn: async () => {
      const res = await fetch('/api/pulse/strike-agent/recommendations?limit=20');
      if (!res.ok) throw new Error('Failed to fetch recommendations');
      return res.json();
    },
    refetchInterval: 30000
  });

  const recommendations = (data?.recommendations || []) as StrikeRecommendation[];
  const filtered = filter === 'all' 
    ? recommendations 
    : recommendations.filter(r => r.aiRecommendation === filter);

  const counts = {
    all: recommendations.length,
    snipe: recommendations.filter(r => r.aiRecommendation === 'snipe').length,
    watch: recommendations.filter(r => r.aiRecommendation === 'watch').length,
    avoid: recommendations.filter(r => r.aiRecommendation === 'avoid').length,
  };

  return (
    <div className="min-h-screen bg-slate-950">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl" />
      </div>
      
      <header className="sticky top-0 z-50 bg-slate-950/80 backdrop-blur-xl border-b border-white/10 safe-area-top">
        <div className="px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 via-cyan-500 to-purple-500 flex items-center justify-center">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full animate-pulse border-2 border-slate-950" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-white">Strike Agent</h1>
              <p className="text-[10px] text-white/40">AI Token Discovery</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => refetch()}
              disabled={isFetching}
              className="p-2.5 bg-white/10 rounded-xl hover:bg-white/20 transition-colors disabled:opacity-50"
              data-testid="button-refresh"
            >
              <RefreshCw className={`w-5 h-5 text-white ${isFetching ? 'animate-spin' : ''}`} />
            </button>
            <Link href="/">
              <a className="p-2.5 bg-white/10 rounded-xl hover:bg-white/20 transition-colors" data-testid="link-home">
                <Home className="w-5 h-5 text-white" />
              </a>
            </Link>
          </div>
        </div>
        
        <div className="px-4 pb-3 flex gap-2 overflow-x-auto scrollbar-hide">
          {(['all', 'snipe', 'watch', 'avoid'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                filter === f 
                  ? f === 'snipe' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                  : f === 'watch' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                  : f === 'avoid' ? 'bg-red-500/20 text-red-400 border border-red-500/40'
                  : 'bg-white/20 text-white border border-white/40'
                  : 'bg-white/5 text-white/60 border border-transparent'
              }`}
              data-testid={`filter-${f}`}
            >
              {f === 'all' && <Filter className="w-4 h-4" />}
              {f === 'snipe' && <Target className="w-4 h-4" />}
              {f === 'watch' && <Eye className="w-4 h-4" />}
              {f === 'avoid' && <AlertTriangle className="w-4 h-4" />}
              <span className="capitalize">{f}</span>
              <span className="text-xs opacity-70">({counts[f]})</span>
            </button>
          ))}
        </div>
      </header>
      
      <main className="relative z-10 px-4 py-4 pb-24">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-12 h-12 border-3 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin mb-4" />
            <span className="text-sm text-white/50">Scanning tokens...</span>
          </div>
        ) : error || filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Shield className="w-16 h-16 text-emerald-500/30 mb-4" />
            <p className="text-lg text-white/50 mb-2">No recommendations</p>
            <p className="text-sm text-white/30 text-center max-w-xs">
              Strike Agent is actively monitoring the market for opportunities
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map((rec) => (
              <TokenCard 
                key={rec.id} 
                rec={rec} 
                expanded={expandedId === rec.id}
                onToggle={() => setExpandedId(expandedId === rec.id ? null : rec.id)}
              />
            ))}
          </div>
        )}
      </main>
      
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-slate-950/90 backdrop-blur-xl border-t border-white/10 safe-area-bottom">
        <div className="flex items-center justify-around py-3">
          <div className="flex flex-col items-center gap-1">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
              <Target className="w-5 h-5 text-emerald-400" />
            </div>
            <span className="text-[10px] text-emerald-400 font-medium">{counts.snipe} Snipe</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center">
              <Eye className="w-5 h-5 text-amber-400" />
            </div>
            <span className="text-[10px] text-amber-400 font-medium">{counts.watch} Watch</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <div className="w-10 h-10 rounded-xl bg-red-500/20 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-red-400" />
            </div>
            <span className="text-[10px] text-red-400 font-medium">{counts.avoid} Avoid</span>
          </div>
          <Link href="/pulse">
            <a className="flex flex-col items-center gap-1" data-testid="link-pulse">
              <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center">
                <Zap className="w-5 h-5 text-purple-400" />
              </div>
              <span className="text-[10px] text-purple-400 font-medium">Pulse AI</span>
            </a>
          </Link>
        </div>
      </nav>
    </div>
  );
}
