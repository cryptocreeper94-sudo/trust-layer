import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "wouter";
import {
  BarChart3, Users, Megaphone, Shield, Lock, Eye,
  Activity, Zap, DollarSign, Crown, Gamepad2, Globe, Settings,
  Search, ArrowRight, ArrowLeft,
  Code, Server, FileText, MessageSquare,
  Star, Gift, Mail, Newspaper, BookOpen, Coins,
  Building2, ShieldCheck, Bot, Cpu, Palette, Map, LineChart,
  LayoutGrid, LogOut, Swords, Sparkles, Layers, Radio,
  Rocket, Trophy, Network, Boxes,
  ScrollText, Gavel, HandCoins, UserCog, ClipboardCheck,
  PieChart, Compass, Flame, Landmark
} from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

import ccAnalytics from "@assets/generated_images/cc_analytics_dashboard.jpg";
import ccUsers from "@assets/generated_images/cc_users_community.jpg";
import ccMarketing from "@assets/generated_images/cc_marketing_content.jpg";
import ccSecurity from "@assets/generated_images/cc_security_shield.jpg";
import ccFinance from "@assets/generated_images/cc_finance_tokens.jpg";
import ccDeveloper from "@assets/generated_images/cc_developer_tools.jpg";
import ccGames from "@assets/generated_images/cc_games_arcade.jpg";
import ccBlockchain from "@assets/generated_images/cc_blockchain_network.jpg";
import ccSettings from "@assets/generated_images/cc_settings_config.jpg";
import ccRewards from "@assets/generated_images/cc_rewards_treasure.jpg";

interface LaunchCard {
  label: string;
  description: string;
  href: string;
  icon: React.ReactNode;
  image: string;
  glowColor: string;
  badge?: string;
  featured?: boolean;
}

interface Category {
  title: string;
  icon: React.ReactNode;
  gradient: string;
  description: string;
  cards: LaunchCard[];
}

