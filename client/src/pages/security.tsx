import { motion } from "framer-motion";
import { Link } from "wouter";
import { 
  Shield, Lock, Key, Server, Eye, CheckCircle, AlertTriangle,
  FileText, ExternalLink, Zap, Database, Globe, ArrowLeft
} from "lucide-react";
import { Footer } from "@/components/footer";
import { GlassCard } from "@/components/glass-card";
import { HeaderTools } from "@/components/header-tools";
import { usePageAnalytics } from "@/hooks/use-analytics";

const SECURITY_SCORE = 78;
const AUDIT_DATE = "December 28, 2024";
const AUDIT_VERSION = "1.1.0";

const SECURITY_FEATURES = [
  {
    icon: Lock,
    title: "AES-256-GCM Encryption",
    description: "Military-grade encryption for wallet seed phrases and sensitive data",
    status: "active"
  },
  {
    icon: Key,
    title: "HMAC-SHA256 Signatures",
    description: "All webhook payloads cryptographically signed and verified",
    status: "active"
  },
  {
    icon: Shield,
    title: "Helmet.js Security Headers",
    description: "Content Security Policy, X-Frame-Options, XSS protection enabled",
    status: "active"
  },
  {
    icon: Server,
    title: "Rate Limiting",
    description: "Per-route rate limiting to prevent abuse and DDoS attacks",
    status: "active"
  },
  {
    icon: Database,
    title: "Parameterized Queries",
    description: "SQL injection protection via Drizzle ORM with parameterized queries",
    status: "active"
  },
  {
    icon: Eye,
    title: "WebAuthn/Passkeys",
    description: "Passwordless authentication with hardware security keys",
    status: "active"
  }
];

const AUDIT_CATEGORIES = [
  { name: "Cryptography", score: 85, status: "strong" },
  { name: "Authentication", score: 80, status: "strong" },
  { name: "Input Validation", score: 75, status: "good" },
  { name: "Rate Limiting", score: 80, status: "strong" },
  { name: "Secret Management", score: 90, status: "excellent" },
  { name: "Security Headers", score: 90, status: "excellent" }
];

const TRANSPARENCY_NOTES = [
  {
    title: "Pre-Launch Status",
    description: "DWSC is currently in testnet phase. Mainnet launch scheduled for February 14, 2026."
  },
  {
    title: "Proof-of-Authority Consensus",
    description: "Currently operating with Founders Validator. Multi-validator network planned for mainnet."
  },
  {
    title: "Formal Audit Planned",
    description: "Third-party security audit scheduled before mainnet launch. This self-assessment provides transparency on current security posture."
  },
  {
    title: "Continuous Improvement",
    description: "Security is an ongoing process. We continuously monitor, test, and improve our systems."
  }
];

function ScoreBadge({ score }: { score: number }) {
  const getColor = () => {
    if (score >= 80) return "from-green-500 to-emerald-600";
    if (score >= 60) return "from-yellow-500 to-amber-600";
    return "from-red-500 to-rose-600";
  };

  const getLabel = () => {
    if (score >= 80) return "STRONG";
    if (score >= 60) return "GOOD";
    return "NEEDS WORK";
  };

  return (
    <div className="relative">
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", duration: 1 }}
        className="relative w-48 h-48 mx-auto"
      >
        <svg className="w-full h-full transform -rotate-90">
          <circle
            cx="96"
            cy="96"
            r="88"
            fill="none"
            stroke="rgba(255,255,255,0.1)"
            strokeWidth="12"
          />
          <motion.circle
            cx="96"
            cy="96"
            r="88"
            fill="none"
            stroke="url(#scoreGradient)"
            strokeWidth="12"
            strokeLinecap="round"
            initial={{ strokeDasharray: "0 553" }}
            animate={{ strokeDasharray: `${(score / 100) * 553} 553` }}
            transition={{ duration: 1.5, delay: 0.5 }}
          />
          <defs>
            <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#06b6d4" />
              <stop offset="100%" stopColor="#8b5cf6" />
            </linearGradient>
          </defs>
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="text-5xl font-bold text-white"
          >
            {score}
          </motion.span>
          <span className="text-white/60 text-sm">/100</span>
        </div>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2 }}
        className={`mt-4 inline-block px-4 py-2 rounded-full bg-gradient-to-r ${getColor()} text-white font-semibold text-sm`}
      >
        {getLabel()}
      </motion.div>
    </div>
  );
}

