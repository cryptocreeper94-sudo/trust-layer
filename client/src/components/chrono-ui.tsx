import { ReactNode, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "wouter";
import { 
  ArrowLeft, Sparkles, Menu, X, Play, Pause, Volume2, VolumeX,
  Users, Clock, Coins, Heart, ChevronRight, ExternalLink, Info
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import orbitLogo from "@assets/generated_images/futuristic_abstract_geometric_logo_symbol_for_orbit.png";

interface ChronoLayoutProps {
  children: ReactNode;
  currentPage?: string;
  showBackButton?: boolean;
  backLink?: string;
  backLabel?: string;
}

const NAV_LINKS = [
  { href: "/chronicles", label: "Overview" },
  { href: "/eras", label: "Eras" },
  { href: "/gameplay", label: "Gameplay" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/economy", label: "Economy" },
  { href: "/community", label: "Community" },
  { href: "/team", label: "Team" },
  { href: "/roadmap", label: "Roadmap" },
];

export function ChronoLayout({ 
  children, 
  currentPage,
  showBackButton = true,
  backLink = "/",
  backLabel = "Home"
}: ChronoLayoutProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden w-full max-w-full">
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-black/80 backdrop-blur-xl">
        <div className="container mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 shrink-0" data-testid="link-chrono-home">
            <img src={orbitLogo} alt="ChronoVerse" className="w-7 h-7" />
            <span className="font-display font-bold text-lg tracking-tight hidden sm:inline bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
              ChronoVerse
            </span>
          </Link>
          
          <div className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <Link key={link.href} href={link.href}>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className={`text-xs h-8 px-3 ${currentPage === link.href ? 'bg-white/10 text-white' : 'text-white/60 hover:text-white hover:bg-white/5'}`}
                  data-testid={`nav-${link.label.toLowerCase()}`}
                >
                  {link.label}
                </Button>
              </Link>
            ))}
          </div>
          
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="border-purple-500/50 text-purple-400 bg-purple-500/10 text-[10px] whitespace-nowrap animate-pulse hidden sm:flex">
              <Sparkles className="w-3 h-3 mr-1" /> Coming 2026
            </Badge>
            
            <Link href="/crowdfund">
              <Button size="sm" className="h-8 text-xs gap-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 hidden sm:flex" data-testid="nav-cta-support">
                <Heart className="w-3 h-3" />
                Support
              </Button>
            </Link>
            
            <button 
              onClick={() => setMobileMenuOpen(true)}
              className="md:hidden w-8 h-8 flex items-center justify-center text-white/70 hover:text-white"
              data-testid="button-mobile-menu"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>
      </nav>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl md:hidden"
          >
            <div className="p-4">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-2">
                  <img src={orbitLogo} alt="ChronoVerse" className="w-8 h-8" />
                  <span className="font-display font-bold text-xl bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                    ChronoVerse
                  </span>
                </div>
                <button 
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-10 h-10 flex items-center justify-center text-white/70 hover:text-white"
                  data-testid="button-close-mobile-menu"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <div className="space-y-2">
                {NAV_LINKS.map((link, i) => (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <Link href={link.href} onClick={() => setMobileMenuOpen(false)} data-testid={`mobile-nav-${link.label.toLowerCase()}`}>
                      <div className={`p-4 rounded-xl border transition-all ${
                        currentPage === link.href 
                          ? 'bg-purple-500/20 border-purple-500/30' 
                          : 'bg-white/5 border-white/10 hover:bg-white/10'
                      }`}>
                        <span className="text-lg font-medium">{link.label}</span>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mt-8 space-y-3"
              >
                <Link href="/crowdfund" onClick={() => setMobileMenuOpen(false)}>
                  <Button size="lg" className="w-full rounded-xl gap-2 bg-gradient-to-r from-purple-600 to-pink-600" data-testid="mobile-cta-support">
                    <Heart className="w-5 h-5" />
                    Support Development
                  </Button>
                </Link>
                
                <a 
                  href="https://dwsc.io" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="block"
                  data-testid="link-dwsc"
                >
                  <Button 
                    variant="outline" 
                    size="lg" 
                    className="w-full rounded-xl gap-2 border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10"
                  >
                    <Coins className="w-5 h-5" />
                    DarkWave Smart Chain
                    <ExternalLink className="w-4 h-4 ml-auto opacity-60" />
                  </Button>
                </a>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="pt-14">
        {children}
      </main>

      <ChronoFooter />
      <StickyJoinBar />
    </div>
  );
}

function ChronoFooter() {
  return (
    <footer className="bg-black border-t border-white/10 py-12 px-4 pb-28">
      <div className="container mx-auto max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <img src={orbitLogo} alt="ChronoVerse" className="w-8 h-8" />
              <span className="font-display font-bold text-xl bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                DarkWave Chronicles
              </span>
            </div>
            <p className="text-white/60 text-sm mb-4 max-w-md">
              Not a game. A life. Live your legacy across 70+ historical eras in the ChronoVerse. Coming 2026.
            </p>
            <div className="flex items-center gap-2 text-xs text-white/40">
              <span>Powered by</span>
              <a 
                href="https://dwsc.io" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 px-2 py-1 rounded bg-purple-500/20 border border-purple-500/30 text-purple-400 hover:text-purple-300 hover:bg-purple-500/30 transition-all"
                data-testid="link-dwsc-branding"
              >
                <Coins className="w-3 h-3" />
                DarkWave Smart Chain
                <ExternalLink className="w-2.5 h-2.5" />
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="font-display font-semibold text-white mb-4">Explore</h4>
            <ul className="space-y-2">
              <li><Link href="/chronicles" className="text-sm text-white/60 hover:text-white transition-colors" data-testid="footer-link-overview">Overview</Link></li>
              <li><Link href="/eras" className="text-sm text-white/60 hover:text-white transition-colors" data-testid="footer-link-eras">Era Explorer</Link></li>
              <li><Link href="/gameplay" className="text-sm text-white/60 hover:text-white transition-colors" data-testid="footer-link-gameplay">Gameplay</Link></li>
              <li><Link href="/economy" className="text-sm text-white/60 hover:text-white transition-colors" data-testid="footer-link-economy">Economy</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-display font-semibold text-white mb-4">Ecosystem</h4>
            <ul className="space-y-2">
              <li>
                <a href="https://dwsc.io" target="_blank" rel="noopener noreferrer" className="text-sm text-white/60 hover:text-cyan-400 transition-colors flex items-center gap-1" data-testid="footer-link-dwsc">
                  DarkWave Smart Chain <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a href="https://darkwavegames.io" target="_blank" rel="noopener noreferrer" className="text-sm text-white/60 hover:text-pink-400 transition-colors flex items-center gap-1" data-testid="footer-link-games">
                  DarkWave Games <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a href="https://darkwavestudios.io" target="_blank" rel="noopener noreferrer" className="text-sm text-white/60 hover:text-purple-400 transition-colors flex items-center gap-1" data-testid="footer-link-studios">
                  DarkWave Studios <ExternalLink className="w-3 h-3" />
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-white/40">
            &copy; {new Date().getFullYear()} DarkWave Studios LLC. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <Link href="/community" className="text-xs text-white/40 hover:text-white transition-colors" data-testid="footer-link-community">Community</Link>
            <Link href="/roadmap" className="text-xs text-white/40 hover:text-white transition-colors" data-testid="footer-link-roadmap">Roadmap</Link>
            <Link href="/crowdfund" className="text-xs text-white/40 hover:text-white transition-colors" data-testid="footer-link-crowdfund">Support</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

function StickyJoinBar() {
  const [dismissed, setDismissed] = useState(false);
  
  if (dismissed) return null;
  
  return (
    <motion.div
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      className="fixed bottom-0 left-0 right-0 z-40 bg-gradient-to-r from-purple-900/95 via-black/95 to-cyan-900/95 backdrop-blur-xl border-t border-white/10 p-3 sm:p-4"
    >
      <div className="container mx-auto max-w-6xl flex items-center justify-between gap-4">
        <div className="hidden sm:block">
          <p className="text-sm font-medium text-white">Join the ChronoVerse</p>
          <p className="text-xs text-white/60">Be among the first to live your legacy</p>
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Link href="/community" className="flex-1 sm:flex-none">
            <Button size="sm" className="w-full sm:w-auto gap-2 bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-400 hover:to-purple-400 text-sm" data-testid="sticky-join-waitlist">
              <Users className="w-4 h-4" />
              Join Waitlist
            </Button>
          </Link>
          <button 
            onClick={() => setDismissed(true)}
            className="w-8 h-8 flex items-center justify-center text-white/50 hover:text-white shrink-0"
            data-testid="sticky-dismiss"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}

interface HoloCardProps {
  children: ReactNode;
  className?: string;
  image?: string;
  onClick?: () => void;
  hover?: boolean;
  glow?: 'purple' | 'cyan' | 'amber' | 'pink' | 'none';
}

export function HoloCard({ 
  children, 
  className = "", 
  image, 
  onClick,
  hover = true,
  glow = 'purple'
}: HoloCardProps) {
  const glowColors = {
    purple: 'rgba(168,85,247,0.3)',
    cyan: 'rgba(6,182,212,0.3)',
    amber: 'rgba(245,158,11,0.3)',
    pink: 'rgba(236,72,153,0.3)',
    none: 'transparent'
  };
  
  return (
    <motion.div
      whileHover={hover ? { scale: 1.02, y: -4 } : undefined}
      onClick={onClick}
      className={`relative overflow-hidden rounded-2xl border border-white/10 group ${onClick ? 'cursor-pointer' : ''} ${className}`}
      style={{ boxShadow: `0 0 40px ${glowColors[glow]}` }}
    >
      {image && (
        <>
          <img 
            src={image} 
            alt=""
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-black/30" />
        </>
      )}
      
      <div className="absolute inset-0 opacity-0 group-hover:opacity-30 transition-opacity duration-500 pointer-events-none"
        style={{
          background: 'linear-gradient(135deg, transparent 30%, rgba(255,255,255,0.1) 50%, transparent 70%)',
          backgroundSize: '200% 200%',
          animation: 'shimmer 2s infinite linear',
        }}
      />
      
      <div className="absolute top-0 left-0 right-0 h-[2px] opacity-0 group-hover:opacity-100 transition-opacity"
        style={{ background: `linear-gradient(90deg, transparent, ${glowColors[glow].replace('0.3', '0.8')}, transparent)` }}
      />
      
      <div className="relative z-10">
        {children}
      </div>
    </motion.div>
  );
}

interface VideoHeroProps {
  videoSrc?: string;
  posterSrc: string;
  children: ReactNode;
  overlay?: 'dark' | 'gradient' | 'radial';
  height?: string;
}

export function VideoHero({ 
  videoSrc, 
  posterSrc, 
  children, 
  overlay = 'gradient',
  height = 'min-h-screen'
}: VideoHeroProps) {
  const [muted, setMuted] = useState(true);
  const [playing, setPlaying] = useState(true);
  
  const overlayStyles = {
    dark: 'bg-black/60',
    gradient: 'bg-gradient-to-b from-black/60 via-black/40 to-black',
    radial: 'bg-[radial-gradient(ellipse_at_center,_transparent_0%,_black_70%)]'
  };
  
  return (
    <section className={`relative ${height} flex items-center justify-center overflow-hidden`}>
      <div className="absolute inset-0">
        {videoSrc ? (
          <video 
            autoPlay 
            loop 
            muted={muted}
            playsInline
            className="w-full h-full object-cover"
            poster={posterSrc}
          >
            <source src={videoSrc} type="video/mp4" />
          </video>
        ) : (
          <img src={posterSrc} alt="" className="w-full h-full object-cover" />
        )}
        <div className={`absolute inset-0 ${overlayStyles[overlay]}`} />
        <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-black/50" />
      </div>
      
      <div className="absolute inset-0 opacity-40 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(168,85,247,0.4) 0%, transparent 50%), radial-gradient(circle at 80% 50%, rgba(6,182,212,0.4) 0%, transparent 50%)',
        }}
      />
      
      {videoSrc && (
        <div className="absolute bottom-8 right-8 z-20 flex gap-2">
          <button
            onClick={() => setMuted(!muted)}
            className="w-10 h-10 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center text-white/70 hover:text-white hover:bg-black/70 transition-all"
            data-testid="button-toggle-mute"
          >
            {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
        </div>
      )}
      
      <div className="relative z-10 container mx-auto px-4">
        {children}
      </div>
    </section>
  );
}

interface SocialProofTickerProps {
  items: { label: string; value: string; icon?: ReactNode }[];
}

export function SocialProofTicker({ items }: SocialProofTickerProps) {
  return (
    <div className="overflow-hidden bg-white/5 border-y border-white/10 py-4">
      <motion.div
        animate={{ x: [0, -1000] }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        className="flex gap-12 whitespace-nowrap"
      >
        {[...items, ...items, ...items].map((item, i) => (
          <div key={i} className="flex items-center gap-3">
            {item.icon}
            <span className="text-white/60 text-sm">{item.label}</span>
            <span className="text-white font-bold">{item.value}</span>
          </div>
        ))}
      </motion.div>
    </div>
  );
}

interface CTABannerProps {
  title: string;
  subtitle?: string;
  primaryAction: { label: string; href: string };
  secondaryAction?: { label: string; href: string };
  backgroundImage?: string;
}

export function CTABanner({ 
  title, 
  subtitle, 
  primaryAction, 
  secondaryAction,
  backgroundImage 
}: CTABannerProps) {
  return (
    <section className="py-16 px-4 relative overflow-hidden">
      {backgroundImage && (
        <>
          <img src={backgroundImage} alt="" className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/90 to-black/80" />
        </>
      )}
      <div className="container mx-auto max-w-4xl text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-5xl font-display font-bold mb-4 text-white">
            {title}
          </h2>
          {subtitle && (
            <p className="text-lg text-white/60 mb-8 max-w-2xl mx-auto">{subtitle}</p>
          )}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href={primaryAction.href}>
              <Button size="lg" className="rounded-full gap-2 text-lg px-8 py-6 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 hover:from-cyan-400 hover:via-purple-400 hover:to-pink-400 shadow-xl" data-testid="cta-primary">
                <Sparkles className="w-5 h-5" />
                {primaryAction.label}
              </Button>
            </Link>
            {secondaryAction && (
              <Link href={secondaryAction.href}>
                <Button size="lg" variant="outline" className="rounded-full gap-2 text-lg px-8 py-6 border-white/20 hover:bg-white/10" data-testid="cta-secondary">
                  {secondaryAction.label}
                  <ChevronRight className="w-5 h-5" />
                </Button>
              </Link>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

interface InfoTooltipInlineProps {
  term: string;
  definition: string;
  children: ReactNode;
}

export function InfoTooltipInline({ term, definition, children }: InfoTooltipInlineProps) {
  const [showTooltip, setShowTooltip] = useState(false);
  
  return (
    <span className="relative inline-flex items-center">
      <span 
        className="inline-flex items-center gap-1 cursor-help border-b border-dashed border-white/30 hover:border-purple-400 transition-colors"
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        onClick={() => setShowTooltip(!showTooltip)}
      >
        {children}
        <Info className="w-3 h-3 text-purple-400" />
      </span>
      <AnimatePresence>
        {showTooltip && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-3 bg-gray-900 border border-white/10 rounded-lg shadow-xl z-50"
          >
            <p className="text-xs font-bold text-purple-400 mb-1">{term}</p>
            <p className="text-xs text-white/70">{definition}</p>
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 rotate-45 w-2 h-2 bg-gray-900 border-r border-b border-white/10" />
          </motion.div>
        )}
      </AnimatePresence>
    </span>
  );
}

export const chronoStyles = `
  @keyframes shimmer {
    0% { background-position: -200% -200%; }
    100% { background-position: 200% 200%; }
  }
  .scrollbar-hide::-webkit-scrollbar { display: none; }
  .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
`;
