import { motion } from "framer-motion";
import { Link } from "wouter";
import { ArrowRight, Code, Globe, Layers, Shield, Zap, Cpu, Network, Database, Heart, Sparkles, Activity, Server, CheckCircle2, Droplets, ArrowUpDown, ImageIcon, PieChart, History, Rocket, LineChart, Webhook, Palette, Trophy, Target, ChevronDown, ChevronLeft, ChevronRight, Gift, Search, MessageCircle } from "lucide-react";
import { openGlobalSearch } from "@/components/global-search";
import { InfoTooltip } from "@/components/info-tooltip";
import heroBg from "@assets/generated_images/abstract_blockchain_network_nodes_connecting_in_dark_space.png";
import darkwaveLogo from "@assets/generated_images/darkwave_token_transparent.png";
import signalEmblem from "@assets/generated_images/darkwave_trust_layer_emblem_enhanced.png";
import shieldImage from "/shield-reference.jpg";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { OnboardingTour } from "@/components/onboarding-tour";
import { useQuery } from "@tanstack/react-query";
import { fetchEcosystemApps, fetchBlockchainStats } from "@/lib/api";
import { FavoriteButton } from "@/components/favorite-button";
import { SkeletonCard } from "@/components/ui/skeleton-card";
import { MobileNav } from "@/components/mobile-nav";
import { usePreferences } from "@/lib/store";
import { Footer } from "@/components/footer";
import { usePageAnalytics } from "@/hooks/use-analytics";
import { GlassCard } from "@/components/glass-card";
import { useSimpleAuth } from "@/hooks/use-simple-auth";
import { SimpleLoginModal } from "@/components/simple-login";
import { GamesComingSoonModal } from "@/components/games-coming-soon-modal";
import { useState, useRef, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { WalletButton } from "@/components/wallet-button";
import { MemberBadge } from "@/components/member-badge";
import stoneAgeImg from "@assets/generated_images/stone_age_village_scene.png";
import medievalImg from "@assets/generated_images/medieval_castle_vertical_portrait.png";
import egyptImg from "@assets/generated_images/ancient_egyptian_kingdom_sunset.png";
import greeceImg from "@assets/generated_images/ancient_greek_athens_parthenon.png";
import samuraiImg from "@assets/generated_images/feudal_japan_samurai_castle.png";
import steampunkImg from "@assets/generated_images/industrial_steampunk_city.png";
import renaissanceImg from "@assets/generated_images/renaissance_florence_italy_scene.png";
import romanImg from "@assets/generated_images/roman_empire_colosseum_gladiators.png";
import vikingImg from "@assets/generated_images/viking_longship_fjord_scene.png";
import wildWestImg from "@assets/generated_images/wild_west_frontier_town.png";
import tradingImg from "@assets/generated_images/futuristic_blockchain_network_activity_monitor.png";
import nftImg from "@assets/generated_images/fantasy_character_heroes.png";
import devStudioImg from "@assets/generated_images/developer_portal_apis.png";
import launchpadImg from "@assets/generated_images/rocket_launching_growth.png";
import toolsImg from "@assets/generated_images/futuristic_dashboard_interface_for_managing_decentralized_applications.png";
import earnImg from "@assets/generated_images/darkwave_crypto_token_coin_holographic.png";

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
              <Badge className="bg-amber-500 text-black">Beta</Badge>
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
  "orbit-staffing": "/ecosystem/orbit-staffing.jpg",
  "lotopspro": "/ecosystem/lotopspro.jpg",
  "lotops-pro": "/ecosystem/lotopspro.jpg",
  "brew-board": "/ecosystem/brew-board.jpg",
  "garagebot": "/ecosystem/garagebot-prod.jpg",
  "garagebot-prod": "/ecosystem/garagebot-prod.jpg",
  "darkwave-pulse": "/ecosystem/darkwave-pulse.jpg",
  "paintpros": "/ecosystem/paintpros.jpg",
  "orby": "/ecosystem/orby.jpg",
  "strike-agent": "/ecosystem/strike-agent.jpg",
  "veda-solus": "/ecosystem/veda-solus.jpg",
  "vedasolus": "/ecosystem/veda-solus.jpg",
};

