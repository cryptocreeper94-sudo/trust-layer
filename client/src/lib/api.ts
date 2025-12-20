import type { EcosystemApp, BlockchainStats } from "@shared/schema";

export async function fetchEcosystemApps(): Promise<EcosystemApp[]> {
  const response = await fetch("/api/ecosystem/apps");
  if (!response.ok) {
    throw new Error("Failed to fetch ecosystem apps");
  }
  return response.json();
}

export async function fetchBlockchainStats(): Promise<BlockchainStats> {
  const response = await fetch("/api/blockchain/stats");
  if (!response.ok) {
    throw new Error("Failed to fetch blockchain stats");
  }
  return response.json();
}
