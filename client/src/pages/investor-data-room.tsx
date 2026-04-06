import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import {
  Lock, TrendingUp, DollarSign, Users, Layers, Globe, Zap, Building2,
  Shield, Code, Cpu, Download, Mail, Rocket, BarChart3, Target,
  Briefcase, Home, Gamepad2, GraduationCap, ChevronRight, Eye,
  CheckCircle, Star, Crown, MessageSquare, Server
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { GlassCard } from "@/components/glass-card";

import heroImg from "@assets/generated_images/trust-layer-ecosystem-hero.jpg";
import communityImg from "@assets/generated_images/community_building_future.jpg";
import validatorImg from "@assets/generated_images/validator_network_servers.jpg";
import trustHomeImg from "@assets/generated_images/ethereum_smart_city_network.jpg";
import presaleImg from "@assets/generated_images/token_presale_investment.jpg";

const fadeUp = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } };
const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.1 } } };

function AnimatedCounter({ target, prefix = "", suffix = "" }: { target: number; prefix?: string; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const duration = 2000;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [inView, target]);

  return <span ref={ref}>{prefix}{count.toLocaleString()}{suffix}</span>;
}

function SectionWrapper({ children }: { children: React.ReactNode }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={stagger}
      className="py-12 sm:py-16 px-4"
    >
      <div className="container mx-auto max-w-6xl">{children}</div>
    </motion.div>
  );
}

const revenueStreams = [
  { source: "Transaction Fees", contribution: "25%", desc: "Every on-chain operation generates protocol revenue" },
  { source: "Guardian Certifications", contribution: "18%", desc: "Security audits at $6K-$15K per audit" },
  { source: "Subscription Tiers", contribution: "15%", desc: "Scholar ($19.99/mo), Master ($49.99/mo)" },
  { source: "Trust Book Royalties", contribution: "10%", desc: "Platform commission on ebook sales" },
  { source: "Domain Sales (.tlid)", contribution: "8%", desc: "Blockchain domains $12-$350/year" },
  { source: "Bridge Fees", contribution: "8%", desc: "Cross-chain transfers across 5+ networks" },
  { source: "NFT Marketplace", contribution: "9%", desc: "Commission on trades and minting" },
  { source: "Enterprise Licensing", contribution: "7%", desc: "White-label and B2B API access" },
];

const marketOpportunities = [
  { market: "Real Estate", size: "$3.7T", icon: Building2, desc: "TrustHome verified agent platform disrupting traditional agent credentialing" },
  { market: "DeFi", size: "$2.3T", icon: TrendingUp, desc: "Full DeFi stack: DEX, staking, bridge, liquid staking, launchpad" },
  { market: "Gaming", size: "$180B", icon: Gamepad2, desc: "DarkWave Chronicles 3D, Arcade, and blockchain-powered gaming" },
  { market: "Education", size: "$400B", icon: GraduationCap, desc: "Trust Layer Academy: 15 tracks, 100+ courses, professional certifications" },
];