const CHRONICLES_ERAS = [
  { img: stoneAgeImg, era: "Dawn Age", desc: "Stone Age origins", color: "from-amber-500/30 to-orange-600/30" },
  { img: egyptImg, era: "Kingdom of Ra", desc: "Ancient Egypt", color: "from-yellow-500/30 to-amber-600/30" },
  { img: greeceImg, era: "Hellenic Glory", desc: "Ancient Greece", color: "from-sky-500/30 to-blue-600/30" },
  { img: romanImg, era: "Imperial Rome", desc: "Roman Empire", color: "from-red-500/30 to-orange-600/30" },
  { img: vikingImg, era: "Norse Saga", desc: "Viking Age", color: "from-slate-500/30 to-blue-600/30" },
  { img: medievalImg, era: "Age of Crowns", desc: "Medieval kingdoms", color: "from-purple-500/30 to-indigo-600/30" },
  { img: samuraiImg, era: "Shogunate", desc: "Feudal Japan", color: "from-rose-500/30 to-red-600/30" },
  { img: renaissanceImg, era: "Renaissance", desc: "Age of Enlightenment", color: "from-emerald-500/30 to-teal-600/30" },
  { img: wildWestImg, era: "Frontier", desc: "Wild West", color: "from-orange-500/30 to-amber-600/30" },
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
    "from-amber-600 to-yellow-800": { from: "#d97706", to: "#854d0e" },
    "from-cyan-600 to-blue-700": { from: "#0891b2", to: "#1d4ed8" },
    "from-cyan-500 to-blue-600": { from: "#06b6d4", to: "#2563eb" },
    "from-orange-500 to-red-600": { from: "#f97316", to: "#dc2626" },
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

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
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
    "from-amber-600 to-yellow-800": { from: "#d97706", to: "#854d0e" },
    "from-cyan-600 to-blue-700": { from: "#0891b2", to: "#1d4ed8" },
    "from-cyan-500 to-blue-600": { from: "#06b6d4", to: "#2563eb" },
    "from-orange-500 to-red-600": { from: "#f97316", to: "#dc2626" },
    "from-red-600 to-rose-700": { from: "#dc2626", to: "#be123c" },
  };

  return (
    <div className="relative">
      <button
        onClick={() => scroll('left')}
        className={`absolute -left-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-black/80 backdrop-blur-xl border border-white/20 flex items-center justify-center transition-all ${canScrollLeft ? 'opacity-100 hover:bg-white/10 hover:border-primary/50' : 'opacity-30 cursor-not-allowed'}`}
        disabled={!canScrollLeft}
        data-testid="button-ecosystem-carousel-left"
      >
        <ChevronLeft className="w-6 h-6 text-white" />
      </button>
      
      <button
        onClick={() => scroll('right')}
        className={`absolute -right-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-black/80 backdrop-blur-xl border border-white/20 flex items-center justify-center transition-all ${canScrollRight ? 'opacity-100 hover:bg-white/10 hover:border-primary/50' : 'opacity-30 cursor-not-allowed'}`}
        disabled={!canScrollRight}
        data-testid="button-ecosystem-carousel-right"
      >
        <ChevronRight className="w-6 h-6 text-white" />
      </button>

      <div 
        ref={scrollRef}
        onScroll={checkScroll}
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
    </div>
  );
}

function getTimeGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

