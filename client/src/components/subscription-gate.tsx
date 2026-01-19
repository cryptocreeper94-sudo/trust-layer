import { Link } from "wouter";
import { motion } from "framer-motion";
import { Lock, Zap, Target, Sparkles, CreditCard, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/glass-card";
import { useSubscription, hasPlanAccess } from "@/hooks/use-subscription";
import { useAuth } from "@/hooks/use-auth";

interface SubscriptionGateProps {
  requiredPlans: string[];
  productName: string;
  productDescription: string;
  price: string;
  checkoutPath: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}

export function SubscriptionGate({
  requiredPlans,
  productName,
  productDescription,
  price,
  checkoutPath,
  icon,
  children,
}: SubscriptionGateProps) {
  const { user } = useAuth();
  const { plan, isActive, isPremium, isWhitelisted, isLoading } = useSubscription();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-white/50">Loading subscription status...</div>
      </div>
    );
  }

  const hasAccess = !user ? false : (isWhitelisted || isPremium || hasPlanAccess(plan, requiredPlans));

  if (hasAccess) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white">
      <div className="container mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl mx-auto text-center"
        >
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 border border-amber-500/30 flex items-center justify-center mx-auto mb-6">
            {icon || <Lock className="w-10 h-10 text-amber-400" />}
          </div>

          <h1 className="text-3xl md:text-4xl font-display font-bold mb-4">
            <span className="bg-gradient-to-r from-amber-400 via-orange-400 to-red-400 bg-clip-text text-transparent">
              {productName}
            </span>
          </h1>

          <p className="text-lg text-white/70 mb-8 max-w-lg mx-auto">
            {productDescription}
          </p>

          <GlassCard className="p-8 mb-8" glow>
            <div className="flex flex-col items-center">
              <div className="text-4xl font-bold text-white mb-2">{price}</div>
              <p className="text-white/50 text-sm mb-6">per month, cancel anytime</p>

              <div className="grid grid-cols-2 gap-3 text-left text-sm mb-8 w-full max-w-md">
                <div className="flex items-center gap-2 text-white/70">
                  <Sparkles className="w-4 h-4 text-cyan-400" />
                  <span>2-day free trial</span>
                </div>
                <div className="flex items-center gap-2 text-white/70">
                  <CreditCard className="w-4 h-4 text-purple-400" />
                  <span>Secure payment</span>
                </div>
                <div className="flex items-center gap-2 text-white/70">
                  <Zap className="w-4 h-4 text-amber-400" />
                  <span>Instant access</span>
                </div>
                <div className="flex items-center gap-2 text-white/70">
                  <Target className="w-4 h-4 text-green-400" />
                  <span>Cancel anytime</span>
                </div>
              </div>

              {user ? (
                <Link href={checkoutPath}>
                  <Button size="lg" className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold px-8">
                    Subscribe Now
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              ) : (
                <div className="space-y-4">
                  <p className="text-white/50 text-sm">Sign in to subscribe</p>
                  <Link href="/login">
                    <Button size="lg" variant="outline" className="border-amber-500/50 text-amber-400 hover:bg-amber-500/10">
                      Sign In
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </GlassCard>

          <p className="text-white/40 text-sm">
            Or get everything with{" "}
            <Link href="/billing" className="text-cyan-400 hover:underline">
              DarkWave Complete ($39.99/mo)
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
