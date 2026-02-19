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
  Briefcase, UtensilsCrossed, BedDouble, Droplets, Users,
  ArrowLeft, Clock, Star, ChevronRight, Zap, Heart,
  Sparkles, Sun, Moon, Sunrise, Sunset, CloudSun,
  TrendingUp, Award, Shield, CircleDollarSign, Timer,
  Coffee, Dumbbell, BookOpen, MapPin, CheckCircle2, XCircle,
} from "lucide-react";

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

const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.06 } } };
const fadeUp = { hidden: { opacity: 0, y: 15 }, visible: { opacity: 1, y: 0, transition: { duration: 0.35 } } };

function NeedBar({ label, value, icon: Icon, color, emoji }: { label: string; value: number; icon: any; color: string; emoji: string }) {
  const getBarColor = (v: number) => {
    if (v >= 70) return "bg-emerald-500";
    if (v >= 40) return "bg-yellow-500";
    return "bg-red-500";
  };
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <span className="text-sm">{emoji}</span>
          <span className="text-xs text-gray-400">{label}</span>
        </div>
        <span className={`text-xs font-bold ${value < 30 ? "text-red-400 animate-pulse" : "text-gray-300"}`}>{value}%</span>
      </div>
      <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
        <motion.div
          className={`h-full rounded-full ${getBarColor(value)}`}
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}

function TimeOfDayBanner({ hour, context }: { hour: number; context: any }) {
  const getTimeIcon = () => {
    if (hour >= 5 && hour < 8) return { icon: Sunrise, label: "Early Morning", emoji: "🌅", gradient: "from-orange-500/20 to-yellow-500/20" };
    if (hour >= 8 && hour < 12) return { icon: Sun, label: "Morning", emoji: "☀️", gradient: "from-yellow-500/20 to-amber-500/20" };
    if (hour >= 12 && hour < 14) return { icon: CloudSun, label: "Midday", emoji: "🌤️", gradient: "from-blue-500/20 to-cyan-500/20" };
    if (hour >= 14 && hour < 17) return { icon: Sun, label: "Afternoon", emoji: "🌇", gradient: "from-amber-500/20 to-orange-500/20" };
    if (hour >= 17 && hour < 20) return { icon: Sunset, label: "Evening", emoji: "🌆", gradient: "from-purple-500/20 to-pink-500/20" };
    if (hour >= 20 && hour < 23) return { icon: Moon, label: "Night", emoji: "🌙", gradient: "from-indigo-500/20 to-purple-500/20" };
    return { icon: Moon, label: "Late Night", emoji: "🌑", gradient: "from-slate-700/20 to-indigo-900/20" };
  };

  const time = getTimeIcon();

  return (
    <GlassCard glow className="p-4 relative overflow-hidden">
      <div className={`absolute inset-0 bg-gradient-to-r ${time.gradient}`} />
      <div className="relative z-10 flex items-center gap-3">
        <motion.span
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 3, repeat: Infinity }}
          className="text-3xl"
        >
          {time.emoji}
        </motion.span>
        <div className="flex-1">
          <h3 className="text-white font-bold">{time.label}</h3>
          <p className="text-xs text-gray-400">{context?.description || "The day unfolds before you."}</p>
        </div>
        <div className="text-right">
          <div className="flex items-center gap-1 text-gray-400">
            <Clock className="w-3.5 h-3.5" />
            <span className="text-sm font-mono">{String(hour).padStart(2, "0")}:00</span>
          </div>
          <p className="text-[9px] text-gray-600">{context?.location || "home"}</p>
        </div>
      </div>
    </GlassCard>
  );
}

