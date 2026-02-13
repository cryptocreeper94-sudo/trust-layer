import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { GlassCard } from "@/components/glass-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Link } from "wouter";
import { getChroniclesSession } from "./chronicles-login";
import {
  User, Clock, Sun, Moon, Sunrise, Sunset, CloudSun,
  Heart, Zap, Brain, Shield, Eye, Sparkles, TrendingUp,
  Compass, Users, Home, MapPin, Crown, Star,
  ArrowLeft, Globe, Activity, Timer,
  Swords, Scale, HandshakeIcon, Building, ChevronRight,
} from "lucide-react";

const ERA_CONFIG = {
  modern: { name: "Modern Era", emoji: "🏙️", color: "text-cyan-400", bg: "bg-cyan-500/10", border: "border-cyan-500/20" },
  medieval: { name: "Medieval Era", emoji: "🏰", color: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/20" },
  wildwest: { name: "Wild West", emoji: "🤠", color: "text-yellow-400", bg: "bg-yellow-500/10", border: "border-yellow-500/20" },
};

function getTimeOfDay(hour: number) {
  if (hour >= 5 && hour < 8) return { label: "Dawn", icon: Sunrise, color: "text-orange-300" };
  if (hour >= 8 && hour < 12) return { label: "Morning", icon: Sun, color: "text-yellow-300" };
  if (hour >= 12 && hour < 17) return { label: "Afternoon", icon: CloudSun, color: "text-amber-300" };
  if (hour >= 17 && hour < 20) return { label: "Evening", icon: Sunset, color: "text-orange-400" };
  if (hour >= 20 && hour < 22) return { label: "Dusk", icon: Moon, color: "text-purple-300" };
  return { label: "Night", icon: Moon, color: "text-indigo-300" };
}

function StatRing({ value, max, label, icon: Icon, color }: {
  value: number; max: number; label: string; icon: any; color: string;
}) {
  const pct = Math.min(100, Math.round((value / max) * 100));
  return (
    <div className="flex flex-col items-center gap-1" data-testid={`stat-${label.toLowerCase()}`}>
      <div className="relative w-16 h-16">
        <svg className="w-16 h-16 -rotate-90" viewBox="0 0 36 36">
          <circle cx="18" cy="18" r="14" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="3" />
          <circle
            cx="18" cy="18" r="14" fill="none"
            stroke="currentColor"
            className={color}
            strokeWidth="3"
            strokeDasharray={`${pct * 0.88} 88`}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <Icon className={`w-5 h-5 ${color}`} />
        </div>
      </div>
      <span className="text-[10px] text-gray-500 font-medium">{label}</span>
      <span className={`text-xs font-bold ${color}`}>{value}</span>
    </div>
  );
}

function LifeTimelineEvent({ event, index }: { event: any; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
      className="flex gap-3"
    >
      <div className="flex flex-col items-center">
        <div className="w-2 h-2 rounded-full bg-cyan-400 mt-2" />
        {index < 4 && <div className="w-px flex-1 bg-white/10" />}
      </div>
      <div className="pb-4">
        <p className="text-sm text-white">{event.title}</p>
        <p className="text-xs text-gray-500">{event.time}</p>
      </div>
    </motion.div>
  );
}

export default function ChroniclesDashboard() {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const hour = now.getHours();
  const timeInfo = getTimeOfDay(hour);
  const TimeIcon = timeInfo.icon;

  const getAuthHeaders = (): Record<string, string> => {
    const session = getChroniclesSession();
    if (session?.token) return { Authorization: `Bearer ${session.token}` };
    return {};
  };

  const { data: characterData } = useQuery({
    queryKey: ["/api/chronicles/character/status"],
    queryFn: async () => {
      const res = await fetch("/api/chronicles/character/status", { headers: getAuthHeaders() });
      if (!res.ok) return null;
      return res.json();
    },
    staleTime: 30000,
  });

  const { data: factionsData } = useQuery({
    queryKey: ["/api/chronicles/game/factions"],
    queryFn: async () => {
      const res = await fetch("/api/chronicles/game/factions");
      if (!res.ok) return [];
      return res.json();
    },
    staleTime: 60000,
  });

  const character = characterData?.character;
  const factions = Array.isArray(factionsData) ? factionsData : [];

  const stats = {
    wisdom: character?.wisdom || 10,
    courage: character?.courage || 10,
    compassion: character?.compassion || 10,
    cunning: character?.cunning || 10,
    influence: character?.influence || 10,
  };

  const level = character?.level || 1;
  const xp = character?.experience || 0;
  const nextLevelXp = level * 1000;
  const xpProgress = Math.min(100, (xp / nextLevelXp) * 100);

  const recentEvents = [
    { title: "Arrived in the Modern Era", time: "Today" },
    { title: "Explored Downtown Core", time: "Recent" },
    { title: "Met a stranger at the coffee shop", time: "Recent" },
    { title: "The city hums with energy around you", time: "Now" },
  ];

  const quickActions = [
    { label: "Your World", href: "/chronicles/world", icon: Compass, color: "text-cyan-400", desc: "See what's happening" },
    { label: "Your Estate", href: "/chronicles/estate", icon: Building, color: "text-purple-400", desc: "Build your space" },
    { label: "Daily Life", href: "/chronicles/life", icon: Activity, color: "text-green-400", desc: "Activities & locations" },
    { label: "Time Portal", href: "/chronicles/time-portal", icon: Globe, color: "text-amber-400", desc: "Explore other eras" },
  ];

  return (
    <div className="min-h-screen bg-slate-950 pb-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <div className="flex items-center gap-3 mb-6">
          <Link href="/chronicles/hub">
            <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white" data-testid="back-to-hub">
              <ArrowLeft className="w-4 h-4 mr-1" /> Hub
            </Button>
          </Link>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-white">Your Parallel Self</h1>
            <p className="text-xs text-gray-500">Living in real-time — your timezone, your pace</p>
          </div>
        </div>

        <GlassCard glow className="p-5 mb-4 border border-cyan-500/20" data-testid="identity-card">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-cyan-500/30 to-purple-500/30 flex items-center justify-center border border-cyan-500/30">
              <User className="w-8 h-8 text-cyan-400" />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-white" data-testid="player-name">
                {character?.name || "You"}
              </h2>
              <div className="flex items-center gap-2 mt-1">
                <Badge className="bg-cyan-500/20 text-cyan-400">Level {level}</Badge>
                <span className={`flex items-center gap-1 text-xs ${timeInfo.color}`}>
                  <TimeIcon className="w-3 h-3" />
                  {now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} — {timeInfo.label}
                </span>
              </div>
              <div className="mt-2">
                <div className="flex justify-between text-xs text-gray-500 mb-1">
                  <span>Experience</span>
                  <span>{xp} / {nextLevelXp} XP</span>
                </div>
                <Progress value={xpProgress} className="h-1.5 bg-slate-800" />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs">
            {Object.entries(ERA_CONFIG).map(([key, era]) => (
              <span key={key} className={`px-2 py-1 rounded-full ${era.bg} ${era.color} ${era.border} border`}>
                {era.emoji} {era.name}
              </span>
            ))}
          </div>
        </GlassCard>

        <div className="grid grid-cols-3 sm:grid-cols-5 gap-3 mb-6" data-testid="character-stats">
          <StatRing value={stats.wisdom} max={100} label="Wisdom" icon={Brain} color="text-blue-400" />
          <StatRing value={stats.courage} max={100} label="Courage" icon={Shield} color="text-red-400" />
          <StatRing value={stats.compassion} max={100} label="Heart" icon={Heart} color="text-pink-400" />
          <StatRing value={stats.cunning} max={100} label="Cunning" icon={Eye} color="text-purple-400" />
          <StatRing value={stats.influence} max={100} label="Influence" icon={Crown} color="text-yellow-400" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6" data-testid="quick-actions">
          {quickActions.map(action => (
            <Link key={action.label} href={action.href}>
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <GlassCard className="p-4 cursor-pointer hover:bg-white/5 transition-all h-full">
                  <action.icon className={`w-6 h-6 ${action.color} mb-2`} />
                  <h3 className="text-white font-semibold text-sm">{action.label}</h3>
                  <p className="text-xs text-gray-500 mt-0.5">{action.desc}</p>
                </GlassCard>
              </motion.div>
            </Link>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <GlassCard className="p-4" data-testid="community-standing">
            <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
              <Users className="w-4 h-4 text-cyan-400" /> Your Communities
            </h3>
            {factions.length === 0 ? (
              <p className="text-xs text-gray-500">You haven't aligned with any communities yet.</p>
            ) : (
              <div className="space-y-2">
                {factions.slice(0, 5).map((f: any) => (
                  <div key={f.id} className="flex items-center gap-2 p-2 rounded-lg bg-white/5">
                    <span className="text-lg">{f.iconEmoji}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-white truncate">{f.name}</p>
                      <p className="text-[10px] text-gray-500">{f.ideology}</p>
                    </div>
                    <Badge className="text-[10px] bg-white/5 text-gray-400">Neutral</Badge>
                  </div>
                ))}
              </div>
            )}
            <Link href="/chronicles/world">
              <Button variant="ghost" size="sm" className="mt-3 text-cyan-400 w-full" data-testid="view-communities">
                Explore Communities <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </GlassCard>

          <GlassCard className="p-4" data-testid="life-timeline">
            <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
              <Clock className="w-4 h-4 text-cyan-400" /> Your Story So Far
            </h3>
            <div className="space-y-0">
              {recentEvents.map((event, i) => (
                <LifeTimelineEvent key={i} event={event} index={i} />
              ))}
            </div>
          </GlassCard>
        </div>

        <GlassCard className="p-4 mt-4" data-testid="world-status">
          <div className="flex items-center gap-2 mb-3">
            <div className="relative">
              <Globe className="w-4 h-4 text-green-400" />
              <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            </div>
            <h3 className="text-white font-semibold text-sm">Live World</h3>
          </div>
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="p-2 rounded-lg bg-white/5">
              <p className="text-lg font-bold text-cyan-400">3</p>
              <p className="text-[10px] text-gray-500">Active Eras</p>
            </div>
            <div className="p-2 rounded-lg bg-white/5">
              <p className="text-lg font-bold text-purple-400">15</p>
              <p className="text-[10px] text-gray-500">Communities</p>
            </div>
            <div className="p-2 rounded-lg bg-white/5">
              <p className="text-lg font-bold text-green-400">9</p>
              <p className="text-[10px] text-gray-500">People in World</p>
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-3 italic text-center">
            The world is running right now. NPCs are making decisions. Factions are shifting. Time never stops.
          </p>
        </GlassCard>
      </div>
    </div>
  );
}
