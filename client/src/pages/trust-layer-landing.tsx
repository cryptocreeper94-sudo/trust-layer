import { useState } from "react";
import { motion } from "framer-motion";
import { Link, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import {
  Shield,
  User,
  Building2,
  CreditCard,
  QrCode,
  Download,
  Share2,
  Gift,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Users,
  Globe,
  Coins,
  Crown,
  ChevronRight,
  Menu,
  LayoutGrid,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { GlassCard } from "@/components/glass-card";
import { Footer } from "@/components/footer";
import { SimpleLoginModal } from "@/components/simple-login";
import { useSimpleAuth } from "@/hooks/use-simple-auth";
import { fetchEcosystemApps } from "@/lib/api";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const MEMBERSHIP_FEATURES = [
  {
    icon: CreditCard,
    title: "Digital Trust Card",
    description: "Your verified membership with unique Trust Number",
  },
  {
    icon: QrCode,
    title: "QR Code Verification",
    description: "Scannable code proving your trusted member status",
  },
  {
    icon: Download,
    title: "Download & Print",
    description: "Physical or digital card for your wallet",
  },
  {
    icon: Share2,
    title: "Referral Program",
    description: "Share your link and earn Shells for every signup",
  },
  {
    icon: Gift,
    title: "Early Adopter Rewards",
    description: "First 500 members get exclusive bonuses",
  },
  {
    icon: Crown,
    title: "Lifetime Benefits",
    description: "Your member number is permanent and immutable",
  },
];

const TRUST_BENEFITS = [
  {
    icon: Shield,
    title: "Verified Identity",
    description: "Blockchain-backed proof of your trusted status in the ecosystem",
  },
  {
    icon: Globe,
    title: "Ecosystem Access",
    description: "One login across all Trust Layer apps and services",
  },
  {
    icon: Coins,
    title: "Signal Token Rewards",
    description: "Earn SIG through participation, referrals, and engagement",
  },
  {
    icon: Users,
    title: "Community Hub",
    description: "Connect with other verified members in ChronoChat",
  },
];

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

function getAppImage(appId: string): string {
  return ecosystemImages[appId] || "";
}

export default function TrustLayerLanding() {
  const [, navigate] = useLocation();
  const { user, isAuthenticated } = useSimpleAuth();
  const [showLoginModal, setShowLoginModal] = useState(false);

  const { data: apps = [] } = useQuery({
    queryKey: ["ecosystem-apps"],
    queryFn: fetchEcosystemApps,
    staleTime: 30000,
  });

  const verifiedApps = apps.filter((app) => app.verified).slice(0, 6);

  const handleGetStarted = () => {
    if (isAuthenticated) {
      navigate("/my-hub");
    } else {
      setShowLoginModal(true);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-background/90 backdrop-blur-xl">
        <div className="container mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 flex-shrink-0">
            <Shield className="w-6 h-6 text-cyan-400" />
            <span className="font-display font-bold text-base sm:text-lg tracking-tight whitespace-nowrap">Trust Layer</span>
          </Link>
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="hidden sm:flex items-center gap-2">
              <Link href="/ecosystem">
                <Button variant="ghost" size="sm" className="h-8 text-xs" data-testid="link-nav-apps">
                  Apps
                </Button>
              </Link>
              <Link href="/chronochat">
                <Button variant="ghost" size="sm" className="h-8 text-xs" data-testid="link-nav-chat">
                  Chat
                </Button>
              </Link>
              <Link href="/presale">
                <Button variant="ghost" size="sm" className="h-8 text-xs" data-testid="link-nav-presale">
                  Presale
                </Button>
              </Link>
            </div>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0" data-testid="button-nav-menu">
                  <Menu className="w-5 h-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 bg-slate-900/95 border-white/10 backdrop-blur-xl">
                <DropdownMenuItem asChild>
                  <Link href="/ecosystem" className="flex items-center gap-2 cursor-pointer">
                    <LayoutGrid className="w-4 h-4" />
                    <span>Ecosystem</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/chronochat" className="flex items-center gap-2 cursor-pointer">
                    <Users className="w-4 h-4" />
                    <span>ChronoChat</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/presale" className="flex items-center gap-2 cursor-pointer">
                    <Coins className="w-4 h-4" />
                    <span>Presale</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/guardian-ai" className="flex items-center gap-2 cursor-pointer">
                    <Shield className="w-4 h-4" />
                    <span>Guardian AI</span>
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {isAuthenticated ? (
              <Link href="/my-hub">
                <Button size="sm" className="h-8 text-xs bg-primary text-background hover:bg-primary/90" data-testid="link-nav-myhub">
                  My Hub
                </Button>
              </Link>
            ) : (
              <Button
                size="sm"
                className="h-8 text-xs bg-primary text-background hover:bg-primary/90"
                onClick={() => setShowLoginModal(true)}
                data-testid="button-nav-signup"
              >
                Sign Up
              </Button>
            )}
          </div>
        </div>
      </nav>

      <section className="pt-24 pb-16 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-transparent to-purple-500/10" />
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-purple-500/15 rounded-full blur-3xl" />

        <div className="container mx-auto max-w-5xl relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <Badge className="mb-4 bg-cyan-500/20 text-cyan-400 border-cyan-500/30">
              <Sparkles className="w-3 h-3 mr-1" />
              Join the Trust Revolution
            </Badge>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-4 leading-tight">
              Your Identity.{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">
                Verified Forever.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-white/70 max-w-2xl mx-auto mb-8">
              Join the Trust Layer and receive your unique membership number, digital Trust Card,
              and access to an ecosystem of verified businesses and services.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center items-center mb-8">
              <Button
                size="lg"
                className="h-12 px-8 text-base bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-400 hover:to-purple-400 text-white font-bold shadow-lg shadow-cyan-500/25"
                onClick={handleGetStarted}
                data-testid="button-hero-signup"
              >
                {isAuthenticated ? "Go to My Hub" : "Get Your Trust Card"}
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Link href="/presale">
                <Button
                  size="lg"
                  variant="outline"
                  className="h-12 px-8 text-base border-white/20 hover:bg-white/5"
                  data-testid="button-hero-presale"
                >
                  <Coins className="w-5 h-5 mr-2" />
                  Join Presale
                </Button>
              </Link>
            </div>

            <div className="flex flex-wrap justify-center gap-4 sm:gap-6 text-xs sm:text-sm text-white/50">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-green-400" />
                Free to Join
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-green-400" />
                Instant Membership
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-green-400" />
                Earn Rewards
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-16 px-4 bg-slate-900/50">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-10">
            <Badge className="mb-3 bg-purple-500/20 text-purple-400 border-purple-500/30">
              Membership Benefits
            </Badge>
            <h2 className="text-2xl sm:text-3xl font-display font-bold mb-3">
              Your Digital Trust Card
            </h2>
            <p className="text-white/60 max-w-xl mx-auto text-sm sm:text-base">
              Every member receives a unique, verifiable identity on the blockchain
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {MEMBERSHIP_FEATURES.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <GlassCard glow className="h-full p-6">
                  <div className="flex items-start gap-4">
                    <div className="p-2.5 rounded-lg bg-gradient-to-br from-cyan-500/20 to-purple-500/20 border border-cyan-500/20 flex-shrink-0">
                      <feature.icon className="w-5 h-5 text-cyan-400" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-bold text-white mb-1.5">{feature.title}</h3>
                      <p className="text-white/60 text-sm leading-relaxed">{feature.description}</p>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </div>

          <div className="mt-10 text-center">
            <GlassCard className="inline-block p-6 max-w-lg mx-auto">
              <div className="flex items-center justify-center gap-4 mb-4">
                <div className="w-20 h-24 rounded-lg bg-gradient-to-br from-slate-800 to-slate-900 border border-cyan-500/30 flex flex-col items-center justify-center p-2 shadow-lg shadow-cyan-500/10">
                  <Shield className="w-6 h-6 text-cyan-400 mb-1" />
                  <span className="text-[8px] text-white/50 uppercase">Trust Layer</span>
                  <span className="text-sm font-bold text-white">#247</span>
                  <span className="text-[6px] text-cyan-400 mt-0.5">Verified Member</span>
                </div>
                <div className="text-left">
                  <p className="text-xs text-white/50 mb-1">Your membership includes:</p>
                  <ul className="text-xs text-white/70 space-y-0.5">
                    <li className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3 h-3 text-green-400" />
                      Unique Trust Number
                    </li>
                    <li className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3 h-3 text-green-400" />
                      Blockchain-verified hash
                    </li>
                    <li className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3 h-3 text-green-400" />
                      Downloadable card image
                    </li>
                    <li className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3 h-3 text-green-400" />
                      Scannable QR code
                    </li>
                  </ul>
                </div>
              </div>
              <Button
                className="w-full bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-400 hover:to-purple-400"
                onClick={handleGetStarted}
                data-testid="button-card-signup"
              >
                {isAuthenticated ? "View My Card" : "Get Your Card Now"}
              </Button>
            </GlassCard>
          </div>
        </div>
      </section>

      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-10">
            <Badge className="mb-3 bg-green-500/20 text-green-400 border-green-500/30">
              Why Join
            </Badge>
            <h2 className="text-2xl sm:text-3xl font-display font-bold mb-3">
              One Identity, Endless Possibilities
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {TRUST_BENEFITS.map((benefit, i) => (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <GlassCard glow className="h-full p-6 sm:p-8">
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/20 flex-shrink-0">
                      <benefit.icon className="w-6 h-6 text-cyan-400" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-bold text-lg text-white mb-2">{benefit.title}</h3>
                      <p className="text-white/60 leading-relaxed">{benefit.description}</p>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 px-4 bg-gradient-to-br from-purple-500/10 via-transparent to-cyan-500/10">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
            <div>
              <Badge className="mb-3 bg-blue-500/20 text-blue-400 border-blue-500/30">
                Ecosystem
              </Badge>
              <h2 className="text-2xl sm:text-3xl font-display font-bold">
                Verified Trust Layer Businesses
              </h2>
              <p className="text-white/60 mt-2 text-sm">
                Companies building on and verified by the Trust Layer
              </p>
            </div>
            <Link href="/ecosystem">
              <Button variant="outline" className="border-white/20 hover:bg-white/5" data-testid="link-view-all-apps">
                View All Apps
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {verifiedApps.map((app) => (
              <motion.a
                key={app.id}
                href={app.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block group"
                whileHover={{ y: -4 }}
                data-testid={`card-ecosystem-app-${app.id}`}
              >
                <GlassCard className="overflow-hidden hover:border-cyan-500/30 transition-all">
                  <div className="aspect-square relative">
                    <div className="w-full h-full bg-gradient-to-br from-cyan-500/20 to-purple-500/20 flex items-center justify-center">
                      <span className="text-2xl font-bold text-white/50">{app.name.charAt(0)}</span>
                    </div>
                    {getAppImage(app.id) && (
                      <img
                        src={getAppImage(app.id)}
                        alt={app.name}
                        className="absolute inset-0 w-full h-full object-cover"
                        onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-2">
                      <div className="flex items-center gap-1">
                        <span className="text-xs font-semibold text-white truncate" data-testid={`text-app-name-${app.id}`}>{app.name}</span>
                        {app.verified && <CheckCircle2 className="w-3 h-3 text-cyan-400 shrink-0" />}
                      </div>
                      <span className="text-[10px] text-white/50">{app.category}</span>
                    </div>
                  </div>
                </GlassCard>
              </motion.a>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 px-4 bg-slate-900/50">
        <div className="container mx-auto max-w-4xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <GlassCard glow className="p-6 sm:p-8 flex flex-col h-full">
              <div className="flex items-center gap-3 mb-5">
                <div className="p-2.5 rounded-lg bg-cyan-500/20 border border-cyan-500/20 flex-shrink-0">
                  <User className="w-5 h-5 text-cyan-400" />
                </div>
                <h3 className="text-xl font-bold">Individuals</h3>
              </div>
              <p className="text-white/60 mb-6 text-sm leading-relaxed">
                Join for free and receive your Trust Card, earn rewards through referrals, and
                access verified services across the ecosystem.
              </p>
              <ul className="space-y-4 mb-8 text-sm flex-grow px-2">
                <li className="flex items-start gap-3 text-white/70">
                  <CheckCircle2 className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                  <span>Free membership forever</span>
                </li>
                <li className="flex items-start gap-3 text-white/70">
                  <CheckCircle2 className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                  <span>Earn Shells through referrals</span>
                </li>
                <li className="flex items-start gap-3 text-white/70">
                  <CheckCircle2 className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                  <span>Access to community features</span>
                </li>
              </ul>
              <Button
                className="w-full bg-cyan-500 hover:bg-cyan-400 text-black font-bold mt-auto"
                onClick={handleGetStarted}
                data-testid="button-individual-signup"
              >
                {isAuthenticated ? "Go to My Hub" : "Join as Individual"}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </GlassCard>

            <GlassCard glow className="p-6 sm:p-8 flex flex-col h-full">
              <div className="flex items-center gap-3 mb-5">
                <div className="p-2.5 rounded-lg bg-purple-500/20 border border-purple-500/20 flex-shrink-0">
                  <Building2 className="w-5 h-5 text-purple-400" />
                </div>
                <div className="flex flex-col gap-1">
                  <h3 className="text-xl font-bold">Businesses</h3>
                  <Badge variant="outline" className="w-fit text-[10px] border-purple-500/30 text-purple-400">
                    Requires Personal Account
                  </Badge>
                </div>
              </div>
              <p className="text-white/60 mb-6 text-sm leading-relaxed">
                Verify your business on the Trust Layer for API access, team management, and
                enhanced referral rewards.
              </p>
              <ul className="space-y-4 mb-8 text-sm flex-grow px-2">
                <li className="flex items-start gap-3 text-white/70">
                  <CheckCircle2 className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                  <span>Verified business badge</span>
                </li>
                <li className="flex items-start gap-3 text-white/70">
                  <CheckCircle2 className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                  <span>2.5x referral rewards</span>
                </li>
                <li className="flex items-start gap-3 text-white/70">
                  <CheckCircle2 className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                  <span>API access & webhooks</span>
                </li>
              </ul>
              <Link href={isAuthenticated ? "/business-apply" : "#"} className="mt-auto">
                <Button
                  variant="outline"
                  className="w-full border-purple-500/30 text-purple-400 hover:bg-purple-500/10"
                  onClick={(e) => {
                    if (!isAuthenticated) {
                      e.preventDefault();
                      setShowLoginModal(true);
                    }
                  }}
                  data-testid="button-business-signup"
                >
                  {isAuthenticated ? "Apply for Business" : "Sign Up First"}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </GlassCard>
          </div>
        </div>
      </section>

      <section className="py-16 px-4">
        <div className="container mx-auto max-w-3xl text-center">
          <h2 className="text-2xl sm:text-3xl font-display font-bold mb-4">
            Ready to Join the Trust Layer?
          </h2>
          <p className="text-white/60 mb-8 max-w-xl mx-auto">
            Get your unique membership number today. Free forever, rewards from day one.
          </p>
          <Button
            size="lg"
            className="h-14 px-10 text-lg bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-400 hover:to-purple-400 text-white font-bold shadow-lg shadow-cyan-500/25"
            onClick={handleGetStarted}
            data-testid="button-cta-signup"
          >
            {isAuthenticated ? "Go to My Hub" : "Get Started Free"}
            <Sparkles className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </section>

      <Footer />

      <SimpleLoginModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} />
    </div>
  );
}
