/**
 * =====================================================
 * DARKWAVE CHRONICLES - PERSONALITY AI DEMO
 * =====================================================
 * 
 * This page demonstrates the Personality AI system that powers
 * the "Parallel Self" experience in DarkWave Chronicles.
 * 
 * Features demonstrated:
 * 1. Personality profile creation and viewing
 * 2. 5-Axis Emotional State visualization
 * 3. Scenario generation based on personality
 * 4. Choice processing and personality evolution
 * 5. Chat with your Parallel Self
 */

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  Brain, Sparkles, Heart, Shield, Compass, Flame, Eye,
  MessageSquare, Swords, Map, Users, Send, RefreshCw,
  ChevronRight, Loader2, User, Crown, Zap
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { MobileNav } from "@/components/mobile-nav";

const GlowOrb = ({ color, size, top, left, delay = 0 }: { color: string; size: number; top: string; left: string; delay?: number }) => (
  <motion.div
    className="absolute rounded-full blur-3xl opacity-20 pointer-events-none"
    style={{ background: color, width: size, height: size, top, left }}
    animate={{ scale: [1, 1.2, 1], opacity: [0.15, 0.25, 0.15] }}
    transition={{ duration: 8, repeat: Infinity, delay }}
  />
);

function EmotionAxis({ 
  label, 
  value, 
  leftLabel, 
  rightLabel, 
  color 
}: { 
  label: string; 
  value: number; 
  leftLabel: string; 
  rightLabel: string; 
  color: string;
}) {
  const percentage = ((value + 100) / 200) * 100;
  
  return (
    <div className="mb-4">
      <div className="flex justify-between text-xs text-gray-400 mb-1">
        <span>{leftLabel}</span>
        <span className="font-semibold text-white">{label}</span>
        <span>{rightLabel}</span>
      </div>
      <div className="h-3 bg-slate-800 rounded-full relative overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-0.5 h-full bg-gray-600" />
        </div>
        <motion.div
          className="absolute top-0 h-full rounded-full"
          style={{ 
            background: `linear-gradient(90deg, ${color}40, ${color})`,
            left: value >= 0 ? "50%" : `${percentage}%`,
            width: `${Math.abs(value) / 2}%`,
          }}
          initial={{ width: 0 }}
          animate={{ width: `${Math.abs(value) / 2}%` }}
          transition={{ duration: 0.5 }}
        />
        <motion.div
          className="absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full border-2 border-white shadow-lg"
          style={{ 
            background: color,
            left: `calc(${percentage}% - 8px)`,
          }}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3 }}
        />
      </div>
      <div className="text-center mt-1">
        <span className={`text-sm font-bold ${value >= 0 ? 'text-cyan-400' : 'text-pink-400'}`}>
          {value > 0 ? '+' : ''}{value}
        </span>
      </div>
    </div>
  );
}

