import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { GlassCard } from "@/components/glass-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { Link } from "wouter";
import { getChroniclesSession } from "./chronicles-login";
import {
  MapPin, Users, Compass, ChevronRight, ArrowLeft, Star,
  Zap, Clock, Eye, Sparkles, Target, Crosshair, Trophy,
  Play, RotateCcw, Volume2, Loader2, Footprints,
  Swords, TreePine, Building, Home, Shield, Crown,
} from "lucide-react";

const ERA_CONFIG: Record<string, any> = {
  modern: { name: "Modern City", textColor: "text-cyan-400", borderColor: "border-cyan-500/30", bgGradient: "from-cyan-500/20 to-blue-600/20", badgeClass: "bg-cyan-500/20 text-cyan-400", accentColor: "#06b6d4" },
  medieval: { name: "Kingdom", textColor: "text-amber-400", borderColor: "border-amber-500/30", bgGradient: "from-amber-500/20 to-orange-600/20", badgeClass: "bg-amber-500/20 text-amber-400", accentColor: "#d97706" },
  wildwest: { name: "Frontier", textColor: "text-yellow-400", borderColor: "border-yellow-500/30", bgGradient: "from-yellow-500/20 to-orange-600/20", badgeClass: "bg-yellow-500/20 text-yellow-400", accentColor: "#eab308" },
};

