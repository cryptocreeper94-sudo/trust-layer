import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { useQuery, useQueryClient } from "@tanstack/react-query";
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
  Lock,
  Phone,
  Smartphone,
  Loader2,
  AlertCircle,
  Trash2,
  Fingerprint
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { GlassCard } from "@/components/glass-card";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { PasskeyManager } from "@/components/passkey-manager";
import { authFetch } from "@/hooks/use-firebase-auth";

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
      <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 pt-20 pb-12">
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
            className="max-w-2xl space-y-6"
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

            <PhoneSettingsCard />

            <GlassCard glow className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <Fingerprint className="w-5 h-5 text-cyan-400" />
                <h3 className="font-bold text-white text-lg">Biometric Login</h3>
              </div>
              <p className="text-white/60 text-sm mb-4">
                Set up fingerprint or Face ID to sign in instantly and go straight to your portal.
              </p>
              <PasskeyManager />
            </GlassCard>
          </motion.div>
        )}
      </div>
    </div>
  );
}

function PhoneSettingsCard() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [phoneInput, setPhoneInput] = useState("");
  const [smsOptIn, setSmsOptIn] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [step, setStep] = useState<"input" | "verify">("input");
  const [saving, setSaving] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [removing, setRemoving] = useState(false);

  const { data: phoneSettings, isLoading } = useQuery<{
    phone: string | null;
    verified: boolean;
    smsOptIn: boolean;
    verifiedAt: string | null;
  }>({
    queryKey: ["/api/user/phone-settings"],
    queryFn: async () => {
      const res = await authFetch("/api/user/phone-settings");
      if (!res.ok) throw new Error("Failed to load");
      return res.json();
    },
  });

  const formatPhone = (value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, 10);
    if (digits.length <= 3) return digits;
    if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
  };

  const handleSavePhone = async () => {
    const digits = phoneInput.replace(/\D/g, "");
    if (digits.length !== 10) {
      toast({ title: "Invalid phone number", description: "Please enter a 10-digit US phone number", variant: "destructive" });
      return;
    }
    if (!smsOptIn) {
      toast({ title: "Consent required", description: "Please agree to receive SMS messages", variant: "destructive" });
      return;
    }
    setSaving(true);
    try {
      const res = await authFetch("/api/user/phone-settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phoneNumber: digits, smsOptIn: true }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save");
      setStep("verify");
      toast({ title: "Code sent", description: "Check your phone for the verification code" });
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const handleVerify = async () => {
    if (verificationCode.length !== 6) {
      toast({ title: "Invalid code", description: "Enter the 6-digit code from your text message", variant: "destructive" });
      return;
    }
    setVerifying(true);
    try {
      const res = await authFetch("/api/user/phone-settings/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: verificationCode }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Verification failed");
      queryClient.invalidateQueries({ queryKey: ["/api/user/phone-settings"] });
      setStep("input");
      setVerificationCode("");
      toast({ title: "Verified", description: "Your phone number has been verified" });
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setVerifying(false);
    }
  };

  const handleRemove = async () => {
    setRemoving(true);
    try {
      const res = await authFetch("/api/user/phone-settings", { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to remove");
      queryClient.invalidateQueries({ queryKey: ["/api/user/phone-settings"] });
      setPhoneInput("");
      setSmsOptIn(false);
      setStep("input");
      toast({ title: "Removed", description: "Phone number removed" });
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setRemoving(false);
    }
  };

  if (isLoading) {
    return (
      <GlassCard glow className="p-6">
        <div className="flex items-center gap-3 text-white/60">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span>Loading phone settings...</span>
        </div>
      </GlassCard>
    );
  }

  if (phoneSettings?.verified) {
    const masked = phoneSettings.phone ? `(***) ***-${phoneSettings.phone.slice(-4)}` : "Verified";
    return (
      <GlassCard glow className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <Smartphone className="w-5 h-5 text-cyan-400" />
          <h3 className="font-bold text-white text-lg">Phone & SMS</h3>
          <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Verified</Badge>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-white font-medium" data-testid="text-verified-phone">{masked}</p>
            <p className="text-white/50 text-sm mt-1">SMS notifications enabled</p>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="border-red-500/30 text-red-400 hover:bg-red-500/10"
            onClick={handleRemove}
            disabled={removing}
            data-testid="button-remove-phone"
          >
            {removing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4 mr-1" />}
            Remove
          </Button>
        </div>
      </GlassCard>
    );
  }

  return (
    <GlassCard glow className="p-6">
      <div className="flex items-center gap-3 mb-4">
        <Smartphone className="w-5 h-5 text-cyan-400" />
        <h3 className="font-bold text-white text-lg">Phone & SMS</h3>
      </div>

      {step === "input" ? (
        <div className="space-y-4">
          <p className="text-white/60 text-sm">
            Add your phone number to receive verification codes, security alerts, and account notifications via text message.
          </p>

          <div>
            <label className="block text-sm text-white/60 mb-2">Phone Number</label>
            <div className="flex items-center gap-2">
              <span className="text-white/50 bg-white/5 border border-white/10 rounded-lg p-3 text-sm">+1</span>
              <input
                type="tel"
                value={phoneInput}
                onChange={(e) => setPhoneInput(formatPhone(e.target.value))}
                placeholder="(555) 123-4567"
                className="flex-1 p-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-white/30"
                data-testid="input-phone-number"
              />
            </div>
          </div>

          <label className="flex items-start gap-3 cursor-pointer group">
            <input
              type="checkbox"
              checked={smsOptIn}
              onChange={(e) => setSmsOptIn(e.target.checked)}
              className="mt-1 w-4 h-4 rounded border-white/20 bg-white/5 text-cyan-500 focus:ring-cyan-500/50"
              data-testid="checkbox-sms-opt-in"
            />
            <span className="text-white/70 text-sm leading-relaxed">
              I agree to receive SMS messages from Trust Layer including verification codes, security alerts, and account notifications.
              Message and data rates may apply. You can opt out at any time by removing your phone number.
            </span>
          </label>

          <Button
            className="bg-cyan-600 hover:bg-cyan-700 w-full"
            onClick={handleSavePhone}
            disabled={saving || !smsOptIn || phoneInput.replace(/\D/g, "").length !== 10}
            data-testid="button-save-phone"
          >
            {saving ? (
              <><Loader2 className="w-4 h-4 animate-spin mr-2" /> Sending code...</>
            ) : (
              <><Phone className="w-4 h-4 mr-2" /> Verify Phone Number</>
            )}
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="bg-cyan-500/10 border border-cyan-500/20 rounded-lg p-4">
            <div className="flex items-center gap-2 text-cyan-400 mb-2">
              <AlertCircle className="w-4 h-4" />
              <span className="font-medium text-sm">Verification code sent</span>
            </div>
            <p className="text-white/60 text-sm">
              Enter the 6-digit code we sent to your phone. The code expires in 10 minutes.
            </p>
          </div>

          <div>
            <label className="block text-sm text-white/60 mb-2">Verification Code</label>
            <input
              type="text"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
              placeholder="000000"
              maxLength={6}
              className="w-full p-3 bg-white/5 border border-white/10 rounded-lg text-white text-center text-2xl tracking-[0.5em] font-mono placeholder:text-white/20 placeholder:tracking-[0.5em]"
              data-testid="input-verification-code"
            />
          </div>

          <div className="flex gap-3">
            <Button
              variant="outline"
              className="flex-1 border-white/10"
              onClick={() => { setStep("input"); setVerificationCode(""); }}
              data-testid="button-back-to-phone"
            >
              Back
            </Button>
            <Button
              className="flex-1 bg-cyan-600 hover:bg-cyan-700"
              onClick={handleVerify}
              disabled={verifying || verificationCode.length !== 6}
              data-testid="button-verify-code"
            >
              {verifying ? (
                <><Loader2 className="w-4 h-4 animate-spin mr-2" /> Verifying...</>
              ) : (
                <><CheckCircle className="w-4 h-4 mr-2" /> Verify</>
              )}
            </Button>
          </div>
        </div>
      )}
    </GlassCard>
  );
}
