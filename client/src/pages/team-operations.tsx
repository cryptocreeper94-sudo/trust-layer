import { useState } from "react";
import { motion } from "framer-motion";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "wouter";
import { 
  Shield, Eye, Lock, Users, Shell, Activity, CheckCircle, XCircle,
  AlertTriangle, Trophy, TrendingUp, ExternalLink, RefreshCw, Clock,
  Sparkles, Target, ArrowRight, Coins, DollarSign, Wallet, Percent,
  Send, FileText, Calendar, BarChart3, Zap, PlayCircle, PauseCircle,
  Download, Upload, ChevronRight, Bell, Settings, LogOut, Home
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { GlassCard } from "@/components/glass-card";

const GlowOrb = ({ color, size, top, left, delay = 0 }: { color: string; size: number; top: string; left: string; delay?: number }) => (
  <motion.div
    className="absolute rounded-full blur-3xl opacity-15 pointer-events-none"
    style={{ background: color, width: size, height: size, top, left }}
    animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }}
    transition={{ duration: 8, repeat: Infinity, delay }}
  />
);

function PinEntry({ onSuccess }: { onSuccess: () => void }) {
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const [shake, setShake] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPin, setShowPin] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async () => {
    if (pin.length < 4) {
      setError("PIN must be at least 4 digits");
      return;
    }
    
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/team/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pin }),
      });
      
      const data = await res.json();
      
      if (res.ok) {
        sessionStorage.setItem("teamAuth", "true");
        sessionStorage.setItem("teamToken", data.token);
        toast({ title: "Access Granted", description: "Welcome to Operations Center" });
        onSuccess();
      } else {
        setError(data.error || "Invalid PIN");
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
    <div className="min-h-screen bg-slate-950 flex items-center justify-center relative overflow-hidden">
      <GlowOrb color="linear-gradient(135deg, #10b981, #06b6d4)" size={400} top="10%" left="10%" />
      <GlowOrb color="linear-gradient(135deg, #8b5cf6, #ec4899)" size={300} top="60%" left="70%" delay={2} />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`relative z-10 bg-slate-900/90 backdrop-blur-xl border border-emerald-500/30 rounded-3xl p-8 max-w-md w-full mx-4 ${shake ? 'animate-shake' : ''}`}
        style={{ boxShadow: "0 0 80px rgba(16,185,129,0.15)" }}
      >
        <div className="text-center mb-8">
          <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-emerald-500/30 to-cyan-500/30 border border-emerald-500/50 flex items-center justify-center">
            <Shield className="w-10 h-10 text-emerald-400" />
          </div>
          <Badge className="mb-3 bg-emerald-500/20 text-emerald-400 border-emerald-500/40">AUTHORIZED PERSONNEL ONLY</Badge>
          <h1 className="text-2xl font-bold text-white mb-2">Operations Center</h1>
          <p className="text-gray-400 text-sm">Trust Layer • Team Access</p>
        </div>

        <div className="space-y-4">
          <div className="relative">
            <input
              type={showPin ? "text" : "password"}
              value={pin}
              onChange={(e) => { setPin(e.target.value.replace(/\D/g, '')); setError(""); }}
              onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
              placeholder="Enter Access Code"
              maxLength={8}
              className="w-full px-4 py-4 bg-slate-800/50 border border-emerald-500/30 rounded-xl text-white placeholder-gray-500 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 pr-12 text-center text-2xl tracking-[0.3em] font-mono"
              autoFocus
              data-testid="input-ops-pin"
            />
            <button
              type="button"
              onClick={() => setShowPin(!showPin)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
            >
              <Eye className="w-5 h-5" />
            </button>
          </div>

          {error && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-red-400 text-sm text-center"
            >
              {error}
            </motion.p>
          )}

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSubmit}
            disabled={loading || pin.length < 4}
            className="w-full py-4 bg-gradient-to-r from-emerald-600 to-cyan-600 rounded-xl text-white font-bold disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:shadow-lg hover:shadow-emerald-500/30 text-lg"
            data-testid="button-ops-auth"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <RefreshCw className="w-5 h-5 animate-spin" />
                Authenticating...
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                <Lock className="w-5 h-5" />
                ACCESS OPERATIONS
              </span>
            )}
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}

