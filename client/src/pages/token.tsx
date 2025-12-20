import { motion } from "framer-motion";
import { ArrowLeft, Coins, Wallet, BarChart3, Lock, Globe, ArrowRight, ShieldCheck, Zap } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import tokenBg from "@assets/generated_images/holographic_deep_wave_crypto_token_symbol.png";
import orbitLogo from "@assets/generated_images/futuristic_abstract_geometric_logo_symbol_for_orbit.png";

export default function Token() {
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
             <Button className="bg-primary text-background hover:bg-primary/90 font-semibold shadow-[0_0_20px_rgba(0,255,255,0.3)]">
              Buy $DARK
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 relative overflow-hidden">
        <div className="container mx-auto px-6 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="w-full lg:w-1/2 space-y-8">
              <Badge variant="outline" className="px-4 py-1 border-secondary/50 text-secondary bg-secondary/10 rounded-full text-sm font-tech tracking-wider uppercase">
                Native Utility Token
              </Badge>
              <h1 className="text-5xl md:text-7xl font-display font-bold leading-tight">
                DarkWave <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-secondary via-purple-400 to-primary text-glow">($DARK)</span>
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed max-w-xl">
                The fuel of the Orbit Ecosystem. DarkWave is not just a currency; it's the governance, security, and utility layer for the next generation of decentralized apps.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button size="lg" className="h-14 px-8 bg-white text-black hover:bg-white/90 font-bold rounded-full">
                  View Contract
                </Button>
                <Button size="lg" variant="outline" className="h-14 px-8 border-white/20 hover:bg-white/5 rounded-full">
                  Read Whitepaper
                </Button>
              </div>

              <div className="flex items-center gap-6 pt-8 text-sm text-muted-foreground font-mono">
                <div>
                  <div className="text-white font-bold text-lg">$0.42</div>
                  <div>Current Price</div>
                </div>
                <div className="w-px h-8 bg-white/10"></div>
                <div>
                  <div className="text-green-400 font-bold text-lg">+12.5%</div>
                  <div>24h Change</div>
                </div>
                <div className="w-px h-8 bg-white/10"></div>
                <div>
                  <div className="text-white font-bold text-lg">$840M</div>
                  <div>Market Cap</div>
                </div>
              </div>
            </div>

            <div className="w-full lg:w-1/2 flex justify-center relative">
              <div className="absolute inset-0 bg-gradient-to-r from-secondary/20 to-primary/20 blur-[100px] rounded-full"></div>
              <motion.img 
                src={tokenBg} 
                alt="Deep Wave Token" 
                className="relative z-10 w-full max-w-[500px] drop-shadow-2xl"
                animate={{ 
                  y: [0, -20, 0],
                  rotate: [0, 5, 0]
                }}
                transition={{ 
                  duration: 6, 
                  repeat: Infinity, 
                  ease: "easeInOut" 
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Utility Grid */}
      <section className="py-20 bg-secondary/5 border-t border-white/5">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-5xl font-display font-bold mb-6">Real Utility. No Fluff.</h2>
            <p className="text-lg text-muted-foreground">
              Unlike meme coins, $DARK is required to use every single app in the Orbit ecosystem. 
              From AI trading to enterprise staffing, value flows back to the token.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <TokenUtilityCard 
              icon={Zap}
              title="Gas Fees"
              desc="Pay for transactions on the Orbit Chain with $DARK. Micro-fees ensure speed without breaking the bank."
            />
            <TokenUtilityCard 
              icon={ShieldCheck}
              title="Validator Staking"
              desc="Secure the network by staking $DARK. Earn rewards for validating transactions and honest behavior."
            />
            <TokenUtilityCard 
              icon={Globe}
              title="Governance"
              desc="Vote on protocol upgrades, grant funding, and ecosystem direction. Your voice matters."
            />
          </div>
        </div>
      </section>

      {/* Tokenomics */}
      <section className="py-20 relative">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
             <div className="order-2 lg:order-1">
               <Card className="bg-black/40 border-white/10 p-8 backdrop-blur-xl">
                 <h3 className="text-2xl font-bold font-display mb-6">Distribution</h3>
                 <div className="space-y-6">
                   <DistributionItem label="Ecosystem Growth" percent="40%" color="bg-primary" />
                   <DistributionItem label="Public Sale" percent="20%" color="bg-secondary" />
                   <DistributionItem label="Team & Founders" percent="15%" color="bg-purple-500" />
                   <DistributionItem label="Foundation Reserve" percent="15%" color="bg-blue-500" />
                   <DistributionItem label="Airdrops" percent="10%" color="bg-green-500" />
                 </div>
               </Card>
             </div>
             
             <div className="order-1 lg:order-2 space-y-8">
               <h2 className="text-4xl font-display font-bold">Fair Launch Tokenomics</h2>
               <p className="text-lg text-muted-foreground leading-relaxed">
                 We designed $DARK to be fair, sustainable, and deflationary. 
                 A portion of all transaction fees are burned automatically, reducing supply over time 
                 as network usage grows.
               </p>
               <div className="grid grid-cols-2 gap-6">
                 <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                   <div className="text-sm text-muted-foreground uppercase tracking-wider mb-1">Total Supply</div>
                   <div className="text-2xl font-bold font-mono text-white">10,000,000,000</div>
                 </div>
                 <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                   <div className="text-sm text-muted-foreground uppercase tracking-wider mb-1">Deflationary Mechanism</div>
                   <div className="text-2xl font-bold font-mono text-white">Buy & Burn</div>
                 </div>
               </div>
             </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black py-12 border-t border-white/10 mt-20">
        <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <img src={orbitLogo} alt="Logo" className="w-6 h-6 opacity-50" />
            <span className="text-sm text-muted-foreground">© 2025 Orbit Foundation</span>
          </div>
          <div className="flex gap-6 text-sm text-muted-foreground">
            <a href="#" className="hover:text-white">Terms</a>
            <a href="#" className="hover:text-white">Privacy</a>
            <a href="#" className="hover:text-white">Status</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

function TokenUtilityCard({ icon: Icon, title, desc }: { icon: any, title: string, desc: string }) {
  return (
    <div className="p-8 rounded-2xl bg-white/5 border border-white/10 hover:border-secondary/50 transition-colors group">
      <div className="w-12 h-12 rounded-lg bg-secondary/20 flex items-center justify-center text-secondary mb-6 group-hover:scale-110 transition-transform">
        <Icon className="w-6 h-6" />
      </div>
      <h3 className="text-xl font-bold font-display mb-3 group-hover:text-secondary transition-colors">{title}</h3>
      <p className="text-muted-foreground leading-relaxed">
        {desc}
      </p>
    </div>
  );
}

function DistributionItem({ label, percent, color }: { label: string, percent: string, color: string }) {
  return (
    <div>
      <div className="flex justify-between mb-2 text-sm font-medium">
        <span className="text-white">{label}</span>
        <span className="text-white">{percent}</span>
      </div>
      <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
        <div className={`h-full ${color}`} style={{ width: percent }}></div>
      </div>
    </div>
  );
}
