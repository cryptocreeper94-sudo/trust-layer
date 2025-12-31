import { useState, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "wouter";
import { 
  ArrowRight, ArrowLeftRight, AlertTriangle, CheckCircle, Clock, Loader2,
  Lock, Unlock, Flame, ChevronLeft, ChevronRight, Sparkles, Zap, Shield, ExternalLink,
  ChevronDown, Info, HelpCircle, BookOpen, X
} from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { BackButton } from "@/components/page-nav";
import { Footer } from "@/components/footer";
import { GlassCard } from "@/components/glass-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import orbitLogo from "@assets/generated_images/futuristic_abstract_geometric_logo_symbol_for_orbit.png";
import blockchainImg from "@assets/generated_images/futuristic_blockchain_network_activity_monitor.png";
import spaceImg from "@assets/generated_images/deep_space_station.png";
import cyberpunkImg from "@assets/generated_images/cyberpunk_neon_city.png";
import { WalletButton } from "@/components/wallet-button";

interface BridgeInfo {
  custodyAddress: string;
  supportedChains: { id: string; name: string; network: string; status: string; contractDeployed?: boolean }[];
  phase: string;
  status: string;
  operator: string;
  custodyBalance: string;
  disclaimer: string;
  mode?: "mock" | "live";
  contracts?: {
    ethereum: { deployed: boolean; address: string };
    solana: { deployed: boolean; address: string };
  };
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

interface ChainStatus {
  chain: string;
  connected: boolean;
  blockHeight?: number;
  latency?: number;
  error?: string;
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
  const [statusOpen, setStatusOpen] = useState(false);
  const [transfersOpen, setTransfersOpen] = useState(false);
  
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
  const [tutorialOpen, setTutorialOpen] = useState(false);
  const [tutorialSlide, setTutorialSlide] = useState(0);

  const tutorialSlides = [
    {
      title: "What is a Bridge?",
      icon: <ArrowLeftRight className="w-8 h-8 text-primary" />,
      content: "A blockchain bridge lets you move your coins between different networks. Think of it like exchanging currency when traveling to another country — your money works in both places, just in different forms.",
      color: "from-primary/20 to-cyan-500/20",
    },
    {
      title: "Step 1: Lock Your DWC",
      icon: <Lock className="w-8 h-8 text-cyan-400" />,
      content: "When you want to use DWC on another chain (like Ethereum), you first 'lock' your coins in a secure vault on DarkWave. This proves you own them and keeps them safe while you use them elsewhere.",
      color: "from-cyan-500/20 to-blue-500/20",
    },
    {
      title: "Step 2: Receive Wrapped Coins (wDWC)",
      icon: <Sparkles className="w-8 h-8 text-purple-400" />,
      content: "Once locked, you receive 'wrapped' coins (wDWC) on the other chain. These are IOUs that represent your locked DWC — same value, just usable on Ethereum, Solana, etc. Think of it like a casino chip for your money.",
      color: "from-purple-500/20 to-pink-500/20",
    },
    {
      title: "Step 3: Use wDWC Anywhere",
      icon: <Zap className="w-8 h-8 text-amber-400" />,
      content: "Your wDWC works just like any other coin on that network. Trade it, stake it, use it in DeFi apps — it's fully functional. The value stays 1:1 with your locked DWC back home.",
      color: "from-amber-500/20 to-orange-500/20",
    },
    {
      title: "Coming Back: Burn & Release",
      icon: <Flame className="w-8 h-8 text-orange-400" />,
      content: "Want your original DWC back? Simply 'burn' (destroy) your wDWC on the other chain. This proves you're done using them, and your original DWC gets 'released' back to your DarkWave wallet. Full circle!",
      color: "from-orange-500/20 to-red-500/20",
    },
    {
      title: "Why It's Safe",
      icon: <Shield className="w-8 h-8 text-green-400" />,
      content: "Your locked DWC never leaves DarkWave — they're held by trusted validators. The bridge only creates wrapped coins when real coins are locked, and destroys wrapped coins when real coins are released. 1:1, always.",
      color: "from-green-500/20 to-emerald-500/20",
    },
  ];

  const { data: bridgeInfo, isLoading: infoLoading } = useQuery<BridgeInfo>({
    queryKey: ["/api/bridge/info"],
  });

  const { data: transfersData } = useQuery<{ transfers: BridgeTransfer[] }>({
    queryKey: ["/api/bridge/transfers"],
    refetchInterval: 5000,
  });

  const { data: chainStatusData } = useQuery<{ statuses: ChainStatus[]; timestamp: string }>({
    queryKey: ["/api/bridge/chains/status"],
    refetchInterval: 10000,
  });

  const getChainStatus = (chainId: string): ChainStatus | undefined => {
    return chainStatusData?.statuses?.find(s => s.chain === chainId);
  };

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
        return <CheckCircle className="w-3 h-3 text-green-400" />;
      case "pending":
        return <Clock className="w-3 h-3 text-amber-400 animate-pulse" />;
      default:
        return <Loader2 className="w-3 h-3 text-white/50 animate-spin" />;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "lock":
        return <Lock className="w-3 h-3 text-cyan-400" />;
      case "unlock":
      case "release":
        return <Unlock className="w-3 h-3 text-green-400" />;
      case "burn":
        return <Flame className="w-3 h-3 text-orange-400" />;
      case "mint":
        return <Sparkles className="w-3 h-3 text-purple-400" />;
      default:
        return <Zap className="w-3 h-3 text-primary" />;
    }
  };

  const scrollCarousel = (dir: "left" | "right") => {
    if (carouselRef.current) {
      const scrollAmount = dir === "left" ? -200 : 200;
      carouselRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  return (
    <TooltipProvider>
    <div className="min-h-screen flex flex-col bg-background overflow-x-hidden">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-background/90 backdrop-blur-xl">
        <div className="container mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <img src={orbitLogo} alt="DarkWave" className="w-7 h-7" />
            <span className="font-display font-bold text-lg tracking-tight hidden sm:inline">DarkWave</span>
          </Link>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="border-amber-500/50 text-amber-400 text-[10px] animate-pulse hidden sm:flex">Beta</Badge>
            <WalletButton />
            <BackButton />
          </div>
        </div>
      </nav>

      <main className="flex-1 pt-16 pb-8 px-4">
        <div className="container mx-auto max-w-lg">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-6"
          >
            <div className="flex items-center justify-center gap-2 mb-3">
              <div className="p-2 rounded-xl bg-primary/10 border border-primary/30">
                <ArrowLeftRight className="w-5 h-5 text-primary" />
              </div>
              <h1 className="text-2xl md:text-3xl font-display font-bold">
                Cross-Chain Bridge
              </h1>
            </div>
            <p className="text-xs text-muted-foreground mb-3">
              Transfer DWC between DarkWave and other networks
            </p>
            <Dialog open={tutorialOpen} onOpenChange={(open) => {
              setTutorialOpen(open);
              if (open) setTutorialSlide(0);
            }}>
              <DialogTrigger asChild>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="bg-primary/10 border-primary/30 hover:bg-primary/20 text-primary"
                  data-testid="button-learn-bridging"
                >
                  <BookOpen className="w-4 h-4 mr-2" />
                  Learn How Bridging Works
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md bg-slate-950/95 backdrop-blur-xl border-white/10">
                <DialogHeader>
                  <DialogTitle className="text-center text-lg font-display">Bridge Tutorial</DialogTitle>
                </DialogHeader>
                <div className="relative">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={tutorialSlide}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.2 }}
                      className="p-4"
                    >
                      <div className={`mx-auto w-16 h-16 rounded-2xl bg-gradient-to-br ${tutorialSlides[tutorialSlide].color} flex items-center justify-center mb-4`}>
                        {tutorialSlides[tutorialSlide].icon}
                      </div>
                      <h3 className="text-lg font-bold text-center mb-3">
                        {tutorialSlides[tutorialSlide].title}
                      </h3>
                      <p className="text-sm text-muted-foreground text-center leading-relaxed">
                        {tutorialSlides[tutorialSlide].content}
                      </p>
                    </motion.div>
                  </AnimatePresence>
                  
                  <div className="flex items-center justify-center gap-1.5 mt-2 mb-4">
                    {tutorialSlides.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setTutorialSlide(i)}
                        className={`w-2 h-2 rounded-full transition-all ${
                          i === tutorialSlide ? "bg-primary w-4" : "bg-white/20 hover:bg-white/40"
                        }`}
                        data-testid={`button-slide-${i}`}
                      />
                    ))}
                  </div>
                  
                  <div className="flex justify-between gap-2 px-4 pb-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setTutorialSlide(Math.max(0, tutorialSlide - 1))}
                      disabled={tutorialSlide === 0}
                      className="text-muted-foreground"
                      data-testid="button-tutorial-prev"
                    >
                      <ChevronLeft className="w-4 h-4 mr-1" /> Previous
                    </Button>
                    {tutorialSlide === tutorialSlides.length - 1 ? (
                      <Button
                        size="sm"
                        onClick={() => setTutorialOpen(false)}
                        className="bg-primary text-black"
                        data-testid="button-tutorial-done"
                      >
                        Got It!
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        onClick={() => setTutorialSlide(tutorialSlide + 1)}
                        className="bg-primary text-black"
                        data-testid="button-tutorial-next"
                      >
                        Next <ChevronRight className="w-4 h-4 ml-1" />
                      </Button>
                    )}
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </motion.div>

          {/* Warning Banner - Collapsible on mobile */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-4"
          >
            <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-3">
              <div className="flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div className="text-xs text-amber-200 leading-relaxed">
                  <strong className="text-amber-300">
                    {bridgeInfo?.mode === "mock" ? "Development Mode" : "Beta"}:
                  </strong>{" "}
                  {bridgeInfo?.mode === "mock" 
                    ? "Simulated transactions for testing."
                    : "Testnets only (Sepolia, Devnet)."}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Supported Chains Carousel */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-6"
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-sm flex items-center gap-2">
                <Shield className="w-4 h-4 text-primary" />
                Supported Chains
              </h3>
              <div className="flex gap-1">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-7 w-7 rounded-full bg-white/5 hover:bg-white/10"
                  onClick={() => scrollCarousel("left")}
                  data-testid="button-carousel-left"
                >
                  <ChevronLeft className="w-3 h-3" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-7 w-7 rounded-full bg-white/5 hover:bg-white/10"
                  onClick={() => scrollCarousel("right")}
                  data-testid="button-carousel-right"
                >
                  <ChevronRight className="w-3 h-3" />
                </Button>
              </div>
            </div>
            <div 
              ref={carouselRef}
              className="flex gap-2 overflow-x-auto pb-2 snap-x snap-mandatory scrollbar-hide"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              {bridgeInfo?.supportedChains?.map((chain, i) => {
                const liveStatus = getChainStatus(chain.id);
                return (
                  <motion.div
                    key={chain.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.05 * i }}
                    className="snap-start shrink-0"
                  >
                    <div 
                      className={`w-[140px] p-3 bg-white/5 backdrop-blur border rounded-xl ${
                        liveStatus?.connected ? "border-green-500/30" : "border-white/10"
                      }`}
                      data-testid={`chain-card-${chain.id}`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xl">{chainIcons[chain.id] || "🔗"}</span>
                        <Badge 
                          variant="outline" 
                          className={`text-[8px] px-1.5 py-0 ${
                            liveStatus?.connected ? "border-green-500/50 text-green-400" : "border-red-500/50 text-red-400"
                          }`}
                        >
                          {liveStatus?.connected ? "LIVE" : "OFF"}
                        </Badge>
                      </div>
                      <div className="font-bold text-xs truncate">{chain.name}</div>
                      <div className="text-[10px] text-muted-foreground truncate">{chain.network}</div>
                      {liveStatus?.connected && liveStatus.blockHeight && (
                        <div className="text-[9px] text-green-400/70 mt-1 font-mono truncate">
                          #{liveStatus.blockHeight.toLocaleString()}
                        </div>
                      )}
                    </div>
                  </motion.div>
                );
              })}
              {[
                { id: "polygon", name: "Polygon", icon: "⬡" },
                { id: "arbitrum", name: "Arbitrum", icon: "🔷" },
                { id: "optimism", name: "Optimism", icon: "🔴" },
                { id: "base", name: "Base", icon: "🔵" },
                { id: "avalanche", name: "Avalanche", icon: "🔺" },
              ].map((chain, i) => (
                <motion.div
                  key={chain.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 + 0.05 * i }}
                  className="snap-start shrink-0"
                >
                  <div 
                    className="w-[140px] p-3 bg-white/5 backdrop-blur border border-white/10 rounded-xl opacity-60"
                    data-testid={`chain-card-${chain.id}`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xl">{chain.icon}</span>
                      <Badge 
                        variant="outline" 
                        className="text-[8px] px-1.5 py-0 border-purple-500/50 text-purple-400"
                      >
                        SOON
                      </Badge>
                    </div>
                    <div className="font-bold text-xs truncate">{chain.name}</div>
                    <div className="text-[10px] text-muted-foreground">Coming Soon</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Direction Toggle */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex justify-center mb-4"
          >
            <div className="relative inline-flex p-1 bg-white/5 rounded-full border border-white/10">
              <div 
                className="absolute inset-y-1 rounded-full bg-gradient-to-r from-primary to-cyan-400 transition-all duration-300"
                style={{ 
                  left: direction === "to" ? "4px" : "50%",
                  width: "calc(50% - 4px)",
                }}
              />
              <button
                onClick={() => setDirection("to")}
                className={`relative z-10 px-4 py-2 rounded-full text-xs font-medium transition-colors flex items-center gap-1.5 ${
                  direction === "to" ? "text-black" : "text-white/70"
                }`}
                data-testid="button-direction-to"
              >
                <Lock className="w-3 h-3" />
                Lock
                <ArrowRight className="w-3 h-3" />
              </button>
              <button
                onClick={() => setDirection("from")}
                className={`relative z-10 px-4 py-2 rounded-full text-xs font-medium transition-colors flex items-center gap-1.5 ${
                  direction === "from" ? "text-black" : "text-white/70"
                }`}
                data-testid="button-direction-from"
              >
                <Flame className="w-3 h-3" />
                Burn
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </motion.div>

          {/* Bridge Form Card */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mb-4"
          >
            <GlassCard>
              <div className="p-4">
                <AnimatePresence mode="wait">
                  {direction === "to" ? (
                    <motion.div
                      key="lock-form"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 10 }}
                      className="space-y-4"
                    >
                      <div className="flex items-center gap-2 mb-4">
                        <div className="p-2 rounded-lg bg-cyan-500/20">
                          <Lock className="w-4 h-4 text-cyan-400" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-1.5">
                            <h2 className="font-bold text-sm">Lock & Mint</h2>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <HelpCircle className="w-3.5 h-3.5 text-muted-foreground cursor-help" />
                              </TooltipTrigger>
                              <TooltipContent side="top" className="max-w-[250px] text-xs">
                                <p><strong>Lock:</strong> Your DWC coins are securely held in a vault on DarkWave.</p>
                                <p className="mt-1"><strong>Mint:</strong> New wrapped coins (wDWC) are created on the target chain, representing your locked coins.</p>
                              </TooltipContent>
                            </Tooltip>
                          </div>
                          <p className="text-[10px] text-muted-foreground">Lock DWC → Receive wDWC</p>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div>
                          <Label className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1.5 flex items-center gap-1">
                            Target Chain
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <HelpCircle className="w-3 h-3 cursor-help" />
                              </TooltipTrigger>
                              <TooltipContent side="right" className="max-w-[200px] text-xs">
                                The blockchain where you want to use your wrapped DWC (wDWC) coins.
                              </TooltipContent>
                            </Tooltip>
                          </Label>
                          <Select value={targetChain} onValueChange={setTargetChain}>
                            <SelectTrigger 
                              data-testid="select-target-chain"
                              className="bg-white/5 border-white/10 h-10 text-sm"
                            >
                              <SelectValue placeholder="Select chain" />
                            </SelectTrigger>
                            <SelectContent>
                              {bridgeInfo?.supportedChains?.map((chain) => (
                                <SelectItem key={chain.id} value={chain.id}>
                                  <span className="flex items-center gap-2">
                                    <span>{chainIcons[chain.id] || "🔗"}</span>
                                    {chain.name}
                                  </span>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1.5 flex items-center gap-1">
                            Your DarkWave Address
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <HelpCircle className="w-3 h-3 cursor-help" />
                              </TooltipTrigger>
                              <TooltipContent side="right" className="max-w-[200px] text-xs">
                                Your wallet address on DarkWave where your DWC coins are currently held.
                              </TooltipContent>
                            </Tooltip>
                          </Label>
                          <Input
                            value={fromAddress}
                            onChange={(e) => setFromAddress(e.target.value)}
                            placeholder="0x..."
                            data-testid="input-from-address"
                            className="bg-white/5 border-white/10 h-10 text-sm font-mono"
                          />
                        </div>

                        <div>
                          <Label className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1.5 flex items-center gap-1">
                            Destination Address
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <HelpCircle className="w-3 h-3 cursor-help" />
                              </TooltipTrigger>
                              <TooltipContent side="right" className="max-w-[200px] text-xs">
                                Your wallet address on the target chain where you'll receive the wrapped wDWC coins.
                              </TooltipContent>
                            </Tooltip>
                          </Label>
                          <Input
                            value={targetAddress}
                            onChange={(e) => setTargetAddress(e.target.value)}
                            placeholder={targetChain === "solana" ? "Solana address..." : "0x..."}
                            data-testid="input-target-address"
                            className="bg-white/5 border-white/10 h-10 text-sm font-mono"
                          />
                        </div>

                        <div>
                          <Label className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1.5 flex items-center gap-1">
                            Amount (DWC)
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <HelpCircle className="w-3 h-3 cursor-help" />
                              </TooltipTrigger>
                              <TooltipContent side="right" className="max-w-[200px] text-xs">
                                How many DWC coins to lock. You'll receive the same amount as wDWC on the target chain.
                              </TooltipContent>
                            </Tooltip>
                          </Label>
                          <div className="relative">
                            <Input
                              type="number"
                              step="0.0001"
                              value={amount}
                              onChange={(e) => setAmount(e.target.value)}
                              placeholder="0.0"
                              data-testid="input-amount"
                              className="bg-white/5 border-white/10 h-12 text-xl font-bold pr-16"
                            />
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-primary font-bold">DWC</span>
                          </div>
                        </div>

                        <Button
                          className="w-full h-11 text-sm font-bold bg-gradient-to-r from-primary to-cyan-400 text-black"
                          onClick={() => lockMutation.mutate()}
                          disabled={lockMutation.isPending || !fromAddress || !targetAddress || !isValidAmount(amount)}
                          data-testid="button-bridge"
                        >
                          {lockMutation.isPending ? (
                            <span className="flex items-center gap-2">
                              <Loader2 className="w-4 h-4 animate-spin" />
                              Processing...
                            </span>
                          ) : (
                            <span className="flex items-center gap-2">
                              <Lock className="w-4 h-4" />
                              Lock & Bridge
                              <ArrowRight className="w-4 h-4" />
                            </span>
                          )}
                        </Button>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="burn-form"
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      className="space-y-4"
                    >
                      <div className="flex items-center gap-2 mb-4">
                        <div className="p-2 rounded-lg bg-orange-500/20">
                          <Flame className="w-4 h-4 text-orange-400" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-1.5">
                            <h2 className="font-bold text-sm">Burn & Release</h2>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <HelpCircle className="w-3.5 h-3.5 text-muted-foreground cursor-help" />
                              </TooltipTrigger>
                              <TooltipContent side="top" className="max-w-[250px] text-xs">
                                <p><strong>Burn:</strong> Destroy your wrapped coins (wDWC) on the other chain.</p>
                                <p className="mt-1"><strong>Release:</strong> Your original DWC coins are unlocked and sent back to your DarkWave wallet.</p>
                              </TooltipContent>
                            </Tooltip>
                          </div>
                          <p className="text-[10px] text-muted-foreground">Burn wDWC → Release DWC</p>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div>
                          <Label className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1.5 flex items-center gap-1">
                            Source Chain
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <HelpCircle className="w-3 h-3 cursor-help" />
                              </TooltipTrigger>
                              <TooltipContent side="right" className="max-w-[200px] text-xs">
                                The blockchain where your wrapped wDWC coins currently are (where you'll burn them).
                              </TooltipContent>
                            </Tooltip>
                          </Label>
                          <Select value={sourceChain} onValueChange={setSourceChain}>
                            <SelectTrigger data-testid="select-source-chain" className="bg-white/5 border-white/10 h-10 text-sm">
                              <SelectValue placeholder="Select chain" />
                            </SelectTrigger>
                            <SelectContent>
                              {bridgeInfo?.supportedChains?.map((chain) => (
                                <SelectItem key={chain.id} value={chain.id}>
                                  <span className="flex items-center gap-2">
                                    <span>{chainIcons[chain.id] || "🔗"}</span>
                                    {chain.name}
                                  </span>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1.5 flex items-center gap-1">
                            Burn Transaction Hash
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <HelpCircle className="w-3 h-3 cursor-help" />
                              </TooltipTrigger>
                              <TooltipContent side="right" className="max-w-[200px] text-xs">
                                The transaction ID from when you burned wDWC on the other chain. This proves the burn happened.
                              </TooltipContent>
                            </Tooltip>
                          </Label>
                          <Input
                            value={burnTxHash}
                            onChange={(e) => setBurnTxHash(e.target.value)}
                            placeholder="0x..."
                            data-testid="input-burn-tx"
                            className="bg-white/5 border-white/10 h-10 text-sm font-mono"
                          />
                        </div>

                        <div>
                          <Label className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1.5 flex items-center gap-1">
                            Release To (DarkWave)
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <HelpCircle className="w-3 h-3 cursor-help" />
                              </TooltipTrigger>
                              <TooltipContent side="right" className="max-w-[200px] text-xs">
                                Your DarkWave wallet address where you want to receive your original DWC coins back.
                              </TooltipContent>
                            </Tooltip>
                          </Label>
                          <Input
                            value={releaseAddress}
                            onChange={(e) => setReleaseAddress(e.target.value)}
                            placeholder="0x..."
                            data-testid="input-release-address"
                            className="bg-white/5 border-white/10 h-10 text-sm font-mono"
                          />
                        </div>

                        <div>
                          <Label className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1.5 flex items-center gap-1">
                            Amount (wDWC)
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <HelpCircle className="w-3 h-3 cursor-help" />
                              </TooltipTrigger>
                              <TooltipContent side="right" className="max-w-[200px] text-xs">
                                How many wrapped wDWC coins you're burning. You'll get the same amount as DWC on DarkWave.
                              </TooltipContent>
                            </Tooltip>
                          </Label>
                          <div className="relative">
                            <Input
                              type="number"
                              step="0.0001"
                              value={amount}
                              onChange={(e) => setAmount(e.target.value)}
                              placeholder="0.0"
                              data-testid="input-burn-amount"
                              className="bg-white/5 border-white/10 h-12 text-xl font-bold pr-20"
                            />
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-orange-400 font-bold">wDWC</span>
                          </div>
                        </div>

                        <Button
                          className="w-full h-11 text-sm font-bold bg-gradient-to-r from-orange-500 to-amber-400 text-black"
                          onClick={() => burnMutation.mutate()}
                          disabled={burnMutation.isPending || !releaseAddress || !burnTxHash || !isValidAmount(amount)}
                          data-testid="button-burn"
                        >
                          {burnMutation.isPending ? (
                            <span className="flex items-center gap-2">
                              <Loader2 className="w-4 h-4 animate-spin" />
                              Processing...
                            </span>
                          ) : (
                            <span className="flex items-center gap-2">
                              <Flame className="w-4 h-4" />
                              Burn & Release
                              <Unlock className="w-4 h-4" />
                            </span>
                          )}
                        </Button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </GlassCard>
          </motion.div>

          {/* Collapsible Status Section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mb-3"
          >
            <Collapsible open={statusOpen} onOpenChange={setStatusOpen}>
              <div className="relative overflow-hidden rounded-2xl">
                <img src={blockchainImg} alt="Blockchain Network" className="absolute inset-0 w-full h-full object-cover opacity-40" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent" />
                <div className="relative z-10">
                  <GlassCard className="bg-transparent border-0">
                    <CollapsibleTrigger className="w-full p-3 flex items-center justify-between hover:bg-white/5 rounded-xl transition-colors">
                      <div className="flex items-center gap-2">
                        <Shield className="w-4 h-4 text-primary" />
                        <span className="font-bold text-sm">Bridge Status</span>
                        <Badge variant="outline" className="border-green-500/50 text-green-400 text-[10px] ml-1">
                          {bridgeInfo?.status || "Active"}
                        </Badge>
                      </div>
                      <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${statusOpen ? "rotate-180" : ""}`} />
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <div className="px-3 pb-3 pt-1 space-y-2 text-xs border-t border-white/5 mt-1">
                        <div className="flex justify-between items-center p-2 rounded-lg bg-white/5">
                          <span className="text-muted-foreground">Operator</span>
                          <span className="font-medium truncate ml-2">{bridgeInfo?.operator || "Founders Validator"}</span>
                        </div>
                        <div className="flex justify-between items-center p-2 rounded-lg bg-white/5">
                          <span className="text-muted-foreground">Custody Balance</span>
                          <span className="font-bold text-primary">{formatAmount(bridgeInfo?.custodyBalance || "0")} DWC</span>
                        </div>
                        <div className="flex justify-between items-center p-2 rounded-lg bg-white/5">
                          <span className="text-muted-foreground">Phase</span>
                          <span>{bridgeInfo?.phase || "MVP"}</span>
                        </div>
                      </div>
                    </CollapsibleContent>
                  </GlassCard>
                </div>
              </div>
            </Collapsible>
          </motion.div>

          {/* Collapsible Transfers Section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Collapsible open={transfersOpen} onOpenChange={setTransfersOpen}>
              <div className="relative overflow-hidden rounded-2xl">
                <img src={spaceImg} alt="Space Station" className="absolute inset-0 w-full h-full object-cover opacity-40" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent" />
                <div className="relative z-10">
                  <GlassCard className="bg-transparent border-0">
                    <CollapsibleTrigger className="w-full p-3 flex items-center justify-between hover:bg-white/5 rounded-xl transition-colors">
                      <div className="flex items-center gap-2">
                        <Zap className="w-4 h-4 text-primary" />
                        <span className="font-bold text-sm">Recent Transfers</span>
                        <Badge variant="secondary" className="text-[10px] ml-1">
                          {transfersData?.transfers?.length || 0}
                        </Badge>
                      </div>
                      <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${transfersOpen ? "rotate-180" : ""}`} />
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <div className="px-3 pb-3 pt-1 border-t border-white/5 mt-1">
                        {transfersData?.transfers?.length === 0 ? (
                          <div className="text-center py-6">
                            <ArrowLeftRight className="w-8 h-8 text-white/20 mx-auto mb-2" />
                            <p className="text-xs text-muted-foreground">No transfers yet</p>
                          </div>
                        ) : (
                          <div className="space-y-2 max-h-48 overflow-y-auto">
                            {transfersData?.transfers?.slice(0, 5).map((transfer) => (
                              <div
                                key={transfer.id}
                                className="flex items-center justify-between p-2 bg-white/5 rounded-lg text-xs"
                                data-testid={`transfer-${transfer.id}`}
                              >
                                <div className="flex items-center gap-2">
                                  <div className={`p-1.5 rounded ${
                                    transfer.type === "burn" ? "bg-orange-500/20" :
                                    transfer.type === "lock" ? "bg-cyan-500/20" :
                                    "bg-green-500/20"
                                  }`}>
                                    {getTypeIcon(transfer.type)}
                                  </div>
                                  <div>
                                    <div className="font-medium capitalize">{transfer.type}</div>
                                    <div className="text-[10px] text-muted-foreground">
                                      {formatAmount(transfer.amount)} DWC
                                    </div>
                                  </div>
                                </div>
                                <div className="flex items-center gap-1">
                                  {getStatusIcon(transfer.status)}
                                  <Badge 
                                    variant="outline" 
                                    className={`text-[9px] ${
                                      transfer.status === "completed" ? "border-green-500/50 text-green-400" :
                                      "border-amber-500/50 text-amber-400"
                                    }`}
                                  >
                                    {transfer.status}
                                  </Badge>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </CollapsibleContent>
                  </GlassCard>
                </div>
              </div>
            </Collapsible>
          </motion.div>

          {/* Footer Info */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="mt-6 text-center"
          >
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
              <Info className="w-3 h-3 text-primary" />
              <p className="text-[10px] text-muted-foreground">
                Phase 1 MVP • Founders Validator relay
              </p>
            </div>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
    </TooltipProvider>
  );
}
