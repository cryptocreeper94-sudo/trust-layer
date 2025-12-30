import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { 
  Lock, Sparkles, Code2, Terminal, Eye, Zap, 
  Brain, Rocket, Layers, Shield, Bell, Cpu, Database, 
  GitBranch, ChevronLeft, ChevronRight, Activity, Server,
  Cloud, Workflow, CheckCircle2
} from "lucide-react";
import { BackButton } from "@/components/page-nav";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Footer } from "@/components/footer";
import orbitLogo from "@assets/generated_images/futuristic_abstract_geometric_logo_symbol_for_orbit.png";

const systemStats = [
  { label: "Block Time", value: "400ms", icon: Activity },
  { label: "TPS", value: "200K+", icon: Zap },
  { label: "Validators", value: "128", icon: Server },
  { label: "Uptime", value: "99.99%", icon: CheckCircle2 },
];

const ideFeatures = [
  { title: "AI-Assisted Coding", desc: "Smart completions & refactoring", icon: Brain },
  { title: "Live Deploy", desc: "One-click to devnet/mainnet", icon: Rocket },
  { title: "Cloud Workspaces", desc: "Isolated dev environments", icon: Cloud },
  { title: "Version Control", desc: "Built-in Git integration", icon: GitBranch },
];

const carouselSlides = [
  { title: "Write Smart Contracts", desc: "AI-assisted development with real-time validation" },
  { title: "Deploy to DarkWave", desc: "Seamless deployment with one click" },
  { title: "Test & Debug", desc: "Integrated testing with AI debugging" },
  { title: "Collaborate", desc: "Real-time team collaboration" },
];

function GlassCard({ 
  children, 
  className = "", 
  locked = true,
  glow = false,
  hover = true
}: { 
  children: React.ReactNode; 
  className?: string; 
  locked?: boolean;
  glow?: boolean;
  hover?: boolean;
}) {
  return (
    <motion.div
      whileHover={hover ? { scale: 1.02, y: -2 } : {}}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      className={`relative group ${className}`}
    >
      <div className={`
        relative h-full overflow-hidden rounded-xl
        bg-[rgba(12,18,36,0.65)] backdrop-blur-2xl
        border border-white/[0.08]
        ${glow ? 'shadow-[0_0_40px_rgba(0,255,255,0.15)]' : 'shadow-lg shadow-black/20'}
        transition-all duration-300
      `}>
        {locked && (
          <div className="absolute inset-0 bg-black/30 backdrop-blur-[2px] z-10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/50 border border-white/10">
              <Lock className="w-3 h-3 text-primary" />
              <span className="text-xs font-medium text-white/80">Coming Soon</span>
            </div>
          </div>
        )}
        {children}
      </div>
      {glow && (
        <div className="absolute -inset-[1px] rounded-xl bg-gradient-to-r from-primary/30 via-cyan-400/20 to-secondary/30 -z-10 blur-sm opacity-50" />
      )}
    </motion.div>
  );
}

