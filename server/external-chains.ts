import { Connection, PublicKey } from "@solana/web3.js";

const ETHEREUM_SEPOLIA_RPC = "https://ethereum-sepolia-rpc.publicnode.com";
const SOLANA_DEVNET_RPC = process.env.HELIUS_API_KEY 
  ? `https://devnet.helius-rpc.com/?api-key=${process.env.HELIUS_API_KEY}`
  : "https://api.devnet.solana.com";

const WDWT_ETHEREUM_CONTRACT = "0x0000000000000000000000000000000000000000";
const WDWT_SOLANA_MINT = "11111111111111111111111111111111";

export interface ExternalTxVerification {
  verified: boolean;
  chain: "ethereum" | "solana";
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

  async verifyBurn(chain: "ethereum" | "solana", txHash: string, expectedAmount: string): Promise<ExternalTxVerification> {
    if (chain === "ethereum") {
      return this.verifyEthereumBurn(txHash, expectedAmount);
    } else if (chain === "solana") {
      return this.verifySolanaBurn(txHash, expectedAmount);
    } else {
      return {
        verified: false,
        chain,
        txHash,
        error: `Unsupported chain: ${chain}`,
      };
    }
  }

  async getAllChainStatuses(): Promise<ChainStatus[]> {
    const [ethStatus, solStatus] = await Promise.all([
      this.getEthereumStatus(),
      this.getSolanaStatus(),
    ]);
    return [ethStatus, solStatus];
  }
}

export const externalChains = new ExternalChainsService();
