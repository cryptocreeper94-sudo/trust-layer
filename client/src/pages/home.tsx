import { motion, AnimatePresence } from "framer-motion";
import { Link } from "wouter";
import { ArrowRight, Code, Globe, Layers, Shield, Zap, Cpu, Network, Heart, Sparkles, Activity, Server, Droplets, ArrowUpDown, ImageIcon, PieChart, History, Rocket, LineChart, Webhook, Palette, Target, ChevronLeft, ChevronRight, Gift, Search, Share2, Compass, Crown, Star, BookOpen, ExternalLink, Gamepad2, ArrowLeft } from "lucide-react";
import { KenBurnsBackground } from "@/components/ken-burns-background";
import heroBg from "@assets/trust_network_connecting_everything_1769800437573.png";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { OnboardingTour } from "@/components/onboarding-tour";
import { useQuery } from "@tanstack/react-query";
import { fetchEcosystemApps, fetchBlockchainStats } from "@/lib/api";
import { FavoriteButton } from "@/components/favorite-button";
import { SkeletonCard } from "@/components/ui/skeleton-card";
import { usePreferences } from "@/lib/store";
import { usePageAnalytics } from "@/hooks/use-analytics";
import { GlassCard } from "@/components/glass-card";
import { useSimpleAuth } from "@/hooks/use-simple-auth";
import { SimpleLoginModal } from "@/components/simple-login";
import { useState, useRef, useEffect, useCallback } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { GenesisHallmarkBadge } from "@/components/genesis-hallmark-badge";
import tradingImg from "@assets/generated_images/hub_trading_defi.jpg";
import nftImg from "@assets/generated_images/hub_nft_gallery.jpg";
import toolsImg from "@assets/generated_images/hub_smart_contract.jpg";
import devStudioImg from "@assets/generated_images/cc_developer_tools.jpg";
import launchpadImg from "@assets/generated_images/hub_presale_launch.jpg";
import earnImg from "@assets/generated_images/hub_earn_rewards.jpg";
import stoneAgeImg from "@assets/generated_images/stone_age_village_scene.jpg";
import medievalImg from "@assets/generated_images/medieval_castle_vertical_portrait.jpg";
import samuraiImg from "@assets/generated_images/feudal_japan_samurai_castle.jpg";

// ═══════════════════════════════════════════════════════════════
// ECOSYSTEM IMAGE MAP
// ═══════════════════════════════════════════════════════════════
const ecosystemImages: Record<string, string> = {
  "orbit-staffing": "/ecosystem/orbit-staffing-new.jpg",
  "lotopspro": "/ecosystem/lotopspro-new.jpg",
  "lotops-pro": "/ecosystem/lotopspro-new.jpg",
  "brew-board": "/ecosystem/brew-board-new.jpg",
  "garagebot": "/ecosystem/garagebot-prod-new.jpg",
  "garagebot-prod": "/ecosystem/garagebot-prod-new.jpg",
  "darkwave-pulse": "/ecosystem/darkwave-pulse-new.jpg",
  "paintpros": "/ecosystem/paintpros-new.jpg",
  "nashpaintpros": "/ecosystem/paintpros-new.jpg",
  "orby": "/ecosystem/orby-new.jpg",
  "strike-agent": "/ecosystem/strike-agent-new.jpg",
  "veda-solus": "/ecosystem/veda-solus-new.jpg",
  "vedasolus": "/ecosystem/veda-solus-new.jpg",
  "trust-home": "/ecosystem/trust-home-new.jpg",
  "trust-vault": "/ecosystem/trust-vault-new.jpg",
  "guardian-scanner": "/ecosystem/guardian-scanner-new.jpg",
  "guardian-screener": "/ecosystem/guardian-screener-new.jpg",
  "trustshield": "/ecosystem/trustshield-new.jpg",
  "the-void": "/ecosystem/the-void-new.jpg",
  "torque": "/ecosystem/torque-new.jpg",
  "driver-connect": "/ecosystem/driver-connect-new.jpg",
  "trust-layer": "/ecosystem/trust-layer-new.jpg",
  "tlid": "/ecosystem/tlid-new.jpg",
  "chronicles": "/ecosystem/chronicles-new.jpg",
  "the-arcade": "/ecosystem/the-arcade-new.jpg",
  "signal-chat": "/ecosystem/signal-chat-new.jpg",
  "darkwave-studios": "/ecosystem/darkwave-studios-new.jpg",
  "tradeworks-ai": "/ecosystem/tradeworks-ai-new.jpg",
  "signalcast": "/ecosystem/signalcast.jpg",
  "trust-book": "/ecosystem/trust-book-new.jpg",
  "verdara": "/ecosystem/verdara-new.jpg",
  "happy-eats": "/ecosystem/happy-eats.jpg",
};

