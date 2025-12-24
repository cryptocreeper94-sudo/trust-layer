import { useState } from "react";
import { ArrowLeft, Wallet, Send, RefreshCw, Copy, Check, AlertCircle, Coins } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import orbitLogo from "@assets/generated_images/futuristic_abstract_geometric_logo_symbol_for_orbit.png";
import { Footer } from "@/components/footer";
import { usePageAnalytics } from "@/hooks/use-analytics";
import { GlassCard } from "@/components/glass-card";

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
  if (!response.ok) throw new Error("Failed to fetch treasury info");
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
  usePageAnalytics();
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
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-background/90 backdrop-blur-xl">
        <div className="container mx-auto px-4 h-14 flex items-center">
          <Link href="/" className="flex items-center gap-2 mr-auto">
            <img src={orbitLogo} alt="DarkWave" className="w-7 h-7" />
            <span className="font-display font-bold text-lg tracking-tight">DarkWave</span>
          </Link>
          <div className="flex items-center gap-3">
            <Coins className="w-4 h-4 text-primary" />
            <span className="text-sm font-display font-bold">Treasury</span>
            <Link href="/">
              <Button variant="ghost" size="sm" className="h-8 text-xs gap-1.5 hover:bg-white/5 ml-2">
                <ArrowLeft className="w-3 h-3" />
                Back
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      <div className="pt-20 pb-12 px-4">
        <div className="container mx-auto max-w-4xl space-y-6">
          <div className="text-center space-y-3">
            <h1 className="text-3xl md:text-4xl font-display font-bold">DWT Treasury</h1>
            <p className="text-sm text-muted-foreground max-w-lg mx-auto">
              Manage DarkWave Token distribution. The treasury holds 100 million DWT tokens.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <GlassCard glow>
              <div className="p-5">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-sm font-bold flex items-center gap-2">
                    <Wallet className="w-4 h-4 text-primary" />
                    Treasury Wallet
                  </h2>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => refetch()}
                    disabled={isLoading}
                    className="h-7 w-7 p-0"
                    data-testid="button-refresh-treasury"
                  >
                    <RefreshCw className={`w-3 h-3 ${isLoading ? 'animate-spin' : ''}`} />
                  </Button>
                </div>

                {error ? (
                  <div className="text-red-400 flex items-center gap-2 text-xs">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>Blockchain node offline</span>
                  </div>
                ) : isLoading ? (
                  <div className="space-y-3 animate-pulse">
                    <div className="h-5 bg-white/10 rounded w-3/4" />
                    <div className="h-8 bg-white/10 rounded" />
                  </div>
                ) : treasury ? (
                  <div className="space-y-4">
                    <div>
                      <Label className="text-white/40 text-[10px] uppercase tracking-wider">Address</Label>
                      <div className="flex items-center gap-2 mt-1">
                        <code className="flex-1 text-[11px] font-mono bg-black/30 px-3 py-2 rounded border border-white/10 truncate" data-testid="text-treasury-address">
                          {treasury.address}
                        </code>
                        <Button variant="ghost" size="sm" onClick={copyAddress} className="h-8 w-8 p-0" data-testid="button-copy-address">
                          {copied ? <Check className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3" />}
                        </Button>
                      </div>
                    </div>
                    
                    <div>
                      <Label className="text-white/40 text-[10px] uppercase tracking-wider">Balance</Label>
                      <div className="text-2xl font-bold font-mono text-primary mt-1" data-testid="text-treasury-balance">
                        {treasury.balance}
                      </div>
                    </div>

                    <div className="pt-2 text-[11px] text-white/40">
                      Total Supply: {treasury.total_supply}
                    </div>
                  </div>
                ) : null}
              </div>
            </GlassCard>

            <GlassCard glow>
              <div className="p-5">
                <h2 className="text-sm font-bold flex items-center gap-2 mb-4">
                  <Send className="w-4 h-4 text-secondary" />
                  Distribute Tokens
                </h2>

                <form onSubmit={handleDistribute} className="space-y-4">
                  <div>
                    <Label htmlFor="toAddress" className="text-[11px] text-white/60">Recipient Address</Label>
                    <Input
                      id="toAddress"
                      placeholder="0x..."
                      value={toAddress}
                      onChange={(e) => setToAddress(e.target.value)}
                      className="mt-1 h-10 bg-black/30 border-white/10 text-xs font-mono"
                      data-testid="input-recipient-address"
                    />
                  </div>

                  <div>
                    <Label htmlFor="amount" className="text-[11px] text-white/60">Amount (DWT)</Label>
                    <Input
                      id="amount"
                      type="number"
                      placeholder="1000"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="mt-1 h-10 bg-black/30 border-white/10 text-xs"
                      data-testid="input-amount"
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full h-10 bg-secondary text-black hover:bg-secondary/90 font-bold text-xs"
                    disabled={distributeMutation.isPending || !toAddress || !amount}
                    data-testid="button-distribute"
                  >
                    {distributeMutation.isPending ? (
                      <>
                        <RefreshCw className="w-3 h-3 mr-2 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <Send className="w-3 h-3 mr-2" />
                        Distribute Tokens
                      </>
                    )}
                  </Button>

                  {distributeMutation.isError && (
                    <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-xs text-red-400 flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      {distributeMutation.error.message}
                    </div>
                  )}
                </form>
              </div>
            </GlassCard>
          </div>

          {lastTx && (
            <GlassCard glow>
              <div className="p-5">
                <h3 className="text-sm font-bold text-green-400 mb-3 flex items-center gap-2">
                  <Check className="w-4 h-4" />
                  Transaction Successful
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                  <div>
                    <div className="text-white/40 mb-0.5">To</div>
                    <div className="text-white font-mono truncate">{lastTx.to.slice(0, 10)}...</div>
                  </div>
                  <div>
                    <div className="text-white/40 mb-0.5">Amount</div>
                    <div className="text-white">{(BigInt(lastTx.amount) / BigInt(1e18)).toString()} DWT</div>
                  </div>
                  <div>
                    <div className="text-white/40 mb-0.5">Tx Hash</div>
                    <div className="text-primary font-mono truncate">{lastTx.tx_hash?.slice(0, 12)}...</div>
                  </div>
                  <div>
                    <div className="text-white/40 mb-0.5">New Balance</div>
                    <div className="text-white">{lastTx.new_treasury_balance}</div>
                  </div>
                </div>
              </div>
            </GlassCard>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
