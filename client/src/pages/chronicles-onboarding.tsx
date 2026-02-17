import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { 
  ChevronRight, ChevronLeft, Sparkles, Shield, Brain,
  Heart, Compass, Eye, Crown, Check, Loader2, MessageCircle, Users,
  Fingerprint, Music, Headphones, VolumeX,
  Swords, BookOpen, Globe, Flame, Star, Gem, Zap, Target
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { GlassCard } from "@/components/glass-card";
import { getChroniclesSession } from "@/pages/chronicles-login";
import { CharacterPortraitPreview } from "@/components/character-portrait";

type OnboardingStep = 
  | "welcome"
  | "name"
  | "identity"
  | "values"
  | "instincts"
  | "pressure"
  | "audio"
  | "presence"
  | "complete";

interface PersonalityAnswers {
  chroniclesName: string;
  primaryTrait: string;
  secondaryTrait: string;
  coreValues: string[];
  decisionStyle: string;
  conflictApproach: string;
  challengeResponse: string;
  colorPreference: string;
  eraInterest: string;
  audioPreference: string;
  audioMood: string;
}

const STEPS: OnboardingStep[] = [
  "welcome", "name", "identity", "values", "instincts", "pressure", "audio", "presence", "complete"
];

const IDENTITY_ASPECTS = [
  { id: "leader", label: "Taking Charge", desc: "You naturally step up and people follow", icon: Crown, gradient: "from-amber-500/20 to-orange-500/20", border: "border-amber-500/40", glow: "shadow-amber-500/20" },
  { id: "builder", label: "Creating Things", desc: "You build, fix, and make things better", icon: Target, gradient: "from-emerald-500/20 to-teal-500/20", border: "border-emerald-500/40", glow: "shadow-emerald-500/20" },
  { id: "explorer", label: "Seeking the Unknown", desc: "You're drawn to new places and ideas", icon: Compass, gradient: "from-cyan-500/20 to-blue-500/20", border: "border-cyan-500/40", glow: "shadow-cyan-500/20" },
  { id: "diplomat", label: "Connecting People", desc: "You bring people together and ease tensions", icon: Heart, gradient: "from-pink-500/20 to-rose-500/20", border: "border-pink-500/40", glow: "shadow-pink-500/20" },
  { id: "scholar", label: "Understanding Deeply", desc: "You dig into things until you truly get them", icon: Brain, gradient: "from-purple-500/20 to-violet-500/20", border: "border-purple-500/40", glow: "shadow-purple-500/20" },
  { id: "protector", label: "Standing Guard", desc: "You protect people who can't protect themselves", icon: Shield, gradient: "from-blue-500/20 to-indigo-500/20", border: "border-blue-500/40", glow: "shadow-blue-500/20" },
];

const VALUES = [
  { id: "justice", label: "Justice", desc: "Fairness matters above all", icon: Swords },
  { id: "freedom", label: "Freedom", desc: "Nobody should control your path", icon: Globe },
  { id: "loyalty", label: "Loyalty", desc: "You stand by your people", icon: Shield },
  { id: "knowledge", label: "Knowledge", desc: "Understanding drives you", icon: BookOpen },
  { id: "compassion", label: "Compassion", desc: "Others' pain is yours too", icon: Heart },
  { id: "achievement", label: "Achievement", desc: "You need to accomplish things", icon: Star },
  { id: "creativity", label: "Creativity", desc: "Making something from nothing", icon: Sparkles },
  { id: "integrity", label: "Integrity", desc: "Your word is everything", icon: Gem },
];

const INSTINCT_STYLES = [
  { id: "analytical", label: "Think It Through", desc: "You slow down, weigh every angle, then move with certainty", icon: Brain, color: "text-cyan-400" },
  { id: "intuitive", label: "Trust Your Gut", desc: "Something inside you just knows — and it's usually right", icon: Zap, color: "text-yellow-400" },
  { id: "balanced", label: "Read the Room", desc: "You blend instinct with logic depending on the situation", icon: Eye, color: "text-purple-400" },
  { id: "collaborative", label: "Ask Around", desc: "Other perspectives make your decisions sharper", icon: Users, color: "text-emerald-400" },
];

const PRESSURE_RESPONSES = [
  { id: "diplomatic", label: "Talk It Out", desc: "You find the words that unlock understanding", icon: MessageCircle, color: "text-cyan-400" },
  { id: "strategic", label: "Outthink It", desc: "You develop a plan that turns the tables", icon: Brain, color: "text-purple-400" },
  { id: "direct", label: "Face It Head-On", desc: "You don't flinch — you address it directly", icon: Flame, color: "text-orange-400" },
  { id: "adaptive", label: "Stay Fluid", desc: "You bend without breaking, adjusting as things shift", icon: Compass, color: "text-emerald-400" },
];

const RESILIENCE_STYLES = [
  { id: "persevere", label: "Push Through", desc: "You don't stop until you succeed" },
  { id: "adapt", label: "Find a Way Around", desc: "There's always another door" },
  { id: "collaborate", label: "Rally the Team", desc: "You're stronger with others" },
  { id: "reflect", label: "Step Back, Then Strike", desc: "Patience is your superpower" },
];

const AUDIO_PREFERENCES = [
  { id: "curated", label: "Atmospheric Soundtrack", desc: "Music that matches every moment of your journey", icon: Headphones },
  { id: "spotify", label: "My Own Music", desc: "Connect Spotify and bring your own vibe", icon: Music },
  { id: "silent", label: "Ambient Only", desc: "Just wind, rain, and crackling fires", icon: VolumeX },
];

const AUDIO_MOODS = [
  { id: "epic", label: "Epic & Cinematic", desc: "Orchestral scores, heroic swells" },
  { id: "calm", label: "Calm & Ambient", desc: "Peaceful, meditative soundscapes" },
  { id: "medieval", label: "Medieval & Folk", desc: "Lutes, harps, tavern warmth" },
  { id: "electronic", label: "Electronic & Synth", desc: "Modern beats with fantasy edge" },
  { id: "nature", label: "Nature Sounds", desc: "Forests, rain, distant thunder" },
];

const COLORS = [
  { id: "blue", label: "Blue", hex: "#3b82f6", meaning: "Calm & Steady" },
  { id: "green", label: "Green", hex: "#22c55e", meaning: "Growth & Balance" },
  { id: "purple", label: "Purple", hex: "#a855f7", meaning: "Creative & Unique" },
  { id: "gold", label: "Gold", hex: "#eab308", meaning: "Ambitious & Bold" },
  { id: "red", label: "Red", hex: "#ef4444", meaning: "Passionate & Fierce" },
  { id: "silver", label: "Silver", hex: "#94a3b8", meaning: "Wise & Measured" },
];

const staggerChildren = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
};
const fadeUpChild = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export default function ChroniclesOnboarding() {
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();
  const [authLoading, setAuthLoading] = useState(true);
  const [chroniclesAccount, setChroniclesAccount] = useState<{ id: string; username: string; firstName: string; lastName: string } | null>(null);
  
  useEffect(() => {
    const session = getChroniclesSession();
    if (!session) {
      setLocation("/chronicles/login");
      return;
    }
    fetch("/api/chronicles/auth/session", {
      headers: { Authorization: `Bearer ${session.token}` }
    })
      .then(res => res.json())
      .then(data => {
        if (data.authenticated) {
          setChroniclesAccount(data.account);
        } else {
          setLocation("/chronicles/login");
        }
        setAuthLoading(false);
      })
      .catch(() => {
        setLocation("/chronicles/login");
        setAuthLoading(false);
      });
  }, [setLocation]);
  
  const [currentStep, setCurrentStep] = useState<OnboardingStep>("welcome");
  const [answers, setAnswers] = useState<PersonalityAnswers>({
    chroniclesName: "",
    primaryTrait: "",
    secondaryTrait: "",
    coreValues: [],
    decisionStyle: "",
    conflictApproach: "",
    challengeResponse: "",
    colorPreference: "",
    eraInterest: "modern",
    audioPreference: "curated",
    audioMood: "",
  });

  const stepIndex = STEPS.indexOf(currentStep);
  const progress = ((stepIndex) / (STEPS.length - 1)) * 100;

  const savePersonalityMutation = useMutation({
    mutationFn: async (data: PersonalityAnswers) => {
      const session = getChroniclesSession();
      const headers = { 
        "Content-Type": "application/json",
        Authorization: `Bearer ${session?.token}` 
      };
      
      const personalityRes = await fetch("/api/chronicles/personality", {
        method: "POST",
        headers,
        body: JSON.stringify({
          playerName: chroniclesAccount?.firstName || "Traveler",
          parallelSelfName: data.chroniclesName,
          coreValues: data.coreValues,
          decisionStyle: data.decisionStyle,
          conflictApproach: data.conflictApproach,
          predictedArchetype: data.primaryTrait,
          worldview: "realist",
          colorPreference: data.colorPreference,
          eraInterest: data.eraInterest,
          primaryTrait: data.primaryTrait,
          secondaryTrait: data.secondaryTrait,
          challengeResponse: data.challengeResponse,
          audioPreference: data.audioPreference,
          audioMood: data.audioMood,
        })
      });
      const personalityResult = await personalityRes.json();

      const startingEra = data.eraInterest || "modern";
      const characterRes = await fetch("/api/chronicles/character", {
        method: "POST",
        headers,
        body: JSON.stringify({
          name: data.chroniclesName || chroniclesAccount?.firstName || "Traveler",
          primaryTrait: data.primaryTrait,
          secondaryTrait: data.secondaryTrait,
          era: startingEra,
        })
      });
      const characterResult = await characterRes.json();

      return { personality: personalityResult, character: characterResult };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/chronicles/personality"] });
      queryClient.invalidateQueries({ queryKey: ["/api/chronicles/character"] });
      setCurrentStep("complete");
    },
  });

  const nextStep = () => {
    const idx = STEPS.indexOf(currentStep);
    if (idx < STEPS.length - 1) {
      if (currentStep === "presence") {
        savePersonalityMutation.mutate(answers);
      } else {
        setCurrentStep(STEPS[idx + 1]);
      }
    }
  };

  const prevStep = () => {
    const idx = STEPS.indexOf(currentStep);
    if (idx > 0) {
      setCurrentStep(STEPS[idx - 1]);
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case "welcome": return true;
      case "name": return answers.chroniclesName.trim().length >= 2;
      case "identity": return answers.primaryTrait && answers.secondaryTrait;
      case "values": return answers.coreValues.length >= 2;
      case "instincts": return answers.decisionStyle !== "";
      case "pressure": return answers.conflictApproach && answers.challengeResponse;
      case "audio": return answers.audioPreference !== "" && (answers.audioPreference === "silent" || answers.audioMood !== "");
      case "presence": return !!answers.colorPreference;
      default: return false;
    }
  };

  const toggleValue = (value: string) => {
    setAnswers(prev => ({
      ...prev,
      coreValues: prev.coreValues.includes(value)
        ? prev.coreValues.filter(v => v !== value)
        : prev.coreValues.length < 4 ? [...prev.coreValues, value] : prev.coreValues
    }));
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        >
          <Fingerprint className="w-10 h-10 text-cyan-400" />
        </motion.div>
      </div>
    );
  }

  if (!chroniclesAccount) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
        <GlassCard glow className="max-w-md w-full p-8 text-center">
          <Fingerprint className="w-16 h-16 mx-auto text-cyan-400 mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Sign In Required</h2>
          <p className="text-slate-400 mb-6">Create an account to begin your Chronicles journey</p>
          <Button
            data-testid="button-sign-in"
            onClick={() => setLocation("/chronicles/login")}
            className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-400 hover:to-purple-400"
          >
            Sign In or Create Account
          </Button>
        </GlassCard>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-900/80 to-slate-950" />
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-20 left-1/4 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[100px]"
        />
        <motion.div
          animate={{ scale: [1.2, 1, 1.2], opacity: [0.1, 0.15, 0.1] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-20 right-1/4 w-[400px] h-[400px] bg-purple-500/10 rounded-full blur-[100px]"
        />
        <motion.div
          animate={{ scale: [1, 1.3, 1], opacity: [0.05, 0.1, 0.05] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-pink-500/5 rounded-full blur-[120px]"
        />
      </div>

      <div className="relative z-10 min-h-screen flex flex-col">
        {currentStep !== "welcome" && currentStep !== "complete" && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 md:p-6"
          >
            <div className="max-w-2xl mx-auto">
              <div className="flex items-center justify-between mb-3">
                <Badge variant="outline" className="border-cyan-500/30 text-cyan-400 bg-cyan-500/5 backdrop-blur-sm">
                  <Sparkles className="w-3 h-3 mr-1" />
                  Self-Discovery
                </Badge>
                <span className="text-sm text-slate-500 font-mono">
                  {stepIndex}/{STEPS.length - 1}
                </span>
              </div>
              <div className="relative h-1.5 bg-slate-800/80 rounded-full overflow-hidden backdrop-blur-sm">
                <motion.div
                  className="absolute inset-y-0 left-0 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                />
                <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent rounded-full" />
              </div>
            </div>
          </motion.div>
        )}

        <div className="flex-1 flex items-center justify-center p-4 md:p-6">
          <div className="max-w-2xl w-full">
            <AnimatePresence mode="wait">

              {currentStep === "welcome" && (
                <motion.div
                  key="welcome"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.5 }}
                  className="text-center"
                >
                  <motion.div
                    className="w-28 h-28 mx-auto mb-8 relative"
                    animate={{ rotate: [0, 5, -5, 0] }}
                    transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <div className="absolute inset-0 rounded-full bg-gradient-to-br from-cyan-500 to-purple-500 blur-xl opacity-40" />
                    <div className="relative w-full h-full rounded-full bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center shadow-2xl shadow-cyan-500/20">
                      <Fingerprint className="w-14 h-14 text-white" />
                    </div>
                  </motion.div>

                  <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-4xl md:text-5xl font-bold mb-4"
                  >
                    <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                      This Is You
                    </span>
                  </motion.h1>

                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-lg text-slate-300 mb-3 max-w-lg mx-auto"
                  >
                    Chronicles isn't a game where you become someone else.
                  </motion.p>

                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="text-slate-400 mb-8 max-w-md mx-auto leading-relaxed"
                  >
                    It's a world where <span className="text-white font-medium">you are you</span> — living parallel lives across different eras. 
                    Answer honestly. There are no wrong answers, only <span className="text-cyan-400">your</span> answers.
                  </motion.p>

                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="flex flex-wrap justify-center gap-3 mb-8"
                  >
                    <Badge className="bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 px-3 py-1">
                      Not an RPG
                    </Badge>
                    <Badge className="bg-purple-500/10 text-purple-400 border border-purple-500/20 px-3 py-1">
                      Your Real Self
                    </Badge>
                    <Badge className="bg-amber-500/10 text-amber-400 border border-amber-500/20 px-3 py-1">
                      Season Zero
                    </Badge>
                  </motion.div>
                </motion.div>
              )}

              {currentStep === "name" && (
                <motion.div
                  key="name"
                  initial={{ opacity: 0, x: 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -40 }}
                  transition={{ duration: 0.4 }}
                >
                  <div className="text-center mb-8">
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
                      What's Your Name?
                    </h2>
                    <p className="text-slate-400 max-w-md mx-auto">
                      Not a character name. Not a gamertag. This is how the world will know <span className="text-cyan-400">you</span>.
                    </p>
                  </div>
                  <GlassCard glow className="max-w-md mx-auto p-6 sm:p-8">
                    <label className="block text-sm text-cyan-400 mb-2 font-medium">Your name in Chronicles</label>
                    <Input
                      data-testid="input-chronicles-name"
                      value={answers.chroniclesName}
                      onChange={(e) => setAnswers(prev => ({ ...prev, chroniclesName: e.target.value }))}
                      placeholder="Enter your name..."
                      className="bg-slate-800/80 border-slate-600/50 text-white text-lg h-12 focus:border-cyan-500/50 focus:ring-cyan-500/20"
                      maxLength={30}
                    />
                    <p className="text-xs text-slate-500 mt-3">
                      Use your real name, a nickname, whatever feels like <span className="text-slate-400">you</span>.
                    </p>
                  </GlassCard>
                </motion.div>
              )}

              {currentStep === "identity" && (
                <motion.div
                  key="identity"
                  initial={{ opacity: 0, x: 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -40 }}
                  transition={{ duration: 0.4 }}
                >
                  <div className="text-center mb-6">
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
                      What Comes Naturally?
                    </h2>
                    <p className="text-slate-400 max-w-lg mx-auto">
                      Don't think about who you <em>want</em> to be. Think about what you <em>actually</em> do when nobody's watching.
                    </p>
                  </div>
                  
                  <div className="mb-8">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="h-px flex-1 bg-gradient-to-r from-transparent to-cyan-500/30" />
                      <span className="text-xs text-cyan-400 font-medium uppercase tracking-wider">Your strongest instinct</span>
                      <div className="h-px flex-1 bg-gradient-to-l from-transparent to-cyan-500/30" />
                    </div>
                    <motion.div
                      variants={staggerChildren}
                      initial="hidden"
                      animate="visible"
                      className="grid grid-cols-2 md:grid-cols-3 gap-3"
                    >
                      {IDENTITY_ASPECTS.map((aspect) => {
                        const Icon = aspect.icon;
                        const isSelected = answers.primaryTrait === aspect.id;
                        return (
                          <motion.div key={aspect.id} variants={fadeUpChild}>
                            <GlassCard
                              hover
                              glow={isSelected}
                              className={`cursor-pointer transition-all duration-300 ${
                                isSelected ? aspect.border : "border-transparent"
                              }`}
                            >
                              <div
                                data-testid={`trait-primary-${aspect.id}`}
                                onClick={() => setAnswers(prev => ({ 
                                  ...prev, 
                                  primaryTrait: aspect.id,
                                  secondaryTrait: prev.secondaryTrait === aspect.id ? "" : prev.secondaryTrait
                                }))}
                                className={`p-4 relative ${isSelected ? `bg-gradient-to-br ${aspect.gradient}` : ""}`}
                              >
                                {isSelected && (
                                  <motion.div
                                    layoutId="primary-check"
                                    className="absolute top-2 right-2"
                                  >
                                    <Check className="w-4 h-4 text-cyan-400" />
                                  </motion.div>
                                )}
                                <Icon className={`w-7 h-7 mb-3 ${isSelected ? "text-white" : "text-slate-500"}`} />
                                <h3 className={`font-semibold text-sm mb-1 ${isSelected ? "text-white" : "text-slate-300"}`}>{aspect.label}</h3>
                                <p className="text-xs text-slate-500 leading-snug">{aspect.desc}</p>
                              </div>
                            </GlassCard>
                          </motion.div>
                        );
                      })}
                    </motion.div>
                  </div>

                  {answers.primaryTrait && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <div className="flex items-center gap-2 mb-4">
                        <div className="h-px flex-1 bg-gradient-to-r from-transparent to-purple-500/30" />
                        <span className="text-xs text-purple-400 font-medium uppercase tracking-wider">What else defines you?</span>
                        <div className="h-px flex-1 bg-gradient-to-l from-transparent to-purple-500/30" />
                      </div>
                      <motion.div
                        variants={staggerChildren}
                        initial="hidden"
                        animate="visible"
                        className="grid grid-cols-2 md:grid-cols-3 gap-3"
                      >
                        {IDENTITY_ASPECTS.filter(a => a.id !== answers.primaryTrait).map((aspect) => {
                          const Icon = aspect.icon;
                          const isSelected = answers.secondaryTrait === aspect.id;
                          return (
                            <motion.div key={aspect.id} variants={fadeUpChild}>
                              <GlassCard
                                hover
                                glow={isSelected}
                                className={`cursor-pointer transition-all duration-300 ${
                                  isSelected ? "border-purple-500/40" : "border-transparent"
                                }`}
                              >
                                <div
                                  data-testid={`trait-secondary-${aspect.id}`}
                                  onClick={() => setAnswers(prev => ({ ...prev, secondaryTrait: aspect.id }))}
                                  className={`p-4 relative ${isSelected ? "bg-gradient-to-br from-purple-500/20 to-pink-500/20" : ""}`}
                                >
                                  {isSelected && (
                                    <motion.div
                                      layoutId="secondary-check"
                                      className="absolute top-2 right-2"
                                    >
                                      <Check className="w-4 h-4 text-purple-400" />
                                    </motion.div>
                                  )}
                                  <Icon className={`w-6 h-6 mb-2 ${isSelected ? "text-purple-300" : "text-slate-500"}`} />
                                  <h3 className={`font-semibold text-sm ${isSelected ? "text-white" : "text-slate-300"}`}>{aspect.label}</h3>
                                  <p className="text-xs text-slate-500">{aspect.desc}</p>
                                </div>
                              </GlassCard>
                            </motion.div>
                          );
                        })}
                      </motion.div>
                    </motion.div>
                  )}
                </motion.div>
              )}

              {currentStep === "values" && (
                <motion.div
                  key="values"
                  initial={{ opacity: 0, x: 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -40 }}
                  transition={{ duration: 0.4 }}
                >
                  <div className="text-center mb-6">
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
                      What Do You Stand For?
                    </h2>
                    <p className="text-slate-400 max-w-lg mx-auto">
                      Pick 2-4 values that guide your decisions in real life. 
                      The world will test these — and remember.
                    </p>
                  </div>
                  <motion.div
                    variants={staggerChildren}
                    initial="hidden"
                    animate="visible"
                    className="grid grid-cols-2 md:grid-cols-4 gap-3"
                  >
                    {VALUES.map((value) => {
                      const Icon = value.icon;
                      const isSelected = answers.coreValues.includes(value.id);
                      return (
                        <motion.div key={value.id} variants={fadeUpChild}>
                          <GlassCard
                            hover
                            glow={isSelected}
                            className={`cursor-pointer transition-all duration-300 ${
                              isSelected ? "border-cyan-500/40" : "border-transparent"
                            }`}
                          >
                            <div
                              data-testid={`value-${value.id}`}
                              onClick={() => toggleValue(value.id)}
                              className={`p-4 text-center relative ${
                                isSelected ? "bg-gradient-to-br from-cyan-500/15 to-purple-500/15" : ""
                              }`}
                            >
                              {isSelected && (
                                <div className="absolute top-2 right-2">
                                  <Check className="w-3.5 h-3.5 text-cyan-400" />
                                </div>
                              )}
                              <Icon className={`w-6 h-6 mx-auto mb-2 ${isSelected ? "text-cyan-400" : "text-slate-500"}`} />
                              <h3 className={`font-semibold text-sm ${isSelected ? "text-white" : "text-slate-300"}`}>{value.label}</h3>
                              <p className="text-[11px] text-slate-500 mt-1">{value.desc}</p>
                            </div>
                          </GlassCard>
                        </motion.div>
                      );
                    })}
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="text-center mt-5"
                  >
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-800/50 border border-slate-700/50">
                      <span className="text-sm text-slate-400">Selected:</span>
                      <span className={`text-sm font-semibold ${answers.coreValues.length >= 2 ? "text-cyan-400" : "text-slate-500"}`}>
                        {answers.coreValues.length}/4
                      </span>
                      {answers.coreValues.length >= 2 && <Check className="w-3.5 h-3.5 text-emerald-400" />}
                    </div>
                  </motion.div>
                </motion.div>
              )}

              {currentStep === "instincts" && (
                <motion.div
                  key="instincts"
                  initial={{ opacity: 0, x: 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -40 }}
                  transition={{ duration: 0.4 }}
                >
                  <div className="text-center mb-6">
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
                      How Do You Decide?
                    </h2>
                    <p className="text-slate-400 max-w-lg mx-auto">
                      A crossroads. Two paths. No map. What does your mind do first?
                    </p>
                  </div>
                  <motion.div
                    variants={staggerChildren}
                    initial="hidden"
                    animate="visible"
                    className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-xl mx-auto"
                  >
                    {INSTINCT_STYLES.map((style) => {
                      const Icon = style.icon;
                      const isSelected = answers.decisionStyle === style.id;
                      return (
                        <motion.div key={style.id} variants={fadeUpChild}>
                          <GlassCard
                            hover
                            glow={isSelected}
                            className={`cursor-pointer transition-all duration-300 ${
                              isSelected ? "border-cyan-500/40" : "border-transparent"
                            }`}
                          >
                            <div
                              data-testid={`decision-${style.id}`}
                              onClick={() => setAnswers(prev => ({ ...prev, decisionStyle: style.id }))}
                              className={`p-5 flex items-start gap-4 ${isSelected ? "bg-gradient-to-br from-cyan-500/10 to-purple-500/10" : ""}`}
                            >
                              <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                                isSelected ? "bg-cyan-500/20" : "bg-slate-800/80"
                              }`}>
                                <Icon className={`w-5 h-5 ${isSelected ? style.color : "text-slate-500"}`} />
                              </div>
                              <div>
                                <h3 className={`font-semibold ${isSelected ? "text-white" : "text-slate-300"}`}>{style.label}</h3>
                                <p className="text-sm text-slate-500 mt-1">{style.desc}</p>
                              </div>
                            </div>
                          </GlassCard>
                        </motion.div>
                      );
                    })}
                  </motion.div>
                </motion.div>
              )}

              {currentStep === "pressure" && (
                <motion.div
                  key="pressure"
                  initial={{ opacity: 0, x: 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -40 }}
                  transition={{ duration: 0.4 }}
                >
                  <div className="text-center mb-6">
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
                      Under Pressure
                    </h2>
                    <p className="text-slate-400 max-w-lg mx-auto">
                      Life gets hard. People disagree. Things break. How do you handle it — really?
                    </p>
                  </div>
                  
                  <div className="mb-8">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="h-px flex-1 bg-gradient-to-r from-transparent to-cyan-500/30" />
                      <span className="text-xs text-cyan-400 font-medium uppercase tracking-wider">When conflict finds you</span>
                      <div className="h-px flex-1 bg-gradient-to-l from-transparent to-cyan-500/30" />
                    </div>
                    <motion.div
                      variants={staggerChildren}
                      initial="hidden"
                      animate="visible"
                      className="grid grid-cols-1 md:grid-cols-2 gap-3"
                    >
                      {PRESSURE_RESPONSES.map((approach) => {
                        const Icon = approach.icon;
                        const isSelected = answers.conflictApproach === approach.id;
                        return (
                          <motion.div key={approach.id} variants={fadeUpChild}>
                            <GlassCard
                              hover
                              glow={isSelected}
                              className={`cursor-pointer transition-all duration-300 ${
                                isSelected ? "border-cyan-500/40" : "border-transparent"
                              }`}
                            >
                              <div
                                data-testid={`conflict-${approach.id}`}
                                onClick={() => setAnswers(prev => ({ ...prev, conflictApproach: approach.id }))}
                                className={`p-4 flex items-start gap-3 ${isSelected ? "bg-gradient-to-br from-cyan-500/10 to-blue-500/10" : ""}`}
                              >
                                <Icon className={`w-5 h-5 mt-0.5 flex-shrink-0 ${isSelected ? approach.color : "text-slate-500"}`} />
                                <div>
                                  <h3 className={`font-semibold text-sm ${isSelected ? "text-white" : "text-slate-300"}`}>{approach.label}</h3>
                                  <p className="text-xs text-slate-500 mt-1">{approach.desc}</p>
                                </div>
                              </div>
                            </GlassCard>
                          </motion.div>
                        );
                      })}
                    </motion.div>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <div className="h-px flex-1 bg-gradient-to-r from-transparent to-purple-500/30" />
                      <span className="text-xs text-purple-400 font-medium uppercase tracking-wider">When things fall apart</span>
                      <div className="h-px flex-1 bg-gradient-to-l from-transparent to-purple-500/30" />
                    </div>
                    <motion.div
                      variants={staggerChildren}
                      initial="hidden"
                      animate="visible"
                      className="grid grid-cols-1 md:grid-cols-2 gap-3"
                    >
                      {RESILIENCE_STYLES.map((response) => {
                        const isSelected = answers.challengeResponse === response.id;
                        return (
                          <motion.div key={response.id} variants={fadeUpChild}>
                            <GlassCard
                              hover
                              glow={isSelected}
                              className={`cursor-pointer transition-all duration-300 ${
                                isSelected ? "border-purple-500/40" : "border-transparent"
                              }`}
                            >
                              <div
                                data-testid={`challenge-${response.id}`}
                                onClick={() => setAnswers(prev => ({ ...prev, challengeResponse: response.id }))}
                                className={`p-4 ${isSelected ? "bg-gradient-to-br from-purple-500/10 to-pink-500/10" : ""}`}
                              >
                                <h3 className={`font-semibold text-sm ${isSelected ? "text-white" : "text-slate-300"}`}>{response.label}</h3>
                                <p className="text-xs text-slate-500 mt-1">{response.desc}</p>
                              </div>
                            </GlassCard>
                          </motion.div>
                        );
                      })}
                    </motion.div>
                  </div>
                </motion.div>
              )}

              {currentStep === "audio" && (
                <motion.div
                  key="audio"
                  initial={{ opacity: 0, x: 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -40 }}
                  transition={{ duration: 0.4 }}
                >
                  <div className="text-center mb-6">
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
                      Your Soundtrack
                    </h2>
                    <p className="text-slate-400 max-w-md mx-auto">
                      Every life has a soundtrack. What's yours?
                    </p>
                  </div>
                  
                  <div className="mb-6">
                    <motion.div
                      variants={staggerChildren}
                      initial="hidden"
                      animate="visible"
                      className="space-y-3 max-w-xl mx-auto"
                    >
                      {AUDIO_PREFERENCES.map((pref) => {
                        const Icon = pref.icon;
                        const isSelected = answers.audioPreference === pref.id;
                        return (
                          <motion.div key={pref.id} variants={fadeUpChild}>
                            <GlassCard
                              hover
                              glow={isSelected}
                              className={`cursor-pointer transition-all duration-300 ${
                                isSelected ? "border-cyan-500/40" : "border-transparent"
                              }`}
                            >
                              <div
                                data-testid={`audio-pref-${pref.id}`}
                                onClick={() => setAnswers(prev => ({ 
                                  ...prev, 
                                  audioPreference: pref.id,
                                  audioMood: pref.id === "silent" ? "" : prev.audioMood 
                                }))}
                                className={`p-4 flex items-center gap-4 ${isSelected ? "bg-gradient-to-r from-cyan-500/10 to-purple-500/10" : ""}`}
                              >
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                                  isSelected ? "bg-cyan-500/20" : "bg-slate-800/80"
                                }`}>
                                  <Icon className={`w-6 h-6 ${isSelected ? "text-cyan-400" : "text-slate-500"}`} />
                                </div>
                                <div>
                                  <h3 className={`font-semibold ${isSelected ? "text-white" : "text-slate-300"}`}>{pref.label}</h3>
                                  <p className="text-sm text-slate-500">{pref.desc}</p>
                                </div>
                                {isSelected && <Check className="w-5 h-5 text-cyan-400 ml-auto flex-shrink-0" />}
                              </div>
                            </GlassCard>
                          </motion.div>
                        );
                      })}
                    </motion.div>
                  </div>

                  <AnimatePresence>
                    {answers.audioPreference !== "silent" && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className="flex items-center gap-2 mb-4">
                          <div className="h-px flex-1 bg-gradient-to-r from-transparent to-purple-500/30" />
                          <span className="text-xs text-purple-400 font-medium uppercase tracking-wider">Mood</span>
                          <div className="h-px flex-1 bg-gradient-to-l from-transparent to-purple-500/30" />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-xl mx-auto">
                          {AUDIO_MOODS.map((mood) => {
                            const isSelected = answers.audioMood === mood.id;
                            return (
                              <GlassCard
                                key={mood.id}
                                hover
                                glow={isSelected}
                                className={`cursor-pointer transition-all ${isSelected ? "border-purple-500/40" : "border-transparent"}`}
                              >
                                <div
                                  data-testid={`audio-mood-${mood.id}`}
                                  onClick={() => setAnswers(prev => ({ ...prev, audioMood: mood.id }))}
                                  className={`p-3 ${isSelected ? "bg-gradient-to-br from-purple-500/10 to-pink-500/10" : ""}`}
                                >
                                  <h3 className={`font-semibold text-sm ${isSelected ? "text-white" : "text-slate-300"}`}>{mood.label}</h3>
                                  <p className="text-xs text-slate-500 mt-1">{mood.desc}</p>
                                </div>
                              </GlassCard>
                            );
                          })}
                        </div>

                        {answers.audioPreference === "spotify" && (
                          <p className="text-center text-slate-500 text-sm mt-4">
                            You can connect Spotify later in settings
                          </p>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              )}

              {currentStep === "presence" && (
                <motion.div
                  key="presence"
                  initial={{ opacity: 0, x: 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -40 }}
                  transition={{ duration: 0.4 }}
                >
                  <div className="text-center mb-6">
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
                      Your Presence
                    </h2>
                    <p className="text-slate-400 max-w-md mx-auto">
                      A color that represents you. People will recognize your mark by it.
                    </p>
                  </div>
                  
                  {answers.primaryTrait && answers.secondaryTrait && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="flex justify-center mb-8"
                    >
                      <CharacterPortraitPreview
                        primaryTrait={answers.primaryTrait}
                        secondaryTrait={answers.secondaryTrait}
                        colorPreference={answers.colorPreference || "cyan"}
                      />
                    </motion.div>
                  )}
                  
                  <div className="mb-8">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="h-px flex-1 bg-gradient-to-r from-transparent to-cyan-500/30" />
                      <span className="text-xs text-cyan-400 font-medium uppercase tracking-wider">Signature Color</span>
                      <div className="h-px flex-1 bg-gradient-to-l from-transparent to-cyan-500/30" />
                    </div>
                    <div className="flex flex-wrap justify-center gap-4">
                      {COLORS.map((color) => {
                        const isSelected = answers.colorPreference === color.id;
                        return (
                          <motion.div
                            key={color.id}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            data-testid={`color-${color.id}`}
                            onClick={() => setAnswers(prev => ({ ...prev, colorPreference: color.id }))}
                            className="cursor-pointer text-center"
                          >
                            <div className="relative">
                              {isSelected && (
                                <motion.div
                                  layoutId="color-glow"
                                  className="absolute -inset-2 rounded-full blur-md"
                                  style={{ backgroundColor: `${color.hex}40` }}
                                />
                              )}
                              <div
                                className={`relative w-14 h-14 rounded-full border-[3px] transition-all ${
                                  isSelected ? "border-white scale-110" : "border-slate-700 hover:border-slate-500"
                                }`}
                                style={{ backgroundColor: color.hex }}
                              />
                            </div>
                            <p className={`text-xs mt-2 ${isSelected ? "text-white font-medium" : "text-slate-500"}`}>{color.label}</p>
                            {isSelected && (
                              <p className="text-[10px] text-slate-400">{color.meaning}</p>
                            )}
                          </motion.div>
                        );
                      })}
                    </div>
                  </div>

                  <GlassCard glow className="max-w-lg mx-auto p-5">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500/20 to-purple-500/20 flex items-center justify-center">
                        <Compass className="w-5 h-5 text-cyan-400" />
                      </div>
                      <div>
                        <h3 className="font-bold text-white text-sm">Everyone Begins in the Modern Era</h3>
                        <p className="text-xs text-slate-500">Level up to unlock Medieval and Wild West</p>
                      </div>
                    </div>
                    <div className="flex gap-2 mt-3">
                      <Badge className="bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 text-xs">
                        Modern - Now
                      </Badge>
                      <Badge className="bg-slate-800/80 text-slate-500 border border-slate-700/50 text-xs">
                        Medieval - Lv.3
                      </Badge>
                      <Badge className="bg-slate-800/80 text-slate-500 border border-slate-700/50 text-xs">
                        Wild West - Lv.5
                      </Badge>
                    </div>
                  </GlassCard>
                </motion.div>
              )}

              {currentStep === "complete" && (
                <motion.div
                  key="complete"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                  className="text-center"
                >
                  <motion.div
                    className="w-28 h-28 mx-auto mb-8 relative"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring", stiffness: 200, damping: 15 }}
                  >
                    <div className="absolute inset-0 rounded-full bg-gradient-to-br from-emerald-500 to-cyan-500 blur-xl opacity-40" />
                    <div className="relative w-full h-full rounded-full bg-gradient-to-br from-emerald-500 to-cyan-600 flex items-center justify-center shadow-2xl shadow-emerald-500/30">
                      <Check className="w-14 h-14 text-white" />
                    </div>
                  </motion.div>

                  <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="text-4xl md:text-5xl font-bold mb-4"
                  >
                    <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                      {answers.chroniclesName}, You're Ready
                    </span>
                  </motion.h1>

                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="text-slate-400 mb-8 max-w-md mx-auto"
                  >
                    Your parallel self has been recorded. The world will respond to who you really are.
                  </motion.p>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                  >
                    <GlassCard glow className="max-w-md mx-auto p-6 mb-8">
                      <h3 className="text-lg font-semibold text-white mb-4">Your Identity</h3>
                      <div className="space-y-3 text-left">
                        <div className="flex justify-between items-center">
                          <span className="text-slate-500 text-sm">Name</span>
                          <span className="text-white font-medium">{answers.chroniclesName}</span>
                        </div>
                        <div className="h-px bg-slate-800" />
                        <div className="flex justify-between items-center">
                          <span className="text-slate-500 text-sm">Core Strength</span>
                          <span className="text-cyan-400 capitalize font-medium">
                            {IDENTITY_ASPECTS.find(a => a.id === answers.primaryTrait)?.label}
                          </span>
                        </div>
                        <div className="h-px bg-slate-800" />
                        <div className="flex justify-between items-center">
                          <span className="text-slate-500 text-sm">Secondary</span>
                          <span className="text-purple-400 capitalize font-medium">
                            {IDENTITY_ASPECTS.find(a => a.id === answers.secondaryTrait)?.label}
                          </span>
                        </div>
                        <div className="h-px bg-slate-800" />
                        <div className="flex justify-between items-center">
                          <span className="text-slate-500 text-sm">Values</span>
                          <span className="text-white capitalize text-sm">{answers.coreValues.join(", ")}</span>
                        </div>
                      </div>
                    </GlassCard>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                  >
                    <GlassCard className="max-w-md mx-auto p-5 mb-8 border-purple-500/20">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-purple-500/20 to-cyan-500/20 flex items-center justify-center">
                          <MessageCircle className="w-5 h-5 text-cyan-400" />
                        </div>
                        <div className="text-left">
                          <h4 className="font-semibold text-white text-sm">ChronoChat</h4>
                          <p className="text-xs text-slate-500">Connect with fellow travelers</p>
                        </div>
                      </div>
                      <Button
                        data-testid="button-chronolink"
                        onClick={() => setLocation("/chronochat")}
                        className="w-full bg-gradient-to-r from-purple-600/80 to-cyan-600/80 hover:from-purple-500 hover:to-cyan-500 border border-purple-500/20"
                      >
                        <Users className="w-4 h-4 mr-2" />
                        Enter ChronoChat
                      </Button>
                    </GlassCard>
                  </motion.div>
                  
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                    className="flex flex-col sm:flex-row gap-3 justify-center"
                  >
                    <Button
                      data-testid="button-explore-estate"
                      onClick={() => setLocation("/chronicles/hub")}
                      className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-400 hover:to-purple-400 shadow-lg shadow-cyan-500/20 h-12 px-8 text-base"
                    >
                      Enter Your World
                      <ChevronRight className="w-5 h-5 ml-2" />
                    </Button>
                    <Button
                      data-testid="button-back-home"
                      onClick={() => setLocation("/")}
                      variant="outline"
                      className="border-slate-700 hover:border-slate-500 h-12"
                    >
                      Return Home
                    </Button>
                  </motion.div>
                </motion.div>
              )}

            </AnimatePresence>
          </div>
        </div>

        {currentStep !== "complete" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 md:p-6"
          >
            <div className="max-w-2xl mx-auto flex justify-between items-center">
              <Button
                data-testid="button-prev"
                onClick={() => currentStep === "welcome" ? setLocation("/chronicles") : prevStep()}
                variant="ghost"
                className="text-slate-400 hover:text-white hover:bg-slate-800/50"
              >
                <ChevronLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <Button
                data-testid="button-next"
                onClick={nextStep}
                disabled={!canProceed() || savePersonalityMutation.isPending}
                className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-400 hover:to-purple-400 shadow-lg shadow-cyan-500/20 disabled:opacity-40 disabled:shadow-none h-11 px-6"
              >
                {savePersonalityMutation.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    Saving...
                  </>
                ) : currentStep === "presence" ? (
                  <>
                    Begin Your Life
                    <Sparkles className="w-4 h-4 ml-2" />
                  </>
                ) : (
                  <>
                    Continue
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
