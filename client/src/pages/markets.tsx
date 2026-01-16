import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  TrendingUp, 
  TrendingDown, 
  Minus,
  Shield, 
  AlertTriangle,
  Zap,
  Bot,
  Activity,
  ChevronDown,
  ChevronUp,
  Search,
  Info,
  Lock,
  Sparkles,
  BarChart3,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Users,
  Wallet,
  Clock,
  FileCheck,
  Code,
  Eye,
  Coins,
  PieChart,
  TrendingUp as Trending,
  ExternalLink,
  Copy,
  History,
  Fingerprint,
  ShieldCheck,
  ShieldAlert,
  ShieldX,
  Flame,
  Droplets,
  Scale,
  UserCheck,
  Building2,
  GitBranch
} from "lucide-react";
import { BackButton } from "@/components/page-nav";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Link } from "wouter";

interface SecurityCheck {
  name: string;
  status: "pass" | "warning" | "fail" | "info";
  detail: string;
  icon: React.ReactNode;
}

interface TokenData {
  id: string;
  name: string;
  symbol: string;
  price: number;
  change24h: number;
  volume24h: number;
  marketCap: number;
  liquidity: number;
  guardianScore: string;
  guardianDetails: { security: number; liquidity: number; transparency: number; team: number };
  pulseSignal: string;
  pulseProbability: number;
  botActivity: number;
  holderCount: number;
  topHolderPercent: number;
  isVerified: boolean;
  hasUtility: boolean;
  logo: string;
  contractAddress: string;
  deployedDate: string;
  creatorAddress: string;
  creatorHistory: { projects: number; rugs: number; successRate: number };
  securityChecks: {
    immutable: { status: "pass" | "warning" | "fail"; detail: string };
    ownershipRenounced: { status: "pass" | "warning" | "fail"; detail: string };
    mintDisabled: { status: "pass" | "warning" | "fail"; detail: string };
    noBlacklist: { status: "pass" | "warning" | "fail"; detail: string };
    honeypotFree: { status: "pass" | "warning" | "fail"; detail: string };
    taxAnalysis: { buyTax: number; sellTax: number; status: "pass" | "warning" | "fail" };
    liquidityLocked: { status: "pass" | "warning" | "fail"; lockDuration: string; platform: string };
    auditStatus: { status: "pass" | "warning" | "fail"; auditor: string; date: string; issues: number };
    proxyContract: { status: "pass" | "warning" | "fail"; detail: string };
  };
  holderDistribution: {
    top10Percent: number;
    top50Percent: number;
    uniqueHolders: number;
    whaleCount: number;
  };
  tradingMetrics: {
    buyPressure: number;
    avgTradeSize: number;
    txCount24h: number;
    priceImpact1k: number;
  };
}

