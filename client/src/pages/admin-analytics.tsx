import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, TrendingUp, Users, Coins, Activity, BarChart3, PieChart, DollarSign, ArrowUpRight, ArrowDownRight, Wallet } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { GlassCard } from "@/components/glass-card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/use-auth";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart as RePieChart, Pie, Cell } from "recharts";
import orbitLogo from "@assets/generated_images/futuristic_abstract_geometric_logo_symbol_for_orbit.png";

interface AnalyticsData {
  totalUsers: number;
  activeWallets: number;
  totalVolume: string;
  totalStaked: string;
  foundersCount: number;
  dailyTransactions: number;
  tvl: string;
  averageStakeAmount: string;
}

interface ChartData {
  date: string;
  volume: number;
  users: number;
  transactions: number;
}

const COLORS = ['#00FFFF', '#FFD700', '#00ff88', '#ff6b6b', '#a855f7'];

export default function AdminAnalytics() {
  const { user, isLoading: authLoading } = useAuth();
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('30d');

  const [analytics] = useState<AnalyticsData>({
    totalUsers: 2847,
    activeWallets: 1234,
    totalVolume: "4,521,890",
    totalStaked: "12,450,000",
    foundersCount: 847,
    dailyTransactions: 15420,
    tvl: "28,750,000",
    averageStakeAmount: "10,050",
  });

  const [volumeData] = useState<ChartData[]>(() => {
    const data: ChartData[] = [];
    const now = new Date();
    for (let i = 29; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      data.push({
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        volume: Math.floor(100000 + Math.random() * 200000),
        users: Math.floor(50 + Math.random() * 100),
        transactions: Math.floor(400 + Math.random() * 600),
      });
    }
    return data;
  });

  const [tokenDistribution] = useState([
    { name: 'Public Sale', value: 40 },
    { name: 'Team', value: 15 },
    { name: 'Development', value: 20 },
    { name: 'Marketing', value: 10 },
    { name: 'Liquidity', value: 10 },
    { name: 'Reserve', value: 5 },
  ]);

  const [stakingDistribution] = useState([
    { name: '30 Day', value: 35 },
    { name: '90 Day', value: 40 },
    { name: '180 Day', value: 20 },
    { name: '365 Day', value: 5 },
  ]);

  const statCards = [
    { label: "Total Users", value: analytics.totalUsers.toLocaleString(), change: "+12.5%", positive: true, icon: Users },
    { label: "Active Wallets", value: analytics.activeWallets.toLocaleString(), change: "+8.2%", positive: true, icon: Wallet },
    { label: "24h Volume", value: `${analytics.totalVolume} DWC`, change: "+23.1%", positive: true, icon: Activity },
    { label: "Total Staked", value: `${analytics.totalStaked} DWC`, change: "+5.7%", positive: true, icon: Coins },
    { label: "Legacy Founders", value: analytics.foundersCount.toLocaleString(), change: "+3.2%", positive: true, icon: Users },
    { label: "Daily Transactions", value: analytics.dailyTransactions.toLocaleString(), change: "-2.1%", positive: false, icon: BarChart3 },
    { label: "Total Value Locked", value: `$${analytics.tvl}`, change: "+15.8%", positive: true, icon: DollarSign },
    { label: "Avg Stake Amount", value: `${analytics.averageStakeAmount} DWC`, change: "+4.3%", positive: true, icon: TrendingUp },
  ];

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <GlassCard className="p-8 text-center" data-testid="card-admin-required">
          <h2 className="text-xl font-bold mb-4" data-testid="text-admin-required">Admin Access Required</h2>
          <p className="text-muted-foreground mb-4">Please sign in to access analytics.</p>
          <Link href="/">
            <Button data-testid="button-go-home">Go Home</Button>
          </Link>
        </GlassCard>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-background/90 backdrop-blur-xl">
        <div className="container mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 shrink-0" data-testid="link-home">
            <img src={orbitLogo} alt="DarkWave" className="w-7 h-7" />
            <span className="font-display font-bold text-lg tracking-tight hidden sm:inline">DarkWave</span>
          </Link>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="border-purple-500/50 text-purple-400 bg-purple-500/10 text-[10px] sm:text-xs">
              Admin
            </Badge>
            <Link href="/admin/rewards">
              <Button variant="ghost" size="sm" className="h-8 text-xs gap-1 hover:bg-white/5 px-2" data-testid="link-admin-rewards">
                Rewards
              </Button>
            </Link>
            <Link href="/">
              <Button variant="ghost" size="sm" className="h-8 text-xs gap-1 hover:bg-white/5 px-2" data-testid="button-back">
                <ArrowLeft className="w-3 h-3" />
                <span className="hidden sm:inline">Back</span>
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      <main className="pt-20 pb-12 px-4">
        <div className="container mx-auto max-w-7xl">
          <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-display font-bold mb-2" data-testid="text-analytics-title">Analytics Dashboard</h1>
              <p className="text-muted-foreground">Real-time metrics for DarkWave Smart Chain</p>
            </div>
            <div className="flex gap-2">
              {(['7d', '30d', '90d'] as const).map((range) => (
                <Button
                  key={range}
                  variant={timeRange === range ? "default" : "outline"}
                  size="sm"
                  onClick={() => setTimeRange(range)}
                  data-testid={`button-range-${range}`}
                >
                  {range === '7d' ? '7 Days' : range === '30d' ? '30 Days' : '90 Days'}
                </Button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-8">
            {statCards.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <GlassCard className="p-4" data-testid={`card-stat-${stat.label.toLowerCase().replace(/\s+/g, '-')}`}>
                  <div className="flex items-center justify-between mb-2">
                    <stat.icon className="w-4 h-4 text-muted-foreground" />
                    <Badge className={`text-[10px] ${stat.positive ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                      {stat.positive ? <ArrowUpRight className="w-2.5 h-2.5 mr-0.5" /> : <ArrowDownRight className="w-2.5 h-2.5 mr-0.5" />}
                      {stat.change}
                    </Badge>
                  </div>
                  <p className="text-xl sm:text-2xl font-bold truncate">{stat.value}</p>
                  <p className="text-xs text-muted-foreground truncate">{stat.label}</p>
                </GlassCard>
              </motion.div>
            ))}
          </div>

          <Tabs defaultValue="volume" className="w-full">
            <TabsList className="w-full justify-start mb-6 bg-white/5 overflow-x-auto" data-testid="tabs-analytics-categories">
              <TabsTrigger value="volume" className="text-xs sm:text-sm" data-testid="tab-volume">Volume</TabsTrigger>
              <TabsTrigger value="users" className="text-xs sm:text-sm" data-testid="tab-users">Users</TabsTrigger>
              <TabsTrigger value="transactions" className="text-xs sm:text-sm" data-testid="tab-transactions">Transactions</TabsTrigger>
              <TabsTrigger value="distribution" className="text-xs sm:text-sm" data-testid="tab-distribution">Distribution</TabsTrigger>
            </TabsList>

            <TabsContent value="volume">
              <GlassCard className="p-6" glow data-testid="card-volume-chart">
                <h3 className="font-bold mb-4 flex items-center gap-2">
                  <Activity className="w-4 h-4 text-primary" />
                  Trading Volume (DWC)
                </h3>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={volumeData}>
                      <defs>
                        <linearGradient id="volumeGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#00FFFF" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#00FFFF" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="date" stroke="#666" fontSize={10} />
                      <YAxis stroke="#666" fontSize={10} tickFormatter={(v) => `${(v/1000).toFixed(0)}K`} />
                      <Tooltip 
                        contentStyle={{ background: '#1a1a2e', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                        labelStyle={{ color: '#888' }}
                      />
                      <Area type="monotone" dataKey="volume" stroke="#00FFFF" fill="url(#volumeGradient)" strokeWidth={2} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </GlassCard>
            </TabsContent>

            <TabsContent value="users">
              <GlassCard className="p-6" glow data-testid="card-users-chart">
                <h3 className="font-bold mb-4 flex items-center gap-2">
                  <Users className="w-4 h-4 text-primary" />
                  New Users Per Day
                </h3>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={volumeData}>
                      <XAxis dataKey="date" stroke="#666" fontSize={10} />
                      <YAxis stroke="#666" fontSize={10} />
                      <Tooltip 
                        contentStyle={{ background: '#1a1a2e', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                        labelStyle={{ color: '#888' }}
                      />
                      <Bar dataKey="users" fill="#FFD700" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </GlassCard>
            </TabsContent>

            <TabsContent value="transactions">
              <GlassCard className="p-6" glow data-testid="card-transactions-chart">
                <h3 className="font-bold mb-4 flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-primary" />
                  Daily Transactions
                </h3>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={volumeData}>
                      <defs>
                        <linearGradient id="txGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#00ff88" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#00ff88" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="date" stroke="#666" fontSize={10} />
                      <YAxis stroke="#666" fontSize={10} />
                      <Tooltip 
                        contentStyle={{ background: '#1a1a2e', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                        labelStyle={{ color: '#888' }}
                      />
                      <Area type="monotone" dataKey="transactions" stroke="#00ff88" fill="url(#txGradient)" strokeWidth={2} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </GlassCard>
            </TabsContent>

            <TabsContent value="distribution">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <GlassCard className="p-6" data-testid="card-token-distribution">
                  <h3 className="font-bold mb-4 flex items-center gap-2">
                    <PieChart className="w-4 h-4 text-primary" />
                    Token Distribution
                  </h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <RePieChart>
                        <Pie
                          data={tokenDistribution}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={80}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {tokenDistribution.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip 
                          contentStyle={{ background: '#1a1a2e', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                        />
                      </RePieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="flex flex-wrap gap-3 justify-center">
                    {tokenDistribution.map((item, index) => (
                      <div key={item.name} className="flex items-center gap-2 text-xs">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                        <span className="text-muted-foreground">{item.name} ({item.value}%)</span>
                      </div>
                    ))}
                  </div>
                </GlassCard>

                <GlassCard className="p-6" data-testid="card-staking-distribution">
                  <h3 className="font-bold mb-4 flex items-center gap-2">
                    <Coins className="w-4 h-4 text-primary" />
                    Staking Lock Periods
                  </h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <RePieChart>
                        <Pie
                          data={stakingDistribution}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={80}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {stakingDistribution.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip 
                          contentStyle={{ background: '#1a1a2e', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                        />
                      </RePieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="flex flex-wrap gap-3 justify-center">
                    {stakingDistribution.map((item, index) => (
                      <div key={item.name} className="flex items-center gap-2 text-xs">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                        <span className="text-muted-foreground">{item.name} ({item.value}%)</span>
                      </div>
                    ))}
                  </div>
                </GlassCard>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}
