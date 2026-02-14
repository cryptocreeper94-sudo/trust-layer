import { motion } from "framer-motion";
import { Link } from "wouter";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { 
  Bot, Shield, ShieldCheck, Award, CheckCircle, Search,
  ExternalLink, Clock, TrendingUp, Filter, Layers,
  Sparkles, Users, BarChart3, Eye, Lock, Activity, AlertTriangle
} from "lucide-react";
import { GlassCard } from "@/components/glass-card";
import { usePageAnalytics } from "@/hooks/use-analytics";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

const AGENT_TYPE_ICONS: Record<string, typeof Bot> = {
  trading_bot: TrendingUp,
  defi_agent: Layers,
  nft_agent: Sparkles,
  social_agent: Users,
  analytics_agent: BarChart3,
  other: Bot,
};

const AGENT_TYPE_LABELS: Record<string, string> = {
  trading_bot: 'Trading Bot',
  defi_agent: 'DeFi Agent',
  nft_agent: 'NFT Agent',
  social_agent: 'Social Agent',
  analytics_agent: 'Analytics Agent',
  other: 'Other',
};

const TIER_BADGES: Record<string, { color: string; icon: typeof Shield }> = {
  basic: { color: 'cyan', icon: Shield },
  advanced: { color: 'purple', icon: ShieldCheck },
  enterprise: { color: 'pink', icon: Award },
};

function TrustScoreBar({ score, label }: { score: number; label: string }) {
  const getColor = (s: number) => {
    if (s >= 80) return 'bg-green-500';
    if (s >= 60) return 'bg-yellow-500';
    if (s >= 40) return 'bg-orange-500';
    return 'bg-red-500';
  };

  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs">
        <span className="text-slate-400">{label}</span>
        <span className="text-white font-medium">{score}/100</span>
      </div>
      <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
        <div 
          className={`h-full ${getColor(score)} rounded-full transition-all`}
          style={{ width: `${score}%` }}
        />
      </div>
    </div>
  );
}

