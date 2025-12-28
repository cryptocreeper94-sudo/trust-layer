import { motion } from "framer-motion";
import { Link } from "wouter";
import { 
  Shield, ShieldCheck, Award, CheckCircle, Star, Zap, FileText,
  ArrowLeft, ExternalLink, Clock, Users, Target, Lock, Eye,
  Sparkles, TrendingUp, Building, Code, Server, Database,
  BadgeCheck, Layers, Activity, FileCheck, AlertTriangle
} from "lucide-react";
import { Footer } from "@/components/footer";
import { GlassCard } from "@/components/glass-card";
import { HeaderTools } from "@/components/header-tools";
import { usePageAnalytics } from "@/hooks/use-analytics";

const CERTIFICATION_TIERS = [
  {
    name: "Self-Cert",
    tagline: "For DWSC Ecosystem Projects",
    price: "Free",
    priceNote: "Quarterly reviews",
    features: [
      "Automated security scans",
      "Configuration review",
      "Basic threat assessment",
      "Internal compliance check",
      "Self-certification badge",
      "Community visibility"
    ],
    highlight: false,
    icon: Shield,
    color: "cyan"
  },
  {
    name: "Assurance Lite",
    tagline: "Essential Security Validation",
    price: "$5,999",
    priceNote: "Per audit cycle",
    features: [
      "Everything in Self-Cert",
      "Infrastructure hygiene audit",
      "API security review",
      "Rate limiting verification",
      "Secret management audit",
      "Guardian Lite badge",
      "30-day remediation support",
      "1-year certification validity"
    ],
    highlight: false,
    icon: ShieldCheck,
    color: "purple"
  },
  {
    name: "Guardian Premier",
    tagline: "Enterprise-Grade Certification",
    price: "$14,999",
    priceNote: "Comprehensive audit",
    features: [
      "Everything in Assurance Lite",
      "Full smart contract review",
      "Penetration testing coordination",
      "On-chain code analysis",
      "Cryptographic implementation audit",
      "Executive security scorecard",
      "Remediation verification",
      "Guardian Premier badge",
      "90-day priority support",
      "Featured in Guardian Registry"
    ],
    highlight: true,
    icon: Award,
    color: "pink"
  }
];

const METHODOLOGY_PILLARS = [
  {
    icon: Target,
    title: "Threat Modeling",
    description: "Systematic identification of attack vectors specific to blockchain applications"
  },
  {
    icon: Code,
    title: "Static Analysis",
    description: "Automated and manual code review for vulnerabilities and anti-patterns"
  },
  {
    icon: Activity,
    title: "Dynamic Testing",
    description: "Runtime behavior analysis and penetration testing simulations"
  },
  {
    icon: Database,
    title: "Infrastructure Audit",
    description: "Server configuration, secrets management, and access control review"
  },
  {
    icon: Lock,
    title: "Cryptographic Review",
    description: "Verification of encryption, signing, and key management implementations"
  },
  {
    icon: FileCheck,
    title: "Compliance Mapping",
    description: "Alignment with industry security standards and best practices"
  }
];

const PROCESS_STEPS = [
  { step: 1, title: "Engagement", description: "Initial scoping call and documentation review" },
  { step: 2, title: "Discovery", description: "Architecture analysis and threat modeling" },
  { step: 3, title: "Assessment", description: "Comprehensive security testing and code review" },
  { step: 4, title: "Findings", description: "Detailed report with severity ratings and fixes" },
  { step: 5, title: "Remediation", description: "Support during vulnerability resolution" },
  { step: 6, title: "Certification", description: "Final verification and badge issuance" }
];

const WHY_GUARDIAN = [
  {
    icon: TrendingUp,
    title: "70% Cost Savings",
    description: "Enterprise security at a fraction of traditional audit firm pricing"
  },
  {
    icon: Zap,
    title: "2-Week Turnaround",
    description: "Fast results without sacrificing thoroughness"
  },
  {
    icon: Building,
    title: "Blockchain Native",
    description: "Built by blockchain engineers, for blockchain projects"
  },
  {
    icon: Eye,
    title: "Full Transparency",
    description: "Open methodology, public registry, verifiable badges"
  }
];

