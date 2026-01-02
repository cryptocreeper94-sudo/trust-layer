import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { 
  Users, Heart, Star, Crown, Sparkles, Gift, MessageCircle, 
  Twitter, Github, Mail, ChevronRight, Zap, Shield, Coins,
  Check, ArrowRight, Rocket, Globe, Award, Flame
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Footer } from "@/components/footer";
import { ChronoLayout, HoloCard, CTABanner, SocialProofTicker, chronoStyles } from "@/components/chrono-ui";
import { usePageAnalytics } from "@/hooks/use-analytics";

import fantasyHeroes from "@assets/generated_images/fantasy_character_heroes.png";
import fantasyWorld from "@assets/generated_images/fantasy_sci-fi_world_landscape.png";
import medievalKingdom from "@assets/generated_images/medieval_fantasy_kingdom.png";
import quantumRealm from "@assets/generated_images/quantum_dimension_realm.png";

const FOUNDING_TIERS = [
  {
    name: "Pioneer",
    price: "Free",
    color: "from-gray-500 to-slate-600",
    icon: Users,
    benefits: [
      "Early access notification",
      "Community Discord access",
      "Monthly development updates",
      "Name in Pioneer Wall"
    ],
    cta: "Join Free",
    popular: false
  },
  {
    name: "Founder",
    price: "$49",
    color: "from-purple-500 to-violet-600",
    icon: Star,
    benefits: [
      "Everything in Pioneer",
      "500 DWC tokens at launch",
      "Exclusive Founder badge",
      "Early era access (1 week)",
      "Founder-only Discord channel",
      "Name in Founder Hall"
    ],
    cta: "Become Founder",
    popular: true
  },
  {
    name: "Patron",
    price: "$199",
    color: "from-amber-500 to-orange-600",
    icon: Crown,
    benefits: [
      "Everything in Founder",
      "2,500 DWC tokens at launch",
      "Exclusive Patron title",
      "Early era access (1 month)",
      "Direct developer access",
      "Input on game features",
      "Physical collector's item",
      "Name in Patron Temple"
    ],
    cta: "Become Patron",
    popular: false
  },
];

const COMMUNITY_STATS = [
  { label: "Discord Members", value: "Join First!", icon: <MessageCircle className="w-4 h-4 text-purple-400" /> },
  { label: "Founding Members", value: "Be #1", icon: <Crown className="w-4 h-4 text-amber-400" /> },
  { label: "Eras Planned", value: "70+", icon: <Globe className="w-4 h-4 text-cyan-400" /> },
  { label: "Target Launch", value: "2026", icon: <Rocket className="w-4 h-4 text-pink-400" /> },
];

const BENEFITS = [
  {
    icon: Gift,
    title: "Early Access",
    description: "Be first to enter the ChronoVerse before public launch"
  },
  {
    icon: Coins,
    title: "Bonus Tokens",
    description: "Founding members receive DWC tokens at preferential rates"
  },
  {
    icon: Shield,
    title: "Exclusive Content",
    description: "Access to founder-only eras, items, and experiences"
  },
  {
    icon: MessageCircle,
    title: "Developer Access",
    description: "Direct line to the development team for feedback and ideas"
  },
];

