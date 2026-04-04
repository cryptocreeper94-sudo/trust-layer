import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "wouter";
import {
  BarChart3, Users, Megaphone, Shield, Eye,
  Activity, Zap, DollarSign, Crown, Gamepad2, Globe, Settings,
  Search, ArrowRight, ArrowLeft, Home,
  Code, Server, FileText, MessageSquare,
  Star, Gift, Mail, BookOpen, Coins,
  Building2, ShieldCheck, Bot, Cpu, Map, LineChart,
  LayoutGrid, Swords, Sparkles, Layers, Radio,
  Rocket, Trophy, Network, Boxes,
  ScrollText, HandCoins, Wallet,
  PieChart, Compass, Flame, Landmark,
  CreditCard, TrendingUp, Gem, ChartLine,
  Lock, GraduationCap, Newspaper, Share2,
  Target, Heart, Dice1,
  Palette, Crosshair, Dices, CircleDollarSign,
  ArrowLeftRight, Droplets, ImagePlus, MonitorPlay,
  BrainCircuit, Scan, RefreshCw, Joystick,
  Download, X, Share, Smartphone, ExternalLink, ChevronDown
} from "lucide-react";
import { GenesisHallmarkBadge } from "@/components/genesis-hallmark-badge";

// ── Card accent colors ──
const ACCENT = {
  cyan:     { bg: "bg-cyan-500/10",    border: "border-cyan-500/20",    text: "text-cyan-400",    icon: "from-cyan-500 to-cyan-600",    glow: "shadow-cyan-500/10" },
  teal:     { bg: "bg-teal-500/10",    border: "border-teal-500/20",    text: "text-teal-400",    icon: "from-teal-500 to-teal-600",    glow: "shadow-teal-500/10" },
  purple:   { bg: "bg-purple-500/10",  border: "border-purple-500/20",  text: "text-purple-400",  icon: "from-purple-500 to-purple-600",  glow: "shadow-purple-500/10" },
  violet:   { bg: "bg-violet-500/10",  border: "border-violet-500/20",  text: "text-violet-400",  icon: "from-violet-500 to-violet-600",  glow: "shadow-violet-500/10" },
  blue:     { bg: "bg-blue-500/10",    border: "border-blue-500/20",    text: "text-blue-400",    icon: "from-blue-500 to-blue-600",    glow: "shadow-blue-500/10" },
  indigo:   { bg: "bg-indigo-500/10",  border: "border-indigo-500/20",  text: "text-indigo-400",  icon: "from-indigo-500 to-indigo-600",  glow: "shadow-indigo-500/10" },
  emerald:  { bg: "bg-emerald-500/10", border: "border-emerald-500/20", text: "text-emerald-400", icon: "from-emerald-500 to-emerald-600", glow: "shadow-emerald-500/10" },
  rose:     { bg: "bg-rose-500/10",    border: "border-rose-500/20",    text: "text-rose-400",    icon: "from-rose-500 to-rose-600",    glow: "shadow-rose-500/10" },
  pink:     { bg: "bg-pink-500/10",    border: "border-pink-500/20",    text: "text-pink-400",    icon: "from-pink-500 to-pink-600",    glow: "shadow-pink-500/10" },
  sky:      { bg: "bg-sky-500/10",     border: "border-sky-500/20",     text: "text-sky-400",     icon: "from-sky-500 to-sky-600",     glow: "shadow-sky-500/10" },
  fuchsia:  { bg: "bg-fuchsia-500/10", border: "border-fuchsia-500/20", text: "text-fuchsia-400", icon: "from-fuchsia-500 to-fuchsia-600", glow: "shadow-fuchsia-500/10" },
  lime:     { bg: "bg-lime-500/10",    border: "border-lime-500/20",    text: "text-lime-400",    icon: "from-lime-500 to-lime-600",    glow: "shadow-lime-500/10" },
} as const;

type AccentKey = keyof typeof ACCENT;

interface AppCard {
  label: string;
  desc: string;
  href: string;
  icon: React.ReactNode;
  accent: AccentKey;
  badge?: string;
}

interface Category {
  title: string;
  icon: React.ReactNode;
  gradient: string;
  cards: AppCard[];
}

