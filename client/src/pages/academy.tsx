import { useState, useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Link } from "wouter";
import {
  BookOpen, Shield, Coins, ArrowLeftRight, Lock, Layers,
  CheckCircle2, Star, Award, Users, Clock, Play, ChevronRight,
  Sparkles, GraduationCap, FileText, Zap, Globe, TrendingUp,
  Target, ArrowRight, Flame, Crown, Eye, Radio,
  Code, Terminal, Cpu, Braces, Languages, Lightbulb,
  Rocket, Binary, Server, Monitor, Smartphone, Bot,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { GlassCard } from "@/components/glass-card";
import { SiteNav } from "@/components/site-nav";
import { Footer } from "@/components/footer";
import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger,
} from "@/components/ui/accordion";

const heroImg = "/images/academy-hero.png";
const certImg = "/images/academy-cert.png";
const defiImg = "/images/academy-defi.png";
const mentorImg = "/images/academy-mentor.png";
const securityImg = "/images/academy-security.png";

const STRIPE_PRICES = {
  scholar: "price_1T2GJZRq977vVehdIBcsUn7x",
  master: "price_1T2GJdRq977vVehdYtJ5plVZ",
};

const courseCategories = [
  {
    id: "programming-foundations",
    title: "Programming Foundations",
    description: "Understand what a programming language really is — no gatekeepers, no governing body. Just a compiler that reads text and turns it into something a computer can execute.",
    icon: Code,
    color: "cyan",
    courses: 8,
    hours: 12,
    level: "Beginner",
    topics: ["What is a Programming Language?", "How Compilers Work", "Variables, Functions & Loops", "The Lexer-Parser-Transpiler Pipeline", "Your First Program"],
  },
  {
    id: "language-history",
    title: "The Major Languages",
    description: "Learn the origin stories — HTML from CERN, CSS from Norway, JavaScript built in 10 days, C from Bell Labs. Every language was born from one person's frustration.",
    icon: BookOpen,
    color: "purple",
    courses: 6,
    hours: 10,
    level: "Beginner",
    topics: ["HTML — Tim Berners-Lee & CERN", "CSS — Separating Structure from Style", "JavaScript — 10 Days That Changed Everything", "C — The Foundation of Everything", "The Pattern: Frustration Creates Innovation"],
  },
  {
    id: "javascript-mastery",
    title: "JavaScript: Buttons to Everything",
    description: "Trace JavaScript's journey from validating form fields to running the entire internet. DOM manipulation, AJAX, Node.js, React, and the AI frontier.",
    icon: Braces,
    color: "cyan",
    courses: 10,
    hours: 16,
    level: "Intermediate",
    topics: ["DOM Manipulation & the Living Page", "AJAX & Background Communication", "Node.js — JavaScript Leaves the Browser", "React, Angular & Vue Frameworks", "WebGL, AI & the Modern Frontier"],
  },
  {
    id: "compiler-engineering",
    title: "Compiler Engineering",
    description: "Build a compiler from scratch. Understand lexers, parsers, ASTs, and transpilers — the three-stage pipeline that turns human-readable code into executable programs.",
    icon: Cpu,
    color: "purple",
    courses: 7,
    hours: 14,
    level: "Advanced",
    topics: ["Lexer: Breaking Text into Tokens", "Parser: Building the AST", "Transpiler: Generating Output", "The Complete Compilation Flow", "Error Handling & Edge Cases"],
  },
  {
    id: "lume-language",
    title: "The Lume Language",
    description: "Master the world's first AI-native programming language. AI isn't a library you bolt on — it's a keyword. One word replaces dozens of lines of setup code.",
    icon: Sparkles,
    color: "cyan",
    courses: 9,
    hours: 18,
    level: "All Levels",
    topics: ["AI as a Native Keyword", "Readable Syntax by Design", "Fetch, Ask & Show", "Lume Compiler Internals", "Publishing to npm"],
  },
  {
    id: "digital-architecture",
    title: "Digital Architecture",
    description: "Understand how the digital world is built — operating systems, platforms, the web as universal translator, and why software scales infinitely.",
    icon: Layers,
    color: "purple",
    courses: 6,
    hours: 10,
    level: "Intermediate",
    topics: ["Windows vs macOS — Same Bricks, Different Architects", "The Web as Universal Translator", "Where Code Actually Runs", "Digital Durability & Self-Sustaining Systems", "The Democratization of Software"],
  },
];

