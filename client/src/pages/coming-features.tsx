import { useState } from "react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { GlassCard } from "@/components/glass-card";
import { Info, Check, Clock, Circle, Sparkles, Building2, TrendingUp, Rocket } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

const defaultFeatures = [
  {
    id: "1",
    title: "City Zoning System",
    description: "Divide Chronicles settlements into Residential, Commercial, and Civic zones. Each zone has unique building types, costs, and benefits. Residential zones for player homes, Commercial for businesses and shops, Civic for community buildings and governance.",
    category: "chronicles-estate",
    status: "pending",
    sortOrder: 1,
    estimatedTime: "2-3 days"
  },
  {
    id: "2",
    title: "Plot Marketplace",
    description: "Buy, sell, and trade land plots using Shells. Browse available plots by era, zone type, and location. Auction system for premium plots. Price history and market analytics for smart investing.",
    category: "chronicles-estate",
    status: "pending",
    sortOrder: 2,
    estimatedTime: "2-3 days"
  },
  {
    id: "3",
    title: "Daily Login Rewards",
    description: "Streak-based rewards system to encourage daily engagement. Earn Shells, XP, and exclusive items for consecutive logins. Milestone bonuses at 7, 30, and 90 day streaks. Never miss a day to maximize rewards.",
    category: "chronicles-estate",
    status: "pending",
    sortOrder: 3,
    estimatedTime: "1-2 days"
  },
  {
    id: "4",
    title: "Business Onboarding",
    description: "Real-world businesses can claim and operate commercial plots in Chronicles. Verification process ensures legitimate businesses. Era-appropriate storefronts across all time periods. Advertising and customer engagement tools.",
    category: "chronicles-estate",
    status: "pending",
    sortOrder: 4,
    estimatedTime: "2-3 days"
  },
  {
    id: "5",
    title: "Era-Appropriate Settlements",
    description: "Settlement templates that match each historical era's architecture and culture. Ancient Egyptian pyramids, Medieval castles, Renaissance villas, Victorian mansions, and Futuristic megastructures. Buildings auto-style to fit their era.",
    category: "chronicles-estate",
    status: "pending",
    sortOrder: 5,
    estimatedTime: "2-3 days"
  },
  {
    id: "6",
    title: "Proof of Impact Dashboard",
    description: "Public real-time metrics showing actual platform usage. Active players, transactions processed, businesses onboarded, and community growth. No vanity metrics - just real data proving DarkWave delivers.",
    category: "strategic",
    status: "pending",
    sortOrder: 6,
    estimatedTime: "4-6 weeks"
  },
  {
    id: "7",
    title: "Chronicles Polish & Onboarding",
    description: "Streamlined new player experience requiring zero crypto knowledge. Interactive tutorials, guided first-time experience, and smart defaults. Faster load times and smoother animations throughout.",
    category: "strategic",
    status: "pending",
    sortOrder: 7,
    estimatedTime: "4-6 weeks"
  },
  {
    id: "8",
    title: "Verifiable Revenue Sharing",
    description: "On-chain dividend distribution from real business operations. DWC holders receive actual revenue from Chronicles purchases, Guardian audit fees, and marketplace transactions. Provable, transparent, and automatic.",
    category: "strategic",
    status: "pending",
    sortOrder: 8,
    estimatedTime: "8-12 weeks"
  },
  {
    id: "9",
    title: "Accountability Registry",
    description: "On-chain prediction and claim tracking for influencers and promoters. Stake your reputation on predictions. Accuracy recorded permanently. Build trust through verifiable track records.",
    category: "strategic",
    status: "pending",
    sortOrder: 9,
    estimatedTime: "6-9 weeks"
  },
  {
    id: "10",
    title: "Enterprise Guardian & RWA",
    description: "Compliance-ready security audit system for enterprise clients. SOC2-ready logging, permissioned API access, and professional documentation. Real-world asset tokenization for institutional investment.",
    category: "strategic",
    status: "pending",
    sortOrder: 10,
    estimatedTime: "10-14 weeks"
  }
];

const categoryConfig = {
  "chronicles-estate": {
    label: "Chronicles Estate",
    icon: Building2,
    gradient: "from-amber-400 via-orange-400 to-red-400",
    bgGlow: "rgba(251,146,60,0.15)"
  },
  "strategic": {
    label: "Strategic Platform Features",
    icon: TrendingUp,
    gradient: "from-cyan-400 via-purple-400 to-pink-400",
    bgGlow: "rgba(139,92,246,0.15)"
  }
};

const statusConfig = {
  pending: { icon: Circle, color: "text-slate-400", bg: "bg-slate-500/20", label: "Upcoming" },
  "in-progress": { icon: Clock, color: "text-amber-400", bg: "bg-amber-500/20", label: "In Progress" },
  completed: { icon: Check, color: "text-emerald-400", bg: "bg-emerald-500/20", label: "Complete" }
};

