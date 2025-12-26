import { motion } from "framer-motion";
import { Link } from "wouter";
import { 
  Rocket, Users, Globe, Coins, Shield, Sparkles, Check, Clock,
  ChevronRight, Target, Zap, Star, Heart, Flag, Layers, Box
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Footer } from "@/components/footer";
import { ChronoLayout, HoloCard, CTABanner, chronoStyles } from "@/components/chrono-ui";
import { usePageAnalytics } from "@/hooks/use-analytics";

import fantasyWorld from "@assets/generated_images/fantasy_sci-fi_world_landscape.png";
import medievalKingdom from "@assets/generated_images/medieval_fantasy_kingdom.png";
import quantumRealm from "@assets/generated_images/quantum_dimension_realm.png";
import deepSpace from "@assets/generated_images/deep_space_station.png";
import cyberpunkCity from "@assets/generated_images/cyberpunk_neon_city.png";

interface Phase {
  id: string;
  name: string;
  period: string;
  status: 'completed' | 'current' | 'upcoming';
  description: string;
  milestones: { item: string; done: boolean }[];
  image: string;
  color: string;
}

const PHASES: Phase[] = [
  {
    id: "foundation",
    name: "Foundation",
    period: "Q4 2024 - Q1 2025",
    status: "current",
    description: "Building the core infrastructure, community, and vision documentation.",
    milestones: [
      { item: "Vision document complete", done: true },
      { item: "Website & community launch", done: true },
      { item: "DWC blockchain operational", done: true },
      { item: "Crowdfunding campaign", done: false },
      { item: "Discord community 1,000+", done: false },
    ],
    image: fantasyWorld,
    color: "from-cyan-500 to-blue-600"
  },
  {
    id: "prototype",
    name: "Prototype",
    period: "Q2 - Q3 2025",
    status: "upcoming",
    description: "Building the first playable prototype with core systems.",
    milestones: [
      { item: "AI character system prototype", done: false },
      { item: "Single era sandbox (Medieval)", done: false },
      { item: "200 AI characters active", done: false },
      { item: "Basic economy loop", done: false },
      { item: "Founder alpha access", done: false },
    ],
    image: medievalKingdom,
    color: "from-purple-500 to-violet-600"
  },
  {
    id: "expansion",
    name: "Era Expansion",
    period: "Q4 2025 - Q1 2026",
    status: "upcoming",
    description: "Adding more eras and expanding the ChronoVerse.",
    milestones: [
      { item: "5 additional eras", done: false },
      { item: "Cross-era mechanics", done: false },
      { item: "Political system v1", done: false },
      { item: "Property ownership", done: false },
      { item: "Patron beta access", done: false },
    ],
    image: quantumRealm,
    color: "from-amber-500 to-orange-600"
  },
  {
    id: "launch",
    name: "Public Launch",
    period: "Q2 2026",
    status: "upcoming",
    description: "Opening the ChronoVerse to the world.",
    milestones: [
      { item: "20+ eras available", done: false },
      { item: "Full economy system", done: false },
      { item: "Community creation tools", done: false },
      { item: "Mobile companion app", done: false },
      { item: "Public launch", done: false },
    ],
    image: deepSpace,
    color: "from-pink-500 to-rose-600"
  },
  {
    id: "scale",
    name: "Scale & Evolve",
    period: "Q3 2026+",
    status: "upcoming",
    description: "Growing the universe and community indefinitely.",
    milestones: [
      { item: "70+ eras", done: false },
      { item: "Time travel system", done: false },
      { item: "Player-created eras", done: false },
      { item: "Global events system", done: false },
      { item: "Continuous expansion", done: false },
    ],
    image: cyberpunkCity,
    color: "from-emerald-500 to-teal-600"
  },
];

const TRANSPARENCY = [
  {
    icon: Users,
    title: "One Developer Start",
    description: "This project starts with one developer and a vision. We're transparent about our scale and ambitions."
  },
  {
    icon: Heart,
    title: "Community Funded",
    description: "We're building this together. No VC money. No corporate overlords. Just community support."
  },
  {
    icon: Target,
    title: "Realistic Timeline",
    description: "We won't overpromise. These dates are our best estimates and may shift as we learn."
  },
  {
    icon: Shield,
    title: "Open Development",
    description: "Regular updates, dev logs, and community involvement in decision-making."
  },
];

