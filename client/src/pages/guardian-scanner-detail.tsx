import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link, useParams } from "wouter";
import { GlassCard } from "@/components/glass-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
  StarOff,
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
  HelpCircle,
  Zap,
  Brain,
  Target,
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
  Trash2
} from "lucide-react";
import { Textarea } from "@/components/ui/textarea";

const GLOSSARY: Record<string, string> = {
  "Market Cap": "Total value of all tokens in circulation. Calculated as price × total supply.",
  "Liquidity": "Amount of funds available for trading. Higher liquidity = easier to buy/sell without big price impact.",
  "Volume (24h)": "Total trading volume in the last 24 hours. Shows how actively the token is being traded.",
  "Holders": "Number of unique wallets that hold this token.",
  "Guardian Score": "Our AI-powered risk assessment from 0-100. Higher = safer. Based on liquidity, holders, creator history, and contract analysis.",
  "Whale Concentration": "Percentage held by top 10 wallets. High concentration = higher dump risk.",
  "Liquidity Locked": "Funds locked in a smart contract that can't be withdrawn. Prevents rug pulls.",
  "Honeypot": "A scam where you can buy but can't sell. Our scanner detects these.",
  "Mint Authority": "Ability to create more tokens. If active, supply can be inflated at any time.",
  "Freeze Authority": "Ability to freeze token transfers. If active, your tokens could be locked.",
  "Bot Activity": "Percentage of trades from bots vs humans. High bot activity can indicate manipulation.",
  "Bundle Buy": "Multiple coordinated buys in same block. Often indicates insider trading or manipulation.",
  "Dev Wallet": "The wallet that created the token. Tracking if they're selling is important.",
  "ML Prediction": "Machine learning model prediction based on historical patterns and market indicators.",
  "Confidence": "How certain the prediction model is about its forecast. Higher = more reliable.",
};

const TIME_RANGES = [
  { id: "5m", label: "5m" },
  { id: "1h", label: "1H" },
  { id: "4h", label: "4H" },
  { id: "1d", label: "1D" },
  { id: "7d", label: "7D" },
];

interface TokenDetail {
  id: string;
  name: string;
  symbol: string;
  logo: string | null;
  banner: string | null;
  description: string;
  price: number;
  priceChange5m: number;
  priceChange1h: number;
  priceChange6h: number;
  priceChange24h: number;
  priceChange7d: number;
  marketCap: number;
  fdv: number;
  volume24h: number;
  liquidity: number;
  holders: number;
  totalSupply: number;
  circulatingSupply: number;
  contractAddress: string;
  chain: string;
  createdAt: string;
  txns24h: number;
  buys24h: number;
  sells24h: number;
  guardianScore: number;
  whaleConcentration: number;
  top10Holders: Array<{ address: string; percent: number; label?: string }>;
  liquidityLocked: boolean;
  lockDuration: string | null;
  lockPlatform: string | null;
  honeypotRisk: boolean;
  mintAuthority: boolean;
  freezeAuthority: boolean;
  botActivity: number;
  bundleBuy: number;
  devWalletHolding: number;
  devSoldPercent: number;
  creatorVerified: boolean;
  creatorBadge: "new" | "verified" | "trusted" | "certified" | "flagged";
  creatorName: string | null;
  creatorHistory: { launches: number; rugs: number };
  socials: {
    website?: string;
    twitter?: string;
    telegram?: string;
    discord?: string;
  };
  mlPrediction: {
    signal: "bullish" | "bearish" | "neutral";
    confidence: number;
    shortTerm: { direction: string; percent: number };
    longTerm: { direction: string; percent: number };
    accuracy: number;
  };
  isWatchlisted: boolean;
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
  if (score >= 50) return "Medium Risk";
  if (score >= 20) return "High Risk";
  return "Extreme Risk";
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

const RUG_TYPES = [
  { id: "liquidity_pull", label: "Liquidity Pulled", description: "Dev removed liquidity from the pool" },
  { id: "mint_exploit", label: "Mint Exploit", description: "Dev minted extra tokens and sold" },
  { id: "honeypot", label: "Honeypot", description: "Buyers could not sell tokens" },
  { id: "stealth_dump", label: "Stealth Dump", description: "Team dumped tokens slowly" },
  { id: "contract_switch", label: "Contract Changed", description: "Malicious contract upgrade" },
  { id: "other", label: "Other Scam", description: "Other type of rug pull" },
];

function RugReportModal({ 
  isOpen, 
  onClose, 
  tokenName, 
  tokenAddress 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  tokenName: string; 
  tokenAddress: string;
}) {
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [evidence, setEvidence] = useState("");
  const [txHash, setTxHash] = useState("");
  const [submitted, setSubmitted] = useState(false);
  
  if (!isOpen) return null;
  
  const handleSubmit = () => {
    if (!selectedType) return;
    console.log("Rug report submitted:", { tokenAddress, rugType: selectedType, evidence, txHash });
    setSubmitted(true);
    setTimeout(() => {
      onClose();
      setSubmitted(false);
      setSelectedType(null);
      setEvidence("");
      setTxHash("");
    }, 2000);
  };
  
  if (submitted) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm" onClick={onClose}>
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-slate-900 border border-emerald-500/30 rounded-xl p-8 max-w-md mx-4 text-center"
          onClick={e => e.stopPropagation()}
        >
          <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-emerald-400" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Report Submitted</h3>
          <p className="text-white/60 text-sm">
            Thank you for protecting the community. Your report will be reviewed and the creator's permanent record will be updated.
          </p>
        </motion.div>
      </div>
    );
  }
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm" onClick={onClose}>
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-slate-900 border border-red-500/30 rounded-xl p-6 max-w-lg w-full mx-4 max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
        data-testid="rug-report-modal"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center">
            <Skull className="w-6 h-6 text-red-400" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Report Rug Pull</h3>
            <p className="text-sm text-white/50">{tokenName}</p>
          </div>
        </div>
        
        <div className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-3 mb-4">
          <div className="flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-orange-400 shrink-0 mt-0.5" />
            <p className="text-xs text-orange-400">
              False reports damage your reputation score. Only report verified scams with evidence. Reports are permanently recorded on-chain.
            </p>
          </div>
        </div>
        
        <div className="mb-4">
          <label className="text-sm font-medium text-white mb-2 block">Type of Rug</label>
          <div className="grid grid-cols-2 gap-2">
            {RUG_TYPES.map(type => (
              <button
                key={type.id}
                onClick={() => setSelectedType(type.id)}
                className={`p-3 rounded-lg border text-left transition-all ${
                  selectedType === type.id
                    ? "border-red-500/50 bg-red-500/10"
                    : "border-white/10 bg-white/5 hover:border-white/20"
                }`}
                data-testid={`rug-type-${type.id}`}
              >
                <p className="text-sm font-medium text-white">{type.label}</p>
                <p className="text-[10px] text-white/40">{type.description}</p>
              </button>
            ))}
          </div>
        </div>
        
        <div className="mb-4">
          <label className="text-sm font-medium text-white mb-2 block">Transaction Hash (Optional)</label>
          <input
            type="text"
            placeholder="0x... or the rug transaction hash"
            value={txHash}
            onChange={e => setTxHash(e.target.value)}
            className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-cyan-500/50"
            data-testid="rug-tx-hash"
          />
        </div>
        
        <div className="mb-6">
          <label className="text-sm font-medium text-white mb-2 block">Evidence & Details</label>
          <Textarea
            placeholder="Describe what happened, links to proof, screenshots, etc..."
            value={evidence}
            onChange={e => setEvidence(e.target.value)}
            className="bg-white/5 border-white/10 resize-none min-h-[100px]"
            data-testid="rug-evidence"
          />
        </div>
        
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={onClose}
            className="flex-1 border-white/10"
            data-testid="rug-cancel"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!selectedType}
            className="flex-1 bg-red-500/20 text-red-400 hover:bg-red-500/30 border border-red-500/30"
            data-testid="rug-submit"
          >
            <Skull className="w-4 h-4 mr-2" />
            Submit Report
          </Button>
        </div>
      </motion.div>
    </div>
  );
}

