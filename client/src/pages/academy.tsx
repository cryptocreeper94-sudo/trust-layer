import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "wouter";
import {
  BookOpen,
  Shield,
  Coins,
  ArrowLeftRight,
  Lock,
  Layers,
  CheckCircle2,
  Star,
  Award,
  Users,
  Clock,
  Play,
  ChevronRight,
  Sparkles,
  GraduationCap,
  FileText,
  Zap,
  Globe,
  TrendingUp,
  Target,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { GlassCard } from "@/components/glass-card";
import { SiteNav } from "@/components/site-nav";
import { Footer } from "@/components/footer";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const STRIPE_PRICES = {
  scholar: "price_1T2GJZRq977vVehdIBcsUn7x",
  master: "price_1T2GJdRq977vVehdYtJ5plVZ",
};

const courseCategories = [
  {
    id: "fundamentals",
    title: "Crypto Fundamentals",
    description: "Master the basics of blockchain technology, wallets, and cryptocurrency from the ground up.",
    icon: BookOpen,
    color: "cyan",
    courses: 8,
    hours: 12,
    level: "Beginner",
    topics: ["What is Blockchain?", "Wallets & Keys", "Consensus Mechanisms", "Transaction Lifecycle", "Cryptography Basics"],
  },
  {
    id: "multichain",
    title: "Multi-Chain Ecosystems",
    description: "Explore Ethereum, Solana, Polygon, Arbitrum, Base, and the Trust Layer — understand how they interconnect.",
    icon: Globe,
    color: "purple",
    courses: 6,
    hours: 10,
    level: "Intermediate",
    topics: ["Ethereum & EVM", "Solana Architecture", "L2 Rollups", "Cross-Chain Interoperability", "Trust Layer Deep Dive"],
  },
  {
    id: "defi",
    title: "DeFi Strategies",
    description: "Learn decentralized finance from AMMs and liquidity pools to yield farming and liquid staking.",
    icon: Coins,
    color: "amber",
    courses: 10,
    hours: 16,
    level: "Intermediate",
    topics: ["AMM Mechanics", "Liquidity Provision", "Yield Farming", "Liquid Staking (stSIG)", "Risk Management"],
  },
  {
    id: "security",
    title: "Security Best Practices",
    description: "Protect yourself and your projects. Smart contract auditing, phishing defense, and operational security.",
    icon: Shield,
    color: "red",
    courses: 7,
    hours: 11,
    level: "All Levels",
    topics: ["Smart Contract Vulnerabilities", "Phishing & Social Engineering", "Wallet Security", "Guardian Scanner Usage", "Audit Methodology"],
  },
  {
    id: "bridging",
    title: "Cross-Chain Bridging",
    description: "Understand lock & mint, wrapped tokens, and safely bridging assets across blockchains.",
    icon: ArrowLeftRight,
    color: "green",
    courses: 4,
    hours: 6,
    level: "Advanced",
    topics: ["Bridge Architecture", "Lock & Mint Explained", "wSIG Bridging", "Bridge Security Risks", "Multi-Chain Portfolio"],
  },
  {
    id: "trust-layer",
    title: "Trust Layer Operations",
    description: "Become an expert on the Trust Layer: validator operations, staking, governance, and ecosystem building.",
    icon: Layers,
    color: "blue",
    courses: 9,
    hours: 14,
    level: "Advanced",
    topics: ["PoA Consensus", "Validator Setup", "Signal Tokenomics", "Governance Participation", "Building on Trust Layer"],
  },
];

const certifications = [
  {
    id: "ctf",
    title: "Certified Trust Fundamentals",
    abbrev: "CTF",
    description: "Demonstrates foundational understanding of blockchain and the Trust Layer ecosystem.",
    prereqs: ["Crypto Fundamentals", "Trust Layer Operations (Intro)"],
    badge: "from-cyan-500 to-blue-500",
  },
  {
    id: "cds",
    title: "Certified DeFi Specialist",
    abbrev: "CDS",
    description: "Validates advanced DeFi knowledge including liquidity strategies and risk management.",
    prereqs: ["DeFi Strategies (All Modules)", "Security Best Practices"],
    badge: "from-amber-500 to-orange-500",
  },
  {
    id: "ctlo",
    title: "Certified Trust Layer Operator",
    abbrev: "CTLO",
    description: "Expert-level certification for running validators, governance, and ecosystem development.",
    prereqs: ["Trust Layer Operations (All)", "Cross-Chain Bridging", "Security"],
    badge: "from-purple-500 to-pink-500",
  },
];

const pricingTiers = [
  {
    id: "explorer",
    name: "Explorer",
    price: "Free",
    period: "",
    description: "Start your learning journey with crypto fundamentals and community access.",
    features: [
      "Crypto Fundamentals course track",
      "Community forums access",
      "Weekly live Q&A sessions",
      "Progress tracking dashboard",
      "Mobile-friendly learning",
    ],
    cta: "Start Free",
    popular: false,
    gradient: "from-slate-600 to-slate-700",
  },
  {
    id: "scholar",
    name: "Scholar",
    price: "$19.99",
    period: "/mo",
    description: "Full access to all courses, certification exams, and priority support.",
    features: [
      "All 6 course tracks (44+ courses)",
      "Certification exam access",
      "DeFi & Security deep dives",
      "Downloadable resources",
      "Priority support",
      "Monthly workshops",
      "Course completion badges",
    ],
    cta: "Start Learning",
    popular: true,
    gradient: "from-cyan-500 to-blue-600",
    priceId: STRIPE_PRICES.scholar,
  },
  {
    id: "master",
    name: "Master",
    price: "$49.99",
    period: "/mo",
    description: "Premium tier with mentorship, advanced workshops, and exclusive credentials.",
    features: [
      "Everything in Scholar",
      "1-on-1 mentorship sessions",
      "Advanced builder workshops",
      "Early access to new courses",
      "Exclusive Master credentials",
      "Private Discord channel",
      "Career guidance & referrals",
      "Guest speaker sessions",
    ],
    cta: "Go Master",
    popular: false,
    gradient: "from-purple-500 to-pink-600",
    priceId: STRIPE_PRICES.master,
  },
];

const faqItems = [
  {
    q: "Do I need any prior crypto knowledge?",
    a: "Not at all. Our Crypto Fundamentals track starts from zero and builds your understanding step by step. The Explorer tier is completely free, so you can start learning today.",
  },
  {
    q: "How do certifications work?",
    a: "After completing the required course modules, you can take the certification exam. Pass with 80% or higher to earn your on-chain verified credential. Certifications are available on Scholar and Master plans.",
  },
  {
    q: "Can I switch plans anytime?",
    a: "Yes. Upgrade or downgrade at any time. If you upgrade, you'll be charged the prorated difference. If you downgrade, the change takes effect at the end of your billing cycle.",
  },
  {
    q: "Are courses self-paced?",
    a: "Yes, all courses are fully self-paced. Learn on your schedule. Scholar and Master members also get access to monthly live workshops for real-time interaction.",
  },
  {
    q: "What makes Academy credentials different?",
    a: "Your certifications are recorded on the Trust Layer blockchain, making them permanently verifiable by anyone. No faking credentials — they're cryptographically proven.",
  },
];

const colorMap: Record<string, string> = {
  cyan: "text-cyan-400 bg-cyan-500/20 border-cyan-500/20",
  purple: "text-purple-400 bg-purple-500/20 border-purple-500/20",
  amber: "text-amber-400 bg-amber-500/20 border-amber-500/20",
  red: "text-red-400 bg-red-500/20 border-red-500/20",
  green: "text-green-400 bg-green-500/20 border-green-500/20",
  blue: "text-blue-400 bg-blue-500/20 border-blue-500/20",
};

export default function AcademyPage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  useEffect(() => {
    const existingManifest = document.querySelector('link[rel="manifest"]');
    const previousManifestHref = existingManifest?.getAttribute('href') || '/manifest.webmanifest';
    const academyManifest = document.createElement('link');
    academyManifest.rel = 'manifest';
    academyManifest.href = '/manifest-academy.webmanifest';
    if (existingManifest) existingManifest.remove();
    document.head.appendChild(academyManifest);

    const themeColor = document.querySelector('meta[name="theme-color"]');
    const previousThemeColor = themeColor?.getAttribute('content') || '#06b6d4';
    if (themeColor) themeColor.setAttribute('content', '#3b82f6');

    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/academy-sw.js', { scope: '/academy' }).catch(() => {});
    }

    return () => {
      const manifest = document.querySelector('link[href="/manifest-academy.webmanifest"]');
      if (manifest) manifest.remove();
      const restoredManifest = document.createElement('link');
      restoredManifest.rel = 'manifest';
      restoredManifest.href = previousManifestHref;
      document.head.appendChild(restoredManifest);
      if (themeColor) themeColor.setAttribute('content', previousThemeColor);
    };
  }, []);

  const handleSubscribe = async (priceId?: string) => {
    if (!priceId) return;
    try {
      const res = await fetch("/api/academy/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ priceId }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (err) {
      console.error("Subscription error:", err);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteNav />

      <section className="pt-20 pb-16 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-500/5 via-transparent to-transparent" />
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute top-40 right-1/4 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl" />

        <div className="container mx-auto max-w-6xl relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto"
          >
            <Badge className="mb-4 bg-blue-500/20 text-blue-400 border-blue-500/30 text-xs">
              <GraduationCap className="w-3 h-3 mr-1" />
              Trust Academy
            </Badge>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-6">
              <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent">
                Learn. Certify. Master.
              </span>
            </h1>
            <p className="text-white/60 text-sm sm:text-base md:text-lg leading-relaxed mb-8 max-w-2xl mx-auto">
              The premier education platform for cryptocurrency, DeFi, multi-chain ecosystems, 
              and Trust Layer operations. Earn blockchain-verified credentials that prove your expertise.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <a href="#courses">
                <Button size="lg" className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white rounded-full gap-2 h-12 px-8" data-testid="button-explore-courses">
                  <Play className="w-4 h-4" />
                  Explore Courses
                </Button>
              </a>
              <a href="#pricing">
                <Button size="lg" variant="outline" className="border-white/20 hover:bg-white/5 rounded-full gap-2 h-12 px-8" data-testid="button-view-pricing">
                  View Pricing
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </a>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-12 max-w-3xl mx-auto"
          >
            {[
              { label: "Courses", value: "44+", icon: BookOpen },
              { label: "Hours", value: "69+", icon: Clock },
              { label: "Certifications", value: "3", icon: Award },
              { label: "Tracks", value: "6", icon: Target },
            ].map((stat) => (
              <GlassCard key={stat.label} className="p-4 text-center">
                <stat.icon className="w-5 h-5 text-cyan-400 mx-auto mb-2" />
                <div className="text-xl sm:text-2xl font-bold text-white" data-testid={`stat-${stat.label.toLowerCase()}`}>{stat.value}</div>
                <div className="text-[10px] sm:text-xs text-white/50">{stat.label}</div>
              </GlassCard>
            ))}
          </motion.div>
        </div>
      </section>

      <section id="courses" className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <Badge className="mb-3 bg-cyan-500/20 text-cyan-400 border-cyan-500/30">
              Course Catalog
            </Badge>
            <h2 className="text-2xl sm:text-3xl font-display font-bold mb-3">
              Six Expert-Crafted Learning Tracks
            </h2>
            <p className="text-white/60 text-sm max-w-xl mx-auto">
              From beginner to expert, each track is designed to build practical, real-world skills.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {courseCategories.map((cat, i) => {
              const colors = colorMap[cat.color] || colorMap.cyan;
              const [textColor, bgColor] = colors.split(" ");
              return (
                <motion.div
                  key={cat.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ scale: 1.02, y: -2 }}
                >
                  <div
                    onClick={() => setSelectedCategory(selectedCategory === cat.id ? null : cat.id)}
                    data-testid={`card-course-${cat.id}`}
                  >
                  <GlassCard
                    glow
                    className={`p-5 sm:p-6 h-full cursor-pointer transition-all hover:border-cyan-500/30 ${
                      selectedCategory === cat.id ? "border-cyan-500/40 shadow-[0_0_30px_rgba(6,182,212,0.15)]" : ""
                    }`}
                  >
                    <div className="flex items-start gap-3 mb-4">
                      <div className={`p-2.5 rounded-lg border ${colors} flex-shrink-0`}>
                        <cat.icon className={`w-5 h-5 ${textColor}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-white text-sm sm:text-base">{cat.title}</h3>
                        <Badge variant="outline" className="text-[10px] border-white/10 text-white/50 mt-1">
                          {cat.level}
                        </Badge>
                      </div>
                    </div>
                    <p className="text-white/60 text-xs sm:text-sm leading-relaxed mb-4">
                      {cat.description}
                    </p>
                    <div className="flex items-center gap-4 text-[10px] sm:text-xs text-white/40 mb-4">
                      <span className="flex items-center gap-1">
                        <BookOpen className="w-3 h-3" /> {cat.courses} courses
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {cat.hours}h content
                      </span>
                    </div>

                    {selectedCategory === cat.id && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        className="border-t border-white/10 pt-4"
                      >
                        <p className="text-[10px] text-white/40 uppercase tracking-wider mb-2 font-semibold">Key Topics</p>
                        <ul className="space-y-1.5">
                          {cat.topics.map((topic) => (
                            <li key={topic} className="flex items-center gap-2 text-xs text-white/70">
                              <CheckCircle2 className="w-3 h-3 text-cyan-400 flex-shrink-0" />
                              {topic}
                            </li>
                          ))}
                        </ul>
                      </motion.div>
                    )}
                  </GlassCard>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-16 px-4 bg-slate-900/50">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <Badge className="mb-3 bg-purple-500/20 text-purple-400 border-purple-500/30">
              <Award className="w-3 h-3 mr-1" />
              Certifications
            </Badge>
            <h2 className="text-2xl sm:text-3xl font-display font-bold mb-3">
              Blockchain-Verified Credentials
            </h2>
            <p className="text-white/60 text-sm max-w-xl mx-auto">
              Earn certifications recorded on the Trust Layer. Permanently verifiable, impossible to fake.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            {certifications.map((cert, i) => (
              <motion.div
                key={cert.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                whileHover={{ scale: 1.02, y: -2 }}
              >
                <GlassCard glow className="p-5 sm:p-6 h-full" data-testid={`card-cert-${cert.id}`}>
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${cert.badge} flex items-center justify-center mb-4 shadow-lg`}>
                    <span className="text-lg font-bold text-white">{cert.abbrev}</span>
                  </div>
                  <h3 className="font-bold text-white text-sm sm:text-base mb-2">{cert.title}</h3>
                  <p className="text-white/60 text-xs sm:text-sm leading-relaxed mb-4">{cert.description}</p>
                  <div className="border-t border-white/10 pt-3">
                    <p className="text-[10px] text-white/40 uppercase tracking-wider mb-2 font-semibold">Prerequisites</p>
                    <ul className="space-y-1">
                      {cert.prereqs.map((p) => (
                        <li key={p} className="flex items-center gap-2 text-xs text-white/60">
                          <FileText className="w-3 h-3 text-white/30 flex-shrink-0" />
                          {p}
                        </li>
                      ))}
                    </ul>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section id="pricing" className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <Badge className="mb-3 bg-green-500/20 text-green-400 border-green-500/30">
              Pricing
            </Badge>
            <h2 className="text-2xl sm:text-3xl font-display font-bold mb-3">
              Choose Your Learning Path
            </h2>
            <p className="text-white/60 text-sm max-w-xl mx-auto">
              Start free and upgrade when you're ready. All plans include mobile access and progress tracking.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 max-w-4xl mx-auto">
            {pricingTiers.map((tier, i) => (
              <motion.div
                key={tier.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className={tier.popular ? "md:-mt-4 md:mb-0" : ""}
              >
                <GlassCard
                  glow={tier.popular}
                  className={`p-5 sm:p-6 h-full flex flex-col relative ${
                    tier.popular ? "border-cyan-500/30 shadow-[0_0_40px_rgba(6,182,212,0.15)]" : ""
                  }`}
                  data-testid={`card-pricing-${tier.id}`}
                >
                  {tier.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <Badge className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white border-0 text-[10px] px-3">
                        <Star className="w-3 h-3 mr-1" />
                        Most Popular
                      </Badge>
                    </div>
                  )}
                  <div className="mb-4">
                    <h3 className="font-bold text-white text-lg">{tier.name}</h3>
                    <p className="text-white/50 text-xs mt-1">{tier.description}</p>
                  </div>
                  <div className="flex items-baseline gap-1 mb-6">
                    <span className="text-3xl sm:text-4xl font-bold text-white">{tier.price}</span>
                    {tier.period && <span className="text-white/40 text-sm">{tier.period}</span>}
                  </div>
                  <ul className="space-y-2.5 mb-6 flex-grow">
                    {tier.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2 text-xs sm:text-sm text-white/70">
                        <CheckCircle2 className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Button
                    size="lg"
                    className={`w-full h-11 font-semibold rounded-lg ${
                      tier.popular
                        ? "bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white"
                        : tier.id === "master"
                        ? "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white"
                        : "bg-white/10 hover:bg-white/15 text-white border border-white/10"
                    }`}
                    onClick={() => tier.priceId && handleSubscribe(tier.priceId)}
                    data-testid={`button-subscribe-${tier.id}`}
                  >
                    {tier.cta}
                  </Button>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 px-4 bg-slate-900/50">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            <div>
              <Badge className="mb-3 bg-amber-500/20 text-amber-400 border-amber-500/30">
                Why Academy
              </Badge>
              <h2 className="text-2xl sm:text-3xl font-display font-bold mb-6">
                Built Different
              </h2>
              <div className="space-y-4">
                {[
                  {
                    icon: Lock,
                    title: "On-Chain Credentials",
                    desc: "Your certifications live on the Trust Layer blockchain. Verifiable by anyone, forever.",
                  },
                  {
                    icon: Zap,
                    title: "Practical, Not Theoretical",
                    desc: "Every course includes hands-on exercises using real Trust Layer tools and tokens.",
                  },
                  {
                    icon: Users,
                    title: "Community-Driven",
                    desc: "Learn alongside other builders. Weekly Q&A sessions, forums, and peer reviews.",
                  },
                  {
                    icon: TrendingUp,
                    title: "Always Current",
                    desc: "Courses updated monthly to reflect the latest in DeFi, security, and multi-chain tech.",
                  },
                ].map((item) => (
                  <GlassCard key={item.title} className="p-4 flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-amber-500/20 border border-amber-500/20 flex-shrink-0">
                      <item.icon className="w-4 h-4 text-amber-400" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-white text-sm">{item.title}</h4>
                      <p className="text-white/60 text-xs leading-relaxed mt-1">{item.desc}</p>
                    </div>
                  </GlassCard>
                ))}
              </div>
            </div>

            <div>
              <Badge className="mb-3 bg-slate-500/20 text-white/60 border-white/10">
                FAQ
              </Badge>
              <h2 className="text-2xl sm:text-3xl font-display font-bold mb-6">
                Common Questions
              </h2>
              <Accordion type="single" collapsible className="space-y-2">
                {faqItems.map((item, i) => (
                  <AccordionItem key={i} value={`faq-${i}`} className="border border-white/10 rounded-lg bg-white/[0.02] px-4">
                    <AccordionTrigger className="text-sm text-white hover:no-underline py-3" data-testid={`faq-trigger-${i}`}>
                      {item.q}
                    </AccordionTrigger>
                    <AccordionContent className="text-xs text-white/60 leading-relaxed pb-3">
                      {item.a}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 px-4">
        <div className="container mx-auto max-w-3xl text-center">
          <GlassCard glow className="p-8 sm:p-12">
            <Sparkles className="w-10 h-10 text-cyan-400 mx-auto mb-4" />
            <h2 className="text-2xl sm:text-3xl font-display font-bold mb-4">
              Start Your Journey Today
            </h2>
            <p className="text-white/60 text-sm sm:text-base mb-8 max-w-lg mx-auto">
              Join thousands of learners building real skills in crypto, DeFi, and blockchain security. 
              Your first course is free — no credit card required.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Button
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white rounded-full gap-2 h-12 px-8"
                data-testid="button-start-free"
              >
                <GraduationCap className="w-5 h-5" />
                Start Free
              </Button>
              <Link href="/ecosystem">
                <Button size="lg" variant="outline" className="border-white/20 hover:bg-white/5 rounded-full h-12 px-8" data-testid="button-back-ecosystem">
                  Back to Ecosystem
                </Button>
              </Link>
            </div>
          </GlassCard>
        </div>
      </section>

      <Footer />
    </div>
  );
}
