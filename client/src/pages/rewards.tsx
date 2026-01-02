import { motion } from "framer-motion";
import { Link } from "wouter";
import { ArrowLeft, Gift, Users, Coins, Heart, Trophy, Sparkles, Check, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { GlassCard } from "@/components/glass-card";
import { Footer } from "@/components/footer";
import { useFirebaseAuth, getAuthToken } from "@/hooks/use-firebase-auth";
import { useQuery } from "@tanstack/react-query";

const CROWDFUND_TIERS = [
  { name: "Supporter", min: 25, max: 99, bonus: 10, color: "from-slate-500 to-slate-600" },
  { name: "Backer", min: 100, max: 499, bonus: 25, color: "from-cyan-500 to-blue-600" },
  { name: "Advocate", min: 500, max: 1999, bonus: 40, color: "from-purple-500 to-pink-600" },
  { name: "Founder", min: 2000, max: null, bonus: 60, color: "from-amber-500 to-orange-600" },
];

function getTierFromAmount(cents: number): typeof CROWDFUND_TIERS[0] | null {
  const dollars = cents / 100;
  for (let i = CROWDFUND_TIERS.length - 1; i >= 0; i--) {
    if (dollars >= CROWDFUND_TIERS[i].min) {
      return CROWDFUND_TIERS[i];
    }
  }
  return null;
}

export default function Rewards() {
  const { user } = useFirebaseAuth();
  
  const { data: userStats } = useQuery<{
    signupPosition?: number | null;
    crowdfundTotalCents?: number;
    tokenPurchasePosition?: number | null;
  }>({
    queryKey: ["/api/user/early-adopter-stats", user?.uid],
    queryFn: async () => {
      const token = await getAuthToken();
      if (!token) return { signupPosition: null, crowdfundTotalCents: 0, tokenPurchasePosition: null };
      const res = await fetch("/api/user/early-adopter-stats", {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error("Failed to fetch stats");
      return res.json();
    },
    enabled: !!user,
  });

  const { data: counters } = useQuery<{
    signupPosition?: string;
  }>({
    queryKey: ["/api/early-adopter/counters"],
    queryFn: async () => {
      const res = await fetch("/api/early-adopter/counters");
      return res.json();
    },
  });

  const signupPosition = userStats?.signupPosition ?? null;
  const isEarlyAdopter = signupPosition !== null && signupPosition <= 500;
  const crowdfundTotal = userStats?.crowdfundTotalCents ?? 0;
  const crowdfundTier = getTierFromAmount(crowdfundTotal);
  const tokenPurchasePosition = userStats?.tokenPurchasePosition ?? null;
  const isEarlyBuyer = tokenPurchasePosition !== null && tokenPurchasePosition <= 200;

  const spotsRemaining = counters?.signupPosition ? Math.max(0, 500 - parseInt(counters.signupPosition)) : 500;

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-transparent to-cyan-900/20 pointer-events-none" />
      
      <header className="sticky top-0 z-50 bg-slate-950/80 backdrop-blur-xl border-b border-white/5">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/">
            <Button variant="ghost" size="sm" className="gap-2" data-testid="button-back-home">
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Button>
          </Link>
          <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0">
            <Sparkles className="w-3 h-3 mr-1" />
            Early Adopter Program
          </Badge>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <Badge className="bg-cyan-500/20 text-cyan-400 border-cyan-500/30 mb-4">
            Limited Time Offer
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Early Adopter Rewards
          </h1>
          <p className="text-xl text-white/70 max-w-2xl mx-auto">
            Be among the first to join DarkWave and receive exclusive token bonuses at launch
          </p>
        </motion.div>

        {spotsRemaining > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-8 p-4 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-2xl border border-purple-500/30 text-center"
          >
            <p className="text-lg">
              <span className="text-purple-400 font-bold">{spotsRemaining}</span> spots remaining for the First 500 Airdrop!
            </p>
          </motion.div>
        )}

        {user && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-12"
          >
            <GlassCard className="p-6">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Trophy className="w-5 h-5 text-amber-400" />
                Your Rewards Status
              </h2>
              <div className="grid md:grid-cols-3 gap-4">
                <div className={`p-4 rounded-xl ${isEarlyAdopter ? 'bg-gradient-to-br from-emerald-500/20 to-emerald-600/20 border border-emerald-500/30' : 'bg-white/5 border border-white/10'}`}>
                  <div className="flex items-center gap-2 mb-2">
                    <Users className="w-4 h-4" />
                    <span className="font-medium">Sign-up Position</span>
                  </div>
                  {signupPosition ? (
                    <>
                      <p className="text-2xl font-bold" data-testid="text-signup-position">#{signupPosition}</p>
                      {isEarlyAdopter && (
                        <p className="text-sm text-emerald-400 flex items-center gap-1 mt-1">
                          <Check className="w-3 h-3" /> Eligible for 2,000 DWC airdrop
                        </p>
                      )}
                    </>
                  ) : (
                    <p className="text-white/50">Not signed up yet</p>
                  )}
                </div>

                <div className={`p-4 rounded-xl ${isEarlyBuyer ? 'bg-gradient-to-br from-cyan-500/20 to-cyan-600/20 border border-cyan-500/30' : 'bg-white/5 border border-white/10'}`}>
                  <div className="flex items-center gap-2 mb-2">
                    <Coins className="w-4 h-4" />
                    <span className="font-medium">Token Purchase</span>
                  </div>
                  {tokenPurchasePosition ? (
                    <>
                      <p className="text-2xl font-bold" data-testid="text-purchase-position">#{tokenPurchasePosition}</p>
                      {isEarlyBuyer && (
                        <p className="text-sm text-cyan-400 flex items-center gap-1 mt-1">
                          <Check className="w-3 h-3" /> Eligible for 50% bonus
                        </p>
                      )}
                    </>
                  ) : (
                    <p className="text-white/50">No purchases yet</p>
                  )}
                </div>

                <div className={`p-4 rounded-xl ${crowdfundTier ? 'bg-gradient-to-br from-purple-500/20 to-purple-600/20 border border-purple-500/30' : 'bg-white/5 border border-white/10'}`}>
                  <div className="flex items-center gap-2 mb-2">
                    <Heart className="w-4 h-4" />
                    <span className="font-medium">Crowdfund Total</span>
                  </div>
                  <p className="text-2xl font-bold" data-testid="text-crowdfund-total">${(crowdfundTotal / 100).toFixed(2)}</p>
                  {crowdfundTier && (
                    <p className="text-sm text-purple-400 flex items-center gap-1 mt-1">
                      <Check className="w-3 h-3" /> {crowdfundTier.name} Tier ({crowdfundTier.bonus}% bonus)
                    </p>
                  )}
                </div>
              </div>
            </GlassCard>
          </motion.div>
        )}

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <GlassCard className="p-6 h-full">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2">First 500 Sign-ups</h3>
              <p className="text-3xl font-bold text-emerald-400 mb-2">2,000 DWC</p>
              <p className="text-white/60 text-sm mb-4">
                The first 500 people to create an account receive a bonus airdrop of 2,000 DWC tokens at launch.
              </p>
              <div className="flex items-center gap-2 text-sm text-white/50">
                <Info className="w-4 h-4" />
                <span>~$200 value at launch price</span>
              </div>
            </GlassCard>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <GlassCard className="p-6 h-full">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center mb-4">
                <Coins className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2">First 200 Token Buyers</h3>
              <p className="text-3xl font-bold text-cyan-400 mb-2">50% Bonus</p>
              <p className="text-white/60 text-sm mb-4">
                The first 200 people to purchase tokens during presale receive a 50% bonus on their entire purchase.
              </p>
              <div className="flex items-center gap-2 text-sm text-white/50">
                <Info className="w-4 h-4" />
                <span>Buy $100, get $150 worth</span>
              </div>
            </GlassCard>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <GlassCard className="p-6 h-full">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center mb-4">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2">Crowdfund Donors</h3>
              <p className="text-3xl font-bold text-purple-400 mb-2">Up to 60%</p>
              <p className="text-white/60 text-sm mb-4">
                Donate to support development and receive tiered bonuses based on your cumulative total.
              </p>
              <div className="flex items-center gap-2 text-sm text-white/50">
                <Info className="w-4 h-4" />
                <span>Contributions stack across donations</span>
              </div>
            </GlassCard>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mb-12"
        >
          <GlassCard className="p-6">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Gift className="w-5 h-5 text-purple-400" />
              Crowdfund Tier Structure
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full" data-testid="table-crowdfund-tiers">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left py-3 px-4 text-white/60">Tier</th>
                    <th className="text-left py-3 px-4 text-white/60">Donation Amount</th>
                    <th className="text-left py-3 px-4 text-white/60">DWC Bonus</th>
                    <th className="text-left py-3 px-4 text-white/60">Example</th>
                  </tr>
                </thead>
                <tbody>
                  {CROWDFUND_TIERS.map((tier) => (
                    <tr key={tier.name} className="border-b border-white/5 hover:bg-white/5">
                      <td className="py-4 px-4">
                        <Badge className={`bg-gradient-to-r ${tier.color} text-white border-0`}>
                          {tier.name}
                        </Badge>
                      </td>
                      <td className="py-4 px-4">
                        ${tier.min}{tier.max ? ` - $${tier.max}` : '+'}
                      </td>
                      <td className="py-4 px-4 font-bold text-cyan-400">
                        {tier.bonus}%
                      </td>
                      <td className="py-4 px-4 text-white/60">
                        Donate ${tier.min} → Get ${Math.floor(tier.min * tier.bonus / 100)} bonus
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-sm text-white/50 mt-4 flex items-center gap-2">
              <Info className="w-4 h-4" />
              Your tier is based on your cumulative total. Multiple donations add up!
            </p>
          </GlassCard>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="text-center"
        >
          <GlassCard className="p-8 max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold mb-4">Ready to Claim Your Rewards?</h2>
            <p className="text-white/60 mb-6">
              All bonuses will be distributed as DWC tokens at the Token Generation Event (February 14, 2026).
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {!user && (
                <Link href="/">
                  <Button className="bg-gradient-to-r from-cyan-500 to-purple-500 text-black font-bold px-8" data-testid="button-signup-now">
                    Sign Up Now
                  </Button>
                </Link>
              )}
              <Link href="/presale">
                <Button variant="outline" className="border-white/20 hover:bg-white/10" data-testid="button-buy-tokens">
                  Buy Tokens
                </Button>
              </Link>
              <Link href="/crowdfund">
                <Button variant="outline" className="border-white/20 hover:bg-white/10" data-testid="button-donate">
                  Support Development
                </Button>
              </Link>
            </div>
          </GlassCard>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}
