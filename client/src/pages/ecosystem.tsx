import { motion } from "framer-motion";
import { ArrowLeft, Box, Check, ChevronRight, Code, Cpu, Database, FileCode, Layers, Terminal, Zap, Search, LayoutGrid, Rocket, Globe, ShieldCheck, CheckCircle2 } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import dashboardBg from "@assets/generated_images/futuristic_dashboard_interface_for_managing_decentralized_applications.png";
import orbitLogo from "@assets/generated_images/futuristic_abstract_geometric_logo_symbol_for_orbit.png";
import { Footer } from "@/components/footer";
import { usePageAnalytics } from "@/hooks/use-analytics";

export default function Ecosystem() {
  usePageAnalytics();
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
              <Rocket className="w-4 h-4 mr-2" /> Submit Your App
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-12 relative overflow-hidden border-b border-white/5">
        <div className="absolute inset-0 z-0">
          <img 
            src={dashboardBg} 
            alt="Background" 
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/50 via-background/90 to-background"></div>
        </div>

        <div className="container mx-auto px-6 relative z-10 text-center">
          <h1 className="text-4xl md:text-6xl font-display font-bold mb-6">
            The Orbit <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary text-glow">App Store</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            This isn't just a list of links. It's an Operating System. <br/>
            One wallet, one login, infinite possibilities.
          </p>
          
          <div className="max-w-xl mx-auto relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input 
              placeholder="Search apps, protocols, and services..." 
              className="pl-12 h-14 bg-white/5 border-white/10 rounded-full text-lg focus:border-primary/50 focus:ring-primary/20"
            />
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="container mx-auto px-6">
          <div className="flex flex-col lg:flex-row gap-8">
            
            {/* Sidebar Filters - Sticky on Desktop */}
            <div className="w-full lg:w-64 space-y-8 lg:sticky lg:top-24 h-fit">
              <div>
                <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-4">Categories</h3>
                <div className="space-y-2">
                  <FilterButton active label="All Apps" count={24} />
                  <FilterButton label="DeFi" count={8} />
                  <FilterButton label="Gaming" count={5} />
                  <FilterButton label="Enterprise" count={2} />
                  <FilterButton label="Social" count={3} />
                  <FilterButton label="NFTs" count={4} />
                </div>
              </div>
              
              <div className="p-6 rounded-xl bg-gradient-to-br from-primary/10 to-transparent border border-white/10">
                <h3 className="font-bold text-white mb-2">Utility vs. Hype</h3>
                <p className="text-xs text-muted-foreground leading-relaxed mb-4">
                  "It seems like the person who builds the most utility wins."
                </p>
                <div className="space-y-3">
                  <div className="text-xs">
                    <div className="flex justify-between mb-1">
                      <span className="text-muted-foreground">Meme Coins</span>
                      <span className="text-red-400">0% Utility</span>
                    </div>
                    <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                      <div className="w-0 h-full bg-red-500"></div>
                    </div>
                  </div>
                  <div className="text-xs">
                    <div className="flex justify-between mb-1">
                      <span className="text-white font-bold">Orbit Apps ($DARK)</span>
                      <span className="text-primary">100% Utility</span>
                    </div>
                    <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                      <div className="w-full h-full bg-primary shadow-[0_0_10px_var(--color-primary)]"></div>
                    </div>
                  </div>
                </div>
              </div>

               <div className="p-6 rounded-xl bg-white/5 border border-white/10">
                <div className="flex items-center gap-2 mb-2 text-primary">
                   <ShieldCheck className="w-5 h-5" />
                   <h3 className="font-bold text-white">Orbit Verified</h3>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Look for the <CheckCircle2 className="w-3 h-3 inline text-primary mx-1" /> badge. 
                  These apps have passed rigorous security audits and are fully integrated with the Orbit Chain.
                </p>
              </div>
            </div>

            {/* Apps Grid */}
            <div className="flex-1">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-display font-bold">Featured Applications</h2>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <LayoutGrid className="w-4 h-4" /> View: Grid
                </div>
              </div>

              {/* BENTO GRID LAYOUT */}
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 auto-rows-[minmax(300px,auto)]">
                
                {/* Featured / Large Card - User App 1 */}
                <div className="md:col-span-2 xl:col-span-2 row-span-1">
                   <AppStoreCard 
                    name="DarkWave Pulse" 
                    category="DeFi & AI" 
                    users="Orbit Verified"
                    desc="Predictive market intelligence powered by sentient AI learning systems. Auto-trades and snipes opportunities in real-time based on market conditions."
                    gradient="from-cyan-600 to-blue-700"
                    tags={["AI", "Auto-Trading", "Predictive", "Sniping"]}
                    verified
                    featured
                  />
                </div>

                {/* Standard Card - User App 2 */}
                <AppStoreCard 
                  name="Orbit Staffing" 
                  category="Enterprise" 
                  users="Orbit Verified"
                  desc="Blockchain-based staffing and workforce management. Immutable records of employment, skills, and payments."
                  gradient="from-emerald-600 to-teal-800"
                  tags={["HR", "Payroll", "Enterprise"]}
                  verified
                />

                {/* Standard Card - User App 3 */}
                <AppStoreCard 
                  name="Paint Pros" 
                  category="Enterprise" 
                  users="Orbit Verified"
                  desc="Complete management suite for painting franchisees. Supply chain tracking, transparent royalties, and automated operations."
                  gradient="from-orange-500 to-amber-700"
                  tags={["Franchise", "Supply Chain", "Ops"]}
                  verified
                />

                <AppStoreCard 
                  name="Orby" 
                  category="AI Assistant" 
                  users="Orbit Verified"
                  desc="Your personal AI companion for the Orbit ecosystem. Ask questions, execute trades, and manage your portfolio with natural language."
                  gradient="from-cyan-400 to-blue-500"
                  tags={["AI", "Chatbot", "Assistant"]}
                  verified
                />

                <AppStoreCard 
                  name="GarageBot" 
                  category="Automation" 
                  users="Orbit Verified"
                  desc="Smart automation for vehicle maintenance and garage management. Track repairs, inventory, and service schedules on-chain."
                  gradient="from-slate-600 to-zinc-800"
                  tags={["Auto", "IoT", "Maintenance"]}
                  verified
                />

                <AppStoreCard 
                  name="Brew & Board" 
                  category="Social & Gaming" 
                  users="Orbit Verified"
                  desc="A decentralized community for board game enthusiasts and craft brew lovers. Organize events, track scores, and earn rewards."
                  gradient="from-amber-600 to-yellow-800"
                  tags={["Social", "Events", "Rewards"]}
                  verified
                />

                <AppStoreCard 
                  name="LotOps Pro" 
                  category="Enterprise" 
                  users="Orbit Verified"
                  desc="Professional lot operations management for automotive dealerships. Streamline inventory, tracking, and sales workflows."
                  gradient="from-indigo-600 to-violet-800"
                  tags={["Auto", "B2B", "Inventory"]}
                  verified
                />

                 {/* Other Ecosystem Apps */}
                <AppStoreCard 
                  name="Nova DEX" 
                  category="DeFi" 
                  users="120k Users"
                  desc="The fastest decentralized exchange. Zero slippage, instant settlement."
                  gradient="from-blue-500 to-cyan-500"
                  tags={["AMM", "Liquidity", "Swap"]}
                />
                
                <AppStoreCard 
                  name="Orbit ID" 
                  category="Identity" 
                  users="850k Users"
                  desc="Your universal passport. One identity across all apps in the ecosystem."
                  gradient="from-purple-500 to-pink-500"
                  tags={["DID", "Profile", "Auth"]}
                />

                 <AppStoreCard 
                  name="Vault" 
                  category="Security" 
                  users="5k Orgs"
                  desc="Multi-sig institutional custody for DAOs and enterprises."
                  gradient="from-slate-500 to-slate-700"
                  tags={["Custody", "Multi-sig", "Enterprise"]}
                />
              </div>

              <div className="mt-12 p-8 rounded-2xl border border-dashed border-white/20 bg-white/5 text-center">
                <div className="w-16 h-16 mx-auto bg-primary/20 rounded-full flex items-center justify-center mb-6 text-primary">
                  <Code className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold font-display mb-2">Build the Next Big Thing</h3>
                <p className="text-muted-foreground max-w-md mx-auto mb-6">
                  "It seems like the person who builds the most utility wins." — You are right. 
                  Start building on Orbit today and join the utility revolution.
                </p>
                <Link href="/developers">
                  <Button className="bg-white text-black hover:bg-white/90 font-bold">
                    Read Developer Docs
                  </Button>
                </Link>
              </div>

            </div>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
}

