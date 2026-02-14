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
  Shield,
  MessageSquare,
  Zap,
  Server,
  CreditCard,
  Sparkles,
  Lock,
  Activity,
  Wallet,
  Gift,
  BadgeCheck,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { GamesComingSoonModal } from "@/components/games-coming-soon-modal";
import { useState, useRef } from "react";
import pulseImg from "@assets/generated_images/pulse_ai_trading_dashboard.png";
import strikeImg from "@assets/generated_images/strike_agent_token_sniper.png";
import chronochatImg from "@assets/generated_images/chronochat_community_platform.png";
import vedasolusImg from "@assets/generated_images/vedasolus_spiritual_wellness.png";
import chroniclesImg from "@assets/generated_images/chronicles_historical_adventure.png";
import dexImg from "@assets/generated_images/dex_token_swap_exchange.png";
import nftImg from "@assets/generated_images/nft_marketplace_gallery.png";
import bridgeImg from "@assets/generated_images/cross-chain_bridge_portal.png";
import validatorImg from "@assets/generated_images/validator_network_servers.png";
import explorerImg from "@assets/generated_images/block_explorer_dashboard.png";
import presaleImg from "@assets/generated_images/token_presale_investment.png";
import subscriptionImg from "@assets/generated_images/premium_subscription_tiers.png";
import aiNftImg from "@assets/generated_images/ai_nft_art_generator.png";
import developerImg from "@assets/generated_images/developer_portal_apis.png";
import referralImg from "@assets/generated_images/referral_rewards_program.png";
import liquidStakingImg from "@assets/generated_images/liquid_staking_rewards.png";
import theArcadeImg from "@assets/Screenshot_20260213_013103_Chrome_1770968118325.jpg";
import trustHomeImg from "@assets/generated_images/trust_network_connecting_everything.png";
import trustVaultImg from "@assets/generated_images/guardian_security_shield_logo.png";
import trustShieldImg from "@assets/Screenshot_20260213_013718_Chrome_1770968308695.jpg";


const GlowOrb = ({ color, size, top, left, delay = 0 }: { color: string; size: number; top: string; left: string; delay?: number }) => (
  <motion.div
    className="absolute rounded-full blur-3xl opacity-20 pointer-events-none"
    style={{ background: color, width: size, height: size, top, left }}
    animate={{ scale: [1, 1.2, 1], opacity: [0.15, 0.25, 0.15] }}
    transition={{ duration: 8, repeat: Infinity, delay }}
  />
);

