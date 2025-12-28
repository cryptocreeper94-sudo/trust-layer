import { motion } from "framer-motion";
import { Link } from "wouter";
import { useState } from "react";
import { 
  Shield, ShieldCheck, Award, Activity, AlertTriangle, Clock,
  CheckCircle, XCircle, Eye, ExternalLink, Plus, Settings,
  Wallet, ChevronRight, Zap, Lock, Server, Database, Globe,
  Bell, TrendingUp, ArrowLeft, BarChart3, FileText, RefreshCw
} from "lucide-react";
import { Footer } from "@/components/footer";
import { GlassCard } from "@/components/glass-card";
import { HeaderTools } from "@/components/header-tools";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { usePageAnalytics } from "@/hooks/use-analytics";

const MOCK_CERTIFICATIONS = [
  {
    id: "cert-001",
    projectName: "DarkWave DEX",
    tier: "guardian_premier",
    status: "completed",
    score: 94,
    validUntil: "2026-01-15",
    txHash: "0xdwsc...a4f2",
    nftTokenId: "1001"
  },
  {
    id: "cert-002",
    projectName: "Lunar Bridge",
    tier: "assurance_lite",
    status: "in_progress",
    score: null,
    validUntil: null,
    txHash: null,
    nftTokenId: null
  }
];

const MOCK_ASSETS = [
  {
    id: "asset-001",
    name: "DEX Router Contract",
    type: "contract",
    address: "0xdwsc...8a3f",
    chain: "DWSC",
    healthScore: 98,
    status: "active",
    lastChecked: "2 mins ago"
  },
  {
    id: "asset-002",
    name: "Treasury Wallet",
    type: "wallet",
    address: "0xdwsc...b2c1",
    chain: "DWSC",
    healthScore: 100,
    status: "active",
    lastChecked: "5 mins ago"
  },
  {
    id: "asset-003",
    name: "LP Pool v2",
    type: "pool",
    address: "0xdwsc...9e4d",
    chain: "DWSC",
    healthScore: 85,
    status: "warning",
    lastChecked: "1 min ago"
  }
];

const MOCK_INCIDENTS = [
  {
    id: "inc-001",
    title: "Unusual Gas Spike Detected",
    severity: "medium",
    type: "unusual_activity",
    asset: "DEX Router Contract",
    status: "investigating",
    createdAt: "10 mins ago"
  },
  {
    id: "inc-002",
    title: "Large Withdrawal Alert",
    severity: "info",
    type: "whale_movement",
    asset: "Treasury Wallet",
    status: "resolved",
    createdAt: "2 hours ago"
  }
];

const MOCK_STAMPS = [
  {
    id: "stamp-001",
    type: "certification",
    description: "Guardian Premier Certification Issued",
    txHash: "0xdwsc4a8b...c2f1",
    blockNumber: 1847293,
    timestamp: "2025-01-15 14:32:08"
  },
  {
    id: "stamp-002",
    type: "incident",
    description: "Security Incident Recorded",
    txHash: "0xdwsc9f2c...a1e8",
    blockNumber: 1847102,
    timestamp: "2025-01-15 12:18:45"
  },
  {
    id: "stamp-003",
    type: "payment",
    description: "Audit Payment Confirmed",
    txHash: "0xdwsc3b7e...d4f2",
    blockNumber: 1846891,
    timestamp: "2025-01-14 09:45:22"
  }
];

function getTierInfo(tier: string) {
  switch (tier) {
    case "guardian_premier":
      return { name: "Guardian Premier", gradientClass: "from-pink-500 to-pink-700", icon: Award };
    case "assurance_lite":
      return { name: "Assurance Lite", gradientClass: "from-purple-500 to-purple-700", icon: ShieldCheck };
    default:
      return { name: "Self-Cert", gradientClass: "from-cyan-500 to-cyan-700", icon: Shield };
  }
}

function getStatusColor(status: string) {
  switch (status) {
    case "completed": return "text-emerald-400";
    case "in_progress": return "text-amber-400";
    case "pending": return "text-blue-400";
    case "revoked": return "text-red-400";
    default: return "text-gray-400";
  }
}

