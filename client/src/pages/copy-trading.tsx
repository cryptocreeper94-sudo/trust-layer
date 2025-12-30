import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "wouter";
import {
  Users, Trophy, TrendingUp, TrendingDown, Star,
  Copy, Settings, Bell, Shield, Zap, Target, BarChart3,
  Play, Pause, DollarSign, Percent, Activity
} from "lucide-react";
import { BackButton } from "@/components/page-nav";
import { AreaChart, Area, ResponsiveContainer } from "recharts";
import { Footer } from "@/components/footer";
import { GlassCard } from "@/components/glass-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import darkwaveLogo from "@assets/generated_images/darkwave_token_transparent.png";

interface Trader {
  id: string;
  name: string;
  avatar: string;
  totalPnl: number;
  winRate: number;
  followers: number;
  trades: number;
  riskScore: "low" | "medium" | "high";
  chartData: { value: number }[];
  isFollowing: boolean;
  monthlyReturn: number;
  maxDrawdown: number;
  avgTrade: number;
}

const generateChartData = (trend: number) => 
  Array.from({ length: 30 }, (_, i) => ({
    value: 100 + (Math.random() * 20 - 10) + i * trend,
  }));

const TOP_TRADERS: Trader[] = [
  { id: "1", name: "whale.dwc", avatar: "🐋", totalPnl: 425000, winRate: 78, followers: 1250, trades: 342, riskScore: "medium", chartData: generateChartData(2), isFollowing: false, monthlyReturn: 24.5, maxDrawdown: 8.2, avgTrade: 1240 },
  { id: "2", name: "satoshi.eth", avatar: "⚡", totalPnl: 312000, winRate: 72, followers: 890, trades: 567, riskScore: "low", chartData: generateChartData(1.5), isFollowing: true, monthlyReturn: 18.3, maxDrawdown: 5.1, avgTrade: 550 },
  { id: "3", name: "defi_king", avatar: "👑", totalPnl: 289000, winRate: 69, followers: 2100, trades: 891, riskScore: "high", chartData: generateChartData(3), isFollowing: false, monthlyReturn: 32.1, maxDrawdown: 15.4, avgTrade: 324 },
  { id: "4", name: "alpha_hunter", avatar: "🎯", totalPnl: 198000, winRate: 65, followers: 560, trades: 234, riskScore: "medium", chartData: generateChartData(1.8), isFollowing: false, monthlyReturn: 15.7, maxDrawdown: 9.8, avgTrade: 846 },
  { id: "5", name: "crypto_sage", avatar: "🧙", totalPnl: 167000, winRate: 71, followers: 780, trades: 456, riskScore: "low", chartData: generateChartData(1.2), isFollowing: false, monthlyReturn: 12.4, maxDrawdown: 4.3, avgTrade: 366 },
];

