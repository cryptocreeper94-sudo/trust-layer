import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import {
  Bot,
  Brain,
  Cpu,
  Sparkles,
  TrendingUp,
  Zap,
  Target,
  BarChart3,
  Wallet,
  Play,
  Star,
  Shield,
  Users,
  Activity,
  Code,
  MessageSquare,
  ChevronRight,
  CheckCircle,
  Plus
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import { GlassCard, StatCard } from "@/components/glass-card";

const categoryIcons: Record<string, any> = {
  trading: TrendingUp,
  portfolio: Wallet,
  quest: Target,
  social: MessageSquare,
  analytics: BarChart3,
  custom: Code
};

const categoryGradients: Record<string, string> = {
  trading: "from-green-500 to-emerald-600",
  portfolio: "from-blue-500 to-cyan-600",
  quest: "from-amber-500 to-orange-600",
  social: "from-pink-500 to-rose-600",
  analytics: "from-purple-500 to-violet-600",
  custom: "from-slate-500 to-slate-600"
};

export default function AIAgentMarketplace() {
  const { data: agents, isLoading } = useQuery({
    queryKey: ["/api/ai-agents"],
    queryFn: async () => {
      const res = await fetch("/api/ai-agents");
      return res.json();
    }
  });

  const { data: stats } = useQuery({
    queryKey: ["/api/ai-agents/stats"],
    queryFn: async () => {
      const res = await fetch("/api/ai-agents/stats");
      return res.json();
    }
  });

  const featuredAgents = [
    {
      id: "alpha-trader",
      name: "Alpha Trader Pro",
      category: "trading",
      description: "AI-powered trading agent that analyzes market signals and executes trades automatically",
      pricePerExecution: "1000000000000000000",
      totalExecutions: 15420,
      rating: "4.8",
      verified: true,
      featured: true
    },
    {
      id: "portfolio-guardian",
      name: "Portfolio Guardian",
      category: "portfolio",
      description: "Monitors your portfolio 24/7 and rebalances based on risk parameters",
      pricePerExecution: "500000000000000000",
      totalExecutions: 8930,
      rating: "4.6",
      verified: true,
      featured: true
    },
    {
      id: "quest-master",
      name: "Quest Master",
      category: "quest",
      description: "Completes daily quests automatically to maximize your Shell earnings",
      pricePerExecution: "250000000000000000",
      totalExecutions: 24100,
      rating: "4.9",
      verified: true,
      featured: true
    },
    {
      id: "social-sentinel",
      name: "Social Sentinel",
      category: "social",
      description: "Monitors social channels and alerts you to important community updates",
      pricePerExecution: "100000000000000000",
      totalExecutions: 12500,
      rating: "4.5",
      verified: true,
      featured: false
    },
    {
      id: "data-oracle",
      name: "Data Oracle",
      category: "analytics",
      description: "Advanced on-chain analytics with predictive insights and trend detection",
      pricePerExecution: "750000000000000000",
      totalExecutions: 6780,
      rating: "4.7",
      verified: true,
      featured: true
    },
    {
      id: "custom-agent",
      name: "DeFi Strategist",
      category: "custom",
      description: "Custom yield farming optimizer that finds the best APY opportunities",
      pricePerExecution: "2000000000000000000",
      totalExecutions: 3240,
      rating: "4.4",
      verified: false,
      featured: false
    }
  ];

  const displayAgents = agents?.agents?.length > 0 ? agents.agents : featuredAgents;

  const formatPrice = (wei: string) => {
    const sig = parseFloat(wei) / 1e18;
    return sig < 1 ? `${(sig * 1000).toFixed(0)} mSIG` : `${sig.toFixed(2)} SIG`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 right-1/3 w-[400px] h-[400px] bg-pink-500/8 rounded-full blur-3xl animate-pulse delay-500" />
        <div className="absolute bottom-1/3 left-1/3 w-[350px] h-[350px] bg-emerald-500/8 rounded-full blur-3xl animate-pulse delay-700" />
      </div>

      <div className="relative z-10">
        <div className="container mx-auto px-4 pt-8 pb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/20 mb-6">
              <Bot className="w-4 h-4 text-cyan-400" />
              <span className="text-sm text-cyan-400 font-medium">AI Agent Marketplace</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              <span className="bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text text-transparent" data-testid="text-page-title">
                Deploy Autonomous AI Agents
              </span>
            </h1>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto" data-testid="text-page-description">
              Discover, deploy, and manage AI agents that work for you 24/7. From trading bots to quest automation, let AI do the heavy lifting.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12"
          >
            <div data-testid="stat-total-agents">
              <StatCard
                label="Total Agents"
                value={String(stats?.totalAgents || displayAgents.length)}
                icon={Bot}
              />
            </div>
            <div data-testid="stat-active-agents">
              <StatCard
                label="Active Agents"
                value={String(stats?.activeAgents || displayAgents.filter((a: any) => a.status !== 'paused').length)}
                icon={Activity}
              />
            </div>
            <div data-testid="stat-total-executions">
              <StatCard
                label="Total Executions"
                value={`${((stats?.totalExecutions || displayAgents.reduce((sum: number, a: any) => sum + a.totalExecutions, 0)) / 1000).toFixed(1)}K`}
                icon={Zap}
              />
            </div>
            <div data-testid="stat-verified-agents">
              <StatCard
                label="Verified Agents"
                value={String(stats?.verifiedAgents || displayAgents.filter((a: any) => a.verified).length)}
                icon={Shield}
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="flex flex-wrap justify-center gap-3 mb-12"
          >
            {Object.entries(categoryIcons).map(([category, Icon]) => (
              <button
                key={category}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800/50 border border-slate-700/50 hover:border-cyan-500/50 transition-all"
                data-testid={`filter-category-${category}`}
              >
                <Icon className="w-4 h-4 text-slate-400" />
                <span className="text-sm text-slate-300 capitalize">{category}</span>
              </button>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-8"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">Featured Agents</h2>
              <Link href="/ai-agents/create">
                <Button className="bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700" data-testid="button-create-agent">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Agent
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayAgents.map((agent: any, index: number) => {
                const Icon = categoryIcons[agent.category] || Bot;
                const gradient = categoryGradients[agent.category] || "from-slate-500 to-slate-600";
                
                return (
                  <motion.div
                    key={agent.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * index }}
                  >
                    <GlassCard className="h-full hover:border-cyan-500/50 transition-all group cursor-pointer" data-testid={`card-agent-${agent.id}`}>
                      <div className="p-5">
                      <div className="flex items-start justify-between mb-4">
                        <div className={`p-3 rounded-xl bg-gradient-to-br ${gradient}`}>
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex items-center gap-2">
                          {agent.featured && (
                            <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30">
                              <Sparkles className="w-3 h-3 mr-1" />
                              Featured
                            </Badge>
                          )}
                          {agent.verified && (
                            <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Verified
                            </Badge>
                          )}
                        </div>
                      </div>

                      <h3 className="text-xl font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors" data-testid={`text-agent-name-${agent.id}`}>
                        {agent.name}
                      </h3>
                      <p className="text-slate-400 text-sm mb-4 line-clamp-2" data-testid={`text-agent-description-${agent.id}`}>
                        {agent.description}
                      </p>

                      <div className="flex items-center gap-4 mb-4 text-sm">
                        <div className="flex items-center gap-1 text-amber-400">
                          <Star className="w-4 h-4 fill-current" />
                          <span>{agent.rating}</span>
                        </div>
                        <div className="flex items-center gap-1 text-slate-400">
                          <Zap className="w-4 h-4" />
                          <span>{agent.totalExecutions.toLocaleString()} runs</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t border-slate-700/50">
                        <div>
                          <p className="text-xs text-slate-500">Per execution</p>
                          <p className="text-lg font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent" data-testid={`text-agent-price-${agent.id}`}>
                            {formatPrice(agent.pricePerExecution)}
                          </p>
                        </div>
                        <Link href={`/ai-agents/${agent.id}`}>
                          <Button size="sm" className="bg-gradient-to-r from-cyan-500 to-purple-600" data-testid={`button-deploy-${agent.id}`}>
                            <Play className="w-4 h-4 mr-1" />
                            Deploy
                          </Button>
                        </Link>
                      </div>
                      </div>
                    </GlassCard>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <GlassCard className="text-center" data-testid="card-create-cta">
              <div className="p-8">
              <Brain className="w-16 h-16 mx-auto mb-4 text-cyan-400" />
              <h3 className="text-2xl font-bold text-white mb-2">Build Your Own Agent</h3>
              <p className="text-slate-400 mb-6 max-w-lg mx-auto">
                Create custom AI agents using our no-code builder. Define behaviors, set triggers, and monetize your creations in the marketplace.
              </p>
              <div className="flex justify-center gap-4">
                <Button className="bg-gradient-to-r from-cyan-500 to-purple-600" data-testid="button-create-agent-cta">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Agent
                </Button>
                <Link href="/docs">
                  <Button variant="outline" className="border-slate-600 text-slate-300" data-testid="button-learn-more">
                    Learn More
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>
              </div>
            </GlassCard>
          </motion.div>
        </div>

        
      </div>
    </div>
  );
}
