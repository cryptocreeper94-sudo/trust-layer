import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "wouter";
import { 
  Globe, Plus, Trash2, Save, ArrowLeft, Shield, Lock, Eye,
  Server, Settings, Check, X, Loader2, ExternalLink, Copy
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

const GlowOrb = ({ color, size, top, left, delay = 0 }: { color: string; size: number; top: string; left: string; delay?: number }) => (
  <motion.div
    className="absolute rounded-full blur-3xl opacity-20 pointer-events-none"
    style={{ background: color, width: size, height: size, top, left }}
    animate={{ scale: [1, 1.2, 1], opacity: [0.15, 0.25, 0.15] }}
    transition={{ duration: 8, repeat: Infinity, delay }}
  />
);

function SecretEntry({ onSuccess }: { onSuccess: () => void }) {
  const [secret, setSecret] = useState("");
  const [error, setError] = useState("");
  const [shake, setShake] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showSecret, setShowSecret] = useState(false);

  const handleSubmit = async () => {
    if (secret.length < 16) {
      setError("Secret must be at least 16 characters");
      return;
    }
    
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/owner/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ secret }),
      });
      
      const data = await res.json();
      
      if (res.ok) {
        sessionStorage.setItem("ownerAuth", "true");
        sessionStorage.setItem("ownerToken", data.token);
        onSuccess();
      } else {
        setError(data.error || "Invalid credentials");
        setShake(true);
        setTimeout(() => setShake(false), 500);
      }
    } catch {
      setError("Connection error. Please try again.");
      setShake(true);
      setTimeout(() => setShake(false), 500);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center relative overflow-hidden">
      <GlowOrb color="linear-gradient(135deg, #06b6d4, #8b5cf6)" size={400} top="10%" left="10%" />
      <GlowOrb color="linear-gradient(135deg, #ec4899, #8b5cf6)" size={300} top="60%" left="70%" delay={2} />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`relative z-10 bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-3xl p-8 max-w-md w-full mx-4 ${shake ? 'animate-shake' : ''}`}
        style={{ boxShadow: "0 0 60px rgba(0,200,255,0.1)" }}
      >
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-purple-500/20 border border-white/10 flex items-center justify-center">
            <Globe className="w-8 h-8 text-cyan-400" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Owner Domain Manager</h1>
          <p className="text-gray-400 text-sm">Enter your secret key to manage domains</p>
        </div>

        <div className="space-y-4">
          <div className="relative">
            <input
              type={showSecret ? "text" : "password"}
              value={secret}
              onChange={(e) => { setSecret(e.target.value); setError(""); }}
              onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
              placeholder="Enter secret key..."
              className="w-full px-4 py-3 bg-slate-800/50 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 pr-12"
              autoFocus
              data-testid="input-owner-domain-secret"
            />
            <button
              type="button"
              onClick={() => setShowSecret(!showSecret)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
            >
              <Eye className="w-5 h-5" />
            </button>
          </div>

          {error && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-red-400 text-sm text-center"
            >
              {error}
            </motion.p>
          )}

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSubmit}
            disabled={loading || secret.length < 16}
            className="w-full py-3 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-xl text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:shadow-lg hover:shadow-cyan-500/25"
            data-testid="button-owner-domain-auth"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="w-5 h-5 animate-spin" />
                Authenticating...
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                <Lock className="w-5 h-5" />
                Access Domain Manager
              </span>
            )}
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}

interface Domain {
  id: string;
  name: string;
  tld: string;
  ownerAddress: string;
  registeredAt: string;
  expiresAt: string | null;
  ownershipType: string;
  isPremium: boolean;
  isProtected: boolean;
}

const SUPPORTED_TLDS = [
  { value: "dwsc", label: ".dwsc" },
  { value: "legacy", label: ".legacy" },
  { value: "chrono", label: ".chrono" },
  { value: "pulse", label: ".pulse" },
];

