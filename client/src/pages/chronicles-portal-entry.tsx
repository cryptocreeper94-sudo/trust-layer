import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocation } from "wouter";
import {
  Sparkles, MapPin, Home, Package, Coins, ChevronRight,
  ArrowLeft, Loader2, CheckCircle, Star, BookOpen, Compass,
  Zap, X, Clock, Bell, Map, Backpack, Scroll, DoorOpen,
  Eye, Target, MessageCircle, Shield, Flame, HandMetal,
  ChevronDown, Trophy, Swords, Users, Volume2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { GlassCard } from "@/components/glass-card";
import { getChroniclesSession } from "@/pages/chronicles-login";

type Phase = "loading" | "portal_void" | "choose_city" | "entering" | "arrival" | "tutorial" | "ready" | "welcome_back";

const getAuthHeaders = (): Record<string, string> => {
  const session = getChroniclesSession();
  if (session?.token) return { Authorization: `Bearer ${session.token}`, "Content-Type": "application/json" };
  return { "Content-Type": "application/json" };
};

interface TutorialStep {
  id: string;
  scene: string;
  emoji: string;
  title: string;
  narrative: string;
  spotlight: string;
  pointerDirection: "down" | "right" | "left" | "up";
  action?: string;
  actionLabel?: string;
  revealItems?: Array<{ emoji: string; name: string; desc: string }>;
}

const TUTORIAL_STEPS: TutorialStep[] = [
  {
    id: "portal_arrival",
    scene: "home_entry",
    emoji: "🌀",
    title: "You Step Through",
    narrative: "The shimmering portal closes behind you. You blink, adjusting to the warm light. You're standing in a small but sturdy home — your home in this new world. Everything you need to start your life is right here.",
    spotlight: "room",
    pointerDirection: "down",
  },
  {
    id: "kitchen_table",
    scene: "home_kitchen",
    emoji: "📋",
    title: "The Kitchen Table",
    narrative: "On the kitchen table sits a handwritten note and a leather satchel. Someone was expecting you. Let's see what they left.",
    spotlight: "table",
    pointerDirection: "down",
    action: "read_note",
    actionLabel: "Read the Note",
  },
  {
    id: "welcome_note",
    scene: "home_kitchen",
    emoji: "✉️",
    title: "A Letter Awaits",
    narrative: "\"Welcome, Traveler. You've crossed through the veil into a world that mirrors your own — but the choices here are yours alone. Everything you do will shape who you become. Your inventory, your map, and your first mission are ready. Step carefully, or don't. This is your life to live.\"\n\n— The Keeper of the Threshold",
    spotlight: "note",
    pointerDirection: "down",
  },
  {
    id: "inventory_intro",
    scene: "home_satchel",
    emoji: "🎒",
    title: "Your Inventory",
    narrative: "The leather satchel on the table is yours. Inside you'll find everything you were given to start — supplies, tools, and a bit of currency. Open your inventory anytime to see what you're carrying.",
    spotlight: "inventory",
    pointerDirection: "right",
    action: "open_inventory",
    actionLabel: "Open Your Satchel",
    revealItems: [
      { emoji: "🪙", name: "500 Echoes", desc: "Starting currency for supplies and essentials" },
      { emoji: "📜", name: "Traveler's Journal", desc: "Records your decisions and their consequences" },
      { emoji: "🗺️", name: "Local Map", desc: "Shows the zones and landmarks around you" },
      { emoji: "🔑", name: "Home Key", desc: "Key to your starter home — always a safe place" },
      { emoji: "🕯️", name: "Oil Lantern", desc: "Light for dark paths and nighttime exploration" },
    ],
  },
  {
    id: "map_intro",
    scene: "home_map",
    emoji: "🗺️",
    title: "Your Map",
    narrative: "Pinned to the wall is a map of the surrounding area. Each zone has its own people, activities, and events happening in real time. The world doesn't wait for you — it lives and breathes on its own.",
    spotlight: "map",
    pointerDirection: "left",
    action: "view_map",
    actionLabel: "Look at the Map",
  },
  {
    id: "map_detail",
    scene: "home_map_detail",
    emoji: "📍",
    title: "Zones & Exploration",
    narrative: "You can walk between zones, meet the people who live there, join activities, play games, trade, hunt, and more. Some things only happen at certain times of day. NPCs have their own schedules — the blacksmith closes at dusk, the tavern comes alive at night.",
    spotlight: "zones",
    pointerDirection: "down",
  },
  {
    id: "missions_intro",
    scene: "home_missions",
    emoji: "⚔️",
    title: "Your Missions",
    narrative: "Situations will find you. Moral dilemmas, opportunities, conflicts — the world will present you with choices that have real consequences. There are no right answers, only your answers. Your decisions are recorded forever.",
    spotlight: "missions",
    pointerDirection: "right",
  },
  {
    id: "faith_intro",
    scene: "home_faith",
    emoji: "✝️",
    title: "Your Spirit",
    narrative: "On the nightstand, a worn Cepher Bible. Your spiritual life is woven into this world — you can attend services, pray, read scripture, and seek wisdom from Ursula, the spiritual guide who walks between eras. Faith is never forced, but always available.",
    spotlight: "faith",
    pointerDirection: "down",
  },
  {
    id: "door_approach",
    scene: "home_door",
    emoji: "🚪",
    title: "The Door",
    narrative: "Through the window you can see the city outside — people walking, merchants calling, life happening. Your front door is the threshold between the safety of home and the adventure that awaits. When you're ready, step outside.",
    spotlight: "door",
    pointerDirection: "right",
    action: "open_door",
    actionLabel: "Open the Door",
  },
  {
    id: "city_reveal",
    scene: "outside",
    emoji: "🏙️",
    title: "Welcome to Your City",
    narrative: "The door swings open and the sounds of the city flood in — voices, footsteps, the distant ring of a blacksmith's hammer or the hum of traffic, depending on your era. The world is alive. Where you go from here is entirely up to you.",
    spotlight: "city",
    pointerDirection: "down",
    action: "begin",
    actionLabel: "Begin Your Life",
  },
];

function TypewriterText({ text, speed = 30, onComplete }: { text: string; speed?: number; onComplete?: () => void }) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);
  const indexRef = useRef(0);

  useEffect(() => {
    setDisplayed("");
    indexRef.current = 0;
    setDone(false);
  }, [text]);

  useEffect(() => {
    if (done) return;
    const interval = setInterval(() => {
      indexRef.current++;
      if (indexRef.current >= text.length) {
        setDisplayed(text);
        setDone(true);
        clearInterval(interval);
        onComplete?.();
      } else {
        setDisplayed(text.slice(0, indexRef.current));
      }
    }, speed);
    return () => clearInterval(interval);
  }, [text, speed, done, onComplete]);

  return (
    <span>
      {displayed}
      {!done && <span className="animate-pulse text-cyan-400">|</span>}
    </span>
  );
}

