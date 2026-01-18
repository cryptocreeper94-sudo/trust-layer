import { useEffect } from "react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { 
  Coins, Gift, Clock, TrendingUp, Wallet, ChevronRight, 
  ShoppingBag, Sparkles, Users, Award, CheckCircle, AlertCircle,
  Home, RefreshCw, ExternalLink, CreditCard
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { GlassCard } from "@/components/glass-card";
import { Button } from "@/components/ui/button";
import { WalletButton } from "@/components/wallet-button";

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

export default function MyTokensPage() {
  const { user, isLoading: authLoading, isAuthenticated } = useAuth();

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      window.location.href = "/api/login";
    }
  }, [authLoading, isAuthenticated]);

  const { data: bagData, isLoading: bagLoading, refetch: refetchBag } = useQuery<TokenBag>({
    queryKey: ['user-token-bag'],
    queryFn: async () => {
      const res = await fetch('/api/user/dwc-bag');
      if (!res.ok) throw new Error('Failed to fetch');
      return res.json();
    },
    enabled: isAuthenticated,
  });

  const { data: purchasesData, isLoading: purchasesLoading } = useQuery<{ purchases: Purchase[] }>({
    queryKey: ['user-purchases'],
    queryFn: async () => {
      const res = await fetch('/api/user/purchases');
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

  return (
    <div className="min-h-screen bg-slate-950">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-0 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl" />
      </div>

      <header className="sticky top-0 z-50 bg-slate-950/80 backdrop-blur-xl border-b border-white/10">
        <div className="px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-purple-500 flex items-center justify-center">
              <Coins className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-white">My Tokens</h1>
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

      <main className="relative z-10 px-4 py-6 pb-24 max-w-2xl mx-auto">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-12 h-12 border-3 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin mb-4" />
            <span className="text-sm text-white/50">Loading your tokens...</span>
          </div>
        ) : (
          <>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6"
            >
              <GlassCard glow className="overflow-hidden">
                <div className="bg-gradient-to-br from-cyan-500/20 via-purple-500/20 to-pink-500/20 p-6">
                  <div className="text-center mb-6">
                    <div className="text-xs text-white/50 uppercase tracking-wider mb-1">Total Signal (SIG) Tokens</div>
                    <div className="text-5xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                      {(bag?.totalDwc || 0).toLocaleString()}
                    </div>
                    <div className="text-sm text-white/50 mt-1">
                      ≈ ${(bag?.currentValue || 0).toFixed(2)} USD
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="bg-white/5 rounded-xl p-3 text-center">
                      <div className="text-[10px] text-white/40 uppercase mb-1">Current Price</div>
                      <div className="text-lg font-bold text-white">${bag?.currentPrice || 0.001}</div>
                    </div>
                    <div className="bg-white/5 rounded-xl p-3 text-center">
                      <div className="text-[10px] text-white/40 uppercase mb-1">Launch Price</div>
                      <div className="text-lg font-bold text-emerald-400">${bag?.launchPrice || 0.10}</div>
                    </div>
                  </div>

                  <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-emerald-400" />
                        <span className="text-sm text-white">Projected Launch Value</span>
                      </div>
                      <div className="text-lg font-bold text-emerald-400">
                        ${(bag?.launchProjectedValue || 0).toFixed(2)}
                      </div>
                    </div>
                    <div className="text-[10px] text-emerald-400/60 mt-1">
                      Based on ${bag?.launchPrice || 0.10} launch price estimate
                    </div>
                  </div>
                </div>
              </GlassCard>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mb-6"
            >
              <h2 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                Token Sources
              </h2>
              <div className="space-y-3">
                <GlassCard>
                  <div className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-cyan-500/20 flex items-center justify-center">
                        <ShoppingBag className="w-5 h-5 text-cyan-400" />
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-white">Presale Purchases</div>
                        <div className="text-xs text-white/50">
                          {bag?.sources?.presale?.purchases || 0} purchase(s) • ${(bag?.sources?.presale?.spentUsd || 0).toFixed(2)} spent
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-cyan-400">
                        {(bag?.sources?.presale?.tokens || 0).toLocaleString()}
                      </div>
                      <div className="text-[10px] text-white/40">SIG</div>
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
                          <div className="text-sm font-semibold text-white">Early Adopter Bonus</div>
                          <div className="text-xs text-white/50">
                            Signup #{bag?.sources?.earlyAdopterBonus?.signupPosition} • 5% bonus
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-amber-400">
                          +{(bag?.sources?.earlyAdopterBonus?.tokens || 0).toLocaleString()}
                        </div>
                        <div className="text-[10px] text-white/40">SIG</div>
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
                          <div className="text-xs text-white/50">
                            {bag?.sources?.shells?.balance || 0} shells @ {bag?.sources?.shells?.conversionRate}:1
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-purple-400">
                          {(bag?.sources?.shells?.convertedToDwc || 0).toLocaleString()}
                        </div>
                        <div className="text-[10px] text-white/40">SIG</div>
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
                          <div className="text-sm font-semibold text-white">Pending Airdrops</div>
                          <div className="text-xs text-white/50">
                            Will be distributed at TGE
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-emerald-400">
                          {(bag?.sources?.airdrops?.pending || 0).toLocaleString()}
                        </div>
                        <div className="text-[10px] text-white/40">SIG</div>
                      </div>
                    </div>
                  </GlassCard>
                )}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mb-6"
            >
              <h2 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-purple-400" />
                Purchase History
              </h2>
              
              {purchases.length === 0 ? (
                <GlassCard>
                  <div className="p-6 text-center">
                    <ShoppingBag className="w-12 h-12 text-white/20 mx-auto mb-3" />
                    <p className="text-sm text-white/50 mb-4">No purchases yet</p>
                    <Link href="/presale">
                      <Button className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:opacity-90">
                        Buy Signal Tokens
                      </Button>
                    </Link>
                  </div>
                </GlassCard>
              ) : (
                <div className="space-y-3">
                  {purchases.map((purchase, i) => (
                    <motion.div
                      key={purchase.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
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

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mb-6"
            >
              <h2 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-400" />
                Token Generation Event
              </h2>
              <GlassCard>
                <div className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm text-white/70">TGE Date</span>
                    <span className="text-sm font-semibold text-white">{bag?.tgeDate || 'Q2 2026'}</span>
                  </div>
                  <div className="text-xs text-white/50 mb-4">
                    Your tokens will be distributed to your connected wallet at the Token Generation Event. 
                    Make sure to connect a Solana wallet before TGE.
                  </div>
                  <div className="[&>button]:w-full">
                    <WalletButton />
                  </div>
                </div>
              </GlassCard>
            </motion.div>

            <div className="grid grid-cols-2 gap-3">
              <Link href="/presale">
                <GlassCard className="hover:border-cyan-500/50 transition-colors cursor-pointer">
                  <div className="p-4 flex flex-col items-center text-center">
                    <ShoppingBag className="w-6 h-6 text-cyan-400 mb-2" />
                    <span className="text-xs font-medium text-white">Buy More SIG</span>
                  </div>
                </GlassCard>
              </Link>
              <Link href="/rewards">
                <GlassCard className="hover:border-purple-500/50 transition-colors cursor-pointer">
                  <div className="p-4 flex flex-col items-center text-center">
                    <Gift className="w-6 h-6 text-purple-400 mb-2" />
                    <span className="text-xs font-medium text-white">Earn Rewards</span>
                  </div>
                </GlassCard>
              </Link>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
