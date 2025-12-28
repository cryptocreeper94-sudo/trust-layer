import { motion } from "framer-motion";
import { Link } from "wouter";
import { 
  Clock, Users, Shield, Sparkles, Heart, Eye, Coins, 
  ChevronDown, Flame, Compass, Globe, History, 
  Sword, Rocket, Play, ArrowRight, Lock, Wand2, 
  Telescope, Ghost, Target, Scroll, Building, Store,
  Bell, Calendar, Megaphone
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Footer } from "@/components/footer";
import { ChronoLayout, VideoHero, HoloCard, SocialProofTicker, CTABanner, chronoStyles } from "@/components/chrono-ui";
import { usePageAnalytics } from "@/hooks/use-analytics";

import fantasyWorld from "@assets/generated_images/fantasy_sci-fi_world_landscape.png";
import medievalKingdom from "@assets/generated_images/medieval_fantasy_kingdom.png";
import quantumRealm from "@assets/generated_images/quantum_dimension_realm.png";
import deepSpace from "@assets/generated_images/deep_space_station.png";
import cyberpunkCity from "@assets/generated_images/cyberpunk_neon_city.png";
import fantasyHeroes from "@assets/generated_images/fantasy_character_heroes.png";
import egyptianKingdom from "@assets/generated_images/ancient_egyptian_kingdom_sunset.png";
import wildWest from "@assets/generated_images/wild_west_frontier_town.png";
import victorianLondon from "@assets/generated_images/victorian_london_street_scene.png";
import vikingFjord from "@assets/generated_images/viking_longship_fjord_scene.png";
import romanColosseum from "@assets/generated_images/roman_empire_colosseum_gladiators.png";
import stoneAgeVillage from "@assets/generated_images/stone_age_village_scene.png";

const FEATURED_ERAS = [
  { id: "stone", name: "Dawn Age", period: "50,000 BCE", image: stoneAgeVillage, color: "from-amber-500 to-orange-600" },
  { id: "egyptian", name: "Egyptian Dynasty", period: "2500 BCE", image: egyptianKingdom, color: "from-yellow-500 to-amber-600" },
  { id: "roman", name: "Roman Empire", period: "100 CE", image: romanColosseum, color: "from-red-500 to-rose-600" },
  { id: "viking", name: "Viking Age", period: "900 CE", image: vikingFjord, color: "from-slate-400 to-gray-600" },
  { id: "medieval", name: "Age of Crowns", period: "1200 CE", image: medievalKingdom, color: "from-purple-500 to-violet-600" },
  { id: "wildwest", name: "Wild West", period: "1870 CE", image: wildWest, color: "from-orange-500 to-amber-700" },
  { id: "victorian", name: "Victorian Era", period: "1888 CE", image: victorianLondon, color: "from-gray-500 to-slate-700" },
  { id: "cyber", name: "Neon Dominion", period: "2087 CE", image: cyberpunkCity, color: "from-cyan-500 to-blue-600" },
];

const CORE_PILLARS = [
  {
    icon: Clock,
    title: "Real-Time World",
    desc: "24/7 persistent universe. The world moves whether you're there or not.",
    color: "from-cyan-500 to-blue-600",
    image: deepSpace
  },
  {
    icon: Eye,
    title: "YOU Are The Character",
    desc: "Not role-playing. BEING. Your actual personality in a fantasy realm.",
    color: "from-purple-500 to-pink-600",
    image: fantasyHeroes
  },
  {
    icon: Shield,
    title: "No Good. No Evil.",
    desc: "Only perspective. Actions have consequences, not moral judgments.",
    color: "from-amber-500 to-red-600",
    image: medievalKingdom
  },
  {
    icon: Compass,
    title: "70+ Historical Eras",
    desc: "From Stone Age to Space Colonies. Every era you've dreamed of.",
    color: "from-emerald-500 to-teal-600",
    image: quantumRealm
  },
];

const SOCIAL_STATS = [
  { label: "Eras Available", value: "70+", icon: <Globe className="w-4 h-4 text-purple-400" /> },
  { label: "Founding Members", value: "Join First 1,000", icon: <Users className="w-4 h-4 text-cyan-400" /> },
  { label: "Target Launch", value: "2026", icon: <Rocket className="w-4 h-4 text-pink-400" /> },
  { label: "Blockchain", value: "DWC", icon: <Coins className="w-4 h-4 text-amber-400" /> },
];

