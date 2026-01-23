import { useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X, Loader2, ArrowLeft, Eye, EyeOff, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useFirebaseAuth } from "@/hooks/use-firebase-auth";
import { useToast } from "@/hooks/use-toast";

interface SimpleLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

type View = "login" | "signup" | "forgot";

export function SimpleLoginModal({ isOpen, onClose, onSuccess }: SimpleLoginModalProps) {
  const { toast } = useToast();
  const { login, signup, loginWithGoogle, loginWithGithub, resetPassword } = useFirebaseAuth();
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [githubLoading, setGithubLoading] = useState(false);
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
      const result = await login(email, password);
      if (result.success) {
        toast({ title: "Welcome back!", description: "You've successfully signed in." });
        onSuccess?.();
        handleClose();
        window.location.reload();
      } else {
        toast({ title: "Sign in failed", description: result.error, variant: "destructive" });
      }
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
      const result = await signup(email, password, name || undefined);
      if (result.success) {
        toast({ title: "Account created!", description: "Welcome to DarkWave!" });
        onSuccess?.();
        handleClose();
        window.location.reload();
      } else {
        toast({ title: "Registration failed", description: result.error, variant: "destructive" });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    try {
      const result = await loginWithGoogle();
      if (result.success) {
        toast({ title: "Welcome!", description: "Signed in with Google successfully." });
        onSuccess?.();
        handleClose();
        window.location.reload();
      } else {
        if (!result.error?.includes("cancelled")) {
          toast({ title: "Google sign-in failed", description: result.error, variant: "destructive" });
        }
      }
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleGithubLogin = async () => {
    setGithubLoading(true);
    try {
      const result = await loginWithGithub();
      if (result.success) {
        toast({ title: "Welcome!", description: "Signed in with GitHub successfully." });
        onSuccess?.();
        handleClose();
        window.location.reload();
      } else {
        if (!result.error?.includes("cancelled")) {
          toast({ title: "GitHub sign-in failed", description: result.error, variant: "destructive" });
        }
      }
    } finally {
      setGithubLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast({ title: "Email required", description: "Please enter your email address", variant: "destructive" });
      return;
    }
    setLoading(true);
    try {
      const result = await resetPassword(email);
      if (result.success) {
        toast({ title: "Email sent!", description: "Check your inbox for password reset instructions." });
        setView("login");
      } else {
        toast({ title: "Failed to send", description: result.error, variant: "destructive" });
      }
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

          {(view === "signup" || view === "forgot") && (
            <button
              onClick={() => setView("login")}
              className="absolute top-4 left-4 text-muted-foreground hover:text-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}

          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-white mb-2">
              {view === "login" ? "Welcome Back" : view === "signup" ? "Create Account" : "Reset Password"}
            </h2>
            <p className="text-muted-foreground text-sm">
              {view === "login" ? "Sign in to your account" : view === "signup" ? "Join DarkWave today" : "Enter your email to reset"}
            </p>
          </div>

          {view === "forgot" ? (
            <form onSubmit={handleForgotPassword} className="space-y-4">
              <Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-white/5 border-white/10 h-12"
                required
                data-testid="input-email"
              />
              <Button
                type="submit"
                className="w-full h-12 bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-400 hover:to-purple-400 text-white font-bold"
                disabled={loading}
                data-testid="button-reset-password"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Send Reset Link"}
              </Button>
            </form>
          ) : (
          <>
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="relative">
                <Button
                  type="button"
                  disabled={true}
                  className="h-12 w-full bg-white/30 text-gray-500 font-medium flex items-center justify-center gap-2 cursor-not-allowed opacity-60"
                  data-testid="button-google-login"
                >
                  <svg className="w-5 h-5 opacity-50" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Google
                </Button>
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="bg-yellow-500/90 text-black text-[10px] font-bold px-2 py-0.5 rotate-[-15deg] border-y-2 border-black/30 shadow-lg">
                    COMING SOON
                  </div>
                </div>
              </div>

              <div className="relative">
                <Button
                  type="button"
                  disabled={true}
                  className="h-12 w-full bg-[#24292e]/50 text-white/50 font-medium flex items-center justify-center gap-2 cursor-not-allowed opacity-60"
                  data-testid="button-github-login"
                >
                  <svg className="w-5 h-5 opacity-50" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                  </svg>
                  GitHub
                </Button>
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="bg-yellow-500/90 text-black text-[10px] font-bold px-2 py-0.5 rotate-[-15deg] border-y-2 border-black/30 shadow-lg">
                    COMING SOON
                  </div>
                </div>
              </div>
            </div>

            <div className="hidden grid-cols-2 gap-3 mb-4">
              <Button
                type="button"
                onClick={handleGoogleLogin}
                disabled={googleLoading || githubLoading || loading}
                className="h-12 bg-white hover:bg-gray-100 text-gray-900 font-medium flex items-center justify-center gap-2"
              >
                {googleLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
                    </svg>
                    GitHub
                  </>
                )}
              </Button>
            </div>

            <div className="relative mb-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-slate-900 px-2 text-muted-foreground">or</span>
              </div>
            </div>

            <form onSubmit={view === "login" ? handleLogin : handleSignup} className="space-y-4">
              {view === "signup" && (
                <Input
                  type="text"
                  placeholder="Your Name (optional)"
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
                disabled={loading || googleLoading}
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
          </>
          )}

          {view !== "forgot" && (
            <div className="mt-6 text-center space-y-3">
              {view === "login" && (
                <button
                  onClick={() => setView("forgot")}
                  className="text-sm text-muted-foreground hover:text-cyan-400 transition-colors block w-full"
                  data-testid="link-forgot-password"
                >
                  Forgot your password?
                </button>
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
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );

  return createPortal(modalContent, document.body);
}
