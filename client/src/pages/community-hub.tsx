import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  MessageCircle, Users, Bot, Hash, Bell, Settings, Search,
  Plus, ChevronRight, ChevronDown, Sparkles, Crown, Shield,
  Zap, Star, Heart, Send, Smile, Image, Mic, MoreHorizontal,
  Home, Compass, Radio, Lock, Globe, ArrowLeft, Menu, X, Loader2,
  Activity, TrendingUp, Reply, Edit2, Trash2, Coins, Paperclip, ImageIcon
} from "lucide-react";
import { useUpload } from "@/hooks/use-upload";
import { Footer } from "@/components/footer";
import { GlassCard } from "@/components/glass-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { PulseMiniApp } from "@/components/pulse-mini-app";

const COMMUNITY_COLORS = [
  "from-cyan-500 to-blue-600",
  "from-purple-500 to-pink-600", 
  "from-emerald-500 to-teal-600",
  "from-amber-500 to-orange-600",
  "from-rose-500 to-red-600",
  "from-indigo-500 to-violet-600",
];

const QUICK_REACTIONS = ["👍", "❤️", "😂", "🔥", "👀", "🎉", "💎", "🚀"];

function useWebSocket(channelId: string | null, communityId: string | null, user: any) {
  const [messages, setMessages] = useState<any[]>([]);
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const [onlineUsers, setOnlineUsers] = useState<any[]>([]);
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeout = useRef<any>(null);

  const connect = useCallback(() => {
    if (!channelId || !user) return;

    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const ws = new WebSocket(`${protocol}//${window.location.host}/ws/community`);
    wsRef.current = ws;

    ws.onopen = () => {
      ws.send(JSON.stringify({
        type: "join",
        channelId,
        communityId,
        userId: user.claims?.sub || user.id,
        username: user.claims?.firstName || user.firstName || "User",
      }));
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      
      switch (data.type) {
        case "new_message":
          setMessages(prev => [...prev, data.message]);
          break;
        case "message_edited":
          setMessages(prev => prev.map(m => m.id === data.message.id ? data.message : m));
          break;
        case "message_deleted":
          setMessages(prev => prev.filter(m => m.id !== data.messageId));
          break;
        case "reaction_update":
          setMessages(prev => prev.map(m => m.id === data.messageId ? { ...m, reactions: data.reactions } : m));
          break;
        case "typing":
          setTypingUsers(prev => {
            if (!prev.includes(data.username)) {
              setTimeout(() => {
                setTypingUsers(p => p.filter(u => u !== data.username));
              }, 3000);
              return [...prev, data.username];
            }
            return prev;
          });
          break;
        case "presence":
          setOnlineUsers(data.users);
          break;
        case "user_joined":
        case "user_left":
          break;
      }
    };

    ws.onclose = () => {
      reconnectTimeout.current = setTimeout(() => {
        connect();
      }, 2000);
    };

    ws.onerror = () => {
      ws.close();
    };
  }, [channelId, communityId, user]);

  useEffect(() => {
    connect();
    return () => {
      if (wsRef.current) wsRef.current.close();
      if (reconnectTimeout.current) clearTimeout(reconnectTimeout.current);
    };
  }, [connect]);

  const sendMessage = useCallback((content: string, replyToId?: string, attachment?: { url: string; name: string; type: string }) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ type: "message", content, replyToId, attachment }));
    }
  }, []);

  const addReaction = useCallback((messageId: string, emoji: string) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ type: "reaction", messageId, emoji, action: "add" }));
    }
  }, []);

  const removeReaction = useCallback((messageId: string, emoji: string) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ type: "reaction", messageId, emoji, action: "remove" }));
    }
  }, []);

  const sendTyping = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ type: "typing" }));
    }
  }, []);

  const deleteMessage = useCallback((messageId: string) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ type: "delete_message", messageId }));
    }
  }, []);

  return { messages, setMessages, typingUsers, onlineUsers, sendMessage, addReaction, removeReaction, sendTyping, deleteMessage };
}

function CommunityIcon({ community, selected, onClick }: { community: any; selected: boolean; onClick: () => void }) {
  const colorIndex = community.name.length % COMMUNITY_COLORS.length;
  return (
    <motion.button
      whileHover={{ scale: 1.1 }}
      onClick={onClick}
      className={`relative w-12 h-12 rounded-2xl bg-gradient-to-br ${COMMUNITY_COLORS[colorIndex]} flex items-center justify-center cursor-pointer group ${selected ? "ring-2 ring-white" : ""}`}
    >
      <span className="text-xl">{community.icon || "⚡"}</span>
      {community.isVerified && (
        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-cyan-500 rounded-full flex items-center justify-center">
          <Shield className="w-2.5 h-2.5 text-white" />
        </div>
      )}
      <div className="absolute left-full ml-3 px-2 py-1 bg-gray-900 rounded text-xs text-white whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
        {community.name}
      </div>
    </motion.button>
  );
}

