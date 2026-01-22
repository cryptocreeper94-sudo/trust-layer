import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "wouter";
import {
  Shield,
  Building2,
  User,
  CheckCircle2,
  ArrowRight,
  Globe,
  Lock,
  Zap,
  Award,
  Users,
  TrendingUp,
  BadgeCheck,
  Sparkles,
  Target,
  Layers,
  Network,
  FileCheck,
  HandshakeIcon,
  Scale,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/glass-card";
import { Footer } from "@/components/footer";
import { useAuth } from "@/hooks/use-auth";
import darkwaveLogo from "@assets/generated_images/darkwave_token_transparent.png";

const ROADMAP_PHASES = [
  {
    phase: "Phase 1",
    title: "Foundation",
    status: "active",
    quarter: "Q1 2026",
    items: [
      "Core blockchain infrastructure",
      "Trust Layer consensus mechanism",
      "Member registration system",
      "Digital Trust Card issuance",
    ],
  },
  {
    phase: "Phase 2",
    title: "Expansion",
    status: "upcoming",
    quarter: "Q2 2026",
    items: [
      "Business verification portal",
      "Multi-signature treasuries",
      "Cross-chain bridge deployment",
      "Guardian certification program",
    ],
  },
  {
    phase: "Phase 3",
    title: "Ecosystem",
    status: "upcoming",
    quarter: "Q3 2026",
    items: [
      "DarkWave Academy launch",
      "Signal Foundation charitable arm",
      "AI-verified execution",
      "Enterprise API marketplace",
    ],
  },
  {
    phase: "Phase 4",
    title: "Scale",
    status: "upcoming",
    quarter: "Q4 2026",
    items: [
      "Global trust network expansion",
      "RWA tokenization platform",
      "Decentralized identity standards",
      "Cross-industry partnerships",
    ],
  },
];

const BUSINESS_TIERS = [
  {
    name: "Startup",
    price: "$99/mo",
    description: "For emerging businesses ready to build trust",
    features: [
      "Verified Business Trust Card",
      "Up to 5 team members",
      "Basic audit trail",
      "Community support",
      "100 transactions/month",
    ],
    gradient: "from-blue-500 to-cyan-500",
    icon: Zap,
  },
  {
    name: "Professional",
    price: "$299/mo",
    description: "For growing companies needing verified partnerships",
    features: [
      "Premium Trust Card with QR",
      "Up to 25 team members",
      "Full audit history",
      "Priority support",
      "1,000 transactions/month",
      "Partner network access",
      "Multi-SIG treasury",
    ],
    gradient: "from-purple-500 to-pink-500",
    icon: Building2,
    popular: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    description: "For large organizations requiring complete trust infrastructure",
    features: [
      "Custom branded Trust Cards",
      "Unlimited team members",
      "Real-time compliance dashboard",
      "Dedicated account manager",
      "Unlimited transactions",
      "Custom API integration",
      "White-label options",
      "SLA guarantees",
    ],
    gradient: "from-amber-500 to-orange-500",
    icon: Globe,
  },
];

const INDIVIDUAL_TIERS = [
  {
    name: "Pioneer",
    price: "Free",
    description: "Join the trust revolution",
    features: [
      "Personal Trust Card",
      "Unique Trust Number",
      "Transaction history",
      "Early adopter badge",
      "Community access",
    ],
    gradient: "from-green-500 to-emerald-500",
    icon: User,
  },
  {
    name: "Guardian",
    price: "$9.99/mo",
    description: "Enhanced trust credentials for professionals",
    features: [
      "Premium Trust Card design",
      "Verified identity badge",
      "Priority transaction processing",
      "Reward point multiplier (2x)",
      "Exclusive Guardian network",
      "Advanced verification features",
    ],
    gradient: "from-purple-500 to-violet-500",
    icon: Shield,
    popular: true,
  },
];

export default function TrustLayerPage() {
  const { isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState<"business" | "individual">("business");

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-pink-500/5 rounded-full blur-3xl" />
      </div>

      <section className="relative pt-24 pb-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-purple-500/20 to-cyan-500/20 border border-purple-500/30 mb-6">
              <Shield className="w-4 h-4 text-purple-400" />
              <span className="text-sm text-purple-300">The Future of Business Trust</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
                DarkWave Trust Layer
              </span>
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              A coordinated trust infrastructure for verified identity, accountability, and 
              transparent audit trails. Move beyond speculation — build real business 
              relationships on a foundation of cryptographic proof.
            </p>

            <div className="flex flex-wrap justify-center gap-4">
              <Link href="#membership">
                <Button size="lg" className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500">
                  Join the Network
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
              <Link href="/explorer">
                <Button size="lg" variant="outline" className="border-white/20 hover:bg-white/5">
                  Explore the Chain
                </Button>
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="relative max-w-4xl mx-auto"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-cyan-500/20 rounded-3xl blur-xl" />
            <GlassCard glow className="relative overflow-hidden">
              <div className="p-8 md:p-12">
                <div className="grid md:grid-cols-3 gap-8 text-center">
                  <div>
                    <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center">
                      <Lock className="w-8 h-8 text-purple-400" />
                    </div>
                    <h3 className="font-bold text-lg mb-2">Verified Identity</h3>
                    <p className="text-sm text-muted-foreground">
                      Every member receives a unique Trust Number hashed to the blockchain
                    </p>
                  </div>
                  <div>
                    <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 flex items-center justify-center">
                      <FileCheck className="w-8 h-8 text-cyan-400" />
                    </div>
                    <h3 className="font-bold text-lg mb-2">Transparent Audit</h3>
                    <p className="text-sm text-muted-foreground">
                      Complete transaction history with immutable on-chain records
                    </p>
                  </div>
                  <div>
                    <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-green-500/20 to-emerald-500/20 flex items-center justify-center">
                      <HandshakeIcon className="w-8 h-8 text-green-400" />
                    </div>
                    <h3 className="font-bold text-lg mb-2">Trusted Partnerships</h3>
                    <p className="text-sm text-muted-foreground">
                      Connect with verified businesses and individuals in the network
                    </p>
                  </div>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        </div>
      </section>

      <section className="py-20 px-4 relative">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                The Trust Crisis
              </span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Traditional business relationships rely on outdated systems of trust. 
              The Trust Layer solves this with cryptographic accountability.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            <GlassCard>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-4 text-red-400">The Problem</h3>
                <ul className="space-y-3">
                  {[
                    "Unverifiable business credentials",
                    "Opaque transaction histories",
                    "Fraud and identity theft",
                    "Broken accountability chains",
                    "Costly due diligence processes",
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-muted-foreground">
                      <div className="w-2 h-2 mt-2 rounded-full bg-red-500 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </GlassCard>

            <GlassCard glow>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-4 text-green-400">The Solution</h3>
                <ul className="space-y-3">
                  {[
                    "Blockchain-verified identity for every member",
                    "Immutable audit trails for all transactions",
                    "Cryptographic proof of business relationships",
                    "Real-time accountability through Trust Numbers",
                    "Instant verification with QR-enabled Trust Cards",
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-white">
                      <CheckCircle2 className="w-5 h-5 mt-0.5 text-green-400 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </GlassCard>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-gradient-to-b from-transparent via-purple-950/20 to-transparent">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/20 border border-cyan-500/30 mb-4">
              <Target className="w-4 h-4 text-cyan-400" />
              <span className="text-sm text-cyan-300">Development Roadmap</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold">
              <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                Building the Future of Trust
              </span>
            </h2>
          </motion.div>

          <div className="relative">
            <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-purple-500/50 via-cyan-500/50 to-pink-500/50 hidden md:block" />
            
            <div className="space-y-12">
              {ROADMAP_PHASES.map((phase, index) => (
                <motion.div
                  key={phase.phase}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className={`flex flex-col md:flex-row gap-8 ${
                    index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                  }`}
                >
                  <div className="flex-1" />
                  <div className="relative">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      phase.status === "active" 
                        ? "bg-gradient-to-r from-purple-500 to-pink-500" 
                        : "bg-white/10"
                    }`}>
                      {phase.status === "active" ? (
                        <Sparkles className="w-6 h-6 text-white" />
                      ) : (
                        <span className="text-white/50 font-bold">{index + 1}</span>
                      )}
                    </div>
                    {phase.status === "active" && (
                      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 blur-lg opacity-50 animate-pulse" />
                    )}
                  </div>
                  <div className="flex-1">
                    <GlassCard glow={phase.status === "active"}>
                      <div className="p-6">
                        <div className="flex items-center gap-3 mb-4">
                          <span className="text-sm font-medium text-purple-400">{phase.phase}</span>
                          <span className="text-sm text-muted-foreground">•</span>
                          <span className="text-sm text-muted-foreground">{phase.quarter}</span>
                          {phase.status === "active" && (
                            <span className="px-2 py-0.5 text-xs rounded-full bg-green-500/20 text-green-400 border border-green-500/30">
                              Active
                            </span>
                          )}
                        </div>
                        <h3 className="text-xl font-bold mb-4">{phase.title}</h3>
                        <ul className="space-y-2">
                          {phase.items.map((item, i) => (
                            <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                              <ChevronRight className="w-4 h-4 text-purple-400" />
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </GlassCard>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="membership" className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/20 border border-purple-500/30 mb-4">
              <Network className="w-4 h-4 text-purple-400" />
              <span className="text-sm text-purple-300">Join the Network</span>
              <span className="px-2 py-0.5 text-[10px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30 rounded uppercase">
                Beta
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
                Membership Tiers
              </span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
              Choose the membership that fits your needs. Every member receives a unique 
              Trust Number and downloadable Trust Card.
            </p>

            <div className="inline-flex items-center p-1 rounded-full bg-white/5 border border-white/10 mb-12">
              <button
                onClick={() => setActiveTab("business")}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                  activeTab === "business"
                    ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white"
                    : "text-muted-foreground hover:text-white"
                }`}
              >
                <Building2 className="w-4 h-4 inline mr-2" />
                Business
              </button>
              <button
                onClick={() => setActiveTab("individual")}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                  activeTab === "individual"
                    ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white"
                    : "text-muted-foreground hover:text-white"
                }`}
              >
                <User className="w-4 h-4 inline mr-2" />
                Individual
              </button>
            </div>
          </motion.div>

          <div className={`grid gap-6 ${activeTab === "business" ? "md:grid-cols-3" : "md:grid-cols-2 max-w-4xl mx-auto"}`}>
            {(activeTab === "business" ? BUSINESS_TIERS : INDIVIDUAL_TIERS).map((tier, index) => (
              <motion.div
                key={tier.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <GlassCard glow={tier.popular} className="h-full relative">
                  {tier.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-xs font-bold text-white">
                      Most Popular
                    </div>
                  )}
                  <div className="p-6 h-full flex flex-col">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${tier.gradient} flex items-center justify-center mb-4`}>
                      <tier.icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-xl font-bold mb-1">{tier.name}</h3>
                    <div className="text-2xl font-bold mb-2 bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">
                      {tier.price}
                    </div>
                    <p className="text-sm text-muted-foreground mb-6">{tier.description}</p>
                    
                    <ul className="space-y-3 mb-8 flex-1">
                      {tier.features.map((feature, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm">
                          <CheckCircle2 className="w-4 h-4 text-green-400 mt-0.5 shrink-0" />
                          <span className="text-white/80">{feature}</span>
                        </li>
                      ))}
                    </ul>

                    <Link href={isAuthenticated ? "/dashboard" : "/?login=true"}>
                      <Button 
                        className={`w-full ${
                          tier.popular 
                            ? "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500" 
                            : "bg-white/10 hover:bg-white/20"
                        }`}
                      >
                        {isAuthenticated ? "Get Started" : "Sign Up"}
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </Link>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-gradient-to-b from-transparent via-purple-950/20 to-transparent">
        <div className="container mx-auto max-w-4xl">
          <GlassCard glow>
            <div className="p-8 md:p-12 text-center">
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true }}
              >
                <img 
                  src={darkwaveLogo} 
                  alt="DarkWave" 
                  className="w-24 h-24 mx-auto mb-6 drop-shadow-2xl"
                />
                <h2 className="text-2xl md:text-3xl font-bold mb-4">
                  Ready to Build Trust?
                </h2>
                <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
                  Join thousands of businesses and individuals who are building the future 
                  of accountable commerce on the DarkWave Trust Layer.
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                  <Link href={isAuthenticated ? "/dashboard" : "/?login=true"}>
                    <Button size="lg" className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500">
                      <BadgeCheck className="w-5 h-5 mr-2" />
                      Get Your Trust Card
                    </Button>
                  </Link>
                  <Link href="/contact">
                    <Button size="lg" variant="outline" className="border-white/20 hover:bg-white/5">
                      Contact Sales
                    </Button>
                  </Link>
                </div>
                <div className="mt-8 p-4 rounded-lg bg-amber-500/10 border border-amber-500/20 max-w-2xl mx-auto">
                  <p className="text-xs text-amber-400/80 text-center leading-relaxed">
                    <strong>BETA DISCLAIMER:</strong> The DarkWave Trust Layer is currently in beta. 
                    All features and functionality are subject to change without notice. 
                    Do your own research (DYOR). Participation is at your own risk. 
                    Signal (SIG) is a Trust Network Access Token, not a speculative investment.
                  </p>
                </div>
              </motion.div>
            </div>
          </GlassCard>
        </div>
      </section>

      <Footer />
    </div>
  );
}