import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Shield, Users, Activity, Crown, Plus, Trash2, CheckCircle } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { GlassCard } from "@/components/glass-card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
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
                          <div className="font-bold">{formatStake(validator.stake)} DWT</div>
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
                  <p>Apply to become a trusted validator by submitting your wallet address. Approved validators must stake DWT as collateral.</p>
                </div>
              </div>
            </GlassCard>
          </div>
        </div>
      </main>
    </div>
  );
}
