import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  Wallet, 
  Plus, 
  Copy, 
  ExternalLink, 
  RefreshCw, 
  Send, 
  ArrowDownToLine,
  Shield,
  Key,
  Eye,
  EyeOff,
  Sparkles,
  Zap,
  Globe,
  ChevronDown,
  Check,
  Lock,
  Unlock,
  QrCode,
  Settings,
  History,
  TrendingUp,
  Home,
  Download,
  Upload,
  AlertTriangle
} from "lucide-react";
import { BackButton } from "@/components/page-nav";
import { Link } from "wouter";
import darkwaveLogo from "@assets/generated_images/darkwave_token_transparent.png";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { 
  createWallet, 
  unlockWallet, 
  importWallet, 
  validateMnemonic,
  type StoredWallet 
} from "@/lib/wallet-crypto";

const SUPPORTED_CHAINS = [
  { id: 'darkwave', name: 'DarkWave Smart Chain', symbol: 'DWC', icon: '⚡', color: 'from-purple-500 to-pink-500', explorer: '/explorer' },
  { id: 'solana', name: 'Solana', symbol: 'SOL', icon: '◎', color: 'from-green-400 to-teal-500', explorer: 'https://solscan.io' },
  { id: 'ethereum', name: 'Ethereum', symbol: 'ETH', icon: 'Ξ', color: 'from-blue-400 to-indigo-500', explorer: 'https://etherscan.io' },
  { id: 'base', name: 'Base', symbol: 'ETH', icon: '🔵', color: 'from-blue-500 to-blue-600', explorer: 'https://basescan.org' },
  { id: 'polygon', name: 'Polygon', symbol: 'MATIC', icon: '⬡', color: 'from-purple-400 to-violet-500', explorer: 'https://polygonscan.com' },
  { id: 'arbitrum', name: 'Arbitrum', symbol: 'ETH', icon: '🔷', color: 'from-blue-400 to-cyan-500', explorer: 'https://arbiscan.io' },
  { id: 'bsc', name: 'BNB Chain', symbol: 'BNB', icon: '🔶', color: 'from-yellow-400 to-orange-500', explorer: 'https://bscscan.com' },
  { id: 'optimism', name: 'Optimism', symbol: 'ETH', icon: '🔴', color: 'from-red-400 to-red-500', explorer: 'https://optimistic.etherscan.io' },
  { id: 'avalanche', name: 'Avalanche', symbol: 'AVAX', icon: '🔺', color: 'from-red-500 to-rose-500', explorer: 'https://snowtrace.io' },
];

interface WalletAccount {
  chain: string;
  address: string;
  balance: string;
  usd: number;
}

