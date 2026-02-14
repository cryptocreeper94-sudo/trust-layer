import { useState, useEffect, useRef, Suspense, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, Stars, Float, Text3D, Center } from "@react-three/drei";
import * as THREE from "three";
import { GlassCard } from "@/components/glass-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { Link } from "wouter";
import { getChroniclesSession } from "./chronicles-login";
import { ChroniclesChatPanel } from "@/components/chronicles-chat-panel";
import {
  Compass, Users, Shield, Crown, Sparkles, MapPin, Swords,
  ChevronRight, Sun, Moon, CloudSun, Sunrise, Sunset,
  Heart, Zap, Eye, Send, Star, Brain, Trophy,
  Home, Building, TreePine, ArrowLeft, Globe, Timer,
  TrendingUp, Activity, Flame, Gift, Target,
  MessageCircle, Volume2, Loader2, Award, Play, Lock,
  RotateCcw, ArrowRight, CheckCircle2, XCircle,
  ShoppingBag, BookOpen, Bell,
} from "lucide-react";

function WorldClockBanner({ era }: { era: string }) {
  const { data: worldTime } = useQuery({
    queryKey: ["/api/chronicles/world-clock", era],
    queryFn: async () => {
      const res = await fetch(`/api/chronicles/world-clock/${era}`);
      if (!res.ok) return null;
      return res.json();
    },
    refetchInterval: 60000,
    staleTime: 30000,
  });

  if (!worldTime) return null;

  const timeIcons: Record<string, any> = {
    dawn: Sunrise, morning: Sun, afternoon: CloudSun,
    evening: Sunset, night: Moon, midnight: Moon,
  };
  const TimeIcon = timeIcons[worldTime.period] || Sun;
  const isDaytime = worldTime.isDaytime;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-3"
    >
      <GlassCard hover={false} className={`${isDaytime ? "" : "border-purple-500/20"}`}>
        <div className="flex items-center gap-3 px-4 py-2">
          <TimeIcon className={`w-4 h-4 ${isDaytime ? "text-yellow-400" : "text-purple-400"}`} />
          <div className="flex-1">
            <span className="text-xs text-white font-medium">{worldTime.eraLabel}</span>
            <span className="text-[10px] text-gray-500 ml-2">
              {String(worldTime.hour).padStart(2, "0")}:{String(worldTime.minute).padStart(2, "0")} &middot; {worldTime.dayOfWeek}
            </span>
          </div>
          <Badge className={`text-[9px] ${isDaytime ? "bg-yellow-500/15 text-yellow-400" : "bg-purple-500/15 text-purple-400"}`}>
            {isDaytime ? "Day" : "Night"}
          </Badge>
        </div>
      </GlassCard>
    </motion.div>
  );
}

const ERA_CONFIG = {
  modern: {
    name: "Modern Era", color: "cyan", emoji: "🏙️",
    bgGradient: "from-cyan-500/20 to-blue-600/20",
    borderColor: "border-cyan-500/30",
    textColor: "text-cyan-400",
    badgeClass: "bg-cyan-500/20 text-cyan-400",
    skyColor: "#0a1628", groundColor: "#1a1a2e",
    fogColor: "#0a1628", particleColor: "#06b6d4",
  },
  medieval: {
    name: "Medieval Era", color: "amber", emoji: "🏰",
    bgGradient: "from-amber-500/20 to-orange-600/20",
    borderColor: "border-amber-500/30",
    textColor: "text-amber-400",
    badgeClass: "bg-amber-500/20 text-amber-400",
    skyColor: "#1a0f00", groundColor: "#2d1f0e",
    fogColor: "#1a0f00", particleColor: "#d97706",
  },
  wildwest: {
    name: "Wild West", color: "yellow", emoji: "🤠",
    bgGradient: "from-yellow-500/20 to-orange-600/20",
    borderColor: "border-yellow-500/30",
    textColor: "text-yellow-400",
    badgeClass: "bg-yellow-500/20 text-yellow-400",
    skyColor: "#1a1200", groundColor: "#3d2b10",
    fogColor: "#1a1200", particleColor: "#eab308",
  },
};

