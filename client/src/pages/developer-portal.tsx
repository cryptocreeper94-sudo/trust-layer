import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "wouter";
import { 
  ArrowLeft, Lock, Eye, Users, TrendingUp, Globe, Code, 
  ChevronDown, ChevronRight, BarChart3, Activity, Layers, 
  Zap, Database, Shield, Terminal, FileCode, BookOpen,
  ExternalLink, Copy, Check, RefreshCw, Key, AlertTriangle
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

async function verifyPin(pin: string): Promise<{ success: boolean; sessionToken?: string }> {
  const response = await fetch("/api/developer/auth", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ pin }),
  });
  if (!response.ok) return { success: false };
  const data = await response.json();
  if (data.sessionToken) {
    sessionStorage.setItem("dev-session-token", data.sessionToken);
  }
  return { success: true, sessionToken: data.sessionToken };
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
      whileHover={{ scale: 1.02, y: -2 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      className={`relative group ${spanClass} ${className}`}
    >
      <div className={`
        relative h-full overflow-hidden rounded-xl p-5
        bg-[rgba(12,18,36,0.65)] backdrop-blur-2xl
        border border-white/[0.08]
        ${glow ? 'shadow-[0_0_40px_rgba(0,255,255,0.15)]' : 'shadow-lg shadow-black/20'}
        transition-all duration-300
      `}>
        {children}
      </div>
      {glow && (
        <div className="absolute -inset-[1px] rounded-xl bg-gradient-to-r from-primary/30 via-cyan-400/20 to-secondary/30 -z-10 blur-sm opacity-50" />
      )}
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
    
    const result = await verifyPin(pin);
    if (result.success) {
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

async function registerApiKey(name: string, email: string, appName: string): Promise<{ success: boolean; apiKey?: string; error?: string }> {
  const sessionToken = sessionStorage.getItem("dev-session-token");
  if (!sessionToken) {
    return { success: false, error: "Session expired. Please refresh and re-enter your PIN." };
  }
  
  const response = await fetch("/api/developer/register", {
    method: "POST",
    headers: { 
      "Content-Type": "application/json",
      "X-Developer-Session": sessionToken,
    },
    body: JSON.stringify({ name, email, appName }),
  });
  const data = await response.json();
  if (!response.ok) {
    return { success: false, error: data.error || "Registration failed" };
  }
  return { success: true, apiKey: data.apiKey };
}

export default function DeveloperPortal() {
  const [authenticated, setAuthenticated] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regAppName, setRegAppName] = useState("");
  const [regLoading, setRegLoading] = useState(false);
  const [regResult, setRegResult] = useState<{ apiKey?: string; error?: string } | null>(null);

  useEffect(() => {
    const auth = localStorage.getItem("dev-portal-auth");
    if (auth === "true") {
      setAuthenticated(true);
    }
  }, []);

  const handleRegister = async () => {
    if (!regName || !regEmail || !regAppName) return;
    setRegLoading(true);
    setRegResult(null);
    const result = await registerApiKey(regName, regEmail, regAppName);
    setRegResult(result.success ? { apiKey: result.apiKey } : { error: result.error });
    setRegLoading(false);
    if (result.success) {
      setRegName("");
      setRegEmail("");
      setRegAppName("");
    }
  };

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
      title: "1. Install SDK",
      language: "bash",
      code: `# Install DarkWave SDK
npm install @darkwave/sdk

# Or use the built-in SDK from your server
import { DarkWaveClient } from '@shared/darkwave-sdk';`,
    },
    {
      title: "2. Initialize Client with API Key",
      language: "typescript",
      code: `import { DarkWaveClient } from '@shared/darkwave-sdk';

const client = new DarkWaveClient({
  rpcUrl: 'https://api.darkwavechain.io',
  apiKey: 'dwc_your_api_key_here',
  chainId: 8453
});

// Get chain info
const info = await client.getChainInfo();
console.log('Block height:', info.blockHeight);`,
    },
    {
      title: "3. Submit Hash to DarkWave Smart Chain",
      language: "typescript",
      code: `// Hash your application data to DarkWave Smart Chain
const result = await fetch('/api/hash/submit', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-API-Key': 'dwc_your_api_key'
  },
  body: JSON.stringify({
    dataHash: '0x1234...', // Your data hash
    category: 'application',
    appId: 'my-app'
  })
});

const { txHash, status, fee } = await result.json();
console.log('Transaction:', txHash, status, fee);`,
    },
    {
      title: "4. Check Transaction Status",
      language: "typescript",
      code: `// Look up a transaction by hash
const tx = await fetch('/api/hash/0x1234...');
const data = await tx.json();

console.log({
  txHash: data.txHash,
  dataHash: data.dataHash,
  status: data.status,      // 'pending' | 'confirmed'
  blockHeight: data.blockHeight,
  fee: data.fee
});`,
    },
  ];

  if (!authenticated) {
    return <PinModal onSuccess={() => setAuthenticated(true)} />;
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-background/90 backdrop-blur-xl">
        <div className="container mx-auto px-4 h-14 flex items-center">
          <Link href="/" className="flex items-center gap-2 mr-auto">
            <img src={orbitLogo} alt="DarkWave" className="w-7 h-7" />
            <span className="font-display font-bold text-lg tracking-tight">DarkWave</span>
          </Link>
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="text-primary border-primary/30 text-[10px]">v{APP_VERSION}</Badge>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => refetch()}
              disabled={isLoading}
              className="h-7 w-7 p-0"
              data-testid="button-refresh"
            >
              <RefreshCw className={`w-3 h-3 ${isLoading ? 'animate-spin' : ''}`} />
            </Button>
            <Link href="/">
              <Button variant="ghost" size="sm" className="h-8 text-xs gap-1.5 hover:bg-white/5">
                <ArrowLeft className="w-3 h-3" /> Back
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      <main className="flex-1 pt-20 pb-12 container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-cyan-400 to-secondary">
                Team Dashboard
              </span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Internal team overview of DarkWave Smart Chain ecosystem. Monitor analytics, manage resources, and access admin tools.
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

          <BentoCard span={3} glow>
            <h3 className="font-display font-bold text-lg mb-4 flex items-center gap-2">
              <Key className="w-5 h-5 text-primary" />
              Register API Key
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              Get an API key to start hashing your app data to DarkWave Smart Chain. Each submission costs a small fee in DWC.
            </p>
            
            {regResult?.apiKey ? (
              <div className="space-y-4">
                <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/30">
                  <p className="text-green-400 font-medium mb-2 flex items-center gap-2">
                    <Check className="w-4 h-4" />
                    API Key Generated Successfully!
                  </p>
                  <p className="text-xs text-muted-foreground mb-3">
                    Save this key securely - it won't be shown again!
                  </p>
                  <div className="flex items-center gap-2">
                    <code className="flex-1 bg-black/40 px-3 py-2 rounded text-sm font-mono text-primary break-all">
                      {regResult.apiKey}
                    </code>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(regResult.apiKey!, "api-key")}
                      data-testid="button-copy-api-key"
                    >
                      {copied === "api-key" ? (
                        <Check className="w-4 h-4 text-green-400" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                </div>
                <Button variant="outline" onClick={() => setRegResult(null)} data-testid="button-register-another">
                  Register Another Key
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Input
                  placeholder="Your Name"
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  className="bg-black/40 border-white/10"
                  data-testid="input-reg-name"
                />
                <Input
                  placeholder="Email Address"
                  type="email"
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  className="bg-black/40 border-white/10"
                  data-testid="input-reg-email"
                />
                <Input
                  placeholder="App Name"
                  value={regAppName}
                  onChange={(e) => setRegAppName(e.target.value)}
                  className="bg-black/40 border-white/10"
                  data-testid="input-reg-app-name"
                />
                <Button
                  onClick={handleRegister}
                  disabled={regLoading || !regName || !regEmail || !regAppName}
                  className="bg-primary hover:bg-primary/90"
                  data-testid="button-register-api-key"
                >
                  {regLoading ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <Key className="w-4 h-4 mr-2" />
                      Get API Key
                    </>
                  )}
                </Button>
              </div>
            )}
            
            {regResult?.error && (
              <div className="mt-4 p-3 rounded-lg bg-red-500/10 border border-red-500/30 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-red-400" />
                <span className="text-red-400 text-sm">{regResult.error}</span>
              </div>
            )}
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
                  <span className="font-mono font-bold">DWC</span>
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
                  <ol className="list-decimal list-inside space-y-2">
                    <li><strong>Register for an API Key</strong> - Use the form above to get your unique API key</li>
                    <li><strong>Install the SDK</strong> - Run <code className="bg-black/40 px-1 rounded">npm install @darkwave/sdk</code></li>
                    <li><strong>Initialize the client</strong> - Create a DarkWaveClient with your RPC URL and API key</li>
                    <li><strong>Start hashing</strong> - Submit your application data hashes to the chain</li>
                  </ol>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="api-endpoints" className="border-white/10">
                <AccordionTrigger className="text-sm font-medium hover:text-primary">
                  API Endpoints
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  <div className="space-y-2 font-mono text-xs">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-green-400 border-green-400/30">POST</Badge>
                      <span>/api/hash/submit</span> - Submit a hash (requires X-API-Key header)
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-blue-400 border-blue-400/30">GET</Badge>
                      <span>/api/hash/:txHash</span> - Get transaction details
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-blue-400 border-blue-400/30">GET</Badge>
                      <span>/api/gas/estimate</span> - Estimate gas for a transaction
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-blue-400 border-blue-400/30">GET</Badge>
                      <span>/api/fees/schedule</span> - Get current fee schedule
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-blue-400 border-blue-400/30">GET</Badge>
                      <span>/api/developer/transactions</span> - List your transactions
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="fees" className="border-white/10">
                <AccordionTrigger className="text-sm font-medium hover:text-primary">
                  Fee Structure
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  <div className="space-y-2">
                    <p>All transactions on DarkWave Smart Chain require a small fee paid in DWC:</p>
                    <ul className="list-disc list-inside space-y-1">
                      <li><strong>Base Fee:</strong> 21,000 gas units</li>
                      <li><strong>Hash Submission:</strong> 25,000 gas units</li>
                      <li><strong>Per Byte:</strong> 16 gas units for each byte of data</li>
                      <li><strong>Estimated Cost:</strong> ~$0.0001 per transaction</li>
                    </ul>
                    <p className="text-xs mt-2">Fees are automatically deducted from your DWC balance.</p>
                  </div>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="dual-chain" className="border-white/10">
                <AccordionTrigger className="text-sm font-medium hover:text-primary">
                  Dual-Chain Hashing (Solana + DarkWave)
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  <p className="mb-2">Hash your data to both chains simultaneously for maximum reliability:</p>
                  <pre className="bg-black/50 rounded-lg p-3 text-xs overflow-x-auto mb-3">
{`import { DualChainClient } from 'darkwave-sdk';
import { Connection, Keypair } from '@solana/web3.js';

// Your Solana wallet keypair
const solanaKeypair = Keypair.fromSecretKey(yourSecretKey);
const connection = new Connection('https://api.mainnet-beta.solana.com');

const client = new DualChainClient({
  darkwave: {
    rpcUrl: 'https://your-chain-url',
    apiKey: process.env.DARKWAVE_API_KEY
  },
  solana: {
    rpcUrl: 'https://api.mainnet-beta.solana.com',
    // Provide your own Solana submission function
    submitFn: async (hash, metadata) => {
      // Create and send your Memo transaction
      // Return the Solana signature
      return signature;
    }
  }
});

const result = await client.submitHash({
  dataHash: '0xabc123...',
  chains: ['darkwave', 'solana']
});

console.log('DarkWave TX:', result.darkwave?.txHash);
console.log('Solana TX:', result.solana?.txHash);
console.log('All successful:', result.allSuccessful);`}
                  </pre>
                  <p className="text-xs">Both chains store your hash independently for redundancy.</p>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="security" className="border-white/10">
                <AccordionTrigger className="text-sm font-medium hover:text-primary">
                  Security Best Practices
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  <ul className="list-disc list-inside space-y-1">
                    <li>Never expose your API key in client-side code</li>
                    <li>Store API keys in environment variables</li>
                    <li>Use HTTPS for all API requests</li>
                    <li>Implement rate limiting on your server</li>
                    <li>Monitor your transaction history for anomalies</li>
                  </ul>
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

          <BentoCard span={3} className="border-primary/20">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display font-bold text-lg flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary" />
                Launch Roadmap - February 14, 2026
              </h3>
              <Badge className="bg-primary/20 text-primary border-primary/30">INTERNAL</Badge>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Confidential launch timeline for DarkWave Smart Chain mainnet and DWC token release.
            </p>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="phase1" className="border-white/10">
                <AccordionTrigger className="text-sm font-medium hover:text-primary">
                  Phase 1: Foundation (December 2025)
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-white mb-2">Technical Milestones</h4>
                      <ul className="list-disc list-inside space-y-1 text-sm">
                        <li>Finalize blockchain audit scope and engage third-party security auditor</li>
                        <li>Implement block archival and state snapshotting</li>
                        <li>Stress-test 400ms block producer under load</li>
                        <li>Complete treasury policy documentation</li>
                        <li>Add transaction finality monitoring</li>
                        <li>Polish SDK and developer documentation</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-white mb-2">Marketing Foundation</h4>
                      <ul className="list-disc list-inside space-y-1 text-sm">
                        <li>Craft brand positioning and narrative deck</li>
                        <li>Create press kit with logos, screenshots, key messaging</li>
                        <li>Brief brand ambassadors and partners</li>
                        <li>Begin weekly developer blog posts</li>
                        <li>Set up social media presence (Twitter/X, Discord, Telegram)</li>
                        <li>Create teaser content for upcoming launch</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-white mb-2">Legal & Compliance</h4>
                      <ul className="list-disc list-inside space-y-1 text-sm">
                        <li>Ratify token distribution policy</li>
                        <li>Complete legal review of tokenomics</li>
                        <li>Prepare terms of service and privacy policy</li>
                        <li>Document regulatory considerations</li>
                      </ul>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="phase2" className="border-white/10">
                <AccordionTrigger className="text-sm font-medium hover:text-primary">
                  Phase 2: Testnet & Community (January 2026)
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-white mb-2">Technical Milestones</h4>
                      <ul className="list-disc list-inside space-y-1 text-sm">
                        <li>Launch public testnet with monitored load</li>
                        <li>Implement transaction finality dashboard</li>
                        <li>Build automated regression test suite</li>
                        <li>Complete security audit and remediation</li>
                        <li>Deploy vesting smart contracts</li>
                        <li>Finalize treasury distribution mechanisms</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-white mb-2">Developer Ecosystem</h4>
                      <ul className="list-disc list-inside space-y-1 text-sm">
                        <li>Host virtual hackathon with DWC prizes</li>
                        <li>Expand API rate limits for registered developers</li>
                        <li>Launch developer office hours program</li>
                        <li>Open Discord developer channels</li>
                        <li>Publish comprehensive API documentation</li>
                        <li>Release SDK v1.0</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-white mb-2">Marketing Push</h4>
                      <ul className="list-disc list-inside space-y-1 text-sm">
                        <li>Execute content sprint (technical articles, explainer videos)</li>
                        <li>Announce countdown to launch</li>
                        <li>Schedule influencer AMAs</li>
                        <li>Run partner webinars</li>
                        <li>Open whitelist for early supporters</li>
                        <li>Publish transparency dashboard</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-white mb-2">Community Building</h4>
                      <ul className="list-disc list-inside space-y-1 text-sm">
                        <li>Launch ambassador program</li>
                        <li>Create bounty program structure</li>
                        <li>Begin weekly ecosystem spotlights</li>
                        <li>Engage crypto media for coverage</li>
                      </ul>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="phase3" className="border-white/10">
                <AccordionTrigger className="text-sm font-medium hover:text-primary">
                  Phase 3: Pre-Launch (February 1-7, 2026)
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-white mb-2">Technical Readiness</h4>
                      <ul className="list-disc list-inside space-y-1 text-sm">
                        <li>Code freeze - no new features</li>
                        <li>Execute incident response drills</li>
                        <li>Migrate launch configs to production</li>
                        <li>Set up monitoring and alerting</li>
                        <li>Prepare rollback plans</li>
                        <li>Final security verification</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-white mb-2">Marketing Countdown</h4>
                      <ul className="list-disc list-inside space-y-1 text-sm">
                        <li>Daily countdown content</li>
                        <li>Finalize press embargo agreements</li>
                        <li>Prepare launch day assets</li>
                        <li>Brief all partners on launch timing</li>
                        <li>Schedule social media posts</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-white mb-2">Operations</h4>
                      <ul className="list-disc list-inside space-y-1 text-sm">
                        <li>Staff support team for launch week</li>
                        <li>Prepare FAQ and troubleshooting guides</li>
                        <li>Set up real-time metrics dashboard</li>
                        <li>Coordinate with ecosystem apps</li>
                      </ul>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="phase4" className="border-white/10">
                <AccordionTrigger className="text-sm font-medium hover:text-primary">
                  Phase 4: Launch Week (February 8-14, 2026)
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-white mb-2">February 8-13: Final Preparations</h4>
                      <ul className="list-disc list-inside space-y-1 text-sm">
                        <li>Go-live rehearsals</li>
                        <li>Final testnet verification</li>
                        <li>Liquidity seeding preparations</li>
                        <li>Media activation scheduling</li>
                        <li>Partner coordination calls</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-primary mb-2">February 14: LAUNCH DAY</h4>
                      <ul className="list-disc list-inside space-y-1 text-sm">
                        <li>Lift press embargo (6:00 AM UTC)</li>
                        <li>Execute genesis block ceremony</li>
                        <li>Mint initial token distribution</li>
                        <li>Livestream launch event</li>
                        <li>Showcase ecosystem app demos</li>
                        <li>Execute genesis airdrop</li>
                        <li>Seed DEX liquidity pools</li>
                        <li>Publish day-0 recap</li>
                      </ul>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="phase5" className="border-white/10">
                <AccordionTrigger className="text-sm font-medium hover:text-primary">
                  Phase 5: Post-Launch (February 15+)
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-white mb-2">Week 1 (Feb 15-21)</h4>
                      <ul className="list-disc list-inside space-y-1 text-sm">
                        <li>Monitor network stability</li>
                        <li>Publish performance statistics</li>
                        <li>Address any critical issues</li>
                        <li>Begin customer success stories</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-white mb-2">Ongoing</h4>
                      <ul className="list-disc list-inside space-y-1 text-sm">
                        <li>Monthly distribution reports</li>
                        <li>Weekly ecosystem spotlights</li>
                        <li>Developer bounty programs</li>
                        <li>Community AMAs</li>
                        <li>Partnership announcements</li>
                      </ul>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="tokenomics" className="border-white/10">
                <AccordionTrigger className="text-sm font-medium hover:text-primary">
                  Token Distribution Plan (100M DWC)
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="p-3 bg-white/5 rounded-lg">
                        <div className="text-2xl font-bold text-primary">40%</div>
                        <div className="text-xs">Ecosystem Growth</div>
                        <div className="text-xs text-muted-foreground">40M DWC - Grants, hackathons</div>
                      </div>
                      <div className="p-3 bg-white/5 rounded-lg">
                        <div className="text-2xl font-bold text-secondary">20%</div>
                        <div className="text-xs">Community & Liquidity</div>
                        <div className="text-xs text-muted-foreground">20M DWC - DEX, airdrops</div>
                      </div>
                      <div className="p-3 bg-white/5 rounded-lg">
                        <div className="text-2xl font-bold text-cyan-400">20%</div>
                        <div className="text-xs">Core Team</div>
                        <div className="text-xs text-muted-foreground">20M DWC - 4yr vest, 1yr cliff</div>
                      </div>
                      <div className="p-3 bg-white/5 rounded-lg">
                        <div className="text-2xl font-bold text-amber-400">10%</div>
                        <div className="text-xs">Strategic Partners</div>
                        <div className="text-xs text-muted-foreground">10M DWC - Advisors</div>
                      </div>
                    </div>
                    <div className="p-3 bg-white/5 rounded-lg text-center">
                      <div className="text-2xl font-bold text-emerald-400">10%</div>
                      <div className="text-xs">Treasury Reserve - 10M DWC</div>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="marketing" className="border-white/10">
                <AccordionTrigger className="text-sm font-medium hover:text-primary">
                  Marketing Strategy
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-white mb-2">Pre-Launch (Dec 2025 - Feb 7, 2026)</h4>
                      <ul className="list-disc list-inside space-y-1 text-sm">
                        <li>Brand Awareness: Position as next-gen L1 solution</li>
                        <li>Developer Focus: Technical content marketing</li>
                        <li>Community Building: Grow to 10,000+ members</li>
                        <li>Media Relations: Crypto publication coverage</li>
                        <li>Influencer Partnerships: Crypto thought leaders</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-white mb-2">Launch Day (Feb 14, 2026)</h4>
                      <ul className="list-disc list-inside space-y-1 text-sm">
                        <li>Coordinated press release at 6:00 AM UTC</li>
                        <li>Live event on YouTube/Twitter Spaces</li>
                        <li>Social blitz across all platforms</li>
                        <li>Ecosystem app showcases</li>
                        <li>Airdrops, giveaways, contests</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-white mb-2">Post-Launch (Feb 15+)</h4>
                      <ul className="list-disc list-inside space-y-1 text-sm">
                        <li>Daily/weekly performance metrics</li>
                        <li>Developer testimonials</li>
                        <li>Weekly AMAs and content</li>
                        <li>Ecosystem expansion announcements</li>
                      </ul>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </BentoCard>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}
