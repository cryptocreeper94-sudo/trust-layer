import { motion } from "framer-motion";
import { Search, LayoutGrid, Rocket, ShieldCheck, CheckCircle2, ExternalLink , Shield } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { BackButton } from "@/components/page-nav";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import blockchainImg from "@assets/generated_images/futuristic_blockchain_network_activity_monitor.jpg";
import dashboardImg from "@assets/generated_images/futuristic_dashboard_interface_for_managing_decentralized_applications.jpg";
import fantasyImg from "@assets/generated_images/fantasy_sci-fi_world_landscape.jpg";
import { usePageAnalytics } from "@/hooks/use-analytics";
import { GlassCard } from "@/components/glass-card";
import { useQuery } from "@tanstack/react-query";
import { fetchEcosystemApps } from "@/lib/api";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { InfoTooltip } from "@/components/info-tooltip";

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
  "driverconnect": "/ecosystem/driverconnect-new.jpg",
  "darkwavestudios": "/ecosystem/darkwave-studios-new.jpg",
  "lotopspro": "/ecosystem/lotopspro-new.jpg",
  "lotops-pro": "/ecosystem/lotopspro-new.jpg",
  "orby": "/ecosystem/orby-new.jpg",
  "garagebot": "/ecosystem/garagebot-prod-new.jpg",
  "garagebot-prod": "/ecosystem/garagebot-prod-new.jpg",
  "orbit-staffing": "/ecosystem/orbit-staffing-new.jpg",
  "brew-board": "/ecosystem/brew-board-new.jpg",
  "darkwave-pulse": "/ecosystem/darkwave-pulse-new.jpg",
  "nashpaintpros": "/ecosystem/nashpaintpros-new.jpg",
  "paintpros": "/ecosystem/paintpros-new.jpg",
  "strike-agent": "/ecosystem/strike-agent-new.jpg",
  "veda-solus": "/ecosystem/veda-solus-new.jpg",
  "vedasolus": "/ecosystem/veda-solus-new.jpg",
  "darkwave-studios": "/ecosystem/darkwave-studios-new.jpg",
  "tradeworks-ai": "/ecosystem/tradeworks-ai-new.jpg",
  "chronicles": "/ecosystem/chronicles-new.jpg",
  "the-arcade": "/ecosystem/the-arcade-new.jpg",
  "signal-chat": "/ecosystem/signal-chat-new.jpg",
  "driver-connect": "/ecosystem/driver-connect-new.jpg",
  "trust-home": "/ecosystem/trust-home-new.jpg",
  "trust-vault": "/ecosystem/trust-vault-new.jpg",
  "guardian-scanner": "/ecosystem/guardian-scanner-new.jpg",
  "guardian-screener": "/ecosystem/guardian-screener-new.jpg",
  "trustshield": "/ecosystem/trustshield-new.jpg",
  "the-void": "/ecosystem/the-void-new.jpg",
  "trust-layer": "/ecosystem/trust-layer-new.jpg",
  "tlid": "/ecosystem/tlid-new.jpg",
  "torque": "/ecosystem/torque-new.jpg",
  "darkwave-academy": "/ecosystem/darkwave-academy-new.jpg",
  "academy": "/ecosystem/darkwave-academy-new.jpg",
  "verdara": "/ecosystem/verdara-new.jpg",
  "arbora": "/ecosystem/arbora-new.jpg",
  "trust-book": "/ecosystem/trust-book-new.jpg",
  "trust-golf": "/ecosystem/trust-golf-new.png",
  "trustgolf": "/ecosystem/trust-golf-new.png",
  "veil": "/ecosystem/veil-new.jpg",
  "through-the-veil": "/ecosystem/veil-new.jpg",
  "happy-eats": "/ecosystem/happy-eats.jpg",
};

function getAppImage(appId: string): string {
  return ecosystemImages[appId] || "";
}

