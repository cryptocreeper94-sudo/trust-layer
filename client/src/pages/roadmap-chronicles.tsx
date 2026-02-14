import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Circle, Clock, Sparkles, Brain, Users, Globe, Zap, Crown, ChevronDown, ChevronUp } from "lucide-react";

import { Link } from "wouter";

import fantasyWorld from "@assets/generated_images/fantasy_sci-fi_world_landscape.png";
import medievalKingdom from "@assets/generated_images/medieval_fantasy_kingdom.png";
import quantumRealm from "@assets/generated_images/quantum_dimension_realm.png";
import deepSpace from "@assets/generated_images/deep_space_station.png";
import cyberpunkCity from "@assets/generated_images/cyberpunk_neon_city.png";

interface Milestone {
  id: string;
  title: string;
  description: string;
  status: "completed" | "in_progress" | "pending";
  isRequired: boolean;
}

interface Phase {
  id: string;
  name: string;
  description: string;
  status: "completed" | "in_progress" | "upcoming";
  targetDate: string;
  icon: React.ReactNode;
  image: string;
  milestones: Milestone[];
}

// ACCURATE STATUS - Updated for Season Zero BETA v0.1
// "completed" = fully working, production-ready
// "in_progress" = actively being developed
// "pending" = not yet started
// Season Zero is LIVE with Medieval Era playable
const CHRONICLES_PHASES: Phase[] = [
  {
    id: "season-zero",
    name: "Season Zero: The Awakening (BETA v0.1)",
    description: "First playable era - Medieval Kingdom with AI NPCs and Chronicle Proofs",
    status: "in_progress",
    targetDate: "NOW - Until Launch",
    icon: <Crown className="w-6 h-6" />,
    image: medievalKingdom,
    milestones: [
      { id: "sz1", title: "Medieval Era (Age of Crowns)", description: "First of 10 verifiable historical eras - medieval kingdom with 5 factions", status: "completed", isRequired: true },
      { id: "sz2", title: "AI NPC Conversations", description: "Guardian-verified GPT-4o powered NPCs with persistent memory", status: "completed", isRequired: true },
      { id: "sz3", title: "Chronicle Proofs", description: "Soulbound NFTs recording major decisions on-chain", status: "completed", isRequired: true },
      { id: "sz4", title: "Voice Cloning Technology", description: "ElevenLabs/Resemble.ai integration for NPC voices", status: "completed", isRequired: true },
      { id: "sz5", title: "5-Axis Emotion System", description: "Arousal, Valence, Social Cohesion, Fear, and Ambition", status: "completed", isRequired: true },
      { id: "sz6", title: "Business Storefront Program", description: "Real businesses claim in-game real estate across all eras", status: "in_progress", isRequired: true },
    ],
  },
  {
    id: "phase-0",
    name: "Phase 0: Foundation",
    description: "Core AI systems powering every life in the world",
    status: "completed",
    targetDate: "Completed",
    icon: <Brain className="w-6 h-6" />,
    image: fantasyWorld,
    milestones: [
      { id: "m1", title: "5-Axis Emotion System", description: "Arousal, Valence, Social Cohesion, Fear, and Ambition driving every decision", status: "completed", isRequired: true },
      { id: "m2", title: "Belief System Framework", description: "Buddhism, Christianity, Islam, Hinduism, atheism, and more shaping moral compass", status: "in_progress", isRequired: true },
      { id: "m3", title: "Scenario Generator", description: "AI-generated situations with consequence webs and emotional impact", status: "completed", isRequired: true },
      { id: "m4", title: "Character Portrait System", description: "Photorealistic character cards with emotion visualization", status: "in_progress", isRequired: true },
      { id: "m5", title: "Single-Era Sandbox", description: "One historical era with 200 AI agents living their lives", status: "completed", isRequired: true },
      { id: "m6", title: "Emotion Dashboard", description: "See how your character feels and why", status: "in_progress", isRequired: true },
    ],
  },
  {
    id: "phase-1",
    name: "Phase 1: Political Simulation",
    description: "Factions rise and fall. Treaties are made and broken. Your actions ripple through society.",
    status: "upcoming",
    targetDate: "TBD",
    icon: <Crown className="w-6 h-6" />,
    image: medievalKingdom,
    milestones: [
      { id: "m7", title: "Faction System", description: "Join or create groups with shared beliefs and goals", status: "pending", isRequired: true },
      { id: "m8", title: "Political Councils", description: "AI-driven governance with debates, votes, and power struggles", status: "pending", isRequired: true },
      { id: "m9", title: "Treaty Mechanics", description: "Negotiate alliances, trade agreements, and peace accords", status: "pending", isRequired: true },
      { id: "m10", title: "Player-Triggered Crises", description: "Your choices can destabilize entire regions", status: "pending", isRequired: true },
      { id: "m11", title: "Emotional Contagion", description: "Fear spreads. Hope inspires. Emotions flow between NPCs", status: "pending", isRequired: true },
      { id: "m12", title: "Reputational Memory", description: "NPCs remember what you did, not a moral judgment", status: "pending", isRequired: true },
    ],
  },
  {
    id: "phase-2",
    name: "Phase 2: Living World",
    description: "The world breathes. Time flows. Your legacy echoes through generations.",
    status: "upcoming",
    targetDate: "TBD",
    icon: <Globe className="w-6 h-6" />,
    image: medievalKingdom,
    milestones: [
      { id: "m13", title: "Multi-Era Gameplay", description: "Play across different verified historical periods", status: "pending", isRequired: true },
      { id: "m14", title: "Generational Legacy", description: "Your choices echo through family lines and historical records", status: "pending", isRequired: true },
      { id: "m15", title: "Full-Scale World Simulation", description: "Thousands of AI agents, persistent world state", status: "pending", isRequired: true },
      { id: "m16", title: "Community Creation Tools", description: "Build and share your own scenarios, characters, and worlds", status: "pending", isRequired: true },
      { id: "m17", title: "Global Server Infrastructure", description: "Dedicated servers worldwide for smooth experience", status: "pending", isRequired: true },
      { id: "m18", title: "3-Tier AI Stack", description: "Deterministic planners → LLM microservices → Offline batch processing", status: "pending", isRequired: true },
    ],
  },
];

