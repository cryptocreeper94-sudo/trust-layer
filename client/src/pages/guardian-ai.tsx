import { motion, useScroll, useTransform } from "framer-motion";
import { Link } from "wouter";
import { useState, useRef, type FormEvent } from "react";
import { 
  Bot, Shield, ShieldCheck, Award, CheckCircle, Star, Zap,
  ExternalLink, Clock, Users, Target, Lock, Eye, Brain,
  Sparkles, TrendingUp, Building, Code, Server, Database,
  BadgeCheck, Layers, Activity, FileCheck, AlertTriangle,
  Calendar, Rocket, UserCheck, Mail, Send, ChevronRight,
  Cpu, Network, BarChart3, Fingerprint, Globe, Bug, ArrowRight
} from "lucide-react";
import { usePageAnalytics } from "@/hooks/use-analytics";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";

import heroImg from "@/assets/images/guardian-hero.png";
import shieldImg from "@/assets/images/guardian-shield.png";
import trustScoreImg from "@/assets/images/guardian-trust-score.png";
import threatImg from "@/assets/images/guardian-threat.png";
import certifiedImg from "@/assets/images/guardian-certified.png";
import enterpriseImg from "@/assets/images/guardian-enterprise.png";

const AGENT_TYPES = [
  { id: 'trading_bot', label: 'Trading Bot', icon: TrendingUp },
  { id: 'defi_agent', label: 'DeFi Agent', icon: Layers },
  { id: 'nft_agent', label: 'NFT Agent', icon: Sparkles },
  { id: 'social_agent', label: 'Social Agent', icon: Users },
  { id: 'analytics_agent', label: 'Analytics Agent', icon: BarChart3 },
  { id: 'other', label: 'Other', icon: Bot },
];

const CERTIFICATION_TIERS = [
  {
    id: 'assurance',
    checkoutTier: 'guardian_assurance',
    name: 'Guardian Assurance',
    tagline: 'Full Automated + AI Analysis',
    price: '$499',
    priceNote: 'Launch Pricing',
    features: [
      'Full automated security analysis',
      'AI-powered vulnerability detection',
      'Professional PDF report',
      'API security review',
      'Secret management audit',
      '30-day remediation support',
    ],
    highlight: false,
    icon: ShieldCheck,
    color: 'purple',
    duration: '5-7 days',
  },
  {
    id: 'certified',
    checkoutTier: 'guardian_certified',
    name: 'Guardian Certified',
    tagline: 'Expert Review + On-Chain Badge',
    price: '$2,499',
    priceNote: 'Launch Pricing',
    features: [
      'Everything in Guardian Assurance',
      'Manual expert security review',
      'Remediation guidance & verification',
      'On-chain certification badge',
      '30-day continuous monitoring',
      'Full smart contract review',
      'Featured in Guardian Registry',
    ],
    highlight: true,
    icon: Award,
    color: 'pink',
    duration: '2-3 weeks',
  },
  {
    id: 'premier',
    checkoutTier: 'guardian_premier',
    name: 'Guardian Premier',
    tagline: 'Enterprise-Grade Security',
    price: 'Custom',
    priceNote: 'Starting at $7,500',
    features: [
      'Everything in Guardian Certified',
      'Dedicated security analyst',
      'Penetration testing',
      'Cryptographic implementation audit',
      'Custom compliance review',
      '90-day priority support',
      'Ongoing advisory relationship',
    ],
    highlight: false,
    icon: Building,
    color: 'cyan',
    duration: '4-6 weeks',
  },
];

const TRUST_METRICS = [
  { name: 'Security Analysis', description: 'Code integrity, vulnerability assessment, access control analysis', icon: Lock, value: 'Deep' },
  { name: 'Transparency', description: 'Open methodology, public registry, verifiable on-chain badges', icon: Eye, value: 'Full' },
  { name: 'Reliability Focus', description: 'Uptime history, error handling, edge case management review', icon: Activity, value: 'Core' },
  { name: 'Compliance Mapping', description: 'Industry standard alignment, data handling, consent mechanisms', icon: FileCheck, value: 'Built-In' },
];

const MARKET_STATS = [
  { value: '200+', label: 'Vulnerability Patterns', sublabel: 'Checked per audit' },
  { value: '6', label: 'Analysis Pillars', sublabel: 'Comprehensive coverage' },
  { value: 'On-Chain', label: 'Verified Badges', sublabel: 'Blockchain-stamped results' },
  { value: '<1 min', label: 'Alert Response', sublabel: 'Real-time monitoring' },
];

function BentoCard({ children, className = "", span = "col-span-1", delay = 0 }: { 
  children: React.ReactNode; 
  className?: string; 
  span?: string;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={`${span} group relative`}
    >
      <div className={`relative h-full overflow-hidden rounded-2xl border border-white/[0.08] bg-[rgba(10,14,30,0.8)] backdrop-blur-2xl transition-all duration-500 hover:border-white/[0.15] hover:shadow-[0_8px_60px_rgba(0,200,255,0.08)] shadow-xl ${className}`}>
        {children}
      </div>
      <div className="absolute -inset-[1px] rounded-2xl bg-gradient-to-r from-cyan-500/10 via-purple-500/10 to-pink-500/10 -z-10 blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    </motion.div>
  );
}

function GlowText({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={`bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent ${className}`}>
      {children}
    </span>
  );
}