const categories: Category[] = [
  {
    title: "Analytics & Insights",
    icon: <BarChart3 className="size-4" />,
    gradient: "from-blue-500 to-cyan-500",
    description: "Real-time metrics, traffic analytics, SEO performance, and platform health monitoring. Track every aspect of the ecosystem from a single view.",
    cards: [
      { label: "Owner Analytics", description: "Platform-wide metrics and KPIs", href: "/owner-admin/analytics", icon: <BarChart3 className="size-5" />, image: ccAnalytics, glowColor: "shadow-blue-500/30", badge: "Live", featured: true },
      { label: "Platform Dashboard", description: "High-level operational overview", href: "/dashboard", icon: <LayoutGrid className="size-5" />, image: ccAnalytics, glowColor: "shadow-blue-400/30", badge: "Live" },
      { label: "SEO Manager", description: "Search engine optimization controls", href: "/owner-admin/seo", icon: <Search className="size-5" />, image: ccAnalytics, glowColor: "shadow-indigo-500/30" },
      { label: "Network Stats", description: "Blockchain network performance", href: "/network", icon: <Activity className="size-5" />, image: ccBlockchain, glowColor: "shadow-teal-500/30" },
      { label: "ML Dashboard", description: "Machine learning model insights", href: "/ml-dashboard", icon: <Cpu className="size-5" />, image: ccDeveloper, glowColor: "shadow-violet-500/30", badge: "Beta" },
      { label: "API Usage", description: "Track API consumption and limits", href: "/api-usage", icon: <LineChart className="size-5" />, image: ccAnalytics, glowColor: "shadow-cyan-500/30" },
    ]
  },
  {
    title: "Users & Community",
    icon: <Users className="size-4" />,
    gradient: "from-purple-500 to-pink-500",
    description: "Manage user accounts, verify identities, handle KYC processes, review business applications, and oversee the community. Everything people-related lives here.",
    cards: [
      { label: "User Management", description: "View, edit, and manage all users", href: "/owner-admin/users", icon: <Users className="size-5" />, image: ccUsers, glowColor: "shadow-purple-500/30", featured: true },
      { label: "KYC Verification", description: "Identity verification queue", href: "/owner-admin/kyc", icon: <ClipboardCheck className="size-5" />, image: ccSecurity, glowColor: "shadow-pink-500/30", badge: "Queue" },
      { label: "Business Verification", description: "Review business applications", href: "/owner-admin/business-verification", icon: <Building2 className="size-5" />, image: ccUsers, glowColor: "shadow-fuchsia-500/30" },
      { label: "Partner Requests", description: "Incoming partnership applications", href: "/owner-admin", icon: <HandCoins className="size-5" />, image: ccUsers, glowColor: "shadow-rose-500/30" },
      { label: "User Feedback", description: "Read and respond to user feedback", href: "/owner-admin/feedback", icon: <MessageSquare className="size-5" />, image: ccUsers, glowColor: "shadow-purple-400/30" },
      { label: "Team Admin", description: "Manage team access and roles", href: "/team-admin", icon: <UserCog className="size-5" />, image: ccUsers, glowColor: "shadow-violet-500/30" },
      { label: "Zealy Integration", description: "Community engagement platform", href: "/owner-admin/zealy", icon: <Zap className="size-5" />, image: ccRewards, glowColor: "shadow-yellow-500/30", badge: "Earn" },
    ]
  },
  {
    title: "Marketing & Content",
    icon: <Megaphone className="size-4" />,
    gradient: "from-orange-500 to-rose-500",
    description: "Social media automation, blog management, messaging campaigns, marketing catalogs, and content creation tools. Drive growth and engagement from one place.",
    cards: [
      { label: "Marketing Hub", description: "Campaign management & automation", href: "/owner-admin/messaging", icon: <Megaphone className="size-5" />, image: ccMarketing, glowColor: "shadow-orange-500/30", featured: true },
      { label: "Blog Admin", description: "Create and manage blog content", href: "/blog-admin", icon: <Newspaper className="size-5" />, image: ccMarketing, glowColor: "shadow-rose-500/30" },
      { label: "Messaging Center", description: "Send announcements & notifications", href: "/owner-admin/messaging", icon: <Mail className="size-5" />, image: ccMarketing, glowColor: "shadow-amber-500/30" },
      { label: "Marketing Catalog", description: "Manage marketing asset library", href: "/marketing-catalog/admin", icon: <Palette className="size-5" />, image: ccMarketing, glowColor: "shadow-pink-500/30" },
      { label: "Marketing Dev", description: "Marketing development tools", href: "/marketing-catalog/dev", icon: <Code className="size-5" />, image: ccDeveloper, glowColor: "shadow-red-500/30", badge: "Dev" },
      { label: "Competitive Analysis", description: "Market positioning analysis", href: "/competitive-analysis", icon: <PieChart className="size-5" />, image: ccMarketing, glowColor: "shadow-violet-500/30" },
      { label: "Investor Pitch", description: "Investor presentation materials", href: "/investor-pitch", icon: <Rocket className="size-5" />, image: ccMarketing, glowColor: "shadow-emerald-500/30" },
      { label: "Innovation Hub", description: "Innovation features and research", href: "/innovation", icon: <Sparkles className="size-5" />, image: ccMarketing, glowColor: "shadow-cyan-500/30" },
      { label: "Team Messaging", description: "Internal team communications", href: "/team-message", icon: <MessageSquare className="size-5" />, image: ccMarketing, glowColor: "shadow-blue-500/30" },
    ]
  },
  {
    title: "Finance & Payments",
    icon: <DollarSign className="size-4" />,
    gradient: "from-emerald-500 to-teal-500",
    description: "Presale management, crowdfunding, token economics, billing, treasury operations, and all financial controls. Monitor revenue and manage the Signal economy.",
    cards: [
      { label: "Presale Manager", description: "Token presale controls & tracking", href: "/owner-admin/presale", icon: <Rocket className="size-5" />, image: ccFinance, glowColor: "shadow-emerald-500/30", featured: true, badge: "Live" },
      { label: "Crowdfund Admin", description: "Donation and campaign management", href: "/crowdfund", icon: <HandCoins className="size-5" />, image: ccFinance, glowColor: "shadow-green-500/30" },
      { label: "Treasury", description: "DAO treasury and allocations", href: "/treasury", icon: <Landmark className="size-5" />, image: ccFinance, glowColor: "shadow-teal-500/30" },
      { label: "Billing", description: "Subscription and payment management", href: "/billing", icon: <DollarSign className="size-5" />, image: ccFinance, glowColor: "shadow-lime-500/30" },
      { label: "Tokenomics", description: "Token distribution and economics", href: "/tokenomics", icon: <PieChart className="size-5" />, image: ccBlockchain, glowColor: "shadow-cyan-500/30" },
    ]
  },
  {
    title: "Security & Guardian",
    icon: <ShieldCheck className="size-4" />,
    gradient: "from-red-500 to-orange-500",
    description: "Guardian certification program, AI agent registry, security scanning, shield monitoring, and all security infrastructure. Protect the ecosystem and certify trust.",
    cards: [
      { label: "Guardian Portal", description: "Security certification management", href: "/owner-admin/guardian", icon: <ShieldCheck className="size-5" />, image: ccSecurity, glowColor: "shadow-red-500/30", featured: true },
      { label: "Guardian Scanner", description: "AI-powered token security analysis", href: "/guardian-scanner", icon: <Search className="size-5" />, image: ccSecurity, glowColor: "shadow-orange-500/30", badge: "AI" },
      { label: "Guardian AI Registry", description: "Certified AI agent registry", href: "/guardian-ai-registry", icon: <Bot className="size-5" />, image: ccSecurity, glowColor: "shadow-amber-500/30" },
      { label: "Guardian Shield", description: "Continuous security monitoring", href: "/guardian-shield", icon: <Shield className="size-5" />, image: ccSecurity, glowColor: "shadow-rose-500/30" },
      { label: "Guardian Certification", description: "Audit certification program", href: "/guardian-certification", icon: <ScrollText className="size-5" />, image: ccSecurity, glowColor: "shadow-red-400/30" },
    ]
  },
  {
    title: "Blockchain & Network",
    icon: <Network className="size-4" />,
    gradient: "from-cyan-500 to-blue-500",
    description: "Validator management, faucet controls, block explorer, bridge operations, domain management, and core blockchain infrastructure. Run the Layer 1 from here.",
    cards: [
      { label: "Faucet Admin", description: "Testnet faucet controls", href: "/owner-admin/faucet", icon: <Coins className="size-5" />, image: ccBlockchain, glowColor: "shadow-cyan-500/30", featured: true },
      { label: "Block Explorer", description: "Browse blocks and transactions", href: "/explorer", icon: <Boxes className="size-5" />, image: ccBlockchain, glowColor: "shadow-blue-500/30" },
      { label: "Validators", description: "Validator set and staking", href: "/validators", icon: <Server className="size-5" />, image: ccBlockchain, glowColor: "shadow-indigo-500/30" },
      { label: "Bridge Monitor", description: "Cross-chain bridge operations", href: "/bridge", icon: <Layers className="size-5" />, image: ccBlockchain, glowColor: "shadow-sky-500/30" },
      { label: "Domain Manager", description: ".tlid blockchain domain service", href: "/owner-admin/domains", icon: <Globe className="size-5" />, image: ccSettings, glowColor: "shadow-teal-500/30" },
      { label: "Governance", description: "DAO proposals and voting", href: "/governance", icon: <Gavel className="size-5" />, image: ccBlockchain, glowColor: "shadow-purple-500/30" },
    ]
  },
  {
    title: "Rewards & Referrals",
    icon: <Gift className="size-4" />,
    gradient: "from-yellow-500 to-orange-500",
    description: "Referral program management, airdrop distribution, rewards configuration, early adopter tracking, and Shell economy controls. Keep the community engaged and rewarded.",
    cards: [
      { label: "Referral Manager", description: "Referral program stats & payouts", href: "/owner-admin/referrals", icon: <Star className="size-5" />, image: ccRewards, glowColor: "shadow-yellow-500/30", featured: true, badge: "Earn" },
      { label: "Rewards Config", description: "Configure reward distributions", href: "/owner-admin/referrals", icon: <Gift className="size-5" />, image: ccRewards, glowColor: "shadow-amber-500/30" },
      { label: "Airdrop Claims", description: "Manage airdrop distribution", href: "/airdrop", icon: <Sparkles className="size-5" />, image: ccRewards, glowColor: "shadow-orange-500/30" },
      { label: "Leaderboard", description: "Community rankings and scores", href: "/leaderboard", icon: <Trophy className="size-5" />, image: ccRewards, glowColor: "shadow-yellow-400/30" },
    ]
  },
  {
    title: "Games & Entertainment",
    icon: <Gamepad2 className="size-4" />,
    gradient: "from-pink-500 to-purple-500",
    description: "DarkWave Chronicles admin, arcade game controls, sweepstakes rules, and all gaming infrastructure. Manage the entertainment side of the ecosystem.",
    cards: [
      { label: "Chronicles Admin", description: "Game world and content management", href: "/chronicles-admin", icon: <Swords className="size-5" />, image: ccGames, glowColor: "shadow-pink-500/30", featured: true },
      { label: "Arcade Hub", description: "Arcade and game management", href: "/arcade", icon: <Gamepad2 className="size-5" />, image: ccGames, glowColor: "shadow-purple-500/30" },
      { label: "Sweepstakes Rules", description: "Contest rules and compliance", href: "/sweepstakes-rules", icon: <ScrollText className="size-5" />, image: ccGames, glowColor: "shadow-fuchsia-500/30" },
      { label: "Daily Bonus", description: "Configure daily reward system", href: "/daily-bonus", icon: <Flame className="size-5" />, image: ccRewards, glowColor: "shadow-rose-500/30" },
      { label: "Game Developer Portal", description: "Third-party game submission and review", href: "/game-developer", icon: <Code className="size-5" />, image: ccGames, glowColor: "shadow-indigo-500/30" },
      { label: "Chronicles Builder", description: "Game content creation tools", href: "/chronicles/builder", icon: <Layers className="size-5" />, image: ccGames, glowColor: "shadow-violet-500/30" },
    ]
  },
  {
    title: "Developer & API",
    icon: <Code className="size-4" />,
    gradient: "from-green-500 to-emerald-500",
    description: "API documentation, developer portal, webhook configuration, studio tools, and technical infrastructure. Everything developers need to build on DarkWave.",
    cards: [
      { label: "Developer Portal", description: "API keys and developer tools", href: "/developer-portal", icon: <Code className="size-5" />, image: ccDeveloper, glowColor: "shadow-green-500/30", featured: true },
      { label: "API Documentation", description: "Comprehensive API reference", href: "/api-docs", icon: <FileText className="size-5" />, image: ccDeveloper, glowColor: "shadow-emerald-500/30" },
      { label: "API Playground", description: "Interactive API testing", href: "/api-playground", icon: <Zap className="size-5" />, image: ccDeveloper, glowColor: "shadow-lime-500/30", badge: "Dev" },
      { label: "Webhooks", description: "Event webhook configuration", href: "/webhooks", icon: <Radio className="size-5" />, image: ccDeveloper, glowColor: "shadow-teal-500/30" },
      { label: "Studio", description: "Blockchain IDE and tools", href: "/studio", icon: <Cpu className="size-5" />, image: ccDeveloper, glowColor: "shadow-green-400/30" },
      { label: "Doc Hub", description: "System documentation hub", href: "/doc-hub", icon: <BookOpen className="size-5" />, image: ccDeveloper, glowColor: "shadow-cyan-500/30" },
      { label: "Code Snippets", description: "Reusable code snippet library", href: "/code-snippets", icon: <FileText className="size-5" />, image: ccDeveloper, glowColor: "shadow-amber-500/30" },
      { label: "Dev Studio", description: "Development sandbox environment", href: "/dev-studio", icon: <Server className="size-5" />, image: ccDeveloper, glowColor: "shadow-violet-500/30" },
    ]
  },
  {
    title: "Settings & System",
    icon: <Settings className="size-4" />,
    gradient: "from-slate-400 to-zinc-500",
    description: "Platform configuration, ecosystem map, roadmap management, status page, and core system settings. Fine-tune every aspect of the DarkWave platform.",
    cards: [
      { label: "Owner Portal", description: "Core owner administration hub", href: "/owner-admin", icon: <Crown className="size-5" />, image: ccSettings, glowColor: "shadow-slate-400/30", featured: true },
      { label: "Ecosystem Map", description: "Visual ecosystem overview", href: "/ecosystem", icon: <Map className="size-5" />, image: ccBlockchain, glowColor: "shadow-zinc-400/30" },
      { label: "Technical Roadmap", description: "Development timeline and plans", href: "/technical-roadmap", icon: <Compass className="size-5" />, image: ccSettings, glowColor: "shadow-gray-400/30" },
      { label: "System Status", description: "Service health and uptime", href: "/status", icon: <Activity className="size-5" />, image: ccSettings, glowColor: "shadow-green-500/30", badge: "Live" },
      { label: "Team Operations", description: "Internal team coordination", href: "/ops-center", icon: <UserCog className="size-5" />, image: ccUsers, glowColor: "shadow-blue-400/30" },
      { label: "Coming Features", description: "Upcoming feature release tracker", href: "/coming-features", icon: <Rocket className="size-5" />, image: ccSettings, glowColor: "shadow-purple-500/30" },
      { label: "Genesis", description: "Platform genesis configuration", href: "/genesis", icon: <Sparkles className="size-5" />, image: ccSettings, glowColor: "shadow-cyan-500/30" },
      { label: "Roadmap (Chronicles)", description: "Chronicles development roadmap", href: "/roadmap-chronicles", icon: <Compass className="size-5" />, image: ccSettings, glowColor: "shadow-pink-500/30" },
      { label: "Roadmap (Ecosystem)", description: "Ecosystem development timeline", href: "/roadmap-ecosystem", icon: <Map className="size-5" />, image: ccSettings, glowColor: "shadow-emerald-500/30" },
    ]
  },
];

