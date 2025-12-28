import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "wouter";
import { 
  ArrowLeft, ArrowRight, Lock, Eye, EyeOff, Shield, Target, Zap, Globe, Brain, 
  Layers, Rocket, Users, User, Calendar, TrendingUp, Code, Database,
  Download, FileText, Mail, CheckCircle, Building, Coins, Sparkles,
  ChevronRight, ExternalLink, Play, Server, Cpu, Network, Activity, X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Footer } from "@/components/footer";
import { toast } from "sonner";

import fantasyWorld from "@assets/generated_images/fantasy_sci-fi_world_landscape.png";
import medievalKingdom from "@assets/generated_images/medieval_fantasy_kingdom.png";
import quantumRealm from "@assets/generated_images/quantum_dimension_realm.png";
import deepSpace from "@assets/generated_images/deep_space_station.png";
import cyberpunkCity from "@assets/generated_images/cyberpunk_neon_city.png";
import blockchainBg from "@assets/generated_images/futuristic_blockchain_network_activity_monitor.png";
import orbitLogo from "@assets/generated_images/futuristic_abstract_geometric_logo_symbol_for_orbit.png";

const TECH_STACK = [
  { name: "Blockchain Layer", tech: "DarkWave Smart Chain (PoA)", status: "Live", icon: Database },
  { name: "Frontend", tech: "React 18 + TypeScript + Vite", status: "Production", icon: Code },
  { name: "Backend", tech: "Node.js + Express + PostgreSQL", status: "Production", icon: Server },
  { name: "AI Stack", tech: "3-Tier (Deterministic + LLM + Batch)", status: "In Design", icon: Brain },
  { name: "Graphics Target", tech: "Unreal Engine 5 / Unity", status: "Partnership Needed", icon: Cpu },
  { name: "Networking", tech: "WebSocket + P2P Hybrid", status: "Architecture Ready", icon: Network },
];

const MILESTONES = [
  { phase: "Phase 0", name: "Foundation", period: "Q1-Q2 2026", status: "current", items: ["Core infrastructure", "Community building", "Crowdfunding"] },
  { phase: "Phase 1", name: "Prototype", period: "Q2-Q3 2026", status: "upcoming", items: ["Single-era sandbox", "AI character system", "200 NPCs active"] },
  { phase: "Phase 2", name: "Expansion", period: "Q4 2026", status: "upcoming", items: ["5+ eras live", "Cross-era mechanics", "Property system"] },
  { phase: "Phase 3", name: "Public Beta", period: "July 4, 2026", status: "target", items: ["20+ eras", "Full economy", "Mobile companion"] },
];

const PARTNERSHIP_MODELS = [
  { 
    title: "Co-Development Partner",
    description: "Full collaboration on game development with shared creative input and revenue participation.",
    ideal: "Studios with 20-100 developers, narrative/RPG experience",
    terms: "Revenue share + milestone payments"
  },
  { 
    title: "Graphics & Engine Partner",
    description: "Focus on visual development, character art, environment design, and engine optimization.",
    ideal: "Art studios, UE5/Unity specialists, cinematics houses",
    terms: "Work-for-hire + backend participation"
  },
  { 
    title: "AI/Tech Partner",
    description: "Collaborate on AI systems, NPC behavior, adaptive narrative, and procedural content.",
    ideal: "AI labs, procedural generation specialists",
    terms: "IP licensing + development fees"
  },
];

const DOWNLOADS = [
  { name: "Executive Summary", type: "PDF", size: "2.4 MB", icon: FileText },
  { name: "Technical Architecture", type: "PDF", size: "4.1 MB", icon: Code },
  { name: "Visual Style Guide", type: "PDF", size: "8.7 MB", icon: Sparkles },
  { name: "Roadmap Overview", type: "PDF", size: "1.8 MB", icon: Calendar },
];

const VISION_SLIDES = [
  {
    title: "YOU. The Legend.",
    subtitle: "Not an avatar. Your parallel self across history.",
    description: "Step through a portal and wake up as yourself in another era. Same you, different world. This is what separates Chronicles from every other game.",
    gradient: "from-cyan-500 to-blue-600",
    icon: User,
  },
  {
    title: "70+ Mission Theaters",
    subtitle: "From prehistoric times to speculative futures",
    description: "Each era is a fully realized world with its own campaigns, factions, and rewards. Medieval kingdoms, Renaissance courts, Wild West frontiers, cyberpunk cities.",
    gradient: "from-purple-500 to-pink-600",
    icon: Globe,
  },
  {
    title: "The Many Lenses",
    subtitle: "Reality adapts to what you believe",
    description: "No two players experience the same Chronicles. The AI learns your patterns organically and shapes narratives that feel personally tailored.",
    gradient: "from-pink-500 to-orange-600",
    icon: Brain,
  },
  {
    title: "Community-Driven Worlds",
    subtitle: "Players and businesses shape the universe",
    description: "User-submitted ideas become canon. Real businesses sponsor in-game locations. Your contributions are verified on blockchain.",
    gradient: "from-emerald-500 to-cyan-600",
    icon: Users,
  },
  {
    title: "Production-Ready Infrastructure",
    subtitle: "200K+ TPS blockchain powering the ecosystem",
    description: "DarkWave Smart Chain is live and operational. We need world-class partners for graphics, AI, and narrative systems.",
    gradient: "from-amber-500 to-red-600",
    icon: Zap,
  },
];

