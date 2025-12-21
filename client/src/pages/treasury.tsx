import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Wallet, Send, RefreshCw, Copy, Check, AlertCircle } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import orbitLogo from "@assets/generated_images/futuristic_abstract_geometric_logo_symbol_for_orbit.png";

interface TreasuryInfo {
  address: string;
  balance: string;
  balance_raw: string;
  total_supply: string;
}

interface DistributeResponse {
  success: boolean;
  tx_hash?: string;
  from: string;
  to: string;
  amount: string;
  new_treasury_balance: string;
}

async function fetchTreasuryInfo(): Promise<TreasuryInfo> {
  const response = await fetch("/api/blockchain/treasury");
  if (!response.ok) {
    throw new Error("Failed to fetch treasury info");
  }
  return response.json();
}

async function distributeTokens(data: { to: string; amount: string }): Promise<DistributeResponse> {
  const response = await fetch("/api/blockchain/treasury/distribute", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Distribution failed");
  }
  return response.json();
}

export default function Treasury() {
  const [toAddress, setToAddress] = useState("");
  const [amount, setAmount] = useState("");
  const [copied, setCopied] = useState(false);
  const [lastTx, setLastTx] = useState<DistributeResponse | null>(null);
  
  const queryClient = useQueryClient();

  const { data: treasury, isLoading, error, refetch } = useQuery({
    queryKey: ["treasury-info"],
    queryFn: fetchTreasuryInfo,
    refetchInterval: 5000,
  });

  const distributeMutation = useMutation({
    mutationFn: distributeTokens,
    onSuccess: (data) => {
      setLastTx(data);
      setToAddress("");
      setAmount("");
      queryClient.invalidateQueries({ queryKey: ["treasury-info"] });
    },
  });

  const copyAddress = () => {
    if (treasury?.address) {
      navigator.clipboard.writeText(treasury.address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDistribute = (e: React.FormEvent) => {
    e.preventDefault();
    if (!toAddress || !amount) return;
    
    const amountInWei = BigInt(parseFloat(amount) * 1e18).toString();
    distributeMutation.mutate({ to: toAddress, amount: amountInWei });
  };

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden selection:bg-primary/20 selection:text-primary">
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-md">
        <div className="container mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/">
            <div className="flex items-center gap-2 text-muted-foreground hover:text-white transition-colors cursor-pointer group">
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              <span className="font-display font-medium">Back to DarkWave</span>
            </div>
          </Link>
          <div className="flex items-center gap-3">
            <img src={orbitLogo} alt="Logo" className="w-8 h-8" />
            <span className="font-display font-bold text-xl">Treasury</span>
          </div>
        </div>
      </nav>

      <div className="pt-32 pb-20 container mx-auto px-6">
        <div className="max-w-4xl mx-auto space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center space-y-4"
          >
            <h1 className="text-4xl md:text-5xl font-display font-bold">
              DWT Treasury
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Manage the DarkWave Token distribution. The treasury holds 100 million DWT tokens
              that can be distributed to team members, partners, and community members.
            </p>
          </motion.div>

          <div className="grid gap-6 md:grid-cols-2">
            <Card className="bg-black/40 border-white/10 p-6 backdrop-blur-xl">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold font-display flex items-center gap-2">
                  <Wallet className="w-5 h-5 text-primary" />
                  Treasury Wallet
                </h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => refetch()}
                  disabled={isLoading}
                  data-testid="button-refresh-treasury"
                >
                  <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                </Button>
              </div>

              {error ? (
                <div className="text-red-400 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  <span>Blockchain node offline. Start the blockchain to view treasury.</span>
                </div>
              ) : isLoading ? (
                <div className="space-y-4 animate-pulse">
                  <div className="h-6 bg-white/10 rounded w-3/4"></div>
                  <div className="h-10 bg-white/10 rounded"></div>
                </div>
              ) : treasury ? (
                <div className="space-y-4">
                  <div>
                    <Label className="text-muted-foreground text-xs uppercase tracking-wider">Address</Label>
                    <div className="flex items-center gap-2 mt-1">
                      <code className="flex-1 text-sm font-mono bg-white/5 px-3 py-2 rounded border border-white/10 truncate" data-testid="text-treasury-address">
                        {treasury.address}
                      </code>
                      <Button variant="ghost" size="sm" onClick={copyAddress} data-testid="button-copy-address">
                        {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                      </Button>
                    </div>
                  </div>
                  
                  <div>
                    <Label className="text-muted-foreground text-xs uppercase tracking-wider">Balance</Label>
                    <div className="text-3xl font-bold font-mono text-primary mt-1" data-testid="text-treasury-balance">
                      {treasury.balance}
                    </div>
                  </div>

                  <div className="pt-2 text-sm text-muted-foreground">
                    Total Supply: {treasury.total_supply}
                  </div>
                </div>
              ) : null}
            </Card>

            <Card className="bg-black/40 border-white/10 p-6 backdrop-blur-xl">
              <h2 className="text-xl font-bold font-display flex items-center gap-2 mb-4">
                <Send className="w-5 h-5 text-secondary" />
                Distribute Tokens
              </h2>

              <form onSubmit={handleDistribute} className="space-y-4">
                <div>
                  <Label htmlFor="toAddress">Recipient Address</Label>
                  <Input
                    id="toAddress"
                    placeholder="0x..."
                    value={toAddress}
                    onChange={(e) => setToAddress(e.target.value)}
                    className="mt-1 bg-white/5 border-white/10"
                    data-testid="input-recipient-address"
                  />
                </div>

                <div>
                  <Label htmlFor="amount">Amount (DWT)</Label>
                  <Input
                    id="amount"
                    type="number"
                    placeholder="1000"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="mt-1 bg-white/5 border-white/10"
                    data-testid="input-amount"
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-secondary text-black hover:bg-secondary/90 font-bold"
                  disabled={distributeMutation.isPending || !toAddress || !amount}
                  data-testid="button-distribute"
                >
                  {distributeMutation.isPending ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Distribute Tokens
                    </>
                  )}
                </Button>

                {distributeMutation.isError && (
                  <div className="text-red-400 text-sm flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" />
                    {distributeMutation.error.message}
                  </div>
                )}
              </form>
            </Card>
          </div>

          {lastTx && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card className="bg-green-500/10 border-green-500/30 p-6">
                <h3 className="text-lg font-bold text-green-400 mb-3">Distribution Successful!</h3>
                <div className="grid gap-2 text-sm font-mono">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">TX Hash:</span>
                    <span className="text-white truncate max-w-[200px]" data-testid="text-tx-hash">{lastTx.tx_hash}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">To:</span>
                    <span className="text-white truncate max-w-[200px]">{lastTx.to}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Amount:</span>
                    <span className="text-primary font-bold">{lastTx.amount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">New Treasury Balance:</span>
                    <span className="text-white">{lastTx.new_treasury_balance}</span>
                  </div>
                </div>
              </Card>
            </motion.div>
          )}

          <Card className="bg-white/5 border-white/10 p-6">
            <h3 className="text-lg font-bold mb-4">Token Distribution Guide</h3>
            <div className="space-y-3 text-sm text-muted-foreground">
              <p><strong className="text-white">Ecosystem (40%):</strong> 40,000,000 DWT for grants, partnerships, and ecosystem growth</p>
              <p><strong className="text-white">Community (25%):</strong> 25,000,000 DWT for rewards, airdrops, and community incentives</p>
              <p><strong className="text-white">Team (15%):</strong> 15,000,000 DWT for the DarkWave Studios team (4-year vesting)</p>
              <p><strong className="text-white">Treasury (10%):</strong> 10,000,000 DWT reserved for DAO governance</p>
              <p><strong className="text-white">Liquidity (10%):</strong> 10,000,000 DWT for DEX liquidity and market making</p>
            </div>
          </Card>
        </div>
      </div>

      <footer className="bg-black py-8 border-t border-white/10">
        <div className="container mx-auto px-6 text-center text-sm text-muted-foreground">
          © 2025 DarkWave Studios. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
