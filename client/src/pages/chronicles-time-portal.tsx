import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "wouter";
import { 
  ChevronLeft, Timer, Sparkles, Lock, Gem, Scroll, Target, 
  ArrowRight, CheckCircle, HelpCircle, Lightbulb, AlertTriangle, Coins, Home
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { useSimpleAuth } from "@/hooks/use-simple-auth";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { toast } from "sonner";

export default function ChroniclesTimePortal() {
  const { user, loading: authLoading } = useSimpleAuth();
  const [selectedEra, setSelectedEra] = useState<any>(null);
  const [selectedMission, setSelectedMission] = useState<any>(null);
  const [riddleAnswer, setRiddleAnswer] = useState("");
  const qc = useQueryClient();

  const { data: portalData, isLoading: portalLoading } = useQuery({
    queryKey: ["/api/chronicles/portal"],
    queryFn: async () => {
      const res = await apiRequest("GET", "/api/chronicles/portal");
      return res.json();
    },
    enabled: !!user,
  });

  const { data: missionsData, isLoading: missionsLoading } = useQuery({
    queryKey: ["/api/chronicles/missions"],
    queryFn: async () => {
      const res = await apiRequest("GET", "/api/chronicles/missions");
      return res.json();
    },
    enabled: !!user,
  });

  const startMission = useMutation({
    mutationFn: async (missionId: string) => {
      const res = await apiRequest("POST", `/api/chronicles/missions/${missionId}/start`);
      return res.json();
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["/api/chronicles/missions"] });
      toast.success("Mission started! Follow the clues to find the artifact.");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to start mission");
    }
  });

  const revealHint = useMutation({
    mutationFn: async (missionId: string) => {
      const res = await apiRequest("POST", `/api/chronicles/missions/${missionId}/hint`);
      return res.json();
    },
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: ["/api/chronicles/missions"] });
      if (data.hint) {
        toast.success(`Hint revealed: ${data.hint}`);
      } else {
        toast.info("All hints have been revealed.");
      }
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to reveal hint");
    }
  });

  const submitRiddle = useMutation({
    mutationFn: async ({ missionId, answer }: { missionId: string; answer: string }) => {
      const res = await apiRequest("POST", `/api/chronicles/missions/${missionId}/riddle`, { answer });
      return res.json();
    },
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: ["/api/chronicles/missions"] });
      if (data.correct) {
        toast.success(data.message);
        setRiddleAnswer("");
      } else {
        toast.error(data.message);
      }
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to submit answer");
    }
  });

  const completeMission = useMutation({
    mutationFn: async (missionId: string) => {
      const res = await apiRequest("POST", `/api/chronicles/missions/${missionId}/complete`);
      return res.json();
    },
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: ["/api/chronicles/missions"] });
      qc.invalidateQueries({ queryKey: ["/api/chronicles/portal"] });
      qc.invalidateQueries({ queryKey: ["/api/shells/balance"] });
      if (data.artifact) {
        toast.success(`Artifact discovered: ${data.artifact.name}! +${data.rewards?.shells || 0} Shells`);
      } else {
        toast.success(`Mission complete! +${data.rewards?.shells || 0} Shells`);
      }
      setSelectedMission(null);
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to complete mission");
    }
  });

  const travelToEra = useMutation({
    mutationFn: async (eraCode: string) => {
      const res = await apiRequest("POST", "/api/chronicles/portal/travel", { eraCode });
      return res.json();
    },
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: ["/api/chronicles/portal"] });
      qc.invalidateQueries({ queryKey: ["/api/chronicles/missions"] });
      toast.success(data.message || "You have traveled through time!");
      setSelectedEra(null);
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to activate portal");
    }
  });

  if (authLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }}>
          <Timer className="w-12 h-12 text-cyan-400" />
        </motion.div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />
        </div>
        <Card className="relative z-10 bg-slate-900/80 border-slate-700 p-8 max-w-md mx-4 text-center">
          <motion.div
            animate={{ boxShadow: ["0 0 30px rgba(6,182,212,0.3)", "0 0 60px rgba(168,85,247,0.5)", "0 0 30px rgba(6,182,212,0.3)"] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-r from-cyan-500/30 to-purple-500/30 flex items-center justify-center border-2 border-cyan-500/40"
          >
            <Timer className="w-10 h-10 text-cyan-400" />
          </motion.div>
          <h2 className="text-2xl font-bold text-white mb-3">Time Portal Access Required</h2>
          <p className="text-slate-400 mb-6">
            Sign in to access the Time Portal and begin your journey through the ages. Complete missions, collect artifacts, and unlock new eras.
          </p>
          <Link href="/chronicles">
            <Button className="w-full bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500" data-testid="button-signin-chronicles">
              <ArrowRight className="w-4 h-4 mr-2" />
              Go to Chronicles & Sign In
            </Button>
          </Link>
        </Card>
      </div>
    );
  }

  if (portalLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }}>
          <Timer className="w-12 h-12 text-cyan-400" />
        </motion.div>
      </div>
    );
  }

  const currentEra = (portalData?.allEras || []).find((e: any) => e.code === portalData?.portal?.currentEraCode);

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/chronicles">
            <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white" data-testid="button-back-chronicles">
              <ChevronLeft className="w-5 h-5" />
            </Button>
          </Link>
          <Link href="/">
            <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white" data-testid="button-home">
              <Home className="w-5 h-5" />
            </Button>
          </Link>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Badge className="bg-cyan-500/20 text-cyan-400 border-cyan-500/30">BETA</Badge>
              <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30">Season Zero</Badge>
            </div>
            <h1 className="text-2xl font-bold" data-testid="text-portal-title">Time Portal</h1>
          </div>
        </div>

        <div className="bg-gradient-to-r from-cyan-900/20 to-purple-900/20 rounded-lg p-4 mb-6 border border-cyan-500/20">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span className="text-xs text-amber-400 uppercase tracking-wider font-semibold">Beta Notice</span>
          </div>
          <p className="text-sm text-slate-300">
            Time travel is in beta. Your progress is persistent and saved forever. Complete missions in your current era to collect artifacts and unlock new time periods!
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <Card className="bg-slate-900/80 border-slate-700 p-6">
              <div className="text-center mb-6">
                <motion.div
                  animate={{ boxShadow: ["0 0 30px rgba(6,182,212,0.3)", "0 0 60px rgba(168,85,247,0.5)", "0 0 30px rgba(6,182,212,0.3)"] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="w-24 h-24 mx-auto rounded-full bg-gradient-to-r from-cyan-500/30 to-purple-500/30 flex items-center justify-center border-2 border-cyan-500/40"
                >
                  <Timer className="w-12 h-12 text-cyan-400" />
                </motion.div>
              </div>
              
              <h2 className="text-xl font-bold text-center mb-2">Portal Status</h2>
              
              <div className="space-y-4 mt-4">
                <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
                  <div className="text-xs text-slate-500 uppercase tracking-wider mb-1">Current Era</div>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{currentEra?.icon || "🏙️"}</span>
                    <div>
                      <div className="font-bold text-white">{currentEra?.name || "Modern Era"}</div>
                      <div className="text-xs text-slate-400">{currentEra?.timePeriod || "Present Day"}</div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
                  <div className="text-xs text-slate-500 uppercase tracking-wider mb-1">Artifacts Collected</div>
                  <div className="flex items-center gap-2">
                    <Gem className="w-5 h-5 text-purple-400" />
                    <span className="text-xl font-bold">{portalData?.collectedArtifacts?.length || 0}</span>
                    <span className="text-slate-400">total</span>
                  </div>
                </div>
                
                <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
                  <div className="text-xs text-slate-500 uppercase tracking-wider mb-1">Time Travels</div>
                  <div className="flex items-center gap-2">
                    <Timer className="w-5 h-5 text-cyan-400" />
                    <span className="text-xl font-bold">{portalData?.portal?.totalTravels || 0}</span>
                    <span className="text-slate-400">journeys</span>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          <div className="lg:col-span-2 space-y-6">
            <Card className="bg-slate-900/80 border-slate-700 p-6">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <Target className="w-5 h-5 text-cyan-400" />
                Discovery Missions
                <Badge className="bg-slate-700 text-slate-300 ml-auto">{missionsData?.currentEra?.toUpperCase() || "MODERN"}</Badge>
              </h3>
              
              <div className="space-y-3">
                {(missionsData?.missions || []).map((mission: any) => {
                  const progress = (missionsData?.progress || []).find((p: any) => p.missionId === mission.id);
                  const isCompleted = progress?.status === 'completed';
                  const isActive = progress?.status === 'active';
                  
                  return (
                    <motion.div
                      key={mission.id}
                      whileHover={{ scale: isCompleted ? 1 : 1.01 }}
                      className={`p-4 rounded-lg border cursor-pointer transition-all ${
                        isCompleted 
                          ? "bg-green-500/10 border-green-500/30" 
                          : isActive
                            ? "bg-cyan-500/10 border-cyan-500/30"
                            : "bg-slate-800/50 border-slate-700 hover:border-cyan-500/30"
                      }`}
                      onClick={() => !isCompleted && setSelectedMission(mission)}
                      data-testid={`card-mission-${mission.id}`}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-3">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            isCompleted ? "bg-green-500/20" : isActive ? "bg-cyan-500/20" : "bg-slate-700"
                          }`}>
                            {isCompleted ? (
                              <CheckCircle className="w-5 h-5 text-green-400" />
                            ) : (
                              <Scroll className={`w-5 h-5 ${isActive ? "text-cyan-400" : "text-slate-400"}`} />
                            )}
                          </div>
                          <div>
                            <h4 className={`font-semibold ${isCompleted ? "text-green-400" : "text-white"}`}>
                              {mission.title}
                            </h4>
                            <p className="text-sm text-slate-400 mt-1">{mission.storyIntro}</p>
                            <div className="flex items-center gap-4 mt-2 text-xs text-slate-500">
                              <span className="flex items-center gap-1">
                                <Coins className="w-3 h-3" /> +{mission.shellsReward} Shells
                              </span>
                              <span>+{mission.experienceReward} XP</span>
                              {mission.difficultyLevel && (
                                <Badge variant="outline" className="text-xs capitalize">{mission.difficultyLevel}</Badge>
                              )}
                            </div>
                          </div>
                        </div>
                        <Badge className={
                          isCompleted 
                            ? "bg-green-500/20 text-green-400 border-green-500/30" 
                            : isActive 
                              ? "bg-cyan-500/20 text-cyan-400 border-cyan-500/30" 
                              : "bg-slate-700 text-slate-400"
                        }>
                          {isCompleted ? "Complete" : isActive ? "In Progress" : "Available"}
                        </Badge>
                      </div>
                    </motion.div>
                  );
                })}
                
                {(!missionsData?.missions || missionsData.missions.length === 0) && (
                  <div className="text-center py-8 text-slate-500">
                    <Target className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No missions available in this era yet.</p>
                  </div>
                )}
              </div>
            </Card>

            <Card className="bg-slate-900/80 border-slate-700 p-6">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <Timer className="w-5 h-5 text-purple-400" />
                Available Eras
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {(portalData?.allEras || []).map((era: any) => {
                  const playerEra = (portalData?.playerEras || []).find((pe: any) => pe.eraCode === era.code);
                  const isUnlocked = era.isStartingEra || playerEra?.isUnlocked;
                  const isCurrent = portalData?.portal?.currentEraCode === era.code;
                  
                  return (
                    <motion.div
                      key={era.id}
                      whileHover={{ scale: isUnlocked && !isCurrent ? 1.02 : 1 }}
                      className={`relative p-4 rounded-lg border cursor-pointer transition-all ${
                        isCurrent 
                          ? "bg-gradient-to-br from-cyan-500/20 to-purple-500/20 border-cyan-500/40" 
                          : isUnlocked
                            ? "bg-slate-800/50 border-slate-700 hover:border-purple-500/30"
                            : "bg-slate-800/30 border-slate-700/50 opacity-60"
                      }`}
                      onClick={() => isUnlocked && !isCurrent && setSelectedEra(era)}
                      data-testid={`card-era-${era.code}`}
                    >
                      {isCurrent && (
                        <Badge className="absolute -top-2 -right-2 bg-cyan-500 text-white text-xs">Current</Badge>
                      )}
                      <div className="flex items-start gap-3">
                        <span className={`text-4xl ${isUnlocked ? "" : "grayscale"}`}>{era.icon || "⏳"}</span>
                        <div>
                          <h4 className={`font-bold ${isUnlocked ? "text-white" : "text-slate-500"}`}>{era.name}</h4>
                          <p className="text-xs text-slate-400">{era.timePeriod}</p>
                          {!isUnlocked && (
                            <div className="flex items-center gap-2 text-xs text-slate-500 mt-2">
                              <Lock className="w-3 h-3" />
                              <span>Collect {era.artifactsRequired} artifacts</span>
                            </div>
                          )}
                        </div>
                      </div>
                      {isUnlocked && !isCurrent && (
                        <Button
                          size="sm"
                          className="w-full mt-3 bg-purple-600 hover:bg-purple-500"
                          onClick={(e) => { e.stopPropagation(); travelToEra.mutate(era.code); }}
                          disabled={travelToEra.isPending}
                          data-testid={`button-travel-${era.code}`}
                        >
                          <Timer className="w-4 h-4 mr-2" />
                          Travel Here
                        </Button>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            </Card>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {selectedMission && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
            onClick={() => setSelectedMission(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-slate-900 rounded-xl border border-slate-700 max-w-lg w-full max-h-[80vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <Badge className="bg-cyan-500/20 text-cyan-400 border-cyan-500/30 mb-2">Mission</Badge>
                    <h2 className="text-xl font-bold">{selectedMission.title}</h2>
                  </div>
                  <button onClick={() => setSelectedMission(null)} className="text-slate-500 hover:text-white" data-testid="button-close-modal">✕</button>
                </div>
                
                <p className="text-slate-300 mb-6">{selectedMission.storyIntro}</p>
                
                {(() => {
                  const progress = (missionsData?.progress || []).find((p: any) => p.missionId === selectedMission.id);
                  const isActive = progress?.status === 'active';
                  
                  if (!isActive) {
                    return (
                      <Button
                        className="w-full bg-cyan-600 hover:bg-cyan-500"
                        onClick={() => startMission.mutate(selectedMission.id)}
                        disabled={startMission.isPending}
                        data-testid="button-begin-mission"
                      >
                        <Target className="w-4 h-4 mr-2" />
                        Begin Mission
                      </Button>
                    );
                  }
                  
                  return (
                    <div className="space-y-4">
                      <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
                        <div className="flex items-center gap-2 mb-2">
                          <HelpCircle className="w-4 h-4 text-cyan-400" />
                          <span className="font-semibold text-sm">The Riddle</span>
                        </div>
                        <p className="text-slate-300 italic">"{selectedMission.riddleText}"</p>
                        
                        <div className="mt-4 flex gap-2">
                          <Input
                            placeholder="Your answer..."
                            value={riddleAnswer}
                            onChange={(e) => setRiddleAnswer(e.target.value)}
                            className="bg-slate-700 border-slate-600"
                            data-testid="input-riddle-answer"
                          />
                          <Button
                            onClick={() => submitRiddle.mutate({ missionId: selectedMission.id, answer: riddleAnswer })}
                            disabled={!riddleAnswer || submitRiddle.isPending}
                            data-testid="button-submit-riddle"
                          >
                            Submit
                          </Button>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => revealHint.mutate(selectedMission.id)}
                          disabled={revealHint.isPending || progress?.hintsRevealed >= 3}
                          data-testid="button-reveal-hint"
                        >
                          <Lightbulb className="w-4 h-4 mr-2" />
                          Reveal Hint ({progress?.hintsRevealed || 0}/3)
                        </Button>
                        
                        <Button
                          className="bg-green-600 hover:bg-green-500"
                          onClick={() => completeMission.mutate(selectedMission.id)}
                          disabled={completeMission.isPending}
                          data-testid="button-complete-mission"
                        >
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Complete Mission
                        </Button>
                      </div>
                      
                      {progress?.hintsRevealed > 0 && (
                        <div className="bg-amber-500/10 rounded-lg p-4 border border-amber-500/30">
                          <div className="flex items-center gap-2 mb-2">
                            <Lightbulb className="w-4 h-4 text-amber-400" />
                            <span className="font-semibold text-sm text-amber-400">Hints Revealed</span>
                          </div>
                          {progress.hintsRevealed >= 1 && selectedMission.hint1 && (
                            <p className="text-sm text-slate-300 mb-1">1. {selectedMission.hint1}</p>
                          )}
                          {progress.hintsRevealed >= 2 && selectedMission.hint2 && (
                            <p className="text-sm text-slate-300 mb-1">2. {selectedMission.hint2}</p>
                          )}
                          {progress.hintsRevealed >= 3 && selectedMission.hint3 && (
                            <p className="text-sm text-slate-300">3. {selectedMission.hint3}</p>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })()}
                
                <div className="mt-6 pt-4 border-t border-slate-700">
                  <div className="flex items-center justify-between text-sm text-slate-400">
                    <span>Rewards:</span>
                    <div className="flex items-center gap-4">
                      <span className="flex items-center gap-1"><Coins className="w-4 h-4 text-amber-400" /> {selectedMission.shellsReward} Shells</span>
                      <span>+{selectedMission.experienceReward} XP</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