const CERTIFIED_PROJECTS = [
  { name: "DarkWave Smart Chain", status: "Certified", score: 78, date: "Dec 2024" },
  { name: "ChronoChat Platform", status: "In Progress", score: null, date: "Q1 2025" },
  { name: "DarkWave Chronicles", status: "Scheduled", score: null, date: "Q2 2025" }
];

function GuardianBadge({ tier, size = "lg" }: { tier: string; size?: "sm" | "lg" }) {
  const sizeClasses = size === "lg" ? "w-32 h-32" : "w-16 h-16";
  const innerSize = size === "lg" ? "w-24 h-24" : "w-12 h-12";
  
  return (
    <div className={`relative ${sizeClasses} mx-auto`}>
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/30 via-purple-500/30 to-pink-500/30 rounded-full blur-xl animate-pulse" />
      <div className={`relative ${sizeClasses} rounded-full bg-gradient-to-br from-slate-800 to-slate-900 border-2 border-cyan-500/50 flex items-center justify-center`}>
        <div className={`${innerSize} rounded-full bg-gradient-to-br from-cyan-500/20 via-purple-500/20 to-pink-500/20 flex items-center justify-center`}>
          <ShieldCheck className={size === "lg" ? "w-12 h-12" : "w-6 h-6"} style={{ color: "#06b6d4" }} />
        </div>
      </div>
      <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-3 py-1 bg-gradient-to-r from-cyan-600 to-purple-600 rounded-full">
        <span className="text-xs font-bold text-white uppercase tracking-wider">{tier}</span>
      </div>
    </div>
  );
}

function TierCard({ tier, index }: { tier: typeof CERTIFICATION_TIERS[0]; index: number }) {
  const colorMap: Record<string, string> = {
    cyan: "from-cyan-500/20 to-cyan-600/20 border-cyan-500/30 hover:border-cyan-400/50",
    purple: "from-purple-500/20 to-purple-600/20 border-purple-500/30 hover:border-purple-400/50",
    pink: "from-pink-500/20 to-pink-600/20 border-pink-500/30 hover:border-pink-400/50"
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.15 }}
      className="h-full"
    >
      <div className={`relative h-full rounded-2xl bg-gradient-to-b ${colorMap[tier.color]} border ${tier.highlight ? "border-2" : ""} p-1 transition-all duration-300 hover:scale-[1.02]`}>
        {tier.highlight && (
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full">
            <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1">
              <Star className="w-3 h-3" /> Most Popular
            </span>
          </div>
        )}
        <div className="h-full rounded-xl bg-slate-900/90 p-6 flex flex-col">
          <div className="text-center mb-6">
            <div className={`w-16 h-16 mx-auto mb-4 rounded-xl bg-gradient-to-br ${colorMap[tier.color].split(" ")[0]} ${colorMap[tier.color].split(" ")[1]} flex items-center justify-center`}>
              <tier.icon className="w-8 h-8" style={{ color: tier.color === "cyan" ? "#06b6d4" : tier.color === "purple" ? "#a855f7" : "#ec4899" }} />
            </div>
            <h3 className="text-2xl font-bold text-white mb-1">{tier.name}</h3>
            <p className="text-white/50 text-sm">{tier.tagline}</p>
          </div>
          
          <div className="text-center mb-6">
            <div className="text-4xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              {tier.price}
            </div>
            <p className="text-white/40 text-sm mt-1">{tier.priceNote}</p>
          </div>
          
          <ul className="space-y-3 flex-grow mb-6">
            {tier.features.map((feature, i) => (
              <li key={i} className="flex items-start gap-2 text-sm">
                <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                <span className="text-white/70">{feature}</span>
              </li>
            ))}
          </ul>
          
          <a
            href="mailto:guardian@dwsc.io?subject=Guardian%20Certification%20Inquiry"
            className={`w-full py-3 rounded-lg font-semibold text-center transition-all ${
              tier.highlight 
                ? "bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-400 hover:to-purple-400 text-white"
                : "bg-white/10 hover:bg-white/20 text-white border border-white/10"
            }`}
            data-testid={`link-tier-${tier.name.toLowerCase().replace(/\s+/g, '-')}`}
          >
            Get Started
          </a>
        </div>
      </div>
    </motion.div>
  );
}

