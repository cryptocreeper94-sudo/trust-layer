import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Box, Clock, QrCode, AlertCircle, CheckCircle2, Search, Zap, Activity, Database, Server, Hash } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import orbitLogo from "@assets/generated_images/futuristic_abstract_geometric_logo_symbol_for_orbit.png";
import { Footer } from "@/components/footer";
import { usePageAnalytics } from "@/hooks/use-analytics";
import { GlassCard } from "@/components/glass-card";
import { InfoTooltip } from "@/components/info-tooltip";

interface ChainInfo {
  chainId: number;
  chainName: string;
  symbol: string;
  decimals: number;
  blockHeight: number;
  latestBlockHash: string;
  networkType?: string;
  genesisTimestamp?: string;
}

interface BlockInfo {
  height: number;
  hash: string;
  prevHash: string;
  timestamp: string;
  validator: string;
  txCount: number;
  merkleRoot: string;
}

interface ChainStats {
  tps: string;
  finalityTime: string;
  avgCost: string;
  activeNodes: string;
  currentBlock: string;
  networkHash: string;
}

interface RecentTransaction {
  txHash: string;
  dataHash: string;
  category: string;
  status: string;
  blockHeight: string;
  createdAt: string;
}

interface HallmarkData {
  hallmarkId: string;
  masterSequence: string;
  subSequence: string;
  appId: string;
  appName: string;
  productName: string;
  version: string;
  releaseType: string;
  dataHash: string;
  metadata: Record<string, unknown> | null;
  darkwave: {
    txHash: string | null;
    blockHeight: number | null;
    status: string;
  };
  verified: boolean;
  message: string;
  createdAt: string;
}

