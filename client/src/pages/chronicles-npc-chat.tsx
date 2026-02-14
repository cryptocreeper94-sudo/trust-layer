import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { GlassCard } from "@/components/glass-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Link } from "wouter";
import { getChroniclesSession } from "./chronicles-login";
import { ArrowLeft, Send, MessageCircle, Heart, Users, Shield, Crown, Sparkles, Loader2, ChevronRight, Star, Swords, Eye } from "lucide-react";

const ERA_CONFIG: Record<string, { name: string; emoji: string; textColor: string; borderColor: string; bgGradient: string }> = {
  modern: { name: "Modern Era", emoji: "🏙️", textColor: "text-cyan-400", borderColor: "border-cyan-500/30", bgGradient: "from-cyan-500/20 to-blue-600/20" },
  medieval: { name: "Medieval Era", emoji: "🏰", textColor: "text-amber-400", borderColor: "border-amber-500/30", bgGradient: "from-amber-500/20 to-orange-600/20" },
  wildwest: { name: "Wild West", emoji: "🤠", textColor: "text-yellow-400", borderColor: "border-yellow-500/30", bgGradient: "from-yellow-500/20 to-orange-600/20" },
};

const NPC_DATA: Record<string, { emoji: string; color: string; faction: string }> = {
  "Lord Aldric": { emoji: "👑", color: "from-yellow-600 to-amber-700", faction: "House of Crowns" },
  "Sera Nightwhisper": { emoji: "🗝️", color: "from-gray-600 to-slate-700", faction: "Shadow Council" },
  "Marcus Goldhand": { emoji: "⚖️", color: "from-green-600 to-emerald-700", faction: "Merchant's Guild" },
  "Dr. Elena Voss": { emoji: "🏢", color: "from-cyan-600 to-blue-700", faction: "Nexus Corporation" },
  "Kai 'Ghost' Reeves": { emoji: "📡", color: "from-red-600 to-rose-700", faction: "Signal Underground" },
  "Mayor Diana Reyes": { emoji: "🤝", color: "from-purple-600 to-violet-700", faction: "Civic Alliance" },
  "Marshal Jake Colton": { emoji: "⭐", color: "from-gray-500 to-zinc-600", faction: "The Iron Star" },
  "Rattlesnake Rosa": { emoji: "🤠", color: "from-stone-600 to-stone-800", faction: "Black Canyon Gang" },
  "Chief Running Bear": { emoji: "🦅", color: "from-red-700 to-orange-800", faction: "First Nations" },
};

const ERA_NPCS: Record<string, string[]> = {
  medieval: ["Lord Aldric", "Sera Nightwhisper", "Marcus Goldhand"],
  modern: ["Dr. Elena Voss", "Kai 'Ghost' Reeves", "Mayor Diana Reyes"],
  wildwest: ["Marshal Jake Colton", "Rattlesnake Rosa", "Chief Running Bear"],
};

function getRelationshipLabel(score: number): { label: string; color: string; glow: string } {
  if (score <= -11) return { label: "Hostile", color: "text-red-400", glow: "shadow-red-500/30" };
  if (score <= -1) return { label: "Distrusted", color: "text-orange-400", glow: "" };
  if (score === 0) return { label: "Neutral", color: "text-gray-400", glow: "" };
  if (score <= 10) return { label: "Friendly", color: "text-green-400", glow: "" };
  return { label: "Devoted Ally", color: "text-cyan-400", glow: "shadow-cyan-500/30" };
}

function getRelBarColor(score: number): string {
  if (score <= -11) return "bg-red-500";
  if (score <= -1) return "bg-orange-500";
  if (score === 0) return "bg-gray-500";
  if (score <= 10) return "bg-green-500";
  return "bg-cyan-400";
}


