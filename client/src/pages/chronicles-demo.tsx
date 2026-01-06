import { useState, useRef, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Crown, Sword, Users, MessageCircle, Star, Shield, Scroll, Sparkles, BookOpen, Trophy, Target, ChevronRight, Send, User, MapPin, Play, Volume2, VolumeX, Flame, Zap, Globe, Building, Store, Clock, Compass, Layers } from "lucide-react";

import medievalVideo from "@assets/generated_videos/medieval_castle_twilight_scene.mp4";
import medievalKingdom from "@assets/generated_images/medieval_fantasy_kingdom.png";
import fantasyHeroes from "@assets/generated_images/fantasy_character_heroes.png";
import romanColosseum from "@assets/generated_images/roman_empire_colosseum_gladiators.png";
import vikingFjord from "@assets/generated_images/viking_longship_fjord_scene.png";
import wildWest from "@assets/generated_images/wild_west_frontier_town.png";

const GlowOrb = ({ color, size, top, left, delay = 0 }: { color: string; size: number; top: string; left: string; delay?: number }) => (
  <motion.div
    className="absolute rounded-full blur-3xl pointer-events-none"
    style={{ background: color, width: size, height: size, top, left, opacity: 0.15 }}
    animate={{ scale: [1, 1.3, 1], opacity: [0.1, 0.2, 0.1] }}
    transition={{ duration: 8, repeat: Infinity, delay }}
  />
);

const FACTION_IMAGES: Record<string, string> = {
  house_of_crowns: medievalKingdom,
  shadow_council: fantasyHeroes,
  merchant_guild: wildWest,
  innovators_circle: romanColosseum,
  old_faith: vikingFjord,
};

interface Faction {
  id: string;
  name: string;
  description: string;
  ideology: string;
  color: string;
  iconEmoji: string;
  era: string;
}

interface Quest {
  id: string;
  title: string;
  description: string;
  era: string;
  difficulty: string;
  shellsReward: string;
  experienceReward: number;
  category: string;
  prerequisite?: string;
}

interface NPC {
  id: string;
  name: string;
  title: string;
  era: string;
  factionId: string;
}

interface Season {
  id: string;
  name: string;
  description: string;
  seasonNumber: number;
  startDate: string;
  endDate: string;
  totalShellsPool: string;
  totalDwcPool: string;
  participantCount: number;
  questsAvailable: number;
  isActive: boolean;
}