export default function GuardianCertificationPage() {
  usePageAnalytics();

  return (
    <div className="min-h-screen bg-slate-950 text-white overflow-hidden">
      <HeaderTools />
      
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
        <div className="absolute top-1/2 right-1/3 w-64 h-64 bg-pink-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "2s" }} />
      </div>
      
      <main className="pt-20 relative">
        <section className="py-20 px-4">
          <div className="container mx-auto max-w-6xl">
            <Link href="/security" className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 mb-12 transition-colors" data-testid="link-back-security">
              <ArrowLeft className="w-4 h-4" />
              Back to Security
            </Link>

            <div className="text-center mb-16">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8 }}
                className="mb-8"
              >
                <GuardianBadge tier="Guardian" size="lg" />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-500/10 via-purple-500/10 to-pink-500/10 border border-cyan-500/30 rounded-full mb-6">
                  <Sparkles className="w-4 h-4 text-cyan-400" />
                  <span className="text-cyan-400 text-sm font-medium">Blockchain Security, Redefined</span>
                </div>
                <h1 className="text-4xl md:text-6xl font-bold mb-6">
                  <span className="text-white">DWSC</span>{" "}
                  <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                    Guardian Certification
                  </span>
                </h1>
                <p className="text-xl text-white/60 max-w-3xl mx-auto leading-relaxed">
                  Enterprise-grade security audits at 70% less than traditional firms. 
                  Built by blockchain engineers who understand the unique challenges of decentralized systems.
                </p>
              </motion.div>
            </div>

            <div className="grid md:grid-cols-4 gap-4 mb-20">
              {WHY_GUARDIAN.map((item, index) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                >
                  <GlassCard className="p-6 text-center h-full hover:scale-105 transition-transform" data-testid={`card-benefit-${index}`}>
                    <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-gradient-to-br from-cyan-500/20 to-purple-500/20 flex items-center justify-center">
                      <item.icon className="w-6 h-6 text-cyan-400" />
                    </div>
                    <h3 className="text-white font-semibold mb-2" data-testid={`text-benefit-title-${index}`}>{item.title}</h3>
                    <p className="text-white/50 text-sm">{item.description}</p>
                  </GlassCard>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 px-4 bg-gradient-to-b from-transparent via-slate-900/50 to-transparent">
          <div className="container mx-auto max-w-6xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                  Certification Tiers
                </span>
              </h2>
              <p className="text-white/60 max-w-2xl mx-auto">
                Choose the level of assurance that fits your project's needs and budget.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8">
              {CERTIFICATION_TIERS.map((tier, index) => (
                <TierCard key={tier.name} tier={tier} index={index} />
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 px-4">
          <div className="container mx-auto max-w-6xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Our Methodology
                </span>
              </h2>
              <p className="text-white/60 max-w-2xl mx-auto">
                A rigorous, transparent framework built on industry best practices and blockchain-specific expertise.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
              {METHODOLOGY_PILLARS.map((pillar, index) => (
                <motion.div
                  key={pillar.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <GlassCard className="p-6 h-full hover:scale-105 transition-transform">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center flex-shrink-0">
                        <pillar.icon className="w-6 h-6 text-purple-400" />
                      </div>
                      <div>
                        <h3 className="text-white font-semibold mb-2">{pillar.title}</h3>
                        <p className="text-white/50 text-sm">{pillar.description}</p>
                      </div>
                    </div>
                  </GlassCard>
                </motion.div>
              ))}
            </div>

            <GlassCard className="p-8">
              <h3 className="text-xl font-bold text-white mb-8 text-center">Certification Process</h3>
              <div className="grid md:grid-cols-6 gap-4">
                {PROCESS_STEPS.map((step, index) => (
                  <motion.div
                    key={step.step}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="text-center relative"
                  >
                    {index < PROCESS_STEPS.length - 1 && (
                      <div className="hidden md:block absolute top-6 left-1/2 w-full h-0.5 bg-gradient-to-r from-cyan-500/50 to-purple-500/50" />
                    )}
                    <div className="relative w-12 h-12 mx-auto mb-3 rounded-full bg-gradient-to-br from-cyan-500 to-purple-500 flex items-center justify-center text-white font-bold">
                      {step.step}
                    </div>
                    <h4 className="text-white font-medium text-sm mb-1">{step.title}</h4>
                    <p className="text-white/40 text-xs">{step.description}</p>
                  </motion.div>
                ))}
              </div>
            </GlassCard>
          </div>
        </section>

        <section className="py-20 px-4 bg-gradient-to-b from-transparent via-cyan-950/20 to-transparent">
          <div className="container mx-auto max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                  Guardian Registry
                </span>
              </h2>
              <p className="text-white/60">
                Projects that have achieved Guardian Certification
              </p>
            </motion.div>

            <div className="space-y-4">
              {CERTIFIED_PROJECTS.map((project, index) => (
                <motion.div
                  key={project.name}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <GlassCard className="p-6" data-testid={`card-registry-${project.name.toLowerCase().replace(/\s+/g, '-')}`}>
                    <div className="flex items-center justify-between flex-wrap gap-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500/20 to-purple-500/20 flex items-center justify-center">
                          {project.status === "Certified" ? (
                            <BadgeCheck className="w-6 h-6 text-green-400" />
                          ) : project.status === "In Progress" ? (
                            <Activity className="w-6 h-6 text-amber-400" />
                          ) : (
                            <Clock className="w-6 h-6 text-white/40" />
                          )}
                        </div>
                        <div>
                          <h3 className="text-white font-semibold" data-testid={`text-project-name-${index}`}>{project.name}</h3>
                          <p className="text-white/40 text-sm" data-testid={`text-project-date-${index}`}>{project.date}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        {project.score && (
                          <div className="text-right">
                            <div className="text-2xl font-bold text-cyan-400" data-testid={`text-project-score-${index}`}>{project.score}/100</div>
                            <div className="text-white/40 text-xs">Security Score</div>
                          </div>
                        )}
                        <span 
                          className={`px-4 py-2 rounded-full text-sm font-medium ${
                            project.status === "Certified" 
                              ? "bg-green-500/20 text-green-400 border border-green-500/30"
                              : project.status === "In Progress"
                              ? "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                              : "bg-white/10 text-white/50 border border-white/10"
                          }`}
                          data-testid={`status-project-${index}`}
                        >
                          {project.status}
                        </span>
                      </div>
                    </div>
                  </GlassCard>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 px-4">
          <div className="container mx-auto max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <GlassCard className="p-8 md:p-12 text-center bg-gradient-to-r from-cyan-950/30 via-purple-950/30 to-pink-950/30 relative overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-32 bg-gradient-to-b from-purple-500/20 to-transparent blur-2xl" />
                <div className="relative">
                  <ShieldCheck className="w-16 h-16 text-cyan-400 mx-auto mb-6" />
                  <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                    Ready to Get Certified?
                  </h2>
                  <p className="text-white/60 mb-8 max-w-xl mx-auto">
                    Join the growing list of projects that trust Guardian Certification 
                    to validate their security posture.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <a
                      href="mailto:guardian@dwsc.io?subject=Guardian%20Certification%20Inquiry"
                      className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-cyan-600 via-purple-600 to-pink-600 hover:from-cyan-500 hover:via-purple-500 hover:to-pink-500 rounded-xl text-white font-semibold text-lg transition-all hover:scale-105 shadow-lg shadow-purple-500/25"
                      data-testid="link-contact-guardian"
                    >
                      <Award className="w-6 h-6" />
                      Request Certification
                    </a>
                    <Link
                      href="/security"
                      className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-white font-semibold transition-all"
                      data-testid="link-view-security"
                    >
                      <FileText className="w-5 h-5" />
                      View Our Security
                    </Link>
                  </div>
                  <p className="text-white/30 text-sm mt-6">
                    guardian@dwsc.io
                  </p>
                </div>
              </GlassCard>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
