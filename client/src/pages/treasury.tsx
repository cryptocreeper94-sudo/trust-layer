import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Wallet, Send, RefreshCw, Copy, Check, AlertCircle, Coins, Code, Megaphone, TrendingUp, Users, Settings, Shield, PieChart, ArrowRightLeft, Sparkles, ExternalLink } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import orbitLogo from "@assets/generated_images/futuristic_abstract_geometric_logo_symbol_for_orbit.png";
import { Footer } from "@/components/footer";
import { usePageAnalytics } from "@/hooks/use-analytics";
import { GlassCard } from "@/components/glass-card";

interface TreasuryInfo {
  address: string;
  balance: string;
  balance_raw: string;
  total_supply: string;
}

interface DistributeResponse {
  success: boolean;
  tx_hash?: string;
  from: string;
  to: string;
  amount: string;
  new_treasury_balance: string;
}

interface AllocationCategory {
  category: string;
  percentage: number;
  label: string;
  description: string;
  color: string;
  icon: string;
}

const defaultAllocations: AllocationCategory[] = [
  { category: "development", percentage: 30, label: "Development", description: "Engineering, tools, infrastructure", color: "cyan", icon: "Code" },
  { category: "marketing", percentage: 20, label: "Marketing", description: "Advertising, community, partnerships", color: "purple", icon: "Megaphone" },
  { category: "staking_rewards", percentage: 20, label: "Staking Rewards", description: "APY for DWC stakers", color: "green", icon: "TrendingUp" },
  { category: "team_founder", percentage: 15, label: "Team & Founder", description: "Core team compensation", color: "amber", icon: "Users" },
  { category: "operations", percentage: 10, label: "Operations", description: "Legal, hosting, security", color: "blue", icon: "Settings" },
  { category: "reserve", percentage: 5, label: "Reserve", description: "Future opportunities", color: "pink", icon: "Shield" },
];

const protocolFees = [
  { source: "DEX Swaps", fee: "0.3%", icon: ArrowRightLeft, color: "cyan" },
  { source: "NFT Marketplace", fee: "2.5%", icon: Sparkles, color: "purple" },
  { source: "Bridge", fee: "0.1%", icon: ExternalLink, color: "pink" },
  { source: "Launchpad", fee: "Listing", icon: TrendingUp, color: "amber" },
];

function getIcon(iconName: string) {
  switch (iconName) {
    case "Code": return Code;
    case "Megaphone": return Megaphone;
    case "TrendingUp": return TrendingUp;
    case "Users": return Users;
    case "Settings": return Settings;
    case "Shield": return Shield;
    default: return Coins;
  }
}

function getColorClasses(color: string) {
  const colors: Record<string, { bg: string; text: string; border: string; glow: string }> = {
    cyan: { bg: "bg-cyan-500/20", text: "text-cyan-400", border: "border-cyan-500/30", glow: "shadow-cyan-500/20" },
    purple: { bg: "bg-purple-500/20", text: "text-purple-400", border: "border-purple-500/30", glow: "shadow-purple-500/20" },
    green: { bg: "bg-green-500/20", text: "text-green-400", border: "border-green-500/30", glow: "shadow-green-500/20" },
    amber: { bg: "bg-amber-500/20", text: "text-amber-400", border: "border-amber-500/30", glow: "shadow-amber-500/20" },
    blue: { bg: "bg-blue-500/20", text: "text-blue-400", border: "border-blue-500/30", glow: "shadow-blue-500/20" },
    pink: { bg: "bg-pink-500/20", text: "text-pink-400", border: "border-pink-500/30", glow: "shadow-pink-500/20" },
  };
  return colors[color] || colors.cyan;
}

async function fetchTreasuryInfo(): Promise<TreasuryInfo> {
  const response = await fetch("/api/blockchain/treasury");
  if (!response.ok) throw new Error("Failed to fetch treasury info");
  return response.json();
}

async function distributeTokens(data: { to: string; amount: string }): Promise<DistributeResponse> {
  const response = await fetch("/api/blockchain/treasury/distribute", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Distribution failed");
  }
  return response.json();
}

