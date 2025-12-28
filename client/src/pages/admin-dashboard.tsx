import { useState } from "react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { 
  BarChart3, Users, Megaphone, Gift, Handshake, DollarSign, 
  Zap, TrendingUp, Activity, Globe, Gamepad2, Crown, Settings,
  ArrowRight, ExternalLink, Clock, CheckCircle2, AlertTriangle
} from "lucide-react";
import { MobileNav } from "@/components/mobile-nav";

interface QuickStat {
  label: string;
  value: string | number;
  change?: string;
  trend?: "up" | "down" | "neutral";
  icon: React.ReactNode;
}

const GlowOrb = ({ color, size, top, left, delay = 0 }: { color: string; size: number; top: string; left: string; delay?: number }) => (
  <motion.div
    className="absolute rounded-full blur-3xl opacity-20 pointer-events-none"
    style={{ background: color, width: size, height: size, top, left }}
    animate={{ scale: [1, 1.2, 1], opacity: [0.15, 0.25, 0.15] }}
    transition={{ duration: 8, repeat: Infinity, delay }}
  />
);

function BentoCard({ 
  children, 
  className = "", 
  span = "1", 
  href,
  glow = "cyan"
}: { 
  children: React.ReactNode; 
  className?: string; 
  span?: "1" | "2" | "row"; 
  href?: string;
  glow?: "cyan" | "purple" | "pink" | "amber";
}) {
  const glowColors = {
    cyan: "rgba(0,200,255,0.15)",
    purple: "rgba(168,85,247,0.15)",
    pink: "rgba(236,72,153,0.15)",
    amber: "rgba(245,158,11,0.15)",
  };
  
  const spanClasses = {
    "1": "col-span-1",
    "2": "col-span-1 md:col-span-2",
    "row": "col-span-1 md:col-span-2 lg:col-span-3",
  };
  
  const content = (
    <motion.div
      className={`relative overflow-hidden rounded-2xl border border-white/10 bg-slate-900/80 backdrop-blur-xl p-6 ${spanClasses[span]} ${className} ${href ? 'cursor-pointer' : ''}`}
      style={{ boxShadow: `0 0 40px ${glowColors[glow]}` }}
      whileHover={href ? { scale: 1.02, borderColor: "rgba(255,255,255,0.2)" } : undefined}
      transition={{ duration: 0.2 }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
      <div className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br from-cyan-500/10 to-purple-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
  
  if (href) {
    return <Link href={href}>{content}</Link>;
  }
  return content;
}

function StatCard({ stat, index }: { stat: QuickStat; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="flex items-center gap-4"
    >
      <div className="p-3 rounded-xl bg-gradient-to-br from-cyan-500/20 to-purple-500/20 border border-white/10">
        {stat.icon}
      </div>
      <div>
        <p className="text-2xl font-bold text-white">{stat.value}</p>
        <p className="text-sm text-gray-400">{stat.label}</p>
        {stat.change && (
          <p className={`text-xs ${stat.trend === 'up' ? 'text-green-400' : stat.trend === 'down' ? 'text-red-400' : 'text-gray-500'}`}>
            {stat.change}
          </p>
        )}
      </div>
    </motion.div>
  );
}

export default function AdminDashboard() {
  const { data: marketingStats } = useQuery({
    queryKey: ["/api/marketing/stats"],
    queryFn: async () => {
      const res = await fetch("/api/marketing/stats", { credentials: "include" });
      if (!res.ok) return { totalPosts: 0, deployed: 0, pending: 0 };
      return res.json();
    },
  });

  const { data: presaleStats } = useQuery({
    queryKey: ["/api/presale/stats"],
    queryFn: async () => {
      const res = await fetch("/api/presale/stats");
      if (!res.ok) return { totalRaisedUsd: 0, tokensSold: 0, uniqueHolders: 0 };
      return res.json();
    },
  });

  const { data: crowdfundStats } = useQuery({
    queryKey: ["/api/crowdfund/stats"],
    queryFn: async () => {
      const res = await fetch("/api/crowdfund/stats");
      if (!res.ok) return { totalRaised: 0, backerCount: 0, goalProgress: 0 };
      return res.json();
    },
  });

  const quickStats: QuickStat[] = [
    { label: "Total Raised", value: `$${((presaleStats?.totalRaisedUsd || 0) + (crowdfundStats?.totalRaised || 0)).toLocaleString()}`, icon: <DollarSign className="w-5 h-5 text-green-400" /> },
    { label: "Token Holders", value: presaleStats?.uniqueHolders || 0, icon: <Users className="w-5 h-5 text-cyan-400" /> },
    { label: "Tokens Sold", value: (presaleStats?.tokensSold || 0).toLocaleString(), icon: <Zap className="w-5 h-5 text-yellow-400" /> },
    { label: "Marketing Posts", value: marketingStats?.totalPosts || 0, icon: <Megaphone className="w-5 h-5 text-purple-400" /> },
  ];

  const adminModules = [
    { id: "marketing", title: "Marketing Automation", description: `${marketingStats?.totalPosts || 0} posts ready • Auto-deployment system`, icon: <Megaphone className="w-6 h-6" />, href: "/admin/marketing", glow: "purple" as const, status: "ready" },
    { id: "analytics", title: "Analytics Dashboard", description: "Traffic, engagement, conversions", icon: <BarChart3 className="w-6 h-6" />, href: "/admin/analytics", glow: "cyan" as const, status: "active" },
    { id: "rewards", title: "Rewards Management", description: "Early Adopter program, token allocations", icon: <Gift className="w-6 h-6" />, href: "/admin/rewards", glow: "pink" as const, status: "active" },
    { id: "partners", title: "Partner Requests", description: "Studio applications, NDA approvals", icon: <Handshake className="w-6 h-6" />, href: "/admin/partner-requests", glow: "amber" as const, status: "active" },
  ];

  const ecosystemLinks = [
    { title: "DWSC Portal", description: "Main blockchain portal", url: "/", icon: <Globe className="w-5 h-5" /> },
    { title: "DarkWave Chronicles", description: "Flagship adventure game", url: "/chronicles", icon: <Gamepad2 className="w-5 h-5" /> },
    { title: "YourLegacy.io", description: "Chronicles standalone", url: "/legacy", icon: <Crown className="w-5 h-5" /> },
    { title: "Presale", description: "Token presale page", url: "/presale", icon: <Zap className="w-5 h-5" /> },
    { title: "Crowdfund", description: "Donation campaign", url: "/crowdfund", icon: <DollarSign className="w-5 h-5" /> },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-white relative overflow-hidden">
      <GlowOrb color="linear-gradient(135deg, #06b6d4, #8b5cf6)" size={600} top="-10%" left="-10%" />
      <GlowOrb color="linear-gradient(135deg, #ec4899, #8b5cf6)" size={500} top="50%" left="70%" delay={2} />
      <GlowOrb color="linear-gradient(135deg, #f59e0b, #ef4444)" size={400} top="80%" left="20%" delay={4} />

      <MobileNav />

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-8 pt-20">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-2">
            <span className="bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
              Owner Control Center
            </span>
          </h1>
          <p className="text-gray-400 text-lg">DarkWave Smart Chain • Complete Ecosystem Management</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {quickStats.map((stat, i) => (
            <BentoCard key={stat.label} glow={i % 2 === 0 ? "cyan" : "purple"}>
              <StatCard stat={stat} index={i} />
            </BentoCard>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <BentoCard span="row" glow="cyan">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Activity className="w-5 h-5 text-cyan-400" />
                System Status
              </h2>
              <span className="px-3 py-1 rounded-full bg-green-500/20 text-green-400 text-sm border border-green-500/30">
                All Systems Operational
              </span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-400" />
                <span className="text-sm text-gray-300">Blockchain</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-400" />
                <span className="text-sm text-gray-300">Payments</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-yellow-400" />
                <span className="text-sm text-gray-300">Marketing</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-400" />
                <span className="text-sm text-gray-300">Database</span>
              </div>
            </div>
          </BentoCard>
        </div>

        <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
          <Settings className="w-6 h-6 text-purple-400" />
          Admin Modules
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {adminModules.map((module, i) => (
            <BentoCard key={module.id} href={module.href} glow={module.glow}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className={`p-3 rounded-xl bg-gradient-to-br ${
                    module.glow === 'purple' ? 'from-purple-500/20 to-pink-500/20' :
                    module.glow === 'cyan' ? 'from-cyan-500/20 to-blue-500/20' :
                    module.glow === 'pink' ? 'from-pink-500/20 to-red-500/20' :
                    'from-amber-500/20 to-orange-500/20'
                  } border border-white/10`}>
                    {module.icon}
                  </div>
                  <div className="flex items-center gap-2">
                    {module.status === 'ready' && (
                      <span className="px-2 py-1 rounded-full bg-yellow-500/20 text-yellow-400 text-xs border border-yellow-500/30">
                        Ready to Launch
                      </span>
                    )}
                    <ArrowRight className="w-5 h-5 text-gray-500" />
                  </div>
                </div>
                <h3 className="text-lg font-bold text-white mb-1">{module.title}</h3>
                <p className="text-sm text-gray-400">{module.description}</p>
              </motion.div>
            </BentoCard>
          ))}
        </div>

        <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
          <Globe className="w-6 h-6 text-cyan-400" />
          Ecosystem Quick Links
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {ecosystemLinks.map((link, i) => (
            <Link key={link.title} href={link.url}>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05 }}
                whileHover={{ scale: 1.05 }}
                className="p-4 rounded-xl border border-white/10 bg-slate-900/50 backdrop-blur-sm hover:border-cyan-500/30 transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-2 mb-2 text-cyan-400 group-hover:text-cyan-300">
                  {link.icon}
                  <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <h4 className="font-semibold text-white text-sm">{link.title}</h4>
                <p className="text-xs text-gray-500">{link.description}</p>
              </motion.div>
            </Link>
          ))}
        </div>

        <div className="mt-12 text-center text-gray-500 text-sm">
          <p>DarkWave Studios • Owner Control Center v1.0</p>
          <p className="text-xs mt-1">July 4, 2026 Public Beta Target</p>
        </div>
      </div>
    </div>
  );
}
