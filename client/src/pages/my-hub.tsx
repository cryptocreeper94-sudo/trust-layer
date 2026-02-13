import { motion } from "framer-motion";
import { Link } from "wouter";
import { useState, useEffect } from "react";
import { 
  ArrowLeft, Gift, Users, Coins, Heart, Trophy, Sparkles, Check, 
  Wallet, TrendingUp, Zap, Calendar, ArrowUpRight, Shield, Target,
  Gamepad2, MessageCircle, Globe, Code, ImageIcon, PieChart, 
  ArrowLeftRight, Droplets, Rocket, Download, ExternalLink, Star,
  Crown, Activity, Bell, Settings, ChevronRight, Award, MapPin,
  Newspaper, Clock, Megaphone, X, Compass, BookOpen, HelpCircle,
  CheckCircle, AlertCircle, CircleDot, ArrowUp, ArrowDown, Headphones,
  Copy, Share2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { GlassCard } from "@/components/glass-card";
import { Footer } from "@/components/footer";
import { useSimpleAuth } from "@/hooks/use-simple-auth";
import { authFetch } from "@/hooks/use-firebase-auth";
import { useQuery } from "@tanstack/react-query";
import { Progress } from "@/components/ui/progress";
import { MemberBadge } from "@/components/member-badge";
import { WalletButton } from "@/components/wallet-button";

export default function MyHub() {
  const { user, isAuthenticated } = useSimpleAuth();

  const { data: memberData } = useQuery<{
    memberNumber: number;
    trustHash: string;
    totalMembers: number;
    isEarlyAdopter: boolean;
  }>({
    queryKey: ["/api/user/member-number", user?.id],
    queryFn: async () => {
      const res = await authFetch("/api/user/member-number");
      if (!res.ok) throw new Error("Failed to fetch member data");
      return res.json();
    },
    enabled: !!user,
  });

  const { data: rewardProfile } = useQuery<{
    profile: {
      tier: string;
      multiplier: number;
      totalQuestsCompleted: number;
      consecutiveDays: number;
      hasWallet: boolean;
      walletAddress: string | null;
    };
    shellBalance: number;
    conversion: {
      rate: number;
      tgeDate: string;
      shellsValue: number;
      estimatedDwc: number;
    };
  }>({
    queryKey: ["/api/user/reward-profile", user?.id],
    queryFn: async () => {
      const res = await authFetch("/api/user/reward-profile");
      if (!res.ok) throw new Error("Failed to fetch reward profile");
      return res.json();
    },
    enabled: !!user,
  });

  const { data: tokenBalance } = useQuery<{
    totalTokens: number;
    stakedTokens: number;
    liquidTokens: number;
  }>({
    queryKey: ["/api/balance", user?.id],
    queryFn: async () => {
      const res = await authFetch("/api/balance");
      if (!res.ok) return { totalTokens: 0, stakedTokens: 0, liquidTokens: 0 };
      return res.json();
    },
    enabled: !!user,
  });

  const { data: newsData } = useQuery<{
    announcements: Array<{
      id: number;
      title: string;
      content: string;
      type: 'announcement' | 'update' | 'upcoming';
      date: string;
      version?: string;
    }>;
    currentVersion: string;
    upcomingVersion: string;
  }>({
    queryKey: ["/api/trust-layer/news"],
    queryFn: async () => {
      const res = await fetch("/api/trust-layer/news");
      if (!res.ok) {
        return {
          announcements: [
            { id: 1, title: "Welcome to Trust Layer", content: "Your personal hub in the Trust Layer ecosystem is now live!", type: "announcement" as const, date: new Date().toISOString() },
            { id: 2, title: "Race to 200 Active", content: "Complete daily Zealy missions to earn shells and compete for Founders tier!", type: "update" as const, date: new Date().toISOString() },
            { id: 3, title: "Coming Soon: v2.5", content: "Enhanced member profiles, location-based trust circles, and governance voting.", type: "upcoming" as const, date: new Date().toISOString(), version: "2.5" },
          ],
          currentVersion: "2.4",
          upcomingVersion: "2.5",
        };
      }
      return res.json();
    },
  });

  const [showNotifications, setShowNotifications] = useState(false);
  
  const notifications = [
    { id: 1, type: 'system', title: 'Welcome to Trust Layer', message: 'Your account is ready to explore', time: 'Just now', read: true },
  ];

  const recentActivity: { id: number; type: string; title: string; amount: string; time: string; icon: any }[] = [];

  const { data: referralStats } = useQuery<{
    referralCode: { code: string; host: string; clickCount: number; signupCount: number } | null;
    totalClicks: number;
    totalSignups: number;
    totalConversions: number;
    pendingCommission: number;
    lifetimeEarnings: number;
  }>({
    queryKey: ["/api/referrals/stats", user?.id],
    queryFn: async () => {
      const res = await fetch("/api/referrals/stats", { credentials: "include" });
      if (!res.ok) return null;
      return res.json();
    },
    enabled: !!user,
  });

  const [referralCopied, setReferralCopied] = useState(false);
  
  const copyReferralLink = () => {
    if (referralStats?.referralCode?.code) {
      const host = referralStats.referralCode.host || "dwsc.io";
      const link = `https://${host}?ref=${referralStats.referralCode.code}`;
      navigator.clipboard.writeText(link);
      setReferralCopied(true);
      setTimeout(() => setReferralCopied(false), 2000);
    }
  };

  const sigPrice = 0.01;
  const sigChange24h = 0;

  const accountCompletionSteps = [
    { id: 'wallet', label: 'Connect wallet', completed: rewardProfile?.profile?.hasWallet || false, href: '/wallet' },
    { id: 'quest', label: 'Complete first quest', completed: (rewardProfile?.profile?.totalQuestsCompleted || 0) > 0, href: '/quests' },
    { id: 'referral', label: 'Refer a friend', completed: false, href: '/referrals' },
    { id: 'chat', label: 'Join ChronoChat', completed: false, href: '/community' },
  ];
  const completedSteps = accountCompletionSteps.filter(s => s.completed).length;
  const accountProgress = (completedSteps / accountCompletionSteps.length) * 100;

  const pendingActions = [
    ...(!(rewardProfile?.profile?.hasWallet) ? [{ id: 'wallet', title: 'Connect your wallet', description: 'Link a wallet to receive rewards', href: '/wallet', priority: 'high' as const }] : []),
    ...((rewardProfile?.profile?.totalQuestsCompleted || 0) === 0 ? [{ id: 'quest', title: 'Complete your first quest', description: 'Start earning Shells today', href: '/quests', priority: 'medium' as const }] : []),
  ];

  const ecosystemLinks = [
    { href: "/wallet", label: "Wallet", icon: Wallet, color: "cyan", description: "Manage your assets" },
    { href: "/swap", label: "Swap", icon: ArrowLeftRight, color: "purple", description: "Trade tokens" },
    { href: "/staking", label: "Staking", icon: TrendingUp, color: "emerald", description: "Earn rewards" },
    { href: "/nft", label: "NFTs", icon: ImageIcon, color: "pink", description: "Collect & trade" },
    { href: "/bridge", label: "Bridge", icon: Globe, color: "amber", description: "Cross-chain transfers" },
    { href: "/portfolio", label: "Portfolio", icon: PieChart, color: "blue", description: "Track holdings" },
  ];

  const quickActions = [
    { href: "/community", label: "ChronoChat", icon: MessageCircle, badge: "Live" },
    { href: "/chronicles", label: "Chronicles", icon: Gamepad2, badge: "Play" },
    { href: "/quests", label: "Daily Quests", icon: Target, badge: "Earn" },
    { href: "/referrals", label: "Refer & Earn", icon: Users, badge: "Bonus" },
  ];

  const exploreCategories = [
    {
      title: "Get Started",
      color: "cyan",
      links: [
        { href: "/learn", label: "Learn the Basics", icon: BookOpen },
        { href: "/academy", label: "Academy", icon: Award },
        { href: "/feedback", label: "Give Feedback", icon: HelpCircle },
        { href: "/faq", label: "FAQ", icon: MessageCircle },
      ]
    },
    {
      title: "Community",
      color: "emerald",
      links: [
        { href: "/community", label: "ChronoChat", icon: MessageCircle },
        { href: "/members", label: "Member Directory", icon: Users },
        { href: "/referrals", label: "Refer Friends", icon: Gift },
        { href: "/quests", label: "Daily Quests", icon: Target },
      ]
    },
    {
      title: "Games & Fun",
      color: "purple",
      links: [
        { href: "/chronicles", label: "Chronicles", icon: Gamepad2 },
        { href: "/nft", label: "NFT Gallery", icon: ImageIcon },
        { href: "/launchpad", label: "Token Launchpad", icon: Rocket },
        { href: "/leaderboard", label: "Leaderboard", icon: Trophy },
      ]
    },
    {
      title: "About Us",
      color: "amber",
      links: [
        { href: "/vision", label: "Our Vision", icon: Sparkles },
        { href: "/ecosystem", label: "Ecosystem Map", icon: Globe },
        { href: "/team", label: "Meet the Team", icon: Users },
        { href: "/trust-layer", label: "Trust Layer", icon: Shield },
      ]
    },
  ];

  const progressToFounders = rewardProfile?.profile?.totalQuestsCompleted 
    ? Math.min((rewardProfile.profile.totalQuestsCompleted / 50) * 100, 100) 
    : 0;

  // Calculate member tenure badge with explicit Tailwind classes
  const getTenureBadge = () => {
    const memberNum = memberData?.memberNumber || 9999;
    
    if (memberNum <= 10) return { 
      label: "Founder", 
      icon: "🏆",
      className: "bg-amber-500/20 text-amber-400 border-amber-500/30"
    };
    if (memberNum <= 50) return { 
      label: "Pioneer", 
      icon: "🌟",
      className: "bg-purple-500/20 text-purple-400 border-purple-500/30"
    };
    if (memberNum <= 100) return { 
      label: "Trailblazer", 
      icon: "⚡",
      className: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30"
    };
    if (memberNum <= 500) return { 
      label: "Early Adopter", 
      icon: "✨",
      className: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
    };
    return null;
  };
  
  const tenureBadge = getTenureBadge();

  // Welcome experience state - show for first 24 hours or until dismissed
  const [showWelcome, setShowWelcome] = useState(false);
  const [welcomeDismissed, setWelcomeDismissed] = useState(false);
  
  useEffect(() => {
    if (!user?.id) return;
    
    const storageKey = `dwtl_welcome_seen_${user.id}`;
    const welcomeData = localStorage.getItem(storageKey);
    
    if (!welcomeData) {
      // First visit - show welcome and save timestamp
      localStorage.setItem(storageKey, JSON.stringify({ 
        firstSeen: Date.now(),
        dismissed: false 
      }));
      setShowWelcome(true);
    } else {
      const data = JSON.parse(welcomeData);
      const hoursSinceFirst = (Date.now() - data.firstSeen) / (1000 * 60 * 60);
      
      // Show welcome if within 24 hours and not dismissed
      if (hoursSinceFirst < 24 && !data.dismissed) {
        setShowWelcome(true);
      } else {
        setShowWelcome(false);
      }
      setWelcomeDismissed(data.dismissed);
    }
  }, [user?.id]);

  const dismissWelcome = () => {
    if (!user?.id) return;
    const storageKey = `dwtl_welcome_seen_${user.id}`;
    const welcomeData = localStorage.getItem(storageKey);
    if (welcomeData) {
      const data = JSON.parse(welcomeData);
      localStorage.setItem(storageKey, JSON.stringify({ ...data, dismissed: true }));
    }
    setShowWelcome(false);
    setWelcomeDismissed(true);
  };

  // Get user's display name
  const getUserName = () => {
    if (user?.displayName) return user.displayName.split(' ')[0];
    if (user?.email) return user.email.split('@')[0];
    return 'Friend';
  };

  const generateTrustHash = () => {
    if (!memberData?.trustHash) return "Generating...";
    return memberData.trustHash;
  };

  const downloadMemberCard = () => {
    if (!memberData) return;
    const svgContent = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="400" height="250" viewBox="0 0 400 250">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#0f172a"/>
      <stop offset="100%" style="stop-color:#1e1b4b"/>
    </linearGradient>
    <linearGradient id="accent" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" style="stop-color:#22d3ee"/>
      <stop offset="100%" style="stop-color:#a855f7"/>
    </linearGradient>
  </defs>
  <rect width="400" height="250" rx="16" fill="url(#bg)"/>
  <rect x="0" y="0" width="400" height="4" fill="url(#accent)"/>
  <text x="24" y="40" font-family="system-ui, sans-serif" font-size="18" font-weight="bold" fill="#22d3ee">Trust Layer</text>
  <text x="24" y="70" font-family="system-ui, sans-serif" font-size="12" fill="#94a3b8">VERIFIED MEMBER</text>
  <text x="24" y="105" font-family="system-ui, sans-serif" font-size="32" font-weight="bold" fill="white">#${memberData.memberNumber}</text>
  ${memberData.isEarlyAdopter ? '<text x="24" y="130" font-family="system-ui, sans-serif" font-size="11" fill="#fbbf24">★ Early Adopter</text>' : ''}
  <text x="24" y="165" font-family="monospace" font-size="10" fill="#94a3b8">Trust Hash</text>
  <text x="24" y="182" font-family="monospace" font-size="12" fill="#22d3ee">${memberData.trustHash}</text>
  <text x="24" y="210" font-family="system-ui, sans-serif" font-size="10" fill="#64748b">Signal Balance: ${(tokenBalance?.totalTokens || 0).toLocaleString()} SIG</text>
  <text x="24" y="230" font-family="system-ui, sans-serif" font-size="9" fill="#475569">Generated: ${new Date().toLocaleDateString()}</text>
  <circle cx="360" cy="125" r="30" fill="none" stroke="url(#accent)" stroke-width="2"/>
  <text x="360" y="130" font-family="system-ui, sans-serif" font-size="10" fill="#22d3ee" text-anchor="middle">✓</text>
</svg>`;

    const blob = new Blob([svgContent], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `darkwave-member-${memberData.memberNumber}.svg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <GlassCard className="p-8 text-center max-w-md">
          <Shield className="w-16 h-16 text-cyan-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">Welcome to Your Hub</h1>
          <p className="text-white/60 mb-6">Sign in to access your personal dashboard and track your rewards.</p>
          <Link href="/">
            <Button className="bg-gradient-to-r from-cyan-500 to-purple-500">
              Sign In to Continue
            </Button>
          </Link>
        </GlassCard>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-transparent to-cyan-900/20 pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(6,182,212,0.15)_0%,_transparent_50%)] pointer-events-none" />
      
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-background/90 backdrop-blur-xl">
        <div className="w-full px-4 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center">
            <span className="font-display font-bold text-xl tracking-tight">Trust Layer</span>
          </Link>
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="relative">
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 rounded-lg hover:bg-white/10 transition-colors relative"
                data-testid="button-notifications"
              >
                <Bell className="w-5 h-5 text-white/70" />
                {notifications.filter(n => !n.read).length > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
                )}
              </button>
              {showNotifications && (
                <div className="fixed sm:absolute right-4 sm:right-0 left-4 sm:left-auto top-16 sm:top-12 sm:w-80 bg-slate-900 border border-white/10 rounded-xl shadow-2xl z-50 overflow-hidden">
                  <div className="p-3 border-b border-white/10 flex items-center justify-between">
                    <span className="font-semibold text-sm">Notifications</span>
                    <Badge className="bg-cyan-500/20 text-cyan-400 border-cyan-500/30 text-xs">
                      {notifications.filter(n => !n.read).length} new
                    </Badge>
                  </div>
                  <div className="max-h-64 overflow-y-auto">
                    {notifications.map(notif => (
                      <div key={notif.id} className={`p-3 border-b border-white/5 hover:bg-white/5 transition-colors ${!notif.read ? 'bg-cyan-500/5' : ''}`}>
                        <div className="flex items-start gap-2">
                          <div className={`p-1.5 rounded-lg ${notif.type === 'reward' ? 'bg-emerald-500/20' : notif.type === 'quest' ? 'bg-amber-500/20' : 'bg-cyan-500/20'}`}>
                            {notif.type === 'reward' ? <Gift className="w-3 h-3 text-emerald-400" /> : 
                             notif.type === 'quest' ? <Target className="w-3 h-3 text-amber-400" /> : 
                             <Bell className="w-3 h-3 text-cyan-400" />}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{notif.title}</p>
                            <p className="text-xs text-white/50 truncate">{notif.message}</p>
                            <p className="text-[10px] text-white/30 mt-1">{notif.time}</p>
                          </div>
                          {!notif.read && <div className="w-2 h-2 bg-cyan-400 rounded-full mt-1" />}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="p-2 border-t border-white/10">
                    <Button variant="ghost" size="sm" className="w-full text-xs text-white/60">
                      View all notifications
                    </Button>
                  </div>
                </div>
              )}
            </div>
            <Link href="/feedback">
              <button className="p-2 rounded-lg hover:bg-white/10 transition-colors" data-testid="button-help">
                <Headphones className="w-5 h-5 text-white/70" />
              </button>
            </Link>
            {user?.id && <MemberBadge userId={user.id.toString()} />}
            <WalletButton />
          </div>
        </div>
      </nav>

      <div className="fixed top-14 left-0 right-0 z-40 bg-slate-900/80 backdrop-blur-sm border-b border-white/5">
          <div className="container mx-auto px-4 py-2 flex items-center justify-between text-sm">
            <div className="flex items-center gap-6 overflow-x-auto">
              <div className="flex items-center gap-2 whitespace-nowrap">
                <span className="text-white/50">SIG</span>
                <span className="font-semibold text-white">${sigPrice.toFixed(4)}</span>
                <span className={`flex items-center text-xs ${sigChange24h >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                  {sigChange24h >= 0 ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
                  {Math.abs(sigChange24h).toFixed(2)}%
                </span>
              </div>
              <div className="h-4 w-px bg-white/10" />
              <div className="flex items-center gap-2 whitespace-nowrap">
                <span className="text-white/50">Your Portfolio</span>
                <span className="font-semibold text-cyan-400">${((tokenBalance?.totalTokens || 0) * sigPrice).toFixed(2)}</span>
              </div>
              <div className="h-4 w-px bg-white/10 hidden sm:block" />
              <div className="hidden sm:flex items-center gap-2 whitespace-nowrap">
                <span className="text-white/50">Shells</span>
                <span className="font-semibold text-purple-400">{(rewardProfile?.shellBalance || 0).toLocaleString()}</span>
              </div>
            </div>
            <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 text-xs hidden md:flex">
              <CircleDot className="w-3 h-3 mr-1 animate-pulse" /> Mainnet Live
            </Badge>
          </div>
        </div>

      <main className="pt-32 pb-12">
        <div className="container mx-auto px-4">
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border border-cyan-500/20 p-6 md:p-8">
              <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top_left,_rgba(6,182,212,0.2)_0%,_transparent_50%)]" />
              <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(ellipse_at_bottom_right,_rgba(168,85,247,0.2)_0%,_transparent_50%)]" />
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500" />
              
              <div className="relative">
                <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-3 rounded-2xl bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border border-cyan-500/30">
                        <Crown className="w-8 h-8 text-cyan-400" />
                      </div>
                      <div>
                        <h1 className="text-3xl md:text-4xl font-bold">
                          Welcome, Member <span className="text-cyan-400">#{memberData?.memberNumber || '...'}</span>
                        </h1>
                        <p className="text-white/60 flex flex-wrap items-center gap-2">
                          <Shield className="w-4 h-4 text-emerald-400" />
                          Verified Trust Layer Member
                          {tenureBadge && (
                            <Badge className={`${tenureBadge.className} ml-2`}>
                              <span className="mr-1">{tenureBadge.icon}</span> {tenureBadge.label}
                            </Badge>
                          )}
                          {memberData?.isEarlyAdopter && !tenureBadge && (
                            <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30 ml-2">
                              <Star className="w-3 h-3 mr-1" /> Early Adopter
                            </Badge>
                          )}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                      <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                        <p className="text-white/50 text-sm mb-1">Shell Balance</p>
                        <p className="text-2xl font-bold text-cyan-400">{rewardProfile?.shellBalance?.toLocaleString() || 0}</p>
                        <p className="text-xs text-white/40">≈ ${rewardProfile?.conversion?.shellsValue?.toFixed(2) || '0.00'}</p>
                      </div>
                      <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                        <p className="text-white/50 text-sm mb-1">Signal Balance</p>
                        <p className="text-2xl font-bold text-purple-400">{tokenBalance?.totalTokens?.toLocaleString() || 0}</p>
                        <p className="text-xs text-white/40">SIG</p>
                      </div>
                      <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                        <p className="text-white/50 text-sm mb-1">Your Tier</p>
                        <p className="text-2xl font-bold text-amber-400 capitalize">{rewardProfile?.profile?.tier || 'Participant'}</p>
                        <p className="text-xs text-white/40">{rewardProfile?.profile?.multiplier || 1}x multiplier</p>
                      </div>
                      <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                        <p className="text-white/50 text-sm mb-1">Est. SIG at Launch</p>
                        <p className="text-2xl font-bold text-emerald-400">{rewardProfile?.conversion?.estimatedDwc?.toLocaleString() || 0}</p>
                        <p className="text-xs text-white/40">Coming Soon</p>
                      </div>
                    </div>
                  </div>

                  <div className="w-full lg:w-auto">
                    <div className="relative p-6 rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 border border-cyan-500/30 shadow-[0_0_30px_rgba(6,182,212,0.2)]">
                      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-t-2xl" />
                      <div className="text-center">
                        <p className="text-white/50 text-xs mb-1">MEMBER CARD</p>
                        <p className="text-4xl font-bold text-white mb-2">#{memberData?.memberNumber || '...'}</p>
                        {memberData?.isEarlyAdopter && (
                          <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30 mb-3">
                            <Star className="w-3 h-3 mr-1" /> Early Adopter
                          </Badge>
                        )}
                        <div className="mt-3 pt-3 border-t border-white/10">
                          <p className="text-white/40 text-[10px] mb-1">TRUST HASH</p>
                          <p className="text-cyan-400 text-xs font-mono truncate max-w-[200px]">{generateTrustHash()}</p>
                        </div>
                        <Button 
                          onClick={downloadMemberCard}
                          size="sm" 
                          variant="outline" 
                          className="mt-4 w-full border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/20"
                          data-testid="button-download-card"
                        >
                          <Download className="w-4 h-4 mr-2" />
                          Download Card
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="mb-8"
          >
            <div className="p-4 rounded-2xl bg-gradient-to-r from-cyan-500/10 via-purple-500/10 to-pink-500/10 border border-cyan-500/20">
              <div className="flex flex-col md:flex-row items-center gap-4">
                <div className="flex items-center gap-3 flex-1">
                  <div className="p-2 rounded-xl bg-amber-500/20">
                    <Trophy className="w-6 h-6 text-amber-400" />
                  </div>
                  <div>
                    <p className="font-semibold">Progress to Founders Tier</p>
                    <p className="text-sm text-white/60">{rewardProfile?.profile?.totalQuestsCompleted || 0} / 50 quests completed</p>
                  </div>
                </div>
                <div className="w-full md:w-64">
                  <Progress value={progressToFounders} className="h-3" />
                </div>
                <Badge className={progressToFounders >= 100 ? "bg-amber-500/20 text-amber-400" : "bg-white/10 text-white/60"}>
                  {progressToFounders >= 100 ? "Founders Achieved!" : `${Math.round(progressToFounders)}%`}
                </Badge>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-8"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Zap className="w-5 h-5 text-cyan-400" />
                Quick Actions
              </h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {quickActions.map((action) => (
                <Link key={action.href} href={action.href}>
                  <motion.div
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    className="relative p-4 rounded-xl bg-gradient-to-br from-slate-800/80 to-slate-900/80 border border-white/10 hover:border-cyan-500/30 transition-all cursor-pointer group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-cyan-500/20 group-hover:bg-cyan-500/30 transition-colors">
                        <action.icon className="w-5 h-5 text-cyan-400" />
                      </div>
                      <div>
                        <p className="font-medium">{action.label}</p>
                        <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 text-[10px] mt-1">
                          {action.badge}
                        </Badge>
                      </div>
                    </div>
                    <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 group-hover:text-cyan-400 transition-colors" />
                  </motion.div>
                </Link>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.11 }}
            className="mb-8"
          >
            <GlassCard className="p-5 relative overflow-hidden" glow>
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-amber-500" />
              <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
                <div className="flex items-center gap-3 flex-1">
                  <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30">
                    <Share2 className="w-6 h-6 text-purple-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg flex items-center gap-2">
                      Refer Friends & Earn
                      <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 text-xs">Earn Shells</Badge>
                    </h3>
                    <p className="text-sm text-white/60">Share your link and earn rewards when friends join</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 w-full md:w-auto">
                  <div className="flex-1 md:flex-none">
                    {referralStats?.referralCode?.code ? (
                      <div className="flex items-center gap-2">
                        <div className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 font-mono text-sm text-cyan-400 truncate max-w-[200px]">
                          dwsc.io?ref={referralStats.referralCode.code}
                        </div>
                        <Button 
                          size="sm" 
                          onClick={copyReferralLink}
                          className={referralCopied ? "bg-emerald-500/20 text-emerald-400" : "bg-purple-500/20 text-purple-400 hover:bg-purple-500/30"}
                          data-testid="button-copy-referral"
                        >
                          {referralCopied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        </Button>
                      </div>
                    ) : (
                      <Link href="/referrals">
                        <Button size="sm" className="bg-purple-500/20 text-purple-400 hover:bg-purple-500/30" data-testid="button-get-referral-link">
                          Get Your Link
                        </Button>
                      </Link>
                    )}
                  </div>
                  
                  <div className="hidden md:flex items-center gap-4 px-4 py-2 rounded-lg bg-white/5 border border-white/10">
                    <div className="text-center">
                      <p className="text-lg font-bold text-white">{referralStats?.totalSignups || 0}</p>
                      <p className="text-[10px] text-white/50">Signups</p>
                    </div>
                    <div className="h-8 w-px bg-white/10" />
                    <div className="text-center">
                      <p className="text-lg font-bold text-emerald-400">+{referralStats?.lifetimeEarnings || 0}</p>
                      <p className="text-[10px] text-white/50">Earned</p>
                    </div>
                  </div>
                  
                  <Link href="/referrals">
                    <Button variant="ghost" size="sm" className="text-xs text-white/50 hover:text-purple-400" data-testid="button-view-referrals">
                      Details <ChevronRight className="w-3 h-3 ml-1" />
                    </Button>
                  </Link>
                </div>
              </div>
            </GlassCard>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {pendingActions.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.12 }}
              >
                <GlassCard className="p-5 h-full" glow>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-amber-400" />
                      Action Needed
                    </h3>
                    <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30 text-xs">
                      {pendingActions.length}
                    </Badge>
                  </div>
                  <div className="space-y-3">
                    {pendingActions.map(action => (
                      <Link key={action.id} href={action.href}>
                        <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 hover:bg-amber-500/20 transition-colors cursor-pointer">
                          <p className="font-medium text-sm">{action.title}</p>
                          <p className="text-xs text-white/50">{action.description}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </GlassCard>
              </motion.div>
            )}

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.14 }}
              className={pendingActions.length > 0 ? "" : "lg:col-span-2"}
            >
              <GlassCard className="p-5 h-full">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold flex items-center gap-2">
                    <Activity className="w-4 h-4 text-cyan-400" />
                    Recent Activity
                  </h3>
                  <Link href="/wallet">
                    <Button variant="ghost" size="sm" className="text-xs text-white/50 hover:text-white">
                      View all <ChevronRight className="w-3 h-3 ml-1" />
                    </Button>
                  </Link>
                </div>
                <div className="space-y-3">
                  {recentActivity.map(item => (
                    <div key={item.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors">
                      <div className="p-2 rounded-lg bg-emerald-500/20">
                        <item.icon className="w-4 h-4 text-emerald-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium">{item.title}</p>
                        <p className="text-xs text-white/40">{item.time}</p>
                      </div>
                      <span className="text-sm font-semibold text-emerald-400">{item.amount}</span>
                    </div>
                  ))}
                </div>
              </GlassCard>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.16 }}
            >
              <GlassCard className="p-5 h-full">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-purple-400" />
                    Account Progress
                  </h3>
                  <span className="text-sm text-white/50">{completedSteps}/{accountCompletionSteps.length}</span>
                </div>
                <div className="mb-4">
                  <Progress value={accountProgress} className="h-2" />
                  <p className="text-xs text-white/40 mt-2">
                    {accountProgress === 100 ? "All set! You're ready to go." : "Complete these steps to unlock all features"}
                  </p>
                </div>
                <div className="space-y-2">
                  {accountCompletionSteps.map(step => (
                    <Link key={step.id} href={step.href}>
                      <div className={`flex items-center gap-3 p-2 rounded-lg transition-colors ${step.completed ? 'opacity-60' : 'hover:bg-white/5 cursor-pointer'}`}>
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center ${step.completed ? 'bg-emerald-500' : 'border border-white/30'}`}>
                          {step.completed && <Check className="w-3 h-3 text-white" />}
                        </div>
                        <span className={`text-sm ${step.completed ? 'line-through text-white/40' : ''}`}>{step.label}</span>
                      </div>
                    </Link>
                  ))}
                </div>
              </GlassCard>
            </motion.div>
          </div>

          {showWelcome ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.12 }}
              className="mb-8"
            >
              <GlassCard className="p-0 overflow-hidden relative" glow>
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500" />
                <button 
                  onClick={dismissWelcome}
                  className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors z-10"
                >
                  <X className="w-4 h-4 text-white/60" />
                </button>
                
                <div className="p-6 md:p-8 bg-gradient-to-br from-cyan-500/10 via-transparent to-purple-500/10">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 rounded-2xl bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border border-cyan-500/30">
                      <Heart className="w-8 h-8 text-cyan-400" />
                    </div>
                    <div>
                      <h2 className="text-2xl md:text-3xl font-bold">
                        Welcome, <span className="text-cyan-400">{getUserName()}</span>!
                      </h2>
                      <p className="text-white/60">Thanks for joining the Trust Circle</p>
                    </div>
                  </div>
                  
                  <div className="bg-slate-900/50 rounded-2xl p-5 border border-white/10 mb-6">
                    <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                      <Compass className="w-5 h-5 text-purple-400" />
                      This Is Your Personal Dashboard
                    </h3>
                    <p className="text-white/70 leading-relaxed mb-4">
                      Everything you need in one place. Track your Shells earnings, view your member status, 
                      connect with the community, and explore the entire Trust Layer ecosystem. This dashboard 
                      grows with you – as you participate more, you'll unlock new features and rewards.
                    </p>
                    <p className="text-white/60 text-sm">
                      You're now Member <span className="text-cyan-400 font-semibold">#{memberData?.memberNumber || '...'}</span> – 
                      that number is yours forever and represents your place in our story.
                    </p>
                  </div>
                  
                  <h3 className="font-semibold mb-4 flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-emerald-400" />
                    Quick Start Guide
                  </h3>
                  <div className="grid md:grid-cols-2 gap-3 mb-6">
                    <Link href="/wallet">
                      <div className="p-4 rounded-xl bg-slate-800/50 border border-white/10 hover:border-cyan-500/30 transition-all cursor-pointer group">
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-cyan-500/20">
                            <Wallet className="w-5 h-5 text-cyan-400" />
                          </div>
                          <div>
                            <p className="font-medium group-hover:text-cyan-400 transition-colors">Set Up Your Wallet</p>
                            <p className="text-xs text-white/50">Connect to start earning Shells</p>
                          </div>
                        </div>
                      </div>
                    </Link>
                    <Link href="/quests">
                      <div className="p-4 rounded-xl bg-slate-800/50 border border-white/10 hover:border-emerald-500/30 transition-all cursor-pointer group">
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-emerald-500/20">
                            <Target className="w-5 h-5 text-emerald-400" />
                          </div>
                          <div>
                            <p className="font-medium group-hover:text-emerald-400 transition-colors">Complete Daily Quests</p>
                            <p className="text-xs text-white/50">Earn Shells for missions on Zealy</p>
                          </div>
                        </div>
                      </div>
                    </Link>
                    <Link href="/community">
                      <div className="p-4 rounded-xl bg-slate-800/50 border border-white/10 hover:border-purple-500/30 transition-all cursor-pointer group">
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-purple-500/20">
                            <MessageCircle className="w-5 h-5 text-purple-400" />
                          </div>
                          <div>
                            <p className="font-medium group-hover:text-purple-400 transition-colors">Join ChronoChat</p>
                            <p className="text-xs text-white/50">Meet the community, get help</p>
                          </div>
                        </div>
                      </div>
                    </Link>
                    <Link href="/members">
                      <div className="p-4 rounded-xl bg-slate-800/50 border border-white/10 hover:border-amber-500/30 transition-all cursor-pointer group">
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-amber-500/20">
                            <Users className="w-5 h-5 text-amber-400" />
                          </div>
                          <div>
                            <p className="font-medium group-hover:text-amber-400 transition-colors">Explore Trust Circle</p>
                            <p className="text-xs text-white/50">Find trusted members near you</p>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-xl bg-gradient-to-r from-purple-500/10 to-cyan-500/10 border border-purple-500/20">
                    <div className="flex items-center gap-3">
                      <HelpCircle className="w-5 h-5 text-purple-400" />
                      <p className="text-sm text-white/70">Questions? The community is here to help.</p>
                    </div>
                    <Link href="/community">
                      <Button size="sm" className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:opacity-90">
                        Ask in ChronoChat <ArrowUpRight className="w-4 h-4 ml-1" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.12 }}
              className="mb-8"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <Newspaper className="w-5 h-5 text-cyan-400" />
                  Trust Layer News
                </h2>
                <Badge className="bg-cyan-500/20 text-cyan-400 border-cyan-500/30">
                  v{newsData?.currentVersion || '2.4'}
                </Badge>
              </div>
              <GlassCard className="p-0 overflow-hidden" glow>
                <div className="divide-y divide-white/5">
                  {newsData?.announcements?.map((item, idx) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + idx * 0.05 }}
                    className="p-4 hover:bg-white/5 transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-xl ${
                        item.type === 'announcement' ? 'bg-cyan-500/20' :
                        item.type === 'update' ? 'bg-emerald-500/20' :
                        'bg-purple-500/20'
                      }`}>
                        {item.type === 'announcement' ? <Megaphone className="w-4 h-4 text-cyan-400" /> :
                         item.type === 'update' ? <Activity className="w-4 h-4 text-emerald-400" /> :
                         <Clock className="w-4 h-4 text-purple-400" />}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold text-sm">{item.title}</h4>
                          {item.version && (
                            <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30 text-[10px]">
                              v{item.version}
                            </Badge>
                          )}
                          <Badge className={`text-[10px] ${
                            item.type === 'announcement' ? 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30' :
                            item.type === 'update' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' :
                            'bg-purple-500/20 text-purple-400 border-purple-500/30'
                          }`}>
                            {item.type === 'announcement' ? 'News' : item.type === 'update' ? 'Update' : 'Coming Soon'}
                          </Badge>
                        </div>
                        <p className="text-sm text-white/60">{item.content}</p>
                        <p className="text-xs text-white/30 mt-1">
                          {new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
              
              <div className="p-4 bg-gradient-to-r from-purple-500/10 to-cyan-500/10 border-t border-white/5">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-purple-500/20">
                      <Rocket className="w-5 h-5 text-purple-400" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold">Version {newsData?.upcomingVersion || '2.5'} Coming Soon</p>
                      <p className="text-xs text-white/50">Enhanced profiles, governance, and more</p>
                    </div>
                  </div>
                  <Link href="/roadmap">
                    <Button variant="outline" size="sm" className="border-purple-500/50 text-purple-400 hover:bg-purple-500/20">
                      View Roadmap <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  </Link>
                </div>
              </div>
            </GlassCard>
            </motion.div>
          )}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.13 }}
            className="mb-8"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Compass className="w-5 h-5 text-pink-400" />
                Explore Trust Layer
              </h2>
              <Badge className="bg-pink-500/20 text-pink-400 border-pink-500/30">
                Quick Links
              </Badge>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {exploreCategories.map((category) => (
                <GlassCard key={category.title} className="p-4">
                  <h3 className={`font-semibold text-sm mb-3 text-${category.color}-400 flex items-center gap-2`}>
                    <div className={`w-2 h-2 rounded-full bg-${category.color}-400`} />
                    {category.title}
                  </h3>
                  <div className="space-y-2">
                    {category.links.map((link) => (
                      <Link key={link.href} href={link.href}>
                        <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors cursor-pointer group">
                          <link.icon className="w-4 h-4 text-white/40 group-hover:text-white/70 transition-colors" />
                          <span className="text-sm text-white/70 group-hover:text-white transition-colors">{link.label}</span>
                          <ChevronRight className="w-3 h-3 text-white/20 group-hover:text-white/50 ml-auto transition-colors" />
                        </div>
                      </Link>
                    ))}
                  </div>
                </GlassCard>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="mb-8"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Globe className="w-5 h-5 text-purple-400" />
                Ecosystem
              </h2>
              <Link href="/ecosystem">
                <Button variant="ghost" size="sm" className="text-white/60 hover:text-white">
                  View All <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {ecosystemLinks.map((link) => (
                <Link key={link.href} href={link.href}>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="p-4 rounded-xl bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-white/10 hover:border-cyan-500/30 transition-all text-center group cursor-pointer"
                  >
                    <div className={`w-12 h-12 mx-auto mb-3 rounded-xl bg-${link.color}-500/20 flex items-center justify-center group-hover:scale-110 transition-transform`}>
                      <link.icon className={`w-6 h-6 text-${link.color}-400`} />
                    </div>
                    <p className="font-medium text-sm">{link.label}</p>
                    <p className="text-xs text-white/40 mt-1">{link.description}</p>
                  </motion.div>
                </Link>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-8"
          >
            <Link href="/studio">
              <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-purple-900/40 via-pink-900/40 to-purple-900/40 border border-purple-500/30 p-6 hover:border-purple-400/50 transition-all cursor-pointer group">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(168,85,247,0.2)_0%,_transparent_70%)]" />
                <div className="relative flex flex-col md:flex-row items-center gap-4">
                  <div className="p-4 rounded-2xl bg-purple-500/20 group-hover:bg-purple-500/30 transition-colors">
                    <Code className="w-10 h-10 text-purple-400" />
                  </div>
                  <div className="flex-1 text-center md:text-left">
                    <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30 mb-2">
                      <Sparkles className="w-3 h-3 mr-1" /> DarkWave Studios
                    </Badge>
                    <h3 className="text-xl font-bold mb-1">Build Your Own Apps</h3>
                    <p className="text-white/60 text-sm">Create decentralized applications with our no-code IDE. Launch your ideas on the Trust Layer.</p>
                  </div>
                  <Button className="bg-purple-500 hover:bg-purple-600 text-white">
                    Try Studios <ArrowUpRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </div>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="mb-8"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Users className="w-5 h-5 text-emerald-400" />
                Trust Circle
              </h2>
              <Link href="/members">
                <Button variant="ghost" size="sm" className="text-white/60 hover:text-white">
                  Browse Members <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
            </div>
            <GlassCard className="p-6">
              <div className="text-center py-8">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-emerald-500/20 flex items-center justify-center">
                  <MapPin className="w-8 h-8 text-emerald-400" />
                </div>
                <h3 className="text-lg font-bold mb-2">Find Trusted Members Near You</h3>
                <p className="text-white/60 mb-4 max-w-md mx-auto">
                  Connect with verified Trust Layer members in your area. Browse businesses and individuals in your local trust circle.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Link href="/members">
                    <Button className="bg-gradient-to-r from-emerald-500 to-cyan-500">
                      <MapPin className="w-4 h-4 mr-2" /> Browse Directory
                    </Button>
                  </Link>
                  <Link href="/profile/edit">
                    <Button variant="outline" className="border-emerald-500/50 text-emerald-400 hover:bg-emerald-500/20">
                      Complete Your Profile
                    </Button>
                  </Link>
                </div>
              </div>
            </GlassCard>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="grid md:grid-cols-2 gap-4 mb-8"
          >
            <GlassCard className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-xl bg-amber-500/20">
                  <Gamepad2 className="w-6 h-6 text-amber-400" />
                </div>
                <div>
                  <h3 className="font-bold">Chronicles</h3>
                  <p className="text-sm text-white/60">Your game status</p>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 rounded-lg bg-white/5">
                  <span className="text-white/60">Character Status</span>
                  <Badge className="bg-white/10">Not Created</Badge>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-white/5">
                  <span className="text-white/60">Game Items</span>
                  <span className="font-bold">0</span>
                </div>
                <Link href="/chronicles">
                  <Button className="w-full mt-2 bg-gradient-to-r from-amber-500 to-orange-500">
                    Enter Chronicles <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </GlassCard>

            <GlassCard className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-xl bg-cyan-500/20">
                  <Activity className="w-6 h-6 text-cyan-400" />
                </div>
                <div>
                  <h3 className="font-bold">Recent Activity</h3>
                  <p className="text-sm text-white/60">Your latest actions</p>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5">
                  <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center">
                    <Check className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Signed in</p>
                    <p className="text-xs text-white/40">Just now</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5">
                  <div className="w-8 h-8 rounded-full bg-cyan-500/20 flex items-center justify-center">
                    <Gift className="w-4 h-4 text-cyan-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Shell airdrop received</p>
                    <p className="text-xs text-white/40">+25 Shells</p>
                  </div>
                </div>
              </div>
            </GlassCard>
          </motion.div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
