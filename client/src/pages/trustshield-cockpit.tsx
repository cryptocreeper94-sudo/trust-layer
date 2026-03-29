import { motion } from "framer-motion";
import { Link } from "wouter";
import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { 
  Shield, ShieldCheck, Award, Activity, AlertTriangle, Clock,
  CheckCircle, XCircle, Eye, ExternalLink, Plus, Settings,
  Wallet, ChevronRight, Zap, Lock, Server, Database, Globe,
  Bell, TrendingUp, BarChart3, FileText, RefreshCw, Loader, Sparkles,
  Download, ClipboardCheck
} from "lucide-react";
import { GlassCard } from "@/components/glass-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { usePageAnalytics } from "@/hooks/use-analytics";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "sonner";

function getTierInfo(tier: string) {
  switch (tier) {
    case "guardian_premier":
      return { name: "Guardian Premier", gradientClass: "from-pink-500 to-pink-700", icon: Award };
    case "guardian_certified":
      return { name: "Guardian Certified", gradientClass: "from-purple-500 to-purple-700", icon: ShieldCheck };
    case "guardian_assurance":
      return { name: "Guardian Assurance", gradientClass: "from-blue-500 to-blue-700", icon: ShieldCheck };
    case "assurance_lite":
      return { name: "Guardian Assurance", gradientClass: "from-blue-500 to-blue-700", icon: ShieldCheck };
    case "guardian_scan":
      return { name: "Guardian Scan", gradientClass: "from-cyan-500 to-cyan-700", icon: Shield };
    default:
      return { name: "Guardian Scan", gradientClass: "from-cyan-500 to-cyan-700", icon: Shield };
  }
}

const PROGRESS_STEPS = [
  { key: "intake", label: "Intake", icon: ClipboardCheck },
  { key: "pending", label: "Initial Scan", icon: Eye },
  { key: "in_progress", label: "Analysis", icon: Activity },
  { key: "review", label: "Review", icon: FileText },
  { key: "report_generation", label: "Report", icon: Database },
  { key: "completed", label: "Done", icon: Award },
];

function getStepIndex(status: string): number {
  const idx = PROGRESS_STEPS.findIndex(s => s.key === status);
  return idx >= 0 ? idx : 0;
}

