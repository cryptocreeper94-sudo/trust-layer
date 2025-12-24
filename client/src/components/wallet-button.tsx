import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Wallet, X, ExternalLink, Copy, Check, LogOut, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useWallet, shortenAddress } from "@/hooks/use-wallet";

export function WalletButton() {
  const { 
    evmAddress, 
    solanaAddress, 
    isConnecting, 
    isConnected, 
    connectEVM, 
    connectSolana, 
    disconnect,
    hasMetaMask,
    hasPhantom,
    error 
  } = useWallet();
  
  const [showModal, setShowModal] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = async (address: string) => {
    await navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const activeAddress = evmAddress || solanaAddress;
  const activeChain = evmAddress ? "EVM" : solanaAddress ? "Solana" : null;

  if (isConnected && activeAddress) {
    return (
      <div className="relative">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowDropdown(!showDropdown)}
          className="gap-2 border-primary/30 bg-primary/10 text-primary hover:bg-primary/20"
          data-testid="button-wallet-connected"
        >
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          {shortenAddress(activeAddress)}
          <ChevronDown className="w-3 h-3" />
        </Button>

        <AnimatePresence>
          {showDropdown && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setShowDropdown(false)} />
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute right-0 top-full mt-2 w-64 bg-background/95 backdrop-blur-xl border border-white/10 rounded-xl p-3 shadow-xl z-50"
              >
                <div className="space-y-3">
                  <div className="text-xs text-muted-foreground">Connected via {activeChain}</div>
                  
                  {evmAddress && (
                    <div className="flex items-center justify-between p-2 bg-white/5 rounded-lg">
                      <div>
                        <div className="text-[10px] text-muted-foreground">EVM</div>
                        <div className="text-xs font-mono">{shortenAddress(evmAddress, 6)}</div>
                      </div>
                      <div className="flex gap-1">
                        <button
                          onClick={() => handleCopy(evmAddress)}
                          className="p-1.5 hover:bg-white/10 rounded"
                        >
                          {copied ? <Check className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3" />}
                        </button>
                        <a
                          href={`https://etherscan.io/address/${evmAddress}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 hover:bg-white/10 rounded"
                        >
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    </div>
                  )}
                  
                  {solanaAddress && (
                    <div className="flex items-center justify-between p-2 bg-white/5 rounded-lg">
                      <div>
                        <div className="text-[10px] text-muted-foreground">Solana</div>
                        <div className="text-xs font-mono">{shortenAddress(solanaAddress, 6)}</div>
                      </div>
                      <div className="flex gap-1">
                        <button
                          onClick={() => handleCopy(solanaAddress)}
                          className="p-1.5 hover:bg-white/10 rounded"
                        >
                          {copied ? <Check className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3" />}
                        </button>
                        <a
                          href={`https://solscan.io/account/${solanaAddress}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 hover:bg-white/10 rounded"
                        >
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    </div>
                  )}

                  {!evmAddress && hasMetaMask && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="w-full text-xs"
                      onClick={connectEVM}
                    >
                      + Add EVM Wallet
                    </Button>
                  )}
                  
                  {!solanaAddress && hasPhantom && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="w-full text-xs"
                      onClick={connectSolana}
                    >
                      + Add Solana Wallet
                    </Button>
                  )}

                  <Button
                    size="sm"
                    variant="ghost"
                    className="w-full text-xs text-red-400 hover:text-red-300 hover:bg-red-500/10"
                    onClick={() => {
                      disconnect();
                      setShowDropdown(false);
                    }}
                    data-testid="button-disconnect-wallet"
                  >
                    <LogOut className="w-3 h-3 mr-2" />
                    Disconnect
                  </Button>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    );
  }

  return (
    <>
      <Button
        size="sm"
        onClick={() => setShowModal(true)}
        className="gap-2 bg-primary text-background hover:bg-primary/90 px-2 sm:px-3"
        disabled={isConnecting}
        data-testid="button-connect-wallet"
      >
        <Wallet className="w-4 h-4 flex-shrink-0" />
        <span className="hidden sm:inline">
          {isConnecting ? "Connecting..." : "Connect Wallet"}
        </span>
      </Button>

      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/70 backdrop-blur-sm"
              onClick={() => setShowModal(false)}
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-sm bg-background/95 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl"
            >
              <button
                onClick={() => setShowModal(false)}
                className="absolute top-4 right-4 text-muted-foreground hover:text-white transition-colors"
                data-testid="button-close-wallet-modal"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="text-center mb-6">
                <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
                  <Wallet className="w-8 h-8 text-primary" />
                </div>
                <h2 className="text-xl font-bold text-white mb-2">Connect Wallet</h2>
                <p className="text-muted-foreground text-sm">Choose your wallet to connect to DarkWave Chain</p>
              </div>

              {error && (
                <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-xs">
                  {error}
                </div>
              )}

              <div className="space-y-3">
                <Button
                  variant="outline"
                  className="w-full h-14 bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20 justify-start gap-4 text-white"
                  onClick={async () => {
                    await connectEVM();
                    if (!error) setShowModal(false);
                  }}
                  disabled={isConnecting}
                  data-testid="button-connect-metamask"
                >
                  <img src="https://upload.wikimedia.org/wikipedia/commons/3/36/MetaMask_Fox.svg" alt="MetaMask" className="w-8 h-8" />
                  <div className="text-left">
                    <div className="font-medium">MetaMask</div>
                    <div className="text-xs text-muted-foreground">Connect with browser extension</div>
                  </div>
                </Button>

                <Button
                  variant="outline"
                  className="w-full h-14 bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20 justify-start gap-4 text-white"
                  onClick={async () => {
                    await connectSolana();
                    if (!error) setShowModal(false);
                  }}
                  disabled={isConnecting}
                  data-testid="button-connect-phantom"
                >
                  <img src="https://phantom.app/img/phantom-logo.svg" alt="Phantom" className="w-8 h-8" />
                  <div className="text-left">
                    <div className="font-medium">Phantom</div>
                    <div className="text-xs text-muted-foreground">Connect Solana wallet</div>
                  </div>
                </Button>

                <div className="pt-4 border-t border-white/10">
                  <p className="text-xs text-center text-muted-foreground">
                    By connecting, you agree to our Terms of Service
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
