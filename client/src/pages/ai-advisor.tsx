import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "wouter";
import {
  ArrowLeft, Brain, Sparkles, TrendingUp, Shield, Zap,
  PieChart, Target, AlertCircle, CheckCircle2, RefreshCw, Send, Lock, Wallet
} from "lucide-react";
import { PieChart as RechartsPie, Pie, Cell, ResponsiveContainer } from "recharts";
import { Footer } from "@/components/footer";
import { GlassCard } from "@/components/glass-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import darkwaveLogo from "@assets/generated_images/darkwave_token_transparent.png";
import { useAuth } from "@/hooks/use-auth";

const RISK_PROFILES = [
  { name: "Conservative", color: "#22c55e", allocation: { dwc: 20, staking: 40, stablecoins: 35, nft: 5 } },
  { name: "Balanced", color: "#3b82f6", allocation: { dwc: 35, staking: 30, stablecoins: 25, nft: 10 } },
  { name: "Aggressive", color: "#f59e0b", allocation: { dwc: 50, staking: 25, stablecoins: 10, nft: 15 } },
  { name: "Degen", color: "#ef4444", allocation: { dwc: 70, staking: 10, stablecoins: 5, nft: 15 } },
];

export default function AIAdvisor() {
  const { user } = useAuth();
  const isConnected = !!user;
  const [riskLevel, setRiskLevel] = useState([50]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analyzed, setAnalyzed] = useState(false);
  const [question, setQuestion] = useState("");

  const riskProfile = RISK_PROFILES[Math.floor(riskLevel[0] / 34)];
  const allocationData = Object.entries(riskProfile.allocation).map(([name, value]) => ({
    name: name.toUpperCase(),
    value,
    color: name === "dwc" ? "#8b5cf6" : name === "staking" ? "#06b6d4" : name === "stablecoins" ? "#22c55e" : "#ec4899",
  }));

  const handleAnalyze = () => {
    if (!isConnected) return;
    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);
      setAnalyzed(true);
    }, 2000);
  };

  if (!isConnected) {
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

        <main className="flex-1 pt-16 pb-8 px-4 flex items-center justify-center">
          <GlassCard glow className="p-8 text-center max-w-md">
            <Brain className="w-16 h-16 mx-auto mb-4 text-cyan-400" />
            <h2 className="text-2xl font-bold mb-2">AI Portfolio Advisor</h2>
            <p className="text-muted-foreground mb-6">
              Get personalized investment recommendations based on your risk profile and portfolio analysis powered by AI.
            </p>
            <Link href="/wallet">
              <Button className="bg-gradient-to-r from-cyan-500 to-blue-500" data-testid="button-connect-advisor">
                <Wallet className="w-4 h-4 mr-2" />
                Connect Wallet to Analyze
              </Button>
            </Link>
          </GlassCard>
        </main>

        <Footer />
      </div>
    );
  }

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
        <div className="container mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-6"
          >
            <div className="flex items-center justify-center gap-2 mb-3">
              <motion.div 
                className="p-3 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/30"
                animate={{ 
                  boxShadow: ["0 0 20px rgba(6,182,212,0.2)", "0 0 50px rgba(6,182,212,0.4)", "0 0 20px rgba(6,182,212,0.2)"]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Brain className="w-7 h-7 text-cyan-400" />
              </motion.div>
            </div>
            <h1 className="text-2xl md:text-3xl font-display font-bold mb-2">
              AI Portfolio <span className="text-cyan-400">Advisor</span>
            </h1>
            <p className="text-sm text-muted-foreground">
              Personalized recommendations powered by machine learning
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
            <GlassCard glow className="p-4">
              <h3 className="font-bold mb-4 flex items-center gap-2">
                <Target className="w-4 h-4 text-primary" />
                Risk Profile
              </h3>
              
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm">Risk Tolerance</span>
                  <Badge style={{ backgroundColor: `${riskProfile.color}20`, color: riskProfile.color }}>
                    {riskProfile.name}
                  </Badge>
                </div>
                <Slider
                  value={riskLevel}
                  onValueChange={setRiskLevel}
                  min={0}
                  max={100}
                  step={1}
                  className="mb-2"
                  data-testid="slider-risk-level"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Conservative</span>
                  <span>Degen</span>
                </div>
              </div>

              <div className="flex items-center justify-center mb-4">
                <div className="w-40 h-40">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsPie>
                      <Pie data={allocationData} cx="50%" cy="50%" innerRadius={40} outerRadius={60} dataKey="value" strokeWidth={0}>
                        {allocationData.map((entry, i) => (
                          <Cell key={i} fill={entry.color} />
                        ))}
                      </Pie>
                    </RechartsPie>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="space-y-2 mb-4">
                <p className="text-xs text-muted-foreground text-center">Recommended Allocation</p>
                {allocationData.map((item) => (
                  <div key={item.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                      <span className="text-sm">{item.name}</span>
                    </div>
                    <span className="font-mono text-sm">{item.value}%</span>
                  </div>
                ))}
              </div>

              <Button 
                className="w-full bg-gradient-to-r from-cyan-500 to-blue-500"
                onClick={handleAnalyze}
                disabled={isAnalyzing}
                data-testid="button-analyze"
              >
                {isAnalyzing ? (
                  <><RefreshCw className="w-4 h-4 mr-2 animate-spin" /> Analyzing...</>
                ) : (
                  <><Sparkles className="w-4 h-4 mr-2" /> Analyze My Portfolio</>
                )}
              </Button>
            </GlassCard>

            <GlassCard className="p-4">
              <h3 className="font-bold mb-4 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                AI Recommendations
              </h3>

              <AnimatePresence mode="wait">
                {analyzed ? (
                  <motion.div
                    key="results"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="space-y-3"
                  >
                    <div className="p-4 rounded-lg bg-white/5 text-center">
                      <CheckCircle2 className="w-8 h-8 mx-auto mb-2 text-green-400" />
                      <p className="font-medium mb-1">Portfolio Analyzed!</p>
                      <p className="text-xs text-muted-foreground">
                        No holdings detected yet. Start by acquiring some DWC to receive personalized recommendations.
                      </p>
                    </div>
                    <div className="p-3 rounded-lg bg-cyan-500/10 border border-cyan-500/20">
                      <div className="flex items-start gap-2">
                        <TrendingUp className="w-4 h-4 text-cyan-400 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium">Get Started</p>
                          <p className="text-xs text-muted-foreground">
                            Use the faucet to claim free testnet DWC, then explore staking and trading to build your portfolio.
                          </p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="empty"
                    className="h-64 flex flex-col items-center justify-center text-center"
                  >
                    <Brain className="w-12 h-12 text-white/10 mb-4" />
                    <p className="text-sm text-muted-foreground">
                      Set your risk profile and click "Analyze" to get personalized recommendations
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </GlassCard>
          </div>

          <GlassCard className="p-4">
            <h3 className="font-bold mb-4 flex items-center gap-2">
              <Brain className="w-4 h-4 text-primary" />
              Ask AI Anything
            </h3>
            <div className="flex gap-3">
              <Textarea
                placeholder="Ask about investment strategies, market analysis, or portfolio optimization..."
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                className="bg-white/5 border-white/10 min-h-[60px] resize-none"
                data-testid="input-ai-question"
              />
              <Button className="bg-gradient-to-r from-cyan-500 to-blue-500 h-auto" data-testid="button-ask-ai">
                <Send className="w-4 h-4" />
              </Button>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {["Best staking strategy?", "When to rebalance?", "Is DWC undervalued?", "NFT investment tips"].map((q) => (
                <Button
                  key={q}
                  variant="outline"
                  size="sm"
                  className="text-xs"
                  onClick={() => setQuestion(q)}
                  data-testid={`button-quick-question-${q.slice(0, 10)}`}
                >
                  {q}
                </Button>
              ))}
            </div>
          </GlassCard>
        </div>
      </main>

      <Footer />
    </div>
  );
}
