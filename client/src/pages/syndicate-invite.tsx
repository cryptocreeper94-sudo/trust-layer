import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation, useParams, Link } from "wouter";
import { 
  Users, Shield, Sparkles, Crown, Link2, Clock, 
  ArrowRight, Loader2, AlertCircle, Check, Copy, Share2, Zap
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useSimpleAuth } from "@/hooks/use-simple-auth";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { toast } from "sonner";

const PENDING_INVITE_KEY = "darkwave_pending_syndicate_invite";

export function setPendingInvite(code: string) {
  localStorage.setItem(PENDING_INVITE_KEY, JSON.stringify({ code, timestamp: Date.now() }));
}

export function getPendingInvite(): { code: string; timestamp: number } | null {
  try {
    const stored = localStorage.getItem(PENDING_INVITE_KEY);
    if (!stored) return null;
    const parsed = JSON.parse(stored);
    if (Date.now() - parsed.timestamp > 24 * 60 * 60 * 1000) {
      localStorage.removeItem(PENDING_INVITE_KEY);
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

export function clearPendingInvite() {
  localStorage.removeItem(PENDING_INVITE_KEY);
}

export default function SyndicateInvite() {
  const { code } = useParams<{ code: string }>();
  const [, navigate] = useLocation();
  const { user, loading: authLoading } = useSimpleAuth();
  const [joined, setJoined] = useState(false);

  const { data: inviteData, isLoading, error } = useQuery({
    queryKey: ["syndicate-invite", code],
    queryFn: async () => {
      const res = await fetch(`/api/guilds/invite/${code}`);
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Invalid invite");
      }
      return res.json();
    },
    enabled: !!code,
    retry: false,
  });

  const joinMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", `/api/guilds/join/${code}`);
      return res.json();
    },
    onSuccess: (data) => {
      setJoined(true);
      clearPendingInvite();
      queryClient.invalidateQueries({ queryKey: ["my-syndicates"] });
      toast.success(`Welcome to ${inviteData?.syndicate?.name}!`);
      setTimeout(() => navigate("/chronicles/hub"), 2000);
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to join syndicate");
    },
  });

  const handleJoin = () => {
    if (!user) {
      setPendingInvite(code || "");
      navigate("/chronicles/onboarding");
    } else {
      joinMutation.mutate();
    }
  };

  const handleSignIn = () => {
    setPendingInvite(code || "");
    navigate("/chronicles/onboarding");
  };

  const syndicate = inviteData?.syndicate;
  const invitedBy = inviteData?.invitedBy;

  if (isLoading || authLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        >
          <div className="w-16 h-16 rounded-full border-4 border-cyan-500/30 border-t-cyan-500" />
        </motion.div>
      </div>
    );
  }

  if (error || !inviteData?.valid) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full"
        >
          <Card className="bg-slate-900/80 backdrop-blur-xl border-red-500/30 p-8 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-500/20 flex items-center justify-center">
              <AlertCircle className="w-8 h-8 text-red-400" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">Invalid Invite</h1>
            <p className="text-slate-400 mb-6">
              {(error as Error)?.message || "This invite link is no longer valid or has expired."}
            </p>
            <a href="https://yourlegacy.io" target="_blank" rel="noopener noreferrer">
              <Button className="bg-gradient-to-r from-cyan-500 to-purple-500" data-testid="button-go-chronicles">
                Explore Chronicles
              </Button>
            </a>
          </Card>
        </motion.div>
      </div>
    );
  }

  if (joined) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", delay: 0.2 }}
            className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-cyan-500 to-purple-500 flex items-center justify-center"
          >
            <Check className="w-12 h-12 text-white" />
          </motion.div>
          <h1 className="text-3xl font-bold text-white mb-2">You're In!</h1>
          <p className="text-slate-400 mb-4">
            Welcome to <span className="text-cyan-400 font-semibold">{syndicate?.name}</span>
          </p>
          <p className="text-sm text-slate-500">Redirecting to Chronicles Hub...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 relative overflow-hidden">
      {/* Ambient Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-[150px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[150px] animate-pulse" style={{ animationDelay: "1s" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-pink-500/5 rounded-full blur-[200px]" />
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-cyan-400/40 rounded-full"
            initial={{
              x: Math.random() * window.innerWidth,
              y: window.innerHeight + 10,
            }}
            animate={{
              y: -10,
              x: Math.random() * window.innerWidth,
            }}
            transition={{
              duration: 10 + Math.random() * 10,
              repeat: Infinity,
              delay: Math.random() * 5,
              ease: "linear",
            }}
          />
        ))}
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-lg w-full"
        >
          {/* Holographic Border Card */}
          <div className="relative group">
            {/* Animated Holographic Border */}
            <div className="absolute -inset-[2px] bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 rounded-2xl opacity-75 blur-sm group-hover:opacity-100 transition-opacity duration-500 animate-pulse" />
            <div className="absolute -inset-[1px] bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 rounded-2xl opacity-50" 
              style={{ 
                backgroundSize: "200% 200%",
                animation: "gradient-shift 3s ease infinite",
              }} 
            />
            
            {/* Glass Card */}
            <Card className="relative bg-slate-900/90 backdrop-blur-xl border-0 rounded-2xl overflow-hidden">
              {/* Header Glow */}
              <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-cyan-500/10 to-transparent" />
              
              <div className="relative p-8">
                {/* Invited By Badge */}
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-center mb-6"
                >
                  <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30 px-4 py-1">
                    <Sparkles className="w-3 h-3 mr-1" />
                    {invitedBy?.displayName} invited you
                  </Badge>
                </motion.div>

                {/* Syndicate Icon */}
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", delay: 0.3 }}
                  className="relative w-24 h-24 mx-auto mb-6"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-cyan-500 to-purple-500 rounded-2xl rotate-6 opacity-50" />
                  <div className="absolute inset-0 bg-gradient-to-br from-cyan-500 to-purple-500 rounded-2xl -rotate-6 opacity-50" />
                  <div className="relative w-full h-full bg-slate-800 rounded-2xl flex items-center justify-center text-5xl border border-slate-700 shadow-2xl">
                    {syndicate?.icon || "⚔️"}
                  </div>
                  {syndicate?.isChronoLinkActive && (
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-cyan-500 rounded-full flex items-center justify-center shadow-lg shadow-cyan-500/50">
                      <Link2 className="w-4 h-4 text-white" />
                    </div>
                  )}
                </motion.div>

                {/* Syndicate Name */}
                <motion.h1
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="text-3xl font-bold text-center mb-2 bg-gradient-to-r from-white via-cyan-100 to-white bg-clip-text text-transparent"
                >
                  {syndicate?.name}
                </motion.h1>

                {/* Stats Row */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="flex justify-center gap-4 mb-6"
                >
                  <div className="flex items-center gap-1 text-slate-400">
                    <Users className="w-4 h-4" />
                    <span className="text-sm">{syndicate?.memberCount}/{syndicate?.maxMembers} members</span>
                  </div>
                  <div className="flex items-center gap-1 text-purple-400">
                    <Crown className="w-4 h-4" />
                    <span className="text-sm">Level {syndicate?.level || 1}</span>
                  </div>
                </motion.div>

                {/* Description */}
                {syndicate?.description && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="mb-6 p-4 bg-slate-800/50 rounded-xl border border-slate-700/50"
                  >
                    <p className="text-slate-300 text-center text-sm leading-relaxed">
                      "{syndicate.description}"
                    </p>
                  </motion.div>
                )}

                {/* Bonuses */}
                {(syndicate?.isChronoLinkActive || syndicate?.shellsBonus > 0) && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.7 }}
                    className="mb-6 p-4 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 rounded-xl border border-cyan-500/20"
                  >
                    <div className="flex items-center justify-center gap-2">
                      <Zap className="w-5 h-5 text-cyan-400" />
                      <span className="text-cyan-300 font-medium">+{syndicate?.shellsBonus || 5}% Shells Bonus</span>
                    </div>
                    <p className="text-xs text-slate-400 text-center mt-1">
                      ChronoLink active - earn bonus Shells on all activities
                    </p>
                  </motion.div>
                )}

                {/* CTA Buttons */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                  className="space-y-3"
                >
                  {user ? (
                    <Button
                      onClick={() => joinMutation.mutate()}
                      disabled={joinMutation.isPending}
                      className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-400 hover:to-purple-400 shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 transition-all duration-300"
                      data-testid="button-join-syndicate"
                    >
                      {joinMutation.isPending ? (
                        <Loader2 className="w-5 h-5 animate-spin mr-2" />
                      ) : (
                        <Shield className="w-5 h-5 mr-2" />
                      )}
                      Join Syndicate
                    </Button>
                  ) : (
                    <>
                      <Button
                        onClick={handleJoin}
                        className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-400 hover:to-purple-400 shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 transition-all duration-300"
                        data-testid="button-create-parallel-self"
                      >
                        <Sparkles className="w-5 h-5 mr-2" />
                        Create Your Parallel Self
                        <ArrowRight className="w-5 h-5 ml-2" />
                      </Button>
                      <Button
                        onClick={handleSignIn}
                        variant="outline"
                        className="w-full h-12 border-slate-600 text-slate-300 hover:bg-slate-800 hover:text-white transition-all duration-300"
                        data-testid="button-sign-in"
                      >
                        Already have an account? Sign In
                      </Button>
                    </>
                  )}
                </motion.div>

                {/* Expiry Notice */}
                {inviteData?.expiresAt && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 }}
                    className="mt-6 flex items-center justify-center gap-2 text-slate-500 text-sm"
                  >
                    <Clock className="w-4 h-4" />
                    <span>Invite expires {new Date(inviteData.expiresAt).toLocaleDateString()}</span>
                  </motion.div>
                )}
              </div>
            </Card>
          </div>

          {/* Bottom Tagline */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="text-center mt-6 text-slate-500 text-sm"
          >
            Join the parallel life experience
          </motion.p>
        </motion.div>
      </div>

      {/* CSS Animation */}
      <style>{`
        @keyframes gradient-shift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
      `}</style>
    </div>
  );
}
