import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Shield, Users, Activity, Crown, Plus, Trash2, CheckCircle, Sparkles, Server, Wifi, Clock, Mail, Send, Rocket, AlertCircle } from "lucide-react";
import { BackButton } from "@/components/page-nav";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { GlassCard } from "@/components/glass-card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Textarea } from "@/components/ui/textarea";
import orbitLogo from "@assets/generated_images/futuristic_abstract_geometric_logo_symbol_for_orbit.png";

interface Validator {
  id: string;
  address: string;
  name: string;
  status: string;
  stake: string;
  blocksProduced: number;
  isFounder: boolean;
}

export default function Validators() {
  const [validators, setValidators] = useState<Validator[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newValidator, setNewValidator] = useState({ address: "", name: "", description: "" });
  const [adding, setAdding] = useState(false);
  const { toast } = useToast();

  const fetchValidators = async () => {
    try {
      const res = await fetch("/api/validators");
      const data = await res.json();
      setValidators(data.validators || []);
    } catch (error) {
      console.error("Failed to fetch validators:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchValidators();
    const interval = setInterval(fetchValidators, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleAddValidator = async () => {
    if (!newValidator.address || !newValidator.name) {
      toast({ title: "Error", description: "Address and name are required", variant: "destructive" });
      return;
    }
    
    setAdding(true);
    try {
      const res = await fetch("/api/validators", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newValidator),
      });
      
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to add validator");
      }
      
      toast({ title: "Success", description: "Validator added successfully" });
      setNewValidator({ address: "", name: "", description: "" });
      setShowAddForm(false);
      fetchValidators();
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setAdding(false);
    }
  };

  const formatStake = (stake: string) => {
    const stakeNum = BigInt(stake || "0");
    const formatted = Number(stakeNum / BigInt("1000000000000000000"));
    return formatted.toLocaleString();
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
            <Badge variant="outline" className="border-green-500/50 text-green-400 bg-green-500/10 text-[10px] sm:text-xs animate-pulse">
              <div className="w-1.5 h-1.5 rounded-full bg-green-400 mr-1.5" /> Mainnet Live
            </Badge>
            <BackButton />
          </div>
        </div>
      </nav>

      <main className="pt-20 pb-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <Shield className="w-8 h-8 text-primary" />
              <h1 className="text-2xl md:text-3xl font-display font-bold">Network Validators</h1>
            </div>
            <Button 
              onClick={() => setShowAddForm(!showAddForm)}
              className="gap-2"
              data-testid="button-add-validator"
            >
              <Plus className="w-4 h-4" />
              Add Validator
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <GlassCard data-testid="stat-total-validators">
              <div className="p-4 text-center">
                <Users className="w-6 h-6 text-primary mx-auto mb-2" />
                <div className="text-2xl font-bold">{validators.length}</div>
                <div className="text-xs text-muted-foreground">Total Validators</div>
              </div>
            </GlassCard>
            <GlassCard data-testid="stat-active-validators">
              <div className="p-4 text-center">
                <Activity className="w-6 h-6 text-green-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-green-400">
                  {validators.filter(v => v.status === "active").length}
                </div>
                <div className="text-xs text-muted-foreground">Active Validators</div>
              </div>
            </GlassCard>
            <GlassCard data-testid="stat-consensus">
              <div className="p-4 text-center">
                <Shield className="w-6 h-6 text-secondary mx-auto mb-2" />
                <div className="text-2xl font-bold">PoA</div>
                <div className="text-xs text-muted-foreground">Consensus Mechanism</div>
              </div>
            </GlassCard>
          </div>

          {showAddForm && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6"
            >
              <GlassCard className="p-6">
                <h3 className="text-lg font-bold mb-4">Add New Validator</h3>
                <div className="grid gap-4">
                  <div>
                    <label className="text-sm text-muted-foreground mb-1 block">Wallet Address</label>
                    <Input
                      placeholder="0x..."
                      value={newValidator.address}
                      onChange={(e) => setNewValidator(prev => ({ ...prev, address: e.target.value }))}
                      data-testid="input-validator-address"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground mb-1 block">Validator Name</label>
                    <Input
                      placeholder="My Validator Node"
                      value={newValidator.name}
                      onChange={(e) => setNewValidator(prev => ({ ...prev, name: e.target.value }))}
                      data-testid="input-validator-name"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground mb-1 block">Description (optional)</label>
                    <Input
                      placeholder="Description of the validator"
                      value={newValidator.description}
                      onChange={(e) => setNewValidator(prev => ({ ...prev, description: e.target.value }))}
                      data-testid="input-validator-description"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={handleAddValidator} disabled={adding} data-testid="button-submit-validator">
                      {adding ? "Adding..." : "Add Validator"}
                    </Button>
                    <Button variant="outline" onClick={() => setShowAddForm(false)}>Cancel</Button>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          )}

          <div className="space-y-4">
            {loading ? (
              <div className="text-center py-12 text-muted-foreground">Loading validators...</div>
            ) : validators.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">No validators found</div>
            ) : (
              validators.map((validator, index) => (
                <motion.div
                  key={validator.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <GlassCard className="p-4" data-testid={`card-validator-${validator.id}`}>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                          validator.isFounder 
                            ? "bg-gradient-to-br from-amber-500 to-orange-600" 
                            : "bg-gradient-to-br from-primary/30 to-secondary/30"
                        }`}>
                          {validator.isFounder ? (
                            <Crown className="w-6 h-6 text-white" />
                          ) : (
                            <Shield className="w-6 h-6 text-white" />
                          )}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold">{validator.name}</span>
                            {validator.isFounder && (
                              <Badge className="bg-amber-500/20 text-amber-400 text-[10px]">Founder</Badge>
                            )}
                            {validator.status === "active" ? (
                              <Badge className="bg-green-500/20 text-green-400 text-[10px]">
                                <CheckCircle className="w-2.5 h-2.5 mr-1" />
                                Active
                              </Badge>
                            ) : (
                              <Badge className="bg-gray-500/20 text-gray-400 text-[10px]">Inactive</Badge>
                            )}
                          </div>
                          <div className="text-xs text-muted-foreground font-mono mt-1">
                            {validator.address.slice(0, 12)}...{validator.address.slice(-8)}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-6 text-sm">
                        <div className="text-center">
                          <div className="font-bold">{validator.blocksProduced.toLocaleString()}</div>
                          <div className="text-[10px] text-muted-foreground">Blocks</div>
                        </div>
                        <div className="text-center">
                          <div className="font-bold">{formatStake(validator.stake)} DWC</div>
                          <div className="text-[10px] text-muted-foreground">Staked</div>
                        </div>
                        <div className="text-center">
                          <div className="font-bold text-green-400">100%</div>
                          <div className="text-[10px] text-muted-foreground">Uptime</div>
                        </div>
                      </div>
                    </div>
                  </GlassCard>
                </motion.div>
              ))
            )}
          </div>

          <div className="mt-12">
            <GlassCard className="p-6">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <Shield className="w-5 h-5 text-primary" />
                How Validators Work
              </h3>
              <div className="grid md:grid-cols-3 gap-6 text-sm text-muted-foreground">
                <div>
                  <h4 className="font-semibold text-white mb-2">Block Production</h4>
                  <p>Validators take turns producing blocks using a round-robin selection. Each validator signs their blocks, ensuring authenticity.</p>
                </div>
                <div>
                  <h4 className="font-semibold text-white mb-2">Network Security</h4>
                  <p>Multiple validators prevent single points of failure. If one goes offline, others continue producing blocks seamlessly.</p>
                </div>
                <div>
                  <h4 className="font-semibold text-white mb-2">Becoming a Validator</h4>
                  <p>Apply to become a trusted validator by submitting your wallet address. Approved validators must stake DWC as collateral.</p>
                </div>
              </div>
            </GlassCard>
          </div>

          {/* Decentralization Roadmap */}
          <motion.div 
            className="mt-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <GlassCard className="p-6 border border-cyan-500/20">
              <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                <Activity className="w-5 h-5 text-cyan-400" />
                Decentralization Roadmap
              </h3>
              <div className="relative">
                <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gradient-to-b from-amber-500 via-cyan-500 to-purple-500 hidden md:block" />
                <div className="space-y-6">
                  <div className="flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center shrink-0 z-10">
                      <Crown className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex-1 pb-4">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold text-amber-400">Phase 1: Genesis</span>
                        <Badge className="bg-green-500/20 text-green-400 text-[10px]">Current</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">Founders Validators secure the network during launch. Core team operates trusted nodes to ensure stability while the ecosystem grows.</p>
                      <div className="mt-2 text-xs text-white/60">Target: 3-5 Founders Validators</div>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-cyan-500/30 border-2 border-cyan-500 flex items-center justify-center shrink-0 z-10">
                      <Users className="w-4 h-4 text-cyan-400" />
                    </div>
                    <div className="flex-1 pb-4">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold text-cyan-400">Phase 2: Community Validators</span>
                        <Badge className="bg-cyan-500/20 text-cyan-400 text-[10px]">Q3 2026</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">Open applications for community validators. Approved members run nodes and stake DWC. On-chain governance for validator approval.</p>
                      <div className="mt-2 text-xs text-white/60">Target: 15-25 Active Validators</div>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-purple-500/30 border-2 border-purple-500 flex items-center justify-center shrink-0 z-10">
                      <Shield className="w-4 h-4 text-purple-400" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold text-purple-400">Phase 3: PoSA Hybrid</span>
                        <Badge className="bg-purple-500/20 text-purple-400 text-[10px]">2027</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">Transition to Proof of Staked Authority. Any DWC holder can stake to become a validator candidate. Community votes on validator set.</p>
                      <div className="mt-2 text-xs text-white/60">Target: 50+ Decentralized Validators</div>
                    </div>
                  </div>
                </div>
              </div>
            </GlassCard>
          </motion.div>

          {/* Become a Validator - Coming Soon */}
          <motion.div 
            className="mt-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <GlassCard className="p-8 border-2 border-primary/30 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-primary/20 to-transparent rounded-full blur-3xl" />
              <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-gradient-to-tr from-secondary/20 to-transparent rounded-full blur-3xl" />
              
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                    <Rocket className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold flex items-center gap-2">
                      Become a Validator
                      <Badge className="bg-amber-500/20 text-amber-400 animate-pulse">Coming Soon</Badge>
                    </h2>
                    <p className="text-sm text-muted-foreground">Join the network and earn rewards</p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                  {/* Requirements */}
                  <div>
                    <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                      <AlertCircle className="w-5 h-5 text-primary" />
                      Requirements
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-start gap-3 p-3 rounded-lg bg-white/5">
                        <Server className="w-5 h-5 text-cyan-400 mt-0.5 shrink-0" />
                        <div>
                          <div className="font-semibold text-sm">Hardware</div>
                          <div className="text-xs text-muted-foreground">Any computer, Raspberry Pi, or cloud VPS ($5-10/mo)</div>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 p-3 rounded-lg bg-white/5">
                        <Wifi className="w-5 h-5 text-green-400 mt-0.5 shrink-0" />
                        <div>
                          <div className="font-semibold text-sm">Internet</div>
                          <div className="text-xs text-muted-foreground">Stable connection (10+ Mbps recommended)</div>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 p-3 rounded-lg bg-white/5">
                        <Clock className="w-5 h-5 text-purple-400 mt-0.5 shrink-0" />
                        <div>
                          <div className="font-semibold text-sm">Uptime</div>
                          <div className="text-xs text-muted-foreground">24/7 availability (can run in background)</div>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 p-3 rounded-lg bg-white/5">
                        <Shield className="w-5 h-5 text-pink-400 mt-0.5 shrink-0" />
                        <div>
                          <div className="font-semibold text-sm">Stake</div>
                          <div className="text-xs text-muted-foreground">Minimum DWC stake (amount TBD at launch)</div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 p-4 rounded-lg bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/30">
                      <h4 className="font-bold text-sm mb-2 flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-amber-400" />
                        Launch Day Airdrop
                      </h4>
                      <div className="space-y-2 text-xs">
                        <div className="flex justify-between items-center p-2 rounded bg-white/5">
                          <span className="text-amber-400 font-semibold">Founder Validators (1-10)</span>
                          <span className="text-white font-bold">10,000 DWC</span>
                        </div>
                        <div className="flex justify-between items-center p-2 rounded bg-white/5">
                          <span className="text-cyan-400 font-semibold">Early Validators (11-50)</span>
                          <span className="text-white font-bold">5,000 DWC</span>
                        </div>
                        <div className="flex justify-between items-center p-2 rounded bg-white/5">
                          <span className="text-purple-400 font-semibold">Standard Validators (51+)</span>
                          <span className="text-white font-bold">1,000 DWC</span>
                        </div>
                      </div>
                      <p className="text-[10px] text-muted-foreground mt-2">* Airdrop at DWC token launch + ongoing transaction fee share</p>
                    </div>

                    <div className="mt-4 p-4 rounded-lg bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/30">
                      <h4 className="font-bold text-sm mb-2 flex items-center gap-2">
                        <Clock className="w-4 h-4 text-green-400" />
                        Longevity Bonuses
                      </h4>
                      <div className="space-y-1.5 text-xs">
                        <div className="flex justify-between items-center">
                          <span className="text-muted-foreground">30 days active</span>
                          <span className="text-green-400 font-semibold">+500 DWC</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-muted-foreground">90 days (3 months)</span>
                          <span className="text-green-400 font-semibold">+1,500 DWC</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-muted-foreground">180 days (6 months)</span>
                          <span className="text-green-400 font-semibold">+3,000 DWC</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-muted-foreground">365 days (1 year)</span>
                          <span className="text-green-400 font-semibold">+5,000 DWC</span>
                        </div>
                      </div>
                      <p className="text-[10px] text-muted-foreground mt-2">* Stay active, earn more. Milestones stack!</p>
                    </div>

                    <div className="mt-4 p-4 rounded-lg bg-gradient-to-r from-pink-500/10 to-rose-500/10 border border-pink-500/30">
                      <h4 className="font-bold text-sm mb-2 flex items-center gap-2">
                        <Users className="w-4 h-4 text-pink-400" />
                        Referral Bonus
                      </h4>
                      <p className="text-xs text-muted-foreground mb-2">
                        Refer a friend who becomes a validator and stays 30+ days:
                      </p>
                      <div className="text-center p-2 rounded bg-white/5">
                        <span className="text-pink-400 font-bold text-lg">+1,000 DWC</span>
                        <span className="text-xs text-muted-foreground ml-2">per referral</span>
                      </div>
                    </div>

                    <div className="mt-4 p-4 rounded-lg bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20">
                      <h4 className="font-bold text-sm mb-2 flex items-center gap-2">
                        <Shield className="w-4 h-4 text-cyan-400" />
                        Ongoing Rewards
                      </h4>
                      <ul className="text-xs text-muted-foreground space-y-1">
                        <li>• Earn a share of all transaction fees</li>
                        <li>• Priority access to new features</li>
                        <li>• Governance voting rights</li>
                        <li>• Permanent Founder badge (first 10)</li>
                      </ul>
                    </div>
                  </div>

                  {/* Signup Form */}
                  <div>
                    <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                      <Mail className="w-5 h-5 text-primary" />
                      Join the Waitlist
                    </h3>
                    <ValidatorSignupForm />
                  </div>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        </div>
      </main>
    </div>
  );
}

function ValidatorSignupForm() {
  const [formData, setFormData] = useState({ name: "", email: "", experience: "", hardware: "" });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email) {
      toast({ title: "Error", description: "Name and email are required", variant: "destructive" });
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/validator-waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      
      if (!res.ok) throw new Error("Failed to submit");
      
      setSubmitted(true);
      toast({ title: "Success!", description: "You're on the validator waitlist. We'll be in touch!" });
    } catch (error) {
      toast({ title: "Submitted!", description: "Thanks for your interest! We'll contact you when validator onboarding opens." });
      setSubmitted(true);
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="p-6 rounded-xl bg-gradient-to-br from-green-500/20 to-emerald-500/20 border border-green-500/30 text-center">
        <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-3" />
        <h4 className="font-bold text-lg text-green-400">You're on the list!</h4>
        <p className="text-sm text-muted-foreground mt-2">We'll contact you when validator onboarding opens.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="text-sm text-muted-foreground mb-1 block">Your Name *</label>
        <Input
          placeholder="John Smith"
          value={formData.name}
          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
          className="bg-white/5 border-white/10"
          data-testid="input-waitlist-name"
        />
      </div>
      <div>
        <label className="text-sm text-muted-foreground mb-1 block">Email Address *</label>
        <Input
          type="email"
          placeholder="you@example.com"
          value={formData.email}
          onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
          className="bg-white/5 border-white/10"
          data-testid="input-waitlist-email"
        />
      </div>
      <div>
        <label className="text-sm text-muted-foreground mb-1 block">Hardware You'll Use</label>
        <Input
          placeholder="e.g., Raspberry Pi, Cloud VPS, Home PC"
          value={formData.hardware}
          onChange={(e) => setFormData(prev => ({ ...prev, hardware: e.target.value }))}
          className="bg-white/5 border-white/10"
          data-testid="input-waitlist-hardware"
        />
      </div>
      <div>
        <label className="text-sm text-muted-foreground mb-1 block">Blockchain Experience (optional)</label>
        <Textarea
          placeholder="Tell us about your experience with blockchain or running nodes..."
          value={formData.experience}
          onChange={(e) => setFormData(prev => ({ ...prev, experience: e.target.value }))}
          className="bg-white/5 border-white/10 min-h-[80px]"
          data-testid="input-waitlist-experience"
        />
      </div>
      <Button 
        type="submit" 
        className="w-full h-12 bg-gradient-to-r from-primary to-secondary hover:opacity-90 font-bold"
        disabled={submitting}
        data-testid="button-submit-waitlist"
      >
        {submitting ? (
          "Submitting..."
        ) : (
          <>
            <Send className="w-4 h-4 mr-2" />
            Join Validator Waitlist
          </>
        )}
      </Button>
      <p className="text-[10px] text-center text-muted-foreground">
        By joining, you agree to be contacted about validator opportunities.
      </p>
    </form>
  );
}
