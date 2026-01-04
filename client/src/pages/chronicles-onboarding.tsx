import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { 
  ChevronRight, ChevronLeft, User, Sparkles, Shield, Brain,
  Heart, Compass, Eye, Crown, Scroll, Check, Loader2, MessageCircle, Users
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useSimpleAuth } from "@/hooks/use-simple-auth";
import { apiRequest } from "@/lib/queryClient";
import { CharacterPortraitPreview } from "@/components/character-portrait";

type OnboardingStep = 
  | "welcome"
  | "name"
  | "traits"
  | "values"
  | "decisions"
  | "challenges"
  | "audio"
  | "portrait"
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
  "welcome", "name", "traits", "values", "decisions", "challenges", "audio", "portrait", "complete"
];

const AUDIO_PREFERENCES = [
  { id: "curated", label: "Curated Experience", desc: "Handpicked atmospheric music that matches your journey", icon: Sparkles },
  { id: "spotify", label: "My Spotify", desc: "Connect your Spotify to play your own playlists", icon: Heart },
  { id: "silent", label: "Silent Mode", desc: "No background music, just ambient sounds", icon: Eye },
];

const AUDIO_MOODS = [
  { id: "epic", label: "Epic & Cinematic", desc: "Orchestral scores and heroic themes" },
  { id: "calm", label: "Calm & Ambient", desc: "Peaceful, relaxing soundscapes" },
  { id: "medieval", label: "Medieval & Folk", desc: "Lutes, harps, and tavern tunes" },
  { id: "electronic", label: "Electronic & Synth", desc: "Modern beats with fantasy vibes" },
  { id: "nature", label: "Nature Sounds", desc: "Forests, rain, crackling fires" },
];

const TRAITS = [
  { id: "leader", label: "Leader", desc: "You take charge and inspire others", icon: Crown },
  { id: "builder", label: "Builder", desc: "You create lasting things with your hands and mind", icon: Shield },
  { id: "explorer", label: "Explorer", desc: "You seek new experiences and discoveries", icon: Compass },
  { id: "diplomat", label: "Diplomat", desc: "You bring people together and resolve conflicts", icon: Heart },
  { id: "scholar", label: "Scholar", desc: "You pursue knowledge and understanding", icon: Brain },
  { id: "protector", label: "Protector", desc: "You defend those who cannot defend themselves", icon: Shield },
];

const VALUES = [
  { id: "justice", label: "Justice", desc: "Fairness and doing what's right" },
  { id: "freedom", label: "Freedom", desc: "Independence and self-determination" },
  { id: "loyalty", label: "Loyalty", desc: "Dedication to people and causes" },
  { id: "knowledge", label: "Knowledge", desc: "Learning and understanding" },
  { id: "compassion", label: "Compassion", desc: "Caring for others' wellbeing" },
  { id: "achievement", label: "Achievement", desc: "Accomplishing meaningful goals" },
  { id: "creativity", label: "Creativity", desc: "Expressing ideas and making new things" },
  { id: "integrity", label: "Integrity", desc: "Honesty and strong principles" },
];

const DECISION_STYLES = [
  { id: "analytical", label: "Thoughtful & Careful", desc: "You weigh all options before deciding" },
  { id: "intuitive", label: "Trust Your Instincts", desc: "You follow your gut feeling" },
  { id: "balanced", label: "Balanced Approach", desc: "You mix logic and intuition" },
  { id: "collaborative", label: "Seek Input", desc: "You value others' perspectives" },
];

const CONFLICT_APPROACHES = [
  { id: "diplomatic", label: "Seek Understanding", desc: "Find common ground through dialogue" },
  { id: "strategic", label: "Plan & Execute", desc: "Develop a careful strategy to overcome" },
  { id: "direct", label: "Face It Head-On", desc: "Address challenges directly and honestly" },
  { id: "adaptive", label: "Stay Flexible", desc: "Adjust your approach as situations change" },
];

const CHALLENGE_RESPONSES = [
  { id: "persevere", label: "Never Give Up", desc: "Push through until you succeed" },
  { id: "adapt", label: "Find Another Way", desc: "Look for alternative solutions" },
  { id: "collaborate", label: "Seek Help", desc: "Work with others to overcome" },
  { id: "reflect", label: "Step Back & Think", desc: "Take time to understand before acting" },
];

