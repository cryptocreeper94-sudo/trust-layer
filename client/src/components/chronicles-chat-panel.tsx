import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getChroniclesSession } from "@/pages/chronicles-login";
import {
  MessageCircle, Send, Hash, Mic, MicOff, Volume2,
  ChevronDown, ChevronUp, X, Users, Loader2, Radio,
  Play, Square, Waves, Coins,
} from "lucide-react";

interface ChatChannel {
  id: string;
  name: string;
  description: string;
  era: string;
  isVoice: boolean;
}

interface ChatMessage {
  id: string;
  channelId: string;
  content: string;
  createdAt: string;
  username: string;
  displayName: string;
  avatarColor: string;
}

interface ChatUser {
  id: string;
  username: string;
  displayName: string;
  avatarColor: string;
}

const ERA_CHANNEL_CONFIG: Record<string, { emoji: string; label: string; color: string; border: string }> = {
  modern: { emoji: "🏙️", label: "Modern", color: "text-cyan-400", border: "border-cyan-500/30" },
  medieval: { emoji: "🏰", label: "Medieval", color: "text-amber-400", border: "border-amber-500/30" },
  wildwest: { emoji: "🤠", label: "Wild West", color: "text-yellow-400", border: "border-yellow-500/30" },
  general: { emoji: "🌍", label: "All Eras", color: "text-purple-400", border: "border-purple-500/30" },
  voice: { emoji: "🎤", label: "Voice", color: "text-pink-400", border: "border-pink-500/30" },
};

function UserAvatar({ username, color, size = "sm" }: { username: string; color: string; size?: "sm" | "md" }) {
  const sizes = { sm: "w-6 h-6 text-[10px]", md: "w-8 h-8 text-xs" };
  return (
    <div
      className={`${sizes[size]} rounded-full flex items-center justify-center font-bold text-white shrink-0`}
      style={{ backgroundColor: color }}
    >
      {username.charAt(0).toUpperCase()}
    </div>
  );
}

function VoiceMessagePlayer({ content, isOwn }: { content: string; isOwn: boolean }) {
  const [playing, setPlaying] = useState(false);
  const duration = content.match(/\[Voice (\d+)s\]/)?.[1] || "5";

  return (
    <div className={`flex items-center gap-2 px-3 py-2 rounded-xl ${
      isOwn ? "bg-pink-500/20 rounded-tr-sm" : "bg-pink-500/10 rounded-tl-sm"
    }`}>
      <button
        onClick={() => setPlaying(!playing)}
        className="w-7 h-7 rounded-full bg-pink-500/30 flex items-center justify-center text-pink-400 hover:bg-pink-500/40 transition-all"
      >
        {playing ? <Square className="w-3 h-3" /> : <Play className="w-3 h-3 ml-0.5" />}
      </button>
      <div className="flex-1 flex items-center gap-[2px] h-4">
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className={`w-[3px] rounded-full transition-all ${
              playing && i < 10 ? "bg-pink-400" : "bg-pink-400/30"
            }`}
            style={{ height: `${Math.random() * 12 + 4}px` }}
          />
        ))}
      </div>
      <span className="text-[10px] text-pink-400/70">{duration}s</span>
      <Mic className="w-3 h-3 text-pink-400/50" />
    </div>
  );
}

