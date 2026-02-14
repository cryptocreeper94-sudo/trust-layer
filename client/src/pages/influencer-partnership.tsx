import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { 
  Sparkles, Users, TrendingUp, Crown, Star, Megaphone, 
  CheckCircle, Globe, Youtube, Twitter, Send, Heart,
  Zap, Award, Gift, Shield, Mail, ArrowRight, Instagram
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { GlassCard } from "@/components/glass-card";
import { usePageAnalytics } from "@/hooks/use-analytics";
import { useMutation } from "@tanstack/react-query";

const PARTNER_TIERS = [
  {
    id: "ambassador",
    name: "Ambassador",
    icon: Star,
    color: "from-blue-500 to-cyan-500",
    borderColor: "border-cyan-500/30",
    glowColor: "shadow-[0_0_30px_rgba(6,182,212,0.2)]",
    requirements: "5K+ followers",
    benefits: [
      "10% commission on referrals",
      "Early access to announcements",
      "Ambassador Discord role",
      "Monthly analytics reports",
      "Branded promotional materials",
    ],
    perks: "5,000 SIG Bonus"
  },
  {
    id: "partner",
    name: "Strategic Partner",
    icon: Award,
    color: "from-purple-500 to-pink-500",
    borderColor: "border-purple-500/30",
    glowColor: "shadow-[0_0_40px_rgba(168,85,247,0.25)]",
    requirements: "25K+ followers",
    popular: true,
    benefits: [
      "15% commission on referrals",
      "Exclusive interview opportunities",
      "Co-marketing campaigns",
      "Direct team communication",
      "Custom tracking dashboard",
      "Quarterly strategy calls",
    ],
    perks: "25,000 SIG Bonus"
  },
  {
    id: "elite",
    name: "Elite KOL",
    icon: Crown,
    color: "from-amber-500 to-orange-500",
    borderColor: "border-amber-500/30",
    glowColor: "shadow-[0_0_50px_rgba(245,158,11,0.3)]",
    requirements: "100K+ followers",
    benefits: [
      "20% commission on referrals",
      "Revenue sharing opportunities",
      "Founding partner status",
      "Dedicated account manager",
      "Priority feature requests",
      "Event speaking opportunities",
      "Custom integration support",
    ],
    perks: "100,000 SIG Bonus"
  },
];

const PLATFORMS = [
  { id: "twitter", name: "Twitter/X", icon: Twitter },
  { id: "youtube", name: "YouTube", icon: Youtube },
  { id: "telegram", name: "Telegram", icon: Send },
  { id: "instagram", name: "Instagram", icon: Instagram },
  { id: "tiktok", name: "TikTok", icon: Sparkles },
  { id: "other", name: "Other", icon: Globe },
];

const STATS = [
  { label: "Active Partners", value: "150+", icon: Users },
  { label: "Total Reach", value: "50M+", icon: Globe },
  { label: "SIG Distributed", value: "2.5M", icon: Gift },
  { label: "Avg. Partner ROI", value: "340%", icon: TrendingUp },
];


const GlowOrb = ({ color, size, top, left, delay = 0 }: { color: string; size: number; top: string; left: string; delay?: number }) => (
  <motion.div
    className="absolute rounded-full blur-3xl opacity-20 pointer-events-none"
    style={{ background: color, width: size, height: size, top, left }}
    animate={{ scale: [1, 1.2, 1], opacity: [0.15, 0.25, 0.15] }}
    transition={{ duration: 8, repeat: Infinity, delay }}
  />
);

export default function InfluencerPartnershipPage() {
  usePageAnalytics();
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    platform: "",
    handle: "",
    followers: "",
    contentType: "",
    message: "",
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const submitMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const res = await fetch("/api/partnerships/influencer-application", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to submit application");
      return res.json();
    },
    onSuccess: () => {
      setIsSubmitted(true);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.platform || !formData.handle) return;
    submitMutation.mutate(formData);
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen relative overflow-hidden pt-20 pb-12" style={{ background: "linear-gradient(180deg, #070b16, #0c1222, #070b16)" }}>
      <GlowOrb color="linear-gradient(135deg, #06b6d4, #3b82f6)" size={500} top="-5%" left="60%" />
      <GlowOrb color="linear-gradient(135deg, #8b5cf6, #ec4899)" size={400} top="40%" left="-10%" delay={3} />
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-pink-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "0.5s" }} />
        <div className="absolute top-3/4 left-1/3 w-80 h-80 bg-amber-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1.5s" }} />
      </div>
