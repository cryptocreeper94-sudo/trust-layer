import { useCallback, useEffect, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import type { SolanaWallet, TokenBalance, SolanaTransaction } from '@shared/wallet-types';

export function useSolanaWallet() {
  const [wallet, setWallet] = useState<SolanaWallet | null>(null);
  const queryClient = useQueryClient();

  const connectPhantom = useCallback(async () => {
    const provider = (window as any).solana;
    if (provider && provider.isPhantom) {
      try {
        const resp = await provider.connect();
        const w: SolanaWallet = { 
          publicKey: resp.publicKey.toString(), 
          cluster: 'devnet', 
          providerName: 'Phantom', 
          connectedAt: new Date().toISOString() 
        };
        setWallet(w);
        queryClient.invalidateQueries({ queryKey: ['sol-balances', w.publicKey] });
      } catch (err) {
        console.error('Phantom connect error', err);
        throw err;
      }
    } else {
      throw new Error('Phantom not available');
    }
  }, [queryClient]);

  const disconnect = useCallback(async () => {
    setWallet(null);
  }, []);

  const switchCluster = useCallback(async (cluster: 'mainnet-beta' | 'devnet') => {
    setWallet((prev) => prev ? { ...prev, cluster } : prev);
    if (wallet?.publicKey) {
      queryClient.invalidateQueries({ queryKey: ['sol-balances', wallet.publicKey] });
    }
  }, [queryClient, wallet?.publicKey]);

  const fetchSolBalances = useCallback(async (publicKey: string): Promise<TokenBalance[]> => {
    return [
      { tokenAddress: null, symbol: 'SOL', decimals: 9, amountRaw: '0', amount: '0' }
    ];
  }, []);

  const { data: balances, isLoading: balancesLoading } = useQuery({
    queryKey: wallet ? ['sol-balances', wallet.publicKey] : ['sol-balances', 'none'],
    queryFn: () => fetchSolBalances(wallet!.publicKey),
    enabled: !!wallet?.publicKey,
    staleTime: 30_000
  });

  const signTransaction = useCallback(async (tx: Partial<SolanaTransaction>) => {
    if (!wallet) throw new Error('not connected');
    return { ...tx, signature: 'TODO_SIGNATURE' } as SolanaTransaction;
  }, [wallet]);

  useEffect(() => {
  }, []);

  return {
    wallet,
    connectPhantom,
    disconnect,
    switchCluster,
    balances,
    balancesLoading,
    signTransaction,
    queryClient
  };
}
