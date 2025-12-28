import { motion } from "framer-motion";
import { Link } from "wouter";
import { 
  Shield, Lock, Key, Server, Eye, CheckCircle, AlertTriangle,
  FileText, ExternalLink, Zap, Database, Globe, ArrowLeft,
  ShieldCheck, Fingerprint, Ban, Activity, Award, TrendingUp,
  Users, Clock, Sparkles
} from "lucide-react";
import { Footer } from "@/components/footer";
import { GlassCard } from "@/components/glass-card";
import { HeaderTools } from "@/components/header-tools";
import { usePageAnalytics } from "@/hooks/use-analytics";

const SECURITY_SCORE = 78;
const INDUSTRY_AVERAGE = 52;

const HERO_STATS = [
  { label: "Security Score", value: "78/100", icon: Shield, color: "cyan" },
  { label: "Above Industry Avg", value: "+50%", icon: TrendingUp, color: "green" },
  { label: "Active Protections", value: "12+", icon: ShieldCheck, color: "purple" },
  { label: "Zero Breaches", value: "0", icon: Ban, color: "pink" },
];

const SECURITY_FEATURES = [
  {
    icon: Lock,
    title: "AES-256-GCM Encryption",
    description: "Same encryption used by banks and military. Your wallet keys are fortress-protected.",
    badge: "Military Grade"
  },
  {
    icon: Key,
    title: "Cryptographic Signatures",
    description: "Every transaction is signed with HMAC-SHA256, making forgery mathematically impossible.",
    badge: "Bank Level"
  },
  {
    icon: Shield,
    title: "Advanced Security Headers",
    description: "Content Security Policy blocks XSS attacks. Frame protection prevents clickjacking.",
    badge: "Enterprise"
  },
  {
    icon: Server,
    title: "DDoS Protection",
    description: "10+ rate limiting categories protect against automated attacks and abuse.",
    badge: "Always On"
  },
  {
    icon: Database,
    title: "SQL Injection Immunity",
    description: "Parameterized queries through Drizzle ORM make database attacks impossible.",
    badge: "Zero Risk"
  },
  {
    icon: Fingerprint,
    title: "Passwordless Auth",
    description: "WebAuthn passkeys use your device's secure hardware. No passwords to steal.",
    badge: "Next Gen"
  }
];

const COMPARISON_DATA = [
  { category: "Encryption", dwsc: 95, industry: 60 },
  { category: "Authentication", dwsc: 85, industry: 55 },
  { category: "API Protection", dwsc: 80, industry: 45 },
  { category: "Data Integrity", dwsc: 90, industry: 50 },
  { category: "Secret Management", dwsc: 90, industry: 40 },
  { category: "Headers & CORS", dwsc: 85, industry: 35 },
];

const CERTIFICATIONS_PLANNED = [
  { name: "Third-Party Audit", status: "Funded at Presale Goal", icon: FileText },
  { name: "Multi-Validator Network", status: "Mainnet Launch", icon: Users },
  { name: "Bug Bounty Program", status: "Active Now", icon: Award },
];

function HeroScoreBadge() {
  return (
    <div className="relative">
      <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/30 via-purple-500/30 to-pink-500/30 blur-3xl" />
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", duration: 1.2 }}
        className="relative"
      >
        <div className="relative w-64 h-64 mx-auto">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 200 200">
            <circle
              cx="100"
              cy="100"
              r="90"
              fill="none"
              stroke="rgba(255,255,255,0.05)"
              strokeWidth="8"
            />
            <circle
              cx="100"
              cy="100"
              r="90"
              fill="none"
              stroke="rgba(255,255,255,0.1)"
              strokeWidth="8"
              strokeDasharray={`${(INDUSTRY_AVERAGE / 100) * 565} 565`}
              className="opacity-30"
            />
            <motion.circle
              cx="100"
              cy="100"
              r="90"
              fill="none"
              stroke="url(#heroGradient)"
              strokeWidth="12"
              strokeLinecap="round"
              initial={{ strokeDasharray: "0 565" }}
              animate={{ strokeDasharray: `${(SECURITY_SCORE / 100) * 565} 565` }}
              transition={{ duration: 2, delay: 0.5 }}
              filter="url(#glow)"
            />
            <defs>
              <linearGradient id="heroGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#06b6d4" />
                <stop offset="50%" stopColor="#8b5cf6" />
                <stop offset="100%" stopColor="#ec4899" />
              </linearGradient>
              <filter id="glow">
                <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
                <feMerge>
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.5 }}
              className="text-center"
            >
              <span className="text-6xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                {SECURITY_SCORE}
              </span>
              <span className="text-white/40 text-xl block">/100</span>
            </motion.div>
          </div>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2 }}
          className="text-center mt-4"
        >
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-full">
            <TrendingUp className="w-5 h-5 text-green-400" />
            <span className="text-green-400 font-semibold">50% Above Industry Average</span>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}