function EraEnvironment({ era }: { era: keyof typeof ERA_CONFIG }) {
  const config = ERA_CONFIG[era];
  const groupRef = useRef<THREE.Group>(null);
  const particlesRef = useRef<THREE.Points>(null);

  const particles = useMemo(() => {
    const count = 200;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 30;
      positions[i * 3 + 1] = Math.random() * 15;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 30;
    }
    return positions;
  }, []);

  useFrame((state) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y = state.clock.elapsedTime * 0.02;
      const positions = particlesRef.current.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < positions.length / 3; i++) {
        positions[i * 3 + 1] += Math.sin(state.clock.elapsedTime * 0.5 + i) * 0.002;
      }
      particlesRef.current.geometry.attributes.position.needsUpdate = true;
    }
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.1) * 0.05;
    }
  });

  const structures = useMemo(() => {
    if (era === "medieval") {
      return (
        <>
          <mesh position={[0, 1.5, -8]} castShadow>
            <boxGeometry args={[3, 3, 3]} />
            <meshStandardMaterial color="#8B7355" roughness={0.9} />
          </mesh>
          <mesh position={[0, 3.5, -8]} castShadow>
            <coneGeometry args={[2.5, 2, 4]} />
            <meshStandardMaterial color="#5C3A1E" roughness={0.8} />
          </mesh>
          <mesh position={[-6, 1, -5]} castShadow>
            <boxGeometry args={[2, 2, 2]} />
            <meshStandardMaterial color="#A0855B" roughness={0.9} />
          </mesh>
          <mesh position={[-6, 2.5, -5]} castShadow>
            <coneGeometry args={[1.8, 1.5, 4]} />
            <meshStandardMaterial color="#6B4226" roughness={0.8} />
          </mesh>
          <mesh position={[5, 2.5, -6]} castShadow>
            <cylinderGeometry args={[0.8, 1, 5, 8]} />
            <meshStandardMaterial color="#696969" roughness={0.7} />
          </mesh>
          <mesh position={[5, 5.5, -6]} castShadow>
            <coneGeometry args={[1.2, 1.5, 8]} />
            <meshStandardMaterial color="#4A4A4A" roughness={0.6} />
          </mesh>
          {[-3, 3, 7, -7].map((x, i) => (
            <group key={i} position={[x, 0, -3 + i * 2]}>
              <mesh position={[0, 1.5, 0]}>
                <cylinderGeometry args={[0.15, 0.2, 3, 6]} />
                <meshStandardMaterial color="#5C4033" roughness={0.9} />
              </mesh>
              <mesh position={[0, 3.2, 0]}>
                <sphereGeometry args={[1.2, 8, 6]} />
                <meshStandardMaterial color="#2D5016" roughness={0.8} />
              </mesh>
            </group>
          ))}
        </>
      );
    }
    if (era === "wildwest") {
      return (
        <>
          <mesh position={[0, 1.5, -7]} castShadow>
            <boxGeometry args={[4, 3, 3]} />
            <meshStandardMaterial color="#C4A574" roughness={0.95} />
          </mesh>
          <mesh position={[0, 3.2, -6]}>
            <boxGeometry args={[4.5, 0.5, 0.3]} />
            <meshStandardMaterial color="#8B6914" roughness={0.9} />
          </mesh>
          <mesh position={[-5, 1, -5]} castShadow>
            <boxGeometry args={[3, 2, 2.5]} />
            <meshStandardMaterial color="#B8956A" roughness={0.95} />
          </mesh>
          <mesh position={[6, 0.5, -4]} castShadow>
            <cylinderGeometry args={[1.5, 1.5, 1, 12]} />
            <meshStandardMaterial color="#8B7355" roughness={0.9} />
          </mesh>
          {[4, -4, 8, -8].map((x, i) => (
            <group key={i} position={[x, 0, -2 + i]}>
              <mesh position={[0, 1.8, 0]}>
                <cylinderGeometry args={[0.08, 0.15, 3.5, 5]} />
                <meshStandardMaterial color="#5C8A3C" roughness={0.8} />
              </mesh>
              <mesh position={[0, 3, 0.3]}>
                <sphereGeometry args={[0.5, 6, 6]} />
                <meshStandardMaterial color="#2D6B16" roughness={0.8} />
              </mesh>
              <mesh position={[0.3, 2.5, 0]}>
                <sphereGeometry args={[0.4, 6, 6]} />
                <meshStandardMaterial color="#3D7B26" roughness={0.8} />
              </mesh>
            </group>
          ))}
        </>
      );
    }
    return (
      <>
        <mesh position={[0, 3, -8]} castShadow>
          <boxGeometry args={[3, 6, 3]} />
          <meshStandardMaterial color="#334155" roughness={0.3} metalness={0.6} />
        </mesh>
        {Array.from({ length: 6 }).map((_, i) => (
          <mesh key={i} position={[0.8 * (i % 2 === 0 ? 1 : -1), 1 + i, -6.49]} castShadow>
            <boxGeometry args={[0.8, 0.6, 0.05]} />
            <meshStandardMaterial color="#06b6d4" emissive="#06b6d4" emissiveIntensity={0.3} />
          </mesh>
        ))}
        <mesh position={[-5, 2, -6]} castShadow>
          <boxGeometry args={[2.5, 4, 2.5]} />
          <meshStandardMaterial color="#475569" roughness={0.4} metalness={0.5} />
        </mesh>
        <mesh position={[5, 1.5, -5]} castShadow>
          <boxGeometry args={[2, 3, 2]} />
          <meshStandardMaterial color="#1e293b" roughness={0.3} metalness={0.7} />
        </mesh>
        <mesh position={[5, 3.5, -5]}>
          <cylinderGeometry args={[0.05, 0.05, 2, 8]} />
          <meshStandardMaterial color="#64748b" />
        </mesh>
        <mesh position={[5, 4.6, -5]}>
          <sphereGeometry args={[0.15, 8, 8]} />
          <meshStandardMaterial color="#ef4444" emissive="#ef4444" emissiveIntensity={0.5} />
        </mesh>
      </>
    );
  }, [era]);

  return (
    <group ref={groupRef}>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
        <planeGeometry args={[40, 40]} />
        <meshStandardMaterial color={config.groundColor} roughness={0.95} />
      </mesh>
      {structures}
      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[particles, 3]} />
        </bufferGeometry>
        <pointsMaterial size={0.05} color={config.particleColor} transparent opacity={0.6} sizeAttenuation />
      </points>
      <Stars radius={50} depth={50} count={1000} factor={2} saturation={0} fade speed={0.5} />
      <fog attach="fog" args={[config.fogColor, 10, 30]} />
      <ambientLight intensity={0.3} />
      <directionalLight position={[5, 8, 5]} intensity={0.8} castShadow />
      <pointLight position={[0, 5, 0]} intensity={0.4} color={config.particleColor} />
    </group>
  );
}

