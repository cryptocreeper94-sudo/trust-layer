import { motion } from "framer-motion";
import { GlassCard } from "@/components/glass-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { 
  FileText, 
  Users, 
  Vote, 
  Wallet,
  Clock,
  Target,
  CheckCircle2,
  ArrowRight,
  Milestone,
  Shield,
  Scale,
  Zap,
  Calendar,
  TrendingUp,
  Lock
} from "lucide-react";

export default function GovernanceCharter() {
  const phases = [
    {
      phase: "Phase 1",
      title: "Foundation",
      status: "current",
      milestone: "Pre-Launch",
      description: "Establishing the core principles and infrastructure",
      items: [
        "Signal Core document ratified and published",
        "Governance Council structure defined",
        "Multi-SIG treasury wallet created",
        "Community verification system active",
        "Founding team seats established"
      ]
    },
    {
      phase: "Phase 2",
      title: "Community Building",
      status: "upcoming",
      milestone: "Post-TGE",
      description: "Growing the community and establishing first governance processes",
      items: [
        "First Community Seat election held",
        "Integrity Seat appointment process",
        "Proposal submission system activated",
        "Community voting mechanisms tested",
        "Treasury oversight reports begin"
      ]
    },
    {
      phase: "Phase 3",
      title: "Decentralized Governance",
      status: "future",
      milestone: "10,000+ Verified Members",
      description: "Full governance power transferred to the community",
      items: [
        "Guardian Seat rotation begins",
        "Community-led proposal voting active",
        "Transparent treasury management live",
        "Quarterly governance reviews",
        "Constitutional amendments process (non-Core only)"
      ]
    },
    {
      phase: "Phase 4",
      title: "Full Autonomy",
      status: "future",
      milestone: "Ecosystem Maturity",
      description: "The community owns and operates the ecosystem",
      items: [
        "Founder transitions to advisory role",
        "All major decisions community-voted",
        "Self-sustaining treasury operations",
        "Cross-chain governance integration",
        "Signal Core remains immutable forever"
      ]
    }
  ];

  const councilRoles = [
    {
      title: "Founder Seat",
      responsibility: "Vision & Core Protection",
      powers: [
        "Veto power on Signal Core violations only",
        "Cannot veto community proposals",
        "Transitions to advisory in Phase 4",
        "Permanent seat during active development"
      ],
      limitations: [
        "Cannot unilaterally move treasury",
        "Cannot override community votes",
        "Cannot modify Signal Core"
      ]
    },
    {
      title: "Operations Seat",
      responsibility: "Day-to-Day Management",
      powers: [
        "Execute approved proposals",
        "Manage technical operations",
        "Community liaison duties",
        "Emergency response coordination"
      ],
      limitations: [
        "Subject to community oversight",
        "Cannot approve treasury without council",
        "Appointed, not elected"
      ]
    },
    {
      title: "Community Seat",
      responsibility: "Member Representation",
      powers: [
        "Advocate for member interests",
        "Propose community initiatives",
        "Vote on all council decisions",
        "Treasury oversight participation"
      ],
      limitations: [
        "Term limits apply",
        "Must maintain verified status",
        "Subject to recall vote"
      ]
    },
    {
      title: "Integrity Seat",
      responsibility: "Ethical Oversight",
      powers: [
        "Dispute resolution authority",
        "Core violation investigation",
        "Whistleblower protection",
        "Ethics review of proposals"
      ],
      limitations: [
        "Appointed for demonstrated service",
        "Cannot hold other council seats",
        "Advisory on technical matters"
      ]
    },
    {
      title: "Guardian Seat",
      responsibility: "Fresh Perspective",
      powers: [
        "Full voting rights",
        "Proposal introduction",
        "Community engagement initiatives",
        "External partnership evaluation"
      ],
      limitations: [
        "6-month rotating terms",
        "Cannot serve consecutive terms",
        "Selected by council consensus"
      ]
    }
  ];

  const treasuryRules = [
    {
      category: "Access Controls",
      rules: [
        "3-of-5 multi-signature required for any movement",
        "24-hour timelock on transactions over $10,000",
        "72-hour timelock on transactions over $100,000",
        "Emergency freeze capability with 4-of-5 consensus"
      ]
    },
    {
      category: "Transparency",
      rules: [
        "All transactions publicly visible on-chain",
        "Monthly treasury reports published",
        "Annual independent audits",
        "Real-time balance tracking available"
      ]
    },
    {
      category: "Allocation",
      rules: [
        "Development: Capped at 15% of treasury annually",
        "Operations: Approved quarterly budgets",
        "Community Grants: Proposal-based approval",
        "Emergency Reserve: Minimum 20% maintained"
      ]
    }
  ];

  const votingMechanics = [
    {
      type: "Standard Proposals",
      threshold: "Simple majority (51%)",
      quorum: "10% of verified members",
      duration: "7 days voting period"
    },
    {
      type: "Treasury Proposals",
      threshold: "Supermajority (67%)",
      quorum: "15% of verified members",
      duration: "14 days voting period"
    },
    {
      type: "Constitutional Amendments",
      threshold: "Supermajority (75%)",
      quorum: "25% of verified members",
      duration: "30 days voting period"
    },
    {
      type: "Emergency Actions",
      threshold: "4-of-5 Council",
      quorum: "Council only",
      duration: "Immediate with 72hr community review"
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
          <Badge className="bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border-cyan-500/30 text-cyan-300 mb-4">
            <FileText className="w-3 h-3 mr-1" />
            Governance Framework
          </Badge>

          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            Governance{" "}
            <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Charter
            </span>
          </h1>
          
          <p className="text-xl text-slate-300 max-w-3xl mx-auto mb-6">
            The roadmap to community ownership. This document outlines how governance 
            will evolve from founding to full community autonomy — and when the power 
            becomes truly yours.
          </p>

          <div className="flex flex-wrap justify-center gap-3">
            <Link href="/signal-core">
              <Button variant="outline" className="border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10">
                <Zap className="w-4 h-4 mr-2" />
                Signal Core
              </Button>
            </Link>
            <Link href="/philosophy">
              <Button variant="outline" className="border-purple-500/30 text-purple-400 hover:bg-purple-500/10">
                <FileText className="w-4 h-4 mr-2" />
                Philosophy Hub
              </Button>
            </Link>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-12"
        >
          <GlassCard glow className="p-6 sm:p-8 border-cyan-500/30">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-500 to-purple-500 flex items-center justify-center flex-shrink-0">
                <Scale className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white mb-2">The Promise</h2>
                <p className="text-slate-300 leading-relaxed">
                  This governance framework is our commitment to you. It defines how and when 
                  power transitions from the founding team to the community. Once we reach the 
                  milestones outlined below, this becomes <strong className="text-cyan-400">truly yours</strong> — 
                  your voice, your trust, your Signal. We are merely the stewards until you're ready 
                  to take the wheel.
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
            <Milestone className="w-6 h-6 text-cyan-400" />
            Implementation Phases
          </h2>
          
          <div className="space-y-4">
            {phases.map((phase, index) => (
              <motion.div
                key={phase.phase}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * index }}
              >
                <GlassCard 
                  glow={phase.status === "current"} 
                  className={`p-6 ${phase.status === "current" ? "border-cyan-500/50" : ""}`}
                >
                  <div className="flex flex-col md:flex-row md:items-start gap-4">
                    <div className="flex items-center gap-3 md:w-48 flex-shrink-0">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                        phase.status === "current" 
                          ? "bg-gradient-to-br from-cyan-500 to-purple-500" 
                          : "bg-slate-700"
                      }`}>
                        {phase.status === "current" ? (
                          <TrendingUp className="w-6 h-6 text-white" />
                        ) : (
                          <Clock className="w-6 h-6 text-slate-400" />
                        )}
                      </div>
                      <div>
                        <div className="font-bold text-white">{phase.phase}</div>
                        <div className="text-sm text-slate-400">{phase.title}</div>
                      </div>
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge className={
                          phase.status === "current" 
                            ? "bg-cyan-500/20 text-cyan-300" 
                            : "bg-slate-700/50 text-slate-400"
                        }>
                          <Target className="w-3 h-3 mr-1" />
                          {phase.milestone}
                        </Badge>
                        {phase.status === "current" && (
                          <Badge className="bg-green-500/20 text-green-300">Active</Badge>
                        )}
                      </div>
                      <p className="text-slate-300 text-sm mb-3">{phase.description}</p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {phase.items.map((item, i) => (
                          <div key={i} className="flex items-center gap-2 text-sm">
                            <CheckCircle2 className={`w-4 h-4 flex-shrink-0 ${
                              phase.status === "current" ? "text-cyan-400" : "text-slate-500"
                            }`} />
                            <span className="text-slate-400">{item}</span>
                          </div>
                        ))}
                      </div>
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
            Council Roles & Powers
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {councilRoles.map((role, index) => (
              <motion.div
                key={role.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
              >
                <GlassCard glow className="p-6 h-full">
                  <h3 className="font-bold text-white mb-1">{role.title}</h3>
                  <p className="text-cyan-400 text-sm mb-4">{role.responsibility}</p>
                  
                  <div className="space-y-4">
                    <div>
                      <div className="text-xs text-slate-500 uppercase tracking-wide mb-2">Powers</div>
                      <div className="space-y-1">
                        {role.powers.map((power, i) => (
                          <div key={i} className="flex items-center gap-2 text-sm">
                            <CheckCircle2 className="w-3 h-3 text-green-400 flex-shrink-0" />
                            <span className="text-slate-300">{power}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <div className="text-xs text-slate-500 uppercase tracking-wide mb-2">Limitations</div>
                      <div className="space-y-1">
                        {role.limitations.map((limit, i) => (
                          <div key={i} className="flex items-center gap-2 text-sm">
                            <Lock className="w-3 h-3 text-amber-400 flex-shrink-0" />
                            <span className="text-slate-400">{limit}</span>
                          </div>
                        ))}
                      </div>
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
          transition={{ delay: 0.4 }}
          className="mb-12"
        >
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
            <Wallet className="w-6 h-6 text-cyan-400" />
            Treasury Governance
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {treasuryRules.map((section, index) => (
              <motion.div
                key={section.category}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
              >
                <GlassCard glow className="p-6 h-full">
                  <h3 className="font-bold text-white mb-4">{section.category}</h3>
                  <div className="space-y-2">
                    {section.rules.map((rule, i) => (
                      <div key={i} className="flex items-start gap-2 text-sm">
                        <Shield className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
                        <span className="text-slate-300">{rule}</span>
                      </div>
                    ))}
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mb-12"
        >
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
            <Vote className="w-6 h-6 text-cyan-400" />
            Voting Mechanics
          </h2>
          
          <GlassCard glow className="p-6 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left py-3 px-4 text-slate-400 font-medium">Proposal Type</th>
                  <th className="text-left py-3 px-4 text-slate-400 font-medium">Threshold</th>
                  <th className="text-left py-3 px-4 text-slate-400 font-medium">Quorum</th>
                  <th className="text-left py-3 px-4 text-slate-400 font-medium">Duration</th>
                </tr>
              </thead>
              <tbody>
                {votingMechanics.map((item, index) => (
                  <tr key={index} className="border-b border-white/5">
                    <td className="py-3 px-4 text-white font-medium">{item.type}</td>
                    <td className="py-3 px-4 text-cyan-400">{item.threshold}</td>
                    <td className="py-3 px-4 text-slate-300">{item.quorum}</td>
                    <td className="py-3 px-4 text-slate-400">{item.duration}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </GlassCard>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <GlassCard glow className="p-8 text-center border-purple-500/30">
            <Calendar className="w-12 h-12 text-purple-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-4">
              When Does This Become Yours?
            </h2>
            <p className="text-slate-300 max-w-2xl mx-auto mb-6">
              We're not putting an arbitrary date on governance transfer. Instead, we're tying it to 
              real milestones — community size, ecosystem maturity, and readiness. When we reach 
              Phase 3, the power shifts. When we reach Phase 4, <strong className="text-purple-400">you run this</strong>. 
              We become advisory. The Signal Core remains forever. This is the promise.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/signal-core">
                <Button className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600">
                  Read Signal Core
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
              <Link href="/welcome">
                <Button variant="outline" className="border-white/20 text-white hover:bg-white/5">
                  Join the Community
                </Button>
              </Link>
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </div>
  );
}
