import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { useLocation, Link } from "wouter";
import { 
  Home, Map, Users, Coins, Lock, ChevronRight, Sparkles, 
  Crown, Shield, Compass, Building, MessageCircle, Volume2,
  Trophy, Star, Clock, Zap, Gift, ArrowRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useSimpleAuth } from "@/hooks/use-simple-auth";
import { apiRequest } from "@/lib/queryClient";
import { CharacterPortrait } from "@/components/character-portrait";
import { AudioPlayer } from "@/components/audio-player";

interface JourneyChapter {
  id: string;
  title: string;
  subtitle: string;
  status: "completed" | "current" | "locked";
  season: string;
  description: string;
  icon: typeof Home;
  href?: string;
}

const JOURNEY_CHAPTERS: JourneyChapter[] = [
  {
    id: "awakening",
    title: "Chapter 1: Awakening",
    subtitle: "Discover Your Parallel Self",
    status: "completed",
    season: "Season Zero",
    description: "You've discovered who you are in this world. Your essence has been defined.",
    icon: Sparkles,
    href: "/chronicles/onboarding"
  },
  {
    id: "foundation",
    title: "Chapter 2: Foundation",
    subtitle: "Build Your Estate",
    status: "current",
    season: "Season Zero",
    description: "Establish your home base. Build, expand, and make your mark on the land.",
    icon: Building,
    href: "/chronicles/estate"
  },
  {
    id: "connections",
    title: "Chapter 3: Connections",
    subtitle: "Meet Your Companions",
    status: "locked",
    season: "Season One",
    description: "Form bonds with AI companions who remember you and grow alongside your journey.",
    icon: Users
  },
  {
    id: "exploration",
    title: "Chapter 4: Exploration",
    subtitle: "Venture Into The Eras",
    status: "locked",
    season: "Season One",
    description: "Step through time itself. 70+ historical eras await your presence.",
    icon: Compass
  },
  {
    id: "legacy",
    title: "Chapter 5: Legacy",
    subtitle: "Leave Your Mark",
    status: "locked",
    season: "Season Two",
    description: "Your voice echoes through the ages. Clone your voice and hear yourself in history.",
    icon: Crown
  }
];

const UPCOMING_FEATURES = [
  { id: "voice", title: "Voice Cloning", season: "Season 2", icon: Volume2 },
  { id: "quests", title: "Daily Quests", season: "Season 1", icon: Trophy },
  { id: "factions", title: "Faction Wars", season: "Season 1", icon: Shield },
  { id: "trading", title: "Estate Trading", season: "Season 2", icon: Coins },
];

