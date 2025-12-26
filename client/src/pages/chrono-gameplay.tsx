import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { 
  Clock, Users, Brain, Shield, Sword, Sparkles, Heart, Eye, Coins, 
  ChevronRight, Sun, Moon, MessageCircle, Target, Compass, Zap,
  Home, ShoppingBag, Crown, Scale, Handshake, AlertTriangle, Check
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Footer } from "@/components/footer";
import { ChronoLayout, HoloCard, CTABanner, InfoTooltipInline, chronoStyles } from "@/components/chrono-ui";
import { usePageAnalytics } from "@/hooks/use-analytics";

import fantasyWorld from "@assets/generated_images/fantasy_sci-fi_world_landscape.png";
import medievalKingdom from "@assets/generated_images/medieval_fantasy_kingdom.png";
import quantumRealm from "@assets/generated_images/quantum_dimension_realm.png";
import deepSpace from "@assets/generated_images/deep_space_station.png";
import cyberpunkCity from "@assets/generated_images/cyberpunk_neon_city.png";
import fantasyHeroes from "@assets/generated_images/fantasy_character_heroes.png";

const DAILY_LOOP = [
  {
    time: "Dawn",
    icon: Sun,
    title: "Wake in Your World",
    description: "Open your eyes in your era. Check what happened overnight. The world moved while you slept.",
    color: "from-amber-400 to-orange-500"
  },
  {
    time: "Morning",
    icon: Target,
    title: "Pursue Your Goals",
    description: "Trade goods. Practice your craft. Train your skills. Build relationships. Every action matters.",
    color: "from-cyan-400 to-blue-500"
  },
  {
    time: "Midday",
    icon: MessageCircle,
    title: "Navigate Society",
    description: "Attend council meetings. Negotiate deals. Form alliances. Betray enemies. Politics is survival.",
    color: "from-purple-400 to-pink-500"
  },
  {
    time: "Evening",
    icon: Sword,
    title: "Face Challenges",
    description: "Defend your territory. Complete quests. Respond to crises. World events unfold around you.",
    color: "from-red-400 to-rose-500"
  },
  {
    time: "Night",
    icon: Moon,
    title: "Rest... or Don't",
    description: "Log off and let time pass. Or stay for the night markets, secret meetings, and midnight raids.",
    color: "from-indigo-400 to-violet-500"
  },
];

const CORE_SYSTEMS = [
  {
    icon: Brain,
    title: "AI-Driven Characters",
    description: "Every NPC has unique psychology. Emotions, beliefs, fears, ambitions. They remember. They evolve.",
    bullets: ["Dynamic emotional states", "Belief systems that shape behavior", "Long-term memory of interactions", "Unpredictable but consistent"],
    image: quantumRealm
  },
  {
    icon: Crown,
    title: "Political Simulation",
    description: "Governments form organically. Democracies, dictatorships, theocracies - whatever players create.",
    bullets: ["Player-driven governance", "Faction warfare", "Treaties and betrayals", "Revolution mechanics"],
    image: medievalKingdom
  },
  {
    icon: Coins,
    title: "Real Economy",
    description: "DWC cryptocurrency. Real value. Trade goods, own property, build empires - all blockchain-verified.",
    bullets: ["Blockchain transactions", "Property ownership", "Cross-era trading", "Audit trail on everything"],
    image: deepSpace
  },
  {
    icon: Compass,
    title: "Era Exploration",
    description: "70+ historical periods. Time travel for missions. Find echoes of other eras - artifacts, legends.",
    bullets: ["Parallel timeline system", "Era-specific mechanics", "Temporal echoes", "Historical events"],
    image: fantasyWorld
  },
];

const NOT_THIS_GAME = [
  { item: "Quest markers telling you where to go", icon: AlertTriangle },
  { item: "XP bars and arbitrary leveling", icon: AlertTriangle },
  { item: "Good/evil alignment systems", icon: AlertTriangle },
  { item: "Scripted storylines", icon: AlertTriangle },
  { item: "Pause buttons", icon: AlertTriangle },
  { item: "Safe zones where nothing matters", icon: AlertTriangle },
];

const THIS_GAME = [
  { item: "Discover your path through exploration", icon: Check },
  { item: "Skills improve through practice and use", icon: Check },
  { item: "Actions judged by those around you", icon: Check },
  { item: "Emergent stories from real decisions", icon: Check },
  { item: "Real-time, always moving forward", icon: Check },
  { item: "Everything has consequences", icon: Check },
];

