import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { 
  ArrowLeft, Lock, Sparkles, Code2, Terminal, Eye, Zap, 
  Brain, Rocket, Layers, Globe, Shield, Play, ChevronLeft, 
  ChevronRight, Bell, Cpu, Database, GitBranch, Box
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Footer } from "@/components/footer";

const features = [
  {
    icon: Brain,
    title: "AI Code Assistant",
    description: "Intelligent code suggestions powered by advanced language models",
    gradient: "from-purple-500 to-pink-500",
  },
  {
    icon: Terminal,
    title: "Cloud Workspaces",
    description: "Secure, isolated development environments in the cloud",
    gradient: "from-cyan-500 to-blue-500",
  },
  {
    icon: Eye,
    title: "Live Preview",
    description: "Real-time preview of your applications as you build",
    gradient: "from-green-500 to-emerald-500",
  },
  {
    icon: Zap,
    title: "Instant Deploy",
    description: "One-click deployment to DarkWave devnet and mainnet",
    gradient: "from-yellow-500 to-orange-500",
  },
  {
    icon: Layers,
    title: "Smart Contracts",
    description: "Built-in templates and tools for DarkWave smart contracts",
    gradient: "from-indigo-500 to-purple-500",
  },
  {
    icon: Shield,
    title: "Security Audits",
    description: "Automated security scanning for your blockchain code",
    gradient: "from-red-500 to-rose-500",
  },
];

const carouselItems = [
  {
    title: "Write Smart Contracts",
    description: "AI-assisted contract development with real-time validation",
    image: "contract",
  },
  {
    title: "Deploy to DarkWave",
    description: "Seamless deployment to devnet and mainnet with one click",
    image: "deploy",
  },
  {
    title: "Test & Debug",
    description: "Integrated testing environment with AI-powered debugging",
    image: "debug",
  },
  {
    title: "Collaborate",
    description: "Real-time collaboration with team members worldwide",
    image: "collab",
  },
];

