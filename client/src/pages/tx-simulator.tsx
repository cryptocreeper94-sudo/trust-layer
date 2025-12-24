import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "wouter";
import {
  ArrowLeft, Play, Shield, AlertTriangle, CheckCircle2, XCircle,
  Zap, ArrowRight, RefreshCw, Info, ExternalLink, Copy
} from "lucide-react";
import { Footer } from "@/components/footer";
import { GlassCard } from "@/components/glass-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import darkwaveLogo from "@assets/generated_images/darkwave_token_transparent.png";

interface SimulationResult {
  success: boolean;
  gasUsed: number;
  gasPrice: number;
  totalCost: number;
  changes: {
    type: "token" | "nft" | "approval";
    direction: "in" | "out";
    asset: string;
    amount: string;
    value: string;
  }[];
  warnings: string[];
  errors: string[];
}

const SAMPLE_RESULT: SimulationResult = {
  success: true,
  gasUsed: 145000,
  gasPrice: 0.0001,
  totalCost: 0.0145,
  changes: [
    { type: "token", direction: "out", asset: "DWC", amount: "10,000", value: "$1,520" },
    { type: "token", direction: "in", asset: "USDC", amount: "1,520", value: "$1,520" },
  ],
  warnings: [
    "Price impact: 0.15% - Within acceptable range",
  ],
  errors: [],
};

const EXAMPLE_TXS = [
  { name: "Token Swap", desc: "Swap DWC for USDC", type: "swap" },
  { name: "Add Liquidity", desc: "Add to DWC/USDC pool", type: "liquidity" },
  { name: "Stake DWC", desc: "Stake tokens for rewards", type: "stake" },
  { name: "NFT Mint", desc: "Mint a new NFT", type: "mint" },
];