const MARKET_TOKENS: TokenData[] = [
  {
    id: "dwc",
    name: "DarkWave Coin",
    symbol: "DWC",
    price: 0.001,
    change24h: 12.5,
    volume24h: 1250000,
    marketCap: 1000000,
    liquidity: 500000,
    guardianScore: "A",
    guardianDetails: { security: 95, liquidity: 88, transparency: 92, team: 90 },
    pulseSignal: "bullish",
    pulseProbability: 78,
    botActivity: 12,
    holderCount: 8500,
    topHolderPercent: 15,
    isVerified: true,
    hasUtility: true,
    logo: "⚡",
    contractAddress: "0xDWC...7a3f",
    deployedDate: "2024-01-15",
    creatorAddress: "0xDarkWave...Labs",
    creatorHistory: { projects: 5, rugs: 0, successRate: 100 },
    securityChecks: {
      immutable: { status: "pass", detail: "Contract is not upgradeable" },
      ownershipRenounced: { status: "pass", detail: "Ownership renounced to burn address" },
      mintDisabled: { status: "pass", detail: "Max supply capped at 1B tokens" },
      noBlacklist: { status: "pass", detail: "No blacklist function detected" },
      honeypotFree: { status: "pass", detail: "Sell function verified working" },
      taxAnalysis: { buyTax: 0, sellTax: 0, status: "pass" },
      liquidityLocked: { status: "pass", lockDuration: "Permanent", platform: "Guardian Vault" },
      auditStatus: { status: "pass", auditor: "Guardian Security", date: "2024-01-10", issues: 0 },
      proxyContract: { status: "pass", detail: "No proxy pattern detected" },
    },
    holderDistribution: { top10Percent: 15, top50Percent: 35, uniqueHolders: 8500, whaleCount: 12 },
    tradingMetrics: { buyPressure: 68, avgTradeSize: 1250, txCount24h: 4520, priceImpact1k: 0.02 },
  },
  {
    id: "stDWC",
    name: "Staked DarkWave",
    symbol: "stDWC",
    price: 0.00105,
    change24h: 8.2,
    volume24h: 450000,
    marketCap: 420000,
    liquidity: 210000,
    guardianScore: "A",
    guardianDetails: { security: 98, liquidity: 85, transparency: 95, team: 90 },
    pulseSignal: "bullish",
    pulseProbability: 82,
    botActivity: 8,
    holderCount: 3200,
    topHolderPercent: 22,
    isVerified: true,
    hasUtility: true,
    logo: "🔒",
    contractAddress: "0xstDWC...8b2e",
    deployedDate: "2024-02-01",
    creatorAddress: "0xDarkWave...Labs",
    creatorHistory: { projects: 5, rugs: 0, successRate: 100 },
    securityChecks: {
      immutable: { status: "pass", detail: "Contract is not upgradeable" },
      ownershipRenounced: { status: "warning", detail: "Multi-sig controlled (3/5)" },
      mintDisabled: { status: "pass", detail: "Minting tied to staking only" },
      noBlacklist: { status: "pass", detail: "No blacklist function detected" },
      honeypotFree: { status: "pass", detail: "Unstaking verified working" },
      taxAnalysis: { buyTax: 0, sellTax: 0, status: "pass" },
      liquidityLocked: { status: "pass", lockDuration: "Permanent", platform: "Guardian Vault" },
      auditStatus: { status: "pass", auditor: "Guardian Security", date: "2024-01-28", issues: 0 },
      proxyContract: { status: "pass", detail: "No proxy pattern detected" },
    },
    holderDistribution: { top10Percent: 22, top50Percent: 42, uniqueHolders: 3200, whaleCount: 8 },
    tradingMetrics: { buyPressure: 72, avgTradeSize: 2100, txCount24h: 890, priceImpact1k: 0.05 },
  },
  {
    id: "chrono",
    name: "ChronoToken",
    symbol: "CHRONO",
    price: 0.0025,
    change24h: -3.4,
    volume24h: 89000,
    marketCap: 250000,
    liquidity: 45000,
    guardianScore: "B",
    guardianDetails: { security: 78, liquidity: 62, transparency: 80, team: 75 },
    pulseSignal: "neutral",
    pulseProbability: 52,
    botActivity: 35,
    holderCount: 1200,
    topHolderPercent: 38,
    isVerified: true,
    hasUtility: true,
    logo: "⏱️",
    contractAddress: "0xCHRONO...4c1d",
    deployedDate: "2024-03-10",
    creatorAddress: "0xChronoLabs...Dev",
    creatorHistory: { projects: 2, rugs: 0, successRate: 100 },
    securityChecks: {
      immutable: { status: "pass", detail: "Contract is not upgradeable" },
      ownershipRenounced: { status: "warning", detail: "Single wallet ownership" },
      mintDisabled: { status: "pass", detail: "Max supply reached" },
      noBlacklist: { status: "warning", detail: "Pause function exists" },
      honeypotFree: { status: "pass", detail: "Sell function verified" },
      taxAnalysis: { buyTax: 2, sellTax: 2, status: "warning" },
      liquidityLocked: { status: "warning", lockDuration: "6 months", platform: "UniCrypt" },
      auditStatus: { status: "warning", auditor: "Pending", date: "-", issues: 0 },
      proxyContract: { status: "pass", detail: "No proxy pattern detected" },
    },
    holderDistribution: { top10Percent: 38, top50Percent: 65, uniqueHolders: 1200, whaleCount: 5 },
    tradingMetrics: { buyPressure: 48, avgTradeSize: 450, txCount24h: 320, priceImpact1k: 0.22 },
  },
  {
    id: "shell",
    name: "Shell Token",
    symbol: "SHELL",
    price: 0.00008,
    change24h: 45.2,
    volume24h: 320000,
    marketCap: 80000,
    liquidity: 25000,
    guardianScore: "C",
    guardianDetails: { security: 65, liquidity: 45, transparency: 70, team: 60 },
    pulseSignal: "bearish",
    pulseProbability: 68,
    botActivity: 72,
    holderCount: 450,
    topHolderPercent: 55,
    isVerified: false,
    hasUtility: false,
    logo: "🐚",
    contractAddress: "0xSHELL...9f2a",
    deployedDate: "2024-06-20",
    creatorAddress: "0xAnon...Wallet",
    creatorHistory: { projects: 1, rugs: 0, successRate: 100 },
    securityChecks: {
      immutable: { status: "warning", detail: "Upgradeable proxy detected" },
      ownershipRenounced: { status: "fail", detail: "Owner can modify contract" },
      mintDisabled: { status: "fail", detail: "Unlimited mint function" },
      noBlacklist: { status: "fail", detail: "Blacklist function detected" },
      honeypotFree: { status: "warning", detail: "High slippage required" },
      taxAnalysis: { buyTax: 5, sellTax: 8, status: "fail" },
      liquidityLocked: { status: "warning", lockDuration: "30 days", platform: "Unknown" },
      auditStatus: { status: "fail", auditor: "None", date: "-", issues: 0 },
      proxyContract: { status: "fail", detail: "Upgradeable proxy pattern" },
    },
    holderDistribution: { top10Percent: 55, top50Percent: 82, uniqueHolders: 450, whaleCount: 3 },
    tradingMetrics: { buyPressure: 75, avgTradeSize: 85, txCount24h: 1250, priceImpact1k: 4.2 },
  },
  {
    id: "orbit",
    name: "Orbit Pay",
    symbol: "ORBIT",
    price: 0.015,
    change24h: 2.1,
    volume24h: 180000,
    marketCap: 750000,
    liquidity: 320000,
    guardianScore: "A",
    guardianDetails: { security: 92, liquidity: 90, transparency: 88, team: 85 },
    pulseSignal: "bullish",
    pulseProbability: 71,
    botActivity: 18,
    holderCount: 5600,
    topHolderPercent: 20,
    isVerified: true,
    hasUtility: true,
    logo: "🌐",
    contractAddress: "0xORBIT...3e7c",
    deployedDate: "2024-02-28",
    creatorAddress: "0xOrbitLabs...Inc",
    creatorHistory: { projects: 3, rugs: 0, successRate: 100 },
    securityChecks: {
      immutable: { status: "pass", detail: "Contract is not upgradeable" },
      ownershipRenounced: { status: "pass", detail: "DAO governed" },
      mintDisabled: { status: "pass", detail: "Fixed supply" },
      noBlacklist: { status: "pass", detail: "No blacklist function" },
      honeypotFree: { status: "pass", detail: "Verified sell function" },
      taxAnalysis: { buyTax: 1, sellTax: 1, status: "pass" },
      liquidityLocked: { status: "pass", lockDuration: "2 years", platform: "Team Finance" },
      auditStatus: { status: "pass", auditor: "CertiK", date: "2024-02-20", issues: 2 },
      proxyContract: { status: "pass", detail: "No proxy pattern" },
    },
    holderDistribution: { top10Percent: 20, top50Percent: 45, uniqueHolders: 5600, whaleCount: 15 },
    tradingMetrics: { buyPressure: 58, avgTradeSize: 890, txCount24h: 780, priceImpact1k: 0.03 },
  },
];