function getSeverityColor(severity: string) {
  switch (severity) {
    case "critical": return "bg-red-500/20 text-red-400 border-red-500/30";
    case "high": return "bg-orange-500/20 text-orange-400 border-orange-500/30";
    case "medium": return "bg-amber-500/20 text-amber-400 border-amber-500/30";
    case "low": return "bg-blue-500/20 text-blue-400 border-blue-500/30";
    default: return "bg-gray-500/20 text-gray-400 border-gray-500/30";
  }
}

function getHealthColor(score: number) {
  if (score >= 90) return "text-emerald-400";
  if (score >= 70) return "text-amber-400";
  return "text-red-400";
}

function StatsCard({ icon: Icon, label, value, trend, color }: { icon: any; label: string; value: string; trend?: string; color: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden rounded-2xl border border-white/10 bg-slate-900/50 backdrop-blur-xl p-6"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent" />
      <div className="relative z-10">
        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center mb-4`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        <p className="text-sm text-white/60 mb-1">{label}</p>
        <div className="flex items-end gap-2">
          <span className="text-2xl font-bold text-white">{value}</span>
          {trend && <span className="text-xs text-emerald-400 mb-1">{trend}</span>}
        </div>
      </div>
    </motion.div>
  );
}

export default function GuardianPortal() {
  usePageAnalytics();
  const [activeTab, setActiveTab] = useState<"overview" | "assets" | "incidents" | "stamps">("overview");

  return (
    <div className="min-h-screen bg-slate-950">
      <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/security">
              <Button variant="ghost" size="icon" className="hover:bg-white/5" data-testid="button-back">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-xl font-bold text-white flex items-center gap-2">
                <Shield className="w-6 h-6 text-cyan-400" />
                Guardian Portal
              </h1>
              <p className="text-sm text-white/60">Manage your security certifications and monitored assets</p>
            </div>
          </div>
          <HeaderTools />
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
        >
          <StatsCard
            icon={ShieldCheck}
            label="Active Certifications"
            value="2"
            color="from-cyan-500 to-blue-600"
          />
          <StatsCard
            icon={Activity}
            label="Monitored Assets"
            value="3"
            trend="+1 this week"
            color="from-purple-500 to-pink-600"
          />
          <StatsCard
            icon={AlertTriangle}
            label="Open Incidents"
            value="1"
            color="from-amber-500 to-orange-600"
          />
          <StatsCard
            icon={Database}
            label="Blockchain Stamps"
            value="47"
            trend="+12 today"
            color="from-emerald-500 to-teal-600"
          />
        </motion.div>

        <div className="flex flex-wrap gap-2 mb-6 border-b border-white/10 pb-4">
          {["overview", "assets", "incidents", "stamps"].map((tab) => (
            <Button
              key={tab}
              variant="ghost"
              size="sm"
              onClick={() => setActiveTab(tab as any)}
              className={`capitalize ${activeTab === tab ? "bg-white/10 text-white" : "text-white/60 hover:text-white"}`}
              data-testid={`tab-${tab}`}
            >
              {tab}
            </Button>
          ))}
        </div>

        {activeTab === "overview" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="lg:col-span-2"
            >
              <GlassCard className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                    <Award className="w-5 h-5 text-pink-400" />
                    Your Certifications
                  </h2>
                  <Link href="/guardian-certification">
                    <Button size="sm" className="bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700">
                      <Plus className="w-4 h-4 mr-1" />
                      New Audit
                    </Button>
                  </Link>
                </div>
                <div className="space-y-4">
                  {MOCK_CERTIFICATIONS.map((cert) => {
                    const tierInfo = getTierInfo(cert.tier);
                    const TierIcon = tierInfo.icon;
                    return (
                      <div
                        key={cert.id}
                        className="flex items-center gap-4 p-4 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition-colors"
                        data-testid={`certification-${cert.id}`}
                      >
                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${tierInfo.gradientClass} flex items-center justify-center`}>
                          <TierIcon className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-white truncate">{cert.projectName}</h3>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline" className="text-xs">{tierInfo.name}</Badge>
                            <span className={`text-xs capitalize ${getStatusColor(cert.status)}`}>
                              {cert.status.replace("_", " ")}
                            </span>
                          </div>
                        </div>
                        {cert.score && (
                          <div className="text-right">
                            <div className="text-2xl font-bold text-emerald-400">{cert.score}</div>
                            <div className="text-xs text-white/60">Score</div>
                          </div>
                        )}
                        {cert.nftTokenId && (
                          <Badge className="bg-purple-500/20 text-purple-400">
                            NFT #{cert.nftTokenId}
                          </Badge>
                        )}
                      </div>
                    );
                  })}
                </div>
              </GlassCard>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <GlassCard className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-amber-400" />
                    Recent Incidents
                  </h2>
                  <Button variant="ghost" size="sm" className="text-white/60 hover:text-white">
                    View All
                  </Button>
                </div>
                <div className="space-y-3">
                  {MOCK_INCIDENTS.map((incident) => (
                    <div
                      key={incident.id}
                      className="p-3 rounded-lg border border-white/10 bg-white/5"
                      data-testid={`incident-${incident.id}`}
                    >
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h4 className="text-sm font-medium text-white">{incident.title}</h4>
                        <Badge className={`text-[10px] ${getSeverityColor(incident.severity)}`}>
                          {incident.severity}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-white/60">
                        <span>{incident.asset}</span>
                        <span>•</span>
                        <span>{incident.createdAt}</span>
                      </div>
                      <div className="mt-2">
                        <span className={`text-xs capitalize ${incident.status === "resolved" ? "text-emerald-400" : "text-amber-400"}`}>
                          {incident.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </GlassCard>
            </motion.div>
          </div>
        )}

        {activeTab === "assets" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <GlassCard className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                  <Server className="w-5 h-5 text-purple-400" />
                  Monitored Assets
                </h2>
                <Button size="sm" className="bg-gradient-to-r from-purple-500 to-pink-600">
                  <Plus className="w-4 h-4 mr-1" />
                  Add Asset
                </Button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="text-left text-xs text-white/60 font-medium py-3 px-4">Asset</th>
                      <th className="text-left text-xs text-white/60 font-medium py-3 px-4">Type</th>
                      <th className="text-left text-xs text-white/60 font-medium py-3 px-4">Chain</th>
                      <th className="text-left text-xs text-white/60 font-medium py-3 px-4">Health</th>
                      <th className="text-left text-xs text-white/60 font-medium py-3 px-4">Status</th>
                      <th className="text-left text-xs text-white/60 font-medium py-3 px-4">Last Check</th>
                      <th className="text-right text-xs text-white/60 font-medium py-3 px-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {MOCK_ASSETS.map((asset) => (
                      <tr key={asset.id} className="border-b border-white/5 hover:bg-white/5" data-testid={`asset-row-${asset.id}`}>
                        <td className="py-4 px-4">
                          <div>
                            <div className="font-medium text-white">{asset.name}</div>
                            <div className="text-xs text-white/60 font-mono">{asset.address}</div>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <Badge variant="outline" className="capitalize text-xs">{asset.type}</Badge>
                        </td>
                        <td className="py-4 px-4">
                          <span className="text-sm text-white">{asset.chain}</span>
                        </td>
                        <td className="py-4 px-4">
                          <span className={`text-lg font-bold ${getHealthColor(asset.healthScore)}`}>
                            {asset.healthScore}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-2">
                            {asset.status === "active" ? (
                              <CheckCircle className="w-4 h-4 text-emerald-400" />
                            ) : (
                              <AlertTriangle className="w-4 h-4 text-amber-400" />
                            )}
                            <span className={`text-sm capitalize ${asset.status === "active" ? "text-emerald-400" : "text-amber-400"}`}>
                              {asset.status}
                            </span>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <span className="text-sm text-white/60">{asset.lastChecked}</span>
                        </td>
                        <td className="py-4 px-4 text-right">
                          <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-white/10">
                            <Settings className="w-4 h-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </GlassCard>
          </motion.div>
        )}

        {activeTab === "incidents" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <GlassCard className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-amber-400" />
                  Security Incidents
                </h2>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" className="border-white/20">
                    <RefreshCw className="w-4 h-4 mr-1" />
                    Refresh
                  </Button>
                </div>
              </div>
              <div className="space-y-4">
                {MOCK_INCIDENTS.map((incident) => (
                  <div
                    key={incident.id}
                    className="p-4 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition-colors"
                    data-testid={`incident-detail-${incident.id}`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge className={`${getSeverityColor(incident.severity)}`}>
                            {incident.severity.toUpperCase()}
                          </Badge>
                          <Badge variant="outline" className="text-xs capitalize">{incident.type.replace("_", " ")}</Badge>
                        </div>
                        <h3 className="text-lg font-semibold text-white mb-1">{incident.title}</h3>
                        <p className="text-sm text-white/60">Affected Asset: {incident.asset}</p>
                      </div>
                      <div className="text-right">
                        <div className={`text-sm capitalize font-medium ${incident.status === "resolved" ? "text-emerald-400" : "text-amber-400"}`}>
                          {incident.status}
                        </div>
                        <div className="text-xs text-white/60 mt-1">{incident.createdAt}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mt-4 pt-4 border-t border-white/10">
                      <Button variant="outline" size="sm" className="border-white/20">
                        <Eye className="w-4 h-4 mr-1" />
                        View Details
                      </Button>
                      {incident.status !== "resolved" && (
                        <Button variant="outline" size="sm" className="border-white/20 text-emerald-400">
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Mark Resolved
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </GlassCard>
          </motion.div>
        )}

        {activeTab === "stamps" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <GlassCard className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                  <Database className="w-5 h-5 text-cyan-400" />
                  Blockchain Stamps
                </h2>
                <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
                  All activities recorded on DWSC
                </Badge>
              </div>
              <p className="text-sm text-white/60 mb-6">
                Every Guardian activity is immutably stamped on the DarkWave Smart Chain for complete transparency and auditability.
              </p>
              <div className="space-y-3">
                {MOCK_STAMPS.map((stamp) => (
                  <div
                    key={stamp.id}
                    className="flex items-center gap-4 p-4 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition-colors"
                    data-testid={`stamp-${stamp.id}`}
                  >
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      stamp.type === "certification" ? "bg-cyan-500/20" :
                      stamp.type === "incident" ? "bg-amber-500/20" : "bg-purple-500/20"
                    }`}>
                      {stamp.type === "certification" ? <Award className="w-5 h-5 text-cyan-400" /> :
                       stamp.type === "incident" ? <AlertTriangle className="w-5 h-5 text-amber-400" /> :
                       <Wallet className="w-5 h-5 text-purple-400" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-white">{stamp.description}</div>
                      <div className="flex items-center gap-3 mt-1 text-xs text-white/60">
                        <span className="font-mono">{stamp.txHash}</span>
                        <span>Block #{stamp.blockNumber.toLocaleString()}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-white/60">{stamp.timestamp}</div>
                      <Button variant="ghost" size="sm" className="mt-1 h-7 text-xs text-cyan-400 hover:text-cyan-300">
                        <ExternalLink className="w-3 h-3 mr-1" />
                        View on Explorer
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </GlassCard>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-8"
        >
          <GlassCard className="p-6 bg-gradient-to-r from-cyan-500/10 via-purple-500/10 to-pink-500/10">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-semibold text-white mb-1">Need Continuous Monitoring?</h3>
                <p className="text-sm text-white/60">Guardian Shield provides 24/7 security monitoring for your blockchain assets.</p>
              </div>
              <Link href="/security#shield">
                <Button className="bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700">
                  <Shield className="w-4 h-4 mr-2" />
                  Explore Guardian Shield
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
            </div>
          </GlassCard>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}
