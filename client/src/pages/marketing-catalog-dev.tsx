import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { 
  ArrowLeft, Copy, Check, Facebook, Twitter, Image, MessageSquare,
  Sparkles, TrendingUp, Shield, Users, Coins, Zap, Heart, Star,
  Calendar, RefreshCw
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/glass-card";
import { Badge } from "@/components/ui/badge";

const X_FACEBOOK_MESSAGES = {
  evergreen: [
    {
      id: "ev1",
      title: "Trust Layer Introduction",
      message: "Tired of anonymous chaos in crypto? Trust Layer brings verified identity, real accountability, and transparent operations to Web3. No more rugs. No more ghosts. Just real people building something real. Your identity stays private, but your reputation is earned. This is YOUR Trust Layer. 🛡️",
      platforms: ["x", "facebook"],
      theme: "trust"
    },
    {
      id: "ev2", 
      title: "Community Ownership",
      message: "This isn't our project — it's YOURS. Trust Layer is 100% community-owned. No VCs calling shots. No faceless corporations. Just real people with real stakes building real value together. Governance transitions fully to YOU as we grow. Ready to own something? 🚀",
      platforms: ["x", "facebook"],
      theme: "community"
    },
    {
      id: "ev3",
      title: "Signal Token Value",
      message: "Signal (SIG) isn't just another token — it's your stake in the ecosystem. Swap it. Stake it. Earn with it. Use it. Unlike hype coins with zero utility, Signal powers real infrastructure: verified identity, business trust networks, and community governance. Real value. Real utility. 💎",
      platforms: ["x", "facebook"],
      theme: "token"
    },
    {
      id: "ev4",
      title: "DeFi Suite",
      message: "Trust Layer DeFi isn't about gambling — it's about building. Swap tokens with minimal fees. Stake SIG for passive rewards. Provide liquidity and earn. All powered by verified participants, not anonymous bots. DeFi the way it should be: transparent, accountable, and rewarding. 📈",
      platforms: ["x", "facebook"],
      theme: "defi"
    },
    {
      id: "ev5",
      title: "Academy Learning",
      message: "New to crypto? No worries. Trust Layer Academy explains everything in plain English — no jargon, no gatekeeping. Learn at your own pace. Earn credentials. Join confident, not confused. Education should unlock doors, not create barriers. Start learning free today. 🎓",
      platforms: ["x", "facebook"],
      theme: "education"
    },
    {
      id: "ev6",
      title: "Business Trust Networks",
      message: "B2B without the BS. Trust Layer provides verified identity infrastructure for businesses. Know who you're dealing with. Build trusted partnerships. Create transparent audit trails. Enterprise-grade trust for the decentralized age. Your reputation, verified. 🏢",
      platforms: ["x", "facebook"],
      theme: "business"
    },
    {
      id: "ev7",
      title: "Disrupting the Noise",
      message: "The noise is everywhere — projects that promise everything and deliver nothing. We're different. We're building YOUR Trust Layer for the long haul. No hype cycles. No shortcuts. Just a community growing together at the right pace. Disrupting the noise. Building what lasts. 🎯",
      platforms: ["x", "facebook"],
      theme: "philosophy"
    },
    {
      id: "ev8",
      title: "Guardian Security",
      message: "Security isn't optional — it's foundational. Guardian Shield monitors the ecosystem 24/7. Guardian Certification audits every smart contract. Your assets protected by real security infrastructure, not just promises. Trust, verified. Security, guaranteed. 🔒",
      platforms: ["x", "facebook"],
      theme: "security"
    }
  ],
  seasonal: [
    {
      id: "ss1",
      title: "Presale Now Live",
      message: "🚨 PRESALE LIVE: Signal (SIG) available at $0.001 — that's 10x below TGE price. Early supporters get first access to governance seats, exclusive rewards, and founding member status. Limited allocation. Real opportunity. Join the founding community today. Link in bio. 🔥",
      platforms: ["x", "facebook"],
      theme: "presale"
    },
    {
      id: "ss2",
      title: "Early Adopter Rewards",
      message: "First 1,000 members get MASSIVE bonuses. Top 100 get founding member status + governance priority. Top 10 get Legacy recognition forever. Your position matters. Your timing matters. Don't be the one who waited too long. Secure your spot NOW. ⚡",
      platforms: ["x", "facebook"],
      theme: "urgency"
    },
    {
      id: "ss3",
      title: "Shells Earning",
      message: "Earn Shells NOW — convert to Signal at TGE. Complete quests, engage with community, create content, refer friends. Every Shell = real future value. The grind starts before launch. The rewards last forever. Start earning your stake today. 🐚",
      platforms: ["x", "facebook"],
      theme: "earning"
    },
    {
      id: "ss4",
      title: "Building in Public",
      message: "We're building in public. Watch us grow. See every update. Track every milestone. No secrets. No smoke and mirrors. Just transparent progress from foundation to launch. Follow along as YOUR Trust Layer takes shape. Beta access open now. 🔨",
      platforms: ["x", "facebook"],
      theme: "transparency"
    }
  ]
};

const IMAGE_ASSETS = [
  {
    id: "img1",
    name: "Trust Shield Hero",
    description: "Main brand shield with cosmic glow - use for major announcements",
    url: "/images/darkwave_emblem.png",
    platforms: ["x", "facebook"],
    usage: "Hero posts, major announcements"
  },
  {
    id: "img2",
    name: "Trust Layer Concept",
    description: "Visual showing verified identity + accountability",
    placeholder: "Generate: Futuristic trust network visualization, glowing nodes connected by secure lines, dark background with cyan/purple accents",
    platforms: ["x", "facebook"],
    usage: "Trust Layer features"
  },
  {
    id: "img3",
    name: "Community Governance",
    description: "Visual showing community ownership and voting",
    placeholder: "Generate: Decentralized governance concept, diverse people silhouettes connected to central glowing council, empowerment theme",
    platforms: ["x", "facebook"],
    usage: "Governance announcements"
  },
  {
    id: "img4",
    name: "Signal Token",
    description: "SIG token visual with utility icons",
    placeholder: "Generate: Sleek token design with 'SIG' text, surrounded by utility icons (swap, stake, vote, access), premium dark aesthetic",
    platforms: ["x", "facebook"],
    usage: "Token/DeFi content"
  },
  {
    id: "img5",
    name: "Presale Announcement",
    description: "Urgent presale visual with countdown feel",
    placeholder: "Generate: 'PRESALE LIVE' bold text, $0.001 price point, rocket trajectory, urgency without being scammy, professional",
    platforms: ["x", "facebook"],
    usage: "Presale promotions"
  },
  {
    id: "img6",
    name: "Academy Learning",
    description: "Education/onboarding visual",
    placeholder: "Generate: Welcoming academy visual, graduation cap with blockchain elements, 'Learn. Grow. Earn.' theme, approachable",
    platforms: ["x", "facebook"],
    usage: "Education content"
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

export default function MarketingCatalogDev() {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"messages" | "images">("messages");
  const [filter, setFilter] = useState<"all" | "evergreen" | "seasonal">("all");

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const allMessages = filter === "all" 
    ? [...X_FACEBOOK_MESSAGES.evergreen, ...X_FACEBOOK_MESSAGES.seasonal]
    : filter === "evergreen" 
      ? X_FACEBOOK_MESSAGES.evergreen 
      : X_FACEBOOK_MESSAGES.seasonal;

  return (
    <div className="min-h-screen bg-slate-950 text-white relative overflow-hidden">
      <GlowOrb color="linear-gradient(135deg, #06b6d4, #8b5cf6)" size={600} top="-10%" left="-10%" />
      <GlowOrb color="linear-gradient(135deg, #3b82f6, #06b6d4)" size={500} top="50%" left="70%" delay={2} />
      

      <div className="relative z-10 max-w-6xl mx-auto px-4 py-8 pt-20">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Link href="/owner-admin">
            <Button variant="ghost" size="sm" className="mb-4 text-slate-400 hover:text-white">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Developer Portal
            </Button>
          </Link>
          
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500">
              <MessageSquare className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold">
              <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                X & Facebook
              </span>{" "}
              Marketing Catalog
            </h1>
          </div>
          <p className="text-slate-400">Ready-to-use content for your social campaigns</p>
          
          <div className="flex items-center gap-2 mt-4">
            <Twitter className="w-5 h-5 text-sky-400" />
            <Facebook className="w-5 h-5 text-blue-500" />
            <span className="text-sm text-slate-500">Optimized for both platforms</span>
          </div>
        </motion.div>

        <div className="flex flex-wrap gap-3 mb-6">
          <Button
            variant={activeTab === "messages" ? "default" : "outline"}
            onClick={() => setActiveTab("messages")}
            className={activeTab === "messages" ? "bg-cyan-600" : "border-slate-700"}
          >
            <MessageSquare className="w-4 h-4 mr-2" />
            Messages ({X_FACEBOOK_MESSAGES.evergreen.length + X_FACEBOOK_MESSAGES.seasonal.length})
          </Button>
          <Button
            variant={activeTab === "images" ? "default" : "outline"}
            onClick={() => setActiveTab("images")}
            className={activeTab === "images" ? "bg-cyan-600" : "border-slate-700"}
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
                className={`cursor-pointer ${filter === "all" ? "bg-cyan-600" : "border-slate-700"}`}
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
                Evergreen ({X_FACEBOOK_MESSAGES.evergreen.length})
              </Badge>
              <Badge 
                variant={filter === "seasonal" ? "default" : "outline"}
                className={`cursor-pointer ${filter === "seasonal" ? "bg-orange-600" : "border-slate-700"}`}
                onClick={() => setFilter("seasonal")}
              >
                <Calendar className="w-3 h-3 mr-1" />
                Seasonal ({X_FACEBOOK_MESSAGES.seasonal.length})
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
                          {X_FACEBOOK_MESSAGES.seasonal.includes(msg) ? (
                            <Badge className="text-xs bg-orange-600/20 text-orange-400 border-orange-500/30">
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
                    <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-wrap">{msg.message}</p>
                    <div className="flex items-center gap-2 mt-3 text-xs text-slate-500">
                      <span>{msg.message.length} characters</span>
                      <span>•</span>
                      <Twitter className="w-3 h-3" />
                      <Facebook className="w-3 h-3" />
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
          <p className="text-xs mt-1">X & Facebook Content • Developer Access</p>
        </div>
      </div>
    </div>
  );
}