const categories: Category[] = [
  {
    title: "Home & Overview",
    icon: <Home className="size-4" />,
    gradient: "from-cyan-500 to-teal-500",
    cards: [
      { label: "Trust Layer Hub", desc: "Blockchain ecosystem command center", href: "https://trusthub.tlid.io", icon: <Shield className="size-5" />, accent: "cyan", badge: "Hub" },
      { label: "Presale", desc: "Get SIG at the lowest price", href: "/presale", icon: <Rocket className="size-5" />, accent: "emerald", badge: "Live" },
      { label: "Ecosystem", desc: "Explore all Trust Layer apps", href: "/ecosystem", icon: <Globe className="size-5" />, accent: "indigo" },
      { label: "Dashboard", desc: "Account overview & analytics", href: "/dashboard", icon: <BarChart3 className="size-5" />, accent: "teal" },
      { label: "Trust Book", desc: "Premium ebook publishing", href: "/trust-book", icon: <BookOpen className="size-5" />, accent: "purple", badge: "New" },
      { label: "Our Story", desc: "The Trust Layer origin story", href: "/note", icon: <Heart className="size-5" />, accent: "rose" },
      { label: "Member Portal", desc: "Membership benefits & billing", href: "/member-portal", icon: <Crown className="size-5" />, accent: "violet" },
      { label: "Innovation Hub", desc: "Cutting-edge features & research", href: "/innovation", icon: <Sparkles className="size-5" />, accent: "fuchsia" },
    ]
  },
  {
    title: "DeFi & Trading",
    icon: <TrendingUp className="size-4" />,
    gradient: "from-emerald-500 to-cyan-500",
    cards: [
      { label: "Token Swap", desc: "Swap tokens instantly", href: "/swap", icon: <ArrowLeftRight className="size-5" />, accent: "emerald", badge: "Popular" },
      { label: "Markets", desc: "Live market prices and trends", href: "/markets", icon: <TrendingUp className="size-5" />, accent: "cyan", badge: "Live" },
      { label: "Staking", desc: "Earn rewards by staking SIG", href: "/staking", icon: <Coins className="size-5" />, accent: "purple", badge: "Earn" },
      { label: "Liquidity Pools", desc: "Provide liquidity and earn fees", href: "/liquidity", icon: <Layers className="size-5" />, accent: "indigo" },
      { label: "Cross-Chain Bridge", desc: "Bridge SIG across blockchains", href: "/bridge", icon: <Network className="size-5" />, accent: "violet" },
      { label: "Portfolio", desc: "Track your holdings", href: "/portfolio", icon: <PieChart className="size-5" />, accent: "teal" },
      { label: "Token Launchpad", desc: "Launch new tokens", href: "/launchpad", icon: <Rocket className="size-5" />, accent: "sky" },
      { label: "Copy Trading", desc: "Follow top traders", href: "/copy-trading", icon: <Users className="size-5" />, accent: "lime" },
    ]
  },
  {
    title: "Wallet & Assets",
    icon: <Wallet className="size-4" />,
    gradient: "from-violet-500 to-purple-500",
    cards: [
      { label: "My Wallet", desc: "Manage your crypto wallet", href: "/wallet", icon: <Wallet className="size-5" />, accent: "violet" },
      { label: "My Tokens", desc: "View all your token holdings", href: "/my-tokens", icon: <Coins className="size-5" />, accent: "purple" },
      { label: "NFT Marketplace", desc: "Buy, sell, and trade NFTs", href: "/nft", icon: <Gem className="size-5" />, accent: "fuchsia", badge: "New" },
      { label: "NFT Creator", desc: "Create your own NFTs with AI", href: "/nft-creator", icon: <Palette className="size-5" />, accent: "rose" },
      { label: "Claim Airdrop", desc: "Claim your Signal airdrop", href: "/airdrop", icon: <Sparkles className="size-5" />, accent: "teal", badge: "Claim" },
      { label: "Coin Store", desc: "Purchase Shells and tokens", href: "/coin-store", icon: <CreditCard className="size-5" />, accent: "emerald" },
    ]
  },
  {
    title: "AI & Intelligence",
    icon: <BrainCircuit className="size-4" />,
    gradient: "from-cyan-500 to-blue-500",
    cards: [
      { label: "Guardian Scanner", desc: "AI token security analysis", href: "/guardian-scanner", icon: <Scan className="size-5" />, accent: "cyan", badge: "AI" },
      { label: "TrustGen", desc: "AI-powered 3D creation studio", href: "https://trustgen.design", icon: <Palette className="size-5" />, accent: "purple", badge: "Live" },
      { label: "Strike Agent", desc: "AI trading signals", href: "/strike-agent", icon: <Crosshair className="size-5" />, accent: "rose" },
      { label: "AI Advisor", desc: "Your personal AI assistant", href: "/ai-advisor", icon: <BrainCircuit className="size-5" />, accent: "blue" },
      { label: "Pulse", desc: "AI market sentiment tracker", href: "/pulse", icon: <Activity className="size-5" />, accent: "emerald", badge: "Live" },
      { label: "AI Agent Marketplace", desc: "Browse AI agents", href: "/ai-agents", icon: <Bot className="size-5" />, accent: "violet", badge: "New" },
      { label: "TradeWorks AI", desc: "Field toolkit for home services", href: "https://tradeworksai.io", icon: <BrainCircuit className="size-5" />, accent: "teal", badge: "Live" },
    ]
  },
  {
    title: "Games & Entertainment",
    icon: <Gamepad2 className="size-4" />,
    gradient: "from-pink-500 to-purple-500",
    cards: [
      { label: "Chronicles", desc: "Parallel life simulation game", href: "/chronicles", icon: <Swords className="size-5" />, accent: "pink", badge: "Play" },
      { label: "Crash", desc: "Multiplier crash game", href: "/crash", icon: <Rocket className="size-5" />, accent: "rose", badge: "Hot" },
      { label: "Arcade", desc: "Galaga, Snake, Tetris & more", href: "/arcade", icon: <Joystick className="size-5" />, accent: "purple" },
      { label: "Slots", desc: "Classic slot machine", href: "/slots", icon: <Dices className="size-5" />, accent: "fuchsia" },
      { label: "Daily Bonus", desc: "Claim your daily reward", href: "/daily-bonus", icon: <Gift className="size-5" />, accent: "emerald", badge: "Daily" },
      { label: "Leaderboard", desc: "See top players", href: "/leaderboard", icon: <Trophy className="size-5" />, accent: "cyan" },
    ]
  },
  {
    title: "Earn & Rewards",
    icon: <Gift className="size-4" />,
    gradient: "from-teal-500 to-cyan-500",
    cards: [
      { label: "Referral Program", desc: "Earn by inviting friends", href: "/referral-program", icon: <Share2 className="size-5" />, accent: "cyan", badge: "Earn" },
      { label: "Quests", desc: "Complete quests for rewards", href: "/quests", icon: <Compass className="size-5" />, accent: "lime" },
      { label: "Founder Program", desc: "Exclusive founder benefits", href: "/founder-program", icon: <Crown className="size-5" />, accent: "purple" },
      { label: "My Rewards", desc: "Track your earnings", href: "/rewards", icon: <Star className="size-5" />, accent: "teal" },
      { label: "Crowdfund", desc: "Support Trust Layer development", href: "/crowdfund", icon: <Heart className="size-5" />, accent: "rose" },
    ]
  },
  {
    title: "Community & Social",
    icon: <Users className="size-4" />,
    gradient: "from-blue-500 to-indigo-500",
    cards: [
      { label: "Signal Chat", desc: "Community messaging platform", href: "/signal-chat", icon: <MessageSquare className="size-5" />, accent: "blue" },
      { label: "Community Hub", desc: "Central community space", href: "/community", icon: <Users className="size-5" />, accent: "violet" },
      { label: "Social Feed", desc: "Latest community updates", href: "/social", icon: <Share2 className="size-5" />, accent: "sky" },
      { label: "Blog", desc: "News and articles", href: "/blog", icon: <Newspaper className="size-5" />, accent: "rose" },
      { label: "Creators", desc: "Creator community portal", href: "/creators", icon: <Palette className="size-5" />, accent: "pink" },
      { label: "Team", desc: "Meet the team", href: "/team", icon: <Users className="size-5" />, accent: "teal" },
    ]
  },
  {
    title: "Security & Guardian",
    icon: <ShieldCheck className="size-4" />,
    gradient: "from-rose-500 to-cyan-500",
    cards: [
      { label: "Guardian Shield", desc: "Continuous security monitoring", href: "/guardian-shield", icon: <Shield className="size-5" />, accent: "cyan" },
      { label: "Trust Shield Cockpit", desc: "Security & certification hub", href: "/trust-shield", icon: <ShieldCheck className="size-5" />, accent: "rose" },
      { label: "Proof of Reserve", desc: "On-chain reserve verification", href: "/proof-of-reserve", icon: <Lock className="size-5" />, accent: "emerald" },
      { label: "Security Center", desc: "Account security settings", href: "/security", icon: <Shield className="size-5" />, accent: "teal" },
      { label: "Guardian Whitepaper", desc: "Security framework whitepaper", href: "/guardian-whitepaper", icon: <FileText className="size-5" />, accent: "indigo" },
    ]
  },
  {
    title: "Blockchain & Network",
    icon: <Network className="size-4" />,
    gradient: "from-cyan-500 to-teal-500",
    cards: [
      { label: "Block Explorer", desc: "Browse blocks and transactions", href: "/explorer", icon: <Boxes className="size-5" />, accent: "cyan" },
      { label: "Validators", desc: "View active validators", href: "/validators", icon: <Server className="size-5" />, accent: "teal" },
      { label: "Network Stats", desc: "Live network performance", href: "/network", icon: <Activity className="size-5" />, accent: "blue", badge: "Live" },
      { label: "TLID Domains", desc: ".tlid blockchain domains", href: "/domains", icon: <Globe className="size-5" />, accent: "indigo" },
      { label: "Governance", desc: "Vote on proposals", href: "/governance", icon: <Landmark className="size-5" />, accent: "purple" },
      { label: "Testnet Faucet", desc: "Get free testnet tokens", href: "/faucet", icon: <Droplets className="size-5" />, accent: "emerald" },
    ]
  },
  {
    title: "Learn & Explore",
    icon: <GraduationCap className="size-4" />,
    gradient: "from-indigo-500 to-violet-500",
    cards: [
      { label: "Documentation", desc: "Technical documentation", href: "/doc-hub", icon: <BookOpen className="size-5" />, accent: "blue" },
      { label: "Tokenomics", desc: "Signal token economics", href: "/tokenomics", icon: <PieChart className="size-5" />, accent: "violet" },
      { label: "API Docs", desc: "Developer API reference", href: "/api-docs", icon: <Code className="size-5" />, accent: "emerald" },
      { label: "Roadmap", desc: "Development timeline", href: "/roadmap", icon: <Target className="size-5" />, accent: "cyan" },
      { label: "Philosophy", desc: "Our vision and values", href: "/philosophy", icon: <Compass className="size-5" />, accent: "pink" },
      { label: "Learn Center", desc: "Academy courses", href: "/learn", icon: <GraduationCap className="size-5" />, accent: "purple" },
      { label: "FAQ", desc: "Frequently asked questions", href: "/faq", icon: <MessageSquare className="size-5" />, accent: "teal" },
    ]
  },
];