export default function ComingFeatures() {
  const { data: dbFeatures } = useQuery({
    queryKey: ["/api/roadmap-features"],
    staleTime: 30000
  });

  const features = (dbFeatures as typeof defaultFeatures) || defaultFeatures;
  
  const chroniclesFeatures = features.filter(f => f.category === "chronicles-estate").sort((a, b) => a.sortOrder - b.sortOrder);
  const strategicFeatures = features.filter(f => f.category === "strategic").sort((a, b) => a.sortOrder - b.sortOrder);

  const completedCount = features.filter(f => f.status === "completed").length;
  const inProgressCount = features.filter(f => f.status === "in-progress").length;
  const totalCount = features.length;

  return (
    <div className="min-h-screen bg-slate-950 relative overflow-hidden">
      {/* Floating ambient orbs */}
      <div className="absolute top-20 left-10 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-40 right-20 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
      <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-pink-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "2s" }} />

      <div className="relative z-10 max-w-6xl mx-auto px-4 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border border-white/10 mb-6">
            <Rocket className="w-4 h-4 text-cyan-400" />
            <span className="text-sm font-medium text-white/80 uppercase tracking-wider">Development Roadmap</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Coming Features
            </span>
          </h1>
          
          <p className="text-slate-400 text-lg max-w-2xl mx-auto mb-8">
            Transparency in development. Watch as we build the future of blockchain gaming and DeFi.
          </p>

          {/* Progress Stats */}
          <div className="flex justify-center gap-6 flex-wrap">
            <GlassCard glow className="px-6 py-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center">
                  <Check className="w-5 h-5 text-emerald-400" />
                </div>
                <div className="text-left">
                  <p className="text-2xl font-bold text-white">{completedCount}</p>
                  <p className="text-xs text-slate-400">Completed</p>
                </div>
              </div>
            </GlassCard>
            <GlassCard glow className="px-6 py-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center">
                  <Clock className="w-5 h-5 text-amber-400" />
                </div>
                <div className="text-left">
                  <p className="text-2xl font-bold text-white">{inProgressCount}</p>
                  <p className="text-xs text-slate-400">In Progress</p>
                </div>
              </div>
            </GlassCard>
            <GlassCard glow className="px-6 py-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-purple-400" />
                </div>
                <div className="text-left">
                  <p className="text-2xl font-bold text-white">{totalCount}</p>
                  <p className="text-xs text-slate-400">Total Features</p>
                </div>
              </div>
            </GlassCard>
          </div>
        </motion.div>

        {/* Chronicles Estate Section */}
        <FeatureSection
          title="Chronicles Estate"
          subtitle="Building the virtual world"
          config={categoryConfig["chronicles-estate"]}
          features={chroniclesFeatures}
        />

        {/* Strategic Features Section */}
        <FeatureSection
          title="Strategic Platform Features"
          subtitle="What sets DarkWave apart"
          config={categoryConfig["strategic"]}
          features={strategicFeatures}
        />

        {/* Footer CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-center mt-16"
        >
          <GlassCard glow className="p-8 max-w-2xl mx-auto">
            <Sparkles className="w-10 h-10 text-cyan-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Building Something Different</h3>
            <p className="text-slate-400 text-sm">
              We're not just making promises - we're building in public. Every feature checked off is real, working code you can use.
            </p>
          </GlassCard>
        </motion.div>
      </div>
    </div>
  );
}

function FeatureSection({ 
  title, 
  subtitle, 
  config, 
  features 
}: { 
  title: string; 
  subtitle: string;
  config: typeof categoryConfig["chronicles-estate"]; 
  features: typeof defaultFeatures;
}) {
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-12"
    >
      <div className="flex items-center gap-3 mb-6">
        <div 
          className="w-12 h-12 rounded-xl flex items-center justify-center"
          style={{ background: config.bgGlow, boxShadow: `0 0 30px ${config.bgGlow}` }}
        >
          <Icon className={`w-6 h-6 bg-gradient-to-r ${config.gradient} bg-clip-text`} style={{ color: "rgb(139,92,246)" }} />
        </div>
        <div>
          <h2 className={`text-2xl font-bold bg-gradient-to-r ${config.gradient} bg-clip-text text-transparent`}>
            {title}
          </h2>
          <p className="text-slate-400 text-sm">{subtitle}</p>
        </div>
      </div>

      <div className="space-y-3">
        {features.map((feature, index) => (
          <FeatureCard key={feature.id} feature={feature} index={index} />
        ))}
      </div>
    </motion.div>
  );
}

function FeatureCard({ feature, index }: { feature: typeof defaultFeatures[0]; index: number }) {
  const status = statusConfig[feature.status as keyof typeof statusConfig] || statusConfig.pending;
  const StatusIcon = status.icon;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      <GlassCard 
        className={`p-4 transition-all duration-300 ${feature.status === "completed" ? "opacity-70" : ""}`}
        glow={feature.status === "in-progress"}
      >
        <div className="flex items-start gap-4">
          {/* Status checkbox */}
          <div className={`w-8 h-8 rounded-lg ${status.bg} flex items-center justify-center flex-shrink-0 mt-0.5`}>
            <StatusIcon className={`w-4 h-4 ${status.color}`} />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className={`font-semibold ${feature.status === "completed" ? "text-slate-400 line-through" : "text-white"}`}>
                {feature.title}
              </h3>
              
              {/* Info bubble */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <button 
                    className="w-5 h-5 rounded-full bg-slate-700/50 hover:bg-slate-600/50 flex items-center justify-center transition-colors"
                    data-testid={`info-${feature.id}`}
                  >
                    <Info className="w-3 h-3 text-slate-400" />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="top" className="max-w-xs bg-slate-800 border-slate-700 p-3">
                  <p className="text-sm text-slate-200">{feature.description}</p>
                </TooltipContent>
              </Tooltip>

              {/* Status badge */}
              <span className={`text-xs px-2 py-0.5 rounded-full ${status.bg} ${status.color}`}>
                {status.label}
              </span>

              {/* Estimated time */}
              {feature.estimatedTime && feature.status !== "completed" && (
                <span className="text-xs text-slate-500">
                  ~{feature.estimatedTime}
                </span>
              )}
            </div>
          </div>
        </div>
      </GlassCard>
    </motion.div>
  );
}