export default function Explorer() {
  usePageAnalytics();
  const [hallmarkSearch, setHallmarkSearch] = useState("");
  const [hallmarkData, setHallmarkData] = useState<HallmarkData | null>(null);
  const [hallmarkLoading, setHallmarkLoading] = useState(false);
  const [hallmarkError, setHallmarkError] = useState<string | null>(null);
  
  const [chainInfo, setChainInfo] = useState<ChainInfo | null>(null);
  const [chainStats, setChainStats] = useState<ChainStats | null>(null);
  const [latestBlocks, setLatestBlocks] = useState<BlockInfo[]>([]);
  const [recentTxs, setRecentTxs] = useState<RecentTransaction[]>([]);

  useEffect(() => {
    const fetchChainData = async () => {
      try {
        const [chainRes, statsRes] = await Promise.all([
          fetch("/api/chain"),
          fetch("/api/blockchain/stats")
        ]);
        if (chainRes.ok) setChainInfo(await chainRes.json());
        if (statsRes.ok) setChainStats(await statsRes.json());
      } catch (error) {
        console.error("Failed to fetch chain data:", error);
      }
    };

    const fetchLatestBlocks = async () => {
      try {
        const res = await fetch("/api/block/latest");
        if (res.ok) {
          const latest = await res.json();
          setLatestBlocks(prev => {
            const exists = prev.some(b => b.height === latest.height);
            if (exists) return prev;
            return [latest, ...prev].slice(0, 6);
          });
        }
      } catch (error) {
        console.error("Failed to fetch latest block:", error);
      }
    };

    const fetchRecentTransactions = async () => {
      try {
        const res = await fetch("/api/transactions/recent?limit=6");
        if (res.ok) setRecentTxs(await res.json());
      } catch (error) {
        console.error("Failed to fetch recent transactions:", error);
      }
    };

    fetchChainData();
    fetchLatestBlocks();
    fetchRecentTransactions();

    const chainInterval = setInterval(fetchChainData, 2000);
    const blockInterval = setInterval(fetchLatestBlocks, 500);
    const txInterval = setInterval(fetchRecentTransactions, 3000);

    return () => {
      clearInterval(chainInterval);
      clearInterval(blockInterval);
      clearInterval(txInterval);
    };
  }, []);

  const searchHallmark = async () => {
    if (!hallmarkSearch.trim()) return;
    
    setHallmarkLoading(true);
    setHallmarkError(null);
    setHallmarkData(null);

    try {
      const response = await fetch(`/api/hallmark/${hallmarkSearch.trim()}`);
      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || "Hallmark not found");
      }
      setHallmarkData(await response.json());
    } catch (error) {
      setHallmarkError(error instanceof Error ? error.message : "Failed to fetch hallmark");
    } finally {
      setHallmarkLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden selection:bg-primary/20 selection:text-primary">
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-background/90 backdrop-blur-xl">
        <div className="container mx-auto px-4 h-14 flex items-center">
          <Link href="/" className="flex items-center gap-2 mr-auto">
            <img src={orbitLogo} alt="DarkWave" className="w-7 h-7" />
            <span className="font-display font-bold text-lg tracking-tight">DarkWave</span>
          </Link>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-green-500/10 border border-green-500/20">
              <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              <span className="text-[10px] font-mono text-green-400 font-medium">MAINNET</span>
            </div>
            <Link href="/">
              <Button variant="ghost" size="sm" className="h-8 text-xs gap-1.5 hover:bg-white/5">
                <ArrowLeft className="w-3 h-3" />
                Back
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      <section className="pt-20 pb-8 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-display font-bold mb-2">
              DarkWave<span className="text-primary">Scan</span>
            </h1>
            <p className="text-sm text-muted-foreground">Track every block, transaction, and contract in real-time</p>
          </div>
          
          <div className="max-w-2xl mx-auto">
            <GlassCard hover={false}>
              <div className="p-3 flex items-center gap-2">
                <Search className="w-4 h-4 text-muted-foreground shrink-0" />
                <Input 
                  placeholder="Search by Address / Txn Hash / Block / Token" 
                  className="border-0 bg-transparent h-10 font-mono text-xs focus-visible:ring-0 focus-visible:ring-offset-0"
                />
              </div>
            </GlassCard>
          </div>
        </div>
      </section>

      <section className="py-6 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 auto-rows-[100px]">
            <GlassCard hover={false}>
              <div className="p-4 h-full flex flex-col justify-center">
                <div className="flex items-center gap-1 mb-1">
                  <Zap className="w-3 h-3 text-primary/60" />
                  <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                  <InfoTooltip content="Transactions Per Second - network processing capacity" label="TPS info" />
                </div>
                <div className="text-xl font-bold text-white">{chainStats?.tps || "200K+"}</div>
                <div className="text-[10px] text-white/50 uppercase">TPS</div>
              </div>
            </GlassCard>
            <GlassCard hover={false}>
              <div className="p-4 h-full flex flex-col justify-center">
                <div className="flex items-center gap-1 mb-1">
                  <Activity className="w-3 h-3 text-cyan-400/60" />
                  <InfoTooltip content="Time between each block being produced on the chain" label="Block time info" />
                </div>
                <div className="text-xl font-bold text-white">{chainStats?.finalityTime || "400ms"}</div>
                <div className="text-[10px] text-white/50 uppercase">Block Time</div>
              </div>
            </GlassCard>
            <GlassCard hover={false}>
              <div className="p-4 h-full flex flex-col justify-center">
                <div className="flex items-center gap-1 mb-1">
                  <Server className="w-3 h-3 text-purple-400/60" />
                  <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                  <InfoTooltip content="DarkWave uses Proof-of-Authority consensus. The Founders Validator runs enterprise-grade infrastructure for maximum uptime." label="Network info" />
                </div>
                <div className="text-xl font-bold text-white">{chainStats?.activeNodes?.includes("Founder") ? chainStats.activeNodes : "Founders Validator"}</div>
                <div className="text-[10px] text-white/50 uppercase">Network</div>
              </div>
            </GlassCard>
            <GlassCard hover={false}>
              <div className="p-4 h-full flex flex-col justify-center">
                <div className="flex items-center gap-1 mb-1">
                  <Box className="w-3 h-3 text-green-400/60" />
                  <InfoTooltip content="Total number of blocks produced since the chain started" label="Block height info" />
                </div>
                <div className="text-xl font-bold text-white">{chainInfo?.blockHeight?.toLocaleString() || chainStats?.currentBlock || "8,921,042"}</div>
                <div className="text-[10px] text-white/50 uppercase">Block Height</div>
              </div>
            </GlassCard>
          </div>
        </div>
      </section>

      <section className="py-6 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <GlassCard glow className="h-full">
              <div className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Box className="w-4 h-4 text-primary" />
                    Latest Blocks
                  </h3>
                  <Badge variant="outline" className="text-[9px] border-green-500/50 text-green-400">Live</Badge>
                </div>
                <div className="space-y-2 max-h-[280px] overflow-y-auto">
                  {latestBlocks.length === 0 ? (
                    <div className="text-center py-8 text-white/30 text-xs">Loading blocks...</div>
                  ) : (
                    latestBlocks.map((block, i) => (
                      <motion.div
                        key={block.height}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-bold text-primary">#{block.height.toLocaleString()}</span>
                          <span className="text-[10px] text-white/40 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {new Date(block.timestamp).toLocaleTimeString()}
                          </span>
                        </div>
                        <div className="text-[10px] text-white/50 font-mono truncate">{block.hash}</div>
                        <div className="text-[10px] text-white/30 mt-1">{block.txCount} transactions</div>
                      </motion.div>
                    ))
                  )}
                </div>
              </div>
            </GlassCard>

            <GlassCard glow className="h-full">
              <div className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Hash className="w-4 h-4 text-secondary" />
                    Recent Transactions
                  </h3>
                  <Badge variant="outline" className="text-[9px] border-secondary/50 text-secondary">Live</Badge>
                </div>
                <div className="space-y-2 max-h-[280px] overflow-y-auto">
                  {recentTxs.length === 0 ? (
                    <div className="text-center py-8 text-white/30 text-xs">Loading transactions...</div>
                  ) : (
                    recentTxs.map((tx, i) => (
                      <div key={tx.txHash} className="p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[10px] font-mono text-secondary truncate max-w-[180px]">{tx.txHash}</span>
                          <Badge variant="outline" className={`text-[8px] ${tx.status === 'confirmed' ? 'border-green-500/50 text-green-400' : 'border-yellow-500/50 text-yellow-400'}`}>
                            {tx.status}
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between text-[10px] text-white/40">
                          <span>{tx.category}</span>
                          <span>Block {tx.blockHeight}</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </GlassCard>
          </div>
        </div>
      </section>

      <section className="py-6 px-4">
        <div className="container mx-auto max-w-6xl">
          <GlassCard>
            <div className="p-5">
              <div className="flex items-center gap-2 mb-4">
                <QrCode className="w-4 h-4 text-primary" />
                <h3 className="text-sm font-bold text-white">Hallmark Verification</h3>
                <InfoTooltip content="Hallmarks are unique product IDs stored on DarkWave Chain. Enter a hallmark ID to verify its authenticity and see its on-chain record." label="Hallmark verification info" />
              </div>
              
              <div className="flex flex-col sm:flex-row gap-2 mb-4">
                <Input
                  placeholder="Enter Hallmark ID (e.g., 000000001-01)"
                  value={hallmarkSearch}
                  onChange={(e) => setHallmarkSearch(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && searchHallmark()}
                  className="h-10 bg-black/30 border-white/10 font-mono text-xs"
                />
                <Button 
                  onClick={searchHallmark}
                  disabled={hallmarkLoading}
                  className="h-10 px-6 bg-primary text-background hover:bg-primary/90 text-xs shrink-0"
                >
                  {hallmarkLoading ? "..." : "Verify"}
                </Button>
              </div>

              {hallmarkError && (
                <div className="flex items-center gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-xs text-red-400">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  {hallmarkError}
                </div>
              )}

              {hallmarkData && (
                <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                  <div className="flex items-center gap-2 mb-3">
                    <CheckCircle2 className="w-5 h-5 text-green-400" />
                    <span className="text-sm font-bold text-green-400">Verified Hallmark</span>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                    <div>
                      <div className="text-white/40 mb-0.5">Hallmark ID</div>
                      <div className="text-white font-mono">{hallmarkData.hallmarkId}</div>
                    </div>
                    <div>
                      <div className="text-white/40 mb-0.5">Product</div>
                      <div className="text-white">{hallmarkData.productName}</div>
                    </div>
                    <div>
                      <div className="text-white/40 mb-0.5">Version</div>
                      <div className="text-white">{hallmarkData.version}</div>
                    </div>
                    <div>
                      <div className="text-white/40 mb-0.5">Status</div>
                      <Badge variant="outline" className={`text-[9px] ${hallmarkData.verified ? 'border-green-500/50 text-green-400' : 'border-yellow-500/50 text-yellow-400'}`}>
                        {hallmarkData.darkwave.status}
                      </Badge>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </GlassCard>
        </div>
      </section>

      <Footer />
    </div>
  );
}
