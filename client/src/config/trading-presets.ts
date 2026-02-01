export interface TradingPreset {
  id: string;
  name: string;
  icon: string;
  tagline: string;
  description: string;
  color: string;
  colorRgb: string;
  tradeConfig: {
    buyAmountSol: number;
    stopLossPercent: number;
    takeProfitPercent: number;
  };
  safetyFilters: {
    minLiquidityUsd: number;
    maxBotPercent: number;
    minHolders: number;
    maxTop10HoldersPercent: number;
  };
}

export const TRADING_PRESETS: Record<string, TradingPreset> = {
  guardian: {
    id: 'guardian',
    name: 'Guardian',
    icon: '🛡️',
    tagline: 'Prefer a calmer pace?',
    description: 'Conservative approach with strict safety filters. Lower risk, steadier gains.',
    color: '#00D4FF',
    colorRgb: '0, 212, 255',
    tradeConfig: {
      buyAmountSol: 0.25,
      stopLossPercent: 12,
      takeProfitPercent: 22,
    },
    safetyFilters: {
      minLiquidityUsd: 20000,
      maxBotPercent: 50,
      minHolders: 100,
      maxTop10HoldersPercent: 60,
    },
  },
  pathfinder: {
    id: 'pathfinder',
    name: 'Pathfinder',
    icon: '⚖️',
    tagline: 'Balance risk & reward',
    description: 'Balanced strategy for consistent performance. Moderate risk with solid upside.',
    color: '#8B5CF6',
    colorRgb: '139, 92, 246',
    tradeConfig: {
      buyAmountSol: 0.5,
      stopLossPercent: 18,
      takeProfitPercent: 35,
    },
    safetyFilters: {
      minLiquidityUsd: 10000,
      maxBotPercent: 65,
      minHolders: 75,
      maxTop10HoldersPercent: 70,
    },
  },
  velocity: {
    id: 'velocity',
    name: 'Velocity',
    icon: '🚀',
    tagline: 'Chase the momentum',
    description: 'Aggressive approach for experienced traders. Higher risk, maximum upside.',
    color: '#39FF14',
    colorRgb: '57, 255, 20',
    tradeConfig: {
      buyAmountSol: 0.75,
      stopLossPercent: 25,
      takeProfitPercent: 55,
    },
    safetyFilters: {
      minLiquidityUsd: 5000,
      maxBotPercent: 80,
      minHolders: 50,
      maxTop10HoldersPercent: 80,
    },
  },
};

export const PRESET_ORDER = ['guardian', 'pathfinder', 'velocity'] as const;

export const getPresetById = (id: string): TradingPreset => 
  TRADING_PRESETS[id] || TRADING_PRESETS.pathfinder;
