import { motion } from "framer-motion";
import { Link } from "wouter";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { 
  Shield, ShieldCheck, Award, Activity, AlertTriangle, Clock,
  CheckCircle, XCircle, Eye, ExternalLink, Plus, Settings,
  Wallet, ChevronRight, Zap, Lock, Server, Database, Globe,
  Bell, TrendingUp, ArrowLeft, BarChart3, FileText, RefreshCw, Loader
} from "lucide-react";
import { Footer } from "@/components/footer";
import { GlassCard } from "@/components/glass-card";
import { HeaderTools } from "@/components/header-tools";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { usePageAnalytics } from "@/hooks/use-analytics";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "sonner";

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
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<"overview" | "assets" | "incidents" | "stamps" | "shield">("overview");

  const { data: certifications = [], isLoading: certsLoading } = useQuery({
    queryKey: ["guardian-certifications", user?.id],
    queryFn: () => axios.get("/api/guardian/certifications").then(r => r.data.certifications),
    enabled: !!user?.id
  });

  const { data: assets = [], isLoading: assetsLoading } = useQuery({
    queryKey: ["guardian-assets", user?.id],
    queryFn: () => axios.get("/api/guardian/assets").then(r => r.data.assets),
    enabled: !!user?.id
  });

  const { data: incidents = [], isLoading: incidentsLoading } = useQuery({
    queryKey: ["guardian-incidents", user?.id],
    queryFn: () => axios.get("/api/guardian/incidents").then(r => r.data.incidents),
    enabled: !!user?.id
  });

  const { data: stamps = [], isLoading: stampsLoading } = useQuery({
    queryKey: ["guardian-stamps"],
    queryFn: () => axios.get("/api/guardian/stamps").then(r => r.data.stamps)
  });

  const handleCompleteCertification = async (certId: string, score: number) => {
    try {
      await axios.patch(`/api/guardian/certifications/${certId}`, { status: "completed", score });
      toast.success("Certification marked as complete");
    } catch (error) {
      toast.error("Failed to update certification");
    }
  };

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
          {["overview", "assets", "incidents", "stamps", "shield"].map((tab) => (
            <Button
              key={tab}
              variant="ghost"
              size="sm"
              onClick={() => setActiveTab(tab as any)}
              className={`capitalize ${activeTab === tab ? "bg-white/10 text-white" : "text-white/60 hover:text-white"}`}
              data-testid={`tab-${tab}`}
            >
              {tab === "shield" && <Badge className="ml-2 bg-amber-500/20 text-amber-400 text-xs">Coming Soon</Badge>}
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
                  {certsLoading ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader className="w-5 h-5 animate-spin text-white/60" />
                    </div>
                  ) : certifications.length === 0 ? (
                    <p className="text-white/60 text-sm py-4">No certifications yet. Start your first audit.</p>
                  ) : (
                    certifications.map((cert: any) => {
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
                          {cert.status === "in_progress" && (
                            <Button 
                              size="sm" 
                              variant="outline"
                              className="text-emerald-400 border-emerald-500/30"
                              onClick={() => handleCompleteCertification(cert.id, 85)}
                            >
                              Mark Complete
                            </Button>
                          )}
                        </div>
                      );
                    })
                  )}
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
                  {incidentsLoading ? (
                    <div className="flex items-center justify-center py-6">
                      <Loader className="w-4 h-4 animate-spin text-white/60" />
                    </div>
                  ) : incidents.length === 0 ? (
                    <p className="text-white/60 text-sm py-4">No incidents recorded.</p>
                  ) : (
                    incidents.map((incident: any) => (
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
                          <span>{incident.assetId || "Unknown"}</span>
                          <span>•</span>
                          <span>{new Date(incident.createdAt).toLocaleDateString()}</span>
                        </div>
                        <div className="mt-2">
                          <span className={`text-xs capitalize ${incident.status === "resolved" ? "text-emerald-400" : "text-amber-400"}`}>
                            {incident.status}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
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
                    {assetsLoading ? (
                      <tr>
                        <td colSpan={7} className="py-8 text-center">
                          <Loader className="w-4 h-4 animate-spin inline text-white/60" />
                        </td>
                      </tr>
                    ) : assets.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="py-8 text-center text-white/60">No assets monitored yet.</td>
                      </tr>
                    ) : (
                      assets.map((asset: any) => (
                        <tr key={asset.id} className="border-b border-white/5 hover:bg-white/5" data-testid={`asset-row-${asset.id}`}>
                          <td className="py-4 px-4">
                            <div>
                              <div className="font-medium text-white">{asset.assetName || asset.assetAddress.slice(0, 16)}</div>
                              <div className="text-xs text-white/60 font-mono">{asset.assetAddress}</div>
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <Badge variant="outline" className="capitalize text-xs">{asset.assetType}</Badge>
                          </td>
                          <td className="py-4 px-4">
                            <span className="text-sm text-white">{asset.chainId}</span>
                          </td>
                          <td className="py-4 px-4">
                            <span className={`text-lg font-bold ${getHealthColor(asset.healthScore || 75)}`}>
                              {asset.healthScore || 75}
                            </span>
                          </td>
                          <td className="py-4 px-4">
                            <div className="flex items-center gap-2">
                              {(asset.healthScore || 75) >= 80 ? (
                                <CheckCircle className="w-4 h-4 text-emerald-400" />
                              ) : (
                                <AlertTriangle className="w-4 h-4 text-amber-400" />
                              )}
                              <span className={`text-sm ${(asset.healthScore || 75) >= 80 ? "text-emerald-400" : "text-amber-400"}`}>
                                {(asset.healthScore || 75) >= 80 ? "Healthy" : "Monitor"}
                              </span>
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <span className="text-sm text-white/60">{asset.lastCheckedAt ? new Date(asset.lastCheckedAt).toLocaleDateString() : "Never"}</span>
                          </td>
                          <td className="py-4 px-4 text-right">
                            <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-white/10">
                              <Settings className="w-4 h-4" />
                            </Button>
                          </td>
                        </tr>
                      ))
                    )}
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
                {incidentsLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader className="w-5 h-5 animate-spin text-white/60" />
                  </div>
                ) : incidents.length === 0 ? (
                  <p className="text-white/60 text-sm py-4">No security incidents detected.</p>
                ) : (
                  incidents.map((incident: any) => (
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
                            <Badge variant="outline" className="text-xs capitalize">{incident.incidentType.replace("_", " ")}</Badge>
                          </div>
                          <h3 className="text-lg font-semibold text-white mb-1">{incident.title}</h3>
                          <p className="text-sm text-white/60">Asset ID: {incident.assetId}</p>
                        </div>
                        <div className="text-right">
                          <div className={`text-sm capitalize font-medium ${incident.status === "resolved" ? "text-emerald-400" : "text-amber-400"}`}>
                            {incident.status}
                          </div>
                          <div className="text-xs text-white/60 mt-1">{new Date(incident.createdAt).toLocaleDateString()}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 mt-4 pt-4 border-t border-white/10">
                        <Button variant="outline" size="sm" className="border-white/20">
                          <Eye className="w-4 h-4 mr-1" />
                          View Details
                        </Button>
                        {incident.status !== "resolved" && (
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="border-white/20 text-emerald-400"
                            onClick={() => axios.post(`/api/guardian/incidents/${incident.id}/resolve`)}
                          >
                            <CheckCircle className="w-4 h-4 mr-1" />
                            Mark Resolved
                          </Button>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </GlassCard>
          </motion.div>
        )}

        {activeTab === "shield" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <GlassCard className="p-8 bg-gradient-to-br from-amber-500/10 via-orange-500/5 to-transparent">
              <div className="text-center mb-8">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-white mb-2">Guardian Shield</h2>
                <p className="text-lg text-white/60">24/7 Blockchain Security Monitoring</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <GlassCard className="p-6 border-amber-500/20">
                  <h3 className="text-lg font-semibold text-white mb-2">Guardian Watch</h3>
                  <div className="text-3xl font-bold text-amber-400 mb-4">$299<span className="text-lg text-white/60">/mo</span></div>
                  <ul className="space-y-2 text-sm text-white/70">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-emerald-400" />
                      Real-time monitoring
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-emerald-400" />
                      Threat detection
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-emerald-400" />
                      Email alerts
                    </li>
                  </ul>
                </GlassCard>

                <GlassCard className="p-6 border-purple-500/20 ring-1 ring-purple-500/30">
                  <Badge className="bg-purple-500/20 text-purple-400 mb-2">Most Popular</Badge>
                  <h3 className="text-lg font-semibold text-white mb-2">Guardian Shield</h3>
                  <div className="text-3xl font-bold text-purple-400 mb-4">$999<span className="text-lg text-white/60">/mo</span></div>
                  <ul className="space-y-2 text-sm text-white/70">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-emerald-400" />
                      All Watch features
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-emerald-400" />
                      Governance monitoring
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-emerald-400" />
                      Rug pull detection
                    </li>
                  </ul>
                </GlassCard>

                <GlassCard className="p-6 border-pink-500/20">
                  <h3 className="text-lg font-semibold text-white mb-2">Guardian Command</h3>
                  <div className="text-3xl font-bold text-pink-400 mb-4">$2,999<span className="text-lg text-white/60">/mo</span></div>
                  <ul className="space-y-2 text-sm text-white/70">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-emerald-400" />
                      All Shield features
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-emerald-400" />
                      SOC operations
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-emerald-400" />
                      Multi-chain coverage
                    </li>
                  </ul>
                </GlassCard>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-2xl p-6 text-center">
                <Badge className="bg-amber-500/20 text-amber-400 mb-4">Coming Soon</Badge>
                <p className="text-white/80 mb-4">Guardian Shield is launching in Q3 2026 with advanced anomaly detection and 24/7 SOC operations for your blockchain assets.</p>
                <Button className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700">
                  <Bell className="w-4 h-4 mr-2" />
                  Join Waitlist
                </Button>
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
                {stampsLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader className="w-5 h-5 animate-spin text-white/60" />
                  </div>
                ) : stamps.length === 0 ? (
                  <p className="text-white/60 text-sm py-4">No blockchain stamps yet.</p>
                ) : (
                  stamps.map((stamp: any) => (
                    <div
                      key={stamp.id}
                      className="flex items-center gap-4 p-4 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition-colors"
                      data-testid={`stamp-${stamp.id}`}
                    >
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        stamp.stampType === "certification" ? "bg-cyan-500/20" :
                        stamp.stampType === "incident" ? "bg-amber-500/20" : "bg-purple-500/20"
                      }`}>
                        {stamp.stampType === "certification" ? <Award className="w-5 h-5 text-cyan-400" /> :
                         stamp.stampType === "incident" ? <AlertTriangle className="w-5 h-5 text-amber-400" /> :
                         <Wallet className="w-5 h-5 text-purple-400" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-white">{stamp.stampType.replace("_", " ").charAt(0).toUpperCase() + stamp.stampType.slice(1)} • {stamp.status}</div>
                        <div className="flex items-center gap-3 mt-1 text-xs text-white/60">
                          <span className="font-mono">{stamp.dataHash.slice(0, 20)}...</span>
                          {stamp.blockNumber && <span>Block #{stamp.blockNumber.toLocaleString()}</span>}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs text-white/60">{new Date(stamp.createdAt).toLocaleDateString()}</div>
                        {stamp.transactionHash && (
                          <Button variant="ghost" size="sm" className="mt-1 h-7 text-xs text-cyan-400 hover:text-cyan-300">
                            <ExternalLink className="w-3 h-3 mr-1" />
                            View on Explorer
                          </Button>
                        )}
                      </div>
                    </div>
                  ))
                )}
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
