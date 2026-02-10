import { motion } from "framer-motion";
import { Link } from "wouter";
import { useState, type FormEvent } from "react";
import { 
  Bot, Shield, ShieldCheck, Award, CheckCircle, Star, Zap,
  ExternalLink, Clock, Users, Target, Lock, Eye, Brain,
  Sparkles, TrendingUp, Building, Code, Server, Database,
  BadgeCheck, Layers, Activity, FileCheck, AlertTriangle,
  Calendar, Rocket, UserCheck, Mail, Send, ChevronRight,
  Cpu, Network, BarChart3, Fingerprint, Globe, Bug
} from "lucide-react";
import { BackButton } from "@/components/page-nav";
import { Footer } from "@/components/footer";
import { GlassCard } from "@/components/glass-card";
import { HeaderTools } from "@/components/header-tools";
import { usePageAnalytics } from "@/hooks/use-analytics";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";

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
    id: 'basic',
    name: 'Guardian Basic',
    tagline: 'Essential Trust Verification',
    price: '$999',
    priceNote: 'One-time certification',
    features: [
      'Automated behavioral analysis',
      'Basic security scan',
      'Transaction pattern review',
      'Public registry listing',
      'Guardian AI badge',
      '6-month certification validity',
    ],
    highlight: false,
    icon: Shield,
    color: 'cyan',
    duration: '3-5 days',
  },
  {
    id: 'advanced',
    name: 'Guardian Advanced',
    tagline: 'Comprehensive Trust Assessment',
    price: '$4,999',
    priceNote: 'Full audit cycle',
    features: [
      'Everything in Basic',
      'Deep code review',
      'API security assessment',
      'Economic attack simulation',
      'Detailed trust scorecard',
      'Priority support',
      '12-month certification validity',
    ],
    highlight: true,
    icon: ShieldCheck,
    color: 'purple',
    duration: '1-2 weeks',
  },
  {
    id: 'enterprise',
    name: 'Guardian Enterprise',
    tagline: 'Maximum Trust Assurance',
    price: '$14,999',
    priceNote: 'Complete certification',
    features: [
      'Everything in Advanced',
      'Full source code audit',
      'Penetration testing',
      'Formal verification',
      'Custom compliance review',
      'Dedicated security analyst',
      'Guardian Shield monitoring',
      '24-month certification validity',
    ],
    highlight: false,
    icon: Award,
    color: 'pink',
    duration: '3-4 weeks',
  },
];

const TRUST_METRICS = [
  { 
    name: 'Security Score',
    description: 'Code integrity, vulnerability assessment, access control analysis',
    icon: Lock,
  },
  { 
    name: 'Transparency Score',
    description: 'Open source status, documentation quality, audit history',
    icon: Eye,
  },
  { 
    name: 'Reliability Score',
    description: 'Uptime history, error handling, edge case management',
    icon: Activity,
  },
  { 
    name: 'Compliance Score',
    description: 'Regulatory alignment, data handling, user consent mechanisms',
    icon: FileCheck,
  },
];

const WHY_CERTIFY = [
  {
    icon: Shield,
    title: 'Build User Trust',
    description: 'Users can verify your agent is safe before granting access to their wallets and funds.',
  },
  {
    icon: TrendingUp,
    title: 'Increase Adoption',
    description: 'Certified agents see 3x higher adoption rates versus uncertified competitors.',
  },
  {
    icon: Globe,
    title: 'Public Registry',
    description: 'Featured listing in the Guardian AI registry reaches thousands of potential users.',
  },
  {
    icon: BadgeCheck,
    title: 'Verified Badge',
    description: 'Display the Guardian AI Certified badge on your site, app, and marketing materials.',
  },
];

const MARKET_STATS = [
  { value: '21,000+', label: 'AI Agent Tokens Launched', sublabel: 'November 2024 alone' },
  { value: '1M+', label: 'Projected On-Chain Agents', sublabel: 'By end of 2025' },
  { value: '$50.5B', label: 'AI Crypto Market Cap', sublabel: 'Peak 2025' },
  { value: '0', label: 'Certified AI Agents', sublabel: 'Industry-wide (until now)' },
];

