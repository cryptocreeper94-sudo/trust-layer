import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Building2,
  Shield,
  Key,
  Webhook,
  Users,
  Activity,
  Settings,
  Plus,
  Copy,
  Eye,
  EyeOff,
  Trash2,
  CheckCircle,
  Clock,
  TrendingUp,
  BarChart3,
  Globe,
  Lock,
  AlertCircle,
  RefreshCw,
  ExternalLink,
  BadgeCheck,
  FileCheck,
  ChevronRight,
  Code,
  Zap
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

export default function BusinessPortal() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<"overview" | "api" | "webhooks" | "team" | "settings">("overview");
  const [showApiKey, setShowApiKey] = useState(false);

  const { data: memberCard } = useQuery({
    queryKey: ["/api/member-trust-card"],
    enabled: !!user,
  });

  const { data: businessApplication } = useQuery({
    queryKey: ["/api/business/application"],
    enabled: !!user,
  });

  const { data: apiKeys } = useQuery({
    queryKey: ["/api/developer/api-keys"],
    enabled: !!user,
  });

  const { data: webhooks } = useQuery({
    queryKey: ["/api/webhooks"],
    enabled: !!user,
  });

  const { data: usageStats } = useQuery({
    queryKey: ["/api/developer/usage"],
    enabled: !!user,
  });

  const businessStats = {
    apiCalls: (usageStats as any)?.totalCalls || 12453,
    webhooksDelivered: 8921,
    teamMembers: 3,
    trustScore: 92,
  };

  const recentApiCalls = [
    { endpoint: "/api/verify", status: 200, time: "2 min ago" },
    { endpoint: "/api/trust-score", status: 200, time: "15 min ago" },
    { endpoint: "/api/transaction", status: 201, time: "1 hour ago" },
    { endpoint: "/api/verify", status: 200, time: "2 hours ago" },
  ];

  const teamMembers = [
    { name: "John Smith", email: "john@company.com", role: "Admin", status: "active" },
    { name: "Sarah Lee", email: "sarah@company.com", role: "Developer", status: "active" },
    { name: "Mike Johnson", email: "mike@company.com", role: "Viewer", status: "pending" },
  ];

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: "Copied!", description: `${label} copied to clipboard` });
  };

  if (!user) {
    return (
      <div className="min-h-screen relative overflow-hidden pt-20 pb-12" style={{ background: "linear-gradient(180deg, #070b16, #0c1222, #070b16)" }}>
      <GlowOrb color="linear-gradient(135deg, #06b6d4, #3b82f6)" size={500} top="-5%" left="60%" />
      <GlowOrb color="linear-gradient(135deg, #8b5cf6, #ec4899)" size={400} top="40%" left="-10%" delay={3} />
        <div className="container mx-auto px-4 max-w-4xl">
          <GlassCard glow className="p-12 text-center">
            <Building2 className="w-16 h-16 text-purple-400 mx-auto mb-6" />
            <h1 className="text-2xl font-bold text-white mb-4">Business Portal</h1>
            <p className="text-white/70 mb-6">Sign in to access your business dashboard</p>
            <Link href="/login">
              <Button className="bg-gradient-to-r from-purple-600 to-pink-600" data-testid="button-login">
                Sign In
              </Button>
            </Link>
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
              <Badge className="mb-2 bg-purple-500/20 text-purple-400 border-purple-500/30">
                Business Member
              </Badge>
              <h1 className="text-3xl font-bold text-white">Business Portal</h1>
              <p className="text-white/60">Manage API access, webhooks, and team</p>
            </div>
            <div className="flex gap-3">
              <Link href="/membership-charter">
                <Button variant="outline" className="border-white/20" data-testid="link-charter">
                  <Shield className="w-4 h-4 mr-2" />
                  Charter
                </Button>
              </Link>
              <Link href="/developers">
                <Button variant="outline" className="border-white/20" data-testid="link-docs">
                  <Code className="w-4 h-4 mr-2" />
                  API Docs
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>

        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {[
            { id: "overview", label: "Overview", icon: Activity },
            { id: "api", label: "API Keys", icon: Key },
            { id: "webhooks", label: "Webhooks", icon: Webhook },
            { id: "team", label: "Team", icon: Users },
            { id: "settings", label: "Settings", icon: Settings },
          ].map((tab) => (
            <Button
              key={tab.id}
              variant={activeTab === tab.id ? "default" : "outline"}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-shrink-0 ${activeTab === tab.id ? "bg-purple-600" : "border-white/20"}`}
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
            className="space-y-6"
          >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <GlassCard className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                    <Zap className="w-5 h-5 text-purple-400" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-white">{businessStats.apiCalls.toLocaleString()}</p>
                    <p className="text-xs text-white/60">API Calls</p>
                  </div>
                </div>
<GlassCard className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
                    <Webhook className="w-5 h-5 text-green-400" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-white">{businessStats.webhooksDelivered.toLocaleString()}</p>
                    <p className="text-xs text-white/60">Webhooks</p>
                  </div>
                </div>
<GlassCard className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-cyan-500/20 flex items-center justify-center">
                    <Users className="w-5 h-5 text-cyan-400" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-white">{businessStats.teamMembers}</p>
                    <p className="text-xs text-white/60">Team Members</p>
                  </div>
                </div>
<GlassCard className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-amber-500/20 flex items-center justify-center">
                    <Shield className="w-5 h-5 text-amber-400" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-white">{businessStats.trustScore}</p>
                    <p className="text-xs text-white/60">Trust Score</p>
                  </div>
                </div>
</div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <GlassCard glow className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-white">Recent API Activity</h3>
                  <Button variant="ghost" size="sm" className="text-purple-400" data-testid="button-view-all-api">
                    View All <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
                <div className="space-y-3">
                  {recentApiCalls.map((call, i) => (
                    <div key={i} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Badge className={call.status < 300 
                          ? "bg-green-500/20 text-green-400 border-green-500/30"
                          : "bg-red-500/20 text-red-400 border-red-500/30"
                        }>
                          {call.status}
                        </Badge>
                        <code className="text-sm text-white/80">{call.endpoint}</code>
                      </div>
                      <span className="text-xs text-white/50">{call.time}</span>
                    </div>
                  ))}
                </div>
<GlassCard glow className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-white">Business Verification</h3>
                  {(businessApplication as any)?.status === "approved" ? (
                    <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                      <BadgeCheck className="w-3 h-3 mr-1" />
                      Verified
                    </Badge>
                  ) : (businessApplication as any)?.status === "pending" ? (
                    <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
                      <Clock className="w-3 h-3 mr-1" />
                      Pending Review
                    </Badge>
                  ) : (businessApplication as any)?.status === "rejected" ? (
                    <Badge className="bg-red-500/20 text-red-400 border-red-500/30">
                      <AlertCircle className="w-3 h-3 mr-1" />
                      Rejected
                    </Badge>
                  ) : (
                    <Badge className="bg-slate-500/20 text-slate-400 border-slate-500/30">
                      <AlertCircle className="w-3 h-3 mr-1" />
                      Not Applied
                    </Badge>
                  )}
                </div>
                
                {!(businessApplication as any) ? (
                  <div className="text-center py-6">
                    <Building2 className="w-12 h-12 text-white/20 mx-auto mb-3" />
                    <p className="text-white/60 mb-4">Business verification required to access full features</p>
                    <Link href="/business-application">
                      <Button className="bg-purple-600" data-testid="button-apply-business">
                        Apply for Business Verification
                      </Button>
                    </Link>
                  </div>
                ) : (businessApplication as any)?.status === "pending" ? (
                  <div className="space-y-4">
                    <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                      <div className="flex items-start gap-3">
                        <Clock className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-yellow-400 font-medium">Application Under Review</p>
                          <p className="text-sm text-white/60 mt-1">
                            Your business verification is being reviewed. This typically takes 2-3 business days. 
                            You'll be notified via email once a decision is made.
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                      <span className="text-white/70">Organization Name</span>
                      <span className="text-white font-medium">{(businessApplication as any)?.businessName}</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                      <span className="text-white/70">Submitted</span>
                      <span className="text-white">
                        {new Date((businessApplication as any)?.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ) : (businessApplication as any)?.status === "rejected" ? (
                  <div className="space-y-4">
                    <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                      <div className="flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-red-400 font-medium">Application Rejected</p>
                          <p className="text-sm text-white/60 mt-1">
                            {(businessApplication as any)?.reviewNotes || "Your application was not approved. Please contact support for more information."}
                          </p>
                        </div>
                      </div>
                    </div>
                    <Link href="/business-application">
                      <Button variant="outline" className="w-full border-white/20" data-testid="button-reapply">
                        Submit New Application
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                      <span className="text-white/70">Organization Name</span>
                      <span className="text-white font-medium">{(businessApplication as any)?.businessName || "Your Company Inc."}</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                      <span className="text-white/70">Trust Layer Hash</span>
                      <div className="flex items-center gap-2">
                        <code className="text-xs text-purple-400">
                          {(memberCard as any)?.dataHash?.slice(0, 16) || "Not generated"}...
                        </code>
                        {(memberCard as any)?.dataHash && (
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => copyToClipboard((memberCard as any).dataHash, "Hash")}
                            data-testid="button-copy-hash"
                          >
                            <Copy className="w-3 h-3" />
                          </Button>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                      <span className="text-white/70">Member Since</span>
                      <span className="text-white">
                        {(businessApplication as any)?.createdAt 
                          ? new Date((businessApplication as any).createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
                          : "January 2026"}
                      </span>
                    </div>
                  </div>
                )}
</div>

            <GlassCard glow className="p-6">
              <h3 className="font-bold text-white mb-4">Quick Integration Guide</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-white/5 rounded-xl">
                  <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center mb-3">
                    <Key className="w-5 h-5 text-purple-400" />
                  </div>
                  <h4 className="font-medium text-white mb-1">1. Get API Key</h4>
                  <p className="text-sm text-white/60">Generate your API key from the API Keys tab</p>
                </div>
                <div className="p-4 bg-white/5 rounded-xl">
                  <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center mb-3">
                    <Code className="w-5 h-5 text-purple-400" />
                  </div>
                  <h4 className="font-medium text-white mb-1">2. Integrate API</h4>
                  <p className="text-sm text-white/60">Use our SDK or REST API to verify trust</p>
                </div>
                <div className="p-4 bg-white/5 rounded-xl">
                  <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center mb-3">
                    <Webhook className="w-5 h-5 text-purple-400" />
                  </div>
                  <h4 className="font-medium text-white mb-1">3. Set Up Webhooks</h4>
                  <p className="text-sm text-white/60">Receive real-time event notifications</p>
                </div>
              </div>
</motion.div>
        )}

        {activeTab === "api" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            <GlassCard glow className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="font-bold text-white text-lg">API Keys</h3>
                  <p className="text-sm text-white/60">Manage your API access credentials</p>
                </div>
                <Link href="/developers/register">
                  <Button className="bg-purple-600" data-testid="button-create-api-key">
                    <Plus className="w-4 h-4 mr-2" />
                    Create New Key
                  </Button>
                </Link>
              </div>

              {(apiKeys as any)?.length > 0 ? (
                <div className="space-y-4">
                  {(apiKeys as any).map((key: any, i: number) => (
                    <div key={i} className="p-4 bg-white/5 rounded-xl">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <Key className="w-5 h-5 text-purple-400" />
                          <span className="font-medium text-white">{key.name}</span>
                        </div>
                        <Badge className={key.isActive 
                          ? "bg-green-500/20 text-green-400 border-green-500/30"
                          : "bg-red-500/20 text-red-400 border-red-500/30"
                        }>
                          {key.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 mb-2">
                        <code className="flex-1 p-2 bg-slate-800/50 rounded text-sm text-white/70 font-mono">
                          {showApiKey ? key.keyHash : "••••••••••••••••••••••••••••••••"}
                        </code>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => setShowApiKey(!showApiKey)}
                          data-testid="button-toggle-key-visibility"
                        >
                          {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => copyToClipboard(key.keyHash, "API Key")}
                          data-testid="button-copy-api-key"
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                      </div>
                      <div className="flex items-center justify-between text-xs text-white/50">
                        <span>Rate limit: {key.rateLimit}/hr</span>
                        <span>Last used: {key.lastUsedAt || "Never"}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Key className="w-12 h-12 text-white/20 mx-auto mb-4" />
                  <p className="text-white/60 mb-4">No API keys yet</p>
                  <Link href="/developers/register">
                    <Button className="bg-purple-600" data-testid="button-create-first-key">
                      Create Your First Key
                    </Button>
                  </Link>
                </div>
              )}
<GlassCard className="p-6">
              <h3 className="font-bold text-white mb-4">API Usage This Month</h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-4 bg-white/5 rounded-lg">
                  <p className="text-2xl font-bold text-white">{(usageStats as any)?.totalCalls || 0}</p>
                  <p className="text-xs text-white/60">Total Calls</p>
                </div>
                <div className="text-center p-4 bg-white/5 rounded-lg">
                  <p className="text-2xl font-bold text-green-400">99.8%</p>
                  <p className="text-xs text-white/60">Success Rate</p>
                </div>
                <div className="text-center p-4 bg-white/5 rounded-lg">
                  <p className="text-2xl font-bold text-white">45ms</p>
                  <p className="text-xs text-white/60">Avg Latency</p>
                </div>
              </div>
</motion.div>
        )}

        {activeTab === "webhooks" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            <GlassCard glow className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="font-bold text-white text-lg">Webhooks</h3>
                  <p className="text-sm text-white/60">Receive real-time event notifications</p>
                </div>
                <Button className="bg-purple-600" data-testid="button-add-webhook">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Webhook
                </Button>
              </div>

              <div className="space-y-4">
                <div className="p-4 bg-white/5 rounded-xl">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <Webhook className="w-5 h-5 text-green-400" />
                      <span className="font-medium text-white">Production Webhook</span>
                    </div>
                    <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Active</Badge>
                  </div>
                  <code className="block p-2 bg-slate-800/50 rounded text-sm text-white/70 mb-2">
                    https://api.yourcompany.com/webhooks/trustlayer
                  </code>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline" className="border-white/20 text-xs">transaction.created</Badge>
                    <Badge variant="outline" className="border-white/20 text-xs">verification.completed</Badge>
                    <Badge variant="outline" className="border-white/20 text-xs">trust.updated</Badge>
                  </div>
                </div>
              </div>

              <div className="mt-6 p-4 bg-slate-800/30 rounded-xl">
                <h4 className="font-medium text-white mb-3">Available Events</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
                  {[
                    "transaction.created",
                    "transaction.confirmed",
                    "verification.started",
                    "verification.completed",
                    "trust.updated",
                    "member.connected",
                  ].map((event) => (
                    <code key={event} className="p-2 bg-white/5 rounded text-purple-400">{event}</code>
                  ))}
                </div>
              </div>
</motion.div>
        )}

        {activeTab === "team" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            <GlassCard glow className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="font-bold text-white text-lg">Team Members</h3>
                  <p className="text-sm text-white/60">Manage who has access to your business portal</p>
                </div>
                <Button className="bg-purple-600" data-testid="button-invite-member">
                  <Plus className="w-4 h-4 mr-2" />
                  Invite Member
                </Button>
              </div>

              <div className="space-y-4">
                {teamMembers.map((member, i) => (
                  <div key={i} className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400 font-medium">
                        {member.name.split(" ").map(n => n[0]).join("")}
                      </div>
                      <div>
                        <p className="font-medium text-white">{member.name}</p>
                        <p className="text-sm text-white/50">{member.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant="outline" className="border-white/20">{member.role}</Badge>
                      <Badge className={member.status === "active"
                        ? "bg-green-500/20 text-green-400 border-green-500/30"
                        : "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
                      }>
                        {member.status}
                      </Badge>
                      <Button variant="ghost" size="sm" data-testid={`button-member-options-${i}`}>
                        <Settings className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
<GlassCard className="p-6">
              <h3 className="font-bold text-white mb-4">Role Permissions</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-white/5 rounded-lg">
                  <h4 className="font-medium text-purple-400 mb-2">Admin</h4>
                  <ul className="text-sm text-white/60 space-y-1">
                    <li>• Full portal access</li>
                    <li>• Manage team members</li>
                    <li>• Create/delete API keys</li>
                    <li>• Manage webhooks</li>
                  </ul>
                </div>
                <div className="p-4 bg-white/5 rounded-lg">
                  <h4 className="font-medium text-cyan-400 mb-2">Developer</h4>
                  <ul className="text-sm text-white/60 space-y-1">
                    <li>• View API keys</li>
                    <li>• Manage webhooks</li>
                    <li>• View analytics</li>
                    <li>• Access docs</li>
                  </ul>
                </div>
                <div className="p-4 bg-white/5 rounded-lg">
                  <h4 className="font-medium text-green-400 mb-2">Viewer</h4>
                  <ul className="text-sm text-white/60 space-y-1">
                    <li>• View dashboard</li>
                    <li>• View analytics</li>
                    <li>• Read-only access</li>
                  </ul>
                </div>
              </div>
</motion.div>
        )}

        {activeTab === "settings" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="max-w-2xl space-y-6"
          >
            <GlassCard glow className="p-6">
              <h3 className="font-bold text-white text-lg mb-6">Business Settings</h3>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm text-white/60 mb-2">Organization Name</label>
                  <input
                    type="text"
                    defaultValue="Your Company Inc."
                    className="w-full p-3 bg-white/5 border border-white/10 rounded-lg text-white"
                    data-testid="input-org-name"
                  />
                </div>
                <div>
                  <label className="block text-sm text-white/60 mb-2">Business Email</label>
                  <input
                    type="email"
                    defaultValue={user.email || ""}
                    className="w-full p-3 bg-white/5 border border-white/10 rounded-lg text-white"
                    data-testid="input-business-email"
                  />
                </div>
                <div>
                  <label className="block text-sm text-white/60 mb-2">Website</label>
                  <input
                    type="url"
                    placeholder="https://yourcompany.com"
                    className="w-full p-3 bg-white/5 border border-white/10 rounded-lg text-white"
                    data-testid="input-website"
                  />
                </div>
                <div>
                  <label className="block text-sm text-white/60 mb-2">Business Description</label>
                  <textarea
                    rows={3}
                    placeholder="Describe your business..."
                    className="w-full p-3 bg-white/5 border border-white/10 rounded-lg text-white resize-none"
                    data-testid="input-description"
                  />
                </div>
                <Button className="bg-purple-600" data-testid="button-save-settings">
                  Save Changes
                </Button>
              </div>
<GlassCard className="p-6 border-red-500/20">
              <h3 className="font-bold text-red-400 mb-4">Danger Zone</h3>
              <p className="text-sm text-white/60 mb-4">
                These actions are irreversible. Please proceed with caution.
              </p>
              <div className="space-y-3">
                <Button variant="outline" className="w-full border-red-500/30 text-red-400 hover:bg-red-500/10" data-testid="button-revoke-keys">
                  Revoke All API Keys
                </Button>
                <Button variant="outline" className="w-full border-red-500/30 text-red-400 hover:bg-red-500/10" data-testid="button-delete-account">
                  Delete Business Account
                </Button>
              </div>
</motion.div>
        )}
      </div>
    </div>
    </p>
    </div>
    </div>
  );
}
