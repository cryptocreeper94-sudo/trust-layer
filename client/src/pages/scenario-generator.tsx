import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "wouter";
import { 
  ArrowLeft, Sparkles, Brain, Users, Zap, AlertTriangle, 
  ChevronRight, RefreshCw, Play, Heart, Shield, Flame, Crown, Target
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { GlassCard } from "@/components/glass-card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import darkwaveLogo from "@assets/generated_images/darkwave_token_transparent.png";
import crystalBallImg from "@assets/generated_images/scenario_generator_crystal_ball.png";
import balanceScaleImg from "@assets/generated_images/balance_scale_moral_judgment.png";
import emotionalWarriorImg from "@assets/generated_images/emotional_warrior_portrait.png";
import rippleEffectsImg from "@assets/generated_images/glowing_ripple_effects_water.png";
import mirrorPerspectivesImg from "@assets/generated_images/shattered_mirror_perspectives.png";

interface EmotionState {
  arousal: number;
  valence: number;
  socialCohesion: number;
  fear: number;
  ambition: number;
}

interface Consequence {
  type: "immediate" | "delayed" | "ripple";
  description: string;
  affectedParties: string[];
  severity: "minor" | "moderate" | "major" | "catastrophic";
}

interface Character {
  name: string;
  role: string;
  emotions: EmotionState;
  motivation: string;
}

interface Choice {
  action: string;
  consequences: Consequence[];
  emotionalImpact: string;
}

interface Scenario {
  title: string;
  situation: string;
  characters: Character[];
  choices: Choice[];
  worldContext: string;
  era: string;
}

const ERAS = [
  { value: "Dawn Age", label: "Dawn Age (Stone Age)" },
  { value: "Age of Crowns", label: "Age of Crowns (Medieval)" },
  { value: "Iron Epoch", label: "Iron Epoch (Steampunk)" },
  { value: "Neon Dominion", label: "Neon Dominion (Cyberpunk)" },
  { value: "Stellar Exodus", label: "Stellar Exodus (Space)" },
  { value: "The Infinite", label: "The Infinite (Quantum)" },
];

const TONES = [
  { value: "tense", label: "Tense & Suspenseful" },
  { value: "desperate", label: "Desperate & Urgent" },
  { value: "political", label: "Political & Strategic" },
  { value: "emotional", label: "Emotional & Personal" },
  { value: "mysterious", label: "Mysterious & Uncertain" },
];

const COMPLEXITIES = [
  { value: "simple", label: "Simple (2 characters, 3 choices)" },
  { value: "moderate", label: "Moderate (3-4 characters, 4 choices)" },
  { value: "complex", label: "Complex (4+ characters, 5+ choices)" },
];

function EmotionBar({ label, value, color, icon: Icon }: { 
  label: string; 
  value: number; 
  color: string;
  icon: any;
}) {
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center gap-1">
          <Icon className="w-3 h-3" />
          <span className="text-gray-400">{label}</span>
        </div>
        <span className={color}>{value}</span>
      </div>
      <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 0.5 }}
          className={`h-full rounded-full ${color.replace("text-", "bg-")}`}
        />
      </div>
    </div>
  );
}

function CharacterCard({ character }: { character: Character }) {
  return (
    <GlassCard className="p-4">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h4 className="font-bold text-white">{character.name}</h4>
          <p className="text-xs text-gray-400">{character.role}</p>
        </div>
        <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30 text-xs">
          NPC
        </Badge>
      </div>
      
      <p className="text-sm text-gray-300 mb-4 italic">"{character.motivation}"</p>
      
      <div className="space-y-2">
        <EmotionBar label="Arousal" value={character.emotions.arousal} color="text-red-400" icon={Flame} />
        <EmotionBar label="Valence" value={character.emotions.valence} color="text-green-400" icon={Heart} />
        <EmotionBar label="Cohesion" value={character.emotions.socialCohesion} color="text-blue-400" icon={Users} />
        <EmotionBar label="Fear" value={character.emotions.fear} color="text-yellow-400" icon={AlertTriangle} />
        <EmotionBar label="Ambition" value={character.emotions.ambition} color="text-purple-400" icon={Crown} />
      </div>
    </GlassCard>
  );
}

