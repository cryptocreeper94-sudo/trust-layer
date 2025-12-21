import { motion } from "framer-motion";
import { ArrowLeft, Search, LayoutGrid, Rocket, ShieldCheck, CheckCircle2, ExternalLink } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import orbitLogo from "@assets/generated_images/futuristic_abstract_geometric_logo_symbol_for_orbit.png";
import { Footer } from "@/components/footer";
import { usePageAnalytics } from "@/hooks/use-analytics";
import { GlassCard } from "@/components/glass-card";

const apps = [
  { name: "DarkWave Pulse", category: "DeFi & AI", desc: "Predictive market intelligence powered by AI. Auto-trades and snipes opportunities.", gradient: "from-cyan-600 to-blue-700", tags: ["AI", "Trading"], verified: true, featured: true },
  { name: "DarkWave Staffing", category: "Enterprise", desc: "Blockchain-based staffing and workforce management with immutable records.", gradient: "from-emerald-600 to-teal-800", tags: ["HR", "Payroll"], verified: true },
  { name: "Paint Pros", category: "Enterprise", desc: "Complete management suite for painting franchisees.", gradient: "from-orange-500 to-amber-700", tags: ["Franchise", "Ops"], verified: true },
  { name: "Orby", category: "AI Assistant", desc: "Your personal AI companion for the DarkWave ecosystem.", gradient: "from-cyan-400 to-blue-500", tags: ["AI", "Chatbot"], verified: true },
  { name: "GarageBot", category: "Automation", desc: "Smart automation for vehicle maintenance.", gradient: "from-slate-600 to-zinc-800", tags: ["Auto", "IoT"], verified: true },
  { name: "Brew & Board", category: "Social", desc: "Community for board game enthusiasts and craft brew lovers.", gradient: "from-amber-600 to-yellow-800", tags: ["Social", "Events"], verified: true },
  { name: "LotOps Pro", category: "Enterprise", desc: "Lot operations management for automotive dealerships.", gradient: "from-indigo-600 to-violet-800", tags: ["Auto", "B2B"], verified: true },
  { name: "Nova DEX", category: "DeFi", desc: "The fastest decentralized exchange. Zero slippage.", gradient: "from-blue-500 to-cyan-500", tags: ["AMM", "Swap"], verified: false },
  { name: "DarkWave ID", category: "Identity", desc: "Your universal passport across all apps.", gradient: "from-purple-600 to-indigo-700", tags: ["Identity", "SSO"], verified: true },
];

const categories = ["All Apps", "DeFi", "Enterprise", "AI", "Social", "Gaming"];

export default function Ecosystem() {
  usePageAnalytics();
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden selection:bg-primary/20 selection:text-primary">
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-background/90 backdrop-blur-xl">
        <div className="container mx-auto px-4 h-14 flex items-center">
          <Link href="/" className="flex items-center gap-2 mr-auto">
            <img src={orbitLogo} alt="DarkWave" className="w-7 h-7" />
            <span className="font-display font-bold text-lg tracking-tight">DarkWave</span>
          </Link>
          <div className="flex items-center gap-3">
            <Button size="sm" className="h-8 text-xs bg-primary text-background hover:bg-primary/90 font-semibold">
              <Rocket className="w-3 h-3 mr-1.5" /> Submit App
            </Button>
            <Link href="/">
              <Button variant="ghost" size="sm" className="h-8 text-xs gap-1.5 hover:bg-white/5">
                <ArrowLeft className="w-3 h-3" />
                Back
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      <section className="pt-20 pb-8 px-4">
        <div className="container mx-auto max-w-6xl text-center">
          <h1 className="text-3xl md:text-4xl font-display font-bold mb-3">
            The DarkWave <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">App Store</span>
          </h1>
          <p className="text-sm text-muted-foreground max-w-lg mx-auto mb-6">
            One wallet, one login, infinite possibilities.
          </p>
          
          <div className="max-w-lg mx-auto">
            <GlassCard hover={false}>
              <div className="p-2 flex items-center gap-2">
                <Search className="w-4 h-4 text-muted-foreground shrink-0 ml-2" />
                <Input 
                  placeholder="Search apps, protocols, and services..." 
                  className="border-0 bg-transparent h-10 text-sm focus-visible:ring-0 focus-visible:ring-offset-0"
                />
              </div>
            </GlassCard>
          </div>
        </div>
      </section>

      <section className="py-6 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="w-full lg:w-56 space-y-4 lg:sticky lg:top-20 h-fit">
              <div>
                <h3 className="text-[10px] font-bold text-white/40 uppercase tracking-wider mb-3">Categories</h3>
                <div className="flex flex-wrap lg:flex-col gap-2">
                  {categories.map((cat, i) => (
                    <Button
                      key={cat}
                      variant={i === 0 ? "secondary" : "ghost"}
                      size="sm"
                      className={`h-8 text-xs justify-start ${i === 0 ? 'bg-primary/20 text-primary' : 'text-white/60 hover:text-white'}`}
                    >
                      {cat}
                    </Button>
                  ))}
                </div>
              </div>
              
              <GlassCard hover={false}>
                <div className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <ShieldCheck className="w-4 h-4 text-primary" />
                    <span className="text-xs font-bold text-white">Verified Apps</span>
                  </div>
                  <p className="text-[10px] text-white/50 leading-relaxed">
                    Look for the <CheckCircle2 className="w-3 h-3 inline text-primary mx-0.5" /> badge. 
                    These apps passed security audits.
                  </p>
                </div>
              </GlassCard>
            </div>

            <div className="flex-1">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-display font-bold">Featured Applications</h2>
                <div className="flex items-center gap-1.5 text-[10px] text-white/40">
                  <LayoutGrid className="w-3 h-3" /> Grid View
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
                {apps.map((app, i) => (
                  <GlassCard key={i} className={app.featured ? "md:col-span-2" : ""}>
                    <div className="p-4 h-full flex flex-col">
                      <div className="flex items-start gap-3 mb-3">
                        <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${app.gradient} flex items-center justify-center text-white font-bold text-sm shrink-0`}>
                          {app.name.charAt(0)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <h3 className="text-sm font-bold text-white truncate">{app.name}</h3>
                            {app.verified && <CheckCircle2 className="w-3.5 h-3.5 text-primary shrink-0" />}
                          </div>
                          <p className="text-[10px] text-white/40">{app.category}</p>
                        </div>
                      </div>
                      <p className="text-[11px] text-white/50 leading-relaxed mb-3 flex-grow">{app.desc}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex gap-1">
                          {app.tags.slice(0, 2).map((tag, j) => (
                            <Badge key={j} variant="outline" className="text-[8px] px-1.5 py-0 border-white/10 text-white/40">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                        <Button variant="ghost" size="sm" className="h-6 px-2 text-[10px] text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                          Launch <ExternalLink className="w-2.5 h-2.5 ml-1" />
                        </Button>
                      </div>
                    </div>
                  </GlassCard>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