function PointingHand({ direction, className = "" }: { direction: "down" | "right" | "left" | "up"; className?: string }) {
  const rotation = direction === "down" ? "rotate-90" : direction === "up" ? "-rotate-90" : direction === "left" ? "rotate-180" : "";
  return (
    <motion.div
      className={`text-3xl ${className}`}
      animate={
        direction === "down" ? { y: [0, 12, 0] } :
        direction === "up" ? { y: [0, -12, 0] } :
        direction === "right" ? { x: [0, 12, 0] } :
        { x: [0, -12, 0] }
      }
      transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
    >
      <span className={`inline-block ${rotation}`}>👆</span>
    </motion.div>
  );
}

const SCENE_VISUALS: Record<string, { bg: string; items: Array<{ emoji: string; x: string; y: string; size: string; label?: string; glow?: boolean }> }> = {
  home_entry: {
    bg: "from-amber-950/40 via-slate-950 to-slate-900",
    items: [
      { emoji: "🏠", x: "50%", y: "30%", size: "text-7xl", glow: true },
      { emoji: "🕯️", x: "25%", y: "55%", size: "text-3xl" },
      { emoji: "🪑", x: "70%", y: "60%", size: "text-2xl" },
      { emoji: "🖼️", x: "30%", y: "25%", size: "text-2xl" },
      { emoji: "🧱", x: "80%", y: "35%", size: "text-xl" },
    ],
  },
  home_kitchen: {
    bg: "from-amber-950/30 via-slate-950 to-slate-900",
    items: [
      { emoji: "🪵", x: "50%", y: "45%", size: "text-5xl", label: "Kitchen Table", glow: true },
      { emoji: "✉️", x: "55%", y: "38%", size: "text-3xl", glow: true },
      { emoji: "🎒", x: "40%", y: "48%", size: "text-2xl" },
      { emoji: "🕯️", x: "65%", y: "30%", size: "text-2xl" },
      { emoji: "🍞", x: "35%", y: "55%", size: "text-xl" },
    ],
  },
  home_satchel: {
    bg: "from-amber-950/30 via-slate-950 to-slate-900",
    items: [
      { emoji: "🎒", x: "50%", y: "35%", size: "text-7xl", label: "Your Satchel", glow: true },
    ],
  },
  home_map: {
    bg: "from-cyan-950/20 via-slate-950 to-slate-900",
    items: [
      { emoji: "🗺️", x: "50%", y: "35%", size: "text-7xl", label: "Wall Map", glow: true },
      { emoji: "📌", x: "42%", y: "30%", size: "text-xl" },
      { emoji: "📌", x: "58%", y: "28%", size: "text-xl" },
      { emoji: "📌", x: "50%", y: "40%", size: "text-lg" },
    ],
  },
  home_map_detail: {
    bg: "from-cyan-950/20 via-slate-950 to-slate-900",
    items: [
      { emoji: "🏘️", x: "30%", y: "30%", size: "text-3xl", label: "Town Square" },
      { emoji: "🏪", x: "60%", y: "25%", size: "text-3xl", label: "Market" },
      { emoji: "⛪", x: "45%", y: "50%", size: "text-3xl", label: "Church" },
      { emoji: "🌳", x: "70%", y: "55%", size: "text-3xl", label: "Outskirts" },
      { emoji: "🏠", x: "40%", y: "38%", size: "text-2xl", label: "You Are Here", glow: true },
    ],
  },
  home_missions: {
    bg: "from-purple-950/20 via-slate-950 to-slate-900",
    items: [
      { emoji: "⚔️", x: "50%", y: "30%", size: "text-6xl", glow: true },
      { emoji: "⚖️", x: "35%", y: "50%", size: "text-3xl", label: "Choices" },
      { emoji: "📜", x: "65%", y: "50%", size: "text-3xl", label: "Consequences" },
    ],
  },
  home_faith: {
    bg: "from-amber-950/20 via-slate-950 to-slate-900",
    items: [
      { emoji: "📖", x: "50%", y: "30%", size: "text-6xl", label: "Cepher Bible", glow: true },
      { emoji: "🕯️", x: "38%", y: "45%", size: "text-3xl" },
      { emoji: "✝️", x: "60%", y: "25%", size: "text-2xl" },
      { emoji: "🛏️", x: "50%", y: "55%", size: "text-3xl", label: "Nightstand" },
    ],
  },
  home_door: {
    bg: "from-slate-900 via-slate-950 to-cyan-950/20",
    items: [
      { emoji: "🚪", x: "50%", y: "30%", size: "text-7xl", label: "Front Door", glow: true },
      { emoji: "🪟", x: "30%", y: "28%", size: "text-3xl" },
      { emoji: "☀️", x: "35%", y: "22%", size: "text-xl" },
    ],
  },
  outside: {
    bg: "from-cyan-950/30 via-slate-950 to-purple-950/20",
    items: [
      { emoji: "🏙️", x: "50%", y: "25%", size: "text-7xl", glow: true },
      { emoji: "🧑‍🤝‍🧑", x: "35%", y: "50%", size: "text-3xl" },
      { emoji: "🛒", x: "65%", y: "45%", size: "text-3xl" },
      { emoji: "🐎", x: "25%", y: "55%", size: "text-2xl" },
      { emoji: "🏮", x: "70%", y: "30%", size: "text-2xl" },
      { emoji: "🌤️", x: "50%", y: "10%", size: "text-3xl" },
    ],
  },
};

