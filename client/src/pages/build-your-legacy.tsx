import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link, useLocation } from "wouter";
import { 
  Mic, MicOff, Play, Pause, RotateCcw, Check, X, ArrowLeft,
  Sparkles, Brain, Volume2, VolumeX, Coins, Zap, Eye, Shield,
  ChevronRight, Crown, User, Settings, CreditCard
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Footer } from "@/components/footer";
import { usePageAnalytics } from "@/hooks/use-analytics";
import { useAuth } from "@/hooks/use-auth";
import { apiRequest } from "@/lib/queryClient";

import fantasyHeroes from "@assets/generated_images/fantasy_character_heroes.png";

type RecordingState = "idle" | "recording" | "recorded" | "playing";

export default function BuildYourLegacy() {
  usePageAnalytics();
  const { user, isLoading: authLoading } = useAuth();
  const queryClient = useQueryClient();
  const [, setLocation] = useLocation();
  
  const [recordingState, setRecordingState] = useState<RecordingState>("idle");
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [currentPromptIndex, setCurrentPromptIndex] = useState(0);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const { data: voiceData, isLoading: voiceLoading } = useQuery({
    queryKey: ["/api/voice/status"],
    queryFn: async () => {
      const res = await apiRequest("GET", "/api/voice/status");
      return res.json();
    },
    enabled: !!user,
  });

  const { data: creditsData, isLoading: creditsLoading } = useQuery({
    queryKey: ["/api/credits/balance"],
    queryFn: async () => {
      const res = await apiRequest("GET", "/api/credits/balance");
      return res.json();
    },
    enabled: !!user,
  });

  const { data: personalityData, isLoading: personalityLoading } = useQuery({
    queryKey: ["/api/chronicles/personality"],
    queryFn: async () => {
      const res = await apiRequest("GET", "/api/chronicles/personality");
      return res.json();
    },
    enabled: !!user,
  });

  const saveSampleMutation = useMutation({
    mutationFn: async (data: { sampleUrl: string; duration: number; transcript: string }) => {
      const res = await apiRequest("POST", "/api/voice/sample", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/voice/status"] });
    },
  });

  const prompts = voiceData?.prompts || [
    "In the realm of shadows, I walk unafraid. My name is written in the stars, and my legacy echoes through time.",
  ];

  const currentPrompt = prompts[currentPromptIndex % prompts.length];

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        setAudioBlob(blob);
        setAudioUrl(URL.createObjectURL(blob));
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setRecordingState("recording");
      setRecordingDuration(0);
      
      timerRef.current = setInterval(() => {
        setRecordingDuration(prev => prev + 1);
      }, 1000);
    } catch (err) {
      console.error("Failed to start recording:", err);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && recordingState === "recording") {
      mediaRecorderRef.current.stop();
      setRecordingState("recorded");
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }
  };

  const playRecording = () => {
    if (audioUrl && audioRef.current) {
      audioRef.current.play();
      setRecordingState("playing");
    }
  };

  const pauseRecording = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setRecordingState("recorded");
    }
  };

  const resetRecording = () => {
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
    }
    setAudioBlob(null);
    setAudioUrl(null);
    setRecordingState("idle");
    setRecordingDuration(0);
    setCurrentPromptIndex(prev => prev + 1);
  };

  const submitRecording = async () => {
    if (!audioBlob) return;
    
    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64 = reader.result as string;
      await saveSampleMutation.mutateAsync({
        sampleUrl: base64,
        duration: recordingDuration,
        transcript: currentPrompt,
      });
      resetRecording();
    };
    reader.readAsDataURL(audioBlob);
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
    };
  }, [audioUrl]);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <div className="animate-pulse text-cyan-400">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-950 text-white">
        <div className="max-w-4xl mx-auto px-4 py-20 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <Crown className="w-20 h-20 text-amber-400 mx-auto" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Build Your Legacy
            </h1>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto">
              Sign in to create your parallel self - a voice that speaks as you across 70+ historical eras.
            </p>
            <Link href="/">
              <Button size="lg" className="bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700">
                Sign In to Begin
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>
    );
  }

  const personality = personalityData?.personality;
  const choiceSignature = personalityData?.choiceSignature;
  const emotionalState = personalityData?.emotionalState;

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
      </div>

      <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 py-3 sm:py-4 flex items-center justify-between gap-2">
          <Link href="/chronicles">
            <Button variant="ghost" className="text-slate-400 hover:text-white text-sm sm:text-base px-2 sm:px-4" data-testid="link-back">
              <ArrowLeft className="w-4 h-4 mr-1 sm:mr-2 flex-shrink-0" />
              <span className="hidden xs:inline">Back to </span>Chronicles
            </Button>
          </Link>
          
          <div className="flex items-center">
            {creditsData && (
              <div className="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full bg-slate-800/50 border border-amber-500/30">
                <Coins className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400" />
                <span className="text-amber-300 font-medium text-sm sm:text-base" data-testid="text-credit-balance">
                  {creditsData.balance?.toLocaleString() || 0} Credits
                </span>
              </div>
            )}
          </div>
        </div>
      </nav>

      <main className="relative pt-24 pb-20 px-4">
        <div className="max-w-6xl mx-auto space-y-12">
          <motion.header
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center space-y-4"
          >
            <Badge className="bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border-cyan-500/40 text-cyan-300">
              <Sparkles className="w-3 h-3 mr-1" />
              Pre-Launch Access
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Build Your Legacy
            </h1>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto">
              Shape the essence of your parallel self. Record your voice, define your worldview, and prepare for the adventure of lifetimes.
            </p>
          </motion.header>

          <div className="grid md:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm p-6 space-y-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/30">
                    <Volume2 className="w-6 h-6 text-cyan-400" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">Voice Sample</h2>
                    <p className="text-sm text-slate-400">Your parallel self speaks with your voice</p>
                  </div>
                </div>

                {voiceData?.hasVoiceSample ? (
                  <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 space-y-3">
                    <div className="flex items-center gap-2 text-emerald-400">
                      <Check className="w-5 h-5" />
                      <span className="font-medium">Voice Sample Recorded</span>
                    </div>
                    <p className="text-sm text-slate-300">
                      Your voice is ready. When Chronicles launches, your parallel self will speak as you.
                    </p>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={resetRecording}
                      className="border-slate-600"
                      data-testid="button-rerecord"
                    >
                      <RotateCcw className="w-4 h-4 mr-2" />
                      Record New Sample
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700">
                      <p className="text-sm text-slate-300 italic leading-relaxed">
                        "{currentPrompt}"
                      </p>
                    </div>

                    <div className="flex flex-col items-center gap-4">
                      <AnimatePresence mode="wait">
                        {recordingState === "idle" && (
                          <motion.div
                            key="idle"
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.8, opacity: 0 }}
                          >
                            <Button
                              size="lg"
                              onClick={startRecording}
                              className="w-20 h-20 rounded-full bg-gradient-to-br from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500"
                              data-testid="button-start-recording"
                            >
                              <Mic className="w-8 h-8" />
                            </Button>
                          </motion.div>
                        )}

                        {recordingState === "recording" && (
                          <motion.div
                            key="recording"
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.8, opacity: 0 }}
                            className="flex flex-col items-center gap-3"
                          >
                            <div className="relative">
                              <motion.div
                                className="absolute inset-0 rounded-full bg-red-500/30"
                                animate={{ scale: [1, 1.3, 1] }}
                                transition={{ repeat: Infinity, duration: 1.5 }}
                              />
                              <Button
                                size="lg"
                                onClick={stopRecording}
                                className="w-20 h-20 rounded-full bg-red-500 hover:bg-red-600 relative z-10"
                                data-testid="button-stop-recording"
                              >
                                <MicOff className="w-8 h-8" />
                              </Button>
                            </div>
                            <span className="text-lg font-mono text-red-400">
                              {formatDuration(recordingDuration)}
                            </span>
                          </motion.div>
                        )}

                        {(recordingState === "recorded" || recordingState === "playing") && (
                          <motion.div
                            key="recorded"
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.8, opacity: 0 }}
                            className="flex flex-col items-center gap-4"
                          >
                            <div className="flex items-center gap-3">
                              <Button
                                size="lg"
                                onClick={recordingState === "playing" ? pauseRecording : playRecording}
                                className="w-14 h-14 rounded-full bg-slate-700 hover:bg-slate-600"
                                data-testid="button-play-recording"
                              >
                                {recordingState === "playing" ? (
                                  <Pause className="w-6 h-6" />
                                ) : (
                                  <Play className="w-6 h-6" />
                                )}
                              </Button>
                              <span className="text-lg font-mono text-slate-300">
                                {formatDuration(recordingDuration)}
                              </span>
                            </div>
                            <div className="flex gap-3">
                              <Button
                                variant="outline"
                                onClick={resetRecording}
                                className="border-slate-600"
                                data-testid="button-discard-recording"
                              >
                                <X className="w-4 h-4 mr-2" />
                                Discard
                              </Button>
                              <Button
                                onClick={submitRecording}
                                disabled={saveSampleMutation.isPending}
                                className="bg-gradient-to-r from-emerald-500 to-teal-600"
                                data-testid="button-submit-recording"
                              >
                                <Check className="w-4 h-4 mr-2" />
                                {saveSampleMutation.isPending ? "Saving..." : "Save Sample"}
                              </Button>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    {audioUrl && (
                      <audio
                        ref={audioRef}
                        src={audioUrl}
                        onEnded={() => setRecordingState("recorded")}
                        className="hidden"
                      />
                    )}
                  </div>
                )}
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm p-6 space-y-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30">
                    <Brain className="w-6 h-6 text-purple-400" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">Your Parallel Self</h2>
                    <p className="text-sm text-slate-400">Identity emerges through choices</p>
                  </div>
                </div>

                {personality ? (
                  <div className="space-y-4">
                    <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-800/50 border border-slate-700">
                      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center text-2xl font-bold">
                        {personality.playerName?.charAt(0) || "?"}
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-white" data-testid="text-player-name">
                          {personality.playerName || "Unknown Traveler"}
                        </h3>
                        <p className="text-sm text-slate-400 capitalize">
                          {personality.worldview || "Realist"} Worldview
                        </p>
                      </div>
                    </div>

                    {choiceSignature && (
                      <div className="p-4 rounded-xl bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/30">
                        <p className="text-sm text-slate-300 italic" data-testid="text-choice-signature">
                          "{choiceSignature}"
                        </p>
                      </div>
                    )}

                    {emotionalState && (
                      <div className="space-y-3">
                        <h4 className="text-sm font-medium text-slate-400">Emotional Tendencies</h4>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          {[
                            { label: "Courage", value: emotionalState.courageFear, positive: "Brave", negative: "Cautious" },
                            { label: "Hope", value: emotionalState.hopeDespair, positive: "Hopeful", negative: "Pragmatic" },
                            { label: "Trust", value: emotionalState.trustSuspicion, positive: "Trusting", negative: "Skeptical" },
                            { label: "Passion", value: emotionalState.passionApathy, positive: "Passionate", negative: "Measured" },
                            { label: "Wisdom", value: emotionalState.wisdomRecklessness, positive: "Deliberate", negative: "Bold" },
                          ].map(axis => (
                            <div key={axis.label} className="p-2 rounded bg-slate-800/50 border border-slate-700">
                              <div className="flex justify-between mb-1">
                                <span className="text-slate-500">{axis.label}</span>
                                <span className="text-slate-300">
                                  {axis.value > 0 ? axis.positive : axis.value < 0 ? axis.negative : "Balanced"}
                                </span>
                              </div>
                              <Progress 
                                value={50 + (axis.value / 2)} 
                                className="h-1"
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <Link href="/chronicles/ai">
                      <Button className="w-full bg-gradient-to-r from-purple-500 to-pink-600" data-testid="link-ai-demo">
                        <Sparkles className="w-4 h-4 mr-2" />
                        Experience AI Demo
                        <ChevronRight className="w-4 h-4 ml-2" />
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <p className="text-slate-400">
                      Your parallel self hasn't emerged yet. Begin your journey to discover who you become across history.
                    </p>
                    <Link href="/chronicles/ai">
                      <Button className="w-full bg-gradient-to-r from-purple-500 to-pink-600" data-testid="link-start-journey">
                        <Sparkles className="w-4 h-4 mr-2" />
                        Start Your Journey
                        <ChevronRight className="w-4 h-4 ml-2" />
                      </Button>
                    </Link>
                  </div>
                )}
              </Card>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm p-6 space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 border border-amber-500/30">
                    <Coins className="w-6 h-6 text-amber-400" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">Credits</h2>
                    <p className="text-sm text-slate-400">Power your adventures</p>
                  </div>
                </div>
                <Link href="/credits">
                  <Button variant="outline" className="border-amber-500/40 text-amber-300 hover:bg-amber-500/10" data-testid="link-buy-credits">
                    <CreditCard className="w-4 h-4 mr-2" />
                    Buy Credits
                  </Button>
                </Link>
              </div>

              <div className="grid md:grid-cols-4 gap-4">
                <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700 text-center">
                  <p className="text-3xl font-bold text-amber-400" data-testid="text-current-balance">
                    {creditsData?.balance?.toLocaleString() || 0}
                  </p>
                  <p className="text-sm text-slate-400">Current Balance</p>
                </div>
                <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700 text-center">
                  <p className="text-3xl font-bold text-emerald-400" data-testid="text-lifetime-earned">
                    {creditsData?.lifetimeEarned?.toLocaleString() || 0}
                  </p>
                  <p className="text-sm text-slate-400">Lifetime Earned</p>
                </div>
                <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700 text-center">
                  <p className="text-3xl font-bold text-purple-400" data-testid="text-lifetime-spent">
                    {creditsData?.lifetimeSpent?.toLocaleString() || 0}
                  </p>
                  <p className="text-sm text-slate-400">Lifetime Spent</p>
                </div>
                <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700 text-center">
                  <p className="text-3xl font-bold text-cyan-400" data-testid="text-daily-usage">
                    {creditsData?.dailyUsage || 0}
                  </p>
                  <p className="text-sm text-slate-400">Today's Actions</p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/30">
                <div className="flex items-start gap-3">
                  <Zap className="w-5 h-5 text-amber-400 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-amber-300">Credit Costs</h4>
                    <ul className="mt-2 text-sm text-slate-300 space-y-1">
                      <li>AI Chat Message: 10 credits</li>
                      <li>Scenario Generation: 20 credits</li>
                      <li>Choice Processing: 5 credits</li>
                      <li>Voice Clone Creation: 500 credits</li>
                    </ul>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-center"
          >
            <div className="flex flex-col sm:flex-row items-center gap-4 p-4 sm:p-6 rounded-2xl bg-gradient-to-r from-slate-800/50 to-slate-900/50 border border-slate-700 max-w-lg mx-auto sm:max-w-none sm:inline-flex">
              <img 
                src={fantasyHeroes} 
                alt="Fantasy heroes" 
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl object-cover flex-shrink-0"
              />
              <div className="text-center sm:text-left">
                <h3 className="text-lg sm:text-xl font-bold text-white">Ready for Adventure?</h3>
                <p className="text-slate-400 mb-3 text-sm sm:text-base">Try the AI demo now - experience your parallel self in action.</p>
                <Link href="/chronicles/ai">
                  <Button className="bg-gradient-to-r from-cyan-500 to-purple-600 w-full sm:w-auto" data-testid="link-experience-demo">
                    <Sparkles className="w-4 h-4 mr-2" />
                    Experience the Demo
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
