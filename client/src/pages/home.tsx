import { motion } from "framer-motion";
import { Link } from "wouter";
import { ArrowRight, Code, Globe, Layers, Shield, Zap, Cpu, Network, Database, Heart } from "lucide-react";
import heroBg from "@assets/generated_images/abstract_blockchain_network_nodes_connecting_in_dark_space.png";
import orbitLogo from "@assets/generated_images/futuristic_abstract_geometric_logo_symbol_for_orbit.png";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { OnboardingTour } from "@/components/onboarding-tour";
import { useQuery } from "@tanstack/react-query";
import { fetchEcosystemApps, fetchBlockchainStats } from "@/lib/api";
import { GlobalSearch } from "@/components/global-search";
import { ThemeToggle } from "@/components/theme-toggle";
import { NotificationsDropdown } from "@/components/notifications";
import { FavoriteButton } from "@/components/favorite-button";
import { SkeletonCard, SkeletonStatCard } from "@/components/ui/skeleton-card";
import { MobileNav } from "@/components/mobile-nav";
import { usePreferences } from "@/lib/store";
import { Footer } from "@/components/footer";
import { usePageAnalytics } from "@/hooks/use-analytics";

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
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-md">
        <div className="container mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={orbitLogo} alt="DarkWave Logo" className="w-10 h-10 animate-pulse-slow" />
            <span className="font-display font-bold text-2xl tracking-tight">DarkWave</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
            <Link href="/ecosystem" className="hover:text-primary transition-colors cursor-pointer">Ecosystem</Link>
            <Link href="/token" className="hover:text-primary transition-colors cursor-pointer">Token</Link>
            <Link href="/explorer" className="hover:text-primary transition-colors cursor-pointer">Explorer</Link>
            <Link href="/developers" className="hover:text-primary transition-colors cursor-pointer">Developers</Link>
          </div>
          <div className="flex items-center gap-2">
            <div className="hidden md:flex items-center gap-2">
              <GlobalSearch />
              <ThemeToggle />
              <NotificationsDropdown />
            </div>
            <Button variant="ghost" className="hidden sm:flex hover:bg-white/5 hover:text-white" data-testid="button-login">Log In</Button>
            <Link href="/ecosystem">
              <Button className="hidden sm:flex bg-primary text-background hover:bg-primary/90 font-semibold shadow-[0_0_20px_rgba(0,255,255,0.3)]" data-testid="button-launch-app">
                Launch App
              </Button>
            </Link>
            <MobileNav />
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <img 
            src={heroBg} 
            alt="Background" 
            className="w-full h-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/0 via-background/80 to-background"></div>
        </div>

        <div className="container relative z-10 px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="max-w-4xl mx-auto space-y-8"
          >
            <Badge variant="outline" className="px-4 py-1 border-primary/50 text-primary bg-primary/10 rounded-full text-sm font-tech tracking-wider uppercase">
              The Next Generation Ecosystem
            </Badge>
            
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-display font-bold leading-tight md:leading-tight bg-clip-text text-transparent bg-gradient-to-b from-white to-white/50">
              Welcome to the <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-cyan-400 to-secondary text-glow">DarkWave Chain</span>
            </h1>

            <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              A universal ledger for the next web. Scalable, secure, and built to power the next generation of decentralized applications.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
              <Link href="/developers">
                <Button size="lg" className="h-14 px-8 text-lg bg-primary text-background hover:bg-primary/90 font-bold rounded-full shadow-[0_0_30px_rgba(0,255,255,0.4)] transition-all hover:scale-105" data-testid="button-start-building">
                  Start Building <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link href="/explorer">
                <Button size="lg" variant="outline" className="h-14 px-8 text-lg border-primary/50 text-primary hover:bg-primary/10 rounded-full transition-all hover:border-primary" data-testid="button-explore-chain">
                  DarkWaveScan
                </Button>
              </Link>
            </div>

            <div className="flex items-center justify-center gap-6 pt-4 text-sm text-muted-foreground">
              <a href="https://darkwavechain.io" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">darkwavechain.io</a>
              <span className="text-white/20">|</span>
              <a href="https://darkwavechain.com" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">darkwavechain.com</a>
            </div>
          </motion.div>
        </div>

        {/* Floating Elements Animation */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-[500px] h-[500px] rounded-full bg-primary/5 blur-3xl"
              initial={{ x: Math.random() * 100 - 50 + "%", y: Math.random() * 100 - 50 + "%" }}
              animate={{ 
                x: [null, Math.random() * 100 - 50 + "%"],
                y: [null, Math.random() * 100 - 50 + "%"],
              }}
              transition={{ duration: 20, repeat: Infinity, repeatType: "reverse", ease: "linear" }}
            />
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 border-y border-white/5 bg-black/20 backdrop-blur-sm">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {statsLoading ? (
              <>
                <SkeletonStatCard />
                <SkeletonStatCard />
                <SkeletonStatCard />
                <SkeletonStatCard />
              </>
            ) : (
              <>
                <StatCard value={stats?.tps || "200K+"} label="TPS Throughput" live />
                <StatCard value={stats?.finalityTime || "0.4s"} label="Finality Time" live />
                <StatCard value={stats?.avgCost || "$0.0001"} label="Avg Cost" />
                <StatCard value={stats?.activeNodes || "150+"} label="Active Nodes" live />
              </>
            )}
          </div>
        </div>
      </section>

      {/* About / "Why DarkWave" */}
      <section id="features" className="py-32 relative">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row gap-16 items-center">
            <div className="w-full md:w-1/2 space-y-8">
              <h2 className="text-4xl md:text-5xl font-display font-bold">
                Chain Abstraction <br/>
                <span className="text-primary">Native Interop.</span>
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                We're building the holy grail of blockchain: <strong>Omnichain Interoperability</strong>.
                DarkWave Chain doesn't just "bridge" assets; it abstracts the chain entirely.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Connect to Ethereum, Solana, and others natively. Use your DarkWave Smart Account to execute trades 
                on any chain without ever leaving the ecosystem. No fragile bridges. No wrapped tokens. 
                Just pure, protocol-level messaging.
              </p>
              
              <ul className="space-y-4 pt-4">
                <FeatureItem icon={Zap} title="Instant Consensus" desc="Using advanced DAG protocols for sub-second finality." />
                <FeatureItem icon={Shield} title="Chain Abstraction" desc="Control assets on any chain from your DarkWave account." />
                <FeatureItem icon={Layers} title="Bridge-Free" desc="Native messaging protocols replace vulnerable bridges." />
              </ul>
            </div>
            
            <div className="w-full md:w-1/2">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-secondary/20 blur-3xl rounded-full" />
                <Card className="relative bg-black/40 border-white/10 backdrop-blur-xl overflow-hidden p-8 border-glow">
                  <div className="absolute top-0 right-0 p-4 opacity-20">
                    <Network className="w-32 h-32 text-white" />
                  </div>
                  <h3 className="font-tech text-xl text-primary mb-6 flex items-center gap-2">
                    <Database className="w-4 h-4" /> NODE_STATUS: ONLINE
                  </h3>
                  <div className="space-y-4 font-mono text-sm text-green-400/80">
                    <p>{`> Connecting to DarkWave Mainnet...`}</p>
                    <p>{`> Synchronizing ledger state... OK`}</p>
                    <p>{`> Verifying Proof of History... OK`}</p>
                    <p>{`> Established connection to 152 peers.`}</p>
                    <p className="animate-pulse">{`> Awaiting transaction block #89210...`}</p>
                  </div>
                  <div className="mt-8 pt-8 border-t border-white/10 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 rounded-lg bg-white/5">
                      <div className="text-xs text-muted-foreground mb-1 uppercase tracking-wider">Current Block</div>
                      <div className="text-xl md:text-2xl font-bold font-display text-white break-all">{stats?.currentBlock || "#8,921,042"}</div>
                    </div>
                    <div className="p-4 rounded-lg bg-white/5">
                      <div className="text-xs text-muted-foreground mb-1 uppercase tracking-wider">Network Hash</div>
                      <div className="text-xl md:text-2xl font-bold font-display text-white break-all">{stats?.networkHash || "42.8 EH/s"}</div>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Favorites Section */}
      {favoriteApps.length > 0 && (
        <section className="py-16 bg-primary/5 border-y border-primary/20">
          <div className="container mx-auto px-6">
            <div className="flex items-center gap-3 mb-8">
              <Heart className="w-6 h-6 text-red-400 fill-current" />
              <h2 className="text-2xl font-display font-bold">Your Favorites</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
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

      {/* Ecosystem Apps Grid */}
      <section className="py-32 bg-secondary/5">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-4xl md:text-5xl font-display font-bold mb-6">Dark Wave Ecosystem</h2>
            <p className="text-xl text-muted-foreground">
              A thriving ecosystem of decentralized applications powered by Dark Wave Studios. 
              Everything lives on the same universal ledger.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
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
                  <div className="group relative rounded-xl border-2 border-dashed border-white/10 bg-transparent flex flex-col items-center justify-center p-8 hover:border-primary/50 transition-colors cursor-pointer h-full" data-testid="card-submit-app">
                    <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                      <Code className="w-6 h-6 text-muted-foreground group-hover:text-primary" />
                    </div>
                    <h3 className="text-lg font-bold text-muted-foreground group-hover:text-primary">Submit Your App</h3>
                    <p className="text-sm text-center text-muted-foreground/60 mt-2">Join the ecosystem</p>
                  </div>
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-primary/5"></div>
        <div className="container mx-auto px-6 relative z-10 text-center">
          <h2 className="text-5xl md:text-7xl font-display font-bold mb-8">Ready to Launch?</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-12">
            Join thousands of developers building the future of finance, gaming, and social on DarkWave Chain.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Link href="/developers">
              <Button size="lg" className="h-16 px-12 text-xl bg-primary text-background hover:bg-primary/90 font-bold rounded-full shadow-lg hover:shadow-cyan-500/20 transition-all" data-testid="button-start-building-now">
                Start Building Now
              </Button>
            </Link>
            <Link href="/doc-hub">
              <Button size="lg" variant="ghost" className="h-16 px-12 text-xl hover:bg-white/5 rounded-full" data-testid="button-explore-docs">
                Explore Documentation
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

function StatCard({ value, label, live }: { value: string, label: string, live?: boolean }) {
  return (
    <div className="text-center group hover:-translate-y-1 transition-transform duration-300">
      <div className="text-4xl md:text-5xl font-display font-bold text-white mb-2 group-hover:text-primary transition-colors flex items-center justify-center gap-2">
        {value}
        {live && (
          <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" title="Live data" />
        )}
      </div>
      <div className="text-sm text-muted-foreground uppercase tracking-wider font-medium">
        {label}
      </div>
    </div>
  );
}

function FeatureItem({ icon: Icon, title, desc }: { icon: any, title: string, desc: string }) {
  return (
    <div className="flex items-start gap-4 p-4 rounded-xl hover:bg-white/5 transition-colors">
      <div className="p-3 rounded-lg bg-primary/10 text-primary mt-1">
        <Icon className="w-5 h-5" />
      </div>
      <div>
        <h3 className="font-bold text-lg text-white mb-1">{title}</h3>
        <p className="text-muted-foreground text-sm leading-relaxed">{desc}</p>
      </div>
    </div>
  );
}

function AppCard({ id, name, category, desc, gradient, showFavorite, url }: { id?: string, name: string, category: string, desc: string, gradient: string, showFavorite?: boolean, url?: string }) {
  const truncatedDesc = desc.length > 80 ? desc.slice(0, 80) + "..." : desc;
  
  const cardContent = (
    <div className="group relative p-[1px] rounded-xl bg-gradient-to-b from-white/10 to-transparent hover:from-primary/50 hover:to-secondary/50 transition-all duration-300 cursor-pointer h-full">
      <div className="relative h-full bg-black/40 backdrop-blur-xl rounded-xl p-6 hover:bg-black/60 transition-all flex flex-col">
        <div className="flex justify-between items-start mb-4">
          <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${gradient} flex items-center justify-center text-white font-bold text-xl shadow-lg flex-shrink-0`}>
            {name.charAt(0)}
          </div>
          {showFavorite && id && (
            <div onClick={(e) => e.stopPropagation()}>
              <FavoriteButton appId={id} />
            </div>
          )}
        </div>
        <div className="flex justify-between items-start mb-2 gap-2">
          <h3 className="font-bold text-xl text-white group-hover:text-primary transition-colors line-clamp-1">{name}</h3>
          <Badge variant="secondary" className="text-[10px] uppercase tracking-wider bg-white/10 text-white/70 hover:bg-white/20 flex-shrink-0">
            {category}
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed mb-4 flex-grow line-clamp-2">
          {truncatedDesc}
        </p>
        <div className="flex items-center text-primary text-xs font-bold uppercase tracking-wider md:opacity-0 md:group-hover:opacity-100 transition-opacity md:transform md:translate-y-2 md:group-hover:translate-y-0 mt-auto">
          LAUNCH APP <ArrowRight className="w-3 h-3 ml-1" />
        </div>
      </div>
    </div>
  );

  if (url) {
    return (
      <a href={url} target="_blank" rel="noopener noreferrer" data-testid={`card-app-${id}`}>
        {cardContent}
      </a>
    );
  }

  return (
    <Link href={`/ecosystem/${id || name.toLowerCase().replace(/\s+/g, '-')}`}>
      <div data-testid={`card-app-${id}`}>{cardContent}</div>
    </Link>
  );
}
