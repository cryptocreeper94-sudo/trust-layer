import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { ArrowLeft, Activity, Key, Clock, TrendingUp, AlertTriangle, RefreshCw, BarChart3 } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { GlassCard } from "@/components/glass-card";
import { Footer } from "@/components/footer";
import orbitLogo from "@assets/generated_images/futuristic_abstract_geometric_logo_symbol_for_orbit.png";

interface UsageData {
  requestsToday: number;
  requestsThisMonth: number;
  dailyLimit: number;
  monthlyLimit: number;
  endpoints: { path: string; count: number; avgLatency: number }[];
  recentErrors: { timestamp: string; endpoint: string; code: number; message: string }[];
}

const MOCK_USAGE: UsageData = {
  requestsToday: 1247,
  requestsThisMonth: 28450,
  dailyLimit: 10000,
  monthlyLimit: 100000,
  endpoints: [
    { path: "/api/blockchain/stats", count: 5420, avgLatency: 45 },
    { path: "/api/transactions", count: 3210, avgLatency: 120 },
    { path: "/api/blocks", count: 2100, avgLatency: 85 },
    { path: "/api/accounts/:address", count: 1850, avgLatency: 95 },
    { path: "/api/nft/collections", count: 980, avgLatency: 150 },
    { path: "/api/swap/quote", count: 750, avgLatency: 200 },
  ],
  recentErrors: [
    { timestamp: "2024-12-24T10:30:00Z", endpoint: "/api/swap/execute", code: 429, message: "Rate limit exceeded" },
    { timestamp: "2024-12-24T09:15:00Z", endpoint: "/api/bridge/lock", code: 400, message: "Insufficient balance" },
  ],
};

export default function ApiUsage() {
  const [timeRange, setTimeRange] = useState<"today" | "week" | "month">("today");

  const dailyPercent = (MOCK_USAGE.requestsToday / MOCK_USAGE.dailyLimit) * 100;
  const monthlyPercent = (MOCK_USAGE.requestsThisMonth / MOCK_USAGE.monthlyLimit) * 100;

  const maxEndpointCount = Math.max(...MOCK_USAGE.endpoints.map(e => e.count));

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-background/90 backdrop-blur-xl">
        <div className="container mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <img src={orbitLogo} alt="DarkWave" className="w-7 h-7" />
            <span className="font-display font-bold text-lg hidden sm:inline">DarkWave</span>
          </Link>
          <Link href="/developer-portal">
            <Button variant="ghost" size="sm" data-testid="button-back">
              <ArrowLeft className="w-4 h-4 mr-1" />
              Developer Portal
            </Button>
          </Link>
        </div>
      </nav>

      <main className="flex-1 pt-20 pb-8 px-4">
        <div className="container mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <div className="flex items-center justify-center gap-3 mb-3">
              <Activity className="w-8 h-8 text-primary" />
              <h1 className="text-3xl font-display font-bold" data-testid="text-title">API Usage</h1>
            </div>
            <p className="text-muted-foreground">Monitor your API usage and quotas</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6"
          >
            <GlassCard className="p-6" data-testid="card-daily-usage">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-primary" />
                  <h3 className="font-semibold">Today's Usage</h3>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full ${dailyPercent > 80 ? "bg-red-500/20 text-red-400" : "bg-green-500/20 text-green-400"}`}>
                  {dailyPercent > 80 ? "High" : "Normal"}
                </span>
              </div>
              <div className="text-3xl font-bold mb-2">
                {MOCK_USAGE.requestsToday.toLocaleString()}
                <span className="text-sm font-normal text-muted-foreground ml-2">
                  / {MOCK_USAGE.dailyLimit.toLocaleString()}
                </span>
              </div>
              <Progress value={dailyPercent} className="h-2" />
              <p className="text-xs text-muted-foreground mt-2">
                {(MOCK_USAGE.dailyLimit - MOCK_USAGE.requestsToday).toLocaleString()} requests remaining today
              </p>
            </GlassCard>

            <GlassCard className="p-6" data-testid="card-monthly-usage">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-primary" />
                  <h3 className="font-semibold">Monthly Usage</h3>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full ${monthlyPercent > 80 ? "bg-red-500/20 text-red-400" : "bg-green-500/20 text-green-400"}`}>
                  {monthlyPercent.toFixed(0)}%
                </span>
              </div>
              <div className="text-3xl font-bold mb-2">
                {MOCK_USAGE.requestsThisMonth.toLocaleString()}
                <span className="text-sm font-normal text-muted-foreground ml-2">
                  / {MOCK_USAGE.monthlyLimit.toLocaleString()}
                </span>
              </div>
              <Progress value={monthlyPercent} className="h-2" />
              <p className="text-xs text-muted-foreground mt-2">
                {(MOCK_USAGE.monthlyLimit - MOCK_USAGE.requestsThisMonth).toLocaleString()} requests remaining this month
              </p>
            </GlassCard>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <GlassCard className="p-6 mb-6" data-testid="card-endpoints">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-primary" />
                  <h3 className="font-semibold">Top Endpoints</h3>
                </div>
                <div className="flex gap-1">
                  {(["today", "week", "month"] as const).map(range => (
                    <Button
                      key={range}
                      variant={timeRange === range ? "default" : "ghost"}
                      size="sm"
                      onClick={() => setTimeRange(range)}
                      className="text-xs capitalize"
                      data-testid={`button-range-${range}`}
                    >
                      {range}
                    </Button>
                  ))}
                </div>
              </div>
              <div className="space-y-3">
                {MOCK_USAGE.endpoints.map((endpoint, idx) => (
                  <div key={endpoint.path} data-testid={`endpoint-${idx}`}>
                    <div className="flex justify-between text-sm mb-1">
                      <code className="text-xs text-primary">{endpoint.path}</code>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>{endpoint.count.toLocaleString()} calls</span>
                        <span>{endpoint.avgLatency}ms avg</span>
                      </div>
                    </div>
                    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(endpoint.count / maxEndpointCount) * 100}%` }}
                        transition={{ duration: 0.5, delay: idx * 0.05 }}
                        className="h-full bg-gradient-to-r from-primary to-purple-500 rounded-full"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </GlassCard>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <GlassCard className="p-6" data-testid="card-errors">
              <div className="flex items-center gap-2 mb-4">
                <AlertTriangle className="w-5 h-5 text-amber-400" />
                <h3 className="font-semibold">Recent Errors</h3>
              </div>
              {MOCK_USAGE.recentErrors.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <RefreshCw className="w-8 h-8 mx-auto mb-2 opacity-30" />
                  <p>No recent errors</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {MOCK_USAGE.recentErrors.map((error, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-3 bg-red-500/10 border border-red-500/20 rounded-lg"
                      data-testid={`error-${idx}`}
                    >
                      <div>
                        <code className="text-xs text-red-400">{error.endpoint}</code>
                        <p className="text-xs text-muted-foreground">{error.message}</p>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-mono text-red-400">{error.code}</span>
                        <p className="text-[10px] text-muted-foreground">
                          {new Date(error.timestamp).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </GlassCard>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-6 text-center"
          >
            <p className="text-sm text-muted-foreground mb-4">
              Need more API requests? Upgrade your plan or contact us for enterprise pricing.
            </p>
            <div className="flex gap-3 justify-center">
              <Link href="/billing">
                <Button variant="outline" data-testid="button-upgrade">Upgrade Plan</Button>
              </Link>
              <Button variant="ghost" data-testid="button-contact">Contact Sales</Button>
            </div>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