function ChoiceCard({ choice, index }: { choice: Choice; index: number }) {
  const [expanded, setExpanded] = useState(false);
  
  const severityColors = {
    minor: "text-gray-400",
    moderate: "text-yellow-400",
    major: "text-orange-400",
    catastrophic: "text-red-400",
  };
  
  return (
    <div onClick={() => setExpanded(!expanded)} className="cursor-pointer">
    <GlassCard 
      className={`p-4 transition-all ${expanded ? "ring-1 ring-purple-500" : "hover:bg-white/5"}`}
    >
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-sm font-bold shrink-0">
          {index + 1}
        </div>
        <div className="flex-1">
          <p className="text-white font-medium">{choice.action}</p>
          <p className="text-xs text-gray-500 mt-1">{choice.emotionalImpact}</p>
        </div>
        <ChevronRight className={`w-5 h-5 text-gray-500 transition-transform ${expanded ? "rotate-90" : ""}`} />
      </div>
      
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="mt-4 pt-4 border-t border-white/10"
          >
            <h5 className="text-xs text-gray-400 mb-2">Consequences:</h5>
            <div className="space-y-2">
              {choice.consequences.map((c, i) => (
                <div key={i} className="bg-black/30 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge className={`text-xs ${
                      c.type === "immediate" ? "bg-red-500/20 text-red-300" :
                      c.type === "delayed" ? "bg-yellow-500/20 text-yellow-300" :
                      "bg-blue-500/20 text-blue-300"
                    }`}>
                      {c.type}
                    </Badge>
                    <span className={`text-xs ${severityColors[c.severity]}`}>
                      {c.severity}
                    </span>
                  </div>
                  <p className="text-sm text-gray-300">{c.description}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    Affects: {c.affectedParties.join(", ")}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </GlassCard>
    </div>
  );
}

export default function ScenarioGenerator() {
  const [era, setEra] = useState("Dawn Age");
  const [tone, setTone] = useState("tense");
  const [complexity, setComplexity] = useState<"simple" | "moderate" | "complex">("moderate");
  const [scenario, setScenario] = useState<Scenario | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateNewScenario = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch("/api/generate-scenario", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ era, emotionalTone: tone, complexity }),
      });
      
      if (!response.ok) throw new Error("Failed to generate scenario");
      
      const data = await response.json();
      setScenario(data);
    } catch (err) {
      setError("Failed to generate scenario. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-xl border-b border-white/5">
        <div className="container mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/era-codex" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">Era Codex</span>
          </Link>
          <div className="flex items-center gap-2">
            <img src={darkwaveLogo} alt="DarkWave" className="w-6 h-6" />
            <span className="font-display font-bold">Scenario Generator</span>
          </div>
          <Badge className="bg-pink-500/20 text-pink-300 border-pink-500/30">
            <Brain className="w-3 h-3 mr-1" />
            AI Demo
          </Badge>
        </div>
      </nav>

      <main className="pt-14">
        {/* Hero */}
        <section className="relative py-16 px-4 overflow-hidden">
          <img 
            src={crystalBallImg} 
            alt="Scenario Generator" 
            className="absolute inset-0 w-full h-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black via-black/80 to-black" />
          
          <div className="relative max-w-4xl mx-auto text-center">
            <Badge className="mb-4 bg-purple-500/20 text-purple-300 border-purple-500/30">
              <Sparkles className="w-3 h-3 mr-1" />
              AI-Powered
            </Badge>
            <h1 className="text-3xl sm:text-4xl font-display font-bold mb-4">
              Scenario Generator
            </h1>
            <p className="text-gray-400 max-w-xl mx-auto mb-8">
              Experience the emotion-driven storytelling engine. No good guys, no bad guys - 
              just free will, consequences, and the complexity of real life.
            </p>
            
            {/* Controls */}
            <div className="grid sm:grid-cols-3 gap-4 max-w-2xl mx-auto">
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Era</label>
                <Select value={era} onValueChange={setEra}>
                  <SelectTrigger className="bg-white/5 border-white/10" data-testid="select-era">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {ERAS.map(e => (
                      <SelectItem key={e.value} value={e.value}>{e.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Emotional Tone</label>
                <Select value={tone} onValueChange={setTone}>
                  <SelectTrigger className="bg-white/5 border-white/10" data-testid="select-tone">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {TONES.map(t => (
                      <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Complexity</label>
                <Select value={complexity} onValueChange={(v) => setComplexity(v as any)}>
                  <SelectTrigger className="bg-white/5 border-white/10" data-testid="select-complexity">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {COMPLEXITIES.map(c => (
                      <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <Button 
              onClick={generateNewScenario}
              disabled={loading}
              className="mt-6 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500"
              data-testid="button-generate"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 mr-2" />
                  Generate Scenario
                </>
              )}
            </Button>
            
            {error && (
              <p className="mt-4 text-red-400 text-sm">{error}</p>
            )}
          </div>
        </section>

        {/* Scenario Display */}
        {scenario && (
          <motion.section 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="px-4 py-10 bg-gradient-to-b from-black to-purple-950/20"
          >
            <div className="max-w-6xl mx-auto">
              {/* Scenario Header */}
              <div className="text-center mb-10">
                <Badge className="mb-2 bg-amber-500/20 text-amber-300 border-amber-500/30">
                  {scenario.era}
                </Badge>
                <h2 className="text-2xl sm:text-3xl font-display font-bold mb-3">
                  {scenario.title}
                </h2>
                <p className="text-gray-400 max-w-2xl mx-auto">{scenario.situation}</p>
                <p className="text-xs text-gray-500 mt-2 italic">{scenario.worldContext}</p>
              </div>
              
              {/* Characters */}
              <div className="mb-10">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <Users className="w-5 h-5 text-purple-400" />
                  Characters Involved
                </h3>
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {scenario.characters.map((char, i) => (
                    <CharacterCard key={i} character={char} />
                  ))}
                </div>
              </div>
              
              {/* Choices */}
              <div>
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <Target className="w-5 h-5 text-cyan-400" />
                  Your Choices
                </h3>
                <p className="text-sm text-gray-500 mb-4">
                  Click a choice to see its consequences. Remember: there is no "right" answer.
                </p>
                <div className="space-y-3">
                  {scenario.choices.map((choice, i) => (
                    <ChoiceCard key={i} choice={choice} index={i} />
                  ))}
                </div>
              </div>
              
              {/* Generate Another */}
              <div className="text-center mt-10">
                <Button 
                  onClick={generateNewScenario}
                  disabled={loading}
                  variant="outline"
                  className="border-purple-500/30 text-purple-300 hover:bg-purple-500/10"
                  data-testid="button-regenerate"
                >
                  <RefreshCw className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`} />
                  Generate Another
                </Button>
              </div>
            </div>
          </motion.section>
        )}

        {/* Philosophy Section */}
        <section className="px-4 py-16 bg-gradient-to-b from-purple-950/20 to-black">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="text-2xl font-display font-bold mb-4">The Philosophy</h2>
              <p className="text-gray-400">
                Every scenario is built on these principles
              </p>
            </div>
            
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="relative overflow-hidden rounded-xl group">
                <img src={balanceScaleImg} alt="" className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:opacity-60 transition-opacity" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent" />
                <div className="relative p-5 z-10">
                  <Shield className="w-8 h-8 text-cyan-400 mb-3 drop-shadow-lg" />
                  <h3 className="font-bold mb-2 text-white drop-shadow-lg">No Moral Judgment</h3>
                  <p className="text-sm text-gray-300">
                    The system doesn't label actions as "good" or "evil." It only tracks consequences and how others perceive you.
                  </p>
                </div>
              </div>
              
              <div className="relative overflow-hidden rounded-xl group">
                <img src={emotionalWarriorImg} alt="" className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:opacity-60 transition-opacity" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent" />
                <div className="relative p-5 z-10">
                  <Heart className="w-8 h-8 text-pink-400 mb-3 drop-shadow-lg" />
                  <h3 className="font-bold mb-2 text-white drop-shadow-lg">Emotion-Driven</h3>
                  <p className="text-sm text-gray-300">
                    Characters act based on their emotional state - fear, ambition, loyalty, desperation. Not scripted alignments.
                  </p>
                </div>
              </div>
              
              <div className="relative overflow-hidden rounded-xl group">
                <img src={rippleEffectsImg} alt="" className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:opacity-60 transition-opacity" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent" />
                <div className="relative p-5 z-10">
                  <Zap className="w-8 h-8 text-yellow-400 mb-3 drop-shadow-lg" />
                  <h3 className="font-bold mb-2 text-white drop-shadow-lg">Ripple Effects</h3>
                  <p className="text-sm text-gray-300">
                    Every choice creates consequences that spread beyond the immediate situation. Your actions echo through time.
                  </p>
                </div>
              </div>
              
              <div className="relative overflow-hidden rounded-xl group">
                <img src={mirrorPerspectivesImg} alt="" className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:opacity-60 transition-opacity" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent" />
                <div className="relative p-5 z-10">
                  <Brain className="w-8 h-8 text-purple-400 mb-3 drop-shadow-lg" />
                  <h3 className="font-bold mb-2 text-white drop-shadow-lg">Perspective Matters</h3>
                  <p className="text-sm text-gray-300">
                    Heroes and villains only exist in the eyes of the beholder. Everyone is the protagonist of their own story.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="py-6 px-4 border-t border-white/5 text-center">
        <p className="text-sm text-gray-500">
          DarkWave Chronicles • AI-Driven Life Generator Demo
        </p>
      </footer>
    </div>
  );
}
