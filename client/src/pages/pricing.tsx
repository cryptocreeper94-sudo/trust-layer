import { useState } from "react";
import { motion } from "framer-motion";
import { Check, Zap, Shield, Crown, Sparkles, ArrowRight, Star } from "lucide-react";
import { Link } from "wouter";
import { BackButton } from "@/components/page-nav";
import { GlassCard } from "@/components/glass-card";
import { Button } from "@/components/ui/button";
import { Footer } from "@/components/footer";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";

interface PlanFeature {
  text: string;
  included: boolean;
}

interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  monthlyPrice: number;
  annualPrice: number;
  icon: React.ReactNode;
  gradient: string;
  glowColor: string;
  features: PlanFeature[];
  popular?: boolean;
  checkoutEndpoint: string;
}

// Core Trust Layer benefits included with ALL subscriptions
const CORE_TRUST_LAYER_BENEFITS = [
  { text: "Unique Trust Layer Hash (on-chain identity)", included: true },
  { text: "Digital Membership Card", included: true },
  { text: "Trust Layer Dashboard access", included: true },
];

const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    id: "pulse_pro",
    name: "Pulse Pro",
    description: "AI-powered market intelligence and predictions",
    monthlyPrice: 14.99,
    annualPrice: 149.99,
    icon: <Zap className="w-8 h-8" />,
    gradient: "from-cyan-500 to-blue-600",
    glowColor: "cyan",
    checkoutEndpoint: "/api/payments/stripe/create-pulse-monthly",
    features: [
      ...CORE_TRUST_LAYER_BENEFITS,
      { text: "Unlimited AI market searches", included: true },
      { text: "Advanced AI price predictions", included: true },
      { text: "Full technical analysis suite", included: true },
      { text: "Real-time price alerts", included: true },
      { text: "Fear & Greed analytics", included: true },
      { text: "Knowledge Base access", included: true },
      { text: "AI sniper bot", included: false },
      { text: "Multi-chain trading", included: false },
    ],
  },
  {
    id: "strike_agent",
    name: "StrikeAgent Elite",
    description: "Professional-grade token sniper with MEV protection",
    monthlyPrice: 30.00,
    annualPrice: 300.00,
    icon: <Shield className="w-8 h-8" />,
    gradient: "from-purple-500 to-pink-600",
    glowColor: "purple",
    checkoutEndpoint: "/api/payments/stripe/create-strike-monthly",
    features: [
      ...CORE_TRUST_LAYER_BENEFITS,
      { text: "AI-powered sniper bot", included: true },
      { text: "Honeypot detection", included: true },
      { text: "Anti-MEV protection", included: true },
      { text: "Multi-chain support (23 chains)", included: true },
      { text: "Built-in secure wallet", included: true },
      { text: "Trade history & analytics", included: true },
      { text: "AI market predictions", included: false },
      { text: "Technical analysis suite", included: false },
    ],
  },
  {
    id: "complete_bundle",
    name: "Trust Layer Complete",
    description: "Everything included - the ultimate trading arsenal",
    monthlyPrice: 39.99,
    annualPrice: 399.99,
    icon: <Crown className="w-8 h-8" />,
    gradient: "from-amber-400 to-orange-600",
    glowColor: "amber",
    popular: true,
    checkoutEndpoint: "/api/payments/stripe/create-bundle-monthly",
    features: [
      ...CORE_TRUST_LAYER_BENEFITS,
      { text: "Everything in Pulse Pro", included: true },
      { text: "Everything in StrikeAgent Elite", included: true },
      { text: "Priority support", included: true },
      { text: "Early feature access", included: true },
      { text: "Guardian Bot access", included: true },
      { text: "Exclusive Discord channels", included: true },
      { text: "Custom alerts & notifications", included: true },
      { text: "API access for automation", included: true },
    ],
  },
];

