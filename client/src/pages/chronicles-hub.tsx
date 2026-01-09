import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocation, Link } from "wouter";
import { 
  Home, Map, Users, Coins, Lock, ChevronRight, Sparkles, 
  Crown, Shield, Compass, Building, MessageCircle, Volume2,
  Trophy, Star, Clock, Zap, Gift, ArrowRight, Plus, UserPlus, Link2, ChevronDown, X, Loader2, Vote, Copy, Share2,
  Timer, Scroll, Gem, Target, Briefcase, Heart
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { CharacterPortrait } from "@/components/character-portrait";
import { AudioPlayer } from "@/components/audio-player";
import { toast } from "sonner";
import { getPendingInvite, clearPendingInvite } from "./syndicate-invite";
import { getChroniclesSession } from "./chronicles-login";

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
  { id: "quests", title: "Daily & Weekly Quests", season: "Season 1", icon: Trophy },
  { id: "careers", title: "Career Paths", season: "Season 1", icon: Briefcase },
  { id: "marriage", title: "Marriage System", season: "Season 1", icon: Heart },
  { id: "eras", title: "New Eras (Roman, Medieval)", season: "Season 1", icon: Compass },
  { id: "voice", title: "Voice Cloning", season: "Season 2", icon: Volume2 },
  { id: "trading", title: "Estate Trading", season: "Season 2", icon: Coins },
];

