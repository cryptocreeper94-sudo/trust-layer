import { motion } from "framer-motion";
import { Link } from "wouter";
import { ArrowRight, Code, Globe, Layers, Shield, Zap, Cpu, Network, Database } from "lucide-react";
import heroBg from "@assets/generated_images/abstract_blockchain_network_nodes_connecting_in_dark_space.png";
import orbitLogo from "@assets/generated_images/futuristic_abstract_geometric_logo_symbol_for_orbit.png";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden selection:bg-primary/20 selection:text-primary">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-md">
        <div className="container mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={orbitLogo} alt="Orbit Logo" className="w-10 h-10 animate-pulse-slow" />
            <span className="font-display font-bold text-2xl tracking-tight">Orbit</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
            <Link href="/ecosystem" className="hover:text-primary transition-colors cursor-pointer">Ecosystem</Link>
            <Link href="/token" className="hover:text-primary transition-colors cursor-pointer">Token</Link>
            <Link href="/developers" className="hover:text-primary transition-colors cursor-pointer">Developers</Link>
            <a href="#governance" className="hover:text-primary transition-colors">Governance</a>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" className="hidden sm:flex hover:bg-white/5 hover:text-white">Log In</Button>
            <Button className="bg-primary text-background hover:bg-primary/90 font-semibold shadow-[0_0_20px_rgba(0,255,255,0.3)]">
              Launch App
            </Button>
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
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-cyan-400 to-secondary text-glow">Orbit Ecosystem</span>
            </h1>

            <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              A universal ledger for the next web. Scalable, secure, and built to power the next generation of decentralized applications.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
              <Button size="lg" className="h-14 px-8 text-lg bg-primary text-background hover:bg-primary/90 font-bold rounded-full shadow-[0_0_30px_rgba(0,255,255,0.4)] transition-all hover:scale-105">
                Start Building <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button size="lg" variant="outline" className="h-14 px-8 text-lg border-white/20 hover:bg-white/5 rounded-full transition-all hover:border-white/40">
                Read Whitepaper
              </Button>
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
            <StatCard value="200K+" label="TPS Throughput" />
            <StatCard value="0.4s" label="Finality Time" />
            <StatCard value="$0.0001" label="Avg Cost" />
            <StatCard value="150+" label="Active Nodes" />
          </div>
        </div>
      </section>

      {/* About / "Why Orbit" */}
      <section id="features" className="py-32 relative">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row gap-16 items-center">
            <div className="w-full md:w-1/2 space-y-8">
              <h2 className="text-4xl md:text-5xl font-display font-bold">
                The Universal Ledger <br/>
                <span className="text-primary">For Everything.</span>
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Most blockchains are isolated islands. Orbit is a connected continent. 
                Built on the revolutionary AA Blockchain architecture, Orbit integrates seamless interoperability 
                directly into the consensus layer.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Whether you're building financial tools, social graphs, or gaming economies, 
                Orbit provides the shared state machine that powers it all.
              </p>
              
              <ul className="space-y-4 pt-4">
                <FeatureItem icon={Zap} title="Instant Consensus" desc="Using advanced DAG protocols for sub-second finality." />
                <FeatureItem icon={Shield} title="Quantum Secure" desc="Future-proof cryptography built for the next 50 years." />
                <FeatureItem icon={Layers} title="Native Interop" desc="Connect to Ethereum, Solana, and more without bridges." />
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
                    <p>{`> Connecting to Orbit Mainnet...`}</p>
                    <p>{`> Synchronizing ledger state... OK`}</p>
                    <p>{`> Verifying Proof of History... OK`}</p>
                    <p>{`> Established connection to 152 peers.`}</p>
                    <p className="animate-pulse">{`> Awaiting transaction block #89210...`}</p>
                  </div>
                  <div className="mt-8 pt-8 border-t border-white/10 grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-lg bg-white/5">
                      <div className="text-xs text-muted-foreground mb-1 uppercase tracking-wider">Current Block</div>
                      <div className="text-2xl font-bold font-display text-white">#8,921,042</div>
                    </div>
                    <div className="p-4 rounded-lg bg-white/5">
                      <div className="text-xs text-muted-foreground mb-1 uppercase tracking-wider">Network Hash</div>
                      <div className="text-2xl font-bold font-display text-white">42.8 EH/s</div>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Ecosystem Apps Grid */}
      <section className="py-32 bg-secondary/5">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-4xl md:text-5xl font-display font-bold mb-6">Built on Orbit</h2>
            <p className="text-xl text-muted-foreground">
              A thriving ecosystem of decentralized applications. From DeFi to Social, 
              everything lives on the same ledger.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            <AppCard 
              name="Nova DEX" 
              category="DeFi" 
              desc="Instant swaps with zero slippage." 
              gradient="from-blue-500 to-cyan-500" 
            />
            <AppCard 
              name="Orbit ID" 
              category="Identity" 
              desc="Your universal passport for the web." 
              gradient="from-purple-500 to-pink-500" 
            />
            <AppCard 
              name="Flux Market" 
              category="NFTs" 
              desc="Trade digital assets with ease." 
              gradient="from-orange-500 to-red-500" 
            />
            <AppCard 
              name="Nebula" 
              category="Social" 
              desc="Decentralized social graph protocol." 
              gradient="from-green-400 to-emerald-600" 
            />
            <AppCard 
              name="Aether" 
              category="Gaming" 
              desc="Play-to-earn metaverse engine." 
              gradient="from-indigo-500 to-violet-500" 
            />
            <AppCard 
              name="Vault" 
              category="Security" 
              desc="Multi-sig institutional custody." 
              gradient="from-slate-500 to-slate-700" 
            />
            <AppCard 
              name="Pulse" 
              category="Analytics" 
              desc="Real-time on-chain data streams." 
              gradient="from-pink-500 to-rose-500" 
            />
            <div className="group relative rounded-xl border-2 border-dashed border-white/10 bg-transparent flex flex-col items-center justify-center p-8 hover:border-primary/50 transition-colors cursor-pointer">
              <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <Code className="w-6 h-6 text-muted-foreground group-hover:text-primary" />
              </div>
              <h3 className="text-lg font-bold text-muted-foreground group-hover:text-primary">Build Your App</h3>
              <p className="text-sm text-center text-muted-foreground/60 mt-2">Join the ecosystem</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-primary/5"></div>
        <div className="container mx-auto px-6 relative z-10 text-center">
          <h2 className="text-5xl md:text-7xl font-display font-bold mb-8">Ready to Launch?</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-12">
            Join thousands of developers building the future of finance, gaming, and social on Orbit.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Button size="lg" className="h-16 px-12 text-xl bg-primary text-background hover:bg-primary/90 font-bold rounded-full shadow-lg hover:shadow-cyan-500/20 transition-all">
              Start Building Now
            </Button>
            <Button size="lg" variant="ghost" className="h-16 px-12 text-xl hover:bg-white/5 rounded-full">
              Explore Documentation
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black py-20 border-t border-white/10">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-12 mb-16">
            <div className="col-span-2 lg:col-span-2">
              <div className="flex items-center gap-3 mb-6">
                <img src={orbitLogo} alt="Orbit Logo" className="w-8 h-8 opacity-80" />
                <span className="font-display font-bold text-xl tracking-tight">Orbit</span>
              </div>
              <p className="text-muted-foreground text-sm leading-relaxed max-w-xs">
                The AA Blockchain Foundation. <br/>
                Building the decentralized web, one block at a time.
              </p>
            </div>
            
            <div>
              <h4 className="font-bold text-white mb-6">Ecosystem</h4>
              <ul className="space-y-4 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-primary">Apps</a></li>
                <li><a href="#" className="hover:text-primary">Wallets</a></li>
                <li><a href="#" className="hover:text-primary">Explorers</a></li>
                <li><a href="#" className="hover:text-primary">Exchanges</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold text-white mb-6">Developers</h4>
              <ul className="space-y-4 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-primary">Documentation</a></li>
                <li><a href="#" className="hover:text-primary">GitHub</a></li>
                <li><a href="#" className="hover:text-primary">Whitepaper</a></li>
                <li><a href="#" className="hover:text-primary">Grants</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-white mb-6">Community</h4>
              <ul className="space-y-4 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-primary">Discord</a></li>
                <li><a href="#" className="hover:text-primary">Twitter</a></li>
                <li><a href="#" className="hover:text-primary">Blog</a></li>
                <li><a href="#" className="hover:text-primary">Forum</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-white mb-6">Legal</h4>
              <ul className="space-y-4 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-primary">Privacy</a></li>
                <li><a href="#" className="hover:text-primary">Terms</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-xs text-muted-foreground">© 2025 Orbit Foundation. All rights reserved.</p>
            <div className="flex gap-6">
              <Globe className="w-5 h-5 text-muted-foreground hover:text-white cursor-pointer" />
              <div className="w-5 h-5 rounded-full bg-muted-foreground/20 hover:bg-white cursor-pointer" />
              <div className="w-5 h-5 rounded-full bg-muted-foreground/20 hover:bg-white cursor-pointer" />
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