// ═══════════════════════════════════════════════════════════════
// EXPLORE BUTTON (Beta Dialog)
// ═══════════════════════════════════════════════════════════════
function ExploreButton({ url, appName, accent = "cyan" }: { url?: string; appName: string; accent?: string }) {
  const [open, setOpen] = useState(false);
  const accentMap: Record<string, string> = {
    cyan: "bg-cyan-500 hover:bg-cyan-400",
    purple: "bg-purple-500 hover:bg-purple-400",
    pink: "bg-pink-500 hover:bg-pink-400",
    emerald: "bg-emerald-500 hover:bg-emerald-400",
    violet: "bg-violet-500 hover:bg-violet-400",
    rose: "bg-rose-500 hover:bg-rose-400",
    sky: "bg-sky-500 hover:bg-sky-400",
    teal: "bg-teal-500 hover:bg-teal-400",
  };
  return (
    <>
      <Button
        className={`w-full ${accentMap[accent] || accentMap.cyan} text-black font-bold text-xs py-2 rounded-lg transition-colors`}
        onClick={(e) => { e.preventDefault(); e.stopPropagation(); setOpen(true); }}
        data-testid={`button-explore-${appName.toLowerCase().replace(/\s+/g, '-')}`}
      >
        Explore
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md bg-slate-900 border-white/10">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold flex items-center gap-2">
              <Badge className="bg-purple-500 text-black">Beta</Badge>
              {appName}
            </DialogTitle>
            <DialogDescription asChild>
              <div className="text-white/70 pt-4 space-y-3">
                <p>This application is <strong className="text-white">fully functional</strong> and ready for use.</p>
                <p>As a Beta product, it is constantly being updated with new features and improvements.</p>
                <p className="text-primary">Your data and transactions remain secure throughout all updates.</p>
              </div>
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-3 mt-4">
            <Button variant="outline" className="flex-1 border-white/20 hover:bg-white/5" onClick={() => setOpen(false)}>Cancel</Button>
            <Button className={`flex-1 ${accentMap[accent] || accentMap.cyan} text-black font-bold`} onClick={() => { setOpen(false); if (url) window.open(url, '_blank', 'noopener,noreferrer'); }}>
              I Understand, Continue
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

// ═══════════════════════════════════════════════════════════════
// HERO SLIDESHOW — 9 Curated Slides
// ═══════════════════════════════════════════════════════════════
interface HeroSlide { title: string; subtitle: string; accent: string; link: string; image?: string; gradient: string; }

const heroSlides: HeroSlide[] = [
  { title: "THE VOID", subtitle: "Voice-first mental wellness platform with AI-powered venting, guided breathing, mood analytics, and 20+ wellness tools", accent: "purple", link: "https://intothevoid.app", image: "/ecosystem/the-void-new.jpg", gradient: "from-purple-900/80 via-slate-900/60 to-slate-950/90" },
  { title: "TrustGen 3D", subtitle: "AI-powered 3D creation & code studio with Monaco IDE, Meshy.ai, animation timeline, and blockchain provenance", accent: "violet", link: "https://trustgen.design", image: "/ecosystem/darkwave-studios-new.jpg", gradient: "from-violet-900/80 via-slate-900/60 to-slate-950/90" },
  { title: "Trust Vault", subtitle: "Enterprise-grade digital asset protection with biometric security, encrypted storage, and blockchain custody", accent: "blue", link: "https://trustvault.studio", image: "/ecosystem/trust-vault-new.jpg", gradient: "from-blue-900/80 via-slate-900/60 to-slate-950/90" },
  { title: "Lume", subtitle: "A deterministic natural-language programming language with intent-resolving compilation, 2,160 tests, and 154 patterns", accent: "cyan", link: "https://lume-lang.org", gradient: "from-cyan-900/80 via-slate-900/60 to-slate-950/90" },
  { title: "Happy Eats", subtitle: "Nashville food truck platform with zone-based batch ordering, vendor portal, rewards, and 11 delivery zones", accent: "rose", link: "https://happyeats.app", image: "/ecosystem/happy-eats.jpg", gradient: "from-rose-900/80 via-slate-900/60 to-slate-950/90" },
  { title: "GarageBot", subtitle: "Smart garage and workshop management with IoT integration, tool inventory, and automated maintenance tracking", accent: "teal", link: "https://garagebot.io", image: "/ecosystem/garagebot-prod-new.jpg", gradient: "from-teal-900/80 via-slate-900/60 to-slate-950/90" },
  { title: "DarkWave Studios", subtitle: "Full ecosystem IDE with Monaco editor, Lume toolchain integration, project templates, and multi-app deployment", accent: "purple", link: "https://dwtl.io/studio", image: "/ecosystem/darkwave-studios-new.jpg", gradient: "from-purple-900/80 via-slate-900/60 to-slate-950/90" },
  { title: "TrustShield", subtitle: "Continuous security monitoring, guardian certification, and real-time threat analysis across the ecosystem", accent: "cyan", link: "https://trustshield.tech", image: "/ecosystem/trustshield-new.jpg", gradient: "from-cyan-900/80 via-slate-900/60 to-slate-950/90" },
  { title: "Trust Book", subtitle: "Premium ebook publishing platform with AI-assisted writing, beautiful typography, and blockchain-verified authorship", accent: "emerald", link: "/trust-book", image: "/ecosystem/trust-book-new.jpg", gradient: "from-emerald-900/80 via-slate-900/60 to-slate-950/90" },
];

const heroAccents: Record<string, { text: string; dot: string; btn: string }> = {
  cyan: { text: "text-cyan-400", dot: "bg-cyan-400", btn: "bg-cyan-500/20 border-cyan-500/40 text-cyan-300" },
  emerald: { text: "text-emerald-400", dot: "bg-emerald-400", btn: "bg-emerald-500/20 border-emerald-500/40 text-emerald-300" },
  blue: { text: "text-blue-400", dot: "bg-blue-400", btn: "bg-blue-500/20 border-blue-500/40 text-blue-300" },
  purple: { text: "text-purple-400", dot: "bg-purple-400", btn: "bg-purple-500/20 border-purple-500/40 text-purple-300" },
  teal: { text: "text-teal-400", dot: "bg-teal-400", btn: "bg-teal-500/20 border-teal-500/40 text-teal-300" },
  rose: { text: "text-rose-400", dot: "bg-rose-400", btn: "bg-rose-500/20 border-rose-500/40 text-rose-300" },
  violet: { text: "text-violet-400", dot: "bg-violet-400", btn: "bg-violet-500/20 border-violet-500/40 text-violet-300" },
};

function HeroSlideshow() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [prevIndex, setPrevIndex] = useState(0);
  const [transitioning, setTransitioning] = useState(false);

  const goToSlide = useCallback((index: number) => {
    if (index === activeIndex || transitioning) return;
    setTransitioning(true);
    setPrevIndex(activeIndex);
    setActiveIndex(index);
    setTimeout(() => setTransitioning(false), 1200);
  }, [activeIndex, transitioning]);

  useEffect(() => {
    const interval = setInterval(() => goToSlide((activeIndex + 1) % heroSlides.length), 7000);
    return () => clearInterval(interval);
  }, [activeIndex, goToSlide]);

  const nextIdx = (activeIndex + 1) % heroSlides.length;
  const visibleSet = new Set([activeIndex, prevIndex, nextIdx]);
  const cur = heroSlides[activeIndex];
  const accent = heroAccents[cur.accent] || heroAccents.cyan;

  return (
    <div className="relative w-full mt-4 h-[40vh] md:h-[50vh] rounded-2xl overflow-hidden border border-white/[0.08]" data-testid="section-hero-slideshow" style={{ boxShadow: '0 8px 32px rgba(0,0,0,0.4)' }}>
      {heroSlides.map((slide, i) => {
        const isActive = i === activeIndex;
        const isPrev = i === prevIndex && transitioning;
        const shouldMount = visibleSet.has(i);
        return (
          <div key={i} className="absolute inset-0" style={{ opacity: isActive ? 1 : isPrev ? 1 : 0, transition: "opacity 1.2s ease-in-out", zIndex: isActive ? 2 : isPrev ? 1 : 0, visibility: shouldMount ? "visible" : "hidden" }}>
            <div className={`absolute inset-0 bg-gradient-to-br ${slide.gradient}`} />
            {shouldMount && slide.image && <img src={slide.image} alt={slide.title} className="absolute inset-0 w-full h-full object-cover" />}
            <div className="absolute inset-0 bg-slate-950/20" />
          </div>
        );
      })}
      <div className="absolute inset-0 z-10" style={{ background: "linear-gradient(to bottom, rgba(6,6,10,0.1) 0%, rgba(6,6,10,0.05) 40%, rgba(6,6,10,0.5) 70%, rgba(6,6,10,0.95) 100%)" }} />
      <div className="absolute inset-0 z-10 bg-gradient-to-r from-[#06060a]/50 via-transparent to-[#06060a]/50" />
      <div className="absolute bottom-0 left-0 right-0 z-20 p-6 md:p-10">
        <div className="flex items-center gap-2 mb-2">
          <div className={`w-2 h-2 rounded-full ${accent.dot} animate-pulse`} />
          <span className={`text-[10px] font-semibold uppercase tracking-widest ${accent.text}`}>Trust Layer Ecosystem</span>
        </div>
        <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold text-white mb-2 leading-tight" data-testid="text-slideshow-title">{cur.title}</h2>
        <p className="text-sm md:text-base text-white/60 max-w-xl mb-4" data-testid="text-slideshow-subtitle">{cur.subtitle}</p>
        <Button variant="outline" className={`backdrop-blur-sm border ${accent.btn} text-sm`} onClick={() => cur.link.startsWith('/') ? window.location.href = cur.link : window.open(cur.link, '_blank', 'noopener,noreferrer')} data-testid="button-slideshow-visit">
          Visit {cur.title.split(" ")[0]} <ArrowRight className="w-3.5 h-3.5 ml-2" />
        </Button>
      </div>
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 flex items-center gap-1">
        {heroSlides.map((_, i) => {
          const sa = heroAccents[heroSlides[i].accent] || heroAccents.cyan;
          return <div key={i} onClick={() => goToSlide(i)} className={`cursor-pointer rounded-full transition-all duration-300 ${i === activeIndex ? sa.dot + ' w-4 h-1.5' : 'bg-white/30 w-1.5 h-1.5'}`} data-testid={`button-slideshow-dot-${i}`} />;
        })}
      </div>
    </div>
  );
}

function getTimeGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

// ═══════════════════════════════════════════════════════════════
// BENTO GLASS CELL — Design System Recipe
// ═══════════════════════════════════════════════════════════════
function BentoCell({ children, className = "", span = 1, glow, onClick }: { children: React.ReactNode; className?: string; span?: 1 | 2 | 3; glow?: string; onClick?: () => void }) {
  const spanClass = span === 3 ? "md:col-span-3" : span === 2 ? "md:col-span-2" : "";
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5 }}
      className={`group relative overflow-hidden rounded-2xl ${spanClass} ${className}`}
      style={{ background: 'var(--glass-bg)', backdropFilter: 'blur(20px)', border: '1px solid var(--glass-border)', boxShadow: glow ? `0 8px 32px rgba(0,0,0,0.15), 0 0 60px ${glow}` : '0 8px 32px rgba(0,0,0,0.15)' }}
      onClick={onClick}
    >
      {children}
    </motion.div>
  );
}