const gradientColors: Record<string, { from: string; to: string }> = {
  "from-gray-500 to-gray-700": { from: "#6b7280", to: "#374151" },
  "from-gray-800 to-black": { from: "#1f2937", to: "#000000" },
  "from-indigo-600 to-violet-800": { from: "#4f46e5", to: "#5b21b6" },
  "from-indigo-500 to-purple-600": { from: "#6366f1", to: "#9333ea" },
  "from-cyan-400 to-blue-500": { from: "#22d3ee", to: "#3b82f6" },
  "from-cyan-400 to-blue-600": { from: "#22d3ee", to: "#2563eb" },
  "from-cyan-500 to-blue-600": { from: "#06b6d4", to: "#2563eb" },
  "from-cyan-500 to-purple-500": { from: "#06b6d4", to: "#a855f7" },
  "from-slate-600 to-zinc-800": { from: "#475569", to: "#27272a" },
  "from-emerald-600 to-teal-800": { from: "#059669", to: "#115e59" },
  "from-emerald-500 to-teal-600": { from: "#10b981", to: "#0d9488" },
  "from-emerald-500 to-green-700": { from: "#10b981", to: "#15803d" },
  "from-amber-600 to-yellow-800": { from: "#d97706", to: "#854d0e" },
  "from-amber-500 to-orange-600": { from: "#f59e0b", to: "#ea580c" },
  "from-amber-700 to-orange-900": { from: "#b45309", to: "#7c2d12" },
  "from-cyan-600 to-blue-700": { from: "#0891b2", to: "#1d4ed8" },
  "from-orange-500 to-red-600": { from: "#f97316", to: "#dc2626" },
  "from-red-600 to-rose-700": { from: "#dc2626", to: "#be123c" },
  "from-red-500 to-rose-600": { from: "#ef4444", to: "#e11d48" },
  "from-blue-500 to-cyan-600": { from: "#3b82f6", to: "#0891b2" },
  "from-blue-500 to-indigo-600": { from: "#3b82f6", to: "#4f46e5" },
  "from-blue-600 to-indigo-700": { from: "#2563eb", to: "#4338ca" },
  "from-purple-500 to-pink-600": { from: "#a855f7", to: "#db2777" },
  "from-pink-500 to-rose-600": { from: "#ec4899", to: "#e11d48" },
  "from-violet-500 to-purple-600": { from: "#8b5cf6", to: "#9333ea" },
  "from-green-500 to-emerald-600": { from: "#22c55e", to: "#059669" },
  "from-teal-500 to-cyan-600": { from: "#14b8a6", to: "#0891b2" },
  "from-zinc-600 to-slate-700": { from: "#52525b", to: "#334155" },
};

function AppCard({ src, alt, gradient, name, category, verified, tags, url }: { 
  src: string; 
  alt: string; 
  gradient?: string; 
  name: string;
  category: string;
  verified?: boolean;
  tags?: string[];
  url?: string;
}) {
  const [failed, setFailed] = useState(false);
  const [loaded, setLoaded] = useState(false);
  
  const colors = gradientColors[gradient || "from-cyan-600 to-blue-700"] || { from: "#0891b2", to: "#1d4ed8" };
  
  return (
    <div 
      className="block group"
      data-testid={`app-card-${name.toLowerCase().replace(/\s+/g, '-')}`}
    >
      <GlassCard className="overflow-hidden hover:border-primary/30 transition-all duration-300">
        <div className="aspect-[3/4] overflow-hidden relative">
          {(!loaded || failed || !src) && (
            <div 
              className="absolute inset-0 flex items-center justify-center"
              style={{ background: `linear-gradient(to bottom right, ${colors.from}, ${colors.to})` }}
            >
              <span className="text-4xl font-bold text-white/80">{name.charAt(0)}</span>
            </div>
          )}
          {src && (
            <img 
              src={src} 
              alt={alt}
              className={`w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ${loaded && !failed ? 'opacity-100' : 'opacity-0'}`}
              onLoad={() => setLoaded(true)}
              onError={() => setFailed(true)}
            />
          )}
          {/* Fade to black gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
          
          {/* Content overlay at bottom */}
          <div className="absolute bottom-0 left-0 right-0 p-3">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-sm font-bold text-white truncate flex-1" style={{ textShadow: '0 2px 8px rgba(0,0,0,0.9)' }}>{name}</h3>
              {verified && <CheckCircle2 className="w-3.5 h-3.5 text-primary shrink-0" />}
            </div>
            <p className="text-[10px] text-white/60 mb-3">{category}</p>
            <ExploreButton url={url} appName={name} />
          </div>
        </div>
      </GlassCard>
    </div>
  );
}


const categories = ["All Apps", "Core", "Security", "DeFi", "Finance", "Gaming", "Enterprise", "AI", "Automotive", "Services", "Identity", "Education", "Analytics", "Community", "Health", "Entertainment", "Outdoor", "Transportation", "Development", "Hospitality"];

