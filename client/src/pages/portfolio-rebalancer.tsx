import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "wouter";
import {
  ArrowLeft, Scale, TrendingUp, Target, RefreshCw, Zap,
  Plus, Minus, AlertCircle, CheckCircle2, Settings
} from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { Footer } from "@/components/footer";
import { GlassCard } from "@/components/glass-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import darkwaveLogo from "@assets/generated_images/darkwave_token_transparent.png";

interface Asset {
  symbol: string;
  name: string;
  currentValue: number;
  currentPercent: number;
  targetPercent: number;
  color: string;
  change: number;
}

const PORTFOLIO: Asset[] = [
  { symbol: "DWC", name: "DarkWave Coin", currentValue: 8500, currentPercent: 42.5, targetPercent: 40, color: "#8b5cf6", change: 5.2 },
  { symbol: "stDWC", name: "Staked DarkWave", currentValue: 5200, currentPercent: 26, targetPercent: 30, color: "#06b6d4", change: 0 },
  { symbol: "USDC", name: "USD Coin", currentValue: 3000, currentPercent: 15, targetPercent: 15, color: "#22c55e", change: 0 },
  { symbol: "LP-DWC/USDC", name: "LP Tokens", currentValue: 2300, currentPercent: 11.5, targetPercent: 10, color: "#f59e0b", change: -2.1 },
  { symbol: "NFTs", name: "NFT Collection", currentValue: 1000, currentPercent: 5, targetPercent: 5, color: "#ec4899", change: 8.5 },
];