function FilterButton({ label, count, active }: { label: string, count: number, active?: boolean }) {
  return (
    <button className={`w-full flex items-center justify-between px-4 py-2 rounded-lg text-sm font-medium transition-colors ${active ? 'bg-white/10 text-white' : 'text-muted-foreground hover:bg-white/5 hover:text-white'}`}>
      <span>{label}</span>
      <span className={`text-xs px-2 py-0.5 rounded-full ${active ? 'bg-primary text-background' : 'bg-white/5'}`}>{count}</span>
    </button>
  );
}

function AppStoreCard({ name, category, users, desc, gradient, tags, verified, featured }: { name: string, category: string, users: string, desc: string, gradient: string, tags: string[], verified?: boolean, featured?: boolean }) {
  return (
    <div className={`group flex flex-col h-full bg-black/40 border border-white/10 rounded-xl overflow-hidden hover:border-primary/50 transition-all duration-300 hover:shadow-[0_0_20px_rgba(0,255,255,0.1)] ${featured ? 'md:flex-row' : ''}`}>
      <div className={`${featured ? 'md:w-1/3 h-64 md:h-full' : 'h-32'} bg-gradient-to-br ${gradient} p-6 relative overflow-hidden flex flex-col justify-between`}>
        <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors"></div>
        <div className="relative z-10 w-12 h-12 bg-black/50 backdrop-blur-md rounded-xl flex items-center justify-center text-white font-bold text-xl border border-white/20 shadow-lg">
          {name.charAt(0)}
        </div>
        {featured && (
             <div className="relative z-10 mt-auto pt-4">
                <Badge className="bg-white/20 hover:bg-white/30 text-white border-none backdrop-blur-md">Featured App</Badge>
             </div>
        )}
      </div>
      
      <div className="p-6 flex-1 flex flex-col">
        <div className="flex justify-between items-start mb-2">
          <div>
            <div className="flex items-center gap-2">
                <h3 className={`font-bold text-white group-hover:text-primary transition-colors ${featured ? 'text-2xl' : 'text-lg'}`}>{name}</h3>
                {verified && (
                    <CheckCircle2 className="w-4 h-4 text-primary" />
                )}
            </div>
            <div className="text-xs text-muted-foreground flex items-center gap-1">
                {category} • 
                <span className={verified ? "text-primary font-bold" : ""}>{users}</span>
            </div>
          </div>
          <Button size="sm" variant="secondary" className="h-8 bg-white/10 hover:bg-primary hover:text-black transition-colors">
            Open
          </Button>
        </div>
        
        <p className={`text-sm text-muted-foreground leading-relaxed mb-6 flex-1 ${featured ? 'text-base' : ''}`}>
          {desc}
        </p>
        
        <div className="flex flex-wrap gap-2 mt-auto">
          {tags.map((tag, i) => (
            <span key={i} className="text-[10px] uppercase font-bold px-2 py-1 rounded bg-white/5 text-muted-foreground border border-white/5">
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
