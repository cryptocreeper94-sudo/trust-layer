import { useState } from "react";
import { motion } from "framer-motion";
import { useLocation } from "wouter";
import { GlassCard } from "@/components/glass-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, CheckCircle2, Loader2, RefreshCw, Gift } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { authFetch } from "@/hooks/use-firebase-auth";

export default function VerifyEmail() {
  const [code, setCode] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [verified, setVerified] = useState(false);
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const handleVerify = async () => {
    if (!code.trim() || code.length !== 6) {
      toast({ title: "Invalid Code", description: "Please enter the 6-digit code", variant: "destructive" });
      return;
    }

    setIsVerifying(true);
    try {
      const res = await authFetch("/api/auth/verify-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });
      const data = await res.json();
      
      if (data.success) {
        setVerified(true);
        toast({ title: "Email Verified!", description: `You earned ${data.shellsAwarded || 1000} Shells!` });
        setTimeout(() => setLocation("/my-hub"), 2000);
      } else {
        toast({ title: "Verification Failed", description: data.error || "Invalid or expired code", variant: "destructive" });
      }
    } catch (error) {
      toast({ title: "Error", description: "Verification failed. Please try again.", variant: "destructive" });
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResend = async () => {
    setIsResending(true);
    try {
      const res = await authFetch("/api/auth/resend-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();
      
      if (data.success) {
        toast({ title: "Code Sent!", description: "Check your email for the new verification code" });
      } else {
        toast({ title: "Error", description: data.error || "Failed to resend code", variant: "destructive" });
      }
    } catch (error) {
      toast({ title: "Error", description: "Failed to resend code", variant: "destructive" });
    } finally {
      setIsResending(false);
    }
  };

  if (verified) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
          <GlassCard glow className="p-8 text-center max-w-md">
            <CheckCircle2 className="w-16 h-16 text-emerald-400 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-white mb-2">Email Verified!</h1>
            <p className="text-white/60 mb-4">You earned 1,000 Shells as a welcome bonus!</p>
            <div className="flex items-center justify-center gap-2 text-cyan-400">
              <Gift className="w-5 h-5" />
              <span className="text-xl font-bold">+1,000 Shells</span>
            </div>
            <p className="text-white/40 text-sm mt-4">Redirecting to your hub...</p>
          </GlassCard>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="w-full max-w-md">
        <GlassCard glow className="p-8">
          <div className="text-center mb-6">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center mx-auto mb-4">
              <Mail className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">Verify Your Email</h1>
            <p className="text-white/60">Enter the 6-digit code we sent to your email</p>
          </div>

          <div className="space-y-4">
            <Input
              type="text"
              placeholder="Enter 6-digit code"
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
              className="text-center text-2xl tracking-widest font-mono bg-slate-900/50 border-white/10 text-white"
              maxLength={6}
              data-testid="input-verification-code"
            />

            <Button
              onClick={handleVerify}
              disabled={isVerifying || code.length !== 6}
              className="w-full bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700"
              data-testid="button-verify-email"
            >
              {isVerifying ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Verifying...
                </>
              ) : (
                "Verify Email"
              )}
            </Button>

            <div className="text-center">
              <button
                onClick={handleResend}
                disabled={isResending}
                className="text-cyan-400 hover:text-cyan-300 text-sm flex items-center justify-center gap-2 mx-auto"
                data-testid="button-resend-code"
              >
                {isResending ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <RefreshCw className="w-4 h-4" />
                )}
                Resend Code
              </button>
            </div>
          </div>

          <div className="mt-6 p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
            <div className="flex items-center gap-2 text-emerald-400 mb-1">
              <Gift className="w-4 h-4" />
              <span className="font-semibold text-sm">Welcome Bonus</span>
            </div>
            <p className="text-white/60 text-sm">Verify your email to receive 1,000 Shells!</p>
          </div>
        </GlassCard>
      </motion.div>
    </div>
  );
}