export default function WalletPage() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedChain, setSelectedChain] = useState(SUPPORTED_CHAINS[0]);
  const [showChainSelector, setShowChainSelector] = useState(false);
  const [showMnemonic, setShowMnemonic] = useState(false);
  const [walletCreated, setWalletCreated] = useState(false);
  const [mnemonic, setMnemonic] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [sendAmount, setSendAmount] = useState("");
  const [sendAddress, setSendAddress] = useState("");
  const [copied, setCopied] = useState(false);
  const [loginPassword, setLoginPassword] = useState("");
  const [showLogin, setShowLogin] = useState(false);

  // Check for existing wallet on mount
  const checkExistingWallet = () => {
    const savedWallet = localStorage.getItem('darkwave_wallet');
    if (savedWallet && !walletCreated) {
      setShowLogin(true);
    }
  };
  
  // Run check on initial render
  if (typeof window !== 'undefined' && !walletCreated && !showLogin) {
    const savedWallet = localStorage.getItem('darkwave_wallet');
    if (savedWallet) {
      // Defer state update to avoid render loop
      setTimeout(() => setShowLogin(true), 0);
    }
  }

  const [isCreating, setIsCreating] = useState(false);
  const [importMnemonic, setImportMnemonic] = useState("");
  const [importPassword, setImportPassword] = useState("");

  // Get wallet accounts from stored data
  const getWalletAccounts = (): WalletAccount[] => {
    const savedWallet = localStorage.getItem('darkwave_wallet');
    if (!savedWallet || !walletCreated) {
      return [];
    }
    
    const walletData: StoredWallet = JSON.parse(savedWallet);
    return SUPPORTED_CHAINS.map(chain => ({
      chain: chain.id,
      address: walletData.addresses?.[chain.id] || '',
      balance: '0.00',
      usd: 0
    }));
  };

  const walletAccounts = getWalletAccounts();
  const totalBalance = walletAccounts.reduce((sum, acc) => sum + acc.usd, 0);

  const copyAddress = (address: string) => {
    navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast({ title: "Address Copied", description: "Wallet address copied to clipboard" });
  };

  // Create wallet using proper BIP39 mnemonic generation
  const handleCreateWallet = async () => {
    if (password !== confirmPassword) {
      toast({ title: "Error", description: "Passwords do not match", variant: "destructive" });
      return;
    }
    if (password.length < 8) {
      toast({ title: "Error", description: "Password must be at least 8 characters", variant: "destructive" });
      return;
    }
    
    setIsCreating(true);
    try {
      // Use real BIP39 mnemonic generation and PBKDF2 encryption
      const { mnemonic: generatedMnemonic, storedWallet } = await createWallet(password);
      
      // Store encrypted wallet data
      localStorage.setItem('darkwave_wallet', JSON.stringify(storedWallet));
      
      setMnemonic(generatedMnemonic);
      setWalletCreated(true);
      setShowLogin(false);
      setPassword("");
      setConfirmPassword("");
      toast({ title: "Wallet Created", description: "Your BIP39 multi-chain wallet is ready!" });
    } catch (error: any) {
      toast({ title: "Error", description: error.message || "Failed to create wallet", variant: "destructive" });
    } finally {
      setIsCreating(false);
    }
  };

  // Unlock existing wallet with password
  const handleLogin = async () => {
    const savedWallet = localStorage.getItem('darkwave_wallet');
    if (!savedWallet) {
      toast({ title: "Error", description: "No wallet found", variant: "destructive" });
      return;
    }
    
    setIsCreating(true);
    try {
      const walletData: StoredWallet = JSON.parse(savedWallet);
      await unlockWallet(walletData, loginPassword);
      
      setWalletCreated(true);
      setShowLogin(false);
      setLoginPassword("");
      toast({ title: "Welcome Back", description: "Wallet unlocked successfully" });
    } catch (error: any) {
      toast({ title: "Error", description: "Incorrect password", variant: "destructive" });
    } finally {
      setIsCreating(false);
    }
  };

  // Import wallet from recovery phrase
  const handleImportWallet = async () => {
    if (!validateMnemonic(importMnemonic.trim())) {
      toast({ title: "Error", description: "Invalid recovery phrase. Must be 12 valid BIP39 words.", variant: "destructive" });
      return;
    }
    if (importPassword.length < 8) {
      toast({ title: "Error", description: "Password must be at least 8 characters", variant: "destructive" });
      return;
    }
    
    setIsCreating(true);
    try {
      const storedWallet = await importWallet(importMnemonic.trim(), importPassword);
      localStorage.setItem('darkwave_wallet', JSON.stringify(storedWallet));
      
      setWalletCreated(true);
      setShowLogin(false);
      setImportMnemonic("");
      setImportPassword("");
      toast({ title: "Wallet Imported", description: "Your wallet has been restored successfully!" });
    } catch (error: any) {
      toast({ title: "Error", description: error.message || "Failed to import wallet", variant: "destructive" });
    } finally {
      setIsCreating(false);
    }
  };

  // Export wallet backup
  const handleExportWallet = () => {
    const savedWallet = localStorage.getItem('darkwave_wallet');
    if (!savedWallet) return;
    
    const blob = new Blob([savedWallet], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `darkwave-wallet-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast({ title: "Backup Downloaded", description: "Keep this file safe!" });
  };

  const handleLogout = () => {
    setWalletCreated(false);
    setShowLogin(true);
    setLoginPassword("");
    toast({ title: "Locked", description: "Wallet has been locked" });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-purple-950/20 pb-20">
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-background/90 backdrop-blur-xl">
        <div className="container mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <img src={darkwaveLogo} alt="DarkWave" className="w-7 h-7" />
            <span className="font-display font-bold text-lg tracking-tight">DarkWave</span>
          </Link>
          <div className="flex items-center gap-2">
            <Link href="/">
              <Button variant="ghost" size="sm" className="h-8 text-xs gap-1.5 hover:bg-white/5" data-testid="button-home">
                <Home className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Home</span>
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-500" />
      </div>

      <div className="relative z-10 container mx-auto px-4 pt-20 pb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 mb-6">
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span className="text-sm text-purple-300">Multi-Chain Wallet</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
              DarkWave Wallet
            </span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            One wallet, all chains. Manage your assets across 9+ blockchains with military-grade security.
          </p>
        </motion.div>

        {!walletCreated ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-lg mx-auto"
          >
            <Card className="bg-white/5 backdrop-blur-xl border-white/10 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5" />
              <CardHeader className="relative">
                <CardTitle className="flex items-center gap-3">
                  <div className="p-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500">
                    {showLogin ? <Unlock className="w-6 h-6 text-white" /> : <Shield className="w-6 h-6 text-white" />}
                  </div>
                  {showLogin ? "Unlock Your Wallet" : "Create Your Wallet"}
                </CardTitle>
              </CardHeader>
              <CardContent className="relative space-y-6">
                {showLogin ? (
                  <div className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      Enter your password to unlock your wallet.
                    </p>
                    <div className="space-y-2">
                      <Label>Password</Label>
                      <Input
                        type="password"
                        placeholder="Enter your password"
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                        className="bg-white/5 border-white/10"
                        data-testid="input-login-password"
                      />
                    </div>
                    <Button
                      onClick={handleLogin}
                      disabled={isCreating || !loginPassword}
                      className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                      data-testid="button-unlock-wallet"
                    >
                      {isCreating ? (
                        <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      ) : (
                        <Unlock className="w-4 h-4 mr-2" />
                      )}
                      {isCreating ? "Unlocking..." : "Unlock Wallet"}
                    </Button>
                    <div className="text-center pt-4 border-t border-white/10">
                      <button
                        onClick={() => setShowLogin(false)}
                        className="text-sm text-muted-foreground hover:text-white transition-colors"
                      >
                        Create a new wallet instead
                      </button>
                    </div>
                  </div>
                ) : (
                <>
                <Tabs defaultValue="create" className="w-full">
                  <TabsList className="w-full bg-white/5">
                    <TabsTrigger value="create" className="flex-1">Create New</TabsTrigger>
                    <TabsTrigger value="import" className="flex-1">Import Existing</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="create" className="space-y-4 mt-4">
                    <div className="space-y-2">
                      <Label>Password</Label>
                      <Input
                        type="password"
                        placeholder="Create a strong password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="bg-white/5 border-white/10"
                        data-testid="input-wallet-password"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Confirm Password</Label>
                      <Input
                        type="password"
                        placeholder="Confirm your password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="bg-white/5 border-white/10"
                        data-testid="input-wallet-confirm-password"
                      />
                    </div>
                    <Button
                      onClick={handleCreateWallet}
                      disabled={isCreating || password.length < 8 || password !== confirmPassword}
                      className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                      data-testid="button-create-wallet"
                    >
                      {isCreating ? (
                        <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      ) : (
                        <Plus className="w-4 h-4 mr-2" />
                      )}
                      {isCreating ? "Creating..." : "Create Wallet"}
                    </Button>
                  </TabsContent>
                  
                  <TabsContent value="import" className="space-y-4 mt-4">
                    <div className="space-y-2">
                      <Label>Recovery Phrase</Label>
                      <textarea
                        placeholder="Enter your 12-word BIP39 recovery phrase..."
                        value={importMnemonic}
                        onChange={(e) => setImportMnemonic(e.target.value)}
                        className="w-full h-24 px-3 py-2 bg-white/5 border border-white/10 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-purple-500"
                        data-testid="input-import-mnemonic"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Password (min 8 characters)</Label>
                      <Input
                        type="password"
                        placeholder="Create a password to encrypt your wallet"
                        value={importPassword}
                        onChange={(e) => setImportPassword(e.target.value)}
                        className="bg-white/5 border-white/10"
                        data-testid="input-import-password"
                      />
                    </div>
                    <Button
                      onClick={handleImportWallet}
                      disabled={isCreating || !importMnemonic || importPassword.length < 8}
                      className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600"
                      data-testid="button-import-wallet"
                    >
                      {isCreating ? (
                        <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      ) : (
                        <Upload className="w-4 h-4 mr-2" />
                      )}
                      {isCreating ? "Importing..." : "Import Wallet"}
                    </Button>
                  </TabsContent>
                </Tabs>

                <div className="flex items-center gap-3 p-4 rounded-xl bg-purple-500/10 border border-purple-500/20">
                  <Lock className="w-5 h-5 text-purple-400" />
                  <p className="text-sm text-muted-foreground">
                    Your wallet is encrypted locally. We never have access to your keys.
                  </p>
                </div>
                </>
                )}
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          <>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <Card className="bg-white/5 backdrop-blur-xl border-white/10 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10" />
                <CardContent className="relative p-6">
                  <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="text-center md:text-left">
                      <p className="text-sm text-muted-foreground mb-1">Total Portfolio Value</p>
                      <div className="flex items-baseline gap-2">
                        <span className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                          ${totalBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </span>
                        <span className="text-green-400 text-sm flex items-center gap-1">
                          <TrendingUp className="w-3 h-3" />
                          +12.5%
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-2">
                        Across {SUPPORTED_CHAINS.length} chains
                      </p>
                    </div>
                    
                    <div className="flex gap-3">
                      <Button
                        variant="outline"
                        className="bg-white/5 border-white/10 hover:bg-white/10"
                        data-testid="button-receive"
                      >
                        <ArrowDownToLine className="w-4 h-4 mr-2" />
                        Receive
                      </Button>
                      <Button
                        className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                        data-testid="button-send"
                      >
                        <Send className="w-4 h-4 mr-2" />
                        Send
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {mnemonic && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="mb-8"
              >
                <Card className="bg-amber-500/10 border-amber-500/30">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="p-3 rounded-xl bg-amber-500/20">
                        <Key className="w-6 h-6 text-amber-400" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-amber-400 mb-2">Backup Your Recovery Phrase</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                          Write down these 12 words and store them safely. This is the ONLY way to recover your wallet.
                        </p>
                        <div className="relative">
                          <div className={`grid grid-cols-3 md:grid-cols-4 gap-2 p-4 rounded-xl bg-black/30 ${!showMnemonic ? 'blur-md' : ''}`}>
                            {mnemonic.split(' ').map((word, i) => (
                              <div key={i} className="flex items-center gap-2 p-2 rounded bg-white/5">
                                <span className="text-xs text-muted-foreground">{i + 1}.</span>
                                <span className="font-mono text-sm">{word}</span>
                              </div>
                            ))}
                          </div>
                          {!showMnemonic && (
                            <div className="absolute inset-0 flex items-center justify-center">
                              <Button
                                variant="outline"
                                onClick={() => setShowMnemonic(true)}
                                className="bg-black/50 border-white/20"
                                data-testid="button-reveal-mnemonic"
                              >
                                <Eye className="w-4 h-4 mr-2" />
                                Reveal Phrase
                              </Button>
                            </div>
                          )}
                        </div>
                        <div className="flex gap-3 mt-4">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => copyAddress(mnemonic)}
                            className="bg-white/5 border-white/10"
                            data-testid="button-copy-mnemonic"
                          >
                            <Copy className="w-4 h-4 mr-2" />
                            Copy
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => setMnemonic("")}
                            className="bg-amber-500 hover:bg-amber-600"
                            data-testid="button-confirm-backup"
                          >
                            <Check className="w-4 h-4 mr-2" />
                            I've Saved It
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-4">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold">Your Assets</h2>
                  <Button variant="ghost" size="sm" className="text-muted-foreground">
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Refresh
                  </Button>
                </div>
                
                {walletAccounts.map((account: WalletAccount, index: number) => {
                  const chain = SUPPORTED_CHAINS.find(c => c.id === account.chain)!;
                  return (
                    <motion.div
                      key={account.chain}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Card className="bg-white/5 backdrop-blur-xl border-white/10 hover:bg-white/10 transition-all duration-300 group cursor-pointer">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${chain.color} flex items-center justify-center text-2xl shadow-lg group-hover:scale-110 transition-transform`}>
                                {chain.icon}
                              </div>
                              <div>
                                <div className="flex items-center gap-2">
                                  <h3 className="font-semibold">{chain.name}</h3>
                                  {chain.id === 'darkwave' && (
                                    <span className="px-2 py-0.5 text-xs rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                                      Native
                                    </span>
                                  )}
                                </div>
                                <div className="flex items-center gap-2 mt-1">
                                  <code className="text-xs text-muted-foreground font-mono">
                                    {account.address.slice(0, 8)}...{account.address.slice(-6)}
                                  </code>
                                  <button
                                    onClick={() => copyAddress(account.address)}
                                    className="text-muted-foreground hover:text-white transition-colors"
                                    data-testid={`button-copy-address-${chain.id}`}
                                  >
                                    <Copy className="w-3 h-3" />
                                  </button>
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="font-semibold">{account.balance} {chain.symbol}</p>
                              <p className="text-sm text-muted-foreground">
                                ${account.usd.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })}
              </div>

              <div className="space-y-6">
                <Card className="bg-white/5 backdrop-blur-xl border-white/10">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Send className="w-5 h-5 text-purple-400" />
                      Quick Send
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="relative">
                      <button
                        onClick={() => setShowChainSelector(!showChainSelector)}
                        className="w-full flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
                        data-testid="button-chain-selector"
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-lg bg-gradient-to-r ${selectedChain.color} flex items-center justify-center`}>
                            {selectedChain.icon}
                          </div>
                          <span>{selectedChain.name}</span>
                        </div>
                        <ChevronDown className={`w-4 h-4 transition-transform ${showChainSelector ? 'rotate-180' : ''}`} />
                      </button>
                      
                      <AnimatePresence>
                        {showChainSelector && (
                          <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="absolute top-full left-0 right-0 mt-2 p-2 rounded-xl bg-background/95 backdrop-blur-xl border border-white/10 shadow-xl z-50 max-h-64 overflow-y-auto"
                          >
                            {SUPPORTED_CHAINS.map(chain => (
                              <button
                                key={chain.id}
                                onClick={() => {
                                  setSelectedChain(chain);
                                  setShowChainSelector(false);
                                }}
                                className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-white/10 transition-colors"
                                data-testid={`button-select-chain-${chain.id}`}
                              >
                                <div className={`w-8 h-8 rounded-lg bg-gradient-to-r ${chain.color} flex items-center justify-center`}>
                                  {chain.icon}
                                </div>
                                <span className="flex-1 text-left">{chain.name}</span>
                                {selectedChain.id === chain.id && <Check className="w-4 h-4 text-green-400" />}
                              </button>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Recipient Address</Label>
                      <Input
                        placeholder="Enter address..."
                        value={sendAddress}
                        onChange={(e) => setSendAddress(e.target.value)}
                        className="bg-white/5 border-white/10 font-mono text-sm"
                        data-testid="input-send-address"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Amount</Label>
                      <div className="relative">
                        <Input
                          type="number"
                          placeholder="0.00"
                          value={sendAmount}
                          onChange={(e) => setSendAmount(e.target.value)}
                          className="bg-white/5 border-white/10 pr-16"
                          data-testid="input-send-amount"
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                          {selectedChain.symbol}
                        </span>
                      </div>
                    </div>
                    
                    <Button
                      className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                      data-testid="button-confirm-send"
                    >
                      <Send className="w-4 h-4 mr-2" />
                      Send {selectedChain.symbol}
                    </Button>
                  </CardContent>
                </Card>

                <Card className="bg-white/5 backdrop-blur-xl border-white/10">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Shield className="w-5 h-5 text-green-400" />
                      Security
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between p-3 rounded-xl bg-green-500/10 border border-green-500/20">
                      <div className="flex items-center gap-2">
                        <Lock className="w-4 h-4 text-green-400" />
                        <span className="text-sm">Encrypted Locally</span>
                      </div>
                      <Check className="w-4 h-4 text-green-400" />
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-xl bg-green-500/10 border border-green-500/20">
                      <div className="flex items-center gap-2">
                        <Key className="w-4 h-4 text-green-400" />
                        <span className="text-sm">Self-Custody</span>
                      </div>
                      <Check className="w-4 h-4 text-green-400" />
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-xl bg-purple-500/10 border border-purple-500/20">
                      <div className="flex items-center gap-2">
                        <Globe className="w-4 h-4 text-purple-400" />
                        <span className="text-sm">9 Chains Supported</span>
                      </div>
                      <Zap className="w-4 h-4 text-purple-400" />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
