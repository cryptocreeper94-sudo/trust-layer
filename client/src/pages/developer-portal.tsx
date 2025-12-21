import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "wouter";
import { 
  ArrowLeft, Lock, Eye, Users, TrendingUp, Globe, Code, 
  ChevronDown, ChevronRight, BarChart3, Activity, Layers, 
  Zap, Database, Shield, Terminal, FileCode, BookOpen,
  ExternalLink, Copy, Check, RefreshCw
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { Footer } from "@/components/footer";
import orbitLogo from "@assets/generated_images/futuristic_abstract_geometric_logo_symbol_for_orbit.png";
import { APP_VERSION } from "@shared/schema";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface AnalyticsOverview {
  totalViews: number;
  uniqueVisitors: number;
  todayViews: number;
  topPages: { page: string; views: number }[];
  topReferrers: { referrer: string; count: number }[];
  dailyTrend: { date: string; views: number; unique: number }[];
}

async function verifyPin(pin: string): Promise<boolean> {
  const response = await fetch("/api/developer/auth", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ pin }),
  });
  return response.ok;
}

async function fetchAnalytics(): Promise<AnalyticsOverview> {
  const response = await fetch("/api/developer/analytics");
  if (!response.ok) throw new Error("Failed to fetch analytics");
  return response.json();
}

