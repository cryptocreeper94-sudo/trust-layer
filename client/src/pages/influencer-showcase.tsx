import { useState, useEffect, useRef } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { Link } from "wouter";
import {
  Shield, Sparkles, Rocket, Globe, Users, TrendingUp, Crown, Star,
  Megaphone, CheckCircle, Zap, Award, Gift, ChevronDown, ChevronRight,
  ArrowRight, ExternalLink, Play, Lock, Layers, Cpu, Gamepad2,
  ShieldCheck, BookOpen, Code2, Wallet, MessageCircle, Timer,
  BarChart3, Building2, Car, Heart, Utensils, TreePine, GraduationCap,
  Fingerprint, Trophy, Coins, Target, Eye, Mail
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { GlassCard } from "@/components/glass-card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { usePageAnalytics } from "@/hooks/use-analytics";

const LAUNCH_DATE = new Date("2026-08-23T00:00:00-05:00").getTime();

function useCountdown() {
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);
  const diff = Math.max(0, LAUNCH_DATE - now);
  return {
    days: Math.floor(diff / 86400000),
    hours: Math.floor((diff % 86400000) / 3600000),
    minutes: Math.floor((diff % 3600000) / 60000),
    seconds: Math.floor((diff % 60000) / 1000),
  };
}

const ECOSYSTEM_CATEGORIES: { name: string; icon: React.ComponentType<{ className?: string }>; apps: { name: string; url: string; desc: string }[] }[] = [
  {
    name: "Core Infrastructure",
    icon: Layers,
    apps: [
      { name: "Trust Layer", url: "https://dwtl.io", desc: "Layer 1 PoA Blockchain" },
      { name: "TrustHome", url: "https://trusthome.replit.app", desc: "Real Estate Agent Super Tool" },
      { name: "TrustVault", url: "/wallet", desc: "Multi-Chain Secure Wallet" },
      { name: "TLID.io", url: "https://tlid.io", desc: "Blockchain Domain Names (.tlid)" },
      { name: "SignalCast", url: "https://signalcast.ad", desc: "AI Social Media Automation (9 Platforms)" },
      { name: "THE VOID", url: "https://intothevoid.app", desc: "Premium Membership Identity" },
      { name: "Signal Chat", url: "/signal-core", desc: "Encrypted Cross-App Messaging" },
    ],
  },
  {
    name: "Security & Guardian Suite",
    icon: ShieldCheck,
    apps: [
      { name: "TrustShield", url: "https://trustshield.tech", desc: "Enterprise Security Monitoring" },
      { name: "Guardian Scanner", url: "/guardian", desc: "AI Agent Verification (13+ Chains)" },
      { name: "Guardian Screener", url: "/guardian-screener", desc: "DEX Screener & Threat Detection" },
    ],
  },
  {
    name: "DeFi & Finance",
    icon: Coins,
    apps: [
      { name: "TradeWorks AI", url: "https://tradeworksai.io", desc: "AI Trading Intelligence" },
      { name: "StrikeAgent", url: "https://strikeagent.io", desc: "AI Trading Bot (Hashed Predictions)" },
      { name: "Pulse", url: "/ml-dashboard", desc: "Predictive Market Analytics" },
    ],
  },
  {
    name: "Gaming & Entertainment",
    icon: Gamepad2,
    apps: [
      { name: "Chronicles", url: "https://yourlegacy.io", desc: "3D Life Simulation — Live Your Legacy" },
      { name: "The Arcade", url: "https://darkwavegames.io", desc: "Provably Fair Blockchain Games" },
      { name: "Bomber", url: "https://bomber.tlid.io", desc: "3D Long Driving Golf Game" },
      { name: "Trust Golf", url: "https://trustgolf.app", desc: "Premium Golf Companion App" },
    ],
  },
  {
    name: "Enterprise & Workforce",
    icon: Building2,
    apps: [
      { name: "ORBIT Staffing OS", url: "https://orbitstaffing.io", desc: "Blockchain-Verified HR & Payroll" },
      { name: "Orby Commander", url: "https://getorby.io", desc: "Venue & Event Operations Suite" },
    ],
  },
  {
    name: "Automotive & Transport",
    icon: Car,
    apps: [
      { name: "GarageBot", url: "https://garagebot.io", desc: "Smart Garage Automation" },
      { name: "Lot Ops Pro", url: "https://lotopspro.io", desc: "Autonomous Lot Management" },
      { name: "TORQUE", url: "https://garagebot.io/torque", desc: "Verified Auto Marketplace" },
      { name: "TL Driver Connect", url: "https://tldriverconnect.com", desc: "Driver Coordination & Logistics" },
    ],
  },
  {
    name: "Publishing & Education",
    icon: BookOpen,
    apps: [
      { name: "Trust Book", url: "/trust-book", desc: "Censorship-Free Publishing Platform" },
      { name: "Academy", url: "/academy", desc: "Crypto Education & Certification" },
    ],
  },
  {
    name: "Health, Outdoor & Services",
    icon: Heart,
    apps: [
      { name: "VedaSolus", url: "https://vedasolus.io", desc: "AI Holistic Wellness Platform" },
      { name: "Verdara", url: "https://verdara.replit.app", desc: "AI Outdoor Recreation Super-App" },
      { name: "Arbora", url: "https://verdara.replit.app/arbora", desc: "Professional Arborist Suite" },
      { name: "PaintPros", url: "https://paintpros.io", desc: "Painting Service Management" },
      { name: "Nashville Painting Pros", url: "https://nashpaintpros.io", desc: "Nashville's Premier Painters" },
    ],
  },
  {
    name: "Food & Hospitality",
    icon: Utensils,
    apps: [
      { name: "Happy Eats", url: "https://happyeats.app", desc: "Local Food Truck Ordering" },
      { name: "Brew & Board Coffee", url: "https://brewandboard.coffee", desc: "Coffee Shop Loyalty & Community" },
    ],
  },
  {
    name: "Development",
    icon: Code2,
    apps: [
      { name: "DWSC Studio", url: "/studio", desc: "Ecosystem Development IDE" },
      { name: "DarkWave Studios", url: "https://darkwavestudios.io", desc: "Parent Company Portal" },
    ],
  },
];

