import { useState, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "wouter";
import { 
  ArrowRight, ArrowLeftRight, ArrowLeft, AlertTriangle, CheckCircle, Clock, Loader2,
  Lock, Unlock, Flame, ChevronLeft, ChevronRight, Sparkles, Zap, Shield, ExternalLink
} from "lucide-react";
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

const chainIcons: Record<string, string> = {
  ethereum: "⟠",
  solana: "◎",
  polygon: "⬡",
  arbitrum: "🔷",
  optimism: "🔴",
};

export default function Bridge() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [direction, setDirectionState] = useState<"to" | "from">("to");
  
  const setDirection = (newDirection: "to" | "from") => {
    if (newDirection !== direction) {
      setAmount("");
      setFromAddress("");
      setTargetAddress("");
      setReleaseAddress("");
      setBurnTxHash("");
    }
    setDirectionState(newDirection);
  };
  const [amount, setAmount] = useState("");
  const [targetChain, setTargetChain] = useState("ethereum");
  const [sourceChain, setSourceChain] = useState("ethereum");
  const [fromAddress, setFromAddress] = useState("");
  const [targetAddress, setTargetAddress] = useState("");
  const [releaseAddress, setReleaseAddress] = useState("");
  const [burnTxHash, setBurnTxHash] = useState("");
  const carouselRef = useRef<HTMLDivElement>(null);

  const { data: bridgeInfo, isLoading: infoLoading } = useQuery<BridgeInfo>({
    queryKey: ["/api/bridge/info"],
  });

  const { data: transfersData } = useQuery<{ transfers: BridgeTransfer[] }>({
    queryKey: ["/api/bridge/transfers"],
    refetchInterval: 5000,
  });

  const convertToSmallestUnit = (amt: string) => {
    if (!amt || amt.trim() === "" || parseFloat(amt) <= 0) {
      return null;
    }
    const parts = amt.split(".");
    const wholePart = parts[0] || "0";
    const decimalPart = (parts[1] || "").padEnd(18, "0").slice(0, 18);
    return (wholePart + decimalPart).replace(/^0+/, "") || "0";
  };

  const isValidAmount = (amt: string) => {
    if (!amt || amt.trim() === "") return false;
    const num = parseFloat(amt);
    return !isNaN(num) && num > 0;
  };

  const lockMutation = useMutation({
    mutationFn: async () => {
      const amountInUnits = convertToSmallestUnit(amount);
      if (!amountInUnits) throw new Error("Invalid amount");
      const res = await apiRequest("POST", "/api/bridge/lock", {
        fromAddress,
        amount: amountInUnits,
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

  const burnMutation = useMutation({
    mutationFn: async () => {
      const amountInUnits = convertToSmallestUnit(amount);
      if (!amountInUnits) throw new Error("Invalid amount");
      const res = await apiRequest("POST", "/api/bridge/burn", {
        sourceChain,
        burnTxHash,
        amount: amountInUnits,
        targetAddress: releaseAddress,
      });
      return res.json();
    },
    onSuccess: (data: any) => {
      toast({
        title: "Burn Submitted",
        description: `Release pending for ${data.burnId}`,
      });
      queryClient.invalidateQueries({ queryKey: ["/api/bridge/transfers"] });
      setAmount("");
      setReleaseAddress("");
      setBurnTxHash("");
    },
    onError: (error: any) => {
      toast({
        title: "Burn Failed",
        description: error.message || "Failed to process burn",
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

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "lock":
        return <Lock className="w-4 h-4 text-cyan-400" />;
      case "unlock":
      case "release":
        return <Unlock className="w-4 h-4 text-green-400" />;
      case "burn":
        return <Flame className="w-4 h-4 text-orange-400" />;
      case "mint":
        return <Sparkles className="w-4 h-4 text-purple-400" />;
      default:
        return <Zap className="w-4 h-4 text-primary" />;
    }
  };

  const scrollCarousel = (dir: "left" | "right") => {
    if (carouselRef.current) {
      const scrollAmount = dir === "left" ? -200 : 200;
      carouselRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-black overflow-x-hidden">
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-background/90 backdrop-blur-xl">
        <div className="container mx-auto px-4 h-14 flex items-center">
          <Link href="/" className="flex items-center gap-2 mr-auto group">
            <motion.img 
              src={orbitLogo} 
              alt="DarkWave" 
              className="w-7 h-7"
              whileHover={{ rotate: 180 }}
              transition={{ duration: 0.5 }}
            />
            <span className="font-display font-bold text-lg tracking-tight group-hover:text-primary transition-colors">DarkWave</span>
          </Link>
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="border-amber-500/50 text-amber-400 text-xs animate-pulse">Beta</Badge>
            <Link href="/">
              <Button variant="ghost" size="sm" className="hover:bg-primary/10 hover:text-primary transition-all">
                <ArrowLeft className="w-4 h-4 mr-1" />
                Back
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      <main className="flex-1 pt-24 pb-16 px-4">
        <div className="container mx-auto max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <motion.div 
              className="flex items-center justify-center gap-3 mb-4"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200 }}
            >
              <motion.div
                animate={{ 
                  boxShadow: ["0 0 20px rgba(0,255,255,0.3)", "0 0 40px rgba(0,255,255,0.6)", "0 0 20px rgba(0,255,255,0.3)"]
                }}
                transition={{ duration: 2, repeat: Infinity }}
                className="p-3 rounded-xl bg-primary/10 border border-primary/30"
              >
                <ArrowLeftRight className="w-8 h-8 text-primary" />
              </motion.div>
              <h1 className="text-3xl md:text-5xl font-display font-bold bg-gradient-to-r from-white via-primary to-cyan-300 bg-clip-text text-transparent">
                Cross-Chain Bridge
              </h1>
            </motion.div>
            <p className="text-sm text-muted-foreground max-w-xl mx-auto">
              Seamlessly transfer DWT between DarkWave Chain and other networks
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="relative mb-8"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-amber-500/20 via-orange-500/20 to-amber-500/20 rounded-xl blur-xl" />
            <div className="relative bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 flex items-start gap-3 backdrop-blur-sm">
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <AlertTriangle className="w-6 h-6 text-amber-400 shrink-0" />
              </motion.div>
              <div className="text-sm text-amber-200">
                <strong className="text-amber-300">Beta Feature:</strong> This bridge is operated by the Founders Validator. 
                Target chains are testnets only (Sepolia, Solana Devnet). Funds are secured by custodial escrow.
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-8"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-lg flex items-center gap-2">
                <Shield className="w-5 h-5 text-primary" />
                Supported Chains
              </h3>
              <div className="flex gap-2">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8 rounded-full bg-white/5 hover:bg-white/10 border border-white/10"
                  onClick={() => scrollCarousel("left")}
                  data-testid="button-carousel-left"
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8 rounded-full bg-white/5 hover:bg-white/10 border border-white/10"
                  onClick={() => scrollCarousel("right")}
                  data-testid="button-carousel-right"
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
            <div 
              ref={carouselRef}
              className="flex gap-3 overflow-x-auto pb-4 snap-x snap-mandatory -mx-4 px-4"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none", WebkitOverflowScrolling: "touch" }}
            >
              {bridgeInfo?.supportedChains?.map((chain, i) => (
                <motion.div
                  key={chain.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * i }}
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="snap-start"
                >
                  <div className="relative group cursor-pointer" data-testid={`chain-card-${chain.id}`}>
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-cyan-500/30 rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="relative w-32 sm:w-40 h-24 sm:h-28 bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-3 sm:p-4 flex flex-col justify-between group-hover:border-primary/50 transition-all shrink-0">
                      <div className="flex items-center justify-between">
                        <span className="text-2xl">{chainIcons[chain.id] || "🔗"}</span>
                        <Badge 
                          variant="outline" 
                          className={`text-[10px] ${chain.status === "active" ? "border-green-500/50 text-green-400" : "border-amber-500/50 text-amber-400"}`}
                        >
                          {chain.status}
                        </Badge>
                      </div>
                      <div>
                        <div className="font-bold text-sm">{chain.name}</div>
                        <div className="text-xs text-muted-foreground">{chain.network}</div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="snap-start"
              >
                <div className="w-40 h-28 bg-white/5 backdrop-blur-xl border border-dashed border-white/20 rounded-xl p-4 flex flex-col items-center justify-center text-muted-foreground hover:border-primary/50 transition-colors cursor-pointer">
                  <span className="text-2xl mb-1">+</span>
                  <span className="text-xs">More Coming</span>
                </div>
              </motion.div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex justify-center mb-8"
          >
            <div className="relative inline-flex p-1 bg-white/5 backdrop-blur-xl rounded-full border border-white/10">
              <div 
                className="absolute inset-y-1 rounded-full bg-gradient-to-r from-primary to-cyan-400 transition-all duration-300"
                style={{ 
                  left: direction === "to" ? "4px" : "50%",
                  width: "calc(50% - 4px)",
                }}
              />
              <button
                onClick={() => setDirection("to")}
                className={`relative z-10 px-6 py-2.5 rounded-full text-sm font-medium transition-colors flex items-center gap-2 ${
                  direction === "to" ? "text-black" : "text-white/70 hover:text-white"
                }`}
                data-testid="button-direction-to"
              >
                <Lock className="w-4 h-4" />
                <span className="hidden sm:inline">Lock & Mint</span>
                <span className="sm:hidden">Lock</span>
                <ArrowRight className="w-3 h-3" />
              </button>
              <button
                onClick={() => setDirection("from")}
                className={`relative z-10 px-6 py-2.5 rounded-full text-sm font-medium transition-colors flex items-center gap-2 ${
                  direction === "from" ? "text-black" : "text-white/70 hover:text-white"
                }`}
                data-testid="button-direction-from"
              >
                <Flame className="w-4 h-4" />
                <span className="hidden sm:inline">Burn & Release</span>
                <span className="sm:hidden">Burn</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            <motion.div 
              className="lg:col-span-3"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-primary/50 via-cyan-500/50 to-primary/50 rounded-2xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity" />
                <div className="relative">
                  <GlassCard glow className="overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-cyan-500/5" />
                    <div className="relative p-6 md:p-8">
                      <AnimatePresence mode="wait">
                        {direction === "to" ? (
                          <motion.div
                            key="lock-form"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            className="space-y-6"
                          >
                            <div className="flex items-center gap-3 mb-6">
                              <motion.div 
                                className="p-2.5 rounded-xl bg-cyan-500/20 border border-cyan-500/30"
                                whileHover={{ scale: 1.1 }}
                              >
                                <Lock className="w-5 h-5 text-cyan-400" />
                              </motion.div>
                              <div>
                                <h2 className="text-xl font-bold">Lock & Mint</h2>
                                <p className="text-xs text-muted-foreground">Lock DWT on DarkWave → Receive wDWT on target chain</p>
                              </div>
                            </div>

                            <div className="space-y-4">
                              <div className="relative group/input">
                                <Label className="text-xs uppercase tracking-wider text-muted-foreground mb-2 block">Target Chain</Label>
                                <Select value={targetChain} onValueChange={setTargetChain}>
                                  <SelectTrigger 
                                    data-testid="select-target-chain"
                                    className="bg-white/5 border-white/10 hover:border-primary/50 transition-colors h-12"
                                  >
                                    <SelectValue placeholder="Select chain" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {bridgeInfo?.supportedChains?.map((chain) => (
                                      <SelectItem key={chain.id} value={chain.id}>
                                        <span className="flex items-center gap-2">
                                          <span>{chainIcons[chain.id] || "🔗"}</span>
                                          {chain.name} ({chain.network})
                                        </span>
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>

                              <div className="relative">
                                <Label className="text-xs uppercase tracking-wider text-muted-foreground mb-2 block">Your DarkWave Address</Label>
                                <Input
                                  value={fromAddress}
                                  onChange={(e) => setFromAddress(e.target.value)}
                                  placeholder="0x..."
                                  data-testid="input-from-address"
                                  className="bg-white/5 border-white/10 hover:border-primary/50 focus:border-primary transition-colors h-12 font-mono text-sm"
                                />
                              </div>

                              <div className="relative">
                                <Label className="text-xs uppercase tracking-wider text-muted-foreground mb-2 block">Destination Address ({targetChain})</Label>
                                <Input
                                  value={targetAddress}
                                  onChange={(e) => setTargetAddress(e.target.value)}
                                  placeholder={targetChain === "solana" ? "Solana address..." : "0x..."}
                                  data-testid="input-target-address"
                                  className="bg-white/5 border-white/10 hover:border-primary/50 focus:border-primary transition-colors h-12 font-mono text-sm"
                                />
                              </div>

                              <div className="relative">
                                <Label className="text-xs uppercase tracking-wider text-muted-foreground mb-2 block">Amount (DWT)</Label>
                                <div className="relative">
                                  <Input
                                    type="number"
                                    step="0.0001"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    placeholder="0.0"
                                    data-testid="input-amount"
                                    className="bg-white/5 border-white/10 hover:border-primary/50 focus:border-primary transition-colors h-14 text-2xl font-bold pr-20"
                                  />
                                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-primary font-bold">DWT</span>
                                </div>
                              </div>

                              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                                <Button
                                  className="w-full h-14 text-lg font-bold bg-gradient-to-r from-primary to-cyan-400 hover:from-primary/90 hover:to-cyan-400/90 text-black shadow-lg shadow-primary/25"
                                  onClick={() => lockMutation.mutate()}
                                  disabled={lockMutation.isPending || !fromAddress || !targetAddress || !isValidAmount(amount)}
                                  data-testid="button-bridge"
                                >
                                  {lockMutation.isPending ? (
                                    <motion.div 
                                      className="flex items-center gap-2"
                                      animate={{ opacity: [1, 0.5, 1] }}
                                      transition={{ duration: 1.5, repeat: Infinity }}
                                    >
                                      <Loader2 className="w-5 h-5 animate-spin" />
                                      Processing...
                                    </motion.div>
                                  ) : (
                                    <span className="flex items-center gap-2">
                                      <Lock className="w-5 h-5" />
                                      Lock & Bridge
                                      <ArrowRight className="w-5 h-5" />
                                    </span>
                                  )}
                                </Button>
                              </motion.div>
                            </div>
                          </motion.div>
                        ) : (
                          <motion.div
                            key="burn-form"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-6"
                          >
                            <div className="flex items-center gap-3 mb-6">
                              <motion.div 
                                className="p-2.5 rounded-xl bg-orange-500/20 border border-orange-500/30"
                                whileHover={{ scale: 1.1 }}
                                animate={{ 
                                  boxShadow: ["0 0 10px rgba(251,146,60,0.3)", "0 0 20px rgba(251,146,60,0.5)", "0 0 10px rgba(251,146,60,0.3)"]
                                }}
                                transition={{ duration: 2, repeat: Infinity }}
                              >
                                <Flame className="w-5 h-5 text-orange-400" />
                              </motion.div>
                              <div>
                                <h2 className="text-xl font-bold">Burn & Release</h2>
                                <p className="text-xs text-muted-foreground">Burn wDWT on source chain → Release DWT on DarkWave</p>
                              </div>
                            </div>

                            <div className="space-y-4">
                              <div>
                                <Label className="text-xs uppercase tracking-wider text-muted-foreground mb-2 block">Source Chain</Label>
                                <Select value={sourceChain} onValueChange={setSourceChain}>
                                  <SelectTrigger data-testid="select-source-chain" className="bg-white/5 border-white/10 hover:border-orange-500/50 transition-colors h-12">
                                    <SelectValue placeholder="Select chain" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {bridgeInfo?.supportedChains?.map((chain) => (
                                      <SelectItem key={chain.id} value={chain.id}>
                                        <span className="flex items-center gap-2">
                                          <span>{chainIcons[chain.id] || "🔗"}</span>
                                          {chain.name} ({chain.network})
                                        </span>
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>

                              <div>
                                <Label className="text-xs uppercase tracking-wider text-muted-foreground mb-2 block">Burn Transaction Hash</Label>
                                <Input
                                  value={burnTxHash}
                                  onChange={(e) => setBurnTxHash(e.target.value)}
                                  placeholder="0x... (from your wDWT burn on source chain)"
                                  data-testid="input-burn-tx"
                                  className="bg-white/5 border-white/10 hover:border-orange-500/50 focus:border-orange-500 transition-colors h-12 font-mono text-sm"
                                />
                                <p className="text-xs text-muted-foreground mt-1">
                                  The transaction hash from burning wDWT on the source chain
                                </p>
                              </div>

                              <div>
                                <Label className="text-xs uppercase tracking-wider text-muted-foreground mb-2 block">Your DarkWave Address (Release To)</Label>
                                <Input
                                  value={releaseAddress}
                                  onChange={(e) => setReleaseAddress(e.target.value)}
                                  placeholder="0x..."
                                  data-testid="input-release-address"
                                  className="bg-white/5 border-white/10 hover:border-orange-500/50 focus:border-orange-500 transition-colors h-12 font-mono text-sm"
                                />
                              </div>

                              <div>
                                <Label className="text-xs uppercase tracking-wider text-muted-foreground mb-2 block">Amount (wDWT Burned)</Label>
                                <div className="relative">
                                  <Input
                                    type="number"
                                    step="0.0001"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    placeholder="0.0"
                                    data-testid="input-burn-amount"
                                    className="bg-white/5 border-white/10 hover:border-orange-500/50 focus:border-orange-500 transition-colors h-14 text-2xl font-bold pr-24"
                                  />
                                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-orange-400 font-bold">wDWT</span>
                                </div>
                              </div>

                              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                                <Button
                                  className="w-full h-14 text-lg font-bold bg-gradient-to-r from-orange-500 to-amber-400 hover:from-orange-500/90 hover:to-amber-400/90 text-black shadow-lg shadow-orange-500/25"
                                  onClick={() => burnMutation.mutate()}
                                  disabled={burnMutation.isPending || !releaseAddress || !burnTxHash || !isValidAmount(amount)}
                                  data-testid="button-burn"
                                >
                                  {burnMutation.isPending ? (
                                    <motion.div 
                                      className="flex items-center gap-2"
                                      animate={{ opacity: [1, 0.5, 1] }}
                                      transition={{ duration: 1.5, repeat: Infinity }}
                                    >
                                      <Loader2 className="w-5 h-5 animate-spin" />
                                      Processing...
                                    </motion.div>
                                  ) : (
                                    <span className="flex items-center gap-2">
                                      <Flame className="w-5 h-5" />
                                      Burn & Release
                                      <Unlock className="w-5 h-5" />
                                    </span>
                                  )}
                                </Button>
                              </motion.div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </GlassCard>
                </div>
              </div>
            </motion.div>

            <motion.div 
              className="lg:col-span-2 space-y-6"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <GlassCard>
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Shield className="w-5 h-5 text-primary" />
                    <h3 className="font-bold">Bridge Status</h3>
                  </div>
                  {infoLoading ? (
                    <div className="animate-pulse space-y-3">
                      <div className="h-4 bg-white/10 rounded w-3/4" />
                      <div className="h-4 bg-white/10 rounded w-1/2" />
                      <div className="h-4 bg-white/10 rounded w-2/3" />
                    </div>
                  ) : (
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between items-center p-2 rounded-lg hover:bg-white/5 transition-colors">
                        <span className="text-muted-foreground">Operator</span>
                        <span className="font-medium">{bridgeInfo?.operator}</span>
                      </div>
                      <div className="flex justify-between items-center p-2 rounded-lg hover:bg-white/5 transition-colors">
                        <span className="text-muted-foreground">Status</span>
                        <motion.div
                          animate={{ scale: [1, 1.05, 1] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        >
                          <Badge variant="outline" className="border-green-500/50 text-green-400">
                            {bridgeInfo?.status}
                          </Badge>
                        </motion.div>
                      </div>
                      <div className="flex justify-between items-center p-2 rounded-lg hover:bg-white/5 transition-colors">
                        <span className="text-muted-foreground">Custody Balance</span>
                        <span className="font-bold text-primary">{formatAmount(bridgeInfo?.custodyBalance || "0")} DWT</span>
                      </div>
                      <div className="pt-3 border-t border-white/10">
                        <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Phase</span>
                        <div className="mt-1 text-sm">{bridgeInfo?.phase}</div>
                      </div>
                    </div>
                  )}
                </div>
              </GlassCard>

              <GlassCard>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold flex items-center gap-2">
                      <Zap className="w-4 h-4 text-primary" />
                      Recent Transfers
                    </h3>
                    <Badge variant="secondary" className="text-xs">
                      {transfersData?.transfers?.length || 0}
                    </Badge>
                  </div>
                  <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                    {transfersData?.transfers?.length === 0 && (
                      <div className="text-center py-8">
                        <motion.div
                          animate={{ y: [0, -5, 0] }}
                          transition={{ duration: 2, repeat: Infinity }}
                          className="inline-block mb-3"
                        >
                          <ArrowLeftRight className="w-10 h-10 text-white/20" />
                        </motion.div>
                        <p className="text-sm text-muted-foreground">No transfers yet</p>
                        <p className="text-xs text-muted-foreground mt-1">Your bridge activity will appear here</p>
                      </div>
                    )}
                    {transfersData?.transfers?.slice(0, 10).map((transfer, i) => (
                      <motion.div
                        key={transfer.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.05 * i }}
                        whileHover={{ scale: 1.02, x: 5 }}
                        className="flex items-center justify-between p-3 bg-white/5 hover:bg-white/10 rounded-xl transition-all cursor-pointer group"
                        data-testid={`transfer-${transfer.id}`}
                      >
                        <div className="flex items-center gap-3">
                          <motion.div 
                            className={`p-2 rounded-lg ${
                              transfer.type === "burn" ? "bg-orange-500/20" :
                              transfer.type === "lock" ? "bg-cyan-500/20" :
                              transfer.type === "mint" ? "bg-purple-500/20" :
                              "bg-green-500/20"
                            }`}
                            whileHover={{ rotate: 360 }}
                            transition={{ duration: 0.5 }}
                          >
                            {getTypeIcon(transfer.type)}
                          </motion.div>
                          <div>
                            <div className="text-sm font-medium capitalize flex items-center gap-1">
                              {transfer.type}
                              <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-50 transition-opacity" />
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {formatAmount(transfer.amount)} DWT
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(transfer.status)}
                          <Badge 
                            variant="outline" 
                            className={`text-[10px] ${
                              transfer.status === "completed" ? "border-green-500/50 text-green-400" :
                              transfer.status === "pending" ? "border-amber-500/50 text-amber-400" :
                              "border-white/20"
                            }`}
                          >
                            {transfer.status}
                          </Badge>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          </div>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-10 text-center"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10">
              <Sparkles className="w-4 h-4 text-primary" />
              <p className="text-xs text-muted-foreground">
                Phase 1 MVP: Lock-and-mint custodial bridge with Founders Validator relay
              </p>
            </div>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
