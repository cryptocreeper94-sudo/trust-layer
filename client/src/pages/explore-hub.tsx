import { useState, useEffect } from "react";
import { motion } from "framer-motion";
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
  BrainCircuit, Scan, RefreshCw, Joystick
} from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";

import hubTrading from "@/assets/generated_images/hub_trading_defi.png";
import hubWallet from "@/assets/generated_images/hub_wallet_tokens.png";
import hubChronicles from "@/assets/generated_images/hub_chronicles_game.png";
import hubCommunity from "@/assets/generated_images/hub_community_social.png";
import hubIdentity from "@/assets/generated_images/hub_identity_security.png";
import hubAI from "@/assets/generated_images/hub_ai_tools.png";
import hubLearn from "@/assets/generated_images/hub_learn_explore.png";
import hubEarn from "@/assets/generated_images/hub_earn_rewards.png";
import ccGames from "@/assets/generated_images/cc_games_arcade.png";
import ccBlockchain from "@/assets/generated_images/cc_blockchain_network.png";
import ccDeveloper from "@/assets/generated_images/cc_developer_tools.png";
import ccSettings from "@/assets/generated_images/cc_settings_config.png";
import ccAnalytics from "@/assets/generated_images/cc_analytics_dashboard.png";
import ccUsers from "@/assets/generated_images/cc_users_community.png";
import ccMarketing from "@/assets/generated_images/cc_marketing_content.png";
import ccSecurity from "@/assets/generated_images/cc_security_shield.png";
import ccFinance from "@/assets/generated_images/cc_finance_tokens.png";
import ccRewards from "@/assets/generated_images/cc_rewards_treasure.png";
import hubHome from "@/assets/generated_images/hub_home_overview.png";
import hubPresale from "@/assets/generated_images/hub_presale_launch.png";
import hubEcosystem from "@/assets/generated_images/hub_ecosystem_globe.png";
import hubGamesCombat from "@/assets/generated_images/hub_games_combat.png";
import hubReferral from "@/assets/generated_images/hub_referral_network.png";
import hubNft from "@/assets/generated_images/hub_nft_gallery.png";
import hubGovernance from "@/assets/generated_images/hub_governance_vote.png";
import hubExplorer from "@/assets/generated_images/hub_explorer_blocks.png";
import hubChat from "@/assets/generated_images/hub_chat_messaging.png";
import hubMembership from "@/assets/generated_images/hub_membership_vip.png";
import hubSlots from "@/assets/generated_images/hub_slots_casino.png";
import hubLiquidity from "@/assets/generated_images/hub_liquidity_pool.png";
import hubBridge from "@/assets/generated_images/hub_bridge_chains.png";
import hubStaking from "@/assets/generated_images/hub_staking_vault.png";
import hubRetro from "@/assets/generated_images/hub_retro_space.png";
import hubDice from "@/assets/generated_images/hub_dice_chance.png";
import hubPortfolio from "@/assets/generated_images/hub_portfolio_chart.png";
import hubSmartContract from "@/assets/generated_images/hub_smart_contract.png";
import hubQuest from "@/assets/generated_images/hub_quest_compass.png";
import hubGuardian from "@/assets/generated_images/hub_guardian_sentinel.png";

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
    description: "Start here — your main dashboard, presale, ecosystem overview, and the full DarkWave story.",
    cards: [
      { label: "Home", description: "Main landing page", href: "/home", icon: <Home className="size-5" />, image: hubHome, glowColor: "shadow-cyan-500/30", featured: false },
      { label: "Presale", description: "Get SIG at the lowest price", href: "/presale", icon: <Rocket className="size-5" />, image: hubPresale, glowColor: "shadow-yellow-500/30", badge: "Live" },
      { label: "Ecosystem", description: "Explore all DarkWave apps", href: "/ecosystem", icon: <Globe className="size-5" />, image: hubEcosystem, glowColor: "shadow-indigo-500/30" },
      { label: "Our Story", description: "The DarkWave origin story", href: "/note", icon: <Heart className="size-5" />, image: hubCommunity, glowColor: "shadow-rose-500/30" },
      { label: "The Transmission", description: "Executive vision summary", href: "/executive-summary", icon: <Zap className="size-5" />, image: hubLearn, glowColor: "shadow-purple-500/30" },
      { label: "Trust Layer", description: "L1 blockchain overview", href: "/trust-layer", icon: <Shield className="size-5" />, image: hubIdentity, glowColor: "shadow-emerald-500/30" },
      { label: "My Hub", description: "Your personal dashboard", href: "/my-hub", icon: <LayoutGrid className="size-5" />, image: ccSettings, glowColor: "shadow-blue-500/30" },
      { label: "Dashboard", description: "Account overview", href: "/dashboard", icon: <BarChart3 className="size-5" />, image: ccAnalytics, glowColor: "shadow-teal-500/30" },
      { label: "Vision", description: "Our vision for the future", href: "/vision", icon: <Eye className="size-5" />, image: hubAI, glowColor: "shadow-violet-500/30" },
      { label: "Innovation Hub", description: "Cutting-edge features & research", href: "/innovation", icon: <Sparkles className="size-5" />, image: hubEarn, glowColor: "shadow-pink-500/30" },
      { label: "Investor Pitch", description: "Investment opportunity overview", href: "/investor-pitch", icon: <TrendingUp className="size-5" />, image: hubTrading, glowColor: "shadow-amber-500/30" },
      { label: "Competitive Analysis", description: "Market positioning breakdown", href: "/competitive-analysis", icon: <Target className="size-5" />, image: hubSmartContract, glowColor: "shadow-orange-500/30" },
      { label: "Coming Features", description: "Upcoming feature releases", href: "/coming-features", icon: <Rocket className="size-5" />, image: ccBlockchain, glowColor: "shadow-sky-500/30" },
      { label: "Genesis", description: "The genesis of DarkWave", href: "/genesis", icon: <Flame className="size-5" />, image: hubWallet, glowColor: "shadow-rose-500/30" },
      { label: "Trust Book", description: "Premium ebook publishing platform", href: "/trust-book", icon: <BookOpen className="size-5" />, image: hubLearn, glowColor: "shadow-cyan-500/30", badge: "New" },
    ]
  },
  {
    title: "DeFi & Trading",
    icon: <TrendingUp className="size-4" />,
    gradient: "from-emerald-500 to-cyan-500",
    description: "Trade tokens, provide liquidity, stake SIG, bridge assets across chains, and track your portfolio. The full DeFi suite at your fingertips.",
    cards: [
      { label: "Token Swap", description: "Swap tokens instantly", href: "/swap", icon: <ArrowLeftRight className="size-5" />, image: hubTrading, glowColor: "shadow-emerald-500/30", badge: "Popular", featured: false },
      { label: "Markets", description: "Live market prices and trends", href: "/markets", icon: <TrendingUp className="size-5" />, image: hubPortfolio, glowColor: "shadow-cyan-500/30", badge: "Live" },
      { label: "Price Charts", description: "Advanced charting tools", href: "/charts", icon: <ChartLine className="size-5" />, image: hubStaking, glowColor: "shadow-blue-500/30" },
      { label: "Portfolio", description: "Track your holdings", href: "/portfolio", icon: <PieChart className="size-5" />, image: hubWallet, glowColor: "shadow-teal-500/30" },
      { label: "Staking", description: "Earn rewards by staking SIG", href: "/staking", icon: <Coins className="size-5" />, image: hubLiquidity, glowColor: "shadow-amber-500/30", badge: "Earn" },
      { label: "Liquid Staking", description: "Stake and stay liquid with stSIG", href: "/liquid-staking", icon: <Droplets className="size-5" />, image: hubBridge, glowColor: "shadow-sky-500/30" },
      { label: "Liquidity Pools", description: "Provide liquidity and earn fees", href: "/liquidity", icon: <Layers className="size-5" />, image: hubPresale, glowColor: "shadow-indigo-500/30" },
      { label: "Cross-Chain Bridge", description: "Bridge SIG across blockchains", href: "/bridge", icon: <Network className="size-5" />, image: ccFinance, glowColor: "shadow-purple-500/30" },
      { label: "Token Launchpad", description: "Launch new tokens", href: "/launchpad", icon: <Rocket className="size-5" />, image: hubEarn, glowColor: "shadow-orange-500/30" },
      { label: "Transactions", description: "View your transaction history", href: "/transactions", icon: <ScrollText className="size-5" />, image: ccAnalytics, glowColor: "shadow-slate-400/30" },
      { label: "Copy Trading", description: "Follow top traders", href: "/copy-trading", icon: <Users className="size-5" />, image: hubAI, glowColor: "shadow-lime-500/30" },
      { label: "DCA Bot", description: "Dollar-cost averaging automation", href: "/dca-bot", icon: <Bot className="size-5" />, image: hubSmartContract, glowColor: "shadow-teal-500/30" },
      { label: "Paper Trading", description: "Practice trading risk-free", href: "/paper-trading", icon: <FileText className="size-5" />, image: ccBlockchain, glowColor: "shadow-yellow-500/30" },
      { label: "Trading Terminal", description: "Advanced trading interface", href: "/trading", icon: <MonitorPlay className="size-5" />, image: hubEcosystem, glowColor: "shadow-rose-500/30" },
      { label: "Token Info", description: "Signal token details", href: "/token", icon: <Coins className="size-5" />, image: hubHome, glowColor: "shadow-violet-500/30" },
      { label: "Token Analytics", description: "Advanced token metrics", href: "/token-analytics", icon: <ChartLine className="size-5" />, image: ccDeveloper, glowColor: "shadow-pink-500/30" },
      { label: "Token Compare", description: "Compare blockchain projects", href: "/token-compare", icon: <BarChart3 className="size-5" />, image: hubReferral, glowColor: "shadow-amber-500/30" },
    ]
  },
  {
    title: "Wallet & Assets",
    icon: <Wallet className="size-4" />,
    gradient: "from-violet-500 to-purple-500",
    description: "Manage your wallet, view your tokens and NFTs, claim airdrops, and access multi-signature wallets for enhanced security.",
    cards: [
      { label: "My Wallet", description: "Manage your crypto wallet", href: "/wallet", icon: <Wallet className="size-5" />, image: hubWallet, glowColor: "shadow-violet-500/30", featured: false },
      { label: "My Tokens", description: "View all your token holdings", href: "/my-tokens", icon: <Coins className="size-5" />, image: ccFinance, glowColor: "shadow-purple-500/30" },
      { label: "NFT Gallery", description: "Browse and manage your NFTs", href: "/nft-gallery", icon: <ImagePlus className="size-5" />, image: hubNft, glowColor: "shadow-pink-500/30" },
      { label: "NFT Marketplace", description: "Buy, sell, and trade NFTs", href: "/nft", icon: <Gem className="size-5" />, image: hubEarn, glowColor: "shadow-fuchsia-500/30", badge: "New" },
      { label: "NFT Creator", description: "Create your own NFTs", href: "/nft-creator", icon: <Palette className="size-5" />, image: hubAI, glowColor: "shadow-rose-500/30" },
      { label: "MultiSig Wallet", description: "Multi-signature security", href: "/multisig", icon: <Lock className="size-5" />, image: hubIdentity, glowColor: "shadow-indigo-500/30" },
      { label: "Claim Airdrop", description: "Claim your Signal airdrop", href: "/airdrop", icon: <Sparkles className="size-5" />, image: hubPresale, glowColor: "shadow-yellow-500/30", badge: "Claim" },
      { label: "RWA Tokenization", description: "Real-world asset tokenization", href: "/rwa", icon: <Building2 className="size-5" />, image: hubSmartContract, glowColor: "shadow-teal-500/30" },
    ]
  },
  {
    title: "AI & Intelligence",
    icon: <BrainCircuit className="size-4" />,
    gradient: "from-cyan-500 to-blue-500",
    description: "AI-powered tools including market analysis, token scanning, trading signals, NFT generation, and your personal AI advisor.",
    cards: [
      { label: "Guardian Scanner", description: "AI token security analysis", href: "/guardian-scanner", icon: <Scan className="size-5" />, image: hubAI, glowColor: "shadow-cyan-500/30", badge: "AI", featured: false },
      { label: "AI Advisor", description: "Your personal AI assistant", href: "/ai-advisor", icon: <BrainCircuit className="size-5" />, image: ccAnalytics, glowColor: "shadow-blue-500/30" },
      { label: "Pulse", description: "AI market sentiment tracker", href: "/pulse", icon: <Activity className="size-5" />, image: hubTrading, glowColor: "shadow-emerald-500/30", badge: "Live" },
      { label: "Strike Agent", description: "AI trading signals", href: "/strike-agent", icon: <Crosshair className="size-5" />, image: hubGuardian, glowColor: "shadow-red-500/30" },
      { label: "AI NFT Generator", description: "Create NFTs with AI", href: "/ai-nft", icon: <Sparkles className="size-5" />, image: hubNft, glowColor: "shadow-violet-500/30" },
      { label: "AI Agent Marketplace", description: "Browse AI agents", href: "/ai-agents", icon: <Bot className="size-5" />, image: hubSmartContract, glowColor: "shadow-purple-500/30", badge: "New" },
      { label: "Predictions", description: "AI price predictions", href: "/predictions", icon: <Target className="size-5" />, image: hubPortfolio, glowColor: "shadow-amber-500/30" },
      { label: "Wallet Profiler", description: "Analyze any wallet", href: "/wallet-profiler", icon: <Search className="size-5" />, image: hubWallet, glowColor: "shadow-teal-500/30" },
      { label: "Whale Tracker", description: "Track large wallet movements", href: "/whale-tracker", icon: <Eye className="size-5" />, image: hubEcosystem, glowColor: "shadow-sky-500/30" },
    ]
  },
  {
    title: "Games & Entertainment",
    icon: <Gamepad2 className="size-4" />,
    gradient: "from-pink-500 to-purple-500",
    description: "DarkWave Chronicles parallel life simulation, arcade games, sweepstakes, and daily rewards. Play, earn, and compete.",
    cards: [
      { label: "DarkWave Chronicles", description: "Parallel life simulation game", href: "/chronicles", icon: <Swords className="size-5" />, image: hubChronicles, glowColor: "shadow-pink-500/30", featured: false, badge: "Play" },
      { label: "Arcade", description: "Classic arcade games", href: "/arcade", icon: <Joystick className="size-5" />, image: ccGames, glowColor: "shadow-purple-500/30" },
      { label: "Crash", description: "Multiplier crash game", href: "/crash", icon: <Rocket className="size-5" />, image: hubPresale, glowColor: "shadow-rose-500/30", badge: "Hot" },
      { label: "Coin Flip", description: "Heads or tails", href: "/coinflip", icon: <CircleDollarSign className="size-5" />, image: hubSlots, glowColor: "shadow-yellow-500/30" },
      { label: "Slots", description: "Classic slot machine", href: "/slots", icon: <Dices className="size-5" />, image: hubDice, glowColor: "shadow-amber-500/30" },
      { label: "Predictions", description: "Predict market moves", href: "/predictions", icon: <Target className="size-5" />, image: hubAI, glowColor: "shadow-cyan-500/30" },
      { label: "Daily Bonus", description: "Claim your daily reward", href: "/daily-bonus", icon: <Gift className="size-5" />, image: hubEarn, glowColor: "shadow-emerald-500/30", badge: "Daily" },
      { label: "Leaderboard", description: "See top players", href: "/leaderboard", icon: <Trophy className="size-5" />, image: ccRewards, glowColor: "shadow-orange-500/30" },
      { label: "Galaga", description: "Classic space shooter", href: "/galaga", icon: <Rocket className="size-5" />, image: hubRetro, glowColor: "shadow-blue-500/30" },
      { label: "Snake", description: "Classic snake game", href: "/snake", icon: <Joystick className="size-5" />, image: hubGamesCombat, glowColor: "shadow-green-500/30" },
      { label: "Tetris", description: "Block puzzle classic", href: "/tetris", icon: <Boxes className="size-5" />, image: hubQuest, glowColor: "shadow-cyan-500/30" },
      { label: "Solitaire", description: "Card solitaire game", href: "/solitaire", icon: <Layers className="size-5" />, image: hubCommunity, glowColor: "shadow-red-500/30" },
      { label: "Spades", description: "Multiplayer spades", href: "/spades", icon: <Swords className="size-5" />, image: hubHome, glowColor: "shadow-indigo-500/30" },
      { label: "Minesweeper", description: "Mine puzzle game", href: "/minesweeper", icon: <Crosshair className="size-5" />, image: hubEcosystem, glowColor: "shadow-slate-400/30" },
      { label: "Lottery", description: "Lucky number draws", href: "/lottery", icon: <Dices className="size-5" />, image: hubReferral, glowColor: "shadow-yellow-500/30" },
    ]
  },
  {
    title: "Earn & Rewards",
    icon: <Gift className="size-4" />,
    gradient: "from-yellow-500 to-orange-500",
    description: "Earn Signal through referrals, quests, staking, crowdfunding, presale participation, and community engagement. Multiple ways to grow your holdings.",
    cards: [
      { label: "Presale", description: "Get SIG at the lowest price", href: "/presale", icon: <Rocket className="size-5" />, image: hubEarn, glowColor: "shadow-yellow-500/30", featured: false, badge: "Live" },
      { label: "Referral Program", description: "Earn by inviting friends", href: "/referral-program", icon: <Share2 className="size-5" />, image: hubReferral, glowColor: "shadow-orange-500/30", badge: "Earn" },
      { label: "Quests", description: "Complete quests for rewards", href: "/quests", icon: <Compass className="size-5" />, image: hubQuest, glowColor: "shadow-lime-500/30" },
      { label: "Crowdfund", description: "Support DarkWave development", href: "/crowdfund", icon: <Heart className="size-5" />, image: hubCommunity, glowColor: "shadow-rose-500/30" },
      { label: "Founder Program", description: "Exclusive founder benefits", href: "/founder-program", icon: <Crown className="size-5" />, image: hubMembership, glowColor: "shadow-amber-500/30" },
      { label: "My Rewards", description: "Track your earnings", href: "/rewards", icon: <Star className="size-5" />, image: ccRewards, glowColor: "shadow-yellow-400/30" },
      { label: "Coin Store", description: "Purchase Shells and tokens", href: "/coin-store", icon: <CreditCard className="size-5" />, image: hubWallet, glowColor: "shadow-emerald-500/30" },
      { label: "Investment Simulator", description: "Test investment strategies", href: "/investment-simulator", icon: <LineChart className="size-5" />, image: hubTrading, glowColor: "shadow-blue-500/30" },
    ]
  },
  {
    title: "Community & Social",
    icon: <Users className="size-4" />,
    gradient: "from-blue-500 to-indigo-500",
    description: "Connect with the DarkWave community through Signal Chat, social feeds, ChronoChat, team pages, and member directories.",
    cards: [
      { label: "Signal Chat", description: "Community messaging platform", href: "/signal-chat", icon: <MessageSquare className="size-5" />, image: hubChat, glowColor: "shadow-blue-500/30", featured: false },
      { label: "ChronoChat", description: "Chronicles community chat", href: "/chronochat", icon: <MessageSquare className="size-5" />, image: hubCommunity, glowColor: "shadow-indigo-500/30" },
      { label: "Community Hub", description: "Central community space", href: "/community", icon: <Users className="size-5" />, image: ccUsers, glowColor: "shadow-violet-500/30" },
      { label: "Social Feed", description: "Latest community updates", href: "/social", icon: <Share2 className="size-5" />, image: hubReferral, glowColor: "shadow-sky-500/30" },
      { label: "Activity Feed", description: "Real-time platform activity", href: "/activity", icon: <Activity className="size-5" />, image: hubEcosystem, glowColor: "shadow-teal-500/30", badge: "Live" },
      { label: "Members", description: "Browse the member directory", href: "/members", icon: <Users className="size-5" />, image: hubMembership, glowColor: "shadow-purple-500/30" },
      { label: "Blog", description: "News and articles", href: "/blog", icon: <Newspaper className="size-5" />, image: hubLearn, glowColor: "shadow-rose-500/30" },
      { label: "Feedback", description: "Share your thoughts", href: "/feedback", icon: <MessageSquare className="size-5" />, image: hubEarn, glowColor: "shadow-green-500/30" },
      { label: "Creators", description: "Creator community portal", href: "/creators", icon: <Palette className="size-5" />, image: hubHome, glowColor: "shadow-pink-500/30" },
      { label: "Creator Program", description: "Join the creator program", href: "/creator-program", icon: <Star className="size-5" />, image: hubPresale, glowColor: "shadow-amber-500/30" },
      { label: "Founders", description: "Meet the founding team", href: "/founders", icon: <Crown className="size-5" />, image: ccMarketing, glowColor: "shadow-yellow-500/30" },
      { label: "KOL Program", description: "Key opinion leader program", href: "/kol", icon: <Megaphone className="size-5" />, image: hubQuest, glowColor: "shadow-orange-500/30" },
      { label: "Influencer Partnership", description: "Partner with DarkWave", href: "/influencer-partnership", icon: <HandCoins className="size-5" />, image: hubAI, glowColor: "shadow-rose-500/30" },
      { label: "Partners", description: "Strategic partnership network", href: "/partners", icon: <Network className="size-5" />, image: ccRewards, glowColor: "shadow-cyan-500/30" },
      { label: "Team", description: "Meet the team", href: "/team", icon: <Users className="size-5" />, image: hubIdentity, glowColor: "shadow-teal-500/30" },
    ]
  },
  {
    title: "Security & Guardian",
    icon: <ShieldCheck className="size-4" />,
    gradient: "from-red-500 to-orange-500",
    description: "Security certifications, token audits, AI agent verification, continuous monitoring, and trust infrastructure. Verify before you trust.",
    cards: [
      { label: "Guardian Scanner", description: "Scan any token for risks", href: "/guardian-scanner", icon: <Scan className="size-5" />, image: hubGuardian, glowColor: "shadow-red-500/30", featured: false, badge: "AI" },
      { label: "Guardian Shield", description: "Continuous security monitoring", href: "/guardian-shield", icon: <Shield className="size-5" />, image: ccSecurity, glowColor: "shadow-orange-500/30" },
      { label: "Guardian AI Registry", description: "Certified AI agents", href: "/guardian-ai-registry", icon: <Bot className="size-5" />, image: hubAI, glowColor: "shadow-amber-500/30" },
      { label: "Guardian Portal", description: "Security certification hub", href: "/guardian-portal", icon: <ShieldCheck className="size-5" />, image: hubIdentity, glowColor: "shadow-red-400/30" },
      { label: "Guardian Registry", description: "Certified projects", href: "/guardian-registry", icon: <ScrollText className="size-5" />, image: hubSmartContract, glowColor: "shadow-rose-500/30" },
      { label: "Proof of Reserve", description: "On-chain reserve verification", href: "/proof-of-reserve", icon: <Lock className="size-5" />, image: ccBlockchain, glowColor: "shadow-emerald-500/30" },
      { label: "Security Center", description: "Account security settings", href: "/security", icon: <Shield className="size-5" />, image: ccSettings, glowColor: "shadow-yellow-500/30" },
      { label: "Guardian AI", description: "AI guardian certification system", href: "/guardian-ai", icon: <BrainCircuit className="size-5" />, image: hubEcosystem, glowColor: "shadow-cyan-500/30" },
      { label: "Guardian Whitepaper", description: "Security framework whitepaper", href: "/guardian-whitepaper", icon: <FileText className="size-5" />, image: hubLearn, glowColor: "shadow-indigo-500/30" },
    ]
  },
  {
    title: "Blockchain & Network",
    icon: <Network className="size-4" />,
    gradient: "from-cyan-500 to-teal-500",
    description: "Explore the DarkWave blockchain — block explorer, validators, network stats, faucet, gas estimator, and domain services.",
    cards: [
      { label: "Block Explorer", description: "Browse blocks and transactions", href: "/explorer", icon: <Boxes className="size-5" />, image: hubExplorer, glowColor: "shadow-cyan-500/30", featured: false },
      { label: "Validators", description: "View active validators", href: "/validators", icon: <Server className="size-5" />, image: ccBlockchain, glowColor: "shadow-teal-500/30" },
      { label: "Network Stats", description: "Live network performance", href: "/network", icon: <Activity className="size-5" />, image: ccAnalytics, glowColor: "shadow-blue-500/30", badge: "Live" },
      { label: "Testnet Faucet", description: "Get free testnet tokens", href: "/faucet", icon: <Droplets className="size-5" />, image: hubLiquidity, glowColor: "shadow-emerald-500/30" },
      { label: "Gas Estimator", description: "Estimate transaction costs", href: "/gas-estimator", icon: <Flame className="size-5" />, image: hubBridge, glowColor: "shadow-orange-500/30" },
      { label: "TLID Domains", description: ".tlid blockchain domains", href: "/domains", icon: <Globe className="size-5" />, image: hubEcosystem, glowColor: "shadow-indigo-500/30" },
      { label: "Governance", description: "Vote on proposals", href: "/governance", icon: <Landmark className="size-5" />, image: hubGovernance, glowColor: "shadow-purple-500/30" },
      { label: "Treasury", description: "DAO treasury overview", href: "/treasury", icon: <Landmark className="size-5" />, image: hubWallet, glowColor: "shadow-amber-500/30" },
      { label: "Governance Charter", description: "DAO governance constitution", href: "/governance-charter", icon: <ScrollText className="size-5" />, image: hubSmartContract, glowColor: "shadow-rose-500/30" },
      { label: "Governance Treasury", description: "Community treasury management", href: "/governance-treasury", icon: <HandCoins className="size-5" />, image: hubStaking, glowColor: "shadow-yellow-500/30" },
    ]
  },
  {
    title: "Learn & Explore",
    icon: <GraduationCap className="size-4" />,
    gradient: "from-indigo-500 to-violet-500",
    description: "Explore the ecosystem, read documentation, learn about tokenomics, dive into the philosophy, and discover what makes DarkWave unique.",
    cards: [
      { label: "Ecosystem", description: "Explore all DarkWave apps", href: "/ecosystem", icon: <Map className="size-5" />, image: hubLearn, glowColor: "shadow-indigo-500/30", featured: false },
      { label: "Tokenomics", description: "Signal token economics", href: "/tokenomics", icon: <PieChart className="size-5" />, image: hubPortfolio, glowColor: "shadow-violet-500/30" },
      { label: "Documentation", description: "Technical documentation", href: "/doc-hub", icon: <BookOpen className="size-5" />, image: ccDeveloper, glowColor: "shadow-blue-500/30" },
      { label: "API Docs", description: "Developer API reference", href: "/api-docs", icon: <Code className="size-5" />, image: hubSmartContract, glowColor: "shadow-emerald-500/30" },
      { label: "Philosophy", description: "Our vision and values", href: "/philosophy", icon: <Compass className="size-5" />, image: hubQuest, glowColor: "shadow-pink-500/30" },
      { label: "Roadmap", description: "Development timeline", href: "/roadmap", icon: <Target className="size-5" />, image: hubGovernance, glowColor: "shadow-cyan-500/30" },
      { label: "FAQ", description: "Frequently asked questions", href: "/faq", icon: <MessageSquare className="size-5" />, image: hubChat, glowColor: "shadow-slate-400/30" },
      { label: "Status", description: "System health & uptime", href: "/status", icon: <Activity className="size-5" />, image: ccSettings, glowColor: "shadow-green-500/30", badge: "Live" },
      { label: "Learn Center", description: "Trust Academy courses", href: "/learn", icon: <GraduationCap className="size-5" />, image: hubAI, glowColor: "shadow-amber-500/30" },
      { label: "Legacy", description: "Build your digital legacy", href: "/legacy", icon: <Crown className="size-5" />, image: hubMembership, glowColor: "shadow-rose-500/30" },
      { label: "Alerts", description: "Price and event alerts", href: "/alerts", icon: <Radio className="size-5" />, image: hubTrading, glowColor: "shadow-red-500/30" },
      { label: "Economy", description: "Platform economy overview", href: "/economy", icon: <LineChart className="size-5" />, image: hubEarn, glowColor: "shadow-teal-500/30" },
      { label: "Trust Book", description: "Read & publish ebooks", href: "/trust-book", icon: <BookOpen className="size-5" />, image: hubLearn, glowColor: "shadow-cyan-500/30", badge: "New" },
    ]
  },
  {
    title: "My Account",
    icon: <Settings className="size-4" />,
    gradient: "from-slate-400 to-zinc-500",
    description: "Your personal dashboard, profile settings, membership details, billing, achievements, and account management.",
    cards: [
      { label: "My Hub", description: "Your personal dashboard", href: "/my-hub", icon: <LayoutGrid className="size-5" />, image: hubMembership, glowColor: "shadow-slate-400/30", featured: false },
      { label: "Dashboard", description: "Account overview", href: "/dashboard", icon: <BarChart3 className="size-5" />, image: ccAnalytics, glowColor: "shadow-blue-500/30" },
      { label: "Member Portal", description: "Membership benefits", href: "/member-portal", icon: <Crown className="size-5" />, image: hubEarn, glowColor: "shadow-amber-500/30" },
      { label: "Achievements", description: "Your accomplishments", href: "/achievements", icon: <Trophy className="size-5" />, image: ccRewards, glowColor: "shadow-yellow-500/30" },
      { label: "Billing", description: "Manage subscriptions", href: "/billing", icon: <CreditCard className="size-5" />, image: ccFinance, glowColor: "shadow-emerald-500/30" },
      { label: "Pricing", description: "Plans and pricing", href: "/pricing", icon: <DollarSign className="size-5" />, image: ccSettings, glowColor: "shadow-teal-500/30" },
      { label: "Support", description: "Get help", href: "/support", icon: <MessageSquare className="size-5" />, image: hubChat, glowColor: "shadow-indigo-500/30" },
      { label: "Profile", description: "Edit your profile", href: "/profile", icon: <Users className="size-5" />, image: hubCommunity, glowColor: "shadow-violet-500/30" },
      { label: "Membership", description: "Membership tier details", href: "/membership", icon: <Crown className="size-5" />, image: hubHome, glowColor: "shadow-rose-500/30" },
      { label: "Membership Charter", description: "Membership governance rules", href: "/membership-charter", icon: <ScrollText className="size-5" />, image: hubGovernance, glowColor: "shadow-purple-500/30" },
      { label: "Business Portal", description: "Business account dashboard", href: "/business-portal", icon: <Building2 className="size-5" />, image: hubIdentity, glowColor: "shadow-cyan-500/30" },
      { label: "Business Application", description: "Apply for a business account", href: "/business-application", icon: <FileText className="size-5" />, image: hubLearn, glowColor: "shadow-sky-500/30" },
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
      onClick={() => navigate(card.href)}
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
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: catIndex * 0.08, duration: 0.5 }}
      className="mb-16"
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
    <div className="min-h-screen pt-20 pb-12" style={{ background: "linear-gradient(180deg, #070b16, #0c1222, #070b16)" }}>
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
      </div>
    </div>
  );
}