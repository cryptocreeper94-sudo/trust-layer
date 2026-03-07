import { useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import {
  Shield, Zap, Users, Brain, Layers, Globe, TrendingUp, Clock,
  DollarSign, Gamepad2, Code, Target, Award, ChevronRight, ChevronDown,
  Sparkles, BarChart3, Star, Rocket, Building2, Calendar, Coins,
  PieChart, ArrowUpRight, CheckCircle, Lock, Network, Briefcase,
  LineChart, Activity, Box, Cpu, Download, ExternalLink, Home,
  BookOpen, MessageSquare, Eye, Radio, GraduationCap, Palette,
  Server, Monitor, FileText
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BackButton } from "@/components/page-nav";
import { GlassCard } from "@/components/glass-card";

import heroImg from "@assets/generated_images/trust-layer-ecosystem-hero.png";
import blockchainImg from "@assets/generated_images/darkwave_blockchain_network_visualization.png";
import trustHomeImg from "@assets/generated_images/ethereum_smart_city_network.png";
import communityImg from "@assets/generated_images/community_building_future.png";
import validatorImg from "@assets/generated_images/validator_network_servers.png";
import presaleImg from "@assets/generated_images/token_presale_investment.png";
import guardianImg from "@assets/generated_images/guardian_security_shield_logo.png";
import roadmapImg from "@assets/generated_images/darkwave_roadmap_visual.png";

const fadeUp = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } };
const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.08 } } };

const ecosystemProducts = [
  { name: "Trust Layer Portal", desc: "Unified gateway for DeFi, staking, swaps, NFTs", icon: Globe, category: "Infrastructure" },
  { name: "TrustHome", desc: "Blockchain-verified real estate agent platform", icon: Home, category: "Real Estate" },
  { name: "Guardian Suite", desc: "AI security scanner, screener, shield, certification", icon: Shield, category: "Security" },
  { name: "DarkWave Chronicles", desc: "3D life simulation across historical eras", icon: Gamepad2, category: "Gaming" },
  { name: "Trust Book", desc: "Premium ebook publishing with 70% author royalty", icon: BookOpen, category: "Publishing" },
  { name: "Signal Chat", desc: "Real-time encrypted messaging platform", icon: MessageSquare, category: "Communication" },
  { name: "Lume Language", desc: "AI-native programming language with compiler", icon: Code, category: "Developer Tools" },
  { name: "TrustGen 3D", desc: "AI-powered 3D asset creation with provenance", icon: Palette, category: "Creative Tools" },
  { name: "Lume Academy", desc: "8-track education platform with certifications", icon: GraduationCap, category: "Education" },
  { name: "The Arcade", desc: "Premium gaming destination with multiple titles", icon: Gamepad2, category: "Gaming" },
  { name: "DarkWave Pulse", desc: "ML-powered market intelligence engine", icon: Activity, category: "Intelligence" },
  { name: "Strike Agent", desc: "AI-powered trading signal detection", icon: Target, category: "Intelligence" },
  { name: "DarkWave Studio", desc: "Full-featured development IDE", icon: Monitor, category: "Developer Tools" },
  { name: "Block Explorer", desc: "Real-time blockchain exploration tool", icon: Eye, category: "Infrastructure" },
  { name: "Cross-Chain Bridge", desc: "Multi-chain bridge: ETH, SOL, MATIC, ARB, BASE", icon: Network, category: "DeFi" },
  { name: "NFT Marketplace", desc: "Mint, buy, sell with on-chain provenance", icon: Sparkles, category: "DeFi" },
  { name: "Validator Network", desc: "External node deployment for BFT consensus", icon: Server, category: "Infrastructure" },
  { name: "TLID Domains", desc: "Blockchain domain service (.tlid)", icon: Globe, category: "Infrastructure" },
];

const tokenAllocation = [
  { label: "Treasury Reserve", pct: "50%", desc: "Protocol stability and ecosystem funding", width: "w-full" },
  { label: "Staking Rewards", pct: "15%", desc: "Validator and delegator incentives", width: "w-[30%]" },
  { label: "Development & Team", pct: "15%", desc: "4-year vesting with 12-month cliff", width: "w-[30%]" },
  { label: "Ecosystem Growth", pct: "10%", desc: "Partnerships, grants, integrations", width: "w-[20%]" },
  { label: "Community Rewards", pct: "10%", desc: "Presale, airdrops, referrals", width: "w-[20%]" },
];

