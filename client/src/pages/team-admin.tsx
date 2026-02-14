import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "wouter";
import { 
  Shield, Eye, Lock, Users, Shell, Activity, CheckCircle, XCircle,
  AlertTriangle, Trophy, TrendingUp, ExternalLink, RefreshCw, Clock,
  Sparkles, Target, ArrowRight, Coins, DollarSign, Wallet, Percent
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { GlassCard } from "@/components/glass-card";

const GlowOrb = ({ color, size, top, left, delay = 0 }: { color: string; size: number; top: string; left: string; delay?: number }) => (
  <motion.div
    className="absolute rounded-full blur-3xl opacity-20 pointer-events-none"
    style={{ background: color, width: size, height: size, top, left }}
    animate={{ scale: [1, 1.2, 1], opacity: [0.15, 0.25, 0.15] }}
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
        toast({ title: "Welcome!", description: "Team portal access granted" });
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
        className={`relative z-10 bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-3xl p-8 max-w-md w-full mx-4 ${shake ? 'animate-shake' : ''}`}
        style={{ boxShadow: "0 0 60px rgba(16,185,129,0.1)" }}
      >
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 border border-white/10 flex items-center justify-center">
            <Users className="w-8 h-8 text-emerald-400" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Team Portal</h1>
          <p className="text-gray-400 text-sm">Enter your team PIN to continue</p>
        </div>

        <div className="space-y-4">
          <div className="relative">
            <input
              type={showPin ? "text" : "password"}
              value={pin}
              onChange={(e) => { setPin(e.target.value.replace(/\D/g, '')); setError(""); }}
              onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
              placeholder="Enter PIN..."
              maxLength={8}
              className="w-full px-4 py-3 bg-slate-800/50 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 pr-12 text-center text-2xl tracking-widest"
              autoFocus
              data-testid="input-team-pin"
            />
            <button
              type="button"
              onClick={() => setShowPin(!showPin)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
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
            className="w-full py-3 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-xl text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:shadow-lg hover:shadow-emerald-500/25"
            data-testid="button-team-auth"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <RefreshCw className="w-4 h-4 animate-spin" />
                Verifying...
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                <Lock className="w-4 h-4" />
                Access Portal
              </span>
            )}
          </motion.button>
        </div>

        <p className="text-xs text-gray-500 text-center mt-6">
          Contact the owner if you need access credentials
        </p>
      </motion.div>
    </div>
  );
}

function StatusIcon({ status }: { status: string }) {
  switch (status) {
    case "operational":
      return <CheckCircle className="w-4 h-4 text-green-500" />;
    case "degraded":
      return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
    case "down":
      return <XCircle className="w-4 h-4 text-red-500" />;
    default:
      return <Clock className="w-4 h-4 text-gray-500" />;
  }
}

