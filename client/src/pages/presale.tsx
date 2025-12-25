import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "wouter";
import { 
  Zap, Shield, TrendingUp, Users, Gift, Award, Crown, Sparkles,
  ArrowRight, Clock, CheckCircle, Copy, ExternalLink, Wallet,
  Coins, Target, Globe, Lock, Star, Rocket, ChevronDown
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { GlassCard } from "@/components/glass-card";
import darkwaveLogo from "@assets/generated_images/darkwave_token_transparent.png";
import blockchainBg from "@assets/generated_images/futuristic_blockchain_network_activity_monitor.png";
import dashboardImg from "@assets/generated_images/futuristic_dashboard_interface_for_managing_decentralized_applications.png";
import fantasyWorld from "@assets/generated_images/fantasy_sci-fi_world_landscape.png";
import deepSpace from "@assets/generated_images/deep_space_station.png";
import cyberpunkCity from "@assets/generated_images/cyberpunk_neon_city.png";
import medievalKingdom from "@assets/generated_images/medieval_fantasy_kingdom.png";
import quantumRealm from "@assets/generated_images/quantum_dimension_realm.png";

const PRESALE_CONFIG = {
  tokenPrice: 0.008,
  minPurchase: 100,
  maxPurchase: 1000000,
  totalSupply: 100000000,
  presaleAllocation: 15000000,
  soldTokens: 2847500,
  startDate: new Date("2025-01-15"),
  endDate: new Date("2026-02-14"),
  tiers: [
    { name: "Genesis", minAmount: 50000, bonus: 25, color: "from-yellow-400 to-amber-500" },
    { name: "Founder", minAmount: 10000, bonus: 15, color: "from-purple-400 to-pink-500" },
    { name: "Pioneer", minAmount: 1000, bonus: 10, color: "from-cyan-400 to-blue-500" },
    { name: "Early Bird", minAmount: 100, bonus: 5, color: "from-green-400 to-emerald-500" },
  ],
};

const ECOSYSTEM_FEATURES = [
  {
    title: "Layer 1 Blockchain",
    description: "400ms blocks, 200K+ TPS, Proof-of-Authority consensus",
    icon: Zap,
    image: blockchainBg,
    gradient: "from-cyan-500/20 to-blue-600/20",
  },
  {
    title: "DeFi Ecosystem",
    description: "DEX, Staking, Liquidity Pools, Yield Farming",
    icon: TrendingUp,
    image: dashboardImg,
    gradient: "from-green-500/20 to-emerald-600/20",
  },
  {
    title: "DarkWave Chronicles",
    description: "AI life simulator with Sentient Mirror technology",
    icon: Sparkles,
    image: fantasyWorld,
    gradient: "from-purple-500/20 to-pink-600/20",
  },
  {
    title: "Cross-Chain Bridge",
    description: "Seamless transfers to Ethereum and Solana",
    icon: Globe,
    image: deepSpace,
    gradient: "from-orange-500/20 to-red-600/20",
  },
  {
    title: "NFT Marketplace",
    description: "Create, trade, and stake digital collectibles",
    icon: Award,
    image: cyberpunkCity,
    gradient: "from-pink-500/20 to-rose-600/20",
  },
  {
    title: "Governance DAO",
    description: "Community-driven protocol decisions",
    icon: Users,
    image: medievalKingdom,
    gradient: "from-amber-500/20 to-orange-600/20",
  },
];

function HolographicCard({ children, className = "", glow = "cyan" }: { children: React.ReactNode; className?: string; glow?: string }) {
  const glowColors: Record<string, string> = {
    cyan: "shadow-cyan-500/20",
    purple: "shadow-purple-500/20",
    pink: "shadow-pink-500/20",
    amber: "shadow-amber-500/20",
  };
  
  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -4 }}
      transition={{ duration: 0.3 }}
      className={`relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-gray-900/90 to-black/80 backdrop-blur-xl ${glowColors[glow]} shadow-2xl ${className}`}
      style={{
        boxShadow: `0 0 60px rgba(0,200,255,0.1), inset 0 1px 0 rgba(255,255,255,0.1)`,
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent pointer-events-none" />
      <div className="absolute inset-0 opacity-30 pointer-events-none" style={{
        background: "repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.02) 10px, rgba(255,255,255,0.02) 20px)",
      }} />
      {children}
    </motion.div>
  );
}

