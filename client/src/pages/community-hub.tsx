import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "wouter";
import {
  MessageCircle, Users, Bot, Hash, Bell, Settings, Search,
  Plus, ChevronRight, ChevronDown, Sparkles, Crown, Shield,
  Zap, Star, Heart, Send, Smile, Image, Mic, MoreHorizontal,
  Home, Compass, Radio, Lock, Globe, ArrowLeft, Menu, X
} from "lucide-react";
import { Footer } from "@/components/footer";
import { GlassCard } from "@/components/glass-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import orbitLogo from "@assets/generated_images/futuristic_abstract_geometric_logo_symbol_for_orbit.png";

const SAMPLE_COMMUNITIES = [
  { id: "dwsc", name: "DarkWave Chain", icon: "⚡", members: 2847, online: 342, color: "from-cyan-500 to-blue-600", verified: true },
  { id: "chronicles", name: "Chronicles", icon: "🎮", members: 1523, online: 189, color: "from-purple-500 to-pink-600", verified: true },
  { id: "devs", name: "Developers", icon: "💻", members: 892, online: 67, color: "from-emerald-500 to-teal-600", verified: true },
  { id: "traders", name: "Trading Floor", icon: "📈", members: 3241, online: 521, color: "from-amber-500 to-orange-600", verified: false },
];

const SAMPLE_CHANNELS = [
  { id: "welcome", name: "welcome", icon: Star, type: "info", unread: false },
  { id: "announcements", name: "announcements", icon: Radio, type: "info", unread: true, locked: true },
  { id: "general", name: "general", icon: Hash, type: "chat", unread: true },
  { id: "support", name: "support", icon: MessageCircle, type: "chat", unread: false },
  { id: "dev-chat", name: "dev-chat", icon: Hash, type: "chat", unread: false },
  { id: "bot-commands", name: "bot-commands", icon: Bot, type: "bot", unread: false },
  { id: "price-alerts", name: "price-alerts", icon: Zap, type: "bot", unread: true },
];

const SAMPLE_MESSAGES = [
  { id: 1, user: "CryptoWolf", avatar: "CW", content: "Just bridged 500 DWC from Ethereum. The speed is insane! 🚀", time: "2:34 PM", role: "member" },
  { id: 2, user: "DarkWaveBot", avatar: "🤖", content: "Welcome to the community! Use /help to see available commands.", time: "2:35 PM", role: "bot", isBot: true },
  { id: 3, user: "AlphaTrader", avatar: "AT", content: "Has anyone tried the new liquid staking feature?", time: "2:36 PM", role: "member" },
  { id: 4, user: "ModSarah", avatar: "MS", content: "Yes! APY is looking solid. Check the staking channel for details.", time: "2:37 PM", role: "moderator" },
  { id: 5, user: "NewbieNick", avatar: "NN", content: "This UI is so clean compared to other platforms. Love it!", time: "2:38 PM", role: "member" },
];

const SAMPLE_BOTS = [
  { id: "pricebot", name: "PriceBot", desc: "Real-time DWC price alerts", icon: "📊", active: true },
  { id: "modbot", name: "ModeratorBot", desc: "Auto-moderation & anti-spam", icon: "🛡️", active: true },
  { id: "welcomebot", name: "WelcomeBot", desc: "Greet new members", icon: "👋", active: true },
  { id: "triviabot", name: "TriviaBot", desc: "Daily crypto trivia games", icon: "🎯", active: false },
];

function CommunityIcon({ community }: { community: typeof SAMPLE_COMMUNITIES[0] }) {
  return (
    <motion.div
      whileHover={{ scale: 1.1 }}
      className={`relative w-12 h-12 rounded-2xl bg-gradient-to-br ${community.color} flex items-center justify-center cursor-pointer group`}
    >
      <span className="text-xl">{community.icon}</span>
      {community.verified && (
        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-cyan-500 rounded-full flex items-center justify-center">
          <Shield className="w-2.5 h-2.5 text-white" />
        </div>
      )}
      <div className="absolute left-full ml-3 px-2 py-1 bg-gray-900 rounded text-xs text-white whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
        {community.name}
      </div>
    </motion.div>
  );
}