const certifications = [
  {
    id: "clf",
    title: "Certified Lume Foundations",
    abbrev: "CLF",
    description: "Demonstrates foundational understanding of programming languages, compilers, and the Lume ecosystem.",
    prereqs: ["Programming Foundations", "The Major Languages"],
    badge: "from-cyan-500 to-cyan-600",
  },
  {
    id: "cle",
    title: "Certified Lume Engineer",
    abbrev: "CLE",
    description: "Validates advanced Lume development skills including compiler engineering and AI-native programming.",
    prereqs: ["Compiler Engineering", "The Lume Language"],
    badge: "from-purple-500 to-purple-600",
  },
  {
    id: "cda",
    title: "Certified Digital Architect",
    abbrev: "CDA",
    description: "Expert-level certification covering full-stack digital architecture, platform engineering, and self-sustaining systems.",
    prereqs: ["JavaScript Mastery", "Digital Architecture", "Compiler Engineering"],
    badge: "from-cyan-500 to-purple-500",
  },
];

const pricingTiers = [
  {
    id: "explorer",
    name: "Explorer",
    price: "Free",
    period: "",
    description: "Start your learning journey with programming foundations and community access.",
    features: [
      "Programming Foundations course track",
      "The Major Languages track",
      "Community forums access",
      "Weekly live Q&A sessions",
      "Progress tracking dashboard",
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
      "All 6 course tracks (46+ courses)",
      "Certification exam access",
      "Lume language deep dives",
      "Compiler engineering labs",
      "Downloadable resources",
      "Priority support",
      "Monthly workshops",
    ],
    cta: "Start Learning",
    popular: true,
    gradient: "from-cyan-500 to-cyan-600",
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
      "Advanced compiler workshops",
      "Build-your-own-language project",
      "Early access to new courses",
      "Exclusive Master credentials",
      "Private community channel",
      "Career guidance & referrals",
    ],
    cta: "Go Master",
    popular: false,
    gradient: "from-purple-500 to-purple-600",
    priceId: STRIPE_PRICES.master,
  },
];

const faqItems = [
  {
    q: "Do I need any prior coding experience?",
    a: "Not at all. Our Programming Foundations track starts from zero and explains everything in plain language. The Explorer tier is completely free, so you can start learning today.",
  },
  {
    q: "What is Lume and why should I learn it?",
    a: "Lume is a programming language where AI is a native keyword — not a library you bolt on. One word replaces dozens of lines of setup code. It compiles to JavaScript, so it runs everywhere JavaScript runs: browsers, servers, phones, desktop apps, even IoT devices.",
  },
  {
    q: "How do certifications work?",
    a: "After completing the required course modules, you can take the certification exam. Pass with 80% or higher to earn your verified credential, recorded permanently on the Trust Layer. Certifications are available on Scholar and Master plans.",
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
    q: "Do I need to install anything to write Lume code?",
    a: "Lume compiles to JavaScript, so you just need Node.js installed. Run 'npm install -g lume' and you're ready. The compiler runs entirely on your machine — no connection to any central server.",
  },
];

const testimonials = [
  { text: "The compiler engineering track completely changed how I understand software. I built my own language in a weekend.", author: "Full-Stack Developer", rating: 5 },
  { text: "Got my CLF certification in 3 weeks. The on-chain credential opened doors I didn't expect.", author: "Junior Developer", rating: 5 },
  { text: "Best programming education platform I've used. The Lume track alone is worth the Scholar tier.", author: "Software Engineer", rating: 5 },
];

const knowledgeHighlights = [
  {
    icon: Terminal,
    title: "The Compiler Pipeline",
    description: "Lexer breaks text into tokens. Parser builds the AST. Transpiler writes JavaScript. Three steps, each does one job.",
    detail: "let name = \"Ada\" → [LET] [IDENTIFIER: name] [EQUALS] [STRING: \"Ada\"] → const name = \"Ada\";",
  },
  {
    icon: Bot,
    title: "AI as a Native Keyword",
    description: "Every language today treats AI as an external library. Lume makes it a keyword. One word replaces dozens of lines.",
    detail: "let cities = ask \"List 5 cities in Texas\" as json",
  },
  {
    icon: Globe,
    title: "JavaScript Runs Everywhere",
    description: "Browser, server, phone, desktop, IoT. JavaScript is like water — it flows into whatever container you put it in.",
    detail: "Lume compiles to JS. Where JS runs, Lume runs.",
  },
  {
    icon: Rocket,
    title: "Self-Sustaining Systems",
    description: "Software that monitors, heals, optimizes, and improves itself. The human becomes the architect, not the mechanic.",
    detail: "Lume's 'mutate' keyword enables controlled self-modification with strict guardrails.",
  },
];

