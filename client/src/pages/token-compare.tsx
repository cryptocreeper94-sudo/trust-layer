import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeftRight, TrendingUp, TrendingDown, Plus, X, BarChart3 } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { BackButton } from "@/components/page-nav";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { GlassCard } from "@/components/glass-card";
import { Footer } from "@/components/footer";
import orbitLogo from "@assets/generated_images/futuristic_abstract_geometric_logo_symbol_for_orbit.png";

interface TokenData {
  symbol: string;
  name: string;
  price: number;
  change24h: number;
  volume24h: string;
  marketCap: string;
  supply: string;
  holders: string;
  txCount: string;
  apy?: string;
}

const TOKENS: TokenData[] = [
  { symbol: "DWC", name: "DarkWave Coin", price: 0.10, change24h: 5.2, volume24h: "$1.2M", marketCap: "$10M", supply: "100M", holders: "15,234", txCount: "1.2M", apy: "12%" },
  { symbol: "wETH", name: "Wrapped Ethereum", price: 3500, change24h: 2.1, volume24h: "$8.5B", marketCap: "$420B", supply: "120M", holders: "2.1M", txCount: "50M" },
  { symbol: "wSOL", name: "Wrapped Solana", price: 180, change24h: -1.5, volume24h: "$2.1B", marketCap: "$78B", supply: "580M", holders: "1.8M", txCount: "25M" },
  { symbol: "USDC", name: "USD Coin", price: 1.00, change24h: 0.01, volume24h: "$5.2B", marketCap: "$25B", supply: "25B", holders: "3.5M", txCount: "100M" },
  { symbol: "USDT", name: "Tether", price: 1.00, change24h: -0.02, volume24h: "$45B", marketCap: "$95B", supply: "95B", holders: "5.2M", txCount: "200M" },
  { symbol: "stDWC", name: "Staked DarkWave", price: 0.11, change24h: 5.5, volume24h: "$500K", marketCap: "$5M", supply: "45M", holders: "8,432", txCount: "250K", apy: "12%" },
];

const METRICS: { key: keyof TokenData; label: string; format: (v: string | number | undefined) => string }[] = [
  { key: "price", label: "Price", format: (v) => `$${Number(v).toLocaleString()}` },
  { key: "change24h", label: "24h Change", format: (v) => `${Number(v) >= 0 ? "+" : ""}${Number(v).toFixed(2)}%` },
  { key: "volume24h", label: "24h Volume", format: (v) => String(v) },
  { key: "marketCap", label: "Market Cap", format: (v) => String(v) },
  { key: "supply", label: "Total Supply", format: (v) => String(v) },
  { key: "holders", label: "Holders", format: (v) => String(v) },
  { key: "txCount", label: "Transactions", format: (v) => String(v) },
  { key: "apy", label: "Staking APY", format: (v) => v ? String(v) : "N/A" },
];