const milestones = [
  { date: "Completed", title: "Blockchain Live", desc: "Layer 1 producing blocks with BFT-PoA consensus", done: true },
  { date: "Completed", title: "Portal & DeFi", desc: "DEX, staking, bridge, NFT marketplace operational", done: true },
  { date: "Completed", title: "Guardian Suite", desc: "AI security scanner, screener, certification program", done: true },
  { date: "Completed", title: "Lume Language", desc: "AI-native programming language published to npm", done: true },
  { date: "In Progress", title: "Ecosystem Expansion", desc: "35 products in development or deployed across domains", done: false },
  { date: "Aug 23, 2026", title: "Full Launch", desc: "All products live, mainnet public, Signal trading", done: false },
];

const revenueStreams = [
  { source: "Transaction Fees", desc: "Every on-chain operation generates protocol revenue" },
  { source: "Guardian Certifications", desc: "Blockchain security audits at $6K-$15K per audit" },
  { source: "Subscription Tiers", desc: "Scholar ($19.99/mo), Master ($49.99/mo), Premium plans" },
  { source: "Trust Book Royalties", desc: "Platform cut on ebook sales and author publishing" },
  { source: "Domain Sales", desc: ".tlid blockchain domains from $12-$350/year" },
  { source: "Bridge Fees", desc: "Cross-chain transfer fees across 5+ networks" },
  { source: "NFT Marketplace", desc: "Commission on all NFT trades and minting" },
  { source: "Enterprise Licensing", desc: "White-label and B2B API access" },
];

function ImageSection({ src, alt, children, reverse = false }: { src: string; alt: string; children: React.ReactNode; reverse?: boolean }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={fadeUp}
      transition={{ duration: 0.6 }}
      className={`flex flex-col ${reverse ? "lg:flex-row-reverse" : "lg:flex-row"} gap-6 lg:gap-10 items-center`}
    >
      <div className="w-full lg:w-1/2 rounded-2xl overflow-hidden border border-white/10 shadow-2xl shadow-cyan-500/10">
        <img src={src} alt={alt} className="w-full h-48 sm:h-64 lg:h-80 object-cover" loading="lazy" />
      </div>
      <div className="w-full lg:w-1/2">{children}</div>
    </motion.div>
  );
}

function DownloadButton() {
  const handleDownload = () => {
    const content = generatePitchDeckText();
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "Trust-Layer-Pitch-Deck.txt";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Button
      onClick={handleDownload}
      size="lg"
      variant="outline"
      className="border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/10 font-bold px-8"
      data-testid="button-download-pitch"
    >
      <Download className="w-5 h-5 mr-2" />
      Download Pitch Deck
    </Button>
  );
}

