import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery, useMutation } from "@tanstack/react-query";
import { ArrowLeft, Gift, Sparkles, Check, AlertCircle, Wallet, Mail, Crown, Star, Users, ExternalLink } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { GlassCard } from "@/components/glass-card";
import { apiRequest } from "@/lib/queryClient";
import orbitLogo from "@assets/generated_images/futuristic_abstract_geometric_logo_symbol_for_orbit.png";

interface EligibilityResult {
  eligible: boolean;
  allocation?: string;
  tier?: string;
  claimableAmount?: string;
  alreadyClaimed?: boolean;
  message?: string;
}

export default function AirdropClaim() {
  const [checkMethod, setCheckMethod] = useState<"email" | "wallet">("email");
  const [identifier, setIdentifier] = useState("");
  const [eligibility, setEligibility] = useState<EligibilityResult | null>(null);

  const checkMutation = useMutation({
    mutationFn: async (data: { email?: string; wallet?: string }) => {
      const res = await apiRequest("POST", "/api/airdrop/check-eligibility", data);
      return res.json();
    },
    onSuccess: (data) => {
      setEligibility(data);
    },
  });

  const handleCheck = () => {
    if (!identifier.trim()) return;
    const data = checkMethod === "email" 
      ? { email: identifier.trim() }
      : { wallet: identifier.trim() };
    checkMutation.mutate(data);
  };

  const getTierIcon = (tier?: string) => {
    switch (tier?.toLowerCase()) {
      case "founder": return Crown;
      case "genesis": return Star;
      default: return Users;
    }
  };

  const getTierColor = (tier?: string) => {
    switch (tier?.toLowerCase()) {
      case "founder": return "from-amber-500 to-orange-600";
      case "genesis": return "from-purple-500 to-pink-600";
      default: return "from-blue-500 to-cyan-600";
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-background/90 backdrop-blur-xl">
        <div className="container mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <img src={orbitLogo} alt="DarkWave" className="w-7 h-7" />
            <span className="font-display font-bold text-lg tracking-tight hidden sm:inline">DarkWave</span>
          </Link>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="border-primary/50 text-primary bg-primary/10 text-[10px] sm:text-xs">
              <Gift className="w-3 h-3 mr-1" /> Airdrop
            </Badge>
            <Link href="/">
              <Button variant="ghost" size="sm" className="h-8 text-xs gap-1 hover:bg-white/5 px-2" data-testid="button-back">
                <ArrowLeft className="w-3 h-3" />
                <span className="hidden sm:inline">Back</span>
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      <main className="pt-20 pb-12 px-4">
        <div className="container mx-auto max-w-2xl">
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-secondary mx-auto mb-6 flex items-center justify-center"
            >
              <Gift className="w-10 h-10 text-white" />
            </motion.div>
            <h1 className="text-3xl md:text-4xl font-display font-bold mb-3">
              DarkWave <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Airdrop</span>
            </h1>
            <p className="text-muted-foreground max-w-md mx-auto">
              Check your eligibility for the DarkWave genesis airdrop. Early adopters and beta testers receive bonus allocations.
            </p>
          </div>

          <GlassCard className="p-6 mb-6">
            <div className="space-y-4">
              <div className="flex gap-2 mb-4">
                <Button
                  variant={checkMethod === "email" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCheckMethod("email")}
                  className="flex-1 gap-2"
                  data-testid="button-check-email"
                >
                  <Mail className="w-4 h-4" /> Email
                </Button>
                <Button
                  variant={checkMethod === "wallet" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCheckMethod("wallet")}
                  className="flex-1 gap-2"
                  data-testid="button-check-wallet"
                >
                  <Wallet className="w-4 h-4" /> Wallet
                </Button>
              </div>

              <div className="flex gap-2">
                <Input
                  placeholder={checkMethod === "email" ? "Enter your email address" : "Enter your wallet address"}
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  className="flex-1"
                  data-testid="input-identifier"
                />
                <Button 
                  onClick={handleCheck} 
                  disabled={checkMutation.isPending || !identifier.trim()}
                  data-testid="button-check-eligibility"
                >
                  {checkMutation.isPending ? "Checking..." : "Check"}
                </Button>
              </div>
            </div>
          </GlassCard>

          <AnimatePresence mode="wait">
            {eligibility && (
              <motion.div
                key="result"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                {eligibility.eligible ? (
                  <GlassCard className="p-6 border-green-500/30" data-testid="card-eligible">
                    <div className="flex items-center gap-3 mb-4">
                      <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${getTierColor(eligibility.tier)} flex items-center justify-center`}>
                        {(() => {
                          const Icon = getTierIcon(eligibility.tier);
                          return <Icon className="w-6 h-6 text-white" />;
                        })()}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <Check className="w-5 h-5 text-green-400" />
                          <span className="font-bold text-lg text-green-400">You're Eligible!</span>
                        </div>
                        <Badge className="bg-white/10 text-white text-xs mt-1">
                          {eligibility.tier || "Beta Tester"} Tier
                        </Badge>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div className="bg-white/5 rounded-lg p-4 text-center">
                        <div className="text-2xl font-bold text-primary">{parseFloat(eligibility.allocation || "0").toLocaleString()}</div>
                        <div className="text-xs text-muted-foreground">DWC Allocation</div>
                      </div>
                      <div className="bg-white/5 rounded-lg p-4 text-center">
                        <div className="text-2xl font-bold text-secondary">{parseFloat(eligibility.claimableAmount || "0").toLocaleString()}</div>
                        <div className="text-xs text-muted-foreground">Claimable Now</div>
                      </div>
                    </div>

                    {eligibility.alreadyClaimed ? (
                      <div className="text-center text-amber-400 text-sm">
                        <AlertCircle className="w-4 h-4 inline mr-2" />
                        You've already claimed your airdrop
                      </div>
                    ) : (
                      <Button className="w-full gap-2" size="lg" data-testid="button-claim">
                        <Sparkles className="w-4 h-4" /> Claim Airdrop
                      </Button>
                    )}

                    <p className="text-xs text-muted-foreground text-center mt-4">
                      Tokens will be distributed at mainnet launch (Feb 14, 2026)
                    </p>
                  </GlassCard>
                ) : (
                  <GlassCard className="p-6 border-red-500/30" data-testid="card-not-eligible">
                    <div className="text-center">
                      <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
                      <h3 className="font-bold text-lg mb-2">Not Eligible Yet</h3>
                      <p className="text-sm text-muted-foreground mb-6">
                        {eligibility.message || "This address is not registered for the airdrop. Join our beta program to qualify!"}
                      </p>
                      <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        <Link href="/staking">
                          <Button variant="outline" className="gap-2">
                            <Users className="w-4 h-4" /> Join Beta Program
                          </Button>
                        </Link>
                        <Link href="/token">
                          <Button className="gap-2">
                            <ExternalLink className="w-4 h-4" /> Learn About DWC
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </GlassCard>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          <div className="mt-8">
            <h3 className="text-lg font-bold mb-4">How It Works</h3>
            <div className="grid gap-3">
              <GlassCard className="p-4" hover={false}>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-sm shrink-0">1</div>
                  <div>
                    <h4 className="font-medium text-sm">Check Eligibility</h4>
                    <p className="text-xs text-muted-foreground">Enter your email or wallet address to see if you qualify for the airdrop.</p>
                  </div>
                </div>
              </GlassCard>
              <GlassCard className="p-4" hover={false}>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-sm shrink-0">2</div>
                  <div>
                    <h4 className="font-medium text-sm">Connect Wallet</h4>
                    <p className="text-xs text-muted-foreground">Link your DarkWave wallet to receive your token allocation at launch.</p>
                  </div>
                </div>
              </GlassCard>
              <GlassCard className="p-4" hover={false}>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-sm shrink-0">3</div>
                  <div>
                    <h4 className="font-medium text-sm">Receive Tokens</h4>
                    <p className="text-xs text-muted-foreground">Tokens are distributed automatically at mainnet launch on February 14, 2026.</p>
                  </div>
                </div>
              </GlassCard>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
