import { useState, useCallback } from "react";
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
  BookOpen, Church, Heart, Star, Flame, Send,
  MessageCircle, Users, Sparkles, ArrowLeft, Clock,
  ChevronRight, ChevronDown, Loader2, Award,
  BookMarked, HandHeart, Sun, Moon, Scroll,
  Crown, Shield, Volume2, Eye, Compass,
} from "lucide-react";

const ERA_FAITH_CONFIG: Record<string, any> = {
  modern: {
    name: "Modern Era",
    worshipIcon: "🏛️",
    textColor: "text-cyan-400",
    bgGradient: "from-cyan-500/20 to-blue-600/20",
    borderColor: "border-cyan-500/30",
    accentColor: "cyan",
    badgeClass: "bg-cyan-500/20 text-cyan-400",
    ursulaTitle: "Keeper of Sacred Texts",
  },
  medieval: {
    name: "Medieval Era",
    worshipIcon: "⛪",
    textColor: "text-amber-400",
    bgGradient: "from-amber-500/20 to-orange-600/20",
    borderColor: "border-amber-500/30",
    accentColor: "amber",
    badgeClass: "bg-amber-500/20 text-amber-400",
    ursulaTitle: "Keeper of the Sacred Library",
  },
  wildwest: {
    name: "Wild West Era",
    worshipIcon: "⛪",
    textColor: "text-orange-400",
    bgGradient: "from-orange-500/20 to-red-600/20",
    borderColor: "border-orange-500/30",
    accentColor: "orange",
    badgeClass: "bg-orange-500/20 text-orange-400",
    ursulaTitle: "The Circuit Preacher's Widow",
  },
};

const CATEGORY_LABELS: Record<string, { label: string; icon: any; color: string }> = {
  torah: { label: "Torah", icon: Scroll, color: "text-yellow-400" },
  history: { label: "History", icon: BookOpen, color: "text-blue-400" },
  poetry: { label: "Poetry", icon: Heart, color: "text-pink-400" },
  wisdom: { label: "Wisdom", icon: Eye, color: "text-purple-400" },
  prophets: { label: "Prophets", icon: Flame, color: "text-orange-400" },
  gospels: { label: "Gospels", icon: Sun, color: "text-yellow-300" },
  letters: { label: "Letters", icon: Send, color: "text-green-400" },
  prophecy: { label: "Prophecy", icon: Moon, color: "text-indigo-400" },
  cepher_exclusive: { label: "Cepher Exclusive", icon: Crown, color: "text-amber-400" },
};

type TabId = "overview" | "worship" | "scripture" | "prayer" | "community" | "ursula";