export default function Treasury() {
  usePageAnalytics();
  const [toAddress, setToAddress] = useState("");
  const [amount, setAmount] = useState("");
  const [copied, setCopied] = useState(false);
  const [lastTx, setLastTx] = useState<DistributeResponse | null>(null);
  const [showAdmin, setShowAdmin] = useState(false);
  
  const queryClient = useQueryClient();

  const { data: treasury, isLoading, error, refetch } = useQuery({
    queryKey: ["treasury-info"],
    queryFn: fetchTreasuryInfo,
    refetchInterval: 10000,
  });

  const distributeMutation = useMutation({
    mutationFn: distributeTokens,
    onSuccess: (data) => {
      setLastTx(data);
      setToAddress("");
      setAmount("");
      queryClient.invalidateQueries({ queryKey: ["treasury-info"] });
    },
  });

  const copyAddress = () => {
    if (treasury?.address) {
      navigator.clipboard.writeText(treasury.address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDistribute = (e: React.FormEvent) => {
    e.preventDefault();
    if (!toAddress || !amount) return;
    const amountInWei = BigInt(parseFloat(amount) * 1e18).toString();
    distributeMutation.mutate({ to: toAddress, amount: amountInWei });
  };

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden selection:bg-primary/20 selection:text-primary">
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-background/90 backdrop-blur-xl">
        <div className="container mx-auto px-4 h-14 flex items-center">
          <Link href="/" className="flex items-center gap-2 mr-auto">
            <img src={orbitLogo} alt="DarkWave" className="w-7 h-7" />
            <span className="font-display font-bold text-lg tracking-tight hidden sm:inline">DarkWave</span>
          </Link>
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="border-primary/50 text-primary bg-primary/10 text-[10px]">
              <PieChart className="w-3 h-3 mr-1" /> Transparency
            </Badge>
            <Link href="/">
              <Button variant="ghost" size="sm" className="h-8 text-xs gap-1.5 hover:bg-white/5">
                <ArrowLeft className="w-3 h-3" />
                <span className="hidden sm:inline">Back</span>
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      <main className="pt-20 pb-12 px-4">
        <div className="container mx-auto max-w-6xl space-y-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center space-y-4"
          >
            <Badge className="bg-gradient-to-r from-cyan-500/20 to-purple-500/20 text-white border-0">
              <Sparkles className="w-3 h-3 mr-1" /> Full Transparency
            </Badge>
            <h1 className="text-3xl md:text-5xl font-display font-bold">
              <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Treasury Transparency
              </span>
            </h1>
            <p className="text-sm md:text-base text-muted-foreground max-w-2xl mx-auto">
              See exactly how DarkWave funds are allocated. No hidden fees, no surprises. 
              0% buy/sell tax — sustainable revenue from protocol fees.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <GlassCard glow className="relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent to-purple-500/5" />
              <div className="p-6 md:p-8 relative">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                  <div>
                    <h2 className="text-xl font-display font-bold flex items-center gap-2">
                      <Wallet className="w-5 h-5 text-primary" />
                      Treasury Balance
                    </h2>
                    <p className="text-xs text-muted-foreground mt-1">Real-time on-chain balance</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => refetch()}
                    disabled={isLoading}
                    className="h-8 gap-2"
                    data-testid="button-refresh-treasury"
                  >
                    <RefreshCw className={`w-3 h-3 ${isLoading ? 'animate-spin' : ''}`} />
                    Refresh
                  </Button>
                </div>

                {error ? (
                  <div className="text-red-400 flex items-center gap-2 text-sm">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>Unable to connect to blockchain</span>
                  </div>
                ) : isLoading ? (
                  <div className="space-y-4 animate-pulse">
                    <div className="h-12 bg-white/10 rounded w-1/2" />
                    <div className="h-6 bg-white/10 rounded w-3/4" />
                  </div>
                ) : treasury ? (
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <div className="text-4xl md:text-5xl font-bold font-mono bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent" data-testid="text-treasury-balance">
                        {treasury.balance}
                      </div>
                      <div className="text-sm text-muted-foreground mt-2">
                        of {treasury.total_supply} total supply
                      </div>
                    </div>
                    <div className="flex flex-col justify-center">
                      <Label className="text-white/40 text-[10px] uppercase tracking-wider mb-2">Treasury Address</Label>
                      <div className="flex items-center gap-2">
                        <code className="flex-1 text-[11px] font-mono bg-black/30 px-3 py-2 rounded border border-white/10 truncate" data-testid="text-treasury-address">
                          {treasury.address}
                        </code>
                        <Button variant="ghost" size="sm" onClick={copyAddress} className="h-8 w-8 p-0 shrink-0" data-testid="button-copy-address">
                          {copied ? <Check className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3" />}
                        </Button>
                      </div>
                    </div>
                  </div>
                ) : null}
              </div>
            </GlassCard>
          </motion.div>

          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-display font-bold flex items-center gap-2">
                <PieChart className="w-5 h-5 text-secondary" />
                Treasury Allocation
              </h2>
              <Badge variant="outline" className="text-[10px]">Updated Dec 2026</Badge>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {defaultAllocations.map((alloc, i) => {
                const Icon = getIcon(alloc.icon);
                const colors = getColorClasses(alloc.color);
                return (
                  <motion.div
                    key={alloc.category}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 + i * 0.05 }}
                  >
                    <GlassCard 
                      hover 
                      className={`h-full border ${colors.border} hover:shadow-lg ${colors.glow} transition-all`}
                    >
                      <div className="p-4 md:p-5">
                        <div className="flex items-start justify-between mb-3">
                          <div className={`w-10 h-10 rounded-xl ${colors.bg} flex items-center justify-center`}>
                            <Icon className={`w-5 h-5 ${colors.text}`} />
                          </div>
                          <div className={`text-2xl md:text-3xl font-bold ${colors.text}`}>
                            {alloc.percentage}%
                          </div>
                        </div>
                        <h3 className="font-bold text-sm md:text-base text-white mb-1">{alloc.label}</h3>
                        <p className="text-[11px] md:text-xs text-muted-foreground leading-relaxed">
                          {alloc.description}
                        </p>
                      </div>
                    </GlassCard>
                  </motion.div>
                );
              })}
            </div>
          </motion.section>

          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="mb-6">
              <h2 className="text-xl font-display font-bold flex items-center gap-2 mb-2">
                <Coins className="w-5 h-5 text-green-400" />
                Revenue Sources
              </h2>
              <p className="text-sm text-muted-foreground">
                0% buy/sell tax. Sustainable revenue from protocol fees across the ecosystem.
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {protocolFees.map((fee, i) => {
                const colors = getColorClasses(fee.color);
                return (
                  <motion.div
                    key={fee.source}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.35 + i * 0.05 }}
                  >
                    <GlassCard hover className={`border ${colors.border}`}>
                      <div className="p-4 text-center">
                        <div className={`w-10 h-10 rounded-full ${colors.bg} flex items-center justify-center mx-auto mb-3`}>
                          <fee.icon className={`w-5 h-5 ${colors.text}`} />
                        </div>
                        <div className={`text-xl font-bold ${colors.text} mb-1`}>{fee.fee}</div>
                        <div className="text-xs text-muted-foreground">{fee.source}</div>
                      </div>
                    </GlassCard>
                  </motion.div>
                );
              })}
            </div>
          </motion.section>

          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <GlassCard className="relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-green-500/5 via-transparent to-cyan-500/5" />
              <div className="p-6 relative">
                <div className="flex flex-col md:flex-row md:items-center gap-4">
                  <div className="flex-1">
                    <h3 className="font-bold text-lg flex items-center gap-2 mb-2">
                      <Shield className="w-5 h-5 text-green-400" />
                      Our Commitment
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      DarkWave operates with full transparency. No hidden fees, no surprise taxes, no rug pulls. 
                      All treasury movements are recorded on-chain and visible to everyone. 
                      We build sustainable revenue through real ecosystem activity, not by taxing our community.
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Badge className="bg-green-500/20 text-green-400 border-green-500/30">0% Buy Tax</Badge>
                    <Badge className="bg-green-500/20 text-green-400 border-green-500/30">0% Sell Tax</Badge>
                  </div>
                </div>
              </div>
            </GlassCard>
          </motion.section>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-center"
          >
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowAdmin(!showAdmin)}
              className="text-xs text-muted-foreground hover:text-white"
            >
              {showAdmin ? "Hide Admin Tools" : "Admin Tools"}
            </Button>
          </motion.div>

          {showAdmin && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="grid gap-4 md:grid-cols-2"
            >
              <GlassCard>
                <div className="p-5">
                  <h2 className="text-sm font-bold flex items-center gap-2 mb-4">
                    <Send className="w-4 h-4 text-secondary" />
                    Distribute Tokens
                  </h2>

                  <form onSubmit={handleDistribute} className="space-y-4">
                    <div>
                      <Label htmlFor="toAddress" className="text-[11px] text-white/60">Recipient Address</Label>
                      <Input
                        id="toAddress"
                        placeholder="0x..."
                        value={toAddress}
                        onChange={(e) => setToAddress(e.target.value)}
                        className="mt-1 h-10 bg-black/30 border-white/10 text-xs font-mono"
                        data-testid="input-recipient-address"
                      />
                    </div>

                    <div>
                      <Label htmlFor="amount" className="text-[11px] text-white/60">Amount (DWC)</Label>
                      <Input
                        id="amount"
                        type="number"
                        placeholder="1000"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="mt-1 h-10 bg-black/30 border-white/10 text-xs"
                        data-testid="input-amount"
                      />
                    </div>

                    <Button
                      type="submit"
                      className="w-full h-10 bg-secondary text-black hover:bg-secondary/90 font-bold text-xs"
                      disabled={distributeMutation.isPending || !toAddress || !amount}
                      data-testid="button-distribute"
                    >
                      {distributeMutation.isPending ? (
                        <>
                          <RefreshCw className="w-3 h-3 mr-2 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <Send className="w-3 h-3 mr-2" />
                          Distribute Tokens
                        </>
                      )}
                    </Button>

                    {distributeMutation.isError && (
                      <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-xs text-red-400 flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        {distributeMutation.error.message}
                      </div>
                    )}
                  </form>
                </div>
              </GlassCard>

              {lastTx && (
                <GlassCard>
                  <div className="p-5">
                    <h3 className="text-sm font-bold text-green-400 mb-3 flex items-center gap-2">
                      <Check className="w-4 h-4" />
                      Transaction Successful
                    </h3>
                    <div className="space-y-3 text-xs">
                      <div className="flex justify-between">
                        <span className="text-white/40">To</span>
                        <span className="text-white font-mono">{lastTx.to.slice(0, 14)}...</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white/40">Amount</span>
                        <span className="text-white">{(BigInt(lastTx.amount) / BigInt(1e18)).toString()} DWC</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white/40">Tx Hash</span>
                        <span className="text-primary font-mono">{lastTx.tx_hash?.slice(0, 14)}...</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white/40">New Balance</span>
                        <span className="text-white">{lastTx.new_treasury_balance}</span>
                      </div>
                    </div>
                  </div>
                </GlassCard>
              )}
            </motion.div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