export default function ChroniclesDemo() {
  const [selectedFaction, setSelectedFaction] = useState<Faction | null>(null);
  const [selectedQuest, setSelectedQuest] = useState<Quest | null>(null);
  const [selectedNpc, setSelectedNpc] = useState<NPC | null>(null);
  const [npcMessage, setNpcMessage] = useState("");
  const [conversation, setConversation] = useState<Array<{role: string; content: string}>>([]);
  const [characterName, setCharacterName] = useState("");
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  const { data: season } = useQuery<Season>({
    queryKey: ["chronicles-season"],
    queryFn: async () => {
      const res = await fetch("/api/chronicles/game/season");
      return res.json();
    },
  });

  const { data: factionsData } = useQuery<{ factions: Faction[] }>({
    queryKey: ["chronicles-factions"],
    queryFn: async () => {
      const res = await fetch("/api/chronicles/game/factions");
      return res.json();
    },
  });

  const { data: questsData } = useQuery<{ quests: Quest[] }>({
    queryKey: ["chronicles-quests"],
    queryFn: async () => {
      const res = await fetch("/api/chronicles/game/quests");
      return res.json();
    },
  });

  const { data: npcsData } = useQuery<{ npcs: NPC[] }>({
    queryKey: ["chronicles-npcs"],
    queryFn: async () => {
      const res = await fetch("/api/chronicles/game/npcs");
      return res.json();
    },
  });

  const talkMutation = useMutation({
    mutationFn: async ({ npcId, message }: { npcId: string; message: string }) => {
      const res = await fetch("/api/chronicles/game/npc/talk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ characterId: "demo", npcId, message }),
      });
      return res.json();
    },
    onSuccess: (data) => {
      if (data.response) {
        setConversation(prev => [...prev, { role: "npc", content: data.response }]);
      }
    },
  });

  const handleSendMessage = () => {
    if (!selectedNpc || !npcMessage.trim()) return;
    setConversation(prev => [...prev, { role: "player", content: npcMessage }]);
    talkMutation.mutate({ npcId: selectedNpc.id, message: npcMessage });
    setNpcMessage("");
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy": return "text-green-400 border-green-500/50";
      case "medium": return "text-yellow-400 border-yellow-500/50";
      case "hard": return "text-orange-400 border-orange-500/50";
      case "legendary": return "text-purple-400 border-purple-500/50";
      default: return "text-gray-400 border-gray-500/50";
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 overflow-hidden">
      {/* Video Hero Section */}
      <section className="relative h-[70vh] min-h-[500px] overflow-hidden">
        <video
          ref={videoRef}
          autoPlay
          loop
          muted={isMuted}
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src={medievalVideo} type="video/mp4" />
        </video>
        
        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/80 via-transparent to-slate-950/80" />
        
        {/* Floating glow orbs */}
        <GlowOrb color="#8B5CF6" size={400} top="10%" left="10%" delay={0} />
        <GlowOrb color="#06B6D4" size={350} top="30%" left="70%" delay={2} />
        <GlowOrb color="#EC4899" size={300} top="60%" left="30%" delay={4} />
        
        {/* Sound toggle */}
        <button
          onClick={() => setIsMuted(!isMuted)}
          className="absolute top-6 right-6 z-20 p-3 rounded-full bg-black/40 backdrop-blur-sm border border-white/20 hover:bg-black/60 transition-all"
          data-testid="button-toggle-sound"
        >
          {isMuted ? <VolumeX className="w-5 h-5 text-white" /> : <Volume2 className="w-5 h-5 text-white" />}
        </button>
        
        {/* Hero content */}
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <div className="text-center px-4 max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="flex flex-wrap justify-center gap-2 mb-6">
                <Badge className="px-4 py-2 text-sm bg-gradient-to-r from-amber-500/30 to-orange-500/30 border-amber-500/50 backdrop-blur-sm animate-pulse" data-testid="badge-beta">
                  <Flame className="w-4 h-4 mr-2" />
                  BETA v0.1
                </Badge>
                <Badge className="px-4 py-2 text-sm bg-gradient-to-r from-purple-500/30 to-cyan-500/30 border-purple-500/50 backdrop-blur-sm" data-testid="badge-season-zero">
                  <Sparkles className="w-4 h-4 mr-2" />
                  SEASON ZERO - THE AWAKENING
                </Badge>
              </div>
              
              <h1 className="text-5xl md:text-7xl font-black mb-4 tracking-tight">
                <span className="bg-gradient-to-r from-amber-200 via-yellow-300 to-amber-200 bg-clip-text text-transparent drop-shadow-2xl">
                  Age of Crowns
                </span>
              </h1>
              
              <p className="text-sm text-cyan-400 mb-4 uppercase tracking-widest">
                1 of 70+ Eras in the Neverending World
              </p>
              
              <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed">
                Your parallel self awakens in a living world. Choose your allegiance, 
                complete quests, and forge your legend across infinite eras.
              </p>
              
              <div className="flex flex-wrap justify-center gap-4">
                <div className="px-6 py-3 rounded-xl bg-gradient-to-br from-purple-500/20 to-purple-500/5 border border-purple-500/30 backdrop-blur-sm">
                  <div className="text-2xl font-bold text-purple-400">{season?.questsAvailable || 4}</div>
                  <div className="text-xs text-gray-400 uppercase tracking-wide">Quests</div>
                </div>
                <div className="px-6 py-3 rounded-xl bg-gradient-to-br from-cyan-500/20 to-cyan-500/5 border border-cyan-500/30 backdrop-blur-sm">
                  <div className="text-2xl font-bold text-cyan-400">{parseInt(season?.totalShellsPool || "100000").toLocaleString()}</div>
                  <div className="text-xs text-gray-400 uppercase tracking-wide">Shell Pool</div>
                </div>
                <div className="px-6 py-3 rounded-xl bg-gradient-to-br from-amber-500/20 to-amber-500/5 border border-amber-500/30 backdrop-blur-sm">
                  <div className="text-2xl font-bold text-amber-400">{parseInt(season?.totalDwcPool || "10000").toLocaleString()}</div>
                  <div className="text-xs text-gray-400 uppercase tracking-wide">DWC Pool</div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
        
        {/* Scroll indicator */}
        <motion.div 
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <ChevronRight className="w-8 h-8 text-white/50 rotate-90" />
        </motion.div>
      </section>

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-4 py-12 max-w-7xl">
        <GlowOrb color="#8B5CF6" size={500} top="20%" left="-10%" delay={1} />
        <GlowOrb color="#06B6D4" size={400} top="60%" left="80%" delay={3} />
        
        <Tabs defaultValue="factions" className="space-y-8">
          <TabsList className="grid w-full grid-cols-3 bg-slate-900/80 border border-slate-700/50 backdrop-blur-xl p-1 rounded-2xl">
            <TabsTrigger value="factions" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500/30 data-[state=active]:to-purple-500/10 rounded-xl py-3" data-testid="tab-factions">
              <Crown className="w-4 h-4 mr-2" />
              Factions
            </TabsTrigger>
            <TabsTrigger value="quests" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500/30 data-[state=active]:to-cyan-500/10 rounded-xl py-3" data-testid="tab-quests">
              <Target className="w-4 h-4 mr-2" />
              Quests
            </TabsTrigger>
            <TabsTrigger value="npcs" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-500/30 data-[state=active]:to-pink-500/10 rounded-xl py-3" data-testid="tab-npcs">
              <MessageCircle className="w-4 h-4 mr-2" />
              NPCs
            </TabsTrigger>
          </TabsList>

          {/* Factions Tab */}
          <TabsContent value="factions" className="space-y-8">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {factionsData?.factions.map((faction, index) => (
                <motion.div
                  key={faction.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                >
                  <div
                    className={`group relative cursor-pointer overflow-hidden rounded-2xl transition-all duration-500 hover:scale-[1.02] ${
                      selectedFaction?.id === faction.id ? "ring-2 ring-offset-4 ring-offset-slate-950" : ""
                    }`}
                    style={{
                      boxShadow: selectedFaction?.id === faction.id ? `0 0 40px ${faction.color}50` : undefined,
                      borderColor: selectedFaction?.id === faction.id ? faction.color : undefined,
                    }}
                    onClick={() => setSelectedFaction(faction)}
                    data-testid={`card-faction-${faction.id}`}
                  >
                    {/* Background image */}
                    <div className="absolute inset-0">
                      <img 
                        src={FACTION_IMAGES[faction.id] || medievalKingdom} 
                        alt={faction.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-slate-950/40" />
                    </div>
                    
                    {/* Holographic border effect */}
                    <div 
                      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                      style={{
                        background: `linear-gradient(135deg, ${faction.color}20 0%, transparent 50%, ${faction.color}20 100%)`,
                        boxShadow: `inset 0 0 30px ${faction.color}30`,
                      }}
                    />
                    
                    {/* Content */}
                    <div className="relative z-10 p-6 h-72 flex flex-col justify-end">
                      <div className="flex items-center gap-3 mb-3">
                        <span className="text-5xl drop-shadow-lg">{faction.iconEmoji}</span>
                        <div>
                          <h3 className="text-xl font-bold text-white">{faction.name}</h3>
                          <Badge 
                            variant="outline" 
                            className="mt-1 text-xs uppercase tracking-wider"
                            style={{ borderColor: faction.color, color: faction.color }}
                          >
                            {faction.ideology}
                          </Badge>
                        </div>
                      </div>
                      <p className="text-gray-300 text-sm leading-relaxed">{faction.description}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Faction pledge card */}
            <AnimatePresence>
              {selectedFaction && (
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <Card 
                    className="overflow-hidden border-0"
                    style={{ 
                      background: `linear-gradient(135deg, ${selectedFaction.color}15 0%, rgba(15,23,42,0.95) 50%)`,
                      boxShadow: `0 0 60px ${selectedFaction.color}20`,
                    }}
                  >
                    <CardHeader className="border-b border-white/10">
                      <CardTitle className="flex items-center gap-3 text-2xl">
                        <span className="text-4xl">{selectedFaction.iconEmoji}</span>
                        <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                          Pledge to {selectedFaction.name}
                        </span>
                      </CardTitle>
                      <CardDescription className="text-gray-400">
                        Enter your name to join this faction and begin your journey
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="flex gap-4">
                        <Input
                          placeholder="Enter your character name..."
                          value={characterName}
                          onChange={(e) => setCharacterName(e.target.value)}
                          className="bg-slate-800/50 border-slate-700 focus:border-purple-500 text-lg py-6"
                          data-testid="input-character-name"
                        />
                        <Button
                          size="lg"
                          className="px-8 bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white font-semibold shadow-lg shadow-purple-500/25"
                          disabled={!characterName.trim()}
                          data-testid="button-join-faction"
                        >
                          <Flame className="w-5 h-5 mr-2" />
                          Join Faction
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>
          </TabsContent>

          {/* Quests Tab */}
          <TabsContent value="quests" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {questsData?.quests.map((quest, index) => (
                <motion.div
                  key={quest.id}
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                >
                  <Card
                    className={`cursor-pointer transition-all duration-300 bg-gradient-to-br from-slate-900/90 to-slate-800/90 border-slate-700/50 backdrop-blur-xl hover:border-cyan-500/50 overflow-hidden group ${
                      selectedQuest?.id === quest.id ? "ring-2 ring-cyan-500 ring-offset-2 ring-offset-slate-950" : ""
                    }`}
                    onClick={() => setSelectedQuest(quest)}
                    data-testid={`card-quest-${quest.id}`}
                  >
                    {/* Glow effect on hover */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-cyan-500/10 to-transparent" />
                    
                    <CardHeader className="relative z-10">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-xl ${quest.category === "main_story" ? "bg-purple-500/20" : quest.category === "faction" ? "bg-cyan-500/20" : "bg-pink-500/20"}`}>
                            {quest.category === "main_story" ? (
                              <BookOpen className="w-5 h-5 text-purple-400" />
                            ) : quest.category === "faction" ? (
                              <Shield className="w-5 h-5 text-cyan-400" />
                            ) : (
                              <Scroll className="w-5 h-5 text-pink-400" />
                            )}
                          </div>
                          <CardTitle className="text-lg text-white">{quest.title}</CardTitle>
                        </div>
                        <Badge variant="outline" className={`${getDifficultyColor(quest.difficulty)} uppercase text-xs font-bold`}>
                          {quest.difficulty}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="relative z-10 space-y-4">
                      <p className="text-gray-400 text-sm leading-relaxed">{quest.description}</p>
                      <div className="flex items-center justify-between pt-2 border-t border-slate-700/50">
                        <div className="flex items-center gap-4">
                          <span className="flex items-center gap-1.5 text-yellow-400 font-semibold">
                            <Star className="w-4 h-4" />
                            {quest.shellsReward} Shells
                          </span>
                          <span className="flex items-center gap-1.5 text-cyan-400 font-semibold">
                            <Zap className="w-4 h-4" />
                            {quest.experienceReward} XP
                          </span>
                        </div>
                        <ChevronRight className="w-5 h-5 text-gray-500 group-hover:text-cyan-400 transition-colors" />
                      </div>
                      {quest.prerequisite && (
                        <div className="text-xs text-amber-400/80 flex items-center gap-1">
                          <Shield className="w-3 h-3" />
                          Requires: {questsData?.quests.find(q => q.id === quest.prerequisite)?.title}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          {/* NPCs Tab */}
          <TabsContent value="npcs" className="space-y-8">
            <div className="grid md:grid-cols-3 gap-6">
              {npcsData?.npcs.map((npc, index) => (
                <motion.div
                  key={npc.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                >
                  <Card
                    className={`cursor-pointer transition-all duration-300 bg-gradient-to-br from-slate-900/90 to-slate-800/90 border-slate-700/50 backdrop-blur-xl hover:border-pink-500/50 overflow-hidden group ${
                      selectedNpc?.id === npc.id ? "ring-2 ring-pink-500 ring-offset-2 ring-offset-slate-950" : ""
                    }`}
                    onClick={() => {
                      setSelectedNpc(npc);
                      setConversation([]);
                    }}
                    data-testid={`card-npc-${npc.id}`}
                  >
                    <CardContent className="p-8 text-center relative">
                      {/* Glow effect */}
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-pink-500/10 to-purple-500/10" />
                      
                      <div className="relative z-10">
                        <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-pink-500/30 to-purple-500/30 border-2 border-pink-500/50 flex items-center justify-center shadow-lg shadow-pink-500/20">
                          <User className="w-10 h-10 text-pink-300" />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-1">{npc.name}</h3>
                        <p className="text-pink-400 text-sm font-medium mb-3">{npc.title}</p>
                        <Badge variant="outline" className="text-xs border-slate-600 text-gray-400">
                          <MapPin className="w-3 h-3 mr-1" />
                          {npc.factionId.replace(/_/g, " ")}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* NPC Conversation */}
            <AnimatePresence>
              {selectedNpc && (
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <Card 
                    className="overflow-hidden border-0"
                    style={{ 
                      background: "linear-gradient(135deg, rgba(236,72,153,0.1) 0%, rgba(15,23,42,0.95) 50%)",
                      boxShadow: "0 0 60px rgba(236,72,153,0.15)",
                    }}
                  >
                    <CardHeader className="border-b border-white/10">
                      <CardTitle className="flex items-center gap-3 text-xl">
                        <div className="p-2 rounded-xl bg-pink-500/20">
                          <MessageCircle className="w-5 h-5 text-pink-400" />
                        </div>
                        <span>Speaking with {selectedNpc.name}</span>
                        <Badge className="ml-auto bg-green-500/20 text-green-400 border-green-500/30">
                          <Sparkles className="w-3 h-3 mr-1" />
                          AI Powered
                        </Badge>
                      </CardTitle>
                      <CardDescription className="text-gray-400">
                        Conversations verified by Guardian Security Protocol
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="p-6 space-y-4">
                      <ScrollArea className="h-80 w-full rounded-xl border border-slate-700/50 bg-slate-950/50 p-4">
                        {conversation.length === 0 ? (
                          <div className="h-full flex flex-col items-center justify-center text-center py-12">
                            <div className="w-16 h-16 rounded-full bg-pink-500/10 flex items-center justify-center mb-4">
                              <MessageCircle className="w-8 h-8 text-pink-500/50" />
                            </div>
                            <p className="text-gray-500 mb-2">Start a conversation with {selectedNpc.name}</p>
                            <p className="text-gray-600 text-sm">They may have secrets to share...</p>
                          </div>
                        ) : (
                          <div className="space-y-4">
                            {conversation.map((msg, i) => (
                              <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className={`flex ${msg.role === "player" ? "justify-end" : "justify-start"}`}
                              >
                                <div
                                  className={`max-w-[80%] rounded-2xl p-4 ${
                                    msg.role === "player"
                                      ? "bg-gradient-to-br from-purple-500/30 to-purple-500/10 border border-purple-500/30"
                                      : "bg-gradient-to-br from-pink-500/20 to-pink-500/5 border border-pink-500/30"
                                  }`}
                                >
                                  <div className="text-xs text-gray-500 mb-1 font-medium">
                                    {msg.role === "player" ? "You" : selectedNpc.name}
                                  </div>
                                  <p className="text-gray-200 leading-relaxed">{msg.content}</p>
                                </div>
                              </motion.div>
                            ))}
                            {talkMutation.isPending && (
                              <div className="flex justify-start">
                                <div className="max-w-[80%] rounded-2xl p-4 bg-gradient-to-br from-pink-500/20 to-pink-500/5 border border-pink-500/30">
                                  <div className="flex items-center gap-2 text-gray-400">
                                    <motion.span 
                                      animate={{ opacity: [0.5, 1, 0.5] }}
                                      transition={{ duration: 1.5, repeat: Infinity }}
                                    >
                                      {selectedNpc.name} is thinking...
                                    </motion.span>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </ScrollArea>
                      <div className="flex gap-3">
                        <Input
                          placeholder="What would you like to say..."
                          value={npcMessage}
                          onChange={(e) => setNpcMessage(e.target.value)}
                          onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                          className="bg-slate-800/50 border-slate-700 focus:border-pink-500 text-lg py-6"
                          data-testid="input-npc-message"
                        />
                        <Button
                          size="lg"
                          onClick={handleSendMessage}
                          disabled={!npcMessage.trim() || talkMutation.isPending}
                          className="px-6 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 shadow-lg shadow-pink-500/25"
                          data-testid="button-send-message"
                        >
                          <Send className="w-5 h-5" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>
          </TabsContent>
        </Tabs>

        {/* The Neverending World Section */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16"
        >
          <div className="text-center mb-10">
            <Badge className="mb-4 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border-cyan-500/50">
              <Globe className="w-3 h-3 mr-1" />
              THE NEVERENDING WORLD
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              70+ Eras. Infinite Possibilities.
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Your parallel self journeys across all of human history and beyond. 
              Each era is a living world with unique factions, quests, and legends to forge.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-10">
            <Card className="bg-gradient-to-br from-slate-900/90 to-slate-800/90 border-slate-700/50 backdrop-blur-xl">
              <CardContent className="p-6 text-center">
                <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-purple-500/20 to-purple-500/5 border border-purple-500/30 flex items-center justify-center">
                  <Layers className="w-7 h-7 text-purple-400" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Parallel Self System</h3>
                <p className="text-gray-400 text-sm">
                  YOU are the hero. Not an avatar - your actual parallel self experiencing 
                  history through your choices and values.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-slate-900/90 to-slate-800/90 border-slate-700/50 backdrop-blur-xl">
              <CardContent className="p-6 text-center">
                <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-cyan-500/5 border border-cyan-500/30 flex items-center justify-center">
                  <Compass className="w-7 h-7 text-cyan-400" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Era Hopping</h3>
                <p className="text-gray-400 text-sm">
                  Ancient Egypt to Cyberpunk futures. Viking raids to Wild West frontiers. 
                  Each era unlocks as you progress.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-slate-900/90 to-slate-800/90 border-slate-700/50 backdrop-blur-xl">
              <CardContent className="p-6 text-center">
                <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-pink-500/20 to-pink-500/5 border border-pink-500/30 flex items-center justify-center">
                  <Clock className="w-7 h-7 text-pink-400" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Chronicle Proofs</h3>
                <p className="text-gray-400 text-sm">
                  Every major decision is recorded on-chain as a soulbound NFT. 
                  Your legacy is permanent and verifiable.
                </p>
              </CardContent>
            </Card>
          </div>
        </motion.section>

        {/* Business Storefronts Section */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16"
        >
          <Card className="overflow-hidden border-0 bg-gradient-to-br from-amber-500/10 via-slate-900/95 to-slate-900/95">
            <CardContent className="p-8 md:p-12">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div>
                  <Badge className="mb-4 bg-amber-500/20 border-amber-500/50 text-amber-400">
                    <Building className="w-3 h-3 mr-1" />
                    EARLY ADOPTER PROGRAM
                  </Badge>
                  <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                    Real Business Storefronts
                  </h2>
                  <p className="text-gray-400 mb-6 leading-relaxed">
                    Be among the first businesses to claim your virtual storefront in the Chronicles universe. 
                    Your real-world brand becomes part of the game world - a tavern, a trading post, 
                    a guild hall bearing your name across 70+ historical eras.
                  </p>
                  <ul className="space-y-3 text-sm">
                    <li className="flex items-center gap-3 text-gray-300">
                      <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center">
                        <Star className="w-3 h-3 text-green-400" />
                      </div>
                      Permanent in-game real estate across all eras
                    </li>
                    <li className="flex items-center gap-3 text-gray-300">
                      <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center">
                        <Star className="w-3 h-3 text-green-400" />
                      </div>
                      Brand integration verified on blockchain
                    </li>
                    <li className="flex items-center gap-3 text-gray-300">
                      <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center">
                        <Star className="w-3 h-3 text-green-400" />
                      </div>
                      Player traffic and engagement analytics
                    </li>
                    <li className="flex items-center gap-3 text-gray-300">
                      <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center">
                        <Star className="w-3 h-3 text-green-400" />
                      </div>
                      Limited founding partner slots available
                    </li>
                  </ul>
                </div>
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-amber-500/20 to-transparent rounded-3xl blur-3xl" />
                  <div className="relative bg-gradient-to-br from-slate-800/80 to-slate-900/80 rounded-2xl border border-amber-500/30 p-8 text-center">
                    <Store className="w-16 h-16 mx-auto mb-4 text-amber-400" />
                    <h3 className="text-2xl font-bold text-white mb-2">Claim Your Storefront</h3>
                    <p className="text-gray-400 text-sm mb-6">
                      Early adopters receive priority placement and exclusive founding partner benefits.
                    </p>
                    <Button 
                      size="lg"
                      className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-black font-bold"
                      data-testid="button-claim-storefront"
                    >
                      <Building className="w-5 h-5 mr-2" />
                      Apply for Early Access
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.section>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-16 text-center"
        >
          <Separator className="my-8 bg-gradient-to-r from-transparent via-purple-500/30 to-transparent" />
          <div className="flex items-center justify-center gap-2 mb-4">
            <Badge variant="outline" className="border-amber-500/50 text-amber-400 animate-pulse">
              BETA v0.1
            </Badge>
          </div>
          <p className="text-gray-500 text-sm">
            Season Zero runs until <span className="text-purple-400 font-medium">April 11, 2026</span>. 
            All decisions are recorded on-chain as Chronicle Proofs.
          </p>
          <div className="flex items-center justify-center gap-2 mt-2 text-xs text-gray-600">
            <Shield className="w-3 h-3" />
            Guardian-verified execution
          </div>
        </motion.div>
      </div>
    </div>
  );
}
