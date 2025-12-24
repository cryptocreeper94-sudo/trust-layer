import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Activity, Cpu, HardDrive, Zap, Globe, Server, Clock, TrendingUp, BarChart3 } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { GlassCard } from "@/components/glass-card";
import { InfoButton } from "@/components/info-button";
import orbitLogo from "@assets/generated_images/futuristic_abstract_geometric_logo_symbol_for_orbit.png";

interface LiveStat {
  value: number;
  trend: number;
  history: number[];
}

export default function NetworkStats() {
  const [tps, setTps] = useState<LiveStat>({ value: 187432, trend: 2.3, history: [] });
  const [blockTime, setBlockTime] = useState(398);
  const [activeValidators, setActiveValidators] = useState(5);
  const [pendingTx, setPendingTx] = useState(847);
  const [networkLoad, setNetworkLoad] = useState(34);
  const [currentBlock, setCurrentBlock] = useState(8847623);

  useEffect(() => {
    const tpsHistory: number[] = [];
    for (let i = 0; i < 60; i++) {
      tpsHistory.push(180000 + Math.random() * 20000);
    }
    setTps(prev => ({ ...prev, history: tpsHistory }));

    const interval = setInterval(() => {
      setTps(prev => {
        const newValue = 175000 + Math.random() * 30000;
        const newHistory = [...prev.history.slice(1), newValue];
        const trend = ((newValue - prev.value) / prev.value) * 100;
        return { value: Math.round(newValue), trend: parseFloat(trend.toFixed(2)), history: newHistory };
      });
      setBlockTime(395 + Math.random() * 10);
      setPendingTx(Math.floor(500 + Math.random() * 1000));
      setNetworkLoad(Math.floor(25 + Math.random() * 30));
      setCurrentBlock(prev => prev + 1);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const maxTps = Math.max(...tps.history, 1);
  const minTps = Math.min(...tps.history.filter(v => v > 0));

  return (
    <div className="min-h-screen bg-background text-foreground">
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-background/90 backdrop-blur-xl">
        <div className="container mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <img src={orbitLogo} alt="DarkWave" className="w-7 h-7" />
            <span className="font-display font-bold text-lg tracking-tight hidden sm:inline">DarkWave</span>
          </Link>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="border-green-500/50 text-green-400 bg-green-500/10 text-[10px] sm:text-xs animate-pulse">
              <div className="w-1.5 h-1.5 rounded-full bg-green-400 mr-1.5" /> Mainnet Live
            </Badge>
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
        <div className="container mx-auto max-w-6xl">
          <div className="flex items-center gap-3 mb-8">
            <h1 className="text-2xl md:text-3xl font-display font-bold">Network Performance</h1>
            <InfoButton 
              title="Real-Time Stats" 
              content="This dashboard shows live network performance metrics updated every 2 seconds. TPS (Transactions Per Second) represents the chain's throughput capacity." 
              variant="info"
            />
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <GlassCard glow data-testid="stat-tps">
              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Activity className="w-4 h-4 text-primary" />
                    <span className="text-xs text-muted-foreground">TPS</span>
                  </div>
                  <Badge className={`text-[10px] ${tps.trend >= 0 ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                    <TrendingUp className={`w-2.5 h-2.5 mr-0.5 ${tps.trend < 0 ? 'rotate-180' : ''}`} />
                    {Math.abs(tps.trend).toFixed(1)}%
                  </Badge>
                </div>
                <motion.div 
                  key={tps.value}
                  initial={{ scale: 1.1, opacity: 0.5 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="text-3xl font-bold font-mono text-primary"
                >
                  {tps.value.toLocaleString()}
                </motion.div>
                <div className="text-[10px] text-muted-foreground">transactions/sec</div>
              </div>
            </GlassCard>

            <GlassCard data-testid="stat-block-time">
              <div className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="w-4 h-4 text-secondary" />
                  <span className="text-xs text-muted-foreground">Block Time</span>
                </div>
                <div className="text-3xl font-bold font-mono text-secondary">
                  {blockTime.toFixed(0)}
                </div>
                <div className="text-[10px] text-muted-foreground">milliseconds</div>
              </div>
            </GlassCard>

            <GlassCard data-testid="stat-validators">
              <div className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Server className="w-4 h-4 text-purple-400" />
                  <span className="text-xs text-muted-foreground">Validators</span>
                </div>
                <div className="text-3xl font-bold font-mono text-purple-400">
                  {activeValidators}
                </div>
                <div className="text-[10px] text-muted-foreground">active nodes</div>
              </div>
            </GlassCard>

            <GlassCard data-testid="stat-network-load">
              <div className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Cpu className="w-4 h-4 text-amber-400" />
                  <span className="text-xs text-muted-foreground">Network Load</span>
                </div>
                <div className="text-3xl font-bold font-mono text-amber-400">
                  {networkLoad}%
                </div>
                <div className="text-[10px] text-muted-foreground">capacity used</div>
              </div>
            </GlassCard>
          </div>

          <GlassCard glow className="mb-6" data-testid="chart-tps">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-primary" />
                  <h3 className="font-bold">TPS Heatmap (Last 60 Samples)</h3>
                </div>
                <div className="flex items-center gap-4 text-xs">
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded bg-primary/30" />
                    <span className="text-muted-foreground">Low</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded bg-primary" />
                    <span className="text-muted-foreground">High</span>
                  </div>
                </div>
              </div>

              <div className="relative h-32 bg-white/5 rounded-xl overflow-hidden">
                <div className="absolute inset-0 flex items-end">
                  {tps.history.map((value, i) => {
                    const height = maxTps > minTps ? ((value - minTps) / (maxTps - minTps)) * 100 : 50;
                    const intensity = Math.min(1, (value - minTps) / ((maxTps - minTps) || 1));
                    return (
                      <motion.div
                        key={i}
                        initial={{ height: 0 }}
                        animate={{ height: `${Math.max(10, height)}%` }}
                        className="flex-1 mx-[1px] rounded-t"
                        style={{
                          backgroundColor: `rgba(0, 255, 255, ${0.2 + intensity * 0.6})`,
                        }}
                      />
                    );
                  })}
                </div>
                
                <div className="absolute top-2 left-3 text-xs text-muted-foreground">
                  Max: {maxTps.toLocaleString()} TPS
                </div>
                <div className="absolute bottom-2 left-3 text-xs text-muted-foreground">
                  Min: {Math.round(minTps).toLocaleString()} TPS
                </div>
              </div>
            </div>
          </GlassCard>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <GlassCard data-testid="card-chain-info">
              <div className="p-6">
                <h3 className="font-bold mb-4 flex items-center gap-2">
                  <Globe className="w-5 h-5 text-blue-400" /> Chain Information
                </h3>
                <div className="space-y-3">
                  {[
                    { label: "Chain ID", value: "darkwave-1" },
                    { label: "Current Block", value: currentBlock.toLocaleString() },
                    { label: "Consensus", value: "Proof of Authority" },
                    { label: "Finality", value: "Instant (1 block)" },
                    { label: "Native Token", value: "DWT" },
                    { label: "Decimals", value: "18" },
                  ].map(({ label, value }) => (
                    <div key={label} className="flex justify-between text-sm">
                      <span className="text-muted-foreground">{label}</span>
                      <span className="font-mono text-white">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </GlassCard>

            <GlassCard data-testid="card-validators">
              <div className="p-6">
                <h3 className="font-bold mb-4 flex items-center gap-2">
                  <Server className="w-5 h-5 text-purple-400" /> Active Validators
                </h3>
                <div className="space-y-3">
                  {[
                    { name: "Founders Validator", status: "active", uptime: "99.99%", blocks: 4423811 },
                    { name: "Genesis Node #1", status: "active", uptime: "99.97%", blocks: 2211456 },
                    { name: "Genesis Node #2", status: "active", uptime: "99.95%", blocks: 2206789 },
                    { name: "Community Validator", status: "pending", uptime: "-", blocks: 0 },
                    { name: "Partner Node", status: "pending", uptime: "-", blocks: 0 },
                  ].map((validator) => (
                    <div key={validator.name} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${validator.status === 'active' ? 'bg-green-400' : 'bg-amber-400'}`} />
                        <span className="text-white">{validator.name}</span>
                      </div>
                      <span className="font-mono text-muted-foreground">{validator.uptime}</span>
                    </div>
                  ))}
                </div>
              </div>
            </GlassCard>
          </div>
        </div>
      </main>
    </div>
  );
}
