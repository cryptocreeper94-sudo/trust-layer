import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { 
  ArrowLeft, Crown, Sparkles, Check, Wallet, CreditCard, 
  Clock, Users, Gift, Shield, Zap, Star, Bitcoin
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { GlassCard } from "@/components/glass-card";
import { Footer } from "@/components/footer";
import { useToast } from "@/hooks/use-toast";
import { useWallet } from "@/hooks/use-wallet";
import { WalletButton } from "@/components/wallet-button";
import { LEGACY_FOUNDER_CONFIG } from "@shared/schema";
import orbitLogo from "@assets/generated_images/futuristic_abstract_geometric_logo_symbol_for_orbit.png";

export default function FounderProgram() {
  const { toast } = useToast();
  const wallet = useWallet();
  const isConnected = wallet?.isConnected ?? false;
  const address = wallet?.evmAddress || wallet?.solanaAddress || null;
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [spotsRemaining, setSpotsRemaining] = useState(10000);
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const target = new Date("2026-02-14T00:00:00Z").getTime();
    const interval = setInterval(() => {
      const now = Date.now();
      const diff = target - now;
      if (diff <= 0) {
        clearInterval(interval);
        setCountdown({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }
      setCountdown({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((diff % (1000 * 60)) / 1000),
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    fetch("/api/founder/stats")
      .then(res => res.json())
      .then(data => {
        if (data.spotsRemaining !== undefined) {
          setSpotsRemaining(data.spotsRemaining);
        }
      })
      .catch(() => {});
  }, []);

  const handleStripeCheckout = async () => {
    if (!email) {
      toast({ title: "Email required", description: "Please enter your email address", variant: "destructive" });
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/founder/checkout/stripe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, walletAddress: address }),
      });
      const data = await res.json();
      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      } else {
        throw new Error(data.error || "Failed to create checkout");
      }
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleCryptoCheckout = async () => {
    if (!email) {
      toast({ title: "Email required", description: "Please enter your email address", variant: "destructive" });
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/founder/checkout/crypto", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, walletAddress: address }),
      });
      const data = await res.json();
      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      } else {
        throw new Error(data.error || "Failed to create checkout");
      }
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-background/90 backdrop-blur-xl">
        <div className="container mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <img src={orbitLogo} alt="DarkWave" className="w-7 h-7" />
            <span className="font-display font-bold text-lg tracking-tight hidden sm:inline">DarkWave</span>
          </Link>
          <WalletButton />
        </div>
      </nav>

      <main className="container mx-auto px-4 pt-24 pb-12">
        <Link href="/">
          <Button variant="ghost" size="sm" className="mb-6 gap-2" data-testid="button-back">
            <ArrowLeft className="w-4 h-4" /> Back
          </Button>
        </Link>

        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-amber-500/20 to-yellow-500/20 border border-amber-500/30 mb-6"
          >
            <Crown className="w-5 h-5 text-amber-400" />
            <span className="text-amber-400 font-semibold">Limited Time Offer</span>
            <Sparkles className="w-4 h-4 text-yellow-400" />
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-display font-bold mb-4"
          >
            <span className="bg-gradient-to-r from-amber-400 via-yellow-400 to-orange-400 bg-clip-text text-transparent">
              Legacy Founder
            </span>
            <br />
            <span className="text-white">Program</span>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-muted-foreground text-lg max-w-2xl mx-auto"
          >
            Pay once. Get lifetime access. Receive 35,000 DWT tokens on launch day.
          </motion.p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {[
            { label: "Days", value: countdown.days },
            { label: "Hours", value: countdown.hours },
            { label: "Minutes", value: countdown.minutes },
            { label: "Seconds", value: countdown.seconds },
          ].map((item, i) => (
            <GlassCard key={i} className="text-center py-4">
              <div className="text-3xl md:text-4xl font-bold text-primary">{String(item.value).padStart(2, "0")}</div>
              <div className="text-xs text-muted-foreground uppercase tracking-wider">{item.label}</div>
            </GlassCard>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          <GlassCard className="p-6 md:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 rounded-xl bg-gradient-to-br from-amber-500/20 to-yellow-500/20">
                <Crown className="w-8 h-8 text-amber-400" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">Legacy Founder</h2>
                <p className="text-muted-foreground">First 10,000 members only</p>
              </div>
            </div>

            <div className="flex items-baseline gap-2 mb-6">
              <span className="text-5xl font-bold text-white">$24</span>
              <span className="text-muted-foreground line-through">$120/6mo</span>
              <Badge className="bg-green-500/20 text-green-400 ml-2">80% OFF</Badge>
            </div>

            <div className="space-y-3 mb-8">
              {LEGACY_FOUNDER_CONFIG.perks.map((perk, i) => (
                <div key={i} className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-400 shrink-0 mt-0.5" />
                  <span className="text-sm text-white/90">{perk}</span>
                </div>
              ))}
            </div>

            <div className="p-4 rounded-xl bg-gradient-to-r from-primary/10 to-purple-500/10 border border-primary/20 mb-6">
              <div className="flex items-center gap-3">
                <Gift className="w-6 h-6 text-primary" />
                <div>
                  <div className="font-semibold text-white">35,000 DWT Airdrop</div>
                  <div className="text-xs text-muted-foreground">Delivered to your wallet on Feb 14, 2026</div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Users className="w-4 h-4" />
              <span><strong className="text-white">{spotsRemaining.toLocaleString()}</strong> spots remaining</span>
            </div>
          </GlassCard>

          <div className="space-y-6">
            <GlassCard className="p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Wallet className="w-5 h-5 text-primary" />
                Connect Your Wallet
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                Connect your wallet to receive your 35,000 DWT airdrop on launch day.
              </p>
              <WalletButton />
              {isConnected && address && (
                <div className="mt-3 p-3 rounded-lg bg-green-500/10 border border-green-500/20">
                  <div className="text-xs text-green-400 flex items-center gap-2">
                    <Check className="w-4 h-4" />
                    Wallet connected: {address.slice(0, 6)}...{address.slice(-4)}
                  </div>
                </div>
              )}
            </GlassCard>

            <GlassCard className="p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Your Email</h3>
              <Input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mb-4 bg-white/5 border-white/10"
                data-testid="input-email"
              />

              <div className="space-y-3">
                <Button
                  onClick={handleStripeCheckout}
                  disabled={loading || !email}
                  className="w-full h-12 bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90"
                  data-testid="button-stripe-checkout"
                >
                  <CreditCard className="w-5 h-5 mr-2" />
                  {loading ? "Processing..." : "Pay $24 with Card"}
                </Button>

                <Button
                  onClick={handleCryptoCheckout}
                  disabled={loading || !email}
                  variant="outline"
                  className="w-full h-12 border-amber-500/30 hover:bg-amber-500/10 text-amber-400"
                  data-testid="button-crypto-checkout"
                >
                  <Bitcoin className="w-5 h-5 mr-2" />
                  {loading ? "Processing..." : "Pay with Crypto"}
                </Button>
              </div>

              <p className="text-xs text-muted-foreground mt-4 text-center">
                Secure payment powered by Stripe &amp; Coinbase Commerce
              </p>
            </GlassCard>

            <GlassCard className="p-4">
              <div className="flex items-center gap-3 text-sm">
                <Shield className="w-5 h-5 text-green-400" />
                <span className="text-muted-foreground">256-bit SSL encryption. No recurring charges.</span>
              </div>
            </GlassCard>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {[
            { icon: Zap, title: "Instant Access", desc: "Get immediate access to all premium features after payment" },
            { icon: Star, title: "Lifetime Value", desc: "Pay $24 once, never pay again. Regular price is $20/month" },
            { icon: Clock, title: "6 Months = Forever", desc: "After 6 months of access, you're grandfathered in for life" },
          ].map((item, i) => (
            <GlassCard key={i} className="p-6 text-center">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-purple-500/20 flex items-center justify-center mx-auto mb-4">
                <item.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold text-white mb-2">{item.title}</h3>
              <p className="text-sm text-muted-foreground">{item.desc}</p>
            </GlassCard>
          ))}
        </div>

        <GlassCard className="p-6 text-center max-w-2xl mx-auto">
          <h3 className="text-xl font-semibold text-white mb-2">Program Closes February 14, 2026</h3>
          <p className="text-muted-foreground">
            After this date, the Legacy Founder program ends. Regular pricing of $20/month begins.
            Don't miss your chance to lock in lifetime access and receive 35,000 DWT tokens.
          </p>
        </GlassCard>
      </main>

      <Footer />
    </div>
  );
}
