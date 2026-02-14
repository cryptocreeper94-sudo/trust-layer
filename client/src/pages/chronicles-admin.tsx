import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "wouter";
import { 
  Shield, Lock, Eye, EyeOff, Gamepad2, Globe, Users, Sparkles,
  Settings, MapPin, Mic, Award, Calendar, ChevronDown, ChevronRight,
  Plus, Edit3, Trash2, Save, X, Check, Clock, Zap, Crown, Sword,
  Building2, Store, Volume2, Brain, Target, Star, Rocket, ArrowRight,
  RefreshCw, Database, Code, Layers, TrendingUp, AlertCircle, CheckCircle,
  BookOpen, FileText, ScrollText
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

import medievalKingdom from "@assets/generated_images/medieval_fantasy_kingdom.png";

const GlowOrb = ({ color, size, top, left, delay = 0 }: { color: string; size: number; top: string; left: string; delay?: number }) => (
  <motion.div
    className="absolute rounded-full blur-3xl opacity-20 pointer-events-none"
    style={{ background: color, width: size, height: size, top, left }}
    animate={{ scale: [1, 1.2, 1], opacity: [0.15, 0.25, 0.15] }}
    transition={{ duration: 8, repeat: Infinity, delay }}
  />
);

interface Era {
  id: string;
  code: string;
  name: string;
  subtitle: string;
  status: "draft" | "beta" | "live" | "archived";
  timelineOrder: number;
  difficulty: number;
  storefrontCount?: number;
  npcCount?: number;
}

interface Storefront {
  id: string;
  businessName: string;
  businessType: string;
  eraCode: string;
  status: string;
  ownerEmail: string;
}

const MOCK_ERAS: Era[] = [
  { id: "1", code: "medieval", name: "Age of Crowns", subtitle: "Medieval Kingdom", status: "beta", timelineOrder: 1, difficulty: 3, storefrontCount: 12, npcCount: 45 },
  { id: "2", code: "renaissance", name: "Dawn of Reason", subtitle: "Renaissance Italy", status: "draft", timelineOrder: 2, difficulty: 3, storefrontCount: 0, npcCount: 0 },
  { id: "3", code: "industrial", name: "Age of Steam", subtitle: "Industrial Revolution", status: "draft", timelineOrder: 3, difficulty: 4, storefrontCount: 0, npcCount: 0 },
  { id: "4", code: "wildwest", name: "Frontier Justice", subtitle: "Wild West", status: "draft", timelineOrder: 4, difficulty: 4, storefrontCount: 0, npcCount: 0 },
  { id: "5", code: "cyberpunk", name: "Neon Shadows", subtitle: "Cyberpunk Future", status: "draft", timelineOrder: 5, difficulty: 5, storefrontCount: 0, npcCount: 0 },
];

const ROADMAP_ITEMS = [
  { phase: "Season Zero", title: "Medieval BETA", status: "active", progress: 75, items: ["AI NPCs Live", "Chronicle Proofs", "Voice Cloning", "Business Storefronts"] },
  { phase: "Phase 1", title: "Era Expansion", status: "upcoming", progress: 0, items: ["5+ Eras Available", "Cross-Era Travel", "Political Simulation"] },
  { phase: "Phase 2", title: "Full Scale", status: "upcoming", progress: 0, items: ["20+ Eras", "Full Economy", "Mobile Companion"] },
  { phase: "Phase 3", title: "Neverending World", status: "future", progress: 0, items: ["70+ Eras", "Time Travel", "Player-Created Content"] },
];

function PinGate({ onSuccess }: { onSuccess: () => void }) {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(false);
    
    try {
      const res = await fetch("/api/owner/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ secret: password }),
      });
      
      if (res.ok) {
        const data = await res.json();
        sessionStorage.setItem("chroniclesAdminToken", data.token);
        onSuccess();
        toast.success("Welcome to Chronicles Admin");
      } else {
        setError(true);
      }
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center relative overflow-hidden">
      <GlowOrb color="linear-gradient(135deg, #f59e0b, #8b5cf6)" size={400} top="10%" left="10%" />
      <GlowOrb color="linear-gradient(135deg, #ec4899, #06b6d4)" size={300} top="60%" left="70%" delay={2} />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative z-10 bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-3xl p-8 max-w-md w-full mx-4"
        style={{ boxShadow: "0 0 60px rgba(245,158,11,0.15)" }}
      >
        <div className="text-center mb-8">
          <motion.div 
            className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-amber-500/20 to-purple-500/20 border border-amber-500/30 flex items-center justify-center"
            animate={{ boxShadow: ["0 0 20px rgba(245,158,11,0.3)", "0 0 40px rgba(139,92,246,0.3)", "0 0 20px rgba(245,158,11,0.3)"] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            <Gamepad2 className="w-10 h-10 text-amber-400" />
          </motion.div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-amber-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent mb-2">
            Chronicles Admin
          </h1>
          <p className="text-gray-400 text-sm">Game Owner Developer Portal</p>
          <Badge className="mt-2 bg-amber-500/20 text-amber-400 border-amber-500/30">
            BETA v0.1
          </Badge>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => { setPassword(e.target.value); setError(false); }}
              placeholder="Enter admin password"
              className="h-12 bg-slate-800/50 border-white/10 text-white pr-12"
              data-testid="input-chronicles-admin-password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
          
          {error && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-red-400 text-sm text-center"
            >
              Invalid credentials
            </motion.p>
          )}
          
          <Button
            type="submit"
            disabled={loading || !password}
            className="w-full h-12 bg-gradient-to-r from-amber-500 to-purple-500 hover:from-amber-400 hover:to-purple-400 text-white font-semibold"
            data-testid="button-chronicles-admin-login"
          >
            {loading ? "Authenticating..." : "Access Portal"}
          </Button>
        </form>
        
        <div className="mt-6 text-center">
          <Link href="/" className="text-sm text-gray-500 hover:text-gray-300">
            Return to Main Site
          </Link>
        </div>
      </motion.div>
    </div>
  );
}

