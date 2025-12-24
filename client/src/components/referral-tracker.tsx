import { useState } from "react";
import { motion } from "framer-motion";
import { Users, Gift, Trophy, Copy, Check, Share2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/glass-card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

interface ReferralTier {
  name: string;
  minReferrals: number;
  reward: string;
  color: string;
  icon: string;
}

const REFERRAL_TIERS: ReferralTier[] = [
  { name: "Starter", minReferrals: 0, reward: "100 DWC", color: "from-gray-500 to-gray-600", icon: "🌱" },
  { name: "Ambassador", minReferrals: 5, reward: "500 DWC + Badge", color: "from-blue-500 to-cyan-500", icon: "🚀" },
  { name: "Champion", minReferrals: 15, reward: "2,000 DWC + NFT", color: "from-purple-500 to-pink-500", icon: "⭐" },
  { name: "Legend", minReferrals: 50, reward: "10,000 DWC + Exclusive", color: "from-amber-500 to-orange-500", icon: "👑" },
];

interface Referral {
  id: string;
  username: string;
  joinedAt: Date;
  earned: number;
  active: boolean;
}

export function ReferralTracker() {
  const [copied, setCopied] = useState(false);
  
  const referralCode = "DWC-FOUNDER-2024";
  const referralLink = `https://darkwave.io/join?ref=${referralCode}`;
  
  const stats = {
    totalReferrals: 12,
    activeReferrals: 8,
    totalEarned: 1250,
    pendingRewards: 300,
    nextTierProgress: 80,
  };
  
  const referrals: Referral[] = [
    { id: "1", username: "satoshi.eth", joinedAt: new Date("2024-12-01"), earned: 100, active: true },
    { id: "2", username: "vitalik.sol", joinedAt: new Date("2024-12-05"), earned: 100, active: true },
    { id: "3", username: "nakamoto23", joinedAt: new Date("2024-12-10"), earned: 100, active: false },
    { id: "4", username: "crypto_whale", joinedAt: new Date("2024-12-15"), earned: 100, active: true },
    { id: "5", username: "defi_master", joinedAt: new Date("2024-12-18"), earned: 100, active: true },
  ];

  const currentTier = REFERRAL_TIERS.reduce((tier, t) => 
    stats.totalReferrals >= t.minReferrals ? t : tier
  , REFERRAL_TIERS[0]);
  
  const nextTier = REFERRAL_TIERS.find(t => t.minReferrals > stats.totalReferrals);
  const progressToNext = nextTier 
    ? ((stats.totalReferrals - currentTier.minReferrals) / (nextTier.minReferrals - currentTier.minReferrals)) * 100
    : 100;

  const copyToClipboard = async (text: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-2xl"
      >
        <div className={`absolute inset-0 bg-gradient-to-br ${currentTier.color} opacity-20`} />
        <div className="relative p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="text-3xl">{currentTier.icon}</div>
              <div>
                <h3 className="font-bold text-lg">{currentTier.name}</h3>
                <p className="text-xs text-muted-foreground">Current Tier</p>
              </div>
            </div>
            <Badge className={`bg-gradient-to-r ${currentTier.color} text-white border-0`}>
              {stats.totalReferrals} Referrals
            </Badge>
          </div>
          
          {nextTier && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Progress to {nextTier.name}</span>
                <span className="font-mono">{stats.totalReferrals}/{nextTier.minReferrals}</span>
              </div>
              <Progress value={progressToNext} className="h-2" />
              <p className="text-[10px] text-muted-foreground">
                {nextTier.minReferrals - stats.totalReferrals} more referrals to unlock: {nextTier.reward}
              </p>
            </div>
          )}
        </div>
      </motion.div>

      <div className="grid grid-cols-2 gap-2">
        <GlassCard className="p-3">
          <div className="flex items-center gap-2 mb-1">
            <Users className="w-4 h-4 text-primary" />
            <span className="text-[10px] text-muted-foreground">Active</span>
          </div>
          <div className="text-xl font-bold">{stats.activeReferrals}</div>
        </GlassCard>
        <GlassCard className="p-3">
          <div className="flex items-center gap-2 mb-1">
            <Gift className="w-4 h-4 text-green-400" />
            <span className="text-[10px] text-muted-foreground">Earned</span>
          </div>
          <div className="text-xl font-bold">{stats.totalEarned} DWC</div>
        </GlassCard>
      </div>

      <GlassCard className="p-3">
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-semibold text-sm flex items-center gap-2">
            <Share2 className="w-4 h-4 text-primary" />
            Your Referral Link
          </h4>
          {stats.pendingRewards > 0 && (
            <Badge className="bg-amber-500/20 text-amber-400 text-[9px]">
              +{stats.pendingRewards} DWC Pending
            </Badge>
          )}
        </div>
        
        <div className="flex gap-2">
          <div className="flex-1 p-2 rounded-lg bg-white/5 border border-white/10 font-mono text-xs truncate">
            {referralLink}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => copyToClipboard(referralLink)}
            className="shrink-0"
            data-testid="button-copy-referral"
          >
            {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
          </Button>
        </div>
        
        <div className="flex gap-2 mt-3">
          <Button size="sm" className="flex-1 text-xs" variant="outline" data-testid="button-share-twitter">
            𝕏 Share
          </Button>
          <Button size="sm" className="flex-1 text-xs" variant="outline" data-testid="button-share-telegram">
            📱 Telegram
          </Button>
        </div>
      </GlassCard>

      <GlassCard className="p-3">
        <h4 className="font-semibold text-sm mb-3 flex items-center gap-2">
          <Trophy className="w-4 h-4 text-amber-400" />
          Recent Referrals
        </h4>
        <div className="space-y-2">
          {referrals.slice(0, 4).map((ref, i) => (
            <motion.div
              key={ref.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="flex items-center justify-between p-2 rounded-lg bg-white/5"
              data-testid={`referral-row-${ref.id}`}
            >
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${ref.active ? 'bg-green-400' : 'bg-gray-500'}`} />
                <span className="text-sm font-medium">{ref.username}</span>
              </div>
              <div className="text-right">
                <div className="text-xs font-mono text-green-400">+{ref.earned} DWC</div>
                <div className="text-[9px] text-muted-foreground">
                  {new Date(ref.joinedAt).toLocaleDateString()}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </GlassCard>

      <div className="p-3 rounded-xl bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20">
        <div className="flex items-center gap-3">
          <div className="text-2xl">🎁</div>
          <div className="flex-1">
            <h4 className="font-bold text-sm">Bonus: Refer 3 more friends</h4>
            <p className="text-[10px] text-muted-foreground">Unlock the Champion tier and receive an exclusive NFT!</p>
          </div>
          <ArrowRight className="w-4 h-4 text-purple-400" />
        </div>
      </div>
    </div>
  );
}
