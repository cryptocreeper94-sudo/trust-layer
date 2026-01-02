import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { 
  ArrowLeftRight, Lock, Sparkles, Zap, Shield, 
  ChevronDown, ChevronLeft, ChevronRight, Clock, Flame,
  BookOpen, ExternalLink, Bell, HelpCircle
} from "lucide-react";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BackButton } from "@/components/page-nav";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import orbitLogo from "@assets/generated_images/futuristic_abstract_geometric_logo_symbol_for_orbit.png";
import { WalletButton } from "@/components/wallet-button";

import ethereumImg from "@assets/generated_images/ethereum_smart_city_network.png";
import solanaImg from "@assets/generated_images/solana_speed_lightning_tunnel.png";
import polygonImg from "@assets/generated_images/polygon_geometric_crystal_network.png";
import arbitrumImg from "@assets/generated_images/arbitrum_orbital_bridge_network.png";
import optimismImg from "@assets/generated_images/optimism_sunrise_city_hope.png";
import baseImg from "@assets/generated_images/base_blockchain_foundation_platform.png";
import bnbImg from "@assets/generated_images/bnb_chain_golden_temple.png";
import avalancheImg from "@assets/generated_images/avalanche_mountain_speed_network.png";
import zksyncImg from "@assets/generated_images/zksync_zero_knowledge_tunnel.png";
import cosmosImg from "@assets/generated_images/cosmos_interchain_galaxy_hub.png";
import bitcoinImg from "@assets/generated_images/bitcoin_digital_gold_vault.png";
import lineaImg from "@assets/generated_images/linea_data_highway_concept.png";
import polkadotImg from "@assets/generated_images/polkadot_parachain_spheres_network.png";
import nearImg from "@assets/generated_images/near_aurora_blockchain_landscape.png";
import genericChainImg from "@assets/generated_images/generic_blockchain_network_nodes.png";

type ChainCategory = "evm-l2" | "evm-l1" | "non-evm" | "rollups";
type ReadinessStatus = "available-soon" | "in-diligence" | "researching";

interface ChainInfo {
  id: string;
  name: string;
  symbol: string;
  category: ChainCategory;
  status: ReadinessStatus;
  image: string;
  color: string;
  latencyTarget?: string;
}

