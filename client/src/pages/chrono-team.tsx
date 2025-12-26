import { motion } from "framer-motion";
import { Link } from "wouter";
import { 
  Users, Code, Calendar, Target, Heart, CheckCircle2, Clock,
  Sparkles, ArrowRight, ExternalLink, Zap, Brain,
  Database, Globe, Coins, Server, Cpu, Layers
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ChronoLayout, HoloCard, chronoStyles } from "@/components/chrono-ui";
import { usePageAnalytics } from "@/hooks/use-analytics";

import fantasyWorld from "@assets/generated_images/fantasy_sci-fi_world_landscape.png";
import deepSpace from "@assets/generated_images/deep_space_station.png";
import quantumRealm from "@assets/generated_images/quantum_dimension_realm.png";
import cyberpunkCity from "@assets/generated_images/cyberpunk_neon_city.png";

const ROADMAP_PHASES = [
  {
    phase: "Phase 0",
    title: "Foundation",
    timeline: "Q1-Q2 2025",
    status: "in_progress",
    progress: 35,
    description: "Core infrastructure, database schema, single-era sandbox with basic AI agents.",
    milestones: [
      { text: "Website & branding launch", done: true },
      { text: "Crowdfunding infrastructure", done: true },
      { text: "Core database schema design", done: false },
      { text: "Basic AI agent framework", done: false },
      { text: "Single-era sandbox (Medieval)", done: false },
      { text: "200 AI agents prototype", done: false },
    ]
  },
  {
    phase: "Phase 1",
    title: "Economy & Property",
    timeline: "Q3-Q4 2025",
    status: "planned",
    progress: 0,
    description: "Property ownership, storefront infrastructure, economy systems, business partnerships.",
    milestones: [
      { text: "Property registry (blockchain-backed)", done: false },
      { text: "Storefront sponsorship system design", done: false },
      { text: "Business partner portal", done: false },
      { text: "Location-based pricing engine", done: false },
      { text: "Traffic analytics & conversion tracking", done: false },
      { text: "Creator licensing & royalty system", done: false },
    ]
  },
  {
    phase: "Phase 2",
    title: "Multi-Era Launch",
    timeline: "Q1-Q2 2026",
    status: "planned",
    progress: 0,
    description: "10+ eras live, storefronts operational, time-travel mechanics, public alpha.",
    milestones: [
      { text: "10 historical eras live", done: false },
      { text: "Storefront marketplace launch", done: false },
      { text: "Era-specific sponsor integration", done: false },
      { text: "Cross-era quest framework", done: false },
      { text: "Public alpha release", done: false },
      { text: "Mobile app (Android/iOS)", done: false },
    ]
  },
  {
    phase: "Phase 3",
    title: "Full ChronoVerse",
    timeline: "Q3-Q4 2026",
    status: "future",
    progress: 0,
    description: "70+ eras, city districts, premium storefronts, advanced AI, public beta.",
    milestones: [
      { text: "Full 70+ era deployment", done: false },
      { text: "City district auctions (premium locations)", done: false },
      { text: "Advanced sponsor analytics dashboard", done: false },
      { text: "Community content creation tools", done: false },
      { text: "Public beta release", done: false },
      { text: "DWC mainnet integration", done: false },
    ]
  },
];

const CURRENT_PRIORITIES = [
  {
    priority: 1,
    title: "AI Agent Framework",
    description: "Building the core AI system that gives each NPC unique personality, emotions, and memory.",
    icon: Brain,
    status: "In Development"
  },
  {
    priority: 2,
    title: "Database Architecture",
    description: "Designing scalable data models for persistent world state, player progress, and relationships.",
    icon: Database,
    status: "Designing"
  },
  {
    priority: 3,
    title: "Single-Era Sandbox",
    description: "Creating the Medieval era as our proof-of-concept with 200 AI agents in a living village.",
    icon: Globe,
    status: "Planning"
  },
  {
    priority: 4,
    title: "Economy Foundation",
    description: "Building the trade, property, and currency systems that will eventually integrate with DWC.",
    icon: Coins,
    status: "Planning"
  },
];

const TECH_STACK = [
  { name: "Frontend", tech: "React, TypeScript, Tailwind", icon: Code },
  { name: "Backend", tech: "Node.js, Express, PostgreSQL", icon: Server },
  { name: "AI Layer", tech: "OpenAI GPT, Custom Models", icon: Brain },
  { name: "Blockchain", tech: "DarkWave Smart Chain", icon: Coins },
  { name: "Real-time", tech: "WebSockets, Event System", icon: Zap },
  { name: "Mobile", tech: "React Native, Expo", icon: Layers },
];

