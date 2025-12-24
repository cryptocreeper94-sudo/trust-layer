import { useState } from "react";
import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, DollarSign, Percent, Calendar, BarChart3, PieChart, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/glass-card";
import { Progress } from "@/components/ui/progress";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart as RechartsPie, Pie, Cell } from "recharts";

interface PortfolioMetrics {
  totalValue: number;
  totalCost: number;
  unrealizedPL: number;
  realizedPL: number;
  change24h: number;
  change7d: number;
  change30d: number;
  allTimeHigh: number;
  allTimeLow: number;
}

interface TokenHolding {
  symbol: string;
  name: string;
  amount: string;
  value: number;
  cost: number;
  pnl: number;
  pnlPercent: number;
  allocation: number;
  color: string;
}

const MOCK_METRICS: PortfolioMetrics = {
  totalValue: 12500,
  totalCost: 10000,
  unrealizedPL: 2500,
  realizedPL: 1200,
  change24h: 5.2,
  change7d: 12.5,
  change30d: -3.2,
  allTimeHigh: 15000,
  allTimeLow: 5000,
};

const MOCK_HOLDINGS: TokenHolding[] = [
  { symbol: "DWC", name: "DarkWave Coin", amount: "35,000", value: 3500, cost: 2400, pnl: 1100, pnlPercent: 45.8, allocation: 28, color: "#8B5CF6" },
  { symbol: "stDWC", name: "Staked DarkWave", amount: "15,000", value: 1650, cost: 1500, pnl: 150, pnlPercent: 10, allocation: 13.2, color: "#6366F1" },
  { symbol: "wETH", name: "Wrapped Ethereum", amount: "1.2", value: 4200, cost: 3800, pnl: 400, pnlPercent: 10.5, allocation: 33.6, color: "#3B82F6" },
  { symbol: "wSOL", name: "Wrapped Solana", amount: "15", value: 2700, cost: 2500, pnl: 200, pnlPercent: 8, allocation: 21.6, color: "#10B981" },
  { symbol: "USDC", name: "USD Coin", amount: "450", value: 450, cost: 450, pnl: 0, pnlPercent: 0, allocation: 3.6, color: "#22D3EE" },
];

const CHART_DATA = [
  { date: "Nov 1", value: 10000 },
  { date: "Nov 8", value: 10500 },
  { date: "Nov 15", value: 11200 },
  { date: "Nov 22", value: 10800 },
  { date: "Nov 29", value: 11500 },
  { date: "Dec 6", value: 12000 },
  { date: "Dec 13", value: 11800 },
  { date: "Dec 20", value: 12500 },
];