function VisionShowcase() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (isPaused) {
      setProgress(0);
      return;
    }
    
    const progressInterval = setInterval(() => {
      setProgress((prev) => Math.min(prev + 1.67, 100));
    }, 100);
    
    const slideInterval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % VISION_SLIDES.length);
      setProgress(0);
    }, 6000);
    
    return () => {
      clearInterval(progressInterval);
      clearInterval(slideInterval);
    };
  }, [isPaused, currentSlide]);

  const slide = VISION_SLIDES[currentSlide];
  const SlideIcon = slide.icon;

  return (
    <section className="py-20 px-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-900/50 to-slate-950" />
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
      </div>
      
      <div className="container mx-auto max-w-5xl relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <Badge className="mb-4 px-4 py-2 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border-cyan-500/30 text-white backdrop-blur-sm">
            <Sparkles className="w-4 h-4 mr-2" />
            Executive Overview
          </Badge>
          <h2 className="text-4xl md:text-5xl font-display font-black text-white mb-4">
            <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              The Vision
            </span>
          </h2>
          <p className="text-white/60 text-lg max-w-2xl mx-auto">Five pillars that define the Chronicles experience</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative group"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <div className="absolute -inset-[1px] bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 rounded-3xl opacity-50 group-hover:opacity-75 blur-sm transition-opacity" />
          <div className="absolute -inset-[1px] bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 rounded-3xl opacity-75" />
          
          <div className="relative rounded-3xl overflow-hidden bg-slate-950">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide}
                initial={{ opacity: 0, scale: 1.05 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="relative"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${slide.gradient} opacity-20`} />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-transparent" />
                
                <div className="relative z-10 p-8 md:p-12 lg:p-16 min-h-[400px] md:min-h-[450px] flex flex-col">
                  <div className="flex items-start gap-6 mb-8">
                    <motion.div 
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                      className={`w-20 h-20 md:w-24 md:h-24 rounded-2xl bg-gradient-to-br ${slide.gradient} p-[2px] shrink-0`}
                    >
                      <div className="w-full h-full rounded-2xl bg-slate-950/80 backdrop-blur-xl flex items-center justify-center">
                        <SlideIcon className="w-10 h-10 md:w-12 md:h-12 text-white" />
                      </div>
                    </motion.div>
                    <div className="text-left pt-2">
                      <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, delay: 0.3 }}
                      >
                        <span className="text-xs uppercase tracking-widest text-white/40 mb-2 block">
                          Pillar {currentSlide + 1} of {VISION_SLIDES.length}
                        </span>
                        <h3 className="text-3xl md:text-4xl lg:text-5xl font-display font-black text-white mb-2">
                          {slide.title}
                        </h3>
                        <p className="text-lg md:text-xl text-white/70 font-light">{slide.subtitle}</p>
                      </motion.div>
                    </div>
                  </div>
                  
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    className="flex-1 flex items-center"
                  >
                    <p className="text-xl md:text-2xl text-white/80 leading-relaxed font-light max-w-3xl">
                      {slide.description}
                    </p>
                  </motion.div>
                  
                  <div className="flex items-center justify-between mt-8 pt-6 border-t border-white/10">
                    <div className="flex items-center gap-3">
                      {VISION_SLIDES.map((s, i) => (
                        <button
                          key={i}
                          onClick={() => { setCurrentSlide(i); setProgress(0); }}
                          className="group/dot relative"
                          data-testid={`slide-dot-${i}`}
                        >
                          <div className={`w-12 h-1.5 rounded-full transition-all ${
                            i === currentSlide 
                              ? "bg-white/20" 
                              : i < currentSlide 
                              ? "bg-white/40" 
                              : "bg-white/10 hover:bg-white/20"
                          }`}>
                            {i === currentSlide && (
                              <motion.div 
                                className={`h-full rounded-full bg-gradient-to-r ${slide.gradient}`}
                                style={{ width: `${progress}%` }}
                              />
                            )}
                          </div>
                          <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs text-white/0 group-hover/dot:text-white/60 transition-colors whitespace-nowrap">
                            {s.title.split('.')[0]}
                          </span>
                        </button>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => { setCurrentSlide((prev) => (prev - 1 + VISION_SLIDES.length) % VISION_SLIDES.length); setProgress(0); }}
                        className="w-12 h-12 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 flex items-center justify-center transition-all group/btn"
                        data-testid="slide-prev"
                      >
                        <ArrowLeft className="w-5 h-5 text-white/60 group-hover/btn:text-white transition-colors" />
                      </button>
                      <button
                        onClick={() => { setCurrentSlide((prev) => (prev + 1) % VISION_SLIDES.length); setProgress(0); }}
                        className="w-12 h-12 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 flex items-center justify-center transition-all group/btn"
                        data-testid="slide-next"
                      >
                        <ArrowRight className="w-5 h-5 text-white/60 group-hover/btn:text-white transition-colors" />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
            
            {isPaused && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute top-4 right-4 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/20"
              >
                <span className="text-xs text-white/60">Paused</span>
              </motion.div>
            )}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-8 flex flex-col md:flex-row items-center justify-center gap-4 text-center"
        >
          <p className="text-white/40 text-sm">
            Hover to pause • Click progress bars or arrows to navigate
          </p>
          <span className="hidden md:block text-white/20">•</span>
          <p className="text-white/50 text-sm">
            Want a personal walkthrough? <span className="text-cyan-400">Schedule a call below</span>
          </p>
        </motion.div>
      </div>
    </section>
  );
}

function InteractiveDemo() {
  const [scenario, setScenario] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [era, setEra] = useState("Medieval");

  const generateScenario = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/generate-scenario', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ era, emotionalTone: "tense", complexity: "moderate" }),
      });
      const data = await response.json();
      setScenario(data);
    } catch (err) {
      console.error("Failed to generate scenario:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-16 px-4 bg-slate-900/50">
      <div className="container mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-8"
        >
          <h2 className="text-3xl font-display font-bold text-white mb-4 flex items-center justify-center gap-3">
            <Brain className="w-8 h-8 text-purple-400" />
            AI Engine Demo
          </h2>
          <p className="text-white/60">Experience our scenario generation system - the foundation of Chronicles' adaptive storytelling</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="p-8 rounded-2xl border border-purple-500/20 bg-purple-950/10"
        >
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <select
              value={era}
              onChange={(e) => setEra(e.target.value)}
              className="flex-1 h-12 px-4 rounded-xl bg-slate-800/50 border border-white/10 text-white"
              data-testid="select-era"
            >
              <option value="Medieval">Medieval Kingdom</option>
              <option value="Renaissance">Renaissance Italy</option>
              <option value="Industrial">Industrial Revolution</option>
              <option value="WildWest">Wild West</option>
              <option value="Futuristic">Cyberpunk Future</option>
            </select>
            <Button
              onClick={generateScenario}
              disabled={loading}
              className="h-12 px-8 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-400 hover:to-pink-400 text-white font-semibold"
              data-testid="button-generate-scenario"
            >
              {loading ? "Generating..." : "Generate Scenario"}
            </Button>
          </div>

          {scenario && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <div className="p-4 rounded-xl bg-slate-800/50 border border-white/10">
                <h4 className="text-sm text-purple-400 uppercase tracking-wider mb-2">Setting</h4>
                <p className="text-white/80">{scenario.setting || "A mysterious location awaits..."}</p>
              </div>
              <div className="p-4 rounded-xl bg-slate-800/50 border border-white/10">
                <h4 className="text-sm text-cyan-400 uppercase tracking-wider mb-2">Scenario</h4>
                <p className="text-white/80">{scenario.scenario || scenario.description || "An intriguing situation unfolds..."}</p>
              </div>
              {scenario.characters && scenario.characters.length > 0 && (
                <div className="p-4 rounded-xl bg-slate-800/50 border border-white/10">
                  <h4 className="text-sm text-pink-400 uppercase tracking-wider mb-2">Characters</h4>
                  <div className="flex flex-wrap gap-2">
                    {scenario.characters.map((char: any, i: number) => (
                      <span key={i} className="px-3 py-1 rounded-full bg-pink-500/20 text-pink-300 text-sm">
                        {typeof char === 'string' ? char : char.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              <p className="text-xs text-white/40 text-center mt-4">
                This is a simplified demo. The full system includes emotional states, belief tracking, and adaptive branching.
              </p>
            </motion.div>
          )}

          {!scenario && !loading && (
            <div className="text-center py-8 text-white/40">
              <Brain className="w-12 h-12 mx-auto mb-4 opacity-30" />
              <p>Click "Generate Scenario" to see our AI engine in action</p>
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
}

function LiveStatCard({ label, endpoint, field, color }: { label: string; endpoint: string; field: string; color: string }) {
  const [value, setValue] = useState<string>("...");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStat = async () => {
      try {
        const response = await fetch(endpoint);
        const data = await response.json();
        setValue(data[field] || "N/A");
      } catch {
        setValue("N/A");
      } finally {
        setLoading(false);
      }
    };
    
    fetchStat();
    const interval = setInterval(fetchStat, 5000);
    return () => clearInterval(interval);
  }, [endpoint, field]);

  const colorClasses: Record<string, string> = {
    cyan: "text-cyan-400 border-cyan-500/30 bg-cyan-950/20",
    purple: "text-purple-400 border-purple-500/30 bg-purple-950/20",
    pink: "text-pink-400 border-pink-500/30 bg-pink-950/20",
    emerald: "text-emerald-400 border-emerald-500/30 bg-emerald-950/20",
  };

  return (
    <div className={`p-6 rounded-xl border ${colorClasses[color] || colorClasses.cyan}`} data-testid={`stat-${field}`}>
      <div className={`text-3xl font-bold mb-1 ${loading ? "animate-pulse" : ""}`}>
        {value}
      </div>
      <div className="text-sm text-white/50">{label}</div>
    </div>
  );
}

function AccessRequestForm({ onBack }: { onBack: () => void }) {
  const [formData, setFormData] = useState({
    studioName: "",
    contactName: "",
    email: "",
    website: "",
    teamSize: "",
    expertise: "",
    previousProjects: "",
    interestReason: "",
    partnershipType: "",
    ndaAccepted: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/partner/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      
      const data = await response.json();
      
      if (data.success) {
        setSubmitted(true);
        toast.success("Request submitted! We'll review and get back to you.");
      } else {
        toast.error(data.error || "Failed to submit request");
        setIsSubmitting(false);
      }
    } catch (err) {
      toast.error("Failed to submit request");
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md"
        >
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-emerald-500/20 flex items-center justify-center">
            <CheckCircle className="w-10 h-10 text-emerald-400" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-4">Request Submitted!</h2>
          <p className="text-white/60 mb-8">
            Thank you for your interest in partnering with DarkWave Studios. 
            Our team will review your application and send your access code via email within 2-3 business days.
          </p>
          <Link href="/">
            <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
              Return to Main Site
            </Button>
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 py-12 px-4">
      <div className="container mx-auto max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 text-white/60 hover:text-white mb-8 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to login
          </button>

          <div className="text-center mb-8">
            <h1 className="text-3xl font-display font-bold text-white mb-2">Request Partner Access</h1>
            <p className="text-white/60">Tell us about your studio and partnership interests</p>
          </div>

          <form onSubmit={handleSubmit} className="bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-2xl p-8 space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-white/70 mb-2">Studio/Company Name *</label>
                <Input
                  required
                  value={formData.studioName}
                  onChange={(e) => setFormData({ ...formData, studioName: e.target.value })}
                  className="bg-slate-800/50 border-white/10 text-white"
                  placeholder="Your studio name"
                  data-testid="input-studio-name"
                />
              </div>
              <div>
                <label className="block text-sm text-white/70 mb-2">Contact Name *</label>
                <Input
                  required
                  value={formData.contactName}
                  onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                  className="bg-slate-800/50 border-white/10 text-white"
                  placeholder="Your name"
                  data-testid="input-contact-name"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-white/70 mb-2">Email *</label>
                <Input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="bg-slate-800/50 border-white/10 text-white"
                  placeholder="your@email.com"
                  data-testid="input-email"
                />
              </div>
              <div>
                <label className="block text-sm text-white/70 mb-2">Website</label>
                <Input
                  value={formData.website}
                  onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                  className="bg-slate-800/50 border-white/10 text-white"
                  placeholder="https://yourstudio.com"
                  data-testid="input-website"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-white/70 mb-2">Team Size</label>
                <select
                  value={formData.teamSize}
                  onChange={(e) => setFormData({ ...formData, teamSize: e.target.value })}
                  className="w-full h-10 px-3 rounded-md bg-slate-800/50 border border-white/10 text-white"
                  data-testid="select-team-size"
                >
                  <option value="">Select team size</option>
                  <option value="1-10">1-10 people</option>
                  <option value="11-50">11-50 people</option>
                  <option value="51-200">51-200 people</option>
                  <option value="200+">200+ people</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-white/70 mb-2">Partnership Type</label>
                <select
                  value={formData.partnershipType}
                  onChange={(e) => setFormData({ ...formData, partnershipType: e.target.value })}
                  className="w-full h-10 px-3 rounded-md bg-slate-800/50 border border-white/10 text-white"
                  data-testid="select-partnership-type"
                >
                  <option value="">Select type</option>
                  <option value="co-dev">Co-Development Partner</option>
                  <option value="graphics">Graphics & Engine Partner</option>
                  <option value="ai-tech">AI/Tech Partner</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm text-white/70 mb-2">Your Expertise</label>
              <Input
                value={formData.expertise}
                onChange={(e) => setFormData({ ...formData, expertise: e.target.value })}
                className="bg-slate-800/50 border-white/10 text-white"
                placeholder="e.g., Unreal Engine, AI/ML, Narrative Design, etc."
                data-testid="input-expertise"
              />
            </div>

            <div>
              <label className="block text-sm text-white/70 mb-2">Notable Previous Projects</label>
              <textarea
                value={formData.previousProjects}
                onChange={(e) => setFormData({ ...formData, previousProjects: e.target.value })}
                className="w-full h-24 px-3 py-2 rounded-md bg-slate-800/50 border border-white/10 text-white resize-none"
                placeholder="Share some of your notable work..."
                data-testid="input-previous-projects"
              />
            </div>

            <div>
              <label className="block text-sm text-white/70 mb-2">Why are you interested in Chronicles?</label>
              <textarea
                value={formData.interestReason}
                onChange={(e) => setFormData({ ...formData, interestReason: e.target.value })}
                className="w-full h-24 px-3 py-2 rounded-md bg-slate-800/50 border border-white/10 text-white resize-none"
                placeholder="What excites you about this project?"
                data-testid="input-interest-reason"
              />
            </div>

            <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.ndaAccepted}
                  onChange={(e) => setFormData({ ...formData, ndaAccepted: e.target.checked })}
                  className="mt-1"
                  data-testid="checkbox-nda"
                />
                <span className="text-sm text-white/80">
                  I agree to keep all information shared in the Partner Portal confidential. 
                  I understand that all materials, technical details, and business information 
                  are proprietary to DarkWave Studios and may not be shared without written consent.
                </span>
              </label>
            </div>

            <Button
              type="submit"
              disabled={isSubmitting || !formData.ndaAccepted}
              className="w-full h-12 bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-400 hover:to-purple-400 text-white font-semibold"
              data-testid="button-submit-request"
            >
              {isSubmitting ? "Submitting..." : "Submit Request"}
            </Button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}

function PasswordGate({ onUnlock }: { onUnlock: () => void }) {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [showRequestForm, setShowRequestForm] = useState(false);

  if (showRequestForm) {
    return <AccessRequestForm onBack={() => setShowRequestForm(false)} />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsChecking(true);
    setError(false);
    
    try {
      const response = await fetch('/api/partner/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accessCode: password }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        sessionStorage.setItem('partner_token', data.token);
        onUnlock();
        toast.success("Access granted. Welcome to the Partner Portal.");
      } else {
        setError(true);
        setIsChecking(false);
      }
    } catch (err) {
      setError(true);
      setIsChecking(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center px-4">
      <div className="absolute inset-0 overflow-hidden">
        <img 
          src={deepSpace} 
          alt="" 
          className="absolute inset-0 w-full h-full object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/80 via-slate-900/90 to-slate-950" />
      </div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-purple-500/20 border border-white/10 flex items-center justify-center backdrop-blur-sm"
            style={{ boxShadow: "0 0 60px rgba(6, 182, 212, 0.2)" }}
          >
            <img src={orbitLogo} alt="DarkWave" className="w-12 h-12" />
          </motion.div>
          
          <h1 className="text-3xl font-display font-bold text-white mb-2">Partner Portal</h1>
          <p className="text-white/60">Confidential development materials for prospective partners</p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-2xl p-8"
          style={{ boxShadow: "0 0 80px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.05)" }}
        >
          <div className="flex items-center gap-3 mb-6 pb-6 border-b border-white/10">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center">
              <Lock className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <h2 className="text-white font-semibold">Secure Access Required</h2>
              <p className="text-white/50 text-sm">Enter your partner access code</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError(false); }}
                placeholder="Enter access code"
                className={`bg-slate-800/50 border-white/10 text-white placeholder:text-white/30 h-12 pr-12 ${error ? 'border-red-500/50 focus:ring-red-500/20' : 'focus:border-cyan-500/50 focus:ring-cyan-500/20'}`}
                data-testid="input-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/60 transition-colors"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            
            {error && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-red-400 text-sm"
              >
                Invalid access code. Please contact us for partner credentials.
              </motion.p>
            )}

            <Button
              type="submit"
              disabled={isChecking || !password}
              className="w-full h-12 bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-400 hover:to-purple-400 text-white font-semibold"
              data-testid="button-unlock"
            >
              {isChecking ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                />
              ) : (
                <>
                  <Shield className="w-4 h-4 mr-2" />
                  Access Portal
                </>
              )}
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t border-white/10">
            <p className="text-white/40 text-sm mb-4 text-center">Don't have access yet?</p>
            <Button
              variant="outline"
              onClick={() => setShowRequestForm(true)}
              className="w-full border-purple-500/30 text-purple-400 hover:bg-purple-500/10 hover:border-purple-500/50"
              data-testid="button-request-access"
            >
              <Users className="w-4 h-4 mr-2" />
              Request Partner Access
            </Button>
            <p className="text-center mt-4">
              <a 
                href="mailto:partners@darkwavestudios.io" 
                className="inline-flex items-center gap-2 text-white/40 hover:text-cyan-400 text-xs transition-colors"
              >
                <Mail className="w-3 h-3" />
                partners@darkwavestudios.io
              </a>
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-8 text-center"
        >
          <Link href="/" className="inline-flex items-center gap-2 text-white/40 hover:text-white/60 text-sm transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Return to main site
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}

function PartnerContent() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white">
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-slate-950/90 backdrop-blur-xl">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 shrink-0">
            <img src={orbitLogo} alt="DarkWave" className="w-8 h-8" />
            <span className="font-display font-bold text-lg tracking-tight">DarkWave Studios</span>
          </Link>
          <div className="flex items-center gap-3">
            <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
              <Shield className="w-3 h-3 mr-1" />
              Partner Access
            </Badge>
          </div>
        </div>
      </nav>

      <main className="pt-24 pb-16">
        {/* Hero Section */}
        <section className="relative py-20 px-4 overflow-hidden">
          <div className="absolute inset-0">
            <img src={fantasyWorld} alt="" className="absolute inset-0 w-full h-full object-cover opacity-30" />
            <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-950/80 to-slate-950" />
          </div>
          
          <div className="container mx-auto max-w-6xl relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center"
            >
              <Badge className="mb-6 px-4 py-2 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border-cyan-500/30 text-white backdrop-blur-sm">
                <Sparkles className="w-4 h-4 mr-2" />
                Confidential Partner Materials
              </Badge>
              
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-display font-black mb-6">
                <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  DarkWave Chronicles
                </span>
              </h1>
              
              <p className="text-2xl md:text-3xl text-white/80 mb-4 font-light">
                Partnership Opportunity
              </p>
              
              <p className="text-lg text-white/60 max-w-3xl mx-auto mb-10">
                An unprecedented adventure platform spanning 70+ mission theaters where YOU are the hero. 
                We're seeking world-class development partners to bring this vision to life.
              </p>

              <div className="flex flex-wrap justify-center gap-4">
                <div className="px-6 py-3 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm" data-testid="stat-gaming-market">
                  <div className="text-2xl font-bold text-cyan-400">$217B</div>
                  <div className="text-xs text-white/50">Gaming Market</div>
                </div>
                <div className="px-6 py-3 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm" data-testid="stat-mission-theaters">
                  <div className="text-2xl font-bold text-purple-400">70+</div>
                  <div className="text-xs text-white/50">Mission Theaters</div>
                </div>
                <div className="px-6 py-3 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm" data-testid="stat-beta-target">
                  <div className="text-2xl font-bold text-pink-400">July 2026</div>
                  <div className="text-xs text-white/50">Beta Target</div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Executive Vision */}
        <section className="py-16 px-4">
          <div className="container mx-auto max-w-6xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-12"
            >
              <h2 className="text-3xl font-display font-bold text-white mb-4 flex items-center gap-3">
                <Target className="w-8 h-8 text-cyan-400" />
                Executive Vision
              </h2>
            </motion.div>

            <div className="grid lg:grid-cols-2 gap-8">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="relative overflow-hidden rounded-2xl border border-white/10"
                style={{ boxShadow: "0 0 60px rgba(6, 182, 212, 0.1)" }}
              >
                <img src={medievalKingdom} alt="" className="absolute inset-0 w-full h-full object-cover opacity-40" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent" />
                <div className="relative z-10 p-8">
                  <h3 className="text-2xl font-bold text-white mb-4">The Concept</h3>
                  <p className="text-white/80 leading-relaxed mb-4">
                    <span className="text-cyan-400 font-semibold">DarkWave Chronicles</span> is not another MMO or life simulator. 
                    It's an unprecedented adventure platform where players experience history as their <em>parallel self</em>—not 
                    an avatar, but an extension of who they are.
                  </p>
                  <p className="text-white/70 leading-relaxed">
                    Players traverse 70+ mission theaters spanning from prehistoric times to speculative futures, 
                    with AI-driven NPCs that pursue their own goals, remember interactions, and form genuine relationships.
                  </p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="relative overflow-hidden rounded-2xl border border-white/10"
                style={{ boxShadow: "0 0 60px rgba(168, 85, 247, 0.1)" }}
              >
                <img src={quantumRealm} alt="" className="absolute inset-0 w-full h-full object-cover opacity-40" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent" />
                <div className="relative z-10 p-8">
                  <h3 className="text-2xl font-bold text-white mb-4">The Differentiator</h3>
                  <p className="text-white/80 leading-relaxed mb-4">
                    Our <span className="text-purple-400 font-semibold">"Many Lenses"</span> system creates adaptive experiences 
                    where the world subtly responds to how players think, what they question, and what they accept—without 
                    explicit A/B choices.
                  </p>
                  <p className="text-white/70 leading-relaxed">
                    No two players experience the same Chronicles. The AI learns player patterns organically and shapes 
                    narrative experiences that feel personally tailored without being obvious.
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Many Lenses Philosophy - Complete Differentiator Section */}
        <section className="py-20 px-4 bg-gradient-to-b from-purple-950/20 via-slate-900/50 to-cyan-950/20">
          <div className="container mx-auto max-w-6xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <Badge className="mb-6 px-4 py-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 border-purple-500/30 text-white backdrop-blur-sm">
                <Brain className="w-4 h-4 mr-2" />
                Proprietary AI Philosophy
              </Badge>
              <h2 className="text-4xl md:text-5xl font-display font-black mb-6">
                <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
                  The Many Lenses Design
                </span>
              </h2>
              <p className="text-xl text-white/70 max-w-3xl mx-auto">
                What makes Chronicles fundamentally different from every other game ever made
              </p>
            </motion.div>

            <div className="grid lg:grid-cols-2 gap-12 mb-16">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="space-y-6"
              >
                <div className="p-6 rounded-2xl bg-red-950/30 border border-red-500/20">
                  <h3 className="text-xl font-bold text-red-400 mb-4 flex items-center gap-3">
                    <X className="w-6 h-6" />
                    What Other Games Do
                  </h3>
                  <ul className="space-y-3 text-white/70">
                    <li className="flex items-start gap-3">
                      <span className="text-red-400 shrink-0">✗</span>
                      <span><strong className="text-white">Moral Alignment:</strong> Good/Evil, Light/Dark, Paragon/Renegade meters that judge your choices</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-red-400 shrink-0">✗</span>
                      <span><strong className="text-white">Character Classes:</strong> Pick "Warrior" or "Mage" and be locked into that identity</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-red-400 shrink-0">✗</span>
                      <span><strong className="text-white">Personality Archetypes:</strong> "You are a Guardian" or "You are a Rebel" based on a quiz</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-red-400 shrink-0">✗</span>
                      <span><strong className="text-white">Karma Systems:</strong> NPCs treat you differently based on arbitrary "good" or "bad" scores</span>
                    </li>
                  </ul>
                </div>

                <div className="p-6 rounded-2xl bg-emerald-950/30 border border-emerald-500/20">
                  <h3 className="text-xl font-bold text-emerald-400 mb-4 flex items-center gap-3">
                    <CheckCircle className="w-6 h-6" />
                    What Chronicles Does
                  </h3>
                  <ul className="space-y-3 text-white/70">
                    <li className="flex items-start gap-3">
                      <span className="text-emerald-400 shrink-0">✓</span>
                      <span><strong className="text-white">Lens Markers:</strong> Observe HOW you decide, not WHETHER decisions are "right" - Courage↔Fear, Hope↔Despair, Trust↔Suspicion</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-emerald-400 shrink-0">✓</span>
                      <span><strong className="text-white">Emergent Identity:</strong> YOU define who you are through choices - no predetermined boxes</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-emerald-400 shrink-0">✓</span>
                      <span><strong className="text-white">Choice Signatures:</strong> "Your choices reveal an affinity for connection" not "You are Chaotic Good"</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-emerald-400 shrink-0">✓</span>
                      <span><strong className="text-white">Reality Adapts:</strong> The world subtly shifts based on your emerging patterns - not punishes or rewards</span>
                    </li>
                  </ul>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="space-y-6"
              >
                <div className="relative overflow-hidden rounded-2xl border border-purple-500/30 p-8"
                  style={{ boxShadow: "0 0 80px rgba(168, 85, 247, 0.15)" }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-950/50 via-slate-950/80 to-pink-950/50" />
                  <div className="relative z-10">
                    <h3 className="text-2xl font-bold text-white mb-6">The 5-Axis Emotion System</h3>
                    <p className="text-white/70 mb-6">
                      Instead of good/evil, we observe emotional patterns across five dimensions. Each ranges from -100 to +100 - 
                      neither end is "better," they simply reflect different approaches to life.
                    </p>
                    <div className="space-y-4">
                      {[
                        { axis: "Courage ↔ Fear", desc: "How you face danger and uncertainty" },
                        { axis: "Hope ↔ Despair", desc: "Your outlook on the future" },
                        { axis: "Trust ↔ Suspicion", desc: "How you approach relationships" },
                        { axis: "Passion ↔ Apathy", desc: "Your emotional investment in causes" },
                        { axis: "Wisdom ↔ Recklessness", desc: "Your decision-making approach" },
                      ].map((item, i) => (
                        <div key={i} className="flex items-center gap-4 p-3 rounded-lg bg-white/5">
                          <div className="w-3 h-3 rounded-full bg-gradient-to-r from-cyan-400 to-purple-400" />
                          <div>
                            <span className="text-cyan-400 font-semibold">{item.axis}</span>
                            <span className="text-white/50 text-sm ml-2">— {item.desc}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="p-6 rounded-2xl bg-cyan-950/30 border border-cyan-500/20">
                  <h3 className="text-xl font-bold text-cyan-400 mb-4">Deeper Purpose</h3>
                  <p className="text-white/70 leading-relaxed">
                    Chronicles is designed as a <span className="text-cyan-400">questioning and awakening tool</span> disguised as entertainment. 
                    Players naturally explore their own beliefs, biases, and patterns through gameplay - 
                    not through lectures or morality meters, but through organic story experiences.
                  </p>
                </div>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="p-8 rounded-3xl bg-gradient-to-r from-purple-950/40 via-pink-950/40 to-cyan-950/40 border border-purple-500/20 text-center"
              style={{ boxShadow: "0 0 100px rgba(168, 85, 247, 0.1)" }}
            >
              <h3 className="text-2xl font-bold text-white mb-4">Why This Matters for Partners</h3>
              <p className="text-white/70 max-w-3xl mx-auto leading-relaxed">
                This isn't just a design choice - it's a <span className="text-purple-400 font-semibold">competitive moat</span>. 
                No other game operates this way. Players who experience the Many Lenses system describe it as 
                "finally feeling seen" rather than "judged." This creates <span className="text-cyan-400 font-semibold">unprecedented engagement and retention</span> because 
                the experience genuinely adapts to each individual.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Voice Cloning Technology - Industry First */}
        <section className="py-20 px-4 relative overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
          </div>
          
          <div className="container mx-auto max-w-6xl relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <Badge className="mb-6 px-4 py-2 bg-gradient-to-r from-pink-500/20 to-cyan-500/20 border-pink-500/30 text-white backdrop-blur-sm">
                <Sparkles className="w-4 h-4 mr-2" />
                Industry First Technology
              </Badge>
              <h2 className="text-4xl md:text-5xl font-display font-black mb-6">
                <span className="bg-gradient-to-r from-pink-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
                  Your Voice. Your Parallel Self.
                </span>
              </h2>
              <p className="text-xl text-white/70 max-w-3xl mx-auto">
                The first game where your character speaks with YOUR actual voice, accent, and inflections
              </p>
            </motion.div>

            <div className="grid lg:grid-cols-3 gap-8">
              {[
                {
                  step: "1",
                  title: "Record Your Voice",
                  desc: "Provide short voice samples reading curated phrases. Our AI captures your unique vocal signature - your accent, tone, and speech patterns.",
                  icon: "🎙️"
                },
                {
                  step: "2",
                  title: "AI Creates Your Clone",
                  desc: "Advanced voice synthesis technology creates a perfect digital version of YOUR voice that can speak any dialogue naturally.",
                  icon: "🧠"
                },
                {
                  step: "3",
                  title: "Hear Yourself Across Eras",
                  desc: "Your parallel self speaks as a medieval knight, a space captain, a Wild West sheriff - all in YOUR voice. It's genuinely you in another world.",
                  icon: "🌍"
                }
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.15 }}
                  className="relative p-8 rounded-2xl bg-slate-900/80 border border-white/10 backdrop-blur-sm"
                  style={{ boxShadow: "0 0 40px rgba(0,0,0,0.3)" }}
                >
                  <div className="absolute -top-4 -left-4 w-12 h-12 rounded-xl bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center text-xl font-bold shadow-lg">
                    {item.step}
                  </div>
                  <div className="text-4xl mb-4 mt-2">{item.icon}</div>
                  <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
                  <p className="text-white/60 leading-relaxed">{item.desc}</p>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mt-12 p-8 rounded-2xl bg-gradient-to-r from-pink-950/30 to-purple-950/30 border border-pink-500/20 text-center"
            >
              <p className="text-lg text-white/80">
                <span className="text-pink-400 font-semibold">No other game has this.</span> When players hear themselves speaking as characters across history, 
                it creates an emotional connection impossible with generic voice acting. This is true immersion.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Technical Architecture */}
        <section className="py-16 px-4 bg-slate-900/50">
          <div className="container mx-auto max-w-6xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-12"
            >
              <h2 className="text-3xl font-display font-bold text-white mb-4 flex items-center gap-3">
                <Code className="w-8 h-8 text-purple-400" />
                Technical Architecture
              </h2>
              <p className="text-white/60">Current development stack and partnership integration points</p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {TECH_STACK.map((item, i) => (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  className="p-6 rounded-xl bg-slate-800/50 border border-white/10 hover:border-purple-500/30 transition-all group"
                  data-testid={`tech-stack-${item.name.toLowerCase().replace(/\s+/g, '-')}`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <item.icon className="w-6 h-6 text-purple-400" />
                    </div>
                    <Badge 
                      variant="outline" 
                      className={`text-xs ${
                        item.status === 'Live' || item.status === 'Production' 
                          ? 'border-emerald-500/50 text-emerald-400' 
                          : item.status === 'Partnership Needed'
                          ? 'border-amber-500/50 text-amber-400'
                          : 'border-cyan-500/50 text-cyan-400'
                      }`}
                    >
                      {item.status}
                    </Badge>
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-1">{item.name}</h3>
                  <p className="text-white/50 text-sm">{item.tech}</p>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mt-8 p-6 rounded-xl bg-gradient-to-r from-amber-950/30 via-purple-950/30 to-cyan-950/30 border border-amber-500/20"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-amber-500/20 flex items-center justify-center shrink-0">
                  <Sparkles className="w-6 h-6 text-amber-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Partnership Opportunity</h3>
                  <p className="text-white/70">
                    We're seeking partners for <span className="text-amber-400">graphics/engine development</span> and 
                    <span className="text-purple-400"> AI system implementation</span>. The blockchain infrastructure and 
                    web portal are production-ready. We need world-class talent to bring the game experience to life.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Live Blockchain Stats */}
        <section className="py-16 px-4">
          <div className="container mx-auto max-w-6xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-8"
            >
              <h2 className="text-3xl font-display font-bold text-white mb-4 flex items-center gap-3">
                <Activity className="w-8 h-8 text-emerald-400" />
                Live Infrastructure
              </h2>
              <p className="text-white/60">Real-time stats from our production blockchain - not mockups, actual infrastructure</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="grid grid-cols-2 md:grid-cols-4 gap-4"
            >
              <LiveStatCard label="Block Height" endpoint="/api/blockchain/stats" field="currentBlock" color="cyan" />
              <LiveStatCard label="Transactions/sec" endpoint="/api/blockchain/stats" field="tps" color="purple" />
              <LiveStatCard label="Active Validators" endpoint="/api/blockchain/stats" field="activeNodes" color="pink" />
              <LiveStatCard label="Finality Time" endpoint="/api/blockchain/stats" field="finalityTime" color="emerald" />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mt-8 p-6 rounded-xl bg-emerald-950/20 border border-emerald-500/20"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-emerald-400 font-semibold">Production Status: Live</span>
              </div>
              <p className="text-white/70 text-sm">
                Our DarkWave Smart Chain is fully operational with Proof-of-Authority consensus. 
                This isn't a testnet or simulation - it's the same infrastructure that will power Chronicles.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Interactive Demo */}
        <InteractiveDemo />

        {/* Vision Showcase - Animated Slideshow */}
        <VisionShowcase />

        {/* Roadmap */}
        <section className="py-16 px-4">
          <div className="container mx-auto max-w-6xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-12"
            >
              <h2 className="text-3xl font-display font-bold text-white mb-4 flex items-center gap-3">
                <Rocket className="w-8 h-8 text-pink-400" />
                Development Roadmap
              </h2>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {MILESTONES.map((milestone, i) => (
                <motion.div
                  key={milestone.phase}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className={`p-6 rounded-xl border ${
                    milestone.status === 'current' 
                      ? 'bg-cyan-950/30 border-cyan-500/30' 
                      : milestone.status === 'target'
                      ? 'bg-pink-950/30 border-pink-500/30'
                      : 'bg-slate-800/50 border-white/10'
                  }`}
                  data-testid={`milestone-${milestone.phase.toLowerCase().replace(/\s+/g, '-')}`}
                >
                  <Badge 
                    className={`mb-3 ${
                      milestone.status === 'current' 
                        ? 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30' 
                        : milestone.status === 'target'
                        ? 'bg-pink-500/20 text-pink-400 border-pink-500/30'
                        : 'bg-white/5 text-white/50 border-white/10'
                    }`}
                  >
                    {milestone.status === 'current' ? 'Current' : milestone.status === 'target' ? 'Target' : 'Upcoming'}
                  </Badge>
                  <h3 className="text-lg font-bold text-white mb-1">{milestone.phase}</h3>
                  <p className="text-white/80 font-medium mb-1">{milestone.name}</p>
                  <p className="text-white/50 text-sm mb-4">{milestone.period}</p>
                  <ul className="space-y-2">
                    {milestone.items.map((item, j) => (
                      <li key={j} className="flex items-center gap-2 text-sm text-white/60">
                        <CheckCircle className="w-4 h-4 text-white/30 shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Partnership Models */}
        <section className="py-16 px-4 bg-slate-900/50">
          <div className="container mx-auto max-w-6xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-12"
            >
              <h2 className="text-3xl font-display font-bold text-white mb-4 flex items-center gap-3">
                <Users className="w-8 h-8 text-emerald-400" />
                Partnership Models
              </h2>
              <p className="text-white/60">Flexible engagement structures for different partnership types</p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-6">
              {PARTNERSHIP_MODELS.map((model, i) => (
                <motion.div
                  key={model.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="relative overflow-hidden rounded-2xl border border-white/10 hover:border-emerald-500/30 transition-all group"
                  data-testid={`partnership-model-${i}`}
                >
                  <div className="absolute inset-0 bg-gradient-to-b from-emerald-950/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="relative p-8">
                    <h3 className="text-xl font-bold text-white mb-3">{model.title}</h3>
                    <p className="text-white/70 mb-6 leading-relaxed">{model.description}</p>
                    
                    <div className="space-y-4">
                      <div>
                        <p className="text-xs text-white/40 uppercase tracking-wider mb-1">Ideal Partner</p>
                        <p className="text-sm text-white/80">{model.ideal}</p>
                      </div>
                      <div>
                        <p className="text-xs text-white/40 uppercase tracking-wider mb-1">Terms Structure</p>
                        <p className="text-sm text-emerald-400">{model.terms}</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Downloads & Contact */}
        <section className="py-16 px-4">
          <div className="container mx-auto max-w-6xl">
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Downloads */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <h2 className="text-2xl font-display font-bold text-white mb-6 flex items-center gap-3">
                  <Download className="w-6 h-6 text-cyan-400" />
                  Partner Materials
                </h2>
                
                <div className="space-y-3">
                  {DOWNLOADS.map((doc, i) => (
                    <div
                      key={doc.name}
                      className="flex items-center justify-between p-4 rounded-xl bg-slate-800/50 border border-white/10 hover:border-cyan-500/30 transition-all group cursor-pointer"
                      data-testid={`download-${doc.name.toLowerCase().replace(/\s+/g, '-')}`}
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-lg bg-cyan-500/20 flex items-center justify-center">
                          <doc.icon className="w-5 h-5 text-cyan-400" />
                        </div>
                        <div>
                          <p className="text-white font-medium">{doc.name}</p>
                          <p className="text-white/40 text-sm">{doc.type} • {doc.size}</p>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" className="text-cyan-400 hover:text-cyan-300 hover:bg-cyan-500/10" data-testid={`button-download-${i}`}>
                        <Download className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
                
                <p className="mt-4 text-white/40 text-sm">
                  Materials are confidential. By downloading, you agree to our NDA terms.
                </p>
              </motion.div>

              {/* Contact */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <h2 className="text-2xl font-display font-bold text-white mb-6 flex items-center gap-3">
                  <Mail className="w-6 h-6 text-purple-400" />
                  Start the Conversation
                </h2>
                
                <div className="p-8 rounded-2xl bg-gradient-to-br from-purple-950/40 to-cyan-950/40 border border-white/10">
                  <p className="text-white/80 mb-6 leading-relaxed">
                    Interested in exploring a partnership? We'd love to hear from you. 
                    Let's schedule a discovery call to discuss how we can work together.
                  </p>
                  
                  <div className="space-y-4 mb-8">
                    <a 
                      href="mailto:partners@darkwavestudios.io"
                      className="flex items-center gap-3 text-white hover:text-cyan-400 transition-colors"
                      data-testid="link-partner-email"
                    >
                      <Mail className="w-5 h-5" />
                      partners@darkwavestudios.io
                    </a>
                  </div>
                  
                  <Button 
                    size="lg" 
                    className="w-full bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-400 hover:to-purple-400 text-white font-semibold"
                    data-testid="button-schedule-call"
                  >
                    <Calendar className="w-5 h-5 mr-2" />
                    Schedule Discovery Call
                  </Button>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Live Demo Link */}
        <section className="py-16 px-4">
          <div className="container mx-auto max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="relative overflow-hidden rounded-3xl border border-white/10"
              style={{ boxShadow: "0 0 100px rgba(168, 85, 247, 0.15)" }}
            >
              <img src={cyberpunkCity} alt="" className="absolute inset-0 w-full h-full object-cover opacity-40" />
              <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/90 to-slate-950/70" />
              
              <div className="relative z-10 p-12 text-center">
                <Badge className="mb-4 bg-white/10 text-white/80 border-white/20">
                  <Globe className="w-3 h-3 mr-1" /> Live Infrastructure
                </Badge>
                <h2 className="text-3xl font-display font-bold text-white mb-4">
                  See What We've Built
                </h2>
                <p className="text-white/70 mb-8 max-w-2xl mx-auto">
                  Our blockchain infrastructure, web portal, and crowdfunding platform are live and operational. 
                  Explore the production environment to see our development capabilities firsthand.
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                  <Link href="/">
                    <Button size="lg" className="rounded-full gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20">
                      <Globe className="w-5 h-5" />
                      Explore Portal
                    </Button>
                  </Link>
                  <Link href="/explorer">
                    <Button size="lg" className="rounded-full gap-2 bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-400 hover:to-purple-400">
                      <Zap className="w-5 h-5" />
                      View Blockchain
                    </Button>
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default function PartnerPortal() {
  const [isUnlocked, setIsUnlocked] = useState(false);

  return (
    <AnimatePresence mode="wait">
      {isUnlocked ? (
        <motion.div
          key="content"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <PartnerContent />
        </motion.div>
      ) : (
        <motion.div
          key="gate"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <PasswordGate onUnlock={() => setIsUnlocked(true)} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