<main className="relative pt-24 pb-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <Badge className="mb-4 bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-300 border-amber-500/30 px-4 py-1.5">
              <Crown className="w-3 h-3 mr-2" /> KOL & Influencer Program
            </Badge>
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">
              <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Partner With Trust Layer
              </span>
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              Join forces with the next-generation Layer 1 blockchain. Earn rewards, 
              grow your audience, and be part of the revolution.
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12"
          >
            {STATS.map((stat, i) => (
              <GlassCard key={i} glow className="p-4 text-center">
                <stat.icon className="w-6 h-6 text-primary mx-auto mb-2" />
                <div className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                  {stat.value}
                </div>
                <div className="text-xs text-muted-foreground">{stat.label}</div>
              </GlassCard>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-16"
          >
            <div className="text-center mb-8">
              <h2 className="text-2xl font-display font-bold mb-2">Partnership Tiers</h2>
              <p className="text-muted-foreground text-sm">Choose the tier that matches your audience size</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {PARTNER_TIERS.map((tier, i) => (
                <motion.div
                  key={tier.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                  whileHover={{ scale: 1.02, y: -4 }}
                  className={`relative ${tier.popular ? 'md:-mt-4 md:mb-4' : ''}`}
                >
                  {tier.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
                      <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0 px-4">
                        <Sparkles className="w-3 h-3 mr-1" /> Most Popular
                      </Badge>
                    </div>
                  )}
                  <GlassCard 
                    className={`h-full p-6 ${tier.borderColor} ${tier.glowColor} ${tier.popular ? 'border-2' : ''}`}
                    glow={tier.popular}
                  >
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${tier.color} flex items-center justify-center mb-4`}>
                      <tier.icon className="w-7 h-7 text-white" />
                    </div>
                    
                    <h3 className="text-xl font-bold mb-1">{tier.name}</h3>
                    <p className="text-sm text-muted-foreground mb-3">{tier.requirements}</p>
                    
                    <div className={`inline-block px-3 py-1 rounded-full bg-gradient-to-r ${tier.color} bg-opacity-20 mb-4`}>
                      <span className="text-sm font-bold text-white">{tier.perks}</span>
                    </div>

                    <ul className="space-y-2 mb-4">
                      {tier.benefits.map((benefit, j) => (
                        <li key={j} className="flex items-start gap-2 text-sm">
                          <CheckCircle className="w-4 h-4 text-green-400 shrink-0 mt-0.5" />
                          <span className="text-white/80">{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </GlassCard>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16"
          >
            <GlassCard glow className="p-6 md:p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center">
                  <Megaphone className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold">Apply Now</h2>
                  <p className="text-sm text-muted-foreground">Join our partnership program</p>
                </div>
              </div>

              {isSubmitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-12"
                >
                  <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8 text-green-400" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Application Submitted!</h3>
                  <p className="text-muted-foreground mb-4">
                    Our team will review your application and reach out within 48-72 hours.
                  </p>
                  <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30">
                    Check your email for updates
                  </Badge>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm text-muted-foreground mb-1 block">Full Name *</label>
                      <Input
                        placeholder="Your name"
                        value={formData.name}
                        onChange={(e) => handleChange("name", e.target.value)}
                        className="bg-white/5 border-white/10"
                        data-testid="input-name"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-sm text-muted-foreground mb-1 block">Email *</label>
                      <Input
                        type="email"
                        placeholder="you@example.com"
                        value={formData.email}
                        onChange={(e) => handleChange("email", e.target.value)}
                        className="bg-white/5 border-white/10"
                        data-testid="input-email"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm text-muted-foreground mb-1 block">Platform *</label>
                      <Select value={formData.platform} onValueChange={(v) => handleChange("platform", v)}>
                        <SelectTrigger className="bg-white/5 border-white/10" data-testid="select-platform">
                          <SelectValue placeholder="Select platform" />
                        </SelectTrigger>
                        <SelectContent>
                          {PLATFORMS.map((p) => (
                            <SelectItem key={p.id} value={p.id}>
                              <span className="flex items-center gap-2">
                                <p.icon className="w-4 h-4" />
                                {p.name}
                              </span>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="text-sm text-muted-foreground mb-1 block">Handle/Username *</label>
                      <Input
                        placeholder="@yourhandle"
                        value={formData.handle}
                        onChange={(e) => handleChange("handle", e.target.value)}
                        className="bg-white/5 border-white/10"
                        data-testid="input-handle"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm text-muted-foreground mb-1 block">Follower Count</label>
                      <Select value={formData.followers} onValueChange={(v) => handleChange("followers", v)}>
                        <SelectTrigger className="bg-white/5 border-white/10" data-testid="select-followers">
                          <SelectValue placeholder="Select range" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1k-5k">1K - 5K</SelectItem>
                          <SelectItem value="5k-25k">5K - 25K</SelectItem>
                          <SelectItem value="25k-100k">25K - 100K</SelectItem>
                          <SelectItem value="100k-500k">100K - 500K</SelectItem>
                          <SelectItem value="500k+">500K+</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="text-sm text-muted-foreground mb-1 block">Content Focus</label>
                      <Select value={formData.contentType} onValueChange={(v) => handleChange("contentType", v)}>
                        <SelectTrigger className="bg-white/5 border-white/10" data-testid="select-content">
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="crypto">Crypto/DeFi</SelectItem>
                          <SelectItem value="gaming">Gaming</SelectItem>
                          <SelectItem value="tech">Tech/Software</SelectItem>
                          <SelectItem value="finance">Finance/Investing</SelectItem>
                          <SelectItem value="lifestyle">Lifestyle</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm text-muted-foreground mb-1 block">Why partner with Trust Layer?</label>
                    <Textarea
                      placeholder="Tell us about yourself and why you'd be a great fit..."
                      value={formData.message}
                      onChange={(e) => handleChange("message", e.target.value)}
                      className="bg-white/5 border-white/10 min-h-[100px]"
                      data-testid="textarea-message"
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 font-bold"
                    disabled={submitMutation.isPending}
                    data-testid="button-submit-application"
                  >
                    {submitMutation.isPending ? (
                      <span className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Submitting...
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <Send className="w-4 h-4" />
                        Submit Application
                      </span>
                    )}
                  </Button>
                </form>
              )}
            </GlassCard>

            <div className="space-y-6">
              <GlassCard className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
                    <Zap className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-lg font-bold">Why Partner With Us?</h3>
                </div>
                <ul className="space-y-3">
                  {[
                    { icon: TrendingUp, text: "Generous commission structure up to 20%" },
                    { icon: Gift, text: "Exclusive SIG token bonuses at launch" },
                    { icon: Shield, text: "Guardian-verified smart contracts" },
                    { icon: Users, text: "Growing community of 50K+ members" },
                    { icon: Heart, text: "Long-term partnership focus, not one-offs" },
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-sm text-white/80">
                      <item.icon className="w-4 h-4 text-primary shrink-0" />
                      {item.text}
                    </li>
                  ))}
                </ul>
              </GlassCard>

              <GlassCard className="p-6 border-purple-500/20">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
                    <Mail className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-lg font-bold">Direct Contact</h3>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  For urgent partnership inquiries or established creators with 500K+ followers:
                </p>
                <a 
                  href="mailto:partnerships@darkwavestudios.io" 
                  className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors"
                >
                  <span className="font-mono text-sm">partnerships@darkwavestudios.io</span>
                  <ArrowRight className="w-4 h-4" />
                </a>
              </GlassCard>

              <GlassCard className="p-6 bg-gradient-to-br from-cyan-500/10 to-purple-500/10 border-cyan-500/20">
                <div className="text-center">
                  <Badge className="mb-3 bg-cyan-500/20 text-cyan-300 border-cyan-500/30">
                    <Sparkles className="w-3 h-3 mr-1" /> Limited Time
                  </Badge>
                  <h3 className="text-lg font-bold mb-2">Early Partner Bonus</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Early partners receive a 2x token bonus on launch day.
                  </p>
                  <div className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                    Double Your Rewards
                  </div>
                </div>
              </GlassCard>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <GlassCard glow className="p-8 text-center relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 via-purple-500/5 to-pink-500/5" />
              <div className="relative z-10">
                <Crown className="w-12 h-12 text-amber-400 mx-auto mb-4" />
                <h2 className="text-2xl font-display font-bold mb-3">
                  Already a Trust Layer Partner?
                </h2>
                <p className="text-muted-foreground mb-6 max-w-lg mx-auto">
                  Access your partner dashboard to track performance, get promotional materials, and manage your referrals.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link href="/affiliate">
                    <Button className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 font-bold gap-2" data-testid="button-partner-dashboard">
                      <TrendingUp className="w-4 h-4" />
                      Partner Dashboard
                    </Button>
                  </Link>
                  <Link href="/presale">
                    <Button variant="outline" className="border-white/20 hover:bg-white/5 gap-2" data-testid="button-view-presale">
                      <Sparkles className="w-4 h-4" />
                      View Presale
                    </Button>
                  </Link>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        </div>
      </main>

      
    </div>
  );
}
