import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Crown, Sword, Users, MessageCircle, Star, Shield, Scroll, Sparkles, BookOpen, Trophy, Target, ChevronRight, Send, User, MapPin } from "lucide-react";

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
  const [character, setCharacter] = useState<any>(null);

  const queryClient = useQueryClient();

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
        setConversation(prev => [
          ...prev,
          { role: "npc", content: data.response }
        ]);
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
      case "easy": return "text-green-400";
      case "medium": return "text-yellow-400";
      case "hard": return "text-orange-400";
      case "legendary": return "text-purple-400";
      default: return "text-gray-400";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5" />
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />

      <div className="relative z-10 container mx-auto px-4 py-8 max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <Badge className="mb-4 bg-gradient-to-r from-purple-500/20 to-cyan-500/20 border-purple-500/50" data-testid="badge-season-zero">
            <Sparkles className="w-3 h-3 mr-1" />
            Season Zero Demo
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
            DarkWave Chronicles
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Enter the Age of Crowns. Choose your faction, complete quests, and forge your legacy
            in this living political simulation.
          </p>
        </motion.div>

        {season && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-8"
          >
            <Card className="bg-gradient-to-r from-slate-900/90 to-slate-800/90 border-purple-500/30 backdrop-blur-xl" data-testid="card-season-info">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center">
                      <Crown className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-white">{season.name}</h2>
                      <p className="text-gray-400">{season.description}</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-4">
                    <div className="text-center px-4 py-2 rounded-lg bg-slate-800/50 border border-purple-500/20">
                      <div className="text-2xl font-bold text-purple-400">{season.questsAvailable}</div>
                      <div className="text-xs text-gray-500">Quests</div>
                    </div>
                    <div className="text-center px-4 py-2 rounded-lg bg-slate-800/50 border border-cyan-500/20">
                      <div className="text-2xl font-bold text-cyan-400">{parseInt(season.totalShellsPool).toLocaleString()}</div>
                      <div className="text-xs text-gray-500">Shells Pool</div>
                    </div>
                    <div className="text-center px-4 py-2 rounded-lg bg-slate-800/50 border border-pink-500/20">
                      <div className="text-2xl font-bold text-pink-400">{parseInt(season.totalDwcPool).toLocaleString()}</div>
                      <div className="text-xs text-gray-500">DWC Pool</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        <Tabs defaultValue="factions" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-slate-900/50 border border-slate-700">
            <TabsTrigger value="factions" className="data-[state=active]:bg-purple-500/20" data-testid="tab-factions">
              <Users className="w-4 h-4 mr-2" />
              Factions
            </TabsTrigger>
            <TabsTrigger value="quests" className="data-[state=active]:bg-cyan-500/20" data-testid="tab-quests">
              <Target className="w-4 h-4 mr-2" />
              Quests
            </TabsTrigger>
            <TabsTrigger value="npcs" className="data-[state=active]:bg-pink-500/20" data-testid="tab-npcs">
              <MessageCircle className="w-4 h-4 mr-2" />
              NPCs
            </TabsTrigger>
          </TabsList>

          <TabsContent value="factions" className="space-y-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {factionsData?.factions.map((faction, index) => (
                <motion.div
                  key={faction.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card
                    className={`cursor-pointer transition-all duration-300 hover:scale-105 bg-slate-900/80 border-slate-700 hover:border-opacity-50 ${
                      selectedFaction?.id === faction.id ? "ring-2 ring-offset-2 ring-offset-slate-950" : ""
                    }`}
                    style={{
                      borderColor: selectedFaction?.id === faction.id ? faction.color : undefined,
                      boxShadow: selectedFaction?.id === faction.id ? `0 0 20px ${faction.color}40` : undefined,
                    }}
                    onClick={() => setSelectedFaction(faction)}
                    data-testid={`card-faction-${faction.id}`}
                  >
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        <span className="text-4xl">{faction.iconEmoji}</span>
                        <div>
                          <CardTitle className="text-lg text-white">{faction.name}</CardTitle>
                          <Badge variant="outline" className="mt-1 text-xs" style={{ borderColor: faction.color, color: faction.color }}>
                            {faction.ideology.toUpperCase()}
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-400 text-sm">{faction.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {selectedFaction && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Card className="bg-gradient-to-br from-slate-900/90 to-slate-800/90 border-slate-700" style={{ borderColor: selectedFaction.color }}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <span className="text-3xl">{selectedFaction.iconEmoji}</span>
                      Pledge to {selectedFaction.name}
                    </CardTitle>
                    <CardDescription>Enter your character name to join this faction</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex gap-4">
                      <Input
                        placeholder="Enter your character name..."
                        value={characterName}
                        onChange={(e) => setCharacterName(e.target.value)}
                        className="bg-slate-800 border-slate-700"
                        data-testid="input-character-name"
                      />
                      <Button
                        className="bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600"
                        disabled={!characterName.trim()}
                        data-testid="button-join-faction"
                      >
                        <Shield className="w-4 h-4 mr-2" />
                        Join Faction
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </TabsContent>

          <TabsContent value="quests" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              {questsData?.quests.map((quest, index) => (
                <motion.div
                  key={quest.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card
                    className={`cursor-pointer transition-all duration-300 bg-slate-900/80 border-slate-700 hover:border-purple-500/50 ${
                      selectedQuest?.id === quest.id ? "ring-2 ring-purple-500 ring-offset-2 ring-offset-slate-950" : ""
                    }`}
                    onClick={() => setSelectedQuest(quest)}
                    data-testid={`card-quest-${quest.id}`}
                  >
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {quest.category === "main_story" ? (
                            <BookOpen className="w-5 h-5 text-purple-400" />
                          ) : quest.category === "faction" ? (
                            <Shield className="w-5 h-5 text-cyan-400" />
                          ) : (
                            <Scroll className="w-5 h-5 text-pink-400" />
                          )}
                          <CardTitle className="text-lg text-white">{quest.title}</CardTitle>
                        </div>
                        <Badge className={getDifficultyColor(quest.difficulty)}>
                          {quest.difficulty.toUpperCase()}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-gray-400 text-sm">{quest.description}</p>
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-4">
                          <span className="flex items-center gap-1 text-yellow-400">
                            <Star className="w-4 h-4" />
                            {quest.shellsReward} Shells
                          </span>
                          <span className="flex items-center gap-1 text-cyan-400">
                            <Trophy className="w-4 h-4" />
                            {quest.experienceReward} XP
                          </span>
                        </div>
                        <ChevronRight className="w-5 h-5 text-gray-500" />
                      </div>
                      {quest.prerequisite && (
                        <div className="text-xs text-gray-500">
                          Requires: Complete "{questsData?.quests.find(q => q.id === quest.prerequisite)?.title}"
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="npcs" className="space-y-6">
            <div className="grid md:grid-cols-3 gap-4">
              {npcsData?.npcs.map((npc, index) => (
                <motion.div
                  key={npc.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card
                    className={`cursor-pointer transition-all duration-300 bg-slate-900/80 border-slate-700 hover:border-pink-500/50 ${
                      selectedNpc?.id === npc.id ? "ring-2 ring-pink-500 ring-offset-2 ring-offset-slate-950" : ""
                    }`}
                    onClick={() => {
                      setSelectedNpc(npc);
                      setConversation([]);
                    }}
                    data-testid={`card-npc-${npc.id}`}
                  >
                    <CardContent className="p-6 text-center">
                      <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-pink-500/20 to-purple-500/20 border border-pink-500/30 flex items-center justify-center">
                        <User className="w-8 h-8 text-pink-400" />
                      </div>
                      <h3 className="text-lg font-semibold text-white">{npc.name}</h3>
                      <p className="text-gray-400 text-sm">{npc.title}</p>
                      <Badge variant="outline" className="mt-2 text-xs border-slate-600">
                        <MapPin className="w-3 h-3 mr-1" />
                        {npc.factionId.replace(/_/g, " ")}
                      </Badge>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {selectedNpc && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Card className="bg-gradient-to-br from-slate-900/90 to-slate-800/90 border-pink-500/30">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MessageCircle className="w-5 h-5 text-pink-400" />
                      Speaking with {selectedNpc.name}
                    </CardTitle>
                    <CardDescription>This conversation is powered by AI with Guardian-verified execution</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <ScrollArea className="h-64 w-full rounded-lg border border-slate-700 bg-slate-950/50 p-4">
                      {conversation.length === 0 ? (
                        <div className="text-center text-gray-500 py-8">
                          <MessageCircle className="w-12 h-12 mx-auto mb-3 opacity-50" />
                          <p>Start a conversation with {selectedNpc.name}</p>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {conversation.map((msg, i) => (
                            <div
                              key={i}
                              className={`flex ${msg.role === "player" ? "justify-end" : "justify-start"}`}
                            >
                              <div
                                className={`max-w-[80%] rounded-lg p-3 ${
                                  msg.role === "player"
                                    ? "bg-purple-500/20 border border-purple-500/30"
                                    : "bg-pink-500/10 border border-pink-500/30"
                                }`}
                              >
                                <div className="text-xs text-gray-500 mb-1">
                                  {msg.role === "player" ? "You" : selectedNpc.name}
                                </div>
                                <p className="text-sm text-gray-200">{msg.content}</p>
                              </div>
                            </div>
                          ))}
                          {talkMutation.isPending && (
                            <div className="flex justify-start">
                              <div className="max-w-[80%] rounded-lg p-3 bg-pink-500/10 border border-pink-500/30">
                                <div className="flex items-center gap-2 text-gray-400">
                                  <span className="animate-pulse">Thinking...</span>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </ScrollArea>
                    <div className="flex gap-2">
                      <Input
                        placeholder="What would you like to say..."
                        value={npcMessage}
                        onChange={(e) => setNpcMessage(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                        className="bg-slate-800 border-slate-700"
                        data-testid="input-npc-message"
                      />
                      <Button
                        onClick={handleSendMessage}
                        disabled={!npcMessage.trim() || talkMutation.isPending}
                        className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600"
                        data-testid="button-send-message"
                      >
                        <Send className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <Shield className="w-3 h-3" />
                      AI responses verified by Guardian Security Protocol
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </TabsContent>
        </Tabs>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-12 text-center"
        >
          <Separator className="my-8 bg-gradient-to-r from-transparent via-purple-500/50 to-transparent" />
          <p className="text-gray-500 text-sm">
            Season Zero runs until February 14, 2026. All decisions are recorded on-chain as Chronicle Proofs.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
