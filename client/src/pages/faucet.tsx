import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { 
  Droplets, Home, Wallet, CheckCircle, Clock, AlertCircle,
  Sparkles, Zap, Copy, ExternalLink, Loader2, ChevronDown
} from "lucide-react";
import { BackButton } from "@/components/page-nav";
import { Footer } from "@/components/footer";
import { GlassCard } from "@/components/glass-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import orbitLogo from "@assets/generated_images/futuristic_abstract_geometric_logo_symbol_for_orbit.png";
import { WalletButton } from "@/components/wallet-button";

interface FaucetInfo {
  dailyLimit: string;
  claimAmount: string;
  totalDistributed: string;
  claimsToday: number;
  remainingToday: string;
}

interface FaucetClaim {
  id: string;
  walletAddress: string;
  amount: string;
  status: string;
  txHash?: string;
  claimedAt: string;
}

export default function Faucet() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [walletAddress, setWalletAddress] = useState("");
  const [historyOpen, setHistoryOpen] = useState(false);

  const { data: faucetInfo, isLoading: infoLoading } = useQuery<FaucetInfo>({
    queryKey: ["/api/faucet/info"],
  });

  const { data: claimsData } = useQuery<{ claims: FaucetClaim[] }>({
    queryKey: ["/api/faucet/claims"],
    refetchInterval: 10000,
  });

  const claimMutation = useMutation({
    mutationFn: async () => {
      if (!walletAddress || walletAddress.length < 10) {
        throw new Error("Please enter a valid wallet address");
      }
      const res = await apiRequest("POST", "/api/faucet/claim", {
        walletAddress,
      });
      return res.json();
    },
    onSuccess: (data: any) => {
      toast({
        title: "Tokens Sent!",
        description: `${formatAmount(data.amount)} DWC sent to your wallet`,
      });
      queryClient.invalidateQueries({ queryKey: ["/api/faucet/info"] });
      queryClient.invalidateQueries({ queryKey: ["/api/faucet/claims"] });
      setWalletAddress("");
    },
    onError: (error: any) => {
      toast({
        title: "Claim Failed",
        description: error.message || "Failed to claim tokens",
        variant: "destructive",
      });
    },
  });

  const formatAmount = (amount: string) => {
    try {
      const num = BigInt(amount);
      const divisor = BigInt("1000000000000000000");
      return Number(num / divisor).toLocaleString();
    } catch {
      return "0";
    }
  };

  const copyAddress = (addr: string) => {
    navigator.clipboard.writeText(addr);
    toast({ title: "Copied!", description: "Address copied to clipboard" });
  };

  return (
    <div className="min-h-screen flex flex-col bg-background overflow-x-hidden">
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-background/90 backdrop-blur-xl">
        <div className="container mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <img src={orbitLogo} alt="DarkWave" className="w-7 h-7" />
            <span className="font-display font-bold text-lg tracking-tight hidden sm:inline">DarkWave</span>
          </Link>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="border-green-500/50 text-green-400 text-[10px]">Testnet</Badge>
            <BackButton />
            <Link href="/">
              <Button variant="ghost" size="sm" className="h-8 text-xs px-2 hover:bg-white/5">
                <Home className="w-3 h-3" />
                <span className="hidden sm:inline ml-1">Home</span>
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      <main className="flex-1 pt-16 pb-8 px-4">
        <div className="container mx-auto max-w-lg">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-6"
          >
            <div className="flex items-center justify-center gap-2 mb-3">
              <motion.div 
                className="p-2 rounded-xl bg-cyan-500/20 border border-cyan-500/30"
                animate={{ 
                  boxShadow: ["0 0 20px rgba(0,255,255,0.2)", "0 0 40px rgba(0,255,255,0.4)", "0 0 20px rgba(0,255,255,0.2)"]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Droplets className="w-5 h-5 text-cyan-400" />
              </motion.div>
              <h1 className="text-2xl md:text-3xl font-display font-bold">
                Testnet Faucet
              </h1>
            </div>
            <p className="text-xs text-muted-foreground">
              Get free test DWC to build and experiment on DarkWave Smart Chain
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-3 gap-2 mb-6"
          >
            <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-center">
              <div className="text-lg font-bold text-primary">
                {infoLoading ? "..." : formatAmount(faucetInfo?.claimAmount || "0")}
              </div>
              <div className="text-[10px] text-muted-foreground">DWC per claim</div>
            </div>
            <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-center">
              <div className="text-lg font-bold text-green-400">
                {infoLoading ? "..." : faucetInfo?.claimsToday || 0}
              </div>
              <div className="text-[10px] text-muted-foreground">Claims today</div>
            </div>
            <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-center">
              <div className="text-lg font-bold text-amber-400">
                {infoLoading ? "..." : formatAmount(faucetInfo?.totalDistributed || "0")}
              </div>
              <div className="text-[10px] text-muted-foreground">Total given</div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-4"
          >
            <GlassCard glow>
              <div className="p-4">
                <div className="flex items-center gap-2 mb-4">
                  <div className="p-2 rounded-lg bg-cyan-500/20">
                    <Wallet className="w-4 h-4 text-cyan-400" />
                  </div>
                  <div>
                    <h2 className="font-bold text-sm">Claim Test Tokens</h2>
                    <p className="text-[10px] text-muted-foreground">1 claim per address per 24 hours</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1.5 block">
                      Your Wallet Address
                    </Label>
                    <Input
                      value={walletAddress}
                      onChange={(e) => setWalletAddress(e.target.value)}
                      placeholder="0x..."
                      data-testid="input-wallet-address"
                      className="bg-white/5 border-white/10 h-11 text-sm font-mono"
                    />
                  </div>

                  <div className="p-3 rounded-lg bg-cyan-500/10 border border-cyan-500/20">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">You will receive:</span>
                      <span className="font-bold text-cyan-400">
                        {formatAmount(faucetInfo?.claimAmount || "1000000000000000000000")} DWC
                      </span>
                    </div>
                  </div>

                  <Button
                    className="w-full h-11 text-sm font-bold bg-gradient-to-r from-cyan-500 to-primary text-black"
                    onClick={() => claimMutation.mutate()}
                    disabled={claimMutation.isPending || !walletAddress}
                    data-testid="button-claim"
                  >
                    {claimMutation.isPending ? (
                      <span className="flex items-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Sending...
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <Droplets className="w-4 h-4" />
                        Get Free DWC
                        <Sparkles className="w-4 h-4" />
                      </span>
                    )}
                  </Button>
                </div>
              </div>
            </GlassCard>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-4"
          >
            <Collapsible open={historyOpen} onOpenChange={setHistoryOpen}>
              <GlassCard glow>
                <CollapsibleTrigger className="w-full p-3 flex items-center justify-between hover:bg-white/5 rounded-xl transition-colors">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-primary" />
                    <span className="font-bold text-sm">Recent Claims</span>
                    <Badge variant="secondary" className="text-[10px] ml-1">
                      {claimsData?.claims?.length || 0}
                    </Badge>
                  </div>
                  <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${historyOpen ? "rotate-180" : ""}`} />
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className="px-3 pb-3 pt-1 border-t border-white/5 mt-1">
                    {!claimsData?.claims?.length ? (
                      <div className="text-center py-6">
                        <Droplets className="w-8 h-8 text-white/20 mx-auto mb-2" />
                        <p className="text-xs text-muted-foreground">No claims yet</p>
                      </div>
                    ) : (
                      <div className="space-y-2 max-h-48 overflow-y-auto">
                        {claimsData.claims.slice(0, 10).map((claim) => (
                          <div
                            key={claim.id}
                            className="flex items-center justify-between p-2 bg-white/5 rounded-lg text-xs"
                            data-testid={`claim-${claim.id}`}
                          >
                            <div className="flex items-center gap-2 min-w-0">
                              <div className={`p-1.5 rounded ${
                                claim.status === "completed" ? "bg-green-500/20" : "bg-amber-500/20"
                              }`}>
                                {claim.status === "completed" ? (
                                  <CheckCircle className="w-3 h-3 text-green-400" />
                                ) : (
                                  <Clock className="w-3 h-3 text-amber-400 animate-pulse" />
                                )}
                              </div>
                              <div className="min-w-0">
                                <div className="font-mono text-[10px] truncate max-w-[120px]">
                                  {claim.walletAddress.slice(0, 10)}...
                                </div>
                                <div className="text-[10px] text-muted-foreground">
                                  {formatAmount(claim.amount)} DWC
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-1">
                              <button 
                                onClick={() => copyAddress(claim.walletAddress)}
                                className="p-1 hover:bg-white/10 rounded"
                              >
                                <Copy className="w-3 h-3 text-muted-foreground" />
                              </button>
                              <Badge 
                                variant="outline" 
                                className={`text-[9px] ${
                                  claim.status === "completed" ? "border-green-500/50 text-green-400" :
                                  "border-amber-500/50 text-amber-400"
                                }`}
                              >
                                {claim.status}
                              </Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </CollapsibleContent>
              </GlassCard>
            </Collapsible>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="space-y-3"
          >
            <div className="p-3 rounded-xl bg-white/5 border border-white/10">
              <h3 className="font-bold text-xs mb-2 flex items-center gap-1.5">
                <Zap className="w-3 h-3 text-primary" />
                How it works
              </h3>
              <ul className="text-[10px] text-muted-foreground space-y-1">
                <li>1. Enter your DarkWave wallet address above</li>
                <li>2. Click "Get Free DWC" to receive test tokens</li>
                <li>3. Use tokens to test staking, bridging, or dApps</li>
                <li>4. Come back in 24 hours for more</li>
              </ul>
            </div>

            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <p className="text-[10px] text-amber-200">
                  <strong className="text-amber-300">Testnet Only:</strong> These tokens have no real value and are for development purposes only.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
