import { useState, useEffect, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { GlassCard } from "@/components/glass-card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Link } from "wouter";
import { getChroniclesSession } from "./chronicles-login";
import {
  Clock, Users, MessageCircle, Shield, Crown, Sparkles, MapPin,
  ChevronRight, Sun, Moon, CloudSun, Sunrise, Sunset,
  AlertTriangle, Heart, Zap, Eye, Send, Star, Compass,
  Home, Building, TreePine, Swords, Scale, HandshakeIcon,
  ArrowLeft, Globe, Timer, TrendingUp, Activity,
  UserCircle, MessageSquare, Volume2,
} from "lucide-react";

const ERA_CONFIG = {
  modern: {
    name: "Modern Era",
    color: "cyan",
    bgGradient: "from-cyan-500/20 to-blue-600/20",
    borderColor: "border-cyan-500/30",
    textColor: "text-cyan-400",
    badgeClass: "bg-cyan-500/20 text-cyan-400",
  },
  medieval: {
    name: "Medieval Era",
    color: "amber",
    bgGradient: "from-amber-500/20 to-orange-600/20",
    borderColor: "border-amber-500/30",
    textColor: "text-amber-400",
    badgeClass: "bg-amber-500/20 text-amber-400",
  },
  wildwest: {
    name: "Wild West Era",
    color: "yellow",
    bgGradient: "from-yellow-500/20 to-orange-600/20",
    borderColor: "border-yellow-500/30",
    textColor: "text-yellow-400",
    badgeClass: "bg-yellow-500/20 text-yellow-400",
  },
};

function getTimeOfDay(hour: number) {
  if (hour >= 5 && hour < 8) return { label: "Dawn", icon: Sunrise, color: "text-orange-300", bg: "bg-orange-500/10" };
  if (hour >= 8 && hour < 12) return { label: "Morning", icon: Sun, color: "text-yellow-300", bg: "bg-yellow-500/10" };
  if (hour >= 12 && hour < 17) return { label: "Afternoon", icon: CloudSun, color: "text-amber-300", bg: "bg-amber-500/10" };
  if (hour >= 17 && hour < 20) return { label: "Evening", icon: Sunset, color: "text-orange-400", bg: "bg-orange-500/10" };
  if (hour >= 20 && hour < 22) return { label: "Dusk", icon: Moon, color: "text-purple-300", bg: "bg-purple-500/10" };
  return { label: "Night", icon: Moon, color: "text-indigo-300", bg: "bg-indigo-500/10" };
}

function getEraTimeDescription(hour: number, era: string) {
  if (era === "medieval") {
    if (hour >= 5 && hour < 8) return "The roosters crow as the castle gates open for the day";
    if (hour >= 8 && hour < 12) return "Market square fills with merchants and townsfolk";
    if (hour >= 12 && hour < 17) return "The afternoon sun beats down on the training grounds";
    if (hour >= 17 && hour < 20) return "Torches are lit as the taverns begin to fill";
    if (hour >= 20 && hour < 22) return "The castle walls glow in the last light of day";
    return "The realm sleeps under a canopy of stars";
  }
  if (era === "wildwest") {
    if (hour >= 5 && hour < 8) return "The desert horizon glows as the frontier wakes";
    if (hour >= 8 && hour < 12) return "Dust kicks up on Main Street as the town comes alive";
    if (hour >= 12 && hour < 17) return "High noon sun scorches the dusty plains";
    if (hour >= 17 && hour < 20) return "Golden hour paints the canyon walls in fire";
    if (hour >= 20 && hour < 22) return "Saloon piano echoes through the cooling air";
    return "The frontier is quiet under a vast starry sky";
  }
  if (hour >= 5 && hour < 8) return "The city stirs as early commuters fill the streets";
  if (hour >= 8 && hour < 12) return "Rush hour fades as the workday begins";
  if (hour >= 12 && hour < 17) return "The city hums with midday energy";
  if (hour >= 17 && hour < 20) return "Evening traffic flows as the city shifts gears";
  if (hour >= 20 && hour < 22) return "Neon signs flicker to life across the skyline";
  return "The city sleeps but never fully rests";
}

function WorldClock({ era }: { era: string }) {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const hour = now.getHours();
  const timeInfo = getTimeOfDay(hour);
  const TimeIcon = timeInfo.icon;
  const eraDesc = getEraTimeDescription(hour, era);
  const config = ERA_CONFIG[era as keyof typeof ERA_CONFIG] || ERA_CONFIG.modern;

  return (
    <GlassCard className="p-4" data-testid="world-clock">
      <div className="flex items-center gap-3 mb-2">
        <div className={`p-2 rounded-lg ${timeInfo.bg}`}>
          <TimeIcon className={`w-5 h-5 ${timeInfo.color}`} />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="text-white font-bold text-lg" data-testid="current-time">
              {now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
            <Badge className={config.badgeClass}>{timeInfo.label}</Badge>
          </div>
          <p className="text-xs text-gray-500">{now.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' })}</p>
        </div>
        <div className="text-right">
          <p className={`text-xs ${config.textColor} font-medium`}>{config.name}</p>
          <p className="text-[10px] text-gray-600">1:1 Real Time</p>
        </div>
      </div>
      <p className="text-xs text-gray-400 italic" data-testid="era-atmosphere">{eraDesc}</p>
    </GlassCard>
  );
}

function SituationCard({ situation, era, onRespond }: {
  situation: any;
  era: string;
  onRespond: (situationId: string) => void;
}) {
  const config = ERA_CONFIG[era as keyof typeof ERA_CONFIG] || ERA_CONFIG.modern;

  const categoryStyles: Record<string, { icon: any; label: string; color: string }> = {
    main_story: { icon: Compass, label: "Unfolding Situation", color: "text-purple-400" },
    faction: { icon: Users, label: "Community Matter", color: "text-blue-400" },
    side_quest: { icon: MapPin, label: "Opportunity", color: "text-green-400" },
  };

  const difficultyColors: Record<string, string> = {
    easy: "bg-green-500/20 text-green-400",
    medium: "bg-yellow-500/20 text-yellow-400",
    hard: "bg-red-500/20 text-red-400",
  };

  const cat = categoryStyles[situation.category] || categoryStyles.side_quest;
  const CatIcon = cat.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.01 }}
      data-testid={`situation-${situation.id}`}
    >
      <GlassCard className={`p-5 cursor-pointer hover:${config.borderColor} transition-all border border-white/5 hover:border-white/15`}>
        <div className="flex items-start gap-3 mb-3">
          <div className={`p-2 rounded-lg bg-white/5`}>
            <CatIcon className={`w-5 h-5 ${cat.color}`} />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-white font-semibold">{situation.title}</h3>
              <Badge className={`text-[10px] ${difficultyColors[situation.difficulty] || difficultyColors.medium}`}>
                {situation.difficulty === "easy" ? "Straightforward" : situation.difficulty === "hard" ? "Complex" : "Moderate"}
              </Badge>
            </div>
            <Badge className={`mt-1 text-[10px] ${cat.color} bg-white/5`}>{cat.label}</Badge>
          </div>
        </div>

        <p className="text-sm text-gray-300 leading-relaxed mb-4">{situation.description}</p>

        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            {situation.shellsReward && (
              <span className="text-xs px-2 py-1 rounded-full bg-yellow-500/10 text-yellow-400 flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> {situation.shellsReward} Shells
              </span>
            )}
            {situation.experienceReward && (
              <span className="text-xs px-2 py-1 rounded-full bg-purple-500/10 text-purple-400 flex items-center gap-1">
                <TrendingUp className="w-3 h-3" /> {situation.experienceReward} XP
              </span>
            )}
          </div>
          <Button
            size="sm"
            className={`bg-gradient-to-r ${config.bgGradient} border ${config.borderColor} hover:brightness-125`}
            onClick={() => onRespond(situation.id)}
            data-testid={`respond-${situation.id}`}
          >
            Face This <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      </GlassCard>
    </motion.div>
  );
}

