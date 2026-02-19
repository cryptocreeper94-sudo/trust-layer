import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { GlassCard } from "@/components/glass-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Link } from "wouter";
import { getChroniclesSession } from "./chronicles-login";
import {
  Trophy, Crown, Users, Heart, Shield, Home, Zap, Link2,
  TreePine, Sword, BookOpen, Star, ChevronRight, Timer,
  Globe, Activity, Sparkles, Gift, ArrowLeft, Lock,
  CheckCircle2, XCircle, Loader2, Plus, Skull, PawPrint, Briefcase,
} from "lucide-react";

const TABS = [
  { id: "season", label: "Season", icon: Trophy, emoji: "🏆" },
  { id: "legacy", label: "Legacy", icon: TreePine, emoji: "🌳" },
  { id: "pets", label: "Pets", icon: PawPrint, emoji: "🐾" },
  { id: "life", label: "Life", icon: Briefcase, emoji: "💼" },
  { id: "relationships", label: "People", icon: Users, emoji: "👥" },
  { id: "events", label: "Events", icon: Globe, emoji: "⚡" },
  { id: "home", label: "Home", icon: Home, emoji: "🏠" },
  { id: "chain", label: "Chain", icon: Link2, emoji: "⛓️" },
] as const;

type TabId = (typeof TABS)[number]["id"];

function authFetch(url: string, options: RequestInit = {}) {
  const session = getChroniclesSession();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string> || {}),
  };
  if (session?.token) {
    headers["Authorization"] = `Bearer ${session.token}`;
  }
  return fetch(url, { ...options, headers });
}

const stagger = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
};
const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

function AmbientBackground() {
  const particles = useMemo(() =>
    Array.from({ length: 40 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1,
      delay: Math.random() * 5,
      duration: 3 + Math.random() * 4,
    })), []);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-cyan-500/[0.03] rounded-full blur-[100px]" />
      <div className="absolute top-1/3 right-0 w-[500px] h-[500px] bg-purple-500/[0.04] rounded-full blur-[100px]" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-amber-500/[0.02] rounded-full blur-[100px]" />
      {particles.map(p => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-white/20"
          style={{ left: `${p.x}%`, top: `${p.y}%`, width: p.size, height: p.size }}
          animate={{ opacity: [0, 0.8, 0], scale: [0.5, 1.5, 0.5], y: [0, -30, 0] }}
          transition={{ duration: p.duration, repeat: Infinity, delay: p.delay, ease: "easeInOut" }}
        />
      ))}
    </div>
  );
}

function ShimmerLoader() {
  return (
    <div className="space-y-4 py-8">
      {[1, 2, 3].map(i => (
        <div key={i} className="rounded-xl bg-white/5 overflow-hidden">
          <motion.div
            className="h-24 bg-gradient-to-r from-transparent via-white/[0.03] to-transparent"
            animate={{ x: ["-100%", "200%"] }}
            transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2, ease: "easeInOut" }}
          />
        </div>
      ))}
    </div>
  );
}