function PresaleProgress() {
  const progress = (PRESALE_CONFIG.soldTokens / PRESALE_CONFIG.presaleAllocation) * 100;
  const raised = PRESALE_CONFIG.soldTokens * PRESALE_CONFIG.tokenPrice;
  
  return (
    <HolographicCard className="p-8" glow="cyan">
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500" />
      
      <div className="flex items-center gap-4 mb-6">
        <div className="relative">
          <img src={darkwaveLogo} alt="DWC" className="w-16 h-16 object-contain" />
          <div className="absolute inset-0 animate-pulse bg-cyan-400/20 rounded-full blur-xl" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white">DWC Token Presale</h2>
          <p className="text-gray-400">Launching February 14, 2026</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="text-center p-4 rounded-xl bg-white/5" data-testid="stat-token-price">
          <p className="text-3xl font-bold text-cyan-400">${PRESALE_CONFIG.tokenPrice}</p>
          <p className="text-gray-500 text-sm">Token Price</p>
        </div>
        <div className="text-center p-4 rounded-xl bg-white/5" data-testid="stat-tokens-sold">
          <p className="text-3xl font-bold text-purple-400">{(PRESALE_CONFIG.soldTokens / 1000000).toFixed(2)}M</p>
          <p className="text-gray-500 text-sm">Tokens Sold</p>
        </div>
        <div className="text-center p-4 rounded-xl bg-white/5" data-testid="stat-total-raised">
          <p className="text-3xl font-bold text-pink-400">${(raised / 1000).toFixed(0)}K</p>
          <p className="text-gray-500 text-sm">Raised</p>
        </div>
      </div>

      <div className="space-y-2 mb-6">
        <div className="flex justify-between text-sm">
          <span className="text-gray-400">Progress</span>
          <span className="text-cyan-400 font-semibold">{progress.toFixed(1)}%</span>
        </div>
        <div className="h-4 bg-gray-800 rounded-full overflow-hidden relative">
          <motion.div
            className="h-full bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 2, ease: "easeOut" }}
          />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.3)_50%,transparent_100%)] animate-pulse" />
        </div>
        <div className="flex justify-between text-xs text-gray-500">
          <span>{PRESALE_CONFIG.soldTokens.toLocaleString()} DWC</span>
          <span>{PRESALE_CONFIG.presaleAllocation.toLocaleString()} DWC</span>
        </div>
      </div>

      <Button 
        className="w-full py-6 text-lg font-bold bg-gradient-to-r from-cyan-600 via-purple-600 to-pink-600 hover:opacity-90"
        data-testid="button-buy-tokens"
      >
        <Wallet className="w-5 h-5 mr-2" />
        Buy DWC Tokens
      </Button>
    </HolographicCard>
  );
}

function TierCard({ tier, index }: { tier: typeof PRESALE_CONFIG.tiers[0]; index: number }) {
  const tierImages = [quantumRealm, deepSpace, cyberpunkCity, fantasyWorld];
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="relative group"
      data-testid={`card-tier-${tier.name.toLowerCase()}`}
    >
      <div className={`absolute inset-0 bg-gradient-to-r ${tier.color} opacity-20 blur-xl group-hover:opacity-30 transition-opacity rounded-2xl`} />
      <div className="relative overflow-hidden rounded-2xl border border-white/10" style={{
        boxShadow: `0 0 40px rgba(0,200,255,0.15)`,
      }}>
        <div className="absolute inset-0">
          <img src={tierImages[index]} alt={tier.name} className="w-full h-full object-cover opacity-30" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-black/50" />
        </div>
        <div className="absolute inset-0 opacity-30 pointer-events-none" style={{
          background: "repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.02) 10px, rgba(255,255,255,0.02) 20px)",
        }} />
        <div className="relative z-10 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              {index === 0 && <Crown className="w-6 h-6 text-yellow-400" />}
              {index === 1 && <Star className="w-6 h-6 text-purple-400" />}
              {index === 2 && <Rocket className="w-6 h-6 text-cyan-400" />}
              {index === 3 && <Gift className="w-6 h-6 text-green-400" />}
              <h3 className="text-xl font-bold text-white">{tier.name}</h3>
            </div>
            <Badge className={`bg-gradient-to-r ${tier.color} text-white border-0`} data-testid={`badge-tier-bonus-${index}`}>
              +{tier.bonus}% Bonus
            </Badge>
          </div>
          <p className="text-gray-300">
            Min: <span className="text-white font-semibold">${tier.minAmount.toLocaleString()}</span>
          </p>
          <p className="text-sm text-gray-400 mt-2">
            {tier.minAmount / PRESALE_CONFIG.tokenPrice >= 1000000 
              ? `${(tier.minAmount / PRESALE_CONFIG.tokenPrice / 1000000).toFixed(1)}M` 
              : `${(tier.minAmount / PRESALE_CONFIG.tokenPrice / 1000).toFixed(0)}K`} tokens + {tier.bonus}% bonus
          </p>
          <Button 
            className={`w-full mt-4 bg-gradient-to-r ${tier.color} hover:opacity-90 border-0`}
            data-testid={`button-select-tier-${tier.name.toLowerCase()}`}
          >
            Select {tier.name}
          </Button>
        </div>
      </div>
    </motion.div>
  );
}