function generatePitchDeckText(): string {
  return `
================================================================================
                        TRUST LAYER — INVESTOR PITCH DECK
                          Confidential | March 2026
================================================================================

EXECUTIVE SUMMARY
-----------------
Trust Layer is a Layer 1 Proof-of-Authority blockchain ecosystem comprising 35 
products across DeFi, security, education, gaming, real estate, creative tools, 
and developer infrastructure. Built independently from the ground up — our own 
chain, our own programming language (Lume), our own consensus mechanism.

Launch Date: August 23, 2026
Native Asset: Signal (SIG) — 1,000,000,000 total supply
Website: https://dwtl.io

--------------------------------------------------------------------------------

THE PROBLEM
-----------
Digital transactions lack verified identity, accountability, and transparent 
audit trails. In real estate specifically, buyers and sellers have no verifiable 
way to evaluate agent track records. Existing blockchains focus on financial 
speculation rather than trust infrastructure for real business operations.

--------------------------------------------------------------------------------

THE SOLUTION
------------
A vertically integrated blockchain ecosystem where every product generates 
on-chain provenance records (Hallmarks), creating transparent audit trails 
for real business operations.

Key differentiators:
- 200,000+ TPS capacity with 400ms block finality
- $0.001 average transaction cost
- BFT Proof-of-Authority consensus (stake-weighted validators)
- Built-in security scoring (Guardian Suite)
- AI-native programming language (Lume)
- AI-powered 3D asset creation (TrustGen)
- 8-track education platform (Lume Academy)

--------------------------------------------------------------------------------

TRUSTHOME — REAL ESTATE PLATFORM
---------------------------------
TrustHome (trusthome.tlid.io) is purpose-built for real estate professionals:

- Blockchain-verified agent profiles with trust scores
- Property listing management with on-chain provenance
- Client relationship tools with transparent audit trails
- Every transaction hallmarked on-chain (TL-XXXXXXXX format)
- Verifiable track record that traditional platforms cannot provide

For real estate investment groups, TrustHome provides infrastructure that 
makes agent credentialing and transaction history trustworthy by default.

--------------------------------------------------------------------------------

35 ECOSYSTEM PRODUCTS
---------------------
Infrastructure: Trust Layer Portal, Block Explorer, Validator Network, 
                TLID Domains, Cross-Chain Bridge
DeFi:           DEX/Token Swap, Staking, Liquid Staking, Liquidity Pools,
                NFT Marketplace, Token Launchpad
Security:       Guardian Scanner, Guardian Screener, Guardian Shield, 
                Guardian Certification
Gaming:         DarkWave Chronicles (3D), The Arcade, Bomber 3D
Education:      Lume Academy (8 tracks, 64+ courses, 4 certifications)
Developer:      Lume Language, DarkWave Studio IDE, Developer Portal
Creative:       TrustGen 3D (AI-powered asset creation)
Publishing:     Trust Book (70% author royalty)
Communication:  Signal Chat (encrypted real-time messaging)
Real Estate:    TrustHome (agent verification platform)
Intelligence:   DarkWave Pulse (ML market analysis), Strike Agent (AI signals)

--------------------------------------------------------------------------------

TOKENOMICS — SIGNAL (SIG)
--------------------------
Total Supply:     1,000,000,000 SIG (fixed, no inflation)
Treasury Reserve: 50% (protocol stability)
Staking Rewards:  15% (validator/delegator incentives)
Development/Team: 15% (4-year vesting, 12-month cliff)
Ecosystem Growth: 10% (partnerships, grants)
Community:        10% (presale, airdrops, referrals)

Pre-launch currency: Shells (1 Shell = $0.001, converts to SIG)

--------------------------------------------------------------------------------

REVENUE STREAMS
---------------
1. Transaction Fees — every on-chain operation
2. Guardian Certifications — $6,000-$15,000 per security audit
3. Subscription Tiers — Scholar ($19.99/mo), Master ($49.99/mo)
4. Trust Book Royalties — platform commission on ebook sales
5. Domain Sales — .tlid blockchain domains ($12-$350/year)
6. Bridge Fees — cross-chain transfers across 5+ networks
7. NFT Marketplace — commission on trades and minting
8. Enterprise Licensing — white-label and B2B API access

--------------------------------------------------------------------------------

TECHNOLOGY
----------
Consensus:    BFT Proof-of-Authority (stake-weighted validators)
Performance:  200,000+ TPS, 400ms block finality
Cost:         $0.001 average transaction
Security:     AES-256-GCM encryption, HMAC-SHA256, Helmet.js, rate limiting
Language:     Lume — world's first AI-native programming language
              (ask, think, generate are native keywords; compiles to JavaScript)
3D Engine:    TrustGen — AI-powered 3D model and animation generation
Provenance:   Hallmark system (TL-XXXXXXXX) for on-chain audit trails

--------------------------------------------------------------------------------

TRACTION
--------
- Blockchain live and producing blocks (6M+ blocks produced)
- 4 active validators with BFT consensus
- 35 products in development or deployed
- Presale active with early adopters
- Multiple ecosystem domains operational
- Lume programming language published to npm
- 64+ academy courses across 8 tracks

--------------------------------------------------------------------------------

ROADMAP
-------
Completed:    Layer 1 blockchain live with BFT-PoA consensus
Completed:    Portal, DeFi suite, DEX, staking, bridge operational
Completed:    Guardian Suite (scanner, screener, shield, certification)
Completed:    Lume programming language published to npm
In Progress:  35 products across ecosystem domains
Aug 23, 2026: FULL LAUNCH — all products live, Signal trading enabled

--------------------------------------------------------------------------------

TEAM
----
Independent development team building across all verticals. Core expertise
in blockchain architecture, full-stack development, AI integration, and 
security engineering.

--------------------------------------------------------------------------------

CONTACT
-------
Email: cryptocreeper94@gmail.com
Website: https://dwtl.io
Pitch Deck: https://dwtl.io/pitch-deck

================================================================================
                           CONFIDENTIAL — TRUST LAYER
================================================================================
`.trim();
}

