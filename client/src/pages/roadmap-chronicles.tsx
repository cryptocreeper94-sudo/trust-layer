import { useState } from "react";
import { motion } from "framer-motion";
import { Check, Circle, Clock, Sparkles, Brain, Users, Globe, Zap, Crown, ChevronDown, ChevronUp, ArrowLeft } from "lucide-react";
import { Link } from "wouter";

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
  milestones: Milestone[];
}

const CHRONICLES_PHASES: Phase[] = [
  {
    id: "phase-0",
    name: "Phase 0: Foundation",
    description: "Build the core systems that power every AI life in the world",
    status: "in_progress",
    targetDate: "Q2 2025",
    icon: <Brain className="w-6 h-6" />,
    milestones: [
      { id: "m1", title: "5-Axis Emotion System", description: "Arousal, Valence, Social Cohesion, Fear, and Ambition driving every decision", status: "completed", isRequired: true },
      { id: "m2", title: "Belief System Framework", description: "Buddhism, Christianity, Islam, Hinduism, atheism, and more shaping moral compass", status: "completed", isRequired: true },
      { id: "m3", title: "Scenario Generator", description: "AI-generated situations with consequence webs and emotional impact", status: "completed", isRequired: true },
      { id: "m4", title: "Character Portrait System", description: "Photorealistic character cards with emotion visualization", status: "completed", isRequired: true },
      { id: "m5", title: "Single-Era Sandbox", description: "One historical era with 200 AI agents living their lives", status: "in_progress", isRequired: true },
      { id: "m6", title: "Emotion Dashboard", description: "See how your character feels and why", status: "pending", isRequired: true },
    ],
  },
  {
    id: "phase-1",
    name: "Phase 1: Political Simulation",
    description: "Factions rise and fall. Treaties are made and broken. Your actions ripple through society.",
    status: "upcoming",
    targetDate: "Q4 2025",
    icon: <Crown className="w-6 h-6" />,
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
    targetDate: "Q2 2026",
    icon: <Globe className="w-6 h-6" />,
    milestones: [
      { id: "m13", title: "Multi-Era Gameplay", description: "Play across different historical periods", status: "pending", isRequired: true },
      { id: "m14", title: "Time-Travel Echoes", description: "Past actions affect future timelines", status: "pending", isRequired: true },
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
  const totalCount = phase.milestones.length;
  const progress = (completedCount / totalCount) * 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative"
    >
      <div 
        onClick={onToggle}
        data-testid={`card-phase-${phase.id}`}
        className="cursor-pointer relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-gray-900/80 to-black/60 backdrop-blur-xl p-6 hover:border-purple-500/30 transition-all"
        style={{
          boxShadow: phase.status === "in_progress" 
            ? "0 0 40px rgba(168, 85, 247, 0.2), inset 0 1px 0 rgba(255,255,255,0.1)"
            : "inset 0 1px 0 rgba(255,255,255,0.1)",
        }}
      >
        <div className="absolute top-0 left-0 right-0 h-1">
          <div 
            className={`h-full bg-gradient-to-r ${statusColors[phase.status]}`}
            style={{ width: `${progress}%` }}
          />
        </div>
        
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${statusColors[phase.status]} flex items-center justify-center`}>
              {phase.icon}
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">{phase.name}</h3>
              <p className="text-gray-400 text-sm mt-1">{phase.description}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${statusColors[phase.status]} text-white`}>
                {statusLabels[phase.status]}
              </span>
              <p className="text-gray-500 text-xs mt-1">{phase.targetDate}</p>
            </div>
            {isExpanded ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
          </div>
        </div>
        
        <div className="mt-4 flex items-center gap-2 text-sm text-gray-400">
          <span>{completedCount} / {totalCount} milestones</span>
          <div className="flex-1 h-1 bg-gray-800 rounded-full overflow-hidden">
            <div 
              className={`h-full bg-gradient-to-r ${statusColors[phase.status]}`}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>
      
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
      className={`flex items-start gap-3 p-4 rounded-xl border transition-all ${
        milestone.status === "completed" 
          ? "bg-green-500/5 border-green-500/20" 
          : milestone.status === "in_progress"
          ? "bg-purple-500/10 border-purple-500/30"
          : "bg-gray-900/30 border-white/5"
      }`}
    >
      <div className={`mt-1 w-6 h-6 rounded-full flex items-center justify-center ${
        milestone.status === "completed" ? "bg-green-500/20" :
        milestone.status === "in_progress" ? "bg-purple-500/20" : "bg-gray-800"
      }`}>
        {statusIcons[milestone.status]}
      </div>
      <div className="flex-1">
        <h4 className={`font-medium ${milestone.status === "completed" ? "text-green-400" : "text-white"}`}>
          {milestone.title}
          {milestone.isRequired && <span className="ml-2 text-xs text-yellow-500">Required</span>}
        </h4>
        <p className="text-gray-400 text-sm mt-1">{milestone.description}</p>
      </div>
    </motion.div>
  );
}

export default function RoadmapChronicles() {
  const [expandedPhase, setExpandedPhase] = useState<string | null>("phase-0");
  
  const totalMilestones = CHRONICLES_PHASES.reduce((acc, p) => acc + p.milestones.length, 0);
  const completedMilestones = CHRONICLES_PHASES.reduce((acc, p) => acc + p.milestones.filter(m => m.status === "completed").length, 0);
  const overallProgress = (completedMilestones / totalMilestones) * 100;

  return (
    <div className="min-h-screen bg-[#080c18] text-white">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <Link href="/" className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition-colors" data-testid="link-back-home">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </Link>

        <div className="text-center mb-12">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/30 mb-6"
          >
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span className="text-purple-300 text-sm font-medium">DarkWave Chronicles</span>
          </motion.div>
          
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400 bg-clip-text text-transparent">
              Game Development Roadmap
            </span>
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Follow our journey to create the most ambitious AI life simulator ever made. 
            Your character isn't an avatar—it's an extension of your psyche.
          </p>
        </div>

        <div className="relative mb-12 p-6 rounded-2xl bg-gradient-to-br from-purple-900/20 to-pink-900/20 border border-purple-500/20">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-semibold text-white">Overall Progress</h2>
              <p className="text-gray-400 text-sm">{completedMilestones} of {totalMilestones} milestones complete</p>
            </div>
            <div className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              {Math.round(overallProgress)}%
            </div>
          </div>
          <div className="h-3 bg-gray-800 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${overallProgress}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="h-full bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500"
            />
          </div>
        </div>

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

        <div className="mt-12 p-6 rounded-2xl bg-gradient-to-br from-gray-900/50 to-black/50 border border-white/10 text-center">
          <h3 className="text-lg font-semibold text-white mb-2">The Sentient Mirror</h3>
          <p className="text-gray-400 text-sm max-w-xl mx-auto">
            Your character's emotions mirror your emotions. Their struggles reflect your inner landscape. 
            This isn't just a game—it's self-discovery through interactive narrative.
          </p>
          <Link href="/crowdfund" className="inline-flex items-center gap-2 mt-4 px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-medium hover:opacity-90 transition-opacity" data-testid="link-support-development">
            <Zap className="w-4 h-4" />
            Support Development
          </Link>
        </div>
      </div>
    </div>
  );
}
