import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Search, Globe, Shield, Zap, Check, X, ArrowRight, Crown, Clock, Users, Sparkles, ExternalLink, Copy, Wallet, Infinity } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Footer } from "@/components/footer";
import { usePageAnalytics } from "@/hooks/use-analytics";
import { GlassCard } from "@/components/glass-card";
import { apiRequest } from "@/lib/queryClient";
import { WalletButton } from "@/components/wallet-button";
import { useWallet } from "@/hooks/use-wallet";
import { toast } from "sonner";

interface DomainSearchResult {
  available: boolean;
  name: string;
  tld: string;
  pricePerYearCents: number;
  priceLifetimeCents: number;
  isPremium: boolean;
  tier: string;
  domain?: BlockchainDomain;
}

interface BlockchainDomain {
  id: string;
  name: string;
  tld: string;
  ownerAddress: string;
  registeredAt: string;
  expiresAt: string | null;
  ownershipType: "term" | "lifetime";
  isPremium: boolean;
  primaryWallet?: string;
  description?: string;
  website?: string;
}

interface DomainStats {
  totalDomains: number;
  totalOwners: number;
  premiumCount: number;
}

function formatPrice(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

const pricingTiers = [
  { chars: "3 or less", yearly: "$100/year", lifetime: "$1,200", tag: "Ultra Premium", gradient: "from-amber-500 via-yellow-400 to-amber-600" },
  { chars: "4 characters", yearly: "$50/year", lifetime: "$600", tag: "Premium", gradient: "from-purple-500 to-violet-600" },
  { chars: "5 characters", yearly: "$20/year", lifetime: "$240", tag: "Standard+", gradient: "from-blue-500 to-indigo-600" },
  { chars: "6+ characters", yearly: "$5/year", lifetime: "$60", tag: "Standard", gradient: "from-cyan-500 to-teal-600" },
];

function FloatingParticle({ delay, duration, x }: { delay: number; duration: number; x: number }) {
  return (
    <motion.div
      className="absolute w-1 h-1 rounded-full bg-primary/40"
      style={{ left: `${x}%`, bottom: 0 }}
      animate={{
        y: [0, -400],
        opacity: [0, 1, 0],
        scale: [0.5, 1, 0.5],
      }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        ease: "easeOut",
      }}
    />
  );
}

