import { useState } from "react";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowLeft, Settings, Users, Shield, Database, Code, Rocket, 
  FileText, TrendingUp, DollarSign, BarChart3, Briefcase, Lock,
  ChevronDown, ChevronRight, Copy, Check, ExternalLink, Calculator,
  PieChart, Target, Zap, Layers, Globe
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { GlassCard } from "@/components/glass-card";
import { Footer } from "@/components/footer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import orbitLogo from "@assets/generated_images/futuristic_abstract_geometric_logo_symbol_for_orbit.png";

interface FinancialModel {
  founderSpots: number;
  founderPrice: number;
  dwtAirdrop: number;
  dwtPrice: number;
  operatingCosts: number;
  devCosts: number;
  marketingBudget: number;
  txFeePercent: number;
  avgDailyTxVolume: number;
}

const defaultModel: FinancialModel = {
  founderSpots: 10000,
  founderPrice: 24,
  dwtAirdrop: 35000,
  dwtPrice: 0.001,
  operatingCosts: 15000,
  devCosts: 25000,
  marketingBudget: 10000,
  txFeePercent: 0.3,
  avgDailyTxVolume: 1000000,
};

function FinancialCalculator() {
  const [model, setModel] = useState<FinancialModel>(defaultModel);

  const founderRevenue = model.founderSpots * model.founderPrice;
  const airdropValue = model.founderSpots * model.dwtAirdrop * model.dwtPrice;
  const monthlyTxFees = model.avgDailyTxVolume * (model.txFeePercent / 100) * 30;
  const monthlyRevenue = monthlyTxFees;
  const monthlyCosts = model.operatingCosts + model.devCosts + model.marketingBudget;
  const monthlyProfit = monthlyRevenue - monthlyCosts;
  const yearlyRevenue = monthlyRevenue * 12;
  const yearlyProfit = monthlyProfit * 12;

  const updateField = (field: keyof FinancialModel, value: number) => {
    setModel(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <GlassCard>
          <div className="p-4 space-y-3">
            <h4 className="font-semibold text-white flex items-center gap-2">
              <Users className="w-4 h-4 text-primary" />
              Founder Program
            </h4>
            <div className="space-y-2">
              <label className="text-xs text-muted-foreground">Spots Available</label>
              <Input 
                type="number" 
                value={model.founderSpots}
                onChange={(e) => updateField('founderSpots', parseInt(e.target.value) || 0)}
                className="bg-white/5 border-white/10"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs text-muted-foreground">Price per Spot ($)</label>
              <Input 
                type="number" 
                value={model.founderPrice}
                onChange={(e) => updateField('founderPrice', parseInt(e.target.value) || 0)}
                className="bg-white/5 border-white/10"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs text-muted-foreground">DWC Airdrop per Spot</label>
              <Input 
                type="number" 
                value={model.dwtAirdrop}
                onChange={(e) => updateField('dwtAirdrop', parseInt(e.target.value) || 0)}
                className="bg-white/5 border-white/10"
              />
            </div>
          </div>
        </GlassCard>

        <GlassCard>
          <div className="p-4 space-y-3">
            <h4 className="font-semibold text-white flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-secondary" />
              Transaction Fees
            </h4>
            <div className="space-y-2">
              <label className="text-xs text-muted-foreground">Fee Percentage (%)</label>
              <Input 
                type="number" 
                step="0.01"
                value={model.txFeePercent}
                onChange={(e) => updateField('txFeePercent', parseFloat(e.target.value) || 0)}
                className="bg-white/5 border-white/10"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs text-muted-foreground">Avg Daily TX Volume ($)</label>
              <Input 
                type="number" 
                value={model.avgDailyTxVolume}
                onChange={(e) => updateField('avgDailyTxVolume', parseInt(e.target.value) || 0)}
                className="bg-white/5 border-white/10"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs text-muted-foreground">DWC Token Price ($)</label>
              <Input 
                type="number" 
                step="0.0001"
                value={model.dwtPrice}
                onChange={(e) => updateField('dwtPrice', parseFloat(e.target.value) || 0)}
                className="bg-white/5 border-white/10"
              />
            </div>
          </div>
        </GlassCard>

        <GlassCard>
          <div className="p-4 space-y-3">
            <h4 className="font-semibold text-white flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-green-400" />
              Monthly Costs
            </h4>
            <div className="space-y-2">
              <label className="text-xs text-muted-foreground">Operating Costs ($)</label>
              <Input 
                type="number" 
                value={model.operatingCosts}
                onChange={(e) => updateField('operatingCosts', parseInt(e.target.value) || 0)}
                className="bg-white/5 border-white/10"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs text-muted-foreground">Development ($)</label>
              <Input 
                type="number" 
                value={model.devCosts}
                onChange={(e) => updateField('devCosts', parseInt(e.target.value) || 0)}
                className="bg-white/5 border-white/10"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs text-muted-foreground">Marketing ($)</label>
              <Input 
                type="number" 
                value={model.marketingBudget}
                onChange={(e) => updateField('marketingBudget', parseInt(e.target.value) || 0)}
                className="bg-white/5 border-white/10"
              />
            </div>
          </div>
        </GlassCard>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-primary/20 to-primary/5 border-primary/30 p-4">
          <p className="text-xs text-muted-foreground mb-1">Founder Revenue</p>
          <p className="text-2xl font-bold text-primary">${founderRevenue.toLocaleString()}</p>
        </Card>
        <Card className="bg-gradient-to-br from-secondary/20 to-secondary/5 border-secondary/30 p-4">
          <p className="text-xs text-muted-foreground mb-1">Monthly TX Fees</p>
          <p className="text-2xl font-bold text-secondary">${monthlyTxFees.toLocaleString()}</p>
        </Card>
        <Card className="bg-gradient-to-br from-green-500/20 to-green-500/5 border-green-500/30 p-4">
          <p className="text-xs text-muted-foreground mb-1">Monthly Profit</p>
          <p className={`text-2xl font-bold ${monthlyProfit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            ${monthlyProfit.toLocaleString()}
          </p>
        </Card>
        <Card className="bg-gradient-to-br from-cyan-500/20 to-cyan-500/5 border-cyan-500/30 p-4">
          <p className="text-xs text-muted-foreground mb-1">Yearly Profit</p>
          <p className={`text-2xl font-bold ${yearlyProfit >= 0 ? 'text-cyan-400' : 'text-red-400'}`}>
            ${yearlyProfit.toLocaleString()}
          </p>
        </Card>
      </div>

      <GlassCard className="border-amber-500/30">
        <div className="p-4">
          <h4 className="font-semibold text-amber-400 mb-2">Airdrop Liability</h4>
          <p className="text-sm text-muted-foreground">
            Total DWC to distribute: <span className="text-white font-bold">{(model.founderSpots * model.dwtAirdrop).toLocaleString()} DWC</span>
          </p>
          <p className="text-sm text-muted-foreground">
            Value at current price: <span className="text-white font-bold">${airdropValue.toLocaleString()}</span>
          </p>
        </div>
      </GlassCard>
    </div>
  );
}

function BusinessPlanSection() {
  return (
    <div className="space-y-6">
      <Accordion type="single" collapsible className="space-y-3">
        <AccordionItem value="mission" className="border border-white/10 rounded-xl overflow-hidden bg-white/[0.02]">
          <AccordionTrigger className="px-5 py-4 hover:no-underline hover:bg-white/5">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Target className="w-4 h-4 text-primary" />
              </div>
              <span className="font-semibold">Mission & Vision</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-5 pb-5">
            <div className="space-y-4 text-sm text-muted-foreground">
              <p><strong className="text-white">Mission:</strong> To democratize blockchain technology by providing a fast, secure, and user-friendly Layer 1 blockchain ecosystem that empowers developers and users worldwide.</p>
              <p><strong className="text-white">Vision:</strong> Become the leading blockchain platform for real-world applications by 2028, processing over 1 million transactions daily with sub-second finality.</p>
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">
                  <p className="text-xs text-primary mb-1">Core Values</p>
                  <ul className="text-xs space-y-1">
                    <li>• Speed & Efficiency</li>
                    <li>• Security First</li>
                    <li>• Developer Experience</li>
                    <li>• Community Driven</li>
                  </ul>
                </div>
                <div className="p-3 rounded-lg bg-secondary/5 border border-secondary/20">
                  <p className="text-xs text-secondary mb-1">Key Differentiators</p>
                  <ul className="text-xs space-y-1">
                    <li>• 400ms Block Time</li>
                    <li>• 200K+ TPS</li>
                    <li>• Hallmark Verification</li>
                    <li>• Multi-Chain Bridge</li>
                  </ul>
                </div>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="market" className="border border-white/10 rounded-xl overflow-hidden bg-white/[0.02]">
          <AccordionTrigger className="px-5 py-4 hover:no-underline hover:bg-white/5">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-secondary/10">
                <Globe className="w-4 h-4 text-secondary" />
              </div>
              <span className="font-semibold">Market Analysis</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-5 pb-5">
            <div className="space-y-4 text-sm text-muted-foreground">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="bg-white/5 border-white/10 p-4">
                  <p className="text-xs text-muted-foreground mb-1">Total Addressable Market</p>
                  <p className="text-xl font-bold text-white">$2.4T</p>
                  <p className="text-xs text-green-400">+23% YoY Growth</p>
                </Card>
                <Card className="bg-white/5 border-white/10 p-4">
                  <p className="text-xs text-muted-foreground mb-1">Serviceable Market</p>
                  <p className="text-xl font-bold text-white">$180B</p>
                  <p className="text-xs text-primary">L1 Blockchain Sector</p>
                </Card>
                <Card className="bg-white/5 border-white/10 p-4">
                  <p className="text-xs text-muted-foreground mb-1">Target Market</p>
                  <p className="text-xl font-bold text-white">$5B</p>
                  <p className="text-xs text-secondary">Fast Finality Chains</p>
                </Card>
              </div>
              <p><strong className="text-white">Competitive Landscape:</strong> Ethereum, Solana, Avalanche, and newer L1s compete for market share. DarkWave differentiates with PoA consensus, Hallmark verification, and integrated development tools.</p>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="revenue" className="border border-white/10 rounded-xl overflow-hidden bg-white/[0.02]">
          <AccordionTrigger className="px-5 py-4 hover:no-underline hover:bg-white/5">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-500/10">
                <DollarSign className="w-4 h-4 text-green-400" />
              </div>
              <span className="font-semibold">Revenue Model</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-5 pb-5">
            <div className="space-y-4 text-sm">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-lg bg-gradient-to-br from-primary/10 to-transparent border border-primary/20">
                  <h5 className="font-semibold text-primary mb-2">Primary Revenue</h5>
                  <ul className="text-muted-foreground space-y-2 text-xs">
                    <li className="flex justify-between"><span>Transaction Fees (0.3%)</span><span className="text-white">~$30K/mo</span></li>
                    <li className="flex justify-between"><span>DEX Swap Fees</span><span className="text-white">~$15K/mo</span></li>
                    <li className="flex justify-between"><span>NFT Marketplace (2.5%)</span><span className="text-white">~$10K/mo</span></li>
                    <li className="flex justify-between"><span>Bridge Fees</span><span className="text-white">~$5K/mo</span></li>
                  </ul>
                </div>
                <div className="p-4 rounded-lg bg-gradient-to-br from-secondary/10 to-transparent border border-secondary/20">
                  <h5 className="font-semibold text-secondary mb-2">Secondary Revenue</h5>
                  <ul className="text-muted-foreground space-y-2 text-xs">
                    <li className="flex justify-between"><span>Legacy Founder Program</span><span className="text-white">$240K (one-time)</span></li>
                    <li className="flex justify-between"><span>API Rate Limits (Pro)</span><span className="text-white">~$2K/mo</span></li>
                    <li className="flex justify-between"><span>Studio Pro Features</span><span className="text-white">~$3K/mo</span></li>
                    <li className="flex justify-between"><span>Enterprise Contracts</span><span className="text-white">TBD</span></li>
                  </ul>
                </div>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="roadmap" className="border border-white/10 rounded-xl overflow-hidden bg-white/[0.02]">
          <AccordionTrigger className="px-5 py-4 hover:no-underline hover:bg-white/5">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-cyan-500/10">
                <Layers className="w-4 h-4 text-cyan-400" />
              </div>
              <span className="font-semibold">Development Roadmap</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-5 pb-5">
            <div className="space-y-4">
              <div className="relative pl-4 border-l border-primary/30 space-y-6">
                <div className="relative">
                  <div className="absolute -left-[21px] w-4 h-4 rounded-full bg-green-500 border-2 border-background" />
                  <div>
                    <Badge className="bg-green-500/20 text-green-400 mb-2">Completed</Badge>
                    <h5 className="font-semibold text-white">Q4 2024 - Foundation</h5>
                    <p className="text-xs text-muted-foreground">Core blockchain, portal, DEX, staking, NFT marketplace</p>
                  </div>
                </div>
                <div className="relative">
                  <div className="absolute -left-[21px] w-4 h-4 rounded-full bg-primary border-2 border-background animate-pulse" />
                  <div>
                    <Badge className="bg-primary/20 text-primary mb-2">In Progress</Badge>
                    <h5 className="font-semibold text-white">Q1 2026 - Launch</h5>
                    <p className="text-xs text-muted-foreground">Mainnet launch, bridge deployment, founder program</p>
                  </div>
                </div>
                <div className="relative">
                  <div className="absolute -left-[21px] w-4 h-4 rounded-full bg-white/20 border-2 border-background" />
                  <div>
                    <Badge variant="outline" className="mb-2">Planned</Badge>
                    <h5 className="font-semibold text-white">Q2 2026 - Growth</h5>
                    <p className="text-xs text-muted-foreground">Mobile wallet, governance DAO, enterprise partnerships</p>
                  </div>
                </div>
                <div className="relative">
                  <div className="absolute -left-[21px] w-4 h-4 rounded-full bg-white/20 border-2 border-background" />
                  <div>
                    <Badge variant="outline" className="mb-2">Planned</Badge>
                    <h5 className="font-semibold text-white">Q3-Q4 2026 - Scale</h5>
                    <p className="text-xs text-muted-foreground">Cross-chain expansion, DEX aggregation, institutional tools</p>
                  </div>
                </div>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}

function ExecutiveSummary() {
  return (
    <div className="space-y-6">
      <GlassCard className="border-primary/30">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 rounded-xl bg-primary/10 border border-primary/30">
              <Briefcase className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">DarkWave Smart Chain</h3>
              <p className="text-sm text-muted-foreground">Executive Summary</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-semibold text-primary mb-2">The Opportunity</h4>
                <p className="text-sm text-muted-foreground">
                  The blockchain industry continues to struggle with the trilemma of speed, security, and decentralization. 
                  DarkWave Smart Chain addresses this with a Proof-of-Authority consensus that delivers 400ms block times and 
                  200,000+ TPS while maintaining security through trusted validator committees.
                </p>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-secondary mb-2">The Solution</h4>
                <p className="text-sm text-muted-foreground">
                  A complete blockchain ecosystem including: Layer 1 blockchain, multi-chain wallet, DEX, staking platform, 
                  NFT marketplace, token launchpad, cross-chain bridge, and integrated development tools. 
                  All unified under the Hallmark verification system for trust and authenticity.
                </p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-semibold text-green-400 mb-2">Traction</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Full blockchain implementation complete</li>
                  <li>• 15+ DeFi features operational</li>
                  <li>• Cross-chain bridge ready for deployment</li>
                  <li>• Developer portal & Studio IDE live</li>
                </ul>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-cyan-400 mb-2">Launch Strategy</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• February 14, 2026: Public mainnet launch</li>
                  <li>• 10,000 Legacy Founder spots ($24 each)</li>
                  <li>• 35,000 DWC airdrop per founder</li>
                  <li>• Community-driven growth</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </GlassCard>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-white/5 border-white/10 p-4 text-center">
          <Zap className="w-8 h-8 text-primary mx-auto mb-2" />
          <p className="text-2xl font-bold text-white">400ms</p>
          <p className="text-xs text-muted-foreground">Block Time</p>
        </Card>
        <Card className="bg-white/5 border-white/10 p-4 text-center">
          <TrendingUp className="w-8 h-8 text-secondary mx-auto mb-2" />
          <p className="text-2xl font-bold text-white">200K+</p>
          <p className="text-xs text-muted-foreground">TPS Capacity</p>
        </Card>
        <Card className="bg-white/5 border-white/10 p-4 text-center">
          <Shield className="w-8 h-8 text-green-400 mx-auto mb-2" />
          <p className="text-2xl font-bold text-white">100M</p>
          <p className="text-xs text-muted-foreground">DWC Supply</p>
        </Card>
        <Card className="bg-white/5 border-white/10 p-4 text-center">
          <Globe className="w-8 h-8 text-cyan-400 mx-auto mb-2" />
          <p className="text-2xl font-bold text-white">9+</p>
          <p className="text-xs text-muted-foreground">Chains Supported</p>
        </Card>
      </div>
    </div>
  );
}

function AdminLinksGrid() {
  const adminLinks = [
    { title: "DarkWave Studio", href: "/studio", icon: Code, description: "Web IDE and development environment", color: "primary" },
    { title: "Developer Portal", href: "/developer-portal", icon: Shield, description: "API keys and analytics", color: "secondary" },
    { title: "Treasury", href: "/treasury", icon: Database, description: "Token treasury management", color: "green" },
    { title: "Billing Admin", href: "/billing", icon: Settings, description: "Subscriptions and payments", color: "cyan" },
    { title: "Block Explorer", href: "/explorer", icon: Rocket, description: "Blockchain explorer", color: "primary" },
    { title: "Validators", href: "/validators", icon: Shield, description: "Network validators", color: "secondary" },
    { title: "Multi-Sig", href: "/multisig", icon: Lock, description: "Committee management", color: "amber" },
    { title: "Proof of Reserve", href: "/proof-of-reserve", icon: BarChart3, description: "Reserve verification", color: "green" },
  ];

  const colorClasses: Record<string, string> = {
    primary: "bg-primary/10 text-primary",
    secondary: "bg-secondary/10 text-secondary",
    green: "bg-green-500/10 text-green-400",
    cyan: "bg-cyan-500/10 text-cyan-400",
    amber: "bg-amber-500/10 text-amber-400",
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
      {adminLinks.map((link) => (
        <Link key={link.href} href={link.href}>
          <motion.div
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            className="h-full"
          >
            <GlassCard hover className="h-full">
              <div className="p-4 flex items-center gap-3">
                <div className={`p-2 rounded-lg ${colorClasses[link.color]}`}>
                  <link.icon className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <h3 className="font-semibold text-white text-sm truncate">{link.title}</h3>
                  <p className="text-xs text-muted-foreground truncate">{link.description}</p>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        </Link>
      ))}
    </div>
  );
}

export default function Team() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-background/90 backdrop-blur-xl">
        <div className="container mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <img src={orbitLogo} alt="DarkWave" className="w-7 h-7" />
            <span className="font-display font-bold text-lg tracking-tight">DarkWave</span>
          </Link>
          <Link href="/">
            <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground hover:text-white">
              <ArrowLeft className="w-4 h-4" /> Home
            </Button>
          </Link>
        </div>
      </nav>

      <main className="pt-20 pb-12 px-4 flex-1">
        <div className="container max-w-6xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm mb-4">
                <Lock className="w-4 h-4" />
                <span>Authenticated Access</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-display font-bold mb-2">Admin Dashboard</h1>
              <p className="text-muted-foreground">DarkWave Smart Chain Command Center</p>
            </div>

            <Tabs defaultValue="overview" className="space-y-6">
              <div className="overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
                <TabsList className="bg-white/5 border border-white/10 p-1 inline-flex min-w-max">
                  <TabsTrigger value="overview" className="gap-2 data-[state=active]:bg-primary/20 data-[state=active]:text-primary">
                    <Layers className="w-4 h-4" />
                    <span className="hidden sm:inline">Overview</span>
                  </TabsTrigger>
                  <TabsTrigger value="executive" className="gap-2 data-[state=active]:bg-primary/20 data-[state=active]:text-primary">
                    <Briefcase className="w-4 h-4" />
                    <span className="hidden sm:inline">Executive Summary</span>
                  </TabsTrigger>
                  <TabsTrigger value="business" className="gap-2 data-[state=active]:bg-primary/20 data-[state=active]:text-primary">
                    <FileText className="w-4 h-4" />
                    <span className="hidden sm:inline">Business Plan</span>
                  </TabsTrigger>
                  <TabsTrigger value="financial" className="gap-2 data-[state=active]:bg-primary/20 data-[state=active]:text-primary">
                    <Calculator className="w-4 h-4" />
                    <span className="hidden sm:inline">Financial Model</span>
                  </TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="overview" className="space-y-6">
                <AdminLinksGrid />
              </TabsContent>

              <TabsContent value="executive" className="space-y-6">
                <ExecutiveSummary />
              </TabsContent>

              <TabsContent value="business" className="space-y-6">
                <BusinessPlanSection />
              </TabsContent>

              <TabsContent value="financial" className="space-y-6">
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-white mb-2">Interactive Financial Model</h3>
                  <p className="text-sm text-muted-foreground">Adjust the numbers below to see how different scenarios affect revenue and profitability.</p>
                </div>
                <FinancialCalculator />
              </TabsContent>
            </Tabs>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
