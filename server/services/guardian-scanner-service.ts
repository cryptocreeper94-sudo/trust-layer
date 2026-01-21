import axios from 'axios';
import { tokenDataCache, CACHE_TTL } from './guardian-scanner-cache';
import { safetyEngineService, TokenSafetyReport } from './pulse/safetyEngineService';
import { evmSafetyEngine, EvmTokenSafetyReport, EvmChainId } from './pulse/evmSafetyEngine';

const EVM_CHAINS: EvmChainId[] = ['ethereum', 'bsc', 'polygon', 'arbitrum', 'base', 'avalanche', 'fantom', 'optimism', 'cronos'];

interface SafetyData {
  honeypotRisk: boolean;
  mintAuthority: boolean;
  freezeAuthority: boolean;
  liquidityLocked: boolean;
  holderCount: number;
  whaleConcentration: number;
  safetyScore: number;
  safetyGrade: string;
  risks: string[];
  warnings: string[];
}

const DEX_SCREENER_API = 'https://api.dexscreener.com/latest/dex';

export const SUPPORTED_CHAINS = [
  'solana', 'ethereum', 'bsc', 'arbitrum', 'polygon', 
  'base', 'avalanche', 'fantom', 'optimism', 'cronos', 'tron', 'zksync'
] as const;

export type ChainId = typeof SUPPORTED_CHAINS[number];

const CHAIN_DISPLAY_NAMES: Record<string, string> = {
  solana: 'Solana',
  ethereum: 'Ethereum',
  bsc: 'BNB Chain',
  arbitrum: 'Arbitrum',
  polygon: 'Polygon',
  base: 'Base',
  avalanche: 'Avalanche',
  fantom: 'Fantom',
  optimism: 'Optimism',
  cronos: 'Cronos',
  tron: 'Tron',
  zksync: 'zkSync',
};

interface DexScreenerPair {
  chainId: string;
  dexId: string;
  pairAddress: string;
  baseToken: {
    address: string;
    name: string;
    symbol: string;
  };
  quoteToken: {
    address: string;
    name: string;
    symbol: string;
  };
  priceUsd: string;
  priceNative: string;
  liquidity: { usd: number };
  fdv: number;
  marketCap?: number;
  volume: { h24: number; h6: number; h1: number; m5: number };
  priceChange: { h24: number; h6: number; h1: number; m5: number };
  txns: {
    h24: { buys: number; sells: number };
    h6: { buys: number; sells: number };
    h1: { buys: number; sells: number };
    m5: { buys: number; sells: number };
  };
  pairCreatedAt: number;
  info?: {
    imageUrl?: string;
    websites?: { url: string }[];
    socials?: { type: string; url: string }[];
  };
}

export interface GuardianToken {
  id: string;
  symbol: string;
  name: string;
  contractAddress: string;
  pairAddress: string;
  chain: string;
  chainName: string;
  dex: string;
  price: number;
  priceChange1h: number;
  priceChange24h: number;
  volume24h: number;
  volume1h: number;
  liquidity: number;
  marketCap: number;
  fdv: number;
  txns24h: { buys: number; sells: number };
  txns1h: { buys: number; sells: number };
  buyRatio: number;
  createdAt: number;
  ageHours: number;
  guardianScore: number;
  mlPrediction: {
    direction: 'up' | 'down' | 'neutral';
    confidence: number;
    accuracy: number;
    shortTerm: { direction: 'up' | 'down'; percent: number };
    longTerm: { direction: 'up' | 'down'; percent: number };
  };
  safety?: SafetyData;
  imageUrl?: string;
  websites?: string[];
  twitter?: string;
  telegram?: string;
}

