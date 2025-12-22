import { useState, useEffect } from "react";
import { Check, X } from "lucide-react";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, CreditCard, Activity, DollarSign, Clock, ExternalLink, AlertCircle, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { GlassCard } from "@/components/glass-card";
import { Footer } from "@/components/footer";
import orbitLogo from "@assets/generated_images/futuristic_abstract_geometric_logo_symbol_for_orbit.png";

interface UsageStats {
  totalCalls: number;
  outstandingBalanceCents: number;
  outstandingBalanceUSD: string;
  costPerCallCents: number;
  recentLogs: Array<{
    endpoint: string;
    costCents: string;
    timestamp: string;
  }>;
}

export default function Billing() {
  const [apiKey, setApiKey] = useState("");
  const [stats, setStats] = useState<UsageStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [checkoutLoading, setCheckoutLoading] = useState<"stripe" | "crypto" | null>(null);
  const [paymentSuccess, setPaymentSuccess] = useState<string | null>(null);
  const [upgradeLoading, setUpgradeLoading] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [contactForm, setContactForm] = useState({ name: "", email: "", company: "", message: "" });
  const [contactSubmitted, setContactSubmitted] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const sessionId = params.get("session_id");
    if (sessionId) {
      fetch(`/api/billing/verify-payment?session_id=${sessionId}`)
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            setPaymentSuccess(`Payment of $${data.amountPaid} confirmed! Thank you.`);
            window.history.replaceState({}, "", "/billing");
          }
        })
        .catch(() => {});
    }
  }, []);

  const fetchUsage = async () => {
    if (!apiKey.trim()) {
      setError("Please enter your API key");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/billing/usage", {
        headers: { "X-API-Key": apiKey },
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to fetch usage");
      }

      const data = await response.json();
      setStats(data);
    } catch (err: any) {
      setError(err.message);
      setStats(null);
    } finally {
      setLoading(false);
    }
  };

  const handlePayWithStripe = async () => {
    if (!apiKey || !stats || stats.outstandingBalanceCents <= 0) return;

    setCheckoutLoading("stripe");
    try {
      const response = await fetch("/api/billing/checkout", {
        method: "POST",
        headers: { "X-API-Key": apiKey, "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });
      const data = await response.json();
      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      } else if (data.message) {
        setError(data.message);
      }
    } catch (err: any) {
      setError("Failed to create checkout session");
    } finally {
      setCheckoutLoading(null);
    }
  };

  const handlePayWithCrypto = async () => {
    if (!apiKey || !stats || stats.outstandingBalanceCents <= 0) return;

    setCheckoutLoading("crypto");
    try {
      const response = await fetch("/api/billing/checkout/crypto", {
        method: "POST",
        headers: { "X-API-Key": apiKey, "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });
      const data = await response.json();
      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      } else if (data.message) {
        setError(data.message);
      }
    } catch (err: any) {
      setError("Failed to create crypto checkout");
    } finally {
      setCheckoutLoading(null);
    }
  };

  const handleUpgradeToBuilder = async () => {
    setUpgradeLoading(true);
    try {
      const response = await fetch("/api/billing/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: "builder" }),
      });
      const data = await response.json();
      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      } else if (data.error) {
        setError(data.error);
      }
    } catch (err: any) {
      setError("Failed to start checkout. Please try again.");
    } finally {
      setUpgradeLoading(false);
    }
  };

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setContactSubmitted(true);
    setTimeout(() => {
      setShowContactModal(false);
      setContactSubmitted(false);
      setContactForm({ name: "", email: "", company: "", message: "" });
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-background/90 backdrop-blur-xl">
        <div className="container mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <img src={orbitLogo} alt="DarkWave" className="w-7 h-7" />
            <span className="font-display font-bold text-lg tracking-tight">DarkWave</span>
          </Link>
          <Link href="/developers">
            <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground hover:text-white">
              <ArrowLeft className="w-4 h-4" /> Developers
            </Button>
          </Link>
        </div>
      </nav>

      <main className="pt-24 pb-12 px-4">
        <div className="container max-w-4xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="text-center mb-8">
              <h1 className="text-3xl font-display font-bold mb-2">Memberships & Billing</h1>
              <p className="text-muted-foreground">Choose your plan and unlock the DarkWave ecosystem</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-10 pt-6">
              <GlassCard className="flex flex-col h-full">
                <div className="p-5 flex flex-col h-full">
                  <div className="mb-3">
                    <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center mb-3">
                      <Activity className="w-4 h-4 text-white/60" />
                    </div>
                    <h3 className="text-base font-bold text-white">Explorer</h3>
                    <p className="text-[10px] text-white/40 uppercase tracking-wider">Free forever</p>
                  </div>
                  <div className="mb-4">
                    <span className="text-2xl font-bold font-display text-white">$0</span>
                    <span className="text-white/40 text-xs">/mo</span>
                  </div>
                  <ul className="space-y-2 mb-auto text-[11px]">
                    <li className="flex items-center gap-2 text-white/60"><Check className="w-3 h-3 text-primary shrink-0" /> 1,000 API calls/month</li>
                    <li className="flex items-center gap-2 text-white/60"><Check className="w-3 h-3 text-primary shrink-0" /> Block explorer access</li>
                    <li className="flex items-center gap-2 text-white/60"><Check className="w-3 h-3 text-primary shrink-0" /> Community support</li>
                  </ul>
                  <Button variant="outline" size="sm" className="w-full mt-4 border-white/10 text-white/60 text-xs h-9" data-testid="button-plan-explorer">Current Plan</Button>
                </div>
              </GlassCard>

              <GlassCard glow className="flex flex-col h-full border-primary/40">
                <div className="p-5 flex flex-col h-full">
                  <div className="flex justify-center mb-2">
                    <span className="px-3 py-1 bg-primary text-background text-[9px] font-bold rounded-full uppercase tracking-wider">Most Popular</span>
                  </div>
                  <div className="mb-3">
                    <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center mb-3">
                      <CreditCard className="w-4 h-4 text-primary" />
                    </div>
                    <h3 className="text-base font-bold text-white">Builder</h3>
                    <p className="text-[10px] text-primary uppercase tracking-wider">For developers</p>
                  </div>
                  <div className="mb-4">
                    <span className="text-2xl font-bold font-display text-white">$29</span>
                    <span className="text-white/40 text-xs">/mo</span>
                  </div>
                  <ul className="space-y-2 mb-auto text-[11px]">
                    <li className="flex items-center gap-2 text-white/70"><Check className="w-3 h-3 text-primary shrink-0" /> 50,000 API calls/month</li>
                    <li className="flex items-center gap-2 text-white/70"><Check className="w-3 h-3 text-primary shrink-0" /> DarkWave Studio</li>
                    <li className="flex items-center gap-2 text-white/70"><Check className="w-3 h-3 text-primary shrink-0" /> Priority support</li>
                    <li className="flex items-center gap-2 text-white/70"><Check className="w-3 h-3 text-primary shrink-0" /> Early token access</li>
                  </ul>
                  <Button size="sm" className="w-full mt-4 bg-primary text-background hover:bg-primary/90 text-xs h-9 font-semibold" data-testid="button-plan-builder" onClick={handleUpgradeToBuilder} disabled={upgradeLoading}>{upgradeLoading ? "Loading..." : "Upgrade Now"}</Button>
                </div>
              </GlassCard>

              <GlassCard className="flex flex-col h-full">
                <div className="p-5 flex flex-col h-full">
                  <div className="mb-3">
                    <div className="w-8 h-8 rounded-lg bg-secondary/20 flex items-center justify-center mb-3">
                      <DollarSign className="w-4 h-4 text-secondary" />
                    </div>
                    <h3 className="text-base font-bold text-white">Enterprise</h3>
                    <p className="text-[10px] text-secondary uppercase tracking-wider">For teams</p>
                  </div>
                  <div className="mb-4">
                    <span className="text-2xl font-bold font-display text-white">$199</span>
                    <span className="text-white/40 text-xs">/mo</span>
                  </div>
                  <ul className="space-y-2 mb-auto text-[11px]">
                    <li className="flex items-center gap-2 text-white/60"><Check className="w-3 h-3 text-secondary shrink-0" /> Unlimited API calls</li>
                    <li className="flex items-center gap-2 text-white/60"><Check className="w-3 h-3 text-secondary shrink-0" /> Dedicated support</li>
                    <li className="flex items-center gap-2 text-white/60"><Check className="w-3 h-3 text-secondary shrink-0" /> Custom integrations</li>
                    <li className="flex items-center gap-2 text-white/60"><Check className="w-3 h-3 text-secondary shrink-0" /> Validator node access</li>
                  </ul>
                  <Button variant="outline" size="sm" className="w-full mt-4 border-secondary/30 text-secondary hover:bg-secondary/10 text-xs h-9" data-testid="button-plan-enterprise" onClick={() => setShowContactModal(true)}>Contact Sales</Button>
                </div>
              </GlassCard>
            </div>

            <div className="text-center mb-6">
              <h2 className="text-xl font-display font-bold mb-1">Already a Developer?</h2>
              <p className="text-sm text-muted-foreground">Check your API usage and pay outstanding balance</p>
            </div>

            {paymentSuccess && (
              <GlassCard className="mb-6 border-green-500/30">
                <div className="p-4 flex items-center gap-3">
                  <div className="p-2 rounded-full bg-green-500/20">
                    <Check className="w-5 h-5 text-green-400" />
                  </div>
                  <p className="text-green-400 font-medium" data-testid="text-payment-success">{paymentSuccess}</p>
                </div>
              </GlassCard>
            )}

            <GlassCard className="mb-6">
              <div className="p-6">
                <Label htmlFor="apiKey" className="text-sm mb-2 block">Enter Your API Key</Label>
                <div className="flex gap-3">
                  <Input
                    id="apiKey"
                    type="password"
                    placeholder="dw_xxxxxxxxxxxxxxxx"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    className="bg-black/30 border-white/10 font-mono"
                    data-testid="input-api-key"
                  />
                  <Button
                    onClick={fetchUsage}
                    disabled={loading}
                    className="bg-primary text-background hover:bg-primary/90"
                    data-testid="button-fetch-usage"
                  >
                    {loading ? "Loading..." : "Check Usage"}
                  </Button>
                </div>
                {error && (
                  <p className="text-red-400 text-sm mt-3 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" /> {error}
                  </p>
                )}
              </div>
            </GlassCard>

            {stats && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <GlassCard className="p-5">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="p-2 rounded-lg bg-primary/20">
                        <Activity className="w-5 h-5 text-primary" />
                      </div>
                      <span className="text-sm text-muted-foreground">Total API Calls</span>
                    </div>
                    <p className="text-2xl font-bold" data-testid="text-total-calls">{stats.totalCalls.toLocaleString()}</p>
                  </GlassCard>

                  <GlassCard className="p-5">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="p-2 rounded-lg bg-secondary/20">
                        <DollarSign className="w-5 h-5 text-secondary" />
                      </div>
                      <span className="text-sm text-muted-foreground">Cost Per Call</span>
                    </div>
                    <p className="text-2xl font-bold">${(stats.costPerCallCents / 100).toFixed(2)}</p>
                  </GlassCard>

                  <GlassCard className={`p-5 ${stats.outstandingBalanceCents > 0 ? 'border-amber-500/30' : 'border-green-500/30'}`}>
                    <div className="flex items-center gap-3 mb-2">
                      <div className={`p-2 rounded-lg ${stats.outstandingBalanceCents > 0 ? 'bg-amber-500/20' : 'bg-green-500/20'}`}>
                        <CreditCard className={`w-5 h-5 ${stats.outstandingBalanceCents > 0 ? 'text-amber-400' : 'text-green-400'}`} />
                      </div>
                      <span className="text-sm text-muted-foreground">Outstanding Balance</span>
                    </div>
                    <p className="text-2xl font-bold" data-testid="text-balance">${stats.outstandingBalanceUSD}</p>
                    {stats.outstandingBalanceCents > 0 && (
                      <div className="flex gap-2 mt-3">
                        <Button
                          onClick={handlePayWithStripe}
                          disabled={!!checkoutLoading}
                          className="flex-1 bg-indigo-500 hover:bg-indigo-600 text-white font-semibold text-xs"
                          data-testid="button-pay-stripe"
                        >
                          {checkoutLoading === "stripe" ? "..." : "Card"}
                          <CreditCard className="w-3 h-3 ml-1" />
                        </Button>
                        <Button
                          onClick={handlePayWithCrypto}
                          disabled={!!checkoutLoading}
                          className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-semibold text-xs"
                          data-testid="button-pay-crypto"
                        >
                          {checkoutLoading === "crypto" ? "..." : "Crypto"}
                          <ExternalLink className="w-3 h-3 ml-1" />
                        </Button>
                      </div>
                    )}
                  </GlassCard>
                </div>

                <GlassCard>
                  <div className="p-5">
                    <h3 className="font-bold mb-4 flex items-center gap-2">
                      <Clock className="w-4 h-4 text-primary" /> Recent Activity
                    </h3>
                    {stats.recentLogs.length > 0 ? (
                      <div className="space-y-2">
                        {stats.recentLogs.map((log, i) => (
                          <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-black/20 text-sm">
                            <div>
                              <span className="font-mono text-primary">{log.endpoint}</span>
                              <span className="text-muted-foreground ml-3 text-xs">
                                {new Date(log.timestamp).toLocaleString()}
                              </span>
                            </div>
                            <span className="text-amber-400">${(parseInt(log.costCents) / 100).toFixed(2)}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-muted-foreground text-sm">No recent activity</p>
                    )}
                  </div>
                </GlassCard>

                <div className="text-center text-sm text-muted-foreground">
                  <p>Pay with card (Stripe) or crypto (Coinbase Commerce - BTC, ETH, USDC)</p>
                </div>
              </motion.div>
            )}
          </motion.div>
        </div>
      </main>

      <Footer />

      <AnimatePresence>
        {showContactModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowContactModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md bg-[rgba(12,18,36,0.95)] border border-white/10 rounded-xl p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold flex items-center gap-2">
                  <Mail className="w-5 h-5 text-secondary" /> Contact Sales
                </h3>
                <button onClick={() => setShowContactModal(false)} className="p-1 hover:bg-white/10 rounded">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {contactSubmitted ? (
                <div className="text-center py-8">
                  <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-3">
                    <Check className="w-6 h-6 text-green-400" />
                  </div>
                  <p className="text-green-400 font-medium">Message sent! We'll be in touch soon.</p>
                </div>
              ) : (
                <form onSubmit={handleContactSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="contact-name" className="text-sm">Name</Label>
                    <Input
                      id="contact-name"
                      value={contactForm.name}
                      onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                      className="mt-1 bg-black/30 border-white/10"
                      required
                      data-testid="input-contact-name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="contact-email" className="text-sm">Email</Label>
                    <Input
                      id="contact-email"
                      type="email"
                      value={contactForm.email}
                      onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                      className="mt-1 bg-black/30 border-white/10"
                      required
                      data-testid="input-contact-email"
                    />
                  </div>
                  <div>
                    <Label htmlFor="contact-company" className="text-sm">Company</Label>
                    <Input
                      id="contact-company"
                      value={contactForm.company}
                      onChange={(e) => setContactForm({ ...contactForm, company: e.target.value })}
                      className="mt-1 bg-black/30 border-white/10"
                      data-testid="input-contact-company"
                    />
                  </div>
                  <div>
                    <Label htmlFor="contact-message" className="text-sm">Tell us about your needs</Label>
                    <Textarea
                      id="contact-message"
                      value={contactForm.message}
                      onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                      className="mt-1 bg-black/30 border-white/10 min-h-[100px]"
                      required
                      data-testid="input-contact-message"
                    />
                  </div>
                  <Button type="submit" className="w-full bg-secondary text-background hover:bg-secondary/90" data-testid="button-contact-submit">
                    Send Message
                  </Button>
                </form>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