function SeasonProgressTab() {
  const { data, isLoading } = useQuery({
    queryKey: ["/api/chronicles/season/progress"],
    queryFn: async () => {
      const res = await authFetch("/api/chronicles/season/progress");
      if (!res.ok) return null;
      return res.json();
    },
    staleTime: 30000,
  });

  if (isLoading) return <LoadingState />;

  const eras = data?.eras || [
    { name: "Medieval", emoji: "🏰", progress: 0, color: "bg-amber-500" },
    { name: "Wild West", emoji: "🤠", progress: 0, color: "bg-yellow-500" },
    { name: "Modern", emoji: "🏙️", progress: 0, color: "bg-cyan-500" },
  ];
  const milestones = data?.milestones || Array.from({ length: 11 }, (_, i) => ({
    id: i, name: `Milestone ${i + 1}`, done: false, icon: "⭐",
  }));
  const seasonScore = data?.seasonScore || 0;
  const totalLegacies = data?.totalLegacies || 0;
  const totalDecisions = data?.totalDecisions || 0;
  const finaleUnlocked = data?.finaleUnlocked || false;

  return (
    <motion.div variants={stagger} initial="hidden" animate="visible" className="space-y-4">
      <motion.div variants={fadeUp}>
        <GlassCard glow className="p-5 border border-cyan-500/20 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-cyan-500/10 to-transparent rounded-bl-full" />
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-4">
              <motion.div animate={{ rotate: [0, -5, 5, 0] }} transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}>
                <Trophy className="w-6 h-6 text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.4)]" />
              </motion.div>
              <h3 className="text-white font-bold text-lg" data-testid="season-title">Season Zero</h3>
              <Badge className="bg-gradient-to-r from-cyan-500/20 to-purple-500/20 text-cyan-400 border border-cyan-500/20 ml-auto">
                Score: {seasonScore}
              </Badge>
            </div>
            <div className="grid grid-cols-3 gap-3 mb-4">
              {[
                { value: seasonScore, label: "Season Score", color: "from-cyan-400 to-blue-500", textColor: "text-cyan-400", testId: "stat-score" },
                { value: totalLegacies, label: "Total Legacies", color: "from-purple-400 to-pink-500", textColor: "text-purple-400", testId: "stat-legacies" },
                { value: totalDecisions, label: "Decisions", color: "from-green-400 to-emerald-500", textColor: "text-green-400", testId: "stat-decisions" },
              ].map((stat) => (
                <motion.div
                  key={stat.label}
                  whileHover={{ scale: 1.02 }}
                  className="text-center p-3 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 transition-colors"
                >
                  <motion.p
                    className={`text-2xl font-black ${stat.textColor} drop-shadow-[0_0_10px_currentColor]`}
                    data-testid={stat.testId}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", bounce: 0.5 }}
                  >
                    {stat.value}
                  </motion.p>
                  <p className="text-[10px] text-gray-500 mt-0.5">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </GlassCard>
      </motion.div>

      <motion.div variants={fadeUp}>
        <GlassCard className="p-5 border border-white/5">
          <h4 className="text-white font-semibold mb-4 flex items-center gap-2">
            <Activity className="w-4 h-4 text-cyan-400" /> Era Progress
          </h4>
          <div className="space-y-5">
            {eras.map((era: any, i: number) => {
              const pct = era.progress || 0;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.12 }}
                  data-testid={`era-progress-${i}`}
                >
                  <div className="flex justify-between text-sm mb-1.5">
                    <span className="text-gray-200 font-medium">{era.emoji} {era.name}</span>
                    <span className={`font-bold ${pct >= 100 ? "text-green-400" : pct > 50 ? "text-cyan-400" : "text-gray-400"}`}>
                      {pct}%
                    </span>
                  </div>
                  <div className="h-3 bg-slate-800/80 rounded-full overflow-hidden relative">
                    <motion.div
                      className={`h-full rounded-full ${era.color || "bg-cyan-500"} relative`}
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 1, delay: i * 0.15, ease: "easeOut" }}
                    >
                      {pct > 10 && (
                        <div className="absolute inset-0 overflow-hidden rounded-full">
                          <motion.div
                            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                            animate={{ x: ["-100%", "200%"] }}
                            transition={{ duration: 2, repeat: Infinity, delay: i * 0.3, repeatDelay: 3 }}
                          />
                        </div>
                      )}
                    </motion.div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </GlassCard>
      </motion.div>

      <motion.div variants={fadeUp}>
        <GlassCard className="p-5">
          <h4 className="text-white font-semibold mb-3 flex items-center gap-2">
            <Star className="w-4 h-4 text-yellow-400" /> Milestones
          </h4>
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
            {milestones.map((m: any, i: number) => (
              <motion.div
                key={m.id ?? i}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.04 }}
                className={`p-3 rounded-lg border text-center ${
                  m.done
                    ? "bg-green-500/10 border-green-500/30"
                    : "bg-white/5 border-white/10"
                }`}
                data-testid={`milestone-${i}`}
              >
                <span className="text-lg">{m.icon || "⭐"}</span>
                <p className="text-[10px] text-gray-400 mt-1 truncate">{m.name}</p>
                {m.done ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-green-400 mx-auto mt-1" />
                ) : (
                  <Lock className="w-3.5 h-3.5 text-gray-600 mx-auto mt-1" />
                )}
              </motion.div>
            ))}
          </div>
        </GlassCard>
      </motion.div>

      <motion.div variants={fadeUp}>
        <GlassCard glow={finaleUnlocked} className={`p-5 border relative overflow-hidden ${finaleUnlocked ? "border-yellow-500/30" : "border-white/10"}`}>
          {finaleUnlocked && (
            <>
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/5 via-amber-500/10 to-yellow-500/5" />
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-yellow-500/10 to-transparent"
                animate={{ x: ["-100%", "200%"] }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              />
            </>
          )}
          <div className="flex items-center gap-3 relative z-10">
            {finaleUnlocked ? (
              <motion.div
                animate={{ rotate: [0, 15, -15, 0], scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
              >
                <Sparkles className="w-7 h-7 text-yellow-400 drop-shadow-[0_0_12px_rgba(250,204,21,0.5)]" />
              </motion.div>
            ) : (
              <Lock className="w-6 h-6 text-gray-600" />
            )}
            <div className="flex-1">
              <h4 className={`font-bold ${finaleUnlocked ? "text-yellow-400" : "text-gray-500"}`}>
                Season Finale
              </h4>
              <p className="text-xs text-gray-500">
                {finaleUnlocked ? "The finale awaits you!" : "Complete more milestones to unlock"}
              </p>
            </div>
            <Button
              disabled={!finaleUnlocked}
              className={`min-h-[44px] ${finaleUnlocked ? "bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-400 hover:to-amber-400 text-black font-bold shadow-lg shadow-yellow-500/20" : ""}`}
              data-testid="finale-button"
            >
              {finaleUnlocked ? "Enter Finale" : "Locked"}
            </Button>
          </div>
        </GlassCard>
      </motion.div>

      <SeasonOneTeaser />
    </motion.div>
  );
}

function SeasonOneTeaser() {
  const [votes, setVotes] = useState<Record<string, boolean>>({});
  const [featureVotes, setFeatureVotes] = useState<Record<string, boolean>>({});
  const [submitted, setSubmitted] = useState(false);
  const [customSuggestion, setCustomSuggestion] = useState("");

  const ERA_OPTIONS = [
    { id: "ancient_egypt", emoji: "🏛️", name: "Ancient Egypt", desc: "Build pyramids, navigate pharaoh politics, explore the Nile" },
    { id: "roman_empire", emoji: "⚔️", name: "Roman Empire", desc: "Gladiator arenas, senate intrigue, legion campaigns" },
    { id: "viking_age", emoji: "🛡️", name: "Viking Age", desc: "Sail fjords, raid coastlines, forge alliances in the North" },
    { id: "feudal_japan", emoji: "⛩️", name: "Feudal Japan", desc: "Samurai honor, ninja stealth, shogunate power struggles" },
    { id: "renaissance", emoji: "🎨", name: "Renaissance Italy", desc: "Art patronage, Medici politics, Da Vinci's inventions" },
    { id: "victorian", emoji: "🎩", name: "Victorian London", desc: "Industrial revolution, detective work, gaslit mysteries" },
    { id: "prohibition", emoji: "🥃", name: "Prohibition Era", desc: "Speakeasies, bootlegging, jazz age drama" },
    { id: "ancient_greece", emoji: "🏺", name: "Ancient Greece", desc: "Philosophy, Olympics, mythic quests" },
    { id: "biblical", emoji: "📜", name: "Biblical Era", desc: "Walk with prophets, witness miracles, ancient kingdoms" },
    { id: "prehistoric", emoji: "🦕", name: "Prehistoric", desc: "Survival, tribal leadership, Ice Age exploration" },
  ];

  const FEATURE_OPTIONS = [
    { id: "marriage", emoji: "💍", name: "Marriage & Family", desc: "Marry NPCs, raise children, family legacy trees" },
    { id: "factions", emoji: "⚔️", name: "Faction Wars", desc: "Join factions, territory battles, alliance raids" },
    { id: "economy", emoji: "💰", name: "Player Economy", desc: "Trade goods, run businesses, build wealth" },
    { id: "crafting", emoji: "🔨", name: "Deep Crafting", desc: "Era-specific recipes, rare materials, legendary items" },
    { id: "pvp", emoji: "🏟️", name: "PvP Duels", desc: "Challenge other players in era-appropriate contests" },
    { id: "guilds", emoji: "🏰", name: "Guild Strongholds", desc: "Build guild bases, co-op missions, shared rewards" },
    { id: "dynamic_weather", emoji: "🌧️", name: "Dynamic Weather", desc: "Weather affects gameplay, seasons change, natural disasters" },
    { id: "voice_acting", emoji: "🎙️", name: "Voice-Acted NPCs", desc: "AI-generated voices for all major characters" },
    { id: "pets_expanded", emoji: "🐉", name: "Mythical Companions", desc: "Era-specific legendary creatures as companions" },
    { id: "music_system", emoji: "🎵", name: "Music & Instruments", desc: "Learn instruments, perform for crowds, compose songs" },
  ];

  const toggleVote = (id: string, isEra: boolean) => {
    if (isEra) {
      setVotes(prev => {
        const selected = Object.values(prev).filter(Boolean).length;
        if (!prev[id] && selected >= 3) return prev;
        return { ...prev, [id]: !prev[id] };
      });
    } else {
      setFeatureVotes(prev => {
        const selected = Object.values(prev).filter(Boolean).length;
        if (!prev[id] && selected >= 3) return prev;
        return { ...prev, [id]: !prev[id] };
      });
    }
  };

  const handleSubmit = async () => {
    const selectedEras = Object.entries(votes).filter(([, v]) => v).map(([k]) => k);
    const selectedFeatures = Object.entries(featureVotes).filter(([, v]) => v).map(([k]) => k);
    try {
      await authFetch("/api/chronicles/season/vote", {
        method: "POST",
        body: JSON.stringify({ eras: selectedEras, features: selectedFeatures, suggestion: customSuggestion }),
      });
    } catch {}
    setSubmitted(true);
  };

  const eraCount = Object.values(votes).filter(Boolean).length;
  const featureCount = Object.values(featureVotes).filter(Boolean).length;

  return (
    <motion.div variants={fadeUp} className="mt-6">
      <GlassCard glow className="p-5 border border-purple-500/20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-purple-500/10 to-transparent rounded-bl-full" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-cyan-500/5 to-transparent rounded-tr-full" />

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-5">
            <motion.div
              animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
              transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}
              className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500/30 to-cyan-500/20 flex items-center justify-center border border-purple-500/30"
            >
              <Crown className="w-6 h-6 text-purple-400" />
            </motion.div>
            <div>
              <h3 className="text-white font-bold text-lg" data-testid="season1-title">Season One Preview</h3>
              <p className="text-xs text-gray-400">Shape what comes next — your vote matters</p>
            </div>
            <Badge className="ml-auto bg-purple-500/20 text-purple-400 border border-purple-500/20">Coming Soon</Badge>
          </div>

          {submitted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-8"
            >
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 0.5 }}
                className="text-5xl mb-4"
              >
                🎉
              </motion.div>
              <h4 className="text-xl font-bold text-white mb-2">Thanks for Voting!</h4>
              <p className="text-sm text-gray-400 max-w-sm mx-auto">
                Your choices help shape the future of Chronicles. Season One is being built with the community in mind.
              </p>
              <div className="mt-4 flex justify-center gap-2 flex-wrap">
                {Object.entries(votes).filter(([, v]) => v).map(([id]) => {
                  const era = ERA_OPTIONS.find(e => e.id === id);
                  return era ? (
                    <Badge key={id} className="bg-purple-500/20 text-purple-300 border border-purple-500/20">
                      {era.emoji} {era.name}
                    </Badge>
                  ) : null;
                })}
                {Object.entries(featureVotes).filter(([, v]) => v).map(([id]) => {
                  const feat = FEATURE_OPTIONS.find(f => f.id === id);
                  return feat ? (
                    <Badge key={id} className="bg-cyan-500/20 text-cyan-300 border border-cyan-500/20">
                      {feat.emoji} {feat.name}
                    </Badge>
                  ) : null;
                })}
              </div>
            </motion.div>
          ) : (
            <div className="space-y-6">
              <div>
                <h4 className="text-white font-semibold mb-1 flex items-center gap-2">
                  <Globe className="w-4 h-4 text-purple-400" />
                  Which eras should we build next?
                </h4>
                <p className="text-[11px] text-gray-500 mb-3">Pick up to 3 eras you want to explore ({eraCount}/3)</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {ERA_OPTIONS.map((era) => {
                    const selected = votes[era.id];
                    return (
                      <motion.button
                        key={era.id}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => toggleVote(era.id, true)}
                        className={`text-left p-3 rounded-xl border transition-all min-h-[56px] ${
                          selected
                            ? "bg-purple-500/15 border-purple-500/40 shadow-lg shadow-purple-500/10"
                            : "bg-white/5 border-white/10 hover:border-white/20"
                        }`}
                        data-testid={`vote-era-${era.id}`}
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{era.emoji}</span>
                          <div className="min-w-0 flex-1">
                            <p className={`text-xs font-semibold truncate ${selected ? "text-purple-300" : "text-gray-200"}`}>
                              {era.name}
                            </p>
                            <p className="text-[10px] text-gray-500 truncate">{era.desc}</p>
                          </div>
                          {selected && <CheckCircle2 className="w-4 h-4 text-purple-400 flex-shrink-0" />}
                        </div>
                      </motion.button>
                    );
                  })}
                </div>
              </div>

              <div>
                <h4 className="text-white font-semibold mb-1 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-cyan-400" />
                  What features do you want most?
                </h4>
                <p className="text-[11px] text-gray-500 mb-3">Pick up to 3 features ({featureCount}/3)</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {FEATURE_OPTIONS.map((feat) => {
                    const selected = featureVotes[feat.id];
                    return (
                      <motion.button
                        key={feat.id}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => toggleVote(feat.id, false)}
                        className={`text-left p-3 rounded-xl border transition-all min-h-[56px] ${
                          selected
                            ? "bg-cyan-500/15 border-cyan-500/40 shadow-lg shadow-cyan-500/10"
                            : "bg-white/5 border-white/10 hover:border-white/20"
                        }`}
                        data-testid={`vote-feat-${feat.id}`}
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{feat.emoji}</span>
                          <div className="min-w-0 flex-1">
                            <p className={`text-xs font-semibold truncate ${selected ? "text-cyan-300" : "text-gray-200"}`}>
                              {feat.name}
                            </p>
                            <p className="text-[10px] text-gray-500 truncate">{feat.desc}</p>
                          </div>
                          {selected && <CheckCircle2 className="w-4 h-4 text-cyan-400 flex-shrink-0" />}
                        </div>
                      </motion.button>
                    );
                  })}
                </div>
              </div>

              <div>
                <h4 className="text-white font-semibold mb-2 flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-amber-400" />
                  Have a suggestion?
                </h4>
                <textarea
                  value={customSuggestion}
                  onChange={(e) => setCustomSuggestion(e.target.value)}
                  placeholder="Tell us what you'd love to see in Season One..."
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-cyan-500/40 resize-none h-20"
                  data-testid="suggestion-input"
                />
              </div>

              <Button
                onClick={handleSubmit}
                disabled={eraCount === 0 && featureCount === 0 && !customSuggestion.trim()}
                className="w-full bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white py-3 shadow-lg shadow-purple-500/20 disabled:opacity-40 disabled:shadow-none min-h-[48px]"
                data-testid="submit-vote-btn"
              >
                <Crown className="w-4 h-4 mr-2" />
                Submit My Votes
              </Button>
            </div>
          )}
        </div>
      </GlassCard>
    </motion.div>
  );
}