const getGuardianColor = (score: string) => {
  switch (score) {
    case "A": return "from-emerald-500 to-green-500";
    case "B": return "from-blue-500 to-cyan-500";
    case "C": return "from-yellow-500 to-amber-500";
    case "D": return "from-orange-500 to-red-500";
    case "F": return "from-red-600 to-red-800";
    default: return "from-gray-500 to-gray-600";
  }
};

const getPulseIcon = (signal: string) => {
  switch (signal) {
    case "bullish": return <TrendingUp className="w-4 h-4 text-emerald-400" />;
    case "bearish": return <TrendingDown className="w-4 h-4 text-red-400" />;
    default: return <Minus className="w-4 h-4 text-yellow-400" />;
  }
};

const getPulseColor = (signal: string) => {
  switch (signal) {
    case "bullish": return "text-emerald-400 bg-emerald-500/20";
    case "bearish": return "text-red-400 bg-red-500/20";
    default: return "text-yellow-400 bg-yellow-500/20";
  }
};

const getStatusIcon = (status: "pass" | "warning" | "fail" | "info") => {
  switch (status) {
    case "pass": return <CheckCircle2 className="w-5 h-5 text-emerald-400" />;
    case "warning": return <AlertCircle className="w-5 h-5 text-yellow-400" />;
    case "fail": return <XCircle className="w-5 h-5 text-red-400" />;
    default: return <Info className="w-5 h-5 text-blue-400" />;
  }
};

const getStatusBg = (status: "pass" | "warning" | "fail" | "info") => {
  switch (status) {
    case "pass": return "bg-emerald-500/10 border-emerald-500/30";
    case "warning": return "bg-yellow-500/10 border-yellow-500/30";
    case "fail": return "bg-red-500/10 border-red-500/30";
    default: return "bg-blue-500/10 border-blue-500/30";
  }
};