function MessageBubble({ msg, isOwn }: { msg: ChatMessage; isOwn: boolean }) {
  const time = new Date(msg.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  const isVoiceMsg = msg.content.startsWith("[Voice");

  return (
    <div className={`flex gap-2 ${isOwn ? "flex-row-reverse" : ""}`} data-testid={`chat-msg-${msg.id}`}>
      <UserAvatar username={msg.displayName || msg.username} color={msg.avatarColor} />
      <div className={`max-w-[75%] ${isOwn ? "text-right" : ""}`}>
        <div className="flex items-center gap-1.5 mb-0.5">
          <span className={`text-[10px] font-medium ${isOwn ? "text-cyan-400" : "text-gray-400"}`}>
            {msg.displayName || msg.username}
          </span>
          <span className="text-[9px] text-gray-600">{time}</span>
        </div>
        {isVoiceMsg ? (
          <VoiceMessagePlayer content={msg.content} isOwn={isOwn} />
        ) : (
          <div
            className={`px-3 py-1.5 rounded-xl text-sm leading-relaxed ${
              isOwn
                ? "bg-cyan-500/20 text-cyan-100 rounded-tr-sm"
                : "bg-white/5 text-gray-300 rounded-tl-sm"
            }`}
          >
            {msg.content}
          </div>
        )}
      </div>
    </div>
  );
}

export function ChroniclesChatPanel({ currentEra }: { currentEra: string }) {
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);
  const [activeChannelId, setActiveChannelId] = useState<string | null>(null);
  const [input, setInput] = useState("");
  const [chatUser, setChatUser] = useState<ChatUser | null>(null);
  const [chatToken, setChatToken] = useState<string | null>(null);
  const [isLinking, setIsLinking] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isVoiceRecording, setIsVoiceRecording] = useState(false);
  const [voiceRecordTime, setVoiceRecordTime] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const voiceTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);

  const getAuthHeaders = (): Record<string, string> => {
    const session = getChroniclesSession();
    if (session?.token) return { Authorization: `Bearer ${session.token}`, "Content-Type": "application/json" };
    return { "Content-Type": "application/json" };
  };

  const linkChat = useCallback(async () => {
    setIsLinking(true);
    try {
      const res = await fetch("/api/chronicles/chat/link", {
        method: "POST",
        headers: getAuthHeaders(),
      });
      const data = await res.json();
      if (data.success) {
        setChatUser(data.chatUser);
        setChatToken(data.chatToken);
      }
    } catch (err) {
      console.error("Failed to link chat:", err);
    } finally {
      setIsLinking(false);
    }
  }, []);

  useEffect(() => {
    if (isOpen && !chatUser && !isLinking) {
      linkChat();
    }
  }, [isOpen, chatUser, isLinking, linkChat]);

  const { data: channelsData } = useQuery({
    queryKey: ["/api/chronicles/chat/channels"],
    queryFn: async () => {
      const res = await fetch("/api/chronicles/chat/channels");
      if (!res.ok) return { channels: [] };
      return res.json();
    },
    staleTime: 60000,
  });

  const channels: ChatChannel[] = channelsData?.channels || [];

  useEffect(() => {
    if (channels.length > 0 && !activeChannelId) {
      const eraChannel = channels.find(c => c.era === currentEra);
      if (eraChannel) setActiveChannelId(eraChannel.id);
      else if (channels[0]) setActiveChannelId(channels[0].id);
    }
  }, [channels, currentEra, activeChannelId]);

  const { data: messagesData, refetch: refetchMessages } = useQuery({
    queryKey: ["/api/chronicles/chat/messages", activeChannelId],
    queryFn: async () => {
      if (!activeChannelId) return { messages: [] };
      const res = await fetch(`/api/chronicles/chat/messages/${activeChannelId}`);
      if (!res.ok) return { messages: [] };
      return res.json();
    },
    enabled: !!activeChannelId && isOpen,
    staleTime: 5000,
    refetchInterval: isOpen ? 8000 : false,
  });

  const messages: ChatMessage[] = messagesData?.messages || [];

  useEffect(() => {
    if (isOpen && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen]);

  useEffect(() => {
    if (!isOpen && chatToken && activeChannelId) {
      if (pollRef.current) clearInterval(pollRef.current);
      pollRef.current = setInterval(() => {
        setUnreadCount(prev => prev + 1);
      }, 30000);
    }
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, [isOpen, chatToken, activeChannelId]);

  useEffect(() => {
    return () => {
      if (voiceTimerRef.current) clearInterval(voiceTimerRef.current);
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
        mediaRecorderRef.current.stream.getTracks().forEach(t => t.stop());
        mediaRecorderRef.current.stop();
      }
    };
  }, []);

  const sendVoiceMessage = useMutation({
    mutationFn: async (duration: number) => {
      if (!activeChannelId || !chatUser) throw new Error("Not connected");
      const res = await fetch(`/api/chronicles/chat/messages/${activeChannelId}`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({
          content: `[Voice ${duration}s] Voice message from your parallel self`,
          chatUserId: chatUser.id,
          isVoice: true,
        }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "Failed to send voice message");
      }
      return res.json();
    },
    onSuccess: () => {
      refetchMessages();
    },
  });

  const sendMessage = useMutation({
    mutationFn: async (content: string) => {
      if (!activeChannelId || !chatUser) throw new Error("Not connected");
      const res = await fetch(`/api/chronicles/chat/messages/${activeChannelId}`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({ content, chatUserId: chatUser.id }),
      });
      if (!res.ok) throw new Error("Failed to send");
      return res.json();
    },
    onSuccess: () => {
      setInput("");
      refetchMessages();
    },
  });

  const handleSend = () => {
    const trimmed = input.trim();
    if (!trimmed || sendMessage.isPending) return;
    sendMessage.mutate(trimmed);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const activeChannel = channels.find(c => c.id === activeChannelId);
  const channelConfig = ERA_CHANNEL_CONFIG[activeChannel?.era || "general"] || ERA_CHANNEL_CONFIG.general;

  return (
    <>
      <button
        onClick={() => { setIsOpen(!isOpen); setUnreadCount(0); }}
        className={`fixed bottom-24 right-4 z-40 w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-all ${
          isOpen
            ? "bg-slate-800 border border-white/20"
            : "bg-gradient-to-r from-cyan-500 to-purple-600 shadow-[0_0_20px_rgba(0,255,255,0.3)]"
        }`}
        data-testid="chronicles-chat-toggle"
      >
        {isOpen ? <X className="w-5 h-5 text-white" /> : <MessageCircle className="w-5 h-5 text-white" />}
        {!isOpen && unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-[10px] text-white flex items-center justify-center font-bold">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-40 right-4 z-50 w-[340px] sm:w-[380px] h-[460px] flex flex-col rounded-2xl overflow-hidden border border-white/10 shadow-2xl"
            style={{ background: "rgba(15, 23, 42, 0.97)", backdropFilter: "blur(24px)" }}
            data-testid="chronicles-chat-panel"
          >
            <div className="px-4 py-3 border-b border-white/10 flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500/30 to-purple-600/30 flex items-center justify-center">
                <MessageCircle className="w-4 h-4 text-cyan-400" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-semibold text-white">Signal Chat</h3>
                <p className="text-[10px] text-gray-500 truncate">
                  {chatUser ? `Connected as ${chatUser.displayName}` : "Connecting..."}
                </p>
              </div>
              {chatUser && (
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-[10px] text-green-400">Live</span>
                </div>
              )}
            </div>

            <div className="flex gap-1 px-3 py-2 border-b border-white/5 overflow-x-auto scrollbar-none">
              {channels.map(ch => {
                const cfg = ERA_CHANNEL_CONFIG[ch.era] || ERA_CHANNEL_CONFIG.general;
                const isActive = ch.id === activeChannelId;
                return (
                  <button
                    key={ch.id}
                    onClick={() => setActiveChannelId(ch.id)}
                    className={`flex-shrink-0 px-2.5 py-1.5 rounded-lg text-[11px] font-medium transition-all flex items-center gap-1 ${
                      isActive
                        ? `bg-white/10 ${cfg.color} border ${cfg.border}`
                        : "text-gray-500 hover:text-gray-300 hover:bg-white/5"
                    }`}
                    data-testid={`chat-channel-${ch.era}`}
                  >
                    <span className="text-xs">{cfg.emoji}</span>
                    {ch.isVoice ? <Mic className="w-3 h-3" /> : <Hash className="w-3 h-3" />}
                    <span className="hidden sm:inline">{cfg.label}</span>
                  </button>
                );
              })}
            </div>

            <div className="flex-1 overflow-y-auto px-3 py-2 space-y-2.5 scrollbar-thin">
              {isLinking && !chatUser ? (
                <div className="flex flex-col items-center justify-center h-full gap-2">
                  <Loader2 className="w-6 h-6 text-cyan-400 animate-spin" />
                  <p className="text-xs text-gray-500">Connecting to Signal Chat...</p>
                </div>
              ) : messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full gap-2">
                  <MessageCircle className="w-8 h-8 text-gray-700" />
                  <p className="text-xs text-gray-500 text-center">
                    No messages yet in {channelConfig.emoji} {channelConfig.label}
                  </p>
                  <p className="text-[10px] text-gray-600">Be the first to say something!</p>
                </div>
              ) : (
                messages.map(msg => (
                  <MessageBubble
                    key={msg.id}
                    msg={msg}
                    isOwn={msg.username === chatUser?.username}
                  />
                ))
              )}
              <div ref={messagesEndRef} />
            </div>

            {activeChannel?.isVoice && (
              <div className="px-3 py-2 border-t border-white/5">
                {isVoiceRecording ? (
                  <div className="flex items-center gap-2 p-2 rounded-lg bg-red-500/10 border border-red-500/20">
                    <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                    <div className="flex-1 flex items-center gap-[2px] h-4">
                      {Array.from({ length: 16 }).map((_, i) => (
                        <motion.div
                          key={i}
                          className="w-[3px] rounded-full bg-red-400"
                          animate={{ height: [4, Math.random() * 14 + 4, 4] }}
                          transition={{ duration: 0.3 + Math.random() * 0.3, repeat: Infinity, repeatType: "reverse", delay: i * 0.02 }}
                        />
                      ))}
                    </div>
                    <span className="text-[11px] text-red-400 font-mono">
                      {Math.floor(voiceRecordTime / 60)}:{(voiceRecordTime % 60).toString().padStart(2, "0")}
                    </span>
                    <button
                      onClick={() => {
                        const duration = voiceRecordTime;
                        setIsVoiceRecording(false);
                        if (voiceTimerRef.current) clearInterval(voiceTimerRef.current);
                        if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
                          mediaRecorderRef.current.stream.getTracks().forEach(t => t.stop());
                          mediaRecorderRef.current.stop();
                        }
                        sendVoiceMessage.mutate(duration);
                        setVoiceRecordTime(0);
                      }}
                      className="p-1.5 rounded-lg bg-red-500/30 text-red-400 hover:bg-red-500/40 transition-all"
                      data-testid="voice-stop-send-btn"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        setIsVoiceRecording(false);
                        if (voiceTimerRef.current) clearInterval(voiceTimerRef.current);
                        if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
                          mediaRecorderRef.current.stream.getTracks().forEach(t => t.stop());
                          mediaRecorderRef.current.stop();
                        }
                        setVoiceRecordTime(0);
                      }}
                      className="p-1.5 rounded-lg bg-white/10 text-gray-400 hover:bg-white/20 transition-all"
                      data-testid="voice-cancel-btn"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 p-2 rounded-lg bg-pink-500/10 border border-pink-500/20">
                    <Radio className="w-4 h-4 text-pink-400 animate-pulse" />
                    <div className="flex-1">
                      <p className="text-[11px] text-pink-300 font-medium">Voice Channel</p>
                      <p className="text-[10px] text-gray-500 flex items-center gap-1">
                        <Coins className="w-3 h-3" /> 5 credits per message
                      </p>
                    </div>
                    <button
                      onClick={async () => {
                        try {
                          const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                          const mr = new MediaRecorder(stream);
                          mediaRecorderRef.current = mr;
                          mr.onstop = () => stream.getTracks().forEach(t => t.stop());
                          mr.start();
                          setIsVoiceRecording(true);
                          setVoiceRecordTime(0);
                          voiceTimerRef.current = setInterval(() => setVoiceRecordTime(prev => prev + 1), 1000);
                        } catch {
                          console.error("Microphone access denied");
                        }
                      }}
                      disabled={!chatUser}
                      className="p-1.5 rounded-lg bg-pink-500/20 text-pink-400 hover:bg-pink-500/30 transition-all disabled:opacity-30"
                      data-testid="voice-record-btn"
                    >
                      <Mic className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            )}

            <div className="px-3 py-2 border-t border-white/10">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={
                    activeChannel?.isVoice
                      ? "Type or use voice..."
                      : `Message ${channelConfig.emoji} ${channelConfig.label}...`
                  }
                  disabled={!chatUser}
                  className="flex-1 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-cyan-500/40 focus:ring-1 focus:ring-cyan-500/20 transition-all disabled:opacity-50"
                  data-testid="chat-input"
                />
                <button
                  onClick={handleSend}
                  disabled={!input.trim() || !chatUser || sendMessage.isPending}
                  className="px-3 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-purple-600 text-white disabled:opacity-30 hover:from-cyan-400 hover:to-purple-500 transition-all"
                  data-testid="chat-send-btn"
                >
                  {sendMessage.isPending ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
