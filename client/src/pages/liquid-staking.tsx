import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { 
  Droplets, ArrowLeft, Wallet, TrendingUp, Info, Loader2,
  ArrowRightLeft, Sparkles, ChevronDown, Clock, CheckCircle
} from "lucide-react";
import { Footer } from "@/components/footer";
import { GlassCard } from "@/components/glass-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import orbitLogo from "@assets/generated_images/futuristic_abstract_geometric_logo_symbol_for_orbit.png";

interface LiquidStakingState {
  totalDwtStaked: string;
  totalStDwtSupply: string;
  exchangeRate: string;
  apy: string;
  tvl: string;
}

interface LiquidStakingPosition {
  stakedDwt: string;
  stDwtBalance: string;
  withdrawableDwt: string;
  exchangeRate: string;
}

interface LiquidStakingEvent {
  id: string;
  eventType: string;
  dwtAmount: string;
  stDwtAmount: string;
  txHash: string;
  createdAt: string;
}

const formatAmount = (amount: string) => {
  try {
    const num = BigInt(amount);
    const divisor = BigInt("1000000000000000000");
    return (Number(num) / Number(divisor)).toLocaleString(undefined, { maximumFractionDigits: 4 });
  } catch {
    return "0";
  }
};

const convertToWei = (amount: string): string => {
  try {
    const num = parseFloat(amount);
    if (isNaN(num) || num <= 0) return "0";
    return (BigInt(Math.floor(num * 1e6)) * BigInt("1000000000000")).toString();
  } catch {
    return "0";
  }
};