function OfflineRecapCard({ recap }: { recap: any }) {
  if (!recap) return null;

  return (
    <motion.div variants={fadeUp}>
      <GlassCard className="p-4 border border-cyan-500/20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 to-blue-500/5" />
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <Timer className="w-4 h-4 text-cyan-400" />
            <h4 className="text-white font-bold text-sm">While You Were Away</h4>
            <Badge className="bg-cyan-500/20 text-cyan-400 text-[9px]">{recap.hoursAway}h offline</Badge>
          </div>
          <p className="text-xs text-gray-400 mb-3">{recap.recap}</p>
          <div className="flex gap-3 flex-wrap">
            {recap.echoesEarned > 0 && (
              <div className="flex items-center gap-1 text-yellow-400">
                <CircleDollarSign className="w-3 h-3" />
                <span className="text-xs font-bold">+{recap.echoesEarned} echoes</span>
              </div>
            )}
            {recap.mealsEaten > 0 && (
              <div className="flex items-center gap-1 text-green-400">
                <UtensilsCrossed className="w-3 h-3" />
                <span className="text-xs">{recap.mealsEaten} meals</span>
              </div>
            )}
            {recap.workShiftsCompleted > 0 && (
              <div className="flex items-center gap-1 text-blue-400">
                <Briefcase className="w-3 h-3" />
                <span className="text-xs">{recap.workShiftsCompleted} shifts</span>
              </div>
            )}
          </div>
        </div>
      </GlassCard>
    </motion.div>
  );
}