function generateReportText(label?: string): string {
  return `
================================================================================
                    TRUST LAYER — CONFIDENTIAL INVESTOR DATA ROOM
                          ${label ? `Prepared for: ${label}` : ""}
                          Generated: ${new Date().toLocaleDateString()}
================================================================================

FINANCIAL FORECAST (3-YEAR PROJECTIONS)
---------------------------------------
Year 1: $2.4M revenue | 15,000 users | 35 products live
Year 2: $12M revenue  | 85,000 users | Enterprise partnerships secured
Year 3: $45M revenue  | 350,000 users | Multi-chain expansion complete

REVENUE MODEL (8 STREAMS)
--------------------------
1. Transaction Fees (25%) — every on-chain operation
2. Guardian Certifications (18%) — $6,000-$15,000 per security audit
3. Subscription Tiers (15%) — Scholar ($19.99/mo), Master ($49.99/mo)
4. Trust Book Royalties (10%) — platform commission on ebook sales
5. Domain Sales (8%) — .tlid blockchain domains ($12-$350/year)
6. Bridge Fees (8%) — cross-chain transfers across 5+ networks
7. NFT Marketplace (9%) — commission on trades and minting
8. Enterprise Licensing (7%) — white-label and B2B API access

MARKET OPPORTUNITY
-------------------
Real Estate: $3.7T — TrustHome blockchain-verified agent platform
DeFi:        $2.3T — Full stack: DEX, staking, bridge, launchpad
Gaming:      $180B — DarkWave Chronicles 3D, Arcade, blockchain gaming
Education:   $400B — Trust Layer Academy, 15 tracks, 100+ courses

TECHNOLOGY MOAT
----------------
- Own blockchain: Layer 1 BFT-PoA, 200K+ TPS, 400ms finality
- Own language: Lume — deterministic natural-language programming language (npm published)
- Own products: 35 products across DeFi, security, education, gaming, real estate

SIGNAL PRESALE
--------------
Status: LAUNCHING IN 2 WEEKS
Native Asset: Signal (SIG) — 1,000,000,000 total supply
Early Pricing: Significant advantage for pre-launch participants
Allocation: Limited — first-come, first-served basis

TRUSTHOME — REAL ESTATE DEEP DIVE
-----------------------------------
- Blockchain-verified agent profiles with trust scores
- Every transaction hallmarked on-chain (TL-XXXXXXXX)
- Property listing management with provenance tracking
- Client relationship tools with transparent audit trails
- $3.7T addressable market with zero blockchain competitors

CONTACT
-------
Email: cryptocreeper94@gmail.com
Website: https://dwtl.io

================================================================================
                         CONFIDENTIAL — TRUST LAYER
================================================================================
`.trim();
}

function PinGate({ onSuccess }: { onSuccess: (label?: string) => void }) {
  const [pin, setPin] = useState("");
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const existing = sessionStorage.getItem("investor-session");
    if (existing) {
      onSuccess();
    }
    inputRef.current?.focus();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pin.trim()) return;
    setLoading(true);
    setError(false);
    try {
      const res = await fetch("/api/investor/pin/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pin: pin.trim() }),
      });
      if (res.ok) {
        const data = await res.json();
        sessionStorage.setItem("investor-session", data.sessionToken || "verified");
        onSuccess(data.label);
      } else {
        setError(true);
        setTimeout(() => setError(false), 1500);
      }
    } catch {
      setError(true);
      setTimeout(() => setError(false), 1500);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#06060a] flex items-center justify-center px-4">
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-cyan-900/10 via-[#06060a] to-[#06060a] pointer-events-none" />
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative w-full max-w-md"
      >
        <GlassCard glow>
          <div className="p-8 sm:p-10 text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", delay: 0.2 }}
              className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-purple-500/20 border border-cyan-500/30 flex items-center justify-center"
            >
              <Lock className="w-8 h-8 text-cyan-400" />
            </motion.div>
            <h1 className="text-2xl sm:text-3xl font-display font-black text-white mb-2">
              Investor Data Room
            </h1>
            <p className="text-white/40 text-sm mb-8">
              Enter your investor PIN to access confidential materials
            </p>
            <form onSubmit={handleSubmit}>
              <motion.div
                animate={error ? { x: [-10, 10, -10, 10, 0] } : {}}
                transition={{ duration: 0.4 }}
              >
                <input
                  ref={inputRef}
                  type="text"
                  value={pin}
                  onChange={(e) => setPin(e.target.value.toUpperCase())}
                  placeholder="INV-XXXXXX"
                  className={`w-full h-14 px-4 text-center text-lg font-mono tracking-widest rounded-xl bg-[#0a0b10] border ${
                    error ? "border-purple-500 shadow-[0_0_20px_rgba(168,85,247,0.3)]" : "border-[#1a1b2e] focus:border-cyan-500/50"
                  } text-white placeholder:text-white/20 outline-none transition-all`}
                  data-testid="input-investor-pin"
                />
              </motion.div>
              {error && (
                <motion.p
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-purple-400 text-sm mt-3"
                >
                  Invalid PIN. Please try again.
                </motion.p>
              )}
              <Button
                type="submit"
                disabled={loading || !pin.trim()}
                className="w-full mt-6 h-12 bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white font-bold text-base shadow-[0_0_30px_rgba(6,182,212,0.3)]"
                data-testid="button-verify-pin"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <Eye className="w-5 h-5 mr-2" />
                    Access Data Room
                  </>
                )}
              </Button>
            </form>
          </div>
        </GlassCard>
      </motion.div>
    </div>
  );
}