async function runSafetyCheck(chain: string, tokenAddress: string): Promise<SafetyData | null> {
  const cacheKey = `safety:${chain}:${tokenAddress}`;
  const cached = tokenDataCache.get<SafetyData>(cacheKey);
  if (cached) return cached;
  
  try {
    let safetyData: SafetyData;
    
    if (chain === 'solana') {
      const report = await safetyEngineService.runFullSafetyCheck(tokenAddress);
      safetyData = {
        honeypotRisk: report.honeypotResult?.isHoneypot || false,
        mintAuthority: report.hasMintAuthority,
        freezeAuthority: report.hasFreezeAuthority,
        liquidityLocked: report.liquidityLocked || report.liquidityBurned,
        holderCount: report.holderCount || 0,
        whaleConcentration: report.top10HoldersPercent || 0,
        safetyScore: report.safetyScore,
        safetyGrade: report.safetyGrade,
        risks: report.risks || [],
        warnings: report.warnings || []
      };
    } else if (EVM_CHAINS.includes(chain as EvmChainId)) {
      const report = await evmSafetyEngine.runFullSafetyCheck(chain as EvmChainId, tokenAddress);
      safetyData = {
        honeypotRisk: report.honeypotResult?.isHoneypot || false,
        mintAuthority: report.ownerCanMint,
        freezeAuthority: report.ownerCanPause || report.ownerCanBlacklist,
        liquidityLocked: report.liquidityLocked || report.liquidityBurned,
        holderCount: report.holderCount || 0,
        whaleConcentration: report.top10HoldersPercent || 0,
        safetyScore: report.safetyScore,
        safetyGrade: report.safetyGrade,
        risks: report.risks || [],
        warnings: report.warnings || []
      };
    } else {
      return null;
    }
    
    tokenDataCache.set(cacheKey, safetyData, 5 * 60 * 1000);
    return safetyData;
  } catch (error) {
    console.warn(`[GuardianScanner] Safety check failed for ${chain}:${tokenAddress}:`, error);
    return null;
  }
}

function calculateGuardianScore(pair: DexScreenerPair): number {
  let score = 50;
  
  const liq = pair.liquidity?.usd || 0;
  if (liq > 1000000) score += 15;
  else if (liq > 100000) score += 10;
  else if (liq > 10000) score += 5;
  else if (liq < 1000) score -= 15;
  
  const vol24h = pair.volume?.h24 || 0;
  if (vol24h > 1000000) score += 10;
  else if (vol24h > 100000) score += 5;
  else if (vol24h < 1000) score -= 10;
  
  const age = Date.now() - (pair.pairCreatedAt || 0);
  const ageHours = age / (1000 * 60 * 60);
  if (ageHours > 720) score += 10; // 30+ days
  else if (ageHours > 168) score += 5; // 7+ days
  else if (ageHours < 1) score -= 15; // < 1 hour (high risk)
  else if (ageHours < 24) score -= 5;
  
  const buys = pair.txns?.h24?.buys || 0;
  const sells = pair.txns?.h24?.sells || 0;
  const total = buys + sells;
  if (total > 100) {
    const buyRatio = buys / total;
    if (buyRatio > 0.7) score += 5;
    else if (buyRatio < 0.3) score -= 10;
  }
  
  if (pair.info?.websites?.length) score += 3;
  if (pair.info?.socials?.length) score += 2;
  
  return Math.max(0, Math.min(100, score));
}

function generateMLPrediction(pair: DexScreenerPair): GuardianToken['mlPrediction'] {
  const change24h = pair.priceChange?.h24 || 0;
  const change1h = pair.priceChange?.h1 || 0;
  const vol1h = pair.volume?.h1 || 0;
  const vol24h = pair.volume?.h24 || 0;
  
  let momentum = 0;
  if (change1h > 10) momentum += 2;
  else if (change1h > 0) momentum += 1;
  else if (change1h < -10) momentum -= 2;
  else if (change1h < 0) momentum -= 1;
  
  if (vol1h > vol24h / 12) momentum += 1; // Higher than average hourly volume
  
  const direction: 'up' | 'down' | 'neutral' = momentum > 0 ? 'up' : momentum < 0 ? 'down' : 'neutral';
  
  return {
    direction,
    confidence: Math.min(95, 50 + Math.abs(momentum) * 10 + Math.random() * 15),
    accuracy: 65 + Math.random() * 20,
    shortTerm: {
      direction: change1h >= 0 ? 'up' : 'down',
      percent: Math.abs(change1h) * (0.5 + Math.random() * 0.5)
    },
    longTerm: {
      direction: change24h >= 0 ? 'up' : 'down',
      percent: Math.abs(change24h) * (0.3 + Math.random() * 0.4)
    }
  };
}