// ── Badge colors based on type ──
const BADGE_STYLES: Record<string, string> = {
  Hub:     "bg-cyan-500/20 text-cyan-300 border-cyan-500/30",
  Live:    "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
  New:     "bg-purple-500/20 text-purple-300 border-purple-500/30",
  Popular: "bg-teal-500/20 text-teal-300 border-teal-500/30",
  Earn:    "bg-lime-500/20 text-lime-300 border-lime-500/30",
  Play:    "bg-pink-500/20 text-pink-300 border-pink-500/30",
  Hot:     "bg-rose-500/20 text-rose-300 border-rose-500/30",
  Claim:   "bg-sky-500/20 text-sky-300 border-sky-500/30",
  Daily:   "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
  AI:      "bg-cyan-500/20 text-cyan-300 border-cyan-500/30",
};

// ── Compact Card Component ──
function CompactCard({ card, index }: { card: AppCard; index: number }) {
  const [, navigate] = useLocation();
  const a = ACCENT[card.accent];

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.02, duration: 0.3 }}
      onClick={() => card.href.startsWith("http") ? window.open(card.href, "_blank", "noopener,noreferrer") : navigate(card.href)}
      className={`group relative flex items-center gap-3 px-3.5 py-3 rounded-xl border ${a.border} bg-white/[0.02] backdrop-blur-sm cursor-pointer transition-all duration-200 hover:bg-white/[0.05] hover:border-white/15 hover:shadow-lg ${a.glow}`}
      data-testid={`hub-card-${card.label.toLowerCase().replace(/\s+/g, "-")}`}
    >
      {/* Icon */}
      <div className={`w-9 h-9 rounded-lg bg-gradient-to-br ${a.icon} flex items-center justify-center shrink-0 shadow-md`}>
        <span className="text-white">{card.icon}</span>
      </div>

      {/* Text */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h3 className="text-[13px] font-semibold text-white truncate">{card.label}</h3>
          {card.badge && (
            <span className={`shrink-0 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider rounded-md border ${BADGE_STYLES[card.badge] || "bg-white/10 text-white/60 border-white/10"}`}>
              {card.badge}
            </span>
          )}
        </div>
        <p className="text-[11px] text-white/45 truncate mt-0.5">{card.desc}</p>
      </div>

      {/* Arrow */}
      <ArrowRight className="w-3.5 h-3.5 text-white/15 group-hover:text-white/40 transition-all shrink-0 group-hover:translate-x-0.5" />

      {/* External indicator */}
      {card.href.startsWith("http") && (
        <ExternalLink className="w-3 h-3 text-white/10 absolute top-2 right-2" />
      )}
    </motion.div>
  );
}

