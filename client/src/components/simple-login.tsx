import { useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X, Loader2, Mail, ArrowLeft, Eye, EyeOff, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSimpleAuth } from "@/hooks/use-simple-auth";
import { useToast } from "@/hooks/use-toast";

interface SimpleLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

type View = "login" | "signup";

export function SimpleLoginModal({ isOpen, onClose, onSuccess }: SimpleLoginModalProps) {
  const { toast } = useToast();
  const { login, register } = useSimpleAuth();
  const [loading, setLoading] = useState(false);
  const [view, setView] = useState<View>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const resetForm = () => {
    setEmail("");
    setPassword("");
    setName("");
    setView("login");
    setShowPassword(false);
    setRememberMe(false);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast({ title: "Missing info", description: "Please enter email and password", variant: "destructive" });
      return;
    }
    setLoading(true);
    try {
      await login(email, password, rememberMe);
      toast({ title: "Welcome back!", description: "You've successfully signed in." });
      onSuccess?.();
      handleClose();
      window.location.reload();
    } catch (error: any) {
      toast({ title: "Sign in failed", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast({ title: "Missing info", description: "Please enter email and password", variant: "destructive" });
      return;
    }
    if (password.length < 6) {
      toast({ title: "Weak password", description: "Password must be at least 6 characters", variant: "destructive" });
      return;
    }
    setLoading(true);
    try {
      await register(email, password, name, rememberMe);
      toast({ title: "Account created!", description: "Welcome to DarkWave!" });
      onSuccess?.();
      handleClose();
      window.location.reload();
    } catch (error: any) {
      toast({ title: "Registration failed", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const modalContent = (
    <AnimatePresence>
      <div className="fixed inset-0 z-[9999]">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm"
          onClick={handleClose}
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[calc(100%-2rem)] max-w-sm bg-slate-900 border border-white/10 rounded-2xl p-6 shadow-2xl"
        >
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 text-muted-foreground hover:text-white transition-colors"
            data-testid="button-close-login"
          >
            <X className="w-5 h-5" />
          </button>

          {view === "signup" && (
            <button
              onClick={() => setView("login")}
              className="absolute top-4 left-4 text-muted-foreground hover:text-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}

          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-white mb-2">
              {view === "login" ? "Welcome Back" : "Create Account"}
            </h2>
            <p className="text-muted-foreground text-sm">
              {view === "login" ? "Sign in to your account" : "Join DarkWave today"}
            </p>
          </div>

          <form onSubmit={view === "login" ? handleLogin : handleSignup} className="space-y-4">
            {view === "signup" && (
              <Input
                type="text"
                placeholder="Display Name (optional)"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="bg-white/5 border-white/10 h-12"
                data-testid="input-name"
              />
            )}

            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-white/5 border-white/10 h-12"
              required
              data-testid="input-email"
            />

            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-white/5 border-white/10 h-12 pr-10"
                required
                data-testid="input-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-white"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-white/20 bg-white/5 text-cyan-500 focus:ring-cyan-500"
                  data-testid="checkbox-remember-me"
                />
                <span className="text-sm text-muted-foreground group-hover:text-white transition-colors">
                  Remember me for 30 days
                </span>
              </label>
              {rememberMe && (
                <div className="flex items-start gap-2 p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg">
                  <AlertTriangle className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" />
                  <p className="text-xs text-amber-200/80">
                    Anyone with access to this device can access your account during this period. Only use on personal devices.
                  </p>
                </div>
              )}
            </div>

            <Button
              type="submit"
              className="w-full h-12 bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-400 hover:to-purple-400 text-white font-bold"
              disabled={loading}
              data-testid="button-submit-login"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : view === "login" ? (
                "Sign In"
              ) : (
                "Create Account"
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            {view === "login" ? (
              <p className="text-sm text-muted-foreground">
                Don't have an account?{" "}
                <button
                  onClick={() => setView("signup")}
                  className="text-cyan-400 hover:text-cyan-300 font-medium"
                  data-testid="button-switch-signup"
                >
                  Sign up
                </button>
              </p>
            ) : (
              <p className="text-sm text-muted-foreground">
                Already have an account?{" "}
                <button
                  onClick={() => setView("login")}
                  className="text-cyan-400 hover:text-cyan-300 font-medium"
                  data-testid="button-switch-login"
                >
                  Sign in
                </button>
              </p>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );

  return createPortal(modalContent, document.body);
}