function PricingCard({ plan, billingCycle }: { plan: SubscriptionPlan; billingCycle: "monthly" | "annual" }) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const price = billingCycle === "monthly" ? plan.monthlyPrice : plan.annualPrice;
  const monthlyEquivalent = billingCycle === "annual" ? (plan.annualPrice / 12).toFixed(2) : null;
  const savings = billingCycle === "annual" ? Math.round((1 - (plan.annualPrice / (plan.monthlyPrice * 12))) * 100) : 0;

  const handleSubscribe = async () => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to subscribe",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const endpoint = billingCycle === "annual" 
        ? plan.checkoutEndpoint.replace("-monthly", "-annual")
        : plan.checkoutEndpoint;
      
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });
      
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error(data.error || "Failed to create checkout");
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to start checkout",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative h-full"
    >
      {plan.popular && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
          <div className="bg-gradient-to-r from-amber-400 to-orange-500 text-black text-xs font-bold px-4 py-1.5 rounded-full flex items-center gap-1.5 shadow-lg">
            <Star className="w-3.5 h-3.5 fill-current" />
            MOST POPULAR
          </div>
        </div>
      )}
      
      <GlassCard 
        className={`h-full p-8 ${plan.popular ? 'border-amber-500/50 ring-2 ring-amber-500/20' : ''}`}
        glow={plan.glowColor as any}
      >
        <div className="flex flex-col h-full">
          <div className="mb-6">
            <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${plan.gradient} flex items-center justify-center mb-4 shadow-lg`}>
              <div className="text-white">{plan.icon}</div>
            </div>
            
            <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
            <p className="text-gray-400 text-sm leading-relaxed">{plan.description}</p>
          </div>

          <div className="mb-6">
            <div className="flex items-baseline gap-1">
              <span className="text-4xl font-bold text-white">${price.toFixed(2)}</span>
              <span className="text-gray-500">/{billingCycle === "monthly" ? "mo" : "yr"}</span>
            </div>
            {monthlyEquivalent && (
              <p className="text-sm text-emerald-400 mt-1">
                ${monthlyEquivalent}/mo · Save {savings}%
              </p>
            )}
          </div>

          <div className="flex-1 mb-6">
            <ul className="space-y-3">
              {plan.features.map((feature, index) => (
                <li key={index} className="flex items-start gap-3">
                  {feature.included ? (
                    <div className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="w-3 h-3 text-emerald-400" />
                    </div>
                  ) : (
                    <div className="w-5 h-5 rounded-full bg-gray-700/50 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="w-2 h-0.5 bg-gray-600 rounded" />
                    </div>
                  )}
                  <span className={feature.included ? "text-gray-300" : "text-gray-600"}>
                    {feature.text}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <Button
            onClick={handleSubscribe}
            disabled={loading}
            className={`w-full py-6 text-lg font-semibold bg-gradient-to-r ${plan.gradient} hover:opacity-90 transition-opacity`}
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                Get Started
                <ArrowRight className="w-5 h-5 ml-2" />
              </>
            )}
          </Button>
          
          <p className="text-center text-gray-500 text-xs mt-3">
            2-day free trial · Cancel anytime
          </p>
        </div>
      </GlassCard>
    </motion.div>
  );
}

export default function Pricing() {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">("monthly");

  return (
    <div className="min-h-screen bg-slate-950 relative overflow-hidden">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-amber-500/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10">
        <div className="container mx-auto px-4 py-8">
          <BackButton />
        </div>

        <div className="container mx-auto px-4 pb-20">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border border-cyan-500/30 mb-6">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span className="text-sm text-cyan-300 font-medium">Premium Features</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
              <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Choose Your Plan
              </span>
            </h1>
            
            <p className="text-gray-400 text-lg max-w-2xl mx-auto mb-8">
              Unlock the full power of Trust Layer with our premium subscriptions. 
              Get AI-powered predictions, professional trading tools, and exclusive features.
            </p>

            <div className="inline-flex items-center p-1.5 rounded-full bg-slate-800/50 border border-slate-700">
              <button
                onClick={() => setBillingCycle("monthly")}
                className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all ${
                  billingCycle === "monthly"
                    ? "bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setBillingCycle("annual")}
                className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${
                  billingCycle === "annual"
                    ? "bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                Annual
                <span className="text-xs bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full">
                  Save 17%
                </span>
              </button>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {SUBSCRIPTION_PLANS.map((plan, index) => (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <PricingCard plan={plan} billingCycle={billingCycle} />
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-16 text-center"
          >
            <GlassCard className="max-w-3xl mx-auto p-8">
              <h3 className="text-xl font-bold text-white mb-4">
                Not sure which plan is right for you?
              </h3>
              <p className="text-gray-400 mb-6">
                Try any plan free for 2 days. No credit card required for trial. 
                Cancel anytime with no questions asked.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link href="/pulse">
                  <Button variant="outline" className="border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/10">
                    Explore Pulse Features
                  </Button>
                </Link>
                <Link href="/strike-agent">
                  <Button variant="outline" className="border-purple-500/50 text-purple-400 hover:bg-purple-500/10">
                    Explore StrikeAgent Features
                  </Button>
                </Link>
              </div>
            </GlassCard>
          </motion.div>

          {/* Referral Program Callout */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mt-8"
          >
            <GlassCard className="max-w-3xl mx-auto p-6 border-emerald-500/30 bg-gradient-to-r from-emerald-900/20 to-cyan-900/20">
              <div className="flex flex-col md:flex-row items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center flex-shrink-0">
                  <Star className="w-6 h-6 text-white" />
                </div>
                <div className="text-center md:text-left flex-1">
                  <h4 className="text-lg font-bold text-white mb-1">
                    Earn Rewards with Our Referral Program!
                  </h4>
                  <p className="text-gray-400 text-sm">
                    Get <span className="text-emerald-400 font-semibold">1,000 Shells</span> for every friend who signs up, 
                    plus up to <span className="text-emerald-400 font-semibold">50,000 bonus Shells</span> when they make a purchase. 
                    No limits on earnings!
                  </p>
                </div>
                <Link href="/referral-program">
                  <Button className="bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 whitespace-nowrap">
                    View Referral Program
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </GlassCard>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="mt-12 text-center text-gray-500 text-sm"
          >
            <p>
              All prices in USD. Subscriptions auto-renew unless cancelled. 
              <Link href="/terms" className="text-cyan-400 hover:underline ml-1">Terms apply</Link>.
            </p>
          </motion.div>
        </div>

        <Footer />
      </div>
    </div>
  );
}