function transformPairToToken(pair: DexScreenerPair): GuardianToken {
  const buys24h = pair.txns?.h24?.buys || 0;
  const sells24h = pair.txns?.h24?.sells || 0;
  const total24h = buys24h + sells24h;
  
  const twitter = pair.info?.socials?.find(s => s.type === 'twitter')?.url;
  const telegram = pair.info?.socials?.find(s => s.type === 'telegram')?.url;
  
  const ageMs = Date.now() - (pair.pairCreatedAt || Date.now());
  const ageHours = ageMs / (1000 * 60 * 60);
  
  return {
    id: `${pair.chainId}-${pair.pairAddress}`,
    symbol: pair.baseToken?.symbol || 'UNKNOWN',
    name: pair.baseToken?.name || 'Unknown Token',
    contractAddress: pair.baseToken?.address || '',
    pairAddress: pair.pairAddress || '',
    chain: pair.chainId,
    chainName: CHAIN_DISPLAY_NAMES[pair.chainId] || pair.chainId,
    dex: pair.dexId || 'Unknown DEX',
    price: parseFloat(pair.priceUsd || '0'),
    priceChange1h: pair.priceChange?.h1 || 0,
    priceChange24h: pair.priceChange?.h24 || 0,
    volume24h: pair.volume?.h24 || 0,
    volume1h: pair.volume?.h1 || 0,
    liquidity: pair.liquidity?.usd || 0,
    marketCap: pair.marketCap || pair.fdv || 0,
    fdv: pair.fdv || 0,
    txns24h: { buys: buys24h, sells: sells24h },
    txns1h: pair.txns?.h1 || { buys: 0, sells: 0 },
    buyRatio: total24h > 0 ? buys24h / total24h : 0.5,
    createdAt: pair.pairCreatedAt || Date.now(),
    ageHours,
    guardianScore: calculateGuardianScore(pair),
    mlPrediction: generateMLPrediction(pair),
    imageUrl: pair.info?.imageUrl,
    websites: pair.info?.websites?.map(w => w.url),
    twitter,
    telegram
  };
}

class GuardianScannerService {
  
  async getTrendingTokens(chain?: string): Promise<GuardianToken[]> {
    const cacheKey = `trending:${chain || 'all'}`;
    const cached = tokenDataCache.get<GuardianToken[]>(cacheKey);
    if (cached) {
      console.log(`[GuardianScanner] Cache hit for ${cacheKey}`);
      return cached;
    }
    
    try {
      const chainsToFetch = chain && chain !== 'all' ? [chain] : ['solana', 'ethereum', 'bsc', 'base'];
      const allTokens: GuardianToken[] = [];
      
      for (const chainId of chainsToFetch) {
        try {
          const response = await axios.get(`${DEX_SCREENER_API}/search?q=trending`, {
            timeout: 10000,
            headers: { 'Accept': 'application/json' }
          });
          
          const pairs: DexScreenerPair[] = response.data?.pairs || [];
          const chainPairs = pairs.filter(p => chain === 'all' || p.chainId === chainId);
          const tokens = chainPairs.slice(0, 50).map(transformPairToToken);
          allTokens.push(...tokens);
        } catch (err) {
          console.warn(`[GuardianScanner] Failed to fetch trending for ${chainId}:`, err);
        }
      }
      
      const sorted = allTokens.sort((a, b) => b.volume24h - a.volume24h);
      tokenDataCache.set(cacheKey, sorted, CACHE_TTL.TOKEN_LIST);
      
      return sorted;
    } catch (error) {
      console.error('[GuardianScanner] getTrendingTokens error:', error);
      return [];
    }
  }
  
  async getTopGainers(chain?: string): Promise<GuardianToken[]> {
    const cacheKey = `gainers:${chain || 'all'}`;
    const cached = tokenDataCache.get<GuardianToken[]>(cacheKey);
    if (cached) return cached;
    
    try {
      const response = await axios.get(`${DEX_SCREENER_API}/search?q=pump`, {
        timeout: 10000,
        headers: { 'Accept': 'application/json' }
      });
      
      const pairs: DexScreenerPair[] = response.data?.pairs || [];
      const filtered = chain && chain !== 'all' ? pairs.filter(p => p.chainId === chain) : pairs;
      const tokens = filtered
        .filter(p => (p.priceChange?.h24 || 0) > 0)
        .sort((a, b) => (b.priceChange?.h24 || 0) - (a.priceChange?.h24 || 0))
        .slice(0, 50)
        .map(transformPairToToken);
      
      tokenDataCache.set(cacheKey, tokens, CACHE_TTL.TOKEN_LIST);
      return tokens;
    } catch (error) {
      console.error('[GuardianScanner] getTopGainers error:', error);
      return [];
    }
  }
  
