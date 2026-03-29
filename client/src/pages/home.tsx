import { motion } from "framer-motion";
import { Link } from "wouter";
import { ArrowRight, Code, Globe, Layers, Shield, Zap, Cpu, Network, Database, Heart, Sparkles, Activity, Server, CheckCircle2, Droplets, ArrowUpDown, ImageIcon, PieChart, History, Rocket, LineChart, Webhook, Palette, Trophy, Target, ChevronDown, ChevronLeft, ChevronRight, Gift, Search } from "lucide-react";
import { InfoTooltip } from "@/components/info-tooltip";
import { KenBurnsBackground } from "@/components/ken-burns-background";
import heroBg from "@assets/trust_network_connecting_everything_1769800437573.png";
const orbitVideo = "";
const brewBoardVideo = "";
const garageBotVideo = "";
const paintProsVideo = "";
const trustHomeVideo = "";
const trustVaultVideo = "";
const theVoidVideo = "";
const verdaraVideo = "";
const tlDriverVideo = "";
const happyEatsVideo = "";
const lotOpsVideo = "";
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
import stoneAgeImg from "@assets/generated_images/stone_age_village_scene.jpg";
import medievalImg from "@assets/generated_images/medieval_castle_vertical_portrait.jpg";
import egyptImg from "@assets/generated_images/ancient_egyptian_kingdom_sunset.jpg";
import greeceImg from "@assets/generated_images/ancient_greek_athens_parthenon.jpg";
import samuraiImg from "@assets/generated_images/feudal_japan_samurai_castle.jpg";
import steampunkImg from "@assets/generated_images/industrial_steampunk_city.jpg";
import renaissanceImg from "@assets/generated_images/renaissance_florence_italy_scene.jpg";
import romanImg from "@assets/generated_images/roman_empire_colosseum_gladiators.jpg";
import vikingImg from "@assets/generated_images/viking_longship_fjord_scene.jpg";
import wildWestImg from "@assets/generated_images/wild_west_frontier_town.jpg";
import tradingImg from "@assets/generated_images/futuristic_blockchain_network_activity_monitor.jpg";
import nftImg from "@assets/generated_images/fantasy_character_heroes.jpg";
import devStudioImg from "@assets/generated_images/developer_portal_apis.jpg";
import launchpadImg from "@assets/generated_images/rocket_launching_growth.jpg";
import toolsImg from "@assets/generated_images/futuristic_dashboard_interface_for_managing_decentralized_applications.jpg";
import earnImg from "@assets/generated_images/darkwave_crypto_token_coin_holographic.jpg";