export default function InvestorDataRoom() {
  const [authenticated, setAuthenticated] = useState(false);
  const [label, setLabel] = useState<string | undefined>();

  const handleAuth = (investorLabel?: string) => {
    setAuthenticated(true);
    if (investorLabel) setLabel(investorLabel);
  };

  const handleDownload = () => {
    const content = generateReportText(label);
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "Trust-Layer-Investor-Report.txt";
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!authenticated) {
    return <PinGate onSuccess={handleAuth} />;
  }

  return (
    <div className="min-h-screen bg-[#06060a] text-white relative overflow-hidden">
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-cyan-900/15 via-[#06060a] to-[#06060a] pointer-events-none" />
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-purple-900/10 via-transparent to-transparent pointer-events-none" />
      <div className="fixed top-32 left-16 w-96 h-96 rounded-full bg-cyan-500/5 blur-[120px] animate-pulse pointer-events-none" />
      <div className="fixed top-64 right-24 w-80 h-80 rounded-full bg-purple-500/8 blur-[100px] animate-pulse pointer-events-none" style={{ animationDelay: "1s" }} />

      <main className="relative pb-16">

        <section className="relative py-16 sm:py-24 px-4">
          <div className="absolute inset-0">
            <img src={heroImg} alt="Trust Layer Ecosystem" className="w-full h-full object-cover opacity-10" />
            <div className="absolute inset-0 bg-gradient-to-b from-[#06060a]/50 via-[#06060a]/80 to-[#06060a]" />
          </div>
          <div className="container mx-auto max-w-6xl relative">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="text-center">
              <Badge className="mb-6 px-4 py-2 bg-purple-500/10 border-purple-500/30 text-purple-400 text-xs font-bold tracking-wider shadow-[0_0_20px_rgba(168,85,247,0.2)]" data-testid="badge-confidential">
                <Lock className="w-3 h-3 mr-2" />
                Confidential Investor Materials
              </Badge>
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-black mb-4 leading-tight">
                {label ? (
                  <>
                    <span className="text-white/70 text-xl sm:text-2xl block mb-2">Welcome back,</span>
                    <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">{label}</span>
                  </>
                ) : (
                  <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-cyan-300 bg-clip-text text-transparent">
                    Investor Data Room
                  </span>
                )}
              </h1>
              <p className="text-base sm:text-lg text-white/40 max-w-2xl mx-auto mb-8">
                Exclusive access to Trust Layer financial projections, market analysis,
                technology overview, and presale details.
              </p>
              <Button
                onClick={handleDownload}
                size="lg"
                variant="outline"
                className="border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/10 font-bold px-8 min-h-[44px]"
                data-testid="button-download-report"
              >
                <Download className="w-5 h-5 mr-2" />
                Download Full Report
              </Button>
            </motion.div>
          </div>
        </section>

        <SectionWrapper>
          <motion.div variants={fadeUp}>
            <Badge className="mb-4 bg-cyan-500/10 border-cyan-500/30 text-cyan-400 text-xs">
              <BarChart3 className="w-3 h-3 mr-1" />
              3-Year Financial Forecast
            </Badge>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-display font-black text-white mb-8">
              Growth{" "}
              <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">Trajectory</span>
            </h2>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
            {[
              { year: "Year 1", revenue: 2.4, revenueLabel: "$2.4M", users: "15K", products: "35 products live", progress: 20 },
              { year: "Year 2", revenue: 12, revenueLabel: "$12M", users: "85K", products: "Enterprise partnerships", progress: 55 },
              { year: "Year 3", revenue: 45, revenueLabel: "$45M", users: "350K", products: "Multi-chain expansion", progress: 100 },
            ].map((item, i) => (
              <motion.div key={item.year} variants={fadeUp}>
                <GlassCard glow>
                  <div className="p-6 sm:p-8">
                    <div className="text-xs font-bold text-purple-400 uppercase tracking-widest mb-3">{item.year}</div>
                    <div className="text-3xl sm:text-4xl font-black text-white mb-1" data-testid={`stat-revenue-year-${i + 1}`}>
                      <AnimatedCounter target={item.revenue} prefix="$" suffix="M" />
                    </div>
                    <div className="text-sm text-white/40 mb-4">Projected Revenue</div>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-white/50">Users</span>
                        <span className="text-cyan-400 font-bold">{item.users}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-white/50">Milestone</span>
                        <span className="text-purple-400 font-medium text-xs">{item.products}</span>
                      </div>
                      <div className="h-2 bg-[#0a0b10] rounded-full overflow-hidden border border-[#1a1b2e]">
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: `${item.progress}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 1.5, delay: i * 0.2 }}
                          className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-purple-500"
                        />
                      </div>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </SectionWrapper>

        <SectionWrapper>
          <motion.div variants={fadeUp}>
            <Badge className="mb-4 bg-purple-500/10 border-purple-500/30 text-purple-400 text-xs">
              <DollarSign className="w-3 h-3 mr-1" />
              Revenue Model
            </Badge>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-display font-black text-white mb-8">
              8 Revenue{" "}
              <span className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">Streams</span>
            </h2>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {revenueStreams.map((stream, i) => (
              <motion.div key={stream.source} variants={fadeUp}>
                <GlassCard glow>
                  <div className="p-5 sm:p-6">
                    <div className="text-2xl font-black bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent mb-1">
                      {stream.contribution}
                    </div>
                    <div className="text-sm font-bold text-white mb-2">{stream.source}</div>
                    <div className="text-xs text-white/40 leading-relaxed">{stream.desc}</div>
                    <div className="mt-3 h-1.5 bg-[#0a0b10] rounded-full overflow-hidden border border-[#1a1b2e]">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: stream.contribution }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, delay: i * 0.1 }}
                        className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-purple-500"
                      />
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </SectionWrapper>

        <SectionWrapper>
          <motion.div variants={fadeUp}>
            <Badge className="mb-4 bg-cyan-500/10 border-cyan-500/30 text-cyan-400 text-xs">
              <Globe className="w-3 h-3 mr-1" />
              Market Opportunity
            </Badge>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-display font-black text-white mb-8">
              Addressable{" "}
              <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">Markets</span>
            </h2>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            {marketOpportunities.map((mkt, i) => (
              <motion.div key={mkt.market} variants={fadeUp}>
                <GlassCard glow>
                  <div className="p-6 sm:p-8 flex items-start gap-4">
                    <div className="w-12 h-12 min-w-[48px] rounded-xl bg-gradient-to-br from-cyan-500/20 to-purple-500/20 border border-cyan-500/20 flex items-center justify-center">
                      <mkt.icon className="w-6 h-6 text-cyan-400" />
                    </div>
                    <div>
                      <div className="text-sm text-white/50 mb-1">{mkt.market}</div>
                      <div className="text-3xl sm:text-4xl font-black bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent mb-2" data-testid={`stat-market-${mkt.market.toLowerCase().replace(/\s+/g, "-")}`}>
                        {mkt.size}
                      </div>
                      <p className="text-xs text-white/40 leading-relaxed">{mkt.desc}</p>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </SectionWrapper>

        <SectionWrapper>
          <motion.div variants={fadeUp} className="relative">
            <div className="absolute inset-0 rounded-2xl overflow-hidden">
              <img src={presaleImg} alt="Signal Presale" className="w-full h-full object-cover opacity-10" />
              <div className="absolute inset-0 bg-gradient-to-r from-[#06060a] via-[#06060a]/90 to-[#06060a]" />
            </div>
            <GlassCard glow>
              <div className="p-8 sm:p-12 relative">
                <motion.div
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/20 border border-purple-500/40 text-purple-300 text-sm font-black tracking-wider mb-6"
                  data-testid="badge-presale-countdown"
                >
                  <Rocket className="w-4 h-4" />
                  LAUNCHING IN 2 WEEKS
                </motion.div>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-display font-black text-white mb-4">
                  Signal{" "}
                  <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">Presale</span>
                </h2>
                <p className="text-white/50 max-w-2xl mb-8 leading-relaxed">
                  The Signal (SIG) presale represents a rare opportunity to acquire the native asset
                  of a fully-built Layer 1 ecosystem at pre-launch pricing. With 35 products already developed,
                  this isn't speculative — it's a functioning platform.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                  {[
                    { label: "Early Pricing Advantage", value: "Up to 10x", desc: "Pre-launch pricing vs projected launch value" },
                    { label: "Total Supply", value: "1B SIG", desc: "Fixed supply, no inflation mechanism" },
                    { label: "Limited Allocation", value: "First Come", desc: "Presale allocation is capped and non-renewable" },
                  ].map((item) => (
                    <div key={item.label} className="bg-[#0a0b10] rounded-xl p-4 border border-[#1a1b2e]">
                      <div className="text-xs text-white/40 mb-1">{item.label}</div>
                      <div className="text-xl font-black text-cyan-400" data-testid={`stat-presale-${item.label.toLowerCase().replace(/\s+/g, "-")}`}>{item.value}</div>
                      <div className="text-xs text-white/30 mt-1">{item.desc}</div>
                    </div>
                  ))}
                </div>
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white font-bold px-10 min-h-[44px] shadow-[0_0_30px_rgba(6,182,212,0.4)]"
                  data-testid="button-view-presale"
                  onClick={() => window.open("/presale", "_blank")}
                >
                  <Rocket className="w-5 h-5 mr-2" />
                  View Presale Details
                </Button>
              </div>
            </GlassCard>
          </motion.div>
        </SectionWrapper>

        <SectionWrapper>
          <motion.div variants={fadeUp}>
            <Badge className="mb-4 bg-purple-500/10 border-purple-500/30 text-purple-400 text-xs">
              <Briefcase className="w-3 h-3 mr-1" />
              Investment Packages
            </Badge>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-display font-black text-white mb-3">
              Structured{" "}
              <span className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">Investment Tiers</span>
            </h2>
            <p className="text-white/40 max-w-2xl mb-8 text-sm sm:text-base">
              Three tiers designed for different investment levels. All tiers include pre-launch Signal pricing and ecosystem access.
            </p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
            {[
              {
                name: "Pioneer",
                icon: Rocket,
                allocation: "100,000 SIG",
                price: "$5,000",
                perSig: "$0.05 / SIG",
                highlight: false,
                benefits: [
                  "Pre-launch SIG pricing before public listing",
                  "Early access to all 38 ecosystem products",
                  "Pioneer Hallmark badge (on-chain, permanent)",
                  "Monthly investor newsletter with dev updates",
                  "Private Signal Chat investor channel access",
                ],
              },
              {
                name: "Venture",
                icon: Star,
                allocation: "500,000 SIG",
                price: "$20,000",
                perSig: "$0.04 / SIG",
                highlight: true,
                benefits: [
                  "Everything in Pioneer, plus:",
                  "Better per-SIG rate ($0.04 vs $0.05)",
                  "Licensed validator node (earn staking rewards)",
                  "Quarterly video briefings with the founder",
                  "Priority API access for building on Trust Layer",
                  "Named in genesis block acknowledgments",
                ],
              },
              {
                name: "Strategic Partner",
                icon: Crown,
                allocation: "1,000,000+ SIG",
                price: "Custom",
                perSig: "Best available rate",
                highlight: false,
                benefits: [
                  "Everything in Venture, plus:",
                  "Best available per-SIG rate (negotiated)",
                  "Direct advisory access to the founder",
                  "Input on product roadmap priorities",
                  "Product co-development rights (e.g., TrustHome market exclusivity)",
                  "Revenue-sharing options on specific products",
                  "Custom integration support for your business",
                ],
              },
            ].map((tier, i) => (
              <motion.div key={tier.name} variants={fadeUp}>
                <GlassCard glow={tier.highlight}>
                  <div className={`relative overflow-hidden ${tier.highlight ? "" : ""}`}>
                    {tier.highlight && (
                      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 via-purple-500 to-cyan-500" />
                    )}
                    <div className="p-6 sm:p-8">
                      {tier.highlight && (
                        <Badge className="mb-4 bg-purple-500/20 border-purple-500/40 text-purple-300 text-[10px] font-bold uppercase tracking-wider">
                          Most Popular
                        </Badge>
                      )}
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500/20 to-purple-500/20 border border-cyan-500/20 flex items-center justify-center mb-4">
                        <tier.icon className="w-6 h-6 text-cyan-400" />
                      </div>
                      <h3 className="text-xl font-black text-white mb-1" data-testid={`tier-name-${tier.name.toLowerCase().replace(/\s+/g, "-")}`}>{tier.name}</h3>
                      <div className="text-xs text-white/40 mb-4">{tier.perSig}</div>
                      <div className="flex items-baseline gap-2 mb-2">
                        <span className="text-3xl sm:text-4xl font-black bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent" data-testid={`tier-price-${tier.name.toLowerCase().replace(/\s+/g, "-")}`}>
                          {tier.price}
                        </span>
                      </div>
                      <div className="text-sm text-purple-400 font-medium mb-6">{tier.allocation}</div>
                      <div className="space-y-3">
                        {tier.benefits.map((benefit, j) => (
                          <div key={j} className="flex items-start gap-2.5">
                            <CheckCircle className="w-4 h-4 text-cyan-400 mt-0.5 shrink-0" />
                            <span className="text-xs text-white/60 leading-relaxed">{benefit}</span>
                          </div>
                        ))}
                      </div>
                      <div className="mt-6">
                        <Button
                          className={`w-full min-h-[44px] font-bold ${
                            tier.highlight
                              ? "bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white shadow-[0_0_20px_rgba(6,182,212,0.3)]"
                              : "bg-white/5 border border-white/10 text-white hover:bg-white/10"
                          }`}
                          onClick={() => window.location.href = "mailto:cryptocreeper94@gmail.com?subject=Trust%20Layer%20Investment%20-%20" + encodeURIComponent(tier.name) + "%20Tier"}
                          data-testid={`button-invest-${tier.name.toLowerCase().replace(/\s+/g, "-")}`}
                        >
                          <Mail className="w-4 h-4 mr-2" />
                          {tier.name === "Strategic Partner" ? "Discuss Terms" : "Express Interest"}
                        </Button>
                      </div>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </div>
          <motion.div variants={fadeUp} className="mt-6 text-center">
            <p className="text-xs text-white/30">
              All allocations vest over 3 months (50% at TGE, 50% over following 2 months). Pricing valid during pre-launch period only.
            </p>
          </motion.div>
        </SectionWrapper>

        <SectionWrapper>
          <motion.div variants={fadeUp}>
            <Badge className="mb-4 bg-cyan-500/10 border-cyan-500/30 text-cyan-400 text-xs">
              <Shield className="w-3 h-3 mr-1" />
              Technology Moat
            </Badge>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-display font-black text-white mb-8">
              Defensible{" "}
              <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">Infrastructure</span>
            </h2>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
            {[
              {
                icon: Cpu,
                title: "Own Blockchain",
                stats: "200K+ TPS • 400ms Finality",
                desc: "Layer 1 BFT Proof-of-Authority chain built from scratch. Not a fork. Not an L2. Fully independent consensus with stake-weighted validators.",
                img: validatorImg,
              },
              {
                icon: Code,
                title: "Own Language",
                stats: "Lume • Published to npm",
                desc: "The world's first deterministic natural-language programming language. Native 'ask', 'think', 'generate' keywords. Compiles to JavaScript. Full compiler and runtime.",
                img: communityImg,
              },
              {
                icon: Layers,
                title: "Own Products",
                stats: "35 Products • 8 Verticals",
                desc: "DeFi, security, education, gaming, real estate, publishing, creative tools, developer infrastructure. All generating on-chain Hallmarks.",
                img: heroImg,
              },
            ].map((moat) => (
              <motion.div key={moat.title} variants={fadeUp}>
                <GlassCard glow>
                  <div className="relative overflow-hidden">
                    <img src={moat.img} alt={moat.title} className="w-full h-32 object-cover opacity-20" />
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[rgba(12,18,36,1)]" />
                  </div>
                  <div className="p-6">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500/20 to-purple-500/20 border border-cyan-500/20 flex items-center justify-center mb-4 -mt-10 relative z-10">
                      <moat.icon className="w-5 h-5 text-cyan-400" />
                    </div>
                    <h3 className="text-lg font-bold text-white mb-1">{moat.title}</h3>
                    <div className="text-xs text-purple-400 font-medium mb-3">{moat.stats}</div>
                    <p className="text-xs text-white/40 leading-relaxed">{moat.desc}</p>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </SectionWrapper>

        <SectionWrapper>
          <div className="flex flex-col lg:flex-row gap-6 lg:gap-10 items-center">
            <div className="w-full lg:w-1/2 rounded-2xl overflow-hidden border border-white/10 shadow-2xl shadow-cyan-500/10">
              <img src={trustHomeImg} alt="TrustHome Platform" className="w-full h-48 sm:h-64 lg:h-80 object-cover" loading="lazy" />
            </div>
            <motion.div variants={fadeUp} className="w-full lg:w-1/2">
              <Badge className="mb-4 bg-purple-500/10 border-purple-500/30 text-purple-400 text-xs">
                <Home className="w-3 h-3 mr-1" />
                Real Estate Deep Dive
              </Badge>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-display font-black text-white mb-4">
                TrustHome:{" "}
                <span className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">$3.7T Market</span>
              </h2>
              <p className="text-white/50 mb-6 leading-relaxed text-sm sm:text-base">
                TrustHome is the first blockchain-powered real estate agent verification platform.
                In a $3.7 trillion market with zero blockchain competitors, TrustHome brings
                verifiable trust scores, on-chain transaction history, and transparent credentialing.
              </p>
              <div className="space-y-3">
                {[
                  "Blockchain-verified agent profiles with on-chain trust scores",
                  "Every transaction hallmarked (TL-XXXXXXXX format)",
                  "Property listing management with full provenance tracking",
                  "Client relationship tools with transparent audit trails",
                  "Zero direct blockchain competitors in real estate credentialing",
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <ChevronRight className="w-4 h-4 text-cyan-400 mt-0.5 shrink-0" />
                    <span className="text-sm text-white/60">{item}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </SectionWrapper>

        <SectionWrapper>
          <motion.div variants={fadeUp} className="text-center">
            <Badge className="mb-4 bg-cyan-500/10 border-cyan-500/30 text-cyan-400 text-xs">
              <Mail className="w-3 h-3 mr-1" />
              Contact
            </Badge>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-display font-black text-white mb-4">
              Ready to{" "}
              <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">Connect?</span>
            </h2>
            <p className="text-white/40 max-w-lg mx-auto mb-8">
              For detailed discussions, due diligence materials, or to schedule a call,
              reach out directly.
            </p>
            <GlassCard glow>
              <div className="p-8 sm:p-10">
                <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-purple-500/20 border border-cyan-500/20 flex items-center justify-center">
                    <Mail className="w-7 h-7 text-cyan-400" />
                  </div>
                  <div className="text-center sm:text-left">
                    <div className="text-xs text-white/40 uppercase tracking-wider mb-1">Direct Contact</div>
                    <a
                      href="mailto:cryptocreeper94@gmail.com"
                      className="text-lg sm:text-xl font-bold text-cyan-400 hover:text-cyan-300 transition-colors min-h-[44px] inline-flex items-center"
                      data-testid="link-contact-email"
                    >
                      cryptocreeper94@gmail.com
                    </a>
                  </div>
                </div>
                <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
                  <Button
                    onClick={handleDownload}
                    variant="outline"
                    className="border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/10 font-bold min-h-[44px]"
                    data-testid="button-download-report-bottom"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download Report
                  </Button>
                  <Button
                    onClick={() => window.open("/pitch-deck", "_blank")}
                    variant="outline"
                    className="border-purple-500/50 text-purple-400 hover:bg-purple-500/10 font-bold min-h-[44px]"
                    data-testid="button-view-pitch-deck"
                  >
                    <Briefcase className="w-4 h-4 mr-2" />
                    View Pitch Deck
                  </Button>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        </SectionWrapper>

        <div className="text-center py-8 px-4">
          <p className="text-white/20 text-xs">
            This document contains confidential information intended solely for authorized investors.
            Distribution or reproduction without written consent is prohibited.
          </p>
        </div>
      </main>
    </div>
  );
}