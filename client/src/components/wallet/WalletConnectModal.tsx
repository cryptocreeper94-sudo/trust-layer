import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useEthereumWallet } from '../../hooks/use-ethereum-wallet';
import { useSolanaWallet } from '../../hooks/use-solana-wallet';

const isMobile = () => /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

const hasPhantomExtension = () => !!(window as any).solana?.isPhantom;
const hasMetaMaskExtension = () => !!(window as any).ethereum?.isMetaMask;

const openPhantomDeepLink = () => {
  const url = window.location.href;
  const ref = encodeURIComponent(url);
  const phantomDeepLink = `https://phantom.app/ul/browse/${encodeURIComponent(url)}?ref=${ref}`;
  
  const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);
  const isAndroid = /Android/i.test(navigator.userAgent);
  
  if (isIOS || isAndroid) {
    const nativeScheme = `phantom://browse/${encodeURIComponent(url)}`;
    
    const timeout = setTimeout(() => {
      window.location.href = phantomDeepLink;
    }, 1500);
    
    window.location.href = nativeScheme;
    
    window.addEventListener('blur', () => clearTimeout(timeout), { once: true });
  } else {
    window.location.href = phantomDeepLink;
  }
};

const openMetaMaskDeepLink = () => {
  const currentUrl = window.location.href.replace('https://', '').replace('http://', '');
  const metamaskDeepLink = `https://metamask.app.link/dapp/${currentUrl}`;
  window.location.href = metamaskDeepLink;
};

export const WalletConnectModal: React.FC<{ open: boolean; onClose: () => void }> = ({ open, onClose }) => {
  const eth = useEthereumWallet();
  const sol = useSolanaWallet();
  const [mobile, setMobile] = useState(false);
  const [hasPhantom, setHasPhantom] = useState(false);
  const [hasMetaMask, setHasMetaMask] = useState(false);

  useEffect(() => {
    setMobile(isMobile());
    setHasPhantom(hasPhantomExtension());
    setHasMetaMask(hasMetaMaskExtension());
  }, [open]);

  if (!open) return null;

  const handlePhantomClick = async () => {
    if (hasPhantom) {
      try {
        await sol.connectPhantom();
        onClose();
      } catch (e) {
        console.error(e);
      }
    } else if (mobile) {
      openPhantomDeepLink();
    } else {
      window.open('https://phantom.app/', '_blank');
    }
  };

  const handleMetaMaskClick = async () => {
    if (hasMetaMask) {
      try {
        await eth.connectMetaMask();
        onClose();
      } catch (e) {
        console.error(e);
      }
    } else if (mobile) {
      openMetaMaskDeepLink();
    } else {
      window.open('https://metamask.io/download/', '_blank');
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
    >
      <div className="absolute inset-0 bg-slate-900/70 backdrop-blur-sm" onClick={onClose} />
      <motion.div
        initial={{ y: 60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 60, opacity: 0 }}
        className="relative w-full max-w-md mx-4 sm:mx-0 bg-slate-950 rounded-xl p-4 shadow-lg border border-slate-800/40"
        role="dialog"
        aria-modal="true"
        data-testid="wallet-connect-modal"
      >
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold text-white">Connect Wallet</h3>
          <button onClick={onClose} aria-label="Close" className="p-2 rounded" data-testid="wallet-modal-close">
            ✕
          </button>
        </div>

        {mobile && !hasPhantom && !hasMetaMask && (
          <div className="mb-3 p-3 rounded-lg bg-amber-900/30 border border-amber-600/40 text-amber-200 text-sm">
            On mobile, tap a wallet button to open this page in that wallet's browser.
          </div>
        )}

        <div className="grid gap-3">
          <div className="rounded-lg p-3 bg-gradient-to-r from-slate-900/40 to-slate-800/30 border border-slate-700/60 flex flex-col">
            <div className="text-sm text-slate-300 mb-2">Ethereum</div>
            <div className="flex gap-2">
              <button
                data-testid="connect-metamask"
                onClick={handleMetaMaskClick}
                className="flex-1 bg-slate-900/40 hover:bg-slate-900/60 text-white py-3 rounded-md min-h-[48px]"
              >
                {hasMetaMask ? 'MetaMask' : mobile ? 'Open in MetaMask' : 'Install MetaMask'}
              </button>
              <button
                data-testid="connect-walletconnect"
                onClick={() => { }}
                className="flex-1 bg-slate-900/40 hover:bg-slate-900/60 text-white py-3 rounded-md min-h-[48px]"
              >
                WalletConnect
              </button>
            </div>
            <div className="text-xs text-slate-400 mt-2">Status: <span className="text-cyan-300">{eth.wallet?.address ? 'Connected' : 'Not Connected'}</span></div>
          </div>

          <div className="rounded-lg p-3 bg-gradient-to-r from-slate-900/40 to-slate-800/30 border border-slate-700/60">
            <div className="text-sm text-slate-300 mb-2">Solana</div>
            <div className="flex gap-2">
              <button
                data-testid="connect-phantom"
                onClick={handlePhantomClick}
                className="flex-1 bg-slate-900/40 hover:bg-slate-900/60 text-white py-3 rounded-md min-h-[48px]"
              >
                {hasPhantom ? 'Phantom' : mobile ? 'Open in Phantom' : 'Install Phantom'}
              </button>
              <button
                data-testid="connect-solflare"
                onClick={() => { }}
                className="flex-1 bg-slate-900/40 hover:bg-slate-900/60 text-white py-3 rounded-md min-h-[48px]"
              >
                Solflare
              </button>
            </div>
            <div className="text-xs text-slate-400 mt-2">Status: <span className="text-cyan-300">{sol.wallet?.publicKey ? 'Connected' : 'Not Connected'}</span></div>
          </div>

          <div className="flex justify-end">
            <button onClick={onClose} className="px-4 py-2 rounded-md bg-slate-800 hover:bg-slate-700 text-white" data-testid="wallet-modal-done">Done</button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
