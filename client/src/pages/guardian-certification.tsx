import { motion } from "framer-motion";
import { Link } from "wouter";
import { useState, useEffect, type FormEvent } from "react";
import { 
  Shield, ShieldCheck, Award, CheckCircle, Star, Zap, FileText,
  ArrowLeft, ExternalLink, Clock, Users, Target, Lock, Eye,
  Sparkles, TrendingUp, Building, Code, Server, Database,
  BadgeCheck, Layers, Activity, FileCheck, AlertTriangle,
  Download, Calendar, Rocket, UserCheck, Mail, Send, ChevronRight,
  Trophy, Gift, Percent, FileSearch, Globe, Bug, Handshake
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
  { name: "ChronoChat Platform", status: "In Progress", score: null, date: "Q1 2026" },
  { name: "DarkWave Chronicles", status: "Scheduled", score: null, date: "Q2 2026" }
];

const TRUST_CENTER_DOCS = [
  {
    icon: FileText,
    title: "Methodology Framework",
    description: "Complete 6-pillar security assessment methodology documentation",
    type: "PDF",
    size: "2.4 MB",
    available: true,
    email: "guardian@dwsc.io?subject=Request%20Methodology%20Framework%20Document"
  },
  {
    icon: FileSearch,
    title: "Sample Findings Report",
    description: "Redacted findings from a Guardian Premier audit (anonymized)",
    type: "PDF",
    size: "1.8 MB",
    available: false,
    email: "guardian@dwsc.io?subject=Request%20Sample%20Findings%20Report"
  },
  {
    icon: Shield,
    title: "DWSC Self-Audit Report",
    description: "Full transparency report for DarkWave Smart Chain (78/100)",
    type: "PDF",
    size: "3.2 MB",
    available: true,
    email: "guardian@dwsc.io?subject=Request%20DWSC%20Self-Audit%20Report"
  },
  {
    icon: CheckCircle,
    title: "Compliance Checklist",
    description: "Industry-standard security controls mapped to Guardian pillars",
    type: "PDF",
    size: "892 KB",
    available: true,
    email: "guardian@dwsc.io?subject=Request%20Compliance%20Checklist"
  }
];

const ROADMAP_MILESTONES = [
  {
    phase: "Phase 0",
    title: "Internal Readiness",
    date: "Jan - Feb 2026",
    status: "completed",
    items: ["DWSC self-audit complete", "Stripe pricing configured", "Trust Center launched", "Intake workflow ready"]
  },
  {
    phase: "Phase 1", 
    title: "Credibility Foundation",
    date: "Feb - Apr 2026",
    status: "in_progress",
    items: ["Advisory board formation", "Verifiable badge metadata", "Sample reports published", "Community outreach"]
  },
  {
    phase: "Phase 2",
    title: "External Validation",
    date: "May - Aug 2026",
    status: "upcoming",
    items: ["Third-party review", "Bug bounty program", "Security consortium listing", "Partner webinars"]
  },
  {
    phase: "Phase 3",
    title: "Customer Acquisition",
    date: "Sep - Dec 2026",
    status: "upcoming",
    items: ["Pioneer cohort (5 audits)", "Case study publications", "Guardian Clinics launch", "Referral program"]
  },
  {
    phase: "Phase 4",
    title: "Launch Amplification",
    date: "Jan - Feb 2026",
    status: "upcoming",
    items: ["Token launch integration", "Benchmark report release", "Launchpad bundling", "Full certification registry"]
  }
];

const ADVISORY_BOARD = [
  {
    name: "Position Available",
    role: "Chief Security Advisor",
    bio: "Seeking experienced CISO or security lead from major blockchain project",
    placeholder: true
  },
  {
    name: "Position Available",
    role: "Smart Contract Expert",
    bio: "Seeking auditor with 5+ years experience in DeFi protocol security",
    placeholder: true
  },
  {
    name: "Position Available",
    role: "Infrastructure Specialist",
    bio: "Seeking cloud security expert with blockchain node operation experience",
    placeholder: true
  }
];

