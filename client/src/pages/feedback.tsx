import { useState } from "react";
import { motion } from "framer-motion";
import { Link, useLocation } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { 
  Bug, MessageSquare, Lightbulb, Send, CheckCircle, ArrowLeft,
  Camera, Gamepad2, Globe, Code, AlertCircle, Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { GlassCard } from "@/components/glass-card";
import { MobileNav } from "@/components/mobile-nav";
import { useSimpleAuth } from "@/hooks/use-simple-auth";

const FEEDBACK_TYPES = [
  { id: "bug", label: "Bug Report", icon: Bug, color: "red", description: "Something isn't working right" },
  { id: "feature", label: "Feature Request", icon: Lightbulb, color: "amber", description: "Suggest a new feature" },
  { id: "feedback", label: "General Feedback", icon: MessageSquare, color: "cyan", description: "Share your thoughts" },
];

const CATEGORIES = [
  { id: "chronicles", label: "Chronicles (Game)", icon: Gamepad2 },
  { id: "portal", label: "DarkWave Portal", icon: Globe },
  { id: "wallet", label: "Wallet & Shells", icon: Sparkles },
  { id: "community", label: "ChronoChat", icon: MessageSquare },
  { id: "other", label: "Other", icon: Code },
];

export default function Feedback() {
  const { user, isAuthenticated } = useSimpleAuth();
  const [, setLocation] = useLocation();
  
  const [type, setType] = useState("bug");
  const [category, setCategory] = useState("chronicles");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [stepsToReproduce, setStepsToReproduce] = useState("");
  const [expectedBehavior, setExpectedBehavior] = useState("");
  const [actualBehavior, setActualBehavior] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const submitMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type,
          category,
          title,
          description,
          stepsToReproduce: type === "bug" ? stepsToReproduce : null,
          expectedBehavior: type === "bug" ? expectedBehavior : null,
          actualBehavior: type === "bug" ? actualBehavior : null,
          pageUrl: window.location.href,
        }),
      });
      if (!res.ok) throw new Error("Failed to submit");
      return res.json();
    },
    onSuccess: () => {
      setSubmitted(true);
    },
  });

  const handleSubmit = () => {
    if (!title.trim() || !description.trim()) return;
    submitMutation.mutate();
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-slate-950 text-white">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-transparent to-cyan-900/20 pointer-events-none" />
        
        <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-background/90 backdrop-blur-xl">
          <div className="w-full px-4 h-14 flex items-center justify-between">
            <Link href="/" className="flex items-center">
              <span className="font-display font-bold text-xl tracking-tight">DarkWave</span>
            </Link>
            <MobileNav />
          </div>
        </nav>

        <main className="pt-24 pb-12">
          <div className="container mx-auto px-4 max-w-2xl">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center"
            >
              <GlassCard className="p-8" glow>
                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center">
                  <CheckCircle className="w-10 h-10 text-emerald-400" />
                </div>
                <h1 className="text-3xl font-bold mb-4">Thank You!</h1>
                <p className="text-white/70 mb-6 leading-relaxed">
                  Your feedback has been submitted and will be reviewed by Jason directly. 
                  We truly appreciate you taking the time to help us improve Chronicles and the Trust Layer.
                </p>
                <p className="text-sm text-white/50 mb-8">
                  Your input helps make this platform better for everyone.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button onClick={() => { setSubmitted(false); setTitle(""); setDescription(""); setStepsToReproduce(""); setExpectedBehavior(""); setActualBehavior(""); }}>
                    Submit Another
                  </Button>
                  <Link href="/my-hub">
                    <Button variant="outline" className="border-white/20">
                      Back to My Hub
                    </Button>
                  </Link>
                </div>
              </GlassCard>
            </motion.div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-transparent to-cyan-900/20 pointer-events-none" />
      
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-background/90 backdrop-blur-xl">
        <div className="w-full px-4 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center">
            <span className="font-display font-bold text-xl tracking-tight">DarkWave</span>
          </Link>
          <MobileNav />
        </div>
      </nav>

      <main className="pt-20 pb-12">
        <div className="container mx-auto px-4 max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <Link href="/my-hub" className="inline-flex items-center gap-2 text-white/60 hover:text-white mb-4 transition-colors">
              <ArrowLeft className="w-4 h-4" /> Back to My Hub
            </Link>
            
            <h1 className="text-3xl md:text-4xl font-bold mb-2">
              <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                Bug Reports & Feedback
              </span>
            </h1>
            <p className="text-white/60">
              Help us improve by reporting bugs or sharing your ideas. Your feedback goes directly to the development team.
            </p>
          </motion.div>

          {!isAuthenticated && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6"
            >
              <GlassCard className="p-4 border-amber-500/30 bg-amber-500/5">
                <div className="flex items-center gap-3">
                  <AlertCircle className="w-5 h-5 text-amber-400 flex-shrink-0" />
                  <p className="text-sm text-amber-200">
                    <Link href="/" className="underline hover:text-white">Sign in</Link> to track your submissions and receive updates on your reports.
                  </p>
                </div>
              </GlassCard>
            </motion.div>
          )}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <GlassCard className="p-6" glow>
              <div className="mb-6">
                <label className="block text-sm font-medium text-white/80 mb-3">What type of feedback?</label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {FEEDBACK_TYPES.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => setType(t.id)}
                      className={`p-4 rounded-xl border transition-all text-left ${
                        type === t.id 
                          ? `border-${t.color}-500/50 bg-${t.color}-500/10` 
                          : "border-white/10 hover:border-white/20"
                      }`}
                    >
                      <t.icon className={`w-5 h-5 mb-2 ${type === t.id ? `text-${t.color}-400` : "text-white/60"}`} />
                      <p className="font-medium text-sm">{t.label}</p>
                      <p className="text-xs text-white/50">{t.description}</p>
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-white/80 mb-3">Which area?</label>
                <div className="flex flex-wrap gap-2">
                  {CATEGORIES.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => setCategory(c.id)}
                      className={`px-4 py-2 rounded-lg border transition-all flex items-center gap-2 ${
                        category === c.id 
                          ? "border-cyan-500/50 bg-cyan-500/10 text-cyan-400" 
                          : "border-white/10 text-white/60 hover:border-white/20"
                      }`}
                    >
                      <c.icon className="w-4 h-4" />
                      {c.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-white/80 mb-2">Title *</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder={type === "bug" ? "Brief description of the issue" : "What's your suggestion?"}
                  className="w-full px-4 py-3 bg-slate-800/50 border border-white/10 rounded-xl text-white placeholder-white/30 focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/20"
                  data-testid="input-feedback-title"
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-white/80 mb-2">Description *</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Please describe in detail..."
                  rows={4}
                  className="w-full px-4 py-3 bg-slate-800/50 border border-white/10 rounded-xl text-white placeholder-white/30 focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 resize-none"
                  data-testid="input-feedback-description"
                />
              </div>

              {type === "bug" && (
                <>
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-white/80 mb-2">Steps to Reproduce</label>
                    <textarea
                      value={stepsToReproduce}
                      onChange={(e) => setStepsToReproduce(e.target.value)}
                      placeholder="1. Go to...&#10;2. Click on...&#10;3. See the error"
                      rows={3}
                      className="w-full px-4 py-3 bg-slate-800/50 border border-white/10 rounded-xl text-white placeholder-white/30 focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 resize-none"
                      data-testid="input-feedback-steps"
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4 mb-6">
                    <div>
                      <label className="block text-sm font-medium text-white/80 mb-2">Expected Behavior</label>
                      <textarea
                        value={expectedBehavior}
                        onChange={(e) => setExpectedBehavior(e.target.value)}
                        placeholder="What should happen?"
                        rows={2}
                        className="w-full px-4 py-3 bg-slate-800/50 border border-white/10 rounded-xl text-white placeholder-white/30 focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 resize-none"
                        data-testid="input-feedback-expected"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-white/80 mb-2">Actual Behavior</label>
                      <textarea
                        value={actualBehavior}
                        onChange={(e) => setActualBehavior(e.target.value)}
                        placeholder="What actually happens?"
                        rows={2}
                        className="w-full px-4 py-3 bg-slate-800/50 border border-white/10 rounded-xl text-white placeholder-white/30 focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 resize-none"
                        data-testid="input-feedback-actual"
                      />
                    </div>
                  </div>
                </>
              )}

              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  onClick={handleSubmit}
                  disabled={!title.trim() || !description.trim() || submitMutation.isPending}
                  className="flex-1 bg-gradient-to-r from-cyan-500 to-purple-500 hover:opacity-90"
                  data-testid="button-submit-feedback"
                >
                  {submitMutation.isPending ? (
                    "Submitting..."
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" /> Submit Feedback
                    </>
                  )}
                </Button>
              </div>

              {submitMutation.isError && (
                <p className="text-red-400 text-sm mt-3">
                  Failed to submit. Please try again.
                </p>
              )}
            </GlassCard>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-8"
          >
            <GlassCard className="p-6 bg-gradient-to-r from-amber-500/5 to-purple-500/5 border-amber-500/20">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-xl bg-amber-500/20">
                  <Gamepad2 className="w-6 h-6 text-amber-400" />
                </div>
                <div>
                  <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30 mb-2">
                    BETA TESTING
                  </Badge>
                  <h3 className="font-bold text-lg mb-2">Chronicles is in Beta</h3>
                  <p className="text-white/60 text-sm leading-relaxed">
                    We're actively developing DarkWave Chronicles and your feedback is invaluable. 
                    Every bug report and suggestion helps us build a better experience. 
                    Thank you for being part of this journey!
                  </p>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