export default function GuardianAI() {
  usePageAnalytics();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedTier, setSelectedTier] = useState<string>('advanced');
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
        body: JSON.stringify({
          ...formData,
          certificationTier: selectedTier,
        }),
      });

      if (response.ok) {
        toast({
          title: "Application Submitted",
          description: "We'll review your AI agent and contact you within 48 hours.",
        });
        setFormData({
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
      } else {
        throw new Error('Submission failed');
      }
    } catch (error) {
      toast({
        title: "Submission Failed",
        description: "Please try again or contact support.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <HeaderTools />
      
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-12">
        <BackButton />
        
        {/* Hero Section */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="p-4 bg-gradient-to-br from-cyan-500/20 to-purple-500/20 rounded-2xl border border-cyan-500/30">
              <Bot className="w-12 h-12 text-cyan-400" />
            </div>
            <div className="p-4 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-2xl border border-purple-500/30">
              <Shield className="w-12 h-12 text-purple-400" />
            </div>
          </div>
          
          <Badge className="mb-4 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 text-cyan-300 border-cyan-500/30">
            First-of-its-Kind Certification
          </Badge>
          
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Guardian AI
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-slate-300 max-w-3xl mx-auto mb-4">
            The Trust Layer for Autonomous AI Agents
          </p>
          
          <p className="text-slate-400 max-w-2xl mx-auto mb-8">
            With millions of AI agents entering crypto, users have no way to know which ones to trust.
            Guardian AI is the first certification system for AI trading bots, DeFi agents, and autonomous systems.
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <Dialog>
              <DialogTrigger asChild>
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600"
                  data-testid="button-submit-agent"
                >
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
                  <DialogDescription className="text-slate-400">
                    Complete the form below to begin the certification process.
                  </DialogDescription>
                </DialogHeader>
                
                <form onSubmit={handleSubmit} className="space-y-6 mt-4">
                  {/* Tier Selection */}
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-3">
                      Select Certification Tier
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      {CERTIFICATION_TIERS.map((tier) => (
                        <button
                          key={tier.id}
                          type="button"
                          onClick={() => setSelectedTier(tier.id)}
                          className={`p-4 rounded-xl border text-left transition-all ${
                            selectedTier === tier.id
                              ? 'border-cyan-500 bg-cyan-500/10'
                              : 'border-slate-700 bg-slate-800/50 hover:border-slate-600'
                          }`}
                          data-testid={`tier-${tier.id}`}
                        >
                          <tier.icon className={`w-6 h-6 mb-2 ${
                            selectedTier === tier.id ? 'text-cyan-400' : 'text-slate-400'
                          }`} />
                          <div className="font-medium text-white text-sm">{tier.name}</div>
                          <div className="text-cyan-400 font-bold">{tier.price}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Agent Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-1">
                        Agent Name *
                      </label>
                      <Input
                        required
                        value={formData.agentName}
                        onChange={(e) => setFormData({ ...formData, agentName: e.target.value })}
                        placeholder="e.g., AlphaTrader AI"
                        className="bg-slate-800 border-slate-700"
                        data-testid="input-agent-name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-1">
                        Agent Symbol
                      </label>
                      <Input
                        value={formData.agentSymbol}
                        onChange={(e) => setFormData({ ...formData, agentSymbol: e.target.value })}
                        placeholder="e.g., ALPHA"
                        className="bg-slate-800 border-slate-700"
                        data-testid="input-agent-symbol"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Agent Type *
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {AGENT_TYPES.map((type) => (
                        <button
                          key={type.id}
                          type="button"
                          onClick={() => setFormData({ ...formData, agentType: type.id })}
                          className={`p-3 rounded-lg border flex items-center gap-2 transition-all ${
                            formData.agentType === type.id
                              ? 'border-purple-500 bg-purple-500/10'
                              : 'border-slate-700 bg-slate-800/50 hover:border-slate-600'
                          }`}
                          data-testid={`type-${type.id}`}
                        >
                          <type.icon className={`w-4 h-4 ${
                            formData.agentType === type.id ? 'text-purple-400' : 'text-slate-400'
                          }`} />
                          <span className="text-sm text-white">{type.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">
                      Description *
                    </label>
                    <Textarea
                      required
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Describe what your AI agent does, its capabilities, and target use cases..."
                      className="bg-slate-800 border-slate-700 min-h-[100px]"
                      data-testid="input-description"
                    />
                  </div>

                  {/* Developer Info */}
                  <div className="border-t border-slate-700 pt-4">
                    <h4 className="text-sm font-medium text-slate-300 mb-3">Developer Information</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1">
                          Your Name *
                        </label>
                        <Input
                          required
                          value={formData.developerName}
                          onChange={(e) => setFormData({ ...formData, developerName: e.target.value })}
                          placeholder="Full name"
                          className="bg-slate-800 border-slate-700"
                          data-testid="input-developer-name"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1">
                          Email *
                        </label>
                        <Input
                          required
                          type="email"
                          value={formData.developerEmail}
                          onChange={(e) => setFormData({ ...formData, developerEmail: e.target.value })}
                          placeholder="you@company.com"
                          className="bg-slate-800 border-slate-700"
                          data-testid="input-developer-email"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Technical Info */}
                  <div className="border-t border-slate-700 pt-4">
                    <h4 className="text-sm font-medium text-slate-300 mb-3">Technical Details (Optional)</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1">
                          Website
                        </label>
                        <Input
                          value={formData.website}
                          onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                          placeholder="https://..."
                          className="bg-slate-800 border-slate-700"
                          data-testid="input-website"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1">
                          GitHub Repository
                        </label>
                        <Input
                          value={formData.githubRepo}
                          onChange={(e) => setFormData({ ...formData, githubRepo: e.target.value })}
                          placeholder="https://github.com/..."
                          className="bg-slate-800 border-slate-700"
                          data-testid="input-github"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1">
                          Contract Address
                        </label>
                        <Input
                          value={formData.contractAddress}
                          onChange={(e) => setFormData({ ...formData, contractAddress: e.target.value })}
                          placeholder="0x..."
                          className="bg-slate-800 border-slate-700"
                          data-testid="input-contract"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1">
                          Chain Deployed
                        </label>
                        <Input
                          value={formData.chainDeployed}
                          onChange={(e) => setFormData({ ...formData, chainDeployed: e.target.value })}
                          placeholder="e.g., Ethereum, Solana, Base"
                          className="bg-slate-800 border-slate-700"
                          data-testid="input-chain"
                        />
                      </div>
                    </div>
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600"
                    disabled={isSubmitting}
                    data-testid="button-submit-form"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-2" />
                        Submit for Certification
                      </>
                    )}
                  </Button>
                </form>
              </DialogContent>
            </Dialog>

            <Link href="/guardian-ai-registry">
              <Button variant="outline" size="lg" className="border-slate-600 hover:bg-slate-800" data-testid="button-view-registry">
                <Eye className="w-5 h-5 mr-2" />
                View Certified Agents
              </Button>
            </Link>
          </div>
        </motion.section>

        {/* Market Crisis Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-16"
        >
          <GlassCard glow className="p-10 md:p-12 border-red-500/20 bg-gradient-to-br from-red-900/10 to-slate-900/50">
            <div className="flex items-center gap-4 mb-8">
              <AlertTriangle className="w-8 h-8 text-red-400 shrink-0" />
              <h2 className="text-2xl md:text-3xl font-bold text-white">The AI Agent Trust Crisis</h2>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
              {MARKET_STATS.map((stat, i) => (
                <div key={i} className="text-center p-4">
                  <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">
                    {stat.value}
                  </div>
                  <div className="text-sm text-white font-medium mt-2">{stat.label}</div>
                  <div className="text-xs text-slate-400 mt-1">{stat.sublabel}</div>
                </div>
              ))}
            </div>

            <p className="text-slate-300 text-lg leading-relaxed">
              The AI agent explosion has created a wild west where <strong className="text-red-400">rug pulls, malicious bots, and fake agents</strong> are rampant.
              Users have no way to verify which agents are safe. That ends now.
            </p>
          </GlassCard>
        </motion.section>

        {/* Why Certify Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-16"
        >
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">
            Why Get <span className="text-cyan-400">Guardian AI</span> Certified?
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {WHY_CERTIFY.map((item, i) => (
              <GlassCard key={i} glow className="p-8">
                <item.icon className="w-10 h-10 text-cyan-400 mb-5" />
                <h3 className="text-lg font-semibold text-white mb-3">{item.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{item.description}</p>
              </GlassCard>
            ))}
          </div>
        </motion.section>

        {/* Trust Metrics Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="mb-16"
        >
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-4">
            Comprehensive <span className="text-purple-400">Trust Scoring</span>
          </h2>
          <p className="text-slate-400 text-center max-w-2xl mx-auto mb-8">
            Every certified agent receives a detailed trust scorecard across four key dimensions.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {TRUST_METRICS.map((metric, i) => (
              <GlassCard key={i} className="p-8 border-purple-500/20">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 bg-purple-500/20 rounded-lg">
                    <metric.icon className="w-5 h-5 text-purple-400" />
                  </div>
                  <h3 className="font-semibold text-white">{metric.name}</h3>
                </div>
                <p className="text-slate-400 text-sm leading-relaxed">{metric.description}</p>
              </GlassCard>
            ))}
          </div>
        </motion.section>

        {/* Certification Tiers */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-16"
        >
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-4">
            Certification <span className="text-pink-400">Tiers</span>
          </h2>
          <p className="text-slate-400 text-center max-w-2xl mx-auto mb-8">
            Choose the level of verification that matches your agent's needs and market position.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {CERTIFICATION_TIERS.map((tier, i) => (
              <GlassCard 
                key={tier.id} 
                glow={tier.highlight}
                className={`p-8 relative ${tier.highlight ? 'border-purple-500/50' : ''}`}
              >
                {tier.highlight && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0 px-4 py-1">
                      Most Popular
                    </Badge>
                  </div>
                )}
                
                <div className={`p-3 bg-${tier.color}-500/20 rounded-xl w-fit mb-5`}>
                  <tier.icon className={`w-8 h-8 text-${tier.color}-400`} />
                </div>
                
                <h3 className="text-xl font-bold text-white mb-2">{tier.name}</h3>
                <p className="text-slate-400 text-sm mb-5">{tier.tagline}</p>
                
                <div className="mb-6">
                  <span className={`text-3xl font-bold text-${tier.color}-400`}>{tier.price}</span>
                  <span className="text-slate-400 text-sm ml-2">{tier.priceNote}</span>
                </div>

                <div className="flex items-center gap-2 text-slate-400 text-sm mb-5">
                  <Clock className="w-4 h-4" />
                  <span>{tier.duration}</span>
                </div>
                
                <ul className="space-y-3 mb-8">
                  {tier.features.map((feature, j) => (
                    <li key={j} className="flex items-start gap-3 text-sm text-slate-300">
                      <CheckCircle className={`w-4 h-4 text-${tier.color}-400 mt-0.5 shrink-0`} />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <Dialog>
                  <DialogTrigger asChild>
                    <Button 
                      className={`w-full ${tier.highlight 
                        ? 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600' 
                        : 'bg-slate-700 hover:bg-slate-600'
                      }`}
                      onClick={() => setSelectedTier(tier.id)}
                      data-testid={`button-select-${tier.id}`}
                    >
                      Select {tier.name}
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-slate-900 border-slate-700 max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle className="text-2xl text-white flex items-center gap-2">
                        <Bot className="w-6 h-6 text-cyan-400" />
                        Submit AI Agent for Certification
                      </DialogTitle>
                      <DialogDescription className="text-slate-400">
                        Complete the form below to begin the certification process.
                      </DialogDescription>
                    </DialogHeader>
                    
                    <form onSubmit={handleSubmit} className="space-y-6 mt-4">
                      <div className="p-4 rounded-xl border border-cyan-500/30 bg-cyan-500/10">
                        <div className="flex items-center gap-3">
                          <tier.icon className="w-6 h-6 text-cyan-400" />
                          <div>
                            <div className="font-medium text-white">{tier.name}</div>
                            <div className="text-cyan-400 font-bold">{tier.price}</div>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-slate-300 mb-1">
                            Agent Name *
                          </label>
                          <Input
                            required
                            value={formData.agentName}
                            onChange={(e) => setFormData({ ...formData, agentName: e.target.value })}
                            placeholder="e.g., AlphaTrader AI"
                            className="bg-slate-800 border-slate-700"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-300 mb-1">
                            Your Email *
                          </label>
                          <Input
                            required
                            type="email"
                            value={formData.developerEmail}
                            onChange={(e) => setFormData({ ...formData, developerEmail: e.target.value })}
                            placeholder="you@company.com"
                            className="bg-slate-800 border-slate-700"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1">
                          Description *
                        </label>
                        <Textarea
                          required
                          value={formData.description}
                          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                          placeholder="Describe what your AI agent does..."
                          className="bg-slate-800 border-slate-700 min-h-[80px]"
                        />
                      </div>

                      <Button 
                        type="submit" 
                        className="w-full bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? 'Submitting...' : 'Submit for Certification'}
                      </Button>
                    </form>
                  </DialogContent>
                </Dialog>
              </GlassCard>
            ))}
          </div>
        </motion.section>

        {/* Use Cases */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="mb-16"
        >
          <GlassCard glow className="p-10 md:p-12">
            <h2 className="text-2xl font-bold text-center mb-10">
              Trusted by <span className="text-cyan-400">Businesses</span>
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="p-8 bg-slate-800/50 rounded-xl border border-slate-700">
                <div className="flex items-center gap-4 mb-5">
                  <Building className="w-8 h-8 text-cyan-400 shrink-0" />
                  <div>
                    <h3 className="font-bold text-white">Nashville Painting Professionals</h3>
                    <p className="text-sm text-slate-400 mt-1">Trust Layer Partner</p>
                  </div>
                </div>
                <p className="text-slate-300 text-sm leading-relaxed">
                  "The Guardian certification gave our clients confidence that our automated scheduling 
                  and payment systems are secure and reliable."
                </p>
              </div>
              
              <div className="p-8 bg-slate-800/50 rounded-xl border border-slate-700">
                <div className="flex items-center gap-4 mb-5">
                  <Code className="w-8 h-8 text-purple-400 shrink-0" />
                  <div>
                    <h3 className="font-bold text-white">Loom</h3>
                    <p className="text-sm text-slate-400 mt-1">Trust Layer Partner</p>
                  </div>
                </div>
                <p className="text-slate-300 text-sm leading-relaxed">
                  "Trust Layer's verification infrastructure ensures our enterprise clients can 
                  trust every automated workflow and API integration."
                </p>
              </div>
            </div>
          </GlassCard>
        </motion.section>

        {/* CTA Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-center"
        >
          <GlassCard glow className="p-10 md:p-16 bg-gradient-to-br from-cyan-900/20 via-purple-900/20 to-pink-900/20">
            <h2 className="text-2xl md:text-3xl font-bold mb-6">
              Be Among the First <span className="text-cyan-400">Certified AI Agents</span>
            </h2>
            <p className="text-slate-300 mb-10 max-w-2xl mx-auto leading-relaxed">
              Early certification means prime positioning in our registry, featured placement, 
              and recognition as an industry leader in AI agent safety.
            </p>
            
            <Dialog>
              <DialogTrigger asChild>
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600"
                  data-testid="button-cta-submit"
                >
                  <Rocket className="w-5 h-5 mr-2" />
                  Start Certification Now
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-slate-900 border-slate-700 max-w-2xl">
                <DialogHeader>
                  <DialogTitle className="text-xl text-white">Quick Inquiry</DialogTitle>
                  <DialogDescription className="text-slate-400">
                    Tell us about your AI agent and we'll reach out within 24 hours.
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                  <Input
                    required
                    value={formData.agentName}
                    onChange={(e) => setFormData({ ...formData, agentName: e.target.value })}
                    placeholder="Agent Name"
                    className="bg-slate-800 border-slate-700"
                  />
                  <Input
                    required
                    type="email"
                    value={formData.developerEmail}
                    onChange={(e) => setFormData({ ...formData, developerEmail: e.target.value })}
                    placeholder="Your Email"
                    className="bg-slate-800 border-slate-700"
                  />
                  <Textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Brief description of your AI agent..."
                    className="bg-slate-800 border-slate-700"
                  />
                  <Button 
                    type="submit" 
                    className="w-full bg-gradient-to-r from-cyan-500 to-purple-500"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Sending...' : 'Submit Inquiry'}
                  </Button>
                </form>
              </DialogContent>
            </Dialog>

            <div className="flex flex-wrap justify-center gap-10 mt-10">
              <Link href="/guardian-whitepaper">
                <span className="text-slate-400 hover:text-cyan-400 transition-colors flex items-center gap-2">
                  <FileCheck className="w-4 h-4" />
                  Security Whitepaper
                </span>
              </Link>
              <Link href="/guardian-certification">
                <span className="text-slate-400 hover:text-cyan-400 transition-colors flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  Smart Contract Audits
                </span>
              </Link>
              <Link href="/security">
                <span className="text-slate-400 hover:text-cyan-400 transition-colors flex items-center gap-2">
                  <Lock className="w-4 h-4" />
                  Security Overview
                </span>
              </Link>
            </div>
          </GlassCard>
        </motion.section>
      </main>
      
      <Footer />
    </div>
  );
}