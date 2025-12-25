import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { 
  ArrowLeft, Calculator, TrendingUp, Coins, Target, Rocket, 
  Sparkles, DollarSign, Calendar, BarChart3, Info
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import darkwaveLogo from "@assets/generated_images/darkwave_token_transparent.png";
import quantumRealm from "@assets/generated_images/quantum_dimension_realm.png";
import deepSpace from "@assets/generated_images/deep_space_station.png";

const TOKEN_PRICE = 0.008;
const TIER_BONUSES = [
  { min: 2500, bonus: 25, name: "Genesis" },
  { min: 500, bonus: 15, name: "Founder" },
  { min: 100, bonus: 10, name: "Pioneer" },
  { min: 25, bonus: 5, name: "Early Bird" },
];

function HolographicCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={`relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-gray-900/90 to-black/80 backdrop-blur-xl ${className}`}
      style={{ boxShadow: "0 0 60px rgba(0,200,255,0.1), inset 0 1px 0 rgba(255,255,255,0.1)" }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent pointer-events-none" />
      <div className="absolute inset-0 opacity-20 pointer-events-none" style={{
        background: "repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.02) 10px, rgba(255,255,255,0.02) 20px)",
      }} />
      {children}
    </div>
  );
}

function ResultCard({ label, value, subtext, gradient }: { label: string; value: string; subtext?: string; gradient: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`p-4 rounded-xl bg-gradient-to-br ${gradient} border border-white/10`}
    >
      <p className="text-gray-400 text-sm">{label}</p>
      <p className="text-2xl font-bold text-white mt-1">{value}</p>
      {subtext && <p className="text-xs text-gray-500 mt-1">{subtext}</p>}
    </motion.div>
  );
}

