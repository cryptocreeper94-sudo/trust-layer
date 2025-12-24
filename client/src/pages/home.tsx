import { motion } from "framer-motion";
import { Link } from "wouter";
import { ArrowRight, Code, Globe, Layers, Shield, Zap, Cpu, Network, Database, Heart, Sparkles, Activity, Server, CheckCircle2, LogOut, User, Droplets, ArrowUpDown, ImageIcon, PieChart, History, Rocket, LineChart, Webhook, Palette, Trophy, Target } from "lucide-react";
import { InfoTooltip } from "@/components/info-tooltip";
import heroBg from "@assets/generated_images/abstract_blockchain_network_nodes_connecting_in_dark_space.png";
import orbitLogo from "@assets/generated_images/futuristic_abstract_geometric_logo_symbol_for_orbit.png";
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
import { useState } from "react";
import { WalletButton } from "@/components/wallet-button";

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

export default function Home() {
  const { preferences } = usePreferences();
  const { user, loading: authLoading, isAuthenticated, displayName, signOut } = useFirebaseAuth();
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
      <FirebaseLoginModal 
        isOpen={showLoginModal} 
        onClose={() => setShowLoginModal(false)} 
      />
      
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-background/90 backdrop-blur-xl">
        <div className="container mx-auto px-4 h-14 flex items-center">
          <Link href="/" className="flex items-center gap-2 mr-auto">
            <img src={orbitLogo} alt="DarkWave" className="w-7 h-7" />
            <span className="font-display font-bold text-lg tracking-tight">DarkWave</span>
          </Link>
          <div className="hidden lg:flex items-center gap-4 text-xs font-medium text-muted-foreground mr-4">
            <Link href="/ecosystem" className="hover:text-primary transition-colors whitespace-nowrap">Ecosystem</Link>
            <Link href="/token" className="hover:text-primary transition-colors whitespace-nowrap">Token</Link>
            <Link href="/bridge" className="hover:text-primary transition-colors whitespace-nowrap flex items-center gap-1">
              Bridge
              <Badge variant="outline" className="text-[9px] border-cyan-500/50 text-cyan-400 px-1 py-0">Beta</Badge>
            </Link>
            <a href="https://darkwavepulse.com" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors flex items-center gap-1 whitespace-nowrap">
              Staking
              <ArrowRight className="w-2.5 h-2.5 -rotate-45" />
            </a>
            <Link href="/explorer" className="hover:text-primary transition-colors whitespace-nowrap">Explorer</Link>
            <Link href="/developers" className="hover:text-primary transition-colors whitespace-nowrap">Developers</Link>
            <Link href="/studio" className="hover:text-primary transition-colors flex items-center gap-1 whitespace-nowrap">
              Studio
              <Badge variant="outline" className="text-[9px] border-green-500/50 text-green-400 px-1 py-0">Live</Badge>
            </Link>
            <Link href="/swap" className="hover:text-primary transition-colors flex items-center gap-1 whitespace-nowrap">
              DeFi
              <Badge variant="outline" className="text-[9px] border-pink-500/50 text-pink-400 px-1 py-0">New</Badge>
            </Link>
          </div>
          <div className="flex items-center gap-2">
            <div className="hidden md:flex items-center gap-2">
              <GlobalSearch />
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
                      <InfoTooltip content="Average cost per transaction. DarkWave Chain keeps fees extremely low compared to other blockchains." label="Transaction cost info" />
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
                      <InfoTooltip content="DarkWave Chain runs on a Proof-of-Authority (PoA) consensus. The Founders Validator secures the network with enterprise-grade infrastructure." label="Validator info" />
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
              <GlassCard className="h-full group hover:border-pink-500/50 transition-all duration-300">
                <div className="p-5">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-500/20 to-purple-500/20 flex items-center justify-center group-hover:shadow-[0_0_30px_rgba(236,72,153,0.3)] transition-shadow">
                      <ArrowUpDown className="w-6 h-6 text-pink-400" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-white">Trading</h3>
                      <p className="text-[11px] text-muted-foreground">Swap, liquidity & charts</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <Link href="/swap">
                      <div className="p-2.5 rounded-lg bg-black/30 border border-white/5 hover:border-pink-500/40 hover:bg-pink-500/5 transition-all text-center group/item" data-testid="link-swap">
                        <ArrowUpDown className="w-4 h-4 mx-auto mb-1 text-pink-400" />
                        <span className="text-[10px] text-gray-300 group-hover/item:text-white">Swap</span>
                      </div>
                    </Link>
                    <Link href="/liquidity">
                      <div className="p-2.5 rounded-lg bg-black/30 border border-white/5 hover:border-emerald-500/40 hover:bg-emerald-500/5 transition-all text-center group/item" data-testid="link-liquidity">
                        <Droplets className="w-4 h-4 mx-auto mb-1 text-emerald-400" />
                        <span className="text-[10px] text-gray-300 group-hover/item:text-white">Pools</span>
                      </div>
                    </Link>
                    <Link href="/charts">
                      <div className="p-2.5 rounded-lg bg-black/30 border border-white/5 hover:border-sky-500/40 hover:bg-sky-500/5 transition-all text-center group/item" data-testid="link-charts">
                        <LineChart className="w-4 h-4 mx-auto mb-1 text-sky-400" />
                        <span className="text-[10px] text-gray-300 group-hover/item:text-white">Charts</span>
                      </div>
                    </Link>
                  </div>
                </div>
              </GlassCard>
            </motion.div>

            {/* NFT Hub Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              <GlassCard className="h-full group hover:border-purple-500/50 transition-all duration-300">
                <div className="p-5">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500/20 to-violet-500/20 flex items-center justify-center group-hover:shadow-[0_0_30px_rgba(168,85,247,0.3)] transition-shadow">
                      <ImageIcon className="w-6 h-6 text-purple-400" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-white">NFT</h3>
                      <p className="text-[11px] text-muted-foreground">Collect, create & explore</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <Link href="/nft">
                      <div className="p-2.5 rounded-lg bg-black/30 border border-white/5 hover:border-purple-500/40 hover:bg-purple-500/5 transition-all text-center group/item" data-testid="link-nft-market">
                        <ImageIcon className="w-4 h-4 mx-auto mb-1 text-purple-400" />
                        <span className="text-[10px] text-gray-300 group-hover/item:text-white">Market</span>
                      </div>
                    </Link>
                    <Link href="/nft-gallery">
                      <div className="p-2.5 rounded-lg bg-black/30 border border-white/5 hover:border-violet-500/40 hover:bg-violet-500/5 transition-all text-center group/item" data-testid="link-nft-gallery">
                        <ImageIcon className="w-4 h-4 mx-auto mb-1 text-violet-400" />
                        <span className="text-[10px] text-gray-300 group-hover/item:text-white">Gallery</span>
                      </div>
                    </Link>
                    <Link href="/nft-creator">
                      <div className="p-2.5 rounded-lg bg-black/30 border border-white/5 hover:border-rose-500/40 hover:bg-rose-500/5 transition-all text-center group/item" data-testid="link-nft-creator">
                        <Palette className="w-4 h-4 mx-auto mb-1 text-rose-400" />
                        <span className="text-[10px] text-gray-300 group-hover/item:text-white">Create</span>
                      </div>
                    </Link>
                  </div>
                </div>
              </GlassCard>
            </motion.div>

            {/* Tools Hub Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <GlassCard className="h-full group hover:border-cyan-500/50 transition-all duration-300">
                <div className="p-5">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 flex items-center justify-center group-hover:shadow-[0_0_30px_rgba(0,255,255,0.3)] transition-shadow">
                      <Zap className="w-6 h-6 text-cyan-400" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-white">Tools</h3>
                      <p className="text-[11px] text-muted-foreground">Faucet, portfolio & more</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <Link href="/faucet">
                      <div className="p-2.5 rounded-lg bg-black/30 border border-white/5 hover:border-cyan-500/40 hover:bg-cyan-500/5 transition-all text-center group/item" data-testid="link-faucet">
                        <Droplets className="w-4 h-4 mx-auto mb-1 text-cyan-400" />
                        <span className="text-[10px] text-gray-300 group-hover/item:text-white">Faucet</span>
                      </div>
                    </Link>
                    <Link href="/portfolio">
                      <div className="p-2.5 rounded-lg bg-black/30 border border-white/5 hover:border-green-500/40 hover:bg-green-500/5 transition-all text-center group/item" data-testid="link-portfolio">
                        <PieChart className="w-4 h-4 mx-auto mb-1 text-green-400" />
                        <span className="text-[10px] text-gray-300 group-hover/item:text-white">Portfolio</span>
                      </div>
                    </Link>
                    <Link href="/transactions">
                      <div className="p-2.5 rounded-lg bg-black/30 border border-white/5 hover:border-blue-500/40 hover:bg-blue-500/5 transition-all text-center group/item" data-testid="link-history">
                        <History className="w-4 h-4 mx-auto mb-1 text-blue-400" />
                        <span className="text-[10px] text-gray-300 group-hover/item:text-white">History</span>
                      </div>
                    </Link>
                  </div>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    <Link href="/launchpad">
                      <div className="p-2.5 rounded-lg bg-black/30 border border-white/5 hover:border-orange-500/40 hover:bg-orange-500/5 transition-all text-center group/item" data-testid="link-launchpad">
                        <Rocket className="w-4 h-4 mx-auto mb-1 text-orange-400" />
                        <span className="text-[10px] text-gray-300 group-hover/item:text-white">Launchpad</span>
                      </div>
                    </Link>
                    <Link href="/webhooks">
                      <div className="p-2.5 rounded-lg bg-black/30 border border-white/5 hover:border-amber-500/40 hover:bg-amber-500/5 transition-all text-center group/item" data-testid="link-webhooks">
                        <Webhook className="w-4 h-4 mx-auto mb-1 text-amber-400" />
                        <span className="text-[10px] text-gray-300 group-hover/item:text-white">Webhooks</span>
                      </div>
                    </Link>
                  </div>
                </div>
              </GlassCard>
            </motion.div>

            {/* Earn & Track Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              <GlassCard className="h-full group hover:border-amber-500/50 transition-all duration-300">
                <div className="p-5">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 flex items-center justify-center group-hover:shadow-[0_0_30px_rgba(251,191,36,0.3)] transition-shadow">
                      <Trophy className="w-6 h-6 text-amber-400" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-white">Earn & Track</h3>
                      <p className="text-[11px] text-muted-foreground">XP, quests & network</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <Link href="/quests">
                      <div className="p-2.5 rounded-lg bg-black/30 border border-white/5 hover:border-amber-500/40 hover:bg-amber-500/5 transition-all text-center group/item" data-testid="link-quests">
                        <Target className="w-4 h-4 mx-auto mb-1 text-amber-400" />
                        <span className="text-[10px] text-gray-300 group-hover/item:text-white">Quests</span>
                      </div>
                    </Link>
                    <Link href="/network">
                      <div className="p-2.5 rounded-lg bg-black/30 border border-white/5 hover:border-green-500/40 hover:bg-green-500/5 transition-all text-center group/item" data-testid="link-network">
                        <Activity className="w-4 h-4 mx-auto mb-1 text-green-400" />
                        <span className="text-[10px] text-gray-300 group-hover/item:text-white">Network</span>
                      </div>
                    </Link>
                  </div>
                </div>
              </GlassCard>
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
  const [imgFailed, setImgFailed] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);
  const imageSrc = id ? ecosystemImages[id] : "";
  
  const cardContent = (
    <GlassCard className="h-full min-h-[180px]">
      <div className="p-4 h-full flex flex-col">
        <div className="flex justify-between items-start mb-3">
          <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${gradient} flex items-center justify-center text-white font-bold text-sm shadow-lg shrink-0 overflow-hidden relative`}>
            {imageSrc && !imgFailed ? (
              <>
                {!imgLoaded && <span className="absolute inset-0 flex items-center justify-center">{name.charAt(0)}</span>}
                <img 
                  src={imageSrc} 
                  alt={name}
                  className={`w-full h-full object-cover ${imgLoaded ? 'opacity-100' : 'opacity-0'}`}
                  onLoad={() => setImgLoaded(true)}
                  onError={() => setImgFailed(true)}
                />
              </>
            ) : (
              name.charAt(0)
            )}
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