function ChannelItem({ channel, selected, onClick }: { channel: any; selected: boolean; onClick: () => void }) {
  const Icon = channel.type === "announcement" ? Radio : channel.type === "bot" ? Bot : Hash;
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${
        selected ? "bg-white/10 text-white" : "text-gray-400 hover:bg-white/5 hover:text-gray-200"
      }`}
      data-testid={`channel-${channel.id}`}
    >
      <Icon className={`w-4 h-4 ${channel.type === "bot" ? "text-purple-400" : ""}`} />
      <span className="text-sm flex-1 text-left truncate">{channel.name}</span>
      {channel.isLocked && <Lock className="w-3 h-3 text-gray-500" />}
    </button>
  );
}

interface MessageBubbleProps {
  message: any;
  currentUserId?: string;
  onReply: (message: any) => void;
  onReaction: (messageId: string, emoji: string) => void;
  onDelete: (messageId: string) => void;
  onTip?: (userId: string, username: string, messageId: string) => void;
}

function MessageBubble({ message, currentUserId, onReply, onReaction, onDelete, onTip }: MessageBubbleProps) {
  const [showReactions, setShowReactions] = useState(false);
  const time = new Date(message.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  const isOwn = currentUserId && (message.userId === currentUserId);
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex gap-3 px-4 py-2 hover:bg-white/5 rounded-lg group relative"
    >
      <Avatar className={`w-10 h-10 shrink-0 ${message.isBot ? "bg-purple-500/30 border border-purple-500/50" : "bg-gradient-to-br from-cyan-500 to-purple-500"}`}>
        <AvatarFallback className="text-sm">{message.username?.slice(0, 2).toUpperCase() || "??"}</AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0">
        {message.replyTo && (
          <div className="flex items-center gap-2 mb-1 pl-2 border-l-2 border-cyan-500/50 text-xs text-gray-500">
            <Reply className="w-3 h-3" />
            <span className="text-cyan-400">{message.replyTo.username}</span>
            <span className="truncate">{message.replyTo.content?.slice(0, 50)}{message.replyTo.content?.length > 50 ? "..." : ""}</span>
          </div>
        )}
        <div className="flex items-center gap-2">
          <span className={`font-medium text-sm ${message.isBot ? "text-purple-400" : "text-white"}`}>
            {message.username}
          </span>
          {message.isBot && (
            <Badge className="h-4 text-[10px] bg-purple-500/20 text-purple-400 border-purple-500/30">BOT</Badge>
          )}
          <span className="text-[10px] text-gray-500">{time}</span>
          {message.editedAt && <span className="text-[10px] text-gray-600">(edited)</span>}
        </div>
        {message.content && <p className="text-sm text-gray-300 mt-0.5 break-words">{message.content}</p>}
        
        {message.attachment && (
          <div className="mt-2">
            {message.attachment.type?.startsWith("image/") ? (
              <a href={message.attachment.url} target="_blank" rel="noopener noreferrer" className="block">
                <img 
                  src={message.attachment.url} 
                  alt={message.attachment.name || "Attachment"} 
                  className="max-w-xs max-h-64 rounded-lg border border-white/10 hover:border-cyan-500/50 transition-colors"
                />
              </a>
            ) : message.attachment.type?.startsWith("video/") ? (
              <video 
                src={message.attachment.url} 
                controls 
                className="max-w-xs max-h-64 rounded-lg border border-white/10"
              />
            ) : (
              <a 
                href={message.attachment.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-3 py-2 bg-white/5 border border-white/10 rounded-lg hover:border-cyan-500/50 transition-colors max-w-xs"
              >
                <Paperclip className="w-4 h-4 text-cyan-400 shrink-0" />
                <span className="text-sm text-gray-300 truncate">{message.attachment.name || "Download file"}</span>
              </a>
            )}
          </div>
        )}
        
        {message.reactions?.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {message.reactions.map((r: any) => (
              <button
                key={r.emoji}
                onClick={() => onReaction(message.id, r.emoji)}
                className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-xs transition-all ${
                  r.users?.some((u: any) => u.userId === currentUserId)
                    ? "bg-cyan-500/30 border border-cyan-500/50"
                    : "bg-white/5 border border-white/10 hover:border-white/30"
                }`}
                data-testid={`reaction-${message.id}-${r.emoji}`}
              >
                <span>{r.emoji}</span>
                <span className="text-gray-400">{r.count}</span>
              </button>
            ))}
          </div>
        )}
      </div>
      
      <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 shrink-0">
        <div className="relative">
          <button 
            onClick={() => setShowReactions(!showReactions)}
            className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
            data-testid={`btn-reactions-${message.id}`}
          >
            <Smile className="w-4 h-4 text-gray-400" />
          </button>
          <AnimatePresence>
            {showReactions && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 5 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="absolute bottom-full right-0 mb-1 bg-gray-900 border border-white/10 rounded-xl p-2 flex gap-1 z-50"
              >
                {QUICK_REACTIONS.map((emoji) => (
                  <button
                    key={emoji}
                    onClick={() => { onReaction(message.id, emoji); setShowReactions(false); }}
                    className="w-8 h-8 flex items-center justify-center hover:bg-white/10 rounded-lg transition-colors text-lg"
                    data-testid={`add-reaction-${emoji}`}
                  >
                    {emoji}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <button 
          onClick={() => onReply(message)}
          className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
          data-testid={`btn-reply-${message.id}`}
        >
          <Reply className="w-4 h-4 text-gray-400" />
        </button>
        {!isOwn && onTip && (
          <button 
            onClick={() => onTip(message.userId, message.username, message.id)}
            className="p-1.5 hover:bg-amber-500/20 rounded-lg transition-colors"
            data-testid={`btn-tip-${message.id}`}
            title="Tip Orbs"
          >
            <Coins className="w-4 h-4 text-gray-400 hover:text-amber-400" />
          </button>
        )}
        {isOwn && (
          <button 
            onClick={() => onDelete(message.id)}
            className="p-1.5 hover:bg-red-500/20 rounded-lg transition-colors"
            data-testid={`btn-delete-${message.id}`}
          >
            <Trash2 className="w-4 h-4 text-gray-400 hover:text-red-400" />
          </button>
        )}
      </div>
    </motion.div>
  );
}

export default function CommunityHub() {
  const queryClient = useQueryClient();
  const [selectedCommunityId, setSelectedCommunityId] = useState<string | null>(null);
  const [selectedChannelId, setSelectedChannelId] = useState<string | null>(null);
  const [showSidebar, setShowSidebar] = useState(false);
  const [showBots, setShowBots] = useState(false);
  const [messageInput, setMessageInput] = useState("");
  const [newCommunityName, setNewCommunityName] = useState("");
  const [newCommunityDesc, setNewCommunityDesc] = useState("");
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [activeView, setActiveView] = useState<"chat" | "pulse">("chat");
  const [replyingTo, setReplyingTo] = useState<any>(null);
  const [pendingAttachment, setPendingAttachment] = useState<{ url: string; name: string; type: string } | null>(null);
  const [tipDialogOpen, setTipDialogOpen] = useState(false);
  const [tipTarget, setTipTarget] = useState<{ userId: string; username: string; messageId: string } | null>(null);
  const [tipAmount, setTipAmount] = useState("10");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { uploadFile, isUploading } = useUpload({
    onSuccess: (response) => {
      setPendingAttachment({
        url: response.objectPath,
        name: response.metadata.name,
        type: response.metadata.contentType,
      });
    },
    onError: (error) => {
      console.error("Upload failed:", error);
    },
  });

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await uploadFile(file);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const { data: user } = useQuery({
    queryKey: ["/api/auth/user"],
    retry: false,
  });

  const { data: orbsData, refetch: refetchOrbs } = useQuery<{ balance: number; lockedBalance: number }>({
    queryKey: ["/api/orbs/balance"],
    enabled: !!user,
  });

  const tipMutation = useMutation({
    mutationFn: async (data: { toUserId: string; toUsername: string; amount: number; messageId?: string }) => {
      const res = await fetch("/api/orbs/tip", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error((await res.json()).error || "Failed to tip");
      return res.json();
    },
    onSuccess: () => {
      refetchOrbs();
    },
  });

  const wsHook = useWebSocket(selectedChannelId, selectedCommunityId, user);
  const { messages: wsMessages, setMessages: setWsMessages, typingUsers, sendMessage: wsSendMessage, addReaction, deleteMessage: wsDeleteMessage, sendTyping } = wsHook;

  const { data: communitiesData, isLoading: loadingCommunities } = useQuery<{ communities: any[] }>({
    queryKey: ["/api/community/list"],
  });

  const { data: myCommunities } = useQuery<{ communities: any[] }>({
    queryKey: ["/api/community/my-communities"],
    enabled: !!user,
  });

  const selectedCommunity = communitiesData?.communities?.find((c: any) => c.id === selectedCommunityId);

  const { data: channelsData } = useQuery({
    queryKey: ["/api/community", selectedCommunityId, "channels"],
    queryFn: async () => {
      const res = await fetch(`/api/community/${selectedCommunityId}/channels`);
      return res.json();
    },
    enabled: !!selectedCommunityId,
  });

  const { data: membersData } = useQuery({
    queryKey: ["/api/community", selectedCommunityId, "members"],
    queryFn: async () => {
      const res = await fetch(`/api/community/${selectedCommunityId}/members`);
      return res.json();
    },
    enabled: !!selectedCommunityId,
  });

  const { data: messagesData, isLoading: loadingMessages } = useQuery({
    queryKey: ["/api/channel", selectedChannelId, "messages"],
    queryFn: async () => {
      const res = await fetch(`/api/channel/${selectedChannelId}/messages`);
      return res.json();
    },
    enabled: !!selectedChannelId,
  });

  useEffect(() => {
    if (messagesData?.messages) {
      setWsMessages(messagesData.messages.reverse());
    }
  }, [messagesData, setWsMessages]);

  const createCommunity = useMutation({
    mutationFn: async (data: { name: string; description: string }) => {
      const res = await fetch("/api/community/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      return res.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["/api/community/list"] });
      queryClient.invalidateQueries({ queryKey: ["/api/community/my-communities"] });
      setSelectedCommunityId(data.community.id);
      setCreateDialogOpen(false);
      setNewCommunityName("");
      setNewCommunityDesc("");
    },
  });

  const joinCommunity = useMutation({
    mutationFn: async (communityId: string) => {
      const res = await fetch(`/api/community/${communityId}/join`, {
        method: "POST",
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/community/my-communities"] });
      queryClient.invalidateQueries({ queryKey: ["/api/community", selectedCommunityId, "members"] });
    },
  });


  useEffect(() => {
    if (communitiesData?.communities?.length && !selectedCommunityId) {
      setSelectedCommunityId(communitiesData.communities[0].id);
    }
  }, [communitiesData]);

  useEffect(() => {
    if (channelsData?.channels?.length && !selectedChannelId) {
      const generalChannel = channelsData.channels.find((c: any) => c.name === "general") || channelsData.channels[0];
      setSelectedChannelId(generalChannel.id);
    }
  }, [channelsData]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [wsMessages]);

  const handleSendMessage = () => {
    if ((!messageInput.trim() && !pendingAttachment) || !selectedChannelId) return;
    wsSendMessage(messageInput.trim() || "", replyingTo?.id, pendingAttachment || undefined);
    setMessageInput("");
    setReplyingTo(null);
    setPendingAttachment(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessageInput(e.target.value);
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => sendTyping(), 500);
  };

  const handleReaction = (messageId: string, emoji: string) => {
    addReaction(messageId, emoji);
  };

  const handleTip = (userId: string, username: string, messageId: string) => {
    setTipTarget({ userId, username, messageId });
    setTipAmount("10");
    setTipDialogOpen(true);
  };

  const submitTip = () => {
    if (!tipTarget) return;
    const amount = parseInt(tipAmount);
    if (isNaN(amount) || amount <= 0) return;
    tipMutation.mutate({
      toUserId: tipTarget.userId,
      toUsername: tipTarget.username,
      amount,
      messageId: tipTarget.messageId,
    });
    setTipDialogOpen(false);
    setTipTarget(null);
  };

  const currentUserId = (user as any)?.claims?.sub || (user as any)?.id;

  const selectedChannel = channelsData?.channels?.find((c: any) => c.id === selectedChannelId);
  const isMember = myCommunities?.communities?.some((c: any) => c.id === selectedCommunityId);

  return (
    <div className="min-h-screen flex flex-col bg-background overflow-hidden">
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-background/90 backdrop-blur-xl">
        <div className="container mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button 
              className="lg:hidden p-2 hover:bg-white/10 rounded-lg"
              onClick={() => setShowSidebar(!showSidebar)}
              data-testid="toggle-sidebar"
            >
              {showSidebar ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <Link href="/" className="flex items-center gap-2 shrink-0">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-cyan-500 to-purple-500 flex items-center justify-center">
                <MessageCircle className="w-4 h-4 text-white" />
              </div>
              <span className="font-display font-bold text-lg tracking-tight hidden sm:inline bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">Chronochat</span>
            </Link>
          </div>
          <div className="flex items-center gap-2">
            {!user && (
              <a href="/api/login">
                <Button size="sm" className="bg-cyan-500 hover:bg-cyan-600">
                  Sign In to Chat
                </Button>
              </a>
            )}
            <Link href="/">
              <Button variant="ghost" size="sm" className="h-8 text-xs px-2 hover:bg-white/5">
                <ArrowLeft className="w-3 h-3" />
                <span className="hidden sm:inline ml-1">Back</span>
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      <div className="flex-1 pt-14 flex">
        <AnimatePresence>
          {(showSidebar || typeof window !== "undefined" && window.innerWidth >= 1024) && (
            <motion.div
              initial={{ x: -300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -300, opacity: 0 }}
              className="fixed lg:relative inset-y-0 left-0 top-14 z-40 flex"
            >
              <div className="w-[72px] bg-gray-900/80 backdrop-blur-xl border-r border-white/5 flex flex-col items-center py-4 gap-3">
                <button 
                  onClick={() => setActiveView("chat")}
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${activeView === "chat" ? "bg-cyan-500/20 text-cyan-400 ring-2 ring-cyan-500/30" : "bg-white/10 text-gray-400 hover:text-white hover:bg-white/20"}`}
                  data-testid="toggle-chat-view"
                >
                  <MessageCircle className="w-5 h-5" />
                </button>
                <button 
                  onClick={() => setActiveView("pulse")}
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all group relative ${activeView === "pulse" ? "bg-gradient-to-br from-cyan-500 to-purple-500 text-white ring-2 ring-cyan-500/30" : "bg-white/5 text-gray-400 hover:text-white hover:bg-white/10"}`}
                  data-testid="toggle-pulse-view"
                >
                  <Activity className="w-5 h-5" />
                  <div className="absolute left-full ml-3 px-2 py-1 bg-gray-900 rounded text-xs text-white whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                    Pulse Trading
                  </div>
                </button>
                <button className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-all">
                  <Compass className="w-5 h-5" />
                </button>
                <div className="w-8 h-px bg-white/10 my-2" />
                {loadingCommunities ? (
                  <Loader2 className="w-6 h-6 text-gray-400 animate-spin" />
                ) : (
                  communitiesData?.communities?.map((community: any) => (
                    <CommunityIcon 
                      key={community.id} 
                      community={community} 
                      selected={community.id === selectedCommunityId}
                      onClick={() => {
                        setSelectedCommunityId(community.id);
                        setSelectedChannelId(null);
                      }}
                    />
                  ))
                )}
                <div className="w-8 h-px bg-white/10 my-2" />
                <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
                  <DialogTrigger asChild>
                    <button 
                      className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 hover:bg-emerald-500/30 transition-all"
                      data-testid="create-community-btn"
                    >
                      <Plus className="w-5 h-5" />
                    </button>
                  </DialogTrigger>
                  <DialogContent className="bg-gray-900 border-white/10">
                    <DialogHeader>
                      <DialogTitle>Create Community</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label>Community Name</Label>
                        <Input 
                          value={newCommunityName}
                          onChange={(e) => setNewCommunityName(e.target.value)}
                          placeholder="e.g., My Awesome Community"
                          className="mt-1 bg-white/5 border-white/10"
                          data-testid="input-community-name"
                        />
                      </div>
                      <div>
                        <Label>Description</Label>
                        <Input 
                          value={newCommunityDesc}
                          onChange={(e) => setNewCommunityDesc(e.target.value)}
                          placeholder="What's your community about?"
                          className="mt-1 bg-white/5 border-white/10"
                          data-testid="input-community-desc"
                        />
                      </div>
                      <Button 
                        onClick={() => createCommunity.mutate({ name: newCommunityName, description: newCommunityDesc })}
                        disabled={!newCommunityName.trim() || createCommunity.isPending || !user}
                        className="w-full bg-cyan-500 hover:bg-cyan-600"
                        data-testid="submit-create-community"
                      >
                        {createCommunity.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Create Community"}
                      </Button>
                      {!user && <p className="text-xs text-amber-400 text-center">Sign in to create communities</p>}
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              <div className="w-52 sm:w-60 bg-gray-900/60 backdrop-blur-xl border-r border-white/5 flex flex-col overflow-hidden">
                <div className="p-3 sm:p-4 border-b border-white/5">
                  {selectedCommunity ? (
                    <>
                      <div className="flex items-center justify-between gap-2 min-w-0">
                        <div className="flex items-center gap-2 min-w-0 flex-1">
                          <span className="text-base sm:text-lg flex-shrink-0">{selectedCommunity.icon || "⚡"}</span>
                          <h2 className="font-bold text-white text-sm sm:text-base truncate">{selectedCommunity.name}</h2>
                          {selectedCommunity.isVerified && <Shield className="w-3 h-3 sm:w-4 sm:h-4 text-cyan-400 flex-shrink-0" />}
                        </div>
                        <ChevronDown className="w-4 h-4 text-gray-400 flex-shrink-0" />
                      </div>
                      <div className="flex items-center gap-2 sm:gap-3 mt-2 text-[10px] sm:text-xs text-gray-400">
                        <span className="flex items-center gap-1">
                          <Users className="w-3 h-3" /> {selectedCommunity.memberCount || 0}
                        </span>
                        <span className="flex items-center gap-1">
                          <div className="w-2 h-2 rounded-full bg-emerald-400" /> {membersData?.members?.filter((m: any) => m.isOnline).length || 0} online
                        </span>
                      </div>
                      {user && !isMember && (
                        <Button 
                          size="sm" 
                          className="w-full mt-3 bg-cyan-500 hover:bg-cyan-600 text-xs sm:text-sm"
                          onClick={() => joinCommunity.mutate(selectedCommunityId!)}
                          disabled={joinCommunity.isPending}
                          data-testid="join-community-btn"
                        >
                          {joinCommunity.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Join"}
                        </Button>
                      )}
                    </>
                  ) : (
                    <p className="text-gray-400 text-xs sm:text-sm">Select a community</p>
                  )}
                </div>

                <ScrollArea className="flex-1 p-2">
                  <div className="mb-4">
                    <button 
                      className="w-full flex items-center justify-between px-2 py-1 text-xs text-gray-400 hover:text-gray-200"
                    >
                      <span className="uppercase tracking-wider font-medium">Channels</span>
                      <Plus className="w-3 h-3" />
                    </button>
                    <div className="mt-1 space-y-0.5">
                      {channelsData?.channels?.filter((c: any) => c.type !== "bot").map((channel: any) => (
                        <ChannelItem
                          key={channel.id}
                          channel={channel}
                          selected={selectedChannelId === channel.id}
                          onClick={() => setSelectedChannelId(channel.id)}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="mb-4">
                    <button 
                      className="w-full flex items-center justify-between px-2 py-1 text-xs text-gray-400 hover:text-gray-200"
                      onClick={() => setShowBots(!showBots)}
                    >
                      <span className="uppercase tracking-wider font-medium flex items-center gap-1">
                        <Bot className="w-3 h-3" /> Bots
                      </span>
                      <ChevronRight className={`w-3 h-3 transition-transform ${showBots ? "rotate-90" : ""}`} />
                    </button>
                    {showBots && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        className="mt-1 space-y-0.5"
                      >
                        {channelsData?.channels?.filter((c: any) => c.type === "bot").map((channel: any) => (
                          <ChannelItem
                            key={channel.id}
                            channel={channel}
                            selected={selectedChannelId === channel.id}
                            onClick={() => setSelectedChannelId(channel.id)}
                          />
                        ))}
                      </motion.div>
                    )}
                  </div>
                </ScrollArea>

                <div className="p-2 sm:p-3 border-t border-white/5 bg-black/20">
                  <div className="flex items-center gap-2">
                    <Avatar className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-br from-cyan-500 to-purple-500 flex-shrink-0">
                      <AvatarFallback className="text-[10px] sm:text-xs">
                        {user ? (user as any).username?.slice(0, 2).toUpperCase() || "ME" : "??"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs sm:text-sm font-medium text-white truncate">
                        {user ? (user as any).username || "You" : "Guest"}
                      </p>
                      <p className="text-[9px] sm:text-[10px] text-emerald-400">{user ? "Online" : "Sign in"}</p>
                    </div>
                    <button className="p-1 sm:p-1.5 hover:bg-white/10 rounded-lg flex-shrink-0">
                      <Settings className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-400" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {activeView === "pulse" ? (
          <div className="flex-1 min-w-0">
            <PulseMiniApp />
          </div>
        ) : (
          <>
            <div className="flex-1 flex flex-col min-w-0">
              <div className="h-12 border-b border-white/5 bg-gray-900/40 backdrop-blur-sm flex items-center justify-between px-2 sm:px-4 gap-2 overflow-hidden">
                <div className="flex items-center gap-2 min-w-0 flex-shrink">
                  <Hash className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 flex-shrink-0" />
                  <span className="font-medium text-white text-sm sm:text-base truncate max-w-[120px] sm:max-w-none">{selectedChannel?.name || "Select a channel"}</span>
                </div>
                <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
                  {!!user && (
                    <div className="flex items-center gap-1 px-2 py-1 sm:px-3 sm:py-1.5 bg-amber-500/10 border border-amber-500/30 rounded-full flex-shrink-0">
                      <Coins className="w-3 h-3 sm:w-4 sm:h-4 text-amber-400" />
                      <span className="text-xs sm:text-sm font-medium text-amber-400" data-testid="orbs-balance">
                        {orbsData?.balance?.toLocaleString() || 0}
                      </span>
                    </div>
                  )}
                  <div className="relative hidden md:block">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <Input 
                      placeholder="Search..." 
                      className="w-48 h-8 pl-9 bg-white/5 border-white/10 text-sm"
                    />
                  </div>
                  <button className="p-1.5 sm:p-2 hover:bg-white/10 rounded-lg">
                    <Bell className="w-4 h-4 text-gray-400" />
                  </button>
                  <button className="p-1.5 sm:p-2 hover:bg-white/10 rounded-lg hidden sm:block">
                    <Users className="w-4 h-4 text-gray-400" />
                  </button>
                </div>
              </div>

              <ScrollArea className="flex-1 py-4">
                {loadingMessages ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="w-8 h-8 text-gray-400 animate-spin" />
                  </div>
                ) : wsMessages.length > 0 ? (
                  <div className="space-y-1">
                    {wsMessages.map((msg: any) => (
                      <MessageBubble 
                        key={msg.id} 
                        message={msg}
                        currentUserId={currentUserId}
                        onReply={setReplyingTo}
                        onReaction={handleReaction}
                        onDelete={wsDeleteMessage}
                        onTip={user ? handleTip : undefined}
                      />
                    ))}
                    <div ref={messagesEndRef} />
                  </div>
                ) : (
                  <div className="px-4 py-8">
                    <GlassCard className="p-6 text-center max-w-md mx-auto">
                      <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-purple-500/20 border border-cyan-500/30 flex items-center justify-center">
                        <MessageCircle className="w-8 h-8 text-cyan-400" />
                      </div>
                      <h3 className="text-xl font-bold text-white mb-2">Start the Conversation</h3>
                      <p className="text-sm text-gray-400 mb-4">
                        Be the first to send a message in this channel!
                      </p>
                    </GlassCard>
                  </div>
                )}
                {typingUsers.length > 0 && (
                  <div className="px-4 py-2 text-xs text-gray-400">
                    {typingUsers.join(", ")} {typingUsers.length === 1 ? "is" : "are"} typing...
                  </div>
                )}
              </ScrollArea>

              <div className="p-4 border-t border-white/5 bg-gray-900/40">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileSelect}
                  accept="image/*,video/*,.pdf,.doc,.docx,.txt"
                  className="hidden"
                  data-testid="input-file"
                />
                {replyingTo && (
                  <div className="mb-2 flex items-center gap-2 px-3 py-2 bg-cyan-500/10 border border-cyan-500/30 rounded-lg">
                    <Reply className="w-4 h-4 text-cyan-400 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <span className="text-xs text-cyan-400">Replying to {replyingTo.username}</span>
                      <p className="text-xs text-gray-400 truncate">{replyingTo.content}</p>
                    </div>
                    <button onClick={() => setReplyingTo(null)} className="p-1 hover:bg-white/10 rounded">
                      <X className="w-4 h-4 text-gray-400" />
                    </button>
                  </div>
                )}
                {pendingAttachment && (
                  <div className="mb-2 flex items-center gap-2 px-3 py-2 bg-purple-500/10 border border-purple-500/30 rounded-lg">
                    {pendingAttachment.type.startsWith("image/") ? (
                      <ImageIcon className="w-4 h-4 text-purple-400 shrink-0" />
                    ) : (
                      <Paperclip className="w-4 h-4 text-purple-400 shrink-0" />
                    )}
                    <div className="flex-1 min-w-0">
                      <span className="text-xs text-purple-400">Attachment</span>
                      <p className="text-xs text-gray-400 truncate">{pendingAttachment.name}</p>
                    </div>
                    <button onClick={() => setPendingAttachment(null)} className="p-1 hover:bg-white/10 rounded">
                      <X className="w-4 h-4 text-gray-400" />
                    </button>
                  </div>
                )}
                {isUploading && (
                  <div className="mb-2 flex items-center gap-2 px-3 py-2 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                    <Loader2 className="w-4 h-4 text-blue-400 animate-spin" />
                    <span className="text-xs text-blue-400">Uploading file...</span>
                  </div>
                )}
                <div className="flex items-center gap-1 sm:gap-2">
                  <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="p-1.5 sm:p-2 hover:bg-white/10 rounded-lg disabled:opacity-50 flex-shrink-0"
                    disabled={!user || isUploading}
                    data-testid="btn-attach-file"
                  >
                    <Plus className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                  </button>
                  <div className="flex-1 relative min-w-0">
                    <Input
                      value={messageInput}
                      onChange={handleInputChange}
                      onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSendMessage()}
                      placeholder={user ? `Message #${selectedChannel?.name || "channel"}` : "Sign in to chat"}
                      className="bg-white/5 border-white/10 pr-16 sm:pr-24 text-sm"
                      disabled={!user || !selectedChannelId}
                      data-testid="input-message"
                    />
                    <div className="absolute right-1 sm:right-2 top-1/2 -translate-y-1/2 flex items-center gap-0.5 sm:gap-1">
                      <button className="p-1 sm:p-1.5 hover:bg-white/10 rounded"><Smile className="w-4 h-4 text-gray-400" /></button>
                      <button className="p-1 sm:p-1.5 hover:bg-white/10 rounded"><Mic className="w-4 h-4 text-gray-400" /></button>
                    </div>
                  </div>
                  <Button 
                    size="icon" 
                    className="bg-cyan-500 hover:bg-cyan-600 h-9 w-9 sm:h-10 sm:w-10 flex-shrink-0"
                    onClick={handleSendMessage}
                    disabled={(!messageInput.trim() && !pendingAttachment) || !user || isUploading}
                    data-testid="send-message-btn"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>

            <div className="hidden xl:block w-60 border-l border-white/5 bg-gray-900/40 backdrop-blur-sm">
              <div className="p-4 border-b border-white/5">
                <h3 className="text-sm font-medium text-white flex items-center gap-2">
                  <Users className="w-4 h-4 text-cyan-400" />
                  Members ({membersData?.members?.length || 0})
                </h3>
              </div>
              <div className="p-3 space-y-2">
                {membersData?.members?.slice(0, 10).map((member: any) => (
                  <div key={member.id} className="flex items-center gap-2">
                    <div className="relative">
                      <Avatar className="w-7 h-7 bg-gradient-to-br from-cyan-500 to-purple-500">
                        <AvatarFallback className="text-[10px]">{member.username?.slice(0, 2).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      {member.isOnline && (
                        <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-gray-900" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="text-sm text-gray-300 truncate block">{member.username}</span>
                      {member.role === "owner" && (
                        <Badge className="h-3 text-[8px] bg-amber-500/20 text-amber-400 border-amber-500/30">OWNER</Badge>
                      )}
                    </div>
                  </div>
                ))}
                {(membersData?.members?.length || 0) > 10 && (
                  <p className="text-[10px] text-gray-500">+{membersData.members.length - 10} more</p>
                )}
              </div>
            </div>
          </>
        )}
      </div>

      <Dialog open={tipDialogOpen} onOpenChange={setTipDialogOpen}>
        <DialogContent className="bg-gray-900 border-white/10 max-w-sm">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Coins className="w-5 h-5 text-amber-400" />
              Tip Orbs
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-gray-400">
              Send Orbs to <span className="text-white font-medium">{tipTarget?.username}</span>
            </p>
            <div>
              <Label>Amount</Label>
              <div className="flex gap-2 mt-1">
                {[5, 10, 25, 50, 100].map((amount) => (
                  <button
                    key={amount}
                    onClick={() => setTipAmount(amount.toString())}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                      tipAmount === amount.toString()
                        ? "bg-amber-500 text-white"
                        : "bg-white/5 text-gray-400 hover:bg-white/10"
                    }`}
                    data-testid={`tip-amount-${amount}`}
                  >
                    {amount}
                  </button>
                ))}
              </div>
              <Input
                type="number"
                value={tipAmount}
                onChange={(e) => setTipAmount(e.target.value)}
                className="mt-2 bg-white/5 border-white/10"
                placeholder="Custom amount"
                data-testid="input-tip-amount"
              />
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-400">Your balance:</span>
              <span className="text-amber-400 font-medium">{orbsData?.balance?.toLocaleString() || 0} Orbs</span>
            </div>
            <Button
              onClick={submitTip}
              disabled={!tipAmount || parseInt(tipAmount) <= 0 || parseInt(tipAmount) > (orbsData?.balance || 0) || tipMutation.isPending}
              className="w-full bg-amber-500 hover:bg-amber-600"
              data-testid="submit-tip"
            >
              {tipMutation.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>Send {tipAmount} Orbs</>
              )}
            </Button>
            {parseInt(tipAmount) > (orbsData?.balance || 0) && (
              <p className="text-xs text-red-400 text-center">Insufficient Orbs balance</p>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
