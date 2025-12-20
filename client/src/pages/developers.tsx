import { motion } from "framer-motion";
import { ArrowLeft, Box, Check, ChevronRight, Code, Cpu, Database, FileCode, Layers, Terminal, Zap } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import dagViz from "@assets/generated_images/abstract_visualization_of_directed_acyclic_graph_blockchain_consensus.png";

export default function Developers() {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden selection:bg-primary/20 selection:text-primary">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-md">
        <div className="container mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/">
            <div className="flex items-center gap-2 text-muted-foreground hover:text-white transition-colors cursor-pointer group">
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              <span className="font-display font-medium">Back to Orbit</span>
            </div>
          </Link>
          <div className="flex items-center gap-4">
            <Badge variant="outline" className="border-primary/20 text-primary bg-primary/5 font-mono">v1.0.0-beta</Badge>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 relative overflow-hidden">
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-6xl font-display font-bold mb-6">
              Build the Future <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-cyan-400 to-secondary text-glow">On the Orbit Chain</span>
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed mb-8">
              Orbit combines the speed of a DAG with the security of Proof-of-History. 
              Write in Rust, deploy with one click, and scale to millions of users.
            </p>
            <div className="flex gap-4">
              <Button size="lg" className="bg-primary text-background hover:bg-primary/90 font-bold">
                <Terminal className="w-5 h-5 mr-2" /> Get Started
              </Button>
              <Button size="lg" variant="outline" className="border-white/20 hover:bg-white/5">
                <FileCode className="w-5 h-5 mr-2" /> Read Docs
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Grid */}
      <section className="py-20 bg-secondary/5 border-t border-white/5">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            
            {/* Left Column: Explanation */}
            <div className="space-y-16">
              
              {/* Architecture Section */}
              <div className="space-y-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 rounded-lg bg-primary/10 text-primary">
                    <Layers className="w-6 h-6" />
                  </div>
                  <h2 className="text-2xl font-bold font-display">Hybrid Consensus Architecture</h2>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  You asked: <span className="text-white italic">"Is it just using nodes throughout the internet?"</span>
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  Yes, but with a twist. Unlike traditional blockchains that process blocks one by one (like a single-lane highway), 
                  Orbit uses a <strong className="text-primary">Directed Acyclic Graph (DAG)</strong> structure. 
                  This means nodes can process multiple transactions simultaneously without waiting for the previous block to finish.
                </p>
                <div className="p-4 rounded-xl border border-white/10 bg-black/20 backdrop-blur-sm">
                  <h4 className="text-sm font-bold text-white mb-4 uppercase tracking-wider">Comparison</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Traditional Chain (Ethereum)</span>
                      <span className="text-red-400">Sequential (Slower)</span>
                    </div>
                    <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                      <div className="w-1/3 h-full bg-red-500/50"></div>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm mt-4">
                      <span className="text-muted-foreground">Orbit Chain (DAG)</span>
                      <span className="text-primary">Parallel (Instant)</span>
                    </div>
                    <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                      <div className="w-full h-full bg-primary shadow-[0_0_10px_var(--color-primary)]"></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Language Section */}
              <div className="space-y-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 rounded-lg bg-secondary/10 text-secondary">
                    <Code className="w-6 h-6" />
                  </div>
                  <h2 className="text-2xl font-bold font-display">Development Stack</h2>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  <span className="text-white italic">"Do they use Rust?"</span> — <strong>Yes.</strong>
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  We chose <strong>Rust</strong> as the primary language for Orbit smart contracts (called "Starships"). 
                  It offers memory safety and incredible performance. However, because we use WebAssembly (WASM), 
                  developers can also write in C++, Go, or even TypeScript soon.
                </p>
                <ul className="grid grid-cols-2 gap-4">
                  <li className="flex items-center gap-2 text-sm text-white">
                    <Check className="w-4 h-4 text-green-500" /> Rust (Native Speed)
                  </li>
                  <li className="flex items-center gap-2 text-sm text-white">
                    <Check className="w-4 h-4 text-green-500" /> WebAssembly Support
                  </li>
                  <li className="flex items-center gap-2 text-sm text-white">
                    <Check className="w-4 h-4 text-green-500" /> TypeScript SDK
                  </li>
                  <li className="flex items-center gap-2 text-sm text-white">
                    <Check className="w-4 h-4 text-green-500" /> EVM Compatibility Layer
                  </li>
                </ul>
              </div>

              {/* Token Standard */}
              <div className="space-y-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 rounded-lg bg-accent/10 text-accent">
                    <Cpu className="w-6 h-6" />
                  </div>
                  <h2 className="text-2xl font-bold font-display">The ORB-Standard</h2>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  <span className="text-white italic">"What makes it unique?"</span>
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  Ethereum has ERC-20. Solana has SPL. Orbit introduces the <strong>ORB-Standard</strong>. 
                  Unlike others, ORB tokens have "Metadata extensions" built-in at the protocol level. 
                  This means your NFTs and Tokens can carry complex data (like game stats or identity info) without needing extra smart contracts.
                </p>
              </div>

            </div>

            {/* Right Column: Visuals & Code */}
            <div className="space-y-8">
              
              {/* Visual Representation of Consensus */}
              <Card className="bg-black/40 border-white/10 overflow-hidden backdrop-blur-xl border-glow">
                <div className="p-4 border-b border-white/10 flex items-center justify-between">
                  <div className="text-xs font-mono text-muted-foreground uppercase tracking-wider">
                    Live Consensus Visualization
                  </div>
                  <div className="flex gap-2">
                    <div className="w-2 h-2 rounded-full bg-red-500" />
                    <div className="w-2 h-2 rounded-full bg-yellow-500" />
                    <div className="w-2 h-2 rounded-full bg-green-500" />
                  </div>
                </div>
                <div className="relative aspect-video">
                  <img src={dagViz} alt="DAG Visualization" className="w-full h-full object-cover opacity-80" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-6">
                    <div className="font-mono text-xs text-primary space-y-1">
                      <div>{`> Block #89210 confirmed via PoH`}</div>
                      <div>{`> 420 transactions finalized in 0.4s`}</div>
                      <div>{`> Node propagation complete`}</div>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Code Editor Mockup */}
              <Card className="bg-[#1e1e1e] border-white/10 overflow-hidden shadow-2xl">
                <div className="flex items-center justify-between px-4 py-3 bg-[#252526] border-b border-white/5">
                  <span className="text-sm text-white/60 font-mono">starship.rs</span>
                  <Badge variant="secondary" className="bg-primary/20 text-primary text-[10px] hover:bg-primary/20">Rust</Badge>
                </div>
                <div className="p-4 overflow-x-auto">
                  <pre className="font-mono text-sm leading-relaxed">
                    <code className="language-rust">
                      <span className="text-purple-400">use</span> orbit_sdk::prelude::*;<br/><br/>
                      <span className="text-gray-500">/// Define a new Token on Orbit</span><br/>
                      <span className="text-blue-400">pub struct</span> <span className="text-yellow-300">OrbitToken</span> {'{'}<br/>
                      {'    '}<span className="text-red-400">pub</span> supply: <span className="text-blue-400">u64</span>,<br/>
                      {'    '}<span className="text-red-400">pub</span> owner: <span className="text-blue-400">Address</span>,<br/>
                      {'}'}<br/><br/>
                      <span className="text-purple-400">impl</span> <span className="text-yellow-300">Starship</span> <span className="text-purple-400">for</span> <span className="text-yellow-300">OrbitToken</span> {'{'}<br/>
                      {'    '}<span className="text-gray-500">// Instant transfer function</span><br/>
                      {'    '}<span className="text-blue-400">fn</span> <span className="text-yellow-300">transfer</span>(&self, to: <span className="text-blue-400">Address</span>) {'{'}<br/>
                      {'        '}ctx.send(to, self.amount);<br/>
                      {'    '}{'}'}<br/>
                      {'}'}
                    </code>
                  </pre>
                </div>
              </Card>

              <div className="p-6 rounded-xl bg-gradient-to-br from-primary/10 to-secondary/10 border border-white/10">
                <h3 className="text-lg font-bold text-white mb-2">Why is it faster than Ethereum?</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Ethereum 1.0 processes about 15-30 transactions per second (TPS). 
                  Orbit uses a "Gossip Protocol" where nodes talk to each other constantly, 
                  allowing us to reach <strong>50,000+ TPS</strong>. It's like upgrading from dial-up to Fiber Optic.
                </p>
                <Link href="/">
                  <Button variant="link" className="text-primary p-0 h-auto font-bold">
                    Learn about Consensus <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </Link>
              </div>

            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
