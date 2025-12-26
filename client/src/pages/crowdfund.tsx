import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link, useSearch } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  ArrowLeft, Heart, Zap, Target, Shield, Users, Clock, 
  ExternalLink, Sparkles, TrendingUp, Lock, Gift, Award
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { GlassCard } from "@/components/glass-card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import darkwaveLogo from "@assets/generated_images/darkwave_token_transparent.png";
import blockchainBg from "@assets/generated_images/futuristic_blockchain_network_activity_monitor.png";
import dashboardImg from "@assets/generated_images/futuristic_dashboard_interface_for_managing_decentralized_applications.png";
import fantasyWorld from "@assets/generated_images/fantasy_sci-fi_world_landscape.png";
import deepSpace from "@assets/generated_images/deep_space_station.png";
import cyberpunkCity from "@assets/generated_images/cyberpunk_neon_city.png";
import medievalKingdom from "@assets/generated_images/medieval_fantasy_kingdom.png";

const CATEGORY_IMAGES: Record<string, string> = {
  defi: blockchainBg,
  wallet: dashboardImg,
  nft: cyberpunkCity,
  governance: medievalKingdom,
  infrastructure: deepSpace,
  gaming: fantasyWorld,
  security: blockchainBg,
};

interface CrowdfundFeature {
  id: string;
  title: string;
  description: string;
  category: string;
  goalAmountCents: number;
  raisedAmountCents: number;
  status: string;
  priority: number;
  targetRelease: string | null;
}

interface CrowdfundCampaign {
  id: string;
  name: string;
  description: string;
  goalAmountCents: number;
  raisedAmountCents: number;
}

interface Contribution {
  id: string;
  displayName: string | null;
  amountCents: number;
  transparencyHash: string | null;
  isAnonymous: boolean;
  message: string | null;
  createdAt: string;
  featureId: string | null;
}

const CATEGORY_ICONS: Record<string, any> = {
  defi: TrendingUp,
  wallet: Shield,
  nft: Sparkles,
  governance: Users,
  infrastructure: Zap,
  gaming: Award,
  security: Lock,
};

const CATEGORY_COLORS: Record<string, string> = {
  defi: "from-green-500/20 to-emerald-500/20 border-green-500/30",
  wallet: "from-blue-500/20 to-cyan-500/20 border-blue-500/30",
  nft: "from-purple-500/20 to-pink-500/20 border-purple-500/30",
  governance: "from-amber-500/20 to-orange-500/20 border-amber-500/30",
  infrastructure: "from-cyan-500/20 to-blue-500/20 border-cyan-500/30",
  gaming: "from-pink-500/20 to-rose-500/20 border-pink-500/30",
  security: "from-red-500/20 to-orange-500/20 border-red-500/30",
};

function formatCurrency(cents: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(cents / 100);
}

function ProgressMeter({ raised, goal, size = "default" }: { raised: number; goal: number; size?: "default" | "large" }) {
  const percentage = goal > 0 ? Math.min((raised / goal) * 100, 100) : 0;
  
  return (
    <div className="space-y-2">
      <div className="relative">
        <div className={`h-${size === "large" ? "4" : "2"} bg-gray-800 rounded-full overflow-hidden`}>
          <motion.div
            className="h-full bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 1.5, ease: "easeOut" }}
          />
        </div>
        {size === "large" && (
          <div 
            className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-lg shadow-cyan-500/50"
            style={{ left: `calc(${percentage}% - 6px)` }}
          />
        )}
      </div>
      <div className="flex justify-between text-sm">
        <span className="text-cyan-400 font-semibold">{formatCurrency(raised)} raised</span>
        <span className="text-gray-400">{percentage.toFixed(1)}% of {formatCurrency(goal)}</span>
      </div>
    </div>
  );
}

