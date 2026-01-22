import { useEffect, useState } from "react";
import { Link } from "wouter";
import { User, Wallet, Code, Key, Activity, LogOut, Settings, Copy, Check, Award, Shield, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import orbitLogo from "@assets/generated_images/futuristic_abstract_geometric_logo_symbol_for_orbit.png";
import { Footer } from "@/components/footer";
import { GlassCard } from "@/components/glass-card";
import { useAuth } from "@/hooks/use-auth";
import { PasskeyManager } from "@/components/passkey-manager";
import { WalletButton } from "@/components/wallet-button";
import { useWallet, shortenAddress } from "@/hooks/use-wallet";
import { TrustCard, TrustCardPlaceholder } from "@/components/trust-card";
import { ReferralCalculator } from "@/components/referral-calculator";

interface TrustCardData {
  trustNumber: string;
  displayName: string;
  memberType: "individual" | "business";
  memberTier: string;
  qrCodeSvg?: string;
  totalTransactions: number;
  rewardPoints: number;
  verifiedAt?: string;
  organizationName?: string;
}

export default function Dashboard() {
  const { user, isLoading, isAuthenticated } = useAuth();
  const { evmAddress, solanaAddress, isConnected: walletConnected } = useWallet();
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const activateMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/member/trust-card", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ memberType: "individual", memberTier: "pioneer" }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to create trust card");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["trust-card"] });
      toast({ title: "Welcome to the Trust Layer!", description: "Your Trust Card has been activated" });
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const { data: trustCard, isLoading: trustCardLoading} = useQuery<TrustCardData | null>({
    queryKey: ["trust-card", user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      const res = await fetch("/api/member/trust-card");
      if (!res.ok) {
        if (res.status === 404) return null;
        throw new Error("Failed to fetch trust card");
      }
      return res.json();
    },
    enabled: !!user?.id,
    staleTime: 60000,
  });

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      window.location.href = "/?login=true";
    }
  }, [isLoading, isAuthenticated]);

  const handleCopy = async (text: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-primary">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-background/90 backdrop-blur-xl">
        <div className="container mx-auto px-4 h-14 flex items-center">
          <Link href="/" className="flex items-center gap-2 mr-auto">
            <img src={orbitLogo} alt="DarkWave" className="w-7 h-7" />
            <span className="font-display font-bold text-lg tracking-tight">DarkWave</span>
          </Link>
          <div className="flex items-center gap-2 sm:gap-3">
            <WalletButton />
            <a href="/api/logout">
              <Button variant="ghost" size="sm" className="h-8 text-xs gap-1.5 hover:bg-white/5">
                <LogOut className="w-3 h-3" />
                Sign Out
              </Button>
            </a>
          </div>
        </div>
      </nav>

      <main className="flex-1 pt-20 pb-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="mb-8">
            <div className="flex items-center gap-4 mb-4">
              {user?.profileImageUrl ? (
                <img src={user.profileImageUrl} alt="" className="w-16 h-16 rounded-full border-2 border-primary/50" />
              ) : (
                <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
                  <User className="w-8 h-8 text-primary" />
                </div>
              )}
              <div>
                <h1 className="text-2xl md:text-3xl font-display font-bold">
                  Welcome, {user?.firstName || user?.email?.split('@')[0] || 'Developer'}
                </h1>
                <p className="text-sm text-muted-foreground">{user?.email || 'No email on file'}</p>
              </div>
            </div>
          </div>

          <GlassCard glow className="mb-6">
            <div className="p-4 sm:p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-purple-400" />
                  <h3 className="font-bold text-sm sm:text-base">Your Trust Card</h3>
                </div>
                {!trustCard && !trustCardLoading && (
                  <Link href="/trust-layer">
                    <Button size="sm" variant="outline" className="gap-1 border-purple-500/30 text-purple-400 hover:bg-purple-500/10">
                      <Sparkles className="w-3 h-3" />
                      Get Started
                    </Button>
                  </Link>
                )}
              </div>
              
              {trustCardLoading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-pulse text-muted-foreground">Loading trust card...</div>
                </div>
              ) : trustCard ? (
                <TrustCard
                  trustNumber={trustCard.trustNumber}
                  displayName={trustCard.displayName}
                  memberType={trustCard.memberType}
                  memberTier={trustCard.memberTier}
                  qrCodeSvg={trustCard.qrCodeSvg}
                  totalTransactions={trustCard.totalTransactions}
                  rewardPoints={trustCard.rewardPoints}
                  verifiedAt={trustCard.verifiedAt}
                  organizationName={trustCard.organizationName}
                />
              ) : (
                <TrustCardPlaceholder 
                  onActivate={() => activateMutation.mutate()} 
                  isActivating={activateMutation.isPending} 
                />
              )}
            </div>
          </GlassCard>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            <GlassCard glow>
              <div className="p-4 sm:p-5">
                <div className="flex items-center gap-2 mb-4">
                  <Wallet className="w-5 h-5 text-primary shrink-0" />
                  <h3 className="font-bold text-sm sm:text-base">Token Balance</h3>
                </div>
                {walletConnected ? (
                  <>
                    <div className="text-2xl sm:text-3xl font-bold text-white mb-2 tracking-tight">0 SIG</div>
                    <p className="text-xs text-muted-foreground mb-4">
                      {evmAddress && <span className="block">EVM: {shortenAddress(evmAddress)}</span>}
                      {solanaAddress && <span className="block">SOL: {shortenAddress(solanaAddress)}</span>}
                    </p>
                    <Link href="/faucet">
                      <Button size="sm" variant="outline" className="w-full border-primary/30 text-primary hover:bg-primary/10">
                        Get Testnet SIG
                      </Button>
                    </Link>
                  </>
                ) : (
                  <>
                    <div className="text-2xl sm:text-3xl font-bold text-white/30 mb-2 tracking-tight">-- SIG</div>
                    <p className="text-xs text-muted-foreground mb-4">Connect wallet to view balance</p>
                    <div className="[&>button]:w-full">
                      <WalletButton />
                    </div>
                  </>
                )}
              </div>
            </GlassCard>

            <GlassCard glow>
              <div className="p-4 sm:p-5">
                <div className="flex items-center gap-2 mb-4">
                  <Activity className="w-5 h-5 text-green-400 shrink-0" />
                  <h3 className="font-bold text-sm sm:text-base">Recent Activity</h3>
                </div>
                <div className="space-y-2">
                  <div className="text-xs text-muted-foreground py-2 text-center border border-dashed border-white/10 rounded-lg">
                    No recent transactions
                  </div>
                </div>
              </div>
            </GlassCard>

            <GlassCard glow className="sm:col-span-2">
              <div className="p-4 sm:p-5">
                <div className="flex items-center gap-2 mb-4">
                  <Code className="w-5 h-5 text-secondary shrink-0" />
                  <h3 className="font-bold text-sm sm:text-base">Developer Tools</h3>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
                  <Link href="/api-playground">
                    <div className="p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors cursor-pointer text-center">
                      <Activity className="w-5 h-5 mx-auto mb-2 text-green-400" />
                      <div className="text-xs font-medium">API Playground</div>
                    </div>
                  </Link>
                  <Link href="/doc-hub">
                    <div className="p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors cursor-pointer text-center">
                      <Code className="w-5 h-5 mx-auto mb-2 text-primary" />
                      <div className="text-xs font-medium">Documentation</div>
                    </div>
                  </Link>
                  <Link href="/explorer">
                    <div className="p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors cursor-pointer text-center">
                      <Activity className="w-5 h-5 mx-auto mb-2 text-cyan-400" />
                      <div className="text-xs font-medium">Explorer</div>
                    </div>
                  </Link>
                  <Link href="/treasury">
                    <div className="p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors cursor-pointer text-center">
                      <Wallet className="w-5 h-5 mx-auto mb-2 text-yellow-400" />
                      <div className="text-xs font-medium">Treasury</div>
                    </div>
                  </Link>
                </div>
              </div>
            </GlassCard>

            <PasskeyManager />

            <ReferralCalculator />

            <GlassCard glow className="sm:col-span-2 lg:col-span-2">
              <div className="p-4 sm:p-5">
                <div className="flex items-center gap-2 mb-4">
                  <Settings className="w-5 h-5 text-white/50 shrink-0" />
                  <h3 className="font-bold text-sm sm:text-base">Account</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 text-sm">
                  <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                    <span className="text-muted-foreground">User ID</span>
                    <button 
                      onClick={() => handleCopy(user?.id || '')}
                      className="flex items-center gap-1 text-xs text-primary hover:underline"
                    >
                      {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                      {user?.id?.slice(0, 8)}...
                    </button>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                    <span className="text-muted-foreground">Email</span>
                    <span className="text-xs">{user?.email || 'Not set'}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                    <span className="text-muted-foreground">Role</span>
                    <Badge variant="outline" className="text-[10px]">Developer</Badge>
                  </div>
                </div>
              </div>
            </GlassCard>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