export default function DomainsPage() {
  usePageAnalytics();
  const queryClient = useQueryClient();
  const { evmAddress, solanaAddress, isConnected } = useWallet();
  const walletAddress = evmAddress || solanaAddress;
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResult, setSearchResult] = useState<DomainSearchResult | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [showRegisterDialog, setShowRegisterDialog] = useState(false);
  const [selectedYears, setSelectedYears] = useState(1);
  const [ownershipType, setOwnershipType] = useState<"term" | "lifetime">("term");

  const { data: stats } = useQuery<DomainStats>({
    queryKey: ["/api/domains/stats"],
  });

  const { data: recentDomains } = useQuery<BlockchainDomain[]>({
    queryKey: ["/api/domains/recent"],
  });

  const { data: myDomains } = useQuery<BlockchainDomain[]>({
    queryKey: ["/api/domains/owner", walletAddress],
    enabled: !!walletAddress,
  });

  const registerMutation = useMutation({
    mutationFn: async (data: { name: string; ownerAddress: string; ownershipType: "term" | "lifetime"; years?: number }) => {
      const res = await apiRequest("POST", "/api/domains/register", data);
      return res.json();
    },
    onSuccess: () => {
      toast.success("Domain registered successfully!");
      setShowRegisterDialog(false);
      setSearchResult(null);
      setSearchQuery("");
      setOwnershipType("term");
      queryClient.invalidateQueries({ queryKey: ["/api/domains/stats"] });
      queryClient.invalidateQueries({ queryKey: ["/api/domains/recent"] });
      queryClient.invalidateQueries({ queryKey: ["/api/domains/owner", walletAddress] });
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to register domain");
    },
  });

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    try {
      const normalizedName = searchQuery.toLowerCase().replace(/\.dwsc$/, "").trim();
      const res = await fetch(`/api/domains/search/${encodeURIComponent(normalizedName)}`);
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || `Search failed with status ${res.status}`);
      }
      const result = await res.json();
      setSearchResult(result);
    } catch (error: any) {
      toast.error(error.message || "Failed to search domain");
    } finally {
      setIsSearching(false);
    }
  };

  const handleRegister = () => {
    if (!walletAddress || !searchResult) return;
    
    registerMutation.mutate({
      name: searchResult.name,
      ownerAddress: walletAddress,
      ownershipType,
      years: ownershipType === "term" ? selectedYears : undefined,
    });
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard");
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gray-900 via-slate-900 to-black text-white">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <FloatingParticle
            key={i}
            delay={i * 0.3}
            duration={4 + Math.random() * 3}
            x={Math.random() * 100}
          />
        ))}
      </div>

      <header className="relative z-10 border-b border-white/10 backdrop-blur-xl bg-black/20">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/">
            <Button variant="ghost" size="sm" className="gap-2 text-white/70 hover:text-white">
              <ArrowLeft className="w-4 h-4" />
              Back to Portal
            </Button>
          </Link>
          <div className="flex items-center gap-3">
            <WalletButton />
          </div>
        </div>
      </header>

      <main className="relative z-10 container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border border-cyan-500/30 mb-6">
            <Globe className="w-4 h-4 text-cyan-400" />
            <span className="text-sm font-medium bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
              Blockchain Domain Service
            </span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Your Identity on DWSC
            </span>
          </h1>
          <p className="text-lg text-white/60 max-w-2xl mx-auto mb-8">
            Claim your unique .dwsc domain name. Link wallets, websites, and social profiles to a single memorable address.
          </p>

          <div className="max-w-xl mx-auto relative" data-testid="domain-search-container">
            <div className="relative">
              <Input
                type="text"
                placeholder="Search for your domain..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                className="w-full h-14 pl-5 pr-32 text-lg bg-white/5 border-white/20 rounded-2xl focus:border-cyan-500/50"
                data-testid="input-domain-search"
              />
              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-2">
                <Badge variant="outline" className="border-cyan-500/30 text-cyan-400">
                  .dwsc
                </Badge>
                <Button
                  onClick={handleSearch}
                  disabled={isSearching || !searchQuery.trim()}
                  className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600"
                  data-testid="button-search-domain"
                >
                  {isSearching ? (
                    <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity }}>
                      <Search className="w-4 h-4" />
                    </motion.div>
                  ) : (
                    <Search className="w-4 h-4" />
                  )}
                </Button>
              </div>
            </div>
          </div>
        </motion.div>

        <AnimatePresence>
          {searchResult && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-xl mx-auto mb-12"
            >
              <GlassCard className={`p-6 ${searchResult.available ? "border-emerald-500/50" : "border-red-500/50"}`}>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${searchResult.available ? "bg-emerald-500/20" : "bg-red-500/20"}`}>
                      {searchResult.available ? (
                        <Check className="w-5 h-5 text-emerald-400" />
                      ) : (
                        <X className="w-5 h-5 text-red-400" />
                      )}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white">
                        {searchResult.name}.{searchResult.tld}
                      </h3>
                      <p className={`text-sm ${searchResult.available ? "text-emerald-400" : "text-red-400"}`}>
                        {searchResult.available ? "Available" : "Taken"}
                      </p>
                    </div>
                  </div>
                  {searchResult.isPremium && (
                    <Badge className="bg-gradient-to-r from-amber-500 to-yellow-500 text-black">
                      <Crown className="w-3 h-3 mr-1" /> Premium
                    </Badge>
                  )}
                </div>

                {searchResult.available ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-3 rounded-lg bg-white/5 text-center">
                        <p className="text-xs text-white/60 mb-1">Yearly Rental</p>
                        <p className="text-lg font-bold text-white">
                          {formatPrice(searchResult.pricePerYearCents)}/yr
                        </p>
                      </div>
                      <div className="p-3 rounded-lg bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border border-cyan-500/30 text-center">
                        <p className="text-xs text-cyan-400 mb-1 flex items-center justify-center gap-1">
                          <Infinity className="w-3 h-3" /> Own Forever
                        </p>
                        <p className="text-lg font-bold text-cyan-400">
                          {formatPrice(searchResult.priceLifetimeCents)}
                        </p>
                      </div>
                    </div>
                    <p className="text-xs text-center text-white/40">
                      {searchResult.tier} tier domain
                    </p>
                    <Button
                      onClick={() => setShowRegisterDialog(true)}
                      disabled={!isConnected}
                      className="w-full bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600"
                      data-testid="button-register-domain"
                    >
                      {isConnected ? "Register Now" : "Connect Wallet to Register"}
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="p-3 rounded-lg bg-white/5">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-white/60">Owner</span>
                        <button
                          onClick={() => copyToClipboard(searchResult.domain?.ownerAddress || "")}
                          className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
                        >
                          <span className="font-mono text-sm">
                            {searchResult.domain?.ownerAddress?.slice(0, 6)}...{searchResult.domain?.ownerAddress?.slice(-4)}
                          </span>
                          <Copy className="w-3 h-3" />
                        </button>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-white/60">Ownership</span>
                        <span className="text-white flex items-center gap-1">
                          {searchResult.domain?.ownershipType === "lifetime" ? (
                            <>
                              <Infinity className="w-4 h-4 text-cyan-400" />
                              <span className="text-cyan-400">Forever</span>
                            </>
                          ) : (
                            <>Expires {searchResult.domain?.expiresAt && formatDate(searchResult.domain.expiresAt)}</>
                          )}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </GlassCard>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12"
        >
          {pricingTiers.map((tier, idx) => (
            <GlassCard key={idx} className="p-4 text-center">
              <Badge className={`mb-2 bg-gradient-to-r ${tier.gradient} text-white`}>
                {tier.tag}
              </Badge>
              <p className="text-white/60 text-sm mb-2">{tier.chars}</p>
              <div className="space-y-1">
                <p className="text-lg font-bold text-white">{tier.yearly}</p>
                <p className="text-sm text-cyan-400 flex items-center justify-center gap-1">
                  <Infinity className="w-3 h-3" /> {tier.lifetime}
                </p>
              </div>
            </GlassCard>
          ))}
        </motion.div>

        {stats && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
          >
            <GlassCard className="p-6 text-center">
              <Globe className="w-8 h-8 text-cyan-400 mx-auto mb-2" />
              <p className="text-3xl font-bold text-white">{stats.totalDomains.toLocaleString()}</p>
              <p className="text-white/60">Domains Registered</p>
            </GlassCard>
            <GlassCard className="p-6 text-center">
              <Users className="w-8 h-8 text-purple-400 mx-auto mb-2" />
              <p className="text-3xl font-bold text-white">{stats.totalOwners.toLocaleString()}</p>
              <p className="text-white/60">Unique Owners</p>
            </GlassCard>
            <GlassCard className="p-6 text-center">
              <Crown className="w-8 h-8 text-amber-400 mx-auto mb-2" />
              <p className="text-3xl font-bold text-white">{stats.premiumCount.toLocaleString()}</p>
              <p className="text-white/60">Premium Domains</p>
            </GlassCard>
          </motion.div>
        )}

        {myDomains && myDomains.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-12"
          >
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              <Wallet className="w-6 h-6 text-cyan-400" />
              My Domains
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {myDomains.map((domain) => (
                <GlassCard key={domain.id} className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-bold text-white">
                      {domain.name}.{domain.tld}
                    </h3>
                    {domain.isPremium && (
                      <Badge className="bg-gradient-to-r from-amber-500 to-yellow-500 text-black">
                        <Crown className="w-3 h-3" />
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-white/60 mb-3">
                    {domain.ownershipType === "lifetime" ? (
                      <>
                        <Infinity className="w-4 h-4 text-cyan-400" />
                        <span className="text-cyan-400">Owned Forever</span>
                      </>
                    ) : (
                      <>
                        <Clock className="w-4 h-4" />
                        <span>Expires {domain.expiresAt && formatDate(domain.expiresAt)}</span>
                      </>
                    )}
                  </div>
                  <Link href={`/domain/${domain.name}`}>
                    <Button variant="outline" size="sm" className="w-full" data-testid={`button-manage-domain-${domain.id}`}>
                      Manage Domain
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                </GlassCard>
              ))}
            </div>
          </motion.div>
        )}

        {recentDomains && recentDomains.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-purple-400" />
              Recently Registered
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {recentDomains.slice(0, 8).map((domain) => (
                <GlassCard key={domain.id} className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-white">
                        {domain.name}.{domain.tld}
                      </h3>
                      <p className="text-sm text-white/60">
                        {formatDate(domain.registeredAt)}
                      </p>
                    </div>
                    {domain.isPremium && (
                      <Crown className="w-5 h-5 text-amber-400" />
                    )}
                  </div>
                </GlassCard>
              ))}
            </div>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-16"
        >
          <h2 className="text-2xl font-bold text-white mb-6 text-center">
            Why .dwsc Domains?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <GlassCard className="p-6">
              <Shield className="w-10 h-10 text-cyan-400 mb-4" />
              <h3 className="text-lg font-bold text-white mb-2">Blockchain Verified</h3>
              <p className="text-white/60">
                Every domain is secured on the DarkWave Smart Chain with tamper-proof ownership records.
              </p>
            </GlassCard>
            <GlassCard className="p-6">
              <Globe className="w-10 h-10 text-purple-400 mb-4" />
              <h3 className="text-lg font-bold text-white mb-2">Universal Identity</h3>
              <p className="text-white/60">
                Link multiple wallets, websites, and social profiles to a single memorable name.
              </p>
            </GlassCard>
            <GlassCard className="p-6">
              <Zap className="w-10 h-10 text-pink-400 mb-4" />
              <h3 className="text-lg font-bold text-white mb-2">Instant Transfers</h3>
              <p className="text-white/60">
                Send and receive tokens using human-readable names instead of complex addresses.
              </p>
            </GlassCard>
          </div>
        </motion.div>
      </main>

      <Dialog open={showRegisterDialog} onOpenChange={setShowRegisterDialog}>
        <DialogContent className="bg-slate-900 border-white/10 text-white">
          <DialogHeader>
            <DialogTitle className="text-xl">Register Domain</DialogTitle>
            <DialogDescription className="text-white/60">
              Complete your domain registration
            </DialogDescription>
          </DialogHeader>
          
          {searchResult && (
            <div className="space-y-4 py-4">
              <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white/60">Domain</span>
                  <span className="text-lg font-bold text-white">
                    {searchResult.name}.{searchResult.tld}
                  </span>
                </div>
              </div>

              <div>
                <label className="text-sm text-white/60 mb-2 block">Registration Period</label>
                <div className="flex gap-2">
                  {[1, 2, 5].map((years) => (
                    <Button
                      key={years}
                      variant={selectedYears === years ? "default" : "outline"}
                      onClick={() => setSelectedYears(years)}
                      className={selectedYears === years ? "bg-cyan-500 hover:bg-cyan-600" : ""}
                      data-testid={`button-years-${years}`}
                    >
                      {years} {years === 1 ? "year" : "years"}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white/60">Price per year</span>
                  <span className="text-white">{formatPrice(searchResult.pricePerYearCents)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white/60">Total</span>
                  <span className="text-xl font-bold text-cyan-400">
                    {formatPrice(searchResult.pricePerYearCents * selectedYears)}
                  </span>
                </div>
              </div>

              <Button
                onClick={handleRegister}
                disabled={registerMutation.isPending}
                className="w-full bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600"
                data-testid="button-confirm-register"
              >
                {registerMutation.isPending ? "Registering..." : "Confirm Registration"}
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
}
