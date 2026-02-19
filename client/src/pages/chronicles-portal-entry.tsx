import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocation } from "wouter";
import {
  Sparkles, MapPin, Home, Package, Coins, ChevronRight,
  ArrowLeft, Loader2, CheckCircle, Star, BookOpen, Compass,
  Zap, X, Clock, Bell
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { GlassCard } from "@/components/glass-card";
import { getChroniclesSession } from "@/pages/chronicles-login";

type Phase = "loading" | "portal_void" | "choose_city" | "entering" | "arrival" | "starter_kit" | "ready" | "welcome_back";

const getAuthHeaders = (): Record<string, string> => {
  const session = getChroniclesSession();
  if (session?.token) return { Authorization: `Bearer ${session.token}`, "Content-Type": "application/json" };
  return { "Content-Type": "application/json" };
};

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
                  <><Sparkles className="w-5 h-5 mr-2" /> Enter {cities.find(c => c.id === selected)?.name}</>
                )}
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

function ArrivalCinematic({ data, onContinue }: { data: any; onContinue: () => void }) {
  const [showText, setShowText] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowText(true), 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <motion.div className="fixed inset-0 bg-black flex items-center justify-center px-6"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1.5 }}>
      <div className="absolute inset-0 bg-gradient-to-b from-cyan-950/20 via-transparent to-purple-950/20" />

      <div className="relative z-10 text-center max-w-lg w-full">
        <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.5, type: "spring", stiffness: 100 }}>
          <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 sm:mb-6 rounded-full bg-gradient-to-br from-cyan-500/20 to-purple-500/20 border border-cyan-500/30 flex items-center justify-center">
            <Home className="w-8 h-8 sm:w-10 sm:h-10 text-cyan-400" />
          </div>
        </motion.div>

        <motion.h2 initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1 }}
          className="text-xl sm:text-3xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent mb-3 sm:mb-4">
          Welcome to {data.city?.name}
        </motion.h2>

        {showText && (
          <motion.p initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1 }}
            className="text-xs sm:text-sm text-slate-300 leading-relaxed italic mb-6 sm:mb-8">
            {data.cinematic}
          </motion.p>
        )}

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 3 }}>
          <Button onClick={onContinue}
            className="min-h-[48px] bg-gradient-to-r from-cyan-600 to-purple-600 text-white px-8"
            data-testid="btn-continue-arrival">
            <ChevronRight className="w-5 h-5 mr-2" /> See Your Starter Kit
          </Button>
        </motion.div>
      </div>
    </motion.div>
  );
}

function StarterKit({ data, onReady }: { data: any; onReady: () => void }) {
  const [revealedItems, setRevealedItems] = useState<number>(0);
  const items = data.inventory || [];

  useEffect(() => {
    if (revealedItems < items.length) {
      const timer = setTimeout(() => setRevealedItems(prev => prev + 1), 400);
      return () => clearTimeout(timer);
    }
  }, [revealedItems, items.length]);

  return (
    <motion.div className="fixed inset-0 bg-slate-950 overflow-y-auto"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="min-h-screen px-4 sm:px-6 py-8 sm:py-12 max-w-md mx-auto">
        <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
          className="text-center mb-6">
          <Package className="w-10 h-10 sm:w-12 sm:h-12 text-amber-400 mx-auto mb-3" />
          <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">Your Starter Kit</h2>
          <p className="text-xs sm:text-sm text-slate-400">Everything you need to begin your new life</p>
        </motion.div>

        <GlassCard glow className="p-4 sm:p-5 mb-4 border border-amber-500/20">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center">
              <Coins className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <p className="text-lg font-bold text-amber-400" data-testid="echo-balance">500 Echoes</p>
              <p className="text-[10px] sm:text-xs text-slate-400">Starting currency for supplies and essentials</p>
            </div>
          </div>
          <div className="h-px bg-white/5 mb-4" />
          <div className="space-y-2">
            {items.map((item: any, i: number) => (
              <motion.div key={item.id}
                initial={{ x: -30, opacity: 0 }}
                animate={i < revealedItems ? { x: 0, opacity: 1 } : { x: -30, opacity: 0 }}
                transition={{ type: "spring", stiffness: 200 }}
                className="flex items-center gap-3 p-2 rounded-lg bg-white/3">
                <span className="text-xl sm:text-2xl">{item.emoji}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-xs sm:text-sm font-medium text-white">{item.name}</p>
                  <p className="text-[10px] text-slate-400 truncate">{item.desc}</p>
                </div>
                <Badge className="text-[10px] bg-white/5 text-slate-400">{item.category}</Badge>
              </motion.div>
            ))}
          </div>
        </GlassCard>

        <GlassCard className="p-3 sm:p-4 mb-6 border border-cyan-500/10">
          <div className="flex items-center gap-2 mb-2">
            <Star className="w-4 h-4 text-yellow-400" />
            <span className="text-xs font-medium text-yellow-400">+{data.xpEarned || 100} XP Earned</span>
          </div>
          <p className="text-[10px] sm:text-xs text-slate-400">Your first steps through the portal have been recorded on-chain. This is the beginning of your legacy.</p>
        </GlassCard>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: revealedItems >= items.length ? 1 : 0 }}>
          <Button onClick={onReady}
            className="w-full min-h-[52px] bg-gradient-to-r from-cyan-600 to-purple-600 text-white font-bold text-base"
            data-testid="btn-begin-life">
            <Sparkles className="w-5 h-5 mr-2" /> Begin Your Life in {data.city?.name}
          </Button>
        </motion.div>
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
            <h3 className="text-base sm:text-lg font-bold text-white">Welcome Back</h3>
            {summary && <p className="text-xs text-slate-400">{summary}</p>}
          </div>
        </div>

        {events.length > 0 && (
          <div className="space-y-2 mb-4">
            <p className="text-xs text-slate-400 flex items-center gap-1">
              <Bell className="w-3 h-3" /> While you were away:
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
            {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : events.length > 0 ? "Collect & Continue" : "Continue Playing"}
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
      setTimeout(() => setPhase("arrival"), 2000);
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
        if (offlineSummary && offlineSummary.timePassed >= 4 && offlineSummary.events.length > 0) {
          setPhase("welcome_back");
        } else {
          navigate("/chronicles/play");
        }
      } else {
        setPhase("portal_void");
      }
    }
  }, [isLoading, portalStatus, offlineSummary, navigate]);

  const handleVoidComplete = useCallback(() => {
    setPhase("choose_city");
  }, []);

  const handleCitySelect = useCallback((cityId: string) => {
    enterMutation.mutate(cityId);
  }, [enterMutation]);

  const handleArrivalContinue = useCallback(() => {
    setPhase("starter_kit");
  }, []);

  const handleReady = useCallback(() => {
    navigate("/chronicles/play");
  }, [navigate]);

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
              transition={{ duration: 2, ease: "easeInOut" }}
              className="w-32 h-32 sm:w-48 sm:h-48 mx-auto rounded-full bg-gradient-to-br from-cyan-500/30 to-purple-500/30 border border-cyan-500/40 flex items-center justify-center mb-6">
              <Sparkles className="w-16 h-16 sm:w-24 sm:h-24 text-cyan-400" />
            </motion.div>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
              className="text-sm text-cyan-400/60">Crossing over...</motion.p>
          </div>
        </motion.div>
      )}

      {phase === "arrival" && entryData && (
        <ArrivalCinematic key="arrival" data={entryData} onContinue={handleArrivalContinue} />
      )}

      {phase === "starter_kit" && entryData && (
        <StarterKit key="kit" data={entryData} onReady={handleReady} />
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