function DonationModal({ feature, onSuccess }: { feature?: CrowdfundFeature; onSuccess: () => void }) {
  const [amount, setAmount] = useState("25");
  const [displayName, setDisplayName] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const presetAmounts = [25, 50, 100, 500, 1000];

  const handleDonate = async () => {
    const amountCents = Math.round(parseFloat(amount) * 100);
    if (isNaN(amountCents) || amountCents < 100) {
      alert("Minimum donation is $1.00");
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch("/api/crowdfund/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amountCents,
          featureId: feature?.id || null,
          displayName,
          isAnonymous,
          message,
        }),
      });

      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert(data.error || "Failed to create checkout session");
      }
    } catch (error) {
      console.error("Checkout error:", error);
      alert("Failed to process donation");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <img src={darkwaveLogo} alt="DarkWave" className="w-16 h-16 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-white">
          {feature ? `Fund: ${feature.title}` : "Support DarkWave Development"}
        </h3>
        <p className="text-gray-400 text-sm mt-1">
          Every contribution helps build the future of decentralized technology
        </p>
      </div>

      <div className="grid grid-cols-3 gap-2">
        {presetAmounts.map((preset) => (
          <Button
            key={preset}
            variant={amount === String(preset) ? "default" : "outline"}
            size="sm"
            onClick={() => setAmount(String(preset))}
            className={amount === String(preset) ? "bg-cyan-600 hover:bg-cyan-700" : ""}
            data-testid={`preset-amount-${preset}`}
          >
            ${preset}
          </Button>
        ))}
      </div>

      <div className="space-y-2">
        <Label>Custom Amount (USD)</Label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">$</span>
          <Input
            type="number"
            min="1"
            step="1"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="pl-7"
            data-testid="input-custom-amount"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Display Name (optional)</Label>
        <Input
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          placeholder="How would you like to be recognized?"
          disabled={isAnonymous}
          data-testid="input-display-name"
        />
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox
          id="anonymous"
          checked={isAnonymous}
          onCheckedChange={(checked) => setIsAnonymous(checked as boolean)}
          data-testid="checkbox-anonymous"
        />
        <label htmlFor="anonymous" className="text-sm text-gray-400 cursor-pointer">
          Contribute anonymously
        </label>
      </div>

      <div className="space-y-2">
        <Label>Message (optional)</Label>
        <Textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Leave a message of support..."
          rows={2}
          data-testid="textarea-message"
        />
      </div>

      <Button
        className="w-full bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600"
        onClick={handleDonate}
        disabled={isLoading}
        data-testid="button-donate"
      >
        {isLoading ? "Processing..." : `Donate ${formatCurrency(Math.round(parseFloat(amount || "0") * 100))}`}
      </Button>

      <p className="text-xs text-gray-500 text-center">
        Secure payment powered by Stripe. All contributions are non-refundable donations.
      </p>
    </div>
  );
}

function FeatureCard({ feature }: { feature: CrowdfundFeature }) {
  const Icon = CATEGORY_ICONS[feature.category] || Zap;
  const colorClass = CATEGORY_COLORS[feature.category] || "from-gray-500/20 to-gray-600/20 border-gray-500/30";
  const bgImage = CATEGORY_IMAGES[feature.category] || blockchainBg;
  const percentage = feature.goalAmountCents > 0 
    ? (feature.raisedAmountCents / feature.goalAmountCents) * 100 
    : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02, y: -4 }}
      transition={{ duration: 0.3 }}
      className="group"
    >
      <div 
        className="relative overflow-hidden rounded-2xl h-full"
        style={{
          boxShadow: "0 0 40px rgba(0,200,255,0.1), inset 0 1px 0 rgba(255,255,255,0.1)",
        }}
      >
        <div className="absolute inset-0">
          <img 
            src={bgImage} 
            alt={feature.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-black/30" />
        </div>
        
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500" />
        
        <div className="absolute inset-0 opacity-30 pointer-events-none" style={{
          background: "repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.02) 10px, rgba(255,255,255,0.02) 20px)",
        }} />
        
        <div className="relative z-10 p-6 space-y-4 h-full flex flex-col">
          <div className="flex items-start justify-between">
            <div className="p-2 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20">
              <Icon className="w-5 h-5 text-cyan-400" />
            </div>
            <Badge className="bg-white/10 backdrop-blur-sm text-white border-white/20 text-xs capitalize">
              {feature.category}
            </Badge>
          </div>

          <div className="flex-1">
            <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
            <p className="text-gray-300 text-sm line-clamp-2">{feature.description}</p>
          </div>

          <div className="space-y-2">
            <div className="h-3 bg-black/50 backdrop-blur-sm rounded-full overflow-hidden border border-white/10">
              <motion.div
                className="h-full bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(percentage, 100)}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
              />
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-cyan-400 font-semibold">{formatCurrency(feature.raisedAmountCents)}</span>
              <span className="text-gray-400">Goal: {formatCurrency(feature.goalAmountCents)}</span>
            </div>
          </div>

          {feature.targetRelease && (
            <div className="flex items-center gap-1 text-xs text-gray-300">
              <Clock className="w-3 h-3" />
              <span>Target: {feature.targetRelease}</span>
            </div>
          )}

          <Dialog>
            <DialogTrigger asChild>
              <Button 
                className="w-full bg-gradient-to-r from-cyan-600 via-purple-600 to-pink-600 hover:opacity-90 border-0"
                data-testid={`button-fund-${feature.id}`}
              >
                <Heart className="w-4 h-4 mr-2" />
                Fund This Feature
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-gray-900 border-gray-800">
              <DonationModal feature={feature} onSuccess={() => {}} />
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </motion.div>
  );
}

