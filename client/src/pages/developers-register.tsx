import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { ArrowLeft, Key, Copy, Check, Shield, Zap, Code, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/use-auth";
import { Footer } from "@/components/footer";
import orbitLogo from "@assets/generated_images/futuristic_abstract_geometric_logo_symbol_for_orbit.png";

function GlassCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`relative overflow-hidden rounded-xl p-6 bg-[rgba(12,18,36,0.65)] backdrop-blur-2xl border border-white/[0.08] shadow-lg shadow-black/20 ${className}`}>
      {children}
    </div>
  );
}

export default function DevelopersRegister() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const [appName, setAppName] = useState("");
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleRegister = async () => {
    if (!appName.trim()) {
      setError("Please enter your application name");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch("/api/developer/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ appName: appName.trim() }),
      });

      const data = await response.json();

      if (response.ok) {
        setApiKey(data.apiKey);
      } else {
        setError(data.error || "Failed to register");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyToClipboard = () => {
    if (apiKey) {
      navigator.clipboard.writeText(apiKey);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-background/90 backdrop-blur-xl">
        <div className="container mx-auto px-4 h-14 flex items-center">
          <Link href="/" className="flex items-center gap-2">
            <img src={orbitLogo} alt="DarkWave" className="w-7 h-7" />
            <span className="font-display font-bold text-lg tracking-tight">DarkWave</span>
          </Link>
        </div>
      </nav>

      <main className="pt-24 pb-12 px-4">
        <div className="container max-w-lg mx-auto">
          <Link href="/developers">
            <Button variant="ghost" size="sm" className="mb-6 gap-2 text-muted-foreground hover:text-white" data-testid="link-back-developers">
              <ArrowLeft className="w-4 h-4" />
              Back to Developers
            </Button>
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <GlassCard>
              <div className="text-center mb-6">
                <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
                  <Key className="w-8 h-8 text-primary" />
                </div>
                <h1 className="text-2xl font-display font-bold mb-2">Developer Registration</h1>
                <p className="text-sm text-muted-foreground">Get your API key to build on DarkWave Chain</p>
              </div>

              {isLoading ? (
                <div className="text-center py-8">
                  <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
                  <p className="text-sm text-muted-foreground mt-4">Loading...</p>
                </div>
              ) : !isAuthenticated ? (
                <div className="space-y-6">
                  <div className="text-center py-4">
                    <Shield className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-sm text-muted-foreground mb-6">
                      Sign in with your account to register as a developer
                    </p>
                    <a href="/api/login">
                      <Button className="w-full bg-primary text-background hover:bg-primary/90 font-semibold" data-testid="button-login-register">
                        Sign In to Continue
                      </Button>
                    </a>
                  </div>

                  <div className="border-t border-white/10 pt-6">
                    <p className="text-xs text-center text-muted-foreground">
                      Supports Google, GitHub, Apple, and Email login
                    </p>
                  </div>
                </div>
              ) : apiKey ? (
                <div className="space-y-6">
                  <div className="text-center">
                    <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4">
                      <Check className="w-6 h-6 text-green-400" />
                    </div>
                    <h2 className="text-lg font-bold text-green-400 mb-2">Registration Successful!</h2>
                    <p className="text-sm text-muted-foreground">
                      Your API key has been generated. Save it securely - it won't be shown again!
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">Your API Key</Label>
                    <div className="flex gap-2">
                      <Input 
                        value={apiKey} 
                        readOnly 
                        className="font-mono text-xs bg-black/30 border-white/10"
                        data-testid="input-api-key"
                      />
                      <Button 
                        variant="outline" 
                        size="icon"
                        onClick={copyToClipboard}
                        className="shrink-0 border-white/10"
                        data-testid="button-copy-key"
                      >
                        {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                      </Button>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Link href="/doc-hub" className="flex-1">
                      <Button variant="outline" className="w-full border-white/10" data-testid="link-docs">
                        View Docs
                      </Button>
                    </Link>
                    <Link href="/api-playground" className="flex-1">
                      <Button className="w-full bg-primary text-background" data-testid="link-playground">
                        Try API
                      </Button>
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                    <p className="text-sm">
                      <span className="text-muted-foreground">Signed in as:</span>{" "}
                      <span className="font-medium">{user?.email}</span>
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="appName" className="text-sm">Application Name</Label>
                    <Input
                      id="appName"
                      placeholder="My Awesome DApp"
                      value={appName}
                      onChange={(e) => setAppName(e.target.value)}
                      className="bg-black/30 border-white/10"
                      data-testid="input-app-name"
                    />
                  </div>

                  {error && (
                    <p className="text-sm text-red-400" data-testid="text-error">{error}</p>
                  )}

                  <Button 
                    className="w-full bg-primary text-background hover:bg-primary/90 font-semibold"
                    onClick={handleRegister}
                    disabled={isSubmitting}
                    data-testid="button-register"
                  >
                    {isSubmitting ? "Registering..." : "Get API Key"}
                  </Button>
                </div>
              )}
            </GlassCard>

            <div className="mt-8 grid grid-cols-3 gap-4">
              <GlassCard className="text-center p-4">
                <Zap className="w-6 h-6 text-primary mx-auto mb-2" />
                <p className="text-xs text-muted-foreground">200K+ TPS</p>
              </GlassCard>
              <GlassCard className="text-center p-4">
                <Shield className="w-6 h-6 text-secondary mx-auto mb-2" />
                <p className="text-xs text-muted-foreground">Secure</p>
              </GlassCard>
              <GlassCard className="text-center p-4">
                <Code className="w-6 h-6 text-cyan-400 mx-auto mb-2" />
                <p className="text-xs text-muted-foreground">Easy SDK</p>
              </GlassCard>
            </div>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