function StatCard({ value, label }: { value: string, label: string }) {
  return (
    <div className="text-center group hover:-translate-y-1 transition-transform duration-300">
      <div className="text-4xl md:text-5xl font-display font-bold text-white mb-2 group-hover:text-primary transition-colors">
        {value}
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

function AppCard({ name, category, desc, gradient }: { name: string, category: string, desc: string, gradient: string }) {
  return (
    <div className="group relative p-[1px] rounded-xl bg-gradient-to-b from-white/10 to-transparent hover:from-primary/50 hover:to-secondary/50 transition-all duration-300">
      <div className="relative h-full bg-black/40 backdrop-blur-xl rounded-xl p-6 hover:bg-black/60 transition-all">
        <div className={`w-12 h-12 rounded-lg mb-6 bg-gradient-to-br ${gradient} flex items-center justify-center text-white font-bold text-xl shadow-lg`}>
          {name.charAt(0)}
        </div>
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-bold text-xl text-white group-hover:text-primary transition-colors">{name}</h3>
          <Badge variant="secondary" className="text-[10px] uppercase tracking-wider bg-white/10 text-white/70 hover:bg-white/20">
            {category}
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed mb-4">
          {desc}
        </p>
        <div className="flex items-center text-primary text-xs font-bold uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-2 group-hover:translate-y-0">
          Launch App <ArrowRight className="w-3 h-3 ml-1" />
        </div>
      </div>
    </div>
  );
}