function SituationDetail({ situation, era, onClose, onDecide }: {
  situation: any;
  era: string;
  onClose: () => void;
  onDecide: (situationId: string, response: string) => void;
}) {
  const [response, setResponse] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const config = ERA_CONFIG[era as keyof typeof ERA_CONFIG] || ERA_CONFIG.modern;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className="w-full max-w-lg"
        onClick={e => e.stopPropagation()}
      >
        <GlassCard glow className={`p-6 border ${config.borderColor}`}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-white">{situation.title}</h2>
            <Button variant="ghost" size="sm" onClick={onClose} data-testid="close-situation">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </div>

          <p className="text-gray-300 leading-relaxed mb-6">{situation.description}</p>

          <div className={`p-4 rounded-lg bg-white/5 border border-white/10 mb-4`}>
            <div className="flex items-center gap-2 mb-2">
              <Eye className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-400 font-medium">Your World, Your Call</span>
            </div>
            <p className="text-xs text-gray-500">
              There are no right or wrong answers. How would YOU handle this? Your response shapes your path, your relationships, and the world around you. Be yourself.
            </p>
          </div>

          <div className="mb-4">
            <label className="text-sm text-gray-400 mb-2 block">What do you do?</label>
            <textarea
              value={response}
              onChange={e => setResponse(e.target.value)}
              placeholder="Describe how you'd handle this situation in your own words..."
              className="w-full h-32 bg-white/5 border border-white/10 rounded-lg p-3 text-white text-sm placeholder:text-gray-600 focus:outline-none focus:border-cyan-500/50 resize-none"
              data-testid="situation-response-input"
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              <span className="text-xs px-2 py-1 rounded-full bg-yellow-500/10 text-yellow-400">
                +{situation.shellsReward} Shells
              </span>
              <span className="text-xs px-2 py-1 rounded-full bg-purple-500/10 text-purple-400">
                +{situation.experienceReward} XP
              </span>
            </div>
            <Button
              disabled={response.trim().length < 10 || isSubmitting}
              className={`bg-gradient-to-r ${config.bgGradient} border ${config.borderColor}`}
              onClick={() => {
                setIsSubmitting(true);
                onDecide(situation.id, response);
              }}
              data-testid="submit-decision"
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <Activity className="w-4 h-4 animate-spin" /> Processing...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Send className="w-4 h-4" /> Make Your Choice
                </span>
              )}
            </Button>
          </div>
        </GlassCard>
      </motion.div>
    </motion.div>
  );
}