export default function TxSimulator() {
  const [txData, setTxData] = useState("");
  const [isSimulating, setIsSimulating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<SimulationResult | null>(null);

  const handleSimulate = () => {
    setIsSimulating(true);
    setProgress(0);
    setResult(null);
    
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 20;
      });
    }, 200);

    setTimeout(() => {
      setIsSimulating(false);
      setProgress(100);
      setResult(SAMPLE_RESULT);
    }, 1500);
  };

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
                className="p-3 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border border-emerald-500/30"
                animate={{ 
                  boxShadow: ["0 0 20px rgba(16,185,129,0.2)", "0 0 50px rgba(16,185,129,0.4)", "0 0 20px rgba(16,185,129,0.2)"]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Shield className="w-7 h-7 text-emerald-400" />
              </motion.div>
            </div>
            <h1 className="text-2xl md:text-3xl font-display font-bold mb-2">
              Transaction <span className="text-emerald-400">Simulator</span>
            </h1>
            <p className="text-sm text-muted-foreground">
              Preview exactly what will happen before you sign
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <GlassCard className="p-4">
              <h2 className="font-bold mb-4 flex items-center gap-2">
                <Play className="w-4 h-4 text-primary" />
                Transaction Input
              </h2>
              
              <div className="mb-4">
                <p className="text-xs text-muted-foreground mb-2">Quick Templates:</p>
                <div className="grid grid-cols-2 gap-2">
                  {EXAMPLE_TXS.map((tx) => (
                    <Button
                      key={tx.type}
                      variant="outline"
                      size="sm"
                      className="justify-start h-auto py-2 text-left"
                      onClick={() => setTxData(`// ${tx.name}\n// ${tx.desc}`)}
                    >
                      <div>
                        <p className="text-xs font-medium">{tx.name}</p>
                        <p className="text-[10px] text-muted-foreground">{tx.desc}</p>
                      </div>
                    </Button>
                  ))}
                </div>
              </div>

              <Textarea
                placeholder="Paste transaction data or contract call..."
                value={txData}
                onChange={(e) => setTxData(e.target.value)}
                className="min-h-[200px] bg-white/5 border-white/10 font-mono text-xs"
                data-testid="input-tx-data"
              />

              <Button 
                className="w-full mt-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white"
                onClick={handleSimulate}
                disabled={isSimulating}
                data-testid="button-simulate"
              >
                {isSimulating ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Simulating...
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 mr-2" />
                    Simulate Transaction
                  </>
                )}
              </Button>
              
              {isSimulating && (
                <Progress value={progress} className="mt-2 h-1" />
              )}
            </GlassCard>

            <AnimatePresence mode="wait">
              {result && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  <GlassCard glow className="p-4">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="font-bold flex items-center gap-2">
                        {result.success ? (
                          <CheckCircle2 className="w-4 h-4 text-green-400" />
                        ) : (
                          <XCircle className="w-4 h-4 text-red-400" />
                        )}
                        Simulation Result
                      </h2>
                      <Badge className={result.success ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}>
                        {result.success ? "Success" : "Failed"}
                      </Badge>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <h3 className="text-sm font-medium mb-2">Expected Changes</h3>
                        <div className="space-y-2">
                          {result.changes.map((change, i) => (
                            <motion.div
                              key={i}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: i * 0.1 }}
                              className={`flex items-center justify-between p-3 rounded-lg ${
                                change.direction === "in" ? "bg-green-500/10 border border-green-500/20" : "bg-red-500/10 border border-red-500/20"
                              }`}
                            >
                              <div className="flex items-center gap-2">
                                {change.direction === "in" ? (
                                  <ArrowRight className="w-4 h-4 text-green-400" />
                                ) : (
                                  <ArrowRight className="w-4 h-4 text-red-400 rotate-180" />
                                )}
                                <span className="font-medium">{change.asset}</span>
                              </div>
                              <div className="text-right">
                                <p className={`font-mono ${change.direction === "in" ? "text-green-400" : "text-red-400"}`}>
                                  {change.direction === "in" ? "+" : "-"}{change.amount}
                                </p>
                                <p className="text-xs text-muted-foreground">{change.value}</p>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-2">
                        <div className="p-2 rounded-lg bg-white/5 text-center">
                          <p className="text-[10px] text-muted-foreground">Gas Used</p>
                          <p className="font-mono text-sm">{result.gasUsed.toLocaleString()}</p>
                        </div>
                        <div className="p-2 rounded-lg bg-white/5 text-center">
                          <p className="text-[10px] text-muted-foreground">Gas Price</p>
                          <p className="font-mono text-sm">${result.gasPrice}</p>
                        </div>
                        <div className="p-2 rounded-lg bg-white/5 text-center">
                          <p className="text-[10px] text-muted-foreground">Total Cost</p>
                          <p className="font-mono text-sm text-primary">${result.totalCost}</p>
                        </div>
                      </div>

                      {result.warnings.length > 0 && (
                        <div className="p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
                          <div className="flex items-center gap-2 mb-1">
                            <AlertTriangle className="w-4 h-4 text-yellow-400" />
                            <span className="text-sm font-medium text-yellow-400">Warnings</span>
                          </div>
                          {result.warnings.map((warning, i) => (
                            <p key={i} className="text-xs text-yellow-400/80">{warning}</p>
                          ))}
                        </div>
                      )}

                      {result.errors.length > 0 && (
                        <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20">
                          <div className="flex items-center gap-2 mb-1">
                            <XCircle className="w-4 h-4 text-red-400" />
                            <span className="text-sm font-medium text-red-400">Errors</span>
                          </div>
                          {result.errors.map((error, i) => (
                            <p key={i} className="text-xs text-red-400/80">{error}</p>
                          ))}
                        </div>
                      )}

                      <Button className="w-full gap-2" disabled={!result.success} data-testid="button-execute-transaction">
                        <Zap className="w-4 h-4" />
                        {result.success ? "Execute Transaction" : "Cannot Execute"}
                      </Button>
                    </div>
                  </GlassCard>
                </motion.div>
              )}

              {!result && !isSimulating && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <GlassCard className="p-8 h-full flex flex-col items-center justify-center text-center">
                    <Shield className="w-16 h-16 text-white/10 mb-4" />
                    <h3 className="font-bold mb-2">Safe Transaction Preview</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Enter transaction data and simulate to see exactly what will happen before you sign.
                    </p>
                    <div className="space-y-2 text-xs text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-3 h-3 text-green-400" />
                        See token balance changes
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-3 h-3 text-green-400" />
                        Detect potential risks
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-3 h-3 text-green-400" />
                        Estimate gas costs
                      </div>
                    </div>
                  </GlassCard>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
