import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Link } from "wouter";
import {
  Rocket, Plus, TrendingUp, Users, DollarSign,
  Search, Filter, ChevronDown, Sparkles, Loader2, ExternalLink,
  Twitter, Globe, Send, CheckCircle, Clock, Lock, Droplets, Info
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
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import orbitLogo from "@assets/generated_images/futuristic_abstract_geometric_logo_symbol_for_orbit.png";

interface LaunchedToken {
  id: string;
  name: string;
  symbol: string;
  description?: string;
  imageUrl?: string;
  totalSupply: string;
  initialPrice: string;
  currentPrice: string;
  marketCap: string;
  holders: number;
  status: string;
  launchType: string;
  createdAt: string;
}

const SAMPLE_TOKENS: LaunchedToken[] = [
  { id: "1", name: "MoonDoge", symbol: "MDOGE", description: "Community-driven meme token", totalSupply: "1000000000", initialPrice: "0.0001", currentPrice: "0.00025", marketCap: "250000", holders: 1284, status: "live", launchType: "fair", createdAt: new Date().toISOString() },
  { id: "2", name: "DarkWave AI", symbol: "DWAI", description: "AI-powered DeFi protocols", totalSupply: "100000000", initialPrice: "0.01", currentPrice: "0.045", marketCap: "4500000", holders: 3421, status: "live", launchType: "presale", createdAt: new Date().toISOString() },
  { id: "3", name: "GreenChain", symbol: "GREEN", description: "Carbon credit tokenization", totalSupply: "500000000", initialPrice: "0.005", currentPrice: "0.008", marketCap: "4000000", holders: 892, status: "live", launchType: "fair", createdAt: new Date().toISOString() },
];

function TokenCard({ token }: { token: LaunchedToken }) {
  const priceChange = ((parseFloat(token.currentPrice) - parseFloat(token.initialPrice)) / parseFloat(token.initialPrice) * 100).toFixed(1);
  const isPositive = parseFloat(priceChange) >= 0;
  
  return (
    <GlassCard className="h-full">
      <div className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/30 to-purple-500/30 flex items-center justify-center text-sm font-bold">
              {token.symbol.slice(0, 2)}
            </div>
            <div>
              <h3 className="font-bold text-white text-sm">{token.name}</h3>
              <p className="text-[10px] text-muted-foreground">${token.symbol}</p>
            </div>
          </div>
          <Badge className={`text-[9px] ${token.status === 'live' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
            {token.status}
          </Badge>
        </div>
        
        <p className="text-[11px] text-muted-foreground mb-3 line-clamp-2">{token.description}</p>
        
        <div className="grid grid-cols-2 gap-2 mb-3">
          <div className="p-2 rounded-lg bg-white/5">
            <div className="text-[9px] text-muted-foreground">Price</div>
            <div className="text-xs font-bold text-white">${token.currentPrice}</div>
          </div>
          <div className="p-2 rounded-lg bg-white/5">
            <div className="text-[9px] text-muted-foreground">Change</div>
            <div className={`text-xs font-bold ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
              {isPositive ? '+' : ''}{priceChange}%
            </div>
          </div>
        </div>
        
        <div className="flex items-center justify-between text-[10px] text-muted-foreground">
          <div className="flex items-center gap-1">
            <Users className="w-3 h-3" />
            {token.holders.toLocaleString()} holders
          </div>
          <div className="flex items-center gap-1">
            <DollarSign className="w-3 h-3" />
            ${parseInt(token.marketCap).toLocaleString()}
          </div>
        </div>
      </div>
    </GlassCard>
  );
}

export default function Launchpad() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [createOpen, setCreateOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [formData, setFormData] = useState({
    name: "", symbol: "", description: "", totalSupply: "1000000000",
    initialPrice: "0.001", launchType: "fair", website: "", twitter: "", telegram: "",
    autoLiquidityPercent: 75, lpLockDays: 90, softCap: "1000", hardCap: "100000"
  });
  
  const PLATFORM_FEE = 2.5; // DarkWave platform fee %
  const creatorReceives = 100 - PLATFORM_FEE - formData.autoLiquidityPercent;

  const { data: tokensData, isLoading } = useQuery<{ tokens: LaunchedToken[] }>({
    queryKey: ["/api/launchpad/tokens"],
  });

  const tokens = tokensData?.tokens?.length ? tokensData.tokens : SAMPLE_TOKENS;
  const filteredTokens = tokens.filter(t => 
    t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.symbol.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const createMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/launchpad/create", formData);
      return res.json();
    },
    onSuccess: () => {
      toast({ title: "Token Created!", description: "Your token is now pending review with auto-liquidity enabled" });
      queryClient.invalidateQueries({ queryKey: ["/api/launchpad/tokens"] });
      setCreateOpen(false);
      setFormData({ name: "", symbol: "", description: "", totalSupply: "1000000000", initialPrice: "0.001", launchType: "fair", website: "", twitter: "", telegram: "", autoLiquidityPercent: 75, lpLockDays: 90, softCap: "1000", hardCap: "100000" });
    },
    onError: (error: any) => {
      toast({ title: "Creation Failed", description: error.message, variant: "destructive" });
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
            <Badge variant="outline" className="border-pink-500/50 text-pink-400 text-[10px]">Launchpad</Badge>
            <BackButton />
          </div>
        </div>
      </nav>

      <main className="flex-1 pt-16 pb-8 px-4">
        <div className="container mx-auto max-w-6xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
            <div className="flex items-center justify-center gap-2 mb-3">
              <motion.div className="p-2 rounded-xl bg-pink-500/20 border border-pink-500/30" animate={{ scale: [1, 1.05, 1] }} transition={{ duration: 2, repeat: Infinity }}>
                <Rocket className="w-6 h-6 text-pink-400" />
              </motion.div>
            </div>
            <h1 className="text-2xl md:text-3xl font-display font-bold mb-2">
              Token <span className="text-pink-400">Launchpad</span>
            </h1>
            <p className="text-sm text-muted-foreground max-w-md mx-auto">
              Launch your own token on DarkWave Smart Chain. Fair launches, presales, and more.
            </p>
          </motion.div>

          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="Search tokens..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-9 bg-white/5 border-white/10" data-testid="input-search-tokens" />
            </div>
            
            <div className="flex gap-2">
              <Collapsible open={filterOpen} onOpenChange={setFilterOpen} className="sm:hidden w-full">
                <CollapsibleTrigger asChild>
                  <Button variant="outline" className="flex-1 border-white/10">
                    <Filter className="w-4 h-4 mr-2" /> Filter <ChevronDown className={`w-4 h-4 ml-2 transition-transform ${filterOpen ? 'rotate-180' : ''}`} />
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="mt-2">
                  <div className="p-3 rounded-lg bg-white/5 space-y-2">
                    <Badge variant="outline" className="mr-2 cursor-pointer">All</Badge>
                    <Badge variant="outline" className="mr-2 cursor-pointer">Live</Badge>
                    <Badge variant="outline" className="mr-2 cursor-pointer">Presale</Badge>
                    <Badge variant="outline" className="cursor-pointer">Ended</Badge>
                  </div>
                </CollapsibleContent>
              </Collapsible>
              
              <Dialog open={createOpen} onOpenChange={setCreateOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-pink-500 hover:bg-pink-600 shrink-0" data-testid="button-create-token">
                    <Plus className="w-4 h-4 mr-2" /> Create Token
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto bg-background border-white/10">
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                      <Rocket className="w-5 h-5 text-pink-400" /> Launch Your Token
                    </DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 mt-4">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label className="text-xs">Token Name</Label>
                        <Input placeholder="My Token" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="bg-white/5 border-white/10" data-testid="input-token-name" />
                      </div>
                      <div>
                        <Label className="text-xs">Symbol</Label>
                        <Input placeholder="MTK" value={formData.symbol} onChange={(e) => setFormData({...formData, symbol: e.target.value.toUpperCase()})} className="bg-white/5 border-white/10" data-testid="input-token-symbol" />
                      </div>
                    </div>
                    <div>
                      <Label className="text-xs">Description</Label>
                      <Textarea placeholder="Describe your token..." value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} className="bg-white/5 border-white/10 min-h-[80px]" data-testid="input-token-description" />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label className="text-xs">Total Supply</Label>
                        <Input type="number" value={formData.totalSupply} onChange={(e) => setFormData({...formData, totalSupply: e.target.value})} className="bg-white/5 border-white/10" />
                      </div>
                      <div>
                        <Label className="text-xs">Initial Price (USD)</Label>
                        <Input type="number" step="0.0001" value={formData.initialPrice} onChange={(e) => setFormData({...formData, initialPrice: e.target.value})} className="bg-white/5 border-white/10" />
                      </div>
                    </div>
                    <div>
                      <Label className="text-xs">Launch Type</Label>
                      <Select value={formData.launchType} onValueChange={(v) => setFormData({...formData, launchType: v})}>
                        <SelectTrigger className="bg-white/5 border-white/10">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="fair">Fair Launch</SelectItem>
                          <SelectItem value="presale">Presale</SelectItem>
                          <SelectItem value="auction">Auction</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <div>
                        <Label className="text-xs flex items-center gap-1"><Globe className="w-3 h-3" /> Website</Label>
                        <Input placeholder="https://" value={formData.website} onChange={(e) => setFormData({...formData, website: e.target.value})} className="bg-white/5 border-white/10 text-xs" />
                      </div>
                      <div>
                        <Label className="text-xs flex items-center gap-1"><Twitter className="w-3 h-3" /> Twitter</Label>
                        <Input placeholder="@handle" value={formData.twitter} onChange={(e) => setFormData({...formData, twitter: e.target.value})} className="bg-white/5 border-white/10 text-xs" />
                      </div>
                      <div>
                        <Label className="text-xs flex items-center gap-1"><Send className="w-3 h-3" /> Telegram</Label>
                        <Input placeholder="t.me/..." value={formData.telegram} onChange={(e) => setFormData({...formData, telegram: e.target.value})} className="bg-white/5 border-white/10 text-xs" />
                      </div>
                    </div>
                    
                    <div className="p-3 rounded-lg bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/30">
                      <div className="flex items-center gap-2 mb-3">
                        <Droplets className="w-4 h-4 text-blue-400" />
                        <span className="font-semibold text-sm text-white">Auto-Liquidity Settings</span>
                      </div>
                      
                      <div className="space-y-3">
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <Label className="text-xs">Liquidity Allocation</Label>
                            <span className="text-xs text-blue-400 font-medium">{formData.autoLiquidityPercent}%</span>
                          </div>
                          <input
                            type="range"
                            min="50"
                            max="95"
                            value={formData.autoLiquidityPercent}
                            onChange={(e) => setFormData({...formData, autoLiquidityPercent: parseInt(e.target.value)})}
                            className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-blue-500"
                            data-testid="slider-auto-liquidity"
                          />
                          <div className="flex justify-between text-[9px] text-muted-foreground mt-1">
                            <span>50% Min</span>
                            <span>95% Max</span>
                          </div>
                        </div>
                        
                        <div>
                          <Label className="text-xs flex items-center gap-1">
                            <Lock className="w-3 h-3" /> LP Lock Duration
                          </Label>
                          <Select value={formData.lpLockDays.toString()} onValueChange={(v) => setFormData({...formData, lpLockDays: parseInt(v)})}>
                            <SelectTrigger className="bg-white/5 border-white/10 mt-1">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="30">30 Days</SelectItem>
                              <SelectItem value="90">90 Days (Recommended)</SelectItem>
                              <SelectItem value="180">180 Days</SelectItem>
                              <SelectItem value="365">1 Year</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <Label className="text-xs">Soft Cap (DWC)</Label>
                            <Input type="number" value={formData.softCap} onChange={(e) => setFormData({...formData, softCap: e.target.value})} className="bg-white/5 border-white/10 text-xs" />
                          </div>
                          <div>
                            <Label className="text-xs">Hard Cap (DWC)</Label>
                            <Input type="number" value={formData.hardCap} onChange={(e) => setFormData({...formData, hardCap: e.target.value})} className="bg-white/5 border-white/10 text-xs" />
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                      <div className="flex items-center gap-1 mb-2">
                        <Info className="w-3 h-3 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">Fund Distribution</span>
                      </div>
                      <div className="space-y-1 text-xs">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Platform Fee</span>
                          <span className="text-amber-400">{PLATFORM_FEE}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Auto-Liquidity (Locked)</span>
                          <span className="text-blue-400">{formData.autoLiquidityPercent}%</span>
                        </div>
                        <div className="flex justify-between border-t border-white/10 pt-1 mt-1">
                          <span className="text-white font-medium">You Receive</span>
                          <span className="text-green-400 font-medium">{creatorReceives.toFixed(1)}%</span>
                        </div>
                      </div>
                    </div>
                    
                    <Button className="w-full bg-pink-500 hover:bg-pink-600" onClick={() => createMutation.mutate()} disabled={createMutation.isPending || !formData.name || !formData.symbol} data-testid="button-submit-token">
                      {createMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Rocket className="w-4 h-4 mr-2" />}
                      Launch Token
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          <Tabs defaultValue="all" className="w-full">
            <TabsList className="bg-white/5 border border-white/10 mb-6 w-full sm:w-auto overflow-x-auto flex-nowrap">
              <TabsTrigger value="all" className="text-xs flex-1 sm:flex-initial">All Tokens</TabsTrigger>
              <TabsTrigger value="trending" className="text-xs flex-1 sm:flex-initial">Trending</TabsTrigger>
              <TabsTrigger value="new" className="text-xs flex-1 sm:flex-initial">New</TabsTrigger>
            </TabsList>
            
            <TabsContent value="all">
              {isLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[1,2,3].map(i => (
                    <div key={i} className="h-48 rounded-xl bg-white/5 animate-pulse" />
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredTokens.map(token => (
                    <TokenCard key={token.id} token={token} />
                  ))}
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="trending">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredTokens.slice(0, 3).map(token => (
                  <TokenCard key={token.id} token={token} />
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="new">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredTokens.slice(-2).map(token => (
                  <TokenCard key={token.id} token={token} />
                ))}
              </div>
            </TabsContent>
          </Tabs>

          <GlassCard className="mt-8" glow>
            <div className="p-6 text-center">
              <Sparkles className="w-8 h-8 text-pink-400 mx-auto mb-3" />
              <h3 className="text-lg font-bold mb-2">Launch Fee: 0 DWC</h3>
              <p className="text-sm text-muted-foreground mb-4">Free launches during beta. Standard 1% trading fee applies after launch.</p>
              <div className="flex flex-wrap justify-center gap-4 text-xs text-muted-foreground">
                <div className="flex items-center gap-1"><CheckCircle className="w-4 h-4 text-green-400" /> Instant deployment</div>
                <div className="flex items-center gap-1"><CheckCircle className="w-4 h-4 text-green-400" /> Auto liquidity</div>
                <div className="flex items-center gap-1"><CheckCircle className="w-4 h-4 text-green-400" /> Anti-rug protection</div>
              </div>
            </div>
          </GlassCard>
        </div>
      </main>
      <Footer />
    </div>
  );
}