export default function ChronoCommunity() {
  usePageAnalytics();
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubmitted(true);
    }
  };
  
  return (
    <ChronoLayout currentPage="/community">
      <section className="relative py-24 px-4 overflow-hidden">
        <div className="absolute inset-0">
          <img src={fantasyHeroes} alt="" className="w-full h-full object-cover opacity-30" />
          <div className="absolute inset-0 bg-gradient-to-b from-black via-black/90 to-black" />
        </div>
        
        <div className="container mx-auto max-w-4xl relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Badge className="mb-4 bg-pink-500/20 text-pink-400 border-pink-500/30">
              <Users className="w-3 h-3 mr-1" /> Join the Movement
            </Badge>
            <h1 className="text-4xl md:text-6xl font-display font-bold mb-6 text-white">
              Be Part of <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">History</span>
            </h1>
            <p className="text-xl text-white/60 max-w-2xl mx-auto mb-8">
              The ChronoVerse is being built right now. Join the founding community 
              and help shape the future of gaming.
            </p>
            
            {!submitted ? (
              <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 bg-white/10 border-white/20 text-white placeholder:text-white/40 h-12"
                  data-testid="input-waitlist-email"
                  required
                />
                <Button 
                  type="submit" 
                  size="lg"
                  className="h-12 px-6 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500"
                  data-testid="button-join-waitlist"
                >
                  Join Waitlist
                </Button>
              </form>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-6 rounded-2xl bg-green-500/10 border border-green-500/30 max-w-md mx-auto"
              >
                <Check className="w-12 h-12 text-green-400 mx-auto mb-3" />
                <p className="text-green-400 font-bold text-lg">You're on the list!</p>
                <p className="text-white/60 text-sm">We'll notify you when the ChronoVerse opens.</p>
              </motion.div>
            )}
          </motion.div>
        </div>
      </section>

      <SocialProofTicker items={COMMUNITY_STATS} />

      <section className="py-24 px-4">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <Badge className="mb-4 bg-amber-500/20 text-amber-400 border-amber-500/30">
              <Crown className="w-3 h-3 mr-1" /> Founding Member Tiers
            </Badge>
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4 text-white">
              Claim Your Place in History
            </h2>
            <p className="text-white/60 max-w-2xl mx-auto">
              Early supporters get exclusive benefits, bonus tokens, and their name 
              permanently recorded in the ChronoVerse.
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-3 gap-6">
            {FOUNDING_TIERS.map((tier, i) => {
              const Icon = tier.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="relative"
                >
                  {tier.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
                      <Badge className="bg-gradient-to-r from-purple-600 to-pink-600 text-white border-0">
                        <Flame className="w-3 h-3 mr-1" /> Most Popular
                      </Badge>
                    </div>
                  )}
                  <div className={`h-full p-6 rounded-2xl border ${tier.popular ? 'border-purple-500/50 bg-purple-500/5' : 'border-white/10 bg-white/5'}`}>
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${tier.color} flex items-center justify-center mb-4`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-1">{tier.name}</h3>
                    <p className={`text-3xl font-bold mb-6 bg-gradient-to-r ${tier.color} bg-clip-text text-transparent`}>
                      {tier.price}
                    </p>
                    <ul className="space-y-3 mb-6">
                      {tier.benefits.map((benefit, j) => (
                        <li key={j} className="flex items-start gap-2 text-white/70 text-sm">
                          <Check className="w-4 h-4 text-green-400 shrink-0 mt-0.5" />
                          {benefit}
                        </li>
                      ))}
                    </ul>
                    <Link href="/crowdfund">
                      <Button 
                        className={`w-full rounded-full ${tier.popular ? 'bg-gradient-to-r from-purple-600 to-pink-600' : 'bg-white/10 hover:bg-white/20'}`}
                        data-testid={`tier-${tier.name.toLowerCase()}`}
                      >
                        {tier.cta}
                      </Button>
                    </Link>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-24 px-4 bg-gradient-to-b from-transparent via-purple-950/20 to-transparent">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4 text-white">
              Why Join Early?
            </h2>
          </motion.div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {BENEFITS.map((benefit, i) => {
              const Icon = benefit.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                >
                  <HoloCard className="h-full p-6" glow="purple">
                    <Icon className="w-10 h-10 text-purple-400 mb-4" />
                    <h3 className="text-lg font-bold text-white mb-2">{benefit.title}</h3>
                    <p className="text-white/60 text-sm">{benefit.description}</p>
                  </HoloCard>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-24 px-4">
        <div className="container mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4 text-white">
              Connect With Us
            </h2>
            <p className="text-white/60">
              Join the conversation and stay updated on development progress.
            </p>
          </motion.div>
          
          <div className="grid sm:grid-cols-3 gap-6">
            <div 
              className="group opacity-70"
              data-testid="link-discord"
            >
              <HoloCard className="p-6 text-center h-full" glow="purple">
                <div className="w-16 h-16 rounded-full bg-[#5865F2]/20 flex items-center justify-center mx-auto mb-4">
                  <MessageCircle className="w-8 h-8 text-[#5865F2]" />
                </div>
                <h3 className="text-lg font-bold text-white mb-1">Discord</h3>
                <p className="text-white/60 text-sm">Coming Soon</p>
              </HoloCard>
            </div>
            
            <a 
              href="https://twitter.com/DarkWaveChain" 
              target="_blank" 
              rel="noopener noreferrer"
              className="group"
              data-testid="link-twitter"
            >
              <HoloCard className="p-6 text-center h-full" glow="cyan">
                <div className="w-16 h-16 rounded-full bg-[#1DA1F2]/20 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <Twitter className="w-8 h-8 text-[#1DA1F2]" />
                </div>
                <h3 className="text-lg font-bold text-white mb-1">Twitter</h3>
                <p className="text-white/60 text-sm">Follow for updates</p>
              </HoloCard>
            </a>
            
            <div 
              className="group cursor-pointer"
              data-testid="link-github"
            >
              <HoloCard className="p-6 text-center h-full" glow="none">
                <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <Github className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-bold text-white mb-1">GitHub</h3>
                <p className="text-white/60 text-sm">Coming Soon</p>
              </HoloCard>
            </div>
          </div>
        </div>
      </section>

      <CTABanner
        title="Ready to Make History?"
        subtitle="Join the founding community today and help build the ChronoVerse."
        primaryAction={{ label: "Support Development", href: "/crowdfund" }}
        backgroundImage={medievalKingdom}
      />

      <Footer />
      
      <style>{chronoStyles}</style>
    </ChronoLayout>
  );
}