export default function ChronoGameplay() {
  usePageAnalytics();
  const [activeStep, setActiveStep] = useState(0);
  
  return (
    <ChronoLayout currentPage="/gameplay">
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
            <Badge className="mb-4 bg-purple-500/20 text-purple-400 border-purple-500/30">
              <Brain className="w-3 h-3 mr-1" /> How It Works
            </Badge>
            <h1 className="text-4xl md:text-6xl font-display font-bold mb-6 text-white">
              A Day in the <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">ChronoVerse</span>
            </h1>
            <p className="text-xl text-white/60 max-w-2xl mx-auto">
              Not a game you complete. A life you live. Here's what that actually means.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-24 px-4">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4 text-white">
              The Daily Loop
            </h2>
            <p className="text-white/60 max-w-2xl mx-auto">
              24 hours in-game = 24 hours in real life. Here's how a typical day unfolds.
            </p>
          </motion.div>
          
          <div className="relative">
            <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-purple-500/30 to-transparent" />
            
            <div className="space-y-8">
              {DAILY_LOOP.map((step, i) => {
                const Icon = step.icon;
                const isActive = activeStep === i;
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: i % 2 === 0 ? -50 : 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className={`flex items-center gap-8 ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}
                    onMouseEnter={() => setActiveStep(i)}
                  >
                    <div className={`flex-1 ${i % 2 === 0 ? 'md:text-right' : 'md:text-left'}`}>
                      <HoloCard 
                        className={`p-6 transition-all duration-300 ${isActive ? 'ring-2 ring-purple-500/50' : ''}`}
                        glow={isActive ? 'purple' : 'none'}
                        hover={false}
                      >
                        <div className={`flex items-start gap-4 ${i % 2 === 0 ? 'md:flex-row-reverse md:text-right' : ''}`}>
                          <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${step.color} flex items-center justify-center shrink-0`}>
                            <Icon className="w-6 h-6 text-white" />
                          </div>
                          <div className="flex-1">
                            <Badge className="mb-2 bg-white/10 text-white/60 border-white/20 text-xs">
                              {step.time}
                            </Badge>
                            <h3 className="text-xl font-bold text-white mb-2">{step.title}</h3>
                            <p className="text-white/60">{step.description}</p>
                          </div>
                        </div>
                      </HoloCard>
                    </div>
                    
                    <div className="hidden md:flex w-4 h-4 rounded-full bg-purple-500 relative z-10 shrink-0">
                      {isActive && (
                        <motion.div
                          layoutId="activeIndicator"
                          className="absolute inset-0 rounded-full bg-purple-400"
                          style={{ boxShadow: '0 0 20px rgba(168,85,247,0.8)' }}
                        />
                      )}
                    </div>
                    
                    <div className="flex-1 hidden md:block" />
                  </motion.div>
                );
              })}
            </div>
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
              Core Systems
            </h2>
            <p className="text-white/60 max-w-2xl mx-auto">
              The engines that power the ChronoVerse experience.
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-2 gap-6">
            {CORE_SYSTEMS.map((system, i) => {
              const Icon = system.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                >
                  <HoloCard image={system.image} className="h-full min-h-[300px]">
                    <div className="p-6 h-full flex flex-col">
                      <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center mb-4">
                        <Icon className="w-6 h-6 text-purple-400" />
                      </div>
                      <h3 className="text-xl font-bold text-white mb-2">{system.title}</h3>
                      <p className="text-white/60 mb-4">{system.description}</p>
                      <ul className="space-y-2 mt-auto">
                        {system.bullets.map((bullet, j) => (
                          <li key={j} className="flex items-center gap-2 text-white/50 text-sm">
                            <ChevronRight className="w-3 h-3 text-purple-400" />
                            {bullet}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </HoloCard>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-24 px-4">
        <div className="container mx-auto max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4 text-white">
              This Is <span className="text-red-400">Not</span> That Kind of Game
            </h2>
            <p className="text-white/60 max-w-2xl mx-auto">
              If you're looking for a traditional MMO, this isn't it. Here's the difference.
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="p-6 rounded-2xl border border-red-500/20 bg-red-500/5">
              <h3 className="text-lg font-bold text-red-400 mb-4 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" />
                Traditional Games
              </h3>
              <ul className="space-y-3">
                {NOT_THIS_GAME.map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-white/60">
                    <X className="w-4 h-4 text-red-400 shrink-0" />
                    {item.item}
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="p-6 rounded-2xl border border-green-500/20 bg-green-500/5">
              <h3 className="text-lg font-bold text-green-400 mb-4 flex items-center gap-2">
                <Check className="w-5 h-5" />
                DarkWave Chronicles
              </h3>
              <ul className="space-y-3">
                {THIS_GAME.map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-white/60">
                    <Check className="w-4 h-4 text-green-400 shrink-0" />
                    {item.item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <CTABanner
        title="Ready to Experience It?"
        subtitle="Join the founding members who will be first to enter the ChronoVerse."
        primaryAction={{ label: "Join Waitlist", href: "/community" }}
        secondaryAction={{ label: "Explore Eras", href: "/eras" }}
        backgroundImage={cyberpunkCity}
      />

      <Footer />
      
      <style>{chronoStyles}</style>
    </ChronoLayout>
  );
}

function X({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M18 6L6 18M6 6l12 12" />
    </svg>
  );
}