// ═══════════════════════════════════════════════════════════════
// APP DRAWER — Compact Ecosystem Grid
// ═══════════════════════════════════════════════════════════════
interface EcosystemApp { id: string; name: string; category: string; description: string; gradient: string; url?: string; }

function AppDrawerGrid({ apps }: { apps: EcosystemApp[] }) {
  const gradientColors: Record<string, { from: string; to: string }> = {
    "from-gray-500 to-gray-700": { from: "#6b7280", to: "#374151" },
    "from-indigo-600 to-violet-800": { from: "#4f46e5", to: "#5b21b6" },
    "from-cyan-400 to-blue-500": { from: "#22d3ee", to: "#3b82f6" },
    "from-slate-600 to-zinc-800": { from: "#475569", to: "#27272a" },
    "from-emerald-600 to-teal-800": { from: "#059669", to: "#115e59" },
    "from-emerald-500 to-teal-600": { from: "#10b981", to: "#0d9488" },
    "from-purple-600 to-teal-800": { from: "#9333ea", to: "#115e59" },
    "from-cyan-600 to-blue-700": { from: "#0891b2", to: "#1d4ed8" },
    "from-cyan-500 to-blue-600": { from: "#06b6d4", to: "#2563eb" },
    "from-cyan-500 to-red-600": { from: "#f97316", to: "#dc2626" },
    "from-red-600 to-rose-700": { from: "#dc2626", to: "#be123c" },
  };

  return (
    <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
      {apps.slice(0, 15).map((app) => {
        const img = ecosystemImages[app.id];
        const gc = gradientColors[app.gradient] || { from: "#06b6d4", to: "#2563eb" };
        return (
          <motion.a
            key={app.id}
            href={app.url || "#"}
            target={app.url?.startsWith("http") ? "_blank" : undefined}
            rel="noopener noreferrer"
            whileHover={{ scale: 1.08, y: -2 }}
            className="flex flex-col items-center gap-1.5 p-2 rounded-xl border border-white/[0.06] hover:border-cyan-500/30 hover:bg-white/[0.04] transition-all cursor-pointer"
            data-testid={`tile-${app.id}`}
          >
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl overflow-hidden shadow-lg" style={{ background: `linear-gradient(135deg, ${gc.from}, ${gc.to})` }}>
              {img ? <img src={img} alt={app.name} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-white/80 text-lg font-bold">{app.name.charAt(0)}</div>}
            </div>
            <span className="text-[10px] text-foreground/60 text-center font-medium leading-tight truncate w-full">{app.name}</span>
          </motion.a>
        );
      })}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// CSS KEYFRAMES (injected once)
// ═══════════════════════════════════════════════════════════════
const styleEl = typeof document !== 'undefined' && !document.getElementById('bento-keyframes') ? (() => {
  const s = document.createElement('style');
  s.id = 'bento-keyframes';
  s.textContent = `
    @keyframes gradient-wave { 0%,100%{background-position:0% 50%} 50%{background-position:100% 50%} }
    @keyframes float-orb { 0%,100%{transform:translate(0,0)} 50%{transform:translate(20px,-30px)} }
    .gradient-wave-text { background: linear-gradient(90deg, #06b6d4, #14b8a6, #a855f7, #06b6d4); background-size: 300% 100%; animation: gradient-wave 5s ease-in-out infinite; -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
    .float-orb { animation: float-orb 15s ease-in-out infinite; }
  `;
  document.head.appendChild(s);
  return s;
})() : null;

// ═══════════════════════════════════════════════════════════════
// MAIN HOME COMPONENT
// ═══════════════════════════════════════════════════════════════
export default function Home() {
  const { preferences } = usePreferences();
  const { user, loading: authLoading, isAuthenticated, displayName, username, logout } = useSimpleAuth();
  const [showLoginModal, setShowLoginModal] = useState(false);
  usePageAnalytics();

  const { data: apps = [], isLoading: appsLoading } = useQuery({
    queryKey: ["ecosystem-apps"],
    queryFn: fetchEcosystemApps,
    staleTime: 30000,
  });

  const { data: stats } = useQuery({
    queryKey: ["blockchain-stats"],
    queryFn: fetchBlockchainStats,
    refetchInterval: 3000,
    staleTime: 2000,
  });

  const favoriteApps = apps.filter((app: EcosystemApp) => preferences.favorites.includes(app.id));

  return (
    <div className="min-h-screen text-foreground overflow-x-hidden selection:bg-cyan-500/20 selection:text-cyan-300 bg-background">
      <OnboardingTour />
      <SimpleLoginModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} />

      {/* ══════ FLOATING ORBS ══════ */}
      {/* Floating orbs — hidden in light mode */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden dark:block" style={{ display: document.documentElement.classList.contains('light') ? 'none' : undefined }}>
        <div className="absolute top-[15%] left-[5%] w-[600px] h-[600px] rounded-full bg-cyan-500/[0.03] blur-[150px] float-orb" />
        <div className="absolute top-[50%] right-[0%] w-[500px] h-[500px] rounded-full bg-purple-500/[0.025] blur-[130px] float-orb" style={{ animationDelay: '-5s' }} />
        <div className="absolute bottom-[10%] left-[30%] w-[400px] h-[400px] rounded-full bg-teal-500/[0.02] blur-[120px] float-orb" style={{ animationDelay: '-10s' }} />
      </div>

      {/* ══════ HERO SECTION ══════ */}
      <section className="relative min-h-[85vh] flex items-center justify-center pt-20 md:pt-14 overflow-hidden">
        <KenBurnsBackground images={[heroBg]} overlayOpacity={0.5} />
        <div className="absolute inset-0 z-0 pointer-events-none">
          <svg className="absolute inset-0 w-full h-full opacity-30" preserveAspectRatio="xMidYMid slice">
            <defs>
              <radialGradient id="ng" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="#06b6d4" stopOpacity="1" /><stop offset="100%" stopColor="#06b6d4" stopOpacity="0" /></radialGradient>
              <radialGradient id="ngp" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="#a855f7" stopOpacity="1" /><stop offset="100%" stopColor="#a855f7" stopOpacity="0" /></radialGradient>
            </defs>
            {[{x1:'10%',y1:'20%',x2:'25%',y2:'35%'},{x1:'25%',y1:'35%',x2:'40%',y2:'25%'},{x1:'40%',y1:'25%',x2:'55%',y2:'40%'},{x1:'55%',y1:'40%',x2:'70%',y2:'30%'},{x1:'70%',y1:'30%',x2:'85%',y2:'45%'},{x1:'15%',y1:'55%',x2:'30%',y2:'70%'},{x1:'50%',y1:'65%',x2:'70%',y2:'75%'}].map((l,i) => <line key={i} {...l} stroke="#06b6d4" strokeWidth="1" strokeOpacity="0.3" className="animate-pulse" style={{animationDelay:`${i*0.3}s`}} />)}
            {[{cx:'10%',cy:'20%',s:6},{cx:'25%',cy:'35%',s:8},{cx:'40%',cy:'25%',s:7},{cx:'55%',cy:'40%',s:9},{cx:'70%',cy:'30%',s:6},{cx:'85%',cy:'45%',s:8},{cx:'30%',cy:'70%',s:7},{cx:'50%',cy:'65%',s:6},{cx:'70%',cy:'75%',s:8}].map((n,i) => <g key={i}><circle cx={n.cx} cy={n.cy} r={n.s*2} fill={i%2===0?'url(#ng)':'url(#ngp)'} className="animate-pulse" style={{animationDelay:`${i*0.2}s`}} /><circle cx={n.cx} cy={n.cy} r={n.s} fill={i%2===0?'#06b6d4':'#a855f7'} className="animate-pulse" style={{animationDelay:`${i*0.2}s`}} /></g>)}
          </svg>
        </div>

        <div className="container relative z-10 px-4 text-center">
          {isAuthenticated && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
              <p className="text-xl md:text-2xl font-medium" data-testid="text-greeting">
                <span className="gradient-wave-text">{getTimeGreeting()}, {username}</span>
                <Sparkles className="inline-block w-5 h-5 ml-2 text-cyan-400" />
              </p>
            </motion.div>
          )}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="max-w-3xl mx-auto space-y-6 mt-6">
            <Badge variant="outline" className="px-3 py-1 border-cyan-500/50 text-cyan-400 bg-cyan-500/10 rounded-full text-xs font-tech tracking-wider uppercase">
              The Next Generation Ecosystem
            </Badge>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-display font-bold leading-tight">
              <span className="bg-clip-text text-transparent bg-gradient-to-b from-white to-white/50">Welcome to</span>
              <br />
              <span className="gradient-wave-text">Trust Layer</span>
            </h1>
            <p className="text-lg md:text-xl text-white/60 max-w-2xl mx-auto font-medium">Where trust becomes the layer of truth.</p>
            <HeroSlideshow />
          </motion.div>
        </div>
      </section>

      {/* ══════ PRESALE BANNER ══════ */}
      <Link href="/presale">
        <div className="relative py-3 cursor-pointer group">
          <div className="absolute inset-0 bg-gradient-to-r from-[#06060a] via-purple-600/40 to-[#06060a]" />
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-purple-400/60 to-transparent shadow-[0_0_20px_rgba(168,85,247,0.5)]" />
          <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-purple-400/60 to-transparent shadow-[0_0_20px_rgba(168,85,247,0.5)]" />
          <div className="container mx-auto px-4 relative z-10 flex items-center justify-center">
            <Badge className="bg-purple-500/20 border-purple-400/50 text-purple-200 hover:bg-purple-500/30 transition-colors px-6 py-1.5 text-sm font-medium">
              <Sparkles className="w-3 h-3 mr-2" /> Signal Token Presale Live — Join Now <ArrowRight className="w-3 h-3 ml-2 group-hover:translate-x-1 transition-transform" />
            </Badge>
          </div>
        </div>
      </Link>

      {/* ══════ FAVORITES (conditional) ══════ */}
      {favoriteApps.length > 0 && (
        <section className="py-8 px-4 relative z-10">
          <div className="container mx-auto max-w-6xl">
            <div className="flex items-center gap-2 mb-4">
              <Heart className="w-4 h-4 text-rose-400 fill-current" />
              <h2 className="text-sm font-bold text-white/80">Your Favorites</h2>
            </div>
            <div className="flex gap-3 overflow-x-auto pb-2" style={{ scrollbarWidth: 'none' }}>
              {favoriteApps.map((app: EcosystemApp) => {
                const img = ecosystemImages[app.id];
                return (
                  <a key={app.id} href={app.url || '#'} target="_blank" rel="noopener noreferrer" className="shrink-0 flex items-center gap-2 px-3 py-2 rounded-xl border border-white/[0.08] bg-white/[0.03] hover:border-rose-500/30 hover:bg-white/[0.06] transition-all">
                    <div className="w-8 h-8 rounded-lg overflow-hidden bg-gradient-to-br from-cyan-600 to-purple-600">
                      {img && <img src={img} alt={app.name} className="w-full h-full object-cover" />}
                    </div>
                    <span className="text-xs font-medium text-white/70">{app.name}</span>
                  </a>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ══════ BENTO GRID ══════ */}
      <section className="py-12 px-4 relative z-10">
        <div className="container mx-auto max-w-6xl">
          <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-2">
              <span className="gradient-wave-text">Explore Everything</span>
            </h2>
            <p className="text-sm text-white/40">Your gateway into the Trust Layer ecosystem</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* ── Row 1: DeFi | NFT | Tools ── */}
            <BentoCell glow="rgba(236,72,153,0.08)">
              <div className="relative h-full min-h-[240px] overflow-hidden">
                <img src={tradingImg} alt="" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/60 to-pink-900/40" />
                <div className="relative z-10 p-5">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-pink-500/40 to-rose-500/40 backdrop-blur-sm flex items-center justify-center border border-pink-500/20 group-hover:shadow-[0_0_30px_rgba(236,72,153,0.4)] transition-shadow">
                      <ArrowUpDown className="w-5 h-5 text-pink-300" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-white">DeFi Trading</h3>
                      <p className="text-[11px] text-white/50">Swap, liquidity & charts</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <Link href="/swap"><div className="p-2.5 rounded-lg bg-black/40 backdrop-blur-sm border border-white/10 hover:border-pink-500/40 hover:bg-pink-500/20 transition-all text-center"><ArrowUpDown className="w-4 h-4 mx-auto mb-1 text-pink-400" /><span className="text-[10px] text-white/70">Swap</span></div></Link>
                    <Link href="/liquidity"><div className="p-2.5 rounded-lg bg-black/40 backdrop-blur-sm border border-white/10 hover:border-emerald-500/40 hover:bg-emerald-500/20 transition-all text-center"><Droplets className="w-4 h-4 mx-auto mb-1 text-emerald-400" /><span className="text-[10px] text-white/70">Pools</span></div></Link>
                    <Link href="/charts"><div className="p-2.5 rounded-lg bg-black/40 backdrop-blur-sm border border-white/10 hover:border-sky-500/40 hover:bg-sky-500/20 transition-all text-center"><LineChart className="w-4 h-4 mx-auto mb-1 text-sky-400" /><span className="text-[10px] text-white/70">Charts</span></div></Link>
                  </div>
                </div>
              </div>
            </BentoCell>

            <BentoCell glow="rgba(168,85,247,0.08)">
              <div className="relative h-full min-h-[240px] overflow-hidden">
                <img src={nftImg} alt="" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/60 to-purple-900/40" />
                <div className="relative z-10 p-5">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-purple-500/40 to-violet-500/40 backdrop-blur-sm flex items-center justify-center border border-purple-500/20 group-hover:shadow-[0_0_30px_rgba(168,85,247,0.4)] transition-shadow">
                      <ImageIcon className="w-5 h-5 text-purple-300" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-white">NFT Studio</h3>
                      <p className="text-[11px] text-white/50">Collect, create & explore</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <Link href="/nft"><div className="p-2.5 rounded-lg bg-black/40 backdrop-blur-sm border border-white/10 hover:border-purple-500/40 hover:bg-purple-500/20 transition-all text-center"><ImageIcon className="w-4 h-4 mx-auto mb-1 text-purple-400" /><span className="text-[10px] text-white/70">Market</span></div></Link>
                    <Link href="/nft-gallery"><div className="p-2.5 rounded-lg bg-black/40 backdrop-blur-sm border border-white/10 hover:border-violet-500/40 hover:bg-violet-500/20 transition-all text-center"><Layers className="w-4 h-4 mx-auto mb-1 text-violet-400" /><span className="text-[10px] text-white/70">Gallery</span></div></Link>
                    <Link href="/nft-creator"><div className="p-2.5 rounded-lg bg-black/40 backdrop-blur-sm border border-white/10 hover:border-rose-500/40 hover:bg-rose-500/20 transition-all text-center"><Palette className="w-4 h-4 mx-auto mb-1 text-rose-400" /><span className="text-[10px] text-white/70">Create</span></div></Link>
                  </div>
                </div>
              </div>
            </BentoCell>

            <BentoCell glow="rgba(6,182,212,0.08)">
              <div className="relative h-full min-h-[240px] overflow-hidden">
                <img src={toolsImg} alt="" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/60 to-cyan-900/40" />
                <div className="relative z-10 p-5">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-cyan-500/40 to-blue-500/40 backdrop-blur-sm flex items-center justify-center border border-cyan-500/20 group-hover:shadow-[0_0_30px_rgba(6,182,212,0.4)] transition-shadow">
                      <Zap className="w-5 h-5 text-cyan-300" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-white">Tools</h3>
                      <p className="text-[11px] text-white/50">Faucet, portfolio & more</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <Link href="/faucet"><div className="p-2.5 rounded-lg bg-black/40 backdrop-blur-sm border border-white/10 hover:border-cyan-500/40 hover:bg-cyan-500/20 transition-all text-center"><Droplets className="w-4 h-4 mx-auto mb-1 text-cyan-400" /><span className="text-[10px] text-white/70">Faucet</span></div></Link>
                    <Link href="/portfolio"><div className="p-2.5 rounded-lg bg-black/40 backdrop-blur-sm border border-white/10 hover:border-teal-500/40 hover:bg-teal-500/20 transition-all text-center"><PieChart className="w-4 h-4 mx-auto mb-1 text-teal-400" /><span className="text-[10px] text-white/70">Portfolio</span></div></Link>
                    <Link href="/transactions"><div className="p-2.5 rounded-lg bg-black/40 backdrop-blur-sm border border-white/10 hover:border-blue-500/40 hover:bg-blue-500/20 transition-all text-center"><History className="w-4 h-4 mx-auto mb-1 text-blue-400" /><span className="text-[10px] text-white/70">History</span></div></Link>
                  </div>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    <Link href="/launchpad"><div className="p-2 rounded-lg bg-black/40 backdrop-blur-sm border border-white/10 hover:border-cyan-500/40 hover:bg-cyan-500/20 transition-all text-center"><Rocket className="w-3.5 h-3.5 mx-auto mb-0.5 text-cyan-400" /><span className="text-[10px] text-white/70">Launchpad</span></div></Link>
                    <Link href="/webhooks"><div className="p-2 rounded-lg bg-black/40 backdrop-blur-sm border border-white/10 hover:border-purple-500/40 hover:bg-purple-500/20 transition-all text-center"><Webhook className="w-3.5 h-3.5 mx-auto mb-0.5 text-purple-400" /><span className="text-[10px] text-white/70">Webhooks</span></div></Link>
                  </div>
                </div>
              </div>
            </BentoCell>

            {/* ── Row 2: Dev Studio (2col) | Launchpad ── */}
            <BentoCell span={2} glow="rgba(6,182,212,0.06)">
              <Link href="/studio">
                <div className="relative h-full min-h-[220px] cursor-pointer overflow-hidden">
                  <img src={devStudioImg} alt="Dev Studio" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-r from-[#06060a]/90 via-[#06060a]/60 to-transparent" />
                  <div className="relative z-10 p-6 flex flex-col justify-center h-full max-w-md">
                    <Badge variant="outline" className="w-fit border-cyan-500/50 text-cyan-400 text-[10px] mb-3">Builders Suite</Badge>
                    <h3 className="text-xl md:text-2xl font-bold text-white mb-2">Dev Studio</h3>
                    <p className="text-xs text-white/50 mb-4">Cloud IDE for blockchain development with Monaco editor, templates, deployment tools, and Lume toolchain integration.</p>
                    <Button className="w-fit bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-400 hover:to-teal-400 text-black font-bold text-xs">
                      Open Studio <ArrowRight className="w-3.5 h-3.5 ml-2" />
                    </Button>
                  </div>
                </div>
              </Link>
            </BentoCell>

            <BentoCell glow="rgba(139,92,246,0.08)">
              <Link href="/launchpad">
                <div className="relative h-full min-h-[220px] cursor-pointer overflow-hidden">
                  <img src={launchpadImg} alt="Launchpad" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-violet-900/30" />
                  <div className="relative z-10 p-5 flex flex-col justify-end h-full">
                    <Badge variant="outline" className="w-fit border-violet-500/50 text-violet-400 text-[10px] mb-2">Launch</Badge>
                    <h3 className="text-lg font-bold text-white mb-1">Token Launchpad</h3>
                    <p className="text-[11px] text-white/50 mb-3">Launch tokens with fair distribution & vesting</p>
                    <Button className="w-full bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-400 hover:to-purple-500 text-white font-bold text-xs">
                      <Rocket className="w-3.5 h-3.5 mr-1.5" /> Launch Now
                    </Button>
                  </div>
                </div>
              </Link>
            </BentoCell>

            {/* ── Row 3: Earn | Ecosystem Drawer (2col) ── */}
            <BentoCell glow="rgba(16,185,129,0.08)">
              <div className="relative h-full min-h-[240px] overflow-hidden">
                <img src={earnImg} alt="" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-emerald-900/30" />
                <div className="relative z-10 p-5">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-500/40 to-teal-500/40 backdrop-blur-sm flex items-center justify-center border border-emerald-500/20">
                      <Gift className="w-5 h-5 text-emerald-300" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-white">Earn & Rewards</h3>
                      <p className="text-[11px] text-white/50">Stake, refer & collect</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <Link href="/referral-program"><div className="p-2.5 rounded-lg bg-black/40 backdrop-blur-sm border border-white/10 hover:border-emerald-500/40 hover:bg-emerald-500/20 transition-all text-center"><Share2 className="w-4 h-4 mx-auto mb-1 text-emerald-400" /><span className="text-[10px] text-white/70">Referrals</span></div></Link>
                    <Link href="/quests"><div className="p-2.5 rounded-lg bg-black/40 backdrop-blur-sm border border-white/10 hover:border-lime-500/40 hover:bg-lime-500/20 transition-all text-center"><Compass className="w-4 h-4 mx-auto mb-1 text-lime-400" /><span className="text-[10px] text-white/70">Quests</span></div></Link>
                    <Link href="/staking"><div className="p-2.5 rounded-lg bg-black/40 backdrop-blur-sm border border-white/10 hover:border-teal-500/40 hover:bg-teal-500/20 transition-all text-center"><Star className="w-4 h-4 mx-auto mb-1 text-teal-400" /><span className="text-[10px] text-white/70">Staking</span></div></Link>
                    <Link href="/rewards"><div className="p-2.5 rounded-lg bg-black/40 backdrop-blur-sm border border-white/10 hover:border-cyan-500/40 hover:bg-cyan-500/20 transition-all text-center"><Crown className="w-4 h-4 mx-auto mb-1 text-cyan-400" /><span className="text-[10px] text-white/70">Rewards</span></div></Link>
                  </div>
                </div>
              </div>
            </BentoCell>

            <BentoCell span={2} glow="rgba(20,184,166,0.06)">
              <div className="p-5 h-full">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500/30 to-cyan-500/30 backdrop-blur-sm flex items-center justify-center border border-teal-500/20">
                      <Globe className="w-5 h-5 text-teal-300" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-white">Ecosystem</h3>
                      <p className="text-[11px] text-white/40">{apps.length} apps and growing</p>
                    </div>
                  </div>
                  <Link href="/explore">
                    <Button variant="ghost" size="sm" className="text-xs text-teal-400 hover:text-teal-300 hover:bg-teal-500/10">
                      View All <ArrowRight className="w-3 h-3 ml-1" />
                    </Button>
                  </Link>
                </div>
                {appsLoading ? <SkeletonCard /> : <AppDrawerGrid apps={apps} />}
              </div>
            </BentoCell>

            {/* ── Row 4: Chronicles (2col) | Network ── */}
            <BentoCell span={2} glow="rgba(168,85,247,0.06)">
              <div className="relative h-full min-h-[200px] overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-950/40 via-[#10101a] to-pink-950/20" />
                <div className="relative z-10 p-5">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-lg font-bold gradient-wave-text">Chronicles</h3>
                        <Badge variant="outline" className="border-purple-500/40 text-purple-400 text-[9px]">Season Zero</Badge>
                      </div>
                      <p className="text-[11px] text-white/40">Not a game — a life. Emotions drive behavior, consequences ripple through time.</p>
                    </div>
                  </div>
                  <div className="flex gap-3 mb-4">
                    {[
                      { img: stoneAgeImg, era: "Dawn Age", color: "from-purple-500/30 to-cyan-600/30" },
                      { img: medievalImg, era: "Age of Crowns", color: "from-purple-500/30 to-indigo-600/30" },
                      { img: samuraiImg, era: "Shogunate", color: "from-rose-500/30 to-red-600/30" },
                    ].map((item, i) => (
                      <motion.div key={item.era} whileHover={{ scale: 1.03, y: -3 }} className="relative flex-1 aspect-[3/4] rounded-xl overflow-hidden border border-white/10 cursor-pointer" style={{ boxShadow: '0 0 30px rgba(0,0,0,0.5)' }}>
                        <img src={item.img} alt={item.era} className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                        <div className={`absolute inset-0 bg-gradient-to-t ${item.color}`} />
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                        <div className="absolute bottom-0 left-0 right-0 p-2.5">
                          <p className="font-bold text-white text-xs">{item.era}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <a href="https://yourlegacy.io" target="_blank" rel="noopener noreferrer">
                      <Button size="sm" className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-xs">
                        <Gamepad2 className="w-3.5 h-3.5 mr-1.5" /> Play Chronicles
                      </Button>
                    </a>
                    <a href="https://yourlegacy.io/era-codex" target="_blank" rel="noopener noreferrer">
                      <Button size="sm" variant="outline" className="border-purple-500/40 text-purple-400 hover:bg-purple-500/10 text-xs">
                        View All Eras
                      </Button>
                    </a>
                  </div>
                </div>
              </div>
            </BentoCell>

            <BentoCell glow="rgba(56,189,248,0.06)">
              <div className="p-5 h-full flex flex-col">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-sky-500/30 to-blue-500/30 flex items-center justify-center border border-sky-500/20">
                    <Activity className="w-4 h-4 text-sky-300" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">Network</h3>
                    <div className="flex items-center gap-1">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      <span className="text-[9px] text-emerald-400 uppercase">Testnet</span>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 flex-1">
                  <div className="p-2.5 rounded-lg bg-white/[0.03] border border-white/[0.06] text-center">
                    <div className="text-lg font-bold text-white">{stats?.tps || "200K+"}</div>
                    <div className="text-[9px] text-white/40 uppercase">TPS</div>
                  </div>
                  <div className="p-2.5 rounded-lg bg-white/[0.03] border border-white/[0.06] text-center">
                    <div className="text-lg font-bold text-white">{stats?.finalityTime || "0.4s"}</div>
                    <div className="text-[9px] text-white/40 uppercase">Finality</div>
                  </div>
                  <div className="p-2.5 rounded-lg bg-white/[0.03] border border-white/[0.06] text-center">
                    <div className="text-lg font-bold text-white">{stats?.avgCost || "$0.0001"}</div>
                    <div className="text-[9px] text-white/40 uppercase">Avg Cost</div>
                  </div>
                  <div className="p-2.5 rounded-lg bg-white/[0.03] border border-white/[0.06] text-center">
                    <div className="text-lg font-bold text-white">Founders</div>
                    <div className="text-[9px] text-white/40 uppercase">Validator</div>
                  </div>
                </div>
                <Link href="/network">
                  <Button variant="ghost" size="sm" className="w-full mt-3 text-xs text-sky-400 hover:text-sky-300 hover:bg-sky-500/10 border border-sky-500/20">
                    <Activity className="w-3 h-3 mr-1.5" /> Network Status
                  </Button>
                </Link>
              </div>
            </BentoCell>
          </div>
        </div>
      </section>

      {/* ══════ HALLMARK FOOTER ══════ */}
      <div className="flex justify-center py-8 relative z-10">
        <GenesisHallmarkBadge />
      </div>
    </div>
  );
}