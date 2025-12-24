import { motion } from "framer-motion";
import { ArrowLeft, Box, Check, Code, Cpu, Database, FileCode, Layers, Terminal, BookOpen, Play } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import dagViz from "@assets/generated_images/abstract_visualization_of_directed_acyclic_graph_blockchain_consensus.png";
import orbitLogo from "@assets/generated_images/futuristic_abstract_geometric_logo_symbol_for_orbit.png";
import { Footer } from "@/components/footer";
import { usePageAnalytics } from "@/hooks/use-analytics";
import { GlassCard } from "@/components/glass-card";
import { InfoTooltip } from "@/components/info-tooltip";

export default function Developers() {
  usePageAnalytics();
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden selection:bg-primary/20 selection:text-primary">
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-background/90 backdrop-blur-xl">
        <div className="container mx-auto px-4 h-14 flex items-center">
          <Link href="/" className="flex items-center gap-2 mr-auto shrink-0">
            <img src={orbitLogo} alt="DarkWave" className="w-7 h-7" />
            <span className="font-display font-bold text-lg tracking-tight hidden sm:inline">DarkWave</span>
          </Link>
          <div className="flex items-center gap-1 sm:gap-2">
            <Link href="/api-playground">
              <Button variant="outline" size="sm" className="h-7 sm:h-8 text-[10px] sm:text-xs px-2 sm:px-3 border-green-500/30 hover:bg-green-500/10 text-green-400" data-testid="button-api-playground">
                <Play className="w-3 h-3 sm:mr-1.5" /> <span className="hidden sm:inline">API Playground</span>
              </Button>
            </Link>
            <Link href="/doc-hub">
              <Button variant="outline" size="sm" className="h-7 sm:h-8 text-[10px] sm:text-xs px-2 sm:px-3 border-primary/30 hover:bg-primary/10 text-primary" data-testid="button-doc-hub">
                <BookOpen className="w-3 h-3 sm:mr-1.5" /> <span className="hidden sm:inline">Doc Hub</span>
              </Button>
            </Link>
            <Badge variant="outline" className="hidden md:flex border-primary/20 text-primary bg-primary/5 font-mono text-[10px]">v1.0.0-beta</Badge>
            <Link href="/">
              <Button variant="ghost" size="sm" className="h-7 sm:h-8 text-[10px] sm:text-xs gap-1 sm:gap-1.5 hover:bg-white/5 px-2 sm:px-3">
                <ArrowLeft className="w-3 h-3" />
                <span className="hidden sm:inline">Back</span>
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      <section className="pt-20 pb-10 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="max-w-2xl">
            <h1 className="text-3xl md:text-4xl font-display font-bold mb-4">
              Build the Future <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-cyan-400 to-secondary">On DarkWave Smart Chain</span>
            </h1>
            <p className="text-sm text-muted-foreground leading-relaxed mb-6">
              DarkWave combines the speed of a DAG with the security of Proof-of-History. 
              Write in Rust, deploy with one click, and scale to millions of users.
            </p>
            <div className="flex gap-3">
              <Link href="/developers/register">
                <Button size="sm" className="h-10 bg-primary text-background hover:bg-primary/90 font-bold" data-testid="button-get-started">
                  <Terminal className="w-4 h-4 mr-2" /> Get API Key
                </Button>
              </Link>
              <Link href="/doc-hub">
                <Button size="sm" variant="outline" className="h-10 border-white/20 hover:bg-white/5" data-testid="button-read-docs">
                  <FileCode className="w-4 h-4 mr-2" /> Read Docs
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-10 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <GlassCard>
                <div className="p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="p-1.5 rounded-lg bg-primary/20 text-primary">
                      <Layers className="w-4 h-4" />
                    </div>
                    <h2 className="text-sm font-bold">Hybrid Consensus Architecture</h2>
                    <InfoTooltip content="DarkWave combines DAG (for speed) with Proof-of-History (for ordering) to achieve both high throughput and security." label="Hybrid consensus info" />
                  </div>
                  <p className="text-[11px] text-white/50 leading-relaxed mb-3">
                    Unlike traditional blockchains that process blocks sequentially, DarkWave uses a 
                    <strong className="text-primary"> Directed Acyclic Graph (DAG)</strong> structure for parallel transaction processing.
                  </p>
                  <div className="p-3 rounded-lg bg-black/30 border border-white/5">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-[10px]">
                        <span className="text-white/50">Traditional Chain</span>
                        <span className="text-red-400">Sequential</span>
                      </div>
                      <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                        <div className="w-1/3 h-full bg-red-500/50" />
                      </div>
                      <div className="flex items-center justify-between text-[10px] mt-3">
                        <span className="text-white/50">DarkWave (DAG)</span>
                        <span className="text-primary">Parallel</span>
                      </div>
                      <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                        <div className="w-full h-full bg-primary" />
                      </div>
                    </div>
                  </div>
                </div>
              </GlassCard>

              <GlassCard>
                <div className="p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="p-1.5 rounded-lg bg-secondary/20 text-secondary">
                      <Code className="w-4 h-4" />
                    </div>
                    <h2 className="text-sm font-bold">Development Stack</h2>
                    <InfoTooltip content="Choose your preferred language. Rust offers best performance, while TypeScript SDK makes web development easy." label="Development stack info" />
                  </div>
                  <p className="text-[11px] text-white/50 leading-relaxed mb-3">
                    <strong>Rust</strong> is the primary language for DarkWave smart contracts ("Starships"). 
                    WebAssembly (WASM) support enables C++, Go, or TypeScript development.
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    {["Rust (Native)", "WebAssembly", "TypeScript SDK", "EVM Compatibility"].map((item, i) => (
                      <div key={i} className="flex items-center gap-2 text-[10px] text-white">
                        <Check className="w-3 h-3 text-green-500" /> {item}
                      </div>
                    ))}
                  </div>
                </div>
              </GlassCard>

              <GlassCard>
                <div className="p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="p-1.5 rounded-lg bg-purple-500/20 text-purple-400">
                      <Cpu className="w-4 h-4" />
                    </div>
                    <h2 className="text-sm font-bold">DarkWave Studios Hub</h2>
                  </div>
                  <p className="text-[11px] text-white/50 leading-relaxed mb-3">
                    Your mission control. Collaborate on smart contracts, fork dApps, and deploy instantly.
                  </p>
                  <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[10px] font-mono text-white/40 uppercase">Hub Status</span>
                      <div className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                        <span className="text-[10px] font-bold text-green-500">Connected</span>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <Button variant="outline" size="sm" className="h-8 text-[10px] border-white/10 hover:border-primary/50 justify-start">
                        <Box className="w-3 h-3 mr-1.5" /> My Projects
                      </Button>
                      <Button variant="outline" size="sm" className="h-8 text-[10px] border-white/10 hover:border-secondary/50 justify-start">
                        <Database className="w-3 h-3 mr-1.5" /> Shared Data
                      </Button>
                    </div>
                  </div>
                </div>
              </GlassCard>
            </div>

            <div className="space-y-4">
              <GlassCard glow>
                <div className="overflow-hidden rounded-xl">
                  <div className="p-3 border-b border-white/5 flex items-center justify-between">
                    <span className="text-[10px] font-mono text-white/40 uppercase">Live Consensus</span>
                    <div className="flex gap-1">
                      <div className="w-2 h-2 rounded-full bg-red-500" />
                      <div className="w-2 h-2 rounded-full bg-yellow-500" />
                      <div className="w-2 h-2 rounded-full bg-green-500" />
                    </div>
                  </div>
                  <div className="relative aspect-video">
                    <img src={dagViz} alt="DAG" className="w-full h-full object-cover opacity-80" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-4">
                      <div className="font-mono text-[10px] text-primary space-y-0.5">
                        <div>{`> Block #89210 confirmed via PoH`}</div>
                        <div>{`> 420 txs finalized in 0.4s`}</div>
                        <div>{`> Node propagation complete`}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </GlassCard>

              <GlassCard>
                <div className="overflow-hidden rounded-xl">
                  <div className="flex items-center justify-between px-3 py-2 bg-[#252526] border-b border-white/5">
                    <span className="text-[10px] text-white/60 font-mono">starship.rs</span>
                    <Badge className="bg-primary/20 text-primary text-[9px] hover:bg-primary/20">Rust</Badge>
                  </div>
                  <div className="p-4 bg-[#1e1e1e] overflow-x-auto">
                    <pre className="font-mono text-[10px] leading-relaxed">
                      <code>
                        <span className="text-purple-400">use</span> darkwave_sdk::prelude::*;{"\n\n"}
                        <span className="text-gray-500">/// Define a new Token</span>{"\n"}
                        <span className="text-blue-400">pub struct</span> <span className="text-yellow-300">DarkWaveToken</span> {"{"}{"\n"}
                        {"    "}<span className="text-red-400">pub</span> supply: <span className="text-blue-400">u64</span>,{"\n"}
                        {"    "}<span className="text-red-400">pub</span> owner: <span className="text-blue-400">Address</span>,{"\n"}
                        {"}"}{"\n\n"}
                        <span className="text-purple-400">impl</span> <span className="text-yellow-300">Starship</span> <span className="text-purple-400">for</span> <span className="text-yellow-300">DarkWaveToken</span> {"{"}{"\n"}
                        {"    "}<span className="text-blue-400">fn</span> <span className="text-yellow-300">transfer</span>(&self, to: Address) {"{"}{"\n"}
                        {"        "}self.emit(TransferEvent {"{"} to {"}"});{"\n"}
                        {"    }"}{"\n"}
                        {"}"}
                      </code>
                    </pre>
                  </div>
                </div>
              </GlassCard>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
