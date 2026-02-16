import { submitHashToDarkWave, generateDataHash } from "./darkwave";

export interface TrustStampResult {
  success: boolean;
  txHash?: string;
  blockHeight?: number;
  dataHash: string;
  category: string;
  timestamp: string;
}

export async function trustStamp(
  category: string,
  data: Record<string, any>
): Promise<TrustStampResult> {
  const timestamp = new Date().toISOString();
  const payload = { ...data, category, stampedAt: timestamp };
  const dataHash = generateDataHash(payload);

  try {
    const result = await submitHashToDarkWave({
      dataHash,
      appId: "trust-layer-core",
      category,
      metadata: payload,
    });

    if (result.success) {
      console.log(`[TrustStamp] ${category} stamped: tx=${result.txHash}, block=${result.blockHeight}`);
    }

    return {
      success: result.success,
      txHash: result.txHash,
      blockHeight: result.blockHeight,
      dataHash,
      category,
      timestamp,
    };
  } catch (err) {
    console.error(`[TrustStamp] ${category} stamp failed:`, err);
    return { success: false, dataHash, category, timestamp };
  }
}
