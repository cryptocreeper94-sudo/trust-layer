import { useEffect } from "react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { 
  Coins, Gift, Clock, TrendingUp, ChevronRight, 
  ShoppingBag, Sparkles, Users, Award, CheckCircle, AlertCircle,
  Home, RefreshCw, CreditCard, Gamepad2, BookOpen, Shield,
  MessageSquare, Compass, Star, Zap, Trophy, Globe, LayoutDashboard
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { authFetch } from "@/hooks/use-firebase-auth";
import { GlassCard } from "@/components/glass-card";
import { Button } from "@/components/ui/button";
import { WalletButton } from "@/components/wallet-button";

import samuraiImage from "@assets/generated_images/feudal_japan_samurai_castle.png";

interface TokenBag {
  totalDwc: number;
  currentValue: number;
  launchProjectedValue: number;
  sources: {
    presale: { tokens: number; spentUsd: number; purchases: number };
    shells: { balance: number; convertedToDwc: number; conversionRate: number };
    airdrops: { pending: number };
    earlyAdopterBonus: { tokens: number; signupPosition: number | null; isEarlyAdopter: boolean };
  };
  tgeDate: string;
  launchPrice: number;
  currentPrice: number;
}

interface Purchase {
  id: string;
  tokenAmount: number;
  usdAmount: number;
  tier: string;
  status: string;
  paymentMethod: string;
  bonusPercentage: number;
  createdAt: string;
}

interface EarlyAdopterStats {
  signupPosition: number | null;
  isEarlyAdopter: boolean;
  bonusPercentage: number;
  remainingSlots: number;
}

const QUICK_LINKS = [
  { href: "/my-hub", icon: LayoutDashboard, label: "Your Portal", color: "purple" },
  { href: "/presale", icon: ShoppingBag, label: "Buy Signal", color: "cyan" },
  { href: "/chronicles", icon: Gamepad2, label: "Chronicles", color: "purple", image: samuraiImage },
  { href: "/rewards", icon: Gift, label: "Rewards", color: "amber" },
  { href: "/academy", icon: BookOpen, label: "Academy", color: "pink" },
  { href: "/community-hub", icon: Users, label: "Community", color: "emerald" },
  { href: "/ecosystem", icon: Globe, label: "Ecosystem", color: "blue" },
  { href: "/faq", icon: MessageSquare, label: "FAQ", color: "slate" },
  { href: "/strike-agent", icon: Zap, label: "Strike Agent", color: "red" },
];

