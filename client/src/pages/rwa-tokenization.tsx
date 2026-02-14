import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import {
  Building2,
  Landmark,
  TrendingUp,
  Coins,
  FileText,
  Gem,
  Lightbulb,
  Shield,
  Users,
  DollarSign,
  ChevronRight,
  CheckCircle,
  Plus,
  BarChart3,
  Globe,
  Lock,
  Percent,
  Calendar,
  Award
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

import { GlassCard, StatCard } from "@/components/glass-card";

const assetTypeIcons: Record<string, any> = {
  real_estate: Building2,
  equity: TrendingUp,
  bond: Landmark,
  commodity: Coins,
  collectible: Gem,
  invoice: FileText,
  ip_rights: Lightbulb
};

const assetTypeGradients: Record<string, string> = {
  real_estate: "from-blue-500 to-indigo-600",
  equity: "from-green-500 to-emerald-600",
  bond: "from-amber-500 to-orange-600",
  commodity: "from-yellow-500 to-amber-600",
  collectible: "from-pink-500 to-rose-600",
  invoice: "from-slate-500 to-slate-600",
  ip_rights: "from-purple-500 to-violet-600"
};


const GlowOrb = ({ color, size, top, left, delay = 0 }: { color: string; size: number; top: string; left: string; delay?: number }) => (
  <motion.div
    className="absolute rounded-full blur-3xl opacity-20 pointer-events-none"
    style={{ background: color, width: size, height: size, top, left }}
    animate={{ scale: [1, 1.2, 1], opacity: [0.15, 0.25, 0.15] }}
    transition={{ duration: 8, repeat: Infinity, delay }}
  />
);

export default function RWATokenization() {
  const { data: assets } = useQuery({
    queryKey: ["/api/rwa/assets"],
    queryFn: async () => {
      const res = await fetch("/api/rwa/assets");
      return res.json();
    }
  });

  const { data: stats } = useQuery({
    queryKey: ["/api/rwa/stats"],
    queryFn: async () => {
      const res = await fetch("/api/rwa/stats");
      return res.json();
    }
  });

  const { data: tokens } = useQuery({
    queryKey: ["/api/rwa/tokens"],
    queryFn: async () => {
      const res = await fetch("/api/rwa/tokens");
      return res.json();
    }
  });

  const featuredAssets = [
    {
      id: "manhattan-tower",
      name: "Manhattan Tower Unit 42B",
      assetType: "real_estate",
      description: "Luxury residential unit in prime Manhattan location with stunning city views",
      valuation: "250000000",
      verified: true,
      status: "tokenized",
      dividendRate: "6.5",
      totalRaised: "18750000000",
      investorCount: 342,
      tokensSold: "7500",
      totalSupply: "10000"
    },
    {
      id: "tech-startup-equity",
      name: "TechVenture Series A",
      assetType: "equity",
      description: "Early-stage equity in AI infrastructure startup with strong growth trajectory",
      valuation: "500000000",
      verified: true,
      status: "offering",
      dividendRate: null,
      totalRaised: "12500000000",
      investorCount: 156,
      tokensSold: "2500",
      totalSupply: "10000"
    },
    {
      id: "corporate-bond",
      name: "DarkWave Studios Bond",
      assetType: "bond",
      description: "5-year corporate bond from DarkWave Studios with quarterly interest payments",
      valuation: "100000000",
      verified: true,
      status: "trading",
      dividendRate: "8.0",
      totalRaised: "10000000000",
      investorCount: 520,
      tokensSold: "10000",
      totalSupply: "10000"
    },
    {
      id: "gold-vault",
      name: "Swiss Gold Vault Share",
      assetType: "commodity",
      description: "Fractional ownership of physical gold stored in Swiss vault",
      valuation: "75000000",
      verified: true,
      status: "tokenized",
      dividendRate: null,
      totalRaised: "6000000000",
      investorCount: 892,
      tokensSold: "8000",
      totalSupply: "10000"
    },
    {
      id: "rare-art",
      name: "Banksy Original #127",
      assetType: "collectible",
      description: "Authenticated Banksy street art piece with provenance documentation",
      valuation: "180000000",
      verified: true,
      status: "offering",
      dividendRate: null,
      totalRaised: "9000000000",
      investorCount: 234,
      tokensSold: "5000",
      totalSupply: "10000"
    },
    {
      id: "patent-portfolio",
      name: "AI Patent Portfolio",
      assetType: "ip_rights",
      description: "Collection of 12 AI/ML patents with active licensing revenue",
      valuation: "320000000",
      verified: true,
      status: "tokenized",
      dividendRate: "12.0",
      totalRaised: "25600000000",
      investorCount: 178,
      tokensSold: "8000",
      totalSupply: "10000"
    }
  ];

  const displayAssets = assets?.assets?.length > 0 ? assets.assets : featuredAssets;

  const formatValuation = (cents: string) => {
    const amount = parseFloat(cents) / 100;
    if (amount >= 1000000) return `$${(amount / 1000000).toFixed(1)}M`;
    if (amount >= 1000) return `$${(amount / 1000).toFixed(0)}K`;
    return `$${amount.toFixed(0)}`;
  };

  const formatRaised = (cents: string) => {
    const amount = parseFloat(cents) / 100;
    if (amount >= 1000000) return `$${(amount / 1000000).toFixed(2)}M`;
    if (amount >= 1000) return `$${(amount / 1000).toFixed(0)}K`;
    return `$${amount.toFixed(0)}`;
  };

  const getProgress = (sold: string, total: string) => {
    return (parseInt(sold) / parseInt(total)) * 100;
  };

  return (
    <div className="min-h-screen relative overflow-hidden pt-20 pb-12" style={{ background: "linear-gradient(180deg, #070b16, #0c1222, #070b16)" }}>
      <GlowOrb color="linear-gradient(135deg, #06b6d4, #3b82f6)" size={500} top="-5%" left="60%" />
      <GlowOrb color="linear-gradient(135deg, #8b5cf6, #ec4899)" size={400} top="40%" left="-10%" delay={3} />
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 right-1/3 w-[400px] h-[400px] bg-amber-500/8 rounded-full blur-3xl animate-pulse delay-500" />
        <div className="absolute bottom-1/3 left-1/3 w-[350px] h-[350px] bg-emerald-500/8 rounded-full blur-3xl animate-pulse delay-700" />
      </div>
        <div className="container mx-auto px-4 pt-8 pb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 mb-6">
              <Building2 className="w-4 h-4 text-blue-400" />
              <span className="text-sm text-blue-400 font-medium">Real-World Asset Tokenization</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              <span className="bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent" data-testid="text-page-title">
                Own the Real World, On-Chain
              </span>
            </h1>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto" data-testid="text-page-description">
              Invest in tokenized real estate, equity, bonds, and collectibles. Fractional ownership with blockchain-verified transparency.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12"
          >
            <div data-testid="stat-total-valuation">
              <StatCard
                label="Total Valuation"
                value={stats?.totalValuation ? formatValuation(stats.totalValuation) : "$1.4B"}
                icon={DollarSign}
              />
            </div>
            <div data-testid="stat-tokenized-assets">
              <StatCard
                label="Assets Tokenized"
                value={String(stats?.tokenizedAssets || displayAssets.filter((a: any) => a.status === 'tokenized').length)}
                icon={Building2}
              />
            </div>
            <div data-testid="stat-total-investors">
              <StatCard
                label="Total Investors"
                value={`${((stats?.totalInvestors || displayAssets.reduce((sum: number, a: any) => sum + a.investorCount, 0)) / 1000).toFixed(1)}K`}
                icon={Users}
              />
            </div>
            <div data-testid="stat-total-raised">
              <StatCard
                label="Total Raised"
                value={stats?.totalRaised ? formatRaised(stats.totalRaised) : "$81.8M"}
                icon={TrendingUp}
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="flex flex-wrap justify-center gap-3 mb-12"
          >
            {Object.entries(assetTypeIcons).map(([type, Icon]) => (
              <button
                key={type}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800/50 border border-slate-700/50 hover:border-blue-500/50 transition-all"
                data-testid={`filter-asset-${type}`}
              >
                <Icon className="w-4 h-4 text-slate-400" />
                <span className="text-sm text-slate-300 capitalize">{type.replace('_', ' ')}</span>
              </button>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-8"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">Featured Offerings</h2>
              <Link href="/rwa/create">
                <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700" data-testid="button-tokenize-asset">
                  <Plus className="w-4 h-4 mr-2" />
                  Tokenize Asset
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayAssets.map((asset: any, index: number) => {
                const Icon = assetTypeIcons[asset.assetType] || Building2;
                const gradient = assetTypeGradients[asset.assetType] || "from-slate-500 to-slate-600";
                const progress = getProgress(asset.tokensSold, asset.totalSupply);
                
                return (
                  <motion.div
                    key={asset.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * index }}
                  >
                    <GlassCard className="h-full hover:border-blue-500/50 transition-all group cursor-pointer" data-testid={`card-asset-${asset.id}`}>
                      <div className="flex items-start justify-between mb-4">
                        <div className={`p-3 rounded-xl bg-gradient-to-br ${gradient}`}>
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex items-center gap-2">
                          {asset.verified && (
                            <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Verified
                            </Badge>
                          )}
                          <Badge className={`${
                            asset.status === 'offering' ? 'bg-amber-500/20 text-amber-400 border-amber-500/30' :
                            asset.status === 'trading' ? 'bg-green-500/20 text-green-400 border-green-500/30' :
                            'bg-blue-500/20 text-blue-400 border-blue-500/30'
                          }`}>
                            {asset.status === 'offering' ? 'Offering' :
                             asset.status === 'trading' ? 'Trading' : 'Tokenized'}
                          </Badge>
                        </div>
                      </div>

                      <h3 className="text-xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors" data-testid={`text-asset-name-${asset.id}`}>
                        {asset.name}
                      </h3>
                      <p className="text-slate-400 text-sm mb-4 line-clamp-2" data-testid={`text-asset-description-${asset.id}`}>
                        {asset.description}
                      </p>

                      <div className="space-y-3 mb-4">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-slate-500">Valuation</span>
                          <span className="text-white font-semibold" data-testid={`text-asset-valuation-${asset.id}`}>
                            {formatValuation(asset.valuation)}
                          </span>
                        </div>
                        {asset.dividendRate && (
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-slate-500 flex items-center gap-1">
                              <Percent className="w-3 h-3" />
                              Annual Yield
                            </span>
                            <span className="text-green-400 font-semibold">{asset.dividendRate}%</span>
                          </div>
                        )}
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-slate-500 flex items-center gap-1">
                            <Users className="w-3 h-3" />
                            Investors
                          </span>
                          <span className="text-white">{asset.investorCount.toLocaleString()}</span>
                        </div>
                      </div>

                      <div className="space-y-2 mb-4">
                        <div className="flex items-center justify-between text-xs text-slate-400">
                          <span>{progress.toFixed(0)}% Funded</span>
                          <span>{formatRaised(asset.totalRaised)} raised</span>
                        </div>
                        <Progress value={progress} className="h-2" />
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t border-slate-700/50">
                        <div>
                          <p className="text-xs text-slate-500">Min. Investment</p>
                          <p className="text-lg font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent" data-testid={`text-asset-min-${asset.id}`}>
                            $100
                          </p>
                        </div>
                        <Button size="sm" className="bg-gradient-to-r from-blue-500 to-purple-600" data-testid={`button-invest-${asset.id}`}>
                          <DollarSign className="w-4 h-4 mr-1" />
                          Invest
                        </Button>
                      </div>
</motion.div>
                );
              })}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
          >
            <GlassCard className="text-center" data-testid="card-feature-verified">
              <Shield className="w-12 h-12 mx-auto mb-4 text-emerald-400" />
              <h3 className="text-lg font-bold text-white mb-2">Guardian Verified</h3>
              <p className="text-slate-400 text-sm">
                Every asset undergoes rigorous verification by our Guardian security team
              </p>
<GlassCard className="text-center" data-testid="card-feature-fractional">
              <Coins className="w-12 h-12 mx-auto mb-4 text-amber-400" />
              <h3 className="text-lg font-bold text-white mb-2">Fractional Ownership</h3>
              <p className="text-slate-400 text-sm">
                Own a piece of premium assets starting from just $100
              </p>
<GlassCard className="text-center" data-testid="card-feature-dividends">
              <Calendar className="w-12 h-12 mx-auto mb-4 text-purple-400" />
              <h3 className="text-lg font-bold text-white mb-2">Automatic Dividends</h3>
              <p className="text-slate-400 text-sm">
                Receive dividend payments directly to your wallet on schedule
              </p>
</motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <GlassCard className="text-center" data-testid="card-tokenize-cta">
              <Award className="w-16 h-16 mx-auto mb-4 text-blue-400" />
              <h3 className="text-2xl font-bold text-white mb-2">Tokenize Your Assets</h3>
              <p className="text-slate-400 mb-6 max-w-lg mx-auto">
                Own real estate, art, or IP? Tokenize it on Trust Layer and unlock global liquidity while retaining control.
              </p>
              <div className="flex justify-center gap-4">
                <Button className="bg-gradient-to-r from-blue-500 to-purple-600" data-testid="button-tokenize-cta">
                  <Plus className="w-4 h-4 mr-2" />
                  Start Tokenizing
                </Button>
                <Button variant="outline" className="border-slate-600 text-slate-300" data-testid="button-learn-more">
                  Learn More
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
</div>
    </motion.div>
  );
}