function MiniGame({ gameType, config, era, zoneId, onClose, onSubmit }: {
  gameType: string; config: any; era: string; zoneId: string;
  onClose: () => void; onSubmit: (score: number) => void;
}) {
  const [gameState, setGameState] = useState<"ready" | "playing" | "done">("ready");
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(config.durationSeconds);
  const [targets, setTargets] = useState<Array<{ id: number; x: number; y: number; hit: boolean; type: string; spawned: number }>>([]);
  const targetIdRef = useRef(0);
  const intervalRef = useRef<any>(null);
  const spawnRef = useRef<any>(null);

  const startGame = useCallback(() => {
    setGameState("playing");
    setScore(0);
    setTimeLeft(config.durationSeconds);
    setTargets([]);
    targetIdRef.current = 0;
  }, [config.durationSeconds]);

  useEffect(() => {
    if (gameState !== "playing") return;

    intervalRef.current = setInterval(() => {
      setTimeLeft((prev: number) => {
        if (prev <= 1) {
          clearInterval(intervalRef.current);
          clearInterval(spawnRef.current);
          setGameState("done");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    const spawnRate = gameType === "quickdraw" ? 3000 :
      gameType === "arm_wrestling" || gameType === "horse_breaking" ? 500 :
      gameType === "gold_panning" ? 1200 : 1500;

    spawnRef.current = setInterval(() => {
      const id = ++targetIdRef.current;
      const x = 10 + Math.random() * 75;
      const y = 10 + Math.random() * 65;
      const types = gameType === "gold_panning"
        ? (Math.random() > 0.3 ? "nugget" : "fools_gold")
        : gameType === "hunting"
        ? (Math.random() > 0.4 ? "deer" : "rabbit")
        : "target";

      setTargets(prev => [...prev.filter(t => !t.hit && Date.now() - t.spawned < 3000), { id, x, y, hit: false, type: types, spawned: Date.now() }]);
    }, spawnRate);

    return () => { clearInterval(intervalRef.current); clearInterval(spawnRef.current); };
  }, [gameState, gameType]);

  const hitTarget = (id: number, type: string) => {
    if (gameState !== "playing") return;
    const points = type === "fools_gold" ? -5 :
      type === "deer" ? 15 : type === "rabbit" ? 10 :
      type === "bullseye" ? 20 : 10;
    setScore(prev => Math.max(0, prev + points));
    setTargets(prev => prev.map(t => t.id === id ? { ...t, hit: true } : t));
  };

  const rapidTap = () => {
    if (gameState !== "playing") return;
    setScore(prev => Math.min(config.maxScore, prev + 2));
  };

  const scorePercent = Math.min(100, (score / config.maxScore) * 100);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/90 flex flex-col"
    >
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{config.emoji}</span>
          <div>
            <h3 className="text-white font-bold">{config.name}</h3>
            <p className="text-xs text-gray-400">{config.description}</p>
          </div>
        </div>
        <Button variant="ghost" size="sm" onClick={onClose} data-testid="close-minigame">
          <ArrowLeft className="w-4 h-4 text-white" />
        </Button>
      </div>

      {gameState === "ready" && (
        <div className="flex-1 flex flex-col items-center justify-center px-8 gap-6">
          <div className="text-6xl">{config.emoji}</div>
          <h2 className="text-white text-2xl font-bold text-center">{config.name}</h2>
          <p className="text-gray-400 text-center text-sm max-w-sm">{config.instructions}</p>
          <div className="flex items-center gap-2 text-gray-500 text-xs">
            <Clock className="w-3 h-3" />
            <span>{config.durationSeconds} seconds</span>
          </div>
          <Button onClick={startGame} className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-8 py-3 text-lg" data-testid="start-minigame">
            <Play className="w-5 h-5 mr-2" /> Start
          </Button>
        </div>
      )}

      {gameState === "playing" && (
        <div className="flex-1 flex flex-col">
          <div className="flex items-center justify-between px-4 py-2">
            <div className="flex items-center gap-2">
              <Badge className="bg-yellow-500/20 text-yellow-400">Score: {score}</Badge>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-red-400" />
              <span className={`text-sm font-bold ${timeLeft <= 5 ? "text-red-400 animate-pulse" : "text-white"}`}>{timeLeft}s</span>
            </div>
          </div>
          <Progress value={scorePercent} className="mx-4 h-2" />

          {(gameType === "arm_wrestling" || gameType === "horse_breaking") ? (
            <div className="flex-1 flex flex-col items-center justify-center gap-6 px-8"
              onClick={rapidTap} data-testid="rapid-tap-area">
              <div className="text-7xl animate-bounce">{config.emoji}</div>
              <p className="text-white text-lg font-bold text-center">TAP RAPIDLY!</p>
              <Progress value={scorePercent} className="w-full h-4" />
              <p className="text-gray-400 text-sm">Keep tapping to {gameType === "arm_wrestling" ? "overpower your opponent" : "stay on the horse"}!</p>
            </div>
          ) : gameType === "quickdraw" ? (
            <div className="flex-1 flex flex-col items-center justify-center gap-6 px-8">
              {timeLeft > config.durationSeconds - 3 ? (
                <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 0.8 }}>
                  <p className="text-yellow-400 text-3xl font-bold">WAIT FOR IT...</p>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: [0, 1.5, 1] }}
                  className="cursor-pointer"
                  onClick={() => { setScore(prev => Math.min(100, prev + 50)); }}
                  data-testid="quickdraw-target"
                >
                  <p className="text-red-500 text-5xl font-bold animate-pulse">DRAW!</p>
                  <Crosshair className="w-20 h-20 text-red-500 mx-auto mt-4" />
                </motion.div>
              )}
            </div>
          ) : (
            <div className="flex-1 relative overflow-hidden mx-4 my-2 rounded-xl bg-slate-900/80 border border-white/10"
              data-testid="game-area">
              <AnimatePresence>
                {targets.filter(t => !t.hit).map(target => (
                  <motion.div
                    key={target.id}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="absolute cursor-pointer"
                    style={{ left: `${target.x}%`, top: `${target.y}%` }}
                    onClick={() => hitTarget(target.id, target.type)}
                    data-testid={`target-${target.id}`}
                  >
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl
                      ${target.type === "fools_gold" ? "bg-gray-500/30 border-2 border-gray-400/50" :
                        target.type === "deer" ? "bg-amber-500/20 border-2 border-amber-400/50" :
                        target.type === "rabbit" ? "bg-green-500/20 border-2 border-green-400/50" :
                        target.type === "nugget" ? "bg-yellow-500/30 border-2 border-yellow-400/50" :
                        "bg-red-500/20 border-2 border-red-400/50"}`}>
                      {target.type === "deer" ? "🦌" :
                       target.type === "rabbit" ? "🐇" :
                       target.type === "nugget" ? "✨" :
                       target.type === "fools_gold" ? "🪨" :
                       "🎯"}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              {targets.filter(t => !t.hit).length === 0 && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <p className="text-gray-600 text-sm animate-pulse">Waiting for targets...</p>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {gameState === "done" && (
        <div className="flex-1 flex flex-col items-center justify-center px-8 gap-6">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200 }}
            className="text-7xl"
          >
            {score >= 80 ? "🏆" : score >= 50 ? "⭐" : "💪"}
          </motion.div>
          <h2 className="text-white text-2xl font-bold">
            {score >= 80 ? "Excellent!" : score >= 50 ? "Good Job!" : "Keep Practicing!"}
          </h2>
          <div className="text-center space-y-2">
            <p className="text-4xl font-bold text-white">{score}</p>
            <p className="text-gray-400 text-sm">points scored</p>
          </div>
          <p className="text-xs text-gray-500">Submit your score to earn Echoes and XP</p>
          <div className="flex gap-3">
            <Button variant="outline" onClick={startGame} data-testid="replay-minigame">
              <RotateCcw className="w-4 h-4 mr-2" /> Play Again
            </Button>
            <Button onClick={() => onSubmit(score)} className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white" data-testid="submit-score">
              <Trophy className="w-4 h-4 mr-2" /> Collect Rewards
            </Button>
          </div>
        </div>
      )}
    </motion.div>
  );
}

export default function ChroniclesWorld() {
  const session = getChroniclesSession();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [selectedZone, setSelectedZone] = useState<string | null>(null);
  const [activeMinigame, setActiveMinigame] = useState<{ gameType: string; config: any; zoneId: string } | null>(null);
  const [activityResult, setActivityResult] = useState<any>(null);
  const [arrivalNarrative, setArrivalNarrative] = useState<string | null>(null);

  const era = (session as any)?.era || "modern";
  const config = ERA_CONFIG[era] || ERA_CONFIG.modern;

  const { data: worldData, isLoading } = useQuery({
    queryKey: ["/api/chronicles/world/zones", era],
    queryFn: async () => {
      const res = await fetch(`/api/chronicles/world/zones/${era}`, {
        headers: { Authorization: `Bearer ${session?.token}` },
      });
      if (!res.ok) throw new Error("Failed to load world");
      return res.json();
    },
    enabled: !!session?.token,
    refetchInterval: 30000,
  });

  const { data: zoneDetail } = useQuery({
    queryKey: ["/api/chronicles/world/zone", era, selectedZone],
    queryFn: async () => {
      const res = await fetch(`/api/chronicles/world/zone/${era}/${selectedZone}`, {
        headers: { Authorization: `Bearer ${session?.token}` },
      });
      if (!res.ok) throw new Error("Failed to load zone");
      return res.json();
    },
    enabled: !!session?.token && !!selectedZone,
    refetchInterval: 15000,
  });

  useEffect(() => {
    if (!session?.token || !selectedZone) return;
    const interval = setInterval(() => {
      fetch("/api/chronicles/world/heartbeat", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${session.token}` },
        body: JSON.stringify({}),
      }).catch(() => {});
    }, 60000);
    return () => clearInterval(interval);
  }, [session?.token, selectedZone]);

  const enterZoneMutation = useMutation({
    mutationFn: async (zoneId: string) => {
      const res = await fetch("/api/chronicles/world/enter-zone", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${session?.token}` },
        body: JSON.stringify({ era, zoneId }),
      });
      if (!res.ok) throw new Error("Failed to enter zone");
      return res.json();
    },
    onSuccess: (data) => {
      setArrivalNarrative(data.arrivalNarrative);
      queryClient.invalidateQueries({ queryKey: ["/api/chronicles/world/zones"] });
      setTimeout(() => setArrivalNarrative(null), 8000);
    },
  });

  const doActivityMutation = useMutation({
    mutationFn: async (activityId: string) => {
      const res = await fetch("/api/chronicles/world/do-activity", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${session?.token}` },
        body: JSON.stringify({ activityId, era }),
      });
      if (!res.ok) throw new Error("Failed");
      return res.json();
    },
    onSuccess: (data) => {
      if (data.type === "minigame") {
        setActiveMinigame({ gameType: data.minigameType, config: data.config, zoneId: selectedZone || "" });
      } else {
        setActivityResult(data);
        queryClient.invalidateQueries({ queryKey: ["/api/chronicles/game-state"] });
      }
    },
    onError: (err: any) => {
      toast({ title: "Couldn't do that", description: err.message, variant: "destructive" });
    },
  });

  const submitScoreMutation = useMutation({
    mutationFn: async ({ gameType, score }: { gameType: string; score: number }) => {
      const res = await fetch("/api/chronicles/world/minigame/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${session?.token}` },
        body: JSON.stringify({ gameType, score, era, zoneId: selectedZone || "" }),
      });
      if (!res.ok) throw new Error("Failed");
      return res.json();
    },
    onSuccess: (data) => {
      setActiveMinigame(null);
      toast({
        title: data.isNewHighScore ? "New High Score!" : "Score Submitted",
        description: `${data.gameName}: ${data.score} pts — +${data.echosEarned} Echoes`,
      });
      queryClient.invalidateQueries({ queryKey: ["/api/chronicles/game-state"] });
      queryClient.invalidateQueries({ queryKey: ["/api/chronicles/world/zone"] });
    },
  });

  const handleEnterZone = (zoneId: string) => {
    setSelectedZone(zoneId);
    setActivityResult(null);
    enterZoneMutation.mutate(zoneId);
  };

  if (!session?.token) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <GlassCard className="p-6 text-center">
          <p className="text-gray-400">Please log in to Chronicles first</p>
          <Link href="/chronicles/play">
            <Button className="mt-4">Go to Chronicles</Button>
          </Link>
        </GlassCard>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950">
      <AnimatePresence>
        {activeMinigame && (
          <MiniGame
            gameType={activeMinigame.gameType}
            config={activeMinigame.config}
            era={era}
            zoneId={activeMinigame.zoneId}
            onClose={() => setActiveMinigame(null)}
            onSubmit={(score) => submitScoreMutation.mutate({ gameType: activeMinigame.gameType, score })}
          />
        )}
      </AnimatePresence>

      <div className={`sticky top-0 z-40 bg-slate-950/90 backdrop-blur-xl border-b ${config.borderColor}`}>
        <div className="container mx-auto px-4 py-3 max-w-2xl">
          <div className="flex items-center gap-3">
            {selectedZone ? (
              <Button variant="ghost" size="sm" onClick={() => { setSelectedZone(null); setActivityResult(null); setArrivalNarrative(null); }} data-testid="back-to-zones">
                <ArrowLeft className="w-4 h-4 text-white" />
              </Button>
            ) : (
              <Link href="/chronicles/play">
                <Button variant="ghost" size="sm" data-testid="back-to-play">
                  <ArrowLeft className="w-4 h-4 text-white" />
                </Button>
              </Link>
            )}
            <div className="flex-1">
              <h1 className={`text-lg font-bold ${config.textColor}`}>
                {selectedZone
                  ? worldData?.zones?.find((z: any) => z.id === selectedZone)?.name || "Zone"
                  : `${config.name} — Living World`}
              </h1>
              {worldData?.time && (
                <p className="text-xs text-gray-500">
                  {String(worldData.time.hour).padStart(2, "0")}:{String(worldData.time.minute).padStart(2, "0")} · {worldData.time.period}
                  {worldData.time.isDaytime ? " ☀️" : " 🌙"}
                </p>
              )}
            </div>
            <Compass className={`w-5 h-5 ${config.textColor}`} />
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 pt-4 pb-24 max-w-2xl">
        <AnimatePresence mode="wait">
          {!selectedZone ? (
            <motion.div key="zone-list" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-3">
              <GlassCard glow className="p-4 mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${config.bgGradient} flex items-center justify-center`}>
                    <Footprints className={`w-5 h-5 ${config.textColor}`} />
                  </div>
                  <div className="flex-1">
                    <p className="text-white font-medium text-sm">Explore the world around you</p>
                    <p className="text-xs text-gray-500">Each zone has its own life, activities, and people. Walk in and see what's happening.</p>
                  </div>
                </div>
              </GlassCard>

              {isLoading ? (
                <div className="flex justify-center py-12">
                  <Loader2 className="w-8 h-8 text-gray-500 animate-spin" />
                </div>
              ) : (
                worldData?.zones?.map((zone: any, i: number) => (
                  <motion.div
                    key={zone.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <div onClick={() => handleEnterZone(zone.id)} className="cursor-pointer" data-testid={`zone-${zone.id}`}>
                      <GlassCard glow className={`p-4 hover:border-cyan-500/30 transition-all ${zone.isCurrentZone ? `border-2 ${config.borderColor}` : ""}`}>
                        <div className="flex items-start gap-3">
                          <div className="text-2xl shrink-0">{zone.emoji}</div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <h3 className="text-white font-bold text-sm">{zone.name}</h3>
                              {zone.isCurrentZone && <Badge className={config.badgeClass}>Here</Badge>}
                            </div>
                            <p className="text-xs text-gray-400 mt-0.5 line-clamp-2">{zone.description}</p>
                            <div className="flex items-center gap-3 mt-2">
                              {zone.activeActivities > 0 && (
                                <div className="flex items-center gap-1">
                                  <Sparkles className="w-3 h-3 text-yellow-400" />
                                  <span className="text-[10px] text-yellow-400">{zone.activeActivities} happening</span>
                                </div>
                              )}
                              {zone.npcsPresent > 0 && (
                                <div className="flex items-center gap-1">
                                  <Users className="w-3 h-3 text-purple-400" />
                                  <span className="text-[10px] text-purple-400">{zone.npcNames?.join(", ")}</span>
                                </div>
                              )}
                              {zone.playersHere > 0 && (
                                <div className="flex items-center gap-1">
                                  <Eye className="w-3 h-3 text-green-400" />
                                  <span className="text-[10px] text-green-400">{zone.playersHere} here</span>
                                </div>
                              )}
                            </div>
                          </div>
                          <ChevronRight className="w-4 h-4 text-gray-600 shrink-0 mt-1" />
                        </div>
                      </GlassCard>
                    </div>
                  </motion.div>
                ))
              )}
            </motion.div>
          ) : (
            <motion.div key="zone-detail" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} className="space-y-4">
              <AnimatePresence>
                {arrivalNarrative && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                  >
                    <GlassCard glow className={`p-4 border ${config.borderColor}`}>
                      <p className="text-gray-300 text-sm italic leading-relaxed">{arrivalNarrative}</p>
                    </GlassCard>
                  </motion.div>
                )}
              </AnimatePresence>

              <AnimatePresence>
                {activityResult && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <GlassCard glow className="p-4 border border-green-500/30">
                      <p className="text-gray-300 text-sm leading-relaxed">{activityResult.narrative}</p>
                      <div className="flex items-center gap-4 mt-3">
                        <Badge className="bg-yellow-500/20 text-yellow-400">+{activityResult.rewards?.echoes} Echoes</Badge>
                        <Badge className="bg-cyan-500/20 text-cyan-400">+{activityResult.rewards?.xp} XP</Badge>
                      </div>
                      <Button variant="ghost" size="sm" className="mt-2 text-xs text-gray-500" onClick={() => setActivityResult(null)}>
                        Dismiss
                      </Button>
                    </GlassCard>
                  </motion.div>
                )}
              </AnimatePresence>

              {enterZoneMutation.isPending && (
                <div className="flex justify-center py-8">
                  <Loader2 className="w-6 h-6 text-gray-500 animate-spin" />
                </div>
              )}

              {zoneDetail?.npcsPresent?.length > 0 && (
                <div>
                  <h3 className="text-white font-bold text-sm mb-2 flex items-center gap-2">
                    <Users className="w-4 h-4 text-purple-400" /> People Here
                  </h3>
                  <div className="space-y-2">
                    {zoneDetail.npcsPresent.map((npc: any, i: number) => (
                      <motion.div key={npc.name} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}>
                        <GlassCard className="p-3">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500/30 to-pink-500/30 flex items-center justify-center">
                              <Users className="w-5 h-5 text-purple-400" />
                            </div>
                            <div className="flex-1">
                              <p className="text-white text-sm font-medium">{npc.name}</p>
                              <p className="text-[10px] text-gray-500">{npc.activity}</p>
                            </div>
                            <div className="text-right">
                              <Badge className={`text-[10px] ${npc.relationshipScore > 0 ? "bg-green-500/20 text-green-400" : npc.relationshipScore < 0 ? "bg-red-500/20 text-red-400" : "bg-gray-500/20 text-gray-400"}`}>
                                {npc.relationshipScore > 0 ? "+" : ""}{npc.relationshipScore}
                              </Badge>
                            </div>
                          </div>
                        </GlassCard>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {zoneDetail?.activities?.length > 0 && (
                <div>
                  <h3 className="text-white font-bold text-sm mb-2 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-yellow-400" /> What's Happening
                  </h3>
                  <div className="space-y-2">
                    {zoneDetail.activities.map((activity: any, i: number) => (
                      <motion.div key={activity.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                        <GlassCard glow className={`p-4 ${!activity.isAvailable ? "opacity-50" : "hover:border-cyan-500/30 transition-all"}`}>
                          <div className="flex items-start gap-3">
                            <div className="text-2xl shrink-0">{activity.emoji}</div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 flex-wrap">
                                <h4 className="text-white font-medium text-sm">{activity.name}</h4>
                                {activity.minigameType && (
                                  <Badge className="bg-purple-500/20 text-purple-400 text-[10px]">
                                    <Target className="w-2.5 h-2.5 mr-1" /> Mini-Game
                                  </Badge>
                                )}
                                {activity.toolsInvolved?.length > 0 && (
                                  <Badge className="bg-amber-500/20 text-amber-400 text-[10px]">
                                    {activity.toolsInvolved.join(", ")}
                                  </Badge>
                                )}
                              </div>
                              <p className="text-xs text-gray-400 mt-0.5">{activity.description}</p>
                              <div className="flex items-center gap-3 mt-2">
                                <span className="text-[10px] text-yellow-400">+{activity.echoReward} Echoes</span>
                                <span className="text-[10px] text-cyan-400">+{activity.xpReward} XP</span>
                                {activity.requiredLevel > 0 && (
                                  <span className="text-[10px] text-gray-600">Lvl {activity.requiredLevel}+</span>
                                )}
                              </div>
                            </div>
                            <Button
                              size="sm"
                              variant="outline"
                              disabled={!activity.isAvailable || doActivityMutation.isPending}
                              onClick={() => doActivityMutation.mutate(activity.id)}
                              className="shrink-0"
                              data-testid={`do-activity-${activity.id}`}
                            >
                              {doActivityMutation.isPending ? (
                                <Loader2 className="w-3 h-3 animate-spin" />
                              ) : activity.minigameType ? (
                                <Play className="w-3 h-3" />
                              ) : (
                                <Zap className="w-3 h-3" />
                              )}
                            </Button>
                          </div>
                        </GlassCard>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {zoneDetail?.adjacentZones?.length > 0 && (
                <div>
                  <h3 className="text-white font-bold text-sm mb-2 flex items-center gap-2">
                    <Compass className="w-4 h-4 text-green-400" /> Nearby
                  </h3>
                  <div className="grid grid-cols-2 gap-2">
                    {zoneDetail.adjacentZones.map((adj: any) => (
                      <div
                        key={adj.id}
                        onClick={() => handleEnterZone(adj.id)}
                        className="cursor-pointer"
                        data-testid={`goto-${adj.id}`}
                      >
                        <GlassCard className="p-3 hover:bg-white/5 transition-all">
                          <div className="flex items-center gap-2">
                            <span className="text-lg">{adj.emoji}</span>
                            <div className="min-w-0">
                              <p className="text-white text-xs font-medium truncate">{adj.name}</p>
                              <p className="text-[10px] text-gray-500">Walk there</p>
                            </div>
                          </div>
                        </GlassCard>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {zoneDetail?.playerCount > 1 && (
                <GlassCard className="p-3">
                  <div className="flex items-center gap-2">
                    <Eye className="w-4 h-4 text-green-400" />
                    <span className="text-xs text-green-400">{zoneDetail.playerCount - 1} other {zoneDetail.playerCount - 1 === 1 ? "person" : "people"} here</span>
                  </div>
                </GlassCard>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}