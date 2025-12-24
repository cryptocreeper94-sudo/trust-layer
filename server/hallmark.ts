import crypto from "crypto";
import QRCode from "qrcode";
import { storage } from "./storage";
import { submitHashToDarkWave, generateDataHash } from "./darkwave";
import type { Hallmark } from "@shared/schema";

const BASE_URL = process.env.BASE_URL || "https://darkwave.chain";

export interface HallmarkRequest {
  appId: string;
  appName: string;
  productName?: string;
  version?: string;
  releaseType?: string;
  metadata?: Record<string, any>;
}

export interface HallmarkResult {
  success: boolean;
  hallmark?: {
    hallmarkId: string;
    masterSequence: string;
    subSequence: string;
    qrCodeSvg: string;
    verificationUrl: string;
    darkwave: {
      txHash?: string;
      blockHeight?: string;
      status: string;
    };
  };
  error?: string;
}

export async function generateHallmark(request: HallmarkRequest): Promise<HallmarkResult> {
  try {
    const masterSeq = await storage.getNextMasterSequence();
    const subSeq = "01";
    const hallmarkId = `${masterSeq}-${subSeq}`;

    const verificationToken = crypto.randomBytes(16).toString("hex");
    const verificationUrl = `${BASE_URL}/hallmark/${hallmarkId}`;

    const payload = {
      hallmarkId,
      appId: request.appId,
      appName: request.appName,
      productName: request.productName,
      version: request.version,
      releaseType: request.releaseType || "release",
      metadata: request.metadata || {},
      timestamp: new Date().toISOString(),
    };

    const dataHash = generateDataHash(payload);

    const qrData = JSON.stringify({
      id: hallmarkId,
      url: verificationUrl,
      hash: dataHash.slice(0, 16),
    });
    const qrCodeSvg = await QRCode.toString(qrData, { type: "svg", width: 256 });

    const hallmark = await storage.createHallmark({
      hallmarkId,
      masterSequence: masterSeq,
      subSequence: subSeq,
      appId: request.appId,
      appName: request.appName,
      productName: request.productName || null,
      version: request.version || null,
      releaseType: request.releaseType || "release",
      dataHash,
      metadata: JSON.stringify(request.metadata || {}),
      qrCodeSvg,
      verificationToken,
      status: "pending",
    });

    const dwResult = await submitHashToDarkWave({
      dataHash,
      appId: request.appId,
      category: "hallmark",
      metadata: payload,
    });

    if (dwResult.success && dwResult.txHash) {
      await storage.updateHallmark(hallmarkId, {
        darkwaveTxHash: dwResult.txHash,
        darkwaveBlockHeight: dwResult.blockHeight?.toString() || null,
        status: "confirmed",
      });
    }

    return {
      success: true,
      hallmark: {
        hallmarkId,
        masterSequence: masterSeq,
        subSequence: subSeq,
        qrCodeSvg,
        verificationUrl,
        darkwave: {
          txHash: dwResult.txHash,
          blockHeight: dwResult.blockHeight?.toString(),
          status: dwResult.success ? "confirmed" : "pending",
        },
      },
    };
  } catch (error) {
    console.error("Hallmark generation error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to generate hallmark",
    };
  }
}

export async function verifyHallmark(hallmarkId: string): Promise<{
  valid: boolean;
  hallmark?: Hallmark;
  onChain: boolean;
  message: string;
}> {
  const result = await storage.verifyHallmark(hallmarkId);

  if (!result.valid || !result.hallmark) {
    return {
      valid: false,
      onChain: false,
      message: "Hallmark not found or invalid",
    };
  }

  const onChain = !!result.hallmark.darkwaveTxHash;

  return {
    valid: true,
    hallmark: result.hallmark,
    onChain,
    message: onChain
      ? `Verified on DarkWave Smart Chain (Block ${result.hallmark.darkwaveBlockHeight})`
      : "Hallmark registered but not yet confirmed on chain",
  };
}

export async function getHallmarkQRCode(hallmarkId: string): Promise<string | null> {
  const hallmark = await storage.getHallmark(hallmarkId);
  return hallmark?.qrCodeSvg || null;
}