function SystemHealthCarousel() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % systemStats.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="h-full flex flex-col p-4">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
        <span className="text-xs font-medium text-white/60 uppercase tracking-wider">Network Status</span>
      </div>
      <div className="flex-1 flex items-center justify-center">
        <motion.div
          key={current}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="text-center"
        >
          {(() => {
            const stat = systemStats[current];
            const Icon = stat.icon;
            return (
              <>
                <Icon className="w-8 h-8 text-primary mx-auto mb-2" />
                <div className="text-2xl font-bold text-white">{stat.value}</div>
                <div className="text-xs text-white/50">{stat.label}</div>
              </>
            );
          })()}
        </motion.div>
      </div>
      <div className="flex justify-center gap-1.5 mt-2">
        {systemStats.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`w-1.5 h-1.5 rounded-full transition-all ${
              i === current ? "w-4 bg-primary" : "bg-white/20"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

function MiniCarousel() {
  const [current, setCurrent] = useState(0);

  return (
    <div className="h-full flex flex-col p-4">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-medium text-white/60 uppercase tracking-wider">Preview</span>
        <div className="flex gap-1">
          <button 
            onClick={() => setCurrent((prev) => (prev - 1 + carouselSlides.length) % carouselSlides.length)}
            className="p-1 rounded hover:bg-white/10 transition-colors"
          >
            <ChevronLeft className="w-3 h-3 text-white/50" />
          </button>
          <button 
            onClick={() => setCurrent((prev) => (prev + 1) % carouselSlides.length)}
            className="p-1 rounded hover:bg-white/10 transition-colors"
          >
            <ChevronRight className="w-3 h-3 text-white/50" />
          </button>
        </div>
      </div>
      <div className="flex-1 flex flex-col justify-center">
        <motion.div
          key={current}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-2"
        >
          <h4 className="text-sm font-bold text-white">{carouselSlides[current].title}</h4>
          <p className="text-xs text-white/50 leading-relaxed">{carouselSlides[current].desc}</p>
        </motion.div>
      </div>
      <div className="flex gap-1 mt-2">
        {carouselSlides.map((_, i) => (
          <div
            key={i}
            className={`h-0.5 flex-1 rounded-full transition-all ${
              i === current ? "bg-primary" : "bg-white/10"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

export default function DevStudio() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleNotify = async () => {
    if (!email || !email.includes("@")) {
      setMessage("Please enter a valid email address");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, feature: "dev-studio" }),
      });
      const data = await response.json();
      
      if (data.success) {
        setSubscribed(true);
        setMessage(data.message);
        setEmail("");
      } else {
        setMessage(data.error || "Something went wrong. Please try again.");
      }
    } catch (error) {
      setMessage("Connection error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-background/90 backdrop-blur-xl">
        <div className="container mx-auto px-4 h-14 flex items-center">
          <Link href="/" className="flex items-center gap-2 mr-auto">
            <img src={orbitLogo} alt="DarkWave" className="w-7 h-7" />
            <span className="font-display font-bold text-lg tracking-tight">DarkWave</span>
          </Link>
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="border-primary/50 text-primary text-[10px] px-2 py-0.5">
              <Sparkles className="w-2.5 h-2.5 mr-1" />
              Q2 2026
            </Badge>
            <BackButton />
          </div>
        </div>
      </header>

      <main className="pt-20 pb-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <section className="text-center mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/30 mb-4"
            >
              <Rocket className="w-3 h-3 text-primary" />
              <span className="text-xs font-medium text-primary">Next Generation Development</span>
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-3xl md:text-5xl font-display font-bold mb-4"
            >
              <span className="bg-gradient-to-r from-primary via-cyan-300 to-secondary bg-clip-text text-transparent">
                Dev Studio
              </span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-sm text-muted-foreground mb-6 max-w-lg mx-auto"
            >
              AI-powered cloud IDE for blockchain developers. Write, test, and deploy smart contracts.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-col items-center gap-3"
            >
              {!subscribed ? (
                <>
                  <div className="flex flex-col sm:flex-row items-center gap-2 w-full max-w-md">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => { setEmail(e.target.value); setMessage(""); }}
                      placeholder="Enter email for early access"
                      className="w-full h-10 px-4 text-sm rounded-lg bg-white/5 border border-white/10 focus:border-primary/50 focus:outline-none text-white placeholder:text-white/40"
                      data-testid="input-notify-email"
                      onKeyDown={(e) => e.key === "Enter" && handleNotify()}
                    />
                    <Button 
                      onClick={handleNotify}
                      disabled={loading}
                      className="h-10 px-6 bg-primary text-background hover:bg-primary/90 font-semibold text-sm rounded-lg shrink-0"
                      data-testid="button-notify-me"
                    >
                      {loading ? "..." : <><Bell className="w-3 h-3 mr-1.5" />Notify Me</>}
                    </Button>
                  </div>
                  {message && <p className="text-xs text-red-400">{message}</p>}
                </>
              ) : (
                <div className="flex items-center gap-2 text-green-400 text-sm">
                  <Sparkles className="w-4 h-4" />
                  <span>{message || "You're on the list!"}</span>
                </div>
              )}
            </motion.div>
          </section>

          <section className="grid grid-cols-2 md:grid-cols-4 gap-3 auto-rows-[140px] md:auto-rows-[160px]">
            <GlassCard className="col-span-2 row-span-2" glow>
              <div className="h-full p-4 flex flex-col">
                <div className="flex items-center gap-2 mb-3">
                  <div className="p-1.5 rounded-lg bg-primary/20">
                    <Code2 className="w-4 h-4 text-primary" />
                  </div>
                  <span className="text-sm font-bold text-white">AI Code Editor</span>
                </div>
                <div className="flex-1 bg-black/40 rounded-lg border border-white/5 overflow-hidden">
                  <div className="h-6 bg-white/5 border-b border-white/5 flex items-center px-3 gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-red-500/50" />
                    <div className="w-2 h-2 rounded-full bg-yellow-500/50" />
                    <div className="w-2 h-2 rounded-full bg-green-500/50" />
                    <span className="text-[10px] text-white/30 ml-2">token.dwv</span>
                  </div>
                  <div className="p-3 font-mono text-[11px] leading-relaxed">
                    <div><span className="text-purple-400">contract</span> <span className="text-cyan-400">DWCoken</span> {"{"}</div>
                    <div className="pl-3"><span className="text-white/50">name:</span> <span className="text-green-400">"DarkWave"</span></div>
                    <div className="pl-3"><span className="text-white/50">symbol:</span> <span className="text-green-400">"DWC"</span></div>
                    <div className="pl-3"><span className="text-white/50">supply:</span> <span className="text-yellow-400">100_000_000</span></div>
                    <div className="text-purple-400">{"}"}</div>
                  </div>
                </div>
              </div>
            </GlassCard>

            <GlassCard>
              <SystemHealthCarousel />
            </GlassCard>

            <GlassCard>
              <div className="h-full p-4 flex flex-col">
                <div className="flex items-center gap-2 mb-2">
                  <Terminal className="w-4 h-4 text-green-400" />
                  <span className="text-xs font-bold text-white">Console</span>
                </div>
                <div className="flex-1 bg-black/40 rounded-lg p-2 font-mono text-[10px] space-y-1">
                  <div className="text-green-400">$ dw deploy</div>
                  <div className="text-white/40">Compiling...</div>
                  <div className="text-cyan-400">✓ Deployed</div>
                </div>
              </div>
            </GlassCard>

            <GlassCard>
              <MiniCarousel />
            </GlassCard>

            <GlassCard>
              <div className="h-full p-4 flex flex-col justify-center items-center text-center">
                <Eye className="w-6 h-6 text-cyan-400 mb-2" />
                <span className="text-xs font-bold text-white">Live Preview</span>
                <span className="text-[10px] text-white/40 mt-1">Real-time updates</span>
              </div>
            </GlassCard>

            <GlassCard className="col-span-2">
              <div className="h-full p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Brain className="w-4 h-4 text-purple-400" />
                  <span className="text-xs font-bold text-white">AI Assistant</span>
                </div>
                <div className="space-y-2">
                  <div className="bg-white/5 rounded-lg px-3 py-2 text-[11px] text-white/60">
                    "Add a transfer function with balance checks"
                  </div>
                  <div className="bg-primary/10 rounded-lg px-3 py-2 text-[11px] text-primary border border-primary/20 flex items-center gap-2">
                    <Sparkles className="w-3 h-3" />
                    Generating optimized code...
                  </div>
                </div>
              </div>
            </GlassCard>

            <GlassCard>
              <div className="h-full p-4 flex flex-col justify-center">
                <Cpu className="w-5 h-5 text-orange-400 mb-2" />
                <div className="text-xl font-bold text-white">Unlimited</div>
                <div className="text-[10px] text-white/40">Build minutes</div>
              </div>
            </GlassCard>

            <GlassCard>
              <div className="h-full p-4 flex flex-col justify-center">
                <Database className="w-5 h-5 text-blue-400 mb-2" />
                <div className="text-xl font-bold text-white">10 GB</div>
                <div className="text-[10px] text-white/40">Storage per project</div>
              </div>
            </GlassCard>

            {ideFeatures.map((feature, i) => (
              <GlassCard key={i}>
                <div className="h-full p-4 flex flex-col justify-center">
                  <feature.icon className={`w-5 h-5 mb-2 ${
                    i === 0 ? 'text-purple-400' : i === 1 ? 'text-yellow-400' : i === 2 ? 'text-cyan-400' : 'text-pink-400'
                  }`} />
                  <div className="text-xs font-bold text-white">{feature.title}</div>
                  <div className="text-[10px] text-white/40 mt-0.5">{feature.desc}</div>
                </div>
              </GlassCard>
            ))}
          </section>

          <section className="mt-8">
            <GlassCard locked={false} hover={false} className="w-full">
              <div className="p-6 md:p-8 text-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-secondary/5" />
                <div className="relative z-10">
                  <Workflow className="w-10 h-10 text-primary mx-auto mb-4" />
                  <h2 className="text-xl md:text-2xl font-display font-bold mb-2">Be First in Line</h2>
                  <p className="text-sm text-muted-foreground mb-4 max-w-md mx-auto">
                    Join the waitlist for exclusive early access when Dev Studio launches.
                  </p>
                  <div className="flex flex-wrap items-center justify-center gap-2">
                    <Badge className="bg-primary/20 text-primary border-primary/30 text-xs">
                      <Sparkles className="w-3 h-3 mr-1" />
                      Early Access
                    </Badge>
                    <Badge className="bg-white/10 text-white border-white/20 text-xs">
                      Free for DWC Holders
                    </Badge>
                    <Badge className="bg-green-500/20 text-green-400 border-green-500/30 text-xs">
                      SOC2 Compliant
                    </Badge>
                  </div>
                </div>
              </div>
            </GlassCard>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
