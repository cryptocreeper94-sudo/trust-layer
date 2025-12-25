import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "wouter";
import {
  ArrowRight, Zap, Shield, Globe, Code2, Rocket, Users, Building2,
  ChevronRight, ExternalLink, Mail, MapPin, Sparkles, Trophy,
  Layers, Database, Lock, Star, Github, Twitter, Linkedin
} from "lucide-react";
import { Footer } from "@/components/footer";
import { GlassCard } from "@/components/glass-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import darkwaveLogo from "@assets/generated_images/darkwave_token_transparent.png";

const PRODUCTS = [
  {
    name: "DarkWave Smart Chain",
    description: "Layer 1 blockchain with 400ms blocks and 200K+ TPS capacity",
    url: "https://dwsc.io",
    icon: Zap,
    color: "from-purple-500 to-pink-500",
    status: "Mainnet",
    stats: "50M+ transactions",
  },
  {
    name: "DarkWave Games",
    description: "Provably fair blockchain gaming platform with instant payouts",
    url: "https://darkwavegames.io",
    icon: Rocket,
    color: "from-pink-500 to-rose-500",
    status: "Live",
    stats: "10K+ daily players",
  },
  {
    name: "DarkWave Studio",
    description: "Cloud IDE for building and deploying on DarkWave Chain",
    url: "https://dwsc.io/studio",
    icon: Code2,
    color: "from-cyan-500 to-blue-500",
    status: "Live",
    stats: "5K+ projects",
  },
];

const FEATURES = [
  { icon: Zap, title: "400ms Finality", description: "Near-instant transaction confirmation" },
  { icon: Layers, title: "200K+ TPS", description: "Massive throughput capacity" },
  { icon: Shield, title: "Enterprise Security", description: "Battle-tested architecture" },
  { icon: Database, title: "Native Storage", description: "On-chain data persistence" },
  { icon: Lock, title: "Provable Fairness", description: "Verifiable randomness" },
  { icon: Globe, title: "Global Network", description: "Distributed validators" },
];

const STATS = [
  { label: "Total Transactions", value: "50M+", icon: Zap, color: "text-purple-400" },
  { label: "Active Developers", value: "10K+", icon: Code2, color: "text-cyan-400" },
  { label: "Countries", value: "120+", icon: Globe, color: "text-green-400" },
  { label: "Uptime", value: "99.99%", icon: Shield, color: "text-yellow-400" },
];

function SparkleEffect() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-cyan-400 rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            opacity: [0, 1, 0],
            scale: [0, 1.5, 0],
          }}
          transition={{
            duration: 2 + Math.random() * 2,
            repeat: Infinity,
            delay: Math.random() * 3,
          }}
        />
      ))}
    </div>
  );
}