const GlowOrb = ({ color, size, top, left, delay = 0 }: { color: string; size: number; top: string; left: string; delay?: number }) => (
  <motion.div
    className="absolute rounded-full blur-3xl opacity-20 pointer-events-none"
    style={{ background: color, width: size, height: size, top, left }}
    animate={{ scale: [1, 1.2, 1], opacity: [0.15, 0.25, 0.15] }}
    transition={{ duration: 8, repeat: Infinity, delay }}
  />
);

function PinLogin({ onSuccess }: { onSuccess: () => void }) {
  const [secret, setSecret] = useState("");
  const [error, setError] = useState("");
  const [shake, setShake] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showSecret, setShowSecret] = useState(false);

  const handleSubmit = async () => {
    if (secret.length < 4) {
      setError("Secret must be at least 4 characters");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/owner/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ secret }),
      });
      const data = await res.json();
      if (res.ok) {
        sessionStorage.setItem("ownerAuth", "true");
        sessionStorage.setItem("ownerToken", data.token);
        onSuccess();
      } else {
        setError(data.error || "Invalid credentials");
        setShake(true);
        setTimeout(() => setShake(false), 500);
      }
    } catch {
      setError("Connection error. Please try again.");
      setShake(true);
      setTimeout(() => setShake(false), 500);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden" style={{ background: "linear-gradient(180deg, #070b16, #0c1222, #070b16)" }}>
      <GlowOrb color="linear-gradient(135deg, #06b6d4, #8b5cf6)" size={400} top="10%" left="10%" />
      <GlowOrb color="linear-gradient(135deg, #ec4899, #8b5cf6)" size={300} top="60%" left="70%" delay={2} />

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`relative z-10 bg-white/[0.04] backdrop-blur-xl border border-white/10 rounded-3xl p-8 max-w-md w-full mx-4 ${shake ? "animate-shake" : ""}`}
        style={{ boxShadow: "0 0 60px rgba(0,200,255,0.1)" }}
      >
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-purple-500/20 border border-white/10 flex items-center justify-center">
            <Lock className="w-8 h-8 text-cyan-400" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Command Center</h1>
          <p className="text-white/40 text-sm">Enter your access key to continue</p>
        </div>

        <div className="space-y-4">
          <div className="relative">
            <input
              type={showSecret ? "text" : "password"}
              value={secret}
              onChange={(e) => { setSecret(e.target.value); setError(""); }}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              placeholder="Enter secret key..."
              className="w-full px-4 py-3 bg-white/[0.03] border border-white/10 rounded-xl text-white placeholder-white/30 focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 pr-12"
              autoFocus
              data-testid="input-command-center-secret"
            />
            <button
              type="button"
              onClick={() => setShowSecret(!showSecret)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors"
            >
              <Eye className="w-5 h-5" />
            </button>
          </div>
          {error && (
            <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="text-red-400 text-sm text-center">
              {error}
            </motion.p>
          )}
          <button
            onClick={handleSubmit}
            disabled={loading || !secret}
            className="w-full py-3 rounded-xl font-semibold text-white transition-all bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-400 hover:to-purple-400 disabled:opacity-40 disabled:cursor-not-allowed"
            data-testid="button-command-center-login"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <motion.span animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full" />
                Authenticating...
              </span>
            ) : "Access Command Center"}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

