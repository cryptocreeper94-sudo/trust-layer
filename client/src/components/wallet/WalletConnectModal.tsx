import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useEthereumWallet } from '../../hooks/use-ethereum-wallet';
import { useSolanaWallet } from '../../hooks/use-solana-wallet';

const isMobile = () => /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

const hasPhantomExtension = () => !!(window as any).solana?.isPhantom;
const hasMetaMaskExtension = () => !!(window as any).ethereum?.isMetaMask;
const hasSolflareExtension = () => !!(window as any).solflare?.isSolflare;
const hasCoinbaseExtension = () => !!(window as any).ethereum?.isCoinbaseWallet;
const hasTrustWalletExtension = () => !!(window as any).ethereum?.isTrust || !!(window as any).trustwallet;

const openPhantomDeepLink = () => {
  const url = window.location.href;
  const phantomDeepLink = `https://phantom.app/ul/browse/${url}`;
  window.location.href = phantomDeepLink;
};

const openMetaMaskDeepLink = () => {
  const currentUrl = window.location.href.replace('https://', '').replace('http://', '');
  const metamaskDeepLink = `https://metamask.app.link/dapp/${currentUrl}`;
  window.location.href = metamaskDeepLink;
};

const openSolflareDeepLink = () => {
  const url = encodeURIComponent(window.location.href);
  const solflareDeepLink = `https://solflare.com/ul/v1/browse/${url}`;
  window.location.href = solflareDeepLink;
};

const openCoinbaseDeepLink = () => {
  const currentUrl = window.location.href.replace('https://', '').replace('http://', '');
  const coinbaseDeepLink = `https://go.cb-w.com/dapp?cb_url=${encodeURIComponent(window.location.href)}`;
  window.location.href = coinbaseDeepLink;
};

const openTrustWalletDeepLink = () => {
  const currentUrl = window.location.href.replace('https://', '').replace('http://', '');
  const trustDeepLink = `https://link.trustwallet.com/open_url?coin_id=60&url=${encodeURIComponent(window.location.href)}`;
  window.location.href = trustDeepLink;
};

interface WalletOption {
  id: string;
  name: string;
  icon: string;
  chain: 'ethereum' | 'solana' | 'multi';
  hasExtension: () => boolean;
  deepLink: () => void;
  installUrl: string;
  color: string;
}