function LegacyTreeTab() {
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ["/api/chronicles/legacy/tree"],
    queryFn: async () => {
      const res = await authFetch("/api/chronicles/legacy/tree");
      if (!res.ok) return null;
      return res.json();
    },
    staleTime: 30000,
  });

  const newLifeMutation = useMutation({
    mutationFn: async () => {
      const res = await authFetch("/api/chronicles/legacy/new-life", { method: "POST" });
      if (!res.ok) throw new Error("Failed to start new life");
      return res.json();
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["/api/chronicles/legacy/tree"] }),
  });

  const endLifeMutation = useMutation({
    mutationFn: async () => {
      const res = await authFetch("/api/chronicles/legacy/end-life", { method: "POST" });
      if (!res.ok) throw new Error("Failed to end life");
      return res.json();
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["/api/chronicles/legacy/tree"] }),
  });

  if (isLoading) return <LoadingState />;

  const lives = data?.lives || [];
  const activeLife = data?.activeLife;
  const inheritanceTraits = data?.inheritanceTraits || [];

  return (
    <motion.div variants={stagger} initial="hidden" animate="visible" className="space-y-4">
      <motion.div variants={fadeUp} className="flex gap-2">
        <Button
          onClick={() => newLifeMutation.mutate()}
          disabled={newLifeMutation.isPending}
          className="bg-cyan-600 hover:bg-cyan-700 flex-1"
          data-testid="start-new-life"
        >
          {newLifeMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-1" /> : <Plus className="w-4 h-4 mr-1" />}
          Start New Life
        </Button>
        <Button
          onClick={() => endLifeMutation.mutate()}
          disabled={endLifeMutation.isPending || !activeLife}
          variant="outline"
          className="flex-1 border-red-500/30 text-red-400 hover:bg-red-500/10"
          data-testid="end-current-life"
        >
          {endLifeMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-1" /> : <Skull className="w-4 h-4 mr-1" />}
          End Current Life
        </Button>
      </motion.div>

      {inheritanceTraits.length > 0 && (
        <motion.div variants={fadeUp}>
          <GlassCard className="p-4">
            <h4 className="text-white font-semibold mb-2 flex items-center gap-2 text-sm">
              <Sparkles className="w-4 h-4 text-purple-400" /> Inheritance Traits
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {inheritanceTraits.map((trait: any, i: number) => (
                <Badge key={i} className="bg-purple-500/20 text-purple-300" data-testid={`trait-${i}`}>
                  {trait.name || trait}
                </Badge>
              ))}
            </div>
          </GlassCard>
        </motion.div>
      )}

      <motion.div variants={fadeUp}>
        <GlassCard className="p-5">
          <h4 className="text-white font-semibold mb-4 flex items-center gap-2">
            <TreePine className="w-4 h-4 text-green-400" /> Family Tree
          </h4>
          {lives.length === 0 ? (
            <p className="text-sm text-gray-500 text-center py-6">No past lives yet. Start your first life!</p>
          ) : (
            <div className="space-y-0">
              {lives.map((life: any, i: number) => {
                const isActive = activeLife?.id === life.id || life.isActive;
                return (
                  <motion.div
                    key={life.id || i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.08 }}
                    className="flex gap-3"
                    data-testid={`life-${i}`}
                  >
                    <div className="flex flex-col items-center">
                      <div className={`w-3 h-3 rounded-full mt-2 ${isActive ? "bg-cyan-400 ring-2 ring-cyan-400/30" : "bg-gray-600"}`} />
                      {i < lives.length - 1 && <div className="w-px flex-1 bg-white/10" />}
                    </div>
                    <div className={`flex-1 pb-4 p-3 rounded-lg mb-1 ${isActive ? "bg-cyan-500/10 border border-cyan-500/20" : "bg-white/5"}`}>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-white font-medium text-sm">{life.characterName || "Unknown"}</span>
                        <Badge className={`text-[9px] ${isActive ? "bg-cyan-500/20 text-cyan-400" : "bg-white/10 text-gray-400"}`}>
                          Gen {life.generation || i + 1}
                        </Badge>
                        {isActive && <Badge className="text-[9px] bg-green-500/20 text-green-400">Active</Badge>}
                      </div>
                      <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-gray-500">
                        {life.era && <span>🌍 {life.era}</span>}
                        {life.profession && <span>💼 {life.profession}</span>}
                        {life.birthYear && <span>📅 {life.birthYear}{life.deathYear ? `–${life.deathYear}` : "–present"}</span>}
                        {life.legacyScore != null && <span>⭐ Score: {life.legacyScore}</span>}
                      </div>
                      {life.epitaph && (
                        <p className="text-[11px] text-gray-400 italic mt-1">"{life.epitaph}"</p>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </GlassCard>
      </motion.div>
    </motion.div>
  );
}

function RelationshipsTab() {
  const [giftTarget, setGiftTarget] = useState<string | null>(null);
  const { data, isLoading } = useQuery({
    queryKey: ["/api/chronicles/relationships"],
    queryFn: async () => {
      const res = await authFetch("/api/chronicles/relationships");
      if (!res.ok) return null;
      return res.json();
    },
    staleTime: 30000,
  });

  if (isLoading) return <LoadingState />;

  const relationships = data?.relationships || data || [];

  const typeColors: Record<string, string> = {
    stranger: "bg-gray-500/20 text-gray-400",
    acquaintance: "bg-blue-500/20 text-blue-400",
    friend: "bg-green-500/20 text-green-400",
    rival: "bg-orange-500/20 text-orange-400",
    partner: "bg-pink-500/20 text-pink-400",
    enemy: "bg-red-500/20 text-red-400",
  };

  return (
    <motion.div variants={stagger} initial="hidden" animate="visible" className="space-y-3">
      {Array.isArray(relationships) && relationships.length === 0 && (
        <motion.div variants={fadeUp}>
          <GlassCard className="p-6 text-center">
            <Users className="w-8 h-8 text-gray-600 mx-auto mb-2" />
            <p className="text-gray-500 text-sm">No relationships yet. Play the game to meet NPCs!</p>
          </GlassCard>
        </motion.div>
      )}
      {Array.isArray(relationships) && relationships.map((rel: any, i: number) => (
        <motion.div key={rel.id || i} variants={fadeUp}>
          <GlassCard className="p-4" data-testid={`relationship-${i}`}>
            <div className="flex items-start gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500/30 to-cyan-500/30 flex items-center justify-center border border-white/10">
                <Users className="w-5 h-5 text-cyan-400" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-white font-medium text-sm truncate">{rel.name || rel.npcName}</h4>
                {rel.title && <p className="text-[10px] text-gray-500">{rel.title}</p>}
                {rel.faction && <p className="text-[10px] text-purple-400">{rel.faction}</p>}
              </div>
              <Badge className={typeColors[rel.relationshipType || rel.type || "stranger"] || typeColors.stranger}>
                {rel.relationshipType || rel.type || "stranger"}
              </Badge>
            </div>
            <div className="space-y-2">
              {rel.affinity != null && (
                <BarMeter label="Affinity" value={rel.affinity} color={rel.affinity >= 0 ? "bg-green-500" : "bg-red-500"} />
              )}
              {rel.trust != null && (
                <BarMeter label="Trust" value={rel.trust} color={rel.trust >= 0 ? "bg-green-500" : "bg-red-500"} />
              )}
              {rel.romance != null && (
                <BarMeter label="Romance" value={rel.romance} color="bg-pink-500" />
              )}
              {rel.rivalry != null && (
                <BarMeter label="Rivalry" value={rel.rivalry} color="bg-orange-500" />
              )}
            </div>
            <div className="mt-3 flex justify-end">
              <Button
                variant="ghost"
                size="sm"
                className="text-purple-400 hover:text-purple-300"
                onClick={() => setGiftTarget(rel.id || rel.npcId || rel.name)}
                data-testid={`gift-button-${i}`}
              >
                <Gift className="w-4 h-4 mr-1" /> Gift
              </Button>
            </div>
          </GlassCard>
        </motion.div>
      ))}

      <AnimatePresence>
        {giftTarget && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
            onClick={() => setGiftTarget(null)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              onClick={(e) => e.stopPropagation()}
            >
              <GlassCard glow className="p-6 border border-purple-500/30 w-80">
                <h4 className="text-white font-bold mb-3 flex items-center gap-2">
                  <Gift className="w-5 h-5 text-purple-400" /> Send a Gift
                </h4>
                <p className="text-sm text-gray-400 mb-4">Choose a gift to send to this character.</p>
                <div className="grid grid-cols-2 gap-2 mb-4">
                  {["Flowers 🌸", "Food 🍖", "Weapon ⚔️", "Book 📖"].map((g) => (
                    <Button key={g} variant="outline" size="sm" className="border-white/10 text-gray-300 hover:bg-white/10" data-testid={`gift-option-${g.split(" ")[0].toLowerCase()}`}>
                      {g}
                    </Button>
                  ))}
                </div>
                <Button variant="ghost" size="sm" className="w-full text-gray-500" onClick={() => setGiftTarget(null)}>
                  Cancel
                </Button>
              </GlassCard>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function BarMeter({ label, value, color }: { label: string; value: number; color: string }) {
  const normalized = Math.min(100, Math.max(0, ((value + 100) / 200) * 100));
  return (
    <div>
      <div className="flex justify-between text-[10px] mb-0.5">
        <span className="text-gray-500">{label}</span>
        <span className={value >= 0 ? "text-green-400" : "text-red-400"}>{value}</span>
      </div>
      <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
        <motion.div
          className={`h-full rounded-full ${color}`}
          initial={{ width: 0 }}
          animate={{ width: `${normalized}%` }}
          transition={{ duration: 0.6 }}
        />
      </div>
    </div>
  );
}

function WorldEventsTab() {
  const { data, isLoading } = useQuery({
    queryKey: ["/api/chronicles/events/active"],
    queryFn: async () => {
      const res = await authFetch("/api/chronicles/events/active");
      if (!res.ok) return null;
      return res.json();
    },
    staleTime: 30000,
  });

  if (isLoading) return <LoadingState />;

  const activeEvents = data?.activeEvents || data?.active || [];
  const pastEvents = data?.pastEvents || data?.history || [];

  const severityColors: Record<string, string> = {
    low: "bg-green-500/20 text-green-400",
    medium: "bg-yellow-500/20 text-yellow-400",
    high: "bg-orange-500/20 text-orange-400",
    critical: "bg-red-500/20 text-red-400",
  };

  return (
    <motion.div variants={stagger} initial="hidden" animate="visible" className="space-y-4">
      <motion.div variants={fadeUp}>
        <h4 className="text-white font-semibold mb-3 flex items-center gap-2">
          <Zap className="w-4 h-4 text-yellow-400" /> Active Events
        </h4>
        {Array.isArray(activeEvents) && activeEvents.length === 0 ? (
          <GlassCard className="p-6 text-center">
            <Globe className="w-8 h-8 text-gray-600 mx-auto mb-2" />
            <p className="text-gray-500 text-sm">No active world events right now.</p>
          </GlassCard>
        ) : (
          <div className="space-y-3">
            {Array.isArray(activeEvents) && activeEvents.map((event: any, i: number) => (
              <GlassCard key={event.id || i} glow className="p-4 border border-cyan-500/20" data-testid={`active-event-${i}`}>
                <div className="flex items-start gap-3 mb-2">
                  <div className="flex-1">
                    <h5 className="text-white font-medium text-sm">{event.title || event.name}</h5>
                    <p className="text-xs text-gray-400 mt-1">{event.description}</p>
                  </div>
                  <Badge className={severityColors[event.severity || "medium"] || severityColors.medium}>
                    {event.severity || "medium"}
                  </Badge>
                </div>
                {event.timeRemaining && (
                  <div className="flex items-center gap-1 text-xs text-cyan-400 mb-2">
                    <Timer className="w-3 h-3" />
                    <span>{event.timeRemaining}</span>
                  </div>
                )}
                <Button size="sm" className="bg-cyan-600 hover:bg-cyan-700 w-full" data-testid={`participate-event-${i}`}>
                  <Sword className="w-3.5 h-3.5 mr-1" /> Participate
                </Button>
              </GlassCard>
            ))}
          </div>
        )}
      </motion.div>

      {Array.isArray(pastEvents) && pastEvents.length > 0 && (
        <motion.div variants={fadeUp}>
          <h4 className="text-white font-semibold mb-3 flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-gray-400" /> Event History
          </h4>
          <GlassCard className="p-4">
            <div className="space-y-2">
              {pastEvents.map((event: any, i: number) => (
                <div key={event.id || i} className="flex items-center gap-3 p-2 rounded-lg bg-white/5" data-testid={`past-event-${i}`}>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-300 truncate">{event.title || event.name}</p>
                    <p className="text-[10px] text-gray-600">{event.timestamp || event.date}</p>
                  </div>
                  {event.participated ? (
                    <Badge className="bg-green-500/20 text-green-400 text-[9px]">Participated</Badge>
                  ) : (
                    <Badge className="bg-gray-500/20 text-gray-500 text-[9px]">Missed</Badge>
                  )}
                </div>
              ))}
            </div>
          </GlassCard>
        </motion.div>
      )}
    </motion.div>
  );
}

function HomeTab() {
  const { data, isLoading } = useQuery({
    queryKey: ["/api/chronicles/home"],
    queryFn: async () => {
      const res = await authFetch("/api/chronicles/home");
      if (!res.ok) return null;
      return res.json();
    },
    staleTime: 30000,
  });

  if (isLoading) return <LoadingState />;

  const home = data?.home || data || {};
  const upgrades = data?.upgrades || home?.upgrades || [];
  const visitor = data?.visitor || home?.visitor;
  const items = data?.items || home?.installedItems || [];

  const homeStats = [
    { label: "Level", value: home.level || 1, icon: Crown, color: "text-yellow-400" },
    { label: "Comfort", value: home.comfort || 0, icon: Heart, color: "text-pink-400" },
    { label: "Security", value: home.security || 0, icon: Shield, color: "text-blue-400" },
    { label: "Storage", value: home.storage || 0, icon: BookOpen, color: "text-green-400" },
  ];

  return (
    <motion.div variants={stagger} initial="hidden" animate="visible" className="space-y-4">
      <motion.div variants={fadeUp}>
        <GlassCard glow className="p-5 border border-cyan-500/20">
          <h4 className="text-white font-semibold mb-3 flex items-center gap-2">
            <Home className="w-5 h-5 text-cyan-400" /> Your Estate
          </h4>
          <div className="grid grid-cols-4 gap-2">
            {homeStats.map((stat) => (
              <div key={stat.label} className="text-center p-2 rounded-lg bg-white/5" data-testid={`home-stat-${stat.label.toLowerCase()}`}>
                <stat.icon className={`w-4 h-4 mx-auto mb-1 ${stat.color}`} />
                <p className={`text-lg font-bold ${stat.color}`}>{stat.value}</p>
                <p className="text-[9px] text-gray-500">{stat.label}</p>
              </div>
            ))}
          </div>
        </GlassCard>
      </motion.div>

      {visitor && (
        <motion.div variants={fadeUp}>
          <GlassCard className="p-4 border border-purple-500/20">
            <div className="flex items-center gap-3">
              <Users className="w-5 h-5 text-purple-400" />
              <div>
                <h5 className="text-white font-medium text-sm">Current Visitor</h5>
                <p className="text-xs text-gray-400">{visitor.name || "A mysterious stranger"}</p>
              </div>
            </div>
          </GlassCard>
        </motion.div>
      )}

      {Array.isArray(upgrades) && upgrades.length > 0 && (
        <motion.div variants={fadeUp}>
          <h4 className="text-white font-semibold mb-3 flex items-center gap-2">
            <Zap className="w-4 h-4 text-yellow-400" /> Available Upgrades
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {upgrades.map((upgrade: any, i: number) => (
              <GlassCard key={upgrade.id || i} className="p-4" data-testid={`upgrade-${i}`}>
                <h5 className="text-white font-medium text-sm mb-1">{upgrade.name}</h5>
                <p className="text-[11px] text-gray-400 mb-2">{upgrade.description}</p>
                {upgrade.buff && (
                  <Badge className="bg-cyan-500/20 text-cyan-400 text-[9px] mb-2">{upgrade.buff}</Badge>
                )}
                <div className="flex items-center justify-between">
                  <span className="text-xs text-yellow-400">💰 {upgrade.cost || 0}</span>
                  <Button size="sm" className="bg-cyan-600 hover:bg-cyan-700 h-7 text-xs" data-testid={`buy-upgrade-${i}`}>
                    Buy
                  </Button>
                </div>
              </GlassCard>
            ))}
          </div>
        </motion.div>
      )}

      {Array.isArray(items) && items.length > 0 && (
        <motion.div variants={fadeUp}>
          <GlassCard className="p-4">
            <h4 className="text-white font-semibold mb-3 text-sm">Installed Items</h4>
            <div className="flex flex-wrap gap-1.5">
              {items.map((item: any, i: number) => (
                <Badge key={i} className="bg-white/10 text-gray-300" data-testid={`item-${i}`}>
                  {item.name || item}
                </Badge>
              ))}
            </div>
          </GlassCard>
        </motion.div>
      )}
    </motion.div>
  );
}

function DecisionChainTab() {
  const { data, isLoading } = useQuery({
    queryKey: ["/api/chronicles/chain/history"],
    queryFn: async () => {
      const res = await authFetch("/api/chronicles/chain/history");
      if (!res.ok) return null;
      return res.json();
    },
    staleTime: 30000,
  });

  if (isLoading) return <LoadingState />;

  const blocks = data?.blocks || data?.chain || [];
  const isValid = data?.isValid ?? true;
  const totalBlocks = data?.totalBlocks ?? (Array.isArray(blocks) ? blocks.length : 0);

  const eraColors: Record<string, string> = {
    medieval: "from-amber-500/30 to-orange-500/30",
    wildwest: "from-yellow-500/30 to-amber-500/30",
    modern: "from-cyan-500/30 to-blue-500/30",
  };

  return (
    <motion.div variants={stagger} initial="hidden" animate="visible" className="space-y-4">
      <motion.div variants={fadeUp}>
        <GlassCard glow className="p-5 border border-cyan-500/20 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 to-purple-500/5" />
          <div className="relative z-10 flex items-center gap-3">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            >
              <Link2 className="w-6 h-6 text-cyan-400 drop-shadow-[0_0_8px_rgba(6,182,212,0.4)]" />
            </motion.div>
            <div className="flex-1">
              <h4 className="text-white font-bold text-lg">Decision Blockchain</h4>
              <p className="text-xs text-gray-500">SHA-256 verified &middot; Immutable &middot; Proof of Authority</p>
            </div>
            <div className="flex flex-col sm:flex-row items-end sm:items-center gap-1.5">
              <Badge className={`${isValid ? "bg-green-500/20 text-green-400 border border-green-500/20" : "bg-red-500/20 text-red-400 border border-red-500/20"}`} data-testid="chain-validity">
                {isValid ? <><CheckCircle2 className="w-3 h-3 mr-1" /> Valid Chain</> : <><XCircle className="w-3 h-3 mr-1" /> Invalid</>}
              </Badge>
              <Badge className="bg-white/10 text-gray-300 border border-white/5" data-testid="total-blocks">
                {totalBlocks} blocks
              </Badge>
            </div>
          </div>
        </GlassCard>
      </motion.div>

      {Array.isArray(blocks) && blocks.length === 0 ? (
        <motion.div variants={fadeUp}>
          <GlassCard className="p-8 text-center border border-white/5">
            <motion.div
              animate={{ opacity: [0.3, 0.6, 0.3] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <Link2 className="w-12 h-12 text-gray-700 mx-auto mb-3" />
            </motion.div>
            <p className="text-gray-400 text-sm font-medium">No decisions recorded yet</p>
            <p className="text-gray-600 text-xs mt-1">Play the game to build your immutable decision chain</p>
          </GlassCard>
        </motion.div>
      ) : (
        <div className="space-y-0">
          {Array.isArray(blocks) && blocks.map((block: any, i: number) => {
            const eraGrad = eraColors[block.era] || eraColors.modern;
            return (
              <motion.div
                key={block.id || i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.06 }}
                className="flex gap-3"
                data-testid={`chain-block-${i}`}
              >
                <div className="flex flex-col items-center">
                  <motion.div
                    className={`w-10 h-10 rounded-lg bg-gradient-to-br ${eraGrad} flex items-center justify-center border border-white/10 relative overflow-hidden`}
                    whileHover={{ scale: 1.1 }}
                  >
                    <span className="text-[10px] font-bold text-white relative z-10">#{block.number || i + 1}</span>
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-t from-white/10 to-transparent"
                      animate={{ opacity: [0, 0.3, 0] }}
                      transition={{ duration: 2, repeat: Infinity, delay: i * 0.2 }}
                    />
                  </motion.div>
                  {i < blocks.length - 1 && (
                    <div className="w-px flex-1 min-h-[12px] relative">
                      <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/40 to-purple-500/40" />
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-b from-cyan-400/60 to-transparent"
                        animate={{ opacity: [0, 1, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.1 }}
                      />
                    </div>
                  )}
                </div>
                <GlassCard hover={false} className="flex-1 mb-2 border border-white/5 hover:border-white/10 transition-colors">
                  <div className="p-3.5">
                    <div className="flex items-start justify-between mb-1.5">
                      <h5 className="text-white font-medium text-sm">{block.decisionTitle || block.title || "Decision"}</h5>
                      {block.era && (
                        <Badge className={`text-[9px] ${
                          block.era === "medieval" ? "bg-amber-500/20 text-amber-400" :
                          block.era === "wildwest" ? "bg-yellow-500/20 text-yellow-400" :
                          "bg-cyan-500/20 text-cyan-400"
                        }`}>{block.era}</Badge>
                      )}
                    </div>
                    {block.choice && (
                      <p className="text-xs text-cyan-400 mb-2 flex items-center gap-1">
                        <ChevronRight className="w-3 h-3" /> {block.choice}
                      </p>
                    )}
                    <div className="flex items-center gap-3 text-[10px]">
                      {block.hash && (
                        <span className="font-mono text-gray-600 bg-white/3 px-1.5 py-0.5 rounded">
                          {block.hash.substring(0, 16)}...
                        </span>
                      )}
                      {block.timestamp && (
                        <span className="text-gray-600">
                          {new Date(block.timestamp).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            );
          })}
        </div>
      )}
    </motion.div>
  );
}

function PetsTab() {
  const { data, isLoading } = useQuery({
    queryKey: ["/api/chronicles/pets/summary"],
    queryFn: async () => {
      const res = await authFetch("/api/chronicles/pets/summary");
      if (!res.ok) return null;
      return res.json();
    },
    staleTime: 30000,
  });

  if (isLoading) return <ShimmerLoader />;

  const totalPets = data?.totalPets || 0;
  const companion = data?.companion;
  const byEra = data?.byEra || {};
  const needsAttention = data?.needsAttention || [];

  return (
    <motion.div variants={stagger} initial="hidden" animate="visible" className="space-y-4">
      <motion.div variants={fadeUp}>
        <GlassCard glow className="p-5 border border-pink-500/20 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-pink-500/5 to-purple-500/5" />
          <div className="relative z-10 flex items-center gap-3">
            <motion.div
              animate={{ y: [0, -3, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-3xl"
            >
              🐾
            </motion.div>
            <div className="flex-1">
              <h4 className="text-white font-bold text-lg">Your Companions</h4>
              <p className="text-xs text-gray-500">{totalPets} pet{totalPets !== 1 ? "s" : ""} adopted &middot; {data?.legendaryCount || 0} legendary</p>
            </div>
            <Link href="/chronicles/pets">
              <Button size="sm" className="bg-gradient-to-r from-pink-600 to-purple-600 text-white min-h-[40px] active:scale-95" data-testid="btn-view-pets">
                <PawPrint className="w-3.5 h-3.5 mr-1" /> View All
              </Button>
            </Link>
          </div>
        </GlassCard>
      </motion.div>

      {companion && (
        <motion.div variants={fadeUp}>
          <GlassCard className="p-4 border border-cyan-500/10">
            <div className="flex items-center gap-3">
              <span className="text-3xl">{companion.emoji}</span>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h5 className="text-white font-bold">{companion.name}</h5>
                  <Badge className="bg-cyan-500/20 text-cyan-400 text-[9px]"><Crown className="w-2.5 h-2.5 mr-0.5" /> Active</Badge>
                </div>
                <p className="text-xs text-gray-500">{companion.era} era companion</p>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-1 text-pink-400">
                  <Heart className="w-3.5 h-3.5" />
                  <span className="text-sm font-bold">{companion.bond}</span>
                </div>
                <p className="text-[9px] text-gray-600">bond</p>
              </div>
            </div>
          </GlassCard>
        </motion.div>
      )}

      {totalPets === 0 ? (
        <motion.div variants={fadeUp}>
          <GlassCard className="p-8 text-center border border-white/5">
            <motion.div animate={{ y: [0, -5, 0] }} transition={{ duration: 3, repeat: Infinity }} className="text-5xl mb-3">
              🐾
            </motion.div>
            <p className="text-gray-400 text-sm font-medium">No companions yet</p>
            <p className="text-gray-600 text-xs mt-1 mb-4">Adopt your first pet and begin your bond!</p>
            <Link href="/chronicles/pets">
              <Button className="bg-gradient-to-r from-pink-600 to-purple-600 min-h-[44px] active:scale-95" data-testid="btn-adopt-first-hub">
                <Plus className="w-4 h-4 mr-1" /> Adopt a Companion
              </Button>
            </Link>
          </GlassCard>
        </motion.div>
      ) : (
        <>
          <motion.div variants={fadeUp} className="grid grid-cols-3 gap-3">
            {Object.entries(byEra).map(([era, pets]: [string, any]) => (
              <GlassCard key={era} className="p-3 text-center border border-white/5">
                <p className="text-lg mb-1">{era === "medieval" ? "🏰" : era === "wildwest" ? "🤠" : "🏙️"}</p>
                <p className="text-white font-bold text-lg">{pets.length}</p>
                <p className="text-[10px] text-gray-500 capitalize">{era}</p>
              </GlassCard>
            ))}
          </motion.div>

          {needsAttention.length > 0 && (
            <motion.div variants={fadeUp}>
              <GlassCard className="p-3 border border-amber-500/20 bg-amber-500/5">
                <div className="flex items-center gap-2 mb-1">
                  <Heart className="w-3.5 h-3.5 text-amber-400" />
                  <span className="text-xs text-amber-400 font-medium">Needs Attention</span>
                </div>
                <div className="flex gap-2 flex-wrap">
                  {needsAttention.map((p: any, i: number) => (
                    <span key={i} className="text-xs text-gray-400">{p.emoji} {p.name}</span>
                  ))}
                </div>
              </GlassCard>
            </motion.div>
          )}
        </>
      )}
    </motion.div>
  );
}

function DailyLifeTab() {
  const { data, isLoading } = useQuery({
    queryKey: ["/api/chronicles/daily-life/summary"],
    queryFn: async () => {
      const res = await authFetch("/api/chronicles/daily-life/summary?era=medieval");
      if (!res.ok) return null;
      return res.json();
    },
    staleTime: 30000,
  });

  if (isLoading) return <ShimmerLoader />;

  const career = data?.career;
  const needs = data?.needs;
  const hour = data?.hour || new Date().getHours();

  return (
    <motion.div variants={stagger} initial="hidden" animate="visible" className="space-y-4">
      <motion.div variants={fadeUp}>
        <GlassCard glow className="p-5 border border-emerald-500/20 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 to-blue-500/5" />
          <div className="relative z-10 flex items-center gap-3">
            <span className="text-3xl">💼</span>
            <div className="flex-1">
              <h4 className="text-white font-bold text-lg">Daily Life</h4>
              <p className="text-xs text-gray-500">Career, needs & routines</p>
            </div>
            <Link href="/chronicles/daily-life">
              <Button size="sm" className="bg-gradient-to-r from-emerald-600 to-cyan-600 text-white min-h-[40px] active:scale-95" data-testid="btn-view-daily-life">
                <Briefcase className="w-3.5 h-3.5 mr-1" /> Full View
              </Button>
            </Link>
          </div>
        </GlassCard>
      </motion.div>

      {career ? (
        <motion.div variants={fadeUp}>
          <GlassCard className="p-4 border border-white/5">
            <div className="flex items-center gap-3">
              <span className="text-3xl">{career.occupationEmoji || "💼"}</span>
              <div className="flex-1">
                <h5 className="text-white font-bold">{career.occupation}</h5>
                <p className="text-xs text-gray-500">{career.workplace}</p>
              </div>
              <div className="text-right">
                <Badge className="bg-emerald-500/20 text-emerald-400 text-[9px] capitalize">{career.rank}</Badge>
                <p className="text-[9px] text-gray-600 mt-0.5">{career.daysWorked} days</p>
              </div>
            </div>
          </GlassCard>
        </motion.div>
      ) : (
        <motion.div variants={fadeUp}>
          <GlassCard className="p-6 text-center border border-white/5">
            <p className="text-4xl mb-2">💼</p>
            <p className="text-gray-400 text-sm">No career yet</p>
            <p className="text-gray-600 text-xs mt-1">Visit Daily Life to find work</p>
          </GlassCard>
        </motion.div>
      )}

      {needs && (
        <motion.div variants={fadeUp}>
          <GlassCard className="p-4 border border-white/5">
            <div className="grid grid-cols-4 gap-3">
              {[
                { emoji: "🍽️", label: "Hunger", value: needs.hunger },
                { emoji: "⚡", label: "Energy", value: needs.energy },
                { emoji: "💧", label: "Hygiene", value: needs.hygiene },
                { emoji: "💬", label: "Social", value: needs.social },
              ].map(n => (
                <div key={n.label} className="text-center">
                  <p className="text-lg mb-0.5">{n.emoji}</p>
                  <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden mb-0.5">
                    <div className={`h-full rounded-full ${n.value >= 60 ? "bg-emerald-500" : n.value >= 30 ? "bg-yellow-500" : "bg-red-500"}`} style={{ width: `${n.value}%` }} />
                  </div>
                  <p className="text-[9px] text-gray-600">{n.label}</p>
                </div>
              ))}
            </div>
          </GlassCard>
        </motion.div>
      )}
    </motion.div>
  );
}

function LoadingState() {
  return <ShimmerLoader />;
}

export default function ChroniclesSeasonHub() {
  const [activeTab, setActiveTab] = useState<TabId>("season");

  const tabContent: Record<TabId, React.ReactNode> = {
    season: <SeasonProgressTab />,
    legacy: <LegacyTreeTab />,
    pets: <PetsTab />,
    life: <DailyLifeTab />,
    relationships: <RelationshipsTab />,
    events: <WorldEventsTab />,
    home: <HomeTab />,
    chain: <DecisionChainTab />,
  };

  return (
    <div className="min-h-screen bg-slate-950 pb-20 relative" data-testid="season-hub-page">
      <AmbientBackground />

      <div className="relative z-10">
        <div className="pt-4 pb-6 px-4 sm:px-6 lg:px-8">
          <div className="container mx-auto">
            <div className="flex items-center gap-2 mb-4">
              <Link href="/chronicles/play">
                <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white min-h-[44px] min-w-[44px]" data-testid="back-to-play">
                  <ArrowLeft className="w-5 h-5" />
                </Button>
              </Link>
              <div className="flex-1">
                <motion.h1
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-2xl sm:text-3xl font-black bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent leading-tight"
                >
                  Season Zero
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="text-xs text-gray-500"
                >
                  Your journey across all eras
                </motion.p>
              </div>
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
              >
                <Badge className="bg-gradient-to-r from-cyan-500/20 to-purple-500/20 text-cyan-400 border border-cyan-500/20 px-3 py-1">
                  <Sparkles className="w-3 h-3 mr-1 animate-pulse" /> S0
                </Badge>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide"
            >
              <div className="flex gap-1 min-w-max">
                {TABS.map((tab, idx) => {
                  const isActive = activeTab === tab.id;
                  return (
                    <motion.button
                      key={tab.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.05 * idx }}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all whitespace-nowrap min-h-[44px] relative ${
                        isActive
                          ? "bg-gradient-to-r from-cyan-500/20 to-purple-500/20 text-cyan-300 border border-cyan-500/30 shadow-lg shadow-cyan-500/10"
                          : "text-gray-500 hover:text-gray-300 hover:bg-white/5 border border-transparent active:scale-95"
                      }`}
                      data-testid={`tab-${tab.id}`}
                    >
                      {isActive && (
                        <motion.div
                          layoutId="activeTabGlow"
                          className="absolute inset-0 rounded-xl bg-cyan-500/10"
                          transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                        />
                      )}
                      <span className="relative z-10 flex items-center gap-1.5">
                        <tab.icon className="w-4 h-4" />
                        <span className="hidden sm:inline">{tab.label}</span>
                        <span className="sm:hidden">{tab.emoji}</span>
                      </span>
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          </div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
            >
              {tabContent[activeTab]}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