function LaunchCardComponent({ card, index }: { card: LaunchCard; index: number }) {
  const [, navigate] = useLocation();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
      onClick={() => navigate(card.href)}
      className={`group relative overflow-hidden rounded-2xl border border-white/5 cursor-pointer transition-all duration-300 hover:scale-[1.03] hover:border-white/15 hover:${card.glowColor} ${card.featured ? "min-h-[260px]" : "min-h-[240px]"}`}
      style={{ boxShadow: "0 8px 40px rgba(0,0,0,0.4)" }}
      data-testid={`card-${card.label.toLowerCase().replace(/\s+/g, "-")}`}
    >
      <div className="absolute inset-0">
        <img
          src={card.image}
          alt=""
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          style={{ filter: "brightness(1.1)" }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-black/30" />
      </div>

      {card.badge && (
        <div className="absolute top-3 right-3 z-20">
          <span className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white rounded-full bg-gradient-to-r from-orange-500 to-rose-500 shadow-lg">
            {card.badge}
          </span>
        </div>
      )}

      <div className="relative z-10 h-full flex flex-col justify-end p-5">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-white/15 to-white/5 border border-white/10 flex items-center justify-center shrink-0 backdrop-blur-sm shadow-lg">
            <span className="text-white">{card.icon}</span>
          </div>
          <div className="min-w-0">
            <h3 className="text-white font-bold text-[15px] leading-tight truncate">{card.label}</h3>
            <p className="text-white/50 text-xs mt-1 truncate">{card.description}</p>
          </div>
        </div>

        <div className="flex items-center gap-1 text-white/30 group-hover:text-cyan-400/70 transition-colors mt-1">
          <span className="text-[10px] uppercase tracking-wider font-medium">Launch</span>
          <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-1" />
        </div>
      </div>

      {card.featured && (
        <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />
      )}
    </motion.div>
  );
}