function ExploreButton({ url, appName }: { url?: string; appName: string }) {
  const [open, setOpen] = useState(false);
  
  const handleContinue = () => {
    setOpen(false);
    if (url) {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };
  
  return (
    <>
      <Button 
        className="w-full bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs py-2 rounded-lg transition-colors"
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
                <p>
                  This application is <strong className="text-white">fully functional</strong> and ready for use. 
                </p>
                <p>
                  As a Beta product, it is constantly being updated with new features and improvements. 
                  These updates may occasionally affect visual continuity or functionality in demo modes.
                </p>
                <p className="text-primary">
                  Your data and transactions remain secure throughout all updates.
                </p>
              </div>
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-3 mt-4">
            <Button 
              variant="outline" 
              className="flex-1 border-white/20 hover:bg-white/5"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              className="flex-1 bg-emerald-500 hover:bg-emerald-400 text-black font-bold"
              onClick={handleContinue}
            >
              I Understand, Continue
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

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
  "trust-home": "/ecosystem/trust-home.jpg",
  "trust-vault": "/ecosystem/trust-vault.jpg",
  "guardian-scanner": "/ecosystem/guardian-scanner.jpg",
  "guardian-screener": "/ecosystem/guardian-screener.jpg",
  "trustshield": "/ecosystem/trustshield.jpg",
  "the-void": "/ecosystem/the-void.png",
  "torque": "/ecosystem/torque.jpg",
  "driver-connect": "/ecosystem/driver-connect.jpg",
  "trust-layer": "/ecosystem/trust-layer.jpg",
  "tlid": "/ecosystem/tlid.jpg",
  "chronicles": "/ecosystem/chronicles.jpg",
  "the-arcade": "/ecosystem/the-arcade.jpg",
  "signal-chat": "/ecosystem/signal-chat.jpg",
  "darkwave-studios": "/ecosystem/darkwave-studios.jpg",
  "tradeworks-ai": "/ecosystem/tradeworks-ai.jpg",
  "signalcast": "/ecosystem/signalcast.jpg",
};

const CHRONICLES_ERAS = [
  { img: stoneAgeImg, era: "Dawn Age", desc: "Stone Age origins", color: "from-purple-500/30 to-cyan-600/30" },
  { img: egyptImg, era: "Kingdom of Ra", desc: "Ancient Egypt", color: "from-teal-500/30 to-purple-600/30" },
  { img: greeceImg, era: "Hellenic Glory", desc: "Ancient Greece", color: "from-sky-500/30 to-blue-600/30" },
  { img: romanImg, era: "Imperial Rome", desc: "Roman Empire", color: "from-red-500/30 to-cyan-600/30" },
  { img: vikingImg, era: "Norse Saga", desc: "Viking Age", color: "from-slate-500/30 to-blue-600/30" },
  { img: medievalImg, era: "Age of Crowns", desc: "Medieval kingdoms", color: "from-purple-500/30 to-indigo-600/30" },
  { img: samuraiImg, era: "Shogunate", desc: "Feudal Japan", color: "from-rose-500/30 to-red-600/30" },
  { img: renaissanceImg, era: "Renaissance", desc: "Age of Enlightenment", color: "from-emerald-500/30 to-teal-600/30" },
  { img: wildWestImg, era: "Frontier", desc: "Wild West", color: "from-cyan-500/30 to-purple-600/30" },
  { img: steampunkImg, era: "Iron Age", desc: "Industrial Revolution", color: "from-zinc-500/30 to-stone-600/30" },
];

function ChroniclesCarousel() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  useEffect(() => {
    if (scrollRef.current) {
      const { scrollWidth, clientWidth } = scrollRef.current;
      const centerPosition = (scrollWidth - clientWidth) / 2;
      scrollRef.current.scrollLeft = centerPosition;
      checkScroll();
    }
  }, []);

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const isMobile = window.innerWidth < 768;
      const cardWidth = isMobile ? 180 : 240;
      const scrollAmount = direction === 'left' ? -cardWidth : cardWidth;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const [activeIndex, setActiveIndex] = useState(Math.floor(CHRONICLES_ERAS.length / 2));

  const updateActiveIndex = () => {
    if (scrollRef.current) {
      const isMobile = window.innerWidth < 768;
      const cardWidth = isMobile ? 176 : 236;
      const scrollLeft = scrollRef.current.scrollLeft;
      const newIndex = Math.round(scrollLeft / cardWidth);
      setActiveIndex(Math.min(Math.max(0, newIndex), CHRONICLES_ERAS.length - 1));
    }
  };

  const handleScroll = () => {
    checkScroll();
    updateActiveIndex();
  };

  return (
    <div className="mb-8">
      <div 
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex gap-4 overflow-x-auto scrollbar-hide px-4 py-2 snap-x snap-mandatory"
      >
        {CHRONICLES_ERAS.map((item, i) => (
          <motion.div
            key={item.era}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            whileHover={{ scale: 1.02, y: -4 }}
            className="relative group shrink-0 w-[160px] h-[220px] md:w-[220px] md:h-[300px] rounded-2xl overflow-hidden snap-center border border-white/10 bg-black/40 backdrop-blur-xl"
            style={{ boxShadow: '0 0 40px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.1)' }}
            data-testid={`card-era-${item.era.toLowerCase().replace(/\s+/g, '-')}`}
          >
            <img 
              src={item.img} 
              alt={item.era}
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
            <div className={`absolute inset-0 bg-gradient-to-t ${item.color}`} />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
            <div className="absolute inset-0 opacity-30 pointer-events-none" style={{
              background: "repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.02) 10px, rgba(255,255,255,0.02) 20px)",
            }} />
            <div className="absolute bottom-0 left-0 right-0 p-3 md:p-4 bg-gradient-to-t from-black/80 to-transparent">
              <p className="font-bold text-white text-sm md:text-lg">{item.era}</p>
              <p className="text-xs text-gray-300">{item.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>
      
      {/* Navigation controls below carousel */}
      <div className="flex items-center justify-center gap-4 mt-4">
        <button
          onClick={() => scroll('left')}
          className={`w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center transition-all ${canScrollLeft ? 'hover:bg-white/10 hover:border-white/20' : 'opacity-30 cursor-not-allowed'}`}
          disabled={!canScrollLeft}
          data-testid="button-carousel-left"
        >
          <ChevronLeft className="w-4 h-4 text-white" />
        </button>
        
        {/* Dots indicator */}
        <div className="flex items-center gap-1.5">
          {CHRONICLES_ERAS.map((_, i) => (
            <div 
              key={i}
              className={`w-1.5 h-1.5 rounded-full transition-all ${i === activeIndex ? 'bg-cyan-400 w-3' : 'bg-white/30'}`}
            />
          ))}
        </div>
        
        <button
          onClick={() => scroll('right')}
          className={`w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center transition-all ${canScrollRight ? 'hover:bg-white/10 hover:border-white/20' : 'opacity-30 cursor-not-allowed'}`}
          disabled={!canScrollRight}
          data-testid="button-carousel-right"
        >
          <ChevronRight className="w-4 h-4 text-white" />
        </button>
      </div>
    </div>
  );
}

interface EcosystemApp {
  id: string;
  name: string;
  category: string;
  description: string;
  gradient: string;
  url?: string;
}

function EcosystemAppCard({ app }: { app: EcosystemApp }) {
  const imageSrc = ecosystemImages[app.id] || "";
  const colors: Record<string, { from: string; to: string }> = {
    "from-gray-500 to-gray-700": { from: "#6b7280", to: "#374151" },
    "from-indigo-600 to-violet-800": { from: "#4f46e5", to: "#5b21b6" },
    "from-cyan-400 to-blue-500": { from: "#22d3ee", to: "#3b82f6" },
    "from-slate-600 to-zinc-800": { from: "#475569", to: "#27272a" },
    "from-emerald-600 to-teal-800": { from: "#059669", to: "#115e59" },
    "from-emerald-500 to-teal-600": { from: "#10b981", to: "#0d9488" },
    "from-purple-600 to-teal-800": { from: "#d97706", to: "#854d0e" },
    "from-cyan-600 to-blue-700": { from: "#0891b2", to: "#1d4ed8" },
    "from-cyan-500 to-blue-600": { from: "#06b6d4", to: "#2563eb" },
    "from-cyan-500 to-red-600": { from: "#f97316", to: "#dc2626" },
    "from-red-600 to-rose-700": { from: "#dc2626", to: "#be123c" },
  };
  const gradColors = colors[app.gradient] || { from: "#0891b2", to: "#1d4ed8" };

  return (
    <GlassCard glow className="h-full overflow-hidden hover:border-emerald-500/30 transition-all duration-300">
      <div className="flex flex-col h-full">
        <div className="aspect-video relative overflow-hidden bg-black">
          {imageSrc ? (
            <img 
              src={imageSrc} 
              alt={app.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div 
              className="w-full h-full flex items-center justify-center"
              style={{ background: `linear-gradient(to bottom right, ${gradColors.from}, ${gradColors.to})` }}
            >
              <span className="text-5xl font-bold text-white/80">{app.name.charAt(0)}</span>
            </div>
          )}
        </div>
        <div className="p-4 flex-1 flex flex-col">
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3 className="text-lg font-bold text-white leading-tight">{app.name}</h3>
            <FavoriteButton appId={app.id} />
          </div>
          <Badge variant="secondary" className="w-fit text-[10px] uppercase bg-emerald-500/20 text-emerald-400 mb-2">
            {app.category}
          </Badge>
          <p className="text-xs text-white/60 line-clamp-2 mb-4 flex-1">{app.description}</p>
          <ExploreButton url={app.url} appName={app.name} />
        </div>
      </div>
    </GlassCard>
  );
}

function EcosystemCarousel({ apps }: { apps: EcosystemApp[] }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);

  const getCardsPerView = () => {
    if (typeof window === 'undefined') return 4;
    if (window.innerWidth < 768) return 1;
    if (window.innerWidth < 1024) return 4;
    return 5;
  };

  const totalPages = Math.ceil(apps.length / getCardsPerView());

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  const updateActiveIndex = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      const maxScroll = scrollWidth - clientWidth;
      if (maxScroll <= 0) return;
      const progress = scrollLeft / maxScroll;
      const newIndex = Math.round(progress * (totalPages - 1));
      setActiveIndex(Math.min(Math.max(0, newIndex), totalPages - 1));
    }
  };

  const handleScroll = () => {
    checkScroll();
    updateActiveIndex();
  };

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = scrollRef.current.clientWidth;
      scrollRef.current.scrollBy({ 
        left: direction === 'left' ? -scrollAmount : scrollAmount, 
        behavior: 'smooth' 
      });
    }
  };

  const colors: Record<string, { from: string; to: string }> = {
    "from-gray-500 to-gray-700": { from: "#6b7280", to: "#374151" },
    "from-indigo-600 to-violet-800": { from: "#4f46e5", to: "#5b21b6" },
    "from-cyan-400 to-blue-500": { from: "#22d3ee", to: "#3b82f6" },
    "from-slate-600 to-zinc-800": { from: "#475569", to: "#27272a" },
    "from-emerald-600 to-teal-800": { from: "#059669", to: "#115e59" },
    "from-emerald-500 to-teal-600": { from: "#10b981", to: "#0d9488" },
    "from-purple-600 to-teal-800": { from: "#d97706", to: "#854d0e" },
    "from-cyan-600 to-blue-700": { from: "#0891b2", to: "#1d4ed8" },
    "from-cyan-500 to-blue-600": { from: "#06b6d4", to: "#2563eb" },
    "from-cyan-500 to-red-600": { from: "#f97316", to: "#dc2626" },
    "from-red-600 to-rose-700": { from: "#dc2626", to: "#be123c" },
  };

  return (
    <div className="relative">
      <div 
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex gap-4 overflow-x-auto scrollbar-hide py-2 snap-x snap-mandatory px-1"
      >
        {apps.map((app, i) => {
          const imageSrc = ecosystemImages[app.id] || "";
          const gradientColors = colors[app.gradient] || { from: "#0891b2", to: "#1d4ed8" };
          
          return (
            <motion.div
              key={app.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="shrink-0 w-[calc(100%-16px)] md:w-[calc(25%-12px)] lg:w-[calc(20%-13px)] snap-center"
              data-testid={`card-ecosystem-${app.id}`}
            >
              <GlassCard className="h-full overflow-hidden hover:border-emerald-500/30 transition-all duration-300">
                <div className="flex flex-col h-full">
                  <div className="aspect-[3/4] md:aspect-[4/3] relative overflow-hidden bg-black">
                    {imageSrc ? (
                      <img 
                        src={imageSrc} 
                        alt={app.name}
                        className="w-full h-full object-cover md:object-contain"
                      />
                    ) : (
                      <div 
                        className="w-full h-full flex items-center justify-center"
                        style={{ background: `linear-gradient(to bottom right, ${gradientColors.from}, ${gradientColors.to})` }}
                      >
                        <span className="text-5xl font-bold text-white/80">{app.name.charAt(0)}</span>
                      </div>
                    )}
                  </div>
                  <div className="p-4 flex-1 flex flex-col">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h3 className="text-lg font-bold text-white leading-tight">{app.name}</h3>
                      <FavoriteButton appId={app.id} />
                    </div>
                    <Badge variant="secondary" className="w-fit text-[10px] uppercase bg-emerald-500/20 text-emerald-400 mb-2">
                      {app.category}
                    </Badge>
                    <p className="text-xs text-white/60 line-clamp-3 md:line-clamp-2 mb-4 flex-1">{app.description}</p>
                    <ExploreButton url={app.url} appName={app.name} />
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          );
        })}
      </div>

      {/* Navigation controls below carousel */}
      <div className="flex items-center justify-center gap-4 mt-4">
        <button
          onClick={() => scroll('left')}
          className={`w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center transition-all ${canScrollLeft ? 'hover:bg-cyan-500/10 hover:border-cyan-400/40' : 'opacity-30 cursor-not-allowed'}`}
          disabled={!canScrollLeft}
          data-testid="button-ecosystem-carousel-left"
        >
          <ChevronLeft className="w-5 h-5 text-white" />
        </button>
        
        {/* Cyan dot indicators */}
        <div className="flex items-center gap-1.5">
          {Array.from({ length: totalPages }).map((_, i) => (
            <div 
              key={i}
              className={`h-1.5 rounded-full transition-all duration-300 ${i === activeIndex ? 'bg-cyan-400 w-4' : 'bg-white/30 w-1.5'}`}
            />
          ))}
        </div>
        
        <button
          onClick={() => scroll('right')}
          className={`w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center transition-all ${canScrollRight ? 'hover:bg-cyan-500/10 hover:border-cyan-400/40' : 'opacity-30 cursor-not-allowed'}`}
          disabled={!canScrollRight}
          data-testid="button-ecosystem-carousel-right"
        >
          <ChevronRight className="w-5 h-5 text-white" />
        </button>
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

// ─── Hero Slideshow ──────────────────────────────────────────────────────────

interface HeroSlide {
  title: string;
  subtitle: string;
  accent: string;
  link: string;
  video?: string;
  image?: string;
  gradient: string;
}

const heroSlides: HeroSlide[] = [
  { title: "ORBIT Staffing OS", subtitle: "100% automated flexible labor marketplace with GPS check-ins, smart matching, payroll, and blockchain compliance", accent: "cyan", link: "https://orbitstaffing.io", video: orbitVideo, gradient: "from-cyan-900/80 via-slate-900/60 to-slate-950/90" },
  { title: "TrustHome", subtitle: "Real estate agent platform with AI video walkthroughs, listing management, client CRM, and smart tools", accent: "emerald", link: "https://trusthome.tlid.io", video: trustHomeVideo, gradient: "from-emerald-900/80 via-slate-900/60 to-slate-950/90" },
  { title: "Trust Vault", subtitle: "Enterprise-grade digital asset protection with biometric security, encrypted storage, and blockchain custody", accent: "blue", link: "https://trustvault.studio", video: trustVaultVideo, gradient: "from-blue-900/80 via-slate-900/60 to-slate-950/90" },
  { title: "THE VOID", subtitle: "Voice-first mental wellness platform with AI-powered venting, guided breathing, mood analytics, and 20+ wellness tools", accent: "purple", link: "https://intothevoid.app", video: theVoidVideo, gradient: "from-purple-900/80 via-slate-900/60 to-slate-950/90" },
  { title: "Verdara", subtitle: "AI outdoor recreation super-app with species ID, trail explorer, trip planner, 170+ US locations, and wild edibles guide", accent: "emerald", link: "https://verdara.tlid.io", video: verdaraVideo, gradient: "from-emerald-900/80 via-slate-900/60 to-slate-950/90" },
  { title: "TL Driver Connect", subtitle: "All-in-one driver app — GPS navigation, receipt scanning, food truck locator, franchise demo, and driver tools", accent: "teal", link: "https://tldriverconnect.com", video: tlDriverVideo, gradient: "from-teal-900/80 via-slate-900/60 to-slate-950/90" },
  { title: "Happy Eats", subtitle: "Nashville food truck platform with zone-based batch ordering, vendor portal, rewards, and 11 delivery zones", accent: "rose", link: "https://happyeats.app", video: happyEatsVideo, gradient: "from-rose-900/80 via-slate-900/60 to-slate-950/90" },
  { title: "Brew & Board Coffee", subtitle: "Community coffee platform with B2B delivery, calendar scheduling, and blockchain-verified receipts", accent: "purple", link: "https://brewandboard.coffee", video: brewBoardVideo, gradient: "from-purple-900/80 via-slate-900/60 to-slate-950/90" },
  { title: "GarageBot", subtitle: "Smart garage and workshop management with IoT integration, tool inventory, and automated maintenance tracking", accent: "zinc", link: "https://garagebot.io", video: garageBotVideo, gradient: "from-zinc-800/80 via-slate-900/60 to-slate-950/90" },
  { title: "PaintPros", subtitle: "Professional painting contractor management with job scheduling, crew management, and automated invoicing", accent: "cyan", link: "https://paintpros.io", video: paintProsVideo, gradient: "from-cyan-900/80 via-slate-900/60 to-slate-950/90" },
  { title: "Lot Ops Pro", subtitle: "Autonomous lot management for auto auctions, dealers, and manufacturers with inventory and operations tools", accent: "indigo", link: "https://lotopspro.io", video: lotOpsVideo, gradient: "from-indigo-900/80 via-slate-900/60 to-slate-950/90" },
  { title: "Chronicles", subtitle: "Not a game — a life. Persistent parallel world with emotion-driven AI, living political simulation, and legacy building", accent: "purple", link: "https://yourlegacy.io", image: "/ecosystem/chronicles.jpg", gradient: "from-purple-900/80 via-slate-900/60 to-slate-950/90" },
  { title: "Pulse", subtitle: "Predictive market intelligence powered by AI systems with auto-trading, sentiment analysis, and multi-chain coverage", accent: "cyan", link: "https://darkwavepulse.com", image: "/ecosystem/darkwave-pulse-new.jpg", gradient: "from-cyan-900/80 via-slate-900/60 to-slate-950/90" },
  { title: "Trust Golf", subtitle: "Premium golf companion with 45+ courses, AI swing analysis, USGA handicap tracking, and exclusive tee time deals", accent: "emerald", link: "https://trustgolf.app", image: "/ecosystem/trust-golf.jpg", gradient: "from-green-900/80 via-slate-900/60 to-slate-950/90" },
  { title: "TrustGen 3D", subtitle: "AI-powered 3D creation & code studio with Monaco IDE, Meshy.ai, animation timeline, and blockchain provenance", accent: "purple", link: "https://trustgen.design", image: "/ecosystem/trustgen.jpg", gradient: "from-violet-900/80 via-slate-900/60 to-slate-950/90" },
  { title: "VedaSolus", subtitle: "Holistic health platform blending Ayurveda & TCM with modern science — AI wellness coach and practitioner marketplace", accent: "teal", link: "https://vedasolus.io", image: "/ecosystem/veda-solus-new.jpg", gradient: "from-teal-900/80 via-slate-900/60 to-slate-950/90" },
  { title: "StrikeAgent", subtitle: "AI sentient trading bot with hashed predictions, verified results, and multiple trading settings", accent: "red", link: "https://strikeagent.io", image: "/ecosystem/strike-agent-new.jpg", gradient: "from-red-900/80 via-slate-900/60 to-slate-950/90" },
  { title: "Trust Golf", subtitle: "3D long driving golf game with real-time physics, stunning courses, leaderboards, and Trust Golf integration", accent: "lime", link: "https://trustgolf.app", image: "/ecosystem/bomber.jpg", gradient: "from-lime-900/80 via-slate-900/60 to-slate-950/90" },
  { title: "TORQUE", subtitle: "Blockchain-verified automotive marketplace and vehicle history platform — buy, sell, and verify with trust records", accent: "zinc", link: "https://garagebot.io/torque", image: "/ecosystem/torque.jpg", gradient: "from-zinc-800/80 via-slate-900/60 to-slate-950/90" },
  { title: "TradeWorks AI", subtitle: "Advanced AI-powered trading intelligence and market analysis platform with automated strategies", accent: "blue", link: "https://tradeworksai.io", image: "/ecosystem/tradeworks-ai.jpg", gradient: "from-blue-900/80 via-slate-900/60 to-slate-950/90" },
  { title: "SignalCast", subtitle: "AI-powered social media automation with 9 platform connectors, embeddable widget, and ecosystem-wide scheduling", accent: "cyan", link: "https://signalcast.ad", image: "/ecosystem/signalcast.jpg", gradient: "from-cyan-900/80 via-slate-900/60 to-slate-950/90" },
];

const heroAccents: Record<string, { text: string; dot: string; btn: string }> = {
  cyan: { text: "text-cyan-400", dot: "bg-cyan-400", btn: "bg-cyan-500/20 border-cyan-500/40 text-cyan-300" },
  emerald: { text: "text-emerald-400", dot: "bg-emerald-400", btn: "bg-emerald-500/20 border-emerald-500/40 text-emerald-300" },
  blue: { text: "text-blue-400", dot: "bg-blue-400", btn: "bg-blue-500/20 border-blue-500/40 text-blue-300" },
  purple: { text: "text-purple-400", dot: "bg-purple-400", btn: "bg-purple-500/20 border-purple-500/40 text-purple-300" },
  teal: { text: "text-teal-400", dot: "bg-teal-400", btn: "bg-teal-500/20 border-teal-500/40 text-teal-300" },
  rose: { text: "text-rose-400", dot: "bg-rose-400", btn: "bg-rose-500/20 border-rose-500/40 text-rose-300" },
  zinc: { text: "text-zinc-400", dot: "bg-zinc-400", btn: "bg-zinc-500/20 border-zinc-500/40 text-zinc-300" },
  indigo: { text: "text-indigo-400", dot: "bg-indigo-400", btn: "bg-indigo-500/20 border-indigo-500/40 text-indigo-300" },
  red: { text: "text-red-400", dot: "bg-red-400", btn: "bg-red-500/20 border-red-500/40 text-red-300" },
  lime: { text: "text-lime-400", dot: "bg-lime-400", btn: "bg-lime-500/20 border-lime-500/40 text-lime-300" },
};

function SlideMedia({ slide, isActive }: { slide: HeroSlide; isActive: boolean }) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !slide.video) return;
    if (isActive) {
      video.currentTime = 0;
      video.play().catch(() => {});
    } else {
      video.pause();
    }
  }, [isActive, slide.video]);

  return (
    <>
      {/* Gradient fallback while loading */}
      <div className={`absolute inset-0 bg-gradient-to-br ${slide.gradient}`} />
      {slide.video ? (
        <video
          ref={videoRef}
          src={slide.video}
          muted
          autoPlay={isActive}
          loop
          playsInline
          preload={isActive ? "auto" : "metadata"}
          className="absolute inset-0 w-full h-full object-cover"
        />
      ) : slide.image ? (
        <img src={slide.image} alt={slide.title} className="absolute inset-0 w-full h-full object-cover" />
      ) : null}
      <div className="absolute inset-0 bg-slate-950/20" />
    </>
  );
}

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
    const interval = setInterval(() => {
      const next = (activeIndex + 1) % heroSlides.length;
      goToSlide(next);
    }, 8000);
    return () => clearInterval(interval);
  }, [activeIndex, goToSlide]);

  const nextIndex = (activeIndex + 1) % heroSlides.length;
  const visibleIndices = new Set([activeIndex, prevIndex, nextIndex]);
  const currentSlide = heroSlides[activeIndex];
  const accent = heroAccents[currentSlide.accent] || heroAccents.cyan;

  return (
    <div className="relative w-full mt-4 h-[40vh] md:h-[50vh] rounded-2xl overflow-hidden border border-white/10" data-testid="section-hero-slideshow">
      {heroSlides.map((slide, i) => {
        const isActive = i === activeIndex;
        const isPrev = i === prevIndex && transitioning;
        const shouldMount = visibleIndices.has(i);
        return (
          <div key={i} className="absolute inset-0" style={{ opacity: isActive ? 1 : isPrev ? 1 : 0, transitionDuration: "1200ms", transitionTimingFunction: "ease-in-out", transitionProperty: "opacity", zIndex: isActive ? 2 : isPrev ? 1 : 0, visibility: shouldMount ? "visible" : "hidden" }}>
            {shouldMount ? <SlideMedia slide={slide} isActive={isActive} /> : <div className={`absolute inset-0 bg-gradient-to-br ${slide.gradient}`} />}
          </div>
        );
      })}

      {/* Gradient overlays */}
      <div className="absolute inset-0 z-10" style={{ background: "linear-gradient(to bottom, rgba(2,6,23,0.1) 0%, rgba(2,6,23,0.05) 40%, rgba(2,6,23,0.4) 70%, rgba(2,6,23,0.9) 100%)" }} />
      <div className="absolute inset-0 z-10 bg-gradient-to-r from-slate-950/40 via-transparent to-slate-950/40" />

      {/* Branded overlay content */}
      <div className="absolute bottom-0 left-0 right-0 z-20 p-6 md:p-10">
        <div className="flex items-center gap-2 mb-2">
          <div className={`w-2 h-2 rounded-full ${accent.dot} animate-pulse`} />
          <span className={`text-[10px] font-semibold uppercase tracking-widest ${accent.text}`}>Trust Layer Ecosystem</span>
        </div>
        <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold text-white mb-2 leading-tight" data-testid="text-slideshow-title">{currentSlide.title}</h2>
        <p className="text-sm md:text-base text-white/60 max-w-xl mb-4" data-testid="text-slideshow-subtitle">{currentSlide.subtitle}</p>
        <Button
          variant="outline"
          className={`backdrop-blur-sm border ${accent.btn} text-sm`}
          onClick={() => window.open(currentSlide.link, '_blank', 'noopener,noreferrer')}
          data-testid="button-slideshow-visit"
        >
          Visit {currentSlide.title.split(" ")[0]}
          <ArrowRight className="w-3.5 h-3.5 ml-2" />
        </Button>
      </div>

      {/* Dot navigation */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 flex items-center gap-1">
        {heroSlides.map((_, i) => {
          const isActive = i === activeIndex;
          const slideAccent = heroAccents[heroSlides[i].accent] || heroAccents.cyan;
          return (
            <div key={i} onClick={() => goToSlide(i)} className={`cursor-pointer rounded-full transition-all duration-300 ${isActive ? slideAccent.dot + ' w-4 h-1.5' : 'bg-white/30 w-1.5 h-1.5'}`} data-testid={`button-slideshow-dot-${i}`} />
          );
        })}
      </div>
    </div>
  );
}

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

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["blockchain-stats"],
    queryFn: fetchBlockchainStats,
    refetchInterval: 3000,
    staleTime: 2000,
  });

  const favoriteApps = apps.filter(app => preferences.favorites.includes(app.id));

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden selection:bg-primary/20 selection:text-primary">
      <OnboardingTour />
      <SimpleLoginModal 
        isOpen={showLoginModal} 
        onClose={() => setShowLoginModal(false)} 
      />
      
      

      <section className="relative min-h-[85vh] flex items-center justify-center pt-20 md:pt-14 overflow-hidden">
        <KenBurnsBackground
          images={[
            heroBg,
            tradingImg,
            launchpadImg,
            earnImg,
            devStudioImg,
            toolsImg
          ]}
          overlayOpacity={0.5}
        />
        <div className="absolute inset-0 z-0 pointer-events-none">
          {/* Blockchain Network Lattice */}
          <svg className="absolute inset-0 w-full h-full opacity-40" preserveAspectRatio="xMidYMid slice">
            <defs>
              <radialGradient id="nodeGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#06b6d4" stopOpacity="1" />
                <stop offset="100%" stopColor="#06b6d4" stopOpacity="0" />
              </radialGradient>
              <radialGradient id="nodeGlowPurple" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#a855f7" stopOpacity="1" />
                <stop offset="100%" stopColor="#a855f7" stopOpacity="0" />
              </radialGradient>
            </defs>
            {/* Connection lines */}
            {[
              { x1: '10%', y1: '20%', x2: '25%', y2: '35%' },
              { x1: '25%', y1: '35%', x2: '15%', y2: '55%' },
              { x1: '25%', y1: '35%', x2: '40%', y2: '25%' },
              { x1: '40%', y1: '25%', x2: '55%', y2: '40%' },
              { x1: '55%', y1: '40%', x2: '70%', y2: '30%' },
              { x1: '70%', y1: '30%', x2: '85%', y2: '45%' },
              { x1: '85%', y1: '45%', x2: '90%', y2: '25%' },
              { x1: '15%', y1: '55%', x2: '30%', y2: '70%' },
              { x1: '30%', y1: '70%', x2: '50%', y2: '65%' },
              { x1: '50%', y1: '65%', x2: '55%', y2: '40%' },
              { x1: '50%', y1: '65%', x2: '70%', y2: '75%' },
              { x1: '70%', y1: '75%', x2: '85%', y2: '60%' },
              { x1: '85%', y1: '60%', x2: '85%', y2: '45%' },
              { x1: '20%', y1: '85%', x2: '30%', y2: '70%' },
              { x1: '70%', y1: '75%', x2: '80%', y2: '90%' },
            ].map((line, i) => (
              <line
                key={`line-${i}`}
                x1={line.x1}
                y1={line.y1}
                x2={line.x2}
                y2={line.y2}
                stroke="url(#waveGradientCyan)"
                strokeWidth="1"
                strokeOpacity="0.4"
                className="animate-pulse"
                style={{ animationDelay: `${i * 0.2}s` }}
              />
            ))}
            {/* Nodes */}
            {[
              { cx: '10%', cy: '20%', size: 6 },
              { cx: '25%', cy: '35%', size: 8 },
              { cx: '15%', cy: '55%', size: 5 },
              { cx: '40%', cy: '25%', size: 7 },
              { cx: '55%', cy: '40%', size: 9 },
              { cx: '70%', cy: '30%', size: 6 },
              { cx: '85%', cy: '45%', size: 8 },
              { cx: '90%', cy: '25%', size: 5 },
              { cx: '30%', cy: '70%', size: 7 },
              { cx: '50%', cy: '65%', size: 6 },
              { cx: '70%', cy: '75%', size: 8 },
              { cx: '85%', cy: '60%', size: 5 },
              { cx: '20%', cy: '85%', size: 6 },
              { cx: '80%', cy: '90%', size: 7 },
            ].map((node, i) => (
              <g key={`node-${i}`}>
                <circle
                  cx={node.cx}
                  cy={node.cy}
                  r={node.size * 2}
                  fill={i % 2 === 0 ? 'url(#nodeGlow)' : 'url(#nodeGlowPurple)'}
                  className="animate-pulse"
                  style={{ animationDelay: `${i * 0.15}s` }}
                />
                <circle
                  cx={node.cx}
                  cy={node.cy}
                  r={node.size}
                  fill={i % 2 === 0 ? '#06b6d4' : '#a855f7'}
                  className="animate-pulse"
                  style={{ animationDelay: `${i * 0.15}s` }}
                />
              </g>
            ))}
          </svg>
        </div>

        <div className="container relative z-10 px-4 text-center">
          {isAuthenticated && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6"
            >
              <p className="text-xl md:text-2xl font-medium text-white/90" data-testid="text-greeting">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">
                  {getTimeGreeting()}, {username}
                </span>
                <Sparkles className="inline-block w-5 h-5 ml-2 text-cyan-400" />
              </p>
            </motion.div>
          )}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto space-y-6 mt-6"
          >
            <Badge variant="outline" className="px-3 py-1 border-primary/50 text-primary bg-primary/10 rounded-full text-xs font-tech tracking-wider uppercase">
              The Next Generation Ecosystem
            </Badge>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-display font-bold leading-tight bg-clip-text text-transparent bg-gradient-to-b from-white to-white/50">
              Welcome to <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-cyan-400 to-secondary">Trust Layer</span>
            </h1>

            <p className="text-lg md:text-xl text-white/70 max-w-2xl mx-auto font-medium">
              Where trust becomes the layer of truth.
            </p>

            {/* Premium Ecosystem Slideshow */}
            <HeroSlideshow />

          </motion.div>
        </div>
      </section>


      {/* Thin Gradient Divider with Glow */}
      <Link href="/presale">
        <div className="relative py-3 cursor-pointer group">
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-purple-600/40 to-slate-950" />
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-purple-400/60 to-transparent shadow-[0_0_20px_rgba(168,85,247,0.5)]" />
          <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-purple-400/60 to-transparent shadow-[0_0_20px_rgba(168,85,247,0.5)]" />
          <div className="container mx-auto px-4 relative z-10 flex items-center justify-center">
            <Badge className="bg-purple-500/20 border-purple-400/50 text-purple-200 hover:bg-purple-500/30 transition-colors px-6 py-1.5 text-sm font-medium">
              <Sparkles className="w-3 h-3 mr-2" />
              Signal Token Presale Live — Join Now
              <ArrowRight className="w-3 h-3 ml-2 group-hover:translate-x-1 transition-transform" />
            </Badge>
          </div>
        </div>
      </Link>

      {/* DeFi Section - Premium Protocol Style */}
      <section className="py-16 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-pink-500/5 via-purple-500/5 to-transparent" />
        <div className="container mx-auto max-w-6xl relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <Badge variant="outline" className="border-pink-500/50 text-pink-400 text-[10px] mb-3">DeFi Suite</Badge>
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-3">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-400 via-purple-400 to-primary">
                Decentralized Finance
              </span>
            </h2>
            <p className="text-sm text-muted-foreground max-w-lg mx-auto">
              Trade, stake, and explore the Trust Layer DeFi ecosystem. Built for speed, designed for you.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Trading Hub Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0 }}
            >
              <div className="relative h-full overflow-hidden rounded-2xl border border-white/10 hover:border-pink-500/50 transition-all duration-300 group" style={{ boxShadow: '0 0 40px rgba(236,72,153,0.15)' }}>
                <img src={tradingImg} alt="" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/60 to-pink-900/40" />
                <div className="relative z-10 p-5">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-500/40 to-purple-500/40 backdrop-blur-sm flex items-center justify-center group-hover:shadow-[0_0_30px_rgba(236,72,153,0.4)] transition-shadow">
                      <ArrowUpDown className="w-6 h-6 text-pink-300" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-white text-shadow">Trading</h3>
                      <p className="text-[11px] text-white/70">Swap, liquidity & charts</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <Link href="/swap">
                      <div className="p-2.5 rounded-lg bg-black/40 backdrop-blur-sm border border-white/10 hover:border-pink-500/40 hover:bg-pink-500/20 transition-all text-center group/item" data-testid="link-swap">
                        <ArrowUpDown className="w-4 h-4 mx-auto mb-1 text-pink-400" />
                        <span className="text-[10px] text-gray-200 group-hover/item:text-white">Swap</span>
                      </div>
                    </Link>
                    <Link href="/liquidity">
                      <div className="p-2.5 rounded-lg bg-black/40 backdrop-blur-sm border border-white/10 hover:border-emerald-500/40 hover:bg-emerald-500/20 transition-all text-center group/item" data-testid="link-liquidity">
                        <Droplets className="w-4 h-4 mx-auto mb-1 text-emerald-400" />
                        <span className="text-[10px] text-gray-200 group-hover/item:text-white">Pools</span>
                      </div>
                    </Link>
                    <Link href="/charts">
                      <div className="p-2.5 rounded-lg bg-black/40 backdrop-blur-sm border border-white/10 hover:border-sky-500/40 hover:bg-sky-500/20 transition-all text-center group/item" data-testid="link-charts">
                        <LineChart className="w-4 h-4 mx-auto mb-1 text-sky-400" />
                        <span className="text-[10px] text-gray-200 group-hover/item:text-white">Charts</span>
                      </div>
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* NFT Hub Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              <div className="relative h-full overflow-hidden rounded-2xl border border-white/10 hover:border-purple-500/50 transition-all duration-300 group" style={{ boxShadow: '0 0 40px rgba(168,85,247,0.15)' }}>
                <img src={nftImg} alt="" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/60 to-purple-900/40" />
                <div className="relative z-10 p-5">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500/40 to-violet-500/40 backdrop-blur-sm flex items-center justify-center group-hover:shadow-[0_0_30px_rgba(168,85,247,0.4)] transition-shadow">
                      <ImageIcon className="w-6 h-6 text-purple-300" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-white text-shadow">NFT</h3>
                      <p className="text-[11px] text-white/70">Collect, create & explore</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <Link href="/nft">
                      <div className="p-2.5 rounded-lg bg-black/40 backdrop-blur-sm border border-white/10 hover:border-purple-500/40 hover:bg-purple-500/20 transition-all text-center group/item" data-testid="link-nft-market">
                        <ImageIcon className="w-4 h-4 mx-auto mb-1 text-purple-400" />
                        <span className="text-[10px] text-gray-200 group-hover/item:text-white">Market</span>
                      </div>
                    </Link>
                    <Link href="/nft-gallery">
                      <div className="p-2.5 rounded-lg bg-black/40 backdrop-blur-sm border border-white/10 hover:border-violet-500/40 hover:bg-violet-500/20 transition-all text-center group/item" data-testid="link-nft-gallery">
                        <ImageIcon className="w-4 h-4 mx-auto mb-1 text-violet-400" />
                        <span className="text-[10px] text-gray-200 group-hover/item:text-white">Gallery</span>
                      </div>
                    </Link>
                    <Link href="/nft-creator">
                      <div className="p-2.5 rounded-lg bg-black/40 backdrop-blur-sm border border-white/10 hover:border-rose-500/40 hover:bg-rose-500/20 transition-all text-center group/item" data-testid="link-nft-creator">
                        <Palette className="w-4 h-4 mx-auto mb-1 text-rose-400" />
                        <span className="text-[10px] text-gray-200 group-hover/item:text-white">Create</span>
                      </div>
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Tools Hub Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <div className="relative h-full overflow-hidden rounded-2xl border border-white/10 hover:border-cyan-500/50 transition-all duration-300 group" style={{ boxShadow: '0 0 40px rgba(6,182,212,0.15)' }}>
                <img src={toolsImg} alt="" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/60 to-cyan-900/40" />
                <div className="relative z-10 p-5">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500/40 to-blue-500/40 backdrop-blur-sm flex items-center justify-center group-hover:shadow-[0_0_30px_rgba(6,182,212,0.4)] transition-shadow">
                      <Zap className="w-6 h-6 text-cyan-300" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-white text-shadow">Tools</h3>
                      <p className="text-[11px] text-white/70">Faucet, portfolio & more</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <Link href="/faucet">
                      <div className="p-2.5 rounded-lg bg-black/40 backdrop-blur-sm border border-white/10 hover:border-cyan-500/40 hover:bg-cyan-500/20 transition-all text-center group/item" data-testid="link-faucet">
                        <Droplets className="w-4 h-4 mx-auto mb-1 text-cyan-400" />
                        <span className="text-[10px] text-gray-200 group-hover/item:text-white">Faucet</span>
                      </div>
                    </Link>
                    <Link href="/portfolio">
                      <div className="p-2.5 rounded-lg bg-black/40 backdrop-blur-sm border border-white/10 hover:border-green-500/40 hover:bg-green-500/20 transition-all text-center group/item" data-testid="link-portfolio">
                        <PieChart className="w-4 h-4 mx-auto mb-1 text-green-400" />
                        <span className="text-[10px] text-gray-200 group-hover/item:text-white">Portfolio</span>
                      </div>
                    </Link>
                    <Link href="/transactions">
                      <div className="p-2.5 rounded-lg bg-black/40 backdrop-blur-sm border border-white/10 hover:border-blue-500/40 hover:bg-blue-500/20 transition-all text-center group/item" data-testid="link-history">
                        <History className="w-4 h-4 mx-auto mb-1 text-blue-400" />
                        <span className="text-[10px] text-gray-200 group-hover/item:text-white">History</span>
                      </div>
                    </Link>
                  </div>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    <Link href="/launchpad">
                      <div className="p-2.5 rounded-lg bg-black/40 backdrop-blur-sm border border-white/10 hover:border-cyan-500/40 hover:bg-cyan-500/20 transition-all text-center group/item" data-testid="link-launchpad">
                        <Rocket className="w-4 h-4 mx-auto mb-1 text-cyan-400" />
                        <span className="text-[10px] text-gray-200 group-hover/item:text-white">Launchpad</span>
                      </div>
                    </Link>
                    <Link href="/webhooks">
                      <div className="p-2.5 rounded-lg bg-black/40 backdrop-blur-sm border border-white/10 hover:border-purple-500/40 hover:bg-purple-500/20 transition-all text-center group/item" data-testid="link-webhooks">
                        <Webhook className="w-4 h-4 mx-auto mb-1 text-purple-400" />
                        <span className="text-[10px] text-gray-200 group-hover/item:text-white">Webhooks</span>
                      </div>
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* Builders Suite - Dev IDE + Launchpad */}
      <section className="py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-8"
          >
            <Badge variant="outline" className="border-cyan-500/50 text-cyan-400 text-[10px] mb-3">Builders Suite</Badge>
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-3">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400">
                Build on Trust Layer
              </span>
            </h2>
            <p className="text-sm text-muted-foreground max-w-lg mx-auto">
              Everything you need to create and launch your decentralized applications.
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link href="/studio">
              <GlassCard glow hover={false} className="h-full overflow-hidden">
                <div className="relative h-full">
                  <div className="aspect-[16/9] relative overflow-hidden">
                    <img src={devStudioImg} alt="Dev Studio" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent" />
                  </div>
                  <div className="p-5 relative z-10 -mt-16">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-12 h-12 rounded-xl bg-primary/20 backdrop-blur-sm flex items-center justify-center shrink-0 border border-primary/30">
                        <Code className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <Badge variant="outline" className="border-green-500/50 text-green-400 text-[10px] mb-1">Live</Badge>
                        <h3 className="text-lg font-bold text-white">Dev Studio</h3>
                      </div>
                    </div>
                    <p className="text-xs text-white/60 mb-4">Cloud IDE for blockchain development with Monaco editor, templates, and deployment tools.</p>
                    <Button className="w-full bg-primary text-background hover:bg-primary/90 font-semibold" data-testid="button-open-dev-studio">
                      Open Studio <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </div>
              </GlassCard>
            </Link>
            
            <Link href="/launchpad">
              <GlassCard glow hover={false} className="h-full overflow-hidden">
                <div className="relative h-full">
                  <div className="aspect-[16/9] relative overflow-hidden">
                    <img src={launchpadImg} alt="Launchpad" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent" />
                  </div>
                  <div className="p-5 relative z-10 -mt-16">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-12 h-12 rounded-xl bg-cyan-500/20 backdrop-blur-sm flex items-center justify-center shrink-0 border border-cyan-500/30">
                        <Rocket className="w-6 h-6 text-cyan-400" />
                      </div>
                      <div>
                        <Badge variant="outline" className="border-green-500/50 text-green-400 text-[10px] mb-1">Live</Badge>
                        <h3 className="text-lg font-bold text-white">Launchpad</h3>
                      </div>
                    </div>
                    <p className="text-xs text-white/60 mb-4">Launch your own tokens with fair distribution, vesting schedules, and community tools.</p>
                    <Button className="w-full bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-400 hover:to-purple-400 text-black font-semibold" data-testid="button-open-launchpad">
                      Launch Now <Rocket className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </div>
              </GlassCard>
            </Link>
          </div>
        </div>
      </section>

      {favoriteApps.length > 0 && (
        <section className="py-12 px-4">
          <div className="container mx-auto max-w-6xl">
            <div className="flex items-center gap-2 mb-6">
              <Heart className="w-5 h-5 text-red-400 fill-current" />
              <h2 className="text-xl font-display font-bold">Your Favorites</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {favoriteApps.map((app) => (
                <AppCard 
                  key={app.id}
                  id={app.id}
                  name={app.name} 
                  category={app.category} 
                  desc={app.description} 
                  gradient={app.gradient}
                  url={app.url}
                  showFavorite
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Ecosystem - App Store */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-10">
            <Badge variant="outline" className="border-emerald-500/50 text-emerald-400 text-[10px] mb-3">App Store</Badge>
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-3">Ecosystem</h2>
            <p className="text-sm text-muted-foreground max-w-lg mx-auto">
              Join our thriving ecosystem of decentralized applications. Everything lives on the same universal ledger.
            </p>
          </div>

          {appsLoading ? (
            <div className="flex justify-center">
              <SkeletonCard />
            </div>
          ) : (
            <EcosystemCarousel apps={apps} />
          )}
          
          <div className="mt-6 flex justify-center">
            <Link href="/launchpad">
              <Button className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-black font-bold gap-2">
                <Rocket className="w-4 h-4" />
                Submit Your Project
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Chronicles */}
      <section className="py-16 px-4 relative overflow-hidden bg-gradient-to-b from-purple-950/20 via-black to-black">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-900/20 via-transparent to-transparent" />
        <div className="container mx-auto max-w-6xl relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-8"
          >
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-2">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400">
                Chronicles
              </span>
            </h2>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-cyan-600/20 via-purple-600/20 to-pink-600/20 border border-purple-400/40 backdrop-blur-sm mb-3">
              <div className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" />
              <span className="text-xs text-purple-300 font-medium">Season Zero</span>
              <span className="text-white/40">•</span>
              <span className="text-xs text-pink-300">Coming Soon</span>
            </div>
            <p className="text-sm text-muted-foreground max-w-2xl mx-auto">
              An unprecedented adventure platform where YOU are the hero. Emotions drive behavior, consequences ripple through time, and every perspective matters.
            </p>
          </motion.div>

          <ChroniclesCarousel />

          <div className="flex flex-row items-center justify-center gap-3">
            <a href="https://yourlegacy.io/era-codex" target="_blank" rel="noopener noreferrer">
              <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500" data-testid="button-explore-eras">
                <Sparkles className="w-4 h-4 mr-2" />
                View Eras
              </Button>
            </a>
            <a href="https://yourlegacy.io" target="_blank" rel="noopener noreferrer">
              <Button variant="outline" className="border-purple-500/50 text-purple-400 hover:bg-purple-500/10" data-testid="button-play-chronicles">
                Play Chronicles
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* Network Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <Badge variant="outline" className="border-green-500/50 text-green-400 text-[10px] mb-3">Network</Badge>
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-3">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-green-400 via-cyan-400 to-blue-400">
                Chain Infrastructure
              </span>
            </h2>
            <p className="text-sm text-muted-foreground max-w-lg mx-auto">
              Building toward omnichain interoperability - no bridges, just seamless transfers.
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <GlassCard hover={false}>
              <div className="p-4 text-center">
                <div className="flex items-center justify-center gap-1 mb-2">
                  <Zap className="w-4 h-4 text-primary" />
                  <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                </div>
                <div className="text-2xl font-bold text-white">{stats?.tps || "200K+"}</div>
                <div className="text-[10px] text-white/50 uppercase">TPS</div>
              </div>
            </GlassCard>
            <GlassCard hover={false}>
              <div className="p-4 text-center">
                <div className="flex items-center justify-center gap-1 mb-2">
                  <Activity className="w-4 h-4 text-cyan-400" />
                  <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                </div>
                <div className="text-2xl font-bold text-white">{stats?.finalityTime || "0.4s"}</div>
                <div className="text-[10px] text-white/50 uppercase">Finality</div>
              </div>
            </GlassCard>
            <GlassCard hover={false}>
              <div className="p-4 text-center">
                <Cpu className="w-4 h-4 text-purple-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-white">{stats?.avgCost || "$0.0001"}</div>
                <div className="text-[10px] text-white/50 uppercase">Avg Cost</div>
              </div>
            </GlassCard>
            <GlassCard hover={false}>
              <div className="p-4 text-center">
                <div className="flex items-center justify-center gap-1 mb-2">
                  <Server className="w-4 h-4 text-cyan-400" />
                  <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                  <span className="text-[8px] text-cyan-400 uppercase">TESTNET</span>
                </div>
                <div className="text-lg font-bold text-white">Founders</div>
                <div className="text-[10px] text-white/50 uppercase">Validator</div>
              </div>
            </GlassCard>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <GlassCard>
              <div className="p-4 flex items-start gap-3">
                <div className="p-2 rounded-lg bg-primary/20 text-primary shrink-0">
                  <Zap className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-bold text-white mb-1">Instant Consensus</h3>
                  <p className="text-xs text-white/50">Advanced DAG protocols for sub-second finality</p>
                </div>
              </div>
            </GlassCard>
            <GlassCard>
              <div className="p-4 flex items-start gap-3">
                <div className="p-2 rounded-lg bg-cyan-500/20 text-cyan-400 shrink-0">
                  <Shield className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-sm font-bold text-white">Chain Abstraction</h3>
                    <Badge variant="outline" className="text-[9px] border-purple-500/50 text-purple-400 px-1">Coming Soon</Badge>
                  </div>
                  <p className="text-xs text-white/50">Manage assets across chains from one account</p>
                </div>
              </div>
            </GlassCard>
            <GlassCard>
              <div className="p-4 flex items-start gap-3">
                <div className="p-2 rounded-lg bg-purple-500/20 text-purple-400 shrink-0">
                  <Layers className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-sm font-bold text-white">Cross-Chain</h3>
                    <Badge variant="outline" className="text-[9px] border-purple-500/50 text-purple-400 px-1">In Dev</Badge>
                  </div>
                  <p className="text-xs text-white/50">Native protocols for secure asset transfers</p>
                </div>
              </div>
            </GlassCard>
          </div>

          <div className="mt-6 flex justify-center">
            <Link href="/network">
              <Button variant="outline" className="border-green-500/30 text-green-400 hover:bg-green-500/10 gap-2">
                <Activity className="w-4 h-4" />
                View Network Status
              </Button>
            </Link>
          </div>
        </div>
      </section>


      
    </div>
  );
}

const gradientColors: Record<string, { from: string; to: string }> = {
  "from-gray-500 to-gray-700": { from: "#6b7280", to: "#374151" },
  "from-indigo-600 to-violet-800": { from: "#4f46e5", to: "#5b21b6" },
  "from-cyan-400 to-blue-500": { from: "#22d3ee", to: "#3b82f6" },
  "from-slate-600 to-zinc-800": { from: "#475569", to: "#27272a" },
  "from-emerald-600 to-teal-800": { from: "#059669", to: "#115e59" },
  "from-purple-600 to-teal-800": { from: "#d97706", to: "#854d0e" },
  "from-cyan-600 to-blue-700": { from: "#0891b2", to: "#1d4ed8" },
  "from-cyan-500 to-blue-600": { from: "#06b6d4", to: "#2563eb" },
  "from-cyan-500 to-red-600": { from: "#f97316", to: "#dc2626" },
  "from-red-600 to-rose-700": { from: "#dc2626", to: "#be123c" },
};

function AppCard({ id, name, category, desc, gradient, showFavorite, url }: { id?: string, name: string, category: string, desc: string, gradient: string, showFavorite?: boolean, url?: string }) {
  const [imgFailed, setImgFailed] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);
  const imageSrc = id ? ecosystemImages[id] : "";
  const colors = gradientColors[gradient] || { from: "#0891b2", to: "#1d4ed8" };
  
  return (
    <div data-testid={`card-app-${id}`} className="group">
      <GlassCard className="h-full overflow-hidden">
        <div className="aspect-[3/4] relative">
          {(!imgLoaded || imgFailed || !imageSrc) && (
            <div 
              className="absolute inset-0 flex items-center justify-center"
              style={{ background: `linear-gradient(to bottom right, ${colors.from}, ${colors.to})` }}
            >
              <span className="text-4xl font-bold text-white/80">{name.charAt(0)}</span>
            </div>
          )}
          {imageSrc && (
            <img 
              src={imageSrc} 
              alt={name}
              className={`w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ${imgLoaded && !imgFailed ? 'opacity-100' : 'opacity-0'}`}
              onLoad={() => setImgLoaded(true)}
              onError={() => setImgFailed(true)}
            />
          )}
          {/* Fade to black gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
          
          {/* Favorite button at top right */}
          {showFavorite && id && (
            <div className="absolute top-2 right-2 z-10" onClick={(e) => e.stopPropagation()}>
              <FavoriteButton appId={id} />
            </div>
          )}
          
          {/* Content overlay at bottom */}
          <div className="absolute bottom-0 left-0 right-0 p-3">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-sm font-bold text-white truncate flex-1" style={{ textShadow: '0 2px 8px rgba(0,0,0,0.9)' }}>{name}</h3>
              <Badge variant="secondary" className="text-[8px] uppercase bg-white/10 text-white/60 shrink-0 px-1.5 py-0">
                {category}
              </Badge>
            </div>
            <p className="text-[10px] text-white/60 line-clamp-2 mb-3">{desc}</p>
            <ExploreButton url={url} appName={name} />
          </div>
        </div>
      </GlassCard>
    </div>
  );
}