function PhaseCard({ phase, isExpanded, onToggle }: { phase: Phase; isExpanded: boolean; onToggle: () => void }) {
  const statusColors = {
    completed: "from-green-500 to-emerald-600",
    in_progress: "from-purple-500 to-pink-500",
    upcoming: "from-gray-600 to-gray-700",
  };
  
  const statusLabels = {
    completed: "Completed",
    in_progress: "In Progress",
    upcoming: "Upcoming",
  };
  
  const completedCount = phase.milestones.filter(m => m.status === "completed").length;
  const inProgressCount = phase.milestones.filter(m => m.status === "in_progress").length;
  const totalCount = phase.milestones.length;
  const progress = ((completedCount + inProgressCount * 0.5) / totalCount) * 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative"
    >
      <div 
        onClick={onToggle}
        data-testid={`card-phase-${phase.id}`}
        className="cursor-pointer relative overflow-hidden rounded-2xl border border-white/10 hover:border-purple-500/30 transition-all group"
        style={{
          boxShadow: phase.status === "in_progress" 
            ? "0 0 60px rgba(168, 85, 247, 0.2), inset 0 1px 0 rgba(255,255,255,0.1)"
            : "0 0 30px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.1)",
        }}
      >
        {/* Photorealistic Background */}
        <div className="absolute inset-0">
          <img 
            src={phase.image} 
            alt={phase.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-black/50" />
        </div>
        
        {/* Holographic overlay */}
        <div className="absolute inset-0 opacity-20 pointer-events-none" style={{
          background: "repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.02) 10px, rgba(255,255,255,0.02) 20px)",
        }} />
        
        {/* Progress bar at top */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-black/50">
          <motion.div 
            className={`h-full bg-gradient-to-r ${statusColors[phase.status]}`}
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
        </div>
        
        <div className="relative z-10 p-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${statusColors[phase.status]} flex items-center justify-center shadow-lg`}>
                {phase.icon}
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">{phase.name}</h3>
                <p className="text-gray-300 text-sm mt-1">{phase.description}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <span className={`inline-block px-3 py-1.5 rounded-full text-xs font-semibold bg-gradient-to-r ${statusColors[phase.status]} text-white shadow-lg`}>
                  {statusLabels[phase.status]}
                </span>
                <p className="text-gray-400 text-xs mt-2">{phase.targetDate}</p>
              </div>
              <motion.div
                animate={{ rotate: isExpanded ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronDown className="w-5 h-5 text-gray-400" />
              </motion.div>
            </div>
          </div>
          
          <div className="mt-4 flex items-center gap-3 text-sm">
            <span className="text-gray-300">
              <span className="text-green-400 font-semibold">{completedCount}</span> completed
              {inProgressCount > 0 && (
                <span className="ml-2">
                  <span className="text-purple-400 font-semibold">{inProgressCount}</span> in progress
                </span>
              )}
              <span className="text-gray-500"> / {totalCount} milestones</span>
            </span>
            <div className="flex-1 h-2 bg-black/50 backdrop-blur-sm rounded-full overflow-hidden">
              <motion.div 
                className={`h-full bg-gradient-to-r ${statusColors[phase.status]}`}
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
              />
            </div>
          </div>
        </div>
      </div>
      
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-2 space-y-2 pl-4"
          >
            {phase.milestones.map((milestone, index) => (
              <MilestoneItem key={milestone.id} milestone={milestone} index={index} />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function MilestoneItem({ milestone, index }: { milestone: Milestone; index: number }) {
  const statusIcons = {
    completed: <Check className="w-4 h-4 text-green-400" />,
    in_progress: <Clock className="w-4 h-4 text-purple-400 animate-pulse" />,
    pending: <Circle className="w-4 h-4 text-gray-600" />,
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
      data-testid={`milestone-${milestone.id}`}
      className={`flex items-start gap-3 p-4 rounded-xl border backdrop-blur-sm transition-all ${
        milestone.status === "completed" 
          ? "bg-green-500/10 border-green-500/30" 
          : milestone.status === "in_progress"
          ? "bg-purple-500/10 border-purple-500/30"
          : "bg-gray-900/50 border-white/5"
      }`}
    >
      <div className={`mt-0.5 w-7 h-7 rounded-full flex items-center justify-center ${
        milestone.status === "completed" ? "bg-green-500/20" :
        milestone.status === "in_progress" ? "bg-purple-500/20" : "bg-gray-800"
      }`}>
        {statusIcons[milestone.status]}
      </div>
      <div className="flex-1">
        <h4 className={`font-medium ${
          milestone.status === "completed" ? "text-green-400" : 
          milestone.status === "in_progress" ? "text-purple-400" : "text-white"
        }`}>
          {milestone.title}
          {milestone.isRequired && <span className="ml-2 text-xs text-amber-400/80">Required</span>}
        </h4>
        <p className="text-gray-400 text-sm mt-1">{milestone.description}</p>
      </div>
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

export default function RoadmapChronicles() {
  const [expandedPhase, setExpandedPhase] = useState<string | null>("phase-0");
  
  const totalMilestones = CHRONICLES_PHASES.reduce((acc, p) => acc + p.milestones.length, 0);
  const completedMilestones = CHRONICLES_PHASES.reduce((acc, p) => acc + p.milestones.filter(m => m.status === "completed").length, 0);
  const inProgressMilestones = CHRONICLES_PHASES.reduce((acc, p) => acc + p.milestones.filter(m => m.status === "in_progress").length, 0);
  const overallProgress = ((completedMilestones + inProgressMilestones * 0.3) / totalMilestones) * 100;

  return (
    <div className="min-h-screen relative overflow-hidden pt-20 pb-12" style={{ background: "linear-gradient(180deg, #070b16, #0c1222, #070b16)" }}>
      <GlowOrb color="linear-gradient(135deg, #06b6d4, #3b82f6)" size={500} top="-5%" left="60%" />
      <GlowOrb color="linear-gradient(135deg, #8b5cf6, #ec4899)" size={400} top="40%" left="-10%" delay={3} />
      {/* Hero with background */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img src={fantasyWorld} alt="Fantasy World" className="w-full h-full object-cover opacity-30" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#080c18]/50 via-[#080c18]/80 to-[#080c18]" />
        </div>
        
        <div className="relative z-10 max-w-5xl mx-auto px-4 py-12">
          <div className="text-center mb-12">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/30 mb-6"
            >
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span className="text-purple-300 text-sm font-medium">Chronicles</span>
            </motion.div>
            
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400 bg-clip-text text-transparent">
                Game Development Roadmap
              </span>
            </h1>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Follow our journey to create the most ambitious AI-powered adventure platform ever made. 
              Your character isn't an avatar—it's an extension of your psyche.
            </p>
            <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/30">
              <Users className="w-4 h-4 text-amber-400" />
              <span className="text-amber-300 text-sm">Community-driven timeline — your involvement shapes when we launch</span>
            </div>
          </div>

          {/* Overall Progress Card with photorealistic background */}
          <div 
            className="relative overflow-hidden mb-12 rounded-2xl border border-purple-500/20"
            style={{ boxShadow: "0 0 60px rgba(168, 85, 247, 0.15)" }}
          >
            <div className="absolute inset-0">
              <img src={medievalKingdom} alt="Kingdom" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/80 to-black/70" />
            </div>
            <div className="absolute inset-0 opacity-20 pointer-events-none" style={{
              background: "repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.02) 10px, rgba(255,255,255,0.02) 20px)",
            }} />
            
            <div className="relative z-10 p-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold text-white">Overall Progress</h2>
                  <p className="text-gray-300 text-sm mt-1">
                    <span className="text-green-400 font-semibold">{completedMilestones}</span> completed, 
                    <span className="text-purple-400 font-semibold ml-1">{inProgressMilestones}</span> in progress of {totalMilestones} milestones
                  </p>
                </div>
                <div className="text-4xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400 bg-clip-text text-transparent">
                  {Math.round(overallProgress)}%
                </div>
              </div>
              <div className="h-4 bg-black/50 backdrop-blur-sm rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${overallProgress}%` }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                  className="h-full bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 pb-12">
        <div className="space-y-4">
          {CHRONICLES_PHASES.map((phase) => (
            <PhaseCard
              key={phase.id}
              phase={phase}
              isExpanded={expandedPhase === phase.id}
              onToggle={() => setExpandedPhase(expandedPhase === phase.id ? null : phase.id)}
            />
          ))}
        </div>

        {/* Sentient Mirror section with photorealistic background */}
        <div 
          className="relative overflow-hidden mt-12 rounded-2xl border border-white/10"
          style={{ boxShadow: "0 0 40px rgba(168, 85, 247, 0.1)" }}
        >
          <div className="absolute inset-0">
            <img src={deepSpace} alt="Deep Space" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/80 to-black/70" />
          </div>
          <div className="absolute inset-0 opacity-20 pointer-events-none" style={{
            background: "repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.02) 10px, rgba(255,255,255,0.02) 20px)",
          }} />
          
          <div className="relative z-10 p-8 text-center">
            <h3 className="text-xl font-bold text-white mb-3">The Sentient Mirror</h3>
            <p className="text-gray-300 text-sm max-w-xl mx-auto">
              Your character's emotions mirror your emotions. Their struggles reflect your inner landscape. 
              This isn't just a game—it's self-discovery through interactive narrative.
            </p>
            <Link 
              href="/crowdfund" 
              className="inline-flex items-center gap-2 mt-6 px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-medium hover:opacity-90 transition-opacity"
              data-testid="link-support-development"
            >
              <Zap className="w-4 h-4" />
              Support Development
            </Link>
          </div>
        </div>

        {/* Link to ecosystem roadmap */}
        <Link 
          href="/roadmap" 
          className="block relative overflow-hidden mt-4 rounded-2xl border border-cyan-500/20 hover:border-cyan-500/40 transition-all group"
          data-testid="link-ecosystem-roadmap"
          style={{ boxShadow: "0 0 40px rgba(6, 182, 212, 0.1)" }}
        >
          <div className="absolute inset-0">
            <img src={cyberpunkCity} alt="Ecosystem" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-black/50" />
          </div>
          <div className="relative z-10 p-6">
            <h3 className="text-lg font-semibold text-white mb-2">Trust Layer</h3>
            <p className="text-gray-300 text-sm">View the blockchain ecosystem roadmap</p>
          </div>
        </Link>
      </div>
    </div>
    </div>
    </div>
  );
}
