import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";

declare global {
  interface Window {
    ethereum?: {
      isMetaMask?: boolean;
      request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
      on: (event: string, handler: (...args: unknown[]) => void) => void;
      removeListener: (event: string, handler: (...args: unknown[]) => void) => void;
    };
    solana?: {
      isPhantom?: boolean;
      connect: () => Promise<{ publicKey: { toString: () => string } }>;
      disconnect: () => Promise<void>;
      on: (event: string, handler: (...args: unknown[]) => void) => void;
      publicKey?: { toString: () => string };
    };
  }
}

interface WalletState {
  evmAddress: string | null;
  solanaAddress: string | null;
  isConnecting: boolean;
  isConnected: boolean;
  chainId: string | null;
  error: string | null;
}

interface WalletContextType extends WalletState {
  connectEVM: () => Promise<void>;
  connectSolana: () => Promise<void>;
  disconnect: () => void;
  hasMetaMask: boolean;
  hasPhantom: boolean;
}

const WalletContext = createContext<WalletContextType | null>(null);

export function WalletProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<WalletState>({
    evmAddress: null,
    solanaAddress: null,
    isConnecting: false,
    isConnected: false,
    chainId: null,
    error: null,
  });

  const [hasMetaMask, setHasMetaMask] = useState(false);
  const [hasPhantom, setHasPhantom] = useState(false);

  useEffect(() => {
    setHasMetaMask(typeof window !== "undefined" && !!window.ethereum);
    setHasPhantom(typeof window !== "undefined" && !!window.solana?.isPhantom);

    const savedEvm = localStorage.getItem("dw_evm_address");
    const savedSolana = localStorage.getItem("dw_solana_address");
    
    if (savedEvm || savedSolana) {
      setState(prev => ({
        ...prev,
        evmAddress: savedEvm,
        solanaAddress: savedSolana,
        isConnected: !!(savedEvm || savedSolana),
      }));
    }

    if (window.ethereum) {
      window.ethereum.on("accountsChanged", handleAccountsChanged);
      window.ethereum.on("chainChanged", handleChainChanged);
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener("accountsChanged", handleAccountsChanged);
        window.ethereum.removeListener("chainChanged", handleChainChanged);
      }
    };
  }, []);

  const handleAccountsChanged = (accounts: unknown) => {
    const accs = accounts as string[];
    if (accs.length === 0) {
      setState(prev => ({ ...prev, evmAddress: null, isConnected: !!prev.solanaAddress }));
      localStorage.removeItem("dw_evm_address");
    } else {
      setState(prev => ({ ...prev, evmAddress: accs[0], isConnected: true }));
      localStorage.setItem("dw_evm_address", accs[0]);
    }
  };

  const handleChainChanged = (chainId: unknown) => {
    setState(prev => ({ ...prev, chainId: chainId as string }));
  };

  const connectEVM = useCallback(async () => {
    if (!window.ethereum) {
      setState(prev => ({ ...prev, error: "MetaMask not installed. Please install MetaMask to connect." }));
      window.open("https://metamask.io/download/", "_blank");
      return;
    }

    setState(prev => ({ ...prev, isConnecting: true, error: null }));

    try {
      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" }) as string[];
      const chainId = await window.ethereum.request({ method: "eth_chainId" }) as string;
      
      if (accounts.length > 0) {
        setState(prev => ({
          ...prev,
          evmAddress: accounts[0],
          chainId,
          isConnected: true,
          isConnecting: false,
        }));
        localStorage.setItem("dw_evm_address", accounts[0]);
      }
    } catch (err: any) {
      setState(prev => ({
        ...prev,
        isConnecting: false,
        error: err.message || "Failed to connect wallet",
      }));
    }
  }, []);

  const connectSolana = useCallback(async () => {
    if (!window.solana?.isPhantom) {
      setState(prev => ({ ...prev, error: "Phantom not installed. Please install Phantom to connect." }));
      window.open("https://phantom.app/", "_blank");
      return;
    }

    setState(prev => ({ ...prev, isConnecting: true, error: null }));

    try {
      const response = await window.solana.connect();
      const address = response.publicKey.toString();
      
      setState(prev => ({
        ...prev,
        solanaAddress: address,
        isConnected: true,
        isConnecting: false,
      }));
      localStorage.setItem("dw_solana_address", address);
    } catch (err: any) {
      setState(prev => ({
        ...prev,
        isConnecting: false,
        error: err.message || "Failed to connect wallet",
      }));
    }
  }, []);

  const disconnect = useCallback(() => {
    if (window.solana) {
      window.solana.disconnect().catch(() => {});
    }
    setState({
      evmAddress: null,
      solanaAddress: null,
      isConnecting: false,
      isConnected: false,
      chainId: null,
      error: null,
    });
    localStorage.removeItem("dw_evm_address");
    localStorage.removeItem("dw_solana_address");
  }, []);

  return (
    <WalletContext.Provider value={{ ...state, connectEVM, connectSolana, disconnect, hasMetaMask, hasPhantom }}>
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error("useWallet must be used within a WalletProvider");
  }
  return context;
}

export function shortenAddress(address: string, chars = 4): string {
  return `${address.slice(0, chars + 2)}...${address.slice(-chars)}`;
}