export default function PortfolioRebalancer() {
  const [assets, setAssets] = useState(PORTFOLIO);
  const [isRebalancing, setIsRebalancing] = useState(false);
  const [autoRebalance, setAutoRebalance] = useState(false);
  const [threshold, setThreshold] = useState([5]);

  const totalValue = assets.reduce((sum, a) => sum + a.currentValue, 0);
  const totalTarget = assets.reduce((sum, a) => sum + a.targetPercent, 0);
  const isBalanced = totalTarget === 100;

  const updateTarget = (symbol: string, value: number) => {
    setAssets(prev => prev.map(a => 
      a.symbol === symbol ? { ...a, targetPercent: value } : a
    ));
  };

  const calculateRebalanceActions = () => {
    return assets.map(asset => {
      const targetValue = (asset.targetPercent / 100) * totalValue;
      const diff = targetValue - asset.currentValue;
      return {
        ...asset,
        action: diff > 50 ? "buy" : diff < -50 ? "sell" : "hold",
        amount: Math.abs(diff),
      };
    }).filter(a => a.action !== "hold");
  };

  const rebalanceActions = calculateRebalanceActions();

  const handleRebalance = () => {
    setIsRebalancing(true);
    setTimeout(() => {
      setAssets(prev => prev.map(a => ({
        ...a,
        currentPercent: a.targetPercent,
        currentValue: (a.targetPercent / 100) * totalValue,
      })));
      setIsRebalancing(false);
    }, 2000);
  };

  const currentData = assets.map(a => ({ name: a.symbol, value: a.currentPercent, color: a.color }));
  const targetData = assets.map(a => ({ name: a.symbol, value: a.targetPercent, color: a.color }));

  return (
    <div className="min-h-screen flex flex-col bg-background overflow-x-hidden">
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-background/90 backdrop-blur-xl">
        <div className="container mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <img src={darkwaveLogo} alt="DarkWave" className="w-7 h-7" />
            <span className="font-display font-bold text-lg tracking-tight hidden sm:inline">DarkWave</span>
          </Link>
          <Link href="/dashboard-pro">
            <Button variant="ghost" size="sm" className="h-8 text-xs">
              <ArrowLeft className="w-3 h-3 mr-1" />
              Dashboard
            </Button>
          </Link>
        </div>
      </nav>

      <main className="flex-1 pt-16 pb-8 px-4">
        <div className="container mx-auto max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-6"
          >
            <div className="flex items-center justify-center gap-2 mb-3">
              <motion.div 
                className="p-3 rounded-2xl bg-gradient-to-br from-blue-500/20 to-indigo-500/20 border border-blue-500/30"
                animate={{ 
                  boxShadow: ["0 0 20px rgba(59,130,246,0.2)", "0 0 50px rgba(59,130,246,0.4)", "0 0 20px rgba(59,130,246,0.2)"]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Scale className="w-7 h-7 text-blue-400" />
              </motion.div>
            </div>
            <h1 className="text-2xl md:text-3xl font-display font-bold mb-2">
              Portfolio <span className="text-blue-400">Rebalancer</span>
            </h1>
            <p className="text-sm text-muted-foreground">
              Maintain optimal asset allocation with one click
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
            <GlassCard hover={false} className="p-3">
              <div className="text-[10px] text-muted-foreground mb-1">Total Value</div>
              <div className="text-xl font-bold">${totalValue.toLocaleString()}</div>
            </GlassCard>
            <GlassCard hover={false} className="p-3">
              <div className="text-[10px] text-muted-foreground mb-1">Assets</div>
              <div className="text-xl font-bold">{assets.length}</div>
            </GlassCard>
            <GlassCard hover={false} className="p-3">
              <div className="text-[10px] text-muted-foreground mb-1">Drift</div>
              <div className="text-xl font-bold text-yellow-400">
                {Math.max(...assets.map(a => Math.abs(a.currentPercent - a.targetPercent))).toFixed(1)}%
              </div>
            </GlassCard>
            <GlassCard hover={false} className="p-3">
              <div className="text-[10px] text-muted-foreground mb-1">Status</div>
              <div className="text-xl font-bold flex items-center gap-1">
                {rebalanceActions.length === 0 ? (
                  <><CheckCircle2 className="w-4 h-4 text-green-400" /> Balanced</>
                ) : (
                  <><AlertCircle className="w-4 h-4 text-yellow-400" /> Needs Rebalance</>
                )}
              </div>
            </GlassCard>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
            <GlassCard className="p-4">
              <h2 className="font-bold mb-4 flex items-center gap-2">
                <Target className="w-4 h-4 text-primary" />
                Current vs Target
              </h2>
              <div className="flex items-center justify-around">
                <div className="text-center">
                  <p className="text-xs text-muted-foreground mb-2">Current</p>
                  <div className="w-32 h-32">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={currentData} cx="50%" cy="50%" innerRadius={30} outerRadius={50} dataKey="value" strokeWidth={0}>
                          {currentData.map((entry, i) => (
                            <Cell key={i} fill={entry.color} />
                          ))}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                <motion.div
                  animate={{ x: [0, 10, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <RefreshCw className="w-8 h-8 text-muted-foreground" />
                </motion.div>
                <div className="text-center">
                  <p className="text-xs text-muted-foreground mb-2">Target</p>
                  <div className="w-32 h-32">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={targetData} cx="50%" cy="50%" innerRadius={30} outerRadius={50} dataKey="value" strokeWidth={0}>
                          {targetData.map((entry, i) => (
                            <Cell key={i} fill={entry.color} />
                          ))}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </GlassCard>

            <GlassCard className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-bold flex items-center gap-2">
                  <Settings className="w-4 h-4 text-primary" />
                  Auto Rebalance
                </h2>
                <Switch checked={autoRebalance} onCheckedChange={setAutoRebalance} data-testid="switch-auto-rebalance" />
              </div>
              <p className="text-xs text-muted-foreground mb-4">
                Automatically rebalance when allocation drifts beyond threshold
              </p>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm">Threshold</span>
                  <span className="font-mono text-sm">{threshold[0]}%</span>
                </div>
                <Slider
                  value={threshold}
                  onValueChange={setThreshold}
                  min={1}
                  max={20}
                  step={1}
                  disabled={!autoRebalance}
                  data-testid="slider-rebalance-threshold"
                />
              </div>
              {autoRebalance && (
                <div className="mt-4 p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
                  <p className="text-xs text-blue-400">
                    Will auto-rebalance when any asset drifts more than {threshold[0]}% from target
                  </p>
                </div>
              )}
            </GlassCard>
          </div>

          <GlassCard className="p-4 mb-6">
            <h2 className="font-bold mb-4">Target Allocation</h2>
            <div className="space-y-4">
              {assets.map((asset, i) => {
                const diff = asset.currentPercent - asset.targetPercent;
                return (
                  <motion.div
                    key={asset.symbol}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="p-3 rounded-lg bg-white/5"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: asset.color }} />
                        <span className="font-medium">{asset.symbol}</span>
                        <Badge variant="outline" className="text-[9px]">
                          ${asset.currentValue.toLocaleString()}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`text-xs ${diff > 0 ? 'text-red-400' : diff < 0 ? 'text-green-400' : 'text-muted-foreground'}`}>
                          {diff > 0 ? '+' : ''}{diff.toFixed(1)}%
                        </span>
                        <span className="font-mono text-sm w-12 text-right">{asset.targetPercent}%</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex-1">
                        <Slider
                          value={[asset.targetPercent]}
                          onValueChange={([v]) => updateTarget(asset.symbol, v)}
                          min={0}
                          max={100}
                          step={1}
                        />
                      </div>
                      <div className="flex gap-1">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-6 w-6"
                          onClick={() => updateTarget(asset.symbol, Math.max(0, asset.targetPercent - 5))}
                        >
                          <Minus className="w-3 h-3" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-6 w-6"
                          onClick={() => updateTarget(asset.symbol, Math.min(100, asset.targetPercent + 5))}
                        >
                          <Plus className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
            
            <div className="mt-4 flex items-center justify-between p-3 rounded-lg bg-white/5">
              <span className="text-sm">Total Allocation</span>
              <span className={`font-bold ${totalTarget === 100 ? 'text-green-400' : 'text-red-400'}`}>
                {totalTarget}%
                {totalTarget !== 100 && (
                  <span className="text-xs ml-1">({totalTarget > 100 ? '+' : ''}{totalTarget - 100}%)</span>
                )}
              </span>
            </div>
          </GlassCard>

          {rebalanceActions.length > 0 && (
            <GlassCard className="p-4 mb-6">
              <h2 className="font-bold mb-4">Required Actions</h2>
              <div className="space-y-2">
                {rebalanceActions.map((action, i) => (
                  <motion.div
                    key={action.symbol}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className={`flex items-center justify-between p-3 rounded-lg ${
                      action.action === "buy" ? "bg-green-500/10 border border-green-500/20" : "bg-red-500/10 border border-red-500/20"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      {action.action === "buy" ? (
                        <TrendingUp className="w-4 h-4 text-green-400" />
                      ) : (
                        <TrendingUp className="w-4 h-4 text-red-400 rotate-180" />
                      )}
                      <span className={action.action === "buy" ? "text-green-400" : "text-red-400"}>
                        {action.action.toUpperCase()} {action.symbol}
                      </span>
                    </div>
                    <span className="font-mono">${action.amount.toFixed(0)}</span>
                  </motion.div>
                ))}
              </div>
            </GlassCard>
          )}

          <Button 
            className="w-full h-12 bg-gradient-to-r from-blue-500 to-indigo-500 text-white text-lg"
            onClick={handleRebalance}
            disabled={isRebalancing || rebalanceActions.length === 0 || !isBalanced}
            data-testid="button-rebalance"
          >
            {isRebalancing ? (
              <>
                <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                Rebalancing...
              </>
            ) : (
              <>
                <Zap className="w-5 h-5 mr-2" />
                {rebalanceActions.length === 0 ? "Portfolio is Balanced" : "Execute Rebalance"}
              </>
            )}
          </Button>
          {!isBalanced && (
            <p className="text-center text-xs text-red-400 mt-2">
              Total allocation must equal 100%
            </p>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