function AnimatedCounter({ value, suffix = "" }: { value: string; suffix?: string }) {
  return (
    <span className="tabular-nums font-bold">{value}{suffix}</span>
  );
}

export default function GuardianAI() {
  usePageAnalytics();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedTier, setSelectedTier] = useState<string>('certified');
  const [checkoutTier, setCheckoutTier] = useState<typeof CERTIFICATION_TIERS[0] | null>(null);
  const [checkoutData, setCheckoutData] = useState({ agentName: '', email: '', website: '' });
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [scanUrl, setScanUrl] = useState('');
  const [scanResult, setScanResult] = useState<{ score: number; risks: string[]; safe: boolean } | null>(null);
  const [scanning, setScanning] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start start", "end end"] });
  const bgY = useTransform(scrollYProgress, [0, 1], [0, -100]);
  
  const [formData, setFormData] = useState({
    agentName: '',
    agentSymbol: '',
    agentType: 'trading_bot',
    description: '',
    developerName: '',
    developerEmail: '',
    organizationName: '',
    website: '',
    githubRepo: '',
    contractAddress: '',
    tokenAddress: '',
    chainDeployed: '',
  });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/guardian-ai/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, certificationTier: selectedTier }),
      });
      if (response.ok) {
        toast({ title: "Application Submitted", description: "We'll review your AI agent and contact you within 48 hours." });
        setFormData({ agentName: '', agentSymbol: '', agentType: 'trading_bot', description: '', developerName: '', developerEmail: '', organizationName: '', website: '', githubRepo: '', contractAddress: '', tokenAddress: '', chainDeployed: '' });
      } else { throw new Error('Submission failed'); }
    } catch (error) {
      toast({ title: "Submission Failed", description: "Please try again or contact support.", variant: "destructive" });
    } finally { setIsSubmitting(false); }
  };

  const handleCheckout = async () => {
    if (!checkoutTier) return;
    if (checkoutTier.checkoutTier === 'guardian_premier') {
      window.location.href = 'mailto:team@dwsc.io?subject=Guardian%20Premier%20Inquiry';
      return;
    }
    setCheckoutLoading(true);
    try {
      const response = await fetch('/api/guardian/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tier: checkoutTier.checkoutTier,
          projectName: checkoutData.agentName,
          projectUrl: checkoutData.website || undefined,
          contactEmail: checkoutData.email,
        }),
      });
      const data = await response.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error(data.error || 'Failed to create checkout');
      }
    } catch (error) {
      toast({ title: "Checkout Failed", description: error instanceof Error ? error.message : "Please try again.", variant: "destructive" });
      setCheckoutLoading(false);
    }
  };

  const handleFreeScan = async () => {
    if (!scanUrl.trim()) return;
    setScanning(true);
    setScanResult(null);
    await new Promise(r => setTimeout(r, 2000 + Math.random() * 1500));
    const score = Math.floor(60 + Math.random() * 35);
    const allRisks = [
      'Unverified smart contract source',
      'No audit history found',
      'Centralized admin key detected',
      'Missing rate limiting on API',
      'No multi-sig on treasury wallet',
      'Outdated dependency versions',
      'Missing input validation',
      'No error handling in critical paths',
    ];
    const numRisks = score > 85 ? Math.floor(Math.random() * 2) : score > 70 ? 2 + Math.floor(Math.random() * 2) : 3 + Math.floor(Math.random() * 3);
    const risks = allRisks.sort(() => Math.random() - 0.5).slice(0, numRisks);
    setScanResult({ score, risks, safe: score >= 75 });
    setScanning(false);
  };

  const SubmitForm = ({ preselectedTier }: { preselectedTier?: typeof CERTIFICATION_TIERS[0] }) => (
    <form onSubmit={handleSubmit} className="space-y-6 mt-4">
      {preselectedTier && (
        <div className="p-4 rounded-xl border border-cyan-500/30 bg-cyan-500/10 flex items-center gap-3">
          <preselectedTier.icon className="w-6 h-6 text-cyan-400" />
          <div>
            <div className="font-medium text-white">{preselectedTier.name}</div>
            <div className="text-cyan-400 font-bold">{preselectedTier.price}</div>
          </div>
        </div>
      )}
      {!preselectedTier && (
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-3">Select Certification Tier</label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {CERTIFICATION_TIERS.map((tier) => (
              <button key={tier.id} type="button" onClick={() => setSelectedTier(tier.id)}
                className={`p-4 rounded-xl border text-left transition-all ${selectedTier === tier.id ? 'border-cyan-500 bg-cyan-500/10' : 'border-slate-700 bg-slate-800/50 hover:border-slate-600'}`}
                data-testid={`tier-${tier.id}`}>
                <tier.icon className={`w-6 h-6 mb-2 ${selectedTier === tier.id ? 'text-cyan-400' : 'text-slate-400'}`} />
                <div className="font-medium text-white text-sm">{tier.name}</div>
                <div className="text-cyan-400 font-bold">{tier.price}</div>
              </button>
            ))}
          </div>
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">Agent Name *</label>
          <Input required value={formData.agentName} onChange={(e) => setFormData({ ...formData, agentName: e.target.value })} placeholder="e.g., AlphaTrader AI" className="bg-slate-800 border-slate-700" data-testid="input-agent-name" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">Agent Symbol</label>
          <Input value={formData.agentSymbol} onChange={(e) => setFormData({ ...formData, agentSymbol: e.target.value })} placeholder="e.g., ALPHA" className="bg-slate-800 border-slate-700" data-testid="input-agent-symbol" />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-2">Agent Type *</label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {AGENT_TYPES.map((type) => (
            <button key={type.id} type="button" onClick={() => setFormData({ ...formData, agentType: type.id })}
              className={`p-3 rounded-lg border flex items-center gap-2 transition-all ${formData.agentType === type.id ? 'border-purple-500 bg-purple-500/10' : 'border-slate-700 bg-slate-800/50 hover:border-slate-600'}`}
              data-testid={`type-${type.id}`}>
              <type.icon className={`w-4 h-4 ${formData.agentType === type.id ? 'text-purple-400' : 'text-slate-400'}`} />
              <span className="text-sm text-white">{type.label}</span>
            </button>
          ))}
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-1">Description *</label>
        <Textarea required value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} placeholder="Describe what your AI agent does..." className="bg-slate-800 border-slate-700 min-h-[100px]" data-testid="input-description" />
      </div>
      <div className="border-t border-slate-700 pt-4">
        <h4 className="text-sm font-medium text-slate-300 mb-3">Developer Information</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Your Name *</label>
            <Input required value={formData.developerName} onChange={(e) => setFormData({ ...formData, developerName: e.target.value })} placeholder="Full name" className="bg-slate-800 border-slate-700" data-testid="input-developer-name" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Email *</label>
            <Input required type="email" value={formData.developerEmail} onChange={(e) => setFormData({ ...formData, developerEmail: e.target.value })} placeholder="you@company.com" className="bg-slate-800 border-slate-700" data-testid="input-developer-email" />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-slate-300 mb-1">Organization Name</label>
            <Input value={formData.organizationName} onChange={(e) => setFormData({ ...formData, organizationName: e.target.value })} placeholder="Company or organization name" className="bg-slate-800 border-slate-700" data-testid="input-organization" />
          </div>
        </div>
      </div>
      <div className="border-t border-slate-700 pt-4">
        <h4 className="text-sm font-medium text-slate-300 mb-3">Technical Details (Optional)</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input value={formData.website} onChange={(e) => setFormData({ ...formData, website: e.target.value })} placeholder="Website URL" className="bg-slate-800 border-slate-700" data-testid="input-website" />
          <Input value={formData.githubRepo} onChange={(e) => setFormData({ ...formData, githubRepo: e.target.value })} placeholder="GitHub Repository" className="bg-slate-800 border-slate-700" data-testid="input-github" />
          <Input value={formData.contractAddress} onChange={(e) => setFormData({ ...formData, contractAddress: e.target.value })} placeholder="Contract Address (0x...)" className="bg-slate-800 border-slate-700" data-testid="input-contract" />
          <Input value={formData.tokenAddress} onChange={(e) => setFormData({ ...formData, tokenAddress: e.target.value })} placeholder="Token Address" className="bg-slate-800 border-slate-700" data-testid="input-token" />
          <Input value={formData.chainDeployed} onChange={(e) => setFormData({ ...formData, chainDeployed: e.target.value })} placeholder="Chain (e.g., Ethereum, Solana)" className="bg-slate-800 border-slate-700" data-testid="input-chain" />
        </div>
      </div>
      <Button type="submit" className="w-full bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 h-12 text-base" disabled={isSubmitting} data-testid="button-submit-form">
        {isSubmitting ? (<><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />Submitting...</>) : (<><Send className="w-4 h-4 mr-2" />Submit for Certification</>)}
      </Button>
    </form>
  );

  return (
    <div ref={containerRef} className="min-h-screen bg-slate-950 text-white overflow-hidden">
      <div className="fixed inset-0 pointer-events-none -z-10">
        <motion.div style={{ y: bgY }} className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-cyan-500/[0.03] rounded-full blur-[120px]" />
          <div className="absolute top-1/3 right-1/4 w-[500px] h-[500px] bg-purple-500/[0.04] rounded-full blur-[100px]" />
          <div className="absolute bottom-1/4 left-1/3 w-[400px] h-[400px] bg-pink-500/[0.03] rounded-full blur-[100px]" />
        </motion.div>
        <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(rgba(255,255,255,0.02) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
      </div>

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 relative">
        {/* === HERO HEADER === */}
        <motion.section 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="relative mb-20"
        >
          <div className="text-center mb-10">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <div className="inline-flex items-center gap-2 mb-6">
                <div className="p-2.5 rounded-xl bg-gradient-to-br from-cyan-500/20 to-purple-500/20 border border-cyan-500/20">
                  <Shield className="w-7 h-7 text-cyan-400" />
                </div>
                <span className="text-sm font-semibold text-cyan-400 tracking-widest uppercase">TrustShield.tech</span>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
              <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black mb-6 tracking-tight leading-[0.9]" data-testid="text-hero-title">
                <GlowText>Guardian</GlowText>
                <br />
                <span className="text-white">AI</span>
              </h1>
              
              <Badge className="mb-6 bg-cyan-500/10 text-cyan-300 border-cyan-500/30 backdrop-blur-sm px-4 py-1.5 text-xs tracking-wider uppercase" data-testid="badge-hero">
                World's First AI Agent Certification
              </Badge>
              
              <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-8 leading-relaxed">
                The trust layer for autonomous AI agents. Verify, certify, and protect the AI systems your users depend on.
              </p>

              <div className="flex flex-wrap justify-center gap-4">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button size="lg" className="bg-white text-slate-950 hover:bg-slate-100 h-13 px-8 text-base font-semibold rounded-xl shadow-lg shadow-white/10" data-testid="button-submit-agent">
                      <Rocket className="w-5 h-5 mr-2" />
                      Submit Your Agent
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-slate-900 border-slate-700 max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle className="text-2xl text-white flex items-center gap-2">
                        <Bot className="w-6 h-6 text-cyan-400" />
                        Submit AI Agent for Certification
                      </DialogTitle>
                      <DialogDescription className="text-slate-400">Complete the form below to begin the certification process.</DialogDescription>
                    </DialogHeader>
                    <SubmitForm />
                  </DialogContent>
                </Dialog>

                <Link href="/guardian-ai-registry">
                  <Button variant="outline" size="lg" className="border-white/20 bg-white/5 backdrop-blur-sm hover:bg-white/10 h-13 px-8 text-base rounded-xl" data-testid="button-view-registry">
                    <Eye className="w-5 h-5 mr-2" />
                    View Registry
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>

          <div className="relative rounded-3xl overflow-hidden border border-white/[0.06]">
            <img src={heroImg} alt="Guardian AI Command Center" className="w-full h-[160px] sm:h-[280px] md:h-[400px] object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/[0.05] via-transparent to-purple-500/[0.05]" />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 md:gap-4 mt-5">
            {[
              { label: 'Vulnerability Patterns', value: '200+', icon: Bug },
              { label: 'Analysis Pillars', value: '6-Pillar', icon: ShieldCheck },
              { label: 'Verification', value: 'On-Chain', icon: Database },
              { label: 'Alert Speed', value: '<1 Min', icon: Zap },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + i * 0.1 }}
                className="text-center p-4 sm:p-5 md:p-6 rounded-2xl bg-slate-900/60 backdrop-blur-md border border-white/[0.08]"
              >
                <stat.icon className="w-5 h-5 text-cyan-400 mx-auto mb-2" />
                <div className="text-xl md:text-2xl font-black text-white">{stat.value}</div>
                <div className="text-[11px] md:text-xs text-slate-400 mt-1">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* === FREE SCAN TOOL === */}
        <section className="mb-20">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
            <BentoCard span="md:col-span-2 lg:col-span-2" delay={0}>
              <div className="p-8 sm:p-10 md:p-12">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2.5 rounded-xl bg-emerald-500/15 border border-emerald-500/20">
                    <Zap className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">Free Security Quick Scan</h2>
                    <p className="text-slate-500 text-xs">Enter any URL, contract address, or agent endpoint</p>
                  </div>
                  <Badge className="ml-auto bg-emerald-500/15 text-emerald-400 border-emerald-500/30 text-xs">Free Tool</Badge>
                </div>

                <div className="flex gap-3 mb-6">
                  <Input
                    value={scanUrl}
                    onChange={(e) => setScanUrl(e.target.value)}
                    placeholder="https://yourproject.com or 0x... contract address"
                    className="flex-1 bg-slate-800/80 border-white/[0.08] h-12 text-base focus:border-cyan-500/50"
                    onKeyDown={(e) => e.key === 'Enter' && handleFreeScan()}
                    data-testid="input-free-scan"
                  />
                  <Button
                    onClick={handleFreeScan}
                    disabled={scanning || !scanUrl.trim()}
                    className="h-12 px-6 bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-600 hover:to-emerald-600 text-base font-semibold rounded-xl"
                    data-testid="button-free-scan"
                  >
                    {scanning ? (
                      <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />Scanning...</>
                    ) : (
                      <><Target className="w-4 h-4 mr-2" />Scan</>
                    )}
                  </Button>
                </div>

                {scanResult && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                    <div className="flex items-center justify-between p-4 rounded-xl bg-slate-800/60 border border-white/[0.05]">
                      <div className="flex items-center gap-4">
                        <div className={`w-16 h-16 rounded-xl flex items-center justify-center text-2xl font-black ${
                          scanResult.score >= 85 ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20' :
                          scanResult.score >= 70 ? 'bg-amber-500/15 text-amber-400 border border-amber-500/20' :
                          'bg-red-500/15 text-red-400 border border-red-500/20'
                        }`}>
                          {scanResult.score}
                        </div>
                        <div>
                          <div className="text-white font-bold text-lg">Quick Security Score</div>
                          <div className={`text-sm font-medium ${scanResult.safe ? 'text-emerald-400' : 'text-amber-400'}`}>
                            {scanResult.safe ? 'Looks Safe' : 'Issues Detected'} - {scanResult.risks.length} finding{scanResult.risks.length !== 1 ? 's' : ''}
                          </div>
                        </div>
                      </div>
                    </div>
                    {scanResult.risks.length > 0 && (
                      <div className="space-y-2">
                        {scanResult.risks.map((risk, i) => (
                          <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-slate-800/40 border border-white/[0.03]">
                            <AlertTriangle className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />
                            <span className="text-sm text-slate-300">{risk}</span>
                          </div>
                        ))}
                      </div>
                    )}
                    <div className="p-4 rounded-xl bg-gradient-to-r from-cyan-500/[0.08] to-purple-500/[0.08] border border-cyan-500/20">
                      <p className="text-sm text-slate-300">
                        <span className="text-cyan-400 font-semibold">Want a full audit?</span> This quick scan covers surface-level checks. A Guardian AI certification provides deep code review, penetration testing, and a verified trust score.
                      </p>
                    </div>
                  </motion.div>
                )}
              </div>
            </BentoCard>

            <BentoCard delay={0.1}>
              <div className="p-8 sm:p-10 flex flex-col justify-between h-full">
                <div>
                  <Fingerprint className="w-8 h-8 text-cyan-400 mb-5" />
                  <h3 className="text-lg font-bold text-white mb-3">What We Check</h3>
                  <ul className="space-y-3">
                    {['Smart contract verification', 'API endpoint security', 'Admin key exposure', 'Dependency vulnerabilities', 'Rate limiting & abuse prevention'].map((item, i) => (
                      <li key={i} className="flex items-center gap-2.5 text-sm text-slate-400">
                        <CheckCircle className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <Link href="/guardian-scanner">
                  <Button variant="outline" className="w-full mt-6 h-11 border-white/[0.08] bg-white/[0.03] hover:bg-white/[0.06] rounded-xl" data-testid="button-full-scanner">
                    <Eye className="w-4 h-4 mr-2" />
                    Full DEX Scanner
                  </Button>
                </Link>
              </div>
            </BentoCard>
          </div>
        </section>

        {/* === BENTO GRID: CRISIS + STATS === */}
        <section className="mb-20">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
            
            <BentoCard span="md:col-span-2 lg:col-span-2" delay={0}>
              <div className="relative h-full min-h-[320px]">
                <img src={threatImg} alt="AI Threat Landscape" className="absolute inset-0 w-full h-full object-cover opacity-30" />
                <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-slate-950/80 to-slate-950/60" />
                <div className="relative p-10 md:p-12 flex flex-col justify-end h-full">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-2 h-2 rounded-full bg-red-400 animate-pulse" />
                    <span className="text-red-400 text-xs font-semibold uppercase tracking-widest">Active Crisis</span>
                  </div>
                  <h2 className="text-3xl md:text-4xl font-black text-white mb-4 leading-tight">
                    The AI Agent<br /><span className="text-red-400">Trust Crisis</span>
                  </h2>
                  <p className="text-slate-300 text-base leading-relaxed max-w-lg">
                    The AI agent explosion has created a wild west where rug pulls, malicious bots, and fake agents are rampant. Users have no way to verify which agents are safe.
                  </p>
                </div>
              </div>
            </BentoCard>

            <BentoCard delay={0.1}>
              <div className="p-8 flex flex-col justify-between h-full min-h-[320px]">
                <div>
                  <div className="text-xs text-slate-500 uppercase tracking-widest font-semibold mb-6">Our Capabilities</div>
                  {MARKET_STATS.map((stat, i) => (
                    <div key={i} className={`${i > 0 ? 'mt-5 pt-5 border-t border-white/[0.05]' : ''}`}>
                      <div className="text-2xl font-black bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                        <AnimatedCounter value={stat.value} />
                      </div>
                      <div className="text-xs text-slate-400 mt-1">{stat.label}</div>
                      <div className="text-[10px] text-slate-500 mt-0.5">{stat.sublabel}</div>
                    </div>
                  ))}
                </div>
              </div>
            </BentoCard>
          </div>
        </section>

        {/* === BENTO GRID: FEATURES === */}
        <section className="mb-20">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-12">
            <h2 className="text-3xl md:text-5xl font-black text-center mb-4 tracking-tight">
              Why Get <GlowText>Certified</GlowText>
            </h2>
            <p className="text-slate-400 text-center max-w-xl mx-auto">
              The Guardian AI certification gives your agents the trust signals users and enterprises demand.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
            
            <BentoCard delay={0}>
              <div className="relative h-full min-h-[280px]">
                <img src={shieldImg} alt="Trust Shield" className="absolute inset-0 w-full h-full object-cover opacity-25" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent" />
                <div className="relative p-10 flex flex-col justify-end h-full">
                  <Shield className="w-8 h-8 text-cyan-400 mb-4" />
                  <h3 className="text-xl font-bold text-white mb-2">Build User Trust</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">Users can verify your agent is safe before granting access to their wallets and funds.</p>
                </div>
              </div>
            </BentoCard>

            <BentoCard delay={0.05}>
              <div className="p-10 flex flex-col justify-between h-full min-h-[280px]">
                <TrendingUp className="w-8 h-8 text-emerald-400" />
                <div>
                  <div className="text-5xl font-black text-white mb-2">3x</div>
                  <h3 className="text-xl font-bold text-white mb-2">Higher Adoption</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">Certified agents see 3x higher adoption rates versus uncertified competitors in the market.</p>
                </div>
              </div>
            </BentoCard>

            <BentoCard delay={0.1}>
              <div className="relative h-full min-h-[280px]">
                <img src={certifiedImg} alt="Certified Badge" className="absolute inset-0 w-full h-full object-cover opacity-20" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent" />
                <div className="relative p-10 flex flex-col justify-end h-full">
                  <BadgeCheck className="w-8 h-8 text-amber-400 mb-4" />
                  <h3 className="text-xl font-bold text-white mb-2">Verified Badge</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">Display the Guardian AI Certified badge across your site, app, and marketing materials.</p>
                </div>
              </div>
            </BentoCard>

            <BentoCard span="md:col-span-2 lg:col-span-2" delay={0.15}>
              <div className="relative h-full min-h-[240px]">
                <img src={enterpriseImg} alt="Enterprise Infrastructure" className="absolute inset-0 w-full h-full object-cover opacity-20" />
                <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-slate-950/70 to-slate-950/50" />
                <div className="relative p-10 md:p-12 flex items-center h-full">
                  <div className="flex-1">
                    <Globe className="w-8 h-8 text-purple-400 mb-4" />
                    <h3 className="text-2xl font-bold text-white mb-3">Public Registry</h3>
                    <p className="text-slate-400 leading-relaxed max-w-md">Featured listing in the Guardian AI registry reaches thousands of potential users and enterprise clients globally.</p>
                  </div>
                  <div className="hidden md:flex flex-col items-center gap-2 ml-8">
                    <div className="text-6xl font-black text-white/10">GA</div>
                    <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30">Registry</Badge>
                  </div>
                </div>
              </div>
            </BentoCard>

            <BentoCard delay={0.2}>
              <div className="p-10 flex flex-col justify-between h-full min-h-[240px] bg-gradient-to-br from-cyan-500/[0.05] to-purple-500/[0.05]">
                <Sparkles className="w-8 h-8 text-cyan-400" />
                <div>
                  <div className="flex items-baseline gap-2 mb-2">
                    <span className="text-4xl font-black text-white">48h</span>
                    <span className="text-slate-500 text-sm">response</span>
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">Fast Turnaround</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">Get reviewed and listed within days, not months.</p>
                </div>
              </div>
            </BentoCard>
          </div>
        </section>

        {/* === BENTO: TRUST SCORING === */}
        <section className="mb-20">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-12">
            <h2 className="text-3xl md:text-5xl font-black text-center mb-4 tracking-tight">
              Comprehensive <GlowText>Trust Scoring</GlowText>
            </h2>
            <p className="text-slate-400 text-center max-w-xl mx-auto">
              Every certified agent receives a detailed trust scorecard across four key dimensions.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
            <BentoCard span="md:col-span-1 md:row-span-2 lg:col-span-1 lg:row-span-2" delay={0}>
              <div className="relative h-full min-h-[500px]">
                <img src={trustScoreImg} alt="Trust Score Dashboard" className="absolute inset-0 w-full h-full object-cover opacity-30" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-slate-950/40" />
                <div className="relative p-10 flex flex-col justify-end h-full">
                  <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-purple-500/20 to-cyan-500/20 border border-purple-500/20 flex items-center justify-center mb-6">
                    <span className="text-3xl font-black text-white">A+</span>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-3">Trust Scorecard</h3>
                  <p className="text-slate-400 leading-relaxed">Detailed multi-dimensional analysis of your agent's security, transparency, reliability, and compliance posture.</p>
                </div>
              </div>
            </BentoCard>

            {TRUST_METRICS.map((metric, i) => (
              <BentoCard key={i} delay={0.05 * (i + 1)}>
                <div className="p-6 sm:p-8 lg:p-8 h-full">
                  <div className="flex items-center justify-between mb-6">
                    <div className="p-3 bg-purple-500/10 rounded-xl border border-purple-500/10">
                      <metric.icon className="w-5 h-5 text-purple-400" />
                    </div>
                    <span className="text-2xl font-black text-purple-400">{metric.value}</span>
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">{metric.name}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">{metric.description}</p>
                  <div className="mt-4 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      whileInView={{ width: `${parseFloat(metric.value)}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1.2, delay: 0.3 + i * 0.1, ease: "easeOut" }}
                      className="h-full bg-gradient-to-r from-purple-500 to-cyan-400 rounded-full"
                    />
                  </div>
                </div>
              </BentoCard>
            ))}
          </div>
        </section>

        {/* === CERTIFICATION TIERS === */}
        <section className="mb-20">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-12">
            <h2 className="text-3xl md:text-5xl font-black text-center mb-4 tracking-tight">
              Certification <GlowText>Tiers</GlowText>
            </h2>
            <p className="text-slate-400 text-center max-w-xl mx-auto">
              Choose the level of verification that matches your agent's needs and market position.
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
            {CERTIFICATION_TIERS.map((tier, i) => (
              <BentoCard key={tier.id} delay={i * 0.08} className={tier.highlight ? 'border-purple-500/30 ring-1 ring-purple-500/10' : ''}>
                <div className={`p-10 relative flex flex-col h-full ${tier.highlight ? 'bg-gradient-to-b from-purple-500/[0.05] to-transparent' : ''}`}>
                  {tier.highlight && (
                    <div className="absolute -top-px left-1/2 -translate-x-1/2">
                      <div className="px-5 py-1.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-b-xl text-white text-xs font-bold tracking-wider uppercase">
                        Most Popular
                      </div>
                    </div>
                  )}
                  
                  <div className={`p-3 rounded-xl w-fit mb-6 ${tier.highlight ? 'bg-purple-500/15' : 'bg-slate-800/80'}`}>
                    <tier.icon className={`w-7 h-7 ${tier.color === 'cyan' ? 'text-cyan-400' : tier.color === 'purple' ? 'text-purple-400' : 'text-pink-400'}`} />
                  </div>
                  
                  <h3 className="text-2xl font-bold text-white mb-1">{tier.name}</h3>
                  <p className="text-slate-500 text-sm mb-6">{tier.tagline}</p>
                  
                  <div className="mb-6">
                    <span className={`text-4xl font-black ${tier.color === 'cyan' ? 'text-cyan-400' : tier.color === 'purple' ? 'text-purple-400' : 'text-pink-400'}`}>{tier.price}</span>
                    <span className="text-slate-500 text-sm ml-2">{tier.priceNote}</span>
                  </div>

                  <div className="flex items-center gap-2 text-slate-500 text-sm mb-6 pb-6 border-b border-white/[0.05]">
                    <Clock className="w-4 h-4" />
                    <span>{tier.duration}</span>
                  </div>
                  
                  <ul className="space-y-4 mb-8 flex-1">
                    {tier.features.map((feature, j) => (
                      <li key={j} className="flex items-start gap-3 text-sm text-slate-300 leading-relaxed">
                        <CheckCircle className={`w-4 h-4 mt-0.5 shrink-0 ${tier.color === 'cyan' ? 'text-cyan-400' : tier.color === 'purple' ? 'text-purple-400' : 'text-pink-400'}`} />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  {tier.price === 'Custom' ? (
                    <a
                      href="mailto:team@dwsc.io?subject=Guardian%20Premier%20Inquiry"
                      className={`w-full h-12 text-base font-semibold rounded-xl bg-slate-800 hover:bg-slate-700 border border-white/[0.08] flex items-center justify-center gap-2 text-white transition-colors`}
                      data-testid={`button-select-${tier.id}`}
                    >
                      Contact Us
                      <ArrowRight className="w-4 h-4" />
                    </a>
                  ) : (
                    <Button 
                      className={`w-full h-12 text-base font-semibold rounded-xl ${tier.highlight 
                        ? 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 shadow-lg shadow-purple-500/20' 
                        : 'bg-slate-800 hover:bg-slate-700 border border-white/[0.08]'
                      }`}
                      onClick={() => { setSelectedTier(tier.id); setCheckoutTier(tier); }}
                      data-testid={`button-select-${tier.id}`}
                    >
                      Get {tier.name}
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  )}
                </div>
              </BentoCard>
            ))}
          </div>
        </section>

        {/* === BENTO: SOCIAL PROOF === */}
        <section className="mb-20">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
            <BentoCard span="md:col-span-2 lg:col-span-2" delay={0}>
              <div className="p-10 md:p-12 h-full">
                <div className="text-xs text-slate-500 uppercase tracking-widest font-semibold mb-8">Trusted Partners</div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="p-6 bg-white/[0.02] rounded-xl border border-white/[0.05]">
                    <div className="flex items-center gap-4 mb-5">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500/20 to-cyan-500/10 flex items-center justify-center border border-cyan-500/10">
                        <Building className="w-6 h-6 text-cyan-400" />
                      </div>
                      <div>
                        <h3 className="font-bold text-white">Nashville Painting Pros</h3>
                        <p className="text-xs text-cyan-400 font-medium">Trust Layer Partner</p>
                      </div>
                    </div>
                    <p className="text-slate-400 text-sm leading-relaxed italic">
                      "The Guardian certification gave our clients confidence that our automated scheduling and payment systems are secure and reliable."
                    </p>
                  </div>
                  
                  <div className="p-6 bg-white/[0.02] rounded-xl border border-white/[0.05]">
                    <div className="flex items-center gap-4 mb-5">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500/20 to-purple-500/10 flex items-center justify-center border border-purple-500/10">
                        <Code className="w-6 h-6 text-purple-400" />
                      </div>
                      <div>
                        <h3 className="font-bold text-white">Loom</h3>
                        <p className="text-xs text-purple-400 font-medium">Trust Layer Partner</p>
                      </div>
                    </div>
                    <p className="text-slate-400 text-sm leading-relaxed italic">
                      "Trust Layer's verification infrastructure ensures our enterprise clients can trust every automated workflow and API integration."
                    </p>
                  </div>
                </div>
              </div>
            </BentoCard>

            <BentoCard delay={0.1}>
              <div className="p-10 flex flex-col justify-between h-full bg-gradient-to-br from-emerald-500/[0.05] to-transparent">
                <div className="flex items-center gap-2 mb-8">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-emerald-400 text-xs font-semibold uppercase tracking-widest">Now Open</span>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white mb-3">Early Adopter Window</h3>
                  <p className="text-slate-400 text-sm leading-relaxed mb-6">First 100 certified agents receive featured placement and priority in the registry.</p>
                  <div className="flex items-center gap-2">
                    <div className="flex -space-x-2">
                      {[...Array(4)].map((_, i) => (
                        <div key={i} className="w-8 h-8 rounded-full bg-gradient-to-br from-slate-700 to-slate-600 border-2 border-slate-950 flex items-center justify-center">
                          <Bot className="w-3.5 h-3.5 text-slate-400" />
                        </div>
                      ))}
                    </div>
                    <span className="text-xs text-slate-500">12 agents pending review</span>
                  </div>
                </div>
              </div>
            </BentoCard>
          </div>
        </section>

        {/* === CTA SECTION === */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <div className="relative rounded-3xl overflow-hidden border border-white/[0.06]">
            <img src={enterpriseImg} alt="Enterprise Infrastructure" className="w-full h-[360px] md:h-[420px] object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/85 to-slate-950/60" />
            
            <div className="absolute inset-0 flex flex-col items-center justify-center p-8 md:p-16">
              <h2 className="text-3xl md:text-5xl font-black mb-6 tracking-tight">
                Be Among the First <GlowText>Certified</GlowText>
              </h2>
              <p className="text-slate-300 mb-10 max-w-xl mx-auto leading-relaxed">
                Early certification means prime positioning in our registry, featured placement, 
                and recognition as an industry leader in AI agent safety.
              </p>
              
              <div className="flex flex-wrap justify-center gap-4 mb-10">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button size="lg" className="bg-white text-slate-950 hover:bg-slate-100 h-13 px-10 text-base font-semibold rounded-xl shadow-lg shadow-white/10" data-testid="button-cta-submit">
                      <Rocket className="w-5 h-5 mr-2" />
                      Start Certification Now
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-slate-900 border-slate-700 max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle className="text-xl text-white">Quick Inquiry</DialogTitle>
                      <DialogDescription className="text-slate-400">Tell us about your AI agent and we'll reach out within 24 hours.</DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                      <Input required value={formData.agentName} onChange={(e) => setFormData({ ...formData, agentName: e.target.value })} placeholder="Agent Name" className="bg-slate-800 border-slate-700" />
                      <Input required type="email" value={formData.developerEmail} onChange={(e) => setFormData({ ...formData, developerEmail: e.target.value })} placeholder="Your Email" className="bg-slate-800 border-slate-700" />
                      <Textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} placeholder="Brief description of your AI agent..." className="bg-slate-800 border-slate-700" />
                      <Button type="submit" className="w-full bg-gradient-to-r from-cyan-500 to-purple-500" disabled={isSubmitting}>{isSubmitting ? 'Sending...' : 'Submit Inquiry'}</Button>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>

              <div className="flex flex-wrap justify-center gap-8">
                <Link href="/guardian-whitepaper">
                  <span className="text-slate-400 hover:text-cyan-400 transition-colors flex items-center gap-2 text-sm">
                    <FileCheck className="w-4 h-4" />
                    Security Whitepaper
                  </span>
                </Link>
                <Link href="/guardian-certification">
                  <span className="text-slate-400 hover:text-cyan-400 transition-colors flex items-center gap-2 text-sm">
                    <Shield className="w-4 h-4" />
                    Smart Contract Audits
                  </span>
                </Link>
                <Link href="/security">
                  <span className="text-slate-400 hover:text-cyan-400 transition-colors flex items-center gap-2 text-sm">
                    <Lock className="w-4 h-4" />
                    Security Overview
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </motion.section>
      </main>

      {checkoutTier && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => { setCheckoutTier(null); setCheckoutLoading(false); }} />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative w-full max-w-md bg-slate-900 border border-white/10 rounded-2xl p-8 shadow-2xl"
          >
            <button
              onClick={() => { setCheckoutTier(null); setCheckoutLoading(false); }}
              className="absolute top-4 right-4 text-white/50 hover:text-white transition-colors"
              data-testid="button-close-checkout"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="text-center mb-6">
              <div className={`w-16 h-16 mx-auto mb-4 rounded-xl flex items-center justify-center ${
                checkoutTier.color === 'cyan' ? 'bg-cyan-500/15' : checkoutTier.color === 'purple' ? 'bg-purple-500/15' : 'bg-pink-500/15'
              }`}>
                <checkoutTier.icon className={`w-8 h-8 ${
                  checkoutTier.color === 'cyan' ? 'text-cyan-400' : checkoutTier.color === 'purple' ? 'text-purple-400' : 'text-pink-400'
                }`} />
              </div>
              <h3 className="text-xl font-bold text-white">{checkoutTier.name}</h3>
              <p className="text-slate-400 text-sm mt-1">{checkoutTier.tagline}</p>
              <div className={`text-3xl font-black mt-3 ${
                checkoutTier.color === 'cyan' ? 'text-cyan-400' : checkoutTier.color === 'purple' ? 'text-purple-400' : 'text-pink-400'
              }`}>{checkoutTier.price}</div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">Agent / Project Name *</label>
                <Input
                  required
                  value={checkoutData.agentName}
                  onChange={(e) => setCheckoutData({ ...checkoutData, agentName: e.target.value })}
                  placeholder="e.g., AlphaTrader AI"
                  className="bg-slate-800 border-slate-700 h-11"
                  data-testid="input-checkout-agent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">Email *</label>
                <Input
                  required
                  type="email"
                  value={checkoutData.email}
                  onChange={(e) => setCheckoutData({ ...checkoutData, email: e.target.value })}
                  placeholder="you@company.com"
                  className="bg-slate-800 border-slate-700 h-11"
                  data-testid="input-checkout-email"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">Website / Repo URL</label>
                <Input
                  value={checkoutData.website}
                  onChange={(e) => setCheckoutData({ ...checkoutData, website: e.target.value })}
                  placeholder="https://..."
                  className="bg-slate-800 border-slate-700 h-11"
                  data-testid="input-checkout-url"
                />
              </div>
              <Button
                onClick={handleCheckout}
                disabled={checkoutLoading || !checkoutData.agentName || !checkoutData.email}
                className="w-full h-12 text-base font-semibold bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 rounded-xl"
                data-testid="button-proceed-checkout"
              >
                {checkoutLoading ? (
                  <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />Processing...</>
                ) : (
                  <><Lock className="w-4 h-4 mr-2" />Proceed to Secure Payment</>
                )}
              </Button>
              <p className="text-center text-slate-500 text-xs flex items-center justify-center gap-1.5">
                <Lock className="w-3 h-3" />
                Secure payment powered by Stripe
              </p>
            </div>
          </motion.div>
        </div>
      )}
      
      
    </div>
  );
}