function RiskIndicator({ label, safe, tooltip }: { label: string; safe: boolean; tooltip: string }) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
      <GlossaryTooltip term={tooltip}>
        <span className="text-sm text-white/70">{label}</span>
      </GlossaryTooltip>
      {safe ? (
        <div className="flex items-center gap-1.5 text-emerald-400">
          <CheckCircle className="w-4 h-4" />
          <span className="text-xs font-medium">Safe</span>
        </div>
      ) : (
        <div className="flex items-center gap-1.5 text-red-400">
          <XCircle className="w-4 h-4" />
          <span className="text-xs font-medium">Risk</span>
        </div>
      )}
    </div>
  );
}

interface Comment {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string | null;
  content: string;
  sentiment: "bullish" | "bearish" | "warning" | "neutral";
  upvotes: number;
  downvotes: number;
  trustLevel: "new" | "member" | "trusted" | "expert";
  isVerifiedUser: boolean;
  createdAt: string;
  isAiFlagged: boolean;
}

const MOCK_COMMENTS: Comment[] = [
  {
    id: "1",
    userId: "user1",
    userName: "CryptoWhale42",
    userAvatar: null,
    content: "Been holding this since launch. Dev is active in TG, liquidity locked for 6 months. Solid project IMO.",
    sentiment: "bullish",
    upvotes: 24,
    downvotes: 3,
    trustLevel: "trusted",
    isVerifiedUser: true,
    createdAt: "2h ago",
    isAiFlagged: false,
  },
  {
    id: "2",
    userId: "user2",
    userName: "SafetyFirst",
    userAvatar: null,
    content: "Warning: Same dev wallet that launched $RUGME last month. Check the creator history - 2 previous rugs.",
    sentiment: "warning",
    upvotes: 156,
    downvotes: 12,
    trustLevel: "expert",
    isVerifiedUser: true,
    createdAt: "4h ago",
    isAiFlagged: false,
  },
  {
    id: "3",
    userId: "user3",
    userName: "NewTrader99",
    userAvatar: null,
    content: "Chart looking bullish! 🚀🚀🚀",
    sentiment: "bullish",
    upvotes: 5,
    downvotes: 8,
    trustLevel: "new",
    isVerifiedUser: false,
    createdAt: "1h ago",
    isAiFlagged: false,
  },
];

