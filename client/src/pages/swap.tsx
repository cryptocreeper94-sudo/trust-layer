import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "wouter";
import { 
  ArrowUpDown, ArrowLeft, Wallet, Settings, ChevronDown, Loader2,
  Sparkles, Zap, TrendingUp, RefreshCw, Info, AlertCircle, Target, Clock
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
import { WalletButton } from "@/components/wallet-button";
import { LimitOrderForm, LimitOrdersList } from "@/components/limit-orders";

interface TokenInfo {
  symbol: string;
  name: string;
  icon: string;
  balance?: string;
  price?: string;
}

interface SwapQuote {
  amountOut: string;
  priceImpact: string;
  fee: string;
  route: string;
  minReceived: string;
}

const TOKENS: TokenInfo[] = [
  { symbol: "DWC", name: "DarkWave Coin", icon: "🌊" },
  { symbol: "wETH", name: "Wrapped Ethereum", icon: "⟠" },
  { symbol: "wSOL", name: "Wrapped Solana", icon: "◎" },
  { symbol: "USDC", name: "USD Coin", icon: "💵" },
  { symbol: "USDT", name: "Tether", icon: "💲" },
];

const convertToSmallestUnit = (amt: string) => {
  if (!amt) return "0";
  const parts = amt.split(".");
  const wholePart = parts[0] || "0";
  const decimalPart = (parts[1] || "").padEnd(18, "0").slice(0, 18);
  return (wholePart + decimalPart).replace(/^0+/, "") || "0";
};

const formatAmount = (amount: string) => {
  try {
    const num = BigInt(amount);
    const divisor = BigInt("1000000000000000000");
    return (Number(num) / Number(divisor)).toFixed(4);
  } catch {
    return "0";
  }
};

export default function Swap() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [tokenIn, setTokenIn] = useState<TokenInfo>(TOKENS[0]);
  const [tokenOut, setTokenOut] = useState<TokenInfo>(TOKENS[3]);
  const [amountIn, setAmountIn] = useState("");
  const [slippage, setSlippage] = useState("0.5");
  const [showSettings, setShowSettings] = useState(false);
  const [recentOpen, setRecentOpen] = useState(false);
  const [selectingToken, setSelectingToken] = useState<"in" | "out" | null>(null);
  const [orderType, setOrderType] = useState<"market" | "limit">("market");

  const { data: swapInfo } = useQuery<{ 
    pairs: any[]; 
    volume24h: string;
    tvl: string;
  }>({
    queryKey: ["/api/swap/info"],
  });

  const { data: quoteData, isLoading: quoteLoading } = useQuery<SwapQuote>({
    queryKey: ["/api/swap/quote", tokenIn.symbol, tokenOut.symbol, amountIn],
    queryFn: async () => {
      const params = new URLSearchParams({
        tokenIn: tokenIn.symbol,
        tokenOut: tokenOut.symbol,
        amountIn: convertToSmallestUnit(amountIn),
      });
      const res = await fetch(`/api/swap/quote?${params}`);
      if (!res.ok) throw new Error("Failed to get quote");
      return res.json();
    },
    enabled: !!amountIn && parseFloat(amountIn) > 0,
  });

  const { data: recentSwaps } = useQuery<{ swaps: any[] }>({
    queryKey: ["/api/swap/recent"],
    refetchInterval: 10000,
  });

  const swapMutation = useMutation({
    mutationFn: async () => {
      if (!amountIn || parseFloat(amountIn) <= 0) {
        throw new Error("Enter an amount");
      }
      const res = await apiRequest("POST", "/api/swap/execute", {
        tokenIn: tokenIn.symbol,
        tokenOut: tokenOut.symbol,
        amountIn: convertToSmallestUnit(amountIn),
        minAmountOut: quoteData?.minReceived || "0",
        slippage,
      });
      return res.json();
    },
    onSuccess: (data: any) => {
      toast({
        title: "Swap Complete!",
        description: `Swapped ${amountIn} ${tokenIn.symbol} for ${formatAmount(data.amountOut)} ${tokenOut.symbol}`,
      });
      queryClient.invalidateQueries({ queryKey: ["/api/swap/recent"] });
      queryClient.invalidateQueries({ queryKey: ["/api/swap/info"] });
      setAmountIn("");
    },
    onError: (error: any) => {
      toast({
        title: "Swap Failed",
        description: error.message || "Failed to execute swap",
        variant: "destructive",
      });
    },
  });

  const switchTokens = () => {
    const temp = tokenIn;
    setTokenIn(tokenOut);
    setTokenOut(temp);
    setAmountIn("");
  };

  const selectToken = (token: TokenInfo) => {
    if (selectingToken === "in") {
      if (token.symbol === tokenOut.symbol) {
        setTokenOut(tokenIn);
      }
      setTokenIn(token);
    } else if (selectingToken === "out") {
      if (token.symbol === tokenIn.symbol) {
        setTokenIn(tokenOut);
      }
      setTokenOut(token);
    }
    setSelectingToken(null);
    setAmountIn("");
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
            <Badge variant="outline" className="border-primary/50 text-primary text-[10px] hidden sm:flex">DEX</Badge>
            <WalletButton />
            <Link href="/">
              <Button variant="ghost" size="sm" className="h-8 text-xs px-2 hover:bg-white/5">
                <ArrowLeft className="w-3 h-3" />
                <span className="hidden sm:inline ml-1">Back</span>
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
                className="p-2 rounded-xl bg-primary/20 border border-primary/30"
                animate={{ 
                  boxShadow: ["0 0 20px rgba(0,255,255,0.2)", "0 0 40px rgba(0,255,255,0.4)", "0 0 20px rgba(0,255,255,0.2)"]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <ArrowUpDown className="w-5 h-5 text-primary" />
              </motion.div>
              <h1 className="text-2xl md:text-3xl font-display font-bold">
                DarkWave Swap
              </h1>
            </div>
            <p className="text-xs text-muted-foreground">
              Swap tokens instantly on DarkWave Smart Chain
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-3 gap-2 mb-6"
          >
            <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-center">
              <div className="text-lg font-bold text-primary">$0</div>
              <div className="text-[10px] text-muted-foreground">24h Volume</div>
            </div>
            <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-center">
              <div className="text-lg font-bold text-green-400">
                {swapInfo?.pairs?.length || 5}
              </div>
              <div className="text-[10px] text-muted-foreground">Trading Pairs</div>
            </div>
            <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-center">
              <div className="text-lg font-bold text-amber-400">0.3%</div>
              <div className="text-[10px] text-muted-foreground">Swap Fee</div>
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
                <div className="flex items-center justify-between mb-4">
                  <Tabs value={orderType} onValueChange={(v) => setOrderType(v as "market" | "limit")} className="w-auto">
                    <TabsList className="h-8">
                      <TabsTrigger value="market" className="text-xs px-3 h-6 gap-1" data-testid="tab-market">
                        <Zap className="w-3 h-3" />
                        Market
                      </TabsTrigger>
                      <TabsTrigger value="limit" className="text-xs px-3 h-6 gap-1" data-testid="tab-limit">
                        <Target className="w-3 h-3" />
                        Limit
                      </TabsTrigger>
                    </TabsList>
                  </Tabs>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    onClick={() => setShowSettings(!showSettings)}
                    data-testid="button-settings"
                  >
                    <Settings className="w-4 h-4" />
                  </Button>
                </div>

                <AnimatePresence>
                  {showSettings && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="mb-4 overflow-hidden"
                    >
                      <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                        <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-2">Slippage Tolerance</div>
                        <div className="flex gap-2">
                          {["0.1", "0.5", "1.0"].map((val) => (
                            <Button
                              key={val}
                              variant={slippage === val ? "default" : "outline"}
                              size="sm"
                              className="h-7 text-xs flex-1"
                              onClick={() => setSlippage(val)}
                            >
                              {val}%
                            </Button>
                          ))}
                          <Input
                            value={slippage}
                            onChange={(e) => setSlippage(e.target.value)}
                            className="h-7 w-16 text-xs text-center"
                            placeholder="%"
                          />
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {orderType === "market" ? (
                  <>
                  <div className="space-y-2">
                  <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] text-muted-foreground">You Pay</span>
                      <span className="text-[10px] text-muted-foreground">Balance: 0.00</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Input
                        type="number"
                        value={amountIn}
                        onChange={(e) => setAmountIn(e.target.value)}
                        placeholder="0.0"
                        className="flex-1 h-12 text-xl font-bold bg-transparent border-none p-0 focus-visible:ring-0"
                        data-testid="input-amount-in"
                      />
                      <button
                        onClick={() => setSelectingToken("in")}
                        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/10 hover:bg-white/15 transition-colors"
                        data-testid="button-select-token-in"
                      >
                        <span className="text-lg">{tokenIn.icon}</span>
                        <span className="font-bold text-sm">{tokenIn.symbol}</span>
                        <ChevronDown className="w-3 h-3 text-muted-foreground" />
                      </button>
                    </div>
                  </div>

                  <div className="flex justify-center -my-1 relative z-10">
                    <motion.button
                      onClick={switchTokens}
                      className="p-2 rounded-full bg-background border border-white/10 hover:border-primary/50 transition-colors"
                      whileHover={{ rotate: 180 }}
                      transition={{ duration: 0.3 }}
                      data-testid="button-switch"
                    >
                      <ArrowUpDown className="w-4 h-4 text-primary" />
                    </motion.button>
                  </div>

                  <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] text-muted-foreground">You Receive</span>
                      <span className="text-[10px] text-muted-foreground">Balance: 0.00</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex-1 h-12 flex items-center">
                        {quoteLoading ? (
                          <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
                        ) : (
                          <span className="text-xl font-bold text-muted-foreground">
                            {quoteData ? formatAmount(quoteData.amountOut) : "0.0"}
                          </span>
                        )}
                      </div>
                      <button
                        onClick={() => setSelectingToken("out")}
                        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/10 hover:bg-white/15 transition-colors"
                        data-testid="button-select-token-out"
                      >
                        <span className="text-lg">{tokenOut.icon}</span>
                        <span className="font-bold text-sm">{tokenOut.symbol}</span>
                        <ChevronDown className="w-3 h-3 text-muted-foreground" />
                      </button>
                    </div>
                  </div>
                </div>

                  {amountIn && parseFloat(amountIn) > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-3 p-3 rounded-lg bg-primary/10 border border-primary/20"
                    >
                      <div className="space-y-1 text-xs">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Rate</span>
                          <span>1 {tokenIn.symbol} = ~0.001 {tokenOut.symbol}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Price Impact</span>
                          <span className="text-green-400">{quoteData?.priceImpact || "<0.01"}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Min. Received</span>
                          <span>{quoteData ? formatAmount(quoteData.minReceived) : "0"} {tokenOut.symbol}</span>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  <Button
                    className="w-full h-11 mt-4 text-sm font-bold bg-gradient-to-r from-primary to-cyan-400 text-black"
                    onClick={() => swapMutation.mutate()}
                    disabled={swapMutation.isPending || !amountIn || parseFloat(amountIn) <= 0}
                    data-testid="button-swap"
                  >
                    {swapMutation.isPending ? (
                      <span className="flex items-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Swapping...
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4" />
                        Swap
                      </span>
                    )}
                  </Button>
                  </>
                ) : (
                  <div className="space-y-4">
                    <LimitOrderForm
                      tokenIn={tokenIn}
                      tokenOut={tokenOut}
                      onTokenInClick={() => setSelectingToken("in")}
                      onTokenOutClick={() => setSelectingToken("out")}
                    />
                    <div className="border-t border-white/10 pt-4">
                      <div className="flex items-center gap-2 mb-3">
                        <Clock className="w-4 h-4 text-primary" />
                        <h3 className="font-semibold text-sm">Your Limit Orders</h3>
                      </div>
                      <LimitOrdersList />
                    </div>
                  </div>
                )}
              </div>
            </GlassCard>
          </motion.div>

          <AnimatePresence>
            {selectingToken && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
                onClick={() => setSelectingToken(null)}
              >
                <motion.div
                  initial={{ scale: 0.9, y: 20 }}
                  animate={{ scale: 1, y: 0 }}
                  exit={{ scale: 0.9, y: 20 }}
                  className="w-full max-w-sm bg-background rounded-2xl border border-white/10 p-4"
                  onClick={(e) => e.stopPropagation()}
                >
                  <h3 className="font-bold text-lg mb-4">Select Token</h3>
                  <div className="space-y-2">
                    {TOKENS.map((token) => (
                      <button
                        key={token.symbol}
                        onClick={() => selectToken(token)}
                        className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-white/10 transition-colors"
                        data-testid={`token-option-${token.symbol}`}
                      >
                        <span className="text-2xl">{token.icon}</span>
                        <div className="text-left">
                          <div className="font-bold">{token.symbol}</div>
                          <div className="text-xs text-muted-foreground">{token.name}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Collapsible open={recentOpen} onOpenChange={setRecentOpen}>
              <GlassCard glow>
                <CollapsibleTrigger className="w-full p-3 flex items-center justify-between hover:bg-white/5 rounded-xl transition-colors">
                  <div className="flex items-center gap-2">
                    <RefreshCw className="w-4 h-4 text-primary" />
                    <span className="font-bold text-sm">Recent Swaps</span>
                    <Badge variant="secondary" className="text-[10px] ml-1">
                      {recentSwaps?.swaps?.length || 0}
                    </Badge>
                  </div>
                  <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${recentOpen ? "rotate-180" : ""}`} />
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className="px-3 pb-3 pt-1 border-t border-white/5 mt-1">
                    {!recentSwaps?.swaps?.length ? (
                      <div className="text-center py-6">
                        <ArrowUpDown className="w-8 h-8 text-white/20 mx-auto mb-2" />
                        <p className="text-xs text-muted-foreground">No swaps yet</p>
                        <p className="text-[10px] text-muted-foreground mt-1">Your trades will appear here</p>
                      </div>
                    ) : (
                      <div className="space-y-2 max-h-48 overflow-y-auto">
                        {recentSwaps.swaps.slice(0, 10).map((swap: any) => (
                          <div
                            key={swap.id}
                            className="flex items-center justify-between p-2 bg-white/5 rounded-lg text-xs"
                          >
                            <div className="flex items-center gap-2">
                              <TrendingUp className="w-3 h-3 text-green-400" />
                              <span>{formatAmount(swap.amountIn)} {swap.tokenIn}</span>
                              <ArrowUpDown className="w-3 h-3 text-muted-foreground" />
                              <span>{formatAmount(swap.amountOut)} {swap.tokenOut}</span>
                            </div>
                            <Badge variant="outline" className="text-[9px] border-green-500/50 text-green-400">
                              {swap.status}
                            </Badge>
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
            className="mt-4"
          >
            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <p className="text-[10px] text-amber-200">
                  <strong className="text-amber-300">Testnet:</strong> This DEX operates on DarkWave testnet. Trade with test tokens only.
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