function LockedBentoCard({ 
  children, 
  className = "", 
  span = 1,
  glow = false,
  locked = true
}: { 
  children: React.ReactNode; 
  className?: string; 
  span?: 1 | 2 | 3;
  glow?: boolean;
  locked?: boolean;
}) {
  const spanClass = span === 2 ? "md:col-span-2" : span === 3 ? "md:col-span-3" : "";
  
  return (
    <motion.div
      whileHover={{ 
        scale: locked ? 1.01 : 1.03, 
        rotateX: 2,
        rotateY: 2,
        z: 50 
      }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      style={{ transformStyle: "preserve-3d" }}
      className={`relative group ${spanClass} ${className}`}
    >
      <div className={`
        relative overflow-hidden rounded-2xl border border-white/10 
        bg-gradient-to-br from-white/5 to-transparent backdrop-blur-xl
        ${glow ? 'shadow-lg shadow-primary/20' : ''}
        ${locked ? 'opacity-80' : ''}
        transition-all duration-300
      `}>
        {locked && (
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm z-10 flex items-center justify-center">
            <div className="text-center">
              <Lock className="w-8 h-8 text-primary mx-auto mb-2" />
              <span className="text-sm font-medium text-white/80">Coming Soon</span>
            </div>
          </div>
        )}
        {children}
      </div>
      {glow && (
        <div className="absolute -inset-px rounded-2xl bg-gradient-to-r from-primary/50 to-secondary/50 opacity-0 group-hover:opacity-100 transition-opacity -z-10 blur-xl" />
      )}
    </motion.div>
  );
}

function FeatureCarousel() {
  const [current, setCurrent] = useState(0);

  const next = () => setCurrent((prev) => (prev + 1) % carouselItems.length);
  const prev = () => setCurrent((prev) => (prev - 1 + carouselItems.length) % carouselItems.length);

  return (
    <div className="relative">
      <div className="overflow-hidden rounded-xl">
        <motion.div 
          className="flex"
          animate={{ x: `-${current * 100}%` }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          {carouselItems.map((item, i) => (
            <div key={i} className="min-w-full p-8">
              <div className="aspect-video bg-gradient-to-br from-primary/20 to-secondary/20 rounded-xl flex items-center justify-center mb-6 border border-white/10">
                <div className="text-center">
                  <Code2 className="w-16 h-16 text-primary/50 mx-auto mb-4" />
                  <span className="text-white/50 text-sm">Preview: {item.image}</span>
                </div>
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">{item.title}</h3>
              <p className="text-muted-foreground">{item.description}</p>
            </div>
          ))}
        </motion.div>
      </div>
      
      <div className="flex items-center justify-center gap-4 mt-4">
        <Button variant="ghost" size="icon" onClick={prev} className="hover:bg-white/10">
          <ChevronLeft className="w-5 h-5" />
        </Button>
        <div className="flex gap-2">
          {carouselItems.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`w-2 h-2 rounded-full transition-all ${
                i === current ? "w-8 bg-primary" : "bg-white/20"
              }`}
            />
          ))}
        </div>
        <Button variant="ghost" size="icon" onClick={next} className="hover:bg-white/10">
          <ChevronRight className="w-5 h-5" />
        </Button>
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
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-background/80 backdrop-blur-xl">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/">
            <Button variant="ghost" size="sm" className="gap-2 hover:bg-white/5">
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Button>
          </Link>
          <Badge variant="outline" className="border-primary/50 text-primary animate-pulse">
            <Sparkles className="w-3 h-3 mr-1" />
            Coming Q2 2026
          </Badge>
        </div>
      </header>

      <main className="pt-24 pb-16">
        <section className="container mx-auto px-6 mb-20">
          <div className="text-center max-w-4xl mx-auto mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/30 mb-6"
            >
              <Rocket className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">Next Generation Development</span>
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-5xl md:text-7xl font-display font-bold mb-6"
            >
              <span className="bg-gradient-to-r from-primary via-cyan-300 to-secondary bg-clip-text text-transparent">
                DarkWave Dev Studio
              </span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto"
            >
              The AI-powered cloud IDE built for blockchain developers. Write, test, and deploy 
              smart contracts with intelligent assistance and real-time previews.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-col items-center gap-4"
            >
              {!subscribed ? (
                <>
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => { setEmail(e.target.value); setMessage(""); }}
                      placeholder="Enter your email for early access"
                      className="w-full sm:w-80 h-12 px-4 rounded-xl bg-white/5 border border-white/10 focus:border-primary/50 focus:outline-none text-white placeholder:text-white/40"
                      data-testid="input-notify-email"
                      onKeyDown={(e) => e.key === "Enter" && handleNotify()}
                    />
                    <Button 
                      onClick={handleNotify}
                      disabled={loading}
                      className="h-12 px-8 bg-primary text-background hover:bg-primary/90 font-bold rounded-xl disabled:opacity-50"
                      data-testid="button-notify-me"
                    >
                      {loading ? (
                        <span className="animate-pulse">Joining...</span>
                      ) : (
                        <>
                          <Bell className="w-4 h-4 mr-2" />
                          Notify Me
                        </>
                      )}
                    </Button>
                  </div>
                  {message && !subscribed && (
                    <p className="text-sm text-red-400">{message}</p>
                  )}
                </>
              ) : (
                <div className="flex items-center gap-2 text-green-400">
                  <Sparkles className="w-5 h-5" />
                  <span className="font-medium">{message || "You're on the list! We'll notify you at launch."}</span>
                </div>
              )}
            </motion.div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 perspective-1000">
            <LockedBentoCard span={2} glow>
              <div className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 rounded-lg bg-primary/20">
                    <Code2 className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="text-lg font-bold text-white">AI Code Editor</h3>
                </div>
                <div className="aspect-video bg-black/40 rounded-xl border border-white/10 overflow-hidden">
                  <div className="h-8 bg-white/5 border-b border-white/10 flex items-center px-4 gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500/50" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                    <div className="w-3 h-3 rounded-full bg-green-500/50" />
                    <span className="text-xs text-white/40 ml-4">contract.dwv</span>
                  </div>
                  <div className="p-4 font-mono text-sm">
                    <div className="text-purple-400">contract <span className="text-cyan-400">MyToken</span> {"{"}</div>
                    <div className="text-white/60 pl-4">name: <span className="text-green-400">"DarkWave Token"</span></div>
                    <div className="text-white/60 pl-4">symbol: <span className="text-green-400">"DWT"</span></div>
                    <div className="text-white/60 pl-4">supply: <span className="text-yellow-400">100_000_000</span></div>
                    <div className="text-purple-400">{"}"}</div>
                  </div>
                </div>
              </div>
            </LockedBentoCard>

            <LockedBentoCard glow>
              <div className="p-6 h-full flex flex-col">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 rounded-lg bg-cyan-500/20">
                    <Eye className="w-5 h-5 text-cyan-400" />
                  </div>
                  <h3 className="text-lg font-bold text-white">Live Preview</h3>
                </div>
                <div className="flex-grow bg-gradient-to-br from-primary/10 to-secondary/10 rounded-xl border border-white/10 flex items-center justify-center">
                  <Globe className="w-12 h-12 text-primary/30" />
                </div>
              </div>
            </LockedBentoCard>

            <LockedBentoCard>
              <div className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 rounded-lg bg-green-500/20">
                    <Terminal className="w-5 h-5 text-green-400" />
                  </div>
                  <h3 className="text-lg font-bold text-white">Console</h3>
                </div>
                <div className="bg-black/40 rounded-lg p-3 font-mono text-xs">
                  <div className="text-green-400">$ darkwave deploy</div>
                  <div className="text-white/60">Compiling contract...</div>
                  <div className="text-cyan-400">✓ Deployed to devnet</div>
                </div>
              </div>
            </LockedBentoCard>

            <LockedBentoCard span={2}>
              <div className="p-6">
                <FeatureCarousel />
              </div>
            </LockedBentoCard>

            <LockedBentoCard>
              <div className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 rounded-lg bg-purple-500/20">
                    <Brain className="w-5 h-5 text-purple-400" />
                  </div>
                  <h3 className="text-lg font-bold text-white">AI Assistant</h3>
                </div>
                <div className="space-y-3">
                  <div className="bg-white/5 rounded-lg p-3 text-sm text-white/70">
                    "Add a transfer function with balance checks"
                  </div>
                  <div className="bg-primary/10 rounded-lg p-3 text-sm text-primary border border-primary/20">
                    <Sparkles className="w-4 h-4 inline mr-2" />
                    Generating code...
                  </div>
                </div>
              </div>
            </LockedBentoCard>

            <LockedBentoCard>
              <div className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 rounded-lg bg-orange-500/20">
                    <Cpu className="w-5 h-5 text-orange-400" />
                  </div>
                  <h3 className="text-lg font-bold text-white">Cloud Compute</h3>
                </div>
                <div className="text-3xl font-bold text-white mb-1">Unlimited</div>
                <div className="text-sm text-muted-foreground">Build minutes included</div>
              </div>
            </LockedBentoCard>

            <LockedBentoCard>
              <div className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 rounded-lg bg-blue-500/20">
                    <Database className="w-5 h-5 text-blue-400" />
                  </div>
                  <h3 className="text-lg font-bold text-white">Persistent Storage</h3>
                </div>
                <div className="text-3xl font-bold text-white mb-1">10 GB</div>
                <div className="text-sm text-muted-foreground">Per project</div>
              </div>
            </LockedBentoCard>

            <LockedBentoCard>
              <div className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 rounded-lg bg-pink-500/20">
                    <GitBranch className="w-5 h-5 text-pink-400" />
                  </div>
                  <h3 className="text-lg font-bold text-white">Version Control</h3>
                </div>
                <div className="text-3xl font-bold text-white mb-1">Git</div>
                <div className="text-sm text-muted-foreground">Built-in integration</div>
              </div>
            </LockedBentoCard>
          </div>
        </section>

        <section className="container mx-auto px-6 mb-20">
          <h2 className="text-3xl font-display font-bold text-center mb-12">Powerful Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ scale: 1.02, rotateY: 5 }}
                className="group relative p-6 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm"
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
                <div className="absolute top-4 right-4">
                  <Lock className="w-4 h-4 text-white/30" />
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        <section className="container mx-auto px-6">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-primary/20 to-secondary/20 border border-primary/30 p-12 text-center">
            <div className="absolute inset-0 bg-grid-pattern opacity-10" />
            <div className="relative z-10">
              <Box className="w-16 h-16 text-primary mx-auto mb-6" />
              <h2 className="text-4xl font-display font-bold mb-4">Be First in Line</h2>
              <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                Join the waitlist and get exclusive early access to DarkWave Dev Studio 
                when it launches. Build the future of blockchain development.
              </p>
              <div className="flex items-center justify-center gap-4">
                <Badge className="bg-primary/20 text-primary border-primary/30 px-4 py-2">
                  <Sparkles className="w-4 h-4 mr-2" />
                  Early Access Benefits
                </Badge>
                <Badge className="bg-white/10 text-white border-white/20 px-4 py-2">
                  Free for DWT Holders
                </Badge>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
