import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { 
  Zap, Shield, TrendingUp, Users, Gift, Award, Crown, Sparkles,
  ArrowRight, Clock, CheckCircle, Copy, ExternalLink, Wallet,
  Coins, Target, Globe, Lock, Star, Rocket, ChevronDown, Loader2, Calculator, X
} from "lucide-react";
import { BackButton } from "@/components/page-nav";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { GlassCard } from "@/components/glass-card";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import darkwaveLogo from "@assets/generated_images/darkwave_token_transparent.png";
import blockchainBg from "@assets/generated_images/futuristic_blockchain_network_activity_monitor.png";
import dashboardImg from "@assets/generated_images/futuristic_dashboard_interface_for_managing_decentralized_applications.png";
import fantasyWorld from "@assets/generated_images/fantasy_sci-fi_world_landscape.png";
import deepSpace from "@assets/generated_images/deep_space_station.png";
import cyberpunkCity from "@assets/generated_images/cyberpunk_neon_city.png";
import medievalKingdom from "@assets/generated_images/medieval_fantasy_kingdom.png";
import quantumRealm from "@assets/generated_images/quantum_dimension_realm.png";

const TOKEN_PRICE = 0.005;
const PRESALE_ALLOCATION = 15000000;

interface PresaleTier {
  id: string;
  name: string;
  description: string;
  priceId: string;
  amount: number;
  bonus: number;
  tier: string;
}

interface PresaleStats {
  totalRaisedCents: number;
  totalRaisedUsd: number;
  tokensSold: number;
  uniqueHolders: number;
  totalPurchases: number;
}

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
    description: "Unprecedented adventure platform where YOU are the hero",
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
  const { data: stats, isLoading } = useQuery<PresaleStats>({
    queryKey: ["/api/presale/stats"],
  });

  const tokensSold = stats?.tokensSold || 0;
  const totalRaised = stats?.totalRaisedUsd || 0;
  const uniqueHolders = stats?.uniqueHolders || 0;
  const progress = (tokensSold / PRESALE_ALLOCATION) * 100;
  
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
          <p className="text-gray-400">Launching October 2026</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
        <div className="text-center p-3 sm:p-4 rounded-xl bg-white/5" data-testid="stat-token-price">
          <p className="text-xl sm:text-3xl font-bold text-cyan-400">${TOKEN_PRICE}</p>
          <p className="text-gray-500 text-xs sm:text-sm">Token Price</p>
        </div>
        <div className="text-center p-3 sm:p-4 rounded-xl bg-white/5" data-testid="stat-tokens-sold">
          {isLoading ? (
            <Loader2 className="w-5 h-5 sm:w-6 sm:h-6 animate-spin mx-auto text-purple-400" />
          ) : (
            <p className="text-xl sm:text-3xl font-bold text-purple-400">
              {tokensSold > 0 ? `${(tokensSold / 1000).toFixed(1)}K` : "0"}
            </p>
          )}
          <p className="text-gray-500 text-xs sm:text-sm">Tokens Sold</p>
        </div>
        <div className="text-center p-3 sm:p-4 rounded-xl bg-white/5" data-testid="stat-total-raised">
          {isLoading ? (
            <Loader2 className="w-5 h-5 sm:w-6 sm:h-6 animate-spin mx-auto text-pink-400" />
          ) : (
            <p className="text-xl sm:text-3xl font-bold text-pink-400">
              ${totalRaised > 0 ? totalRaised.toLocaleString() : "0"}
            </p>
          )}
          <p className="text-gray-500 text-xs sm:text-sm">Raised</p>
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
            animate={{ width: `${Math.max(progress, 0.5)}%` }}
            transition={{ duration: 2, ease: "easeOut" }}
          />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.3)_50%,transparent_100%)] animate-pulse" />
        </div>
        <div className="flex justify-between text-xs text-gray-500">
          <span>{tokensSold.toLocaleString()} DWC</span>
          <span>{PRESALE_ALLOCATION.toLocaleString()} DWC</span>
        </div>
      </div>

      {uniqueHolders > 0 && (
        <div className="mb-4 p-3 rounded-xl bg-green-500/10 border border-green-500/20 text-center">
          <p className="text-green-400 text-sm">
            <Users className="w-4 h-4 inline mr-2" />
            {uniqueHolders} early adopters have joined
          </p>
        </div>
      )}

      <Link href="#tiers">
        <Button 
          className="w-full py-6 text-lg font-bold bg-gradient-to-r from-cyan-600 via-purple-600 to-pink-600 hover:opacity-90"
          data-testid="button-buy-tokens"
        >
          <Wallet className="w-5 h-5 mr-2" />
          {uniqueHolders === 0 ? "Be the First to Buy" : "Buy DWC Tokens"}
        </Button>
      </Link>
    </HolographicCard>
  );
}

