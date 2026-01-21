import { useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X, Loader2, Mail, ArrowLeft, Eye, EyeOff, AlertTriangle, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSimpleAuth } from "@/hooks/use-simple-auth";
import { useToast } from "@/hooks/use-toast";

interface SimpleLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

type View = "login" | "signup" | "verify";

export function SimpleLoginModal({ isOpen, onClose, onSuccess }: SimpleLoginModalProps) {
  const { toast } = useToast();
  const { login, register } = useSimpleAuth();
  const [loading, setLoading] = useState(false);
  const [view, setView] = useState<View>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [resendDisabled, setResendDisabled] = useState(false);

  const resetForm = () => {
    setEmail("");
    setPassword("");
    setName("");
    setUsername("");
    setView("login");
    setShowPassword(false);
    setRememberMe(false);
    setVerificationCode("");
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
    if (!username.trim()) {
      toast({ title: "Username required", description: "Please choose a username", variant: "destructive" });
      return;
    }
    if (username.length < 3) {
      toast({ title: "Username too short", description: "Username must be at least 3 characters", variant: "destructive" });
      return;
    }
    setLoading(true);
    try {
      await register(email, password, name, username, rememberMe);
      toast({ title: "Account created!", description: "Welcome! You've earned 1,000 Shells." });
      onSuccess?.();
      handleClose();
      window.location.reload();
    } catch (error: any) {
      toast({ title: "Registration failed", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!verificationCode || verificationCode.length !== 6) {
      toast({ title: "Invalid code", description: "Please enter the 6-digit code from your email", variant: "destructive" });
      return;
    }
    setLoading(true);
    try {
      const response = await fetch("/api/auth/verify-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: verificationCode }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Verification failed");
      }
      toast({ 
        title: "Congrats! Your first signup bonus is YOU!", 
        description: `You just earned ${data.shellsAwarded || 1000} Shells! Check your wallet to see them.` 
      });
      onSuccess?.();
      handleClose();
      window.location.reload();
    } catch (error: any) {
      toast({ title: "Verification failed", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    setResendDisabled(true);
    try {
      const response = await fetch("/api/auth/resend-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to resend code");
      }
      toast({ title: "Code sent!", description: "Check your email for the new code." });
      setTimeout(() => setResendDisabled(false), 60000);
    } catch (error: any) {
      toast({ title: "Failed to resend", description: error.message, variant: "destructive" });
      setResendDisabled(false);
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

          {(view === "signup" || view === "verify") && (
            <button
              onClick={() => view === "verify" ? setView("signup") : setView("login")}
              className="absolute top-4 left-4 text-muted-foreground hover:text-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}

          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-white mb-2">
              {view === "login" ? "Welcome Back" : view === "signup" ? "Create Account" : "Verify Email"}
            </h2>
            <p className="text-muted-foreground text-sm">
              {view === "login" ? "Sign in to your account" : view === "signup" ? "Join DarkWave today" : `Enter the 6-digit code sent to ${email}`}
            </p>
          </div>

          {view === "verify" ? (
            <form onSubmit={handleVerify} className="space-y-4">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-cyan-500 to-purple-500 flex items-center justify-center">
                  <Mail className="w-8 h-8 text-white" />
                </div>
              </div>
              <Input
                type="text"
                placeholder="Enter 6-digit code"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                className="bg-white/5 border-white/10 h-14 text-center text-2xl tracking-widest font-mono"
                maxLength={6}
                data-testid="input-verification-code"
              />
              <Button
                type="submit"
                className="w-full h-12 bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-400 hover:to-purple-400 text-white font-bold"
                disabled={loading || verificationCode.length !== 6}
                data-testid="button-verify-email"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Verify Email"}
              </Button>
              <div className="text-center">
                <button
                  type="button"
                  onClick={handleResendCode}
                  disabled={resendDisabled}
                  className="text-sm text-muted-foreground hover:text-cyan-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  data-testid="button-resend-code"
                >
                  {resendDisabled ? "Wait 60 seconds to resend" : "Didn't receive the code? Resend"}
                </button>
              </div>
            </form>
          ) : (
          <form onSubmit={view === "login" ? handleLogin : handleSignup} className="space-y-4">
            {view === "signup" && (
              <>
                <Input
                  type="text"
                  placeholder="Your Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="bg-white/5 border-white/10 h-12"
                  data-testid="input-name"
                />
                <Input
                  type="text"
                  placeholder="Choose a Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
                  className="bg-white/5 border-white/10 h-12"
                  required
                  data-testid="input-username"
                />
              </>
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
          )}

          {view !== "verify" ? (
            <div className="mt-6 text-center space-y-3">
            {view === "login" && (
              <a
                href="/forgot-password"
                className="text-sm text-muted-foreground hover:text-cyan-400 transition-colors"
                data-testid="link-forgot-password"
              >
                Forgot your password?
              </a>
            )}
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
          ) : null}
        </motion.div>
      </div>
    </AnimatePresence>
  );

  return createPortal(modalContent, document.body);
}