const EXPERIENCES = [
  {
    icon: Scroll,
    title: "The Veil is Lifting",
    desc: "Truth reveals itself. Awaken those around you. Uncover hidden realities others refuse to see.",
    color: "from-amber-500 to-orange-600",
  },
  {
    icon: Lock,
    title: "Hidden Truths",
    desc: "Some knowledge is buried for a reason. Your choices determine what you discover and who you become.",
    color: "from-emerald-500 to-teal-600",
  },
  {
    icon: Wand2,
    title: "Time-Warp Freedom",
    desc: "Leap between eras when you're ready. Permanently relocate or visit temporarily - you choose the path.",
    color: "from-purple-500 to-violet-600",
  },
  {
    icon: Ghost,
    title: "Living History",
    desc: "The world continues without you. Other parallel selves shape the same reality. Your ripples travel through time.",
    color: "from-pink-500 to-rose-600",
  },
  {
    icon: Target,
    title: "Consequences Echo",
    desc: "Every action shapes how others perceive you. Bad choices lead to hardship. Good choices open new paths.",
    color: "from-red-500 to-orange-600",
  },
  {
    icon: Telescope,
    title: "Your Beliefs Matter",
    desc: "Faith, spirituality, atheism - whatever shapes you in life shapes your parallel experience.",
    color: "from-cyan-500 to-blue-600",
  },
];

