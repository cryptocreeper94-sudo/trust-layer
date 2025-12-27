import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  MessageCircle, Users, Bot, Hash, Bell, Settings, Search,
  Plus, ChevronRight, ChevronDown, Sparkles, Crown, Shield,
  Zap, Star, Heart, Send, Smile, Image, Mic, MoreHorizontal,
  Home, Compass, Radio, Lock, Globe, ArrowLeft, Menu, X, Loader2
} from "lucide-react";
import { Footer } from "@/components/footer";
import { GlassCard } from "@/components/glass-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import orbitLogo from "@assets/generated_images/futuristic_abstract_geometric_logo_symbol_for_orbit.png";

const COMMUNITY_COLORS = [
  "from-cyan-500 to-blue-600",
  "from-purple-500 to-pink-600", 
  "from-emerald-500 to-teal-600",
  "from-amber-500 to-orange-600",
  "from-rose-500 to-red-600",
  "from-indigo-500 to-violet-600",
];

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

function MessageBubble({ message }: { message: any }) {
  const time = new Date(message.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex gap-3 px-4 py-2 hover:bg-white/5 rounded-lg group"
    >
      <Avatar className={`w-10 h-10 ${message.isBot ? "bg-purple-500/30 border border-purple-500/50" : "bg-gradient-to-br from-cyan-500 to-purple-500"}`}>
        <AvatarFallback className="text-sm">{message.username?.slice(0, 2).toUpperCase() || "??"}</AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className={`font-medium text-sm ${message.isBot ? "text-purple-400" : "text-white"}`}>
            {message.username}
          </span>
          {message.isBot && (
            <Badge className="h-4 text-[10px] bg-purple-500/20 text-purple-400 border-purple-500/30">BOT</Badge>
          )}
          <span className="text-[10px] text-gray-500">{time}</span>
        </div>
        <p className="text-sm text-gray-300 mt-0.5">{message.content}</p>
      </div>
      <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
        <button className="p-1 hover:bg-white/10 rounded"><Smile className="w-4 h-4 text-gray-400" /></button>
        <button className="p-1 hover:bg-white/10 rounded"><MoreHorizontal className="w-4 h-4 text-gray-400" /></button>
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
  const [message, setMessage] = useState("");
  const [newCommunityName, setNewCommunityName] = useState("");
  const [newCommunityDesc, setNewCommunityDesc] = useState("");
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { data: user } = useQuery({
    queryKey: ["/api/auth/user"],
    retry: false,
  });

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
    refetchInterval: 3000,
  });

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

  const sendMessage = useMutation({
    mutationFn: async (data: { channelId: string; content: string }) => {
      const res = await fetch(`/api/channel/${data.channelId}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: data.content }),
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/channel", selectedChannelId, "messages"] });
      setMessage("");
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
  }, [messagesData]);

  const handleSendMessage = () => {
    if (!message.trim() || !selectedChannelId) return;
    sendMessage.mutate({ channelId: selectedChannelId, content: message.trim() });
  };

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
              <img src={orbitLogo} alt="DarkWave" className="w-7 h-7" />
              <span className="font-display font-bold text-lg tracking-tight hidden sm:inline">Community Hub</span>
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
                <button className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/20 transition-all">
                  <Home className="w-5 h-5" />
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

              <div className="w-60 bg-gray-900/60 backdrop-blur-xl border-r border-white/5 flex flex-col">
                <div className="p-4 border-b border-white/5">
                  {selectedCommunity ? (
                    <>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{selectedCommunity.icon || "⚡"}</span>
                          <h2 className="font-bold text-white truncate">{selectedCommunity.name}</h2>
                          {selectedCommunity.isVerified && <Shield className="w-4 h-4 text-cyan-400" />}
                        </div>
                        <ChevronDown className="w-4 h-4 text-gray-400" />
                      </div>
                      <div className="flex items-center gap-3 mt-2 text-xs text-gray-400">
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
                          className="w-full mt-3 bg-cyan-500 hover:bg-cyan-600"
                          onClick={() => joinCommunity.mutate(selectedCommunityId!)}
                          disabled={joinCommunity.isPending}
                          data-testid="join-community-btn"
                        >
                          {joinCommunity.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Join Community"}
                        </Button>
                      )}
                    </>
                  ) : (
                    <p className="text-gray-400 text-sm">Select a community</p>
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

                <div className="p-3 border-t border-white/5 bg-black/20">
                  <div className="flex items-center gap-2">
                    <Avatar className="w-8 h-8 bg-gradient-to-br from-cyan-500 to-purple-500">
                      <AvatarFallback className="text-xs">
                        {user ? (user as any).username?.slice(0, 2).toUpperCase() || "ME" : "??"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white truncate">
                        {user ? (user as any).username || "You" : "Guest"}
                      </p>
                      <p className="text-[10px] text-emerald-400">{user ? "Online" : "Sign in to chat"}</p>
                    </div>
                    <button className="p-1.5 hover:bg-white/10 rounded-lg">
                      <Settings className="w-4 h-4 text-gray-400" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex-1 flex flex-col min-w-0">
          <div className="h-12 border-b border-white/5 bg-gray-900/40 backdrop-blur-sm flex items-center justify-between px-4">
            <div className="flex items-center gap-2">
              <Hash className="w-5 h-5 text-gray-400" />
              <span className="font-medium text-white">{selectedChannel?.name || "Select a channel"}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative hidden sm:block">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <Input 
                  placeholder="Search..." 
                  className="w-48 h-8 pl-9 bg-white/5 border-white/10 text-sm"
                />
              </div>
              <button className="p-2 hover:bg-white/10 rounded-lg">
                <Bell className="w-4 h-4 text-gray-400" />
              </button>
              <button className="p-2 hover:bg-white/10 rounded-lg">
                <Users className="w-4 h-4 text-gray-400" />
              </button>
            </div>
          </div>

          <ScrollArea className="flex-1 py-4">
            {loadingMessages ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 text-gray-400 animate-spin" />
              </div>
            ) : messagesData?.messages?.length > 0 ? (
              <div className="space-y-1">
                {messagesData.messages.map((msg: any) => (
                  <MessageBubble key={msg.id} message={msg} />
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
          </ScrollArea>

          <div className="p-4 border-t border-white/5 bg-gray-900/40">
            <div className="flex items-center gap-2">
              <button className="p-2 hover:bg-white/10 rounded-lg">
                <Plus className="w-5 h-5 text-gray-400" />
              </button>
              <div className="flex-1 relative">
                <Input
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                  placeholder={user ? `Message #${selectedChannel?.name || "channel"}` : "Sign in to send messages"}
                  className="bg-white/5 border-white/10 pr-24"
                  disabled={!user || !selectedChannelId}
                  data-testid="input-message"
                />
                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                  <button className="p-1.5 hover:bg-white/10 rounded"><Image className="w-4 h-4 text-gray-400" /></button>
                  <button className="p-1.5 hover:bg-white/10 rounded"><Smile className="w-4 h-4 text-gray-400" /></button>
                  <button className="p-1.5 hover:bg-white/10 rounded"><Mic className="w-4 h-4 text-gray-400" /></button>
                </div>
              </div>
              <Button 
                size="icon" 
                className="bg-cyan-500 hover:bg-cyan-600"
                onClick={handleSendMessage}
                disabled={!message.trim() || sendMessage.isPending || !user}
                data-testid="send-message-btn"
              >
                {sendMessage.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
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
      </div>
    </div>
  );
}
