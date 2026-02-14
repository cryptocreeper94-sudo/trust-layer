import { useState, useRef, useEffect } from "react";
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
  Mic, MicOff, Volume2, VolumeX, ArrowLeft, Radio,
  Loader2, CheckCircle2, XCircle, Clock, Coins,
  Brain, Wand2, Sparkles, Shield, Play, Square,
  AlertTriangle, Waves, Headphones,
} from "lucide-react";

const TRAINING_SCRIPTS = [
  {
    id: "intro",
    title: "Introduction",
    text: "My name is... and I am a traveler across time. I have walked through modern cities, medieval kingdoms, and the wild frontier. My voice carries the weight of every choice I have made.",
    duration: "~15 seconds",
    difficulty: "easy",
  },
  {
    id: "medieval",
    title: "Medieval Proclamation",
    text: "Hear ye, good citizens of the realm! By decree of the council, the harvest festival shall commence at dawn. Let all who seek merriment gather at the town square. Bring your finest wares and your strongest ale!",
    duration: "~20 seconds",
    difficulty: "medium",
  },
  {
    id: "modern",
    title: "Modern Narration",
    text: "The city never sleeps. Neon lights reflect off rain-slicked streets as I walk through the financial district. Every decision here carries consequences — for me, for the people who trust me, for the world we are building together.",
    duration: "~20 seconds",
    difficulty: "medium",
  },
  {
    id: "wildwest",
    title: "Frontier Monologue",
    text: "This land don't care about your past. Out here, you're measured by what you do when the sun's beating down and there ain't nobody coming to save you. I chose to ride west, and I ain't looking back.",
    duration: "~15 seconds",
    difficulty: "easy",
  },
  {
    id: "emotional",
    title: "Emotional Range",
    text: "I remember the day everything changed. It started with laughter — pure, uncontainable joy. Then came the silence. The weight of what I had lost settled in, heavy and permanent. But even in the darkest moments, hope whispered: tomorrow will be different.",
    duration: "~25 seconds",
    difficulty: "hard",
  },
];