export default function ChroniclesFaith() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const session = getChroniclesSession();
  const [activeTab, setActiveTab] = useState<TabId>("overview");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedText, setSelectedText] = useState<any>(null);
  const [readingPassage, setReadingPassage] = useState<any>(null);
  const [serviceResult, setServiceResult] = useState<any>(null);
  const [prayerResult, setPrayerResult] = useState<any>(null);
  const [prayerIntention, setPrayerIntention] = useState("");
  const [ursulaMessage, setUrsulaMessage] = useState("");
  const [ursulaConversation, setUrsulaConversation] = useState<any[]>([]);
  const [eventResult, setEventResult] = useState<any>(null);

  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (session?.token) headers["Authorization"] = `Bearer ${session.token}`;

  const { data: faithStatus, isLoading } = useQuery({
    queryKey: ["/api/chronicles/faith/status"],
    queryFn: async () => {
      const res = await fetch("/api/chronicles/faith/status", { headers });
      if (!res.ok) throw new Error("Failed to load faith status");
      return res.json();
    },
    enabled: !!session?.token,
    refetchInterval: 30000,
  });

  const { data: sacredTexts } = useQuery({
    queryKey: ["/api/chronicles/faith/sacred-texts", selectedCategory],
    queryFn: async () => {
      const res = await fetch(`/api/chronicles/faith/sacred-texts?category=${selectedCategory}`, { headers });
      if (!res.ok) throw new Error("Failed to load texts");
      return res.json();
    },
    enabled: !!session?.token && activeTab === "scripture",
  });

  const readText = useMutation({
    mutationFn: async (textId: string) => {
      const res = await fetch("/api/chronicles/faith/read-text", {
        method: "POST", headers, body: JSON.stringify({ textId }),
      });
      if (!res.ok) throw new Error("Failed to read text");
      return res.json();
    },
    onSuccess: (data) => {
      setReadingPassage(data);
      queryClient.invalidateQueries({ queryKey: ["/api/chronicles/faith/status"] });
      queryClient.invalidateQueries({ queryKey: ["/api/chronicles/faith/sacred-texts"] });
      if (data.isNew) {
        toast({ title: "Sacred Text Read", description: `+${data.faithXpGained} Faith XP, +${data.echoReward} Echoes` });
      }
    },
  });

  const attendService = useMutation({
    mutationFn: async (congregationId: string) => {
      const res = await fetch("/api/chronicles/faith/attend-service", {
        method: "POST", headers, body: JSON.stringify({ congregationId }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to attend service");
      }
      return res.json();
    },
    onSuccess: (data) => {
      setServiceResult(data);
      queryClient.invalidateQueries({ queryKey: ["/api/chronicles/faith/status"] });
      toast({ title: "Service Attended", description: `+${data.faithXpGained} Faith XP, +${data.echoReward} Echoes` });
    },
    onError: (err: any) => {
      toast({ title: "Cannot Attend", description: err.message, variant: "destructive" });
    },
  });

  const pray = useMutation({
    mutationFn: async (intention: string) => {
      const res = await fetch("/api/chronicles/faith/pray", {
        method: "POST", headers, body: JSON.stringify({ intention }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to pray");
      }
      return res.json();
    },
    onSuccess: (data) => {
      setPrayerResult(data);
      setPrayerIntention("");
      queryClient.invalidateQueries({ queryKey: ["/api/chronicles/faith/status"] });
    },
    onError: (err: any) => {
      toast({ title: "Prayer", description: err.message, variant: "destructive" });
    },
  });

  const attendEvent = useMutation({
    mutationFn: async (eventId: string) => {
      const res = await fetch("/api/chronicles/faith/attend-event", {
        method: "POST", headers, body: JSON.stringify({ eventId }),
      });
      if (!res.ok) throw new Error("Failed to attend event");
      return res.json();
    },
    onSuccess: (data) => {
      setEventResult(data);
      queryClient.invalidateQueries({ queryKey: ["/api/chronicles/faith/status"] });
      toast({ title: "Event Attended", description: `+${data.faithXpGained} Faith XP, +${data.echoReward} Echoes` });
    },
  });

  const talkToUrsula = useMutation({
    mutationFn: async (message: string) => {
      const res = await fetch("/api/chronicles/faith/talk-to-ursula", {
        method: "POST", headers, body: JSON.stringify({ message }),
      });
      if (!res.ok) throw new Error("Failed to talk to Ursula");
      return res.json();
    },
    onSuccess: (data) => {
      setUrsulaConversation(prev => [...prev, { role: "ursula", content: data.reply }]);
      setUrsulaMessage("");
    },
  });

  const handleSendToUrsula = useCallback(() => {
    if (!ursulaMessage.trim()) return;
    setUrsulaConversation(prev => [...prev, { role: "player", content: ursulaMessage }]);
    talkToUrsula.mutate(ursulaMessage);
  }, [ursulaMessage]);

  if (!session?.token) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
        <GlassCard glow className="p-8 text-center max-w-md">
          <Church className="w-12 h-12 text-amber-400 mx-auto mb-4" />
          <h2 className="text-white font-bold text-xl mb-2">Faith & Spiritual Life</h2>
          <p className="text-gray-400 text-sm mb-4">Sign in to Chronicles to access your spiritual journey.</p>
          <Link href="/chronicles/login">
            <Button className="bg-gradient-to-r from-amber-500 to-orange-600" data-testid="faith-login-btn">Sign In</Button>
          </Link>
        </GlassCard>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-amber-400 animate-spin" />
      </div>
    );
  }

  const era = faithStatus?.era || "modern";
  const config = ERA_FAITH_CONFIG[era] || ERA_FAITH_CONFIG.modern;
  const faithLevel = faithStatus?.faithLevel || 0;
  const faithPct = faithLevel > 0 ? Math.min(100, ((faithLevel % 1) * 100) || 50) : 0;

  const tabs: { id: TabId; label: string; icon: any }[] = [
    { id: "overview", label: "Overview", icon: Compass },
    { id: "worship", label: "Worship", icon: Church },
    { id: "scripture", label: "Scripture", icon: BookMarked },
    { id: "prayer", label: "Prayer", icon: HandHeart },
    { id: "community", label: "Community", icon: Users },
    { id: "ursula", label: faithStatus?.ursulaName || "Ursula", icon: Sparkles },
  ];

  return (
    <div className="min-h-screen bg-slate-950 pb-20">
      <div className="sticky top-0 z-50 bg-slate-950/90 backdrop-blur-xl border-b border-white/5">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center gap-3">
            <Link href="/chronicles/play">
              <button className="p-2 rounded-lg bg-white/5 hover:bg-white/10 min-w-[44px] min-h-[44px] flex items-center justify-center" data-testid="back-to-play">
                <ArrowLeft className="w-5 h-5 text-white" />
              </button>
            </Link>
            <div className="flex-1 min-w-0">
              <h1 className="text-white font-bold text-lg truncate">Faith & Spiritual Life</h1>
              <p className="text-xs text-gray-500 truncate">{config.name} {config.worshipIcon}</p>
            </div>
            <Badge className={config.badgeClass} data-testid="faith-level-badge">
              <Star className="w-3 h-3 mr-1" /> Faith {faithLevel}
            </Badge>
          </div>
        </div>

        <div className="overflow-x-auto scrollbar-hide">
          <div className="flex gap-1 px-4 pb-2 min-w-max">
            {tabs.map(tab => {
              const Icon = tab.icon;
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all min-h-[44px] whitespace-nowrap ${
                    active
                      ? `bg-gradient-to-r ${config.bgGradient} ${config.textColor} border ${config.borderColor}`
                      : "text-gray-400 hover:text-white hover:bg-white/5"
                  }`}
                  data-testid={`tab-${tab.id}`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 pt-4 max-w-2xl">
        <AnimatePresence mode="wait">
          {(activeTab as string) === "overview" && (
            <motion.div key="overview" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-4">
              <GlassCard glow className="p-5">
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${config.bgGradient} flex items-center justify-center border ${config.borderColor}`}>
                    <Star className={`w-7 h-7 ${config.textColor}`} />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-white font-bold text-lg">Faith Level {faithLevel}</h2>
                    <p className="text-xs text-gray-400">
                      {faithLevel === 0 ? "Begin your spiritual journey" :
                       faithLevel < 3 ? "Seeker — exploring the path" :
                       faithLevel < 5 ? "Disciple — growing in understanding" :
                       faithLevel < 8 ? "Devoted — walking in wisdom" :
                       "Elder — a light to others"}
                    </p>
                  </div>
                </div>
                <Progress value={faithPct} className="h-2 mb-3" />
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div className="bg-white/5 rounded-lg p-2">
                    <p className={`text-lg font-bold ${config.textColor}`}>{faithStatus?.servicesAttended || 0}</p>
                    <p className="text-[10px] text-gray-500">Services</p>
                  </div>
                  <div className="bg-white/5 rounded-lg p-2">
                    <p className={`text-lg font-bold ${config.textColor}`}>{faithStatus?.sacredTextsRead?.length || 0}/{faithStatus?.totalTexts || 36}</p>
                    <p className="text-[10px] text-gray-500">Texts Read</p>
                  </div>
                  <div className="bg-white/5 rounded-lg p-2">
                    <p className={`text-lg font-bold ${config.textColor}`}>{faithStatus?.prayerStreak || 0}</p>
                    <p className="text-[10px] text-gray-500">Prayer Streak</p>
                  </div>
                </div>
              </GlassCard>

              <GlassCard className="p-4">
                <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  {faithStatus?.ursulaName || "Ursula"}
                </h3>
                <p className="text-sm text-gray-300 mb-2">{config.ursulaTitle}</p>
                <div className="flex items-center gap-2 mb-3">
                  <p className="text-xs text-gray-500">Relationship:</p>
                  <div className="flex gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Heart
                        key={i}
                        className={`w-3.5 h-3.5 ${
                          i < Math.max(0, Math.floor(((faithStatus?.ursulaRelationship || 0) + 20) / 8))
                            ? "text-red-400 fill-red-400"
                            : "text-gray-700"
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <Button
                  onClick={() => setActiveTab("ursula")}
                  className={`w-full bg-gradient-to-r ${config.bgGradient} border ${config.borderColor} text-white`}
                  data-testid="talk-ursula-btn"
                >
                  <MessageCircle className="w-4 h-4 mr-2" /> Talk to {faithStatus?.ursulaName || "Ursula"}
                </Button>
              </GlassCard>

              <div className="grid grid-cols-2 gap-3">
                <div onClick={() => setActiveTab("worship")} data-testid="goto-worship" className="cursor-pointer">
                  <GlassCard className="p-3 hover:bg-white/5 transition-all h-full">
                    <Church className="w-6 h-6 text-amber-400 mb-2" />
                    <p className="text-sm text-white font-medium">Attend Service</p>
                    <p className="text-[10px] text-gray-500">{faithStatus?.canAttendService ? "Available now" : "Rest before returning"}</p>
                  </GlassCard>
                </div>
                <div onClick={() => setActiveTab("scripture")} data-testid="goto-scripture" className="cursor-pointer">
                  <GlassCard className="p-3 hover:bg-white/5 transition-all h-full">
                    <BookMarked className="w-6 h-6 text-purple-400 mb-2" />
                    <p className="text-sm text-white font-medium">Read Scripture</p>
                    <p className="text-[10px] text-gray-500">{faithStatus?.sacredTextsRead?.length || 0} of {faithStatus?.totalTexts || 36} books</p>
                  </GlassCard>
                </div>
                <div onClick={() => setActiveTab("prayer")} data-testid="goto-prayer" className="cursor-pointer">
                  <GlassCard className="p-3 hover:bg-white/5 transition-all h-full">
                    <HandHeart className="w-6 h-6 text-blue-400 mb-2" />
                    <p className="text-sm text-white font-medium">Prayer</p>
                    <p className="text-[10px] text-gray-500">{faithStatus?.prayerStreak || 0} day streak</p>
                  </GlassCard>
                </div>
                <div onClick={() => setActiveTab("community")} data-testid="goto-community" className="cursor-pointer">
                  <GlassCard className="p-3 hover:bg-white/5 transition-all h-full">
                    <Users className="w-6 h-6 text-green-400 mb-2" />
                    <p className="text-sm text-white font-medium">Community</p>
                    <p className="text-[10px] text-gray-500">{faithStatus?.upcomingEvents?.length || 0} events</p>
                  </GlassCard>
                </div>
              </div>

              {faithStatus?.recentJournal?.length > 0 && (
                <GlassCard className="p-4">
                  <h3 className="text-white font-semibold text-sm mb-3 flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-purple-400" />
                    Spiritual Journal
                  </h3>
                  <div className="space-y-2">
                    {faithStatus.recentJournal.map((entry: any, i: number) => (
                      <div key={i} className="flex items-start gap-2 text-xs text-gray-400">
                        <Clock className="w-3 h-3 mt-0.5 text-gray-600 shrink-0" />
                        <span>
                          {entry.type === "reading" && `Read ${entry.book}`}
                          {entry.type === "service" && `Attended ${entry.title}`}
                          {entry.type === "prayer" && `Prayed (${entry.intention})`}
                          {entry.type === "event" && `Attended ${entry.name}`}
                        </span>
                      </div>
                    ))}
                  </div>
                </GlassCard>
              )}
            </motion.div>
          )}

          {(activeTab as string) === "worship" && (
            <motion.div key="worship" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-4">
              {serviceResult ? (
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-4">
                  <GlassCard glow className="p-5">
                    <div className="text-center mb-4">
                      <div className="text-4xl mb-2">{config.worshipIcon}</div>
                      <h2 className="text-white font-bold text-xl mb-1">{serviceResult.service.title}</h2>
                      <Badge className={config.badgeClass}>{serviceResult.congregation.name}</Badge>
                    </div>
                    <p className="text-sm text-gray-300 italic mb-4">{serviceResult.service.atmosphere}</p>
                    <div className="bg-white/5 rounded-xl p-4 mb-4">
                      <h3 className="text-white font-semibold text-sm mb-2 flex items-center gap-2">
                        <BookOpen className="w-4 h-4 text-amber-400" /> The Teaching
                      </h3>
                      <p className="text-sm text-gray-300 leading-relaxed whitespace-pre-line">{serviceResult.service.sermon}</p>
                      {serviceResult.service.scriptureReference && (
                        <p className="text-xs text-amber-400/70 mt-2 italic">— {serviceResult.service.scriptureReference}</p>
                      )}
                    </div>
                    {serviceResult.service.communityMoment && (
                      <div className="bg-white/5 rounded-xl p-4 mb-4">
                        <h3 className="text-white font-semibold text-sm mb-2 flex items-center gap-2">
                          <Users className="w-4 h-4 text-green-400" /> Fellowship
                        </h3>
                        <p className="text-sm text-gray-300">{serviceResult.service.communityMoment}</p>
                      </div>
                    )}
                    <p className="text-sm text-gray-400 italic text-center mb-4">{serviceResult.service.personalInsight}</p>
                    <div className="flex flex-wrap gap-2 justify-center mb-3">
                      <Badge className="bg-amber-500/20 text-amber-400">+{serviceResult.faithXpGained} Faith XP</Badge>
                      <Badge className="bg-green-500/20 text-green-400">+{serviceResult.echoReward} Echoes</Badge>
                      {serviceResult.ursulaRelationshipChange > 0 && (
                        <Badge className="bg-pink-500/20 text-pink-400">+{serviceResult.ursulaRelationshipChange} {faithStatus?.ursulaName}</Badge>
                      )}
                    </div>
                    <Button onClick={() => setServiceResult(null)} className="w-full bg-white/10 text-white" data-testid="service-done-btn">
                      Return to Congregations
                    </Button>
                  </GlassCard>
                </motion.div>
              ) : (
                <>
                  <GlassCard className="p-4">
                    <h2 className="text-white font-bold mb-1 flex items-center gap-2">
                      <Church className={`w-5 h-5 ${config.textColor}`} /> Places of Worship
                    </h2>
                    <p className="text-xs text-gray-500 mb-4">Choose a congregation to attend a service</p>
                    {!faithStatus?.canAttendService && (
                      <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-3 mb-4">
                        <p className="text-xs text-amber-400">You've recently attended a service. Rest and reflect before returning.</p>
                      </div>
                    )}
                  </GlassCard>
                  {faithStatus?.congregations?.map((cong: any) => (
                    <GlassCard key={cong.id} className="p-4">
                      <div className="flex items-start gap-3">
                        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${config.bgGradient} flex items-center justify-center shrink-0`}>
                          <Church className={`w-5 h-5 ${config.textColor}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-white font-semibold text-sm">{cong.name}</h3>
                          <Badge className="text-[10px] bg-white/10 text-gray-400 mb-1">{cong.type}</Badge>
                          <p className="text-xs text-gray-400 leading-relaxed mb-2">{cong.description}</p>
                          <p className="text-[10px] text-gray-600 flex items-center gap-1 mb-3">
                            <Clock className="w-3 h-3" /> {cong.schedule}
                          </p>
                          <Button
                            onClick={() => attendService.mutate(cong.id)}
                            disabled={!faithStatus?.canAttendService || attendService.isPending}
                            className={`w-full bg-gradient-to-r ${config.bgGradient} border ${config.borderColor} text-white text-xs`}
                            data-testid={`attend-${cong.id}`}
                          >
                            {attendService.isPending ? <Loader2 className="w-3 h-3 animate-spin mr-1" /> : <Church className="w-3 h-3 mr-1" />}
                            Attend Service
                          </Button>
                        </div>
                      </div>
                    </GlassCard>
                  ))}
                </>
              )}
            </motion.div>
          )}

          {(activeTab as string) === "scripture" && (
            <motion.div key="scripture" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-4">
              {readingPassage ? (
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-4">
                  <GlassCard glow className="p-5">
                    <div className="text-center mb-4">
                      <Badge className="bg-amber-500/20 text-amber-400 mb-2">{readingPassage.text.book}</Badge>
                      <h2 className="text-white font-bold text-lg">{readingPassage.passage.passageTitle}</h2>
                      {readingPassage.text.category === "cepher_exclusive" && (
                        <Badge className="bg-purple-500/20 text-purple-400 mt-1 text-[10px]">
                          <Crown className="w-3 h-3 mr-1" /> Cepher Exclusive
                        </Badge>
                      )}
                    </div>
                    <div className="bg-white/5 rounded-xl p-4 mb-4 border-l-2 border-amber-500/50">
                      <p className="text-sm text-gray-200 leading-relaxed whitespace-pre-line italic">{readingPassage.passage.passage}</p>
                    </div>
                    {readingPassage.passage.ursulaCommentary && (
                      <div className="bg-purple-500/10 rounded-xl p-4 mb-4">
                        <p className="text-xs text-purple-300 font-semibold mb-1 flex items-center gap-1">
                          <Sparkles className="w-3 h-3" /> {faithStatus?.ursulaName}'s Commentary
                        </p>
                        <p className="text-sm text-gray-300">{readingPassage.passage.ursulaCommentary}</p>
                      </div>
                    )}
                    {readingPassage.passage.reflectionQuestion && (
                      <div className="bg-blue-500/10 rounded-xl p-3 mb-4 text-center">
                        <p className="text-xs text-blue-300 font-medium mb-1">Reflection</p>
                        <p className="text-sm text-gray-300 italic">{readingPassage.passage.reflectionQuestion}</p>
                      </div>
                    )}
                    {readingPassage.passage.historicalContext && (
                      <p className="text-xs text-gray-500 text-center mb-4">{readingPassage.passage.historicalContext}</p>
                    )}
                    <div className="flex flex-wrap gap-2 justify-center mb-3">
                      <Badge className="bg-amber-500/20 text-amber-400">+{readingPassage.faithXpGained} Faith XP</Badge>
                      {readingPassage.echoReward > 0 && <Badge className="bg-green-500/20 text-green-400">+{readingPassage.echoReward} Echoes</Badge>}
                      {readingPassage.isNew && <Badge className="bg-cyan-500/20 text-cyan-400">New Text Unlocked</Badge>}
                    </div>
                    <Button onClick={() => { setReadingPassage(null); setSelectedText(null); }} className="w-full bg-white/10 text-white" data-testid="reading-done-btn">
                      Return to Library
                    </Button>
                  </GlassCard>
                </motion.div>
              ) : (
                <>
                  <GlassCard glow className="p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500/30 to-amber-500/30 flex items-center justify-center">
                        <BookMarked className="w-6 h-6 text-amber-400" />
                      </div>
                      <div>
                        <h2 className="text-white font-bold">The Cepher Bible</h2>
                        <p className="text-xs text-gray-400">87 Books — The Complete Sacred Canon</p>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 leading-relaxed">
                      The Eth Cepher contains the 66 books of the standard Bible plus 21 additional sacred texts that were removed from common circulation — including the Book of Enoch, Jubilees, Jasher, and more. {faithStatus?.ursulaName} guides you through each one.
                    </p>
                    <Progress value={(sacredTexts?.totalRead || 0) / (sacredTexts?.totalTexts || 36) * 100} className="mt-3 h-1.5" />
                    <p className="text-[10px] text-gray-600 mt-1">{sacredTexts?.totalRead || 0} of {sacredTexts?.totalTexts || 36} texts read</p>
                  </GlassCard>

                  <div className="overflow-x-auto scrollbar-hide -mx-4 px-4">
                    <div className="flex gap-1.5 min-w-max pb-1">
                      <button
                        onClick={() => setSelectedCategory("all")}
                        className={`px-3 py-2 rounded-lg text-xs font-medium min-h-[40px] transition-all ${
                          selectedCategory === "all" ? `bg-gradient-to-r ${config.bgGradient} ${config.textColor}` : "text-gray-400 bg-white/5"
                        }`}
                        data-testid="cat-all"
                      >
                        All
                      </button>
                      {Object.entries(CATEGORY_LABELS).map(([key, cat]) => {
                        const Icon = cat.icon;
                        return (
                          <button
                            key={key}
                            onClick={() => setSelectedCategory(key)}
                            className={`px-3 py-2 rounded-lg text-xs font-medium min-h-[40px] flex items-center gap-1.5 transition-all whitespace-nowrap ${
                              selectedCategory === key ? `bg-gradient-to-r ${config.bgGradient} ${config.textColor}` : "text-gray-400 bg-white/5"
                            }`}
                            data-testid={`cat-${key}`}
                          >
                            <Icon className="w-3 h-3" /> {cat.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="space-y-2">
                    {sacredTexts?.texts?.map((text: any) => {
                      const catInfo = CATEGORY_LABELS[text.category] || CATEGORY_LABELS.history;
                      const CatIcon = catInfo.icon;
                      return (
                        <div
                          key={text.id}
                          className="cursor-pointer"
                          onClick={() => {
                            setSelectedText(text);
                            readText.mutate(text.id);
                          }}
                          data-testid={`text-${text.id}`}
                        >
                        <GlassCard
                          className={`p-3 transition-all ${text.read ? "border-green-500/20" : "hover:bg-white/5"}`}
                        >
                          <div className="flex items-start gap-3">
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${text.read ? "bg-green-500/20" : "bg-white/5"}`}>
                              {readText.isPending && selectedText?.id === text.id ? (
                                <Loader2 className="w-4 h-4 animate-spin text-amber-400" />
                              ) : (
                                <CatIcon className={`w-4 h-4 ${text.read ? "text-green-400" : catInfo.color}`} />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 flex-wrap">
                                <p className="text-sm text-white font-medium">{text.book}</p>
                                {text.category === "cepher_exclusive" && (
                                  <Badge className="text-[9px] bg-purple-500/20 text-purple-400">
                                    <Crown className="w-2.5 h-2.5 mr-0.5" /> Cepher
                                  </Badge>
                                )}
                                {text.read && <Badge className="text-[9px] bg-green-500/20 text-green-400">Read</Badge>}
                              </div>
                              <p className="text-[11px] text-gray-500 leading-relaxed mt-0.5">{text.description}</p>
                              <p className="text-[10px] text-gray-600 mt-1">{text.chapters} chapters</p>
                            </div>
                            <ChevronRight className="w-4 h-4 text-gray-600 shrink-0 mt-1" />
                          </div>
                        </GlassCard>
                        </div>
                      );
                    })}
                  </div>
                </>
              )}
            </motion.div>
          )}

          {(activeTab as string) === "prayer" && (
            <motion.div key="prayer" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-4">
              {prayerResult ? (
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-4">
                  <GlassCard glow className="p-5">
                    <div className="text-center mb-4">
                      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500/30 to-purple-500/30 flex items-center justify-center mx-auto mb-3">
                        <HandHeart className="w-8 h-8 text-blue-400" />
                      </div>
                      <h2 className="text-white font-bold text-lg">A Moment of Prayer</h2>
                    </div>
                    <p className="text-sm text-gray-400 italic text-center mb-4">{prayerResult.prayer.atmosphere}</p>
                    <div className="bg-white/5 rounded-xl p-4 mb-4">
                      <p className="text-sm text-gray-200 italic leading-relaxed">{prayerResult.prayer.prayer}</p>
                    </div>
                    <div className="bg-amber-500/10 rounded-xl p-4 mb-4 border-l-2 border-amber-500/50">
                      <p className="text-sm text-gray-200 italic">{prayerResult.prayer.scripture}</p>
                      <p className="text-xs text-amber-400/70 mt-1">— {prayerResult.prayer.scriptureSource}</p>
                    </div>
                    <p className="text-sm text-gray-300 text-center mb-2">{prayerResult.prayer.innerPeace}</p>
                    {prayerResult.prayer.ursulaWhisper && (
                      <div className="bg-purple-500/10 rounded-lg p-3 mb-4">
                        <p className="text-xs text-purple-300">
                          <Sparkles className="w-3 h-3 inline mr-1" />
                          {prayerResult.prayer.ursulaWhisper}
                        </p>
                      </div>
                    )}
                    <div className="flex flex-wrap gap-2 justify-center mb-4">
                      <Badge className="bg-blue-500/20 text-blue-400">+{prayerResult.faithXpGained} Faith XP</Badge>
                      <Badge className="bg-green-500/20 text-green-400">+{prayerResult.echoReward} Echoes</Badge>
                      <Badge className="bg-orange-500/20 text-orange-400">
                        <Flame className="w-3 h-3 mr-0.5" /> {prayerResult.prayerStreak} Day Streak
                      </Badge>
                      {prayerResult.wisdomGained > 0 && <Badge className="bg-purple-500/20 text-purple-400">+{prayerResult.wisdomGained} Wisdom</Badge>}
                    </div>
                    <Button onClick={() => setPrayerResult(null)} className="w-full bg-white/10 text-white" data-testid="prayer-done-btn">
                      Amen
                    </Button>
                  </GlassCard>
                </motion.div>
              ) : (
                <>
                  <GlassCard glow className="p-5">
                    <div className="text-center mb-4">
                      <HandHeart className={`w-10 h-10 ${config.textColor} mx-auto mb-2`} />
                      <h2 className="text-white font-bold text-lg">Prayer & Meditation</h2>
                      <p className="text-xs text-gray-500">Seek guidance, find peace, grow in wisdom</p>
                    </div>
                    {faithStatus?.prayerStreak > 0 && (
                      <div className="bg-orange-500/10 rounded-lg p-3 mb-4 text-center">
                        <Flame className="w-5 h-5 text-orange-400 mx-auto mb-1" />
                        <p className="text-sm text-orange-400 font-bold">{faithStatus.prayerStreak} Day Prayer Streak</p>
                        <p className="text-[10px] text-gray-500">Keep praying daily to build your streak and earn bonus rewards</p>
                      </div>
                    )}
                    <div className="space-y-3">
                      <div>
                        <label className="text-xs text-gray-400 mb-1 block">What's on your heart? (optional)</label>
                        <textarea
                          value={prayerIntention}
                          onChange={(e) => setPrayerIntention(e.target.value)}
                          placeholder="Share your intention, concern, gratitude, or simply be still..."
                          className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white placeholder:text-gray-600 resize-none min-h-[80px] focus:outline-none focus:border-amber-500/30"
                          data-testid="prayer-intention-input"
                        />
                      </div>
                      <Button
                        onClick={() => pray.mutate(prayerIntention)}
                        disabled={!faithStatus?.canPray || pray.isPending}
                        className={`w-full bg-gradient-to-r ${config.bgGradient} border ${config.borderColor} text-white py-3`}
                        data-testid="pray-btn"
                      >
                        {pray.isPending ? (
                          <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Entering prayer...</>
                        ) : (
                          <><HandHeart className="w-4 h-4 mr-2" /> Pray</>
                        )}
                      </Button>
                      {!faithStatus?.canPray && (
                        <p className="text-xs text-gray-600 text-center">Take time to reflect before your next prayer.</p>
                      )}
                    </div>
                  </GlassCard>
                </>
              )}
            </motion.div>
          )}

          {(activeTab as string) === "community" && (
            <motion.div key="community" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-4">
              {eventResult ? (
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-4">
                  <GlassCard glow className="p-5">
                    <div className="text-center mb-4">
                      <Users className={`w-10 h-10 ${config.textColor} mx-auto mb-2`} />
                      <h2 className="text-white font-bold text-lg">{eventResult.eventInfo.name}</h2>
                    </div>
                    <div className="bg-white/5 rounded-xl p-4 mb-4">
                      <p className="text-sm text-gray-300 leading-relaxed whitespace-pre-line">{eventResult.event.narrative}</p>
                    </div>
                    {eventResult.event.highlight && (
                      <div className="bg-amber-500/10 rounded-lg p-3 mb-3">
                        <p className="text-xs text-amber-300 font-semibold mb-1">Highlight</p>
                        <p className="text-sm text-gray-300">{eventResult.event.highlight}</p>
                      </div>
                    )}
                    {eventResult.event.connection && (
                      <div className="bg-green-500/10 rounded-lg p-3 mb-3">
                        <p className="text-xs text-green-300 font-semibold mb-1">Connection</p>
                        <p className="text-sm text-gray-300">{eventResult.event.connection}</p>
                      </div>
                    )}
                    <p className="text-sm text-gray-400 italic text-center mb-4">{eventResult.event.takeaway}</p>
                    <div className="flex flex-wrap gap-2 justify-center mb-3">
                      <Badge className="bg-amber-500/20 text-amber-400">+{eventResult.faithXpGained} Faith XP</Badge>
                      <Badge className="bg-green-500/20 text-green-400">+{eventResult.echoReward} Echoes</Badge>
                    </div>
                    <Button onClick={() => setEventResult(null)} className="w-full bg-white/10 text-white" data-testid="event-done-btn">
                      Return to Community
                    </Button>
                  </GlassCard>
                </motion.div>
              ) : (
                <>
                  <GlassCard className="p-4">
                    <h2 className="text-white font-bold mb-1 flex items-center gap-2">
                      <Users className={`w-5 h-5 ${config.textColor}`} /> Community Gatherings
                    </h2>
                    <p className="text-xs text-gray-500">Join your community in faith, fellowship, and service</p>
                  </GlassCard>
                  {faithStatus?.upcomingEvents?.map((event: any) => (
                    <GlassCard key={event.id} className="p-4">
                      <div className="flex items-start gap-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                          event.type === "study" ? "bg-purple-500/20" :
                          event.type === "service" ? "bg-green-500/20" :
                          event.type === "prayer" ? "bg-blue-500/20" :
                          event.type === "ceremony" ? "bg-amber-500/20" :
                          "bg-white/10"
                        }`}>
                          {event.type === "study" ? <BookOpen className="w-5 h-5 text-purple-400" /> :
                           event.type === "service" ? <Heart className="w-5 h-5 text-green-400" /> :
                           event.type === "prayer" ? <HandHeart className="w-5 h-5 text-blue-400" /> :
                           event.type === "ceremony" ? <Award className="w-5 h-5 text-amber-400" /> :
                           <Users className="w-5 h-5 text-gray-400" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="text-white font-semibold text-sm">{event.name}</h3>
                            <Badge className="text-[9px] bg-white/10 text-gray-400">{event.type}</Badge>
                          </div>
                          <p className="text-xs text-gray-400 leading-relaxed mt-1 mb-2">{event.description}</p>
                          <div className="flex items-center gap-3 mb-3">
                            <span className="text-[10px] text-amber-400">+{event.faithXp} Faith XP</span>
                            <span className="text-[10px] text-green-400">+{event.echoReward} Echoes</span>
                            {event.minFaithLevel && <span className="text-[10px] text-purple-400">Requires Faith {event.minFaithLevel}</span>}
                          </div>
                          <Button
                            onClick={() => attendEvent.mutate(event.id)}
                            disabled={attendEvent.isPending}
                            className={`w-full bg-gradient-to-r ${config.bgGradient} border ${config.borderColor} text-white text-xs`}
                            data-testid={`event-${event.id}`}
                          >
                            {attendEvent.isPending ? <Loader2 className="w-3 h-3 animate-spin mr-1" /> : <Users className="w-3 h-3 mr-1" />}
                            Attend
                          </Button>
                        </div>
                      </div>
                    </GlassCard>
                  ))}
                </>
              )}
            </motion.div>
          )}

          {(activeTab as string) === "ursula" && (
            <motion.div key="ursula" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-4">
              <GlassCard glow className="p-5">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500/30 to-amber-500/30 flex items-center justify-center border border-purple-500/20">
                    <Sparkles className="w-8 h-8 text-amber-400" />
                  </div>
                  <div>
                    <h2 className="text-white font-bold text-lg">{faithStatus?.ursulaName || "Ursula"}</h2>
                    <p className="text-xs text-gray-400">{config.ursulaTitle}</p>
                    <div className="flex items-center gap-1 mt-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Heart
                          key={i}
                          className={`w-3 h-3 ${
                            i < Math.max(0, Math.floor(((faithStatus?.ursulaRelationship || 0) + 20) / 8))
                              ? "text-red-400 fill-red-400"
                              : "text-gray-700"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-xs text-gray-400 leading-relaxed mb-4">
                  {era === "modern"
                    ? "A former professor of ancient languages who left academia for truth. She carries a well-worn Cepher Bible and can recite passages in Hebrew, Greek, and Aramaic."
                    : era === "medieval"
                    ? "In an age when the Church strictly controls which texts the faithful may read, Sister Ursula secretly maintains a hidden library containing the complete scriptures."
                    : "When her circuit-preacher husband was killed by outlaws, Mother Ursula picked up his Cepher Bible and kept riding the circuit herself."
                  }
                </p>
              </GlassCard>

              <GlassCard className="p-4">
                <div className="space-y-3 max-h-[400px] overflow-y-auto mb-4" data-testid="ursula-chat-scroll">
                  {ursulaConversation.length === 0 && (
                    <div className="text-center py-8">
                      <Sparkles className="w-8 h-8 text-amber-400/30 mx-auto mb-3" />
                      <p className="text-sm text-gray-500">Start a conversation with {faithStatus?.ursulaName || "Ursula"}</p>
                      <p className="text-xs text-gray-600 mt-1">Ask about scripture, seek guidance, or just talk</p>
                      <div className="flex flex-wrap gap-2 justify-center mt-4">
                        {[
                          "Tell me about the Book of Enoch",
                          "What is the Cepher Bible?",
                          "I'm struggling with a decision",
                          "What does Jubilees teach us?",
                        ].map((prompt) => (
                          <button
                            key={prompt}
                            onClick={() => {
                              setUrsulaConversation([{ role: "player", content: prompt }]);
                              talkToUrsula.mutate(prompt);
                            }}
                            className="text-[11px] px-3 py-1.5 rounded-full bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white transition-all min-h-[36px]"
                            data-testid={`prompt-${prompt.slice(0, 15)}`}
                          >
                            {prompt}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                  {ursulaConversation.map((msg, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex ${msg.role === "player" ? "justify-end" : "justify-start"}`}
                    >
                      <div className={`max-w-[85%] rounded-2xl px-4 py-2.5 ${
                        msg.role === "player"
                          ? "bg-cyan-500/20 text-white rounded-br-sm"
                          : "bg-purple-500/10 text-gray-200 border border-purple-500/20 rounded-bl-sm"
                      }`}>
                        {msg.role === "ursula" && (
                          <p className="text-[10px] text-purple-400 font-medium mb-0.5 flex items-center gap-1">
                            <Sparkles className="w-2.5 h-2.5" /> {faithStatus?.ursulaName}
                          </p>
                        )}
                        <p className="text-sm leading-relaxed">{msg.content}</p>
                      </div>
                    </motion.div>
                  ))}
                  {talkToUrsula.isPending && (
                    <div className="flex justify-start">
                      <div className="bg-purple-500/10 rounded-2xl px-4 py-3 border border-purple-500/20">
                        <div className="flex gap-1">
                          <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                          <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                          <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                <div className="flex gap-2">
                  <input
                    value={ursulaMessage}
                    onChange={(e) => setUrsulaMessage(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSendToUrsula()}
                    placeholder={`Ask ${faithStatus?.ursulaName || "Ursula"} anything...`}
                    className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-purple-500/30 min-h-[44px]"
                    data-testid="ursula-chat-input"
                  />
                  <Button
                    onClick={handleSendToUrsula}
                    disabled={!ursulaMessage.trim() || talkToUrsula.isPending}
                    className="bg-gradient-to-r from-purple-500 to-amber-500 text-white min-w-[44px] min-h-[44px]"
                    data-testid="ursula-send-btn"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </GlassCard>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}