function ChannelItem({ channel, selected, onClick }: { channel: typeof SAMPLE_CHANNELS[0]; selected: boolean; onClick: () => void }) {
  const Icon = channel.icon;
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${
        selected ? "bg-white/10 text-white" : "text-gray-400 hover:bg-white/5 hover:text-gray-200"
      }`}
    >
      <Icon className={`w-4 h-4 ${channel.type === "bot" ? "text-purple-400" : ""}`} />
      <span className="text-sm flex-1 text-left truncate">{channel.name}</span>
      {channel.locked && <Lock className="w-3 h-3 text-gray-500" />}
      {channel.unread && <div className="w-2 h-2 rounded-full bg-cyan-400" />}
    </button>
  );
}

function MessageBubble({ message }: { message: typeof SAMPLE_MESSAGES[0] }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex gap-3 px-4 py-2 hover:bg-white/5 rounded-lg group"
    >
      <Avatar className={`w-10 h-10 ${message.isBot ? "bg-purple-500/30 border border-purple-500/50" : "bg-gradient-to-br from-cyan-500 to-purple-500"}`}>
        <AvatarFallback className="text-sm">{message.avatar}</AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className={`font-medium text-sm ${
            message.role === "moderator" ? "text-emerald-400" : 
            message.isBot ? "text-purple-400" : "text-white"
          }`}>
            {message.user}
          </span>
          {message.role === "moderator" && (
            <Badge className="h-4 text-[10px] bg-emerald-500/20 text-emerald-400 border-emerald-500/30">MOD</Badge>
          )}
          {message.isBot && (
            <Badge className="h-4 text-[10px] bg-purple-500/20 text-purple-400 border-purple-500/30">BOT</Badge>
          )}
          <span className="text-[10px] text-gray-500">{message.time}</span>
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
  const [selectedCommunity, setSelectedCommunity] = useState(SAMPLE_COMMUNITIES[0]);
  const [selectedChannel, setSelectedChannel] = useState(SAMPLE_CHANNELS[2]);
  const [showSidebar, setShowSidebar] = useState(false);
  const [showBots, setShowBots] = useState(false);
  const [message, setMessage] = useState("");

  return (
    <div className="min-h-screen flex flex-col bg-background overflow-hidden">
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-background/90 backdrop-blur-xl">
        <div className="container mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button 
              className="lg:hidden p-2 hover:bg-white/10 rounded-lg"
              onClick={() => setShowSidebar(!showSidebar)}
            >
              {showSidebar ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <Link href="/" className="flex items-center gap-2 shrink-0">
              <img src={orbitLogo} alt="DarkWave" className="w-7 h-7" />
              <span className="font-display font-bold text-lg tracking-tight hidden sm:inline">DarkWave</span>
            </Link>
          </div>
          <div className="flex items-center gap-2">
            <Badge className="bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border-cyan-500/30 text-cyan-300">
              <Sparkles className="w-3 h-3 mr-1" />
              Coming Soon
            </Badge>
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
          {(showSidebar || window.innerWidth >= 1024) && (
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
                {SAMPLE_COMMUNITIES.map((community) => (
                  <CommunityIcon key={community.id} community={community} />
                ))}
                <div className="w-8 h-px bg-white/10 my-2" />
                <button className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 hover:bg-emerald-500/30 transition-all">
                  <Plus className="w-5 h-5" />
                </button>
              </div>

              <div className="w-60 bg-gray-900/60 backdrop-blur-xl border-r border-white/5 flex flex-col">
                <div className="p-4 border-b border-white/5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{selectedCommunity.icon}</span>
                      <h2 className="font-bold text-white">{selectedCommunity.name}</h2>
                      {selectedCommunity.verified && <Shield className="w-4 h-4 text-cyan-400" />}
                    </div>
                    <ChevronDown className="w-4 h-4 text-gray-400" />
                  </div>
                  <div className="flex items-center gap-3 mt-2 text-xs text-gray-400">
                    <span className="flex items-center gap-1">
                      <Users className="w-3 h-3" /> {selectedCommunity.members.toLocaleString()}
                    </span>
                    <span className="flex items-center gap-1">
                      <div className="w-2 h-2 rounded-full bg-emerald-400" /> {selectedCommunity.online} online
                    </span>
                  </div>
                </div>

                <ScrollArea className="flex-1 p-2">
                  <div className="mb-4">
                    <button 
                      className="w-full flex items-center justify-between px-2 py-1 text-xs text-gray-400 hover:text-gray-200"
                      onClick={() => {}}
                    >
                      <span className="uppercase tracking-wider font-medium">Channels</span>
                      <Plus className="w-3 h-3" />
                    </button>
                    <div className="mt-1 space-y-0.5">
                      {SAMPLE_CHANNELS.filter(c => c.type !== "bot").map((channel) => (
                        <ChannelItem
                          key={channel.id}
                          channel={channel}
                          selected={selectedChannel.id === channel.id}
                          onClick={() => setSelectedChannel(channel)}
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
                        {SAMPLE_CHANNELS.filter(c => c.type === "bot").map((channel) => (
                          <ChannelItem
                            key={channel.id}
                            channel={channel}
                            selected={selectedChannel.id === channel.id}
                            onClick={() => setSelectedChannel(channel)}
                          />
                        ))}
                      </motion.div>
                    )}
                  </div>
                </ScrollArea>

                <div className="p-3 border-t border-white/5 bg-black/20">
                  <div className="flex items-center gap-2">
                    <Avatar className="w-8 h-8 bg-gradient-to-br from-cyan-500 to-purple-500">
                      <AvatarFallback className="text-xs">YU</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white truncate">Your Name</p>
                      <p className="text-[10px] text-emerald-400">Online</p>
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
              <span className="font-medium text-white">{selectedChannel.name}</span>
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
            <div className="space-y-1">
              {SAMPLE_MESSAGES.map((msg) => (
                <MessageBubble key={msg.id} message={msg} />
              ))}
            </div>
            
            <div className="px-4 py-8">
              <GlassCard className="p-6 text-center max-w-md mx-auto">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-purple-500/20 border border-cyan-500/30 flex items-center justify-center">
                  <Sparkles className="w-8 h-8 text-cyan-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Community Hub Coming Soon</h3>
                <p className="text-sm text-gray-400 mb-4">
                  A beautiful, bot-powered community platform built for the DarkWave ecosystem. 
                  Easier than Telegram. Cleaner than Discord. Web3 native.
                </p>
                <div className="flex flex-wrap justify-center gap-2">
                  <Badge variant="outline" className="text-cyan-400 border-cyan-400/30">Real-time Chat</Badge>
                  <Badge variant="outline" className="text-purple-400 border-purple-400/30">Bot Marketplace</Badge>
                  <Badge variant="outline" className="text-pink-400 border-pink-400/30">DWC Tipping</Badge>
                  <Badge variant="outline" className="text-emerald-400 border-emerald-400/30">NFT Gating</Badge>
                </div>
              </GlassCard>
            </div>
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
                  placeholder={`Message #${selectedChannel.name}`}
                  className="bg-white/5 border-white/10 pr-24"
                />
                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                  <button className="p-1.5 hover:bg-white/10 rounded"><Image className="w-4 h-4 text-gray-400" /></button>
                  <button className="p-1.5 hover:bg-white/10 rounded"><Smile className="w-4 h-4 text-gray-400" /></button>
                  <button className="p-1.5 hover:bg-white/10 rounded"><Mic className="w-4 h-4 text-gray-400" /></button>
                </div>
              </div>
              <Button size="icon" className="bg-cyan-500 hover:bg-cyan-600">
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        <div className="hidden xl:block w-60 border-l border-white/5 bg-gray-900/40 backdrop-blur-sm">
          <div className="p-4 border-b border-white/5">
            <h3 className="text-sm font-medium text-white flex items-center gap-2">
              <Bot className="w-4 h-4 text-purple-400" />
              Active Bots
            </h3>
          </div>
          <div className="p-3 space-y-2">
            {SAMPLE_BOTS.map((bot) => (
              <div key={bot.id} className="p-3 rounded-lg bg-white/5 border border-white/10">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{bot.icon}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">{bot.name}</p>
                    <p className="text-[10px] text-gray-400 truncate">{bot.desc}</p>
                  </div>
                  <div className={`w-2 h-2 rounded-full ${bot.active ? "bg-emerald-400" : "bg-gray-500"}`} />
                </div>
              </div>
            ))}
            <Button variant="outline" size="sm" className="w-full border-purple-500/30 text-purple-400 hover:bg-purple-500/10">
              <Plus className="w-3 h-3 mr-1" /> Add Bot
            </Button>
          </div>

          <div className="p-4 border-t border-white/5">
            <h3 className="text-sm font-medium text-white flex items-center gap-2 mb-3">
              <Users className="w-4 h-4 text-cyan-400" />
              Online Members
            </h3>
            <div className="space-y-2">
              {["CryptoWolf", "AlphaTrader", "ModSarah"].map((name, i) => (
                <div key={name} className="flex items-center gap-2">
                  <div className="relative">
                    <Avatar className="w-7 h-7 bg-gradient-to-br from-cyan-500 to-purple-500">
                      <AvatarFallback className="text-[10px]">{name.slice(0, 2)}</AvatarFallback>
                    </Avatar>
                    <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-gray-900" />
                  </div>
                  <span className="text-sm text-gray-300">{name}</span>
                </div>
              ))}
              <p className="text-[10px] text-gray-500">+339 more online</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
