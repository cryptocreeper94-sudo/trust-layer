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
  Search,
  Info,
  Lock,
  Sparkles,
  BarChart3
} from "lucide-react";
import { BackButton } from "@/components/page-nav";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "wouter";

// Mock token data with Guardian scores and Pulse predictions
const MARKET_TOKENS = [
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

const getGuardianBgColor = (score: string) => {
  switch (score) {
    case "A": return "bg-emerald-500/20 border-emerald-500/30 text-emerald-400";
    case "B": return "bg-blue-500/20 border-blue-500/30 text-blue-400";
    case "C": return "bg-yellow-500/20 border-yellow-500/30 text-yellow-400";
    case "D": return "bg-orange-500/20 border-orange-500/30 text-orange-400";
    case "F": return "bg-red-500/20 border-red-500/30 text-red-400";
    default: return "bg-gray-500/20 border-gray-500/30 text-gray-400";
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

const getBotActivityColor = (percent: number) => {
  if (percent < 25) return "text-emerald-400";
  if (percent < 50) return "text-yellow-400";
  if (percent < 75) return "text-orange-400";
  return "text-red-400";
};

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
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Trade with intelligence. Guardian-audited tokens with Pulse quantum predictions.
          </p>
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
                        DarkWave Markets provides intelligence, not financial advice. Pulse predictions are probabilistic, not guarantees. 
                        Guardian scores indicate security audits, not investment quality. <strong>DYOR. You can still lose everything.</strong> 
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
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
        >
          <Card className="bg-white/5 backdrop-blur-xl border-white/10">
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-cyan-400">{MARKET_TOKENS.length}</p>
              <p className="text-xs text-muted-foreground">Listed Tokens</p>
            </CardContent>
          </Card>
          <Card className="bg-white/5 backdrop-blur-xl border-white/10">
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-emerald-400">$2.3M</p>
              <p className="text-xs text-muted-foreground">Total Liquidity</p>
            </CardContent>
          </Card>
          <Card className="bg-white/5 backdrop-blur-xl border-white/10">
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-purple-400">$1.1M</p>
              <p className="text-xs text-muted-foreground">24h Volume</p>
            </CardContent>
          </Card>
          <Card className="bg-white/5 backdrop-blur-xl border-white/10">
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-pink-400">19K</p>
              <p className="text-xs text-muted-foreground">Total Holders</p>
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

        {/* Legend */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex flex-wrap gap-4 mb-6 text-xs text-muted-foreground"
        >
          <div className="flex items-center gap-2">
            <div className={`w-6 h-6 rounded-lg bg-gradient-to-r ${getGuardianColor("A")} flex items-center justify-center text-white font-bold text-xs`}>A</div>
            <span>Guardian Score</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 px-2 py-1 rounded bg-emerald-500/20">
              <TrendingUp className="w-3 h-3 text-emerald-400" />
              <span className="text-emerald-400">78%</span>
            </div>
            <span>Pulse Signal</span>
          </div>
          <div className="flex items-center gap-2">
            <Bot className="w-4 h-4 text-orange-400" />
            <span>Bot Activity %</span>
          </div>
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-purple-400" />
            <span>Pulse Pro Required</span>
          </div>
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
                className="bg-white/5 backdrop-blur-xl border-white/10 hover:bg-white/10 transition-all duration-300 cursor-pointer overflow-hidden"
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
                      <div className={`w-10 h-10 rounded-lg bg-gradient-to-r ${getGuardianColor(token.guardianScore)} flex items-center justify-center text-white font-bold shadow-lg`}>
                        {token.guardianScore}
                      </div>
                      <span className="text-xs text-muted-foreground mt-1">Guardian</span>
                    </div>

                    {/* Pulse Signal */}
                    <div className="hidden md:flex flex-col items-center">
                      <div className={`flex items-center gap-1 px-3 py-1.5 rounded-lg ${getPulseColor(token.pulseSignal)}`}>
                        {getPulseIcon(token.pulseSignal)}
                        <span className="font-medium text-sm">{token.pulseProbability}%</span>
                      </div>
                      <span className="text-xs text-muted-foreground mt-1">Pulse</span>
                    </div>

                    {/* Bot Activity */}
                    <div className="hidden lg:flex flex-col items-center">
                      <div className="flex items-center gap-1">
                        <Bot className={`w-4 h-4 ${getBotActivityColor(token.botActivity)}`} />
                        <span className={`font-medium ${getBotActivityColor(token.botActivity)}`}>{token.botActivity}%</span>
                      </div>
                      <span className="text-xs text-muted-foreground mt-1">Bots</span>
                    </div>

                    {/* Price */}
                    <div className="text-right">
                      <p className="font-semibold">${token.price.toFixed(6)}</p>
                      <p className={`text-sm ${token.change24h >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                        {token.change24h >= 0 ? '+' : ''}{token.change24h.toFixed(2)}%
                      </p>
                    </div>

                    {/* Expand Arrow */}
                    <ChevronDown className={`w-5 h-5 text-muted-foreground transition-transform ${expandedToken === token.id ? 'rotate-180' : ''}`} />
                  </div>

                  {/* Expanded Details */}
                  <AnimatePresence>
                    {expandedToken === token.id && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-4 pt-4 border-t border-white/10"
                      >
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                          <div className="p-3 rounded-xl bg-white/5">
                            <p className="text-xs text-muted-foreground mb-1">Market Cap</p>
                            <p className="font-semibold">${(token.marketCap / 1000).toFixed(0)}K</p>
                          </div>
                          <div className="p-3 rounded-xl bg-white/5">
                            <p className="text-xs text-muted-foreground mb-1">24h Volume</p>
                            <p className="font-semibold">${(token.volume24h / 1000).toFixed(0)}K</p>
                          </div>
                          <div className="p-3 rounded-xl bg-white/5">
                            <p className="text-xs text-muted-foreground mb-1">Liquidity</p>
                            <p className="font-semibold">${(token.liquidity / 1000).toFixed(0)}K</p>
                          </div>
                          <div className="p-3 rounded-xl bg-white/5">
                            <p className="text-xs text-muted-foreground mb-1">Holders</p>
                            <p className="font-semibold">{token.holderCount.toLocaleString()}</p>
                          </div>
                        </div>

                        {/* Guardian Details */}
                        <div className="mb-4">
                          <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                            <Shield className="w-4 h-4 text-cyan-400" />
                            Guardian Audit Details
                          </h4>
                          <div className="grid grid-cols-4 gap-2">
                            {Object.entries(token.guardianDetails).map(([key, value]) => (
                              <div key={key} className="text-center">
                                <div className="relative h-2 bg-white/10 rounded-full overflow-hidden mb-1">
                                  <div 
                                    className={`absolute inset-y-0 left-0 rounded-full ${value >= 80 ? 'bg-emerald-500' : value >= 60 ? 'bg-yellow-500' : 'bg-red-500'}`}
                                    style={{ width: `${value}%` }}
                                  />
                                </div>
                                <p className="text-xs text-muted-foreground capitalize">{key}</p>
                                <p className="text-xs font-medium">{value}%</p>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Risk Indicators */}
                        <div className="flex flex-wrap gap-2 mb-4">
                          {token.botActivity > 50 && (
                            <span className="px-2 py-1 rounded-full text-xs bg-red-500/20 text-red-400 border border-red-500/30">
                              High Bot Activity ({token.botActivity}%)
                            </span>
                          )}
                          {token.topHolderPercent > 40 && (
                            <span className="px-2 py-1 rounded-full text-xs bg-orange-500/20 text-orange-400 border border-orange-500/30">
                              Top Holder: {token.topHolderPercent}%
                            </span>
                          )}
                          {token.liquidity < 50000 && (
                            <span className="px-2 py-1 rounded-full text-xs bg-yellow-500/20 text-yellow-400 border border-yellow-500/30">
                              Low Liquidity
                            </span>
                          )}
                          {!token.isVerified && (
                            <span className="px-2 py-1 rounded-full text-xs bg-gray-500/20 text-gray-400 border border-gray-500/30">
                              Unverified
                            </span>
                          )}
                        </div>

                        {/* Actions */}
                        <div className="flex gap-3">
                          <Button 
                            className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
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
                            Chart
                          </Button>
                          <Button 
                            variant="outline" 
                            className="bg-white/5 border-white/10"
                            data-testid={`button-info-${token.id}`}
                          >
                            <Info className="w-4 h-4" />
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
          <Card className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-purple-500/20 overflow-hidden">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="p-4 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 shadow-lg shadow-purple-500/30">
                  <Sparkles className="w-10 h-10 text-white" />
                </div>
                <div className="flex-1 text-center md:text-left">
                  <h3 className="text-xl font-bold mb-2">Unlock Pulse Quantum Predictions</h3>
                  <p className="text-muted-foreground">
                    Get AI-powered price predictions, advanced risk analysis, and real-time alerts. 
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
      </div>
    </div>
  );
}
