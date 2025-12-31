import { useCallback, useEffect, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import type { EthereumWallet, TokenBalance, EthTransaction } from '@shared/wallet-types';

type ProviderName = 'MetaMask' | 'WalletConnect' | 'Unknown';

export function useEthereumWallet() {
  const [wallet, setWallet] = useState<EthereumWallet | null>(null);
  const [providerName, setProviderName] = useState<ProviderName>('Unknown');
  const queryClient = useQueryClient();

  const connectMetaMask = useCallback(async () => {
    if ((window as any).ethereum) {
      try {
        const accounts = await (window as any).ethereum.request({ method: 'eth_requestAccounts' });
        const chainId = await (window as any).ethereum.request({ method: 'eth_chainId' });
        const address = accounts[0];
        const pw: EthereumWallet = {
          address,
          chainId: parseInt(chainId, 16),
          providerName: 'MetaMask',
          connectedAt: new Date().toISOString()
        };
        setProviderName('MetaMask');
        setWallet(pw);
        queryClient.invalidateQueries({ queryKey: ['eth-balances', address] });
      } catch (err) {
        console.error('MetaMask connect error', err);
        throw err;
      }
    } else {
      throw new Error('MetaMask not found');
    }
  }, [queryClient]);

  const disconnect = useCallback(() => {
    setWallet(null);
    setProviderName('Unknown');
  }, []);

  const switchNetwork = useCallback(async (chainId: number) => {
    if ((window as any).ethereum) {
      try {
        await (window as any).ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: '0x' + chainId.toString(16) }]
        });
      } catch (err) {
        console.warn('Network switch request failed', err);
        throw err;
      }
    } else {
      throw new Error('No ethereum provider');
    }
  }, []);

  const fetchEthBalances = useCallback(async (address: string): Promise<TokenBalance[]> => {
    return [
      {
        tokenAddress: null,
        symbol: 'ETH',
        decimals: 18,
        amountRaw: '0',
        amount: '0'
      }
    ];
  }, []);

  const { data: balances, isLoading: balancesLoading } = useQuery({
    queryKey: wallet ? ['eth-balances', wallet.address] : ['eth-balances', 'none'],
    queryFn: () => fetchEthBalances(wallet!.address),
    enabled: !!wallet?.address,
    staleTime: 30_000
  });

  const signTransaction = useCallback(async (tx: Omit<EthTransaction, 'signedRaw'>) => {
    if (!wallet) throw new Error('not connected');
    return { ...tx, signedRaw: 'TODO_SIGNED_RAW' } as EthTransaction;
  }, [wallet]);

  useEffect(() => {
  }, []);

  return {
    wallet,
    providerName,
    connectMetaMask,
    disconnect,
    switchNetwork,
    balances,
    balancesLoading,
    signTransaction,
    queryClient
  };
}
