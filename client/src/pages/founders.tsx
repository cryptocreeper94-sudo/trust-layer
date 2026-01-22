import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Crown, Zap, Shield, Gift, Users, Clock, ArrowRight, Star, CheckCircle, Sparkles, Copy, Check, Send } from "lucide-react";
import { Link } from "wouter";
import { GlassCard } from "@/components/glass-card";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";

const TELEGRAM_MESSAGE = `🏆 FOUNDERS CIRCLE ANNOUNCEMENT 🏆

The first 100 buyers get BONUS Signal based on their tier!

💰 Tiered Bonus Structure:
• Spend $25 → Get 25% bonus
• Spend $50 → Get 50% bonus
• Spend $75 → Get 75% bonus
• Spend $100 → Get 100% bonus (DOUBLE your Signal!)

This keeps it fair for everyone - no whales, just believers.

✅ Exclusive Founders Badge
✅ Priority access to new features
✅ Permanent community recognition

👉 Claim your spot: https://dwsc.io/founders

Only 100 spots. First come, first served.`;

export default function FoundersPage() {
  const [spotsRemaining, setSpotsRemaining] = useState(100);
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(TELEGRAM_MESSAGE);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const { data: foundersData } = useQuery({
    queryKey: ["/api/founders/stats"],
    queryFn: async () => {
      try {
        const res = await fetch("/api/founders/stats");
        if (res.ok) return res.json();
        return { spotsTaken: 0, totalSpots: 100 };
      } catch {
        return { spotsTaken: 0, totalSpots: 100 };
      }
    },
    refetchInterval: 30000,
  });

  useEffect(() => {
    if (foundersData) {
      setSpotsRemaining(foundersData.totalSpots - foundersData.spotsTaken);
    }
  }, [foundersData]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 relative overflow-hidden">
      <div className="absolute top-20 left-10 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-40 right-10 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-500/5 rounded-full blur-3xl" />

      <div className="relative z-10 container mx-auto px-4 py-12 md:py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto"
        >
          <div className="text-center mb-12">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/30 mb-6"
            >
              <Crown className="w-5 h-5 text-amber-400" />
              <span className="text-amber-300 font-medium">Exclusive Telegram Offer</span>
            </motion.div>

            <h1 className="text-4xl md:text-6xl font-display font-bold mb-6">
              <span className="bg-gradient-to-r from-amber-400 via-orange-400 to-red-400 bg-clip-text text-transparent">
                Founders Circle
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-white/80 mb-4 max-w-2xl mx-auto">
              The first <span className="text-amber-400 font-bold">100 buyers</span> get up to{" "}
              <span className="text-green-400 font-bold">100% bonus Signal</span> based on their tier
            </p>

            <div className="flex items-center justify-center gap-4 mb-8">
              <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500/20 border border-red-500/30">
                <Clock className="w-5 h-5 text-red-400 animate-pulse" />
                <span className="text-red-300 font-bold">{spotsRemaining} spots remaining</span>
              </div>
            </div>
          </div>

          <div className="bg-slate-900/60 backdrop-blur-xl rounded-2xl border border-white/10 p-6 sm:p-8 md:p-12 shadow-2xl mb-8">
            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-2xl p-6 md:p-8 border border-white/10">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                  <Gift className="w-6 h-6 text-amber-400" />
                  The Founders Deal
                </h2>
                <div className="space-y-5">
                  <div className="flex items-start gap-4">
                    <CheckCircle className="w-5 h-5 text-green-400 mt-1 flex-shrink-0" />
                    <div>
                      <p className="text-white font-medium">Tiered Bonus System</p>
                      <p className="text-white/60 text-sm leading-relaxed">The more you commit, the bigger your bonus</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <CheckCircle className="w-5 h-5 text-green-400 mt-1 flex-shrink-0" />
                    <div>
                      <p className="text-white font-medium">Capped at $100</p>
                      <p className="text-white/60 text-sm leading-relaxed">Fair for everyone — no whale advantages</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <CheckCircle className="w-5 h-5 text-green-400 mt-1 flex-shrink-0" />
                    <div>
                      <p className="text-white font-medium">Exclusive Founders Badge</p>
                      <p className="text-white/60 text-sm leading-relaxed">Permanent recognition in the community</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <CheckCircle className="w-5 h-5 text-green-400 mt-1 flex-shrink-0" />
                    <div>
                      <p className="text-white font-medium">Priority Access</p>
                      <p className="text-white/60 text-sm leading-relaxed">First access to new features & products</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-amber-500/10 to-orange-500/10 rounded-2xl p-6 md:p-8 border border-amber-500/20">
                <h3 className="text-lg font-semibold text-amber-400 mb-4 flex items-center gap-2">
                  <Sparkles className="w-5 h-5" />
                  Bonus Tiers
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2 border-b border-white/10">
                    <span className="text-white/70">Spend $25</span>
                    <span className="text-green-400 font-bold">+25% bonus → $31.25 value</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-white/10">
                    <span className="text-white/70">Spend $50</span>
                    <span className="text-green-400 font-bold">+50% bonus → $75 value</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-white/10">
                    <span className="text-white/70">Spend $75</span>
                    <span className="text-green-400 font-bold">+75% bonus → $131.25 value</span>
                  </div>
                  <div className="flex justify-between items-center py-2 bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-lg px-2 -mx-2">
                    <span className="text-white font-medium">Spend $100</span>
                    <span className="text-green-400 font-bold">+100% bonus → $200 value</span>
                  </div>
                </div>
                <p className="text-white/50 text-xs mt-4">*Bonus distributed at Token Generation Event. Max tier: $100.</p>
              </div>
            </div>

            <div className="text-center">
              <Link href="/presale?ref=founders">
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold text-lg px-12 py-6 h-auto"
                  data-testid="button-claim-founders-spot"
                >
                  <Crown className="w-5 h-5 mr-2" />
                  Claim Your Founders Spot
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <p className="text-white/50 text-sm mt-4">Only 4 tiers: $25, $50, $75, or $100</p>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <GlassCard className="p-8 text-center">
              <Shield className="w-10 h-10 text-cyan-400 mx-auto mb-4" />
              <h3 className="font-semibold text-white mb-3">Secure & Verified</h3>
              <p className="text-white/60 text-sm leading-relaxed">All purchases tracked on-chain with full transparency</p>
            </GlassCard>
            <GlassCard className="p-8 text-center">
              <Users className="w-10 h-10 text-purple-400 mx-auto mb-4" />
              <h3 className="font-semibold text-white mb-3">Limited to 100</h3>
              <p className="text-white/60 text-sm leading-relaxed">Once spots are filled, this offer closes permanently</p>
            </GlassCard>
            <GlassCard className="p-8 text-center">
              <Zap className="w-10 h-10 text-amber-400 mx-auto mb-4" />
              <h3 className="font-semibold text-white mb-3">Instant Confirmation</h3>
              <p className="text-white/60 text-sm leading-relaxed">Your Founders status is confirmed immediately</p>
            </GlassCard>
          </div>

          <GlassCard className="p-8 md:p-10 mb-8">
            <h3 className="text-lg font-semibold text-white mb-5 flex items-center gap-2">
              <Star className="w-5 h-5 text-amber-400" />
              Why Signal? Why Now?
            </h3>
            <div className="prose prose-invert max-w-none text-white/70">
              <p className="mb-5 leading-relaxed">
                Signal isn't just another token — it's your access key to the DarkWave Trust Network. 
                While others chase hype, we're building real infrastructure that businesses actually use.
              </p>
              <p className="mb-5 leading-relaxed">
                The Founders Circle is for those who see the vision early. You're not just buying Signal — 
                you're becoming a founding member of something we're building together. Your 100% bonus 
                is our way of saying thank you for believing in what we're creating.
              </p>
              <p className="mb-0">
                <Link href="/note" className="text-cyan-400 hover:underline">Read our story →</Link>
              </p>
            </div>
          </GlassCard>

          <GlassCard className="p-8 md:p-10 mb-8">
            <h3 className="text-lg font-semibold text-white mb-5 flex items-center gap-2">
              <Send className="w-5 h-5 text-cyan-400" />
              Share on Telegram
            </h3>
            <p className="text-white/60 text-sm mb-5 leading-relaxed">
              Click the box below to copy the announcement, then paste it in your Telegram group:
            </p>
            <div
              onClick={handleCopy}
              className="relative cursor-pointer group"
              data-testid="button-copy-telegram"
            >
              <pre className="bg-slate-800/80 border border-slate-700 rounded-xl p-6 text-sm text-white/80 whitespace-pre-wrap overflow-x-auto hover:border-cyan-500/50 transition-colors">
                {TELEGRAM_MESSAGE}
              </pre>
              <div className="absolute top-3 right-3 flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-700/80 text-xs text-white/70 group-hover:bg-cyan-500/20 group-hover:text-cyan-400 transition-colors">
                {copied ? (
                  <>
                    <Check className="w-4 h-4" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    Click to copy
                  </>
                )}
              </div>
            </div>
          </GlassCard>

          <div className="text-center">
            <p className="text-white/50 text-sm">
              Questions? Join our{" "}
              <a href="https://t.me/darkwavestudios" target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:underline">
                Telegram community
              </a>{" "}
              or read the{" "}
              <Link href="/note" className="text-cyan-400 hover:underline">Developer's Note</Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