const PILLARS = [
  {
    icon: Shield,
    title: "Layer 1 Blockchain",
    subtitle: "BFT Proof-of-Authority",
    description: "A purpose-built blockchain for verified identity and real business operations. 200K+ TPS, 400ms block time, stake-weighted validators.",
    stats: "200K+ TPS",
    gradient: "from-cyan-500 to-blue-600",
  },
  {
    icon: ShieldCheck,
    title: "Guardian Security Suite",
    subtitle: "AI-Powered Protection",
    description: "Autonomous AI agent verification across 13+ chains, DEX threat detection, enterprise security monitoring, and blockchain-certified audit trails.",
    stats: "13+ Chains",
    gradient: "from-green-500 to-emerald-600",
  },
  {
    icon: Coins,
    title: "DeFi Ecosystem",
    subtitle: "Signal (SIG) Token",
    description: "Full DeFi stack — AMM DEX, liquidity pools, cross-chain bridge (5 networks), NFT marketplace, liquid staking, and AI-powered trading bots.",
    stats: "1B Supply",
    gradient: "from-purple-500 to-pink-600",
  },
  {
    icon: Gamepad2,
    title: "Chronicles",
    subtitle: "3D Life Simulation",
    description: "A persistent parallel world across Medieval, Wild West, and Modern eras. Emotion-driven AI, political simulation, real economies, and AI-generated storylines.",
    stats: "3 Eras",
    gradient: "from-amber-500 to-orange-600",
  },
  {
    icon: Building2,
    title: "Enterprise Suite",
    subtitle: "Real Business Tools",
    description: "ORBIT Staffing OS, Lot Ops Pro, GarageBot, TORQUE, and more — full-stack business applications with blockchain-verified records and compliance.",
    stats: "32 Apps",
    gradient: "from-blue-500 to-indigo-600",
  },
  {
    icon: BookOpen,
    title: "Trust Book",
    subtitle: "Censorship-Free Publishing",
    description: "AI narration, blockchain-verified provenance, author royalties via Stripe Connect, and an AI writing assistant. Publishing without gatekeepers.",
    stats: "70% Royalty",
    gradient: "from-rose-500 to-pink-600",
  },
];