export default function ChroniclesHub() {
  const { user, loading: authLoading } = useSimpleAuth();
  const [, setLocation] = useLocation();
  const [showWelcome, setShowWelcome] = useState(false);

  const { data: personality, isLoading: personalityLoading } = useQuery({
    queryKey: ["/api/chronicles/personality"],
    queryFn: async () => {
      const res = await apiRequest("GET", "/api/chronicles/personality");
      return res.json();
    },
    enabled: !!user,
  });

  const { data: shellsData } = useQuery({
    queryKey: ["/api/shells/balance"],
    queryFn: async () => {
      const res = await apiRequest("GET", "/api/shells/balance");
      return res.json();
    },
    enabled: !!user,
  });

  useEffect(() => {
    if (!authLoading && !user) {
      setLocation("/");
    }
  }, [authLoading, user, setLocation]);

  useEffect(() => {
    if (!personalityLoading && personality && !personality.personality?.parallelSelfName) {
      setLocation("/chronicles/onboarding");
    } else if (personality?.personality?.parallelSelfName) {
      const hasSeenWelcome = sessionStorage.getItem("chronicles_welcome_seen");
      if (!hasSeenWelcome) {
        setShowWelcome(true);
        sessionStorage.setItem("chronicles_welcome_seen", "true");
      }
    }
  }, [personalityLoading, personality, setLocation]);

  if (authLoading || personalityLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        >
          <Sparkles className="w-12 h-12 text-cyan-400" />
        </motion.div>
      </div>
    );
  }

  const playerPersonality = personality?.personality;
  const shells = typeof shellsData === 'number' ? shellsData : (shellsData?.balance || shellsData?.shells || 0);
  const completedChapters = JOURNEY_CHAPTERS.filter(c => c.status === "completed").length;
  const journeyProgress = (completedChapters / JOURNEY_CHAPTERS.length) * 100;

  return (
    <div className="min-h-screen bg-slate-950 text-white relative overflow-hidden">
      <AnimatePresence>
        {showWelcome && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
            onClick={() => setShowWelcome(false)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ delay: 0.2 }}
              className="text-center max-w-lg"
              onClick={e => e.stopPropagation()}
            >
              <motion.div
                animate={{ 
                  boxShadow: ["0 0 20px rgba(6,182,212,0.3)", "0 0 60px rgba(6,182,212,0.6)", "0 0 20px rgba(6,182,212,0.3)"]
                }}
                transition={{ duration: 2, repeat: Infinity }}
                className="inline-block mb-6"
              >
                <CharacterPortrait
                  characterName={playerPersonality?.parallelSelfName}
                  primaryTrait={playerPersonality?.primaryTrait || "leader"}
                  secondaryTrait={playerPersonality?.secondaryTrait || "builder"}
                  colorPreference={playerPersonality?.colorPreference || "cyan"}
                  coreValues={playerPersonality?.coreValues || []}
                  size="lg"
                />
              </motion.div>
              <motion.h1
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent mb-4"
              >
                Welcome Back, {playerPersonality?.parallelSelfName}
              </motion.h1>
              <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="text-slate-400 text-lg mb-2"
              >
                Your parallel life has begun. Everything you build is saved forever.
              </motion.p>
              <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="text-slate-500 text-sm mb-8"
              >
                Season Zero is just the beginning - your journey grows with every update.
              </motion.p>
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.8 }}
              >
                <Button
                  onClick={() => setShowWelcome(false)}
                  className="bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-lg px-8 py-6"
                  data-testid="button-enter-chronicles"
                >
                  Enter Your World
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white">
                <ChevronRight className="w-5 h-5 rotate-180" />
              </Button>
            </Link>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30">
                  Season Zero
                </Badge>
                <Badge className="bg-cyan-500/20 text-cyan-400 border-cyan-500/30">
                  BETA
                </Badge>
              </div>
              <h1 className="text-2xl font-bold" data-testid="text-hub-title">DarkWave Chronicles</h1>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-slate-800/50 px-4 py-2 rounded-full border border-slate-700">
              <Coins className="w-5 h-5 text-amber-400" />
              <span className="font-bold text-amber-400" data-testid="text-shells-balance">{shells.toLocaleString()}</span>
              <span className="text-slate-400 text-sm">Shells</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <Card className="lg:col-span-1 bg-slate-900/80 border-slate-700 p-6">
            <div className="text-center mb-6">
              <CharacterPortrait
                characterName={playerPersonality?.parallelSelfName}
                primaryTrait={playerPersonality?.primaryTrait || "leader"}
                secondaryTrait={playerPersonality?.secondaryTrait || "builder"}
                colorPreference={playerPersonality?.colorPreference || "cyan"}
                coreValues={playerPersonality?.coreValues || []}
                size="lg"
              />
            </div>
            <h2 className="text-xl font-bold text-center mb-2" data-testid="text-character-name">
              {playerPersonality?.parallelSelfName || "Traveler"}
            </h2>
            <p className="text-slate-400 text-center text-sm mb-4">
              {playerPersonality?.primaryTrait && (
                <span className="capitalize">{playerPersonality.primaryTrait}</span>
              )}
              {playerPersonality?.secondaryTrait && (
                <span className="capitalize"> • {playerPersonality.secondaryTrait}</span>
              )}
            </p>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-slate-400">Journey Progress</span>
                  <span className="text-cyan-400">{Math.round(journeyProgress)}%</span>
                </div>
                <Progress value={journeyProgress} className="h-2 bg-slate-800" />
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Chapters Completed</span>
                <span className="text-white">{completedChapters} / {JOURNEY_CHAPTERS.length}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Era Interest</span>
                <span className="text-white capitalize">{playerPersonality?.eraInterest || "Ancient"}</span>
              </div>
            </div>
          </Card>

          <Card className="lg:col-span-2 bg-slate-900/80 border-slate-700 p-6">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Map className="w-5 h-5 text-cyan-400" />
              Your Journey
            </h2>
            <div className="space-y-3">
              {JOURNEY_CHAPTERS.map((chapter, index) => {
                const Icon = chapter.icon;
                const isLocked = chapter.status === "locked";
                const isCurrent = chapter.status === "current";
                const isCompleted = chapter.status === "completed";
                
                return (
                  <motion.div
                    key={chapter.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    {isLocked ? (
                      <div className="flex items-center gap-4 p-4 rounded-lg bg-slate-800/30 border border-slate-700/50 opacity-60">
                        <div className="w-12 h-12 rounded-full bg-slate-700/50 flex items-center justify-center">
                          <Lock className="w-5 h-5 text-slate-500" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-slate-400">{chapter.title}</h3>
                            <Badge variant="outline" className="text-xs border-slate-600 text-slate-500">
                              {chapter.season}
                            </Badge>
                          </div>
                          <p className="text-sm text-slate-500">{chapter.subtitle}</p>
                        </div>
                      </div>
                    ) : (
                      <Link href={chapter.href || "#"}>
                        <div className={`
                          flex items-center gap-4 p-4 rounded-lg cursor-pointer transition-all
                          ${isCurrent 
                            ? "bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border border-cyan-500/30 hover:border-cyan-400/50" 
                            : "bg-slate-800/50 border border-slate-700 hover:border-slate-600"
                          }
                        `}>
                          <div className={`
                            w-12 h-12 rounded-full flex items-center justify-center
                            ${isCompleted 
                              ? "bg-green-500/20" 
                              : isCurrent 
                                ? "bg-gradient-to-r from-cyan-500/30 to-purple-500/30" 
                                : "bg-slate-700/50"
                            }
                          `}>
                            <Icon className={`w-5 h-5 ${isCompleted ? "text-green-400" : isCurrent ? "text-cyan-400" : "text-slate-400"}`} />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className={`font-semibold ${isCurrent ? "text-cyan-400" : "text-white"}`}>
                                {chapter.title}
                              </h3>
                              <Badge 
                                variant="outline" 
                                className={`text-xs ${
                                  isCompleted 
                                    ? "border-green-500/30 text-green-400" 
                                    : isCurrent 
                                      ? "border-cyan-500/30 text-cyan-400 animate-pulse" 
                                      : "border-slate-600 text-slate-400"
                                }`}
                              >
                                {isCompleted ? "Complete" : isCurrent ? "Current" : chapter.season}
                              </Badge>
                            </div>
                            <p className="text-sm text-slate-400">{chapter.description}</p>
                          </div>
                          <ChevronRight className={`w-5 h-5 ${isCurrent ? "text-cyan-400" : "text-slate-500"}`} />
                        </div>
                      </Link>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </Card>
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Zap className="w-5 h-5 text-purple-400" />
            Coming Soon
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {UPCOMING_FEATURES.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                >
                  <Card className="bg-slate-900/50 border-slate-700/50 p-4 text-center opacity-60">
                    <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-slate-800/50 flex items-center justify-center">
                      <Lock className="w-5 h-5 text-slate-500 absolute" />
                      <Icon className="w-5 h-5 text-slate-600" />
                    </div>
                    <h3 className="font-semibold text-slate-400 mb-1">{feature.title}</h3>
                    <Badge variant="outline" className="text-xs border-slate-700 text-slate-500">
                      {feature.season}
                    </Badge>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>

        <Card className="bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border-cyan-500/20 p-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-cyan-500/30 to-purple-500/30 flex items-center justify-center">
                <Gift className="w-6 h-6 text-cyan-400" />
              </div>
              <div>
                <h3 className="font-bold text-lg">Early Adopter Bonus</h3>
                <p className="text-slate-400 text-sm">You're among the first to explore the Chronicles. Your loyalty will be rewarded at launch.</p>
              </div>
            </div>
            <Link href="/rewards">
              <Button className="bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500">
                View Rewards
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </div>
        </Card>

        <Card className="mt-8 bg-slate-900/50 border-slate-700/50 p-6">
          <div className="text-center">
            <Badge className="bg-cyan-500/20 text-cyan-400 border-cyan-500/30 mb-4">
              Season Zero - The Beginning
            </Badge>
            <h3 className="text-lg font-bold text-white mb-2">Your Parallel Life Begins Here</h3>
            <p className="text-slate-400 text-sm mb-4 max-w-xl mx-auto">
              Everything you create is permanently saved to your account. Your personality, your estate, your choices - they all persist as you progress through the seasons.
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-xs">
              <div className="flex items-center gap-2 bg-green-500/10 text-green-400 px-3 py-1.5 rounded-full">
                <Sparkles className="w-3 h-3" />
                <span>Progress Saved</span>
              </div>
              <div className="flex items-center gap-2 bg-cyan-500/10 text-cyan-400 px-3 py-1.5 rounded-full">
                <Clock className="w-3 h-3" />
                <span>Regular Updates</span>
              </div>
              <div className="flex items-center gap-2 bg-purple-500/10 text-purple-400 px-3 py-1.5 rounded-full">
                <Star className="w-3 h-3" />
                <span>Early Adopter Rewards</span>
              </div>
            </div>
            <p className="text-slate-600 text-xs mt-4">Season 1 & 2 features arriving throughout 2026</p>
          </div>
        </Card>
      </div>

      {playerPersonality?.audioPreference && playerPersonality.audioPreference !== "silent" && (
        <AudioPlayer 
          audioPreference={playerPersonality.audioPreference} 
          audioMood={playerPersonality.audioMood || "calm"} 
        />
      )}
    </div>
  );
}
