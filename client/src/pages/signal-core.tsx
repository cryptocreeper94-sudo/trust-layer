import { motion } from "framer-motion";
import { GlassCard } from "@/components/glass-card";
import { Badge } from "@/components/ui/badge";
import { 
  Shield, 
  Lock, 
  Users, 
  Scale, 
  Heart,
  Zap,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Fingerprint,
  Vote,
  Wallet,
  Eye
} from "lucide-react";

export default function SignalCore() {
  const immutablePrinciples = [
    {
      id: 1,
      title: "Community Ownership",
      description: "DarkWave Trust Layer belongs to its community. No single entity, including founders, can claim exclusive ownership. The ecosystem exists for and is governed by its members.",
      icon: Users,
      status: "immutable"
    },
    {
      id: 2,
      title: "Verified Identity, Protected Privacy",
      description: "Every member's identity is verified to ensure accountability, but personal information remains private and secure. Trust through verification, not surveillance.",
      icon: Fingerprint,
      status: "immutable"
    },
    {
      id: 3,
      title: "Transparent Operations",
      description: "All governance decisions, treasury movements, and major changes are publicly visible. Hidden agendas have no place in this community.",
      icon: Eye,
      status: "immutable"
    },
    {
      id: 4,
      title: "No Empty Promises",
      description: "We do not overpromise or create artificial hype. Progress is shared honestly, timelines are realistic, and setbacks are acknowledged openly.",
      icon: Heart,
      status: "immutable"
    },
    {
      id: 5,
      title: "Community Voice Matters",
      description: "Signal holders have a voice in the direction of the ecosystem. Governance mechanisms ensure that the community shapes its own future.",
      icon: Vote,
      status: "immutable"
    },
    {
      id: 6,
      title: "Treasury Protection",
      description: "Community funds are protected by multi-signature requirements. No single person can unilaterally access or move treasury assets.",
      icon: Wallet,
      status: "immutable"
    },
    {
      id: 7,
      title: "Integrity Over Profit",
      description: "Decisions prioritize long-term community health over short-term gains. We exist to help, not to exploit.",
      icon: Scale,
      status: "immutable"
    },
    {
      id: 8,
      title: "The Core Cannot Be Altered",
      description: "These principles are permanent. They cannot be voted away, amended, or circumvented. If these principles are violated, the Signal ceases to be legitimate.",
      icon: Lock,
      status: "immutable"
    }
  ];

  const governanceStructure = [
    {
      seat: "Founder Seat",
      role: "Vision keeper, veto power on core violations only",
      selection: "Permanent",
      holder: "Crypto Creeper",
      color: "from-purple-500 to-pink-500"
    },
    {
      seat: "Operations Seat",
      role: "Day-to-day decisions, community liaison",
      selection: "Appointed by Founder",
      holder: "To be announced",
      color: "from-cyan-500 to-blue-500"
    },
    {
      seat: "Community Seat",
      role: "Represents member interests, proposal advocacy",
      selection: "Elected by verified members",
      holder: "To be elected",
      color: "from-green-500 to-emerald-500"
    },
    {
      seat: "Integrity Seat",
      role: "Ethical oversight, dispute resolution",
      selection: "Appointed for demonstrated service",
      holder: "To be appointed",
      color: "from-amber-500 to-orange-500"
    },
    {
      seat: "Guardian Seat",
      role: "Fresh perspective, term-limited rotation",
      selection: "Rotating, 6-month terms",
      holder: "Future implementation",
      color: "from-rose-500 to-red-500"
    }
  ];

  const treasuryRules = [
    { rule: "3-of-5 signatures required for any treasury movement", allowed: true },
    { rule: "All transactions publicly visible on-chain", allowed: true },
    { rule: "24-hour timelock on major expenditures", allowed: true },
    { rule: "Community notification for transfers above threshold", allowed: true },
    { rule: "No single person can move funds unilaterally", allowed: true },
    { rule: "Regular treasury reports to community", allowed: true }
  ];

  const violations = [
    "Attempting to centralize control",
    "Hidden or undisclosed treasury movements",
    "Exploiting community members for profit",
    "Breaking verified identity protections",
    "Suppressing community voice or vote",
    "Making promises without intention to deliver"
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
            <div className="relative w-24 h-24 mx-auto bg-gradient-to-br from-cyan-500 via-purple-500 to-pink-500 rounded-full flex items-center justify-center">
              <Zap className="w-12 h-12 text-white" />
            </div>
          </div>

          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            Signal{" "}
            <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Core
            </span>
          </h1>
          
          <p className="text-xl text-slate-300 max-w-3xl mx-auto mb-6">
            The immutable foundation from which all Signal emanates. 
            These principles cannot be changed, voted away, or circumvented. 
            Break the Core, and the Signal dies.
          </p>

          <Badge className="bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border-cyan-500/30 text-cyan-300">
            <Lock className="w-3 h-3 mr-1" />
            Permanent & Immutable
          </Badge>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-12"
        >
          <GlassCard glow className="p-6 sm:p-8 border-amber-500/30">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center flex-shrink-0">
                <AlertTriangle className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white mb-2">What This Document Is</h2>
                <p className="text-slate-300 leading-relaxed">
                  Signal Core is <strong className="text-white">not a living document</strong>. It is a static, 
                  permanent declaration of the principles that define this community. These words represent our 
                  integrity and our intention to help rather than harm. They are a reflection of who we are — 
                  not promises we might break, but standards we will uphold. If these principles are ever violated, 
                  the community has every right to consider the Signal compromised.
                </p>
              </div>
            </div>
          </GlassCard>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-12"
        >
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
            <Shield className="w-6 h-6 text-cyan-400" />
            The Immutable Principles
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {immutablePrinciples.map((principle, index) => (
              <motion.div
                key={principle.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
              >
                <GlassCard glow className="p-6 h-full">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500 to-purple-500 flex items-center justify-center flex-shrink-0">
                      <principle.icon className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-bold text-white">{principle.title}</h3>
                        <Badge className="bg-purple-500/20 text-purple-300 text-xs">
                          <Lock className="w-2 h-2 mr-1" />
                          Immutable
                        </Badge>
                      </div>
                      <p className="text-slate-400 text-sm leading-relaxed">
                        {principle.description}
                      </p>
                    </div>
                  </div>
                </GlassCard>
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
            <Users className="w-6 h-6 text-cyan-400" />
            Governance Council
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {governanceStructure.map((seat, index) => (
              <motion.div
                key={seat.seat}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
              >
                <GlassCard glow className="p-6 h-full">
                  <div className={`w-full h-1 rounded-full bg-gradient-to-r ${seat.color} mb-4`} />
                  <h3 className="font-bold text-white mb-1">{seat.seat}</h3>
                  <p className="text-slate-400 text-sm mb-3">{seat.role}</p>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-500">Selection:</span>
                      <span className="text-slate-300">{seat.selection}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-500">Current:</span>
                      <span className="text-cyan-400">{seat.holder}</span>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </div>
          
          <div className="mt-6">
            <GlassCard className="p-6 bg-slate-800/50">
              <h3 className="font-bold text-white mb-3 flex items-center gap-2">
                <Wallet className="w-5 h-5 text-cyan-400" />
                Multi-SIG Treasury Protection
              </h3>
              <p className="text-slate-400 text-sm mb-4">
                The community treasury is protected by multi-signature requirements. 
                "Multi-SIG" — multiple Signals must align before funds can move.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {treasuryRules.map((item, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-green-400 flex-shrink-0" />
                    <span className="text-slate-300">{item.rule}</span>
                  </div>
                ))}
              </div>
            </GlassCard>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-12"
        >
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
            <XCircle className="w-6 h-6 text-red-400" />
            Core Violations
          </h2>
          
          <GlassCard glow className="p-6 border-red-500/20">
            <p className="text-slate-300 mb-4">
              The following actions constitute a violation of Signal Core. If these occur, 
              the community should consider the Signal compromised:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {violations.map((violation, index) => (
                <div key={index} className="flex items-center gap-2 text-sm">
                  <XCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
                  <span className="text-slate-400">{violation}</span>
                </div>
              ))}
            </div>
          </GlassCard>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <GlassCard glow className="p-8 text-center border-cyan-500/30">
            <Zap className="w-12 h-12 text-cyan-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-4">
              The Signal Emanates From Here
            </h2>
            <p className="text-slate-300 max-w-2xl mx-auto mb-6">
              This is Signal Core — the origin point. These principles are not suggestions 
              or aspirations. They are the foundation upon which everything else is built. 
              The Signal is only as strong as the Core that produces it. 
              <strong className="text-cyan-400"> This is your community. These are your standards.</strong>
            </p>
            <div className="flex items-center justify-center gap-2 text-sm text-slate-500">
              <Lock className="w-4 h-4" />
              <span>Established 2026 — Permanent & Unchangeable</span>
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </div>
  );
}