const PIONEER_BENEFITS = [
  { icon: Percent, title: "50% Deposit Only", description: "Pay just half upfront, remainder upon certification" },
  { icon: Trophy, title: "Featured Case Study", description: "Your project showcased in our marketing materials" },
  { icon: Gift, title: "Extended Support", description: "120 days of priority support vs standard 90 days" },
  { icon: Star, title: "Founding Client Badge", description: "Exclusive 'Pioneer' designation in Guardian Registry" }
];

const SHIELD_TIERS = [
  {
    name: "Guardian Watch",
    tagline: "Automated Security Monitoring",
    price: "$299",
    priceNote: "per month",
    features: [
      "24/7 automated smart contract monitoring",
      "Unusual transaction pattern alerts",
      "Weekly security reports",
      "Email & Discord notifications",
      "Up to 5 contracts monitored",
      "Basic threat intelligence feed"
    ],
    icon: Eye,
    color: "cyan",
    comingSoon: true
  },
  {
    name: "Guardian Shield",
    tagline: "Real-Time Protection Suite",
    price: "$999",
    priceNote: "per month",
    features: [
      "Everything in Guardian Watch",
      "Real-time incident alerts (< 1 min)",
      "Governance attack detection",
      "Bridge & liquidity pool monitoring",
      "Whale movement tracking",
      "Up to 25 contracts monitored",
      "Dedicated Slack channel",
      "Monthly security review calls"
    ],
    highlight: true,
    icon: Shield,
    color: "purple",
    comingSoon: true
  },
  {
    name: "Guardian Command",
    tagline: "Enterprise Security Operations",
    price: "$2,999",
    priceNote: "per month",
    features: [
      "Everything in Guardian Shield",
      "24/7 Security Operations Center",
      "Active threat mitigation",
      "Rug pull early warning system",
      "Unlimited contract monitoring",
      "Custom detection rules",
      "Incident response team",
      "Quarterly penetration testing",
      "Executive security briefings"
    ],
    icon: Building,
    color: "pink",
    comingSoon: true
  }
];