export default function DWSCExecutiveSummary() {
  const [showGamesModal, setShowGamesModal] = useState(false);
  const carouselRef = useRef<HTMLDivElement>(null);

  const scrollCarousel = (direction: 'left' | 'right') => {
    if (carouselRef.current) {
      const scrollAmount = 280;
      carouselRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };
  
  return (
    <div className="min-h-screen relative overflow-hidden pt-20 pb-12" style={{ background: "linear-gradient(180deg, #070b16, #0c1222, #070b16)" }}>
      <GlowOrb color="linear-gradient(135deg, #06b6d4, #3b82f6)" size={500} top="-5%" left="60%" />
      <GlowOrb color="linear-gradient(135deg, #8b5cf6, #ec4899)" size={400} top="40%" left="-10%" delay={3} />
      {showGamesModal && <GamesComingSoonModal onClose={() => setShowGamesModal(false)} />}
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
              <div className="flex flex-wrap justify-center gap-2 mb-4">
                <div className="inline-block px-4 py-1 rounded-full bg-amber-500/20 text-amber-400 text-sm font-medium animate-pulse">
                  Chronicles BETA v0.1 LIVE
                </div>
                <div className="inline-block px-4 py-1 rounded-full bg-cyan-500/20 text-cyan-400 text-sm font-medium">
                  Executive Summary
                </div>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-4">
                <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Trust Layer
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
                <span className="text-cyan-400 font-semibold">Trust Layer</span> is a purpose-built 
                Layer 1 blockchain ecosystem designed for high-performance gaming, digital asset ownership, and 
                decentralized applications. Unlike general-purpose chains, Trust Layer is optimized from the ground up 
                for real-time interactive experiences and seamless digital commerce.
              </p>
              <p className="text-white/80 leading-relaxed mb-4">
                The ecosystem comprises three pillars: the <span className="text-purple-400 font-semibold">Trust Layer infrastructure</span>, 
                the <span className="text-pink-400 font-semibold">Trust Layer Portal</span> for ecosystem access and DeFi services, 
                and <span className="text-amber-400 font-semibold">Chronicles</span> - an unprecedented adventure platform 
                spanning 10 verifiable historical eras where YOU are the hero that serves as the flagship application demonstrating 
                the chain's capabilities.
              </p>
              <p className="text-white/80 leading-relaxed">
                DarkWave Studios is building a complete vertical stack: from blockchain consensus to end-user applications, 
                ensuring tight integration and optimal performance across all layers.
              </p>
            </motion.div>

            {/* Network Vision */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-gradient-to-r from-purple-950/50 to-pink-950/30 border border-purple-500/20 rounded-2xl p-8"
            >
              <h2 className="text-2xl font-display font-bold text-white mb-4 flex items-center gap-3">
                <Globe className="w-6 h-6 text-purple-400" />
                The Trust Layer Vision
              </h2>
              <div className="space-y-4 text-white/80 leading-relaxed">
                <p>
                  <span className="text-purple-400 font-semibold">Beyond "cryptocurrency"</span> — Trust Layer is a 
                  <span className="text-cyan-400 font-semibold"> Coordinated Trust Infrastructure</span> designed for real 
                  business operations. We provide verified identity, accountability, and transparent audit trails that 
                  enterprises need for trusted relationships.
                </p>
                <p>
                  <span className="text-pink-400 font-semibold">Signal (SIG)</span> is not a speculative asset — it's a 
                  <span className="text-amber-400 font-semibold"> Trust Network Access Token</span>. Signal represents 
                  acknowledgement and proof of participation in the trust network. The value is the infrastructure 
                  it unlocks, not speculation.
                </p>
                <p>
                  Our mission: deliver fast, feature-rich trust infrastructure with a premium user experience — serving 
                  enterprises seeking trusted business relationships, creators building digital legacies, and communities 
                  looking for transparent, accountable platforms.
                </p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Four Pillars */}
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
              <p className="text-white/60">Three integrated pillars powering the Trust Layer vision</p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  title: "DWSC Blockchain",
                  subtitle: "Layer 1 Infrastructure",
                  description: "Proof-of-Authority consensus optimized for gaming. Sub-second finality, high throughput, and native support for complex digital assets.",
                  icon: Database,
                  color: "cyan",
                  features: ["PoA Consensus", "Native Signal (SIG)", "Smart Contracts", "Cross-Chain Bridge"]
                },
                {
                  title: "Trust Layer Portal",
                  subtitle: "Ecosystem Gateway",
                  description: "Complete DeFi suite with Signal swaps, staking, NFT marketplace, and developer tools. The unified interface for the entire ecosystem.",
                  icon: Globe,
                  color: "purple",
                  features: ["DEX & Swaps", "Liquid Staking", "NFT Market", "Dev Studio"]
                },
                {
                  title: "AI Trading Suite",
                  subtitle: "Pulse & Strike Agent",
                  description: "ML-powered market intelligence platform. Pulse provides verified price predictions with transparent accuracy tracking. Strike Agent detects new opportunities with AI risk scoring.",
                  icon: Zap,
                  color: "amber",
                  features: ["Price Predictions", "Risk Scoring", "Memecoin Sniper", "Win Rate Tracking"]
                },
                {
                  title: "Chronicles",
                  subtitle: "Flagship Application",
                  description: "Unprecedented adventure platform across 10 verifiable historical eras. Real-time AI-driven world where YOU are the hero. Revenue through creator licensing and brand sponsorships.",
                  icon: Gamepad2,
                  color: "pink",
                  features: ["10 Eras", "AI NPCs", "Creator Economy", "Brand Sponsorships"]
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

        {/* Platform Features - Full Ecosystem Carousel */}
        <section className="py-12 px-4 relative overflow-hidden">
          <div className="container mx-auto max-w-6xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-8 text-center"
            >
              <h2 className="text-2xl md:text-3xl font-display font-bold text-white mb-2 flex items-center justify-center gap-3">
                <Sparkles className="w-6 h-6 text-amber-400" />
                Complete Platform Features
              </h2>
              <p className="text-white/60">Swipe to explore everything built and operational in the Trust Layer ecosystem</p>
            </motion.div>

            <div className="relative">
              <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-slate-950 to-transparent z-10 pointer-events-none" />
              <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-slate-950 to-transparent z-10 pointer-events-none" />
              
              <button
                onClick={() => scrollCarousel('left')}
                className="hidden md:flex absolute left-2 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 items-center justify-center hover:bg-white/20 transition-colors"
                data-testid="carousel-prev"
              >
                <ChevronLeft className="w-5 h-5 text-white" />
              </button>
              <button
                onClick={() => scrollCarousel('right')}
                className="hidden md:flex absolute right-2 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 items-center justify-center hover:bg-white/20 transition-colors"
                data-testid="carousel-next"
              >
                <ChevronRight className="w-5 h-5 text-white" />
              </button>
              
              <div ref={carouselRef} className="flex gap-4 overflow-x-auto scrollbar-hide px-8 py-4 snap-x snap-mandatory touch-pan-x">
                {[
                  { title: "Pulse AI", desc: "ML-powered market predictions with verified accuracy tracking. Fear & Greed index, multi-timeframe analysis.", img: pulseImg, href: "/pulse", domain: "dwsc.io" },
                  { title: "Strike Agent", desc: "Solana memecoin sniper with AI risk scoring. Honeypot detection, liquidity analysis, Phantom integration.", img: strikeImg, href: "/strike-agent", domain: "strikeagent.io" },
                  { title: "TrustShield.tech", desc: "World's first AI agent certification. Verify, certify, and protect autonomous AI systems. Free scanning tools and paid Guardian certification.", img: trustShieldImg, href: "/guardian-ai", domain: "trustshield.tech" },
                  { title: "ChronoChat", desc: "Community platform with real-time messaging, channels, reactions, and Shells virtual currency.", img: chronochatImg, href: "/community-hub", domain: "chronochat.io" },
                  { title: "VedaSolus", desc: "Holistic wellness platform connecting practitioners of all traditions - Western, Eastern, Ayurvedic, energy healing.", img: vedasolusImg, href: "/ecosystem", domain: "vedasolus.io" },
                  { title: "Chronicles", desc: "10 verifiable historical eras. AI-powered parallel life simulation. Not a game - a life. YOUR legend.", img: chroniclesImg, href: "/chronicles", domain: "yourlegacy.io" },
                  { title: "Signal Presale", desc: "Signal at $0.001 each. Tiered pricing through launch. Up to 25% early adopter bonus.", img: presaleImg, href: "/presale", domain: "dwsc.io" },
                  { title: "DEX & Swap", desc: "AMM-style decentralized exchange. Trade Signal with low fees and instant settlement on-chain.", img: dexImg, href: "/swap", domain: "dwsc.io" },
                  { title: "Liquid Staking", desc: "Stake SIG, receive stSIG. Earn rewards while maintaining full liquidity for DeFi.", img: liquidStakingImg, href: "/liquid-staking", domain: "dwsc.io" },
                  { title: "NFT Marketplace", desc: "Create, buy, sell NFTs. 2.5% transaction fees. Built-in rarity analyzer and collection tools.", img: nftImg, href: "/nft-marketplace", domain: "dwsc.io" },
                  { title: "Cross-Chain Bridge", desc: "Lock & mint SIG ↔ wSIG. Ethereum Sepolia and Solana Devnet bridges live.", img: bridgeImg, href: "/bridge", domain: "dwsc.io" },
                  { title: "Validator Network", desc: "Become a network validator. 10,000 SIG airdrop for founders, longevity bonuses, governance rights.", img: validatorImg, href: "/validators", domain: "dwsc.io" },
                  { title: "The Arcade", desc: "Premium sweepstakes casino & free arcade classics. Dragon's Fortune, Orbit Crash, Royal Coinflip, retro games and more. Dual-currency legal gaming.", img: theArcadeImg, href: "/games-home", domain: "darkwavegames.io" },
                  { title: "TrustHome", desc: "White-label real estate platform with blockchain-verified trust scoring. Property listings, agent verification, and transparent transaction history.", img: trustHomeImg, href: "#", comingSoon: true, domain: "trusthome.replit.app" },
                  { title: "TrustVault", desc: "Secure digital asset vault with blockchain encryption. Store documents, credentials, and sensitive data with verified access controls and audit trails.", img: trustVaultImg, href: "#", comingSoon: true, domain: "trustvault.replit.app" },
                  { title: "AI NFT Generator", desc: "Describe your vision, AI generates unique artwork, mint directly as NFT on the Trust Layer.", img: aiNftImg, href: "/ai-nft-generator", domain: "dwsc.io" },
                  { title: "Developer Portal", desc: "Full APIs, SDKs, webhooks, testnet faucet. Complete documentation for building on Trust Layer.", img: developerImg, href: "/developers", domain: "dwsc.io" },
                  { title: "Block Explorer", desc: "Real-time blockchain data. Transaction history, network stats, validator monitoring.", img: explorerImg, href: "/explorer", domain: "dwsc.io" },
                  { title: "Referral Rewards", desc: "Earn Signal for referrals. Fraud detection, automated payouts, transparent tracking.", img: referralImg, href: "/referrals", domain: "dwsc.io" },
                  { title: "Subscriptions", desc: "Pulse Pro, Strike Agent, Complete Bundle. Free trials available. Premium tools unlocked.", img: subscriptionImg, href: "/billing", domain: "dwsc.io" }
                ].map((feature, i) => {
                  const cardContent = (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.02 }}
                      whileHover={{ scale: 1.02, y: -4 }}
                      className="shrink-0 w-[280px] snap-center cursor-pointer group"
                      data-testid={`feature-${i}`}
                    >
                      <div className="h-full bg-slate-900/90 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden hover:border-cyan-500/50 transition-all duration-300 shadow-xl">
                        <div className="relative h-32 overflow-hidden">
                          <img 
                            src={feature.img} 
                            alt={feature.title} 
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />
                          <div className="absolute top-2 right-2">
                            <span className="px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-sm text-[9px] text-cyan-300 font-mono border border-cyan-500/30">
                              {feature.domain}
                            </span>
                          </div>
                        </div>
                        <div className="p-4">
                          <h3 className="font-bold text-white text-sm mb-1.5 group-hover:text-cyan-300 transition-colors">{feature.title}</h3>
                          <p className="text-[11px] text-white/60 leading-relaxed line-clamp-3">{feature.desc}</p>
                        </div>
                      </div>
                    </motion.div>
                  );
                  
                  if ('comingSoon' in feature && feature.comingSoon) {
                    return (
                      <div key={feature.title} onClick={() => setShowGamesModal(true)}>
                        {cardContent}
                      </div>
                    );
                  }
                  
                  return (
                    <Link key={feature.title} href={feature.href}>
                      {cardContent}
                    </Link>
                  );
                })}
              </div>
            </div>
            
            <p className="text-center text-white/40 text-xs mt-4">
              <span className="md:hidden">← Swipe to explore all features →</span>
              <span className="hidden md:inline">Use arrows or scroll to explore all features</span>
            </p>
          </div>
        </section>

        {/* Why Join - Benefits Teaser */}
        <section className="py-16 px-4 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-slate-900/50 via-purple-950/20 to-slate-900/50" />
          <div className="container mx-auto max-w-5xl relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <Badge className="mb-4 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border-cyan-500/30 text-cyan-300">
                Early Adopter Advantage
              </Badge>
              <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-4">
                Why Join the <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">Trust Layer</span> Now?
              </h2>
              <p className="text-white/60 max-w-2xl mx-auto">
                The earlier you join, the more you benefit. First movers get the best positions, lowest prices, and highest rewards.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  title: "Ground Floor Pricing",
                  desc: "Signal starts at $0.001 — 8x cheaper than launch price. Early investors see massive potential upside.",
                  gradient: "from-amber-500 to-orange-500",
                  stat: "8x",
                  statLabel: "potential gain"
                },
                {
                  title: "Founder Validator Status",
                  desc: "First 100 validators receive 10,000 SIG airdrop plus permanent 'Founder' badge and governance rights.",
                  gradient: "from-emerald-500 to-cyan-500",
                  stat: "10K",
                  statLabel: "SIG airdrop"
                },
                {
                  title: "Early Adopter Bonuses",
                  desc: "Up to 25% bonus on presale purchases. Position #1-100 gets maximum multiplier on all rewards.",
                  gradient: "from-purple-500 to-pink-500",
                  stat: "25%",
                  statLabel: "bonus Signal"
                },
                {
                  title: "Referral Rewards",
                  desc: "Earn Signal for every person you bring. Build a network, earn passive income from their activity.",
                  gradient: "from-red-500 to-rose-500",
                  stat: "∞",
                  statLabel: "earning potential"
                },
                {
                  title: "Shells → Signal",
                  desc: "Earn Shells through quests and engagement. All Shells convert to Signal at launch — free access.",
                  gradient: "from-cyan-500 to-blue-500",
                  stat: "FREE",
                  statLabel: "Signal conversion"
                },
                {
                  title: "Exclusive Access",
                  desc: "Early members get beta access to Chronicles, Strike Agent, and upcoming apps before public launch.",
                  gradient: "from-indigo-500 to-violet-500",
                  stat: "VIP",
                  statLabel: "beta access"
                }
              ].map((benefit, i) => (
                <motion.div
                  key={benefit.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="group"
                >
                  <div className="h-full bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:border-white/20 transition-all relative overflow-hidden">
                    <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${benefit.gradient} opacity-10 rounded-full blur-2xl group-hover:opacity-20 transition-opacity`} />
                      <div className="flex items-center justify-between mb-4">
                        <h3 className={`font-bold text-lg bg-gradient-to-r ${benefit.gradient} bg-clip-text text-transparent`}>
                          {benefit.title}
                        </h3>
                        <div className="text-right">
                          <p className={`text-2xl font-bold bg-gradient-to-r ${benefit.gradient} bg-clip-text text-transparent`}>
                            {benefit.stat}
                          </p>
                          <p className="text-[10px] text-white/40">{benefit.statLabel}</p>
                        </div>
                      </div>
                      <p className="text-sm text-white/60 leading-relaxed">{benefit.desc}</p>
                    </div>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mt-10 text-center"
            >
              <Link href="/presale">
                <Button size="lg" className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-400 hover:to-purple-400 text-white px-8 py-6 text-lg font-semibold shadow-lg shadow-purple-500/20">
                  Join the Presale Now
                  <ArrowRightLeft className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <p className="text-white/40 text-sm mt-4">Limited time. Prices increase with each milestone.</p>
            </motion.div>
          </div>
        </section>

        {/* Technical Architecture */}
        <section className="py-12 px-4 bg-slate-900/50">
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
                    <h4 className="text-sm font-semibold text-white/80 mb-2">Native Signal (SIG)</h4>
                    <ul className="space-y-1 text-sm text-white/60">
                      <li>• <span className="text-white">1 Billion</span> total supply</li>
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
                      <li>• Lock & mint model (SIG ↔ wSIG)</li>
                      <li>• <span className="text-white">Ethereum</span> bridge (ERC-20 wSIG)</li>
                      <li>• <span className="text-white">Solana</span> bridge (SPL wSIG)</li>
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
                  title: "Guardian Certification",
                  source: "Security Services",
                  description: "Enterprise blockchain audits: $5,999 (Assurance Lite) to $14,999 (Guardian Premier). Immediate revenue.",
                  icon: Shield
                },
                {
                  title: "Guardian Shield",
                  source: "Security Services",
                  description: "Continuous monitoring subscriptions: Watch ($299/mo), Shield ($999/mo), Command ($2,999/mo).",
                  icon: Activity
                },
                {
                  title: "Subscriptions",
                  source: "SaaS",
                  description: "Pulse Pro ($14.99/mo), StrikeAgent ($30/mo), Complete Bundle ($39.99/mo). Annual plans available.",
                  icon: CreditCard
                },
                {
                  title: "Shell Packages",
                  source: "Virtual Currency",
                  description: "Starter (100/$4.99), Popular (500/$19.99), Premium (1,200/$39.99), Ultimate (3,000/$79.99).",
                  icon: Sparkles
                },
                {
                  title: "Signal Presale",
                  source: "Blockchain",
                  description: "Signal at $0.001 each. Community rewards capped at 1% of supply. TGE price $0.01 (10x).",
                  icon: Coins
                },
                {
                  title: "Domain Registration",
                  source: "Services",
                  description: "Premium .dwsc domains. $12-$350/year based on length. 30% early adopter discount.",
                  icon: Globe
                },
                {
                  title: "NFT Marketplace",
                  source: "DeFi",
                  description: "2.5% transaction fee on all NFT trades. Creator royalty facilitation.",
                  icon: Store
                },
                {
                  title: "DEX Fees",
                  source: "DeFi",
                  description: "0.3% fee on all Signal swaps. Liquidity provider incentives and protocol revenue.",
                  icon: ArrowRightLeft
                },
                {
                  title: "ChronoChat Tiers",
                  source: "Community",
                  description: "Free / $19 / $49 / $99 monthly community tiers. Cloud hosting from $149+/month.",
                  icon: MessageSquare
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
              <p className="text-white/60">Timeline: <span className="text-amber-400 font-semibold">Community-Driven</span> - Beta based on participation</p>
            </motion.div>

            <div className="space-y-4">
              {[
                {
                  phase: "Phase 0",
                  title: "Foundation",
                  date: "Current",
                  status: "in_progress",
                  blockchain: ["Testnet live", "Signal presale", "Bridge development"],
                  chronicles: ["Website launch", "Community building", "Single-era sandbox"]
                },
                {
                  phase: "Phase 1",
                  title: "Infrastructure",
                  date: "Coming Soon",
                  status: "upcoming",
                  blockchain: ["Mainnet preparation", "Validator onboarding", "DeFi launch"],
                  chronicles: ["Property registry", "Storefront system", "Creator licensing"]
                },
                {
                  phase: "Phase 2",
                  title: "Expansion",
                  date: "After Launch",
                  status: "upcoming",
                  blockchain: ["Mainnet launch", "Cross-chain bridges live", "Developer grants"],
                  chronicles: ["10 eras live", "Storefront marketplace", "Mobile apps"]
                },
                {
                  phase: "Phase 3",
                  title: "Scale",
                  date: "Community Driven",
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
                Partner With Trust Layer Studios
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
                  href="/tokenomics"
                  className="px-6 py-3 bg-white/10 hover:bg-white/15 border border-white/20 rounded-lg text-white font-medium transition-colors"
                  data-testid="link-tokenomics"
                >
                  Tokenomics
                </Link>
                <Link 
                  href="/competitive-analysis"
                  className="px-6 py-3 bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/30 rounded-lg text-amber-400 font-medium transition-colors"
                  data-testid="link-competitive"
                >
                  Competitive Analysis
                </Link>
                <Link 
                  href="/faq"
                  className="px-6 py-3 bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/30 rounded-lg text-purple-400 font-medium transition-colors"
                  data-testid="link-faq"
                >
                  FAQ
                </Link>
                <Link 
                  href="/crowdfund"
                  className="px-6 py-3 bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/30 rounded-lg text-emerald-400 font-medium transition-colors"
                  data-testid="link-crowdfund"
                >
                  Support Development
                </Link>
              <p className="text-white/40 text-sm">
                DarkWave Studios • dwsc.io • yourlegacy.io
              </p>
              <p className="text-white/30 text-xs mt-2">
                Direct inquiries: cryptocreeper94@gmail.com
              </p>

      
    </div>
    </div>
    </section>
    </motion.div>
  );
}