export const WalletConnectModal: React.FC<{ open: boolean; onClose: () => void }> = ({ open, onClose }) => {
  const eth = useEthereumWallet();
  const sol = useSolanaWallet();
  const [mobile, setMobile] = useState(false);
  const [connecting, setConnecting] = useState<string | null>(null);

  useEffect(() => {
    setMobile(isMobile());
  }, [open]);

  if (!open) return null;

  const wallets: WalletOption[] = [
    {
      id: 'metamask',
      name: 'MetaMask',
      icon: '🦊',
      chain: 'ethereum',
      hasExtension: hasMetaMaskExtension,
      deepLink: openMetaMaskDeepLink,
      installUrl: 'https://metamask.io/download/',
      color: 'from-orange-500/20 to-orange-600/10',
    },
    {
      id: 'phantom',
      name: 'Phantom',
      icon: '👻',
      chain: 'solana',
      hasExtension: hasPhantomExtension,
      deepLink: openPhantomDeepLink,
      installUrl: 'https://phantom.app/',
      color: 'from-purple-500/20 to-purple-600/10',
    },
    {
      id: 'solflare',
      name: 'Solflare',
      icon: '🔥',
      chain: 'solana',
      hasExtension: hasSolflareExtension,
      deepLink: openSolflareDeepLink,
      installUrl: 'https://solflare.com/',
      color: 'from-orange-400/20 to-yellow-500/10',
    },
    {
      id: 'coinbase',
      name: 'Coinbase Wallet',
      icon: '🔵',
      chain: 'multi',
      hasExtension: hasCoinbaseExtension,
      deepLink: openCoinbaseDeepLink,
      installUrl: 'https://www.coinbase.com/wallet',
      color: 'from-blue-500/20 to-blue-600/10',
    },
    {
      id: 'trust',
      name: 'Trust Wallet',
      icon: '🛡️',
      chain: 'multi',
      hasExtension: hasTrustWalletExtension,
      deepLink: openTrustWalletDeepLink,
      installUrl: 'https://trustwallet.com/',
      color: 'from-cyan-500/20 to-blue-500/10',
    },
  ];

  const handleWalletClick = async (wallet: WalletOption) => {
    setConnecting(wallet.id);
    
    try {
      if (wallet.hasExtension()) {
        if (wallet.id === 'metamask' || wallet.id === 'coinbase' || wallet.id === 'trust') {
          await eth.connectMetaMask();
          onClose();
        } else if (wallet.id === 'phantom') {
          await sol.connectPhantom();
          onClose();
        } else if (wallet.id === 'solflare') {
          const solflare = (window as any).solflare;
          if (solflare) {
            await solflare.connect();
            onClose();
          }
        }
      } else if (mobile) {
        wallet.deepLink();
      } else {
        window.open(wallet.installUrl, '_blank');
      }
    } catch (e) {
      console.error(`Failed to connect ${wallet.name}:`, e);
    } finally {
      setConnecting(null);
    }
  };

  const getButtonText = (wallet: WalletOption) => {
    if (connecting === wallet.id) return 'Connecting...';
    if (wallet.hasExtension()) return wallet.name;
    if (mobile) return `Open in ${wallet.name}`;
    return `Get ${wallet.name}`;
  };

  const getChainBadge = (chain: string) => {
    switch (chain) {
      case 'ethereum': return { text: 'ETH', color: 'bg-blue-500/30 text-blue-300' };
      case 'solana': return { text: 'SOL', color: 'bg-purple-500/30 text-purple-300' };
      case 'multi': return { text: 'Multi', color: 'bg-gradient-to-r from-blue-500/30 to-purple-500/30 text-white' };
      default: return { text: '', color: '' };
    }
  };

  const isConnected = eth.wallet?.address || sol.wallet?.publicKey;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm" onClick={onClose} />
      <motion.div
        initial={{ y: 60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 60, opacity: 0 }}
        className="relative w-full max-w-md mx-4 sm:mx-0 bg-gradient-to-b from-slate-950 to-slate-900 rounded-2xl p-5 shadow-2xl border border-slate-700/50"
        role="dialog"
        aria-modal="true"
        data-testid="wallet-connect-modal"
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-xl font-bold text-white">Connect Wallet</h3>
            <p className="text-sm text-slate-400">Choose your preferred wallet</p>
          </div>
          <button 
            onClick={onClose} 
            aria-label="Close" 
            className="p-2 rounded-lg hover:bg-slate-800 transition-colors text-slate-400 hover:text-white" 
            data-testid="wallet-modal-close"
          >
            ✕
          </button>
        </div>

        {mobile && (
          <div className="mb-4 p-3 rounded-lg bg-amber-900/20 border border-amber-600/30 text-amber-200 text-sm">
            Tap a wallet to open this page in that wallet's browser.
          </div>
        )}

        {isConnected && (
          <div className="mb-4 p-3 rounded-lg bg-emerald-900/20 border border-emerald-600/30 text-emerald-200 text-sm flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            Wallet connected: {eth.wallet?.address?.slice(0, 6) || sol.wallet?.publicKey?.slice(0, 6)}...
          </div>
        )}

        <div className="grid gap-2">
          {wallets.map((wallet) => {
            const badge = getChainBadge(wallet.chain);
            return (
              <button
                key={wallet.id}
                data-testid={`connect-${wallet.id}`}
                onClick={() => handleWalletClick(wallet)}
                disabled={connecting !== null}
                className={`w-full flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r ${wallet.color} border border-slate-700/50 hover:border-slate-600 transition-all hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                <span className="text-2xl">{wallet.icon}</span>
                <div className="flex-1 text-left">
                  <div className="font-semibold text-white">{getButtonText(wallet)}</div>
                  <div className="text-xs text-slate-400">
                    {wallet.hasExtension() ? 'Ready to connect' : mobile ? 'Tap to open' : 'Click to install'}
                  </div>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full ${badge.color}`}>
                  {badge.text}
                </span>
              </button>
            );
          })}
        </div>

        <div className="mt-4 pt-4 border-t border-slate-800">
          <div className="flex items-center justify-between text-sm">
            <div className="text-slate-400">
              <span className="text-cyan-400">{wallets.filter(w => w.hasExtension()).length}</span> wallets detected
            </div>
            <button 
              onClick={onClose} 
              className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-white transition-colors" 
              data-testid="wallet-modal-done"
            >
              Done
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
