import { motion } from "framer-motion";
import { Link } from "wouter";
import { ArrowRight, Code, Globe, Layers, Shield, Zap, Cpu, Network, Database, Heart, Sparkles, Activity, Server, CheckCircle2, LogOut, User, Droplets, ArrowUpDown, ImageIcon, PieChart, History, Rocket, LineChart, Webhook, Palette, Trophy, Target, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import { InfoTooltip } from "@/components/info-tooltip";
import heroBg from "@assets/generated_images/abstract_blockchain_network_nodes_connecting_in_dark_space.png";
import darkwaveLogo from "@assets/generated_images/darkwave_token_transparent.png";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { OnboardingTour } from "@/components/onboarding-tour";
import { useQuery } from "@tanstack/react-query";
import { fetchEcosystemApps, fetchBlockchainStats } from "@/lib/api";
import { GlobalSearch } from "@/components/global-search";
import { NotificationsDropdown } from "@/components/notifications";
import { FavoriteButton } from "@/components/favorite-button";
import { SkeletonCard } from "@/components/ui/skeleton-card";
import { MobileNav } from "@/components/mobile-nav";
import { usePreferences } from "@/lib/store";
import { Footer } from "@/components/footer";
import { usePageAnalytics } from "@/hooks/use-analytics";
import { GlassCard } from "@/components/glass-card";
import { useFirebaseAuth } from "@/hooks/use-firebase-auth";
import { FirebaseLoginModal } from "@/components/firebase-login";
import { GamesComingSoonModal } from "@/components/games-coming-soon-modal";
import { useState, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { WalletButton } from "@/components/wallet-button";
import { HeaderTools } from "@/components/header-tools";
import stoneAgeImg from "@assets/generated_images/stone_age_village_scene.png";
import medievalImg from "@assets/generated_images/medieval_fantasy_kingdom.png";
import cyberpunkImg from "@assets/generated_images/cyberpunk_neon_city.png";
import spaceImg from "@assets/generated_images/deep_space_station.png";
import tradingImg from "@assets/generated_images/futuristic_blockchain_network_activity_monitor.png";
import nftImg from "@assets/generated_images/fantasy_character_heroes.png";
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
  "darkwave-chain": "/ecosystem/darkwave-chain.png",
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
  { img: medievalImg, era: "Age of Crowns", desc: "Medieval kingdoms", color: "from-purple-500/30 to-indigo-600/30" },
  { img: cyberpunkImg, era: "Neon Dominion", desc: "Cyberpunk future", color: "from-pink-500/30 to-cyan-600/30" },
  { img: spaceImg, era: "Stellar Exodus", desc: "Space exploration", color: "from-blue-500/30 to-purple-600/30" },
];

function ChroniclesCarousel() {
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
      const cardWidth = 240;
      const scrollAmount = direction === 'left' ? -cardWidth : cardWidth;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <div className="relative mb-8">
      <button
        onClick={() => scroll('left')}
        className={`absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-black/60 backdrop-blur-xl border border-white/20 flex items-center justify-center transition-all ${canScrollLeft ? 'opacity-100 hover:bg-white/10' : 'opacity-30 cursor-not-allowed'}`}
        disabled={!canScrollLeft}
        data-testid="button-carousel-left"
      >
        <ChevronLeft className="w-5 h-5 text-white" />
      </button>
      
      <button
        onClick={() => scroll('right')}
        className={`absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-black/60 backdrop-blur-xl border border-white/20 flex items-center justify-center transition-all ${canScrollRight ? 'opacity-100 hover:bg-white/10' : 'opacity-30 cursor-not-allowed'}`}
        disabled={!canScrollRight}
        data-testid="button-carousel-right"
      >
        <ChevronRight className="w-5 h-5 text-white" />
      </button>

      <div 
        ref={scrollRef}
        onScroll={checkScroll}
        className="flex gap-4 overflow-x-auto scrollbar-hide px-12 py-2 snap-x snap-mandatory"
      >
        {CHRONICLES_ERAS.map((item, i) => (
          <motion.div
            key={item.era}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            whileHover={{ scale: 1.02, y: -4 }}
            className="relative group shrink-0 w-[220px] h-[300px] rounded-2xl overflow-hidden snap-center border border-white/10 bg-black/40 backdrop-blur-xl"
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
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
              <p className="font-bold text-white text-lg">{item.era}</p>
              <p className="text-xs text-gray-300">{item.desc}</p>
            </div>
          </motion.div>
        ))}
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
        className="flex gap-4 overflow-x-auto scrollbar-hide py-2 snap-x snap-mandatory"
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
              className="shrink-0 w-[calc(50%-8px)] snap-start"
              data-testid={`card-ecosystem-${app.id}`}
            >
              <GlassCard className="h-full overflow-hidden hover:border-primary/30 transition-all duration-300">
                <div className="flex flex-col h-full">
                  <div className="aspect-[4/3] relative overflow-hidden bg-black">
                    {imageSrc ? (
                      <img 
                        src={imageSrc} 
                        alt={app.name}
                        className="w-full h-full object-contain"
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
                    <Badge variant="secondary" className="w-fit text-[10px] uppercase bg-primary/20 text-primary mb-2">
                      {app.category}
                    </Badge>
                    <p className="text-xs text-white/60 line-clamp-2 mb-4 flex-1">{app.description}</p>
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

export default function Home() {
  const { preferences } = usePreferences();
  const { user, loading: authLoading, isAuthenticated, displayName, signOut } = useFirebaseAuth();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showGamesModal, setShowGamesModal] = useState(false);
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
      <FirebaseLoginModal 
        isOpen={showLoginModal} 
        onClose={() => setShowLoginModal(false)} 
      />
      {showGamesModal && <GamesComingSoonModal onClose={() => setShowGamesModal(false)} />}
      
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-background/90 backdrop-blur-xl">
        <div className="w-full px-3 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center flex-shrink-0">
            <span className="font-display font-bold text-xl tracking-tight">DarkWave</span>
          </Link>
          <div className="hidden lg:flex items-center gap-4 text-xs font-medium text-muted-foreground mr-4">
            <button onClick={() => setShowGamesModal(true)} className="hover:text-primary transition-colors flex items-center gap-1 whitespace-nowrap bg-transparent border-none cursor-pointer text-muted-foreground text-xs font-medium">
              Games
              <Badge variant="outline" className="text-[9px] border-amber-500/50 text-amber-400 px-1 py-0">Soon</Badge>
            </button>
            <Link href="/ecosystem" className="hover:text-primary transition-colors whitespace-nowrap">Ecosystem</Link>
            <Link href="/token" className="hover:text-primary transition-colors whitespace-nowrap">Coin</Link>
            <Link href="/bridge" className="hover:text-primary transition-colors whitespace-nowrap flex items-center gap-1">
              Bridge
              <Badge variant="outline" className="text-[9px] border-cyan-500/50 text-cyan-400 px-1 py-0">Beta</Badge>
            </Link>
            <Link href="/staking" className="hover:text-primary transition-colors whitespace-nowrap">Staking</Link>
            <Link href="/explorer" className="hover:text-primary transition-colors whitespace-nowrap">Explorer</Link>
            <Link href="/developers" className="hover:text-primary transition-colors whitespace-nowrap">Developers</Link>
            <Link href="/crowdfund" className="hover:text-primary transition-colors flex items-center gap-1 whitespace-nowrap">
              Fund Us
              <Badge variant="outline" className="text-[9px] border-pink-500/50 text-pink-400 px-1 py-0">Support</Badge>
            </Link>
            <Link href="/swap" className="hover:text-primary transition-colors flex items-center gap-1 whitespace-nowrap">
              DeFi
              <Badge variant="outline" className="text-[9px] border-green-500/50 text-green-400 px-1 py-0">New</Badge>
            </Link>
          </div>
          <div className="flex items-center gap-2">
            <div className="hidden md:flex items-center gap-2">
              <GlobalSearch />
              <HeaderTools />
              <NotificationsDropdown />
            </div>
            {authLoading ? (
              <div className="hidden sm:flex h-8 w-16 bg-white/5 animate-pulse rounded" />
            ) : isAuthenticated ? (
              <div className="hidden sm:flex items-center gap-2">
                <Link href="/dashboard">
                  <Button variant="ghost" size="sm" className="h-8 text-xs hover:bg-white/5 gap-1.5" data-testid="button-dashboard">
                    <User className="w-3 h-3" />
                    {displayName}
                  </Button>
                </Link>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-8 text-xs hover:bg-white/5" 
                  onClick={() => signOut()}
                  data-testid="button-logout"
                >
                  <LogOut className="w-3 h-3" />
                </Button>
              </div>
            ) : (
              <Button 
                variant="ghost" 
                size="sm" 
                className="hidden sm:flex h-8 text-xs hover:bg-white/5" 
                onClick={() => setShowLoginModal(true)}
                data-testid="button-login"
              >
                Log In
              </Button>
            )}
            <WalletButton />
            <MobileNav />
          </div>
        </div>
      </nav>

      <section className="relative min-h-[85vh] flex items-center justify-center pt-20 md:pt-14 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src={heroBg} alt="" className="w-full h-full object-cover opacity-30" />
          <div className="absolute inset-0 bg-gradient-to-b from-background/0 via-background/80 to-background" />
        </div>

        <div className="container relative z-10 px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto space-y-6"
          >
            <Badge variant="outline" className="px-3 py-1 border-primary/50 text-primary bg-primary/10 rounded-full text-xs font-tech tracking-wider uppercase">
              The Next Generation Ecosystem
            </Badge>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-display font-bold leading-tight bg-clip-text text-transparent bg-gradient-to-b from-white to-white/50">
              Welcome to <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-cyan-400 to-secondary">DarkWave Smart Chain</span>
            </h1>

            <p className="text-base md:text-lg text-muted-foreground max-w-xl mx-auto">
              A universal ledger for the next web. Scalable, secure, and built for decentralized applications.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
              <Link href="/developers">
                <Button size="lg" className="h-12 px-6 bg-primary text-background hover:bg-primary/90 font-bold rounded-full shadow-[0_0_20px_rgba(0,255,255,0.3)]" data-testid="button-start-building">
                  Start Building <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
              <Link href="/explorer">
                <Button size="lg" variant="outline" className="h-12 px-6 border-primary/50 text-primary hover:bg-primary/10 rounded-full" data-testid="button-explore-chain">
                  DarkWaveScan
                </Button>
              </Link>
            </div>

            <div className="flex items-center justify-center gap-4 pt-4">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm">
                <svg viewBox="0 0 24 24" className="w-4 h-4 text-white/60" fill="currentColor">
                  <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
                </svg>
                <svg viewBox="0 0 24 24" className="w-4 h-4 text-white/60" fill="currentColor">
                  <path d="M3.609 1.814L13.792 12 3.61 22.186a.996.996 0 01-.61-.92V2.734a1 1 0 01.609-.92zm10.89 10.893l2.302 2.302-10.937 6.333 8.635-8.635zm3.199-3.198l2.807 1.626a1 1 0 010 1.73l-2.808 1.626L15.206 12l2.492-2.491zM5.864 2.658L16.8 8.99l-2.302 2.302-8.634-8.634z"/>
                </svg>
                <span className="text-xs text-white/60 font-medium">Coming Soon to App Stores</span>
              </div>
            </div>

            <div className="flex items-center justify-center pt-2 text-xs text-muted-foreground">
              <a href="https://darkwavechain.io" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">darkwavechain.io</a>
            </div>
          </motion.div>
        </div>
        
        <motion.div 
          className="absolute bottom-20 left-4 flex flex-col items-center cursor-pointer z-20"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
          data-testid="button-scroll-down-left"
        >
          <ChevronDown className="w-6 h-6 text-primary" />
        </motion.div>
        
        <motion.div 
          className="absolute bottom-20 right-4 flex flex-col items-center cursor-pointer z-20"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
          onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
          data-testid="button-scroll-down-right"
        >
          <ChevronDown className="w-6 h-6 text-primary" />
        </motion.div>
      </section>

      <section className="py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 auto-rows-[120px]">
            {statsLoading ? (
              <>
                <GlassCard><div className="p-4 animate-pulse bg-white/5 h-full rounded-xl" /></GlassCard>
                <GlassCard><div className="p-4 animate-pulse bg-white/5 h-full rounded-xl" /></GlassCard>
                <GlassCard><div className="p-4 animate-pulse bg-white/5 h-full rounded-xl" /></GlassCard>
                <GlassCard><div className="p-4 animate-pulse bg-white/5 h-full rounded-xl" /></GlassCard>
              </>
            ) : (
              <>
                <GlassCard hover={false}>
                  <div className="p-3 md:p-4 h-full flex flex-col justify-center overflow-hidden">
                    <div className="flex items-center gap-1 md:gap-2 mb-2 flex-wrap">
                      <Zap className="w-3 h-3 md:w-4 md:h-4 text-primary/60 shrink-0" />
                      <div className="flex items-center gap-1">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                        <span className="text-[8px] md:text-[9px] text-green-400/80 uppercase">Live</span>
                      </div>
                      <InfoTooltip content="Transactions Per Second - how many transactions the network can process each second. Higher is better!" label="TPS info" />
                    </div>
                    <div className="text-xl md:text-2xl font-bold text-white">{stats?.tps || "200K+"}</div>
                    <div className="text-[9px] md:text-[10px] text-white/50 uppercase tracking-wider">TPS</div>
                  </div>
                </GlassCard>
                <GlassCard hover={false}>
                  <div className="p-3 md:p-4 h-full flex flex-col justify-center overflow-hidden">
                    <div className="flex items-center gap-1 md:gap-2 mb-2 flex-wrap">
                      <Activity className="w-3 h-3 md:w-4 md:h-4 text-cyan-400/60 shrink-0" />
                      <div className="flex items-center gap-1">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                        <span className="text-[8px] md:text-[9px] text-green-400/80 uppercase">Live</span>
                      </div>
                      <InfoTooltip content="Time for a transaction to be permanently confirmed on the blockchain. 400ms means near-instant confirmations!" label="Finality time info" />
                    </div>
                    <div className="text-xl md:text-2xl font-bold text-white">{stats?.finalityTime || "0.4s"}</div>
                    <div className="text-[9px] md:text-[10px] text-white/50 uppercase tracking-wider">Finality</div>
                  </div>
                </GlassCard>
                <GlassCard hover={false}>
                  <div className="p-3 md:p-4 h-full flex flex-col justify-center overflow-hidden">
                    <div className="flex items-center gap-1 md:gap-2 mb-2">
                      <Cpu className="w-3 h-3 md:w-4 md:h-4 text-purple-400/60 shrink-0" />
                      <InfoTooltip content="Average cost per transaction. DarkWave Smart Chain keeps fees extremely low compared to other blockchains." label="Transaction cost info" />
                    </div>
                    <div className="text-xl md:text-2xl font-bold text-white">{stats?.avgCost || "$0.0001"}</div>
                    <div className="text-[9px] md:text-[10px] text-white/50 uppercase tracking-wider">Avg Cost</div>
                  </div>
                </GlassCard>
                <GlassCard hover={false}>
                  <div className="p-3 md:p-4 h-full flex flex-col justify-center overflow-hidden">
                    <div className="flex items-center gap-1 md:gap-2 mb-2 flex-wrap">
                      <Server className="w-3 h-3 md:w-4 md:h-4 text-green-400/60 shrink-0" />
                      <div className="flex items-center gap-1">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                        <span className="text-[8px] md:text-[9px] text-green-400/80 uppercase">MAINNET</span>
                      </div>
                      <InfoTooltip content="DarkWave Smart Chain runs on a Proof-of-Authority (PoA) consensus. The Founders Validator secures the network with enterprise-grade infrastructure." label="Validator info" />
                    </div>
                    <div className="text-base md:text-2xl font-bold text-white leading-tight">
                      <span className="hidden md:inline">{stats?.activeNodes?.includes("Founder") ? stats.activeNodes : "Founders Validator"}</span>
                      <span className="md:hidden">Founders</span>
                    </div>
                    <div className="text-[10px] text-white/50 uppercase tracking-wider">Network</div>
                  </div>
                </GlassCard>
              </>
            )}
          </div>
        </div>
      </section>

      {/* DarkWave Chronicles - Coming Soon */}
      <section className="py-16 px-4 relative overflow-hidden bg-gradient-to-b from-purple-950/20 via-black to-black">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-900/20 via-transparent to-transparent" />
        <div className="container mx-auto max-w-6xl relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-8"
          >
            <Badge variant="outline" className="border-purple-500/50 text-purple-400 text-[10px] mb-3">
              <Sparkles className="w-3 h-3 mr-1" />
              Coming 2026
            </Badge>
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-3">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400">
                DarkWave Chronicles
              </span>
            </h2>
            <p className="text-sm text-muted-foreground max-w-2xl mx-auto">
              An unprecedented adventure platform where YOU are the hero. Emotions drive behavior, consequences ripple through time, and every perspective matters.
            </p>
          </motion.div>

          <ChroniclesCarousel />

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link href="/era-codex">
              <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500" data-testid="button-explore-eras">
                <Sparkles className="w-4 h-4 mr-2" />
                Explore All Eras
              </Button>
            </Link>
            <Link href="/creator-program">
              <Button variant="outline" className="border-purple-500/50 text-purple-400 hover:bg-purple-500/10" data-testid="button-genesis-page">
                Learn About Genesis
              </Button>
            </Link>
          </div>
        </div>
      </section>

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

            {/* Earn & Track Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              <div className="relative h-full overflow-hidden rounded-2xl border border-white/10 hover:border-amber-500/50 transition-all duration-300 group" style={{ boxShadow: '0 0 40px rgba(245,158,11,0.15)' }}>
                <img src={earnImg} alt="" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/60 to-amber-900/40" />
                <div className="relative z-10 p-5">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500/40 to-orange-500/40 backdrop-blur-sm flex items-center justify-center group-hover:shadow-[0_0_30px_rgba(245,158,11,0.4)] transition-shadow">
                      <Trophy className="w-6 h-6 text-amber-300" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-white text-shadow">Earn & Track</h3>
                      <p className="text-[11px] text-white/70">XP, quests & network</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <Link href="/quests">
                      <div className="p-2.5 rounded-lg bg-black/40 backdrop-blur-sm border border-white/10 hover:border-amber-500/40 hover:bg-amber-500/20 transition-all text-center group/item" data-testid="link-quests">
                        <Target className="w-4 h-4 mx-auto mb-1 text-amber-400" />
                        <span className="text-[10px] text-gray-200 group-hover/item:text-white">Quests</span>
                      </div>
                    </Link>
                    <Link href="/network">
                      <div className="p-2.5 rounded-lg bg-black/40 backdrop-blur-sm border border-white/10 hover:border-green-500/40 hover:bg-green-500/20 transition-all text-center group/item" data-testid="link-network">
                        <Activity className="w-4 h-4 mx-auto mb-1 text-green-400" />
                        <span className="text-[10px] text-gray-200 group-hover/item:text-white">Network</span>
                      </div>
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-6">
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="outline" className="border-amber-500/50 text-amber-400 text-[10px]">Roadmap</Badge>
              </div>
              <h2 className="text-3xl md:text-4xl font-display font-bold">
                Chain Abstraction <br/>
                <span className="text-primary">Native Interop.</span>
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                We're building toward <strong>Omnichain Interoperability</strong>.
                Our vision is to abstract the chain entirely - no bridges, just seamless transfers.
              </p>
              
              <div className="grid grid-cols-1 gap-3">
                <GlassCard>
                  <div className="p-4 flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-primary/20 text-primary shrink-0">
                      <Zap className="w-4 h-4" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-sm font-bold text-white">Instant Consensus</h3>
                        <InfoTooltip content="DAG (Directed Acyclic Graph) allows multiple blocks to be processed in parallel, achieving much faster confirmation times." label="Instant consensus info" />
                      </div>
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
                        <Badge variant="outline" className="text-[9px] border-amber-500/50 text-amber-400 px-1">Q2 2026</Badge>
                      </div>
                      <p className="text-xs text-white/50">Manage assets across Ethereum, Solana, and more from one account</p>
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
                        <h3 className="text-sm font-bold text-white">Cross-Chain Messaging</h3>
                        <Badge variant="outline" className="text-[9px] border-amber-500/50 text-amber-400 px-1">In Development</Badge>
                      </div>
                      <p className="text-xs text-white/50">Native protocols for secure asset transfers between networks</p>
                    </div>
                  </div>
                </GlassCard>
              </div>
            </div>
            
            <GlassCard glow className="h-full">
              <div className="p-5 h-full flex flex-col">
                <div className="flex items-center gap-2 mb-4">
                  <Database className="w-4 h-4 text-primary" />
                  <span className="text-xs font-tech text-primary uppercase tracking-wider">Node Status: Online</span>
                </div>
                <div className="flex-1 bg-black/40 rounded-lg p-4 font-mono text-[11px] text-green-400/80 space-y-2 mb-4">
                  <p>{`> Connecting to DarkWave Mainnet...`}</p>
                  <p>{`> Synchronizing ledger state... OK`}</p>
                  <p>{`> Verifying Proof of History... OK`}</p>
                  <p>{`> Established connection to 152 peers.`}</p>
                  <p className="animate-pulse">{`> Awaiting transaction block...`}</p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-lg bg-white/5">
                    <div className="text-[10px] text-white/40 uppercase mb-1">Current Block</div>
                    <div className="text-lg font-bold text-white">{stats?.currentBlock || "#8,921,042"}</div>
                  </div>
                  <div className="p-3 rounded-lg bg-white/5">
                    <div className="text-[10px] text-white/40 uppercase mb-1">Network Hash</div>
                    <div className="text-lg font-bold text-white">{stats?.networkHash || "42.8 EH/s"}</div>
                  </div>
                </div>
              </div>
            </GlassCard>
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
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
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

      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-3">DarkWave Ecosystem</h2>
            <p className="text-sm text-muted-foreground max-w-lg mx-auto">
              A thriving ecosystem of decentralized applications. Everything lives on the same universal ledger.
            </p>
          </div>

          {appsLoading ? (
            <div className="grid grid-cols-2 gap-4">
              <SkeletonCard />
              <SkeletonCard />
            </div>
          ) : (
            <EcosystemCarousel apps={apps} />
          )}
          
          <div className="mt-6 flex justify-center">
            <Link href="/developers">
              <Button variant="outline" className="border-primary/30 hover:bg-primary/10 gap-2">
                <Code className="w-4 h-4" />
                Submit Your App
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <Link href="/studio">
            <GlassCard glow hover={false} className="w-full">
              <div className="p-6 md:p-8 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-secondary/5" />
                <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center shrink-0">
                      <Sparkles className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <Badge variant="outline" className="border-green-500/50 text-green-400 text-[10px] mb-1">Now Live</Badge>
                      <h3 className="text-xl md:text-2xl font-display font-bold text-white">DarkWave Dev Studio</h3>
                      <p className="text-xs text-muted-foreground mt-0.5">Cloud IDE for blockchain development with Monaco editor</p>
                    </div>
                  </div>
                  <Button className="bg-primary text-background hover:bg-primary/90 font-semibold px-6 shrink-0" data-testid="button-open-dev-studio">
                    Open Studio <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </div>
            </GlassCard>
          </Link>
        </div>
      </section>

      <section className="py-16 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl md:text-5xl font-display font-bold mb-4">Ready to Launch?</h2>
          <p className="text-sm text-muted-foreground max-w-lg mx-auto mb-8">
            Join thousands of developers building the future of finance, gaming, and social on DarkWave Smart Chain.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link href="/developers">
              <Button size="lg" className="h-12 px-8 bg-primary text-background hover:bg-primary/90 font-bold rounded-full" data-testid="button-start-building-now">
                Start Building Now
              </Button>
            </Link>
            <Link href="/doc-hub">
              <Button size="lg" variant="ghost" className="h-12 px-8 hover:bg-white/5 rounded-full" data-testid="button-explore-docs">
                Explore Docs
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
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