function CategorySection({ category, catIndex }: { category: Category; catIndex: number }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: catIndex * 0.1, duration: 0.5 }}
      className="mb-16"
    >
      <div className="mb-7 px-1">
        <div className="flex items-center gap-4 mb-3">
          <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${category.gradient} flex items-center justify-center shrink-0 shadow-lg`}>
            <span className="text-white">{category.icon}</span>
          </div>
          <h2 className="text-xl font-bold text-white">{category.title}</h2>
          <span className="text-white/20 text-xs ml-1 bg-white/5 px-2 py-0.5 rounded-full">{category.cards.length} tools</span>
        </div>
        <p className="text-white/40 text-sm leading-relaxed max-w-2xl pl-14">{category.description}</p>
      </div>

      <div className="relative px-1">
        <Carousel
          opts={{ align: "start", dragFree: true, containScroll: "trimSnaps" }}
          className="w-full"
        >
          <CarouselContent className="-ml-5">
            {category.cards.map((card, i) => (
              <CarouselItem key={card.label} className="pl-5 basis-[280px] sm:basis-[310px] md:basis-[340px]">
                <LaunchCardComponent card={card} index={i} />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="hidden md:flex -left-4 w-10 h-10 bg-white/5 border-white/10 text-white hover:bg-white/10 hover:text-white shadow-xl" />
          <CarouselNext className="hidden md:flex -right-4 w-10 h-10 bg-white/5 border-white/10 text-white hover:bg-white/10 hover:text-white shadow-xl" />
        </Carousel>
      </div>
    </motion.section>
  );
}

function SkeletonLoader() {
  return (
    <div className="min-h-screen" style={{ background: "linear-gradient(180deg, #070b16, #0c1222, #070b16)" }}>
      <div className="sticky top-0 z-50 backdrop-blur-xl bg-[#070b16]/80 border-b border-white/5 px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-white/5 animate-pulse" />
          <div className="h-5 w-40 bg-white/5 rounded animate-pulse" />
          <div className="ml-auto h-8 w-20 bg-white/5 rounded-lg animate-pulse" />
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 pt-8 space-y-10">
        {[1, 2, 3].map((s) => (
          <div key={s}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-lg bg-white/5 animate-pulse" />
              <div className="h-5 w-32 bg-white/5 rounded animate-pulse" />
            </div>
            <div className="flex gap-3 overflow-hidden">
              {[1, 2, 3, 4].map((c) => (
                <div key={c} className="min-w-[280px] h-[200px] rounded-2xl bg-white/[0.03] animate-pulse" />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function CommandCenter() {
  const [authed, setAuthed] = useState(() => sessionStorage.getItem("ownerAuth") === "true");
  const [, navigate] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearch, setShowSearch] = useState(false);

  const handleLogout = () => {
    sessionStorage.removeItem("ownerAuth");
    sessionStorage.removeItem("ownerToken");
    setAuthed(false);
  };

  if (!authed) {
    return <PinLogin onSuccess={() => setAuthed(true)} />;
  }

  const filteredCategories = searchQuery.trim()
    ? categories.map(cat => ({
        ...cat,
        cards: cat.cards.filter(card =>
          card.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
          card.description.toLowerCase().includes(searchQuery.toLowerCase())
        )
      })).filter(cat => cat.cards.length > 0)
    : categories;

  const totalTools = categories.reduce((sum, cat) => sum + cat.cards.length, 0);

  return (
    <div className="min-h-screen" style={{ background: "linear-gradient(180deg, #070b16, #0c1222, #070b16)" }}>
      <GlowOrb color="linear-gradient(135deg, #06b6d4, #3b82f6)" size={600} top="-5%" left="60%" />
      <GlowOrb color="linear-gradient(135deg, #8b5cf6, #ec4899)" size={500} top="40%" left="-10%" delay={3} />
      <GlowOrb color="linear-gradient(135deg, #f59e0b, #ef4444)" size={400} top="70%" left="80%" delay={5} />

      <div className="sticky top-0 z-50 backdrop-blur-xl bg-[#070b16]/80 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center gap-3">
          <button
            onClick={() => navigate("/")}
            className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 transition-colors"
            data-testid="button-command-center-back"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <div>
              <h1 className="text-white font-bold text-sm leading-tight">Command Center</h1>
              <p className="text-white/30 text-[10px]">{totalTools} tools across {categories.length} sections</p>
            </div>
          </div>

          <div className="ml-auto flex items-center gap-2">
            <AnimatePresence>
              {showSearch && (
                <motion.div
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: "min(200px, 50vw)", opacity: 1 }}
                  exit={{ width: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search tools..."
                    className="w-full px-3 py-1.5 text-xs bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/30 focus:outline-none focus:border-cyan-500/50"
                    autoFocus
                    data-testid="input-command-center-search"
                  />
                </motion.div>
              )}
            </AnimatePresence>
            <button
              onClick={() => { setShowSearch(!showSearch); if (showSearch) setSearchQuery(""); }}
              className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 transition-colors"
              data-testid="button-command-center-search"
            >
              <Search className="w-4 h-4" />
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white/50 hover:text-red-400 hover:bg-red-500/10 hover:border-red-500/20 transition-all text-xs"
              data-testid="button-command-center-logout"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-8 pb-16 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10 text-center"
        >
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">
            Welcome to{" "}
            <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Mission Control
            </span>
          </h2>
          <p className="text-white/40 text-sm max-w-lg mx-auto">
            Every tool, every feature, every admin control — organized and ready to launch.
          </p>
        </motion.div>

        {filteredCategories.length === 0 ? (
          <div className="text-center py-20">
            <Search className="w-12 h-12 text-white/10 mx-auto mb-4" />
            <p className="text-white/30 text-sm">No tools found matching "{searchQuery}"</p>
            <button
              onClick={() => setSearchQuery("")}
              className="mt-3 text-cyan-400 text-xs hover:underline"
            >
              Clear search
            </button>
          </div>
        ) : (
          filteredCategories.map((category, i) => (
            <CategorySection key={category.title} category={category} catIndex={i} />
          ))
        )}
      </div>
    </div>
  );
}