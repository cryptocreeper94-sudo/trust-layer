import { useState } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { 
  Users, Gift, Building2, Trophy, Target, Zap, 
  ArrowRight, Copy, Check, Calculator, Coins, DollarSign,
  Star, Crown, Sparkles, TrendingUp, Shield, ChevronLeft, ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { GlassCard } from "@/components/glass-card";
import { useAuth } from "@/hooks/use-auth";
import { SimpleLoginModal } from "@/components/simple-login";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

// MULTIPLIER-BASED REWARD STRUCTURE
// Base: 1,000 Shells per referral
// Multipliers based on purchase amount:
const MULTIPLIERS = {
  none: { mult: 1, label: "1x", shells: 1000 },      // No purchase
  tier_5: { mult: 3, label: "3x", shells: 3000 },   // $5-$24
  tier_25: { mult: 5, label: "5x", shells: 5000 },  // $25-$49
  tier_50: { mult: 7, label: "7x", shells: 7000 },  // $50-$99
  tier_100: { mult: 10, label: "10x", shells: 10000 }, // $100+
};

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


const GlowOrb = ({ color, size, top, left, delay = 0 }: { color: string; size: number; top: string; left: string; delay?: number }) => (
  <motion.div
    className="absolute rounded-full blur-3xl opacity-20 pointer-events-none"
    style={{ background: color, width: size, height: size, top, left }}
    animate={{ scale: [1, 1.2, 1], opacity: [0.15, 0.25, 0.15] }}
    transition={{ duration: 8, repeat: Infinity, delay }}
  />
);

export default function ReferralProgram() {
  const { isAuthenticated } = useAuth();
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<"individual" | "business">("individual");
  const [showLoginModal, setShowLoginModal] = useState(false);
  
  // Referral calculator - now using multiplier system
  const [signups1x, setSignups1x] = useState(20);   // No purchase (1x)
  const [signups3x, setSignups3x] = useState(5);    // $5-24 (3x)
  const [signups5x, setSignups5x] = useState(3);    // $25-49 (5x)
  const [signups7x, setSignups7x] = useState(2);    // $50-99 (7x)
  const [signups10x, setSignups10x] = useState(1);  // $100+ (10x)

  const milestones = activeTab === "individual" ? individualMilestones : businessMilestones;
  const baseMultiplier = activeTab === "business" ? 2.5 : 1;

  // Calculate shells using multiplier system
  const shells1x = signups1x * MULTIPLIERS.none.shells * baseMultiplier;
  const shells3x = signups3x * MULTIPLIERS.tier_5.shells * baseMultiplier;
  const shells5x = signups5x * MULTIPLIERS.tier_25.shells * baseMultiplier;
  const shells7x = signups7x * MULTIPLIERS.tier_50.shells * baseMultiplier;
  const shells10x = signups10x * MULTIPLIERS.tier_100.shells * baseMultiplier;
  
  const totalSignups = signups1x + signups3x + signups5x + signups7x + signups10x;
  const referralShells = shells1x + shells3x + shells5x + shells7x + shells10x;
  
  const earnedMilestoneBonus = milestones
    .filter(m => totalSignups >= m.referrals)
    .reduce((acc, m) => acc + m.bonus, 0);

  const totalShells = referralShells + earnedMilestoneBonus;
  const totalSig = totalShells / 10;
  const totalValue = totalSig * 0.01;

  const handleCopy = async () => {
    await navigator.clipboard.writeText("https://dwtl.io/ref/YOUR_CODE");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen relative overflow-hidden pt-20 pb-12" style={{ background: "linear-gradient(180deg, #070b16, #0c1222, #070b16)" }}>
      <GlowOrb color="linear-gradient(135deg, #06b6d4, #3b82f6)" size={500} top="-5%" left="60%" />
      <GlowOrb color="linear-gradient(135deg, #8b5cf6, #ec4899)" size={400} top="40%" left="-10%" delay={3} />
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
              Bring people into the Trust Layer ecosystem and earn Signal tokens. 
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
                  <h2 className="font-bold text-lg">Multiplier Rewards</h2>
                  {activeTab === "business" && (
                    <Badge className="ml-2 bg-purple-500/20 text-purple-400 border-purple-500/30">+2.5x Business</Badge>
                  )}
                </div>

                <div className="space-y-4">
                  <div className="p-4 bg-gradient-to-r from-yellow-500/10 to-orange-500/5 rounded-xl border border-yellow-500/20">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge className="bg-cyan-500/20 text-cyan-400 border-cyan-500/30 text-xs">BASE</Badge>
                    </div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm">Signup (no purchase)</span>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs font-mono">1x</Badge>
                        <span className="font-mono font-bold text-yellow-400">
                          {(MULTIPLIERS.none.shells * baseMultiplier).toLocaleString()} Shells
                        </span>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Base reward for every verified signup
                    </p>
                  </div>

                  <div className="text-xs text-muted-foreground uppercase tracking-wide pt-2">
                    Purchase Multipliers (min $5)
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 bg-gradient-to-br from-green-500/10 to-emerald-500/5 rounded-lg border border-green-500/20">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-muted-foreground">$5 - $24</span>
                        <Badge className="bg-green-500/20 text-green-400 border-green-500/30 text-xs font-mono">3x</Badge>
                      </div>
                      <div className="font-mono text-green-400 font-bold">{(MULTIPLIERS.tier_5.shells * baseMultiplier).toLocaleString()}</div>
                    </div>
                    <div className="p-3 bg-gradient-to-br from-blue-500/10 to-cyan-500/5 rounded-lg border border-blue-500/20">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-muted-foreground">$25 - $49</span>
                        <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 text-xs font-mono">5x</Badge>
                      </div>
                      <div className="font-mono text-blue-400 font-bold">{(MULTIPLIERS.tier_25.shells * baseMultiplier).toLocaleString()}</div>
                    </div>
                    <div className="p-3 bg-gradient-to-br from-purple-500/10 to-pink-500/5 rounded-lg border border-purple-500/20">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-muted-foreground">$50 - $99</span>
                        <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30 text-xs font-mono">7x</Badge>
                      </div>
                      <div className="font-mono text-purple-400 font-bold">{(MULTIPLIERS.tier_50.shells * baseMultiplier).toLocaleString()}</div>
                    </div>
                    <div className="p-3 bg-gradient-to-br from-amber-500/10 to-orange-500/5 rounded-lg border border-amber-500/20">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-muted-foreground">$100+</span>
                        <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30 text-xs font-mono">10x</Badge>
                      </div>
                      <div className="font-mono text-amber-400 font-bold">{(MULTIPLIERS.tier_100.shells * baseMultiplier).toLocaleString()}</div>
                    </div>
                  </div>
                </div>
              </div>
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
                        totalSignups >= milestone.referrals 
                          ? "bg-gradient-to-r from-yellow-500/20 to-orange-500/10 border border-yellow-500/30" 
                          : "bg-white/5"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${
                          totalSignups >= milestone.referrals ? "bg-yellow-500/20" : "bg-white/10"
                        }`}>
                          <milestone.icon className={`w-4 h-4 ${
                            totalSignups >= milestone.referrals ? "text-yellow-400" : "text-muted-foreground"
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
</div>

          <GlassCard glow className="mb-12">
            <div className="p-6">
              <div className="flex items-center gap-2 mb-6">
                <Calculator className="w-5 h-5 text-cyan-400" />
                <h2 className="font-bold text-lg">Earnings Calculator</h2>
                <Badge className="ml-auto bg-cyan-500/20 text-cyan-400 border-cyan-500/30">Multiplier System</Badge>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <div className="text-xs text-muted-foreground uppercase tracking-wide">Your Referrals by Multiplier</div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
                      <Badge variant="outline" className="w-12 text-xs font-mono">1x</Badge>
                      <div className="flex-1">
                        <label className="text-xs text-muted-foreground block mb-1">Signups (no purchase)</label>
                        <Input
                          type="number"
                          min={0}
                          value={signups1x}
                          onChange={(e) => setSignups1x(Math.max(0, parseInt(e.target.value) || 0))}
                          className="bg-white/5 border-white/10"
                          data-testid="calc-1x"
                        />
                      </div>
                      <div className="text-right min-w-[80px]">
                        <span className="font-mono text-yellow-400">{shells1x.toLocaleString()}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-green-500/10 to-transparent rounded-lg border border-green-500/20">
                      <Badge className="w-12 bg-green-500/20 text-green-400 border-green-500/30 text-xs font-mono">3x</Badge>
                      <div className="flex-1">
                        <label className="text-xs text-muted-foreground block mb-1">Purchased $5-$24</label>
                        <Input
                          type="number"
                          min={0}
                          value={signups3x}
                          onChange={(e) => setSignups3x(Math.max(0, parseInt(e.target.value) || 0))}
                          className="bg-white/5 border-white/10"
                          data-testid="calc-3x"
                        />
                      </div>
                      <div className="text-right min-w-[80px]">
                        <span className="font-mono text-green-400">{shells3x.toLocaleString()}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-blue-500/10 to-transparent rounded-lg border border-blue-500/20">
                      <Badge className="w-12 bg-blue-500/20 text-blue-400 border-blue-500/30 text-xs font-mono">5x</Badge>
                      <div className="flex-1">
                        <label className="text-xs text-muted-foreground block mb-1">Purchased $25-$49</label>
                        <Input
                          type="number"
                          min={0}
                          value={signups5x}
                          onChange={(e) => setSignups5x(Math.max(0, parseInt(e.target.value) || 0))}
                          className="bg-white/5 border-white/10"
                          data-testid="calc-5x"
                        />
                      </div>
                      <div className="text-right min-w-[80px]">
                        <span className="font-mono text-blue-400">{shells5x.toLocaleString()}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-purple-500/10 to-transparent rounded-lg border border-purple-500/20">
                      <Badge className="w-12 bg-purple-500/20 text-purple-400 border-purple-500/30 text-xs font-mono">7x</Badge>
                      <div className="flex-1">
                        <label className="text-xs text-muted-foreground block mb-1">Purchased $50-$99</label>
                        <Input
                          type="number"
                          min={0}
                          value={signups7x}
                          onChange={(e) => setSignups7x(Math.max(0, parseInt(e.target.value) || 0))}
                          className="bg-white/5 border-white/10"
                          data-testid="calc-7x"
                        />
                      </div>
                      <div className="text-right min-w-[80px]">
                        <span className="font-mono text-purple-400">{shells7x.toLocaleString()}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-amber-500/10 to-transparent rounded-lg border border-amber-500/20">
                      <Badge className="w-12 bg-amber-500/20 text-amber-400 border-amber-500/30 text-xs font-mono">10x</Badge>
                      <div className="flex-1">
                        <label className="text-xs text-muted-foreground block mb-1">Purchased $100+</label>
                        <Input
                          type="number"
                          min={0}
                          value={signups10x}
                          onChange={(e) => setSignups10x(Math.max(0, parseInt(e.target.value) || 0))}
                          className="bg-white/5 border-white/10"
                          data-testid="calc-10x"
                        />
                      </div>
                      <div className="text-right min-w-[80px]">
                        <span className="font-mono text-amber-400">{shells10x.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="text-xs text-muted-foreground uppercase tracking-wide">Your Earnings</div>
                  
                  <div className="space-y-2 bg-white/5 rounded-xl p-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Total Referrals</span>
                      <span className="font-mono">{totalSignups} people</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Referral Shells</span>
                      <span className="font-mono text-yellow-400">{referralShells.toLocaleString()}</span>
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
<div className="text-center">
            {isAuthenticated ? (
              <Link href="/dashboard">
                <Button size="lg" className="gap-2 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600">
                  Go to Dashboard <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            ) : (
              <Button size="lg" className="gap-2 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600" onClick={() => setShowLoginModal(true)}>
                Start Earning Now <ArrowRight className="w-4 h-4" />
              </Button>
            )}
            <p className="text-sm text-muted-foreground mt-4">
              No limits. No caps. Earn what you bring.
            </p>
          </div>
        </div>
      </main>

      
      <SimpleLoginModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} />
    </div>
</Input>
</Input>
);
}