const allChains: ChainInfo[] = [
  { id: "ethereum", name: "Ethereum", symbol: "ETH", category: "evm-l1", status: "available-soon", image: ethereumImg, color: "from-blue-500 to-purple-500", latencyTarget: "~12s" },
  { id: "polygon", name: "Polygon", symbol: "MATIC", category: "evm-l2", status: "available-soon", image: polygonImg, color: "from-purple-500 to-purple-700", latencyTarget: "~2s" },
  { id: "arbitrum", name: "Arbitrum", symbol: "ARB", category: "evm-l2", status: "available-soon", image: arbitrumImg, color: "from-blue-400 to-blue-600", latencyTarget: "~250ms" },
  { id: "optimism", name: "Optimism", symbol: "OP", category: "evm-l2", status: "available-soon", image: optimismImg, color: "from-red-500 to-red-700", latencyTarget: "~2s" },
  { id: "base", name: "Base", symbol: "BASE", category: "evm-l2", status: "in-diligence", image: baseImg, color: "from-blue-500 to-blue-700", latencyTarget: "~2s" },
  { id: "zksync", name: "zkSync Era", symbol: "ZK", category: "evm-l2", status: "in-diligence", image: zksyncImg, color: "from-violet-500 to-indigo-600", latencyTarget: "~1s" },
  { id: "linea", name: "Linea", symbol: "LINEA", category: "evm-l2", status: "in-diligence", image: lineaImg, color: "from-cyan-500 to-blue-500", latencyTarget: "~3s" },
  { id: "scroll", name: "Scroll", symbol: "SCR", category: "evm-l2", status: "researching", image: genericChainImg, color: "from-amber-500 to-orange-500", latencyTarget: "~3s" },
  { id: "bnb", name: "BNB Chain", symbol: "BNB", category: "evm-l1", status: "available-soon", image: bnbImg, color: "from-yellow-500 to-yellow-600", latencyTarget: "~3s" },
  { id: "avalanche", name: "Avalanche", symbol: "AVAX", category: "evm-l1", status: "in-diligence", image: avalancheImg, color: "from-red-500 to-red-600", latencyTarget: "~2s" },
  { id: "fantom", name: "Fantom", symbol: "FTM", category: "evm-l1", status: "researching", image: genericChainImg, color: "from-blue-400 to-cyan-500", latencyTarget: "~1s" },
  { id: "solana", name: "Solana", symbol: "SOL", category: "non-evm", status: "available-soon", image: solanaImg, color: "from-purple-500 to-green-400", latencyTarget: "~400ms" },
  { id: "cosmos", name: "Cosmos Hub", symbol: "ATOM", category: "non-evm", status: "in-diligence", image: cosmosImg, color: "from-indigo-500 to-purple-600", latencyTarget: "~6s" },
  { id: "polkadot", name: "Polkadot", symbol: "DOT", category: "non-evm", status: "researching", image: polkadotImg, color: "from-pink-500 to-pink-700", latencyTarget: "~6s" },
  { id: "near", name: "NEAR", symbol: "NEAR", category: "non-evm", status: "researching", image: nearImg, color: "from-green-400 to-teal-500", latencyTarget: "~1s" },
  { id: "aptos", name: "Aptos", symbol: "APT", category: "non-evm", status: "researching", image: genericChainImg, color: "from-teal-400 to-green-500", latencyTarget: "~400ms" },
  { id: "sui", name: "Sui", symbol: "SUI", category: "non-evm", status: "researching", image: genericChainImg, color: "from-cyan-400 to-blue-500", latencyTarget: "~400ms" },
  { id: "ton", name: "TON", symbol: "TON", category: "non-evm", status: "researching", image: genericChainImg, color: "from-blue-500 to-cyan-400", latencyTarget: "~5s" },
  { id: "bitcoin", name: "Bitcoin", symbol: "BTC", category: "non-evm", status: "researching", image: bitcoinImg, color: "from-orange-500 to-amber-500", latencyTarget: "~10m" },
  { id: "starknet", name: "Starknet", symbol: "STRK", category: "rollups", status: "in-diligence", image: genericChainImg, color: "from-indigo-500 to-violet-600", latencyTarget: "~2s" },
  { id: "celestia", name: "Celestia", symbol: "TIA", category: "rollups", status: "researching", image: genericChainImg, color: "from-purple-500 to-pink-500", latencyTarget: "~12s" },
];

const categoryInfo: Record<ChainCategory, { label: string; description: string; icon: React.ReactNode }> = {
  "evm-l2": { label: "EVM Layer 2s", description: "Ethereum scaling solutions with low fees", icon: <Zap className="w-4 h-4" /> },
  "evm-l1": { label: "EVM Layer 1s", description: "EVM-compatible alternative blockchains", icon: <Shield className="w-4 h-4" /> },
  "non-evm": { label: "Non-EVM Chains", description: "Alternative smart contract platforms", icon: <Sparkles className="w-4 h-4" /> },
  "rollups": { label: "Settlement & Rollups", description: "Data availability and ZK solutions", icon: <Lock className="w-4 h-4" /> },
};

const statusInfo: Record<ReadinessStatus, { label: string; color: string; bgColor: string }> = {
  "available-soon": { label: "Available Soon", color: "text-green-400", bgColor: "bg-green-500/20 border-green-500/30" },
  "in-diligence": { label: "In Diligence", color: "text-amber-400", bgColor: "bg-amber-500/20 border-amber-500/30" },
  "researching": { label: "Researching", color: "text-purple-400", bgColor: "bg-purple-500/20 border-purple-500/30" },
};