const GlowOrb = ({ color, size, top, left, delay = 0 }: { color: string; size: number; top: string; left: string; delay?: number }) => (
  <motion.div
    className="absolute rounded-full blur-3xl opacity-20 pointer-events-none"
    style={{ background: color, width: size, height: size, top, left }}
    animate={{ scale: [1, 1.2, 1], opacity: [0.15, 0.25, 0.15] }}
    transition={{ duration: 8, repeat: Infinity, delay }}
  />
);

function getHeaders(): Record<string, string> {
  const session = getChroniclesSession();
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (session?.token) headers["Authorization"] = `Bearer ${session.token}`;
  return headers;
}

function RelationshipBar({ score }: { score: number }) {
  const pct = ((score + 20) / 40) * 100;
  const rel = getRelationshipLabel(score);
  return (
    <div className="w-full" data-testid="relationship-bar">
      <div className="flex justify-between text-[10px] mb-1">
        <span className={rel.color}>{rel.label}</span>
        <span className="text-gray-500">{score > 0 ? `+${score}` : score}</span>
      </div>
      <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
        <motion.div
          className={`h-full rounded-full ${getRelBarColor(score)}`}
          initial={{ width: 0 }}
          animate={{ width: `${Math.max(2, pct)}%` }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}

function NpcCard({
  name,
  era,
  selected,
  relationship,
  lastMessage,
  onSelect,
  index,
}: {
  name: string;
  era: string;
  selected: boolean;
  relationship: number;
  lastMessage?: string;
  onSelect: () => void;
  index: number;
}) {
  const npc = NPC_DATA[name];
  if (!npc) return null;
  const eraConfig = ERA_CONFIG[era];

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.08 }}
    >
      <button
        onClick={onSelect}
        className={`w-full text-left rounded-xl transition-all min-h-[52px] ${
          selected
            ? `ring-2 ring-cyan-400/60 shadow-[0_0_20px_rgba(0,255,255,0.15)]`
            : "hover:bg-white/5"
        }`}
        data-testid={`npc-card-${name.replace(/\s+/g, "-").toLowerCase()}`}
      >
        <GlassCard glow={selected} hover={false} className="p-3 sm:p-4">
          <div className="flex items-center gap-3">
            <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${npc.color} flex items-center justify-center text-xl flex-shrink-0`}>
              {npc.emoji}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-white truncate">{name}</span>
              </div>
              <Badge className={`text-[9px] px-1.5 py-0 mt-0.5 bg-white/5 ${eraConfig?.textColor || "text-gray-400"}`}>
                {npc.faction}
              </Badge>
            </div>
          </div>
          <div className="mt-2.5">
            <RelationshipBar score={relationship} />
          </div>
          {lastMessage && (
            <p className="text-[10px] text-gray-500 mt-2 truncate">{lastMessage}</p>
          )}
</button>
    </motion.div>
  );
}

function TypingIndicator() {
  return (
    <div className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-white/5 w-fit" data-testid="typing-indicator">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="w-2 h-2 rounded-full bg-gray-400"
          animate={{ opacity: [0.3, 1, 0.3], y: [0, -4, 0] }}
          transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
        />
      ))}
    </div>
  );
}

function MessageBubble({ msg, npcName, index }: { msg: any; npcName: string; index: number }) {
  const isPlayer = msg.role === "player" || msg.sender === "player";
  const npc = NPC_DATA[npcName];
  const time = msg.timestamp ? new Date(msg.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "";

  return (
    <motion.div
      initial={{ opacity: 0, y: 12, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: index * 0.04, duration: 0.3 }}
      className={`flex gap-2.5 ${isPlayer ? "justify-end" : "justify-start"}`}
      data-testid={`message-${index}`}
    >
      {!isPlayer && npc && (
        <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${npc.color} flex items-center justify-center text-sm flex-shrink-0 mt-1`}>
          {npc.emoji}
        </div>
      )}
      <div className={`max-w-[80%] ${isPlayer ? "order-first" : ""}`}>
        <div
          className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
            isPlayer
              ? "bg-gradient-to-br from-cyan-600/30 to-blue-700/30 border border-cyan-500/20 text-white rounded-br-md"
              : "bg-white/5 border border-white/5 text-gray-200 rounded-bl-md"
          }`}
        >
          {msg.content || msg.message}
        </div>
        {time && (
          <p className={`text-[9px] text-gray-600 mt-1 ${isPlayer ? "text-right" : "text-left"}`}>{time}</p>
        )}
    </motion.div>
  );
}

export default function ChroniclesNpcChat() {
  const [selectedEra, setSelectedEra] = useState<string>("medieval");
  const [selectedNpc, setSelectedNpc] = useState<string | null>(null);
  const [messageInput, setMessageInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const npcsForEra = ERA_NPCS[selectedEra] || [];
  const eraConfig = ERA_CONFIG[selectedEra];

  const { data: relationships } = useQuery({
    queryKey: ["npc-relationships", selectedEra],
    queryFn: async () => {
      const res = await fetch(`/api/chronicles/npc/relationships/${selectedEra}`, { headers: getHeaders() });
      if (!res.ok) return {};
      return res.json();
    },
    refetchInterval: 30000,
  });

  const { data: conversations } = useQuery({
    queryKey: ["npc-conversations", selectedEra],
    queryFn: async () => {
      const res = await fetch(`/api/chronicles/npc/conversations/${selectedEra}`, { headers: getHeaders() });
      if (!res.ok) return [];
      return res.json();
    },
  });

  const { data: messages, isLoading: loadingMessages } = useQuery({
    queryKey: ["npc-messages", selectedNpc, selectedEra],
    queryFn: async () => {
      if (!selectedNpc) return [];
      const res = await fetch(`/api/chronicles/npc/messages/${encodeURIComponent(selectedNpc)}/${selectedEra}`, { headers: getHeaders() });
      if (!res.ok) return [];
      return res.json();
    },
    enabled: !!selectedNpc,
  });

  const sendMutation = useMutation({
    mutationFn: async (message: string) => {
      const res = await fetch("/api/chronicles/npc/send", {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({ npcName: selectedNpc, era: selectedEra, message }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({ message: "Failed to send" }));
        throw new Error(err.message || "Failed to send message");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["npc-messages", selectedNpc, selectedEra] });
      queryClient.invalidateQueries({ queryKey: ["npc-relationships", selectedEra] });
      queryClient.invalidateQueries({ queryKey: ["npc-conversations", selectedEra] });
    },
    onError: (err: Error) => {
      toast({ title: "Message Failed", description: err.message, variant: "destructive" });
    },
  });

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, sendMutation.isPending]);

  const handleSend = async () => {
    if (!messageInput.trim() || !selectedNpc || sendMutation.isPending) return;
    const msg = messageInput.trim();
    setMessageInput("");
    sendMutation.mutate(msg);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const npcRelScore = (name: string): number => {
    if (!relationships) return 0;
    if (typeof relationships === "object" && relationships[name] !== undefined) return Number(relationships[name]);
    if (Array.isArray(relationships)) {
      const found = relationships.find((r: any) => r.npcName === name || r.name === name);
      if (found) return Number(found.score ?? found.relationship ?? 0);
    }
    return 0;
  };

  const getLastMsg = (name: string): string | undefined => {
    if (!conversations) return undefined;
    if (Array.isArray(conversations)) {
      const conv = conversations.find((c: any) => c.npcName === name || c.name === name);
      return conv?.lastMessage || conv?.preview;
    }
    return undefined;
  };

  const selectedNpcData = selectedNpc ? NPC_DATA[selectedNpc] : null;
  const selectedScore = selectedNpc ? npcRelScore(selectedNpc) : 0;
  const selectedRel = getRelationshipLabel(selectedScore);
  const messageList = Array.isArray(messages) ? messages : [];

  return (
    <div className="min-h-screen bg-slate-950 pt-20 pb-12" data-testid="npc-chat-page">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4 mb-8"
        >
          <Link href="/chronicles">
            <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white min-h-[44px] min-w-[44px]" data-testid="back-btn">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent" data-testid="page-title">
              NPC Conversations
            </h1>
            <p className="text-sm text-gray-500 mt-0.5">Talk to the characters who shape your world</p>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-1 space-y-4"
          >
            <GlassCard glow className="p-4 sm:p-6">
              <div className="flex gap-2 mb-5 flex-wrap" data-testid="era-selector">
                {Object.entries(ERA_CONFIG).map(([key, cfg]) => (
                  <button
                    key={key}
                    onClick={() => { setSelectedEra(key); setSelectedNpc(null); }}
                    className={`px-3.5 py-2 rounded-xl text-xs font-medium transition-all min-h-[44px] flex items-center gap-1.5 ${
                      selectedEra === key
                        ? `bg-gradient-to-r ${cfg.bgGradient} ${cfg.textColor} border ${cfg.borderColor}`
                        : "bg-white/5 text-gray-400 hover:bg-white/10 border border-transparent"
                    }`}
                    data-testid={`era-pill-${key}`}
                  >
                    <span>{cfg.emoji}</span>
                    <span className="hidden sm:inline">{cfg.name}</span>
                  </button>
                ))}
              </div>

              <div className="space-y-3">
                {npcsForEra.map((name, i) => (
                  <NpcCard
                    key={name}
                    name={name}
                    era={selectedEra}
                    selected={selectedNpc === name}
                    relationship={npcRelScore(name)}
                    lastMessage={getLastMsg(name)}
                    onSelect={() => setSelectedNpc(name)}
                    index={i}
                  />
                ))}
              </div>
</motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2"
          >
            <AnimatePresence mode="wait">
              {selectedNpc && selectedNpcData ? (
                <motion.div
                  key={selectedNpc}
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  className="flex flex-col h-[calc(100vh-200px)] min-h-[500px]"
                >
                  <GlassCard glow className="p-4 sm:p-5 mb-4">
                    <div className="flex items-center gap-4">
                      <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${selectedNpcData.color} flex items-center justify-center text-2xl flex-shrink-0`}>
                        {selectedNpcData.emoji}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h2 className="text-lg font-bold text-white" data-testid="chat-npc-name">{selectedNpc}</h2>
                        <div className="flex items-center gap-2 flex-wrap mt-1">
                          <Badge className={`text-[10px] bg-white/5 ${eraConfig.textColor}`} data-testid="chat-npc-faction">
                            {selectedNpcData.faction}
                          </Badge>
                          <Badge className={`text-[10px] ${selectedRel.color} bg-white/5`} data-testid="chat-rel-label">
                            <Heart className="w-3 h-3 mr-1" />
                            {selectedRel.label} ({selectedScore > 0 ? `+${selectedScore}` : selectedScore})
                          </Badge>
                        </div>
                      </div>
                      <div className="hidden sm:flex gap-1.5 flex-wrap">
                        {["Diplomatic", "Cunning"].map((trait) => (
                          <Badge key={trait} className="text-[9px] bg-white/5 text-gray-500">
                            {trait}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div className="mt-3">
                      <RelationshipBar score={selectedScore} />
                    </div>
<GlassCard glow className="flex-1 flex flex-col overflow-hidden">
                    <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4" data-testid="message-area">
                      {loadingMessages ? (
                        <div className="flex items-center justify-center py-12">
                          <Loader2 className="w-6 h-6 text-cyan-400 animate-spin" />
                        </div>
                      ) : messageList.length === 0 ? (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="text-center py-16"
                        >
                          <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${selectedNpcData.color} flex items-center justify-center text-4xl mx-auto mb-4`}>
                            {selectedNpcData.emoji}
                          </div>
                          <p className="text-gray-400 text-sm">Begin your conversation with {selectedNpc}</p>
                          <p className="text-gray-600 text-xs mt-1">Your words will shape this relationship</p>
                        </motion.div>
                      ) : (
                        messageList.map((msg: any, i: number) => (
                          <MessageBubble key={i} msg={msg} npcName={selectedNpc} index={i} />
                        ))
                      )}
                      {sendMutation.isPending && <TypingIndicator />}
                      <div ref={messagesEndRef} />
                    </div>

                    <div className="p-4 sm:p-5 border-t border-white/5">
                      <div className="flex gap-2 items-end">
                        <div className="flex-1 relative">
                          <input
                            ref={inputRef}
                            type="text"
                            value={messageInput}
                            onChange={(e) => setMessageInput(e.target.value.slice(0, 500))}
                            onKeyDown={handleKeyDown}
                            placeholder={`Say something to ${selectedNpc}...`}
                            disabled={sendMutation.isPending}
                            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-cyan-500/40 focus:ring-1 focus:ring-cyan-500/20 backdrop-blur-xl min-h-[44px] disabled:opacity-50"
                            data-testid="message-input"
                          />
                          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-gray-600">
                            {messageInput.length}/500
                          </span>
                        </div>
                        <Button
                          onClick={handleSend}
                          disabled={!messageInput.trim() || sendMutation.isPending}
                          className="bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 text-white rounded-xl min-h-[44px] min-w-[44px] px-4"
                          data-testid="send-btn"
                        >
                          {sendMutation.isPending ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Send className="w-4 h-4" />
                          )}
                        </Button>
                      </div>
                      <div className="flex items-center gap-1.5 mt-2">
                        <Sparkles className="w-3 h-3 text-purple-500/50" />
                        <span className="text-[10px] text-gray-600">AI-powered conversation</span>
                      </div>
                    </div>
</motion.div>
              ) : (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <GlassCard glow className="p-8 sm:p-12">
                    <div className="text-center py-12">
                      <div className={`w-24 h-24 rounded-3xl bg-gradient-to-br ${eraConfig.bgGradient} flex items-center justify-center text-5xl mx-auto mb-6 border ${eraConfig.borderColor}`}>
                        <MessageCircle className={`w-10 h-10 ${eraConfig.textColor}`} />
                      </div>
                      <h2 className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent mb-3" data-testid="empty-state-title">
                        Select an NPC to Begin
                      </h2>
                      <p className="text-gray-500 text-sm max-w-md mx-auto leading-relaxed">
                        Choose a character from the {eraConfig.name} to start a conversation. 
                        Your choices and words will influence your relationship and unlock new storylines.
                      </p>
                      <div className="flex justify-center gap-4 mt-8">
                        {npcsForEra.map((name) => {
                          const npc = NPC_DATA[name];
                          return (
                            <motion.button
                              key={name}
                              whileHover={{ scale: 1.1, y: -4 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => setSelectedNpc(name)}
                              className={`w-14 h-14 rounded-xl bg-gradient-to-br ${npc.color} flex items-center justify-center text-xl cursor-pointer border border-white/10 hover:border-white/30 transition-colors`}
                              data-testid={`empty-npc-${name.replace(/\s+/g, "-").toLowerCase()}`}
                            >
                              {npc.emoji}
                            </motion.button>
                          );
                        })}
                      </div>
                      <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-lg mx-auto">
                        <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                          <Users className="w-5 h-5 text-cyan-400 mx-auto mb-1.5" />
                          <p className="text-[10px] text-gray-500">Build Relationships</p>
                        </div>
                        <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                          <Star className="w-5 h-5 text-yellow-400 mx-auto mb-1.5" />
                          <p className="text-[10px] text-gray-500">Unlock Secrets</p>
                        <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                          <Crown className="w-5 h-5 text-purple-400 mx-auto mb-1.5" />
                          <p className="text-[10px] text-gray-500">Shape Your Story</p>
)}
            </AnimatePresence>
    </div>
    </div>
    </div>
  );
}
