import { motion } from "framer-motion";
import { Zap, Clock, Shield, Coins, Users, Code, TrendingUp, CheckCircle, XCircle, Minus, BarChart3 } from "lucide-react";
import { BackButton } from "@/components/page-nav";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Footer } from "@/components/footer";
import { usePageAnalytics } from "@/hooks/use-analytics";
import { GlassCard } from "@/components/glass-card";
import orbitLogo from "@assets/generated_images/futuristic_abstract_geometric_logo_symbol_for_orbit.png";

interface ChainComparison {
  name: string;
  logo: string;
  tps: string;
  blockTime: string;
  consensus: string;
  fees: string;
  gaming: string;
  defi: string;
  smartContracts: boolean;
  nftSupport: boolean;
  ecoScore: number;
}

const CHAINS: ChainComparison[] = [
  {
    name: "DarkWave",
    logo: "DW",
    tps: "200,000+",
    blockTime: "400ms",
    consensus: "PoA",
    fees: "~$0.001",
    gaming: "Native",
    defi: "Full Suite",
    smartContracts: true,
    nftSupport: true,
    ecoScore: 95
  },
  {
    name: "Ethereum",
    logo: "ETH",
    tps: "15-30",
    blockTime: "12s",
    consensus: "PoS",
    fees: "$1-50+",
    gaming: "Limited",
    defi: "Extensive",
    smartContracts: true,
    nftSupport: true,
    ecoScore: 80
  },
  {
    name: "Solana",
    logo: "SOL",
    tps: "65,000",
    blockTime: "400ms",
    consensus: "PoH/PoS",
    fees: "~$0.00025",
    gaming: "Growing",
    defi: "Extensive",
    smartContracts: true,
    nftSupport: true,
    ecoScore: 85
  },
  {
    name: "Polygon",
    logo: "MATIC",
    tps: "7,000",
    blockTime: "2s",
    consensus: "PoS",
    fees: "~$0.01",
    gaming: "Popular",
    defi: "Strong",
    smartContracts: true,
    nftSupport: true,
    ecoScore: 75
  },
  {
    name: "Avalanche",
    logo: "AVAX",
    tps: "4,500",
    blockTime: "2s",
    consensus: "PoS",
    fees: "~$0.10",
    gaming: "Growing",
    defi: "Strong",
    smartContracts: true,
    nftSupport: true,
    ecoScore: 78
  },
  {
    name: "BNB Chain",
    logo: "BNB",
    tps: "160",
    blockTime: "3s",
    consensus: "PoSA",
    fees: "~$0.05",
    gaming: "Limited",
    defi: "Extensive",
    smartContracts: true,
    nftSupport: true,
    ecoScore: 70
  }
];

const ADVANTAGES = [
  {
    title: "Purpose-Built for Gaming",
    description: "Unlike general-purpose chains, DWSC is optimized from the ground up for real-time interactive experiences with native gaming infrastructure.",
    icon: Zap,
    color: "#06b6d4"
  },
  {
    title: "Ultra-Fast Finality",
    description: "400ms block times enable truly responsive gameplay. No waiting for confirmations - actions happen in real-time.",
    icon: Clock,
    color: "#a855f7"
  },
  {
    title: "Negligible Fees",
    description: "Transaction costs under $0.001 mean microtransactions are finally viable. Players can trade, craft, and interact without worrying about gas.",
    icon: Coins,
    color: "#22c55e"
  },
  {
    title: "Vertical Integration",
    description: "We control the entire stack from consensus to end-user apps. This ensures tight integration and optimal performance across all layers.",
    icon: Code,
    color: "#ec4899"
  },
  {
    title: "Flagship Application",
    description: "DarkWave Chronicles isn't just a showcase - it's a revolutionary parallel life experience that demonstrates the chain's full potential.",
    icon: Users,
    color: "#f59e0b"
  },
  {
    title: "Sustainable Economics",
    description: "No inflation, no burns, no gimmicks. DWC value comes from genuine utility and ecosystem growth, not tokenomic tricks.",
    icon: Shield,
    color: "#6366f1"
  }
];