export default function ChronoHome() {
  usePageAnalytics();
  
  return (
    <ChronoLayout currentPage="/">
      <VideoHero posterSrc={fantasyWorld}>
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="text-center max-w-5xl mx-auto"
        >
          <Badge className="mb-6 px-4 py-2 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border-cyan-500/30 text-white text-sm backdrop-blur-sm">
            <Sparkles className="w-4 h-4 mr-2 text-cyan-400" />
            Welcome to the ChronoVerse
          </Badge>
          
          <h1 className="text-5xl sm:text-6xl md:text-8xl font-display font-black mb-6 leading-tight">
            <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent drop-shadow-2xl">
              DarkWave
            </span>
            <br />
            <span className="text-white drop-shadow-2xl">Chronicles</span>
          </h1>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            <p className="text-2xl md:text-4xl font-bold text-white mb-2">
              <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">YOU.</span> The Legend.
            </p>
            <p className="text-lg md:text-xl text-white/70 mb-8 max-w-3xl mx-auto leading-relaxed">
              A revolutionary parallel life experience spanning 70+ eras of history.
              <br className="hidden md:block" />
              Not a game. Not role-playing. Your mirror across time.
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link href="/chronicles">
              <Button size="lg" className="rounded-full gap-2 text-lg px-8 py-6 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 hover:from-cyan-400 hover:via-purple-400 hover:to-pink-400 text-white shadow-xl shadow-purple-500/25 hover:shadow-purple-500/40 transition-all" data-testid="hero-explore">
                <Play className="w-5 h-5" />
                Explore the ChronoVerse
              </Button>
            </Link>
            <Link href="/community">
              <Button size="lg" variant="outline" className="rounded-full gap-2 text-lg px-8 py-6 border-white/20 hover:bg-white/10 backdrop-blur-sm" data-testid="hero-join">
                <Users className="w-5 h-5" />
                Join Waitlist
              </Button>
            </Link>
          </motion.div>
        </motion.div>
        
        <motion.div 
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 12, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
        >
          <ChevronDown className="w-10 h-10 text-white/40" />
        </motion.div>
      </VideoHero>

      <SocialProofTicker items={SOCIAL_STATS} />

      <section className="py-24 px-4 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-purple-950/10 to-black pointer-events-none" />
        <div className="container mx-auto max-w-7xl relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <Badge className="mb-4 bg-purple-500/20 text-purple-400 border-purple-500/30">
              <Flame className="w-3 h-3 mr-1" /> Core Philosophy
            </Badge>
            <h2 className="text-3xl md:text-5xl font-display font-bold mb-4 text-white">
              What Makes This Different
            </h2>
            <p className="text-white/60 max-w-2xl mx-auto text-lg">
              This isn't another MMO. It's an unprecedented adventure where YOU are the hero. A world that breathes.
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {CORE_PILLARS.map((pillar, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <HoloCard image={pillar.image} className="h-full min-h-[200px]">
                  <div className="p-6 h-full flex flex-col justify-end">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${pillar.color} flex items-center justify-center mb-4 shadow-lg`}>
                      <pillar.icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">{pillar.title}</h3>
                    <p className="text-white/70 text-sm">{pillar.desc}</p>
                  </div>
                </HoloCard>
              </motion.div>
            ))}
          </div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <Link href="/gameplay">
              <Button variant="outline" className="rounded-full gap-2 border-white/20 hover:bg-white/10" data-testid="learn-gameplay">
                Learn How It Works
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      <section className="py-24 px-4 bg-gradient-to-b from-transparent via-cyan-950/10 to-transparent">
        <div className="container mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <Badge className="mb-4 bg-cyan-500/20 text-cyan-400 border-cyan-500/30">
              <History className="w-3 h-3 mr-1" /> The ChronoVerse
            </Badge>
            <h2 className="text-3xl md:text-5xl font-display font-bold mb-4 text-white">
              Choose Your Era
            </h2>
            <p className="text-white/60 max-w-2xl mx-auto text-lg">
              70+ historical periods. Each running as its own living world.
            </p>
          </motion.div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {FEATURED_ERAS.map((era, i) => (
              <motion.div
                key={era.id}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
              >
                <HoloCard image={era.image} className="aspect-[3/4]">
                  <div className="p-4 h-full flex flex-col justify-end">
                    <Badge className={`w-fit mb-2 bg-gradient-to-r ${era.color} text-white border-0 text-[9px]`}>
                      {era.period}
                    </Badge>
                    <h4 className="font-bold text-white text-lg">{era.name}</h4>
                  </div>
                </HoloCard>
              </motion.div>
            ))}
          </div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <Link href="/eras">
              <Button className="rounded-full gap-2 bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500" data-testid="explore-all-eras">
                <Globe className="w-4 h-4" />
                Explore All 70+ Eras
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      <section className="py-24 px-4 bg-gradient-to-b from-transparent via-pink-950/10 to-transparent">
        <div className="container mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <Badge className="mb-4 bg-pink-500/20 text-pink-400 border-pink-500/30">
              <Sword className="w-3 h-3 mr-1" /> The Parallel Life
            </Badge>
            <h2 className="text-3xl md:text-5xl font-display font-bold mb-4 text-white">
              Your Mirror Awaits
            </h2>
            <p className="text-white/60 max-w-2xl mx-auto text-lg">
              A social experiment in self-discovery. Your choices reveal who you truly are. The world reacts to <span className="text-pink-400 font-semibold">you</span>.
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {EXPERIENCES.map((experience, i) => {
              const Icon = experience.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                >
                  <div className="group relative p-6 rounded-2xl bg-gradient-to-br from-white/5 to-transparent border border-white/10 hover:border-pink-500/30 transition-all duration-300 hover:bg-white/[0.03]">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${experience.color} flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2">{experience.title}</h3>
                    <p className="text-white/60 text-sm">{experience.desc}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
          
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mt-12 text-center"
          >
            <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-gradient-to-r from-pink-500/10 via-purple-500/10 to-cyan-500/10 border border-white/10">
              <Sparkles className="w-5 h-5 text-pink-400" />
              <span className="text-white/80 text-sm">
                A living world 24/7. <span className="text-pink-400 font-semibold">Your parallel self</span> shapes history.
              </span>
              <Sparkles className="w-5 h-5 text-cyan-400" />
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-24 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-2 gap-8">
            <HoloCard image={deepSpace} glow="amber" className="min-h-[400px]">
              <div className="p-8 h-full flex flex-col justify-end">
                <Badge className="w-fit mb-4 bg-amber-500/20 text-amber-400 border-amber-500/30">
                  <Coins className="w-3 h-3 mr-1" /> Blockchain Economy
                </Badge>
                <h3 className="text-2xl font-bold text-white mb-3">Real Currency. Real Value.</h3>
                <p className="text-white/70 mb-6">
                  Trade with DarkWave Coin. Every transaction blockchain-verified. 
                  Buy, sell, own - with cryptocurrency that has real value.
                </p>
                <Link href="/economy">
                  <Button variant="outline" className="w-fit rounded-full gap-2 border-amber-500/30 hover:bg-amber-500/10 text-amber-300" data-testid="explore-economy">
                    Explore Economy
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              </div>
            </HoloCard>
            
            <HoloCard image={fantasyHeroes} glow="pink" className="min-h-[400px]">
              <div className="p-8 h-full flex flex-col justify-end">
                <Badge className="w-fit mb-4 bg-pink-500/20 text-pink-400 border-pink-500/30">
                  <Users className="w-3 h-3 mr-1" /> Community-Built
                </Badge>
                <h3 className="text-2xl font-bold text-white mb-3">Built By You. For You.</h3>
                <p className="text-white/70 mb-6">
                  Submit ideas. Own your creations. The world is built by players, 
                  for players. Real property. Real ownership.
                </p>
                <Link href="/community">
                  <Button variant="outline" className="w-fit rounded-full gap-2 border-pink-500/30 hover:bg-pink-500/10 text-pink-300" data-testid="join-community">
                    Join Community
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              </div>
            </HoloCard>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-gradient-to-b from-transparent via-emerald-950/10 to-transparent">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <Badge className="mb-4 bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
              <Calendar className="w-3 h-3 mr-1" /> Coming Soon
            </Badge>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-4">
              Planned Features
            </h2>
            <p className="text-white/60 max-w-2xl mx-auto">
              Here's what's on the horizon. Join the waitlist to get early access and shape the future of the ChronoVerse.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {[
              {
                icon: Store,
                title: "Storefront Sponsorships",
                timeline: "Phase 1-2 (2026-2026)",
                desc: "Businesses sponsor in-game locations. Premium real estate in every era. Location-based advertising with real ROI.",
                cta: "Pre-Register Business",
                href: "/creators#business",
                color: "emerald"
              },
              {
                icon: Users,
                title: "Creator Marketplace",
                timeline: "Phase 2 (Q1 2026)",
                desc: "Own your creations as digital real estate. Earn royalties. Trade properties. Build your legacy.",
                cta: "Join Creator Waitlist",
                href: "/creators",
                color: "purple"
              },
              {
                icon: Globe,
                title: "Mobile Apps",
                timeline: "Phase 2 (Q2 2026)",
                desc: "Android & iOS apps. Live your legacy on the go. Push notifications for world events.",
                cta: "Get Notified",
                href: "/crowdfund",
                color: "cyan"
              },
            ].map((feature, i) => {
              const Icon = feature.icon;
              const colorClasses = {
                emerald: { bg: "from-emerald-500 to-teal-600", border: "border-emerald-500/30", text: "text-emerald-400" },
                purple: { bg: "from-purple-500 to-pink-600", border: "border-purple-500/30", text: "text-purple-400" },
                cyan: { bg: "from-cyan-500 to-blue-600", border: "border-cyan-500/30", text: "text-cyan-400" },
              }[feature.color];
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                >
                  <div className={`h-full p-6 rounded-2xl bg-white/5 border ${colorClasses?.border} hover:bg-white/10 transition-all`}>
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${colorClasses?.bg} flex items-center justify-center mb-4`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <Badge variant="outline" className={`mb-3 text-xs ${colorClasses?.text} border-current`}>
                      {feature.timeline}
                    </Badge>
                    <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                    <p className="text-white/60 text-sm mb-4">{feature.desc}</p>
                    <Link href={feature.href}>
                      <Button size="sm" variant="outline" className={`rounded-full gap-2 ${colorClasses?.border} hover:bg-white/10`} data-testid={`planned-${feature.color}-cta`}>
                        <Bell className="w-4 h-4" />
                        {feature.cta}
                      </Button>
                    </Link>
                  </div>
                </motion.div>
              );
            })}
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="p-6 rounded-2xl bg-gradient-to-br from-amber-500/10 to-transparent border border-amber-500/20">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shrink-0">
                    <Building className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white mb-1">Business Pre-Registration</h3>
                    <p className="text-white/60 text-sm mb-3">
                      Want your brand in the ChronoVerse? Pre-register for storefront sponsorship opportunities. 
                      Early partners get priority placement and founding rates.
                    </p>
                    <Link href="/creators">
                      <Button size="sm" className="rounded-full gap-2 bg-gradient-to-r from-amber-600 to-orange-600" data-testid="business-preregister">
                        <Store className="w-4 h-4" />
                        Pre-Register Your Business
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="p-6 rounded-2xl bg-gradient-to-br from-pink-500/10 to-transparent border border-pink-500/20">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center shrink-0">
                    <Megaphone className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white mb-1">Join Our Community</h3>
                    <p className="text-white/60 text-sm mb-3">
                      Discord • Telegram • Twitter. Stay updated on development, participate in decisions, 
                      and connect with other founding members.
                    </p>
                    <Link href="/community">
                      <Button size="sm" className="rounded-full gap-2 bg-gradient-to-r from-pink-600 to-purple-600" data-testid="join-socials">
                        <Users className="w-4 h-4" />
                        Join the Community
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          <div className="mt-8 text-center">
            <Link href="/team">
              <Button variant="link" className="text-white/50 hover:text-white gap-2" data-testid="view-full-roadmap">
                View Full Development Roadmap
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <CTABanner
        title="Ready to Live Your Legacy?"
        subtitle="Join the founding members building the ChronoVerse. Early supporters get exclusive access, bonus DWC tokens, and their name in history."
        primaryAction={{ label: "Support Development", href: "/crowdfund" }}
        secondaryAction={{ label: "Learn More", href: "/chronicles" }}
        backgroundImage={fantasyWorld}
      />

      <Footer />
      
      <style>{chronoStyles}</style>
    </ChronoLayout>
  );
}