function TutorialWalkthrough({ entryData, onComplete, initialStep = 0 }: { entryData: any; onComplete: () => void; initialStep?: number }) {
  const safeInitial = Math.min(Math.max(0, initialStep), TUTORIAL_STEPS.length - 1);
  const [currentStep, setCurrentStep] = useState(safeInitial);
  const [textDone, setTextDone] = useState(false);
  const [actionDone, setActionDone] = useState(false);
  const [inventoryOpen, setInventoryOpen] = useState(false);
  const [revealedItems, setRevealedItems] = useState(0);

  const step = TUTORIAL_STEPS[currentStep];
  const scene = SCENE_VISUALS[step.scene] || SCENE_VISUALS.home_entry;
  const progress = ((currentStep + 1) / TUTORIAL_STEPS.length) * 100;

  const saveMutation = useMutation({
    mutationFn: async (data: { step: number; completed?: boolean }) => {
      const res = await fetch("/api/chronicles/tutorial/progress", {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
      });
      return res.json();
    },
  });

  useEffect(() => {
    setTextDone(false);
    setActionDone(false);
    setInventoryOpen(false);
    setRevealedItems(0);
    saveMutation.mutate({ step: currentStep });
  }, [currentStep]);

  useEffect(() => {
    if (inventoryOpen && step.revealItems && revealedItems < step.revealItems.length) {
      const timer = setTimeout(() => setRevealedItems(prev => prev + 1), 350);
      return () => clearTimeout(timer);
    }
  }, [inventoryOpen, revealedItems, step.revealItems]);

  const handleAction = () => {
    if (step.action === "open_inventory") {
      setInventoryOpen(true);
    }
    setActionDone(true);
  };

  const handleNext = () => {
    if (currentStep < TUTORIAL_STEPS.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      saveMutation.mutate({ step: TUTORIAL_STEPS.length, completed: true });
      onComplete();
    }
  };

  const canProceed = textDone && (!step.action || actionDone);

  return (
    <motion.div
      className="fixed inset-0 bg-black overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      <div className={`absolute inset-0 bg-gradient-to-b ${scene.bg}`} />

      <div className="absolute inset-0 overflow-hidden">
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-0.5 h-0.5 bg-cyan-400/30 rounded-full"
            style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%` }}
            animate={{ opacity: [0, 0.6, 0] }}
            transition={{ duration: 3 + Math.random() * 4, repeat: Infinity, delay: Math.random() * 3 }}
          />
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={step.scene}
          className="absolute inset-0 flex items-center justify-center"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.6 }}
        >
          {scene.items.map((item, i) => (
            <motion.div
              key={`${step.scene}-${i}`}
              className={`absolute ${item.size} select-none`}
              style={{ left: item.x, top: item.y, transform: "translate(-50%, -50%)" }}
              initial={{ opacity: 0, scale: 0 }}
              animate={{
                opacity: item.glow ? 1 : 0.6,
                scale: 1,
                ...(item.glow ? { filter: ["drop-shadow(0 0 8px rgba(6,182,212,0.4))", "drop-shadow(0 0 20px rgba(6,182,212,0.6))", "drop-shadow(0 0 8px rgba(6,182,212,0.4))"] } : {}),
              }}
              transition={{
                delay: i * 0.15,
                duration: 0.5,
                ...(item.glow ? { filter: { duration: 2, repeat: Infinity } } : {}),
              }}
            >
              <span>{item.emoji}</span>
              {item.label && (
                <motion.p
                  className="text-[10px] text-cyan-400/70 text-center mt-1 whitespace-nowrap"
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.15 + 0.3 }}
                >
                  {item.label}
                </motion.p>
              )}
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>

      <div className="absolute top-0 left-0 right-0 z-20 safe-top">
        <div className="px-4 pt-3 pb-2">
          <div className="flex items-center gap-3 mb-2">
            <Badge className="bg-cyan-500/20 text-cyan-400 text-[10px]">
              {currentStep + 1} / {TUTORIAL_STEPS.length}
            </Badge>
            <div className="flex-1">
              <Progress value={progress} className="h-1" />
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 z-20 safe-bottom">
        <div className="bg-gradient-to-t from-black via-black/95 to-transparent pt-12 pb-6 px-4">
          <motion.div
            key={`card-${currentStep}`}
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="max-w-lg mx-auto"
          >
            <GlassCard glow className="p-4 sm:p-5 border border-cyan-500/20 relative overflow-visible">
              <div className="absolute -top-5 left-4">
                <PointingHand direction={step.pointerDirection} />
              </div>

              <div className="flex items-center gap-2 mb-3">
                <span className="text-2xl">{step.emoji}</span>
                <h3 className="text-base sm:text-lg font-bold text-white">{step.title}</h3>
              </div>

              <div className="text-xs sm:text-sm text-gray-300 leading-relaxed mb-4 min-h-[60px]">
                <TypewriterText
                  key={`text-${currentStep}`}
                  text={step.narrative}
                  speed={25}
                  onComplete={() => setTextDone(true)}
                />
              </div>

              {step.action && textDone && !actionDone && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                  <Button
                    onClick={handleAction}
                    className="w-full min-h-[48px] bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 text-white font-bold mb-3"
                    data-testid={`tutorial-action-${step.id}`}
                  >
                    <PointingHand direction="right" className="text-lg mr-2" />
                    {step.actionLabel}
                  </Button>
                </motion.div>
              )}

              {inventoryOpen && step.revealItems && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="mb-3"
                >
                  <div className="space-y-1.5 p-3 rounded-lg bg-black/30 border border-amber-500/20">
                    {step.revealItems.map((item, i) => (
                      <motion.div
                        key={item.name}
                        initial={{ x: -20, opacity: 0 }}
                        animate={i < revealedItems ? { x: 0, opacity: 1 } : { x: -20, opacity: 0 }}
                        transition={{ type: "spring", stiffness: 200 }}
                        className="flex items-center gap-2 py-1"
                      >
                        <span className="text-xl">{item.emoji}</span>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium text-white">{item.name}</p>
                          <p className="text-[10px] text-gray-500 truncate">{item.desc}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}

              <AnimatePresence>
                {canProceed && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                    <Button
                      onClick={handleNext}
                      className={`w-full min-h-[52px] font-bold text-base ${
                        currentStep === TUTORIAL_STEPS.length - 1
                          ? "bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 text-white shadow-lg shadow-cyan-500/20"
                          : "bg-white/10 hover:bg-white/15 text-white border border-white/10"
                      }`}
                      data-testid={`tutorial-next-${currentStep}`}
                    >
                      {currentStep === TUTORIAL_STEPS.length - 1 ? (
                        <><Sparkles className="w-5 h-5 mr-2" /> {step.actionLabel}</>
                      ) : (
                        <><ChevronRight className="w-5 h-5 mr-2" /> Continue</>
                      )}
                    </Button>
                  </motion.div>
                )}
              </AnimatePresence>
            </GlassCard>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}

function PortalVoid({ onReady }: { onReady: () => void }) {
  useEffect(() => {
    const timer = setTimeout(onReady, 4000);
    return () => clearTimeout(timer);
  }, [onReady]);

  return (
    <motion.div className="fixed inset-0 bg-black flex items-center justify-center overflow-hidden"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="absolute inset-0">
        {Array.from({ length: 60 }).map((_, i) => (
          <motion.div key={i}
            className="absolute w-1 h-1 bg-cyan-400 rounded-full"
            style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%` }}
            animate={{
              opacity: [0, 1, 0],
              scale: [0, 1.5, 0],
              x: [0, (Math.random() - 0.5) * 200],
              y: [0, (Math.random() - 0.5) * 200],
            }}
            transition={{ duration: 2 + Math.random() * 3, repeat: Infinity, delay: Math.random() * 2 }}
          />
        ))}
      </div>

      <motion.div className="absolute inset-0 flex items-center justify-center"
        animate={{ rotate: 360 }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }}>
        <div className="w-64 h-64 sm:w-96 sm:h-96 rounded-full border border-cyan-500/20 absolute" />
        <div className="w-48 h-48 sm:w-72 sm:h-72 rounded-full border border-purple-500/20 absolute" style={{ animation: "spin 15s linear infinite reverse" }} />
        <div className="w-32 h-32 sm:w-48 sm:h-48 rounded-full border border-pink-500/20 absolute" />
      </motion.div>

      <div className="relative z-10 text-center px-6">
        <motion.div initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.5, duration: 1, type: "spring" }}
          className="w-20 h-20 sm:w-24 sm:h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-cyan-500/30 to-purple-500/30 border border-cyan-500/40 flex items-center justify-center backdrop-blur-sm">
          <Sparkles className="w-10 h-10 sm:w-12 sm:h-12 text-cyan-400 animate-pulse" />
        </motion.div>

        <motion.h1 initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1, duration: 0.8 }}
          className="text-2xl sm:text-4xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-3">
          The Portal Opens
        </motion.h1>

        <motion.p initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1.5, duration: 0.8 }}
          className="text-sm sm:text-base text-slate-400 max-w-md mx-auto leading-relaxed">
          A doorway between worlds shimmers before you. On the other side, a parallel life waits — 
          your life, in a world where every choice echoes across time.
        </motion.p>

        <motion.p initial={{ opacity: 0 }} animate={{ opacity: [0, 1, 0.5, 1] }}
          transition={{ delay: 3, duration: 1.5 }}
          className="text-xs text-cyan-400/60 mt-8">
          Step through...
        </motion.p>
      </div>
    </motion.div>
  );
}