function OperationsDashboard() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<"overview" | "daily" | "airdrop" | "analytics">("overview");
  const [processingAirdrop, setProcessingAirdrop] = useState(false);

  const getTeamHeaders = () => ({
    "Content-Type": "application/json",
    "x-team-token": sessionStorage.getItem("teamToken") || "",
  });

  const { data: health } = useQuery({
    queryKey: ["/api/system/health"],
    queryFn: async () => {
      const res = await fetch("/api/system/health");
      return res.json();
    },
    refetchInterval: 30000,
  });

  const { data: zealyStats } = useQuery({
    queryKey: ["/api/team/zealy/stats"],
    queryFn: async () => {
      const res = await fetch("/api/team/zealy/stats", { headers: getTeamHeaders() });
      if (!res.ok) return {};
      return res.json();
    },
  });

  const { data: presaleStats } = useQuery({
    queryKey: ["/api/presale/stats"],
    queryFn: async () => {
      const res = await fetch("/api/presale/stats");
      if (!res.ok) return {};
      return res.json();
    },
    refetchInterval: 30000,
  });

  const { data: dailyReport } = useQuery({
    queryKey: ["/api/team/daily-report"],
    queryFn: async () => {
      const res = await fetch("/api/team/daily-report", { headers: getTeamHeaders() });
      if (!res.ok) return { pendingShells: 0, pendingQuests: 0, pendingReferrals: 0, pendingTotal: 0 };
      return res.json();
    },
    refetchInterval: 60000,
  });

  const { data: recentEvents = [] } = useQuery({
    queryKey: ["/api/team/zealy/recent-events"],
    queryFn: async () => {
      const res = await fetch("/api/team/zealy/recent-events", { headers: getTeamHeaders() });
      if (!res.ok) return [];
      return res.json();
    },
  });

  const submitDailyAirdrop = useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/team/submit-daily-airdrop", {
        method: "POST",
        headers: getTeamHeaders(),
      });
      if (!res.ok) throw new Error("Failed to submit");
      return res.json();
    },
    onSuccess: (data) => {
      toast({ 
        title: "Daily Airdrop Submitted", 
        description: `Processed ${data.processed || 0} rewards successfully` 
      });
      queryClient.invalidateQueries({ queryKey: ["/api/team/daily-report"] });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to process airdrop", variant: "destructive" });
    },
  });

  const handleLogout = () => {
    sessionStorage.removeItem("teamAuth");
    sessionStorage.removeItem("teamToken");
    window.location.reload();
  };

  const overallStatus = health?.services?.every((s: any) => s.status === "operational") 
    ? "operational" 
    : health?.services?.some((s: any) => s.status === "down") 
      ? "down" 
      : "degraded";

  const currentDate = new Date().toLocaleDateString('en-US', { 
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' 
  });

  return (
    <div className="min-h-screen bg-slate-950 relative">
      <GlowOrb color="linear-gradient(135deg, #10b981, #06b6d4)" size={500} top="-10%" left="-5%" />
      <GlowOrb color="linear-gradient(135deg, #8b5cf6, #ec4899)" size={400} top="50%" left="80%" delay={2} />

      {/* Header */}
      <header className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur-xl border-b border-emerald-500/20">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500/30 to-cyan-500/30 border border-emerald-500/50 flex items-center justify-center">
                <Shield className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-white">Operations Center</h1>
                <p className="text-xs text-gray-400">{currentDate}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full ${
                overallStatus === "operational" ? "bg-green-500/20 border border-green-500/40" :
                overallStatus === "degraded" ? "bg-yellow-500/20 border border-yellow-500/40" :
                "bg-red-500/20 border border-red-500/40"
              }`}>
                <div className={`w-2 h-2 rounded-full ${
                  overallStatus === "operational" ? "bg-green-500 animate-pulse" :
                  overallStatus === "degraded" ? "bg-yellow-500 animate-pulse" :
                  "bg-red-500 animate-pulse"
                }`} />
                <span className={`text-xs font-medium ${
                  overallStatus === "operational" ? "text-green-400" :
                  overallStatus === "degraded" ? "text-yellow-400" :
                  "text-red-400"
                }`}>
                  {overallStatus === "operational" ? "ALL SYSTEMS GO" : overallStatus.toUpperCase()}
                </span>
              </div>
              <Button variant="ghost" size="sm" onClick={handleLogout} className="text-gray-400 hover:text-white">
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="bg-slate-900/50 border-b border-white/5">
        <div className="container mx-auto px-4">
          <nav className="flex gap-1">
            {[
              { id: "overview", label: "Overview", icon: Home },
              { id: "daily", label: "Daily Report", icon: Calendar },
              { id: "airdrop", label: "Airdrop Queue", icon: Send },
              { id: "analytics", label: "Analytics", icon: BarChart3 },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-all border-b-2 ${
                  activeTab === tab.id 
                    ? "text-emerald-400 border-emerald-400 bg-emerald-500/5" 
                    : "text-gray-400 border-transparent hover:text-white hover:bg-white/5"
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      <main className="container mx-auto px-4 py-6 space-y-6">
        {/* Overview Tab */}
        {activeTab === "overview" && (
          <>
            {/* Key Metrics */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: "Presale Raised", value: `$${presaleStats?.totalRaised?.toLocaleString() || "0"}`, icon: DollarSign, color: "emerald", subtext: `${presaleStats?.tokensSold?.toLocaleString() || 0} SIG sold` },
                { label: "Active Members", value: zealyStats?.participants || "0", icon: Users, color: "cyan", subtext: "Zealy participants" },
                { label: "Shells Distributed", value: zealyStats?.totalShellsGranted?.toLocaleString() || "0", icon: Shell, color: "purple", subtext: "Total rewards" },
                { label: "Pending Airdrops", value: dailyReport?.pendingTotal || "0", icon: Send, color: "amber", subtext: "Ready to process" },
              ].map((metric, i) => (
                <motion.div
                  key={metric.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <div className={`p-4 rounded-xl bg-slate-900/80 border border-${metric.color}-500/20 hover:border-${metric.color}-500/40 transition-all`}>
                    <div className="flex items-center justify-between mb-2">
                      <metric.icon className={`w-5 h-5 text-${metric.color}-400`} />
                      <Badge variant="outline" className={`text-${metric.color}-400 border-${metric.color}-500/30 text-[10px]`}>LIVE</Badge>
                    </div>
                    <p className="text-2xl font-bold text-white">{metric.value}</p>
                    <p className="text-xs text-gray-500">{metric.label}</p>
                    <p className="text-[10px] text-gray-600 mt-1">{metric.subtext}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Quick Actions */}
            <GlassCard className="p-6" glow>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Zap className="w-5 h-5 text-amber-400" />
                  Quick Actions
                </h3>
                <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">TEAM ACCESS</Badge>
              </div>
              
              <div className="grid md:grid-cols-3 gap-4">
                <button
                  onClick={() => setActiveTab("daily")}
                  className="p-4 rounded-xl bg-gradient-to-br from-emerald-500/10 to-cyan-500/10 border border-emerald-500/30 hover:border-emerald-400/50 transition-all text-left group"
                >
                  <div className="flex items-center justify-between mb-2">
                    <Calendar className="w-6 h-6 text-emerald-400" />
                    <ChevronRight className="w-4 h-4 text-gray-500 group-hover:text-emerald-400 transition-colors" />
                  </div>
                  <p className="font-semibold text-white">View Daily Report</p>
                  <p className="text-xs text-gray-400">Check pending items</p>
                </button>

                <button
                  onClick={() => submitDailyAirdrop.mutate()}
                  disabled={submitDailyAirdrop.isPending || (dailyReport?.pendingTotal || 0) === 0}
                  className="p-4 rounded-xl bg-gradient-to-br from-amber-500/10 to-orange-500/10 border border-amber-500/30 hover:border-amber-400/50 transition-all text-left group disabled:opacity-50"
                >
                  <div className="flex items-center justify-between mb-2">
                    <Send className="w-6 h-6 text-amber-400" />
                    {submitDailyAirdrop.isPending ? (
                      <RefreshCw className="w-4 h-4 text-amber-400 animate-spin" />
                    ) : (
                      <ChevronRight className="w-4 h-4 text-gray-500 group-hover:text-amber-400 transition-colors" />
                    )}
                  </div>
                  <p className="font-semibold text-white">Submit Daily Airdrop</p>
                  <p className="text-xs text-gray-400">{dailyReport?.pendingTotal || 0} pending rewards</p>
                </button>

                <button
                  onClick={() => window.open("https://zealy.io/cw/darkwavechain", "_blank")}
                  className="p-4 rounded-xl bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/30 hover:border-purple-400/50 transition-all text-left group"
                >
                  <div className="flex items-center justify-between mb-2">
                    <ExternalLink className="w-6 h-6 text-purple-400" />
                    <ChevronRight className="w-4 h-4 text-gray-500 group-hover:text-purple-400 transition-colors" />
                  </div>
                  <p className="font-semibold text-white">Zealy Dashboard</p>
                  <p className="text-xs text-gray-400">Manage campaigns</p>
                </button>
              </div>
            </GlassCard>

            {/* Recent Activity */}
            <GlassCard className="p-6" glow>
              <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-4">
                <Activity className="w-5 h-5 text-cyan-400" />
                Recent Quest Completions
              </h3>
              
              {recentEvents.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Clock className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>No recent activity</p>
                </div>
              ) : (
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {recentEvents.slice(0, 10).map((event: any, i: number) => (
                    <div key={event.id || i} className="flex items-center justify-between p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className={`w-2 h-2 rounded-full ${
                          event.status === "granted" ? "bg-green-500" : 
                          event.status === "pending" ? "bg-yellow-500" : "bg-red-500"
                        }`} />
                        <div>
                          <p className="text-sm text-white">{event.questName || event.zealyQuestId}</p>
                          <p className="text-xs text-gray-500">{event.email || "Anonymous"}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-emerald-400">+{event.shellsGranted || 0} Shells</p>
                        <p className="text-xs text-gray-500">{new Date(event.createdAt).toLocaleTimeString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </GlassCard>
          </>
        )}

        {/* Daily Report Tab */}
        {activeTab === "daily" && (
          <div className="space-y-6">
            <GlassCard className="p-6" glow>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold text-white">Daily Airdrop Report</h2>
                  <p className="text-gray-400 text-sm">{currentDate}</p>
                </div>
                <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30 text-lg px-4 py-1">
                  {dailyReport?.pendingTotal || 0} PENDING
                </Badge>
              </div>

              <div className="grid md:grid-cols-3 gap-4 mb-6">
                <div className="p-4 rounded-xl bg-purple-500/10 border border-purple-500/30">
                  <div className="flex items-center gap-2 mb-2">
                    <Trophy className="w-5 h-5 text-purple-400" />
                    <span className="text-sm text-gray-400">Quest Rewards</span>
                  </div>
                  <p className="text-2xl font-bold text-white">{dailyReport?.pendingQuests || 0}</p>
                </div>
                <div className="p-4 rounded-xl bg-pink-500/10 border border-pink-500/30">
                  <div className="flex items-center gap-2 mb-2">
                    <Shell className="w-5 h-5 text-pink-400" />
                    <span className="text-sm text-gray-400">Shell Conversions</span>
                  </div>
                  <p className="text-2xl font-bold text-white">{dailyReport?.pendingShells || 0}</p>
                </div>
                <div className="p-4 rounded-xl bg-cyan-500/10 border border-cyan-500/30">
                  <div className="flex items-center gap-2 mb-2">
                    <Users className="w-5 h-5 text-cyan-400" />
                    <span className="text-sm text-gray-400">Referral Bonuses</span>
                  </div>
                  <p className="text-2xl font-bold text-white">{dailyReport?.pendingReferrals || 0}</p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 border border-emerald-500/30 mb-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-lg font-bold text-white">Total Signal to Distribute</p>
                    <p className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                      {(dailyReport?.totalSignal || 0).toLocaleString()} SIG
                    </p>
                  </div>
                  <Button
                    size="lg"
                    onClick={() => submitDailyAirdrop.mutate()}
                    disabled={submitDailyAirdrop.isPending || (dailyReport?.pendingTotal || 0) === 0}
                    className="bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white px-8"
                  >
                    {submitDailyAirdrop.isPending ? (
                      <>
                        <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5 mr-2" />
                        Submit Daily Airdrop
                      </>
                    )}
                  </Button>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-800/50 border border-white/10">
                <h4 className="font-semibold text-white mb-2 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-gray-400" />
                  How It Works
                </h4>
                <ul className="text-sm text-gray-400 space-y-1">
                  <li>• Quest completions from Zealy are automatically tracked</li>
                  <li>• Shells are converted to Signal at 100:1 ratio</li>
                  <li>• Referral bonuses are calculated from verified signups</li>
                  <li>• Click "Submit Daily Airdrop" to process all pending rewards</li>
                  <li>• Airdrops are executed on-chain within 24 hours</li>
                </ul>
              </div>
            </GlassCard>
          </div>
        )}

        {/* Airdrop Queue Tab */}
        {activeTab === "airdrop" && (
          <GlassCard className="p-6" glow>
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <Send className="w-6 h-6 text-amber-400" />
              Airdrop Processing Queue
            </h2>
            
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-6 h-6 text-emerald-400" />
                    <div>
                      <p className="font-semibold text-white">Auto-Processing Enabled</p>
                      <p className="text-sm text-gray-400">Airdrops execute automatically when submitted</p>
                    </div>
                  </div>
                  <Badge className="bg-emerald-500/20 text-emerald-400">ACTIVE</Badge>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-slate-800/50 border border-white/10">
                  <h4 className="font-semibold text-white mb-3">Today's Queue</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Pending Items</span>
                      <span className="text-white font-medium">{dailyReport?.pendingTotal || 0}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Signal Amount</span>
                      <span className="text-emerald-400 font-medium">{(dailyReport?.totalSignal || 0).toLocaleString()} SIG</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Est. USD Value</span>
                      <span className="text-cyan-400 font-medium">${((dailyReport?.totalSignal || 0) * 0.001).toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-800/50 border border-white/10">
                  <h4 className="font-semibold text-white mb-3">Processing Stats</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Last Processed</span>
                      <span className="text-white font-medium">Today</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Success Rate</span>
                      <span className="text-emerald-400 font-medium">100%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Avg. Processing Time</span>
                      <span className="text-cyan-400 font-medium">&lt; 5 min</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </GlassCard>
        )}

        {/* Analytics Tab */}
        {activeTab === "analytics" && (
          <div className="grid md:grid-cols-2 gap-6">
            <GlassCard className="p-6" glow>
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-emerald-400" />
                Presale Progress
              </h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-400">Tokens Sold</span>
                    <span className="text-white">{presaleStats?.percentSold || 0}% of 150M</span>
                  </div>
                  <Progress value={presaleStats?.percentSold || 0} className="h-3" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 rounded-lg bg-white/5">
                    <p className="text-xs text-gray-400">Current Price</p>
                    <p className="text-lg font-bold text-amber-400">${presaleStats?.currentPrice || "0.001"}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-white/5">
                    <p className="text-xs text-gray-400">Launch Price</p>
                    <p className="text-lg font-bold text-emerald-400">$0.008</p>
                  </div>
                </div>
              </div>
            </GlassCard>

            <GlassCard className="p-6" glow>
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Users className="w-5 h-5 text-purple-400" />
                Community Growth
              </h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-400">Zealy Participants</span>
                    <span className="text-white">{zealyStats?.participants || 0} / 200 goal</span>
                  </div>
                  <Progress value={Math.min(100, ((zealyStats?.participants || 0) / 200) * 100)} className="h-3" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 rounded-lg bg-white/5">
                    <p className="text-xs text-gray-400">Quests Completed</p>
                    <p className="text-lg font-bold text-purple-400">{zealyStats?.questsCompleted || 0}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-white/5">
                    <p className="text-xs text-gray-400">Total Shells</p>
                    <p className="text-lg font-bold text-pink-400">{zealyStats?.totalShellsGranted?.toLocaleString() || 0}</p>
                  </div>
                </div>
              </div>
            </GlassCard>
          </div>
        )}

        {/* Navigation Links */}
        <div className="grid md:grid-cols-4 gap-4 pt-6 border-t border-white/10">
          <Link href="/quests">
            <button className="w-full p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors text-left flex items-center justify-between group">
              <span className="text-sm text-gray-300">Public Quests</span>
              <ArrowRight className="w-4 h-4 text-gray-500 group-hover:text-cyan-400" />
            </button>
          </Link>
          <Link href="/rewards">
            <button className="w-full p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors text-left flex items-center justify-between group">
              <span className="text-sm text-gray-300">Rewards Page</span>
              <ArrowRight className="w-4 h-4 text-gray-500 group-hover:text-cyan-400" />
            </button>
          </Link>
          <Link href="/presale">
            <button className="w-full p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors text-left flex items-center justify-between group">
              <span className="text-sm text-gray-300">Presale Page</span>
              <ArrowRight className="w-4 h-4 text-gray-500 group-hover:text-cyan-400" />
            </button>
          </Link>
          <Link href="/community-hub">
            <button className="w-full p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors text-left flex items-center justify-between group">
              <span className="text-sm text-gray-300">Community Hub</span>
              <ArrowRight className="w-4 h-4 text-gray-500 group-hover:text-cyan-400" />
            </button>
          </Link>
        </div>
      </main>
    </div>
    </div>
    </div>
  );
}

export default function TeamOperationsPage() {
  const [authenticated, setAuthenticated] = useState(() => {
    return sessionStorage.getItem("ownerAuth") === "true" || 
           sessionStorage.getItem("teamAuth") === "true" ||
           sessionStorage.getItem("developerAuth") === "true";
  });

  if (!authenticated) {
    return <PinEntry onSuccess={() => setAuthenticated(true)} />;
  }

  return <OperationsDashboard />;
}