export default function GuardianAIRegistry() {
  usePageAnalytics();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('all');

  const { data: agents, isLoading } = useQuery({
    queryKey: ['/api/guardian-ai/registry'],
    queryFn: async () => {
      const res = await fetch('/api/guardian-ai/registry');
      if (!res.ok) return [];
      return res.json();
    },
  });

  const filteredAgents = (agents || []).filter((agent: any) => {
    const matchesSearch = 
      agent.agentName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      agent.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === 'all' || agent.agentType === filterType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-12">
        {/* Header */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="p-3 bg-gradient-to-br from-cyan-500/20 to-purple-500/20 rounded-xl border border-cyan-500/30">
              <ShieldCheck className="w-8 h-8 text-cyan-400" />
            </div>
          </div>
          
          <h1 className="text-3xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
              Guardian AI Registry
            </span>
          </h1>
          
          <p className="text-slate-400 max-w-2xl mx-auto mb-8">
            Verified and certified AI agents you can trust. Each agent has undergone rigorous security 
            and behavioral analysis by Guardian's expert team.
          </p>

          <Link href="/guardian-ai">
            <Button className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600" data-testid="button-submit-yours">
              Submit Your Agent
            </Button>
          </Link>
        </motion.section>

        {/* Search and Filter */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <GlassCard className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search certified agents..."
                  className="pl-10 bg-slate-800 border-slate-700"
                  data-testid="input-search"
                />
              </div>
              
              <div className="flex gap-2 flex-wrap">
                <Button
                  variant={filterType === 'all' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilterType('all')}
                  className={filterType === 'all' ? 'bg-cyan-500' : 'border-slate-600'}
                  data-testid="filter-all"
                >
                  All
                </Button>
                {Object.entries(AGENT_TYPE_LABELS).map(([key, label]) => (
                  <Button
                    key={key}
                    variant={filterType === key ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setFilterType(key)}
                    className={filterType === key ? 'bg-purple-500' : 'border-slate-600'}
                    data-testid={`filter-${key}`}
                  >
                    {label}
                  </Button>
                ))}
              </div>
            </div>
          </GlassCard>
        </motion.section>

        {/* Registry Stats */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="mb-8"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <GlassCard className="p-4 text-center">
              <div className="text-2xl font-bold text-cyan-400">{filteredAgents.length}</div>
              <div className="text-sm text-slate-400">Certified Agents</div>
            </GlassCard>
            <GlassCard className="p-4 text-center">
              <div className="text-2xl font-bold text-green-400">
                {filteredAgents.filter((a: any) => a.overallTrustScore >= 80).length}
              </div>
              <div className="text-sm text-slate-400">High Trust Score</div>
            </GlassCard>
            <GlassCard className="p-4 text-center">
              <div className="text-2xl font-bold text-purple-400">
                {filteredAgents.filter((a: any) => a.certificationTier === 'enterprise').length}
              </div>
              <div className="text-sm text-slate-400">Enterprise Tier</div>
            </GlassCard>
            <GlassCard className="p-4 text-center">
              <div className="text-2xl font-bold text-pink-400">
                {new Set(filteredAgents.map((a: any) => a.chainDeployed)).size}
              </div>
              <div className="text-sm text-slate-400">Chains Covered</div>
            </GlassCard>
          </div>
        </motion.section>

        {/* Agent Cards */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <GlassCard key={i} className="p-6 animate-pulse">
                  <div className="h-12 bg-slate-700 rounded mb-4" />
                  <div className="h-4 bg-slate-700 rounded w-3/4 mb-2" />
                  <div className="h-4 bg-slate-700 rounded w-1/2" />
                </GlassCard>
              ))}
            </div>
          ) : filteredAgents.length === 0 ? (
            <GlassCard className="p-12 text-center">
              <Bot className="w-16 h-16 text-slate-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">No Certified Agents Yet</h3>
              <p className="text-slate-400 mb-6">
                Be among the first to get your AI agent certified and listed in the registry.
              </p>
              <Link href="/guardian-ai">
                <Button className="bg-gradient-to-r from-cyan-500 to-purple-500">
                  Submit Your Agent
                </Button>
              </Link>
            </GlassCard>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAgents.map((agent: any) => {
                const TypeIcon = AGENT_TYPE_ICONS[agent.agentType] || Bot;
                const tier = TIER_BADGES[agent.certificationTier] || TIER_BADGES.basic;
                const TierIcon = tier.icon;
                
                return (
                  <GlassCard 
                    key={agent.id} 
                    glow 
                    className="p-6 hover:border-cyan-500/50 transition-all cursor-pointer"
                    data-testid={`agent-card-${agent.id}`}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-cyan-500/20 rounded-lg">
                          <TypeIcon className="w-6 h-6 text-cyan-400" />
                        </div>
                        <div>
                          <h3 className="font-bold text-white">{agent.agentName}</h3>
                          {agent.agentSymbol && (
                            <span className="text-sm text-slate-400">${agent.agentSymbol}</span>
                          )}
                        </div>
                      </div>
                      <Badge className={`bg-${tier.color}-500/20 text-${tier.color}-300 border-${tier.color}-500/30`}>
                        <TierIcon className="w-3 h-3 mr-1" />
                        {agent.certificationTier}
                      </Badge>
                    </div>

                    <p className="text-slate-400 text-sm mb-4 line-clamp-2">
                      {agent.description}
                    </p>

                    {agent.overallTrustScore && (
                      <div className="mb-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-white">Trust Score</span>
                          <span className={`text-lg font-bold ${
                            agent.overallTrustScore >= 80 ? 'text-green-400' :
                            agent.overallTrustScore >= 60 ? 'text-yellow-400' : 'text-red-400'
                          }`}>
                            {agent.overallTrustScore}/100
                          </span>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          {agent.securityScore && (
                            <TrustScoreBar score={agent.securityScore} label="Security" />
                          )}
                          {agent.transparencyScore && (
                            <TrustScoreBar score={agent.transparencyScore} label="Transparency" />
                          )}
                          {agent.reliabilityScore && (
                            <TrustScoreBar score={agent.reliabilityScore} label="Reliability" />
                          )}
                          {agent.complianceScore && (
                            <TrustScoreBar score={agent.complianceScore} label="Compliance" />
                          )}
                        </div>
                      </div>
                    )}

                    <div className="flex items-center justify-between text-xs text-slate-400">
                      <div className="flex items-center gap-1">
                        <CheckCircle className="w-3 h-3 text-green-400" />
                        Certified {agent.certifiedAt ? new Date(agent.certifiedAt).toLocaleDateString() : ''}
                      </div>
                      {agent.chainDeployed && (
                        <span className="bg-slate-700 px-2 py-0.5 rounded">
                          {agent.chainDeployed}
                        </span>
                      )}
                    </div>

                    {agent.website && (
                      <a 
                        href={agent.website} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="mt-4 flex items-center gap-1 text-cyan-400 hover:text-cyan-300 text-sm"
                      >
                        <ExternalLink className="w-3 h-3" />
                        Visit Website
                      </a>
                    )}
                  </GlassCard>
                );
              })}
            </div>
          )}
        </motion.section>

        {/* Info Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-12"
        >
          <GlassCard className="p-8 bg-gradient-to-br from-slate-900/50 to-purple-900/20">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-bold text-white mb-4">What is Guardian AI Certification?</h3>
                <p className="text-slate-400 text-sm mb-4">
                  Guardian AI is the first comprehensive certification system for autonomous AI agents 
                  in the cryptocurrency space. We verify security, behavior, and trustworthiness so 
                  users can confidently interact with AI-powered trading bots, DeFi agents, and more.
                </p>
                <Link href="/guardian-ai">
                  <Button variant="outline" className="border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/10">
                    Learn More
                  </Button>
                </Link>
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-4">Certification Tiers</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Shield className="w-5 h-5 text-cyan-400" />
                    <div>
                      <span className="font-medium text-white">Basic</span>
                      <span className="text-slate-400 text-sm ml-2">Automated analysis & verification</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <ShieldCheck className="w-5 h-5 text-purple-400" />
                    <div>
                      <span className="font-medium text-white">Advanced</span>
                      <span className="text-slate-400 text-sm ml-2">Deep code review & testing</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Award className="w-5 h-5 text-pink-400" />
                    <div>
                      <span className="font-medium text-white">Enterprise</span>
                      <span className="text-slate-400 text-sm ml-2">Full audit & continuous monitoring</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </GlassCard>
        </motion.section>
      </main>
      
      
    </div>
  );
}