const SHIELD_FEATURES = [
  {
    icon: Activity,
    title: "Real-Time Monitoring",
    description: "24/7 surveillance of your smart contracts and on-chain activity"
  },
  {
    icon: AlertTriangle,
    title: "Threat Detection",
    description: "AI-powered anomaly detection for unusual patterns and attacks"
  },
  {
    icon: Globe,
    title: "Multi-Chain Coverage",
    description: "Monitor assets across Ethereum, BSC, Polygon, and 20+ chains"
  },
  {
    icon: Zap,
    title: "Instant Alerts",
    description: "Sub-minute notifications via email, Slack, Discord, and SMS"
  }
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

function IntakeWizard() {
  const [formData, setFormData] = useState({
    projectName: "",
    website: "",
    email: "",
    projectType: "",
    tier: "",
    description: ""
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const mailtoLink = `mailto:guardian@dwsc.io?subject=Guardian%20Certification%20Inquiry%20-%20${encodeURIComponent(formData.projectName)}&body=${encodeURIComponent(
      `Project Name: ${formData.projectName}\nWebsite: ${formData.website}\nEmail: ${formData.email}\nProject Type: ${formData.projectType}\nInterested Tier: ${formData.tier}\n\nDescription:\n${formData.description}`
    )}`;
    window.location.href = mailtoLink;
    setSubmitted(true);
  };

  return (
    <section className="py-20 px-4 bg-gradient-to-b from-transparent via-pink-950/10 to-transparent">
      <div className="container mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-pink-500/10 border border-pink-500/30 rounded-full mb-6">
            <Mail className="w-4 h-4 text-pink-400" />
            <span className="text-pink-400 text-sm font-medium">Get Started</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            <span className="bg-gradient-to-r from-pink-400 to-cyan-400 bg-clip-text text-transparent">
              Request a Consultation
            </span>
          </h2>
          <p className="text-white/60 max-w-2xl mx-auto">
            Tell us about your project and we'll help you choose the right certification path. No commitment required.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <GlassCard className="p-8">
            {submitted ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-500/20 flex items-center justify-center">
                  <CheckCircle className="w-8 h-8 text-green-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Your email client should open</h3>
                <p className="text-white/60">If it didn't open, please email us directly at guardian@dwsc.io</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-white/70 mb-2">Project Name *</label>
                    <input
                      type="text"
                      required
                      value={formData.projectName}
                      onChange={(e) => setFormData({ ...formData, projectName: e.target.value })}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all"
                      placeholder="Your project name"
                      data-testid="input-project-name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white/70 mb-2">Website</label>
                    <input
                      type="url"
                      value={formData.website}
                      onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all"
                      placeholder="https://yourproject.io"
                      data-testid="input-website"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-white/70 mb-2">Contact Email *</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all"
                      placeholder="your@email.com"
                      data-testid="input-email"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white/70 mb-2">Project Type</label>
                    <select
                      value={formData.projectType}
                      onChange={(e) => setFormData({ ...formData, projectType: e.target.value })}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all"
                      data-testid="select-project-type"
                    >
                      <option value="" className="bg-slate-900">Select type...</option>
                      <option value="defi" className="bg-slate-900">DeFi Protocol</option>
                      <option value="nft" className="bg-slate-900">NFT / Marketplace</option>
                      <option value="l1" className="bg-slate-900">Layer 1 / Layer 2</option>
                      <option value="bridge" className="bg-slate-900">Bridge / Cross-chain</option>
                      <option value="dao" className="bg-slate-900">DAO / Governance</option>
                      <option value="infrastructure" className="bg-slate-900">Infrastructure</option>
                      <option value="other" className="bg-slate-900">Other</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/70 mb-2">Interested Tier</label>
                  <div className="grid grid-cols-3 gap-3">
                    {["Self-Cert", "Assurance Lite", "Guardian Premier"].map((tier) => (
                      <button
                        key={tier}
                        type="button"
                        onClick={() => setFormData({ ...formData, tier })}
                        className={`p-3 rounded-xl border text-sm font-medium transition-all ${
                          formData.tier === tier
                            ? "bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border-cyan-500/50 text-cyan-400"
                            : "bg-white/5 border-white/10 text-white/60 hover:border-white/20"
                        }`}
                        data-testid={`button-tier-${tier.toLowerCase().replace(/\s+/g, '-')}`}
                      >
                        {tier}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/70 mb-2">Tell us about your project</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={4}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all resize-none"
                    placeholder="Brief description of your project, tech stack, and any specific security concerns..."
                    data-testid="textarea-description"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-4 bg-gradient-to-r from-pink-600 via-purple-600 to-cyan-600 hover:from-pink-500 hover:via-purple-500 hover:to-cyan-500 rounded-xl text-white font-semibold text-lg transition-all hover:scale-[1.02] shadow-lg shadow-purple-500/25 flex items-center justify-center gap-2"
                  data-testid="button-submit-consultation"
                >
                  <Send className="w-5 h-5" />
                  Request Consultation
                </button>

                <p className="text-center text-white/40 text-sm">
                  We typically respond within 1-2 business days
                </p>
              </form>
            )}
          </GlassCard>
        </motion.div>
      </div>
    </section>
  );
}

function CheckoutModal({ tier, isOpen, onClose }: { tier: typeof CERTIFICATION_TIERS[0]; isOpen: boolean; onClose: () => void }) {
  const [formData, setFormData] = useState({
    projectName: "",
    projectUrl: "",
    contactEmail: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const tierId = tier.name === "Assurance Lite" ? "assurance_lite" : "guardian_premier";

    try {
      const response = await fetch("/api/guardian/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tier: tierId,
          projectName: formData.projectName,
          projectUrl: formData.projectUrl || undefined,
          contactEmail: formData.contactEmail,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create checkout");
      }

      if (data.url) {
        window.location.href = data.url;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative w-full max-w-md bg-slate-900 border border-white/10 rounded-2xl p-6 shadow-2xl"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white/50 hover:text-white transition-colors"
          data-testid="button-close-checkout"
        >
          <span className="sr-only">Close</span>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="text-center mb-6">
          <div className="w-16 h-16 mx-auto mb-4 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center">
            <tier.icon className="w-8 h-8 text-purple-400" />
          </div>
          <h3 className="text-xl font-bold text-white">{tier.name}</h3>
          <p className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent mt-2">
            {tier.price}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-white/60 text-sm mb-1">Project Name *</label>
            <input
              type="text"
              required
              value={formData.projectName}
              onChange={(e) => setFormData({ ...formData, projectName: e.target.value })}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-purple-500/50"
              placeholder="Your project name"
              data-testid="input-checkout-project-name"
            />
          </div>

          <div>
            <label className="block text-white/60 text-sm mb-1">Project URL (optional)</label>
            <input
              type="url"
              value={formData.projectUrl}
              onChange={(e) => setFormData({ ...formData, projectUrl: e.target.value })}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-purple-500/50"
              placeholder="https://yourproject.com"
              data-testid="input-checkout-project-url"
            />
          </div>

          <div>
            <label className="block text-white/60 text-sm mb-1">Contact Email *</label>
            <input
              type="email"
              required
              value={formData.contactEmail}
              onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-purple-500/50"
              placeholder="you@example.com"
              data-testid="input-checkout-email"
            />
          </div>

          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 disabled:opacity-50 rounded-xl text-white font-semibold transition-all flex items-center justify-center gap-2"
            data-testid="button-proceed-checkout"
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Lock className="w-4 h-4" />
                Proceed to Payment
              </>
            )}
          </button>

          <p className="text-center text-white/40 text-xs">
            Secure payment powered by Stripe
          </p>
        </form>
      </motion.div>
    </div>
  );
}

function TierCard({ tier, index }: { tier: typeof CERTIFICATION_TIERS[0]; index: number }) {
  const [showCheckout, setShowCheckout] = useState(false);
  const isPaid = tier.name === "Assurance Lite" || tier.name === "Guardian Premier";
  
  const colorMap: Record<string, string> = {
    cyan: "from-cyan-500/20 to-cyan-600/20 border-cyan-500/30 hover:border-cyan-400/50",
    purple: "from-purple-500/20 to-purple-600/20 border-purple-500/30 hover:border-purple-400/50",
    pink: "from-pink-500/20 to-pink-600/20 border-pink-500/30 hover:border-pink-400/50"
  };
  
  return (
    <>
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
            
            {isPaid ? (
              <button
                onClick={() => setShowCheckout(true)}
                className={`w-full py-3 rounded-lg font-semibold text-center transition-all ${
                  tier.highlight 
                    ? "bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-400 hover:to-purple-400 text-white"
                    : "bg-white/10 hover:bg-white/20 text-white border border-white/10"
                }`}
                data-testid={`button-tier-${tier.name.toLowerCase().replace(/\s+/g, '-')}`}
              >
                Get Started
              </button>
            ) : (
              <a
                href="mailto:guardian@dwsc.io?subject=Guardian%20Self-Cert%20Inquiry"
                className="w-full py-3 rounded-lg font-semibold text-center transition-all bg-white/10 hover:bg-white/20 text-white border border-white/10 block"
                data-testid={`link-tier-${tier.name.toLowerCase().replace(/\s+/g, '-')}`}
              >
                Contact Us
              </a>
            )}
          </div>
        </div>
      </motion.div>
      
      {isPaid && <CheckoutModal tier={tier} isOpen={showCheckout} onClose={() => setShowCheckout(false)} />}
    </>
  );
}

function PaymentSuccessBanner() {
  const [show, setShow] = useState(false);
  const [tier, setTier] = useState("");
  
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("success") === "true") {
      setShow(true);
      setTier(params.get("tier") || "");
      window.history.replaceState({}, "", window.location.pathname);
    }
  }, []);

  if (!show) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed top-20 left-1/2 -translate-x-1/2 z-50 max-w-lg w-full px-4"
    >
      <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/40 rounded-2xl p-6 backdrop-blur-sm">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0">
            <CheckCircle className="w-6 h-6 text-green-400" />
          </div>
          <div className="flex-grow">
            <h3 className="text-xl font-bold text-white mb-1">Payment Successful!</h3>
            <p className="text-white/60 text-sm">
              Thank you for purchasing {tier === "assurance_lite" ? "Assurance Lite" : "Guardian Premier"}. 
              Our security team will contact you within 1-2 business days to begin your audit.
            </p>
          </div>
          <button 
            onClick={() => setShow(false)}
            className="text-white/50 hover:text-white"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
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
      <PaymentSuccessBanner />
      
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

        {/* Trust Center Section */}
        <section className="py-20 px-4 bg-gradient-to-b from-transparent via-emerald-950/10 to-transparent">
          <div className="container mx-auto max-w-6xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/30 rounded-full mb-6">
                <Lock className="w-4 h-4 text-emerald-400" />
                <span className="text-emerald-400 text-sm font-medium">Full Transparency</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                  Guardian Trust Center
                </span>
              </h2>
              <p className="text-white/60 max-w-2xl mx-auto">
                Complete transparency into our methodology, findings, and processes. Download our documentation to understand exactly how Guardian audits work.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-6 mb-12">
              {TRUST_CENTER_DOCS.map((doc, index) => (
                <motion.div
                  key={doc.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <a 
                    href={`mailto:${doc.email}`}
                    className="block"
                    data-testid={`link-doc-${index}`}
                  >
                    <GlassCard className="p-6 hover:scale-[1.02] transition-transform cursor-pointer group" data-testid={`card-doc-${index}`}>
                      <div className="flex items-start gap-4">
                        <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                          <doc.icon className="w-7 h-7 text-emerald-400" />
                        </div>
                        <div className="flex-grow">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-white font-semibold" data-testid={`text-doc-title-${index}`}>{doc.title}</h3>
                            {!doc.available && (
                              <span className="px-2 py-0.5 bg-amber-500/20 text-amber-400 rounded text-xs">Coming Soon</span>
                            )}
                          </div>
                          <p className="text-white/50 text-sm mb-3">{doc.description}</p>
                          <div className="flex items-center gap-3">
                            <span className="px-2 py-1 bg-white/5 rounded text-xs text-white/40">{doc.type}</span>
                            <span className="text-xs text-white/30">{doc.size}</span>
                            <span className="ml-auto inline-flex items-center gap-1 text-emerald-400 text-sm font-medium group-hover:gap-2 transition-all">
                              <Mail className="w-4 h-4" />
                              Request Document
                            </span>
                          </div>
                        </div>
                      </div>
                    </GlassCard>
                  </a>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <GlassCard className="p-8 bg-gradient-to-r from-emerald-950/20 to-cyan-950/20">
                <div className="flex flex-col md:flex-row items-center gap-6">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 flex items-center justify-center flex-shrink-0">
                    <Bug className="w-10 h-10 text-emerald-400" />
                  </div>
                  <div className="flex-grow text-center md:text-left">
                    <h3 className="text-xl font-bold text-white mb-2">Bug Bounty Program</h3>
                    <p className="text-white/60 mb-4">Coming Q2 2026 - We're launching a public bug bounty through Immunefi to strengthen our security posture and demonstrate commitment to transparency.</p>
                    <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                      <span className="px-3 py-1 bg-amber-500/20 text-amber-400 rounded-full text-sm border border-amber-500/30">Coming Soon</span>
                      <span className="px-3 py-1 bg-white/5 text-white/50 rounded-full text-sm">Up to $50,000 rewards</span>
                    </div>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          </div>
        </section>

        {/* Guardian Shield - Continuous Monitoring Section */}
        <section className="py-20 px-4 bg-gradient-to-b from-transparent via-violet-950/20 to-transparent relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-1/3 left-1/4 w-72 h-72 bg-violet-500/10 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-1/3 right-1/4 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1.5s" }} />
          </div>
          
          <div className="container mx-auto max-w-6xl relative">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-violet-500/10 border border-violet-500/30 rounded-full mb-6">
                <Shield className="w-4 h-4 text-violet-400" />
                <span className="text-violet-400 text-sm font-medium">Coming Q3 2026</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                <span className="bg-gradient-to-r from-violet-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent">
                  Guardian Shield
                </span>
              </h2>
              <p className="text-xl text-white/60 max-w-3xl mx-auto mb-4">
                Continuous Blockchain Security Monitoring
              </p>
              <p className="text-white/50 max-w-2xl mx-auto">
                Think Norton for blockchain. 24/7 protection for your smart contracts, tokens, and on-chain assets. 
                Detect threats before they become exploits.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-4 gap-4 mb-16">
              {SHIELD_FEATURES.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <GlassCard className="p-5 text-center h-full" data-testid={`card-shield-feature-${index}`}>
                    <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-gradient-to-br from-violet-500/20 to-indigo-500/20 flex items-center justify-center">
                      <feature.icon className="w-6 h-6 text-violet-400" />
                    </div>
                    <h4 className="text-white font-semibold mb-1 text-sm">{feature.title}</h4>
                    <p className="text-white/50 text-xs">{feature.description}</p>
                  </GlassCard>
                </motion.div>
              ))}
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {SHIELD_TIERS.map((tier, index) => {
                const colorMap: Record<string, string> = {
                  cyan: "from-cyan-500/20 to-cyan-600/20 border-cyan-500/30",
                  purple: "from-violet-500/20 to-purple-600/20 border-violet-500/30",
                  pink: "from-pink-500/20 to-rose-600/20 border-pink-500/30"
                };
                
                return (
                  <motion.div
                    key={tier.name}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.15 }}
                    className="h-full"
                  >
                    <div className={`relative h-full rounded-2xl bg-gradient-to-b ${colorMap[tier.color]} border ${tier.highlight ? "border-2 border-violet-500/50" : ""} p-1`}>
                      {tier.highlight && (
                        <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-violet-500 to-purple-500 rounded-full">
                          <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1">
                            <Star className="w-3 h-3" /> Most Popular
                          </span>
                        </div>
                      )}
                      <div className="absolute -top-1 -right-1">
                        <span className="px-3 py-1 bg-amber-500/90 text-amber-950 rounded-full text-xs font-bold uppercase">
                          Coming Soon
                        </span>
                      </div>
                      <div className="h-full rounded-xl bg-slate-900/90 p-6 flex flex-col">
                        <div className="text-center mb-6">
                          <div className={`w-16 h-16 mx-auto mb-4 rounded-xl bg-gradient-to-br ${colorMap[tier.color].split(" ")[0]} ${colorMap[tier.color].split(" ")[1]} flex items-center justify-center`}>
                            <tier.icon className="w-8 h-8" style={{ color: tier.color === "cyan" ? "#06b6d4" : tier.color === "purple" ? "#8b5cf6" : "#ec4899" }} />
                          </div>
                          <h3 className="text-2xl font-bold text-white mb-1" data-testid={`text-shield-tier-${index}`}>{tier.name}</h3>
                          <p className="text-white/50 text-sm">{tier.tagline}</p>
                        </div>
                        
                        <div className="text-center mb-6">
                          <div className="text-4xl font-bold bg-gradient-to-r from-violet-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent">
                            {tier.price}
                          </div>
                          <p className="text-white/40 text-sm mt-1">{tier.priceNote}</p>
                        </div>
                        
                        <ul className="space-y-3 flex-grow mb-6">
                          {tier.features.map((feature, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm">
                              <CheckCircle className="w-4 h-4 text-violet-400 mt-0.5 flex-shrink-0" />
                              <span className="text-white/70">{feature}</span>
                            </li>
                          ))}
                        </ul>
                        
                        <a
                          href="mailto:guardian@dwsc.io?subject=Guardian%20Shield%20Waitlist%20-%20Interest"
                          className="w-full py-3 rounded-lg font-semibold text-center transition-all bg-white/10 hover:bg-white/20 text-white/70 border border-white/10 flex items-center justify-center gap-2"
                          data-testid={`link-shield-waitlist-${index}`}
                        >
                          <Mail className="w-4 h-4" />
                          Join Waitlist
                        </a>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mt-12 text-center"
            >
              <GlassCard className="p-6 inline-block bg-gradient-to-r from-violet-950/30 to-indigo-950/30">
                <p className="text-white/60 text-sm">
                  <span className="text-violet-400 font-semibold">Early Access:</span> Get 20% off your first year when you join the waitlist before launch.
                </p>
              </GlassCard>
            </motion.div>
          </div>
        </section>

        {/* Roadmap Timeline Section */}
        <section className="py-20 px-4">
          <div className="container mx-auto max-w-6xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 border border-blue-500/30 rounded-full mb-6">
                <Calendar className="w-4 h-4 text-blue-400" />
                <span className="text-blue-400 text-sm font-medium">Our Journey</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Validation Roadmap
                </span>
              </h2>
              <p className="text-white/60 max-w-2xl mx-auto">
                Our transparent path to becoming a trusted security certification authority, aligned with the DWC token launch in February 2026.
              </p>
            </motion.div>

            <div className="relative">
              <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-cyan-500/50 via-purple-500/50 to-pink-500/50" />
              
              <div className="space-y-8">
                {ROADMAP_MILESTONES.map((milestone, index) => (
                  <motion.div
                    key={milestone.phase}
                    initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className={`relative flex flex-col ${index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"} items-center gap-8`}
                  >
                    <div className="hidden md:block absolute left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-gradient-to-br from-cyan-500 to-purple-500 z-10" />
                    
                    <div className={`flex-1 ${index % 2 === 0 ? "md:text-right md:pr-12" : "md:text-left md:pl-12"}`}>
                      <GlassCard 
                        className={`p-6 ${
                          milestone.status === "completed" 
                            ? "border-green-500/30 bg-green-950/10" 
                            : milestone.status === "in_progress"
                            ? "border-amber-500/30 bg-amber-950/10"
                            : ""
                        }`}
                        data-testid={`card-milestone-${index}`}
                      >
                        <div className="flex items-center gap-3 mb-3 flex-wrap">
                          <span className="px-3 py-1 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-full text-sm font-semibold text-cyan-400">
                            {milestone.phase}
                          </span>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            milestone.status === "completed" 
                              ? "bg-green-500/20 text-green-400"
                              : milestone.status === "in_progress"
                              ? "bg-amber-500/20 text-amber-400"
                              : "bg-white/10 text-white/50"
                          }`}>
                            {milestone.status === "completed" ? "Completed" : milestone.status === "in_progress" ? "In Progress" : "Upcoming"}
                          </span>
                        </div>
                        <h3 className="text-xl font-bold text-white mb-1" data-testid={`text-milestone-title-${index}`}>{milestone.title}</h3>
                        <p className="text-white/40 text-sm mb-4">{milestone.date}</p>
                        <ul className="space-y-2">
                          {milestone.items.map((item, i) => (
                            <li key={i} className="flex items-center gap-2 text-sm text-white/60">
                              <CheckCircle className={`w-4 h-4 flex-shrink-0 ${milestone.status === "completed" ? "text-green-400" : "text-white/30"}`} />
                              {item}
                            </li>
                          ))}
                        </ul>
                      </GlassCard>
                    </div>
                    
                    <div className="flex-1 hidden md:block" />
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Pioneer Program Section */}
        <section className="py-20 px-4 bg-gradient-to-b from-transparent via-amber-950/10 to-transparent">
          <div className="container mx-auto max-w-5xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <GlassCard className="p-8 md:p-12 bg-gradient-to-r from-amber-950/20 via-orange-950/20 to-red-950/20 border-amber-500/30 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-amber-500/10 to-transparent rounded-full blur-3xl" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-orange-500/10 to-transparent rounded-full blur-3xl" />
                
                <div className="relative">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-amber-500/30 to-orange-500/30 flex items-center justify-center">
                      <Rocket className="w-7 h-7 text-amber-400" />
                    </div>
                    <div>
                      <span className="px-3 py-1 bg-amber-500/20 text-amber-400 rounded-full text-xs font-bold uppercase tracking-wider">Limited Offer</span>
                    </div>
                  </div>
                  
                  <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                    Guardian Pioneer Program
                  </h2>
                  <p className="text-white/60 text-lg mb-8 max-w-2xl">
                    Be among the first 5 projects to receive a Guardian Premier audit. Get exclusive benefits while helping us build our track record.
                  </p>
                  
                  <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    {PIONEER_BENEFITS.map((benefit, index) => (
                      <div key={benefit.title} className="p-4 bg-white/5 rounded-xl border border-white/10" data-testid={`card-pioneer-benefit-${index}`}>
                        <benefit.icon className="w-8 h-8 text-amber-400 mb-3" />
                        <h4 className="text-white font-semibold mb-1">{benefit.title}</h4>
                        <p className="text-white/50 text-sm">{benefit.description}</p>
                      </div>
                    ))}
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-4 items-center">
                    <a
                      href="mailto:guardian@dwsc.io?subject=Pioneer%20Program%20Application"
                      className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 rounded-xl text-white font-semibold text-lg transition-all hover:scale-105 shadow-lg shadow-amber-500/25"
                      data-testid="link-apply-pioneer"
                    >
                      <Rocket className="w-5 h-5" />
                      Apply for Pioneer Program
                    </a>
                    <span className="text-white/40 text-sm">
                      <span className="text-amber-400 font-bold">3 of 5</span> spots remaining
                    </span>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          </div>
        </section>

        {/* Advisory Board Section */}
        <section className="py-20 px-4">
          <div className="container mx-auto max-w-5xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/10 border border-purple-500/30 rounded-full mb-6">
                <Users className="w-4 h-4 text-purple-400" />
                <span className="text-purple-400 text-sm font-medium">Expert Guidance</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Advisory Board
                </span>
              </h2>
              <p className="text-white/60 max-w-2xl mx-auto">
                We're building a panel of industry experts to guide Guardian's evolution. Interested in joining? Reach out.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-6 mb-8">
              {ADVISORY_BOARD.map((advisor, index) => (
                <motion.div
                  key={advisor.role}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <GlassCard className="p-6 text-center h-full border-dashed" data-testid={`card-advisor-${index}`}>
                    <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center border-2 border-dashed border-white/20">
                      <UserCheck className="w-8 h-8 text-white/30" />
                    </div>
                    <h3 className="text-white/50 font-semibold mb-1">{advisor.name}</h3>
                    <p className="text-purple-400 text-sm font-medium mb-3">{advisor.role}</p>
                    <p className="text-white/40 text-sm">{advisor.bio}</p>
                  </GlassCard>
                </motion.div>
              ))}
            </div>

            <div className="text-center">
              <a
                href="mailto:guardian@dwsc.io?subject=Advisory%20Board%20Interest"
                className="inline-flex items-center gap-2 text-purple-400 hover:text-purple-300 transition-colors"
                data-testid="link-join-advisory"
              >
                <Handshake className="w-5 h-5" />
                Interested in joining? Contact us
                <ChevronRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </section>

        {/* Intake Wizard Section */}
        <IntakeWizard />

        {/* Guardian Registry */}
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
