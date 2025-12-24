export type AppDomain = "dwsc" | "games" | "studios";

export function getAppFromHost(): AppDomain {
  const host = window.location.hostname.toLowerCase();
  
  if (host.includes("darkwavegames") || host.includes("games.")) {
    return "games";
  }
  if (host.includes("darkwavestudios") || host.includes("studios.")) {
    return "studios";
  }
  return "dwsc";
}

export const APP_CONFIG: Record<AppDomain, {
  name: string;
  shortName: string;
  themeColor: string;
  description: string;
  logoText: string;
  primaryGradient: string;
}> = {
  dwsc: {
    name: "DarkWave Smart Chain",
    shortName: "DWSC",
    themeColor: "#8b5cf6",
    description: "The next-generation Layer 1 blockchain",
    logoText: "DarkWave",
    primaryGradient: "from-purple-500 to-pink-500",
  },
  games: {
    name: "DarkWave Games",
    shortName: "DW Games",
    themeColor: "#ec4899",
    description: "Provably fair blockchain games",
    logoText: "DarkWave Games",
    primaryGradient: "from-pink-500 to-rose-500",
  },
  studios: {
    name: "DarkWave Studios",
    shortName: "Studios",
    themeColor: "#06b6d4",
    description: "Building the future of blockchain",
    logoText: "DarkWave Studios",
    primaryGradient: "from-cyan-500 to-teal-500",
  },
};

export function getCurrentAppConfig() {
  return APP_CONFIG[getAppFromHost()];
}