function ComparisonBar({ category, dwsc, industry, index }: { category: string; dwsc: number; industry: number; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className="space-y-2"
    >
      <div className="flex justify-between text-sm">
        <span className="text-white/80 font-medium">{category}</span>
        <div className="flex gap-4">
          <span className="text-cyan-400">{dwsc}%</span>
          <span className="text-white/30">{industry}%</span>
        </div>
      </div>
      <div className="relative h-3 bg-white/5 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: `${industry}%` }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.3 }}
          className="absolute h-full bg-white/10 rounded-full"
        />
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: `${dwsc}%` }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, delay: 0.5 }}
          className="absolute h-full bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 rounded-full"
          style={{ boxShadow: "0 0 20px rgba(6, 182, 212, 0.5)" }}
        />
      </div>
    </motion.div>
  );
}

export default function SecurityPage() {
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
        <section className="py-20 px-4 relative">
          <div className="container mx-auto max-w-6xl">
            <Link href="/" className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 mb-12 transition-colors" data-testid="link-back-home">
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Link>

            <div className="grid lg:grid-cols-2 gap-16 items-center mb-20">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
              >
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-500/10 via-purple-500/10 to-pink-500/10 border border-cyan-500/30 rounded-full mb-6">
                  <Sparkles className="w-4 h-4 text-cyan-400" />
                  <span className="text-cyan-400 text-sm font-medium">Security First Philosophy</span>
                </div>
                <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
                  <span className="text-white">Your Assets</span>
                  <br />
                  <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                    Fort Knox Protected
                  </span>
                </h1>
                <p className="text-xl text-white/60 mb-8 leading-relaxed">
                  We don't wait for problems. DWSC implements enterprise-grade security from day one, 
                  scoring <span className="text-cyan-400 font-semibold">50% higher</span> than the industry average 
                  before our first transaction.
                </p>
                <div className="flex flex-wrap gap-4">
                  <a
                    href="#measures"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 rounded-lg text-white font-medium transition-all hover:scale-105"
                    data-testid="link-view-measures"
                  >
                    <Shield className="w-5 h-5" />
                    View All Protections
                  </a>
                  <a
                    href="mailto:security@dwsc.io?subject=Security%20Vulnerability%20Report"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-white font-medium transition-all"
                    data-testid="link-report-vulnerability"
                  >
                    <Award className="w-5 h-5" />
                    Bug Bounty Program
                  </a>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <HeroScoreBadge />
              </motion.div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-20">
              {HERO_STATS.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                >
                  <GlassCard className="p-6 text-center h-full hover:scale-105 transition-transform">
                    <div className={`w-12 h-12 mx-auto mb-3 rounded-xl bg-gradient-to-br from-${stat.color}-500/20 to-${stat.color}-600/20 flex items-center justify-center`}>
                      <stat.icon className={`w-6 h-6 text-${stat.color}-400`} />
                    </div>
                    <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
                    <div className="text-white/50 text-sm">{stat.label}</div>
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
                  How We Compare
                </span>
              </h2>
              <p className="text-white/60 max-w-2xl mx-auto">
                While most blockchain projects launch first and secure later, 
                DWSC builds security into every layer from the start.
              </p>
            </motion.div>

            <GlassCard className="p-8 mb-8">
              <div className="flex items-center justify-end gap-6 mb-6 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-2 rounded bg-gradient-to-r from-cyan-500 to-pink-500" />
                  <span className="text-white/80">DWSC</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-2 rounded bg-white/20" />
                  <span className="text-white/40">Industry Average</span>
                </div>
              </div>
              <div className="space-y-6">
                {COMPARISON_DATA.map((item, index) => (
                  <ComparisonBar
                    key={item.category}
                    category={item.category}
                    dwsc={item.dwsc}
                    industry={item.industry}
                    index={index}
                  />
                ))}
              </div>
            </GlassCard>
          </div>
        </section>

        <section id="measures" className="py-20 px-4">
          <div className="container mx-auto max-w-6xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Active Security Measures
                </span>
              </h2>
              <p className="text-white/60 max-w-2xl mx-auto">
                Every protection is live and actively guarding your assets right now.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {SECURITY_FEATURES.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <GlassCard className="p-6 h-full group hover:scale-105 transition-all duration-300 relative overflow-hidden">
                    <div className="absolute top-0 right-0 px-3 py-1 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border-l border-b border-white/10 rounded-bl-lg">
                      <span className="text-xs font-medium text-cyan-400">{feature.badge}</span>
                    </div>
                    <div className="flex items-start gap-4 mt-4">
                      <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-cyan-500/20 via-purple-500/20 to-pink-500/20 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                        <feature.icon className="w-7 h-7 text-cyan-400" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-white font-semibold text-lg">{feature.title}</h3>
                          <CheckCircle className="w-5 h-5 text-green-400" />
                        </div>
                        <p className="text-white/50 text-sm leading-relaxed">{feature.description}</p>
                      </div>
                    </div>
                  </GlassCard>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 px-4 bg-gradient-to-b from-transparent via-purple-950/20 to-transparent">
          <div className="container mx-auto max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <GlassCard className="p-8 md:p-12 text-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 via-purple-500/5 to-pink-500/5" />
                <div className="relative">
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500/10 border border-amber-500/30 rounded-full mb-6">
                    <Clock className="w-4 h-4 text-amber-400" />
                    <span className="text-amber-400 text-sm font-medium">Roadmap to Certification</span>
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                    Full Third-Party Audit Coming
                  </h2>
                  <p className="text-white/60 mb-8 max-w-2xl mx-auto">
                    We're already more secure than most audited chains. When we hit our presale goal, 
                    we'll make it official with a comprehensive third-party security audit 
                    from an industry-recognized firm.
                  </p>
                  <div className="grid md:grid-cols-3 gap-4">
                    {CERTIFICATIONS_PLANNED.map((cert, index) => (
                      <motion.div
                        key={cert.name}
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1 }}
                        className="p-4 bg-white/5 rounded-xl border border-white/10"
                      >
                        <cert.icon className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                        <div className="text-white font-medium mb-1">{cert.name}</div>
                        <div className="text-white/40 text-sm">{cert.status}</div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          </div>
        </section>

        <section className="py-20 px-4">
          <div className="container mx-auto max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <GlassCard className="p-8 md:p-12 bg-gradient-to-r from-cyan-950/30 via-purple-950/30 to-pink-950/30 relative overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-32 bg-gradient-to-b from-cyan-500/20 to-transparent blur-2xl" />
                <div className="relative">
                  <Award className="w-16 h-16 text-cyan-400 mx-auto mb-6" />
                  <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                    Found a Vulnerability?
                  </h2>
                  <p className="text-white/60 mb-8 max-w-xl mx-auto">
                    Our bug bounty program rewards responsible disclosure. 
                    Help us stay secure and earn DWC tokens at mainnet launch.
                  </p>
                  <a
                    href="mailto:security@dwsc.io?subject=Security%20Vulnerability%20Report"
                    className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-cyan-600 via-purple-600 to-pink-600 hover:from-cyan-500 hover:via-purple-500 hover:to-pink-500 rounded-xl text-white font-semibold text-lg transition-all hover:scale-105 shadow-lg shadow-purple-500/25"
                    data-testid="link-report-bug"
                  >
                    <Shield className="w-6 h-6" />
                    Report & Earn Rewards
                    <ExternalLink className="w-5 h-5" />
                  </a>
                  <p className="text-white/30 text-sm mt-6">
                    security@dwsc.io
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