function Scene3D({ era }: { era: keyof typeof ERA_CONFIG }) {
  return (
    <div className="absolute inset-0 rounded-xl overflow-hidden" data-testid="3d-scene">
      <Canvas shadows camera={{ position: [0, 4, 12], fov: 55 }} gl={{ antialias: true }}>
        <Suspense fallback={null}>
          <EraEnvironment era={era} />
        </Suspense>
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          autoRotate
          autoRotateSpeed={0.3}
          maxPolarAngle={Math.PI / 2.2}
          minPolarAngle={Math.PI / 4}
        />
      </Canvas>
    </div>
  );
}

function XPBar({ xp, nextLevelXp, level }: { xp: number; nextLevelXp: number; level: number }) {
  const pct = Math.min(100, (xp / nextLevelXp) * 100);
  return (
    <div className="w-full" data-testid="xp-bar">
      <div className="flex justify-between text-xs mb-1">
        <span className="text-gray-400">Level {level}</span>
        <span className="text-cyan-400">{xp} / {nextLevelXp} XP</span>
      </div>
      <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}

function StatChange({ stat, change }: { stat: string; change: number }) {
  if (change === 0) return null;
  const positive = change > 0;
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex items-center gap-1 text-xs px-2 py-1 rounded-full ${
        positive ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"
      }`}
    >
      <span className="capitalize">{stat}</span>
      <span className="font-bold">{positive ? "+" : ""}{change}</span>
    </motion.div>
  );
}

function AchievementPopup({ achievement, onClose }: { achievement: { name: string; icon: string; description: string }; onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5, y: 50 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.5, y: -50 }}
      className="fixed top-20 left-1/2 -translate-x-1/2 z-[100]"
    >
      <GlassCard glow className="p-6 border border-yellow-500/50 bg-slate-900/95 text-center min-w-[280px]">
        <motion.div
          animate={{ rotate: [0, -10, 10, -5, 5, 0], scale: [1, 1.2, 1] }}
          transition={{ duration: 0.8 }}
          className="text-5xl mb-3"
        >
          {achievement.icon}
        </motion.div>
        <div className="text-yellow-400 text-xs font-bold uppercase tracking-wider mb-1">Achievement Unlocked</div>
        <div className="text-white font-bold text-lg">{achievement.name}</div>
        <div className="text-gray-400 text-xs mt-1">{achievement.description}</div>
        <Button variant="ghost" size="sm" onClick={onClose} className="mt-3 text-yellow-400" data-testid="dismiss-achievement">
          <Sparkles className="w-4 h-4 mr-1" /> Nice!
        </Button>
      </GlassCard>
    </motion.div>
  );
}

function LevelUpPopup({ level, onClose }: { level: number; onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60"
      onClick={onClose}
    >
      <GlassCard glow className="p-8 border border-cyan-500/50 bg-slate-900/95 text-center">
        <motion.div
          animate={{ scale: [1, 1.3, 1], rotate: [0, 360] }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="text-6xl mb-4"
        >
          ⬆️
        </motion.div>
        <div className="text-cyan-400 text-sm font-bold uppercase tracking-widest mb-2">Level Up!</div>
        <div className="text-white font-bold text-4xl mb-2">{level}</div>
        <div className="text-gray-400 text-sm">You've grown stronger in your parallel life</div>
        <motion.div
          className="flex justify-center gap-1 mt-4"
          initial="hidden"
          animate="visible"
          variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
        >
          {["✨", "🌟", "💫", "⭐", "✨"].map((e, i) => (
            <motion.span
              key={i}
              variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
              className="text-2xl"
            >
              {e}
            </motion.span>
          ))}
        </motion.div>
      </GlassCard>
    </motion.div>
  );
}

function GameStats({ state }: { state: any }) {
  const stats = [
    { key: "wisdom", label: "Wisdom", icon: Brain, color: "text-blue-400", value: state?.wisdom || 10 },
    { key: "courage", label: "Courage", icon: Shield, color: "text-red-400", value: state?.courage || 10 },
    { key: "compassion", label: "Heart", icon: Heart, color: "text-pink-400", value: state?.compassion || 10 },
    { key: "cunning", label: "Cunning", icon: Eye, color: "text-purple-400", value: state?.cunning || 10 },
    { key: "influence", label: "Influence", icon: Crown, color: "text-yellow-400", value: state?.influence || 10 },
  ];

  return (
    <div className="grid grid-cols-5 gap-1.5 sm:gap-2" data-testid="game-stats-bar">
      {stats.map(s => (
        <div key={s.key} className="flex flex-col items-center gap-0.5 p-1.5 sm:p-2 rounded-lg bg-white/5 min-w-0">
          <s.icon className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${s.color}`} />
          <span className={`text-xs sm:text-sm font-bold ${s.color}`}>{s.value}</span>
          <span className="text-[8px] sm:text-[9px] text-gray-500 truncate w-full text-center">{s.label}</span>
        </div>
      ))}
    </div>
  );
}

