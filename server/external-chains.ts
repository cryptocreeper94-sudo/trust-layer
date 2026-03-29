import { Connection, PublicKey, Keypair, Transaction, SystemProgram, sendAndConfirmTransaction } from "@solana/web3.js";

const ETHEREUM_SEPOLIA_RPC = "https://ethereum-sepolia-rpc.publicnode.com";
const SOLANA_DEVNET_RPC = process.env.HELIUS_API_KEY 
  ? `https://devnet.helius-rpc.com/?api-key=${process.env.HELIUS_API_KEY}`
  : "https://api.devnet.solana.com";
const POLYGON_AMOY_RPC = "https://rpc-amoy.polygon.technology";
const ARBITRUM_SEPOLIA_RPC = "https://sepolia-rollup.arbitrum.io/rpc";
const BASE_SEPOLIA_RPC = "https://sepolia.base.org";

const WSIG_ETHEREUM_CONTRACT = process.env.WSIG_ETHEREUM_ADDRESS || "0x0000000000000000000000000000000000000000";
const WSIG_SOLANA_MINT = process.env.WSIG_SOLANA_ADDRESS || "11111111111111111111111111111111";
const WSIG_POLYGON_CONTRACT = process.env.WSIG_POLYGON_ADDRESS || "0x0000000000000000000000000000000000000000";
const WSIG_ARBITRUM_CONTRACT = process.env.WSIG_ARBITRUM_ADDRESS || "0x0000000000000000000000000000000000000000";
const WSIG_BASE_CONTRACT = process.env.WSIG_BASE_ADDRESS || "0x0000000000000000000000000000000000000000";

export type SupportedExternalChain = "ethereum" | "solana" | "polygon" | "arbitrum" | "base";

export interface ExternalTxVerification {
  verified: boolean;
  chain: SupportedExternalChain;
  txHash: string;
  amount?: string;
  from?: string;
  to?: string;
  blockNumber?: number;
  error?: string;
}

export interface ChainStatus {
  chain: string;
  connected: boolean;
  blockHeight?: number;
  latency?: number;
  error?: string;
}

class ExternalChainsService {
  private solanaConnection: Connection | null = null;

  constructor() {
    this.initConnections();
  }

  private initConnections() {
    try {
      this.solanaConnection = new Connection(SOLANA_DEVNET_RPC, "confirmed");
      console.log("[External Chains] Solana Devnet connection initialized");
    } catch (error) {
      console.error("[External Chains] Failed to initialize Solana connection:", error);
    }
  }