const faqItems = [
  {
    q: "What is the DarkWave Bridge?",
    a: "The DarkWave Bridge enables seamless transfer of DWC tokens between DarkWave Smart Chain and other major blockchains. Lock DWC on our chain to receive wrapped tokens (wDWC) on external networks."
  },
  {
    q: "How does the lock-and-mint mechanism work?",
    a: "When you bridge DWC out, your tokens are securely locked in a custody contract on DarkWave. Wrapped tokens (wDWC) are then minted 1:1 on the destination chain. To bridge back, burn the wrapped tokens to release your original DWC."
  },
  {
    q: "What are the bridge fees?",
    a: "Bridge fees are 0.1% of the transferred amount, with a minimum fee of 1 DWC. Network gas fees on the destination chain are paid separately in that chain's native token."
  },
  {
    q: "How long do bridge transfers take?",
    a: "Transfer times vary by destination chain. EVM L2s typically complete in 2-15 minutes. Non-EVM chains may take 15-30 minutes depending on finality requirements."
  },
  {
    q: "Is the bridge audited?",
    a: "The bridge smart contracts undergo Guardian Certification audits before mainnet launch. All bridge operations are monitored 24/7 by our Guardian Shield security system."
  },
];

function ChainCarousel({ chains, category }: { chains: ChainInfo[]; category: ChainCategory }) {
  const carouselRef = useRef<HTMLDivElement>(null);
  
  const scroll = (dir: "left" | "right") => {
    if (carouselRef.current) {
      const scrollAmount = dir === "left" ? -220 : 220;
      carouselRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  return (
    <div className="relative group">
      <Button
        variant="ghost"
        size="icon"
        className="absolute left-0 top-1/2 -translate-y-1/2 z-10 h-10 w-10 rounded-full bg-slate-900/90 border border-white/20 shadow-lg shadow-black/50 opacity-70 hover:opacity-100 transition-opacity hover:bg-slate-800"
        onClick={() => scroll("left")}
        data-testid={`button-carousel-left-${category}`}
      >
        <ChevronLeft className="w-5 h-5" />
      </Button>
      
      <div
        ref={carouselRef}
        className="flex gap-4 overflow-x-auto pb-3 snap-x snap-mandatory scrollbar-hide px-12"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {chains.map((chain, i) => (
          <motion.div
            key={chain.id}
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ delay: 0.05 * i, type: "spring", stiffness: 200 }}
            whileHover={{ 
              scale: 1.03, 
              y: -8,
              transition: { duration: 0.3 }
            }}
            className="snap-start shrink-0"
          >
            <div 
              className="
                relative w-[200px] h-[260px] rounded-2xl overflow-hidden
                border border-white/10 hover:border-white/30
                shadow-xl hover:shadow-2xl hover:shadow-primary/20
                transition-all duration-500 cursor-pointer
                group/card
              "
              style={{
                transformStyle: "preserve-3d",
                perspective: "1000px",
              }}
              data-testid={`chain-card-${chain.id}`}
            >
              <div 
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${chain.image})` }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-primary/10 opacity-0 group-hover/card:opacity-100 transition-opacity duration-500" />
              
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity" />
              <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity" />
              
              <div className="absolute top-3 right-3 z-10">
                <Badge 
                  variant="outline" 
                  className={`text-[9px] px-2 py-0.5 backdrop-blur-md ${statusInfo[chain.status].bgColor} ${statusInfo[chain.status].color} border shadow-lg`}
                >
                  {statusInfo[chain.status].label}
                </Badge>
              </div>
              
              <div className="absolute bottom-0 left-0 right-0 p-4 z-10">
                <h4 className="font-display font-bold text-lg text-white mb-0.5 drop-shadow-lg">{chain.name}</h4>
                <p className="text-xs text-white/70 font-mono mb-2">{chain.symbol}</p>
                
                {chain.latencyTarget && (
                  <div className="flex items-center gap-1.5 text-[11px] text-cyan-300/90">
                    <Clock className="w-3 h-3" />
                    <span>{chain.latencyTarget} finality</span>
                  </div>
                )}
              </div>
              
              <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/10 group-hover/card:ring-primary/30 transition-all" />
            </div>
          </motion.div>
        ))}
      </div>
      
      <Button
        variant="ghost"
        size="icon"
        className="absolute right-0 top-1/2 -translate-y-1/2 z-10 h-10 w-10 rounded-full bg-slate-900/90 border border-white/20 shadow-lg shadow-black/50 opacity-70 hover:opacity-100 transition-opacity hover:bg-slate-800"
        onClick={() => scroll("right")}
        data-testid={`button-carousel-right-${category}`}
      >
        <ChevronRight className="w-5 h-5" />
      </Button>
    </div>
  );
}

export default function Bridge() {
  const [openCategories, setOpenCategories] = useState<ChainCategory[]>(["evm-l2", "evm-l1"]);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const toggleCategory = (cat: ChainCategory) => {
    setOpenCategories(prev => 
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    );
  };

  const chainsByCategory = (category: ChainCategory) => 
    allChains.filter(c => c.category === category);

  return (
    <TooltipProvider>
      <div className="min-h-screen flex flex-col bg-background overflow-x-hidden">
        <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-background/90 backdrop-blur-xl">
          <div className="container mx-auto px-4 h-14 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 shrink-0">
              <img src={orbitLogo} alt="DarkWave" className="w-7 h-7" />
              <span className="font-display font-bold text-lg tracking-tight hidden sm:inline">DarkWave</span>
            </Link>
            <div className="flex items-center gap-2">
              <WalletButton />
              <BackButton />
            </div>
          </div>
        </nav>

        <main className="flex-1 pt-20 pb-12 px-4">
          <div className="container mx-auto max-w-6xl">
            
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative mb-8"
            >
              <div 
                className="
                  relative overflow-hidden rounded-3xl p-8 md:p-12
                  bg-gradient-to-br from-slate-900/90 via-slate-950/95 to-slate-900/90
                  border border-white/10 backdrop-blur-xl
                  shadow-2xl shadow-primary/5
                "
              >
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-purple-500/5" />
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
                <div className="absolute -top-32 -right-32 w-64 h-64 bg-primary/20 rounded-full blur-3xl" />
                <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl" />
                
                <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-3 rounded-2xl bg-gradient-to-br from-primary/20 to-cyan-500/20 border border-primary/30 shadow-lg shadow-primary/20">
                        <ArrowLeftRight className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h1 className="text-2xl md:text-4xl font-display font-bold bg-gradient-to-r from-white via-white to-white/70 bg-clip-text text-transparent">
                          Cross-Chain Bridge
                        </h1>
                        <p className="text-sm text-muted-foreground mt-1">
                          Transfer DWC across 21+ blockchain networks
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-3 mt-4">
                      <Badge className="bg-gradient-to-r from-amber-500/20 to-orange-500/20 border-amber-500/40 text-amber-300 px-3 py-1.5 text-xs font-medium animate-pulse">
                        <Clock className="w-3 h-3 mr-1.5" />
                        Coming Soon
                      </Badge>
                      <Badge variant="outline" className="border-cyan-500/30 text-cyan-400 text-xs">
                        <Lock className="w-3 h-3 mr-1.5" />
                        Lock & Mint
                      </Badge>
                      <Badge variant="outline" className="border-purple-500/30 text-purple-400 text-xs">
                        <Shield className="w-3 h-3 mr-1.5" />
                        Guardian Certified
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-2 shrink-0">
                    <Button 
                      size="lg"
                      disabled
                      className="bg-gradient-to-r from-primary to-cyan-400 text-black font-bold opacity-50 cursor-not-allowed"
                      data-testid="button-launch-bridge"
                    >
                      <Sparkles className="w-4 h-4 mr-2" />
                      Launch Bridge
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-white/20 hover:bg-white/5"
                      data-testid="button-notify-launch"
                    >
                      <Bell className="w-4 h-4 mr-2" />
                      Notify Me at Launch
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8"
            >
              {[
                { label: "Supported Chains", value: "21+", icon: <Zap className="w-4 h-4" />, color: "from-cyan-500/20 to-blue-500/20" },
                { label: "Bridge Fee", value: "0.1%", icon: <Sparkles className="w-4 h-4" />, color: "from-purple-500/20 to-pink-500/20" },
                { label: "Avg. Finality", value: "~2min", icon: <Clock className="w-4 h-4" />, color: "from-amber-500/20 to-orange-500/20" },
                { label: "Security", value: "Guardian", icon: <Shield className="w-4 h-4" />, color: "from-green-500/20 to-emerald-500/20" },
              ].map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ delay: 0.15 + i * 0.05 }}
                  whileHover={{ scale: 1.02, y: -2 }}
                  className={`
                    relative p-4 rounded-2xl backdrop-blur-xl overflow-hidden
                    bg-gradient-to-br ${stat.color}
                    border border-white/10 hover:border-white/20
                    transition-all duration-300
                  `}
                >
                  <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                  <div className="flex items-center gap-2 text-white/70 mb-1">
                    {stat.icon}
                    <span className="text-[10px] uppercase tracking-wider">{stat.label}</span>
                  </div>
                  <div className="text-xl font-display font-bold">{stat.value}</div>
                </motion.div>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mb-8"
            >
              <h2 className="text-lg font-display font-bold mb-4 flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-primary/10 border border-primary/30">
                  <Zap className="w-4 h-4 text-primary" />
                </div>
                Supported Networks
              </h2>
              
              <div className="space-y-4">
                {(Object.keys(categoryInfo) as ChainCategory[]).map((category, catIdx) => {
                  const chains = chainsByCategory(category);
                  const isOpen = openCategories.includes(category);
                  
                  return (
                    <motion.div
                      key={category}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.25 + catIdx * 0.05 }}
                    >
                      <Collapsible open={isOpen} onOpenChange={() => toggleCategory(category)}>
                        <CollapsibleTrigger className="w-full">
                          <div 
                            className={`
                              flex items-center justify-between p-4 rounded-2xl
                              bg-gradient-to-r from-white/[0.05] to-white/[0.02]
                              border border-white/10 hover:border-white/20
                              backdrop-blur-xl transition-all duration-300
                              ${isOpen ? "rounded-b-none border-b-0" : ""}
                            `}
                          >
                            <div className="flex items-center gap-3">
                              <div className="p-2 rounded-xl bg-white/5 border border-white/10">
                                {categoryInfo[category].icon}
                              </div>
                              <div className="text-left">
                                <h3 className="font-bold text-sm">{categoryInfo[category].label}</h3>
                                <p className="text-[10px] text-muted-foreground">{categoryInfo[category].description}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <Badge variant="outline" className="text-[10px] border-white/20">
                                {chains.length} chains
                              </Badge>
                              <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} />
                            </div>
                          </div>
                        </CollapsibleTrigger>
                        
                        <CollapsibleContent>
                          <div 
                            className="
                              p-4 rounded-b-2xl
                              bg-gradient-to-b from-white/[0.02] to-transparent
                              border border-t-0 border-white/10
                            "
                          >
                            <ChainCarousel chains={chains} category={category} />
                          </div>
                        </CollapsibleContent>
                      </Collapsible>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="
                  relative p-6 rounded-3xl overflow-hidden
                  bg-gradient-to-br from-cyan-500/10 via-slate-900/50 to-blue-500/10
                  border border-cyan-500/20 backdrop-blur-xl
                "
              >
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />
                <div className="absolute -top-20 -right-20 w-40 h-40 bg-cyan-500/20 rounded-full blur-3xl" />
                
                <h3 className="font-display font-bold text-lg mb-4 flex items-center gap-2">
                  <Lock className="w-5 h-5 text-cyan-400" />
                  Lock & Mint Flow
                </h3>
                
                <div className="space-y-4">
                  {[
                    { step: "1", title: "Lock DWC", desc: "Securely lock tokens in DarkWave custody", icon: <Lock className="w-4 h-4" /> },
                    { step: "2", title: "Verify Transaction", desc: "Bridge operators confirm the lock on-chain", icon: <Shield className="w-4 h-4" /> },
                    { step: "3", title: "Receive wDWC", desc: "Wrapped tokens minted 1:1 on destination", icon: <Sparkles className="w-4 h-4" /> },
                  ].map((item, i) => (
                    <motion.div 
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 + i * 0.1 }}
                      className="flex items-start gap-3"
                    >
                      <div className="shrink-0 w-8 h-8 rounded-full bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400 font-bold text-sm">
                        {item.step}
                      </div>
                      <div>
                        <div className="font-bold text-sm flex items-center gap-2">
                          {item.icon}
                          {item.title}
                        </div>
                        <p className="text-xs text-muted-foreground">{item.desc}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.35 }}
                className="
                  relative p-6 rounded-3xl overflow-hidden
                  bg-gradient-to-br from-orange-500/10 via-slate-900/50 to-red-500/10
                  border border-orange-500/20 backdrop-blur-xl
                "
              >
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-orange-500/50 to-transparent" />
                <div className="absolute -top-20 -left-20 w-40 h-40 bg-orange-500/20 rounded-full blur-3xl" />
                
                <h3 className="font-display font-bold text-lg mb-4 flex items-center gap-2">
                  <Flame className="w-5 h-5 text-orange-400" />
                  Burn & Release Flow
                </h3>
                
                <div className="space-y-4">
                  {[
                    { step: "1", title: "Burn wDWC", desc: "Destroy wrapped tokens on external chain", icon: <Flame className="w-4 h-4" /> },
                    { step: "2", title: "Verify Burn", desc: "Bridge confirms burn transaction", icon: <Shield className="w-4 h-4" /> },
                    { step: "3", title: "Release DWC", desc: "Original tokens unlocked on DarkWave", icon: <Zap className="w-4 h-4" /> },
                  ].map((item, i) => (
                    <motion.div 
                      key={i}
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.45 + i * 0.1 }}
                      className="flex items-start gap-3"
                    >
                      <div className="shrink-0 w-8 h-8 rounded-full bg-orange-500/20 border border-orange-500/30 flex items-center justify-center text-orange-400 font-bold text-sm">
                        {item.step}
                      </div>
                      <div>
                        <div className="font-bold text-sm flex items-center gap-2">
                          {item.icon}
                          {item.title}
                        </div>
                        <p className="text-xs text-muted-foreground">{item.desc}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mb-8"
            >
              <h2 className="text-lg font-display font-bold mb-4 flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-purple-400" />
                Frequently Asked Questions
              </h2>
              
              <div className="space-y-2">
                {faqItems.map((item, i) => (
                  <Collapsible 
                    key={i}
                    open={openFaq === i}
                    onOpenChange={() => setOpenFaq(openFaq === i ? null : i)}
                  >
                    <CollapsibleTrigger className="w-full">
                      <div 
                        className={`
                          flex items-center justify-between p-4 rounded-xl
                          bg-white/[0.03] hover:bg-white/[0.05]
                          border border-white/10 hover:border-white/20
                          transition-all duration-300
                          ${openFaq === i ? "rounded-b-none border-b-0" : ""}
                        `}
                      >
                        <span className="font-medium text-sm text-left">{item.q}</span>
                        <ChevronDown className={`w-4 h-4 shrink-0 ml-4 transition-transform ${openFaq === i ? "rotate-180" : ""}`} />
                      </div>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <div className="p-4 rounded-b-xl bg-white/[0.02] border border-t-0 border-white/10 text-sm text-muted-foreground">
                        {item.a}
                      </div>
                    </CollapsibleContent>
                  </Collapsible>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55 }}
              className="
                relative p-6 rounded-3xl overflow-hidden text-center
                bg-gradient-to-r from-primary/10 via-purple-500/10 to-pink-500/10
                border border-primary/20 backdrop-blur-xl
              "
            >
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
              
              <BookOpen className="w-8 h-8 text-primary mx-auto mb-3" />
              <h3 className="font-display font-bold text-lg mb-2">Ready to Learn More?</h3>
              <p className="text-sm text-muted-foreground mb-4 max-w-md mx-auto">
                Explore our documentation to understand bridge security, fee structures, and integration guides.
              </p>
              <Button variant="outline" className="border-primary/30 hover:bg-primary/10">
                <ExternalLink className="w-4 h-4 mr-2" />
                View Documentation
              </Button>
            </motion.div>
            
          </div>
        </main>

        <Footer />
      </div>
    </TooltipProvider>
  );
}
