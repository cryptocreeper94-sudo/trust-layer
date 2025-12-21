import crypto from "crypto";

const DARKWAVE_RPC_URL = process.env.DARKWAVE_RPC_URL || "http://localhost:3000";
const DARKWAVE_API_KEY = process.env.DARKWAVE_API_KEY || "";
const DARKWAVE_CHAIN_ID = parseInt(process.env.DARKWAVE_CHAIN_ID || "8453");

export interface DarkWaveHashResult {
  success: boolean;
  txHash?: string;
  blockHeight?: number;
  timestamp?: string;
  error?: string;
}

export interface HashPayload {
  dataHash: string;
  appId: string;
  category?: string;
  metadata?: Record<string, any>;
}

export async function submitHashToDarkWave(payload: HashPayload): Promise<DarkWaveHashResult> {
  try {
    const txData = {
      type: "hash_submission",
      hash: payload.dataHash,
      appId: payload.appId,
      category: payload.category || "general",
      metadata: payload.metadata || {},
      timestamp: new Date().toISOString(),
      chainId: DARKWAVE_CHAIN_ID,
    };

    const response = await fetch(`${DARKWAVE_RPC_URL}/api/hash/submit`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-Key": DARKWAVE_API_KEY,
      },
      body: JSON.stringify({
        dataHash: payload.dataHash,
        metadata: {
          ...txData,
        },
        category: payload.category,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: "Unknown error" }));
      return {
        success: false,
        error: errorData.error || `HTTP ${response.status}: ${response.statusText}`,
      };
    }

    const result = await response.json();

    return {
      success: true,
      txHash: result.txHash,
      blockHeight: result.blockHeight,
      timestamp: result.timestamp,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to submit to DarkWave Chain",
    };
  }
}

export async function getTransactionStatus(txHash: string): Promise<{
  status: string;
  confirmations?: number;
  blockHeight?: number;
}> {
  try {
    const response = await fetch(`${DARKWAVE_RPC_URL}/api/hash/${txHash}`, {
      headers: {
        "X-API-Key": DARKWAVE_API_KEY,
      },
    });

    if (!response.ok) {
      return { status: "not_found" };
    }

    const data = await response.json();
    return {
      status: data.status || "confirmed",
      confirmations: data.confirmations,
      blockHeight: data.blockHeight,
    };
  } catch {
    return { status: "error" };
  }
}

export async function getChainInfo(): Promise<{
  chainId: number;
  chainName: string;
  blockHeight: number;
  symbol: string;
}> {
  try {
    const response = await fetch(`${DARKWAVE_RPC_URL}/chain`);
    if (!response.ok) {
      throw new Error("Failed to fetch chain info");
    }
    const data = await response.json();
    return {
      chainId: data.chain_id || DARKWAVE_CHAIN_ID,
      chainName: data.chain_name || "DarkWave Chain",
      blockHeight: data.block_height || 0,
      symbol: data.symbol || "DWT",
    };
  } catch {
    return {
      chainId: DARKWAVE_CHAIN_ID,
      chainName: "DarkWave Chain",
      blockHeight: 0,
      symbol: "DWT",
    };
  }
}

export function generateDataHash(data: string | object): string {
  const input = typeof data === "string" ? data : JSON.stringify(data);
  return "0x" + crypto.createHash("sha256").update(input).digest("hex");
}

export const darkwaveConfig = {
  rpcUrl: DARKWAVE_RPC_URL,
  chainId: DARKWAVE_CHAIN_ID,
  explorerUrl: process.env.DARKWAVE_EXPLORER_URL || "/explorer",
  symbol: "DWT",
  decimals: 18,
};