export default function Home() {
  const { preferences } = usePreferences();
  const { user, loading: authLoading, isAuthenticated, displayName, username, logout } = useSimpleAuth();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showGamesModal, setShowGamesModal] = useState(false);
  const [showPresalePopup, setShowPresalePopup] = useState(false);
  const [quickRegFirstName, setQuickRegFirstName] = useState("");
  const [quickRegEmail, setQuickRegEmail] = useState("");
  const [quickRegLoading, setQuickRegLoading] = useState(false);
  const [quickRegSuccess, setQuickRegSuccess] = useState(false);
  const [quickRegError, setQuickRegError] = useState("");
  usePageAnalytics();

  useEffect(() => {
    const timer = setTimeout(() => {
      const hasSeenPopup = sessionStorage.getItem("presale_popup_seen");
      if (!hasSeenPopup) {
        setShowPresalePopup(true);
      }
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  const handleQuickRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickRegFirstName.trim() || !quickRegEmail.trim()) {
      setQuickRegError("Please enter your name and email");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(quickRegEmail)) {
      setQuickRegError("Please enter a valid email address");
      return;
    }
    setQuickRegLoading(true);
    setQuickRegError("");
    try {
      const response = await fetch("/api/auth/quick-register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ firstName: quickRegFirstName.trim(), email: quickRegEmail.trim().toLowerCase() }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Registration failed");
      }
      setQuickRegSuccess(true);
      sessionStorage.setItem("presale_popup_seen", "true");
    } catch (err: any) {
      setQuickRegError(err.message || "Something went wrong");
    } finally {
      setQuickRegLoading(false);
    }
  };
  
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
      {showGamesModal && <GamesComingSoonModal onClose={() => setShowGamesModal(false)} />}
      
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-background/90 backdrop-blur-xl">
        <div className="w-full px-4 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center">
            <img src={signalEmblem} alt="Home" className="w-8 h-8" />
          </Link>
          <div className="flex items-center gap-2 sm:gap-3">
            {isAuthenticated && user?.id && (
              <MemberBadge userId={user.id.toString()} />
            )}
            <Button
              size="sm"
              variant="ghost"
              onClick={openGlobalSearch}
              className="h-7 sm:h-8 w-7 sm:w-8 p-0 text-white/70 hover:text-white hover:bg-white/10"
              data-testid="button-global-search"
            >
              <Search className="w-4 h-4" />
            </Button>
            <Link href="/community">
              <Button
                size="sm"
                variant="ghost"
                className="h-7 sm:h-8 w-7 sm:w-8 p-0 text-white/70 hover:text-white hover:bg-white/10"
                data-testid="button-messenger"
              >
                <MessageCircle className="w-4 h-4" />
              </Button>
            </Link>
            <Link href="/executive-summary">
              <Button 
                size="sm" 
                className="h-7 sm:h-8 px-2 sm:px-3 text-[10px] sm:text-xs font-semibold bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-400 hover:to-purple-400 text-white border-0"
                data-testid="button-transmission"
              >
                <Zap className="w-3 h-3 sm:mr-1" />
                <span className="hidden sm:inline">Vision</span>
              </Button>
            </Link>
            <WalletButton />
            <MobileNav />
          </div>
        </div>
      </nav>

      <section className="relative min-h-[85vh] flex items-center justify-center pt-20 md:pt-14 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src={heroBg} alt="" className="w-full h-full object-cover opacity-30" />
          <div className="absolute inset-0 bg-gradient-to-b from-background/0 via-background/80 to-background" />
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
                stroke="url(#waveGradient)"
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
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-cyan-400 to-secondary">DarkWave Trust Layer</span>
            </h1>

            <p className="text-lg md:text-xl text-white/70 max-w-2xl mx-auto font-medium">
              Where trust becomes the layer of truth.
            </p>

            {/* Signal Emblem with Prism Light Beam Effect */}
            <div className="relative w-full mt-2 h-80 md:h-96 flex items-center justify-center">
              {/* Prism Light Beam - danger from upper-left, transformed into flowing DarkWave below */}
              <svg 
                viewBox="0 0 1200 500" 
                className="absolute inset-0 w-full h-full"
                preserveAspectRatio="xMidYMid meet"
              >
                <defs>
                  {/* Incoming beam gradient - threatening red/orange diagonal */}
                  <linearGradient id="dangerBeam" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#dc2626" stopOpacity="0" />
                    <stop offset="20%" stopColor="#dc2626" stopOpacity="0.8" />
                    <stop offset="50%" stopColor="#ef4444" stopOpacity="1" />
                    <stop offset="80%" stopColor="#f97316" stopOpacity="1" />
                    <stop offset="100%" stopColor="#fbbf24" stopOpacity="0.9" />
                  </linearGradient>
                  {/* Flowing wave gradients */}
                  <linearGradient id="waveGradientCyan" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#22d3ee" stopOpacity="1" />
                    <stop offset="50%" stopColor="#06b6d4" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="#0891b2" stopOpacity="0.5" />
                  </linearGradient>
                  <linearGradient id="waveGradientPurple" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#a855f7" stopOpacity="1" />
                    <stop offset="50%" stopColor="#8b5cf6" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="#7c3aed" stopOpacity="0.5" />
                  </linearGradient>
                  <linearGradient id="waveGradientPink" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#ec4899" stopOpacity="0.9" />
                    <stop offset="50%" stopColor="#d946ef" stopOpacity="0.7" />
                    <stop offset="100%" stopColor="#a855f7" stopOpacity="0.4" />
                  </linearGradient>
                  {/* Strong glow filter */}
                  <filter id="beamGlow" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur stdDeviation="4" result="blur"/>
                    <feMerge>
                      <feMergeNode in="blur"/>
                      <feMergeNode in="blur"/>
                      <feMergeNode in="SourceGraphic"/>
                    </feMerge>
                  </filter>
                  <filter id="sparkleGlow" x="-100%" y="-100%" width="300%" height="300%">
                    <feGaussianBlur stdDeviation="6" result="blur"/>
                    <feMerge>
                      <feMergeNode in="blur"/>
                      <feMergeNode in="blur"/>
                      <feMergeNode in="blur"/>
                      <feMergeNode in="SourceGraphic"/>
                    </feMerge>
                  </filter>
                </defs>
                
                {/* Digital matrix dots in background */}
                {[...Array(60)].map((_, i) => {
                  const x = 100 + (i % 12) * 90 + Math.random() * 30;
                  const y = 50 + Math.floor(i / 12) * 80 + Math.random() * 20;
                  return (
                    <rect
                      key={`dot-${i}`}
                      x={x}
                      y={y}
                      width="3"
                      height="3"
                      fill="#ffffff"
                      fillOpacity={0.1 + Math.random() * 0.15}
                      className="animate-pulse"
                      style={{ animationDelay: `${Math.random() * 2}s`, animationDuration: `${2 + Math.random() * 2}s` }}
                    />
                  );
                })}
                
                {/* Incoming danger beam from upper-left diagonal */}
                <path
                  d="M150,0 L520,170"
                  stroke="url(#dangerBeam)"
                  strokeWidth="8"
                  strokeLinecap="round"
                  filter="url(#beamGlow)"
                  className="animate-pulse"
                />
                {/* Secondary danger strands */}
                <path d="M160,0 L525,165" stroke="#ef4444" strokeWidth="3" strokeOpacity="0.7" filter="url(#beamGlow)" />
                <path d="M140,0 L515,175" stroke="#f97316" strokeWidth="2" strokeOpacity="0.6" filter="url(#beamGlow)" />
                
                {/* Impact sparkle where beam hits shield */}
                <circle cx="530" cy="175" r="20" fill="#fbbf24" fillOpacity="0.6" filter="url(#sparkleGlow)" className="animate-ping" style={{ animationDuration: '1.5s' }} />
                <circle cx="530" cy="175" r="10" fill="#ffffff" fillOpacity="0.9" filter="url(#beamGlow)" />
                <circle cx="530" cy="175" r="5" fill="#ffffff" fillOpacity="1" />
                
                {/* Flowing sine waves emanating from below shield - Layer 1 (cyan) */}
                {[...Array(8)].map((_, i) => {
                  const yOffset = 320 + i * 18;
                  const amplitude = 15 + i * 3;
                  const freq = 0.015 - i * 0.001;
                  const points = [];
                  for (let x = 200; x <= 1000; x += 5) {
                    const y = yOffset + Math.sin((x - 200) * freq + i * 0.5) * amplitude;
                    points.push(`${x},${y}`);
                  }
                  const opacity = 0.9 - i * 0.08;
                  return (
                    <polyline
                      key={`wave-cyan-${i}`}
                      points={points.join(' ')}
                      fill="none"
                      stroke="#22d3ee"
                      strokeWidth={2.5 - i * 0.2}
                      strokeOpacity={opacity}
                      filter="url(#beamGlow)"
                      className="animate-pulse"
                      style={{ animationDelay: `${i * 0.1}s` }}
                    />
                  );
                })}
                
                {/* Flowing sine waves - Layer 2 (purple/pink blend) */}
                {[...Array(6)].map((_, i) => {
                  const yOffset = 340 + i * 20;
                  const amplitude = 12 + i * 4;
                  const freq = 0.012 - i * 0.001;
                  const points = [];
                  for (let x = 250; x <= 950; x += 5) {
                    const y = yOffset + Math.sin((x - 250) * freq + i * 0.7 + 1) * amplitude;
                    points.push(`${x},${y}`);
                  }
                  const colors = ['#a855f7', '#c084fc', '#d946ef', '#ec4899', '#f472b6', '#fb7185'];
                  return (
                    <polyline
                      key={`wave-purple-${i}`}
                      points={points.join(' ')}
                      fill="none"
                      stroke={colors[i]}
                      strokeWidth={2 - i * 0.15}
                      strokeOpacity={0.8 - i * 0.1}
                      filter="url(#beamGlow)"
                      className="animate-pulse"
                      style={{ animationDelay: `${i * 0.15 + 0.5}s` }}
                    />
                  );
                })}
              </svg>
              
              {/* Shield - Platinum rim with cosmic black hole center */}
              <div className="relative z-10 w-72 h-80 md:w-80 md:h-96 flex items-center justify-center" style={{ marginTop: '-40px' }}>
                <img 
                  src={shieldImage} 
                  alt="DarkWave Shield" 
                  className="w-full h-full object-contain"
                  style={{ 
                    mixBlendMode: 'lighten',
                    filter: 'drop-shadow(0 0 35px rgba(6, 182, 212, 0.7)) drop-shadow(0 0 18px rgba(168, 85, 247, 0.5))'
                  }}
                />
              </div>
            </div>

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
              Trade, stake, and explore the DarkWave DeFi ecosystem. Built for speed, designed for you.
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
                      <div className="p-2.5 rounded-lg bg-black/40 backdrop-blur-sm border border-white/10 hover:border-orange-500/40 hover:bg-orange-500/20 transition-all text-center group/item" data-testid="link-launchpad">
                        <Rocket className="w-4 h-4 mx-auto mb-1 text-orange-400" />
                        <span className="text-[10px] text-gray-200 group-hover/item:text-white">Launchpad</span>
                      </div>
                    </Link>
                    <Link href="/webhooks">
                      <div className="p-2.5 rounded-lg bg-black/40 backdrop-blur-sm border border-white/10 hover:border-amber-500/40 hover:bg-amber-500/20 transition-all text-center group/item" data-testid="link-webhooks">
                        <Webhook className="w-4 h-4 mx-auto mb-1 text-amber-400" />
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
                Build on DarkWave
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
                      <div className="w-12 h-12 rounded-xl bg-orange-500/20 backdrop-blur-sm flex items-center justify-center shrink-0 border border-orange-500/30">
                        <Rocket className="w-6 h-6 text-orange-400" />
                      </div>
                      <div>
                        <Badge variant="outline" className="border-green-500/50 text-green-400 text-[10px] mb-1">Live</Badge>
                        <h3 className="text-lg font-bold text-white">Launchpad</h3>
                      </div>
                    </div>
                    <p className="text-xs text-white/60 mb-4">Launch your own tokens with fair distribution, vesting schedules, and community tools.</p>
                    <Button className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-black font-semibold" data-testid="button-open-launchpad">
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
            <Link href="/era-codex">
              <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500" data-testid="button-explore-eras">
                <Sparkles className="w-4 h-4 mr-2" />
                View Eras
              </Button>
            </Link>
            <Link href="/chronicles">
              <Button variant="outline" className="border-purple-500/50 text-purple-400 hover:bg-purple-500/10" data-testid="button-play-chronicles">
                Play Chronicles
              </Button>
            </Link>
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
                    <Badge variant="outline" className="text-[9px] border-amber-500/50 text-amber-400 px-1">Coming Soon</Badge>
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
                    <Badge variant="outline" className="text-[9px] border-amber-500/50 text-amber-400 px-1">In Dev</Badge>
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


      <Footer />

      <Dialog open={showPresalePopup} onOpenChange={(open) => {
        setShowPresalePopup(open);
        if (!open) sessionStorage.setItem("presale_popup_seen", "true");
      }}>
        <DialogContent className="bg-[#0a0f1c] border-2 border-cyan-500/50 text-white max-w-[400px] max-h-[90vh] overflow-y-auto shadow-[0_0_60px_rgba(0,200,255,0.3)] [&>button]:top-2 [&>button]:right-2">
          <div className="flex flex-col items-center pt-4">
            <DialogHeader className="text-center">
              <DialogTitle className="text-lg font-bold text-center">
                <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Signal Presale is LIVE
                </span>
              </DialogTitle>
              <DialogDescription className="text-gray-300 text-center pt-1 text-sm">
                Ground floor opportunity
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-3 py-2 w-full">
              <div className="flex items-center justify-center">
                <img src={signalEmblem} alt="Signal" className="w-48 h-48 animate-pulse" />
              </div>
              
              <div className="text-center space-y-1">
                <p className="text-xl font-bold text-white">$0.001 <span className="text-sm text-gray-400">per SIG</span></p>
                <p className="text-sm text-cyan-400 font-medium">Launch: $0.01 (10x)</p>
              </div>
              
              <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-lg p-2">
                <p className="text-sm text-green-400 text-center font-bold">
                  Up to 20% BONUS
                </p>
              </div>
            </div>

            {!isAuthenticated && !quickRegSuccess && (
              <form onSubmit={handleQuickRegister} className="w-full space-y-2 mt-2 border-t border-white/10 pt-3">
                <p className="text-xs text-gray-400 text-center mb-2">Register to get started</p>
                <input
                  type="text"
                  placeholder="First Name"
                  value={quickRegFirstName}
                  onChange={(e) => setQuickRegFirstName(e.target.value)}
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm placeholder:text-gray-500 focus:outline-none focus:border-cyan-500/50"
                  data-testid="input-quick-reg-firstname"
                />
                <input
                  type="email"
                  placeholder="Email Address"
                  value={quickRegEmail}
                  onChange={(e) => setQuickRegEmail(e.target.value)}
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm placeholder:text-gray-500 focus:outline-none focus:border-cyan-500/50"
                  data-testid="input-quick-reg-email"
                />
                {quickRegError && (
                  <p className="text-xs text-red-400 text-center">{quickRegError}</p>
                )}
                <Button 
                  type="submit"
                  disabled={quickRegLoading}
                  className="w-full py-2.5 text-sm font-bold bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 hover:opacity-90 shadow-lg shadow-purple-500/25"
                  data-testid="button-quick-register"
                >
                  {quickRegLoading ? (
                    <span className="animate-pulse">Registering...</span>
                  ) : (
                    <>
                      <Rocket className="w-4 h-4 mr-2" />
                      Register & View Presale
                    </>
                  )}
                </Button>
              </form>
            )}

            {(isAuthenticated || quickRegSuccess) && (
              <div className="w-full mt-2">
                {quickRegSuccess && (
                  <div className="flex items-center justify-center gap-2 text-green-400 text-sm mb-2">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Welcome aboard!</span>
                  </div>
                )}
                <Link href="/presale" className="block w-full">
                  <Button 
                    onClick={() => setShowPresalePopup(false)}
                    className="w-full py-2.5 text-sm font-bold bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 hover:opacity-90 shadow-lg shadow-purple-500/25"
                    data-testid="button-go-to-presale"
                  >
                    <Rocket className="w-4 h-4 mr-2" />
                    Get Signal Now
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

const gradientColors: Record<string, { from: string; to: string }> = {
  "from-gray-500 to-gray-700": { from: "#6b7280", to: "#374151" },
  "from-indigo-600 to-violet-800": { from: "#4f46e5", to: "#5b21b6" },
  "from-cyan-400 to-blue-500": { from: "#22d3ee", to: "#3b82f6" },
  "from-slate-600 to-zinc-800": { from: "#475569", to: "#27272a" },
  "from-emerald-600 to-teal-800": { from: "#059669", to: "#115e59" },
  "from-amber-600 to-yellow-800": { from: "#d97706", to: "#854d0e" },
  "from-cyan-600 to-blue-700": { from: "#0891b2", to: "#1d4ed8" },
  "from-cyan-500 to-blue-600": { from: "#06b6d4", to: "#2563eb" },
  "from-orange-500 to-red-600": { from: "#f97316", to: "#dc2626" },
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
