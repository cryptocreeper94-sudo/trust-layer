import { motion } from "framer-motion";
import { Link } from "wouter";
import {
  ArrowRight, Zap, Shield, Globe, Code2, Rocket, Users, Building2,
  ChevronRight, ExternalLink, Mail, MapPin, Phone
} from "lucide-react";
import { Footer } from "@/components/footer";
import { GlassCard } from "@/components/glass-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import darkwaveLogo from "@assets/generated_images/darkwave_token_transparent.png";

const PRODUCTS = [
  {
    name: "DarkWave Smart Chain",
    description: "Layer 1 blockchain with 400ms blocks and 200K+ TPS",
    url: "https://dwsc.io",
    icon: Zap,
    color: "from-purple-500 to-pink-500",
    status: "Live",
  },
  {
    name: "DarkWave Games",
    description: "Provably fair blockchain gaming platform",
    url: "https://darkwavegames.io",
    icon: Rocket,
    color: "from-pink-500 to-rose-500",
    status: "Live",
  },
  {
    name: "DarkWave Studio",
    description: "Cloud IDE for building on DarkWave Chain",
    url: "https://dwsc.io/studio",
    icon: Code2,
    color: "from-cyan-500 to-blue-500",
    status: "Live",
  },
];

const STATS = [
  { label: "Transactions Processed", value: "50M+", icon: Zap },
  { label: "Active Developers", value: "10K+", icon: Code2 },
  { label: "Countries Reached", value: "120+", icon: Globe },
  { label: "Uptime", value: "99.99%", icon: Shield },
];

const TEAM = [
  { name: "Founder & CEO", role: "Vision & Strategy", initial: "C" },
  { name: "CTO", role: "Technical Architecture", initial: "T" },
  { name: "Head of Product", role: "User Experience", initial: "P" },
  { name: "Lead Engineer", role: "Core Development", initial: "E" },
];

export default function StudiosHome() {
  return (
    <div className="min-h-screen flex flex-col bg-background overflow-x-hidden">
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-background/90 backdrop-blur-xl">
        <div className="container mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2 shrink-0">
            <img src={darkwaveLogo} alt="DarkWave" className="w-7 h-7" />
            <span className="font-display font-bold text-lg tracking-tight">
              DarkWave <span className="text-cyan-400">Studios</span>
            </span>
          </div>
          <div className="flex items-center gap-2">
            <a href="https://dwsc.io" target="_blank" rel="noopener noreferrer">
              <Button variant="outline" size="sm" className="h-8 text-xs">
                Visit DWSC <ExternalLink className="w-3 h-3 ml-1" />
              </Button>
            </a>
          </div>
        </div>
      </nav>

      <main className="flex-1 pt-14">
        <section className="relative py-20 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/10 via-transparent to-transparent" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(6,182,212,0.1),transparent_70%)]" />
          
          <div className="container mx-auto px-4 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center max-w-3xl mx-auto"
            >
              <Badge className="mb-4 bg-cyan-500/20 text-cyan-400 border-cyan-500/30">
                <Building2 className="w-3 h-3 mr-1" />
                DarkWave Studios, LLC
              </Badge>
              
              <h1 className="text-4xl md:text-6xl font-display font-bold mb-6 leading-tight">
                Building the <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-teal-400">Future</span> of Blockchain
              </h1>
              
              <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto">
                We create next-generation blockchain technology that's faster, more secure, and more accessible than anything before it.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <a href="https://dwsc.io">
                  <Button size="lg" className="bg-gradient-to-r from-cyan-500 to-teal-500 text-white h-12 px-8" data-testid="button-explore-chain">
                    Explore DarkWave Chain <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </a>
                <Link href="/about">
                  <Button size="lg" variant="outline" className="h-12 px-8" data-testid="button-about-us">
                    About Us
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </section>

        <section className="py-16 px-4">
          <div className="container mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {STATS.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <GlassCard className="p-4 text-center h-full">
                    <stat.icon className="w-6 h-6 mx-auto mb-2 text-cyan-400" />
                    <p className="text-2xl md:text-3xl font-bold font-mono">{stat.value}</p>
                    <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
                  </GlassCard>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 px-4 bg-white/[0.02]">
          <div className="container mx-auto">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              className="text-center mb-10"
            >
              <h2 className="text-2xl md:text-3xl font-display font-bold mb-3">
                Our <span className="text-cyan-400">Products</span>
              </h2>
              <p className="text-muted-foreground">The DarkWave ecosystem</p>
            </motion.div>
            
            <div className="grid md:grid-cols-3 gap-4">
              {PRODUCTS.map((product, i) => (
                <motion.a
                  key={product.name}
                  href={product.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="block"
                >
                  <GlassCard hover glow className="p-6 h-full group cursor-pointer">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${product.color} flex items-center justify-center mb-4`}>
                      <product.icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-bold text-lg">{product.name}</h3>
                      <Badge variant="outline" className="text-[10px] text-green-400 border-green-500/30">
                        {product.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-4">{product.description}</p>
                    <div className="flex items-center text-sm text-cyan-400 group-hover:translate-x-1 transition-transform">
                      Learn more <ChevronRight className="w-4 h-4 ml-1" />
                    </div>
                  </GlassCard>
                </motion.a>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 px-4">
          <div className="container mx-auto">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              className="text-center mb-10"
            >
              <h2 className="text-2xl md:text-3xl font-display font-bold mb-3">
                Leadership <span className="text-cyan-400">Team</span>
              </h2>
              <p className="text-muted-foreground">The minds behind DarkWave</p>
            </motion.div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {TEAM.map((member, i) => (
                <motion.div
                  key={member.name}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <GlassCard className="p-4 text-center h-full">
                    <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-gradient-to-br from-cyan-500/20 to-teal-500/20 border border-cyan-500/30 flex items-center justify-center">
                      <span className="text-2xl font-bold text-cyan-400">{member.initial}</span>
                    </div>
                    <p className="font-bold text-sm">{member.name}</p>
                    <p className="text-xs text-muted-foreground">{member.role}</p>
                  </GlassCard>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 px-4 bg-gradient-to-b from-transparent to-cyan-500/5">
          <div className="container mx-auto max-w-2xl">
            <GlassCard glow className="p-8 text-center">
              <h2 className="text-2xl font-display font-bold mb-3">
                Get in Touch
              </h2>
              <p className="text-muted-foreground mb-6">
                Have questions about DarkWave? We'd love to hear from you.
              </p>
              
              <div className="grid sm:grid-cols-3 gap-4 mb-6">
                <div className="p-3 rounded-lg bg-white/5">
                  <Mail className="w-5 h-5 mx-auto mb-2 text-cyan-400" />
                  <p className="text-xs text-muted-foreground">Email</p>
                  <p className="text-sm font-medium">hello@darkwavestudios.io</p>
                </div>
                <div className="p-3 rounded-lg bg-white/5">
                  <MapPin className="w-5 h-5 mx-auto mb-2 text-cyan-400" />
                  <p className="text-xs text-muted-foreground">Location</p>
                  <p className="text-sm font-medium">United States</p>
                </div>
                <div className="p-3 rounded-lg bg-white/5">
                  <Users className="w-5 h-5 mx-auto mb-2 text-cyan-400" />
                  <p className="text-xs text-muted-foreground">Community</p>
                  <p className="text-sm font-medium">Join Discord</p>
                </div>
              </div>
              
              <Button className="bg-gradient-to-r from-cyan-500 to-teal-500" data-testid="button-contact">
                <Mail className="w-4 h-4 mr-2" />
                Contact Us
              </Button>
            </GlassCard>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