export default function ChroniclesDailyLife() {
  const queryClient = useQueryClient();
  const session = getChroniclesSession();
  const [selectedEra, setSelectedEra] = useState("medieval");
  const [showHireModal, setShowHireModal] = useState(false);
  const [showMealModal, setShowMealModal] = useState(false);

  const { data: summary, isLoading } = useQuery({
    queryKey: ["/api/chronicles/daily-life/summary", selectedEra],
    queryFn: async () => {
      const res = await authFetch(`/api/chronicles/daily-life/summary?era=${selectedEra}`);
      if (!res.ok) return null;
      return res.json();
    },
    staleTime: 15000,
    refetchInterval: 60000,
  });

  const { data: availableJobs } = useQuery({
    queryKey: ["/api/chronicles/careers/available", selectedEra],
    queryFn: async () => {
      const res = await authFetch(`/api/chronicles/careers/available?era=${selectedEra}`);
      return res.json();
    },
    enabled: showHireModal,
  });

  const { data: sessionContext } = useQuery({
    queryKey: ["/api/chronicles/session-context", selectedEra],
    queryFn: async () => {
      const res = await authFetch(`/api/chronicles/session-context?era=${selectedEra}`);
      return res.json();
    },
    staleTime: 30000,
  });

  const hireMutation = useMutation({
    mutationFn: async ({ occupation, shiftPreference }: { occupation: string; shiftPreference: string }) => {
      const res = await authFetch("/api/chronicles/career/hire", {
        method: "POST",
        body: JSON.stringify({ era: selectedEra, occupation, shiftPreference }),
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/chronicles/daily-life/summary"] });
      queryClient.invalidateQueries({ queryKey: ["/api/chronicles/career"] });
      setShowHireModal(false);
    },
  });

  const workMutation = useMutation({
    mutationFn: async () => {
      const res = await authFetch("/api/chronicles/career/work", {
        method: "POST",
        body: JSON.stringify({ era: selectedEra }),
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/chronicles/daily-life/summary"] });
      queryClient.invalidateQueries({ queryKey: ["/api/chronicles/needs"] });
    },
  });

  const fulfillNeedMutation = useMutation({
    mutationFn: async ({ action, mealIndex }: { action: string; mealIndex?: number }) => {
      const res = await authFetch("/api/chronicles/needs/fulfill", {
        method: "POST",
        body: JSON.stringify({ action, era: selectedEra, mealIndex }),
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/chronicles/daily-life/summary"] });
      queryClient.invalidateQueries({ queryKey: ["/api/chronicles/needs"] });
      setShowMealModal(false);
    },
  });

  const quitMutation = useMutation({
    mutationFn: async () => {
      const res = await authFetch("/api/chronicles/career/quit", {
        method: "POST",
        body: JSON.stringify({ era: selectedEra }),
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/chronicles/daily-life/summary"] });
    },
  });

  const career = summary?.career;
  const needs = summary?.needs;
  const context = summary?.context;
  const meals = summary?.meals || [];
  const hour = summary?.hour || new Date().getHours();

  if (!session) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
        <GlassCard className="p-8 text-center max-w-sm">
          <p className="text-gray-400 mb-4">Sign in to Chronicles to access Daily Life</p>
          <Link href="/chronicles">
            <Button className="bg-gradient-to-r from-cyan-600 to-blue-600 min-h-[44px]" data-testid="btn-login-daily">Enter Chronicles</Button>
          </Link>
        </GlassCard>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 pb-20 relative" data-testid="daily-life-page">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10">
        <div className="pt-4 pb-6 px-4 sm:px-6 lg:px-8">
          <div className="container mx-auto">
            <div className="flex items-center gap-3 mb-6">
              <Link href="/chronicles/play">
                <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white min-h-[44px] min-w-[44px] active:scale-95" data-testid="btn-back">
                  <ArrowLeft className="w-4 h-4" />
                </Button>
              </Link>
              <div className="flex-1">
                <h1 className="text-2xl font-black bg-gradient-to-r from-blue-400 via-cyan-400 to-emerald-400 bg-clip-text text-transparent">Daily Life</h1>
                <p className="text-xs text-gray-500">Career, needs & routines</p>
              </div>
            </div>

            <div className="flex gap-2 mb-6 overflow-x-auto scrollbar-hide pb-1">
              {[
                { id: "medieval", label: "Medieval", emoji: "🏰" },
                { id: "wildwest", label: "Wild West", emoji: "🤠" },
                { id: "modern", label: "Modern", emoji: "🏙️" },
              ].map((era) => (
                <button
                  key={era.id}
                  onClick={() => setSelectedEra(era.id)}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all min-h-[44px] whitespace-nowrap active:scale-95 ${
                    selectedEra === era.id
                      ? "bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-lg shadow-cyan-500/20"
                      : "bg-slate-800/50 text-gray-400 hover:bg-slate-700/50"
                  }`}
                  data-testid={`era-${era.id}`}
                >
                  <span>{era.emoji}</span> {era.label}
                </button>
              ))}
            </div>

            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-24 bg-slate-800/30 rounded-2xl animate-pulse" />
                ))}
              </div>
            ) : (
              <motion.div variants={stagger} initial="hidden" animate="visible" className="space-y-4" key={selectedEra}>

                <motion.div variants={fadeUp}>
                  <TimeOfDayBanner hour={hour} context={context} />
                </motion.div>

                {sessionContext?.offlineRecap && <OfflineRecapCard recap={sessionContext.offlineRecap} />}

                <motion.div variants={fadeUp}>
                  <GlassCard className="p-4 border border-white/5">
                    <div className="flex items-center gap-2 mb-3">
                      <Heart className="w-4 h-4 text-pink-400" />
                      <h3 className="text-white font-bold text-sm">Your Needs</h3>
                      {needs && needs.mood !== undefined && (
                        <Badge className={`text-[9px] ml-auto ${
                          needs.mood >= 70 ? "bg-emerald-500/20 text-emerald-400" :
                          needs.mood >= 40 ? "bg-yellow-500/20 text-yellow-400" :
                          "bg-red-500/20 text-red-400"
                        }`}>
                          {needs.mood >= 70 ? "😊 Happy" : needs.mood >= 40 ? "😐 Okay" : "😩 Struggling"}
                        </Badge>
                      )}
                    </div>
                    <div className="space-y-2.5">
                      <NeedBar label="Hunger" value={needs?.hunger ?? 80} icon={UtensilsCrossed} color="text-orange-400" emoji="🍽️" />
                      <NeedBar label="Energy" value={needs?.energy ?? 100} icon={Zap} color="text-yellow-400" emoji="⚡" />
                      <NeedBar label="Hygiene" value={needs?.hygiene ?? 90} icon={Droplets} color="text-blue-400" emoji="💧" />
                      <NeedBar label="Social" value={needs?.social ?? 70} icon={Users} color="text-purple-400" emoji="💬" />
                    </div>
                    <div className="grid grid-cols-4 gap-2 mt-4">
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-col gap-0.5 h-auto py-2 text-[10px] border-orange-500/20 text-orange-400 hover:bg-orange-500/10 active:scale-95 min-h-[52px]"
                        onClick={() => setShowMealModal(true)}
                        data-testid="btn-eat"
                      >
                        <span className="text-base">🍽️</span>
                        Eat
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-col gap-0.5 h-auto py-2 text-[10px] border-yellow-500/20 text-yellow-400 hover:bg-yellow-500/10 active:scale-95 min-h-[52px]"
                        onClick={() => fulfillNeedMutation.mutate({ action: "sleep" })}
                        disabled={fulfillNeedMutation.isPending}
                        data-testid="btn-sleep"
                      >
                        <span className="text-base">😴</span>
                        Sleep
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-col gap-0.5 h-auto py-2 text-[10px] border-blue-500/20 text-blue-400 hover:bg-blue-500/10 active:scale-95 min-h-[52px]"
                        onClick={() => fulfillNeedMutation.mutate({ action: "bathe" })}
                        disabled={fulfillNeedMutation.isPending}
                        data-testid="btn-bathe"
                      >
                        <span className="text-base">🚿</span>
                        Bathe
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-col gap-0.5 h-auto py-2 text-[10px] border-purple-500/20 text-purple-400 hover:bg-purple-500/10 active:scale-95 min-h-[52px]"
                        onClick={() => fulfillNeedMutation.mutate({ action: "socialize" })}
                        disabled={fulfillNeedMutation.isPending}
                        data-testid="btn-socialize"
                      >
                        <span className="text-base">🤝</span>
                        Chat
                      </Button>
                    </div>
                  </GlassCard>
                </motion.div>

                <motion.div variants={fadeUp}>
                  {career ? (
                    <GlassCard glow className="p-4 border border-emerald-500/20 relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 to-cyan-500/5" />
                      <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-3">
                          <span className="text-3xl">{career.occupationEmoji || "💼"}</span>
                          <div className="flex-1">
                            <h3 className="text-white font-bold">{career.occupation}</h3>
                            <p className="text-xs text-gray-500">{career.workplace}</p>
                          </div>
                          <Badge className={`text-[9px] ${
                            context?.atWork ? "bg-green-500/20 text-green-400" : "bg-slate-700/50 text-gray-400"
                          }`}>
                            {context?.atWork ? "🟢 On Shift" : "⚪ Off Duty"}
                          </Badge>
                        </div>

                        <div className="grid grid-cols-3 gap-2 mb-3">
                          <div className="bg-slate-800/50 rounded-lg p-2 text-center">
                            <p className="text-yellow-400 font-bold text-sm">{career.dailyWage}e</p>
                            <p className="text-[9px] text-gray-600">Daily Wage</p>
                          </div>
                          <div className="bg-slate-800/50 rounded-lg p-2 text-center">
                            <p className="text-cyan-400 font-bold text-sm">{career.daysWorked}</p>
                            <p className="text-[9px] text-gray-600">Days Worked</p>
                          </div>
                          <div className="bg-slate-800/50 rounded-lg p-2 text-center">
                            <p className="text-purple-400 font-bold text-sm capitalize">{career.rank}</p>
                            <p className="text-[9px] text-gray-600">Rank</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 mb-3 text-xs text-gray-400">
                          <Clock className="w-3 h-3" />
                          <span>Shift: {career.shiftStart}:00 - {career.shiftEnd}:00</span>
                          <span className="text-gray-600">|</span>
                          <Star className="w-3 h-3 text-yellow-400" />
                          <span>Rep: {career.reputation}/100</span>
                        </div>

                        {career.nextRank && (
                          <div className="mb-3">
                            <div className="flex items-center justify-between text-xs mb-1">
                              <span className="text-gray-500">Next rank: {career.nextRank.label}</span>
                              <span className="text-gray-400">{career.daysWorked}/{career.nextRank.minDays} days</span>
                            </div>
                            <Progress value={Math.min(100, (career.daysWorked / career.nextRank.minDays) * 100)} className="h-1.5" />
                          </div>
                        )}

                        <div className="flex gap-2">
                          <Button
                            className="flex-1 bg-gradient-to-r from-emerald-600 to-cyan-600 text-white min-h-[44px] active:scale-95"
                            onClick={() => workMutation.mutate()}
                            disabled={workMutation.isPending || !context?.atWork}
                            data-testid="btn-work"
                          >
                            <Briefcase className="w-4 h-4 mr-1" />
                            {context?.atWork ? "Work Shift" : "Off Duty"}
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-red-500/20 text-red-400 hover:bg-red-500/10 min-h-[44px] active:scale-95"
                            onClick={() => quitMutation.mutate()}
                            disabled={quitMutation.isPending}
                            data-testid="btn-quit"
                          >
                            Quit
                          </Button>
                        </div>
                      </div>
                    </GlassCard>
                  ) : (
                    <GlassCard className="p-6 text-center border border-white/5">
                      <motion.div animate={{ y: [0, -5, 0] }} transition={{ duration: 3, repeat: Infinity }} className="text-4xl mb-3">
                        💼
                      </motion.div>
                      <h3 className="text-white font-bold mb-1">No Career Yet</h3>
                      <p className="text-gray-500 text-xs mb-4">Find work to earn echoes and build your reputation.</p>
                      <Button
                        className="bg-gradient-to-r from-emerald-600 to-cyan-600 text-white min-h-[44px] active:scale-95"
                        onClick={() => setShowHireModal(true)}
                        data-testid="btn-find-work"
                      >
                        <Briefcase className="w-4 h-4 mr-1" /> Find Work
                      </Button>
                    </GlassCard>
                  )}
                </motion.div>

                <motion.div variants={fadeUp}>
                  <GlassCard className="p-4 border border-white/5">
                    <h3 className="text-white font-bold text-sm mb-3 flex items-center gap-2">
                      <Clock className="w-4 h-4 text-cyan-400" /> Daily Schedule
                    </h3>
                    <div className="space-y-1.5">
                      {[
                        { time: "06:00", activity: "Wake up", emoji: "🌅", range: [5, 8] },
                        { time: career ? `${String(career.shiftStart).padStart(2, "0")}:00` : "09:00", activity: career ? `Work at ${career.workplace}` : "Free time", emoji: career ? "💼" : "🌿", range: career ? [career.shiftStart, career.shiftEnd] : [9, 17] },
                        { time: "12:00", activity: "Lunch break", emoji: "🍽️", range: [12, 13] },
                        { time: career ? `${String(career.shiftEnd).padStart(2, "0")}:00` : "17:00", activity: "Evening free", emoji: "🌆", range: career ? [career.shiftEnd, 20] : [17, 20] },
                        { time: "20:00", activity: "Relax at home", emoji: "🏠", range: [20, 22] },
                        { time: "22:00", activity: "Sleep", emoji: "😴", range: [22, 6] },
                      ].map((slot, i) => {
                        const isNow = hour >= slot.range[0] && (slot.range[1] > slot.range[0] ? hour < slot.range[1] : (hour < slot.range[1] || hour >= slot.range[0]));
                        return (
                          <div key={i} className={`flex items-center gap-3 p-2 rounded-lg transition-all ${isNow ? "bg-cyan-500/10 border border-cyan-500/20" : "bg-slate-800/30"}`}>
                            {isNow && <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-pulse" />}
                            <span className="text-xs font-mono text-gray-500 w-12">{slot.time}</span>
                            <span className="text-sm">{slot.emoji}</span>
                            <span className={`text-xs ${isNow ? "text-white font-medium" : "text-gray-400"}`}>{slot.activity}</span>
                            {isNow && <Badge className="ml-auto bg-cyan-500/20 text-cyan-400 text-[8px]">NOW</Badge>}
                          </div>
                        );
                      })}
                    </div>
                  </GlassCard>
                </motion.div>

              </motion.div>
            )}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showHireModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-4"
            onClick={(e) => e.target === e.currentTarget && setShowHireModal(false)}
          >
            <motion.div
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              className="w-full max-w-md max-h-[85vh] overflow-y-auto rounded-2xl bg-slate-900 border border-white/10 p-5"
            >
              <h3 className="text-white font-bold text-lg mb-1">Find Work</h3>
              <p className="text-gray-500 text-xs mb-4">Choose an occupation for this era</p>

              <div className="space-y-2 mb-4">
                {(availableJobs?.occupations || []).map((job: any) => (
                  <HireJobCard
                    key={job.occupation}
                    job={job}
                    shifts={availableJobs?.shifts || []}
                    onHire={(shiftPref: string) => hireMutation.mutate({ occupation: job.occupation, shiftPreference: shiftPref })}
                    isPending={hireMutation.isPending}
                  />
                ))}
              </div>

              <Button
                variant="outline"
                className="w-full min-h-[44px] active:scale-95"
                onClick={() => setShowHireModal(false)}
                data-testid="btn-close-hire"
              >
                Cancel
              </Button>
            </motion.div>
          </motion.div>
        )}

        {showMealModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-4"
            onClick={(e) => e.target === e.currentTarget && setShowMealModal(false)}
          >
            <motion.div
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              className="w-full max-w-sm rounded-2xl bg-slate-900 border border-white/10 p-5"
            >
              <h3 className="text-white font-bold text-lg mb-1">🍽️ Choose a Meal</h3>
              <p className="text-gray-500 text-xs mb-4">Spend echoes to restore hunger</p>

              <div className="space-y-2 mb-4">
                {meals.map((meal: any, idx: number) => (
                  <button
                    key={meal.name}
                    onClick={() => fulfillNeedMutation.mutate({ action: "eat", mealIndex: idx })}
                    disabled={fulfillNeedMutation.isPending}
                    className="w-full flex items-center gap-3 p-3 rounded-xl bg-slate-800/50 hover:bg-slate-700/50 border border-white/5 hover:border-orange-500/20 transition-all active:scale-95 min-h-[52px]"
                    data-testid={`meal-${idx}`}
                  >
                    <span className="text-2xl">{meal.emoji}</span>
                    <div className="flex-1 text-left">
                      <p className="text-white text-sm font-medium">{meal.name}</p>
                      <p className="text-[10px] text-gray-500">+{meal.hungerRestore} hunger</p>
                    </div>
                    <span className="text-yellow-400 text-xs font-bold">{meal.cost}e</span>
                  </button>
                ))}
              </div>

              <Button
                variant="outline"
                className="w-full min-h-[44px] active:scale-95"
                onClick={() => setShowMealModal(false)}
                data-testid="btn-close-meal"
              >
                Cancel
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function HireJobCard({ job, shifts, onHire, isPending }: { job: any; shifts: any[]; onHire: (shift: string) => void; isPending: boolean }) {
  const [expanded, setExpanded] = useState(false);
  const [selectedShift, setSelectedShift] = useState("morning");

  return (
    <div className="rounded-xl bg-slate-800/50 border border-white/5 hover:border-emerald-500/20 transition-all overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center gap-3 p-3 text-left active:scale-[0.98] min-h-[56px]"
        data-testid={`job-${job.occupation}`}
      >
        <span className="text-2xl">{job.emoji}</span>
        <div className="flex-1">
          <p className="text-white text-sm font-medium">{job.occupation}</p>
          <p className="text-[10px] text-gray-500">{job.workplace}</p>
        </div>
        <div className="text-right">
          <span className="text-yellow-400 text-xs font-bold">{job.wage}e/day</span>
          <ChevronRight className={`w-3 h-3 text-gray-600 mx-auto transition-transform ${expanded ? "rotate-90" : ""}`} />
        </div>
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="px-3 pb-3 space-y-2">
              <p className="text-xs text-gray-400">{job.description}</p>
              <div className="flex gap-1.5 flex-wrap">
                {shifts.map((s: any) => (
                  <button
                    key={s.id}
                    onClick={() => setSelectedShift(s.id)}
                    className={`px-2.5 py-1.5 rounded-lg text-[10px] font-medium transition-all active:scale-95 ${
                      selectedShift === s.id
                        ? "bg-cyan-600 text-white"
                        : "bg-slate-700/50 text-gray-400"
                    }`}
                    data-testid={`shift-${s.id}`}
                  >
                    {s.emoji} {s.label}
                  </button>
                ))}
              </div>
              <Button
                className="w-full bg-gradient-to-r from-emerald-600 to-cyan-600 text-white min-h-[40px] active:scale-95 text-xs"
                onClick={() => onHire(selectedShift)}
                disabled={isPending}
                data-testid={`hire-${job.occupation}`}
              >
                <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Accept Position
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