function PhaseCard({ phase, index }: { phase: Phase; index: number }) {
  const statusColors = {
    completed: 'bg-green-500/20 text-green-400 border-green-500/30',
    current: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
    upcoming: 'bg-white/10 text-white/60 border-white/20'
  };
  
  const statusLabels = {
    completed: 'Completed',
    current: 'In Progress',
    upcoming: 'Upcoming'
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className="relative"
    >
      <div className="hidden md:block absolute left-0 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-purple-500/30 to-transparent" style={{ left: '1rem' }} />
      
      <div className="flex gap-6">
        <div className="hidden md:flex flex-col items-center">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center z-10 ${phase.status === 'current' ? 'bg-cyan-500' : phase.status === 'completed' ? 'bg-green-500' : 'bg-white/20'}`}>
            {phase.status === 'completed' ? (
              <Check className="w-4 h-4 text-white" />
            ) : phase.status === 'current' ? (
              <Zap className="w-4 h-4 text-white" />
            ) : (
              <Clock className="w-4 h-4 text-white/60" />
            )}
          </div>
        </div>
        
        <HoloCard image={phase.image} className="flex-1" glow={phase.status === 'current' ? 'cyan' : 'none'}>
          <div className="p-6">
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <Badge className={statusColors[phase.status]}>
                {statusLabels[phase.status]}
              </Badge>
              <span className="text-white/40 text-sm">{phase.period}</span>
            </div>
            
            <h3 className="text-2xl font-bold text-white mb-2">{phase.name}</h3>
            <p className="text-white/60 mb-6">{phase.description}</p>
            
            <div className="space-y-2">
              {phase.milestones.map((milestone, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center ${milestone.done ? 'bg-green-500/20' : 'bg-white/10'}`}>
                    {milestone.done ? (
                      <Check className="w-3 h-3 text-green-400" />
                    ) : (
                      <div className="w-2 h-2 rounded-full bg-white/30" />
                    )}
                  </div>
                  <span className={milestone.done ? 'text-white/80' : 'text-white/50'}>
                    {milestone.item}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </HoloCard>
      </div>
    </motion.div>
  );
}

export default function ChronoRoadmap() {
  usePageAnalytics();
  
  const completedCount = PHASES.reduce((acc, phase) => 
    acc + phase.milestones.filter(m => m.done).length, 0
  );
  const totalCount = PHASES.reduce((acc, phase) => 
    acc + phase.milestones.length, 0
  );
  const progressPercent = Math.round((completedCount / totalCount) * 100);
  
  return (
    <ChronoLayout currentPage="/roadmap">
      <section className="relative py-24 px-4 overflow-hidden">
        <div className="absolute inset-0">
          <img src={fantasyWorld} alt="" className="w-full h-full object-cover opacity-30" />
          <div className="absolute inset-0 bg-gradient-to-b from-black via-black/90 to-black" />
        </div>
        
        <div className="container mx-auto max-w-4xl relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Badge className="mb-4 bg-purple-500/20 text-purple-400 border-purple-500/30">
              <Rocket className="w-3 h-3 mr-1" /> Development Journey
            </Badge>
            <h1 className="text-4xl md:text-6xl font-display font-bold mb-6 text-white">
              The Road to the <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">ChronoVerse</span>
            </h1>
            <p className="text-xl text-white/60 max-w-2xl mx-auto mb-8">
              A transparent look at where we are, where we're going, and how we'll get there.
            </p>
            
            <div className="inline-flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/10">
              <div className="text-left">
                <p className="text-white/50 text-sm">Overall Progress</p>
                <p className="text-2xl font-bold text-white">{progressPercent}%</p>
              </div>
              <div className="w-32 h-2 rounded-full bg-white/10 overflow-hidden">
                <motion.div 
                  className="h-full bg-gradient-to-r from-cyan-500 to-purple-500"
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercent}%` }}
                  transition={{ delay: 0.5, duration: 1 }}
                />
              </div>
              <p className="text-white/40 text-sm">{completedCount}/{totalCount} milestones</p>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-24 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="space-y-8">
            {PHASES.map((phase, i) => (
              <PhaseCard key={phase.id} phase={phase} index={i} />
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 px-4 bg-gradient-to-b from-transparent via-purple-950/20 to-transparent">
        <div className="container mx-auto max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <Badge className="mb-4 bg-green-500/20 text-green-400 border-green-500/30">
              <Shield className="w-3 h-3 mr-1" /> Transparency
            </Badge>
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4 text-white">
              Honest Development
            </h2>
            <p className="text-white/60 max-w-2xl mx-auto">
              We believe in being upfront about our scale, resources, and challenges.
            </p>
          </motion.div>
          
          <div className="grid sm:grid-cols-2 gap-6">
            {TRANSPARENCY.map((item, i) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="p-6 rounded-2xl bg-white/5 border border-white/10"
                >
                  <Icon className="w-10 h-10 text-purple-400 mb-4" />
                  <h3 className="text-lg font-bold text-white mb-2">{item.title}</h3>
                  <p className="text-white/60">{item.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      <CTABanner
        title="Help Us Get There Faster"
        subtitle="Your support directly funds development. Every contribution brings the ChronoVerse closer to reality."
        primaryAction={{ label: "Support Development", href: "/crowdfund" }}
        secondaryAction={{ label: "Join Community", href: "/community" }}
        backgroundImage={deepSpace}
      />

      <Footer />
      
      <style>{chronoStyles}</style>
    </ChronoLayout>
  );
}