function SituationScreen({
  scenario,
  era,
  onChoose,
  isDeciding,
}: {
  scenario: any;
  era: string;
  onChoose: (choiceId: string, choiceText: string) => void;
  isDeciding: boolean;
}) {
  const config = ERA_CONFIG[era as keyof typeof ERA_CONFIG] || ERA_CONFIG.modern;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-4"
    >
      <GlassCard glow className={`p-5 border ${config.borderColor}`} data-testid="situation-card">
        <div className="flex items-center gap-2 mb-3">
          <Badge className={config.badgeClass}>{scenario.difficulty || "medium"}</Badge>
          <Badge className="bg-white/10 text-gray-300">{config.name}</Badge>
          {scenario.xpReward && (
            <Badge className="bg-cyan-500/20 text-cyan-400">+{scenario.xpReward} XP</Badge>
          )}
          {scenario.shellsReward && (
            <Badge className="bg-yellow-500/20 text-yellow-400">+{scenario.shellsReward} 🐚</Badge>
          )}
        </div>
        <h2 className="text-xl font-bold text-white mb-3" data-testid="situation-title">{scenario.title}</h2>
        <div className="text-sm text-gray-300 leading-relaxed whitespace-pre-line" data-testid="situation-description">
          {scenario.description}
        </div>
        {scenario.educationalNote && (
          <div className="mt-3 pt-3 border-t border-white/5">
            <p className="text-xs text-amber-400/80 italic flex items-start gap-1.5">
              <Brain className="w-3 h-3 mt-0.5 flex-shrink-0" />
              {scenario.educationalNote}
            </p>
          </div>
        )}
      </GlassCard>

      <div className="space-y-2">
        <p className={`text-xs ${config.textColor} font-medium`}>How do you respond?</p>
        {scenario.choices?.map((choice: any, i: number) => (
          <motion.button
            key={choice.id || i}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 * i }}
            onClick={() => onChoose(choice.id || `choice_${i}`, choice.text)}
            disabled={isDeciding}
            className={`w-full text-left p-4 rounded-xl border transition-all min-h-[48px] ${
              isDeciding
                ? "opacity-50 cursor-not-allowed border-white/5 bg-white/3"
                : `border-white/10 bg-white/5 hover:bg-white/10 hover:${config.borderColor} active:scale-[0.98]`
            }`}
            data-testid={`choice-${i}`}
          >
            <div className="flex items-start gap-3">
              <span className={`flex-shrink-0 w-7 h-7 rounded-full bg-gradient-to-br ${config.bgGradient} flex items-center justify-center text-xs font-bold ${config.textColor}`}>
                {String.fromCharCode(65 + i)}
              </span>
              <div className="flex-1">
                <p className="text-sm text-white font-medium">{choice.text}</p>
                {choice.hint && <p className="text-xs text-gray-500 mt-1 italic">{choice.hint}</p>}
              </div>
            </div>
          </motion.button>
        ))}
      </div>

      {isDeciding && (
        <div className="flex items-center justify-center gap-2 py-4">
          <Loader2 className="w-5 h-5 text-cyan-400 animate-spin" />
          <span className="text-sm text-gray-400">The world reacts to your choice...</span>
        </div>
      )}
    </motion.div>
  );
}

function ConsequencesScreen({
  result,
  onContinue,
}: {
  result: any;
  onContinue: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="space-y-4"
    >
      <GlassCard glow className="p-5 border border-cyan-500/20" data-testid="consequences-card">
        <div className="flex items-center gap-2 mb-3">
          <CheckCircle2 className="w-5 h-5 text-green-400" />
          <h3 className="text-white font-bold">What Happened</h3>
        </div>
        <p className="text-sm text-gray-300 leading-relaxed">{result.consequences}</p>
      </GlassCard>

      <div className="grid grid-cols-2 gap-3">
        <GlassCard className="p-4 text-center border border-cyan-500/20">
          <Zap className="w-6 h-6 text-cyan-400 mx-auto mb-1" />
          <p className="text-xl font-bold text-cyan-400">+{result.xpEarned || 0}</p>
          <p className="text-[10px] text-gray-500">Experience</p>
        </GlassCard>
        <GlassCard className="p-4 text-center border border-yellow-500/20">
          <span className="text-2xl">🐚</span>
          <p className="text-xl font-bold text-yellow-400">+{result.shellsEarned || 0}</p>
          <p className="text-[10px] text-gray-500">Shells</p>
        </GlassCard>
      </div>

      {result.statChanges && Object.keys(result.statChanges).some((k: string) => result.statChanges[k] !== 0) && (
        <GlassCard className="p-4">
          <h4 className="text-white text-sm font-semibold mb-2">How You Changed</h4>
          <div className="flex flex-wrap gap-2">
            {Object.entries(result.statChanges).map(([stat, change]) => (
              <StatChange key={stat} stat={stat} change={change as number} />
            ))}
          </div>
        </GlassCard>
      )}

      {result.npcRelChanges && Object.keys(result.npcRelChanges).length > 0 && (
        <GlassCard className="p-4 border border-purple-500/20">
          <h4 className="text-white text-sm font-semibold mb-2 flex items-center gap-2">
            <Heart className="w-4 h-4 text-purple-400" /> Relationships Shifted
          </h4>
          <div className="space-y-1.5">
            {Object.entries(result.npcRelChanges).map(([npc, change]) => {
              const c = Number(change);
              if (c === 0) return null;
              return (
                <div key={npc} className="flex items-center justify-between text-xs">
                  <span className="text-gray-300">{npc}</span>
                  <span className={c > 0 ? "text-green-400 font-medium" : "text-red-400 font-medium"}>
                    {c > 0 ? `+${c} Trust` : `${c} Trust`}
                    {c >= 2 ? " — Growing closer" : c <= -2 ? " — Growing distant" : ""}
                  </span>
                </div>
              );
            })}
          </div>
        </GlassCard>
      )}

      {result.educationalInsight && (
        <GlassCard className="p-4 border border-amber-500/20">
          <div className="flex items-start gap-2">
            <Brain className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="text-amber-400 text-xs font-semibold mb-1">Did You Know?</h4>
              <p className="text-xs text-gray-400 leading-relaxed">{result.educationalInsight}</p>
            </div>
          </div>
        </GlassCard>
      )}

      <Button
        onClick={onContinue}
        className="w-full bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 text-white py-3"
        data-testid="continue-btn"
      >
        Continue Your Journey <ArrowRight className="w-4 h-4 ml-2" />
      </Button>
    </motion.div>
  );
}

