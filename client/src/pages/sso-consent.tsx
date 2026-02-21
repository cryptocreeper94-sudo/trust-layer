import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Shield, Check, X, User, Mail, CreditCard, Wallet, Globe, Lock, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";

const PERMISSION_INFO: Record<string, { icon: React.ReactNode; label: string; desc: string }> = {
  "read:profile": { icon: <User className="w-4 h-4" />, label: "Your Profile", desc: "Name, avatar, and account creation date" },
  "read:email": { icon: <Mail className="w-4 h-4" />, label: "Your Email", desc: "Email address associated with your account" },
  "read:membership": { icon: <CreditCard className="w-4 h-4" />, label: "Membership Status", desc: "Trust Card number and member tier" },
  "read:wallet": { icon: <Wallet className="w-4 h-4" />, label: "Wallet Info", desc: "SIG balance and wallet address" },
};

interface SsoPendingApp {
  displayName: string;
  url: string;
  logoUrl: string | null;
  permissions: string[];
}

export default function SsoConsent() {
  const [, setLocation] = useLocation();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [appInfo, setAppInfo] = useState<SsoPendingApp | null>(null);

  useEffect(() => {
    fetch("/api/auth/sso/pending", { credentials: "include" })
      .then(res => res.json())
      .then(data => {
        if (data.pending && data.app) {
          setAppInfo(data.app);
        } else {
          setLocation("/");
        }
      })
      .catch(() => setLocation("/"))
      .finally(() => setFetching(false));
  }, []);

  const handleApprove = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/auth/sso/callback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });
      const data = await res.json();
      if (data.success && data.redirectUrl) {
        window.location.href = data.redirectUrl;
      }
    } catch (err) {
      console.error("SSO consent error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeny = () => {
    setLocation("/");
  };

  if (fetching) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <RefreshCw className="w-6 h-6 text-cyan-400 animate-spin" />
      </div>
    );
  }

  if (!appInfo) return null;

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="rounded-2xl border border-white/10 bg-slate-900/90 backdrop-blur-xl overflow-hidden"
          style={{ boxShadow: "0 0 60px rgba(0,200,255,0.1)" }}>
          
          <div className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border-b border-white/5 p-6 text-center">
            <div className="flex items-center justify-center gap-4 mb-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 flex items-center justify-center">
                <Shield className="w-7 h-7 text-cyan-400" />
              </div>
              <div className="text-gray-400 text-2xl">→</div>
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30 flex items-center justify-center">
                {appInfo.logoUrl ? (
                  <img src={appInfo.logoUrl} alt={appInfo.displayName} className="w-8 h-8 rounded-lg" />
                ) : (
                  <Globe className="w-7 h-7 text-purple-400" />
                )}
              </div>
            </div>
            <h2 className="text-xl font-bold text-white">Sign in to {appInfo.displayName}</h2>
            <p className="text-gray-400 text-sm mt-1">
              using your DarkWave Trust Layer account
            </p>
          </div>

          <div className="p-6">
            <p className="text-sm text-gray-400 mb-4">
              <span className="text-white font-medium">{appInfo.displayName}</span> is requesting access to:
            </p>
            
            <div className="space-y-3 mb-6">
              {appInfo.permissions.map(perm => {
                const info = PERMISSION_INFO[perm];
                if (!info) return null;
                return (
                  <div 
                    key={perm}
                    className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5"
                  >
                    <div className="w-8 h-8 rounded-lg bg-cyan-500/10 flex items-center justify-center text-cyan-400">
                      {info.icon}
                    </div>
                    <div>
                      <p className="text-white text-sm font-medium">{info.label}</p>
                      <p className="text-gray-500 text-xs">{info.desc}</p>
                    </div>
                    <Check className="w-4 h-4 text-green-400 ml-auto" />
                  </div>
                );
              })}
            </div>

            <div className="flex items-center gap-2 p-3 rounded-xl bg-cyan-500/5 border border-cyan-500/10 mb-6">
              <Lock className="w-4 h-4 text-cyan-400 shrink-0" />
              <p className="text-xs text-cyan-300/70">
                Your password is never shared. You can revoke access anytime from your account settings.
              </p>
            </div>

            <div className="flex gap-3">
              <Button
                data-testid="btn-sso-deny"
                variant="outline"
                className="flex-1 border-white/10 text-gray-400 hover:bg-white/5"
                onClick={handleDeny}
              >
                <X className="w-4 h-4 mr-2" />
                Deny
              </Button>
              <Button
                data-testid="btn-sso-approve"
                className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white"
                onClick={handleApprove}
                disabled={loading}
              >
                {loading ? (
                  <span className="animate-pulse">Connecting...</span>
                ) : (
                  <><Check className="w-4 h-4 mr-2" /> Approve</>
                )}
              </Button>
            </div>

            <p className="text-center text-xs text-gray-500 mt-4">
              By approving, you agree to share the above information with {appInfo.displayName}
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
