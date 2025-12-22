import { motion } from "framer-motion";
import { ArrowLeft, Search, LayoutGrid, Rocket, ShieldCheck, CheckCircle2, ExternalLink } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import orbitLogo from "@assets/generated_images/futuristic_abstract_geometric_logo_symbol_for_orbit.png";
import { Footer } from "@/components/footer";
import { usePageAnalytics } from "@/hooks/use-analytics";
import { GlassCard } from "@/components/glass-card";
import { useQuery } from "@tanstack/react-query";
import { fetchEcosystemApps } from "@/lib/api";
import { useState } from "react";
import { InfoTooltip } from "@/components/info-tooltip";

import orbitStaffingImg from "@assets/ecosystem/orbit-staffing.jpg";
import lotopsproImg from "@assets/ecosystem/lotopspro.jpg";
import brewBoardImg from "@assets/ecosystem/brew-board.jpg";
import orbitChainImg from "@assets/ecosystem/orbit-chain.jpg";
import garagebotImg from "@assets/ecosystem/garagebot-prod.jpg";
import darkwavePulseImg from "@assets/ecosystem/darkwave-pulse.jpg";
import paintprosImg from "@assets/ecosystem/paintpros.jpg";
import orbyImg from "@assets/ecosystem/orby.jpg";
import strikeAgentImg from "@assets/ecosystem/strike-agent.jpg";

const appImageMap: Record<string, string> = {
  "orbit-staffing": orbitStaffingImg,
  "lotopspro": lotopsproImg,
  "lotops-pro": lotopsproImg,
  "brew-board": brewBoardImg,
  "orbit-chain": orbitChainImg,
  "garagebot": garagebotImg,
  "garagebot-prod": garagebotImg,
  "darkwave-pulse": darkwavePulseImg,
  "paintpros": paintprosImg,
  "orby": orbyImg,
  "strike-agent": strikeAgentImg,
};

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
            <GlassCard hover={false}>
              <div className="p-2 flex items-center gap-2">
                <Search className="w-4 h-4 text-muted-foreground shrink-0 ml-2" />
                <Input 
                  placeholder="Search apps, protocols, and services..." 
                  className="border-0 bg-transparent h-10 text-sm focus-visible:ring-0 focus-visible:ring-offset-0"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </GlassCard>
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
              
              <GlassCard hover={false} className="hidden lg:block">
                <div className="p-4">
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
              </GlassCard>
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
                    const appImage = appImageMap[app.id];
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
                          {appImage ? (
                            <div className="aspect-[3/4] overflow-hidden">
                              <img 
                                src={appImage} 
                                alt={app.name}
                                className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                              />
                            </div>
                          ) : (
                            <div className={`aspect-[3/4] bg-gradient-to-br ${app.gradient || 'from-cyan-600 to-blue-700'} flex items-center justify-center`}>
                              <span className="text-4xl font-bold text-white/80">{app.name.charAt(0)}</span>
                            </div>
                          )}
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
