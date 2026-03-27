import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { 
  ArrowLeft, Copy, Check, Image, MessageSquare,
  Sparkles, TrendingUp, Shield, Users, Coins, Zap, Heart, Star,
  Calendar, RefreshCw, Hash, Send
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/glass-card";
import { Badge } from "@/components/ui/badge";

const DISCORD_TELEGRAM_MESSAGES = {
  evergreen: [
    {
      id: "ev1",
      title: "Welcome Message",
      message: `🛡️ **Welcome to Trust Layer**

This isn't just another crypto project — it's YOUR Trust Layer.

**What makes us different:**
✅ Verified identity (your privacy protected)
✅ Real accountability (no anonymous rugs)
✅ Community ownership (YOU govern this)
✅ Transparent operations (see everything)

We're building something that lasts. Not another pump and dump. Not another empty promise. Real infrastructure for real people.

**Get started:**
🎓 New to crypto? → Check out the Academy
💰 Want to join early? → See the Presale
🏢 Represent a business? → Explore Trust Layer
👥 Want community? → You're already here!

Let's build YOUR Trust Layer together. 🚀`,
      platforms: ["discord", "telegram"],
      theme: "welcome"
    },
    {
      id: "ev2",
      title: "Signal Token Explainer",
      message: `💎 **What is Signal (SIG)?**

Signal isn't just a token — it's your stake in the ecosystem.

**Utility:**
🔄 **Swap** — Trade with minimal fees
📈 **Stake** — Earn passive rewards
🗳️ **Vote** — Governance power
🔓 **Access** — Premium features

**Tokenomics:**
• Total Supply: 1,000,000,000 SIG
• Presale Price: $0.001
• TGE Price: $0.01 (10x from presale)
• No VCs, no insider dumps

Unlike meme coins with zero utility, Signal powers real infrastructure. Verified identity. Business trust. Community governance.

Real token. Real utility. Real value. 💎`,
      platforms: ["discord", "telegram"],
      theme: "token"
    },
    {
      id: "ev3",
      title: "Trust Layer for Business",
      message: `🏢 **Trust Layer for Business**

B2B without the BS.

**The Problem:**
• Who are you really dealing with?
• Can you trust this new partner?
• How do you verify claims?

**Our Solution:**
✅ Verified business identity
✅ Reputation scoring
✅ Transaction audit trails
✅ Trusted partnership networks
✅ Dispute resolution

Enterprise-grade trust infrastructure for the decentralized age. Your reputation, verified and portable.

DMs open for business inquiries. 🤝`,
      platforms: ["discord", "telegram"],
      theme: "business"
    },
    {
      id: "ev4",
      title: "Community Governance",
      message: `🗳️ **YOUR Voice. YOUR Governance.**

Trust Layer isn't controlled by VCs or insiders. It's controlled by YOU.

**Governance Phases:**
📍 Phase 1 (Now): Founder stewardship
📍 Phase 2 (1K members): First council seats
📍 Phase 3 (5K members): Community elections
📍 Phase 4 (25K members): Full community control

As we grow, power transfers to the community. Not just a promise — it's built into the structure.

Your voice matters here. Use it. 🎯`,
      platforms: ["discord", "telegram"],
      theme: "governance"
    },
    {
      id: "ev5",
      title: "DeFi Suite Overview",
      message: `📈 **Trust Layer DeFi Suite**

DeFi built on trust, not chaos.

**Available Features:**
🔄 **Token Swap** — Low fees, verified participants
💧 **Liquidity Pools** — Provide liquidity, earn rewards
📊 **Staking** — Lock SIG, earn passive income
🎯 **Portfolio Tracker** — All your holdings in one view

**Coming Soon:**
• Liquid Staking (stSIG)
• Cross-chain Bridge
• Advanced Analytics

All powered by verified users — not anonymous bots manipulating markets.

DeFi the way it should be. 🛡️`,
      platforms: ["discord", "telegram"],
      theme: "defi"
    },
    {
      id: "ev6",
      title: "Academy Introduction",
      message: `🎓 **Trust Layer Academy**

Crypto shouldn't be confusing. We make it simple.

**What You'll Learn:**
📚 Crypto fundamentals (no jargon)
🔐 Security best practices
💱 DeFi concepts explained
🌉 Cross-chain bridging
🛡️ Trust Layer operations

**Why It Matters:**
• Learn at your own pace
• Earn credentials
• Join confident, not confused
• No gatekeeping

Education unlocks doors. Start free today. 🚀`,
      platforms: ["discord", "telegram"],
      theme: "education"
    },
    {
      id: "ev7",
      title: "Security First",
      message: `🔒 **Security is Non-Negotiable**

Your assets deserve real protection.

**Guardian Shield:**
• 24/7 ecosystem monitoring
• Threat detection & alerts
• Incident response protocols

**Guardian Certification:**
• Smart contract audits
• Security scoring
• Public verification registry

**Your Protection:**
• Verified participants only
• Transparent operations
• No anonymous bad actors

Trust, verified. Security, guaranteed. 🛡️`,
      platforms: ["discord", "telegram"],
      theme: "security"
    },
    {
      id: "ev8",
      title: "Disrupting the Noise",
      message: `🎯 **Disrupting the Noise**

The noise is everywhere:
❌ Projects promising the moon
❌ Influencers shilling garbage
❌ Rugs, scams, empty promises
❌ Anonymous teams that vanish

**We're different:**
✅ Verified, accountable team
✅ Building in public
✅ No hype cycles
✅ Long-term vision
✅ Community-first always

We're not here to make a quick buck. We're here to build YOUR Trust Layer — something that actually lasts.

Join the signal, cut the noise. 📡`,
      platforms: ["discord", "telegram"],
      theme: "philosophy"
    }
  ],
  seasonal: [
    {
      id: "ss1",
      title: "Presale Announcement",
      message: `🚨 **PRESALE IS LIVE** 🚨

Signal (SIG) now available at **$0.001**

**The Opportunity:**
• Presale: $0.001
• TGE Price: $0.01
• That's **10x** from entry to launch

**What You Get:**
✅ Founding member status
✅ Governance priority
✅ Early adopter rewards
✅ Community recognition

**Limited Allocation.**
First 1,000 members get bonus rewards.
Top 100 get founding status.
Top 10 get Legacy recognition.

Don't wait. Don't miss it. 🔥

👉 Link in announcements`,
      platforms: ["discord", "telegram"],
      theme: "presale"
    },
    {
      id: "ss2",
      title: "Shells Earning Campaign",
      message: `🐚 **Earn Shells NOW**

Shells convert to Signal at TGE. Start earning today.

**How to Earn:**
📅 Daily check-ins: 100 Shells
💬 Engage with posts: 50-75 Shells
🐦 Follow socials: 500 Shells each
👥 Refer friends: 2,500 Shells
📝 Create content: 2,000-10,000 Shells
🎯 Weekly sprints: 5,000 Shells bonus

**Conversion:**
10 Shells = 1 SIG at TGE

The grind starts before launch.
The rewards last forever.

Check #quests for current opportunities! 🎯`,
      platforms: ["discord", "telegram"],
      theme: "earning"
    },
    {
      id: "ss3",
      title: "Weekly Sprint",
      message: `⚡ **WEEKLY SPRINT ACTIVE**

This week's challenges are LIVE!

**Complete all tasks:**
• Daily engagement ✓
• Social sharing ✓
• Community participation ✓
• Content creation ✓

**Rewards:**
🥇 Sprint completion: 5,000 Shells
🏆 Top 10 leaderboard: 10,000 Shells
⭐ Perfect week (7/7): 3,000 Shells bonus

Check your progress in #leaderboard

Let's gooo! 🚀`,
      platforms: ["discord", "telegram"],
      theme: "sprint"
    },
    {
      id: "ss4",
      title: "Milestone Celebration",
      message: `🎉 **MILESTONE REACHED**

We're growing together!

**Community Stats:**
👥 Members: Growing daily
📈 Engagement: Off the charts
🐚 Shells distributed: Millions
💪 Vibe: Unstoppable

Every new member strengthens the network.
Every engagement builds the community.
Every contribution shapes the future.

This is what building something real looks like.

Thank you for being here. 🙏`,
      platforms: ["discord", "telegram"],
      theme: "milestone"
    }
  ]
};

const IMAGE_ASSETS = [
  {
    id: "img1",
    name: "Discord Welcome Banner",
    description: "Wide banner for Discord server welcome channel",
    url: "/images/darkwave_emblem.jpg",
    platforms: ["discord"],
    usage: "Server welcome, announcements"
  },
  {
    id: "img2",
    name: "Telegram Group Header",
    description: "Profile image for Telegram group",
    placeholder: "Generate: Square format Trust Layer logo, high contrast for small display, recognizable at any size",
    platforms: ["telegram"],
    usage: "Group profile, pinned messages"
  },
  {
    id: "img3",
    name: "Quest Announcement",
    description: "Eye-catching quest/challenge visual",
    placeholder: "Generate: Gaming-style quest announcement, treasure chest with glowing shells, 'QUEST ACTIVE' text, exciting energy",
    platforms: ["discord", "telegram"],
    usage: "Quest announcements"
  },
  {
    id: "img4",
    name: "Leaderboard Graphic",
    description: "Weekly leaderboard celebration visual",
    placeholder: "Generate: Leaderboard podium with top 3 positions, trophy, 'TOP CONTRIBUTORS' text, celebration confetti",
    platforms: ["discord", "telegram"],
    usage: "Leaderboard updates"
  },
  {
    id: "img5",
    name: "Presale Reminder",
    description: "Presale live reminder graphic",
    placeholder: "Generate: 'PRESALE LIVE' urgent banner, $0.001 price point, countdown feel, rocket, professional urgency",
    platforms: ["discord", "telegram"],
    usage: "Presale reminders"
  },
  {
    id: "img6",
    name: "Community Milestone",
    description: "Milestone celebration graphic",
    placeholder: "Generate: Celebration milestone graphic, fireworks, community silhouettes, 'WE DID IT' energy, gratitude theme",
    platforms: ["discord", "telegram"],
    usage: "Milestone announcements"
  }
];

const GlowOrb = ({ color, size, top, left, delay = 0 }: { color: string; size: number; top: string; left: string; delay?: number }) => (
  <motion.div
    className="absolute rounded-full blur-3xl opacity-20 pointer-events-none"
    style={{ background: color, width: size, height: size, top, left }}
    animate={{ scale: [1, 1.2, 1], opacity: [0.15, 0.25, 0.15] }}
    transition={{ duration: 8, repeat: Infinity, delay }}
  />
);

export default function MarketingCatalogAdmin() {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"messages" | "images">("messages");
  const [filter, setFilter] = useState<"all" | "evergreen" | "seasonal">("all");

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const allMessages = filter === "all" 
    ? [...DISCORD_TELEGRAM_MESSAGES.evergreen, ...DISCORD_TELEGRAM_MESSAGES.seasonal]
    : filter === "evergreen" 
      ? DISCORD_TELEGRAM_MESSAGES.evergreen 
      : DISCORD_TELEGRAM_MESSAGES.seasonal;

  return (
    <div className="min-h-screen bg-slate-950 text-white relative overflow-hidden">
      <GlowOrb color="linear-gradient(135deg, #8b5cf6, #ec4899)" size={600} top="-10%" left="-10%" />
      <GlowOrb color="linear-gradient(135deg, #06b6d4, #8b5cf6)" size={500} top="50%" left="70%" delay={2} />
      

      <div className="relative z-10 max-w-6xl mx-auto px-4 py-8 pt-20">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Link href="/admin">
            <Button variant="ghost" size="sm" className="mb-4 text-slate-400 hover:text-white">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Admin Dashboard
            </Button>
          </Link>
          
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500">
              <MessageSquare className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold">
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Discord & Telegram
              </span>{" "}
              Marketing Catalog
            </h1>
          </div>
          <p className="text-slate-400">Ready-to-use content for community platforms</p>
          
          <div className="flex items-center gap-2 mt-4">
            <Hash className="w-5 h-5 text-indigo-400" />
            <Send className="w-5 h-5 text-sky-400" />
            <span className="text-sm text-slate-500">Optimized for Discord & Telegram</span>
          </div>
        </motion.div>

        <div className="flex flex-wrap gap-3 mb-6">
          <Button
            variant={activeTab === "messages" ? "default" : "outline"}
            onClick={() => setActiveTab("messages")}
            className={activeTab === "messages" ? "bg-purple-600" : "border-slate-700"}
          >
            <MessageSquare className="w-4 h-4 mr-2" />
            Messages ({DISCORD_TELEGRAM_MESSAGES.evergreen.length + DISCORD_TELEGRAM_MESSAGES.seasonal.length})
          </Button>
          <Button
            variant={activeTab === "images" ? "default" : "outline"}
            onClick={() => setActiveTab("images")}
            className={activeTab === "images" ? "bg-purple-600" : "border-slate-700"}
          >
            <Image className="w-4 h-4 mr-2" />
            Images ({IMAGE_ASSETS.length})
          </Button>
        </div>

        {activeTab === "messages" && (
          <>
            <div className="flex gap-2 mb-6">
              <Badge 
                variant={filter === "all" ? "default" : "outline"}
                className={`cursor-pointer ${filter === "all" ? "bg-purple-600" : "border-slate-700"}`}
                onClick={() => setFilter("all")}
              >
                All
              </Badge>
              <Badge 
                variant={filter === "evergreen" ? "default" : "outline"}
                className={`cursor-pointer ${filter === "evergreen" ? "bg-green-600" : "border-slate-700"}`}
                onClick={() => setFilter("evergreen")}
              >
                <RefreshCw className="w-3 h-3 mr-1" />
                Evergreen ({DISCORD_TELEGRAM_MESSAGES.evergreen.length})
              </Badge>
              <Badge 
                variant={filter === "seasonal" ? "default" : "outline"}
                className={`cursor-pointer ${filter === "seasonal" ? "bg-cyan-600" : "border-slate-700"}`}
                onClick={() => setFilter("seasonal")}
              >
                <Calendar className="w-3 h-3 mr-1" />
                Seasonal ({DISCORD_TELEGRAM_MESSAGES.seasonal.length})
              </Badge>
            </div>

            <div className="grid gap-4">
              {allMessages.map((msg, i) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <GlassCard className="p-6">
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <div>
                        <h3 className="font-semibold text-white">{msg.title}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline" className="text-xs border-slate-700">
                            {msg.theme}
                          </Badge>
                          {DISCORD_TELEGRAM_MESSAGES.seasonal.includes(msg) ? (
                            <Badge className="text-xs bg-cyan-600/20 text-cyan-400 border-cyan-500/30">
                              <Calendar className="w-3 h-3 mr-1" />
                              Seasonal
                            </Badge>
                          ) : (
                            <Badge className="text-xs bg-green-600/20 text-green-400 border-green-500/30">
                              <RefreshCw className="w-3 h-3 mr-1" />
                              Evergreen
                            </Badge>
                          )}
                        </div>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => copyToClipboard(msg.message, msg.id)}
                        className="border-slate-700 shrink-0"
                      >
                        {copiedId === msg.id ? (
                          <><Check className="w-4 h-4 mr-1 text-green-400" /> Copied</>
                        ) : (
                          <><Copy className="w-4 h-4 mr-1" /> Copy</>
                        )}
                      </Button>
                    </div>
                    <pre className="text-slate-300 text-sm leading-relaxed whitespace-pre-wrap font-sans">{msg.message}</pre>
                    <div className="flex items-center gap-2 mt-3 text-xs text-slate-500">
                      <span>{msg.message.length} characters</span>
                      <span>•</span>
                      <Hash className="w-3 h-3" />
                      <Send className="w-3 h-3" />
                    </div>
                  </GlassCard>
                </motion.div>
              ))}
            </div>
          </>
        )}

        {activeTab === "images" && (
          <div className="grid md:grid-cols-2 gap-4">
            {IMAGE_ASSETS.map((img, i) => (
              <motion.div
                key={img.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05 }}
              >
                <GlassCard className="p-6">
                  <div className="aspect-video bg-slate-800/50 rounded-lg mb-4 flex items-center justify-center border border-slate-700/50 overflow-hidden">
                    {img.url ? (
                      <img src={img.url} alt={img.name} className="w-24 h-24 object-contain" />
                    ) : (
                      <div className="text-center p-4">
                        <Image className="w-10 h-10 text-slate-600 mx-auto mb-2" />
                        <p className="text-xs text-slate-500">{img.placeholder}</p>
                      </div>
                    )}
                  </div>
                  <h3 className="font-semibold text-white mb-1">{img.name}</h3>
                  <p className="text-sm text-slate-400 mb-2">{img.description}</p>
                  <Badge variant="outline" className="text-xs border-slate-700">
                    {img.usage}
                  </Badge>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        )}

        <div className="mt-12 text-center text-slate-500 text-sm">
          <p>DarkWave Studios • Marketing Catalog v1.0</p>
          <p className="text-xs mt-1">Discord & Telegram Content • Operations Access</p>
        </div>
      </div>
    </div>
  );
}