function NpcEncounter({ npc, era, onTalk }: {
  npc: any;
  era: string;
  onTalk: (npcId: string) => void;
}) {
  const config = ERA_CONFIG[era as keyof typeof ERA_CONFIG] || ERA_CONFIG.modern;
  const personality = typeof npc.personality === 'string' ? JSON.parse(npc.personality) : npc.personality;
  const faction = npc.factionId;

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      data-testid={`npc-${npc.name.toLowerCase().replace(/\s+/g, '-')}`}
    >
      <GlassCard className="p-4 cursor-pointer hover:bg-white/5 transition-all">
        <div className="flex items-center gap-3">
          <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${config.bgGradient} flex items-center justify-center border ${config.borderColor}`}>
            <UserCircle className={`w-7 h-7 ${config.textColor}`} />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-white font-semibold truncate">{npc.name}</h4>
            <p className="text-xs text-gray-500 truncate">{npc.title}</p>
            {personality?.traits && (
              <div className="flex gap-1 mt-1 flex-wrap">
                {personality.traits.slice(0, 2).map((trait: string) => (
                  <span key={trait} className="text-[10px] px-1.5 py-0.5 rounded bg-white/5 text-gray-500">{trait}</span>
                ))}
              </div>
            )}
          </div>
          <Button
            size="sm"
            variant="ghost"
            className={`${config.textColor} hover:bg-white/10`}
            onClick={() => onTalk(npc.name.toLowerCase().replace(/\s+/g, '_'))}
            data-testid={`talk-${npc.name.toLowerCase().replace(/\s+/g, '-')}`}
          >
            <MessageSquare className="w-4 h-4" />
          </Button>
        </div>
      </GlassCard>
    </motion.div>
  );
}

function NpcChatModal({ npc, era, onClose }: {
  npc: any;
  era: string;
  onClose: () => void;
}) {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<{ role: string; content: string; verified?: boolean }[]>([]);
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const config = ERA_CONFIG[era as keyof typeof ERA_CONFIG] || ERA_CONFIG.modern;

  const getAuthHeaders = (): Record<string, string> => {
    const session = getChroniclesSession();
    if (session?.token) return { Authorization: `Bearer ${session.token}`, "Content-Type": "application/json" };
    return { "Content-Type": "application/json" };
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!message.trim() || isSending) return;
    const userMsg = message.trim();
    setMessage("");
    setMessages(prev => [...prev, { role: "you", content: userMsg }]);
    setIsSending(true);

    try {
      const npcId = npc.name.toLowerCase().replace(/[^a-z0-9]/g, '_').replace(/_+/g, '_');
      const res = await fetch("/api/chronicles/game/npc/talk", {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({ npcId, message: userMsg, era }),
      });
      const data = await res.json();
      setMessages(prev => [...prev, {
        role: "npc",
        content: data.response || "...",
        verified: data.verified,
      }]);
    } catch {
      setMessages(prev => [...prev, {
        role: "npc",
        content: "They seem distracted and don't respond right now.",
      }]);
    } finally {
      setIsSending(false);
    }
  };

  const personality = typeof npc.personality === 'string' ? JSON.parse(npc.personality) : npc.personality;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        exit={{ y: 100 }}
        className="w-full sm:max-w-md h-[85vh] sm:h-[70vh] flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        <GlassCard glow className={`flex flex-col h-full border ${config.borderColor} rounded-t-2xl sm:rounded-2xl`}>
          <div className={`p-4 border-b border-white/10 flex items-center gap-3`}>
            <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${config.bgGradient} flex items-center justify-center`}>
              <UserCircle className={`w-6 h-6 ${config.textColor}`} />
            </div>
            <div className="flex-1">
              <h3 className="text-white font-semibold">{npc.name}</h3>
              <p className="text-xs text-gray-500">{npc.title}</p>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose} data-testid="close-npc-chat">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            <div className="p-3 rounded-lg bg-white/5 border border-white/10">
              <p className="text-xs text-gray-500 italic">
                {npc.backstory}
              </p>
              {personality?.speakingStyle && (
                <p className="text-[10px] text-gray-600 mt-1">Speaks: {personality.speakingStyle}</p>
              )}
            </div>

            {messages.map((msg, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${msg.role === "you" ? "justify-end" : "justify-start"}`}
              >
                <div className={`max-w-[80%] p-3 rounded-2xl ${
                  msg.role === "you"
                    ? "bg-cyan-500/20 text-white rounded-br-sm"
                    : `bg-white/5 text-gray-200 rounded-bl-sm border border-white/10`
                }`}>
                  <p className="text-sm">{msg.content}</p>
                  {msg.verified && (
                    <div className="flex items-center gap-1 mt-1">
                      <Shield className="w-3 h-3 text-green-400" />
                      <span className="text-[10px] text-green-400">AI-Verified Response</span>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}

            {isSending && (
              <div className="flex justify-start">
                <div className="bg-white/5 p-3 rounded-2xl rounded-bl-sm border border-white/10">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-3 border-t border-white/10">
            <div className="flex gap-2">
              <input
                value={message}
                onChange={e => setMessage(e.target.value)}
                onKeyDown={e => e.key === "Enter" && !e.shiftKey && sendMessage()}
                placeholder={`Talk to ${npc.name}...`}
                className="flex-1 bg-white/5 border border-white/10 rounded-full px-4 py-2 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-cyan-500/50"
                data-testid="npc-chat-input"
              />
              <Button
                size="sm"
                disabled={!message.trim() || isSending}
                className={`rounded-full bg-gradient-to-r ${config.bgGradient} border ${config.borderColor}`}
                onClick={sendMessage}
                data-testid="npc-chat-send"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </GlassCard>
      </motion.div>
    </motion.div>
  );
}

function FactionCard({ faction, era, onAlign }: {
  faction: any;
  era: string;
  onAlign: (factionId: string) => void;
}) {
  return (
    <motion.div whileHover={{ scale: 1.02 }} data-testid={`faction-${faction.id}`}>
      <GlassCard className="p-4 hover:bg-white/5 transition-all">
        <div className="flex items-start gap-3">
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center text-xl"
            style={{ backgroundColor: `${faction.color}20` }}
          >
            {faction.iconEmoji}
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-white font-semibold">{faction.name}</h4>
            <p className="text-xs text-gray-500 mt-1 line-clamp-2">{faction.description}</p>
            <div className="flex items-center gap-2 mt-2">
              <Badge className="text-[10px]" style={{ backgroundColor: `${faction.color}20`, color: faction.color }}>
                {faction.ideology}
              </Badge>
            </div>
          </div>
          <Button
            size="sm"
            variant="ghost"
            className="text-gray-400 hover:text-white hover:bg-white/10"
            onClick={() => onAlign(faction.id)}
            data-testid={`align-${faction.id}`}
          >
            <HandshakeIcon className="w-4 h-4" />
          </Button>
        </div>
      </GlassCard>
    </motion.div>
  );
}

function LiveWorldBar() {
  const [pulse, setPulse] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => setPulse(p => (p + 1) % 100), 3000);
    return () => clearInterval(timer);
  }, []);

  const events = [
    "A trade caravan crosses between eras...",
    "NPCs are making decisions based on recent events...",
    "Faction tensions shift as alliances form...",
    "The world evolves even while you're away...",
    "Other players' choices ripple through the timeline...",
  ];

  return (
    <div className="flex items-center gap-2 p-2 rounded-lg bg-white/5 border border-white/5" data-testid="live-world-bar">
      <div className="relative">
        <Globe className="w-4 h-4 text-green-400" />
        <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-green-400 rounded-full animate-pulse" />
      </div>
      <span className="text-xs text-gray-400">{events[pulse % events.length]}</span>
    </div>
  );
}

export default function ChroniclesWorld() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [selectedEra, setSelectedEra] = useState<"modern" | "medieval" | "wildwest">("modern");
  const [activeSituation, setActiveSituation] = useState<any>(null);
  const [activeNpc, setActiveNpc] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<"situations" | "people" | "communities">("situations");

  const getAuthHeaders = (): Record<string, string> => {
    const session = getChroniclesSession();
    if (session?.token) return { Authorization: `Bearer ${session.token}`, "Content-Type": "application/json" };
    return { "Content-Type": "application/json" };
  };

  const { data: situationsData } = useQuery({
    queryKey: ["/api/chronicles/game/quests", selectedEra],
    queryFn: async () => {
      const res = await fetch(`/api/chronicles/game/quests?era=${selectedEra}`);
      if (!res.ok) return [];
      return res.json();
    },
    staleTime: 60000,
  });

  const { data: npcsData } = useQuery({
    queryKey: ["/api/chronicles/game/npcs", selectedEra],
    queryFn: async () => {
      const res = await fetch(`/api/chronicles/game/npcs?era=${selectedEra}`);
      if (!res.ok) return [];
      return res.json();
    },
    staleTime: 60000,
  });

  const { data: factionsData } = useQuery({
    queryKey: ["/api/chronicles/game/factions", selectedEra],
    queryFn: async () => {
      const res = await fetch(`/api/chronicles/game/factions?era=${selectedEra}`);
      if (!res.ok) return [];
      return res.json();
    },
    staleTime: 60000,
  });

  const situations = Array.isArray(situationsData) ? situationsData : [];
  const npcs = Array.isArray(npcsData) ? npcsData : [];
  const factions = Array.isArray(factionsData) ? factionsData : [];

  const config = ERA_CONFIG[selectedEra];

  const handleDecision = async (situationId: string, response: string) => {
    try {
      const res = await fetch("/api/chronicles/game/quest/start", {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({ questId: situationId, characterId: "default" }),
      });

      if (res.ok) {
        const decisionRes = await fetch("/api/chronicles/game/quest/decide", {
          method: "POST",
          headers: getAuthHeaders(),
          body: JSON.stringify({ questId: situationId, decisionId: response.substring(0, 50), characterId: "default" }),
        });
        const data = decisionRes.ok ? await decisionRes.json() : null;

        toast({
          title: "Your choice echoes through the world",
          description: data?.consequences || "The consequences of your decision will unfold in time...",
        });
      }
    } catch {
      toast({
        title: "Something happened",
        description: "The world continues to turn. Try again.",
        variant: "destructive",
      });
    }
    setActiveSituation(null);
  };

  const handleAlignFaction = async (factionId: string) => {
    try {
      const res = await fetch("/api/chronicles/game/faction/join", {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({ factionId, characterId: "default" }),
      });
      const data = await res.json();
      toast({
        title: data.success ? "You've aligned with this community" : "Could not join",
        description: data.message || "Your values have drawn you to this group.",
      });
    } catch {
      toast({ title: "Connection failed", variant: "destructive" });
    }
  };

  const tabs = [
    { id: "situations" as const, label: "What's Happening", icon: Compass, count: situations.length },
    { id: "people" as const, label: "People Around You", icon: Users, count: npcs.length },
    { id: "communities" as const, label: "Communities", icon: Shield, count: factions.length },
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
            <h1 className="text-2xl font-bold text-white">Your World</h1>
            <p className="text-xs text-gray-500">Living your parallel life — real-time, real choices</p>
          </div>
        </div>

        <WorldClock era={selectedEra} />

        <div className="flex gap-2 mt-4 mb-4 overflow-x-auto pb-1" data-testid="era-selector">
          {(Object.keys(ERA_CONFIG) as Array<keyof typeof ERA_CONFIG>).map(era => {
            const c = ERA_CONFIG[era];
            return (
              <button
                key={era}
                onClick={() => setSelectedEra(era)}
                className={`flex-shrink-0 px-4 py-2.5 rounded-full text-sm font-medium transition-all min-h-[44px] ${
                  selectedEra === era
                    ? `bg-gradient-to-r ${c.bgGradient} ${c.textColor} border ${c.borderColor}`
                    : "bg-white/5 text-gray-400 hover:bg-white/10"
                }`}
                data-testid={`era-btn-${era}`}
              >
                {c.name}
              </button>
            );
          })}
        </div>

        <LiveWorldBar />

        <div className="flex gap-1 mt-4 mb-4 bg-white/5 rounded-lg p-1" data-testid="world-tabs">
          {tabs.map(tab => {
            const TabIcon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-md text-xs font-medium transition-all ${
                  activeTab === tab.id
                    ? `${config.textColor} bg-white/10`
                    : "text-gray-500 hover:text-gray-300"
                }`}
                data-testid={`tab-${tab.id}`}
              >
                <TabIcon className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{tab.label}</span>
                <span className="sm:hidden">{tab.label.split(" ")[0]}</span>
                {tab.count > 0 && (
                  <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-white/10">{tab.count}</span>
                )}
              </button>
            );
          })}
        </div>

        <AnimatePresence mode="wait">
          {activeTab === "situations" && (
            <motion.div
              key="situations"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              className="space-y-3"
            >
              {situations.length === 0 ? (
                <GlassCard className="p-8 text-center">
                  <Compass className="w-10 h-10 text-gray-600 mx-auto mb-3" />
                  <p className="text-gray-400">The world is quiet right now...</p>
                  <p className="text-xs text-gray-600 mt-1">New situations emerge based on time, your actions, and what others do.</p>
                </GlassCard>
              ) : (
                <>
                  <div className="text-xs text-gray-500 mb-2">
                    These aren't missions — they're things happening around you. How you respond is entirely up to you.
                  </div>
                  {situations.map((s: any) => (
                    <SituationCard
                      key={s.id}
                      situation={s}
                      era={selectedEra}
                      onRespond={(id) => {
                        const sit = situations.find((x: any) => x.id === id);
                        if (sit) setActiveSituation(sit);
                      }}
                    />
                  ))}
                </>
              )}
            </motion.div>
          )}

          {activeTab === "people" && (
            <motion.div
              key="people"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              className="space-y-3"
            >
              {npcs.length === 0 ? (
                <GlassCard className="p-8 text-center">
                  <Users className="w-10 h-10 text-gray-600 mx-auto mb-3" />
                  <p className="text-gray-400">No one's around right now...</p>
                </GlassCard>
              ) : (
                <>
                  <div className="text-xs text-gray-500 mb-2">
                    These are people in your world — not quest-givers. Talk to them like real people. Build relationships over time.
                  </div>
                  {npcs.map((npc: any) => (
                    <NpcEncounter
                      key={npc.name}
                      npc={npc}
                      era={selectedEra}
                      onTalk={() => setActiveNpc(npc)}
                    />
                  ))}
                </>
              )}
            </motion.div>
          )}

          {activeTab === "communities" && (
            <motion.div
              key="communities"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              className="space-y-3"
            >
              {factions.length === 0 ? (
                <GlassCard className="p-8 text-center">
                  <Shield className="w-10 h-10 text-gray-600 mx-auto mb-3" />
                  <p className="text-gray-400">No communities to join yet...</p>
                </GlassCard>
              ) : (
                <>
                  <div className="text-xs text-gray-500 mb-2">
                    Communities reflect values, not classes. Align with people who share your beliefs — or challenge them.
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {factions.map((f: any) => (
                      <FactionCard
                        key={f.id}
                        faction={f}
                        era={selectedEra}
                        onAlign={handleAlignFaction}
                      />
                    ))}
                  </div>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {activeSituation && (
          <SituationDetail
            situation={activeSituation}
            era={selectedEra}
            onClose={() => setActiveSituation(null)}
            onDecide={handleDecision}
          />
        )}
        {activeNpc && (
          <NpcChatModal
            npc={activeNpc}
            era={selectedEra}
            onClose={() => setActiveNpc(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