const PARTNER_TIERS = [
  {
    name: "Ambassador",
    icon: Star,
    color: "from-blue-500 to-cyan-500",
    border: "border-cyan-500/30",
    glow: "shadow-[0_0_30px_rgba(6,182,212,0.2)]",
    req: "5K+ followers",
    bonus: "5,000 SIG",
    commission: "10%",
    perks: ["Early access to announcements", "Ambassador Discord role", "Monthly analytics reports", "Branded promotional materials"],
  },
  {
    name: "Strategic Partner",
    icon: Award,
    color: "from-purple-500 to-pink-500",
    border: "border-purple-500/40",
    glow: "shadow-[0_0_50px_rgba(168,85,247,0.3)]",
    req: "25K+ followers",
    bonus: "25,000 SIG",
    commission: "15%",
    popular: true,
    perks: ["Co-marketing campaigns", "Direct team communication", "Custom tracking dashboard", "Quarterly strategy calls", "Exclusive interview access"],
  },
  {
    name: "Elite KOL",
    icon: Crown,
    color: "from-amber-500 to-orange-500",
    border: "border-amber-500/40",
    glow: "shadow-[0_0_60px_rgba(245,158,11,0.3)]",
    req: "100K+ followers",
    bonus: "100,000 SIG",
    commission: "20%",
    perks: ["Revenue sharing opportunities", "Founding partner status", "Dedicated account manager", "Priority feature requests", "Event speaking invitations", "Custom integration support"],
  },
];

const TOKEN_ALLOCATION = [
  { name: "Treasury Reserve", pct: 50, color: "bg-cyan-500" },
  { name: "Staking Rewards", pct: 15, color: "bg-purple-500" },
  { name: "Development & Team", pct: 15, color: "bg-blue-500" },
  { name: "Ecosystem Growth", pct: 10, color: "bg-emerald-500" },
  { name: "Community Rewards", pct: 10, color: "bg-amber-500" },
];

const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.08 } } };
const fadeUp = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6 } } };

function CountdownUnit({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <div className="relative">
        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl bg-slate-900/80 border border-white/10 flex items-center justify-center shadow-[0_0_30px_rgba(0,229,255,0.15)]">
          <span className="text-2xl sm:text-3xl font-bold font-display bg-gradient-to-b from-white to-white/60 bg-clip-text text-transparent">
            {String(value).padStart(2, "0")}
          </span>
        </div>
        <div className="absolute -inset-[1px] rounded-xl bg-gradient-to-b from-cyan-500/20 to-transparent -z-10 blur-sm" />
      </div>
      <span className="text-[10px] sm:text-xs text-white/40 uppercase tracking-widest mt-2 font-medium">{label}</span>
    </div>
  );
}