export default function LiquidStaking() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [stakeAmount, setStakeAmount] = useState("");
  const [unstakeAmount, setUnstakeAmount] = useState("");
  const [historyOpen, setHistoryOpen] = useState(false);

  const { data: state } = useQuery<LiquidStakingState>({
    queryKey: ["/api/liquid-staking/state"],
  });

  const { data: position } = useQuery<LiquidStakingPosition>({
    queryKey: ["/api/liquid-staking/position"],
  });

  const { data: historyData } = useQuery<{ events: LiquidStakingEvent[] }>({
    queryKey: ["/api/liquid-staking/history"],
  });

  const stakeMutation = useMutation({
    mutationFn: async () => {
      const amount = convertToWei(stakeAmount);
      if (amount === "0") throw new Error("Enter a valid amount");
      const res = await apiRequest("POST", "/api/liquid-staking/stake", { amount });
      return res.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Staked Successfully!",
        description: `Received ${formatAmount(data.stDwtMinted)} stDWT`,
      });
      queryClient.invalidateQueries({ queryKey: ["/api/liquid-staking"] });
      setStakeAmount("");
    },
    onError: (error: any) => {
      toast({ title: "Stake Failed", description: error.message, variant: "destructive" });
    },
  });

  const unstakeMutation = useMutation({
    mutationFn: async () => {
      const stDwtAmount = convertToWei(unstakeAmount);
      if (stDwtAmount === "0") throw new Error("Enter a valid amount");
      const res = await apiRequest("POST", "/api/liquid-staking/unstake", { stDwtAmount });
      return res.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Unstaked Successfully!",
        description: `Received ${formatAmount(data.dwtReturned)} DWT`,
      });
      queryClient.invalidateQueries({ queryKey: ["/api/liquid-staking"] });
      setUnstakeAmount("");
    },
    onError: (error: any) => {
      toast({ title: "Unstake Failed", description: error.message, variant: "destructive" });
    },
  });

  return (
    <div className="min-h-screen flex flex-col bg-background overflow-x-hidden">
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-background/90 backdrop-blur-xl">
        <div className="container mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <img src={orbitLogo} alt="DarkWave" className="w-7 h-7" />
            <span className="font-display font-bold text-lg tracking-tight hidden sm:inline">DarkWave</span>
          </Link>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="border-cyan-500/50 text-cyan-400 text-[10px]">Liquid Staking</Badge>
            <Link href="/staking">
              <Button variant="ghost" size="sm" className="h-8 text-xs px-2 hover:bg-white/5" data-testid="button-back">
                <ArrowLeft className="w-3 h-3" />
                <span className="hidden sm:inline ml-1">Staking</span>
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
                  boxShadow: ["0 0 20px rgba(6,182,212,0.2)", "0 0 40px rgba(6,182,212,0.4)", "0 0 20px rgba(6,182,212,0.2)"]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Droplets className="w-5 h-5 text-cyan-400" />
              </motion.div>
              <h1 className="text-2xl md:text-3xl font-display font-bold" data-testid="text-title">
                Liquid Staking
              </h1>
            </div>
            <p className="text-xs text-muted-foreground">
              Stake DWT and receive stDWT - earn rewards while keeping liquidity
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-6"
          >
            <GlassCard glow>
              <div className="p-4 grid grid-cols-2 gap-4">
                <div className="text-center">
                  <p className="text-xs text-muted-foreground mb-1">Total Value Locked</p>
                  <p className="text-lg font-bold text-cyan-400" data-testid="text-tvl">
                    ${state?.tvl || "0"}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-muted-foreground mb-1">APY</p>
                  <p className="text-lg font-bold text-green-400" data-testid="text-apy">
                    {state?.apy || "12"}%
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-muted-foreground mb-1">Total Staked</p>
                  <p className="text-sm font-semibold" data-testid="text-total-staked">
                    {formatAmount(state?.totalDwtStaked || "0")} DWT
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-muted-foreground mb-1">Exchange Rate</p>
                  <p className="text-sm font-semibold" data-testid="text-exchange-rate">
                    1 stDWT = {(Number(state?.exchangeRate || "1000000000000000000") / 1e18).toFixed(4)} DWT
                  </p>
                </div>
              </div>
            </GlassCard>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-6"
          >
            <GlassCard>
              <div className="p-4">
                <div className="flex items-center gap-2 mb-4">
                  <Wallet className="w-4 h-4 text-cyan-400" />
                  <span className="text-sm font-medium">Your Position</span>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground">stDWT Balance</p>
                    <p className="text-lg font-bold" data-testid="text-stdwt-balance">
                      {formatAmount(position?.stDwtBalance || "0")}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Withdrawable DWT</p>
                    <p className="text-lg font-bold text-green-400" data-testid="text-withdrawable">
                      {formatAmount(position?.withdrawableDwt || "0")}
                    </p>
                  </div>
                </div>
              </div>
            </GlassCard>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-6"
          >
            <GlassCard glow>
              <Tabs defaultValue="stake" className="p-4">
                <TabsList className="w-full mb-4 bg-white/5">
                  <TabsTrigger value="stake" className="flex-1" data-testid="tab-stake">Stake</TabsTrigger>
                  <TabsTrigger value="unstake" className="flex-1" data-testid="tab-unstake">Unstake</TabsTrigger>
                </TabsList>

                <TabsContent value="stake" className="space-y-4">
                  <div>
                    <label className="text-xs text-muted-foreground mb-2 block">Amount to Stake (DWT)</label>
                    <Input
                      type="number"
                      placeholder="0.0"
                      value={stakeAmount}
                      onChange={(e) => setStakeAmount(e.target.value)}
                      className="bg-white/5 border-white/10"
                      data-testid="input-stake-amount"
                    />
                  </div>
                  {stakeAmount && parseFloat(stakeAmount) > 0 && (
                    <div className="p-3 rounded-lg bg-cyan-500/10 border border-cyan-500/20">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">You will receive</span>
                        <span className="text-cyan-400 font-medium">
                          ~{(parseFloat(stakeAmount) * 1e18 / Number(state?.exchangeRate || 1e18)).toFixed(4)} stDWT
                        </span>
                      </div>
                    </div>
                  )}
                  <Button
                    className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500"
                    onClick={() => stakeMutation.mutate()}
                    disabled={stakeMutation.isPending || !stakeAmount}
                    data-testid="button-stake"
                  >
                    {stakeMutation.isPending ? (
                      <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Staking...</>
                    ) : (
                      <><Sparkles className="w-4 h-4 mr-2" /> Stake DWT</>
                    )}
                  </Button>
                </TabsContent>

                <TabsContent value="unstake" className="space-y-4">
                  <div>
                    <label className="text-xs text-muted-foreground mb-2 block">Amount to Unstake (stDWT)</label>
                    <Input
                      type="number"
                      placeholder="0.0"
                      value={unstakeAmount}
                      onChange={(e) => setUnstakeAmount(e.target.value)}
                      className="bg-white/5 border-white/10"
                      data-testid="input-unstake-amount"
                    />
                  </div>
                  {unstakeAmount && parseFloat(unstakeAmount) > 0 && (
                    <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/20">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">You will receive</span>
                        <span className="text-green-400 font-medium">
                          ~{(parseFloat(unstakeAmount) * Number(state?.exchangeRate || 1e18) / 1e18).toFixed(4)} DWT
                        </span>
                      </div>
                    </div>
                  )}
                  <Button
                    className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500"
                    onClick={() => unstakeMutation.mutate()}
                    disabled={unstakeMutation.isPending || !unstakeAmount}
                    data-testid="button-unstake"
                  >
                    {unstakeMutation.isPending ? (
                      <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Unstaking...</>
                    ) : (
                      <><ArrowRightLeft className="w-4 h-4 mr-2" /> Unstake stDWT</>
                    )}
                  </Button>
                </TabsContent>
              </Tabs>
            </GlassCard>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mb-6"
          >
            <GlassCard>
              <div className="p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Info className="w-4 h-4 text-cyan-400" />
                  <span className="text-sm font-medium">How it works</span>
                </div>
                <div className="space-y-2 text-xs text-muted-foreground">
                  <p>1. Stake DWT to receive stDWT tokens</p>
                  <p>2. stDWT represents your share of the staking pool</p>
                  <p>3. As rewards accrue, the exchange rate increases</p>
                  <p>4. Unstake anytime - no lock period required</p>
                  <p>5. Use stDWT in DeFi while earning rewards</p>
                </div>
              </div>
            </GlassCard>
          </motion.div>

          <Collapsible open={historyOpen} onOpenChange={setHistoryOpen}>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" className="w-full justify-between mb-2 text-muted-foreground" data-testid="button-history-toggle">
                <span className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Transaction History
                </span>
                <ChevronDown className={`w-4 h-4 transition-transform ${historyOpen ? "rotate-180" : ""}`} />
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <GlassCard>
                <div className="p-4 space-y-2 max-h-64 overflow-y-auto">
                  {historyData?.events?.length ? (
                    historyData.events.map((event) => (
                      <div key={event.id} className="flex items-center justify-between p-2 rounded bg-white/5">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-400" />
                          <div>
                            <p className="text-xs font-medium capitalize">{event.eventType}</p>
                            <p className="text-[10px] text-muted-foreground">
                              {new Date(event.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-xs">{formatAmount(event.dwtAmount)} DWT</p>
                          <p className="text-[10px] text-muted-foreground">{formatAmount(event.stDwtAmount)} stDWT</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-muted-foreground text-center py-4">No transactions yet</p>
                  )}
                </div>
              </GlassCard>
            </CollapsibleContent>
          </Collapsible>
        </div>
      </main>

      <Footer />
    </div>
  );
}
