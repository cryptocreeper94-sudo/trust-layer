import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { 
  ArrowLeft, Wallet, TrendingUp, TrendingDown, PieChart, 
  Coins, Lock, Gift, RefreshCw, ChevronDown, ExternalLink, BarChart3
} from "lucide-react";
import { Footer } from "@/components/footer";
import { GlassCard } from "@/components/glass-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import orbitLogo from "@assets/generated_images/futuristic_abstract_geometric_logo_symbol_for_orbit.png";
import { WalletButton } from "@/components/wallet-button";
import { PortfolioAnalytics } from "@/components/portfolio-analytics";

const formatAmount = (amount: string) => {
  try {
    const num = BigInt(amount);
    const divisor = BigInt("1000000000000000000");
    return (Number(num) / Number(divisor)).toLocaleString(undefined, { maximumFractionDigits: 2 });
  } catch {
    return "0";
  }
};

const formatUsd = (amount: number) => {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
};

interface PortfolioData {
  totalValue: number;
  change24h: number;
  tokens: { symbol: string; name: string; balance: string; value: number; change: number; icon: string }[];
  staking: {
    totalStaked: string;
    pendingRewards: string;
    apy: number;
    stakedValue: number;
    positions: { pool: string; amount: string; apy: number; rewards: string }[];
  };
  nfts: { id: string; name: string; collection: string; value: number }[];
}