export default function InvestmentSimulator() {
  const [investment, setInvestment] = useState(100);
  const [targetPrice, setTargetPrice] = useState(0.10);
  const [holdingPeriod, setHoldingPeriod] = useState(12);

  const calculations = useMemo(() => {
    const matchedTier = TIER_BONUSES.find(t => investment >= t.min) || { bonus: 0, name: "Standard" };
    const baseTokens = investment / TOKEN_PRICE;
    const bonusTokens = baseTokens * (matchedTier.bonus / 100);
    const totalTokens = baseTokens + bonusTokens;
    
    const futureValue = totalTokens * targetPrice;
    const profit = futureValue - investment;
    const roi = ((futureValue - investment) / investment) * 100;
    const multiplier = futureValue / investment;
    
    return {
      tier: matchedTier,
      baseTokens,
      bonusTokens,
      totalTokens,
      futureValue,
      profit,
      roi,
      multiplier,
    };
  }, [investment, targetPrice]);

  const priceScenarios = [
    { label: "Conservative", price: 0.05, color: "text-blue-400" },
    { label: "Moderate", price: 0.15, color: "text-purple-400" },
    { label: "Optimistic", price: 0.50, color: "text-pink-400" },
    { label: "Moonshot", price: 1.00, color: "text-amber-400" },
  ];

  return (
    <div className="min-h-screen bg-[#080c18] text-white">
      <div 
        className="absolute inset-0 opacity-30"
        style={{
          background: "radial-gradient(circle at 30% 20%, rgba(168,85,247,0.15) 0%, transparent 50%), radial-gradient(circle at 70% 80%, rgba(0,200,255,0.15) 0%, transparent 50%)",
        }}
      />
      
      <div className="absolute inset-0">
        <img src={quantumRealm} alt="" className="w-full h-full object-cover opacity-10" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#080c18] via-transparent to-[#080c18]" />
      </div>

      <div className="relative max-w-6xl mx-auto px-4 py-12">
        <Link href="/presale" className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition-colors" data-testid="link-back-presale">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Presale</span>
        </Link>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/30 mb-6">
            <Calculator className="w-4 h-4 text-purple-400" />
            <span className="text-purple-300 text-sm font-medium">Investment Simulator</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              What If Calculator
            </span>
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Explore hypothetical scenarios. This is for entertainment only - not financial advice.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8">
          <HolographicCard className="p-8">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-cyan-400" />
              Your Investment
            </h2>
            
            <div className="space-y-6">
              <div>
                <Label className="text-gray-400 mb-2 block">Investment Amount (USD)</Label>
                <Input
                  type="number"
                  value={investment}
                  onChange={(e) => setInvestment(Math.max(0, parseFloat(e.target.value) || 0))}
                  className="bg-black/50 border-white/20 text-white text-2xl h-14"
                  data-testid="input-investment"
                />
                <div className="flex gap-2 mt-2">
                  {[25, 100, 500, 2500].map(amount => (
                    <Button
                      key={amount}
                      variant="outline"
                      size="sm"
                      onClick={() => setInvestment(amount)}
                      className={`border-white/10 ${investment === amount ? 'bg-purple-500/20 border-purple-500/50' : ''}`}
                      data-testid={`button-preset-${amount}`}
                    >
                      ${amount}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="p-4 rounded-xl bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border border-cyan-500/20" data-testid="display-tier-info">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Your Tier</span>
                  <Badge className="bg-gradient-to-r from-cyan-500 to-purple-500" data-testid="badge-tier-name">
                    {calculations.tier.name} (+{calculations.tier.bonus}%)
                  </Badge>
                </div>
              </div>

              <div>
                <Label className="text-gray-400 mb-2 block">Target Token Price (USD)</Label>
                <div className="flex items-center gap-4">
                  <span className="text-gray-500 w-16">${targetPrice.toFixed(2)}</span>
                  <Slider
                    value={[targetPrice]}
                    onValueChange={([v]) => setTargetPrice(v)}
                    min={0.01}
                    max={2.00}
                    step={0.01}
                    className="flex-1"
                    data-testid="slider-target-price"
                  />
                </div>
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>$0.01</span>
                  <span className="text-cyan-400">Current: ${TOKEN_PRICE}</span>
                  <span>$2.00</span>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-2">
                {priceScenarios.map(scenario => (
                  <Button
                    key={scenario.label}
                    variant="outline"
                    size="sm"
                    onClick={() => setTargetPrice(scenario.price)}
                    className={`border-white/10 text-xs ${targetPrice === scenario.price ? 'bg-purple-500/20 border-purple-500/50' : ''}`}
                    data-testid={`button-scenario-${scenario.label.toLowerCase()}`}
                  >
                    <span className={scenario.color}>${scenario.price}</span>
                  </Button>
                ))}
              </div>
            </div>
          </HolographicCard>

          <HolographicCard className="p-8">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-green-400" />
              Hypothetical Results
            </h2>
            
            <div className="grid grid-cols-2 gap-4 mb-6" data-testid="results-tokens">
              <ResultCard
                label="Base Tokens"
                value={calculations.baseTokens.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                subtext={`@ $${TOKEN_PRICE} each`}
                gradient="from-cyan-500/10 to-blue-500/10"
              />
              <ResultCard
                label="Bonus Tokens"
                value={`+${calculations.bonusTokens.toLocaleString(undefined, { maximumFractionDigits: 0 })}`}
                subtext={`${calculations.tier.bonus}% tier bonus`}
                gradient="from-green-500/10 to-emerald-500/10"
              />
            </div>

            <div className="p-6 rounded-xl bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-amber-500/10 border border-purple-500/20 mb-6" data-testid="display-total-tokens">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-gray-400 text-sm">Total DWC Tokens</p>
                  <p className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent" data-testid="text-total-tokens">
                    {calculations.totalTokens.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                  </p>
                </div>
                <img src={darkwaveLogo} alt="DWC" className="w-16 h-16 object-contain opacity-80" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6" data-testid="results-value">
              <ResultCard
                label="Future Value"
                value={`$${calculations.futureValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}`}
                subtext={`@ $${targetPrice.toFixed(2)}/token`}
                gradient="from-amber-500/10 to-orange-500/10"
              />
              <ResultCard
                label="Potential Profit"
                value={`$${calculations.profit.toLocaleString(undefined, { maximumFractionDigits: 0 })}`}
                subtext={calculations.profit > 0 ? `${calculations.roi.toFixed(0)}% ROI` : ""}
                gradient={calculations.profit > 0 ? "from-green-500/10 to-emerald-500/10" : "from-red-500/10 to-rose-500/10"}
              />
            </div>

            <div className="p-4 rounded-xl bg-gradient-to-r from-amber-500/10 to-pink-500/10 border border-amber-500/20" data-testid="display-multiplier">
              <div className="flex items-center gap-3">
                <Rocket className="w-8 h-8 text-amber-400" />
                <div>
                  <p className="text-gray-400 text-sm">Multiplier</p>
                  <p className="text-3xl font-bold text-amber-400" data-testid="text-multiplier">
                    {calculations.multiplier.toFixed(1)}x
                  </p>
                </div>
              </div>
            </div>
          </HolographicCard>
        </div>

        <HolographicCard className="p-6 mt-8" data-testid="card-disclaimer">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-cyan-400 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="text-white font-semibold mb-2">Important Disclaimer</h3>
              <p className="text-gray-400 text-sm">
                This simulator is for educational and entertainment purposes only. Cryptocurrency investments 
                involve significant risk, and past performance does not guarantee future results. 
                The hypothetical scenarios shown here are not predictions or financial advice. 
                Always do your own research and never invest more than you can afford to lose.
              </p>
            </div>
          </div>
        </HolographicCard>

        <div className="text-center mt-8">
          <Link href="/presale">
            <Button 
              className="bg-gradient-to-r from-cyan-600 via-purple-600 to-pink-600 px-8"
              data-testid="button-go-to-presale"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Go to Presale
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
