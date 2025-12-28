import { motion } from "framer-motion";
import { Link } from "wouter";
import { 
  ArrowLeft, 
  Globe, 
  Users, 
  Coins, 
  Server, 
  Brain, 
  Calendar,
  Target,
  TrendingUp,
  Shield,
  Zap,
  Database,
  Code,
  Building,
  Rocket,
  CheckCircle,
  Clock,
  DollarSign,
  BarChart3
} from "lucide-react";
import { ChronoLayout } from "@/components/chrono-ui";

export default function ChronoExecutiveSummary() {
  return (
    <ChronoLayout>
      <main className="pt-20">
        {/* Hero Section */}
        <section className="py-16 px-4 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-amber-500/5 via-purple-500/5 to-cyan-500/5" />
          <div className="container mx-auto max-w-5xl relative">
            <Link href="/" className="inline-flex items-center gap-2 text-white/60 hover:text-white mb-8 transition-colors" data-testid="back-home-link">
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Link>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-12"
            >
              <div className="inline-block px-4 py-1 rounded-full bg-amber-500/20 text-amber-400 text-sm font-medium mb-4">
                Confidential Executive Summary
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-4">
                <span className="bg-gradient-to-r from-amber-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
                  DarkWave Chronicles
                </span>
              </h1>
              <p className="text-xl md:text-2xl text-white/80 mb-2">The ChronoVerse</p>
              <p className="text-lg text-white/60 italic">"YOU. The Legend."</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-slate-900/80 backdrop-blur-sm border border-white/10 rounded-2xl p-8 mb-8"
            >
              <h2 className="text-2xl font-display font-bold text-white mb-4 flex items-center gap-3">
                <Target className="w-6 h-6 text-amber-400" />
                Executive Overview
              </h2>
              <p className="text-white/80 leading-relaxed mb-4">
                DarkWave Chronicles is an <span className="text-amber-400 font-semibold">unprecedented adventure platform</span> where 
                YOU are the hero—not an avatar, your actual parallel self. Experience 70+ mission theaters spanning 
                from the Prehistoric Era to a speculative 2200 CE future, each with unique campaigns, factions, and ways to build your legend. 
                The world evolves dynamically—AI-driven NPCs pursue their own goals, economies shift, and alliances form—creating a living 
                experience that responds authentically to your choices.
              </p>
              <p className="text-white/80 leading-relaxed">
                Built on the <span className="text-cyan-400 font-semibold">DarkWave Smart Chain (DWSC)</span> blockchain infrastructure, 
                Chronicles leverages blockchain technology for true digital ownership of in-game assets, community-created content licensing, 
                and a revolutionary <span className="text-purple-400 font-semibold">Storefront Sponsorship System</span> that bridges 
                real-world commerce with immersive historical experiences.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Value Proposition */}
        <section className="py-12 px-4 bg-slate-900/50">
          <div className="container mx-auto max-w-5xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-8"
            >
              <h2 className="text-2xl font-display font-bold text-white mb-6 flex items-center gap-3">
                <TrendingUp className="w-6 h-6 text-emerald-400" />
                Unique Value Proposition
              </h2>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-6">
              {[
                {
                  title: "Living World Adventures",
                  description: "The ChronoVerse evolves dynamically. AI-driven NPCs pursue quests, form alliances, and remember your actions. Drop in for quick missions or commit to epic campaigns—your legend grows at your pace, with no grinding or forced obligations.",
                  icon: Globe,
                  color: "cyan"
                },
                {
                  title: "True Digital Ownership",
                  description: "All in-game property, businesses, and created content are blockchain-verified assets on DWSC. Creators retain full IP rights to their contributions and earn royalties from usage. Trade, sell, or license your digital legacy.",
                  icon: Shield,
                  color: "amber"
                },
                {
                  title: "70+ Mission Theaters",
                  description: "From Prehistoric tribes to Victorian commerce to cyberpunk futures. Each era offers unique campaigns, factions, and rewards. Your choices ripple across time through our cross-era quest system.",
                  icon: Zap,
                  color: "purple"
                },
                {
                  title: "Real-World Commerce Integration",
                  description: "Storefront Sponsorships allow real businesses to sponsor in-game locations. A medieval blacksmith becomes a portal to an outdoor gear company. Revenue sharing creates sustainable monetization without pay-to-win mechanics.",
                  icon: Building,
                  color: "emerald"
                }
              ].map((item, i) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-slate-800/50 border border-white/10 rounded-xl p-6"
                  data-testid={`value-prop-${i}`}
                >
                  <div className={`w-12 h-12 rounded-lg bg-${item.color}-500/20 flex items-center justify-center mb-4`}>
                    <item.icon className={`w-6 h-6 text-${item.color}-400`} />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">{item.title}</h3>
                  <p className="text-white/60 text-sm leading-relaxed">{item.description}</p>
                </motion.div>
              ))}
            </div>

            {/* The Unprecedented Teaser */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mt-8 bg-gradient-to-r from-amber-950/30 via-purple-950/30 to-cyan-950/30 border border-white/10 rounded-xl p-6"
            >
              <h3 className="text-lg font-semibold text-white mb-3">What Makes This Unprecedented</h3>
              <p className="text-white/70 leading-relaxed mb-3">
                Every game tells you what reality is. Chronicles lets you <span className="text-amber-400">discover it</span>. 
                Our adaptive AI doesn't just react to your choices—it learns how you think, what you question, and what you accept. 
                The world subtly reshapes itself around your perspective.
              </p>
              <p className="text-white/70 leading-relaxed">
                The result: an experience that <span className="text-purple-400">reveals as much about you</span> as it does about 
                the historical eras you explore. No two players experience the same Chronicles. No one leaves unchanged.
              </p>
            </motion.div>
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
              <p className="text-white/60">For developers and technical investors</p>
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
                  Blockchain Infrastructure (DWSC Layer 1 - In Development)
                </h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-sm font-semibold text-white/80 mb-2">Consensus & Performance Goals</h4>
                    <ul className="space-y-1 text-sm text-white/60">
                      <li>• <span className="text-white">Proof-of-Authority (PoA)</span> consensus with Founders Validator network</li>
                      <li>• <span className="text-white">Target: Sub-second finality</span> for responsive gameplay</li>
                      <li>• <span className="text-white">High-throughput design</span> for scalable transaction processing</li>
                      <li>• PostgreSQL-backed state storage with cryptographic verification</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-white/80 mb-2">Cryptographic Security</h4>
                    <ul className="space-y-1 text-sm text-white/60">
                      <li>• SHA-256 block hashing with Merkle root validation</li>
                      <li>• HMAC-SHA256 API authentication for hub services</li>
                      <li>• Ed25519 digital signatures for transaction verification</li>
                      <li>• WebAuthn/Passkey support for passwordless authentication</li>
                    </ul>
                  </div>
                </div>
              </motion.div>

              {/* AI Engine */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-gradient-to-r from-purple-950/50 to-slate-900/50 border border-purple-500/20 rounded-xl p-6"
              >
                <h3 className="text-lg font-semibold text-purple-400 mb-4 flex items-center gap-2">
                  <Brain className="w-5 h-5" />
                  AI Simulation Engine
                </h3>
                <div className="grid md:grid-cols-3 gap-6">
                  <div>
                    <h4 className="text-sm font-semibold text-white/80 mb-2">3-Tier Processing Stack</h4>
                    <ul className="space-y-1 text-sm text-white/60">
                      <li><span className="text-purple-300">Tier 1:</span> Deterministic planners for routine behaviors</li>
                      <li><span className="text-purple-300">Tier 2:</span> LLM microservices for complex decisions</li>
                      <li><span className="text-purple-300">Tier 3:</span> Offline batch processing for world events</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-white/80 mb-2">5-Axis Emotion System</h4>
                    <ul className="space-y-1 text-sm text-white/60">
                      <li>• Joy/Sorrow continuum</li>
                      <li>• Trust/Disgust relationships</li>
                      <li>• Fear/Anger responses</li>
                      <li>• Anticipation/Surprise reactions</li>
                      <li>• Acceptance/Rejection states</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-white/80 mb-2">Belief System Layer</h4>
                    <ul className="space-y-1 text-sm text-white/60">
                      <li>• Cultural value inheritance</li>
                      <li>• Era-specific moral frameworks</li>
                      <li>• Dynamic reputation tracking</li>
                      <li>• Inter-agent relationship graphs</li>
                    </ul>
                  </div>
                </div>
              </motion.div>

              {/* Application Stack */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-gradient-to-r from-amber-950/50 to-slate-900/50 border border-amber-500/20 rounded-xl p-6"
              >
                <h3 className="text-lg font-semibold text-amber-400 mb-4 flex items-center gap-2">
                  <Server className="w-5 h-5" />
                  Application Architecture
                </h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-sm font-semibold text-white/80 mb-2">Frontend Stack</h4>
                    <ul className="space-y-1 text-sm text-white/60">
                      <li>• React 18 with TypeScript for type-safe development</li>
                      <li>• Vite build system with HMR for rapid iteration</li>
                      <li>• TanStack Query for server state management</li>
                      <li>• Tailwind CSS v4 + Framer Motion for premium UI</li>
                      <li>• Progressive Web App (PWA) with offline capability</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-white/80 mb-2">Backend Stack</h4>
                    <ul className="space-y-1 text-sm text-white/60">
                      <li>• Node.js + Express.js REST API</li>
                      <li>• Drizzle ORM with PostgreSQL database</li>
                      <li>• WebSocket real-time communication (ws)</li>
                      <li>• OpenAI integration for AI agent behaviors</li>
                      <li>• Stripe + Coinbase Commerce for payments</li>
                    </ul>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-white/10">
                  <h4 className="text-sm font-semibold text-white/80 mb-2">Cross-Platform Roadmap</h4>
                  <p className="text-sm text-white/60">
                    Phase 2 deployment includes React Native/Expo for iOS and Android native applications, 
                    maintaining shared business logic with web platform while optimizing for mobile UX.
                  </p>
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
                Revenue Model
              </h2>
              <p className="text-white/60">Multiple sustainable revenue streams without pay-to-win mechanics</p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  title: "Creator Licenses",
                  revenue: "500 DWC each",
                  description: "Creators pay for licensing rights to retain IP ownership of their in-game contributions. Includes royalty participation and trading rights.",
                  icon: Users
                },
                {
                  title: "Storefront Sponsorships",
                  revenue: "Tiered Pricing",
                  description: "Real businesses sponsor in-game locations. Revenue from licensing fees ($500-$50K/mo), click royalties, and conversion bonuses.",
                  icon: Building
                },
                {
                  title: "Premium Locations",
                  revenue: "Auction-Based",
                  description: "City center properties and high-traffic locations sold via blockchain auction. Phase 3 feature with district-level pricing.",
                  icon: Target
                },
                {
                  title: "Time Crystals",
                  revenue: "In-App Currency",
                  description: "Premium currency for time travel, era unlocks, and cosmetic enhancements. Non-pay-to-win design—no gameplay advantages.",
                  icon: Zap
                },
                {
                  title: "Marketplace Fees",
                  revenue: "2.5% Transaction",
                  description: "Small fee on all player-to-player trades of created content, properties, and licensed assets.",
                  icon: TrendingUp
                },
                {
                  title: "DWC Token Utility",
                  revenue: "Ecosystem Value",
                  description: "Native blockchain token required for creator licenses, property purchases, and premium features. Drives token demand.",
                  icon: Coins
                }
              ].map((item, i) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  className="bg-slate-800/50 border border-white/10 rounded-xl p-5"
                  data-testid={`revenue-stream-${i}`}
                >
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
                      <item.icon className="w-5 h-5 text-emerald-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white">{item.title}</h3>
                      <span className="text-xs text-emerald-400">{item.revenue}</span>
                    </div>
                  </div>
                  <p className="text-sm text-white/60 leading-relaxed">{item.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Timeline to Launch */}
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
                Development Timeline
              </h2>
              <p className="text-white/60">Target Public Beta: <span className="text-amber-400 font-semibold">July 4th, 2026</span></p>
            </motion.div>

            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-emerald-500 via-amber-500 to-purple-500 hidden md:block" />

              <div className="space-y-6">
                {[
                  {
                    phase: "Phase 0",
                    title: "Foundation",
                    date: "Q1-Q2 2026 (Now - June)",
                    status: "in_progress",
                    items: [
                      "Website & branding launch ✓",
                      "Crowdfunding infrastructure ✓",
                      "Discord & Telegram community setup",
                      "Core database schema design",
                      "Basic AI agent framework prototype",
                      "Single-era sandbox (Medieval) for testing"
                    ]
                  },
                  {
                    phase: "Phase 1",
                    title: "Economy & Property Systems",
                    date: "Q3-Q4 2026 (July - December)",
                    status: "upcoming",
                    items: [
                      "Blockchain-backed property registry",
                      "Storefront sponsorship system design",
                      "Business partner portal",
                      "Location-based pricing engine",
                      "Creator licensing & royalty system",
                      "Traffic analytics framework"
                    ]
                  },
                  {
                    phase: "Phase 2",
                    title: "Multi-Era Launch",
                    date: "Q1-Q2 2026 (January - June)",
                    status: "upcoming",
                    items: [
                      "10 historical eras live with full AI simulation",
                      "Storefront marketplace launch",
                      "Era-specific sponsor integration",
                      "Cross-era quest framework",
                      "Public Alpha release (invite-only)",
                      "Mobile app development (React Native)"
                    ]
                  },
                  {
                    phase: "Phase 3",
                    title: "Public Beta Launch",
                    date: "July 4th, 2026",
                    status: "target",
                    items: [
                      "Public beta release - yourlegacy.io live",
                      "iOS & Android apps on stores",
                      "Full creator marketplace operational",
                      "Active storefront sponsor network",
                      "DWC mainnet integration complete",
                      "Community content creation tools"
                    ]
                  }
                ].map((phase, i) => (
                  <motion.div
                    key={phase.phase}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="relative pl-0 md:pl-16"
                    data-testid={`timeline-phase-${i}`}
                  >
                    {/* Timeline dot */}
                    <div className={`absolute left-4 top-6 w-4 h-4 rounded-full hidden md:block ${
                      phase.status === 'in_progress' ? 'bg-emerald-500 animate-pulse' :
                      phase.status === 'target' ? 'bg-amber-500' : 'bg-slate-600'
                    }`} />
                    
                    <div className={`rounded-xl p-6 border ${
                      phase.status === 'in_progress' 
                        ? 'bg-emerald-950/30 border-emerald-500/30' 
                        : phase.status === 'target'
                        ? 'bg-amber-950/30 border-amber-500/30'
                        : 'bg-slate-800/50 border-white/10'
                    }`}>
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
                            <Clock className="w-3 h-3" /> In Progress
                          </span>
                        )}
                        {phase.status === 'target' && (
                          <span className="flex items-center gap-1 text-xs text-amber-400">
                            <Target className="w-3 h-3" /> Target Launch
                          </span>
                        )}
                      </div>
                      <ul className="grid md:grid-cols-2 gap-2">
                        {phase.items.map((item, j) => (
                          <li key={j} className="flex items-start gap-2 text-sm text-white/60">
                            <CheckCircle className={`w-4 h-4 mt-0.5 flex-shrink-0 ${
                              item.includes('✓') ? 'text-emerald-400' : 'text-white/20'
                            }`} />
                            <span>{item.replace(' ✓', '')}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Market Opportunity */}
        <section className="py-12 px-4 bg-slate-900/50">
          <div className="container mx-auto max-w-5xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-8"
            >
              <h2 className="text-2xl font-display font-bold text-white mb-2 flex items-center gap-3">
                <BarChart3 className="w-6 h-6 text-purple-400" />
                Market Opportunity
              </h2>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="bg-slate-800/50 border border-white/10 rounded-xl p-6 text-center"
              >
                <div className="text-3xl font-bold text-cyan-400 mb-2">$217B</div>
                <div className="text-sm text-white/60">Global Gaming Market (2023)</div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="bg-slate-800/50 border border-white/10 rounded-xl p-6 text-center"
              >
                <div className="text-3xl font-bold text-purple-400 mb-2">$65B</div>
                <div className="text-sm text-white/60">Adventure/RPG Genre (Est.)</div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="bg-slate-800/50 border border-white/10 rounded-xl p-6 text-center"
              >
                <div className="text-3xl font-bold text-amber-400 mb-2">$40B+</div>
                <div className="text-sm text-white/60">In-Game Advertising (2026 Est.)</div>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-slate-800/50 border border-white/10 rounded-xl p-6"
            >
              <h3 className="font-semibold text-white mb-4">Competitive Differentiation</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-white/60 border-b border-white/10">
                      <th className="pb-3 pr-4">Feature</th>
                      <th className="pb-3 pr-4">The Sims</th>
                      <th className="pb-3 pr-4">Second Life</th>
                      <th className="pb-3 pr-4 text-amber-400">Chronicles</th>
                    </tr>
                  </thead>
                  <tbody className="text-white/80">
                    <tr className="border-b border-white/5">
                      <td className="py-3 pr-4">Persistent World</td>
                      <td className="py-3 pr-4 text-red-400">No</td>
                      <td className="py-3 pr-4 text-emerald-400">Yes</td>
                      <td className="py-3 pr-4 text-emerald-400">Yes (24/7)</td>
                    </tr>
                    <tr className="border-b border-white/5">
                      <td className="py-3 pr-4">Multiple Eras</td>
                      <td className="py-3 pr-4 text-red-400">No</td>
                      <td className="py-3 pr-4 text-red-400">No</td>
                      <td className="py-3 pr-4 text-emerald-400">70+ Eras</td>
                    </tr>
                    <tr className="border-b border-white/5">
                      <td className="py-3 pr-4">Blockchain Ownership</td>
                      <td className="py-3 pr-4 text-red-400">No</td>
                      <td className="py-3 pr-4 text-red-400">No</td>
                      <td className="py-3 pr-4 text-emerald-400">Full IP Rights</td>
                    </tr>
                    <tr className="border-b border-white/5">
                      <td className="py-3 pr-4">AI-Driven NPCs</td>
                      <td className="py-3 pr-4 text-yellow-400">Basic</td>
                      <td className="py-3 pr-4 text-red-400">None</td>
                      <td className="py-3 pr-4 text-emerald-400">Advanced LLM</td>
                    </tr>
                    <tr>
                      <td className="py-3 pr-4">Business Sponsorships</td>
                      <td className="py-3 pr-4 text-red-400">No</td>
                      <td className="py-3 pr-4 text-yellow-400">Limited</td>
                      <td className="py-3 pr-4 text-emerald-400">Full Integration</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Team & Contact */}
        <section className="py-12 px-4">
          <div className="container mx-auto max-w-5xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-8"
            >
              <h2 className="text-2xl font-display font-bold text-white mb-2">
                Ready to Shape the ChronoVerse?
              </h2>
              <p className="text-white/60">Connect with DarkWave Studios to explore partnership opportunities</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-gradient-to-r from-amber-950/30 via-purple-950/30 to-cyan-950/30 border border-white/10 rounded-xl p-8 text-center"
            >
              <div className="flex flex-wrap justify-center gap-4 mb-6">
                <a 
                  href="mailto:cryptocreeper94@gmail.com?subject=ChronoVerse%20Investment%20Inquiry"
                  className="px-6 py-3 bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 rounded-lg text-white font-semibold transition-colors"
                  data-testid="contact-investor"
                >
                  Contact for Investment
                </a>
                <Link 
                  href="/team" 
                  className="px-6 py-3 bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/30 rounded-lg text-amber-400 font-medium transition-colors"
                  data-testid="link-roadmap"
                >
                  View Full Roadmap
                </Link>
                <Link 
                  href="/creators" 
                  className="px-6 py-3 bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/30 rounded-lg text-purple-400 font-medium transition-colors"
                  data-testid="link-creators"
                >
                  Creator Program
                </Link>
                <Link 
                  href="/crowdfund" 
                  className="px-6 py-3 bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/30 rounded-lg text-emerald-400 font-medium transition-colors"
                  data-testid="link-invest"
                >
                  Support Development
                </Link>
              </div>
              <p className="text-white/40 text-sm">
                DarkWave Studios • DarkWave Smart Chain • yourlegacy.io
              </p>
              <p className="text-white/30 text-xs mt-2">
                Direct inquiries: cryptocreeper94@gmail.com
              </p>
            </motion.div>
          </div>
        </section>
      </main>
    </ChronoLayout>
  );
}
