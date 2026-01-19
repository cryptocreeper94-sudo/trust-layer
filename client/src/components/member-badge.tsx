import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { 
  BadgeCheck, CreditCard, Coins, Trophy, Gift, 
  ChevronDown, Sparkles, X, ExternalLink
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/glass-card";

interface MemberStats {
  signupPosition: number | null;
  crowdfundTotalCents: number;
  tokenPurchasePosition: number | null;
}

interface EarlyAdopterCounters {
  signupPosition: string;
  tokenPurchasePosition: string;
}

interface TokenBalance {
  sources: {
    presale: { tokens: number };
    crowdfund: { tokens: number };
    affiliateCommissions: { tokens: number };
    earlyAdopterBonus: { tokens: number; signupPosition: number | null };
    shellsConverted: { tokens: number };
    zealyRewards: { tokens: number };
  };
  totalTokens: number;
  totalPendingTokens: number;
}

export function MemberBadge({ userId }: { userId?: string }) {
  const [isOpen, setIsOpen] = useState(false);

  const { data: userStats } = useQuery<MemberStats>({
    queryKey: ["/api/user/early-adopter-stats"],
    enabled: !!userId,
  });

  const { data: counters } = useQuery<EarlyAdopterCounters>({
    queryKey: ["/api/early-adopter/counters"],
  });

  const { data: tokenBalance } = useQuery<TokenBalance>({
    queryKey: ["/api/user/token-balance"],
    enabled: !!userId,
  });

  const memberNumber = userStats?.signupPosition ?? null;
  const totalMembers = counters?.signupPosition ? parseInt(counters.signupPosition) : 0;
  const isEarlyAdopter = memberNumber !== null && memberNumber !== undefined && memberNumber <= 500;

  if (!userId || memberNumber === null || memberNumber === undefined) return null;

  const formatTokens = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
    if (num >= 1000) return (num / 1000).toFixed(1) + "K";
    return num.toLocaleString();
  };

  return (
    <div className="relative">
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border border-cyan-500/30 hover:border-cyan-400/50 transition-all"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        data-testid="button-member-badge"
      >
        <BadgeCheck className="w-4 h-4 text-cyan-400" />
        <span className="text-xs font-bold text-white">#{memberNumber}</span>
        {isEarlyAdopter && (
          <Sparkles className="w-3 h-3 text-amber-400" />
        )}
        <ChevronDown className={`w-3 h-3 text-white/60 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div 
              className="fixed inset-0 z-40" 
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="absolute right-0 top-full mt-2 w-72 z-50"
            >
              <GlassCard glow className="overflow-hidden">
                <div className="p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <div className="p-2 rounded-xl bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border border-cyan-500/30">
                        <BadgeCheck className="w-5 h-5 text-cyan-400" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-white">Member #{memberNumber}</p>
                        <p className="text-[10px] text-muted-foreground">
                          of {totalMembers.toLocaleString()} total members
                        </p>
                      </div>
                    </div>
                    <button 
                      onClick={() => setIsOpen(false)}
                      className="p-1 rounded-lg hover:bg-white/10 transition-colors"
                    >
                      <X className="w-4 h-4 text-white/60" />
                    </button>
                  </div>

                  {isEarlyAdopter && (
                    <div className="mb-4 p-2 rounded-lg bg-amber-500/10 border border-amber-500/30">
                      <div className="flex items-center gap-2">
                        <Trophy className="w-4 h-4 text-amber-400" />
                        <span className="text-xs font-semibold text-amber-400">Early Adopter Status</span>
                      </div>
                      <p className="text-[10px] text-amber-400/70 mt-1">
                        First 500 members get bonus rewards
                      </p>
                    </div>
                  )}

                  <div className="space-y-3 mb-4">
                    <div className="flex items-center justify-between p-2 rounded-lg bg-white/5">
                      <div className="flex items-center gap-2">
                        <Coins className="w-4 h-4 text-primary" />
                        <span className="text-xs text-white/80">Signal Balance</span>
                      </div>
                      <span className="text-sm font-bold text-white">
                        {tokenBalance ? formatTokens(tokenBalance.totalTokens) : "0"} SIG
                      </span>
                    </div>

                    {tokenBalance && tokenBalance.totalPendingTokens > 0 && (
                      <div className="flex items-center justify-between p-2 rounded-lg bg-white/5">
                        <div className="flex items-center gap-2">
                          <Gift className="w-4 h-4 text-green-400" />
                          <span className="text-xs text-white/80">Pending Airdrop</span>
                        </div>
                        <span className="text-sm font-bold text-green-400">
                          +{formatTokens(tokenBalance.totalPendingTokens)} SIG
                        </span>
                      </div>
                    )}

                    {userStats && userStats.crowdfundTotalCents > 0 && (
                      <div className="flex items-center justify-between p-2 rounded-lg bg-white/5">
                        <div className="flex items-center gap-2">
                          <Sparkles className="w-4 h-4 text-purple-400" />
                          <span className="text-xs text-white/80">Contributed</span>
                        </div>
                        <span className="text-sm font-bold text-white">
                          ${(userStats.crowdfundTotalCents / 100).toFixed(2)}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Link href="/dashboard" onClick={() => setIsOpen(false)}>
                      <Button 
                        className="w-full bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-400 hover:to-purple-400 text-white text-xs h-9"
                        data-testid="button-view-trust-card"
                      >
                        <CreditCard className="w-4 h-4 mr-2" />
                        View Trust Card
                        <ExternalLink className="w-3 h-3 ml-2" />
                      </Button>
                    </Link>
                    <Link href="/my-tokens" onClick={() => setIsOpen(false)}>
                      <Button 
                        variant="outline"
                        className="w-full border-white/20 text-white text-xs h-8"
                        data-testid="button-view-tokens"
                      >
                        View All Tokens & Rewards
                      </Button>
                    </Link>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