function BentoCard({ 
  children, 
  className = "", 
  span = "1",
  glow = "cyan",
  onClick
}: { 
  children: React.ReactNode; 
  className?: string; 
  span?: "1" | "2" | "3" | "row";
  glow?: "cyan" | "purple" | "pink" | "amber" | "emerald";
  onClick?: () => void;
}) {
  const glowColors = {
    cyan: "rgba(6,182,212,0.15)",
    purple: "rgba(168,85,247,0.15)",
    pink: "rgba(236,72,153,0.15)",
    amber: "rgba(245,158,11,0.2)",
    emerald: "rgba(16,185,129,0.15)",
  };
  
  const spanClasses = {
    "1": "col-span-1",
    "2": "col-span-1 md:col-span-2",
    "3": "col-span-1 md:col-span-3",
    "row": "col-span-1 md:col-span-2 lg:col-span-4",
  };
  
  return (
    <motion.div
      className={`relative overflow-hidden rounded-2xl border border-white/10 bg-slate-900/80 backdrop-blur-xl p-6 ${spanClasses[span]} ${className} ${onClick ? 'cursor-pointer' : ''}`}
      style={{ boxShadow: `0 0 40px ${glowColors[glow]}` }}
      whileHover={onClick ? { scale: 1.02, borderColor: "rgba(255,255,255,0.2)" } : undefined}
      onClick={onClick}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
}

function AccordionSection({ title, icon: Icon, children, defaultOpen = false, badge }: { 
  title: string; 
  icon: any; 
  children: React.ReactNode; 
  defaultOpen?: boolean;
  badge?: string;
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  
  return (
    <div className="border border-white/10 rounded-xl overflow-hidden bg-slate-900/50 backdrop-blur-sm">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-white/5 transition-colors"
        data-testid={`accordion-${title.toLowerCase().replace(/\s+/g, '-')}`}
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-500/20 to-purple-500/20 flex items-center justify-center">
            <Icon className="w-5 h-5 text-amber-400" />
          </div>
          <span className="font-semibold text-white">{title}</span>
          {badge && (
            <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30 text-xs">
              {badge}
            </Badge>
          )}
        </div>
        <motion.div animate={{ rotate: isOpen ? 180 : 0 }}>
          <ChevronDown className="w-5 h-5 text-gray-400" />
        </motion.div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-6">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function GameDesignDocSection() {
  const [isOpen, setIsOpen] = useState(false);
  const [docContent, setDocContent] = useState<string | null>(null);
  const [docMeta, setDocMeta] = useState<{ lastModified: string; lines: number } | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchDoc = async () => {
    if (docContent) return;
    setLoading(true);
    try {
      const token = sessionStorage.getItem("chroniclesAdminToken");
      const res = await fetch("/api/chronicles/game-design-doc", {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setDocContent(data.content);
        setDocMeta({ lastModified: data.lastModified, lines: data.lines });
      } else {
        toast.error("Failed to load game design document");
      }
    } catch (error) {
      toast.error("Failed to load game design document");
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = () => {
    if (!isOpen) fetchDoc();
    setIsOpen(!isOpen);
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleString();
  };

  return (
    <div className="border border-white/10 rounded-xl overflow-hidden bg-slate-900/50 backdrop-blur-sm">
      <button
        onClick={handleToggle}
        className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-white/5 transition-colors"
        data-testid="accordion-game-design-document"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500/20 to-purple-500/20 flex items-center justify-center">
            <BookOpen className="w-5 h-5 text-cyan-400" />
          </div>
          <span className="font-semibold text-white">Game Design Document</span>
          <Badge className="bg-cyan-500/20 text-cyan-400 border-cyan-500/30 text-xs">
            LIVING DOC
          </Badge>
        </div>
        <motion.div animate={{ rotate: isOpen ? 180 : 0 }}>
          <ChevronDown className="w-5 h-5 text-gray-400" />
        </motion.div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-6">
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <RefreshCw className="w-6 h-6 text-cyan-400 animate-spin" />
                  <span className="ml-2 text-gray-400">Loading document...</span>
                </div>
              ) : docContent ? (
                <div className="space-y-4">
                  {docMeta && (
                    <div className="flex items-center gap-4 p-3 rounded-lg bg-slate-800/50 text-sm">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-cyan-400" />
                        <span className="text-gray-400">{docMeta.lines} lines</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-purple-400" />
                        <span className="text-gray-400">Updated: {formatDate(docMeta.lastModified)}</span>
                      </div>
                    </div>
                  )}
                  <div 
                    className="max-h-[600px] overflow-y-auto rounded-lg bg-slate-950/50 border border-white/5 p-4"
                    style={{ scrollbarWidth: "thin", scrollbarColor: "#4b5563 transparent" }}
                  >
                    <pre className="text-sm text-gray-300 whitespace-pre-wrap font-mono leading-relaxed">
                      {docContent}
                    </pre>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      size="sm"
                      onClick={() => {
                        setDocContent(null);
                        fetchDoc();
                        toast.success("Document refreshed");
                      }}
                      className="bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30 border border-cyan-500/30"
                      data-testid="button-refresh-doc"
                    >
                      <RefreshCw className="w-4 h-4 mr-2" /> Refresh
                    </Button>
                    <Button 
                      size="sm"
                      onClick={() => {
                        navigator.clipboard.writeText(docContent);
                        toast.success("Document copied to clipboard");
                      }}
                      variant="outline"
                      className="border-white/10 text-white hover:bg-white/10"
                      data-testid="button-copy-doc"
                    >
                      <ScrollText className="w-4 h-4 mr-2" /> Copy Full Document
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-400">
                  <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>Failed to load document</p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function EraCarousel({ eras }: { eras: Era[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-white">Era Management</h3>
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => setCurrentIndex(Math.max(0, currentIndex - 1))}
            disabled={currentIndex === 0}
            className="border-white/10 text-white hover:bg-white/10"
            data-testid="button-era-carousel-prev"
          >
            <ChevronRight className="w-4 h-4 rotate-180" />
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setCurrentIndex(Math.min(eras.length - 1, currentIndex + 1))}
            disabled={currentIndex === eras.length - 1}
            className="border-white/10 text-white hover:bg-white/10"
            data-testid="button-era-carousel-next"
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
      
      <div className="relative overflow-hidden">
        <motion.div
          className="flex gap-4"
          animate={{ x: -currentIndex * 320 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          {eras.map((era) => (
            <div
              key={era.id}
              className="w-[300px] shrink-0 p-4 rounded-xl border border-white/10 bg-slate-800/50"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="font-semibold text-white">{era.name}</h4>
                  <p className="text-sm text-gray-400">{era.subtitle}</p>
                </div>
                <Badge className={`text-xs ${
                  era.status === "beta" ? "bg-amber-500/20 text-amber-400 border-amber-500/30" :
                  era.status === "live" ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" :
                  "bg-gray-500/20 text-gray-400 border-gray-500/30"
                }`}>
                  {era.status.toUpperCase()}
                </Badge>
              </div>
              
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="p-2 rounded-lg bg-slate-700/50">
                  <p className="text-gray-400">NPCs</p>
                  <p className="font-semibold text-white">{era.npcCount}</p>
                </div>
                <div className="p-2 rounded-lg bg-slate-700/50">
                  <p className="text-gray-400">Storefronts</p>
                  <p className="font-semibold text-white">{era.storefrontCount}</p>
                </div>
              </div>
              
              <div className="mt-3 flex gap-2">
                <Button size="sm" className="flex-1 bg-amber-500/20 text-amber-400 hover:bg-amber-500/30 border border-amber-500/30" data-testid={`button-edit-era-${era.code}`}>
                  <Edit3 className="w-3 h-3 mr-1" /> Edit
                </Button>
                <Button size="sm" variant="outline" className="border-white/10 text-white hover:bg-white/10" data-testid={`button-settings-era-${era.code}`}>
                  <Settings className="w-3 h-3" />
                </Button>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
      
      <div className="flex justify-center gap-1">
        {eras.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentIndex(i)}
            className={`w-2 h-2 rounded-full transition-colors ${
              i === currentIndex ? "bg-amber-400" : "bg-white/20"
            }`}
          />
        ))}
      </div>
  );
}

function RoadmapProgress() {
  return (
    <div className="space-y-4">
      {ROADMAP_ITEMS.map((item, i) => (
        <div key={i} className="relative">
          {i < ROADMAP_ITEMS.length - 1 && (
            <div className="absolute left-5 top-12 w-0.5 h-full bg-gradient-to-b from-amber-500/50 to-transparent" />
          )}
          <div className="flex gap-4">
            <div className={`w-10 h-10 rounded-full shrink-0 flex items-center justify-center ${
              item.status === "active" ? "bg-amber-500 text-white" :
              item.status === "upcoming" ? "bg-slate-700 text-gray-400 border border-white/20" :
              "bg-slate-800 text-gray-500 border border-white/10"
            }`}>
              {item.status === "active" ? <Zap className="w-5 h-5" /> : 
               item.status === "upcoming" ? <Clock className="w-5 h-5" /> :
               <Star className="w-5 h-5" />}
            </div>
            <div className="flex-1 pb-6">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs text-amber-400 uppercase tracking-wider">{item.phase}</span>
                {item.status === "active" && (
                  <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30 text-xs animate-pulse">
                    NOW
                  </Badge>
                )}
              </div>
              <h4 className="font-semibold text-white mb-2">{item.title}</h4>
              
              {item.status === "active" && (
                <div className="mb-3">
                  <div className="flex justify-between text-xs text-gray-400 mb-1">
                    <span>Progress</span>
                    <span>{item.progress}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-700 overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-amber-500 to-purple-500"
                      initial={{ width: 0 }}
                      animate={{ width: `${item.progress}%` }}
                      transition={{ duration: 1, delay: 0.5 }}
                    />
                  </div>
                </div>
              )}
              
              <div className="flex flex-wrap gap-1">
                {item.items.map((task, j) => (
                  <span key={j} className="px-2 py-1 text-xs rounded-full bg-slate-800 text-gray-300 border border-white/10">
                    {task}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  
  const stats = [
    { label: "Active Era", value: "Medieval", icon: Crown, color: "amber" },
    { label: "Total NPCs", value: "45", icon: Users, color: "cyan" },
    { label: "Storefronts", value: "12", icon: Store, color: "purple" },
    { label: "Chronicle Proofs", value: "28", icon: Award, color: "pink" },
  ];

  return (
    <div className="min-h-screen text-white pt-20 pb-12" style={{ background: "linear-gradient(180deg, #070b16, #0c1222, #070b16)" }}>
      <div className="fixed inset-0 pointer-events-none">
        <GlowOrb color="linear-gradient(135deg, #f59e0b, #8b5cf6)" size={500} top="5%" left="5%" />
        <GlowOrb color="linear-gradient(135deg, #06b6d4, #ec4899)" size={400} top="50%" left="80%" delay={2} />
        <GlowOrb color="linear-gradient(135deg, #8b5cf6, #06b6d4)" size={350} top="70%" left="20%" delay={4} />
      </div>

      <main className="px-4 relative z-10">
        <div className="container mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 flex items-start justify-between"
          >
            <div>
            <h1 className="text-4xl md:text-5xl font-display font-black mb-2">
              <span className="bg-gradient-to-r from-amber-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
                Game Command Center
              </span>
            </h1>
            <p className="text-gray-400 text-lg">Manage eras, NPCs, storefronts, and the neverending world</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="border-amber-500/30 text-amber-400 hover:bg-amber-500/10 shrink-0 mt-2"
              onClick={() => { sessionStorage.removeItem("chroniclesAdminToken"); window.location.reload(); }}
              data-testid="button-lock-portal"
            >
              <Lock className="w-4 h-4 mr-2" />
              Lock Portal
            </Button>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {stats.map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <BentoCard glow={stat.color as any}>
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br from-${stat.color}-500/20 to-${stat.color}-500/10 flex items-center justify-center`}>
                      <stat.icon className={`w-6 h-6 text-${stat.color}-400`} />
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">{stat.label}</p>
                      <p className="text-2xl font-bold text-white">{stat.value}</p>
                    </div>
                  </div>
                </BentoCard>
              </motion.div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <BentoCard span="2" glow="amber">
                <div className="flex items-center gap-2 mb-4">
                  <Globe className="w-5 h-5 text-amber-400" />
                  <h3 className="font-semibold text-white">Era Management</h3>
                  <Badge className="ml-auto bg-amber-500/20 text-amber-400 border-amber-500/30">
                    5 Eras Configured
                  </Badge>
                </div>
                <EraCarousel eras={MOCK_ERAS} />
              </BentoCard>

              <div className="space-y-4">
                <AccordionSection title="NPC & AI Management" icon={Brain} badge="45 NPCs" defaultOpen>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div className="p-3 rounded-lg bg-slate-800/50 text-center">
                      <p className="text-2xl font-bold text-cyan-400">45</p>
                      <p className="text-xs text-gray-400">Total NPCs</p>
                    </div>
                    <div className="p-3 rounded-lg bg-slate-800/50 text-center">
                      <p className="text-2xl font-bold text-purple-400">12</p>
                      <p className="text-xs text-gray-400">Key Characters</p>
                    </div>
                    <div className="p-3 rounded-lg bg-slate-800/50 text-center">
                      <p className="text-2xl font-bold text-emerald-400">847</p>
                      <p className="text-xs text-gray-400">Conversations</p>
                    </div>
                    <div className="p-3 rounded-lg bg-slate-800/50 text-center">
                      <p className="text-2xl font-bold text-amber-400">GPT-4o</p>
                      <p className="text-xs text-gray-400">AI Model</p>
                    </div>
                  </div>
                  <div className="mt-4 flex gap-2">
                    <Button className="bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30 border border-cyan-500/30" data-testid="button-add-npc">
                      <Plus className="w-4 h-4 mr-2" /> Add NPC
                    </Button>
                    <Button variant="outline" className="border-white/10 text-white hover:bg-white/10" data-testid="button-ai-settings">
                      <Settings className="w-4 h-4 mr-2" /> AI Settings
                    </Button>
                  </div>
                </AccordionSection>

                <AccordionSection title="Business Storefronts" icon={Store} badge="12 Active">
                  <div className="space-y-3">
                    {[
                      { name: "The Golden Chalice Tavern", type: "Tavern", status: "active" },
                      { name: "Blacksmith's Forge", type: "Craftsman", status: "active" },
                      { name: "Royal Trading Co.", type: "Trading Post", status: "pending" },
                    ].map((store, i) => (
                      <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-slate-800/50">
                        <div className="flex items-center gap-3">
                          <Building2 className="w-5 h-5 text-amber-400" />
                          <div>
                            <p className="font-medium text-white">{store.name}</p>
                            <p className="text-xs text-gray-400">{store.type}</p>
                          </div>
                        </div>
                        <Badge className={`text-xs ${
                          store.status === "active" ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" :
                          "bg-amber-500/20 text-amber-400 border-amber-500/30"
                        }`}>
                          {store.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                  <Button className="w-full mt-4 bg-amber-500/20 text-amber-400 hover:bg-amber-500/30 border border-amber-500/30" data-testid="button-register-storefront">
                    <Plus className="w-4 h-4 mr-2" /> Register New Storefront
                  </Button>
                </AccordionSection>

                <AccordionSection title="Chronicle Proofs" icon={Award} badge="28 Templates">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 rounded-lg bg-slate-800/50">
                      <div className="flex items-center gap-2 mb-2">
                        <Target className="w-4 h-4 text-purple-400" />
                        <span className="text-sm font-medium text-white">Decision Proofs</span>
                      </div>
                      <p className="text-2xl font-bold text-purple-400">12</p>
                    </div>
                    <div className="p-3 rounded-lg bg-slate-800/50">
                      <div className="flex items-center gap-2 mb-2">
                        <Star className="w-4 h-4 text-amber-400" />
                        <span className="text-sm font-medium text-white">Achievement Proofs</span>
                      </div>
                      <p className="text-2xl font-bold text-amber-400">8</p>
                    </div>
                    <div className="p-3 rounded-lg bg-slate-800/50">
                      <div className="flex items-center gap-2 mb-2">
                        <Users className="w-4 h-4 text-cyan-400" />
                        <span className="text-sm font-medium text-white">Relationship Proofs</span>
                      </div>
                      <p className="text-2xl font-bold text-cyan-400">5</p>
                    </div>
                    <div className="p-3 rounded-lg bg-slate-800/50">
                      <div className="flex items-center gap-2 mb-2">
                        <Globe className="w-4 h-4 text-emerald-400" />
                        <span className="text-sm font-medium text-white">Discovery Proofs</span>
                      </div>
                      <p className="text-2xl font-bold text-emerald-400">3</p>
                    </div>
                  </div>
                </AccordionSection>

                <AccordionSection title="Voice Cloning" icon={Mic}>
                  <div className="flex items-center gap-4 p-4 rounded-lg bg-slate-800/50">
                    <Volume2 className="w-8 h-8 text-purple-400" />
                    <div className="flex-1">
                      <p className="font-medium text-white">ElevenLabs Integration</p>
                      <p className="text-sm text-gray-400">Connected • 5 voice profiles active</p>
                    </div>
                    <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
                      <CheckCircle className="w-3 h-3 mr-1" /> Active
                    </Badge>
                  </div>
                </AccordionSection>

                <AccordionSection title="Season Controls" icon={Calendar}>
                  <div className="p-4 rounded-lg bg-gradient-to-br from-amber-500/10 to-purple-500/10 border border-amber-500/20">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h4 className="font-semibold text-white">Season Zero: Age of Crowns</h4>
                        <p className="text-sm text-gray-400">Medieval BETA • Active</p>
                      </div>
                      <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30 animate-pulse">
                        LIVE
                      </Badge>
                    </div>
                    <div className="grid grid-cols-3 gap-3 text-center">
                      <div>
                        <p className="text-xl font-bold text-white">TBA</p>
                        <p className="text-xs text-gray-400">End Date</p>
                      </div>
                      <div>
                        <p className="text-xl font-bold text-white">1,247</p>
                        <p className="text-xs text-gray-400">Players</p>
                      </div>
                      <div>
                        <p className="text-xl font-bold text-white">75%</p>
                        <p className="text-xs text-gray-400">Complete</p>
                      </div>
                    </div>
                  </div>
                </AccordionSection>

                <GameDesignDocSection />
              </div>
            </div>

            <div className="space-y-6">
              <BentoCard glow="purple">
                <div className="flex items-center gap-2 mb-4">
                  <Rocket className="w-5 h-5 text-purple-400" />
                  <h3 className="font-semibold text-white">Roadmap to Completion</h3>
                </div>
                <RoadmapProgress />
              </BentoCard>

              <BentoCard glow="cyan">
                <div className="flex items-center gap-2 mb-4">
                  <Database className="w-5 h-5 text-cyan-400" />
                  <h3 className="font-semibold text-white">System Status</h3>
                </div>
                <div className="space-y-3">
                  {[
                    { name: "Blockchain", status: "operational", icon: Layers },
                    { name: "AI Engine", status: "operational", icon: Brain },
                    { name: "Voice API", status: "operational", icon: Mic },
                    { name: "Database", status: "operational", icon: Database },
                  ].map((service, i) => (
                    <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-slate-800/50">
                      <div className="flex items-center gap-2">
                        <service.icon className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-white">{service.name}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                        <span className="text-xs text-emerald-400">Operational</span>
                      </div>
                    </div>
                  ))}
                </div>
              </BentoCard>

              <BentoCard glow="amber">
                <div className="flex items-center gap-2 mb-4">
                  <TrendingUp className="w-5 h-5 text-amber-400" />
                  <h3 className="font-semibold text-white">Quick Actions</h3>
                </div>
                <div className="space-y-2">
                  <Button className="w-full justify-start bg-slate-800/50 hover:bg-slate-700/50 text-white border border-white/10" data-testid="button-create-era">
                    <Plus className="w-4 h-4 mr-2 text-amber-400" /> Create New Era
                  </Button>
                  <Button className="w-full justify-start bg-slate-800/50 hover:bg-slate-700/50 text-white border border-white/10" data-testid="button-add-npc-character">
                    <Users className="w-4 h-4 mr-2 text-cyan-400" /> Add NPC Character
                  </Button>
                  <Button className="w-full justify-start bg-slate-800/50 hover:bg-slate-700/50 text-white border border-white/10" data-testid="button-new-chronicle-proof">
                    <Award className="w-4 h-4 mr-2 text-purple-400" /> New Chronicle Proof
                  </Button>
                  <Button className="w-full justify-start bg-slate-800/50 hover:bg-slate-700/50 text-white border border-white/10" data-testid="button-sync-data">
                    <RefreshCw className="w-4 h-4 mr-2 text-emerald-400" /> Sync All Data
                  </Button>
                </div>
              </BentoCard>
            </div>
          </div>
        </div>
      </main>
  );
}

export default function ChroniclesAdmin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = sessionStorage.getItem("chroniclesAdminToken");
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  return (
    <AnimatePresence mode="wait">
      {isAuthenticated ? (
        <motion.div
          key="dashboard"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <AdminDashboard />
        </motion.div>
      ) : (
        <motion.div
          key="gate"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <PinGate onSuccess={() => setIsAuthenticated(true)} />
        </motion.div>
      )}
    </AnimatePresence>
    </PinGate>
  );
}