function DomainManager() {
  const queryClient = useQueryClient();
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newDomain, setNewDomain] = useState({ name: "", tld: "dwsc" });
  const [adding, setAdding] = useState(false);

  const ownerToken = sessionStorage.getItem("ownerToken");

  const { data: domains = [], isLoading } = useQuery<Domain[]>({
    queryKey: ["/api/owner/domains"],
    queryFn: async () => {
      const res = await fetch("/api/owner/domains", {
        headers: { "Authorization": `Bearer ${ownerToken}` },
      });
      if (!res.ok) throw new Error("Failed to fetch domains");
      return res.json();
    },
  });

  const addDomainMutation = useMutation({
    mutationFn: async (domain: { name: string; tld: string }) => {
      const res = await fetch("/api/owner/domains", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${ownerToken}`,
        },
        body: JSON.stringify(domain),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to add domain");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/owner/domains"] });
      setShowAddDialog(false);
      setNewDomain({ name: "", tld: "dwsc" });
      toast.success("Domain added successfully");
    },
    onError: (err: Error) => {
      toast.error(err.message);
    },
  });

  const deleteDomainMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/owner/domains/${id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${ownerToken}` },
      });
      if (!res.ok) throw new Error("Failed to delete domain");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/owner/domains"] });
      toast.success("Domain removed");
    },
  });

  const handleAddDomain = async () => {
    if (!newDomain.name.trim()) return;
    setAdding(true);
    try {
      await addDomainMutation.mutateAsync(newDomain);
    } finally {
      setAdding(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard");
  };

  return (
    <div className="min-h-screen bg-slate-950 relative overflow-hidden">
      <GlowOrb color="linear-gradient(135deg, #06b6d4, #8b5cf6)" size={400} top="5%" left="5%" />
      <GlowOrb color="linear-gradient(135deg, #ec4899, #8b5cf6)" size={300} top="70%" left="80%" delay={2} />

      <div className="relative z-10 container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link href="/owner-admin">
              <Button variant="ghost" size="icon" className="text-white/60 hover:text-white">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-white">Domain Manager</h1>
              <p className="text-gray-400">Manage your owned domains directly</p>
            </div>
          </div>
          <Button 
            onClick={() => setShowAddDialog(true)}
            className="bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700"
            data-testid="button-add-domain"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Domain
          </Button>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-cyan-400 animate-spin" />
          </div>
        ) : domains.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-2xl p-12 text-center"
          >
            <Globe className="w-16 h-16 text-gray-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No Domains Yet</h3>
            <p className="text-gray-400 mb-6">Add your first domain to get started</p>
            <Button 
              onClick={() => setShowAddDialog(true)}
              className="bg-gradient-to-r from-cyan-500 to-purple-600"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Your First Domain
            </Button>
          </motion.div>
        ) : (
          <div className="grid gap-4">
            {domains.map((domain, index) => (
              <motion.div
                key={domain.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-xl p-6 hover:border-cyan-500/30 transition-colors"
                data-testid={`card-domain-${domain.id}`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500/20 to-purple-500/20 border border-white/10 flex items-center justify-center">
                      <Globe className="w-6 h-6 text-cyan-400" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-xl font-bold text-white">{domain.name}.{domain.tld}</h3>
                        <button 
                          onClick={() => copyToClipboard(`${domain.name}.${domain.tld}`)}
                          className="text-gray-400 hover:text-white transition-colors"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                        {domain.isPremium && (
                          <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30">Premium</Badge>
                        )}
                        {domain.isProtected && (
                          <Badge className="bg-red-500/20 text-red-400 border-red-500/30">Protected</Badge>
                        )}
                      </div>
                      <p className="text-gray-400 text-sm">
                        Owner: {domain.ownerAddress.slice(0, 8)}...{domain.ownerAddress.slice(-6)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Link href={`/domain-manager/${domain.id}`}>
                      <Button variant="outline" size="sm" className="border-white/10 hover:bg-white/5">
                        <Settings className="w-4 h-4 mr-2" />
                        Configure
                      </Button>
                    </Link>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => deleteDomainMutation.mutate(domain.id)}
                      className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                      data-testid={`button-delete-domain-${domain.id}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="bg-slate-900 border-white/10">
          <DialogHeader>
            <DialogTitle className="text-white">Add Owned Domain</DialogTitle>
            <DialogDescription>Add a domain you already own to manage it here.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label className="text-white">Domain Name</Label>
              <div className="flex gap-2">
                <Input
                  value={newDomain.name}
                  onChange={(e) => setNewDomain(prev => ({ ...prev, name: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '') }))}
                  placeholder="mydomain"
                  className="flex-1 bg-slate-800/50 border-white/10 text-white"
                  data-testid="input-new-domain-name"
                />
                <Select value={newDomain.tld} onValueChange={(v) => setNewDomain(prev => ({ ...prev, tld: v }))}>
                  <SelectTrigger className="w-32 bg-slate-800/50 border-white/10 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-900 border-white/10">
                    {SUPPORTED_TLDS.map(tld => (
                      <SelectItem key={tld.value} value={tld.value} className="text-white hover:bg-white/5">
                        {tld.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setShowAddDialog(false)} className="text-white">
              Cancel
            </Button>
            <Button 
              onClick={handleAddDomain}
              disabled={!newDomain.name.trim() || adding}
              className="bg-gradient-to-r from-cyan-500 to-purple-600"
              data-testid="button-confirm-add-domain"
            >
              {adding ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Plus className="w-4 h-4 mr-2" />}
              Add Domain
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default function OwnerDomains() {
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    const auth = sessionStorage.getItem("ownerAuth");
    if (auth === "true") {
      setAuthenticated(true);
    }
  }, []);

  if (!authenticated) {
    return <SecretEntry onSuccess={() => setAuthenticated(true)} />;
  }

  return <DomainManager />;
}
