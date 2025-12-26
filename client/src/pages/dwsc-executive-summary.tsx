import { motion } from "framer-motion";
import { Link } from "wouter";
import { 
  Globe, 
  Users, 
  Coins, 
  Brain, 
  Calendar,
  Target,
  TrendingUp,
  Database,
  Code,
  Building,
  CheckCircle,
  Clock,
  DollarSign,
  Gamepad2,
  Store,
  Layers,
  ArrowRightLeft,
  Mail,
  ArrowLeft
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Footer } from "@/components/footer";
import orbitLogo from "@assets/generated_images/futuristic_abstract_geometric_logo_symbol_for_orbit.png";

export default function DWSCExecutiveSummary() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white">
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-slate-950/90 backdrop-blur-xl">
        <div className="container mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <img src={orbitLogo} alt="DarkWave" className="w-7 h-7" />
            <span className="font-display font-bold text-lg tracking-tight hidden sm:inline">DWSC</span>
          </Link>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="border-cyan-500/50 text-cyan-400 bg-cyan-500/10 text-[10px] sm:text-xs whitespace-nowrap">
              Executive Summary
            </Badge>
            <Link href="/doc-hub">
              <Button variant="ghost" size="sm" className="h-8 text-xs gap-1 hover:bg-white/5 px-2">
                Whitepaper
              </Button>
            </Link>
            <Link href="/">
              <Button variant="ghost" size="sm" className="h-8 text-xs gap-1 hover:bg-white/5 px-2">
                <ArrowLeft className="w-3 h-3" />
                <span className="hidden sm:inline">Back</span>
              </Button>
            </Link>
          </div>
        </div>
      </nav>
      
      <main className="pt-20">
        {/* Hero Section */}
        <section className="py-16 px-4 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 via-purple-500/5 to-pink-500/5" />
          <div className="container mx-auto max-w-5xl relative">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-12"
            >
              <div className="inline-block px-4 py-1 rounded-full bg-cyan-500/20 text-cyan-400 text-sm font-medium mb-4">
                Executive Summary
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-4">
                <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  DarkWave Smart Chain
                </span>
              </h1>
              <p className="text-xl md:text-2xl text-white/80 mb-2">Next-Generation Layer 1 Blockchain</p>
              <p className="text-lg text-white/60">Building the infrastructure for immersive digital economies</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-slate-900/80 backdrop-blur-sm border border-white/10 rounded-2xl p-8 mb-8"
            >
              <h2 className="text-2xl font-display font-bold text-white mb-4 flex items-center gap-3">
                <Target className="w-6 h-6 text-cyan-400" />
                Executive Overview
              </h2>
              <p className="text-white/80 leading-relaxed mb-4">
                <span className="text-cyan-400 font-semibold">DarkWave Smart Chain (DWSC)</span> is a purpose-built 
                Layer 1 blockchain ecosystem designed for high-performance gaming, digital asset ownership, and 
                decentralized applications. Unlike general-purpose chains, DWSC is optimized from the ground up 
                for real-time interactive experiences and seamless digital commerce.
              </p>
              <p className="text-white/80 leading-relaxed mb-4">
                The ecosystem comprises three pillars: the <span className="text-purple-400 font-semibold">DWSC blockchain infrastructure</span>, 
                the <span className="text-pink-400 font-semibold">DarkWave Portal</span> for ecosystem access and DeFi services, 
                and <span className="text-amber-400 font-semibold">DarkWave Chronicles</span> - an unprecedented adventure platform 
                spanning 70+ mission theaters where YOU are the hero that serves as the flagship application demonstrating 
                the chain's capabilities.
              </p>
              <p className="text-white/80 leading-relaxed">
                DarkWave Studios is building a complete vertical stack: from blockchain consensus to end-user applications, 
                ensuring tight integration and optimal performance across all layers.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Three Pillars */}
        <section className="py-12 px-4 bg-slate-900/50">
          <div className="container mx-auto max-w-5xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-8"
            >
              <h2 className="text-2xl font-display font-bold text-white mb-2 flex items-center gap-3">
                <Layers className="w-6 h-6 text-purple-400" />
                The Ecosystem
              </h2>
              <p className="text-white/60">Three integrated pillars powering the DarkWave vision</p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  title: "DWSC Blockchain",
                  subtitle: "Layer 1 Infrastructure",
                  description: "Proof-of-Authority consensus optimized for gaming. Sub-second finality, high throughput, and native support for complex digital assets.",
                  icon: Database,
                  color: "cyan",
                  features: ["PoA Consensus", "Native Token (DWC)", "Smart Contracts", "Cross-Chain Bridge"]
                },
                {
                  title: "DarkWave Portal",
                  subtitle: "Ecosystem Gateway",
                  description: "Complete DeFi suite with token swaps, staking, NFT marketplace, and developer tools. The unified interface for the entire ecosystem.",
                  icon: Globe,
                  color: "purple",
                  features: ["DEX & Swaps", "Liquid Staking", "NFT Market", "Dev Studio"]
                },
                {
                  title: "DarkWave Chronicles",
                  subtitle: "Flagship Application",
                  description: "Unprecedented adventure platform across 70+ mission theaters. Real-time AI-driven world where YOU are the hero. Revenue through creator licensing and brand sponsorships.",
                  icon: Gamepad2,
                  color: "pink",
                  features: ["70+ Eras", "AI NPCs", "Creator Economy", "Brand Sponsorships"]
                }
              ].map((pillar, i) => (
                <motion.div
                  key={pillar.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className={`bg-slate-800/50 border border-${pillar.color}-500/20 rounded-xl p-6`}
                  data-testid={`pillar-${i}`}
                >
                  <div className={`w-12 h-12 rounded-lg bg-${pillar.color}-500/20 flex items-center justify-center mb-4`}>
                    <pillar.icon className={`w-6 h-6 text-${pillar.color}-400`} />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-1">{pillar.title}</h3>
                  <p className={`text-xs text-${pillar.color}-400 mb-3`}>{pillar.subtitle}</p>
                  <p className="text-white/60 text-sm leading-relaxed mb-4">{pillar.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {pillar.features.map((f) => (
                      <span key={f} className="text-xs px-2 py-1 rounded-full bg-white/5 text-white/50">{f}</span>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Technical Architecture */}
        <section className="py-12 px-4">
          <div className="container mx-auto max-w-5xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-8"
            >
              <h2 className="text-2xl font-display font-bold text-white mb-2 flex items-center gap-3">
                <Code className="w-6 h-6 text-cyan-400" />
                Technical Architecture
              </h2>
              <p className="text-white/60">Built for performance, security, and developer experience</p>
            </motion.div>

            <div className="space-y-6">
              {/* Blockchain Layer */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-gradient-to-r from-cyan-950/50 to-slate-900/50 border border-cyan-500/20 rounded-xl p-6"
              >
                <h3 className="text-lg font-semibold text-cyan-400 mb-4 flex items-center gap-2">
                  <Database className="w-5 h-5" />
                  DWSC Layer 1 Blockchain
                </h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-sm font-semibold text-white/80 mb-2">Consensus & Performance</h4>
                    <ul className="space-y-1 text-sm text-white/60">
                      <li>• <span className="text-white">Proof-of-Authority (PoA)</span> with Founders Validator network</li>
                      <li>• <span className="text-white">Sub-second finality</span> for real-time gaming</li>
                      <li>• <span className="text-white">High-throughput design</span> for scalable dApps</li>
                      <li>• PostgreSQL-backed state with cryptographic verification</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-white/80 mb-2">Native Token: DWC</h4>
                    <ul className="space-y-1 text-sm text-white/60">
                      <li>• <span className="text-white">100 Million</span> total supply</li>
                      <li>• <span className="text-white">18 decimals</span> for micro-transactions</li>
                      <li>• <span className="text-white">No burn mechanism</span> - stable economics</li>
                      <li>• Utility: gas, staking, governance, in-game currency</li>
                    </ul>
                  </div>
                </div>
              </motion.div>

              {/* Cross-Chain */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-gradient-to-r from-purple-950/50 to-slate-900/50 border border-purple-500/20 rounded-xl p-6"
              >
                <h3 className="text-lg font-semibold text-purple-400 mb-4 flex items-center gap-2">
                  <ArrowRightLeft className="w-5 h-5" />
                  Cross-Chain Infrastructure
                </h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-sm font-semibold text-white/80 mb-2">Bridge Architecture</h4>
                    <ul className="space-y-1 text-sm text-white/60">
                      <li>• Lock & mint model (DWC ↔ wDWC)</li>
                      <li>• <span className="text-white">Ethereum</span> bridge (ERC-20 wDWC)</li>
                      <li>• <span className="text-white">Solana</span> bridge (SPL wDWC)</li>
                      <li>• UUPS proxy pattern for upgradeability</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-white/80 mb-2">Security Model</h4>
                    <ul className="space-y-1 text-sm text-white/60">
                      <li>• SHA-256 block hashing</li>
                      <li>• Merkle tree state verification</li>
                      <li>• HMAC-SHA256 API authentication</li>
                      <li>• Ed25519 digital signatures</li>
                    </ul>
                  </div>
                </div>
              </motion.div>

              {/* AI Engine */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-gradient-to-r from-pink-950/50 to-slate-900/50 border border-pink-500/20 rounded-xl p-6"
              >
                <h3 className="text-lg font-semibold text-pink-400 mb-4 flex items-center gap-2">
                  <Brain className="w-5 h-5" />
                  Chronicles AI Engine
                </h3>
                <div className="grid md:grid-cols-3 gap-6">
                  <div>
                    <h4 className="text-sm font-semibold text-white/80 mb-2">3-Tier Processing</h4>
                    <ul className="space-y-1 text-sm text-white/60">
                      <li><span className="text-pink-300">Tier 1:</span> Deterministic planners</li>
                      <li><span className="text-pink-300">Tier 2:</span> LLM microservices</li>
                      <li><span className="text-pink-300">Tier 3:</span> Offline batch processing</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-white/80 mb-2">Emotion System</h4>
                    <ul className="space-y-1 text-sm text-white/60">
                      <li>• 5-axis emotional model</li>
                      <li>• Dynamic mood transitions</li>
                      <li>• Relationship memory</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-white/80 mb-2">World Simulation</h4>
                    <ul className="space-y-1 text-sm text-white/60">
                      <li>• 24/7 persistent world</li>
                      <li>• Era-specific behaviors</li>
                      <li>• Economic simulation</li>
                    </ul>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Revenue Model */}
        <section className="py-12 px-4 bg-slate-900/50">
          <div className="container mx-auto max-w-5xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-8"
            >
              <h2 className="text-2xl font-display font-bold text-white mb-2 flex items-center gap-3">
                <DollarSign className="w-6 h-6 text-emerald-400" />
                Revenue Streams
              </h2>
              <p className="text-white/60">Diversified revenue across blockchain and application layers</p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  title: "Transaction Fees",
                  source: "Blockchain",
                  description: "Gas fees from all on-chain transactions, smart contract executions, and token transfers.",
                  icon: Database
                },
                {
                  title: "Token Presale",
                  source: "Blockchain",
                  description: "Initial DWC distribution through tiered presale phases with early-adopter incentives.",
                  icon: Coins
                },
                {
                  title: "Staking Revenue",
                  source: "DeFi",
                  description: "Commission on liquid staking (stDWC) and validator delegation services.",
                  icon: TrendingUp
                },
                {
                  title: "NFT Marketplace",
                  source: "DeFi",
                  description: "2.5% transaction fee on all NFT trades, creator royalty facilitation.",
                  icon: Store
                },
                {
                  title: "Creator Licenses",
                  source: "Chronicles",
                  description: "500 DWC per license for content creators to retain IP rights and earn royalties.",
                  icon: Users
                },
                {
                  title: "Storefront Sponsorships",
                  source: "Chronicles",
                  description: "Real businesses sponsor in-game locations. Licensing fees, click royalties, conversion bonuses.",
                  icon: Building
                }
              ].map((item, i) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  className="bg-slate-800/50 border border-white/10 rounded-xl p-5"
                  data-testid={`revenue-${i}`}
                >
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
                      <item.icon className="w-5 h-5 text-emerald-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white">{item.title}</h3>
                      <span className="text-xs text-emerald-400">{item.source}</span>
                    </div>
                  </div>
                  <p className="text-sm text-white/60 leading-relaxed">{item.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Timeline */}
        <section className="py-12 px-4">
          <div className="container mx-auto max-w-5xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-8"
            >
              <h2 className="text-2xl font-display font-bold text-white mb-2 flex items-center gap-3">
                <Calendar className="w-6 h-6 text-amber-400" />
                Development Roadmap
              </h2>
              <p className="text-white/60">Target: <span className="text-amber-400 font-semibold">July 4th, 2026</span> - Public Beta Launch</p>
            </motion.div>

            <div className="space-y-4">
              {[
                {
                  phase: "Phase 0",
                  title: "Foundation",
                  date: "Q1-Q2 2025",
                  status: "in_progress",
                  blockchain: ["Testnet live", "Token presale", "Bridge development"],
                  chronicles: ["Website launch", "Community building", "Single-era sandbox"]
                },
                {
                  phase: "Phase 1",
                  title: "Infrastructure",
                  date: "Q3-Q4 2025",
                  status: "upcoming",
                  blockchain: ["Mainnet preparation", "Validator onboarding", "DeFi launch"],
                  chronicles: ["Property registry", "Storefront system", "Creator licensing"]
                },
                {
                  phase: "Phase 2",
                  title: "Expansion",
                  date: "Q1-Q2 2026",
                  status: "upcoming",
                  blockchain: ["Mainnet launch", "Cross-chain bridges live", "Developer grants"],
                  chronicles: ["10 eras live", "Storefront marketplace", "Mobile apps"]
                },
                {
                  phase: "Phase 3",
                  title: "Scale",
                  date: "July 4th, 2026",
                  status: "target",
                  blockchain: ["Full ecosystem operational", "Enterprise partnerships", "Global expansion"],
                  chronicles: ["70+ eras", "Public beta", "Full sponsor network"]
                }
              ].map((phase, i) => (
                <motion.div
                  key={phase.phase}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className={`rounded-xl p-5 border ${
                    phase.status === 'in_progress' 
                      ? 'bg-emerald-950/30 border-emerald-500/30' 
                      : phase.status === 'target'
                      ? 'bg-amber-950/30 border-amber-500/30'
                      : 'bg-slate-800/50 border-white/10'
                  }`}
                  data-testid={`phase-${i}`}
                >
                  <div className="flex flex-wrap items-center gap-3 mb-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      phase.status === 'in_progress' ? 'bg-emerald-500/20 text-emerald-400' :
                      phase.status === 'target' ? 'bg-amber-500/20 text-amber-400' :
                      'bg-slate-700 text-white/60'
                    }`}>
                      {phase.phase}
                    </span>
                    <h3 className="font-semibold text-white">{phase.title}</h3>
                    <span className="text-sm text-white/40">{phase.date}</span>
                    {phase.status === 'in_progress' && (
                      <span className="flex items-center gap-1 text-xs text-emerald-400">
                        <Clock className="w-3 h-3" /> Current
                      </span>
                    )}
                    {phase.status === 'target' && (
                      <span className="flex items-center gap-1 text-xs text-amber-400">
                        <Target className="w-3 h-3" /> Launch Target
                      </span>
                    )}
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <span className="text-xs text-cyan-400 font-medium">Blockchain</span>
                      <ul className="mt-1 space-y-1">
                        {phase.blockchain.map((item) => (
                          <li key={item} className="text-sm text-white/60 flex items-center gap-2">
                            <CheckCircle className="w-3 h-3 text-white/20" /> {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <span className="text-xs text-pink-400 font-medium">Chronicles</span>
                      <ul className="mt-1 space-y-1">
                        {phase.chronicles.map((item) => (
                          <li key={item} className="text-sm text-white/60 flex items-center gap-2">
                            <CheckCircle className="w-3 h-3 text-white/20" /> {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact CTA */}
        <section className="py-12 px-4 bg-slate-900/50">
          <div className="container mx-auto max-w-5xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-gradient-to-r from-cyan-950/30 via-purple-950/30 to-pink-950/30 border border-white/10 rounded-xl p-8 text-center"
            >
              <h2 className="text-2xl font-display font-bold text-white mb-2">
                Partner With DarkWave Studios
              </h2>
              <p className="text-white/60 mb-6 max-w-2xl mx-auto">
                We're building the future of blockchain gaming. Join us as an investor, developer, or strategic partner.
              </p>
              <div className="flex flex-wrap justify-center gap-4 mb-6">
                <a 
                  href="mailto:cryptocreeper94@gmail.com?subject=DWSC%20Investment%20Inquiry"
                  className="px-6 py-3 bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 rounded-lg text-white font-semibold transition-colors flex items-center gap-2"
                  data-testid="contact-invest"
                >
                  <Mail className="w-5 h-5" />
                  Contact for Investment
                </a>
                <Link 
                  href="/doc-hub"
                  className="px-6 py-3 bg-white/10 hover:bg-white/15 border border-white/20 rounded-lg text-white font-medium transition-colors"
                  data-testid="link-whitepaper"
                >
                  Read Whitepaper
                </Link>
                <Link 
                  href="/crowdfund"
                  className="px-6 py-3 bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/30 rounded-lg text-emerald-400 font-medium transition-colors"
                  data-testid="link-crowdfund"
                >
                  Support Development
                </Link>
              </div>
              <p className="text-white/40 text-sm">
                DarkWave Studios • dwsc.io • yourlegacy.io
              </p>
              <p className="text-white/30 text-xs mt-2">
                Direct inquiries: cryptocreeper94@gmail.com
              </p>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
