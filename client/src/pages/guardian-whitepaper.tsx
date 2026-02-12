import { motion } from "framer-motion";
import { Link } from "wouter";
import { 
  Shield, ShieldCheck, Award, CheckCircle, FileText, Lock,
  Eye, Zap, Server, Database, Globe, Clock, Users, Activity,
  ChevronRight, ExternalLink, Download, BookOpen
} from "lucide-react";

import { Footer } from "@/components/footer";
import { GlassCard } from "@/components/glass-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const AUDIT_PHASES = [
  {
    phase: 1,
    title: "Initial Assessment",
    duration: "1-2 days",
    description: "Comprehensive review of project scope, architecture, and codebase structure. Our team establishes communication channels and defines audit parameters.",
    deliverables: ["Scope Definition Document", "Risk Profile Assessment", "Timeline Agreement"]
  },
  {
    phase: 2,
    title: "Automated Analysis",
    duration: "2-3 days",
    description: "Deployment of industry-leading static analysis tools, fuzzing frameworks, and AI-powered vulnerability detection across all smart contracts and backend code.",
    deliverables: ["Static Analysis Report", "Fuzzing Results", "AI Vulnerability Scan"]
  },
  {
    phase: 3,
    title: "Manual Code Review",
    duration: "5-7 days",
    description: "Line-by-line expert review by senior security researchers. Focus on business logic flaws, access control issues, and economic attack vectors.",
    deliverables: ["Detailed Findings Report", "Severity Classifications", "Code Annotations"]
  },
  {
    phase: 4,
    title: "Remediation Support",
    duration: "2-3 days",
    description: "Collaborative sessions with development team to address findings. Verification of fixes and re-testing of remediated vulnerabilities.",
    deliverables: ["Remediation Guide", "Fix Verification", "Updated Risk Assessment"]
  },
  {
    phase: 5,
    title: "Final Certification",
    duration: "1 day",
    description: "Issuance of Guardian Security Certificate, public registry listing, and ongoing monitoring setup for Guardian Shield subscribers.",
    deliverables: ["Security Certificate", "Public Badge", "Registry Listing"]
  }
];

const CERTIFICATION_TIERS = [
  {
    id: "assurance_lite",
    name: "Guardian Assurance Lite",
    price: "$5,999",
    duration: "2-3 weeks",
    icon: ShieldCheck,
    color: "from-purple-500 to-purple-700",
    description: "Comprehensive smart contract security audit for emerging projects",
    features: [
      "Full smart contract audit (up to 2,000 lines)",
      "Automated vulnerability scanning",
      "Manual code review by 2 auditors",
      "Detailed findings report with severity ratings",
      "Remediation guidance",
      "Public registry listing",
      "Guardian Verified badge",
      "30-day post-audit support"
    ],
    bestFor: "New projects launching on mainnet, DeFi protocols under $1M TVL"
  },
  {
    id: "guardian_premier",
    name: "Guardian Premier",
    price: "$14,999",
    duration: "4-6 weeks",
    icon: Award,
    color: "from-pink-500 to-pink-700",
    description: "Enterprise-grade security certification with comprehensive coverage",
    features: [
      "Full smart contract audit (up to 10,000 lines)",
      "Backend API security assessment",
      "Penetration testing",
      "Economic attack simulation",
      "Multi-chain deployment review",
      "Formal verification (where applicable)",
      "4 senior auditors assigned",
      "Priority remediation support",
      "Guardian Shield monitoring (3 months)",
      "Quarterly security reviews",
      "Emergency response hotline",
      "Premium public registry listing"
    ],
    bestFor: "Established protocols, institutional DeFi, bridges, and high-value contracts"
  }
];

const SECURITY_CATEGORIES = [
  { name: "Access Control", description: "Authorization, role management, privilege escalation", icon: Lock },
  { name: "Business Logic", description: "Protocol design, state machine, edge cases", icon: Zap },
  { name: "Economic Security", description: "Flash loans, oracle manipulation, MEV", icon: Activity },
  { name: "Data Validation", description: "Input sanitization, overflow/underflow, reentrancy", icon: Database },
  { name: "External Integrations", description: "Oracle dependencies, cross-chain, composability", icon: Globe },
  { name: "Governance", description: "Voting mechanisms, timelock bypasses, centralization", icon: Users }
];

