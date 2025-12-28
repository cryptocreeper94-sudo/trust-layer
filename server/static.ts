import express, { type Express, Request, Response, NextFunction } from "express";
import fs from "fs";
import path from "path";

type AppDomain = "dwsc" | "games" | "studios" | "chronicles" | "chronochat";

function getAppFromHost(hostname: string): AppDomain {
  const host = hostname.toLowerCase();
  
  if (host.includes("darkwavegames") || host.includes("games.")) {
    return "games";
  }
  if (host.includes("darkwavestudios") || host.includes("studios.")) {
    return "studios";
  }
  if (host.includes("yourlegacy") || host === "yourlegacy.io" || host === "www.yourlegacy.io") {
    return "chronicles";
  }
  if (host.includes("chronochat") || host === "chronochat.io" || host === "www.chronochat.io") {
    return "chronochat";
  }
  return "dwsc";
}

const APP_CONFIG: Record<AppDomain, {
  manifest: string;
  themeColor: string;
  title: string;
  description: string;
  icon: string;
}> = {
  dwsc: {
    manifest: "/manifest-dwsc.webmanifest",
    themeColor: "#00ffff",
    title: "DarkWave Smart Chain",
    description: "The next-generation Layer 1 blockchain. DeFi, staking, NFTs, and developer tools.",
    icon: "/icons/dwsc-512x512.png",
  },
  games: {
    manifest: "/manifest-games.webmanifest",
    themeColor: "#ec4899",
    title: "DarkWave Games",
    description: "Provably fair blockchain games. Win real DWC with instant payouts.",
    icon: "/icons/games-512x512.png",
  },
  studios: {
    manifest: "/manifest-studios.webmanifest",
    themeColor: "#06b6d4",
    title: "DarkWave Studios",
    description: "Building the future of blockchain technology. DarkWave Studios, LLC.",
    icon: "/icons/studios-512x512.png",
  },
  chronicles: {
    manifest: "/manifest-chrono.webmanifest",
    themeColor: "#a855f7",
    title: "DarkWave Chronicles",
    description: "Not a game. A life. Live your legacy across 70+ historical eras in the ChronoVerse.",
    icon: "/marketing/darkwave_games_app_icon.png",
  },
  chronochat: {
    manifest: "/manifest-chronochat.webmanifest",
    themeColor: "#06b6d4",
    title: "ChronoChat",
    description: "Connect across timelines. Chat beyond eras. The community hub for DarkWave ecosystem.",
    icon: "/icons/icon-512x512.png",
  },
};

export function serveStatic(app: Express) {
  const distPath = path.resolve(__dirname, "public");
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`,
    );
  }

  app.use((req: Request, res: Response, next: NextFunction) => {
    const appType = getAppFromHost(req.hostname);
    (req as any).appType = appType;
    (req as any).appConfig = APP_CONFIG[appType];
    next();
  });

  app.get("/manifest.webmanifest", (req: Request, res: Response) => {
    const appConfig = (req as any).appConfig;
    const manifestPath = path.join(distPath, appConfig.manifest.replace("/", ""));
    
    if (fs.existsSync(manifestPath)) {
      res.setHeader("Content-Type", "application/manifest+json");
      res.sendFile(manifestPath);
    } else {
      res.sendFile(path.join(distPath, "manifest.webmanifest"));
    }
  });

  app.use(express.static(distPath));

  app.use("*", (req: Request, res: Response) => {
    const appConfig = (req as any).appConfig;
    const indexPath = path.resolve(distPath, "index.html");
    
    fs.readFile(indexPath, "utf8", (err, html) => {
      if (err) {
        res.status(500).send("Error loading page");
        return;
      }
      
      let modifiedHtml = html
        .replace(/<title>.*?<\/title>/, `<title>${appConfig.title}</title>`)
        .replace(/content="DarkWave Chain[^"]*"/g, `content="${appConfig.title}"`)
        .replace(/<meta name="theme-color" content="[^"]*"/, `<meta name="theme-color" content="${appConfig.themeColor}"`)
        .replace(/<meta name="description" content="[^"]*"/, `<meta name="description" content="${appConfig.description}"`)
        .replace(/href="\/manifest\.webmanifest"/, `href="${appConfig.manifest}"`);
      
      res.send(modifiedHtml);
    });
  });
}
