import { motion } from "framer-motion";
import { ArrowLeft, Search, LayoutGrid, Rocket, ShieldCheck, CheckCircle2, ExternalLink } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import orbitLogo from "@assets/generated_images/futuristic_abstract_geometric_logo_symbol_for_orbit.png";
import blockchainImg from "@assets/generated_images/futuristic_blockchain_network_activity_monitor.png";
import dashboardImg from "@assets/generated_images/futuristic_dashboard_interface_for_managing_decentralized_applications.png";
import fantasyImg from "@assets/generated_images/fantasy_sci-fi_world_landscape.png";
import { Footer } from "@/components/footer";
import { usePageAnalytics } from "@/hooks/use-analytics";
import { GlassCard } from "@/components/glass-card";
import { useQuery } from "@tanstack/react-query";
import { fetchEcosystemApps } from "@/lib/api";
import { useState } from "react";
import { InfoTooltip } from "@/components/info-tooltip";

const ecosystemImages: Record<string, string> = {
  "orbit-staffing": "/ecosystem/orbit-staffing.jpg",
  "lotopspro": "/ecosystem/lotopspro.jpg",
  "lotops-pro": "/ecosystem/lotopspro.jpg",
  "brew-board": "/ecosystem/brew-board.jpg",
  "orbit-chain": "/ecosystem/orbit-chain.jpg",
  "garagebot": "/ecosystem/garagebot-prod.jpg",
  "garagebot-prod": "/ecosystem/garagebot-prod.jpg",
  "darkwave-pulse": "/ecosystem/darkwave-pulse.jpg",
  "paintpros": "/ecosystem/paintpros.jpg",
  "orby": "/ecosystem/orby.jpg",
  "strike-agent": "/ecosystem/strike-agent.jpg",
};

function getAppImage(appId: string): string {
  return ecosystemImages[appId] || "";
}

const gradientColors: Record<string, { from: string; to: string }> = {
  "from-gray-500 to-gray-700": { from: "#6b7280", to: "#374151" },
  "from-indigo-600 to-violet-800": { from: "#4f46e5", to: "#5b21b6" },
  "from-cyan-400 to-blue-500": { from: "#22d3ee", to: "#3b82f6" },
  "from-slate-600 to-zinc-800": { from: "#475569", to: "#27272a" },
  "from-emerald-600 to-teal-800": { from: "#059669", to: "#115e59" },
  "from-amber-600 to-yellow-800": { from: "#d97706", to: "#854d0e" },
  "from-cyan-600 to-blue-700": { from: "#0891b2", to: "#1d4ed8" },
  "from-orange-500 to-red-600": { from: "#f97316", to: "#dc2626" },
  "from-red-600 to-rose-700": { from: "#dc2626", to: "#be123c" },
};

function AppImage({ src, alt, gradient, name }: { src: string; alt: string; gradient?: string; name: string }) {
  const [failed, setFailed] = useState(false);
  const [loaded, setLoaded] = useState(false);
  
  const colors = gradientColors[gradient || "from-cyan-600 to-blue-700"] || { from: "#0891b2", to: "#1d4ed8" };
  
  if (!src) {
    return (
      <div 
        className="aspect-[3/4] flex items-center justify-center"
        style={{ background: `linear-gradient(to bottom right, ${colors.from}, ${colors.to})` }}
      >
        <span className="text-4xl font-bold text-white/80">{name.charAt(0)}</span>
      </div>
    );
  }
  
  return (
    <div className="aspect-[3/4] overflow-hidden relative">
      {(!loaded || failed) && (
        <div 
          className="absolute inset-0 flex items-center justify-center"
          style={{ background: `linear-gradient(to bottom right, ${colors.from}, ${colors.to})` }}
        >
          <span className="text-4xl font-bold text-white/80">{name.charAt(0)}</span>
        </div>
      )}
      <img 
        src={src} 
        alt={alt}
        className={`w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500 ${loaded && !failed ? 'opacity-100' : 'opacity-0'}`}
        onLoad={() => setLoaded(true)}
        onError={() => setFailed(true)}
      />
    </div>
  );
}


const categories = ["All Apps", "DeFi", "Enterprise", "AI", "Social", "Gaming", "Automotive", "Services"];

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
            <img src={orbitLogo} alt="DarkWave" className="w-7 h-7" />
            <span className="font-display font-bold text-lg tracking-tight hidden sm:inline">DarkWave</span>
          </Link>
          <div className="flex items-center gap-2 sm:gap-3">
            <Button size="sm" className="h-8 text-[10px] sm:text-xs bg-primary text-background hover:bg-primary/90 font-semibold px-2 sm:px-3">
              <Rocket className="w-3 h-3 sm:mr-1.5" /> <span className="hidden sm:inline">Submit App</span>
            </Button>
            <Link href="/">
              <Button variant="ghost" size="sm" className="h-8 text-xs gap-1.5 hover:bg-white/5 px-2 sm:px-3">
                <ArrowLeft className="w-3 h-3" />
                <span className="hidden sm:inline">Back</span>
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      <section className="pt-20 pb-8 px-4">
        <div className="container mx-auto max-w-6xl text-center">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-display font-bold mb-3">
            The DarkWave <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">App Store</span>
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
                <div className="flex flex-wrap gap-2">
                  {categories.map((cat) => (
                    <Button
                      key={cat}
                      variant={selectedCategory === cat ? "secondary" : "ghost"}
                      size="sm"
                      onClick={() => setSelectedCategory(cat)}
                      className={`h-8 text-[10px] sm:text-xs ${selectedCategory === cat ? 'bg-primary/20 text-primary' : 'text-white/60 hover:text-white'}`}
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
                    <InfoTooltip content="Verified apps have passed DarkWave security audits and are safe to use with your wallet." label="Verified apps info" />
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
                  {filteredApps.map((app, i) => {
                    const appImage = getAppImage(app.id);
                    return (
                      <a 
                        key={app.id || i} 
                        href={app.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="block group"
                        data-testid={`app-card-${app.id}`}
                      >
                        <GlassCard className="overflow-hidden hover:border-primary/30 transition-all duration-300">
                          <AppImage 
                            src={appImage || ""} 
                            alt={app.name} 
                            gradient={app.gradient} 
                            name={app.name} 
                          />
                          <div className="p-3 bg-black/60 backdrop-blur-sm">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="text-sm font-bold text-white truncate flex-1">{app.name}</h3>
                              {app.verified && <CheckCircle2 className="w-3.5 h-3.5 text-primary shrink-0" />}
                            </div>
                            <p className="text-[10px] text-white/50 mb-2">{app.category}</p>
                            <div className="flex items-center justify-between">
                              <div className="flex flex-wrap gap-1">
                                {(app.tags || []).slice(0, 1).map((tag, j) => (
                                  <Badge key={j} variant="outline" className="text-[8px] px-1.5 py-0 border-white/10 text-white/40">
                                    {tag}
                                  </Badge>
                                ))}
                              </div>
                              <Button variant="ghost" size="sm" className="h-5 px-2 text-[9px] text-primary group-hover:bg-primary/10 transition-colors">
                                Launch <ExternalLink className="w-2 h-2 ml-1" />
                              </Button>
                            </div>
                          </div>
                        </GlassCard>
                      </a>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