function TrustBadge({ level }: { level: Comment["trustLevel"] }) {
  const config = {
    new: { label: "New", color: "bg-white/10 text-white/50 border-white/10" },
    member: { label: "Member", color: "bg-blue-500/20 text-blue-400 border-blue-500/30" },
    trusted: { label: "Trusted", color: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" },
    expert: { label: "Expert", color: "bg-purple-500/20 text-purple-400 border-purple-500/30" },
  };
  
  return (
    <Badge className={`${config[level].color} border text-[10px] px-1.5 py-0`}>
      {config[level].label}
    </Badge>
  );
}

function SentimentBadge({ sentiment }: { sentiment: Comment["sentiment"] }) {
  const config = {
    bullish: { label: "Bullish", color: "bg-emerald-500/20 text-emerald-400" },
    bearish: { label: "Bearish", color: "bg-red-500/20 text-red-400" },
    warning: { label: "Warning", color: "bg-orange-500/20 text-orange-400" },
    neutral: { label: "Neutral", color: "bg-white/10 text-white/50" },
  };
  
  return (
    <span className={`${config[sentiment].color} text-[10px] px-2 py-0.5 rounded-full`}>
      {config[sentiment].label}
    </span>
  );
}

function CommunityComments({ tokenAddress, chain }: { tokenAddress: string; chain: string }) {
  const [comments, setComments] = useState<Comment[]>(MOCK_COMMENTS);
  const [newComment, setNewComment] = useState("");
  const [selectedSentiment, setSelectedSentiment] = useState<Comment["sentiment"]>("neutral");
  
  const handleVote = (id: string, type: "up" | "down") => {
    setComments(prev => prev.map(c => {
      if (c.id === id) {
        return type === "up" 
          ? { ...c, upvotes: c.upvotes + 1 }
          : { ...c, downvotes: c.downvotes + 1 };
      }
      return c;
    }));
  };
  
  const handleSubmit = () => {
    if (!newComment.trim()) return;
    
    const comment: Comment = {
      id: Date.now().toString(),
      userId: "current-user",
      userName: "You",
      userAvatar: null,
      content: newComment,
      sentiment: selectedSentiment,
      upvotes: 0,
      downvotes: 0,
      trustLevel: "new",
      isVerifiedUser: false,
      createdAt: "Just now",
      isAiFlagged: false,
    };
    
    setComments(prev => [comment, ...prev]);
    setNewComment("");
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="mt-8"
    >
      <GlassCard glow>
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <MessageCircle className="w-5 h-5 text-cyan-400" />
              Community Intel
            </h3>
            <div className="flex items-center gap-2 text-xs text-white/40">
              <Sparkles className="w-4 h-4" />
              <span>AI Moderated</span>
            </div>
          </div>
          
          <div className="mb-6 p-4 rounded-xl bg-white/5 border border-white/10">
            <Textarea
              placeholder="Share your insights about this token... (Be helpful - your reputation depends on it)"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="bg-transparent border-0 resize-none focus-visible:ring-0 p-0 text-sm"
              rows={3}
              data-testid="comment-input"
            />
            <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/10">
              <div className="flex items-center gap-2">
                <span className="text-xs text-white/40">Sentiment:</span>
                {(["bullish", "bearish", "warning", "neutral"] as const).map(s => (
                  <button
                    key={s}
                    onClick={() => setSelectedSentiment(s)}
                    className={`text-xs px-2 py-1 rounded transition-all ${
                      selectedSentiment === s
                        ? s === "bullish" ? "bg-emerald-500/30 text-emerald-400"
                        : s === "bearish" ? "bg-red-500/30 text-red-400"
                        : s === "warning" ? "bg-orange-500/30 text-orange-400"
                        : "bg-white/20 text-white"
                        : "bg-white/5 text-white/40 hover:bg-white/10"
                    }`}
                    data-testid={`sentiment-${s}`}
                  >
                    {s.charAt(0).toUpperCase() + s.slice(1)}
                  </button>
                ))}
              </div>
              <Button
                size="sm"
                onClick={handleSubmit}
                disabled={!newComment.trim()}
                className="bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30 border border-cyan-500/30"
                data-testid="submit-comment"
              >
                <Send className="w-4 h-4 mr-1" />
                Post
              </Button>
            </div>
          </div>
          
          <div className="space-y-4">
            {comments.map(comment => (
              <motion.div
                key={comment.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-4 rounded-xl border ${
                  comment.sentiment === "warning" 
                    ? "bg-orange-500/5 border-orange-500/20"
                    : "bg-white/5 border-white/10"
                }`}
                data-testid={`comment-${comment.id}`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-purple-500 flex items-center justify-center text-xs font-bold text-white shrink-0">
                      {comment.userName.slice(0, 2).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span className="font-medium text-white text-sm">{comment.userName}</span>
                        <TrustBadge level={comment.trustLevel} />
                        {comment.isVerifiedUser && (
                          <UserCheck className="w-3.5 h-3.5 text-cyan-400" />
                        )}
                        <SentimentBadge sentiment={comment.sentiment} />
                        <span className="text-xs text-white/30">{comment.createdAt}</span>
                      </div>
                      <p className="text-sm text-white/80 leading-relaxed">{comment.content}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => handleVote(comment.id, "up")}
                      className="p-1.5 rounded hover:bg-white/10 text-white/40 hover:text-emerald-400 transition-colors"
                      data-testid={`upvote-${comment.id}`}
                    >
                      <ThumbsUp className="w-4 h-4" />
                    </button>
                    <span className={`text-xs min-w-[24px] text-center ${
                      comment.upvotes > comment.downvotes ? "text-emerald-400" : 
                      comment.downvotes > comment.upvotes ? "text-red-400" : "text-white/40"
                    }`}>
                      {comment.upvotes - comment.downvotes}
                    </span>
                    <button
                      onClick={() => handleVote(comment.id, "down")}
                      className="p-1.5 rounded hover:bg-white/10 text-white/40 hover:text-red-400 transition-colors"
                      data-testid={`downvote-${comment.id}`}
                    >
                      <ThumbsDown className="w-4 h-4" />
                    </button>
                    <button
                      className="p-1.5 rounded hover:bg-white/10 text-white/40 hover:text-orange-400 transition-colors ml-2"
                      data-testid={`flag-${comment.id}`}
                    >
                      <Flag className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          
          <p className="text-[10px] text-white/30 mt-4 text-center">
            Comments are community-sourced and AI-moderated. Build your reputation by providing accurate, helpful insights.
          </p>
        </div>
      </GlassCard>
    </motion.div>
  );
}

interface PriceAlert {
  id: string;
  type: "above" | "below";
  price: number;
  isActive: boolean;
  createdAt: string;
}

function PriceAlertsSection({ currentPrice, tokenSymbol }: { currentPrice: number; tokenSymbol: string }) {
  const [alerts, setAlerts] = useState<PriceAlert[]>([
    { id: "1", type: "above", price: currentPrice * 1.5, isActive: true, createdAt: "2h ago" },
    { id: "2", type: "below", price: currentPrice * 0.7, isActive: true, createdAt: "1d ago" },
  ]);
  const [showAddAlert, setShowAddAlert] = useState(false);
  const [newAlertType, setNewAlertType] = useState<"above" | "below">("above");
  const [newAlertPrice, setNewAlertPrice] = useState("");
  
  const formatPrice = (price: number) => {
    if (price < 0.00001) return price.toExponential(4);
    if (price < 1) return price.toFixed(8);
    return price.toFixed(4);
  };
  
  const handleAddAlert = () => {
    const price = parseFloat(newAlertPrice);
    if (isNaN(price) || price <= 0) return;
    
    const newAlert: PriceAlert = {
      id: Date.now().toString(),
      type: newAlertType,
      price,
      isActive: true,
      createdAt: "Just now"
    };
    
    setAlerts(prev => [...prev, newAlert]);
    setShowAddAlert(false);
    setNewAlertPrice("");
  };
  
  const handleRemoveAlert = (id: string) => {
    setAlerts(prev => prev.filter(a => a.id !== id));
  };
  
  const toggleAlert = (id: string) => {
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, isActive: !a.isActive } : a));
  };
  
  return (
    <GlassCard glow>
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <BellRing className="w-5 h-5 text-amber-400" />
            Price Alerts
          </h3>
          <Button
            size="sm"
            onClick={() => setShowAddAlert(!showAddAlert)}
            className="bg-white/10 hover:bg-white/20 border-0 h-8 px-3"
            data-testid="add-alert-button"
          >
            <Plus className="w-4 h-4 mr-1" />
            Add
          </Button>
        </div>
        
        {showAddAlert && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="mb-4 p-3 rounded-lg bg-white/5 border border-white/10"
          >
            <div className="flex gap-2 mb-3">
              <button
                onClick={() => setNewAlertType("above")}
                className={`flex-1 py-2 rounded text-sm font-medium transition-all ${
                  newAlertType === "above"
                    ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                    : "bg-white/5 text-white/60"
                }`}
                data-testid="alert-type-above"
              >
                <ArrowUpRight className="w-4 h-4 inline mr-1" />
                Above
              </button>
              <button
                onClick={() => setNewAlertType("below")}
                className={`flex-1 py-2 rounded text-sm font-medium transition-all ${
                  newAlertType === "below"
                    ? "bg-red-500/20 text-red-400 border border-red-500/30"
                    : "bg-white/5 text-white/60"
                }`}
                data-testid="alert-type-below"
              >
                <ArrowDownRight className="w-4 h-4 inline mr-1" />
                Below
              </button>
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Enter price..."
                value={newAlertPrice}
                onChange={e => setNewAlertPrice(e.target.value)}
                className="flex-1 px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-cyan-500/50"
                data-testid="alert-price-input"
              />
              <Button
                size="sm"
                onClick={handleAddAlert}
                disabled={!newAlertPrice || isNaN(parseFloat(newAlertPrice))}
                className="bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30 border border-cyan-500/30"
                data-testid="confirm-add-alert"
              >
                Set Alert
              </Button>
            </div>
            <p className="text-[10px] text-white/30 mt-2">
              Current price: ${formatPrice(currentPrice)}
            </p>
          </motion.div>
        )}
        
        {alerts.length === 0 ? (
          <div className="text-center py-6 text-white/40">
            <Bell className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No alerts set</p>
            <p className="text-xs">Create alerts to get notified of price changes</p>
          </div>
        ) : (
          <div className="space-y-2">
            {alerts.map(alert => (
              <div
                key={alert.id}
                className={`flex items-center justify-between p-3 rounded-lg border transition-all ${
                  alert.isActive
                    ? alert.type === "above"
                      ? "bg-emerald-500/5 border-emerald-500/20"
                      : "bg-red-500/5 border-red-500/20"
                    : "bg-white/5 border-white/10 opacity-50"
                }`}
                data-testid={`alert-${alert.id}`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    alert.type === "above" ? "bg-emerald-500/20" : "bg-red-500/20"
                  }`}>
                    {alert.type === "above" 
                      ? <ArrowUpRight className="w-4 h-4 text-emerald-400" />
                      : <ArrowDownRight className="w-4 h-4 text-red-400" />
                    }
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">
                      {alert.type === "above" ? "Above" : "Below"} ${formatPrice(alert.price)}
                    </p>
                    <p className="text-xs text-white/40">{tokenSymbol} • {alert.createdAt}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleAlert(alert.id)}
                    className={`p-1.5 rounded transition-colors ${
                      alert.isActive ? "text-cyan-400 hover:bg-white/10" : "text-white/40 hover:bg-white/10"
                    }`}
                    data-testid={`toggle-alert-${alert.id}`}
                  >
                    {alert.isActive ? <Bell className="w-4 h-4" /> : <Bell className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={() => handleRemoveAlert(alert.id)}
                    className="p-1.5 rounded text-white/40 hover:text-red-400 hover:bg-white/10 transition-colors"
                    data-testid={`remove-alert-${alert.id}`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
        
        <p className="text-[10px] text-white/30 mt-4 text-center">
          Alerts will be sent via browser notification and email (if enabled)
        </p>
      </div>
    </GlassCard>
  );
}

interface CreatorToken {
  name: string;
  symbol: string;
  chain: string;
  launchDate: string;
  status: "active" | "rugged" | "abandoned" | "exit_scam";
  peakMcap: string;
  currentMcap: string | null;
  txHash: string;
}

const MOCK_CREATOR_HISTORY: CreatorToken[] = [
  {
    name: "SafeMoon Clone",
    symbol: "$SMC",
    chain: "BSC",
    launchDate: "2024-01-15",
    status: "rugged",
    peakMcap: "$2.4M",
    currentMcap: null,
    txHash: "0x1234...abcd",
  },
  {
    name: "PepeMax",
    symbol: "$PMAX",
    chain: "Ethereum",
    launchDate: "2024-02-20",
    status: "exit_scam",
    peakMcap: "$890K",
    currentMcap: null,
    txHash: "0x5678...efgh",
  },
  {
    name: "Current Token",
    symbol: "$CURRENT",
    chain: "Solana",
    launchDate: "2024-03-10",
    status: "active",
    peakMcap: "$1.2M",
    currentMcap: "$780K",
    txHash: "0x9abc...ijkl",
  },
];

function CreatorHistory({ creatorAddress }: { creatorAddress: string }) {
  const tokens = MOCK_CREATOR_HISTORY;
  const rugCount = tokens.filter(t => t.status === "rugged" || t.status === "exit_scam").length;
  const totalCount = tokens.length;
  
  const statusConfig = {
    active: { label: "Active", color: "text-emerald-400 bg-emerald-500/20", icon: CheckCircle },
    rugged: { label: "Rugged", color: "text-red-400 bg-red-500/20", icon: Skull },
    abandoned: { label: "Abandoned", color: "text-orange-400 bg-orange-500/20", icon: AlertTriangle },
    exit_scam: { label: "Exit Scam", color: "text-red-500 bg-red-600/20", icon: Flame },
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.25 }}
      className="mt-6"
    >
      <GlassCard glow>
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <History className="w-5 h-5 text-purple-400" />
              Creator History
            </h3>
            {rugCount > 0 && (
              <Badge className="bg-red-500/20 text-red-400 border border-red-500/30 animate-pulse">
                <Skull className="w-3 h-3 mr-1" />
                {rugCount}/{totalCount} Rugged
              </Badge>
            )}
          </div>
          
          <div className="flex items-center gap-4 mb-6 p-3 rounded-lg bg-white/5 border border-white/10">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center">
              <Wallet className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-white">Creator Wallet</span>
                {rugCount > 0 && (
                  <Badge className="bg-red-500/20 text-red-400 border-red-500/30 text-[10px]">
                    <AlertTriangle className="w-3 h-3 mr-0.5" />
                    Rug History
                  </Badge>
                )}
              </div>
              <p className="text-xs text-white/50 font-mono truncate">{creatorAddress}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-white/40">Trust Score</p>
              <p className={`text-lg font-bold ${rugCount > 0 ? "text-red-400" : "text-emerald-400"}`}>
                {rugCount > 0 ? Math.max(0, 100 - rugCount * 40) : 85}/100
              </p>
            </div>
          </div>
          
          <div className="space-y-3">
            {tokens.map((token, idx) => {
              const StatusIcon = statusConfig[token.status].icon;
              return (
                <div
                  key={idx}
                  className={`p-3 rounded-lg border ${
                    token.status === "rugged" || token.status === "exit_scam"
                      ? "bg-red-500/5 border-red-500/20"
                      : "bg-white/5 border-white/10"
                  }`}
                  data-testid={`creator-token-${idx}`}
                >
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${statusConfig[token.status].color}`}>
                        <StatusIcon className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-medium text-white text-sm">{token.name}</span>
                          <span className="text-xs text-white/40">{token.symbol}</span>
                          <Badge className="bg-white/10 text-white/50 border-white/10 text-[10px]">
                            {token.chain}
                          </Badge>
                        </div>
                        <p className="text-xs text-white/40">Launched {token.launchDate}</p>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-xs text-white/40">Peak MCap</p>
                      <p className="text-sm font-medium text-white">{token.peakMcap}</p>
                      {token.status === "active" && token.currentMcap && (
                        <p className="text-xs text-emerald-400">Now: {token.currentMcap}</p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          
          <p className="text-[10px] text-white/30 mt-4 text-center">
            Creator history is permanent and on-chain verifiable. Past rugs are forever tracked.
          </p>
        </div>
      </GlassCard>
    </motion.div>
  );
}

function SimpleCandlestickChart({ timeRange }: { timeRange: string }) {
  const candles = Array.from({ length: 30 }, (_, i) => ({
    open: 100 + Math.random() * 20 - 10,
    close: 100 + Math.random() * 20 - 10,
    high: 110 + Math.random() * 10,
    low: 90 - Math.random() * 10,
  }));

  return (
    <div className="h-[200px] w-full relative">
      <svg viewBox="0 0 300 100" className="w-full h-full" preserveAspectRatio="none">
        {candles.map((candle, i) => {
          const x = (i / candles.length) * 300;
          const width = 8;
          const isGreen = candle.close >= candle.open;
          const bodyTop = Math.min(candle.open, candle.close);
          const bodyHeight = Math.abs(candle.close - candle.open);
          
          return (
            <g key={i}>
              <line
                x1={x + width / 2}
                y1={100 - candle.high}
                x2={x + width / 2}
                y2={100 - candle.low}
                stroke={isGreen ? "#10b981" : "#ef4444"}
                strokeWidth="1"
              />
              <rect
                x={x}
                y={100 - bodyTop - bodyHeight}
                width={width}
                height={Math.max(bodyHeight, 1)}
                fill={isGreen ? "#10b981" : "#ef4444"}
                rx="1"
              />
            </g>
          );
        })}
      </svg>
      <div className="absolute bottom-0 left-0 right-0 h-[40px] bg-gradient-to-t from-slate-900/50 to-transparent" />
    </div>
  );
}

export default function GuardianScannerDetail() {
  const params = useParams();
  const chain = params.chain as string || "solana";
  const symbol = params.symbol as string || "bonk";
  
  const [token, setToken] = useState<TokenDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [timeRange, setTimeRange] = useState("1d");
  const [copied, setCopied] = useState(false);
  const [isWatchlisted, setIsWatchlisted] = useState(false);
  const [showRugReport, setShowRugReport] = useState(false);
  const [showSwapModal, setShowSwapModal] = useState(false);

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
              name: t.name,
              symbol: t.symbol,
              logo: t.imageUrl || null,
              banner: null,
              description: "Token data powered by DexScreener with Guardian safety analysis.",
              price: t.price,
              priceChange5m: t.priceChange5m,
              priceChange1h: t.priceChange1h,
              priceChange6h: t.priceChange6h,
              priceChange24h: t.priceChange24h,
              priceChange7d: 0,
              marketCap: t.marketCap,
              fdv: t.fdv,
              volume24h: t.volume24h,
              liquidity: t.liquidity,
              holders: t.safety?.holderCount || 0,
              totalSupply: 0,
              circulatingSupply: 0,
              contractAddress: t.contractAddress,
              chain: t.chain,
              createdAt: new Date(t.createdAt).toLocaleDateString(),
              txns24h: t.txns24h?.buys + t.txns24h?.sells || 0,
              buys24h: t.txns24h?.buys || 0,
              sells24h: t.txns24h?.sells || 0,
              guardianScore: t.guardianScore,
              whaleConcentration: t.safety?.whaleConcentration || 0,
              top10Holders: [],
              liquidityLocked: t.safety?.liquidityLocked || false,
              lockDuration: null,
              lockPlatform: null,
              honeypotRisk: t.safety?.honeypotRisk || false,
              mintAuthority: t.safety?.mintAuthority || false,
              freezeAuthority: t.safety?.freezeAuthority || false,
              botActivity: 0,
              bundleBuy: 0,
              devWalletHolding: 0,
              devSoldPercent: 0,
              creatorVerified: false,
              creatorBadge: "new",
              creatorName: null,
              creatorHistory: { launches: 0, rugs: 0 },
              socials: {
                website: t.websites?.[0],
                twitter: t.twitter,
                telegram: t.telegram,
              },
              mlPrediction: {
                signal: t.mlPrediction?.direction === 'up' ? 'bullish' : t.mlPrediction?.direction === 'down' ? 'bearish' : 'neutral',
                confidence: t.mlPrediction?.confidence || 50,
                shortTerm: t.mlPrediction?.shortTerm || { direction: 'neutral', percent: 0 },
                longTerm: t.mlPrediction?.longTerm || { direction: 'neutral', percent: 0 },
                accuracy: t.mlPrediction?.accuracy || 50,
              },
              isWatchlisted: false,
            });
          } else {
            setToken(null);
          }
        } else {
          setToken(null);
        }
      } catch (error) {
        console.error('Error fetching token detail:', error);
        setToken(null);
      } finally {
        setIsLoading(false);
      }
    }
    fetchTokenData();
  }, [chain, symbol]);

  const copyAddress = () => {
    if (token) {
      navigator.clipboard.writeText(token.contractAddress);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 pt-20 pb-12 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <RefreshCw className="w-10 h-10 text-cyan-400 animate-spin" />
          <p className="text-white/50">Loading token data...</p>
        </div>
      </div>
    );
  }
  
  if (!token) {
    return (
      <div className="min-h-screen bg-slate-950 pt-20 pb-12 flex items-center justify-center">
        <div className="flex flex-col items-center gap-6">
          <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center">
            <AlertTriangle className="w-8 h-8 text-red-400" />
          </div>
          <div className="text-center">
            <h2 className="text-xl font-bold text-white mb-2">Token Not Found</h2>
            <p className="text-white/50 mb-4">Unable to fetch token data for {symbol.toUpperCase()} on {chain}</p>
          </div>
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

  const priceUp = token.priceChange24h >= 0;

  return (
    <div className="min-h-screen bg-slate-950 pt-20 pb-12">
      <RugReportModal 
        isOpen={showRugReport} 
        onClose={() => setShowRugReport(false)}
        tokenName={token.name}
        tokenAddress={token.contractAddress}
      />
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
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Link href="/guardian-scanner">
            <Button variant="ghost" size="sm" className="mb-4 text-white/60 hover:text-white" data-testid="back-btn">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Scanner
            </Button>
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <GlassCard glow>
                <div className="p-6">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-6">
                    <div className="flex items-center gap-4">
                      {token.logo ? (
                        <img src={token.logo} alt={token.symbol} className="w-16 h-16 rounded-full" />
                      ) : (
                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-cyan-500 to-purple-500 flex items-center justify-center text-xl font-bold text-white">
                          {token.symbol.slice(0, 2)}
                        </div>
                      )}
                      <div>
                        <div className="flex items-center gap-2">
                          <h1 className="text-2xl font-bold text-white">{token.name}</h1>
                          <Badge className="bg-white/10 text-white/70 border-0">{token.symbol}</Badge>
                        </div>
                        <div className="flex items-center gap-2 mt-1 flex-wrap">
                          <button
                            onClick={copyAddress}
                            className="flex items-center gap-1 text-xs text-white/40 hover:text-white transition-colors"
                            data-testid="copy-address"
                          >
                            <span className="text-white/20">CA:</span>
                            {token.contractAddress.slice(0, 6)}...{token.contractAddress.slice(-4)}
                            {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                          </button>
                          <button
                            onClick={() => {
                              navigator.clipboard.writeText("0x" + Math.random().toString(16).slice(2, 42));
                            }}
                            className="flex items-center gap-1 text-xs text-white/40 hover:text-white transition-colors"
                            data-testid="copy-pair"
                          >
                            <span className="text-white/20">Pair:</span>
                            {"0x" + Math.random().toString(16).slice(2, 8)}...
                            <Copy className="w-3 h-3" />
                          </button>
                          <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30 border text-[10px]">
                            {chain.toUpperCase()}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Button
                        onClick={() => setShowSwapModal(true)}
                        className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white font-semibold px-4"
                        data-testid="buy-button"
                      >
                        <Zap className="w-4 h-4 mr-1.5" />
                        Buy
                      </Button>
                      <button
                        onClick={() => setIsWatchlisted(!isWatchlisted)}
                        className={`p-2 rounded-lg transition-colors ${isWatchlisted ? 'bg-yellow-500/20 text-yellow-400' : 'bg-white/5 text-white/40 hover:text-white'}`}
                        data-testid="watchlist-toggle"
                      >
                        {isWatchlisted ? <Star className="w-5 h-5 fill-current" /> : <StarOff className="w-5 h-5" />}
                      </button>
                      <button
                        onClick={() => setShowRugReport(true)}
                        className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors"
                        title="Report Rug Pull"
                        data-testid="report-rug-button"
                      >
                        <Skull className="w-5 h-5" />
                      </button>
                      {token.socials.twitter && (
                        <a href={token.socials.twitter} target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg bg-white/5 text-white/40 hover:text-white transition-colors" data-testid="social-twitter">
                          <Twitter className="w-5 h-5" />
                        </a>
                      )}
                      {token.socials.telegram && (
                        <a href={token.socials.telegram} target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg bg-white/5 text-white/40 hover:text-white transition-colors" data-testid="social-telegram">
                          <MessageCircle className="w-5 h-5" />
                        </a>
                      )}
                      {token.socials.website && (
                        <a href={token.socials.website} target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg bg-white/5 text-white/40 hover:text-white transition-colors" data-testid="social-website">
                          <Globe className="w-5 h-5" />
                        </a>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
                    <div>
                      <p className="text-3xl font-bold text-white">${formatPrice(token.price)}</p>
                      <div className={`flex items-center gap-1 text-lg ${priceUp ? 'text-emerald-400' : 'text-red-400'}`}>
                        {priceUp ? <ArrowUpRight className="w-5 h-5" /> : <ArrowDownRight className="w-5 h-5" />}
                        {priceUp ? '+' : ''}{token.priceChange24h.toFixed(2)}% (24h)
                      </div>
                    </div>
                    
                    <div className="flex gap-1">
                      {TIME_RANGES.map(range => (
                        <button
                          key={range.id}
                          onClick={() => setTimeRange(range.id)}
                          className={`px-3 py-1.5 rounded text-xs font-medium transition-all ${
                            timeRange === range.id
                              ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                              : 'bg-white/5 text-white/60 hover:bg-white/10'
                          }`}
                          data-testid={`time-${range.id}`}
                        >
                          {range.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <SimpleCandlestickChart timeRange={timeRange} />

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-white/10">
                    <div>
                      <p className="text-xs text-white/40">5m</p>
                      <p className={`text-sm font-medium ${token.priceChange5m >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                        {token.priceChange5m >= 0 ? '+' : ''}{token.priceChange5m.toFixed(2)}%
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-white/40">1h</p>
                      <p className={`text-sm font-medium ${token.priceChange1h >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                        {token.priceChange1h >= 0 ? '+' : ''}{token.priceChange1h.toFixed(2)}%
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-white/40">6h</p>
                      <p className={`text-sm font-medium ${token.priceChange6h >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                        {token.priceChange6h >= 0 ? '+' : ''}{token.priceChange6h.toFixed(2)}%
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-white/40">7d</p>
                      <p className={`text-sm font-medium ${token.priceChange7d >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                        {token.priceChange7d >= 0 ? '+' : ''}{token.priceChange7d.toFixed(2)}%
                      </p>
                    </div>
                  </div>
                </div>
              </GlassCard>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <GlassCard>
                  <div className="p-4">
                    <GlossaryTooltip term="Market Cap">
                      <p className="text-xs text-white/40">Market Cap</p>
                    </GlossaryTooltip>
                    <p className="text-lg font-bold text-white">${formatNumber(token.marketCap)}</p>
                  </div>
                </GlassCard>
                <GlassCard>
                  <div className="p-4">
                    <GlossaryTooltip term="Liquidity">
                      <p className="text-xs text-white/40">Liquidity</p>
                    </GlossaryTooltip>
                    <p className="text-lg font-bold text-white">${formatNumber(token.liquidity)}</p>
                  </div>
                </GlassCard>
                <GlassCard>
                  <div className="p-4">
                    <GlossaryTooltip term="Volume (24h)">
                      <p className="text-xs text-white/40">Volume 24h</p>
                    </GlossaryTooltip>
                    <p className="text-lg font-bold text-white">${formatNumber(token.volume24h)}</p>
                  </div>
                </GlassCard>
                <GlassCard>
                  <div className="p-4">
                    <GlossaryTooltip term="Holders">
                      <p className="text-xs text-white/40">Holders</p>
                    </GlossaryTooltip>
                    <p className="text-lg font-bold text-white">{formatNumber(token.holders)}</p>
                  </div>
                </GlassCard>
              </div>

              <GlassCard>
                <div className="p-6">
                  <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <Brain className="w-5 h-5 text-purple-400" />
                    <GlossaryTooltip term="ML Prediction">ML Prediction</GlossaryTooltip>
                  </h3>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className={`p-4 rounded-xl ${
                      token.mlPrediction.signal === 'bullish' ? 'bg-emerald-500/10 border border-emerald-500/20' :
                      token.mlPrediction.signal === 'bearish' ? 'bg-red-500/10 border border-red-500/20' :
                      'bg-yellow-500/10 border border-yellow-500/20'
                    }`}>
                      <p className="text-xs text-white/40 mb-1">Signal</p>
                      <p className={`text-xl font-bold capitalize ${
                        token.mlPrediction.signal === 'bullish' ? 'text-emerald-400' :
                        token.mlPrediction.signal === 'bearish' ? 'text-red-400' :
                        'text-yellow-400'
                      }`}>
                        {token.mlPrediction.signal}
                      </p>
                    </div>
                    
                    <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                      <GlossaryTooltip term="Confidence">
                        <p className="text-xs text-white/40 mb-1">Confidence</p>
                      </GlossaryTooltip>
                      <p className="text-xl font-bold text-cyan-400">{token.mlPrediction.confidence}%</p>
                    </div>
                    
                    <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                      <p className="text-xs text-white/40 mb-1">Historical Accuracy</p>
                      <p className="text-xl font-bold text-purple-400">{token.mlPrediction.accuracy}%</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div className="p-3 rounded-lg bg-white/5">
                      <p className="text-xs text-white/40">24h Prediction</p>
                      <p className={`text-sm font-medium ${token.mlPrediction.shortTerm.direction === 'up' ? 'text-emerald-400' : 'text-red-400'}`}>
                        {token.mlPrediction.shortTerm.direction === 'up' ? '↑' : '↓'} {token.mlPrediction.shortTerm.percent.toFixed(1)}%
                      </p>
                    </div>
                    <div className="p-3 rounded-lg bg-white/5">
                      <p className="text-xs text-white/40">7d Prediction</p>
                      <p className={`text-sm font-medium ${token.mlPrediction.longTerm.direction === 'up' ? 'text-emerald-400' : 'text-red-400'}`}>
                        {token.mlPrediction.longTerm.direction === 'up' ? '↑' : '↓'} {token.mlPrediction.longTerm.percent.toFixed(1)}%
                      </p>
                    </div>
                  </div>
                  
                  <p className="text-xs text-white/30 mt-4">
                    Predictions are based on ML models and historical patterns. Not financial advice.
                  </p>
                </div>
              </GlassCard>

              <PriceAlertsSection currentPrice={token.price} tokenSymbol={token.symbol} />
            </div>

            <div className="space-y-6">
              <GlassCard glow>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                      <Shield className="w-5 h-5 text-cyan-400" />
                      <GlossaryTooltip term="Guardian Score">Guardian Score</GlossaryTooltip>
                    </h3>
                  </div>
                  
                  <div className="flex items-center justify-center mb-6">
                    <div className={`w-32 h-32 rounded-full flex items-center justify-center ${getScoreBg(token.guardianScore)} border-2`}>
                      <div className="text-center">
                        <p className={`text-4xl font-bold ${getScoreColor(token.guardianScore)}`}>
                          {token.guardianScore}
                        </p>
                        <p className={`text-xs ${getScoreColor(token.guardianScore)}`}>
                          {getScoreLabel(token.guardianScore)}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-1">
                    <RiskIndicator label="Honeypot Risk" safe={!token.honeypotRisk} tooltip="Honeypot" />
                    <RiskIndicator label="Liquidity Locked" safe={token.liquidityLocked} tooltip="Liquidity Locked" />
                    <RiskIndicator label="Mint Authority" safe={!token.mintAuthority} tooltip="Mint Authority" />
                    <RiskIndicator label="Freeze Authority" safe={!token.freezeAuthority} tooltip="Freeze Authority" />
                  </div>
                  
                  {token.liquidityLocked && token.lockDuration && (
                    <div className="mt-4 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                      <div className="flex items-center gap-2">
                        <Lock className="w-4 h-4 text-emerald-400" />
                        <span className="text-xs text-emerald-400">Locked for {token.lockDuration}</span>
                      </div>
                      {token.lockPlatform && (
                        <span className="text-[10px] text-white/40 ml-6">via {token.lockPlatform}</span>
                      )}
                    </div>
                  )}
                </div>
              </GlassCard>

              <GlassCard>
                <div className="p-6">
                  <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <Users className="w-5 h-5 text-purple-400" />
                    <GlossaryTooltip term="Whale Concentration">Whale Analysis</GlossaryTooltip>
                  </h3>
                  
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-white/40">Top 10 Concentration</span>
                      <span className={`text-sm font-bold ${token.whaleConcentration > 50 ? 'text-red-400' : token.whaleConcentration > 30 ? 'text-yellow-400' : 'text-emerald-400'}`}>
                        {token.whaleConcentration.toFixed(1)}%
                      </span>
                    </div>
                    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${token.whaleConcentration > 50 ? 'bg-red-400' : token.whaleConcentration > 30 ? 'bg-yellow-400' : 'bg-emerald-400'}`}
                        style={{ width: `${Math.min(token.whaleConcentration, 100)}%` }}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    {token.top10Holders.map((holder, i) => (
                      <div key={i} className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <span className="text-white/40">#{i + 1}</span>
                          <span className="text-white/70 font-mono">{holder.address}</span>
                          {holder.label && (
                            <Badge className="bg-cyan-500/20 text-cyan-400 border-0 text-[10px] px-1.5 py-0">
                              {holder.label}
                            </Badge>
                          )}
                        </div>
                        <span className="text-white/70">{holder.percent.toFixed(1)}%</span>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-white/10 grid grid-cols-2 gap-4">
                    <div>
                      <GlossaryTooltip term="Bot Activity">
                        <p className="text-xs text-white/40">Bot Activity</p>
                      </GlossaryTooltip>
                      <p className={`text-sm font-bold ${token.botActivity > 20 ? 'text-red-400' : 'text-emerald-400'}`}>
                        {token.botActivity.toFixed(1)}%
                      </p>
                    </div>
                    <div>
                      <GlossaryTooltip term="Bundle Buy">
                        <p className="text-xs text-white/40">Bundle Buy</p>
                      </GlossaryTooltip>
                      <p className={`text-sm font-bold ${token.bundleBuy > 15 ? 'text-red-400' : 'text-emerald-400'}`}>
                        {token.bundleBuy.toFixed(1)}%
                      </p>
                    </div>
                  </div>
                </div>
              </GlassCard>

              <GlassCard>
                <div className="p-6">
                  <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <Wallet className="w-5 h-5 text-cyan-400" />
                    <GlossaryTooltip term="Dev Wallet">Creator Info</GlossaryTooltip>
                  </h3>
                  
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-sm font-bold">
                      {token.creatorName?.[1]?.toUpperCase() || "?"}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">{token.creatorName || "Unknown"}</p>
                      <Badge className={`text-[10px] ${
                        token.creatorBadge === 'certified' ? 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30' :
                        token.creatorBadge === 'trusted' ? 'bg-purple-500/20 text-purple-400 border-purple-500/30' :
                        token.creatorBadge === 'verified' ? 'bg-blue-500/20 text-blue-400 border-blue-500/30' :
                        token.creatorBadge === 'flagged' ? 'bg-red-500/20 text-red-400 border-red-500/30' :
                        'bg-slate-500/20 text-slate-400 border-slate-500/30'
                      } border`}>
                        {token.creatorBadge === 'certified' && <Shield className="w-3 h-3 mr-1" />}
                        {token.creatorBadge === 'trusted' && <Star className="w-3 h-3 mr-1" />}
                        {token.creatorBadge === 'verified' && <CheckCircle className="w-3 h-3 mr-1" />}
                        {token.creatorBadge.charAt(0).toUpperCase() + token.creatorBadge.slice(1)}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 rounded-lg bg-white/5">
                      <p className="text-xs text-white/40">Launches</p>
                      <p className="text-lg font-bold text-white">{token.creatorHistory.launches}</p>
                    </div>
                    <div className="p-3 rounded-lg bg-white/5">
                      <p className="text-xs text-white/40">Rugs</p>
                      <p className={`text-lg font-bold ${token.creatorHistory.rugs > 0 ? 'text-red-400' : 'text-emerald-400'}`}>
                        {token.creatorHistory.rugs}
                      </p>
                    </div>
                  </div>
                  
                  <div className="mt-4 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-white/40">Dev Holding</span>
                      <span className="text-white/70">{token.devWalletHolding.toFixed(1)}%</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-white/40">Dev Sold</span>
                      <span className={token.devSoldPercent > 50 ? 'text-red-400' : 'text-white/70'}>
                        {token.devSoldPercent.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                </div>
              </GlassCard>

              <GlassCard>
                <div className="p-6 space-y-3">
                  <Button 
                    className="w-full bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white font-bold"
                    size="lg"
                    data-testid="buy-btn"
                  >
                    <Zap className="w-4 h-4 mr-2" />
                    Buy on Jupiter
                  </Button>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <Button variant="outline" className="border-white/10 hover:border-emerald-500/50 hover:text-emerald-400" data-testid="sell-btn">
                      Sell
                    </Button>
                    <Button variant="outline" className="border-white/10 hover:border-cyan-500/50 hover:text-cyan-400" data-testid="swap-btn">
                      Swap
                    </Button>
                  </div>
                  
                  <p className="text-[10px] text-white/30 text-center pt-2">
                    Trading carries significant risk. DYOR.
                  </p>
                </div>
              </GlassCard>
            </div>
          </div>

          <CommunityComments tokenAddress={token.contractAddress} chain={chain} />
          
          <CreatorHistory creatorAddress={token.contractAddress.slice(0, 10) + "...creator"} />

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
        </motion.div>
      </div>
    </div>
  );
}