export default function MyTokensPage() {
  const { user, isLoading: authLoading, isAuthenticated } = useAuth();

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      window.location.href = "/?login=true";
    }
  }, [authLoading, isAuthenticated]);

  const { data: bagData, isLoading: bagLoading, refetch: refetchBag } = useQuery<TokenBag>({
    queryKey: ['user-token-bag'],
    queryFn: async () => {
      const res = await authFetch('/api/user/dwc-bag');
      if (!res.ok) throw new Error('Failed to fetch');
      return res.json();
    },
    enabled: isAuthenticated,
  });

  const { data: purchasesData, isLoading: purchasesLoading } = useQuery<{ purchases: Purchase[] }>({
    queryKey: ['user-purchases'],
    queryFn: async () => {
      const res = await authFetch('/api/user/purchases');
      if (!res.ok) throw new Error('Failed to fetch');
      return res.json();
    },
    enabled: isAuthenticated,
  });

  const { data: earlyAdopterData } = useQuery<EarlyAdopterStats>({
    queryKey: ['early-adopter-stats'],
    queryFn: async () => {
      const res = await authFetch('/api/user/early-adopter-stats');
      if (!res.ok) throw new Error('Failed to fetch');
      return res.json();
    },
    enabled: isAuthenticated,
  });

  if (authLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="animate-pulse text-cyan-400">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  const bag = bagData;
  const purchases = purchasesData?.purchases || [];
  const isLoading = bagLoading || purchasesLoading;
  const hasTokens = (bag?.totalDwc || 0) > 0;

  return (
    <div className="min-h-screen bg-slate-950">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-0 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-pink-500/5 rounded-full blur-3xl" />
      </div>

      <header className="sticky top-0 z-50 bg-slate-950/80 backdrop-blur-xl border-b border-white/10">
        <div className="px-4 py-3 flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-purple-500 flex items-center justify-center">
              <Compass className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-white">My Dashboard</h1>
              <p className="text-[10px] text-white/40">{user?.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => refetchBag()}
              className="p-2.5 bg-white/10 rounded-xl hover:bg-white/20 transition-colors"
              data-testid="button-refresh"
            >
              <RefreshCw className={`w-5 h-5 text-white ${isLoading ? 'animate-spin' : ''}`} />
            </button>
            <Link href="/">
              <a className="p-2.5 bg-white/10 rounded-xl hover:bg-white/20 transition-colors" data-testid="link-home">
                <Home className="w-5 h-5 text-white" />
              </a>
            </Link>
          </div>
        </div>
      </header>

      <main className="relative z-10 px-4 py-6 pb-24 max-w-7xl mx-auto">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-12 h-12 border-3 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin mb-4" />
            <span className="text-sm text-white/50">Loading your dashboard...</span>
          </div>
        ) : (
          <>
            {/* Welcome Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
                Welcome back{user?.displayName ? `, ${user.displayName.split(' ')[0]}` : ''}!
              </h2>
              <p className="text-white/60">Your Trust Layer ecosystem hub</p>
            </motion.div>

            {/* Account Status Cards - Desktop Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
              {/* Signal Token Balance Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 }}
              >
                <GlassCard glow className="h-full overflow-hidden">
                  <div className="bg-gradient-to-br from-cyan-500/20 via-purple-500/20 to-pink-500/20 p-5 h-full">
                    <div className="flex items-center gap-2 mb-4">
                      <Coins className="w-5 h-5 text-cyan-400" />
                      <span className="text-sm font-medium text-white/70">Signal Balance</span>
                    </div>
                    <div className="text-4xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-1">
                      {(bag?.totalDwc || 0).toLocaleString()}
                    </div>
                    <div className="text-sm text-white/50 mb-4">
                      ≈ ${(bag?.currentValue || 0).toFixed(2)} USD
                    </div>
                    {hasTokens ? (
                      <div className="flex items-center gap-2 text-sm text-emerald-400">
                        <TrendingUp className="w-4 h-4" />
                        <span>Launch value: ${(bag?.launchProjectedValue || 0).toFixed(2)}</span>
                      </div>
                    ) : (
                      <Link href="/presale">
                        <Button size="sm" className="w-full bg-gradient-to-r from-cyan-500 to-purple-500">
                          Get Your First Tokens
                        </Button>
                      </Link>
                    )}
                  </div>
                </GlassCard>
              </motion.div>

              {/* Early Adopter Status */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <GlassCard className="h-full">
                  <div className="p-5 h-full">
                    <div className="flex items-center gap-2 mb-4">
                      <Award className="w-5 h-5 text-amber-400" />
                      <span className="text-sm font-medium text-white/70">Member Status</span>
                    </div>
                    {earlyAdopterData?.isEarlyAdopter ? (
                      <>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="px-3 py-1 bg-amber-500/20 text-amber-400 rounded-full text-sm font-medium">
                            Early Adopter #{earlyAdopterData.signupPosition}
                          </span>
                        </div>
                        <p className="text-sm text-white/50 mb-3">
                          You're in the first 500 members! You'll receive a {earlyAdopterData.bonusPercentage}% bonus on all presale purchases.
                        </p>
                        <div className="flex items-center gap-1 text-emerald-400 text-sm">
                          <CheckCircle className="w-4 h-4" />
                          <span>Bonus Applied</span>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="px-3 py-1 bg-white/10 text-white/70 rounded-full text-sm font-medium">
                            Member
                          </span>
                        </div>
                        <p className="text-sm text-white/50 mb-3">
                          Welcome to Trust Layer! Explore the ecosystem and earn rewards.
                        </p>
                        <Link href="/rewards">
                          <Button size="sm" variant="outline" className="border-white/20 text-white">
                            View Rewards
                          </Button>
                        </Link>
                      </>
                    )}
                  </div>
                </GlassCard>
              </motion.div>

              {/* TGE Countdown */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
              >
                <GlassCard className="h-full">
                  <div className="p-5 h-full">
                    <div className="flex items-center gap-2 mb-4">
                      <Clock className="w-5 h-5 text-purple-400" />
                      <span className="text-sm font-medium text-white/70">Token Launch</span>
                    </div>
                    <div className="text-2xl font-bold text-white mb-1">
                      {bag?.tgeDate || 'Coming Soon'}
                    </div>
                    <p className="text-sm text-white/50 mb-4">
                      Tokens distributed to connected wallet
                    </p>
                    <div className="[&>button]:w-full">
                      <WalletButton />
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            </div>

            {/* Quick Access Cards */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mb-8"
            >
              <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Compass className="w-5 h-5 text-cyan-400" />
                Explore the Ecosystem
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {QUICK_LINKS.map((link, i) => (
                  <Link href={link.href} key={link.href}>
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.2 + i * 0.05 }}
                      whileHover={{ scale: 1.02 }}
                      className="cursor-pointer"
                    >
                      <GlassCard className="overflow-hidden hover:border-white/30 transition-all group">
                        {link.image ? (
                          <div className="relative h-24 md:h-32">
                            <img 
                              src={link.image} 
                              alt={link.label}
                              className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />
                            <div className="absolute bottom-0 left-0 right-0 p-3">
                              <div className="flex items-center gap-2">
                                <div className={`w-8 h-8 rounded-lg bg-${link.color}-500/20 flex items-center justify-center`}>
                                  <link.icon className={`w-4 h-4 text-${link.color}-400`} />
                                </div>
                                <span className="text-sm font-medium text-white">{link.label}</span>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="h-24 md:h-32 p-4 flex flex-col items-center justify-center bg-gradient-to-br from-white/5 to-transparent group-hover:from-white/10">
                            <div className={`w-12 h-12 rounded-xl bg-${link.color}-500/20 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform`}>
                              <link.icon className={`w-6 h-6 text-${link.color}-400`} />
                            </div>
                            <span className="text-sm font-medium text-white">{link.label}</span>
                          </div>
                        )}
                      </GlassCard>
                    </motion.div>
                  </Link>
                ))}
              </div>
            </motion.div>

            {/* Token Sources Section - Only show if user has tokens */}
            {hasTokens && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
                className="mb-8"
              >
                <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-purple-400" />
                  Your Token Sources
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <GlassCard>
                    <div className="p-4 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-cyan-500/20 flex items-center justify-center">
                          <ShoppingBag className="w-5 h-5 text-cyan-400" />
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-white">Presale</div>
                          <div className="text-xs text-white/50">
                            {bag?.sources?.presale?.purchases || 0} purchases
                          </div>
                        </div>
                      </div>
                      <div className="text-lg font-bold text-cyan-400">
                        {(bag?.sources?.presale?.tokens || 0).toLocaleString()}
                      </div>
                    </div>
                  </GlassCard>

                  {bag?.sources?.earlyAdopterBonus?.isEarlyAdopter && (
                    <GlassCard>
                      <div className="p-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center">
                            <Award className="w-5 h-5 text-amber-400" />
                          </div>
                          <div>
                            <div className="text-sm font-semibold text-white">Early Bonus</div>
                            <div className="text-xs text-white/50">5% extra</div>
                          </div>
                        </div>
                        <div className="text-lg font-bold text-amber-400">
                          +{(bag?.sources?.earlyAdopterBonus?.tokens || 0).toLocaleString()}
                        </div>
                      </div>
                    </GlassCard>
                  )}

                  {(bag?.sources?.shells?.balance || 0) > 0 && (
                    <GlassCard>
                      <div className="p-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center">
                            <Gift className="w-5 h-5 text-purple-400" />
                          </div>
                          <div>
                            <div className="text-sm font-semibold text-white">Shell Rewards</div>
                            <div className="text-xs text-white/50">{bag?.sources?.shells?.balance} shells</div>
                          </div>
                        </div>
                        <div className="text-lg font-bold text-purple-400">
                          {(bag?.sources?.shells?.convertedToDwc || 0).toLocaleString()}
                        </div>
                      </div>
                    </GlassCard>
                  )}

                  {(bag?.sources?.airdrops?.pending || 0) > 0 && (
                    <GlassCard>
                      <div className="p-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                            <Gift className="w-5 h-5 text-emerald-400" />
                          </div>
                          <div>
                            <div className="text-sm font-semibold text-white">Airdrops</div>
                            <div className="text-xs text-white/50">Pending TGE</div>
                          </div>
                        </div>
                        <div className="text-lg font-bold text-emerald-400">
                          {(bag?.sources?.airdrops?.pending || 0).toLocaleString()}
                        </div>
                      </div>
                    </GlassCard>
                  )}
                </div>
              </motion.div>
            )}

            {/* Purchase History - Collapsible */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mb-8"
            >
              <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-cyan-400" />
                Purchase History
              </h2>
              
              {purchases.length === 0 ? (
                <GlassCard>
                  <div className="p-8 text-center">
                    <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mx-auto mb-4">
                      <ShoppingBag className="w-8 h-8 text-white/20" />
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2">No Purchases Yet</h3>
                    <p className="text-sm text-white/50 mb-6 max-w-md mx-auto">
                      Get Signal tokens now during the presale at the lowest price before launch.
                    </p>
                    <Link href="/presale">
                      <Button className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:opacity-90">
                        <ShoppingBag className="w-4 h-4 mr-2" />
                        Buy Signal Tokens
                      </Button>
                    </Link>
                  </div>
                </GlassCard>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {purchases.slice(0, 6).map((purchase, i) => (
                    <motion.div
                      key={purchase.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 + i * 0.05 }}
                    >
                      <GlassCard>
                        <div className="p-4">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              {purchase.status === 'confirmed' ? (
                                <CheckCircle className="w-4 h-4 text-emerald-400" />
                              ) : (
                                <AlertCircle className="w-4 h-4 text-amber-400" />
                              )}
                              <span className={`text-xs font-medium uppercase ${
                                purchase.status === 'confirmed' ? 'text-emerald-400' : 'text-amber-400'
                              }`}>
                                {purchase.status}
                              </span>
                              {purchase.tier && (
                                <span className="text-[10px] px-2 py-0.5 bg-purple-500/20 text-purple-400 rounded-full">
                                  {purchase.tier}
                                </span>
                              )}
                            </div>
                            <div className="text-[10px] text-white/40">
                              {new Date(purchase.createdAt).toLocaleDateString()}
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="text-lg font-bold text-white">
                                {purchase.tokenAmount.toLocaleString()} SIG
                              </div>
                              <div className="text-xs text-white/50">
                                ${purchase.usdAmount.toFixed(2)} via {purchase.paymentMethod || 'card'}
                                {purchase.bonusPercentage > 0 && (
                                  <span className="text-emerald-400 ml-2">+{purchase.bonusPercentage}% bonus</span>
                                )}
                              </div>
                            </div>
                            <Coins className="w-6 h-6 text-cyan-400/30" />
                          </div>
                        </div>
                      </GlassCard>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>

            {/* Getting Started Steps - For new users */}
            {!hasTokens && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 }}
                className="mb-8"
              >
                <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <Star className="w-5 h-5 text-amber-400" />
                  Getting Started
                </h2>
                <GlassCard>
                  <div className="p-6">
                    <div className="space-y-4">
                      <div className="flex items-start gap-4">
                        <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
                          <CheckCircle className="w-4 h-4 text-emerald-400" />
                        </div>
                        <div>
                          <h4 className="text-sm font-semibold text-white">Create Account</h4>
                          <p className="text-xs text-white/50">You're all set! Your account is active.</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-4">
                        <div className="w-8 h-8 rounded-full bg-cyan-500/20 flex items-center justify-center flex-shrink-0">
                          <span className="text-cyan-400 font-bold text-sm">2</span>
                        </div>
                        <div>
                          <h4 className="text-sm font-semibold text-white">Get Signal Tokens</h4>
                          <p className="text-xs text-white/50">Purchase during presale at $0.001 (launches at $0.01)</p>
                          <Link href="/presale">
                            <Button size="sm" variant="outline" className="mt-2 border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10">
                              Go to Presale <ChevronRight className="w-3 h-3 ml-1" />
                            </Button>
                          </Link>
                        </div>
                      </div>
                      <div className="flex items-start gap-4">
                        <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                          <span className="text-purple-400 font-bold text-sm">3</span>
                        </div>
                        <div>
                          <h4 className="text-sm font-semibold text-white">Explore Chronicles</h4>
                          <p className="text-xs text-white/50">Journey through 70+ historical eras in our discernment-based game</p>
                          <Link href="/chronicles">
                            <Button size="sm" variant="outline" className="mt-2 border-purple-500/30 text-purple-400 hover:bg-purple-500/10">
                              Play Chronicles <ChevronRight className="w-3 h-3 ml-1" />
                            </Button>
                          </Link>
                        </div>
                      </div>
                      <div className="flex items-start gap-4">
                        <div className="w-8 h-8 rounded-full bg-pink-500/20 flex items-center justify-center flex-shrink-0">
                          <span className="text-pink-400 font-bold text-sm">4</span>
                        </div>
                        <div>
                          <h4 className="text-sm font-semibold text-white">Connect Wallet</h4>
                          <p className="text-xs text-white/50">Link your wallet to receive tokens at launch</p>
                          <div className="mt-2">
                            <WalletButton />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            )}

            {/* Quick Actions Footer */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-3"
            >
              <Link href="/presale">
                <GlassCard className="hover:border-cyan-500/50 transition-colors cursor-pointer">
                  <div className="p-4 flex flex-col items-center text-center">
                    <ShoppingBag className="w-6 h-6 text-cyan-400 mb-2" />
                    <span className="text-xs font-medium text-white">Buy Signal</span>
                  </div>
                </GlassCard>
              </Link>
              <Link href="/rewards">
                <GlassCard className="hover:border-purple-500/50 transition-colors cursor-pointer">
                  <div className="p-4 flex flex-col items-center text-center">
                    <Gift className="w-6 h-6 text-purple-400 mb-2" />
                    <span className="text-xs font-medium text-white">Rewards</span>
                  </div>
                </GlassCard>
              </Link>
              <Link href="/staking">
                <GlassCard className="hover:border-emerald-500/50 transition-colors cursor-pointer">
                  <div className="p-4 flex flex-col items-center text-center">
                    <Trophy className="w-6 h-6 text-emerald-400 mb-2" />
                    <span className="text-xs font-medium text-white">Staking</span>
                  </div>
                </GlassCard>
              </Link>
              <Link href="/support">
                <GlassCard className="hover:border-amber-500/50 transition-colors cursor-pointer">
                  <div className="p-4 flex flex-col items-center text-center">
                    <Shield className="w-6 h-6 text-amber-400 mb-2" />
                    <span className="text-xs font-medium text-white">Support</span>
                  </div>
                </GlassCard>
              </Link>
            </motion.div>
          </>
        )}
      </main>
    </div>
  );
}
