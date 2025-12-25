import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Coins, Sparkles, Crown, Gift, Star, Zap, Flame, ChevronRight, Check, Clock, Shield, CreditCard, TrendingUp, Award, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import { apiRequest } from "@/lib/queryClient";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface CoinPack {
  id: string;
  name: string;
  priceUsd: string;
  goldCoins: string;
  bonusSc: string;
}

interface SweepsBalance {
  goldCoins: string;
  sweepsCoins: string;
  totalGcPurchased: string;
  totalScEarned: string;
  totalScRedeemed: string;
}

export default function CoinStore() {
  const { user, isLoading: authLoading } = useAuth();
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedPack, setSelectedPack] = useState<CoinPack | null>(null);
  const [purchaseDialogOpen, setPurchaseDialogOpen] = useState(false);
  const [amoeDialogOpen, setAmoeDialogOpen] = useState(false);

  const { data: packs = [] } = useQuery<CoinPack[]>({
    queryKey: ["/api/sweeps/packs"],
  });

  const { data: balance } = useQuery<SweepsBalance>({
    queryKey: ["/api/sweeps/balance"],
    enabled: !!user,
  });

  const purchaseMutation = useMutation({
    mutationFn: async (packId: string) => {
      const res = await apiRequest("POST", "/api/sweeps/purchase", { packId });
      return res.json();
    },
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({ queryKey: ["/api/sweeps/balance"] });
      toast({
        title: "Purchase Complete!",
        description: `You received ${formatNumber(selectedPack?.goldCoins || "0")} GC + ${selectedPack?.bonusSc} FREE SC!`,
      });
      setPurchaseDialogOpen(false);
      setSelectedPack(null);
    },
    onError: (error: any) => {
      toast({
        title: "Purchase Failed",
        description: error.message || "Something went wrong",
        variant: "destructive",
      });
    },
  });

  const amoeMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/sweeps/amoe", { method: "mail" });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/sweeps/balance"] });
      toast({
        title: "Free Entry Claimed!",
        description: "5 SC has been added to your account!",
      });
      setAmoeDialogOpen(false);
    },
    onError: (error: any) => {
      toast({
        title: "Failed",
        description: error.message || "Could not process free entry",
        variant: "destructive",
      });
    },
  });

  const formatNumber = (num: string) => {
    return parseInt(num).toLocaleString();
  };

  const getPackIcon = (packId: string) => {
    switch (packId) {
      case "starter": return Coins;
      case "value": return Star;
      case "popular": return Zap;
      case "mega": return Flame;
      case "premium": return Crown;
      case "whale": return Sparkles;
      default: return Coins;
    }
  };

  const getPackGradient = (packId: string) => {
    switch (packId) {
      case "starter": return "from-blue-500/20 to-blue-600/10";
      case "value": return "from-green-500/20 to-emerald-600/10";
      case "popular": return "from-purple-500/20 to-violet-600/10";
      case "mega": return "from-orange-500/20 to-amber-600/10";
      case "premium": return "from-pink-500/20 to-rose-600/10";
      case "whale": return "from-yellow-400/20 to-amber-500/10";
      default: return "from-gray-500/20 to-gray-600/10";
    }
  };

  const getPackBorder = (packId: string) => {
    switch (packId) {
      case "starter": return "border-blue-500/30 hover:border-blue-400/50";
      case "value": return "border-green-500/30 hover:border-green-400/50";
      case "popular": return "border-purple-500/30 hover:border-purple-400/50 ring-2 ring-purple-500/20";
      case "mega": return "border-orange-500/30 hover:border-orange-400/50";
      case "premium": return "border-pink-500/30 hover:border-pink-400/50";
      case "whale": return "border-yellow-400/30 hover:border-yellow-300/50 ring-2 ring-yellow-400/20";
      default: return "border-gray-500/30 hover:border-gray-400/50";
    }
  };

  const handlePurchase = (pack: CoinPack) => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please login to purchase Gold Coins",
        variant: "destructive",
      });
      return;
    }
    setSelectedPack(pack);
    setPurchaseDialogOpen(true);
  };

  const confirmPurchase = () => {
    if (selectedPack) {
      purchaseMutation.mutate(selectedPack.id);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-purple-400">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a0f] via-[#12121a] to-[#0a0a0f] text-white">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-900/20 via-transparent to-transparent pointer-events-none" />
      
      <div className="relative z-10 container mx-auto px-4 py-8 max-w-6xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-yellow-200 via-yellow-400 to-yellow-200 bg-clip-text text-transparent flex items-center gap-3" data-testid="page-title-coin-store">
              <Coins className="w-10 h-10 text-yellow-400" />
              Coin Store
            </h1>
            <p className="text-gray-400 mt-2">Purchase Gold Coins to play games. Get FREE Sweeps Coins with every purchase!</p>
          </div>
          
          {user && balance && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-r from-purple-900/50 to-pink-900/50 backdrop-blur-xl rounded-2xl p-4 border border-purple-500/30"
            >
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center">
                    <Coins className="w-5 h-5 text-black" />
                  </div>
                  <div>
                    <div className="text-xs text-yellow-400/80">Gold Coins</div>
                    <div className="text-lg font-bold text-yellow-400" data-testid="balance-gc">{formatNumber(balance.goldCoins)}</div>
                  </div>
                </div>
                <div className="w-px h-10 bg-white/20" />
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="text-xs text-green-400/80">Sweeps Coins</div>
                    <div className="text-lg font-bold text-green-400" data-testid="balance-sc">{parseFloat(balance.sweepsCoins).toFixed(2)}</div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="bg-gradient-to-br from-purple-900/30 to-purple-900/10 border-purple-500/30 backdrop-blur-xl">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-purple-500/20 flex items-center justify-center">
                <Shield className="w-7 h-7 text-purple-400" />
              </div>
              <div>
                <h3 className="font-semibold text-white">Secure Payments</h3>
                <p className="text-sm text-gray-400">256-bit SSL encryption</p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-green-900/30 to-green-900/10 border-green-500/30 backdrop-blur-xl">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-green-500/20 flex items-center justify-center">
                <Gift className="w-7 h-7 text-green-400" />
              </div>
              <div>
                <h3 className="font-semibold text-white">FREE Sweeps Coins</h3>
                <p className="text-sm text-gray-400">Included with every purchase</p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-yellow-900/30 to-yellow-900/10 border-yellow-500/30 backdrop-blur-xl">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-yellow-500/20 flex items-center justify-center">
                <TrendingUp className="w-7 h-7 text-yellow-400" />
              </div>
              <div>
                <h3 className="font-semibold text-white">Redeem SC for Prizes</h3>
                <p className="text-sm text-gray-400">Win real DWC tokens</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <AnimatePresence>
            {packs.map((pack, index) => {
              const Icon = getPackIcon(pack.id);
              const isPopular = pack.id === "popular";
              const isWhale = pack.id === "whale";
              
              return (
                <motion.div
                  key={pack.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  data-testid={`pack-card-${pack.id}`}
                >
                  <Card className={`relative overflow-hidden bg-gradient-to-br ${getPackGradient(pack.id)} border ${getPackBorder(pack.id)} backdrop-blur-xl transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl cursor-pointer group`}
                    onClick={() => handlePurchase(pack)}>
                    {isPopular && (
                      <div className="absolute -top-1 -right-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg rounded-tr-lg">
                        MOST POPULAR
                      </div>
                    )}
                    {isWhale && (
                      <div className="absolute -top-1 -right-1 bg-gradient-to-r from-yellow-400 to-amber-500 text-black text-xs font-bold px-3 py-1 rounded-bl-lg rounded-tr-lg">
                        BEST VALUE
                      </div>
                    )}
                    
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <div className="w-14 h-14 rounded-2xl bg-black/30 flex items-center justify-center border border-white/10">
                          <Icon className={`w-7 h-7 ${isWhale ? 'text-yellow-400' : isPopular ? 'text-purple-400' : 'text-white/80'}`} />
                        </div>
                        <Badge variant="outline" className="bg-green-500/20 border-green-500/50 text-green-400">
                          +{pack.bonusSc} SC FREE
                        </Badge>
                      </div>
                      <CardTitle className="text-xl mt-3">{pack.name}</CardTitle>
                    </CardHeader>
                    
                    <CardContent className="pb-4">
                      <div className="flex items-baseline gap-2 mb-4">
                        <div className="flex items-center gap-1">
                          <Coins className="w-6 h-6 text-yellow-400" />
                          <span className="text-3xl font-bold text-yellow-400">{formatNumber(pack.goldCoins)}</span>
                        </div>
                        <span className="text-yellow-400/80">GC</span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="text-2xl font-bold text-white">${pack.priceUsd}</div>
                        <Button 
                          className={`${isWhale ? 'bg-gradient-to-r from-yellow-400 to-amber-500 text-black hover:from-yellow-300 hover:to-amber-400' : isPopular ? 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-400 hover:to-pink-400' : 'bg-white/10 hover:bg-white/20'} transition-all group-hover:scale-105`}
                          data-testid={`buy-button-${pack.id}`}
                        >
                          Buy Now <ChevronRight className="w-4 h-4 ml-1" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Card className="bg-gradient-to-r from-blue-900/30 via-purple-900/30 to-pink-900/30 border-blue-500/30 backdrop-blur-xl overflow-hidden">
            <CardContent className="p-6 md:p-8">
              <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-400 to-purple-600 flex items-center justify-center flex-shrink-0">
                  <Gift className="w-10 h-10 text-white" />
                </div>
                <div className="flex-1 text-center md:text-left">
                  <h3 className="text-2xl font-bold mb-2">Free Entry (No Purchase Necessary)</h3>
                  <p className="text-gray-400">
                    Get 5 FREE Sweeps Coins by sending a request via mail. As required by sweepstakes law, 
                    no purchase is necessary to obtain Sweeps Coins.
                  </p>
                </div>
                <Button 
                  variant="outline"
                  className="border-blue-500/50 hover:bg-blue-500/20 text-blue-400 whitespace-nowrap"
                  onClick={() => setAmoeDialogOpen(true)}
                  data-testid="amoe-button"
                >
                  Request Free Entry
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <div className="bg-black/30 rounded-2xl border border-white/10 p-6 md:p-8">
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Info className="w-5 h-5 text-purple-400" />
            How It Works
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-yellow-500/20 flex items-center justify-center flex-shrink-0">
                <span className="text-yellow-400 font-bold">1</span>
              </div>
              <div>
                <h4 className="font-semibold text-white mb-1">Buy Gold Coins</h4>
                <p className="text-sm text-gray-400">Purchase GC to play games for fun. FREE Sweeps Coins are included with every purchase!</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0">
                <span className="text-green-400 font-bold">2</span>
              </div>
              <div>
                <h4 className="font-semibold text-white mb-1">Play with SC</h4>
                <p className="text-sm text-gray-400">Use Sweeps Coins to play games. Winnings accumulate as SC in your balance.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                <span className="text-purple-400 font-bold">3</span>
              </div>
              <div>
                <h4 className="font-semibold text-white mb-1">Redeem for Prizes</h4>
                <p className="text-sm text-gray-400">Redeem SC for real DWC cryptocurrency tokens. Minimum 100 SC to redeem.</p>
              </div>
            </div>
          </div>
          
          <div className="mt-6 pt-6 border-t border-white/10 text-xs text-gray-500">
            <p className="mb-2">
              <strong className="text-gray-400">Sweepstakes Disclaimer:</strong> Gold Coins (GC) have no monetary value and cannot be redeemed for prizes. 
              Sweeps Coins (SC) are provided as a promotional bonus and can be redeemed for prizes where permitted by law. 
              No purchase necessary to obtain SC via the Alternate Method of Entry (AMOE).
            </p>
            <p>
              By purchasing, you agree to our <a href="/terms" className="text-purple-400 hover:underline">Terms of Service</a> and 
              <a href="/sweepstakes-rules" className="text-purple-400 hover:underline ml-1">Official Sweepstakes Rules</a>.
            </p>
          </div>
        </div>
      </div>

      <Dialog open={purchaseDialogOpen} onOpenChange={setPurchaseDialogOpen}>
        <DialogContent className="bg-gradient-to-br from-gray-900 to-gray-950 border-purple-500/30">
          <DialogHeader>
            <DialogTitle className="text-xl flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-purple-400" />
              Confirm Purchase
            </DialogTitle>
            <DialogDescription>
              Review your purchase details before proceeding.
            </DialogDescription>
          </DialogHeader>
          
          {selectedPack && (
            <div className="py-4">
              <div className="bg-black/30 rounded-xl p-4 mb-4">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-gray-400">Package</span>
                  <span className="font-semibold">{selectedPack.name}</span>
                </div>
                <div className="flex justify-between items-center mb-3">
                  <span className="text-gray-400">Gold Coins</span>
                  <span className="font-semibold text-yellow-400">{formatNumber(selectedPack.goldCoins)} GC</span>
                </div>
                <div className="flex justify-between items-center mb-3">
                  <span className="text-gray-400">FREE Bonus</span>
                  <span className="font-semibold text-green-400">+{selectedPack.bonusSc} SC</span>
                </div>
                <div className="border-t border-white/10 pt-3 mt-3 flex justify-between items-center">
                  <span className="text-gray-400">Total</span>
                  <span className="text-2xl font-bold">${selectedPack.priceUsd}</span>
                </div>
              </div>
              
              <div className="flex items-center gap-2 text-sm text-gray-400 mb-4">
                <Shield className="w-4 h-4 text-green-400" />
                <span>Secure payment processed by Stripe</span>
              </div>
            </div>
          )}
          
          <DialogFooter className="flex gap-3">
            <Button 
              variant="outline" 
              onClick={() => setPurchaseDialogOpen(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button 
              onClick={confirmPurchase}
              disabled={purchaseMutation.isPending}
              className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-400 hover:to-pink-400"
              data-testid="confirm-purchase-button"
            >
              {purchaseMutation.isPending ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                  Processing...
                </>
              ) : (
                <>
                  <Check className="w-4 h-4 mr-2" />
                  Complete Purchase
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={amoeDialogOpen} onOpenChange={setAmoeDialogOpen}>
        <DialogContent className="bg-gradient-to-br from-gray-900 to-gray-950 border-blue-500/30">
          <DialogHeader>
            <DialogTitle className="text-xl flex items-center gap-2">
              <Gift className="w-5 h-5 text-blue-400" />
              Free Entry (AMOE)
            </DialogTitle>
            <DialogDescription>
              Alternate Method of Entry - No purchase necessary
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <div className="bg-blue-500/10 rounded-xl p-4 mb-4 border border-blue-500/30">
              <h4 className="font-semibold mb-2">Request 5 FREE Sweeps Coins</h4>
              <p className="text-sm text-gray-400 mb-4">
                As required by sweepstakes law, you can obtain Sweeps Coins without making a purchase. 
                Send a handwritten request with your name and email to:
              </p>
              <div className="bg-black/30 rounded-lg p-3 text-sm">
                <p className="text-white font-mono">
                  DarkWave Studios, LLC<br/>
                  Attn: Free Entry Request<br/>
                  [Address TBD]
                </p>
              </div>
            </div>
            
            <p className="text-xs text-gray-500">
              For immediate credit (demo only), click the button below. 
              In production, actual mail verification will be required.
            </p>
          </div>
          
          <DialogFooter className="flex gap-3">
            <Button 
              variant="outline" 
              onClick={() => setAmoeDialogOpen(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button 
              onClick={() => amoeMutation.mutate()}
              disabled={amoeMutation.isPending || !user}
              className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-400 hover:to-purple-400"
              data-testid="claim-amoe-button"
            >
              {amoeMutation.isPending ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                  Processing...
                </>
              ) : !user ? (
                "Login Required"
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Claim 5 SC (Demo)
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
