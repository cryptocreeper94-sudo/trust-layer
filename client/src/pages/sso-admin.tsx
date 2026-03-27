import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  Shield, Plus, Key, Copy, Check, Eye, EyeOff, 
  Globe, ToggleLeft, ToggleRight, Trash2, RefreshCw,
  Users, Activity, Lock, Code, ExternalLink, AlertTriangle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { BackButton } from "@/components/page-nav";

interface EcosystemApp {
  id: string;
  app_name: string;
  app_display_name: string;
  app_description: string;
  app_url: string;
  callback_url: string;
  logo_url: string;
  is_active: boolean;
  created_at: string;
  api_key?: string;
  permissions?: string[];
}

interface NewAppCredentials {
  appName: string;
  apiKey: string;
  apiSecret: string;
}

function CopyButton({ text, label }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      data-testid={`btn-copy-${label || 'text'}`}
      onClick={() => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }}
      className="p-1.5 rounded-md hover:bg-white/10 transition-colors"
      title="Copy"
    >
      {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4 text-gray-400" />}
    </button>
  );
}

export default function SsoAdmin() {
  const [pin, setPin] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [newCredentials, setNewCredentials] = useState<NewAppCredentials | null>(null);
  const [showSecret, setShowSecret] = useState(false);
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    appName: "",
    appDisplayName: "",
    appDescription: "",
    appUrl: "",
    callbackUrl: "/auth/callback",
    logoUrl: "",
    permissions: ["read:profile"]
  });

  useEffect(() => {
    const token = sessionStorage.getItem("dev-session-token");
    if (token) setAuthenticated(true);
  }, []);

  const handlePinSubmit = async () => {
    try {
      const res = await fetch("/api/developer/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pin }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.sessionToken) sessionStorage.setItem("dev-session-token", data.sessionToken);
        setAuthenticated(true);
      }
    } catch {}
  };

  const { data: apps, isLoading } = useQuery<EcosystemApp[]>({
    queryKey: ["/api/auth/sso/apps"],
    queryFn: async () => {
      const res = await fetch("/api/auth/sso/apps");
      const data = await res.json();
      return data.apps || [];
    },
    enabled: authenticated,
  });

  const registerMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const ownerSecret = sessionStorage.getItem("dev-session-token");
      const res = await fetch("/api/auth/sso/register-app", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${ownerSecret}`
        },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Registration failed");
      }
      return res.json();
    },
    onSuccess: (data) => {
      setNewCredentials(data.credentials);
      setShowRegister(false);
      setFormData({
        appName: "", appDisplayName: "", appDescription: "",
        appUrl: "", callbackUrl: "/auth/callback", logoUrl: "",
        permissions: ["read:profile"]
      });
      queryClient.invalidateQueries({ queryKey: ["/api/auth/sso/apps"] });
    },
  });

  const toggleMutation = useMutation({
    mutationFn: async ({ appId, active }: { appId: string; active: boolean }) => {
      const ownerSecret = sessionStorage.getItem("dev-session-token");
      const res = await fetch(`/api/auth/sso/toggle-app`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${ownerSecret}`
        },
        body: JSON.stringify({ appId, active }),
      });
      if (!res.ok) throw new Error("Toggle failed");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/auth/sso/apps"] });
    },
  });

  const permissionOptions = [
    { value: "read:profile", label: "Profile", desc: "Name, avatar, created date" },
    { value: "read:email", label: "Email", desc: "Email address" },
    { value: "read:membership", label: "Membership", desc: "Trust Card, member tier" },
    { value: "read:wallet", label: "Wallet", desc: "SIG balance, wallet address" },
  ];

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-sm"
        >
          <div className="rounded-2xl border border-white/10 bg-slate-900/80 backdrop-blur-xl p-8 text-center"
            style={{ boxShadow: "0 0 40px rgba(0,200,255,0.1)" }}>
            <Lock className="w-12 h-12 text-cyan-400 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-white mb-2">SSO Administration</h2>
            <p className="text-gray-400 text-sm mb-6">Enter your admin PIN to continue</p>
            <Input
              data-testid="input-admin-pin"
              type="password"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handlePinSubmit()}
              placeholder="Enter PIN"
              className="bg-white/5 border-white/10 text-white text-center text-lg tracking-widest mb-4"
              maxLength={6}
            />
            <Button
              data-testid="btn-pin-submit"
              onClick={handlePinSubmit}
              className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400"
            >
              Authenticate
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 pt-20 pb-12 px-4">
      <div className="container mx-auto max-w-5xl">
        <BackButton />
        
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Shield className="w-8 h-8 text-cyan-400" />
            <h1 className="text-3xl font-bold text-white">Ecosystem SSO Manager</h1>
          </div>
          <p className="text-gray-400">Register and manage apps that can authenticate via DarkWave Trust Layer SSO</p>
        </motion.div>

        <AnimatePresence>
          {newCredentials && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mb-6 rounded-2xl border border-purple-500/30 bg-purple-500/10 backdrop-blur-xl p-6"
            >
              <div className="flex items-start gap-3 mb-4">
                <AlertTriangle className="w-6 h-6 text-purple-400 shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-lg font-bold text-purple-300">Save These Credentials</h3>
                  <p className="text-purple-200/70 text-sm">The API Secret will never be shown again. Copy and store it securely.</p>
                </div>
              </div>
              
              <div className="space-y-3 bg-black/30 rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400 text-sm">App Name</span>
                  <div className="flex items-center gap-2">
                    <code className="text-cyan-300 text-sm" data-testid="text-new-app-name">{newCredentials.appName}</code>
                    <CopyButton text={newCredentials.appName} label="app-name" />
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400 text-sm">API Key</span>
                  <div className="flex items-center gap-2">
                    <code className="text-green-300 text-sm" data-testid="text-new-api-key">{newCredentials.apiKey}</code>
                    <CopyButton text={newCredentials.apiKey} label="api-key" />
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400 text-sm">API Secret</span>
                  <div className="flex items-center gap-2">
                    <code className="text-pink-300 text-sm font-mono break-all" data-testid="text-new-api-secret">
                      {showSecret ? newCredentials.apiSecret : "•".repeat(40)}
                    </code>
                    <button onClick={() => setShowSecret(!showSecret)} className="p-1.5 rounded-md hover:bg-white/10">
                      {showSecret ? <EyeOff className="w-4 h-4 text-gray-400" /> : <Eye className="w-4 h-4 text-gray-400" />}
                    </button>
                    <CopyButton text={newCredentials.apiSecret} label="api-secret" />
                  </div>
                </div>
              </div>

              <div className="mt-4 flex justify-end">
                <Button
                  data-testid="btn-dismiss-credentials"
                  variant="outline"
                  size="sm"
                  onClick={() => setNewCredentials(null)}
                  className="border-purple-500/30 text-purple-300 hover:bg-purple-500/10"
                >
                  I've saved these credentials
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-white">Registered Apps ({apps?.length || 0})</h2>
          <Button
            data-testid="btn-register-app"
            onClick={() => setShowRegister(!showRegister)}
            className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400"
          >
            <Plus className="w-4 h-4 mr-2" />
            Register New App
          </Button>
        </div>

        <AnimatePresence>
          {showRegister && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-6 overflow-hidden"
            >
              <div className="rounded-2xl border border-cyan-500/20 bg-slate-900/80 backdrop-blur-xl p-6"
                style={{ boxShadow: "0 0 30px rgba(0,200,255,0.1)" }}>
                <h3 className="text-lg font-bold text-white mb-4">Register New Ecosystem App</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="text-sm text-gray-400 mb-1 block">App Name (unique ID)</label>
                    <Input
                      data-testid="input-app-name"
                      value={formData.appName}
                      onChange={(e) => setFormData({ ...formData, appName: e.target.value })}
                      placeholder="garagebot"
                      className="bg-white/5 border-white/10 text-white"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-400 mb-1 block">Display Name</label>
                    <Input
                      data-testid="input-display-name"
                      value={formData.appDisplayName}
                      onChange={(e) => setFormData({ ...formData, appDisplayName: e.target.value })}
                      placeholder="GarageBot"
                      className="bg-white/5 border-white/10 text-white"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-400 mb-1 block">App URL</label>
                    <Input
                      data-testid="input-app-url"
                      value={formData.appUrl}
                      onChange={(e) => setFormData({ ...formData, appUrl: e.target.value })}
                      placeholder="https://garagebot.io"
                      className="bg-white/5 border-white/10 text-white"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-400 mb-1 block">Callback Path</label>
                    <Input
                      data-testid="input-callback-url"
                      value={formData.callbackUrl}
                      onChange={(e) => setFormData({ ...formData, callbackUrl: e.target.value })}
                      placeholder="/auth/callback"
                      className="bg-white/5 border-white/10 text-white"
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label className="text-sm text-gray-400 mb-1 block">Description</label>
                  <Input
                    data-testid="input-app-description"
                    value={formData.appDescription}
                    onChange={(e) => setFormData({ ...formData, appDescription: e.target.value })}
                    placeholder="AI-powered garage management platform"
                    className="bg-white/5 border-white/10 text-white"
                  />
                </div>

                <div className="mb-4">
                  <label className="text-sm text-gray-400 mb-2 block">Permissions</label>
                  <div className="flex flex-wrap gap-2">
                    {permissionOptions.map(perm => (
                      <button
                        key={perm.value}
                        data-testid={`btn-perm-${perm.value}`}
                        onClick={() => {
                          const perms = formData.permissions.includes(perm.value)
                            ? formData.permissions.filter(p => p !== perm.value)
                            : [...formData.permissions, perm.value];
                          setFormData({ ...formData, permissions: perms });
                        }}
                        className={`px-3 py-1.5 rounded-lg text-sm border transition-all ${
                          formData.permissions.includes(perm.value)
                            ? 'border-cyan-500/50 bg-cyan-500/20 text-cyan-300'
                            : 'border-white/10 bg-white/5 text-gray-400 hover:border-white/20'
                        }`}
                      >
                        {perm.label}
                      </button>
                    ))}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {permissionOptions.filter(p => formData.permissions.includes(p.value)).map(p => p.desc).join(", ") || "No permissions selected"}
                  </p>
                </div>

                <div className="flex gap-3 justify-end">
                  <Button
                    variant="outline"
                    onClick={() => setShowRegister(false)}
                    className="border-white/10 text-gray-400"
                  >
                    Cancel
                  </Button>
                  <Button
                    data-testid="btn-submit-register"
                    onClick={() => registerMutation.mutate(formData)}
                    disabled={!formData.appName || !formData.appDisplayName || !formData.appUrl || registerMutation.isPending}
                    className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400"
                  >
                    {registerMutation.isPending ? (
                      <><RefreshCw className="w-4 h-4 mr-2 animate-spin" /> Registering...</>
                    ) : (
                      <><Key className="w-4 h-4 mr-2" /> Generate Credentials</>
                    )}
                  </Button>
                </div>

                {registerMutation.isError && (
                  <p className="text-red-400 text-sm mt-3">{(registerMutation.error as Error).message}</p>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="space-y-4">
          {isLoading ? (
            <div className="text-center py-12">
              <RefreshCw className="w-8 h-8 text-cyan-400 animate-spin mx-auto mb-3" />
              <p className="text-gray-400">Loading apps...</p>
            </div>
          ) : apps && apps.length > 0 ? (
            apps.map((app, i) => (
              <motion.div
                key={app.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="rounded-2xl border border-white/10 bg-slate-900/80 backdrop-blur-xl p-5"
                style={{ boxShadow: "0 0 20px rgba(0,200,255,0.05)" }}
                data-testid={`card-app-${app.app_name}`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/20 flex items-center justify-center">
                      <Globe className="w-5 h-5 text-cyan-400" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-white font-semibold">{app.app_display_name}</h3>
                        <Badge 
                          variant={app.is_active ? "default" : "secondary"}
                          className={app.is_active ? "bg-green-500/20 text-green-300 border-green-500/30" : "bg-red-500/20 text-red-300 border-red-500/30"}
                        >
                          {app.is_active ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                      <p className="text-gray-400 text-sm">{app.app_url}</p>
                    </div>
                  </div>
                  <button
                    data-testid={`btn-toggle-${app.app_name}`}
                    onClick={() => toggleMutation.mutate({ appId: app.id, active: !app.is_active })}
                    className="p-2 rounded-lg hover:bg-white/5 transition-colors"
                    title={app.is_active ? "Deactivate" : "Activate"}
                  >
                    {app.is_active ? (
                      <ToggleRight className="w-6 h-6 text-green-400" />
                    ) : (
                      <ToggleLeft className="w-6 h-6 text-gray-500" />
                    )}
                  </button>
                </div>

                {app.app_description && (
                  <p className="text-gray-500 text-sm mt-2 ml-13">{app.app_description}</p>
                )}

                <div className="mt-3 flex flex-wrap gap-2 ml-13">
                  <span className="text-xs text-gray-500">Callback:</span>
                  <code className="text-xs text-purple-300 bg-purple-500/10 px-2 py-0.5 rounded">{app.callback_url}</code>
                  {app.permissions && (app.permissions as string[]).length > 0 && (
                    <>
                      <span className="text-xs text-gray-500 ml-2">Permissions:</span>
                      {(app.permissions as string[]).map(p => (
                        <code key={p} className="text-xs text-cyan-300 bg-cyan-500/10 px-2 py-0.5 rounded">{p}</code>
                      ))}
                    </>
                  )}
                </div>

                <div className="mt-2 flex items-center gap-2 ml-13">
                  <span className="text-xs text-gray-500">Registered:</span>
                  <span className="text-xs text-gray-400">{new Date(app.created_at).toLocaleDateString()}</span>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="text-center py-16 rounded-2xl border border-white/5 bg-slate-900/50">
              <Shield className="w-12 h-12 text-gray-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-400">No Apps Registered</h3>
              <p className="text-gray-500 text-sm mt-1">Register your first ecosystem app to enable SSO</p>
            </div>
          )}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-8 rounded-2xl border border-white/10 bg-slate-900/60 backdrop-blur-xl p-6"
        >
          <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
            <Code className="w-5 h-5 text-cyan-400" />
            Quick Integration Guide
          </h3>
          <div className="space-y-4 text-sm">
            <div>
              <p className="text-gray-400 mb-2">1. Add the SDK to the developer's app:</p>
              <div className="bg-black/40 rounded-xl p-4 font-mono text-cyan-300 text-xs relative">
                <CopyButton text='<script src="https://dwsc.io/dw-sso.js"></script>' label="sdk-script" />
                {`<script src="https://dwsc.io/dw-sso.js"></script>`}
              </div>
            </div>
            <div>
              <p className="text-gray-400 mb-2">2. Initialize with their credentials:</p>
              <div className="bg-black/40 rounded-xl p-4 font-mono text-cyan-300 text-xs">
{`const sso = new DarkWaveSSO({
  appName: 'their-app-name',
  apiKey: 'dw_their_api_key',
  callbackPath: '/auth/callback'
});`}
              </div>
            </div>
            <div>
              <p className="text-gray-400 mb-2">3. Add a login button:</p>
              <div className="bg-black/40 rounded-xl p-4 font-mono text-cyan-300 text-xs">
{`sso.renderLoginButton('#login-container');
// Or trigger manually: sso.login();`}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