function BentoCard({ 
  children, 
  className = "", 
  span = 1,
  glow = false 
}: { 
  children: React.ReactNode; 
  className?: string; 
  span?: 1 | 2 | 3;
  glow?: boolean;
}) {
  const spanClass = span === 2 ? "md:col-span-2" : span === 3 ? "md:col-span-3" : "";
  
  return (
    <motion.div
      whileHover={{ 
        scale: 1.02, 
        rotateX: 2,
        rotateY: 2,
        z: 50 
      }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      style={{ transformStyle: "preserve-3d", perspective: 1000 }}
      className={`
        ${spanClass}
        bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6
        hover:border-primary/50 transition-all duration-300
        ${glow ? "shadow-[0_0_30px_rgba(0,255,255,0.15)] hover:shadow-[0_0_50px_rgba(0,255,255,0.25)]" : ""}
        ${className}
      `}
    >
      {children}
    </motion.div>
  );
}

function StatCard({ 
  label, 
  value, 
  icon: Icon, 
  trend,
  color = "primary" 
}: { 
  label: string; 
  value: string | number; 
  icon: any;
  trend?: string;
  color?: "primary" | "secondary" | "accent";
}) {
  const colorClasses = {
    primary: "text-primary bg-primary/10 border-primary/30",
    secondary: "text-secondary bg-secondary/10 border-secondary/30",
    accent: "text-cyan-400 bg-cyan-400/10 border-cyan-400/30",
  };
  
  return (
    <BentoCard glow>
      <div className="flex items-start justify-between">
        <div className={`p-3 rounded-xl ${colorClasses[color]}`}>
          <Icon className="w-6 h-6" />
        </div>
        {trend && (
          <Badge variant="outline" className="text-green-400 border-green-400/30 bg-green-400/10">
            {trend}
          </Badge>
        )}
      </div>
      <div className="mt-4">
        <p className="text-3xl font-bold font-display" data-testid={`stat-${label.toLowerCase().replace(/\s/g, '-')}`}>{value.toLocaleString()}</p>
        <p className="text-sm text-muted-foreground mt-1">{label}</p>
      </div>
    </BentoCard>
  );
}

function MiniChart({ data }: { data: { date: string; views: number; unique: number }[] }) {
  if (!data.length) return null;
  
  const maxViews = Math.max(...data.map(d => d.views), 1);
  
  return (
    <div className="flex items-end gap-1 h-24">
      {data.map((day, i) => (
        <div key={day.date} className="flex-1 flex flex-col items-center gap-1">
          <div 
            className="w-full bg-primary/80 rounded-t transition-all hover:bg-primary"
            style={{ height: `${(day.views / maxViews) * 100}%`, minHeight: 4 }}
            title={`${day.date}: ${day.views} views`}
          />
          <span className="text-[10px] text-muted-foreground">
            {new Date(day.date).toLocaleDateString('en', { weekday: 'short' }).charAt(0)}
          </span>
        </div>
      ))}
    </div>
  );
}

function HorizontalCarousel({ items }: { items: { title: string; description: string; icon: any }[] }) {
  return (
    <div className="overflow-x-auto scrollbar-hide">
      <div className="flex gap-4 pb-4 min-w-max">
        {items.map((item, i) => (
          <motion.div
            key={i}
            whileHover={{ scale: 1.05, y: -5 }}
            className="w-64 shrink-0 bg-gradient-to-br from-white/5 to-white/0 border border-white/10 rounded-xl p-5 cursor-pointer hover:border-primary/50 transition-colors"
          >
            <div className="p-2 w-fit rounded-lg bg-primary/10 text-primary mb-3">
              <item.icon className="w-5 h-5" />
            </div>
            <h4 className="font-semibold text-white mb-1">{item.title}</h4>
            <p className="text-sm text-muted-foreground">{item.description}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function PinModal({ onSuccess }: { onSuccess: () => void }) {
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    const valid = await verifyPin(pin);
    if (valid) {
      localStorage.setItem("dev-portal-auth", "true");
      onSuccess();
    } else {
      setError("Invalid PIN. Please try again.");
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xl">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="w-full max-w-md mx-4"
      >
        <Card className="bg-black/60 border-white/10 p-8 backdrop-blur-xl">
          <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-primary/10 border border-primary/30 flex items-center justify-center">
              <Lock className="w-8 h-8 text-primary" />
            </div>
            <h2 className="text-2xl font-display font-bold text-white">Developer Access</h2>
            <p className="text-muted-foreground mt-2">Enter your PIN to access the developer portal</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="password"
              placeholder="Enter PIN"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              className="text-center text-2xl tracking-[0.5em] bg-white/5 border-white/10 h-14"
              maxLength={4}
              data-testid="input-pin"
            />
            
            {error && (
              <p className="text-red-400 text-sm text-center">{error}</p>
            )}

            <Button
              type="submit"
              className="w-full h-12 bg-primary text-black font-bold hover:bg-primary/90"
              disabled={loading || pin.length !== 4}
              data-testid="button-submit-pin"
            >
              {loading ? "Verifying..." : "Access Portal"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <Link href="/">
              <span className="text-sm text-muted-foreground hover:text-white transition-colors cursor-pointer">
                Return to Home
              </span>
            </Link>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}

export default function DeveloperPortal() {
  const [authenticated, setAuthenticated] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);

  useEffect(() => {
    const auth = localStorage.getItem("dev-portal-auth");
    if (auth === "true") {
      setAuthenticated(true);
    }
  }, []);

  const { data: analytics, isLoading, refetch } = useQuery({
    queryKey: ["developer-analytics"],
    queryFn: fetchAnalytics,
    enabled: authenticated,
    refetchInterval: 30000,
  });

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const quickLinks = [
    { title: "API Documentation", description: "Complete API reference", icon: FileCode },
    { title: "SDK Downloads", description: "Client libraries for all platforms", icon: Code },
    { title: "Tutorials", description: "Step-by-step guides", icon: BookOpen },
    { title: "Block Explorer", description: "View chain activity", icon: Database },
    { title: "Smart Contracts", description: "Contract templates", icon: Layers },
    { title: "Security Audits", description: "Security reports", icon: Shield },
  ];

  const codeSnippets = [
    {
      title: "Connect to DarkWave Chain",
      language: "typescript",
      code: `import { DarkWaveProvider } from '@darkwave/sdk';

const provider = new DarkWaveProvider({
  chainId: 8453,
  rpcUrl: 'https://rpc.darkwavechain.io'
});

await provider.connect();`,
    },
    {
      title: "Send Transaction",
      language: "typescript",
      code: `const tx = await provider.sendTransaction({
  to: '0x...',
  value: '1000000000000000000', // 1 DWT
  data: '0x'
});

console.log('TX Hash:', tx.hash);`,
    },
  ];

  if (!authenticated) {
    return <PinModal onSuccess={() => setAuthenticated(true)} />;
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-md">
        <div className="container mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/">
            <div className="flex items-center gap-2 text-muted-foreground hover:text-white transition-colors cursor-pointer group">
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              <span className="font-display font-medium">Back</span>
            </div>
          </Link>
          <div className="flex items-center gap-3">
            <img src={orbitLogo} alt="Logo" className="w-8 h-8" />
            <span className="font-display font-bold text-xl">Developer Portal</span>
            <Badge variant="outline" className="text-primary border-primary/30">v{APP_VERSION}</Badge>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => refetch()}
            disabled={isLoading}
            data-testid="button-refresh"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </nav>

      <main className="flex-1 pt-32 pb-20 container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-cyan-400 to-secondary">
                Developer Dashboard
              </span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Complete overview of your DarkWave Chain ecosystem. Monitor analytics, manage resources, and access developer tools.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <StatCard 
              label="Total Page Views" 
              value={analytics?.totalViews || 0} 
              icon={Eye}
              trend="+12%"
              color="primary"
            />
            <StatCard 
              label="Unique Visitors" 
              value={analytics?.uniqueVisitors || 0} 
              icon={Users}
              trend="+8%"
              color="secondary"
            />
            <StatCard 
              label="Today's Views" 
              value={analytics?.todayViews || 0} 
              icon={TrendingUp}
              color="accent"
            />
            <StatCard 
              label="Active Pages" 
              value={analytics?.topPages?.length || 0} 
              icon={Globe}
              color="primary"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <BentoCard span={2} glow>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-display font-bold text-lg flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-primary" />
                  Weekly Traffic
                </h3>
                <Badge variant="outline" className="text-muted-foreground">Last 7 days</Badge>
              </div>
              <MiniChart data={analytics?.dailyTrend || []} />
            </BentoCard>

            <BentoCard>
              <h3 className="font-display font-bold text-lg mb-4 flex items-center gap-2">
                <Activity className="w-5 h-5 text-secondary" />
                Top Pages
              </h3>
              <div className="space-y-3 max-h-40 overflow-y-auto scrollbar-hide">
                {analytics?.topPages?.length ? (
                  analytics.topPages.map((page, i) => (
                    <div key={page.page} className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground truncate">{page.page}</span>
                      <Badge variant="secondary" className="shrink-0">{page.views}</Badge>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">No page data yet</p>
                )}
              </div>
            </BentoCard>
          </div>

          <BentoCard span={3}>
            <h3 className="font-display font-bold text-lg mb-4 flex items-center gap-2">
              <Zap className="w-5 h-5 text-primary" />
              Quick Access
            </h3>
            <HorizontalCarousel items={quickLinks} />
          </BentoCard>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <BentoCard glow>
              <h3 className="font-display font-bold text-lg mb-4 flex items-center gap-2">
                <Terminal className="w-5 h-5 text-primary" />
                Code Snippets
              </h3>
              <Accordion type="single" collapsible className="space-y-2">
                {codeSnippets.map((snippet, i) => (
                  <AccordionItem key={i} value={`snippet-${i}`} className="border-white/10">
                    <AccordionTrigger className="text-sm font-medium hover:text-primary">
                      {snippet.title}
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="relative">
                        <pre className="bg-black/40 rounded-lg p-4 text-xs overflow-x-auto">
                          <code className="text-green-400">{snippet.code}</code>
                        </pre>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="absolute top-2 right-2"
                          onClick={() => copyToClipboard(snippet.code, `snippet-${i}`)}
                        >
                          {copied === `snippet-${i}` ? (
                            <Check className="w-4 h-4 text-green-400" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </Button>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </BentoCard>

            <BentoCard glow>
              <h3 className="font-display font-bold text-lg mb-4 flex items-center gap-2">
                <Database className="w-5 h-5 text-secondary" />
                Chain Information
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 rounded-lg bg-white/5">
                  <span className="text-muted-foreground">Chain ID</span>
                  <span className="font-mono font-bold text-primary">8453</span>
                </div>
                <div className="flex justify-between items-center p-3 rounded-lg bg-white/5">
                  <span className="text-muted-foreground">Native Token</span>
                  <span className="font-mono font-bold">DWT</span>
                </div>
                <div className="flex justify-between items-center p-3 rounded-lg bg-white/5">
                  <span className="text-muted-foreground">Total Supply</span>
                  <span className="font-mono font-bold">100,000,000</span>
                </div>
                <div className="flex justify-between items-center p-3 rounded-lg bg-white/5">
                  <span className="text-muted-foreground">Block Time</span>
                  <span className="font-mono font-bold text-green-400">400ms</span>
                </div>
                <div className="flex justify-between items-center p-3 rounded-lg bg-white/5">
                  <span className="text-muted-foreground">Consensus</span>
                  <span className="font-mono font-bold">PoA</span>
                </div>
              </div>
            </BentoCard>
          </div>

          <BentoCard span={3}>
            <h3 className="font-display font-bold text-lg mb-4 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-primary" />
              Documentation
            </h3>
            <Accordion type="multiple" className="space-y-2">
              <AccordionItem value="getting-started" className="border-white/10">
                <AccordionTrigger className="text-sm font-medium hover:text-primary">
                  Getting Started
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  Welcome to DarkWave Chain! To get started, install our SDK using npm or yarn, 
                  configure your connection to the network, and start building decentralized applications.
                  Our comprehensive guides will walk you through every step.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="api-reference" className="border-white/10">
                <AccordionTrigger className="text-sm font-medium hover:text-primary">
                  API Reference
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  Our JSON-RPC API provides endpoints for querying chain state, submitting transactions,
                  and interacting with smart contracts. All endpoints are documented with examples 
                  in TypeScript, Python, and Go.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="smart-contracts" className="border-white/10">
                <AccordionTrigger className="text-sm font-medium hover:text-primary">
                  Smart Contracts
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  DarkWave Chain supports WebAssembly-based smart contracts for maximum performance 
                  and security. Deploy contracts in Rust, AssemblyScript, or any WASM-compatible language.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="security" className="border-white/10">
                <AccordionTrigger className="text-sm font-medium hover:text-primary">
                  Security Best Practices
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  Learn how to secure your dApps and smart contracts. We cover key management, 
                  input validation, gas optimization, and common vulnerability patterns to avoid.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </BentoCard>

          <BentoCard>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display font-bold text-lg flex items-center gap-2">
                <Globe className="w-5 h-5 text-cyan-400" />
                Traffic Sources
              </h3>
            </div>
            <div className="space-y-3 max-h-48 overflow-y-auto scrollbar-hide">
              {analytics?.topReferrers?.length ? (
                analytics.topReferrers.map((ref, i) => (
                  <div key={ref.referrer} className="flex items-center justify-between p-2 rounded-lg bg-white/5">
                    <span className="text-sm text-muted-foreground truncate">{ref.referrer || "Direct"}</span>
                    <Badge variant="outline">{ref.count}</Badge>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">No referrer data yet</p>
              )}
            </div>
          </BentoCard>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}