const colorMap: Record<string, { text: string; bg: string; border: string; glow: string }> = {
  cyan: { text: "text-cyan-400", bg: "bg-cyan-500/20", border: "border-cyan-500/20", glow: "shadow-cyan-500/20" },
  purple: { text: "text-purple-400", bg: "bg-purple-500/20", border: "border-purple-500/20", glow: "shadow-purple-500/20" },
};

function AnimatedCounter({ value, label, icon: Icon }: { value: string; label: string; icon: any }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true });
  const numericValue = parseInt(value.replace(/[^0-9]/g, ""));
  const suffix = value.replace(/[0-9]/g, "");
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isInView || isNaN(numericValue)) return;
    let start = 0;
    const end = numericValue;
    const duration = 2000;
    const step = Math.max(1, Math.floor(end / (duration / 16)));
    const timer = setInterval(() => {
      start += step;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(start);
      }
    }, 16);
    return () => clearInterval(timer);
  }, [isInView, numericValue]);

  return (
    <div ref={ref}>
      <GlassCard glow>
        <div className="p-5 text-center">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500/20 to-purple-500/20 border border-cyan-500/20 flex items-center justify-center mx-auto mb-3">
            <Icon className="w-5 h-5 text-cyan-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white" data-testid={`stat-${label.toLowerCase()}`}>
            {isNaN(numericValue) ? value : `${count}${suffix}`}
          </div>
          <div className="text-xs text-white/50 mt-1 uppercase tracking-wider font-medium">{label}</div>
        </div>
      </GlassCard>
    </div>
  );
}

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" } },
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
    if (themeColor) themeColor.setAttribute('content', '#06b6d4');

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
    <div className="min-h-screen bg-[#06060a] text-white overflow-x-hidden">
      <SiteNav />

      <div className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img src={heroImg} alt="Lume Academy" className="w-full h-full object-cover opacity-20" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#06060a]/50 via-[#06060a]/80 to-[#06060a]" />
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 via-transparent to-purple-500/5" />
        </div>

        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(30)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                width: `${2 + Math.random() * 3}px`,
                height: `${2 + Math.random() * 3}px`,
                background: i % 2 === 0 ? "rgba(6,182,212,0.4)" : "rgba(168,85,247,0.3)",
              }}
              animate={{
                y: [0, -(20 + Math.random() * 40), 0],
                opacity: [0.1, 0.7, 0.1],
                scale: [1, 1.5, 1],
              }}
              transition={{
                duration: 3 + Math.random() * 5,
                repeat: Infinity,
                delay: Math.random() * 4,
              }}
            />
          ))}
        </div>

        <div className="absolute top-20 left-1/4 w-[500px] h-[500px] bg-cyan-600/8 rounded-full blur-[120px]" />
        <div className="absolute bottom-20 right-1/4 w-[400px] h-[400px] bg-purple-600/8 rounded-full blur-[100px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-600/5 rounded-full blur-[150px]" />

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="relative z-10 text-center max-w-5xl mx-auto px-4 sm:px-6 lg:px-8"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <Badge className="mb-6 px-4 py-2 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border-cyan-500/30 text-white text-sm backdrop-blur-sm shadow-lg shadow-cyan-500/10" data-testid="badge-academy">
              <GraduationCap className="w-4 h-4 mr-2 text-cyan-400" />
              Lume Academy
            </Badge>
          </motion.div>

          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-display font-black mb-6 leading-[0.9]">
            <motion.span
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="bg-gradient-to-r from-cyan-400 via-cyan-300 to-purple-400 bg-clip-text text-transparent drop-shadow-2xl block"
            >
              Understand Code.
            </motion.span>
            <motion.span
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="text-white drop-shadow-2xl block mt-2"
            >
              Build Anything.
            </motion.span>
          </h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="text-lg sm:text-xl text-white/60 max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            The premier education platform for understanding programming languages, compilers,
            and the digital world — featuring the Lume language, where AI is a native keyword.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <a href="#courses">
              <Button size="lg" className="h-14 px-8 text-base gap-2 bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 text-white shadow-2xl shadow-cyan-500/25 rounded-xl" data-testid="button-explore-courses">
                <Play className="w-5 h-5" />
                Explore Courses
                <ArrowRight className="w-4 h-4" />
              </Button>
            </a>
            <a href="#pricing">
              <Button size="lg" variant="outline" className="h-14 px-8 text-base gap-2 border-white/20 text-white hover:bg-white/5 rounded-xl" data-testid="button-view-pricing">
                View Pricing
                <ChevronRight className="w-4 h-4" />
              </Button>
            </a>
          </motion.div>
        </motion.div>

        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <ChevronRight className="w-6 h-6 text-white/30 rotate-90" />
        </motion.div>
      </div>

      <section className="py-20 relative">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="grid grid-cols-2 md:grid-cols-4 gap-4"
          >
            {[
              { label: "Courses", value: "46+", icon: BookOpen },
              { label: "Hours", value: "80+", icon: Clock },
              { label: "Certifications", value: "3", icon: Award },
              { label: "Tracks", value: "6", icon: Target },
            ].map((stat) => (
              <motion.div key={stat.label} variants={fadeUp}>
                <AnimatedCounter {...stat} />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="py-20 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-500/[0.03] to-transparent" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <div className="relative rounded-2xl overflow-hidden shadow-2xl shadow-cyan-500/10">
                <img src={defiImg} alt="Lume Code Editor" className="w-full h-auto" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#06060a]/80 via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <Badge className="bg-cyan-500/20 text-cyan-400 border-cyan-500/30 text-xs mb-2">
                    <Sparkles className="w-3 h-3 mr-1" /> Featured Track
                  </Badge>
                  <h3 className="text-xl font-bold text-white">The Lume Language</h3>
                  <p className="text-white/50 text-sm mt-1">9 courses · 18 hours of expert content</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="space-y-6"
            >
              <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">
                <Lightbulb className="w-3 h-3 mr-1" /> Why Lume Academy
              </Badge>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-black">
                <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                  Built for builders.
                </span>
                <br />
                <span className="text-white">Not spectators.</span>
              </h2>
              <p className="text-white/60 leading-relaxed">
                Every course is designed around practical, hands-on understanding. No theoretical fluff.
                You learn how compilers actually work, why languages exist, and how to build your own.
              </p>
              <div className="space-y-3">
                {[
                  { icon: Lock, label: "Verified credentials — permanently recorded, impossible to fake" },
                  { icon: Terminal, label: "Hands-on labs — build a compiler from scratch" },
                  { icon: Bot, label: "Learn AI-native programming with Lume" },
                  { icon: TrendingUp, label: "Updated monthly with latest language & AI research" },
                ].map((item) => (
                  <div key={item.label} className="flex items-center gap-3 group">
                    <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center flex-shrink-0 group-hover:border-purple-500/40 group-hover:shadow-lg group-hover:shadow-purple-500/10 transition-all duration-300">
                      <item.icon className="w-4 h-4 text-cyan-400" />
                    </div>
                    <span className="text-white/70 text-sm">{item.label}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-20 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-500/[0.03] to-transparent" />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <Badge className="mb-4 px-3 py-1.5 bg-cyan-500/10 border-cyan-500/30 text-cyan-400 text-xs">
              <Lightbulb className="w-3 h-3 mr-1" /> Knowledge Base Highlights
            </Badge>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-black mb-4">
              <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                Core Concepts
              </span>{" "}
              You'll Master
            </h2>
            <p className="text-white/50 max-w-xl mx-auto">
              Real understanding, not memorization. These are the ideas that change how you see software.
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto"
          >
            {knowledgeHighlights.map((item) => (
              <motion.div key={item.title} variants={fadeUp}>
                <motion.div whileHover={{ scale: 1.02, y: -2 }} transition={{ type: "spring", stiffness: 300 }}>
                  <GlassCard glow>
                    <div className="p-6 h-full">
                      <div className="flex items-start gap-4 mb-4">
                        <div className="p-3 rounded-xl bg-gradient-to-br from-cyan-500/20 to-purple-500/20 border border-cyan-500/20 flex-shrink-0 shadow-lg shadow-cyan-500/20">
                          <item.icon className="w-6 h-6 text-cyan-400" />
                        </div>
                        <div>
                          <h3 className="font-bold text-white text-lg">{item.title}</h3>
                          <p className="text-white/60 text-sm leading-relaxed mt-1">{item.description}</p>
                        </div>
                      </div>
                      <div className="bg-[#0a0b10] border border-[#1a1b2e] rounded-lg p-3 mt-3">
                        <code className="text-cyan-400 text-xs font-mono">{item.detail}</code>
                      </div>
                    </div>
                  </GlassCard>
                </motion.div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <section id="courses" className="py-20 px-4 relative">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500/20 to-transparent" />
        <div className="container mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <Badge className="mb-4 px-3 py-1.5 bg-purple-500/10 border-purple-500/30 text-purple-400 text-xs">
              <BookOpen className="w-3 h-3 mr-1" /> Course Catalog
            </Badge>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-black mb-4">
              <span className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                Six Expert-Crafted
              </span>{" "}
              Learning Tracks
            </h2>
            <p className="text-white/50 max-w-xl mx-auto">
              From "what is a programming language?" to building your own compiler.
              Each track builds practical, real-world understanding.
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6"
          >
            {courseCategories.map((cat) => {
              const colors = colorMap[cat.color] || colorMap.cyan;
              return (
                <motion.div key={cat.id} variants={fadeUp}>
                  <motion.div whileHover={{ scale: 1.03, y: -4 }} transition={{ type: "spring", stiffness: 300 }}>
                    <div
                      onClick={() => setSelectedCategory(selectedCategory === cat.id ? null : cat.id)}
                      data-testid={`card-course-${cat.id}`}
                    >
                      <GlassCard
                        glow
                        className={`h-full cursor-pointer transition-all duration-300 shadow-2xl hover:border-cyan-500/30 hover:shadow-cyan-500/10 ${
                          selectedCategory === cat.id ? "border-cyan-500/40 shadow-[0_0_40px_rgba(6,182,212,0.2)]" : ""
                        }`}
                      >
                        <div className="p-6">
                          <div className="flex items-start gap-4 mb-4">
                            <div className={`p-3 rounded-xl border ${colors.bg} ${colors.border} flex-shrink-0 shadow-lg ${colors.glow}`}>
                              <cat.icon className={`w-6 h-6 ${colors.text}`} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="font-bold text-white text-base sm:text-lg">{cat.title}</h3>
                              <Badge variant="outline" className="text-[10px] border-white/10 text-white/50 mt-1.5">
                                {cat.level}
                              </Badge>
                            </div>
                          </div>
                          <p className="text-white/60 text-sm leading-relaxed mb-5">{cat.description}</p>
                          <div className="flex items-center gap-4 text-xs text-white/40">
                            <span className="flex items-center gap-1.5 bg-white/5 px-2.5 py-1 rounded-full">
                              <BookOpen className="w-3 h-3" /> {cat.courses} courses
                            </span>
                            <span className="flex items-center gap-1.5 bg-white/5 px-2.5 py-1 rounded-full">
                              <Clock className="w-3 h-3" /> {cat.hours}h content
                            </span>
                          </div>

                          {selectedCategory === cat.id && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              className="border-t border-white/10 pt-4 mt-5"
                            >
                              <p className="text-[10px] text-white/40 uppercase tracking-widest mb-3 font-semibold">Key Topics</p>
                              <ul className="space-y-2">
                                {cat.topics.map((topic) => (
                                  <li key={topic} className="flex items-center gap-2.5 text-sm text-white/70">
                                    <CheckCircle2 className={`w-4 h-4 ${colors.text} flex-shrink-0`} />
                                    {topic}
                                  </li>
                                ))}
                              </ul>
                            </motion.div>
                          )}
                        </div>
                      </GlassCard>
                    </div>
                  </motion.div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0">
          <img src={certImg} alt="Verified Credentials" className="w-full h-full object-cover opacity-15" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#06060a] via-[#06060a]/90 to-[#06060a]" />
        </div>
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500/20 to-transparent" />

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <Badge className="mb-4 px-3 py-1.5 bg-purple-500/10 border-purple-500/30 text-purple-400 text-xs">
              <Award className="w-3 h-3 mr-1" /> Certifications
            </Badge>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-black mb-4">
              <span className="bg-gradient-to-r from-purple-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent">
                Verified
              </span>{" "}
              Credentials
            </h2>
            <p className="text-white/50 max-w-xl mx-auto">
              Earn certifications that prove your skills. Permanently verifiable on the Trust Layer.
              Your proof of expertise — recorded, immutable, and always accessible.
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {certifications.map((cert) => (
              <motion.div key={cert.id} variants={fadeUp}>
                <motion.div whileHover={{ scale: 1.03, y: -4 }} transition={{ type: "spring", stiffness: 300 }}>
                  <GlassCard glow className="h-full shadow-2xl hover:border-purple-500/30 hover:shadow-purple-500/10 transition-all duration-300" data-testid={`card-cert-${cert.id}`}>
                    <div className="p-6 sm:p-8">
                      <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${cert.badge} flex items-center justify-center mb-6 shadow-xl relative`}>
                        <span className="text-xl font-black text-white">{cert.abbrev}</span>
                        <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${cert.badge} opacity-40 blur-xl`} />
                      </div>
                      <h3 className="font-bold text-white text-lg mb-3">{cert.title}</h3>
                      <p className="text-white/60 text-sm leading-relaxed mb-6">{cert.description}</p>
                      <div className="border-t border-white/10 pt-4">
                        <p className="text-[10px] text-white/40 uppercase tracking-widest mb-3 font-semibold">Prerequisites</p>
                        <ul className="space-y-2">
                          {cert.prereqs.map((p) => (
                            <li key={p} className="flex items-center gap-2.5 text-sm text-white/60">
                              <FileText className="w-3.5 h-3.5 text-white/30 flex-shrink-0" />
                              {p}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </GlassCard>
                </motion.div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="py-20 relative">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <Badge className="mb-4 px-3 py-1.5 bg-cyan-500/10 border-cyan-500/30 text-cyan-400 text-xs">
              <Star className="w-3 h-3 mr-1" /> Testimonials
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-display font-black mb-4">
              What <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">Builders</span> Are Saying
            </h2>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto"
          >
            {testimonials.map((t, i) => (
              <motion.div key={i} variants={fadeUp}>
                <GlassCard glow className="h-full shadow-2xl hover:border-cyan-500/20 transition-all duration-300">
                  <div className="p-6">
                    <div className="flex gap-1 mb-4">
                      {[...Array(t.rating)].map((_, j) => (
                        <Star key={j} className="w-4 h-4 text-cyan-400 fill-cyan-400" />
                      ))}
                    </div>
                    <p className="text-white/80 text-sm leading-relaxed mb-4 italic">"{t.text}"</p>
                    <div className="flex items-center gap-2 text-xs text-white/40">
                      <div className="w-6 h-6 rounded-full bg-gradient-to-br from-cyan-500 to-purple-500 flex items-center justify-center">
                        <Users className="w-3 h-3 text-white" />
                      </div>
                      {t.author}
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0">
          <img src={securityImg} alt="Learning Lab" className="w-full h-full object-cover opacity-10" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#06060a] via-[#06060a]/95 to-[#06060a]" />
        </div>
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500/20 to-transparent" />

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="space-y-6"
            >
              <Badge className="bg-cyan-500/20 text-cyan-400 border-cyan-500/30">
                <Shield className="w-3 h-3 mr-1" /> Learning Journey
              </Badge>
              <h2 className="text-3xl sm:text-4xl font-display font-black">
                Your Path to{" "}
                <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                  Mastery
                </span>
              </h2>
              <p className="text-white/60 leading-relaxed">
                A structured progression from "what is code?" to building your own programming language.
                Each level builds on the last.
              </p>

              <div className="space-y-4">
                {[
                  { step: "01", title: "Foundation", desc: "Programming Foundations — what languages are, how they work, who made them", color: "from-cyan-500 to-cyan-600", icon: BookOpen },
                  { step: "02", title: "Specialization", desc: "Choose JavaScript Mastery, Compiler Engineering, or Digital Architecture", color: "from-purple-500 to-purple-600", icon: Target },
                  { step: "03", title: "Certification", desc: "Pass your exam and earn on-chain credentials — CLF, CLE, or CDA", color: "from-cyan-500 to-purple-500", icon: Award },
                  { step: "04", title: "Mastery", desc: "Build your own language, contribute to Lume, mentor others", color: "from-purple-500 to-cyan-500", icon: Crown },
                ].map((s, i) => (
                  <motion.div
                    key={s.step}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.15 }}
                    className="group"
                  >
                    <GlassCard className="hover:border-cyan-500/30 hover:shadow-2xl hover:shadow-cyan-500/5 transition-all duration-300">
                      <div className="p-4 flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center flex-shrink-0 shadow-lg relative`}>
                          <s.icon className="w-5 h-5 text-white" />
                          <div className={`absolute inset-0 rounded-xl bg-gradient-to-br ${s.color} opacity-30 blur-lg`} />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] text-white/30 font-mono uppercase tracking-wider">Step {s.step}</span>
                          </div>
                          <h4 className="font-bold text-white text-sm">{s.title}</h4>
                          <p className="text-white/50 text-xs mt-0.5">{s.desc}</p>
                        </div>
                      </div>
                    </GlassCard>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <div className="relative rounded-2xl overflow-hidden shadow-2xl shadow-purple-500/10">
                <img src={mentorImg} alt="Mentorship" className="w-full h-auto" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#06060a]/80 via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30 text-xs mb-2">
                    <Crown className="w-3 h-3 mr-1" /> Master Tier Exclusive
                  </Badge>
                  <h3 className="text-lg font-bold text-white">1-on-1 Mentorship</h3>
                  <p className="text-white/50 text-xs mt-1">Direct access to language designers and compiler engineers</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section id="pricing" className="py-20 px-4 relative">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent" />
        <div className="absolute top-40 left-1/4 w-[400px] h-[400px] bg-cyan-600/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-40 right-1/4 w-[400px] h-[400px] bg-purple-600/5 rounded-full blur-[120px]" />

        <div className="container mx-auto max-w-6xl relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <Badge className="mb-4 px-3 py-1.5 bg-cyan-500/10 border-cyan-500/30 text-cyan-400 text-xs">
              Pricing
            </Badge>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-black mb-4">
              Choose Your{" "}
              <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                Learning Path
              </span>
            </h2>
            <p className="text-white/50 max-w-xl mx-auto">
              Start free and upgrade when you're ready. All plans include mobile access and progress tracking.
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto"
          >
            {pricingTiers.map((tier) => (
              <motion.div
                key={tier.id}
                variants={fadeUp}
                className={tier.popular ? "md:-mt-6 md:mb-0" : ""}
              >
                <motion.div whileHover={{ scale: 1.03, y: -4 }} transition={{ type: "spring", stiffness: 300 }}>
                  <GlassCard
                    glow={tier.popular}
                    className={`h-full flex flex-col relative shadow-2xl transition-all duration-300 ${
                      tier.popular
                        ? "border-cyan-500/30 shadow-[0_0_50px_rgba(6,182,212,0.15)] hover:shadow-[0_0_60px_rgba(6,182,212,0.25)]"
                        : "hover:border-white/20"
                    }`}
                    data-testid={`card-pricing-${tier.id}`}
                  >
                    <div className="p-6 sm:p-8 flex flex-col h-full">
                      {tier.popular && (
                        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                          <Badge className="bg-gradient-to-r from-cyan-500 to-purple-500 text-white border-0 text-xs px-4 py-1 shadow-lg shadow-cyan-500/30">
                            <Star className="w-3 h-3 mr-1 fill-white" />
                            Most Popular
                          </Badge>
                        </div>
                      )}
                      <div className="mb-6">
                        <h3 className="font-black text-white text-xl">{tier.name}</h3>
                        <p className="text-white/50 text-xs mt-1.5">{tier.description}</p>
                      </div>
                      <div className="flex items-baseline gap-1 mb-8">
                        <span className="text-4xl sm:text-5xl font-black text-white">{tier.price}</span>
                        {tier.period && <span className="text-white/40 text-sm">{tier.period}</span>}
                      </div>
                      <ul className="space-y-3 mb-8 flex-grow">
                        {tier.features.map((feature) => (
                          <li key={feature} className="flex items-start gap-2.5 text-sm text-white/70">
                            <CheckCircle2 className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                      <Button
                        size="lg"
                        className={`w-full h-12 font-bold rounded-xl text-base ${
                          tier.popular
                            ? "bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 text-white shadow-lg shadow-cyan-500/20"
                            : tier.id === "master"
                            ? "bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-500 hover:to-purple-400 text-white shadow-lg shadow-purple-500/20"
                            : "bg-white/10 hover:bg-white/15 text-white border border-white/10"
                        }`}
                        onClick={() => tier.priceId && handleSubscribe(tier.priceId)}
                        data-testid={`button-subscribe-${tier.id}`}
                      >
                        {tier.cta}
                      </Button>
                    </div>
                  </GlassCard>
                </motion.div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="py-20 px-4 relative">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <Badge className="mb-4 bg-cyan-500/20 text-cyan-400 border-cyan-500/30">
                <Eye className="w-3 h-3 mr-1" /> Built Different
              </Badge>
              <h2 className="text-3xl sm:text-4xl font-display font-black mb-8">
                Why{" "}
                <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                  Lume Academy
                </span>
              </h2>
              <div className="space-y-4">
                {[
                  {
                    icon: Lock,
                    title: "Verified Credentials",
                    desc: "Your certifications are permanently recorded on the Trust Layer. Verifiable by anyone, forever.",
                    gradient: "from-cyan-500 to-cyan-600",
                  },
                  {
                    icon: Terminal,
                    title: "Build, Don't Just Read",
                    desc: "Every course includes hands-on labs. Build a compiler, create a language, ship real software.",
                    gradient: "from-purple-500 to-purple-600",
                  },
                  {
                    icon: Users,
                    title: "Community-Driven",
                    desc: "Learn alongside other builders. Weekly Q&A sessions, forums, and peer code reviews.",
                    gradient: "from-cyan-500 to-purple-500",
                  },
                  {
                    icon: TrendingUp,
                    title: "Always Current",
                    desc: "Courses updated monthly to reflect the latest in AI-native programming, compilers, and language design.",
                    gradient: "from-purple-500 to-cyan-500",
                  },
                ].map((item, i) => (
                  <motion.div
                    key={item.title}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <GlassCard className="hover:border-cyan-500/20 hover:shadow-2xl hover:shadow-cyan-500/5 transition-all duration-300">
                      <div className="p-5 flex items-start gap-4">
                        <div className={`p-2.5 rounded-xl bg-gradient-to-br ${item.gradient} flex-shrink-0 shadow-lg relative`}>
                          <item.icon className="w-5 h-5 text-white" />
                          <div className={`absolute inset-0 rounded-xl bg-gradient-to-br ${item.gradient} opacity-30 blur-lg`} />
                        </div>
                        <div>
                          <h4 className="font-bold text-white text-sm">{item.title}</h4>
                          <p className="text-white/60 text-xs leading-relaxed mt-1.5">{item.desc}</p>
                        </div>
                      </div>
                    </GlassCard>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <Badge className="mb-4 bg-purple-500/20 text-purple-400 border-purple-500/30">
                <Radio className="w-3 h-3 mr-1" /> FAQ
              </Badge>
              <h2 className="text-3xl sm:text-4xl font-display font-black mb-8">
                Common Questions
              </h2>
              <Accordion type="single" collapsible className="space-y-3">
                {faqItems.map((item, i) => (
                  <AccordionItem key={i} value={`faq-${i}`} className="border border-white/10 rounded-xl bg-white/[0.02] px-5 backdrop-blur-sm hover:border-white/20 transition-all duration-300">
                    <AccordionTrigger className="text-sm text-white hover:no-underline py-4 font-medium" data-testid={`faq-trigger-${i}`}>
                      {item.q}
                    </AccordionTrigger>
                    <AccordionContent className="text-sm text-white/60 leading-relaxed pb-4">
                      {item.a}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 relative">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent" />
        <div className="container mx-auto max-w-3xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <GlassCard glow className="shadow-2xl shadow-cyan-500/10 relative overflow-hidden">
              <div className="p-10 sm:p-16">
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent to-purple-500/5" />
                <div className="absolute top-0 right-0 w-40 h-40 bg-cyan-500/10 rounded-full blur-[80px]" />
                <div className="absolute bottom-0 left-0 w-40 h-40 bg-purple-500/10 rounded-full blur-[80px]" />

                <div className="relative z-10">
                  <motion.div
                    animate={{ rotate: [0, 5, -5, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <GraduationCap className="w-12 h-12 text-cyan-400 mx-auto mb-6" />
                  </motion.div>
                  <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-black mb-6">
                    <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
                      Start Your Journey
                    </span>
                    <br />
                    <span className="text-white">Today</span>
                  </h2>
                  <p className="text-white/60 text-base sm:text-lg mb-10 max-w-lg mx-auto leading-relaxed">
                    Join builders and engineers learning how code really works — from first principles
                    to building their own programming languages. Your first course is free.
                  </p>
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Button
                      size="lg"
                      className="h-14 px-8 text-base gap-2 bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 text-white shadow-2xl shadow-cyan-500/25 rounded-xl"
                      data-testid="button-start-free"
                    >
                      <GraduationCap className="w-5 h-5" />
                      Start Free
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                    <Link href="/ecosystem">
                      <Button size="lg" variant="outline" className="h-14 px-8 text-base border-white/20 text-white hover:bg-white/5 rounded-xl" data-testid="button-back-ecosystem">
                        Back to Ecosystem
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