export function PortfolioAnalytics() {
  const [timeframe, setTimeframe] = useState<"24h" | "7d" | "30d" | "all">("7d");

  const getTimeframeChange = () => {
    switch (timeframe) {
      case "24h": return MOCK_METRICS.change24h;
      case "7d": return MOCK_METRICS.change7d;
      case "30d": return MOCK_METRICS.change30d;
      case "all": return ((MOCK_METRICS.totalValue - MOCK_METRICS.totalCost) / MOCK_METRICS.totalCost) * 100;
    }
  };

  const change = getTimeframeChange();
  const isPositive = change >= 0;

  return (
    <div className="space-y-4" data-testid="portfolio-analytics">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        <GlassCard className="p-3">
          <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1">
            <DollarSign className="w-3 h-3" />
            Unrealized P/L
          </div>
          <div className={`text-lg font-bold ${MOCK_METRICS.unrealizedPL >= 0 ? "text-green-400" : "text-red-400"}`}>
            {MOCK_METRICS.unrealizedPL >= 0 ? "+" : ""}${MOCK_METRICS.unrealizedPL.toLocaleString()}
          </div>
        </GlassCard>
        <GlassCard className="p-3">
          <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1">
            <DollarSign className="w-3 h-3" />
            Realized P/L
          </div>
          <div className={`text-lg font-bold ${MOCK_METRICS.realizedPL >= 0 ? "text-green-400" : "text-red-400"}`}>
            {MOCK_METRICS.realizedPL >= 0 ? "+" : ""}${MOCK_METRICS.realizedPL.toLocaleString()}
          </div>
        </GlassCard>
        <GlassCard className="p-3">
          <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1">
            <ArrowUpRight className="w-3 h-3 text-green-400" />
            All-Time High
          </div>
          <div className="text-lg font-bold">${MOCK_METRICS.allTimeHigh.toLocaleString()}</div>
        </GlassCard>
        <GlassCard className="p-3">
          <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1">
            <ArrowDownRight className="w-3 h-3 text-red-400" />
            All-Time Low
          </div>
          <div className="text-lg font-bold">${MOCK_METRICS.allTimeLow.toLocaleString()}</div>
        </GlassCard>
      </div>

      <GlassCard className="p-4" data-testid="card-performance-chart">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-primary" />
            <h3 className="font-semibold text-sm">Performance</h3>
          </div>
          <div className="flex gap-1">
            {(["24h", "7d", "30d", "all"] as const).map((tf) => (
              <Button
                key={tf}
                variant={timeframe === tf ? "default" : "ghost"}
                size="sm"
                className="h-6 px-2 text-xs"
                onClick={() => setTimeframe(tf)}
                data-testid={`button-timeframe-${tf}`}
              >
                {tf === "all" ? "All" : tf}
              </Button>
            ))}
          </div>
        </div>

        <div className="flex items-baseline gap-2 mb-4">
          <span className="text-2xl font-bold">${MOCK_METRICS.totalValue.toLocaleString()}</span>
          <span className={`flex items-center gap-0.5 text-sm ${isPositive ? "text-green-400" : "text-red-400"}`}>
            {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            {isPositive ? "+" : ""}{change.toFixed(2)}%
          </span>
        </div>

        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={CHART_DATA}>
              <defs>
                <linearGradient id="portfolioGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: "#666" }} />
              <YAxis hide domain={["dataMin - 500", "dataMax + 500"]} />
              <Tooltip
                contentStyle={{ backgroundColor: "#1a1a2e", border: "1px solid #333", borderRadius: 8 }}
                labelStyle={{ color: "#999" }}
                formatter={(value: number) => [`$${value.toLocaleString()}`, "Value"]}
              />
              <Area type="monotone" dataKey="value" stroke="#8B5CF6" strokeWidth={2} fill="url(#portfolioGradient)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </GlassCard>

      <GlassCard className="p-4" data-testid="card-holdings-breakdown">
        <div className="flex items-center gap-2 mb-4">
          <PieChart className="w-4 h-4 text-primary" />
          <h3 className="font-semibold text-sm">Holdings & P/L</h3>
        </div>

        <div className="space-y-3">
          {MOCK_HOLDINGS.map((holding) => (
            <div key={holding.symbol} className="flex items-center justify-between" data-testid={`holding-${holding.symbol}`}>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold" style={{ backgroundColor: `${holding.color}30` }}>
                  {holding.symbol.slice(0, 2)}
                </div>
                <div>
                  <p className="font-medium text-sm">{holding.symbol}</p>
                  <p className="text-xs text-muted-foreground">{holding.amount} tokens</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-medium text-sm">${holding.value.toLocaleString()}</p>
                <p className={`text-xs flex items-center justify-end gap-0.5 ${holding.pnl >= 0 ? "text-green-400" : "text-red-400"}`}>
                  {holding.pnl >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                  {holding.pnl >= 0 ? "+" : ""}${holding.pnl.toLocaleString()} ({holding.pnlPercent.toFixed(1)}%)
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 pt-4 border-t border-white/10">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Total Cost Basis</span>
            <span className="font-medium">${MOCK_METRICS.totalCost.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-sm mt-1">
            <span className="text-muted-foreground">Total P/L</span>
            <span className={`font-medium ${MOCK_METRICS.unrealizedPL >= 0 ? "text-green-400" : "text-red-400"}`}>
              {MOCK_METRICS.unrealizedPL >= 0 ? "+" : ""}${MOCK_METRICS.unrealizedPL.toLocaleString()} ({((MOCK_METRICS.unrealizedPL / MOCK_METRICS.totalCost) * 100).toFixed(1)}%)
            </span>
          </div>
        </div>
      </GlassCard>

      <GlassCard className="p-4" data-testid="card-allocation">
        <div className="flex items-center gap-2 mb-4">
          <Percent className="w-4 h-4 text-primary" />
          <h3 className="font-semibold text-sm">Asset Allocation</h3>
        </div>

        <div className="space-y-2">
          {MOCK_HOLDINGS.map((holding) => (
            <div key={holding.symbol}>
              <div className="flex justify-between text-xs mb-1">
                <span className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: holding.color }} />
                  {holding.symbol}
                </span>
                <span>{holding.allocation}%</span>
              </div>
              <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${holding.allocation}%` }}
                  transition={{ duration: 0.5 }}
                  className="h-full rounded-full"
                  style={{ backgroundColor: holding.color }}
                />
              </div>
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  );
}
