import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "wouter";
import {
  ArrowLeft, Copy, Check, Users, TrendingUp, DollarSign,
  Crown, Star, Gem, Award, Gift, ExternalLink,
  Clock, CheckCircle, XCircle, ArrowUpRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { GlassCard } from "@/components/glass-card";
import { Progress } from "@/components/ui/progress";
import { useSimpleAuth } from "@/hooks/use-simple-auth";
import { authFetch } from "@/hooks/use-auth";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { queryClient } from "@/lib/queryClient";

const TIER_CONFIG = {
  base: { label: "Base", icon: Star, conversions: 0, rate: 10, color: "text-slate-400", bg: "bg-slate-500/20", border: "border-slate-500/30", next: "silver", nextConversions: 5 },
  silver: { label: "Silver", icon: Award, conversions: 5, rate: 12.5, color: "text-cyan-400", bg: "bg-cyan-500/20", border: "border-cyan-500/30", next: "gold", nextConversions: 15 },
  gold: { label: "Gold", icon: Crown, conversions: 15, rate: 15, color: "text-purple-400", bg: "bg-purple-500/20", border: "border-purple-500/30", next: "platinum", nextConversions: 30 },
  platinum: { label: "Platinum", icon: Gem, conversions: 30, rate: 17.5, color: "text-cyan-300", bg: "bg-cyan-400/20", border: "border-cyan-400/30", next: "diamond", nextConversions: 50 },
  diamond: { label: "Diamond", icon: Gem, conversions: 50, rate: 20, color: "text-purple-300", bg: "bg-purple-400/20", border: "border-purple-400/30", next: null, nextConversions: null },
} as const;

type TierKey = keyof typeof TIER_CONFIG;

export default function AffiliateDashboard() {
  const { user, isAuthenticated } = useSimpleAuth();
  const { toast } = useToast();
  const [linkCopied, setLinkCopied] = useState(false);

  const { data: dashboard, isLoading } = useQuery<{
    tier: TierKey;
    tierInfo: { conversions: number; rate: number };
    totalReferrals: number;
    converted: number;
    pendingEarnings: string;
    paidEarnings: string;
    recentReferrals: Array<{
      id: number;
      referralHash: string;
      status: string;
      platform: string;
      createdAt: string;
      convertedAt: string | null;
    }>;
    recentCommissions: Array<{
      id: number;
      amount: string;
      currency: string;
      tier: string;
      status: string;
      createdAt: string;
    }>;
  }>({
    queryKey: ["/api/affiliate/dashboard"],
    queryFn: async () => {
      const res = await authFetch("/api/affiliate/dashboard");
      if (!res.ok) throw new Error("Failed to load dashboard");
      return res.json();
    },
    enabled: isAuthenticated,
  });

  const { data: referralLink } = useQuery<{ link: string; hash: string; crossPlatformLinks: { name: string; prefix: string; domain: string; link: string }[] }>({
    queryKey: ["/api/affiliate/link"],
    queryFn: async () => {
      const res = await authFetch("/api/affiliate/link");
      if (!res.ok) throw new Error("Failed");
      return res.json();
    },
    enabled: isAuthenticated,
  });

  const payoutMutation = useMutation({
    mutationFn: async () => {
      const res = await authFetch("/api/affiliate/request-payout", { method: "POST" });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Payout failed");
      }
      return res.json();
    },
    onSuccess: (data) => {
      toast({ title: "Payout Requested", description: `${data.amount} SIG is being processed.` });
      queryClient.invalidateQueries({ queryKey: ["/api/affiliate/dashboard"] });
    },
    onError: (err: Error) => {
      toast({ title: "Payout Failed", description: err.message, variant: "destructive" });
    },
  });

  const copyLink = () => {
    if (referralLink?.link) {
      navigator.clipboard.writeText(referralLink.link);
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 2000);
    }
  };

  const currentTier = dashboard?.tier || "base";
  const tierConfig = TIER_CONFIG[currentTier];
  const TierIcon = tierConfig.icon;
  const pendingNum = parseFloat(dashboard?.pendingEarnings || "0");
  const canPayout = pendingNum >= 10;

  const getProgressToNext = () => {
    if (!tierConfig.next || !tierConfig.nextConversions) return 100;
    const current = dashboard?.converted || 0;
    const needed = tierConfig.nextConversions - tierConfig.conversions;
    const progress = current - tierConfig.conversions;
    return Math.min((progress / needed) * 100, 100);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <GlassCard className="max-w-md">
          <div className="p-8 text-center">
            <Gift className="w-16 h-16 text-cyan-400 mx-auto mb-4" />
            <h1 className="text-2xl font-bold mb-2">Affiliate Program</h1>
            <p className="text-white/60 mb-6">Sign in to access your affiliate dashboard and start earning.</p>
            <Link href="/">
              <Button data-testid="button-signin-affiliate" className="bg-gradient-to-r from-cyan-500 to-purple-500">
                Sign In to Continue
              </Button>
            </Link>
          </div>
        </GlassCard>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-transparent to-cyan-900/20 pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(6,182,212,0.15)_0%,_transparent_50%)] pointer-events-none" />

      <div className="relative container mx-auto px-4 pt-6 pb-12 max-w-5xl">
        <Link href="/my-hub">
          <button data-testid="button-back-hub" className="flex items-center gap-2 text-white/60 hover:text-white mb-6 min-h-[44px] transition-colors">
            <ArrowLeft className="w-5 h-5" />
            <span className="text-sm">Back to Hub</span>
          </button>
        </Link>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2" data-testid="text-affiliate-title">Affiliate Dashboard</h1>
          <p className="text-white/50">Refer friends and earn commissions on every conversion.</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
          <GlassCard glow className="mb-6">
            <div className="p-5">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <div className="flex-1 min-w-0">
                  <p className="text-white/50 text-sm mb-1">Your Referral Link</p>
                  <div className="flex items-center gap-2">
                    <code
                      data-testid="text-referral-link"
                      className="text-cyan-400 text-sm font-mono truncate block flex-1 bg-white/5 px-3 py-2 rounded-lg border border-white/10"
                    >
                      {referralLink?.link || "Loading..."}
                    </code>
                    <Button
                      data-testid="button-copy-referral"
                      onClick={copyLink}
                      size="sm"
                      className="min-w-[44px] min-h-[44px] bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 shrink-0"
                    >
                      {linkCopied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </GlassCard>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <GlassCard className="mb-6">
            <div className="p-5">
              <div className="flex items-center gap-3 mb-4">
                <div className={`p-2.5 rounded-xl ${tierConfig.bg} border ${tierConfig.border}`}>
                  <TierIcon className={`w-6 h-6 ${tierConfig.color}`} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-bold text-white" data-testid="text-current-tier">{tierConfig.label} Tier</h2>
                    <Badge className={`${tierConfig.bg} ${tierConfig.color} ${tierConfig.border} text-xs`}>
                      {tierConfig.rate}% Commission
                    </Badge>
                  </div>
                  <p className="text-white/40 text-sm">
                    {tierConfig.next
                      ? `${(dashboard?.converted || 0)} / ${tierConfig.nextConversions} conversions to ${TIER_CONFIG[tierConfig.next as TierKey].label}`
                      : "Maximum tier reached!"}
                  </p>
                </div>
              </div>
              {tierConfig.next && (
                <div>
                  <Progress value={getProgressToNext()} className="h-2" data-testid="progress-tier" />
                  <div className="flex justify-between mt-1">
                    <span className="text-[10px] text-white/30">{tierConfig.label}</span>
                    <span className="text-[10px] text-white/30">{TIER_CONFIG[tierConfig.next as TierKey].label}</span>
                  </div>
                </div>
              )}
            </div>
          </GlassCard>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
            {[
              { label: "Total Referrals", value: String(dashboard?.totalReferrals || 0), icon: Users, color: "text-cyan-400" },
              { label: "Converted", value: String(dashboard?.converted || 0), icon: CheckCircle, color: "text-emerald-400" },
              { label: "Pending (SIG)", value: dashboard?.pendingEarnings || "0.00", icon: Clock, color: "text-purple-400" },
              { label: "Paid (SIG)", value: dashboard?.paidEarnings || "0.00", icon: DollarSign, color: "text-cyan-300" },
            ].map((stat, i) => (
              <GlassCard key={stat.label}>
                <div className="p-4">
                  <stat.icon className={`w-5 h-5 ${stat.color} mb-2`} />
                  <p className="text-2xl font-bold text-white" data-testid={`text-stat-${stat.label.toLowerCase().replace(/[^a-z]/g, "-")}`}>
                    {stat.value}
                  </p>
                  <p className="text-[11px] text-white/40 uppercase tracking-wider mt-1">{stat.label}</p>
                </div>
              </GlassCard>
            ))}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <GlassCard className="mb-6">
            <div className="p-5">
              <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-cyan-400" />
                Commission Tiers
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm" data-testid="table-tiers">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="text-left text-white/40 text-xs py-2 pr-4">Tier</th>
                      <th className="text-left text-white/40 text-xs py-2 pr-4">Conversions</th>
                      <th className="text-left text-white/40 text-xs py-2">Rate</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(Object.entries(TIER_CONFIG) as [TierKey, typeof TIER_CONFIG[TierKey]][]).map(([key, cfg]) => {
                      const isActive = key === currentTier;
                      return (
                        <tr key={key} className={`border-b border-white/5 ${isActive ? "bg-cyan-500/5" : ""}`}>
                          <td className="py-3 pr-4">
                            <div className="flex items-center gap-2">
                              <cfg.icon className={`w-4 h-4 ${cfg.color}`} />
                              <span className={`font-medium ${isActive ? "text-white" : "text-white/70"}`}>{cfg.label}</span>
                              {isActive && <Badge className="bg-cyan-500/20 text-cyan-400 border-cyan-500/30 text-[10px]">Current</Badge>}
                            </div>
                          </td>
                          <td className="py-3 pr-4 text-white/60">{cfg.conversions}+</td>
                          <td className="py-3 text-white/60">{cfg.rate}%</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </GlassCard>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
            <GlassCard>
              <div className="p-5">
                <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                  <Users className="w-4 h-4 text-cyan-400" />
                  Recent Referrals
                </h3>
                {(!dashboard?.recentReferrals || dashboard.recentReferrals.length === 0) ? (
                  <p className="text-white/30 text-sm text-center py-8">No referrals yet. Share your link to get started!</p>
                ) : (
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {dashboard.recentReferrals.map((ref) => (
                      <div key={ref.id} className="flex items-center justify-between py-2 border-b border-white/5" data-testid={`row-referral-${ref.id}`}>
                        <div className="flex items-center gap-2">
                          {ref.status === "converted" ? (
                            <CheckCircle className="w-4 h-4 text-emerald-400" />
                          ) : ref.status === "expired" ? (
                            <XCircle className="w-4 h-4 text-red-400" />
                          ) : (
                            <Clock className="w-4 h-4 text-purple-400" />
                          )}
                          <div>
                            <p className="text-sm text-white font-mono">{ref.referralHash.slice(0, 8)}...</p>
                            <p className="text-[10px] text-white/30">{ref.platform}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge className={`text-[10px] ${
                            ref.status === "converted" ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" :
                            ref.status === "expired" ? "bg-red-500/20 text-red-400 border-red-500/30" :
                            "bg-purple-500/20 text-purple-400 border-purple-500/30"
                          }`}>
                            {ref.status}
                          </Badge>
                          <p className="text-[10px] text-white/20 mt-1">
                            {new Date(ref.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </GlassCard>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <GlassCard>
              <div className="p-5">
                <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-purple-400" />
                  Recent Commissions
                </h3>
                {(!dashboard?.recentCommissions || dashboard.recentCommissions.length === 0) ? (
                  <p className="text-white/30 text-sm text-center py-8">No commissions yet. Commissions appear when referrals convert.</p>
                ) : (
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {dashboard.recentCommissions.map((comm) => (
                      <div key={comm.id} className="flex items-center justify-between py-2 border-b border-white/5" data-testid={`row-commission-${comm.id}`}>
                        <div>
                          <p className="text-sm text-white font-semibold">+{comm.amount} {comm.currency}</p>
                          <p className="text-[10px] text-white/30 capitalize">{comm.tier} tier</p>
                        </div>
                        <div className="text-right">
                          <Badge className={`text-[10px] ${
                            comm.status === "paid" ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" :
                            comm.status === "processing" ? "bg-cyan-500/20 text-cyan-400 border-cyan-500/30" :
                            "bg-purple-500/20 text-purple-400 border-purple-500/30"
                          }`}>
                            {comm.status}
                          </Badge>
                          <p className="text-[10px] text-white/20 mt-1">
                            {new Date(comm.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </GlassCard>
          </motion.div>
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
          <GlassCard glow className="mb-6">
            <div className="p-5">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-sm font-semibold text-white mb-1">Request Payout</h3>
                  <p className="text-white/40 text-xs">Minimum payout: 10 SIG. Current pending: {dashboard?.pendingEarnings || "0.00"} SIG</p>
                </div>
                <Button
                  data-testid="button-request-payout"
                  onClick={() => payoutMutation.mutate()}
                  disabled={!canPayout || payoutMutation.isPending}
                  className="min-h-[44px] min-w-[44px] bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {payoutMutation.isPending ? "Processing..." : "Request Payout"}
                  <ArrowUpRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </div>
  );
}
