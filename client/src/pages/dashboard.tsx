import { useEffect } from "react";
import { Link } from "wouter";
import { ArrowLeft, User, Wallet, Code, Key, Activity, LogOut, Settings, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import orbitLogo from "@assets/generated_images/futuristic_abstract_geometric_logo_symbol_for_orbit.png";
import { Footer } from "@/components/footer";
import { GlassCard } from "@/components/glass-card";
import { useAuth } from "@/hooks/use-auth";
import { useState } from "react";

export default function Dashboard() {
  const { user, isLoading, isAuthenticated } = useAuth();
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      window.location.href = "/api/login";
    }
  }, [isLoading, isAuthenticated]);

  const handleCopy = async (text: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-primary">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
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
            <Badge variant="outline" className="border-green-500/50 text-green-400 text-[10px]">
              <span className="w-1.5 h-1.5 bg-green-400 rounded-full mr-1.5 animate-pulse" />
              Connected
            </Badge>
            <a href="/api/logout">
              <Button variant="ghost" size="sm" className="h-8 text-xs gap-1.5 hover:bg-white/5">
                <LogOut className="w-3 h-3" />
                Sign Out
              </Button>
            </a>
          </div>
        </div>
      </nav>

      <main className="flex-1 pt-20 pb-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="mb-8">
            <div className="flex items-center gap-4 mb-4">
              {user?.profileImageUrl ? (
                <img src={user.profileImageUrl} alt="" className="w-16 h-16 rounded-full border-2 border-primary/50" />
              ) : (
                <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
                  <User className="w-8 h-8 text-primary" />
                </div>
              )}
              <div>
                <h1 className="text-2xl md:text-3xl font-display font-bold">
                  Welcome, {user?.firstName || 'Developer'}
                </h1>
                <p className="text-sm text-muted-foreground">{user?.email}</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <GlassCard glow>
              <div className="p-5">
                <div className="flex items-center gap-2 mb-4">
                  <Wallet className="w-5 h-5 text-primary" />
                  <h3 className="font-bold">Token Balance</h3>
                </div>
                <div className="text-3xl font-bold text-white mb-2">0 DWT</div>
                <p className="text-xs text-muted-foreground mb-4">Connect wallet to view balance</p>
                <Button size="sm" className="w-full bg-primary text-background hover:bg-primary/90">
                  Connect Wallet
                </Button>
              </div>
            </GlassCard>

            <GlassCard>
              <div className="p-5">
                <div className="flex items-center gap-2 mb-4">
                  <Key className="w-5 h-5 text-cyan-400" />
                  <h3 className="font-bold">API Access</h3>
                </div>
                <p className="text-xs text-muted-foreground mb-4">
                  Generate API keys to integrate with DarkWave Chain
                </p>
                <Link href="/developers">
                  <Button size="sm" variant="outline" className="w-full border-primary/30 text-primary hover:bg-primary/10">
                    Get API Key
                  </Button>
                </Link>
              </div>
            </GlassCard>

            <GlassCard>
              <div className="p-5">
                <div className="flex items-center gap-2 mb-4">
                  <Activity className="w-5 h-5 text-green-400" />
                  <h3 className="font-bold">Recent Activity</h3>
                </div>
                <div className="space-y-2">
                  <div className="text-xs text-muted-foreground py-2 text-center border border-dashed border-white/10 rounded-lg">
                    No recent transactions
                  </div>
                </div>
              </div>
            </GlassCard>

            <GlassCard className="md:col-span-2">
              <div className="p-5">
                <div className="flex items-center gap-2 mb-4">
                  <Code className="w-5 h-5 text-secondary" />
                  <h3 className="font-bold">Developer Tools</h3>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <Link href="/api-playground">
                    <div className="p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors cursor-pointer text-center">
                      <Activity className="w-5 h-5 mx-auto mb-2 text-green-400" />
                      <div className="text-xs font-medium">API Playground</div>
                    </div>
                  </Link>
                  <Link href="/doc-hub">
                    <div className="p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors cursor-pointer text-center">
                      <Code className="w-5 h-5 mx-auto mb-2 text-primary" />
                      <div className="text-xs font-medium">Documentation</div>
                    </div>
                  </Link>
                  <Link href="/explorer">
                    <div className="p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors cursor-pointer text-center">
                      <Activity className="w-5 h-5 mx-auto mb-2 text-cyan-400" />
                      <div className="text-xs font-medium">Explorer</div>
                    </div>
                  </Link>
                  <Link href="/treasury">
                    <div className="p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors cursor-pointer text-center">
                      <Wallet className="w-5 h-5 mx-auto mb-2 text-yellow-400" />
                      <div className="text-xs font-medium">Treasury</div>
                    </div>
                  </Link>
                </div>
              </div>
            </GlassCard>

            <GlassCard>
              <div className="p-5">
                <div className="flex items-center gap-2 mb-4">
                  <Settings className="w-5 h-5 text-white/50" />
                  <h3 className="font-bold">Account</h3>
                </div>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">User ID</span>
                    <button 
                      onClick={() => handleCopy(user?.id || '')}
                      className="flex items-center gap-1 text-xs text-primary hover:underline"
                    >
                      {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                      {user?.id?.slice(0, 8)}...
                    </button>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Email</span>
                    <span className="text-xs">{user?.email || 'Not set'}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Role</span>
                    <Badge variant="outline" className="text-[10px]">Developer</Badge>
                  </div>
                </div>
              </div>
            </GlassCard>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