export default function Ecosystem() {
  usePageAnalytics();
  const [selectedCategory, setSelectedCategory] = useState("All Apps");
  const [searchQuery, setSearchQuery] = useState("");

  const { data: apps = [], isLoading } = useQuery({
    queryKey: ["ecosystem-apps"],
    queryFn: fetchEcosystemApps,
    staleTime: 30000,
  });

  const filteredApps = apps.filter(app => {
    const matchesSearch = app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All Apps" || 
      app.category.toLowerCase().includes(selectedCategory.toLowerCase()) ||
      (app.tags && app.tags.some(tag => tag.toLowerCase().includes(selectedCategory.toLowerCase())));
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden selection:bg-primary/20 selection:text-primary">
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-background/90 backdrop-blur-xl">
        <div className="container mx-auto px-4 h-14 flex items-center">
          <Link href="/" className="flex items-center gap-2 mr-auto">
            <Shield className="w-7 h-7 text-cyan-400" />
            <span className="font-display font-bold text-lg tracking-tight hidden sm:inline">Trust Layer</span>
          </Link>
          <div className="flex items-center gap-2 sm:gap-3">
            <Link href="/developers">
              <Button size="sm" className="h-8 text-[10px] sm:text-xs bg-primary text-background hover:bg-primary/90 font-semibold px-2 sm:px-3">
                <Rocket className="w-3 h-3 sm:mr-1.5" /> <span className="hidden sm:inline">Submit App</span>
              </Button>
            </Link>
            <BackButton />
          </div>
        </div>
      </nav>

      <section className="pt-20 pb-8 px-4">
        <div className="container mx-auto max-w-6xl text-center">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-display font-bold mb-3">
            The Trust Layer <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">App Store</span>
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground max-w-lg mx-auto mb-6">
            One wallet, one login, infinite possibilities.
          </p>
          
          <div className="max-w-lg mx-auto">
            <div className="relative overflow-hidden rounded-2xl">
              <img src={dashboardImg} alt="Dashboard interface" className="absolute inset-0 w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-black/60" />
              <div className="relative z-10 p-2 flex items-center gap-2">
                <Search className="w-4 h-4 text-muted-foreground shrink-0 ml-2" />
                <Input 
                  placeholder="Search apps, protocols, and services..." 
                  className="border-0 bg-transparent h-10 text-sm focus-visible:ring-0 focus-visible:ring-offset-0"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-6 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="w-full lg:w-56 space-y-4 lg:sticky lg:top-20 h-fit">
              <div>
                <h3 className="text-[10px] font-bold text-white/40 uppercase tracking-wider mb-3">Categories</h3>
                <div className="flex flex-wrap lg:flex-col gap-1.5">
                  {categories.map((cat) => (
                    <Button
                      key={cat}
                      variant={selectedCategory === cat ? "secondary" : "ghost"}
                      size="sm"
                      onClick={() => setSelectedCategory(cat)}
                      className={`h-7 text-[10px] sm:text-xs justify-start ${selectedCategory === cat ? 'bg-primary/20 text-primary' : 'text-white/60 hover:text-white'}`}
                    >
                      {cat}
                    </Button>
                  ))}
                </div>
              </div>
              
              <div className="relative overflow-hidden rounded-2xl hidden lg:block">
                <img src={blockchainImg} alt="Blockchain network" className="absolute inset-0 w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent" />
                <div className="relative z-10 p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <ShieldCheck className="w-4 h-4 text-primary" />
                    <span className="text-xs font-bold text-white">Verified Apps</span>
                    <InfoTooltip content="Verified apps have passed Trust Layer security audits and are safe to use with your wallet." label="Verified apps info" />
                  </div>
                  <p className="text-[10px] text-white/50 leading-relaxed">
                    Look for the <CheckCircle2 className="w-3 h-3 inline text-primary mx-0.5" /> badge. 
                    These apps passed security audits.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex-1">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base sm:text-lg font-display font-bold">
                  {selectedCategory === "All Apps" ? "All Applications" : selectedCategory}
                  <span className="text-white/40 text-sm ml-2">({filteredApps.length})</span>
                </h2>
                <div className="flex items-center gap-1.5 text-[10px] text-white/40">
                  <LayoutGrid className="w-3 h-3" /> Grid View
                </div>
              </div>

              {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
                  {[1,2,3,4,5,6].map(i => (
                    <GlassCard key={i}>
                      <div className="p-4 animate-pulse">
                        <div className="flex items-start gap-3 mb-3">
                          <div className="w-10 h-10 rounded-lg bg-white/10" />
                          <div className="flex-1">
                            <div className="h-4 bg-white/10 rounded w-24 mb-2" />
                            <div className="h-3 bg-white/10 rounded w-16" />
                          </div>
                        </div>
                        <div className="h-3 bg-white/10 rounded w-full mb-2" />
                        <div className="h-3 bg-white/10 rounded w-3/4" />
                      </div>
                    </GlassCard>
                  ))}
                </div>
              ) : filteredApps.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-white/40 text-sm">No apps found matching your criteria.</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                  {filteredApps.map((app, i) => (
                    <AppCard 
                      key={app.id || i}
                      src={getAppImage(app.id)} 
                      alt={app.name} 
                      gradient={app.gradient} 
                      name={app.name}
                      category={app.category}
                      verified={app.verified}
                      tags={app.tags}
                      url={app.url}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      
    </div>
  );
}