function TraderCard({ trader, rank }: { trader: Trader; rank: number }) {
  const [following, setFollowing] = useState(trader.isFollowing);
  const [showSettings, setShowSettings] = useState(false);
  const [allocation, setAllocation] = useState([10]);
  
  const riskColors = {
    low: { bg: "bg-green-500/20", text: "text-green-400", border: "border-green-500/30" },
    medium: { bg: "bg-yellow-500/20", text: "text-yellow-400", border: "border-yellow-500/30" },
    high: { bg: "bg-red-500/20", text: "text-red-400", border: "border-red-500/30" },
  };
  
  const risk = riskColors[trader.riskScore];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: rank * 0.1 }}
    >
      <GlassCard glow className="p-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 opacity-10">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={trader.chartData}>
              <Area type="monotone" dataKey="value" stroke="#22c55e" fill="#22c55e" fillOpacity={0.3} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        
        <div className="relative">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${
                  rank === 1 ? 'bg-amber-500/20 border-2 border-amber-500' :
                  rank === 2 ? 'bg-gray-400/20 border-2 border-gray-400' :
                  rank === 3 ? 'bg-amber-700/20 border-2 border-amber-700' :
                  'bg-white/10 border border-white/20'
                }`}>
                  {trader.avatar}
                </div>
                {rank <= 3 && (
                  <div className={`absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                    rank === 1 ? 'bg-amber-500 text-black' :
                    rank === 2 ? 'bg-gray-400 text-black' :
                    'bg-amber-700 text-white'
                  }`}>
                    {rank}
                  </div>
                )}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold">{trader.name}</h3>
                  <Badge className={`${risk.bg} ${risk.text} text-[9px]`}>
                    {trader.riskScore.toUpperCase()}
                  </Badge>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span>{trader.followers.toLocaleString()} followers</span>
                  <span>•</span>
                  <span>{trader.trades} trades</span>
                </div>
              </div>
            </div>
            
            <Dialog open={showSettings} onOpenChange={setShowSettings}>
              <DialogTrigger asChild>
                <Button 
                  variant={following ? "outline" : "default"}
                  size="sm"
                  className={following ? "gap-2" : "bg-gradient-to-r from-purple-500 to-pink-500 text-white gap-2"}
                  data-testid={`button-follow-${trader.id}`}
                >
                  {following ? (
                    <>
                      <Settings className="w-3 h-3" />
                      Following
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      Copy Trade
                    </>
                  )}
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md bg-background border-white/10">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <span className="text-2xl">{trader.avatar}</span>
                    Copy {trader.name}
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-4 mt-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm">Allocation</span>
                      <span className="font-mono text-sm">{allocation[0]}% of portfolio</span>
                    </div>
                    <Slider
                      value={allocation}
                      onValueChange={setAllocation}
                      max={50}
                      min={1}
                      step={1}
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 rounded-lg bg-white/5">
                      <p className="text-[10px] text-muted-foreground">Max Trade Size</p>
                      <p className="font-mono">$500</p>
                    </div>
                    <div className="p-3 rounded-lg bg-white/5">
                      <p className="text-[10px] text-muted-foreground">Stop Loss</p>
                      <p className="font-mono">-15%</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 rounded-lg bg-white/5">
                    <div className="flex items-center gap-2">
                      <Bell className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">Trade Notifications</span>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  
                  <Button 
                    className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white"
                    onClick={() => { setFollowing(true); setShowSettings(false); }}
                  >
                    <Play className="w-4 h-4 mr-2" />
                    Start Copy Trading
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
          
          <div className="grid grid-cols-4 gap-2 mb-4">
            <div className="text-center p-2 rounded-lg bg-white/5">
              <div className="text-lg font-bold text-green-400">+${(trader.totalPnl/1000).toFixed(0)}K</div>
              <div className="text-[9px] text-muted-foreground">Total P/L</div>
            </div>
            <div className="text-center p-2 rounded-lg bg-white/5">
              <div className="text-lg font-bold">{trader.winRate}%</div>
              <div className="text-[9px] text-muted-foreground">Win Rate</div>
            </div>
            <div className="text-center p-2 rounded-lg bg-white/5">
              <div className="text-lg font-bold text-green-400">+{trader.monthlyReturn}%</div>
              <div className="text-[9px] text-muted-foreground">Monthly</div>
            </div>
            <div className="text-center p-2 rounded-lg bg-white/5">
              <div className="text-lg font-bold text-red-400">-{trader.maxDrawdown}%</div>
              <div className="text-[9px] text-muted-foreground">Max DD</div>
            </div>
          </div>
          
          <div className="h-16 -mx-4 -mb-4 px-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trader.chartData}>
                <defs>
                  <linearGradient id={`grad-${trader.id}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#22c55e" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#22c55e" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <Area type="monotone" dataKey="value" stroke="#22c55e" strokeWidth={2} fill={`url(#grad-${trader.id})`} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </GlassCard>
    </motion.div>
  );
}