export default function TokenCompare() {
  const [selectedTokens, setSelectedTokens] = useState<string[]>(["DWC", "wETH"]);

  const addToken = (symbol: string) => {
    if (selectedTokens.length < 4 && !selectedTokens.includes(symbol)) {
      setSelectedTokens([...selectedTokens, symbol]);
    }
  };

  const removeToken = (symbol: string) => {
    if (selectedTokens.length > 1) {
      setSelectedTokens(selectedTokens.filter(s => s !== symbol));
    }
  };

  const getTokenData = (symbol: string) => TOKENS.find(t => t.symbol === symbol);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-background/90 backdrop-blur-xl">
        <div className="container mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <img src={orbitLogo} alt="DarkWave" className="w-7 h-7" />
            <span className="font-display font-bold text-lg hidden sm:inline">DarkWave</span>
          </Link>
          <BackButton />
        </div>
      </nav>

      <main className="flex-1 pt-20 pb-8 px-4">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <div className="flex items-center justify-center gap-3 mb-3">
              <ArrowLeftRight className="w-8 h-8 text-primary" />
              <h1 className="text-3xl font-display font-bold" data-testid="text-title">Token Comparison</h1>
            </div>
            <p className="text-muted-foreground">Compare tokens side-by-side</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex flex-wrap gap-2 mb-6 justify-center"
          >
            {selectedTokens.map((symbol) => (
              <div key={symbol} className="flex items-center gap-1 px-3 py-1.5 bg-primary/20 rounded-full">
                <span className="text-sm font-medium">{symbol}</span>
                {selectedTokens.length > 1 && (
                  <button onClick={() => removeToken(symbol)} className="hover:text-red-400" data-testid={`button-remove-${symbol}`}>
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>
            ))}
            {selectedTokens.length < 4 && (
              <Select onValueChange={addToken}>
                <SelectTrigger className="w-32 h-8" data-testid="select-add-token">
                  <Plus className="w-3 h-3 mr-1" />
                  Add Token
                </SelectTrigger>
                <SelectContent>
                  {TOKENS.filter(t => !selectedTokens.includes(t.symbol)).map((token) => (
                    <SelectItem key={token.symbol} value={token.symbol}>
                      {token.symbol} - {token.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <GlassCard className="overflow-hidden" data-testid="card-comparison-table">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="p-4 text-left text-sm font-medium text-muted-foreground">Metric</th>
                      {selectedTokens.map((symbol) => {
                        const token = getTokenData(symbol);
                        return (
                          <th key={symbol} className="p-4 text-center min-w-[150px]">
                            <div className="flex flex-col items-center gap-1">
                              <span className="text-lg font-bold">{symbol}</span>
                              <span className="text-xs text-muted-foreground">{token?.name}</span>
                            </div>
                          </th>
                        );
                      })}
                    </tr>
                  </thead>
                  <tbody>
                    {METRICS.map((metric, idx) => (
                      <tr key={metric.key} className={idx % 2 === 0 ? "bg-white/5" : ""}>
                        <td className="p-4 text-sm text-muted-foreground">{metric.label}</td>
                        {selectedTokens.map((symbol) => {
                          const token = getTokenData(symbol);
                          const value = token?.[metric.key as keyof TokenData];
                          const isChange = metric.key === "change24h";
                          const isPositive = isChange && typeof value === "number" && value >= 0;
                          const isNegative = isChange && typeof value === "number" && value < 0;

                          return (
                            <td key={symbol} className="p-4 text-center">
                              <span className={`font-medium ${isPositive ? "text-green-400" : isNegative ? "text-red-400" : ""}`}>
                                {isChange && typeof value === "number" && (
                                  value >= 0 ? <TrendingUp className="w-3 h-3 inline mr-1" /> : <TrendingDown className="w-3 h-3 inline mr-1" />
                                )}
                                {metric.format(value as any)}
                              </span>
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </GlassCard>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            <GlassCard className="p-6" data-testid="card-price-chart">
              <div className="flex items-center gap-2 mb-4">
                <BarChart3 className="w-5 h-5 text-primary" />
                <h3 className="font-semibold">Price Comparison</h3>
              </div>
              <div className="space-y-3">
                {selectedTokens.map((symbol) => {
                  const token = getTokenData(symbol);
                  const maxPrice = Math.max(...selectedTokens.map(s => getTokenData(s)?.price || 0));
                  const width = token ? (token.price / maxPrice) * 100 : 0;
                  
                  return (
                    <div key={symbol}>
                      <div className="flex justify-between text-sm mb-1">
                        <span>{symbol}</span>
                        <span className="font-medium">${token?.price.toLocaleString()}</span>
                      </div>
                      <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${width}%` }}
                          transition={{ duration: 0.5 }}
                          className="h-full bg-gradient-to-r from-primary to-purple-500 rounded-full"
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </GlassCard>

            <GlassCard className="p-6" data-testid="card-volume-chart">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="w-5 h-5 text-primary" />
                <h3 className="font-semibold">24h Performance</h3>
              </div>
              <div className="space-y-3">
                {selectedTokens.map((symbol) => {
                  const token = getTokenData(symbol);
                  const change = token?.change24h || 0;
                  
                  return (
                    <div key={symbol} className="flex items-center justify-between p-3 bg-black/20 rounded-lg">
                      <span className="font-medium">{symbol}</span>
                      <span className={`flex items-center gap-1 ${change >= 0 ? "text-green-400" : "text-red-400"}`}>
                        {change >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                        {change >= 0 ? "+" : ""}{change.toFixed(2)}%
                      </span>
                    </div>
                  );
                })}
              </div>
            </GlassCard>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