function RecordingVisualizer({ isRecording }: { isRecording: boolean }) {
  const bars = 24;

  return (
    <div className="flex items-center justify-center gap-[2px] h-16" data-testid="recording-visualizer">
      {Array.from({ length: bars }).map((_, i) => (
        <motion.div
          key={i}
          className={`w-1 rounded-full ${isRecording ? "bg-gradient-to-t from-cyan-500 to-purple-500" : "bg-gray-700"}`}
          animate={isRecording ? {
            height: [4, Math.random() * 48 + 8, 4],
          } : { height: 4 }}
          transition={isRecording ? {
            duration: 0.3 + Math.random() * 0.4,
            repeat: Infinity,
            repeatType: "reverse",
            delay: i * 0.03,
          } : {}}
        />
      ))}
    </div>
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

export default function ChroniclesVoice() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedScript, setSelectedScript] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const getAuthHeaders = (): Record<string, string> => {
    const session = getChroniclesSession();
    if (session?.token) return { Authorization: `Bearer ${session.token}`, "Content-Type": "application/json" };
    return { "Content-Type": "application/json" };
  };

  const { data: voiceStatus, isLoading } = useQuery({
    queryKey: ["/api/chronicles/voice/status"],
    queryFn: async () => {
      const res = await fetch("/api/chronicles/voice/status", { headers: getAuthHeaders() });
      if (!res.ok) return null;
      return res.json();
    },
    staleTime: 10000,
  });

  const trainMutation = useMutation({
    mutationFn: async (transcriptText: string) => {
      const res = await fetch("/api/chronicles/voice/train", {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({ transcriptText }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "Failed to start training");
      }
      return res.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Voice Training Started",
        description: `Sample submitted! ${data.sample.creditsSpent} credits used. Training in progress...`,
      });
      queryClient.invalidateQueries({ queryKey: ["/api/chronicles/voice/status"] });
      setAudioBlob(null);
      setSelectedScript(null);
    },
    onError: (error: any) => {
      toast({ title: "Training Failed", description: error.message, variant: "destructive" });
    },
  });

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        setAudioBlob(blob);
        stream.getTracks().forEach(t => t.stop());
      };

      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);

      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } catch {
      toast({ title: "Microphone Access Required", description: "Please allow microphone access to record voice samples.", variant: "destructive" });
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerRef.current) clearInterval(timerRef.current);
    }
  };

  const playRecording = () => {
    if (!audioBlob) return;
    const url = URL.createObjectURL(audioBlob);
    const audio = new Audio(url);
    audioRef.current = audio;
    audio.onended = () => setIsPlaying(false);
    audio.play();
    setIsPlaying(true);
  };

  const stopPlayback = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
    }
  };

  const handleSubmitSample = () => {
    const script = TRAINING_SCRIPTS.find(s => s.id === selectedScript);
    trainMutation.mutate(script?.text || "Voice training sample");
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (audioRef.current) audioRef.current.pause();
    };
  }, []);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  const voice = voiceStatus?.voice;
  const credits = voiceStatus?.credits;

  return (
    <div className="min-h-screen relative overflow-hidden pt-20 pb-12" style={{ background: "linear-gradient(180deg, #070b16, #0c1222, #070b16)" }}>
      <GlowOrb color="linear-gradient(135deg, #06b6d4, #3b82f6)" size={500} top="-5%" left="60%" />
      <GlowOrb color="linear-gradient(135deg, #8b5cf6, #ec4899)" size={400} top="40%" left="-10%" delay={3} />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <div className="flex items-center gap-3 mb-6">
          <Link href="/chronicles/play">
            <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white" data-testid="back-to-play">
              <ArrowLeft className="w-4 h-4 mr-1" /> Play
            </Button>
          </Link>
          <div className="flex-1">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
              Voice Training
            </h1>
            <p className="text-xs text-gray-500">Train your parallel self to speak in your voice</p>
          </div>
        </div>

        <GlassCard className="p-5 mb-5 border border-cyan-500/20">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-purple-600/20 flex items-center justify-center shrink-0">
              <Mic className="w-7 h-7 text-cyan-400" />
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-bold text-white mb-1">Your Parallel Self's Voice</h2>
              <p className="text-sm text-gray-400 leading-relaxed">
                Record voice samples reading the scripts below. Once trained, your parallel self
                in every era will speak with your actual voice — making conversations in Signal Chat
                feel truly personal. Other players hear YOU, not a generic game voice.
              </p>
            </div>
          </div>
        </GlassCard>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
          <GlassCard className="p-4 text-center">
            <div className={`w-10 h-10 rounded-full mx-auto mb-2 flex items-center justify-center ${
              voice?.isReady ? "bg-green-500/20" : voice?.processingCount > 0 ? "bg-yellow-500/20" : "bg-gray-500/20"
            }`}>
              {voice?.isReady ? (
                <CheckCircle2 className="w-5 h-5 text-green-400" />
              ) : voice?.processingCount > 0 ? (
                <Loader2 className="w-5 h-5 text-yellow-400 animate-spin" />
              ) : (
                <Mic className="w-5 h-5 text-gray-500" />
              )}
            </div>
            <p className="text-sm font-semibold text-white">
              {voice?.isReady ? "Voice Ready" : voice?.processingCount > 0 ? "Training..." : "Not Trained"}
            </p>
            <p className="text-[10px] text-gray-500 mt-0.5">
              {voice?.totalSamples || 0} sample{(voice?.totalSamples || 0) !== 1 ? "s" : ""} recorded
            </p>
          </GlassCard>

          <GlassCard className="p-4 text-center">
            <div className="w-10 h-10 rounded-full mx-auto mb-2 flex items-center justify-center bg-purple-500/20">
              <Coins className="w-5 h-5 text-purple-400" />
            </div>
            <p className="text-sm font-semibold text-white">{credits?.balance || 0} Credits</p>
            <p className="text-[10px] text-gray-500 mt-0.5">
              Clone: {credits?.voiceCloneCost || 50} | Message: {credits?.voiceMessageCost || 5}
            </p>
          </GlassCard>

          <GlassCard className="p-4 text-center">
            <div className="w-10 h-10 rounded-full mx-auto mb-2 flex items-center justify-center bg-cyan-500/20">
              <Headphones className="w-5 h-5 text-cyan-400" />
            </div>
            <p className="text-sm font-semibold text-white">
              {voice?.readyCount || 0} / 3
            </p>
            <p className="text-[10px] text-gray-500 mt-0.5">Minimum 3 samples for best quality</p>
          </GlassCard>
        </div>

        {voice?.isReady && (
          <GlassCard className="p-4 mb-5 border border-green-500/20">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-green-400" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-green-400">Voice Clone Active</p>
                <p className="text-xs text-gray-400">
                  Your parallel self now speaks in your voice. Use it in Signal Chat voice channels
                  and NPC conversations. Each voice message costs {credits?.voiceMessageCost || 5} credits.
                </p>
              </div>
              <Badge className="bg-green-500/20 text-green-400">Active</Badge>
            </div>
          </GlassCard>
        )}

        <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
          <Waves className="w-4 h-4 text-cyan-400" /> Training Scripts
        </h3>
        <p className="text-xs text-gray-500 mb-4">
          Select a script, read it aloud, and submit the recording. More samples = better voice quality.
        </p>

        <div className="space-y-3 mb-6">
          {TRAINING_SCRIPTS.map(script => (
            <motion.div key={script.id} layout>
              <div
                className="cursor-pointer"
                onClick={() => setSelectedScript(selectedScript === script.id ? null : script.id)}
                data-testid={`script-${script.id}`}
              >
              <GlassCard
                className={`p-4 transition-all border ${
                  selectedScript === script.id
                    ? "border-cyan-500/40 bg-cyan-500/5"
                    : "border-white/10 hover:border-white/20"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-white">{script.title}</span>
                    <Badge className={
                      script.difficulty === "hard" ? "bg-red-500/20 text-red-400 text-[9px]" :
                      script.difficulty === "medium" ? "bg-yellow-500/20 text-yellow-400 text-[9px]" :
                      "bg-green-500/20 text-green-400 text-[9px]"
                    }>
                      {script.difficulty}
                    </Badge>
                  </div>
                  <span className="text-[10px] text-gray-500 flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {script.duration}
                  </span>
                </div>

                <AnimatePresence>
                  {selectedScript === script.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                    >
                      <div className="mt-3 p-3 rounded-lg bg-white/5 border border-white/10">
                        <p className="text-sm text-gray-300 leading-relaxed italic">
                          "{script.text}"
                        </p>
                      </div>

                      <div className="mt-4">
                        <RecordingVisualizer isRecording={isRecording} />

                        <div className="flex items-center justify-center gap-3 mt-3">
                          {!isRecording && !audioBlob && (
                            <Button
                              onClick={(e) => { e.stopPropagation(); startRecording(); }}
                              className="bg-gradient-to-r from-red-500 to-pink-600 text-white px-6"
                              data-testid="start-recording-btn"
                            >
                              <Mic className="w-4 h-4 mr-2" /> Start Recording
                            </Button>
                          )}

                          {isRecording && (
                            <>
                              <span className="text-sm font-mono text-red-400 animate-pulse flex items-center gap-1">
                                <Radio className="w-3 h-3" /> {formatTime(recordingTime)}
                              </span>
                              <Button
                                onClick={(e) => { e.stopPropagation(); stopRecording(); }}
                                className="bg-slate-700 text-white px-6"
                                data-testid="stop-recording-btn"
                              >
                                <Square className="w-4 h-4 mr-2" /> Stop
                              </Button>
                            </>
                          )}

                          {audioBlob && !isRecording && (
                            <div className="flex items-center gap-2">
                              <Button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  isPlaying ? stopPlayback() : playRecording();
                                }}
                                variant="outline"
                                className="border-cyan-500/30 text-cyan-400"
                                data-testid="playback-btn"
                              >
                                {isPlaying ? <Square className="w-4 h-4 mr-1" /> : <Play className="w-4 h-4 mr-1" />}
                                {isPlaying ? "Stop" : "Preview"}
                              </Button>

                              <Button
                                onClick={(e) => { e.stopPropagation(); setAudioBlob(null); }}
                                variant="outline"
                                className="border-white/20 text-gray-400"
                                data-testid="re-record-btn"
                              >
                                Re-record
                              </Button>

                              <Button
                                onClick={(e) => { e.stopPropagation(); handleSubmitSample(); }}
                                disabled={trainMutation.isPending}
                                className="bg-gradient-to-r from-cyan-500 to-purple-600 text-white px-4"
                                data-testid="submit-sample-btn"
                              >
                                {trainMutation.isPending ? (
                                  <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                                ) : (
                                  <Wand2 className="w-4 h-4 mr-1" />
                                )}
                                Submit ({credits?.voiceCloneCost || 50} credits)
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </GlassCard>
              </div>
            </motion.div>
          ))}
        </div>

        <GlassCard className="p-4 border border-white/10">
          <h4 className="text-white font-semibold text-sm mb-2 flex items-center gap-2">
            <Shield className="w-4 h-4 text-cyan-400" /> How Voice Training Works
          </h4>
          <div className="space-y-2 text-xs text-gray-400">
            <div className="flex items-start gap-2">
              <span className="text-cyan-400 font-bold mt-0.5">1.</span>
              <p>Record yourself reading the training scripts above. Speak naturally — this is YOUR voice.</p>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-cyan-400 font-bold mt-0.5">2.</span>
              <p>Submit at least 3 samples for best quality. More samples = more accurate voice clone.</p>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-cyan-400 font-bold mt-0.5">3.</span>
              <p>Once trained, your parallel self speaks in YOUR voice in Signal Chat voice channels.</p>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-cyan-400 font-bold mt-0.5">4.</span>
              <p>Voice messages cost {credits?.voiceMessageCost || 5} credits each. Your voice data is encrypted and never shared.</p>
            </div>
          </div>
        </GlassCard>
      </div>
  );
}
