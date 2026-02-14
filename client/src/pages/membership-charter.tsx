import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { 
  Shield, 
  Users, 
  Building2, 
  CheckCircle, 
  Star,
  Globe,
  Lock,
  Handshake,
  Scale,
  Eye,
  Award,
  ArrowRight,
  ArrowLeft,
  FileCheck,
  Network,
  Zap,
  BadgeCheck,
  ChevronLeft,
  ChevronRight,
  Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { GlassCard } from "@/components/glass-card";
import { useAuth } from "@/hooks/use-auth";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const staggerItem = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};


const GlowOrb = ({ color, size, top, left, delay = 0 }: { color: string; size: number; top: string; left: string; delay?: number }) => (
  <motion.div
    className="absolute rounded-full blur-3xl opacity-20 pointer-events-none"
    style={{ background: color, width: size, height: size, top, left }}
    animate={{ scale: [1, 1.2, 1], opacity: [0.15, 0.25, 0.15] }}
    transition={{ duration: 8, repeat: Infinity, delay }}
  />
);

export default function MembershipCharter() {
  const { user } = useAuth();

  const coreValues = [
    { icon: Lock, title: "Trust", description: "Every interaction backed by verified identity and transparent history", color: "cyan" },
    { icon: Eye, title: "Transparency", description: "All transactions recorded on-chain, auditable by all parties", color: "purple" },
    { icon: Scale, title: "Accountability", description: "Members stake their reputation on every commitment", color: "pink" },
    { icon: Handshake, title: "Mutual Benefit", description: "Success comes from genuine value exchange, not exploitation", color: "amber" },
  ];

  const individualBenefits = [
    { icon: BadgeCheck, title: "Trust Layer Hash", text: "Your verified identity permanently recorded on-chain" },
    { icon: Award, title: "Membership Card", text: "Digital proof of good standing in the network" },
    { icon: Star, title: "Reputation Score", text: "Builds with every positive interaction you have" },
    { icon: Network, title: "Trusted Network", text: "Connect with verified businesses and individuals" },
    { icon: Shield, title: "Dispute Protection", text: "Fair resolution when issues arise between parties" },
    { icon: Globe, title: "Global Recognition", text: "Your trust status travels with you everywhere" },
  ];

  const businessBenefits = [
    { icon: Building2, title: "Verified Status", text: "Blockchain-backed business authenticity proof" },
    { icon: Zap, title: "API Access", text: "Integrate trust verification into your systems" },
    { icon: FileCheck, title: "Webhook Events", text: "Real-time notifications for all transactions" },
    { icon: Users, title: "Team Management", text: "Multiple seats under one organization" },
    { icon: Network, title: "Business Directory", text: "Be discoverable by trusted customers" },
    { icon: Shield, title: "Guardian Shield", text: "Continuous security monitoring service" },
  ];

  const responsibilities = [
    { text: "Maintain accurate and truthful profile information", icon: CheckCircle },
    { text: "Honor commitments made through the Trust Layer", icon: Handshake },
    { text: "Report suspicious activity or bad actors promptly", icon: Shield },
    { text: "Engage in good faith with other members", icon: Users },
    { text: "Respect the privacy and data of fellow members", icon: Lock },
    { text: "Contribute positively to the network's reputation", icon: Star },
  ];

  const tiers = [
    {
      name: "Pioneer",
      color: "cyan",
      gradient: "from-cyan-500/20 to-blue-500/20",
      border: "border-cyan-500/30",
      description: "Foundation members building the network",
      features: ["Trust Layer Hash", "Membership Card", "Basic Dashboard", "Community Access"],
      price: "Free",
      popular: false,
    },
    {
      name: "Guardian",
      color: "purple",
      gradient: "from-purple-500/20 to-pink-500/20",
      border: "border-purple-500/30",
      description: "Active contributors with enhanced features",
      features: ["Everything in Pioneer", "Priority Support", "Advanced Analytics", "API Access (1K calls/mo)"],
      price: "$14.99/mo",
      popular: true,
    },
    {
      name: "Enterprise",
      color: "amber",
      gradient: "from-amber-500/20 to-orange-500/20",
      border: "border-amber-500/30",
      description: "Full-featured access for businesses",
      features: ["Everything in Guardian", "Unlimited API", "Webhook Events", "Team Seats", "Custom Integrations"],
      price: "$99/mo",
      popular: false,
    },
  ];

  return (
    <div className="min-h-screen relative overflow-hidden pt-20 pb-12" style={{ background: "linear-gradient(180deg, #070b16, #0c1222, #070b16)" }}>
      <GlowOrb color="linear-gradient(135deg, #06b6d4, #3b82f6)" size={500} top="-5%" left="60%" />
      <GlowOrb color="linear-gradient(135deg, #8b5cf6, #ec4899)" size={400} top="40%" left="-10%" delay={3} />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <Badge className="mb-4 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 text-cyan-400 border-cyan-500/30">
            <Sparkles className="w-3 h-3 mr-1" />
            Trust Layer Foundation
          </Badge>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
            Membership Charter
          </h1>
          <p className="text-lg md:text-xl text-white/70 max-w-3xl mx-auto">
            A network of verified individuals and businesses committed to trust, 
            transparency, and mutual accountability in every interaction.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-12"
        >
          <GlassCard glow className="p-6 md:p-8 bg-gradient-to-br from-cyan-500/5 via-purple-500/5 to-pink-500/5">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Shield className="w-6 h-6 text-cyan-400" />
              <h2 className="text-xl md:text-2xl font-bold text-white">Our Mission</h2>
            </div>
            <p className="text-base md:text-lg text-white/80 max-w-4xl mx-auto leading-relaxed text-center">
              To create a global network where trust is verifiable, reputations are earned through action, 
              and every member—whether an individual or a business—operates with the confidence that 
              their counterparts share a commitment to integrity. We believe that when people put their 
              reputation on the line, everyone benefits.
            </p>
</motion.div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="show"
          className="mb-12"
        >
          <h2 className="text-xl md:text-2xl font-bold text-white text-center mb-6">Core Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {coreValues.map((value, i) => (
              <motion.div key={i} variants={staggerItem}>
                <GlassCard glow className="p-6 text-center h-full hover:border-cyan-500/30 transition-all duration-300">
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${
                    value.color === "cyan" ? "from-cyan-500/30 to-blue-500/30" :
                    value.color === "purple" ? "from-purple-500/30 to-pink-500/30" :
                    value.color === "pink" ? "from-pink-500/30 to-rose-500/30" :
                    "from-amber-500/30 to-orange-500/30"
                  } flex items-center justify-center mx-auto mb-4 shadow-lg`}>
                    <value.icon className={`w-7 h-7 ${
                      value.color === "cyan" ? "text-cyan-400" :
                      value.color === "purple" ? "text-purple-400" :
                      value.color === "pink" ? "text-pink-400" :
                      "text-amber-400"
                    }`} />
                  </div>
                  <h3 className="font-bold text-white text-lg mb-2">{value.title}</h3>
                  <p className="text-sm text-white/60">{value.description}</p>
</motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-12"
        >
          <h2 className="text-xl md:text-2xl font-bold text-white text-center mb-6">Two Paths, One Network</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            <GlassCard glow className="p-6 md:p-8 bg-gradient-to-br from-cyan-500/5 to-blue-500/5">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-cyan-500/30 to-blue-500/30 flex items-center justify-center shadow-lg shadow-cyan-500/20">
                  <Users className="w-7 h-7 text-cyan-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Individual Members</h3>
                  <p className="text-sm text-white/60">People who value trusted connections</p>
                </div>
              </div>
              
              <div className="relative">
                <Carousel opts={{ align: "start", loop: true }} className="w-full">
                  <CarouselContent className="-ml-2 md:-ml-4">
                    {individualBenefits.map((benefit, i) => (
                      <CarouselItem key={i} className="pl-2 md:pl-4 basis-full sm:basis-1/2">
                        <div className="p-4 bg-white/5 rounded-xl border border-white/10 h-full hover:border-cyan-500/30 transition-colors">
                          <benefit.icon className="w-6 h-6 text-cyan-400 mb-3" />
                          <h4 className="font-semibold text-white mb-1">{benefit.title}</h4>
                          <p className="text-sm text-white/60">{benefit.text}</p>
                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <div className="flex justify-center gap-2 mt-4">
                    <CarouselPrevious className="static translate-y-0 bg-white/10 border-white/20 hover:bg-cyan-500/20" />
                    <CarouselNext className="static translate-y-0 bg-white/10 border-white/20 hover:bg-cyan-500/20" />
                  </div>
                </Carousel>
              </div>
              
              <div className="mt-6 pt-6 border-t border-white/10">
                <Link href="/member-portal">
                  <Button className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 shadow-lg shadow-cyan-500/20" data-testid="link-individual-portal">
                    Individual Portal <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>
<GlassCard glow className="p-6 md:p-8 bg-gradient-to-br from-purple-500/5 to-pink-500/5">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-500/30 to-pink-500/30 flex items-center justify-center shadow-lg shadow-purple-500/20">
                  <Building2 className="w-7 h-7 text-purple-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Business Members</h3>
                  <p className="text-sm text-white/60">Organizations committed to trust</p>
                </div>
              </div>
              
              <div className="relative">
                <Carousel opts={{ align: "start", loop: true }} className="w-full">
                  <CarouselContent className="-ml-2 md:-ml-4">
                    {businessBenefits.map((benefit, i) => (
                      <CarouselItem key={i} className="pl-2 md:pl-4 basis-full sm:basis-1/2">
                        <div className="p-4 bg-white/5 rounded-xl border border-white/10 h-full hover:border-purple-500/30 transition-colors">
                          <benefit.icon className="w-6 h-6 text-purple-400 mb-3" />
                          <h4 className="font-semibold text-white mb-1">{benefit.title}</h4>
                          <p className="text-sm text-white/60">{benefit.text}</p>
                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <div className="flex justify-center gap-2 mt-4">
                    <CarouselPrevious className="static translate-y-0 bg-white/10 border-white/20 hover:bg-purple-500/20" />
                    <CarouselNext className="static translate-y-0 bg-white/10 border-white/20 hover:bg-purple-500/20" />
                  </div>
                </Carousel>
              </div>
              
              <div className="mt-6 pt-6 border-t border-white/10">
                <Link href="/business-portal">
                  <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 shadow-lg shadow-purple-500/20" data-testid="link-business-portal">
                    Business Portal <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>
</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-12"
        >
          <h2 className="text-xl md:text-2xl font-bold text-white text-center mb-6">Member Responsibilities</h2>
          <GlassCard glow className="p-6 md:p-8">
            <p className="text-white/70 mb-6 text-center max-w-2xl mx-auto">
              Membership in the Trust Layer is a commitment. By joining, you agree to uphold these principles:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {responsibilities.map((resp, i) => (
                <motion.div 
                  key={i} 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 + i * 0.05 }}
                  className="flex items-start gap-3 p-4 bg-gradient-to-br from-white/5 to-white/[0.02] rounded-xl border border-white/10 hover:border-green-500/30 transition-colors"
                >
                  <div className="w-8 h-8 rounded-lg bg-green-500/20 flex items-center justify-center flex-shrink-0">
                    <resp.icon className="w-4 h-4 text-green-400" />
                  </div>
                  <span className="text-white/80 text-sm">{resp.text}</span>
                </motion.div>
              ))}
            </div>
            <p className="text-sm text-white/40 mt-6 text-center">
              Failure to uphold these responsibilities may result in reputation penalties or membership suspension.
            </p>
</motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mb-12"
        >
          <h2 className="text-xl md:text-2xl font-bold text-white text-center mb-6">Membership Tiers</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {tiers.map((tier, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + i * 0.1 }}
              >
                <GlassCard 
                  glow 
                  className={`p-6 h-full relative ${tier.popular ? "ring-2 ring-purple-500/50 shadow-lg shadow-purple-500/20" : ""} bg-gradient-to-br ${tier.gradient}`}
                >
                  {tier.popular && (
                    <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0 shadow-lg">
                      <Sparkles className="w-3 h-3 mr-1" />
                      Most Popular
                    </Badge>
                  )}
                  <h3 className={`text-2xl font-bold mb-1 ${
                    tier.color === "cyan" ? "text-cyan-400" :
                    tier.color === "purple" ? "text-purple-400" :
                    "text-amber-400"
                  }`}>{tier.name}</h3>
                  <p className="text-sm text-white/60 mb-4">{tier.description}</p>
                  <p className="text-3xl font-bold text-white mb-6">{tier.price}</p>
                  <ul className="space-y-3">
                    {tier.features.map((feature, j) => (
                      <li key={j} className="flex items-center gap-2 text-sm text-white/70">
                        <CheckCircle className={`w-4 h-4 flex-shrink-0 ${
                          tier.color === "cyan" ? "text-cyan-400" :
                          tier.color === "purple" ? "text-purple-400" :
                          "text-amber-400"
                        }`} />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Button 
                    className={`w-full mt-6 ${
                      tier.popular 
                        ? "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 shadow-lg"
                        : "bg-white/10 hover:bg-white/20"
                    }`}
                    data-testid={`button-tier-${tier.name.toLowerCase()}`}
                  >
                    Get Started
                  </Button>
</motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="text-center"
        >
          <GlassCard glow className="p-8 md:p-12 bg-gradient-to-r from-cyan-500/10 via-purple-500/10 to-pink-500/10">
            <Sparkles className="w-10 h-10 text-purple-400 mx-auto mb-4" />
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">Ready to Join?</h2>
            <p className="text-white/70 mb-8 max-w-2xl mx-auto">
              Become part of a network where your reputation matters and trust is verifiable.
              Whether you're an individual seeking trusted connections or a business ready to 
              demonstrate your commitment to integrity—there's a place for you here.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {user ? (
                <>
                  <Link href="/member-portal">
                    <Button size="lg" className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 min-w-[200px] shadow-lg shadow-cyan-500/20" data-testid="button-join-individual">
                      <Users className="w-5 h-5 mr-2" />
                      Individual Portal
                    </Button>
                  </Link>
                  <Link href="/business-portal">
                    <Button size="lg" variant="outline" className="border-purple-500/50 text-purple-400 hover:bg-purple-500/10 min-w-[200px]" data-testid="button-join-business">
                      <Building2 className="w-5 h-5 mr-2" />
                      Business Portal
                    </Button>
                  </Link>
                </>
              ) : (
                <Link href="/login">
                  <Button size="lg" className="bg-gradient-to-r from-cyan-600 via-purple-600 to-pink-600 hover:from-cyan-500 hover:via-purple-500 hover:to-pink-500 min-w-[200px] shadow-lg shadow-purple-500/20" data-testid="button-get-started">
                    Get Started <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
              )}
            </div>
</motion.div>
      </div>
    </div>
  );
}