function BooleanIcon({ value }: { value: boolean }) {
  return value ? (
    <CheckCircle className="w-4 h-4 text-green-400" />
  ) : (
    <XCircle className="w-4 h-4 text-red-400" />
  );
}

export default function CompetitiveAnalysis() {
  usePageAnalytics();
  
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden selection:bg-primary/20 selection:text-primary">
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-background/90 backdrop-blur-xl">
        <div className="container mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <img src={orbitLogo} alt="DarkWave" className="w-7 h-7" />
            <span className="font-display font-bold text-lg tracking-tight hidden sm:inline">DarkWave</span>
          </Link>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="border-cyan-500/50 text-cyan-400 bg-cyan-500/10 text-[10px] sm:text-xs whitespace-nowrap">
              <BarChart3 className="w-3 h-3 mr-1" /> Analysis
            </Badge>
            <BackButton />
          </div>
        </div>
      </nav>

      <section className="pt-20 pb-8 px-4">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <Badge variant="outline" className="px-3 py-1 border-cyan-500/50 text-cyan-400 bg-cyan-500/10 rounded-full text-xs tracking-wider uppercase mb-4">
              Market Position
            </Badge>
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400">Competitive Analysis</span>
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              How DarkWave Smart Chain compares to other leading Layer 1 blockchains in the market.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-8 px-4">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-6"
          >
            <h2 className="text-2xl font-display font-bold mb-2 flex items-center gap-3">
              <TrendingUp className="w-6 h-6 text-cyan-400" />
              Chain Comparison
            </h2>
            <p className="text-muted-foreground text-sm">Side-by-side comparison of key metrics across leading blockchains</p>
          </motion.div>

          <GlassCard glow hover={false}>
            <div className="overflow-x-auto">
              <table className="w-full text-sm" data-testid="table-comparison">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left p-4 text-white/50 font-medium text-xs uppercase tracking-wider sticky left-0 bg-slate-900/95">Chain</th>
                    <th className="text-center p-4 text-white/50 font-medium text-xs uppercase tracking-wider">TPS</th>
                    <th className="text-center p-4 text-white/50 font-medium text-xs uppercase tracking-wider">Block Time</th>
                    <th className="text-center p-4 text-white/50 font-medium text-xs uppercase tracking-wider">Consensus</th>
                    <th className="text-center p-4 text-white/50 font-medium text-xs uppercase tracking-wider">Avg Fee</th>
                    <th className="text-center p-4 text-white/50 font-medium text-xs uppercase tracking-wider">Gaming</th>
                    <th className="text-center p-4 text-white/50 font-medium text-xs uppercase tracking-wider">DeFi</th>
                    <th className="text-center p-4 text-white/50 font-medium text-xs uppercase tracking-wider">Contracts</th>
                    <th className="text-center p-4 text-white/50 font-medium text-xs uppercase tracking-wider">NFTs</th>
                  </tr>
                </thead>
                <tbody>
                  {CHAINS.map((chain, index) => (
                    <motion.tr
                      key={chain.name}
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.05 }}
                      className={`border-b border-white/5 hover:bg-white/[0.02] transition-colors ${chain.name === 'DarkWave' ? 'bg-cyan-500/5' : ''}`}
                    >
                      <td className="p-4 font-medium text-white sticky left-0 bg-slate-900/95">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold ${chain.name === 'DarkWave' ? 'bg-gradient-to-br from-cyan-500 to-purple-500 text-white' : 'bg-white/10 text-white/70'}`}>
                            {chain.logo}
                          </div>
                          <span className={chain.name === 'DarkWave' ? 'text-cyan-400' : ''}>{chain.name}</span>
                          {chain.name === 'DarkWave' && (
                            <Badge variant="outline" className="border-cyan-500/30 text-cyan-400 text-[8px] px-1.5">Ours</Badge>
                          )}
                        </div>
                      </td>
                      <td className={`p-4 text-center ${chain.name === 'DarkWave' ? 'text-green-400 font-bold' : 'text-white/70'}`}>{chain.tps}</td>
                      <td className={`p-4 text-center ${chain.name === 'DarkWave' ? 'text-green-400 font-bold' : 'text-white/70'}`}>{chain.blockTime}</td>
                      <td className="p-4 text-center text-white/70">{chain.consensus}</td>
                      <td className={`p-4 text-center ${chain.name === 'DarkWave' ? 'text-green-400 font-bold' : 'text-white/70'}`}>{chain.fees}</td>
                      <td className={`p-4 text-center ${chain.gaming === 'Native' ? 'text-cyan-400 font-bold' : 'text-white/70'}`}>{chain.gaming}</td>
                      <td className="p-4 text-center text-white/70">{chain.defi}</td>
                      <td className="p-4 text-center"><div className="flex justify-center"><BooleanIcon value={chain.smartContracts} /></div></td>
                      <td className="p-4 text-center"><div className="flex justify-center"><BooleanIcon value={chain.nftSupport} /></div></td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </GlassCard>
        </div>
      </section>

      <section className="py-12 px-4 bg-white/[0.02]">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-8"
          >
            <h2 className="text-2xl font-display font-bold mb-2 flex items-center gap-3">
              <Zap className="w-6 h-6 text-purple-400" />
              Key Advantages
            </h2>
            <p className="text-muted-foreground text-sm">What sets DarkWave Smart Chain apart from the competition</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {ADVANTAGES.map((adv, index) => (
              <motion.div
                key={adv.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <GlassCard hover glow>
                  <div className="p-5">
                    <div 
                      className="w-10 h-10 rounded-lg flex items-center justify-center mb-3"
                      style={{ backgroundColor: `${adv.color}20` }}
                    >
                      <adv.icon className="w-5 h-5" style={{ color: adv.color }} />
                    </div>
                    <h3 className="font-bold text-white mb-2">{adv.title}</h3>
                    <p className="text-xs text-white/60 leading-relaxed">{adv.description}</p>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <GlassCard glow hover={false}>
              <div className="p-6 md:p-8">
                <h3 className="text-xl font-bold text-white mb-4">Why Not Just Use Existing Chains?</h3>
                <div className="space-y-4 text-white/70 text-sm leading-relaxed">
                  <p>
                    <span className="text-cyan-400 font-semibold">General-purpose chains make trade-offs.</span> Ethereum prioritizes decentralization over speed. 
                    Solana optimizes for throughput but has stability concerns. Polygon is fast but still relies on Ethereum for security.
                  </p>
                  <p>
                    <span className="text-purple-400 font-semibold">Gaming has unique requirements.</span> Real-time interactions demand sub-second finality. 
                    Microtransactions require negligible fees. Complex game logic needs optimized smart contract execution.
                  </p>
                  <p>
                    <span className="text-pink-400 font-semibold">We control our destiny.</span> By building our own chain, we can optimize every layer for our use case. 
                    No waiting for upstream upgrades. No relying on third-party validators. Full vertical integration from consensus to Chronicles.
                  </p>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        </div>
      </section>

      <section className="py-12 px-4">
        <div className="container mx-auto max-w-6xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl font-display font-bold mb-4">Ready to Learn More?</h2>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto text-sm">
              Dive deeper into the technical architecture and business model.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link href="/executive-summary">
                <Button size="lg" className="bg-white text-black hover:bg-white/90 font-bold rounded-full" data-testid="button-exec-summary">
                  Executive Summary
                </Button>
              </Link>
              <Link href="/tokenomics">
                <Button size="lg" variant="outline" className="border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10 rounded-full" data-testid="button-tokenomics">
                  Tokenomics
                </Button>
              </Link>
              <Link href="/doc-hub">
                <Button size="lg" variant="outline" className="border-purple-500/30 text-purple-400 hover:bg-purple-500/10 rounded-full" data-testid="button-whitepaper">
                  Technical Docs
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