export default function ChroniclesHub() {
  const [, setLocation] = useLocation();
  const [showWelcome, setShowWelcome] = useState(false);
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

  const { data: personality, isLoading: personalityLoading } = useQuery({
    queryKey: ["/api/chronicles/personality"],
    queryFn: async () => {
      const session = getChroniclesSession();
      const res = await fetch("/api/chronicles/personality", {
        headers: { Authorization: `Bearer ${session?.token}` }
      });
      return res.json();
    },
    enabled: !!chroniclesAccount,
  });

  const { data: shellsData } = useQuery({
    queryKey: ["/api/shells/balance"],
    queryFn: async () => {
      const session = getChroniclesSession();
      const res = await fetch("/api/shells/balance", {
        headers: { Authorization: `Bearer ${session?.token}` }
      });
      return res.json();
    },
    enabled: !!chroniclesAccount,
  });

  // ChronoChat community data for preview
  const { data: communitiesData } = useQuery({
    queryKey: ["/api/community/list"],
    queryFn: async () => {
      const res = await apiRequest("GET", "/api/community/list");
      return res.json();
    },
    enabled: !!chroniclesAccount,
  });

  const { data: myCommunitiesData } = useQuery({
    queryKey: ["/api/community/my-communities"],
    queryFn: async () => {
      const res = await apiRequest("GET", "/api/community/my-communities");
      return res.json();
    },
    enabled: !!chroniclesAccount,
  });

  // Syndicates (guilds) data
  const { data: mySyndicatesData } = useQuery({
    queryKey: ["/api/guilds/my-guilds"],
    queryFn: async () => {
      const res = await apiRequest("GET", "/api/guilds/my-guilds");
      return res.json();
    },
    enabled: !!chroniclesAccount,
  });

  const { data: publicSyndicatesData } = useQuery({
    queryKey: ["/api/guilds"],
    queryFn: async () => {
      const res = await apiRequest("GET", "/api/guilds");
      return res.json();
    },
    enabled: !!chroniclesAccount,
  });

  const { data: portalData } = useQuery({
    queryKey: ["/api/chronicles/portal"],
    queryFn: async () => {
      const session = getChroniclesSession();
      const res = await fetch("/api/chronicles/portal", {
        headers: { Authorization: `Bearer ${session?.token}` }
      });
      return res.json();
    },
    enabled: !!chroniclesAccount,
  });

  const { data: missionsData } = useQuery({
    queryKey: ["/api/chronicles/missions"],
    queryFn: async () => {
      const session = getChroniclesSession();
      const res = await fetch("/api/chronicles/missions", {
        headers: { Authorization: `Bearer ${session?.token}` }
      });
      return res.json();
    },
    enabled: !!chroniclesAccount,
  });

  const [syndicatesExpanded, setSyndicatesExpanded] = useState(false);
  const [portalExpanded, setPortalExpanded] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showJoinCodeModal, setShowJoinCodeModal] = useState(false);
  const [showManageModal, setShowManageModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [generatedInviteUrl, setGeneratedInviteUrl] = useState("");
  const [selectedSyndicate, setSelectedSyndicate] = useState<any>(null);
  const [newSyndicateName, setNewSyndicateName] = useState("");
  const [newSyndicateDesc, setNewSyndicateDesc] = useState("");
  const [newSyndicateIcon, setNewSyndicateIcon] = useState("⚡");
  const [joinCode, setJoinCode] = useState("");

  // Helper to extract error message from API errors
  const getErrorMessage = (error: any, fallback: string): string => {
    try {
      const msg = error?.message || "";
      // Try to parse JSON error from response
      const jsonMatch = msg.match(/\{.*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        return parsed.error || fallback;
      }
      return msg || fallback;
    } catch {
      return fallback;
    }
  };

  const createSyndicateMutation = useMutation({
    mutationFn: async (data: { name: string; description: string; icon: string }) => {
      const res = await apiRequest("POST", "/api/guilds/create", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/guilds/my-guilds"] });
      queryClient.invalidateQueries({ queryKey: ["/api/guilds"] });
      setShowCreateModal(false);
      setNewSyndicateName("");
      setNewSyndicateDesc("");
      setNewSyndicateIcon("⚡");
      toast.success("Syndicate created!");
    },
    onError: (error: any) => {
      toast.error(getErrorMessage(error, "Failed to create syndicate"));
    }
  });

  const joinSyndicateMutation = useMutation({
    mutationFn: async (guildId: number) => {
      const res = await apiRequest("POST", `/api/guilds/${guildId}/join`);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/guilds/my-guilds"] });
      queryClient.invalidateQueries({ queryKey: ["/api/guilds"] });
      toast.success("Joined syndicate!");
    },
    onError: (error: any) => {
      toast.error(getErrorMessage(error, "Failed to join syndicate"));
    }
  });

  const joinWithCodeMutation = useMutation({
    mutationFn: async (code: string) => {
      const res = await apiRequest("POST", `/api/guilds/join/${code}`);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/guilds/my-guilds"] });
      queryClient.invalidateQueries({ queryKey: ["/api/guilds"] });
      setShowJoinCodeModal(false);
      setJoinCode("");
      toast.success("Joined syndicate!");
    },
    onError: (error: any) => {
      toast.error(getErrorMessage(error, "Invalid or expired invite code"));
    }
  });

  const activateChronoLinkMutation = useMutation({
    mutationFn: async (guildId: number) => {
      const res = await apiRequest("POST", `/api/guilds/${guildId}/activate-chronolink`);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/guilds/my-guilds"] });
      setShowManageModal(false);
      setSelectedSyndicate(null);
      toast.success("ChronoLink activated! Your syndicate is now connected to ChronoChat.");
    },
    onError: (error: any) => {
      toast.error(getErrorMessage(error, "Failed to activate ChronoLink"));
    }
  });

  const leaveSyndicateMutation = useMutation({
    mutationFn: async (guildId: number) => {
      const res = await apiRequest("POST", `/api/guilds/${guildId}/leave`);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/guilds/my-guilds"] });
      queryClient.invalidateQueries({ queryKey: ["/api/guilds"] });
      setShowManageModal(false);
      setSelectedSyndicate(null);
      toast.success("Left syndicate");
    },
    onError: (error: any) => {
      toast.error(getErrorMessage(error, "Failed to leave syndicate"));
    }
  });

  const generateInviteMutation = useMutation({
    mutationFn: async (guildId: number) => {
      const res = await apiRequest("POST", `/api/guilds/${guildId}/invite`);
      return res.json();
    },
    onSuccess: (data) => {
      if (data.code) {
        const baseUrl = window.location.origin;
        const fullUrl = `${baseUrl}/join/${data.code}`;
        setGeneratedInviteUrl(fullUrl);
        setShowShareModal(true);
      }
    },
    onError: (error: any) => {
      toast.error(getErrorMessage(error, "Failed to generate invite"));
    }
  });


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

  // Auto-join pending syndicate invite after signup
  useEffect(() => {
    if (!authLoading && chroniclesAccount) {
      const pending = getPendingInvite();
      if (pending?.code) {
        apiRequest("POST", `/api/guilds/join/${pending.code}`)
          .then(res => res.json())
          .then(data => {
            if (data.success) {
              toast.success(`Welcome to ${data.guild?.name || "the syndicate"}!`);
              queryClient.invalidateQueries({ queryKey: ["/api/guilds/my-guilds"] });
            }
            clearPendingInvite();
          })
          .catch(() => {
            clearPendingInvite();
          });
      }
    }
  }, [authLoading, chroniclesAccount]);

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
  
  // ChronoChat preview data
  const allCommunities = communitiesData?.communities || [];
  const myCommunities = myCommunitiesData?.communities || [];
  const isChronoLinkActive = myCommunities.length > 0;
  const featuredCommunities = allCommunities.slice(0, 3);
  
  // Syndicates data - merge guild info with membership role
  const memberships = mySyndicatesData?.memberships || [];
  const mySyndicates = (mySyndicatesData?.guilds || []).map((guild: any) => {
    const membership = memberships.find((m: any) => m.guildId === guild.id);
    return { ...guild, role: membership?.role || "member" };
  });
  // Only show public recruiting guilds that user isn't already a member of
  const publicSyndicates = (publicSyndicatesData?.guilds || []).filter(
    (g: any) => g.isRecruiting && !mySyndicates.some((my: any) => my.id === g.id)
  );
  const hasSyndicates = mySyndicates.length > 0;

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

        {/* Time Portal - Era Travel System */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-8"
        >
          <Card className="bg-slate-900/80 border-slate-700 overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 via-purple-500/5 to-cyan-500/5" />
            <button
              onClick={() => setPortalExpanded(!portalExpanded)}
              className="w-full p-6 flex items-center justify-between hover:bg-slate-800/50 transition-colors relative z-10"
              data-testid="button-toggle-portal"
            >
              <div className="flex items-center gap-4">
                <motion.div 
                  animate={{ 
                    boxShadow: ["0 0 20px rgba(6,182,212,0.3)", "0 0 40px rgba(168,85,247,0.5)", "0 0 20px rgba(6,182,212,0.3)"]
                  }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="w-14 h-14 rounded-full bg-gradient-to-r from-cyan-500/30 to-purple-500/30 flex items-center justify-center border border-cyan-500/30"
                >
                  <Timer className="w-7 h-7 text-cyan-400" />
                </motion.div>
                <div className="text-left">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-lg font-bold text-white">Time Portal</h3>
                    <Badge className="bg-cyan-500/20 text-cyan-400 border-cyan-500/30 text-xs">
                      BETA
                    </Badge>
                    <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30 text-xs">
                      Season Zero
                    </Badge>
                  </div>
                  <p className="text-sm text-slate-400">
                    Collect artifacts to unlock eras and travel through time
                  </p>
                </div>
              </div>
              <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform ${portalExpanded ? "rotate-180" : ""}`} />
            </button>
            
            <AnimatePresence>
              {portalExpanded && portalData && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="px-6 pb-6 border-t border-slate-700/50 pt-4 relative z-10">
                    <div className="bg-gradient-to-r from-cyan-900/20 to-purple-900/20 rounded-lg p-4 mb-4 border border-cyan-500/20">
                      <div className="flex items-center gap-2 mb-2">
                        <Sparkles className="w-4 h-4 text-amber-400" />
                        <span className="text-xs text-amber-400 uppercase tracking-wider font-semibold">Beta Notice</span>
                      </div>
                      <p className="text-sm text-slate-300">
                        Your progress is persistent and saved forever. Complete missions to discover artifacts and unlock new eras!
                      </p>
                    </div>

                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">Current Era</h4>
                      <Badge className="bg-cyan-500/20 text-cyan-400 border-cyan-500/30">
                        {portalData?.portal?.currentEraCode?.toUpperCase() || "MODERN"}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                      {(portalData?.allEras || []).map((era: any) => {
                        const playerEra = (portalData?.playerEras || []).find((pe: any) => pe.eraCode === era.code);
                        const isUnlocked = era.isStartingEra || playerEra?.isUnlocked;
                        const isCurrent = portalData?.portal?.currentEraCode === era.code;
                        const artifactsForEra = (portalData?.collectedArtifacts || []).filter((a: any) => a.eraCode === era.code).length;
                        
                        return (
                          <motion.div
                            key={era.id}
                            whileHover={{ scale: isUnlocked ? 1.02 : 1 }}
                            className={`relative p-4 rounded-lg border transition-all ${
                              isCurrent 
                                ? "bg-gradient-to-br from-cyan-500/20 to-purple-500/20 border-cyan-500/40" 
                                : isUnlocked
                                  ? "bg-slate-800/50 border-slate-700 hover:border-cyan-500/30"
                                  : "bg-slate-800/30 border-slate-700/50 opacity-60"
                            }`}
                            data-testid={`card-era-${era.code}`}
                          >
                            {isCurrent && (
                              <div className="absolute -top-2 -right-2">
                                <motion.div
                                  animate={{ scale: [1, 1.2, 1] }}
                                  transition={{ duration: 2, repeat: Infinity }}
                                >
                                  <Badge className="bg-cyan-500 text-white text-xs">
                                    Current
                                  </Badge>
                                </motion.div>
                              </div>
                            )}
                            <div className="flex items-start gap-3">
                              <div className={`text-3xl ${isUnlocked ? "" : "grayscale"}`}>
                                {era.icon || "⏳"}
                              </div>
                              <div className="flex-1">
                                <h5 className={`font-semibold ${isUnlocked ? "text-white" : "text-slate-500"}`}>
                                  {era.name}
                                </h5>
                                <p className="text-xs text-slate-400 mb-2">
                                  {era.timePeriod}
                                </p>
                                <div className={`flex items-center gap-2 text-xs ${isUnlocked ? "text-green-400" : "text-slate-500"}`}>
                                  {isUnlocked ? <Gem className="w-3 h-3" /> : <Lock className="w-3 h-3" />}
                                  <span>{artifactsForEra}/{era.artifactsRequired} artifacts</span>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>

                    {missionsData?.missions && missionsData.missions.length > 0 && (
                      <>
                        <h4 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-3 flex items-center gap-2">
                          <Target className="w-4 h-4 text-cyan-400" />
                          Discovery Missions
                        </h4>
                        <div className="space-y-2 mb-4">
                          {missionsData.missions.slice(0, 3).map((mission: any) => {
                            const progress = (missionsData.progress || []).find((p: any) => p.missionId === mission.id);
                            const isCompleted = progress?.status === 'completed';
                            const isActive = progress?.status === 'active';
                            
                            return (
                              <div
                                key={mission.id}
                                className={`p-3 rounded-lg border transition-all ${
                                  isCompleted 
                                    ? "bg-green-500/10 border-green-500/30" 
                                    : isActive
                                      ? "bg-cyan-500/10 border-cyan-500/30"
                                      : "bg-slate-800/50 border-slate-700 hover:border-slate-600"
                                }`}
                                data-testid={`card-mission-${mission.id}`}
                              >
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-3">
                                    <Scroll className={`w-5 h-5 ${isCompleted ? "text-green-400" : isActive ? "text-cyan-400" : "text-slate-500"}`} />
                                    <div>
                                      <h5 className={`font-medium text-sm ${isCompleted ? "text-green-400" : "text-white"}`}>
                                        {mission.title}
                                      </h5>
                                      <p className="text-xs text-slate-400">
                                        +{mission.shellsReward} Shells • +{mission.experienceReward} XP
                                      </p>
                                    </div>
                                  </div>
                                  <Badge className={
                                    isCompleted 
                                      ? "bg-green-500/20 text-green-400 border-green-500/30" 
                                      : isActive 
                                        ? "bg-cyan-500/20 text-cyan-400 border-cyan-500/30 animate-pulse" 
                                        : "bg-slate-700 text-slate-400 border-slate-600"
                                  }>
                                    {isCompleted ? "Complete" : isActive ? "In Progress" : "Available"}
                                  </Badge>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </>
                    )}

                    <Link href="/chronicles/time-portal">
                      <Button 
                        className="w-full bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500"
                        data-testid="button-open-portal"
                      >
                        <Timer className="w-4 h-4 mr-2" />
                        Enter Time Portal
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </Link>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </Card>
        </motion.div>

        {/* ChronoLink - Communication Hub CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mb-8"
        >
          <Card className="relative overflow-hidden bg-gradient-to-r from-purple-900/40 via-cyan-900/30 to-purple-900/40 border-purple-500/30 p-6">
            {/* Animated glow effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-500/5 to-transparent animate-pulse" />
            
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <motion.div 
                  animate={{ 
                    boxShadow: ["0 0 20px rgba(168,85,247,0.3)", "0 0 40px rgba(6,182,212,0.5)", "0 0 20px rgba(168,85,247,0.3)"]
                  }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="w-16 h-16 rounded-full bg-gradient-to-r from-purple-500/30 to-cyan-500/30 flex items-center justify-center border border-purple-500/30"
                >
                  <MessageCircle className="w-8 h-8 text-cyan-400" />
                </motion.div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    {isChronoLinkActive ? (
                      <Badge className="bg-green-500/20 text-green-400 border-green-500/30 text-xs">
                        ACTIVE
                      </Badge>
                    ) : (
                      <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30 text-xs">
                        NEW
                      </Badge>
                    )}
                    <Badge className="bg-cyan-500/20 text-cyan-400 border-cyan-500/30 text-xs">
                      Season Zero
                    </Badge>
                  </div>
                  <h3 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                    {isChronoLinkActive ? "ChronoLink Active" : "Activate ChronoLink"}
                  </h3>
                  <p className="text-slate-400 text-sm mt-1">
                    {isChronoLinkActive 
                      ? `You're connected to ${myCommunities.length} communit${myCommunities.length === 1 ? 'y' : 'ies'}. Continue your conversations and earn Shells.`
                      : "Connect with other travelers across the timelines. Share discoveries, form alliances, and shape the future together."
                    }
                  </p>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row items-center gap-3">
                <div className="text-center sm:text-right mr-2">
                  <div className="text-xs text-slate-500 uppercase tracking-wider">Community Hub</div>
                  <div className="text-lg font-bold text-white">ChronoChat</div>
                </div>
                <Link href="/chronochat">
                  <Button 
                    className="bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white px-6 py-3 text-lg font-semibold shadow-lg shadow-purple-500/20"
                    data-testid="button-activate-chronolink"
                  >
                    <MessageCircle className="mr-2 w-5 h-5" />
                    Enter ChronoChat
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
              </div>
            </div>
            
            {/* Feature highlights */}
            <div className="relative z-10 mt-6 pt-4 border-t border-slate-700/50">
              <div className="flex flex-wrap justify-center gap-4 text-xs">
                <div className="flex items-center gap-2 text-slate-400">
                  <Users className="w-4 h-4 text-purple-400" />
                  <span>Join Communities</span>
                </div>
                <div className="flex items-center gap-2 text-slate-400">
                  <Sparkles className="w-4 h-4 text-cyan-400" />
                  <span>Real-Time Chat</span>
                </div>
                <div className="flex items-center gap-2 text-slate-400">
                  <Shield className="w-4 h-4 text-green-400" />
                  <span>Private Channels</span>
                </div>
                <div className="flex items-center gap-2 text-slate-400">
                  <Crown className="w-4 h-4 text-amber-400" />
                  <span>Earn Shells</span>
                </div>
              </div>
            </div>
            
            {/* Community Preview */}
            {featuredCommunities.length > 0 && (
              <div className="relative z-10 mt-4 pt-4 border-t border-slate-700/50">
                <p className="text-xs text-slate-500 uppercase tracking-wider mb-3 text-center">Active Communities</p>
                <div className="flex flex-wrap justify-center gap-2">
                  {featuredCommunities.map((community: any) => (
                    <Link key={community.id} href="/chronochat">
                      <div className="flex items-center gap-2 bg-slate-800/50 hover:bg-slate-700/50 px-3 py-2 rounded-full border border-slate-700 hover:border-cyan-500/30 transition-all cursor-pointer">
                        <span className="text-lg">{community.icon || "⚡"}</span>
                        <span className="text-sm text-white">{community.name}</span>
                        {community.memberCount > 0 && (
                          <span className="text-xs text-slate-500">{community.memberCount} members</span>
                        )}
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </Card>
        </motion.div>

        {/* Syndicates Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mb-8"
        >
          <Card className="bg-slate-900/80 border-slate-700 overflow-hidden">
            <button
              onClick={() => setSyndicatesExpanded(!syndicatesExpanded)}
              className="w-full p-6 flex items-center justify-between hover:bg-slate-800/50 transition-colors"
              data-testid="button-toggle-syndicates"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-amber-500/30 to-orange-500/30 flex items-center justify-center border border-amber-500/30">
                  <Users className="w-6 h-6 text-amber-400" />
                </div>
                <div className="text-left">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-lg font-bold text-white">Syndicates</h3>
                    {hasSyndicates && (
                      <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30 text-xs">
                        {mySyndicates.length} joined
                      </Badge>
                    )}
                    <Badge className="bg-slate-700 text-slate-300 border-slate-600 text-xs">
                      Season Zero
                    </Badge>
                  </div>
                  <p className="text-sm text-slate-400">
                    {hasSyndicates 
                      ? "Manage your syndicates and connect with allies"
                      : "Form or join a syndicate to pool resources and earn bonuses"
                    }
                  </p>
                </div>
              </div>
              <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform ${syndicatesExpanded ? "rotate-180" : ""}`} />
            </button>
            
            <AnimatePresence>
              {syndicatesExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="px-6 pb-6 border-t border-slate-700/50 pt-4">
                    {/* My Syndicates */}
                    {mySyndicates.length > 0 && (
                      <div className="mb-6">
                        <h4 className="text-sm font-semibold text-slate-300 mb-3 uppercase tracking-wider">Your Syndicates</h4>
                        <div className="space-y-2">
                          {mySyndicates.map((syndicate: any) => (
                            <button 
                              key={syndicate.id}
                              onClick={() => {
                                setSelectedSyndicate(syndicate);
                                setShowManageModal(true);
                              }}
                              className="w-full flex items-center justify-between p-3 bg-slate-800/50 rounded-lg border border-slate-700 hover:border-amber-500/30 transition-colors cursor-pointer text-left"
                              data-testid={`card-syndicate-${syndicate.id}`}
                            >
                              <div className="flex items-center gap-3">
                                <span className="text-2xl">{syndicate.icon || "⚡"}</span>
                                <div>
                                  <div className="flex items-center gap-2">
                                    <span className="font-semibold text-white">{syndicate.name}</span>
                                    {syndicate.isChronoLinkActive && (
                                      <Badge className="bg-cyan-500/20 text-cyan-400 border-cyan-500/30 text-xs">
                                        <Link2 className="w-3 h-3 mr-1" />
                                        Linked
                                      </Badge>
                                    )}
                                  </div>
                                  <p className="text-xs text-slate-500">{syndicate.memberCount || 1} members • Level {syndicate.level || 1}</p>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                {syndicate.shellsBonus > 0 && (
                                  <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30 text-xs">
                                    +{syndicate.shellsBonus}% Shells
                                  </Badge>
                                )}
                                <ChevronRight className="w-4 h-4 text-slate-500" />
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {/* Action Buttons */}
                    <div className="flex flex-wrap gap-3 mb-6">
                      {mySyndicates.length < 3 && (
                        <>
                          <Button 
                            variant="outline" 
                            className="border-amber-500/30 text-amber-400 hover:bg-amber-500/10"
                            onClick={() => setShowCreateModal(true)}
                            data-testid="button-create-syndicate"
                          >
                            <Plus className="w-4 h-4 mr-2" />
                            Create Syndicate
                          </Button>
                          <Button 
                            variant="outline" 
                            className="border-slate-600 text-slate-300 hover:bg-slate-700/50"
                            onClick={() => setShowJoinCodeModal(true)}
                            data-testid="button-join-invite"
                          >
                            <UserPlus className="w-4 h-4 mr-2" />
                            Join with Code
                          </Button>
                        </>
                      )}
                    </div>
                    
                    {/* Public Syndicates to Join */}
                    {publicSyndicates.length > 0 && mySyndicates.length < 3 && (
                      <div>
                        <h4 className="text-sm font-semibold text-slate-300 mb-3 uppercase tracking-wider">Open Syndicates</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          {publicSyndicates.slice(0, 4).map((syndicate: any) => (
                            <div 
                              key={syndicate.id}
                              className="flex items-center justify-between p-3 bg-slate-800/30 rounded-lg border border-slate-700/50 hover:border-slate-600 transition-colors"
                              data-testid={`card-public-syndicate-${syndicate.id}`}
                            >
                              <div className="flex items-center gap-3">
                                <span className="text-xl">{syndicate.icon || "⚡"}</span>
                                <div>
                                  <span className="font-medium text-white text-sm">{syndicate.name}</span>
                                  <p className="text-xs text-slate-500">{syndicate.memberCount || 1} members</p>
                                </div>
                              </div>
                              <Button 
                                size="sm" 
                                variant="ghost" 
                                className="text-cyan-400 hover:text-cyan-300 hover:bg-cyan-500/10"
                                onClick={() => joinSyndicateMutation.mutate(syndicate.id)}
                                disabled={joinSyndicateMutation.isPending}
                                data-testid={`button-join-syndicate-${syndicate.id}`}
                              >
                                {joinSyndicateMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Join"}
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {/* Empty State */}
                    {mySyndicates.length === 0 && publicSyndicates.length === 0 && (
                      <div className="text-center py-6">
                        <Users className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                        <p className="text-slate-400 mb-2">No syndicates yet</p>
                        <p className="text-slate-500 text-sm">Be the first to create a syndicate and lead your allies!</p>
                      </div>
                    )}
                    
                    {/* ChronoLink Bonus Info */}
                    <div className="mt-4 p-3 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 rounded-lg border border-cyan-500/20">
                      <div className="flex items-center gap-2 text-sm">
                        <Link2 className="w-4 h-4 text-cyan-400" />
                        <span className="text-cyan-400 font-medium">ChronoLink Bonus:</span>
                        <span className="text-slate-300">Link your syndicate to ChronoChat for +5% Shells on all activities</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </Card>
        </motion.div>

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

      {/* Create Syndicate Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
            onClick={() => setShowCreateModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-slate-900 border border-slate-700 rounded-xl p-6 max-w-md w-full"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white">Create Syndicate</h2>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowCreateModal(false)}
                  className="text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-slate-400 mb-2 block">Icon</label>
                  <div className="flex gap-2 flex-wrap">
                    {["⚡", "🔥", "💎", "🌟", "⚔️", "🛡️", "🎯", "🚀"].map((icon, idx) => (
                      <button
                        key={icon}
                        onClick={() => setNewSyndicateIcon(icon)}
                        data-testid={`button-icon-${idx}`}
                        className={`w-10 h-10 rounded-lg text-xl flex items-center justify-center transition-all ${
                          newSyndicateIcon === icon
                            ? "bg-amber-500/30 border-2 border-amber-500"
                            : "bg-slate-800 border border-slate-700 hover:border-slate-600"
                        }`}
                      >
                        {icon}
                      </button>
                    ))}
                  </div>
                </div>
                
                <div>
                  <label className="text-sm text-slate-400 mb-2 block">Syndicate Name</label>
                  <Input
                    value={newSyndicateName}
                    onChange={e => setNewSyndicateName(e.target.value)}
                    placeholder="Enter syndicate name..."
                    className="bg-slate-800 border-slate-700 text-white"
                    maxLength={50}
                    data-testid="input-syndicate-name"
                  />
                </div>
                
                <div>
                  <label className="text-sm text-slate-400 mb-2 block">Description (optional)</label>
                  <Textarea
                    value={newSyndicateDesc}
                    onChange={e => setNewSyndicateDesc(e.target.value)}
                    placeholder="What is your syndicate about?"
                    className="bg-slate-800 border-slate-700 text-white resize-none"
                    rows={3}
                    maxLength={200}
                    data-testid="input-syndicate-desc"
                  />
                </div>
                
                <Button
                  onClick={() => createSyndicateMutation.mutate({
                    name: newSyndicateName,
                    description: newSyndicateDesc,
                    icon: newSyndicateIcon
                  })}
                  disabled={!newSyndicateName.trim() || createSyndicateMutation.isPending}
                  className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400"
                  data-testid="button-confirm-create-syndicate"
                >
                  {createSyndicateMutation.isPending ? (
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  ) : (
                    <Plus className="w-4 h-4 mr-2" />
                  )}
                  Create Syndicate
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Join with Code Modal */}
      <AnimatePresence>
        {showJoinCodeModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
            onClick={() => setShowJoinCodeModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-slate-900 border border-slate-700 rounded-xl p-6 max-w-md w-full"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white">Join with Invite Code</h2>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowJoinCodeModal(false)}
                  className="text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-slate-400 mb-2 block">Invite Code</label>
                  <Input
                    value={joinCode}
                    onChange={e => setJoinCode(e.target.value.toUpperCase())}
                    placeholder="Enter invite code..."
                    className="bg-slate-800 border-slate-700 text-white font-mono text-center text-lg tracking-widest"
                    maxLength={20}
                    data-testid="input-join-code"
                  />
                  <p className="text-xs text-slate-500 mt-2">Ask a syndicate leader for their invite code</p>
                </div>
                
                <Button
                  onClick={() => joinWithCodeMutation.mutate(joinCode)}
                  disabled={!joinCode.trim() || joinWithCodeMutation.isPending}
                  className="w-full bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-400 hover:to-purple-400"
                  data-testid="button-confirm-join-code"
                >
                  {joinWithCodeMutation.isPending ? (
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  ) : (
                    <UserPlus className="w-4 h-4 mr-2" />
                  )}
                  Join Syndicate
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Syndicate Management Modal */}
      <AnimatePresence>
        {showManageModal && selectedSyndicate && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
            onClick={() => setShowManageModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-slate-900 border border-slate-700 rounded-xl p-6 max-w-md w-full"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{selectedSyndicate.icon || "⚡"}</span>
                  <div>
                    <h2 className="text-xl font-bold text-white">{selectedSyndicate.name}</h2>
                    <p className="text-sm text-slate-400">
                      {selectedSyndicate.memberCount || 1} members • Level {selectedSyndicate.level || 1}
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowManageModal(false)}
                  className="text-slate-400 hover:text-white"
                  data-testid="button-close-manage-modal"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>
              
              {selectedSyndicate.description && (
                <p className="text-slate-400 text-sm mb-6 p-3 bg-slate-800/50 rounded-lg">
                  {selectedSyndicate.description}
                </p>
              )}
              
              <div className="space-y-3">
                {/* ChronoLink Status */}
                {selectedSyndicate.isChronoLinkActive ? (
                  <div className="p-3 bg-cyan-500/10 border border-cyan-500/30 rounded-lg">
                    <div className="flex items-center gap-2 text-cyan-400 mb-1">
                      <Link2 className="w-4 h-4" />
                      <span className="font-medium">ChronoLink Active</span>
                    </div>
                    <p className="text-xs text-slate-400">+5% Shells bonus on all activities</p>
                  </div>
                ) : (selectedSyndicate.role === "leader" || String(selectedSyndicate.leaderId) === String(chroniclesAccount?.id)) && (
                  <Button
                    onClick={() => activateChronoLinkMutation.mutate(selectedSyndicate.id)}
                    disabled={activateChronoLinkMutation.isPending}
                    className="w-full bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-400 hover:to-purple-400"
                    data-testid="button-activate-chronolink"
                  >
                    {activateChronoLinkMutation.isPending ? (
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    ) : (
                      <Link2 className="w-4 h-4 mr-2" />
                    )}
                    Activate ChronoLink (+5% Shells)
                  </Button>
                )}
                
                {/* Generate Invite Code (leaders/officers only) */}
                {(selectedSyndicate.role === "leader" || selectedSyndicate.role === "officer" || String(selectedSyndicate.leaderId) === String(chroniclesAccount?.id)) && (
                  <Button
                    variant="outline"
                    onClick={() => generateInviteMutation.mutate(selectedSyndicate.id)}
                    disabled={generateInviteMutation.isPending}
                    className="w-full border-amber-500/30 text-amber-400 hover:bg-amber-500/10"
                    data-testid="button-generate-invite"
                  >
                    {generateInviteMutation.isPending ? (
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    ) : (
                      <UserPlus className="w-4 h-4 mr-2" />
                    )}
                    Generate Invite Code
                  </Button>
                )}
                
                {/* Leave Syndicate (non-leaders only) */}
                {selectedSyndicate.role !== "leader" && String(selectedSyndicate.leaderId) !== String(chroniclesAccount?.id) && (
                  <Button
                    variant="outline"
                    onClick={() => leaveSyndicateMutation.mutate(selectedSyndicate.id)}
                    disabled={leaveSyndicateMutation.isPending}
                    className="w-full border-red-500/30 text-red-400 hover:bg-red-500/10"
                    data-testid="button-leave-syndicate"
                  >
                    {leaveSyndicateMutation.isPending ? (
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    ) : null}
                    Leave Syndicate
                  </Button>
                )}
                
                {(selectedSyndicate.role === "leader" || String(selectedSyndicate.leaderId) === String(chroniclesAccount?.id)) && (
                  <p className="text-xs text-slate-500 text-center">
                    As the leader, you cannot leave. Transfer leadership first.
                  </p>
                )}
                
                {/* Coming Soon - Governance Features */}
                <div className="mt-6 pt-4 border-t border-slate-700">
                  <h3 className="text-sm font-medium text-purple-400 mb-3 flex items-center gap-2">
                    <Vote className="w-4 h-4" />
                    Syndicate Governance
                  </h3>
                  <div className="space-y-2">
                    <div className="p-3 bg-slate-800/50 border border-slate-700/50 rounded-lg opacity-60">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-300">Syndicate Voting</span>
                        <span className="text-xs bg-purple-500/20 text-purple-400 px-2 py-0.5 rounded-full">Coming Soon</span>
                      </div>
                      <p className="text-xs text-slate-500 mt-1">Vote on proposals, expel members, elect officers</p>
                    </div>
                    <div className="p-3 bg-slate-800/50 border border-slate-700/50 rounded-lg opacity-60">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-300">Era Time Warp</span>
                        <span className="text-xs bg-purple-500/20 text-purple-400 px-2 py-0.5 rounded-full">Coming Soon</span>
                      </div>
                      <p className="text-xs text-slate-500 mt-1">Collectively travel to new eras as a syndicate</p>
                    </div>
                    <div className="p-3 bg-slate-800/50 border border-slate-700/50 rounded-lg opacity-60">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-300">Syndicate Meetings</span>
                        <span className="text-xs bg-purple-500/20 text-purple-400 px-2 py-0.5 rounded-full">Coming Soon</span>
                      </div>
                      <p className="text-xs text-slate-500 mt-1">Schedule councils, plan missions, shape your world</p>
                    </div>
                  </div>
                  <p className="text-xs text-slate-500 text-center mt-3">
                    Advanced features unlock as our community grows
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Share Invite Modal */}
      <AnimatePresence>
        {showShareModal && generatedInviteUrl && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
            onClick={() => setShowShareModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-slate-900 border border-cyan-500/30 rounded-xl p-6 max-w-md w-full"
              onClick={e => e.stopPropagation()}
            >
              {/* Holographic header glow */}
              <div className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-b from-cyan-500/10 to-transparent rounded-t-xl" />
              
              <div className="relative">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <Share2 className="w-5 h-5 text-cyan-400" />
                    Share Invite Link
                  </h2>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setShowShareModal(false)}
                    className="text-slate-400 hover:text-white"
                    data-testid="button-close-share-modal"
                  >
                    <X className="w-5 h-5" />
                  </Button>
                </div>
                
                <div className="mb-6">
                  <p className="text-slate-400 text-sm mb-4">
                    Share this link with friends to invite them to your syndicate. They'll be able to join instantly!
                  </p>
                  
                  {/* URL Display with glassmorphism */}
                  <div className="relative group">
                    <div className="absolute -inset-[1px] bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 rounded-lg opacity-50 blur-sm group-hover:opacity-75 transition-opacity" />
                    <div className="relative bg-slate-800 rounded-lg p-4 border border-slate-700">
                      <p className="text-cyan-300 text-sm font-mono break-all" data-testid="text-invite-url">
                        {generatedInviteUrl}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <Button
                    onClick={() => {
                      navigator.clipboard.writeText(generatedInviteUrl);
                      toast.success("Invite link copied!");
                    }}
                    className="w-full bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-400 hover:to-purple-400"
                    data-testid="button-copy-invite-link"
                  >
                    <Copy className="w-4 h-4 mr-2" />
                    Copy Link
                  </Button>
                  
                  {/* Native Share API for mobile */}
                  {typeof navigator.share !== 'undefined' && (
                    <Button
                      variant="outline"
                      onClick={() => {
                        navigator.share({
                          title: `Join ${selectedSyndicate?.name || "my syndicate"}`,
                          text: "Join me in DarkWave Chronicles!",
                          url: generatedInviteUrl,
                        }).catch(() => {});
                      }}
                      className="w-full border-slate-600 text-slate-300 hover:bg-slate-800"
                      data-testid="button-native-share"
                    >
                      <Share2 className="w-4 h-4 mr-2" />
                      Share via...
                    </Button>
                  )}
                </div>
                
                <p className="text-xs text-slate-500 text-center mt-4">
                  Link expires in 24 hours • Single use
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <footer className="mt-16 pb-8 border-t border-slate-800/50">
        <div className="max-w-6xl mx-auto px-4 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-center md:text-left">
              <p className="text-sm text-slate-500">
                &copy; {new Date().getFullYear()} DarkWave Studios. All rights reserved.
              </p>
            </div>
            <div className="flex items-center gap-6 text-sm">
              <Link href="/chronicles/roadmap" className="text-slate-500 hover:text-cyan-400 transition-colors">
                Roadmap
              </Link>
              <Link href="/privacy" className="text-slate-500 hover:text-cyan-400 transition-colors">
                Privacy
              </Link>
              <Link href="/terms" className="text-slate-500 hover:text-cyan-400 transition-colors">
                Terms
              </Link>
              <Link href="/chronicles-admin" className="text-slate-600 hover:text-slate-400 transition-colors" data-testid="link-chronicles-team">
                Team
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
