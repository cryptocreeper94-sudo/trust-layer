import { useState, useEffect } from "react";
import { Link } from "wouter";
import { Play, Copy, Check, Wallet, Droplets, Send, Activity, RefreshCw } from "lucide-react";
import { BackButton } from "@/components/page-nav";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import orbitLogo from "@assets/generated_images/futuristic_abstract_geometric_logo_symbol_for_orbit.png";
import { Footer } from "@/components/footer";
import { usePageAnalytics } from "@/hooks/use-analytics";
import { GlassCard } from "@/components/glass-card";

interface DevnetStatus {
  network: string;
  chainId: number;
  status: string;
  blockHeight: string;
  tps: string;
  finalityTime: string;
  faucetAvailable: boolean;
  faucetLimit: string;
  symbol: string;
  decimals: number;
}

interface TestWallet {
  address: string;
  privateKey: string;
  balance: string;
  network: string;
  chainId: number;
}

export default function ApiPlayground() {
  usePageAnalytics();
  const [isExecuting, setIsExecuting] = useState(false);
  const [response, setResponse] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  
  const [devnetStatus, setDevnetStatus] = useState<DevnetStatus | null>(null);
  const [testWallet, setTestWallet] = useState<TestWallet | null>(null);
  const [faucetAddress, setFaucetAddress] = useState("");
  const [faucetAmount, setFaucetAmount] = useState("100");
  const [transferTo, setTransferTo] = useState("");
  const [transferAmount, setTransferAmount] = useState("10");
  const [walletBalance, setWalletBalance] = useState<string | null>(null);

  useEffect(() => {
    fetchDevnetStatus();
    const interval = setInterval(fetchDevnetStatus, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchDevnetStatus = async () => {
    try {
      const res = await fetch("/api/devnet/status");
      if (res.ok) setDevnetStatus(await res.json());
    } catch (error) {
      console.error("Failed to fetch devnet status:", error);
    }
  };

  const createTestWallet = async () => {
    setIsExecuting(true);
    try {
      const res = await fetch("/api/devnet/wallet/create", { method: "POST" });
      const data = await res.json();
      if (data.success) {
        setTestWallet(data.wallet);
        setFaucetAddress(data.wallet.address);
        setResponse(JSON.stringify(data, null, 2));
      }
    } catch (error) {
      setResponse(JSON.stringify({ error: "Failed to create wallet" }, null, 2));
    } finally {
      setIsExecuting(false);
    }
  };

  const requestFaucet = async () => {
    if (!faucetAddress) return;
    setIsExecuting(true);
    try {
      const res = await fetch("/api/devnet/faucet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ address: faucetAddress, amount: faucetAmount }),
      });
      const data = await res.json();
      setResponse(JSON.stringify(data, null, 2));
      if (data.success && testWallet) setWalletBalance(data.faucet.newBalance);
    } catch (error) {
      setResponse(JSON.stringify({ error: "Faucet request failed" }, null, 2));
    } finally {
      setIsExecuting(false);
    }
  };

  const checkBalance = async () => {
    if (!testWallet) return;
    setIsExecuting(true);
    try {
      const res = await fetch(`/api/devnet/balance/${testWallet.address}`);
      const data = await res.json();
      setWalletBalance(data.balance);
      setResponse(JSON.stringify(data, null, 2));
    } catch (error) {
      setResponse(JSON.stringify({ error: "Balance check failed" }, null, 2));
    } finally {
      setIsExecuting(false);
    }
  };

  const sendTransaction = async () => {
    if (!testWallet || !transferTo) return;
    setIsExecuting(true);
    try {
      const res = await fetch("/api/devnet/transaction", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ from: testWallet.address, to: transferTo, amount: transferAmount }),
      });
      const data = await res.json();
      setResponse(JSON.stringify(data, null, 2));
      if (data.success) await checkBalance();
    } catch (error) {
      setResponse(JSON.stringify({ error: "Transaction failed" }, null, 2));
    } finally {
      setIsExecuting(false);
    }
  };

  const handleCopy = async (text: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-background/90 backdrop-blur-xl">
        <div className="container mx-auto px-4 h-14 flex items-center">
          <Link href="/" className="flex items-center gap-2 mr-auto">
            <img src={orbitLogo} alt="DarkWave" className="w-7 h-7" />
            <span className="font-display font-bold text-lg tracking-tight">Devnet Sandbox</span>
          </Link>
          <div className="flex items-center gap-3">
            {devnetStatus && (
              <Badge variant="outline" className="border-green-500/50 text-green-400 text-[10px]">
                <span className="w-1.5 h-1.5 bg-green-400 rounded-full mr-1.5 animate-pulse" />
                {devnetStatus.status}
              </Badge>
            )}
            <BackButton />
          </div>
        </div>
      </nav>

      <div className="pt-20 pb-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <section className="mb-8">
            <h1 className="text-2xl md:text-3xl font-display font-bold mb-2">Devnet Sandbox</h1>
            <p className="text-sm text-muted-foreground">Test DarkWave Smart Chain features in a safe environment</p>
          </section>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
            <GlassCard hover={false}>
              <div className="p-4 text-center">
                <Activity className="w-4 h-4 text-primary mx-auto mb-2" />
                <div className="text-lg font-bold text-white">{devnetStatus?.tps || "200K+"}</div>
                <div className="text-[10px] text-white/50">TPS</div>
              </div>
            </GlassCard>
            <GlassCard hover={false}>
              <div className="p-4 text-center">
                <div className="text-lg font-bold text-white">{devnetStatus?.finalityTime || "400ms"}</div>
                <div className="text-[10px] text-white/50">Block Time</div>
              </div>
            </GlassCard>
            <GlassCard hover={false}>
              <div className="p-4 text-center">
                <div className="text-lg font-bold text-white">{devnetStatus?.blockHeight || "0"}</div>
                <div className="text-[10px] text-white/50">Block Height</div>
              </div>
            </GlassCard>
            <GlassCard hover={false}>
              <div className="p-4 text-center">
                <div className="text-lg font-bold text-white">{devnetStatus?.faucetLimit || "100"}</div>
                <div className="text-[10px] text-white/50">Faucet Limit</div>
              </div>
            </GlassCard>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="space-y-4">
              <GlassCard glow>
                <div className="p-5">
                  <div className="flex items-center gap-2 mb-4">
                    <Wallet className="w-4 h-4 text-primary" />
                    <h2 className="text-sm font-bold text-white">Test Wallet</h2>
                  </div>
                  
                  {!testWallet ? (
                    <Button onClick={createTestWallet} disabled={isExecuting} className="w-full h-10 bg-primary text-background text-xs">
                      {isExecuting ? <RefreshCw className="w-3 h-3 mr-2 animate-spin" /> : <Wallet className="w-3 h-3 mr-2" />}
                      Create Test Wallet
                    </Button>
                  ) : (
                    <div className="space-y-3">
                      <div>
                        <Label className="text-[10px] text-white/40">Address</Label>
                        <div className="flex items-center gap-2 mt-1">
                          <code className="flex-1 text-[10px] font-mono bg-black/30 px-2 py-1.5 rounded border border-white/10 truncate">
                            {testWallet.address}
                          </code>
                          <Button variant="ghost" size="sm" onClick={() => handleCopy(testWallet.address)} className="h-7 w-7 p-0">
                            {copied ? <Check className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3" />}
                          </Button>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] text-white/40">Balance</span>
                        <span className="text-lg font-bold text-primary">{walletBalance || testWallet.balance} DWC</span>
                      </div>
                      <Button onClick={checkBalance} disabled={isExecuting} variant="outline" className="w-full h-8 text-[10px] border-white/10">
                        <RefreshCw className={`w-3 h-3 mr-1.5 ${isExecuting ? 'animate-spin' : ''}`} /> Refresh Balance
                      </Button>
                    </div>
                  )}
                </div>
              </GlassCard>

              <GlassCard>
                <div className="p-5">
                  <div className="flex items-center gap-2 mb-4">
                    <Droplets className="w-4 h-4 text-cyan-400" />
                    <h2 className="text-sm font-bold text-white">Faucet</h2>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <Label className="text-[10px] text-white/40">Recipient Address</Label>
                      <Input
                        placeholder="0x..."
                        value={faucetAddress}
                        onChange={(e) => setFaucetAddress(e.target.value)}
                        className="mt-1 h-9 bg-black/30 border-white/10 text-xs font-mono"
                      />
                    </div>
                    <div>
                      <Label className="text-[10px] text-white/40">Amount (max 100)</Label>
                      <Input
                        type="number"
                        value={faucetAmount}
                        onChange={(e) => setFaucetAmount(e.target.value)}
                        max={100}
                        className="mt-1 h-9 bg-black/30 border-white/10 text-xs"
                      />
                    </div>
                    <Button onClick={requestFaucet} disabled={isExecuting || !faucetAddress} className="w-full h-9 bg-cyan-500 text-black hover:bg-cyan-400 text-xs">
                      <Droplets className="w-3 h-3 mr-1.5" /> Request Tokens
                    </Button>
                  </div>
                </div>
              </GlassCard>

              <GlassCard>
                <div className="p-5">
                  <div className="flex items-center gap-2 mb-4">
                    <Send className="w-4 h-4 text-secondary" />
                    <h2 className="text-sm font-bold text-white">Send Transaction</h2>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <Label className="text-[10px] text-white/40">To Address</Label>
                      <Input
                        placeholder="0x..."
                        value={transferTo}
                        onChange={(e) => setTransferTo(e.target.value)}
                        className="mt-1 h-9 bg-black/30 border-white/10 text-xs font-mono"
                      />
                    </div>
                    <div>
                      <Label className="text-[10px] text-white/40">Amount</Label>
                      <Input
                        type="number"
                        value={transferAmount}
                        onChange={(e) => setTransferAmount(e.target.value)}
                        className="mt-1 h-9 bg-black/30 border-white/10 text-xs"
                      />
                    </div>
                    <Button onClick={sendTransaction} disabled={isExecuting || !testWallet || !transferTo} className="w-full h-9 bg-secondary text-black hover:bg-secondary/90 text-xs">
                      <Send className="w-3 h-3 mr-1.5" /> Send Transaction
                    </Button>
                  </div>
                </div>
              </GlassCard>
            </div>

            <GlassCard glow className="h-fit">
              <div className="p-5">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-sm font-bold text-white flex items-center gap-2">
                    <Play className="w-4 h-4 text-green-400" /> Response
                  </h2>
                  {response && (
                    <Button variant="ghost" size="sm" onClick={() => handleCopy(response)} className="h-7 text-[10px]">
                      {copied ? <Check className="w-3 h-3 mr-1" /> : <Copy className="w-3 h-3 mr-1" />} Copy
                    </Button>
                  )}
                </div>
                <div className="bg-black/50 rounded-lg p-4 min-h-[300px] max-h-[500px] overflow-auto">
                  {response ? (
                    <pre className="text-[10px] font-mono text-green-400 whitespace-pre-wrap">{response}</pre>
                  ) : (
                    <p className="text-[11px] text-white/30 text-center py-8">Execute an action to see the response</p>
                  )}
                </div>
              </div>
            </GlassCard>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