function ParticleField() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {Array.from({ length: 40 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 rounded-full bg-cyan-400/30"
          style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%` }}
          animate={{
            y: [0, -30, 0],
            opacity: [0.1, 0.6, 0.1],
            scale: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 3 + Math.random() * 4,
            repeat: Infinity,
            delay: Math.random() * 3,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

function GlowOrb({ color, position, size, delay }: { color: string; position: string; size: string; delay: number }) {
  return (
    <div
      className={`absolute ${position} ${size} ${color} rounded-full blur-3xl animate-pulse pointer-events-none`}
      style={{ animationDelay: `${delay}s`, animationDuration: "4s" }}
    />
  );
}

export default function InfluencerShowcasePage() {
  usePageAnalytics();
  const countdown = useCountdown();
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroOpacity = useTransform(scrollYProgress, [0, 1], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 0.95]);

  const totalApps = ECOSYSTEM_CATEGORIES.reduce((sum, cat) => sum + cat.apps.length, 0);

  return (
    <div className="min-h-screen bg-[#050508] text-white overflow-x-hidden selection:bg-cyan-500/20 selection:text-cyan-300">
      <GlowOrb color="bg-cyan-500/8" position="top-0 left-1/4" size="w-[500px] h-[500px]" delay={0} />
      <GlowOrb color="bg-purple-500/8" position="top-1/4 right-0" size="w-[600px] h-[600px]" delay={1} />
      <GlowOrb color="bg-pink-500/6" position="top-1/2 left-0" size="w-[400px] h-[400px]" delay={2} />
      <GlowOrb color="bg-amber-500/5" position="bottom-1/4 right-1/4" size="w-[500px] h-[500px]" delay={1.5} />
      <GlowOrb color="bg-cyan-500/5" position="bottom-0 left-1/3" size="w-[600px] h-[600px]" delay={0.5} />

      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-[#050508]/80 backdrop-blur-2xl">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2" data-testid="link-home">
            <Shield className="w-7 h-7 text-cyan-400" />
            <span className="font-display font-bold text-lg tracking-tight hidden sm:inline">Trust Layer</span>
          </Link>
          <div className="flex items-center gap-2 sm:gap-3">
            <Link href="/presale">
              <Button size="sm" className="h-8 text-xs bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold px-3 shadow-[0_0_20px_rgba(6,182,212,0.3)]" data-testid="button-nav-presale">
                <Coins className="w-3 h-3 mr-1.5" /> Buy SIG
              </Button>
            </Link>
            <Link href="/influencer-partnership">
              <Button size="sm" variant="outline" className="h-8 text-xs border-purple-500/30 text-purple-300 hover:bg-purple-500/10 font-semibold px-3" data-testid="button-nav-apply">
                <Megaphone className="w-3 h-3 mr-1.5" /> Apply Now
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      <motion.section ref={heroRef} style={{ opacity: heroOpacity, scale: heroScale }} className="relative pt-24 sm:pt-32 pb-16 sm:pb-24 px-4">
        <ParticleField />
        <div className="container mx-auto max-w-6xl relative z-10">
          <motion.div initial="hidden" animate="visible" variants={stagger} className="text-center">
            <motion.div variants={fadeUp}>
              <Badge className="mb-6 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 text-cyan-300 border-cyan-500/30 px-5 py-2 text-sm" data-testid="badge-ecosystem">
                <Sparkles className="w-3.5 h-3.5 mr-2" /> {totalApps} Live Applications
              </Badge>
            </motion.div>

            <motion.h1 variants={fadeUp} className="text-4xl sm:text-5xl md:text-7xl font-display font-black mb-6 leading-[1.1] tracking-tight">
              <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                One Ecosystem.
              </span>
              <br />
              <span className="text-white">
                Infinite Possibilities.
              </span>
            </motion.h1>

            <motion.p variants={fadeUp} className="text-lg sm:text-xl text-white/60 max-w-3xl mx-auto mb-10 leading-relaxed">
              Trust Layer is a Layer 1 blockchain powering {totalApps} verified applications — from DeFi and AI trading to 3D gaming, enterprise workforce management, and censorship-free publishing. All launching August 23, 2026.
            </motion.p>

            <motion.div variants={fadeUp} className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
              <Link href="/influencer-partnership">
                <Button size="lg" className="h-12 px-8 text-base bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold shadow-[0_0_40px_rgba(168,85,247,0.3)] border-0" data-testid="button-hero-apply">
                  <Megaphone className="w-5 h-5 mr-2" /> Partner With Us
                </Button>
              </Link>
              <Link href="/presale">
                <Button size="lg" variant="outline" className="h-12 px-8 text-base border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/10 font-bold" data-testid="button-hero-presale">
                  <Rocket className="w-5 h-5 mr-2" /> Join the Presale
                </Button>
              </Link>
            </motion.div>

            <motion.div variants={fadeUp}>
              <p className="text-xs text-white/30 uppercase tracking-[0.3em] mb-4 font-medium">Launching In</p>
              <div className="flex items-center justify-center gap-3 sm:gap-5">
                <CountdownUnit value={countdown.days} label="Days" />
                <span className="text-2xl text-white/20 font-light mt-[-24px]">:</span>
                <CountdownUnit value={countdown.hours} label="Hours" />
                <span className="text-2xl text-white/20 font-light mt-[-24px]">:</span>
                <CountdownUnit value={countdown.minutes} label="Min" />
                <span className="text-2xl text-white/20 font-light mt-[-24px]">:</span>
                <CountdownUnit value={countdown.seconds} label="Sec" />
              </div>
              <p className="mt-4 text-sm text-white/40">
                <span className="font-display font-bold text-white/60">August 23, 2026</span> — One Year. One Vision. Launch Day.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      <section className="relative py-16 sm:py-24 px-4">
        <div className="container mx-auto max-w-6xl">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={stagger}>
            <motion.div variants={fadeUp} className="text-center mb-12">
              <Badge className="mb-4 bg-white/5 text-white/60 border-white/10">
                <Layers className="w-3 h-3 mr-1.5" /> The Six Pillars
              </Badge>
              <h2 className="text-3xl sm:text-4xl font-display font-bold mb-3">
                <span className="bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">
                  What We're Building
                </span>
              </h2>
              <p className="text-white/40 max-w-xl mx-auto">Not just a token. A fully operational ecosystem with real products, real users, and real revenue streams.</p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {PILLARS.map((pillar, i) => (
                <motion.div key={i} variants={fadeUp}>
                  <GlassCard glow className="h-full">
                    <div className="p-5 sm:p-7">
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${pillar.gradient} flex items-center justify-center mb-5 shadow-lg`}>
                        <pillar.icon className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex items-center gap-2 mb-1.5">
                        <h3 className="text-lg font-bold text-white">{pillar.title}</h3>
                        <Badge className="bg-white/5 text-white/50 border-white/10 text-[10px] px-2 py-0">{pillar.stats}</Badge>
                      </div>
                      <p className="text-xs text-cyan-400/70 mb-3 font-medium">{pillar.subtitle}</p>
                      <p className="text-sm text-white/50 leading-relaxed">{pillar.description}</p>
                    </div>
                  </GlassCard>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <section className="relative py-16 sm:py-24 px-4">
        <div className="container mx-auto max-w-6xl">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={stagger}>
            <motion.div variants={fadeUp} className="text-center mb-8">
              <Badge className="mb-4 bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-300 border-purple-500/30">
                <Globe className="w-3 h-3 mr-1.5" /> {totalApps} Verified Apps
              </Badge>
              <h2 className="text-3xl sm:text-4xl font-display font-bold mb-3">
                <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                  Full Ecosystem Directory
                </span>
              </h2>
              <p className="text-white/40 max-w-xl mx-auto">Every application in the Trust Layer ecosystem, organized by category. Each one is live, verified, and connected.</p>
            </motion.div>

            <motion.div variants={fadeUp}>
              <GlassCard glow className="">
                <Accordion type="multiple" className="space-y-0 px-4 py-3 sm:px-6 sm:py-4">
                  {ECOSYSTEM_CATEGORIES.map((cat, ci) => (
                    <AccordionItem key={ci} value={`cat-${ci}`} className="border-white/5" data-testid={`accordion-category-${ci}`}>
                      <AccordionTrigger className="hover:no-underline py-4 px-2 group">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 flex items-center justify-center group-hover:border-cyan-500/30 transition-colors">
                            <cat.icon className="w-4.5 h-4.5 text-cyan-400" />
                          </div>
                          <div className="text-left">
                            <span className="font-bold text-white text-sm sm:text-base">{cat.name}</span>
                            <span className="ml-2 text-white/30 text-xs">({cat.apps.length})</span>
                          </div>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="px-2 pb-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                          {cat.apps.map((app, ai) => {
                            const isExternal = app.url.startsWith("http");
                            const Wrapper = isExternal ? "a" : Link;
                            const wrapperProps = isExternal
                              ? { href: app.url, target: "_blank", rel: "noopener noreferrer" }
                              : { href: app.url };
                            return (
                              <Wrapper key={ai} {...(wrapperProps as any)}>
                                <div
                                  className="group/app flex items-center gap-3 p-3 rounded-lg bg-white/[0.02] border border-white/5 hover:border-cyan-500/30 hover:bg-cyan-500/5 transition-all cursor-pointer"
                                  data-testid={`app-link-${app.name.toLowerCase().replace(/\s+/g, '-')}`}
                                >
                                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500/10 to-purple-500/10 border border-white/5 flex items-center justify-center shrink-0">
                                    <span className="text-xs font-bold text-cyan-400">{app.name.charAt(0)}</span>
                                  </div>
                                  <div className="min-w-0 flex-1">
                                    <div className="flex items-center gap-1.5">
                                      <span className="text-sm font-semibold text-white truncate">{app.name}</span>
                                      <CheckCircle className="w-3 h-3 text-cyan-400 shrink-0" />
                                    </div>
                                    <p className="text-[11px] text-white/40 truncate">{app.desc}</p>
                                  </div>
                                  {isExternal ? (
                                    <ExternalLink className="w-3.5 h-3.5 text-white/20 group-hover/app:text-cyan-400 transition-colors shrink-0" />
                                  ) : (
                                    <ChevronRight className="w-3.5 h-3.5 text-white/20 group-hover/app:text-cyan-400 transition-colors shrink-0" />
                                  )}
                                </div>
                              </Wrapper>
                            );
                          })}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </GlassCard>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <section className="relative py-16 sm:py-24 px-4">
        <div className="container mx-auto max-w-6xl">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={stagger}>
            <motion.div variants={fadeUp} className="text-center mb-12">
              <Badge className="mb-4 bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-300 border-amber-500/30">
                <Wallet className="w-3 h-3 mr-1.5" /> SIG Token
              </Badge>
              <h2 className="text-3xl sm:text-4xl font-display font-bold mb-3">
                <span className="bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">
                  Signal (SIG) Tokenomics
                </span>
              </h2>
              <p className="text-white/40 max-w-xl mx-auto">1 billion total supply. Native asset for the Trust Layer ecosystem.</p>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              <motion.div variants={fadeUp}>
                <GlassCard glow className="h-full">
                  <div className="p-5 sm:p-7">
                  <h3 className="text-lg font-bold mb-6 text-white">Token Allocation</h3>
                  <div className="space-y-4">
                    {TOKEN_ALLOCATION.map((item, i) => (
                      <div key={i}>
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-sm text-white/70">{item.name}</span>
                          <span className="text-sm font-bold text-white">{item.pct}%</span>
                        </div>
                        <div className="h-2.5 bg-white/5 rounded-full overflow-hidden">
                          <motion.div
                            className={`h-full ${item.color} rounded-full`}
                            initial={{ width: 0 }}
                            whileInView={{ width: `${item.pct}%` }}
                            viewport={{ once: true }}
                            transition={{ duration: 1, delay: i * 0.15, ease: "easeOut" }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-6 pt-6 border-t border-white/5">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-white/30 uppercase tracking-wider mb-1">Total Supply</p>
                        <p className="text-xl font-bold font-display bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">1,000,000,000</p>
                      </div>
                      <div>
                        <p className="text-xs text-white/30 uppercase tracking-wider mb-1">Pre-Launch Currency</p>
                        <p className="text-xl font-bold font-display bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">Shells</p>
                      </div>
                    </div>
                  </div>
                  </div>
                </GlassCard>
              </motion.div>

              <motion.div variants={fadeUp}>
                <GlassCard glow className="h-full">
                  <div className="p-5 sm:p-7">
                  <h3 className="text-lg font-bold mb-6 text-white">Key Metrics</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { label: "Block Time", value: "400ms", icon: Zap },
                      { label: "Throughput", value: "200K+ TPS", icon: TrendingUp },
                      { label: "Consensus", value: "BFT-PoA", icon: Shield },
                      { label: "Ecosystem Apps", value: `${totalApps}`, icon: Globe },
                      { label: "Bridge Networks", value: "5 Chains", icon: Layers },
                      { label: "Security", value: "AES-256", icon: Lock },
                    ].map((m, i) => (
                      <div key={i} className="p-3.5 rounded-lg bg-white/[0.02] border border-white/5">
                        <m.icon className="w-4 h-4 text-cyan-400/60 mb-2" />
                        <p className="text-lg font-bold text-white font-display">{m.value}</p>
                        <p className="text-[10px] text-white/40 uppercase tracking-wider">{m.label}</p>
                      </div>
                    ))}
                  </div>
                  <div className="mt-6 pt-6 border-t border-white/5">
                    <Link href="/presale">
                      <Button className="w-full h-11 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold shadow-[0_0_30px_rgba(6,182,212,0.25)]" data-testid="button-tokenomics-presale">
                        <Rocket className="w-4 h-4 mr-2" /> Join the SIG Presale
                      </Button>
                    </Link>
                  </div>
                  </div>
                </GlassCard>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="relative py-16 sm:py-24 px-4">
        <div className="container mx-auto max-w-6xl">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={stagger}>
            <motion.div variants={fadeUp} className="text-center mb-12">
              <Badge className="mb-4 bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-300 border-purple-500/30">
                <Crown className="w-3 h-3 mr-1.5" /> KOL & Influencer Program
              </Badge>
              <h2 className="text-3xl sm:text-4xl font-display font-bold mb-3">
                <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-amber-400 bg-clip-text text-transparent">
                  Partner With Us
                </span>
              </h2>
              <p className="text-white/40 max-w-xl mx-auto">Earn commissions, receive SIG bonuses, and get exclusive access to the fastest-growing blockchain ecosystem.</p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
              {PARTNER_TIERS.map((tier, i) => (
                <motion.div key={i} variants={fadeUp} className={`relative ${tier.popular ? 'md:-mt-3 md:mb-3' : ''}`}>
                  {tier.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
                      <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0 px-4 shadow-[0_0_20px_rgba(168,85,247,0.4)]">
                        <Sparkles className="w-3 h-3 mr-1" /> Most Popular
                      </Badge>
                    </div>
                  )}
                  <GlassCard glow={tier.popular} className={`h-full ${tier.border} ${tier.glow} ${tier.popular ? 'border-2' : ''}`}>
                    <div className="p-5 sm:p-7">
                      <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${tier.color} flex items-center justify-center mb-5 shadow-lg`}>
                        <tier.icon className="w-7 h-7 text-white" />
                      </div>
                      <h3 className="text-xl font-bold text-white mb-1">{tier.name}</h3>
                      <p className="text-sm text-white/40 mb-3">{tier.req}</p>

                      <div className="flex flex-wrap items-center gap-3 mb-5">
                        <div className={`px-3 py-1.5 rounded-lg bg-gradient-to-r ${tier.color} bg-opacity-20`}>
                          <span className="text-sm font-bold text-white">{tier.bonus}</span>
                        </div>
                        <div className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10">
                          <span className="text-sm font-bold text-white">{tier.commission} Commission</span>
                        </div>
                      </div>

                      <ul className="space-y-2.5">
                        {tier.perks.map((perk, j) => (
                          <li key={j} className="flex items-start gap-2 text-sm">
                            <CheckCircle className="w-4 h-4 text-green-400 shrink-0 mt-0.5" />
                            <span className="text-white/60">{perk}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </GlassCard>
                </motion.div>
              ))}
            </div>

            <motion.div variants={fadeUp} className="text-center">
              <Link href="/influencer-partnership">
                <Button size="lg" className="h-13 px-10 text-base bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold shadow-[0_0_50px_rgba(168,85,247,0.3)] border-0" data-testid="button-apply-now">
                  <Megaphone className="w-5 h-5 mr-2" /> Apply for Partnership
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <section className="relative py-16 sm:py-24 px-4">
        <div className="container mx-auto max-w-4xl">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={stagger}>
            <motion.div variants={fadeUp} className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-display font-bold mb-3">
                <span className="bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">
                  Frequently Asked Questions
                </span>
              </h2>
            </motion.div>

            <motion.div variants={fadeUp}>
              <GlassCard className="">
                <Accordion type="single" collapsible className="space-y-0 px-4 py-3 sm:px-6 sm:py-4">
                  {[
                    {
                      q: "What is Trust Layer?",
                      a: "Trust Layer is a Layer 1 Proof-of-Authority blockchain designed for verified identity, accountability, and transparent audit trails in real business operations. It powers a full ecosystem of 32+ applications spanning DeFi, AI trading, enterprise tools, gaming, publishing, and more.",
                    },
                    {
                      q: "What is Signal (SIG)?",
                      a: "Signal (SIG) is the native token of the Trust Layer blockchain with a total supply of 1 billion. It is used for transactions, staking, governance, and as the utility token across all ecosystem applications. Pre-launch, users earn Shells which convert to SIG at launch.",
                    },
                    {
                      q: "When does the ecosystem launch?",
                      a: "The full ecosystem launch is August 23, 2026. Many applications are already live in beta and can be explored today. The presale is currently open for early supporters to accumulate SIG before the public launch.",
                    },
                    {
                      q: "How does the influencer program work?",
                      a: "Partners receive SIG bonuses (5K–100K depending on tier), earn 10–20% commissions on referrals, and get access to exclusive content, co-marketing opportunities, and direct team communication. Apply through our partnership form and our team will review within 48–72 hours.",
                    },
                    {
                      q: "Is this built on another chain like Ethereum?",
                      a: "No. Trust Layer is a standalone Layer 1 blockchain — not a token on another chain. It has its own BFT-PoA consensus, stake-weighted validators, 400ms block time, and 200K+ TPS throughput. We do offer a cross-chain bridge connecting to Ethereum, Solana, Polygon, Arbitrum, and Base.",
                    },
                    {
                      q: "What makes this different from other crypto projects?",
                      a: "Most crypto projects are just a token and a whitepaper. Trust Layer has 32 live, functional applications generating real utility — from enterprise HR platforms and automotive management tools to AI trading bots and a full 3D life simulation game. These are production tools, not promises.",
                    },
                    {
                      q: "Who is behind Trust Layer?",
                      a: "Trust Layer is developed by DarkWave Studios, the parent company. The team builds across blockchain, AI, gaming, and enterprise SaaS — all under one integrated ecosystem. Contact us at team@dwsc.io.",
                    },
                  ].map((faq, i) => (
                    <AccordionItem key={i} value={`faq-${i}`} className="border-white/5" data-testid={`faq-${i}`}>
                      <AccordionTrigger className="hover:no-underline text-left py-4 px-2 text-sm sm:text-base font-semibold text-white">
                        {faq.q}
                      </AccordionTrigger>
                      <AccordionContent className="px-2 text-sm text-white/50 leading-relaxed">
                        {faq.a}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </GlassCard>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <section className="relative py-16 sm:py-24 px-4">
        <div className="container mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <GlassCard glow className="text-center relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-purple-500/5 to-pink-500/5 pointer-events-none" />
              <div className="relative z-10 p-8 sm:p-12">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center mx-auto mb-6 shadow-[0_0_40px_rgba(6,182,212,0.3)]">
                  <Rocket className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-3xl sm:text-4xl font-display font-black mb-4">
                  <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                    Ready to Partner?
                  </span>
                </h2>
                <p className="text-white/50 max-w-xl mx-auto mb-8 text-lg">
                  Join the Trust Layer ecosystem before launch. Earn commissions, receive SIG bonuses, and be part of something unprecedented.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <Link href="/influencer-partnership">
                    <Button size="lg" className="h-13 px-10 text-base bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold shadow-[0_0_40px_rgba(168,85,247,0.3)] border-0" data-testid="button-cta-apply">
                      <Megaphone className="w-5 h-5 mr-2" /> Apply Now
                    </Button>
                  </Link>
                  <Link href="/presale">
                    <Button size="lg" variant="outline" className="h-13 px-10 text-base border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/10 font-bold" data-testid="button-cta-presale">
                      <Coins className="w-5 h-5 mr-2" /> View Presale
                    </Button>
                  </Link>
                  <Link href="/launch">
                    <Button size="lg" variant="outline" className="h-13 px-10 text-base border-white/10 text-white/60 hover:bg-white/5 font-bold" data-testid="button-cta-launch">
                      <Timer className="w-5 h-5 mr-2" /> Launch Roadmap
                    </Button>
                  </Link>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        </div>
      </section>

      <footer className="border-t border-white/5 py-8 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-cyan-400" />
              <span className="font-display font-bold text-sm text-white/60">Trust Layer</span>
              <span className="text-white/20 text-xs">by DarkWave Studios</span>
            </div>
            <div className="flex items-center gap-4 text-xs text-white/30">
              <a href="mailto:team@dwsc.io" className="hover:text-cyan-400 transition-colors flex items-center gap-1">
                <Mail className="w-3 h-3" /> team@dwsc.io
              </a>
              <Link href="/terms" className="hover:text-white/60 transition-colors">Terms</Link>
              <Link href="/privacy" className="hover:text-white/60 transition-colors">Privacy</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
