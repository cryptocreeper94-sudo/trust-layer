import { motion } from "framer-motion";
import { Link } from "wouter";
import { 
  ArrowLeft, Gift, Users, Coins, Heart, Trophy, Sparkles, Check, 
  Wallet, TrendingUp, Zap, Calendar, ArrowUpRight, Shield, Target,
  Gamepad2, MessageCircle, Globe, Code, ImageIcon, PieChart, 
  ArrowLeftRight, Droplets, Rocket, Download, ExternalLink, Star,
  Crown, Activity, Bell, Settings, ChevronRight, Award, MapPin
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { GlassCard } from "@/components/glass-card";
import { Footer } from "@/components/footer";
import { useSimpleAuth } from "@/hooks/use-simple-auth";
import { useQuery } from "@tanstack/react-query";
import { Progress } from "@/components/ui/progress";
import { MemberBadge } from "@/components/member-badge";
import { WalletButton } from "@/components/wallet-button";
import { MobileNav } from "@/components/mobile-nav";

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
      const res = await fetch("/api/user/member-number");
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
      const res = await fetch("/api/user/reward-profile");
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
      const res = await fetch("/api/balance");
      if (!res.ok) return { totalTokens: 0, stakedTokens: 0, liquidTokens: 0 };
      return res.json();
    },
    enabled: !!user,
  });

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

  const progressToFounders = rewardProfile?.profile?.totalQuestsCompleted 
    ? Math.min((rewardProfile.profile.totalQuestsCompleted / 50) * 100, 100) 
    : 0;

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
  <text x="24" y="40" font-family="system-ui, sans-serif" font-size="18" font-weight="bold" fill="#22d3ee">DarkWave Trust Layer</text>
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
            <span className="font-display font-bold text-xl tracking-tight">DarkWave</span>
          </Link>
          <div className="flex items-center gap-2 sm:gap-3">
            {user?.id && <MemberBadge userId={user.id.toString()} />}
            <WalletButton />
            <MobileNav />
          </div>
        </div>
      </nav>

      <main className="pt-20 pb-12">
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
                        <p className="text-white/60 flex items-center gap-2">
                          <Shield className="w-4 h-4 text-emerald-400" />
                          Verified Trust Layer Member
                          {memberData?.isEarlyAdopter && (
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
                        <p className="text-white/50 text-sm mb-1">Est. SIG at TGE</p>
                        <p className="text-2xl font-bold text-emerald-400">{rewardProfile?.conversion?.estimatedDwc?.toLocaleString() || 0}</p>
                        <p className="text-xs text-white/40">April 11, 2026</p>
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
                  <h3 className="font-bold">DarkWave Chronicles</h3>
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
