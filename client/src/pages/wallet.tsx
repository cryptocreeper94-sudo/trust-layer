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
  AlertTriangle,
  Cloud,
  CloudOff,
  Loader,
  CreditCard,
  X,
  Fingerprint
} from "lucide-react";
import { BackButton } from "@/components/page-nav";
import { Link } from "wouter";
import axios from "axios";
import { useAuth } from "@/hooks/use-auth";
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
import { DwcBagDashboard } from "@/components/dwc-bag-dashboard";
import { 
  fetchAllTestnetBalances, 
  getTestnetFaucetUrl, 
  getTestnetName,
  type TestnetBalance 
} from "@/lib/testnet-service";
import { startAuthentication as webauthnStartAuthentication } from "@simplewebauthn/browser";
import { PhoneVerification } from "@/components/phone-verification";

const SUPPORTED_CHAINS = [
  { id: 'darkwave', name: 'Trust Layer', symbol: 'SIG', icon: '⚡', color: 'from-purple-500 to-pink-500', explorer: '/explorer' },
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
  const { user } = useAuth();
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
  const [isBackingUp, setIsBackingUp] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);
  const [isBiometricUnlocking, setIsBiometricUnlocking] = useState(false);
  
  // Check if user has passkeys registered
  const { data: passkeysData } = useQuery({
    queryKey: ["passkeys"],
    queryFn: async () => {
      const res = await fetch("/api/webauthn/passkeys", { credentials: "include" });
      if (!res.ok) return [];
      return res.json();
    },
    enabled: !!user?.id,
  });
  const hasPasskeys = passkeysData && passkeysData.length > 0;
  
  // Check if cloud backup exists (check whenever user is logged in)
  const { data: backupStatus } = useQuery({
    queryKey: ["wallet-backup-status", user?.id],
    queryFn: () => axios.get("/api/wallet/backup/exists").then(r => r.data),
    enabled: !!user?.id,
  });
  const hasCloudBackup = backupStatus?.exists;
  
  // Check if biometric unlock is set up
  const { data: biometricStatus, refetch: refetchBiometricStatus } = useQuery({
    queryKey: ["wallet-biometric-status", user?.id],
    queryFn: () => axios.get("/api/wallet/biometric/status").then(r => r.data),
    enabled: !!user?.id,
  });
  const hasBiometricSetup = biometricStatus?.enabled;
  
  const handleCloudBackup = async () => {
    if (!user?.id) {
      toast({ title: "Sign in required", description: "Please sign in to enable cloud backup", variant: "destructive" });
      return;
    }
    
    const savedWallet = localStorage.getItem('darkwave_wallet');
    if (!savedWallet) {
      toast({ title: "No wallet found", description: "Create or import a wallet first", variant: "destructive" });
      return;
    }
    
    setIsBackingUp(true);
    try {
      const walletData: StoredWallet = JSON.parse(savedWallet);
      await axios.post("/api/wallet/backup", {
        encryptedData: JSON.stringify({ encryptedSeed: walletData.encryptedSeed, salt: walletData.salt, iv: walletData.iv }),
        walletAddresses: JSON.stringify(walletData.addresses),
        backupName: "Primary Wallet",
      });
      
      queryClient.invalidateQueries({ queryKey: ["wallet-backup-status"] });
      toast({ title: "Backup successful", description: "Your wallet is now backed up to the cloud" });
    } catch (error) {
      toast({ title: "Backup failed", description: "Could not save backup to cloud", variant: "destructive" });
    } finally {
      setIsBackingUp(false);
    }
  };
  
  const handleCloudRestore = async () => {
    if (!user?.id) {
      toast({ title: "Sign in required", description: "Please sign in to restore from cloud", variant: "destructive" });
      return;
    }
    
    setIsRestoring(true);
    try {
      const response = await axios.get("/api/wallet/backup");
      if (!response.data.backup) {
        toast({ title: "No backup found", description: "No cloud backup exists for your account", variant: "destructive" });
        return;
      }
      
      const backup = response.data.backup;
      const addresses = backup.walletAddresses ? JSON.parse(backup.walletAddresses) : {};
      const encryptedParts = JSON.parse(backup.encryptedData);
      
      // Create wallet data structure compatible with localStorage
      const restoredWallet: StoredWallet = {
        encryptedSeed: encryptedParts.encryptedSeed,
        salt: encryptedParts.salt,
        iv: encryptedParts.iv,
        addresses,
        createdAt: backup.createdAt,
      };
      
      localStorage.setItem('darkwave_wallet', JSON.stringify(restoredWallet));
      setShowLogin(true);
      toast({ title: "Wallet restored", description: "Enter your password to unlock your wallet" });
    } catch (error) {
      toast({ title: "Restore failed", description: "Could not restore from cloud backup", variant: "destructive" });
    } finally {
      setIsRestoring(false);
    }
  };

  // TRUE Biometric/Passkey unlock - Phantom-style, no password after initial setup
  const handleBiometricUnlock = async () => {
    if (!user?.id) {
      toast({ title: "Sign in required", description: "Please sign in first to use biometric unlock", variant: "destructive" });
      return;
    }
    
    setIsBiometricUnlocking(true);
    try {
      // Start passkey authentication
      const startRes = await fetch("/api/webauthn/authenticate/start", {
        method: "POST",
        credentials: "include",
      });
      if (!startRes.ok) throw new Error("Failed to start authentication");
      
      const { requestId, ...options } = await startRes.json();
      const credential = await webauthnStartAuthentication({ optionsJSON: options });
      
      const finishRes = await fetch("/api/webauthn/authenticate/finish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ ...credential, requestId }),
      });
      
      if (!finishRes.ok) throw new Error("Authentication failed");
      
      // If biometric unlock is set up, get decrypted password and unlock automatically
      if (hasBiometricSetup) {
        const unlockRes = await axios.post("/api/wallet/biometric/unlock");
        if (unlockRes.data.walletPassword) {
          // Restore wallet from cloud first if needed
          const savedWallet = localStorage.getItem('darkwave_wallet');
          if (!savedWallet) {
            const response = await axios.get("/api/wallet/backup");
            if (response.data.backup) {
              const backup = response.data.backup;
              const addresses = backup.walletAddresses ? JSON.parse(backup.walletAddresses) : {};
              const encryptedParts = JSON.parse(backup.encryptedData);
              const restoredWallet: StoredWallet = {
                encryptedSeed: encryptedParts.encryptedSeed,
                salt: encryptedParts.salt,
                iv: encryptedParts.iv,
                addresses,
                createdAt: backup.createdAt,
              };
              localStorage.setItem('darkwave_wallet', JSON.stringify(restoredWallet));
            }
          }
          
          // Now unlock with the decrypted password
          const walletData = localStorage.getItem('darkwave_wallet');
          if (walletData) {
            await unlockWallet(JSON.parse(walletData) as StoredWallet, unlockRes.data.walletPassword);
            setWalletCreated(true);
            setShowLogin(false);
            toast({ title: "Welcome back!", description: "Wallet unlocked with fingerprint" });
            return;
          }
        }
      }
      
      // Fallback: Biometric not set up, just restore and prompt for password
      const response = await axios.get("/api/wallet/backup");
      if (!response.data.backup) {
        toast({ 
          title: "No cloud backup", 
          description: "Set up your wallet and enable cloud backup to use biometric unlock", 
          variant: "destructive" 
        });
        return;
      }
      
      const backup = response.data.backup;
      const addresses = backup.walletAddresses ? JSON.parse(backup.walletAddresses) : {};
      const encryptedParts = JSON.parse(backup.encryptedData);
      
      const restoredWallet: StoredWallet = {
        encryptedSeed: encryptedParts.encryptedSeed,
        salt: encryptedParts.salt,
        iv: encryptedParts.iv,
        addresses,
        createdAt: backup.createdAt,
      };
      
      localStorage.setItem('darkwave_wallet', JSON.stringify(restoredWallet));
      setShowLogin(true);
      toast({ 
        title: "Identity verified", 
        description: "Now enter your wallet password to unlock" 
      });
    } catch (error: any) {
      toast({ 
        title: "Biometric unlock failed", 
        description: error.message || "Could not authenticate. Try again or use password.", 
        variant: "destructive" 
      });
    } finally {
      setIsBiometricUnlocking(false);
    }
  };
  
  // Setup biometric unlock - call this after successful password unlock
  const handleSetupBiometric = async (walletPassword: string) => {
    if (!user?.id || !hasPasskeys) return;
    
    try {
      await axios.post("/api/wallet/biometric/setup", { walletPassword });
      refetchBiometricStatus();
      toast({ 
        title: "Fingerprint unlock enabled", 
        description: "Next time you can unlock with just your fingerprint" 
      });
    } catch (error) {
      console.error("Failed to setup biometric:", error);
    }
  };

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
  const [isRefreshingBalances, setIsRefreshingBalances] = useState(false);
  
  // Buy Crypto (Stripe Onramp) state
  const [showBuyCrypto, setShowBuyCrypto] = useState(false);
  const [buyAmount, setBuyAmount] = useState("100");
  const [selectedCrypto, setSelectedCrypto] = useState("eth");
  const [isCreatingOnrampSession, setIsCreatingOnrampSession] = useState(false);
  
  // External wallet management state
  const [showExternalWallets, setShowExternalWallets] = useState(false);
  const [newExternalAddress, setNewExternalAddress] = useState("");
  const [newExternalChain, setNewExternalChain] = useState("ethereum");
  const [newExternalLabel, setNewExternalLabel] = useState("");
  const [isSavingExternalWallet, setIsSavingExternalWallet] = useState(false);
  
  // Fetch external wallets
  const { data: externalWalletsData, refetch: refetchExternalWallets } = useQuery({
    queryKey: ["external-wallets", user?.id],
    queryFn: () => axios.get("/api/wallet/external").then(r => r.data.wallets),
    enabled: !!user?.id,
  });
  
  const externalWallets = externalWalletsData || [];
  
  const handleSaveExternalWallet = async () => {
    if (!newExternalAddress.trim()) {
      toast({ title: "Address required", description: "Please enter a wallet address", variant: "destructive" });
      return;
    }
    
    setIsSavingExternalWallet(true);
    try {
      await axios.post("/api/wallet/external", {
        chain: newExternalChain,
        address: newExternalAddress.trim(),
        label: newExternalLabel.trim() || null,
      });
      
      toast({ title: "Wallet saved", description: "Your external wallet has been saved" });
      setNewExternalAddress("");
      setNewExternalLabel("");
      refetchExternalWallets();
    } catch (error: any) {
      toast({ 
        title: "Error", 
        description: error.response?.data?.error || "Failed to save wallet", 
        variant: "destructive" 
      });
    } finally {
      setIsSavingExternalWallet(false);
    }
  };
  
  const handleDeleteExternalWallet = async (walletId: string) => {
    try {
      await axios.delete(`/api/wallet/external/${walletId}`);
      toast({ title: "Wallet removed" });
      refetchExternalWallets();
    } catch (error) {
      toast({ title: "Error", description: "Failed to remove wallet", variant: "destructive" });
    }
  };

  // Get stored wallet addresses
  const getStoredAddresses = (): Record<string, string> => {
    const savedWallet = localStorage.getItem('darkwave_wallet');
    if (!savedWallet || !walletCreated) return {};
    const walletData: StoredWallet = JSON.parse(savedWallet);
    return walletData.addresses || {};
  };
  
  const storedAddresses = getStoredAddresses();
  
  // Fetch real testnet balances
  const { data: testnetBalances, refetch: refetchBalances, isLoading: isLoadingBalances } = useQuery({
    queryKey: ["testnet-balances", JSON.stringify(storedAddresses)],
    queryFn: () => fetchAllTestnetBalances(storedAddresses),
    enabled: walletCreated && Object.keys(storedAddresses).length > 0,
    staleTime: 60_000,
    refetchInterval: 120_000,
  });

  // Get wallet accounts with real balances
  const getWalletAccounts = (): WalletAccount[] => {
    if (!walletCreated) return [];
    
    return SUPPORTED_CHAINS.map(chain => {
      const realBalance = testnetBalances?.find(b => b.chain === chain.id);
      return {
        chain: chain.id,
        address: storedAddresses[chain.id] || '',
        balance: realBalance?.balance || '0.0000',
        usd: realBalance?.usdValue || 0
      };
    });
  };

  const walletAccounts = getWalletAccounts();
  const totalBalance = walletAccounts.reduce((sum, acc) => sum + acc.usd, 0);
  
  const handleRefreshBalances = async () => {
    setIsRefreshingBalances(true);
    await refetchBalances();
    setIsRefreshingBalances(false);
    toast({ title: "Balances Updated", description: "Fetched latest testnet balances" });
  };
  
  const [isSending, setIsSending] = useState(false);
  
  const handleSendTransaction = async () => {
    if (!sendAddress.trim()) {
      toast({ title: "Missing Address", description: "Please enter a recipient address", variant: "destructive" });
      return;
    }
    if (!sendAmount || parseFloat(sendAmount) <= 0) {
      toast({ title: "Invalid Amount", description: "Please enter a valid amount to send", variant: "destructive" });
      return;
    }
    
    const currentBalance = testnetBalances?.find(b => b.chain === selectedChain.id);
    if (!currentBalance || parseFloat(currentBalance.balance) < parseFloat(sendAmount)) {
      toast({ 
        title: "Insufficient Balance", 
        description: `You don't have enough ${selectedChain.symbol}. Get test tokens from the faucet.`, 
        variant: "destructive" 
      });
      return;
    }
    
    setIsSending(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      toast({ 
        title: "Transaction Simulation", 
        description: `Sending ${sendAmount} ${selectedChain.symbol} on ${getTestnetName(selectedChain.id)} testnet. Full transaction broadcasting coming soon!` 
      });
      setSendAmount("");
      setSendAddress("");
    } finally {
      setIsSending(false);
    }
  };

  const copyAddress = (address: string) => {
    navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast({ title: "Address Copied", description: "Wallet address copied to clipboard" });
  };

  const validatePassword = (pwd: string): { valid: boolean; message: string } => {
    if (pwd.length < 8) return { valid: false, message: "Password must be at least 8 characters" };
    if (!/[A-Z]/.test(pwd)) return { valid: false, message: "Password must contain at least one uppercase letter" };
    if (!/[a-z]/.test(pwd)) return { valid: false, message: "Password must contain at least one lowercase letter" };
    if (!/[0-9]/.test(pwd)) return { valid: false, message: "Password must contain at least one number" };
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(pwd)) return { valid: false, message: "Password must contain at least one special character (!@#$%^&*)" };
    return { valid: true, message: "" };
  };

  // Create wallet using proper BIP39 mnemonic generation
  const handleCreateWallet = async () => {
    if (password !== confirmPassword) {
      toast({ title: "Error", description: "Passwords do not match", variant: "destructive" });
      return;
    }
    const passwordCheck = validatePassword(password);
    if (!passwordCheck.valid) {
      toast({ title: "Weak Password", description: passwordCheck.message, variant: "destructive" });
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
      const walletData = JSON.parse(savedWallet);
      
      // Check if this is the new encrypted format
      if (!walletData.encryptedSeed || !walletData.salt || !walletData.iv) {
        // Old format detected - prompt user to create new wallet
        toast({ 
          title: "Wallet Upgrade Required", 
          description: "Your old wallet format needs to be upgraded. Please create a new wallet or import your recovery phrase.",
          variant: "destructive" 
        });
        localStorage.removeItem('darkwave_wallet');
        setShowLogin(false);
        setIsCreating(false);
        return;
      }
      
      await unlockWallet(walletData as StoredWallet, loginPassword);
      
      setWalletCreated(true);
      setShowLogin(false);
      
      // If user has passkeys but not biometric wallet unlock, set it up automatically
      if (user && hasPasskeys && !hasBiometricSetup) {
        handleSetupBiometric(loginPassword);
      }
      
      setLoginPassword("");
      toast({ title: "Welcome Back", description: "Wallet unlocked successfully" });
    } catch (error: any) {
      toast({ title: "Error", description: "Incorrect password. Please try again.", variant: "destructive" });
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
    const importPasswordCheck = validatePassword(importPassword);
    if (!importPasswordCheck.valid) {
      toast({ title: "Weak Password", description: importPasswordCheck.message, variant: "destructive" });
      return;
    }
    if (false) { // kept for backwards compatibility
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
    a.download = `trustlayer-wallet-backup-${new Date().toISOString().split('T')[0]}.json`;
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
            <Shield className="w-7 h-7 text-cyan-400" />
            <span className="font-display font-bold text-lg tracking-tight">Trust Layer</span>
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

      <div className="fixed top-14 left-0 right-0 z-40 bg-gradient-to-r from-cyan-600/90 to-purple-600/90 backdrop-blur-sm border-b border-cyan-500/50">
        <div className="container mx-auto px-4 py-3 flex flex-col items-center gap-1 text-center">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-white flex-shrink-0" />
            <span className="text-xs sm:text-sm font-bold text-white">Trust Layer Wallet — Shells Only Until Launch</span>
          </div>
          <span className="text-[10px] sm:text-xs text-white/80">Use your preferred wallet (MetaMask, Phantom, etc.) for presale crypto purchases</span>
        </div>
      </div>

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-500" />
      </div>

      <div className="relative z-10 container mx-auto px-4 pt-32 pb-8 overflow-hidden">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/30 mb-6">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span className="text-sm text-amber-300">Shells Economy Wallet</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
              Trust Layer Wallet
            </span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto mb-4">
            Collect and manage your Shells before mainnet launch.
          </p>
          <div className="max-w-xl mx-auto p-4 rounded-xl bg-slate-800/50 border border-white/10">
            <p className="text-sm text-gray-300">
              <strong className="text-amber-400">Pre-Launch Mode:</strong> This wallet is for Shells only. For presale purchases, use your preferred third-party wallet (MetaMask for Ethereum, Phantom for Solana, etc.) with the "Buy Crypto" button below.
            </p>
          </div>
        </motion.div>

        {user && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-8 max-w-4xl mx-auto"
          >
            <DwcBagDashboard />
          </motion.div>
        )}

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
                    
                    {/* Biometric unlock option */}
                    {user && hasPasskeys && (
                      <div className="pb-4 border-b border-white/10">
                        <Button
                          onClick={handleBiometricUnlock}
                          disabled={isBiometricUnlocking}
                          className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600"
                          data-testid="button-biometric-unlock"
                        >
                          {isBiometricUnlocking ? (
                            <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                          ) : (
                            <Fingerprint className="w-4 h-4 mr-2" />
                          )}
                          {isBiometricUnlocking ? "Verifying..." : (hasBiometricSetup ? "Unlock with Fingerprint" : "Restore with Fingerprint")}
                        </Button>
                        <div className="text-center mt-3">
                          <span className="text-xs text-muted-foreground">
                            {hasBiometricSetup ? "One tap to unlock your wallet" : "Verifies identity and restores backup, then enter password"}
                          </span>
                        </div>
                      </div>
                    )}
                    
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
                {/* Cloud restore option for logged-in users with backups */}
                {user && hasCloudBackup && (
                  <div className="mb-6 p-4 rounded-xl bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/30">
                    <div className="flex items-center gap-2 mb-3">
                      <Cloud className="w-5 h-5 text-cyan-400" />
                      <span className="font-medium text-cyan-300">Cloud Backup Found</span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-4">
                      We found your wallet backup. Restore it to continue.
                    </p>
                    {hasPasskeys ? (
                      <Button
                        onClick={handleBiometricUnlock}
                        disabled={isBiometricUnlocking}
                        className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600"
                        data-testid="button-restore-biometric"
                      >
                        {isBiometricUnlocking ? (
                          <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                        ) : (
                          <Fingerprint className="w-4 h-4 mr-2" />
                        )}
                        {isBiometricUnlocking ? "Verifying..." : (hasBiometricSetup ? "Unlock with Fingerprint" : "Restore with Fingerprint")}
                      </Button>
                    ) : (
                      <Button
                        onClick={handleCloudRestore}
                        disabled={isRestoring}
                        className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600"
                        data-testid="button-restore-cloud"
                      >
                        {isRestoring ? (
                          <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                        ) : (
                          <Cloud className="w-4 h-4 mr-2" />
                        )}
                        {isRestoring ? "Restoring..." : "Restore from Cloud"}
                      </Button>
                    )}
                  </div>
                )}
                
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
                      <div className="text-xs text-muted-foreground space-y-1">
                        <p className={password.length >= 8 ? "text-green-400" : ""}>• At least 8 characters</p>
                        <p className={/[A-Z]/.test(password) ? "text-green-400" : ""}>• One uppercase letter</p>
                        <p className={/[a-z]/.test(password) ? "text-green-400" : ""}>• One lowercase letter</p>
                        <p className={/[0-9]/.test(password) ? "text-green-400" : ""}>• One number</p>
                        <p className={/[!@#$%^&*(),.?":{}|<>]/.test(password) ? "text-green-400" : ""}>• One special character</p>
                      </div>
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
                      disabled={isCreating || !validatePassword(password).valid || password !== confirmPassword}
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
                      <Label>Password</Label>
                      <Input
                        type="password"
                        placeholder="Create a strong password"
                        value={importPassword}
                        onChange={(e) => setImportPassword(e.target.value)}
                        className="bg-white/5 border-white/10"
                        data-testid="input-import-password"
                      />
                      <p className="text-xs text-muted-foreground">Must have 8+ chars, uppercase, lowercase, number, special character</p>
                    </div>
                    <Button
                      onClick={handleImportWallet}
                      disabled={isCreating || !importMnemonic || !validatePassword(importPassword).valid}
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
                      <div className="flex items-center gap-2 mb-1">
                        <p className="text-sm text-muted-foreground">Total Portfolio Value</p>
                        <span className="px-2 py-0.5 text-xs bg-cyan-500/20 text-cyan-400 rounded-full border border-cyan-500/30">
                          TESTNET
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={handleRefreshBalances}
                          disabled={isRefreshingBalances || isLoadingBalances}
                          className="h-6 w-6 p-0 hover:bg-white/10"
                          data-testid="button-refresh-balances"
                        >
                          <RefreshCw className={`w-3 h-3 ${isRefreshingBalances || isLoadingBalances ? 'animate-spin' : ''}`} />
                        </Button>
                      </div>
                      <div className="flex items-baseline gap-2">
                        <span className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                          ${totalBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </span>
                        {isLoadingBalances && (
                          <span className="text-cyan-400 text-sm flex items-center gap-1">
                            <Loader className="w-3 h-3 animate-spin" />
                            Loading...
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mt-2">
                        Across {SUPPORTED_CHAINS.length} testnet chains
                      </p>
                    </div>
                    
                    <div className="flex gap-3 flex-wrap justify-center md:justify-end">
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
                      <Button
                        onClick={() => setShowBuyCrypto(true)}
                        className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600"
                        data-testid="button-buy-crypto"
                      >
                        <CreditCard className="w-4 h-4 mr-2" />
                        Buy Crypto
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

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 overflow-hidden">
              <div className="lg:col-span-2 space-y-4 min-w-0">
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
                      <Card className="bg-white/5 backdrop-blur-xl border-white/10 hover:bg-white/10 transition-all duration-300 group cursor-pointer overflow-hidden">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between gap-3">
                            <div className="flex items-center gap-3 min-w-0 flex-1">
                              <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-r ${chain.color} flex items-center justify-center text-xl sm:text-2xl shadow-lg group-hover:scale-110 transition-transform flex-shrink-0`}>
                                {chain.icon}
                              </div>
                              <div className="min-w-0 flex-1">
                                <div className="flex items-center gap-1 sm:gap-2 flex-wrap">
                                  <h3 className="font-semibold text-sm sm:text-base truncate">{chain.name}</h3>
                                  <span className="px-1.5 py-0.5 text-[10px] rounded bg-cyan-500/20 text-cyan-400 border border-cyan-500/20">
                                    {getTestnetName(chain.id)}
                                  </span>
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
                            <div className="text-right flex flex-col items-end gap-1 flex-shrink-0">
                              <p className="font-semibold text-sm sm:text-base">{account.balance} {chain.symbol}</p>
                              <a 
                                href={getTestnetFaucetUrl(chain.id)} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-[10px] sm:text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1 transition-colors"
                                data-testid={`link-faucet-${chain.id}`}
                              >
                                <Zap className="w-3 h-3" />
                                <span className="hidden sm:inline">Get Test Tokens</span>
                                <span className="sm:hidden">Faucet</span>
                              </a>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })}
              </div>

              <div className="space-y-6 min-w-0">
                <Card className="bg-white/5 backdrop-blur-xl border-white/10 overflow-hidden">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base sm:text-lg flex items-center gap-2">
                      <Send className="w-5 h-5 text-purple-400 flex-shrink-0" />
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
                      onClick={handleSendTransaction}
                      disabled={isSending}
                    >
                      {isSending ? (
                        <Loader className="w-4 h-4 mr-2 animate-spin" />
                      ) : (
                        <Send className="w-4 h-4 mr-2" />
                      )}
                      {isSending ? "Sending..." : `Send ${selectedChain.symbol}`}
                    </Button>
                    <p className="text-xs text-center text-muted-foreground mt-2">
                      Multi-chain support • Faucets available for test tokens
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-white/5 backdrop-blur-xl border-white/10 overflow-hidden">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base sm:text-lg flex items-center gap-2">
                      <Shield className="w-5 h-5 text-green-400 flex-shrink-0" />
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
                    
                    <div className="pt-3 border-t border-white/10 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Cloud className="w-4 h-4 text-cyan-400" />
                          <span className="text-sm font-medium">Cloud Backup</span>
                        </div>
                        {backupStatus?.exists ? (
                          <span className="text-xs text-cyan-400">Synced</span>
                        ) : (
                          <span className="text-xs text-muted-foreground">Not enabled</span>
                        )}
                      </div>
                      
                      {user?.id ? (
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={handleCloudBackup}
                            disabled={isBackingUp}
                            className="flex-1 border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10"
                            data-testid="button-cloud-backup"
                          >
                            {isBackingUp ? (
                              <Loader className="w-3 h-3 mr-1 animate-spin" />
                            ) : (
                              <Upload className="w-3 h-3 mr-1" />
                            )}
                            {isBackingUp ? "Backing up..." : "Backup"}
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={handleCloudRestore}
                            disabled={isRestoring || !backupStatus?.exists}
                            className="flex-1 border-purple-500/30 text-purple-400 hover:bg-purple-500/10"
                            data-testid="button-cloud-restore"
                          >
                            {isRestoring ? (
                              <Loader className="w-3 h-3 mr-1 animate-spin" />
                            ) : (
                              <Download className="w-3 h-3 mr-1" />
                            )}
                            {isRestoring ? "Restoring..." : "Restore"}
                          </Button>
                        </div>
                      ) : (
                        <p className="text-xs text-muted-foreground">Sign in to enable cloud backup</p>
                      )}
                    </div>
                    
                    {user?.id && (
                      <div className="pt-3 border-t border-white/10">
                        <PhoneVerification compact />
                      </div>
                    )}
                  </CardContent>
                </Card>
                
                {/* External Wallets Card */}
                <Card className="bg-white/5 backdrop-blur-xl border-white/10 overflow-hidden">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <ExternalLink className="w-4 h-4 text-purple-400" />
                        <span className="text-sm font-medium">Third-Party Wallets</span>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setShowExternalWallets(!showExternalWallets)}
                        className="h-7 text-xs"
                        data-testid="button-toggle-external-wallets"
                      >
                        {showExternalWallets ? 'Hide' : 'Manage'}
                      </Button>
                    </div>
                    
                    <p className="text-xs text-muted-foreground mb-3">
                      Save your MetaMask or Phantom addresses for easy access during crypto purchases.
                    </p>
                    
                    {showExternalWallets && user?.id && (
                      <div className="space-y-3 mt-4 pt-3 border-t border-white/10">
                        {/* Add new wallet form */}
                        <div className="space-y-2">
                          <select
                            value={newExternalChain}
                            onChange={(e) => setNewExternalChain(e.target.value)}
                            className="w-full p-2 rounded-lg bg-white/5 border border-white/10 text-sm"
                            data-testid="select-external-chain"
                          >
                            <optgroup label="Solana Wallets">
                              <option value="solana">Solana (Phantom, Solflare)</option>
                            </optgroup>
                            <optgroup label="EVM Wallets (MetaMask, Trust, Coinbase)">
                              <option value="ethereum">Ethereum</option>
                              <option value="base">Base</option>
                              <option value="polygon">Polygon</option>
                              <option value="arbitrum">Arbitrum</option>
                              <option value="optimism">Optimism</option>
                              <option value="bsc">BNB Chain</option>
                              <option value="avalanche">Avalanche</option>
                            </optgroup>
                          </select>
                          <Input
                            placeholder="Wallet address"
                            value={newExternalAddress}
                            onChange={(e) => setNewExternalAddress(e.target.value)}
                            className="bg-white/5 border-white/10 text-sm"
                            data-testid="input-external-address"
                          />
                          <Input
                            placeholder="Label (optional)"
                            value={newExternalLabel}
                            onChange={(e) => setNewExternalLabel(e.target.value)}
                            className="bg-white/5 border-white/10 text-sm"
                            data-testid="input-external-label"
                          />
                          <Button
                            size="sm"
                            onClick={handleSaveExternalWallet}
                            disabled={isSavingExternalWallet || !newExternalAddress.trim()}
                            className="w-full bg-purple-500/20 border border-purple-500/30 text-purple-400 hover:bg-purple-500/30"
                            data-testid="button-save-external-wallet"
                          >
                            {isSavingExternalWallet ? <Loader className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4 mr-1" />}
                            Save Wallet
                          </Button>
                        </div>
                        
                        {/* Saved wallets list */}
                        {externalWallets.length > 0 && (
                          <div className="space-y-2 mt-3">
                            <p className="text-xs text-muted-foreground">Saved wallets:</p>
                            {externalWallets.map((wallet: any) => (
                              <div key={wallet.id} className="flex items-center justify-between p-2 rounded-lg bg-white/5 border border-white/10">
                                <div className="min-w-0 flex-1">
                                  <div className="flex items-center gap-2">
                                    <span className="text-xs font-medium text-purple-400 uppercase">{wallet.chain}</span>
                                    {wallet.label && <span className="text-xs text-muted-foreground">({wallet.label})</span>}
                                  </div>
                                  <code className="text-xs text-muted-foreground font-mono truncate block">
                                    {wallet.address.slice(0, 10)}...{wallet.address.slice(-6)}
                                  </code>
                                </div>
                                <div className="flex gap-1 ml-2">
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => {
                                      navigator.clipboard.writeText(wallet.address);
                                      toast({ title: "Copied!" });
                                    }}
                                    className="h-7 w-7 p-0"
                                    data-testid={`button-copy-external-${wallet.id}`}
                                  >
                                    <Copy className="w-3 h-3" />
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => handleDeleteExternalWallet(wallet.id)}
                                    className="h-7 w-7 p-0 text-red-400 hover:text-red-300"
                                    data-testid={`button-delete-external-${wallet.id}`}
                                  >
                                    <X className="w-3 h-3" />
                                  </Button>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                    
                    {!user?.id && (
                      <p className="text-xs text-muted-foreground">Sign in to save external wallets</p>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </>
        )}
        
        {/* Buy Crypto Modal */}
        <AnimatePresence>
          {showBuyCrypto && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={() => setShowBuyCrypto(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="w-full max-w-md"
              >
                <Card className="bg-slate-900/95 backdrop-blur-xl border-white/10 shadow-2xl shadow-emerald-500/20">
                  <CardHeader className="relative">
                    <button
                      onClick={() => setShowBuyCrypto(false)}
                      className="absolute right-4 top-4 p-2 rounded-full hover:bg-white/10 transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="p-3 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500">
                        <CreditCard className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-xl">Buy Crypto</CardTitle>
                        <p className="text-sm text-muted-foreground">Purchase with card via Stripe</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-2">
                      <Label>Amount (USD)</Label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                        <Input
                          type="number"
                          value={buyAmount}
                          onChange={(e) => setBuyAmount(e.target.value)}
                          className="pl-7 bg-white/5 border-white/10"
                          placeholder="100"
                          min="10"
                          data-testid="input-buy-amount"
                        />
                      </div>
                      <div className="flex gap-2 mt-2">
                        {["50", "100", "250", "500"].map((amount) => (
                          <Button
                            key={amount}
                            size="sm"
                            variant="outline"
                            onClick={() => setBuyAmount(amount)}
                            className={`flex-1 ${buyAmount === amount ? 'bg-emerald-500/20 border-emerald-500/50' : 'bg-white/5 border-white/10'}`}
                          >
                            ${amount}
                          </Button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Cryptocurrency</Label>
                      <div className="grid grid-cols-2 gap-2">
                        {[
                          { id: "eth", name: "Ethereum", symbol: "ETH", icon: "Ξ" },
                          { id: "sol", name: "Solana", symbol: "SOL", icon: "◎" },
                          { id: "usdc", name: "USD Coin", symbol: "USDC", icon: "$" },
                          { id: "matic", name: "Polygon", symbol: "MATIC", icon: "⬡" },
                        ].map((crypto) => (
                          <button
                            key={crypto.id}
                            onClick={() => setSelectedCrypto(crypto.id)}
                            className={`p-3 rounded-xl border transition-all ${
                              selectedCrypto === crypto.id
                                ? 'bg-emerald-500/20 border-emerald-500/50 shadow-lg shadow-emerald-500/20'
                                : 'bg-white/5 border-white/10 hover:bg-white/10'
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              <span className="text-xl">{crypto.icon}</span>
                              <div className="text-left">
                                <div className="font-medium text-sm">{crypto.symbol}</div>
                                <div className="text-xs text-muted-foreground">{crypto.name}</div>
                              </div>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-500/20">
                      <div className="flex items-center gap-2 mb-2">
                        <Shield className="w-4 h-4 text-emerald-400" />
                        <span className="text-sm font-medium text-emerald-400">Powered by Stripe</span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Secure payment processing. Crypto will be deposited directly to your wallet address.
                      </p>
                    </div>

                    <Button
                      onClick={async () => {
                        if (!user) {
                          toast({ title: "Sign in required", description: "Please sign in to buy crypto", variant: "destructive" });
                          return;
                        }
                        
                        const walletAddress = storedAddresses[selectedCrypto === 'sol' ? 'solana' : 'ethereum'];
                        if (!walletAddress) {
                          toast({ title: "Wallet required", description: "Please create a wallet first", variant: "destructive" });
                          return;
                        }
                        
                        setIsCreatingOnrampSession(true);
                        try {
                          const response = await axios.post("/api/crypto-onramp/create-session", {
                            walletAddress,
                            cryptoCurrency: selectedCrypto,
                            fiatCurrency: "usd",
                            fiatAmount: buyAmount,
                          });
                          
                          if (response.data.clientSecret) {
                            toast({ 
                              title: "Redirecting to Stripe", 
                              description: "Complete your purchase on Stripe's secure checkout" 
                            });
                            window.open(`https://crypto.link.com?client_secret=${response.data.clientSecret}`, '_blank');
                          }
                        } catch (error: any) {
                          toast({ 
                            title: "Error", 
                            description: error.response?.data?.details || "Failed to start purchase", 
                            variant: "destructive" 
                          });
                        } finally {
                          setIsCreatingOnrampSession(false);
                        }
                      }}
                      disabled={isCreatingOnrampSession || !buyAmount || parseFloat(buyAmount) < 10}
                      className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 h-12 text-lg"
                      data-testid="button-confirm-buy-crypto"
                    >
                      {isCreatingOnrampSession ? (
                        <>
                          <Loader className="w-5 h-5 mr-2 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <CreditCard className="w-5 h-5 mr-2" />
                          Buy ${buyAmount} of {selectedCrypto.toUpperCase()}
                        </>
                      )}
                    </Button>

                    <p className="text-xs text-center text-muted-foreground">
                      Minimum purchase: $10 USD. Fees and exchange rates apply.
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
