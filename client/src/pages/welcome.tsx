import { motion } from "framer-motion";
import { Link, useLocation } from "wouter";
import { useState } from "react";
import { 
  Shield, Rocket, GraduationCap, Coins, Users, Gamepad2, 
  Building2, ChevronRight, Sparkles, Globe, Lock, TrendingUp,
  Heart, Zap, Star, ArrowRight, CheckCircle2, Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/glass-card";

const PATHWAYS = [
  {
    icon: Rocket,
    title: "I Want to Join Early",
    description: "Become a founding member and help shape the ecosystem from the ground up. Early supporters get exclusive access and community rewards.",
    color: "from-cyan-500 to-blue-500",
    link: "/presale",
    linkText: "Learn More"
  },
  {
    icon: GraduationCap,
    title: "I'm New to Crypto",
    description: "No worries! Our Academy explains everything in simple terms. Learn at your own pace before diving in.",
    color: "from-purple-500 to-pink-500",
    link: "/academy",
    linkText: "Start Learning"
  },
  {
    icon: Building2,
    title: "I Represent a Business",
    description: "DarkWave provides verified identity and trust infrastructure for B2B relationships. See how we can help your organization.",
    color: "from-emerald-500 to-teal-500",
    link: "/trust-layer",
    linkText: "Business Solutions"
  },
  {
    icon: Users,
    title: "I Want to Join the Community",
    description: "Connect with other members, participate in discussions, and earn rewards for your engagement.",
    color: "from-orange-500 to-amber-500",
    link: "/community",
    linkText: "Join Community"
  }
];

const ECOSYSTEM_HIGHLIGHTS = [
  { icon: Shield, label: "Trust Layer", desc: "Verified identity & accountability" },
  { icon: Coins, label: "Signal Token", desc: "Native ecosystem currency" },
  { icon: Gamepad2, label: "Entertainment", desc: "Games & content (Coming Soon)" },
  { icon: TrendingUp, label: "DeFi Suite", desc: "Swap, stake, earn rewards" }
];

export default function WelcomePage() {
  const [, navigate] = useLocation();
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleQuickRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName.trim() || !email.trim()) {
      setError("Please enter your name and email");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/auth/quick-register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ firstName: firstName.trim(), email: email.trim().toLowerCase() }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Registration failed");
      }
      setSuccess(true);
      setTimeout(() => navigate("/"), 1500);
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950" data-testid="welcome-page">
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-cyan-900/20 via-transparent to-transparent" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse delay-1000" />

        <div className="relative z-10 container mx-auto px-6 sm:px-8 py-16 pt-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <motion.img 
              src="/images/darkwave_emblem.png"
              alt="DarkWave" 
              className="w-24 h-24 mx-auto mb-6"
              animate={{ 
                filter: [
                  'drop-shadow(0 0 20px rgba(6, 182, 212, 0.5))',
                  'drop-shadow(0 0 40px rgba(168, 85, 247, 0.5))',
                  'drop-shadow(0 0 20px rgba(6, 182, 212, 0.5))'
                ]
              }}
              transition={{ duration: 3, repeat: Infinity }}
            />
            
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
              Welcome to{" "}
              <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Your
              </span>{" "}
              Trust Layer
            </h1>
            
            <p className="text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto mb-6 leading-relaxed">
              This isn't our project — it's yours. A community-owned space where 
              your identity is verified, your voice matters, and your participation 
              shapes everything we build together.
            </p>

            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border border-cyan-500/30">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span className="text-sm text-cyan-300">Disrupting the Noise — Join Free</span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="max-w-md mx-auto mb-12"
          >
            <GlassCard glow className="p-6 sm:p-8 shadow-2xl shadow-purple-500/20 border-2 border-cyan-500/30">
              {success ? (
                <div className="text-center py-4">
                  <CheckCircle2 className="w-12 h-12 text-green-400 mx-auto mb-3" />
                  <h3 className="text-xl font-bold text-white mb-2">Welcome Aboard!</h3>
                  <p className="text-slate-300 text-sm">Taking you to your new home...</p>
                </div>
              ) : (
                <>
                  <h2 className="text-xl font-bold text-white mb-2 text-center">
                    Get Started Now
                  </h2>
                  <p className="text-sm text-slate-400 text-center mb-5">
                    Enter your info to join the community
                  </p>
                  <form onSubmit={handleQuickRegister} className="space-y-3">
                    <input
                      type="text"
                      placeholder="First Name"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-gray-500 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/30"
                      data-testid="input-welcome-firstname"
                    />
                    <input
                      type="email"
                      placeholder="Email Address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-gray-500 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/30"
                      data-testid="input-welcome-email"
                    />
                    {error && (
                      <p className="text-xs text-red-400 text-center">{error}</p>
                    )}
                    <Button 
                      type="submit"
                      disabled={loading}
                      className="w-full py-3 text-base font-bold bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 hover:opacity-90 shadow-lg shadow-purple-500/25"
                      data-testid="button-welcome-register"
                    >
                      {loading ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        <>
                          <Rocket className="w-5 h-5 mr-2" />
                          Join the Community
                        </>
                      )}
                    </Button>
                  </form>
                  <p className="text-xs text-slate-500 text-center mt-4">
                    Already a member?{" "}
                    <Link href="/" className="text-cyan-400 hover:underline">
                      Sign In
                    </Link>
                  </p>
                </>
              )}
            </GlassCard>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="max-w-3xl mx-auto mb-16"
          >
            <GlassCard glow className="p-6 sm:p-8 md:p-10 shadow-2xl shadow-cyan-500/10">
              <h2 className="text-2xl font-bold text-white mb-8 text-center">
                What is This Place?
              </h2>
              <div className="space-y-6 text-slate-300 text-base sm:text-lg leading-relaxed">
                <p>
                  <strong className="text-white">Trust Layer</strong> is your space — a community-owned ecosystem 
                  where individuals and businesses build trust and do business differently. No hype. No empty promises. 
                  Just real people building something real.
                </p>
                <p>
                  Unlike platforms where you're the product, here <strong className="text-cyan-400">you're the owner</strong>. 
                  Your identity is verified but private. Your voice shapes the community. 
                  Your participation matters — because this belongs to all of us.
                </p>
                <p>
                  <strong className="text-white">Signal</strong> isn't just a token — it's <strong className="text-cyan-400">your signal</strong>. 
                  Your stake. Your voice. Your proof that you're part of something built to last.
                </p>
                <p>
                  <strong className="text-white">Joining is free.</strong> Get verified, claim your membership, and help us build your community.
                </p>
              </div>
            </GlassCard>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-16"
          >
            <h2 className="text-2xl font-bold text-white text-center mb-8">
              Where Would You Like to Start?
            </h2>
            
            <div className="grid sm:grid-cols-2 gap-6 max-w-4xl mx-auto">
              {PATHWAYS.map((path, i) => (
                <motion.div
                  key={path.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + i * 0.1 }}
                >
                  <Link href={path.link}>
                    <GlassCard 
                      glow 
                      className="p-8 h-full cursor-pointer hover:border-white/20 hover:shadow-xl hover:shadow-cyan-500/10 transition-all group shadow-lg shadow-black/20"
                    >
                      <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${path.color} flex items-center justify-center mb-5 shadow-lg`}>
                        <path.icon className="w-7 h-7 text-white" />
                      </div>
                      <h3 className="text-lg font-semibold text-white mb-4">{path.title}</h3>
                      <p className="text-base text-slate-400 mb-5 leading-relaxed">{path.description}</p>
                      <div className="flex items-center gap-2 text-cyan-400 text-sm font-medium group-hover:gap-3 transition-all">
                        {path.linkText}
                        <ChevronRight className="w-4 h-4" />
                      </div>
                    </GlassCard>
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mb-16"
          >
            <h2 className="text-2xl font-bold text-white text-center mb-8">
              The DarkWave Ecosystem
            </h2>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-5 max-w-4xl mx-auto">
              {ECOSYSTEM_HIGHLIGHTS.map((item, i) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.7 + i * 0.1 }}
                  className="p-6 rounded-xl bg-slate-800/50 border border-slate-700/50 text-center shadow-lg shadow-black/20 backdrop-blur-sm"
                >
                  <item.icon className="w-10 h-10 text-cyan-400 mx-auto mb-4" />
                  <p className="text-base font-semibold text-white mb-2">{item.label}</p>
                  <p className="text-sm text-slate-400 leading-relaxed">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="max-w-3xl mx-auto mb-16"
          >
            <GlassCard className="p-6 sm:p-8 md:p-10 bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-purple-500/30 shadow-2xl shadow-purple-500/10">
              <div className="flex flex-col sm:flex-row items-start gap-5">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0 shadow-lg">
                  <Heart className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-4">Disrupting the Noise</h3>
                  <p className="text-slate-300 text-base leading-relaxed">
                    The noise is everywhere — projects that promise everything and deliver nothing. 
                    We're different. We're building your Trust Layer for the long haul. No hype cycles. 
                    No shortcuts. Just a community that grows together, at the right pace, 
                    building something that actually lasts. This is your space. Let's build it together.
                  </p>
                </div>
              </div>
            </GlassCard>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="text-center mb-12"
          >
            <h2 className="text-2xl font-bold text-white mb-5">Ready to Explore?</h2>
            <p className="text-base sm:text-lg text-slate-400 mb-8 max-w-xl mx-auto leading-relaxed">
              Create a free account to save your progress, earn rewards, and become part of the community.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/?login=true">
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-400 hover:to-purple-400 text-white px-8"
                >
                  Create Free Account
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
              <Link href="/">
                <Button 
                  size="lg" 
                  variant="outline"
                  className="border-white/20 text-white hover:bg-white/10"
                >
                  Browse as Guest
                </Button>
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="text-center text-slate-500 text-sm mb-8"
          >
            <p>Questions? Reach out on <a href="https://t.me/DarkWaveStudios" className="text-cyan-400 hover:underline">Telegram</a> or <a href="https://discord.gg/darkwave" className="text-cyan-400 hover:underline">Discord</a></p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="max-w-3xl mx-auto"
          >
            <div className="p-4 rounded-xl bg-slate-800/30 border border-slate-700/30 text-center">
              <p className="text-xs text-slate-500 leading-relaxed">
                <strong className="text-slate-400">Important Notice:</strong> DarkWave Studios LLC is a technology company building digital infrastructure and community tools. 
                We are <strong>not</strong> a financial services company, investment advisor, or broker. Nothing on this website constitutes financial, legal, or tax advice. 
                Any references to tokens, digital assets, or ecosystem participation are for informational purposes only. 
                Always do your own research (DYOR) and consult with qualified professionals before making any decisions. 
                Participation in digital ecosystems involves risk — never participate with more than you can afford to lose.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </main>
  );
}