function BentoCard({ 
  children, 
  className = "",
  glow = "cyan"
}: { 
  children: React.ReactNode; 
  className?: string;
  glow?: "cyan" | "purple" | "pink" | "amber";
}) {
  const glowColors = {
    cyan: "rgba(0,200,255,0.15)",
    purple: "rgba(168,85,247,0.15)",
    pink: "rgba(236,72,153,0.15)",
    amber: "rgba(245,158,11,0.15)",
  };
  
  return (
    <motion.div
      className={`relative overflow-hidden rounded-2xl border border-white/10 bg-slate-900/80 backdrop-blur-xl p-6 ${className}`}
      style={{ boxShadow: `0 0 40px ${glowColors[glow]}` }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
}

export default function ChroniclesAIDemo() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [chatMessage, setChatMessage] = useState("");
  const [chatHistory, setChatHistory] = useState<{ role: string; content: string }[]>([]);
  const [currentScenario, setCurrentScenario] = useState<any>(null);
  const [setupMode, setSetupMode] = useState(false);
  const [setupData, setSetupData] = useState({
    playerName: "",
    parallelSelfName: "",
    worldview: "realist",
    moralAlignment: "neutral_good",
    coreValues: [] as string[],
  });

  const { data: personalityData, isLoading: loadingPersonality, refetch: refetchPersonality } = useQuery({
    queryKey: ["/api/chronicles/personality"],
    queryFn: async () => {
      const res = await fetch("/api/chronicles/personality", { credentials: "include" });
      if (!res.ok) {
        if (res.status === 401) return null;
        throw new Error("Failed to fetch personality");
      }
      return res.json();
    },
  });

  const { data: archetypesData } = useQuery({
    queryKey: ["/api/chronicles/archetypes"],
    queryFn: async () => {
      const res = await fetch("/api/chronicles/archetypes");
      if (!res.ok) throw new Error("Failed to fetch archetypes");
      return res.json();
    },
  });

  const updatePersonalityMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await fetch("/api/chronicles/personality", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to update personality");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/chronicles/personality"] });
      setSetupMode(false);
      toast({ title: "Personality Updated", description: "Your parallel self has been shaped." });
    },
  });

  const generateScenarioMutation = useMutation({
    mutationFn: async (context: any) => {
      const res = await fetch("/api/chronicles/scenario", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(context),
      });
      if (!res.ok) throw new Error("Failed to generate scenario");
      return res.json();
    },
    onSuccess: (data) => {
      setCurrentScenario(data.scenario);
    },
  });

  const processChoiceMutation = useMutation({
    mutationFn: async ({ scenario, chosenOption }: { scenario: any; chosenOption: string }) => {
      const res = await fetch("/api/chronicles/choice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ scenario, chosenOption }),
      });
      if (!res.ok) throw new Error("Failed to process choice");
      return res.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["/api/chronicles/personality"] });
      setCurrentScenario(null);
      toast({ 
        title: "Choice Made", 
        description: data.insight || "Your personality has evolved.",
      });
    },
  });

  const chatMutation = useMutation({
    mutationFn: async (message: string) => {
      const res = await fetch("/api/chronicles/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ message }),
      });
      if (!res.ok) throw new Error("Failed to get response");
      return res.json();
    },
    onSuccess: (data) => {
      setChatHistory(prev => [...prev, { role: "assistant", content: data.message }]);
    },
  });

  const handleSendChat = () => {
    if (!chatMessage.trim()) return;
    setChatHistory(prev => [...prev, { role: "user", content: chatMessage }]);
    chatMutation.mutate(chatMessage);
    setChatMessage("");
  };

  const handleChoiceSelect = (option: string) => {
    if (currentScenario) {
      processChoiceMutation.mutate({ scenario: currentScenario, chosenOption: option });
    }
  };

  const personality = personalityData?.personality;
  const archetype = personalityData?.archetype;
  const emotionalState = personalityData?.emotionalState;

  if (!personalityData && !loadingPersonality) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <BentoCard className="max-w-md text-center">
          <Brain className="w-16 h-16 mx-auto mb-4 text-purple-400" />
          <h2 className="text-2xl font-bold mb-2">Sign In Required</h2>
          <p className="text-gray-400 mb-4">
            The Personality AI requires authentication to create your unique parallel self.
          </p>
          <Button 
            className="bg-gradient-to-r from-purple-600 to-pink-600"
            onClick={() => window.location.href = "/api/login"}
          >
            Sign In to Begin
          </Button>
        </BentoCard>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white relative overflow-hidden">
      <GlowOrb color="linear-gradient(135deg, #8b5cf6, #ec4899)" size={600} top="-10%" left="-10%" />
      <GlowOrb color="linear-gradient(135deg, #06b6d4, #8b5cf6)" size={500} top="50%" left="70%" delay={2} />
      
      <MobileNav />

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-8 pt-20">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-2">
            <span className="bg-gradient-to-r from-purple-400 via-pink-500 to-cyan-400 bg-clip-text text-transparent">
              Chronicles Personality AI
            </span>
          </h1>
          <p className="text-gray-400 text-lg">Discover Your Parallel Self</p>
        </motion.div>

        {loadingPersonality ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-purple-400" />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <BentoCard className="lg:col-span-1" glow="purple">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-white/10">
                  <User className="w-6 h-6 text-purple-400" />
                </div>
                <div>
                  <h2 className="text-xl font-bold">{personality?.parallelSelfName || personality?.playerName || "Hero"}</h2>
                  <p className="text-sm text-gray-400">{archetype?.name || "The Wanderer"}</p>
                </div>
              </div>
              
              {archetype && (
                <p className="text-sm text-gray-300 mb-4 italic">"{archetype.description}"</p>
              )}

              <div className="space-y-2 text-sm mb-4">
                <div className="flex justify-between">
                  <span className="text-gray-400">Worldview</span>
                  <span className="text-white capitalize">{personality?.worldview}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Alignment</span>
                  <span className="text-white capitalize">{personality?.moralAlignment?.replace("_", " ")}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Choices Made</span>
                  <span className="text-white">{personality?.totalChoicesMade || 0}</span>
                </div>
              </div>

              {personality?.coreValues?.length > 0 && (
                <div className="mb-4">
                  <span className="text-xs text-gray-400">Core Values</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {personality.coreValues.map((v: string) => (
                      <span key={v} className="px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 text-xs capitalize">
                        {v}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <Button 
                variant="outline" 
                size="sm" 
                className="w-full border-purple-500/30 text-purple-400"
                onClick={() => setSetupMode(true)}
              >
                Edit Personality
              </Button>
            </BentoCard>

            <BentoCard className="lg:col-span-2" glow="cyan">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <Heart className="w-5 h-5 text-pink-400" />
                5-Axis Emotional State
              </h3>
              
              {emotionalState && (
                <div className="space-y-2">
                  <EmotionAxis 
                    label="Courage/Fear" 
                    value={emotionalState.courageFear} 
                    leftLabel="Fear" 
                    rightLabel="Courage" 
                    color="#06b6d4"
                  />
                  <EmotionAxis 
                    label="Hope/Despair" 
                    value={emotionalState.hopeDespair} 
                    leftLabel="Despair" 
                    rightLabel="Hope" 
                    color="#22c55e"
                  />
                  <EmotionAxis 
                    label="Trust/Suspicion" 
                    value={emotionalState.trustSuspicion} 
                    leftLabel="Suspicion" 
                    rightLabel="Trust" 
                    color="#f59e0b"
                  />
                  <EmotionAxis 
                    label="Passion/Apathy" 
                    value={emotionalState.passionApathy} 
                    leftLabel="Apathy" 
                    rightLabel="Passion" 
                    color="#ec4899"
                  />
                  <EmotionAxis 
                    label="Wisdom/Recklessness" 
                    value={emotionalState.wisdomRecklessness} 
                    leftLabel="Reckless" 
                    rightLabel="Wisdom" 
                    color="#8b5cf6"
                  />
                </div>
              )}

              <p className="mt-4 text-sm text-gray-400 text-center italic">
                "{personalityData?.emotionalDescription || "Emotionally balanced"}"
              </p>
            </BentoCard>

            <BentoCard className="lg:col-span-2" glow="amber">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold flex items-center gap-2">
                  <Swords className="w-5 h-5 text-amber-400" />
                  Scenario Challenge
                </h3>
                <Button
                  size="sm"
                  variant="outline"
                  className="border-amber-500/30 text-amber-400"
                  onClick={() => generateScenarioMutation.mutate({ 
                    era: "Medieval Fantasy",
                    location: "Ancient Crossroads",
                    situation: "A moment that will define your legacy"
                  })}
                  disabled={generateScenarioMutation.isPending}
                >
                  {generateScenarioMutation.isPending ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <RefreshCw className="w-4 h-4 mr-1" />
                      Generate
                    </>
                  )}
                </Button>
              </div>

              {currentScenario ? (
                <div>
                  <p className="text-gray-300 mb-4 leading-relaxed">{currentScenario.description}</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {currentScenario.options?.map((option: string, i: number) => (
                      <motion.button
                        key={i}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleChoiceSelect(option)}
                        disabled={processChoiceMutation.isPending}
                        className="p-3 rounded-xl border border-white/10 bg-slate-800/50 text-left hover:border-amber-500/50 hover:bg-amber-500/10 transition-all disabled:opacity-50"
                      >
                        <span className="text-amber-400 font-bold mr-2">{i + 1}.</span>
                        <span className="text-gray-200">{option}</span>
                      </motion.button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Map className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>Generate a scenario to test your personality</p>
                </div>
              )}
            </BentoCard>

            <BentoCard className="lg:col-span-1" glow="pink">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-pink-400" />
                Chat with Parallel Self
              </h3>

              <div className="h-48 overflow-y-auto mb-4 space-y-2 scrollbar-thin">
                {chatHistory.length === 0 ? (
                  <p className="text-gray-500 text-sm text-center py-4">
                    Speak to your parallel self...
                  </p>
                ) : (
                  chatHistory.map((msg, i) => (
                    <div key={i} className={`p-2 rounded-lg text-sm ${
                      msg.role === "user" 
                        ? "bg-cyan-500/20 text-cyan-100 ml-4" 
                        : "bg-pink-500/20 text-pink-100 mr-4"
                    }`}>
                      {msg.content}
                    </div>
                  ))
                )}
                {chatMutation.isPending && (
                  <div className="flex items-center gap-2 text-gray-400 text-sm">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Parallel self is thinking...
                  </div>
                )}
              </div>

              <div className="flex gap-2">
                <Input
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSendChat()}
                  placeholder="Ask your parallel self..."
                  className="bg-slate-800/50 border-white/10"
                />
                <Button
                  size="icon"
                  onClick={handleSendChat}
                  disabled={chatMutation.isPending || !chatMessage.trim()}
                  className="bg-gradient-to-r from-pink-600 to-purple-600"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </BentoCard>
          </div>
        )}

        <AnimatePresence>
          {setupMode && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
              onClick={() => setSetupMode(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-slate-900 border border-white/10 rounded-2xl p-6 max-w-md w-full max-h-[80vh] overflow-y-auto"
              >
                <h3 className="text-xl font-bold mb-4">Shape Your Parallel Self</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="text-sm text-gray-400 mb-1 block">Your Name</label>
                    <Input
                      value={setupData.playerName}
                      onChange={(e) => setSetupData(s => ({ ...s, playerName: e.target.value }))}
                      placeholder={personality?.playerName || "Hero"}
                      className="bg-slate-800/50 border-white/10"
                    />
                  </div>
                  
                  <div>
                    <label className="text-sm text-gray-400 mb-1 block">Parallel Self Name</label>
                    <Input
                      value={setupData.parallelSelfName}
                      onChange={(e) => setSetupData(s => ({ ...s, parallelSelfName: e.target.value }))}
                      placeholder={personality?.parallelSelfName || "Your fantasy name..."}
                      className="bg-slate-800/50 border-white/10"
                    />
                  </div>

                  <div>
                    <label className="text-sm text-gray-400 mb-1 block">Worldview</label>
                    <Select
                      value={setupData.worldview}
                      onValueChange={(v) => setSetupData(s => ({ ...s, worldview: v }))}
                    >
                      <SelectTrigger className="bg-slate-800/50 border-white/10">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="optimist">Optimist</SelectItem>
                        <SelectItem value="realist">Realist</SelectItem>
                        <SelectItem value="pessimist">Pessimist</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm text-gray-400 mb-1 block">Moral Alignment</label>
                    <Select
                      value={setupData.moralAlignment}
                      onValueChange={(v) => setSetupData(s => ({ ...s, moralAlignment: v }))}
                    >
                      <SelectTrigger className="bg-slate-800/50 border-white/10">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {archetypesData?.moralAlignments?.map((a: string) => (
                          <SelectItem key={a} value={a} className="capitalize">
                            {a.replace("_", " ")}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm text-gray-400 mb-1 block">Core Values (select up to 5)</label>
                    <div className="flex flex-wrap gap-1">
                      {archetypesData?.coreValues?.map((v: string) => (
                        <button
                          key={v}
                          onClick={() => {
                            if (setupData.coreValues.includes(v)) {
                              setSetupData(s => ({ ...s, coreValues: s.coreValues.filter(x => x !== v) }));
                            } else if (setupData.coreValues.length < 5) {
                              setSetupData(s => ({ ...s, coreValues: [...s.coreValues, v] }));
                            }
                          }}
                          className={`px-2 py-1 rounded-full text-xs capitalize transition-all ${
                            setupData.coreValues.includes(v)
                              ? "bg-purple-500 text-white"
                              : "bg-slate-700 text-gray-300 hover:bg-slate-600"
                          }`}
                        >
                          {v}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 mt-6">
                  <Button variant="outline" className="flex-1" onClick={() => setSetupMode(false)}>
                    Cancel
                  </Button>
                  <Button 
                    className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600"
                    onClick={() => updatePersonalityMutation.mutate(setupData)}
                    disabled={updatePersonalityMutation.isPending}
                  >
                    {updatePersonalityMutation.isPending ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      "Save"
                    )}
                  </Button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mt-12 text-center">
          <p className="text-gray-500 text-sm">
            DarkWave Chronicles Personality AI • Prototype v1.0
          </p>
        </div>
      </div>
    </div>
  );
}