function CertificationProgress({ certification }: { certification: any }) {
  const currentStep = getStepIndex(certification.status);
  const isRevoked = certification.status === "revoked";

  if (isRevoked) {
    return (
      <div className="flex items-center gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/20">
        <XCircle className="w-4 h-4 text-red-400" />
        <span className="text-sm text-red-400 font-medium">Certification Revoked</span>
      </div>
    );
  }

  return (
    <div className="space-y-3" data-testid={`progress-tracker-${certification.id}`}>
      <div className="flex items-center gap-1">
        {PROGRESS_STEPS.map((step, i) => {
          const StepIcon = step.icon;
          const isComplete = i < currentStep;
          const isCurrent = i === currentStep;

          return (
            <div key={step.key} className="flex items-center flex-1">
              <div className="flex flex-col items-center flex-1 min-w-0">
                <div
                  className={`w-6 h-6 md:w-8 md:h-8 rounded-full flex items-center justify-center transition-all ${
                    isComplete
                      ? "bg-emerald-500/20 border border-emerald-500/40"
                      : isCurrent
                      ? "bg-cyan-500/20 border border-cyan-400 shadow-[0_0_8px_rgba(6,182,212,0.4)]"
                      : "bg-white/5 border border-white/10"
                  }`}
                >
                  {isComplete ? (
                    <CheckCircle className="w-3 h-3 md:w-4 md:h-4 text-emerald-400" />
                  ) : isCurrent ? (
                    <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 2 }}>
                      <StepIcon className="w-3 h-3 md:w-4 md:h-4 text-cyan-400" />
                    </motion.div>
                  ) : (
                    <StepIcon className="w-3 h-3 text-white/20" />
                  )}
                </div>
                <span className={`text-[8px] md:text-[10px] mt-1 text-center hidden sm:block ${
                  isComplete ? "text-emerald-400/70" : isCurrent ? "text-cyan-400" : "text-white/25"
                }`}>
                  {step.label}
                </span>
              </div>
              {i < PROGRESS_STEPS.length - 1 && (
                <div className={`h-[2px] flex-shrink-0 w-2 md:w-4 -mt-2 sm:-mt-5 ${
                  isComplete ? "bg-emerald-500/40" : "bg-white/10"
                }`} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function getStatusColor(status: string) {
  switch (status) {
    case "completed": return "text-emerald-400";
    case "in_progress": return "text-purple-400";
    case "pending": return "text-blue-400";
    case "revoked": return "text-red-400";
    default: return "text-gray-400";
  }
}

function getSeverityColor(severity: string) {
  switch (severity) {
    case "critical": return "bg-red-500/20 text-red-400 border-red-500/30";
    case "high": return "bg-cyan-500/20 text-cyan-400 border-cyan-500/30";
    case "medium": return "bg-purple-500/20 text-purple-400 border-purple-500/30";
    case "low": return "bg-blue-500/20 text-blue-400 border-blue-500/30";
    default: return "bg-gray-500/20 text-gray-400 border-gray-500/30";
  }
}

function getHealthColor(score: number) {
  if (score >= 90) return "text-emerald-400";
  if (score >= 70) return "text-purple-400";
  return "text-red-400";
}

function StatsCard({ icon: Icon, label, value, trend, color }: { icon: any; label: string; value: string; trend?: string; color: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden rounded-2xl border border-white/10 bg-slate-900/50 backdrop-blur-xl p-4 md:p-6"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent" />
      <div className="relative z-10">
        <div className={`w-10 h-10 md:w-12 md:h-12 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center mb-4`}>
          <Icon className="w-5 h-5 md:w-6 md:h-6 text-white" />
        </div>
        <p className="text-xs md:text-sm text-white/60 mb-1">{label}</p>
        <div className="flex items-end gap-2">
          <span className="text-xl md:text-2xl font-bold text-white">{value}</span>
        </div>
      </div>
    </motion.div>
  );
}

export default function TrustShieldCockpit() {
  usePageAnalytics();
  const { user } = useAuth();
  const queryClient = useQueryClient();

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

  const { data: guardianStats } = useQuery({
    queryKey: ["guardian-stats"],
    queryFn: () => axios.get("/api/guardian/stats").then(r => r.data.stats)
  });

  const [mintingId, setMintingId] = useState<string | null>(null);
  
  const handleMintNFT = async (certId: string) => {
    setMintingId(certId);
    try {
      const response = await axios.post(`/api/guardian/certifications/${certId}/mint-nft`);
      if (response.data.tokenId) {
        toast.success(`NFT minted successfully! Token ID: ${response.data.tokenId}`);
        queryClient.invalidateQueries({ queryKey: ["guardian-certifications", user?.id] });
      }
    } catch (error) {
      toast.error("Failed to mint NFT badge");
    } finally {
      setMintingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white pb-20">
      <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex flex-col">
            <h1 className="text-xl md:text-2xl font-bold flex items-center gap-2">
              <Shield className="w-6 h-6 text-cyan-400" />
              Trust Shield Cockpit
            </h1>
            <p className="text-sm text-white/60 hidden sm:block">Unified command center for Guardian security & analysis</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge className="bg-cyan-500/20 text-cyan-400 border-cyan-500/30">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mr-2 animate-pulse" />
              Network Active
            </Badge>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        
        {/* Top Stats Row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
        >
          <StatsCard
            icon={ShieldCheck}
            label="Active Certs"
            value={String(guardianStats?.activeCertifications ?? certifications.length)}
            color="from-cyan-500 to-blue-600"
          />
          <StatsCard
            icon={Activity}
            label="Monitored Assets"
            value={String(guardianStats?.monitoredAssets ?? assets.length)}
            color="from-purple-500 to-pink-600"
          />
          <StatsCard
            icon={AlertTriangle}
            label="Open Incidents"
            value={String(guardianStats?.openIncidents ?? 0)}
            color="from-purple-500 to-cyan-600"
          />
          <StatsCard
            icon={Database}
            label="Chain Stamps"
            value={String(guardianStats?.blockchainStamps ?? stamps.length)}
            color="from-emerald-500 to-teal-600"
          />
        </motion.div>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Main Column (2/3 width) */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Ecosystem Launchpad */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="grid grid-cols-1 sm:grid-cols-2 gap-4"
            >
              <Link href="/guardian-scanner">
                <GlassCard className="p-6 cursor-pointer border-cyan-500/20 hover:border-cyan-500/60 bg-gradient-to-br from-cyan-500/5 to-transparent transition-all group h-full">
                  <div className="w-12 h-12 rounded-xl bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Eye className="w-6 h-6 text-cyan-400" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors">Guardian Scanner</h3>
                  <p className="text-sm text-white/60 mb-4">
                    Verify and certify AI agents and digital assets. Ensure compliance and trustworthiness before interacting.
                  </p>
                  <div className="flex items-center text-cyan-400 text-sm font-medium">
                    Launch Scanner <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </div>
                </GlassCard>
              </Link>

              <Link href="/guardian-screener">
                <GlassCard className="p-6 cursor-pointer border-purple-500/20 hover:border-purple-500/60 bg-gradient-to-br from-purple-500/5 to-transparent transition-all group h-full">
                  <div className="w-12 h-12 rounded-xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <TrendingUp className="w-6 h-6 text-purple-400" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-purple-400 transition-colors">Guardian Screener</h3>
                  <p className="text-sm text-white/60 mb-4">
                    Advanced DEX screening with ML predictions, snipe detection, and real-time threat analysis for traders.
                  </p>
                  <div className="flex items-center text-purple-400 text-sm font-medium">
                    Launch Screener <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </div>
                </GlassCard>
              </Link>
            </motion.div>

            {/* Certifications Queue */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <GlassCard className="p-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                  <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                    <Award className="w-5 h-5 text-pink-400" />
                    Audit & Certification Queue
                  </h2>
                  <Link href="/guardian-certification">
                    <Button size="sm" className="bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 w-full sm:w-auto">
                      <Plus className="w-4 h-4 mr-1" />
                      New Audit Request
                    </Button>
                  </Link>
                </div>
                
                <div className="space-y-4">
                  {certsLoading ? (
                    <div className="py-8 text-center text-white/60"><Loader className="w-5 h-5 animate-spin mx-auto" /></div>
                  ) : certifications.length === 0 ? (
                    <div className="text-center py-6 border border-dashed border-white/10 rounded-xl bg-white/5">
                      <ShieldCheck className="w-8 h-8 text-white/20 mx-auto mb-2" />
                      <p className="text-white/40 text-sm">No active audits in queue.</p>
                    </div>
                  ) : (
                    certifications.map((cert: any) => {
                      const tierInfo = getTierInfo(cert.tier);
                      const TierIcon = tierInfo.icon;
                      return (
                        <div key={cert.id} className="p-4 rounded-xl border border-white/10 bg-white/5 space-y-4">
                          <div className="flex items-center gap-4">
                            <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${tierInfo.gradientClass} flex items-center justify-center flex-shrink-0`}>
                              <TierIcon className="w-5 h-5 text-white" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="font-semibold text-white truncate">{cert.projectName}</h3>
                              <div className="flex items-center gap-2 mt-1">
                                <Badge variant="outline" className="text-[10px] bg-white/5">{tierInfo.name}</Badge>
                                <span className={`text-[10px] font-medium capitalize ${getStatusColor(cert.status)}`}>
                                  {cert.status.replace(/_/g, " ")}
                                </span>
                              </div>
                            </div>
                            {cert.score != null && (
                              <div className="text-right">
                                <div className="text-xl font-bold text-emerald-400">{cert.score}</div>
                                <div className="text-[10px] text-white/60">Trust Score</div>
                              </div>
                            )}
                          </div>
                          
                          <div className="bg-slate-900/50 rounded-lg py-3 px-2 border border-white/5">
                            <CertificationProgress certification={cert} />
                          </div>

                          {cert.status === "completed" && (
                            <div className="flex flex-wrap items-center gap-2 mt-2 pt-2 border-t border-white/10">
                              <Button size="sm" variant="ghost" className="h-8 text-xs bg-white/5 hover:bg-white/10" onClick={() => window.open(`/api/guardian/certifications/${cert.id}/report`)}>
                                <Download className="w-3 h-3 mr-1" /> View Report
                              </Button>
                              {!cert.nftTokenId && (
                                <Button size="sm" className="h-8 text-xs bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700" onClick={() => handleMintNFT(cert.id)} disabled={mintingId === cert.id}>
                                  <Sparkles className="w-3 h-3 mr-1" /> {mintingId === cert.id ? "Minting..." : "Mint NFT Badge"}
                                </Button>
                              )}
                              {cert.nftTokenId && (
                                <Badge className="bg-purple-500/20 text-purple-400">
                                  <Database className="w-3 h-3 mr-1" /> NFT Minted
                                </Badge>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })
                  )}
                </div>
              </GlassCard>
            </motion.div>

            {/* Monitored Assets Container */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <GlassCard className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                    <Server className="w-5 h-5 text-cyan-400" />
                    Nodes & Network Assets
                  </h2>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left whitespace-nowrap">
                    <thead className="text-xs text-white/40 border-b border-white/10">
                      <tr>
                        <th className="py-2 px-3 font-medium">Asset</th>
                        <th className="py-2 px-3 font-medium">Network</th>
                        <th className="py-2 px-3 font-medium">Score</th>
                        <th className="py-2 px-3 font-medium">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {assetsLoading ? (
                        <tr><td colSpan={4} className="py-6 text-center"><Loader className="w-4 h-4 animate-spin inline text-white/40"/></td></tr>
                      ) : assets.length === 0 ? (
                        <tr><td colSpan={4} className="py-6 text-center text-white/40 text-xs">No assets under active monitoring.</td></tr>
                      ) : (
                        assets.slice(0, 5).map((asset: any) => (
                          <tr key={asset.id} className="hover:bg-white/5">
                            <td className="py-3 px-3">
                              <div className="font-medium">{asset.assetName || asset.assetAddress.slice(0, 8)}</div>
                              <div className="text-[10px] text-white/40 font-mono">{asset.assetAddress}</div>
                            </td>
                            <td className="py-3 px-3">
                              <Badge variant="outline" className="text-[10px] bg-white/5">{asset.chain || 'DWTl'}</Badge>
                            </td>
                            <td className="py-3 px-3">
                              <span className={`font-bold ${getHealthColor(asset.healthScore || 75)}`}>{asset.healthScore || 75}</span>
                            </td>
                            <td className="py-3 px-3">
                              {asset.healthScore >= 80 ? (
                                <Badge className="bg-emerald-500/20 text-emerald-400 text-[10px] border-emerald-500/30">Healthy</Badge>
                              ) : (
                                <Badge className="bg-amber-500/20 text-amber-400 text-[10px] border-amber-500/30">Warning</Badge>
                              )}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                  {assets.length > 5 && (
                    <Button variant="ghost" className="w-full text-xs text-white/40 mt-2 hover:text-white">View All {assets.length} Assets</Button>
                  )}
                </div>
              </GlassCard>
            </motion.div>
          </div>

          {/* Sidebar Column (1/3 width) */}
          <div className="space-y-6">
            
            {/* Guardian Shield Promo */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <GlassCard className="p-6 bg-gradient-to-br from-purple-500/10 via-cyan-500/5 to-transparent relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl group-hover:bg-purple-500/20 transition-colors" />
                <div className="relative z-10 flex flex-col items-center text-center">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-cyan-600 flex items-center justify-center mb-4 ring-4 ring-purple-500/20 shadow-[0_0_20px_rgba(168,85,247,0.4)]">
                    <Shield className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">Guardian Shield</h3>
                  <p className="text-sm text-white/60 mb-4 px-2">Enterprise-grade Web3 SOC as a Service. Protect your users from threats 24/7.</p>
                  <Button className="w-full bg-white/10 hover:bg-white/20 border border-white/10">
                    Join Waitlist
                  </Button>
                  <Badge className="mt-4 bg-purple-500/20 text-purple-400 border-purple-500/30 text-[10px]">Coming Soon</Badge>
                </div>
              </GlassCard>
            </motion.div>

            {/* Incidents Bento */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <GlassCard className="p-5 flex flex-col h-full max-h-[400px]">
                <div className="flex items-center justify-between mb-4 pb-4 border-b border-white/10 shrink-0">
                  <h2 className="text-md font-semibold text-white flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-400" />
                    Security Incidents
                  </h2>
                </div>
                <div className="space-y-3 overflow-y-auto pr-2 custom-scrollbar flex-1">
                  {incidentsLoading ? (
                    <div className="py-4 text-center"><Loader className="w-4 h-4 animate-spin text-white/40 mx-auto" /></div>
                  ) : incidents.length === 0 ? (
                    <div className="text-center py-4 text-white/40 text-xs">All systems nominal. No incidents.</div>
                  ) : (
                    incidents.map((incident: any) => (
                      <div key={incident.id} className="p-3 rounded-lg border border-white/10 bg-white/[0.02]">
                        <div className="flex justify-between items-start gap-2 mb-2">
                          <h4 className="text-xs font-medium text-white line-clamp-2">{incident.title}</h4>
                          <Badge className={`text-[9px] shrink-0 ${getSeverityColor(incident.severity)}`}>{incident.severity}</Badge>
                        </div>
                        <div className="flex justify-between items-center text-[10px] text-white/40">
                          <span>{new Date(incident.createdAt).toLocaleDateString()}</span>
                          <span className={`${incident.status === 'resolved' ? 'text-emerald-400' : 'text-amber-400'} font-medium capitalize`}>
                            {incident.status}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </GlassCard>
            </motion.div>

            {/* Stamps Bento */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <GlassCard className="p-5">
                <div className="flex items-center justify-between mb-4 pb-4 border-b border-white/10">
                  <h2 className="text-md font-semibold text-white flex items-center gap-2">
                    <Database className="w-4 h-4 text-cyan-400" />
                    Action Ledger (Stamps)
                  </h2>
                </div>
                <div className="space-y-3">
                  {stampsLoading ? (
                    <div className="py-4 text-center"><Loader className="w-4 h-4 animate-spin text-white/40 mx-auto" /></div>
                  ) : stamps.length === 0 ? (
                    <div className="text-center py-4 text-white/40 text-xs">No blockchain stamps recorded.</div>
                  ) : (
                    stamps.slice(0, 5).map((stamp: any) => (
                      <div key={stamp.id} className="flex gap-3 text-sm p-2 rounded-lg hover:bg-white/5 transition-colors">
                        <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                          {stamp.stampType === "certification" ? <Award className="w-4 h-4 text-cyan-400" /> : <Lock className="w-4 h-4 text-purple-400" />}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex justify-between items-center">
                            <p className="text-xs font-medium text-white truncate capitalize">{stamp.stampType} {stamp.status}</p>
                            <span className="text-[9px] text-white/40">{new Date(stamp.createdAt).toLocaleDateString()}</span>
                          </div>
                          <p className="text-[10px] text-cyan-400/60 font-mono truncate mt-0.5">{stamp.dataHash?.slice(0,20)}...</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </GlassCard>
            </motion.div>

          </div>
        </div>
      </main>
    </div>
  );
}
