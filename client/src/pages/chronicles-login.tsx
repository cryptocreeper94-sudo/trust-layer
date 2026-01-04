import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "wouter";
import { 
  User, Lock, Mail, Eye, EyeOff, ArrowRight, Sparkles, Shield, 
  Gamepad2, Clock, Users, Scroll, ChevronLeft
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

const CHRONICLES_SESSION_KEY = "chronicles_session";
const CHRONICLES_ACCOUNT_KEY = "chronicles_account";

interface ChroniclesAccount {
  id: string;
  username: string;
  displayName: string;
}

export function getChroniclesSession(): { token: string; account: ChroniclesAccount } | null {
  try {
    const token = localStorage.getItem(CHRONICLES_SESSION_KEY);
    const accountStr = localStorage.getItem(CHRONICLES_ACCOUNT_KEY);
    if (!token || !accountStr) return null;
    const account = JSON.parse(accountStr);
    return { token, account };
  } catch {
    return null;
  }
}

export function setChroniclesSession(token: string, account: ChroniclesAccount) {
  localStorage.setItem(CHRONICLES_SESSION_KEY, token);
  localStorage.setItem(CHRONICLES_ACCOUNT_KEY, JSON.stringify(account));
}

export function clearChroniclesSession() {
  localStorage.removeItem(CHRONICLES_SESSION_KEY);
  localStorage.removeItem(CHRONICLES_ACCOUNT_KEY);
}

export default function ChroniclesLogin() {
  const [, setLocation] = useLocation();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [username, setUsername] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);

  useEffect(() => {
    const session = getChroniclesSession();
    if (session) {
      fetch("/api/chronicles/auth/session", {
        headers: { Authorization: `Bearer ${session.token}` }
      })
        .then(res => res.json())
        .then(data => {
          if (data.authenticated) {
            setLocation("/chronicles");
          } else {
            clearChroniclesSession();
            setCheckingSession(false);
          }
        })
        .catch(() => {
          clearChroniclesSession();
          setCheckingSession(false);
        });
    } else {
      setCheckingSession(false);
    }
  }, [setLocation]);

  const handleLogin = async () => {
    if (!username || !password) {
      toast.error("Please enter username and password");
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch("/api/chronicles/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || "Login failed");
        return;
      }

      setChroniclesSession(data.sessionToken, data.account);
      toast.success(`Welcome back, ${data.account.displayName}!`);
      setLocation("/chronicles");
    } catch (error: any) {
      toast.error(error.message || "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async () => {
    if (!username || !displayName || !password) {
      toast.error("Please fill in all fields");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords don't match");
      return;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    if (username.length < 3 || username.length > 30) {
      toast.error("Username must be 3-30 characters");
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch("/api/chronicles/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, displayName, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || "Signup failed");
        return;
      }

      setChroniclesSession(data.sessionToken, data.account);
      toast.success(`Welcome to Chronicles, ${data.account.displayName}!`);
      setLocation("/chronicles");
    } catch (error: any) {
      toast.error(error.message || "Signup failed");
    } finally {
      setIsLoading(false);
    }
  };

  if (checkingSession) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-pink-500/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 min-h-screen flex flex-col">
        <div className="p-4">
          <Button
            variant="ghost"
            onClick={() => setLocation("/")}
            className="text-white/60 hover:text-white"
            data-testid="button-back-home"
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Back to DarkWave
          </Button>
        </div>

        <div className="flex-1 flex items-center justify-center px-4 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-md"
          >
            <div className="text-center mb-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", delay: 0.1 }}
                className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 mb-4"
              >
                <Gamepad2 className="w-10 h-10 text-white" />
              </motion.div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
                DarkWave Chronicles
              </h1>
              <p className="text-white/60 mt-2">Season Zero Beta</p>
              <div className="flex items-center justify-center gap-2 mt-3">
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-green-500/20 text-green-400 text-xs font-medium">
                  <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                  LIVE
                </span>
              </div>
            </div>

            <div className="bg-slate-900/80 backdrop-blur-xl rounded-2xl border border-white/10 p-6">
              <div className="flex bg-slate-800/50 rounded-lg p-1 mb-6">
                <button
                  onClick={() => setMode("login")}
                  className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
                    mode === "login"
                      ? "bg-purple-500 text-white"
                      : "text-white/60 hover:text-white"
                  }`}
                  data-testid="tab-login"
                >
                  Sign In
                </button>
                <button
                  onClick={() => setMode("signup")}
                  className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
                    mode === "signup"
                      ? "bg-purple-500 text-white"
                      : "text-white/60 hover:text-white"
                  }`}
                  data-testid="tab-signup"
                >
                  Create Account
                </button>
              </div>

              <AnimatePresence mode="wait">
                <motion.form
                  key={mode}
                  initial={{ opacity: 0, x: mode === "login" ? -20 : 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: mode === "login" ? 20 : -20 }}
                  transition={{ duration: 0.2 }}
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (mode === "login") {
                      handleLogin();
                    } else {
                      handleSignup();
                    }
                  }}
                >
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-white/70 mb-2">
                        Username
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/40" />
                        <Input
                          type="text"
                          placeholder="Enter your username"
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                          className="pl-10 bg-slate-800/50 border-white/10 text-white placeholder:text-white/30"
                          data-testid="input-username"
                        />
                      </div>
                    </div>

                    {mode === "signup" && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                      >
                        <label className="block text-sm font-medium text-white/70 mb-2">
                          Display Name
                        </label>
                        <div className="relative">
                          <Sparkles className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/40" />
                          <Input
                            type="text"
                            placeholder="How should we call you?"
                            value={displayName}
                            onChange={(e) => setDisplayName(e.target.value)}
                            className="pl-10 bg-slate-800/50 border-white/10 text-white placeholder:text-white/30"
                            data-testid="input-display-name"
                          />
                        </div>
                        <p className="text-xs text-white/40 mt-1">
                          This is what you'll see in the game (e.g., "Good afternoon, {displayName || 'Your Name'}")
                        </p>
                      </motion.div>
                    )}

                    <div>
                      <label className="block text-sm font-medium text-white/70 mb-2">
                        Password
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/40" />
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="Enter your password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="pl-10 pr-10 bg-slate-800/50 border-white/10 text-white placeholder:text-white/30"
                          data-testid="input-password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/40 hover:text-white/60"
                        >
                          {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>

                    {mode === "signup" && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                      >
                        <label className="block text-sm font-medium text-white/70 mb-2">
                          Confirm Password
                        </label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/40" />
                          <Input
                            type={showPassword ? "text" : "password"}
                            placeholder="Confirm your password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="pl-10 bg-slate-800/50 border-white/10 text-white placeholder:text-white/30"
                            data-testid="input-confirm-password"
                          />
                        </div>
                      </motion.div>
                    )}

                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold py-6"
                      data-testid="button-submit"
                    >
                      {isLoading ? (
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                        />
                      ) : (
                        <>
                          {mode === "login" ? "Enter Chronicles" : "Begin Your Journey"}
                          <ArrowRight className="w-5 h-5 ml-2" />
                        </>
                      )}
                    </Button>
                  </div>
                </motion.form>
              </AnimatePresence>
            </div>

            <div className="mt-6 grid grid-cols-3 gap-3">
              {[
                { icon: Clock, label: "70+ Eras", color: "purple" },
                { icon: Users, label: "Community", color: "cyan" },
                { icon: Shield, label: "Secure", color: "pink" },
              ].map(({ icon: Icon, label, color }) => (
                <div
                  key={label}
                  className="bg-slate-900/50 backdrop-blur rounded-xl p-3 text-center border border-white/5"
                >
                  <Icon className={`w-5 h-5 mx-auto mb-1 text-${color}-400`} />
                  <span className="text-xs text-white/60">{label}</span>
                </div>
              ))}
            </div>

            <div className="mt-6 p-4 bg-slate-900/50 backdrop-blur rounded-xl border border-purple-500/20">
              <div className="flex items-start gap-3">
                <Scroll className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-sm font-medium text-white mb-1">Community-Driven Evolution</h3>
                  <p className="text-xs text-white/50">
                    Chronicles evolves with its community. As players join and participate, 
                    new eras unlock, storylines branch, and the world responds. Your choices shape history.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