function EcosystemCard({ feature, index }: { feature: typeof ECOSYSTEM_FEATURES[0]; index: number }) {
  const Icon = feature.icon;
  const isLarge = index === 0 || index === 2;
  
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.1 }}
      className={isLarge ? "md:col-span-2" : ""}
      data-testid={`card-ecosystem-${index}`}
    >
      <HolographicCard className="h-full overflow-hidden group">
        <div className="relative h-48 overflow-hidden">
          <img 
            src={feature.image} 
            alt={feature.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <div className={`absolute inset-0 bg-gradient-to-t ${feature.gradient} to-transparent`} />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          <div className="absolute bottom-4 left-4 right-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center">
                <Icon className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white">{feature.title}</h3>
            </div>
          </div>
        </div>
        <div className="p-4">
          <p className="text-gray-400 mb-3">{feature.description}</p>
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full border-white/10 hover:bg-white/5"
            data-testid={`button-learn-more-${index}`}
          >
            Learn More <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </HolographicCard>
    </motion.div>
  );
}

function HolderDashboard() {
  const [walletAddress, setWalletAddress] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  
  const mockHolderData = {
    totalTokens: 125000,
    bonusTokens: 12500,
    tier: "Pioneer",
    earlyAdopterRank: 847,
    totalInvested: 1000,
    referralCode: "DWC-PIONEER-847",
    referralCount: 3,
    referralEarnings: 150,
  };

  return (
    <HolographicCard className="p-8" glow="purple">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
          <Wallet className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white">Your DWC Account</h2>
          <p className="text-gray-400">Early Adopter Dashboard</p>
        </div>
      </div>

      {!isConnected ? (
        <div className="space-y-4">
          <Input
            placeholder="Enter wallet address or email..."
            value={walletAddress}
            onChange={(e) => setWalletAddress(e.target.value)}
            className="bg-white/5 border-white/10"
            data-testid="input-wallet-address"
          />
          <Button 
            onClick={() => setIsConnected(true)}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600"
            data-testid="button-connect-wallet"
          >
            Connect to View Stats
          </Button>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20" data-testid="stat-holder-tokens">
              <p className="text-gray-400 text-sm">Total Tokens</p>
              <p className="text-2xl font-bold text-white">{mockHolderData.totalTokens.toLocaleString()}</p>
              <p className="text-green-400 text-sm">+{mockHolderData.bonusTokens.toLocaleString()} bonus</p>
            </div>
            <div className="p-4 rounded-xl bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-cyan-500/20" data-testid="stat-holder-invested">
              <p className="text-gray-400 text-sm">Total Invested</p>
              <p className="text-2xl font-bold text-white">${mockHolderData.totalInvested.toLocaleString()}</p>
              <p className="text-cyan-400 text-sm">{mockHolderData.tier} Tier</p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-gradient-to-br from-amber-500/10 to-orange-500/10 border border-amber-500/20" data-testid="stat-holder-rank">
            <div className="flex items-center justify-between mb-2">
              <p className="text-gray-400 text-sm">Early Adopter Rank</p>
              <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30" data-testid="badge-top-rank">Top 1000</Badge>
            </div>
            <p className="text-3xl font-bold text-white">#{mockHolderData.earlyAdopterRank}</p>
            <div className="flex items-center gap-2 mt-2">
              <CheckCircle className="w-4 h-4 text-green-400" />
              <span className="text-green-400 text-sm">Eligible for Early Adopter Rewards</span>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-white/5 border border-white/10" data-testid="referral-section">
            <p className="text-gray-400 text-sm mb-2">Your Referral Code</p>
            <div className="flex items-center gap-2">
              <code className="flex-1 px-3 py-2 bg-black/30 rounded-lg text-cyan-400 font-mono text-sm" data-testid="text-referral-code">
                {mockHolderData.referralCode}
              </code>
              <Button size="sm" variant="outline" className="border-white/10" data-testid="button-copy-referral">
                <Copy className="w-4 h-4" />
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div>
                <p className="text-gray-500 text-xs">Referrals</p>
                <p className="text-white font-bold">{mockHolderData.referralCount}</p>
              </div>
              <div>
                <p className="text-gray-500 text-xs">Earnings</p>
                <p className="text-green-400 font-bold">${mockHolderData.referralEarnings}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </HolographicCard>
  );
}

function PurchaseCalculator() {
  const [amount, setAmount] = useState("1000");
  const usdAmount = parseFloat(amount) || 0;
  const tokenAmount = usdAmount / PRESALE_CONFIG.tokenPrice;
  
  const tier = PRESALE_CONFIG.tiers.find(t => usdAmount >= t.minAmount) || { bonus: 0, name: "Standard" };
  const bonusTokens = tokenAmount * (tier.bonus / 100);
  const totalTokens = tokenAmount + bonusTokens;

  return (
    <HolographicCard className="p-8" glow="cyan">
      <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
        <Target className="w-5 h-5 text-cyan-400" />
        Token Calculator
      </h3>

      <div className="space-y-4">
        <div>
          <label className="text-gray-400 text-sm block mb-2">Investment Amount (USD)</label>
          <Input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="bg-white/5 border-white/10 text-2xl h-14"
            data-testid="input-investment-amount"
          />
        </div>

        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/10">
          <div>
            <p className="text-gray-500 text-sm">Base Tokens</p>
            <p className="text-xl font-bold text-white">{tokenAmount.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
          </div>
          <div>
            <p className="text-gray-500 text-sm">Bonus ({tier.bonus}%)</p>
            <p className="text-xl font-bold text-green-400">+{bonusTokens.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border border-cyan-500/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total DWC Tokens</p>
              <p className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                {totalTokens.toLocaleString(undefined, { maximumFractionDigits: 0 })}
              </p>
            </div>
            <Badge className="bg-gradient-to-r from-cyan-500/20 to-purple-500/20 text-white border-cyan-500/30">
              {tier.name} Tier
            </Badge>
          </div>
        </div>

        <Button 
          className="w-full py-6 text-lg font-bold bg-gradient-to-r from-cyan-600 via-purple-600 to-pink-600"
          data-testid="button-purchase-tokens"
        >
          Purchase Tokens
          <ArrowRight className="w-5 h-5 ml-2" />
        </Button>
      </div>
    </HolographicCard>
  );
}

export default function Presale() {
  return (
    <div className="min-h-screen bg-[#080c18] text-white">
      <div 
        className="absolute inset-0 opacity-30"
        style={{
          background: "radial-gradient(circle at 20% 20%, rgba(0,200,255,0.15) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(168,85,247,0.15) 0%, transparent 50%)",
        }}
      />
      
      <div className="relative max-w-7xl mx-auto px-4 py-12">
        <Link href="/" className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition-colors" data-testid="link-back-home">
          <ArrowRight className="w-4 h-4 rotate-180" />
          <span>Back to Home</span>
        </Link>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/30 mb-6">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span className="text-cyan-300 text-sm font-medium">Token Presale Live</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Join the DarkWave Revolution
            </span>
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Be among the first to own DWC tokens and unlock exclusive early adopter rewards. 
            Our Layer 1 blockchain launches February 14, 2026.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8 mb-16">
          <PresaleProgress />
          <PurchaseCalculator />
        </div>

        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">
            <span className="bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">
              Early Adopter Tiers
            </span>
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {PRESALE_CONFIG.tiers.map((tier, index) => (
              <TierCard key={tier.name} tier={tier} index={index} />
            ))}
          </div>
        </div>

        <div className="mb-16">
          <HolderDashboard />
        </div>

        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">
            <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
              The DarkWave Ecosystem
            </span>
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {ECOSYSTEM_FEATURES.map((feature, index) => (
              <EcosystemCard key={feature.title} feature={feature} index={index} />
            ))}
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-4 mb-16">
          <HolographicCard className="p-6 text-center">
            <Lock className="w-8 h-8 text-cyan-400 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-white mb-2">Secure & Audited</h3>
            <p className="text-gray-400 text-sm">Smart contracts verified by leading security firms</p>
          </HolographicCard>
          <HolographicCard className="p-6 text-center">
            <Clock className="w-8 h-8 text-purple-400 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-white mb-2">Vesting Schedule</h3>
            <p className="text-gray-400 text-sm">20% at TGE, 80% vested over 12 months</p>
          </HolographicCard>
          <HolographicCard className="p-6 text-center">
            <Gift className="w-8 h-8 text-pink-400 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-white mb-2">Referral Rewards</h3>
            <p className="text-gray-400 text-sm">Earn 5% on every referred purchase</p>
          </HolographicCard>
        </div>

        <div className="text-center">
          <Link href="/roadmap" className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300" data-testid="link-view-roadmap">
            View Full Roadmap <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
