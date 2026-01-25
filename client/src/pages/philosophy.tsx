import { motion } from "framer-motion";
import { GlassCard } from "@/components/glass-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { 
  BookOpen, 
  Zap, 
  FileText, 
  Scale, 
  Users,
  ArrowRight,
  Shield,
  Heart,
  Target,
  Lightbulb,
  Lock,
  Sparkles
} from "lucide-react";

export default function Philosophy() {
  const documents = [
    {
      id: "signal-core",
      title: "Signal Core",
      subtitle: "The Immutable Foundation",
      description: "The permanent principles that cannot be changed, voted away, or circumvented. These define who we are and what we stand for. Break the Core, the Signal dies.",
      icon: Zap,
      color: "from-cyan-500 to-purple-500",
      badge: "Immutable",
      badgeColor: "bg-purple-500/20 text-purple-300",
      href: "/signal-core",
      featured: true
    },
    {
      id: "governance-charter",
      title: "Governance Charter",
      subtitle: "The Path to Ownership",
      description: "How governance evolves from founding to full community autonomy. Defines council roles, voting mechanics, treasury controls, and the milestones for power transfer.",
      icon: Scale,
      color: "from-purple-500 to-pink-500",
      badge: "Framework",
      badgeColor: "bg-pink-500/20 text-pink-300",
      href: "/governance-charter",
      featured: true
    },
    {
      id: "executive-summary",
      title: "Executive Summary",
      subtitle: "The Vision",
      description: "A comprehensive overview of the Trust Layer ecosystem — what we're building, why it matters, and how it changes the game for businesses and individuals.",
      icon: FileText,
      color: "from-blue-500 to-cyan-500",
      badge: "Overview",
      badgeColor: "bg-cyan-500/20 text-cyan-300",
      href: "/doc-hub",
      featured: false
    },
    {
      id: "tokenomics",
      title: "Tokenomics",
      subtitle: "Signal Economics",
      description: "The economic model behind Signal (SIG) — allocation, distribution, staking mechanics, and how the token powers the trust layer ecosystem.",
      icon: Target,
      color: "from-green-500 to-emerald-500",
      badge: "Economics",
      badgeColor: "bg-green-500/20 text-green-300",
      href: "/tokenomics",
      featured: false
    }
  ];

  const coreBeliefs = [
    {
      title: "Community First",
      description: "This belongs to everyone who participates. Not to a company. Not to an individual. To the community.",
      icon: Users
    },
    {
      title: "Trust Through Verification",
      description: "Identity is verified but private. Accountability without surveillance. Trust by design, not by promise.",
      icon: Shield
    },
    {
      title: "No Empty Promises",
      description: "We build. We deliver. We don't hype. The noise is everywhere — we're here to disrupt it.",
      icon: Heart
    },
    {
      title: "Transparent Operations",
      description: "Decisions, treasury movements, and progress — all visible. No hidden agendas. No backroom deals.",
      icon: Lightbulb
    }
  ];

  return (
    <div className="min-h-screen bg-slate-950 pt-20 pb-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="relative inline-block mb-6">
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 rounded-full blur-xl opacity-50"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.5, 0.8, 0.5]
              }}
              transition={{ duration: 3, repeat: Infinity }}
            />
            <div className="relative w-20 h-20 mx-auto bg-gradient-to-br from-cyan-500 via-purple-500 to-pink-500 rounded-full flex items-center justify-center">
              <BookOpen className="w-10 h-10 text-white" />
            </div>
          </div>

          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            Our{" "}
            <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Philosophy
            </span>
          </h1>
          
          <p className="text-xl text-slate-300 max-w-3xl mx-auto mb-6">
            The founding documents that define who we are, what we believe, and how 
            this community operates. These aren't marketing — they're commitments.
          </p>

          <Badge className="bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border-cyan-500/30 text-cyan-300">
            <Sparkles className="w-3 h-3 mr-1" />
            Your Community. Your Standards.
          </Badge>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-12"
        >
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
            <FileText className="w-6 h-6 text-cyan-400" />
            Founding Documents
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {documents.filter(d => d.featured).map((doc, index) => (
              <motion.div
                key={doc.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
              >
                <Link href={doc.href}>
                  <GlassCard glow className="p-6 h-full cursor-pointer hover:border-cyan-500/50 transition-all group">
                    <div className="flex items-start gap-4">
                      <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${doc.color} flex items-center justify-center flex-shrink-0`}>
                        <doc.icon className="w-7 h-7 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-bold text-white text-lg">{doc.title}</h3>
                          <Badge className={doc.badgeColor}>
                            <Lock className="w-2 h-2 mr-1" />
                            {doc.badge}
                          </Badge>
                        </div>
                        <p className="text-cyan-400 text-sm mb-2">{doc.subtitle}</p>
                        <p className="text-slate-400 text-sm leading-relaxed mb-4">
                          {doc.description}
                        </p>
                        <div className="flex items-center text-cyan-400 text-sm group-hover:text-cyan-300 transition-colors">
                          Read Document
                          <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    </div>
                  </GlassCard>
                </Link>
              </motion.div>
            ))}
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
            {documents.filter(d => !d.featured).map((doc, index) => (
              <motion.div
                key={doc.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + 0.1 * index }}
              >
                <Link href={doc.href}>
                  <GlassCard className="p-4 cursor-pointer hover:border-white/20 transition-all group">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${doc.color} flex items-center justify-center flex-shrink-0`}>
                        <doc.icon className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-white text-sm">{doc.title}</h3>
                        <p className="text-slate-400 text-xs truncate">{doc.subtitle}</p>
                      </div>
                      <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 group-hover:translate-x-1 transition-all" />
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
          transition={{ delay: 0.3 }}
          className="mb-12"
        >
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
            <Heart className="w-6 h-6 text-pink-400" />
            What We Believe
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {coreBeliefs.map((belief, index) => (
              <motion.div
                key={belief.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
              >
                <GlassCard glow className="p-5 h-full text-center">
                  <div className="w-12 h-12 mx-auto rounded-full bg-gradient-to-br from-cyan-500/20 to-purple-500/20 flex items-center justify-center mb-3">
                    <belief.icon className="w-6 h-6 text-cyan-400" />
                  </div>
                  <h3 className="font-bold text-white mb-2">{belief.title}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">
                    {belief.description}
                  </p>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <GlassCard glow className="p-8 text-center border-cyan-500/30">
            <Zap className="w-12 h-12 text-cyan-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-4">
              We Are the DarkWave
            </h2>
            <p className="text-slate-300 max-w-2xl mx-auto mb-6">
              Not "our" project. Not "our" community. <strong className="text-cyan-400">Yours</strong>. 
              We're building the infrastructure, but you're the ones who give it meaning. 
              These documents are our commitment — read them, hold us to them, and help us 
              build something that actually lasts.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/welcome">
                <Button className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600">
                  Join the Community
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
              <Link href="/signal-core">
                <Button variant="outline" className="border-white/20 text-white hover:bg-white/5">
                  Read Signal Core
                </Button>
              </Link>
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </div>
  );
}
