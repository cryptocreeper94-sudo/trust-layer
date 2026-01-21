import { useState } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { 
  Users, Gift, Building2, Trophy, Target, Zap, 
  ArrowRight, Copy, Check, Calculator, Coins, DollarSign,
  Star, Crown, Sparkles, TrendingUp, Shield
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { GlassCard } from "@/components/glass-card";
import { Footer } from "@/components/footer";
import { useAuth } from "@/hooks/use-auth";
import orbitLogo from "@assets/generated_images/futuristic_abstract_geometric_logo_symbol_for_orbit.png";

const individualMilestones = [
  { referrals: 10, bonus: 10000, title: "Starter", icon: Star },
  { referrals: 25, bonus: 25000, title: "Networker", icon: Users },
  { referrals: 50, bonus: 50000, title: "Connector", icon: Zap },
  { referrals: 100, bonus: 100000, title: "Ambassador", icon: Trophy },
  { referrals: 250, bonus: 250000, title: "Elite", icon: Crown },
  { referrals: 500, bonus: 500000, title: "Legend", icon: Sparkles },
];

const businessMilestones = [
  { referrals: 10, bonus: 25000, title: "Partner", icon: Building2 },
  { referrals: 25, bonus: 75000, title: "Preferred Partner", icon: Shield },
  { referrals: 50, bonus: 150000, title: "Strategic Partner", icon: Target },
  { referrals: 100, bonus: 300000, title: "Enterprise Partner", icon: Trophy },
  { referrals: 250, bonus: 750000, title: "Elite Partner", icon: Crown },
  { referrals: 500, bonus: 1500000, title: "Founding Partner", icon: Sparkles },
];

export default function ReferralProgram() {
  const { isAuthenticated } = useAuth();
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<"individual" | "business">("individual");
  
  const [signups, setSignups] = useState(25);
  const [buyers5, setBuyers5] = useState(5);
  const [buyers25, setBuyers25] = useState(3);
  const [buyers50, setBuyers50] = useState(2);
  const [buyers100, setBuyers100] = useState(1);

  const milestones = activeTab === "individual" ? individualMilestones : businessMilestones;
  const baseMultiplier = activeTab === "business" ? 2.5 : 1;

  const baseShells = signups * 1000 * baseMultiplier;
  const bonus5 = buyers5 * 5000 * baseMultiplier;
  const bonus25 = buyers25 * 10000 * baseMultiplier;
  const bonus50 = buyers50 * 20000 * baseMultiplier;
  const bonus100 = buyers100 * 50000 * baseMultiplier;
  
  const earnedMilestoneBonus = milestones
    .filter(m => signups >= m.referrals)
    .reduce((acc, m) => acc + m.bonus, 0);

  const totalShells = baseShells + bonus5 + bonus25 + bonus50 + bonus100 + earnedMilestoneBonus;
  const totalSig = totalShells / 10;
  const totalValue = totalSig * 0.01;

  const handleCopy = async () => {
    await navigator.clipboard.writeText("https://dwtl.io/ref/YOUR_CODE");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-background/90 backdrop-blur-xl">
        <div className="container mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <img src={orbitLogo} alt="DarkWave" className="w-7 h-7" />
            <span className="font-display font-bold text-lg">DarkWave</span>
          </Link>
          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <Link href="/dashboard">
                <Button size="sm" variant="outline" className="border-primary/30">Dashboard</Button>
              </Link>
            ) : (
              <a href="/api/login">
                <Button size="sm" className="bg-primary hover:bg-primary/90">Sign In</Button>
              </a>
            )}
          </div>
        </div>
      </nav>

      <main className="pt-24 pb-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <Badge className="mb-4 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border-yellow-500/30">
              <Gift className="w-3 h-3 mr-1" /> Referral Program
            </Badge>
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">
              Grow the Network.{" "}
              <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                Earn Rewards.
              </span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Bring people into the DarkWave Trust Layer ecosystem and earn Signal tokens. 
              No limits, no caps - the more you bring, the more you earn.
            </p>
          </motion.div>

          <div className="flex justify-center gap-2 mb-8">
            <Button
              variant={activeTab === "individual" ? "default" : "outline"}
              onClick={() => setActiveTab("individual")}
              className="gap-2"
              data-testid="tab-individual"
            >
              <Users className="w-4 h-4" /> Individual
            </Button>
            <Button
              variant={activeTab === "business" ? "default" : "outline"}
              onClick={() => setActiveTab("business")}
              className="gap-2"
              data-testid="tab-business"
            >
              <Building2 className="w-4 h-4" /> Business
            </Button>
          </div>

          {activeTab === "business" && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mb-8 p-4 bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-xl border border-purple-500/20 text-center"
            >
              <div className="flex items-center justify-center gap-2 mb-2">
                <Building2 className="w-5 h-5 text-purple-400" />
                <span className="font-semibold">Business Partner Program</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Verified businesses earn <span className="text-purple-400 font-bold">2.5x rewards</span> and unlock exclusive milestone bonuses.
                Perfect for agencies, consultants, and business networks.
              </p>
            </motion.div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
            <GlassCard glow>
              <div className="p-6">
                <div className="flex items-center gap-2 mb-6">
                  <Gift className="w-5 h-5 text-yellow-400" />
                  <h2 className="font-bold text-lg">Base Rewards</h2>
                  {activeTab === "business" && (
                    <Badge className="ml-2 bg-purple-500/20 text-purple-400 border-purple-500/30">2.5x</Badge>
                  )}
                </div>

                <div className="space-y-4">
                  <div className="p-4 bg-gradient-to-r from-yellow-500/10 to-orange-500/5 rounded-xl border border-yellow-500/20">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30 text-xs">PRESALE</Badge>
                      <span className="text-xs text-muted-foreground">Limited Time</span>
                    </div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm">Every Signup</span>
                      <span className="font-mono font-bold text-yellow-400">
                        {(1000 * baseMultiplier).toLocaleString()} Shells
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Premium rate during presale period
                    </p>
                  </div>
                  
                  <div className="p-4 bg-white/5 rounded-xl opacity-60">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="outline" className="text-xs">POST-LAUNCH</Badge>
                    </div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm">Every Signup</span>
                      <span className="font-mono text-muted-foreground">
                        {(500 * baseMultiplier).toLocaleString()} Shells
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Standard rate after TGE
                    </p>
                  </div>

                  <div className="text-xs text-muted-foreground uppercase tracking-wide pt-2">
                    Purchase Bonuses (min $5)
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 bg-white/5 rounded-lg">
                      <div className="text-xs text-muted-foreground mb-1">$5 - $24</div>
                      <div className="font-mono text-green-400">+{(5000 * baseMultiplier).toLocaleString()}</div>
                    </div>
                    <div className="p-3 bg-white/5 rounded-lg">
                      <div className="text-xs text-muted-foreground mb-1">$25 - $49</div>
                      <div className="font-mono text-green-400">+{(10000 * baseMultiplier).toLocaleString()}</div>
                    </div>
                    <div className="p-3 bg-white/5 rounded-lg">
                      <div className="text-xs text-muted-foreground mb-1">$50 - $99</div>
                      <div className="font-mono text-green-400">+{(20000 * baseMultiplier).toLocaleString()}</div>
                    </div>
                    <div className="p-3 bg-white/5 rounded-lg">
                      <div className="text-xs text-muted-foreground mb-1">$100+</div>
                      <div className="font-mono text-green-400">+{(50000 * baseMultiplier).toLocaleString()}</div>
                    </div>
                  </div>
                </div>
              </div>
            </GlassCard>

            <GlassCard glow>
              <div className="p-6">
                <div className="flex items-center gap-2 mb-6">
                  <Trophy className="w-5 h-5 text-orange-400" />
                  <h2 className="font-bold text-lg">Milestone Bonuses</h2>
                </div>

                <div className="space-y-3">
                  {milestones.map((milestone, i) => (
                    <div 
                      key={i}
                      className={`flex items-center justify-between p-3 rounded-lg transition-all ${
                        signups >= milestone.referrals 
                          ? "bg-gradient-to-r from-yellow-500/20 to-orange-500/10 border border-yellow-500/30" 
                          : "bg-white/5"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${
                          signups >= milestone.referrals ? "bg-yellow-500/20" : "bg-white/10"
                        }`}>
                          <milestone.icon className={`w-4 h-4 ${
                            signups >= milestone.referrals ? "text-yellow-400" : "text-muted-foreground"
                          }`} />
                        </div>
                        <div>
                          <div className="font-semibold text-sm">{milestone.title}</div>
                          <div className="text-xs text-muted-foreground">{milestone.referrals} referrals</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-mono font-bold text-orange-400">
                          +{milestone.bonus.toLocaleString()}
                        </div>
                        <div className="text-xs text-muted-foreground">SIG bonus</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </GlassCard>
          </div>

          <GlassCard glow className="mb-12">
            <div className="p-6">
              <div className="flex items-center gap-2 mb-6">
                <Calculator className="w-5 h-5 text-cyan-400" />
                <h2 className="font-bold text-lg">Earnings Calculator</h2>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <div className="text-xs text-muted-foreground uppercase tracking-wide">Your Referrals</div>
                  
                  <div className="flex items-center gap-3">
                    <div className="flex-1">
                      <label className="text-sm text-muted-foreground block mb-1">Total Signups</label>
                      <Input
                        type="number"
                        min={0}
                        value={signups}
                        onChange={(e) => setSignups(Math.max(0, parseInt(e.target.value) || 0))}
                        className="bg-white/5 border-white/10 h-12 text-lg"
                        data-testid="calc-signups"
                      />
                    </div>
                  </div>

                  <div className="border-t border-white/10 pt-4">
                    <div className="text-xs text-muted-foreground mb-3">How many purchased:</div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs text-muted-foreground block mb-1">$5-$24</label>
                        <Input
                          type="number"
                          min={0}
                          value={buyers5}
                          onChange={(e) => setBuyers5(Math.max(0, parseInt(e.target.value) || 0))}
                          className="bg-white/5 border-white/10"
                          data-testid="calc-buyers-5"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-muted-foreground block mb-1">$25-$49</label>
                        <Input
                          type="number"
                          min={0}
                          value={buyers25}
                          onChange={(e) => setBuyers25(Math.max(0, parseInt(e.target.value) || 0))}
                          className="bg-white/5 border-white/10"
                          data-testid="calc-buyers-25"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-muted-foreground block mb-1">$50-$99</label>
                        <Input
                          type="number"
                          min={0}
                          value={buyers50}
                          onChange={(e) => setBuyers50(Math.max(0, parseInt(e.target.value) || 0))}
                          className="bg-white/5 border-white/10"
                          data-testid="calc-buyers-50"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-muted-foreground block mb-1">$100+</label>
                        <Input
                          type="number"
                          min={0}
                          value={buyers100}
                          onChange={(e) => setBuyers100(Math.max(0, parseInt(e.target.value) || 0))}
                          className="bg-white/5 border-white/10"
                          data-testid="calc-buyers-100"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="text-xs text-muted-foreground uppercase tracking-wide">Your Earnings</div>
                  
                  <div className="space-y-2 bg-white/5 rounded-xl p-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Base (signups)</span>
                      <span className="font-mono">{baseShells.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Purchase bonuses</span>
                      <span className="font-mono text-green-400">+{(bonus5 + bonus25 + bonus50 + bonus100).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Milestone bonuses</span>
                      <span className="font-mono text-orange-400">+{earnedMilestoneBonus.toLocaleString()}</span>
                    </div>
                    <div className="border-t border-white/10 pt-2 mt-2">
                      <div className="flex justify-between">
                        <span className="font-semibold">Total Shells</span>
                        <span className="font-mono text-lg font-bold text-yellow-400">{totalShells.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-gradient-to-br from-cyan-500/20 to-cyan-600/10 rounded-xl p-4 border border-cyan-500/20">
                      <div className="flex items-center gap-2 mb-1">
                        <Coins className="w-4 h-4 text-cyan-400" />
                        <span className="text-xs text-cyan-400">Converts To</span>
                      </div>
                      <div className="text-2xl font-bold font-mono">{totalSig.toLocaleString()} SIG</div>
                    </div>
                    <div className="bg-gradient-to-br from-green-500/20 to-green-600/10 rounded-xl p-4 border border-green-500/20">
                      <div className="flex items-center gap-2 mb-1">
                        <DollarSign className="w-4 h-4 text-green-400" />
                        <span className="text-xs text-green-400">Value at TGE</span>
                      </div>
                      <div className="text-2xl font-bold font-mono">${totalValue.toLocaleString()}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </GlassCard>

          <GlassCard glow className="mb-12">
            <div className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="w-5 h-5 text-green-400" />
                <h2 className="font-bold text-lg">How It Works</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="text-center p-4">
                  <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-3">
                    <span className="text-xl font-bold text-primary">1</span>
                  </div>
                  <div className="font-semibold mb-1">Sign Up</div>
                  <p className="text-xs text-muted-foreground">Create your account at dwtl.io</p>
                </div>
                <div className="text-center p-4">
                  <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-3">
                    <span className="text-xl font-bold text-primary">2</span>
                  </div>
                  <div className="font-semibold mb-1">Get Your Link</div>
                  <p className="text-xs text-muted-foreground">Find your unique referral link in dashboard</p>
                </div>
                <div className="text-center p-4">
                  <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-3">
                    <span className="text-xl font-bold text-primary">3</span>
                  </div>
                  <div className="font-semibold mb-1">Share Everywhere</div>
                  <p className="text-xs text-muted-foreground">Social media, friends, anywhere</p>
                </div>
                <div className="text-center p-4">
                  <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-3">
                    <span className="text-xl font-bold text-primary">4</span>
                  </div>
                  <div className="font-semibold mb-1">Earn Automatically</div>
                  <p className="text-xs text-muted-foreground">Rewards credited twice daily</p>
                </div>
              </div>
            </div>
          </GlassCard>

          <div className="text-center">
            {isAuthenticated ? (
              <Link href="/dashboard">
                <Button size="lg" className="gap-2 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600">
                  Go to Dashboard <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            ) : (
              <a href="/api/login">
                <Button size="lg" className="gap-2 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600">
                  Start Earning Now <ArrowRight className="w-4 h-4" />
                </Button>
              </a>
            )}
            <p className="text-sm text-muted-foreground mt-4">
              No limits. No caps. Earn what you bring.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