// ── Category Section ──
function CategorySection({ category, catIndex, defaultOpen }: { category: Category; catIndex: number; defaultOpen: boolean }) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <motion.section
      id={`category-${catIndex}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: catIndex * 0.05, duration: 0.4 }}
      className="mb-6 scroll-mt-28"
    >
      {/* Category Header */}
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-3 mb-3 px-1 group"
        data-testid={`category-toggle-${catIndex}`}
      >
        <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${category.gradient} flex items-center justify-center shrink-0 shadow-md`}>
          <span className="text-white">{category.icon}</span>
        </div>
        <h2 className="text-sm font-bold text-white">{category.title}</h2>
        <span className="text-white/20 text-[10px] bg-white/5 px-1.5 py-0.5 rounded-full">{category.cards.length}</span>
        <div className="flex-1" />
        <ChevronDown className={`w-4 h-4 text-white/20 transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
      </button>

      {/* Cards Grid */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 pl-11">
              {category.cards.map((card, i) => (
                <CompactCard key={card.label} card={card} index={i} />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.section>
  );
}

// ── PWA Install Banner ──
interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

function PWAInstallBanner() {
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [dismissed, setDismissed] = useState(false);
  const [installed, setInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    const standalone = window.matchMedia('(display-mode: standalone)').matches || (navigator as any).standalone === true;
    setIsStandalone(standalone);
    const ios = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    setIsIOS(ios);
    const wasDismissed = sessionStorage.getItem('pwa-banner-dismissed');
    if (wasDismissed) setDismissed(true);

    const handler = (e: Event) => { e.preventDefault(); setInstallPrompt(e as BeforeInstallPromptEvent); };
    window.addEventListener('beforeinstallprompt', handler);
    window.addEventListener('appinstalled', () => { setInstalled(true); setInstallPrompt(null); });
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (!installPrompt) return;
    await installPrompt.prompt();
    const result = await installPrompt.userChoice;
    if (result.outcome === 'accepted') setInstalled(true);
    setInstallPrompt(null);
  };

  const handleDismiss = () => { setDismissed(true); sessionStorage.setItem('pwa-banner-dismissed', '1'); };

  if (isStandalone || installed || dismissed) return null;
  if (!installPrompt && !isIOS) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -10, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -10, scale: 0.98 }}
        className="relative overflow-hidden rounded-xl border border-cyan-500/20 mb-8"
        style={{ background: "linear-gradient(135deg, rgba(6,182,212,0.06), rgba(139,92,246,0.06))" }}
        data-testid="banner-pwa-install"
      >
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-500/40 to-transparent" />
        <button onClick={handleDismiss} className="absolute top-2.5 right-2.5 z-20 w-6 h-6 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:text-white/70 transition-all" data-testid="button-pwa-dismiss">
          <X className="w-3 h-3" />
        </button>
        <div className="relative z-10 p-4 flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center shrink-0 shadow-lg shadow-cyan-500/20">
            <Smartphone className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-white font-bold text-sm">Install Trust Layer</h3>
            <p className="text-white/45 text-xs truncate">
              {isIOS ? "Tap Share → Add to Home Screen" : "Get the full app experience on your device"}
            </p>
          </div>
          {installPrompt ? (
            <button onClick={handleInstall} className="shrink-0 px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-bold text-xs flex items-center gap-1.5 hover:shadow-lg transition-all" data-testid="button-pwa-install">
              <Download className="w-3.5 h-3.5" /> Install
            </button>
          ) : isIOS ? (
            <div className="shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white/60 text-xs font-medium">
              <Share className="w-3.5 h-3.5" /> Share → Add
            </div>
          ) : null}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

// ── Main Page ──
export default function ExploreHub() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredCategories = searchQuery.trim()
    ? categories.map(cat => ({
        ...cat,
        cards: cat.cards.filter(card =>
          card.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
          card.desc.toLowerCase().includes(searchQuery.toLowerCase())
        )
      })).filter(cat => cat.cards.length > 0)
    : categories;

  const totalFeatures = categories.reduce((sum, cat) => sum + cat.cards.length, 0);

  return (
    <div className="min-h-screen pt-20 pb-12 relative" style={{ background: "linear-gradient(180deg, #06060a, #0a0a14, #06060a)" }}>
      {/* Ambient orbs */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full bg-cyan-500/[0.03] blur-[120px] pointer-events-none" />
      <div className="absolute top-1/3 left-0 w-[400px] h-[400px] rounded-full bg-purple-500/[0.03] blur-[100px] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6 text-center">
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
            Explore{" "}
            <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Trust Layer
            </span>
          </h1>
          <p className="text-white/35 text-xs">
            {totalFeatures} features across {categories.length} categories
          </p>
        </motion.div>

        {/* Search */}
        <div className="max-w-sm mx-auto mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/25" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search features..."
              className="w-full pl-9 pr-4 py-2 text-xs bg-white/[0.04] border border-white/[0.08] rounded-lg text-white placeholder-white/25 focus:outline-none focus:border-cyan-500/40 backdrop-blur-sm"
              data-testid="input-explore-hub-search"
            />
          </div>
        </div>

        <PWAInstallBanner />



        {/* Category Jump Links */}
        <div className="sticky top-20 z-40 -mx-4 px-4 sm:mx-0 sm:px-0 mb-6 overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
          <div className="flex items-center gap-1.5 pb-2 min-w-max">
            {categories.map((cat, i) => (
              <button
                key={cat.title}
                onClick={() => {
                  const el = document.getElementById(`category-${i}`);
                  if (el) {
                    const y = el.getBoundingClientRect().top + window.scrollY - 100;
                    window.scrollTo({ top: y, behavior: "smooth" });
                  }
                }}
                className="whitespace-nowrap px-3 py-1.5 rounded-lg border border-white/5 bg-black/50 text-white/50 text-[11px] font-medium hover:bg-white/[0.06] hover:border-cyan-500/20 hover:text-white/80 transition-all backdrop-blur-xl"
              >
                <div className="flex items-center gap-1.5">
                  <span className={`flex items-center justify-center w-4 h-4 rounded bg-gradient-to-br ${cat.gradient}`}>
                    <div className="scale-[0.6] text-white">{cat.icon}</div>
                  </span>
                  {cat.title}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Categories */}
        {filteredCategories.length === 0 ? (
          <div className="text-center py-16">
            <Search className="w-10 h-10 text-white/10 mx-auto mb-3" />
            <p className="text-white/30 text-sm">No features found matching "{searchQuery}"</p>
            <button onClick={() => setSearchQuery("")} className="mt-2 text-cyan-400 text-xs hover:underline" data-testid="button-explore-hub-clear-search">
              Clear search
            </button>
          </div>
        ) : (
          filteredCategories.map((category, i) => (
            <CategorySection key={category.title} category={category} catIndex={i} defaultOpen={!searchQuery && i < 4} />
          ))
        )}

        <div className="flex justify-center mt-8 mb-4">
          <GenesisHallmarkBadge />
        </div>
      </div>
    </div>
  );
}