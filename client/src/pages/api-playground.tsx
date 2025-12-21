import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { ArrowLeft, Play, Copy, Check, Code, Zap, Globe, RefreshCw, Wallet, Droplets, Send, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CodeBlock } from "@/components/code-block";
import orbitLogo from "@assets/generated_images/futuristic_abstract_geometric_logo_symbol_for_orbit.png";
import { Footer } from "@/components/footer";
import { usePageAnalytics } from "@/hooks/use-analytics";

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
  const [activeTab, setActiveTab] = useState<"sandbox" | "api">("sandbox");
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
      if (res.ok) {
        setDevnetStatus(await res.json());
      }
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
      if (data.success && testWallet) {
        setWalletBalance(data.faucet.newBalance);
      }
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
        body: JSON.stringify({
          from: testWallet.address,
          to: transferTo,
          amount: transferAmount,
        }),
      });
      const data = await res.json();
      setResponse(JSON.stringify(data, null, 2));
      if (data.success) {
        await checkBalance();
      }
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
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-md">
        <div className="container mx-auto px-4 md:px-6 h-16 md:h-20 flex items-center justify-between">
          <div className="flex items-center gap-2 md:gap-4">
            <Link href="/">
              <Button variant="ghost" size="icon" className="hover:bg-white/5 touch-target">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <div className="flex items-center gap-2 md:gap-3">
              <img src={orbitLogo} alt="DarkWave Logo" className="w-7 h-7 md:w-8 md:h-8" />
              <span className="font-display font-bold text-lg md:text-xl">Devnet Sandbox</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {devnetStatus && (
              <Badge variant="outline" className="border-green-500/50 text-green-400 text-xs md:text-sm">
                <span className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse" />
                {devnetStatus.status}
              </Badge>
            )}
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 md:px-6 pt-24 md:pt-28 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-6xl mx-auto"
        >
          <div className="text-center mb-8 md:mb-12">
            <h1 className="text-3xl md:text-5xl font-display font-bold mb-3 md:mb-4">
              DarkWave <span className="text-primary">Devnet</span>
            </h1>
            <p className="text-base md:text-xl text-muted-foreground max-w-2xl mx-auto px-4">
              Build and test on DarkWave Chain. Create wallets, request test tokens from the faucet,
              and submit real transactions on our development network.
            </p>
          </div>

          {devnetStatus && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-8">
              <Card className="bg-black/20 border-white/10 p-3 md:p-4">
                <div className="text-xs md:text-sm text-muted-foreground">Block Height</div>
                <div className="font-mono font-bold text-lg md:text-xl text-primary">{devnetStatus.blockHeight}</div>
              </Card>
              <Card className="bg-black/20 border-white/10 p-3 md:p-4">
                <div className="text-xs md:text-sm text-muted-foreground">TPS Capacity</div>
                <div className="font-mono font-bold text-lg md:text-xl">{devnetStatus.tps}</div>
              </Card>
              <Card className="bg-black/20 border-white/10 p-3 md:p-4">
                <div className="text-xs md:text-sm text-muted-foreground">Finality</div>
                <div className="font-mono font-bold text-lg md:text-xl">{devnetStatus.finalityTime}</div>
              </Card>
              <Card className="bg-black/20 border-white/10 p-3 md:p-4">
                <div className="text-xs md:text-sm text-muted-foreground">Chain ID</div>
                <div className="font-mono font-bold text-lg md:text-xl">{devnetStatus.chainId}</div>
              </Card>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
            <div className="space-y-4 md:space-y-6">
              <Card className="bg-black/40 border-white/10 backdrop-blur-xl">
                <CardHeader className="pb-3 md:pb-4">
                  <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
                    <Wallet className="w-5 h-5 text-primary" />
                    Test Wallet
                  </CardTitle>
                  <CardDescription className="text-sm">Create a funded wallet for testing</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {!testWallet ? (
                    <Button 
                      onClick={createTestWallet} 
                      disabled={isExecuting}
                      className="w-full bg-primary text-background hover:bg-primary/90 touch-target"
                      data-testid="button-create-wallet"
                    >
                      {isExecuting ? (
                        <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      ) : (
                        <Wallet className="w-4 h-4 mr-2" />
                      )}
                      Create Test Wallet
                    </Button>
                  ) : (
                    <div className="space-y-3">
                      <div className="p-3 rounded-lg bg-primary/10 border border-primary/30">
                        <div className="text-xs text-muted-foreground mb-1">Address</div>
                        <div className="font-mono text-xs md:text-sm break-all">{testWallet.address}</div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Balance</span>
                        <span className="font-mono font-bold text-primary">
                          {walletBalance || testWallet.balance} DWT
                        </span>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={checkBalance}
                        className="w-full touch-target"
                        data-testid="button-refresh-balance"
                      >
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Refresh Balance
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className="bg-black/40 border-white/10 backdrop-blur-xl">
                <CardHeader className="pb-3 md:pb-4">
                  <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
                    <Droplets className="w-5 h-5 text-blue-400" />
                    Faucet
                  </CardTitle>
                  <CardDescription className="text-sm">Request test DWT tokens (max 100 per request)</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="faucet-address" className="text-sm">Wallet Address</Label>
                    <Input
                      id="faucet-address"
                      placeholder="0x..."
                      value={faucetAddress}
                      onChange={(e) => setFaucetAddress(e.target.value)}
                      className="font-mono text-sm"
                      data-testid="input-faucet-address"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="faucet-amount" className="text-sm">Amount (DWT)</Label>
                    <Input
                      id="faucet-amount"
                      type="number"
                      min="1"
                      max="100"
                      value={faucetAmount}
                      onChange={(e) => setFaucetAmount(e.target.value)}
                      className="font-mono"
                      data-testid="input-faucet-amount"
                    />
                  </div>
                  <Button 
                    onClick={requestFaucet} 
                    disabled={isExecuting || !faucetAddress}
                    className="w-full bg-blue-600 hover:bg-blue-700 touch-target"
                    data-testid="button-request-faucet"
                  >
                    {isExecuting ? (
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <Droplets className="w-4 h-4 mr-2" />
                    )}
                    Request Tokens
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-black/40 border-white/10 backdrop-blur-xl">
                <CardHeader className="pb-3 md:pb-4">
                  <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
                    <Send className="w-5 h-5 text-green-400" />
                    Send Transaction
                  </CardTitle>
                  <CardDescription className="text-sm">Transfer test DWT to another address</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="transfer-to" className="text-sm">To Address</Label>
                    <Input
                      id="transfer-to"
                      placeholder="0x..."
                      value={transferTo}
                      onChange={(e) => setTransferTo(e.target.value)}
                      className="font-mono text-sm"
                      data-testid="input-transfer-to"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="transfer-amount" className="text-sm">Amount (DWT)</Label>
                    <Input
                      id="transfer-amount"
                      type="number"
                      min="0.001"
                      value={transferAmount}
                      onChange={(e) => setTransferAmount(e.target.value)}
                      className="font-mono"
                      data-testid="input-transfer-amount"
                    />
                  </div>
                  <Button 
                    onClick={sendTransaction} 
                    disabled={isExecuting || !testWallet || !transferTo}
                    className="w-full bg-green-600 hover:bg-green-700 touch-target"
                    data-testid="button-send-transaction"
                  >
                    {isExecuting ? (
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <Send className="w-4 h-4 mr-2" />
                    )}
                    Send Transaction
                  </Button>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-4 md:space-y-6">
              <Card className="bg-black/40 border-white/10 backdrop-blur-xl">
                <CardHeader className="pb-3 md:pb-4">
                  <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
                    <Code className="w-5 h-5 text-primary" />
                    API Response
                  </CardTitle>
                  <CardDescription className="text-sm">Real-time responses from DarkWave Devnet</CardDescription>
                </CardHeader>
                <CardContent>
                  {response ? (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="relative"
                    >
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleCopy(response)}
                        className="absolute top-2 right-2 z-10"
                        data-testid="button-copy-response"
                      >
                        {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      </Button>
                      <CodeBlock 
                        code={response} 
                        language="json" 
                        filename="response.json" 
                      />
                    </motion.div>
                  ) : (
                    <div className="p-8 rounded-xl border border-dashed border-white/20 text-center text-muted-foreground">
                      <Activity className="w-8 h-8 mx-auto mb-3 opacity-50" />
                      <p>Execute an action to see the API response</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                <Card className="bg-black/20 border-white/10 p-3 md:p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-green-500/20 text-green-400">
                      <Zap className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-semibold text-white text-sm md:text-base">400ms</div>
                      <div className="text-xs text-muted-foreground">Block Time</div>
                    </div>
                  </div>
                </Card>
                <Card className="bg-black/20 border-white/10 p-3 md:p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-blue-500/20 text-blue-400">
                      <Globe className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-semibold text-white text-sm md:text-base">DWT</div>
                      <div className="text-xs text-muted-foreground">Native Token</div>
                    </div>
                  </div>
                </Card>
              </div>

              <Card className="bg-gradient-to-br from-primary/10 to-secondary/10 border-primary/30 p-4 md:p-6">
                <h3 className="font-bold text-base md:text-lg mb-2">Need an API Key?</h3>
                <p className="text-xs md:text-sm text-muted-foreground mb-4">
                  Register for production API access to submit real transactions, 
                  generate hallmarks, and integrate with your applications.
                </p>
                <Link href="/developer-portal">
                  <Button variant="outline" className="w-full border-primary/50 text-primary hover:bg-primary/10 touch-target">
                    Go to Developer Portal
                  </Button>
                </Link>
              </Card>
            </div>
          </div>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
}