export default function Portfolio() {
  const [stakingOpen, setStakingOpen] = useState(true);
  const [nftsOpen, setNftsOpen] = useState(false);

  const { data: portfolioData } = useQuery<PortfolioData>({
    queryKey: ["/api/portfolio"],
  });

  const { data: stakingInfo } = useQuery<{ totalStaked: string; pendingRewards: string; positions: any[] }>({
    queryKey: ["/api/staking/info"],
  });

  const { data: liquidPosition } = useQuery<{ stDwtBalance: string; withdrawableDwt: string; exchangeRate: string }>({
    queryKey: ["/api/liquid-staking/position"],
  });

  const portfolio = portfolioData || {
    totalValue: 0,
    change24h: 0,
    tokens: [],
    staking: { totalStaked: "0", pendingRewards: "0", apy: 0, stakedValue: 0, positions: [] },
    liquidStaking: { stDwtBalance: "0", dwtEquivalent: "0", value: 0, apy: 12 },
    nfts: [],
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
            <Badge variant="outline" className="border-green-500/50 text-green-400 text-[10px]">Portfolio</Badge>
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
                className="p-2 rounded-xl bg-green-500/20 border border-green-500/30"
                animate={{ 
                  boxShadow: ["0 0 20px rgba(34,197,94,0.2)", "0 0 40px rgba(34,197,94,0.4)", "0 0 20px rgba(34,197,94,0.2)"]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <PieChart className="w-5 h-5 text-green-400" />
              </motion.div>
              <h1 className="text-2xl md:text-3xl font-display font-bold">
                Portfolio
              </h1>
            </div>
            <p className="text-xs text-muted-foreground">
              Track your holdings, staking, and rewards
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-6"
          >
            <GlassCard glow>
              <div className="p-4">
                <div className="text-center">
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">Total Portfolio Value</p>
                  <div className="flex items-center justify-center gap-2">
                    <span className="text-3xl font-bold">{formatUsd(portfolio.totalValue)}</span>
                    <Badge className={`${portfolio.change24h >= 0 ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'} text-xs`}>
                      {portfolio.change24h >= 0 ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
                      {Math.abs(portfolio.change24h)}%
                    </Badge>
                  </div>
                </div>
              </div>
            </GlassCard>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="grid grid-cols-3 gap-2 mb-6"
          >
            <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-center">
              <Coins className="w-4 h-4 text-primary mx-auto mb-1" />
              <div className="text-sm font-bold">{portfolio.tokens.length}</div>
              <div className="text-[10px] text-muted-foreground">Tokens</div>
            </div>
            <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-center">
              <Lock className="w-4 h-4 text-amber-400 mx-auto mb-1" />
              <div className="text-sm font-bold">{formatUsd(portfolio.staking.stakedValue)}</div>
              <div className="text-[10px] text-muted-foreground">Staked</div>
            </div>
            <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-center">
              <Gift className="w-4 h-4 text-green-400 mx-auto mb-1" />
              <div className="text-sm font-bold">{formatAmount(portfolio.staking.pendingRewards)}</div>
              <div className="text-[10px] text-muted-foreground">Rewards</div>
            </div>
          </motion.div>

          <Tabs defaultValue="tokens" className="mb-6">
            <TabsList className="w-full grid grid-cols-4">
              <TabsTrigger value="tokens" className="text-xs">Tokens</TabsTrigger>
              <TabsTrigger value="staking" className="text-xs">Staking</TabsTrigger>
              <TabsTrigger value="nfts" className="text-xs">NFTs</TabsTrigger>
              <TabsTrigger value="analytics" className="text-xs" data-testid="tab-analytics">
                <BarChart3 className="w-3 h-3 mr-1" />
                P/L
              </TabsTrigger>
            </TabsList>

            <TabsContent value="tokens" className="mt-4">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-2"
              >
                {portfolio.tokens.map((token, index) => (
                  <motion.div
                    key={token.symbol}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <GlassCard glow className="p-3" data-testid={`token-row-${token.symbol}`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-xl">
                            {token.icon}
                          </div>
                          <div>
                            <div className="font-bold text-sm">{token.symbol}</div>
                            <div className="text-[10px] text-muted-foreground">{token.name}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-sm">{formatUsd(token.value)}</div>
                          <div className={`text-[10px] flex items-center justify-end ${token.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                            {token.change >= 0 ? <TrendingUp className="w-2 h-2 mr-1" /> : <TrendingDown className="w-2 h-2 mr-1" />}
                            {Math.abs(token.change)}%
                          </div>
                        </div>
                      </div>
                      <div className="mt-2 pt-2 border-t border-white/5 text-[10px] text-muted-foreground">
                        Balance: {(token as any).displayBalance || formatAmount(token.balance)} {token.symbol}
                      </div>
                    </GlassCard>
                  </motion.div>
                ))}
              </motion.div>
            </TabsContent>

            <TabsContent value="staking" className="mt-4">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-3"
              >
                <GlassCard glow className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-bold">Staking Overview</span>
                    <Badge className="bg-amber-500/20 text-amber-400 text-[10px]">{portfolio.staking.apy}% APY</Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-2 rounded-lg bg-white/5">
                      <div className="text-[10px] text-muted-foreground">Total Staked</div>
                      <div className="font-bold text-sm">{parseFloat(portfolio.staking.totalStaked).toLocaleString()} DWC</div>
                    </div>
                    <div className="p-2 rounded-lg bg-white/5">
                      <div className="text-[10px] text-muted-foreground">Pending Rewards</div>
                      <div className="font-bold text-sm text-green-400">{parseFloat(portfolio.staking.pendingRewards || "0").toFixed(4)} DWC</div>
                    </div>
                  </div>
                </GlassCard>

                {portfolio.staking.positions.map((position, index) => (
                  <GlassCard glow key={index} className="p-3" data-testid={`staking-position-${index}`}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-sm">{position.pool}</span>
                      <Badge variant="outline" className="text-[10px]">{position.apy}% APY</Badge>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Staked: {formatAmount(position.amount)} DWC</span>
                      <span className="text-green-400">+{formatAmount(position.rewards)} DWC</span>
                    </div>
                  </GlassCard>
                ))}

                <Link href="/staking">
                  <Button className="w-full h-10 bg-gradient-to-r from-amber-500 to-orange-500 text-black font-bold">
                    Manage Staking
                    <ExternalLink className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </motion.div>
            </TabsContent>

            <TabsContent value="nfts" className="mt-4">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-3"
              >
                {portfolio.nfts.length > 0 ? (
                  <>
                    {portfolio.nfts.map((nft) => (
                      <GlassCard glow key={nft.id} className="p-3" data-testid={`nft-row-${nft.id}`}>
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-500/20 to-purple-500/20" />
                          <div className="flex-1">
                            <div className="font-bold text-sm">{nft.name}</div>
                            <div className="text-[10px] text-muted-foreground">{nft.collection}</div>
                          </div>
                          <div className="text-right">
                            <div className="font-bold text-sm">{formatUsd(nft.value)}</div>
                            <div className="text-[10px] text-muted-foreground">Est. Value</div>
                          </div>
                        </div>
                      </GlassCard>
                    ))}
                    <Link href="/nft">
                      <Button className="w-full h-10" variant="outline">
                        View All NFTs
                        <ExternalLink className="w-4 h-4 ml-2" />
                      </Button>
                    </Link>
                  </>
                ) : (
                  <div className="text-center py-8">
                    <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center mx-auto mb-3">
                      <Gift className="w-6 h-6 text-white/20" />
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">No NFTs yet</p>
                    <Link href="/nft">
                      <Button size="sm" className="bg-gradient-to-r from-pink-500 to-purple-500">
                        Explore Marketplace
                      </Button>
                    </Link>
                  </div>
                )}
              </motion.div>
            </TabsContent>

            <TabsContent value="analytics" className="mt-4">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <PortfolioAnalytics />
              </motion.div>
            </TabsContent>
          </Tabs>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20">
              <div className="flex items-start gap-2">
                <RefreshCw className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                <p className="text-[10px] text-blue-200">
                  <strong className="text-blue-300">Auto-refresh:</strong> Portfolio data updates automatically every 30 seconds.
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