function TierCard({ tier, index }: { tier: PresaleTier; index: number }) {
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const tierImages = [quantumRealm, deepSpace, cyberpunkCity, fantasyWorld];
  const tierColors: Record<string, string> = {
    genesis: "from-yellow-400 to-amber-500",
    founder: "from-purple-400 to-pink-500",
    pioneer: "from-cyan-400 to-blue-500",
    early_bird: "from-green-400 to-emerald-500",
  };
  
  const isValidEmail = email.includes("@") && email.includes(".");
  
  const checkoutMutation = useMutation({
    mutationFn: async () => {
      if (!isValidEmail) {
        throw new Error("Valid email required");
      }
      const res = await fetch("/api/presale/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          priceId: tier.priceId,
          tier: tier.tier,
          email: email,
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to create checkout");
      }
      return res.json();
    },
    onSuccess: (data) => {
      if (data.url) {
        window.location.href = data.url;
      }
    },
    onError: (error: Error) => {
      toast({
        title: "Checkout Error",
        description: error.message || "Failed to start checkout. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleBuyClick = () => {
    if (!isValidEmail) {
      toast({
        title: "Email Required",
        description: "Please enter a valid email to receive your token allocation.",
        variant: "destructive",
      });
      return;
    }
    checkoutMutation.mutate();
  };

  const color = tierColors[tier.tier] || "from-gray-400 to-gray-500";
  const tokenAmount = Math.floor((tier.amount / 100) / TOKEN_PRICE);
  const bonusTokens = Math.floor(tokenAmount * (tier.bonus / 100));
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="relative group"
      data-testid={`card-tier-${tier.tier}`}
    >
      <div className={`absolute inset-0 bg-gradient-to-r ${color} opacity-20 blur-xl group-hover:opacity-30 transition-opacity rounded-2xl`} />
      <div className="relative overflow-hidden rounded-2xl border border-white/10" style={{
        boxShadow: `0 0 40px rgba(0,200,255,0.15)`,
      }}>
        <div className="absolute inset-0">
          <img src={tierImages[index % 4]} alt={tier.name} className="w-full h-full object-cover opacity-30" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-black/50" />
        </div>
        <div className="absolute inset-0 opacity-30 pointer-events-none" style={{
          background: "repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.02) 10px, rgba(255,255,255,0.02) 20px)",
        }} />
        <div className="relative z-10 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              {tier.tier === "genesis" && <Crown className="w-6 h-6 text-yellow-400" />}
              {tier.tier === "founder" && <Star className="w-6 h-6 text-purple-400" />}
              {tier.tier === "pioneer" && <Rocket className="w-6 h-6 text-cyan-400" />}
              {tier.tier === "early_bird" && <Gift className="w-6 h-6 text-green-400" />}
              <h3 className="text-xl font-bold text-white">{tier.name}</h3>
            </div>
            <Badge className={`bg-gradient-to-r ${color} text-white border-0`} data-testid={`badge-tier-bonus-${index}`}>
              +{tier.bonus}% Bonus
            </Badge>
          </div>
          <p className="text-gray-300">
            <span className="text-white font-semibold text-2xl">${(tier.amount / 100).toLocaleString()}</span>
          </p>
          <p className="text-sm text-gray-400 mt-2">
            {tokenAmount.toLocaleString()} tokens + {bonusTokens.toLocaleString()} bonus
          </p>
          
          <div className="mt-4">
            <Input
              type="email"
              placeholder="Your email for token allocation"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`bg-black/50 border-white/20 text-white placeholder:text-gray-500 ${
                email && !isValidEmail ? "border-red-500/50" : ""
              } ${isValidEmail ? "border-green-500/50" : ""}`}
              data-testid={`input-email-${tier.tier}`}
            />
            {email && !isValidEmail && (
              <p className="text-xs text-red-400 mt-1">Please enter a valid email</p>
            )}
          </div>
          
          <Button 
            onClick={handleBuyClick}
            disabled={checkoutMutation.isPending || !isValidEmail}
            className={`w-full mt-4 bg-gradient-to-r ${color} hover:opacity-90 border-0 disabled:opacity-50`}
            data-testid={`button-select-tier-${tier.tier}`}
          >
            {checkoutMutation.isPending ? (
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
            ) : null}
            Buy {tier.name}
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

function PurchaseCalculator() {
  const [amount, setAmount] = useState("100");
  const { data: tiers } = useQuery<{ tiers: PresaleTier[] }>({
    queryKey: ["/api/presale/tiers"],
  });

  const usdAmount = parseFloat(amount) || 0;
  const tokenAmount = usdAmount / TOKEN_PRICE;
  
  const matchedTier = tiers?.tiers?.find(t => usdAmount >= (t.amount / 100));
  const bonusPercent = matchedTier?.bonus || 0;
  const bonusTokens = tokenAmount * (bonusPercent / 100);
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
            <p className="text-gray-500 text-sm">Bonus ({bonusPercent}%)</p>
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
              {matchedTier?.name || "Standard"} Tier
            </Badge>
          </div>
        </div>

        <p className="text-xs text-gray-500 text-center">
          This calculator shows potential token allocation. Actual amounts determined at checkout.
        </p>
      </div>
    </HolographicCard>
  );
}

export default function Presale() {
  const { data: tiersData, isLoading: tiersLoading } = useQuery<{ tiers: PresaleTier[] }>({
    queryKey: ["/api/presale/tiers"],
  });

  const tiers = tiersData?.tiers || [];

  return (
    <div className="min-h-screen bg-[#080c18] text-white">
      <div 
        className="absolute inset-0 opacity-30"
        style={{
          background: "radial-gradient(circle at 20% 20%, rgba(0,200,255,0.15) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(168,85,247,0.15) 0%, transparent 50%)",
        }}
      />
      
      <div className="relative max-w-7xl mx-auto px-4 py-12">
        <BackButton />

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/30 mb-6">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span className="text-cyan-300 text-sm font-medium">Founders Preview - Early Access</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Join the DarkWave Revolution
            </span>
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Be among the first to own DWC tokens and unlock exclusive early adopter rewards. 
            Ground floor opportunity - this is where it all begins.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8 mb-16">
          <PresaleProgress />
          <PurchaseCalculator />
        </div>

        <div id="tiers" className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">
            <span className="bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">
              Early Adopter Tiers
            </span>
          </h2>
          {tiersLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-cyan-400" />
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {tiers.map((tier, index) => (
                <TierCard key={tier.id} tier={tier} index={index} />
              ))}
            </div>
          )}
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

        <div id="how-it-works" className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-4">
            <span className="bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
              How It Works
            </span>
          </h2>
          <p className="text-gray-400 text-center mb-8 max-w-2xl mx-auto">
            Your tokens are allocated immediately upon purchase and will be distributed to your DarkWave wallet at mainnet launch.
          </p>
          
          <div className="grid md:grid-cols-4 gap-4 mb-8">
            <HolographicCard className="p-6 text-center relative" glow="cyan">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 flex items-center justify-center text-white font-bold text-sm">1</div>
              <Wallet className="w-8 h-8 text-cyan-400 mx-auto mb-4 mt-2" />
              <h3 className="text-lg font-bold text-white mb-2">Purchase Tokens</h3>
              <p className="text-gray-400 text-sm">Choose your tier and complete payment via Stripe</p>
            </HolographicCard>
            
            <HolographicCard className="p-6 text-center relative" glow="purple">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-sm">2</div>
              <CheckCircle className="w-8 h-8 text-purple-400 mx-auto mb-4 mt-2" />
              <h3 className="text-lg font-bold text-white mb-2">Tokens Allocated</h3>
              <p className="text-gray-400 text-sm">Your DWC allocation is recorded to your email</p>
            </HolographicCard>
            
            <HolographicCard className="p-6 text-center relative" glow="pink">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 flex items-center justify-center text-white font-bold text-sm">3</div>
              <Users className="w-8 h-8 text-pink-400 mx-auto mb-4 mt-2" />
              <h3 className="text-lg font-bold text-white mb-2">Create Wallet</h3>
              <p className="text-gray-400 text-sm">Sign up and create your DarkWave wallet before launch</p>
            </HolographicCard>
            
            <HolographicCard className="p-6 text-center relative" glow="amber">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 flex items-center justify-center text-white font-bold text-sm">4</div>
              <Coins className="w-8 h-8 text-amber-400 mx-auto mb-4 mt-2" />
              <h3 className="text-lg font-bold text-white mb-2">Receive Tokens</h3>
              <p className="text-gray-400 text-sm">Tokens distributed to your wallet at mainnet launch</p>
            </HolographicCard>
          </div>
          
          <div className="max-w-3xl mx-auto p-6 rounded-2xl bg-gradient-to-r from-cyan-500/10 via-purple-500/10 to-pink-500/10 border border-white/10">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                <Shield className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <h4 className="text-white font-semibold mb-2">Important: Token Distribution Timeline</h4>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Your presale purchase is <span className="text-cyan-400 font-medium">recorded immediately</span> and linked to your email. 
                  Before our mainnet launch (October 2026), you'll receive instructions to create your DarkWave wallet. 
                  At launch, your tokens will be <span className="text-green-400 font-medium">automatically distributed</span> to your wallet 
                  according to the vesting schedule (20% at TGE, 80% vested over 12 months).
                </p>
              </div>
            </div>
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

        <div className="text-center space-x-6">
          <Link href="/investment-simulator" className="inline-flex items-center gap-2 text-purple-400 hover:text-purple-300" data-testid="link-simulator">
            <Calculator className="w-4 h-4" /> Investment Simulator
          </Link>
          <Link href="/roadmap" className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300" data-testid="link-view-roadmap">
            View Full Roadmap <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
