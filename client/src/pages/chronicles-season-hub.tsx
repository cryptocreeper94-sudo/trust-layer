import { useState } from "react";
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
  CheckCircle2, XCircle, Loader2, Plus, Skull,
} from "lucide-react";

const TABS = [
  { id: "season", label: "Season Progress", icon: Trophy },
  { id: "legacy", label: "Legacy Tree", icon: TreePine },
  { id: "relationships", label: "Relationships", icon: Users },
  { id: "events", label: "World Events", icon: Globe },
  { id: "home", label: "Home", icon: Home },
  { id: "chain", label: "Decision Chain", icon: Link2 },
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
        <GlassCard glow className="p-5 border border-cyan-500/20">
          <div className="flex items-center gap-2 mb-4">
            <Trophy className="w-5 h-5 text-yellow-400" />
            <h3 className="text-white font-bold text-lg" data-testid="season-title">Season Zero</h3>
            <Badge className="bg-cyan-500/20 text-cyan-400 ml-auto">Score: {seasonScore}</Badge>
          </div>
          <div className="grid grid-cols-3 gap-3 mb-4">
            <div className="text-center p-3 rounded-lg bg-white/5">
              <p className="text-xl font-bold text-cyan-400" data-testid="stat-score">{seasonScore}</p>
              <p className="text-[10px] text-gray-500">Season Score</p>
            </div>
            <div className="text-center p-3 rounded-lg bg-white/5">
              <p className="text-xl font-bold text-purple-400" data-testid="stat-legacies">{totalLegacies}</p>
              <p className="text-[10px] text-gray-500">Total Legacies</p>
            </div>
            <div className="text-center p-3 rounded-lg bg-white/5">
              <p className="text-xl font-bold text-green-400" data-testid="stat-decisions">{totalDecisions}</p>
              <p className="text-[10px] text-gray-500">Total Decisions</p>
            </div>
          </div>
        </GlassCard>
      </motion.div>

      <motion.div variants={fadeUp}>
        <GlassCard className="p-5">
          <h4 className="text-white font-semibold mb-3 flex items-center gap-2">
            <Activity className="w-4 h-4 text-cyan-400" /> Era Progress
          </h4>
          <div className="space-y-4">
            {eras.map((era: any, i: number) => (
              <div key={i} data-testid={`era-progress-${i}`}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-300">{era.emoji} {era.name}</span>
                  <span className="text-gray-400">{era.progress || 0}%</span>
                </div>
                <div className="h-2.5 bg-slate-800 rounded-full overflow-hidden">
                  <motion.div
                    className={`h-full rounded-full ${era.color || "bg-cyan-500"}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${era.progress || 0}%` }}
                    transition={{ duration: 0.8, delay: i * 0.15 }}
                  />
                </div>
              </div>
            ))}
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
        <GlassCard glow={finaleUnlocked} className={`p-5 border ${finaleUnlocked ? "border-yellow-500/30" : "border-white/10"}`}>
          <div className="flex items-center gap-3">
            {finaleUnlocked ? (
              <Sparkles className="w-6 h-6 text-yellow-400" />
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
              className={finaleUnlocked ? "bg-yellow-500 hover:bg-yellow-600 text-black" : ""}
              data-testid="finale-button"
            >
              {finaleUnlocked ? "Enter Finale" : "Locked"}
            </Button>
          </div>
        </GlassCard>
      </motion.div>
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

  return (
    <motion.div variants={stagger} initial="hidden" animate="visible" className="space-y-4">
      <motion.div variants={fadeUp}>
        <GlassCard glow className="p-5 border border-cyan-500/20">
          <div className="flex items-center gap-3">
            <Link2 className="w-5 h-5 text-cyan-400" />
            <div className="flex-1">
              <h4 className="text-white font-bold">Decision Blockchain</h4>
              <p className="text-xs text-gray-500">Every choice is permanently recorded</p>
            </div>
            <div className="flex items-center gap-2">
              <Badge className={`${isValid ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}`} data-testid="chain-validity">
                {isValid ? <><CheckCircle2 className="w-3 h-3 mr-1" /> Valid</> : <><XCircle className="w-3 h-3 mr-1" /> Invalid</>}
              </Badge>
              <Badge className="bg-white/10 text-gray-300" data-testid="total-blocks">
                {totalBlocks} blocks
              </Badge>
            </div>
          </div>
        </GlassCard>
      </motion.div>

      {Array.isArray(blocks) && blocks.length === 0 ? (
        <motion.div variants={fadeUp}>
          <GlassCard className="p-6 text-center">
            <Link2 className="w-8 h-8 text-gray-600 mx-auto mb-2" />
            <p className="text-gray-500 text-sm">No decisions recorded yet. Play the game to build your chain!</p>
          </GlassCard>
        </motion.div>
      ) : (
        <div className="space-y-0">
          {Array.isArray(blocks) && blocks.map((block: any, i: number) => (
            <motion.div
              key={block.id || i}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.06 }}
              className="flex gap-3"
              data-testid={`chain-block-${i}`}
            >
              <div className="flex flex-col items-center">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500/30 to-purple-500/30 flex items-center justify-center border border-cyan-500/20 text-[10px] font-bold text-cyan-400">
                  #{block.number || i + 1}
                </div>
                {i < blocks.length - 1 && (
                  <div className="w-px flex-1 bg-gradient-to-b from-cyan-500/30 to-purple-500/30 min-h-[8px]" />
                )}
              </div>
              <GlassCard hover={false} className="flex-1 mb-2">
                <div className="p-3">
                  <div className="flex items-start justify-between mb-1">
                    <h5 className="text-white font-medium text-sm">{block.decisionTitle || block.title || "Decision"}</h5>
                    {block.era && <Badge className="bg-white/10 text-gray-400 text-[9px]">{block.era}</Badge>}
                  </div>
                  {block.choice && (
                    <p className="text-xs text-cyan-400 mb-1">→ {block.choice}</p>
                  )}
                  <div className="flex items-center gap-2 text-[10px] text-gray-600">
                    {block.hash && <span className="font-mono">#{block.hash.substring(0, 12)}...</span>}
                    {block.timestamp && <span>{new Date(block.timestamp).toLocaleString()}</span>}
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
}

function LoadingState() {
  return (
    <div className="flex items-center justify-center py-12">
      <Loader2 className="w-6 h-6 text-cyan-400 animate-spin" />
      <span className="ml-2 text-gray-400 text-sm">Loading...</span>
    </div>
  );
}

export default function ChroniclesSeasonHub() {
  const [activeTab, setActiveTab] = useState<TabId>("season");

  const tabContent: Record<TabId, React.ReactNode> = {
    season: <SeasonProgressTab />,
    legacy: <LegacyTreeTab />,
    relationships: <RelationshipsTab />,
    events: <WorldEventsTab />,
    home: <HomeTab />,
    chain: <DecisionChainTab />,
  };

  return (
    <div className="min-h-screen bg-slate-950 pb-20" data-testid="season-hub-page">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <div className="flex items-center gap-3 mb-6">
          <Link href="/chronicles/play">
            <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white" data-testid="back-to-play">
              <ArrowLeft className="w-4 h-4 mr-1" /> Back
            </Button>
          </Link>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-white">Season Zero Hub</h1>
            <p className="text-xs text-gray-500">All game systems at a glance</p>
          </div>
          <Badge className="bg-cyan-500/20 text-cyan-400">
            <Sparkles className="w-3 h-3 mr-1" /> Season 0
          </Badge>
        </div>

        <div className="overflow-x-auto pb-2 mb-6 -mx-4 px-4 scrollbar-hide">
          <div className="flex gap-1.5 min-w-max">
            {TABS.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                    isActive
                      ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30"
                      : "text-gray-500 hover:text-gray-300 hover:bg-white/5 border border-transparent"
                  }`}
                  data-testid={`tab-${tab.id}`}
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {tabContent[activeTab]}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