function GameLog({ log }: { log: any[] }) {
  if (!log || log.length === 0) return null;
  return (
    <GlassCard className="p-4" data-testid="game-log">
      <h3 className="text-white font-semibold text-sm mb-3 flex items-center gap-2">
        <Activity className="w-4 h-4 text-cyan-400" /> Your Story So Far
      </h3>
      <div className="space-y-2 max-h-60 overflow-y-auto">
        {log.slice(0, 10).map((entry: any, i: number) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
            className="flex gap-2 text-xs"
          >
            <div className="flex flex-col items-center flex-shrink-0">
              <div className="w-2 h-2 rounded-full bg-cyan-400 mt-1.5" />
              {i < log.length - 1 && <div className="w-px flex-1 bg-white/10 mt-1" />}
            </div>
            <div className="pb-3">
              <p className="text-white">{entry.title}</p>
              <p className="text-gray-500 mt-0.5">{entry.description?.substring(0, 80)}{entry.description?.length > 80 ? "..." : ""}</p>
              <div className="flex gap-2 mt-1">
                {entry.xpEarned > 0 && <span className="text-cyan-400">+{entry.xpEarned} XP</span>}
                {entry.shellsEarned > 0 && <span className="text-yellow-400">+{entry.shellsEarned} 🐚</span>}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </GlassCard>
  );
}

function AchievementsList({ achievements }: { achievements: any[] }) {
  if (!achievements || achievements.length === 0) return null;
  return (
    <GlassCard className="p-4" data-testid="achievements-list">
      <h3 className="text-white font-semibold text-sm mb-3 flex items-center gap-2">
        <Trophy className="w-4 h-4 text-yellow-400" /> Achievements
      </h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {achievements.map((a: any) => (
          <div
            key={a.id}
            className={`p-2 rounded-lg text-center transition-all ${
              a.earned ? "bg-yellow-500/10 border border-yellow-500/20" : "bg-white/3 border border-white/5 opacity-50"
            }`}
          >
            <span className="text-xl">{a.icon}</span>
            <p className={`text-[10px] font-medium mt-1 ${a.earned ? "text-yellow-400" : "text-gray-500"}`}>{a.name}</p>
          </div>
        ))}
      </div>
    </GlassCard>
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

export default function ChroniclesPlay() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [selectedEra, setSelectedEra] = useState<"modern" | "medieval" | "wildwest">("modern");
  const [currentScenario, setCurrentScenario] = useState<any>(null);
  const [decisionResult, setDecisionResult] = useState<any>(null);
  const [showLevelUp, setShowLevelUp] = useState<number | null>(null);
  const [showAchievement, setShowAchievement] = useState<any>(null);
  const [gamePhase, setGamePhase] = useState<"idle" | "playing" | "consequences">("idle");

  const getAuthHeaders = (): Record<string, string> => {
    const session = getChroniclesSession();
    if (session?.token) return { Authorization: `Bearer ${session.token}`, "Content-Type": "application/json" };
    return { "Content-Type": "application/json" };
  };

  const { data: gameState, isLoading: stateLoading } = useQuery({
    queryKey: ["/api/chronicles/play/state"],
    queryFn: async () => {
      const res = await fetch("/api/chronicles/play/state", { headers: getAuthHeaders() });
      if (!res.ok) return null;
      return res.json();
    },
    staleTime: 10000,
  });

  const { data: achievementsData } = useQuery({
    queryKey: ["/api/chronicles/play/achievements"],
    queryFn: async () => {
      const res = await fetch("/api/chronicles/play/achievements", { headers: getAuthHeaders() });
      if (!res.ok) return [];
      return res.json();
    },
    staleTime: 30000,
  });

  const generateScenario = useMutation({
    mutationFn: async (era: string) => {
      const res = await fetch("/api/chronicles/play/scenario", {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({ era }),
      });
      if (!res.ok) throw new Error("Failed to generate scenario");
      return res.json();
    },
    onSuccess: (data) => {
      setCurrentScenario(data.scenario);
      setGamePhase("playing");
    },
    onError: () => {
      toast({ title: "Couldn't load a situation", description: "Try again in a moment", variant: "destructive" });
    },
  });

  const makeDecision = useMutation({
    mutationFn: async ({ scenarioId, choiceId, choiceText, era }: any) => {
      const res = await fetch("/api/chronicles/play/decide", {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({ scenarioId, choiceId, choiceText, era }),
      });
      if (!res.ok) throw new Error("Failed to process decision");
      return res.json();
    },
    onSuccess: (data) => {
      setDecisionResult(data);
      setGamePhase("consequences");
      queryClient.invalidateQueries({ queryKey: ["/api/chronicles/play/state"] });
      queryClient.invalidateQueries({ queryKey: ["/api/chronicles/play/achievements"] });

      if (data.newLevel) {
        setTimeout(() => setShowLevelUp(data.newLevel), 500);
      }
      if (data.newAchievements && data.newAchievements.length > 0) {
        const allAchievements = [
          { id: "first_decision", name: "First Steps", description: "Made your first decision", icon: "🎯" },
          { id: "level_5", name: "Rising Star", description: "Reached level 5", icon: "⭐" },
          { id: "level_10", name: "Veteran", description: "Reached level 10", icon: "🏆" },
          { id: "explorer", name: "Explorer", description: "Completed situations in all 3 eras", icon: "🗺️" },
          { id: "social_butterfly", name: "Social Butterfly", description: "Spoken to 5+ NPCs", icon: "🦋" },
          { id: "faction_member", name: "Faction Member", description: "Joined a faction", icon: "⚔️" },
          { id: "streak_3", name: "Dedicated", description: "3 day streak", icon: "🔥" },
          { id: "streak_7", name: "Unstoppable", description: "7 day streak", icon: "💎" },
          { id: "ten_decisions", name: "Seasoned", description: "Made 10 decisions", icon: "📜" },
          { id: "hundred_shells", name: "Shell Collector", description: "Earned 100+ shells", icon: "🐚" },
        ];
        const firstNew = allAchievements.find(a => a.id === data.newAchievements[0]);
        if (firstNew) {
          setTimeout(() => setShowAchievement(firstNew), data.newLevel ? 3000 : 800);
        }
      }
    },
    onError: () => {
      toast({ title: "Something went wrong", description: "Your choice couldn't be recorded", variant: "destructive" });
    },
  });

  const handleStartPlaying = () => {
    generateScenario.mutate(selectedEra);
  };

  const handleChoose = (choiceId: string, choiceText: string) => {
    if (!currentScenario) return;
    makeDecision.mutate({
      scenarioId: currentScenario.id,
      choiceId,
      choiceText,
      era: selectedEra,
    });
  };

  const handleContinue = () => {
    setCurrentScenario(null);
    setDecisionResult(null);
    setGamePhase("idle");
  };

  const state = gameState?.state || gameState;
  const recentLog = gameState?.recentLog || [];
  const achievements = Array.isArray(achievementsData) ? achievementsData : achievementsData?.achievements || [];
  const config = ERA_CONFIG[selectedEra];
  const eraUnlocks = gameState?.eraUnlocks || { modern: { unlocked: true, requiredLevel: 1 }, medieval: { unlocked: false, requiredLevel: 3 }, wildwest: { unlocked: false, requiredLevel: 5 } };
  const seasonProgress = gameState?.seasonProgress || 0;
  const seasonComplete = gameState?.seasonComplete || false;
  const eraProgress = gameState?.eraProgress || {};
  const isEraLocked = !eraUnlocks[selectedEra]?.unlocked;

  return (
    <div className="min-h-screen relative overflow-hidden pt-20 pb-12" style={{ background: "linear-gradient(180deg, #070b16, #0c1222, #070b16)" }}>
      <GlowOrb color="linear-gradient(135deg, #06b6d4, #3b82f6)" size={500} top="-5%" left="60%" />
      <GlowOrb color="linear-gradient(135deg, #8b5cf6, #ec4899)" size={400} top="40%" left="-10%" delay={3} />
      <AnimatePresence>
        {showLevelUp && <LevelUpPopup level={showLevelUp} onClose={() => setShowLevelUp(null)} />}
        {showAchievement && <AchievementPopup achievement={showAchievement} onClose={() => setShowAchievement(null)} />}
      </AnimatePresence>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <div className="flex items-center gap-3 mb-4">
          <Link href="/chronicles/hub">
            <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white" data-testid="back-to-hub">
              <ArrowLeft className="w-4 h-4 mr-1" /> Hub
            </Button>
          </Link>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-white">Play Chronicles</h1>
            <p className="text-xs text-gray-500">Your parallel life — real choices, real consequences</p>
          </div>
          <Link href="/chronicles/dashboard">
            <Button variant="ghost" size="sm" className="text-gray-400" data-testid="view-dashboard">
              <Activity className="w-4 h-4" />
            </Button>
          </Link>
        </div>

        <WorldClockBanner era={selectedEra} />

        <div className="relative h-48 sm:h-56 rounded-xl overflow-hidden mb-4">
          <Scene3D era={selectedEra} />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent pointer-events-none" />
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <div className="flex items-center gap-3">
              <div className="flex-1">
                <h2 className={`text-lg font-bold ${config.textColor}`} data-testid="era-title">
                  {config.emoji} {config.name}
                </h2>
                {state && (
                  <div className="flex items-center gap-3 text-xs text-gray-400 mt-1">
                    <span className="flex items-center gap-1">
                      <Star className="w-3 h-3 text-yellow-400" /> Level {state.level || 1}
                    </span>
                    <span className="flex items-center gap-1">
                      <Target className="w-3 h-3 text-cyan-400" /> {state.situationsCompleted || 0} decisions
                    </span>
                    <span className="flex items-center gap-1">
                      🐚 {state.shellsEarned || 0}
                    </span>
                  </div>
                )}
              </div>
              {state?.currentStreak > 0 && (
                <Badge className="bg-orange-500/20 text-orange-400 flex items-center gap-1">
                  <Flame className="w-3 h-3" /> {state.currentStreak} day streak
                </Badge>
              )}
            </div>
          </div>
        </div>

        <div className="flex gap-2 mb-4 overflow-x-auto pb-1" data-testid="era-selector">
          {(Object.keys(ERA_CONFIG) as Array<keyof typeof ERA_CONFIG>).map(era => {
            const c = ERA_CONFIG[era];
            const locked = !eraUnlocks[era]?.unlocked;
            const ep = eraProgress[era];
            return (
              <button
                key={era}
                onClick={() => {
                  if (locked) {
                    toast({ title: `${c.emoji} ${c.name} is Locked`, description: `Reach level ${eraUnlocks[era]?.requiredLevel} to unlock this era`, variant: "destructive" });
                    return;
                  }
                  setSelectedEra(era);
                  if (gamePhase === "idle") {
                    setCurrentScenario(null);
                    setDecisionResult(null);
                  }
                }}
                className={`flex-shrink-0 px-4 py-2.5 rounded-full text-sm font-medium transition-all min-h-[44px] relative ${
                  locked
                    ? "bg-white/3 text-gray-600 border border-white/5 cursor-not-allowed"
                    : selectedEra === era
                      ? `bg-gradient-to-r ${c.bgGradient} ${c.textColor} border ${c.borderColor}`
                      : "bg-white/5 text-gray-400 hover:bg-white/10"
                }`}
                data-testid={`play-era-btn-${era}`}
              >
                {locked && <Lock className="w-3 h-3 mr-1 inline" />}
                {c.emoji} {c.name}
                {ep && ep.completed > 0 && !locked && (
                  <span className="ml-1.5 text-[10px] opacity-70">{ep.completed}/{ep.total}</span>
                )}
              </button>
            );
          })}
        </div>

        {seasonProgress > 0 && (
          <div className="mb-4">
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-gray-400">Season Zero Progress</span>
              <span className={`font-medium ${seasonComplete ? "text-yellow-400" : "text-cyan-400"}`}>
                {seasonComplete ? "Complete!" : `${seasonProgress}%`}
              </span>
            </div>
            <Progress value={seasonProgress} className="h-1.5 bg-slate-800" />
          </div>
        )}

        {state && (
          <div className="mb-4">
            <XPBar xp={state.experience || 0} nextLevelXp={gameState?.nextLevelXp || 1000} level={state.level || 1} />
          </div>
        )}

        {state && <div className="mb-4"><GameStats state={state} /></div>}

        <AnimatePresence mode="wait">
          {gamePhase === "idle" && (
            <motion.div
              key="idle"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-4"
            >
              <GlassCard glow className={`p-6 border ${config.borderColor} text-center`} data-testid="play-prompt">
                {isEraLocked ? (
                  <>
                    <Lock className="w-12 h-12 text-gray-500 mx-auto mb-3" />
                    <h3 className="text-white font-bold text-lg mb-2">
                      {config.emoji} {config.name} — Locked
                    </h3>
                    <p className="text-sm text-gray-400 mb-4 max-w-md mx-auto">
                      Reach level {eraUnlocks[selectedEra]?.requiredLevel} to unlock this era. Keep playing in the Modern Era to level up.
                    </p>
                    <Button
                      onClick={() => setSelectedEra("modern")}
                      className="bg-gradient-to-r from-cyan-500/20 to-blue-600/20 border border-cyan-500/30 text-white px-8 py-3"
                    >
                      <Play className="w-4 h-4 mr-2" /> Play Modern Era
                    </Button>
                  </>
                ) : seasonComplete ? (
                  <>
                    <Trophy className="w-12 h-12 text-yellow-400 mx-auto mb-3" />
                    <h3 className="text-white font-bold text-lg mb-2">Season Zero Complete!</h3>
                    <p className="text-sm text-gray-400 mb-4 max-w-md mx-auto">
                      You've completed all Season Zero situations across three eras. The AI will now generate new, unique situations based on your journey so far.
                    </p>
                    <Button
                      onClick={handleStartPlaying}
                      disabled={generateScenario.isPending}
                      className={`bg-gradient-to-r from-yellow-500/30 to-amber-600/30 border border-yellow-500/30 text-white px-8 py-3`}
                      data-testid="start-playing-btn"
                    >
                      {generateScenario.isPending ? (
                        <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Generating...</>
                      ) : (
                        <><Play className="w-4 h-4 mr-2" /> Continue Your Story</>
                      )}
                    </Button>
                  </>
                ) : (
                  <>
                    <Compass className={`w-12 h-12 ${config.textColor} mx-auto mb-3`} />
                    <h3 className="text-white font-bold text-lg mb-2">
                      {state?.situationsCompleted > 0 ? "Ready for Another Situation?" : "Begin Your Parallel Life"}
                    </h3>
                    <p className="text-sm text-gray-400 mb-4 max-w-md mx-auto">
                      {state?.situationsCompleted > 0
                        ? `${eraProgress[selectedEra]?.total - (eraProgress[selectedEra]?.completed || 0)} situations remain in this era. The world keeps moving — how will you respond?`
                        : "Step into the world as yourself. Face real situations. Make authentic choices. Your decisions shape who you become."
                      }
                    </p>
                    <Button
                      onClick={handleStartPlaying}
                      disabled={generateScenario.isPending}
                      className={`bg-gradient-to-r ${config.bgGradient} border ${config.borderColor} text-white px-8 py-3`}
                      data-testid="start-playing-btn"
                    >
                      {generateScenario.isPending ? (
                        <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Generating...</>
                      ) : (
                        <><Play className="w-4 h-4 mr-2" /> {state?.situationsCompleted > 0 ? "Next Situation" : "Enter the World"}</>
                      )}
                    </Button>
                  </>
                )}
              </GlassCard>

              <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-3">
                <Link href="/chronicles/npc-chat">
                  <GlassCard glow className="p-3 cursor-pointer hover:border-cyan-500/30 transition-all h-full">
                    <MessageCircle className="w-5 h-5 text-cyan-400 mb-1" />
                    <p className="text-xs text-white font-medium">Talk to NPCs</p>
                    <p className="text-[10px] text-gray-500">AI conversations</p>
                  </GlassCard>
                </Link>
                <Link href="/chronicles/marketplace">
                  <GlassCard glow className="p-3 cursor-pointer hover:border-purple-500/30 transition-all h-full">
                    <ShoppingBag className="w-5 h-5 text-purple-400 mb-1" />
                    <p className="text-xs text-white font-medium">Marketplace</p>
                    <p className="text-[10px] text-gray-500">Shop & craft</p>
                  </GlassCard>
                </Link>
                <Link href="/chronicles/estate">
                  <GlassCard className="p-3 cursor-pointer hover:bg-white/5 transition-all h-full">
                    <Building className="w-5 h-5 text-amber-400 mb-1" />
                    <p className="text-xs text-white font-medium">Your Estate</p>
                    <p className="text-[10px] text-gray-500">Build & expand</p>
                  </GlassCard>
                </Link>
                <Link href="/chronicles/world">
                  <GlassCard className="p-3 cursor-pointer hover:bg-white/5 transition-all h-full">
                    <Globe className="w-5 h-5 text-green-400 mb-1" />
                    <p className="text-xs text-white font-medium">Your World</p>
                    <p className="text-[10px] text-gray-500">People & places</p>
                  </GlassCard>
                </Link>
                <Link href="/chronicles/city">
                  <GlassCard className="p-3 cursor-pointer hover:bg-white/5 transition-all h-full">
                    <Home className="w-5 h-5 text-blue-400 mb-1" />
                    <p className="text-xs text-white font-medium">City</p>
                    <p className="text-[10px] text-gray-500">Build together</p>
                  </GlassCard>
                </Link>
                <Link href="/chronicles/voice">
                  <GlassCard className="p-3 cursor-pointer hover:bg-white/5 transition-all h-full">
                    <Volume2 className="w-5 h-5 text-pink-400 mb-1" />
                    <p className="text-xs text-white font-medium">Voice</p>
                    <p className="text-[10px] text-gray-500">Train your voice</p>
                  </GlassCard>
                </Link>
                <Link href="/chronicles/tutorial">
                  <GlassCard className="p-3 cursor-pointer hover:bg-white/5 transition-all h-full">
                    <BookOpen className="w-5 h-5 text-emerald-400 mb-1" />
                    <p className="text-xs text-white font-medium">How to Play</p>
                    <p className="text-[10px] text-gray-500">Tutorial guide</p>
                  </GlassCard>
                </Link>
                <Link href="/chronicles/dashboard">
                  <GlassCard className="p-3 cursor-pointer hover:bg-white/5 transition-all h-full">
                    <TrendingUp className="w-5 h-5 text-yellow-400 mb-1" />
                    <p className="text-xs text-white font-medium">Dashboard</p>
                    <p className="text-[10px] text-gray-500">Your progress</p>
                  </GlassCard>
                </Link>
              </div>

              <GameLog log={recentLog} />
              <AchievementsList achievements={achievements} />
            </motion.div>
          )}

          {gamePhase === "playing" && currentScenario && (
            <SituationScreen
              key="playing"
              scenario={currentScenario}
              era={selectedEra}
              onChoose={handleChoose}
              isDeciding={makeDecision.isPending}
            />
          )}

          {gamePhase === "consequences" && decisionResult && (
            <ConsequencesScreen
              key="consequences"
              result={decisionResult}
              onContinue={handleContinue}
            />
          )}
        </AnimatePresence>
      </div>

      <ChroniclesChatPanel currentEra={selectedEra} />
    </div>
  );
}