export default function SecurityPage() {
  usePageAnalytics();

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <HeaderTools />
      
      <main className="pt-20">
        <section className="py-16 px-4">
          <div className="container mx-auto max-w-6xl">
            <Link href="/" className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 mb-8 transition-colors">
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Link>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-12"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-500/10 border border-cyan-500/30 rounded-full mb-6">
                <Shield className="w-4 h-4 text-cyan-400" />
                <span className="text-cyan-400 text-sm font-medium">Security Transparency Report</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Security Assessment
                </span>
              </h1>
              <p className="text-white/60 max-w-2xl mx-auto">
                DarkWave Smart Chain is committed to security and transparency. This report details our current security posture and ongoing improvements.
              </p>
            </motion.div>

            <div className="grid lg:grid-cols-2 gap-8 mb-16">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <GlassCard className="p-8 h-full">
                  <div className="text-center">
                    <h2 className="text-xl font-semibold text-white mb-2">Internal Security Score</h2>
                    <p className="text-white/40 text-sm mb-6">Self-Assessment v{AUDIT_VERSION}</p>
                    <ScoreBadge score={SECURITY_SCORE} />
                    <p className="text-white/40 text-xs mt-6">
                      Assessed: {AUDIT_DATE}
                    </p>
                  </div>
                </GlassCard>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <GlassCard className="p-8 h-full">
                  <h2 className="text-xl font-semibold text-white mb-6">Category Breakdown</h2>
                  <div className="space-y-4">
                    {AUDIT_CATEGORIES.map((cat) => (
                      <div key={cat.name}>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-white/80 text-sm">{cat.name}</span>
                          <span className={`text-sm font-medium ${
                            cat.score >= 80 ? "text-green-400" : 
                            cat.score >= 60 ? "text-yellow-400" : "text-red-400"
                          }`}>
                            {cat.score}/100
                          </span>
                        </div>
                        <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${cat.score}%` }}
                            transition={{ duration: 1, delay: 0.5 }}
                            className={`h-full rounded-full ${
                              cat.score >= 80 ? "bg-gradient-to-r from-green-500 to-emerald-400" :
                              cat.score >= 60 ? "bg-gradient-to-r from-yellow-500 to-amber-400" :
                              "bg-gradient-to-r from-red-500 to-rose-400"
                            }`}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </GlassCard>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-16"
            >
              <h2 className="text-2xl font-bold text-white mb-8 text-center">Active Security Measures</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {SECURITY_FEATURES.map((feature, index) => (
                  <motion.div
                    key={feature.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <GlassCard className="p-6 h-full">
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500/20 to-purple-500/20 flex items-center justify-center flex-shrink-0">
                          <feature.icon className="w-5 h-5 text-cyan-400" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-white font-medium">{feature.title}</h3>
                            <CheckCircle className="w-4 h-4 text-green-400" />
                          </div>
                          <p className="text-white/50 text-sm">{feature.description}</p>
                        </div>
                      </div>
                    </GlassCard>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-16"
            >
              <GlassCard className="p-8">
                <div className="flex items-center gap-3 mb-6">
                  <AlertTriangle className="w-6 h-6 text-amber-400" />
                  <h2 className="text-xl font-bold text-white">Transparency Notes</h2>
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  {TRANSPARENCY_NOTES.map((note, index) => (
                    <div key={index} className="flex gap-3">
                      <div className="w-1 bg-gradient-to-b from-cyan-500 to-purple-500 rounded-full flex-shrink-0" />
                      <div>
                        <h3 className="text-white font-medium mb-1">{note.title}</h3>
                        <p className="text-white/50 text-sm">{note.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </GlassCard>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <GlassCard className="p-8 bg-gradient-to-r from-cyan-950/30 via-purple-950/30 to-pink-950/30">
                <FileText className="w-12 h-12 text-cyan-400 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-white mb-2">Report a Vulnerability</h2>
                <p className="text-white/60 mb-6 max-w-xl mx-auto">
                  Found a security issue? We take all reports seriously. Responsible disclosure is rewarded with DWC tokens at mainnet launch.
                </p>
                <a
                  href="mailto:security@dwsc.io?subject=Security%20Vulnerability%20Report"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 rounded-lg text-white font-medium transition-colors"
                  data-testid="link-report-vulnerability"
                >
                  <Shield className="w-5 h-5" />
                  Report Vulnerability
                  <ExternalLink className="w-4 h-4" />
                </a>
                <p className="text-white/30 text-xs mt-4">
                  security@dwsc.io | Responsible disclosure program
                </p>
              </GlassCard>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