const COLORS = [
  { id: "blue", label: "Blue", hex: "#3b82f6", meaning: "Calm & Trustworthy" },
  { id: "green", label: "Green", hex: "#22c55e", meaning: "Growth & Harmony" },
  { id: "purple", label: "Purple", hex: "#a855f7", meaning: "Creative & Unique" },
  { id: "gold", label: "Gold", hex: "#eab308", meaning: "Ambitious & Confident" },
  { id: "red", label: "Red", hex: "#ef4444", meaning: "Bold & Passionate" },
  { id: "silver", label: "Silver", hex: "#94a3b8", meaning: "Wise & Balanced" },
];

const ERAS = [
  { id: "ancient", label: "Ancient Civilizations", desc: "Egypt, Rome, Greece, Mesopotamia" },
  { id: "medieval", label: "Medieval Era", desc: "Knights, castles, and kingdoms" },
  { id: "renaissance", label: "Renaissance", desc: "Art, invention, and discovery" },
  { id: "exploration", label: "Age of Exploration", desc: "New worlds and adventures" },
  { id: "industrial", label: "Industrial Age", desc: "Innovation and progress" },
  { id: "modern", label: "Early Modern", desc: "The world taking shape" },
];

export default function ChroniclesOnboarding() {
  const { user, loading: authLoading } = useSimpleAuth();
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();
  
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
    eraInterest: "",
    audioPreference: "curated",
    audioMood: "",
  });

  const stepIndex = STEPS.indexOf(currentStep);
  const progress = ((stepIndex) / (STEPS.length - 1)) * 100;

  const savePersonalityMutation = useMutation({
    mutationFn: async (data: PersonalityAnswers) => {
      const res = await apiRequest("POST", "/api/chronicles/personality", {
        playerName: user?.displayName || user?.username || "Hero",
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
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/chronicles/personality"] });
      setCurrentStep("complete");
    },
  });

  const nextStep = () => {
    const idx = STEPS.indexOf(currentStep);
    if (idx < STEPS.length - 1) {
      if (currentStep === "portrait") {
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
      case "traits": return answers.primaryTrait && answers.secondaryTrait;
      case "values": return answers.coreValues.length >= 2;
      case "decisions": return answers.decisionStyle !== "";
      case "challenges": return answers.conflictApproach && answers.challengeResponse;
      case "audio": return answers.audioPreference !== "" && (answers.audioPreference === "silent" || answers.audioMood !== "");
      case "portrait": return answers.colorPreference && answers.eraInterest;
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
        <Loader2 className="w-8 h-8 animate-spin text-cyan-400" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
        <Card className="max-w-md w-full bg-slate-900/80 border-slate-700 p-8 text-center">
          <User className="w-16 h-16 mx-auto text-cyan-400 mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Sign In Required</h2>
          <p className="text-slate-400 mb-6">Create an account to begin your Chronicles journey</p>
          <Button onClick={() => setLocation("/login")} className="bg-gradient-to-r from-cyan-500 to-purple-500">
            Sign In or Create Account
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 relative overflow-hidden">
      {/* Ambient Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950" />
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />

      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Header */}
        <div className="p-4 md:p-6">
          <div className="max-w-2xl mx-auto">
            <div className="flex items-center justify-between mb-4">
              <Badge variant="outline" className="border-cyan-500/50 text-cyan-400">
                <Sparkles className="w-3 h-3 mr-1" />
                Season Zero
              </Badge>
              <span className="text-sm text-slate-400">
                Step {stepIndex + 1} of {STEPS.length}
              </span>
            </div>
            <Progress value={progress} className="h-2 bg-slate-800" />
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex items-center justify-center p-4 md:p-6">
          <div className="max-w-2xl w-full">
            <AnimatePresence mode="wait">
              {/* Welcome Step */}
              {currentStep === "welcome" && (
                <motion.div
                  key="welcome"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="text-center"
                >
                  <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-cyan-500 to-purple-500 flex items-center justify-center">
                    <Scroll className="w-12 h-12 text-white" />
                  </div>
                  <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
                    Welcome to Chronicles
                  </h1>
                  <p className="text-lg text-slate-300 mb-2">
                    Create Your Character
                  </p>
                  <p className="text-slate-400 mb-8 max-w-md mx-auto">
                    Answer a few questions to define who you are in the Chronicles universe. 
                    Your choices will shape your character's personality, strengths, and story.
                  </p>
                  <Badge variant="outline" className="border-amber-500/50 text-amber-400 mb-8">
                    Season Zero - Early Access Preview
                  </Badge>
                </motion.div>
              )}

              {/* Name Step */}
              {currentStep === "name" && (
                <motion.div
                  key="name"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <h2 className="text-2xl md:text-3xl font-bold text-white mb-2 text-center">
                    What Shall We Call You?
                  </h2>
                  <p className="text-slate-400 mb-8 text-center">
                    Choose a name for your Chronicles character
                  </p>
                  <Card className="bg-slate-900/80 border-slate-700 p-6 max-w-md mx-auto">
                    <label className="block text-sm text-slate-300 mb-2">Character Name</label>
                    <Input
                      data-testid="input-chronicles-name"
                      value={answers.chroniclesName}
                      onChange={(e) => setAnswers(prev => ({ ...prev, chroniclesName: e.target.value }))}
                      placeholder="Enter your character's name..."
                      className="bg-slate-800 border-slate-600 text-white text-lg"
                      maxLength={30}
                    />
                    <p className="text-xs text-slate-500 mt-2">
                      This is how NPCs and other players will address you
                    </p>
                  </Card>
                </motion.div>
              )}

              {/* Traits Step */}
              {currentStep === "traits" && (
                <motion.div
                  key="traits"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <h2 className="text-2xl md:text-3xl font-bold text-white mb-2 text-center">
                    Define Your Character
                  </h2>
                  <p className="text-slate-400 mb-6 text-center">
                    Choose your primary and secondary roles
                  </p>
                  
                  <div className="mb-6">
                    <label className="block text-sm text-cyan-400 mb-3">Primary Role</label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {TRAITS.map((trait) => (
                        <Card
                          key={trait.id}
                          data-testid={`trait-primary-${trait.id}`}
                          onClick={() => setAnswers(prev => ({ 
                            ...prev, 
                            primaryTrait: trait.id,
                            secondaryTrait: prev.secondaryTrait === trait.id ? "" : prev.secondaryTrait
                          }))}
                          className={`p-4 cursor-pointer transition-all ${
                            answers.primaryTrait === trait.id
                              ? "bg-cyan-500/20 border-cyan-500"
                              : "bg-slate-900/80 border-slate-700 hover:border-slate-500"
                          }`}
                        >
                          <trait.icon className={`w-6 h-6 mb-2 ${answers.primaryTrait === trait.id ? "text-cyan-400" : "text-slate-400"}`} />
                          <h3 className="font-semibold text-white text-sm">{trait.label}</h3>
                          <p className="text-xs text-slate-400 mt-1">{trait.desc}</p>
                        </Card>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm text-purple-400 mb-3">Secondary Role</label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {TRAITS.filter(t => t.id !== answers.primaryTrait).map((trait) => (
                        <Card
                          key={trait.id}
                          data-testid={`trait-secondary-${trait.id}`}
                          onClick={() => setAnswers(prev => ({ ...prev, secondaryTrait: trait.id }))}
                          className={`p-4 cursor-pointer transition-all ${
                            answers.secondaryTrait === trait.id
                              ? "bg-purple-500/20 border-purple-500"
                              : "bg-slate-900/80 border-slate-700 hover:border-slate-500"
                          }`}
                        >
                          <trait.icon className={`w-6 h-6 mb-2 ${answers.secondaryTrait === trait.id ? "text-purple-400" : "text-slate-400"}`} />
                          <h3 className="font-semibold text-white text-sm">{trait.label}</h3>
                          <p className="text-xs text-slate-400 mt-1">{trait.desc}</p>
                        </Card>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Values Step */}
              {currentStep === "values" && (
                <motion.div
                  key="values"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <h2 className="text-2xl md:text-3xl font-bold text-white mb-2 text-center">
                    What Do You Value Most?
                  </h2>
                  <p className="text-slate-400 mb-6 text-center">
                    Choose 2-4 values that guide your character
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {VALUES.map((value) => (
                      <Card
                        key={value.id}
                        data-testid={`value-${value.id}`}
                        onClick={() => toggleValue(value.id)}
                        className={`p-4 cursor-pointer transition-all text-center ${
                          answers.coreValues.includes(value.id)
                            ? "bg-gradient-to-br from-cyan-500/20 to-purple-500/20 border-cyan-500"
                            : "bg-slate-900/80 border-slate-700 hover:border-slate-500"
                        }`}
                      >
                        {answers.coreValues.includes(value.id) && (
                          <Check className="w-4 h-4 text-cyan-400 absolute top-2 right-2" />
                        )}
                        <h3 className="font-semibold text-white">{value.label}</h3>
                        <p className="text-xs text-slate-400 mt-1">{value.desc}</p>
                      </Card>
                    ))}
                  </div>
                  <p className="text-center text-sm text-slate-500 mt-4">
                    Selected: {answers.coreValues.length}/4
                  </p>
                </motion.div>
              )}

              {/* Decisions Step */}
              {currentStep === "decisions" && (
                <motion.div
                  key="decisions"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <h2 className="text-2xl md:text-3xl font-bold text-white mb-2 text-center">
                    How Do You Make Decisions?
                  </h2>
                  <p className="text-slate-400 mb-6 text-center">
                    Your decision style shapes how you approach opportunities
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-xl mx-auto">
                    {DECISION_STYLES.map((style) => (
                      <Card
                        key={style.id}
                        data-testid={`decision-${style.id}`}
                        onClick={() => setAnswers(prev => ({ ...prev, decisionStyle: style.id }))}
                        className={`p-4 cursor-pointer transition-all ${
                          answers.decisionStyle === style.id
                            ? "bg-cyan-500/20 border-cyan-500"
                            : "bg-slate-900/80 border-slate-700 hover:border-slate-500"
                        }`}
                      >
                        <h3 className="font-semibold text-white">{style.label}</h3>
                        <p className="text-sm text-slate-400 mt-1">{style.desc}</p>
                      </Card>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Challenges Step */}
              {currentStep === "challenges" && (
                <motion.div
                  key="challenges"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <h2 className="text-2xl md:text-3xl font-bold text-white mb-2 text-center">
                    How Do You Handle Challenges?
                  </h2>
                  <p className="text-slate-400 mb-6 text-center">
                    Your approach to obstacles and difficulties
                  </p>
                  
                  <div className="mb-6">
                    <label className="block text-sm text-cyan-400 mb-3">When Facing Conflict</label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {CONFLICT_APPROACHES.map((approach) => (
                        <Card
                          key={approach.id}
                          data-testid={`conflict-${approach.id}`}
                          onClick={() => setAnswers(prev => ({ ...prev, conflictApproach: approach.id }))}
                          className={`p-4 cursor-pointer transition-all ${
                            answers.conflictApproach === approach.id
                              ? "bg-cyan-500/20 border-cyan-500"
                              : "bg-slate-900/80 border-slate-700 hover:border-slate-500"
                          }`}
                        >
                          <h3 className="font-semibold text-white">{approach.label}</h3>
                          <p className="text-sm text-slate-400 mt-1">{approach.desc}</p>
                        </Card>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm text-purple-400 mb-3">When Things Get Tough</label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {CHALLENGE_RESPONSES.map((response) => (
                        <Card
                          key={response.id}
                          data-testid={`challenge-${response.id}`}
                          onClick={() => setAnswers(prev => ({ ...prev, challengeResponse: response.id }))}
                          className={`p-4 cursor-pointer transition-all ${
                            answers.challengeResponse === response.id
                              ? "bg-purple-500/20 border-purple-500"
                              : "bg-slate-900/80 border-slate-700 hover:border-slate-500"
                          }`}
                        >
                          <h3 className="font-semibold text-white">{response.label}</h3>
                          <p className="text-sm text-slate-400 mt-1">{response.desc}</p>
                        </Card>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Audio Step */}
              {currentStep === "audio" && (
                <motion.div
                  key="audio"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <h2 className="text-2xl md:text-3xl font-bold text-white mb-2 text-center">
                    Your Soundtrack
                  </h2>
                  <p className="text-slate-400 mb-6 text-center">
                    How do you want to experience audio in your journey?
                  </p>
                  
                  <div className="mb-6">
                    <label className="block text-sm text-cyan-400 mb-3">Audio Experience</label>
                    <div className="grid grid-cols-1 gap-3 max-w-xl mx-auto">
                      {AUDIO_PREFERENCES.map((pref) => {
                        const Icon = pref.icon;
                        return (
                          <Card
                            key={pref.id}
                            data-testid={`audio-pref-${pref.id}`}
                            onClick={() => setAnswers(prev => ({ 
                              ...prev, 
                              audioPreference: pref.id,
                              audioMood: pref.id === "silent" ? "" : prev.audioMood 
                            }))}
                            className={`p-4 cursor-pointer transition-all flex items-center gap-4 ${
                              answers.audioPreference === pref.id
                                ? "bg-cyan-500/20 border-cyan-500"
                                : "bg-slate-900/80 border-slate-700 hover:border-slate-500"
                            }`}
                          >
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                              answers.audioPreference === pref.id ? "bg-cyan-500/30" : "bg-slate-800"
                            }`}>
                              <Icon className={`w-6 h-6 ${answers.audioPreference === pref.id ? "text-cyan-400" : "text-slate-400"}`} />
                            </div>
                            <div>
                              <h3 className="font-semibold text-white">{pref.label}</h3>
                              <p className="text-sm text-slate-400">{pref.desc}</p>
                            </div>
                          </Card>
                        );
                      })}
                    </div>
                  </div>

                  {answers.audioPreference !== "silent" && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                    >
                      <label className="block text-sm text-purple-400 mb-3">
                        {answers.audioPreference === "spotify" ? "Preferred Mood (we'll suggest playlists)" : "Music Mood"}
                      </label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-xl mx-auto">
                        {AUDIO_MOODS.map((mood) => (
                          <Card
                            key={mood.id}
                            data-testid={`audio-mood-${mood.id}`}
                            onClick={() => setAnswers(prev => ({ ...prev, audioMood: mood.id }))}
                            className={`p-3 cursor-pointer transition-all ${
                              answers.audioMood === mood.id
                                ? "bg-purple-500/20 border-purple-500"
                                : "bg-slate-900/80 border-slate-700 hover:border-slate-500"
                            }`}
                          >
                            <h3 className="font-semibold text-white text-sm">{mood.label}</h3>
                            <p className="text-xs text-slate-400 mt-1">{mood.desc}</p>
                          </Card>
                        ))}
                      </div>
                      
                      {answers.audioPreference === "spotify" && (
                        <p className="text-center text-slate-500 text-sm mt-4">
                          You can connect your Spotify account later in settings
                        </p>
                      )}
                    </motion.div>
                  )}
                </motion.div>
              )}

              {/* Portrait Step */}
              {currentStep === "portrait" && (
                <motion.div
                  key="portrait"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <h2 className="text-2xl md:text-3xl font-bold text-white mb-2 text-center">
                    Customize Your Presence
                  </h2>
                  <p className="text-slate-400 mb-6 text-center">
                    Choose how you want to be represented in the world
                  </p>
                  
                  {/* Portrait Preview */}
                  {answers.primaryTrait && answers.secondaryTrait && (
                    <div className="flex justify-center mb-6">
                      <CharacterPortraitPreview
                        primaryTrait={answers.primaryTrait}
                        secondaryTrait={answers.secondaryTrait}
                        colorPreference={answers.colorPreference || "cyan"}
                      />
                    </div>
                  )}
                  
                  <div className="mb-6">
                    <label className="block text-sm text-cyan-400 mb-3">Signature Color</label>
                    <div className="flex flex-wrap justify-center gap-3">
                      {COLORS.map((color) => (
                        <div
                          key={color.id}
                          data-testid={`color-${color.id}`}
                          onClick={() => setAnswers(prev => ({ ...prev, colorPreference: color.id }))}
                          className={`cursor-pointer transition-all ${
                            answers.colorPreference === color.id ? "scale-110" : "hover:scale-105"
                          }`}
                        >
                          <div
                            className={`w-12 h-12 rounded-full border-4 ${
                              answers.colorPreference === color.id ? "border-white" : "border-transparent"
                            }`}
                            style={{ backgroundColor: color.hex }}
                          />
                          <p className="text-xs text-slate-400 text-center mt-1">{color.label}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm text-purple-400 mb-3">Starting Era Interest</label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {ERAS.map((era) => (
                        <Card
                          key={era.id}
                          data-testid={`era-${era.id}`}
                          onClick={() => setAnswers(prev => ({ ...prev, eraInterest: era.id }))}
                          className={`p-3 cursor-pointer transition-all ${
                            answers.eraInterest === era.id
                              ? "bg-purple-500/20 border-purple-500"
                              : "bg-slate-900/80 border-slate-700 hover:border-slate-500"
                          }`}
                        >
                          <h3 className="font-semibold text-white text-sm">{era.label}</h3>
                          <p className="text-xs text-slate-400">{era.desc}</p>
                        </Card>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Complete Step */}
              {currentStep === "complete" && (
                <motion.div
                  key="complete"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center"
                >
                  <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-cyan-500 to-purple-500 flex items-center justify-center">
                    <Check className="w-12 h-12 text-white" />
                  </div>
                  <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
                    Character Created!
                  </h1>
                  <p className="text-lg text-slate-300 mb-2">
                    Welcome, {answers.chroniclesName}
                  </p>
                  <p className="text-slate-400 mb-8 max-w-md mx-auto">
                    Your character profile has been saved. You're now ready to explore the Chronicles universe.
                  </p>
                  
                  <Card className="bg-slate-900/80 border-slate-700 p-6 max-w-md mx-auto mb-8">
                    <h3 className="text-lg font-semibold text-white mb-4">Your Character Summary</h3>
                    <div className="space-y-2 text-left">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Name:</span>
                        <span className="text-white">{answers.chroniclesName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Primary Role:</span>
                        <span className="text-cyan-400 capitalize">{answers.primaryTrait}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Secondary Role:</span>
                        <span className="text-purple-400 capitalize">{answers.secondaryTrait}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Values:</span>
                        <span className="text-white capitalize">{answers.coreValues.join(", ")}</span>
                      </div>
                    </div>
                  </Card>

                  <Badge variant="outline" className="border-amber-500/50 text-amber-400 mb-6">
                    Season Zero - More Features Coming Soon
                  </Badge>
                  
                  {/* ChronoLink Introduction */}
                  <Card className="bg-gradient-to-r from-purple-900/30 to-cyan-900/30 border-purple-500/30 p-4 max-w-md mx-auto mb-6">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500/30 to-cyan-500/30 flex items-center justify-center">
                        <MessageCircle className="w-5 h-5 text-cyan-400" />
                      </div>
                      <div className="text-left">
                        <h4 className="font-semibold text-white">Activate ChronoLink</h4>
                        <p className="text-xs text-slate-400">Connect with fellow travelers</p>
                      </div>
                    </div>
                    <p className="text-sm text-slate-400 text-left mb-3">
                      Your journey doesn't have to be alone. Join ChronoChat to meet other explorers, share discoveries, and earn bonus Shells.
                    </p>
                    <Button
                      data-testid="button-chronolink"
                      onClick={() => setLocation("/chronochat")}
                      className="w-full bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500"
                    >
                      <Users className="w-4 h-4 mr-2" />
                      Enter ChronoChat
                    </Button>
                  </Card>
                  
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Button
                      data-testid="button-explore-estate"
                      onClick={() => setLocation("/chronicles/hub")}
                      className="bg-gradient-to-r from-cyan-500 to-purple-500"
                    >
                      Explore Your Estate
                      <ChevronRight className="w-4 h-4 ml-2" />
                    </Button>
                    <Button
                      data-testid="button-back-home"
                      onClick={() => setLocation("/")}
                      variant="outline"
                      className="border-slate-600"
                    >
                      Return Home
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Navigation Footer */}
        {currentStep !== "complete" && (
          <div className="p-4 md:p-6">
            <div className="max-w-2xl mx-auto flex justify-between">
              <Button
                data-testid="button-prev"
                onClick={prevStep}
                variant="outline"
                className="border-slate-600"
                disabled={currentStep === "welcome"}
              >
                <ChevronLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <Button
                data-testid="button-next"
                onClick={nextStep}
                disabled={!canProceed() || savePersonalityMutation.isPending}
                className="bg-gradient-to-r from-cyan-500 to-purple-500"
              >
                {savePersonalityMutation.isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                ) : null}
                {currentStep === "portrait" ? "Create Character" : "Continue"}
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