export default function StudiosHome() {
  const [currentYear] = useState(new Date().getFullYear());

  return (
    <div className="min-h-screen flex flex-col bg-background overflow-x-hidden">
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-background/90 backdrop-blur-xl">
        <div className="container mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2 shrink-0">
            <motion.img 
              src={darkwaveLogo} 
              alt="DarkWave" 
              className="w-7 h-7"
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 6, repeat: Infinity }}
            />
            <span className="font-display font-bold text-lg tracking-tight">
              DarkWave <span className="text-cyan-400">Studios</span>
            </span>
          </div>
          <div className="flex items-center gap-2">
            <a href="https://dwsc.io" target="_blank" rel="noopener noreferrer">
              <Button size="sm" className="h-8 text-xs bg-gradient-to-r from-cyan-500 to-teal-500">
                Launch App <ExternalLink className="w-3 h-3 ml-1" />
              </Button>
            </a>
          </div>
        </div>
      </nav>

      <main className="flex-1 pt-14">
        <section className="relative py-20 md:py-32 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/20 via-teal-500/10 to-transparent" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(6,182,212,0.3),transparent_60%)]" />
          <SparkleEffect />
          
          <div className="container mx-auto px-4 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center max-w-4xl mx-auto"
            >
              <motion.div
                className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full bg-gradient-to-r from-cyan-500/20 to-teal-500/20 border border-cyan-500/30"
                animate={{ 
                  boxShadow: ["0 0 20px rgba(6,182,212,0.2)", "0 0 40px rgba(6,182,212,0.4)", "0 0 20px rgba(6,182,212,0.2)"],
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Building2 className="w-4 h-4 text-cyan-400" />
                <span className="text-sm font-medium text-cyan-400">DarkWave Studios, LLC</span>
              </motion.div>
              
              <h1 className="text-5xl md:text-7xl font-display font-bold mb-6 leading-tight">
                Building the{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-400 to-cyan-400">
                  Future
                </span>{" "}
                of Blockchain
              </h1>
              
              <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
                We create next-generation blockchain technology that's faster, more secure, and more accessible than anything before it.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a href="https://dwsc.io">
                  <Button size="lg" className="h-14 px-10 text-lg bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-600 hover:to-teal-600 shadow-lg shadow-cyan-500/25" data-testid="button-explore-chain">
                    Explore DarkWave Chain <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </a>
                <a href="https://dwsc.io/developers">
                  <Button size="lg" variant="outline" className="h-14 px-10 text-lg border-cyan-500/30 hover:bg-cyan-500/10" data-testid="button-for-developers">
                    <Code2 className="w-5 h-5 mr-2" />
                    For Developers
                  </Button>
                </a>
              </div>
            </motion.div>
          </div>
        </section>

        <section className="py-8 px-4">
          <div className="container mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
              {STATS.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <GlassCard className="p-4 text-center h-full hover:border-cyan-500/30 transition-colors">
                    <stat.icon className={`w-6 h-6 mx-auto mb-2 ${stat.color}`} />
                    <p className="text-2xl md:text-3xl font-bold font-mono">{stat.value}</p>
                    <p className="text-[10px] md:text-xs text-muted-foreground mt-1">{stat.label}</p>
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
              <h2 className="text-3xl md:text-4xl font-display font-bold mb-3">
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
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${product.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg`}>
                      <product.icon className="w-7 h-7 text-white" />
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-bold text-xl">{product.name}</h3>
                      <Badge variant="outline" className="text-[10px] text-green-400 border-green-500/30">
                        {product.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">{product.description}</p>
                    <p className="text-xs text-cyan-400">{product.stats}</p>
                    <div className="flex items-center text-sm text-cyan-400 mt-4 group-hover:translate-x-1 transition-transform">
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
              <h2 className="text-3xl md:text-4xl font-display font-bold mb-3">
                Why <span className="text-cyan-400">DarkWave</span>?
              </h2>
              <p className="text-muted-foreground">Enterprise-grade blockchain technology</p>
            </motion.div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {FEATURES.map((feature, i) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <GlassCard className="p-5 h-full text-center">
                    <feature.icon className="w-8 h-8 mx-auto mb-3 text-cyan-400" />
                    <h3 className="font-bold mb-1">{feature.title}</h3>
                    <p className="text-xs text-muted-foreground">{feature.description}</p>
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
              <h2 className="text-3xl md:text-4xl font-display font-bold mb-3">
                Leadership <span className="text-cyan-400">Team</span>
              </h2>
              <p className="text-muted-foreground">The minds behind DarkWave</p>
            </motion.div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
              {[
                { title: "Founder & CEO", role: "Vision & Strategy", initial: "C", color: "from-cyan-500 to-teal-500" },
                { title: "CTO", role: "Technical Architecture", initial: "T", color: "from-purple-500 to-pink-500" },
                { title: "Head of Product", role: "User Experience", initial: "P", color: "from-pink-500 to-rose-500" },
                { title: "Lead Engineer", role: "Core Development", initial: "E", color: "from-yellow-500 to-orange-500" },
              ].map((member, i) => (
                <motion.div
                  key={member.title}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <GlassCard className="p-5 text-center h-full">
                    <div className={`w-16 h-16 mx-auto mb-3 rounded-full bg-gradient-to-br ${member.color} flex items-center justify-center shadow-lg`}>
                      <span className="text-2xl font-bold text-white">{member.initial}</span>
                    </div>
                    <p className="font-bold text-sm">{member.title}</p>
                    <p className="text-xs text-muted-foreground">{member.role}</p>
                  </GlassCard>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 px-4">
          <div className="container mx-auto max-w-4xl">
            <GlassCard glow className="p-8 md:p-12 text-center bg-gradient-to-br from-cyan-500/10 via-transparent to-teal-500/10 border-cyan-500/20">
              <Sparkles className="w-10 h-10 mx-auto mb-4 text-cyan-400" />
              <h2 className="text-2xl md:text-3xl font-display font-bold mb-4">
                Ready to Build on DarkWave?
              </h2>
              <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
                Join thousands of developers building the next generation of decentralized applications.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
                <a href="https://dwsc.io/developers">
                  <Button size="lg" className="h-12 px-8 bg-gradient-to-r from-cyan-500 to-teal-500">
                    <Code2 className="w-5 h-5 mr-2" />
                    Start Building
                  </Button>
                </a>
                <a href="mailto:hello@darkwavestudios.io">
                  <Button size="lg" variant="outline" className="h-12 px-8 border-cyan-500/30">
                    <Mail className="w-5 h-5 mr-2" />
                    Contact Us
                  </Button>
                </a>
              </div>

              <div className="flex items-center justify-center gap-4">
                <a href="#" className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                  <Twitter className="w-5 h-5 text-muted-foreground hover:text-cyan-400" />
                </a>
                <a href="#" className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                  <Github className="w-5 h-5 text-muted-foreground hover:text-cyan-400" />
                </a>
                <a href="#" className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                  <Linkedin className="w-5 h-5 text-muted-foreground hover:text-cyan-400" />
                </a>
              </div>
            </GlassCard>
          </div>
        </section>

        <section className="py-8 px-4 border-t border-white/5">
          <div className="container mx-auto">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <img src={darkwaveLogo} alt="DarkWave" className="w-5 h-5" />
                <span>© {currentYear} DarkWave Studios, LLC. All rights reserved.</span>
              </div>
              <div className="flex items-center gap-4">
                <Link href="/terms" className="hover:text-cyan-400 transition-colors">Terms</Link>
                <Link href="/privacy" className="hover:text-cyan-400 transition-colors">Privacy</Link>
                <a href="mailto:hello@darkwavestudios.io" className="hover:text-cyan-400 transition-colors">Contact</a>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