export default function GuardianWhitepaperPage() {
  return (
    <div className="min-h-screen bg-slate-950">
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-b from-purple-900/20 via-transparent to-transparent" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl" />
        
        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <Badge className="mb-4 bg-purple-500/20 text-purple-300 border-purple-500/30">
              Security Documentation
            </Badge>
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
                Guardian Security System
              </span>
            </h1>
            <p className="text-lg text-white/60 max-w-2xl mx-auto">
              Comprehensive blockchain security certification and continuous monitoring
              for the Trust Layer ecosystem and beyond.
            </p>
          </motion.div>

          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-16"
          >
            <GlassCard glow className="p-8">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0">
                  <Shield className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white mb-2">Mission Statement</h2>
                  <p className="text-white/70 text-lg">
                    Guardian Security exists to bring enterprise-grade security certification
                    to the decentralized world. We combine automated analysis, AI-powered detection,
                    and expert human review to identify vulnerabilities before they can be exploited.
                  </p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                  <div className="text-3xl font-bold text-purple-400 mb-2">$0</div>
                  <div className="text-sm text-white/60">Funds Lost in Certified Projects</div>
                </div>
                <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                  <div className="text-3xl font-bold text-pink-400 mb-2">100%</div>
                  <div className="text-sm text-white/60">Critical Issues Found Before Launch</div>
                </div>
                <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                  <div className="text-3xl font-bold text-cyan-400 mb-2">24/7</div>
                  <div className="text-sm text-white/60">Guardian Shield Monitoring</div>
                </div>
              </div>
            </GlassCard>
          </motion.section>

          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-16"
          >
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
              <FileText className="w-6 h-6 text-purple-400" />
              Audit Process
            </h2>
            
            <div className="space-y-4">
              {AUDIT_PHASES.map((phase, index) => (
                <motion.div
                  key={phase.phase}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * index }}
                >
                  <GlassCard className="p-6">
                    <div className="flex flex-col md:flex-row md:items-start gap-4">
                      <div className="flex items-center gap-4 md:w-1/4">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center font-bold text-white text-lg">
                          {phase.phase}
                        </div>
                        <div>
                          <h3 className="font-semibold text-white">{phase.title}</h3>
                          <p className="text-sm text-white/50 flex items-center gap-1">
                            <Clock className="w-3 h-3" /> {phase.duration}
                          </p>
                        </div>
                      </div>
                      <div className="md:w-1/2">
                        <p className="text-white/70 text-sm">{phase.description}</p>
                      </div>
                      <div className="md:w-1/4">
                        <p className="text-xs text-white/40 uppercase tracking-wider mb-2">Deliverables</p>
                        <div className="flex flex-wrap gap-1">
                          {phase.deliverables.map((d, i) => (
                            <Badge key={i} variant="outline" className="text-xs border-white/10 text-white/60">
                              {d}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </GlassCard>
                </motion.div>
              ))}
            </div>
          </motion.section>

          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-16"
          >
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
              <Award className="w-6 h-6 text-pink-400" />
              Certification Tiers
            </h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {CERTIFICATION_TIERS.map((tier, index) => (
                <motion.div
                  key={tier.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                >
                  <GlassCard glow className="p-6 h-full">
                    <div className="flex items-center gap-4 mb-4">
                      <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${tier.color} flex items-center justify-center`}>
                        <tier.icon className="w-7 h-7 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-white">{tier.name}</h3>
                        <p className="text-white/50 text-sm">{tier.duration}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-baseline gap-1 mb-4">
                      <span className="text-3xl font-bold text-white">{tier.price}</span>
                      <span className="text-white/50">starting</span>
                    </div>
                    
                    <p className="text-white/70 mb-4">{tier.description}</p>
                    
                    <div className="space-y-2 mb-4">
                      {tier.features.map((feature, i) => (
                        <div key={i} className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-white/70">{feature}</span>
                        </div>
                      ))}
                    </div>
                    
                    <div className="pt-4 border-t border-white/10">
                      <p className="text-xs text-white/40 uppercase tracking-wider mb-1">Best For</p>
                      <p className="text-sm text-white/60">{tier.bestFor}</p>
                    </div>
                    
                    <Link href="/guardian-certification">
                      <Button className={`w-full mt-4 bg-gradient-to-r ${tier.color} hover:opacity-90`} data-testid={`button-select-${tier.id}`}>
                        Request Audit
                        <ChevronRight className="w-4 h-4 ml-2" />
                      </Button>
                    </Link>
                  </GlassCard>
                </motion.div>
              ))}
            </div>
          </motion.section>

          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mb-16"
          >
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
              <Eye className="w-6 h-6 text-cyan-400" />
              Security Categories
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {SECURITY_CATEGORIES.map((category, index) => (
                <motion.div
                  key={category.name}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.05 * index }}
                >
                  <GlassCard className="p-4 h-full">
                    <div className="flex items-center gap-3 mb-2">
                      <category.icon className="w-5 h-5 text-purple-400" />
                      <h3 className="font-semibold text-white">{category.name}</h3>
                    </div>
                    <p className="text-sm text-white/60">{category.description}</p>
                  </GlassCard>
                </motion.div>
              ))}
            </div>
          </motion.section>

          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mb-16"
          >
            <GlassCard glow className="p-8">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                <BookOpen className="w-6 h-6 text-purple-400" />
                Methodology
              </h2>
              
              <div className="prose prose-invert max-w-none">
                <h3 className="text-lg font-semibold text-white/90 mb-3">1. Threat Modeling</h3>
                <p className="text-white/70 mb-6">
                  We begin by understanding the protocol's trust assumptions, value flows, and external dependencies.
                  This includes identifying privileged roles, upgrade mechanisms, and emergency procedures.
                </p>
                
                <h3 className="text-lg font-semibold text-white/90 mb-3">2. Automated Scanning</h3>
                <p className="text-white/70 mb-6">
                  Our proprietary Guardian Engine combines multiple static analysis tools (Slither, Mythril, Semgrep)
                  with AI-powered pattern recognition to identify known vulnerability classes and suspicious patterns.
                </p>
                
                <h3 className="text-lg font-semibold text-white/90 mb-3">3. Manual Review</h3>
                <p className="text-white/70 mb-6">
                  Senior security researchers conduct line-by-line review focusing on:
                  business logic correctness, state management, access control boundaries,
                  and economic incentive alignment.
                </p>
                
                <h3 className="text-lg font-semibold text-white/90 mb-3">4. Adversarial Testing</h3>
                <p className="text-white/70 mb-6">
                  For Premier tier, we simulate real-world attack scenarios including flash loan exploits,
                  oracle manipulation, front-running attacks, and governance takeovers.
                </p>
                
                <h3 className="text-lg font-semibold text-white/90 mb-3">5. Continuous Monitoring</h3>
                <p className="text-white/70">
                  Guardian Shield provides ongoing protection with real-time transaction monitoring,
                  anomaly detection, and emergency response capabilities.
                </p>
              </div>
            </GlassCard>
          </motion.section>

          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="text-center"
          >
            <GlassCard glow className="p-8 bg-gradient-to-br from-purple-900/30 to-pink-900/30">
              <h2 className="text-2xl font-bold text-white mb-4">Ready to Secure Your Protocol?</h2>
              <p className="text-white/70 mb-6 max-w-xl mx-auto">
                Join the growing list of projects that trust Guardian Security for their
                blockchain security needs.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/guardian-certification">
                  <Button size="lg" className="bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-90" data-testid="button-request-audit">
                    <Shield className="w-5 h-5 mr-2" />
                    Request Audit
                  </Button>
                </Link>
                <Link href="/guardian-registry">
                  <Button size="lg" variant="outline" className="border-white/20 hover:bg-white/5" data-testid="button-view-registry">
                    <Eye className="w-5 h-5 mr-2" />
                    View Public Registry
                  </Button>
                </Link>
              </div>
            </GlassCard>
          </motion.section>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}
