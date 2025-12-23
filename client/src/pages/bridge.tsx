import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { ArrowRight, ArrowLeftRight, ArrowLeft, AlertTriangle, CheckCircle, Clock, Loader2 } from "lucide-react";
import { Footer } from "@/components/footer";
import { GlassCard } from "@/components/glass-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import orbitLogo from "@assets/generated_images/futuristic_abstract_geometric_logo_symbol_for_orbit.png";

interface BridgeInfo {
  custodyAddress: string;
  supportedChains: { id: string; name: string; network: string; status: string }[];
  phase: string;
  status: string;
  operator: string;
  custodyBalance: string;
  disclaimer: string;
}

interface BridgeTransfer {
  id: string;
  type: "lock" | "mint" | "burn" | "release";
  amount: string;
  status: string;
  targetChain?: string;
  fromAddress?: string;
  toAddress?: string;
  txHash?: string;
  createdAt: string;
}

export default function Bridge() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [direction, setDirection] = useState<"to" | "from">("to");
  const [amount, setAmount] = useState("");
  const [targetChain, setTargetChain] = useState("ethereum");
  const [fromAddress, setFromAddress] = useState("");
  const [targetAddress, setTargetAddress] = useState("");

  const { data: bridgeInfo, isLoading: infoLoading } = useQuery<BridgeInfo>({
    queryKey: ["/api/bridge/info"],
  });

  const { data: transfersData } = useQuery<{ transfers: BridgeTransfer[] }>({
    queryKey: ["/api/bridge/transfers"],
    refetchInterval: 5000,
  });

  const lockMutation = useMutation({
    mutationFn: async () => {
      const parts = amount.split(".");
      const wholePart = parts[0] || "0";
      const decimalPart = (parts[1] || "").padEnd(18, "0").slice(0, 18);
      const amountInSmallestUnit = wholePart + decimalPart;
      const res = await apiRequest("POST", "/api/bridge/lock", {
        fromAddress,
        amount: amountInSmallestUnit.replace(/^0+/, "") || "0",
        targetChain,
        targetAddress,
      });
      return res.json();
    },
    onSuccess: (data: any) => {
      toast({
        title: "Lock Initiated",
        description: `Transaction ${data.txHash?.slice(0, 18)}... submitted`,
      });
      queryClient.invalidateQueries({ queryKey: ["/api/bridge/transfers"] });
      setAmount("");
      setFromAddress("");
      setTargetAddress("");
    },
    onError: (error: any) => {
      toast({
        title: "Lock Failed",
        description: error.message || "Failed to lock tokens",
        variant: "destructive",
      });
    },
  });

  const formatAmount = (amount: string) => {
    try {
      const num = BigInt(amount);
      const divisor = BigInt("1000000000000000000");
      return (Number(num) / Number(divisor)).toFixed(4);
    } catch {
      return "0";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "confirmed":
      case "completed":
        return <CheckCircle className="w-4 h-4 text-green-400" />;
      case "pending":
        return <Clock className="w-4 h-4 text-amber-400 animate-pulse" />;
      default:
        return <Loader2 className="w-4 h-4 text-white/50 animate-spin" />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-black">
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-background/90 backdrop-blur-xl">
        <div className="container mx-auto px-4 h-14 flex items-center">
          <Link href="/" className="flex items-center gap-2 mr-auto">
            <img src={orbitLogo} alt="DarkWave" className="w-7 h-7" />
            <span className="font-display font-bold text-lg tracking-tight">DarkWave</span>
          </Link>
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="border-amber-500/50 text-amber-400 text-xs">Beta</Badge>
            <Link href="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-1" />
                Back
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      <main className="flex-1 pt-24 pb-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <div className="flex items-center justify-center gap-2 mb-4">
              <h1 className="text-3xl md:text-4xl font-display font-bold">
                Cross-Chain <span className="text-primary">Bridge</span>
              </h1>
              <Badge variant="outline" className="border-amber-500/50 text-amber-400">Beta</Badge>
            </div>
            <p className="text-sm text-muted-foreground max-w-xl mx-auto">
              Transfer DWT between DarkWave Chain and other networks. {bridgeInfo?.phase}
            </p>
          </motion.div>

          <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4 mb-8 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div className="text-sm text-amber-200">
              <strong>Beta Feature:</strong> This bridge is operated by the Founders Validator and is currently in testing. 
              Target chains are testnets only (Sepolia, Solana Devnet). Use at your own risk.
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <GlassCard glow>
              <div className="p-6">
                <div className="flex items-center gap-2 mb-6">
                  <ArrowLeftRight className="w-5 h-5 text-primary" />
                  <h2 className="text-lg font-bold">Bridge Tokens</h2>
                </div>

                <div className="space-y-4">
                  <div className="flex gap-2 mb-4">
                    <Button
                      variant={direction === "to" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setDirection("to")}
                      data-testid="button-direction-to"
                    >
                      DWT → Other Chain
                    </Button>
                    <Button
                      variant={direction === "from" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setDirection("from")}
                      data-testid="button-direction-from"
                      disabled
                    >
                      Other Chain → DWT (Soon)
                    </Button>
                  </div>

                  <div>
                    <Label htmlFor="targetChain">Target Chain</Label>
                    <Select value={targetChain} onValueChange={setTargetChain}>
                      <SelectTrigger data-testid="select-target-chain">
                        <SelectValue placeholder="Select chain" />
                      </SelectTrigger>
                      <SelectContent>
                        {bridgeInfo?.supportedChains?.map((chain) => (
                          <SelectItem key={chain.id} value={chain.id}>
                            {chain.name} ({chain.network})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="fromAddress">Your DarkWave Address</Label>
                    <Input
                      id="fromAddress"
                      value={fromAddress}
                      onChange={(e) => setFromAddress(e.target.value)}
                      placeholder="0x..."
                      data-testid="input-from-address"
                    />
                  </div>

                  <div>
                    <Label htmlFor="targetAddress">Destination Address ({targetChain})</Label>
                    <Input
                      id="targetAddress"
                      value={targetAddress}
                      onChange={(e) => setTargetAddress(e.target.value)}
                      placeholder={targetChain === "solana" ? "Solana address..." : "0x..."}
                      data-testid="input-target-address"
                    />
                  </div>

                  <div>
                    <Label htmlFor="amount">Amount (DWT)</Label>
                    <Input
                      id="amount"
                      type="number"
                      step="0.0001"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="1.0"
                      data-testid="input-amount"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Enter amount in DWT (e.g., 1.5 for 1.5 DWT)
                    </p>
                  </div>

                  <Button
                    className="w-full"
                    onClick={() => lockMutation.mutate()}
                    disabled={lockMutation.isPending || !fromAddress || !targetAddress || !amount}
                    data-testid="button-bridge"
                  >
                    {lockMutation.isPending ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        Lock & Bridge
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </GlassCard>

            <div className="space-y-6">
              <GlassCard>
                <div className="p-6">
                  <h3 className="font-bold mb-4">Bridge Status</h3>
                  {infoLoading ? (
                    <div className="animate-pulse space-y-2">
                      <div className="h-4 bg-white/10 rounded w-3/4" />
                      <div className="h-4 bg-white/10 rounded w-1/2" />
                    </div>
                  ) : (
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Operator</span>
                        <span>{bridgeInfo?.operator}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Status</span>
                        <Badge variant="outline" className="border-green-500/50 text-green-400">
                          {bridgeInfo?.status}
                        </Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Custody Balance</span>
                        <span>{formatAmount(bridgeInfo?.custodyBalance || "0")} DWT</span>
                      </div>
                      <div className="pt-2 border-t border-white/10">
                        <span className="text-[10px] text-muted-foreground uppercase">Supported Chains</span>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {bridgeInfo?.supportedChains?.map((chain) => (
                            <Badge key={chain.id} variant="secondary" className="text-xs">
                              {chain.name}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </GlassCard>

              <GlassCard>
                <div className="p-6">
                  <h3 className="font-bold mb-4">Recent Transfers</h3>
                  <div className="space-y-3 max-h-64 overflow-y-auto">
                    {transfersData?.transfers?.length === 0 && (
                      <p className="text-sm text-muted-foreground text-center py-4">
                        No transfers yet
                      </p>
                    )}
                    {transfersData?.transfers?.slice(0, 10).map((transfer) => (
                      <div
                        key={transfer.id}
                        className="flex items-center justify-between p-3 bg-white/5 rounded-lg"
                        data-testid={`transfer-${transfer.id}`}
                      >
                        <div className="flex items-center gap-3">
                          {getStatusIcon(transfer.status)}
                          <div>
                            <div className="text-sm font-medium capitalize">{transfer.type}</div>
                            <div className="text-xs text-muted-foreground">
                              {formatAmount(transfer.amount)} DWT
                            </div>
                          </div>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {transfer.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              </GlassCard>
            </div>
          </div>

          <div className="mt-8 text-center">
            <p className="text-xs text-muted-foreground">
              Phase 1 MVP: Lock DWT on DarkWave → Mint wrapped wDWT on target chain.{" "}
              <a href="#" className="text-primary hover:underline">
                Learn more about the bridge architecture
              </a>
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
