import { motion } from "framer-motion";
import { Link } from "wouter";
import { ArrowRight, Code, Globe, Layers, Shield, Zap, Cpu, Network, Database, Heart, Sparkles, Activity, Server, CheckCircle2 } from "lucide-react";
import heroBg from "@assets/generated_images/abstract_blockchain_network_nodes_connecting_in_dark_space.png";
import orbitLogo from "@assets/generated_images/futuristic_abstract_geometric_logo_symbol_for_orbit.png";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { OnboardingTour } from "@/components/onboarding-tour";
import { useQuery } from "@tanstack/react-query";
import { fetchEcosystemApps, fetchBlockchainStats } from "@/lib/api";
import { GlobalSearch } from "@/components/global-search";
import { ThemeToggle } from "@/components/theme-toggle";
import { NotificationsDropdown } from "@/components/notifications";
import { FavoriteButton } from "@/components/favorite-button";
import { SkeletonCard } from "@/components/ui/skeleton-card";
import { MobileNav } from "@/components/mobile-nav";
import { usePreferences } from "@/lib/store";
import { Footer } from "@/components/footer";
import { usePageAnalytics } from "@/hooks/use-analytics";
import { GlassCard } from "@/components/glass-card";

export default function Home() {
  const { preferences } = usePreferences();
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
      
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-background/90 backdrop-blur-xl">
        <div className="container mx-auto px-4 h-14 flex items-center">
          <Link href="/" className="flex items-center gap-2 mr-auto">
            <img src={orbitLogo} alt="DarkWave" className="w-7 h-7" />
            <span className="font-display font-bold text-lg tracking-tight">DarkWave</span>
          </Link>
          <div className="hidden md:flex items-center gap-6 text-xs font-medium text-muted-foreground mr-6">
            <Link href="/ecosystem" className="hover:text-primary transition-colors">Ecosystem</Link>
            <Link href="/token" className="hover:text-primary transition-colors">Token</Link>
            <Link href="/explorer" className="hover:text-primary transition-colors">Explorer</Link>
            <Link href="/developers" className="hover:text-primary transition-colors">Developers</Link>
            <Link href="/dev-studio" className="hover:text-primary transition-colors flex items-center gap-1">
              Dev Studio
              <Badge variant="outline" className="text-[9px] border-primary/50 text-primary px-1 py-0">Soon</Badge>
            </Link>
          </div>
          <div className="flex items-center gap-2">
            <div className="hidden md:flex items-center gap-2">
              <GlobalSearch />
              <ThemeToggle />
              <NotificationsDropdown />
            </div>
            <Button variant="ghost" size="sm" className="hidden sm:flex h-8 text-xs hover:bg-white/5" data-testid="button-login">Log In</Button>
            <Link href="/ecosystem">
              <Button size="sm" className="hidden sm:flex h-8 text-xs bg-primary text-background hover:bg-primary/90 font-semibold" data-testid="button-launch-app">
                Launch App
              </Button>
            </Link>
            <MobileNav />
          </div>
        </div>
      </nav>

      <section className="relative min-h-[85vh] flex items-center justify-center pt-14 overflow-hidden">
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
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-cyan-400 to-secondary">DarkWave Chain</span>
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

            <div className="flex items-center justify-center pt-2 text-xs text-muted-foreground">
              <a href="https://darkwavechain.io" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">darkwavechain.io</a>
            </div>
          </motion.div>
        </div>
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
                  <div className="p-4 h-full flex flex-col justify-center">
                    <div className="flex items-center gap-2 mb-2">
                      <Zap className="w-4 h-4 text-primary/60" />
                      <div className="flex items-center gap-1">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                        <span className="text-[9px] text-green-400/80 uppercase">Live</span>
                      </div>
                    </div>
                    <div className="text-2xl font-bold text-white">{stats?.tps || "200K+"}</div>
                    <div className="text-[10px] text-white/50 uppercase tracking-wider">TPS Throughput</div>
                  </div>
                </GlassCard>
                <GlassCard hover={false}>
                  <div className="p-4 h-full flex flex-col justify-center">
                    <div className="flex items-center gap-2 mb-2">
                      <Activity className="w-4 h-4 text-cyan-400/60" />
                      <div className="flex items-center gap-1">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                        <span className="text-[9px] text-green-400/80 uppercase">Live</span>
                      </div>
                    </div>
                    <div className="text-2xl font-bold text-white">{stats?.finalityTime || "0.4s"}</div>
                    <div className="text-[10px] text-white/50 uppercase tracking-wider">Finality Time</div>
                  </div>
                </GlassCard>
                <GlassCard hover={false}>
                  <div className="p-4 h-full flex flex-col justify-center">
                    <Cpu className="w-4 h-4 text-purple-400/60 mb-2" />
                    <div className="text-2xl font-bold text-white">{stats?.avgCost || "$0.0001"}</div>
                    <div className="text-[10px] text-white/50 uppercase tracking-wider">Avg Cost</div>
                  </div>
                </GlassCard>
                <GlassCard hover={false}>
                  <div className="p-4 h-full flex flex-col justify-center">
                    <div className="flex items-center gap-2 mb-2">
                      <Server className="w-4 h-4 text-green-400/60" />
                      <div className="flex items-center gap-1">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                        <span className="text-[9px] text-green-400/80 uppercase">Live</span>
                      </div>
                    </div>
                    <div className="text-2xl font-bold text-white">{stats?.activeNodes || "150+"}</div>
                    <div className="text-[10px] text-white/50 uppercase tracking-wider">Active Nodes</div>
                  </div>
                </GlassCard>
              </>
            )}
          </div>
        </div>
      </section>

      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-6">
              <h2 className="text-3xl md:text-4xl font-display font-bold">
                Chain Abstraction <br/>
                <span className="text-primary">Native Interop.</span>
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                We're building the holy grail of blockchain: <strong>Omnichain Interoperability</strong>.
                DarkWave Chain doesn't just "bridge" assets; it abstracts the chain entirely.
              </p>
              
              <div className="grid grid-cols-1 gap-3">
                <GlassCard>
                  <div className="p-4 flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-primary/20 text-primary shrink-0">
                      <Zap className="w-4 h-4" />
                    </div>
                    <div>
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
                    <div>
                      <h3 className="text-sm font-bold text-white mb-1">Chain Abstraction</h3>
                      <p className="text-xs text-white/50">Control assets on any chain from your DarkWave account</p>
                    </div>
                  </div>
                </GlassCard>
                <GlassCard>
                  <div className="p-4 flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-purple-500/20 text-purple-400 shrink-0">
                      <Layers className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-white mb-1">Bridge-Free</h3>
                      <p className="text-xs text-white/50">Native messaging protocols replace vulnerable bridges</p>
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

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {appsLoading ? (
              <>
                <SkeletonCard />
                <SkeletonCard />
                <SkeletonCard />
                <SkeletonCard />
              </>
            ) : (
              <>
                {apps.map((app) => (
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
                <Link href="/developers">
                  <GlassCard className="h-full min-h-[180px]">
                    <div className="p-4 h-full flex flex-col items-center justify-center text-center">
                      <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center mb-3 group-hover:bg-primary/20 transition-colors">
                        <Code className="w-5 h-5 text-muted-foreground group-hover:text-primary" />
                      </div>
                      <h3 className="text-sm font-bold text-white/70">Submit Your App</h3>
                      <p className="text-[10px] text-white/40 mt-1">Join the ecosystem</p>
                    </div>
                  </GlassCard>
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      <section className="py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <Link href="/dev-studio">
            <GlassCard glow hover={false} className="w-full">
              <div className="p-6 md:p-8 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-secondary/5" />
                <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center shrink-0">
                      <Sparkles className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <Badge variant="outline" className="border-primary/50 text-primary text-[10px] mb-1">Coming Q2 2026</Badge>
                      <h3 className="text-xl md:text-2xl font-display font-bold text-white">DarkWave Dev Studio</h3>
                      <p className="text-xs text-muted-foreground mt-0.5">AI-powered cloud IDE for blockchain development</p>
                    </div>
                  </div>
                  <Button className="bg-primary text-background hover:bg-primary/90 font-semibold px-6 shrink-0" data-testid="button-preview-dev-studio">
                    Preview <ArrowRight className="w-4 h-4 ml-2" />
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
            Join thousands of developers building the future of finance, gaming, and social on DarkWave Chain.
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

function AppCard({ id, name, category, desc, gradient, showFavorite, url }: { id?: string, name: string, category: string, desc: string, gradient: string, showFavorite?: boolean, url?: string }) {
  const truncatedDesc = desc.length > 60 ? desc.slice(0, 60) + "..." : desc;
  
  const cardContent = (
    <GlassCard className="h-full min-h-[180px]">
      <div className="p-4 h-full flex flex-col">
        <div className="flex justify-between items-start mb-3">
          <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${gradient} flex items-center justify-center text-white font-bold text-sm shadow-lg shrink-0`}>
            {name.charAt(0)}
          </div>
          {showFavorite && id && (
            <div onClick={(e) => e.stopPropagation()}>
              <FavoriteButton appId={id} />
            </div>
          )}
        </div>
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="text-sm font-bold text-white group-hover:text-primary transition-colors line-clamp-1">{name}</h3>
          <Badge variant="secondary" className="text-[9px] uppercase bg-white/10 text-white/60 shrink-0 px-1.5 py-0">
            {category}
          </Badge>
        </div>
        <p className="text-[11px] text-white/50 leading-relaxed mb-3 flex-grow line-clamp-2">
          {truncatedDesc}
        </p>
        <div className="flex items-center text-primary text-[10px] font-bold uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity mt-auto">
          Launch <ArrowRight className="w-3 h-3 ml-1" />
        </div>
      </div>
    </GlassCard>
  );

  if (url) {
    return (
      <a href={url} target="_blank" rel="noopener noreferrer" data-testid={`card-app-${id}`} className="group">
        {cardContent}
      </a>
    );
  }

  return (
    <Link href={`/ecosystem/${id || name.toLowerCase().replace(/\s+/g, '-')}`}>
      <div data-testid={`card-app-${id}`} className="group">{cardContent}</div>
    </Link>
  );
}
