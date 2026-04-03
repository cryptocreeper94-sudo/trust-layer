import { useState, useEffect, useRef } from "react";
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
  Download, X, Share, Smartphone
} from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import { EcosystemDirectory } from "@/components/ecosystem-directory";
import { GenesisHallmarkBadge } from "@/components/genesis-hallmark-badge";
import { KenBurnsBackground } from "@/components/ken-burns-background";

import hubTrading from "@/assets/generated_images/hub_trading_defi.jpg";
import hubWallet from "@/assets/generated_images/hub_wallet_tokens.jpg";
import hubChronicles from "@/assets/generated_images/hub_chronicles_game.jpg";
import hubCommunity from "@/assets/generated_images/hub_community_social.jpg";
import hubIdentity from "@/assets/generated_images/hub_identity_security.jpg";
import hubAI from "@/assets/generated_images/hub_ai_tools.jpg";
import hubLearn from "@/assets/generated_images/hub_learn_explore.jpg";
import hubEarn from "@/assets/generated_images/hub_earn_rewards.jpg";
import ccGames from "@/assets/generated_images/cc_games_arcade.jpg";
import ccBlockchain from "@/assets/generated_images/cc_blockchain_network.jpg";
import ccDeveloper from "@/assets/generated_images/cc_developer_tools.jpg";
import ccSettings from "@/assets/generated_images/cc_settings_config.jpg";
import ccAnalytics from "@/assets/generated_images/cc_analytics_dashboard.jpg";
import ccUsers from "@/assets/generated_images/cc_users_community.jpg";
import ccMarketing from "@/assets/generated_images/cc_marketing_content.jpg";
import ccSecurity from "@/assets/generated_images/cc_security_shield.jpg";
import ccFinance from "@/assets/generated_images/cc_finance_tokens.jpg";
import ccRewards from "@/assets/generated_images/cc_rewards_treasure.jpg";
import hubHome from "@/assets/generated_images/hub_home_overview.jpg";
import hubPresale from "@/assets/generated_images/hub_presale_launch.jpg";
import hubEcosystem from "@/assets/generated_images/hub_ecosystem_globe.jpg";
import hubGamesCombat from "@/assets/generated_images/hub_games_combat.jpg";
import hubReferral from "@/assets/generated_images/hub_referral_network.jpg";
import hubNft from "@/assets/generated_images/hub_nft_gallery.jpg";
import hubGovernance from "@/assets/generated_images/hub_governance_vote.jpg";
import hubExplorer from "@/assets/generated_images/hub_explorer_blocks.jpg";
import hubChat from "@/assets/generated_images/hub_chat_messaging.jpg";
import hubMembership from "@/assets/generated_images/hub_membership_vip.jpg";
import hubSlots from "@/assets/generated_images/hub_slots_casino.jpg";
import hubLiquidity from "@/assets/generated_images/hub_liquidity_pool.jpg";
import hubBridge from "@/assets/generated_images/hub_bridge_chains.jpg";
import hubStaking from "@/assets/generated_images/hub_staking_vault.jpg";
import hubRetro from "@/assets/generated_images/hub_retro_space.jpg";
import hubDice from "@/assets/generated_images/hub_dice_chance.jpg";
import hubPortfolio from "@/assets/generated_images/hub_portfolio_chart.jpg";
import hubSmartContract from "@/assets/generated_images/hub_smart_contract.jpg";
import hubQuest from "@/assets/generated_images/hub_quest_compass.jpg";
import hubGuardian from "@/assets/generated_images/hub_guardian_sentinel.jpg";

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
    title: "Home & Overview",
    icon: <Home className="size-4" />,
    gradient: "from-slate-400 to-cyan-500",
    description: "Your dashboard, presale, ecosystem overview, membership, and account management — all in one place.",
    cards: [
      { label: "Trust Layer Hub", description: "Your blockchain ecosystem command center", href: "https://trusthub.tlid.io", icon: <Shield className="size-5" />, image: hubIdentity, glowColor: "shadow-cyan-500/30", badge: "Hub", featured: true },
      { label: "Presale", description: "Get SIG at the lowest price", href: "/presale", icon: <Rocket className="size-5" />, image: hubPresale, glowColor: "shadow-teal-500/30", badge: "Live" },
      { label: "Ecosystem", description: "Explore all Trust Layer apps", href: "/ecosystem", icon: <Globe className="size-5" />, image: hubEcosystem, glowColor: "shadow-indigo-500/30" },
      { label: "Dashboard", description: "Account overview & analytics", href: "/dashboard", icon: <BarChart3 className="size-5" />, image: ccAnalytics, glowColor: "shadow-teal-500/30" },
      { label: "Trust Book", description: "Premium ebook publishing platform", href: "/trust-book", icon: <BookOpen className="size-5" />, image: hubLearn, glowColor: "shadow-cyan-500/30", badge: "New" },
      { label: "Our Story", description: "The Trust Layer origin story", href: "/note", icon: <Heart className="size-5" />, image: hubCommunity, glowColor: "shadow-rose-500/30" },
      { label: "Member Portal", description: "Membership benefits & billing", href: "/member-portal", icon: <Crown className="size-5" />, image: hubMembership, glowColor: "shadow-purple-500/30" },
      { label: "Innovation Hub", description: "Cutting-edge features & research", href: "/innovation", icon: <Sparkles className="size-5" />, image: hubEarn, glowColor: "shadow-pink-500/30" },
    ]
  },
  {
    title: "DeFi & Trading",
    icon: <TrendingUp className="size-4" />,
    gradient: "from-emerald-500 to-cyan-500",
    description: "Trade tokens, provide liquidity, stake SIG, bridge assets, and track your portfolio.",
    cards: [
      { label: "Token Swap", description: "Swap tokens instantly", href: "/swap", icon: <ArrowLeftRight className="size-5" />, image: hubTrading, glowColor: "shadow-emerald-500/30", badge: "Popular" },
      { label: "Markets", description: "Live market prices and trends", href: "/markets", icon: <TrendingUp className="size-5" />, image: hubPortfolio, glowColor: "shadow-cyan-500/30", badge: "Live" },
      { label: "Staking", description: "Earn rewards by staking SIG", href: "/staking", icon: <Coins className="size-5" />, image: hubStaking, glowColor: "shadow-purple-500/30", badge: "Earn" },
      { label: "Liquidity Pools", description: "Provide liquidity and earn fees", href: "/liquidity", icon: <Layers className="size-5" />, image: hubLiquidity, glowColor: "shadow-indigo-500/30" },
      { label: "Cross-Chain Bridge", description: "Bridge SIG across blockchains", href: "/bridge", icon: <Network className="size-5" />, image: hubBridge, glowColor: "shadow-purple-500/30" },
      { label: "Portfolio", description: "Track your holdings", href: "/portfolio", icon: <PieChart className="size-5" />, image: hubWallet, glowColor: "shadow-teal-500/30" },
      { label: "Token Launchpad", description: "Launch new tokens", href: "/launchpad", icon: <Rocket className="size-5" />, image: ccBlockchain, glowColor: "shadow-cyan-500/30" },
      { label: "Copy Trading", description: "Follow top traders automatically", href: "/copy-trading", icon: <Users className="size-5" />, image: ccDeveloper, glowColor: "shadow-lime-500/30" },
    ]
  },
  {
    title: "Wallet & Assets",
    icon: <Wallet className="size-4" />,
    gradient: "from-violet-500 to-purple-500",
    description: "Manage your wallet, NFTs, airdrops, and multi-signature wallets.",
    cards: [
      { label: "My Wallet", description: "Manage your crypto wallet", href: "/wallet", icon: <Wallet className="size-5" />, image: ccFinance, glowColor: "shadow-violet-500/30" },
      { label: "My Tokens", description: "View all your token holdings", href: "/my-tokens", icon: <Coins className="size-5" />, image: hubHome, glowColor: "shadow-purple-500/30" },
      { label: "NFT Marketplace", description: "Buy, sell, and trade NFTs", href: "/nft", icon: <Gem className="size-5" />, image: hubNft, glowColor: "shadow-fuchsia-500/30", badge: "New" },
      { label: "NFT Creator", description: "Create your own NFTs with AI", href: "/nft-creator", icon: <Palette className="size-5" />, image: ccMarketing, glowColor: "shadow-rose-500/30" },
      { label: "Claim Airdrop", description: "Claim your Signal airdrop", href: "/airdrop", icon: <Sparkles className="size-5" />, image: ccRewards, glowColor: "shadow-teal-500/30", badge: "Claim" },
      { label: "Coin Store", description: "Purchase Shells and tokens", href: "/coin-store", icon: <CreditCard className="size-5" />, image: hubSlots, glowColor: "shadow-emerald-500/30" },
    ]
  },
  {
    title: "AI & Intelligence",
    icon: <BrainCircuit className="size-4" />,
    gradient: "from-cyan-500 to-blue-500",
    description: "AI-powered tools: market analysis, token scanning, trading signals, and your personal AI advisor.",
    cards: [
      { label: "Guardian Scanner", description: "AI token security analysis", href: "/guardian-scanner", icon: <Scan className="size-5" />, image: hubGuardian, glowColor: "shadow-cyan-500/30", badge: "AI", featured: true },
      { label: "TrustGen", description: "AI-powered 3D creation & code studio", href: "https://trustgen.design", icon: <Palette className="size-5" />, image: hubAI, glowColor: "shadow-purple-500/30", badge: "Live" },
      { label: "Strike Agent", description: "AI trading signals", href: "/strike-agent", icon: <Crosshair className="size-5" />, image: hubSmartContract, glowColor: "shadow-red-500/30" },
      { label: "AI Advisor", description: "Your personal AI assistant", href: "/ai-advisor", icon: <BrainCircuit className="size-5" />, image: ccSettings, glowColor: "shadow-blue-500/30" },
      { label: "Pulse", description: "AI market sentiment tracker", href: "/pulse", icon: <Activity className="size-5" />, image: hubExplorer, glowColor: "shadow-emerald-500/30", badge: "Live" },
      { label: "AI Agent Marketplace", description: "Browse AI agents", href: "/ai-agents", icon: <Bot className="size-5" />, image: ccSecurity, glowColor: "shadow-purple-500/30", badge: "New" },
      { label: "TradeWorks AI", description: "Professional field toolkit for home services", href: "https://tradeworksai.io", icon: <BrainCircuit className="size-5" />, image: hubReferral, glowColor: "shadow-cyan-500/30", badge: "Live" },
    ]
  },
  {
    title: "Games & Entertainment",
    icon: <Gamepad2 className="size-4" />,
    gradient: "from-pink-500 to-purple-500",
    description: "Chronicles life simulation, arcade classics, sweepstakes, and daily rewards.",
    cards: [
      { label: "Chronicles", description: "Parallel life simulation game", href: "/chronicles", icon: <Swords className="size-5" />, image: hubChronicles, glowColor: "shadow-pink-500/30", badge: "Play" },
      { label: "Crash", description: "Multiplier crash game", href: "/crash", icon: <Rocket className="size-5" />, image: hubGamesCombat, glowColor: "shadow-rose-500/30", badge: "Hot" },
      { label: "Arcade", description: "Galaga, Snake, Tetris & more", href: "/arcade", icon: <Joystick className="size-5" />, image: ccGames, glowColor: "shadow-purple-500/30" },
      { label: "Slots", description: "Classic slot machine", href: "/slots", icon: <Dices className="size-5" />, image: hubDice, glowColor: "shadow-purple-500/30" },
      { label: "Daily Bonus", description: "Claim your daily reward", href: "/daily-bonus", icon: <Gift className="size-5" />, image: hubRetro, glowColor: "shadow-emerald-500/30", badge: "Daily" },
      { label: "Leaderboard", description: "See top players", href: "/leaderboard", icon: <Trophy className="size-5" />, image: hubQuest, glowColor: "shadow-cyan-500/30" },
    ]
  },
  {
    title: "Earn & Rewards",
    icon: <Gift className="size-4" />,
    gradient: "from-teal-500 to-cyan-500",
    description: "Earn Signal through referrals, quests, staking, and community engagement.",
    cards: [
      { label: "Referral Program", description: "Earn by inviting friends", href: "/referral-program", icon: <Share2 className="size-5" />, image: hubGovernance, glowColor: "shadow-cyan-500/30", badge: "Earn" },
      { label: "Quests", description: "Complete quests for rewards", href: "/quests", icon: <Compass className="size-5" />, image: hubChat, glowColor: "shadow-lime-500/30" },
      { label: "Founder Program", description: "Exclusive founder benefits", href: "/founder-program", icon: <Crown className="size-5" />, image: ccUsers, glowColor: "shadow-purple-500/30" },
      { label: "My Rewards", description: "Track your earnings", href: "/rewards", icon: <Star className="size-5" />, image: hubRetro, glowColor: "shadow-teal-400/30" },
      { label: "Crowdfund", description: "Support Trust Layer development", href: "/crowdfund", icon: <Heart className="size-5" />, image: hubDice, glowColor: "shadow-rose-500/30" },
    ]
  },
  {
    title: "Community & Social",
    icon: <Users className="size-4" />,
    gradient: "from-blue-500 to-indigo-500",
    description: "Connect through Signal Chat, social feeds, team pages, and partnership programs.",
    cards: [
      { label: "Signal Chat", description: "Community messaging platform", href: "/signal-chat", icon: <MessageSquare className="size-5" />, image: hubChat, glowColor: "shadow-blue-500/30" },
      { label: "Community Hub", description: "Central community space", href: "/community", icon: <Users className="size-5" />, image: ccUsers, glowColor: "shadow-violet-500/30" },
      { label: "Social Feed", description: "Latest community updates", href: "/social", icon: <Share2 className="size-5" />, image: hubSlots, glowColor: "shadow-sky-500/30" },
      { label: "Blog", description: "News and articles", href: "/blog", icon: <Newspaper className="size-5" />, image: hubExplorer, glowColor: "shadow-rose-500/30" },
      { label: "Creators", description: "Creator community portal", href: "/creators", icon: <Palette className="size-5" />, image: hubNft, glowColor: "shadow-pink-500/30" },
      { label: "Team", description: "Meet the team", href: "/team", icon: <Users className="size-5" />, image: ccMarketing, glowColor: "shadow-teal-500/30" },
    ]
  },
  {
    title: "Security & Guardian",
    icon: <ShieldCheck className="size-4" />,
    gradient: "from-red-500 to-cyan-500",
    description: "Security certifications, token audits, AI agent verification, and trust infrastructure.",
    cards: [
      { label: "Guardian Shield", description: "Continuous security monitoring", href: "/guardian-shield", icon: <Shield className="size-5" />, image: ccSecurity, glowColor: "shadow-cyan-500/30" },
      { label: "Trust Shield Cockpit", description: "Security & certification hub", href: "/trust-shield", icon: <ShieldCheck className="size-5" />, image: hubGuardian, glowColor: "shadow-red-400/30" },
      { label: "Proof of Reserve", description: "On-chain reserve verification", href: "/proof-of-reserve", icon: <Lock className="size-5" />, image: hubSmartContract, glowColor: "shadow-emerald-500/30" },
      { label: "Security Center", description: "Account security settings", href: "/security", icon: <Shield className="size-5" />, image: hubIdentity, glowColor: "shadow-teal-500/30" },
      { label: "Guardian Whitepaper", description: "Security framework whitepaper", href: "/guardian-whitepaper", icon: <FileText className="size-5" />, image: ccDeveloper, glowColor: "shadow-indigo-500/30" },
    ]
  },
  {
    title: "Blockchain & Network",
    icon: <Network className="size-4" />,
    gradient: "from-cyan-500 to-teal-500",
    description: "Block explorer, validators, network stats, faucet, domains, and governance.",
    cards: [
      { label: "Block Explorer", description: "Browse blocks and transactions", href: "/explorer", icon: <Boxes className="size-5" />, image: ccBlockchain, glowColor: "shadow-cyan-500/30" },
      { label: "Validators", description: "View active validators", href: "/validators", icon: <Server className="size-5" />, image: hubLiquidity, glowColor: "shadow-teal-500/30" },
      { label: "Network Stats", description: "Live network performance", href: "/network", icon: <Activity className="size-5" />, image: ccAnalytics, glowColor: "shadow-blue-500/30", badge: "Live" },
      { label: "TLID Domains", description: ".tlid blockchain domains", href: "/domains", icon: <Globe className="size-5" />, image: hubEcosystem, glowColor: "shadow-indigo-500/30" },
      { label: "Governance", description: "Vote on proposals", href: "/governance", icon: <Landmark className="size-5" />, image: hubGovernance, glowColor: "shadow-purple-500/30" },
      { label: "Testnet Faucet", description: "Get free testnet tokens", href: "/faucet", icon: <Droplets className="size-5" />, image: hubBridge, glowColor: "shadow-emerald-500/30" },
    ]
  },
  {
    title: "Learn & Explore",
    icon: <GraduationCap className="size-4" />,
    gradient: "from-indigo-500 to-violet-500",
    description: "Documentation, tokenomics, API reference, roadmap, and the philosophy behind Trust Layer.",
    cards: [
      { label: "Documentation", description: "Technical documentation", href: "/doc-hub", icon: <BookOpen className="size-5" />, image: ccDeveloper, glowColor: "shadow-blue-500/30" },
      { label: "Tokenomics", description: "Signal token economics", href: "/tokenomics", icon: <PieChart className="size-5" />, image: hubPortfolio, glowColor: "shadow-violet-500/30" },
      { label: "API Docs", description: "Developer API reference", href: "/api-docs", icon: <Code className="size-5" />, image: hubAI, glowColor: "shadow-emerald-500/30" },
      { label: "Roadmap", description: "Development timeline", href: "/roadmap", icon: <Target className="size-5" />, image: hubTrading, glowColor: "shadow-cyan-500/30" },
      { label: "Philosophy", description: "Our vision and values", href: "/philosophy", icon: <Compass className="size-5" />, image: hubQuest, glowColor: "shadow-pink-500/30" },
      { label: "Learn Center", description: "Academy courses", href: "/learn", icon: <GraduationCap className="size-5" />, image: hubLearn, glowColor: "shadow-purple-500/30" },
      { label: "FAQ", description: "Frequently asked questions", href: "/faq", icon: <MessageSquare className="size-5" />, image: hubCommunity, glowColor: "shadow-slate-400/30" },
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

function LaunchCardComponent({ card, index }: { card: LaunchCard; index: number }) {
  const [, navigate] = useLocation();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04, duration: 0.4 }}
      onClick={() => card.href.startsWith("http") ? window.open(card.href, "_blank", "noopener,noreferrer") : navigate(card.href)}
      className={`group relative overflow-hidden rounded-2xl border border-white/5 cursor-pointer transition-all duration-300 hover:scale-[1.03] hover:border-white/15 min-h-[240px]`}
      style={{ boxShadow: "0 8px 40px rgba(0,0,0,0.4)" }}
      data-testid={`hub-card-${card.label.toLowerCase().replace(/\s+/g, "-")}`}
    >
      <div className="absolute inset-0">
        <img
          src={card.image}
          alt=""
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          style={{ filter: "brightness(1.1)" }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/60 to-black/20" />
      </div>

      {card.badge && (
        <div className="absolute top-3 right-3 z-20">
          <span className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white rounded-full bg-gradient-to-r from-cyan-500 to-rose-500 shadow-lg max-w-[100px] truncate inline-block">
            {card.badge}
          </span>
        </div>
      )}

      <div className="relative z-30 h-full flex flex-col justify-end p-5 pt-12">
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
          <span className="text-[10px] uppercase tracking-wider font-medium">Open</span>
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
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!api) return;
    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap());
    api.on("select", () => setCurrent(api.selectedScrollSnap()));
  }, [api]);

  return (
    <motion.section
      id={`category-${catIndex}`}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: catIndex * 0.08, duration: 0.5 }}
      className="mb-16 scroll-mt-32"
    >
      <div className="mb-7 px-1">
        <div className="flex items-center gap-4 mb-3">
          <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${category.gradient} flex items-center justify-center shrink-0 shadow-lg`}>
            <span className="text-white">{category.icon}</span>
          </div>
          <h2 className="text-xl font-bold text-white">{category.title}</h2>
          <span className="text-white/20 text-xs ml-1 bg-white/5 px-2 py-0.5 rounded-full">{category.cards.length}</span>
        </div>
        <p className="text-white/40 text-sm leading-relaxed max-w-2xl pl-14">{category.description}</p>
      </div>

      <div className="relative px-8 md:px-14">
        <Carousel
          opts={{ align: "start", dragFree: true, containScroll: "trimSnaps", loop: false }}
          setApi={setApi}
          className="w-full"
        >
          <CarouselContent className="-ml-5">
            {category.cards.map((card, i) => (
              <CarouselItem key={card.label} className="pl-5 basis-full sm:basis-[310px] md:basis-[340px]">
                <LaunchCardComponent card={card} index={i} />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="flex -left-2 md:-left-5 w-10 h-10 bg-white/5 border-white/10 text-white hover:bg-white/10 hover:text-white shadow-xl" />
          <CarouselNext className="flex -right-2 md:-right-5 w-10 h-10 bg-white/5 border-white/10 text-white hover:bg-white/10 hover:text-white shadow-xl" />
        </Carousel>
        <div className="flex sm:hidden items-center justify-center gap-1.5 mt-4">
          {Array.from({ length: count }).map((_, i) => (
            <button
              key={i}
              onClick={() => api?.scrollTo(i)}
              className={`rounded-full transition-all duration-300 ${
                i === current
                  ? "w-3 h-3 bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.6)]"
                  : "w-2 h-2 bg-white/20 hover:bg-white/40"
              }`}
              data-testid={`hub-dot-${catIndex}-${i}`}
            />
          ))}
        </div>
      </div>
    </motion.section>
  );
}

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

    const handler = (e: Event) => {
      e.preventDefault();
      setInstallPrompt(e as BeforeInstallPromptEvent);
    };
    window.addEventListener('beforeinstallprompt', handler);

    window.addEventListener('appinstalled', () => {
      setInstalled(true);
      setInstallPrompt(null);
    });

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (!installPrompt) return;
    await installPrompt.prompt();
    const result = await installPrompt.userChoice;
    if (result.outcome === 'accepted') {
      setInstalled(true);
    }
    setInstallPrompt(null);
  };

  const handleDismiss = () => {
    setDismissed(true);
    sessionStorage.setItem('pwa-banner-dismissed', '1');
  };

  if (isStandalone || installed || dismissed) return null;

  const showBanner = installPrompt || isIOS;
  if (!showBanner) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -10, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -10, scale: 0.98 }}
        transition={{ duration: 0.4 }}
        className="relative overflow-hidden rounded-2xl border border-cyan-500/20 mb-10"
        style={{ background: "linear-gradient(135deg, rgba(6,182,212,0.08), rgba(139,92,246,0.08), rgba(6,182,212,0.04))" }}
        data-testid="banner-pwa-install"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 via-purple-500/5 to-cyan-500/5" />
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-500/40 to-transparent" />

        <button
          onClick={handleDismiss}
          className="absolute top-3 right-3 z-20 w-7 h-7 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:text-white/70 hover:bg-white/10 transition-all"
          data-testid="button-pwa-dismiss"
        >
          <X className="w-3.5 h-3.5" />
        </button>

        <div className="relative z-10 p-5 sm:p-6 flex flex-col sm:flex-row items-center gap-5">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center shrink-0 shadow-lg shadow-cyan-500/20">
            <Smartphone className="w-7 h-7 text-white" />
          </div>

          <div className="flex-1 text-center sm:text-left">
            <h3 className="text-white font-bold text-lg mb-1">Install Trust Layer</h3>
            <p className="text-white/50 text-sm leading-relaxed">
              {isIOS
                ? "Add to your home screen for the full app experience — tap the share button below, then \"Add to Home Screen.\""
                : "Get the full app experience — install Trust Layer on your device for instant access, offline support, and push notifications."
              }
            </p>
          </div>

          {installPrompt ? (
            <button
              onClick={handleInstall}
              className="shrink-0 px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-bold text-sm flex items-center gap-2 hover:shadow-lg hover:shadow-cyan-500/20 transition-all active:scale-95"
              data-testid="button-pwa-install"
            >
              <Download className="w-4 h-4" />
              Install App
            </button>
          ) : isIOS ? (
            <div className="shrink-0 flex items-center gap-2 px-5 py-3 rounded-xl bg-white/5 border border-white/10 text-white/70 text-sm font-medium">
              <Share className="w-4 h-4" />
              Tap Share → Add to Home Screen
            </div>
          ) : null}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

export default function ExploreHub() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredCategories = searchQuery.trim()
    ? categories.map(cat => ({
        ...cat,
        cards: cat.cards.filter(card =>
          card.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
          card.description.toLowerCase().includes(searchQuery.toLowerCase())
        )
      })).filter(cat => cat.cards.length > 0)
    : categories;

  const totalFeatures = categories.reduce((sum, cat) => sum + cat.cards.length, 0);

  return (
    <div className="min-h-screen pt-20 pb-12 relative" style={{ background: "linear-gradient(180deg, #070b16, #0c1222, #070b16)" }}>
      <KenBurnsBackground
        images={[
          hubEcosystem,
          hubPresale,
          hubWallet,
          hubChronicles,
          hubAI,
          ccSettings
        ]}
        overlayOpacity={0.85}
        duration={12000}
      />
      <GlowOrb color="linear-gradient(135deg, #06b6d4, #3b82f6)" size={600} top="-5%" left="60%" />
      <GlowOrb color="linear-gradient(135deg, #8b5cf6, #ec4899)" size={500} top="30%" left="-10%" delay={3} />
      <GlowOrb color="linear-gradient(135deg, #f59e0b, #ef4444)" size={400} top="60%" left="80%" delay={5} />
      <GlowOrb color="linear-gradient(135deg, #10b981, #06b6d4)" size={350} top="80%" left="20%" delay={7} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 text-center"
        >
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-3">
            Explore{" "}
            <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Trust Layer
            </span>
          </h1>
          <p className="text-white/40 text-sm max-w-lg mx-auto mb-6">
            Every feature, every tool, every experience — all in one place. Tap any card to dive in.
          </p>
          <p className="text-white/20 text-xs">{totalFeatures} features across {categories.length} categories</p>
        </motion.div>

        <div className="max-w-md mx-auto mb-10">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search all features..."
              className="w-full pl-10 pr-4 py-2.5 text-sm bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-cyan-500/50 backdrop-blur-sm"
              data-testid="input-explore-hub-search"
            />
          </div>
        </div>

        <PWAInstallBanner />

        <EcosystemDirectory compact defaultCollapsed className="mb-10" />

        {/* Sticky Category Jump Links / TOC */}
        <div className="sticky top-20 z-40 -mx-4 px-4 sm:mx-0 sm:px-0 mb-10 overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
          <div className="flex items-center gap-2 pb-3 min-w-max">
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
                className="whitespace-nowrap px-4 py-2 rounded-xl border border-white/5 bg-black/40 text-white/70 text-sm font-medium hover:bg-white/10 hover:border-cyan-500/30 hover:text-white transition-all backdrop-blur-xl shadow-lg"
              >
                <div className="flex items-center gap-2">
                  <span className={`flex items-center justify-center w-5 h-5 rounded-md bg-gradient-to-br ${cat.gradient} shadow-lg shadow-white/5`}>
                     {/* Scale down the icon inside */}
                    <div className="scale-75 text-white">{cat.icon}</div>
                  </span>
                  {cat.title}
                </div>
              </button>
            ))}
          </div>
        </div>

        {filteredCategories.length === 0 ? (
          <div className="text-center py-20">
            <Search className="w-12 h-12 text-white/10 mx-auto mb-4" />
            <p className="text-white/30 text-sm">No features found matching "{searchQuery}"</p>
            <button
              onClick={() => setSearchQuery("")}
              className="mt-3 text-cyan-400 text-xs hover:underline"
              data-testid="button-explore-hub-clear-search"
            >
              Clear search
            </button>
          </div>
        ) : (
          filteredCategories.map((category, i) => (
            <CategorySection key={category.title} category={category} catIndex={i} />
          ))
        )}

        <div className="flex justify-center mt-12 mb-4">
          <GenesisHallmarkBadge />
        </div>
      </div>
    </div>
  );
}