function CitySelector({ cities, onSelect, isPending }: { cities: any[]; onSelect: (id: string) => void; isPending: boolean }) {
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <motion.div className="fixed inset-0 bg-slate-950 overflow-y-auto"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="min-h-screen px-4 sm:px-6 py-8 sm:py-12 max-w-2xl mx-auto">
        <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
          className="text-center mb-6 sm:mb-8">
          <MapPin className="w-10 h-10 sm:w-12 sm:h-12 text-cyan-400 mx-auto mb-3" />
          <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">Where Will You Begin?</h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto">
            Choose your starting city. You'll receive a starter home in the heart of the city.
            You can travel to other cities later.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 mb-6">
          {cities.map((city: any, i: number) => (
            <motion.button
              key={city.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              onClick={() => setSelected(city.id)}
              className={`text-left p-3 sm:p-4 rounded-xl border transition-all active:scale-[0.98] ${
                selected === city.id
                  ? "bg-cyan-500/10 border-cyan-500/40 shadow-lg shadow-cyan-500/10"
                  : "bg-white/3 border-white/10 hover:border-white/20"
              }`}
              data-testid={`city-${city.id}`}
            >
              <div className="flex items-start gap-3">
                <div className={`w-10 h-10 sm:w-11 sm:h-11 rounded-lg flex items-center justify-center flex-shrink-0 ${
                  selected === city.id ? "bg-cyan-500/20" : "bg-white/5"
                }`}>
                  <MapPin className={`w-5 h-5 ${selected === city.id ? "text-cyan-400" : "text-slate-500"}`} />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className={`font-bold text-sm sm:text-base ${selected === city.id ? "text-cyan-400" : "text-white"}`}>
                      {city.name}
                    </h3>
                    <span className="text-[10px] text-slate-500">{city.state}</span>
                  </div>
                  <p className="text-[10px] sm:text-xs text-slate-400 mt-0.5 line-clamp-1">{city.desc}</p>
                  <p className="text-[10px] text-slate-500 mt-0.5">{city.zone}</p>
                </div>
                {selected === city.id && (
                  <CheckCircle className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
                )}
              </div>
            </motion.button>
          ))}
        </div>

        <AnimatePresence>
          {selected && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="sticky bottom-4 sm:bottom-8">
              <Button
                onClick={() => onSelect(selected)}
                disabled={isPending}
                className="w-full min-h-[52px] bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 text-white font-bold text-base shadow-2xl shadow-cyan-500/20"
                data-testid="btn-enter-portal"
              >
                {isPending ? (
                  <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Stepping through the portal...</>
                ) : (
                  <><Sparkles className="w-5 h-5 mr-2" /> Step Through to {cities.find(c => c.id === selected)?.name}</>
                )}
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

function WelcomeBack({ summary, events, onAcknowledge, onDismiss, isPending }: {
  summary: string | null;
  events: any[];
  onAcknowledge: () => void;
  onDismiss: () => void;
  isPending: boolean;
}) {
  return (
    <motion.div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center sm:p-4"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
        className="bg-slate-900 border border-white/10 rounded-t-2xl sm:rounded-2xl p-4 sm:p-6 max-w-md w-full max-h-[85vh] overflow-y-auto">
        <div className="w-10 h-1 bg-slate-600 rounded-full mx-auto mb-3 sm:hidden" />

        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-cyan-500/20 flex items-center justify-center">
            <Clock className="w-5 h-5 text-cyan-400" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold text-white">You wake up in your home...</h3>
            {summary && <p className="text-xs text-slate-400">{summary}</p>}
          </div>
        </div>

        <p className="text-xs text-gray-400 mb-3 italic">
          You open your eyes slowly. The familiar ceiling of your home greets you. How long were you gone? 
          The world kept moving while you were away.
        </p>

        {events.length > 0 && (
          <div className="space-y-2 mb-4">
            <p className="text-xs text-slate-400 flex items-center gap-1">
              <Bell className="w-3 h-3" /> While you were sleeping:
            </p>
            {events.map((event: any) => (
              <div key={event.id} className="p-3 rounded-lg bg-white/3 border border-white/5">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-xs sm:text-sm font-medium text-white">{event.title}</p>
                  {event.echoReward > 0 && (
                    <Badge className="text-[10px] bg-amber-500/20 text-amber-400">+{event.echoReward} E</Badge>
                  )}
                </div>
                <p className="text-[10px] sm:text-xs text-slate-400">{event.description}</p>
              </div>
            ))}
          </div>
        )}

        <div className="flex gap-2">
          <Button onClick={onAcknowledge} disabled={isPending}
            className="flex-1 min-h-[44px] bg-gradient-to-r from-cyan-600 to-purple-600"
            data-testid="btn-acknowledge-events">
            {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : (
              <><DoorOpen className="w-4 h-4 mr-2" /> {events.length > 0 ? "Collect & Step Outside" : "Step Outside"}</>
            )}
          </Button>
          <Button variant="ghost" onClick={onDismiss} className="min-h-[44px]" data-testid="btn-dismiss-welcome">
            <X className="w-4 h-4" />
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function ChroniclesPortalEntry() {
  const [, navigate] = useLocation();
  const queryClient = useQueryClient();
  const [phase, setPhase] = useState<Phase>("loading");
  const [entryData, setEntryData] = useState<any>(null);

  const { data: portalStatus, isLoading } = useQuery({
    queryKey: ["/api/chronicles/portal-entry/status"],
    queryFn: async () => {
      const res = await fetch("/api/chronicles/portal-entry/status", { headers: getAuthHeaders() });
      if (!res.ok) throw new Error("Failed to get portal status");
      return res.json();
    },
    staleTime: 5000,
  });

  const { data: offlineSummary } = useQuery({
    queryKey: ["/api/chronicles/world/offline-summary"],
    queryFn: async () => {
      const res = await fetch("/api/chronicles/world/offline-summary", { headers: getAuthHeaders() });
      if (!res.ok) return null;
      return res.json();
    },
    enabled: !!portalStatus?.portalCompleted,
    staleTime: 60000,
  });

  const { data: tutorialStatus } = useQuery({
    queryKey: ["/api/chronicles/tutorial/status"],
    queryFn: async () => {
      const res = await fetch("/api/chronicles/tutorial/status", { headers: getAuthHeaders() });
      if (!res.ok) return { tutorialStep: 0, tutorialCompleted: false };
      return res.json();
    },
    enabled: !!portalStatus?.portalCompleted,
    staleTime: 10000,
  });

  const enterMutation = useMutation({
    mutationFn: async (cityId: string) => {
      const res = await fetch("/api/chronicles/portal-entry/enter", {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({ cityId }),
      });
      if (!res.ok) throw new Error("Failed to enter portal");
      return res.json();
    },
    onSuccess: (data) => {
      setEntryData(data);
      setPhase("entering");
      setTimeout(() => setPhase("tutorial"), 2500);
      queryClient.invalidateQueries({ queryKey: ["/api/chronicles/portal-entry/status"] });
      queryClient.invalidateQueries({ queryKey: ["/api/chronicles/play/state"] });
    },
  });

  const acknowledgeMutation = useMutation({
    mutationFn: async (eventIds: string[]) => {
      const res = await fetch("/api/chronicles/world/acknowledge-events", {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({ eventIds }),
      });
      if (!res.ok) throw new Error("Failed to acknowledge events");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/chronicles/world/offline-summary"] });
      queryClient.invalidateQueries({ queryKey: ["/api/chronicles/play/state"] });
      navigate("/chronicles/play");
    },
  });

  useEffect(() => {
    if (!isLoading && portalStatus) {
      if (portalStatus.portalCompleted) {
        if (tutorialStatus && !tutorialStatus.tutorialCompleted) {
          setPhase("tutorial");
        } else if (offlineSummary && offlineSummary.timePassed >= 4 && offlineSummary.events.length > 0) {
          setPhase("welcome_back");
        } else {
          navigate("/chronicles/play");
        }
      } else {
        setPhase("portal_void");
      }
    }
  }, [isLoading, portalStatus, offlineSummary, tutorialStatus, navigate]);

  const handleVoidComplete = useCallback(() => {
    setPhase("choose_city");
  }, []);

  const handleCitySelect = useCallback((cityId: string) => {
    enterMutation.mutate(cityId);
  }, [enterMutation]);

  const handleTutorialComplete = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ["/api/chronicles/tutorial/status"] });
    navigate("/chronicles/play");
  }, [navigate, queryClient]);

  const handleAcknowledgeEvents = useCallback(() => {
    if (offlineSummary?.events?.length > 0) {
      acknowledgeMutation.mutate(offlineSummary.events.map((e: any) => e.id));
    } else {
      navigate("/chronicles/play");
    }
  }, [offlineSummary, acknowledgeMutation, navigate]);

  if (isLoading || phase === "loading") {
    return (
      <div className="fixed inset-0 bg-black flex items-center justify-center">
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }}>
          <Loader2 className="w-8 h-8 text-cyan-400" />
        </motion.div>
      </div>
    );
  }

  return (
    <AnimatePresence mode="wait">
      {phase === "portal_void" && (
        <PortalVoid key="void" onReady={handleVoidComplete} />
      )}

      {phase === "choose_city" && portalStatus?.cities && (
        <CitySelector key="city"
          cities={portalStatus.cities}
          onSelect={handleCitySelect}
          isPending={enterMutation.isPending}
        />
      )}

      {phase === "entering" && (
        <motion.div key="entering" className="fixed inset-0 bg-black flex items-center justify-center"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div className="text-center">
            <motion.div animate={{ scale: [1, 1.5, 0], opacity: [1, 1, 0] }}
              transition={{ duration: 2.5, ease: "easeInOut" }}
              className="w-32 h-32 sm:w-48 sm:h-48 mx-auto rounded-full bg-gradient-to-br from-cyan-500/30 to-purple-500/30 border border-cyan-500/40 flex items-center justify-center mb-6">
              <Sparkles className="w-16 h-16 sm:w-24 sm:h-24 text-cyan-400" />
            </motion.div>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
              className="text-sm text-cyan-400/60">Stepping through the portal...</motion.p>
          </div>
        </motion.div>
      )}

      {phase === "tutorial" && (
        <TutorialWalkthrough key="tutorial" entryData={entryData} onComplete={handleTutorialComplete} initialStep={tutorialStatus?.tutorialStep || 0} />
      )}

      {phase === "welcome_back" && offlineSummary && (
        <WelcomeBack key="wb"
          summary={offlineSummary.summary}
          events={offlineSummary.events}
          onAcknowledge={handleAcknowledgeEvents}
          onDismiss={() => navigate("/chronicles/play")}
          isPending={acknowledgeMutation.isPending}
        />
      )}
    </AnimatePresence>
  );
}