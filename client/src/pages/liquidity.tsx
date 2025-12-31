import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Link } from "wouter";
import {
  Droplets, Plus, TrendingUp, Percent, DollarSign,
  ArrowUpDown, ChevronDown, Loader2, Info, Minus, BarChart3
} from "lucide-react";
import { BackButton } from "@/components/page-nav";
import { Footer } from "@/components/footer";
import { GlassCard } from "@/components/glass-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import orbitLogo from "@assets/generated_images/futuristic_abstract_geometric_logo_symbol_for_orbit.png";
import { WalletButton } from "@/components/wallet-button";

interface LiquidityPool {
  id: string;
  tokenA: string;
  tokenB: string;
  reserveA: string;
  reserveB: string;
  tvl: string;
  apr: string;
  volume24h: string;
  fee: string;
}

interface Position {
  id: string;
  poolId: string;
  tokenA: string;
  tokenB: string;
  lpTokens: string;
  sharePercent: string;
  earnedFees: string;
}


function PoolCard({ pool, onAddLiquidity }: { pool: LiquidityPool; onAddLiquidity: () => void }) {
  const [expanded, setExpanded] = useState(false);
  
  return (
    <Collapsible open={expanded} onOpenChange={setExpanded}>
      <GlassCard className="overflow-hidden">
        <CollapsibleTrigger className="w-full text-left">
          <div className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="flex -space-x-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-cyan-400 flex items-center justify-center text-[10px] font-bold border-2 border-background z-10">
                    {pool.tokenA.slice(0, 2)}
                  </div>
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-[10px] font-bold border-2 border-background">
                    {pool.tokenB.slice(0, 2)}
                  </div>
                </div>
                <div>
                  <h3 className="font-bold text-white text-sm">{pool.tokenA}/{pool.tokenB}</h3>
                  <p className="text-[10px] text-muted-foreground">{pool.fee}% fee</p>
                </div>
              </div>
              <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${expanded ? 'rotate-180' : ''}`} />
            </div>
            
            <div className="grid grid-cols-3 gap-2">
              <div className="p-2 rounded-lg bg-white/5 text-center">
                <div className="text-[9px] text-muted-foreground">TVL</div>
                <div className="text-xs font-bold text-white">${parseInt(pool.tvl).toLocaleString()}</div>
              </div>
              <div className="p-2 rounded-lg bg-white/5 text-center">
                <div className="text-[9px] text-muted-foreground">APR</div>
                <div className="text-xs font-bold text-green-400">{pool.apr}%</div>
              </div>
              <div className="p-2 rounded-lg bg-white/5 text-center">
                <div className="text-[9px] text-muted-foreground">24h Vol</div>
                <div className="text-xs font-bold text-white">${parseInt(pool.volume24h).toLocaleString()}</div>
              </div>
            </div>
          </div>
        </CollapsibleTrigger>
        
        <CollapsibleContent>
          <div className="px-4 pb-4 pt-2 border-t border-white/5">
            <div className="grid grid-cols-2 gap-2 mb-3 text-xs">
              <div>
                <span className="text-muted-foreground">Pooled {pool.tokenA}:</span>
                <span className="text-white ml-1">{parseInt(pool.reserveA).toLocaleString()}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Pooled {pool.tokenB}:</span>
                <span className="text-white ml-1">{parseInt(pool.reserveB).toLocaleString()}</span>
              </div>
            </div>
            <Button className="w-full bg-green-500 hover:bg-green-600" size="sm" onClick={onAddLiquidity} data-testid={`button-add-liquidity-${pool.id}`}>
              <Plus className="w-4 h-4 mr-2" /> Add Liquidity
            </Button>
          </div>
        </CollapsibleContent>
      </GlassCard>
    </Collapsible>
  );
}

function PositionCard({ position }: { position: Position }) {
  return (
    <GlassCard>
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="flex -space-x-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-cyan-400 flex items-center justify-center text-[10px] font-bold border-2 border-background z-10">
                {position.tokenA.slice(0, 2)}
              </div>
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-[10px] font-bold border-2 border-background">
                {position.tokenB.slice(0, 2)}
              </div>
            </div>
            <div>
              <h3 className="font-bold text-white text-sm">{position.tokenA}/{position.tokenB}</h3>
              <p className="text-[10px] text-muted-foreground">{position.sharePercent}% pool share</p>
            </div>
          </div>
          <Badge className="bg-green-500/20 text-green-400 text-[9px]">Active</Badge>
        </div>
        
        <div className="grid grid-cols-2 gap-2 mb-3">
          <div className="p-2 rounded-lg bg-white/5 text-center">
            <div className="text-[9px] text-muted-foreground">LP Tokens</div>
            <div className="text-xs font-bold text-white">{position.lpTokens}</div>
          </div>
          <div className="p-2 rounded-lg bg-white/5 text-center">
            <div className="text-[9px] text-muted-foreground">Earned Fees</div>
            <div className="text-xs font-bold text-green-400">${position.earnedFees}</div>
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="flex-1 border-white/10 text-xs" data-testid={`button-remove-liquidity-${position.id}`}>
            <Minus className="w-3 h-3 mr-1" /> Remove
          </Button>
          <Button size="sm" className="flex-1 bg-primary hover:bg-primary/90 text-xs" data-testid={`button-claim-fees-${position.id}`}>
            Claim Fees
          </Button>
        </div>
      </div>
    </GlassCard>
  );
}

export default function Liquidity() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [addOpen, setAddOpen] = useState(false);
  const [selectedPool, setSelectedPool] = useState<LiquidityPool | null>(null);
  const [amountA, setAmountA] = useState("");
  const [amountB, setAmountB] = useState("");

  const handleAmountAChange = (value: string) => {
    setAmountA(value);
    if (selectedPool && value && parseFloat(value) > 0) {
      const reserveA = parseFloat(selectedPool.reserveA) || 1;
      const reserveB = parseFloat(selectedPool.reserveB) || 1;
      const ratio = reserveB / reserveA;
      const calculatedB = (parseFloat(value) * ratio).toFixed(6);
      setAmountB(calculatedB);
    } else if (!value) {
      setAmountB("");
    }
  };

  const handleAmountBChange = (value: string) => {
    setAmountB(value);
    if (selectedPool && value && parseFloat(value) > 0) {
      const reserveA = parseFloat(selectedPool.reserveA) || 1;
      const reserveB = parseFloat(selectedPool.reserveB) || 1;
      const ratio = reserveA / reserveB;
      const calculatedA = (parseFloat(value) * ratio).toFixed(6);
      setAmountA(calculatedA);
    } else if (!value) {
      setAmountA("");
    }
  };

  const { data: poolsData, isLoading: poolsLoading } = useQuery<{ pools: LiquidityPool[] }>({
    queryKey: ["/api/liquidity/pools"],
  });

  const { data: positionsData } = useQuery<{ positions: Position[] }>({
    queryKey: ["/api/liquidity/positions"],
  });

  const pools = poolsData?.pools || [];
  const positions = positionsData?.positions || [];

  const addLiquidityMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/liquidity/add", {
        poolId: selectedPool?.id,
        amountA,
        amountB,
      });
      return res.json();
    },
    onSuccess: () => {
      toast({ title: "Liquidity Added!", description: "You've received LP tokens" });
      queryClient.invalidateQueries({ queryKey: ["/api/liquidity"] });
      setAddOpen(false);
      setAmountA("");
      setAmountB("");
    },
    onError: (error: any) => {
      toast({ title: "Failed", description: error.message, variant: "destructive" });
    },
  });

  const openAddLiquidity = (pool: LiquidityPool) => {
    setSelectedPool(pool);
    setAddOpen(true);
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
            <Badge variant="outline" className="border-green-500/50 text-green-400 text-[10px]">Liquidity</Badge>
            <BackButton />
          </div>
        </div>
      </nav>

      <main className="flex-1 pt-16 pb-8 px-4">
        <div className="container mx-auto max-w-4xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
            <div className="flex items-center justify-center gap-2 mb-3">
              <motion.div className="p-2 rounded-xl bg-green-500/20 border border-green-500/30" animate={{ scale: [1, 1.05, 1] }} transition={{ duration: 2, repeat: Infinity }}>
                <Droplets className="w-6 h-6 text-green-400" />
              </motion.div>
            </div>
            <h1 className="text-2xl md:text-3xl font-display font-bold mb-2">
              Liquidity <span className="text-green-400">Pools</span>
            </h1>
            <p className="text-sm text-muted-foreground max-w-md mx-auto">
              Provide liquidity to earn trading fees. Add to pools and earn passive income.
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
            <GlassCard hover={false}>
              <div className="p-3 text-center">
                <DollarSign className="w-5 h-5 text-primary mx-auto mb-1" />
                <div className="text-lg font-bold text-white">$5.1M</div>
                <div className="text-[10px] text-muted-foreground">Total TVL</div>
              </div>
            </GlassCard>
            <GlassCard hover={false}>
              <div className="p-3 text-center">
                <BarChart3 className="w-5 h-5 text-blue-400 mx-auto mb-1" />
                <div className="text-lg font-bold text-white">$1.1M</div>
                <div className="text-[10px] text-muted-foreground">24h Volume</div>
              </div>
            </GlassCard>
            <GlassCard hover={false}>
              <div className="p-3 text-center">
                <Percent className="w-5 h-5 text-green-400 mx-auto mb-1" />
                <div className="text-lg font-bold text-green-400">39.6%</div>
                <div className="text-[10px] text-muted-foreground">Avg APR</div>
              </div>
            </GlassCard>
            <GlassCard hover={false}>
              <div className="p-3 text-center">
                <Droplets className="w-5 h-5 text-purple-400 mx-auto mb-1" />
                <div className="text-lg font-bold text-white">{pools.length}</div>
                <div className="text-[10px] text-muted-foreground">Active Pools</div>
              </div>
            </GlassCard>
          </div>

          <Tabs defaultValue="pools" className="w-full">
            <TabsList className="bg-white/5 border border-white/10 mb-6 w-full">
              <TabsTrigger value="pools" className="flex-1 text-xs">All Pools</TabsTrigger>
              <TabsTrigger value="positions" className="flex-1 text-xs">Your Positions</TabsTrigger>
            </TabsList>
            
            <TabsContent value="pools">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {pools.map(pool => (
                  <PoolCard key={pool.id} pool={pool} onAddLiquidity={() => openAddLiquidity(pool)} />
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="positions">
              {positions.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {positions.map(position => (
                    <PositionCard key={position.id} position={position} />
                  ))}
                </div>
              ) : (
                <GlassCard>
                  <div className="p-8 text-center">
                    <Droplets className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                    <h3 className="font-bold text-white mb-2">No Positions Yet</h3>
                    <p className="text-sm text-muted-foreground mb-4">Add liquidity to a pool to start earning fees</p>
                    <Button className="bg-green-500 hover:bg-green-600">
                      <Plus className="w-4 h-4 mr-2" /> Add Liquidity
                    </Button>
                  </div>
                </GlassCard>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent className="max-w-sm bg-background border-white/10">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Plus className="w-5 h-5 text-green-400" /> Add Liquidity
            </DialogTitle>
          </DialogHeader>
          {selectedPool && (
            <div className="space-y-4 mt-4">
              <div className="p-3 rounded-lg bg-white/5 flex items-center justify-center gap-2">
                <span className="font-bold">{selectedPool.tokenA}</span>
                <ArrowUpDown className="w-4 h-4 text-muted-foreground" />
                <span className="font-bold">{selectedPool.tokenB}</span>
              </div>
              
              <div>
                <Label className="text-xs">{selectedPool.tokenA} Amount</Label>
                <Input type="number" placeholder="0.0" value={amountA} onChange={(e) => handleAmountAChange(e.target.value)} className="bg-white/5 border-white/10" data-testid="input-amount-a" />
              </div>
              
              <div>
                <Label className="text-xs">{selectedPool.tokenB} Amount</Label>
                <Input type="number" placeholder="0.0" value={amountB} onChange={(e) => handleAmountBChange(e.target.value)} className="bg-white/5 border-white/10" data-testid="input-amount-b" />
              </div>
              
              <div className="p-3 rounded-lg bg-white/5 text-xs space-y-1">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Pool APR</span>
                  <span className="text-green-400 font-bold">{selectedPool.apr}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Fee Tier</span>
                  <span>{selectedPool.fee}%</span>
                </div>
              </div>
              
              <Button className="w-full bg-green-500 hover:bg-green-600" onClick={() => addLiquidityMutation.mutate()} disabled={addLiquidityMutation.isPending || !amountA || !amountB} data-testid="button-confirm-add-liquidity">
                {addLiquidityMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Plus className="w-4 h-4 mr-2" />}
                Add Liquidity
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
}
