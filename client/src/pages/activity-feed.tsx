import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "wouter";
import {
  Activity, ArrowUpRight, ArrowDownRight, Lock,
  Gift, Sparkles, Users, Repeat, Filter, Bell, Pause, Play,
  ExternalLink, TrendingUp, Zap, Home
} from "lucide-react";
import { GlassCard } from "@/components/glass-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";

interface ActivityItem {
  id: string;
  type: "swap" | "stake" | "unstake" | "mint" | "transfer" | "claim" | "liquidity" | "nft";
  user: string;
  description: string;
  amount?: string;
  value?: string;
  timestamp: Date;
  txHash: string;
  isNew?: boolean;
}

const generateActivity = (): ActivityItem => {
  const types: ActivityItem["type"][] = ["swap", "stake", "mint", "transfer", "claim", "liquidity", "nft"];
  const type = types[Math.floor(Math.random() * types.length)];
  const users = ["whale.dwc", "satoshi.eth", "defi_king", "alpha_hunter", "0x7a23...f8d1", "0x8b34...c2e5", "crypto_sage"];
  
  const templates: Record<ActivityItem["type"], { desc: string; amount: string; value: string }> = {
    swap: { desc: "swapped SIG for USDC", amount: `${(1000 + Math.random() * 50000).toFixed(0)} SIG`, value: `$${(150 + Math.random() * 7500).toFixed(0)}` },
    stake: { desc: "staked SIG", amount: `${(1000 + Math.random() * 20000).toFixed(0)} SIG`, value: `$${(150 + Math.random() * 3000).toFixed(0)}` },
    unstake: { desc: "unstaked SIG", amount: `${(500 + Math.random() * 10000).toFixed(0)} SIG`, value: `$${(75 + Math.random() * 1500).toFixed(0)}` },
    mint: { desc: "minted NFT", amount: "Genesis #" + Math.floor(Math.random() * 1000), value: `$${(50 + Math.random() * 500).toFixed(0)}` },
    transfer: { desc: "transferred SIG", amount: `${(100 + Math.random() * 5000).toFixed(0)} SIG`, value: `$${(15 + Math.random() * 750).toFixed(0)}` },
    claim: { desc: "claimed rewards", amount: `${(50 + Math.random() * 500).toFixed(0)} SIG`, value: `$${(7.5 + Math.random() * 75).toFixed(0)}` },
    liquidity: { desc: "added liquidity", amount: `$${(500 + Math.random() * 10000).toFixed(0)}`, value: "LP Tokens" },
    nft: { desc: "listed NFT for sale", amount: "Trust Layer #" + Math.floor(Math.random() * 500), value: `${(100 + Math.random() * 1000).toFixed(0)} SIG` },
  };
  
  const template = templates[type];
  
  return {
    id: Date.now().toString() + Math.random(),
    type,
    user: users[Math.floor(Math.random() * users.length)],
    description: template.desc,
    amount: template.amount,
    value: template.value,
    timestamp: new Date(),
    txHash: `0x${Math.random().toString(16).slice(2, 10)}`,
    isNew: true,
  };
};

const INITIAL_ACTIVITIES: ActivityItem[] = Array.from({ length: 15 }, () => ({
  ...generateActivity(),
  isNew: false,
  timestamp: new Date(Date.now() - Math.random() * 3600000),
})).sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

const typeConfig: Record<ActivityItem["type"], { icon: any; color: string; bgColor: string }> = {
  swap: { icon: Repeat, color: "text-blue-400", bgColor: "bg-blue-500/20" },
  stake: { icon: Lock, color: "text-purple-400", bgColor: "bg-purple-500/20" },
  unstake: { icon: Lock, color: "text-orange-400", bgColor: "bg-orange-500/20" },
  mint: { icon: Sparkles, color: "text-pink-400", bgColor: "bg-pink-500/20" },
  transfer: { icon: ArrowUpRight, color: "text-cyan-400", bgColor: "bg-cyan-500/20" },
  claim: { icon: Gift, color: "text-green-400", bgColor: "bg-green-500/20" },
  liquidity: { icon: TrendingUp, color: "text-amber-400", bgColor: "bg-amber-500/20" },
  nft: { icon: Sparkles, color: "text-pink-400", bgColor: "bg-pink-500/20" },
};

function formatTime(date: Date) {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  if (diff < 60000) return "Just now";
  if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
  return date.toLocaleDateString();
}

function ActivityCard({ activity, index }: { activity: ActivityItem; index: number }) {
  const config = typeConfig[activity.type];
  const Icon = config.icon;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: activity.isNew ? -20 : 0, scale: activity.isNew ? 0.95 : 1 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, x: -100 }}
      transition={{ delay: activity.isNew ? 0 : index * 0.03 }}
      layout
    >
      <GlassCard className={`p-3 ${activity.isNew ? 'ring-1 ring-primary/50' : ''}`}>
        {activity.isNew && (
          <motion.div
            initial={{ opacity: 0.5 }}
            animate={{ opacity: 0 }}
            transition={{ duration: 2 }}
            className="absolute inset-0 bg-primary/10 rounded-xl"
          />
        )}
        <div className="flex items-center gap-3">
          <motion.div 
            className={`p-2 rounded-xl ${config.bgColor}`}
            animate={activity.isNew ? { scale: [1, 1.2, 1] } : {}}
            transition={{ duration: 0.5 }}
          >
            <Icon className={`w-4 h-4 ${config.color}`} />
          </motion.div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm truncate">{activity.user}</span>
              <span className="text-xs text-muted-foreground">{activity.description}</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span className="font-mono">{activity.amount}</span>
              {activity.value && (
                <>
                  <span>•</span>
                  <span>{activity.value}</span>
                </>
              )}
            </div>
          </div>
          
          <div className="text-right flex items-center gap-2">
            <span className="text-xs text-muted-foreground">{formatTime(activity.timestamp)}</span>
            <Button variant="ghost" size="icon" className="h-6 w-6">
              <ExternalLink className="w-3 h-3" />
            </Button>
          </div>
        </div>
      </GlassCard>
    </motion.div>
  );
}