function TeamDashboard() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const getTeamHeaders = () => ({
    "Content-Type": "application/json",
    "x-team-token": sessionStorage.getItem("teamToken") || "",
  });

  const { data: health, isLoading: healthLoading, refetch: refetchHealth } = useQuery({
    queryKey: ["/api/system/health"],
    queryFn: async () => {
      const res = await fetch("/api/system/health");
      return res.json();
    },
    refetchInterval: 30000,
  });

  const { data: zealyStats, isLoading: statsLoading } = useQuery({
    queryKey: ["/api/team/zealy/stats"],
    queryFn: async () => {
      const res = await fetch("/api/team/zealy/stats", { headers: getTeamHeaders() });
      if (!res.ok) throw new Error("Failed to fetch stats");
      return res.json();
    },
  });

  const { data: recentEvents = [] } = useQuery({
    queryKey: ["/api/team/zealy/recent-events"],
    queryFn: async () => {
      const res = await fetch("/api/team/zealy/recent-events", { headers: getTeamHeaders() });
      if (!res.ok) throw new Error("Failed to fetch events");
      return res.json();
    },
    refetchInterval: 60000,
  });

  const { data: presaleStats } = useQuery({
    queryKey: ["/api/presale/stats"],
    queryFn: async () => {
      const res = await fetch("/api/presale/stats");
      if (!res.ok) return null;
      return res.json();
    },
    refetchInterval: 30000,
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

  const participantProgress = zealyStats?.participants || 0;
  const participantGoal = 200;
  const progressPercent = Math.min(100, (participantProgress / participantGoal) * 100);

  return (
    <div className="min-h-screen bg-slate-950 relative overflow-hidden">
      <GlowOrb color="linear-gradient(135deg, #10b981, #06b6d4)" size={500} top="5%" left="5%" />
      <GlowOrb color="linear-gradient(135deg, #8b5cf6, #ec4899)" size={400} top="50%" left="70%" delay={2} />

      <nav className="sticky top-0 z-50 bg-slate-950/80 backdrop-blur-xl border-b border-white/5">
        <div className="container mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center">
              <Users className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-white">Team Portal</span>
            <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">Zealy Manager</Badge>
          </div>
          <Button variant="ghost" size="sm" onClick={handleLogout} className="text-gray-400 hover:text-white">
            Logout
          </Button>
        </div>
      </nav>

      <main className="relative z-10 container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-white mb-2">Zealy Campaign Dashboard</h1>
          <p className="text-gray-400">Monitor campaign progress and system health</p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          <GlassCard className="p-6" glow>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                <Activity className="w-5 h-5 text-emerald-400" />
                System Status
              </h3>
              <Button variant="ghost" size="sm" onClick={() => refetchHealth()} className="h-8 w-8 p-0">
                <RefreshCw className="w-4 h-4" />
              </Button>
            </div>

            {healthLoading ? (
              <div className="space-y-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-8 bg-white/5 rounded animate-pulse" />
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center gap-2 mb-4">
                  <StatusIcon status={overallStatus} />
                  <span className={`text-sm font-medium ${
                    overallStatus === "operational" ? "text-green-400" :
                    overallStatus === "degraded" ? "text-yellow-400" : "text-red-400"
                  }`}>
                    {overallStatus === "operational" ? "All Systems Operational" :
                     overallStatus === "degraded" ? "Some Systems Degraded" : "System Issues Detected"}
                  </span>
                </div>
                {health?.services?.map((service: any) => (
                  <div key={service.name} className="flex items-center justify-between p-2 rounded-lg bg-white/5">
                    <span className="text-sm text-gray-300">{service.name}</span>
                    <div className="flex items-center gap-2">
                      <StatusIcon status={service.status} />
                      {service.latency && (
                        <span className="text-xs text-gray-500">{service.latency}ms</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {overallStatus !== "operational" && (
              <div className="mt-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20">
                <p className="text-xs text-red-400">
                  Alert the owner immediately if systems are down!
                </p>
              </div>
            )}
<GlassCard className="p-6" glow>
            <h3 className="text-lg font-semibold text-white flex items-center gap-2 mb-4">
              <Target className="w-5 h-5 text-purple-400" />
              Race to 200 Participants
            </h3>

            <div className="text-center mb-4">
              <p className="text-4xl font-bold text-white">{participantProgress}</p>
              <p className="text-sm text-gray-400">of {participantGoal} participants</p>
            </div>

            <Progress value={progressPercent} className="h-3 mb-4" />

            <div className="grid grid-cols-2 gap-3 text-center">
              <div className="p-3 rounded-lg bg-white/5">
                <p className="text-lg font-bold text-emerald-400">{zealyStats?.totalShellsGranted?.toLocaleString() || 0}</p>
                <p className="text-xs text-gray-400">Shells Distributed</p>
              </div>
              <div className="p-3 rounded-lg bg-white/5">
                <p className="text-lg font-bold text-purple-400">{zealyStats?.questsCompleted || 0}</p>
                <p className="text-xs text-gray-400">Quests Completed</p>
              </div>
            </div>
<GlassCard className="p-6" glow>
            <h3 className="text-lg font-semibold text-white flex items-center gap-2 mb-4">
              <Coins className="w-5 h-5 text-amber-400" />
              Presale Status
            </h3>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
                  <p className="text-xs text-gray-400 mb-1">Current Price</p>
                  <p className="text-lg font-bold text-amber-400">${presaleStats?.currentPrice || "0.001"}</p>
                </div>
                <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                  <p className="text-xs text-gray-400 mb-1">Tokens Sold</p>
                  <p className="text-lg font-bold text-emerald-400">{presaleStats?.tokensSold?.toLocaleString() || "0"}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-lg bg-cyan-500/10 border border-cyan-500/20">
                  <p className="text-xs text-gray-400 mb-1">Total Raised</p>
                  <p className="text-lg font-bold text-cyan-400">${presaleStats?.totalRaised?.toLocaleString() || "0"}</p>
                </div>
                <div className="p-3 rounded-lg bg-purple-500/10 border border-purple-500/20">
                  <p className="text-xs text-gray-400 mb-1">Participants</p>
                  <p className="text-lg font-bold text-purple-400">{presaleStats?.participants || "0"}</p>
                </div>
              </div>
              <div className="p-3 rounded-lg bg-white/5">
                <div className="flex justify-between text-xs text-gray-400 mb-2">
                  <span>Presale Progress</span>
                  <span>{presaleStats?.percentSold || 0}% of 150M</span>
                </div>
                <Progress value={presaleStats?.percentSold || 0} className="h-2" />
              </div>
              <div className="text-xs text-gray-500 space-y-1">
                <p>• Current Tier: {presaleStats?.currentTier || "Tier 1"}</p>
                <p>• Max per wallet: 2% (20M SIG)</p>
                <p>• Launch price: $0.01</p>
              </div>
            </div>
<GlassCard className="p-6" glow>
            <h3 className="text-lg font-semibold text-white flex items-center gap-2 mb-4">
              <ExternalLink className="w-5 h-5 text-cyan-400" />
              Quick Links
            </h3>

            <div className="space-y-3">
              <button 
                onClick={() => window.open("https://zealy.io/cw/darkwavechain", "_blank")}
                className="w-full flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 hover:border-purple-400/50 transition-colors group"
              >
                <span className="text-sm text-white font-medium">Zealy Dashboard</span>
                <ExternalLink className="w-4 h-4 text-purple-400" />
              </button>
              <Link 
                href="/quests"
                className="flex items-center justify-between p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors group cursor-pointer"
              >
                <span className="text-sm text-gray-300">Public Quests Page</span>
                <ArrowRight className="w-4 h-4 text-gray-500 group-hover:text-cyan-400" />
              </Link>
              <Link 
                href="/rewards"
                className="flex items-center justify-between p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors group cursor-pointer"
              >
                <span className="text-sm text-gray-300">Rewards Page</span>
                <ArrowRight className="w-4 h-4 text-gray-500 group-hover:text-cyan-400" />
              </Link>
              <Link 
                href="/presale"
                className="flex items-center justify-between p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 hover:border-amber-400/40 transition-colors group cursor-pointer"
              >
                <span className="text-sm text-amber-300">Presale Page</span>
                <ArrowRight className="w-4 h-4 text-amber-500 group-hover:text-amber-400" />
              </Link>
            </div>
</div>

        <GlassCard className="p-6" glow>
          <h3 className="text-lg font-semibold text-white flex items-center gap-2 mb-4">
            <Trophy className="w-5 h-5 text-amber-400" />
            Recent Quest Completions
          </h3>

          {recentEvents.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Shell className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No recent quest completions</p>
            </div>
          ) : (
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {recentEvents.slice(0, 20).map((event: any, i: number) => (
                <motion.div
                  key={event.id || i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="flex items-center justify-between p-3 rounded-lg bg-white/5"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${
                      event.status === "granted" ? "bg-green-500" : 
                      event.status === "pending" ? "bg-yellow-500" : "bg-red-500"
                    }`} />
                    <div>
                      <p className="text-sm text-white">{event.questName || event.zealyQuestId}</p>
                      <p className="text-xs text-gray-500">{event.email || event.twitterHandle || "Anonymous"}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-emerald-400">+{event.shellsGranted || 0} Shells</p>
                    <p className="text-xs text-gray-500">
                      {new Date(event.createdAt).toLocaleTimeString()}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
<div className="mt-8 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-amber-400">Your Role</p>
              <p className="text-xs text-gray-400 mt-1">
                Monitor the Zealy campaign progress and system health. If you see any system issues (red indicators), 
                please contact the owner immediately. For quest management, use the Zealy dashboard directly.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function TeamAdminPage() {
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    const isAuth = sessionStorage.getItem("teamAuth") === "true";
    setAuthenticated(isAuth);
  }, []);

  if (!authenticated) {
    return <PinEntry onSuccess={() => setAuthenticated(true)} />;
  }

  return <TeamDashboard />;
}
