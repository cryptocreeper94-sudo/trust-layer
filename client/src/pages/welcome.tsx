import { motion } from "framer-motion";
import { Link } from "wouter";
import { 
  Shield, Rocket, GraduationCap, Coins, Users, Gamepad2, 
  Building2, ChevronRight, Sparkles, Globe, Lock, TrendingUp,
  Heart, Zap, Star, ArrowRight
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
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950" data-testid="welcome-page">
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-cyan-900/20 via-transparent to-transparent" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse delay-1000" />

        <div className="relative z-10 container mx-auto px-4 py-12">
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
            
            <p className="text-xl text-slate-300 max-w-2xl mx-auto mb-6">
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
            transition={{ delay: 0.2 }}
            className="max-w-3xl mx-auto mb-16"
          >
            <GlassCard glow className="p-6 sm:p-8">
              <h2 className="text-xl font-bold text-white mb-4 text-center">
                What is This Place?
              </h2>
              <div className="space-y-4 text-slate-300">
                <p>
                  <strong className="text-white">DarkWave Trust Layer</strong> is your space — a community-owned ecosystem 
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
            
            <div className="grid sm:grid-cols-2 gap-4 max-w-4xl mx-auto">
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
                      className="p-6 h-full cursor-pointer hover:border-white/20 transition-all group"
                    >
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${path.color} flex items-center justify-center mb-4`}>
                        <path.icon className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="text-lg font-semibold text-white mb-2">{path.title}</h3>
                      <p className="text-sm text-slate-400 mb-4">{path.description}</p>
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
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
              {ECOSYSTEM_HIGHLIGHTS.map((item, i) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.7 + i * 0.1 }}
                  className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50 text-center"
                >
                  <item.icon className="w-8 h-8 text-cyan-400 mx-auto mb-2" />
                  <p className="text-sm font-semibold text-white">{item.label}</p>
                  <p className="text-xs text-slate-400">{item.desc}</p>
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
            <GlassCard className="p-6 sm:p-8 bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-purple-500/30">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0">
                  <Heart className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white mb-2">Disrupting the Noise</h3>
                  <p className="text-slate-300 text-sm leading-relaxed">
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
            <h2 className="text-2xl font-bold text-white mb-4">Ready to Explore?</h2>
            <p className="text-slate-400 mb-6 max-w-xl mx-auto">
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