  async getEthereumStatus(): Promise<ChainStatus> {
    const startTime = Date.now();
    try {
      const response = await fetch(ETHEREUM_SEPOLIA_RPC, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jsonrpc: "2.0",
          id: 1,
          method: "eth_blockNumber",
          params: [],
        }),
      });

      const data = await response.json();
      const latency = Date.now() - startTime;

      if (data.result) {
        return {
          chain: "ethereum",
          connected: true,
          blockHeight: parseInt(data.result, 16),
          latency,
        };
      }
      return { chain: "ethereum", connected: false, error: "Invalid response" };
    } catch (error: any) {
      return { chain: "ethereum", connected: false, error: error.message };
    }
  }

  async getSolanaStatus(): Promise<ChainStatus> {
    const startTime = Date.now();
    try {
      if (!this.solanaConnection) {
        return { chain: "solana", connected: false, error: "Connection not initialized" };
      }

      const slot = await this.solanaConnection.getSlot();
      const latency = Date.now() - startTime;

      return {
        chain: "solana",
        connected: true,
        blockHeight: slot,
        latency,
      };
    } catch (error: any) {
      return { chain: "solana", connected: false, error: error.message };
    }
  }

  async verifyEthereumBurn(txHash: string, expectedAmount: string): Promise<ExternalTxVerification> {
    try {
      const response = await fetch(ETHEREUM_SEPOLIA_RPC, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jsonrpc: "2.0",
          id: 1,
          method: "eth_getTransactionReceipt",
          params: [txHash],
        }),
      });

      const data = await response.json();

      if (!data.result) {
        return {
          verified: false,
          chain: "ethereum",
          txHash,
          error: "Transaction not found or not yet confirmed",
        };
      }

      const receipt = data.result;

      if (receipt.status !== "0x1") {
        return {
          verified: false,
          chain: "ethereum",
          txHash,
          error: "Transaction failed on-chain",
        };
      }

      const txResponse = await fetch(ETHEREUM_SEPOLIA_RPC, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jsonrpc: "2.0",
          id: 1,
          method: "eth_getTransactionByHash",
          params: [txHash],
        }),
      });

      const txData = await txResponse.json();
      const tx = txData.result;

      if (!tx) {
        return {
          verified: false,
          chain: "ethereum",
          txHash,
          error: "Transaction details not found",
        };
      }

      console.log(`[External Chains] Ethereum tx verified: ${txHash}`);
      console.log(`[External Chains] From: ${tx.from}, To: ${tx.to}, Value: ${tx.value}`);

      return {
        verified: true,
        chain: "ethereum",
        txHash,
        amount: BigInt(tx.value || "0").toString(),
        from: tx.from,
        to: tx.to,
        blockNumber: parseInt(receipt.blockNumber, 16),
      };
    } catch (error: any) {
      return {
        verified: false,
        chain: "ethereum",
        txHash,
        error: error.message,
      };
    }
  }

  async verifySolanaBurn(txHash: string, expectedAmount: string): Promise<ExternalTxVerification> {
    try {
      if (!this.solanaConnection) {
        return {
          verified: false,
          chain: "solana",
          txHash,
          error: "Solana connection not initialized",
        };
      }

      const tx = await this.solanaConnection.getTransaction(txHash, {
        maxSupportedTransactionVersion: 0,
      });

      if (!tx) {
        return {
          verified: false,
          chain: "solana",
          txHash,
          error: "Transaction not found or not yet confirmed",
        };
      }

      if (tx.meta?.err) {
        return {
          verified: false,
          chain: "solana",
          txHash,
          error: "Transaction failed on-chain",
        };
      }

      const preBalances = tx.meta?.preBalances || [];
      const postBalances = tx.meta?.postBalances || [];
      const transferAmount = preBalances.length > 0 && postBalances.length > 0
        ? Math.abs(preBalances[0] - postBalances[0])
        : 0;

      console.log(`[External Chains] Solana tx verified: ${txHash}`);
      console.log(`[External Chains] Slot: ${tx.slot}, Transfer: ${transferAmount} lamports`);

      return {
        verified: true,
        chain: "solana",
        txHash,
        amount: transferAmount.toString(),
        blockNumber: tx.slot,
      };
    } catch (error: any) {
      return {
        verified: false,
        chain: "solana",
        txHash,
        error: error.message,
      };
    }
  }

  async verifyBurn(chain: SupportedExternalChain, txHash: string, expectedAmount: string): Promise<ExternalTxVerification> {
    switch (chain) {
      case "ethereum":
        return this.verifyEthereumBurn(txHash, expectedAmount);
      case "solana":
        return this.verifySolanaBurn(txHash, expectedAmount);
      case "polygon":
      case "arbitrum":
      case "base":
        return this.verifyEVMBurn(chain, txHash, expectedAmount);
      default:
        return {
          verified: false,
          chain,
          txHash,
          error: `Unsupported chain: ${chain}`,
        };
    }
  }

  private async verifyEVMBurn(chain: "polygon" | "arbitrum" | "base", txHash: string, expectedAmount: string): Promise<ExternalTxVerification> {
    const rpcMap: Record<string, string> = {
      polygon: POLYGON_AMOY_RPC,
      arbitrum: ARBITRUM_SEPOLIA_RPC,
      base: BASE_SEPOLIA_RPC,
    };
    const rpcUrl = rpcMap[chain];
    
    try {
      const response = await fetch(rpcUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jsonrpc: "2.0",
          id: 1,
          method: "eth_getTransactionReceipt",
          params: [txHash],
        }),
      });

      const data = await response.json();

      if (!data.result) {
        return { verified: false, chain, txHash, error: "Transaction not found or not yet confirmed" };
      }

      const receipt = data.result;
      if (receipt.status !== "0x1") {
        return { verified: false, chain, txHash, error: "Transaction failed on-chain" };
      }

      const txResponse = await fetch(rpcUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jsonrpc: "2.0", id: 1, method: "eth_getTransactionByHash", params: [txHash] }),
      });

      const txData = await txResponse.json();
      const tx = txData.result;

      if (!tx) {
        return { verified: false, chain, txHash, error: "Transaction details not found" };
      }

      console.log(`[External Chains] ${chain} tx verified: ${txHash}`);
      return {
        verified: true,
        chain,
        txHash,
        amount: BigInt(tx.value || "0").toString(),
        from: tx.from,
        to: tx.to,
        blockNumber: parseInt(receipt.blockNumber, 16),
      };
    } catch (error: any) {
      return { verified: false, chain, txHash, error: error.message };
    }
  }

  async getPolygonStatus(): Promise<ChainStatus> {
    const startTime = Date.now();
    try {
      const response = await fetch(POLYGON_AMOY_RPC, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jsonrpc: "2.0", id: 1, method: "eth_blockNumber", params: [] }),
      });
      const data = await response.json();
      const latency = Date.now() - startTime;
      if (data.result) {
        return { chain: "polygon", connected: true, blockHeight: parseInt(data.result, 16), latency };
      }
      return { chain: "polygon", connected: false, error: "Invalid response" };
    } catch (error: any) {
      return { chain: "polygon", connected: false, error: error.message };
    }
  }

  async getArbitrumStatus(): Promise<ChainStatus> {
    const startTime = Date.now();
    try {
      const response = await fetch(ARBITRUM_SEPOLIA_RPC, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jsonrpc: "2.0", id: 1, method: "eth_blockNumber", params: [] }),
      });
      const data = await response.json();
      const latency = Date.now() - startTime;
      if (data.result) {
        return { chain: "arbitrum", connected: true, blockHeight: parseInt(data.result, 16), latency };
      }
      return { chain: "arbitrum", connected: false, error: "Invalid response" };
    } catch (error: any) {
      return { chain: "arbitrum", connected: false, error: error.message };
    }
  }

  async getBaseStatus(): Promise<ChainStatus> {
    const startTime = Date.now();
    try {
      const response = await fetch(BASE_SEPOLIA_RPC, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jsonrpc: "2.0", id: 1, method: "eth_blockNumber", params: [] }),
      });
      const data = await response.json();
      const latency = Date.now() - startTime;
      if (data.result) {
        return { chain: "base", connected: true, blockHeight: parseInt(data.result, 16), latency };
      }
      return { chain: "base", connected: false, error: "Invalid response" };
    } catch (error: any) {
      return { chain: "base", connected: false, error: error.message };
    }
  }

  async getAllChainStatuses(): Promise<ChainStatus[]> {
    const [ethStatus, solStatus, polygonStatus, arbitrumStatus, baseStatus] = await Promise.all([
      this.getEthereumStatus(),
      this.getSolanaStatus(),
      this.getPolygonStatus(),
      this.getArbitrumStatus(),
      this.getBaseStatus(),
    ]);
    return [ethStatus, solStatus, polygonStatus, arbitrumStatus, baseStatus];
  }

  getWSIGContractAddress(chain: SupportedExternalChain): string {
    switch (chain) {
      case "ethereum": return WSIG_ETHEREUM_CONTRACT;
      case "solana": return WSIG_SOLANA_MINT;
      case "polygon": return WSIG_POLYGON_CONTRACT;
      case "arbitrum": return WSIG_ARBITRUM_CONTRACT;
      case "base": return WSIG_BASE_CONTRACT;
    }
  }

  isContractDeployed(chain: SupportedExternalChain): boolean {
    const addr = this.getWSIGContractAddress(chain);
    if (chain === "solana") {
      return addr !== "11111111111111111111111111111111";
    }
    return addr !== "0x0000000000000000000000000000000000000000";
  }

  async mintWrappedToken(chain: SupportedExternalChain, to: string, amount: string, lockId: string): Promise<{
    success: boolean;
    txHash?: string;
    error?: string;
    isMock?: boolean;
  }> {
    const bridgeUrl = process.env.TRUST_LAYER_BRIDGE_URL;
    const bridgeApiKey = process.env.BRIDGE_API_KEY;

    if (!bridgeUrl || !bridgeApiKey) {
      console.warn("[External Chains] ⚠️ TRUST_LAYER_BRIDGE_URL or BRIDGE_API_KEY missing - using MOCK fallback");
      return {
        success: true,
        txHash: `0xMOCK_BRIDGE_MISSING_${lockId.substring(0, 8)}_${Date.now().toString(16)}`,
        isMock: true,
      };
    }

    try {
      console.log(`[External Chains] 🚀 Calling Secure Bridge Service for ${amount} wSIG to ${to} on ${chain}`);
      console.log(`[External Chains] Lock ID: ${lockId}`);

      const endpoint = chain === "solana" ? "/mint/sol" : "/mint/evm";

      const response = await fetch(`${bridgeUrl}${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-bridge-auth": bridgeApiKey
        },
        body: JSON.stringify({
          targetChain: chain,
          toAddress: to,
          amount: amount,
          lockId: lockId
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Bridge microservice rejected request");
      }

      console.log(`[External Chains] ✅ Bridge Executed Successfully. Hash: ${data.txHash}`);

      return {
        success: true,
        txHash: data.txHash,
        isMock: false,
      };
    } catch (error: any) {
      console.error(`[External Chains] Bridge Integration Failed:`, error);
      return { success: false, error: error.message };
    }
  }
}

export const externalChains = new ExternalChainsService();