function ContributionRow({ contribution }: { contribution: Contribution }) {
  const displayName = contribution.isAnonymous 
    ? "Anonymous Supporter" 
    : contribution.displayName || "Community Member";
  
  const timeAgo = new Date(contribution.createdAt).toLocaleDateString();

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg border border-gray-700/50"
    >
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-purple-500 flex items-center justify-center">
          <Heart className="w-4 h-4 text-white" />
        </div>
        <div>
          <p className="text-sm font-medium text-white">{displayName}</p>
          <p className="text-xs text-gray-400">{timeAgo}</p>
        </div>
      </div>
      <div className="text-right">
        <p className="text-sm font-bold text-cyan-400">{formatCurrency(contribution.amountCents)}</p>
        {contribution.transparencyHash && (
          <p className="text-xs text-gray-500 font-mono">#{contribution.transparencyHash}</p>
        )}
      </div>
    </motion.div>
  );
}

export default function CrowdfundPage() {
  const searchString = useSearch();
  const queryClient = useQueryClient();
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(searchString);
    if (params.get("success") === "true") {
      const contributionId = params.get("contribution");
      if (contributionId) {
        fetch(`/api/crowdfund/confirm/${contributionId}`, { method: "POST" })
          .then(() => {
            queryClient.invalidateQueries({ queryKey: ["/api/crowdfund"] });
            setShowSuccess(true);
          })
          .catch(console.error);
      }
    }
  }, [searchString, queryClient]);

  const { data: campaign } = useQuery<CrowdfundCampaign>({
    queryKey: ["/api/crowdfund/campaign"],
    queryFn: async () => {
      const res = await fetch("/api/crowdfund/campaign");
      if (!res.ok) throw new Error("Failed to fetch campaign");
      return res.json();
    },
  });

  const { data: features = [] } = useQuery<CrowdfundFeature[]>({
    queryKey: ["/api/crowdfund/features"],
    queryFn: async () => {
      const res = await fetch("/api/crowdfund/features");
      return res.json();
    },
  });

  const { data: contributions = [] } = useQuery<Contribution[]>({
    queryKey: ["/api/crowdfund/contributions"],
    queryFn: async () => {
      const res = await fetch("/api/crowdfund/contributions");
      return res.json();
    },
  });

  const { data: stats } = useQuery<{ totalRaised: number; goalAmount: number; contributorCount: number }>({
    queryKey: ["/api/crowdfund/stats"],
    queryFn: async () => {
      const res = await fetch("/api/crowdfund/stats");
      return res.json();
    },
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        <Link href="/">
          <Button variant="ghost" className="mb-6 text-gray-400 hover:text-white" data-testid="link-back">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
        </Link>

        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 p-4 bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-lg"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-green-500/20">
                <Heart className="w-5 h-5 text-green-400" />
              </div>
              <div>
                <h3 className="font-semibold text-green-400">Thank You!</h3>
                <p className="text-sm text-gray-300">Your contribution has been recorded and verified on the blockchain.</p>
              </div>
            </div>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <img src={darkwaveLogo} alt="DarkWave" className="w-12 h-12 flex-shrink-0 object-contain" />
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Development Fund
            </h1>
          </div>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">
            Support the transparent development of DarkWave Smart Chain. Every contribution is tracked on-chain with a unique DWSC stamp.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-12"
        >
          <div 
            className="relative overflow-hidden rounded-2xl"
            style={{
              boxShadow: "0 0 60px rgba(0,200,255,0.15), inset 0 1px 0 rgba(255,255,255,0.1)",
            }}
          >
            <div className="absolute inset-0">
              <img 
                src={blockchainBg} 
                alt="DarkWave Development"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-black/50" />
            </div>
            
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500" />
            
            <div className="absolute inset-0 opacity-20 pointer-events-none" style={{
              background: "repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.02) 10px, rgba(255,255,255,0.02) 20px)",
            }} />
            
            <div className="relative z-10 p-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-6">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <img src={darkwaveLogo} alt="DWC" className="w-16 h-16 object-contain flex-shrink-0" />
                  <div className="absolute inset-0 animate-pulse bg-cyan-400/20 rounded-full blur-xl" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white mb-1">{campaign?.name || "DarkWave Development Fund"}</h2>
                  <p className="text-gray-300">{campaign?.description || "Support the future of decentralized technology"}</p>
                </div>
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <Button 
                    size="lg" 
                    className="bg-gradient-to-r from-cyan-600 via-purple-600 to-pink-600 hover:opacity-90 px-8 border-0"
                    data-testid="button-donate-main"
                  >
                    <Gift className="w-5 h-5 mr-2" />
                    Support Development
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-gray-900 border-gray-800">
                  <DonationModal onSuccess={() => {}} />
                </DialogContent>
              </Dialog>
            </div>

            <ProgressMeter 
              raised={stats?.totalRaised || campaign?.raisedAmountCents || 0} 
              goal={stats?.goalAmount || campaign?.goalAmountCents || 10000000} 
              size="large" 
            />

            <div className="grid grid-cols-3 gap-4 mt-6">
              <div className="text-center p-4 bg-black/40 backdrop-blur-sm rounded-xl border border-white/10">
                <p className="text-2xl font-bold text-cyan-400">
                  {formatCurrency(stats?.totalRaised || 0)}
                </p>
                <p className="text-sm text-gray-400">Total Raised</p>
              </div>
              <div className="text-center p-4 bg-black/40 backdrop-blur-sm rounded-xl border border-white/10">
                <p className="text-2xl font-bold text-purple-400">
                  {stats?.contributorCount || 0}
                </p>
                <p className="text-sm text-gray-400">Contributors</p>
              </div>
              <div className="text-center p-4 bg-black/40 backdrop-blur-sm rounded-xl border border-white/10">
                <p className="text-2xl font-bold text-pink-400">
                  {features.length}
                </p>
                <p className="text-sm text-gray-400">Features Planned</p>
              </div>
            </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-12"
        >
          <div className="flex items-center gap-2 mb-6">
            <Target className="w-6 h-6 text-cyan-400" />
            <h2 className="text-2xl font-bold text-white">Feature Funding Goals</h2>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
              >
                <FeatureCard feature={feature} />
              </motion.div>
            ))}
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <GlassCard className="p-6 h-full">
              <div className="flex items-center gap-2 mb-6">
                <Users className="w-5 h-5 text-cyan-400" />
                <h3 className="text-xl font-bold text-white">Recent Contributions</h3>
              </div>
              
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {contributions.length > 0 ? (
                  contributions.map((contribution) => (
                    <ContributionRow key={contribution.id} contribution={contribution} />
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Heart className="w-12 h-12 mx-auto mb-3 opacity-30" />
                    <p>Be the first to contribute!</p>
                  </div>
                )}
              </div>
            </GlassCard>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <GlassCard className="p-6 h-full bg-gradient-to-br from-amber-500/5 to-orange-500/5 border-amber-500/20">
              <div className="flex items-center gap-2 mb-6">
                <Lock className="w-5 h-5 text-amber-400" />
                <h3 className="text-xl font-bold text-white">Community Voting</h3>
                <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30 ml-auto">
                  Coming Soon
                </Badge>
              </div>

              <div className="relative">
                <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm rounded-lg z-10 flex items-center justify-center">
                  <div className="text-center p-6">
                    <Lock className="w-12 h-12 text-amber-400 mx-auto mb-4" />
                    <h4 className="text-lg font-semibold text-white mb-2">Voting Unlocks with Funding</h4>
                    <p className="text-gray-400 text-sm mb-4">
                      Community voting will be enabled once we reach our initial funding milestone. 
                      Contributors will have weighted voting power.
                    </p>
                    <Badge variant="outline" className="text-amber-400 border-amber-400/30">
                      Target: $25,000
                    </Badge>
                  </div>
                </div>

                <div className="opacity-30 pointer-events-none space-y-3">
                  {["Cross-Chain Bridge", "Mobile Wallet", "NFT Staking"].map((item) => (
                    <div key={item} className="p-3 bg-gray-800/50 rounded-lg flex items-center justify-between">
                      <span className="text-gray-400">{item}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-gray-500">0 votes</span>
                        <Button size="sm" disabled>Vote</Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </GlassCard>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-12 text-center"
        >
          <GlassCard className="p-6 inline-block">
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <Shield className="w-4 h-4 text-cyan-400" />
              <span>All contributions are verified with DWSC transparency stamps</span>
              <ExternalLink className="w-4 h-4 ml-2" />
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </div>
  );
}