const GlowOrb = ({ color, size, top, left, delay = 0 }: { color: string; size: number; top: string; left: string; delay?: number }) => (
  <motion.div
    className="absolute rounded-full blur-3xl opacity-20 pointer-events-none"
    style={{ background: color, width: size, height: size, top, left }}
    animate={{ scale: [1, 1.2, 1], opacity: [0.15, 0.25, 0.15] }}
    transition={{ duration: 8, repeat: Infinity, delay }}
  />
);

export default function ActivityFeed() {
  const [activities, setActivities] = useState(INITIAL_ACTIVITIES);
  const [isLive, setIsLive] = useState(true);
  const [filter, setFilter] = useState<ActivityItem["type"] | "all">("all");
  
  useEffect(() => {
    if (!isLive) return;
    
    const interval = setInterval(() => {
      const newActivity = generateActivity();
      setActivities(prev => [newActivity, ...prev.slice(0, 49)]);
      
      setTimeout(() => {
        setActivities(prev => prev.map(a => a.id === newActivity.id ? { ...a, isNew: false } : a));
      }, 2000);
    }, 4000);
    
    return () => clearInterval(interval);
  }, [isLive]);

  const filteredActivities = filter === "all" 
    ? activities 
    : activities.filter(a => a.type === filter);

  const stats = {
    totalTx: activities.length,
    swaps: activities.filter(a => a.type === "swap").length,
    stakes: activities.filter(a => a.type === "stake" || a.type === "unstake").length,
    mints: activities.filter(a => a.type === "mint" || a.type === "nft").length,
  };

  return (
    <div className="min-h-screen relative overflow-hidden pt-20 pb-12" style={{ background: "linear-gradient(180deg, #070b16, #0c1222, #070b16)" }}>
      <GlowOrb color="linear-gradient(135deg, #06b6d4, #3b82f6)" size={500} top="-5%" left="60%" />
      <GlowOrb color="linear-gradient(135deg, #8b5cf6, #ec4899)" size={400} top="40%" left="-10%" delay={3} />
<main className="flex-1  pb-8 px-4">
        <div className="container mx-auto max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-6"
          >
            <div className="flex items-center justify-center gap-2 mb-3">
              <motion.div 
                className="p-3 rounded-2xl bg-gradient-to-br from-primary/20 to-pink-500/20 border border-primary/30"
                animate={isLive ? { 
                  boxShadow: ["0 0 20px rgba(139,92,246,0.2)", "0 0 50px rgba(139,92,246,0.4)", "0 0 20px rgba(139,92,246,0.2)"]
                } : {}}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Activity className="w-7 h-7 text-primary" />
              </motion.div>
            </div>
            <h1 className="text-2xl md:text-3xl font-display font-bold mb-2">
              Live <span className="text-primary">Activity</span>
            </h1>
            <p className="text-sm text-muted-foreground">
              Real-time blockchain activity feed
            </p>
          </motion.div>

          <div className="grid grid-cols-4 gap-2 mb-4">
            <GlassCard hover={false} className="p-2 text-center">
              <div className="text-lg font-bold">{stats.totalTx}</div>
              <div className="text-[9px] text-muted-foreground">Total</div>
            </GlassCard>
            <GlassCard hover={false} className="p-2 text-center">
              <div className="text-lg font-bold text-blue-400">{stats.swaps}</div>
              <div className="text-[9px] text-muted-foreground">Swaps</div>
            </GlassCard>
            <GlassCard hover={false} className="p-2 text-center">
              <div className="text-lg font-bold text-purple-400">{stats.stakes}</div>
              <div className="text-[9px] text-muted-foreground">Stakes</div>
            </GlassCard>
            <GlassCard hover={false} className="p-2 text-center">
              <div className="text-lg font-bold text-pink-400">{stats.mints}</div>
              <div className="text-[9px] text-muted-foreground">Mints</div>
            </GlassCard>
          </div>

          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              {(["all", "swap", "stake", "mint", "transfer", "claim", "liquidity"] as const).map(f => (
                <Button
                  key={f}
                  variant={filter === f ? "default" : "ghost"}
                  size="sm"
                  className="h-7 px-2 text-xs whitespace-nowrap"
                  onClick={() => setFilter(f)}
                >
                  {f.charAt(0).toUpperCase() + f.slice(1)}
                </Button>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-7 w-7"
                onClick={() => setIsLive(!isLive)}
              >
                {isLive ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <AnimatePresence mode="popLayout">
              {filteredActivities.map((activity, index) => (
                <ActivityCard key={activity.id} activity={activity} index={index} />
              ))}
            </AnimatePresence>
          </div>

          {filteredActivities.length === 0 && (
            <GlassCard className="p-8 text-center">
              <Activity className="w-12 h-12 text-white/10 mx-auto mb-3" />
              <p className="text-muted-foreground">No activity matching filter</p>
            </GlassCard>
          )}
        </div>
      </main>

      
    </div>
  );
}