export default function ChronoTeam() {
  usePageAnalytics();
  
  return (
    <ChronoLayout currentPage="/team">
      <section className="relative py-16 px-4 overflow-hidden">
        <div className="absolute inset-0">
          <img src={fantasyWorld} alt="" className="w-full h-full object-cover opacity-20" />
          <div className="absolute inset-0 bg-gradient-to-b from-black via-black/95 to-black" />
        </div>
        
        <div className="container mx-auto max-w-6xl relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <Badge className="mb-4 bg-purple-500/20 text-purple-400 border-purple-500/30">
              <Code className="w-3 h-3 mr-1" /> Development
            </Badge>
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-4 text-white">
              Building the <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">ChronoVerse</span>
            </h1>
            <p className="text-xl text-white/60 max-w-2xl mx-auto">
              A realistic look at what we're building, how we're building it, and when you can expect to live your legacy.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12"
          >
            <div className="flex items-center gap-3 mb-4">
              <Calendar className="w-6 h-6 text-cyan-400" />
              <h2 className="text-2xl md:text-3xl font-display font-bold text-white">Development Roadmap</h2>
            </div>
            <p className="text-white/60 max-w-2xl">
              Honest timelines. Real milestones. We'll update this as we make progress - no promises we can't keep.
            </p>
          </motion.div>

          <div className="space-y-6">
            {ROADMAP_PHASES.map((phase, i) => (
              <motion.div
                key={phase.phase}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <div className={`rounded-2xl border p-6 ${
                  phase.status === 'in_progress' 
                    ? 'bg-gradient-to-r from-purple-500/10 to-transparent border-purple-500/30' 
                    : 'bg-white/5 border-white/10'
                }`}>
                  <div className="flex flex-col md:flex-row md:items-start gap-6">
                    <div className="md:w-1/3">
                      <div className="flex items-center gap-3 mb-2">
                        <Badge className={`${
                          phase.status === 'in_progress' 
                            ? 'bg-purple-500/20 text-purple-400 border-purple-500/30' 
                            : phase.status === 'planned'
                            ? 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30'
                            : 'bg-white/10 text-white/60 border-white/20'
                        }`}>
                          {phase.phase}
                        </Badge>
                        {phase.status === 'in_progress' && (
                          <Badge className="bg-green-500/20 text-green-400 border-green-500/30 animate-pulse">
                            <Zap className="w-3 h-3 mr-1" /> Active
                          </Badge>
                        )}
                      </div>
                      <h3 className="text-xl font-bold text-white mb-1">{phase.title}</h3>
                      <p className="text-sm text-white/50 mb-3">{phase.timeline}</p>
                      <p className="text-white/60 text-sm mb-4">{phase.description}</p>
                      {phase.status === 'in_progress' && (
                        <div className="flex items-center gap-3">
                          <Progress value={phase.progress} className="flex-1 h-2" />
                          <span className="text-xs text-white/60">{phase.progress}%</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="md:w-2/3">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {phase.milestones.map((milestone, j) => (
                          <div 
                            key={j}
                            className={`flex items-center gap-2 p-2 rounded-lg ${
                              milestone.done ? 'bg-green-500/10' : 'bg-white/5'
                            }`}
                          >
                            {milestone.done ? (
                              <CheckCircle2 className="w-4 h-4 text-green-400 shrink-0" />
                            ) : (
                              <Clock className="w-4 h-4 text-white/40 shrink-0" />
                            )}
                            <span className={`text-sm ${milestone.done ? 'text-green-300' : 'text-white/60'}`}>
                              {milestone.text}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 px-4 bg-gradient-to-b from-transparent via-cyan-950/10 to-transparent">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12"
          >
            <div className="flex items-center gap-3 mb-4">
              <Target className="w-6 h-6 text-pink-400" />
              <h2 className="text-2xl md:text-3xl font-display font-bold text-white">Current Priorities</h2>
            </div>
            <p className="text-white/60 max-w-2xl">
              What we're actively working on right now. These are the building blocks that everything else depends on.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-4">
            {CURRENT_PRIORITIES.map((priority, i) => {
              const Icon = priority.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                >
                  <div className="p-6 rounded-xl bg-gradient-to-br from-white/5 to-transparent border border-white/10 hover:border-pink-500/30 transition-all h-full">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-pink-500 to-purple-500 flex items-center justify-center shrink-0">
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs text-pink-400 font-mono">#{priority.priority}</span>
                          <h3 className="font-semibold text-white">{priority.title}</h3>
                        </div>
                        <p className="text-white/60 text-sm mb-2">{priority.description}</p>
                        <Badge variant="outline" className="text-xs border-white/20 text-white/50">
                          {priority.status}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12"
          >
            <div className="flex items-center gap-3 mb-4">
              <Cpu className="w-6 h-6 text-amber-400" />
              <h2 className="text-2xl md:text-3xl font-display font-bold text-white">Technology Stack</h2>
            </div>
            <p className="text-white/60 max-w-2xl">
              The technologies powering the ChronoVerse. Built for scale, designed for immersion.
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {TECH_STACK.map((tech, i) => {
              const Icon = tech.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                >
                  <div className="p-4 rounded-xl bg-white/5 border border-white/10 hover:border-amber-500/30 transition-all">
                    <div className="flex items-center gap-3 mb-2">
                      <Icon className="w-5 h-5 text-amber-400" />
                      <span className="font-semibold text-white">{tech.name}</span>
                    </div>
                    <p className="text-sm text-white/50">{tech.tech}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-16 px-4 bg-gradient-to-b from-transparent via-purple-950/10 to-transparent">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12"
          >
            <div className="flex items-center gap-3 mb-4">
              <Users className="w-6 h-6 text-purple-400" />
              <h2 className="text-2xl md:text-3xl font-display font-bold text-white">The Team</h2>
            </div>
            <p className="text-white/60 max-w-2xl">
              Currently a solo endeavor with big ambitions. Looking for passionate contributors to join the journey.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6">
            <HoloCard image={deepSpace} glow="purple" className="min-h-[250px]">
              <div className="p-8 h-full flex flex-col justify-end">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center mb-4">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Founder & Lead Developer</h3>
                <p className="text-white/60 text-sm mb-4">
                  Building the ChronoVerse vision from scratch. One developer, one laptop, infinite determination. 
                  Seeking talented contributors who share the vision.
                </p>
                <Badge className="w-fit bg-purple-500/20 text-purple-400 border-purple-500/30">
                  <Heart className="w-3 h-3 mr-1" /> Looking for Contributors
                </Badge>
              </div>
            </HoloCard>

            <HoloCard image={quantumRealm} glow="cyan" className="min-h-[250px]">
              <div className="p-8 h-full flex flex-col justify-end">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center mb-4">
                  <Sparkles className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Join the Mission</h3>
                <p className="text-white/60 text-sm mb-4">
                  AI engineers, game designers, world builders, writers, artists - 
                  if you believe in this vision, there's a place for you.
                </p>
                <Link href="/community">
                  <Button size="sm" className="rounded-full gap-2 bg-gradient-to-r from-cyan-600 to-blue-600" data-testid="join-team-cta">
                    Get Involved
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              </div>
            </HoloCard>
          </div>
        </div>
      </section>

      <section className="py-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <HoloCard image={cyberpunkCity} glow="pink" className="min-h-[200px]">
            <div className="p-8 text-center">
              <h3 className="text-2xl font-bold text-white mb-3">Support Development</h3>
              <p className="text-white/60 mb-6 max-w-xl mx-auto">
                Every contribution helps bring the ChronoVerse closer to reality. 
                Supporters get early access, exclusive rewards, and their name in history.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/crowdfund">
                  <Button size="lg" className="rounded-full gap-2 bg-gradient-to-r from-pink-600 to-purple-600" data-testid="support-dev-cta">
                    <Heart className="w-5 h-5" />
                    Fund Development
                  </Button>
                </Link>
                <a href="https://dwsc.io/developers" target="_blank" rel="noopener noreferrer">
                  <Button size="lg" variant="outline" className="rounded-full gap-2 border-white/20 hover:bg-white/10" data-testid="dwsc-dev-link">
                    <ExternalLink className="w-5 h-5" />
                    DWSC Developer Docs
                  </Button>
                </a>
              </div>
            </div>
          </HoloCard>
        </div>
      </section>
      
      <style>{chronoStyles}</style>
    </ChronoLayout>
  );
}