export default function InvestorPitch() {
  const [expandedProduct, setExpandedProduct] = useState<number | null>(null);

  const { data: chainStats } = useQuery({
    queryKey: ["/api/consensus"],
    refetchInterval: 5000,
  });

  const { data: validators } = useQuery({
    queryKey: ["/api/validators"],
    refetchInterval: 10000,
  });

  const blockHeight = (chainStats as any)?.chainHeight?.toLocaleString() || "6,000,000+";
  const validatorCount = Array.isArray(validators) ? validators.length : 4;

  return (
    <div className="min-h-screen bg-[#06060a] text-white relative overflow-hidden">
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-cyan-900/15 via-[#06060a] to-[#06060a] pointer-events-none" />
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-purple-900/10 via-transparent to-transparent pointer-events-none" />
      <div className="fixed top-32 left-16 w-96 h-96 rounded-full bg-cyan-500/5 blur-[120px] animate-pulse pointer-events-none" />
      <div className="fixed top-64 right-24 w-80 h-80 rounded-full bg-purple-500/8 blur-[100px] animate-pulse pointer-events-none" style={{ animationDelay: "1s" }} />

      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-[#06060a]/80 backdrop-blur-2xl">
        <div className="container mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 shrink-0 group" data-testid="link-home">
            <div className="relative">
              <Briefcase className="w-6 h-6 text-cyan-400 group-hover:scale-110 transition-transform" />
              <div className="absolute inset-0 bg-cyan-400/30 blur-lg opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <span className="font-display font-bold text-lg tracking-tight bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
              Pitch Deck
            </span>
          </Link>
          <div className="flex items-center gap-3">
            <Badge className="border border-cyan-500/50 text-cyan-400 bg-cyan-500/10 text-xs shadow-[0_0_15px_rgba(6,182,212,0.3)]">
              Pre-Launch
            </Badge>
            <BackButton />
          </div>
        </div>
      </nav>

      <main className="pt-20 pb-12 relative">

        <section className="relative py-12 sm:py-20 px-4">
          <div className="absolute inset-0">
            <img src={heroImg} alt="Trust Layer Ecosystem" className="w-full h-full object-cover opacity-15" />
            <div className="absolute inset-0 bg-gradient-to-b from-[#06060a]/60 via-[#06060a]/80 to-[#06060a]" />
          </div>

          <div className="container mx-auto max-w-6xl relative">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="text-center mb-12">
              <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.2 }} className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-sm font-medium mb-6">
                <Rocket className="w-4 h-4" />
                Investor Pitch Deck
              </motion.div>

              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-display font-black mb-6 leading-tight">
                <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-cyan-300 bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(6,182,212,0.5)]">
                  Trust Layer
                </span>
                <br />
                <span className="text-white/90 text-2xl sm:text-3xl md:text-4xl">A Layer 1 Blockchain Ecosystem</span>
              </h1>

              <p className="text-base sm:text-lg md:text-xl text-white/50 max-w-3xl mx-auto leading-relaxed mb-10">
                35 products. Our own chain. Our own programming language.
                Built independently from the ground up for verified identity,
                accountability, and transparent audit trails.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                <DownloadButton />
                <Link href="/presale">
                  <Button size="lg" className="bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white font-bold px-8 shadow-[0_0_30px_rgba(6,182,212,0.4)]" data-testid="button-join-presale">
                    <Coins className="w-5 h-5 mr-2" />
                    View Presale
                  </Button>
                </Link>
              </div>
            </motion.div>

            <motion.div initial="hidden" animate="visible" variants={stagger} className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
              {[
                { value: "35", label: "Products", icon: Layers },
                { value: "200K+", label: "TPS Capacity", icon: Zap },
                { value: "400ms", label: "Block Finality", icon: Clock },
                { value: "$0.001", label: "Avg Transaction", icon: DollarSign },
              ].map((stat) => (
                <motion.div key={stat.label} variants={fadeUp}>
                  <GlassCard glow>
                    <div className="p-4 sm:p-6 text-center">
                      <stat.icon className="w-6 h-6 text-cyan-400 mx-auto mb-2" />
                      <div className="text-2xl sm:text-3xl font-black text-white" data-testid={`stat-${stat.label.toLowerCase().replace(/\s+/g, "-")}`}>{stat.value}</div>
                      <div className="text-xs sm:text-sm text-white/50">{stat.label}</div>
                    </div>
                  </GlassCard>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        <section className="py-12 sm:py-16 px-4">
          <div className="container mx-auto max-w-6xl">
            <ImageSection src={blockchainImg} alt="Trust Layer Blockchain">
              <Badge className="mb-3 px-3 py-1.5 bg-cyan-500/10 border-cyan-500/30 text-cyan-400 text-xs">
                <Activity className="w-3 h-3 mr-1" /> Live Blockchain
              </Badge>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-display font-black mb-4 text-white">
                Not a Concept.{" "}
                <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">Live Infrastructure.</span>
              </h2>
              <p className="text-white/50 mb-6 leading-relaxed">
                Our Layer 1 blockchain is live and producing blocks right now. BFT Proof-of-Authority
                consensus with stake-weighted validators, SHA-256 Merkle trees, and sub-second finality.
                This isn't a whitepaper — it's running code.
              </p>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "Blocks Produced", value: blockHeight },
                  { label: "Active Validators", value: String(validatorCount) },
                  { label: "Total Staked", value: "20M SIG" },
                  { label: "Network Uptime", value: "99.99%" },
                ].map((s) => (
                  <div key={s.label} className="bg-white/5 rounded-xl p-3 border border-white/5">
                    <div className="text-lg sm:text-xl font-bold text-cyan-400" data-testid={`live-${s.label.toLowerCase().replace(/\s+/g, "-")}`}>{s.value}</div>
                    <div className="text-xs text-white/40">{s.label}</div>
                  </div>
                ))}
              </div>
              <div className="mt-4">
                <Link href="/explorer">
                  <Button variant="outline" size="sm" className="border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10" data-testid="button-explorer">
                    View Block Explorer <ArrowUpRight className="w-4 h-4 ml-1" />
                  </Button>
                </Link>
              </div>
            </ImageSection>
          </div>
        </section>

        <section className="py-12 sm:py-16 px-4">
          <div className="container mx-auto max-w-6xl">
            <ImageSection src={trustHomeImg} alt="TrustHome Real Estate Platform" reverse>
              <Badge className="mb-3 px-3 py-1.5 bg-purple-500/10 border-purple-500/30 text-purple-400 text-xs">
                <Home className="w-3 h-3 mr-1" /> Real Estate
              </Badge>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-display font-black mb-4 text-white">
                TrustHome:{" "}
                <span className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">Real Estate Reimagined</span>
              </h2>
              <p className="text-white/50 mb-6 leading-relaxed">
                A blockchain-powered platform built specifically for real estate professionals.
                Verified agent profiles, property listings, client management, and trust scores
                that give buyers and sellers a transparent, verifiable track record.
              </p>
              <div className="space-y-3">
                {[
                  "Blockchain-verified agent profiles with trust scores",
                  "Every transaction hallmarked on-chain (TL-XXXXXXXX)",
                  "Property listing management with provenance tracking",
                  "Client relationship tools with transparent audit trails",
                  "Verifiable track record that traditional platforms cannot offer",
                ].map((item) => (
                  <div key={item} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />
                    <span className="text-sm text-white/70">{item}</span>
                  </div>
                ))}
              </div>
              <div className="mt-4">
                <Link href="/trusthome">
                  <Button variant="outline" size="sm" className="border-purple-500/30 text-purple-400 hover:bg-purple-500/10" data-testid="button-trusthome">
                    Explore TrustHome <ArrowUpRight className="w-4 h-4 ml-1" />
                  </Button>
                </Link>
              </div>
            </ImageSection>
          </div>
        </section>

        <section className="py-12 sm:py-16 px-4">
          <div className="container mx-auto max-w-6xl">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-center mb-10">
              <Badge className="mb-4 px-3 py-1.5 bg-cyan-500/10 border-cyan-500/30 text-cyan-400 text-xs">
                <Layers className="w-3 h-3 mr-1" /> Ecosystem
              </Badge>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-black mb-4">
                <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">35 Products.</span>{" "}
                One Ecosystem.
              </h2>
              <p className="text-white/50 max-w-2xl mx-auto">
                Every product generates on-chain provenance records, creating a unified trust infrastructure
                across DeFi, security, education, gaming, real estate, and more.
              </p>
            </motion.div>

            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {ecosystemProducts.map((product, i) => (
                <motion.div key={product.name} variants={fadeUp}>
                  <motion.div whileHover={{ scale: 1.02, y: -2 }} transition={{ type: "spring", stiffness: 400 }}>
                    <GlassCard className="hover:border-cyan-500/20 transition-all duration-300" data-testid={`product-${i}`}>
                      <div className="p-4 flex items-start gap-3">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500/20 to-purple-500/20 flex items-center justify-center shrink-0">
                          <product.icon className="w-5 h-5 text-cyan-400" />
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-bold text-white text-sm truncate">{product.name}</h4>
                            <Badge className="bg-white/5 text-white/40 border-white/10 text-[10px] shrink-0">{product.category}</Badge>
                          </div>
                          <p className="text-xs text-white/40 leading-relaxed">{product.desc}</p>
                        </div>
                      </div>
                    </GlassCard>
                  </motion.div>
                </motion.div>
              ))}
            </motion.div>

            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="mt-6 text-center">
              <p className="text-white/30 text-sm">
                + 17 additional products including Orbit Staffing, GarageBot, PaintPros, Bomber 3D, Trust Golf,
                VedaSolus, The Veil, and more across the ecosystem
              </p>
            </motion.div>
          </div>
        </section>

        <section className="py-12 sm:py-16 px-4">
          <div className="container mx-auto max-w-6xl">
            <ImageSection src={guardianImg} alt="Guardian Security Suite">
              <Badge className="mb-3 px-3 py-1.5 bg-cyan-500/10 border-cyan-500/30 text-cyan-400 text-xs">
                <Shield className="w-3 h-3 mr-1" /> Investment Thesis
              </Badge>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-display font-black mb-6 text-white">
                Why{" "}
                <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">Trust Layer</span>
              </h2>
              <div className="space-y-4">
                {[
                  { title: "Vertically Integrated", desc: "Own chain, own language, own products. No dependency on external infrastructure." },
                  { title: "Revenue From Day One", desc: "8 distinct revenue streams from subscriptions, fees, certifications, and marketplace commissions." },
                  { title: "Real Estate Ready", desc: "TrustHome provides blockchain-verified trust infrastructure for the $3.7 trillion real estate market." },
                  { title: "AI-Native Technology", desc: "Lume is the first programming language where AI is a native keyword, not a library import." },
                  { title: "35 Products = 35 Revenue Channels", desc: "Diversified across DeFi, gaming, education, security, and enterprise — not a single-product bet." },
                ].map((item) => (
                  <div key={item.title} className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-cyan-500/20 flex items-center justify-center shrink-0 mt-0.5">
                      <CheckCircle className="w-4 h-4 text-cyan-400" />
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-sm">{item.title}</h4>
                      <p className="text-xs text-white/40">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </ImageSection>
          </div>
        </section>

        <section className="py-12 sm:py-16 px-4">
          <div className="container mx-auto max-w-6xl">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-center mb-10">
              <Badge className="mb-4 px-3 py-1.5 bg-purple-500/10 border-purple-500/30 text-purple-400 text-xs">
                <Coins className="w-3 h-3 mr-1" /> Tokenomics
              </Badge>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-black mb-4">
                Signal{" "}
                <span className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">(SIG)</span>
              </h2>
              <p className="text-white/50 max-w-xl mx-auto">
                1,000,000,000 total supply. Fixed. No inflationary emissions.
                Signal powers every transaction, stake, and governance vote across the ecosystem.
              </p>
            </motion.div>

            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="space-y-3 max-w-3xl mx-auto mb-10">
              {tokenAllocation.map((item) => (
                <motion.div key={item.label} variants={fadeUp}>
                  <GlassCard>
                    <div className="p-4 sm:p-5">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <span className="font-bold text-white text-sm">{item.label}</span>
                          <span className="text-white/30 text-xs ml-2">— {item.desc}</span>
                        </div>
                        <span className="text-xl font-black bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">{item.pct}</span>
                      </div>
                      <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                        <div className={`h-full ${item.width} bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full`} />
                      </div>
                    </div>
                  </GlassCard>
                </motion.div>
              ))}
            </motion.div>

            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
              <GlassCard glow>
                <div className="p-5 sm:p-6">
                  <h3 className="text-lg font-bold text-white mb-3">Signal Utility</h3>
                  <div className="flex flex-wrap gap-2">
                    {["Transaction Fees", "Staking Rewards", "Governance Votes", "Bridge Collateral", "Quest Rewards", "NFT Marketplace", "Academy Access", "Domain Registration"].map((util) => (
                      <Badge key={util} className="bg-white/5 text-white/60 border border-white/10 text-xs">{util}</Badge>
                    ))}
                  </div>
                </div>
              </GlassCard>
            </motion.div>

            <div className="mt-6 text-center">
              <Link href="/tokenomics">
                <Button variant="outline" size="sm" className="border-purple-500/30 text-purple-400 hover:bg-purple-500/10" data-testid="button-tokenomics">
                  Full Tokenomics Breakdown <ArrowUpRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        <section className="py-12 sm:py-16 px-4">
          <div className="container mx-auto max-w-6xl">
            <ImageSection src={presaleImg} alt="Revenue Streams" reverse>
              <Badge className="mb-3 px-3 py-1.5 bg-cyan-500/10 border-cyan-500/30 text-cyan-400 text-xs">
                <TrendingUp className="w-3 h-3 mr-1" /> Revenue
              </Badge>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-display font-black mb-6 text-white">
                <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">8 Revenue</span>{" "}
                Streams
              </h2>
              <div className="space-y-3">
                {revenueStreams.map((item) => (
                  <div key={item.source} className="bg-white/5 rounded-lg p-3 border border-white/5">
                    <h4 className="font-bold text-white text-sm">{item.source}</h4>
                    <p className="text-xs text-white/40">{item.desc}</p>
                  </div>
                ))}
              </div>
            </ImageSection>
          </div>
        </section>

        <section className="py-12 sm:py-16 px-4">
          <div className="container mx-auto max-w-6xl">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-center mb-10">
              <Badge className="mb-4 px-3 py-1.5 bg-cyan-500/10 border-cyan-500/30 text-cyan-400 text-xs">
                <Calendar className="w-3 h-3 mr-1" /> Roadmap
              </Badge>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-black mb-4">
                <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">Milestones</span>{" "}
                & Timeline
              </h2>
            </motion.div>

            <div className="max-w-3xl mx-auto">
              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="space-y-3">
                {milestones.map((m, i) => (
                  <motion.div key={m.title} variants={fadeUp}>
                    <GlassCard className={m.done ? "border-cyan-500/20" : ""}>
                      <div className="p-4 sm:p-5 flex items-start gap-4">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${m.done ? "bg-cyan-500/20" : "bg-white/5"}`}>
                          {m.done ? (
                            <CheckCircle className="w-5 h-5 text-cyan-400" />
                          ) : (
                            <Clock className="w-5 h-5 text-white/30" />
                          )}
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-bold text-white text-sm">{m.title}</h4>
                            <Badge className={`text-[10px] ${m.done ? "bg-cyan-500/10 text-cyan-400 border-cyan-500/20" : "bg-white/5 text-white/40 border-white/10"}`}>
                              {m.date}
                            </Badge>
                          </div>
                          <p className="text-xs text-white/40">{m.desc}</p>
                        </div>
                      </div>
                    </GlassCard>
                  </motion.div>
                ))}
              </motion.div>
            </div>

            <div className="mt-6 text-center">
              <Link href="/launch">
                <Button variant="outline" size="sm" className="border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10" data-testid="button-launch">
                  Full Launch Roadmap <ArrowUpRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        <section className="py-12 sm:py-16 px-4">
          <div className="container mx-auto max-w-6xl">
            <ImageSection src={communityImg} alt="Trust Layer Community">
              <Badge className="mb-3 px-3 py-1.5 bg-purple-500/10 border-purple-500/30 text-purple-400 text-xs">
                <Users className="w-3 h-3 mr-1" /> Team
              </Badge>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-display font-black mb-4 text-white">
                Built{" "}
                <span className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">Independently</span>
              </h2>
              <p className="text-white/50 mb-6 leading-relaxed">
                Trust Layer has been built independently with a small, focused team.
                No venture capital dependencies. No corporate board. Every decision
                serves the ecosystem and its users.
              </p>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "Full-Stack Architecture", icon: Code },
                  { label: "Blockchain Engineering", icon: Network },
                  { label: "AI Integration", icon: Brain },
                  { label: "Security Engineering", icon: Shield },
                ].map((item) => (
                  <div key={item.label} className="bg-white/5 rounded-xl p-3 border border-white/5 flex items-center gap-2">
                    <item.icon className="w-4 h-4 text-purple-400 shrink-0" />
                    <span className="text-xs text-white/60">{item.label}</span>
                  </div>
                ))}
              </div>
            </ImageSection>
          </div>
        </section>

        <section className="py-12 sm:py-16 px-4">
          <div className="container mx-auto max-w-6xl">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-center mb-8">
              <Badge className="mb-4 px-3 py-1.5 bg-cyan-500/10 border-cyan-500/30 text-cyan-400 text-xs">
                <FileText className="w-3 h-3 mr-1" /> Resources
              </Badge>
              <h2 className="text-3xl sm:text-4xl font-display font-black mb-4">
                <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">Explore</span>{" "}
                Further
              </h2>
            </motion.div>

            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {[
                { title: "Executive Summary", desc: "High-level overview of the ecosystem", href: "/executive-summary", icon: FileText },
                { title: "Tokenomics", desc: "Full Signal allocation breakdown", href: "/tokenomics", icon: PieChart },
                { title: "Block Explorer", desc: "Live blockchain data and transactions", href: "/explorer", icon: Eye },
                { title: "Presale", desc: "Acquire Signal at pre-launch pricing", href: "/presale", icon: Coins },
                { title: "Competitive Analysis", desc: "How we compare to other chains", href: "/competitive-analysis", icon: BarChart3 },
                { title: "Investment Simulator", desc: "Model potential investment outcomes", href: "/investment-simulator", icon: LineChart },
                { title: "TrustHome", desc: "Real estate agent verification platform", href: "/trusthome", icon: Home },
                { title: "Launch Roadmap", desc: "Full timeline to August 23, 2026", href: "/launch", icon: Rocket },
                { title: "Vision", desc: "Our philosophy: Signal, Not Coin", href: "/vision", icon: Star },
              ].map((link) => (
                <motion.div key={link.title} variants={fadeUp}>
                  <Link href={link.href}>
                    <motion.div whileHover={{ scale: 1.02 }} transition={{ type: "spring", stiffness: 400 }}>
                      <GlassCard className="hover:border-cyan-500/20 transition-all duration-300 cursor-pointer" data-testid={`link-${link.title.toLowerCase().replace(/\s+/g, "-")}`}>
                        <div className="p-4 flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500/20 to-purple-500/20 flex items-center justify-center shrink-0">
                            <link.icon className="w-5 h-5 text-cyan-400" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <h4 className="font-bold text-white text-sm">{link.title}</h4>
                            <p className="text-xs text-white/40">{link.desc}</p>
                          </div>
                          <ArrowUpRight className="w-4 h-4 text-white/20 shrink-0" />
                        </div>
                      </GlassCard>
                    </motion.div>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        <section className="py-12 sm:py-16 px-4">
          <div className="container mx-auto max-w-4xl">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
              <GlassCard glow>
                <div className="p-8 sm:p-12 text-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-purple-500/10 to-cyan-500/10" />
                  <div className="absolute top-0 left-1/4 w-64 h-64 bg-cyan-500/15 rounded-full blur-3xl" />
                  <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-purple-500/15 rounded-full blur-3xl" />

                  <div className="relative z-10">
                    <Rocket className="w-14 h-14 text-cyan-400 mx-auto mb-6" />
                    <h2 className="text-3xl sm:text-4xl font-display font-black text-white mb-4">
                      Ready to Explore?
                    </h2>
                    <p className="text-white/50 mb-8 max-w-2xl mx-auto text-base sm:text-lg">
                      Download the pitch deck, explore our live products, or join the presale.
                      We're building something real — and the blockchain is already running.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                      <DownloadButton />
                      <Link href="/presale">
                        <Button size="lg" className="bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white font-bold px-8 shadow-[0_0_30px_rgba(6,182,212,0.4)]" data-testid="button-cta-presale">
                          <Coins className="w-5 h-5 mr-2" />
                          View Presale
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          </div>
        </section>

      </main>
    </div>
  );
}