const formatNumber = (num: number) => {
  if (num >= 1000000) return `$${(num / 1000000).toFixed(2)}M`;
  if (num >= 1000) return `$${(num / 1000).toFixed(1)}K`;
  return `$${num.toFixed(2)}`;
};

const SecurityCheckItem = ({ 
  icon, 
  title, 
  status, 
  detail 
}: { 
  icon: React.ReactNode; 
  title: string; 
  status: "pass" | "warning" | "fail"; 
  detail: string;
}) => (
  <motion.div 
    initial={{ opacity: 0, x: -10 }}
    animate={{ opacity: 1, x: 0 }}
    className={`flex items-center gap-3 p-3 rounded-xl border ${getStatusBg(status)}`}
  >
    <div className="flex-shrink-0">{icon}</div>
    <div className="flex-1 min-w-0">
      <div className="flex items-center gap-2">
        <span className="font-medium text-sm">{title}</span>
        {getStatusIcon(status)}
      </div>
      <p className="text-xs text-muted-foreground truncate">{detail}</p>
    </div>
  </motion.div>
);

export default function MarketsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTab, setSelectedTab] = useState("all");
  const [showRiskWarning, setShowRiskWarning] = useState(true);
  const [expandedToken, setExpandedToken] = useState<string | null>(null);

  const filteredTokens = MARKET_TOKENS.filter(token => {
    const matchesSearch = token.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          token.symbol.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (selectedTab === "verified") return matchesSearch && token.isVerified;
    if (selectedTab === "utility") return matchesSearch && token.hasUtility;
    if (selectedTab === "high-risk") return matchesSearch && (token.guardianScore === "C" || token.guardianScore === "D" || token.guardianScore === "F");
    return matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
      {/* Floating ambient orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-pink-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "2s" }} />
        <div className="absolute top-40 right-1/4 w-48 h-48 bg-emerald-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1.5s" }} />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8 max-w-7xl">
        <BackButton />
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 shadow-lg shadow-purple-500/30">
              <BarChart3 className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              DarkWave Markets
            </h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-2">
            Trade with intelligence. Guardian-audited tokens with deep security scanning.
          </p>
          <div className="flex items-center justify-center gap-2 text-sm text-cyan-400">
            <ShieldCheck className="w-4 h-4" />
            <span>9-Point Security Deep Scan</span>
            <span className="text-muted-foreground">•</span>
            <Activity className="w-4 h-4" />
            <span>On-Chain Intelligence</span>
            <span className="text-muted-foreground">•</span>
            <Sparkles className="w-4 h-4" />
            <span>Pulse AI Predictions</span>
          </div>
        </motion.div>

        {/* Risk Disclaimer Banner */}
        <AnimatePresence>
          {showRiskWarning && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-6"
            >
              <Card className="bg-amber-500/10 border-amber-500/30">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <h3 className="font-semibold text-amber-400 mb-1">Risk Disclosure</h3>
                      <p className="text-sm text-muted-foreground">
                        DarkWave Markets provides intelligence, not financial advice. Guardian scores indicate security audits, not investment quality. 
                        Pulse predictions are probabilistic, not guarantees. <strong className="text-amber-300">DYOR. You can still lose everything.</strong> 
                        But at least you'll know what you're walking into.
                      </p>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => setShowRiskWarning(false)}
                      className="text-amber-400 hover:bg-amber-500/20"
                      data-testid="button-dismiss-risk-warning"
                    >
                      Dismiss
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Stats Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8"
        >
          <Card className="bg-white/5 backdrop-blur-xl border-white/10">
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-cyan-400" data-testid="stat-token-count">{MARKET_TOKENS.length}</p>
              <p className="text-xs text-muted-foreground">Listed Tokens</p>
            </CardContent>
          </Card>
          <Card className="bg-white/5 backdrop-blur-xl border-white/10">
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-emerald-400" data-testid="stat-liquidity">$2.1M</p>
              <p className="text-xs text-muted-foreground">Total Liquidity</p>
            </CardContent>
          </Card>
          <Card className="bg-white/5 backdrop-blur-xl border-white/10">
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-purple-400" data-testid="stat-volume">$2.3M</p>
              <p className="text-xs text-muted-foreground">24h Volume</p>
            </CardContent>
          </Card>
          <Card className="bg-white/5 backdrop-blur-xl border-white/10">
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-pink-400" data-testid="stat-holders">19K</p>
              <p className="text-xs text-muted-foreground">Total Holders</p>
            </CardContent>
          </Card>
          <Card className="bg-white/5 backdrop-blur-xl border-white/10 col-span-2 md:col-span-1">
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-amber-400" data-testid="stat-audits">9</p>
              <p className="text-xs text-muted-foreground">Security Checks</p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col md:flex-row gap-4 mb-6"
        >
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search tokens..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-white/5 border-white/10"
              data-testid="input-search-tokens"
            />
          </div>
          <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full md:w-auto">
            <TabsList className="bg-white/5 border border-white/10">
              <TabsTrigger value="all" className="data-[state=active]:bg-white/10" data-testid="tab-filter-all">All</TabsTrigger>
              <TabsTrigger value="verified" className="data-[state=active]:bg-white/10" data-testid="tab-filter-verified">
                <Shield className="w-3 h-3 mr-1" />
                Verified
              </TabsTrigger>
              <TabsTrigger value="utility" className="data-[state=active]:bg-white/10" data-testid="tab-filter-utility">
                <Zap className="w-3 h-3 mr-1" />
                Utility
              </TabsTrigger>
              <TabsTrigger value="high-risk" className="data-[state=active]:bg-white/10" data-testid="tab-filter-high-risk">
                <AlertTriangle className="w-3 h-3 mr-1" />
                High Risk
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </motion.div>

        {/* Token List */}
        <div className="space-y-4">
          {filteredTokens.map((token, index) => (
            <motion.div
              key={token.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * index }}
            >
              <Card 
                className={`bg-white/5 backdrop-blur-xl border-white/10 hover:bg-white/10 transition-all duration-300 cursor-pointer overflow-hidden ${
                  expandedToken === token.id ? 'ring-2 ring-purple-500/50 shadow-lg shadow-purple-500/20' : ''
                }`}
                onClick={() => setExpandedToken(expandedToken === token.id ? null : token.id)}
                data-testid={`card-token-${token.id}`}
              >
                <CardContent className="p-4">
                  {/* Main Row */}
                  <div className="flex items-center gap-4">
                    {/* Token Info */}
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center text-2xl shadow-lg">
                        {token.logo}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold truncate">{token.name}</h3>
                          {token.isVerified && (
                            <Shield className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                          )}
                          {token.hasUtility && (
                            <Zap className="w-4 h-4 text-purple-400 flex-shrink-0" />
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">{token.symbol}</p>
                      </div>
                    </div>

                    {/* Guardian Score */}
                    <div className="hidden sm:flex flex-col items-center">
                      <div className={`w-10 h-10 rounded-lg bg-gradient-to-r ${getGuardianColor(token.guardianScore)} flex items-center justify-center text-white font-bold shadow-lg`} data-testid={`guardian-score-${token.id}`}>
                        {token.guardianScore}
                      </div>
                      <span className="text-xs text-muted-foreground mt-1">Guardian</span>
                    </div>

                    {/* Pulse Signal */}
                    <div className="hidden md:flex flex-col items-center">
                      <div className={`flex items-center gap-1 px-3 py-1.5 rounded-lg ${getPulseColor(token.pulseSignal)}`} data-testid={`pulse-signal-${token.id}`}>
                        {getPulseIcon(token.pulseSignal)}
                        <span className="font-medium text-sm">{token.pulseProbability}%</span>
                      </div>
                      <span className="text-xs text-muted-foreground mt-1">Pulse</span>
                    </div>

                    {/* Price */}
                    <div className="text-right">
                      <p className="font-semibold" data-testid={`price-${token.id}`}>${token.price.toFixed(token.price < 0.01 ? 5 : 4)}</p>
                      <p className={`text-sm ${token.change24h >= 0 ? 'text-emerald-400' : 'text-red-400'}`} data-testid={`change-${token.id}`}>
                        {token.change24h >= 0 ? '+' : ''}{token.change24h.toFixed(1)}%
                      </p>
                    </div>

                    {/* Expand Arrow */}
                    <motion.div
                      animate={{ rotate: expandedToken === token.id ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ChevronDown className="w-5 h-5 text-muted-foreground" />
                    </motion.div>
                  </div>

                  {/* Quick Stats Row */}
                  <div className="flex gap-4 mt-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Droplets className="w-3 h-3" />
                      {formatNumber(token.liquidity)}
                    </span>
                    <span className="flex items-center gap-1">
                      <Activity className="w-3 h-3" />
                      {formatNumber(token.volume24h)}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      {token.holderCount.toLocaleString()}
                    </span>
                    <span className={`flex items-center gap-1 ${token.botActivity > 50 ? 'text-red-400' : token.botActivity > 25 ? 'text-yellow-400' : 'text-emerald-400'}`}>
                      <Bot className="w-3 h-3" />
                      {token.botActivity}% bots
                    </span>
                  </div>

                  {/* Expanded Content */}
                  <AnimatePresence>
                    {expandedToken === token.id && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="mt-6 pt-6 border-t border-white/10"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {/* Contract Info */}
                        <div className="mb-6">
                          <div className="flex items-center gap-2 mb-3">
                            <Code className="w-4 h-4 text-cyan-400" />
                            <span className="font-semibold text-sm">Contract Details</span>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                            <div className="flex items-center gap-2 p-2 rounded-lg bg-white/5">
                              <Fingerprint className="w-4 h-4 text-muted-foreground" />
                              <span className="text-muted-foreground">Address:</span>
                              <span className="font-mono">{token.contractAddress}</span>
                              <Button variant="ghost" size="sm" className="h-6 w-6 p-0 ml-auto" data-testid={`copy-address-${token.id}`}>
                                <Copy className="w-3 h-3" />
                              </Button>
                            </div>
                            <div className="flex items-center gap-2 p-2 rounded-lg bg-white/5">
                              <Clock className="w-4 h-4 text-muted-foreground" />
                              <span className="text-muted-foreground">Deployed:</span>
                              <span>{token.deployedDate}</span>
                            </div>
                            <div className="flex items-center gap-2 p-2 rounded-lg bg-white/5">
                              <UserCheck className="w-4 h-4 text-muted-foreground" />
                              <span className="text-muted-foreground">Creator:</span>
                              <span className="font-mono">{token.creatorAddress}</span>
                            </div>
                          </div>
                        </div>

                        {/* Creator History */}
                        <div className="mb-6">
                          <div className="flex items-center gap-2 mb-3">
                            <History className="w-4 h-4 text-purple-400" />
                            <span className="font-semibold text-sm">Creator History</span>
                          </div>
                          <div className="grid grid-cols-3 gap-3">
                            <div className="text-center p-3 rounded-xl bg-white/5 border border-white/10">
                              <p className="text-2xl font-bold text-cyan-400">{token.creatorHistory.projects}</p>
                              <p className="text-xs text-muted-foreground">Projects</p>
                            </div>
                            <div className="text-center p-3 rounded-xl bg-white/5 border border-white/10">
                              <p className={`text-2xl font-bold ${token.creatorHistory.rugs === 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                                {token.creatorHistory.rugs}
                              </p>
                              <p className="text-xs text-muted-foreground">Rugs</p>
                            </div>
                            <div className="text-center p-3 rounded-xl bg-white/5 border border-white/10">
                              <p className={`text-2xl font-bold ${token.creatorHistory.successRate >= 90 ? 'text-emerald-400' : token.creatorHistory.successRate >= 70 ? 'text-yellow-400' : 'text-red-400'}`}>
                                {token.creatorHistory.successRate}%
                              </p>
                              <p className="text-xs text-muted-foreground">Success Rate</p>
                            </div>
                          </div>
                        </div>

                        {/* Guardian Security Deep Scan */}
                        <div className="mb-6">
                          <div className="flex items-center gap-2 mb-4">
                            <ShieldCheck className="w-5 h-5 text-emerald-400" />
                            <span className="font-semibold">Guardian Security Deep Scan</span>
                            <span className="ml-auto text-xs px-2 py-1 rounded-full bg-purple-500/20 text-purple-400 border border-purple-500/30">
                              9 Checks
                            </span>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                            <SecurityCheckItem
                              icon={<Lock className="w-4 h-4 text-cyan-400" />}
                              title="Contract Immutability"
                              status={token.securityChecks.immutable.status}
                              detail={token.securityChecks.immutable.detail}
                            />
                            <SecurityCheckItem
                              icon={<UserCheck className="w-4 h-4 text-purple-400" />}
                              title="Ownership Status"
                              status={token.securityChecks.ownershipRenounced.status}
                              detail={token.securityChecks.ownershipRenounced.detail}
                            />
                            <SecurityCheckItem
                              icon={<Coins className="w-4 h-4 text-amber-400" />}
                              title="Mint Function"
                              status={token.securityChecks.mintDisabled.status}
                              detail={token.securityChecks.mintDisabled.detail}
                            />
                            <SecurityCheckItem
                              icon={<ShieldX className="w-4 h-4 text-red-400" />}
                              title="Blacklist Function"
                              status={token.securityChecks.noBlacklist.status}
                              detail={token.securityChecks.noBlacklist.detail}
                            />
                            <SecurityCheckItem
                              icon={<Flame className="w-4 h-4 text-orange-400" />}
                              title="Honeypot Detection"
                              status={token.securityChecks.honeypotFree.status}
                              detail={token.securityChecks.honeypotFree.detail}
                            />
                            <SecurityCheckItem
                              icon={<Scale className="w-4 h-4 text-pink-400" />}
                              title="Tax Analysis"
                              status={token.securityChecks.taxAnalysis.status}
                              detail={`Buy: ${token.securityChecks.taxAnalysis.buyTax}% | Sell: ${token.securityChecks.taxAnalysis.sellTax}%`}
                            />
                            <SecurityCheckItem
                              icon={<Droplets className="w-4 h-4 text-blue-400" />}
                              title="Liquidity Lock"
                              status={token.securityChecks.liquidityLocked.status}
                              detail={`${token.securityChecks.liquidityLocked.lockDuration} on ${token.securityChecks.liquidityLocked.platform}`}
                            />
                            <SecurityCheckItem
                              icon={<FileCheck className="w-4 h-4 text-emerald-400" />}
                              title="Audit Status"
                              status={token.securityChecks.auditStatus.status}
                              detail={token.securityChecks.auditStatus.auditor !== "None" ? `${token.securityChecks.auditStatus.auditor} (${token.securityChecks.auditStatus.date})` : "No audit"}
                            />
                            <SecurityCheckItem
                              icon={<GitBranch className="w-4 h-4 text-violet-400" />}
                              title="Proxy Contract"
                              status={token.securityChecks.proxyContract.status}
                              detail={token.securityChecks.proxyContract.detail}
                            />
                          </div>
                        </div>

                        {/* On-Chain Intelligence */}
                        <div className="mb-6">
                          <div className="flex items-center gap-2 mb-4">
                            <Activity className="w-5 h-5 text-cyan-400" />
                            <span className="font-semibold">On-Chain Intelligence</span>
                          </div>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="p-4 rounded-xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10">
                              <div className="flex items-center gap-2 mb-2">
                                <PieChart className="w-4 h-4 text-purple-400" />
                                <span className="text-xs text-muted-foreground">Top 10 Holders</span>
                              </div>
                              <p className={`text-xl font-bold ${token.holderDistribution.top10Percent > 40 ? 'text-red-400' : token.holderDistribution.top10Percent > 25 ? 'text-yellow-400' : 'text-emerald-400'}`}>
                                {token.holderDistribution.top10Percent}%
                              </p>
                              <Progress value={token.holderDistribution.top10Percent} className="h-1 mt-2" />
                            </div>
                            <div className="p-4 rounded-xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10">
                              <div className="flex items-center gap-2 mb-2">
                                <Wallet className="w-4 h-4 text-cyan-400" />
                                <span className="text-xs text-muted-foreground">Whale Wallets</span>
                              </div>
                              <p className="text-xl font-bold text-cyan-400">{token.holderDistribution.whaleCount}</p>
                              <p className="text-xs text-muted-foreground mt-1">holding &gt;1%</p>
                            </div>
                            <div className="p-4 rounded-xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10">
                              <div className="flex items-center gap-2 mb-2">
                                <TrendingUp className="w-4 h-4 text-emerald-400" />
                                <span className="text-xs text-muted-foreground">Buy Pressure</span>
                              </div>
                              <p className={`text-xl font-bold ${token.tradingMetrics.buyPressure > 60 ? 'text-emerald-400' : token.tradingMetrics.buyPressure > 40 ? 'text-yellow-400' : 'text-red-400'}`}>
                                {token.tradingMetrics.buyPressure}%
                              </p>
                              <p className="text-xs text-muted-foreground mt-1">vs sells</p>
                            </div>
                            <div className="p-4 rounded-xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10">
                              <div className="flex items-center gap-2 mb-2">
                                <Activity className="w-4 h-4 text-pink-400" />
                                <span className="text-xs text-muted-foreground">24h Transactions</span>
                              </div>
                              <p className="text-xl font-bold text-pink-400">{token.tradingMetrics.txCount24h.toLocaleString()}</p>
                              <p className="text-xs text-muted-foreground mt-1">avg ${token.tradingMetrics.avgTradeSize}</p>
                            </div>
                          </div>
                        </div>

                        {/* Trading Metrics */}
                        <div className="mb-6">
                          <div className="flex items-center gap-2 mb-4">
                            <BarChart3 className="w-5 h-5 text-pink-400" />
                            <span className="font-semibold">Trading Analytics</span>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="p-4 rounded-xl bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20">
                              <div className="flex justify-between items-center mb-3">
                                <span className="text-sm">Price Impact (on $1,000 buy)</span>
                                <span className={`font-bold ${token.tradingMetrics.priceImpact1k < 0.5 ? 'text-emerald-400' : token.tradingMetrics.priceImpact1k < 2 ? 'text-yellow-400' : 'text-red-400'}`}>
                                  {token.tradingMetrics.priceImpact1k}%
                                </span>
                              </div>
                              <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                                <div 
                                  className={`h-full ${token.tradingMetrics.priceImpact1k < 0.5 ? 'bg-emerald-500' : token.tradingMetrics.priceImpact1k < 2 ? 'bg-yellow-500' : 'bg-red-500'}`}
                                  style={{ width: `${Math.min(token.tradingMetrics.priceImpact1k * 10, 100)}%` }}
                                />
                              </div>
                              <p className="text-xs text-muted-foreground mt-2">
                                {token.tradingMetrics.priceImpact1k < 0.5 ? 'Excellent liquidity' : token.tradingMetrics.priceImpact1k < 2 ? 'Moderate liquidity' : 'Low liquidity - trade carefully'}
                              </p>
                            </div>
                            <div className="p-4 rounded-xl bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-cyan-500/20">
                              <div className="flex justify-between items-center mb-3">
                                <span className="text-sm">Guardian Score Breakdown</span>
                                <span className={`font-bold text-lg bg-gradient-to-r ${getGuardianColor(token.guardianScore)} bg-clip-text text-transparent`}>
                                  {token.guardianScore}
                                </span>
                              </div>
                              <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                  <span className="text-xs w-24">Security</span>
                                  <Progress value={token.guardianDetails.security} className="h-2 flex-1" />
                                  <span className="text-xs w-8">{token.guardianDetails.security}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <span className="text-xs w-24">Liquidity</span>
                                  <Progress value={token.guardianDetails.liquidity} className="h-2 flex-1" />
                                  <span className="text-xs w-8">{token.guardianDetails.liquidity}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <span className="text-xs w-24">Transparency</span>
                                  <Progress value={token.guardianDetails.transparency} className="h-2 flex-1" />
                                  <span className="text-xs w-8">{token.guardianDetails.transparency}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <span className="text-xs w-24">Team</span>
                                  <Progress value={token.guardianDetails.team} className="h-2 flex-1" />
                                  <span className="text-xs w-8">{token.guardianDetails.team}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-wrap gap-3">
                          <Button 
                            className="flex-1 min-w-[140px] bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 shadow-lg shadow-purple-500/30"
                            data-testid={`button-trade-${token.id}`}
                          >
                            Trade {token.symbol}
                          </Button>
                          <Button 
                            variant="outline" 
                            className="bg-white/5 border-white/10"
                            data-testid={`button-chart-${token.id}`}
                          >
                            <Activity className="w-4 h-4 mr-2" />
                            Live Chart
                          </Button>
                          <Button 
                            variant="outline" 
                            className="bg-white/5 border-white/10"
                            data-testid={`button-alerts-${token.id}`}
                          >
                            <Zap className="w-4 h-4 mr-2" />
                            Set Alert
                          </Button>
                          <Button 
                            variant="outline" 
                            className="bg-white/5 border-white/10"
                            data-testid={`button-explorer-${token.id}`}
                          >
                            <ExternalLink className="w-4 h-4 mr-2" />
                            Explorer
                          </Button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Pulse Pro Upsell */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-8"
        >
          <Card className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-purple-500/20 overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-pink-500/5 animate-pulse" />
            <CardContent className="p-6 relative z-10">
              <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="p-4 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 shadow-lg shadow-purple-500/30">
                  <Sparkles className="w-10 h-10 text-white" />
                </div>
                <div className="flex-1 text-center md:text-left">
                  <h3 className="text-xl font-bold mb-2 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                    Unlock Pulse Quantum Predictions
                  </h3>
                  <p className="text-muted-foreground">
                    Get AI-powered price predictions, advanced risk analysis, real-time alerts, and social sentiment tracking. 
                    Make informed decisions with our quantum predictive engine.
                  </p>
                </div>
                <Link href="/pulse">
                  <Button 
                    size="lg" 
                    className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 shadow-lg shadow-purple-500/30"
                    data-testid="button-upgrade-pulse-pro"
                  >
                    <Zap className="w-5 h-5 mr-2" />
                    Upgrade to Pulse Pro
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Legend Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-8 p-4 rounded-xl bg-white/5 border border-white/10"
        >
          <div className="flex flex-wrap justify-center gap-6 text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Pass</span>
            </div>
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-yellow-400" />
              <span>Warning</span>
            </div>
            <div className="flex items-center gap-2">
              <XCircle className="w-4 h-4 text-red-400" />
              <span>Fail</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-gradient-to-r from-emerald-500 to-green-500 flex items-center justify-center text-white font-bold text-xs">A</div>
              <span>Excellent</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold text-xs">B</div>
              <span>Good</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-gradient-to-r from-yellow-500 to-amber-500 flex items-center justify-center text-white font-bold text-xs">C</div>
              <span>Caution</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