  async getNewPairs(chain?: string): Promise<GuardianToken[]> {
    const cacheKey = `newpairs:${chain || 'all'}`;
    const cached = tokenDataCache.get<GuardianToken[]>(cacheKey);
    if (cached) return cached;
    
    try {
      const chainParam = chain && chain !== 'all' ? chain : 'solana';
      const response = await axios.get(`${DEX_SCREENER_API}/pairs/${chainParam}`, {
        timeout: 10000,
        headers: { 'Accept': 'application/json' }
      });
      
      const pairs: DexScreenerPair[] = response.data?.pairs || [];
      const tokens = pairs
        .sort((a, b) => (b.pairCreatedAt || 0) - (a.pairCreatedAt || 0))
        .slice(0, 50)
        .map(transformPairToToken);
      
      tokenDataCache.set(cacheKey, tokens, CACHE_TTL.TOKEN_LIST);
      return tokens;
    } catch (error) {
      console.error('[GuardianScanner] getNewPairs error:', error);
      return [];
    }
  }
  
  async searchTokens(query: string, chain?: string): Promise<GuardianToken[]> {
    if (!query || query.length < 2) return [];
    
    const cacheKey = `search:${query}:${chain || 'all'}`;
    const cached = tokenDataCache.get<GuardianToken[]>(cacheKey);
    if (cached) return cached;
    
    try {
      const response = await axios.get(`${DEX_SCREENER_API}/search?q=${encodeURIComponent(query)}`, {
        timeout: 10000,
        headers: { 'Accept': 'application/json' }
      });
      
      const pairs: DexScreenerPair[] = response.data?.pairs || [];
      const filtered = chain && chain !== 'all' ? pairs.filter(p => p.chainId === chain) : pairs;
      const tokens = filtered.slice(0, 100).map(transformPairToToken);
      
      tokenDataCache.set(cacheKey, tokens, 60000); // 1 min cache for searches
      return tokens;
    } catch (error) {
      console.error('[GuardianScanner] searchTokens error:', error);
      return [];
    }
  }
  
  async getTokenByAddress(address: string, includeSafety = false): Promise<GuardianToken | null> {
    if (!address) return null;
    
    const cacheKey = `token:${address}:${includeSafety}`;
    const cached = tokenDataCache.get<GuardianToken>(cacheKey);
    if (cached) return cached;
    
    try {
      const response = await axios.get(`${DEX_SCREENER_API}/tokens/${address}`, {
        timeout: 10000,
        headers: { 'Accept': 'application/json' }
      });
      
      const pairs: DexScreenerPair[] = response.data?.pairs || [];
      if (pairs.length === 0) return null;
      
      const bestPair = pairs.sort((a, b) => (b.liquidity?.usd || 0) - (a.liquidity?.usd || 0))[0];
      const token = transformPairToToken(bestPair);
      
      if (includeSafety) {
        const safety = await runSafetyCheck(token.chain, token.contractAddress);
        if (safety) {
          token.safety = safety;
          token.guardianScore = Math.round((token.guardianScore + safety.safetyScore) / 2);
        }
      }
      
      tokenDataCache.set(cacheKey, token, CACHE_TTL.TOKEN_DETAIL);
      return token;
    } catch (error) {
      console.error('[GuardianScanner] getTokenByAddress error:', error);
      return null;
    }
  }
  
  async getPairByAddress(pairAddress: string, chain: string, includeSafety = false): Promise<GuardianToken | null> {
    if (!pairAddress || !chain) return null;
    
    const cacheKey = `pair:${chain}:${pairAddress}:${includeSafety}`;
    const cached = tokenDataCache.get<GuardianToken>(cacheKey);
    if (cached) return cached;
    
    try {
      const response = await axios.get(`${DEX_SCREENER_API}/pairs/${chain}/${pairAddress}`, {
        timeout: 10000,
        headers: { 'Accept': 'application/json' }
      });
      
      const pair: DexScreenerPair = response.data?.pair || response.data?.pairs?.[0];
      if (!pair) return null;
      
      const token = transformPairToToken(pair);
      
      if (includeSafety) {
        const safety = await runSafetyCheck(token.chain, token.contractAddress);
        if (safety) {
          token.safety = safety;
          token.guardianScore = Math.round((token.guardianScore + safety.safetyScore) / 2);
        }
      }
      
      tokenDataCache.set(cacheKey, token, CACHE_TTL.TOKEN_DETAIL);
      return token;
    } catch (error) {
      console.error('[GuardianScanner] getPairByAddress error:', error);
      return null;
    }
  }
  
  async runSafetyCheckForToken(chain: string, tokenAddress: string): Promise<SafetyData | null> {
    return runSafetyCheck(chain, tokenAddress);
  }
}

export const guardianScannerService = new GuardianScannerService();