export default function CopyTrading() {
  const [filter, setFilter] = useState("all");
  
  const myStats = {
    following: 2,
    totalInvested: 2500,
    totalPnl: 342,
    activeTrades: 5,
  };

  return (
    <div className="min-h-screen flex flex-col bg-background overflow-x-hidden">
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-background/90 backdrop-blur-xl">
        <div className="container mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <img src={darkwaveLogo} alt="DarkWave" className="w-7 h-7" />
            <span className="font-display font-bold text-lg tracking-tight hidden sm:inline">DarkWave</span>
          </Link>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="border-purple-500/50 text-purple-400 text-[10px]">Copy Trading</Badge>
            <BackButton />
          </div>
        </div>
      </nav>

      <main className="flex-1 pt-16 pb-8 px-4">
        <div className="container mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-6"
          >
            <div className="flex items-center justify-center gap-2 mb-3">
              <motion.div 
                className="p-3 rounded-2xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30"
                animate={{ 
                  boxShadow: ["0 0 20px rgba(168,85,247,0.2)", "0 0 50px rgba(168,85,247,0.4)", "0 0 20px rgba(168,85,247,0.2)"]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Users className="w-7 h-7 text-purple-400" />
              </motion.div>
            </div>
            <h1 className="text-2xl md:text-3xl font-display font-bold mb-2">
              Copy <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Trading</span>
            </h1>
            <p className="text-sm text-muted-foreground">
              Follow top traders and automatically mirror their trades
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
            <GlassCard hover={false} className="p-3">
              <div className="flex items-center gap-2 mb-1">
                <Users className="w-4 h-4 text-purple-400" />
                <span className="text-[10px] text-muted-foreground">Following</span>
              </div>
              <div className="text-xl font-bold">{myStats.following}</div>
            </GlassCard>
            <GlassCard hover={false} className="p-3">
              <div className="flex items-center gap-2 mb-1">
                <DollarSign className="w-4 h-4 text-primary" />
                <span className="text-[10px] text-muted-foreground">Invested</span>
              </div>
              <div className="text-xl font-bold">${myStats.totalInvested.toLocaleString()}</div>
            </GlassCard>
            <GlassCard hover={false} className="p-3">
              <div className="flex items-center gap-2 mb-1">
                <TrendingUp className="w-4 h-4 text-green-400" />
                <span className="text-[10px] text-muted-foreground">Total P/L</span>
              </div>
              <div className="text-xl font-bold text-green-400">+${myStats.totalPnl}</div>
            </GlassCard>
            <GlassCard hover={false} className="p-3">
              <div className="flex items-center gap-2 mb-1">
                <Activity className="w-4 h-4 text-blue-400" />
                <span className="text-[10px] text-muted-foreground">Active Trades</span>
              </div>
              <div className="text-xl font-bold">{myStats.activeTrades}</div>
            </GlassCard>
          </div>

          <Tabs defaultValue="discover" className="mb-6">
            <TabsList className="w-full grid grid-cols-3">
              <TabsTrigger value="discover" className="text-xs">Discover Traders</TabsTrigger>
              <TabsTrigger value="following" className="text-xs">Following</TabsTrigger>
              <TabsTrigger value="history" className="text-xs">Trade History</TabsTrigger>
            </TabsList>

            <TabsContent value="discover" className="mt-4 space-y-4">
              <div className="flex items-center gap-2 overflow-x-auto pb-2">
                {["all", "low-risk", "high-return", "most-followed"].map((f) => (
                  <Button
                    key={f}
                    variant={filter === f ? "default" : "outline"}
                    size="sm"
                    className="text-xs whitespace-nowrap"
                    onClick={() => setFilter(f)}
                  >
                    {f.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                  </Button>
                ))}
              </div>
              
              {TOP_TRADERS.map((trader, i) => (
                <TraderCard key={trader.id} trader={trader} rank={i + 1} />
              ))}
            </TabsContent>

            <TabsContent value="following" className="mt-4 space-y-4">
              {TOP_TRADERS.filter(t => t.isFollowing).map((trader, i) => (
                <TraderCard key={trader.id} trader={trader} rank={i + 1} />
              ))}
              {TOP_TRADERS.filter(t => t.isFollowing).length === 0 && (
                <div className="text-center py-12">
                  <Users className="w-12 h-12 text-white/10 mx-auto mb-3" />
                  <p className="text-muted-foreground">You're not following any traders yet</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="history" className="mt-4">
              <GlassCard className="p-4">
                <p className="text-center text-muted-foreground py-8">
                  Trade history will appear here once you start copy trading
                </p>
              </GlassCard>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />
    </div>
  );
}
