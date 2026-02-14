import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import {
  User,
  Shield,
  Star,
  Award,
  Network,
  Activity,
  Settings,
  Bell,
  CheckCircle,
  Clock,
  TrendingUp,
  Users,
  MessageSquare,
  Heart,
  Share2,
  Copy,
  ExternalLink,
  BadgeCheck,
  Wallet,
  Gift,
  ChevronRight,
  Globe,
  Lock
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { GlassCard } from "@/components/glass-card";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";


const GlowOrb = ({ color, size, top, left, delay = 0 }: { color: string; size: number; top: string; left: string; delay?: number }) => (
  <motion.div
    className="absolute rounded-full blur-3xl opacity-20 pointer-events-none"
    style={{ background: color, width: size, height: size, top, left }}
    animate={{ scale: [1, 1.2, 1], opacity: [0.15, 0.25, 0.15] }}
    transition={{ duration: 8, repeat: Infinity, delay }}
  />
);

export default function MemberPortal() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<"overview" | "connections" | "activity" | "settings">("overview");

  const { data: memberCard } = useQuery({
    queryKey: ["/api/member-trust-card"],
    enabled: !!user,
  });

  const { data: shellWallet } = useQuery({
    queryKey: ["/api/shells/wallet"],
    enabled: !!user,
  });

  const trustScore = 85;
  const memberSince = (user as any)?.metadata?.createdTime ? new Date((user as any).metadata.createdTime).toLocaleDateString() : "2024";

  const recentActivity = [
    { type: "connection", text: "Connected with TrustCorp Inc.", time: "2 hours ago", icon: Users },
    { type: "verification", text: "Identity verification completed", time: "1 day ago", icon: CheckCircle },
    { type: "reward", text: "Earned 500 Shells from referral", time: "3 days ago", icon: Gift },
    { type: "activity", text: "Profile updated", time: "1 week ago", icon: Settings },
  ];

  const connections = [
    { name: "TrustCorp Inc.", type: "business", status: "verified", since: "Jan 2026" },
    { name: "Sarah Johnson", type: "individual", status: "verified", since: "Dec 2025" },
    { name: "DarkWave Studios", type: "business", status: "pending", since: "Jan 2026" },
  ];

  const copyReferralLink = () => {
    const link = `https://dwsc.io/join/${(user as any)?.uid?.slice(0, 8) || "abc123"}`;
    navigator.clipboard.writeText(link);
    toast({ title: "Copied!", description: "Referral link copied to clipboard" });
  };

  if (!user) {
    return (
      <div className="min-h-screen relative overflow-hidden pt-20 pb-12" style={{ background: "linear-gradient(180deg, #070b16, #0c1222, #070b16)" }}>
      <GlowOrb color="linear-gradient(135deg, #06b6d4, #3b82f6)" size={500} top="-5%" left="60%" />
      <GlowOrb color="linear-gradient(135deg, #8b5cf6, #ec4899)" size={400} top="40%" left="-10%" delay={3} />
        <div className="container mx-auto px-4 max-w-4xl">
          <GlassCard glow className="p-12 text-center">
            <User className="w-16 h-16 text-cyan-400 mx-auto mb-6" />
            <h1 className="text-2xl font-bold text-white mb-4">Member Portal</h1>
            <p className="text-white/70 mb-6">Sign in to access your member dashboard</p>
            <Link href="/login">
              <Button className="bg-gradient-to-r from-cyan-600 to-blue-600" data-testid="button-login">
                Sign In
              </Button>
            </Link>
          </GlassCard>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 pt-20 pb-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <Badge className="mb-2 bg-cyan-500/20 text-cyan-400 border-cyan-500/30">
                Individual Member
              </Badge>
              <h1 className="text-3xl font-bold text-white">Member Portal</h1>
              <p className="text-white/60">Manage your trust profile and connections</p>
            </div>
            <div className="flex gap-3">
              <Link href="/membership-charter">
                <Button variant="outline" className="border-white/20" data-testid="link-charter">
                  <Shield className="w-4 h-4 mr-2" />
                  Charter
                </Button>
              </Link>
              <Link href="/settings">
                <Button variant="outline" className="border-white/20" data-testid="link-settings">
                  <Settings className="w-4 h-4 mr-2" />
                  Settings
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>

        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {[
            { id: "overview", label: "Overview", icon: Activity },
            { id: "connections", label: "Connections", icon: Network },
            { id: "activity", label: "Activity", icon: Clock },
            { id: "settings", label: "Profile", icon: User },
          ].map((tab) => (
            <Button
              key={tab.id}
              variant={activeTab === tab.id ? "default" : "outline"}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-shrink-0 ${activeTab === tab.id ? "bg-cyan-600" : "border-white/20"}`}
              data-testid={`tab-${tab.id}`}
            >
              <tab.icon className="w-4 h-4 mr-2" />
              {tab.label}
            </Button>
          ))}
        </div>

        {activeTab === "overview" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-6"
          >
            <div className="lg:col-span-2 space-y-6">
              <GlassCard glow className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-cyan-500/30 to-blue-500/30 flex items-center justify-center text-3xl">
                    {user.displayName?.[0] || user.email?.[0] || "U"}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h2 className="text-xl font-bold text-white">{user.displayName || "Member"}</h2>
                      <BadgeCheck className="w-5 h-5 text-cyan-400" />
                    </div>
                    <p className="text-white/60 text-sm mb-2">{user.email}</p>
                    <div className="flex flex-wrap gap-2">
                      <Badge className="bg-cyan-500/20 text-cyan-400 border-cyan-500/30">Pioneer</Badge>
                      <Badge variant="outline" className="border-white/20 text-white/60">
                        Member since {memberSince}
                      </Badge>
                    </div>
                  </div>
                </div>
              </GlassCard>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <GlassCard className="p-4 text-center">
                  <Shield className="w-6 h-6 text-cyan-400 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-white">{trustScore}</p>
                  <p className="text-xs text-white/60">Trust Score</p>
                </GlassCard>
                <GlassCard className="p-4 text-center">
                  <Users className="w-6 h-6 text-purple-400 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-white">{connections.length}</p>
                  <p className="text-xs text-white/60">Connections</p>
                </GlassCard>
                <GlassCard className="p-4 text-center">
                  <Wallet className="w-6 h-6 text-green-400 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-white">{(shellWallet as any)?.balance?.toLocaleString() || "0"}</p>
                  <p className="text-xs text-white/60">Shells</p>
                </GlassCard>
                <GlassCard className="p-4 text-center">
                  <Star className="w-6 h-6 text-amber-400 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-white">{(memberCard as any)?.rewardPoints || 0}</p>
                  <p className="text-xs text-white/60">Points</p>
                </GlassCard>
              </div>

              <GlassCard glow className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-white">Recent Activity</h3>
                  <Button variant="ghost" size="sm" className="text-cyan-400" data-testid="button-view-all-activity">
                    View All <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
                <div className="space-y-3">
                  {recentActivity.map((item, i) => (
                    <div key={i} className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
                      <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center">
                        <item.icon className="w-5 h-5 text-cyan-400" />
                      </div>
                      <div className="flex-1">
                        <p className="text-white text-sm">{item.text}</p>
                        <p className="text-white/50 text-xs">{item.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </GlassCard>
            </div>

            <div className="space-y-6">
              <GlassCard glow className="p-6">
                <h3 className="font-bold text-white mb-4">Trust Layer Hash</h3>
                {(memberCard as any)?.dataHash ? (
                  <div className="p-3 bg-slate-800/50 rounded-lg font-mono text-xs text-cyan-400 break-all">
                    {(memberCard as any).dataHash}
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <Lock className="w-8 h-8 text-white/30 mx-auto mb-2" />
                    <p className="text-white/60 text-sm mb-3">Generate your Trust Layer Hash</p>
                    <Link href="/hallmark">
                      <Button size="sm" className="bg-cyan-600" data-testid="button-generate-hash">
                        Generate Now
                      </Button>
                    </Link>
                  </div>
                )}
              </GlassCard>

              <GlassCard glow className="p-6">
                <h3 className="font-bold text-white mb-4">Referral Program</h3>
                <p className="text-white/60 text-sm mb-4">
                  Earn Shells for every person you refer to the Trust Layer
                </p>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-white/60">Base reward</span>
                    <span className="text-green-400 font-mono">1,000 Shells</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-white/60">With purchase</span>
                    <span className="text-green-400 font-mono">Up to 10x</span>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-white/10">
                  <Button
                    onClick={copyReferralLink}
                    variant="outline"
                    className="w-full border-cyan-500/30 text-cyan-400"
                    data-testid="button-copy-referral"
                  >
                    <Copy className="w-4 h-4 mr-2" />
                    Copy Referral Link
                  </Button>
                </div>
                <Link href="/referral-program">
                  <Button variant="ghost" size="sm" className="w-full mt-2 text-white/60" data-testid="link-referral-details">
                    View Details <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </Link>
              </GlassCard>

              <GlassCard glow className="p-6">
                <h3 className="font-bold text-white mb-4">Quick Actions</h3>
                <div className="space-y-2">
                  <Link href="/directory">
                    <Button variant="outline" className="w-full justify-start border-white/10" data-testid="link-directory">
                      <Globe className="w-4 h-4 mr-2" />
                      Browse Directory
                    </Button>
                  </Link>
                  <Link href="/wallet">
                    <Button variant="outline" className="w-full justify-start border-white/10" data-testid="link-wallet">
                      <Wallet className="w-4 h-4 mr-2" />
                      My Wallet
                    </Button>
                  </Link>
                  <Link href="/hallmark">
                    <Button variant="outline" className="w-full justify-start border-white/10" data-testid="link-hallmark">
                      <Award className="w-4 h-4 mr-2" />
                      Membership Card
                    </Button>
                  </Link>
                </div>
              </GlassCard>
            </div>
          </motion.div>
        )}

        {activeTab === "connections" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <GlassCard glow className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-white text-lg">Your Connections</h3>
                <Link href="/directory">
                  <Button className="bg-cyan-600" data-testid="button-find-connections">
                    <Users className="w-4 h-4 mr-2" />
                    Find Connections
                  </Button>
                </Link>
              </div>
              <div className="space-y-4">
                {connections.map((conn, i) => (
                  <div key={i} className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                        conn.type === "business" 
                          ? "bg-purple-500/20 text-purple-400" 
                          : "bg-cyan-500/20 text-cyan-400"
                      }`}>
                        {conn.type === "business" ? <Network className="w-6 h-6" /> : <User className="w-6 h-6" />}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-white">{conn.name}</p>
                          {conn.status === "verified" && <BadgeCheck className="w-4 h-4 text-cyan-400" />}
                        </div>
                        <p className="text-sm text-white/50">Connected {conn.since}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={conn.status === "verified" 
                        ? "bg-green-500/20 text-green-400 border-green-500/30"
                        : "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
                      }>
                        {conn.status}
                      </Badge>
                      <Button variant="ghost" size="sm" data-testid={`button-view-connection-${i}`}>
                        <ExternalLink className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </GlassCard>
          </motion.div>
        )}

        {activeTab === "activity" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <GlassCard glow className="p-6">
              <h3 className="font-bold text-white text-lg mb-6">Activity History</h3>
              <div className="space-y-4">
                {[...recentActivity, ...recentActivity].map((item, i) => (
                  <div key={i} className="flex items-start gap-4 p-4 bg-white/5 rounded-xl">
                    <div className="w-10 h-10 rounded-lg bg-cyan-500/20 flex items-center justify-center flex-shrink-0">
                      <item.icon className="w-5 h-5 text-cyan-400" />
                    </div>
                    <div className="flex-1">
                      <p className="text-white">{item.text}</p>
                      <p className="text-sm text-white/50">{item.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </GlassCard>
          </motion.div>
        )}

        {activeTab === "settings" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="max-w-2xl"
          >
            <GlassCard glow className="p-6">
              <h3 className="font-bold text-white text-lg mb-6">Profile Settings</h3>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm text-white/60 mb-2">Display Name</label>
                  <input
                    type="text"
                    defaultValue={user.displayName || ""}
                    className="w-full p-3 bg-white/5 border border-white/10 rounded-lg text-white"
                    data-testid="input-display-name"
                  />
                </div>
                <div>
                  <label className="block text-sm text-white/60 mb-2">Email</label>
                  <input
                    type="email"
                    defaultValue={user.email || ""}
                    disabled
                    className="w-full p-3 bg-white/5 border border-white/10 rounded-lg text-white/50"
                    data-testid="input-email"
                  />
                </div>
                <div>
                  <label className="block text-sm text-white/60 mb-2">Bio</label>
                  <textarea
                    rows={3}
                    placeholder="Tell others about yourself..."
                    className="w-full p-3 bg-white/5 border border-white/10 rounded-lg text-white resize-none"
                    data-testid="input-bio"
                  />
                </div>
                <Button className="bg-cyan-600" data-testid="button-save-profile">
                  Save Changes
                </Button>
              </div>
            </GlassCard>
          </motion.div>
        )}
      </div>
    </div>
  );
}
